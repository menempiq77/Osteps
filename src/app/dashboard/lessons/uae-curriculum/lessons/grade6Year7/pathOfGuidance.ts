import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const pathOfGuidance: CourseLesson = {
  slug: "g6y7-the-path-of-guidance-al-mulk-1-14",
  name: { en: "The Path of Guidance (Al-Mulk 1-14)", ar: "سَبيلُ الهِدايةِ (المُلك ١–١٤)" },
  shortIntro: {
    en: "A tafsir-level journey through the opening of Surat Al-Mulk: the kingdom of Allah, the purpose of life and death as a test, the perfection of creation, the fate of the deniers, and the reward of those who fear their Lord unseen. The surah that defends its reader in the grave.",
    ar: "رِحلةٌ تَفسيريّةٌ في مَطلَعِ سورةِ المُلك: مُلكِ اللهِ، ومَقصِدِ الحَياةِ والمَوتِ ابتِلاءً، وكَمالِ الخَلق، ومَصيرِ المُكَذِّبين، وجَزاءِ مَن يَخشى رَبَّهُ بِالغَيب. السّورةُ التي تُجادِلُ عن صاحِبِها في القَبر.",
  },
  quranSurahs: ["Al-Mulk 1-2", "Al-Mulk 3-4", "Al-Mulk 12"],
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
        title: { en: "Can I find my own path without divine guidance?", ar: "هل أجد طريقي بلا هداية إلهيّة؟" },
        body: {
          en: "A student says: \'I am smart enough to figure out right from wrong myself. I do not need the Quran or any religion to guide me. My own logic is enough.\'",
          ar: "طالب يقول: «أنا ذكيّ بما يكفي لأعرف الصواب والخطأ. لا أحتاج القرآن أو أيّ دين. منطقي يكفي.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran on guidance and misguidance.",
          ar: "انتقد بالقرآن عن الهداية والضلال.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'This is the Book about which there is no doubt, a guidance for the God-conscious.\' (Al-Baqarah 2)",
        ar: "﴿ذلك الكتاب لا ريب فيه هدى للمتّقين﴾ (البقرة ٢)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Hidayah (Guidance)", ar: "هداية" } },
          { image: IMG.grandMosque, keyword: { en: "Sirat (Path)", ar: "صراط" } },
          { image: IMG.lantern, keyword: { en: "Taqwa (God-consciousness)", ar: "تقوى" } },
          { image: IMG.bookshelf, keyword: { en: "Dalal (Misguidance)", ar: "ضلال" } },
          { image: IMG.skyBlue, keyword: { en: "Nur (Light)", ar: "نور" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Guide us to the straight path.\' (Al-Fatiha 6)",
        ar: "﴿اهدنا الصراط المستقيم﴾ (الفاتحة ٦)",
      },
    },
    {
      title: { en: "The Path of Guidance (Al-Mulk 1-14)", ar: "سَبيلُ الهِدايةِ (المُلك ١–١٤)" },
      learningObjectives: [
        { en: "Explain the concept of divine guidance (hidayah) in Islam.", ar: "أشرح مفهوم الهداية الإلهيّة في الإسلام." },
        { en: "Identify sources of guidance and causes of misguidance.", ar: "أحدّد مصادر الهداية وأسباب الضلال." },
      ],
      successCriteria: [
        { en: "I can define hidayah from the Quran.", ar: "أعرّف الهداية من القرآن." },
        { en: "I can list sources of guidance: Quran, Sunnah, scholars.", ar: "أذكر مصادر الهداية: القرآن والسنّة والعلماء." },
        { en: "I can explain why we ask for guidance in every prayer.", ar: "أشرح لماذا نسأل الهداية في كلّ صلاة." },
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
      title: { en: "The Path of Guidance in Islam", ar: "طريق الهداية في الإسلام" },
      learningObjectives: [
        { en: "Understand divine guidance and how to stay on the straight path.", ar: "أفهم الهداية الإلهيّة وكيف أثبت على الصراط المستقيم." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Quran — Al-Baqarah 2-5", ar: "القرآن — البقرة ٢-٥" },
          lines: [
            { en: "The Quran is guidance for the God-conscious: those who believe in the unseen, establish prayer, spend in charity, and believe in revelation.", ar: "القرآن هدى للمتّقين: الذين يؤمنون بالغيب ويقيمون الصلاة وينفقون ويؤمنون بالوحي." },
          ],
        },
        {
          label: { en: "Al-Fatiha — Daily Dua", ar: "الفاتحة — دعاء يومي" },
          lines: [
            { en: "Muslims ask \'Guide us to the straight path\' at least 17 times daily in obligatory prayers. This shows guidance is a continuous need.", ar: "المسلمون يدعون «اهدنا الصراط المستقيم» ١٧ مرّة يوميًّا على الأقلّ. هذا يُظهر أنّ الهداية حاجة مستمرّة." },
          ],
        },
        {
          label: { en: "Causes of Misguidance", ar: "أسباب الضلال" },
          lines: [
            { en: "Following desires, ignoring evidence, arrogance, bad companions — all lead away from the straight path.", ar: "اتّباع الهوى وتجاهل الأدلّة والكبر ورفاق السوء — كلّها تبعد عن الصراط." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "The Quran is a source of guidance.", ar: "القرآن مصدر هداية." }, answer: true },
        { statement: { en: "Humans do not need divine guidance.", ar: "البشر لا يحتاجون هداية إلهيّة." }, answer: false },
        { statement: { en: "We ask for guidance in Al-Fatiha.", ar: "نسأل الهداية في الفاتحة." }, answer: true },
        { statement: { en: "Arrogance leads to guidance.", ar: "الكبر يؤدّي للهداية." }, answer: false },
        { statement: { en: "Guidance is asked 17+ times daily in prayer.", ar: "الهداية تُطلب ١٧ مرّة يوميًّا في الصلاة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Guide us to the _______ path.\' (Al-Fatiha)", ar: "﴿اهدنا الصراط _______.﴾ (الفاتحة)" }, answer: { en: "straight", ar: "المستقيم" } },
        { sentence: { en: "The Quran is guidance for the _______.", ar: "القرآن هدى لل_______." }, answer: { en: "God-conscious", ar: "المتّقين" } },
        { sentence: { en: "Following _______ leads to misguidance.", ar: "اتّباع _______ يؤدّي للضلال." }, answer: { en: "desires", ar: "الهوى" } },
        { sentence: { en: "Muslims ask for guidance _______ times daily.", ar: "المسلمون يسألون الهداية _______ مرّة يوميًّا." }, answer: { en: "17", ar: "١٧" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "The Quran is the ultimate source of guidance. Muslims ask for hidayah at least 17 times daily.",
        ar: "القرآن المصدر الأعلى للهداية. المسلمون يسألونها ١٧ مرّة يوميًّا.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore guidance from different angles.", ar: "استكشف الهداية من زوايا مختلفة." },
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
            title: { en: "Sources of Guidance", ar: "مصادر الهداية" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Quran, Sunnah, scholars", ar: "القرآن والسنّة والعلماء" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Baqarah 2: \'A guidance for the God-conscious.\'", ar: "البقرة ٢: ﴿هدى للمتّقين﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'I leave you the Book of Allah and my Sunnah.\' (Malik)", ar: "«تركت فيكم كتاب الله وسنّتي.» (مالك)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Multiple sources ensure comprehensive guidance.", ar: "مصادر متعدّدة تضمن هداية شاملة." } },
            ],
            task: {
              title: { en: "Map Sources of Guidance", ar: "ارسم خريطة مصادر الهداية" },
              description: { en: "Create a diagram of all sources of guidance.", ar: "أنشئ مخطّطًا لجميع مصادر الهداية." },
              hint: { en: "Include: Quran, Sunnah, scholars, personal reflection.", ar: "ضمّن: القرآن والسنّة والعلماء والتأمّل." },
            },
          },
          {
            id: "B",
            title: { en: "Al-Fatiha Analysis", ar: "تحليل الفاتحة" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Why we ask daily", ar: "لماذا ندعو يوميًّا" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Guide us to the straight path\' — repeated in every rakah.", ar: "﴿اهدنا الصراط المستقيم﴾ — في كلّ ركعة." } },
              { label: { en: "Wisdom", ar: "حكمة" }, content: { en: "Even the Prophet asked for guidance continuously.", ar: "حتّى النبيّ سأل الهداية باستمرار." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Guidance is never guaranteed — you must ask daily.", ar: "الهداية ليست مضمونة — اسألها يوميًّا." } },
            ],
            task: {
              title: { en: "Write an Al-Fatiha Reflection", ar: "اكتب تأمّلًا في الفاتحة" },
              description: { en: "Reflect on why asking guidance 17+ times daily matters.", ar: "تأمّل لماذا طلب الهداية ١٧ مرّة مهمّ." },
              hint: { en: "Include: significance, personal connection, daily impact.", ar: "ضمّن: الأهمّيّة والصلة الشخصيّة والأثر اليومي." },
            },
          },
          {
            id: "C",
            title: { en: "Causes of Misguidance", ar: "أسباب الضلال" },
            image: IMG.bookshelf,
            color: "purple",
            topic: { en: "What leads people astray", ar: "ما يُضلّ الناس" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Have you seen he who takes his desire as his god?\' (Al-Furqan 43)", ar: "﴿أرأيت من اتّخذ إلهه هواه﴾ (الفرقان ٤٣)" } },
              { label: { en: "Examples", ar: "أمثلة" }, content: { en: "Arrogance, blind following, ignoring evidence, bad friends.", ar: "الكبر والتقليد الأعمى وتجاهل الأدلّة ورفاق السوء." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowing the dangers helps avoid them.", ar: "معرفة المخاطر تساعد في تجنّبها." } },
            ],
            task: {
              title: { en: "Analyse Causes", ar: "حلّل الأسباب" },
              description: { en: "List 5 causes of misguidance with Quran evidence.", ar: "اذكر ٥ أسباب ضلال بأدلّة قرآنيّة." },
              hint: { en: "Include: the cause, the evidence, the prevention.", ar: "ضمّن: السبب والدليل والوقاية." },
            },
          },
          {
            id: "D",
            title: { en: "Stories of Guidance", ar: "قصص الهداية" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "People who found the path", ar: "أشخاص وجدوا الطريق" },
            infoSections: [
              { label: { en: "Example", ar: "مثال" }, content: { en: "Umar ibn al-Khattab — from enemy of Islam to greatest caliph.", ar: "عمر بن الخطّاب — من عدوّ للإسلام لأعظم خليفة." } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "The people of Madinah who accepted Islam through sincerity.", ar: "أهل المدينة الذين قبلوا الإسلام بإخلاص." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Guidance can come at any time to a sincere heart.", ar: "الهداية تأتي في أيّ وقت للقلب المخلص." } },
            ],
            task: {
              title: { en: "Write a Guidance Story", ar: "اكتب قصّة هداية" },
              description: { en: "Write about someone who found guidance and how.", ar: "اكتب عن شخص وجد الهداية وكيف." },
              hint: { en: "Include: the journey, the turning point, the evidence.", ar: "ضمّن: الرحلة ونقطة التحوّل والدليل." },
            },
          },
          {
            id: "E",
            title: { en: "Staying on the Path", ar: "الثبات على الطريق" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "How to maintain guidance", ar: "كيف تحافظ على الهداية" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'O Turner of hearts, keep my heart firm on Your religion.\' (Tirmidhi)", ar: "«يا مقلّب القلوب ثبّت قلبي على دينك.» (الترمذي)" } },
              { label: { en: "Tips", ar: "نصائح" }, content: { en: "Regular prayer, Quran reading, good company, dua.", ar: "الصلاة المنتظمة وقراءة القرآن والصحبة الصالحة والدعاء." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Maintenance is harder than finding — stay vigilant.", ar: "الحفاظ أصعب من الإيجاد — كن يقظًا." } },
            ],
            task: {
              title: { en: "Create a Guidance Maintenance Plan", ar: "أنشئ خطّة حفاظ على الهداية" },
              description: { en: "Design a weekly plan to maintain hidayah.", ar: "صمّم خطّة أسبوعيّة للحفاظ على الهداية." },
              hint: { en: "Include: prayers, Quran, dua, company, avoidance.", ar: "ضمّن: الصلوات والقرآن والدعاء والصحبة والاجتناب." },
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
            question: { en: "What does hidayah mean?", ar: "ما معنى الهداية؟" },
            options: [
            { en: "Divine guidance", ar: "الهداية الإلهيّة" },
            { en: "Wealth", ar: "الثروة" },
            { en: "Power", ar: "القوّة" },
            { en: "Speed", ar: "السرعة" },
            ],
            correctIndex: 0,
            explanation: { en: "Guidance from Allah.", ar: "الهداية من الله." },
          },
          {
            question: { en: "How often do we ask for guidance?", ar: "كم مرّة نسأل الهداية؟" },
            options: [
            { en: "17+ times daily", ar: "١٧ مرّة يوميًّا" },
            { en: "Once yearly", ar: "مرّة سنويًّا" },
            { en: "Never", ar: "أبدًا" },
            { en: "Only Ramadan", ar: "رمضان فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "At least 17 times in prayer.", ar: "١٧ مرّة في الصلاة على الأقلّ." },
          },
          {
            question: { en: "What leads to misguidance?", ar: "ما يؤدّي للضلال؟" },
            options: [
            { en: "Following desires and arrogance", ar: "اتّباع الهوى والكبر" },
            { en: "Reading Quran", ar: "قراءة القرآن" },
            { en: "Praying", ar: "الصلاة" },
            { en: "Fasting", ar: "الصيام" },
            ],
            correctIndex: 0,
            explanation: { en: "Desires, arrogance, bad company.", ar: "الهوى والكبر ورفاق السوء." },
          },
          {
            question: { en: "Quran is guidance for?", ar: "القرآن هدى لل؟" },
            options: [
            { en: "God-conscious", ar: "المتّقين" },
            { en: "Animals", ar: "الحيوانات" },
            { en: "Stars", ar: "النجوم" },
            { en: "Rocks", ar: "الصخور" },
            ],
            correctIndex: 0,
            explanation: { en: "The God-conscious (muttaqeen).", ar: "المتّقين." },
          },
          {
            question: { en: "Al-Fatiha 6 says?", ar: "الفاتحة ٦ تقول؟" },
            options: [
            { en: "Guide us to the straight path", ar: "اهدنا الصراط المستقيم" },
            { en: "Give us money", ar: "أعطنا مالًا" },
            { en: "Make us famous", ar: "اجعلنا مشهورين" },
            { en: "Feed us", ar: "أطعمنا" },
            ],
            correctIndex: 0,
            explanation: { en: "Guide us to the straight path.", ar: "اهدنا الصراط المستقيم." },
          },
          {
            question: { en: "Who found guidance dramatically?", ar: "من وجد الهداية بشكل مذهل؟" },
            options: [
            { en: "Umar ibn al-Khattab", ar: "عمر بن الخطّاب" },
            { en: "Abu Jahl", ar: "أبو جهل" },
            { en: "Fir\'awn", ar: "فرعون" },
            { en: "Iblis", ar: "إبليس" },
            ],
            correctIndex: 0,
            explanation: { en: "Umar — from enemy to caliph.", ar: "عمر — من عدوّ لخليفة." },
          },
          {
            question: { en: "What dua for heart firmness?", ar: "أيّ دعاء لثبات القلب؟" },
            options: [
            { en: "Ya muqallib al-qulub", ar: "يا مقلّب القلوب" },
            { en: "SubhanAllah", ar: "سبحان الله" },
            { en: "Astaghfirullah", ar: "أستغفر الله" },
            { en: "Alhamdulillah", ar: "الحمد لله" },
            ],
            correctIndex: 0,
            explanation: { en: "O Turner of hearts (Tirmidhi).", ar: "يا مقلّب القلوب (الترمذي)." },
          },
          {
            question: { en: "Sources of guidance include?", ar: "مصادر الهداية تشمل؟" },
            options: [
            { en: "Quran and Sunnah", ar: "القرآن والسنّة" },
            { en: "TV shows", ar: "البرامج التلفزيونيّة" },
            { en: "Social media", ar: "وسائل التواصل" },
            { en: "Video games", ar: "ألعاب الفيديو" },
            ],
            correctIndex: 0,
            explanation: { en: "Quran and Sunnah.", ar: "القرآن والسنّة." },
          },
          {
            question: { en: "Is guidance guaranteed?", ar: "هل الهداية مضمونة؟" },
            options: [
            { en: "No, must ask daily", ar: "لا يجب أن تسأل يوميًّا" },
            { en: "Yes always", ar: "نعم دائمًا" },
            { en: "Only for prophets", ar: "للأنبياء فقط" },
            { en: "Only in Ramadan", ar: "في رمضان فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "No — that is why we ask daily.", ar: "لا — لذلك نسأل يوميًّا." },
          },
          {
            question: { en: "What does sirat mustaqim mean?", ar: "ما الصراط المستقيم؟" },
            options: [
            { en: "The straight path", ar: "الطريق المستقيم" },
            { en: "A road in Makkah", ar: "طريق في مكّة" },
            { en: "A river", ar: "نهر" },
            { en: "A mountain", ar: "جبل" },
            ],
            correctIndex: 0,
            explanation: { en: "The straight path of Islam.", ar: "طريق الإسلام المستقيم." },
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
        title: { en: "Path of Guidance", ar: "طريق الهداية" },
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
        code: "GUIDE001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Path of Guidance (Al-Mulk 1-14)", ar: "ورقة عمل — سَبيلُ الهِدايةِ (المُلك ١–١٤)" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Path of Guidance (Al-Mulk 1-14)", ar: "ورقة عمل — سَبيلُ الهِدايةِ (المُلك ١–١٤)" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "What is hidayah?", ar: "ما الهداية؟" },
                options: [
                { en: "Guidance", ar: "هداية" },
                { en: "Food", ar: "طعام" },
                { en: "Money", ar: "مال" },
                { en: "Power", ar: "قوّة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How often asked in prayer?", ar: "كم مرّة في الصلاة؟" },
                options: [
                { en: "17+ daily", ar: "١٧ يوميًّا" },
                { en: "Once", ar: "مرّة" },
                { en: "Never", ar: "أبدًا" },
                { en: "Monthly", ar: "شهريًّا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Main cause of misguidance?", ar: "السبب الرئيسي للضلال؟" },
                options: [
                { en: "Following desires", ar: "اتّباع الهوى" },
                { en: "Prayer", ar: "الصلاة" },
                { en: "Charity", ar: "الصدقة" },
                { en: "Fasting", ar: "الصيام" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Quran is guidance for?", ar: "القرآن هدى ل؟" },
                options: [
                { en: "The God-conscious", ar: "المتّقين" },
                { en: "No one", ar: "لا أحد" },
                { en: "Animals", ar: "الحيوانات" },
                { en: "Objects", ar: "الأشياء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Al-Fatiha asks for?", ar: "الفاتحة تسأل؟" },
                options: [
                { en: "Guidance to straight path", ar: "الهداية للصراط المستقيم" },
                { en: "Money", ar: "المال" },
                { en: "Fame", ar: "الشهرة" },
                { en: "Food", ar: "الطعام" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "The Quran is a source of guidance.", ar: "القرآن مصدر هداية." }, answer: true },
              { statement: { en: "Guidance is guaranteed for everyone.", ar: "الهداية مضمونة للجميع." }, answer: false },
              { statement: { en: "We ask for guidance in Al-Fatiha.", ar: "نسأل الهداية في الفاتحة." }, answer: true },
              { statement: { en: "Bad company helps guidance.", ar: "رفاق السوء يساعدون الهداية." }, answer: false },
              { statement: { en: "The Prophet asked for heart firmness.", ar: "النبيّ دعا بثبات القلب." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Hidayah", ar: "هداية" }, answer: { en: "Divine guidance", ar: "الهداية الإلهيّة" } },
              { prompt: { en: "Sirat", ar: "صراط" }, answer: { en: "Path", ar: "الطريق" } },
              { prompt: { en: "Dalal", ar: "ضلال" }, answer: { en: "Misguidance", ar: "الضلال" } },
              { prompt: { en: "Taqwa", ar: "تقوى" }, answer: { en: "God-consciousness", ar: "الوعي بالله" } },
              { prompt: { en: "Nur", ar: "نور" }, answer: { en: "Light of guidance", ar: "نور الهداية" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Guide us to the _______ path.\'", ar: "﴿اهدنا الصراط _______.﴾" }, blankAnswer: { en: "straight", ar: "المستقيم" } },
              { sentence: { en: "The Quran is guidance for the _______.", ar: "القرآن هدى لل_______." }, blankAnswer: { en: "God-conscious", ar: "المتّقين" } },
              { sentence: { en: "Following _______ leads to misguidance.", ar: "اتّباع _______ يؤدّي للضلال." }, blankAnswer: { en: "desires", ar: "الهوى" } },
              { sentence: { en: "\'O Turner of _______, keep my heart firm.\'", ar: "«يا مقلّب _______ ثبّت قلبي.»" }, blankAnswer: { en: "hearts", ar: "القلوب" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Recognise need for guidance", ar: "أدرك الحاجة للهداية" },
              { en: "Turn to the Quran as primary source", ar: "ارجع للقرآن كمصدر أوّل" },
              { en: "Follow the Sunnah", ar: "اتّبع السنّة" },
              { en: "Seek righteous company", ar: "ابحث عن صحبة صالحة" },
              { en: "Ask Allah for guidance daily", ar: "اسأل الله الهداية يوميًّا" },
              { en: "Stay firm on the straight path", ar: "اثبت على الصراط المستقيم" },
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
