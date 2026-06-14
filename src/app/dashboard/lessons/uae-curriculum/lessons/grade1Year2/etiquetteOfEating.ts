import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const etiquetteOfEating: CourseLesson = {
  slug: "g1y2-etiquette-of-eating",
  name: { en: "Etiquette of Eating", ar: "آدابُ الطَّعامِ" },
  shortIntro: {
    en: "Islam teaches us beautiful manners for eating. Let us learn the Sunnah of how to eat and drink.",
    ar: "الإسلامُ يُعَلِّمُنا آدابًا جَميلةً للطَّعام. لِنَتَعَلَّمْ سُنّةَ الأكلِ والشُّرب.",
  },
  quranSurahs: ["Al-A'raf 31"],
  sections: [
    {
      title: { en: "Food is a blessing from Allah", ar: "الطَّعامُ نِعمةٌ مِنَ الله" },
      learningObjective: {
        en: "I can name some good manners for eating.",
        ar: "أستَطيعُ أن أُسَمِّيَ بَعضَ آدابِ الطَّعام.",
      },
      image: {
        src: IMG.greenValley,
        alt: { en: "Nature that gives us food and fruit.", ar: "طَبيعةٌ تُعطينا الطَّعامَ والفاكِهة." },
        caption: { en: "Every meal is a gift from Allah to thank Him for.", ar: "كُلُّ وَجبةٍ هَدِيّةٌ مِنَ اللهِ نَشكُرُهُ عَلَيها." },
      },
      body: {
        en: "The food we eat — bread, fruit, rice, milk, and water — is all a blessing from Allah. Islam teaches us beautiful manners (adab) for eating, so that our meals become a time of thanks and good behaviour. Our Prophet ﷺ showed us exactly how to eat in a clean and polite way.",
        ar: "الطَّعامُ الذي نَأكُلُهُ — الخُبزُ والفاكِهةُ والأرُزُّ والحَليبُ والماء — كُلُّهُ نِعمةٌ مِنَ الله. والإسلامُ يُعَلِّمُنا آدابًا جَميلةً للأكلِ لِتُصبِحَ وَجَباتُنا وَقتَ شُكرٍ وحُسنِ تَصَرُّف. وقد عَلَّمَنا نَبِيُّنا ﷺ كَيفَ نَأكُلُ بِنَظافةٍ وأدَب.",
      },
    },
    {
      title: { en: "Eat and drink, but do not waste", ar: "كُلوا واشرَبوا ولا تُسرِفوا" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading about good manners.", ar: "طِفلٌ يَقرَأُ عنِ الآداب." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...Eat and drink, but do not waste. Indeed, Allah does not like the wasteful.\" — Al-A'raf 31", ar: "﴿...وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ﴾ — الأعراف ٣١" },
            { en: "It means: Enjoy your food, but do not take more than you need or throw it away.", ar: "مَعناها: تَمَتَّعْ بِطَعامِكَ ولا تَأخُذْ أكثَرَ مِن حاجَتِكَ ولا تَرمِه." },
          ],
        },
      ],
      body: {
        en: "Allah allows us to enjoy good food, but tells us not to waste. We should take only what we can eat, finish what is on our plate, and not throw away food. Wasting food is something Allah does not like, because many people in the world are hungry. A good Muslim is thankful and never wasteful.",
        ar: "أباحَ اللهُ لَنا أن نَتَمَتَّعَ بالطَّعامِ الطَّيِّب، لكِنَّهُ أمَرَنا ألّا نُسرِف. فَنَأخُذُ ما نَستَطيعُ أكلَهُ فَقَط، ونُنهي ما في صَحنِنا، ولا نَرمي الطَّعام. والإسرافُ في الطَّعامِ لا يُحِبُّهُ الله، لأنَّ كَثيرينَ في العالَمِ جِياع. والمُسلِمُ الطَّيِّبُ شاكِرٌ ولا يُبَذِّر.",
      },
    },
    {
      title: { en: "The Sunnah way to eat", ar: "سُنّةُ الأكل" },
      image: {
        src: IMG.lantern,
        alt: { en: "A warm lantern at a family meal.", ar: "فانوسٌ دافِئٌ على مائِدةِ الأُسرة." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said to a boy: \"Say Bismillah, eat with your right hand, and eat from what is near you.\" (Bukhari & Muslim)", ar: "قال النَّبِيُّ ﷺ لِغُلام: «سَمِّ اللهَ، وكُلْ بِيَمينِكَ، وكُلْ مِمّا يَليك». (متفق عليه)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ taught us simple, beautiful manners: (1) We say 'Bismillah' (in the name of Allah) before we eat. (2) We eat with our right hand. (3) We eat from the food in front of us. (4) We sit down to eat and drink calmly. (5) When we finish, we say 'Alhamdulillah' (all praise is for Allah). Following these manners turns eating into worship.",
        ar: "عَلَّمَنا نَبِيُّنا ﷺ آدابًا بَسيطةً جَميلة: (١) نَقولُ «بِسمِ الله» قَبلَ الأكل. (٢) ونَأكُلُ بِاليَدِ اليُمنى. (٣) ونَأكُلُ مِمّا أمامَنا. (٤) ونَجلِسُ لِنَأكُلَ ونَشرَبَ بِهُدوء. (٥) وحينَ نَنتَهي نَقولُ «الحَمدُ لله». واتِّباعُ هذهِ الآدابِ يَجعَلُ الأكلَ عِبادة.",
      },
    },
    {
      title: { en: "Sharing and good company", ar: "المُشارَكةُ والصُّحبةُ الطَّيِّبة" },
      image: {
        src: IMG.childBooks,
        alt: { en: "Children sharing a meal nicely.", ar: "أطفالٌ يَتَشارَكونَ الطَّعامَ بِأدَب." },
      },
      body: {
        en: "Eating is even nicer when we share. The Prophet ﷺ said that the food of one is enough for two, and the food of two is enough for four — so we share with others and don't be greedy. We also keep good manners at the table: we don't blow on hot food, we don't speak with our mouth full, and we thank whoever cooked for us.",
        ar: "يُصبِحُ الأكلُ أجمَلَ حينَ نُشارِك. قال النَّبِيُّ ﷺ إنَّ طَعامَ الواحِدِ يَكفي الاثنَين، وطَعامَ الاثنَينِ يَكفي الأربَعة، فَنُشارِكُ الآخَرينَ ولا نَطمَع. ونُحافِظُ على الآدابِ على المائِدة: لا نَنفُخُ في الطَّعامِ الحارّ، ولا نَتَكَلَّمُ وفَمُنا مَملوء، ونَشكُرُ مَن طَبَخَ لَنا.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A bright sky over a thankful heart.", ar: "سَماءٌ مُشرِقةٌ فَوقَ قَلبٍ شاكِر." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "Too much food on the plate", ar: "طَعامٌ كَثيرٌ في الصَّحن" },
        body: {
          en: "You put a lot of food on your plate but you are full and cannot finish it. You feel like throwing it away. What does Islam teach you to do instead?",
          ar: "وَضَعتَ طَعامًا كَثيرًا في صَحنِكَ لكِنَّكَ شَبِعتَ ولا تَستَطيعُ إنهاءَه، وتُفَكِّرُ في رَميه. ماذا يُعَلِّمُكَ الإسلامُ أن تَفعَلَ بَدَلًا مِن ذلِك؟",
        },
      },
      responsePrompt: {
        title: { en: "My eating manners", ar: "آدابُ أكلي" },
        prompt: {
          en: "Write two eating manners you will practise at your next meal.",
          ar: "اكتُبْ أدَبَينِ مِن آدابِ الطَّعامِ سَتُطَبِّقُهُما في وَجبَتِكَ القادِمة.",
        },
        placeholder: { en: "Before I eat I will..., and after I will...", ar: "قَبلَ الأكلِ سأ...، وبعدَهُ سأ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Eating with good manners turns a simple meal into worship. Let us say Bismillah, eat with our right hand, never waste food, share with others, and thank Allah with 'Alhamdulillah' when we finish.",
        ar: "الأكلُ بالآدابِ يُحَوِّلُ الوَجبةَ البَسيطةَ إلى عِبادة. فَلْنَقُلْ بِسمِ الله، ونَأكُلْ بِاليَمين، ولا نُبَذِّرِ الطَّعام، ونُشارِكِ الآخَرين، ونَشكُرِ اللهَ بِقَولِ «الحَمدُ لله» حينَ نَنتَهي.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What do we say before we eat?", ar: "ماذا نَقولُ قَبلَ الأكل؟" },
      options: [
        { en: "Bismillah", ar: "بِسمِ الله" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "Goodbye", ar: "مَعَ السَّلامة" },
      ],
      correctIndex: 0,
      explanation: { en: "We say Bismillah (in the name of Allah) before eating.", ar: "نَقولُ «بِسمِ الله» قَبلَ الأكل." },
    },
    {
      prompt: { en: "Which hand should we eat with?", ar: "بِأيِّ يَدٍ نَأكُل؟" },
      options: [
        { en: "The right hand", ar: "اليَدِ اليُمنى" },
        { en: "The left hand", ar: "اليَدِ اليُسرى" },
        { en: "Both feet", ar: "القَدَمَين" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ taught us to eat with the right hand.", ar: "عَلَّمَنا النَّبِيُّ ﷺ أن نَأكُلَ بِاليَدِ اليُمنى." },
    },
    {
      prompt: { en: "What do we say after we finish eating?", ar: "ماذا نَقولُ بعدَ الانتِهاءِ مِنَ الأكل؟" },
      options: [
        { en: "Alhamdulillah", ar: "الحَمدُ لله" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "I am bored", ar: "أنا مَلِل" },
      ],
      correctIndex: 0,
      explanation: { en: "We thank Allah by saying Alhamdulillah.", ar: "نَشكُرُ اللهَ بِقَولِ «الحَمدُ لله»." },
    },
    {
      prompt: { en: "What does Allah think of wasting food?", ar: "ما حُكمُ تَبذيرِ الطَّعامِ عِندَ الله؟" },
      options: [
        { en: "Allah does not like waste", ar: "اللهُ لا يُحِبُّ الإسراف" },
        { en: "Allah loves waste", ar: "اللهُ يُحِبُّ الإسراف" },
        { en: "It doesn't matter", ar: "لا يَهُمّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah does not like the wasteful, so we should not waste food.", ar: "اللهُ لا يُحِبُّ المُسرِفين، فَلا نُبَذِّرِ الطَّعام." },
    },
    {
      prompt: { en: "True or False: We should share our food with others.", ar: "صَوابٌ أم خَطأ: يَنبَغي أن نُشارِكَ طَعامَنا مَعَ الآخَرين." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Sharing food is a beautiful Sunnah.", ar: "صَواب. مُشارَكةُ الطَّعامِ سُنّةٌ جَميلة." },
    },
  ],
};
