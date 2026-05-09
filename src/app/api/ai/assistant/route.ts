import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_TEXT_MODEL = "llama-3.3-70b-versatile";
const GROQ_FALLBACK_TEXT_MODEL = "llama-3.1-8b-instant";
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const execFileAsync = promisify(execFile);

export const runtime = "nodejs";
export const maxDuration = 30;

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

const SYSTEM_PROMPT = `You are OSTEPS AI Assistant — a helpful, knowledgeable school assistant for teachers and educators.

You can help with:
- **Current page reading**: Use the provided current page text, selected text, URL, and component context to understand what the teacher is looking at.
- **Marking & feedback**: Review student answers, explain why marks were given or deducted, suggest improvements, analyse typed answers and provided handwriting/OCR summaries against exam questions.
- **Creating assessments**: Draft quiz questions, exam papers, worksheets, true/false questions, MCQs, fill-in-the-blanks, short-answer and essay prompts for any subject and grade.
- **Lesson planning**: Suggest activities, learning objectives, differentiated tasks.
- **Subject knowledge**: Answer subject-specific questions across Islamic Studies, Arabic, Maths, Science, English, and more.
- **General teaching support**: Rubrics, feedback templates, progress comments, parent report phrases.

Rules:
- Be concise and practical. Teachers are busy.
- When helping with marking, always reference the specific question and the student's actual answer.
- If the teacher asks you to mark an exam/worksheet, use the provided exam paper text and student answer text to give a full per-question marking breakdown. Clearly state each question number, the student's answer, whether it is correct or wrong, the correct answer if wrong, the marks awarded, and the total.
- When exam paper text and student answer are provided, always attempt a full marking — do NOT refuse, do NOT say you need more information unless something is genuinely missing.
- If questionBreakdown context is provided, you may explain, audit, improve, or challenge it. Do not pretend you can see unseen PDF pixels unless the context includes extracted text/OCR/answers.
- When creating content, match the requested format exactly and make it ready to use.
- Respond in the same language the teacher uses (Arabic or English).
- Never invent exam content outside what is provided — always say if you're missing specific context.`;

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
  if (ctx.assessmentContext) contextLines.push(`Assessment workspace context:\n${ctx.assessmentContext.slice(0, 4000)}`);
  if (ctx.selectedText) contextLines.push(`Teacher selected text:\n${ctx.selectedText.slice(0, 2500)}`);
  if (ctx.visibleText) contextLines.push(`Visible page text:\n${ctx.visibleText.slice(0, 5000)}`);
  if (ctx.feedback) contextLines.push(`AI feedback given:\n${ctx.feedback}`);
  if (ctx.rationale) contextLines.push(`Marking rationale: ${ctx.rationale}`);
  if (ctx.questionBreakdown) contextLines.push(`Per-question mark breakdown JSON:\n${ctx.questionBreakdown.slice(0, 8000)}`);
  if (resolvedPaperContext) contextLines.push(`Exam paper / questions:\n${resolvedPaperContext.slice(0, 12000)}`);
  if (ctx.studentAnswer) contextLines.push(`Student's typed / extracted answer evidence:\n${ctx.studentAnswer.slice(0, 8000)}`);
  if (ctx.extraContext) contextLines.push(`Extra context:\n${ctx.extraContext.slice(0, 4000)}`);

  const systemContent = contextLines.length > 0
    ? `${SYSTEM_PROMPT}\n\n---\nCURRENT CONTEXT:\n${contextLines.join("\n\n")}`
    : SYSTEM_PROMPT;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 25000);

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
          temperature: 0.5,
          max_tokens: 1600,
          stream: true,
          messages: [
            { role: "system", content: systemContent },
            ...messages.slice(-14), // keep last 14 turns
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
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 25000);
        try {
          const fallbackResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({
              model: GROQ_FALLBACK_TEXT_MODEL,
              temperature: 0.5,
              max_tokens: 1600,
              stream: true,
              messages: [{ role: "system", content: systemContent }, ...messages.slice(-14)],
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
