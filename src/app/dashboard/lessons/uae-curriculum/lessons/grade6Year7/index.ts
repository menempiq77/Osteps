import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { theTrueBook } from "./theTrueBook";
import { adviceOfTheProphet } from "./adviceOfTheProphet";
import { volunteering } from "./volunteering";
import { sanctityOfMuslim } from "./sanctityOfMuslim";
import { obligationsOfPrayer } from "./obligationsOfPrayer";
import { uaeServiceWorld } from "./uaeServiceWorld";
import { qualitiesOfBelievers } from "./qualitiesOfBelievers";
import { takeAccountOfYourselves } from "./takeAccountOfYourselves";
import { etiquetteOfTheMosque } from "./etiquetteOfTheMosque";
import { patienceAndCertainty } from "./patienceAndCertainty";
import { imamMalik } from "./imamMalik";
import { noonSakinahIzhar } from "./noonSakinahIzhar";
import { lifeInMadinah } from "./lifeInMadinah";
import { sujudSahwTilawah } from "./sujudSahwTilawah";
import { pathOfGuidance } from "./pathOfGuidance";
import { idgham } from "./idgham";
import { iqlab } from "./iqlab";
import { ikhfa } from "./ikhfa";
import { battleOfBadr } from "./battleOfBadr";
import { battleOfUhud } from "./battleOfUhud";
import { ladyAishah } from "./ladyAishah";
import { powerOfAllah } from "./powerOfAllah";
import { lessonsAndReflections } from "./lessonsAndReflections";
import { gratitudeAndPatience } from "./gratitudeAndPatience";
import { signsOfTheHour } from "./signsOfTheHour";
import { nobleCharacter } from "./nobleCharacter";
import { iAmTolerant } from "./iAmTolerant";
import { choosingCompanions } from "./choosingCompanions";
import { scientificThinking } from "./scientificThinking";
import { environmentTrust } from "./environmentTrust";
import { easeOfIslam } from "./easeOfIslam";
import { etiquetteOfSupplication } from "./etiquetteOfSupplication";
import { voluntaryFasting } from "./voluntaryFasting";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade6Year7Lessons: Record<string, CourseLesson> = {
  "the-true-book-as-sajdah-1-12": theTrueBook,
  "from-the-advice-of-the-prophet": adviceOfTheProphet,
  "volunteering-is-worship-and-belonging": volunteering,
  "the-sanctity-of-a-muslim": sanctityOfMuslim,
  "the-obligations-sunnahs-and-disliked-acts-of-prayer": obligationsOfPrayer,
  "the-uae-in-service-of-the-world": uaeServiceWorld,
  "the-qualities-of-believers-and-their-reward-as-sajdah-13-22": qualitiesOfBelievers,
  "rules-of-noon-sakinah-and-tanwin-clear-pronunciation": noonSakinahIzhar,
  "take-account-of-yourselves": takeAccountOfYourselves,
  "etiquette-of-the-mosque": etiquetteOfTheMosque,
  "life-in-madinah-after-the-migration": lifeInMadinah,
  "sujud-as-sahw-and-sujud-at-tilawah": sujudSahwTilawah,
  "patience-and-certainty-as-sajdah-23-30": patienceAndCertainty,
  "imam-malik-ibn-anas": imamMalik,
  "the-path-of-guidance-al-mulk-1-14": pathOfGuidance,
  "the-rule-of-idgham": idgham,
  "iqlab": iqlab,
  "true-ikhfa": ikhfa,
  "the-great-battle-of-badr": battleOfBadr,
  "the-battle-of-uhud": battleOfUhud,
  "lady-aishah-mother-of-the-believers": ladyAishah,
  "the-power-of-allah-al-mulk-15-24": powerOfAllah,
  "lessons-and-reflections-al-mulk-25-30": lessonsAndReflections,
  "the-believer-between-gratitude-and-patience": gratitudeAndPatience,
  "from-the-signs-of-the-hour": signsOfTheHour,
  "noble-character-traits": nobleCharacter,
  "i-am-tolerant": iAmTolerant,
  "choosing-companions": choosingCompanions,
  "scientific-thinking": scientificThinking,
  "my-environment-is-a-trust": environmentTrust,
  "the-ease-of-islam": easeOfIslam,
  "etiquette-of-supplication": etiquetteOfSupplication,
  "voluntary-fasting": voluntaryFasting,
};
