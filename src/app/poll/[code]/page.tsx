"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://dashboard.osteps.com/api"
    : "http://localhost:8000/api");

const publicApi = axios.create({ baseURL: API_BASE });

interface PollQuestion {
  id: number;
  poll_id: number;
  type: "multiple_choice" | "word_cloud" | "open_text" | "rating";
  question_text: string;
  options: string[] | null;
  sort_order: number;
  time_limit: number | null;
}

interface PollData {
  id: number;
  title: string;
  description: string | null;
  join_code: string;
  status: string;
  allow_anonymous: boolean;
  questions: PollQuestion[];
}

type Phase = "loading" | "error" | "name" | "answering" | "done";
type SyncMode = "follow" | "self";

const ACCENT = "#6C63FF";
const ACCENT_DARK = "#5A52E0";

const TYPE_ICONS: Record<string, string> = {
  multiple_choice: "A",
  open_text: "T",
  word_cloud: "W",
  rating: "S",
};

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Choose one",
  open_text: "Type your answer",
  word_cloud: "Enter a word or phrase",
  rating: "Rate from 1 to 5",
};

const OPTION_COLORS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

export default function PublicPollPage() {
  const params = useParams();
  const code = useMemo(() => {
    const c = params?.code;
    return Array.isArray(c) ? c[0] : c ?? "";
  }, [params]);

  const [phase, setPhase] = useState<Phase>("loading");
  const [poll, setPoll] = useState<PollData | null>(null);
  const [participantName, setParticipantName] = useState("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [syncMode, setSyncMode] = useState<SyncMode>("follow");
  const [presenterIndex, setPresenterIndex] = useState(0);
  const syncRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!code) {
      setPhase("error");
      setErrorMsg("No poll code provided.");
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await publicApi.post("/live-polls/join", { code });
        const data = res.data?.data;
        if (active && data) {
          setPoll(data);
          setPhase("name");
        } else if (active) {
          setPhase("error");
          setErrorMsg("Poll not found or not active.");
        }
      } catch {
        if (active) {
          setPhase("error");
          setErrorMsg("This poll code is invalid or the poll is no longer active.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [code]);

  const startPollSync = useCallback(
    (pollId: number) => {
      if (syncRef.current) clearInterval(syncRef.current);
      syncRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/live-polls/sync?pollId=${pollId}`);
          const data = await res.json();
          setPresenterIndex(data.questionIndex ?? 0);
        } catch {
          /* ignore */
        }
      }, 2500);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, []);

  useEffect(() => {
    if (syncMode === "follow" && poll) {
      setCurrentQIndex(presenterIndex);
    }
  }, [presenterIndex, syncMode, poll]);

  const handleStart = () => {
    if (!poll) return;
    setPhase("answering");
    if (poll.id) startPollSync(poll.id);
  };

  const handleSubmitAnswer = async () => {
    if (!poll || !answer.trim()) return;
    const q = poll.questions[currentQIndex];
    if (!q) return;
    setSubmitting(true);
    try {
      await publicApi.post(`/live-polls/${poll.id}/questions/${q.id}/respond`, {
        answer: answer.trim(),
        participant_name: participantName.trim() || "Anonymous",
      });
      setSubmitted((prev) => new Set(prev).add(q.id));
      setAnswer("");
      if (syncMode === "self" && currentQIndex < poll.questions.length - 1) {
        setTimeout(() => setCurrentQIndex((i) => i + 1), 600);
      }
    } catch {
      /* ignore */
    }
    setSubmitting(false);
  };

  const allDone = poll ? poll.questions.every((q) => submitted.has(q.id)) : false;

  useEffect(() => {
    if (allDone && phase === "answering") {
      if (syncRef.current) clearInterval(syncRef.current);
      setPhase("done");
    }
  }, [allDone, phase]);

  // Loading
  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-400/30 border-t-indigo-400" />
          <p className="text-sm text-indigo-200/70">Loading poll...</p>
        </div>
      </div>
    );
  }

  // Error
  if (phase === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
            !
          </div>
          <h1 className="text-xl font-bold text-white">Oops!</h1>
          <p className="mt-2 text-sm text-indigo-200/70">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // Name entry
  if (phase === "name" && poll) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
            >
              LP
            </div>
            <h1 className="text-2xl font-bold text-white">{poll.title}</h1>
            {poll.description && (
              <p className="mt-2 text-sm text-indigo-200/60">{poll.description}</p>
            )}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-indigo-200/70">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              {poll.questions.length} question{poll.questions.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-indigo-200/80">
                Your name {poll.allow_anonymous && <span className="text-indigo-200/40">(optional)</span>}
              </label>
              <input
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-indigo-200/30 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-indigo-200/80">How do you want to answer?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSyncMode("follow")}
                  className={`rounded-xl border p-4 text-left transition ${
                    syncMode === "follow"
                      ? "border-indigo-400 bg-indigo-500/20 text-white"
                      : "border-white/10 bg-white/5 text-indigo-200/60 hover:border-white/20"
                  }`}
                >
                  <div className="mb-1 text-lg">&#x1F4E1;</div>
                  <div className="text-sm font-semibold">Follow presenter</div>
                  <div className="mt-1 text-xs opacity-60">Questions change together</div>
                </button>
                <button
                  onClick={() => setSyncMode("self")}
                  className={`rounded-xl border p-4 text-left transition ${
                    syncMode === "self"
                      ? "border-indigo-400 bg-indigo-500/20 text-white"
                      : "border-white/10 bg-white/5 text-indigo-200/60 hover:border-white/20"
                  }`}
                >
                  <div className="mb-1 text-lg">&#x1F3C3;</div>
                  <div className="text-sm font-semibold">My own pace</div>
                  <div className="mt-1 text-xs opacity-60">Answer freely</div>
                </button>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!poll.allow_anonymous && !participantName.trim()}
              className="w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
            >
              Join Poll
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Done
  if (phase === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-4xl text-white shadow-lg shadow-green-500/30">
            &#10003;
          </div>
          <h1 className="text-2xl font-bold text-white">Thank you!</h1>
          <p className="mt-2 text-sm text-indigo-200/60">
            Your responses have been submitted successfully.
          </p>
          <p className="mt-1 text-xs text-indigo-200/40">
            You answered {submitted.size} of {poll?.questions.length ?? 0} questions
          </p>
        </div>
      </div>
    );
  }

  // Answering
  if (phase === "answering" && poll) {
    const q = poll.questions[currentQIndex];
    const isSubmitted = q ? submitted.has(q.id) : false;
    const progress = poll.questions.length > 0 ? ((submitted.size) / poll.questions.length) * 100 : 0;

    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Top bar */}
        <div className="border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
              >
                LP
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">{poll.title}</h1>
                <p className="text-xs text-indigo-200/40">
                  {syncMode === "follow" ? "Following presenter" : "Self-paced"} &middot; {participantName || "Anonymous"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-200/60">
                {submitted.size}/{poll.questions.length}
              </span>
              {syncMode === "follow" && (
                <button
                  onClick={() => setSyncMode("self")}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-200/60 hover:bg-white/10 transition"
                >
                  Go self-paced
                </button>
              )}
              {syncMode === "self" && (
                <button
                  onClick={() => { setSyncMode("follow"); setCurrentQIndex(presenterIndex); }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-200/60 hover:bg-white/10 transition"
                >
                  Follow presenter
                </button>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/5">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${ACCENT}, #a855f7)` }}
            />
          </div>
        </div>

        {/* Question area */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          {q ? (
            <div className="w-full max-w-lg">
              {/* Question header */}
              <div className="mb-8 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-indigo-200/60">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {TYPE_ICONS[q.type] ?? "Q"}
                  </span>
                  Question {currentQIndex + 1} of {poll.questions.length}
                </div>
                <h2 className="text-xl font-bold leading-relaxed text-white md:text-2xl">
                  {q.question_text}
                </h2>
                <p className="mt-2 text-xs text-indigo-200/40">
                  {TYPE_LABELS[q.type] ?? "Answer below"}
                </p>
              </div>

              {/* Answer area */}
              {isSubmitted ? (
                <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-8 text-center">
                  <div className="mb-2 text-3xl text-green-400">&#10003;</div>
                  <p className="text-sm font-semibold text-green-300">Answer submitted!</p>
                  {syncMode === "self" && currentQIndex < poll.questions.length - 1 && (
                    <button
                      onClick={() => { setCurrentQIndex((i) => i + 1); setAnswer(""); }}
                      className="mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
                    >
                      Next question &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {q.type === "multiple_choice" && q.options ? (
                    <div className="space-y-3">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswer(opt)}
                          className={`group w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                            answer === opt
                              ? "border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/10"
                              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white ${OPTION_COLORS[i % OPTION_COLORS.length]}`}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className={`text-sm font-medium ${answer === opt ? "text-white" : "text-indigo-100/80"}`}>
                              {opt}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : q.type === "rating" ? (
                    <div className="flex justify-center gap-3 py-4">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setAnswer(String(n))}
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold transition-all duration-200 ${
                            answer === String(n)
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-110"
                              : "border-2 border-white/10 bg-white/5 text-indigo-200/60 hover:border-amber-400/30 hover:bg-amber-400/5"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={q.type === "word_cloud" ? "Enter a word or short phrase..." : "Type your answer..."}
                      className="w-full rounded-2xl border-2 border-white/10 bg-white/5 p-4 text-sm text-white placeholder-indigo-200/30 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"
                      rows={4}
                    />
                  )}

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || submitting}
                    className="mt-6 w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </button>
                </div>
              )}

              {/* Navigation for self-paced */}
              {syncMode === "self" && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => { setCurrentQIndex((i) => Math.max(0, i - 1)); setAnswer(""); }}
                    disabled={currentQIndex === 0}
                    className="rounded-lg px-4 py-2 text-sm text-indigo-200/50 transition hover:text-white disabled:opacity-30"
                  >
                    &larr; Previous
                  </button>
                  <button
                    onClick={() => { setCurrentQIndex((i) => Math.min(poll.questions.length - 1, i + 1)); setAnswer(""); }}
                    disabled={currentQIndex === poll.questions.length - 1}
                    className="rounded-lg px-4 py-2 text-sm text-indigo-200/50 transition hover:text-white disabled:opacity-30"
                  >
                    Skip &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-indigo-200/50">No questions available.</p>
          )}
        </div>

        {/* Bottom dots */}
        <div className="flex justify-center gap-2 pb-6">
          {poll.questions.map((qq, i) => (
            <button
              key={i}
              onClick={() => { if (syncMode === "self") { setCurrentQIndex(i); setAnswer(""); } }}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === currentQIndex
                  ? "scale-125"
                  : submitted.has(qq.id)
                  ? "bg-green-400/60"
                  : "bg-white/20 hover:bg-white/30"
              }`}
              style={i === currentQIndex ? { background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` } : undefined}
              disabled={syncMode === "follow"}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
