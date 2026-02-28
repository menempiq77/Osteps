"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { AQEEDAH_TOPICS, getTopicTitle } from "./topics";
import { useTranslation } from "@/app/useTranslation";
import AqeedahGridClient from "@/components/stories/AqeedahGridClient";
import StoriesProgressBadge from "@/components/stories/StoriesProgressBadge";
import { RootState } from "@/store/store";
import { fetchStudentMindAssignments } from "@/services/mindUpgradeApi";

export default function AqeedahPage() {
  const { t, language } = useTranslation();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";

  const topicCards = AQEEDAH_TOPICS.map((topic, idx) => ({
    slug: topic.slug,
    title: getTopicTitle(idx, language),
    subtitle:
      typeof topic.shortIntro === "string"
        ? topic.shortIntro
        : topic.shortIntro?.[language] || topic.shortIntro?.en || t({ en: "Sections + quiz", ar: "Sections + quiz" }),
    order: idx + 1,
  })).map((card) => ({
    ...card,
    subtitle: card.subtitle.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/)[0] || card.subtitle,
  }));

  const { data: assignments = [], isError: assignmentsError } = useQuery({
    queryKey: ["mind-upgrade-student-assignments", "aqeedah-page"],
    queryFn: fetchStudentMindAssignments,
    enabled: isStudent,
    staleTime: 60 * 1000,
  });

  const aqeedahStatus = assignments.find((a) => a.course_key === "aqeedah");
  const isAqeedahAccessible = !isStudent || (!assignmentsError && aqeedahStatus?.status === "active");
  const isAqeedahLocked = isStudent && !isAqeedahAccessible;

  return (
    <main
      className="aqeedah-page relative min-h-screen overflow-hidden px-4 py-8 md:px-8 md:py-10"
      style={{
        fontFamily: language === "ar" ? "var(--font-noto-naskh-arabic), system-ui" : "var(--font-raleway), sans-serif",
      }}
    >
      <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full aqeedah-glow-left blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full aqeedah-glow-right blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section className="aqeedah-hero mb-6 rounded-3xl p-6 text-slate-900 shadow-xl backdrop-blur-xl md:p-8">
          <div className="aqeedah-pill mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
            {t({ en: "Mind Upgrade", ar: "Mind Upgrade" })}
          </div>

          <h1 className="aqeedah-title font-extrabold leading-tight">
            {t({ en: "Aqeedah: Islamic Creed", ar: "Aqeedah: Islamic Creed" })}
          </h1>

          <p className="aqeedah-subtitle mt-3 max-w-3xl">
            {t({
              en: "Learn the foundations of Islamic belief through short sections and quizzes.",
              ar: "Learn the foundations of Islamic belief through short sections and quizzes.",
            })}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/mind-upgrade"
              className="aqeedah-chip rounded-xl px-4 py-2 text-sm font-bold transition"
            >
              {t({ en: "Back to Mind Upgrade", ar: "Back to Mind Upgrade" })}
            </Link>

            <div className="aqeedah-chip rounded-xl px-4 py-2 text-sm font-semibold">
              {t({ en: `${topicCards.length} Topics`, ar: `${topicCards.length} Topics` })}
            </div>

            <div className="aqeedah-chip rounded-xl px-4 py-2 text-sm font-semibold">
              {t({ en: "Pass: 7/10", ar: "Pass: 7/10" })}
            </div>
          </div>
        </section>

        <div className="mb-5 rounded-2xl border border-white/20 bg-white/85 p-4 shadow-lg">
          <StoriesProgressBadge slugs={topicCards.map((topic) => topic.slug)} total={topicCards.length} showXP />
        </div>

        {isAqeedahLocked ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
            {assignmentsError
              ? "This course is hidden until assignment status can be verified."
              : "This course is currently locked for your class."}
            {aqeedahStatus?.status === "upcoming" && aqeedahStatus?.starts_at
              ? ` Available on ${new Date(aqeedahStatus.starts_at).toLocaleString()}.`
              : null}
            {aqeedahStatus?.status === "expired" && aqeedahStatus?.ends_at
              ? ` Assignment ended on ${new Date(aqeedahStatus.ends_at).toLocaleString()}.`
              : null}
          </div>
        ) : (
          <AqeedahGridClient topics={topicCards} basePath="/dashboard/mind-upgrade/aqeedah" />
        )}
      </div>
      <style jsx global>{`
        .aqeedah-page {
          background:
            linear-gradient(
              145deg,
              color-mix(in srgb, var(--theme-soft) 90%, #f8fafc) 0%,
              color-mix(in srgb, var(--primary) 12%, #ffffff) 52%,
              color-mix(in srgb, var(--theme-soft-2) 82%, #f1f5f9) 100%
            );
        }
        .aqeedah-glow-left {
          background: color-mix(in srgb, var(--primary) 18%, transparent);
        }
        .aqeedah-glow-right {
          background: color-mix(in srgb, var(--theme-scroll-start) 18%, transparent);
        }
        .aqeedah-hero {
          border: 1px solid color-mix(in srgb, var(--primary) 24%, #cbd5e1);
          background: color-mix(in srgb, var(--theme-soft) 72%, #ffffff);
        }
        .aqeedah-pill {
          border: 1px solid color-mix(in srgb, var(--primary) 28%, #cbd5e1);
          background: color-mix(in srgb, var(--primary) 18%, #ffffff);
          color: var(--theme-dark);
        }
        .aqeedah-title {
          font-size: clamp(1.45rem, 0.65vw + 1.05rem, 1.95rem) !important;
          line-height: 1.22 !important;
          letter-spacing: -0.02em;
        }
        .aqeedah-subtitle {
          font-size: clamp(0.9rem, 0.2vw + 0.84rem, 1rem) !important;
          line-height: 1.48 !important;
          color: color-mix(in srgb, var(--theme-dark) 80%, #334155);
        }
        .aqeedah-chip {
          font-size: 0.88rem !important;
        }
        .aqeedah-chip {
          border: 1px solid color-mix(in srgb, var(--primary) 24%, #cbd5e1);
          background: color-mix(in srgb, var(--primary) 14%, #ffffff);
          color: var(--theme-dark);
        }
        .aqeedah-chip:hover {
          background: color-mix(in srgb, var(--primary) 24%, #ffffff);
        }
        @media (max-width: 768px) {
          .aqeedah-title {
            font-size: 1.35rem !important;
          }
          .aqeedah-subtitle {
            font-size: 0.88rem !important;
          }
        }
      `}</style>
    </main>
  );
}
