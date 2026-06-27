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

const OPTION_COLORS = [
  "#4262FF", "#FF6B8A", "#1DB954", "#FF9F43", "#A55EEA", "#2BCBBA",
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
  const [syncMode, setSyncMode] = useState<SyncMode>("self");
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
    return () => { active = false; };
  }, [code]);

  const startPollSync = useCallback((pollId: number) => {
    if (syncRef.current) clearInterval(syncRef.current);
    syncRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/live-polls/sync?pollId=${pollId}`);
        const data = await res.json();
        setPresenterIndex(data.questionIndex ?? 0);
      } catch { /* ignore */ }
    }, 2500);
  }, []);

  useEffect(() => {
    return () => { if (syncRef.current) clearInterval(syncRef.current); };
  }, []);

  useEffect(() => {
    if (syncMode === "follow" && poll) setCurrentQIndex(presenterIndex);
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
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const allDone = poll ? poll.questions.every((q) => submitted.has(q.id)) : false;

  useEffect(() => {
    if (allDone && phase === "answering") {
      if (syncRef.current) clearInterval(syncRef.current);
      setPhase("done");
    }
  }, [allDone, phase]);

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4262FF]/20 border-t-[#4262FF]" />
          <p className="text-sm text-gray-500">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f0] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">!</div>
          <h1 className="text-lg font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-500">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (phase === "name" && poll) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f5f0]">
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4262FF] text-xl font-bold text-white">
                O
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{poll.title}</h1>
              {poll.description && (
                <p className="mt-2 text-sm text-gray-500">{poll.description}</p>
              )}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                {poll.questions.length} question{poll.questions.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Your name {poll.allow_anonymous && <span className="text-gray-400">(optional)</span>}
                </label>
                <input
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#4262FF] focus:ring-2 focus:ring-[#4262FF]/10"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">How do you want to answer?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSyncMode("follow")}
                    className={`rounded-xl border-2 p-3.5 text-left transition ${
                      syncMode === "follow"
                        ? "border-[#4262FF] bg-[#4262FF]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="mb-1 text-base">&#x1F4E1;</div>
                    <div className="text-sm font-semibold text-gray-900">Follow presenter</div>
                    <div className="mt-0.5 text-xs text-gray-500">Questions sync together</div>
                  </button>
                  <button
                    onClick={() => setSyncMode("self")}
                    className={`rounded-xl border-2 p-3.5 text-left transition ${
                      syncMode === "self"
                        ? "border-[#4262FF] bg-[#4262FF]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="mb-1 text-base">&#x1F3C3;</div>
                    <div className="text-sm font-semibold text-gray-900">My own pace</div>
                    <div className="mt-0.5 text-xs text-gray-500">Answer freely</div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!poll.allow_anonymous && !participantName.trim()}
                className="w-full rounded-xl bg-[#4262FF] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3451E0] disabled:opacity-40"
              >
                Join Poll
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f0] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
            &#10003;
          </div>
          <h1 className="text-xl font-bold text-gray-900">Thank you!</h1>
          <p className="mt-2 text-sm text-gray-500">Your responses have been submitted.</p>
          <p className="mt-1 text-xs text-gray-400">
            You answered {submitted.size} of {poll?.questions.length ?? 0} questions
          </p>
        </div>
      </div>
    );
  }

  if (phase === "answering" && poll) {
    const q = poll.questions[currentQIndex];
    const isSubmitted = q ? submitted.has(q.id) : false;
    const progress = poll.questions.length > 0 ? (submitted.size / poll.questions.length) * 100 : 0;

    return (
      <div className="flex min-h-screen flex-col bg-[#f5f5f0]">
        {/* Top bar */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4262FF] text-xs font-bold text-white">
                O
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">{poll.title}</h1>
                <p className="text-xs text-gray-400">
                  {syncMode === "follow" ? "Following presenter" : "Self-paced"} &middot; {participantName || "Anonymous"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {submitted.size}/{poll.questions.length}
              </span>
              {syncMode === "follow" ? (
                <button
                  onClick={() => setSyncMode("self")}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 transition"
                >
                  Go self-paced
                </button>
              ) : (
                <button
                  onClick={() => { setSyncMode("follow"); setCurrentQIndex(presenterIndex); }}
                  className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 transition"
                >
                  Follow presenter
                </button>
              )}
            </div>
          </div>
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-[#4262FF] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question area */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          {q ? (
            <div className="w-full max-w-lg">
              <div className="mb-6 text-center">
                <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                  Question {currentQIndex + 1} of {poll.questions.length}
                </span>
                <h2 className="mt-4 text-xl font-bold leading-relaxed text-gray-900 md:text-2xl">
                  {q.question_text}
                </h2>
              </div>

              {isSubmitted ? (
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                  <div className="mb-2 text-3xl text-green-500">&#10003;</div>
                  <p className="text-sm font-semibold text-green-700">Answer submitted!</p>
                  {syncMode === "self" && currentQIndex < poll.questions.length - 1 && (
                    <button
                      onClick={() => { setCurrentQIndex((i) => i + 1); setAnswer(""); }}
                      className="mt-4 rounded-lg bg-[#4262FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#3451E0] transition"
                    >
                      Next question &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  {q.type === "multiple_choice" && q.options ? (
                    <div className="space-y-2.5">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswer(opt)}
                          className={`group flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                            answer === opt
                              ? "border-[#4262FF] bg-[#4262FF]/5"
                              : "border-gray-100 bg-gray-50 hover:border-gray-200"
                          }`}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                            style={{ backgroundColor: OPTION_COLORS[i % OPTION_COLORS.length] }}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={`text-sm font-medium ${answer === opt ? "text-gray-900" : "text-gray-700"}`}>
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : q.type === "rating" ? (
                    <div className="flex justify-center gap-3 py-4">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setAnswer(String(n))}
                          className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold transition ${
                            answer === String(n)
                              ? "bg-[#FF9F43] text-white shadow-md scale-110"
                              : "border-2 border-gray-200 bg-white text-gray-600 hover:border-[#FF9F43]/30"
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
                      className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#4262FF] focus:bg-white focus:ring-2 focus:ring-[#4262FF]/10"
                      rows={4}
                    />
                  )}

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || submitting}
                    className="mt-5 w-full rounded-xl bg-[#4262FF] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3451E0] disabled:opacity-40"
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </button>
                </div>
              )}

              {syncMode === "self" && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => { setCurrentQIndex((i) => Math.max(0, i - 1)); setAnswer(""); }}
                    disabled={currentQIndex === 0}
                    className="rounded-lg px-4 py-2 text-sm text-gray-500 transition hover:text-gray-900 disabled:opacity-30"
                  >
                    &larr; Previous
                  </button>
                  <button
                    onClick={() => { setCurrentQIndex((i) => Math.min(poll.questions.length - 1, i + 1)); setAnswer(""); }}
                    disabled={currentQIndex === poll.questions.length - 1}
                    className="rounded-lg px-4 py-2 text-sm text-gray-500 transition hover:text-gray-900 disabled:opacity-30"
                  >
                    Skip &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No questions available.</p>
          )}
        </div>

        {/* Bottom dots */}
        <div className="flex justify-center gap-1.5 pb-6">
          {poll.questions.map((qq, i) => (
            <button
              key={i}
              onClick={() => { if (syncMode === "self") { setCurrentQIndex(i); setAnswer(""); } }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentQIndex
                  ? "w-6 bg-[#4262FF]"
                  : submitted.has(qq.id)
                  ? "w-2 bg-green-400"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              disabled={syncMode === "follow"}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
