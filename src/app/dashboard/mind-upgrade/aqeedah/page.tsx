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
        : topic.shortIntro?.[language] || topic.shortIntro?.en || t({ en: "Sections + quiz", ar: "أقسام + اختبار" }),
    order: idx + 1,
  })).map((card) => ({
    ...card,
    subtitle: card.subtitle.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/)[0] || card.subtitle,
  }));
  
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        padding: "60px 20px",
        fontFamily: language === "ar" ? "var(--font-noto-naskh-arabic), system-ui" : "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              marginBottom: "12px",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            {t({ en: "☪️ Aqeedah - Islamic Creed", ar: "☪️ العقيدة الإسلامية" })}
          </h1>
          <p
            style={{
              fontSize: "18px",
              opacity: 0.95,
              fontWeight: 500,
            }}
          >
            {t({ en: "Learn the foundations of Islamic belief", ar: "تعلم أسس العقيدة الإسلامية" })}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Link
            href="/dashboard/mind-upgrade"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "12px 20px",
              borderRadius: "12px",
              display: "inline-block",
              transition: "all 0.3s ease",
            }}
          >
            {t({ en: "← Back to Mind Upgrade", ar: "→ العودة إلى تطوير العقل" })}
          </Link>
        </div>

        <StoriesProgressBadge slugs={topicCards.map((t) => t.slug)} total={topicCards.length} showXP />

        {/* Topics Grid */}
        <AqeedahGridClient topics={topicCards} basePath="/dashboard/mind-upgrade/aqeedah" />
      </div>
    </main>
  );
}
