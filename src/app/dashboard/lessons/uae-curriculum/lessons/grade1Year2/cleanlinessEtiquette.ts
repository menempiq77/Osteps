import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const cleanlinessEtiquette: CourseLesson = {
  slug: "g1y2-cleanliness-etiquette-in-islam",
  name: { en: "Cleanliness Etiquette in Islam", ar: "آدابُ النَّظافَة في الإسلام" },
  shortIntro: {
    en: "Islam loves cleanliness. Let us learn how to keep our body, clothes, and home clean and beautiful.",
    ar: "الإسلامُ يُحِبُّ النَّظافة. لِنَتَعَلَّمْ كَيفَ نُبقي أجسامَنا وثِيابَنا وبُيوتَنا نَظيفةً جَميلة.",
  },
  quranSurahs: ["Al-Baqarah 222"],
  sections: [
    {
      title: { en: "Islam loves cleanliness", ar: "الإسلامُ يُحِبُّ النَّظافة" },
      learningObjective: {
        en: "I can say that keeping clean is part of my religion.",
        ar: "أستَطيعُ أن أقولَ إنَّ النَّظافةَ جُزءٌ مِن ديني.",
      },
      image: {
        src: IMG.waterfall,
        alt: { en: "Clean, fresh flowing water.", ar: "ماءٌ نَظيفٌ عَذبٌ يَجري." },
        caption: { en: "Allah gave us water to stay clean and pure.", ar: "أعطانا اللهُ الماءَ لِنَبقى نِظافًا أطهارًا." },
      },
      body: {
        en: "Being clean is a big part of being a Muslim. We keep our bodies clean by washing, brushing our teeth, and making wudu. We keep our clothes clean and our homes, classrooms, and streets tidy. A clean Muslim is healthy and pleasing to Allah.",
        ar: "النَّظافةُ جُزءٌ كَبيرٌ مِن كَونِنا مُسلِمين. نُبقي أجسامَنا نَظيفةً بالاغتِسالِ وتَنظيفِ الأسنانِ والوضوء. ونُبقي ثِيابَنا نَظيفةً وبُيوتَنا وفُصولَنا وشَوارِعَنا مُرَتَّبة. والمُسلِمُ النَّظيفُ صِحّيٌّ ويُرضي الله.",
      },
    },
    {
      title: { en: "Allah loves those who purify", ar: "اللهُ يُحِبُّ المُتَطَهِّرين" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading about purity.", ar: "طِفلٌ يَقرَأُ عنِ الطَّهارة." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.\" — Al-Baqarah 222", ar: "﴿...إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ﴾ — البقرة ٢٢٢" },
            { en: "It means: Allah loves people who keep themselves clean and pure.", ar: "مَعناها: يُحِبُّ اللهُ مَن يُحافِظونَ على نَظافَتِهِم وطَهارَتِهِم." },
          ],
        },
      ],
      body: {
        en: "Allah tells us that He loves people who purify themselves. So when we wash and stay clean, we are not only healthy — we are also doing something Allah loves. Cleanliness is an act of worship when we do it to please Allah.",
        ar: "يُخبِرُنا اللهُ أنَّهُ يُحِبُّ المُتَطَهِّرين. فَحينَ نَغتَسِلُ ونَبقى نِظافًا لا نَكونُ أصِحّاءَ فَحَسب، بل نَفعَلُ ما يُحِبُّهُ الله. والنَّظافةُ عِبادةٌ حينَ نَقصِدُ بِها رِضا الله.",
      },
    },
    {
      title: { en: "Cleanliness is half of faith", ar: "النَّظافةُ نِصفُ الإيمان" },
      image: {
        src: IMG.lantern,
        alt: { en: "A clean, bright lantern.", ar: "فانوسٌ نَظيفٌ مُضيء." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"Cleanliness is half of faith.\" (Muslim)", ar: "قال النَّبِيُّ ﷺ: «الطُّهورُ شَطرُ الإيمان». (رواه مسلم)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ told us that cleanliness is half of faith — that is how important it is! He used the miswak (a natural toothbrush) to clean his teeth, kept his clothes neat, and liked good smells. Following his Sunnah, we keep ourselves and our surroundings clean every day.",
        ar: "أخبَرَنا نَبِيُّنا ﷺ أنَّ الطُّهورَ نِصفُ الإيمان، فَما أعظَمَ النَّظافة! وكانَ يَستَعمِلُ السِّواكَ لِتَنظيفِ أسنانِه، ويُبقي ثِيابَهُ مُرَتَّبة، ويُحِبُّ الرّائِحةَ الطَّيِّبة. واتِّباعًا لِسُنَّتِهِ نُبقي أنفُسَنا ومُحيطَنا نَظيفًا كُلَّ يَوم.",
      },
    },
    {
      title: { en: "Clean body, clean place", ar: "جِسمٌ نَظيفٌ ومَكانٌ نَظيف" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A clean green natural place.", ar: "مَكانٌ طَبيعيٌّ أخضَرُ نَظيف." },
      },
      body: {
        en: "We keep our body clean by washing our hands before and after eating, after using the toilet, and by bathing. We keep our place clean by putting rubbish in the bin, not writing on walls, and helping tidy our classroom. Keeping the earth clean is a way of thanking Allah for His gifts.",
        ar: "نُبقي أجسامَنا نَظيفةً بِغَسلِ الأيدي قَبلَ الطَّعامِ وبعدَهُ، وبعدَ دُخولِ الحَمّام، وبالاستِحمام. ونُبقي مَكانَنا نَظيفًا بِوَضعِ النِّفاياتِ في السَّلّة، وعَدَمِ الكِتابةِ على الجُدران، ومُساعَدةِ زُمَلائِنا في تَرتيبِ الفَصل. والمُحافَظةُ على نَظافةِ الأرضِ شُكرٌ لله على نِعَمِه.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child keeping the desk tidy.", ar: "طِفلٌ يُرَتِّبُ مَكتَبَه." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "Rubbish on the floor", ar: "نِفاياتٌ على الأرض" },
        body: {
          en: "After break, you see juice boxes and papers on the classroom floor. The bin is right there. What is the clean, faithful thing to do, even if you did not drop them?",
          ar: "بعدَ الفُسحةِ تَرى عُلَبَ عَصيرٍ وأوراقًا على أرضِ الفَصل، والسَّلّةُ قَريبة. ما الشَّيءُ النَّظيفُ المُؤمِنُ الذي تَفعَلُهُ حتّى لو لم تَرمِها أنت؟",
        },
      },
      responsePrompt: {
        title: { en: "My clean habit", ar: "عادَتي النَّظيفة" },
        prompt: {
          en: "Write one cleanliness habit you will do every day.",
          ar: "اكتُبْ عادةَ نَظافةٍ واحِدةً سَتَفعَلُها كُلَّ يَوم.",
        },
        placeholder: { en: "Every day I will...", ar: "كُلَّ يَومٍ سأ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Cleanliness keeps us healthy and is loved by Allah. Let us keep our body, clothes, home, and school clean — and remember that being clean is part of being a good Muslim.",
        ar: "النَّظافةُ تُبقينا أصِحّاءَ ويُحِبُّها الله. فَلْنُبقِ أجسامَنا وثِيابَنا وبُيوتَنا ومَدرَسَتَنا نَظيفة، ولْنَتَذَكَّرْ أنَّ النَّظافةَ مِن حُسنِ الإسلام.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "How important is cleanliness in Islam?", ar: "ما أهَمِّيّةُ النَّظافةِ في الإسلام؟" },
      options: [
        { en: "It is half of faith", ar: "هي نِصفُ الإيمان" },
        { en: "It is not important", ar: "غَيرُ مُهِمّة" },
        { en: "Only for grown-ups", ar: "للكِبارِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ said cleanliness (purity) is half of faith.", ar: "قال النَّبِيُّ ﷺ: الطُّهورُ شَطرُ الإيمان." },
    },
    {
      prompt: { en: "Allah loves those who...", ar: "اللهُ يُحِبُّ الذينَ..." },
      options: [
        { en: "Purify and keep themselves clean", ar: "يَتَطَهَّرونَ ويَبقَونَ نِظافًا" },
        { en: "Are always dirty", ar: "يَبقَونَ أوساخًا دائِمًا" },
        { en: "Throw rubbish anywhere", ar: "يَرمونَ النِّفاياتِ في أيِّ مَكان" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah loves those who purify themselves.", ar: "اللهُ يُحِبُّ المُتَطَهِّرين." },
    },
    {
      prompt: { en: "What did the Prophet ﷺ use to clean his teeth?", ar: "بِماذا كانَ النَّبِيُّ ﷺ يُنَظِّفُ أسنانَه؟" },
      options: [
        { en: "The miswak", ar: "السِّواك" },
        { en: "A stone", ar: "حَجَر" },
        { en: "Nothing", ar: "لا شيء" },
      ],
      correctIndex: 0,
      explanation: { en: "He used the miswak, a natural toothbrush.", ar: "كانَ يَستَعمِلُ السِّواك، وهو فُرشاةٌ طَبيعيّة." },
    },
    {
      prompt: { en: "When should we wash our hands?", ar: "مَتى نَغسِلُ أيدِيَنا؟" },
      options: [
        { en: "Before and after eating", ar: "قَبلَ الطَّعامِ وبعدَه" },
        { en: "Never", ar: "أبَدًا" },
        { en: "Only once a week", ar: "مَرّةً في الأُسبوعِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "We wash our hands before and after eating, and after the toilet.", ar: "نَغسِلُ أيدِيَنا قَبلَ الطَّعامِ وبعدَهُ وبعدَ الحَمّام." },
    },
    {
      prompt: { en: "True or False: Keeping our school and street clean is part of our faith.", ar: "صَوابٌ أم خَطأ: المُحافَظةُ على نَظافةِ مَدرَسَتِنا وشارِعِنا مِن إيمانِنا." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Islam tells us to keep ourselves and our surroundings clean.", ar: "صَواب. الإسلامُ يَأمُرُنا بِنَظافةِ أنفُسِنا ومُحيطِنا." },
    },
  ],
};
