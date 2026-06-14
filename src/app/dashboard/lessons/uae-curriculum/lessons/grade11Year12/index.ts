import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { steadfastnessUponTruth } from "./steadfastnessUponTruth";
import { reasonAndRevelation } from "./reasonAndRevelation";
import { seekingChastity } from "./seekingChastity";
import { financialContracts } from "./financialContracts";
import { arabicLanguageAndCulture } from "./arabicLanguageAndCulture";
import { battleOfAhzab } from "./battleOfAhzab";
import { quranScientificMiracles } from "./quranScientificMiracles";
import { etiquetteOfDialogue } from "./etiquetteOfDialogue";
import { sourcesOfLegislation } from "./sourcesOfLegislation";
import { planningInProphetsLife } from "./planningInProphetsLife";
import { followingTheMessenger } from "./followingTheMessenger";
import { categoriesOfHadith } from "./categoriesOfHadith";
import { buildingTheFamily } from "./buildingTheFamily";
import { ummSalamah } from "./ummSalamah";
import { moralAdvice } from "./moralAdvice";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade11Year12Lessons: Record<string, CourseLesson> = {
  "steadfastness-upon-the-truth": steadfastnessUponTruth,
  "reason-and-revelation": reasonAndRevelation,
  "seeking-chastity": seekingChastity,
  "financial-contracts-in-islam": financialContracts,
  "arabic-language-and-culture": arabicLanguageAndCulture,
  "the-battle-of-al-ahzab-the-trench": battleOfAhzab,
  "the-noble-quran-and-scientific-miracles": quranScientificMiracles,
  "the-etiquette-of-dialogue": etiquetteOfDialogue,
  "sources-of-islamic-legislation": sourcesOfLegislation,
  "features-of-planning-in-the-life-of-the-prophet": planningInProphetsLife,
  "following-the-example-of-the-messenger-of-allah": followingTheMessenger,
  "categories-of-hadith": categoriesOfHadith,
  "islams-method-in-building-the-family": buildingTheFamily,
  "umm-salamah-may-allah-be-pleased-with-her": ummSalamah,
  "moral-advice-and-guidance": moralAdvice,
};
