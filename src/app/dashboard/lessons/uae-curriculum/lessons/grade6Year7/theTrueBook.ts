import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const theTrueBook: CourseLesson = {
  slug: "g6y7-the-true-book-as-sajdah-1-12",
  name: { en: "The True Book (As-Sajdah 1-12)", ar: "الكِتابُ الحَقُّ (السجدة ١-١٢)" },
  shortIntro: {
    en: "A deep study of the opening of Surat As-Sajdah: how the Qur'an proves its own divine origin, builds the case for tawhid and resurrection, and demands a response from every reader.",
    ar: "دِراسةٌ مُعَمَّقةٌ لِمَطلَعِ سورةِ السَّجدة: كَيفَ يُبَرهِنُ القُرآنُ على مَصدَرِهِ الإلهِيِّ، ويُقيمُ الحُجّةَ على التَّوحيدِ والبَعث، ويَطلُبُ مِن كُلِّ قارِئٍ مَوقِفًا.",
  },
  quranSurahs: ["As-Sajdah 1-12", "Al-Isra 88", "Fussilat 53"],
  sections: [
    {
      title: { en: "Critical thinking (Warm up)", ar: "تَفكيرٌ ناقِد (تَهيئة)" },
      learningObjectives: [
        { en: "Evaluate a real-world scenario critically using evidence from the Qur'an, Sunnah, science, and Islamic history.", ar: "أُقَيِّمُ سِيناريو واقِعيًّا بِتَفكيرٍ ناقِدٍ مُستَعينًا بِأدِلّةٍ مِنَ القُرآنِ والسُّنّةِ والعِلمِ والتّاريخِ الإسلامِيّ." },
      ],
      image: {
        src: IMG.hijabStudent,
        alt: { en: "A student in hijab holding a notebook, ready to think critically.", ar: "طالِبةٌ مُحَجَّبةٌ تَحمِلُ دَفتَرًا، مُستَعِدّةٌ لِلتَّفكيرِ النّاقِد." },
      },
      callout: {
        label: { en: "Critical thinking scenario", ar: "سِيناريو لِلتَّفكيرِ النّاقِد" },
        title: { en: "Can we live without divine guidance?", ar: "هل يُمكِنُنا العَيشُ بِدونِ هِدايةٍ إلهِيّة؟" },
        body: {
          en: "NEWS REPORT — A large factory near a coastal town has been dumping toxic chemicals into the sea for over ten years, killing marine life and polluting the drinking water of 50,000 residents. The factory owner told journalists: 'Nature fixes itself — I don't need old religious books to tell me how to treat the environment. Who really knows if there is a God watching us? Nobody will be held accountable after death — once you die, it's over.'",
          ar: "خَبَرٌ صَحَفِيّ — مَصنَعٌ كَبيرٌ قُربَ بَلدةٍ ساحِليّةٍ يَرمي مُخَلَّفاتٍ سامّةً في البَحرِ مُنذُ عَشرِ سَنَوات، ما أدّى إلى نُفوقِ الكائِناتِ البَحريّةِ وتَلويثِ مِياهِ الشُّربِ لِخَمسينَ ألفَ شَخص. قالَ صاحِبُ المَصنَعِ لِلصَّحَفِيّين: «الطَّبيعةُ تُصلِحُ نَفسَها — لا أحتاجُ كُتُبًا دينيّةً قَديمة. مَن يَعلَمُ إن كانَ هُناكَ إلهٌ يُراقِبُنا؟ لن يُحاسَبَ أحَدٌ بَعدَ المَوت.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتُبْ رَدَّكَ النّاقِد" },
        prompt: {
          en: "What is wrong with the factory owner's attitude? Criticise him using evidence from the Qur'an, Sunnah, science, or Islamic history.",
          ar: "ما الخَطَأُ في مَوقِفِ صاحِبِ المَصنَع؟ انتَقِدْهُ مُستَعينًا بِأدِلّةٍ مِنَ القُرآنِ أوِ السُّنّةِ أوِ العِلمِ أوِ التّاريخِ الإسلامِيّ.",
        },
        placeholder: { en: "The factory owner is wrong because...", ar: "صاحِبُ المَصنَعِ مُخطِئٌ لِأنَّ..." },
        buttonLabel: { en: "Save response", ar: "احفَظِ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "Read the scenario above. The factory owner denies divine guidance, destroys Allah's creation, and rejects accountability after death. Surat As-Sajdah 1-12 answers every one of his claims. Use evidence from the Qur'an, Sunnah, science, or Islamic history to critique him below.",
        ar: "اقرَأِ السِّيناريو أعلاه. صاحِبُ المَصنَعِ يُنكِرُ الهِدايةَ الإلهيّة، ويُفسِدُ خَلقَ الله، ويَرفُضُ الحِسابَ بَعدَ المَوت. سورةُ السَّجدةِ ١-١٢ تَرُدُّ على كُلِّ ادِّعاءاتِه. استَعِنْ بِأدِلّةٍ مِنَ القُرآنِ والسُّنّةِ والعِلمِ أوِ التّاريخِ الإسلامِيّ لِنَقدِه أدناه.",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "مُمارَسةُ الاستِرجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابِقْ كُلَّ صورةٍ بِكَلِمَتِها الإسلامِيّة" },
        instruction: { en: "Drag the keyword to the correct image. These concepts connect to Surat As-Sajdah 1-12.", ar: "اسحَبِ الكَلِمةَ إلى الصّورةِ الصَّحيحة. هذه المَفاهيمُ تَرتَبِطُ بِسورةِ السجدة ١-١٢." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Tanzil (Revelation)", ar: "تَنزيل (وَحي)" } },
          { image: IMG.grandMosque, keyword: { en: "Sajdah (Prostration)", ar: "سَجدة (خُشوع)" } },
          { image: IMG.skyBlue, keyword: { en: "The Heavens (As-Samawat)", ar: "السَّماوات" } },
          { image: IMG.sea, keyword: { en: "Allah's Creation", ar: "خَلقُ الله" } },
          { image: IMG.plantBulb, keyword: { en: "Resurrection (Ba'th)", ar: "البَعث" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\"The revelation of the Book \u2014 there is no doubt about it \u2014 is from the Lord of the worlds.\" (As-Sajdah 2). The Prophet \uFDFA said: \"Whoever recites Surat As-Sajdah and Surat Al-Mulk every night, Allah will protect him\" (Tirmidhi). Refresh these key concepts before we begin \u2014 they are the foundation of today's lesson.",
        ar: "\uFD3Fتَنزيلُ الكِتابِ لا رَيبَ فيهِ مِن رَبِّ العالَمين\uFD3E (السجدة ٢). قالَ النَّبِيُّ \uFDFA: \u00ABمَن قَرَأَ سورةَ السَّجدةِ وسورةَ المُلكِ كُلَّ لَيلةٍ حَفِظَهُ الله\u00BB (الترمذي). راجِعْ هذهِ المَفاهيمَ قَبلَ أن نَبدَأ \u2014 فَهِيَ أساسُ دَرسِ اليَوم.",
      },
    },
    {
      title: { en: "The True Book \u2014 As-Sajdah 1-12", ar: "الكِتابُ الحَقُّ \u2014 السجدة ١-١٢" },
      learningObjectives: [
        { en: "Explain how Surat As-Sajdah 1-3 proves the Qur'an is from Allah and not invented by any human.", ar: "أُوَضِّحُ كَيفَ تُثبِتُ السجدة ١-٣ أنَّ القُرآنَ مِنَ اللهِ ولَيسَ مِن صُنعِ بَشَر." },
        { en: "Identify how As-Sajdah 4-12 links Allah's creation of the heavens, earth, and mankind to the reality of resurrection.", ar: "أُحَدِّدُ كَيفَ تَربِطُ السجدة ٤-١٢ خَلقَ اللهِ لِلسَّماواتِ والأرضِ والإنسانِ بِحَقيقةِ البَعث." },
      ],
      successCriteria: [
        { en: "I can state the meaning of 'Tanzil' and explain why the Qur'an calls itself 'the truth from your Lord' (As-Sajdah 2-3).", ar: "أستَطيعُ بَيانَ مَعنى «تَنزيل» وتَفسيرَ لِماذا يُسَمّي القُرآنُ نَفسَهُ «الحَقَّ مِن رَبِّك» (السجدة ٢-٣)." },
        { en: "I can describe at least three signs of Allah's creation mentioned in As-Sajdah 4-9.", ar: "أستَطيعُ وَصفَ ثَلاثِ آياتٍ مِن آياتِ خَلقِ اللهِ الوارِدةِ في السجدة ٤-٩." },
        { en: "I can explain how the disbelievers deny resurrection and how Allah responds in As-Sajdah 10-12.", ar: "أستَطيعُ شَرحَ إنكارِ الكافِرينَ لِلبَعثِ ورَدِّ اللهِ عَلَيهِم في السجدة ١٠-١٢." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an.", ar: "طِفلٌ يَقرَأُ القُرآن." },
      },
      readyButton: {
        label: { en: "I'm ready to learn!", ar: "أنا مُستَعِدٌّ لِلتَّعَلُّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "As-Sajdah 1\u201312: The True Book", ar: "السجدة ١-١٢: الكِتابُ الحَقّ" },
      learningObjectives: [
        { en: "Understand how As-Sajdah 1-12 proves the divine origin of the Qur'an, Allah's creation and dominion, and the reality of resurrection.", ar: "\u0623\u064f\u0648\u064e\u0636\u0651\u0650\u062d\u064f \u0643\u064e\u064a\u0641\u064e \u062a\u064f\u062b\u0628\u0650\u062a\u064f \u0627\u0644\u0633\u062c\u062f\u0629 \u0661-\u0661\u0662 \u0623\u0635\u0644\u064e \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u0650 \u0627\u0644\u0625\u0644\u0647\u064a\u0651\u064e \u0648\u062e\u064e\u0644\u0642\u064e \u0627\u0644\u0644\u0647\u0650 \u0648\u0645\u064f\u0644\u0643\u064e\u0647\u064f \u0648\u062d\u064e\u0642\u064a\u0642\u064e\u0629\u064e \u0627\u0644\u0628\u064e\u0639\u062b." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "The heavens, a sign of Allah\u2019s creation.", ar: "\u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0621\u060c \u0622\u064a\u0629\u064c \u0645\u0650\u0646 \u0622\u064a\u0627\u062a\u0650 \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0644\u0647." },
      },
      infoBoxes: [
        {
          label: { en: "Qur\u2019an \u2014 As-Sajdah 1-3", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0661-\u0663" },
          lines: [
            { en: "\u00ab Alif-Lam-Mim. The revelation of the Book \u2014 there is no doubt about it \u2014 is from the Lord of the worlds. Or do they say, \u2018He invented it\u2019? Rather, it is the truth from your Lord, that you may warn a people to whom no warner came before you, so that they may be guided. \u00bb", ar: "\uFD3F\u0627\u0644\u0645 \u06DD \u062a\u064e\u0646\u0632\u0650\u064a\u0644\u064f \u0627\u0644\u0652\u0643\u0650\u062a\u064e\u0627\u0628\u0650 \u0644\u064e\u0627 \u0631\u064e\u064a\u0652\u0628\u064e \u0641\u0650\u064a\u0647\u0650 \u0645\u0650\u0646 \u0631\u0651\u064e\u0628\u0651\u0650 \u0627\u0644\u0652\u0639\u064e\u0627\u0644\u064e\u0645\u0650\u064a\u0646\u064e \u06DD \u0623\u064e\u0645\u0652 \u064a\u064e\u0642\u064f\u0648\u0644\u064f\u0648\u0646\u064e \u0627\u0641\u0652\u062a\u064e\u0631\u064e\u0627\u0647\u064f \u06da \u0628\u064e\u0644\u0652 \u0647\u064f\u0648\u064e \u0627\u0644\u0652\u062d\u064e\u0642\u0651\u064f \u0645\u0650\u0646 \u0631\u0651\u064e\u0628\u0651\u0650\u0643\u064e \u0644\u0650\u062a\u064f\u0646\u0630\u0650\u0631\u064e \u0642\u064e\u0648\u0652\u0645\u064b\u0627 \u0645\u064e\u0651\u0627 \u0623\u064e\u062a\u064e\u0627\u0647\u064f\u0645 \u0645\u0651\u0650\u0646 \u0646\u0651\u064e\u0630\u0650\u064a\u0631\u064d \u0645\u0651\u0650\u0646 \u0642\u064e\u0628\u0652\u0644\u0650\u0643\u064e \u0644\u064e\u0639\u064e\u0644\u0651\u064e\u0647\u064f\u0645\u0652 \u064a\u064e\u0647\u0652\u062a\u064e\u062f\u064f\u0648\u0646\u064e\uFD3E" },
          ],
        },
        {
          label: { en: "Qur\u2019an \u2014 As-Sajdah 4-6", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0664-\u0666" },
          lines: [
            { en: "\u00ab Allah is the One who created the heavens and the earth and what is between them in six days, then He rose over the Throne. You have not besides Him any protector or intercessor; will you not then be reminded? He arranges each matter from the heaven to the earth; then it will ascend to Him in a Day the span of which is a thousand years of what you count. That is the Knower of the unseen and the seen, the Almighty, the Merciful. \u00bb", ar: "\uFD3F\u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u062e\u064e\u0644\u064e\u0642\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u064e\u0627\u0648\u064e\u0627\u062a\u0650 \u0648\u064e\u0627\u0644\u0652\u0623\u064e\u0631\u0652\u0636\u064e \u0648\u064e\u0645\u064e\u0627 \u0628\u064e\u064a\u0652\u0646\u064e\u0647\u064f\u0645\u064e\u0627 \u0641\u0650\u064a \u0633\u0650\u062a\u0651\u064e\u0629\u0650 \u0623\u064e\u064a\u0651\u064e\u0627\u0645\u064d \u062b\u064f\u0645\u0651\u064e \u0627\u0633\u0652\u062a\u064e\u0648\u064e\u0649\u0670 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0652\u0639\u064e\u0631\u0652\u0634\u0650 \u06d6 \u0645\u064e\u0627 \u0644\u064e\u0643\u064f\u0645 \u0645\u0651\u0650\u0646 \u062f\u064f\u0648\u0646\u0650\u0647\u0650 \u0645\u0650\u0646 \u0648\u064e\u0644\u0650\u064a\u0651\u064d \u0648\u064e\u0644\u064e\u0627 \u0634\u064e\u0641\u0650\u064a\u0639\u064d \u06da \u0623\u064e\u0641\u064e\u0644\u064e\u0627 \u062a\u064e\u062a\u064e\u0630\u064e\u0643\u0651\u064e\u0631\u064f\u0648\u0646\u064e \u06dd \u064a\u064f\u062f\u064e\u0628\u0651\u0650\u0631\u064f \u0627\u0644\u0652\u0623\u064e\u0645\u0652\u0631\u064e \u0645\u0650\u0646\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u064e\u0627\u0621\u0650 \u0625\u0650\u0644\u064e\u0649 \u0627\u0644\u0652\u0623\u064e\u0631\u0652\u0636\u0650 \u062b\u064f\u0645\u0651\u064e \u064a\u064e\u0639\u0652\u0631\u064f\u062c\u064f \u0625\u0650\u0644\u064e\u064a\u0652\u0647\u0650 \u0641\u0650\u064a \u064a\u064e\u0648\u0652\u0645\u064d \u0643\u064e\u0627\u0646\u064e \u0645\u0650\u0642\u0652\u062f\u064e\u0627\u0631\u064f\u0647\u064f \u0623\u064e\u0644\u0652\u0641\u064e \u0633\u064e\u0646\u064e\u0629\u064d \u0645\u0651\u0650\u0645\u0651\u064e\u0627 \u062a\u064e\u0639\u064f\u062f\u0651\u064f\u0648\u0646\u064e \u06dd \u0630\u064e\u0670\u0644\u0650\u0643\u064e \u0639\u064e\u0627\u0644\u0650\u0645\u064f \u0627\u0644\u0652\u063a\u064e\u064a\u0652\u0628\u0650 \u0648\u064e\u0627\u0644\u0634\u0651\u064e\u0647\u064e\u0627\u062f\u064e\u0629\u0650 \u0627\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064f\uFD3E" },
          ],
        },
        {
          label: { en: "Qur\u2019an \u2014 As-Sajdah 7-9", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0667-\u0669" },
          lines: [
            { en: "\u00ab [He] who perfected everything which He created and began the creation of man from clay. Then He made his posterity out of the extract of a liquid disdained. Then He proportioned him and breathed into him from His [created] soul and made for you hearing, vision, and hearts; little are you grateful. \u00bb", ar: "\uFD3F\u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0623\u064e\u062d\u0652\u0633\u064e\u0646\u064e \u0643\u064f\u0644\u0651\u064e \u0634\u064e\u064a\u0652\u0621\u064d \u062e\u064e\u0644\u064e\u0642\u064e\u0647\u064f \u06d6 \u0648\u064e\u0628\u064e\u062f\u064e\u0623\u064e \u062e\u064e\u0644\u0652\u0642\u064e \u0627\u0644\u0652\u0625\u0650\u0646\u0633\u064e\u0627\u0646\u0650 \u0645\u0650\u0646 \u0637\u0650\u064a\u0646\u064d \u06dd \u062b\u064f\u0645\u0651\u064e \u062c\u064e\u0639\u064e\u0644\u064e \u0646\u064e\u0633\u0652\u0644\u064e\u0647\u064f \u0645\u0650\u0646 \u0633\u064f\u0644\u064e\u0627\u0644\u064e\u0629\u064d \u0645\u0651\u0650\u0646 \u0645\u0651\u064e\u0627\u0621\u064d \u0645\u0651\u064e\u0647\u0650\u064a\u0646\u064d \u06dd \u062b\u064f\u0645\u0651\u064e \u0633\u064e\u0648\u0651\u064e\u0627\u0647\u064f \u0648\u064e\u0646\u064e\u0641\u064e\u062e\u064e \u0641\u0650\u064a\u0647\u0650 \u0645\u0650\u0646 \u0631\u0651\u064f\u0648\u062d\u0650\u0647\u0650 \u06d6 \u0648\u064e\u062c\u064e\u0639\u064e\u0644\u064e \u0644\u064e\u0643\u064f\u0645\u064f \u0627\u0644\u0633\u0651\u064e\u0645\u0652\u0639\u064e \u0648\u064e\u0627\u0644\u0652\u0623\u064e\u0628\u0652\u0635\u064e\u0627\u0631\u064e \u0648\u064e\u0627\u0644\u0652\u0623\u064e\u0641\u0652\u0626\u0650\u062f\u064e\u0629\u064e \u06da \u0642\u064e\u0644\u0650\u064a\u0644\u064b\u0627 \u0645\u0651\u064e\u0627 \u062a\u064e\u0634\u0652\u0643\u064f\u0631\u064f\u0648\u0646\u064e\uFD3E" },
          ],
        },
        {
          label: { en: "Qur\u2019an \u2014 As-Sajdah 10-12", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0661\u0660-\u0661\u0662" },
          lines: [
            { en: "\u00ab And they say, \u2018When we are lost within the earth, will we indeed be in a new creation?\u2019 Rather, they are, in the meeting with their Lord, disbelievers. Say: The Angel of Death who has been entrusted with you will take you; then to your Lord you will be returned. If you could but see when the criminals bow their heads before their Lord, [saying], \u2018Our Lord, we have seen and heard, so return us; we will do righteousness. Indeed, we are now certain.\u2019 \u00bb", ar: "\uFD3F\u0648\u064e\u0642\u064e\u0627\u0644\u064f\u0648\u0627 \u0623\u064e\u0625\u0650\u0630\u064e\u0627 \u0636\u064e\u0644\u064e\u0644\u0652\u0646\u064e\u0627 \u0641\u0650\u064a \u0627\u0644\u0652\u0623\u064e\u0631\u0652\u0636\u0650 \u0623\u064e\u0625\u0650\u0646\u0651\u064e\u0627 \u0644\u064e\u0641\u0650\u064a \u062e\u064e\u0644\u0652\u0642\u064d \u062c\u064e\u062f\u0650\u064a\u062f\u064d \u06da \u0628\u064e\u0644\u0652 \u0647\u064f\u0645 \u0628\u0650\u0644\u0650\u0642\u064e\u0627\u0621\u0650 \u0631\u064e\u0628\u0651\u0650\u0647\u0650\u0645\u0652 \u0643\u064e\u0627\u0641\u0650\u0631\u064f\u0648\u0646\u064e \u06dd \u0642\u064f\u0644\u0652 \u064a\u064e\u062a\u064e\u0648\u064e\u0641\u0651\u064e\u0627\u0643\u064f\u0645 \u0645\u0651\u064e\u0644\u064e\u0643\u064f \u0627\u0644\u0652\u0645\u064e\u0648\u0652\u062a\u0650 \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0648\u064f\u0643\u0651\u0650\u0644\u064e \u0628\u0650\u0643\u064f\u0645\u0652 \u062b\u064f\u0645\u0651\u064e \u0625\u0650\u0644\u064e\u0649\u0670 \u0631\u064e\u0628\u0651\u0650\u0643\u064f\u0645\u0652 \u062a\u064f\u0631\u0652\u062c\u064e\u0639\u064f\u0648\u0646\u064e \u06dd \u0648\u064e\u0644\u064e\u0648\u0652 \u062a\u064e\u0631\u064e\u0649\u0670 \u0625\u0650\u0630\u0650 \u0627\u0644\u0652\u0645\u064f\u062c\u0652\u0631\u0650\u0645\u064f\u0648\u0646\u064e \u0646\u064e\u0627\u0643\u0650\u0633\u064f\u0648 \u0631\u064f\u0621\u064f\u0648\u0633\u0650\u0647\u0650\u0645\u0652 \u0639\u0650\u0646\u062f\u064e \u0631\u064e\u0628\u0651\u0650\u0647\u0650\u0645\u0652 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0623\u064e\u0628\u0652\u0635\u064e\u0631\u0652\u0646\u064e\u0627 \u0648\u064e\u0633\u064e\u0645\u0650\u0639\u0652\u0646\u064e\u0627 \u0641\u064e\u0627\u0631\u0652\u062c\u0650\u0639\u0652\u0646\u064e\u0627 \u0646\u064e\u0639\u0652\u0645\u064e\u0644\u0652 \u0635\u064e\u0627\u0644\u0650\u062d\u064b\u0627 \u0625\u0650\u0646\u0651\u064e\u0627 \u0645\u064f\u0648\u0642\u0650\u0646\u064f\u0648\u0646\u064e\uFD3E" },
          ],
        },
        {
          label: { en: "Hadith", ar: "\u062d\u064e\u062f\u064a\u062b" },
          lines: [
            { en: "The Prophet \uFDFA said: \u201cWhoever recites Surat As-Sajdah and Surat Al-Mulk every night, Allah will protect him.\u201d (Tirmidhi)", ar: "\u0642\u0627\u0644\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064f \uFDFA: \u00AB\u0645\u064e\u0646 \u0642\u064e\u0631\u064e\u0623\u064e \u0633\u0648\u0631\u0629\u064e \u0627\u0644\u0633\u0651\u064e\u062c\u062f\u0629\u0650 \u0648\u0633\u0648\u0631\u0629\u064e \u0627\u0644\u0645\u064f\u0644\u0643\u0650 \u0643\u064f\u0644\u0651\u064e \u0644\u064e\u064a\u0644\u0629\u064d \u062d\u064e\u0641\u0650\u0638\u064e\u0647\u064f \u0627\u0644\u0644\u0647\u00BB (\u0627\u0644\u062a\u0631\u0645\u0630\u064a)" },
            { en: "The Prophet \uFDFA said: \u201cIndeed, Allah is Beautiful and He loves beauty.\u201d (Muslim) \u2014 His creation reflects His perfection.", ar: "\u0642\u0627\u0644\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064f \uFDFA: \u00AB\u0625\u0650\u0646\u0651\u064e \u0627\u0644\u0644\u0647\u064e \u062c\u064e\u0645\u064a\u0644\u064c \u064a\u064f\u062d\u0650\u0628\u0651\u064f \u0627\u0644\u062c\u064e\u0645\u0627\u0644\u00BB (\u0645\u0633\u0644\u0645) \u2014 \u0641\u064e\u062e\u064e\u0644\u0642\u064f\u0647\u064f \u064a\u064e\u0639\u0643\u0650\u0633\u064f \u0625\u062a\u0642\u0627\u0646\u064e\u0647." },
          ],
        },
      ],
      body: {
        en: "Verses 1-3 declare the Qur\u2019an is \u2018without doubt\u2019 from the Lord of the worlds \u2014 not a human invention but the truth sent to warn and guide. Verses 4-6 prove the Author\u2019s authority: He created the heavens, earth, and all between them in six days, rose over the Throne, and arranges every matter. Verses 7-9 turn inward: He perfected creation, made man from clay, breathed a soul into him, and gave hearing, sight, and hearts \u2014 yet \u2018little are you grateful.\u2019 Verses 10-12 confront the deniers of resurrection: the Angel of Death will take every soul, and on the Day of Judgement the criminals will beg to return, finally \u2018certain\u2019 \u2014 but too late.",
        ar: "\u062a\u064f\u0639\u0644\u0650\u0646\u064f \u0627\u0644\u0622\u064a\u0627\u062a\u064f \u0661-\u0663 \u0623\u0646\u0651\u064e \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064e \u00AB\u0644\u0627 \u0631\u064e\u064a\u0628\u064e \u0641\u064a\u0647\u00BB \u0645\u0650\u0646 \u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0639\u0627\u0644\u064e\u0645\u064a\u0646 \u2014 \u0644\u064e\u064a\u0633\u064e \u0627\u062e\u062a\u0650\u0644\u0627\u0642\u064b\u0627 \u0628\u064e\u0634\u064e\u0631\u064a\u0651\u064b\u0627 \u0628\u064e\u0644 \u0627\u0644\u062d\u064e\u0642\u0651\u064f \u0644\u0650\u0625\u0646\u0630\u0627\u0631\u0650 \u0642\u064e\u0648\u0645\u064d \u0648\u0647\u0650\u062f\u0627\u064a\u064e\u062a\u0650\u0647\u0650\u0645. \u0648\u062a\u064f\u062b\u0628\u0650\u062a\u064f \u0627\u0644\u0622\u064a\u0627\u062a\u064f \u0664-\u0666 \u0633\u064f\u0644\u0637\u0627\u0646\u064e \u0627\u0644\u0645\u064f\u0624\u064e\u0644\u0651\u0650\u0641: \u062e\u064e\u0644\u064e\u0642\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0648\u0627\u062a\u0650 \u0648\u0627\u0644\u0623\u0631\u0636\u064e \u0641\u064a \u0633\u0650\u062a\u0651\u0629\u0650 \u0623\u064a\u0651\u0627\u0645\u064d \u0648\u0627\u0633\u062a\u064e\u0648\u0649 \u0639\u0644\u0649 \u0627\u0644\u0639\u064e\u0631\u0634 \u0648\u064a\u064f\u062f\u064e\u0628\u0651\u0650\u0631\u064f \u0643\u064f\u0644\u0651\u064e \u0623\u0645\u0631. \u0648\u062a\u064e\u062a\u0651\u064e\u062c\u0650\u0647\u064f \u0627\u0644\u0622\u064a\u0627\u062a\u064f \u0667-\u0669 \u0625\u0644\u0649 \u0627\u0644\u062f\u0651\u0627\u062e\u0650\u0644: \u0623\u062a\u0642\u064e\u0646\u064e \u0627\u0644\u062e\u064e\u0644\u0642 \u0648\u0635\u064e\u0646\u064e\u0639\u064e \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u064e \u0645\u0650\u0646 \u0637\u064a\u0646 \u0648\u0646\u064e\u0641\u064e\u062e\u064e \u0641\u064a\u0647 \u0627\u0644\u0631\u0651\u0648\u062d\u064e \u0648\u0648\u064e\u0647\u064e\u0628\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u0639\u064e \u0648\u0627\u0644\u0628\u064e\u0635\u064e\u0631\u064e \u0648\u0627\u0644\u0623\u0641\u0626\u0650\u062f\u0629\u064e \u2014 \u0648\u0645\u0639 \u0630\u0644\u0643 \u00AB\u0642\u064e\u0644\u064a\u0644\u064b\u0627 \u0645\u0627 \u062a\u064e\u0634\u0643\u064f\u0631\u0648\u0646\u00BB. \u0648\u062a\u064f\u0648\u0627\u062c\u0650\u0647\u064f \u0627\u0644\u0622\u064a\u0627\u062a\u064f \u0661\u0660-\u0661\u0662 \u0645\u064f\u0646\u0643\u0650\u0631\u064a \u0627\u0644\u0628\u064e\u0639\u062b: \u0645\u064e\u0644\u064e\u0643\u064f \u0627\u0644\u0645\u064e\u0648\u062a\u0650 \u064a\u064e\u0642\u0628\u0650\u0636\u064f \u0643\u064f\u0644\u0651\u064e \u0631\u0648\u062d\u060c \u0648\u064a\u064e\u0648\u0645\u064e \u0627\u0644\u0642\u064a\u0627\u0645\u0629\u0650 \u064a\u064e\u062a\u064e\u0648\u064e\u0633\u0651\u064e\u0644\u064f \u0627\u0644\u0645\u064f\u062c\u0631\u0650\u0645\u0648\u0646\u064e \u0627\u0644\u0631\u0651\u064f\u062c\u0648\u0639\u064e \u0648\u0642\u062f \u0635\u0627\u0631\u0648\u0627 \u00AB\u0645\u0648\u0642\u0650\u0646\u064a\u0646\u00BB \u2014 \u0644\u0643\u0650\u0646 \u0628\u064e\u0639\u062f\u064e \u0641\u064e\u0648\u0627\u062a\u0650 \u0627\u0644\u0623\u0648\u0627\u0646.",
      },
      trueFalseActivity: {
        title: { en: "True or False \u2014 Test your understanding", ar: "\u0635\u064e\u062d\u064a\u062d \u0623\u0645 \u062e\u064e\u0637\u064e\u0623 \u2014 \u0627\u062e\u062a\u064e\u0628\u0650\u0631\u0652 \u0641\u064e\u0647\u0645\u064e\u0643" },
        questions: [
          { statement: { en: "The Qur\u2019an says \u2018there is no doubt\u2019 it is from the Lord of the worlds (v.2).", ar: "\u064a\u064e\u0642\u0648\u0644\u064f \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064f \u00AB\u0644\u0627 \u0631\u064e\u064a\u0628\u064e \u0641\u064a\u0647\u00BB \u0645\u0650\u0646 \u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0639\u0627\u0644\u064e\u0645\u064a\u0646 (\u0622\u064a\u0629 \u0662)." }, answer: true },
          { statement: { en: "Allah created the heavens and earth in seven days (v.4).", ar: "\u062e\u064e\u0644\u064e\u0642\u064e \u0627\u0644\u0644\u0647\u064f \u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0648\u0627\u062a\u0650 \u0648\u0627\u0644\u0623\u0631\u0636\u064e \u0641\u064a \u0633\u064e\u0628\u0639\u0629\u0650 \u0623\u064a\u0651\u0627\u0645 (\u0622\u064a\u0629 \u0664)." }, answer: false },
          { statement: { en: "Allah began the creation of man from clay (v.7).", ar: "\u0628\u064e\u062f\u064e\u0623\u064e \u0627\u0644\u0644\u0647\u064f \u062e\u064e\u0644\u0642\u064e \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u0650 \u0645\u0650\u0646 \u0637\u064a\u0646 (\u0622\u064a\u0629 \u0667)." }, answer: true },
          { statement: { en: "The disbelievers believed in resurrection (v.10).", ar: "\u0622\u0645\u064e\u0646\u064e \u0627\u0644\u0643\u064f\u0641\u0651\u0627\u0631\u064f \u0628\u0627\u0644\u0628\u064e\u0639\u062b (\u0622\u064a\u0629 \u0661\u0660)." }, answer: false },
          { statement: { en: "On the Day of Judgement, the criminals will beg to return and do righteousness (v.12).", ar: "\u064a\u064e\u0648\u0645\u064e \u0627\u0644\u0642\u064a\u0627\u0645\u0629\u0650 \u064a\u064e\u062a\u064e\u0648\u064e\u0633\u0651\u064e\u0644\u064f \u0627\u0644\u0645\u064f\u062c\u0631\u0650\u0645\u0648\u0646\u064e \u0627\u0644\u0631\u0651\u064f\u062c\u0648\u0639\u064e \u0644\u064a\u064e\u0639\u0645\u064e\u0644\u0648\u0627 \u0635\u0627\u0644\u0650\u062d\u064b\u0627 (\u0622\u064a\u0629 \u0661\u0662)." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the blanks", ar: "\u0627\u0645\u0644\u0623 \u0627\u0644\u0641\u064e\u0631\u0627\u063a\u0627\u062a" },
        questions: [
          { sentence: { en: "The revelation of the Book \u2014 there is no ___ about it \u2014 is from the Lord of the worlds. (v.2)", ar: "\u062a\u064e\u0646\u0632\u064a\u0644\u064f \u0627\u0644\u0643\u0650\u062a\u0627\u0628\u0650 \u0644\u0627 ___ \u0641\u064a\u0647\u0650 \u0645\u0650\u0646 \u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0639\u0627\u0644\u064e\u0645\u064a\u0646. (\u0622\u064a\u0629 \u0662)" }, answer: { en: "doubt", ar: "\u0631\u064e\u064a\u0628\u064e" } },
          { sentence: { en: "Allah created the heavens and earth in ___ days. (v.4)", ar: "\u062e\u064e\u0644\u064e\u0642\u064e \u0627\u0644\u0644\u0647\u064f \u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0648\u0627\u062a\u0650 \u0648\u0627\u0644\u0623\u0631\u0636\u064e \u0641\u064a ___ \u0623\u064a\u0651\u0627\u0645. (\u0622\u064a\u0629 \u0664)" }, answer: { en: "six", ar: "\u0633\u0650\u062a\u0651\u0629" } },
          { sentence: { en: "He began the creation of man from ___. (v.7)", ar: "\u0628\u064e\u062f\u064e\u0623\u064e \u062e\u064e\u0644\u0642\u064e \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u0650 \u0645\u0650\u0646 ___. (\u0622\u064a\u0629 \u0667)" }, answer: { en: "clay", ar: "\u0637\u064a\u0646" } },
          { sentence: { en: "The ___ of Death will take you; then to your Lord you will be returned. (v.11)", ar: "\u064a\u064e\u062a\u064e\u0648\u064e\u0641\u0651\u064e\u0627\u0643\u064f\u0645 ___ \u0627\u0644\u0645\u064e\u0648\u062a\u0650 \u062b\u064f\u0645\u0651\u064e \u0625\u0644\u0649 \u0631\u064e\u0628\u0651\u0650\u0643\u064f\u0645 \u062a\u064f\u0631\u062c\u064e\u0639\u0648\u0646. (\u0622\u064a\u0629 \u0661\u0661)" }, answer: { en: "Angel", ar: "\u0645\u064e\u0644\u064e\u0643\u064f" } },
          { sentence: { en: "And made for you hearing, vision, and ___. (v.9)", ar: "\u0648\u062c\u064e\u0639\u064e\u0644\u064e \u0644\u064e\u0643\u064f\u0645\u064f \u0627\u0644\u0633\u0651\u064e\u0645\u0639\u064e \u0648\u0627\u0644\u0623\u0628\u0635\u0627\u0631\u064e \u0648___. (\u0622\u064a\u0629 \u0669)" }, answer: { en: "hearts", ar: "\u0627\u0644\u0623\u0641\u0626\u0650\u062f\u0629" } },
        ],
        coinsReward: 10,
      },
    },
    {
      title: { en: "Group Work \u2014 Explore As-Sajdah", ar: "\u0639\u064e\u0645\u064e\u0644\u064c \u062c\u064e\u0645\u0627\u0639\u0650\u064a\u0651 \u2014 \u0627\u0633\u062a\u0643\u0634\u0650\u0641 \u0627\u0644\u0633\u0651\u064e\u062c\u062f\u0629" },
      learningObjectives: [
        { en: "Work collaboratively to analyse a specific aspect of As-Sajdah 1-12 and present findings to the class.", ar: "\u0623\u064e\u0639\u0645\u064e\u0644\u064f \u062c\u064e\u0645\u0627\u0639\u0650\u064a\u0651\u064b\u0627 \u0644\u0650\u062a\u064e\u062d\u0644\u064a\u0644\u0650 \u062c\u0627\u0646\u0650\u0628\u064d \u0645\u0650\u0646 \u0627\u0644\u0633\u062c\u062f\u0629 \u0661-\u0661\u0662 \u0648\u0639\u064e\u0631\u0636\u0650 \u0627\u0644\u0646\u064e\u062a\u0627\u0626\u0650\u062c\u0650 \u0639\u0644\u0649 \u0627\u0644\u0635\u0651\u064e\u0641." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque, where the Qur\u2019an is recited and lived.", ar: "\u0645\u064e\u0633\u062c\u0650\u062f\u064c\u060c \u064a\u064f\u062a\u0644\u0649 \u0641\u064a\u0647\u0650 \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064f \u0648\u064a\u064f\u0639\u0627\u0634\u064f \u0628\u0650\u0647." },
      },
      body: { en: "", ar: "" },
      groupWorkCards: {
        title: { en: "Choose your task", ar: "\u0627\u062e\u062a\u064e\u0631 \u0645\u064f\u0647\u0650\u0645\u0651\u064e\u062a\u064e\u0643" },
        instruction: { en: "Each group picks ONE card below. Read the reference material, complete the task, then prepare to present your work to the whole class.", ar: "\u0643\u064f\u0644\u0651\u064f \u0645\u064e\u062c\u0645\u0648\u0639\u0629\u064d \u062a\u064e\u062e\u062a\u0627\u0631\u064f \u0628\u0650\u0637\u0627\u0642\u0629\u064b \u0648\u0627\u062d\u0650\u062f\u0629\u064b. \u0627\u0642\u0631\u0623\u0648\u0627 \u0627\u0644\u0645\u0627\u062f\u0651\u064e\u0629\u064e \u0627\u0644\u0645\u064e\u0631\u062c\u0639\u0650\u064a\u0651\u0629\u064e\u060c \u0623\u064e\u0646\u062c\u0650\u0632\u0648\u0627 \u0627\u0644\u0645\u064f\u0647\u0650\u0645\u0651\u0629\u064e\u060c \u062b\u064f\u0645\u0651\u064e \u0627\u0633\u062a\u064e\u0639\u0650\u062f\u0651\u0648\u0627 \u0644\u0650\u0639\u064e\u0631\u0636\u0650 \u0639\u064e\u0645\u064e\u0644\u0650\u0643\u064f\u0645 \u0623\u0645\u0627\u0645\u064e \u0627\u0644\u0635\u0651\u064e\u0641\u0650 \u0643\u064f\u0644\u0651\u0650\u0647." },
        presentationNote: { en: "Once your work is complete, each group will present their outcome to the whole class. Be clear, use evidence, and speak confidently!", ar: "\u0628\u064e\u0639\u062f\u064e \u0627\u0644\u0627\u0646\u062a\u0650\u0647\u0627\u0621\u0650\u060c \u062a\u064e\u0639\u0631\u0650\u0636\u064f \u0643\u064f\u0644\u0651\u064f \u0645\u064e\u062c\u0645\u0648\u0639\u0629\u064d \u0646\u064e\u062a\u0627\u0626\u0650\u062c\u064e\u0647\u0627 \u0639\u0644\u0649 \u0627\u0644\u0635\u0651\u064e\u0641. \u0643\u0648\u0646\u0648\u0627 \u0648\u0627\u0636\u0650\u062d\u064a\u0646\u060c \u0627\u0633\u062a\u064e\u062e\u062f\u0650\u0645\u0648\u0627 \u0627\u0644\u0623\u062f\u0650\u0644\u0651\u0629\u064e\u060c \u0648\u062a\u064e\u062d\u064e\u062f\u0651\u064e\u062b\u0648\u0627 \u0628\u062b\u0650\u0642\u0629!" },
        cards: [
          {
            id: "A",
            title: { en: "The Divine Origin of the Qur\u2019an", ar: "\u0627\u0644\u0623\u0635\u0644\u064f \u0627\u0644\u0625\u0644\u0647\u0650\u064a\u0651\u064f \u0644\u0650\u0644\u0642\u064f\u0631\u0622\u0646" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Verses 1-3: Why the Qur\u2019an cannot be a human invention", ar: "\u0627\u0644\u0622\u064a\u0627\u062a \u0661-\u0663: \u0644\u0650\u0645\u0627\u0630\u0627 \u0644\u0627 \u064a\u064f\u0645\u0643\u0650\u0646\u064f \u0623\u0646 \u064a\u0643\u0648\u0646\u064e \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064f \u0627\u062e\u062a\u0650\u0644\u0627\u0642\u064b\u0627 \u0628\u064e\u0634\u064e\u0631\u064a\u0651\u064b\u0627" },
            infoSections: [
              {
                label: { en: "Qur\u2019an \u2014 As-Sajdah 1-3", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0661-\u0663" },
                content: { en: "\u00abAlif-Lam-Mim. The revelation of the Book \u2014 there is no doubt about it \u2014 is from the Lord of the worlds. Or do they say \u2018He invented it\u2019? Rather, it is the truth from your Lord, that you may warn a people to whom no warner came before you, so that they may be guided.\u00bb", ar: "\uFD3F\u0627\u0644\u0645 \u06DD \u062a\u064e\u0646\u0632\u0650\u064a\u0644\u064f \u0627\u0644\u0643\u0650\u062a\u0627\u0628\u0650 \u0644\u0627 \u0631\u064e\u064a\u0628\u064e \u0641\u064a\u0647\u0650 \u0645\u0650\u0646 \u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0639\u0627\u0644\u064e\u0645\u064a\u0646\u064e\uFD3E" },
              },
              {
                label: { en: "Hadith", ar: "\u062d\u064e\u062f\u064a\u062b" },
                content: { en: "The Prophet \uFDFA said: \u201cThe best of you are those who learn the Qur\u2019an and teach it.\u201d (Bukhari)", ar: "\u0642\u0627\u0644\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064f \uFDFA: \u00AB\u062e\u064e\u064a\u0631\u064f\u0643\u064f\u0645 \u0645\u064e\u0646 \u062a\u064e\u0639\u064e\u0644\u0651\u064e\u0645\u064e \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064e \u0648\u0639\u064e\u0644\u0651\u064e\u0645\u064e\u0647\u00BB (\u0627\u0644\u0628\u062e\u0627\u0631\u064a)" },
              },
              {
                label: { en: "Life scenario", ar: "\u0645\u064e\u0648\u0642\u0650\u0641\u064c \u062d\u064e\u064a\u0627\u062a\u0650\u064a\u0651" },
                content: { en: "Imagine someone claims a famous book was actually written by a student, not the author. You would ask: where is your proof? The Qur\u2019an challenges anyone to produce even one chapter like it \u2014 and no one has in 1400 years. This is the strongest evidence of its divine origin.", ar: "\u062a\u064e\u062e\u064e\u064a\u0651\u064e\u0644 \u0623\u0646\u0651\u064e \u0634\u064e\u062e\u0635\u064b\u0627 \u0627\u062f\u0651\u064e\u0639\u0649 \u0623\u0646\u0651\u064e \u0643\u0650\u062a\u0627\u0628\u064b\u0627 \u0634\u064e\u0647\u064a\u0631\u064b\u0627 \u0643\u064e\u062a\u064e\u0628\u064e\u0647\u064f \u0637\u0627\u0644\u0650\u0628\u064c \u0644\u0627 \u0627\u0644\u0645\u064f\u0624\u064e\u0644\u0651\u0650\u0641. \u0633\u064e\u062a\u064e\u0633\u0623\u0644: \u0623\u064a\u0646\u064e \u062f\u064e\u0644\u064a\u0644\u064f\u0643\u061f \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064f \u062a\u064e\u062d\u064e\u062f\u0651\u0649 \u0623\u064a\u0651\u064e \u0623\u062d\u064e\u062f\u064d \u0623\u0646 \u064a\u0623\u062a\u0650\u064a\u064e \u0628\u0650\u0633\u0648\u0631\u0629\u064d \u0645\u0650\u062b\u0644\u0650\u0647 \u2014 \u0648\u0644\u064e\u0645 \u064a\u064e\u0641\u0639\u064e\u0644 \u0623\u062d\u064e\u062f\u064c \u0645\u064f\u0646\u0630\u064f \u0661\u0664\u0660\u0660 \u0633\u064e\u0646\u0629." },
              },
              {
                label: { en: "Moral lesson", ar: "\u062f\u064e\u0631\u0633\u064c \u0623\u062e\u0644\u0627\u0642\u0650\u064a\u0651" },
                content: { en: "The Qur\u2019an being \u2018without doubt\u2019 means we must approach it with trust and open hearts. When we read it daily, it guides every part of our lives.", ar: "\u0643\u064e\u0648\u0646\u064f \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u0650 \u00AB\u0644\u0627 \u0631\u064e\u064a\u0628\u064e \u0641\u064a\u0647\u00BB \u064a\u064e\u0639\u0646\u064a \u0623\u0646 \u0646\u064e\u0642\u0631\u064e\u0623\u064e\u0647\u064f \u0628\u062b\u0650\u0642\u0629\u064d \u0648\u0642\u064e\u0644\u0628\u064d \u0645\u064e\u0641\u062a\u0648\u062d. \u0642\u0650\u0631\u0627\u0621\u064e\u062a\u064f\u0647\u064f \u0627\u0644\u064a\u064e\u0648\u0645\u0650\u064a\u0651\u0629\u064f \u062a\u064e\u0647\u062f\u064a \u0643\u064f\u0644\u0651\u064e \u062c\u064e\u0648\u0627\u0646\u0650\u0628\u0650 \u062d\u064e\u064a\u0627\u062a\u0650\u0646\u0627." },
              },
            ],
            task: {
              title: { en: "Create a Mind Map", ar: "\u0623\u064e\u0646\u0634\u0650\u0626 \u062e\u064e\u0631\u064a\u0637\u0629\u064b \u0630\u0650\u0647\u0646\u0650\u064a\u0651\u0629\u064b" },
              description: { en: "Create a mind map with \u2018The Qur\u2019an is the True Book\u2019 at the centre. Your mind map MUST include these branches:\n\u2022 Qur\u2019an: Write the key verse (As-Sajdah 2) and explain what \u2018no doubt\u2019 and \u2018from the Lord of the worlds\u2019 mean.\n\u2022 Hadith: Write the Hadith from the reference material and explain how it connects to the topic.\n\u2022 Life scenarios: Give 2 real-life examples showing how the Qur\u2019an guides people today (at school, at home, in the community).\n\u2022 Moral lessons: What lessons do verses 1-3 teach us? How should we treat the Qur\u2019an in our daily life?\n\u2022 Images & decoration: Draw or describe images related to each branch (e.g. an open Qur\u2019an, a mosque, a student reading) to make your mind map attractive and clear for presentation.\nUse colours, arrows, and key Arabic terms. Make it beautiful \u2014 your group will present this to the whole class!\n\nIMPORTANT: All Qur\u2019an and Hadith must be authentic and include the source reference (e.g. Bukhari, Tirmidhi).", ar: "\u0623\u064e\u0646\u0634\u0650\u0626 \u062e\u064e\u0631\u064a\u0637\u0629\u064b \u0630\u0650\u0647\u0646\u0650\u064a\u0651\u0629\u064b \u0628\u0650\u0640\u00AB\u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064f \u0627\u0644\u0643\u0650\u062a\u0627\u0628\u064f \u0627\u0644\u062d\u064e\u0642\u0651\u00BB \u0641\u064a \u0627\u0644\u0645\u064e\u0631\u0643\u064e\u0632. \u064a\u064e\u062c\u0650\u0628\u064f \u0623\u0646 \u062a\u064e\u0634\u0645\u064e\u0644\u064e:\n\u2022 \u0642\u064f\u0631\u0622\u0646: \u0627\u0643\u062a\u064f\u0628 \u0627\u0644\u0622\u064a\u0629\u064e \u0648\u0627\u0634\u0631\u064e\u062d\u0647\u0627\n\u2022 \u062d\u064e\u062f\u064a\u062b: \u0627\u0643\u062a\u064f\u0628 \u0627\u0644\u062d\u064e\u062f\u064a\u062b\u064e \u0648\u0627\u0634\u0631\u064e\u062d \u0639\u064e\u0644\u0627\u0642\u064e\u062a\u064e\u0647\u064f \u0628\u0627\u0644\u0645\u064e\u0648\u0636\u0648\u0639\n\u2022 \u0645\u064e\u0648\u0627\u0642\u0650\u0641 \u062d\u064e\u064a\u0627\u062a\u0650\u064a\u0651\u0629: \u0623\u064e\u0639\u0637\u0650 \u0645\u064e\u062b\u064e\u0644\u064e\u064a\u0646 \u0645\u0650\u0646 \u0627\u0644\u062d\u064e\u064a\u0627\u0629\n\u2022 \u062f\u064f\u0631\u0648\u0633 \u0623\u062e\u0644\u0627\u0642\u0650\u064a\u0651\u0629: \u0645\u0627\u0630\u0627 \u062a\u064f\u0639\u064e\u0644\u0651\u0650\u0645\u064f\u0646\u0627 \u0627\u0644\u0622\u064a\u0627\u062a\u061f\n\u2022 \u0635\u064f\u0648\u064e\u0631 \u0648\u0632\u064e\u062e\u0631\u064e\u0641\u0629: \u0627\u0631\u0633\u064f\u0645 \u0635\u064f\u0648\u064e\u0631\u064b\u0627 \u0645\u064f\u062a\u0651\u064e\u0635\u0650\u0644\u0629\u064b \u0628\u0643\u064f\u0644\u0651\u0650 \u0641\u064e\u0631\u0639" },
              hint: { en: "Use the reference material above. Include Arabic terms like Tanzil (\u062a\u064e\u0646\u0632\u064a\u0644), Al-Haqq (\u0627\u0644\u062d\u064e\u0642\u0651), and Nadhir (\u0646\u064e\u0630\u064a\u0631). Draw small images next to each branch to make your poster visually stunning for the class presentation!", ar: "\u0627\u0633\u062a\u064e\u062e\u062f\u0650\u0645 \u0627\u0644\u0645\u0627\u062f\u0651\u0629\u064e \u0627\u0644\u0645\u064e\u0631\u062c\u0639\u0650\u064a\u0651\u0629\u064e \u0623\u0639\u0644\u0627\u0647. \u0627\u0633\u062a\u064e\u0639\u0645\u0650\u0644 \u0645\u064f\u0635\u0637\u064e\u0644\u064e\u062d\u0627\u062a: \u062a\u064e\u0646\u0632\u064a\u0644\u060c \u0627\u0644\u062d\u064e\u0642\u0651\u060c \u0646\u064e\u0630\u064a\u0631. \u0627\u0631\u0633\u064f\u0645 \u0635\u064f\u0648\u064e\u0631\u064b\u0627 \u0635\u064e\u063a\u064a\u0631\u0629\u064b \u0628\u062c\u0627\u0646\u0650\u0628\u0650 \u0643\u064f\u0644\u0651\u0650 \u0641\u064e\u0631\u0639\u064d \u0644\u0650\u062a\u064e\u0643\u0648\u0646\u064e \u062c\u064e\u0630\u0651\u0627\u0628\u0629\u064b \u0639\u0650\u0646\u062f\u064e \u0627\u0644\u0639\u064e\u0631\u0636!" },
            },
          },
          {
            id: "B",
            title: { en: "Allah\u2019s Power in Creation", ar: "\u0642\u064f\u062f\u0631\u0629\u064f \u0627\u0644\u0644\u0647\u0650 \u0641\u064a \u0627\u0644\u062e\u064e\u0644\u0642" },
            image: IMG.skyBlue,
            color: "blue",
            topic: { en: "Verses 4-6: Signs of Allah\u2019s creation and dominion over the universe", ar: "\u0627\u0644\u0622\u064a\u0627\u062a \u0664-\u0666: \u0622\u064a\u0627\u062a\u064f \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0644\u0647\u0650 \u0648\u0645\u064f\u0644\u0643\u0650\u0647\u0650 \u0639\u0644\u0649 \u0627\u0644\u0643\u064e\u0648\u0646" },
            infoSections: [
              {
                label: { en: "Qur\u2019an \u2014 As-Sajdah 4-6", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0664-\u0666" },
                content: { en: "\u00abAllah created the heavens and earth in six days, then rose over the Throne. He arranges each matter from the heaven to the earth; then it ascends to Him in a Day whose span is a thousand years. That is the Knower of the unseen and seen, the Almighty, the Merciful.\u00bb", ar: "\uFD3F\u0627\u0644\u0644\u0647\u064f \u0627\u0644\u0630\u064a \u062e\u064e\u0644\u064e\u0642\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0648\u0627\u062a\u0650 \u0648\u0627\u0644\u0623\u0631\u0636\u064e \u0641\u064a \u0633\u0650\u062a\u0651\u0629\u0650 \u0623\u064a\u0651\u0627\u0645 \u062b\u0645\u0651\u064e \u0627\u0633\u062a\u064e\u0648\u0649 \u0639\u0644\u0649 \u0627\u0644\u0639\u064e\u0631\u0634...\uFD3E" },
              },
              {
                label: { en: "Hadith", ar: "\u062d\u064e\u062f\u064a\u062b" },
                content: { en: "The Prophet \uFDFA said: \u201cReflect upon the creation of Allah and do not reflect upon Allah Himself, for you will never be able to give Him His due.\u201d (At-Tabarani)", ar: "\u0642\u0627\u0644\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064f \uFDFA: \u00AB\u062a\u064e\u0641\u064e\u0643\u0651\u064e\u0631\u0648\u0627 \u0641\u064a \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0644\u0647\u0650 \u0648\u0644\u0627 \u062a\u064e\u0641\u064e\u0643\u0651\u064e\u0631\u0648\u0627 \u0641\u064a \u0627\u0644\u0644\u0647\u0650 \u0641\u0625\u0646\u0651\u064e\u0643\u064f\u0645 \u0644\u064e\u0646 \u062a\u064e\u0642\u062f\u0650\u0631\u0648\u0627 \u0642\u064e\u062f\u0631\u064e\u0647\u00BB (\u0627\u0644\u0637\u0628\u0631\u0627\u0646\u064a)" },
              },
              {
                label: { en: "Life scenario", ar: "\u0645\u064e\u0648\u0642\u0650\u0641\u064c \u062d\u064e\u064a\u0627\u062a\u0650\u064a\u0651" },
                content: { en: "Look outside your window: the sky that stays without pillars, the rain cycle that feeds the earth, the sun rising and setting on schedule. Scientists discover more wonders every day \u2014 yet all of it was already described in the Qur\u2019an 1400 years ago.", ar: "\u0627\u0646\u0638\u064f\u0631 \u0645\u0650\u0646 \u0646\u0627\u0641\u0650\u0630\u064e\u062a\u0650\u0643: \u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0621\u064f \u0628\u0644\u0627 \u0623\u0639\u0645\u0650\u062f\u0629\u060c \u062f\u064e\u0648\u0631\u0629\u064f \u0627\u0644\u0645\u0627\u0621\u0650 \u0627\u0644\u062a\u064a \u062a\u064f\u063a\u064e\u0630\u0651\u064a \u0627\u0644\u0623\u0631\u0636\u064e\u060c \u0627\u0644\u0634\u0651\u064e\u0645\u0633\u064f \u062a\u064e\u0634\u0631\u064f\u0642\u064f \u0648\u062a\u064e\u063a\u0631\u064f\u0628\u064f \u0628\u0627\u0646\u062a\u0650\u0638\u0627\u0645. \u0627\u0644\u0639\u064f\u0644\u064e\u0645\u0627\u0621\u064f \u064a\u064e\u0643\u062a\u064e\u0634\u0650\u0641\u0648\u0646\u064e \u0639\u064e\u062c\u0627\u0626\u0650\u0628\u064e \u062c\u064e\u062f\u064a\u062f\u0629\u064b \u0643\u064f\u0644\u0651\u064e \u064a\u064e\u0648\u0645 \u2014 \u0648\u0643\u064f\u0644\u0651\u064f \u0630\u0644\u0643 \u0648\u064f\u0635\u0650\u0641\u064e \u0641\u064a \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u0650 \u0645\u064f\u0646\u0630\u064f \u0661\u0664\u0660\u0660 \u0633\u064e\u0646\u0629." },
              },
              {
                label: { en: "Moral lesson", ar: "\u062f\u064e\u0631\u0633\u064c \u0623\u062e\u0644\u0627\u0642\u0650\u064a\u0651" },
                content: { en: "Allah created in stages (six days) even though He could say \u2018Be\u2019 \u2014 teaching us that wisdom, order, and patience are divine values we should follow in our own work and studies.", ar: "\u062e\u064e\u0644\u064e\u0642\u064e \u0627\u0644\u0644\u0647\u064f \u0641\u064a \u0633\u0650\u062a\u0651\u0629\u0650 \u0623\u064a\u0651\u0627\u0645\u064d \u0645\u064e\u0639 \u0642\u064f\u062f\u0631\u064e\u062a\u0650\u0647\u0650 \u0623\u0646 \u064a\u064e\u0642\u0648\u0644\u064e \u00AB\u0643\u064f\u0646\u00BB \u2014 \u064a\u064f\u0639\u064e\u0644\u0651\u0650\u0645\u064f\u0646\u0627 \u0623\u0646\u0651\u064e \u0627\u0644\u062d\u0650\u0643\u0645\u0629\u064e \u0648\u0627\u0644\u0646\u0651\u0650\u0638\u0627\u0645\u064e \u0648\u0627\u0644\u0635\u0651\u064e\u0628\u0631\u064e \u0642\u0650\u064a\u064e\u0645\u064c \u0625\u0644\u0647\u0650\u064a\u0651\u0629\u064c \u0646\u064e\u062a\u0651\u064e\u0628\u0650\u0639\u064f\u0647\u0627 \u0641\u064a \u0639\u064e\u0645\u064e\u0644\u0650\u0646\u0627 \u0648\u062f\u0650\u0631\u0627\u0633\u064e\u062a\u0650\u0646\u0627." },
              },
            ],
            task: {
              title: { en: "Extract & Present Signs of Power", ar: "\u0627\u0633\u062a\u064e\u062e\u0631\u0650\u062c \u0648\u0627\u0639\u0631\u0650\u0636 \u0622\u064a\u0627\u062a\u0650 \u0627\u0644\u0642\u064f\u062f\u0631\u0629" },
              description: { en: "Create a table with 3 columns: \u2018Sign of Allah\u2019s Power\u2019, \u2018Verse Reference\u2019, \u2018What It Teaches Us\u2019. Extract at least 5 signs from verses 4-6.\n\nYour work MUST include:\n\u2022 Qur\u2019an: Quote the exact verse for each sign (As-Sajdah 4-6) and explain its meaning in your own words.\n\u2022 Hadith: Write the Hadith from the reference material with its source (At-Tabarani) and explain how reflecting on creation strengthens faith.\n\u2022 Life scenarios: Give 2 real-life examples of Allah\u2019s signs you can see today (the sky without pillars, rain cycles, sunrise/sunset).\n\u2022 Moral lessons: What do these signs teach us about patience, order, and trusting Allah\u2019s plan?\n\u2022 Images: Draw or describe images for your table (sky, mountains, the Throne) to make your presentation attractive.\n\nWrite a concluding paragraph: How do these signs prove Allah is the only one worthy of worship?\n\nIMPORTANT: All Qur\u2019an and Hadith must be authentic and include the source reference (e.g. At-Tabarani, Bukhari).", ar: "\u0623\u064e\u0646\u0634\u0650\u0626 \u062c\u064e\u062f\u0648\u064e\u0644\u064b\u0627 \u0628\u0650\u0663 \u0623\u0639\u0645\u0650\u062f\u0629. \u064a\u064e\u062c\u0650\u0628\u064f \u0623\u0646 \u064a\u064e\u0634\u0645\u064e\u0644\u064e: \u0642\u064f\u0631\u0622\u0646 \u0645\u064e\u0639 \u0634\u064e\u0631\u062d\u060c \u062d\u064e\u062f\u064a\u062b \u0645\u064e\u0639 \u0645\u064e\u0635\u062f\u064e\u0631\u060c \u0645\u064e\u0648\u0627\u0642\u0650\u0641 \u062d\u064e\u064a\u0627\u062a\u0650\u064a\u0651\u0629\u060c \u062f\u064f\u0631\u0648\u0633 \u0623\u062e\u0644\u0627\u0642\u0650\u064a\u0651\u0629\u060c \u0648\u0635\u064f\u0648\u064e\u0631." },
              hint: { en: "Signs include: creating heavens & earth, six-day creation, rising over the Throne, arranging all matters, knowing unseen and seen. For each sign, explain WHY it matters. Add drawings of nature (sky, mountains, sea) to make it visually appealing. Always write the Hadith source.", ar: "\u0645\u0650\u0646 \u0627\u0644\u0622\u064a\u0627\u062a: \u062e\u064e\u0644\u0642\u064f \u0627\u0644\u0633\u0651\u064e\u0645\u0627\u0648\u0627\u062a\u060c \u0627\u0644\u062e\u064e\u0644\u0642\u064f \u0641\u064a \u0636 \u0623\u064a\u0651\u0627\u0645\u060c \u0627\u0644\u0627\u0633\u062a\u0650\u0648\u0627\u0621\u060c \u062a\u064e\u062f\u0628\u064a\u0631\u064f \u0627\u0644\u0623\u0645\u0631\u060c \u0639\u0650\u0644\u0645\u064f \u0627\u0644\u063a\u064e\u064a\u0628 \u0648\u0627\u0644\u0634\u0651\u064e\u0647\u0627\u062f\u0629. \u0627\u0634\u0631\u064e\u062d \u0644\u0650\u0645\u0627\u0630\u0627 \u0643\u064f\u0644\u0651\u064f \u0622\u064a\u0629\u064d \u0645\u064f\u0647\u0650\u0645\u0651\u0629." },
            },
          },
          {
            id: "C",
            title: { en: "The Perfection of Human Creation", ar: "\u0625\u062a\u0642\u0627\u0646\u064f \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0625\u0646\u0633\u0627\u0646" },
            image: IMG.plantBulb,
            color: "purple",
            topic: { en: "Verses 7-9: Stages of human creation and the gift of senses", ar: "\u0627\u0644\u0622\u064a\u0627\u062a \u0667-\u0669: \u0623\u0637\u0648\u0627\u0631\u064f \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0648\u0646\u0650\u0639\u0645\u0629\u064f \u0627\u0644\u062d\u064e\u0648\u0627\u0633\u0651" },
            infoSections: [
              {
                label: { en: "Qur\u2019an \u2014 As-Sajdah 7-9", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0667-\u0669" },
                content: { en: "\u00abHe perfected everything He created and began the creation of man from clay. Then He made his posterity from the extract of a liquid disdained. Then He proportioned him, breathed into him from His soul, and made for you hearing, vision, and hearts \u2014 little are you grateful.\u00bb", ar: "\uFD3F\u0627\u0644\u0630\u064a \u0623\u062d\u0633\u064e\u0646\u064e \u0643\u064f\u0644\u0651\u064e \u0634\u064e\u064a\u0621\u064d \u062e\u064e\u0644\u064e\u0642\u064e\u0647\u064f... \u0648\u062c\u064e\u0639\u064e\u0644\u064e \u0644\u064e\u0643\u064f\u0645\u064f \u0627\u0644\u0633\u0651\u064e\u0645\u0639\u064e \u0648\u0627\u0644\u0623\u0628\u0635\u0627\u0631\u064e \u0648\u0627\u0644\u0623\u0641\u0626\u0650\u062f\u0629\u064e \u0642\u064e\u0644\u064a\u0644\u064b\u0627 \u0645\u0627 \u062a\u064e\u0634\u0643\u064f\u0631\u0648\u0646\uFD3E" },
              },
              {
                label: { en: "Hadith", ar: "\u062d\u064e\u062f\u064a\u062b" },
                content: { en: "The Prophet \uFDFA said: \u201cIndeed, Allah is Beautiful and He loves beauty.\u201d (Muslim) \u2014 the perfection in human creation reflects Allah\u2019s beauty.", ar: "\u0642\u0627\u0644\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064f \uFDFA: \u00AB\u0625\u0650\u0646\u0651\u064e \u0627\u0644\u0644\u0647\u064e \u062c\u064e\u0645\u064a\u0644\u064c \u064a\u064f\u062d\u0650\u0628\u0651\u064f \u0627\u0644\u062c\u064e\u0645\u0627\u0644\u00BB (\u0645\u0633\u0644\u0645) \u2014 \u0625\u062a\u0642\u0627\u0646\u064f \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u064a\u064e\u0639\u0643\u0650\u0633\u064f \u062c\u064e\u0645\u0627\u0644\u064e \u0627\u0644\u0644\u0647." },
              },
              {
                label: { en: "Science connection", ar: "\u0631\u064e\u0628\u0637\u064c \u0639\u0650\u0644\u0645\u0650\u064a\u0651" },
                content: { en: "Modern embryology confirms the Qur\u2019anic stages: from a single cell (\u2018extract\u2019), the embryo develops bones, muscles, then becomes a fully formed human with senses. The Qur\u2019an described this 1400 years before microscopes existed.", ar: "\u064a\u064f\u0624\u064e\u0643\u0651\u0650\u062f\u064f \u0639\u0650\u0644\u0645\u064f \u0627\u0644\u0623\u062c\u0650\u0646\u0651\u0629\u0650 \u0627\u0644\u062d\u064e\u062f\u064a\u062b\u064f \u0627\u0644\u0645\u064e\u0631\u0627\u062d\u0650\u0644\u064e \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u0650\u064a\u0651\u0629: \u0645\u0650\u0646 \u062e\u064e\u0644\u0650\u064a\u0651\u0629\u064d \u0648\u0627\u062d\u0650\u062f\u0629 \u064a\u064e\u062a\u064e\u0637\u064e\u0648\u0651\u064e\u0631\u064f \u0627\u0644\u062c\u064e\u0646\u064a\u0646\u064f \u0625\u0644\u0649 \u0625\u0646\u0633\u0627\u0646\u064d \u0643\u0627\u0645\u0650\u0644\u064d \u0628\u0650\u062d\u064e\u0648\u0627\u0633\u0651. \u0648\u064e\u0635\u064e\u0641\u064e \u0627\u0644\u0642\u064f\u0631\u0622\u0646\u064f \u0647\u0630\u0627 \u0642\u064e\u0628\u0644\u064e \u0661\u0664\u0660\u0660 \u0633\u064e\u0646\u0629 \u0645\u0650\u0646 \u0627\u062e\u062a\u0650\u0631\u0627\u0639\u0650 \u0627\u0644\u0645\u0650\u062c\u0647\u064e\u0631." },
              },
              {
                label: { en: "Moral lesson", ar: "\u062f\u064e\u0631\u0633\u064c \u0623\u062e\u0644\u0627\u0642\u0650\u064a\u0651" },
                content: { en: "\u2018Little are you grateful\u2019 \u2014 our hearing, sight, and hearts are gifts from Allah. True gratitude means using them to learn, to recognise truth, and to help others.", ar: "\u00AB\u0642\u064e\u0644\u064a\u0644\u064b\u0627 \u0645\u0627 \u062a\u064e\u0634\u0643\u064f\u0631\u0648\u0646\u00BB \u2014 \u0627\u0644\u0633\u0651\u064e\u0645\u0639\u064f \u0648\u0627\u0644\u0628\u064e\u0635\u064e\u0631\u064f \u0648\u0627\u0644\u0641\u064f\u0624\u0627\u062f\u064f \u0646\u0650\u0639\u064e\u0645\u064c \u0645\u0650\u0646\u064e \u0627\u0644\u0644\u0647. \u0627\u0644\u0634\u0651\u064f\u0643\u0631\u064f \u0627\u0644\u062d\u064e\u0642\u064a\u0642\u0650\u064a\u0651\u064f \u0628\u0627\u0633\u062a\u0650\u062e\u062f\u0627\u0645\u0650\u0647\u0627 \u0644\u0650\u0644\u062a\u0651\u064e\u0639\u064e\u0644\u0651\u064f\u0645\u0650 \u0648\u0625\u062f\u0631\u0627\u0643\u0650 \u0627\u0644\u062d\u064e\u0642\u0651\u0650 \u0648\u0645\u064f\u0633\u0627\u0639\u064e\u062f\u0629\u0650 \u0627\u0644\u0622\u062e\u064e\u0631\u064a\u0646." },
              },
            ],
            task: {
              title: { en: "Design an Infographic", ar: "\u0635\u064e\u0645\u0651\u0650\u0645 \u0631\u064e\u0633\u0645\u064b\u0627 \u062a\u064e\u0648\u0636\u064a\u062d\u0650\u064a\u0651\u064b\u0627" },
              description: { en: "Design an infographic poster showing the stages of human creation from verses 7-9:\n1. Clay (\u0637\u064a\u0646) \u2192 2. Extract/fluid (\u0633\u064f\u0644\u0627\u0644\u0629) \u2192 3. Proportioning (\u062a\u064e\u0633\u0648\u064a\u0629) \u2192 4. Soul breathed in (\u0646\u064e\u0641\u062e \u0627\u0644\u0631\u0651\u0648\u062d) \u2192 5. Senses given (\u0633\u064e\u0645\u0639, \u0628\u064e\u0635\u064e\u0631, \u0641\u064f\u0624\u0627\u062f)\n\nYour infographic MUST include:\n\u2022 Qur\u2019an: Write the exact verses (As-Sajdah 7-9) next to the relevant stage and explain each Arabic term in your own words.\n\u2022 Hadith: Include the Hadith \u2018Allah is Beautiful and loves beauty\u2019 (Sahih Muslim) with its source and explain how it links to the perfection of creation.\n\u2022 Science connection: How does modern embryology confirm these stages? Mention at least one scientific fact.\n\u2022 Life scenario: Why should knowing our origin from clay make us humble? Give a school or home example.\n\u2022 Moral lesson: Add a \u2018Gratitude Box\u2019 \u2014 list 5 things you are grateful for about your senses (hearing, sight, heart).\n\u2022 Images: Draw images for each stage (earth/clay, water drop, a baby, an eye, a heart) to make it attractive for presentation.\n\nIMPORTANT: All Qur\u2019an and Hadith must be authentic with their source reference (e.g. Sahih Muslim).", ar: "\u0635\u064e\u0645\u0651\u0650\u0645 \u0645\u064f\u0644\u0635\u064e\u0642\u064b\u0627 \u062a\u064e\u0648\u0636\u064a\u062d\u0650\u064a\u0651\u064b\u0627 \u064a\u064f\u0638\u0647\u0650\u0631\u064f \u0645\u064e\u0631\u0627\u062d\u0650\u0644\u064e \u062e\u064e\u0644\u0642\u0650 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0645\u0650\u0646 \u0627\u0644\u0622\u064a\u0627\u062a \u0667-\u0669." },
              hint: { en: "Use arrows between stages. For each stage: write the Arabic term, its meaning, and draw a small image. The Hadith is from Sahih Muslim — always mention the source. End with your Gratitude Box and make the whole poster colourful for presentation!", ar: "\u0627\u0633\u062a\u064e\u062e\u062f\u0650\u0645 \u0627\u0644\u0623\u0633\u0647\u064f\u0645\u064e \u0628\u064e\u064a\u0646\u064e \u0627\u0644\u0645\u064e\u0631\u0627\u062d\u0650\u0644\u060c \u0648\u0627\u0643\u062a\u064f\u0628 \u0627\u0644\u0645\u064f\u0635\u0637\u064e\u0644\u064e\u062d\u0627\u062a\u0650 \u0627\u0644\u0639\u064e\u0631\u064e\u0628\u0650\u064a\u0651\u0629\u064e\u060c \u0648\u0627\u062e\u062a\u0650\u0645 \u0628\u062a\u064e\u0623\u0645\u0651\u064f\u0644\u064d \u0641\u064a \u0627\u0644\u0634\u0651\u064f\u0643\u0631." },
            },
          },
          {
            id: "D",
            title: { en: "Resurrection & Accountability", ar: "\u0627\u0644\u0628\u064e\u0639\u062b\u064f \u0648\u0627\u0644\u0645\u064f\u062d\u0627\u0633\u064e\u0628\u0629" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Verses 10-11: The deniers\u2019 argument and Allah\u2019s response about resurrection", ar: "\u0627\u0644\u0622\u064a\u0627\u062a \u0661\u0660-\u0661\u0661: \u062d\u064f\u062c\u0651\u0629\u064f \u0627\u0644\u0645\u064f\u0646\u0643\u0650\u0631\u064a\u0646 \u0648\u0631\u064e\u062f\u0651\u064f \u0627\u0644\u0644\u0647\u0650 \u0639\u0644\u0649 \u0627\u0644\u0628\u064e\u0639\u062b" },
            infoSections: [
              {
                label: { en: "Qur\u2019an \u2014 As-Sajdah 10-11", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0661\u0660-\u0661\u0661" },
                content: { en: "\u00abThey say: \u2018When we are lost within the earth, will we be in a new creation?\u2019 Rather, they disbelieve in the meeting with their Lord. Say: The Angel of Death who has been entrusted with you will take you; then to your Lord you will be returned.\u00bb", ar: "\uFD3F\u0648\u0642\u0627\u0644\u0648\u0627 \u0623\u0625\u0650\u0630\u0627 \u0636\u064e\u0644\u064e\u0644\u0646\u0627 \u0641\u064a \u0627\u0644\u0623\u0631\u0636\u0650 \u0623\u0625\u0650\u0646\u0651\u0627 \u0644\u064e\u0641\u064a \u062e\u064e\u0644\u0642\u064d \u062c\u064e\u062f\u064a\u062f... \u064a\u064e\u062a\u064e\u0648\u064e\u0641\u0651\u0627\u0643\u064f\u0645 \u0645\u064e\u0644\u064e\u0643\u064f \u0627\u0644\u0645\u064e\u0648\u062a\u0650 \u062b\u064f\u0645\u0651\u064e \u0625\u0644\u0649 \u0631\u064e\u0628\u0651\u0650\u0643\u064f\u0645 \u062a\u064f\u0631\u062c\u064e\u0639\u0648\u0646\uFD3E" },
              },
              {
                label: { en: "Hadith", ar: "\u062d\u064e\u062f\u064a\u062b" },
                content: { en: "The Prophet \uFDFA said: \u201cRemember often the destroyer of pleasures \u2014 death.\u201d (Tirmidhi). Remembering death motivates us to do good before it\u2019s too late.", ar: "\u0642\u0627\u0644\u064e \u0627\u0644\u0646\u0651\u064e\u0628\u0650\u064a\u0651\u064f \uFDFA: \u00AB\u0623\u0643\u062b\u0650\u0631\u0648\u0627 \u0630\u0650\u0643\u0631\u064e \u0647\u0627\u062f\u0650\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0630\u0651\u0627\u062a \u2014 \u0627\u0644\u0645\u064e\u0648\u062a\u00BB (\u0627\u0644\u062a\u0631\u0645\u0630\u064a). \u062a\u064e\u0630\u064e\u0643\u0651\u064f\u0631\u064f \u0627\u0644\u0645\u064e\u0648\u062a\u0650 \u064a\u064e\u062f\u0641\u064e\u0639\u064f\u0646\u0627 \u0644\u0650\u0644\u0639\u064e\u0645\u064e\u0644\u0650 \u0627\u0644\u0635\u0651\u0627\u0644\u0650\u062d\u0650 \u0642\u064e\u0628\u0644\u064e \u0641\u064e\u0648\u0627\u062a\u0650 \u0627\u0644\u0623\u0648\u0627\u0646." },
              },
              {
                label: { en: "Life scenario", ar: "\u0645\u064e\u0648\u0642\u0650\u0641\u064c \u062d\u064e\u064a\u0627\u062a\u0650\u064a\u0651" },
                content: { en: "A student says: \u2018Why worry about the afterlife? Just enjoy today.\u2019 But imagine ignoring a final exam \u2014 would you enjoy the results? Life is a test, and accountability on the Day of Judgement is the final exam. The wise student prepares.", ar: "\u064a\u064e\u0642\u0648\u0644\u064f \u0637\u0627\u0644\u0650\u0628\u064c: \u00AB\u0644\u0650\u0645\u064e \u0627\u0644\u0642\u064e\u0644\u064e\u0642\u064f \u0628\u0634\u0623\u0646\u0650 \u0627\u0644\u0622\u062e\u0650\u0631\u0629\u061f \u0627\u0633\u062a\u064e\u0645\u062a\u0650\u0639 \u0627\u0644\u064a\u064e\u0648\u0645\u00BB. \u0644\u0643\u0650\u0646 \u062a\u064e\u062e\u064e\u064a\u0651\u064e\u0644 \u0623\u0646\u0651\u064e\u0643 \u062a\u064e\u062c\u0627\u0647\u064e\u0644\u062a\u064e \u0627\u0644\u0627\u0645\u062a\u0650\u062d\u0627\u0646\u064e \u0627\u0644\u0646\u0651\u0650\u0647\u0627\u0626\u0650\u064a\u0651 \u2014 \u0647\u064e\u0644 \u0633\u064e\u062a\u064e\u0633\u0639\u064e\u062f\u064f \u0628\u0627\u0644\u0646\u0651\u064e\u062a\u064a\u062c\u0629\u061f \u0627\u0644\u062d\u064e\u064a\u0627\u0629\u064f \u0627\u0645\u062a\u0650\u062d\u0627\u0646\u064c\u060c \u0648\u064a\u064e\u0648\u0645\u064f \u0627\u0644\u062d\u0650\u0633\u0627\u0628\u0650 \u0627\u0644\u0627\u0645\u062a\u0650\u062d\u0627\u0646\u064f \u0627\u0644\u0623\u062e\u064a\u0631." },
              },
              {
                label: { en: "Moral lesson", ar: "دَرسٌ أخلاقِيّ" },
                content: { en: "Remembering death is not about fear — it is about motivation. Knowing that every day counts pushes us to pray, be kind, seek knowledge, and avoid wasting time. The Prophet ﷺ taught us to prepare for the afterlife while living a full, productive life.", ar: "تَذَكُّرُ المَوتِ لَيسَ خَوفًا بَل دافِعٌ. مَعرِفةُ أنَّ كُلَّ يَومٍ مُهِمٌّ تَدفَعُنا لِلصَّلاةِ والإحسانِ وطَلَبِ العِلم." },
              },
            ],
            task: {
              title: { en: "Write an Analytical Dialogue", ar: "\u0627\u0643\u062a\u064f\u0628 \u062d\u0650\u0648\u0627\u0631\u064b\u0627 \u062a\u064e\u062d\u0644\u064a\u0644\u0650\u064a\u0651\u064b\u0627" },
              description: { en: "Write a dialogue between a Believer and a Denier about resurrection. The Denier uses the argument from verse 10 (\u2018When we are lost in the earth...\u2019).\n\nYour dialogue MUST include:\n\u2022 Qur\u2019an: The Believer must quote verses 10-11 directly and explain what \u2018the Angel of Death will take you\u2019 means.\n\u2022 Hadith: The Believer quotes \u2018Remember often the destroyer of pleasures \u2014 death\u2019 (Tirmidhi) with its source and explains its wisdom.\n\u2022 Logic: The Believer argues \u2014 the One who created from nothing can certainly recreate. You may also quote Ya-Sin 81: \u2018Is not the One who created the heavens and earth able to create the like of them? Yes!\u2019\n\u2022 Life scenario: The Believer uses the \u2018final exam\u2019 analogy \u2014 ignoring the afterlife is like ignoring your biggest exam.\n\u2022 Moral lesson: End with the Believer\u2019s strongest point about why accountability matters and how it motivates good deeds.\n\u2022 Images: Add symbols (a scale of justice, an angel, a clock) to make your dialogue visually engaging for presentation.\nMake the dialogue at least 6 exchanges long.\n\nIMPORTANT: All Qur\u2019an and Hadith must be authentic with their source reference (e.g. Tirmidhi, Bukhari).", ar: "\u0627\u0643\u062a\u064f\u0628 \u062d\u0650\u0648\u0627\u0631\u064b\u0627 \u0628\u064e\u064a\u0646\u064e \u0645\u064f\u0624\u0645\u0650\u0646\u064d \u0648\u0645\u064f\u0646\u0643\u0650\u0631\u064d \u062d\u064e\u0648\u0644\u064e \u0627\u0644\u0628\u064e\u0639\u062b. \u0627\u062c\u0639\u064e\u0644\u0647\u064f \u0666 \u0631\u064f\u062f\u0648\u062f \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u064e\u0644\u0651." },
              hint: { en: "Structure: Denier raises a doubt \u2192 Believer responds with Qur\u2019an/Hadith evidence \u2192 repeat. Include verse references (As-Sajdah 10-11) and Hadith source (Tirmidhi). End with the Believer\u2019s strongest point: \u2018The One who created from nothing can recreate.\u2019 Draw a balance/scale to make it attractive.", ar: "\u0627\u0644\u0647\u064e\u064a\u0643\u064e\u0644: \u0627\u0644\u0645\u064f\u0646\u0643\u0650\u0631\u064f \u064a\u064f\u062b\u064a\u0631\u064f \u0634\u064f\u0628\u0647\u0629\u064b \u2192 \u0627\u0644\u0645\u064f\u0624\u0645\u0650\u0646\u064f \u064a\u064e\u0631\u064f\u062f\u0651\u064f \u0628\u0627\u0644\u062f\u0651\u064e\u0644\u064a\u0644 \u2192 \u062a\u064e\u0643\u0631\u0627\u0631. \u0627\u062e\u062a\u0650\u0645 \u0628\u0623\u0642\u0648\u0649 \u062d\u064f\u062c\u0651\u064e\u0629\u0650 \u0627\u0644\u0645\u064f\u0624\u0645\u0650\u0646." },
            },
          },
          {
            id: "E",
            title: { en: "The Scene of Regret", ar: "\u0645\u064e\u0634\u0647\u064e\u062f\u064f \u0627\u0644\u0646\u0651\u064e\u062f\u064e\u0645" },
            image: IMG.sea,
            color: "rose",
            topic: { en: "Verse 12: The criminals\u2019 plea on the Day of Judgement and its lesson for us today", ar: "\u0627\u0644\u0622\u064a\u0629 \u0661\u0662: \u062a\u064e\u0648\u064e\u0633\u0651\u064f\u0644\u064f \u0627\u0644\u0645\u064f\u062c\u0631\u0650\u0645\u064a\u0646 \u064a\u064e\u0648\u0645\u064e \u0627\u0644\u0642\u0650\u064a\u0627\u0645\u0629 \u0648\u062f\u064e\u0631\u0633\u064f\u0647\u064f \u0644\u064e\u0646\u0627 \u0627\u0644\u064a\u064e\u0648\u0645" },
            infoSections: [
              {
                label: { en: "Qur\u2019an \u2014 As-Sajdah 12", ar: "\u0627\u0644\u0642\u064f\u0631\u0622\u0646 \u2014 \u0627\u0644\u0633\u062c\u062f\u0629 \u0661\u0662" },
                content: { en: "\u00abIf you could but see when the criminals bow their heads before their Lord: \u2018Our Lord, we have seen and heard, so return us; we will do righteousness. Indeed, we are now certain.\u2019\u00bb", ar: "\uFD3F\u0648\u0644\u064e\u0648 \u062a\u064e\u0631\u0649 \u0625\u0650\u0630\u0650 \u0627\u0644\u0645\u064f\u062c\u0631\u0650\u0645\u0648\u0646\u064e \u0646\u0627\u0643\u0650\u0633\u0648 \u0631\u0624\u0648\u0633\u0650\u0647\u0650\u0645 \u0639\u0650\u0646\u062f\u064e \u0631\u064e\u0628\u0651\u0650\u0647\u0650\u0645 \u0631\u064e\u0628\u0651\u064e\u0646\u0627 \u0623\u0628\u0635\u064e\u0631\u0646\u0627 \u0648\u0633\u064e\u0645\u0650\u0639\u0646\u0627 \u0641\u0627\u0631\u062c\u0650\u0639\u0646\u0627 \u0646\u064e\u0639\u0645\u064e\u0644 \u0635\u0627\u0644\u0650\u062d\u064b\u0627 \u0625\u0650\u0646\u0651\u0627 \u0645\u0648\u0642\u0650\u0646\u0648\u0646\uFD3E" },
              },
              {
                label: { en: "Tafsir", ar: "\u062a\u064e\u0641\u0633\u064a\u0631" },
                content: { en: "The bitter irony: in this life they refused to \u2018see and hear\u2019 the truth; on that Day they cry \u2018we have seen and heard!\u2019 The senses of verse 9 finally work \u2014 but too late. Faith forced by seeing is not the faith Allah asked for.", ar: "\u0627\u0644\u0645\u064f\u0641\u0627\u0631\u064e\u0642\u0629\u064f \u0627\u0644\u0645\u064f\u0631\u0651\u0629: \u0641\u064a \u0627\u0644\u062f\u0651\u064f\u0646\u064a\u0627 \u0631\u064e\u0641\u064e\u0636\u0648\u0627 \u0623\u0646 \u064a\u064f\u0628\u0635\u0650\u0631\u0648\u0627 \u0648\u064a\u064e\u0633\u0645\u064e\u0639\u0648\u0627 \u0627\u0644\u062d\u064e\u0642\u0651\u064e\u061b \u0648\u064a\u064e\u0648\u0645\u064e\u0626\u0650\u0630\u064d \u064a\u064e\u0635\u064a\u062d\u0648\u0646\u064e \u00AB\u0623\u0628\u0635\u064e\u0631\u0646\u0627 \u0648\u0633\u064e\u0645\u0650\u0639\u0646\u0627\u00BB. \u062d\u064e\u0648\u0627\u0633\u0651\u064f \u0627\u0644\u0622\u064a\u0629\u0650 \u0669 \u062a\u064e\u0639\u0645\u064e\u0644\u064f \u0623\u062e\u064a\u0631\u064b\u0627 \u2014 \u0644\u0643\u0650\u0646 \u0628\u064e\u0639\u062f\u064e \u0641\u064e\u0648\u0627\u062a\u0650 \u0627\u0644\u0623\u0648\u0627\u0646. \u0627\u0644\u0625\u064a\u0645\u0627\u0646\u064f \u0627\u0644\u0645\u064e\u0641\u0631\u0648\u0636\u064f \u0628\u0627\u0644\u0639\u0650\u064a\u0627\u0646\u0650 \u0644\u064e\u064a\u0633\u064e \u0627\u0644\u0625\u064a\u0645\u0627\u0646\u064e \u0627\u0644\u0630\u064a \u0637\u064e\u0644\u064e\u0628\u064e\u0647\u064f \u0627\u0644\u0644\u0647." },
              },
              {
                label: { en: "Life scenario", ar: "\u0645\u064e\u0648\u0642\u0650\u0641\u064c \u062d\u064e\u064a\u0627\u062a\u0650\u064a\u0651" },
                content: { en: "Imagine you ignored all your teacher\u2019s warnings about an exam. On results day, you wish you had listened. But it\u2019s too late to go back. This is the feeling of verse 12 \u2014 but on the greatest scale: the Day of Judgement.", ar: "\u062a\u064e\u062e\u064e\u064a\u0651\u064e\u0644 \u0623\u0646\u0651\u064e\u0643 \u062a\u064e\u062c\u0627\u0647\u064e\u0644\u062a\u064e \u0643\u064f\u0644\u0651\u064e \u062a\u064e\u062d\u0630\u064a\u0631\u0627\u062a\u0650 \u0645\u064f\u0639\u064e\u0644\u0651\u0650\u0645\u0650\u0643 \u0639\u0646\u0650 \u0627\u0644\u0627\u0645\u062a\u0650\u062d\u0627\u0646. \u064a\u064e\u0648\u0645\u064e \u0627\u0644\u0646\u0651\u064e\u062a\u0627\u0626\u0650\u062c\u0650 \u062a\u064e\u0645\u064e\u0646\u0651\u064e\u064a\u062a\u064e \u0644\u064e\u0648 \u0627\u0633\u062a\u064e\u0645\u064e\u0639\u062a\u064e. \u0644\u0643\u0650\u0646 \u0641\u0627\u062a\u064e \u0627\u0644\u0623\u0648\u0627\u0646. \u0647\u0630\u0627 \u0625\u062d\u0633\u0627\u0633\u064f \u0627\u0644\u0622\u064a\u0629\u0650 \u0661\u0662 \u2014 \u0644\u0643\u0650\u0646 \u0639\u0644\u0649 \u0623\u0639\u0638\u064e\u0645\u0650 \u0645\u0650\u0642\u064a\u0627\u0633: \u064a\u064e\u0648\u0645\u064f \u0627\u0644\u0642\u0650\u064a\u0627\u0645\u0629." },
              },
              {
                label: { en: "Moral lesson", ar: "\u062f\u064e\u0631\u0633\u064c \u0623\u062e\u0644\u0627\u0642\u0650\u064a\u0651" },
                content: { en: "The chance to believe and do good is NOW. Every day is an opportunity the people of verse 12 wish they had. Don\u2019t waste it.", ar: "\u0641\u064f\u0631\u0635\u0629\u064f \u0627\u0644\u0625\u064a\u0645\u0627\u0646\u0650 \u0648\u0627\u0644\u0639\u064e\u0645\u064e\u0644\u0650 \u0627\u0644\u0635\u0651\u0627\u0644\u0650\u062d\u0650 \u0627\u0644\u0622\u0646. \u0643\u064f\u0644\u0651\u064f \u064a\u064e\u0648\u0645\u064d \u0641\u064f\u0631\u0635\u0629\u064c \u064a\u064e\u062a\u064e\u0645\u064e\u0646\u0651\u0627\u0647\u0627 \u0623\u0647\u0644\u064f \u0627\u0644\u0622\u064a\u0629\u0650 \u0661\u0662. \u0644\u0627 \u062a\u064f\u0636\u064e\u064a\u0651\u0650\u0639\u0647\u0627." },
              },
            ],
            task: {
              title: { en: "Write a Reflective Letter", ar: "\u0627\u0643\u062a\u064f\u0628 \u0631\u0650\u0633\u0627\u0644\u0629\u064b \u062a\u064e\u0623\u0645\u0651\u064f\u0644\u0650\u064a\u0651\u0629\u064b" },
              description: { en: "Write a letter titled \u2018A Letter from the Day of Judgement.\u2019 Imagine you are witnessing the scene in verse 12.\n\nYour letter MUST include:\n\u2022 Qur\u2019an: Quote verse 12 directly and explain what \u2018we have seen and heard\u2019 means \u2014 why is it ironic? (Connect to the senses given in verse 9.)\n\u2022 Hadith: Include a relevant Hadith about accountability. For example: \u2018Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death\u2019 (Al-Hakim, Sahih). Always write the source.\n\u2022 Tafsir: Explain the bitter irony \u2014 they refused to see and hear in this life, but on that Day their senses finally work, yet it\u2019s too late.\n\u2022 Life scenario: Compare this to a student who ignores warnings and then begs for a second chance on results day.\n\u2022 Moral lesson: What should we do NOW while we still have time? End with 3 specific actions you will take in your daily life.\n\u2022 Images: Draw or describe the scene (bowed heads, a closed door, a clock running out) to make your letter powerful for presentation.\n\nIMPORTANT: All Qur\u2019an and Hadith must be authentic with their source reference.", ar: "\u0627\u0643\u062a\u064f\u0628 \u0631\u0650\u0633\u0627\u0644\u0629\u064b \u0628\u0639\u064f\u0646\u0648\u0627\u0646: \u00AB\u0631\u0650\u0633\u0627\u0644\u0629\u064c \u0645\u0650\u0646 \u064a\u064e\u0648\u0645\u0650 \u0627\u0644\u0642\u0650\u064a\u0627\u0645\u0629\u00BB. \u062a\u064e\u062e\u064e\u064a\u0651\u064e\u0644 \u0623\u0646\u0651\u064e\u0643 \u062a\u064f\u0634\u0627\u0647\u0650\u062f\u064f \u0645\u064e\u0634\u0647\u064e\u062f\u064e \u0627\u0644\u0622\u064a\u0629\u0650 \u0661\u0662. \u0627\u062e\u062a\u0650\u0645 \u0628\u0650\u0663 \u0623\u0641\u0639\u0627\u0644\u064d \u0633\u064e\u062a\u064e\u062a\u0651\u064e\u062e\u0650\u0630\u064f\u0647\u0627 \u0641\u064a \u062d\u064e\u064a\u0627\u062a\u0650\u0643." },
              hint: { en: "Use emotional language. Quote As-Sajdah 12 directly with the Arabic if possible. The key irony: verse 9 gave humans senses to recognise truth, but the criminals in verse 12 only ‘see and hear’ when it’s too late. Always cite your Hadith source. Draw images of the scene to make your presentation impactful!", ar: "\u0627\u0633\u062a\u064e\u062e\u062f\u0650\u0645 \u0644\u064f\u063a\u0629\u064b \u0645\u064f\u0624\u064e\u062b\u0651\u0650\u0631\u0629\u064b. \u0627\u0642\u062a\u064e\u0628\u0650\u0633 \u0627\u0644\u0622\u064a\u0629\u064e \u0645\u064f\u0628\u0627\u0634\u064e\u0631\u0629\u064b. \u0627\u0631\u0628\u0650\u0637\u0647\u0627 \u0628\u062d\u064e\u064a\u0627\u062a\u0650\u0643\u064e \u0627\u0644\u064a\u064e\u0648\u0645\u0650\u064a\u0651\u0629." },
            },
          },
        ],
        coinsReward: 15,
      },
    },
    {
      title: { en: "Hinge Questions", ar: "أسئلة مِحوَريّة" },
      learningObjectives: [
        { en: "Assess your understanding of As-Sajdah 1-12 and all previous slides.", ar: "قَيِّمْ فَهمَكَ لِسورةِ السجدة ١-١٢ وجَميعِ الشَّرائحِ السّابِقة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A student reviewing the Qur'an.", ar: "طالِبٌ يُراجِعُ القُرآن." },
      },
      hingeQuestions: {
        title: { en: "Hinge Questions — Test Your Understanding", ar: "أسئلة مِحوَريّة — اختَبِرْ فَهمَك" },
        instruction: { en: "Answer all 10 questions based on what you studied in the previous slides and group work. Choose the best answer for each question.", ar: "أجِبْ عن جَميعِ الأسئلةِ العَشرِ بِناءً على ما دَرَستَهُ في الشَّرائحِ السّابِقةِ والعَمَلِ الجَماعِيّ." },
        questions: [
          {
            question: { en: "What does 'Tanzil' (تَنزيل) mean in the context of As-Sajdah verse 2?", ar: "ماذا تَعني «تَنزيل» في سِياقِ الآيةِ ٢ مِنَ السجدة؟" },
            options: [
              { en: "A human composition", ar: "تَأليفٌ بَشَرِيّ" },
              { en: "A divine revelation sent down from Allah", ar: "وَحيٌ إلهِيٌّ أُنزِلَ مِنَ الله" },
              { en: "A historical document", ar: "وَثيقةٌ تاريخيّة" },
              { en: "A collection of poetry", ar: "مَجموعةُ شِعر" },
            ],
            correctIndex: 1,
            explanation: { en: "Tanzil means 'sent down' — the Qur'an is a revelation from the Lord of the worlds, not a human work (As-Sajdah 2).", ar: "تَنزيل تَعني «مُنزَل» — القُرآنُ وَحيٌ مِن رَبِّ العالَمينَ ولَيسَ عَمَلًا بَشَرِيًّا (السجدة ٢)." },
          },
          {
            question: { en: "According to As-Sajdah verse 4, how many days did Allah create the heavens and the earth in?", ar: "وَفقًا لِلآيةِ ٤ مِنَ السجدة، في كَم يَومًا خَلَقَ اللهُ السَّماواتِ والأرض؟" },
            options: [
              { en: "Three days", ar: "ثَلاثةُ أيّام" },
              { en: "Seven days", ar: "سَبعةُ أيّام" },
              { en: "Six days", ar: "سِتَّةُ أيّام" },
              { en: "Ten days", ar: "عَشَرةُ أيّام" },
            ],
            correctIndex: 2,
            explanation: { en: "Allah created the heavens and the earth in six days, then rose over the Throne (As-Sajdah 4).", ar: "خَلَقَ اللهُ السَّماواتِ والأرضَ في سِتَّةِ أيّامٍ ثُمَّ استَوى على العَرش (السجدة ٤)." },
          },
          {
            question: { en: "In verse 7, from what did Allah begin the creation of man?", ar: "في الآيةِ ٧، مِمّ بَدَأَ اللهُ خَلقَ الإنسان؟" },
            options: [
              { en: "Light (Nur)", ar: "نور" },
              { en: "Water", ar: "ماء" },
              { en: "Fire", ar: "نار" },
              { en: "Clay (Tin)", ar: "طين" },
            ],
            correctIndex: 3,
            explanation: { en: "'He began the creation of man from clay' (As-Sajdah 7). Adam was created from clay, showing Allah's power over all materials.", ar: "«بَدَأَ خَلقَ الإنسانِ مِن طين» (السجدة ٧). خُلِقَ آدَمُ مِن طينٍ دَليلًا على قُدرةِ اللهِ على كُلِّ شَيء." },
          },
          {
            question: { en: "What three faculties did Allah give humans according to verse 9?", ar: "ما الحَواسُّ الثَّلاثُ التي وَهَبَها اللهُ لِلإنسانِ بِحَسَبِ الآيةِ ٩؟" },
            options: [
              { en: "Strength, speed, and intelligence", ar: "القُوّة والسُّرعة والذَّكاء" },
              { en: "Hearing, vision, and hearts", ar: "السَّمع والأبصار والأفئِدة" },
              { en: "Touch, taste, and smell", ar: "اللَّمس والتَّذَوُّق والشَّمّ" },
              { en: "Memory, imagination, and speech", ar: "الذّاكِرة والخَيال والكَلام" },
            ],
            correctIndex: 1,
            explanation: { en: "'And made for you hearing, vision, and hearts (af'idah); little are you grateful' (As-Sajdah 9).", ar: "«وجَعَلَ لَكُمُ السَّمعَ والأبصارَ والأفئِدةَ قَليلًا ما تَشكُرون» (السجدة ٩)." },
          },
          {
            question: { en: "Who is described in verse 11 as the one who takes our souls at death?", ar: "مَن هُوَ المَذكورُ في الآيةِ ١١ الذي يَقبِضُ أرواحَنا عِندَ المَوت؟" },
            options: [
              { en: "The Prophet Muhammad ﷺ", ar: "النَّبِيُّ مُحَمَّدٌ ﷺ" },
              { en: "Jibril (Gabriel)", ar: "جِبريل" },
              { en: "The Angel of Death (Malak al-Mawt)", ar: "مَلَكُ المَوت" },
              { en: "Israfil", ar: "إسرافيل" },
            ],
            correctIndex: 2,
            explanation: { en: "'Say: The Angel of Death who has been entrusted with you will take you; then to your Lord you will be returned' (As-Sajdah 11).", ar: "«قُلْ يَتَوَفّاكُم مَلَكُ المَوتِ الذي وُكِّلَ بِكُم ثُمَّ إلى رَبِّكُم تُرجَعون» (السجدة ١١)." },
          },
          {
            question: { en: "In the critical thinking scenario (Slide 1), the factory owner denied divine guidance. Which verse directly refutes his claim that 'nobody is held accountable after death'?", ar: "في سِيناريو التَّفكيرِ النّاقِدِ (الشَّريحة ١)، أنكَرَ صاحِبُ المَصنَعِ الهِدايةَ الإلهيّة. أيُّ آيةٍ تَرُدُّ مُباشَرةً على ادِّعائِهِ أنَّه «لن يُحاسَبَ أحَدٌ بَعدَ المَوت»؟" },
            options: [
              { en: "As-Sajdah 2 — 'The revelation of the Book'", ar: "السجدة ٢ — «تَنزيلُ الكِتاب»" },
              { en: "As-Sajdah 7 — 'He began creation from clay'", ar: "السجدة ٧ — «بَدَأَ خَلقَ الإنسانِ مِن طين»" },
              { en: "As-Sajdah 10-11 — 'Then to your Lord you will be returned'", ar: "السجدة ١٠-١١ — «ثُمَّ إلى رَبِّكُم تُرجَعون»" },
              { en: "As-Sajdah 5 — 'He arranges each matter'", ar: "السجدة ٥ — «يُدَبِّرُ الأمر»" },
            ],
            correctIndex: 2,
            explanation: { en: "Verses 10-11 directly state that the Angel of Death will take every soul and all will be returned to Allah for judgement — refuting the claim of no accountability.", ar: "الآيتان ١٠-١١ تُصَرِّحانِ بِأنَّ مَلَكَ المَوتِ يَقبِضُ كُلَّ روحٍ ويُرجَعُ الجَميعُ إلى اللهِ لِلحِساب." },
          },
          {
            question: { en: "The Hadith 'The best of you are those who learn the Qur'an and teach it' was narrated by which companion collection?", ar: "حَديثُ «خَيرُكُم مَن تَعَلَّمَ القُرآنَ وعَلَّمَه» رَواهُ أيُّ كِتابٍ مِنَ الكُتُبِ السِّتَّة؟" },
            options: [
              { en: "Muslim", ar: "مُسلِم" },
              { en: "Tirmidhi", ar: "التِّرمِذي" },
              { en: "Bukhari", ar: "البُخاري" },
              { en: "Abu Dawud", ar: "أبو داوُد" },
            ],
            correctIndex: 2,
            explanation: { en: "This hadith is narrated by Bukhari — it emphasises the value of learning and teaching the Qur'an.", ar: "هذا الحَديثُ رَواهُ البُخاري — ويُؤَكِّدُ قيمةَ تَعَلُّمِ القُرآنِ وتَعليمِه." },
          },
          {
            question: { en: "In verse 12, what do the criminals say on the Day of Judgement when they bow their heads before Allah?", ar: "في الآيةِ ١٢، ماذا يَقولُ المُجرِمونَ يَومَ القِيامةِ وهُم ناكِسو رُؤوسِهِم عِندَ رَبِّهِم؟" },
            options: [
              { en: "'We were never warned'", ar: "«لَم نُنذَرْ قَطّ»" },
              { en: "'Our Lord, we have seen and heard, so return us; we will do righteousness'", ar: "«رَبَّنا أبصَرنا وسَمِعنا فارجِعنا نَعمَلْ صالِحًا»" },
              { en: "'We had no choice'", ar: "«لَم يَكُنْ لَنا خِيار»" },
              { en: "'Forgive us and let us enter Paradise'", ar: "«اغفِرْ لَنا وأدخِلنا الجَنّة»" },
            ],
            correctIndex: 1,
            explanation: { en: "The criminals plead: 'Our Lord, we have seen and heard, so return us; we will do righteousness. Indeed, we are now certain' (As-Sajdah 12) — but it is too late.", ar: "يَتَوَسَّلُ المُجرِمون: «رَبَّنا أبصَرنا وسَمِعنا فارجِعنا نَعمَلْ صالِحًا إنّا موقِنون» (السجدة ١٢) — لكِنَّ الأوانَ قَد فات." },
          },
          {
            question: { en: "In the Retrieval practise (Slide 2), which keyword was matched to the image of the sky?", ar: "في مُمارَسةِ الاستِرجاعِ (الشَّريحة ٢)، أيُّ كَلِمةٍ طوبِقَت مَعَ صورةِ السَّماء؟" },
            options: [
              { en: "Tanzil (Revelation)", ar: "تَنزيل (وَحي)" },
              { en: "Sajdah (Prostration)", ar: "سَجدة (خُشوع)" },
              { en: "The Heavens (As-Samawat)", ar: "السَّماوات" },
              { en: "Resurrection (Ba'th)", ar: "البَعث" },
            ],
            correctIndex: 2,
            explanation: { en: "The sky image was matched with 'The Heavens (As-Samawat)' — a key sign of Allah's creation mentioned in verse 4.", ar: "طوبِقَت صورةُ السَّماءِ مَعَ «السَّماوات» — وهِيَ آيةٌ مِن آياتِ خَلقِ اللهِ المَذكورةِ في الآيةِ ٤." },
          },
          {
            question: { en: "Why does the Qur'an say 'little are you grateful' after listing the gifts of hearing, sight, and hearts (verse 9)?", ar: "لِماذا يَقولُ القُرآنُ «قَليلًا ما تَشكُرون» بَعدَ ذِكرِ نِعَمِ السَّمعِ والبَصَرِ والأفئِدةِ (الآية ٩)؟" },
            options: [
              { en: "Because humans use their senses for harmful things only", ar: "لِأنَّ الإنسانَ يَستَعمِلُ حَواسَّهُ في الأشياءِ الضّارّةِ فَقَط" },
              { en: "Because humans often fail to use these gifts to recognise Allah's signs and be thankful", ar: "لِأنَّ الإنسانَ غالِبًا ما يُقَصِّرُ في استِعمالِ هذهِ النِّعَمِ لِمَعرِفةِ آياتِ اللهِ والشُّكر" },
              { en: "Because humans cannot hear or see properly", ar: "لِأنَّ الإنسانَ لا يَسمَعُ أو يَرى بِشَكلٍ صَحيح" },
              { en: "Because only prophets are grateful", ar: "لِأنَّ الأنبياءَ فَقَط يَشكُرون" },
            ],
            correctIndex: 1,
            explanation: { en: "Allah gave us hearing, sight, and hearts to recognise the truth and be grateful — but most people fail to use these gifts properly and forget to thank their Creator.", ar: "وَهَبَنا اللهُ السَّمعَ والبَصَرَ والأفئِدةَ لِمَعرِفةِ الحَقِّ والشُّكر — لكِنَّ أكثَرَ النّاسِ يُقَصِّرونَ في استِعمالِها ويَنسَونَ شُكرَ خالِقِهِم." },
          },
        ],
        coinsReward: 20,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Video — Surah As-Sajdah", ar: "فيديو — سورة السجدة" },
      learningObjectives: [
        { en: "Watch and reflect on a visual explanation of Surah As-Sajdah 1-12.", ar: "شاهِدْ وتَأمَّلْ في شَرحٍ مَرئِيٍّ لِسورةِ السجدة ١-١٢." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A student watching an Islamic video.", ar: "طالِبٌ يُشاهِدُ فيديو إسلامِيًّا." },
      },
      youtubeVideo: {
        title: { en: "Watch: Surah As-Sajdah Explained", ar: "شاهِدْ: شرح سورة السجدة" },
        // ← Change this URL to any YouTube video you want
        url: "https://www.youtube.com/watch?v=YfHSMPjOpE8",
        description: { en: "Watch this video about Surah As-Sajdah and reflect on the meanings of the verses you have studied.", ar: "شاهِدْ هذا الفيديو عن سورةِ السجدة وتَأمَّلْ في مَعاني الآياتِ التي دَرَستَها." },
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Plenary", ar: "خِتام الدَّرس" },
      learningObjectives: [
        { en: "Reflect on and share what you learned from As-Sajdah 1-12.", ar: "تَأمَّلْ وشارِكْ ما تَعَلَّمتَهُ مِن سورةِ السجدة ١-١٢." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Students sharing their learning.", ar: "طُلّابٌ يُشارِكونَ ما تَعَلَّموه." },
      },
      plenary: {
        title: { en: "Share Your Learning", ar: "شارِكْ ما تَعَلَّمتَه" },
        instruction: { en: "Scan the QR code or enter the code below to share one thing you learned from this lesson. Your response will appear live for the whole class to see.", ar: "امسَحِ رَمزَ QR أو أدخِلِ الرَّمزَ أدناهُ لِمُشارَكةِ شَيءٍ تَعَلَّمتَهُ مِن هذا الدَّرس. ستَظهَرُ إجابَتُكَ مُباشَرةً لِلصَّفِّ كُلِّه." },
        code: "SAJDAH12",
      },
      body: { en: "", ar: "" },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What central claim does As-Sajdah make about the Qur'an in its opening?", ar: "ما الدَّعوى المِحوَريّةُ التي تُقَرِّرُها سورةُ السَّجدةِ في مَطلَعِها عنِ القُرآن؟" },
      options: [
        { en: "It is revelation (tanzil) from the Lord of the worlds, with no doubt", ar: "أنَّهُ تَنزيلٌ مِن رَبِّ العالَمين لا رَيبَ فيه" },
        { en: "It was composed by the Prophet ﷺ from his own wisdom", ar: "أنَّ النَّبِيَّ ﷺ ألَّفَهُ مِن حِكمَتِه" },
        { en: "It is the finest poetry of the Arabs", ar: "أنَّهُ أجوَدُ شِعرِ العَرَب" },
        { en: "It is a book of history about earlier nations", ar: "أنَّهُ كِتابُ تاريخٍ عنِ الأُمَمِ السّابِقة" },
      ],
      correctIndex: 0,
      explanation: { en: "Verse 2 states the Book is 'tanzil' from the Lord of the worlds, with no doubt about it.", ar: "الآيةُ ٢: الكِتابُ تَنزيلٌ مِن رَبِّ العالَمينَ لا رَيبَ فيه." },
    },
    {
      prompt: { en: "Which evidence does the lesson use to show no human could author the Qur'an?", ar: "ما الدَّليلُ الذي استَعمَلَهُ الدَّرسُ على أنَّ بَشَرًا لا يَقدِرُ على تَأليفِ القُرآن؟" },
      options: [
        { en: "The challenge to produce even one like it (Al-Isra 88) went unmet", ar: "تَحَدّي الإتيانِ بِمِثلِهِ (الإسراء ٨٨) بَقِيَ بِلا جَوابٍ" },
        { en: "It was written down very quickly", ar: "أنَّهُ كُتِبَ بِسُرعةٍ كَبيرة" },
        { en: "No one ever read it", ar: "أنَّهُ لم يَقرَأهُ أحَد" },
        { en: "It used difficult foreign words", ar: "أنَّهُ استَعمَلَ ألفاظًا أعجَميّةً صَعبة" },
      ],
      correctIndex: 0,
      explanation: { en: "The most eloquent Arabs, with every motive, could not match a single surah (Al-Isra 88; Al-Baqarah 23).", ar: "أفصَحُ العَرَبِ ولَدَيهِم كُلُّ الدّافِعِ عَجَزوا عن سورةٍ واحِدة (الإسراء ٨٨؛ البقرة ٢٣)." },
    },
    {
      prompt: { en: "How do Ahl as-Sunnah affirm Allah's istiwa' over the Throne (verse 4)?", ar: "كَيفَ يُثبِتُ أهلُ السُّنّةِ استِواءَ اللهِ على العَرشِ (الآية ٤)؟" },
      options: [
        { en: "As a real attribute befitting His majesty — without tahrif, ta'til, takyif or tamthil", ar: "صِفةً حَقيقيّةً تَليقُ بِجَلالِه — بِلا تَحريفٍ ولا تَعطيلٍ ولا تَكييفٍ ولا تَمثيل" },
        { en: "By denying it has any meaning", ar: "بِنَفيِ أيِّ مَعنًى لَها" },
        { en: "By likening it to a human sitting on a chair", ar: "بِتَشبيهِها بِجُلوسِ إنسانٍ على كُرسِيّ" },
        { en: "By saying we know exactly how it happens", ar: "بِالقَولِ إنّا نَعلَمُ كَيفِيّتَها بِالضَّبط" },
      ],
      correctIndex: 0,
      explanation: { en: "We affirm the meaning and entrust the 'how' to Allah — 'There is nothing like unto Him' (Ash-Shura 11).", ar: "نُثبِتُ المَعنى ونَكِلُ الكَيفَ إلى الله — «لَيسَ كَمِثلِهِ شَيء» (الشورى ١١)." },
    },
    {
      prompt: { en: "In verses 7-9, why does Allah mention hearing, sight and hearts after creating the human?", ar: "في الآياتِ ٧-٩، لِماذا يَذكُرُ اللهُ السَّمعَ والبَصَرَ والأفئِدةَ بَعدَ خَلقِ الإنسان؟" },
      options: [
        { en: "They are the tools to recognise the truth and be grateful for it", ar: "لِأنَّها أدَواتُ إدراكِ الحَقِّ والشُّكرِ عليه" },
        { en: "To prove humans are stronger than angels", ar: "لِيُثبِتَ أنَّ الإنسانَ أقوى مِنَ المَلائِكة" },
        { en: "They have no link to the Book at all", ar: "لِأنَّها لا صِلةَ لَها بالكِتابِ أصلًا" },
        { en: "To describe how the body grows old", ar: "لِيَصِفَ كَيفَ يَهرَمُ الجَسَد" },
      ],
      correctIndex: 0,
      explanation: { en: "The verse ends 'little are you grateful' — the senses are a trust to perceive and obey the truth.", ar: "تَختِمُ الآيةُ «قَليلًا ما تَشكُرون» — فالحَواسُّ أمانةٌ لإدراكِ الحَقِّ والعَمَلِ بِه." },
    },
    {
      prompt: { en: "What is the Qur'an's logical argument that resurrection is certain (verses 10-11)?", ar: "ما حُجّةُ القُرآنِ العَقليّةُ على أنَّ البَعثَ يَقينِيٌّ (الآيتان ١٠-١١)؟" },
      options: [
        { en: "The One who originated creation and takes souls can certainly restore it", ar: "الذي بَدَأ الخَلقَ ويَقبِضُ الأرواحَ قادِرٌ يَقينًا على إعادَتِه" },
        { en: "People must believe with no reason at all", ar: "على النّاسِ أن يُؤمِنوا بِلا سَبَبٍ البَتّة" },
        { en: "Because the deniers admitted it themselves", ar: "لِأنَّ المُنكِرينَ أقَرّوا بِهِ بِأنفُسِهِم" },
        { en: "Because the earth never changes", ar: "لِأنَّ الأرضَ لا تَتَغَيَّرُ أبدًا" },
      ],
      correctIndex: 0,
      explanation: { en: "Originating is harder than repeating; the Creator and Taker of life can surely raise the dead (cf. Ya-Sin 81).", ar: "الابتِداءُ أصعَبُ مِنَ الإعادة؛ وخالِقُ الحَياةِ وقابِضُها قادِرٌ على البَعثِ (انظُر يس ٨١)." },
    },
    {
      prompt: { en: "True or False: As-Sajdah's opening calls only for belief, not for action.", ar: "صَوابٌ أم خَطأ: مَطلَعُ السَّجدةِ يَدعو إلى الإيمانِ فَقَط لا إلى العَمَل." },
      options: [
        { en: "False — it links truth to warning, gratitude, accountability and action before the day of regret", ar: "خَطأ — يَربِطُ الحَقَّ بالإنذارِ والشُّكرِ والمَسؤوليّةِ والعَمَلِ قَبلَ يَومِ النَّدَم" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Verse 12's scene of regret shows belief must become action now, while action is still accepted.", ar: "مَشهَدُ النَّدَمِ في الآيةِ ١٢ يُبَيِّنُ أنَّ الإيمانَ يَجِبُ أن يَصيرَ عَمَلًا الآنَ ما دامَ يُقبَل." },
    },
  ],
};
