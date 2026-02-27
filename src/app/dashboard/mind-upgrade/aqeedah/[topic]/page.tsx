"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import StoryStepper from "@/components/stories/StoryStepper";
import { getAqeedahTopicBySlug } from "../topics";
import { useTranslation } from "@/app/useTranslation";
import { use } from "react";

type PageProps = {
  params: Promise<{ topic: string }>;
};

export default function AqeedahTopicPage({ params }: PageProps) {
  const { topic } = use(params);
  const { t, language } = useTranslation();
  const lesson = getAqeedahTopicBySlug(topic);

  if (!lesson) {
    notFound();
  }

  const shortIntro = typeof lesson.shortIntro === "string" 
    ? lesson.shortIntro 
    : lesson.shortIntro[language];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)",
        padding: "44px 20px",
        fontFamily: language === "ar" ? "var(--font-noto-naskh-arabic), system-ui" : "system-ui",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
          <Link
            href="/dashboard/mind-upgrade/aqeedah"
            style={{
              color: "var(--foreground)",
              textDecoration: "none",
              fontWeight: 700,
              background: "var(--background)",
              border: "1px solid rgba(0,0,0,0.10)",
              padding: "10px 14px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            {t({ en: "← Back", ar: "→ رجوع" })}
          </Link>

          <Link
            href="/dashboard"
            style={{
              color: "var(--foreground)",
              textDecoration: "none",
              fontWeight: 700,
              background: "var(--background)",
              border: "1px solid rgba(0,0,0,0.10)",
              padding: "10px 14px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            {t({ en: "Home", ar: "الرئيسية" })}
          </Link>
        </div>

        <section
          style={{
            background: "var(--background)",
            borderRadius: "18px",
            padding: "34px",
            border: "1px solid rgba(0,0,0,0.06)",
            color: "var(--foreground)",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "800",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}
          >
            {lesson.name}
          </h1>

          <div
            style={{
              color: "#333",
              fontWeight: 650,
              marginBottom: 18,
              lineHeight: 1.75,
              fontSize: 16,
            }}
          >
            {shortIntro}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <StoryStepper story={lesson} basePath="/dashboard/mind-upgrade/aqeedah" />

            <div
              style={{
                background: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                {t({ en: "Qur'an references (surahs)", ar: "مراجع القرآن (السور)" })}
              </div>
              <div
                style={{
                  color: "#111",
                  fontWeight: 650,
                  lineHeight: 1.9,
                  fontSize: 16,
                }}
              >
                {lesson.quranSurahs.length ? lesson.quranSurahs.join(" • ") : "—"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
