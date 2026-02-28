"use client";

import Link from "next/link";
import { use } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProphetStoryBySlug } from "../stories";
import StoryStepper from "@/components/stories/StoryStepper";
import { RootState } from "@/store/store";
import { fetchStudentMindAssignments } from "@/services/mindUpgradeApi";

type PageProps = {
  params: Promise<{ prophet: string }>;
};

function getText(value: string | { en: string; ar: string }): string {
  return typeof value === "string" ? value : value.en;
}

export default function ProphetStoryPage({ params }: PageProps) {
  const { prophet } = use(params);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";
  const canPreviewAll = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD" || roleKey === "TEACHER";
  const story = getProphetStoryBySlug(prophet);

  const { data: assignments = [], isError: assignmentsError } = useQuery({
    queryKey: ["mind-upgrade-student-assignments", "stories-topic-page"],
    queryFn: fetchStudentMindAssignments,
    enabled: isStudent,
    staleTime: 60 * 1000,
  });

  const storiesStatus = assignments.find((a) => a.course_key === "stories_of_the_prophets");
  const isStoriesAccessible = !isStudent || (!assignmentsError && storiesStatus?.status === "active");
  const isStoriesLocked = isStudent && !isStoriesAccessible;

  if (!story) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold">Story not found</h1>
          <p className="mt-2 text-slate-600">The requested prophet story does not exist.</p>
          <Link href="/dashboard/mind-upgrade/stories-of-the-prophets" className="mt-4 inline-block text-blue-600">
            Back to Stories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)",
        padding: "44px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
          <Link
            href="/dashboard/mind-upgrade/stories-of-the-prophets"
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
            Back
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
            Home
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
            {story.name}
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
            {getText(story.shortIntro)}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
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
              <StoryStepper
                story={story}
                basePath="/dashboard/mind-upgrade/stories-of-the-prophets"
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
                Qur'an references (surahs)
              </div>
              <div
                style={{
                  color: "#111",
                  fontWeight: 650,
                  lineHeight: 1.9,
                  fontSize: 16,
                }}
              >
                {story.quranSurahs.length ? story.quranSurahs.join(" | ") : "-"}
              </div>
              <div style={{ marginTop: 10, color: "#333", fontWeight: 650, lineHeight: 1.75 }}>
                Note: This is student-friendly, original wording based on Qur'an-guided learning.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
