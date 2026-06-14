import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { grade1Year2Lessons } from "./grade1Year2";
import { grade6Year7Lessons } from "./grade6Year7";
import { grade7Year8Lessons } from "./grade7Year8";
import { grade8Year9Lessons } from "./grade8Year9";
import { grade9Year10Lessons } from "./grade9Year10";

// Registry of authored interactive lessons, keyed by grade slug then topic slug.
const lessonsByGrade: Record<string, Record<string, CourseLesson>> = {
  "grade-1-year-2": grade1Year2Lessons,
  "grade-6-year-7": grade6Year7Lessons,
  "grade-7-year-8": grade7Year8Lessons,
  "grade-8-year-9": grade8Year9Lessons,
  "grade-9-year-10": grade9Year10Lessons,
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
