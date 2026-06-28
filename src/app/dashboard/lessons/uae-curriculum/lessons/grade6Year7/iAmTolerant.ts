import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const iAmTolerant: CourseLesson = {
  slug: "g6y7-i-am-tolerant",
  name: { en: "I Am Tolerant", ar: "أنا مُتَسامِح" },
  shortIntro: {
    en: "Tolerance (tasamuh) is a hallmark of Islam: gentleness in dealings, fairness to others, respecting people of different faiths in a just society, and forgiving wrongs. A deep study of authentic Islamic tolerance — its meaning, its limits, and its place in the UAE.",
    ar: "التَّسامُحُ سِمةٌ مِن سِماتِ الإسلام: لينٌ في المُعامَلة، وعَدلٌ مَعَ الآخَرين، واحتِرامٌ لِأهلِ الأديانِ في مُجتَمَعٍ عادِل، وعَفوٌ عنِ الإساءة. دِراسةٌ عَميقةٌ لِلتَّسامُحِ الإسلاميِّ الأصيل — مَعناهُ وحُدودُهُ ومَكانَتُهُ في الإمارات.",
  },
  quranSurahs: ["Al-Mumtahanah 8", "Al-Baqarah 256", "Fussilat 34"],
  sections: [
    {
      title: { en: "Critical thinking (Warm up)", ar: "تفكير ناقد (تهيئة)" },
      learningObjectives: [
        { en: "Evaluate a real-world scenario using evidence from Quran, Sunnah, and Islamic values.", ar: "أُقيّم سيناريو واقعيًّا بأدلّة من القرآن والسنّة والقيم الإسلاميّة." },
      ],
      image: {
        src: IMG.hijabStudent,
        alt: { en: "Student thinking critically.", ar: "طالب يفكّر بشكل ناقد." },
      },
      callout: {
        label: { en: "Critical thinking scenario", ar: "سيناريو للتفكير الناقد" },
        title: { en: "Does tolerance mean accepting everything?", ar: "هل التسامح يعني قبول كلّ شيء؟" },
        body: {
          en: "A student says: \'Tolerance is weakness. If someone insults me, I should fight back. Islam teaches us to be strong, not soft. Tolerating others means I agree with their mistakes.\'",
          ar: "طالب يقول: «التسامح ضعف. لو أهانني أحد يجب أن أردّ. الإسلام يعلّمنا القوّة لا اللين. التسامح يعني الموافقة على أخطائهم.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on tolerance and coexistence.",
          ar: "انتقد بالقرآن والحديث عن التسامح والتعايش.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Repel evil with that which is better.\' (Fussilat 34)",
        ar: "﴿ادفع بالتي هي أحسن﴾ (فصّلت ٣٤)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Tasamuh (Tolerance)", ar: "تسامح" } },
          { image: IMG.grandMosque, keyword: { en: "Ta\'ayush (Coexistence)", ar: "تعايش" } },
          { image: IMG.lantern, keyword: { en: "Rahma (Mercy)", ar: "رحمة" } },
          { image: IMG.bookshelf, keyword: { en: "Afw (Pardon)", ar: "عفو" } },
          { image: IMG.skyBlue, keyword: { en: "Ikhtiram (Respect)", ar: "احترام" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'O mankind, We created you from male and female and made you peoples and tribes that you may know one another.\' (Al-Hujurat 13)",
        ar: "﴿يا أيّها الناس إنّا خلقناكم من ذكر وأنثى وجعلناكم شعوبًا وقبائل لتعارفوا﴾ (الحجرات ١٣)",
      },
    },
    {
      title: { en: "I Am Tolerant", ar: "أنا مُتَسامِح" },
      learningObjectives: [
        { en: "Explain the Islamic concept of tolerance and coexistence.", ar: "أشرح مفهوم التسامح والتعايش في الإسلام." },
        { en: "Describe how the UAE embodies Islamic tolerance.", ar: "أصف كيف تجسّد الإمارات التسامح الإسلامي." },
      ],
      successCriteria: [
        { en: "I can define tolerance in Islam.", ar: "أعرّف التسامح في الإسلام." },
        { en: "I can give 3 examples of Prophet\'s tolerance.", ar: "أعطي ٣ أمثلة لتسامح النبيّ." },
        { en: "I can explain how the UAE promotes tolerance.", ar: "أشرح كيف تروّج الإمارات للتسامح." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "I Am Tolerant — Islamic Tolerance and Coexistence", ar: "أنا متسامح — التسامح والتعايش في الإسلام" },
      learningObjectives: [
        { en: "Understand tolerance as a core Islamic value and UAE national identity.", ar: "أفهم التسامح كقيمة إسلاميّة أساسيّة وهويّة وطنيّة إماراتيّة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Tolerance in Quran", ar: "التسامح في القرآن" },
          lines: [
            { en: "Al-Hujurat 13: Made nations to know each other. Fussilat 34: Repel evil with good. Al-Kafirun 6: \'For you is your religion, for me is mine.\' Tolerance = strength, not weakness.", ar: "الحجرات ١٣: لتعارفوا. فصّلت ٣٤: ادفع بالتي هي أحسن. الكافرون ٦: «لكم دينكم ولي دين.» التسامح = قوّة لا ضعف." },
          ],
        },
        {
          label: { en: "Prophet\'s Tolerance", ar: "تسامح النبيّ" },
          lines: [
            { en: "He forgave Quraysh at the Conquest. He was kind to the Jewish neighbour who threw rubbish at him. He welcomed the delegation from Najran (Christians) in his mosque.", ar: "عفا عن قريش عند الفتح. أحسن لجاره اليهودي. رحّب بوفد نجران (المسيحيّين) في مسجده." },
          ],
        },
        {
          label: { en: "UAE and Tolerance", ar: "الإمارات والتسامح" },
          lines: [
            { en: "The UAE has a Minister of Tolerance, Year of Tolerance (2019), houses of worship for many religions, and 200+ nationalities living peacefully together.", ar: "الإمارات لديها وزير تسامح وعام التسامح (٢٠١٩) ودور عبادة لأديان متعدّدة و٢٠٠ جنسيّة تعيش بسلام." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Islam teaches tolerance.", ar: "الإسلام يعلّم التسامح." }, answer: true },
        { statement: { en: "Tolerance means weakness.", ar: "التسامح يعني الضعف." }, answer: false },
        { statement: { en: "The Prophet forgave Quraysh.", ar: "النبيّ عفا عن قريش." }, answer: true },
        { statement: { en: "UAE promotes intolerance.", ar: "الإمارات تروّج لعدم التسامح." }, answer: false },
        { statement: { en: "Al-Hujurat 13 is about coexistence.", ar: "الحجرات ١٣ عن التعايش." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Repel evil with that which is _______.", ar: "﴿ادفع بالتي هي _______.﴾" }, answer: { en: "better", ar: "أحسن" } },
        { sentence: { en: "Made peoples and tribes to _______ one another.", ar: "جعلناكم شعوبًا وقبائل ل_______." }, answer: { en: "know", ar: "تعارفوا" } },
        { sentence: { en: "UAE had Year of _______ in 2019.", ar: "الإمارات أعلنت عام _______ ٢٠١٩." }, answer: { en: "Tolerance", ar: "التسامح" } },
        { sentence: { en: "\'For you is your religion, for me is _______.", ar: "﴿لكم دينكم ولي _______.﴾" }, answer: { en: "mine", ar: "دين" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Tolerance is Islamic strength — repelling evil with good, knowing one another, and coexisting peacefully.",
        ar: "التسامح قوّة إسلاميّة — دفع السوء بالحُسنى والتعارف والتعايش بسلام.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore tolerance from different angles.", ar: "استكشف التسامح من زوايا مختلفة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Students collaborating.", ar: "طلاب يتعاونون." },
      },
      groupWorkCards: {
        title: { en: "Choose Your Task", ar: "اختر مهمّتك" },
        instruction: { en: "Each group picks one card. Study the information, complete the task, and present to the class.", ar: "تختار كلّ مجموعة بطاقة. ادرسوا المعلومات وأنجزوا المهمّة وقدّموا للصفّ." },
        presentationNote: { en: "All Quran and Hadith must be authentic with references.", ar: "يجب أن يكون كلّ قرآن وحديث صحيحًا بمصادره." },
        cards: [
          {
            id: "A",
            title: { en: "Quranic Tolerance", ar: "التسامح القرآني" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Verses on coexistence", ar: "آيات التعايش" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Hujurat 13, Fussilat 34, Al-Kafirun 6.", ar: "الحجرات ١٣ وفصّلت ٣٤ والكافرون ٦." } },
              { label: { en: "Principle", ar: "مبدأ" }, content: { en: "Diversity is by Allah\'s design — for mutual learning.", ar: "التنوّع بتصميم الله — للتعلّم المتبادل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Tolerance is commanded, not optional.", ar: "التسامح مأمور به لا اختياري." } },
            ],
            task: {
              title: { en: "Analyse Tolerance Verses", ar: "حلّل آيات التسامح" },
              description: { en: "Pick 3 verses on tolerance and explain their relevance today.", ar: "اختر ٣ آيات عن التسامح واشرح أهمّيّتها." },
              hint: { en: "Include: verse, context, modern application.", ar: "ضمّن: الآية والسياق والتطبيق المعاصر." },
            },
          },
          {
            id: "B",
            title: { en: "Prophet\'s Examples", ar: "أمثلة النبيّ" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Tolerance in action", ar: "التسامح عمليًّا" },
            infoSections: [
              { label: { en: "Example", ar: "مثال" }, content: { en: "Forgave Quraysh, was kind to the Jewish neighbour, hosted Christians in mosque.", ar: "عفا عن قريش وأحسن لجاره اليهودي واستضاف المسيحيّين." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Be merciful to those on earth, and the One in heaven will be merciful to you.\' (Tirmidhi)", ar: "«ارحموا من في الأرض يرحمكم من في السماء.» (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The Prophet was the most tolerant human.", ar: "النبيّ كان أكثر الناس تسامحًا." } },
            ],
            task: {
              title: { en: "Write 3 Prophet Examples", ar: "اكتب ٣ أمثلة نبويّة" },
              description: { en: "Describe 3 instances of the Prophet\'s tolerance.", ar: "صف ٣ مواقف لتسامح النبيّ." },
              hint: { en: "Include: the situation, his response, the lesson.", ar: "ضمّن: الموقف واستجابته والدرس." },
            },
          },
          {
            id: "C",
            title: { en: "UAE Tolerance Model", ar: "نموذج التسامح الإماراتي" },
            image: IMG.skyBlue,
            color: "purple",
            topic: { en: "A modern example", ar: "مثال معاصر" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "200+ nationalities, houses of worship, Minister of Tolerance, interfaith dialogue.", ar: "أكثر من ٢٠٠ جنسيّة ودور عبادة ووزير تسامح وحوار أديان." } },
              { label: { en: "Values", ar: "قيم" }, content: { en: "UAE promotes coexistence as a national priority.", ar: "الإمارات تروّج للتعايش كأولويّة وطنيّة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Modern tolerance builds on Islamic foundations.", ar: "التسامح الحديث يُبنى على أُسس إسلاميّة." } },
            ],
            task: {
              title: { en: "Research UAE Tolerance", ar: "ابحث عن التسامح الإماراتي" },
              description: { en: "Write about 3 UAE tolerance initiatives.", ar: "اكتب عن ٣ مبادرات تسامح إماراتيّة." },
              hint: { en: "Include: name, purpose, impact.", ar: "ضمّن: الاسم والهدف والأثر." },
            },
          },
          {
            id: "D",
            title: { en: "Tolerance at School", ar: "التسامح في المدرسة" },
            image: IMG.bookshelf,
            color: "amber",
            topic: { en: "Practical tolerance", ar: "التسامح العملي" },
            infoSections: [
              { label: { en: "Application", ar: "تطبيق" }, content: { en: "Respecting different cultures, helping new students, resolving conflicts peacefully.", ar: "احترام الثقافات ومساعدة الطلّاب الجدد وحلّ النزاعات بسلام." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'None of you truly believes until he wishes for his brother what he wishes for himself.\' (Bukhari)", ar: "«لا يؤمن أحدكم حتّى يحبّ لأخيه ما يحبّ لنفسه.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Tolerance starts in the classroom.", ar: "التسامح يبدأ في الفصل." } },
            ],
            task: {
              title: { en: "Create Tolerance Actions", ar: "أنشئ أعمال تسامح" },
              description: { en: "Write 5 ways to show tolerance at school.", ar: "اكتب ٥ طرق لإظهار التسامح في المدرسة." },
              hint: { en: "Include: situation, action, impact on others.", ar: "ضمّن: الموقف والعمل والأثر." },
            },
          },
          {
            id: "E",
            title: { en: "Tolerance vs Agreeing", ar: "التسامح مقابل الموافقة" },
            image: IMG.lantern,
            color: "rose",
            topic: { en: "They are not the same", ar: "ليسا نفس الشيء" },
            infoSections: [
              { label: { en: "Clarification", ar: "توضيح" }, content: { en: "Tolerance = respecting differences while holding your beliefs. It does NOT mean approving everything.", ar: "التسامح = احترام الاختلاف مع التمسّك بمعتقداتك. لا يعني الموافقة على كلّ شيء." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'For you is your religion, for me is mine.\' (Al-Kafirun 6)", ar: "﴿لكم دينكم ولي دين﴾ (الكافرون ٦)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "You can disagree respectfully.", ar: "يمكنك أن تختلف باحترام." } },
            ],
            task: {
              title: { en: "Define Tolerance Correctly", ar: "عرّف التسامح صحيحًا" },
              description: { en: "Explain the difference between tolerance and agreement.", ar: "اشرح الفرق بين التسامح والموافقة." },
              hint: { en: "Include: definition, examples, boundaries.", ar: "ضمّن: التعريف والأمثلة والحدود." },
            },
          },
        ],
        coinsReward: 15,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Hinge Questions", ar: "أسئلة محوريّة" },
      learningObjectives: [
        { en: "Test your understanding of everything studied.", ar: "اختبر فهمك لكلّ ما درسته." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Assessment.", ar: "تقييم." },
      },
      hingeQuestions: {
        title: { en: "Hinge Questions — Test Your Understanding", ar: "أسئلة محوريّة — اختبر فهمك" },
        instruction: { en: "Answer all 10 questions.", ar: "أجب عن الأسئلة العشرة." },
        questions: [
          {
            question: { en: "Islam teaches?", ar: "الإسلام يعلّم؟" },
            options: [
            { en: "Tolerance", ar: "التسامح" },
            { en: "Intolerance", ar: "عدم التسامح" },
            { en: "Isolation", ar: "العزلة" },
            { en: "Fighting", ar: "القتال" },
            ],
            correctIndex: 0,
            explanation: { en: "Tolerance.", ar: "التسامح." },
          },
          {
            question: { en: "Tolerance is?", ar: "التسامح؟" },
            options: [
            { en: "Strength", ar: "قوّة" },
            { en: "Weakness", ar: "ضعف" },
            { en: "Stupidity", ar: "غباء" },
            { en: "Laziness", ar: "كسل" },
            ],
            correctIndex: 0,
            explanation: { en: "Strength.", ar: "قوّة." },
          },
          {
            question: { en: "Al-Hujurat 13 says?", ar: "الحجرات ١٣ تقول؟" },
            options: [
            { en: "Made you to know each other", ar: "لتعارفوا" },
            { en: "To fight", ar: "لتقاتلوا" },
            { en: "To ignore", ar: "لتتجاهلوا" },
            { en: "To compete", ar: "لتتنافسوا" },
            ],
            correctIndex: 0,
            explanation: { en: "Made you to know each other.", ar: "لتعارفوا." },
          },
          {
            question: { en: "Prophet forgave?", ar: "النبيّ عفا عن؟" },
            options: [
            { en: "Quraysh", ar: "قريش" },
            { en: "No one", ar: "لا أحد" },
            { en: "Only friends", ar: "الأصدقاء فقط" },
            { en: "Only family", ar: "العائلة فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Quraysh at the Conquest.", ar: "قريش عند الفتح." },
          },
          {
            question: { en: "UAE Year of Tolerance?", ar: "عام التسامح الإماراتي؟" },
            options: [
            { en: "2019", ar: "٢٠١٩" },
            { en: "2000", ar: "٢٠٠٠" },
            { en: "1990", ar: "١٩٩٠" },
            { en: "2025", ar: "٢٠٢٥" },
            ],
            correctIndex: 0,
            explanation: { en: "2019.", ar: "٢٠١٩." },
          },
          {
            question: { en: "Repel evil with?", ar: "ادفع السوء ب؟" },
            options: [
            { en: "What is better", ar: "التي هي أحسن" },
            { en: "More evil", ar: "سوء أكثر" },
            { en: "Violence", ar: "العنف" },
            { en: "Silence", ar: "الصمت" },
            ],
            correctIndex: 0,
            explanation: { en: "What is better.", ar: "التي هي أحسن." },
          },
          {
            question: { en: "How many nationalities in UAE?", ar: "كم جنسيّة في الإمارات؟" },
            options: [
            { en: "200+", ar: "أكثر من ٢٠٠" },
            { en: "10", ar: "١٠" },
            { en: "5", ar: "٥" },
            { en: "50", ar: "٥٠" },
            ],
            correctIndex: 0,
            explanation: { en: "Over 200.", ar: "أكثر من ٢٠٠." },
          },
          {
            question: { en: "Does tolerance = agreeing?", ar: "هل التسامح = الموافقة؟" },
            options: [
            { en: "No", ar: "لا" },
            { en: "Yes", ar: "نعم" },
            { en: "Always", ar: "دائمًا" },
            { en: "Only sometimes", ar: "أحيانًا" },
            ],
            correctIndex: 0,
            explanation: { en: "No — respect, not agreement.", ar: "لا — احترام لا موافقة." },
          },
          {
            question: { en: "Be merciful to those on?", ar: "ارحموا من في؟" },
            options: [
            { en: "Earth", ar: "الأرض" },
            { en: "Space", ar: "الفضاء" },
            { en: "Water", ar: "الماء" },
            { en: "Air", ar: "الهواء" },
            ],
            correctIndex: 0,
            explanation: { en: "Those on earth (Tirmidhi).", ar: "من في الأرض (الترمذي)." },
          },
          {
            question: { en: "Al-Kafirun 6?", ar: "الكافرون ٦؟" },
            options: [
            { en: "For you your religion, for me mine", ar: "لكم دينكم ولي دين" },
            { en: "Only my religion", ar: "ديني فقط" },
            { en: "No religion", ar: "لا دين" },
            { en: "All the same", ar: "الكلّ سواء" },
            ],
            correctIndex: 0,
            explanation: { en: "For you is your religion, for me mine.", ar: "لكم دينكم ولي دين." },
          },
        ],
        coinsReward: 20,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Watch & Reflect", ar: "شاهد وتأمّل" },
      learningObjectives: [
        { en: "Watch a video related to the topic and reflect.", ar: "شاهد مقطعًا متعلّقًا بالموضوع وتأمّل." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Video lesson.", ar: "درس مرئي." },
      },
      youtubeVideo: {
        title: { en: "I Am Tolerant", ar: "أنا متسامح" },
        url: "https://www.youtube.com/watch?v=kYnGEQoGhUE",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Plenary", ar: "ختام الدرس" },
      learningObjectives: [
        { en: "Reflect on and share what you learned.", ar: "تأمّل وشارك ما تعلّمته." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Students sharing.", ar: "طلاب يشاركون." },
      },
      plenary: {
        title: { en: "Share Your Learning", ar: "شارك ما تعلّمته" },
        instruction: { en: "Scan QR or enter the code to share what you learned.", ar: "امسح QR أو أدخل الرمز لمشاركة ما تعلّمته." },
        code: "TOLER001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — I Am Tolerant", ar: "ورقة عمل — أنا مُتَسامِح" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — I Am Tolerant", ar: "ورقة عمل — أنا مُتَسامِح" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Tolerance is?", ar: "التسامح؟" },
                options: [
                { en: "Strength", ar: "قوّة" },
                { en: "Weakness", ar: "ضعف" },
                { en: "Anger", ar: "غضب" },
                { en: "Fear", ar: "خوف" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Al-Hujurat 13?", ar: "الحجرات ١٣؟" },
                options: [
                { en: "Know each other", ar: "لتعارفوا" },
                { en: "Fight", ar: "لتقاتلوا" },
                { en: "Ignore", ar: "لتتجاهلوا" },
                { en: "Compete", ar: "لتتنافسوا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Prophet forgave?", ar: "النبيّ عفا؟" },
                options: [
                { en: "Quraysh", ar: "قريش" },
                { en: "No one", ar: "لا أحد" },
                { en: "Himself", ar: "نفسه" },
                { en: "Only family", ar: "العائلة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "UAE tolerance year?", ar: "عام التسامح؟" },
                options: [
                { en: "2019", ar: "٢٠١٩" },
                { en: "2000", ar: "٢٠٠٠" },
                { en: "1990", ar: "١٩٩٠" },
                { en: "2030", ar: "٢٠٣٠" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tolerance = agreeing?", ar: "التسامح = الموافقة؟" },
                options: [
                { en: "No", ar: "لا" },
                { en: "Yes", ar: "نعم" },
                { en: "Always", ar: "دائمًا" },
                { en: "Sometimes", ar: "أحيانًا" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Islam teaches tolerance.", ar: "الإسلام يعلّم التسامح." }, answer: true },
              { statement: { en: "Tolerance means weakness.", ar: "التسامح ضعف." }, answer: false },
              { statement: { en: "The Prophet forgave Quraysh.", ar: "النبيّ عفا عن قريش." }, answer: true },
              { statement: { en: "UAE opposes tolerance.", ar: "الإمارات تعارض التسامح." }, answer: false },
              { statement: { en: "Diversity is by Allah\'s design.", ar: "التنوّع بتصميم الله." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Tasamuh", ar: "تسامح" }, answer: { en: "Tolerance", ar: "التسامح" } },
              { prompt: { en: "Ta\'ayush", ar: "تعايش" }, answer: { en: "Coexistence", ar: "التعايش" } },
              { prompt: { en: "Afw", ar: "عفو" }, answer: { en: "Pardon", ar: "المسامحة" } },
              { prompt: { en: "Rahma", ar: "رحمة" }, answer: { en: "Mercy", ar: "الرحمة" } },
              { prompt: { en: "Ikhtiram", ar: "احترام" }, answer: { en: "Respect", ar: "الاحترام" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Repel evil with what is _______.", ar: "﴿ادفع بالتي هي _______.﴾" }, blankAnswer: { en: "better", ar: "أحسن" } },
              { sentence: { en: "Made peoples to _______ each other.", ar: "جعلناكم شعوبًا ل_______." }, blankAnswer: { en: "know", ar: "تعارفوا" } },
              { sentence: { en: "\'For you your religion, for me _______.", ar: "﴿لكم دينكم ولي _______.﴾" }, blankAnswer: { en: "mine", ar: "دين" } },
              { sentence: { en: "UAE had Year of _______ 2019.", ar: "عام _______ ٢٠١٩." }, blankAnswer: { en: "Tolerance", ar: "التسامح" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn the meaning of tolerance in Islam", ar: "تعلّم معنى التسامح في الإسلام" },
              { en: "Study the Prophet\'s tolerance examples", ar: "ادرس أمثلة تسامح النبيّ" },
              { en: "Practise tolerance at school and home", ar: "تدرّب على التسامح في المدرسة والبيت" },
              { en: "Respect diversity as Allah\'s design", ar: "احترم التنوّع كتصميم الله" },
              { en: "Differentiate tolerance from agreement", ar: "فرّق بين التسامح والموافقة" },
              { en: "Promote coexistence in your community", ar: "روّج التعايش في مجتمعك" },
            ],
          },
        ],
        coinsReward: 25,
      },
      body: { en: "", ar: "" },
    },
  ],
  quizQuestions: [],
};
