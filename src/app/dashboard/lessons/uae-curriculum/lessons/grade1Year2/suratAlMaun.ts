import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const suratAlMaun: CourseLesson = {
  slug: "g1y2-surat-al-maun",
  name: { en: "Surat Al-Ma'un", ar: "سورةُ الْماعونِ" },
  shortIntro: {
    en: "A surah that teaches us to care for the orphan and the poor, and to help others with small kindnesses.",
    ar: "سورةٌ تُعَلِّمُنا أن نَرعى اليَتيمَ والفَقير، وأن نُعينَ النّاسَ بِأبسَطِ المَعروف.",
  },
  quranSurahs: ["Al-Ma'un 1-7"],
  sections: [
    {
      title: { en: "Caring is part of faith", ar: "الرِّعايةُ مِنَ الإيمان" },
      learningObjective: {
        en: "I can say that helping the orphan and the poor is part of my religion.",
        ar: "أستَطيعُ أن أقولَ إنَّ رِعايةَ اليَتيمِ والفَقيرِ مِن ديني.",
      },
      image: {
        src: IMG.greenValley,
        alt: { en: "A peaceful place that reminds us to share.", ar: "مَكانٌ هادِئٌ يُذَكِّرُنا بالمُشارَكة." },
        caption: { en: "True faith shows in how we treat the weak and the poor.", ar: "الإيمانُ الحَقُّ يَظهَرُ في مُعامَلَتِنا للضَّعيفِ والفَقير." },
      },
      body: {
        en: "Surat Al-Ma'un has seven verses. It teaches a big lesson: a person who pushes away the orphan and does not care about feeding the poor is not really living their faith. Islam is not only words — it is caring for others, especially those who need help.",
        ar: "سورةُ الماعونِ فيها سَبعُ آيات. وتُعَلِّمُ دَرسًا كَبيرًا: مَن يَدفَعُ اليَتيمَ ولا يَهتَمُّ بِإطعامِ الفَقيرِ لا يَعيشُ إيمانَهُ حَقًّا. فالإسلامُ ليسَ كَلِماتٍ فَقَط، بل هو رِعايةُ الآخَرين، خاصّةً المُحتاجين.",
      },
    },
    {
      title: { en: "The words of the surah", ar: "كَلِماتُ السّورة" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading Surat Al-Ma'un.", ar: "طِفلٌ يَقرَأُ سورةَ الماعون." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"Have you seen the one who denies the religion? That is the one who pushes away the orphan,\"", ar: "﴿أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ﴾" },
            { en: "\"and does not encourage feeding the poor.\"", ar: "﴿وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ﴾" },
          ],
        },
      ],
      body: {
        en: "Allah asks us to look at the person who does not believe in the reward and the Day of Judgment: he is harsh to the orphan and does not care if the poor stay hungry. Allah does not like this. A true believer is gentle to the orphan and loves to help feed the hungry.",
        ar: "يَطلُبُ اللهُ مِنّا أن نَنظُرَ إلى مَن لا يُؤمِنُ بالجَزاءِ ويَومِ القيامة: فهو قاسٍ على اليَتيمِ ولا يُبالي إن بَقِيَ الفَقيرُ جائِعًا. واللهُ لا يُحِبُّ هذا. والمُؤمِنُ الحَقُّ رَفيقٌ باليَتيمِ ويُحِبُّ أن يُعينَ في إطعامِ الجائِع.",
      },
    },
    {
      title: { en: "Even small kindnesses matter", ar: "حتّى أبسَطُ المَعروفِ مُهِمّ" },
      image: {
        src: IMG.lantern,
        alt: { en: "A small lantern giving useful light.", ar: "فانوسٌ صَغيرٌ يُعطي نورًا نافِعًا." },
      },
      infoBoxes: [
        {
          label: { en: "Did you know?", ar: "هل تَعلَم؟" },
          lines: [
            { en: "The surah's name 'Al-Ma'un' means small useful things we lend or share, like a cup, a tool, or water.", ar: "اسمُ السّورةِ (الماعون) يَعني الأشياءَ الصَّغيرةَ النّافِعةَ التي نُعيرُها أو نُشارِكُها، كالكوبِ أوِ الأداةِ أوِ الماء." },
          ],
        },
      ],
      body: {
        en: "The surah ends by warning against people who refuse to share even small useful things (al-ma'un), like lending a cup or helping with a tiny favour. This teaches us to be generous in big and small things. Sharing a pencil, lending a book, or helping carry something are all good deeds Allah loves.",
        ar: "تَختِمُ السّورةُ بالتَّحذيرِ مِمَّن يَمنَعونَ حتّى الأشياءَ الصَّغيرةَ النّافِعة (الماعون)، كَإعارةِ كوبٍ أوِ المُساعَدةِ في مَعروفٍ بَسيط. وهذا يُعَلِّمُنا الكَرَمَ في الكَبيرِ والصَّغير. فَمُشارَكةُ قَلَمٍ أو إعارةُ كِتابٍ أوِ المُساعَدةُ في حَملِ شيءٍ كُلُّها أعمالٌ طَيِّبةٌ يُحِبُّها الله.",
      },
    },
    {
      title: { en: "Pray, and then help others", ar: "صَلِّ ثُمَّ أعِنِ النّاس" },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A clear sky over a giving heart.", ar: "سَماءٌ صافِيةٌ فَوقَ قَلبٍ مِعطاء." },
      },
      body: {
        en: "The surah also mentions people who pray but are careless and only want others to see them. Allah wants our prayer to come from the heart, and He wants our faith to make us kind. So we pray sincerely for Allah, and then we go out and help the orphan, the poor, and anyone in need. Worship and kindness go together.",
        ar: "تَذكُرُ السّورةُ أيضًا مَن يُصَلّونَ بِغَفلةٍ ويُرائونَ النّاس. واللهُ يُريدُ صَلاتَنا مِنَ القَلب، ويُريدُ إيمانَنا أن يَجعَلَنا لُطَفاء. فَنُصَلّي مُخلِصينَ لله، ثُمَّ نَخرُجُ لِنُعينَ اليَتيمَ والفَقيرَ وكُلَّ مُحتاج. فالعِبادةُ واللُّطفُ مَعًا.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child sharing with a friend.", ar: "طِفلٌ يُشارِكُ صَديقَه." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "A friend forgot his lunch", ar: "صَديقٌ نَسِيَ غَداءَه" },
        body: {
          en: "At lunchtime, your friend has no food and looks hungry. You have a sandwich. What does Surat Al-Ma'un teach you to do?",
          ar: "في وَقتِ الغَداءِ ليسَ مَعَ صَديقِكَ طَعامٌ ويَبدو جائِعًا، ومَعَكَ شَطيرة. ماذا تُعَلِّمُكَ سورةُ الماعونِ أن تَفعَل؟",
        },
      },
      responsePrompt: {
        title: { en: "My helping deed", ar: "عَمَلي في الإعانة" },
        prompt: {
          en: "Write one way you can help a poor or hungry person, or share something useful.",
          ar: "اكتُبْ طَريقةً واحِدةً تُعينُ بِها فَقيرًا أو جائِعًا، أو تُشارِكُ بِها شيئًا نافِعًا.",
        },
        placeholder: { en: "I can help by...", ar: "أستَطيعُ أن أُعينَ بِأن..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Surat Al-Ma'un teaches us that real faith means caring for others. Let us be gentle to orphans, help feed the poor, and gladly share even the small things — because Allah loves the generous.",
        ar: "سورةُ الماعونِ تُعَلِّمُنا أنَّ الإيمانَ الحَقَّ رِعايةٌ للآخَرين. فَلْنَرفُقْ باليَتامى، ونُعِنْ في إطعامِ الفُقَراء، ونُشارِكْ بِسُرورٍ حتّى في الأشياءِ الصَّغيرة، لأنَّ اللهَ يُحِبُّ الكُرَماء.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does Surat Al-Ma'un teach us about the orphan?", ar: "ماذا تُعَلِّمُنا سورةُ الماعونِ عنِ اليَتيم؟" },
      options: [
        { en: "To be gentle and never push them away", ar: "أن نَرفُقَ بهِ ولا نَدفَعَه" },
        { en: "To ignore them", ar: "أن نَتَجاهَلَه" },
        { en: "To be harsh", ar: "أن نَقسُوَ عَلَيه" },
      ],
      correctIndex: 0,
      explanation: { en: "It blames the one who pushes away the orphan; we must be kind to orphans.", ar: "تَذُمُّ مَن يَدُعُّ اليَتيم، فَعَلَينا الرِّفقُ بِه." },
    },
    {
      prompt: { en: "What should we do for the poor?", ar: "ماذا نَفعَلُ للفَقير؟" },
      options: [
        { en: "Help feed them", ar: "نُعينُ في إطعامِهِم" },
        { en: "Leave them hungry", ar: "نَترُكُهُم جِياعًا" },
        { en: "Laugh at them", ar: "نَسخَرُ مِنهُم" },
      ],
      correctIndex: 0,
      explanation: { en: "We should care about feeding the poor.", ar: "نَهتَمُّ بِإطعامِ الفُقَراء." },
    },
    {
      prompt: { en: "What does 'Al-Ma'un' mean?", ar: "ماذا تَعني (الماعون)؟" },
      options: [
        { en: "Small useful things we share", ar: "الأشياءُ الصَّغيرةُ النّافِعةُ التي نُشارِكُها" },
        { en: "A big house", ar: "بَيتٌ كَبير" },
        { en: "A mountain", ar: "جَبَل" },
      ],
      correctIndex: 0,
      explanation: { en: "Al-Ma'un means small useful things like a cup or a tool.", ar: "الماعونُ يَعني الأشياءَ الصَّغيرةَ النّافِعةَ كالكوبِ أوِ الأداة." },
    },
    {
      prompt: { en: "Allah wants our prayer to be...", ar: "اللهُ يُريدُ صَلاتَنا أن تَكونَ..." },
      options: [
        { en: "Sincere, from the heart", ar: "مُخلِصةً مِنَ القَلب" },
        { en: "Just to show off", ar: "للرِّياءِ فَقَط" },
        { en: "Careless", ar: "بِغَفلة" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah wants sincere prayer, not showing off.", ar: "اللهُ يُريدُ الصَّلاةَ المُخلِصةَ لا الرِّياء." },
    },
    {
      prompt: { en: "True or False: Sharing small useful things is a good deed Allah loves.", ar: "صَوابٌ أم خَطأ: مُشارَكةُ الأشياءِ الصَّغيرةِ النّافِعةِ عَمَلٌ يُحِبُّهُ الله." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Generosity, even in small things, is loved by Allah.", ar: "صَواب. الكَرَمُ حتّى في الصَّغيرِ يُحِبُّهُ الله." },
    },
  ],
};
