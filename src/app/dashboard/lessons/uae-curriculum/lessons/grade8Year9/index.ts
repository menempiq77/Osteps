import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { truthfulnessOfMessenger } from "./truthfulnessOfMessenger";
import { maddAsli } from "./maddAsli";
import { actionsByIntentions } from "./actionsByIntentions";
import { sincerity } from "./sincerity";
import { halalEarning } from "./halalEarning";
import { blessingSecurity } from "./blessingSecurity";
import { peopleOfTown } from "./peopleOfTown";
import { drawingCloser } from "./drawingCloser";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade8Year9Lessons: Record<string, CourseLesson> = {
  "the-truthfulness-of-the-messenger": truthfulnessOfMessenger,
  "rules-of-madd-the-original-madd-first": maddAsli,
  "actions-are-by-intentions": actionsByIntentions,
  "sincerity": sincerity,
  "halal-earning": halalEarning,
  "the-blessing-of-security": blessingSecurity,
  "the-people-of-the-town-from-surah-ya-sin-13-19": peopleOfTown,
  "drawing-closer-to-allah": drawingCloser,
};
