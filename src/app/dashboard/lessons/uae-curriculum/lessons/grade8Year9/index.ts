import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { truthfulnessOfMessenger } from "./truthfulnessOfMessenger";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade8Year9Lessons: Record<string, CourseLesson> = {
  "the-truthfulness-of-the-messenger": truthfulnessOfMessenger,
};
