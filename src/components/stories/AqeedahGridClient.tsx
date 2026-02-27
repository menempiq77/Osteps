"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getStoryProgress, getStoryRewards, isStoryInProgress } from "./storyProgress";

type TopicCard = {
  slug: string;
  title: string;
  subtitle: string;
  order: number;
};

type Props = {
  topics: TopicCard[];
  basePath?: string;
};

function toOneSentence(text: string): string {
  const cleaned = (text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const match = cleaned.match(/(.+?[.!?])(\s|$)/);
  const sentence = match ? match[1] : cleaned;
  return sentence.length > 80 ? `${sentence.slice(0, 77).trimEnd()}…` : sentence;
}

export default function AqeedahGridClient({ topics, basePath = "/mind-upgrade/aqeedah" }: Props) {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [inProgressSlugs, setInProgressSlugs] = useState<Set<string>>(new Set());
  const [quizBadgeBySlug, setQuizBadgeBySlug] = useState<
    Map<
      string,
      {
        status: "passed" | "failed";
        statusText: "Passed" | "Failed";
        detailText: string;
        percent: number;
      }
    >
  >(new Map());
  const [rewardsBySlug, setRewardsBySlug] = useState<Map<string, { xp: number; badge?: string }>>(new Map());

  const slugs = useMemo(() => topics.map((t) => t.slug), [topics]);

  function ordinal(n: number) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return `${n}st`;
    if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
    if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
    return `${n}th`;
  }

  useEffect(() => {
    function refresh() {
      const done = new Set<string>();
      const inProgress = new Set<string>();
      const quizMap = new Map<
        string,
        {
          status: "passed" | "failed";
          statusText: "Passed" | "Failed";
          detailText: string;
          percent: number;
        }
      >();

      const rewardsMap = new Map<string, { xp: number; badge?: string }>();
      for (const slug of slugs) {
        const p = getStoryProgress(slug);
        if (p.isStoryCompleted) {
          done.add(slug);
        } else if (isStoryInProgress(slug)) {
          inProgress.add(slug);
        }

        const rewards = getStoryRewards(slug);
        if (rewards && (rewards.xp > 0 || rewards.badge)) {
          rewardsMap.set(slug, { xp: rewards.xp, badge: rewards.badge });
        }

        try {
          const raw = window.localStorage.getItem(`islamic_curriculum_story_quiz_v1:${slug}`);
          if (raw) {
            const parsed = JSON.parse(raw) as {
              status?: unknown;
              passed?: unknown;
              score?: unknown;
              total?: unknown;
              attempts?: unknown;
              passedAtAttempt?: unknown;
            };
            const hasAttempt = typeof parsed?.score === "number";
            const total = typeof parsed?.total === "number" && parsed.total > 0 ? parsed.total : 10;
            const percent = hasAttempt ? Math.round((Number(parsed.score) / total) * 100) : 0;
            const attempts =
              typeof parsed?.attempts === "number" && parsed.attempts > 0 ? parsed.attempts : undefined;
            if (hasAttempt) {
              const isPassed = parsed?.status === "COMPLETED" || Boolean(parsed?.passed);
              if (isPassed) {
                const passedAt =
                  typeof parsed?.passedAtAttempt === "number" && parsed.passedAtAttempt > 0
                    ? parsed.passedAtAttempt
                    : attempts ?? 1;
                quizMap.set(slug, {
                  status: "passed",
                  statusText: "Passed",
                  detailText: `${ordinal(passedAt)} time`,
                  percent,
                });
              } else {
                const n = attempts ?? 1;
                quizMap.set(slug, {
                  status: "failed",
                  statusText: "Failed",
                  detailText: `${n} ${n === 1 ? "time" : "times"}`,
                  percent,
                });
              }
            }
          }
        } catch {
          // ignore
        }
      }
      setCompletedSlugs(done);
      setInProgressSlugs(inProgress);
      setQuizBadgeBySlug(quizMap);
      setRewardsBySlug(rewardsMap);
    }

    refresh();

    function onStorage(e: StorageEvent) {
      if (!e.key) return;
      if (
        e.key.startsWith("islamic_curriculum_story_progress_v1:") ||
        e.key.startsWith("islamic_curriculum_story_quiz_v1:")
      ) {
        refresh();
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("story-progress-updated", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("story-progress-updated", refresh);
    };
  }, [slugs, setQuizBadgeBySlug]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "20px",
      }}
    >
      {topics.map((topic) => {
        const isDone = completedSlugs.has(topic.slug);
        const isInProgress = inProgressSlugs.has(topic.slug);
        const quizBadge = quizBadgeBySlug.get(topic.slug);
        const rewards = rewardsBySlug.get(topic.slug);
        const subtitle = toOneSentence(topic.subtitle);

        const quizColor = quizBadge?.status === "passed" ? "#0f5132" : "#842029";
        const quizBg = quizBadge?.status === "passed" ? "rgba(25,135,84,0.12)" : "rgba(220,53,69,0.12)";
        const quizBorder =
          quizBadge?.status === "passed" ? "1px solid rgba(25,135,84,0.25)" : "1px solid rgba(220,53,69,0.25)";

        return (
          <Link
            key={topic.slug}
            href={`${basePath}/${topic.slug}`}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "22px 18px",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              position: "relative",
            }}
          >
            {isInProgress && !isDone ? (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "#065f46",
                  background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  border: "2px solid #22c55e",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: "0 2px 6px rgba(34, 197, 94, 0.25)",
                }}
              >
                📖 In Progress
              </div>
            ) : null}

            <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
              >
                {topic.order}
              </div>

              <div style={{ fontWeight: "800", fontSize: "18px", color: "#0f172a", textAlign: "center" }}>{topic.title}</div>
            </div>

            {rewards ? (
              <div
                style={{
                  marginTop: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {typeof rewards.xp === "number" && rewards.xp > 0 ? (
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 12,
                      color: "#065f46",
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.32)",
                      padding: "6px 10px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    XP: {rewards.xp}
                  </div>
                ) : null}

                {rewards.badge ? (
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 12,
                      color: "#854d0e",
                      background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
                      border: "2px solid #f59e0b",
                      padding: "6px 10px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    🏆 {rewards.badge}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div style={{ color: "#475569", fontSize: "13px", fontWeight: 600, lineHeight: 1.5, minHeight: 32, textAlign: "center" }}>
              {subtitle}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: 8 }}>
              <span style={{ color: "#047857", fontSize: "16px", fontWeight: "700" }}>
                {isDone ? "Review" : "Open"}
              </span>
              <span style={{ color: "#047857", fontSize: "18px" }}>→</span>
            </div>

            {quizBadge ? (
              <div
                style={{
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  color: quizColor,
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 13,
                    color: quizColor,
                    background: quizBg,
                    border: quizBorder,
                    padding: "6px 12px",
                    borderRadius: 999,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {quizBadge.statusText}
                </div>

                <div
                  aria-label={`Quiz score ${quizBadge.percent}%`}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: `conic-gradient(${quizColor} ${quizBadge.percent}%, rgba(0,0,0,0.10) 0)`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 12,
                      color: quizColor,
                      background: "rgba(255,255,255,0.92)",
                    }}
                  >
                    {quizBadge.percent}%
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.9 }}>{quizBadge.detailText}</div>
              </div>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
