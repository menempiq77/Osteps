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
      title: { en: "As-Sajdah 4-9: Creation, Perfection & the Human Being", ar: "السجدة ٤-٩: الخَلقُ والإتقانُ والإنسان" },
      learningObjectives: [
        { en: "Explain how As-Sajdah 4-9 describes Allah's creation of the universe and mankind as evidence of His absolute power.", ar: "أُوَضِّحُ كَيفَ تَصِفُ السجدة ٤-٩ خَلقَ اللهِ لِلكَونِ والإنسانِ دَليلًا على قُدرَتِهِ المُطلَقة." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "The heavens, a sign of Allah's creation.", ar: "السَّماء، آيةٌ مِن آياتِ خَلقِ الله." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an — As-Sajdah 4", ar: "القُرآن — السجدة ٤" },
          lines: [
            { en: "﴾ Allah is the One who created the heavens and the earth and what is between them in six days; then He rose over the Throne. You have not besides Him any protector or any intercessor; so will you not be reminded? ﴿", ar: "﴿اللَّهُ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ وَمَا بَيْنَهُمَا فِي سِتَّةِ أَيَّامٍ ثُمَّ اسْتَوَىٰ عَلَى الْعَرْشِ ۖ مَا لَكُم مِّن دُونِهِ مِن وَلِيٍّ وَلَا شَفِيعٍ ۚ أَفَلَا تَتَذَكَّرُونَ﴾" },
          ],
        },
        {
          label: { en: "Qur'an — As-Sajdah 7-9", ar: "القُرآن — السجدة ٧-٩" },
          lines: [
            { en: "﴾ [He] who perfected everything which He created and began the creation of man from clay. Then He made his posterity out of the extract of a liquid disdained. Then He proportioned him and breathed into him from His [created] soul and made for you hearing and vision and hearts; little are you grateful. ﴿", ar: "﴿الَّذِي أَحْسَنَ كُلَّ شَيْءٍ خَلَقَهُ ۖ وَبَدَأَ خَلْقَ الْإِنسَانِ مِن طِينٍ ۝ ثُمَّ جَعَلَ نَسْلَهُ مِن سُلَالَةٍ مِّن مَّاءٍ مَّهِينٍ ۝ ثُمَّ سَوَّاهُ وَنَفَخَ فِيهِ مِن رُّوحِهِ ۖ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۚ قَلِيلًا مَّا تَشْكُرُونَ﴾" },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet \uFDFA said: \"Indeed, Allah is Beautiful and He loves beauty.\" (Muslim). His creation reflects His perfection — every detail in the heavens and in man is by design.", ar: "قالَ النَّبِيُّ \uFDFA: «إنَّ اللهَ جَميلٌ يُحِبُّ الجَمال» (مسلم). فَخَلقُهُ يَعكِسُ إتقانَهُ — كُلُّ تَفصيلٍ في السَّماواتِ وفي الإنسانِ بِتَقدير." },
          ],
        },
      ],
      body: {
        en: "These verses establish Allah's authority through creation. He made the heavens, earth, and everything between them in six days, then rose over the Throne — the ultimate Sovereign. He perfected everything He created, from the vast cosmos to the human body formed from clay, then given a soul, hearing, sight, and a heart to reason. Yet \u2018little are you grateful\u2019 — a reminder that these gifts demand thankfulness through faith and obedience.",
        ar: "تُؤَسِّسُ هذهِ الآياتُ سُلطانَ اللهِ بِالخَلق. خَلَقَ السَّماواتِ والأرضَ وما بَينَهُما في سِتّةِ أيّامٍ ثُمَّ استَوى على العَرش — السَّيِّدُ المُطلَق. أتقَنَ كُلَّ شَيءٍ خَلَقَه، مِنَ الكَونِ الواسِعِ إلى جَسَدِ الإنسانِ المَصنوعِ مِن طين، ثُمَّ مُنِحَ روحًا وسَمعًا وبَصَرًا وفُؤادًا لِلتَّعَقُّل. ومَعَ ذلِك «قَليلًا ما تَشكُرون» — تَذكيرٌ بِأنَّ هذهِ النِّعَمَ تَستَوجِبُ الشُّكرَ بالإيمانِ والطّاعة.",
      },
      trueFalseActivity: {
        title: { en: "True or False — Test your understanding", ar: "صَحيح أم خَطَأ — اختَبِرْ فَهمَك" },
        questions: [
          { statement: { en: "Allah created the heavens and earth in seven days.", ar: "خَلَقَ اللهُ السَّماواتِ والأرضَ في سَبعةِ أيّام." }, answer: false },
          { statement: { en: "Allah began the creation of man from clay.", ar: "بَدَأَ اللهُ خَلقَ الإنسانِ مِن طين." }, answer: true },
          { statement: { en: "The senses (hearing, sight, hearts) are gifts from Allah mentioned in verse 9.", ar: "الحَواسُّ (السَّمع والبَصَر والأفئِدة) نِعَمٌ مِنَ اللهِ ذُكِرَت في الآيةِ ٩." }, answer: true },
          { statement: { en: "The verse says people are very grateful for these gifts.", ar: "تَقولُ الآيةُ إنَّ النّاسَ شاكِرونَ جِدًّا لِهذهِ النِّعَم." }, answer: false },
          { statement: { en: "Allah arranges every matter from the heaven to the earth (As-Sajdah 5).", ar: "يُدَبِّرُ اللهُ الأمرَ مِنَ السَّماءِ إلى الأرضِ (السجدة ٥)." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the blanks", ar: "املأ الفَراغات" },
        questions: [
          { sentence: { en: "Allah created the heavens and earth in ___ days. (As-Sajdah 4)", ar: "خَلَقَ اللهُ السَّماواتِ والأرضَ في ___ أيّام. (السجدة ٤)" }, answer: { en: "six", ar: "سِتّة" } },
          { sentence: { en: "He began the creation of man from ___. (As-Sajdah 7)", ar: "بَدَأَ خَلقَ الإنسانِ مِن ___. (السجدة ٧)" }, answer: { en: "clay", ar: "طين" } },
          { sentence: { en: "Then He ___ him and breathed into him from His soul. (As-Sajdah 9)", ar: "ثُمَّ ___ ونَفَخَ فيهِ مِن روحِه. (السجدة ٩)" }, answer: { en: "proportioned", ar: "سَوّاه" } },
          { sentence: { en: "And made for you hearing, vision, and ___. (As-Sajdah 9)", ar: "وجَعَلَ لَكُمُ السَّمعَ والأبصارَ و___. (السجدة ٩)" }, answer: { en: "hearts", ar: "الأفئِدة" } },
        ],
        coinsReward: 10,
      },
    },
    {
      title: { en: "The human being created in stages", ar: "خَلقُ الإنسانِ أطوارًا" },
      learningObjectives: [
        { en: "Trace the stages of human creation in verses 7-9 and the purpose of the senses.", ar: "أتَتَبَّعُ أطوارَ خَلقِ الإنسانِ في الآياتِ ٧-٩ ومَقصِدَ الحَواسّ." },
      ],
      image: {
        src: IMG.plantBulb,
        alt: { en: "A growing seedling, a sign of staged creation.", ar: "بُرعُمٌ يَنمو، آيةٌ على الخَلقِ المُتَدَرِّج." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...who perfected everything which He created and began the creation of man from clay. Then He made his posterity out of the extract of a liquid disdained. Then He proportioned him and breathed into him from His [created] soul, and made for you hearing, sight and hearts; little are you grateful.\" — As-Sajdah 7-9", ar: "﴿الَّذِي أَحْسَنَ كُلَّ شَيْءٍ خَلَقَهُ ۖ وَبَدَأَ خَلْقَ الْإِنسَانِ مِن طِينٍ ۝ ثُمَّ جَعَلَ نَسْلَهُ مِن سُلَالَةٍ مِّن مَّاءٍ مَّهِينٍ ۝ ثُمَّ سَوَّاهُ وَنَفَخَ فِيهِ مِن رُّوحِهِ ۖ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۚ قَلِيلًا مَّا تَشْكُرُونَ﴾ — السجدة ٧-٩" },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "شاهِدٌ قُرآنِيّ" },
          lines: [
            { en: "\"We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth.\" — Fussilat 53", ar: "﴿سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ﴾ — فصلت ٥٣" },
          ],
        },
      ],
      callout: {
        label: { en: "Analyse", ar: "حَلِّل" },
        title: { en: "Why mention the senses here?", ar: "لِماذا تُذكَرُ الحَواسُّ هُنا؟" },
        body: {
          en: "The passage ends not with biology but with hearing, sight and hearts (intellect) — then 'little are you grateful'. Why does Allah connect the gift of perception directly to gratitude, in a surah whose whole theme is recognising the truth of His Book?",
          ar: "يَختِمُ المَقطَعُ لا بِبيولوجيا بل بالسَّمعِ والبَصَرِ والأفئِدةِ (العَقل) — ثُمَّ «قَليلًا ما تَشكُرون». لِماذا يَربِطُ اللهُ نِعمةَ الإدراكِ مُباشَرةً بالشُّكر، في سورةٍ مَوضوعُها كُلُّهُ إدراكُ صِدقِ كِتابِه؟",
        },
      },
      body: {
        en: "Verses 7-9 turn the proof inward: look at yourself. First Allah 'perfected everything He created' — creation is not random but excellent and purposeful (itqan). Then the human story unfolds in stages: the first man, Adam, from clay; his descendants from a 'humble fluid'; then a forming and the breathing of the soul; then the gift of hearing, sight and hearts. From dust to a perceiving, reasoning, responsible being — this is a designed ascent, not an accident.\n\nThe sequence is deliberately humbling and elevating at once. Humbling, because our bodily origin is lowly. Elevating, because the same verse credits us with the noblest tools in creation: organs of perception and a heart that reasons and chooses. And then comes the verdict: 'little are you grateful.' The gift of senses is not neutral; it is a trust to be used to recognise the truth (Fussilat 53) and respond to it.\n\nThis is exactly why the senses appear in a surah about the Book. Allah gave you ears to hear His words, eyes to read His signs, and a heart to weigh the evidence. To meet the True Book with closed ears and a sealed heart is the deepest ingratitude; to read it, ponder it and act on it is the gratitude these verses call for.",
        ar: "تُوَجِّهُ الآياتُ ٧-٩ البُرهانَ إلى الدّاخِل: انظُر إلى نَفسِك. أوّلًا «أحسَنَ كُلَّ شَيءٍ خَلَقَه» — فالخَلقُ لَيسَ عَبَثًا بل إتقانٌ ومَقصِد. ثُمَّ تَتَوالى قِصّةُ الإنسانِ أطوارًا: أوّلُ إنسانٍ، آدَم، مِن طين؛ ونَسلُهُ مِن «ماءٍ مَهين»؛ ثُمَّ تَسويةٌ ونَفخُ الرّوح؛ ثُمَّ هِبةُ السَّمعِ والبَصَرِ والأفئِدة. مِنَ التُّرابِ إلى كائِنٍ مُدرِكٍ عاقِلٍ مَسؤول — وهذا ارتِقاءٌ مَقصودٌ لا صُدفة.\n\nوالتَّسَلسُلُ مُذِلٌّ ومُكَرِّمٌ مَعًا. مُذِلٌّ لأنَّ أصلَنا الجَسَدِيَّ وَضيع. ومُكَرِّمٌ لأنَّ الآيةَ نَفسَها تَمنَحُنا أشرَفَ الأدَواتِ في الخَلق: حَواسَّ الإدراكِ وقَلبًا يَعقِلُ ويَختار. ثُمَّ يَأتي الحُكم: «قَليلًا ما تَشكُرون». فَنِعمةُ الحَواسِّ لَيسَت مُحايِدة؛ بل أمانةٌ تُستَعمَلُ لإدراكِ الحَقّ (فصلت ٥٣) والاستِجابةِ لَه.\n\nولِهذا بِالذّاتِ تَظهَرُ الحَواسُّ في سورةٍ عنِ الكِتاب. وهَبَكَ اللهُ أُذُنَينِ لِتَسمَعَ كَلامَه، وعَينَينِ لِتَقرَأَ آياتِه، وقَلبًا لِتَزِنَ الأدِلّة. ولِقاءُ الكِتابِ الحَقِّ بِأُذُنٍ صَمّاءَ وقَلبٍ مَختومٍ أعمَقُ الكُفرانِ؛ وقِراءَتُهُ وتَدَبُّرُهُ والعَمَلُ بِهِ هو الشُّكرُ الذي تَدعو إليه هذه الآيات.",
      },
    },
    {
      title: { en: "Resurrection: answering the deniers", ar: "البَعث: الرَّدُّ على المُنكِرين" },
      learningObjectives: [
        { en: "Reconstruct the Qur'an's logical argument for resurrection from verses 10-11.", ar: "أُعيدُ بِناءَ حُجّةِ القُرآنِ العَقليّةِ على البَعثِ مِنَ الآيتَينِ ١٠-١١." },
      ],
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern, symbol of certainty over doubt.", ar: "فانوسٌ، رَمزُ اليَقينِ على الشَّكّ." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And they say, 'When we are lost within the earth, will we indeed be in a new creation?' Rather, they are, in the meeting with their Lord, disbelievers. Say: The Angel of Death will take you, the one entrusted with you; then to your Lord you will be returned.\" — As-Sajdah 10-11", ar: "﴿وَقَالُوا أَإِذَا ضَلَلْنَا فِي الْأَرْضِ أَإِنَّا لَفِي خَلْقٍ جَدِيدٍ ۚ بَلْ هُم بِلِقَاءِ رَبِّهِمْ كَافِرُونَ ۝ قُلْ يَتَوَفَّاكُم مَّلَكُ الْمَوْتِ الَّذِي وُكِّلَ بِكُمْ ثُمَّ إِلَىٰ رَبِّكُمْ تُرْجَعُونَ﴾ — السجدة ١٠-١١" },
          ],
        },
      ],
      responsePrompt: {
        title: { en: "Construct the argument", ar: "ابنِ الحُجّة" },
        prompt: {
          en: "In a full paragraph, use verses 4-11 to argue why the One who originated creation can certainly restore it. Name at least two divine acts the surah mentions (e.g. creating the heavens, forming the human, taking souls) and show how each one already proves the power to resurrect.",
          ar: "في فِقرةٍ كامِلة، استَعمِلِ الآياتِ ٤-١١ لِتُبَرهِنَ أنَّ مَن بَدَأ الخَلقَ قادِرٌ على إعادَتِه. اذكُرْ فِعلَينِ إلهِيَّينِ على الأقَلِّ تَذكُرُهُما السّورةُ (مِثلَ خَلقِ السَّماواتِ، تَسويةِ الإنسان، قَبضِ الأرواح) وبَيِّنْ كَيفَ يُثبِتُ كُلٌّ مِنها القُدرةَ على البَعث.",
        },
        placeholder: { en: "The One who created the heavens and the earth without prior example...", ar: "الذي خَلَقَ السَّماواتِ والأرضَ بِلا مِثالٍ سابِق..." },
        buttonLabel: { en: "Save response", ar: "احفَظِ الإجابة" },
      },
      body: {
        en: "Now the surah confronts the objection the disbelievers really cared about: life after death. They sneer, 'When we are lost within the earth' — once our bodies have decayed and scattered into the soil — 'will we indeed be in a new creation?' To them, resurrection sounded impossible. The Qur'an answers on two levels.\n\nFirst it diagnoses the real problem: 'Rather, they are, in the meeting with their Lord, disbelievers.' Their issue is not a lack of evidence but a refusal to accept accountability; doubting resurrection is a way of escaping judgement. Then it answers the logic directly: 'The Angel of Death will take you... then to your Lord you will be returned.' The same Power that assigned an angel to take your soul will return you — death is not annihilation but a transfer.\n\nString the surah's argument together and its force appears. The One who created the heavens and earth from nothing, who formed you in stages from clay, who controls every matter and takes every soul — is He then unable to reassemble what He Himself designed? 'Is not the One who created the heavens and earth able to create the like of them? Yes!' (Ya-Sin 81). Originating is harder than repeating; the One who did the harder thing can certainly do the easier. Denial of resurrection is therefore not clever scepticism but a flight from responsibility.",
        ar: "الآنَ تُواجِهُ السّورةُ الاعتِراضَ الذي يَهُمُّ الكُفّارَ حَقًّا: الحَياةَ بَعدَ المَوت. يَسخَرون: «أَإِذا ضَلَلنا في الأرض» — إذا بَلِيَت أجسادُنا وتَناثَرَت في التُّراب — «أَإِنّا لَفي خَلقٍ جَديد؟». بَدا لَهُمُ البَعثُ مُستَحيلًا. فَيُجيبُ القُرآنُ على مُستَوَيَين.\n\nأوّلًا يُشَخِّصُ المُشكِلةَ الحَقيقيّة: «بَل هُم بِلِقاءِ رَبِّهِم كافِرون». فَمُشكِلَتُهُم لَيسَت قِلّةَ دَليلٍ بل رَفضَ المُساءَلة؛ والشَّكُّ في البَعثِ وَسيلةٌ لِلهُروبِ مِنَ الحِساب. ثُمَّ يَرُدُّ على المَنطِقِ مُباشَرةً: «يَتَوَفّاكُم مَلَكُ المَوت... ثُمَّ إلى رَبِّكُم تُرجَعون». فالقُوّةُ التي وَكَّلَت مَلَكًا بِقَبضِ روحِكَ تُرجِعُك — فالمَوتُ لَيسَ فَناءً بل انتِقال.\n\nاجمَعْ حُجّةَ السّورةِ تَظهَرْ قُوَّتُها. الذي خَلَقَ السَّماواتِ والأرضَ مِنَ العَدَم، وسَوّاكَ أطوارًا مِن طين، ويُدَبِّرُ كُلَّ أمرٍ ويَقبِضُ كُلَّ روح — أيَعجِزُ عن إعادةِ ما صَمَّمَهُ بِنَفسِه؟ «أَوَلَيسَ الذي خَلَقَ السَّماواتِ والأرضَ بِقادِرٍ على أن يَخلُقَ مِثلَهُم؟ بَلى!» (يس ٨١). والابتِداءُ أصعَبُ مِنَ الإعادة؛ ومَن فَعَلَ الأصعَبَ يَقدِرُ على الأيسَرِ يَقينًا. فإنكارُ البَعثِ لَيسَ شَكًّا ذَكِيًّا بل فِرارٌ مِنَ المَسؤوليّة.",
      },
    },
    {
      title: { en: "The scene of regret (verse 12)", ar: "مَشهَدُ النَّدَم (الآية ١٢)" },
      learningObjectives: [
        { en: "Interpret the Judgement scene in verse 12 and draw out its warning.", ar: "أُفَسِّرُ مَشهَدَ القِيامةِ في الآيةِ ١٢ وأستَخرِجُ تَحذيرَه." },
      ],
      image: {
        src: IMG.lantern,
        alt: { en: "A single lantern in darkness, like a final plea for light.", ar: "فانوسٌ وَحيدٌ في الظَّلام، كَتَوَسُّلٍ أخيرٍ لِلنّور." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"If you could but see when the criminals are bowing their heads before their Lord, [saying], 'Our Lord, we have seen and heard, so return us; we will do righteousness. Indeed, we are now certain.'\" — As-Sajdah 12", ar: "﴿وَلَوْ تَرَىٰ إِذِ الْمُجْرِمُونَ نَاكِسُو رُءُوسِهِمْ عِندَ رَبِّهِمْ رَبَّنَا أَبْصَرْنَا وَسَمِعْنَا فَارْجِعْنَا نَعْمَلْ صَالِحًا إِنَّا مُوقِنُونَ﴾ — السجدة ١٢" },
          ],
        },
        {
          label: { en: "Tafsir note", ar: "فائدةٌ تَفسيريّة" },
          lines: [
            { en: "Mufassirun observe the bitter irony: in the world they refused to 'see and hear' the signs; on that Day they cry 'we have seen and heard'. The very faculties of verses 9 finally work — but too late, when action is no longer accepted.", ar: "يُلاحِظُ المُفَسِّرونَ المُفارَقةَ المُرّة: في الدُّنيا رَفَضوا أن «يُبصِروا ويَسمَعوا» الآيات؛ ويَومَئذٍ يَصيحون «أبصَرنا وسَمِعنا». فَحَواسُّ الآيةِ التّاسِعةِ تَعمَلُ أخيرًا — لكِن بَعدَ فَواتِ الأوان، حينَ لا يُقبَلُ العَمَل." },
          ],
        },
      ],
      callout: {
        label: { en: "Critical thinking", ar: "تَفكيرٌ ناقِد" },
        title: { en: "Why is their plea rejected?", ar: "لِماذا تُرَدُّ مَناشَدَتُهُم؟" },
        body: {
          en: "On that Day the deniers finally say 'we are now certain' and beg to return. Yet faith forced by seeing the unseen is not the faith Allah asked for. Discuss: what is the moral value of believing and obeying now, on the basis of evidence, rather than later, on the basis of sight?",
          ar: "يَومَئذٍ يَقولُ المُنكِرون أخيرًا «إنّا موقِنون» ويَتَوَسَّلونَ الرُّجوع. لكِنَّ إيمانًا تَفرِضُهُ مُعايَنةُ الغَيبِ لَيسَ هو الإيمانَ الذي طَلَبَهُ الله. ناقِشْ: ما القيمةُ الأخلاقيّةُ لِلإيمانِ والطّاعةِ الآنَ على أساسِ الدَّليل، لا لاحِقًا على أساسِ العِيان؟",
        },
      },
      body: {
        en: "The opening of As-Sajdah closes with a scene designed to move the heart. Imagine the criminals on the Day of Judgement, heads bowed in humiliation before their Lord, pleading: 'Our Lord, we have seen and heard, so return us; we will do righteousness. Indeed, we are now certain.' Everything they denied is now undeniable to them — but the door of action has shut.\n\nThe tragedy is precise. In the world they were given hearing, sight and hearts (verse 9) and a clear, doubt-free Book (verse 2), yet they would not truly see or hear. Now their certainty is complete and useless, because the test of this life was to believe in the unseen on the strength of evidence, not to be compelled by seeing the unseen itself. Their request to 'return and do righteousness' is exactly the chance they are squandering right now, while alive.\n\nThis is why the passage is not abstract theology but an urgent appeal to you, the reader. The Book is true (v.2-3); its Author created and controls everything (v.4-5); He fashioned you and gave you the means to recognise the truth (v.7-9); He will certainly raise you (v.10-11); and there will be a moment of final regret for those who delayed (v.12). The only wise response is to read the Qur'an with understanding, believe its reports, obey its commands, and turn to Allah today — before the day when 'return us' is answered with silence.",
        ar: "يُختَمُ مَطلَعُ السَّجدةِ بِمَشهَدٍ يُحَرِّكُ القَلب. تَخَيَّلِ المُجرِمينَ يَومَ القِيامةِ ناكِسي رُؤوسِهِم ذِلّةً عِندَ رَبِّهِم يَتَوَسَّلون: «رَبَّنا أبصَرنا وسَمِعنا فارجِعنا نَعمَلْ صالِحًا إنّا موقِنون». فَكُلُّ ما أنكَروهُ صارَ لا يُنكَر — لكِنَّ بابَ العَمَلِ أُغلِق.\n\nوالمَأساةُ دَقيقة. في الدُّنيا أُعطوا السَّمعَ والبَصَرَ والأفئِدةَ (الآية ٩) وكِتابًا بَيِّنًا لا رَيبَ فيه (الآية ٢)، فأبَوا أن يُبصِروا أو يَسمَعوا حَقًّا. والآنَ يَقينُهُم تامٌّ لا يَنفَع، لأنَّ امتِحانَ الحَياةِ كانَ الإيمانَ بالغَيبِ بِقُوّةِ الدَّليل، لا الإكراهَ بِمُعايَنةِ الغَيب. وطَلَبُهُمُ «الرُّجوعَ لِيَعمَلوا صالِحًا» هو بِعَينِهِ الفُرصةُ التي يُضَيِّعونَها الآنَ وهُم أحياء.\n\nلِذا فالمَقطَعُ لَيسَ لاهوتًا مُجَرَّدًا بل نِداءٌ عاجِلٌ لَكَ أنتَ القارِئ. الكِتابُ حَقٌّ (٢-٣)؛ ومُؤَلِّفُهُ خَلَقَ كُلَّ شَيءٍ ويُدَبِّرُه (٤-٥)؛ وصَوَّرَكَ ووَهَبَكَ أدَواتِ إدراكِ الحَقّ (٧-٩)؛ وسَيَبعَثُكَ يَقينًا (١٠-١١)؛ وهُناكَ لَحظةُ نَدَمٍ أخيرةٍ لِمَن سَوَّف (١٢). فالمَوقِفُ الحَكيمُ الوَحيدُ أن تَقرَأ القُرآنَ بِفَهم، وتُصَدِّقَ خَبَرَه، وتَمتَثِلَ أمرَه، وتُقبِلَ على اللهِ اليَوم — قَبلَ يَومٍ يُقابَلُ فيهِ «فارجِعنا» بالصَّمت.",
      },
    },
    {
      title: { en: "Synthesis & collaborative analysis", ar: "تَركيبٌ وتَحليلٌ جَماعِيّ" },
      learningObjectives: [
        { en: "Synthesise the argument of As-Sajdah 1-12 into a single connected case.", ar: "أُرَكِّبُ حُجّةَ السجدة ١-١٢ في بُرهانٍ واحِدٍ مُتَّصِل." },
        { en: "Apply the surah's logic to a contemporary doubt.", ar: "أُطَبِّقُ مَنطِقَ السّورةِ على شُبهةٍ مُعاصِرة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque, where the Qur'an is recited and lived.", ar: "مَسجِدٌ، يُتلى فيهِ القُرآنُ ويُعاشُ بِه." },
      },
      matchingActivity: {
        title: { en: "Match the verse to the proof it provides", ar: "طابِقِ الآيةَ بالبُرهانِ الذي تُقَدِّمُه" },
        instruction: { en: "Each verse contributes one link in the surah's argument. Match each to what it establishes.", ar: "كُلُّ آيةٍ تُسهِمُ بِحَلقةٍ في حُجّةِ السّورة. طابِقْ كُلًّا بِما تُقَرِّرُه." },
        prompts: [
          { prompt: { en: "As-Sajdah 2 ('no doubt... from the Lord of the worlds')", ar: "السجدة ٢ («لا رَيب... مِن رَبِّ العالَمين»)" }, answer: { en: "The Book is certain revelation, not human invention.", ar: "الكِتابُ وَحيٌ يَقينِيٌّ لا اختِلاقَ بَشَر." } },
          { prompt: { en: "As-Sajdah 4 (creation + istiwa' over the Throne)", ar: "السجدة ٤ (الخَلقُ والاستِواءُ على العَرش)" }, answer: { en: "The Author is the absolute Owner and Ruler of all.", ar: "المُؤَلِّفُ هو المالِكُ المُدَبِّرُ المُطلَقُ لِكُلِّ شَيء." } },
          { prompt: { en: "As-Sajdah 7-9 (clay, then soul, then senses)", ar: "السجدة ٧-٩ (طينٌ ثُمَّ روحٌ ثُمَّ حَواسّ)" }, answer: { en: "Humans were equipped to recognise the truth and be grateful.", ar: "زُوِّدَ الإنسانُ لِيُدرِكَ الحَقَّ ويَشكُر." } },
          { prompt: { en: "As-Sajdah 10-11 (the Angel of Death returns souls)", ar: "السجدة ١٠-١١ (مَلَكُ المَوتِ يَرُدُّ الأرواح)" }, answer: { en: "The One who originates and takes life can certainly resurrect.", ar: "مَن بَدَأ الخَلقَ وقَبَضَ الرّوحَ قادِرٌ على البَعث." } },
        ],
      },
      groupTasks: {
        title: { en: "Group inquiry: build the case", ar: "تَحَرٍّ جَماعِيّ: ابنِ الحُجّة" },
        instruction: { en: "In groups, produce a one-page argument. Use the verses as evidence and write in your own words.", ar: "في مَجموعاتٍ، أنتِجوا حُجّةً مِن صَفحةٍ واحِدة. استَعمِلوا الآياتِ دَليلًا واكتُبوا بِأسلوبِكُم." },
        groups: [
          {
            slug: "authenticity",
            name: { en: "Team A: Origin of the Book", ar: "الفَريقُ أ: مَصدَرُ الكِتاب" },
            learningObjective: { en: "Argue that the Qur'an is divine revelation.", ar: "البَرهَنةُ على أنَّ القُرآنَ وَحيٌ إلهِيّ." },
            task: { en: "Present three reasons (verses 2-3, the failed challenge of Al-Isra 88, and the Prophet's ﷺ character) that the Qur'an cannot be human-authored.", ar: "اعرِضوا ثَلاثةَ أسبابٍ (الآيتان ٢-٣، وعَجزُ التَّحَدّي في الإسراء ٨٨، وخُلُقُ النَّبِيِّ ﷺ) على أنَّ القُرآنَ لا يُمكِنُ أن يَكونَ مِن تَأليفِ بَشَر." },
            evidence: [
              { en: "As-Sajdah 2-3", ar: "السجدة ٢-٣" },
              { en: "Al-Isra 88; Al-Baqarah 23", ar: "الإسراء ٨٨؛ البقرة ٢٣" },
            ],
            sourceNotes: [
              { en: "Tafsir Ibn Kathir on As-Sajdah 1-3.", ar: "تَفسيرُ ابنِ كثيرٍ لِلسجدة ١-٣." },
            ],
            memberRoles: [
              { en: "Lead writer", ar: "الكاتِبُ الرَّئيس" },
              { en: "Evidence checker", ar: "مُدَقِّقُ الأدِلّة" },
              { en: "Presenter", ar: "العارِض" },
            ],
            finalProduct: { en: "A three-point spoken argument with verse references.", ar: "حُجّةٌ شَفَهيّةٌ مِن ثَلاثِ نِقاطٍ مَعَ الإحالاتِ القُرآنيّة." },
          },
          {
            slug: "resurrection",
            name: { en: "Team B: Reality of resurrection", ar: "الفَريقُ ب: حَقيقةُ البَعث" },
            learningObjective: { en: "Argue that resurrection is rationally certain.", ar: "البَرهَنةُ على أنَّ البَعثَ يَقينِيٌّ عَقلًا." },
            task: { en: "Using verses 4-11, answer a modern sceptic who says resurrection is impossible because bodies decay.", ar: "بِالآياتِ ٤-١١، أجيبوا مُشَكِّكًا مُعاصِرًا يَقولُ إنَّ البَعثَ مُستَحيلٌ لِأنَّ الأجسادَ تَبلى." },
            evidence: [
              { en: "As-Sajdah 4-5, 10-11", ar: "السجدة ٤-٥، ١٠-١١" },
              { en: "Ya-Sin 78-81", ar: "يس ٧٨-٨١" },
            ],
            sourceNotes: [
              { en: "Tafsir as-Sa'di on resurrection arguments.", ar: "تَفسيرُ السعديِّ في أدِلّةِ البَعث." },
            ],
            memberRoles: [
              { en: "Lead writer", ar: "الكاتِبُ الرَّئيس" },
              { en: "Counter-argument analyst", ar: "مُحَلِّلُ الاعتِراض" },
              { en: "Presenter", ar: "العارِض" },
            ],
            finalProduct: { en: "A short rebuttal that turns the sceptic's point into proof of Allah's power.", ar: "رَدٌّ مُختَصَرٌ يُحَوِّلُ نُقطةَ المُشَكِّكِ إلى دَليلٍ على قُدرةِ الله." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final reflection", ar: "التَّأمُّلُ الخِتامِيّ" },
        prompt: {
          en: "Surat As-Sajdah moves from 'the Book is true' to 'so live by it.' Write a personal, evidence-based reflection: which single verse from 1-12 most changes how you will treat the Qur'an this week, and what specific action will you take?",
          ar: "تَنتَقِلُ سورةُ السَّجدةِ مِن «الكِتابُ حَقّ» إلى «فَعِشْ بِه». اكتُبْ تَأمُّلًا شَخصِيًّا مُؤَسَّسًا على الدَّليل: أيُّ آيةٍ مِن ١-١٢ تُغَيِّرُ أكثَرَ مِن غَيرِها طَريقةَ تَعامُلِكَ مَعَ القُرآنِ هذا الأُسبوع، وما الفِعلُ المُحَدَّدُ الذي ستَقومُ بِه؟",
        },
        placeholder: { en: "The verse that changes me most is... and this week I will...", ar: "أكثَرُ آيةٍ تُغَيِّرُني هي... وهذا الأُسبوعَ سَوفَ..." },
        buttonLabel: { en: "Save reflection", ar: "احفَظِ التَّأمُّل" },
      },
      body: {
        en: "Bring the twelve verses together as one connected argument, because seeing the structure is itself a proof. As-Sajdah does not throw separate ideas at us; it builds a chain: (1) the Book is certain truth from the Lord of the worlds; (2) its Author created and governs the entire universe; (3) the same Author designed you in stages and gave you hearing, sight and a reasoning heart so you could recognise that truth; (4) therefore the One who originated you can and will raise you again; (5) and on that Day, regret will come to those who ignored the warning. Belief and action are two halves of one response.\n\nA strong student does not just admire this argument — they can use it. The matching task asks you to pin each verse to the precise link it provides in the chain. The group inquiry asks you to defend two of the surah's claims against real objections, exactly as the surah defends itself against the Makkans. And the final reflection turns the lesson back on you: the Qur'an was revealed 'that you may warn' and be warned, so the proper end of studying As-Sajdah is not a mark but a changed life.\n\nThis is the standard expected of you in this course: read the words precisely, understand the scholars' explanations, weigh objections honestly, and let authentic knowledge shape action. The True Book asks nothing less.",
        ar: "اجمَعِ الآياتِ الاثنَتَي عَشْرةَ في حُجّةٍ واحِدةٍ مُتَّصِلة، فَرُؤيةُ البِناءِ نَفسِها بُرهان. لا تُلقي السَّجدةُ علينا أفكارًا مُتَفَرِّقة؛ بل تَبني سِلسِلة: (١) الكِتابُ حَقٌّ يَقينِيٌّ مِن رَبِّ العالَمين؛ (٢) ومُؤَلِّفُهُ خَلَقَ الكَونَ كُلَّهُ ويُدَبِّرُه؛ (٣) والمُؤَلِّفُ نَفسُهُ صَمَّمَكَ أطوارًا ووَهَبَكَ السَّمعَ والبَصَرَ وقَلبًا يَعقِلُ لِتُدرِكَ ذلك الحَقّ؛ (٤) فالذي بَدَأكَ يَقدِرُ على بَعثِكَ وسَيَبعَثُك؛ (٥) ويَومَئذٍ يَأتي النَّدَمُ لِمَن أهمَلَ الإنذار. فالإيمانُ والعَمَلُ نِصفا استِجابةٍ واحِدة.\n\nوالطّالِبُ القَوِيُّ لا يُعجَبُ بالحُجّةِ فَحَسب — بل يُحسِنُ استِعمالَها. تَطلُبُ مِنكَ المُطابَقةُ أن تُثَبِّتَ كُلَّ آيةٍ بالحَلقةِ الدَّقيقةِ التي تُقَدِّمُها في السِّلسِلة. ويَطلُبُ التَّحَرّي الجَماعِيُّ أن تُدافِعَ عن دَعوَيَينِ مِنَ السّورةِ أمامَ اعتِراضاتٍ حَقيقيّة، كما دافَعَتِ السّورةُ عن نَفسِها أمامَ أهلِ مَكّة. ويَرُدُّ التَّأمُّلُ الخِتامِيُّ الدَّرسَ إليك: أُنزِلَ القُرآنُ «لِتُنذِرَ» وتُنذَر، فَغايةُ دِراسةِ السَّجدةِ لَيسَت دَرَجةً بل حَياةً تَتَغَيَّر.\n\nهذا هو المُستوى المُتَوَقَّعُ مِنكَ في هذا المِنهاج: اقرَأِ الكَلِماتِ بِدِقّة، وافهَمْ شَرحَ العُلَماء، وزِنِ الاعتِراضاتِ بِإنصاف، ودَعِ العِلمَ الصَّحيحَ يَصوغُ العَمَل. الكِتابُ الحَقُّ لا يَطلُبُ أقَلَّ مِن ذلك.",
      },
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
