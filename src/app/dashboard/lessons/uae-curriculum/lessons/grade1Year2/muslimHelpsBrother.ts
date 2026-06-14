import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const muslimHelpsBrother: CourseLesson = {
  slug: "g1y2-a-muslim-helps-his-brother",
  name: { en: "A Muslim Helps His Brother", ar: "المسلم عون لأخیه" },
  shortIntro: {
    en: "Muslims are like one family. Let us learn how helping others brings us closer to Allah.",
    ar: "المُسلِمونَ كَأُسرةٍ واحِدة. لِنَتَعَلَّمْ كَيفَ تُقَرِّبُنا مُساعَدةُ الآخَرينَ مِنَ الله.",
  },
  quranSurahs: ["Al-Ma'idah 2"],
  sections: [
    {
      title: { en: "Muslims help each other", ar: "المُسلِمونَ يَتَعاوَنون" },
      learningObjective: {
        en: "I can say that Muslims are brothers who help one another.",
        ar: "أستَطيعُ أن أقولَ إنَّ المُسلِمينَ إخوةٌ يُساعِدُ بَعضُهُم بَعضًا.",
      },
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque where Muslims gather as one.", ar: "مَسجِدٌ يَجتَمِعُ فيهِ المُسلِمونَ كَواحِد." },
        caption: { en: "Muslims everywhere are like one big family.", ar: "المُسلِمونَ في كُلِّ مَكانٍ كَأُسرةٍ واحِدةٍ كَبيرة." },
      },
      body: {
        en: "Our Prophet ﷺ taught us that all Muslims are brothers and sisters. A good Muslim helps others: he shares, he is kind, and he does not leave a friend in trouble. When we help each other, our whole community becomes strong and happy.",
        ar: "عَلَّمَنا نَبِيُّنا ﷺ أنَّ المُسلِمينَ جَميعًا إخوةٌ وأخَوات. والمُسلِمُ الطَّيِّبُ يُساعِدُ غَيرَه: يُشارِك، ويَلطُف، ولا يَترُكُ صَديقَهُ في ضيق. وحينَ نَتَعاوَنُ يُصبِحُ مُجتَمَعُنا كُلُّهُ قَوِيًّا سَعيدًا.",
      },
    },
    {
      title: { en: "Help each other in goodness", ar: "تَعاوَنوا على الخَير" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an.", ar: "طِفلٌ يَقرَأُ القُرآن." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...Help one another in righteousness and piety, and do not help one another in sin and aggression...\" — Al-Ma'idah 2", ar: "﴿...وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ...﴾ — المائدة ٢" },
            { en: "It means: Allah tells us to help each other to do good, not to do wrong.", ar: "مَعناها: يَأمُرُنا اللهُ أن نَتَعاوَنَ على الخَيرِ لا على الشَّرّ." },
          ],
        },
      ],
      body: {
        en: "Allah tells us to help one another in good things, and never to help anyone do something wrong. So we help a friend carry his bag, share our snack, or help our mum at home — but we do not help anyone be unkind or break the rules. Helping in good earns us reward from Allah.",
        ar: "يَأمُرُنا اللهُ أن نَتَعاوَنَ على الخَير، وألّا نُعينَ أحَدًا على الخَطأ أبَدًا. فَنُساعِدُ صَديقًا يَحمِلُ حَقيبَتَه، ونُشارِكُ وَجبَتَنا، ونُعينُ أُمَّنا في البَيت، لكِنّنا لا نُعينُ أحَدًا على الإساءةِ أو مُخالَفةِ القَواعِد. والإعانةُ على الخَيرِ تَكسِبُنا الأجرَ مِنَ الله.",
      },
    },
    {
      title: { en: "Allah helps those who help others", ar: "اللهُ يُعينُ مَن يُعينُ النّاس" },
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern lighting the way for others.", ar: "فانوسٌ يُنيرُ الطَّريقَ للآخَرين." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"Allah helps His servant as long as the servant helps his brother.\" (Muslim)", ar: "قال النَّبِيُّ ﷺ: «واللهُ في عَونِ العَبدِ ما كانَ العَبدُ في عَونِ أخيه». (رواه مسلم)" },
          ],
        },
      ],
      body: {
        en: "Here is a beautiful promise: when we help others, Allah helps us! The Prophet ﷺ also said that a Muslim is a brother to another Muslim — he does not let him down or leave him alone. So when we help someone, Allah sends help to us too. Helping is never a loss.",
        ar: "إلَيكَ وَعدًا جَميلًا: حينَ نُساعِدُ الآخَرينَ يُساعِدُنا الله! وقالَ النَّبِيُّ ﷺ أيضًا إنَّ المُسلِمَ أخو المُسلِم لا يَخذُلُهُ ولا يَترُكُه. فَحينَ نُعينُ أحَدًا يُرسِلُ اللهُ لَنا العَونَ أيضًا. والمُساعَدةُ لا تَكونُ خَسارةً أبَدًا.",
      },
    },
    {
      title: { en: "Story: the Ansar and the Muhajirun", ar: "قِصّة: الأنصارُ والمُهاجِرون" },
      image: {
        src: IMG.greenValley,
        alt: { en: "The green city of Madinah.", ar: "مَدينةُ المَدينةِ الخَضراء." },
      },
      body: {
        en: "When the Prophet ﷺ and the Muslims moved to Madinah, they left their homes and money in Makkah. The Muslims of Madinah, called the Ansar (the Helpers), opened their homes and shared their food, money, and land with their brothers. They loved to give. Allah praised them in the Qur'an. This is the best example of Muslims helping each other.",
        ar: "حينَ هاجَرَ النَّبِيُّ ﷺ والمُسلِمونَ إلى المَدينة، تَرَكوا بُيوتَهُم وأموالَهُم في مَكّة. فَفَتَحَ مُسلِمو المَدينةِ، وهُمُ الأنصار، بُيوتَهُم وشارَكوا إخوانَهُم طَعامَهُم ومالَهُم وأرضَهُم. وأحَبّوا العَطاء. وأثنى اللهُ عَلَيهِم في القُرآن. وهذا أجمَلُ مِثالٍ على تَعاوُنِ المُسلِمين.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child ready to help a friend.", ar: "طِفلٌ مُستَعِدٌّ لِمُساعَدةِ صَديق." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "A new student is alone", ar: "طالِبٌ جَديدٌ وَحيد" },
        body: {
          en: "A new boy joins your class. He looks shy and sits alone at break with no one to play with. What can you do to be a true Muslim brother to him?",
          ar: "ينضَمُّ وَلَدٌ جَديدٌ إلى فَصلِك. يَبدو خَجولًا ويَجلِسُ وَحدَهُ في الفُسحةِ بِلا أصدِقاء. ماذا تَفعَلُ لِتَكونَ أخًا مُسلِمًا صادِقًا لَه؟",
        },
      },
      responsePrompt: {
        title: { en: "My helping plan", ar: "خُطَّتي في المُساعَدة" },
        prompt: {
          en: "Write one way you can help someone this week.",
          ar: "اكتُبْ طَريقةً واحِدةً تُساعِدُ بِها أحَدًا هذا الأُسبوع.",
        },
        placeholder: { en: "This week I will help by...", ar: "هذا الأُسبوعَ سأُساعِدُ بِأن..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "A Muslim is a helper to his brother. When we help others with a good heart, Allah helps us, our friends love us, and our reward grows. Let us always look for ways to help.",
        ar: "المُسلِمُ عَونٌ لأخيه. وحينَ نُساعِدُ الآخَرينَ بِقَلبٍ طَيِّبٍ يُعينُنا الله، ويُحِبُّنا أصدِقاؤُنا، ويَزيدُ أجرُنا. فَلْنَبحَثْ دائِمًا عن طُرُقٍ لِنُساعِد.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What are Muslims to each other?", ar: "ما المُسلِمونَ بَعضُهُم لِبَعض؟" },
      options: [
        { en: "Brothers and sisters", ar: "إخوةٌ وأخَوات" },
        { en: "Strangers", ar: "غُرَباء" },
        { en: "Enemies", ar: "أعداء" },
      ],
      correctIndex: 0,
      explanation: { en: "All Muslims are brothers and sisters who help each other.", ar: "كُلُّ المُسلِمينَ إخوةٌ وأخَواتٌ يَتَعاوَنون." },
    },
    {
      prompt: { en: "Allah tells us to help one another in...", ar: "يَأمُرُنا اللهُ أن نَتَعاوَنَ على..." },
      options: [
        { en: "Goodness and righteousness", ar: "الخَيرِ والبِرّ" },
        { en: "Doing wrong", ar: "الإساءة" },
        { en: "Being lazy", ar: "الكَسَل" },
      ],
      correctIndex: 0,
      explanation: { en: "We help each other in good, not in sin.", ar: "نَتَعاوَنُ على الخَيرِ لا على الإثم." },
    },
    {
      prompt: { en: "What happens when we help others?", ar: "ماذا يَحدُثُ حينَ نُساعِدُ الآخَرين؟" },
      options: [
        { en: "Allah helps us", ar: "يُساعِدُنا الله" },
        { en: "We lose everything", ar: "نَخسَرُ كُلَّ شيء" },
        { en: "Nothing", ar: "لا شيء" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah helps His servant as long as he helps his brother.", ar: "اللهُ في عَونِ العَبدِ ما دامَ في عَونِ أخيه." },
    },
    {
      prompt: { en: "Who were the Ansar?", ar: "مَنِ الأنصار؟" },
      options: [
        { en: "The Muslims of Madinah who helped their brothers", ar: "مُسلِمو المَدينةِ الذينَ ساعَدوا إخوانَهُم" },
        { en: "Enemies of the Muslims", ar: "أعداءُ المُسلِمين" },
        { en: "People who never shared", ar: "قَومٌ لا يُشارِكون" },
      ],
      correctIndex: 0,
      explanation: { en: "The Ansar of Madinah shared their homes and wealth with the Muhajirun.", ar: "الأنصارُ في المَدينةِ شارَكوا المُهاجِرينَ بُيوتَهُم وأموالَهُم." },
    },
    {
      prompt: { en: "True or False: A Muslim should leave his friend alone when in trouble.", ar: "صَوابٌ أم خَطأ: على المُسلِمِ أن يَترُكَ صَديقَهُ وَحدَهُ في الضِّيق." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "False. A Muslim never lets his brother down; he helps him.", ar: "خَطأ. المُسلِمُ لا يَخذُلُ أخاهُ بل يُعينُه." },
    },
  ],
};
