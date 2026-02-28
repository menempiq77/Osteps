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
      className="stories-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--theme-soft) 88%, #f8fafc) 0%, color-mix(in srgb, var(--primary) 14%, #ffffff) 100%)",
        padding: "60px 20px",
        fontFamily:
          language === "ar"
            ? "var(--font-noto-naskh-arabic), system-ui"
            : "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            color: "var(--theme-dark)",
            marginBottom: "26px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.18rem, 0.34vw + 1.05rem, 1.45rem)",
              fontWeight: "700",
              marginBottom: "8px",
              textShadow: "none",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            {t({ en: "Stories of the Prophets", ar: "Stories of the Prophets" })}
          </h1>
          <p
            style={{
              fontSize: "clamp(0.86rem, 0.2vw + 0.78rem, 0.95rem)",
              opacity: 0.92,
              fontWeight: 500,
            }}
          >
            {t({
              en: "Learn from the lives of 25 prophets mentioned in the Qur'an",
              ar: "Learn from the lives of 25 prophets mentioned in the Qur'an",
            })}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Link
            href="/dashboard/mind-upgrade"
            style={{
              color: "var(--theme-dark)",
              textDecoration: "none",
              fontWeight: 600,
              background: "color-mix(in srgb, var(--theme-soft) 62%, white)",
              border: "1px solid color-mix(in srgb, var(--primary) 35%, #cbd5e1)",
              padding: "8px 14px",
              borderRadius: "10px",
              display: "inline-block",
              transition: "all 0.3s ease",
              fontSize: "0.84rem",
            }}
          >
            {t({ en: "Back to Mind Upgrade", ar: "Back to Mind Upgrade" })}
          </Link>
        </div>

        <StoriesProgressBadge slugs={PROPHETS.map((p) => p.slug)} total={PROPHETS.length} showXP />

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
        }
      `}</style>
    </main>
  );
}
