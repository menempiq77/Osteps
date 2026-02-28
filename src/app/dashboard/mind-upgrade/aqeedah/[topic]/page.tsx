"use client";

import Link from "next/link";
import StoryStepper from "@/components/stories/StoryStepper";
import { getAqeedahTopicBySlug } from "../topics";
import { useTranslation } from "@/app/useTranslation";
import { use } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/store/store";
import { fetchStudentMindAssignments } from "@/services/mindUpgradeApi";

type PageProps = {
  params: Promise<{ topic: string }>;
};

export default function AqeedahTopicPage({ params }: PageProps) {
  const { topic } = use(params);
  const { t, language } = useTranslation();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";
  const canPreviewAll = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD" || roleKey === "TEACHER";
  const lesson = getAqeedahTopicBySlug(topic);

  const { data: assignments = [], isError: assignmentsError } = useQuery({
    queryKey: ["mind-upgrade-student-assignments", "aqeedah-topic-page"],
    queryFn: fetchStudentMindAssignments,
    enabled: isStudent,
    staleTime: 60 * 1000,
  });

  const aqeedahStatus = assignments.find((a) => a.course_key === "aqeedah");
  const isAqeedahAccessible = !isStudent || (!assignmentsError && aqeedahStatus?.status === "active");
  const isAqeedahLocked = isStudent && !isAqeedahAccessible;

  if (!lesson) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold">Topic not found</h1>
          <p className="mt-2 text-slate-600">The requested topic does not exist.</p>
          <Link href="/dashboard/mind-upgrade/aqeedah" className="mt-4 inline-block text-blue-600">
            Back to Aqeedah
          </Link>
        </div>
      </main>
    );
  }

  const shortIntro =
    typeof lesson.shortIntro === "string" ? lesson.shortIntro : lesson.shortIntro[language];

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
            {t({ en: "Back", ar: "Back" })}
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
            {t({ en: "Home", ar: "Home" })}
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
              <StoryStepper
                story={lesson}
                basePath="/dashboard/mind-upgrade/aqeedah"
                previewMode={canPreviewAll}
              />
            )}

            <div
              style={{
                background: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                {t({ en: "Qur'an references (surahs)", ar: "Qur'an references (surahs)" })}
              </div>
              <div
                style={{
                  color: "#111",
                  fontWeight: 650,
                  lineHeight: 1.9,
                  fontSize: 16,
                }}
              >
                {lesson.quranSurahs.length ? lesson.quranSurahs.join(" | ") : "-"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
