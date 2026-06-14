import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const wudu: CourseLesson = {
  slug: "g1y2-wudu",
  name: { en: "Wudu", ar: "الوضوءُ" },
  shortIntro: {
    en: "Learn how to make wudu (ablution) the way our Prophet ﷺ taught us, to be clean and ready for prayer.",
    ar: "تَعَلَّمْ كَيفَ تَتَوَضَّأُ كَما عَلَّمَنا نَبِيُّنا ﷺ، لِتَكونَ نَظيفًا مُستَعِدًّا للصَّلاة.",
  },
  quranSurahs: ["Al-Ma'idah 6"],
  sections: [
    {
      title: { en: "Wudu makes us clean", ar: "الوضوءُ يُطَهِّرُنا" },
      learningObjective: {
        en: "I can say that wudu cleans me and prepares me to pray.",
        ar: "أستَطيعُ أن أقولَ إنَّ الوضوءَ يُطَهِّرُني ويُهَيِّئُني للصَّلاة.",
      },
      image: {
        src: IMG.waterfall,
        alt: { en: "Clean fresh water flowing.", ar: "ماءٌ نَظيفٌ عَذبٌ يَجري." },
        caption: { en: "Allah gave us clean water to make wudu.", ar: "أعطانا اللهُ الماءَ النَّظيفَ لِنَتَوَضَّأ." },
      },
      body: {
        en: "Before we pray, we make wudu. Wudu means washing certain parts of our body with clean water in a special order. It makes us clean and fresh on the outside, and Allah also washes away our small mistakes. We begin by saying 'Bismillah'.",
        ar: "قَبلَ الصَّلاةِ نَتَوَضَّأ. والوضوءُ هو غَسلُ أعضاءٍ مُعَيَّنةٍ مِن جِسمِنا بالماءِ النَّظيفِ بِتَرتيبٍ خاصّ. فَيُنَظِّفُنا مِنَ الخارِج، ويَغسِلُ اللهُ بهِ أيضًا أخطاءَنا الصَّغيرة. ونَبدَأُ بِقَولِ «بِسمِ الله».",
      },
    },
    {
      title: { en: "Allah commands wudu", ar: "اللهُ يَأمُرُ بالوضوء" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an about cleanliness.", ar: "طِفلٌ يَقرأُ القُرآنَ عنِ الطَّهارة." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"O you who believe! When you rise to pray, wash your faces and your hands up to the elbows, wipe your heads, and wash your feet up to the ankles.\" — Al-Ma'idah 6", ar: "﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ﴾ — المائدة ٦" },
            { en: "It means: Allah told us exactly which parts to wash before we pray.", ar: "مَعناها: أخبَرَنا اللهُ بالضَّبطِ أيَّ الأعضاءِ نَغسِلُ قَبلَ الصَّلاة." },
          ],
        },
      ],
      body: {
        en: "Allah Himself taught us how to make wudu in the Qur'an. So when we make wudu, we are obeying Allah. Wudu is the key to prayer — we cannot pray properly without it.",
        ar: "اللهُ نَفسُهُ عَلَّمَنا كَيفَ نَتَوَضَّأُ في القُرآن. فَحينَ نَتَوَضَّأُ نَكونُ نُطيعُ الله. والوضوءُ مِفتاحُ الصَّلاة، فلا تَصِحُّ الصَّلاةُ بِدونِه.",
      },
    },
    {
      title: { en: "The steps of wudu", ar: "خَطَواتُ الوضوء" },
      image: {
        src: IMG.sea,
        alt: { en: "Clean water, a blessing from Allah.", ar: "ماءٌ نَظيفٌ، نِعمةٌ مِنَ الله." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"No prayer is accepted without purification (wudu).\" (Muslim)", ar: "قال النَّبِيُّ ﷺ: «لا تُقبَلُ صَلاةٌ بِغَيرِ طَهور». (رواه مسلم)" },
          ],
        },
      ],
      body: {
        en: "We make wudu in order: (1) say Bismillah and make intention, (2) wash the hands, (3) rinse the mouth, (4) rinse the nose, (5) wash the face, (6) wash the arms up to the elbows, (7) wipe over the head, (8) wash the feet up to the ankles. We usually wash each part three times, without wasting water.",
        ar: "نَتَوَضَّأُ بِتَرتيب: (١) نَقولُ بِسمِ اللهِ ونَنوي، (٢) نَغسِلُ الكَفَّين، (٣) نَتَمَضمَضُ الفَم، (٤) نَستَنشِقُ الأنف، (٥) نَغسِلُ الوَجه، (٦) نَغسِلُ اليَدَينِ إلى المِرفَقَين، (٧) نَمسَحُ الرَّأس، (٨) نَغسِلُ القَدَمَينِ إلى الكَعبَين. ونَغسِلُ كُلَّ عُضوٍ ثَلاثًا غالِبًا، دونَ إسرافٍ في الماء.",
      },
    },
    {
      title: { en: "Wudu brings light", ar: "الوضوءُ يَجلِبُ النُّور" },
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern shining brightly.", ar: "فانوسٌ يُضيءُ بِنُورٍ ساطِع." },
      },
      body: {
        en: "Our Prophet ﷺ told us that on the Day of Judgment, his ummah will be known by the bright light shining on the parts they washed in wudu. He also said wudu washes away small sins with the water. So every wudu makes us cleaner and brings us reward — even when we are not about to pray.",
        ar: "أخبَرَنا نَبِيُّنا ﷺ أنَّ أُمَّتَهُ يَومَ القيامةِ يُعرَفونَ بالنُّورِ الذي يُضيءُ على أعضاءِ الوضوء. وقالَ إنَّ الوضوءَ يَغسِلُ الذُّنوبَ الصَّغيرةَ مَعَ الماء. فَكُلُّ وضوءٍ يَزيدُنا طَهارةً وأجرًا، حتّى لو لم نَكُنْ على وَشكِ الصَّلاة.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child learning the steps of wudu.", ar: "طِفلٌ يَتَعَلَّمُ خَطَواتِ الوضوء." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "The dripping tap", ar: "الصَّنبورُ المَفتوح" },
        body: {
          en: "While making wudu, Maryam leaves the tap running fast and lots of water spills away. What should she do, and what did the Prophet ﷺ teach about water?",
          ar: "أثناءَ الوضوءِ تَرَكَت مَريَمُ الصَّنبورَ مَفتوحًا بِقُوّةٍ فَضاعَ ماءٌ كَثير. ماذا يَنبَغي أن تَفعَل، وماذا عَلَّمَنا النَّبِيُّ ﷺ عنِ الماء؟",
        },
      },
      responsePrompt: {
        title: { en: "My wudu steps", ar: "خَطَواتُ وُضوئي" },
        prompt: {
          en: "Write the first thing you say and do when you begin wudu.",
          ar: "اكتُبْ أوّلَ ما تَقولُهُ وتَفعَلُهُ حينَ تَبدَأُ الوضوء.",
        },
        placeholder: { en: "When I start wudu I say...", ar: "حينَ أبدَأُ الوضوءَ أقول..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Wudu keeps us clean, ready to pray, and close to Allah. Let us learn the steps well, save water, and make wudu with love before every prayer.",
        ar: "الوضوءُ يُبقينا نَظيفينَ مُستَعِدّينَ للصَّلاةِ قَريبينَ مِنَ الله. فَلْنَتَعَلَّمِ الخَطَواتِ جَيِّدًا ونُحافِظْ على الماءِ ونَتَوَضَّأْ بِحُبٍّ قَبلَ كُلِّ صَلاة.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What do we do before we pray?", ar: "ماذا نَفعَلُ قَبلَ الصَّلاة؟" },
      options: [
        { en: "Make wudu", ar: "نَتَوَضَّأ" },
        { en: "Eat a big meal", ar: "نَأكُلُ كَثيرًا" },
        { en: "Go to sleep", ar: "نَنام" },
      ],
      correctIndex: 0,
      explanation: { en: "We make wudu to be clean and ready for prayer.", ar: "نَتَوَضَّأُ لِنَكونَ نِظافًا مُستَعِدّينَ للصَّلاة." },
    },
    {
      prompt: { en: "What do we say when we begin wudu?", ar: "ماذا نَقولُ حينَ نَبدَأُ الوضوء؟" },
      options: [
        { en: "Bismillah", ar: "بِسمِ الله" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "Goodbye", ar: "مَعَ السَّلامة" },
      ],
      correctIndex: 0,
      explanation: { en: "We begin wudu by saying Bismillah.", ar: "نَبدَأُ الوضوءَ بِقَولِ بِسمِ الله." },
    },
    {
      prompt: { en: "Which of these is a step of wudu?", ar: "أيٌّ مِن هذهِ خَطوةٌ مِن خَطَواتِ الوضوء؟" },
      options: [
        { en: "Washing the face", ar: "غَسلُ الوَجه" },
        { en: "Washing the hair with shampoo", ar: "غَسلُ الشَّعرِ بالشّامبو" },
        { en: "Brushing teeth only", ar: "تَنظيفُ الأسنانِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Washing the face is one of the steps Allah mentioned.", ar: "غَسلُ الوَجهِ مِنَ الخَطَواتِ التي ذَكَرَها الله." },
    },
    {
      prompt: { en: "Should we waste water when making wudu?", ar: "هل نُسرِفُ في الماءِ عِندَ الوضوء؟" },
      options: [
        { en: "No, we should save water", ar: "لا، نُحافِظُ على الماء" },
        { en: "Yes, use as much as we like", ar: "نَعَم، نَستَخدِمُ كَما نُريد" },
        { en: "Water does not matter", ar: "الماءُ لا يُهِمّ" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ taught us not to waste water, even for wudu.", ar: "عَلَّمَنا النَّبِيُّ ﷺ ألّا نُسرِفَ في الماءِ ولو في الوضوء." },
    },
    {
      prompt: { en: "True or False: A prayer is not accepted without wudu.", ar: "صَوابٌ أم خَطأ: لا تُقبَلُ الصَّلاةُ بِدونِ وضوء." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. The Prophet ﷺ said no prayer is accepted without purification.", ar: "صَواب. قال النَّبِيُّ ﷺ: لا تُقبَلُ صَلاةٌ بِغَيرِ طَهور." },
    },
  ],
};
