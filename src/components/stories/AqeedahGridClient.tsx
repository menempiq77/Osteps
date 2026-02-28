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
  return sentence.length > 80 ? `${sentence.slice(0, 77).trimEnd()}...` : sentence;
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

  const slugs = useMemo(() => topics.map((topic) => topic.slug), [topics]);

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
            className="group relative flex min-h-[250px] flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-5 text-slate-900 shadow-[0_8px_28px_rgba(2,6,23,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_14px_32px_rgba(2,6,23,0.12)]"
          >
            {isInProgress && !isDone ? (
              <div className="absolute right-3 top-3 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">
                In progress
              </div>
            ) : null}

            {isDone ? (
              <div className="absolute left-3 top-3 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">
                Completed
              </div>
            ) : null}

            <div className="grid place-items-center gap-2 pt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-base font-extrabold text-white shadow-lg shadow-emerald-500/30">
                {topic.order}
              </div>

              <div className="line-clamp-2 text-center text-base font-extrabold text-slate-900">{topic.title}</div>
            </div>

            {rewards ? (
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                {typeof rewards.xp === "number" && rewards.xp > 0 ? (
                  <div className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
                    XP: {rewards.xp}
                  </div>
                ) : null}

                {rewards.badge ? (
                  <div className="rounded-full border border-amber-400 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 px-2 py-1 text-xs font-black text-amber-800 shadow-sm">
                    Award: {rewards.badge}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="line-clamp-2 min-h-10 text-center text-xs font-semibold leading-relaxed text-slate-600">{subtitle}</div>

            <div className="mt-auto flex items-center justify-center gap-2 text-emerald-700">
              <span className="text-sm font-bold">{isDone ? "Review" : "Open"}</span>
              <span className="text-base transition-transform group-hover:translate-x-0.5">{"->"}</span>
            </div>

            {quizBadge ? (
              <div className="mt-2 flex flex-col items-center gap-2">
                <div
                  style={{ color: quizColor, background: quizBg, border: quizBorder }}
                  className="rounded-full px-3 py-1 text-xs font-black"
                >
                  {quizBadge.statusText}
                </div>

                <div
                  aria-label={`Quiz score ${quizBadge.percent}%`}
                  className="grid h-12 w-12 place-items-center rounded-full"
                  style={{ background: `conic-gradient(${quizColor} ${quizBadge.percent}%, rgba(0,0,0,0.10) 0)` }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[11px] font-black"
                    style={{ color: quizColor }}
                  >
                    {quizBadge.percent}%
                  </div>
                </div>

                <div className="text-xs font-extrabold text-slate-700">{quizBadge.detailText}</div>
              </div>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

