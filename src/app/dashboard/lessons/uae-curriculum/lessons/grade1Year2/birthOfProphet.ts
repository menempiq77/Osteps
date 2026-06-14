import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const birthOfProphet: CourseLesson = {
  slug: "g1y2-birth-of-the-prophet-muhammad",
  name: { en: "The Birth of the Prophet Muhammad ﷺ", ar: "مَوْلِدُ الرَّسولِ مُحمَّد ﷺ" },
  shortIntro: {
    en: "The beautiful story of how Allah sent our Prophet Muhammad ﷺ, a mercy for the whole world.",
    ar: "القِصّةُ الجَميلةُ لِكَيفَ أرسَلَ اللهُ نَبِيَّنا مُحمَّدًا ﷺ رَحمةً للعالَمينَ كُلِّهِم.",
  },
  quranSurahs: ["Al-Anbiya 107"],
  sections: [
    {
      title: { en: "Our beloved Prophet", ar: "نَبِيُّنا الحَبيب" },
      learningObjective: {
        en: "I can say where and when our Prophet Muhammad ﷺ was born.",
        ar: "أستَطيعُ أن أقولَ أينَ ومَتى وُلِدَ نَبِيُّنا مُحمَّد ﷺ.",
      },
      image: {
        src: IMG.grandMosque,
        alt: { en: "A beautiful mosque, like the city of Makkah.", ar: "مَسجِدٌ جَميلٌ يُذَكِّرُنا بِمَكّة." },
        caption: { en: "Our Prophet ﷺ was born in the holy city of Makkah.", ar: "وُلِدَ نَبِيُّنا ﷺ في مَدينةِ مَكّةَ المُكَرَّمة." },
      },
      body: {
        en: "Our Prophet Muhammad ﷺ was born long ago in the holy city of Makkah, in the Year of the Elephant. His father, Abdullah, passed away before he was born, and his mother was Aminah. His grandfather, Abdul-Muttalib, loved him very much and named him Muhammad, which means 'the one who is praised'.",
        ar: "وُلِدَ نَبِيُّنا مُحمَّدٌ ﷺ قَديمًا في مَدينةِ مَكّةَ المُكَرَّمةِ، في عامِ الفيل. تُوُفِّيَ أبوهُ عبدُاللهِ قَبلَ أن يولَدَ، وكانَت أُمُّهُ آمِنة. وأحَبَّهُ جَدُّهُ عبدُالمُطَّلِبِ كَثيرًا وسَمّاهُ مُحمَّدًا، أي الذي يُحمَدُ ويُثنى عَلَيه.",
      },
    },
    {
      title: { en: "A mercy to the whole world", ar: "رَحمةٌ للعالَمينَ كُلِّهِم" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A wide bright sky over the whole world.", ar: "سَماءٌ واسِعةٌ مُشرِقةٌ فَوقَ العالَمِ كُلِّه." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And We have not sent you except as a mercy to the worlds.\" — Al-Anbiya 107", ar: "﴿وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ﴾ — الأنبياء ١٠٧" },
            { en: "It means: Allah sent Prophet Muhammad ﷺ as a mercy and a gift for all people.", ar: "مَعناها: أرسَلَ اللهُ النَّبِيَّ مُحمَّدًا ﷺ رَحمةً وهَدِيّةً لِكُلِّ النّاس." },
          ],
        },
      ],
      body: {
        en: "Allah sent our Prophet ﷺ as a mercy. He taught people to believe in Allah, to be kind, honest, and to care for the poor, the orphan, and even the animals. Because of him, we learned the most beautiful way of living.",
        ar: "أرسَلَ اللهُ نَبِيَّنا ﷺ رَحمة. عَلَّمَ النّاسَ أن يُؤمِنوا باللهِ، وأن يَكونوا لُطَفاءَ صادِقينَ، وأن يَرعَوُا الفَقيرَ واليَتيمَ وحتّى الحَيَوان. وبِفَضلِهِ تَعَلَّمنا أجمَلَ طَريقةٍ للحَياة.",
      },
    },
    {
      title: { en: "How we love the Prophet ﷺ", ar: "كَيفَ نُحِبُّ النَّبِيَّ ﷺ" },
      image: {
        src: IMG.lantern,
        alt: { en: "A warm glowing lantern.", ar: "فانوسٌ مُضيءٌ دافِئ." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"None of you truly believes until I am more beloved to him than his parents and all people.\" (Bukhari & Muslim)", ar: "قال النَّبِيُّ ﷺ: «لا يُؤمِنُ أحَدُكُم حتّى أكونَ أحَبَّ إلَيهِ مِن والِدِهِ ووَلَدِهِ والنّاسِ أجمَعين». (متفق عليه)" },
            { en: "It means: we should love the Prophet ﷺ very, very much.", ar: "مَعناها: عَلَينا أن نُحِبَّ النَّبِيَّ ﷺ حُبًّا كَبيرًا جِدًّا." },
          ],
        },
      ],
      body: {
        en: "We love our Prophet ﷺ by following his good manners and by sending salah upon him. When we hear his name, we say: 'Allahumma salli 'ala Muhammad' (O Allah, send blessings upon Muhammad). Loving him means doing what he taught us.",
        ar: "نُحِبُّ نَبِيَّنا ﷺ باتِّباعِ أخلاقِهِ الطَّيِّبةِ وبالصَّلاةِ عَلَيه. وعِندَما نَسمَعُ اسمَهُ نَقولُ: «اللّهُمَّ صَلِّ على مُحمَّد». ومَحَبَّتُهُ تَعني أن نَفعَلَ ما عَلَّمَنا إيّاه.",
      },
    },
    {
      title: { en: "Story: the blessed baby in the desert", ar: "قِصّة: الطِّفلُ المُبارَكُ في البادية" },
      image: {
        src: IMG.greenValley,
        alt: { en: "Green open land like the desert of Banu Sa'd.", ar: "أرضٌ خَضراءُ واسِعةٌ مِثلُ باديةِ بَني سَعد." },
      },
      body: {
        en: "When Prophet Muhammad ﷺ was a tiny baby, a kind woman named Halimah took care of him in the desert. Allah sent many blessings to her home: her animals gave more milk and her family had plenty of good things. Even as a child, Muhammad ﷺ was honest, gentle, and loved by everyone who met him.",
        ar: "عِندَما كانَ النَّبِيُّ مُحمَّدٌ ﷺ طِفلًا صَغيرًا، اعتَنَت بهِ امرأةٌ طَيِّبةٌ اسمُها حَليمةُ في البادية. وأرسَلَ اللهُ بَرَكاتٍ كَثيرةً إلى بَيتِها: فَأعطَت أغنامُها لَبَنًا أكثَرَ وعاشَت أُسرَتُها في خَيرٍ وَفير. وحتّى وهو طِفلٌ، كانَ مُحمَّدٌ ﷺ صادِقًا لَطيفًا يُحِبُّهُ كُلُّ مَن يَلقاه.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child learning about the Prophet ﷺ.", ar: "طِفلٌ يَتَعَلَّمُ عنِ النَّبِيِّ ﷺ." },
      },
      callout: {
        label: { en: "Think with me", ar: "فَكِّرْ مَعي" },
        title: { en: "How can I show my love for the Prophet ﷺ?", ar: "كَيفَ أُظهِرُ حُبّي للنَّبِيِّ ﷺ؟" },
        body: {
          en: "I can send salah upon him, learn his story, and copy his good manners: telling the truth, being kind, smiling, and helping others. Every time I act like the Prophet ﷺ, I show that I love him.",
          ar: "أستَطيعُ أن أُصَلّيَ عَلَيه، وأتَعَلَّمَ قِصَّتَهُ، وأُقَلِّدَ أخلاقَهُ الطَّيِّبة: الصِّدقَ واللُّطفَ والابتِسامةَ ومُساعَدةَ الآخَرين. وكُلَّما فَعَلتُ مِثلَ النَّبِيِّ ﷺ أظهَرتُ أنّي أُحِبُّه.",
        },
      },
      responsePrompt: {
        title: { en: "My salah on the Prophet ﷺ", ar: "صَلاتي على النَّبِيِّ ﷺ" },
        prompt: {
          en: "Write one good manner of the Prophet ﷺ that you will do today.",
          ar: "اكتُبْ خُلُقًا واحِدًا مِن أخلاقِ النَّبِيِّ ﷺ سَتَفعَلُهُ اليَوم.",
        },
        placeholder: { en: "Today I will...", ar: "اليَومَ سأ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Our Prophet ﷺ is the best example for all of us. We are lucky to be from his ummah (his people). Let us love him, follow him, and always remember to send blessings upon him.",
        ar: "نَبِيُّنا ﷺ هو أفضَلُ قُدوةٍ لَنا جَميعًا. ونَحنُ مَحظوظونَ أن نَكونَ مِن أُمَّتِه. فَلْنُحِبَّهُ ونَتَّبِعْهُ ونَتَذَكَّرْ دائِمًا أن نُصَلِّيَ عَلَيه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "In which city was the Prophet Muhammad ﷺ born?", ar: "في أيِّ مَدينةٍ وُلِدَ النَّبِيُّ مُحمَّد ﷺ؟" },
      options: [
        { en: "Makkah", ar: "مَكّة" },
        { en: "Cairo", ar: "القاهِرة" },
        { en: "Dubai", ar: "دُبَي" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ was born in the holy city of Makkah.", ar: "وُلِدَ النَّبِيُّ ﷺ في مَدينةِ مَكّةَ المُكَرَّمة." },
    },
    {
      prompt: { en: "What does the name 'Muhammad' mean?", ar: "ماذا يَعني اسمُ (مُحمَّد)؟" },
      options: [
        { en: "The one who is praised", ar: "الذي يُحمَدُ ويُثنى عَلَيه" },
        { en: "The strong one", ar: "القَوِيّ" },
        { en: "The tall one", ar: "الطَّويل" },
      ],
      correctIndex: 0,
      explanation: { en: "Muhammad means the one who is praised. His grandfather chose this name.", ar: "مُحمَّدٌ يَعني الذي يُحمَدُ ويُثنى عَلَيه، وقد اختارَ جَدُّهُ هذا الاسم." },
    },
    {
      prompt: { en: "Who took care of baby Muhammad ﷺ in the desert?", ar: "مَنِ اعتَنَت بالطِّفلِ مُحمَّد ﷺ في البادية؟" },
      options: [
        { en: "Halimah", ar: "حَليمة" },
        { en: "Asma", ar: "أسماء" },
        { en: "Khadijah", ar: "خَديجة" },
      ],
      correctIndex: 0,
      explanation: { en: "Halimah lovingly nursed and cared for the Prophet ﷺ when he was a baby.", ar: "حَليمةُ هي التي أرضَعَتِ النَّبِيَّ ﷺ واعتَنَت بهِ وهو طِفل." },
    },
    {
      prompt: { en: "Allah sent the Prophet ﷺ as a... to the worlds.", ar: "أرسَلَ اللهُ النَّبِيَّ ﷺ ... للعالَمين." },
      options: [
        { en: "Mercy", ar: "رَحمة" },
        { en: "King", ar: "مَلِك" },
        { en: "Soldier", ar: "جُندِيّ" },
      ],
      correctIndex: 0,
      explanation: { en: "The Qur'an says Allah sent him as a mercy to the worlds.", ar: "يَقولُ القُرآنُ إنَّ اللهَ أرسَلَهُ رَحمةً للعالَمين." },
    },
    {
      prompt: { en: "True or False: We send salah on the Prophet ﷺ to show our love for him.", ar: "صَوابٌ أم خَطأ: نُصَلّي على النَّبِيِّ ﷺ لِنُظهِرَ حُبَّنا لَه." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Saying 'Allahumma salli 'ala Muhammad' is a way to show our love.", ar: "صَواب. قَولُ «اللّهُمَّ صَلِّ على مُحمَّد» وَسيلةٌ لِإظهارِ حُبِّنا لَه." },
    },
  ],
};
