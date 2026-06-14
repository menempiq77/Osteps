import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { theTrueBook } from "./theTrueBook";
import { adviceOfTheProphet } from "./adviceOfTheProphet";
import { volunteering } from "./volunteering";
import { sanctityOfMuslim } from "./sanctityOfMuslim";
import { obligationsOfPrayer } from "./obligationsOfPrayer";
import { uaeServiceWorld } from "./uaeServiceWorld";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade6Year7Lessons: Record<string, CourseLesson> = {
  "the-true-book-as-sajdah-1-12": theTrueBook,
  "from-the-advice-of-the-prophet": adviceOfTheProphet,
  "volunteering-is-worship-and-belonging": volunteering,
  "the-sanctity-of-a-muslim": sanctityOfMuslim,
  "the-obligations-sunnahs-and-disliked-acts-of-prayer": obligationsOfPrayer,
  "the-uae-in-service-of-the-world": uaeServiceWorld,
};
