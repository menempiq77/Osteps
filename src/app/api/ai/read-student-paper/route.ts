import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

export const runtime = "nodejs";
export const maxDuration = 45;

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const execFileAsync = promisify(execFile);

const normalizeImagePayload = (value: unknown) => {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "";
  const dataUrlMatch = text.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/i);
  return dataUrlMatch ? dataUrlMatch[1] : text;
};

const pageLabel = (pageNumbers: number[] | undefined, index: number) => {
  const page = pageNumbers?.[index];
  return page ? `page ${page}` : `image ${index + 1}`;
};

const enhanceForOcr = async (inputPath: string) => {
  const outputPath = `${inputPath}.enhanced.png`;
  try {
    await execFileAsync(
      "convert",
      [inputPath, "-colorspace", "Gray", "-normalize", "-sharpen", "0x1.4", outputPath],
      { timeout: 6000 }
    );
    return outputPath;
  } catch {
    return inputPath;
  }
};

const readWithLocalOcr = async (pageImages: string[], pageNumbers: number[]) => {
  const parts: string[] = [];
  for (const [index, image] of pageImages.slice(0, 8).entries()) {
    const tempPath = path.join("/tmp", `osteps-assistant-ocr-${process.pid}-${Date.now()}-${index}.jpg`);
    let enhancedPath = "";
    try {
      await fs.writeFile(tempPath, Buffer.from(image, "base64"));
      enhancedPath = await enhanceForOcr(tempPath);
      const attempts: string[] = [];
      for (const psm of ["6", "11"]) {
        try {
          const { stdout } = await execFileAsync(
            "tesseract",
            [enhancedPath, "stdout", "-l", "eng+ara", "--oem", "3", "--dpi", "150", "--psm", psm],
            { maxBuffer: 1024 * 1024, timeout: 7000 }
          );
          attempts.push(String(stdout || "").replace(/\s+/g, " ").trim());
        } catch {
          // try next OCR mode
        }
      }
      const best = attempts.sort((a, b) => b.length - a.length)[0] || "";
      if (best.length > 10) parts.push(`[${pageLabel(pageNumbers, index)} OCR] ${best}`);
    } finally {
      await fs.unlink(tempPath).catch(() => undefined);
      if (enhancedPath && enhancedPath !== tempPath) await fs.unlink(enhancedPath).catch(() => undefined);
    }
  }
  return parts.join("\n").slice(0, 9000);
};

export async function POST(req: NextRequest) {
  let body: { title?: string; subject?: string; pageImages?: unknown[]; pageImagePageNumbers?: unknown[] };
  try {
    body = (await req.json()) as { title?: string; subject?: string; pageImages?: unknown[]; pageImagePageNumbers?: unknown[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pageImages = Array.isArray(body.pageImages)
    ? body.pageImages.map(normalizeImagePayload).filter(Boolean).slice(0, 8)
    : [];
  const pageNumbers = Array.isArray(body.pageImagePageNumbers)
    ? body.pageImagePageNumbers.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0).slice(0, pageImages.length)
    : [];

  if (pageImages.length === 0) return NextResponse.json({ text: "" });

  const prompt = `You are an answered-exam visual reader. Your job is ONLY to read the student's answer evidence from the supplied exam page images.\n\nTitle: ${body.title || "Assessment"}\nSubject: ${body.subject || "Unknown"}\n\nCRITICAL READING RULES:\n1. IGNORE all header/name fields: student name, class, date, school name, teacher name, ID, task title, and any standalone name like "Merub", "Ahmed", "Sara". These are NEVER answers. Do not output them.\n2. For MCQ / True-False / choose-the-best-answer questions, the student's answer is the option (a/b/c/d) that is circled, ticked, crossed, underlined, or has any pen mark on/around it.\n3. A hand-drawn oval/circle/loop around an option's letter or text means SELECTED ANSWER. It is not decoration. Look carefully for thin pen strokes around option letters (a), (b), (c), (d).\n4. Output format MUST be exactly: "Q[number]: selected option (a) [full option text]". Example: "Q1: selected option (a) You pray full salah".\n5. NEVER output a person's name as the answer to a question. If you only see a name and no circled option, write "Q[number]: no selection visible".\n6. For short-answer handwriting/text boxes, transcribe the answer near that question. If partly unclear, use [unclear] only for unclear words.\n7. If a question has no visible mark/circle/handwriting, write: "Q[number]: no answer visible".\n\nGood example output:\nQ1: selected option (a) You pray full salah\nQ2: selected option (c) You shorten and combine\nQ3: written answer: Yes, because the journey is long\nQ4: no selection visible\n\nBad example (NEVER do this):\nQ1: Merub        ← WRONG, this is the student's name from header, not an answer\n\nReturn concise evidence only, page by page. Do not mark. Do not give scores. Do not include headers or names.`;

  if (GROQ_API_KEY) {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), 26000);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_VISION_MODEL,
          temperature: 0.1,
          max_tokens: 2500,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                ...pageImages.slice(0, 6).flatMap((image, index) => [
                  { type: "text", text: `Answered ${pageLabel(pageNumbers, index)}:` },
                  { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } },
                ]),
              ],
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutHandle);

      if (response.ok) {
        const json = await response.json();
        const content = String(json?.choices?.[0]?.message?.content || "").replace(/\s+/g, " ").trim();
        if (content.length > 20) return NextResponse.json({ text: content.slice(0, 9000), source: "vision" });
      }
    } catch {
      clearTimeout(timeoutHandle);
      // local OCR fallback below
    }
  }

  const text = await readWithLocalOcr(pageImages, pageNumbers).catch(() => "");
  return NextResponse.json({ text, source: text ? "ocr" : "none" });
}
