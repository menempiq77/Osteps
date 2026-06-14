import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { withAllahAndMessenger } from "./withAllahAndMessenger";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade9Year10Lessons: Record<string, CourseLesson> = {
  "with-allah-his-messenger-and-the-guardian-of-authority": withAllahAndMessenger,
};
