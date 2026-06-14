import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const iLoveMyFamily: CourseLesson = {
  slug: "g1y2-i-love-my-family",
  name: { en: "I Love My Family", ar: "أحبُ أسرتي" },
  shortIntro: {
    en: "Allah gave us families to love and care for. Let us learn how to be kind to parents, brothers, and sisters.",
    ar: "أعطانا اللهُ أُسَرًا نُحِبُّها ونَرعاها. لِنَتَعَلَّمْ كَيفَ نَبَرُّ بالوالِدَينِ ونَلطُفُ بالإخوة.",
  },
  quranSurahs: ["Al-Isra 23"],
  sections: [
    {
      title: { en: "Family is a gift from Allah", ar: "الأُسرةُ نِعمةٌ مِنَ الله" },
      learningObjective: {
        en: "I can say that my family is a blessing and I should be kind to them.",
        ar: "أستَطيعُ أن أقولَ إنَّ أُسرَتي نِعمةٌ وعَلَيَّ أن ألطُفَ بِها.",
      },
      image: {
        src: IMG.greenValley,
        alt: { en: "A warm, peaceful home in nature.", ar: "بَيتٌ دافِئٌ هادِئٌ في الطَّبيعة." },
        caption: { en: "Allah blessed us with parents who love and care for us.", ar: "أنعَمَ اللهُ عَلَينا بِوالِدَينِ يُحِبّانِنا ويَرعَيانِنا." },
      },
      body: {
        en: "Allah gave us a family: a mother and father who love us, and brothers and sisters to grow up with. Our parents feed us, teach us, and take care of us when we are small. Loving and respecting our family is a beautiful part of our religion.",
        ar: "أعطانا اللهُ أُسرة: أُمًّا وأبًا يُحِبّانِنا، وإخوةً وأخَواتٍ نَكبُرُ مَعَهُم. ووالِدانا يُطعِمانِنا ويُعَلِّمانِنا ويَرعَيانِنا ونَحنُ صِغار. ومَحَبّةُ الأُسرةِ واحتِرامُها جُزءٌ جَميلٌ مِن ديننا.",
      },
    },
    {
      title: { en: "Be kind to your parents", ar: "أحسِنْ إلى والِدَيك" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading about parents.", ar: "طِفلٌ يَقرَأُ عنِ الوالِدَين." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...Be good to parents. If one or both of them reach old age with you, do not say to them even 'uff' (a word of annoyance)...\" — Al-Isra 23", ar: "﴿...وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِنْدَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُلْ لَهُمَا أُفٍّ...﴾ — الإسراء ٢٣" },
            { en: "It means: Allah tells us to be very kind to our parents and never to speak rudely to them.", ar: "مَعناها: يَأمُرُنا اللهُ بالإحسانِ الكَبيرِ للوالِدَينِ وألّا نُغلِظَ لَهُما في الكَلام." },
          ],
        },
      ],
      body: {
        en: "Allah joined being kind to parents with worshipping Him — that is how important it is. We should obey our parents in good things, speak softly to them, say please and thank you, and never be rude. Even saying a small annoyed word like 'uff' is not allowed. We pray for them too.",
        ar: "قَرَنَ اللهُ الإحسانَ للوالِدَينِ بِعِبادَتِه، فَما أعظَمَ ذلِك. وعَلَينا أن نُطيعَ والِدَينا في المَعروف، ونَتَكَلَّمَ مَعَهُما بِلُطف، ونَقولَ مِن فَضلِكَ وشُكرًا، ولا نُسيءَ الأدَبَ أبَدًا. وحتّى كَلِمةُ الضَّجَرِ الصَّغيرة (أُفّ) لا تَجوز. ونَدعو لَهُما أيضًا.",
      },
    },
    {
      title: { en: "Where is Paradise?", ar: "أينَ الجَنّة؟" },
      image: {
        src: IMG.lantern,
        alt: { en: "A warm lantern of love.", ar: "فانوسُ مَحَبّةٍ دافِئ." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"Paradise lies at the feet of mothers.\" (Nasa'i) — meaning honouring our mother is a path to Paradise.", ar: "قال النَّبِيُّ ﷺ ما مَعناه: «الجَنّةُ تَحتَ أقدامِ الأُمَّهات» — أي إنَّ بِرَّ الأُمِّ طَريقٌ إلى الجَنّة. (النسائي)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ taught us that being good to our mother is a way to enter Paradise. A man once asked the Prophet ﷺ who deserves his best company. The Prophet ﷺ said: 'Your mother', three times, and then 'your father'. So we treat our mother and father with great love and care.",
        ar: "عَلَّمَنا نَبِيُّنا ﷺ أنَّ بِرَّ الأُمِّ طَريقٌ لِدُخولِ الجَنّة. وسَألَ رَجُلٌ النَّبِيَّ ﷺ: مَن أحَقُّ النّاسِ بِحُسنِ صُحبَتي؟ فقال: «أُمُّك» ثَلاثًا، ثُمَّ «أبوك». فَنُعامِلُ أُمَّنا وأبانا بِحُبٍّ ورِعايةٍ كَبيرة.",
      },
    },
    {
      title: { en: "Love your brothers and sisters", ar: "أحبِبْ إخوَتَكَ وأخَواتِك" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A calm, happy natural scene.", ar: "مَشهَدٌ طَبيعيٌّ هادِئٌ سَعيد." },
      },
      body: {
        en: "Family love also means being kind to our brothers and sisters. We share our toys, we play nicely, we help the little ones, and we forgive quickly when someone makes a mistake. We do not hit, shout, or take what is not ours. A home filled with kindness is a home Allah blesses.",
        ar: "مَحَبّةُ الأُسرةِ تَعني أيضًا اللُّطفَ مَعَ الإخوةِ والأخَوات. نُشارِكُ ألعابَنا، ونَلعَبُ بِأدَب، ونُساعِدُ الصِّغار، ونُسامِحُ بِسُرعةٍ إذا أخطَأَ أحَد. ولا نَضرِبُ ولا نَصرُخُ ولا نَأخُذُ ما ليسَ لَنا. والبَيتُ المَملوءُ بالطِّيبةِ يُبارِكُهُ الله.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child helping at home.", ar: "طِفلٌ يُساعِدُ في البَيت." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "Mum is tired", ar: "أُمّي مُتعَبة" },
        body: {
          en: "Your mother comes home tired and there are toys all over the floor. What can you do to make her happy and earn Allah's reward?",
          ar: "تَعودُ أُمُّكَ مُتعَبةً والألعابُ مُبَعثَرةٌ على الأرض. ماذا تَفعَلُ لِتُسعِدَها وتَنالَ أجرَ الله؟",
        },
      },
      responsePrompt: {
        title: { en: "My family kindness", ar: "بِرّي بِأُسرَتي" },
        prompt: {
          en: "Write one kind thing you will do for your family today.",
          ar: "اكتُبْ عَمَلًا طَيِّبًا واحِدًا سَتَفعَلُهُ لِأُسرَتِكَ اليَوم.",
        },
        placeholder: { en: "Today I will...", ar: "اليَومَ سأ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Our family is a gift from Allah. When we love, obey, and help our parents and are kind to our brothers and sisters, our home becomes happy and Allah is pleased with us.",
        ar: "أُسرَتُنا نِعمةٌ مِنَ الله. وحينَ نُحِبُّ والِدَينا ونُطيعُهُما ونُعينُهُما ونَلطُفُ بِإخوَتِنا، يُصبِحُ بَيتُنا سَعيدًا ويَرضى اللهُ عَنّا.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who gave us our family?", ar: "مَن أعطانا أُسرَتَنا؟" },
      options: [
        { en: "Allah", ar: "الله" },
        { en: "No one", ar: "لا أحَد" },
        { en: "Our friends", ar: "أصدِقاؤُنا" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah blessed us with our family.", ar: "اللهُ أنعَمَ عَلَينا بِأُسرَتِنا." },
    },
    {
      prompt: { en: "How should we speak to our parents?", ar: "كَيفَ نُكَلِّمُ والِدَينا؟" },
      options: [
        { en: "Softly and kindly", ar: "بِلُطفٍ وأدَب" },
        { en: "Rudely", ar: "بِغِلظة" },
        { en: "By shouting", ar: "بالصُّراخ" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah told us to be kind and never say even 'uff' to them.", ar: "أمَرَنا اللهُ بالإحسانِ وألّا نَقولَ لَهُما حتّى (أُفّ)." },
    },
    {
      prompt: { en: "According to the hadith, Paradise lies at the feet of...", ar: "بِحَسَبِ الحَديث، الجَنّةُ تَحتَ أقدامِ..." },
      options: [
        { en: "Mothers", ar: "الأُمَّهات" },
        { en: "Kings", ar: "المُلوك" },
        { en: "Football players", ar: "لاعِبي الكُرة" },
      ],
      correctIndex: 0,
      explanation: { en: "Honouring our mother is a path to Paradise.", ar: "بِرُّ الأُمِّ طَريقٌ إلى الجَنّة." },
    },
    {
      prompt: { en: "How should we treat our brothers and sisters?", ar: "كَيفَ نُعامِلُ إخوَتَنا وأخَواتِنا؟" },
      options: [
        { en: "Share and be kind", ar: "نُشارِكُ ونَلطُف" },
        { en: "Hit and shout", ar: "نَضرِبُ ونَصرُخ" },
        { en: "Take their things", ar: "نَأخُذُ أشياءَهُم" },
      ],
      correctIndex: 0,
      explanation: { en: "We share, play nicely, and forgive each other.", ar: "نُشارِكُ ونَلعَبُ بِأدَبٍ ونُسامِح." },
    },
    {
      prompt: { en: "True or False: Being good to parents is part of our religion.", ar: "صَوابٌ أم خَطأ: بِرُّ الوالِدَينِ مِن ديننا." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Allah joined kindness to parents with worshipping Him.", ar: "صَواب. قَرَنَ اللهُ الإحسانَ للوالِدَينِ بِعِبادَتِه." },
    },
  ],
};
