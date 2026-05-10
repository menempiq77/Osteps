import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
// 70b is significantly smarter at following instructions and matching evidence to questions.
// Each model has its own independent TPM quota on Groq, so switching primary/fallback
// reduces the chance of a 429 cascade.
const GROQ_FAST_TEXT_MODEL = process.env.GROQ_ASSISTANT_FAST_MODEL || "llama-3.1-8b-instant";
const GROQ_TEXT_MODEL = process.env.GROQ_ASSISTANT_TEXT_MODEL || "llama-3.3-70b-versatile";
const GROQ_FALLBACK_TEXT_MODEL = process.env.GROQ_ASSISTANT_FALLBACK_MODEL || "gemma2-9b-it";
const GROQ_SECONDARY_FALLBACK_MODEL = process.env.GROQ_ASSISTANT_FALLBACK_MODEL_2 || GROQ_FAST_TEXT_MODEL;
const GEMINI_TEXT_MODEL = process.env.GEMINI_ASSISTANT_TEXT_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
const OPENAI_TEXT_MODEL = process.env.OPENAI_ASSISTANT_TEXT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const execFileAsync = promisify(execFile);
const textEncoder = new TextEncoder();

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

const GENERAL_SYSTEM_PROMPT = `You are OSTEPS AI — a general-purpose assistant for teachers, school admins, students, and staff.

GENERAL RULES:
1. Answer general questions directly and helpfully across school work, writing, planning, explanations, summaries, translations, brainstorming, and broad general knowledge topics.
2. Use the current OSTEPS page context only when the user's question is clearly about the current page, current document, current assessment, selected student, or selected text.
3. If the supplied page context is unrelated to the user's question, ignore it and answer the actual question normally.
4. When live search grounding is available and the question benefits from fresh web information, use it and cite the sources you relied on.
5. If live search grounding is unavailable for a request, do not pretend to have browsed the web.
6. Keep answers clear, direct, and useful.`;

const MARKING_SYSTEM_PROMPT = `${GENERAL_SYSTEM_PROMPT}

When the user asks you to mark, grade, review answers, explain deductions, or help with an assessment, switch into strict marking mode.

MARKING FORMAT — follow this exactly for every question:
  Q[N]: [Student's exact answer]
  → [✓ Correct / ~ Partly correct / ✗ Wrong]
  → Correct answer: [full correct answer from your knowledge]
  → Marks: [awarded]/[available]

CRITICAL RULES:
1. Mark EVERY question — never skip. Start immediately with Q1, no preamble.
2. PARTIAL MARKS: If a question is worth 2+ marks and the student gives only some correct points, award proportional partial marks (e.g. mentions 1 of 2 required terms → 1/2).
3. Use your OWN deep subject knowledge for correct answers. NEVER write "not mentioned in the text" or "not clear from the document". You always know Islamic Studies answers.
4. The PDF contains questions only (no answer key) — that is normal. Supply correct answers from knowledge.
4b. If a per-question mark breakdown JSON is provided in the context, treat that breakdown as the authoritative draft mark for this conversation. In that case, format and explain that draft; do NOT re-mark the whole paper from scratch unless the teacher explicitly asks you to review a specific question again.
5. EVIDENCE MATCHING — student answers arrive in two forms:
   a) Typed text boxes: labeled "Text box N [Page P]: \"...\"" — student typed this ON the PDF at that position. Read the content and match it to the most relevant question above that position on the page, NOT by box number.
   b) Visual evidence: labeled "Q[N]: selected option (a) [text]" — student circled/ticked that MCQ option. Trust this absolutely.
6. For MCQ: if visual evidence shows a circled option, that is the answer — even if a text box says something different.
7. IGNORE: student name, class, date, school name, teacher name at the top of any exam page. These are NEVER answers.
8. FORBIDDEN: asking for the PDF / document / more information / requirements checklist. Never say "I cannot mark without...". If evidence is absent for a question, say "no answer given" for that question and move on.
9. After all questions: write "Total: [X]/[Y]" then 2 sentences of constructive feedback for the student.
10. Respond in the same language the teacher is using (English or Arabic).`;

const buildAssistantSseResponse = (text: string, provider: string) => {
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      controller.enqueue(
        textEncoder.encode(
          `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`
        )
      );
      controller.enqueue(textEncoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Osteps-Ai-Provider": provider,
    },
  });
};

const buildProxyStreamResponse = (response: Response, provider: string) => {
  const stream = new ReadableStream({
    async start(ctrl: ReadableStreamDefaultController) {
      const reader = response.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            ctrl.enqueue(textEncoder.encode("data: [DONE]\n\n"));
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
      "X-Osteps-Ai-Provider": provider,
    },
  });
};

const extractGeminiText = (payload: unknown) => {
  const data = payload as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  return (data?.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => String(part?.text || "").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
};

const appendGeminiGroundingSources = (text: string, payload: unknown) => {
  const data = payload as {
    candidates?: Array<{
      groundingMetadata?: {
        groundingChunks?: Array<{
          web?: {
            uri?: string;
            title?: string;
          };
        }>;
      };
    }>;
  };

  const sources = Array.from(
    new Map(
      ((data?.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as Array<{ web?: { uri?: string; title?: string } }>)
        .map((chunk) => ({
          title: String(chunk?.web?.title || "").trim(),
          uri: String(chunk?.web?.uri || "").trim(),
        }))
        .filter((source) => source.title && source.uri)
        .map((source) => [source.uri, source] as const)
    ).values()
  ).slice(0, 5);

  if (sources.length === 0) return text;

  return `${text}\n\nSources:\n${sources
    .map((source, index) => `${index + 1}. ${source.title} — ${source.uri}`)
    .join("\n")}`;
};

const extractOpenAiText = (payload: unknown) => {
  const data = payload as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        typeof part === "object" && part && "text" in part
          ? String((part as { text?: unknown }).text ?? "").trim()
          : String(part ?? "").trim()
      )
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return "";
};

const requestGeminiAssistantText = async ({
  systemContent,
  messages,
  useGoogleSearch,
}: {
  systemContent: string;
  messages: ChatMessage[];
  useGoogleSearch?: boolean;
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini assistant fallback is not configured.");
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemContent }],
          },
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          tools: useGoogleSearch ? [{ google_search: {} }] : undefined,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1400,
            topP: 0.9,
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      throw new Error(`Gemini assistant failed (${response.status}): ${err.slice(0, 240)}`);
    }

    const payload = await response.json();
    const text = useGoogleSearch
      ? appendGeminiGroundingSources(extractGeminiText(payload), payload)
      : extractGeminiText(payload);
    if (!text) {
      throw new Error("Gemini assistant returned an empty response.");
    }

    return text;
  } finally {
    clearTimeout(timeoutHandle);
  }
};

const requestOpenAiAssistantText = async ({
  systemContent,
  messages,
}: {
  systemContent: string;
  messages: ChatMessage[];
}) => {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI assistant is not configured.");
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_TEXT_MODEL,
        temperature: 0.3,
        max_tokens: 1400,
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      throw new Error(`OpenAI assistant failed (${response.status}): ${err.slice(0, 240)}`);
    }

    const text = extractOpenAiText(await response.json());
    if (!text) {
      throw new Error("OpenAI assistant returned an empty response.");
    }

    return text;
  } finally {
    clearTimeout(timeoutHandle);
  }
};

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY && !GEMINI_API_KEY && !OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI assistant is not available: no provider API key configured." },
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
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
  const isExplicitMarkingRequest = /(?:\bmark\b|\bgrade\b|\bremark\b|re-mark|deduction|deductions|marks? awarded|correct answer|student paper|exam(?:\s+paper)?|assessment|worksheet|mcq|question breakdown|total mark|score this|review this paper|check answers)/i.test(latestUserMessage);
  const asksAboutCurrentContext = /(?:this|current)\s+(?:page|paper|assessment|exam|worksheet|document|student|answer|question|marking)|selected text|check this|look at this|see this|on this page|for this student/i.test(latestUserMessage);
  const shouldUseAssessmentContext = isExplicitMarkingRequest || asksAboutCurrentContext;

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

  if (ctx.selectedText) contextLines.push(`Selected text:\n${ctx.selectedText.slice(0, 1200)}`);
  if (!isFollowUp && ctx.visibleText) contextLines.push(`Visible page text:\n${ctx.visibleText.slice(0, shouldUseAssessmentContext ? 1800 : 1200)}`);
  if (shouldUseAssessmentContext) {
    if (ctx.title) contextLines.push(`Assessment title: ${ctx.title}`);
    if (ctx.subject) contextLines.push(`Subject: ${ctx.subject}`);
    if (ctx.maxMarks != null) contextLines.push(`Total marks: ${ctx.maxMarks}`);
    if (ctx.suggestedMark != null) contextLines.push(`AI suggested mark: ${ctx.suggestedMark}`);
    if (ctx.assessmentContext) contextLines.push(`Assessment workspace context:\n${ctx.assessmentContext.slice(0, 1200)}`);
    if (ctx.feedback) contextLines.push(`AI feedback given:\n${ctx.feedback}`);
    if (ctx.rationale) contextLines.push(`Marking rationale: ${ctx.rationale}`);
    if (ctx.questionBreakdown) contextLines.push(`Per-question mark breakdown JSON:\n${ctx.questionBreakdown.slice(0, 2500)}`);
    if (!isFollowUp && resolvedPaperContext) contextLines.push(`Exam paper / questions:\n${resolvedPaperContext.slice(0, 6500)}`);
    if (!isFollowUp && ctx.studentAnswer) {
      contextLines.push(`Student's typed / handwriting / visual answer evidence:\n${ctx.studentAnswer.slice(0, 4500)}`);
    }
  }
  if (ctx.extraContext) contextLines.push(`Extra context:\n${ctx.extraContext.slice(0, 1200)}`);

  const isMarkingHeavyRequest =
    shouldUseAssessmentContext &&
    (ctx.page === "marking" ||
      ctx.suggestedMark != null ||
      Boolean(ctx.questionBreakdown || ctx.studentAnswer || resolvedPaperContext));

  // If the teacher opened marking mode but we have no paper and no student evidence,
  // give the model an explicit instruction so it responds with one sentence, not a checklist.
  const hasPaper = Boolean(resolvedPaperContext && resolvedPaperContext.trim().length > 20);
  const hasStudentEvidence = Boolean(ctx.studentAnswer && ctx.studentAnswer.trim().length > 5);
  if (shouldUseAssessmentContext && ctx.page === "marking" && !isFollowUp && !hasPaper && !hasStudentEvidence) {
    contextLines.push(
      `WARNING: No exam paper text and no student evidence could be extracted. ` +
      `Reply with exactly this one sentence and nothing else: ` +
      `"I could not read the paper — please make sure the PDF has finished loading, then close and re-open the AI assistant."`
    );
  }

  const activeSystemPrompt = shouldUseAssessmentContext ? MARKING_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT;
  const systemContent = contextLines.length > 0
    ? `${activeSystemPrompt}\n\n---\nCURRENT CONTEXT:\n${contextLines.join("\n\n")}`
    : activeSystemPrompt;

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

  const tryOpenAiAssistant = async (reason: string) => {
    const text = await requestOpenAiAssistantText({
      systemContent,
      messages: trimmedMessages,
    });
    console.info("[ai/assistant] provider", JSON.stringify({ provider: `OpenAI (${OPENAI_TEXT_MODEL})`, reason }));
    return buildAssistantSseResponse(text, `openai:${OPENAI_TEXT_MODEL}`);
  };

  const tryGeminiSearchAssistant = async (reason: string) => {
    const text = await requestGeminiAssistantText({
      systemContent,
      messages: trimmedMessages,
      useGoogleSearch: true,
    });
    console.info("[ai/assistant] provider", JSON.stringify({ provider: `Gemini Google Search (${GEMINI_TEXT_MODEL})`, reason }));
    return buildAssistantSseResponse(text, `gemini-search:${GEMINI_TEXT_MODEL}`);
  };

  const tryGeminiFallback = async (reason: string) => {
    const text = await requestGeminiAssistantText({
      systemContent,
      messages: trimmedMessages,
    });
    console.info("[ai/assistant] provider", JSON.stringify({ provider: `Gemini fallback (${GEMINI_TEXT_MODEL})`, reason }));
    return buildAssistantSseResponse(text, `gemini:${GEMINI_TEXT_MODEL}`);
  };

  try {
    if (GEMINI_API_KEY && !isMarkingHeavyRequest) {
      clearTimeout(timeoutHandle);
      try {
        return await tryGeminiSearchAssistant("General assistant mode prefers Gemini with Google Search grounding.");
      } catch (error) {
        console.error("Gemini Google Search assistant failed, falling back to other providers:", error);
      }
    }

    if (OPENAI_API_KEY && !isMarkingHeavyRequest) {
      clearTimeout(timeoutHandle);
      return await tryOpenAiAssistant("General assistant mode fell back after Gemini search was unavailable.");
    }

    if (!GROQ_API_KEY) {
      clearTimeout(timeoutHandle);
      if (GEMINI_API_KEY && !isMarkingHeavyRequest) {
        return await tryGeminiSearchAssistant("Groq is not configured on this server.");
      }
      if (OPENAI_API_KEY) {
        return await tryOpenAiAssistant("Groq is not configured on this server.");
      }
      return await tryGeminiFallback("Groq is not configured on this server.");
    }

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
          temperature: 0.3,
          max_tokens: 1400,
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
        if (GEMINI_API_KEY && !isMarkingHeavyRequest) {
          return await tryGeminiSearchAssistant(`Groq primary ${GROQ_TEXT_MODEL} hit 429 during a general assistant request.`);
        }
        if (OPENAI_API_KEY && !isMarkingHeavyRequest) {
          return await tryOpenAiAssistant(`Groq primary ${GROQ_TEXT_MODEL} hit 429 during a general assistant request.`);
        }
        if (GEMINI_API_KEY && isMarkingHeavyRequest) {
          return await tryGeminiFallback(`Groq primary ${GROQ_TEXT_MODEL} hit 429 during a marking-heavy request.`);
        }
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
                temperature: 0.3,
                max_tokens: 1400,
                stream: true,
                messages: [{ role: "system", content: systemContent }, ...trimmedMessages],
              }),
              signal: fallbackController.signal,
            });
            if (fallbackResponse.ok) {
              console.info("[ai/assistant] provider", JSON.stringify({ provider: `Groq fallback (${fallbackModel})`, reason: `Primary model ${GROQ_TEXT_MODEL} returned 429.` }));
              return buildProxyStreamResponse(fallbackResponse, `groq:${fallbackModel}`);
            }
          } catch {
            // try next fallback
          } finally {
            clearTimeout(fallbackTimeout);
          }
        }
        if (GEMINI_API_KEY && !isMarkingHeavyRequest) {
          return await tryGeminiSearchAssistant(`Groq models exhausted after 429 on ${GROQ_TEXT_MODEL}.`);
        }
        if (OPENAI_API_KEY) {
          return await tryOpenAiAssistant(`Groq models exhausted after 429 on ${GROQ_TEXT_MODEL}.`);
        }
        if (GEMINI_API_KEY) {
          return await tryGeminiFallback(`Groq models exhausted after 429 on ${GROQ_TEXT_MODEL}.`);
        }
      }

      if ((response.status === 413 || response.status >= 500) && GEMINI_API_KEY && !isMarkingHeavyRequest) {
        clearTimeout(timeoutHandle);
        return await tryGeminiSearchAssistant(`Groq returned ${response.status} for the assistant request.`);
      }

      if ((response.status === 413 || response.status >= 500) && OPENAI_API_KEY) {
        clearTimeout(timeoutHandle);
        return await tryOpenAiAssistant(`Groq returned ${response.status} for the assistant request.`);
      }

      if ((response.status === 413 || response.status >= 500) && GEMINI_API_KEY) {
        clearTimeout(timeoutHandle);
        return await tryGeminiFallback(`Groq returned ${response.status} for the assistant request.`);
      }
      return NextResponse.json(
        { error: `AI error (${response.status}): ${err.slice(0, 200)}` },
        { status: 502 }
      );
    }

    console.info("[ai/assistant] provider", JSON.stringify({ provider: `Groq primary (${GROQ_TEXT_MODEL})` }));
    return buildProxyStreamResponse(response, `groq:${GROQ_TEXT_MODEL}`);
  } catch (error) {
    if (GEMINI_API_KEY && !isMarkingHeavyRequest) {
      try {
        clearTimeout(timeoutHandle);
        return await tryGeminiSearchAssistant(error instanceof Error ? error.message : "Primary assistant request failed.");
      } catch {
        // fall through to other providers
      }
    }

    if (OPENAI_API_KEY) {
      try {
        clearTimeout(timeoutHandle);
        return await tryOpenAiAssistant(error instanceof Error ? error.message : "Primary assistant request failed.");
      } catch (openAiError) {
        if (!GEMINI_API_KEY) {
          return NextResponse.json(
            { error: openAiError instanceof Error ? openAiError.message : "Assistant request failed." },
            { status: 502 }
          );
        }
      }
    }

    if (GEMINI_API_KEY) {
      try {
        clearTimeout(timeoutHandle);
        return await tryGeminiFallback(error instanceof Error ? error.message : "Groq assistant request failed.");
      } catch (geminiError) {
        return NextResponse.json(
          { error: geminiError instanceof Error ? geminiError.message : "Assistant request failed." },
          { status: 502 }
        );
      }
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Assistant request failed." },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutHandle);
  }
}
