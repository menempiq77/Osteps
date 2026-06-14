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
};
