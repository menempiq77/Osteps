"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ChatMsg = { role: "user" | "assistant"; content: string };

type AiContext = {
  page?: string;
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
  fileUrl?: string;
  assessmentContext?: string;
  questionBreakdown?: string;
  extraContext?: string;
};

type OpenAiAssistantEvent = CustomEvent<{
  initialMessage?: string;
  context?: AiContext;
}>;

const STARTERS = [
  "Read this page and tell me what I should do next",
  "Mark this exam/worksheet fairly like a teacher",
  "Explain the marking for this assessment",
  "Create 5 MCQ questions for this topic",
  "Write feedback comments I can give students",
  "What common mistakes should I look for?",
];

type ContextCollectEvent = CustomEvent<{ contexts: AiContext[] }>;

const compactText = (value: string, maxLength: number) => {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  const head = Math.floor(maxLength * 0.7);
  const tail = maxLength - head - 32;
  return `${cleaned.slice(0, head)} ... ${cleaned.slice(-tail)}`;
};

const mergeContexts = (...contexts: Array<AiContext | undefined>): AiContext | undefined => {
  const merged: AiContext = {};
  const preferLatestKeys = new Set<keyof AiContext>([
    "paperContext",
    "studentAnswer",
    "questionBreakdown",
    "assessmentContext",
  ]);
  for (const ctx of contexts) {
    if (!ctx) continue;
    for (const [key, value] of Object.entries(ctx) as Array<[keyof AiContext, unknown]>) {
      if (value == null || value === "") continue;
      if (preferLatestKeys.has(key)) {
        (merged as Record<string, unknown>)[key] = value;
      } else if (typeof value === "string" && typeof merged[key] === "string" && merged[key]) {
        const combined = `${merged[key] as string}\n\n${value}`;
        (merged as Record<string, unknown>)[key] = compactText(combined, key === "visibleText" ? 6000 : 5000);
      } else {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
};

export function GlobalAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<AiContext | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const collectCurrentPageContext = useCallback((base?: AiContext): AiContext | undefined => {
    if (typeof window === "undefined") return base;

    const isRichMarkingContext = Boolean(base?.paperContext || base?.studentAnswer || base?.page === "marking");

    const componentContexts: AiContext[] = [];
    window.dispatchEvent(
      new CustomEvent("osteps:collect-ai-context", {
        detail: { contexts: componentContexts },
      })
    );

    const selectedText = compactText(String(window.getSelection?.() || ""), 2000);
    const mainText = compactText(
      String(document.querySelector("main")?.textContent || document.body?.innerText || ""),
      isRichMarkingContext ? 1200 : 6000
    );

    const automaticContext: AiContext = {
      page: "current OSTEPS page",
      pageUrl: window.location.href,
      pageTitle: document.title,
      selectedText: selectedText || undefined,
      visibleText: isRichMarkingContext ? undefined : mainText || undefined,
    };

    return mergeContexts(automaticContext, ...componentContexts, base);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const sendMessage = useCallback(
    async (text: string, history: ChatMsg[], ctx?: AiContext) => {
      const enrichedContext = collectCurrentPageContext(ctx);
      const userMsg: ChatMsg = { role: "user", content: text };
      const newHistory: ChatMsg[] = [...history, userMsg];
      setMessages([...newHistory, { role: "assistant", content: "" }]);
      setLoading(true);
      scrollToBottom();

      try {
        const res = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newHistory,
            context: enrichedContext,
          }),
        });

        if (!res.ok || !res.body) {
          const errorText = await res.text().catch(() => "");
          let message = "AI request failed";
          try {
            const parsed = JSON.parse(errorText) as { error?: string };
            message = parsed.error || message;
          } catch {
            if (errorText.trim()) message = errorText.trim().slice(0, 220);
          }
          throw new Error(message);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            const raw = line.replace(/^data: /, "").trim();
            if (!raw || raw === "[DONE]") continue;
            try {
              const parsed = JSON.parse(raw) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const delta = parsed.choices?.[0]?.delta?.content ?? "";
              assistantText += delta;
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", content: assistantText },
              ]);
              scrollToBottom();
            } catch {
              /* partial JSON chunk, skip */
            }
          }
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: `Sorry, I could not get a response. ${error instanceof Error ? error.message : "Please try again."}`,
          },
        ]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [collectCurrentPageContext, scrollToBottom]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    void sendMessage(text, messages, context);
  }, [input, loading, messages, context, sendMessage]);

  // Listen for events from other pages (e.g. PdfAssessmentAnnotator)
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as OpenAiAssistantEvent;
      setIsOpen(true);
      const nextContext = collectCurrentPageContext(ev.detail?.context);
      if (ev.detail?.context) {
        setContext(nextContext);
      } else {
        setContext(nextContext);
      }
      if (ev.detail?.initialMessage) {
        const initial = ev.detail.initialMessage;
        setMessages([]);
        setTimeout(() => {
          void sendMessage(initial, [], nextContext);
        }, 100);
      }
      setTimeout(() => inputRef.current?.focus(), 300);
    };

    window.addEventListener("osteps:open-ai-assistant", handler);
    return () => window.removeEventListener("osteps:open-ai-assistant", handler);
  }, [collectCurrentPageContext, sendMessage]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full z-[9995] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out
          w-full sm:w-[400px]
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderLeft: "1px solid #e5e7eb" }}
        aria-label="AI Assistant panel"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                OSTEPS AI Assistant
              </p>
              <p className="text-teal-200 text-xs">
                Marking · Quizzes · Lesson Planning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={() => { setMessages([]); setContext(undefined); }}
                className="text-teal-200 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                title="Clear chat"
              >
                New chat
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-teal-200 hover:text-white w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-lg"
              title="Close"
              aria-label="Close AI assistant"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Context badge */}
        {context?.title && (
          <div className="bg-teal-50 border-b border-teal-100 px-4 py-2 text-xs text-teal-700 shrink-0">
            <span className="font-medium">Context:</span>{" "}
            {context.title}
            {context.subject ? ` · ${context.subject}` : ""}
            {context.suggestedMark != null && context.maxMarks != null
              ? ` · Mark: ${context.suggestedMark}/${context.maxMarks}`
              : ""}
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-8">
              <div className="text-5xl">✨</div>
              <p className="text-gray-600 text-sm text-center font-medium">
                How can I help you today?
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-teal-400 hover:bg-teal-50 text-gray-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-teal-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content ||
                    (msg.role === "assistant" && loading ? (
                      <span className="inline-flex gap-1 items-center text-gray-400">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>●</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>●</span>
                      </span>
                    ) : (
                      ""
                    ))}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="shrink-0 px-3 pb-3 pt-2"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <div className="flex gap-2 items-end bg-gray-50 rounded-xl p-2 border border-gray-200 focus-within:border-teal-400 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything… (Enter to send)"
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none outline-none text-gray-800 placeholder-gray-400 min-h-[36px] max-h-[120px]"
              style={{ overflowY: "auto" }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-white text-base ${
                input.trim() && !loading
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
          <p className="text-center text-gray-400 text-[10px] mt-1">
            Shift+Enter for new line · Powered by Groq
          </p>
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        onClick={() => {
          const nextOpen = !isOpen;
          if (nextOpen) setContext((prev) => collectCurrentPageContext(prev));
          setIsOpen(nextOpen);
        }}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
        }`}
        style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }}
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        ✨
      </button>
    </>
  );
}
