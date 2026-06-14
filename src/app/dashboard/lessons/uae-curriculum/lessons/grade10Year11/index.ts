import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { suratAlKahf } from "./suratAlKahf";
import { makkanMadinanQuran } from "./makkanMadinanQuran";
import { intellectInIslam } from "./intellectInIslam";
import { schoolsOfJurisprudence } from "./schoolsOfJurisprudence";
import { sakinahBintAlHusayn } from "./sakinahBintAlHusayn";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade10Year11Lessons: Record<string, CourseLesson> = {
  "surat-al-kahf-1-8": suratAlKahf,
  "makkan-and-madinan-quran": makkanMadinanQuran,
  "the-intellect-in-islam": intellectInIslam,
  "schools-of-jurisprudence": schoolsOfJurisprudence,
  "sakinah-bint-al-husayn": sakinahBintAlHusayn,
};
