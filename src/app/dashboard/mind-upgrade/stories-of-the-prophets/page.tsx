"use client";

import Link from "next/link";
import { PROPHETS } from "./prophets";
import { useTranslation } from "@/app/useTranslation";
import ProphetsGridClient from "@/components/stories/ProphetsGridClient";
import StoriesProgressBadge from "@/components/stories/StoriesProgressBadge";

export default function StoriesOfTheProphetsPage() {
  const { t, language } = useTranslation();
  const prophetCards = PROPHETS.map((prophet, idx) => ({
    slug: prophet.slug,
    title: prophet.name,
    subtitle: prophet.subtitle,
    order: idx + 1,
  }));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            {t({ en: "📖 Stories of the Prophets", ar: "📖 قصص الأنبياء" })}
          </h1>
          <p
            style={{
              fontSize: "18px",
              opacity: 0.95,
              fontWeight: 500,
            }}
          >
            {t({ en: "Learn from the lives of 25 prophets mentioned in the Qur'an", ar: "تعلم من حياة 25 نبياً ورد ذكرهم في القرآن الكريم" })}
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

        <StoriesProgressBadge slugs={prophetCards.map((p) => p.slug)} total={prophetCards.length} showXP />

        {/* Prophets Grid */}
        <ProphetsGridClient prophets={prophetCards} basePath="/dashboard/mind-upgrade/stories-of-the-prophets" />
      </div>
    </main>
  );
}
