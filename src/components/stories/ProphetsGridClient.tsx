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
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "18px",
        maxWidth: "1400px",
        margin: "0 auto",
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
            href={`/dashboard/mind-upgrade/stories-of-the-prophets/${p.slug}`}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
              borderRadius: "16px",
              padding: "22px 18px",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 6px 18px rgba(102, 126, 234, 0.12)",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              border: "1px solid rgba(102, 126, 234, 0.18)",
              cursor: "pointer",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 26px rgba(102, 126, 234, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 18px rgba(102, 126, 234, 0.12)";
            }}
          >
            {isInProgress && !isDone ? (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#0369a1",
                  background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                  border: "1px solid #0ea5e9",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                }}
              >
                In Progress
              </div>
            ) : null}

            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "23px",
                fontWeight: "700",
                color: "white",
                marginBottom: "12px",
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              {p.icon}
            </div>

            <div
              style={{
                fontWeight: "700",
                fontSize: "clamp(1.05rem, 0.26vw + 0.96rem, 1.25rem)",
                marginBottom: "6px",
                color: "#1a1a2e",
                lineHeight: "1.24",
                letterSpacing: "-0.2px",
              }}
            >
              {p.name}
            </div>

            {rewards ? (
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: "6px",
                }}
              >
                {typeof rewards.xp === "number" && rewards.xp > 0 ? (
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "12px",
                      color: "#667eea",
                      background: "linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)",
                      border: "1px solid #c4b5fd",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rewards.xp} XP
                  </div>
                ) : null}

                {rewards.badge ? (
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "12px",
                      color: "#854d0e",
                      background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
                      border: "1px solid #f59e0b",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rewards.badge}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              style={{
                color: "#555",
                fontSize: "13px",
                fontWeight: "500",
                marginBottom: "12px",
                opacity: 0.86,
                minHeight: "18px",
                marginTop: "2px",
                lineHeight: 1.35,
              }}
            >
              {p.subtitle}
            </div>

            {quizBadge ? (
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: quizColor,
                  paddingTop: "10px",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "12px",
                    color: quizColor,
                    background: quizBg,
                    border: quizBorder,
                    padding: "6px 12px",
                    borderRadius: "999px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {quizBadge.statusText}
                </div>

                <div
                  aria-label={`Quiz score ${quizBadge.percent}%`}
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: `conic-gradient(${quizColor} ${quizBadge.percent}%, rgba(0,0,0,0.08) 0)`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "12px",
                      color: quizColor,
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    {quizBadge.percent}%
                  </div>
                </div>

                <div style={{ fontSize: "11px", fontWeight: "600", opacity: 0.85 }}>{quizBadge.detailText}</div>
              </div>
            ) : null}

            <div
              style={{
                color: "#667eea",
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "auto",
                paddingTop: "10px",
                transition: "all 0.3s ease",
              }}
            >
              {isDone ? "Review ->" : "Open ->"}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
