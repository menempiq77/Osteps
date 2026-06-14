import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { withAllahAndMessenger } from "./withAllahAndMessenger";
import { sevenDestructiveSins } from "./sevenDestructiveSins";
import { forgivingTheJust } from "./forgivingTheJust";
import { mutualAdvice } from "./mutualAdvice";
import { zakatInIslam } from "./zakatInIslam";
import { safetyOfSociety } from "./safetyOfSociety";
import { halalIsClear } from "./halalIsClear";
import { religionIsSincereAdvice } from "./religionIsSincereAdvice";
import { hajj } from "./hajj";
import { farewellPilgrimage } from "./farewellPilgrimage";
import { faithIsABlessing } from "./faithIsABlessing";
import { societyMenAndWomen } from "./societyMenAndWomen";
import { justiceInIslam } from "./justiceInIslam";
import { lawfulFoodAndDrink } from "./lawfulFoodAndDrink";
import { imamMuslim } from "./imamMuslim";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade9Year10Lessons: Record<string, CourseLesson> = {
  "with-allah-his-messenger-and-the-guardian-of-authority": withAllahAndMessenger,
  "the-seven-destructive-sins": sevenDestructiveSins,
  "the-forgiving-the-just-glorified-is-he": forgivingTheJust,
  "mutual-advice-in-islam": mutualAdvice,
  "zakat-in-islam": zakatInIslam,
  "the-safety-of-society-and-the-unity-of-its-people": safetyOfSociety,
  "the-halal-is-clear": halalIsClear,
  "religion-is-sincere-advice": religionIsSincereAdvice,
  "hajj": hajj,
  "the-farewell-pilgrimage-and-the-death-of-the-prophet": farewellPilgrimage,
  "faith-is-a-blessing-from-allah": faithIsABlessing,
  "society-has-both-men-and-women": societyMenAndWomen,
  "justice-in-islam": justiceInIslam,
  "what-is-lawful-and-unlawful-in-food-and-drink": lawfulFoodAndDrink,
  "imam-muslim-may-allah-have-mercy-on-him": imamMuslim,
};
