import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Card } from "antd";
import { topicSlugify, uaeCurriculumBySlug, uaeCurriculumGrades } from "../data";

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

        <div className="premium-hero mb-6 rounded-xl px-4 py-3">
          <h1 className="text-2xl font-bold text-[var(--theme-dark)]">{grade.title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Topic titles from the UAE curriculum list you provided.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3">
          {grade.topics.map((topic, index) => (
            <Link
              key={`${grade.slug}-${index}`}
              href={`/dashboard/lessons/uae-curriculum/${grade.slug}/${topicSlugify(topic.en)}`}
              className="block"
            >
              <Card className="premium-card border-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-xl border border-[var(--theme-border)] bg-white/90 px-4 py-4 md:px-5 md:py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                    Topic {index + 1}
                  </div>
                  <div className="mt-3 text-right text-lg font-semibold leading-8 text-[var(--theme-dark)]" dir="rtl">
                    {topic.ar}
                  </div>
                  <div className="mt-3 border-t border-[var(--theme-border)] pt-3 text-sm font-medium leading-6 text-slate-600">
                    {topic.en}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
