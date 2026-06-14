import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { suratAlKahf } from "./suratAlKahf";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade10Year11Lessons: Record<string, CourseLesson> = {
  "surat-al-kahf-1-8": suratAlKahf,
};
