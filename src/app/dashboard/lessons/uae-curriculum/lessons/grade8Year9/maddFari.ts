import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const maddFari: CourseLesson = {
  slug: "g8y9-secondary-madd",
  name: { en: "Secondary Madd", ar: "المَدُّ الفَرعيّ" },
  shortIntro: {
    en: "Beautifying the recitation of the Qur'an. After the original madd, this lesson explains the secondary madd (al-madd al-far'i) — its cause in the hamzah and sukun, and its main types and lengths.",
    ar: "تَجويدُ تِلاوةِ القُرآنِ وتَحسينُها. بَعدَ المَدِّ الأصليّ، يَشرَحُ هذا الدَّرسُ المَدَّ الفَرعيَّ — سَبَبَهُ في الهَمزِ والسُّكون، وأنواعَهُ الرَّئيسةَ ومَقاديرَه.",
  },
  quranSurahs: ["Al-Muzzammil 4", "Al-Baqarah 13", "Al-Fatihah 7"],
  sections: [
    {
      title: { en: "What is the secondary madd?", ar: "ما المَدُّ الفَرعيّ؟" },
      learningObjectives: [
        { en: "Define the secondary madd and its cause.", ar: "أُعَرِّفُ المَدَّ الفَرعيَّ وسَبَبَه." },
        { en: "Explain why tajweed matters.", ar: "أشرَحُ أهَمِّيّةَ التَّجويد." },
      ],
      successCriteria: [
        { en: "I can state the cause of the secondary madd.", ar: "أذكُرُ سَبَبَ المَدِّ الفَرعيّ." },
        { en: "I can explain the difference from the original madd.", ar: "أشرَحُ الفَرقَ عنِ المَدِّ الأصليّ." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an — reciting with tajweed.", ar: "طِفلٌ يَقرَأُ القُرآن — تِلاوةٌ بِالتَّجويد." },
        caption: { en: "'And recite the Qur'an with measured recitation.' (Al-Muzzammil 4).", ar: "﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why the rules of recitation?", ar: "لِمَ قَواعِدُ التِّلاوة؟" },
        body: {
          en: "Allah commands us to recite the Qur'an 'with measured recitation' (tartil). Reflect: why does Allah care not only about what we read but how we read it? What does learning the precise rules of tajweed teach us about the honour and care the Qur'an deserves?",
          ar: "يَأمُرُنا اللهُ بِتِلاوةِ القُرآنِ ﴿تَرتيلًا﴾. تَأمَّل: لِمَ يَعتَني اللهُ لا بِما نَقرَأُ فَحَسب، بل بِكَيفِيّةِ قِراءَتِنا له؟ وماذا يُعَلِّمُنا تَعَلُّمُ قَواعِدِ التَّجويدِ الدَّقيقةِ عنِ التَّكريمِ والعِنايةِ التي يَستَحِقُّها القُرآن؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Madd far'i (المَدُّ الفَرعيّ): a madd longer than two counts, caused by a hamzah or sukun.", ar: "المَدُّ الفَرعيّ: مَدٌّ أطوَلُ مِن حَرَكَتَين، سَبَبُهُ هَمزٌ أو سُكون." },
          ],
        },
        {
          label: { en: "Two causes", ar: "سَبَبان" },
          lines: [
            { en: "1) Hamzah (ء). 2) Sukun (ـْ).", ar: "١) الهَمز (ء). ٢) السُّكون (ـْ)." },
          ],
        },
      ],
      body: {
        en: "The science of tajweed — the precise rules governing the correct pronunciation and recitation of the Qur'an — is a noble field of knowledge that every Muslim is encouraged to learn, for it enables the believer to recite the Book of Allah beautifully, correctly, and in the very manner in which it was revealed and recited by the Prophet ﷺ. Allah Himself commands the careful, measured recitation of His Book: 'And recite the Qur'an with measured recitation (tartil)' (Al-Muzzammil 4), and tajweed is precisely the science that teaches the believer how to fulfil this command. In a previous lesson, we studied the original or natural madd (al-madd al-asli, also called al-madd at-tabi'i), which is the foundational lengthening of the voice when pronouncing one of the three letters of madd — the alif preceded by a fathah, the waw preceded by a dammah, and the ya preceded by a kasrah — for the duration of two counts (harakahs). This original madd has no cause beyond the madd letter itself; it exists wherever a madd letter appears, and its length is always two counts, neither more nor less. In this lesson, we move on to study the second major category of madd: the secondary or derived madd, known in Arabic as al-madd al-far'i.\n\nThe secondary madd (al-madd al-far'i) is defined as the lengthening of the madd letter for a duration longer than the natural two counts of the original madd, due to the presence of a specific cause that follows the madd letter. In other words, while the original madd is always exactly two counts and has no cause beyond the madd letter, the secondary madd is longer than two counts, and this extra lengthening occurs because of a particular cause that comes after the madd letter. Understanding the secondary madd therefore requires understanding its causes. The scholars of tajweed have established that the secondary madd has two causes (asbab), and every instance of secondary madd in the Qur'an arises from one of these two: the first cause is the hamzah (ء), and the second cause is the sukun (ـْ), a non-vowelled, resting consonant. Whenever a madd letter is followed by a hamzah or by a sukun, the natural madd is extended beyond its basic two counts into a secondary madd, with the exact length depending on the type and circumstances, as we shall see. This is the essential distinction to grasp: the original madd is caused by nothing but the madd letter and is always two counts, while the secondary madd is caused by a hamzah or a sukun coming after the madd letter and is always longer than two counts.\n\nIt is important for the demanding student to understand why such precise rules exist and why learning them is a meritorious act of worship. The Qur'an is the literal speech of Allah, revealed to the Prophet Muhammad ﷺ through the angel Jibril, and the Prophet ﷺ recited it to his Companions exactly as he received it, with all its rules of pronunciation, lengthening, and articulation. This precise manner of recitation was then passed down faithfully, generation after generation, from the Prophet ﷺ to the Companions, to the Successors, and onward through an unbroken chain of teachers to the present day. To learn tajweed, therefore, is to learn to recite the Qur'an exactly as the Prophet ﷺ recited it, preserving the beauty, precision, and integrity of the divine revelation. Reciting the Qur'an correctly is not a trivial matter of pronunciation but a way of honouring the speech of Allah and showing it the reverence it deserves, and the believer who beautifies his recitation of the Qur'an in obedience to Allah's command earns great reward. The Prophet ﷺ said: 'The one who is proficient in the recitation of the Qur'an will be with the honourable, obedient scribes (the angels), and the one who recites the Qur'an and falters in it, finding it difficult, will have a double reward' (Bukhari and Muslim) — showing that even the one who struggles to recite correctly is rewarded for his effort, while the one who masters it attains a most honoured rank. A demanding student should therefore approach the study of tajweed, including the rules of the secondary madd, not as a dry technical exercise, but as an act of love and reverence for the Book of Allah, striving to recite it as beautifully and correctly as he can, in fulfilment of Allah's command to recite with tartil. In the next section we examine the main types of the secondary madd that arise from its two causes — the hamzah and the sukun — and their respective lengths.",
        ar: "عِلمُ التَّجويدِ — وهو القَواعِدُ الدَّقيقةُ التي تَضبِطُ النُّطقَ الصَّحيحَ بِالقُرآنِ وتِلاوَتَه — عِلمٌ شَريفٌ يُحَثُّ كُلُّ مُسلِمٍ على تَعَلُّمِه، إذ يُمَكِّنُ المُؤمِنَ مِن تِلاوةِ كِتابِ اللهِ تِلاوةً جَميلةً صَحيحةً على الوَجهِ الذي أُنزِلَ وتَلاهُ النَّبِيُّ ﷺ. واللهُ نَفسُهُ يَأمُرُ بِتِلاوةِ كِتابِهِ على تُؤَدةٍ وتَرَتُّل: ﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤)، والتَّجويدُ هو العِلمُ الذي يُعَلِّمُ المُؤمِنَ كَيفَ يُحَقِّقُ هذا الأمر. وفي دَرسٍ سابِقٍ دَرَسنا المَدَّ الأصليَّ (ويُسَمّى المَدَّ الطَّبيعيَّ)، وهو مَدُّ الصَّوتِ الأساسيُّ عِندَ النُّطقِ بِأحَدِ حُروفِ المَدِّ الثَّلاثة — الألِفِ التي قَبلَها فَتحة، والواوِ التي قَبلَها ضَمّة، والياءِ التي قَبلَها كَسرة — بِمِقدارِ حَرَكَتَين. وهذا المَدُّ الأصليُّ لا سَبَبَ لَهُ سِوى حَرفِ المَدِّ نَفسِه؛ يَكونُ حَيثُما وُجِدَ حَرفُ مَدّ، ومِقدارُهُ دائِمًا حَرَكَتانِ لا أزيَدُ ولا أنقَص. وفي هذا الدَّرسِ نَنتَقِلُ إلى دِراسةِ القِسمِ الثّاني الكَبيرِ مِنَ المَدّ: المَدِّ الفَرعيّ.\n\nالمَدُّ الفَرعيُّ يُعَرَّفُ بِأنَّهُ إطالةُ حَرفِ المَدِّ مُدّةً أطوَلَ مِنَ الحَرَكَتَينِ الطَّبيعيَّتَينِ لِلمَدِّ الأصليّ، بِسَبَبِ وُجودِ سَبَبٍ مَخصوصٍ يَأتي بَعدَ حَرفِ المَدّ. بِعِبارةٍ أُخرى: المَدُّ الأصليُّ دائِمًا حَرَكَتانِ ولا سَبَبَ لَهُ سِوى حَرفِ المَدّ، أمّا المَدُّ الفَرعيُّ فَأطوَلُ مِن حَرَكَتَين، وهذا الزِّيادةُ في المَدِّ تَقَعُ بِسَبَبٍ مُعَيَّنٍ يَأتي بَعدَ حَرفِ المَدّ. ولِذلك يَتَطَلَّبُ فَهمُ المَدِّ الفَرعيِّ فَهمَ أسبابِه. وقد قَرَّرَ عُلَماءُ التَّجويدِ أنَّ لِلمَدِّ الفَرعيِّ سَبَبَين، وكُلُّ مَدٍّ فَرعيٍّ في القُرآنِ ناشِئٌ عن أحَدِهِما: السَّبَبُ الأوَّلُ الهَمزُ (ء)، والسَّبَبُ الثّاني السُّكون (ـْ)، وهو الحَرفُ السّاكِنُ غَيرُ المُتَحَرِّك. فَكُلَّما جاءَ بَعدَ حَرفِ المَدِّ هَمزٌ أو سُكون، امتَدَّ المَدُّ الطَّبيعيُّ فَوقَ حَرَكَتَيهِ الأساسيَّتَينِ إلى مَدٍّ فَرعيّ، ويَختَلِفُ المِقدارُ بِحَسَبِ النَّوعِ والحال، كَما سَنَرى. وهذا هو الفَرقُ الجَوهَريُّ الذي يَنبَغي إدراكُه: المَدُّ الأصليُّ سَبَبُهُ حَرفُ المَدِّ فَقَط ومِقدارُهُ حَرَكَتانِ دائِمًا، والمَدُّ الفَرعيُّ سَبَبُهُ هَمزٌ أو سُكونٌ يَأتي بَعدَ حَرفِ المَدّ ومِقدارُهُ دائِمًا أطوَلُ مِن حَرَكَتَين.\n\nومِنَ المُهِمِّ لِلطّالِبِ المُجِدِّ أن يَفهَمَ لِمَ وُجِدَت هذه القَواعِدُ الدَّقيقةُ ولِمَ كانَ تَعَلُّمُها عِبادةً مَأجورة. فالقُرآنُ كَلامُ اللهِ حَقيقةً، أنزَلَهُ على النَّبِيِّ مُحَمَّدٍ ﷺ بِجِبريل، وتَلاهُ النَّبِيُّ ﷺ على أصحابِهِ كَما تَلَقّاهُ تَمامًا، بِكُلِّ أحكامِ نُطقِهِ ومَدِّهِ ومَخارِجِه. ثُمَّ نُقِلَت هذه الكَيفيّةُ الدَّقيقةُ أمينةً جيلًا بَعدَ جيل، مِنَ النَّبِيِّ ﷺ إلى الصَّحابة، إلى التّابِعين، فَعَبرَ سِلسِلةٍ مُتَّصِلةٍ مِنَ المُعَلِّمينَ إلى يَومِنا. فَتَعَلُّمُ التَّجويدِ تَعَلُّمٌ لِتِلاوةِ القُرآنِ كَما تَلاهُ النَّبِيُّ ﷺ تَمامًا، حِفظًا لِجَمالِ الوَحيِ الإلهيِّ ودِقَّتِهِ وسَلامَتِه. وتِلاوةُ القُرآنِ صَحيحةً ليسَت مَسألةَ نُطقٍ يَسيرة، بل تَكريمٌ لِكَلامِ اللهِ وإظهارٌ لِما يَستَحِقُّهُ مِن تَعظيم، والمُؤمِنُ الذي يُحَسِّنُ تِلاوَتَهُ لِلقُرآنِ طاعةً لِأمرِ اللهِ يَنالُ أجرًا عَظيمًا. قالَ النَّبِيُّ ﷺ: «الماهِرُ بِالقُرآنِ معَ السَّفَرةِ الكِرامِ البَرَرة، والذي يَقرَأُ القُرآنَ ويَتَتَعتَعُ فيهِ وهو علَيهِ شاقٌّ لَهُ أجران» (البخاري ومسلم) — فَحَتّى مَن يَشُقُّ علَيهِ النُّطقُ الصَّحيحُ مَأجورٌ على اجتِهادِه، ومَن أتقَنَهُ نالَ أرفَعَ المَنازِل. فَيَنبَغي لِلطّالِبِ المُجِدِّ أن يُقبِلَ على تَعَلُّمِ التَّجويد، ومِنهُ أحكامُ المَدِّ الفَرعيّ، لا كَتَمرينٍ تِقنيٍّ جافّ، بل كَعَمَلِ حُبٍّ وتَعظيمٍ لِكِتابِ الله، يَجتَهِدُ في تِلاوَتِهِ أجمَلَ وأصَحَّ ما يَستَطيع، تَحقيقًا لِأمرِ اللهِ بِالتَّرتيل. وفي القِسمِ التّالي نَتَناوَلُ أهَمَّ أنواعِ المَدِّ الفَرعيِّ النّاشِئةِ عن سَبَبَيهِ — الهَمزِ والسُّكون — ومَقاديرَها.",
      },
    },
    {
      title: { en: "Types of the secondary madd", ar: "أنواعُ المَدِّ الفَرعيّ" },
      learningObjectives: [
        { en: "Identify the main types of secondary madd.", ar: "أُمَيِّزُ أنواعَ المَدِّ الفَرعيِّ الرَّئيسة." },
        { en: "State the length of each.", ar: "أذكُرُ مِقدارَ كُلِّ نَوع." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Books of knowledge — learning the rules of recitation.", ar: "كُتُبُ العِلم — تَعَلُّمُ أحكامِ التِّلاوة." },
        caption: { en: "Tajweed preserves the Qur'an as the Prophet ﷺ recited it.", ar: "التَّجويدُ يَحفَظُ القُرآنَ كَما تَلاهُ النَّبِيُّ ﷺ." },
      },
      groupTasks: {
        title: { en: "The types and their causes", ar: "الأنواعُ وأسبابُها" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "madd-with-hamzah",
            name: { en: "Team A — Madd caused by the hamzah", ar: "الفَريقُ أ — المَدُّ بِسَبَبِ الهَمز" },
            learningObjective: { en: "Explain madd muttasil and munfasil.", ar: "نَشرَحُ المَدَّ المُتَّصِلَ والمُنفَصِل." },
            task: { en: "Explain the two madds caused by the hamzah: (1) Madd Wajib Muttasil (obligatory connected) — when the madd letter and the hamzah are in the SAME word (e.g. جَاءَ, السَّمَاءِ), lengthened 4-5 counts. (2) Madd Ja'iz Munfasil (permissible separated) — when the madd letter is at the end of one word and the hamzah at the start of the NEXT word (e.g. يَا أَيُّهَا, إِنَّا أَنْزَلْنَا), lengthened 4-5 counts (2 also allowed). Give Qur'anic examples for each and explain 'muttasil' = connected, 'munfasil' = separated.", ar: "اشرَحوا المَدَّينِ بِسَبَبِ الهَمز: (١) المَدُّ الواجِبُ المُتَّصِل — إذا اجتَمَعَ حَرفُ المَدِّ والهَمزُ في كَلِمةٍ واحِدة (مِثل: جَاءَ، السَّمَاءِ)، ويُمَدُّ ٤-٥ حَرَكات. (٢) المَدُّ الجائِزُ المُنفَصِل — إذا كانَ حَرفُ المَدِّ في آخِرِ كَلِمةٍ والهَمزُ في أوَّلِ الكَلِمةِ التّالية (مِثل: يَا أَيُّهَا، إِنَّا أَنْزَلْنَا)، ويُمَدُّ ٤-٥ حَرَكات (ويَجوزُ ٢). هاتوا أمثِلةً قُرآنيّةً لِكُلٍّ، واشرَحوا أنَّ «المُتَّصِل» مَوصول و«المُنفَصِل» مَفصول." },
            evidence: [
              { en: "جَاءَ (muttasil); يَا أَيُّهَا (munfasil).", ar: "جَاءَ (مُتَّصِل)؛ يَا أَيُّهَا (مُنفَصِل)." },
            ],
            sourceNotes: [
              { en: "Both caused by hamzah; muttasil in one word, munfasil across two.", ar: "كِلاهُما بِالهَمز؛ المُتَّصِلُ في كَلِمة، والمُنفَصِلُ بَينَ كَلِمَتَين." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Reciter.", ar: "الباحِث، الكاتِب، القارِئ." },
            ],
            finalProduct: { en: "A chart of the two hamzah-madds with examples.", ar: "جَدوَلُ مَدَّيِ الهَمزِ بِأمثِلة." },
          },
          {
            slug: "madd-with-sukun",
            name: { en: "Team B — Madd caused by the sukun", ar: "الفَريقُ ب — المَدُّ بِسَبَبِ السُّكون" },
            learningObjective: { en: "Explain madd 'arid and madd lazim.", ar: "نَشرَحُ المَدَّ العارِضَ واللّازِم." },
            task: { en: "Explain the two main madds caused by sukun: (1) Madd 'Arid lis-Sukun (presented for the stop) — when we STOP on a word ending in a madd letter followed by a normally-vowelled letter we make silent by stopping (e.g. stopping on العَالَمِينَ, نَسْتَعِينُ), lengthened 2, 4, or 6 counts. (2) Madd Lazim (necessary) — when the madd letter is followed by an ORIGINAL, permanent sukun (e.g. الضَّالِّينَ, آلْآنَ), lengthened 6 counts always. Give Qur'anic examples and explain '\u2018arid' = temporary, 'lazim' = permanent/necessary.", ar: "اشرَحوا المَدَّينِ الرَّئيسَينِ بِسَبَبِ السُّكون: (١) المَدُّ العارِضُ لِلسُّكون — إذا وَقَفنا على كَلِمةٍ آخِرُها حَرفُ مَدٍّ بَعدَهُ حَرفٌ مُتَحَرِّكٌ سَكَّنّاهُ بِالوَقف (مِثل: الوَقفُ على العَالَمِينَ، نَسْتَعِينُ)، ويُمَدُّ ٢ أو ٤ أو ٦ حَرَكات. (٢) المَدُّ اللّازِم — إذا جاءَ بَعدَ حَرفِ المَدِّ سُكونٌ أصليٌّ ثابِت (مِثل: الضَّالِّينَ، آلْآنَ)، ويُمَدُّ ٦ حَرَكاتٍ دائِمًا. هاتوا أمثِلةً قُرآنيّةً واشرَحوا أنَّ «العارِض» مُؤَقَّت و«اللّازِم» ثابِتٌ واجِب." },
            evidence: [
              { en: "العَالَمِينَ on stopping ('arid); الضَّالِّينَ (lazim).", ar: "العَالَمِينَ عِندَ الوَقف (عارِض)؛ الضَّالِّينَ (لازِم)." },
            ],
            sourceNotes: [
              { en: "'Arid = temporary sukun from stopping; lazim = original sukun.", ar: "العارِض = سُكونٌ مُؤَقَّتٌ بِالوَقف؛ اللّازِم = سُكونٌ أصليّ." },
            ],
            memberRoles: [
              { en: "Researcher, Planner, Reciter.", ar: "الباحِث، المُخَطِّط، القارِئ." },
            ],
            finalProduct: { en: "A chart of the two sukun-madds with examples.", ar: "جَدوَلُ مَدَّيِ السُّكونِ بِأمثِلة." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Honouring the Book of Allah", ar: "تَكريمُ كِتابِ الله" },
        prompt: { en: "Learning tajweed is a way of honouring the Qur'an and reciting it as the Prophet ﷺ did. Pick one type of secondary madd from this lesson, find an example of it in a surah you have memorised (like Al-Fatihah or Al-Ikhlas), and write it down. Then reflect: why is it worth taking the time to recite the Qur'an correctly and beautifully? Write about how improving your recitation can deepen your connection to the words of Allah, and set yourself one tajweed goal for this month.", ar: "تَعَلُّمُ التَّجويدِ تَكريمٌ لِلقُرآنِ وتِلاوةٌ لَهُ كَما تَلاهُ النَّبِيُّ ﷺ. اختَر نَوعًا واحِدًا مِنَ المَدِّ الفَرعيِّ في هذا الدَّرس، وجِد لَهُ مِثالًا في سورةٍ تَحفَظُها (كَالفاتِحةِ أوِ الإخلاص)، واكتُبه. ثُمَّ تَأمَّل: لِمَ يَستَحِقُّ الأمرُ بَذلَ الوَقتِ لِتِلاوةِ القُرآنِ صَحيحةً جَميلة؟ اكتُبْ كَيفَ يُعَمِّقُ تَحسينُ تِلاوَتِكَ صِلَتَكَ بِكَلامِ الله، وضَع لِنَفسِكَ هَدَفًا واحِدًا في التَّجويدِ هذا الشَّهر." },
        placeholder: { en: "An example of secondary madd I found is... Reciting correctly matters because... My tajweed goal is...", ar: "مِثالٌ لِلمَدِّ الفَرعيِّ وَجَدتُهُ هو... وتِلاوةُ القُرآنِ صَحيحةً مُهِمّةٌ لِأنَّ... وهَدَفي في التَّجويد..." },
      },
      body: {
        en: "Having understood that the secondary madd arises from two causes — the hamzah and the sukun — we can now examine its main types. The first two types of secondary madd are those caused by the hamzah (ء). The first is the Madd Wajib Muttasil (the obligatory connected madd). This occurs when a madd letter is immediately followed by a hamzah within the same word, such as in the words 'jaa'a' (جَاءَ), 'as-samaa'i' (السَّمَاءِ), and 'soo'a' (سُوءَ). It is called 'connected' (muttasil) because the madd letter and the hamzah are joined together in a single word, and it is called 'obligatory' (wajib) because all the reciters agree that it must be lengthened beyond the natural two counts. The Madd Wajib Muttasil is lengthened for a duration of four or five counts (harakahs). The second type caused by the hamzah is the Madd Ja'iz Munfasil (the permissible separated madd). This occurs when a madd letter falls at the end of one word and is followed by a hamzah at the beginning of the next word, such as in 'yaa ayyuhaa' (يَا أَيُّهَا), 'innaa anzalnaahu' (إِنَّا أَنْزَلْنَاهُ), and 'qaaloo aamannaa' (قَالُوا آمَنَّا). It is called 'separated' (munfasil) because the madd letter is in one word and the hamzah that causes the lengthening is in a separate, following word, and it is called 'permissible' (ja'iz) because the reciters differ on its length, some lengthening it and some keeping it shorter. The Madd Ja'iz Munfasil is commonly lengthened for four or five counts, though shortening it to two counts is also a valid recitation in some narrations.\n\nThe next types of secondary madd are those caused by the sukun (ـْ), a resting, non-vowelled consonant. The most common of these is the Madd 'Arid lis-Sukun (the madd presented for the stop). This occurs when a reciter stops at the end of a word that ends in a madd letter followed by a letter that is normally vowelled, but which becomes silent (sakin) because the reciter is pausing on it. For example, when reciting Surat Al-Fatihah, the words 'al-'aalameen' (الْعَالَمِينَ), 'ar-raheem' (الرَّحِيمِ), and 'nasta'een' (نَسْتَعِينُ) all end in a madd letter followed by a final letter; when the reciter stops on these words, that final letter becomes silent, creating a temporary sukun after the madd letter, which lengthens the madd. It is called 'presented for the stop' ('arid lis-sukun) because the sukun is not original to the word but is 'presented' or brought about temporarily by the act of stopping. The Madd 'Arid lis-Sukun may be lengthened for two, four, or six counts, and the reciter should be consistent in his chosen length. The final major type is the Madd Lazim (the necessary madd), which occurs when a madd letter is followed by an original, permanent sukun that is part of the word itself and does not change whether one stops or continues. Examples include 'ad-daalleen' (الضَّالِّينَ) at the end of Al-Fatihah, where the madd is followed by a doubled (shaddah) laam, and the letters at the openings of some surahs such as 'alif-laam-meem' where the 'meem' (مّ) contains a permanent madd. It is called 'necessary' (lazim) because its lengthening is necessary and fixed in all cases, and it is the longest of all the madds, lengthened for six counts (harakahs) always, without exception.\n\nIn summary, the secondary madd (al-madd al-far'i) is the lengthening of a madd letter beyond the natural two counts due to a hamzah or a sukun following it, and its main types are: the Madd Wajib Muttasil (hamzah in the same word, 4-5 counts), the Madd Ja'iz Munfasil (hamzah in the next word, 4-5 counts), the Madd 'Arid lis-Sukun (temporary sukun from stopping, 2-4-6 counts), and the Madd Lazim (permanent original sukun, 6 counts). Learning these rules and applying them correctly enables the believer to recite the Qur'an as it was revealed and as the Prophet ﷺ recited it, fulfilling the command of Allah to 'recite the Qur'an with measured recitation' (Al-Muzzammil 4). A demanding student should not be intimidated by the technical names of these rules; rather, he should understand that each rule simply describes a particular situation in which the voice is lengthened, and that with practice and careful listening to skilled reciters, these rules become natural and effortless. Most importantly, the student should remember that the entire purpose of tajweed is to honour the Book of Allah, to recite it correctly and beautifully out of love and reverence for the speech of his Lord, and to earn the great reward promised to those who recite the Qur'an well. The believer who masters his recitation joins the ranks of 'the honourable, obedient scribes' in the words of the Prophet ﷺ, and the one who strives despite difficulty earns a double reward — and in either case, the believer who turns his recitation of the Qur'an into a careful, loving, and beautiful act of worship has honoured the greatest of all books, the very speech of Allah, the Lord of the worlds.",
        ar: "بَعدَ أن فَهِمنا أنَّ المَدَّ الفَرعيَّ يَنشَأُ عن سَبَبَين — الهَمزِ والسُّكون — يُمكِنُنا الآنَ تَناوُلُ أنواعِهِ الرَّئيسة. والنَّوعانِ الأوَّلانِ مِنَ المَدِّ الفَرعيِّ هُما اللَّذانِ سَبَبُهُما الهَمز (ء). الأوَّلُ المَدُّ الواجِبُ المُتَّصِل. ويَكونُ إذا جاءَ بَعدَ حَرفِ المَدِّ هَمزٌ في الكَلِمةِ نَفسِها، مِثل: «جَاءَ»، و«السَّمَاءِ»، و«سُوءَ». وسُمِّيَ «مُتَّصِلًا» لِاجتِماعِ حَرفِ المَدِّ والهَمزِ في كَلِمةٍ واحِدة، و«واجِبًا» لِاتِّفاقِ القُرّاءِ على وُجوبِ مَدِّهِ فَوقَ الحَرَكَتَينِ الطَّبيعيَّتَين. ويُمَدُّ المَدُّ الواجِبُ المُتَّصِلُ أربَعَ أو خَمسَ حَرَكات. والنَّوعُ الثّاني بِسَبَبِ الهَمزِ المَدُّ الجائِزُ المُنفَصِل. ويَكونُ إذا وَقَعَ حَرفُ المَدِّ في آخِرِ كَلِمةٍ وجاءَ بَعدَهُ هَمزٌ في أوَّلِ الكَلِمةِ التّالية، مِثل: «يَا أَيُّهَا»، و«إِنَّا أَنْزَلْنَاهُ»، و«قَالُوا آمَنَّا». وسُمِّيَ «مُنفَصِلًا» لِأنَّ حَرفَ المَدِّ في كَلِمةٍ والهَمزَ المُسَبِّبَ لِلمَدِّ في كَلِمةٍ أُخرى تالية، و«جائِزًا» لِاختِلافِ القُرّاءِ في مِقدارِه، فَمِنهُم مَن يَمُدُّهُ ومِنهُم مَن يَقصُرُه. ويُمَدُّ المَدُّ الجائِزُ المُنفَصِلُ غالِبًا أربَعَ أو خَمسَ حَرَكات، ويَجوزُ قَصرُهُ إلى حَرَكَتَينِ في بَعضِ الرِّواياتِ.\n\nوالأنواعُ التّاليةُ مِنَ المَدِّ الفَرعيِّ سَبَبُها السُّكون (ـْ)، وهو الحَرفُ السّاكِنُ غَيرُ المُتَحَرِّك. وأشهَرُها المَدُّ العارِضُ لِلسُّكون. ويَكونُ إذا وَقَفَ القارِئُ على آخِرِ كَلِمةٍ تَنتَهي بِحَرفِ مَدٍّ بَعدَهُ حَرفٌ مُتَحَرِّكٌ في الأصل، لكِنَّهُ يَسكُنُ لِأنَّ القارِئَ يَقِفُ علَيه. فَمَثَلًا في تِلاوةِ الفاتِحة، كَلِماتُ «الْعَالَمِينَ»، و«الرَّحِيمِ»، و«نَسْتَعِينُ» تَنتَهي بِحَرفِ مَدٍّ بَعدَهُ حَرفٌ أخير؛ فإذا وَقَفَ القارِئُ علَيها سَكَنَ ذلك الحَرفُ الأخير، فَنَشَأَ سُكونٌ مُؤَقَّتٌ بَعدَ حَرفِ المَدِّ مَدَّه. وسُمِّيَ «عارِضًا لِلسُّكون» لِأنَّ السُّكونَ ليسَ أصليًّا في الكَلِمةِ بل «عَرَضَ» مُؤَقَّتًا بِسَبَبِ الوَقف. ويُمَدُّ المَدُّ العارِضُ لِلسُّكونِ حَرَكَتَينِ أو أربَعًا أو سِتًّا، ويَنبَغي لِلقارِئِ الثَّباتُ على مِقدارِهِ المُختار. والنَّوعُ الرَّئيسُ الأخيرُ المَدُّ اللّازِم، ويَكونُ إذا جاءَ بَعدَ حَرفِ المَدِّ سُكونٌ أصليٌّ ثابِتٌ مِن بِنيةِ الكَلِمةِ لا يَتَغَيَّرُ بِوَقفٍ أو وَصل. ومِن أمثِلَتِهِ «الضَّالِّينَ» في خِتامِ الفاتِحة، حَيثُ يَلي المَدَّ لامٌ مُشَدَّدة، وحُروفُ فَواتِحِ بَعضِ السُّوَرِ كَـ«ألِف لام ميم» حَيثُ تَحوي «الميم» (مّ) مَدًّا ثابِتًا. وسُمِّيَ «لازِمًا» لِأنَّ مَدَّهُ لازِمٌ ثابِتٌ في كُلِّ الأحوال، وهو أطوَلُ المُدودِ، يُمَدُّ سِتَّ حَرَكاتٍ دائِمًا بِلا استِثناء.\n\nوخُلاصةً: المَدُّ الفَرعيُّ هو إطالةُ حَرفِ المَدِّ فَوقَ الحَرَكَتَينِ الطَّبيعيَّتَينِ بِسَبَبِ هَمزٍ أو سُكونٍ بَعدَه، وأنواعُهُ الرَّئيسة: المَدُّ الواجِبُ المُتَّصِل (هَمزٌ في الكَلِمةِ نَفسِها، ٤-٥ حَرَكات)، والمَدُّ الجائِزُ المُنفَصِل (هَمزٌ في الكَلِمةِ التّالية، ٤-٥ حَرَكات)، والمَدُّ العارِضُ لِلسُّكون (سُكونٌ مُؤَقَّتٌ بِالوَقف، ٢-٤-٦ حَرَكات)، والمَدُّ اللّازِم (سُكونٌ أصليٌّ ثابِت، ٦ حَرَكات). وتَعَلُّمُ هذه الأحكامِ وتَطبيقُها صَحيحةً يُمَكِّنُ المُؤمِنَ مِن تِلاوةِ القُرآنِ كَما أُنزِلَ وكَما تَلاهُ النَّبِيُّ ﷺ، تَحقيقًا لِأمرِ اللهِ: ﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤). ولا يَنبَغي لِلطّالِبِ المُجِدِّ أن تُرهِبَهُ الأسماءُ الاصطِلاحيّةُ لِهذه الأحكام؛ بل علَيهِ أن يَفهَمَ أنَّ كُلَّ حُكمٍ إنَّما يَصِفُ حالةً مُعَيَّنةً يُطالُ فيها الصَّوت، وأنَّها بِالمُمارَسةِ والإصغاءِ لِلقُرّاءِ المَهَرةِ تَصيرُ سَهلةً طَبيعيّة. والأهَمُّ أن يَتَذَكَّرَ الطّالِبُ أنَّ غايةَ التَّجويدِ كُلِّها تَكريمُ كِتابِ الله، وتِلاوَتُهُ صَحيحةً جَميلةً حُبًّا وتَعظيمًا لِكَلامِ رَبِّه، ونَيلُ الأجرِ العَظيمِ المَوعودِ لِمَن أحسَنَ تِلاوةَ القُرآن. فالمُؤمِنُ الذي يُتقِنُ تِلاوَتَهُ يَلحَقُ بِـ«السَّفَرةِ الكِرامِ البَرَرة» في قَولِ النَّبِيِّ ﷺ، والذي يَجتَهِدُ معَ المَشَقّةِ لَهُ أجران — وفي الحالَينِ، فالمُؤمِنُ الذي يَجعَلُ تِلاوَتَهُ لِلقُرآنِ عِبادةً مُتقَنةً مُحِبّةً جَميلةً قد كَرَّمَ أعظَمَ الكُتُبِ على الإطلاق، كَلامَ اللهِ رَبِّ العالَمين.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What causes the secondary madd (al-madd al-far'i)?", ar: "ما سَبَبُ المَدِّ الفَرعيّ؟" },
      options: [
        { en: "A hamzah or a sukun after the madd letter", ar: "هَمزٌ أو سُكونٌ بَعدَ حَرفِ المَدّ" },
        { en: "Nothing — only the madd letter", ar: "لا شَيء — حَرفُ المَدِّ فَقَط" },
        { en: "A fathah", ar: "فَتحة" },
        { en: "A space", ar: "فَراغ" },
      ],
      correctIndex: 0,
      explanation: { en: "Its two causes are the hamzah and the sukun.", ar: "سَبَباهُ الهَمزُ والسُّكون." },
    },
    {
      prompt: { en: "What is Madd Wajib Muttasil?", ar: "ما المَدُّ الواجِبُ المُتَّصِل؟" },
      options: [
        { en: "Madd letter + hamzah in the same word (4-5 counts)", ar: "حَرفُ مَدٍّ + هَمزٌ في كَلِمةٍ واحِدة (٤-٥)" },
        { en: "Madd with no cause", ar: "مَدٌّ بِلا سَبَب" },
        { en: "Always two counts", ar: "حَرَكَتانِ دائِمًا" },
        { en: "A type of original madd", ar: "نَوعٌ مِنَ المَدِّ الأصليّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Connected: madd + hamzah in one word, e.g. جَاءَ.", ar: "مُتَّصِل: مَدٌّ + هَمزٌ في كَلِمة، مِثل جَاءَ." },
    },
    {
      prompt: { en: "What is Madd Ja'iz Munfasil?", ar: "ما المَدُّ الجائِزُ المُنفَصِل؟" },
      options: [
        { en: "Madd at word's end + hamzah at next word's start", ar: "مَدٌّ في آخِرِ كَلِمةٍ + هَمزٌ في أوَّلِ التّالية" },
        { en: "Madd with a permanent sukun", ar: "مَدٌّ بِسُكونٍ ثابِت" },
        { en: "Madd of two counts only", ar: "مَدُّ حَرَكَتَينِ فَقَط" },
        { en: "The original madd", ar: "المَدُّ الأصليّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Separated across two words, e.g. يَا أَيُّهَا.", ar: "مُنفَصِلٌ بَينَ كَلِمَتَين، مِثل يَا أَيُّهَا." },
    },
    {
      prompt: { en: "How long is the Madd Lazim?", ar: "كَم مِقدارُ المَدِّ اللّازِم؟" },
      options: [
        { en: "Six counts, always", ar: "سِتُّ حَرَكاتٍ دائِمًا" },
        { en: "Two counts", ar: "حَرَكَتان" },
        { en: "It is not lengthened", ar: "لا يُمَدّ" },
        { en: "One count", ar: "حَرَكةٌ واحِدة" },
      ],
      correctIndex: 0,
      explanation: { en: "The longest madd: 6 counts (e.g. الضَّالِّينَ).", ar: "أطوَلُ المُدود: ٦ حَرَكات (مِثل الضَّالِّينَ)." },
    },
    {
      prompt: { en: "What does Allah command about reciting the Qur'an?", ar: "بِمَ يَأمُرُ اللهُ في تِلاوةِ القُرآن؟" },
      options: [
        { en: "To recite it with measured recitation (tartil)", ar: "تِلاوَتَهُ تَرتيلًا" },
        { en: "To recite it quickly", ar: "تِلاوَتَهُ بِسُرعة" },
        { en: "To recite it silently only", ar: "تِلاوَتَهُ سِرًّا فَقَط" },
        { en: "Not to recite it", ar: "ألّا يُتلى" },
      ],
      correctIndex: 0,
      explanation: { en: "'And recite the Qur'an with measured recitation' (73:4).", ar: "﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (٧٣:٤)." },
    },
    {
      prompt: { en: "True or False: The original madd is always two counts; the secondary is longer.", ar: "صَوابٌ أم خَطأ: المَدُّ الأصليُّ حَرَكَتانِ دائِمًا، والفَرعيُّ أطوَل." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Original = 2 counts (no cause); secondary = longer (hamzah/sukun).", ar: "الأصليّ = حَرَكَتان (بِلا سَبَب)؛ الفَرعيّ = أطوَل (هَمز/سُكون)." },
    },
  ],
};
