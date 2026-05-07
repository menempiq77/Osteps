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
const OLLAMA_MODEL = process.env.OSTEPS_AI_MARKING_MODEL || process.env.OLLAMA_MODEL || "gemma3:4b";
const REQUEST_TIMEOUT_MS = Number(process.env.OSTEPS_AI_MARKING_TIMEOUT_MS || 45000);

const jsonResponse = (payload: unknown, status = 200) => NextResponse.json(payload, { status });

const asText = (value: unknown) => String(value ?? "").trim();

const isIslamicSubject = (subjectName: string, title: string) =>
  /islam|qur.?an|hadee|hadith|fiqh|aqeed|aqid|seerah|sunnah|tafsir/i.test(`${subjectName} ${title}`);

const compactStudentText = (annotations: Array<Record<string, unknown>> | undefined) => {
  const textItems = (annotations || [])
    .filter((annotation) => annotation?.type === "text")
    .map((annotation) => ({
      page: Number(annotation.page || 1),
      text: asText(annotation.text),
    }))
    .filter((annotation) => annotation.text.length > 0)
    .sort((left, right) => left.page - right.page);

  return textItems
    .map((annotation) => `[Page ${annotation.page}] ${annotation.text}`)
    .join("\n")
    .slice(0, 12000);
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
  const studentText = compactStudentText(body.studentAnnotations);
  const islamic = isIslamicSubject(subjectName, title);
  const sourcePolicy = islamic
    ? "Islamic subject: use only the supplied assessment context and approved OSTEPS/Sunni school resources. Do not use external web knowledge. If evidence is missing, say so."
    : "Non-Islamic subject: draft a teacher-reviewed mark from the submitted answer and normal curriculum knowledge. Do not invent unseen evidence.";

  if (!studentText) {
    return jsonResponse({
      suggestedMark: null,
      feedback: "No typed student answer was found in the online document annotations. This MVP can draft from typed answers only; scanned handwriting/images need OCR in a later phase.",
      rationale: "The request contained no student text annotations to assess.",
      confidence: "low",
      sourcePolicy,
      warnings: ["No typed student text found."],
    } satisfies DraftMarkResponse);
  }

  const prompt = `You are OSTEPS AI Draft Mark, helping a teacher mark one student's submitted work.

Important rules:
- Draft only. The teacher will review and save manually.
- Return strict JSON only, no markdown.
- Never say the mark is final.
- If the answer cannot be assessed from the provided student text, use suggestedMark null and confidence low.
- ${sourcePolicy}

Assessment:
- Title: ${title}
- Subject: ${subjectName}
- Student: ${asText(body.studentName) || asText(body.studentId) || "Unknown"}
- Maximum marks: ${maxMarks ?? "Unknown"}
- Existing teacher mark: ${asText(body.currentTeacherMarks) || "none"}
- Existing teacher feedback: ${asText(body.currentTeacherFeedback) || "none"}

Student answer text extracted from typed document annotations:
${studentText}

Return exactly this JSON shape:
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
    return jsonResponse(
      {
        message: aborted
          ? "Local Ollama AI marker timed out. Try again or use a smaller local model."
          : "Local Ollama AI marker is unavailable. Start Ollama on this server and pull the configured model.",
      },
      503
    );
  } finally {
    clearTimeout(timeout);
  }
}