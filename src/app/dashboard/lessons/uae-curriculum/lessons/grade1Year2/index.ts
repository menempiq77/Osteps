import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { allahIsMyLord } from "./allahIsMyLord";
import { suratAlFatihah } from "./suratAlFatihah";
import { truthfulness } from "./truthfulness";
import { pillarsOfIslam } from "./pillarsOfIslam";
import { suratAlFil } from "./suratAlFil";
import { birthOfProphet } from "./birthOfProphet";
import { allahMostMerciful } from "./allahMostMerciful";
import { suratAlFalaq } from "./suratAlFalaq";
import { supplicationBeforeSleep } from "./supplicationBeforeSleep";
import { abuHurairah } from "./abuHurairah";
import { wudu } from "./wudu";
import { mercyToAnimals } from "./mercyToAnimals";
import { suratAlIkhlas } from "./suratAlIkhlas";
import { pillarsOfFaith } from "./pillarsOfFaith";
import { cleanlinessEtiquette } from "./cleanlinessEtiquette";
import { muslimHelpsBrother } from "./muslimHelpsBrother";
import { iLoveMyFamily } from "./iLoveMyFamily";
import { prophetUnderCare } from "./prophetUnderCare";
import { allahGreatCreator } from "./allahGreatCreator";
import { suratAnNas } from "./suratAnNas";
import { myPrayerLight } from "./myPrayerLight";
import { righteousnessGoodCharacter } from "./righteousnessGoodCharacter";
import { suratAlMaun } from "./suratAlMaun";
import { iLoveCreatures } from "./iLoveCreatures";
import { suratAlKawthar } from "./suratAlKawthar";
import { asmaBintAbiBakr } from "./asmaBintAbiBakr";
import { etiquetteOfEating } from "./etiquetteOfEating";
import { hadithOfMercy } from "./hadithOfMercy";
import { tolerance } from "./tolerance";
import { iLovePlanting } from "./iLovePlanting";
import { learnAndTeachQuran } from "./learnAndTeachQuran";
import { suratAnNasr } from "./suratAnNasr";

// Keyed by the topic slug (topicSlugify of the English title in data.ts).
export const grade1Year2Lessons: Record<string, CourseLesson> = {
  "allah-is-my-lord": allahIsMyLord,
  "surat-al-fatihah": suratAlFatihah,
  "truthfulness-is-the-path-to-paradise": truthfulness,
  "the-pillars-of-islam": pillarsOfIslam,
  "surat-al-fil": suratAlFil,
  "the-birth-of-the-prophet-muhammad": birthOfProphet,
  "allah-the-most-merciful": allahMostMerciful,
  "surat-al-falaq": suratAlFalaq,
  "the-supplication-before-sleep": supplicationBeforeSleep,
  "abu-hurairah-may-allah-be-pleased-with-him": abuHurairah,
  "wudu": wudu,
  "mercy-to-animals": mercyToAnimals,
  "surat-al-ikhlas": suratAlIkhlas,
  "the-pillars-of-faith": pillarsOfFaith,
  "cleanliness-etiquette-in-islam": cleanlinessEtiquette,
  "a-muslim-helps-his-brother": muslimHelpsBrother,
  "i-love-my-family": iLoveMyFamily,
  "our-prophet-muhammad-under-the-care-of-his-grandfather-and-uncle":
    prophetUnderCare,
  "allah-the-great-creator": allahGreatCreator,
  "surat-an-nas": suratAnNas,
  "my-prayer-is-the-light-of-my-life": myPrayerLight,
  "righteousness-is-good-character": righteousnessGoodCharacter,
  "surat-al-maun": suratAlMaun,
  "i-love-the-creatures-of-my-lord": iLoveCreatures,
  "surat-al-kawthar": suratAlKawthar,
  "asma-bint-abi-bakr-may-allah-be-pleased-with-them": asmaBintAbiBakr,
  "etiquette-of-eating": etiquetteOfEating,
  "the-hadith-of-mercy": hadithOfMercy,
  "tolerance": tolerance,
  "i-love-planting": iLovePlanting,
  "the-best-of-you-learn-and-teach-the-quran": learnAndTeachQuran,
  "surat-an-nasr": suratAnNasr,
};
