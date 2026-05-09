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
  pageImagePageNumbers?: number[];
  currentTeacherMarks?: string;
  currentTeacherFeedback?: string;
};

type QuestionMarkEntry = {
  question: string;
  questionType?: "MCQ" | "TrueFalse" | "FillBlank" | "ShortAnswer" | "Essay" | string;
  studentAnswer: string;
  marksAwarded: number;
  maxMarksForQuestion: number | null;
  reason: string;
};

type DraftMarkResponse = {
  suggestedMark: number | null;
  questionBreakdown?: QuestionMarkEntry[];
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
const OLLAMA_FAST_FALLBACK_MODEL = process.env.OSTEPS_AI_MARKING_FAST_MODEL || "qwen2.5:1.5b";
const OLLAMA_TINY_FALLBACK_MODEL = process.env.OSTEPS_AI_MARKING_TINY_MODEL || "qwen2.5:0.5b";
const OLLAMA_VISION_MODEL = process.env.OSTEPS_AI_MARKING_VISION_MODEL || "granite3.2-vision:2b";
const OLLAMA_KEEP_ALIVE = process.env.OSTEPS_AI_MARKING_KEEP_ALIVE || "5m";
const OLLAMA_ENABLE_REASONER = process.env.OSTEPS_AI_MARKING_USE_REASONER === "1";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const GROQ_TEXT_MODEL = process.env.GROQ_TEXT_MODEL || "llama-3.3-70b-versatile";
// DeepSeek-R1 reasoning model for re-check on low-confidence marks (runs AFTER primary model)
const GROQ_REASONING_MODEL = process.env.GROQ_REASONING_MODEL || "deepseek-r1-distill-llama-70b";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "qwen/qwen2.5-vl-72b-instruct:free";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
const REQUEST_TIMEOUT_MS = Number(process.env.OSTEPS_AI_MARKING_TIMEOUT_MS || 50000);
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const PAPER_TEXT_CACHE_MS = 10 * 60 * 1000;
const LOCAL_OCR_FOCUS = "Local OCR text from answered-page image";

// Strip DeepSeek-R1 <think>...</think> reasoning tags before JSON extraction
const stripReasoningTags = (raw: string): string =>
  raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

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
  // Exact or near-exact match to the known student name
  if (normalizedStudentName && normalized === normalizedStudentName) return true;
  // Contains the full student name as a substring (e.g. "Name: Ahmed Ali")
  if (normalizedStudentName && normalizedStudentName.length > 3 && lower.includes(normalizedStudentName.toLowerCase())) return true;
  if (isLikelyDateText(normalized)) return true;
  if (lower.startsWith("predicted grade:")) return true;
  if (lower.startsWith("predicted mark:")) return true;
  if (lower.startsWith("self assessment:")) return true;
  // Short objective answers are valid answers, not identity/header text.
  if (/^(?:true|false|yes|no|[a-d])$/i.test(normalized)) return false;
  if (/^(?:true|false|yes|no|[a-d])\b[\s,.:;-]/i.test(normalized)) return false;
  // Header/identity labels — "Name:", "Student Name:", "Class:", "Grade:", "ID:", "Roll No:", "Section:", "School:"
  if (/^(?:name|student name|student|class|grade|id|roll\.?\s*no|section|school|teacher|date|subject)\s*[:\-]/i.test(normalized)) return true;
  // Very short text (≤3 words) with no question-answer indicators — likely a name or label, not an answer
  const wordCount = normalized.trim().split(/\s+/).length;
  if (
    wordCount <= 3 &&
    !/[.?!]/.test(normalized) &&
    !/\d/.test(normalized) &&
    !/(?:is|are|was|were|have|has|can|will|should|because|the|a|an|this|that|and|or|but|in|on|at|to|of|for|with|from)\b/i.test(normalized)
  ) {
    return true;
  }

  return false;
};

const summarizeLongText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  const headLength = Math.max(0, Math.floor(maxLength * 0.72));
  const tailLength = Math.max(0, maxLength - headLength - 56);
  return `${value.slice(0, headLength)}\n[...middle omitted for speed...]\n${value.slice(-tailLength)}`;
};

const summarizeEvenly = (items: string[], maxTotalLength: number, separator = "\n\n") => {
  const cleanItems = items.map((item) => item.trim()).filter(Boolean);
  if (cleanItems.length === 0) return "";
  const joined = cleanItems.join(separator);
  if (joined.length <= maxTotalLength) return joined;

  const separatorBudget = separator.length * Math.max(0, cleanItems.length - 1);
  const itemBudget = Math.max(120, Math.floor((maxTotalLength - separatorBudget) / cleanItems.length));
  return cleanItems
    .map((item) => summarizeLongText(item, itemBudget))
    .join(separator);
};

const normalizeImagePayload = (value: unknown) => {
  const text = asText(value);
  if (!text) return "";

  const dataUrlMatch = text.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/i);
  return dataUrlMatch ? dataUrlMatch[1] : text;
};

const pageImageLabel = (pageNumbers: number[] | undefined, index: number) => {
  const pageNumber = pageNumbers?.[index];
  return Number.isFinite(pageNumber) && Number(pageNumber) > 0
    ? `PDF page ${pageNumber}`
    : `answered image ${index + 1}`;
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
      y: Number(annotation.y || 0),
      text: asText(annotation.text),
    }))
    .filter(
      (annotation) =>
        annotation.text.length > 0 && !isLikelyNonAnswerText(annotation.text, studentName)
    )
    .sort((left, right) => left.page - right.page || left.y - right.y);

  const combined = textItems
    .map((annotation) => `[Page ${annotation.page}, y=${Math.round(annotation.y)}] ${annotation.text}`)
    .filter(Boolean);

  return summarizeEvenly(combined, 9000, "\n");
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

// Run pdftotext with the given flags and return per-page text entries.
const runPdftotext = async (localPath: string, useLayout: boolean) => {
  try {
    const args = useLayout
      ? ["-layout", "-enc", "UTF-8", localPath, "-"]
      : ["-enc", "UTF-8", localPath, "-"];
    const { stdout } = await execFileAsync("pdftotext", args, {
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
    console.error(`pdftotext (${useLayout ? "layout" : "plain"}) could not extract exam paper text:`, error);
    return [];
  }
};

const avgTextLength = (pages: Array<{ text: string }>) =>
  pages.length === 0 ? 0 : pages.reduce((s, p) => s + p.text.length, 0) / pages.length;

const extractPaperPagesWithPdftotext = async (localPath: string) => {
  // Always try layout mode first (preserves columns/structure for most PDFs)
  const layoutPages = await runPdftotext(localPath, true);
  if (layoutPages.length > 0 && avgTextLength(layoutPages) >= 60) return layoutPages;

  // For Arabic/RTL papers, -layout scrambles character order. Try plain mode.
  const plainPages = await runPdftotext(localPath, false);
  if (plainPages.length === 0) return layoutPages; // return whatever we got
  if (layoutPages.length === 0) return plainPages;

  // Return whichever extraction gave more text content
  return avgTextLength(plainPages) > avgTextLength(layoutPages) ? plainPages : layoutPages;
};

// Convert up to maxPages of an exam paper PDF to JPEG images using pdftoppm.
// Used when text extraction fails (scanned/image-based PDF).
const extractPaperPagesAsImages = async (
  localPath: string,
  maxPages = 4
): Promise<string[]> => {
  const tmpPrefix = path.join("/tmp", `osteps-exampage-${process.pid}-${Date.now()}`);
  const tmpDir = path.dirname(tmpPrefix);
  const prefixName = path.basename(tmpPrefix);
  const images: string[] = [];

  try {
    await execFileAsync(
      "pdftoppm",
      ["-r", "120", "-jpeg", "-jpegopt", "quality=80", "-l", String(maxPages), localPath, tmpPrefix],
      { timeout: 25000 }
    );

    const allFiles = await fs.readdir(tmpDir);
    const generated = allFiles
      .filter((f) => f.startsWith(prefixName) && (f.endsWith(".jpg") || f.endsWith(".jpeg")))
      .sort()
      .slice(0, maxPages);

    for (const filename of generated) {
      const fullPath = path.join(tmpDir, filename);
      try {
        const data = await fs.readFile(fullPath);
        images.push(data.toString("base64"));
      } catch {
        // skip unreadable file
      } finally {
        await fs.unlink(fullPath).catch(() => undefined);
      }
    }
  } catch (err) {
    console.error("pdftoppm failed for exam paper:", err);
    // Clean up any partial files
    const allFiles = await fs.readdir(tmpDir).catch(() => [] as string[]);
    for (const filename of allFiles.filter((f) => f.startsWith(prefixName))) {
      await fs.unlink(path.join(tmpDir, filename)).catch(() => undefined);
    }
  }

  return images;
};

// Read exam paper questions visually using Groq vision.
// Called when pdftotext returns nothing (scanned PDF, image-only paper, etc.).
const extractPaperQuestionsViaVision = async ({
  localPath,
  title,
  subjectName,
}: {
  localPath: string;
  title: string;
  subjectName: string;
}): Promise<string> => {
  if (!GROQ_API_KEY) return "";

  const images = await extractPaperPagesAsImages(localPath, 5);
  if (images.length === 0) return "";

  const prompt = `You are reading a scanned exam paper. Extract ALL exam questions visible on these pages so an AI assistant can mark the student's answers against them.
Title: ${title}
Subject: ${subjectName}

Instructions:
- List every question, sub-question, and its mark allocation (if shown).
- For True/False, MCQ, matching, or checkbox questions include ALL the answer options so the marker knows what was available.
- Preserve question numbering exactly (Q1, Q1a, Q1b, Q2, etc.)
- If the paper is in Arabic, transcribe in Arabic. Mixed: keep both languages.
- IGNORE: school name, student name/ID fields, date fields, logos, headers, footers, blank answer boxes.

Return only the questions in order, nothing else.`;

  const timeoutController = new AbortController();
  const timeoutHandle = setTimeout(() => timeoutController.abort(), 30000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_VISION_MODEL,
        temperature: 0,
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...images.slice(0, 5).map((img) => ({
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${img}` },
              })),
            ],
          },
        ],
      }),
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Groq vision paper read failed (${response.status}): ${errText.slice(0, 200)}`);
    }

    const rawContent = extractCloudJsonContent(await response.json());
    return normalizeWhitespace(rawContent).slice(0, 8000);
  } catch (err) {
    console.error("Could not read exam paper via vision:", err);
    return "";
  } finally {
    clearTimeout(timeoutHandle);
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
  return summarizeEvenly(
    selectedPages.map((page) => `[Exam paper page ${page.num}] ${page.text}`),
    12000,
    "\n\n"
  );
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
      "Could not produce a reliable deductions-only feedback list because the model incorrectly claimed there was no answer. Teacher review required.",
    rationale:
      "Readable answer evidence was supplied, so the draft was corrected away from a no-answer response.",
    confidence: "low" as const,
    warnings: [
      ...(Array.isArray(raw.warnings) ? raw.warnings : []),
      "AI response was corrected because readable answer evidence was supplied.",
    ],
  };
};

const stripFeedbackLabel = (value: string) =>
  value.replace(/^(?:www|ebi|even better if|what went well)\s*[:\-]\s*/i, "").trim();

const containsPromptPlaceholder = (value: string) =>
  /no reliable image reading available|no separate typed annotation text was found|use the supplied answered-page images if available|no answered-page image reading was used for this request|\[specific (?:strength|mistake|missing point|correction|point)[^\]]*\]|specific (?:strength|mistake|missing point) from (?:the (?:answer|question|paper))|brief reason under \d+ words|add the exact missing point or correction|state the exact answer point/i.test(
    value
  );

const normalizeDeductionsFeedback = (value: string) => {
  const normalized = asText(value)
    .replace(/^www\s*[:\-].*$/gim, "")
    .replace(/^ebi\s*[:\-]\s*/gim, "")
    .replace(/\bWWW\b\s*[:\-]?/gi, "")
    .replace(/\bEBI\b\s*[:\-]?/gi, "")
    .trim();

  if (!normalized || containsPromptPlaceholder(normalized)) {
    return "No deductions list was produced. Please review the per-question deductions below.";
  }

  return normalized;
};

const formatMarkValue = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);

const buildDeductionsFeedback = (
  breakdown: QuestionMarkEntry[],
  suggestedMark: number | null,
  maxMarks: number | null
) => {
  const deductionRows = breakdown.filter((entry) => {
    const maxForQuestion = entry.maxMarksForQuestion;
    return maxForQuestion != null && maxForQuestion > 0 && entry.marksAwarded < maxForQuestion;
  });

  if (deductionRows.length === 0) return "No deductions found.";

  const lines = ["Deductions:"];
  let totalDeductions = 0;
  for (const entry of deductionRows.slice(0, 30)) {
    const lost = Math.max(0, (entry.maxMarksForQuestion ?? 0) - entry.marksAwarded);
    totalDeductions += lost;
    const answer = entry.studentAnswer || "blank / not readable";
    const reason = entry.reason || "answer was wrong or incomplete";
    const markWord = lost === 1 ? "mark" : "marks";
    lines.push(
      `- ${entry.question || "Question"}: student answered "${answer}"; ${reason}; -${formatMarkValue(lost)} ${markWord}.`
    );
  }

  lines.push(`Total deductions: ${formatMarkValue(totalDeductions)}`);
  if (maxMarks != null && maxMarks > 0) {
    const finalMark = suggestedMark != null ? suggestedMark : Math.max(0, maxMarks - totalDeductions);
    lines.push(`Final mark: ${formatMarkValue(finalMark)}/${formatMarkValue(maxMarks)}`);
  }

  return lines.join("\n");
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
  studentAnswerSummary: asText(raw.studentAnswerSummary).slice(0, 5000),
  visibleMistakes: Array.isArray(raw.visibleMistakes)
    ? raw.visibleMistakes.map(asText).filter(Boolean).slice(0, 20)
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
  pageNumbers,
}: {
  provider: "groq" | "openrouter";
  apiKey: string;
  model: string;
  prompt: string;
  pageImages: string[];
  pageNumbers?: number[];
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
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...pageImages.slice(0, provider === "groq" ? 5 : 8).flatMap((image, index) => [
                { type: "text", text: `Answered ${pageImageLabel(pageNumbers, index)}:` },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${image}` },
                },
              ]),
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

const extractLocalOcrAnswerContext = async (pageImages: string[], pageNumbers: number[] = []) => {
  const ocrPages: string[] = [];

  for (const [index, image] of pageImages.slice(0, 12).entries()) {
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
        ocrPages.push(`[Answered ${pageImageLabel(pageNumbers, index)} OCR] ${text}`);
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
    studentAnswerSummary: summarizeLongText(ocrPages.join("\n"), 5000),
    visibleMistakes: [],
    legibility: "low",
  });
};

const extractVisualAnswerContext = async ({
  title,
  subjectName,
  pageImages,
  pageNumbers,
}: {
  title: string;
  subjectName: string;
  pageImages: string[];
  pageNumbers?: number[];
}) => {
  if (pageImages.length === 0) return null;

  const prompt = `OSTEPS answered-page reader. Return strict JSON only.

Read the supplied answered-page images. They show the exam paper and the student's written answers.
IGNORE: student name, student ID, class, teacher name, date, school name, predicted grade, any header fields.

Title: ${title}
Subject: ${subjectName}

MCQ / TRUE-FALSE / CHECKBOX READING RULES (critical for accuracy):
1. For EVERY MCQ/T-F/checkbox/fill-blank question visible on the paper:
   - State exactly which option the student circled, underlined, ticked, crossed, or marked next to.
   - Format: "Q[num]: Student circled option ([letter]) [full option text]"
   - Example: "Q1: Student circled option (a) You pray full salah"
   - If the student marked no option for a question, say "Q[num]: No selection visible"
2. Count every MCQ question on the paper, even if it takes more words. Do not abbreviate.
3. A pen circle, oval, underline, tick, X, cross placed NEXT TO or AROUND an answer option is the student's CHOSEN ANSWER. It is not a mistake mark.
4. Only flag a mistake if you can confirm the selected option is wrong (e.g. the paper shows the answer key, or it is clearly incorrect).

SHORT ANSWER / ESSAY:
- Work page by page. For each visible question, transcribe or paraphrase the student's typed or handwritten answer faithfully.
- Connect each answer to the closest question number/text on the page.
- If the answer is partly unreadable, write the readable words and mark the unreadable part as [unclear].
- Do not write "Not provided" unless the answer area is visibly blank.
- Include typed text boxes, handwriting, pen-written words, circles, ticks, crosses, and underlines.

Return exactly:
{
  "questionFocus": "brief description of the paper being read in 20 words",
  "studentAnswerSummary": "For EVERY question on EVERY supplied page: state the question number, selected option or written answer. Use the MCQ format above. Up to 1200 words.",
  "visibleMistakes": ["Q[num]: student selected ([letter]) [text] — this is wrong because [reason]"],
  "legibility": "low" | "medium" | "high"
}`;

  for (const cloudAttempt of [
    { provider: "groq" as const, apiKey: GROQ_API_KEY, model: GROQ_VISION_MODEL },
    { provider: "openrouter" as const, apiKey: OPENROUTER_API_KEY, model: OPENROUTER_VISION_MODEL },
  ]) {
    if (!cloudAttempt.apiKey) continue;
    try {
      const chunkSize = cloudAttempt.provider === "groq" ? 5 : 8;
      const contexts: VisualAnswerContext[] = [];
      for (let offset = 0; offset < pageImages.length; offset += chunkSize) {
        const context = await requestCloudVisualAnswerContext({
          ...cloudAttempt,
          prompt,
          pageImages: pageImages.slice(offset, offset + chunkSize),
          pageNumbers: (pageNumbers || []).slice(offset, offset + chunkSize),
        });
        if (context) contexts.push(context);
      }
      if (contexts.length > 0) {
        return normalizeVisualAnswerContext({
          questionFocus: contexts.map((context) => context.questionFocus).filter(Boolean).join(" | "),
          studentAnswerSummary: contexts.map((context) => context.studentAnswerSummary).filter(Boolean).join("\n"),
          visibleMistakes: contexts.flatMap((context) => context.visibleMistakes || []),
          legibility: contexts.some((context) => context.legibility === "high")
            ? "high"
            : contexts.some((context) => context.legibility === "medium")
            ? "medium"
            : "low",
        });
      }
    } catch (error) {
      console.error(`${cloudAttempt.provider} answered-page image reading failed:`, error);
    }
  }

  const ocrContext = await extractLocalOcrAnswerContext(pageImages, pageNumbers || []);
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

  // Only use the fallback when the model explicitly returned null/NaN — never
  // silently override a mark the model carefully calculated. Keyword-based
  // overrides caused systematic bias (all students getting the same mark).
  if (!Number.isFinite(numericMark)) return fallbackMark;

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
        Math.max(0, maxMarks == null ? numericMark! : Math.min(maxMarks, numericMark!)),
        fallbackMark,
        raw,
        maxMarks
      )
    : null;
  let clampedMark = Number.isFinite(consistentNumericMark)
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

  // Validate questionBreakdown and derive the authoritative mark from it.
  // This prevents random temperature-driven mark variation — the mark is the
  // deterministic sum of per-question marks, not a single top-level guess.
  const normalizedBreakdown: QuestionMarkEntry[] = [];
  let breakdownSumMark: number | null = null;

  if (Array.isArray(raw.questionBreakdown) && raw.questionBreakdown.length > 0) {
    let breakdownSum = 0;
    let breakdownValid = true;
    for (const entry of raw.questionBreakdown) {
      const e = entry as Partial<QuestionMarkEntry>;
      const marksAwarded = Number(e.marksAwarded ?? 0);
      if (!Number.isFinite(marksAwarded) || marksAwarded < 0) {
        breakdownValid = false;
        break;
      }
      const mqForQ = e.maxMarksForQuestion != null && Number.isFinite(Number(e.maxMarksForQuestion))
        ? Number(e.maxMarksForQuestion)
        : null;
      normalizedBreakdown.push({
        question: asText(e.question).slice(0, 200),
        questionType: asText(e.questionType).slice(0, 40) || undefined,
        studentAnswer: asText(e.studentAnswer).slice(0, 300),
        marksAwarded: Math.max(0, mqForQ != null ? Math.min(mqForQ, marksAwarded) : marksAwarded),
        maxMarksForQuestion: mqForQ,
        reason: asText(e.reason).slice(0, 200),
      });
      breakdownSum += normalizedBreakdown[normalizedBreakdown.length - 1].marksAwarded;
    }
    if (breakdownValid && normalizedBreakdown.length > 0) {
      breakdownSumMark = maxMarks != null
        ? Math.max(0, Math.min(maxMarks, Math.round(breakdownSum)))
        : Math.max(0, Math.round(breakdownSum));
      // If the breakdown sum disagrees with the AI's stated mark, override with the sum —
      // the per-question work is more trustworthy than a single holistic guess.
      if (breakdownSumMark !== clampedMark && clampedMark != null) {
        warnings.push(
          `AI mark corrected from ${clampedMark} to ${breakdownSumMark} based on the per-question breakdown sum.`
        );
      }
      clampedMark = breakdownSumMark;
    }
  }

  const accountedMaxMarks = normalizedBreakdown.reduce(
    (sum, entry) => sum + (entry.maxMarksForQuestion ?? 0),
    0
  );
  if (
    maxMarks != null &&
    maxMarks >= 20 &&
    normalizedBreakdown.length > 0 &&
    accountedMaxMarks > 0 &&
    accountedMaxMarks < maxMarks * 0.75
  ) {
    clampedMark = null;
    warnings.push(
      `AI only accounted for ${accountedMaxMarks}/${maxMarks} allocated marks. It did not read enough of the paper/answers to produce a fair final mark.`
    );
  }

  const generatedDeductionsFeedback = buildDeductionsFeedback(normalizedBreakdown, clampedMark, maxMarks);

  return {
    suggestedMark: clampedMark,
    questionBreakdown: normalizedBreakdown.length > 0 ? normalizedBreakdown : undefined,
    feedback:
      (normalizedBreakdown.length > 0 ? generatedDeductionsFeedback : normalizeDeductionsFeedback(asText(raw.feedback))).slice(0, 1500) ||
      "No deductions list was produced. Please review the per-question deductions below.",
    rationale:
      asText(raw.rationale).slice(0, 1500) ||
      "Fair judgment could not be confirmed from the returned model response.",
    confidence,
    sourcePolicy,
    warnings,
  };
};

const draftCompletenessScore = (raw: Partial<DraftMarkResponse>, maxMarks: number | null) => {
  const breakdown = Array.isArray(raw.questionBreakdown) ? raw.questionBreakdown : [];
  const accountedMarks = breakdown.reduce((sum, entry) => {
    const maxForQuestion = Number((entry as Partial<QuestionMarkEntry>)?.maxMarksForQuestion ?? 0);
    return sum + (Number.isFinite(maxForQuestion) && maxForQuestion > 0 ? maxForQuestion : 0);
  }, 0);
  const markPresent = raw.suggestedMark != null && Number.isFinite(Number(raw.suggestedMark));
  const confidenceScore = raw.confidence === "high" ? 20 : raw.confidence === "medium" ? 10 : 0;
  const coverageScore = maxMarks && maxMarks > 0 && accountedMarks > 0
    ? Math.min(50, (accountedMarks / maxMarks) * 50)
    : Math.min(30, breakdown.length * 3);
  return coverageScore + confidenceScore + (markPresent ? 15 : 0) + Math.min(15, breakdown.length);
};

const chooseBetterDraftJson = (
  currentJson: string | null,
  candidateJson: string | null,
  maxMarks: number | null
) => {
  if (!candidateJson) return currentJson;
  if (!currentJson) return candidateJson;
  try {
    const current = JSON.parse(currentJson) as Partial<DraftMarkResponse>;
    const candidate = JSON.parse(candidateJson) as Partial<DraftMarkResponse>;
    return draftCompletenessScore(candidate, maxMarks) > draftCompletenessScore(current, maxMarks) + 5
      ? candidateJson
      : currentJson;
  } catch {
    return currentJson;
  }
};

const requestGroqMarkingDraft = async ({
  prompt,
  signal,
}: {
  prompt: string;
  signal?: AbortSignal;
}) => {
  if (!GROQ_API_KEY) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 40000);
  const requestSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  const ISLAMIC_STUDIES_KNOWLEDGE = `
ISLAMIC STUDIES AUTHORITATIVE ANSWERS (use these when subject is Islamic/Quranic/Arabic religious):
- Prayer shortening (Qasr) while travelling: Allowed when distance ≥ 83 km AND intended stay is 3 days or fewer. If the stay EXTENDS BEYOND 3 DAYS the traveller must revert to full (Tamam) prayers. CORRECT answer to "what happens if stay extends beyond 3 days at >83 km": "You pray full salah" — award full marks.
- Treaty of Hudaybiyyah: Signed in 6 AH at Hudaybiyyah between Prophet Muhammad ﷺ and the Quraysh. Effects: right to return for Umrah the following year; tribes free to align; led to mass entry into Islam; prepared the ground for Fatḥ Makkah.
- Dealing with rumours: Islamic guidance (Al-Hujurat 49:6): verify the information (Tabayyun/Tahaqquq). If beneficial and confirmed, share; otherwise keep silent. CORRECT answer: "Listen to it and verify it. Then, if it should be known, pass it on; otherwise, keep silent."
- Salah times: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), Isha (night).
- Pillars of Islam: Shahada, Salah, Zakah, Sawm (Ramadan fasting), Hajj.
- Pillars of Iman: Allah, Angels, Scriptures, Prophets, Day of Judgement, Qadar (Divine Decree).
- Wudu (ablution) is required before prayer; invalidated by sleep, toilet, breaking wind, unconsciousness.
- Tayammum (dry ablution) is permitted when water is unavailable or harmful to use.
`;

  const systemContent =
    "You are a highly accurate professional school exam marker. Mark like a fair human teacher. Always output strict valid JSON.\n" +
    "\nTEACHER STANDARD:\n" +
    "- First reconstruct the mark scheme from the PDF questions, option choices, mark allocations, and any answer clues.\n" +
    "- Then match the student's typed text/handwriting to the correct question by page, question number, and nearby wording.\n" +
    "- Award credit for correct meaning even if spelling/grammar is imperfect. Do not require exact wording unless the question requires a term/name/date.\n" +
    "- Give benefit of doubt only when the student's intention is visible. Do not invent answers for blank or unreadable sections.\n" +
    "- If handwriting is unclear, mark only the words you can read and add a warning.\n" +
    "- Never treat teacher marks, headers, names, dates, or UI labels as student answers.\n" +
    "\nSTEP-BY-STEP MARKING PROCESS — follow in order for EVERY paper:\n" +
    "STEP 1 — LIST QUESTION TYPES: Before scoring, identify each question in the paper and classify it as MCQ | True/False | Fill-blank | Short-answer | Essay. Note the mark allocation per question EXACTLY as shown on the paper.\n" +
    "STEP 2 — READ STUDENT SELECTIONS & ANSWERS: For each MCQ/T-F/Fill-blank question, identify the EXACT option the student circled, underlined, crossed, or ticked. For short-answer/essay questions, read the student's written text and connect it to the nearest matching question.\n" +
    "STEP 3 — EVALUATE CORRECTNESS:\n" +
    "  • MCQ / True-False / Fill-blank: is the selected option factually CORRECT? → award the full mark for that question (right = full marks, wrong = 0). NO partial marks for MCQs.\n" +
    "  • Short-answer: does the student's text contain the required facts/points? Award proportionally.\n" +
    "  • Essay/Analysis: evaluate understanding, depth, and accuracy proportionally.\n" +
    "STEP 4 — BUILD questionBreakdown: one entry PER QUESTION. Use the exact question number and a short excerpt of the question text (e.g. \"Q1: Shortening prayers if stay >3 days\"). Do NOT group MCQs into one entry.\n" +
    "STEP 5 — SELF-AUDIT BEFORE FINAL JSON: Re-read the PDF question list and the student answer evidence. Check that every visible question/sub-question with marks has one breakdown row, no typed answer box was ignored, marks do not exceed allocation, and the total equals the sum. If a high-performing answer is present, award it fairly; if evidence is missing, warn rather than under-marking.\n" +
    "\nCRITICAL MCQ RULE: MCQ and True/False questions are BINARY — full marks or 0. Never give \"3 out of 5\" to a single MCQ. The mark per MCQ is whatever the paper allocates (default: 1 mark each if not stated).\n" +
    "QUESTION LABEL RULE: Use the ACTUAL question number and topic from the paper (e.g. \"Q1: Shortening prayers when stay > 3 days\"). NEVER invent topic names not in the paper.\n" +
    "\nACCURACY RULE: suggestedMark MUST equal the exact integer SUM of all marksAwarded in questionBreakdown. Never output a mark that is lower because you failed to map an answer; first try to match answers by page/y-position and wording.\n" +
    "IDENTITY FIELDS RULE: Completely ignore student name, ID, class, date, school name — these are never part of the answer.\n" +
    ISLAMIC_STUDIES_KNOWLEDGE +
    "\nFEEDBACK FORMAT: Do NOT write WWW or EBI. Feedback must show ONLY wrong or partially wrong answers as deductions. For each mistake include: question number, student's wrong answer, correct/missing answer, and marks deducted. If there are no mistakes, write 'No deductions found.'";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_TEXT_MODEL,
        temperature: 0,
        max_tokens: 4500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: prompt },
        ],
      }),
      signal: requestSignal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Groq text marking failed (${response.status}). ${errorText.slice(0, 240)}`);
    }

    const content = extractCloudJsonContent(await response.json());
    return { response: content };
  } finally {
    clearTimeout(timeoutHandle);
  }
};

// DeepSeek-R1 reasoning re-check: used when the primary mark has low confidence
// or when a complex paper needs step-by-step verification.
const requestGroqReasoningRecheck = async ({
  prompt,
  signal,
}: {
  prompt: string;
  signal?: AbortSignal;
}) => {
  if (!GROQ_API_KEY) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 30000);
  const requestSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_REASONING_MODEL,
        temperature: 0,
        max_tokens: 3000,
        // Note: DeepSeek-R1 does not support response_format json_object — we strip think tags and parse manually
        messages: [
          {
            role: "user",
            content:
              "You are a school exam marker. Think through each question carefully, then output ONLY a valid JSON object (no extra text after the JSON).\n\n" +
              prompt,
          },
        ],
      }),
      signal: requestSignal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Groq reasoning model failed (${response.status}). ${errorText.slice(0, 240)}`);
    }

    const raw = extractCloudJsonContent(await response.json());
    // Strip <think>...</think> reasoning tokens before JSON extraction
    return { response: stripReasoningTags(raw) };
  } finally {
    clearTimeout(timeoutHandle);
  }
};

const requestGeminiDraftMark = async ({
  prompt,
  pageImages = [],
  pageNumbers = [],
  signal,
}: {
  prompt: string;
  pageImages?: string[];
  pageNumbers?: number[];
  signal?: AbortSignal;
}) => {
  if (!GEMINI_API_KEY) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 45000);
  const requestSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const imageParts = pageImages.slice(0, 8).flatMap((img, index) => [
      { text: `Answered ${pageImageLabel(pageNumbers, index)}:` },
      { inlineData: { mimeType: "image/jpeg" as const, data: img } },
    ]);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }, ...imageParts],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 4000,
            temperature: 0,
            topP: 0.9,
          },
        }),
        signal: requestSignal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Gemini AI marker failed (${response.status}). ${errorText.slice(0, 240)}`);
    }

    const data = await response.json();
    const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text as string) || "";
    return { response: text };
  } finally {
    clearTimeout(timeoutHandle);
  }
};

const requestGroqVisionDraftMark = async ({
  prompt,
  pageImages = [],
  pageNumbers = [],
  signal,
}: {
  prompt: string;
  pageImages?: string[];
  pageNumbers?: number[];
  signal?: AbortSignal;
}) => {
  if (!GROQ_API_KEY || pageImages.length === 0) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 45000);
  const requestSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_VISION_MODEL,
        temperature: 0,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `${prompt}\n\nThe attached images are the student's answered PDF pages. Read the PDF questions and the student's handwriting/typed overlays directly from these images. Connect each answer to its matching question and mark fairly like a teacher.`,
              },
              ...pageImages.slice(0, 5).flatMap((image, index) => [
                { type: "text", text: `Answered ${pageImageLabel(pageNumbers, index)}:` },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${image}` },
                },
              ]),
            ],
          },
        ],
      }),
      signal: requestSignal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Groq vision marker failed (${response.status}). ${errorText.slice(0, 240)}`);
    }

    const content = extractCloudJsonContent(await response.json());
    return { response: content };
  } finally {
    clearTimeout(timeoutHandle);
  }
};

const requestOpenRouterDraftMark = async ({
  prompt,
  pageImages = [],
  pageNumbers = [],
  signal,
}: {
  prompt: string;
  pageImages?: string[];
  pageNumbers?: number[];
  signal?: AbortSignal;
}) => {
  if (!OPENROUTER_API_KEY) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 45000);
  const requestSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://www.osteps.com",
        "X-Title": "OSTEPS AI Draft Mark",
      },
      body: JSON.stringify({
        model: OPENROUTER_VISION_MODEL,
        temperature: 0,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `${prompt}\n\nThe attached images are the student's answered PDF pages. Read handwriting/typed overlays directly from them and mark fairly like a teacher.`,
              },
              ...pageImages.slice(0, 8).flatMap((image, index) => [
                { type: "text", text: `Answered ${pageImageLabel(pageNumbers, index)}:` },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${image}` },
                },
              ]),
            ],
          },
        ],
      }),
      signal: requestSignal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`OpenRouter multimodal marker failed (${response.status}). ${errorText.slice(0, 240)}`);
    }

    const content = extractCloudJsonContent(await response.json());
    return { response: content };
  } finally {
    clearTimeout(timeoutHandle);
  }
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
    ? body.pageImages.map(normalizeImagePayload).filter(Boolean).slice(0, 12)
    : [];
  const pageImagePageNumbers = Array.isArray(body.pageImagePageNumbers)
    ? body.pageImagePageNumbers
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
        .slice(0, pageImages.length)
    : [];
  const hasPenStrokes = annotationsContainPenStrokes(body.studentAnnotations);
  const annotationSummary = (() => {
    const annotations = Array.isArray(body.studentAnnotations) ? body.studentAnnotations : [];
    const textCount = annotations.filter((annotation) => annotation?.type === "text").length;
    const penCount = annotations.filter((annotation) => annotation?.type === "pen").length;
    const pages = Array.from(
      new Set(
        annotations
          .map((annotation) => Number(annotation?.page || 0))
          .filter((page) => Number.isFinite(page) && page > 0)
      )
    ).sort((left, right) => left - right);
    return `${textCount} typed answer boxes, ${penCount} pen/handwriting marks, pages with student work: ${pages.join(", ") || "none"}, page images supplied: ${pageImages.length}, page image PDF numbers: ${pageImagePageNumbers.join(", ") || "not supplied"}`;
  })();
  const islamic = isIslamicSubject(subjectName, title);
  const sourcePolicy = islamic
    ? "Islamic subject: use only the supplied assessment context and approved OSTEPS/Sunni school resources. Do not use external web knowledge. If evidence is missing, say so."
    : "Non-Islamic subject: draft a teacher-reviewed mark from the submitted answer and normal curriculum knowledge. Do not invent unseen evidence.";

  let paperContext = "";
  let paperReadMethod = "text";
  try {
    // Always load ALL pages of the paper so the AI can see every question.
    // answeredPages only tells us which pages the student wrote on — the paper
    // itself may have more question pages (short-answer, essay) beyond page 1 (MCQs).
    paperContext = await buildPaperContext(body.fileUrl, []);
  } catch (error) {
    console.error("Could not extract exam paper text for AI marking:", error);
  }

  // If text extraction returned nothing (scanned PDF / image-only paper),
  // try reading the exam paper questions visually with the Groq vision model.
  if (!paperContext && body.fileUrl && GROQ_API_KEY) {
    const normalizedFileUrl = normalizeDocumentUrl(body.fileUrl);
    const localFilePath = resolveLocalPaperPath(normalizedFileUrl);
    if (localFilePath) {
      try {
        const visionText = await extractPaperQuestionsViaVision({
          localPath: localFilePath,
          title,
          subjectName,
        });
        if (visionText) {
          paperContext = `[Exam paper read visually — scanned image PDF]\n${visionText}`;
          paperReadMethod = "vision";
          // Cache for 5 minutes so repeat marks for the same paper don't re-run vision
          paperTextCache.set(normalizedFileUrl, {
            pages: [{ num: 1, text: paperContext }],
            cachedAt: Date.now() - (PAPER_TEXT_CACHE_MS / 2),
          });
        }
      } catch (err) {
        console.error("Vision fallback for exam paper failed:", err);
      }
    }
  }

  // Allow up to 12000 chars of page-balanced paper text so multi-section exams (MCQs + short-answer + essays)
  // are fully visible. Do NOT reduce this when images are present — images carry student
  // answers, not exam questions, so they don't require us to shrink the paper context.
  const promptPaperContext = summarizeLongText(paperContext, 12000);

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
      feedback: "No deductions list was produced because no readable student answer was found. Please mark manually or add clearer writing.",
      rationale: "The request contained no usable answer text for assessment.",
      confidence: "low",
      sourcePolicy,
      warnings: ["No readable student answer text found."],
    } satisfies DraftMarkResponse);
  }

  const hasSubstantialTypedAnswers = studentText.length >= 350;
  let visualContext: VisualAnswerContext | null = null;
  let visualWarning = "";

  if (pageImages.length > 0 && !hasSubstantialTypedAnswers) {
    try {
      visualContext = await extractVisualAnswerContext({
        title,
        subjectName,
        pageImages,
        pageNumbers: pageImagePageNumbers,
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

  if (pageImages.length > 0 && !studentText && !visualContext) {
    return jsonResponse({
      suggestedMark: null,
      feedback:
        "No deductions list was produced because AI could not read the student's handwriting safely on this server. Mark manually or add a Groq/OpenRouter vision key for accurate handwriting marking.",
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
    pageImages.length > 0 || hasPenStrokes ? 6000 : 5000
  );

  const prompt = `OSTEPS AI Draft Mark. Return strict JSON only. Draft only; teacher reviews manually. Never call it final. ${sourcePolicy}

Title: ${title}
Subject: ${subjectName}
Student: ${asText(body.studentName) || asText(body.studentId) || "Unknown"}
Max marks: ${maxMarks ?? "Unknown"}

MARKING PROCESS — follow these exact steps in order:

STEP 1 — IDENTIFY QUESTION TYPES:
Read the exam paper carefully. For each question, note:
  - The question number exactly as printed (Q1, Q2, 1a, 2b, etc.)
  - The question type: MCQ | True/False | Fill-blank | Short-answer | Essay/Analysis
  - The marks allocated to it (look for numbers in brackets like [2] or "(5 marks)" or allocations in mark grids)
  - The question text (first 10 words is enough)

STEP 2 — MCQ / True-False / Fill-blank RULE (strictly enforced):
  - For each MCQ or T/F: find the option the student circled, crossed, ticked, or underlined.
  - Determine if that option is factually CORRECT.
  - Award the full mark for that question if correct; award 0 if wrong.
  - NEVER give partial marks to a single MCQ. (You cannot get "3 out of 5" for one MCQ.)
  - Default mark per MCQ is 1 mark each UNLESS the paper clearly states a different allocation.

STEP 3 — SHORT-ANSWER / ESSAY RULE:
  - Find the student's written answer to each question.
  - Check it against the expected answer from the paper.
  - Award marks proportionally based on how many required points are included.

STEP 4 — BUILD THE BREAKDOWN:
  - One entry per question. Do NOT group multiple MCQs into one entry.
  - Use the actual question number and a short excerpt of the question text as the label.
    EXAMPLE: "Q1: What happens when stay exceeds 3 days" — NOT invented topic names.
  - Do NOT invent labels like "Effects of Hudaybiyyah" for an MCQ about prayer shortening.

STEP 5 — SELF-AUDIT BEFORE RETURNING:
  - Check every PDF question/sub-question with marks has a breakdown row.
  - Check every typed answer box was considered and matched by page/y-position or wording.
  - Check no mark exceeds its question allocation.
  - Check suggestedMark is the exact sum of the breakdown.
  - If a student clearly attempted the paper across many pages, do not mark many questions "not provided" unless the relevant answer area is genuinely blank/unreadable.

OTHER RULES:
IGNORE: student name, ID, class, date, school name — never part of the answer.
For marks feedback, name the exact question number and what the student got wrong.
suggestedMark = exact integer SUM of all marksAwarded in the breakdown.
If you cannot account for most of the allocated ${maxMarks ?? "total"} marks from visible questions and visible student answers, set suggestedMark to null, confidence to "low", and warn exactly what could not be read. Do NOT output a small mark like 4/40 just because only page 1 was readable.
If the evidence summary shows many typed boxes or pen marks across many pages, assume the student attempted the paper and actively search the typed answer text and all supplied page images before marking any question as "not provided".

Exam paper text:
${promptPaperContext || "Exam paper text could not be extracted."}

Student typed answer text:
${studentText || "No separate typed annotation text was found. Use the supplied answered-page images if available."}

Student answer evidence summary:
${annotationSummary}

${visualContext ? `Visual reading from answered-page images:
Question focus: ${visualContext.questionFocus}
Student answer seen on the paper: ${visualContext.studentAnswerSummary}
Specific wrong or missing points seen on the paper: ${visualContext.visibleMistakes.join("; ") || "None extracted from the images."}
Image legibility: ${visualContext.legibility}` : pageImages.length > 0 ? "Answered-page images were supplied, but no reliable visual extraction could be confirmed. Use the paper text and any readable typed answer only." : "No answered-page image reading was used for this request."}

Image reading warning: ${visualWarning || "none"}

Return exactly (one entry per question — do NOT merge separate questions):
{
  "questionBreakdown": [
    {
      "question": "Q1: [first 8 words of the actual question text from the paper]",
      "questionType": "MCQ" | "TrueFalse" | "FillBlank" | "ShortAnswer" | "Essay",
      "studentAnswer": "[exact option letter + text for MCQ, e.g. \"(a) You pray full salah\"; or student's written text]",
      "marksAwarded": integer,
      "maxMarksForQuestion": integer or null,
      "reason": "[for MCQ: state the selected option and whether it is correct or wrong + the correct answer if wrong; for short-answer: what was correct or missing]"
    }
  ],
  "suggestedMark": integer = exact sum of marksAwarded; null if the paper/answers are too incomplete to account for most allocated marks,
  "feedback": "Deductions only: list only wrong or partially wrong questions with the student's wrong answer, correct/missing answer, and marks deducted. Do not write WWW or EBI. If nothing is wrong, write 'No deductions found.'",
  "rationale": "brief reason under 30 words",
  "confidence": "low" | "medium" | "high",
  "warnings": []
}`;

  // Compact Ollama prompt — always uses num_ctx=512 so qwen2.5:1.5b responds in ~12-15s.
  // Gemini (when key present) uses the full `prompt` above with all context.
  // Key rules explicitly stated in the prompt to overcome model limitations.
  const ollamaPrompt = `You are a teacher's marking assistant. Output ONE JSON object. No other text.

Subject: ${subjectName}
Max marks available: ${maxMarks ?? "unknown"}

EXAM PAPER / QUESTION:
${summarizeLongText(promptPaperContext || paperContext || "No exam paper text available.", shouldPreferFastModel ? 195 : 400)}

STUDENT ANSWER:
${summarizeLongText(readableAnswerText || "No readable student answer.", shouldPreferFastModel ? 240 : 480)}

MARKING RULES:
1. suggestedMark = integer from 0 to ${maxMarks ?? "max"}. NEVER null or a string.
2. feedback must show deductions only. Do NOT write WWW or EBI.
3. List only wrong or partially wrong questions. Include the student's wrong answer, the correct/missing answer, and marks deducted.
  - If nothing is wrong, write "No deductions found."
4. confidence = low, medium, or high.
5. warnings = []`;

  const tinyOllamaPrompt = `Return ONLY valid JSON. You are an exam marker. Give a teacher-review draft mark.
Max marks: ${maxMarks ?? "unknown"}
Subject: ${subjectName}
Paper excerpt: ${summarizeLongText(promptPaperContext || paperContext || "No paper text.", 520)}
Student answer excerpt: ${summarizeLongText(readableAnswerText || visualContext?.studentAnswerSummary || studentText || "No readable answer.", 620)}
Rules: suggestedMark must be a number from 0 to ${maxMarks ?? "max"}. feedback must be deductions only. Do not write WWW or EBI. Do not list correct answers.
JSON schema: {"suggestedMark":number,"feedback":"Deductions only: ...","rationale":"brief","confidence":"low|medium|high","warnings":[]}`;

  try {
    const modelWarnings: string[] = [];
    if (visualWarning) modelWarnings.push(visualWarning);
    if (paperReadMethod === "vision") {
      modelWarnings.push("Exam paper is a scanned image \u2014 questions were read visually. Verify question text matches the original paper before relying on this draft mark.");
    }
    let rawJson: string | null = null;
    const tryTinyLocalDraft = async (reason: string) => {
      try {
        const tinyPayload = await requestOllamaDraft({
          model: OLLAMA_TINY_FALLBACK_MODEL,
          prompt: tinyOllamaPrompt,
          options: {
            num_predict: 120,
            num_ctx: 768,
          },
          timeoutMs: 25000,
        });
        const tinyJson = extractFirstJsonObject(String(tinyPayload.response || ""));
        if (tinyJson) {
          modelWarnings.push(`Used emergency fast local AI fallback because ${reason}. Verify the draft carefully.`);
        }
        return tinyJson;
      } catch (error) {
        console.error("Emergency tiny local marker failed:", error);
        return null;
      }
    };

    // 1. If the student has substantial typed answers, use the reliable text pipeline first.
    // This avoids Groq Vision TPM rate-limit failures and still marks against the full PDF.
    if (GROQ_API_KEY && hasSubstantialTypedAnswers) {
      try {
        const groqPayload = await requestGroqMarkingDraft({ prompt });
        rawJson = chooseBetterDraftJson(
          rawJson,
          extractFirstJsonObject(String(groqPayload?.response || "")),
          maxMarks
        );
      } catch (error) {
        console.error("Groq text marking failed, falling back to vision/Ollama:", error);
      }
    }

    // 2. For handwriting-heavy papers, try multimodal models because they can directly
    // see the student's writing over the PDF. Skip this for text-rich submissions to avoid rate limits.
    if (GROQ_API_KEY && pageImages.length > 0 && !hasSubstantialTypedAnswers) {
      try {
        const groqVisionPayload = await requestGroqVisionDraftMark({
          prompt,
          pageImages: pageImages.slice(0, 5),
          pageNumbers: pageImagePageNumbers.slice(0, 5),
        });
        rawJson = chooseBetterDraftJson(
          rawJson,
          extractFirstJsonObject(String(groqVisionPayload?.response || "")),
          maxMarks
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("Groq vision marker failed, trying Gemini/OpenRouter/Groq text/Ollama:", error);
      }
    }

    if (GEMINI_API_KEY && pageImages.length > 0 && !hasSubstantialTypedAnswers) {
      try {
        const geminiPrompt = `${prompt}\n\nIMPORTANT: ${pageImages.length} answered-page image(s) are attached. Read the student's handwriting/text overlays directly from these images as the primary evidence. Match each visible answer to the PDF question on the same page.`;
        const geminiPayload = await requestGeminiDraftMark({
          prompt: geminiPrompt,
          pageImages: pageImages.slice(0, 8),
          pageNumbers: pageImagePageNumbers.slice(0, 8),
        });
        rawJson = chooseBetterDraftJson(
          rawJson,
          extractFirstJsonObject(String(geminiPayload?.response || "")),
          maxMarks
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("Gemini multimodal marker failed, trying OpenRouter/Groq/Ollama:", error);
      }
    }

    if (OPENROUTER_API_KEY && pageImages.length > 0 && !hasSubstantialTypedAnswers) {
      try {
        const openRouterPayload = await requestOpenRouterDraftMark({
          prompt,
          pageImages: pageImages.slice(0, 8),
          pageNumbers: pageImagePageNumbers.slice(0, 8),
        });
        rawJson = chooseBetterDraftJson(
          rawJson,
          extractFirstJsonObject(String(openRouterPayload?.response || "")),
          maxMarks
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("OpenRouter multimodal marker failed, falling back to Groq/Ollama:", error);
      }
    }

    // 3. Try Groq text (llama-3.3-70b) using extracted PDF text + typed answers/visual summary.
    if (GROQ_API_KEY && !hasSubstantialTypedAnswers) {
      try {
        const groqPayload = await requestGroqMarkingDraft({ prompt });
        rawJson = chooseBetterDraftJson(
          rawJson,
          extractFirstJsonObject(String(groqPayload?.response || "")),
          maxMarks
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("Groq text marking failed, falling back to Ollama:", error);
      }
    }

    // 3. If no cloud model produced valid JSON, fall back to local Ollama.
    if (!rawJson) {
      try {
        const fallbackPayload = await requestOllamaDraft({
          model: OLLAMA_FAST_FALLBACK_MODEL,
          prompt: ollamaPrompt,
          options: {
            num_predict: 160,
            num_ctx: 512,
          },
          timeoutMs: 15000,
        });
        rawJson = extractFirstJsonObject(String(fallbackPayload.response || ""));
        // Schedule a background keep-alive so the model stays warm for the next teacher
        setTimeout(() => {
          fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: OLLAMA_FAST_FALLBACK_MODEL, prompt: "", keep_alive: OLLAMA_KEEP_ALIVE }),
          }).catch(() => undefined);
        }, 100);
        if (!rawJson) {
          rawJson = await tryTinyLocalDraft("the normal local model returned unusable output");
        }
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
          rawJson = await tryTinyLocalDraft("the normal local model was too slow");
        }
        if (!rawJson && aborted) {
          if (!shouldAttemptReasoner) {
            return jsonResponse(
              normalizeDraft(
                {
                  suggestedMark: null,
                  feedback: "No deductions list was produced because AI Draft Mark could not finish quickly enough. Please try again after the paper loads or mark manually.",
                  rationale: "The local model reached the time limit before returning a safe draft.",
                  confidence: "low",
                  warnings: [...modelWarnings, "Local AI timed out before completing the draft."],
                },
                maxMarks,
                sourcePolicy
              )
            );
          }
        } else if (!rawJson && !shouldAttemptReasoner) {
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

    // 4. DeepSeek-R1 reasoning re-check for low-confidence or high-mark papers.
    // It can only see text/OCR summaries, so keep the original if the recheck is less complete.
    if (rawJson && GROQ_API_KEY) {
      try {
        const parsed = JSON.parse(rawJson) as Partial<DraftMarkResponse>;
        const shouldRecheck =
          parsed.confidence === "low" ||
          parsed.suggestedMark == null ||
          (maxMarks != null && maxMarks >= 20);
        if (shouldRecheck) {
          const recheckPayload = await requestGroqReasoningRecheck({ prompt });
          const recheckJson = extractFirstJsonObject(String(recheckPayload?.response || ""));
          rawJson = chooseBetterDraftJson(rawJson, recheckJson, maxMarks);
        }
      } catch {
        // Re-check failed — keep the original rawJson
      }
    }

    if (!rawJson) {
      return jsonResponse(
        normalizeDraft(
          {
            suggestedMark: null,
            feedback: "No deductions list was produced because AI Draft Mark could not produce a reliable structured draft from this answer. Please review it manually.",
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