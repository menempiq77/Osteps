import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const obligationsOfPrayer: CourseLesson = {
  slug: "g6y7-obligations-sunnahs-disliked-acts-of-prayer",
  name: {
    en: "The Obligations, Sunnahs, and Disliked Acts of Prayer",
    ar: "فَرائِضُ الصَّلاةِ وَسُنَنُها وَمَكْروهاتُها",
  },
  shortIntro: {
    en: "A clear fiqh lesson distinguishing the pillars (arkan) of prayer from its recommended sunnahs and its disliked acts.",
    ar: "دَرسٌ فِقهِيٌّ واضِحٌ يُمَيِّزُ أركانَ الصَّلاةِ عن سُنَنِها ومَكروهاتِها.",
  },
  quranSurahs: ["Al-Baqarah 238", "Al-Mu'minun 1-2"],
  sections: [
    {
      title: { en: "Why classify the acts of prayer?", ar: "لِماذا نُصَنِّفُ أفعالَ الصَّلاة؟" },
      learningObjectives: [
        { en: "Distinguish a fard (obligation) from a sunnah and a makruh act.", ar: "أُمَيِّزُ الفَرضَ عنِ السُّنّةِ وعنِ المَكروه." },
        { en: "Understand that missing a pillar invalidates the prayer.", ar: "أُدرِكُ أنَّ تَركَ رُكنٍ يُبطِلُ الصَّلاة." },
      ],
      successCriteria: [
        { en: "I can list key pillars of the prayer in order.", ar: "أُعَدِّدُ أهَمَّ أركانِ الصَّلاةِ بِتَرتيبِها." },
        { en: "I can give an example of a sunnah and a makruh.", ar: "أُعطي مِثالًا لِسُنّةٍ ومِثالًا لِمَكروه." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque prayer hall.", ar: "مُصَلّى مَسجِد." },
        caption: { en: "Knowing the parts of prayer makes our worship correct and complete.", ar: "مَعرِفةُ أجزاءِ الصَّلاةِ تَجعَلُ عِبادَتَنا صَحيحةً تامّة." },
      },
      callout: {
        label: { en: "Discuss", ar: "ناقِش" },
        title: { en: "Two prayers, different quality", ar: "صَلاتانِ بِجَودةٍ مُختَلِفة" },
        body: {
          en: "Two students pray. Both fulfil the pillars, but one also performs the sunnahs with focus while the other rushes. Both prayers are valid — so why does Islam still encourage the sunnahs?",
          ar: "يُصَلّي طالِبان. كِلاهُما يُؤَدّي الأركان، لكِنَّ أحَدَهُما يُؤَدّي السُّنَنَ بِخُشوعٍ والآخَرَ يَعجَل. كِلتا الصَّلاتَينِ صَحيحة — فَلِماذا يُرَغِّبُ الإسلامُ في السُّنَنِ مَعَ ذلِك؟",
        },
      },
      body: {
        en: "Scholars classify the acts of prayer to help us pray correctly. The arkan (pillars/obligations) must be done — leaving one without excuse invalidates the prayer. The sunnahs are strongly recommended acts that increase reward and perfect the prayer; missing them does not invalidate it. The makruhat are disliked acts that reduce the prayer's reward and focus without breaking it. Knowing the difference protects our worship.",
        ar: "يُصَنِّفُ العُلَماءُ أفعالَ الصَّلاةِ لِنُصَلّيَ صَحيحًا. فالأركانُ (الفَرائِض) لا بُدَّ مِنها — وتَركُ واحِدٍ بِلا عُذرٍ يُبطِلُ الصَّلاة. والسُّنَنُ أفعالٌ مُستَحَبّةٌ تَزيدُ الأجرَ وتُكَمِّلُ الصَّلاة، وتَركُها لا يُبطِلُها. والمَكروهاتُ أفعالٌ تُنقِصُ أجرَ الصَّلاةِ وخُشوعَها دونَ أن تُبطِلَها. ومَعرِفةُ الفَرقِ تَحفَظُ عِبادَتَنا.",
      },
    },
    {
      title: { en: "The pillars (arkan / fara'id)", ar: "الأركانُ (الفَرائِض)" },
      image: {
        src: IMG.childQuran,
        alt: { en: "Learning the essentials of prayer.", ar: "تَعَلُّمُ أساسيّاتِ الصَّلاة." },
      },
      infoBoxes: [
        {
          label: { en: "Key pillars", ar: "أبرَزُ الأركان" },
          lines: [
            { en: "Standing if able; the opening takbir (Allahu akbar)", ar: "القِيامُ مَعَ القُدرة؛ وتَكبيرةُ الإحرام" },
            { en: "Reciting Al-Fatihah; bowing (ruku') with stillness", ar: "قِراءةُ الفاتِحة؛ والرُّكوعُ مَعَ الطُّمَأنينة" },
            { en: "Prostration (sujud) on the seven limbs; sitting between the two prostrations", ar: "السُّجودُ على الأعضاءِ السَّبعة؛ والجُلوسُ بَينَ السَّجدَتَين" },
            { en: "The final tashahhud and sitting for it; the final salam; order and stillness (tuma'ninah)", ar: "التَّشَهُّدُ الأخيرُ والجُلوسُ له؛ والتَّسليم؛ والتَّرتيبُ والطُّمَأنينة" },
          ],
        },
      ],
      body: {
        en: "The pillars are the essential parts without which the prayer is not valid. They include standing (for the able), the opening takbir, reciting Al-Fatihah, bowing, rising, prostrating on the seven limbs, sitting between the two prostrations, the final tashahhud, the closing salam, and doing all of this in order with tuma'ninah (stillness). The Prophet ﷺ told the man who prayed badly to repeat his prayer until he prayed with calm and order — proof that stillness is a pillar, not an option.",
        ar: "الأركانُ هي الأجزاءُ التي لا تَصِحُّ الصَّلاةُ بِدونِها. ومِنها: القِيامُ للقادِر، وتَكبيرةُ الإحرام، وقِراءةُ الفاتِحة، والرُّكوع، والرَّفعُ مِنه، والسُّجودُ على الأعضاءِ السَّبعة، والجُلوسُ بَينَ السَّجدَتَين، والتَّشَهُّدُ الأخير، والتَّسليم، وفِعلُ ذلِكَ مُرَتَّبًا مَعَ الطُّمَأنينة. وقد أمَرَ النَّبِيُّ ﷺ المُسيءَ صَلاتَهُ أن يُعيدَها حتّى يُصَلّيَ بِطُمَأنينةٍ وتَرتيب — دَليلٌ على أنَّ الطُّمَأنينةَ رُكنٌ لا خِيار.",
      },
    },
    {
      title: { en: "The sunnahs of prayer", ar: "سُنَنُ الصَّلاة" },
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern, the extra light of sunnahs.", ar: "فانوسٌ، نورُ السُّنَنِ الزّائِد." },
      },
      infoBoxes: [
        {
          label: { en: "Examples of sunnahs", ar: "أمثِلةُ السُّنَن" },
          lines: [
            { en: "Opening supplication (du'a al-istiftah); saying 'amin'", ar: "دُعاءُ الاستِفتاح؛ وقَولُ «آمين»" },
            { en: "Reciting a surah after Al-Fatihah; the tasbih in ruku' and sujud", ar: "قِراءةُ سورةٍ بعدَ الفاتِحة؛ والتَّسبيحُ في الرُّكوعِ والسُّجود" },
            { en: "Placing the right hand over the left; looking at the place of prostration", ar: "وَضعُ اليُمنى على اليُسرى؛ والنَّظَرُ لِمَوضِعِ السُّجود" },
          ],
        },
      ],
      body: {
        en: "The sunnahs are acts the Prophet ﷺ regularly did that beautify and complete the prayer and earn extra reward, but leaving one does not invalidate the prayer. Examples include the opening du'a, saying 'amin' after Al-Fatihah, reciting a surah after it, the words of glorification in bowing and prostration, and placing the right hand over the left. A wise worshipper does not treat sunnahs as unimportant — they are the Prophet's beloved guidance and the source of khushu' (focus).",
        ar: "السُّنَنُ أفعالٌ كانَ النَّبِيُّ ﷺ يُداوِمُ عَلَيها تُجَمِّلُ الصَّلاةَ وتُكَمِّلُها وتَزيدُ الأجر، وتَركُ واحِدٍ مِنها لا يُبطِلُ الصَّلاة. ومِنها: دُعاءُ الاستِفتاح، وقَولُ «آمين» بعدَ الفاتِحة، وقِراءةُ سورةٍ بعدَها، والتَّسبيحُ في الرُّكوعِ والسُّجود، ووَضعُ اليُمنى على اليُسرى. والمُصَلّي الفَطِنُ لا يَستَهينُ بالسُّنَن — فهي هَديُ النَّبِيِّ ﷺ ومَصدَرُ الخُشوع.",
      },
    },
    {
      title: { en: "The disliked acts (makruhat)", ar: "مَكروهاتُ الصَّلاة" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "Clear sky, like a focused prayer.", ar: "سَماءٌ صافية، كَصَلاةٍ خاشِعة." },
      },
      callout: {
        label: { en: "Critical thinking", ar: "تَفكيرٌ ناقِد" },
        title: { en: "The wandering heart", ar: "القَلبُ السّاهي" },
        body: {
          en: "Fidgeting, looking around, and praying while hungry or needing the toilet are disliked because they harm khushu'. Why does Islam care so much about the quality of our focus, not only the correctness of our movements?",
          ar: "العَبَثُ، والالتِفات، والصَّلاةُ مَعَ الجوعِ أو الحاجةِ لِدَخولِ الخَلاءِ مَكروهةٌ لأنَّها تُضعِفُ الخُشوع. لِماذا يَهتَمُّ الإسلامُ بِجَودةِ خُشوعِنا لا بِصِحّةِ حَرَكاتِنا فَقَط؟",
        },
      },
      responsePrompt: {
        title: { en: "Improve my prayer", ar: "أُحَسِّنُ صَلاتي" },
        prompt: {
          en: "Name two makruh habits you can remove from your prayer and one sunnah you will add to increase your khushu'.",
          ar: "اذكُرْ عادَتَينِ مَكروهَتَينِ سَتَترُكُهُما مِن صَلاتِك، وسُنّةً واحِدةً سَتُضيفُها لِزيادةِ خُشوعِك.",
        },
        placeholder: { en: "I will stop... and I will start...", ar: "سَأترُكُ... وسَأبدَأُ..." },
        buttonLabel: { en: "Save response", ar: "احفَظِ الإجابة" },
      },
      body: {
        en: "The makruhat are acts that are disliked in prayer: unnecessary movement and fidgeting, looking around, resting on one foot carelessly, yawning loudly, and praying when distracted by hunger or the need to use the toilet. They do not break the prayer, but they reduce its reward and weaken khushu'. Islam wants our prayer to be not just valid but also alive — a true connection with Allah, with a calm body and a present heart.",
        ar: "المَكروهاتُ أفعالٌ تُكرَهُ في الصَّلاة: كَكَثرةِ الحَرَكةِ والعَبَث، والالتِفات، والاعتِمادِ على رِجلٍ بِلا حاجة، والتَّثاؤُبِ بِصَوت، والصَّلاةِ مَعَ الانشِغالِ بِجوعٍ أو حاجةٍ لِدَخولِ الخَلاء. وهي لا تُبطِلُ الصَّلاةَ لكِنَّها تُنقِصُ أجرَها وتُضعِفُ الخُشوع. ويُريدُ الإسلامُ صَلاتَنا صَحيحةً وحَيّةً معًا — صِلةً حَقيقيّةً باللهِ بِبَدَنٍ ساكِنٍ وقَلبٍ حاضِر.",
      },
    },
    {
      title: { en: "Praying as the Prophet ﷺ prayed", ar: "نُصَلّي كَما صَلّى النَّبِيُّ ﷺ" },
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Stillness like a steady mountain.", ar: "طُمَأنينةٌ كَجَبَلٍ راسِخ." },
      },
      body: {
        en: "The Prophet ﷺ said: 'Pray as you have seen me pray.' So we keep the pillars carefully, add the sunnahs lovingly, and remove the disliked acts. The result is the prayer Allah described: 'Certainly will the believers have succeeded — those who are humbly submissive in their prayer.' Our goal is not only a prayer that counts, but a prayer that transforms us and brings us closer to our Lord.",
        ar: "قال النَّبِيُّ ﷺ: «صَلّوا كَما رَأيتُموني أُصَلّي». فَنَحفَظُ الأركانَ بِعِنايةٍ، ونُضيفُ السُّنَنَ بِمَحَبّة، ونَترُكُ المَكروهات. فَتَكونُ النَّتيجةُ الصَّلاةَ التي وَصَفَها اللهُ: ﴿قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ﴾. وهَدَفُنا ليسَ صَلاةً تُجزِئُ فَحَسب، بل صَلاةً تُغَيِّرُنا وتُقَرِّبُنا مِن رَبِّنا.",
      },
    },
  ],
  quizQuestions: [],
};
