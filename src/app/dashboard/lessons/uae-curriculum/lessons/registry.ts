import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { grade1Year2Lessons } from "./grade1Year2";

// Registry of authored interactive lessons, keyed by grade slug then topic slug.
const lessonsByGrade: Record<string, Record<string, CourseLesson>> = {
  "grade-1-year-2": grade1Year2Lessons,
};

export function getLesson(
  gradeSlug: string,
  topicSlug: string
): CourseLesson | null {
  return lessonsByGrade[gradeSlug]?.[topicSlug] ?? null;
}

export function hasLesson(gradeSlug: string, topicSlug: string): boolean {
  return Boolean(lessonsByGrade[gradeSlug]?.[topicSlug]);
}

export function availableTopicSlugs(gradeSlug: string): string[] {
  return Object.keys(lessonsByGrade[gradeSlug] ?? {});
}

export function lessonStaticParams(): Array<{
  gradeSlug: string;
  topicSlug: string;
}> {
  return Object.entries(lessonsByGrade).flatMap(([gradeSlug, topics]) =>
    Object.keys(topics).map((topicSlug) => ({ gradeSlug, topicSlug }))
  );
}
