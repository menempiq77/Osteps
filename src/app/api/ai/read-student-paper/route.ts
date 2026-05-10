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

const normalizeEvidenceText = (value: string) =>
  String(value || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 9000);

const mergeEvidenceText = (primary: string, secondary: string) => {
  const lines = [...normalizeEvidenceText(primary).split("\n"), ...normalizeEvidenceText(secondary).split("\n")]
    .map((line) => line.trim())
    .filter(Boolean);

  return Array.from(new Set(lines)).join("\n").slice(0, 9000);
};

const enhanceForOcr = async (inputPath: string) => {
  const outputPath = `${inputPath}.enhanced.png`;
  try {
    await execFileAsync(
      "convert",
      [
        inputPath,
        "-resize", "200%",
        "-colorspace", "Gray",
        "-contrast-stretch", "1%x1%",
        "-normalize",
        "-despeckle",
        "-sharpen", "0x1.4",
        outputPath,
      ],
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
      for (const psm of ["6", "4", "11", "12"]) {
        try {
          const { stdout } = await execFileAsync(
            "tesseract",
            [enhancedPath, "stdout", "-l", "eng+ara", "--oem", "3", "--dpi", "200", "--psm", psm],
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

  const prompt = `You are reading a student's answered exam paper. Extract ONLY the student's answers — ignore everything else.

Title: ${body.title || "Assessment"}
Subject: ${body.subject || "Unknown"}

*** HEADER ZONE RULE (apply first, before anything else) ***
The TOP ~15% of the first page is a HEADER ZONE containing the student's Name, Class, Date, and similar administrative fields. THIS ZONE MUST BE COMPLETELY IGNORED. Do not output anything about content you see in this zone, even if it appears as a neatly-typed or handwritten text box.

THE PAGE CONTAINS TWO TYPES OF STUDENT ANSWER (below the header zone only):
(A) TYPED TEXT BOXES — appear as clean, modern-font text (like Arial/Times) sitting ON TOP of the printed PDF. These are answers the student typed digitally. They may appear anywhere on the page below the header zone.
(B) HANDWRITING / PEN MARKS — appear as freehand pen strokes, circles, loops, ticks, or crosses drawn by hand. These show MCQ selections or handwritten answers.

CRITICAL READING RULES:
1. IGNORE the printed PDF background text (question text, option labels a/b/c/d, headers, instructions). Only extract STUDENT-ADDED content.
2. ABSOLUTE RULE: NEVER output a student name, class name, date, school name, or teacher name — not even as a "[Typed near Q1]" entry. If a typed box contains only a person's name or a date, skip it entirely.
3. TYPED TEXT BOX answers (below the header zone): for each, output — "[Typed near Q{N}]: {full text}" where N is your best guess at which question it answers based on its vertical position on the page.
4. MCQ circles/ticks: a pen circle/oval/loop around option (a), (b), (c), or (d) text means that option is SELECTED. Output — "Q{N}: selected option ({letter}) {full option text}"
5. HANDWRITTEN text answers: transcribe them near the question they appear under. Use [unclear] only for truly illegible words.
6. If no student answer is visible for a question, output — "Q{N}: no answer visible"

OUTPUT EXAMPLE (follow this format exactly):
[Typed near Q3]: Ten year truce between the two, with the Muslims
[Typed near Q3]: if a member of Quraysh went to Medina without permission, they have to return back
Q1: selected option (a) You pray full salah
Q2: selected option (c) You shorten and combine
Q4: no answer visible

Return evidence only. Do not mark. Do not give scores.`;

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
        const content = normalizeEvidenceText(String(json?.choices?.[0]?.message?.content || ""));
        if (content.length > 20) {
          const ocrText = await readWithLocalOcr(pageImages, pageNumbers).catch(() => "");
          const mergedText = ocrText ? mergeEvidenceText(content, ocrText) : content;
          return NextResponse.json({ text: mergedText, source: ocrText ? "vision+ocr" : "vision" });
        }
      }
    } catch {
      clearTimeout(timeoutHandle);
      // local OCR fallback below
    }
  }

  const text = await readWithLocalOcr(pageImages, pageNumbers).catch(() => "");
  return NextResponse.json({ text, source: text ? "ocr" : "none" });
}
