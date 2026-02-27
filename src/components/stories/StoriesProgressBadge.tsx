"use client";

import { useSyncExternalStore } from "react";

type Props = {
  slugs: string[];
  total: number;
  showXP?: boolean;
};

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (!e.key) return;
    if (
      e.key.startsWith("islamic_curriculum_story_progress_v1:") ||
      e.key.startsWith("islamic_curriculum_story_quiz_v1:") ||
      e.key.includes("_rewards")
    ) {
      callback();
    }
  };

  const onProgress = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener("story-progress-updated", onProgress);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("story-progress-updated", onProgress);
  };
}

function hasPassedRequiredQuiz(slug: string) {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(`islamic_curriculum_story_quiz_v1:${slug}`);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { passed?: unknown; score?: unknown };
    return Boolean(parsed?.passed) && typeof parsed?.score === "number" && parsed.score >= 7;
  } catch {
    return false;
  }
}

function getCompletedCount(slugs: string[]) {
  if (typeof window === "undefined") return 0;
  let count = 0;
  for (const slug of slugs) {
    if (hasPassedRequiredQuiz(slug)) count++;
  }
  return count;
}

function getTotalXP(slugs: string[]) {
  if (typeof window === "undefined") return 0;
  let total = 0;
  const REWARDS_PREFIX = "islamic_curriculum_story_progress_v1_rewards";
  for (const slug of slugs) {
    try {
      const raw = window.localStorage.getItem(`${REWARDS_PREFIX}:${slug}`);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { xp?: unknown };
      if (typeof parsed.xp === "number" && Number.isFinite(parsed.xp)) {
        total += parsed.xp;
      }
    } catch {
      // ignore
    }
  }
  return total;
}

export default function StoriesProgressBadge({ slugs, total, showXP }: Props) {
  const completed = useSyncExternalStore(
    subscribe,
    () => getCompletedCount(slugs),
    () => 0,
  );

  const totalXP = useSyncExternalStore(
    subscribe,
    () => getTotalXP(slugs),
    () => 0,
  );

  const clampedTotal = Math.max(0, total);
  const pct = clampedTotal > 0 ? Math.min(100, Math.round((completed / clampedTotal) * 100)) : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        marginTop: 10,
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 13,
          color: "#333",
          background: "rgba(102, 126, 234, 0.10)",
          border: "1px solid rgba(102, 126, 234, 0.22)",
          padding: "6px 12px",
          borderRadius: 999,
        }}
      >
        Progress: {completed}/{clampedTotal}
      </div>

      {showXP && totalXP > 0 ? (
        <div
          style={{
            fontWeight: 900,
            fontSize: 13,
            color: "#854d0e",
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
            border: "2px solid #f59e0b",
            padding: "6px 12px",
            borderRadius: 999,
            boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
          }}
        >
          Total XP: {totalXP}
        </div>
      ) : null}

      <div
        aria-label={`Progress ${completed} of ${clampedTotal}`}
        style={{
          width: 160,
          height: 8,
          borderRadius: 999,
          background: "rgba(0,0,0,0.10)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            transition: "width 250ms ease",
          }}
        />
      </div>
    </div>
  );
}
