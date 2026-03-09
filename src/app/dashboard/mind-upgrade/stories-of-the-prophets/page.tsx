"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { PROPHETS } from "./prophets";
import { useTranslation } from "@/app/useTranslation";
import ProphetsGridClient from "@/components/stories/ProphetsGridClient";
import StoriesProgressBadge from "@/components/stories/StoriesProgressBadge";
import { RootState } from "@/store/store";
import { fetchStudentMindAssignments } from "@/services/mindUpgradeApi";

export default function StoriesOfTheProphetsPage() {
  const { t, language } = useTranslation();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";
  const topicCount = PROPHETS.length;

  const { data: assignments = [], isError: assignmentsError } = useQuery({
    queryKey: ["mind-upgrade-student-assignments", "stories-page"],
    queryFn: fetchStudentMindAssignments,
    enabled: isStudent,
    staleTime: 60 * 1000,
  });

  const storiesStatus = assignments.find((a) => a.course_key === "stories_of_the_prophets");
  const isStoriesAccessible = !isStudent || (!assignmentsError && storiesStatus?.status === "active");
  const isStoriesLocked = isStudent && !isStoriesAccessible;

  return (
    <main
      className="stories-page relative min-h-screen overflow-hidden px-4 py-8 md:px-8 md:py-10"
      style={{
        fontFamily:
          language === "ar"
            ? "var(--font-noto-naskh-arabic), system-ui"
            : "var(--font-raleway), sans-serif",
      }}
    >
      <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full stories-glow-left blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full stories-glow-right blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section className="stories-hero mb-6 rounded-3xl p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
          <div className="stories-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
            {t({ en: "Mind Upgrade", ar: "Mind Upgrade" })}
          </div>

          <h1 className="stories-title font-extrabold leading-tight">
            {t({ en: "Stories of the Prophets", ar: "Stories of the Prophets" })}
          </h1>

          <p className="stories-subtitle mt-3 max-w-3xl">
            {t({
              en: "Learn from the lives of prophets mentioned in the Qur'an through short sections and quizzes.",
              ar: "Learn from the lives of prophets mentioned in the Qur'an through short sections and quizzes.",
            })}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/mind-upgrade"
              className="stories-chip rounded-xl px-4 py-2 text-sm font-bold transition"
            >
              {t({ en: "Back to Mind Upgrade", ar: "Back to Mind Upgrade" })}
            </Link>

            <div className="stories-chip rounded-xl px-4 py-2 text-sm font-semibold">
              {t({ en: `${topicCount} Topics`, ar: `${topicCount} Topics` })}
            </div>

            <div className="stories-chip rounded-xl px-4 py-2 text-sm font-semibold">
              {t({ en: "Pass requirement: 7/10", ar: "Pass requirement: 7/10" })}
            </div>
          </div>
        </section>

        <div className="mb-5 rounded-2xl border border-white/20 bg-white/85 p-4 shadow-lg">
          <StoriesProgressBadge slugs={PROPHETS.map((p) => p.slug)} total={topicCount} showXP />
        </div>

        {isStoriesLocked ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">
            {assignmentsError
              ? "This course is hidden until assignment status can be verified."
              : "This course is currently locked for your class."}
            {storiesStatus?.status === "upcoming" && storiesStatus?.starts_at
              ? ` Available on ${new Date(storiesStatus.starts_at).toLocaleString()}.`
              : null}
            {storiesStatus?.status === "expired" && storiesStatus?.ends_at
              ? ` Assignment ended on ${new Date(storiesStatus.ends_at).toLocaleString()}.`
              : null}
          </div>
        ) : (
          <ProphetsGridClient prophets={PROPHETS} />
        )}
      </div>
      <style jsx global>{`
        .stories-page {
          color: var(--theme-dark);
          background:
            linear-gradient(
              145deg,
              color-mix(in srgb, var(--theme-soft) 90%, #f8fafc) 0%,
              color-mix(in srgb, var(--primary) 12%, #ffffff) 52%,
              color-mix(in srgb, var(--theme-soft-2) 82%, #f1f5f9) 100%
            );
        }
        .stories-glow-left {
          background: color-mix(in srgb, var(--primary) 18%, transparent);
        }
        .stories-glow-right {
          background: color-mix(in srgb, var(--theme-scroll-start) 18%, transparent);
        }
        .stories-hero {
          border: 1px solid color-mix(in srgb, var(--primary) 24%, #cbd5e1);
          background: color-mix(in srgb, var(--theme-soft) 72%, #ffffff);
        }
        .stories-pill {
          border: 1px solid color-mix(in srgb, var(--primary) 28%, #cbd5e1);
          background: color-mix(in srgb, var(--primary) 18%, #ffffff);
          color: var(--theme-dark);
        }
        .stories-title {
          font-size: clamp(1.45rem, 0.65vw + 1.05rem, 1.95rem) !important;
          line-height: 1.22 !important;
          letter-spacing: -0.02em;
        }
        .stories-subtitle {
          font-size: clamp(0.9rem, 0.2vw + 0.84rem, 1rem) !important;
          line-height: 1.48 !important;
          color: color-mix(in srgb, var(--theme-dark) 80%, #334155);
        }
        .stories-chip {
          font-size: 0.88rem !important;
          border: 1px solid color-mix(in srgb, var(--primary) 24%, #cbd5e1);
          background: color-mix(in srgb, var(--primary) 14%, #ffffff);
          color: var(--theme-dark);
        }
        .stories-chip:hover {
          background: color-mix(in srgb, var(--primary) 24%, #ffffff);
        }
        @media (max-width: 768px) {
          .stories-title {
            font-size: 1.35rem !important;
          }
          .stories-subtitle {
            font-size: 0.88rem !important;
          }
        }
      `}</style>
    </main>
  );
}
