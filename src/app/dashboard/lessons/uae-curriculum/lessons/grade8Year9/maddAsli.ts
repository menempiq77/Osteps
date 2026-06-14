import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const maddAsli: CourseLesson = {
  slug: "g8y9-rules-of-madd-original",
  name: { en: "Rules of Madd: The Original Madd First", ar: "أحكامُ المَدّ: المَدُّ الأصليُّ أوَّلًا" },
  shortIntro: {
    en: "Beautifying the recitation of the Qur'an. A tajwid study of madd (elongation) — beginning with the natural, original madd (al-madd al-asli/al-tabi'i): its letters, its measure, and how to apply it.",
    ar: "تَجويدُ تِلاوةِ القُرآن. دِراسةٌ في المَدّ — تَبدَأُ بِالمَدِّ الأصليِّ الطَّبيعيّ: حُروفِهِ، ومِقدارِه، وكَيفَ يُطَبَّق.",
  },
  quranSurahs: ["Al-Muzzammil 4", "Al-Fatihah 1-7", "Al-Ikhlas 1-4"],
  sections: [
    {
      title: { en: "Why we learn tajwid and madd", ar: "لِماذا نَتَعَلَّمُ التَّجويدَ والمَدّ" },
      learningObjectives: [
        { en: "Explain the importance of reciting with tajwid.", ar: "أشرَحُ أهَمِّيّةَ التِّلاوةِ بِالتَّجويد." },
        { en: "Define madd and its three letters.", ar: "أُعَرِّفُ المَدَّ وحُروفَهُ الثَّلاثة." },
      ],
      successCriteria: [
        { en: "I can give evidence for reciting carefully (tartil).", ar: "أُقَدِّمُ دَليلَ التَّرتيلِ في التِّلاوة." },
        { en: "I can name the three letters of madd.", ar: "أُسَمّي حُروفَ المَدِّ الثَّلاثة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reciting the Qur'an beautifully.", ar: "طِفلٌ يَتلو القُرآنَ بِإتقان." },
        caption: { en: "'And recite the Qur'an with measured recitation.'", ar: "﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why precision matters", ar: "لِماذا يُهِمُّ الإتقان" },
        body: {
          en: "The rules of tajwid, like madd, control exactly how long each sound is held. Reflect: why would Allah's Book deserve such careful precision in its recitation, when ordinary speech is read casually? What does reciting with tartil teach us about how we should approach the words of Allah?",
          ar: "أحكامُ التَّجويد، كَالمَدّ، تَضبِطُ بِالضَّبطِ كَم يُمَدُّ كُلُّ صَوت. تَأمَّل: لِماذا يَستَحِقُّ كِتابُ اللهِ هذا الإتقانَ في تِلاوَتِه، بَينَما يُقرَأُ الكَلامُ العاديُّ بِلا تَدقيق؟ وماذا يُعَلِّمُنا التَّرتيلُ عن كَيفِ نَتَعامَلُ معَ كَلامِ الله؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Madd — elongation: prolonging the sound of a madd letter.", ar: "المَدّ — إطالةُ صَوتِ حَرفِ المَدّ." },
            { en: "Harakah — the count/beat used to measure madd length.", ar: "الحَرَكة — العَدّةُ التي يُقاسُ بِها طولُ المَدّ." },
          ],
        },
        {
          label: { en: "The three madd letters", ar: "حُروفُ المَدِّ الثَّلاثة" },
          lines: [
            { en: "Alif (ا) preceded by fatha; Waw (و) preceded by damma; Ya (ي) preceded by kasra.", ar: "الألِفُ (ا) قَبلَها فَتحة؛ الواوُ (و) قَبلَها ضَمّة؛ الياءُ (ي) قَبلَها كَسرة." },
          ],
        },
      ],
      body: {
        en: "The Qur'an is the literal speech of Allah, revealed to the Prophet Muhammad ﷺ in the clear Arabic tongue, and Allah has commanded that it be recited beautifully, carefully, and precisely, exactly as it was revealed. The science that governs the correct and beautiful recitation of the Qur'an is called tajwid, which linguistically means 'to do something well' or 'to make something excellent,' and technically means giving every letter its due rights — its correct point of articulation (makhraj), its proper characteristics (sifat), and the rulings that apply to it, such as elongation, merging, and clear pronunciation. Learning the rules of tajwid is of great importance because it preserves the Qur'an from error and distortion, ensures that we recite it as the Prophet ﷺ recited it (for he received it directly from the Angel Jibril, who received it from Allah), and allows us to recite it in the beautiful, measured way that Allah commanded. Allah Himself instructed His Prophet: 'And recite the Qur'an with measured, distinct recitation (tartil)' (Al-Muzzammil 4), meaning to recite it slowly, clearly, and with careful attention to each letter and rule, not rushing or slurring the words. The Prophet ﷺ recited in this beautiful, measured manner, prolonging where prolongation was due, and he praised beautiful recitation, saying, 'Beautify the Qur'an with your voices.' Thus reciting with tajwid is not a mere technical nicety; it is part of giving the Book of Allah the reverence, care, and excellence it deserves.\n\nAmong the most important and frequently applied rules of tajwid is the rule of madd, which means 'elongation' or 'prolongation' — the lengthening of the sound of certain letters when reciting. Madd occurs because of the three special letters known as the 'letters of madd' (huruf al-madd), which are: the alif (ا) when it is preceded by a letter carrying a fatha; the waw (و) with sukun when it is preceded by a letter carrying a damma; and the ya (ي) with sukun when it is preceded by a letter carrying a kasra. When you recite and come across one of these three letters in its proper condition, you do not pronounce it quickly like an ordinary letter; rather, you stretch and prolong its sound for a measured length of time. The length of this prolongation is measured in units called harakat (singular: harakah), where one harakah is roughly the time it takes to say one short vowel — about the time of opening or closing a finger at a steady pace. The rules of madd tell the reciter exactly how many harakat to hold each elongation, so that the recitation is consistent, correct, and beautiful, neither too short (which would change the meaning or sound) nor excessively long.\n\nUnderstanding madd is essential for any student of the Qur'an, because madd letters appear in almost every verse, and applying them correctly is fundamental to proper recitation. Consider how often the long vowel sounds appear: in 'Allah,' the long 'aa' is a madd; in 'ar-Rahman ar-Rahim,' there are several madd sounds; in 'qul huwa Allahu ahad' (Al-Ikhlas 1), the 'uu' in 'huwa' region and the long sounds all involve madd. Without knowing the rule of madd, a reciter would either rush through these elongations (making the recitation incorrect and unattractive) or stretch them inconsistently. The science of madd is therefore one of the cornerstones of tajwid, and scholars have divided it into two main categories: the original or natural madd (al-madd al-asli, also called al-madd al-tabi'i), which is the foundational, simple elongation, and the secondary or derived madd (al-madd al-far'i), which involves additional, longer elongations caused by special conditions (such as a hamza or sukun following the madd letter). In this lesson we focus first on the original, natural madd — the foundation upon which all other madd rules are built — and a demanding student should master it thoroughly, for it is the most common form of elongation in the entire Qur'an. In the next section we examine the original madd in detail: its exact measure, its conditions, and how to apply it correctly in recitation.",
        ar: "القُرآنُ كَلامُ اللهِ حَقيقةً، أُنزِلَ على النَّبِيِّ مُحَمَّدٍ ﷺ بِلِسانٍ عَرَبيٍّ مُبين، وقد أمَرَ اللهُ أن يُتلى تِلاوةً حَسَنةً مُتقَنةً مَضبوطةً كَما أُنزِل. والعِلمُ الذي يَحكُمُ تِلاوةَ القُرآنِ الصَّحيحةَ الجَميلةَ يُسَمّى التَّجويد، ومَعناهُ لُغةً «الإتقانُ والتَّحسين»، واصطِلاحًا إعطاءُ كُلِّ حَرفٍ حَقَّهُ — مِن مَخرَجِهِ الصَّحيح، وصِفاتِهِ، والأحكامِ التي تَلحَقُهُ كَالمَدِّ والإدغامِ والإظهار. وتَعَلُّمُ أحكامِ التَّجويدِ عَظيمُ الأهَمِّيّةِ لِأنَّهُ يَصونُ القُرآنَ مِنَ الخَطأِ والتَّحريف، ويَضمَنُ أن نَتلوَهُ كَما تَلاهُ النَّبِيُّ ﷺ (فَقَد تَلَقّاهُ مُباشَرةً مِن جِبريل، عنِ الله)، ويُتيحُ لَنا تِلاوَتَهُ بِالطَّريقةِ الجَميلةِ المُرَتَّلةِ التي أمَرَ بِها اللهُ. أمَرَ اللهُ نَبِيَّهُ: ﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤)، أي تَلاوَتَهُ بِتُؤَدةٍ ووُضوحٍ وعِنايةٍ بِكُلِّ حَرفٍ وحُكم، دونَ تَسَرُّعٍ أو خَلطٍ لِلكَلِمات. وكانَ النَّبِيُّ ﷺ يَتلو بِهذه الطَّريقةِ الجَميلةِ المُرَتَّلة، يَمُدُّ حَيثُ يَجِبُ المَدّ، وأثنى على التِّلاوةِ الحَسَنةِ فَقال: «زَيِّنوا القُرآنَ بِأصواتِكُم». فالتِّلاوةُ بِالتَّجويدِ ليسَت تَرَفًا تِقنيًّا؛ بل جُزءٌ مِن إعطاءِ كِتابِ اللهِ ما يَستَحِقُّهُ مِن تَوقيرٍ وعِنايةٍ وإتقان.\n\nومِن أهَمِّ أحكامِ التَّجويدِ وأكثَرِها تَطبيقًا حُكمُ المَدّ، ومَعناهُ «الإطالةُ» — أي إطالةُ صَوتِ حُروفٍ مُعَيَّنةٍ عِندَ التِّلاوة. ويَقَعُ المَدُّ بِسَبَبِ الحُروفِ الثَّلاثةِ الخاصّةِ المَعروفةِ بِـ«حُروفِ المَدّ»، وهي: الألِفُ (ا) إذا سَبَقَها حَرفٌ مَفتوح؛ والواوُ السّاكِنةُ (و) إذا سَبَقَها حَرفٌ مَضموم؛ والياءُ السّاكِنةُ (ي) إذا سَبَقَها حَرفٌ مَكسور. فإذا تَلَوتَ ومَرَرتَ بِأحَدِ هذه الحُروفِ الثَّلاثةِ بِشَرطِها، لا تَنطِقُها سَريعًا كَحَرفٍ عاديّ؛ بل تَمُدُّ صَوتَها وتُطيلُهُ مُدّةً مَضبوطة. ويُقاسُ طولُ هذه الإطالةِ بِوَحَداتٍ تُسَمّى الحَرَكات (مُفرَدُها حَرَكة)، والحَرَكةُ الواحِدةُ قَدرُ زَمَنِ نُطقِ حَرَكةٍ قَصيرة — نَحوُ زَمَنِ قَبضِ الإصبَعِ أو بَسطِهِ بِوَتيرةٍ ثابِتة. وتُخبِرُ أحكامُ المَدِّ القارِئَ كَم حَرَكةً يَمُدُّ كُلَّ مَدّ، حَتّى تَكونَ التِّلاوةُ مُتَّسِقةً صَحيحةً جَميلة، لا قَصيرةً جِدًّا (فَيَتَغَيَّرَ المَعنى أوِ الصَّوت) ولا مُفرِطةَ الطول.\n\nوفَهمُ المَدِّ ضَروريٌّ لِكُلِّ طالِبِ قُرآن، لِأنَّ حُروفَ المَدِّ تَرِدُ في كُلِّ آيةٍ تَقريبًا، وتَطبيقُها الصَّحيحُ أساسٌ لِلتِّلاوةِ السَّليمة. تَأمَّل كَم تَكثُرُ الأصواتُ الطَّويلة: في «اللَّه» المَدُّ في الألِفِ الطَّويلة؛ وفي «الرَّحمنِ الرَّحيم» عِدّةُ مُدود؛ وفي ﴿قُل هو اللهُ أحَد﴾ (الإخلاص ١) أصواتٌ طَويلةٌ كُلُّها مَدّ. وبِغَيرِ مَعرِفةِ حُكمِ المَدِّ إمّا أن يَتَسَرَّعَ القارِئُ في هذه المُدودِ (فَتَختَلَّ التِّلاوةُ وتَقبُح) أو يَمُدَّها بِلا اتِّساق. فَعِلمُ المَدِّ مِن أركانِ التَّجويد، وقد قَسَّمَهُ العُلَماءُ إلى نَوعَينِ رَئيسَين: المَدُّ الأصليُّ (ويُسَمّى الطَّبيعيّ)، وهو الإطالةُ الأساسيّةُ البَسيطة، والمَدُّ الفَرعيُّ، وهو إطالاتٌ إضافيّةٌ أطوَلُ بِسَبَبِ ظُروفٍ خاصّةٍ (كَهَمزةٍ أو سُكونٍ بَعدَ حَرفِ المَدّ). وفي هذا الدَّرسِ نُرَكِّزُ أوَّلًا على المَدِّ الأصليِّ الطَّبيعيّ — الأساسِ الذي تُبنى علَيهِ باقي أحكامِ المَدّ — وعلى الطّالِبِ المُجِدِّ أن يُتقِنَهُ تَمامًا، فَهو أكثَرُ صُوَرِ المَدِّ في القُرآنِ كُلِّه. وفي القِسمِ التّالي نَتَناوَلُ المَدَّ الأصليَّ بِالتَّفصيل: مِقدارَهُ بِالضَّبط، وشَرطَهُ، وكَيفَ يُطَبَّقُ صَحيحًا في التِّلاوة.",
      },
    },
    {
      title: { en: "The original (natural) madd in detail", ar: "المَدُّ الأصليُّ (الطَّبيعيُّ) بِالتَّفصيل" },
      learningObjectives: [
        { en: "Define the original madd and its measure.", ar: "أُعَرِّفُ المَدَّ الأصليَّ ومِقدارَه." },
        { en: "Apply the original madd in recitation.", ar: "أُطَبِّقُ المَدَّ الأصليَّ في التِّلاوة." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Books of knowledge — the science of tajwid.", ar: "كُتُبُ العِلم — عِلمُ التَّجويد." },
        caption: { en: "The natural madd is held for two harakat.", ar: "المَدُّ الطَّبيعيُّ يُمَدُّ حَرَكَتَين." },
      },
      groupTasks: {
        title: { en: "Mastering the natural madd", ar: "إتقانُ المَدِّ الطَّبيعيّ" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "definition-and-measure",
            name: { en: "Team A — Definition and measure", ar: "الفَريقُ أ — التَّعريفُ والمِقدار" },
            learningObjective: { en: "Explain the natural madd and its two-harakah length.", ar: "نَشرَحُ المَدَّ الطَّبيعيَّ ومِقدارَهُ حَرَكَتَين." },
            task: { en: "Explain the original madd (al-madd al-asli/al-tabi'i): it is the natural elongation where the madd letter has no hamza or sukun after it. Its measure is exactly two harakat (counts). Define harakah. List the three madd letters with their conditions (fatha-alif, damma-waw, kasra-ya).", ar: "اشرَحوا المَدَّ الأصليَّ (الطَّبيعيّ): هو الإطالةُ الطَّبيعيّةُ التي لا يَأتي بَعدَ حَرفِ المَدِّ فيها هَمزةٌ ولا سُكون. ومِقدارُهُ حَرَكَتانِ بِالضَّبط. عَرِّفوا الحَرَكة. عَدِّدوا حُروفَ المَدِّ الثَّلاثةَ بِشُروطِها (فَتحة-ألِف، ضَمّة-واو، كَسرة-ياء)." },
            evidence: [
              { en: "Examples: قَالَ، يَقُولُ، قِيلَ — each a natural madd of 2 harakat.", ar: "أمثِلة: قالَ، يَقولُ، قيلَ — كُلٌّ مَدٌّ طَبيعيٌّ حَرَكَتَين." },
            ],
            sourceNotes: [
              { en: "No hamza or sukun after the madd letter.", ar: "لا هَمزةَ ولا سُكونَ بَعدَ حَرفِ المَدّ." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Reciter.", ar: "الباحِث، الكاتِب، القارِئ." },
            ],
            finalProduct: { en: "A clear definition card with examples.", ar: "بِطاقةُ تَعريفٍ واضِحةٍ بِأمثِلة." },
          },
          {
            slug: "finding-madd-in-quran",
            name: { en: "Team B — Finding madd in the Qur'an", ar: "الفَريقُ ب — تَطبيقُ المَدِّ في القُرآن" },
            learningObjective: { en: "Identify and apply natural madd in short surahs.", ar: "نُحَدِّدُ ونُطَبِّقُ المَدَّ الطَّبيعيَّ في سُوَرٍ قَصيرة." },
            task: { en: "Take Surat Al-Fatihah and Surat Al-Ikhlas and find every original (natural) madd. Mark each madd letter and practise holding it for two counts. Show how correct madd makes the recitation beautiful and how rushing it spoils the meaning/sound. Recite a few verses applying the rule.", ar: "خُذوا سورةَ الفاتِحةِ وسورةَ الإخلاصِ وابحَثوا عن كُلِّ مَدٍّ أصليٍّ (طَبيعيّ). ضَعوا عَلامةً على كُلِّ حَرفِ مَدٍّ وتَدَرَّبوا على مَدِّهِ حَرَكَتَين. بَيِّنوا كَيفَ يُجَمِّلُ المَدُّ الصَّحيحُ التِّلاوةَ وكَيفَ يُفسِدُ التَّسَرُّعُ المَعنى/الصَّوت. اتلوا بِضعَ آياتٍ مُطَبِّقينَ الحُكم." },
            evidence: [
              { en: "Al-Fatihah, Al-Ikhlas — practical recitation practice.", ar: "الفاتِحة، الإخلاص — تَطبيقٌ عَمَليٌّ لِلتِّلاوة." },
            ],
            sourceNotes: [
              { en: "Practise with a teacher or recording to check.", ar: "التَّدَرُّبُ معَ مُعَلِّمٍ أو تَسجيلٍ لِلمُراجَعة." },
            ],
            memberRoles: [
              { en: "Researcher, Marker, Reciter.", ar: "الباحِث، المُعَلِّم، القارِئ." },
            ],
            finalProduct: { en: "A marked-up surah and a short recitation.", ar: "سورةٌ مُعَلَّمةٌ وتِلاوةٌ قَصيرة." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "My recitation and the Qur'an", ar: "تِلاوَتي والقُرآن" },
        prompt: { en: "Learning tajwid helps us recite Allah's Book correctly and beautifully. Write about why you think Allah wants the Qur'an recited with such care (tartil), and describe how learning the rule of madd will improve your own recitation. Set yourself a goal for practising your recitation of the Qur'an, and explain why giving care to reciting Allah's words is a form of honouring Him.", ar: "تَعَلُّمُ التَّجويدِ يُعينُنا على تِلاوةِ كِتابِ اللهِ صَحيحًا جَميلًا. اكتُبْ لِماذا تَرى أنَّ اللهَ يُريدُ تِلاوةَ القُرآنِ بِهذه العِنايةِ (التَّرتيل)، وصِفْ كَيفَ سَيُحَسِّنُ تَعَلُّمُ حُكمِ المَدِّ تِلاوَتَك. ضَعْ لِنَفسِكَ هَدَفًا لِلتَّدَرُّبِ على تِلاوةِ القُرآن، واشرَحْ لِماذا العِنايةُ بِتِلاوةِ كَلامِ اللهِ صورةٌ مِن تَوقيرِه." },
        placeholder: { en: "Allah wants careful recitation because... Learning madd will help me... My recitation goal is...", ar: "يُريدُ اللهُ التِّلاوةَ المُتقَنةَ لِأنَّ... وتَعَلُّمُ المَدِّ سَيُعينُني... وهَدَفي في التِّلاوةِ هو..." },
      },
      body: {
        en: "The original madd, known in Arabic as al-madd al-asli ('the foundational madd') or al-madd al-tabi'i ('the natural madd'), is the basic, simple form of elongation, and it is called 'natural' because it is the amount of elongation that the madd letter naturally requires for its sound to be complete — no more and no less. The defining feature of the original madd is what follows the madd letter: in the natural madd, the madd letter (alif, waw, or ya) is NOT followed by either a hamza (ء) or a sukun (a letter with no vowel). In other words, it is the 'pure' or 'simple' madd, free of the special conditions that would lengthen it further. Its measure is fixed and precise: the original madd is held for exactly two harakat (two counts/beats) — no longer and no shorter. Two harakat is roughly the duration of saying two short vowel sounds, or, as the scholars illustrate, about the time it takes to fold down two fingers at a moderate, even pace. Whenever a reciter encounters a natural madd, they smoothly prolong the madd letter's sound for this measure of two counts before moving on, giving the recitation its characteristic gentle, flowing rhythm.\n\nLet us see the natural madd in clear examples. In the word 'qaala' (قَالَ, 'he said'), the alif after the 'q' (which carries a fatha) is a natural madd: there is no hamza or sukun after it, so it is held for two counts — 'qaa-la.' In the word 'yaquulu' (يَقُولُ, 'he says'), the waw with sukun, preceded by the damma on the 'q', is a natural madd: 'ya-quu-lu,' held for two counts. In the word 'qeela' (قِيلَ, 'it was said'), the ya with sukun, preceded by the kasra on the 'q', is a natural madd: 'qee-la,' held for two counts. These three words — qaala, yaquulu, qeela — beautifully demonstrate the three madd letters (alif, waw, ya) each producing a natural madd of two harakat. Such examples are found throughout the Qur'an in enormous abundance. In Surat Al-Fatihah alone, the natural madd appears many times: in 'al-hamdu lillaahi' (the 'aa' in 'lillaahi'), in 'rabbil-'aalameen' (the 'aa' in "aalameen' and the 'ee' at the end), in 'maaliki' (the 'aa'), in 'ar-Rahmaani' (the 'aa'), and so on. Recognising and correctly applying this two-count elongation in all these places is what gives the recitation of Al-Fatihah its proper, beautiful sound.\n\nMastering the original madd is the essential first step in learning the science of madd, and indeed in learning tajwid as a whole, for several reasons that a demanding student should appreciate. First, it is by far the most common type of madd in the Qur'an, occurring in nearly every verse, so applying it correctly immediately improves and corrects the great majority of one's recitation. Second, it is the foundation upon which all the other, more complex madd rules are built; the secondary madd (al-madd al-far'i) is essentially the natural madd with additional length added because of a following hamza or sukun, so one cannot understand the longer madds without first mastering the natural one. Third, applying the natural madd consistently for exactly two counts — neither rushing it to one count nor stretching it to three or more — trains the reciter's ear and tongue in the discipline and precision that tajwid requires. The goal of all of this is to recite the Qur'an as it was revealed and as the Prophet ﷺ recited it: beautifully, correctly, and with reverence. Learning these rules is therefore an act of love and honour for the Book of Allah, and the reward is great, for the Prophet ﷺ said, 'The one who is proficient in the Qur'an will be with the noble, righteous scribes (angels), and the one who recites the Qur'an and struggles with it, finding it difficult, will have a double reward' (Bukhari and Muslim). A demanding student should commit to learning and practising the rules of madd diligently, beginning with the natural madd, under the guidance of a teacher where possible, so that their recitation of Allah's words becomes ever more correct, beautiful, and pleasing to the One who revealed them.",
        ar: "المَدُّ الأصليُّ، ويُسَمّى بِالعَرَبيّةِ «المَدَّ الأصليَّ» أوِ «الطَّبيعيَّ»، هو الصورةُ الأساسيّةُ البَسيطةُ لِلإطالة، وسُمّيَ «طَبيعيًّا» لِأنَّهُ القَدرُ الذي يَحتاجُهُ حَرفُ المَدِّ طَبعًا لِيَكتَمِلَ صَوتُه — لا أكثَرَ ولا أقَلّ. والسِّمةُ الفارِقةُ لِلمَدِّ الأصليِّ ما يَأتي بَعدَ حَرفِ المَدّ: ففي المَدِّ الطَّبيعيِّ لا يَأتي بَعدَ حَرفِ المَدِّ (الألِفِ أوِ الواوِ أوِ الياء) هَمزةٌ (ء) ولا سُكون. أي إنَّهُ المَدُّ «الخالِصُ» البَسيط، الخالي مِنَ الظُّروفِ الخاصّةِ التي تَزيدُهُ طولًا. ومِقدارُهُ ثابِتٌ مَضبوط: يُمَدُّ المَدُّ الأصليُّ حَرَكَتَينِ بِالضَّبط — لا أطوَلَ ولا أقصَر. والحَرَكَتانِ نَحوُ زَمَنِ نُطقِ حَرَكَتَينِ قَصيرَتَين، أو كَما يُمَثِّلُ العُلَماءُ نَحوُ زَمَنِ قَبضِ إصبَعَينِ بِوَتيرةٍ مُعتَدِلةٍ مُتساوية. فَكُلَّما مَرَّ القارِئُ بِمَدٍّ طَبيعيٍّ مَدَّ صَوتَ حَرفِ المَدِّ بِسَلاسةٍ هذا المِقدارَ حَرَكَتَينِ قَبلَ أن يُكمِل، ما يُعطي التِّلاوةَ إيقاعَها اللَّطيفَ المُنسابَ المُمَيِّز.\n\nولْنَرَ المَدَّ الطَّبيعيَّ في أمثِلةٍ واضِحة. في كَلِمةِ «قالَ» الألِفُ بَعدَ القافِ المَفتوحةِ مَدٌّ طَبيعيّ: لا هَمزةَ ولا سُكونَ بَعدَها، فَتُمَدُّ حَرَكَتَين — «قا-لَ». وفي كَلِمةِ «يَقولُ» الواوُ السّاكِنةُ بَعدَ القافِ المَضمومةِ مَدٌّ طَبيعيّ: «يَـ-قو-لُ» حَرَكَتَين. وفي كَلِمةِ «قيلَ» الياءُ السّاكِنةُ بَعدَ القافِ المَكسورةِ مَدٌّ طَبيعيّ: «قي-لَ» حَرَكَتَين. وهذه الكَلِماتُ الثَّلاث — قالَ، يَقولُ، قيلَ — تُجَسِّدُ حُروفَ المَدِّ الثَّلاثةَ (الألِف، الواو، الياء) كُلٌّ يُنتِجُ مَدًّا طَبيعيًّا حَرَكَتَين. وهذه الأمثِلةُ مَوجودةٌ في القُرآنِ بِكَثرةٍ هائِلة. ففي سورةِ الفاتِحةِ وَحدَها يَرِدُ المَدُّ الطَّبيعيُّ مِرارًا: في «الحَمدُ لِلّهِ» (الألِفُ في «لِلّهِ»)، وفي «رَبِّ العالَمين» (الألِفُ في «العالَمين» والياءُ في آخِرِها)، وفي «مالِكِ» (الألِف)، وفي «الرَّحمنِ» (الألِف)، وهكَذا. وإدراكُ هذا المَدِّ حَرَكَتَينِ وتَطبيقُهُ صَحيحًا في كُلِّ هذه المَواضِعِ هو ما يُعطي تِلاوةَ الفاتِحةِ صَوتَها الصَّحيحَ الجَميل.\n\nوإتقانُ المَدِّ الأصليِّ هو الخُطوةُ الأولى الضَّروريّةُ في تَعَلُّمِ عِلمِ المَدّ، بل في تَعَلُّمِ التَّجويدِ كُلِّه، لِأسبابٍ على الطّالِبِ المُجِدِّ أن يُقَدِّرَها. أوَّلًا، هو أكثَرُ أنواعِ المَدِّ شُيوعًا في القُرآنِ بِفارِقٍ كَبير، يَرِدُ في كُلِّ آيةٍ تَقريبًا، فَتَطبيقُهُ الصَّحيحُ يُصَحِّحُ ويُحَسِّنُ فَورًا مُعظَمَ التِّلاوة. ثانيًا، هو الأساسُ الذي تُبنى علَيهِ سائِرُ أحكامِ المَدِّ الأعقَد؛ فالمَدُّ الفَرعيُّ في جَوهَرِهِ مَدٌّ طَبيعيٌّ أُضيفَ إلَيهِ طولٌ بِسَبَبِ هَمزةٍ أو سُكونٍ تالٍ، فَلا يُفهَمُ المُدودُ الأطوَلُ دونَ إتقانِ الطَّبيعيِّ أوَّلًا. ثالِثًا، تَطبيقُ المَدِّ الطَّبيعيِّ بِاتِّساقٍ حَرَكَتَينِ بِالضَّبط — لا تَسَرُّعًا إلى حَرَكةٍ ولا مَطًّا إلى ثَلاثٍ فَأكثَر — يُدَرِّبُ أُذُنَ القارِئِ ولِسانَهُ على الانضِباطِ والإتقانِ الذي يَتَطَلَّبُهُ التَّجويد. والغايةُ مِن هذا كُلِّهِ تِلاوةُ القُرآنِ كَما أُنزِلَ وكَما تَلاهُ النَّبِيُّ ﷺ: جَميلةً صَحيحةً بِتَوقير. فَتَعَلُّمُ هذه الأحكامِ عَمَلُ مَحَبّةٍ وتَوقيرٍ لِكِتابِ الله، وأجرُهُ عَظيم، قالَ النَّبِيُّ ﷺ: «الماهِرُ بِالقُرآنِ معَ السَّفَرةِ الكِرامِ البَرَرة، والذي يَقرَأُ القُرآنَ ويَتَتَعتَعُ فيهِ وهو علَيهِ شاقٌّ لَهُ أجران» (البخاري ومسلم). وعلى الطّالِبِ المُجِدِّ أن يَلتَزِمَ تَعَلُّمَ أحكامِ المَدِّ وتَطبيقَها بِجِدٍّ، بادِئًا بِالمَدِّ الطَّبيعيِّ، بِتَوجيهِ مُعَلِّمٍ ما أمكَن، حَتّى تَصيرَ تِلاوَتُهُ لِكَلامِ اللهِ أصَحَّ وأجمَلَ وأرضى لِمَن أنزَلَه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does 'tajwid' mean?", ar: "ما مَعنى «التَّجويد»؟" },
      options: [
        { en: "To do well / give each letter its rights", ar: "الإتقانُ / إعطاءُ كُلِّ حَرفٍ حَقَّه" },
        { en: "To recite quickly", ar: "التِّلاوةُ بِسُرعة" },
        { en: "To translate", ar: "التَّرجَمة" },
        { en: "To memorise only", ar: "الحِفظُ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Tajwid = excellence: giving letters their due.", ar: "التَّجويد = الإتقان: إعطاءُ الحُروفِ حَقَّها." },
    },
    {
      prompt: { en: "What are the three letters of madd?", ar: "ما حُروفُ المَدِّ الثَّلاثة؟" },
      options: [
        { en: "Alif, Waw, Ya (with their conditions)", ar: "الألِف، الواو، الياء (بِشُروطِها)" },
        { en: "Ba, Ta, Tha", ar: "الباء، التاء، الثاء" },
        { en: "Mim, Nun, Lam", ar: "الميم، النون، اللام" },
        { en: "Hamza, Sukun, Shadda", ar: "الهَمزة، السُّكون، الشَّدّة" },
      ],
      correctIndex: 0,
      explanation: { en: "Alif after fatha, waw after damma, ya after kasra.", ar: "الألِفُ بَعدَ فَتحة، الواوُ بَعدَ ضَمّة، الياءُ بَعدَ كَسرة." },
    },
    {
      prompt: { en: "What is the measure of the original (natural) madd?", ar: "ما مِقدارُ المَدِّ الأصليِّ (الطَّبيعيِّ)؟" },
      options: [
        { en: "Two harakat (counts)", ar: "حَرَكَتان" },
        { en: "Six harakat", ar: "سِتُّ حَرَكات" },
        { en: "No elongation", ar: "بِلا مَدّ" },
        { en: "Ten harakat", ar: "عَشرُ حَرَكات" },
      ],
      correctIndex: 0,
      explanation: { en: "The natural madd is exactly two counts.", ar: "المَدُّ الطَّبيعيُّ حَرَكَتانِ بِالضَّبط." },
    },
    {
      prompt: { en: "When is a madd a NATURAL (original) madd?", ar: "مَتى يَكونُ المَدُّ طَبيعيًّا (أصليًّا)؟" },
      options: [
        { en: "When no hamza or sukun follows the madd letter", ar: "إذا لم يَأتِ بَعدَ حَرفِ المَدِّ هَمزةٌ ولا سُكون" },
        { en: "When a hamza follows it", ar: "إذا تَلاهُ هَمزة" },
        { en: "When a sukun follows it", ar: "إذا تَلاهُ سُكون" },
        { en: "Always six counts", ar: "دائِمًا سِتُّ حَرَكات" },
      ],
      correctIndex: 0,
      explanation: { en: "A following hamza or sukun makes it a secondary madd.", ar: "الهَمزةُ أوِ السُّكونُ التالي يَجعَلُهُ فَرعيًّا." },
    },
    {
      prompt: { en: "Which word contains a natural madd?", ar: "أيُّ كَلِمةٍ فيها مَدٌّ طَبيعيّ؟" },
      options: [
        { en: "qaala (قَالَ)", ar: "قالَ" },
        { en: "a word with no long vowels", ar: "كَلِمةٌ بِلا حُروفِ مَدّ" },
        { en: "min (مِن)", ar: "مِن" },
        { en: "lam (لَم)", ar: "لَم" },
      ],
      correctIndex: 0,
      explanation: { en: "The alif in 'qaala' is a natural madd of two counts.", ar: "الألِفُ في «قالَ» مَدٌّ طَبيعيٌّ حَرَكَتَين." },
    },
    {
      prompt: { en: "True or False: Allah commanded reciting the Qur'an with tartil (measured recitation).", ar: "صَوابٌ أم خَطأ: أمَرَ اللهُ بِتِلاوةِ القُرآنِ تَرتيلًا." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "'And recite the Qur'an with measured recitation' (Al-Muzzammil 4).", ar: "﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤)." },
    },
  ],
};
