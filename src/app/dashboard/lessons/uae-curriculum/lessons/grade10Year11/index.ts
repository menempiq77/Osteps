import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { suratAlKahf } from "./suratAlKahf";
import { makkanMadinanQuran } from "./makkanMadinanQuran";
import { intellectInIslam } from "./intellectInIslam";
import { schoolsOfJurisprudence } from "./schoolsOfJurisprudence";
import { sakinahBintAlHusayn } from "./sakinahBintAlHusayn";
import { peopleOfTheCave } from "./peopleOfTheCave";
import { stagesOfCompilingQuran } from "./stagesOfCompilingQuran";
import { methodologyOfThinking } from "./methodologyOfThinking";
import { waqfGivingAndGrowth } from "./waqfGivingAndGrowth";
import { humanDevelopment } from "./humanDevelopment";
import { companionOfTwoGardens } from "./companionOfTwoGardens";
import { propheticSunnah } from "./propheticSunnah";
import { etiquetteOfClothing } from "./etiquetteOfClothing";
import { differencesAmongJurists } from "./differencesAmongJurists";
import { prophetsMethodInDawah } from "./prophetsMethodInDawah";
import { worldAbodeOfAction } from "./worldAbodeOfAction";
import { recordingTheSunnah } from "./recordingTheSunnah";
import { chastity } from "./chastity";
import { rulesOfMarriage } from "./rulesOfMarriage";
import { prophetsCareForHousehold } from "./prophetsCareForHousehold";
import { musaProphetOfAllah } from "./musaProphetOfAllah";
import { scholarsPreservingSunnah } from "./scholarsPreservingSunnah";
import { beliefInTheUnseen } from "./beliefInTheUnseen";
import { obedienceToAuthority } from "./obedienceToAuthority";
import { dhulQarnayn } from "./dhulQarnayn";
import { tolerance } from "./tolerance";
import { jihadPartOne } from "./jihadPartOne";
import { jihadPartTwo } from "./jihadPartTwo";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade10Year11Lessons: Record<string, CourseLesson> = {
  "surat-al-kahf-1-8": suratAlKahf,
  "makkan-and-madinan-quran": makkanMadinanQuran,
  "the-intellect-in-islam": intellectInIslam,
  "schools-of-jurisprudence": schoolsOfJurisprudence,
  "sakinah-bint-al-husayn": sakinahBintAlHusayn,
  "the-people-of-the-cave": peopleOfTheCave,
  "stages-of-compiling-the-quran": stagesOfCompilingQuran,
  "methodology-of-thinking-in-islam": methodologyOfThinking,
  "waqf-as-giving-and-growth": waqfGivingAndGrowth,
  "human-development-in-islam": humanDevelopment,
  "the-companion-of-the-two-gardens": companionOfTwoGardens,
  "the-prophetic-sunnah": propheticSunnah,
  "etiquette-of-clothing": etiquetteOfClothing,
  "differences-among-jurists": differencesAmongJurists,
  "the-prophets-method-in-dawah": prophetsMethodInDawah,
  "this-world-is-the-abode-of-action": worldAbodeOfAction,
  "recording-the-sunnah": recordingTheSunnah,
  "chastity": chastity,
  "rules-of-marriage": rulesOfMarriage,
  "the-prophets-care-for-his-household": prophetsCareForHousehold,
  "musa-the-prophet-of-allah": musaProphetOfAllah,
  "the-efforts-of-scholars-in-preserving-the-sunnah": scholarsPreservingSunnah,
  "belief-in-the-unseen": beliefInTheUnseen,
  "obedience-to-the-guardian-of-authority": obedienceToAuthority,
  "dhul-qarnayn-the-righteous-man": dhulQarnayn,
  "tolerance": tolerance,
  "jihad-in-the-cause-of-allah-part-one": jihadPartOne,
  "jihad-in-the-cause-of-allah-part-two": jihadPartTwo,
};
