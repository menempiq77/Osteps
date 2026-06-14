import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { steadfastnessUponTruth } from "./steadfastnessUponTruth";
import { reasonAndRevelation } from "./reasonAndRevelation";
import { seekingChastity } from "./seekingChastity";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade11Year12Lessons: Record<string, CourseLesson> = {
  "steadfastness-upon-the-truth": steadfastnessUponTruth,
  "reason-and-revelation": reasonAndRevelation,
  "seeking-chastity": seekingChastity,
};
