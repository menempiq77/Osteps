import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_FAST_TEXT_MODEL = process.env.GROQ_ASSISTANT_FAST_MODEL || "llama-3.1-8b-instant";
const GROQ_TEXT_MODEL = process.env.GROQ_ASSISTANT_TEXT_MODEL || GROQ_FAST_TEXT_MODEL;
// Use a different model family so its TPM quota is independent of the primary model.
const GROQ_FALLBACK_TEXT_MODEL = process.env.GROQ_ASSISTANT_FALLBACK_MODEL || "gemma2-9b-it";
const GROQ_SECONDARY_FALLBACK_MODEL = process.env.GROQ_ASSISTANT_FALLBACK_MODEL_2 || "llama-3.3-70b-versatile";
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const execFileAsync = promisify(execFile);

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AssistantRequestBody = {
  messages: ChatMessage[];
  context?: {
    page?: string;           // e.g. "marking", "quiz", "assessment", "worksheet"
    pageUrl?: string;
    pageTitle?: string;
    selectedText?: string;
    visibleText?: string;
    subject?: string;
    title?: string;
    maxMarks?: number | null;
    suggestedMark?: number | null;
    feedback?: string;
    rationale?: string;
    studentAnswer?: string;
    paperContext?: string;
    fileUrl?: string;        // PDF file URL — server will extract exam paper text from it
    assessmentContext?: string;
    questionBreakdown?: string;
    extraContext?: string;
  };
};

// ---------------------------------------------------------------------------
// PDF paper text extraction (server-side, reuses pdftotext)
// ---------------------------------------------------------------------------

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

const extractPaperTextForAssistant = async (fileUrl: string): Promise<string> => {
  const rawUrl = String(fileUrl || "").trim();
  if (!rawUrl) return "";
  let normalizedUrl = "";
  try {
    const u = new URL(rawUrl);
    u.hash = "";
    normalizedUrl = u.toString();
  } catch {
    normalizedUrl = rawUrl.replace(/#.*$/, "");
  }
  const localPath = resolveLocalPaperPath(normalizedUrl);
  if (!localPath) return "";
  for (const useLayout of [true, false]) {
    try {
      const args = useLayout
        ? ["-layout", "-enc", "UTF-8", localPath, "-"]
        : ["-enc", "UTF-8", localPath, "-"];
      const { stdout } = await execFileAsync("pdftotext", args, {
        maxBuffer: 4 * 1024 * 1024,
        timeout: 9000,
      });
      const text = String(stdout || "").replace(/\s+/g, " ").trim();
      if (text.length > 50) return text.slice(0, 14000);
    } catch {
      // try next option
    }
  }
  return "";
};

const SYSTEM_PROMPT = `You are OSTEPS AI Assistant — a highly knowledgeable school assistant for teachers and educators. You have deep expertise in Islamic Studies, Quran, Hadith, Arabic, Fiqh, Aqeedah, and all school subjects.

You can help with:
- **Marking & feedback**: Review student answers question by question, state whether each answer is correct or wrong, give the correct answer using your subject knowledge, award marks, and give a total.
- **Subject knowledge**: You have comprehensive knowledge of Islamic Education, Arabic Language, Quran, Hadith, Seerah, Fiqh, Aqeedah, Maths, Science, English, and more. Use this knowledge confidently to evaluate student answers.
- **Creating assessments**: Draft quiz questions, exam papers, worksheets, MCQs, fill-in-the-blanks, short-answer and essay prompts.
- **Lesson planning**: Suggest activities, learning objectives, differentiated tasks.
- **General teaching support**: Rubrics, feedback templates, progress comments, parent report phrases.

CRITICAL MARKING RULES:
1. When marking, ALWAYS go question by question without skipping any.
2. For EVERY question, state: question number, the student's exact answer, CORRECT or WRONG, the correct answer, and marks awarded.
3. NEVER say "the correct answer is not clear from the provided text" — use your own deep subject knowledge to determine the correct answer. For Islamic Studies, Arabic, Quran, Fiqh etc. you ALWAYS know the correct answer.
4. The exam paper PDF contains QUESTIONS only (no answer key) — that is normal. You must supply the correct answers from your knowledge.
5. For MCQ/True-False questions, the selected answer is the option that the visual evidence says was circled/ticked/underlined/marked. Trust lines like "Q1: selected option (a) You pray full salah" as the student's answer.
6. IGNORE student names, class names, dates, headers, school names, and standalone words from form fields (for example "Merub") — these are NEVER answers.
7. If visual evidence gives a selected option and typed evidence gives only a name/header, use the selected option, not the name/header.
8. The "Student's typed / handwriting / visual answer evidence" lines are NOT pre-matched to question numbers. Each "[Page N] ..." line is a typed text box from the student. You MUST match each piece of evidence to the most relevant question by reading its content (e.g. a line about "Ten year truce ... with the Muslims" answers a treaty question even if it is the first text box on the page).
9. NEVER say "Student's answer: not provided" if there is any typed text box, handwriting, or visual evidence on the page that plausibly answers the question. Search ALL the evidence before declaring an answer missing.
10. ABSOLUTELY FORBIDDEN: NEVER ask the teacher to "share the assessment document", "provide the PDF", "provide clear question numbers", "remove extraneous information", or issue any checklist of requirements. The PDF text and student evidence are ALREADY provided below under CURRENT CONTEXT. If a section is genuinely missing, say in ONE short sentence what is missing and stop — no requirement list, no checklist, no numbered steps.
11. Start marking IMMEDIATELY with "Q1:" — zero preamble, zero "to mark fairly I need…", zero requirement lists, zero apologies.
12. End with: Total marks awarded / Total marks available, and 1-2 sentences of overall feedback.
13. Be concise and practical. Teachers are busy.
14. Respond in the same language the teacher uses (Arabic or English).
15. If questionBreakdown context is provided, you may explain, audit, improve, or challenge it.`;

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI assistant is not available: no API key configured." },
      { status: 503 }
    );
  }

  let body: AssistantRequestBody;
  try {
    body = (await req.json()) as AssistantRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const ctx = body.context ?? {};

  // If fileUrl is provided but paperContext is missing, extract paper text server-side
  let resolvedPaperContext = ctx.paperContext || "";
  if (!resolvedPaperContext && ctx.fileUrl) {
    try {
      resolvedPaperContext = await extractPaperTextForAssistant(ctx.fileUrl);
    } catch {
      // ignore extraction errors — AI will work with what it has
    }
  }

  // Build context block so the AI knows what the teacher is currently working on
  const contextLines: string[] = [];
  if (ctx.page) contextLines.push(`Current page/task: ${ctx.page}`);
  if (ctx.pageUrl) contextLines.push(`Current URL: ${ctx.pageUrl}`);
  if (ctx.pageTitle) contextLines.push(`Browser page title: ${ctx.pageTitle}`);
  // Detect follow-up turns: after the assistant has already answered once with the heavy
  // marking context, re-sending the entire paper + student evidence on every user message
  // blows the Groq TPM budget (6000/min). The model already has the marking in conversation
  // history, so on follow-ups we keep ONLY the lightweight context lines.
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const isFollowUp = userMessageCount > 1;

  if (ctx.title) contextLines.push(`Assessment title: ${ctx.title}`);
  if (ctx.subject) contextLines.push(`Subject: ${ctx.subject}`);
  if (ctx.maxMarks != null) contextLines.push(`Total marks: ${ctx.maxMarks}`);
  if (ctx.suggestedMark != null) contextLines.push(`AI suggested mark: ${ctx.suggestedMark}`);
  if (ctx.assessmentContext) contextLines.push(`Assessment workspace context:\n${ctx.assessmentContext.slice(0, 1200)}`);
  if (ctx.selectedText) contextLines.push(`Teacher selected text:\n${ctx.selectedText.slice(0, 1200)}`);
  if (!isFollowUp && ctx.visibleText) contextLines.push(`Visible page text:\n${ctx.visibleText.slice(0, 1800)}`);
  if (ctx.feedback) contextLines.push(`AI feedback given:\n${ctx.feedback}`);
  if (ctx.rationale) contextLines.push(`Marking rationale: ${ctx.rationale}`);
  if (ctx.questionBreakdown) contextLines.push(`Per-question mark breakdown JSON:\n${ctx.questionBreakdown.slice(0, 2500)}`);
  if (!isFollowUp && resolvedPaperContext) contextLines.push(`Exam paper / questions:\n${resolvedPaperContext.slice(0, 6500)}`);
  if (!isFollowUp && ctx.studentAnswer) {
    // Strip lines that are obviously just a student name / header field (1-2 short
    // capitalized words, no punctuation/digits) so the marker never treats a name as the answer.
    const sanitizedStudentAnswer = ctx.studentAnswer
      .split(/\r?\n/)
      .filter((line) => {
        // Strip optional leading "Q1:", "Q1 [Page 1]:", "[Page 1]" prefixes before testing
        const stripped = line
          .replace(/^\s*Q\d+\s*(\[[^\]]*\])?\s*:\s*/i, "")
          .replace(/^\s*\[Page\s*\d+\]\s*/i, "")
          .trim();
        if (!stripped) return true;
        if (stripped.length > 25) return true;
        if (/[?.!,;:0-9]/.test(stripped)) return true;
        const words = stripped.split(/\s+/);
        if (words.length > 2) return true;
        // Drop standalone capitalized name (Latin or Arabic) of 1-2 words
        return !/^[A-Z\u0600-\u06FF][A-Za-z\u0600-\u06FF\-']{1,20}(\s+[A-Z\u0600-\u06FF][A-Za-z\u0600-\u06FF\-']{1,20})?$/.test(stripped);
      })
      .join("\n")
      .slice(0, 4500);
    contextLines.push(`Student's typed / handwriting / visual answer evidence (name/header fields removed). Typed text boxes are labeled by [Page N] and are NOT pre-matched to question numbers — match each piece of evidence to the most relevant question by reading the content:\n${sanitizedStudentAnswer}`);
  }
  if (ctx.extraContext) contextLines.push(`Extra context:\n${ctx.extraContext.slice(0, 1200)}`);

  // If the teacher opened marking mode but we have no paper and no student evidence,
  // give the model an explicit instruction so it responds with one sentence, not a checklist.
  const hasPaper = Boolean(resolvedPaperContext && resolvedPaperContext.trim().length > 20);
  const hasStudentEvidence = Boolean(ctx.studentAnswer && ctx.studentAnswer.trim().length > 5);
  if (ctx.page === "marking" && !isFollowUp && !hasPaper && !hasStudentEvidence) {
    contextLines.push(
      `WARNING: No exam paper text and no student evidence could be extracted. ` +
      `Reply with exactly this one sentence and nothing else: ` +
      `"I could not read the paper — please make sure the PDF has finished loading, then close and re-open the AI assistant."`
    );
  }

  const systemContent = contextLines.length > 0
    ? `${SYSTEM_PROMPT}\n\n---\nCURRENT CONTEXT:\n${contextLines.join("\n\n")}`
    : SYSTEM_PROMPT;

  // For follow-up turns, trim assistant marking responses (often >2k tokens) so we
  // stay under the 6000 TPM budget. Keep at most 1500 chars per assistant turn.
  const trimmedMessages = isFollowUp
    ? messages.slice(-6).map((m) =>
        m.role === "assistant" && m.content.length > 1500
          ? { ...m, content: m.content.slice(0, 1500) + "\n…[trimmed]" }
          : m
      )
    : messages.slice(-8);

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_TEXT_MODEL,
          temperature: 0.4,
          max_tokens: 1000,
          stream: true,
          messages: [
            { role: "system", content: systemContent },
            ...trimmedMessages,
          ],
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      // On 429 rate-limit, retry with fallback models (each is a different family with its own quota).
      if (response.status === 429) {
        clearTimeout(timeoutHandle);
        for (const fallbackModel of [GROQ_FALLBACK_TEXT_MODEL, GROQ_SECONDARY_FALLBACK_MODEL]) {
          if (!fallbackModel || fallbackModel === GROQ_TEXT_MODEL) continue;
          const fallbackController = new AbortController();
          const fallbackTimeout = setTimeout(() => fallbackController.abort(), 45000);
          try {
            const fallbackResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
              body: JSON.stringify({
                model: fallbackModel,
                temperature: 0.4,
                max_tokens: 1000,
                stream: true,
                messages: [{ role: "system", content: systemContent }, ...trimmedMessages],
              }),
              signal: fallbackController.signal,
            });
            if (fallbackResponse.ok) {
              const fallbackStream = new ReadableStream({
                async start(ctrl: ReadableStreamDefaultController) {
                  const reader = fallbackResponse.body!.getReader();
                  try {
                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) { ctrl.enqueue(new TextEncoder().encode("data: [DONE]\n\n")); ctrl.close(); break; }
                      ctrl.enqueue(value);
                    }
                  } catch { ctrl.close(); } finally { reader.releaseLock(); }
                },
              });
              return new NextResponse(fallbackStream, {
                headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
              });
            }
          } catch {
            // try next fallback
          } finally {
            clearTimeout(fallbackTimeout);
          }
        }
      }
      return NextResponse.json(
        { error: `AI error (${response.status}): ${err.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const stream = new ReadableStream({
      async start(ctrl: ReadableStreamDefaultController) {
        const reader = response.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              ctrl.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              ctrl.close();
              break;
            }
            ctrl.enqueue(value);
          }
        } catch {
          ctrl.close();
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Assistant request failed." },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutHandle);
  }
}
