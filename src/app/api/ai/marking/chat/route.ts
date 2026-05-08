import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_TEXT_MODEL = "llama-3.3-70b-versatile";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages: ChatMessage[];
  // marking context so the AI can answer questions about it
  markingContext?: {
    title?: string;
    subjectName?: string;
    maxMarks?: number | null;
    suggestedMark?: number | null;
    feedback?: string;
    rationale?: string;
    paperContext?: string;
    studentAnswer?: string;
  };
};

const SYSTEM_PROMPT = `You are an AI marking assistant helping a teacher review a student's exam paper.
You have already produced a draft mark and feedback for this student's answer.
The teacher may ask you follow-up questions about:
- Which specific questions or parts the student got wrong or right
- Why you gave a particular mark
- What the correct answer should be
- How the student could improve
- Any concerns about the marking

Be helpful, specific, and concise. Reference the actual exam paper content and student answer when answering.
If you are unsure about something, say so clearly rather than guessing.
Always be respectful of both the teacher and the student.`;

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI chat is not available: no API key configured." },
      { status: 503 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const ctx = body.markingContext ?? {};

  // Build context block injected as a system message so the AI knows the full picture
  const contextBlock = [
    ctx.title ? `Assessment: ${ctx.title}` : null,
    ctx.subjectName ? `Subject: ${ctx.subjectName}` : null,
    ctx.maxMarks != null ? `Max marks: ${ctx.maxMarks}` : null,
    ctx.suggestedMark != null ? `Suggested mark given: ${ctx.suggestedMark}` : null,
    ctx.feedback ? `Feedback given:\n${ctx.feedback}` : null,
    ctx.rationale ? `Marking rationale: ${ctx.rationale}` : null,
    ctx.paperContext
      ? `Exam paper / question text:\n${ctx.paperContext.slice(0, 2000)}`
      : null,
    ctx.studentAnswer
      ? `Student's answer:\n${ctx.studentAnswer.slice(0, 2000)}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemContent = contextBlock
    ? `${SYSTEM_PROMPT}\n\n---\nMARKING CONTEXT:\n${contextBlock}`
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
          temperature: 0.4,
          max_tokens: 600,
          stream: true,
          messages: [
            { role: "system", content: systemContent },
            ...messages.slice(-10), // keep last 10 turns to stay within context
          ],
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `Groq API error (${response.status}): ${err.slice(0, 200)}` },
        { status: 502 }
      );
    }

    // Proxy the SSE stream directly to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller: ReadableStreamDefaultController) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
              break;
            }
            // Forward SSE chunks as-is
            controller.enqueue(value);
          }
        } catch {
          controller.close();
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
      { error: error instanceof Error ? error.message : "Chat request failed." },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutHandle);
  }
}
