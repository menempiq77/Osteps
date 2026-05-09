import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_FAST_TEXT_MODEL = process.env.GROQ_ASSISTANT_FAST_MODEL || "llama-3.1-8b-instant";
const GROQ_TEXT_MODEL = process.env.GROQ_ASSISTANT_TEXT_MODEL || GROQ_FAST_TEXT_MODEL;
const GROQ_FALLBACK_TEXT_MODEL = process.env.GROQ_ASSISTANT_FALLBACK_MODEL || "llama-3.1-8b-instant";
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
5. Always attempt a full marking when exam questions and student answers are provided. Never refuse or say you need more info unless something is completely absent.
6. End with: Total marks awarded / Total marks available, and 1-2 sentences of overall feedback.
7. Be concise and practical. Teachers are busy.
8. Respond in the same language the teacher uses (Arabic or English).
9. If questionBreakdown context is provided, you may explain, audit, improve, or challenge it.`;

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
  if (ctx.title) contextLines.push(`Assessment title: ${ctx.title}`);
  if (ctx.subject) contextLines.push(`Subject: ${ctx.subject}`);
  if (ctx.maxMarks != null) contextLines.push(`Total marks: ${ctx.maxMarks}`);
  if (ctx.suggestedMark != null) contextLines.push(`AI suggested mark: ${ctx.suggestedMark}`);
  if (ctx.assessmentContext) contextLines.push(`Assessment workspace context:\n${ctx.assessmentContext.slice(0, 1200)}`);
  if (ctx.selectedText) contextLines.push(`Teacher selected text:\n${ctx.selectedText.slice(0, 1200)}`);
  if (ctx.visibleText) contextLines.push(`Visible page text:\n${ctx.visibleText.slice(0, 1800)}`);
  if (ctx.feedback) contextLines.push(`AI feedback given:\n${ctx.feedback}`);
  if (ctx.rationale) contextLines.push(`Marking rationale: ${ctx.rationale}`);
  if (ctx.questionBreakdown) contextLines.push(`Per-question mark breakdown JSON:\n${ctx.questionBreakdown.slice(0, 2500)}`);
  if (resolvedPaperContext) contextLines.push(`Exam paper / questions:\n${resolvedPaperContext.slice(0, 6500)}`);
  if (ctx.studentAnswer) contextLines.push(`Student's typed / handwriting / visual answer evidence:\n${ctx.studentAnswer.slice(0, 4500)}`);
  if (ctx.extraContext) contextLines.push(`Extra context:\n${ctx.extraContext.slice(0, 1200)}`);

  const systemContent = contextLines.length > 0
    ? `${SYSTEM_PROMPT}\n\n---\nCURRENT CONTEXT:\n${contextLines.join("\n\n")}`
    : SYSTEM_PROMPT;

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
            ...messages.slice(-8), // keep last 8 turns to stay under Groq TPM limits
          ],
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      // On 429 rate-limit, retry with the faster fallback model (separate quota)
      if (response.status === 429) {
        clearTimeout(timeoutHandle);
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 45000);
        try {
          const fallbackResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({
              model: GROQ_FALLBACK_TEXT_MODEL,
              temperature: 0.4,
              max_tokens: 1000,
              stream: true,
              messages: [{ role: "system", content: systemContent }, ...messages.slice(-8)],
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
        } finally {
          clearTimeout(fallbackTimeout);
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
