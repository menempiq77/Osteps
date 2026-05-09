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

  const prompt = `Read these answered exam paper images for the teacher. They show the PDF questions plus the student's typed text, handwriting, circles, ticks, crosses, and pen marks.\n\nTitle: ${body.title || "Assessment"}\nSubject: ${body.subject || "Unknown"}\n\nReturn a concise but complete extraction. For every visible question, state:\n- question number and short question text\n- student's exact answer/selection/handwriting\n- if an MCQ/True-False option is circled/ticked/underlined, state the selected option text\n- if handwriting is unclear, write [unclear] only for the unclear words\n\nDo not mark yet. Do not invent. Return only the extracted student answer evidence, page by page.`;

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
