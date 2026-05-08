import { promises as fs } from "fs";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DraftMarkRequest = {
  assessmentId?: string | number;
  taskId?: string | number;
  studentId?: string | number;
  studentName?: string;
  title?: string;
  subjectName?: string;
  fileUrl?: string;
  maxMarks?: number | null;
  studentAnnotations?: Array<Record<string, unknown>>;
  pageImages?: string[];
  currentTeacherMarks?: string;
  currentTeacherFeedback?: string;
};

type DraftMarkResponse = {
  suggestedMark: number | null;
  feedback: string;
  rationale: string;
  confidence: "low" | "medium" | "high";
  sourcePolicy: string;
  warnings: string[];
};

type VisualAnswerContext = {
  questionFocus: string;
  studentAnswerSummary: string;
  visibleMistakes: string[];
  legibility: "low" | "medium" | "high";
};

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OSTEPS_AI_MARKING_MODEL || process.env.OLLAMA_MODEL || "deepseek-r1:1.5b";
const OLLAMA_FAST_FALLBACK_MODEL = process.env.OSTEPS_AI_MARKING_FAST_MODEL || "qwen2.5:0.5b";
const OLLAMA_VISION_MODEL = process.env.OSTEPS_AI_MARKING_VISION_MODEL || "";
const OLLAMA_KEEP_ALIVE = process.env.OSTEPS_AI_MARKING_KEEP_ALIVE || "0s";
const OLLAMA_ENABLE_REASONER = process.env.OSTEPS_AI_MARKING_USE_REASONER === "1";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "qwen/qwen2.5-vl-72b-instruct:free";
const REQUEST_TIMEOUT_MS = Number(process.env.OSTEPS_AI_MARKING_TIMEOUT_MS || 50000);
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const PAPER_TEXT_CACHE_MS = 10 * 60 * 1000;
const LOCAL_OCR_FOCUS = "Local OCR text from answered-page image";

const paperTextCache = new Map<string, { pages: Array<{ num: number; text: string }>; cachedAt: number }>();
const execFileAsync = promisify(execFile);

const jsonResponse = (payload: unknown, status = 200) => NextResponse.json(payload, { status });

const asText = (value: unknown) => String(value ?? "").trim();

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const isIslamicSubject = (subjectName: string, title: string) =>
  /islam|qur.?an|hadee|hadith|fiqh|aqeed|aqid|seerah|sunnah|tafsir/i.test(`${subjectName} ${title}`);

const normalizeDocumentUrl = (value: string | null | undefined) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  try {
    const url = new URL(rawValue);
    url.hash = "";
    return url.toString();
  } catch {
    return rawValue.replace(/#.*$/, "");
  }
};

const isLikelyDateText = (value: string) =>
  /^\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,\s+\d{4}$/i.test(value) ||
  /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(value);

const isLikelyNonAnswerText = (value: string, studentName?: string) => {
  const normalized = normalizeWhitespace(value);
  const lower = normalized.toLowerCase();
  const normalizedStudentName = normalizeWhitespace(asText(studentName));

  if (!normalized) return true;
  if (normalizedStudentName && normalized === normalizedStudentName) return true;
  if (isLikelyDateText(normalized)) return true;
  if (lower.startsWith("predicted grade:")) return true;
  if (lower.startsWith("predicted mark:")) return true;
  if (lower.startsWith("self assessment:")) return true;

  return false;
};

const summarizeLongText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  const headLength = Math.max(0, Math.floor(maxLength * 0.72));
  const tailLength = Math.max(0, maxLength - headLength - 56);
  return `${value.slice(0, headLength)}\n[...middle omitted for speed...]\n${value.slice(-tailLength)}`;
};

const normalizeImagePayload = (value: unknown) => {
  const text = asText(value);
  if (!text) return "";

  const dataUrlMatch = text.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/i);
  return dataUrlMatch ? dataUrlMatch[1] : text;
};

const hasConfiguredVisionProvider = () => Boolean(GROQ_API_KEY || OPENROUTER_API_KEY || OLLAMA_VISION_MODEL);

const annotationsContainPenStrokes = (
  annotations: Array<Record<string, unknown>> | undefined
) =>
  (annotations || []).some(
    (annotation) => asText((annotation as Record<string, unknown>)?.type).toLowerCase() === "pen"
  );

const compactStudentText = (
  annotations: Array<Record<string, unknown>> | undefined,
  studentName?: string
) => {
  const textItems = (annotations || [])
    .filter((annotation) => annotation?.type === "text")
    .map((annotation) => ({
      page: Number(annotation.page || 1),
      text: asText(annotation.text),
    }))
    .filter(
      (annotation) =>
        annotation.text.length > 0 && !isLikelyNonAnswerText(annotation.text, studentName)
    )
    .sort((left, right) => left.page - right.page);

  const combined = textItems
    .map((annotation) => `[Page ${annotation.page}] ${annotation.text}`)
    .join("\n");

  return summarizeLongText(combined, 1600);
};

const extractAnsweredPages = (annotations: Array<Record<string, unknown>> | undefined) => {
  const pages = new Set<number>();
  for (const annotation of annotations || []) {
    const page = Number(annotation?.page || 0);
    if (Number.isFinite(page) && page > 0) pages.add(page);
  }
  return Array.from(pages).sort((left, right) => left - right);
};

const loadPdfParse = async () => import("pdf-parse");

const extractPaperPagesWithPdftotext = async (localPath: string) => {
  try {
    const { stdout } = await execFileAsync("pdftotext", ["-layout", "-enc", "UTF-8", localPath, "-"], {
      maxBuffer: 4 * 1024 * 1024,
      timeout: 9000,
    });
    return String(stdout || "")
      .split("\f")
      .map((text, index) => ({
        num: index + 1,
        text: normalizeWhitespace(text),
      }))
      .filter((page) => page.text.length > 0);
  } catch (error) {
    console.error("pdftotext could not extract exam paper text:", error);
    return [];
  }
};

const resolveLocalPaperPath = (normalizedUrl: string) => {
  if (!normalizedUrl) return null;
  try {
    const sourceUrl = new URL(normalizedUrl);
    if (!new Set(["dashboard.osteps.com", "osteps.com", "www.osteps.com", "localhost", "127.0.0.1"]).has(sourceUrl.hostname)) {
      return null;
    }
    if (!sourceUrl.pathname.startsWith("/storage/")) return null;
    return path.join(LARAVEL_PUBLIC_DIR, sourceUrl.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
};

const getPaperPages = async (normalizedUrl: string) => {
  const cached = paperTextCache.get(normalizedUrl);
  if (cached && Date.now() - cached.cachedAt < PAPER_TEXT_CACHE_MS) {
    return cached.pages;
  }

  const localPath = resolveLocalPaperPath(normalizedUrl);
  if (localPath) {
    const pages = await extractPaperPagesWithPdftotext(localPath);
    if (pages.length > 0) {
      paperTextCache.set(normalizedUrl, { pages, cachedAt: Date.now() });
      return pages;
    }
  }

  let pdfBuffer: Buffer;
  if (localPath) {
    pdfBuffer = await fs.readFile(localPath);
  } else {
    const response = await fetch(normalizedUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load exam paper (${response.status})`);
    }
    pdfBuffer = Buffer.from(await response.arrayBuffer());
  }

  const { PDFParse } = await loadPdfParse();
  const parser = new PDFParse({ data: pdfBuffer });
  try {
    const parsed = await parser.getText();
    const pages = Array.isArray(parsed?.pages)
      ? parsed.pages
          .map((page) => ({
            num: Number(page?.num || 0),
            text: normalizeWhitespace(asText(page?.text)),
          }))
          .filter((page) => page.num > 0 && page.text.length > 0)
      : [];
    paperTextCache.set(normalizedUrl, { pages, cachedAt: Date.now() });
    return pages;
  } finally {
    await parser.destroy();
  }
};

const buildPaperContext = async (fileUrl: string | undefined, preferredPages: number[]) => {
  const normalizedUrl = normalizeDocumentUrl(fileUrl);
  if (!normalizedUrl) return "";

  const pages = await getPaperPages(normalizedUrl);
  if (pages.length === 0) return "";

  const relevantPages =
    preferredPages.length > 0
      ? pages.filter((page) => preferredPages.includes(page.num))
      : pages;
  const selectedPages = relevantPages.length > 0 ? relevantPages : pages;
  const combined = selectedPages
    .map((page) => `[Exam paper page ${page.num}] ${page.text}`)
    .join("\n\n");

  return summarizeLongText(combined, 2800);
};

const extractFirstJsonObject = (raw: string) => {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  let depth = 0;
  let inString = false;
  let escaped = false;
  let start = -1;

  for (let index = 0; index < cleaned.length; index += 1) {
    const char = cleaned[index];

    if (start === -1) {
      if (char === "{") {
        start = index;
        depth = 1;
      }
      continue;
    }

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) return cleaned.slice(start, index + 1);
  }

  return null;
};

const responseImpliesUnreadable = (raw: Partial<DraftMarkResponse>) => {
  const text = `${asText(raw.feedback)} ${asText(raw.rationale)}`.toLowerCase();
  return [
    "unreadable",
    "not readable",
    "cannot be read",
    "could not be read",
    "no readable student answer",
    "answer is missing from the provided text",
    "answer is missing from the provided text and image",
    "answer is missing from the provided text and images",
    "cannot be assessed based on the given information",
    "cannot be assessed from the supplied paper and answer text",
  ].some((value) => text.includes(value));
};

const responseClaimsNoAnswer = (raw: Partial<DraftMarkResponse>) => {
  const text = `${asText(raw.feedback)} ${asText(raw.rationale)}`.toLowerCase();
  return /(?:no answer provided|answer is missing|without an actual typed response|no typed response|no student answer)/i.test(
    text
  );
};

const repairContradictoryAnswerEvidence = (
  raw: Partial<DraftMarkResponse>,
  hasReadableAnswerEvidence: boolean
) => {
  if (!hasReadableAnswerEvidence || !responseClaimsNoAnswer(raw)) return raw;

  return {
    ...raw,
    feedback:
      "WWW: The submitted answer includes readable evidence for the teacher to assess.\nEBI: Add the exact missing point or correction required by the exam question.",
    rationale:
      "Readable answer evidence was supplied, so the draft was corrected away from a no-answer response.",
    confidence: "low" as const,
    warnings: [
      ...(Array.isArray(raw.warnings) ? raw.warnings : []),
      "AI response was corrected because readable answer evidence was supplied.",
    ],
  };
};

const splitFeedbackSentences = (value: string) =>
  normalizeWhitespace(value)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

const stripFeedbackLabel = (value: string) =>
  value.replace(/^(?:www|ebi|even better if|what went well)\s*[:\-]\s*/i, "").trim();

const containsPromptPlaceholder = (value: string) =>
  /(no reliable image reading available|no separate typed annotation text was found|use the supplied answered-page images if available|no answered-page image reading was used for this request)/i.test(
    value
  );

const ensureSentenceEnding = (value: string) => {
  const normalized = stripFeedbackLabel(value).replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
};

const normalizeTeacherFeedback = (value: string) => {
  const normalized = asText(value);
  if (!normalized) return "";

  const lines = normalized
    .split(/\r?\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  let whatWentWell = "";
  let evenBetterIf = "";

  for (const line of lines) {
    if (!whatWentWell && /^www\s*[:\-]/i.test(line)) {
      whatWentWell = stripFeedbackLabel(line);
      continue;
    }
    if (!evenBetterIf && /^(?:ebi|even better if)\s*[:\-]/i.test(line)) {
      evenBetterIf = stripFeedbackLabel(line);
    }
  }

  const sentences = splitFeedbackSentences(normalized);
  if (!whatWentWell) whatWentWell = sentences[0] || normalized;
  if (!evenBetterIf) evenBetterIf = sentences[1] || "Add the specific missing point or correction from the paper to improve the answer";

  if (containsPromptPlaceholder(whatWentWell)) {
    whatWentWell = "A clear strength could not be confirmed from the readable answer evidence";
  }
  if (containsPromptPlaceholder(evenBetterIf)) {
    evenBetterIf = "State the exact answer point from the paper more clearly and match the wording of the question";
  }

  return `WWW: ${ensureSentenceEnding(whatWentWell)}\nEBI: ${ensureSentenceEnding(evenBetterIf)}`;
};

const estimateFallbackSuggestedMark = (
  raw: Partial<DraftMarkResponse>,
  maxMarks: number | null
) => {
  if (maxMarks == null || maxMarks <= 0) return null;

  if (responseImpliesUnreadable(raw)) return null;

  const text = `${asText(raw.feedback)} ${asText(raw.rationale)}`.toLowerCase();
  const includesAny = (values: string[]) => values.some((value) => text.includes(value));

  if (
    includesAny([
      "timed out",
      "time limit",
      "mark manually",
      "local model",
      "unreadable response",
      "no readable student answer",
      "could not finish quickly enough",
      "could not produce useful feedback",
      "did not return valid json",
      "unavailable",
    ])
  ) {
    return null;
  }

  let ratio: number | null = null;

  if (
    includesAny([
      "fully correct",
      "completely correct",
      "accurate and complete",
      "meets all criteria",
      "all criteria",
      "full marks",
    ])
  ) {
    ratio = 1;
  } else if (
    includesAny([
      "mostly correct",
      "largely correct",
      "good understanding",
      "minor improvements",
      "minor errors",
      "detailed and accurate",
    ])
  ) {
    ratio = 0.85;
  } else if (
    includesAny([
      "partially correct",
      "lacks detail",
      "missing some details",
      "needs improvement",
      "needs more detail",
      "some parts need improvement",
      "more detailed",
    ])
  ) {
    ratio = 0.6;
  } else if (
    includesAny([
      "incomplete",
      "limited understanding",
      "unclear",
      "vague",
      "several errors",
      "lacks context",
    ])
  ) {
    ratio = 0.4;
  } else if (
    includesAny([
      "incorrect",
      "wrong",
      "insufficient",
      "irrelevant",
      "cannot be assessed",
      "does not answer",
    ])
  ) {
    ratio = 0.2;
  }

  if (ratio == null) {
    ratio = raw.confidence === "high" ? 0.8 : raw.confidence === "medium" ? 0.6 : 0.45;
  }

  return Math.max(0, Math.min(maxMarks, Math.round(maxMarks * ratio)));
};

const requestOllamaDraft = async ({
  model,
  prompt,
  signal,
  images,
  options,
  timeoutMs,
}: {
  model: string;
  prompt: string;
  signal?: AbortSignal;
  images?: string[];
  options?: Record<string, unknown>;
  timeoutMs?: number;
}) => {
  const timeoutController = new AbortController();
  const timeoutHandle = setTimeout(
    () => timeoutController.abort(),
    timeoutMs ?? REQUEST_TIMEOUT_MS
  );
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal;

  let ollamaResponse: Response;
  try {
    ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        images: images && images.length > 0 ? images : undefined,
        stream: false,
        format: "json",
        keep_alive: OLLAMA_KEEP_ALIVE,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          num_predict: 140,
          num_ctx: images && images.length > 0 ? 6144 : 4096,
          ...(options || {}),
        },
      }),
      signal: requestSignal,
    });
  } catch (error) {
    clearTimeout(timeoutHandle);
    throw error;
  }

  if (!ollamaResponse.ok) {
    const errorText = await ollamaResponse.text().catch(() => "");
    clearTimeout(timeoutHandle);
    throw new Error(`Local Ollama AI marker ${model} failed (${ollamaResponse.status}). ${errorText}`.trim());
  }

  try {
    return (await ollamaResponse.json()) as { response?: string };
  } finally {
    clearTimeout(timeoutHandle);
  }
};

const normalizeVisualAnswerContext = (
  raw: Partial<VisualAnswerContext>
): VisualAnswerContext => ({
  questionFocus: asText(raw.questionFocus).slice(0, 300),
  studentAnswerSummary: asText(raw.studentAnswerSummary).slice(0, 1200),
  visibleMistakes: Array.isArray(raw.visibleMistakes)
    ? raw.visibleMistakes.map(asText).filter(Boolean).slice(0, 6)
    : [],
  legibility: raw.legibility === "high" || raw.legibility === "medium" ? raw.legibility : "low",
});

const extractCloudJsonContent = (payload: unknown) => {
  const data = payload as { choices?: Array<{ message?: { content?: unknown } }> };
  const content = data?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        typeof part === "object" && part && "text" in part
          ? asText((part as { text?: unknown }).text)
          : asText(part)
      )
      .filter(Boolean)
      .join("\n");
  }
  return asText(content);
};

const requestCloudVisualAnswerContext = async ({
  provider,
  apiKey,
  model,
  prompt,
  pageImages,
}: {
  provider: "groq" | "openrouter";
  apiKey: string;
  model: string;
  prompt: string;
  pageImages: string[];
}) => {
  if (!apiKey || pageImages.length === 0) return null;

  const timeoutController = new AbortController();
  const timeoutHandle = setTimeout(() => timeoutController.abort(), 18000);
  const endpoint =
    provider === "groq"
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://openrouter.ai/api/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(provider === "openrouter"
          ? {
              "HTTP-Referer": "https://www.osteps.com",
              "X-Title": "OSTEPS AI Draft Mark",
            }
          : {}),
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: 220,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...pageImages.slice(0, 2).map((image) => ({
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${image}` },
              })),
            ],
          },
        ],
      }),
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`${provider} vision failed (${response.status}). ${text.slice(0, 240)}`);
    }

    const content = extractCloudJsonContent(await response.json());
    const rawJson = extractFirstJsonObject(content);
    if (!rawJson) return null;
    return normalizeVisualAnswerContext(JSON.parse(rawJson) as Partial<VisualAnswerContext>);
  } finally {
    clearTimeout(timeoutHandle);
  }
};

// Preprocess an image with ImageMagick for better Tesseract OCR accuracy.
// Converts to grayscale, normalises contrast, and sharpens edges.
// Returns the enhanced image path; falls back to the original on any error.
const enhanceImageForOcr = async (inputPath: string): Promise<string> => {
  const outputPath = `${inputPath}.enhanced.png`;
  try {
    await execFileAsync(
      "convert",
      [
        inputPath,
        "-colorspace", "Gray",
        "-normalize",
        "-sharpen", "0x1.5",
        outputPath,
      ],
      { timeout: 7000 }
    );
    return outputPath;
  } catch {
    return inputPath;
  }
};

const extractLocalOcrAnswerContext = async (pageImages: string[]) => {
  const ocrPages: string[] = [];

  for (const [index, image] of pageImages.slice(0, 2).entries()) {
    const tempPath = path.join(
      "/tmp",
      `osteps-ai-ocr-${process.pid}-${Date.now()}-${index}.png`
    );
    let enhancedPath = "";
    try {
      await fs.writeFile(tempPath, Buffer.from(image, "base64"));
      enhancedPath = await enhanceImageForOcr(tempPath);
      const ocrAttempts: string[] = [];
      for (const pageSegmentationMode of ["6", "11"]) {
        try {
          const { stdout } = await execFileAsync(
            "tesseract",
            [
              enhancedPath,
              "stdout",
              "-l", "eng+ara",
              "--oem", "3",
              "--dpi", "150",
              "--psm", pageSegmentationMode,
            ],
            { maxBuffer: 1024 * 1024, timeout: 10000 }
          );
          ocrAttempts.push(normalizeWhitespace(String(stdout || "")));
        } catch (error) {
          console.error(`Local OCR psm ${pageSegmentationMode} could not read answered-page image:`, error);
        }
      }
      const text = ocrAttempts.sort((left, right) => right.length - left.length)[0] || "";
      if (text.length >= 12) {
        ocrPages.push(`[Answered page image ${index + 1} OCR] ${text}`);
      }
    } catch (error) {
      console.error("Local OCR could not read answered-page image:", error);
    } finally {
      await fs.unlink(tempPath).catch(() => undefined);
      if (enhancedPath && enhancedPath !== tempPath) {
        await fs.unlink(enhancedPath).catch(() => undefined);
      }
    }
  }

  if (ocrPages.length === 0) return null;

  return normalizeVisualAnswerContext({
    questionFocus: LOCAL_OCR_FOCUS,
    studentAnswerSummary: summarizeLongText(ocrPages.join("\n"), 1200),
    visibleMistakes: [],
    legibility: "low",
  });
};

const extractVisualAnswerContext = async ({
  title,
  subjectName,
  pageImages,
}: {
  title: string;
  subjectName: string;
  pageImages: string[];
}) => {
  if (pageImages.length === 0) return null;

  const prompt = `OSTEPS answered-page reader. Return strict JSON only.

Read the supplied answered-page images. They show the exam paper and the student's written answers on the paper. Do not grade yet. Ignore names, dates, toolbars, UI labels, marks, and warnings.

Title: ${title}
Subject: ${subjectName}

Return exactly:
{
  "questionFocus": "question/part being answered in 25 words max",
  "studentAnswerSummary": "faithful transcription or concise paraphrase of what the student wrote in 140 words max; if unreadable say Unreadable.",
  "visibleMistakes": ["specific wrong or missing points visible in the student's answer"],
  "legibility": "low" | "medium" | "high"
}`;

  for (const cloudAttempt of [
    { provider: "groq" as const, apiKey: GROQ_API_KEY, model: GROQ_VISION_MODEL },
    { provider: "openrouter" as const, apiKey: OPENROUTER_API_KEY, model: OPENROUTER_VISION_MODEL },
  ]) {
    if (!cloudAttempt.apiKey) continue;
    try {
      const context = await requestCloudVisualAnswerContext({
        ...cloudAttempt,
        prompt,
        pageImages,
      });
      if (context) return context;
    } catch (error) {
      console.error(`${cloudAttempt.provider} answered-page image reading failed:`, error);
    }
  }

  const ocrContext = await extractLocalOcrAnswerContext(pageImages);
  if (ocrContext) return ocrContext;

  if (!OLLAMA_VISION_MODEL) return null;

  const visualPayload = await requestOllamaDraft({
    model: OLLAMA_VISION_MODEL,
    prompt,
    images: pageImages,
    options: {
      num_predict: 110,
      num_ctx: 4096,
    },
    timeoutMs: 14000,
  });

  const rawJson = extractFirstJsonObject(String(visualPayload.response || ""));
  if (!rawJson) return null;

  return normalizeVisualAnswerContext(JSON.parse(rawJson) as Partial<VisualAnswerContext>);
};

const alignMarkWithFeedback = (
  numericMark: number | null,
  fallbackMark: number | null,
  raw: Partial<DraftMarkResponse>,
  maxMarks: number | null
) => {
  if (numericMark == null || maxMarks == null || maxMarks <= 0) return numericMark;
  if (responseImpliesUnreadable(raw)) return null;

  const text = `${asText(raw.feedback)} ${asText(raw.rationale)}`.toLowerCase();
  const soundsFullyCorrect = /(fully correct|completely correct|accurate and complete|meets all criteria|full marks|no material mistakes|no mistakes)/i.test(text);
  const soundsIncomplete = /(partially correct|missing|needs improvement|unclear|vague|incorrect|wrong|lacks detail|minor errors|some points? missing|incomplete)/i.test(text);

  if (numericMark >= maxMarks && soundsIncomplete && fallbackMark != null && fallbackMark < maxMarks) {
    return fallbackMark;
  }

  if (numericMark < maxMarks && soundsFullyCorrect) {
    return maxMarks;
  }

  return numericMark;
};

const normalizeDraft = (
  raw: Partial<DraftMarkResponse>,
  maxMarks: number | null,
  sourcePolicy: string
): DraftMarkResponse => {
  const numericMark = raw.suggestedMark == null ? null : Number(raw.suggestedMark);
  const fallbackMark = estimateFallbackSuggestedMark(raw, maxMarks);
  const consistentNumericMark = Number.isFinite(numericMark)
    ? alignMarkWithFeedback(
        Math.max(0, maxMarks == null ? numericMark : Math.min(maxMarks, numericMark)),
        fallbackMark,
        raw,
        maxMarks
      )
    : null;
  const clampedMark = Number.isFinite(consistentNumericMark)
    ? consistentNumericMark
    : fallbackMark;
  const confidence = raw.confidence === "high" || raw.confidence === "medium" ? raw.confidence : "low";
  const warnings = Array.isArray(raw.warnings)
    ? raw.warnings
        .map(asText)
        .filter(
          (value) =>
            value &&
            !/short warning strings if needed/i.test(value) &&
            !/^(?:none|n\/a|no warnings needed\.?|no warning needed\.?)$/i.test(value) &&
            !/(fully correct|partially correct|award full marks|suggested mark should|student answer is)/i.test(value)
        )
        .slice(0, 6)
    : [];

  return {
    suggestedMark: clampedMark,
    feedback:
      normalizeTeacherFeedback(asText(raw.feedback)).slice(0, 1500) ||
      "WWW: AI could not identify a reliable strength from the supplied evidence.\nEBI: Please review the paper manually.",
    rationale:
      asText(raw.rationale).slice(0, 1500) ||
      "Fair judgment could not be confirmed from the returned model response.",
    confidence,
    sourcePolicy,
    warnings,
  };
};

export async function POST(request: Request) {
  let body: DraftMarkRequest;
  try {
    body = (await request.json()) as DraftMarkRequest;
  } catch {
    return jsonResponse({ message: "Invalid AI marking request." }, 400);
  }

  const title = asText(body.title) || "Assessment task";
  const subjectName = asText(body.subjectName) || "Unknown subject";
  const maxMarks = Number.isFinite(Number(body.maxMarks)) ? Number(body.maxMarks) : null;
  const studentText = compactStudentText(body.studentAnnotations, body.studentName);
  const answeredPages = extractAnsweredPages(body.studentAnnotations);
  const pageImages = Array.isArray(body.pageImages)
    ? body.pageImages.map(normalizeImagePayload).filter(Boolean).slice(0, 4)
    : [];
  const hasPenStrokes = annotationsContainPenStrokes(body.studentAnnotations);
  const islamic = isIslamicSubject(subjectName, title);
  const sourcePolicy = islamic
    ? "Islamic subject: use only the supplied assessment context and approved OSTEPS/Sunni school resources. Do not use external web knowledge. If evidence is missing, say so."
    : "Non-Islamic subject: draft a teacher-reviewed mark from the submitted answer and normal curriculum knowledge. Do not invent unseen evidence.";

  let paperContext = "";
  try {
    paperContext = await buildPaperContext(body.fileUrl, answeredPages);
  } catch (error) {
    console.error("Could not extract exam paper text for AI marking:", error);
  }

  const promptPaperContext = summarizeLongText(
    paperContext,
    pageImages.length > 0 || hasPenStrokes ? 1200 : 1400
  );

  const shouldPreferFastModel =
    pageImages.length > 0 || hasPenStrokes || promptPaperContext.length > 2200;
  const shouldAttemptReasoner =
    OLLAMA_ENABLE_REASONER &&
    !shouldPreferFastModel &&
    studentText.length > 0 &&
    promptPaperContext.length > 0;

  if (!studentText && !paperContext && pageImages.length === 0) {
    return jsonResponse({
      suggestedMark: null,
      feedback: "WWW: The paper was received by the system.\nEBI: No readable student answer was found, so please mark manually or add clearer writing.",
      rationale: "The request contained no usable answer text for assessment.",
      confidence: "low",
      sourcePolicy,
      warnings: ["No readable student answer text found."],
    } satisfies DraftMarkResponse);
  }

  let visualContext: VisualAnswerContext | null = null;
  let visualWarning = "";

  if (pageImages.length > 0 && (hasPenStrokes || !studentText)) {
    try {
      visualContext = await extractVisualAnswerContext({
        title,
        subjectName,
        pageImages,
      });
      if (!visualContext) {
        visualWarning = hasConfiguredVisionProvider()
          ? "Could not reliably read the answered-page images; used text-only marking context."
          : "No cloud vision key is configured and local OCR could not read the answered-page images; please mark handwriting manually or add Groq/OpenRouter vision.";
      } else if (visualContext.questionFocus === LOCAL_OCR_FOCUS) {
        visualWarning = hasConfiguredVisionProvider()
          ? "Used local OCR to read the answered-page images; handwriting may be incomplete."
          : "No cloud vision key is configured; used local OCR only, so handwriting accuracy may be limited.";
      }
    } catch (error) {
      console.error("Could not read answered-page images for AI marking:", error);
      visualWarning = "Could not reliably read the answered-page images; used text-only marking context.";
    }
  }

  if (pageImages.length > 0 && (hasPenStrokes || !studentText) && !studentText && !visualContext) {
    return jsonResponse({
      suggestedMark: null,
      feedback:
        "WWW: The exam paper and answered-page image were received.\nEBI: AI could not read the student's handwriting safely on this server; mark manually or add a Groq/OpenRouter vision key for accurate handwriting marking.",
      rationale:
        "No reliable text could be extracted from the handwritten answer, so a fair mark would be a guess.",
      confidence: "low",
      sourcePolicy,
      warnings: [visualWarning || "No reliable handwriting text was extracted from the answered-page images."],
    } satisfies DraftMarkResponse);
  }

  const readableAnswerText = summarizeLongText(
    [studentText, visualContext?.studentAnswerSummary]
      .map(asText)
      .filter(Boolean)
      .join("\n"),
    pageImages.length > 0 || hasPenStrokes ? 900 : 1200
  );

  const prompt = `OSTEPS AI Draft Mark. Return strict JSON only. Draft only; teacher reviews manually. Never call it final. ${sourcePolicy}

Title: ${title}
Subject: ${subjectName}
Student: ${asText(body.studentName) || asText(body.studentId) || "Unknown"}
Max marks: ${maxMarks ?? "Unknown"}

Use the exam paper text and the student's written answer together. Ignore metadata such as student name, date, or predicted/self-assessed grades.
Grade the whole submitted answer across the answered pages, not a single isolated sentence.
If max marks are known and the student's answer is readable, you MUST set suggestedMark to an integer from 0 to ${maxMarks ?? "the maximum marks"}. Do not use null in that case.
If the student's answer is fully correct for the relevant question(s), award full marks. Only use suggestedMark null when the answer cannot be assessed from the supplied paper and answer text.
Judge fairly from the available evidence only. Do not guess hidden writing. If some handwriting is unclear, say exactly what is unclear and mark conservatively.
If marks are lost, feedback must mention the specific wrong answer, missing point, or correction from the paper. Do not use generic comments like "needs improvement" or "lacks clarity" by themselves. If full marks are earned, briefly say there are no material mistakes.
Feedback must be exactly two short lines in this format:
WWW: one specific strength from the answer
EBI: one specific correction, missing point, or improvement from the paper

Exam paper text for the answered pages:
${promptPaperContext || "Exam paper text could not be extracted."}

Student typed answer text extracted from annotations:
${studentText || "No separate typed annotation text was found. Use the supplied answered-page images if available."}

${visualContext ? `Visual reading from answered-page images:
Question focus: ${visualContext.questionFocus}
Student answer seen on the paper: ${visualContext.studentAnswerSummary}
Specific wrong or missing points seen on the paper: ${visualContext.visibleMistakes.join("; ") || "None extracted from the images."}
Image legibility: ${visualContext.legibility}` : pageImages.length > 0 ? "Answered-page images were supplied, but no reliable visual extraction could be confirmed. Use the paper text and any readable typed answer only." : "No answered-page image reading was used for this request."}

Image reading warning: ${visualWarning || "none"}

Keep the two feedback lines concise and concrete. Keep rationale under 35 words. suggestedMark must be an integer when marks are known. Return exactly:
{
  "suggestedMark": integer 0..maxMarks or null only if unreadable,
  "feedback": "WWW: ...\nEBI: ...",
  "rationale": "brief fair-judgment reason for teacher review",
  "confidence": "low" | "medium" | "high",
  "warnings": []
}`;

  // Compact prompt — must fit inside num_ctx=512 tokens total (prompt + generation).
  // Budget: ~200 tokens prompt, ~100 tokens output = well within 512.
  const fastPrompt = `JSON only. Mark this student answer.
Question:${summarizeLongText(promptPaperContext || paperContext || "", 230)}
Answer:${summarizeLongText(readableAnswerText || "No answer text.", 290)}
Marks available:${maxMarks ?? "unknown"}
Return (suggestedMark must be integer 0..${maxMarks ?? "max"}, EBI must name a specific mistake):{"suggestedMark":0,"feedback":"WWW:specific strength.\nEBI:specific mistake or missing point.","rationale":"brief","confidence":"low","warnings":[]}`;

  const markingPrompt = shouldPreferFastModel ? fastPrompt : prompt;

  try {
    const modelWarnings = visualWarning ? [visualWarning] : [];
    let rawJson: string | null = null;

    if (!rawJson) {
      try {
        const fallbackPayload = await requestOllamaDraft({
          model: OLLAMA_FAST_FALLBACK_MODEL,
          prompt: markingPrompt,
          options: {
            num_predict: shouldPreferFastModel ? 110 : 70,
            num_ctx: shouldPreferFastModel ? 512 : 2048,
          },
          timeoutMs: shouldPreferFastModel ? 22000 : 42000,
        });
        rawJson = extractFirstJsonObject(String(fallbackPayload.response || ""));
        if (!rawJson) {
          if (!shouldAttemptReasoner) {
            return jsonResponse(
              normalizeDraft(
                {
                  suggestedMark: null,
                  feedback: String(fallbackPayload.response || "AI returned an unreadable response."),
                  rationale: "The local model did not return valid JSON.",
                  confidence: "low",
                  warnings: [...modelWarnings, "Local model response was not valid JSON."],
                },
                maxMarks,
                sourcePolicy
              )
            );
          }
        }
      } catch (error) {
        const aborted = error instanceof Error && error.name === "AbortError";
        if (aborted) {
          if (!shouldAttemptReasoner) {
            return jsonResponse(
              normalizeDraft(
                {
                  suggestedMark: null,
                  feedback: "WWW: The paper loaded for review.\nEBI: AI Draft Mark could not finish quickly enough, so please try again after the paper loads or mark manually.",
                  rationale: "The local model reached the time limit before returning a safe draft.",
                  confidence: "low",
                  warnings: [...modelWarnings, "Local AI timed out before completing the draft."],
                },
                maxMarks,
                sourcePolicy
              )
            );
          }
        } else if (!shouldAttemptReasoner) {
          return jsonResponse(
            { message: error instanceof Error ? error.message : "Local Ollama AI marker is unavailable. Start Ollama on this server and pull the configured model." },
            503
          );
        }
      }
    }

    if (!rawJson && shouldAttemptReasoner) {
      try {
        const deepseekPayload = await requestOllamaDraft({
          model: OLLAMA_MODEL,
          prompt,
          options: {
            num_predict: 80,
            num_ctx: 3072,
          },
          timeoutMs: 9000,
        });
        rawJson = extractFirstJsonObject(String(deepseekPayload.response || ""));
      } catch (error) {
        console.error("Reasoner refinement attempt did not finish in time:", error);
      }
    }

    if (!rawJson) {
      return jsonResponse(
        normalizeDraft(
          {
            suggestedMark: null,
            feedback: "WWW: The paper loaded for review.\nEBI: AI Draft Mark could not produce a reliable structured draft from this answer, so please review it manually.",
            rationale: "The available model responses were incomplete or unreadable.",
            confidence: "low",
            warnings: [...modelWarnings, shouldAttemptReasoner ? "Fast and reasoner models could not return a reliable draft." : "Local model response was not reliable enough to use."],
          },
          maxMarks,
          sourcePolicy
        )
      );
    }

    const parsed = repairContradictoryAnswerEvidence(
      JSON.parse(rawJson) as Partial<DraftMarkResponse>,
      Boolean(studentText || visualContext?.studentAnswerSummary)
    );
    if (modelWarnings.length > 0) {
      parsed.warnings = [...(Array.isArray(parsed.warnings) ? parsed.warnings : []), ...modelWarnings];
    }
    return jsonResponse(normalizeDraft(parsed, maxMarks, sourcePolicy));
  } catch {
    return jsonResponse(
      { message: "Local Ollama AI marker is unavailable. Start Ollama on this server and pull the configured model." },
      503
    );
  }
}