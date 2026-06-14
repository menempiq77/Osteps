import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { steadfastnessUponTruth } from "./steadfastnessUponTruth";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade11Year12Lessons: Record<string, CourseLesson> = {
  "steadfastness-upon-the-truth": steadfastnessUponTruth,
};
