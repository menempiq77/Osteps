"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Prophet } from "@/app/dashboard/mind-upgrade/stories-of-the-prophets/prophets";
import { getStoryProgress, getStoryRewards, isStoryInProgress } from "./storyProgress";

type Props = {
  prophets: Prophet[];
};

export default function ProphetsGridClient({ prophets }: Props) {
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

  const slugs = useMemo(() => prophets.map((p) => p.slug), [prophets]);

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
  }, [slugs]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "20px",
      }}
    >
      {prophets.map((p) => {
        const isDone = completedSlugs.has(p.slug);
        const isInProgress = inProgressSlugs.has(p.slug);
        const quizBadge = quizBadgeBySlug.get(p.slug);
        const rewards = rewardsBySlug.get(p.slug);

        const quizColor = quizBadge?.status === "passed" ? "#0f5132" : "#842029";
        const quizBg = quizBadge?.status === "passed" ? "rgba(25,135,84,0.12)" : "rgba(220,53,69,0.12)";
        const quizBorder =
          quizBadge?.status === "passed" ? "1px solid rgba(25,135,84,0.25)" : "1px solid rgba(220,53,69,0.25)";

        return (
          <Link
            key={p.slug}
            href={`/mind-upgrade/stories-of-the-prophets/${p.slug}`}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px 20px",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* In Progress Badge - Top Right */}
            {isInProgress && !isDone ? (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "#0369a1",
                  background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                  border: "2px solid #0ea5e9",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: "0 2px 6px rgba(14, 165, 233, 0.25)",
                }}
              >
                📖 In Progress
              </div>
            ) : null}

            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "800",
                color: "white",
                marginBottom: "14px",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
            >
              {p.icon}
            </div>

            <div
              style={{
                fontWeight: "800",
                fontSize: "20px",
                marginBottom: "6px",
                color: "#333",
              }}
            >
              {p.name}
            </div>

            {rewards ? (
              <div
                style={{
                  marginTop: 6,
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
                      color: "#333",
                      background: "rgba(0,0,0,0.05)",
                      border: "1px solid rgba(0,0,0,0.08)",
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

            <div
              style={{
                color: "#666",
                fontSize: "13px",
                fontWeight: "700",
                minHeight: 18,
              }}
            >
              {p.subtitle}
            </div>

            {quizBadge ? (
              <div
                style={{
                  marginTop: 12,
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

            <div
              style={{
                color: "#667eea",
                fontSize: "13px",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              {isDone ? "Review →" : "Open →"}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
