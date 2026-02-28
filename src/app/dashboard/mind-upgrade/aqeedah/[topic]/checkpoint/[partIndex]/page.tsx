"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  incrementCheckpointAttempt,
  isCheckpointFailed,
  isCheckpointPassed,
  markCheckpointFailed,
  markCheckpointPassed,
  resetCheckpointAttempts,
  resetStageProgressToStageStart,
  isMiniGamePlayed,
} from "@/components/stories/storyProgress";
import { getCheckpointData } from "../checkpointData";
import { RootState } from "@/store/store";

type PageProps = {
  params: Promise<{ topic: string; partIndex: string }>;
};

type OrderEvent = { id: string; label: string };
type MatchPair = { id: string; left: string; right: string };
type MCQOption = { id: string; label: string; isCorrect: boolean };

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getStageStartPart(checkpointPart: number): number {
  if (checkpointPart <= 4) return 1;
  if (checkpointPart <= 8) return 5;
  return 9;
}

type CheckpointContentProps = {
  slug: string;
  topicLabel: string;
  partNum: number;
  part4Events: OrderEvent[];
  part8Pairs: MatchPair[];
  part12Options: MCQOption[];
  previewMode: boolean;
};

function CheckpointContent({
  slug,
  topicLabel,
  partNum,
  part4Events,
  part8Pairs,
  part12Options,
  previewMode,
}: CheckpointContentProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [statusTick, setStatusTick] = useState(0);

  const [shuffledAvailable, setShuffledAvailable] = useState<OrderEvent[]>(() => shuffleArray(part4Events));
  const [shuffledLeft, setShuffledLeft] = useState<MatchPair[]>(() => shuffleArray(part8Pairs));
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>(() => shuffleArray(part8Pairs));
  const [shuffledMCQ, setShuffledMCQ] = useState<MCQOption[]>(() => shuffleArray(part12Options));

  const alreadyPassed = useMemo(() => {
    void statusTick;
    return isCheckpointPassed(slug, partNum);
  }, [slug, partNum, statusTick]);
  const hasFailed = useMemo(() => {
    void statusTick;
    return isCheckpointFailed(slug, partNum);
  }, [slug, partNum, statusTick]);
  const miniGamePlayed = useMemo(() => {
    void statusTick;
    return isMiniGamePlayed(slug, partNum);
  }, [slug, partNum, statusTick]);

  // Redirect to mini-game if checkpoint is cleared and game not yet played
  useEffect(() => {
    if (!previewMode && alreadyPassed && !miniGamePlayed) {
      router.push(`/dashboard/mind-upgrade/aqeedah/${slug}/minigame/${partNum}`);
    }
  }, [alreadyPassed, miniGamePlayed, slug, partNum, previewMode, router]);

  const availableOrders = shuffledAvailable.length ? shuffledAvailable : part4Events;
  const remainingOrders = availableOrders.filter((evt) => !selectedOrder.includes(evt.id));
  const chosenOrders = selectedOrder.map((id) => availableOrders.find((evt) => evt.id === id)).filter(Boolean) as OrderEvent[];

  const part8Causes = shuffledLeft.length ? shuffledLeft : part8Pairs;
  const part8Effects = shuffledRight.length ? shuffledRight : part8Pairs;

  const part12Choices = shuffledMCQ.length ? shuffledMCQ : part12Options;

  const handleValidateOrder = () => {
    const nextAttempts = previewMode ? 1 : incrementCheckpointAttempt(slug, partNum);
    const correctOrder = part4Events.every((evt, idx) => selectedOrder[idx] === evt.id);
    const allPicked = selectedOrder.length === part4Events.length;
    const success = allPicked && correctOrder;
    setValidated(true);
    setIsCorrect(success);
    if (success) {
      markCheckpointPassed(slug, partNum);
      resetCheckpointAttempts(slug, partNum);
      setStatusTick((v) => v + 1);
    }
    if (!previewMode && !success && nextAttempts >= 3) {
      markCheckpointFailed(slug, partNum);
      resetStageProgressToStageStart(slug, partNum);
      resetCheckpointAttempts(slug, partNum);
      setStatusTick((v) => v + 1);
      setTimeout(() => {
        const stageStart = getStageStartPart(partNum);
        router.push(`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${stageStart}`);
      }, 2000);
    }
  };

  const handleRetryOrder = () => {
    setSelectedOrder([]);
    setValidated(false);
    setIsCorrect(false);
    setShuffledAvailable(shuffleArray(part4Events));
  };

  const handleSelectLeft = (id: string) => {
    setSelectedLeft((prev) => (prev === id ? null : id));
    setValidated(false);
  };

  const handleSelectRight = (right: string) => {
    if (!selectedLeft) return;
    setSelectedMatches((prev) => ({ ...prev, [selectedLeft]: right }));
    setSelectedLeft(null);
    setValidated(false);
  };

  const handleValidateMatching = () => {
    const nextAttempts = previewMode ? 1 : incrementCheckpointAttempt(slug, partNum);
    const allCorrect = part8Pairs.every((p) => selectedMatches[p.id] === p.right);
    setValidated(true);
    setIsCorrect(allCorrect);
    if (allCorrect) {
      markCheckpointPassed(slug, partNum);
      resetCheckpointAttempts(slug, partNum);
      setStatusTick((v) => v + 1);
    }
    if (!previewMode && !allCorrect && nextAttempts >= 3) {
      markCheckpointFailed(slug, partNum);
      resetStageProgressToStageStart(slug, partNum);
      resetCheckpointAttempts(slug, partNum);
      setStatusTick((v) => v + 1);
      setTimeout(() => {
        const stageStart = getStageStartPart(partNum);
        router.push(`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${stageStart}`);
      }, 2000);
    }
  };

  const handleRetryMatching = () => {
    setSelectedMatches({});
    setSelectedLeft(null);
    setValidated(false);
    setIsCorrect(false);
    setShuffledLeft(shuffleArray(part8Pairs));
    setShuffledRight(shuffleArray(part8Pairs));
  };

  const handleValidateMCQ = () => {
    const nextAttempts = previewMode ? 1 : incrementCheckpointAttempt(slug, partNum);
    const chosen = part12Options.find((opt) => opt.id === selectedOption);
    const correct = chosen?.isCorrect === true;
    setValidated(true);
    setIsCorrect(Boolean(correct));
    if (correct) {
      markCheckpointPassed(slug, partNum);
      resetCheckpointAttempts(slug, partNum);
      setStatusTick((v) => v + 1);
    }
    if (!previewMode && !correct && nextAttempts >= 3) {
      markCheckpointFailed(slug, partNum);
      resetStageProgressToStageStart(slug, partNum);
      resetCheckpointAttempts(slug, partNum);
      setStatusTick((v) => v + 1);
      setTimeout(() => {
        const stageStart = getStageStartPart(partNum);
        router.push(`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${stageStart}`);
      }, 2000);
    }
  };

  const handleRetryMCQ = () => {
    setSelectedOption(null);
    setValidated(false);
    setIsCorrect(false);
    setShuffledMCQ(shuffleArray(part12Options));
  };

  if (partNum === 4) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #ecfeff 0%, #cffafe 100%)", padding: "44px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <section style={{ background: "white", borderRadius: "18px", padding: "32px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px", color: "#0f172a" }}>Checkpoint 4: Order the Key Points</h1>
            <p style={{ color: "#475569", fontWeight: 600, marginBottom: "20px" }}>Place the ideas from this topic in the correct order.</p>

            {hasFailed ? (
              <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", color: "#991b1b", fontWeight: 700 }}>
                Attempts exceeded. Progress reset to stage start. Try again calmly.
              </div>
            ) : null}

            {alreadyPassed ? (
              <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "10px", background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e", color: "#15803d", fontWeight: 700 }}>
                Checkpoint already cleared. Continue when ready.
              </div>
            ) : null}

            {!alreadyPassed && (
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: "8px" }}>Select the order</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {remainingOrders.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedOrder((prev) => [...prev, evt.id])}
                        style={{ padding: "10px 12px", borderRadius: "10px", border: "1px dashed rgba(0,0,0,0.2)", background: "#f8fafc", cursor: "pointer", fontWeight: 600 }}
                      >
                        {evt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: "8px" }}>Your order</div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {chosenOrders.map((evt, idx) => (
                      <div key={evt.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0ea5e9", color: "white", display: "grid", placeItems: "center", fontWeight: 800 }}>{idx + 1}</div>
                        <div style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", background: "white" }}>{evt.label}</div>
                        <button
                          onClick={() => {
                            setSelectedOrder((prev) => prev.filter((id) => id !== evt.id));
                            setValidated(false);
                          }}
                          style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.12)", background: "#fff", cursor: "pointer", fontWeight: 700 }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {validated ? (
                  <div style={{ padding: "12px", borderRadius: "10px", background: isCorrect ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: isCorrect ? "1px solid #22c55e" : "1px solid #ef4444", color: isCorrect ? "#15803d" : "#991b1b", fontWeight: 700 }}>
                    {isCorrect ? "Great! Points are in the right order." : "Attempt recorded. Review the part and try again."}
                  </div>
                ) : null}

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    onClick={handleValidateOrder}
                    disabled={selectedOrder.length !== part4Events.length}
                    style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: selectedOrder.length === part4Events.length ? "#0ea5e9" : "#cbd5e1", color: selectedOrder.length === part4Events.length ? "white" : "#475569", fontWeight: 800, cursor: selectedOrder.length === part4Events.length ? "pointer" : "not-allowed" }}
                  >
                    Check Answer
                  </button>
                  {validated && !isCorrect ? (
                    <button onClick={handleRetryOrder} style={{ padding: "10px 14px", borderRadius: "10px", border: "none", background: "#6b7280", color: "white", fontWeight: 700, cursor: "pointer" }}>
                      Try Again
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            {(alreadyPassed || (validated && isCorrect)) && (
              <Link href={`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${partNum + 1}`} style={{ display: "inline-block", marginTop: "18px", padding: "12px 18px", borderRadius: "10px", background: "#0ea5e9", color: "white", fontWeight: 800, textDecoration: "none" }}>
                Continue to Next Part →
              </Link>
            )}
          </section>
        </div>
      </main>
    );
  }

  if (partNum === 8) {
    const canValidate = Object.keys(selectedMatches).length === part8Pairs.length && !validated;

    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)", padding: "44px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <Link href={`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${partNum}`} style={{ color: "var(--foreground)", textDecoration: "none", fontWeight: 700, background: "var(--background)", border: "1px solid rgba(0,0,0,0.10)", padding: "10px 14px", borderRadius: "12px", display: "inline-block" }}>
              ← Back to Lesson
            </Link>
          </div>

          <section style={{ background: "var(--background)", borderRadius: "18px", padding: "34px", border: "1px solid rgba(0,0,0,0.06)", color: "var(--foreground)" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px", lineHeight: 1.15 }}>Checkpoint: Part 8</h1>
            <div style={{ color: "#666", fontWeight: 600, marginBottom: 24, lineHeight: 1.6 }}>Match causes with their effects from Part 8 of this topic.</div>

            {alreadyPassed ? (
              <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "2px solid #22c55e", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
                <div style={{ color: "#15803d", fontWeight: 800, fontSize: "18px", marginBottom: "10px" }}>😊 Checkpoint passed</div>
                <div style={{ color: "#166534", fontWeight: 600 }}>Well done. You may continue with the lesson.</div>
              </div>
            ) : null}

            {hasFailed ? (
              <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", color: "#991b1b", fontWeight: 700 }}>
                Attempts exceeded. Progress reset to this stage start.
              </div>
            ) : null}

            <div style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
              <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "12px" }}>Match Causes with Effects</div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "16px", fontWeight: 600 }}>Click a cause, then choose its matching effect.</div>

              <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ border: "2px dashed rgba(0,0,0,0.2)", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: "12px" }}>Causes</div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {part8Causes.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectLeft(p.id)}
                        style={{ padding: "10px 12px", border: selectedLeft === p.id ? "1px solid #4f46e5" : "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", background: selectedLeft === p.id ? "#eef2ff" : "white", fontSize: "13px", fontWeight: 600, textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <span>{p.left}</span>
                        {selectedMatches[p.id] && <span style={{ fontSize: "12px", fontWeight: 800, color: "#22c55e" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ border: "2px dashed rgba(0,0,0,0.2)", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#999", marginBottom: "12px" }}>Effects</div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {part8Effects.map((p) => {
                      const isChosen = Object.values(selectedMatches).includes(p.right);
                      return (
                        <button
                          key={p.right}
                          onClick={() => handleSelectRight(p.right)}
                          disabled={isChosen && selectedMatches[selectedLeft ?? ""] !== p.right}
                          style={{ padding: "10px 12px", border: isChosen ? "1px solid #22c55e" : "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", background: isChosen ? "#f0fdf4" : "white", fontSize: "13px", fontWeight: 600, textAlign: "left", cursor: isChosen && selectedMatches[selectedLeft ?? ""] !== p.right ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: isChosen && selectedMatches[selectedLeft ?? ""] !== p.right ? 0.6 : 1 }}
                        >
                          {p.right}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {validated ? (
                <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: isCorrect ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", border: isCorrect ? "1px solid #22c55e" : "1px solid #ef4444", color: isCorrect ? "#15803d" : "#991b1b", fontWeight: 600, fontSize: "14px" }}>
                  {isCorrect ? "😊 Checkpoint cleared. Proceed when ready." : "Attempt recorded. Please review this part and try again."}
                </div>
              ) : null}

              {!alreadyPassed && canValidate ? (
                <button onClick={handleValidateMatching} style={{ marginTop: "16px", padding: "12px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
                  Check Answer
                </button>
              ) : null}

              {validated && !isCorrect ? (
                <button onClick={handleRetryMatching} style={{ marginTop: "16px", marginLeft: "12px", padding: "12px 20px", background: "#6b7280", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
                  Try Again
                </button>
              ) : null}
            </div>

            {(alreadyPassed || (validated && isCorrect)) ? (
              <Link href={`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${partNum + 1}`} style={{ display: "inline-block", marginTop: "18px", padding: "12px 18px", borderRadius: "10px", background: "#0ea5e9", color: "white", fontWeight: 800, textDecoration: "none" }}>
                Continue to Next Part →
              </Link>
            ) : null}
          </section>
        </div>
      </main>
    );
  }

  if (partNum === 12) {
    const canValidate = Boolean(selectedOption) && !validated;

    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%)", padding: "44px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: 18 }}>
            <Link href={`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${partNum}`} style={{ color: "var(--foreground)", textDecoration: "none", fontWeight: 700, background: "var(--background)", border: "1px solid rgba(0,0,0,0.10)", padding: "10px 14px", borderRadius: "12px", display: "inline-block" }}>
              ← Back to Lesson
            </Link>
          </div>

          <section style={{ background: "white", borderRadius: "18px", padding: "34px", border: "1px solid rgba(0,0,0,0.06)", color: "#111" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px", lineHeight: 1.15 }}>Checkpoint: Part 12</h1>
            <div style={{ color: "#666", fontWeight: 600, marginBottom: 24, lineHeight: 1.6 }}>Choose the best takeaway from this topic.</div>

            {alreadyPassed ? (
              <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "2px solid #22c55e", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
                <div style={{ color: "#15803d", fontWeight: 800, fontSize: "18px", marginBottom: "10px" }}>😊 Checkpoint passed</div>
                <div style={{ color: "#166534", fontWeight: 600 }}>You may continue with the lesson.</div>
              </div>
            ) : null}

            {hasFailed ? (
              <div style={{ marginBottom: "16px", padding: "12px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid #ef4444", color: "#991b1b", fontWeight: 700 }}>
                Attempts exceeded. Progress reset to this stage start.
              </div>
            ) : null}

            <div style={{ display: "grid", gap: "12px" }}>
              {part12Choices.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  style={{ textAlign: "left", padding: "12px 14px", borderRadius: "10px", border: selectedOption === opt.id ? "2px solid #f59e0b" : "1px solid rgba(0,0,0,0.12)", background: selectedOption === opt.id ? "#fff7ed" : "white", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {validated ? (
              <div style={{ marginTop: "16px", padding: "12px", borderRadius: "10px", background: isCorrect ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", border: isCorrect ? "1px solid #22c55e" : "1px solid #ef4444", color: isCorrect ? "#15803d" : "#991b1b", fontWeight: 600, fontSize: "14px" }}>
                {isCorrect ? "Great! Checkpoint cleared." : "Attempt recorded. Please review the lesson and try again."}
              </div>
            ) : null}

            {!alreadyPassed && canValidate ? (
              <button onClick={handleValidateMCQ} style={{ marginTop: "16px", padding: "12px 20px", background: "#f59e0b", color: "white", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
                Check Answer
              </button>
            ) : null}

            {validated && !isCorrect ? (
              <button onClick={handleRetryMCQ} style={{ marginTop: "12px", marginLeft: "12px", padding: "10px 16px", background: "#6b7280", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
                Try Again
              </button>
            ) : null}

            {(alreadyPassed || (validated && isCorrect)) ? (
              <Link href={`/dashboard/mind-upgrade/aqeedah/${topicLabel}#part-${partNum + 1}`} style={{ display: "inline-block", marginTop: "18px", padding: "12px 18px", borderRadius: "10px", background: "#0ea5e9", color: "white", fontWeight: 800, textDecoration: "none" }}>
                Continue to Next Part →
              </Link>
            ) : null}
          </section>
        </div>
      </main>
    );
  }

  return null;
}

export default function CheckpointPage({ params }: PageProps) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const previewMode = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD" || roleKey === "TEACHER";

  const resolved = useMemo(() => params, [params]);
  const { topic, partIndex } = use(resolved);

  const partNum = useMemo(() => {
    const parsed = parseInt(partIndex, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [partIndex]);

  const data = useMemo(() => getCheckpointData(topic), [topic]);
  const part4Events = useMemo(() => data?.part4.events ?? [], [data]);
  const part8Pairs = useMemo(() => data?.part8.pairs ?? [], [data]);
  const part12Options = useMemo(() => data?.part12.options ?? [], [data]);

  if (!data || partNum === 0) return null;

  return (
    <CheckpointContent
      key={`${topic}-${partNum}`}
      slug={topic}
      topicLabel={topic}
      partNum={partNum}
      part4Events={part4Events}
      part8Pairs={part8Pairs}
      part12Options={part12Options}
      previewMode={previewMode}
    />
  );
}
