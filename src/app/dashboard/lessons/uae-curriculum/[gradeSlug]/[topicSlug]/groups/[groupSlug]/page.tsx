import { notFound } from "next/navigation";
import LessonGroupWorkspaceClient from "@/components/lessons/LessonGroupWorkspaceClient";
import type { LessonSection } from "@/components/lessons/LessonCourseStepper";
import { topicSlugify, uaeCurriculumBySlug } from "../../../../data";
import { toleranceLesson } from "../../toleranceLesson";
import { beliefToleranceLesson } from "../../beliefToleranceLesson";

type GroupTask = NonNullable<NonNullable<LessonSection["groupTasks"]>["groups"]>[number];

function getCurrentLesson(gradeSlug: string, topicSlug: string) {
  return gradeSlug === "grade-10-year-11" && topicSlug === "tolerance"
    ? toleranceLesson
    : gradeSlug === "grade-12-year-13" && topicSlug === "tolerance-with-those-who-differ-in-belief"
      ? beliefToleranceLesson
      : null;
}

function findGroupTask(
  sections: LessonSection[],
  groupSlug: string
): { group: GroupTask; section: LessonSection } | null {
  for (const section of sections) {
    const group = section.groupTasks?.groups.find((item) => item.slug === groupSlug);
    if (group) {
      return { group, section };
    }
  }
  return null;
}

export function generateStaticParams() {
  const toleranceGroups =
    toleranceLesson.sections.flatMap((section) =>
      section.groupTasks?.groups.map((group) => ({
        gradeSlug: "grade-10-year-11",
        topicSlug: "tolerance",
        groupSlug: group.slug,
      })) ?? []
    );

  return toleranceGroups;
}

export default function LessonGroupWorkspacePage({
  params,
}: {
  params: { gradeSlug: string; topicSlug: string; groupSlug: string };
}) {
  const { gradeSlug, topicSlug, groupSlug } = params;
  const grade = uaeCurriculumBySlug[gradeSlug];

  if (!grade) notFound();

  const topic = grade.topics.find((item) => topicSlugify(item.en) === topicSlug);
  if (!topic) notFound();

  const currentLesson = getCurrentLesson(gradeSlug, topicSlug);
  if (!currentLesson) notFound();

  const groupMatch = findGroupTask(currentLesson.sections, groupSlug);
  if (!groupMatch) notFound();

  const baseLessonPath = `/dashboard/lessons/uae-curriculum/${gradeSlug}/${topicSlug}`;
  const groupName = typeof groupMatch.group.name === "string" ? groupMatch.group.name : groupMatch.group.name.en;
  const sectionTitle = typeof groupMatch.section.title === "string" ? groupMatch.section.title : groupMatch.section.title.en;
  const lessonName = typeof currentLesson.name === "string" ? currentLesson.name : currentLesson.name.en;

  return (
    <LessonGroupWorkspaceClient
      lessonSlug={currentLesson.slug}
      lessonTitle={lessonName}
      sectionTitle={sectionTitle}
      baseLessonPath={baseLessonPath}
      group={groupMatch.group}
    />
  );
}
