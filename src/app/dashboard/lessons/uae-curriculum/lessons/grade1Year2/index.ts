import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { allahIsMyLord } from "./allahIsMyLord";
import { suratAlFatihah } from "./suratAlFatihah";
import { truthfulness } from "./truthfulness";
import { pillarsOfIslam } from "./pillarsOfIslam";
import { suratAlFil } from "./suratAlFil";

// Keyed by the topic slug (topicSlugify of the English title).
export const grade1Year2Lessons: Record<string, CourseLesson> = {
  "allah-is-my-lord": allahIsMyLord,
  "surat-al-fatihah": suratAlFatihah,
  "truthfulness-is-the-path-to-paradise": truthfulness,
  "the-pillars-of-islam": pillarsOfIslam,
  "surat-al-fil": suratAlFil,
};
