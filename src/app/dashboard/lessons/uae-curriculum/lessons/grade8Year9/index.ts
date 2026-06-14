import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { truthfulnessOfMessenger } from "./truthfulnessOfMessenger";
import { maddAsli } from "./maddAsli";
import { actionsByIntentions } from "./actionsByIntentions";
import { sincerity } from "./sincerity";
import { halalEarning } from "./halalEarning";
import { blessingSecurity } from "./blessingSecurity";
import { peopleOfTown } from "./peopleOfTown";
import { drawingCloser } from "./drawingCloser";
import { divineDecree } from "./divineDecree";
import { prayersWithCauses } from "./prayersWithCauses";
import { ashShifa } from "./ashShifa";
import { believerOfYaSin } from "./believerOfYaSin";
import { holiestMosques } from "./holiestMosques";
import { conquestOfMakkah } from "./conquestOfMakkah";
import { etiquetteOfTravel } from "./etiquetteOfTravel";

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
  "belief-in-divine-decree": divineDecree,
  "prayers-with-specific-causes": prayersWithCauses,
  "ash-shifa-bint-abdullah-al-adawiyyah": ashShifa,
  "the-story-of-the-believer-of-ya-sin": believerOfYaSin,
  "the-holiest-mosques": holiestMosques,
  "the-conquest-of-makkah": conquestOfMakkah,
  "etiquette-of-travel": etiquetteOfTravel,
};
