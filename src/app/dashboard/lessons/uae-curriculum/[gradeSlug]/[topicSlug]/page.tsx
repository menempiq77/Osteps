import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Tag } from "antd";
import LessonDeckClient from "@/components/lessons/LessonDeckClient";
import { topicSlugify, uaeCurriculumBySlug } from "../../data";
import { toleranceLesson } from "./toleranceLesson";
import { beliefToleranceLesson } from "./beliefToleranceLesson";

export function generateStaticParams() {
  return [
    { gradeSlug: "grade-10-year-11", topicSlug: "tolerance" },
    {
      gradeSlug: "grade-12-year-13",
      topicSlug: "tolerance-with-those-who-differ-in-belief",
    },
  ];
}

export default function TopicLessonPage({
  params,
}: {
  params: { gradeSlug: string; topicSlug: string };
}) {
  const { gradeSlug, topicSlug } = params;
  const grade = uaeCurriculumBySlug[gradeSlug];

  if (!grade) notFound();

  const topic = grade.topics.find((item) => topicSlugify(item.en) === topicSlug);
  if (!topic) notFound();

  const currentLesson =
    gradeSlug === "grade-10-year-11" && topicSlug === "tolerance"
      ? toleranceLesson
      : gradeSlug === "grade-12-year-13" &&
          topicSlug === "tolerance-with-those-who-differ-in-belief"
        ? beliefToleranceLesson
        : null;

  if (!currentLesson) {
    return (
      <div className="p-3 md:p-6">
        <div className="premium-page rounded-2xl p-3 md:p-4">
          <Breadcrumb
            items={[
              { title: <Link href="/dashboard">Dashboard</Link> },
              { title: <Link href="/dashboard/lessons">Lessons</Link> },
              { title: <Link href="/dashboard/lessons/uae-curriculum">UAE curriculum</Link> },
              { title: <Link href={`/dashboard/lessons/uae-curriculum/${grade.slug}`}>{grade.title}</Link> },
              { title: <span>{topic.en}</span> },
            ]}
            className="!mb-3"
          />
          <div className="premium-hero mb-6 rounded-xl px-4 py-3">
            <h1 className="text-2xl font-bold text-[var(--theme-dark)]">{topic.en}</h1>
            <p className="mt-2 text-sm text-slate-600">This lesson page is not built yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-2 md:px-3 md:py-3">
      <div className="premium-page rounded-xl p-2 md:p-3">
        <Breadcrumb
          items={[
            { title: <Link href="/dashboard">Dashboard</Link> },
            { title: <Link href="/dashboard/lessons">Lessons</Link> },
            { title: <Link href="/dashboard/lessons/uae-curriculum">UAE curriculum</Link> },
            { title: <Link href={`/dashboard/lessons/uae-curriculum/${grade.slug}`}>{grade.title}</Link> },
            { title: <span>{topic.en}</span> },
          ]}
          className="!mb-3"
        />

        <div className="premium-hero mb-3 rounded-xl px-3 py-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag color="processing">{grade.title}</Tag>
            <Tag color="green">50 mins</Tag>
            <Tag color="gold">Bilingual</Tag>
          </div>
          <h1 className="mt-1.5 text-lg font-semibold text-[var(--theme-dark)]">
            {topic.en} / {topic.ar}
          </h1>
          <p className="mt-1 max-w-3xl text-xs text-slate-500">
            {typeof currentLesson.shortIntro === "string"
              ? currentLesson.shortIntro
              : currentLesson.shortIntro.en}
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <LessonDeckClient lesson={currentLesson} />
        </div>
      </div>
    </div>
  );
}
