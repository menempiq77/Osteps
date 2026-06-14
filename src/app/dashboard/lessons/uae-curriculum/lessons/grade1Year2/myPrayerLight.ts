import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const myPrayerLight: CourseLesson = {
  slug: "g1y2-my-prayer-is-the-light-of-my-life",
  name: { en: "My Prayer Is the Light of My Life", ar: "صلاتي نور حياتي" },
  shortIntro: {
    en: "Salah is the light of a Muslim's life. Let us learn why we pray five times a day and how it helps us.",
    ar: "الصَّلاةُ نورُ حَياةِ المُسلِم. لِنَتَعَلَّمْ لِماذا نُصَلّي خَمسَ مَرّاتٍ وكَيفَ تُعينُنا.",
  },
  quranSurahs: ["Ta-Ha 14"],
  sections: [
    {
      title: { en: "Prayer connects me to Allah", ar: "الصَّلاةُ تَصِلُني بالله" },
      learningObjective: {
        en: "I can say that we pray five times a day to stay close to Allah.",
        ar: "أستَطيعُ أن أقولَ إنَّنا نُصَلّي خَمسَ مَرّاتٍ لِنَبقى قَريبينَ مِنَ الله.",
      },
      image: {
        src: IMG.grandMosque,
        alt: { en: "A beautiful mosque where Muslims pray.", ar: "مَسجِدٌ جَميلٌ يُصَلّي فيهِ المُسلِمون." },
        caption: { en: "Five times a day, we stand before our Lord in prayer.", ar: "خَمسَ مَرّاتٍ في اليَومِ نَقِفُ بَينَ يَدَي رَبِّنا في الصَّلاة." },
      },
      body: {
        en: "Salah is the second pillar of Islam and the most important act of worship after believing in Allah. Muslims pray five times every day: Fajr, Dhuhr, Asr, Maghrib, and Isha. Each prayer is a special time to talk to Allah, thank Him, and ask Him for help. Prayer is the light that guides our whole day.",
        ar: "الصَّلاةُ هي الرُّكنُ الثّاني للإسلامِ وأهَمُّ عِبادةٍ بعدَ الإيمانِ بالله. يُصَلّي المُسلِمونَ خَمسَ مَرّاتٍ كُلَّ يَوم: الفَجرَ والظُّهرَ والعَصرَ والمَغرِبَ والعِشاء. وكُلُّ صَلاةٍ وَقتٌ خاصٌّ نُكَلِّمُ فيهِ اللهَ ونَشكُرُهُ ونَطلُبُ عَونَه. والصَّلاةُ هي النُّورُ الذي يَهدي يَومَنا كُلَّه.",
      },
    },
    {
      title: { en: "Allah commands us to pray", ar: "اللهُ يَأمُرُنا بالصَّلاة" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child learning to pray.", ar: "طِفلٌ يَتَعَلَّمُ الصَّلاة." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...establish prayer for My remembrance.\" — Ta-Ha 14", ar: "﴿...وَأَقِمِ الصَّلَاةَ لِذِكْرِي﴾ — طه ١٤" },
            { en: "It means: Allah tells us to pray so that we always remember Him.", ar: "مَعناها: يَأمُرُنا اللهُ بالصَّلاةِ لِنَذكُرَهُ دائِمًا." },
          ],
        },
      ],
      body: {
        en: "Allah Himself told us to pray, so that our hearts stay full of His remembrance. When we pray, we say 'Allahu Akbar' (Allah is the Greatest), we read Surat Al-Fatihah, we bow and prostrate, and we feel close to Allah. Prayer keeps our hearts soft and good.",
        ar: "اللهُ نَفسُهُ أمَرَنا بالصَّلاةِ لِتَبقى قُلوبُنا مَملوءةً بِذِكرِه. وحينَ نُصَلّي نَقولُ «اللهُ أكبَر»، ونَقرَأُ سورةَ الفاتِحة، ونَركَعُ ونَسجُد، ونَشعُرُ بالقُربِ مِنَ الله. والصَّلاةُ تُبقي قُلوبَنا رَقيقةً طَيِّبة.",
      },
    },
    {
      title: { en: "The first thing we are asked about", ar: "أوّلُ ما نُسألُ عَنه" },
      image: {
        src: IMG.lantern,
        alt: { en: "A bright lantern, like the light of prayer.", ar: "فانوسٌ ساطِعٌ كَنورِ الصَّلاة." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"The first thing a person will be asked about on the Day of Judgment is the prayer.\" (Tirmidhi)", ar: "قال النَّبِيُّ ﷺ: «أوّلُ ما يُحاسَبُ بهِ العَبدُ يَومَ القيامةِ الصَّلاة». (رواه الترمذي)" },
          ],
        },
      ],
      body: {
        en: "Prayer is so important that it is the very first thing Allah will ask us about on the Day of Judgment. The Prophet ﷺ also said that prayer is 'light'. It lights our hearts in this life and will be light for us on that great Day. So we should never skip our prayers and should learn to pray on time.",
        ar: "الصَّلاةُ مُهِمّةٌ جِدًّا حتّى إنَّها أوّلُ ما يَسألُنا اللهُ عَنهُ يَومَ القيامة. وقالَ النَّبِيُّ ﷺ إنَّ الصَّلاةَ «نور». تُنيرُ قُلوبَنا في الدُّنيا وتَكونُ نورًا لَنا في ذلِكَ اليَومِ العَظيم. فَلا نَترُكِ الصَّلاةَ أبَدًا ونَتَعَلَّمُ أن نُصَلِّيَها في وَقتِها.",
      },
    },
    {
      title: { en: "The Prophet ﷺ loved prayer", ar: "النَّبِيُّ ﷺ أحَبَّ الصَّلاة" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A peaceful sky at prayer time.", ar: "سَماءٌ هادِئةٌ وَقتَ الصَّلاة." },
      },
      body: {
        en: "Our Prophet ﷺ loved prayer so much that he said: 'The comfort of my eyes is in prayer.' Prayer made him calm and happy. When something worried him, he would hurry to pray. We can be like the Prophet ﷺ by loving our prayer, doing it carefully, and feeling happy when we stand before Allah.",
        ar: "أحَبَّ نَبِيُّنا ﷺ الصَّلاةَ كَثيرًا حتّى قال: «وجُعِلَت قُرّةُ عَيني في الصَّلاة». فالصَّلاةُ تُهَدِّئُهُ وتُسعِدُه. وحينَ يَهُمُّهُ أمرٌ كانَ يُسارِعُ إلى الصَّلاة. ونَستَطيعُ أن نَكونَ مِثلَ النَّبِيِّ ﷺ بِأن نُحِبَّ صَلاتَنا ونُؤَدِّيَها بِعِنايةٍ ونَفرَحَ حينَ نَقِفُ بَينَ يَدَيِ الله.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child making a prayer plan.", ar: "طِفلٌ يَضَعُ خُطّةً للصَّلاة." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "Time to pray, time to play", ar: "وَقتُ الصَّلاةِ ووَقتُ اللَّعِب" },
        body: {
          en: "You are playing a fun game and you hear the adhan (call to prayer). What is the best thing for a Muslim to do?",
          ar: "أنتَ تَلعَبُ لُعبةً مُمتِعةً فَتَسمَعُ الأذان. ما أفضَلُ ما يَفعَلُهُ المُسلِم؟",
        },
      },
      responsePrompt: {
        title: { en: "My five prayers", ar: "صَلَواتي الخَمس" },
        prompt: {
          en: "Name the prayer you find easiest to pray on time, and one you want to improve.",
          ar: "سَمِّ الصَّلاةَ التي يَسهُلُ عَلَيكَ أداؤُها في وَقتِها، وأُخرى تُريدُ أن تُحَسِّنَها.",
        },
        placeholder: { en: "I pray on time, and I want to improve...", ar: "أُصَلّي في وَقتِها، وأُريدُ أن أُحَسِّنَ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Prayer is the light of our life and our strongest connection to Allah. Let us pray our five prayers with love and on time, so our days are filled with light and Allah's blessings.",
        ar: "الصَّلاةُ نورُ حَياتِنا وأقوى صِلَةٍ بالله. فَلْنُصَلِّ صَلَواتِنا الخَمسَ بِحُبٍّ وفي وَقتِها، لِتَمتَلِئَ أيّامُنا بالنُّورِ وبَرَكاتِ الله.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "How many times a day do Muslims pray?", ar: "كَم مَرّةً يُصَلّي المُسلِمونَ في اليَوم؟" },
      options: [
        { en: "Five", ar: "خَمس" },
        { en: "Two", ar: "اثنَتان" },
        { en: "Ten", ar: "عَشر" },
      ],
      correctIndex: 0,
      explanation: { en: "Muslims pray five times every day.", ar: "يُصَلّي المُسلِمونَ خَمسَ مَرّاتٍ كُلَّ يَوم." },
    },
    {
      prompt: { en: "Which of these is one of the five daily prayers?", ar: "أيٌّ مِن هذهِ مِنَ الصَّلَواتِ الخَمس؟" },
      options: [
        { en: "Fajr", ar: "الفَجر" },
        { en: "Breakfast", ar: "الإفطار" },
        { en: "Playtime", ar: "وَقتُ اللَّعِب" },
      ],
      correctIndex: 0,
      explanation: { en: "Fajr is the dawn prayer, one of the five.", ar: "الفَجرُ صَلاةُ الصُّبح، إحدى الخَمس." },
    },
    {
      prompt: { en: "What is the first thing we will be asked about on the Day of Judgment?", ar: "ما أوّلُ ما نُسألُ عَنهُ يَومَ القيامة؟" },
      options: [
        { en: "Our prayer", ar: "صَلاتُنا" },
        { en: "Our toys", ar: "ألعابُنا" },
        { en: "Our clothes", ar: "ثِيابُنا" },
      ],
      correctIndex: 0,
      explanation: { en: "The first thing asked about is the prayer.", ar: "أوّلُ ما نُسألُ عَنهُ الصَّلاة." },
    },
    {
      prompt: { en: "What did the Prophet ﷺ say prayer was for him?", ar: "ماذا قال النَّبِيُّ ﷺ عنِ الصَّلاةِ بالنِّسبةِ لَه؟" },
      options: [
        { en: "The comfort of his eyes", ar: "قُرّةُ عَينِه" },
        { en: "Something boring", ar: "شيءٌ مُمِلّ" },
        { en: "Too hard", ar: "صَعبةٌ جِدًّا" },
      ],
      correctIndex: 0,
      explanation: { en: "He said: 'The comfort of my eyes is in prayer.'", ar: "قال: «وجُعِلَت قُرّةُ عَيني في الصَّلاة»." },
    },
    {
      prompt: { en: "True or False: When we hear the adhan, we should hurry to pray.", ar: "صَوابٌ أم خَطأ: حينَ نَسمَعُ الأذانَ نُسارِعُ إلى الصَّلاة." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. We answer the call to prayer and pray on time.", ar: "صَواب. نُلَبّي نِداءَ الصَّلاةِ ونُصَلّي في وَقتِها." },
    },
  ],
};
