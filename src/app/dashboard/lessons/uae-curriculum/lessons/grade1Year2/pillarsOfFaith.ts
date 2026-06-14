import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const pillarsOfFaith: CourseLesson = {
  slug: "g1y2-the-pillars-of-faith",
  name: { en: "The Pillars of Faith", ar: "أركان الإیمانِ" },
  shortIntro: {
    en: "Iman (faith) has six pillars. Let us learn the six things every Muslim believes in their heart.",
    ar: "الإيمانُ لَهُ سِتّةُ أركان. لِنَتَعَلَّمِ الأشياءَ السِّتّةَ التي يُؤمِنُ بِها كُلُّ مُسلِمٍ بِقَلبِه.",
  },
  quranSurahs: ["Al-Baqarah 285"],
  sections: [
    {
      title: { en: "Faith has six pillars", ar: "للإيمانِ سِتّةُ أركان" },
      learningObjective: {
        en: "I can name the six pillars of faith (iman).",
        ar: "أستَطيعُ أن أُسَمِّيَ أركانَ الإيمانِ السِّتّة.",
      },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A clear sky, like a calm believing heart.", ar: "سَماءٌ صافِيةٌ كَقَلبٍ مُؤمِنٍ مُطمَئِنّ." },
        caption: { en: "Iman is the belief we keep in our hearts.", ar: "الإيمانُ هو ما نَحمِلُهُ في قُلوبِنا مِن تَصديق." },
      },
      body: {
        en: "Islam is what we do (like prayer and charity), and iman is what we believe in our hearts. Iman has six pillars. A Muslim believes in: (1) Allah, (2) His angels, (3) His books, (4) His messengers, (5) the Last Day, and (6) al-qadar — that everything happens by Allah's plan.",
        ar: "الإسلامُ هو ما نَفعَلُهُ (كالصَّلاةِ والزَّكاة)، والإيمانُ هو ما نُصَدِّقُ بهِ في قُلوبِنا. وللإيمانِ سِتّةُ أركان. يُؤمِنُ المُسلِمُ بـ: (١) اللهِ، (٢) ومَلائِكَتِه، (٣) وكُتُبِه، (٤) ورُسُلِه، (٥) واليَومِ الآخِر، (٦) والقَدَر: أنَّ كُلَّ شيءٍ يَحدُثُ بِتَقديرِ الله.",
      },
    },
    {
      title: { en: "What the Qur'an says", ar: "ماذا يَقولُ القُرآن" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an.", ar: "طِفلٌ يَقرَأُ القُرآن." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"The Messenger believes in what was revealed to him from his Lord, and so do the believers. Each one believes in Allah, His angels, His books, and His messengers...\" — Al-Baqarah 285", ar: "﴿آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ...﴾ — البقرة ٢٨٥" },
          ],
        },
      ],
      body: {
        en: "Allah tells us in the Qur'an that the believers believe in Allah, His angels, His books, and His messengers. The Prophet ﷺ also taught us about belief in the Last Day and in al-qadar. Together these make the six pillars of faith.",
        ar: "يُخبِرُنا اللهُ في القُرآنِ أنَّ المُؤمِنينَ يُؤمِنونَ باللهِ ومَلائِكَتِهِ وكُتُبِهِ ورُسُلِه. وعَلَّمَنا النَّبِيُّ ﷺ أيضًا الإيمانَ باليَومِ الآخِرِ وبالقَدَر. وهذهِ كُلُّها أركانُ الإيمانِ السِّتّة.",
      },
    },
    {
      title: { en: "Belief in Allah, angels, and books", ar: "الإيمانُ باللهِ والمَلائِكةِ والكُتُب" },
      image: {
        src: IMG.lantern,
        alt: { en: "A glowing lantern of guidance.", ar: "فانوسُ هِدايةٍ مُضيء." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith (Jibril)", ar: "حَديث (جِبريل)" },
          lines: [
            { en: "The Prophet ﷺ said iman is: \"to believe in Allah, His angels, His books, His messengers, the Last Day, and to believe in al-qadar...\" (Muslim)", ar: "قال النَّبِيُّ ﷺ: الإيمانُ «أن تُؤمِنَ باللهِ ومَلائِكَتِهِ وكُتُبِهِ ورُسُلِهِ واليَومِ الآخِر، وتُؤمِنَ بالقَدَر...». (رواه مسلم)" },
          ],
        },
      ],
      body: {
        en: "First, we believe in Allah: He is our One Lord and Creator. Second, we believe in the angels: special creatures of light who always obey Allah, like Jibril. Third, we believe in Allah's books, like the Qur'an, the Tawrah, the Injil, and the Zabur — the Qur'an is the last and best.",
        ar: "أوّلًا: نُؤمِنُ باللهِ، فهو رَبُّنا الواحِدُ وخالِقُنا. ثانِيًا: نُؤمِنُ بالمَلائِكة، وهُم خَلقٌ مِن نورٍ يُطيعونَ اللهَ دائِمًا، مِثلُ جِبريل. ثالِثًا: نُؤمِنُ بِكُتُبِ اللهِ كالقُرآنِ والتَّوراةِ والإنجيلِ والزَّبور، والقُرآنُ آخِرُها وأفضَلُها.",
      },
    },
    {
      title: { en: "Messengers, the Last Day, and al-qadar", ar: "الرُّسُلُ واليَومُ الآخِرُ والقَدَر" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A peaceful valley made by Allah.", ar: "وادٍ هادِئٌ مِن خَلقِ الله." },
      },
      body: {
        en: "Fourth, we believe in Allah's messengers, like Adam, Nuh, Ibrahim, Musa, Isa, and the last one, Muhammad ﷺ. Fifth, we believe in the Last Day, when Allah will bring everyone back to life and reward the good and judge the bad. Sixth, we believe in al-qadar: nothing happens except by Allah's knowledge and plan, so we trust Allah always.",
        ar: "رابِعًا: نُؤمِنُ بِرُسُلِ اللهِ كآدَمَ ونوحٍ وإبراهيمَ وموسى وعيسى، وآخِرُهُم مُحمَّدٌ ﷺ. خامِسًا: نُؤمِنُ باليَومِ الآخِرِ حينَ يُعيدُ اللهُ النّاسَ إلى الحَياةِ فَيُجازي المُحسِنَ ويُحاسِبُ المُسيء. سادِسًا: نُؤمِنُ بالقَدَر: لا يَحدُثُ شيءٌ إلّا بِعِلمِ اللهِ وتَقديرِه، فَنَثِقُ باللهِ دائِمًا.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child thinking about faith.", ar: "طِفلٌ يُفَكِّرُ في الإيمان." },
      },
      callout: {
        label: { en: "Think with me", ar: "فَكِّرْ مَعي" },
        title: { en: "How does iman help me?", ar: "كَيفَ يُساعِدُني الإيمان؟" },
        body: {
          en: "When I believe Allah sees me, I behave well even when no one is watching. When I believe in al-qadar, I stay calm if something goes wrong, knowing Allah has a plan. Faith makes my heart strong and happy.",
          ar: "حينَ أُؤمِنُ أنَّ اللهَ يَراني أتَصَرَّفُ بِأدَبٍ حتّى لو لم يَرَني أحَد. وحينَ أُؤمِنُ بالقَدَرِ أبقى هادِئًا إذا حَدَثَ ما لا أُحِبّ، عالِمًا أنَّ لله حِكمة. والإيمانُ يَجعَلُ قَلبي قَوِيًّا سَعيدًا.",
        },
      },
      responsePrompt: {
        title: { en: "My six beliefs", ar: "إيماني بالسِّتّة" },
        prompt: {
          en: "Name two of the six pillars of faith you remember.",
          ar: "سَمِّ رُكنَينِ مِن أركانِ الإيمانِ السِّتّةِ تَتَذَكَّرُهُما.",
        },
        placeholder: { en: "I believe in...", ar: "أُؤمِنُ بـ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "The six pillars of faith fill our hearts with belief and trust in Allah. When we believe firmly, we live with peace, hope, and good manners.",
        ar: "أركانُ الإيمانِ السِّتّةُ تَملأُ قُلوبَنا تَصديقًا وثِقةً بالله. وحينَ نُؤمِنُ بِيَقينٍ نَعيشُ بِسَلامٍ وأمَلٍ وحُسنِ خُلُق.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "How many pillars of faith (iman) are there?", ar: "كَم رُكنًا للإيمان؟" },
      options: [
        { en: "Six", ar: "سِتّة" },
        { en: "Five", ar: "خَمسة" },
        { en: "Three", ar: "ثَلاثة" },
      ],
      correctIndex: 0,
      explanation: { en: "There are six pillars of faith.", ar: "أركانُ الإيمانِ سِتّة." },
    },
    {
      prompt: { en: "Which of these is a pillar of faith?", ar: "أيٌّ مِن هذهِ رُكنٌ مِن أركانِ الإيمان؟" },
      options: [
        { en: "Belief in the angels", ar: "الإيمانُ بالمَلائِكة" },
        { en: "Playing football", ar: "لَعِبُ كُرةِ القَدَم" },
        { en: "Eating sweets", ar: "أكلُ الحَلوى" },
      ],
      correctIndex: 0,
      explanation: { en: "Belief in the angels is one of the six pillars.", ar: "الإيمانُ بالمَلائِكةِ رُكنٌ مِنَ السِّتّة." },
    },
    {
      prompt: { en: "Who is the last messenger?", ar: "مَن آخِرُ الرُّسُل؟" },
      options: [
        { en: "Prophet Muhammad ﷺ", ar: "النَّبِيُّ مُحمَّد ﷺ" },
        { en: "Prophet Adam", ar: "النَّبِيُّ آدَم" },
        { en: "Prophet Musa", ar: "النَّبِيُّ موسى" },
      ],
      correctIndex: 0,
      explanation: { en: "Prophet Muhammad ﷺ is the last of all the messengers.", ar: "النَّبِيُّ مُحمَّدٌ ﷺ آخِرُ الرُّسُلِ جَميعًا." },
    },
    {
      prompt: { en: "What does belief in al-qadar mean?", ar: "ماذا يَعني الإيمانُ بالقَدَر؟" },
      options: [
        { en: "Everything happens by Allah's plan", ar: "كُلُّ شيءٍ يَحدُثُ بِتَقديرِ الله" },
        { en: "We control everything ourselves", ar: "نَحنُ نَتَحَكَّمُ بِكُلِّ شيء" },
        { en: "Nothing matters", ar: "لا شيءَ مُهِمّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Al-qadar means everything happens by Allah's knowledge and plan.", ar: "القَدَرُ يَعني أنَّ كُلَّ شيءٍ يَحدُثُ بِعِلمِ اللهِ وتَقديرِه." },
    },
    {
      prompt: { en: "True or False: We believe in Allah's books, like the Qur'an.", ar: "صَوابٌ أم خَطأ: نُؤمِنُ بِكُتُبِ اللهِ كالقُرآن." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Belief in Allah's books is a pillar of faith.", ar: "صَواب. الإيمانُ بِكُتُبِ اللهِ رُكنٌ مِنَ الإيمان." },
    },
  ],
};
