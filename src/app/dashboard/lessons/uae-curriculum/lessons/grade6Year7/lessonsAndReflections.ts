import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const lessonsAndReflections: CourseLesson = {
  slug: "g6y7-lessons-and-reflections-al-mulk-25-30",
  name: { en: "Lessons and Reflections (Al-Mulk 25-30)", ar: "دُروسٌ وعِبَرٌ (المُلك ٢٥-٣٠)" },
  shortIntro: {
    en: "The closing verses of Surat Al-Mulk: the deniers mock the promise of the Hour, but their faces will change when they see it; the Prophet ﷺ is told to leave their fate to Allah; and the surah ends with the most humbling question — if your water sank away, who could bring it back?",
    ar: "خَواتيمُ سورةِ المُلك: يَستَهزِئُ المُنكِرونَ بِوَعدِ السّاعة، لكِنَّ وُجوهَهُم سَتَتَغَيَّرُ حينَ يَرَونَها؛ ويُؤمَرُ النَّبِيُّ ﷺ أن يَكِلَ مَصيرَهُم إلى الله؛ وتَختِمُ السورةُ بِأشَدِّ الأسئِلةِ إخضاعًا — إن غارَ ماؤُكُم فَمَن يَأتي بِه؟",
  },
  quranSurahs: ["Al-Mulk 25", "Al-Mulk 27", "Al-Mulk 29", "Al-Mulk 30"],
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
        title: { en: "Is reflecting on the Quran a waste of time?", ar: "هل التدبّر في القرآن مضيعة للوقت؟" },
        body: {
          en: "A student says: \'Reading the Quran once is enough. Reflecting on its lessons is pointless — it was revealed 1400 years ago and has nothing new for us today.\'",
          ar: "طالب يقول: «قراءة القرآن مرّة تكفي. التدبّر فيه لا فائدة منه — نزل قبل ١٤٠٠ سنة ولا جديد لنا.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran on reflection and extracting lessons.",
          ar: "انتقد بالقرآن عن التدبّر واستخراج الدروس.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Then do they not reflect upon the Quran?\' (An-Nisa 82)",
        ar: "﴿أفلا يتدبّرون القرآن﴾ (النساء ٨٢)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Tadabbur (Reflection)", ar: "تدبّر" } },
          { image: IMG.grandMosque, keyword: { en: "Ibrah (Lesson)", ar: "عبرة" } },
          { image: IMG.bookshelf, keyword: { en: "Hikmah (Wisdom)", ar: "حكمة" } },
          { image: IMG.lantern, keyword: { en: "Iman (Faith)", ar: "إيمان" } },
          { image: IMG.skyBlue, keyword: { en: "Tafakkur (Contemplation)", ar: "تفكّر" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'We have certainly made the Quran easy for remembrance — so is there any who will remember?\' (Al-Qamar 17)",
        ar: "﴿ولقد يسّرنا القرآن للذكر فهل من مدّكر﴾ (القمر ١٧)",
      },
    },
    {
      title: { en: "Lessons and Reflections (Al-Mulk 25-30)", ar: "دُروسٌ وعِبَرٌ (المُلك ٢٥-٣٠)" },
      learningObjectives: [
        { en: "Explain the importance of reflecting on the Quran.", ar: "أشرح أهمّيّة التدبّر في القرآن." },
        { en: "Identify lessons from Quranic stories and verses.", ar: "أحدّد دروسًا من قصص القرآن وآياته." },
      ],
      successCriteria: [
        { en: "I can define tadabbur.", ar: "أعرّف التدبّر." },
        { en: "I can extract 3 lessons from a Quranic passage.", ar: "أستخرج ٣ دروس من نصّ قرآني." },
        { en: "I can explain how Quran is relevant today.", ar: "أشرح كيف القرآن مناسب لليوم." },
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
      title: { en: "Lessons and Reflections from the Quran", ar: "دروس وتأمّلات من القرآن" },
      learningObjectives: [
        { en: "Master the art of reflecting on the Quran and extracting meaningful lessons.", ar: "أتقن فنّ التدبّر في القرآن واستخراج الدروس." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "What is Tadabbur?", ar: "ما التدبّر؟" },
          lines: [
            { en: "Deep reflection on the meanings of the Quran — understanding what Allah tells us, how it applies to our lives, and acting upon it. Different from just reading.", ar: "التفكّر العميق في معاني القرآن — فهم ما يخبرنا الله وكيف ينطبق على حياتنا والعمل به. يختلف عن مجرّد القراءة." },
          ],
        },
        {
          label: { en: "The Quran\'s Timelessness", ar: "خلود القرآن" },
          lines: [
            { en: "The Quran addresses all times — its lessons on justice, mercy, honesty, patience are eternal. New scientific discoveries continue to align with Quranic descriptions.", ar: "القرآن يخاطب كلّ العصور — دروسه عن العدل والرحمة والصدق والصبر خالدة. الاكتشافات العلميّة تتّفق مع وصفه." },
          ],
        },
        {
          label: { en: "How to Reflect", ar: "كيف تتدبّر" },
          lines: [
            { en: "Read slowly, understand the meaning, think about how it applies to you, take notes, discuss with others, act on what you learn.", ar: "اقرأ ببطء وافهم المعنى وفكّر في التطبيق ودوّن ملاحظات وناقش مع الآخرين واعمل بما تعلّمت." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Tadabbur means deep reflection.", ar: "التدبّر يعني التفكّر العميق." }, answer: true },
        { statement: { en: "The Quran is only relevant to the past.", ar: "القرآن مناسب للماضي فقط." }, answer: false },
        { statement: { en: "An-Nisa 82 asks about reflecting on Quran.", ar: "النساء ٨٢ تسأل عن تدبّر القرآن." }, answer: true },
        { statement: { en: "Reading once without thinking is enough.", ar: "القراءة مرّة بلا تفكّر تكفي." }, answer: false },
        { statement: { en: "Quran lessons are eternal.", ar: "دروس القرآن خالدة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Do they not _______ upon the Quran?\' (An-Nisa)", ar: "﴿أفلا _______ القرآن﴾ (النساء)" }, answer: { en: "reflect", ar: "يتدبّرون" } },
        { sentence: { en: "The Quran is easy for _______.", ar: "القرآن يسّر لل_______." }, answer: { en: "remembrance", ar: "ذكر" } },
        { sentence: { en: "Tadabbur means deep _______.", ar: "التدبّر يعني التفكّر _______." }, answer: { en: "reflection", ar: "العميق" } },
        { sentence: { en: "Quran lessons are _______.", ar: "دروس القرآن _______." }, answer: { en: "eternal", ar: "خالدة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Tadabbur — reflecting on the Quran — extracts timeless lessons applicable to every era.",
        ar: "التدبّر — التفكّر في القرآن — يستخرج دروسًا خالدة لكلّ عصر.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Practise tadabbur through different approaches.", ar: "تدرّب على التدبّر بطرق مختلفة." },
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
            title: { en: "Understanding Tadabbur", ar: "فهم التدبّر" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "What and why", ar: "ماذا ولماذا" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "An-Nisa 82: \'Do they not reflect upon the Quran?\'", ar: "النساء ٨٢: ﴿أفلا يتدبّرون القرآن﴾" } },
              { label: { en: "Method", ar: "طريقة" }, content: { en: "Read slowly, pause, think, connect to your life.", ar: "اقرأ ببطء وتوقّف وفكّر واربط بحياتك." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Reflection turns reading into transformation.", ar: "التدبّر يحوّل القراءة إلى تحوّل." } },
            ],
            task: {
              title: { en: "Write a Tadabbur Guide", ar: "اكتب دليل تدبّر" },
              description: { en: "Create a step-by-step guide for tadabbur.", ar: "أنشئ دليلًا خطوة بخطوة للتدبّر." },
              hint: { en: "Include: preparation, reading method, reflection tips.", ar: "ضمّن: التحضير وطريقة القراءة ونصائح التدبّر." },
            },
          },
          {
            id: "B",
            title: { en: "Lessons from Stories", ar: "دروس من القصص" },
            image: IMG.bookshelf,
            color: "blue",
            topic: { en: "Quranic narratives", ar: "القصص القرآني" },
            infoSections: [
              { label: { en: "Example", ar: "مثال" }, content: { en: "Story of Yusuf — patience, forgiveness, trust in Allah\'s plan.", ar: "قصّة يوسف — الصبر والمغفرة والتوكّل." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'In their stories is a lesson for those of understanding.\' (Yusuf 111)", ar: "﴿لقد كان في قصصهم عبرة لأولي الألباب﴾ (يوسف ١١١)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every story teaches timeless values.", ar: "كلّ قصّة تعلّم قيمًا خالدة." } },
            ],
            task: {
              title: { en: "Extract Story Lessons", ar: "استخرج دروس القصص" },
              description: { en: "Choose one Quranic story and extract 5 lessons.", ar: "اختر قصّة قرآنيّة واستخرج ٥ دروس." },
              hint: { en: "Include: the story, the lesson, modern application.", ar: "ضمّن: القصّة والدرس والتطبيق المعاصر." },
            },
          },
          {
            id: "C",
            title: { en: "Scientific Reflections", ar: "تأمّلات علميّة" },
            image: IMG.skyBlue,
            color: "purple",
            topic: { en: "Quran and science", ar: "القرآن والعلم" },
            infoSections: [
              { label: { en: "Example", ar: "مثال" }, content: { en: "Embryology (Al-Muminun 12-14), water cycle, mountains as pegs.", ar: "علم الأجنّة (المؤمنون ١٢-١٤) ودورة المياه والجبال كأوتاد." } },
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "These descriptions predate modern science by centuries.", ar: "هذه الأوصاف سبقت العلم الحديث بقرون." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Science confirms Quran — both are from the same Creator.", ar: "العلم يؤكّد القرآن — كلاهما من نفس الخالق." } },
            ],
            task: {
              title: { en: "Research Quran and Science", ar: "ابحث عن القرآن والعلم" },
              description: { en: "Find 3 scientific facts mentioned in the Quran.", ar: "أوجد ٣ حقائق علميّة في القرآن." },
              hint: { en: "Include: verse, scientific fact, when discovered.", ar: "ضمّن: الآية والحقيقة ومتى اكتُشفت." },
            },
          },
          {
            id: "D",
            title: { en: "Personal Application", ar: "التطبيق الشخصي" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Applying lessons today", ar: "تطبيق الدروس اليوم" },
            infoSections: [
              { label: { en: "Example", ar: "مثال" }, content: { en: "Quran on patience in exams, honesty in friendships, gratitude for parents.", ar: "القرآن عن الصبر في الاختبارات والصدق في الصداقات وشكر الوالدين." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The best of you is he who learns the Quran and teaches it.\' (Bukhari)", ar: "«خيركم من تعلّم القرآن وعلّمه.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every verse has a practical application.", ar: "لكلّ آية تطبيق عملي." } },
            ],
            task: {
              title: { en: "Write a Personal Reflection", ar: "اكتب تأمّلًا شخصيًّا" },
              description: { en: "Pick 3 verses and write how they apply to your life.", ar: "اختر ٣ آيات واكتب تطبيقها في حياتك." },
              hint: { en: "Include: the verse, the meaning, your situation, the action.", ar: "ضمّن: الآية والمعنى وموقفك والعمل." },
            },
          },
          {
            id: "E",
            title: { en: "Sharing Reflections", ar: "مشاركة التأمّلات" },
            image: IMG.grandMosque,
            color: "rose",
            topic: { en: "Teaching others what you learn", ar: "علّم الآخرين ما تعلّمته" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Convey from me, even if one verse.\' (Bukhari)", ar: "«بلّغوا عنّي ولو آية.» (البخاري)" } },
              { label: { en: "Tip", ar: "نصيحة" }, content: { en: "Share a Quran reflection with family at dinner.", ar: "شارك تأمّلًا قرآنيًّا مع العائلة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Sharing knowledge multiplies its benefit.", ar: "مشاركة العلم تضاعف الفائدة." } },
            ],
            task: {
              title: { en: "Create a Sharing Plan", ar: "أنشئ خطّة مشاركة" },
              description: { en: "Plan how to share one Quran lesson daily for a week.", ar: "خطّط لمشاركة درس قرآني يوميًّا لأسبوع." },
              hint: { en: "Include: day, verse, lesson, audience.", ar: "ضمّن: اليوم والآية والدرس والجمهور." },
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
            question: { en: "Tadabbur means?", ar: "التدبّر يعني؟" },
            options: [
            { en: "Deep reflection", ar: "التفكّر العميق" },
            { en: "Fast reading", ar: "القراءة السريعة" },
            { en: "Memorization only", ar: "الحفظ فقط" },
            { en: "Singing", ar: "الغناء" },
            ],
            correctIndex: 0,
            explanation: { en: "Deep reflection.", ar: "التفكّر العميق." },
          },
          {
            question: { en: "An-Nisa 82 says?", ar: "النساء ٨٢ تقول؟" },
            options: [
            { en: "Do they not reflect on Quran?", ar: "أفلا يتدبّرون القرآن؟" },
            { en: "Read quickly", ar: "اقرؤوا بسرعة" },
            { en: "Ignore it", ar: "تجاهلوه" },
            { en: "Memorize only", ar: "احفظوا فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Do they not reflect?", ar: "أفلا يتدبّرون؟" },
          },
          {
            question: { en: "Quran lessons are?", ar: "دروس القرآن؟" },
            options: [
            { en: "Timeless/eternal", ar: "خالدة" },
            { en: "Outdated", ar: "قديمة" },
            { en: "Only for Arabs", ar: "للعرب فقط" },
            { en: "Irrelevant", ar: "غير مناسبة" },
            ],
            correctIndex: 0,
            explanation: { en: "Timeless.", ar: "خالدة." },
          },
          {
            question: { en: "Yusuf 111 says stories are?", ar: "يوسف ١١١ تقول القصص؟" },
            options: [
            { en: "A lesson for understanding", ar: "عبرة لأولي الألباب" },
            { en: "Entertainment", ar: "ترفيه" },
            { en: "Fiction", ar: "خيال" },
            { en: "Outdated", ar: "قديمة" },
            ],
            correctIndex: 0,
            explanation: { en: "A lesson for those of understanding.", ar: "عبرة لأولي الألباب." },
          },
          {
            question: { en: "Best regarding Quran?", ar: "خير الناس في القرآن؟" },
            options: [
            { en: "Learn and teach", ar: "تعلّم وعلّم" },
            { en: "Ignore", ar: "تجاهل" },
            { en: "Just read fast", ar: "اقرأ بسرعة" },
            { en: "Memorize only", ar: "احفظ فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Learn and teach it.", ar: "تعلّمه وعلّمه." },
          },
          {
            question: { en: "Is Quran relevant today?", ar: "هل القرآن مناسب لليوم؟" },
            options: [
            { en: "Yes", ar: "نعم" },
            { en: "No", ar: "لا" },
            { en: "Only partially", ar: "جزئيًّا" },
            { en: "Only for scholars", ar: "للعلماء فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Yes — its lessons are eternal.", ar: "نعم — دروسه خالدة." },
          },
          {
            question: { en: "How to do tadabbur?", ar: "كيف تتدبّر؟" },
            options: [
            { en: "Read slowly and reflect", ar: "اقرأ ببطء وتدبّر" },
            { en: "Read fast", ar: "اقرأ بسرعة" },
            { en: "Skip difficult parts", ar: "تخطَّ الصعب" },
            { en: "Only listen", ar: "استمع فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Read slowly and reflect.", ar: "اقرأ ببطء وتدبّر." },
          },
          {
            question: { en: "Quran and science?", ar: "القرآن والعلم؟" },
            options: [
            { en: "Quran predates discoveries", ar: "القرآن سبق الاكتشافات" },
            { en: "They conflict", ar: "يتعارضان" },
            { en: "No connection", ar: "لا صلة" },
            { en: "Science disproves Quran", ar: "العلم يدحض القرآن" },
            ],
            correctIndex: 0,
            explanation: { en: "Quran predates scientific discoveries.", ar: "القرآن سبق الاكتشافات." },
          },
          {
            question: { en: "Convey from me even?", ar: "بلّغوا عنّي ولو؟" },
            options: [
            { en: "One verse", ar: "آية" },
            { en: "One book", ar: "كتابًا" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "One year", ar: "سنة" },
            ],
            correctIndex: 0,
            explanation: { en: "Even one verse (Bukhari).", ar: "ولو آية (البخاري)." },
          },
          {
            question: { en: "Reflection turns reading into?", ar: "التدبّر يحوّل القراءة إلى؟" },
            options: [
            { en: "Transformation", ar: "تحوّل" },
            { en: "Boredom", ar: "ملل" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Speed", ar: "سرعة" },
            ],
            correctIndex: 0,
            explanation: { en: "Transformation.", ar: "تحوّل." },
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
        title: { en: "Lessons and Reflections", ar: "دروس وتأمّلات" },
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
        code: "REFL0001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Lessons and Reflections (Al-Mulk 25-30)", ar: "ورقة عمل — دُروسٌ وعِبَرٌ (المُلك ٢٥-٣٠)" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Lessons and Reflections (Al-Mulk 25-30)", ar: "ورقة عمل — دُروسٌ وعِبَرٌ (المُلك ٢٥-٣٠)" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Tadabbur?", ar: "التدبّر؟" },
                options: [
                { en: "Deep reflection", ar: "التفكّر العميق" },
                { en: "Fast reading", ar: "قراءة سريعة" },
                { en: "Memorization", ar: "حفظ" },
                { en: "Singing", ar: "غناء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Quran lessons?", ar: "دروس القرآن؟" },
                options: [
                { en: "Eternal", ar: "خالدة" },
                { en: "Outdated", ar: "قديمة" },
                { en: "Only past", ar: "للماضي" },
                { en: "None", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Best regarding Quran?", ar: "خير في القرآن؟" },
                options: [
                { en: "Learn and teach", ar: "تعلّم وعلّم" },
                { en: "Ignore", ar: "تجاهل" },
                { en: "Sell", ar: "بع" },
                { en: "Hide", ar: "أخفِ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "An-Nisa 82?", ar: "النساء ٨٢؟" },
                options: [
                { en: "Reflect on Quran", ar: "تدبّروا القرآن" },
                { en: "Ignore", ar: "تجاهلوا" },
                { en: "Forget", ar: "انسوا" },
                { en: "Run", ar: "اركضوا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Convey even?", ar: "بلّغوا ولو؟" },
                options: [
                { en: "One verse", ar: "آية" },
                { en: "One book", ar: "كتابًا" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "One city", ar: "مدينة" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Tadabbur means deep reflection.", ar: "التدبّر تفكّر عميق." }, answer: true },
              { statement: { en: "Quran is only for the past.", ar: "القرآن للماضي فقط." }, answer: false },
              { statement: { en: "An-Nisa 82 asks about reflection.", ar: "النساء ٨٢ تسأل عن التدبّر." }, answer: true },
              { statement: { en: "Reading fast without thinking is best.", ar: "القراءة السريعة بلا تفكّر الأفضل." }, answer: false },
              { statement: { en: "Quran predates scientific discoveries.", ar: "القرآن سبق الاكتشافات العلميّة." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Tadabbur", ar: "تدبّر" }, answer: { en: "Deep reflection", ar: "التفكّر العميق" } },
              { prompt: { en: "Ibrah", ar: "عبرة" }, answer: { en: "Lesson", ar: "الدرس" } },
              { prompt: { en: "Hikmah", ar: "حكمة" }, answer: { en: "Wisdom", ar: "الحكمة" } },
              { prompt: { en: "Tafakkur", ar: "تفكّر" }, answer: { en: "Contemplation", ar: "التأمّل" } },
              { prompt: { en: "Tilawah", ar: "تلاوة" }, answer: { en: "Recitation", ar: "القراءة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Do they not _______ upon the Quran?\'", ar: "﴿أفلا _______ القرآن﴾" }, blankAnswer: { en: "reflect", ar: "يتدبّرون" } },
              { sentence: { en: "Quran is easy for _______.", ar: "القرآن يسّر لل_______." }, blankAnswer: { en: "remembrance", ar: "ذكر" } },
              { sentence: { en: "\'Convey from me even one _______.", ar: "«بلّغوا عنّي ولو _______.»" }, blankAnswer: { en: "verse", ar: "آية" } },
              { sentence: { en: "In their stories is a _______.", ar: "في قصصهم _______." }, blankAnswer: { en: "lesson", ar: "عبرة" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Open the Quran with intention", ar: "افتح القرآن بنيّة" },
              { en: "Read slowly with understanding", ar: "اقرأ ببطء بفهم" },
              { en: "Pause and reflect on meanings", ar: "توقّف وتدبّر المعاني" },
              { en: "Connect verses to your life", ar: "اربط الآيات بحياتك" },
              { en: "Take notes and lessons", ar: "دوّن الملاحظات والدروس" },
              { en: "Share reflections with others", ar: "شارك التأمّلات مع الآخرين" },
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
