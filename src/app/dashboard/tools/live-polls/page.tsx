"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { QRCodeSVG } from "qrcode.react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LivePoll,
  PollQuestion,
  QuestionResult,
  fetchPolls,
  fetchPoll,
  createPoll,
  updatePoll,
  deletePoll,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitResponse,
  fetchResults,
  joinPollByCode,
} from "@/services/livePollApi";

const CHART_COLORS = [
  "#6264A7", "#4CAF50", "#FF9800", "#E91E63", "#00BCD4",
  "#9C27B0", "#FF5722", "#3F51B5", "#009688", "#FFC107",
  "#795548", "#607D8B",
];

const allowedRoles = new Set(["SCHOOL_ADMIN", "HOD", "TEACHER"]);

type View = "list" | "create" | "edit" | "present" | "join" | "results";

export default function LivePollsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const canCreate = !!currentUser && allowedRoles.has(currentUser.role);

  const [view, setView] = useState<View>("list");
  const [polls, setPolls] = useState<LivePoll[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePoll, setActivePoll] = useState<(LivePoll & { questions: PollQuestion[] }) | null>(null);
  const [results, setResults] = useState<{
    questions: QuestionResult[];
    total_participants: number;
  } | null>(null);

  // Create poll form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [allowAnon, setAllowAnon] = useState(false);

  // Question form
  const [qType, setQType] = useState<PollQuestion["type"]>("multiple_choice");
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState<string[]>(["", ""]);
  const [qTimeLimit, setQTimeLimit] = useState<number | null>(null);
  const [editingQ, setEditingQ] = useState<number | null>(null);

  // Join form
  const [joinCode, setJoinCode] = useState("");
  const [joinedPoll, setJoinedPoll] = useState<(LivePoll & { questions: PollQuestion[] }) | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<Set<number>>(new Set());
  const [joinError, setJoinError] = useState("");

  // Presenter navigation
  const [presentQIndex, setPresentQIndex] = useState(0);

  // Results polling
  const resultsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadPolls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPolls();
      setPolls(data);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (canCreate) loadPolls();
  }, [canCreate, loadPolls]);

  useEffect(() => {
    return () => {
      if (resultsIntervalRef.current) clearInterval(resultsIntervalRef.current);
    };
  }, []);

  // Keyboard navigation for presenter
  useEffect(() => {
    if (view !== "present" || !results) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setPresentQIndex((i) => Math.min(results.questions.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPresentQIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Escape") {
        stopResultsPolling();
        setView("list");
        loadPolls();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, results, loadPolls]);

  const handleCreatePoll = async () => {
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      const res = await createPoll({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        allow_anonymous: allowAnon,
      });
      setNewTitle("");
      setNewDesc("");
      setAllowAnon(false);
      const poll = await fetchPoll(res.id);
      setActivePoll(poll);
      setView("edit");
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const handleAddQuestion = async () => {
    if (!activePoll || !qText.trim()) return;
    setLoading(true);
    try {
      const opts = qType === "multiple_choice" ? qOptions.filter((o) => o.trim()) : undefined;
      if (editingQ) {
        await updateQuestion(activePoll.id, editingQ, {
          type: qType,
          question_text: qText.trim(),
          options: opts,
          time_limit: qTimeLimit ?? undefined,
        });
      } else {
        await addQuestion(activePoll.id, {
          type: qType,
          question_text: qText.trim(),
          options: opts,
          time_limit: qTimeLimit ?? undefined,
        });
      }
      const updated = await fetchPoll(activePoll.id);
      setActivePoll(updated);
      resetQuestionForm();
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const resetQuestionForm = () => {
    setQText("");
    setQOptions(["", ""]);
    setQType("multiple_choice");
    setQTimeLimit(null);
    setEditingQ(null);
  };

  const handleDeleteQuestion = async (qId: number) => {
    if (!activePoll) return;
    try {
      await deleteQuestion(activePoll.id, qId);
      const updated = await fetchPoll(activePoll.id);
      setActivePoll(updated);
    } catch {
      /* ignore */
    }
  };

  const handleEditQuestion = (q: PollQuestion) => {
    setEditingQ(q.id);
    setQType(q.type);
    setQText(q.question_text);
    setQOptions(q.options?.length ? [...q.options] : ["", ""]);
    setQTimeLimit(q.time_limit);
  };

  const handleActivatePoll = async () => {
    if (!activePoll) return;
    try {
      await updatePoll(activePoll.id, { status: "active" });
      const updated = await fetchPoll(activePoll.id);
      setActivePoll(updated);
    } catch {
      /* ignore */
    }
  };

  const handleClosePoll = async () => {
    if (!activePoll) return;
    try {
      await updatePoll(activePoll.id, { status: "closed" });
      const updated = await fetchPoll(activePoll.id);
      setActivePoll(updated);
    } catch {
      /* ignore */
    }
  };

  const handleDeletePoll = async (id: number) => {
    if (!confirm("Delete this poll permanently?")) return;
    try {
      await deletePoll(id);
      setPolls((prev) => prev.filter((p) => p.id !== id));
      if (activePoll?.id === id) {
        setActivePoll(null);
        setView("list");
      }
    } catch {
      /* ignore */
    }
  };

  const openPresent = async (pollId: number) => {
    try {
      const poll = await fetchPoll(pollId);
      setActivePoll(poll);
      const res = await fetchResults(pollId);
      setResults({ questions: res.questions, total_participants: res.total_participants });
      setPresentQIndex(0);
      setView("present");
      startResultsPolling(pollId);
    } catch {
      /* ignore */
    }
  };

  const openResults = async (pollId: number) => {
    try {
      const poll = await fetchPoll(pollId);
      setActivePoll(poll);
      const res = await fetchResults(pollId);
      setResults({ questions: res.questions, total_participants: res.total_participants });
      setView("results");
    } catch {
      /* ignore */
    }
  };

  const startResultsPolling = (pollId: number) => {
    if (resultsIntervalRef.current) clearInterval(resultsIntervalRef.current);
    resultsIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetchResults(pollId);
        setResults({ questions: res.questions, total_participants: res.total_participants });
      } catch {
        /* ignore */
      }
    }, 3000);
  };

  const stopResultsPolling = () => {
    if (resultsIntervalRef.current) {
      clearInterval(resultsIntervalRef.current);
      resultsIntervalRef.current = null;
    }
  };

  const handleJoin = async () => {
    setJoinError("");
    if (!joinCode.trim()) return;
    try {
      const poll = await joinPollByCode(joinCode.trim());
      setJoinedPoll(poll);
      setCurrentQIndex(0);
      setAnswer("");
      setSubmitted(new Set());
      setView("join");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Invalid code or poll not active";
      setJoinError(msg);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!joinedPoll || !answer.trim()) return;
    const q = joinedPoll.questions[currentQIndex];
    if (!q) return;
    setLoading(true);
    try {
      await submitResponse(joinedPoll.id, q.id, { answer: answer.trim() });
      setSubmitted((prev) => new Set(prev).add(q.id));
      setAnswer("");
      if (currentQIndex < joinedPoll.questions.length - 1) {
        setCurrentQIndex((i) => i + 1);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const pollUrl = useMemo(() => {
    if (!activePoll) return "";
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/dashboard/tools/live-polls?code=${activePoll.join_code}`;
  }, [activePoll]);

  // Auto-join if code is in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setJoinCode(code);
      joinPollByCode(code)
        .then((poll) => {
          setJoinedPoll(poll);
          setCurrentQIndex(0);
          setAnswer("");
          setSubmitted(new Set());
          setView("join");
        })
        .catch(() => setJoinError("Invalid code or poll not active"));
    }
  }, []);

  const handleCopyLink = () => {
    if (pollUrl) {
      navigator.clipboard.writeText(pollUrl).catch(() => {});
    }
  };

  const handleExportCSV = () => {
    if (!results || !activePoll) return;
    let csv = "Question,Type,Total Responses,Results\n";
    results.questions.forEach((q) => {
      const resStr =
        q.type === "multiple_choice"
          ? Object.entries(q.results as Record<string, number>)
              .map(([k, v]) => `${k}: ${v}`)
              .join("; ")
          : q.type === "word_cloud"
          ? Object.entries(q.results as Record<string, number>)
              .map(([k, v]) => `${k}: ${v}`)
              .join("; ")
          : q.type === "rating"
          ? `Average: ${(q.results as { average: number }).average}`
          : (q.results as string[]).join("; ");
      csv += `"${q.question_text}",${q.type},${q.total_responses},"${resStr}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activePoll.title.replace(/\s+/g, "_")}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render Helpers ───

  const renderQuestionResults = (q: QuestionResult) => {
    if (q.type === "multiple_choice") {
      const data = Object.entries(q.results as Record<string, number>).map(
        ([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] })
      );
      const total = data.reduce((s, d) => s + d.value, 0);
      return (
        <div>
          <ResponsiveContainer width="100%" height={Math.max(200, data.length * 50)}>
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(v: number) => [`${v} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, "Votes"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: d.fill }} />
                <span className="font-medium">{d.name}</span>
                <span className="text-gray-500">
                  {d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (q.type === "word_cloud") {
      const words = Object.entries(q.results as Record<string, number>).sort(
        ([, a], [, b]) => b - a
      );
      const maxCount = words[0]?.[1] ?? 1;
      return (
        <div className="flex flex-wrap gap-2 py-4">
          {words.map(([word, count], i) => {
            const size = 14 + (count / maxCount) * 28;
            return (
              <span
                key={i}
                className="inline-block rounded-full px-3 py-1 font-semibold text-white"
                style={{
                  fontSize: size,
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                }}
              >
                {word} ({count})
              </span>
            );
          })}
        </div>
      );
    }

    if (q.type === "rating") {
      const r = q.results as { average: number; distribution: Record<string, number> };
      const data = Array.from({ length: 5 }, (_, i) => ({
        name: `${i + 1}`,
        value: r.distribution[String(i + 1)] ?? 0,
      }));
      return (
        <div>
          <div className="mb-3 text-center">
            <span className="text-4xl font-bold text-yellow-500">{r.average}</span>
            <span className="text-gray-500 text-lg"> / 5</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#FFC107" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // open_text
    const answers = q.results as string[];
    return (
      <div className="max-h-60 overflow-y-auto space-y-2">
        {answers.length === 0 && <p className="text-gray-400 text-sm">No responses yet</p>}
        {answers.map((a, i) => (
          <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
            {a}
          </div>
        ))}
      </div>
    );
  };

  // ─── Views ───

  if (view === "join" && joinedPoll) {
    const q = joinedPoll.questions[currentQIndex];
    const allDone = joinedPoll.questions.every((qq) => submitted.has(qq.id));
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-center mb-1">{joinedPoll.title}</h1>
          {joinedPoll.description && (
            <p className="text-gray-500 text-center text-sm mb-6">{joinedPoll.description}</p>
          )}
          {allDone ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">&#10003;</div>
              <h2 className="text-xl font-semibold text-green-600">Thank you!</h2>
              <p className="text-gray-500 mt-2">Your responses have been submitted.</p>
              <button
                onClick={() => { setView("list"); setJoinedPoll(null); }}
                className="mt-6 rounded-lg bg-gray-100 px-6 py-2 text-sm font-medium hover:bg-gray-200"
              >
                Back to Tools
              </button>
            </div>
          ) : q ? (
            <div>
              <div className="text-xs text-gray-400 mb-1">
                Question {currentQIndex + 1} of {joinedPoll.questions.length}
              </div>
              <h2 className="text-lg font-semibold mb-4">{q.question_text}</h2>
              {submitted.has(q.id) ? (
                <div className="text-green-600 font-medium text-center py-4">
                  Answered! Moving to next...
                </div>
              ) : (
                <>
                  {q.type === "multiple_choice" && q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswer(opt)}
                          className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition ${
                            answer === opt
                              ? "border-[#6264A7] bg-[#6264A7]/10 text-[#6264A7]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.type === "rating" ? (
                    <div className="flex justify-center gap-2 my-4">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setAnswer(String(n))}
                          className={`h-12 w-12 rounded-full text-lg font-bold transition ${
                            answer === String(n)
                              ? "bg-yellow-400 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
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
                      className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-[#6264A7] focus:outline-none"
                      rows={3}
                    />
                  )}
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || loading}
                    className="mt-4 w-full rounded-lg bg-[#6264A7] px-6 py-3 font-semibold text-white hover:bg-[#5254a0] disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </>
              )}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => { setCurrentQIndex((i) => Math.max(0, i - 1)); setAnswer(""); }}
                  disabled={currentQIndex === 0}
                  className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    setCurrentQIndex((i) => Math.min(joinedPoll.questions.length - 1, i + 1));
                    setAnswer("");
                  }}
                  disabled={currentQIndex === joinedPoll.questions.length - 1}
                  className="text-sm text-[#6264A7] hover:underline disabled:opacity-30"
                >
                  Skip
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (view === "present" && activePoll && results) {
    const totalQs = results.questions.length;
    const currentQ = results.questions[presentQIndex];
    const hasPrev = presentQIndex > 0;
    const hasNext = presentQIndex < totalQs - 1;
    const displayHost = typeof window !== "undefined" ? window.location.host : "dashboard.osteps.com";

    const renderPresenterChart = (q: QuestionResult) => {
      if (q.type === "multiple_choice") {
        const data = Object.entries(q.results as Record<string, number>).map(
          ([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] })
        );
        const total = data.reduce((s, d) => s + d.value, 0);

        if (total === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-3 text-5xl text-gray-300">&#128202;</div>
              <p className="text-lg text-gray-400">Waiting for responses...</p>
            </div>
          );
        }

        return (
          <div className="w-full">
            <ResponsiveContainer width="100%" height={Math.max(250, data.length * 20 + 150)}>
              <BarChart data={data} margin={{ top: 25, right: 30, bottom: 10, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#374151", fontSize: 13, fontWeight: 600 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [`${v} vote${v !== 1 ? "s" : ""} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, ""]}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50} label={{ position: "top", fill: "#374151", fontSize: 16, fontWeight: 700 }}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      if (q.type === "word_cloud") {
        const words = Object.entries(q.results as Record<string, number>).sort(
          ([, a], [, b]) => b - a
        );
        const maxCount = words[0]?.[1] ?? 1;
        if (words.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-3 text-5xl text-gray-300">&#9729;</div>
              <p className="text-lg text-gray-400">Waiting for responses...</p>
            </div>
          );
        }
        return (
          <div className="flex flex-wrap justify-center gap-3 py-6">
            {words.map(([word, count], i) => {
              const size = 16 + (count / maxCount) * 32;
              return (
                <span
                  key={i}
                  className="inline-block rounded-2xl px-4 py-1.5 font-bold text-white"
                  style={{
                    fontSize: size,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      }

      if (q.type === "rating") {
        const r = q.results as { average: number; distribution: Record<string, number> };
        const data = Array.from({ length: 5 }, (_, i) => ({
          name: `${i + 1}`,
          value: r.distribution[String(i + 1)] ?? 0,
        }));
        const totalVotes = data.reduce((s, d) => s + d.value, 0);
        if (totalVotes === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-3 text-5xl text-gray-300">&#11088;</div>
              <p className="text-lg text-gray-400">Waiting for ratings...</p>
            </div>
          );
        }
        return (
          <div>
            <div className="mb-6 text-center">
              <span className="text-6xl font-bold text-[#FF9F43]">{r.average.toFixed(1)}</span>
              <span className="text-2xl text-gray-300"> / 5</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data} margin={{ top: 15, right: 20, bottom: 10, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 16, fontWeight: 600 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#FF9F43" radius={[8, 8, 0, 0]} barSize={45} label={{ position: "top", fill: "#374151", fontSize: 14, fontWeight: 700 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      // open_text
      const answers = q.results as string[];
      if (answers.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-3 text-5xl text-gray-300">&#128172;</div>
            <p className="text-lg text-gray-400">Waiting for responses...</p>
          </div>
        );
      }
      return (
        <div className="w-full columns-1 gap-4 md:columns-2 lg:columns-3">
          {answers.map((a, i) => (
            <div
              key={i}
              className="mb-3 break-inside-avoid rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 text-base text-gray-700"
            >
              &ldquo;{a}&rdquo;
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f5f0]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowQR((v) => !v)}
              className="flex items-center gap-3 rounded-xl bg-[#4262FF]/5 border border-[#4262FF]/20 px-4 py-2 transition hover:bg-[#4262FF]/10"
            >
              <QRCodeSVG value={pollUrl} size={32} bgColor="transparent" fgColor="#4262FF" />
              <div className="text-left">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Join at</p>
                <p className="text-sm font-bold text-gray-900">{displayHost}/poll/{activePoll.join_code}</p>
              </div>
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5">
              <span className="text-xs text-gray-500">Code:</span>
              <span className="text-sm font-mono font-bold tracking-widest text-gray-900">{activePoll.join_code}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
              <button
                onClick={() => setPresentMode("presenter_led")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  presentMode === "presenter_led" ? "bg-[#4262FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Presenter-led
              </button>
              <button
                onClick={() => setPresentMode("self_paced")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  presentMode === "self_paced" ? "bg-[#4262FF] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Self-paced
              </button>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold text-green-700">{results.total_participants}</span>
            </div>
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-mono text-gray-600">
              {presentQIndex + 1}/{totalQs}
            </span>
            <button
              onClick={() => { stopResultsPolling(); setView("list"); loadPolls(); }}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
            >
              Exit
            </button>
          </div>
        </div>

        {/* QR overlay */}
        {showQR && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm" onClick={() => setShowQR(false)}>
            <div className="rounded-3xl bg-white p-12 text-center shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Join this poll</h2>
              <div className="mb-6 rounded-2xl bg-[#f5f5f0] p-6 inline-block">
                <QRCodeSVG value={pollUrl} size={280} bgColor="#f5f5f0" fgColor="#1a1a2e" />
              </div>
              <div>
                <p className="text-gray-500 mb-2">Go to</p>
                <p className="text-2xl font-bold text-gray-900 mb-4">{displayHost}/poll/{activePoll.join_code}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="rounded-xl bg-[#f5f5f0] px-8 py-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Use code</p>
                    <p className="text-4xl font-mono font-bold tracking-[0.4em] text-gray-900">{activePoll.join_code}</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="mt-6 rounded-xl bg-[#4262FF] px-8 py-3 text-sm font-bold text-white hover:bg-[#3451E0] transition"
                >
                  {copiedLink ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center px-8 py-4 relative overflow-y-auto">
          {/* Navigation arrows */}
          <button
            onClick={() => setPresentQIndex((i) => Math.max(0, i - 1))}
            disabled={!hasPrev}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border border-gray-200 p-3 text-gray-400 shadow-sm hover:text-gray-700 hover:shadow-md disabled:opacity-20 transition"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button
            onClick={() => setPresentQIndex((i) => Math.min(totalQs - 1, i + 1))}
            disabled={!hasNext}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border border-gray-200 p-3 text-gray-400 shadow-sm hover:text-gray-700 hover:shadow-md disabled:opacity-20 transition"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {currentQ ? (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="text-center mb-4 w-full">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-500 shadow-sm border border-gray-100 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#4262FF] text-xs font-bold text-white">
                    {presentQIndex + 1}
                  </span>
                  <span className="capitalize">{currentQ.type.replace("_", " ")}</span>
                  <span className="text-gray-300">|</span>
                  <span>{currentQ.total_responses} response{currentQ.total_responses !== 1 ? "s" : ""}</span>
                </span>
                <h2 className="text-xl md:text-2xl font-bold leading-snug text-gray-900">
                  {currentQ.question_text}
                </h2>
              </div>

              <div className="w-full max-w-3xl">
                {renderPresenterChart(currentQ)}
              </div>
            </div>
          ) : (
            <div className="text-center mt-20">
              <div className="text-5xl mb-4 text-gray-300">&#128203;</div>
              <p className="text-lg text-gray-400">No questions in this poll</p>
            </div>
          )}
        </div>

        {/* Bottom navigation dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {results.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setPresentQIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === presentQIndex
                  ? "h-2.5 w-7 bg-[#4262FF]"
                  : "h-2.5 w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (view === "results" && activePoll && results) {
    return (
      <div className="p-3 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => { setView("list"); loadPolls(); }}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
            >
              &larr; Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{activePoll.title} &mdash; Results</h1>
              <p className="text-sm text-gray-500">
                {results.total_participants} participant{results.total_participants !== 1 ? "s" : ""} &middot;{" "}
                {activePoll.status === "closed" ? "Closed" : activePoll.status === "active" ? "Active" : "Draft"}
              </p>
            </div>
            <button onClick={handleExportCSV} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              Export CSV
            </button>
            <button onClick={() => window.print()} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
              Print
            </button>
          </div>
          <div className="space-y-6">
            {results.questions.map((q, i) => (
              <div key={q.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-base font-semibold">
                    <span className="text-gray-400 mr-2">Q{i + 1}.</span>
                    {q.question_text}
                  </h2>
                  <span className="shrink-0 rounded-full border px-3 py-1 text-xs text-gray-500">
                    {q.total_responses} response{q.total_responses !== 1 ? "s" : ""}
                  </span>
                </div>
                {renderQuestionResults(q)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "edit" && activePoll) {
    return (
      <div className="p-3 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => { setView("list"); loadPolls(); resetQuestionForm(); }}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
            >
              &larr; Back
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{activePoll.title}</h1>
              <p className="text-xs text-gray-500">
                Code: <span className="font-mono font-bold tracking-wider">{activePoll.join_code}</span>
                {" "}&middot; Status:{" "}
                <span className={activePoll.status === "active" ? "text-green-600" : activePoll.status === "closed" ? "text-red-500" : "text-gray-500"}>
                  {activePoll.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {activePoll.status === "draft" && activePoll.questions.length > 0 && (
                <button onClick={handleActivatePoll} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                  Activate
                </button>
              )}
              {activePoll.status === "active" && (
                <>
                  <button onClick={() => openPresent(activePoll.id)} className="rounded-lg bg-[#6264A7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5254a0]">
                    Present
                  </button>
                  <button onClick={handleClosePoll} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                    Close Poll
                  </button>
                </>
              )}
              {activePoll.status === "closed" && (
                <button onClick={() => openResults(activePoll.id)} className="rounded-lg bg-[#6264A7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5254a0]">
                  View Results
                </button>
              )}
            </div>
          </div>

          {/* QR + Share section */}
          {activePoll.status === "active" && (
            <div className="mb-6 rounded-xl border border-[#6264A7]/20 bg-[#6264A7]/5 p-5 flex items-center gap-6">
              <QRCodeSVG value={pollUrl} size={120} />
              <div className="flex-1">
                <h3 className="font-semibold text-[#6264A7]">Share with participants</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Scan the QR code or use join code:{" "}
                  <span className="font-mono font-bold text-lg tracking-widest">{activePoll.join_code}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    readOnly
                    value={pollUrl}
                    className="flex-1 rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-600"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button onClick={handleCopyLink} className="rounded-lg bg-[#6264A7] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#5254a0]">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-3 mb-6">
            {activePoll.questions.map((q, i) => (
              <div key={q.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-gray-400">Q{i + 1} &middot; {q.type.replace("_", " ")}</span>
                    <p className="font-medium mt-0.5">{q.question_text}</p>
                    {q.type === "multiple_choice" && q.options && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {q.options.map((opt, j) => (
                          <span key={j} className="rounded-full bg-gray-100 px-3 py-1 text-xs">{opt}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {activePoll.status === "draft" && (
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => handleEditQuestion(q)} className="rounded p-1 text-gray-400 hover:text-[#6264A7] hover:bg-gray-100" title="Edit">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50" title="Delete">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {activePoll.questions.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">No questions yet. Add your first question below.</div>
            )}
          </div>

          {/* Add question form */}
          {activePoll.status === "draft" && (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">
              <h3 className="font-semibold text-sm mb-3">
                {editingQ ? "Edit Question" : "Add Question"}
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(["multiple_choice", "word_cloud", "open_text", "rating"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setQType(t); if (t === "multiple_choice") setQOptions(["", ""]); }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        qType === t
                          ? "bg-[#6264A7] text-white"
                          : "bg-white border hover:bg-gray-100"
                      }`}
                    >
                      {t === "multiple_choice" ? "Multiple Choice" : t === "word_cloud" ? "Word Cloud" : t === "open_text" ? "Open Text" : "Rating"}
                    </button>
                  ))}
                  <button
                    onClick={() => { setQType("multiple_choice"); setQOptions(["True", "False"]); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      qType === "multiple_choice" && qOptions.length === 2 && qOptions[0] === "True" && qOptions[1] === "False"
                        ? "bg-[#6264A7] text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    True / False
                  </button>
                  <button
                    onClick={() => { setQType("multiple_choice"); setQOptions(["Yes", "No"]); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      qType === "multiple_choice" && qOptions.length === 2 && qOptions[0] === "Yes" && qOptions[1] === "No"
                        ? "bg-[#6264A7] text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    Yes / No
                  </button>
                </div>
                <input
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#6264A7] focus:outline-none"
                />
                {qType === "multiple_choice" && (
                  <div className="space-y-2">
                    {qOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={opt}
                          onChange={(e) => {
                            const copy = [...qOptions];
                            copy[i] = e.target.value;
                            setQOptions(copy);
                          }}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:border-[#6264A7] focus:outline-none"
                        />
                        {qOptions.length > 2 && (
                          <button
                            onClick={() => setQOptions(qOptions.filter((_, j) => j !== i))}
                            className="text-red-400 hover:text-red-600 text-sm px-2"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setQOptions([...qOptions, ""])}
                      className="text-sm text-[#6264A7] hover:underline"
                    >
                      + Add option
                    </button>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  {editingQ && (
                    <button onClick={resetQuestionForm} className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleAddQuestion}
                    disabled={!qText.trim() || loading}
                    className="rounded-lg bg-[#6264A7] px-6 py-2 text-sm font-medium text-white hover:bg-[#5254a0] disabled:opacity-50"
                  >
                    {loading ? "Saving..." : editingQ ? "Update Question" : "Add Question"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "create") {
    return (
      <div className="p-3 md:p-6">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => setView("list")}
            className="mb-4 rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
          >
            &larr; Back
          </button>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Create New Poll</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. End of Lesson Quiz"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#6264A7] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your poll..."
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-[#6264A7] focus:outline-none"
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allowAnon}
                  onChange={(e) => setAllowAnon(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Allow anonymous responses
              </label>
              <button
                onClick={handleCreatePoll}
                disabled={!newTitle.trim() || loading}
                className="w-full rounded-lg bg-[#6264A7] px-6 py-3 font-semibold text-white hover:bg-[#5254a0] disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Poll"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── List view ───
  return (
    <div className="p-3 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Live Polls</h1>
            <p className="mt-1 text-gray-600 text-sm">
              Create interactive polls, share with QR codes, and see live results.
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setView("create")}
              className="rounded-lg bg-[#6264A7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5254a0]"
            >
              + New Poll
            </button>
          )}
        </div>

        {/* Join section */}
        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-sm mb-2">Join a Poll</h3>
          <div className="flex gap-2">
            <input
              value={joinCode}
              onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(""); }}
              placeholder="Enter 6-digit code"
              className="flex-1 rounded-lg border px-3 py-2 text-sm font-mono tracking-widest uppercase focus:border-[#6264A7] focus:outline-none"
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              disabled={joinCode.length < 4}
              className="rounded-lg bg-[#6264A7] px-6 py-2 text-sm font-medium text-white hover:bg-[#5254a0] disabled:opacity-50"
            >
              Join
            </button>
          </div>
          {joinError && <p className="text-red-500 text-xs mt-1">{joinError}</p>}
        </div>

        {/* Polls list */}
        {canCreate && (
          <div>
            <h3 className="font-semibold text-sm text-gray-500 uppercase mb-3">Your Polls</h3>
            {loading && polls.length === 0 && (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            )}
            {!loading && polls.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No polls yet</p>
                <p className="text-sm mt-1">Create your first live poll to get started.</p>
              </div>
            )}
            <div className="space-y-3">
              {polls.map((poll) => (
                <div key={poll.id} className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={async () => {
                        const p = await fetchPoll(poll.id);
                        setActivePoll(p);
                        setView("edit");
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{poll.title}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            poll.status === "active"
                              ? "bg-green-100 text-green-700"
                              : poll.status === "closed"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {poll.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: <span className="font-mono font-bold">{poll.join_code}</span>
                        {" "}&middot; {poll.questions_count ?? 0} question{(poll.questions_count ?? 0) !== 1 ? "s" : ""}
                        {" "}&middot; {poll.responses_count ?? 0} response{(poll.responses_count ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {poll.status === "active" && (
                        <button
                          onClick={() => openPresent(poll.id)}
                          className="rounded-lg bg-[#6264A7] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#5254a0]"
                          title="Present live"
                        >
                          Present
                        </button>
                      )}
                      {(poll.status === "active" || poll.status === "closed") && (
                        <button
                          onClick={() => openResults(poll.id)}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium hover:bg-gray-200"
                          title="View results"
                        >
                          Results
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="rounded p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
