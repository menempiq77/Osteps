import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const pillarsOfIslam: CourseLesson = {
  slug: "g1y2-pillars-of-islam",
  name: { en: "The Pillars of Islam", ar: "أركان الإسلامِ" },
  shortIntro: {
    en: "Islam is built on five great pillars. Let us learn what they are and why they are so important.",
    ar: "الإسلامُ مَبنيٌّ على خَمسةِ أركانٍ عَظيمة. لِنَتَعَلَّمَ ما هي ولِماذا هي مُهِمّةٌ جِدًّا.",
  },
  quranSurahs: [],
  sections: [
    {
      title: { en: "Islam has five pillars", ar: "للإسلامِ خَمسةُ أركان" },
      learningObjective: {
        en: "I can name the five pillars of Islam.",
        ar: "أستَطيعُ أن أُسَمِّيَ أركانَ الإسلامِ الخَمسة.",
      },
      image: {
        src: IMG.grandMosque,
        alt: { en: "A great mosque standing strong on its pillars.", ar: "مَسجِدٌ عَظيمٌ يَقِفُ قَوِيًّا على أعمِدَتِه." },
        caption: { en: "Like a strong building, Islam stands on five pillars.", ar: "كالبِناءِ القَوِيّ، يَقومُ الإسلامُ على خَمسةِ أركان." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"Islam is built upon five...\" (Bukhari & Muslim)", ar: "قال النَّبِيُّ ﷺ: «بُنِيَ الإسلامُ على خَمسٍ...». (متفق عليه)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ told us that Islam is built on five pillars, like a strong house standing on strong pillars. The five pillars are: (1) the Shahada, (2) Salah (prayer), (3) Zakah (giving charity), (4) Sawm (fasting Ramadan), and (5) Hajj (pilgrimage to Makkah).",
        ar: "أخبَرَنا نَبِيُّنا ﷺ أنَّ الإسلامَ مَبنيٌّ على خَمسةِ أركان، كالبَيتِ القَوِيِّ الذي يَقومُ على أعمِدةٍ قَوِيّة. والأركانُ الخَمسةُ هي: (١) الشَّهادة، (٢) الصَّلاة، (٣) الزَّكاة، (٤) الصَّوم، (٥) الحَجّ.",
      },
    },
    {
      title: { en: "1) The Shahada", ar: "١) الشَّهادة" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A clear open sky.", ar: "سَماءٌ صافِيةٌ مَفتوحة." },
      },
      infoBoxes: [
        {
          label: { en: "The Shahada", ar: "الشَّهادة" },
          lines: [
            { en: "\"There is no god but Allah, and Muhammad is the Messenger of Allah.\"", ar: "«أشهَدُ أن لا إلهَ إلّا اللهُ، وأشهَدُ أنَّ مُحمَّدًا رَسولُ الله»" },
          ],
        },
      ],
      body: {
        en: "The first pillar is the Shahada. It means I believe with my heart and say with my tongue: there is no god worthy of worship except Allah, and Muhammad ﷺ is His Messenger. The Shahada is the key that makes a person a Muslim.",
        ar: "الرُّكنُ الأوّلُ هو الشَّهادة. ومَعناها أنّي أُؤمِنُ بِقَلبي وأقولُ بِلِساني: لا مَعبودَ بِحَقٍّ إلّا اللهُ، ومُحمَّدٌ ﷺ رَسولُهُ. والشَّهادةُ هي المِفتاحُ الذي يَجعَلُ الإنسانَ مُسلِمًا.",
      },
    },
    {
      title: { en: "2) Salah and 3) Zakah", ar: "٢) الصَّلاة و٣) الزَّكاة" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child learning about worship.", ar: "طِفلٌ يَتَعَلَّمُ عنِ العِبادة." },
      },
      body: {
        en: "The second pillar is Salah: we pray to Allah five times every day. Prayer keeps us close to Allah and is the light of our life. The third pillar is Zakah: rich Muslims give a small part of their money to the poor every year. Zakah cleans our money and helps people in need. Allah loves those who give and share.",
        ar: "الرُّكنُ الثّاني هو الصَّلاة: نُصَلّي لله خَمسَ مَرّاتٍ كُلَّ يَوم. والصَّلاةُ تُبقينا قَريبينَ مِنَ اللهِ وهي نورُ حَياتِنا. والرُّكنُ الثّالِثُ هو الزَّكاة: يُعطي الأغنياءُ مِنَ المُسلِمينَ جُزءًا صَغيرًا مِن مالِهِم للفُقَراءِ كُلَّ عام. والزَّكاةُ تُطَهِّرُ المالَ وتُساعِدُ المُحتاجين. واللهُ يُحِبُّ مَن يُعطي ويُشارِك.",
      },
    },
    {
      title: { en: "4) Sawm and 5) Hajj", ar: "٤) الصَّوم و٥) الحَجّ" },
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern that reminds us of Ramadan.", ar: "فانوسٌ يُذَكِّرُنا بِرَمَضان." },
      },
      body: {
        en: "The fourth pillar is Sawm: in the month of Ramadan, grown-up Muslims do not eat or drink from dawn until sunset. Fasting teaches us patience and to feel for hungry people. The fifth pillar is Hajj: once in a lifetime, Muslims who are able travel to the Kaaba in Makkah to worship Allah together. Millions of Muslims stand side by side, all loving the one Lord, Allah.",
        ar: "الرُّكنُ الرّابِعُ هو الصَّوم: في شَهرِ رَمَضانَ لا يَأكُلُ المُسلِمونَ الكِبارُ ولا يَشرَبونَ مِنَ الفَجرِ حتّى غُروبِ الشَّمس. والصِّيامُ يُعَلِّمُنا الصَّبرَ والإحساسَ بالجائِعين. والرُّكنُ الخامِسُ هو الحَجّ: يُسافِرُ المُسلِمونَ القادِرونَ مَرّةً في العُمُرِ إلى الكَعبةِ في مَكّةَ لِيَعبُدوا اللهَ مَعًا. يَقِفُ المَلايينُ جَنبًا إلى جَنب، كُلُّهُم يُحِبّونَ الرَّبَّ الواحِدَ، الله.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.familyHelp,
        alt: { en: "A family doing good together.", ar: "أُسرةٌ تَفعَلُ الخَيرَ مَعًا." },
      },
      callout: {
        label: { en: "Think with me", ar: "فَكِّرْ مَعي" },
        title: { en: "Which pillar can I start now?", ar: "أيُّ رُكنٍ يُمكِنُني أن أبدَأَ بهِ الآن؟" },
        body: {
          en: "I am still young, but I can learn the Shahada, practise my prayers with my family, and share my food and toys with others (like Zakah). Small good habits today help me become a strong Muslim tomorrow.",
          ar: "ما زِلتُ صَغيرًا، لكِنّي أستَطيعُ أن أتَعَلَّمَ الشَّهادة، وأتَدَرَّبَ على الصَّلاةِ مَعَ أُسرَتي، وأُشارِكَ طَعامي وألعابي مَعَ غَيري (مِثلَ الزَّكاة). العاداتُ الطَّيِّبةُ الصَّغيرةُ اليَومَ تَجعَلُني مُسلِمًا قَوِيًّا غَدًا.",
        },
      },
      responsePrompt: {
        title: { en: "My plan", ar: "خُطَّتي" },
        prompt: {
          en: "Choose one pillar you will practise this week and say how (for example: I will pray with my family).",
          ar: "اختَرْ رُكنًا واحِدًا سَتَتَدَرَّبُ عَلَيهِ هذا الأُسبوع وقُلْ كَيف (مَثَلًا: سأُصَلّي مَعَ أُسرَتي).",
        },
        placeholder: { en: "This week I will...", ar: "هذا الأُسبوعَ سأ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "The five pillars hold up our beautiful religion. When we learn them and practise them, we grow closer to Allah and become good Muslims who help others.",
        ar: "الأركانُ الخَمسةُ تَحمِلُ دينَنا الجَميل. وعِندَما نَتَعَلَّمُها ونَعمَلُ بِها نَقتَرِبُ مِنَ اللهِ ونُصبِحُ مُسلِمينَ طَيِّبينَ يُساعِدونَ غَيرَهُم.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "How many pillars does Islam have?", ar: "كَم رُكنًا للإسلام؟" },
      options: [
        { en: "Five", ar: "خَمسة" },
        { en: "Two", ar: "اثنان" },
        { en: "Ten", ar: "عَشَرة" },
      ],
      correctIndex: 0,
      explanation: { en: "Islam is built on five pillars.", ar: "الإسلامُ مَبنيٌّ على خَمسةِ أركان." },
    },
    {
      prompt: { en: "What is the first pillar of Islam?", ar: "ما هو الرُّكنُ الأوّلُ للإسلام؟" },
      options: [
        { en: "The Shahada", ar: "الشَّهادة" },
        { en: "Hajj", ar: "الحَجّ" },
        { en: "Zakah", ar: "الزَّكاة" },
      ],
      correctIndex: 0,
      explanation: { en: "The Shahada is the first pillar: there is no god but Allah, and Muhammad is His Messenger.", ar: "الشَّهادةُ هي الرُّكنُ الأوّل: لا إلهَ إلّا اللهُ، ومُحمَّدٌ رَسولُ الله." },
    },
    {
      prompt: { en: "Which pillar means praying to Allah every day?", ar: "أيُّ رُكنٍ يَعني الصَّلاةَ لله كُلَّ يَوم؟" },
      options: [
        { en: "Salah", ar: "الصَّلاة" },
        { en: "Sawm", ar: "الصَّوم" },
        { en: "Hajj", ar: "الحَجّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Salah is praying to Allah five times a day.", ar: "الصَّلاةُ هي العِبادةُ لله خَمسَ مَرّاتٍ في اليَوم." },
    },
    {
      prompt: { en: "In which month do Muslims fast (Sawm)?", ar: "في أيِّ شَهرٍ يَصومُ المُسلِمون؟" },
      options: [
        { en: "Ramadan", ar: "رَمَضان" },
        { en: "Any month they like", ar: "أيِّ شَهرٍ يُحِبّون" },
        { en: "They never fast", ar: "لا يَصومونَ أبَدًا" },
      ],
      correctIndex: 0,
      explanation: { en: "Muslims fast in the month of Ramadan.", ar: "يَصومُ المُسلِمونَ في شَهرِ رَمَضان." },
    },
    {
      prompt: { en: "True or False: Hajj is the journey to the Kaaba in Makkah.", ar: "صَوابٌ أم خَطأ: الحَجُّ هو الرِّحلةُ إلى الكَعبةِ في مَكّة." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Hajj is the pilgrimage to the Kaaba in Makkah, done once in a lifetime by those who are able.", ar: "صَواب. الحَجُّ هو قَصدُ الكَعبةِ في مَكّةَ مَرّةً في العُمُرِ لِمَنِ استَطاع." },
    },
  ],
};
