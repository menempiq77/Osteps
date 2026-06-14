import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const theTrueBook: CourseLesson = {
  slug: "g6y7-the-true-book-as-sajdah-1-12",
  name: { en: "The True Book (As-Sajdah 1-12)", ar: "الكِتابُ الحَقُّ (السجدة ١-١٢)" },
  shortIntro: {
    en: "The opening of Surat As-Sajdah affirms that the Qur'an is revealed truth from the Lord of the worlds, and answers those who doubt it.",
    ar: "تُؤَكِّدُ بِدايةُ سورةِ السَّجدةِ أنَّ القُرآنَ حَقٌّ مُنَزَّلٌ مِن رَبِّ العالَمين، وتَرُدُّ على المُشَكِّكينَ فيه.",
  },
  quranSurahs: ["As-Sajdah 1-12"],
  sections: [
    {
      title: { en: "Retrieval & big question", ar: "استِرجاعٌ وسُؤالٌ كَبير" },
      learningObjectives: [
        { en: "Recall what we mean when we say the Qur'an is 'revelation' (wahy).", ar: "أستَرجِعُ مَعنى أنَّ القُرآنَ «وَحيٌ» مُنَزَّل." },
        { en: "Frame the central claim of Surat As-Sajdah: the Book is truth from Allah.", ar: "أُحَدِّدُ الدَّعوى المِحوَريّةَ في سورةِ السَّجدة: أنَّ الكِتابَ حَقٌّ مِنَ الله." },
      ],
      successCriteria: [
        { en: "I can explain the difference between a human book and divine revelation.", ar: "أُمَيِّزُ بَينَ كِتابٍ بَشَرِيٍّ ووَحيٍ إلهِيّ." },
        { en: "I can state who revealed the Qur'an and to whom.", ar: "أذكُرُ مَن أنزَلَ القُرآنَ وعلى مَن." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "An open copy of the Qur'an.", ar: "مُصحَفٌ مَفتوح." },
        caption: { en: "Surat As-Sajdah opens by affirming the source of the Qur'an.", ar: "تَفتَتِحُ سورةُ السَّجدةِ بِتَأكيدِ مَصدَرِ القُرآن." },
      },
      callout: {
        label: { en: "Think", ar: "فَكِّر" },
        title: { en: "How do we know the Qur'an is from Allah?", ar: "كَيفَ نَعلَمُ أنَّ القُرآنَ مِنَ الله؟" },
        body: {
          en: "Some people in Makkah said the Prophet ﷺ wrote the Qur'an himself. What evidence shows that it is revelation from the Lord of the worlds, not the words of a human?",
          ar: "زَعَمَ بَعضُ أهلِ مَكّةَ أنَّ النَّبِيَّ ﷺ ألَّفَ القُرآنَ بِنَفسِه. ما الأدِلّةُ على أنَّهُ وَحيٌ مِن رَبِّ العالَمين، لا كَلامُ بَشَر؟",
        },
      },
      body: {
        en: "Surat As-Sajdah is a Makkan surah. Its first verses face a serious accusation head-on: the disbelievers claimed the Prophet ﷺ invented the Qur'an. Allah replies clearly that there is 'no doubt' it is revelation from the Lord of the worlds. In this lesson we study verses 1-12 and the proofs they give for the truth of the Book.",
        ar: "سورةُ السَّجدةِ مَكِّيّة. تُواجِهُ آياتُها الأولى تُهمةً خَطيرةً مُباشَرةً: ادَّعى الكُفّارُ أنَّ النَّبِيَّ ﷺ افتَرى القُرآن. فَيَرُدُّ اللهُ بِوُضوحٍ أنَّهُ «لا رَيبَ» أنَّهُ تَنزيلٌ مِن رَبِّ العالَمين. وفي هذا الدَّرسِ نَدرُسُ الآياتِ ١-١٢ وما فيها مِن أدِلّةٍ على صِدقِ الكِتاب.",
      },
    },
    {
      title: { en: "No doubt — it is from the Lord of the worlds", ar: "لا رَيبَ — إنَّهُ مِن رَبِّ العالَمين" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A vast sky, sign of the Lord of the worlds.", ar: "سَماءٌ واسِعةٌ، آيةٌ على رَبِّ العالَمين." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"The revelation of the Book — about which there is no doubt — is from the Lord of the worlds.\" — As-Sajdah 2", ar: "﴿تَنزِيلُ الْكِتَابِ لَا رَيْبَ فِيهِ مِن رَّبِّ الْعَالَمِينَ﴾ — السجدة ٢" },
            { en: "\"Or do they say, 'He invented it'? Rather, it is the truth from your Lord, that you may warn a people...\" — As-Sajdah 3", ar: "﴿أَمْ يَقُولُونَ افْتَرَاهُ ۚ بَلْ هُوَ الْحَقُّ مِن رَّبِّكَ لِتُنذِرَ قَوْمًا...﴾ — السجدة ٣" },
          ],
        },
      ],
      body: {
        en: "Allah names the Qur'an 'the Book' and removes all doubt about its origin: it is 'tanzil' (a sending-down) from the Lord of the worlds. Verse 3 quotes the accusation 'he invented it' and rejects it with 'Rather, it is the truth'. The purpose is also given: to warn a people who had received no warner before, so they may be guided. The Qur'an does not merely inform — it calls to action and accountability.",
        ar: "يُسَمّي اللهُ القُرآنَ «الكِتاب» ويَنفي كُلَّ رَيبٍ في أصلِه: إنَّهُ «تَنزيلٌ» مِن رَبِّ العالَمين. وتَنقُلُ الآيةُ الثّالِثةُ تُهمةَ «افتَراه» ثُمَّ تَرُدُّها بِـ«بَل هو الحَقّ». ويُذكَرُ المَقصِدُ أيضًا: إنذارُ قَومٍ لم يَأتِهِم نَذيرٌ مِن قَبلُ لَعَلَّهُم يَهتَدون. فالقُرآنُ لا يُخبِرُ فَحَسب، بل يَدعو إلى العَمَلِ والمَسؤوليّة.",
      },
    },
    {
      title: { en: "The Creator of the heavens, then the Throne", ar: "خالِقُ السَّماواتِ ثُمَّ استَوى على العَرش" },
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Mountains and sky, signs of creation.", ar: "جِبالٌ وسَماء، آياتٌ على الخَلق." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"Allah is the One who created the heavens and the earth and what is between them in six days; then He rose over the Throne...\" — As-Sajdah 4", ar: "﴿اللَّهُ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ وَمَا بَيْنَهُمَا فِي سِتَّةِ أَيَّامٍ ثُمَّ اسْتَوَىٰ عَلَى الْعَرْشِ...﴾ — السجدة ٤" },
          ],
        },
      ],
      body: {
        en: "The surah moves from the truth of the Book to the greatness of its Author. Allah created the heavens, the earth, and all between them, and He governs the whole of creation. The same Lord who made and runs the universe is the One who sent the Qur'an — so His Book deserves to be taken seriously. Ahl as-Sunnah affirm Allah's rising over the Throne (istiwa') as it befits His majesty, without likening Him to His creation and without asking 'how'.",
        ar: "تَنتَقِلُ السّورةُ مِن صِدقِ الكِتابِ إلى عَظَمةِ مَن أنزَلَه. خَلَقَ اللهُ السَّماواتِ والأرضَ وما بَينَهُما، وهو يُدَبِّرُ الخَلقَ كُلَّه. والرَّبُّ الذي خَلَقَ الكَونَ ودَبَّرَهُ هو الذي أنزَلَ القُرآن، فَكِتابُهُ جَديرٌ بِأن يُؤخَذَ بِجِدّ. ويُثبِتُ أهلُ السُّنّةِ استِواءَ اللهِ على العَرشِ كما يَليقُ بِجَلالِه، مِن غَيرِ تَشبيهٍ ولا تَكييف.",
      },
    },
    {
      title: { en: "How humans were created in stages", ar: "كَيفَ خُلِقَ الإنسانُ أطوارًا" },
      image: {
        src: IMG.plantBulb,
        alt: { en: "A growing seedling, a sign of staged creation.", ar: "بُرعُمٌ يَنمو، آيةٌ على الخَلقِ المُتَدَرِّج." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...He began the creation of man from clay. Then He made his offspring from an extract of a liquid disdained. Then He proportioned him and breathed into him of His [created] soul...\" — As-Sajdah 7-9", ar: "﴿...وَبَدَأَ خَلْقَ الْإِنسَانِ مِن طِينٍ ۝ ثُمَّ جَعَلَ نَسْلَهُ مِن سُلَالَةٍ مِّن مَّاءٍ مَّهِينٍ ۝ ثُمَّ سَوَّاهُ وَنَفَخَ فِيهِ مِن رُّوحِهِ...﴾ — السجدة ٧-٩" },
          ],
        },
      ],
      body: {
        en: "Verses 7-9 describe the creation of the human being in stages: the first human from clay, then his descendants from a humble fluid, then Allah forms and gives him hearing, sight, and hearts (intellect). The verse ends: 'little are you grateful.' The lesson for us is clear — Allah gave us senses and minds precisely so that we would recognise the truth of His Book and be thankful, not heedless.",
        ar: "تَصِفُ الآياتُ ٧-٩ خَلقَ الإنسانِ أطوارًا: أوَّلُ إنسانٍ مِن طين، ثُمَّ نَسلُهُ مِن ماءٍ مَهين، ثُمَّ سَوّاهُ اللهُ وجَعَلَ لَهُ السَّمعَ والبَصَرَ والأفئِدة. وتَختِمُ الآيةُ: «قَليلًا ما تَشكُرون». والدَّرسُ واضِح: وهَبَنا اللهُ الحَواسَّ والعُقولَ لِنُدرِكَ صِدقَ كِتابِهِ ونَشكُرَهُ لا لِنَغفُل.",
      },
    },
    {
      title: { en: "The deniers of resurrection answered", ar: "الرَّدُّ على مُنكِري البَعث" },
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern, symbol of certainty over doubt.", ar: "فانوسٌ، رَمزُ اليَقينِ على الشَّكّ." },
      },
      callout: {
        label: { en: "Analyse", ar: "حَلِّل" },
        title: { en: "'When we are lost in the earth...'", ar: "«أَإِذا ضَلَلنا في الأرض...»" },
        body: {
          en: "Verse 10 reports the deniers asking how they can be created anew after their bodies have mixed with the soil. How does the surah's emphasis on Allah as Creator and Controller already answer this doubt?",
          ar: "تَنقُلُ الآيةُ العاشِرةُ سُؤالَ المُنكِرينَ كَيفَ يُبعَثونَ بعدَ أن تَختَلِطَ أجسادُهُم بالتُّراب. كَيفَ يُجيبُ تَأكيدُ السّورةِ على أنَّ اللهَ خالِقٌ مُدَبِّرٌ عن هذا الشَّكِّ أصلًا؟",
        },
      },
      responsePrompt: {
        title: { en: "Your reasoned answer", ar: "إجابَتُكَ المُعَلَّلة" },
        prompt: {
          en: "Explain, using verses 4-11, why the One who created from nothing can certainly raise the dead.",
          ar: "اشرَحْ مُستَعينًا بالآياتِ ٤-١١ لِماذا يَقدِرُ مَن خَلَقَ مِنَ العَدَمِ على بَعثِ المَوتى يَقينًا.",
        },
        placeholder: { en: "The One who created the heavens...", ar: "الذي خَلَقَ السَّماواتِ..." },
        buttonLabel: { en: "Save response", ar: "احفَظِ الإجابة" },
      },
      body: {
        en: "Verses 10-11 answer the deniers of resurrection. They asked how they could be recreated after death; Allah replies that the Angel of Death, who is in charge of taking souls, will return them to their Lord. The logic running through the whole passage is powerful: the One with the power to originate creation and to take souls certainly has the power to bring people back for judgement.",
        ar: "تَرُدُّ الآيتانِ ١٠-١١ على مُنكِري البَعث. سَألوا كَيفَ يُعادونَ بعدَ المَوت، فَيُجيبُ اللهُ أنَّ مَلَكَ المَوتِ المُوَكَّلَ بِقَبضِ الأرواحِ يَرُدُّهُم إلى رَبِّهِم. والمَنطِقُ الجاري في المَقطَعِ قَوِيّ: القادِرُ على بَدءِ الخَلقِ وقَبضِ الأرواحِ قادِرٌ يَقينًا على إعادةِ النّاسِ للحِساب.",
      },
    },
    {
      title: { en: "Reflection: living by the True Book", ar: "تأمُّل: العَيشُ بالكِتابِ الحَقّ" },
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque, where the Qur'an is recited and lived.", ar: "مَسجِدٌ، يُتلى فيهِ القُرآنُ ويُعاشُ بِه." },
      },
      body: {
        en: "Verse 12 paints the scene of the deniers on the Day of Judgement, lowering their heads and begging to be returned to do good — but the time for action will be over. The opening of As-Sajdah therefore moves us from belief to responsibility: if the Qur'an is truly Allah's word (and it is), then it must shape how we live now. We respond by reading it with understanding, trusting its news, and obeying its commands before the day when regret will not help.",
        ar: "تَرسُمُ الآيةُ الثّانيةَ عَشْرةَ مَشهَدَ المُنكِرينَ يَومَ القِيامةِ ناكِسي رُؤوسِهِم يَتَوَسَّلونَ أن يُرَدّوا لِيَعمَلوا صالِحًا، لكِنَّ وَقتَ العَمَلِ يَكونُ قد انتَهى. فَبِدايةُ السَّجدةِ تَنقُلُنا مِنَ الإيمانِ إلى المَسؤوليّة: إن كانَ القُرآنُ كَلامَ اللهِ حَقًّا (وهو كَذلِك) فَلْيُوَجِّهْ حَياتَنا الآن. ونَستَجيبُ بِقِراءَتِهِ بِفَهم، وتَصديقِ خَبَرِه، وامتِثالِ أمرِهِ قَبلَ يَومٍ لا يَنفَعُ فيهِ النَّدَم.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What central claim does As-Sajdah make about the Qur'an in its opening?", ar: "ما الدَّعوى المِحوَريّةُ التي تُقَرِّرُها سورةُ السَّجدةِ في مَطلَعِها عنِ القُرآن؟" },
      options: [
        { en: "It is revelation from the Lord of the worlds, with no doubt", ar: "أنَّهُ تَنزيلٌ مِن رَبِّ العالَمين لا رَيبَ فيه" },
        { en: "It was written by the Prophet ﷺ", ar: "أنَّ النَّبِيَّ ﷺ كَتَبَه" },
        { en: "It is poetry of the Arabs", ar: "أنَّهُ شِعرُ العَرَب" },
      ],
      correctIndex: 0,
      explanation: { en: "Verse 2: the Book is 'tanzil' from the Lord of the worlds, with no doubt.", ar: "الآيةُ ٢: الكِتابُ تَنزيلٌ مِن رَبِّ العالَمينَ لا رَيبَ فيه." },
    },
    {
      prompt: { en: "How does the surah respond to 'He invented it'?", ar: "كَيفَ تَرُدُّ السّورةُ على قَولِهِم «افتَراه»؟" },
      options: [
        { en: "'Rather, it is the truth from your Lord'", ar: "«بَل هو الحَقُّ مِن رَبِّك»" },
        { en: "It stays silent", ar: "تَسكُت" },
        { en: "It agrees with them", ar: "تُوافِقُهُم" },
      ],
      correctIndex: 0,
      explanation: { en: "Verse 3 rejects the accusation: 'Rather, it is the truth from your Lord.'", ar: "الآيةُ ٣ تَرُدُّ التُّهمة: «بَل هو الحَقُّ مِن رَبِّك»." },
    },
    {
      prompt: { en: "According to verses 7-9, the human being was created...", ar: "بِحَسَبِ الآياتِ ٧-٩، خُلِقَ الإنسانُ..." },
      options: [
        { en: "In stages, then given hearing, sight, and hearts", ar: "أطوارًا، ثُمَّ أُعطِيَ السَّمعَ والبَصَرَ والأفئِدة" },
        { en: "All at once from light", ar: "دَفعةً واحِدةً مِن نور" },
        { en: "Without any senses", ar: "بِلا حَواسّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Clay, then offspring from a humble fluid, then forming and the gift of senses.", ar: "مِن طين، ثُمَّ نَسلٌ مِن ماءٍ مَهين، ثُمَّ تَسويةٌ ووَهبُ الحَواسّ." },
    },
    {
      prompt: { en: "What is the surah's argument that resurrection is real?", ar: "ما حُجّةُ السّورةِ على أنَّ البَعثَ حَقّ؟" },
      options: [
        { en: "The One who originates creation can certainly restore it", ar: "القادِرُ على بَدءِ الخَلقِ قادِرٌ على إعادَتِه" },
        { en: "People simply must believe without reason", ar: "على النّاسِ أن يُؤمِنوا بِلا دَليل" },
        { en: "Scientists proved it", ar: "العُلَماءُ أثبَتوه" },
      ],
      correctIndex: 0,
      explanation: { en: "The Creator and Controller of life and death can certainly raise the dead.", ar: "خالِقُ الحَياةِ والمَوتِ ومُدَبِّرُهُما قادِرٌ على البَعثِ يَقينًا." },
    },
    {
      prompt: { en: "How do Ahl as-Sunnah understand Allah's 'istiwa' over the Throne (v.4)?", ar: "كَيفَ يَفهَمُ أهلُ السُّنّةِ استِواءَ اللهِ على العَرشِ (الآية ٤)؟" },
      options: [
        { en: "Affirmed as befits His majesty, without likeness or asking 'how'", ar: "يُثبَتُ كما يَليقُ بِجَلالِه، بِلا تَشبيهٍ ولا تَكييف" },
        { en: "Denied completely", ar: "يُنفى بالكُلِّيّة" },
        { en: "Likened to a human sitting", ar: "يُشَبَّهُ بِجُلوسِ إنسان" },
      ],
      correctIndex: 0,
      explanation: { en: "We affirm it without tashbih (likening) or takyif (asking how).", ar: "نُثبِتُهُ بِلا تَشبيهٍ ولا تَكييف." },
    },
    {
      prompt: { en: "True or False: The opening of As-Sajdah calls us only to believe, not to act.", ar: "صَوابٌ أم خَطأ: مَطلَعُ السَّجدةِ يَدعو إلى الإيمانِ فَقَط لا إلى العَمَل." },
      options: [
        { en: "False — it links truth to warning, accountability, and action", ar: "خَطأ — يَربِطُ الحَقَّ بالإنذارِ والمَسؤوليّةِ والعَمَل" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "The Book is truth meant to warn and guide to right action before Judgement.", ar: "الكِتابُ حَقٌّ لِيُنذِرَ ويَهديَ إلى العَمَلِ الصّالِحِ قَبلَ الحِساب." },
    },
  ],
};
