import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { resurrection } from "./resurrection";
import { thoseShaded } from "./thoseShaded";
import { gladTidingsPrayer } from "./gladTidingsPrayer";
import { oneness } from "./oneness";
import { mindfulness } from "./mindfulness";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade7Year8Lessons: Record<string, CourseLesson> = {
  "resurrection-and-rising-again": resurrection,
  "those-shaded-by-the-most-merciful": thoseShaded,
  "glad-tidings-for-those-who-pray": gladTidingsPrayer,
  "proofs-of-the-oneness-of-allah": oneness,
  "being-mindful-of-allah": mindfulness,
};
