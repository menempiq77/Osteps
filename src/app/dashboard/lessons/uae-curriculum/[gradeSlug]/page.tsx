import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "antd";
import { BookOpen, Presentation, Sparkles } from "lucide-react";
import { topicSlugify, uaeCurriculumBySlug, uaeCurriculumGrades } from "../data";
import { hasLesson } from "../lessons/registry";

export function generateStaticParams() {
  return uaeCurriculumGrades.map((grade) => ({ gradeSlug: grade.slug }));
}

export default function GradeLessonsPage({
  params,
}: {
  params: { gradeSlug: string };
}) {
  const { gradeSlug } = params;
  const grade = uaeCurriculumBySlug[gradeSlug];

  if (!grade) {
    notFound();
  }

  const readyCount = grade.topics.filter((t) =>
    hasLesson(grade.slug, topicSlugify(t.en))
  ).length;

  return (
    <div className="p-3 md:p-6">
      <div className="premium-page rounded-2xl p-3 md:p-4">
        <Breadcrumb
          items={[
            { title: <Link href="/dashboard">Dashboard</Link> },
            { title: <Link href="/dashboard/lessons">Lessons</Link> },
            { title: <Link href="/dashboard/lessons/uae-curriculum">UAE curriculum</Link> },
            { title: <span>{grade.title}</span> },
          ]}
          className="!mb-3"
        />

        <div className="premium-hero mb-5 rounded-xl px-4 py-3">
          <h1 className="text-2xl font-bold text-[var(--theme-dark)]">{grade.title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Interactive Islamic Education lessons aligned with the UAE MOE curriculum.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles size={13} />
            {readyCount} of {grade.topics.length} lessons ready
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {grade.topics.map((topic, index) => {
            const slug = topicSlugify(topic.en);
            const ready = hasLesson(grade.slug, slug);
            const base = `/dashboard/lessons/uae-curriculum/${grade.slug}/${slug}`;
            return (
              <div
                key={`${grade.slug}-${index}`}
                className="flex flex-col rounded-xl border border-[var(--theme-border)] bg-white/95 p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                    Topic {index + 1}
                  </span>
                  {ready ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Ready
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      Soon
                    </span>
                  )}
                </div>

                <div
                  className="mt-2 text-right text-base font-bold leading-7 text-[var(--theme-dark)]"
                  dir="rtl"
                >
                  {topic.ar}
                </div>
                <div className="mt-1 text-sm font-medium leading-5 text-slate-600">
                  {topic.en}
                </div>

                <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--theme-border)] pt-3">
                  <Link
                    href={base}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <BookOpen size={14} />
                    Start the learning journey
                  </Link>
                  <Link
                    href={`${base}?mode=class`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/5"
                  >
                    <Presentation size={14} />
                    Lesson in the class
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
