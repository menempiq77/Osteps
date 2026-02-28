"use client";

import Link from "next/link";
import { AQEEDAH_TOPICS, getTopicTitle } from "./topics";
import { useTranslation } from "@/app/useTranslation";
import AqeedahGridClient from "@/components/stories/AqeedahGridClient";
import StoriesProgressBadge from "@/components/stories/StoriesProgressBadge";

export default function AqeedahPage() {
  const { t, language } = useTranslation();

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

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 px-4 py-8 md:px-8 md:py-10"
      style={{
        fontFamily: language === "ar" ? "var(--font-noto-naskh-arabic), system-ui" : "var(--font-raleway), sans-serif",
      }}
    >
      <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section className="mb-6 rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-4 inline-flex rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
            {t({ en: "Mind Upgrade", ar: "Mind Upgrade" })}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            {t({ en: "Aqeedah: Islamic Creed", ar: "Aqeedah: Islamic Creed" })}
          </h1>

          <p className="mt-3 max-w-3xl text-sm text-emerald-50 md:text-lg">
            {t({
              en: "Learn the foundations of Islamic belief through short sections and quizzes.",
              ar: "Learn the foundations of Islamic belief through short sections and quizzes.",
            })}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/mind-upgrade"
              className="rounded-xl border border-white/35 bg-white/15 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/25"
            >
              {t({ en: "Back to Mind Upgrade", ar: "Back to Mind Upgrade" })}
            </Link>

            <div className="rounded-xl border border-white/30 bg-black/10 px-4 py-2 text-sm font-semibold">
              {t({ en: `${topicCards.length} Topics`, ar: `${topicCards.length} Topics` })}
            </div>

            <div className="rounded-xl border border-white/30 bg-black/10 px-4 py-2 text-sm font-semibold">
              {t({ en: "Pass: 7/10", ar: "Pass: 7/10" })}
            </div>
          </div>
        </section>

        <div className="mb-5 rounded-2xl border border-white/20 bg-white/85 p-4 shadow-lg">
          <StoriesProgressBadge slugs={topicCards.map((topic) => topic.slug)} total={topicCards.length} showXP />
        </div>

        <AqeedahGridClient topics={topicCards} basePath="/dashboard/mind-upgrade/aqeedah" />
      </div>
    </main>
  );
}
