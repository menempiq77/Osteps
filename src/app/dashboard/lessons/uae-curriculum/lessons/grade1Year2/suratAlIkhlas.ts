import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const suratAlIkhlas: CourseLesson = {
  slug: "g1y2-surat-al-ikhlas",
  name: { en: "Surat Al-Ikhlas", ar: "سورة الإخلاص" },
  shortIntro: {
    en: "A small surah with a huge meaning: it teaches us that Allah is One and like nothing else.",
    ar: "سورةٌ صَغيرةٌ بِمَعنًى عَظيم: تُعَلِّمُنا أنَّ اللهَ واحِدٌ ولا يُشبِهُهُ شيء.",
  },
  quranSurahs: ["Al-Ikhlas 1-4"],
  sections: [
    {
      title: { en: "The surah of pure faith", ar: "سورةُ التَّوحيدِ الخالِص" },
      learningObjective: {
        en: "I can say that Surat Al-Ikhlas teaches Allah is One.",
        ar: "أستَطيعُ أن أقولَ إنَّ سورةَ الإخلاصِ تُعَلِّمُ أنَّ اللهَ واحِد.",
      },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A clear, endless sky.", ar: "سَماءٌ صافِيةٌ لا تَنتَهي." },
        caption: { en: "There is only One Lord of the whole universe — Allah.", ar: "لا رَبَّ للكَونِ كُلِّهِ إلّا واحِدٌ هو الله." },
      },
      body: {
        en: "Surat Al-Ikhlas has only four short verses, but it teaches the most important belief in Islam: tawheed, that Allah is One. 'Ikhlas' means being pure and sincere — making our worship only for Allah, with no partners.",
        ar: "سورةُ الإخلاصِ فيها أربَعُ آياتٍ قَصيرةٍ فَقَط، لكِنَّها تُعَلِّمُ أهَمَّ عَقيدةٍ في الإسلام: التَّوحيد، أنَّ اللهَ واحِد. و(الإخلاص) يَعني الصَّفاءَ والصِّدق: أن نَجعَلَ عِبادَتَنا لله وَحدَهُ بِلا شَريك.",
      },
    },
    {
      title: { en: "The words of the surah", ar: "كَلِماتُ السّورة" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading Surat Al-Ikhlas.", ar: "طِفلٌ يَقرَأُ سورةَ الإخلاص." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"Say: He is Allah, the One,\"", ar: "﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾" },
            { en: "\"Allah, the Eternal Refuge.\"", ar: "﴿اللَّهُ الصَّمَدُ﴾" },
            { en: "\"He neither begets nor is born,\"", ar: "﴿لَمْ يَلِدْ وَلَمْ يُولَدْ﴾" },
            { en: "\"and there is none equal to Him.\"", ar: "﴿وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ﴾" },
          ],
        },
      ],
      body: {
        en: "Allah is One: He has no partner. Allah is As-Samad: everyone needs Him, but He needs no one. Allah has no father, no son, and no children. And nothing in the whole world is like Allah. He is greater than anything we can imagine.",
        ar: "اللهُ واحِدٌ لا شَريكَ لَه. واللهُ الصَّمَدُ: الكُلُّ يَحتاجُ إلَيهِ وهو لا يَحتاجُ أحَدًا. واللهُ لا والِدَ لَهُ ولا وَلَد. ولا شيءَ في الكَونِ كُلِّهِ يُشبِهُ الله. وهو أعظَمُ مِن كُلِّ ما نَتَخَيَّل.",
      },
    },
    {
      title: { en: "Equal to a third of the Qur'an", ar: "تَعدِلُ ثُلُثَ القُرآن" },
      image: {
        src: IMG.lantern,
        alt: { en: "A bright lantern, like a great reward.", ar: "فانوسٌ ساطِعٌ، كَأجرٍ عَظيم." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said that Surat Al-Ikhlas is equal to a third of the Qur'an. (Bukhari)", ar: "قال النَّبِيُّ ﷺ إنَّ سورةَ الإخلاصِ تَعدِلُ ثُلُثَ القُرآن. (رواه البخاري)" },
          ],
        },
      ],
      body: {
        en: "Even though it is very short, the Prophet ﷺ told us that reading Surat Al-Ikhlas is like reading a third of the whole Qur'an in reward, because its meaning — that Allah is One — is so important. This makes it a wonderful surah to read and to learn by heart.",
        ar: "رَغمَ قِصَرِها، أخبَرَنا النَّبِيُّ ﷺ أنَّ قِراءةَ سورةِ الإخلاصِ كَقِراءةِ ثُلُثِ القُرآنِ في الأجر؛ لأنَّ مَعناها — أنَّ اللهَ واحِد — عَظيمٌ جِدًّا. وهذا يَجعَلُها سورةً رائِعةً نَقرَؤُها ونَحفَظُها.",
      },
    },
    {
      title: { en: "Allah needs nothing, we need Him", ar: "اللهُ لا يَحتاجُ شيئًا، ونَحنُ نَحتاجُه" },
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A mighty mountain made by Allah.", ar: "جَبَلٌ شامِخٌ مِن خَلقِ الله." },
      },
      body: {
        en: "Everything we see needs something: plants need water, we need food and air, and the moon needs the sun's light. But Allah needs nothing at all — He created everything and takes care of everything. We turn only to Allah when we need help, because He is the only One who can give us everything.",
        ar: "كُلُّ ما نَراهُ يَحتاجُ إلى شيء: النَّباتُ يَحتاجُ الماء، ونَحنُ نَحتاجُ الطَّعامَ والهَواء، والقَمَرُ يَحتاجُ نورَ الشَّمس. أمّا اللهُ فلا يَحتاجُ شيئًا أبَدًا، فهو الذي خَلَقَ كُلَّ شيءٍ ويَرعى كُلَّ شيء. ونَلجَأُ إلى اللهِ وَحدَهُ حينَ نَحتاجُ العَون، لأنَّهُ الوَحيدُ القادِرُ أن يُعطِيَنا كُلَّ شيء.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child memorising a short surah.", ar: "طِفلٌ يَحفَظُ سورةً قَصيرة." },
      },
      callout: {
        label: { en: "Think with me", ar: "فَكِّرْ مَعي" },
        title: { en: "Who do I ask when I need help?", ar: "مَن أسألُ حينَ أحتاجُ العَون؟" },
        body: {
          en: "When I want something or feel worried, I can ask Allah directly in du'a, because He is One and He hears everyone. I do not need anything to come between me and Allah.",
          ar: "حينَ أُريدُ شيئًا أو أشعُرُ بالقَلَقِ، أستَطيعُ أن أدعُوَ اللهَ مُباشَرةً، لأنَّهُ واحِدٌ يَسمَعُ الجَميع. ولا أحتاجُ إلى شيءٍ يَكونُ بَيني وبَينَ الله.",
        },
      },
      responsePrompt: {
        title: { en: "Allah is One", ar: "اللهُ واحِد" },
        prompt: {
          en: "Write one thing this surah teaches you about Allah.",
          ar: "اكتُبْ أمرًا واحِدًا تُعَلِّمُكَ إيّاهُ هذهِ السّورةُ عنِ الله.",
        },
        placeholder: { en: "This surah teaches me that Allah...", ar: "تُعَلِّمُني هذهِ السّورةُ أنَّ الله..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Surat Al-Ikhlas fills our hearts with the love of Allah, the One. Let us learn it, read it often, and worship Allah alone with a pure heart.",
        ar: "سورةُ الإخلاصِ تَملأُ قُلوبَنا بِحُبِّ اللهِ الواحِد. فَلْنَحفَظْها ونُكثِرْ مِن قِراءَتِها ونَعبُدِ اللهَ وَحدَهُ بِقَلبٍ صافٍ.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the main message of Surat Al-Ikhlas?", ar: "ما الرِّسالةُ الأساسيّةُ لِسورةِ الإخلاص؟" },
      options: [
        { en: "Allah is One", ar: "اللهُ واحِد" },
        { en: "There are many gods", ar: "هُناكَ آلِهةٌ كَثيرة" },
        { en: "Allah has children", ar: "لله أولاد" },
      ],
      correctIndex: 0,
      explanation: { en: "It teaches tawheed — that Allah is One, with no partner.", ar: "تُعَلِّمُ التَّوحيد: أنَّ اللهَ واحِدٌ لا شَريكَ لَه." },
    },
    {
      prompt: { en: "How many verses are in Surat Al-Ikhlas?", ar: "كَم آيةً في سورةِ الإخلاص؟" },
      options: [
        { en: "Four", ar: "أربَع" },
        { en: "Ten", ar: "عَشر" },
        { en: "Thirty", ar: "ثَلاثون" },
      ],
      correctIndex: 0,
      explanation: { en: "It has four short verses.", ar: "فيها أربَعُ آياتٍ قَصيرة." },
    },
    {
      prompt: { en: "Does Allah need anyone?", ar: "هل يَحتاجُ اللهُ إلى أحَد؟" },
      options: [
        { en: "No, everyone needs Allah", ar: "لا، الكُلُّ يَحتاجُ إلى الله" },
        { en: "Yes, Allah needs help", ar: "نَعَم، اللهُ يَحتاجُ العَون" },
        { en: "Sometimes", ar: "أحيانًا" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah is As-Samad: He needs no one, and everyone needs Him.", ar: "اللهُ الصَّمَد: لا يَحتاجُ أحَدًا والكُلُّ يَحتاجُ إلَيه." },
    },
    {
      prompt: { en: "Reading Surat Al-Ikhlas is equal in reward to...", ar: "قِراءةُ سورةِ الإخلاصِ تَعدِلُ في الأجر..." },
      options: [
        { en: "A third of the Qur'an", ar: "ثُلُثَ القُرآن" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "Half the alphabet", ar: "نِصفَ الحُروف" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ said it equals a third of the Qur'an.", ar: "قال النَّبِيُّ ﷺ إنَّها تَعدِلُ ثُلُثَ القُرآن." },
    },
    {
      prompt: { en: "True or False: Nothing in the world is like Allah.", ar: "صَوابٌ أم خَطأ: لا شيءَ في العالَمِ يُشبِهُ الله." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. 'There is none equal to Him.'", ar: "صَواب. ﴿وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ﴾." },
    },
  ],
};
