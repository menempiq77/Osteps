import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { resurrection } from "./resurrection";
import { thoseShaded } from "./thoseShaded";
import { gladTidingsPrayer } from "./gladTidingsPrayer";
import { oneness } from "./oneness";
import { mindfulness } from "./mindfulness";
import { naturalPurity } from "./naturalPurity";
import { creatorAllKnowing } from "./creatorAllKnowing";
import { repentance } from "./repentance";
import { helperForbearing } from "./helperForbearing";
import { ghusl } from "./ghusl";
import { tayammum } from "./tayammum";
import { battleAhzab } from "./battleAhzab";
import { arRahman } from "./arRahman";
import { theHeart } from "./theHeart";
import { religionIsEase } from "./religionIsEase";
import { reflection } from "./reflection";
import { workWorship } from "./workWorship";
import { travellerSickPrayer } from "./travellerSickPrayer";
import { blessingsOfLife } from "./blessingsOfLife";
import { caringOrphan } from "./caringOrphan";
import { humility } from "./humility";
import { voluntaryPrayer } from "./voluntaryPrayer";
import { rewardExcellence } from "./rewardExcellence";
import { coexistence } from "./coexistence";
import { gatherings } from "./gatherings";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade7Year8Lessons: Record<string, CourseLesson> = {
  "resurrection-and-rising-again": resurrection,
  "those-shaded-by-the-most-merciful": thoseShaded,
  "glad-tidings-for-those-who-pray": gladTidingsPrayer,
  "proofs-of-the-oneness-of-allah": oneness,
  "being-mindful-of-allah": mindfulness,
  "practices-of-natural-purity": naturalPurity,
  "the-creator-the-all-knowing": creatorAllKnowing,
  "repentance-is-the-opportunity-of-a-lifetime": repentance,
  "the-helper-the-forbearing-glorified-is-he": helperForbearing,
  "ghusl": ghusl,
  "tayammum-and-wiping-over-the-socks": tayammum,
  "the-battle-of-al-ahzab": battleAhzab,
  "surat-ar-rahman-1-25": arRahman,
  "the-heart-and-human-righteousness": theHeart,
  "religion-is-ease": religionIsEase,
  "reflection-in-islam": reflection,
  "work-is-worship-and-civilization": workWorship,
  "prayer-for-the-traveler-and-the-sick": travellerSickPrayer,
  "the-blessings-of-life": blessingsOfLife,
  "caring-for-an-orphan": caringOrphan,
  "humility": humility,
  "voluntary-prayer-duha-and-night-prayer": voluntaryPrayer,
  "the-reward-of-excellence": rewardExcellence,
  "coexistence-among-people": coexistence,
  "gatherings-and-their-etiquette": gatherings,
};
