import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const prophetUnderCare: CourseLesson = {
  slug: "g1y2-prophet-muhammad-under-care",
  name: {
    en: "Our Prophet Muhammad ﷺ Under the Care of His Grandfather and Uncle",
    ar: "رسولنا مُحَمَّد ﷺ في رِعایَةِ جَدِّهِ وَعَمّهِ",
  },
  shortIntro: {
    en: "The Prophet ﷺ became an orphan as a child. Learn how Allah cared for him through his grandfather and uncle.",
    ar: "صارَ النَّبِيُّ ﷺ يَتيمًا وهو صَغير. تَعَلَّمْ كَيفَ رَعاهُ اللهُ بِجَدِّهِ وعَمِّه.",
  },
  quranSurahs: ["Ad-Duha 6-8"],
  sections: [
    {
      title: { en: "A child without his parents", ar: "طِفلٌ بِلا والِدَيه" },
      learningObjective: {
        en: "I can say who cared for the Prophet ﷺ when he was a child.",
        ar: "أستَطيعُ أن أقولَ مَن رَعى النَّبِيَّ ﷺ في صِغَرِه.",
      },
      image: {
        src: IMG.greenValley,
        alt: { en: "An open land like the deserts of Arabia.", ar: "أرضٌ واسِعةٌ مِثلُ صَحاري الجَزيرة." },
        caption: { en: "Even as an orphan, the Prophet ﷺ was never alone — Allah cared for him.", ar: "حتّى وهو يَتيمٌ لم يَكُنِ النَّبِيُّ ﷺ وَحيدًا، فاللهُ رَعاه." },
      },
      body: {
        en: "Our Prophet Muhammad ﷺ lost his father before he was born. When he was about six years old, his mother Aminah also passed away. Now he was an orphan with no mother or father. But Allah did not leave him alone — He gave him a loving grandfather to care for him.",
        ar: "فَقَدَ نَبِيُّنا مُحمَّدٌ ﷺ أباهُ قَبلَ أن يولَد. ولَمّا بَلَغَ نَحوَ السّادِسةِ تُوُفِّيَت أُمُّهُ آمِنةُ أيضًا. فَصارَ يَتيمًا بِلا أُمٍّ ولا أب. لكِنَّ اللهَ لم يَترُكْهُ وَحدَه، فَوَهَبَهُ جَدًّا حَنونًا يَرعاه.",
      },
    },
    {
      title: { en: "Allah cared for the orphan", ar: "اللهُ رَعى اليَتيم" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading Surat Ad-Duha.", ar: "طِفلٌ يَقرَأُ سورةَ الضُّحى." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"Did He not find you an orphan and give you shelter?\" — Ad-Duha 6", ar: "﴿أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ﴾ — الضُّحى ٦" },
            { en: "It means: Allah took care of the Prophet ﷺ when he was an orphan and gave him a safe home.", ar: "مَعناها: رَعى اللهُ النَّبِيَّ ﷺ وهو يَتيمٌ وآواهُ في بَيتٍ آمِن." },
          ],
        },
      ],
      body: {
        en: "Allah reminds the Prophet ﷺ in the Qur'an: 'Did He not find you an orphan and give you shelter?' This means that even though he had no mother or father, Allah took care of him and protected him. This teaches us that Allah is always near to those who feel alone.",
        ar: "يُذَكِّرُ اللهُ النَّبِيَّ ﷺ في القُرآن: ﴿أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ﴾. أي رَغمَ أنَّهُ بِلا أُمٍّ ولا أبٍ رَعاهُ اللهُ وحَماه. وهذا يُعَلِّمُنا أنَّ اللهَ قَريبٌ دائِمًا مِمَّن يَشعُرونَ بالوَحدة.",
      },
    },
    {
      title: { en: "His grandfather and his uncle", ar: "جَدُّهُ وعَمُّه" },
      image: {
        src: IMG.grandMosque,
        alt: { en: "The holy city where the Prophet ﷺ grew up.", ar: "المَدينةُ المُقَدَّسةُ التي نَشَأَ فيها النَّبِيُّ ﷺ." },
      },
      body: {
        en: "First, the Prophet's grandfather, Abdul-Muttalib, took care of him and loved him dearly. When the Prophet ﷺ was about eight, his grandfather passed away. Then his uncle Abu Talib became his guardian. Abu Talib loved him, protected him, and treated him like his own son. As a young man, the Prophet ﷺ worked as a shepherd and was so honest that people called him Al-Amin — 'the trustworthy one'.",
        ar: "أوّلًا رَعاهُ جَدُّهُ عبدُالمُطَّلِبِ وأحَبَّهُ كَثيرًا. ولَمّا بَلَغَ نَحوَ الثّامِنةِ تُوُفِّيَ جَدُّه. فَصارَ عَمُّهُ أبو طالِبٍ كافِلَهُ. وأحَبَّهُ أبو طالِبٍ وحَماهُ وعامَلَهُ كابنِه. ولَمّا شَبَّ عَمِلَ النَّبِيُّ ﷺ راعِيًا للغَنَم، وكانَ صادِقًا حتّى لَقَّبَهُ النّاسُ بالأمين.",
      },
    },
    {
      title: { en: "Caring for orphans", ar: "كَفالةُ اليَتيم" },
      image: {
        src: IMG.lantern,
        alt: { en: "A warm lantern, like a caring heart.", ar: "فانوسٌ دافِئٌ كَقَلبٍ رَحيم." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"I and the one who cares for an orphan will be like these two in Paradise\" — and he held up two fingers together. (Bukhari)", ar: "قال النَّبِيُّ ﷺ: «أنا وكافِلُ اليَتيمِ في الجَنّةِ هكَذا» — وأشارَ بِإصبَعَيهِ مُتَقارِبَتَين. (رواه البخاري)" },
          ],
        },
      ],
      body: {
        en: "Because the Prophet ﷺ was an orphan, he had a very soft heart for orphans. He taught us that whoever takes care of an orphan will be very close to him in Paradise. So we are kind to children who have no parents, we play with them, share with them, and never make them sad.",
        ar: "ولأنَّ النَّبِيَّ ﷺ كانَ يَتيمًا، كانَ قَلبُهُ رَقيقًا جِدًّا على اليَتامى. وعَلَّمَنا أنَّ مَن يَكفُلُ يَتيمًا يَكونُ قَريبًا مِنهُ جِدًّا في الجَنّة. فَنَلطُفُ بالأطفالِ الذينَ بِلا والِدَين، ونَلعَبُ مَعَهُم، ونُشارِكُهُم، ولا نُحزِنُهُم أبَدًا.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child being kind to a friend.", ar: "طِفلٌ يَلطُفُ بِصَديق." },
      },
      callout: {
        label: { en: "Think with me", ar: "فَكِّرْ مَعي" },
        title: { en: "Being thankful and kind", ar: "الشُّكرُ واللُّطف" },
        body: {
          en: "I will thank Allah for my parents and family who care for me. And I will be extra kind to any child who has lost a parent, just as the Prophet ﷺ taught us to care for orphans.",
          ar: "سأشكُرُ اللهَ على والِدَيَّ وأُسرَتي الذينَ يَرعَونَني. وسأكونُ لَطيفًا جِدًّا مَعَ أيِّ طِفلٍ فَقَدَ أحَدَ والِدَيه، كَما عَلَّمَنا النَّبِيُّ ﷺ كَفالةَ اليَتيم.",
        },
      },
      responsePrompt: {
        title: { en: "My thankful heart", ar: "قَلبي الشّاكِر" },
        prompt: {
          en: "Write a thank-you to Allah for someone in your family who cares for you.",
          ar: "اكتُبْ شُكرًا لله على أحَدٍ في أُسرَتِكَ يَرعاك.",
        },
        placeholder: { en: "Thank you Allah for...", ar: "شُكرًا لله على..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Allah cared for the Prophet ﷺ through his grandfather and uncle, and the Prophet ﷺ grew up honest and kind. Let us be thankful for our families and gentle with every child, especially orphans.",
        ar: "رَعى اللهُ النَّبِيَّ ﷺ بِجَدِّهِ وعَمِّه، فَنَشَأَ صادِقًا لَطيفًا. فَلْنَشكُرِ اللهَ على أُسَرِنا ولْنَرفُقْ بِكُلِّ طِفل، خاصّةً اليَتيم.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who cared for the Prophet ﷺ first after his mother passed away?", ar: "مَن رَعى النَّبِيَّ ﷺ أوّلًا بعدَ وَفاةِ أُمِّه؟" },
      options: [
        { en: "His grandfather Abdul-Muttalib", ar: "جَدُّهُ عبدُالمُطَّلِب" },
        { en: "A stranger", ar: "رَجُلٌ غَريب" },
        { en: "No one", ar: "لا أحَد" },
      ],
      correctIndex: 0,
      explanation: { en: "His grandfather Abdul-Muttalib cared for him and loved him.", ar: "رَعاهُ جَدُّهُ عبدُالمُطَّلِبِ وأحَبَّه." },
    },
    {
      prompt: { en: "Who cared for the Prophet ﷺ after his grandfather?", ar: "مَن رَعى النَّبِيَّ ﷺ بعدَ جَدِّه؟" },
      options: [
        { en: "His uncle Abu Talib", ar: "عَمُّهُ أبو طالِب" },
        { en: "His teacher", ar: "مُعَلِّمُه" },
        { en: "The king", ar: "المَلِك" },
      ],
      correctIndex: 0,
      explanation: { en: "His uncle Abu Talib protected and cared for him.", ar: "كَفَلَهُ عَمُّهُ أبو طالِبٍ وحَماه." },
    },
    {
      prompt: { en: "What did people call the Prophet ﷺ because he was so honest?", ar: "بِماذا لَقَّبَ النّاسُ النَّبِيَّ ﷺ لِصِدقِه؟" },
      options: [
        { en: "Al-Amin (the trustworthy)", ar: "الأمين" },
        { en: "The fast runner", ar: "العَدّاء" },
        { en: "The rich man", ar: "الغَنيّ" },
      ],
      correctIndex: 0,
      explanation: { en: "They called him Al-Amin, the trustworthy one.", ar: "لَقَّبوهُ بالأمينِ لِصِدقِهِ وأمانَتِه." },
    },
    {
      prompt: { en: "What is the reward for caring for an orphan?", ar: "ما جَزاءُ كَفالةِ اليَتيم؟" },
      options: [
        { en: "Being close to the Prophet ﷺ in Paradise", ar: "القُربُ مِنَ النَّبِيِّ ﷺ في الجَنّة" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "Becoming rich", ar: "الغِنى" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ said the one who cares for an orphan will be close to him in Paradise.", ar: "قال النَّبِيُّ ﷺ إنَّ كافِلَ اليَتيمِ يَكونُ قَريبًا مِنهُ في الجَنّة." },
    },
    {
      prompt: { en: "True or False: Allah took care of the Prophet ﷺ when he was an orphan.", ar: "صَوابٌ أم خَطأ: رَعى اللهُ النَّبِيَّ ﷺ وهو يَتيم." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. 'Did He not find you an orphan and give you shelter?'", ar: "صَواب. ﴿أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ﴾." },
    },
  ],
};
