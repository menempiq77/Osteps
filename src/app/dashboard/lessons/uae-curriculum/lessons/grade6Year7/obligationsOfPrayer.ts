import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const obligationsOfPrayer: CourseLesson = {
  slug: "g6y7-obligations-sunnahs-disliked-acts-of-prayer",
  name: { en: "Obligations, Sunnahs & Disliked Acts of Prayer", ar: "أركان الصلاة وسننها ومكروهاتها" },
  shortIntro: {
    en: "Learn the obligatory parts (arkan), recommended acts (sunan), and disliked acts (makruhat) of prayer to perfect your salah.",
    ar: "تعلّم أركان الصلاة وسننها ومكروهاتها لإتقان صلاتك.",
  },
  quranSurahs: ["Al-Baqarah 238", "An-Nisa 103"],
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
        title: { en: "Can I pray however I want?", ar: "هل أصلّي كما أريد؟" },
        body: {
          en: "A student says: \'Prayer is just moving your body. I can pray sitting, skip some parts, and rush through it. The important thing is that I prayed — the details don\'t matter.\'",
          ar: "طالب يقول: «الصلاة مجرّد حركات. أصلّي جالسًا وأتخطّى أجزاء وأسرع. المهمّ أنّي صلّيت — التفاصيل لا تهمّ.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Hadith about praying correctly.",
          ar: "انتقد بالحديث عن الصلاة الصحيحة.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Pray as you have seen me pray.\' (Bukhari)",
        ar: "«صلّوا كما رأيتموني أصلّي.» (البخاري)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Salah (Prayer)", ar: "صلاة" } },
          { image: IMG.childQuran, keyword: { en: "Arkan (Pillars)", ar: "أركان" } },
          { image: IMG.lantern, keyword: { en: "Wajibat (Obligations)", ar: "واجبات" } },
          { image: IMG.skyBlue, keyword: { en: "Khushu (Focus)", ar: "خشوع" } },
          { image: IMG.bookshelf, keyword: { en: "Sujud (Prostration)", ar: "سجود" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'The first thing a person will be asked about on the Day of Judgement is their prayer.\' (Tirmidhi)",
        ar: "«أوّل ما يُحاسب عليه العبد يوم القيامة صلاته.» (الترمذي)",
      },
    },
    {
      title: { en: "Obligations, Sunnahs & Disliked Acts of Prayer", ar: "أركان الصلاة وسننها ومكروهاتها" },
      learningObjectives: [
        { en: "Differentiate between pillars, obligations, and sunnah acts of prayer.", ar: "أفرّق بين أركان الصلاة وواجباتها وسننها." },
        { en: "Explain the consequences of neglecting prayer obligations.", ar: "أشرح عواقب إهمال واجبات الصلاة." },
      ],
      successCriteria: [
        { en: "I can list the obligations (wajibat) of prayer.", ar: "أذكر واجبات الصلاة." },
        { en: "I can explain what invalidates prayer.", ar: "أشرح ما يُبطل الصلاة." },
        { en: "I can distinguish pillars from obligations.", ar: "أفرّق الأركان عن الواجبات." },
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
      title: { en: "Obligations of Prayer", ar: "واجبات الصلاة" },
      learningObjectives: [
        { en: "Master the obligations of prayer and distinguish them from pillars and sunnah.", ar: "أتقن واجبات الصلاة وأفرّقها عن الأركان والسنن." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Pillars vs Obligations", ar: "الأركان مقابل الواجبات" },
          lines: [
            { en: "Pillars (arkan) cannot be skipped — prayer is invalid without them (e.g. standing, Fatiha, ruku, sujud). Obligations (wajibat) if missed unintentionally can be compensated by sujud as-sahw. Sunnah acts (sunan) are recommended but missing them doesn\'t require anything.", ar: "الأركان لا تُترك — الصلاة باطلة بدونها (كالقيام والفاتحة والركوع والسجود). الواجبات إذا تُركت سهوًا تُجبر بسجود السهو. السنن مستحبّة ولا شيء في تركها." },
          ],
        },
        {
          label: { en: "The Obligations", ar: "الواجبات" },
          lines: [
            { en: "1) All takbirs except opening takbir. 2) Saying \'SubhanAllah al-Azim\' in ruku. 3) Saying \'Sami Allahu liman hamidah\' for imam/individual. 4) Saying \'Rabbana wa laka al-hamd\'. 5) Saying \'SubhanAllah al-A\'la\' in sujud. 6) Saying \'Rabb ighfir li\' between two sujuds. 7) First tashahhud. 8) Sitting for first tashahhud.", ar: "١) كلّ التكبيرات عدا الافتتاح. ٢) «سبحان ربّي العظيم» في الركوع. ٣) «سمع الله لمن حمده» للإمام والمنفرد. ٤) «ربّنا ولك الحمد». ٥) «سبحان ربّي الأعلى» في السجود. ٦) «ربّ اغفر لي» بين السجدتين. ٧) التشهّد الأوّل. ٨) الجلوس للتشهّد الأوّل." },
          ],
        },
        {
          label: { en: "Sujud as-Sahw", ar: "سجود السهو" },
          lines: [
            { en: "If you forget an obligation, perform sujud as-sahw (two extra prostrations before or after salam). This compensates for unintentional mistakes in obligations. It does not compensate for missing a pillar.", ar: "إذا نسيت واجبًا فاسجد سجود السهو (سجدتان إضافيّتان قبل أو بعد السلام). يجبر الخطأ غير المتعمّد في الواجبات. لا يجبر ترك الركن." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "All takbirs are obligations.", ar: "كلّ التكبيرات واجبات." }, answer: false },
        { statement: { en: "SubhanAllah al-Azim is said in ruku.", ar: "سبحان ربّي العظيم تُقال في الركوع." }, answer: true },
        { statement: { en: "Missing a pillar invalidates prayer.", ar: "ترك الركن يُبطل الصلاة." }, answer: true },
        { statement: { en: "Sujud as-sahw fixes missing pillars.", ar: "سجود السهو يُصلح ترك الأركان." }, answer: false },
        { statement: { en: "First tashahhud is an obligation.", ar: "التشهّد الأوّل واجب." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Say \'SubhanAllah al-_______\' in ruku.", ar: "قل «سبحان ربّي _______» في الركوع." }, answer: { en: "Azim", ar: "العظيم" } },
        { sentence: { en: "Pray as you _______ me pray.", ar: "صلّوا كما _______ أصلّي." }, answer: { en: "saw", ar: "رأيتموني" } },
        { sentence: { en: "Sujud as-sahw compensates for _______.", ar: "سجود السهو يجبر _______." }, answer: { en: "obligations", ar: "الواجبات" } },
        { sentence: { en: "The first thing asked about is _______.", ar: "أوّل ما يُسأل عنه _______." }, answer: { en: "prayer", ar: "الصلاة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Pillars = prayer invalid without them. Obligations = compensated by sujud as-sahw. Pray as the Prophet prayed.",
        ar: "الأركان = باطلة بدونها. الواجبات = يُجبر بسجود السهو. صلّوا كما صلّى النبيّ.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore prayer obligations from different angles.", ar: "استكشف واجبات الصلاة من زوايا مختلفة." },
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
            title: { en: "Pillars of Prayer", ar: "أركان الصلاة" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "Cannot be skipped", ar: "لا تُترك" },
            infoSections: [
              { label: { en: "Definition", ar: "تعريف" }, content: { en: "Pillars are essential — prayer is invalid without them.", ar: "الأركان أساسيّة — الصلاة باطلة بدونها." } },
              { label: { en: "List", ar: "قائمة" }, content: { en: "Standing, Fatiha, ruku, rising, sujud, sitting, final tashahhud, salam, order, tranquility.", ar: "القيام والفاتحة والركوع والرفع والسجود والجلوس والتشهّد الأخير والسلام والترتيب والطمأنينة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every pillar matters — there are no shortcuts in prayer.", ar: "كلّ ركن مهمّ — لا اختصارات في الصلاة." } },
            ],
            task: {
              title: { en: "List All Pillars", ar: "اذكر كلّ الأركان" },
              description: { en: "Write all pillars with their evidence.", ar: "اكتب كلّ الأركان بأدلّتها." },
              hint: { en: "Include: the pillar, the proof, what happens if missed.", ar: "ضمّن: الركن والدليل وما يحدث إذا تُرك." },
            },
          },
          {
            id: "B",
            title: { en: "Obligations of Prayer", ar: "واجبات الصلاة" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "Compensated if forgotten", ar: "تُجبر إذا نُسيت" },
            infoSections: [
              { label: { en: "List", ar: "قائمة" }, content: { en: "8 obligations: takbirs, ruku dhikr, sami\'Allahu, Rabbana, sujud dhikr, between sujuds, 1st tashahhud, sitting for it.", ar: "٨ واجبات: التكبيرات وذكر الركوع وسمع الله وربّنا وذكر السجود وبين السجدتين والتشهّد الأوّل والجلوس له." } },
              { label: { en: "Rule", ar: "قاعدة" }, content: { en: "If forgotten unintentionally → sujud as-sahw.", ar: "إذا نُسي بلا قصد → سجود السهو." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Obligations require attention — don\'t rush prayer.", ar: "الواجبات تحتاج انتباهًا — لا تسرع في الصلاة." } },
            ],
            task: {
              title: { en: "Explain Each Obligation", ar: "اشرح كلّ واجب" },
              description: { en: "Describe each of the 8 obligations.", ar: "صف كلّ واجب من الثمانية." },
              hint: { en: "Include: what it is, when to say it, evidence.", ar: "ضمّن: ما هو ومتى يُقال والدليل." },
            },
          },
          {
            id: "C",
            title: { en: "Sujud as-Sahw", ar: "سجود السهو" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Fixing mistakes", ar: "إصلاح الأخطاء" },
            infoSections: [
              { label: { en: "When", ar: "متى" }, content: { en: "When you forget an obligation, add or doubt in number of raka\'at.", ar: "عند نسيان واجب أو زيادة أو شكّ في عدد الركعات." } },
              { label: { en: "How", ar: "كيف" }, content: { en: "Two prostrations before or after salam with takbir.", ar: "سجدتان قبل أو بعد السلام بتكبير." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Islam provides solutions for mistakes — mercy in worship.", ar: "الإسلام يوفّر حلولًا للأخطاء — رحمة في العبادة." } },
            ],
            task: {
              title: { en: "Create a Sujud as-Sahw Guide", ar: "أنشئ دليل سجود السهو" },
              description: { en: "Write when and how to perform sujud as-sahw.", ar: "اكتب متى وكيف تسجد سجود السهو." },
              hint: { en: "Include: scenarios, steps, evidence.", ar: "ضمّن: السيناريوهات والخطوات والأدلّة." },
            },
          },
          {
            id: "D",
            title: { en: "Khushu in Prayer", ar: "الخشوع في الصلاة" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Heart of prayer", ar: "قلب الصلاة" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Mu\'minun 1-2: \'Successful are the believers who are humble in prayer.\'", ar: "المؤمنون ١-٢: ﴿قد أفلح المؤمنون الذين هم في صلاتهم خاشعون﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "The Prophet prayed slowly, calmly, with full concentration.", ar: "النبيّ صلّى ببطء وهدوء وتركيز كامل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Prayer without khushu is like a body without a soul.", ar: "الصلاة بلا خشوع كجسد بلا روح." } },
            ],
            task: {
              title: { en: "Write About Khushu", ar: "اكتب عن الخشوع" },
              description: { en: "Explain how to achieve khushu in prayer.", ar: "اشرح كيف تحقّق الخشوع في الصلاة." },
              hint: { en: "Include: steps, obstacles, cures, Quran evidence.", ar: "ضمّن: الخطوات والعقبات والعلاج والأدلّة القرآنيّة." },
            },
          },
          {
            id: "E",
            title: { en: "My Prayer Improvement Plan", ar: "خطّة تحسين صلاتي" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Personal growth", ar: "نموّ شخصي" },
            infoSections: [
              { label: { en: "Goal", ar: "هدف" }, content: { en: "Pray all 5 prayers on time with full khushu and correct form.", ar: "صلِّ الصلوات الخمس في وقتها بخشوع كامل وشكل صحيح." } },
              { label: { en: "Steps", ar: "خطوات" }, content: { en: "Learn obligations, practise slowly, review dhikr, seek knowledge.", ar: "تعلّم الواجبات وتدرّب ببطء وراجع الأذكار واطلب العلم." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Perfect prayer takes effort — start today.", ar: "الصلاة الكاملة تحتاج جهدًا — ابدأ اليوم." } },
            ],
            task: {
              title: { en: "Write Your Plan", ar: "اكتب خطّتك" },
              description: { en: "Create a weekly prayer improvement plan.", ar: "أنشئ خطّة أسبوعيّة لتحسين صلاتك." },
              hint: { en: "Include: goals, checkpoints, dhikr to memorize.", ar: "ضمّن: الأهداف ونقاط التحقّق والأذكار لحفظها." },
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
            question: { en: "Pray as you?", ar: "صلّوا كما؟" },
            options: [
            { en: "Saw me pray", ar: "رأيتموني أصلّي" },
            { en: "Want", ar: "تريدون" },
            { en: "Feel", ar: "تشعرون" },
            { en: "Like", ar: "تحبّون" },
            ],
            correctIndex: 0,
            explanation: { en: "Saw me pray (Bukhari).", ar: "رأيتموني أصلّي (البخاري)." },
          },
          {
            question: { en: "First thing asked about?", ar: "أوّل ما يُسأل عنه؟" },
            options: [
            { en: "Prayer", ar: "الصلاة" },
            { en: "Money", ar: "المال" },
            { en: "Food", ar: "الطعام" },
            { en: "Work", ar: "العمل" },
            ],
            correctIndex: 0,
            explanation: { en: "Prayer.", ar: "الصلاة." },
          },
          {
            question: { en: "Ruku dhikr?", ar: "ذكر الركوع؟" },
            options: [
            { en: "SubhanAllah al-Azim", ar: "سبحان ربّي العظيم" },
            { en: "Allahu Akbar", ar: "الله أكبر" },
            { en: "Bismillah", ar: "بسم الله" },
            { en: "None", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "SubhanAllah al-Azim.", ar: "سبحان ربّي العظيم." },
          },
          {
            question: { en: "Missing obligation fixed by?", ar: "نسيان الواجب يُصلح ب؟" },
            options: [
            { en: "Sujud as-sahw", ar: "سجود السهو" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Repeating prayer", ar: "إعادة الصلاة" },
            { en: "Fasting", ar: "الصوم" },
            ],
            correctIndex: 0,
            explanation: { en: "Sujud as-sahw.", ar: "سجود السهو." },
          },
          {
            question: { en: "Missing pillar means?", ar: "ترك الركن يعني؟" },
            options: [
            { en: "Prayer invalid", ar: "الصلاة باطلة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Extra reward", ar: "ثواب إضافي" },
            { en: "Fine", ar: "عادي" },
            ],
            correctIndex: 0,
            explanation: { en: "Prayer is invalid.", ar: "الصلاة باطلة." },
          },
          {
            question: { en: "Sujud dhikr?", ar: "ذكر السجود؟" },
            options: [
            { en: "SubhanAllah al-Ala", ar: "سبحان ربّي الأعلى" },
            { en: "Allahu Akbar", ar: "الله أكبر" },
            { en: "None", ar: "لا شيء" },
            { en: "Any", ar: "أيّ" },
            ],
            correctIndex: 0,
            explanation: { en: "SubhanAllah al-Ala.", ar: "سبحان ربّي الأعلى." },
          },
          {
            question: { en: "Between 2 sujuds say?", ar: "بين السجدتين قل؟" },
            options: [
            { en: "Rabb ighfir li", ar: "ربّ اغفر لي" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Allahu Akbar", ar: "الله أكبر" },
            { en: "Salam", ar: "السلام" },
            ],
            correctIndex: 0,
            explanation: { en: "Rabb ighfir li.", ar: "ربّ اغفر لي." },
          },
          {
            question: { en: "Khushu means?", ar: "الخشوع يعني؟" },
            options: [
            { en: "Humility and focus", ar: "خضوع وتركيز" },
            { en: "Speed", ar: "سرعة" },
            { en: "Loudness", ar: "علوّ الصوت" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Humility and focus in prayer.", ar: "خضوع وتركيز في الصلاة." },
          },
          {
            question: { en: "How many obligations?", ar: "كم واجبًا؟" },
            options: [
            { en: "8", ar: "٨" },
            { en: "1", ar: "١" },
            { en: "100", ar: "١٠٠" },
            { en: "0", ar: "٠" },
            ],
            correctIndex: 0,
            explanation: { en: "8 obligations.", ar: "٨ واجبات." },
          },
          {
            question: { en: "1st tashahhud is?", ar: "التشهّد الأوّل؟" },
            options: [
            { en: "An obligation", ar: "واجب" },
            { en: "A pillar", ar: "ركن" },
            { en: "Sunnah", ar: "سنّة" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "An obligation.", ar: "واجب." },
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
        title: { en: "Obligations of Prayer", ar: "واجبات الصلاة" },
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
        code: "OBLPR001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Obligations, Sunnahs & Disliked Acts of Prayer", ar: "ورقة عمل — أركان الصلاة وسننها ومكروهاتها" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Obligations, Sunnahs & Disliked Acts of Prayer", ar: "ورقة عمل — أركان الصلاة وسننها ومكروهاتها" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Pray as?", ar: "صلّوا كما؟" },
                options: [
                { en: "Saw me", ar: "رأيتموني" },
                { en: "Want", ar: "تريدون" },
                { en: "Feel", ar: "تشعرون" },
                { en: "Like", ar: "تحبّون" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "First asked?", ar: "أوّل ما يُسأل؟" },
                options: [
                { en: "Prayer", ar: "الصلاة" },
                { en: "Money", ar: "المال" },
                { en: "Food", ar: "الطعام" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Ruku?", ar: "الركوع؟" },
                options: [
                { en: "SubhanAllah al-Azim", ar: "سبحان ربّي العظيم" },
                { en: "Allahu Akbar", ar: "الله أكبر" },
                { en: "None", ar: "لا شيء" },
                { en: "Any", ar: "أيّ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Missed obligation?", ar: "نسيان واجب؟" },
                options: [
                { en: "Sujud as-sahw", ar: "سجود السهو" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Repeat", ar: "إعادة" },
                { en: "Fast", ar: "صوم" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Missed pillar?", ar: "ترك ركن؟" },
                options: [
                { en: "Invalid", ar: "باطلة" },
                { en: "Fine", ar: "عادي" },
                { en: "Reward", ar: "ثواب" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "All takbirs are obligations.", ar: "كلّ التكبيرات واجبات." }, answer: false },
              { statement: { en: "SubhanAllah al-Azim in ruku.", ar: "سبحان ربّي العظيم في الركوع." }, answer: true },
              { statement: { en: "Missing pillar = invalid.", ar: "ترك ركن = بطلان." }, answer: true },
              { statement: { en: "Sujud sahw fixes pillars.", ar: "سجود السهو يُصلح الأركان." }, answer: false },
              { statement: { en: "1st tashahhud is obligation.", ar: "التشهّد الأوّل واجب." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Arkan", ar: "أركان" }, answer: { en: "Pillars", ar: "الأركان" } },
              { prompt: { en: "Wajibat", ar: "واجبات" }, answer: { en: "Obligations", ar: "الواجبات" } },
              { prompt: { en: "Sunan", ar: "سنن" }, answer: { en: "Recommended acts", ar: "المستحبّات" } },
              { prompt: { en: "Khushu", ar: "خشوع" }, answer: { en: "Humility", ar: "الخشوع" } },
              { prompt: { en: "Sahw", ar: "سهو" }, answer: { en: "Forgetfulness", ar: "السهو" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Say SubhanAllah al-_______ in ruku.", ar: "قل سبحان ربّي _______ في الركوع." }, blankAnswer: { en: "Azim", ar: "العظيم" } },
              { sentence: { en: "Pray as you _______ me pray.", ar: "صلّوا كما _______ أصلّي." }, blankAnswer: { en: "saw", ar: "رأيتموني" } },
              { sentence: { en: "Sujud sahw compensates _______.", ar: "سجود السهو يجبر _______." }, blankAnswer: { en: "obligations", ar: "الواجبات" } },
              { sentence: { en: "First asked about is _______.", ar: "أوّل ما يُسأل عنه _______." }, blankAnswer: { en: "prayer", ar: "الصلاة" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn pillars of prayer", ar: "تعلّم أركان الصلاة" },
              { en: "Learn obligations of prayer", ar: "تعلّم واجبات الصلاة" },
              { en: "Understand sujud as-sahw", ar: "افهم سجود السهو" },
              { en: "Develop khushu", ar: "طوّر الخشوع" },
              { en: "Practise correct form", ar: "تدرّب على الشكل الصحيح" },
              { en: "Improve daily prayer", ar: "حسّن الصلاة اليوميّة" },
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
