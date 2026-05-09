import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_TEXT_MODEL = "llama-3.3-70b-versatile";

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
    assessmentContext?: string;
    questionBreakdown?: string;
    extraContext?: string;
  };
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
- If the teacher asks you to mark an exam/worksheet, use the available context and produce a teacher-style breakdown. If the actual PDF image/handwriting is not included in context, say exactly what evidence is missing and ask the teacher to run AI Draft Mark or provide the missing page/answer.
- If questionBreakdown or AI Draft Mark context is provided, you may explain, audit, improve, or challenge it. Do not pretend you can see unseen PDF pixels unless the context includes extracted text/OCR/answers.
- When creating content, match the requested format exactly and make it ready to use.
- Respond in the same language the teacher uses (Arabic or English).
- Never invent exam content outside what is provided — always say if you're missing context.`;

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
  if (ctx.paperContext) contextLines.push(`Exam paper / questions:\n${ctx.paperContext.slice(0, 6000)}`);
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
