import { promises as fs } from "fs";
import path from "path";
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

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OSTEPS_AI_MARKING_MODEL || process.env.OLLAMA_MODEL || "qwen2.5:0.5b";
const REQUEST_TIMEOUT_MS = Number(process.env.OSTEPS_AI_MARKING_TIMEOUT_MS || 50000);
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const PAPER_TEXT_CACHE_MS = 10 * 60 * 1000;

const paperTextCache = new Map<string, { pages: Array<{ num: number; text: string }>; cachedAt: number }>();

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

  return summarizeLongText(combined, 2600);
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

  let pdfBuffer: Buffer;
  const localPath = resolveLocalPaperPath(normalizedUrl);
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

  return summarizeLongText(combined, 5200);
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

const normalizeDraft = (
  raw: Partial<DraftMarkResponse>,
  maxMarks: number | null,
  sourcePolicy: string
): DraftMarkResponse => {
  const numericMark = raw.suggestedMark == null ? null : Number(raw.suggestedMark);
  const clampedMark = Number.isFinite(numericMark)
    ? Math.max(0, maxMarks == null ? numericMark : Math.min(maxMarks, numericMark))
    : null;
  const confidence = raw.confidence === "high" || raw.confidence === "medium" ? raw.confidence : "low";
  const warnings = Array.isArray(raw.warnings) ? raw.warnings.map(asText).filter(Boolean).slice(0, 6) : [];

  return {
    suggestedMark: clampedMark,
    feedback: asText(raw.feedback).slice(0, 1500) || "AI could not produce useful feedback. Please mark manually.",
    rationale: asText(raw.rationale).slice(0, 1500) || "No rationale was returned by the local model.",
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

  if (!studentText && !paperContext) {
    return jsonResponse({
      suggestedMark: null,
      feedback: "No readable student answer text was found in the online document annotations, and the exam paper text could not be extracted clearly enough to draft a mark.",
      rationale: "The request contained no usable answer text for assessment.",
      confidence: "low",
      sourcePolicy,
      warnings: ["No readable student answer text found."],
    } satisfies DraftMarkResponse);
  }

  const prompt = `OSTEPS AI Draft Mark. Return strict JSON only. Draft only; teacher reviews manually. Never call it final. ${sourcePolicy}

Title: ${title}
Subject: ${subjectName}
Student: ${asText(body.studentName) || asText(body.studentId) || "Unknown"}
Max marks: ${maxMarks ?? "Unknown"}

Use the exam paper text and the student's written answer together. Ignore metadata such as student name, date, or predicted/self-assessed grades.
If the student's answer is fully correct for the relevant question(s), award full marks. Only use suggestedMark null when the answer cannot be assessed from the supplied paper and answer text.

Exam paper text for the answered pages:
${paperContext || "Exam paper text could not be extracted."}

Student typed answer:
${studentText}

Keep feedback under 45 words and rationale under 35 words. Return exactly:
{
  "suggestedMark": number or null,
  "feedback": "short teacher-style feedback for the student",
  "rationale": "brief reason for the suggested mark for teacher review",
  "confidence": "low" | "medium" | "high",
  "warnings": ["short warning strings if needed"]
}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.1,
          top_p: 0.9,
          num_predict: 120,
          num_ctx: 4096,
        },
      }),
      signal: controller.signal,
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text().catch(() => "");
      return jsonResponse(
        { message: `Local Ollama AI marker is not ready (${ollamaResponse.status}). ${errorText}`.trim() },
        503
      );
    }

    const ollamaPayload = (await ollamaResponse.json()) as { response?: string };
    const rawJson = extractFirstJsonObject(String(ollamaPayload.response || ""));
    if (!rawJson) {
      return jsonResponse(
        normalizeDraft(
          {
            suggestedMark: null,
            feedback: String(ollamaPayload.response || "AI returned an unreadable response."),
            rationale: "The local model did not return valid JSON.",
            confidence: "low",
            warnings: ["Local model response was not valid JSON."],
          },
          maxMarks,
          sourcePolicy
        )
      );
    }

    const parsed = JSON.parse(rawJson) as Partial<DraftMarkResponse>;
    return jsonResponse(normalizeDraft(parsed, maxMarks, sourcePolicy));
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    if (aborted) {
      return jsonResponse(
        normalizeDraft(
          {
            suggestedMark: null,
            feedback: "AI Draft Mark could not finish quickly enough for this long answer. Please mark manually or try again after reducing the selected typed text.",
            rationale: "The local model reached the time limit before returning a safe draft.",
            confidence: "low",
            warnings: ["Local AI timed out before completing the draft."],
          },
          maxMarks,
          sourcePolicy
        )
      );
    }

    return jsonResponse(
      { message: "Local Ollama AI marker is unavailable. Start Ollama on this server and pull the configured model." },
      503
    );
  } finally {
    clearTimeout(timeout);
  }
}