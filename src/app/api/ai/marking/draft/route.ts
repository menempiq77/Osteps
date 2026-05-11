import { promises as fs } from "fs";
import { execFile } from "child_process";
import { createHash } from "crypto";
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
  correctAnswer?: string;
  marksAwarded: number;
  maxMarksForQuestion: number | null;
  reason: string;
  answerAnchor?: {
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence?: "low" | "medium" | "high";
    evidence?: string;
  };
};

type DraftProviderTrace = {
  selected: string;
  attempts: string[];
  recheck?: string;
};

type DraftMarkResponse = {
  suggestedMark: number | null;
  questionBreakdown?: QuestionMarkEntry[];
  feedback: string;
  rationale: string;
  confidence: "low" | "medium" | "high";
  sourcePolicy: string;
  warnings: string[];
  providerTrace?: DraftProviderTrace;
};

type VisualAnswerContext = {
  questionFocus: string;
  studentAnswerSummary: string;
  visibleMistakes: string[];
  legibility: "low" | "medium" | "high";
};

type QuestionAnswerAnchor = NonNullable<QuestionMarkEntry["answerAnchor"]>;

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OSTEPS_AI_MARKING_MODEL || process.env.OLLAMA_MODEL || "deepseek-r1:1.5b";
const OLLAMA_FAST_FALLBACK_MODEL = process.env.OSTEPS_AI_MARKING_FAST_MODEL || "qwen2.5:0.5b";
const OLLAMA_TINY_FALLBACK_MODEL = process.env.OSTEPS_AI_MARKING_TINY_MODEL || "qwen2.5:0.5b";
const OLLAMA_VISION_MODEL = process.env.OSTEPS_AI_MARKING_VISION_MODEL || "granite3.2-vision:2b";
const OLLAMA_KEEP_ALIVE = process.env.OSTEPS_AI_MARKING_KEEP_ALIVE || "5m";
const OLLAMA_ENABLE_REASONER = process.env.OSTEPS_AI_MARKING_USE_REASONER === "1";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const GROQ_TEXT_MODEL = process.env.GROQ_TEXT_MODEL || "llama-3.3-70b-versatile";
// Faster fallback text model with a separate 500k TPD quota — used when the primary model is rate-limited
const GROQ_FALLBACK_TEXT_MODEL = process.env.GROQ_FALLBACK_TEXT_MODEL || "llama-3.1-8b-instant";
// DeepSeek-R1 reasoning model for re-check on low-confidence marks (runs AFTER primary model)
const GROQ_REASONING_MODEL = process.env.GROQ_REASONING_MODEL || "deepseek-r1-distill-llama-70b";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "qwen/qwen2.5-vl-72b-instruct:free";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
const REQUEST_TIMEOUT_MS = Number(process.env.OSTEPS_AI_MARKING_TIMEOUT_MS || 30000);
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const PAPER_TEXT_CACHE_MS = 10 * 60 * 1000;
const DRAFT_RESPONSE_CACHE_MS = Number(process.env.OSTEPS_AI_MARKING_CACHE_MS || 10 * 60 * 1000);
const PROVIDER_RATE_LIMIT_COOLDOWN_MS = Number(process.env.OSTEPS_AI_PROVIDER_COOLDOWN_MS || 90 * 1000);
const LOCAL_OCR_FOCUS = "Local OCR text from answered-page image";
const VISUAL_CONTEXT_MAX_IMAGES = 1;
const draftResponseCache = new Map<string, { response: DraftMarkResponse; cachedAt: number }>();
const providerCooldownUntil = new Map<string, number>();

// Strip DeepSeek-R1 <think>...</think> reasoning tags before JSON extraction
const stripReasoningTags = (raw: string): string =>
  raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

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

const DRAFT_MARKING_SYSTEM_PROMPT =
  "You are a highly accurate professional school exam marker. Mark like a fair human teacher. Always output strict valid JSON.\n" +
  "\nTEACHER STANDARD:\n" +
  "- Reconstruct the mark scheme from the PDF questions, option choices, mark allocations, visible student evidence, and your own subject knowledge.\n" +
  "- The exam paper usually contains questions only, not an answer key. Do NOT look for the correct answer inside the paper text; infer it from the question and subject knowledge.\n" +
  "- Match the student's typed text/handwriting to the correct question by page, question number, nearby wording, and vertical position. Do not rely on text box numbering.\n" +
  "- When answered-page images are attached, treat visible handwriting, circles, ticks, underlines, and typed overlays on those images as primary evidence of the student's answer.\n" +
  "- Award credit for correct meaning even if spelling/grammar is imperfect. Do not require exact wording unless the question requires a term/name/date.\n" +
  "- Give benefit of doubt only when the student's intention is visible. Do not invent answers for blank or unreadable sections.\n" +
  "- If handwriting is unclear, mark only the words you can read and add a warning.\n" +
  "- Never treat teacher marks, headers, names, dates, or UI labels as student answers.\n" +
  "\nSTEP-BY-STEP MARKING PROCESS — follow in order for EVERY paper:\n" +
  "STEP 1 — LIST QUESTION TYPES: Before scoring, identify each question in the paper and classify it as MCQ | True/False | Fill-blank | Short-answer | Essay. Note the mark allocation per question EXACTLY as shown on the paper.\n" +
  "STEP 2 — READ STUDENT SELECTIONS & ANSWERS: For each MCQ/T-F/Fill-blank question, identify the EXACT option the student circled, underlined, crossed, ticked, or marked by handwriting. For True/False specifically, handwritten words like 'true', 'false', 'T', 'F', and signs placed beside True or False count as the student's chosen answer. For short-answer/essay questions, read the student's written text and connect it to the nearest matching question.\n" +
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
  "\nFEEDBACK FORMAT: The 'feedback' field must list ONLY wrong or partially wrong questions. For each wrong question write exactly:\n'Q[num]: [question text]: student wrote \"[wrong answer]\" — correct: [correct answer]. -[N] mark(s).'\nBegin with 'Deductions:'. List ALL wrong/partial questions, not just one. If all answers are correct write 'No deductions found.' Do NOT write WWW, EBI, praise, general advice, or explanations about the subject.";

const paperTextCache = new Map<string, { pages: Array<{ num: number; text: string }>; cachedAt: number }>();
const execFileAsync = promisify(execFile);

const jsonResponse = (payload: unknown, status = 200) => NextResponse.json(payload, { status });

const asText = (value: unknown) => String(value ?? "").trim();

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

const isProviderCoolingDown = (key: string) => {
  const until = providerCooldownUntil.get(key) || 0;
  if (until <= Date.now()) {
    providerCooldownUntil.delete(key);
    return false;
  }
  return true;
};

const noteProviderRateLimit = (key: string) => {
  providerCooldownUntil.set(key, Date.now() + PROVIDER_RATE_LIMIT_COOLDOWN_MS);
};

const buildDraftRequestCacheKey = (
  body: DraftMarkRequest,
  pageImages: string[],
  pageImagePageNumbers: number[]
) =>
  sha256(
    JSON.stringify({
      assessmentId: body.assessmentId,
      taskId: body.taskId,
      studentId: body.studentId,
      title: body.title,
      subjectName: body.subjectName,
      fileUrl: normalizeDocumentUrl(body.fileUrl),
      maxMarks: body.maxMarks,
      studentAnnotations: body.studentAnnotations || [],
      pageImagePageNumbers,
      pageImages: pageImages.map((image) => sha256(image)),
    })
  );

const getCachedDraftResponse = (key: string) => {
  const cached = draftResponseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.cachedAt > DRAFT_RESPONSE_CACHE_MS) {
    draftResponseCache.delete(key);
    return null;
  }
  return cached.response;
};

const cacheDraftResponse = (key: string, response: DraftMarkResponse) => {
  if (response.suggestedMark == null) return;
  draftResponseCache.set(key, { response, cachedAt: Date.now() });
  if (draftResponseCache.size > 60) {
    const oldestKey = draftResponseCache.keys().next().value;
    if (oldestKey) draftResponseCache.delete(oldestKey);
  }
};

const clampNormalizedAnchorMetric = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return Math.max(0, Math.min(1000, numericValue));
};

const normalizeQuestionAnswerAnchor = (
  raw: unknown,
  validPageNumbers?: Set<number> | null
): QuestionAnswerAnchor | undefined => {
  if (!raw || typeof raw !== "object") return undefined;

  const entry = raw as Partial<QuestionAnswerAnchor>;
  const pageNumber = Number(entry.pageNumber ?? 0);
  if (!Number.isFinite(pageNumber) || pageNumber <= 0) return undefined;
  if (validPageNumbers && validPageNumbers.size > 0 && !validPageNumbers.has(pageNumber)) {
    return undefined;
  }

  const x = clampNormalizedAnchorMetric(entry.x);
  const y = clampNormalizedAnchorMetric(entry.y);
  const width = clampNormalizedAnchorMetric(entry.width);
  const height = clampNormalizedAnchorMetric(entry.height);
  if (x == null || y == null || width == null || height == null) return undefined;
  if (width < 8 || height < 8) return undefined;

  const clampedWidth = Math.min(width, 1000 - x);
  const clampedHeight = Math.min(height, 1000 - y);
  if (clampedWidth < 8 || clampedHeight < 8) return undefined;

  return {
    pageNumber,
    x,
    y,
    width: clampedWidth,
    height: clampedHeight,
    confidence:
      entry.confidence === "high" || entry.confidence === "medium" || entry.confidence === "low"
        ? entry.confidence
        : undefined,
    evidence: asText(entry.evidence).slice(0, 40) || undefined,
  };
};

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

const buildProviderTrace = ({
  selected,
  attempts,
  recheck,
}: {
  selected?: string | null;
  attempts?: string[];
  recheck?: string | null;
}): DraftProviderTrace | undefined => {
  const cleanSelected = asText(selected);
  const cleanAttempts = Array.from(new Set((attempts || []).map(asText).filter(Boolean)));
  const cleanRecheck = asText(recheck);

  if (!cleanSelected && cleanAttempts.length === 0 && !cleanRecheck) return undefined;

  return {
    selected: cleanSelected || cleanAttempts[cleanAttempts.length - 1] || "No provider produced a reliable draft",
    attempts: cleanAttempts,
    recheck: cleanRecheck || undefined,
  };
};

const logDraftProviderTrace = ({
  providerTrace,
  suggestedMark,
  confidence,
  title,
  subjectName,
}: {
  providerTrace?: DraftProviderTrace;
  suggestedMark: number | null;
  confidence: DraftMarkResponse["confidence"];
  title: string;
  subjectName: string;
}) => {
  if (!providerTrace) return;
  console.info(
    "[ai/marking/draft] provider-trace",
    JSON.stringify({
      title,
      subjectName,
      suggestedMark,
      confidence,
      selected: providerTrace.selected,
      attempts: providerTrace.attempts,
      recheck: providerTrace.recheck || null,
    })
  );
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

  return summarizeEvenly(combined, 5000, "\n");
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
    7000,
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

const estimateLikelyQuestionCount = (paperContext: string) => {
  const text = String(paperContext || "");
  if (!text.trim()) return null;

  const labels = new Set<string>();

  for (const match of text.matchAll(/\bQ(?:uestion)?\s*(\d{1,2}[a-z]?)/gi)) {
    const label = String(match[1] || "").toLowerCase();
    if (label) labels.add(label);
  }

  for (const match of text.matchAll(/(?:^|\n)\s*(\d{1,2}[a-z]?)\s*[\).:-]/gmi)) {
    const label = String(match[1] || "").toLowerCase();
    if (label) labels.add(label);
  }

  return labels.size > 0 ? labels.size : null;
};

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
    const correct = entry.correctAnswer ? ` Correct answer: ${entry.correctAnswer}.` : "";
    const reason = entry.reason || "answer was wrong or incomplete";
    const markWord = lost === 1 ? "mark" : "marks";
    lines.push(
      `- ${entry.question || "Question"}: student wrote "${answer}".${correct} (${reason}) -${formatMarkValue(lost)} ${markWord}.`
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
  studentAnswerSummary: asText(raw.studentAnswerSummary).slice(0, 2500),
  visibleMistakes: Array.isArray(raw.visibleMistakes)
    ? raw.visibleMistakes.map(asText).filter(Boolean).slice(0, 20)
    : [],
  legibility: raw.legibility === "high" || raw.legibility === "medium" ? raw.legibility : "low",
});

const mergeVisualAnswerContexts = (
  primary: VisualAnswerContext,
  secondary: VisualAnswerContext | null
) => {
  if (!secondary) return primary;

  return normalizeVisualAnswerContext({
    questionFocus: [primary.questionFocus, secondary.questionFocus].filter(Boolean).join(" | "),
    studentAnswerSummary: [primary.studentAnswerSummary, secondary.studentAnswerSummary].filter(Boolean).join("\n"),
    visibleMistakes: Array.from(new Set([...(primary.visibleMistakes || []), ...(secondary.visibleMistakes || [])])),
    legibility:
      primary.legibility === "high" || secondary.legibility === "high"
        ? "high"
        : primary.legibility === "medium" || secondary.legibility === "medium"
        ? "medium"
        : "low",
  });
};

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

  const cooldownKey = `${provider}:answered-page-vision:${model}`;
  if (isProviderCoolingDown(cooldownKey)) {
    throw new Error(`${provider} answered-page vision is cooling down after a rate limit.`);
  }

  const timeoutController = new AbortController();
  const timeoutHandle = setTimeout(() => timeoutController.abort(), 12000);
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
      if (response.status === 429) noteProviderRateLimit(cooldownKey);
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

const requestGeminiVisualAnswerContext = async ({
  prompt,
  pageImages = [],
  pageNumbers = [],
}: {
  prompt: string;
  pageImages?: string[];
  pageNumbers?: number[];
}) => {
  if (!GEMINI_API_KEY || pageImages.length === 0) return null;

  const cooldownKey = `gemini:answered-page-vision:${GEMINI_MODEL}`;
  if (isProviderCoolingDown(cooldownKey)) {
    throw new Error("Gemini answered-page vision is cooling down after a rate limit.");
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 12000);

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
            maxOutputTokens: 1200,
            temperature: 0.1,
            topP: 0.9,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      if (response.status === 429) noteProviderRateLimit(cooldownKey);
      throw new Error(`gemini vision failed (${response.status}). ${text.slice(0, 240)}`);
    }

    const data = await response.json();
    const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text as string) || "";
    const rawJson = extractFirstJsonObject(text);
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

  for (const [index, image] of pageImages.slice(0, VISUAL_CONTEXT_MAX_IMAGES).entries()) {
    const tempPath = path.join(
      "/tmp",
      `osteps-ai-ocr-${process.pid}-${Date.now()}-${index}.png`
    );
    let enhancedPath = "";
    try {
      await fs.writeFile(tempPath, Buffer.from(image, "base64"));
      enhancedPath = await enhanceImageForOcr(tempPath);
      const ocrAttempts: string[] = [];
      for (const pageSegmentationMode of ["6"]) {
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
            { maxBuffer: 1024 * 1024, timeout: 2500 }
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
    studentAnswerSummary: summarizeLongText(ocrPages.join("\n"), 2500),
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
4. For True/False, also treat handwritten "True", "False", "T", "F", ticks, crosses, or marks placed beside the True/False choices as the student's selected answer.
5. Only flag a mistake if you can confirm the selected option is wrong (e.g. the paper shows the answer key, or it is clearly incorrect).

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

  const ocrContextPromise = extractLocalOcrAnswerContext(pageImages, pageNumbers || []).catch(() => null);

  if (GEMINI_API_KEY) {
    try {
      const contexts: VisualAnswerContext[] = [];
      for (let offset = 0; offset < pageImages.length; offset += 8) {
        const context = await requestGeminiVisualAnswerContext({
          prompt,
          pageImages: pageImages.slice(offset, offset + 8),
          pageNumbers: (pageNumbers || []).slice(offset, offset + 8),
        });
        if (context) contexts.push(context);
      }
      if (contexts.length > 0) {
        const mergedGeminiContext = normalizeVisualAnswerContext({
          questionFocus: contexts.map((context) => context.questionFocus).filter(Boolean).join(" | "),
          studentAnswerSummary: contexts.map((context) => context.studentAnswerSummary).filter(Boolean).join("\n"),
          visibleMistakes: contexts.flatMap((context) => context.visibleMistakes || []),
          legibility: contexts.some((context) => context.legibility === "high")
            ? "high"
            : contexts.some((context) => context.legibility === "medium")
            ? "medium"
            : "low",
        });
        return mergeVisualAnswerContexts(mergedGeminiContext, await ocrContextPromise);
      }
    } catch (error) {
      console.error("gemini answered-page image reading failed:", error);
    }
  }

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
        return mergeVisualAnswerContexts(normalizeVisualAnswerContext({
          questionFocus: contexts.map((context) => context.questionFocus).filter(Boolean).join(" | "),
          studentAnswerSummary: contexts.map((context) => context.studentAnswerSummary).filter(Boolean).join("\n"),
          visibleMistakes: contexts.flatMap((context) => context.visibleMistakes || []),
          legibility: contexts.some((context) => context.legibility === "high")
            ? "high"
            : contexts.some((context) => context.legibility === "medium")
            ? "medium"
            : "low",
        }), await ocrContextPromise);
      }
    } catch (error) {
      console.error(`${cloudAttempt.provider} answered-page image reading failed:`, error);
    }
  }

  const ocrContext = await ocrContextPromise;
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
  sourcePolicy: string,
  options?: {
    expectedQuestionCount?: number | null;
    providerTrace?: DraftProviderTrace | null;
    validPageNumbers?: Set<number> | null;
  }
): DraftMarkResponse => {
  const expectedQuestionCount = options?.expectedQuestionCount ?? null;
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
        correctAnswer: asText(e.correctAnswer).slice(0, 200) || undefined,
        marksAwarded: Math.max(0, mqForQ != null ? Math.min(mqForQ, marksAwarded) : marksAwarded),
        maxMarksForQuestion: mqForQ,
        reason: asText(e.reason).slice(0, 200),
        answerAnchor: normalizeQuestionAnswerAnchor(e.answerAnchor, options?.validPageNumbers ?? null),
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

  const questionCoverageRatio =
    expectedQuestionCount != null && expectedQuestionCount > 0
      ? normalizedBreakdown.length / expectedQuestionCount
      : null;
  const weakAllocationCoverage = accountedMaxMarks === 0 || (maxMarks != null && accountedMaxMarks < maxMarks * 0.6);
  if (
    maxMarks != null &&
    maxMarks >= 20 &&
    expectedQuestionCount != null &&
    expectedQuestionCount >= 4 &&
    normalizedBreakdown.length > 0 &&
    questionCoverageRatio != null &&
    questionCoverageRatio < 0.4 &&
    weakAllocationCoverage
  ) {
    clampedMark = null;
    warnings.push(
      `AI only produced ${normalizedBreakdown.length}/${expectedQuestionCount} expected question rows. It likely did not read enough of the paper/answers to produce a fair final mark.`
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
    providerTrace: options?.providerTrace ?? undefined,
  };
};

const draftCompletenessScore = (
  raw: Partial<DraftMarkResponse>,
  maxMarks: number | null,
  expectedQuestionCount?: number | null
) => {
  const breakdown = Array.isArray(raw.questionBreakdown) ? raw.questionBreakdown : [];
  const accountedMarks = breakdown.reduce((sum, entry) => {
    const maxForQuestion = Number((entry as Partial<QuestionMarkEntry>)?.maxMarksForQuestion ?? 0);
    return sum + (Number.isFinite(maxForQuestion) && maxForQuestion > 0 ? maxForQuestion : 0);
  }, 0);
  const breakdownCount = breakdown.filter((entry) => asText((entry as Partial<QuestionMarkEntry>)?.question)).length;
  const markPresent = raw.suggestedMark != null && Number.isFinite(Number(raw.suggestedMark));
  const confidenceScore = raw.confidence === "high" ? 20 : raw.confidence === "medium" ? 10 : 0;
  const allocationCoverageScore = maxMarks && maxMarks > 0 && accountedMarks > 0
    ? Math.min(35, (accountedMarks / maxMarks) * 35)
    : 0;
  const questionCoverageScore = expectedQuestionCount && expectedQuestionCount > 0
    ? Math.min(40, (Math.min(breakdownCount, expectedQuestionCount) / expectedQuestionCount) * 40)
    : Math.min(25, breakdownCount * 3);
  return questionCoverageScore + allocationCoverageScore + confidenceScore + (markPresent ? 10 : 0) + Math.min(15, breakdownCount);
};

const chooseBetterDraftJson = (
  currentJson: string | null,
  candidateJson: string | null,
  maxMarks: number | null,
  expectedQuestionCount?: number | null
) => {
  if (!candidateJson) return currentJson;
  if (!currentJson) return candidateJson;
  try {
    const current = JSON.parse(currentJson) as Partial<DraftMarkResponse>;
    const candidate = JSON.parse(candidateJson) as Partial<DraftMarkResponse>;
    return draftCompletenessScore(candidate, maxMarks, expectedQuestionCount) > draftCompletenessScore(current, maxMarks, expectedQuestionCount) + 5
      ? candidateJson
      : currentJson;
  } catch {
    return currentJson;
  }
};

const requestGroqMarkingDraft = async ({
  prompt,
  signal,
  model,
}: {
  prompt: string;
  signal?: AbortSignal;
  model?: string;
}) => {
  if (!GROQ_API_KEY) return null;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 20000);
  const requestSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  const primaryCooldownKey = `groq:text:${GROQ_TEXT_MODEL}`;
  const targetModel = model || (isProviderCoolingDown(primaryCooldownKey) ? GROQ_FALLBACK_TEXT_MODEL : GROQ_TEXT_MODEL);

  const systemContent = DRAFT_MARKING_SYSTEM_PROMPT;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: targetModel,
        temperature: 0,
        max_tokens: 2500,
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
      // On 429 rate-limit for the primary model, automatically retry with the fallback model
      if (response.status === 429 && targetModel === GROQ_TEXT_MODEL && GROQ_FALLBACK_TEXT_MODEL !== GROQ_TEXT_MODEL) {
        noteProviderRateLimit(primaryCooldownKey);
        clearTimeout(timeoutHandle);
        console.error(`Groq primary model rate-limited (429), retrying with ${GROQ_FALLBACK_TEXT_MODEL}`);
        return requestGroqMarkingDraft({
          prompt: summarizeLongText(prompt, 6500),
          signal,
          model: GROQ_FALLBACK_TEXT_MODEL,
        });
      }
      if (response.status === 429) noteProviderRateLimit(`groq:text:${targetModel}`);
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

  const cooldownKey = `gemini:marking:${pageImages.length > 0 ? "vision" : "text"}:${GEMINI_MODEL}`;
  if (isProviderCoolingDown(cooldownKey)) {
    throw new Error("Gemini marking is cooling down after a rate limit.");
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 22000);
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
            maxOutputTokens: 2500,
            temperature: 0,
            topP: 0.9,
          },
        }),
        signal: requestSignal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      if (response.status === 429) noteProviderRateLimit(cooldownKey);
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

  const cooldownKey = `groq:marking-vision:${GROQ_VISION_MODEL}`;
  if (isProviderCoolingDown(cooldownKey)) {
    throw new Error("Groq vision marking is cooling down after a rate limit.");
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 22000);
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
        max_tokens: 2500,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: DRAFT_MARKING_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `${prompt}\n\nThe attached images are the student's answered PDF pages. Read the PDF questions and the student's handwriting/typed overlays directly from these images. Treat those visible marks as primary evidence, connect each answer to its matching question, and mark fairly like a teacher.`,
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
      if (response.status === 429) noteProviderRateLimit(cooldownKey);
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
  const timeoutHandle = setTimeout(() => controller.abort(), 22000);
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
        max_tokens: 2500,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: DRAFT_MARKING_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `${prompt}\n\nThe attached images are the student's answered PDF pages. Read handwriting/typed overlays directly from them, treat them as primary evidence of the student's answer, and mark fairly like a teacher.`,
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
  const routeStartedAt = Date.now();
  const hasRouteBudget = (minimumMs = 6000) => Date.now() - routeStartedAt < 52000 - minimumMs;

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
  const draftCacheKey = buildDraftRequestCacheKey(body, pageImages, pageImagePageNumbers);
  const cachedDraft = getCachedDraftResponse(draftCacheKey);
  if (cachedDraft) {
    console.info(
      "[ai/marking/draft] cache-hit",
      JSON.stringify({
        title,
        subjectName,
        suggestedMark: cachedDraft.suggestedMark,
        confidence: cachedDraft.confidence,
      })
    );
    return jsonResponse(cachedDraft);
  }
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
  const expectedQuestionCount = estimateLikelyQuestionCount(paperContext);

  // Keep the marking prompt compact enough to finish before the web proxy timeout.
  const promptPaperContext = summarizeLongText(paperContext, 6500);

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
  const shouldReadAnsweredPageImages = pageImages.length > 0 && (!hasSubstantialTypedAnswers || hasPenStrokes);
  let visualContext: VisualAnswerContext | null = null;
  let visualWarning = "";

  if (shouldReadAnsweredPageImages && hasRouteBudget(15000)) {
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
    pageImages.length > 0 || hasPenStrokes ? 3500 : 4000
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
  - For each MCQ or T/F: find the option the student circled, crossed, ticked, underlined, or marked by handwriting.
  - For True/False specifically, treat handwritten words like "true", "false", "T", "F", and signs like ticks/crosses beside True or False as the student's selected answer.
  - Determine if that option is factually CORRECT.
  - Award the full mark for that question if correct; award 0 if wrong.
  - NEVER give partial marks to a single MCQ. (You cannot get "3 out of 5" for one MCQ.)
  - Default mark per MCQ is 1 mark each UNLESS the paper clearly states a different allocation.

STEP 3 — SHORT-ANSWER / ESSAY RULE:
  - Find the student's written answer to each question.
  - Check it against the correct answer using your own subject knowledge, the wording of the question, and the mark allocation.
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
Use your own subject knowledge to determine the correct answer. The exam paper usually contains questions only, not an answer key.
If answered-page images are attached, treat visible handwriting/circles/ticks/typed overlays on those images as primary evidence of the student's answer.
Only include answerAnchor when you can DIRECTLY see the selected option or handwritten True/False mark in attached answered-page images for this request. If you are relying only on extracted text/OCR summaries or the location is uncertain, set answerAnchor to null.
For answerAnchor coordinates, use the PDF page number shown with the attached answered-page image and use normalized page coordinates from 0 to 1000 where x/y is the top-left of the selected option box and width/height covers the selected option or handwritten True/False mark.
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
      "studentAnswer": "[exact option letter + text for MCQ, e.g. \"(b) You can shorten your prayer\"; or student's written text for short-answer]",
      "correctAnswer": "[the correct answer for this question — e.g. \"(a) You pray full salah\" for MCQ, or the key points for short-answer; leave empty string if student was fully correct]",
      "marksAwarded": integer,
      "maxMarksForQuestion": integer or null,
      "reason": "[for MCQ: state whether option was correct or wrong and why; for short-answer: what key points were present or missing]",
      "answerAnchor": null | {
        "pageNumber": integer,
        "x": integer 0-1000,
        "y": integer 0-1000,
        "width": integer 0-1000,
        "height": integer 0-1000,
        "confidence": "low" | "medium" | "high",
        "evidence": "circle" | "tick" | "cross" | "underline" | "handwritten-true" | "handwritten-false" | "written-word"
      }
    }
  ],
  "suggestedMark": integer = exact sum of marksAwarded; null if the paper/answers are too incomplete to account for most allocated marks,
  "feedback": "WRONG QUESTIONS ONLY. For each wrong question write: 'Q[num]: [question text]: student wrote \"[wrong answer]\" — correct: [correct answer]. -[N] mark(s).' Start with 'Deductions:'. If all correct write 'No deductions found.' Do NOT write WWW, EBI, praise, or general advice.",
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
2. feedback must list ONLY wrong questions. Do NOT write WWW or EBI.
3. For each wrong question use EXACTLY this format:
   'Q[num]: [question text]: student wrote "[wrong answer]" — correct: [correct answer]. -[N] mark(s).'
   Start feedback with 'Deductions:'. If nothing is wrong, write "No deductions found."
4. confidence = low, medium, or high.
5. warnings = []`;

  const tinyOllamaPrompt = `Return ONLY valid JSON. Give a teacher-review draft mark.
Max marks: ${maxMarks ?? "unknown"}
Subject: ${subjectName}
Paper excerpt: ${summarizeLongText(promptPaperContext || paperContext || "No paper text.", 220)}
Student answer excerpt: ${summarizeLongText(readableAnswerText || visualContext?.studentAnswerSummary || studentText || "No readable answer.", 260)}
Rules: suggestedMark=integer 0-${maxMarks ?? "max"}. feedback=WRONG questions only, format 'Q[num]: [question]: student wrote "[wrong]" — correct: [answer]. -[N] mark(s).' Start with 'Deductions:' or write 'No deductions found.' No WWW/EBI.
JSON schema: {"suggestedMark":number,"feedback":"Deductions: ...","rationale":"brief","confidence":"low|medium|high","warnings":[]}`;

  try {
    const modelWarnings: string[] = [];
    const providerAttempts: string[] = [];
    let selectedProviderLabel = "";
    let recheckProviderLabel = "";
    if (visualWarning) modelWarnings.push(visualWarning);
    if (paperReadMethod === "vision") {
      modelWarnings.push("Exam paper is a scanned image \u2014 questions were read visually. Verify question text matches the original paper before relying on this draft mark.");
    }
    let rawJson: string | null = null;
    const recordProviderAttempt = (label: string) => {
      const cleanLabel = asText(label);
      if (cleanLabel && !providerAttempts.includes(cleanLabel)) {
        providerAttempts.push(cleanLabel);
      }
      return cleanLabel;
    };
    const considerDraftCandidate = (candidateJson: string | null, label: string) => {
      if (!candidateJson) return;
      const cleanLabel = recordProviderAttempt(label);
      const previousRawJson = rawJson;
      const nextRawJson = chooseBetterDraftJson(previousRawJson, candidateJson, maxMarks, expectedQuestionCount);
      rawJson = nextRawJson;
      if (nextRawJson === candidateJson && (previousRawJson == null || nextRawJson !== previousRawJson || !selectedProviderLabel)) {
        selectedProviderLabel = cleanLabel;
      }
    };
    const normalizeWithProviderTrace = (raw: Partial<DraftMarkResponse>) => {
      const normalized = normalizeDraft(raw, maxMarks, sourcePolicy, {
        expectedQuestionCount,
        validPageNumbers: new Set(pageImagePageNumbers.filter((pageNumber) => Number.isFinite(pageNumber) && pageNumber > 0)),
        providerTrace: buildProviderTrace({
          selected: selectedProviderLabel,
          attempts: providerAttempts,
          recheck: recheckProviderLabel,
        }),
      });
      logDraftProviderTrace({
        providerTrace: normalized.providerTrace,
        suggestedMark: normalized.suggestedMark,
        confidence: normalized.confidence,
        title,
        subjectName,
      });
      return normalized;
    };
    const tryTinyLocalDraft = async (reason: string) => {
      const tinyProviderLabel = `Local Ollama emergency fallback (${OLLAMA_TINY_FALLBACK_MODEL})`;
      recordProviderAttempt(tinyProviderLabel);
      try {
        const tinyPayload = await requestOllamaDraft({
          model: OLLAMA_TINY_FALLBACK_MODEL,
          prompt: tinyOllamaPrompt,
          options: {
            num_predict: 80,
            num_ctx: 384,
          },
          timeoutMs: 6000,
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
    if (GROQ_API_KEY && hasSubstantialTypedAnswers && hasRouteBudget(22000)) {
      const groqTextProviderLabel = `Groq text (${GROQ_TEXT_MODEL})`;
      recordProviderAttempt(groqTextProviderLabel);
      try {
        const groqPayload = await requestGroqMarkingDraft({ prompt });
        considerDraftCandidate(
          extractFirstJsonObject(String(groqPayload?.response || "")),
          groqTextProviderLabel
        );
      } catch (error) {
        console.error("Groq text marking failed, falling back to vision/Ollama:", error);
      }
    }

    // 2. For handwriting-heavy papers, prefer Gemini multimodal when configured, then fall back
    // to Groq/OpenRouter because Gemini tends to be stronger on mixed handwriting + overlays.
    if (GEMINI_API_KEY && pageImages.length > 0 && !hasSubstantialTypedAnswers && hasRouteBudget(24000)) {
      const geminiProviderLabel = `Gemini multimodal (${GEMINI_MODEL})`;
      recordProviderAttempt(geminiProviderLabel);
      try {
        const geminiPrompt = `${prompt}\n\nIMPORTANT: ${pageImages.length} answered-page image(s) are attached. Read the student's handwriting/text overlays directly from these images as the primary evidence. Match each visible answer to the PDF question on the same page.`;
        const geminiPayload = await requestGeminiDraftMark({
          prompt: geminiPrompt,
          pageImages: pageImages.slice(0, 8),
          pageNumbers: pageImagePageNumbers.slice(0, 8),
        });
        considerDraftCandidate(
          extractFirstJsonObject(String(geminiPayload?.response || "")),
          geminiProviderLabel
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("Gemini multimodal marker failed, trying Groq/OpenRouter/Ollama:", error);
      }
    }

    if (!rawJson && GROQ_API_KEY && pageImages.length > 0 && !hasSubstantialTypedAnswers && hasRouteBudget(24000)) {
      const groqVisionProviderLabel = `Groq vision (${GROQ_VISION_MODEL})`;
      recordProviderAttempt(groqVisionProviderLabel);
      try {
        const groqVisionPayload = await requestGroqVisionDraftMark({
          prompt,
          pageImages: pageImages.slice(0, 5),
          pageNumbers: pageImagePageNumbers.slice(0, 5),
        });
        considerDraftCandidate(
          extractFirstJsonObject(String(groqVisionPayload?.response || "")),
          groqVisionProviderLabel
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("Groq vision marker failed, trying OpenRouter/Groq text/Ollama:", error);
      }
    }

    if (!rawJson && OPENROUTER_API_KEY && pageImages.length > 0 && !hasSubstantialTypedAnswers && hasRouteBudget(24000)) {
      const openRouterProviderLabel = `OpenRouter multimodal (${OPENROUTER_VISION_MODEL})`;
      recordProviderAttempt(openRouterProviderLabel);
      try {
        const openRouterPayload = await requestOpenRouterDraftMark({
          prompt,
          pageImages: pageImages.slice(0, 8),
          pageNumbers: pageImagePageNumbers.slice(0, 8),
        });
        considerDraftCandidate(
          extractFirstJsonObject(String(openRouterPayload?.response || "")),
          openRouterProviderLabel
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
    if (!rawJson && GROQ_API_KEY && !hasSubstantialTypedAnswers && hasRouteBudget(22000)) {
      const groqTextProviderLabel = `Groq text (${GROQ_TEXT_MODEL})`;
      recordProviderAttempt(groqTextProviderLabel);
      try {
        const groqPayload = await requestGroqMarkingDraft({ prompt });
        considerDraftCandidate(
          extractFirstJsonObject(String(groqPayload?.response || "")),
          groqTextProviderLabel
        );
        if (rawJson && visualWarning) {
          const ocrWarningIdx = modelWarnings.indexOf(visualWarning);
          if (ocrWarningIdx !== -1) modelWarnings.splice(ocrWarningIdx, 1);
        }
      } catch (error) {
        console.error("Groq text marking failed, falling back to Ollama:", error);
      }
    }

    // 3b. For typed/text-only papers, prefer Gemini as a cloud fallback before dropping to local Ollama.
    // This keeps typed answers on a stronger hosted model when Groq is rate-limited or its fallback rejects the prompt size.
    if (GEMINI_API_KEY && !rawJson && (hasSubstantialTypedAnswers || pageImages.length === 0) && hasRouteBudget(24000)) {
      const geminiTextProviderLabel = `Gemini text fallback (${GEMINI_MODEL})`;
      recordProviderAttempt(geminiTextProviderLabel);
      try {
        const geminiTextPayload = await requestGeminiDraftMark({ prompt });
        considerDraftCandidate(
          extractFirstJsonObject(String(geminiTextPayload?.response || "")),
          geminiTextProviderLabel
        );
      } catch (error) {
        console.error("Gemini text fallback failed, falling back to Ollama:", error);
      }
    }

    // 3. If no cloud model produced valid JSON, fall back to local Ollama.
    if (!rawJson && hasRouteBudget(10000)) {
      const localFastProviderLabel = `Local Ollama fast fallback (${OLLAMA_FAST_FALLBACK_MODEL})`;
      recordProviderAttempt(localFastProviderLabel);
      try {
        const fallbackPayload = await requestOllamaDraft({
          model: OLLAMA_FAST_FALLBACK_MODEL,
          prompt: ollamaPrompt,
          options: {
            num_predict: 110,
            num_ctx: 384,
          },
          timeoutMs: 8000,
        });
        considerDraftCandidate(
          extractFirstJsonObject(String(fallbackPayload.response || "")),
          localFastProviderLabel
        );
        // Schedule a background keep-alive so the model stays warm for the next teacher
        setTimeout(() => {
          fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: OLLAMA_FAST_FALLBACK_MODEL, prompt: "", keep_alive: OLLAMA_KEEP_ALIVE }),
          }).catch(() => undefined);
        }, 100);
        if (!rawJson) {
          considerDraftCandidate(
            await tryTinyLocalDraft("the normal local model did not return valid JSON"),
            `Local Ollama emergency fallback (${OLLAMA_TINY_FALLBACK_MODEL})`
          );
        }
        if (!rawJson) {
          if (!shouldAttemptReasoner) {
            return jsonResponse(
              normalizeWithProviderTrace({
                suggestedMark: null,
                feedback: String(fallbackPayload.response || "AI returned an unreadable response."),
                rationale: "The local model did not return valid JSON.",
                confidence: "low",
                warnings: [...modelWarnings, "Local model response was not valid JSON."],
              })
            );
          }
        }
      } catch (error) {
        const aborted = error instanceof Error && error.name === "AbortError";
        if (aborted) {
          considerDraftCandidate(
            await tryTinyLocalDraft("the normal local model timed out"),
            `Local Ollama emergency fallback (${OLLAMA_TINY_FALLBACK_MODEL})`
          );
        }
        if (!rawJson && aborted) {
          if (!shouldAttemptReasoner) {
            return jsonResponse(
              normalizeWithProviderTrace({
                suggestedMark: null,
                feedback: "No deductions list was produced because AI Draft Mark could not finish quickly enough. Please try again after the paper loads or mark manually.",
                rationale: "The local model reached the time limit before returning a safe draft.",
                confidence: "low",
                warnings: [...modelWarnings, "Local AI timed out before completing the draft."],
              })
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

    if (!rawJson && !hasRouteBudget(10000)) {
      return jsonResponse(
        normalizeWithProviderTrace({
          suggestedMark: null,
          feedback: "AI Draft Mark could not finish before the safe time limit. Please try again; if it repeats, mark this paper manually while provider quota recovers.",
          rationale: "Cloud vision/text providers were slow or rate-limited.",
          confidence: "low",
          warnings: [...modelWarnings, "AI marking stopped early to avoid the page hanging or nginx timeout."],
        })
      );
    }

    if (!rawJson && shouldAttemptReasoner) {
      const localReasonerProviderLabel = `Local Ollama reasoner (${OLLAMA_MODEL})`;
      recordProviderAttempt(localReasonerProviderLabel);
      try {
        const deepseekPayload = await requestOllamaDraft({
          model: OLLAMA_MODEL,
          prompt,
          options: {
            num_predict: 80,
            num_ctx: 3072,
          },
          timeoutMs: 7000,
        });
        considerDraftCandidate(
          extractFirstJsonObject(String(deepseekPayload.response || "")),
          localReasonerProviderLabel
        );
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
        if (shouldRecheck && pageImages.length === 0 && prompt.length < 8000) {
          const groqRecheckProviderLabel = `Groq reasoning recheck (${GROQ_REASONING_MODEL})`;
          recordProviderAttempt(groqRecheckProviderLabel);
          recheckProviderLabel = groqRecheckProviderLabel;
          const recheckPayload = await requestGroqReasoningRecheck({ prompt });
          const recheckJson = extractFirstJsonObject(String(recheckPayload?.response || ""));
          considerDraftCandidate(recheckJson, groqRecheckProviderLabel);
        }
      } catch {
        // Re-check failed — keep the original rawJson
      }
    }

    if (!rawJson) {
      return jsonResponse(
        normalizeWithProviderTrace({
          suggestedMark: null,
          feedback: "No deductions list was produced because AI Draft Mark could not produce a reliable structured draft from this answer. Please review it manually.",
          rationale: "The available model responses were incomplete or unreadable.",
          confidence: "low",
          warnings: [...modelWarnings, shouldAttemptReasoner ? "Fast and reasoner models could not return a reliable draft." : "Local model response was not reliable enough to use."],
        })
      );
    }

    const parsed = repairContradictoryAnswerEvidence(
      JSON.parse(rawJson) as Partial<DraftMarkResponse>,
      Boolean(studentText || visualContext?.studentAnswerSummary)
    );
    if (modelWarnings.length > 0) {
      parsed.warnings = [...(Array.isArray(parsed.warnings) ? parsed.warnings : []), ...modelWarnings];
    }
    const normalizedDraft = normalizeWithProviderTrace(parsed);
    cacheDraftResponse(draftCacheKey, normalizedDraft);
    return jsonResponse(normalizedDraft);
  } catch (error) {
    console.error("[ai/marking/draft] unhandled failure", error);
    return jsonResponse(
      {
        message:
          error instanceof Error && error.message
            ? error.message.slice(0, 500)
            : "AI draft mark failed before a safe draft could be created.",
      },
      503
    );
  }
}