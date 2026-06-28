import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const patienceAndCertainty: CourseLesson = {
  slug: "g6y7-patience-and-certainty-as-sajdah-23-30",
  name: { en: "Patience and Certainty (As-Sajdah 23-30)", ar: "الصَّبرُ واليَقينُ (السجدة ٢٣-٣٠)" },
  shortIntro: {
    en: "The conclusion of Surat As-Sajdah: how Allah made Musa a guide, the law that leadership in faith is earned by patience and certainty, the sign of rain reviving dead earth as proof of resurrection, and the final warning to act before \'the day of conquest\'.",
    ar: "خِتامُ سورةِ السَّجدة: كَيفَ جَعَلَ اللهُ موسى إمامًا، وقانونُ أنَّ إمامةَ الدِّينِ تُنالُ بِالصَّبرِ واليَقين، وآيةُ الغَيثِ يُحيي الأرضَ المَيتةَ بُرهانًا على البَعث، والإنذارُ الأخيرُ بِالعَمَلِ قَبلَ «يَومِ الفَتح».",
  },
  quranSurahs: ["As-Sajdah 23-30", "Al-Ankabut 69", "Fatir 9"],
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
        title: { en: "Can anyone be a leader in faith?", ar: "هل يمكن لأيّ أحد أن يكون قائدًا في الدين؟" },
        body: {
          en: "A student says: \'Leadership in Islam is only for scholars. Normal people cannot guide anyone. You need special status — patience and certainty are just words, not qualifications for leadership.\'",
          ar: "طالب يقول: «القيادة في الإسلام للعلماء فقط. الناس العاديّون لا يستطيعون توجيه أحد. تحتاج مكانة خاصّة.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using As-Sajdah 23-30 on how patience and certainty earn leadership.",
          ar: "انتقد بالسجدة ٢٣-٣٠ عن كيف ينال الصبر واليقين الإمامة.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "As-Sajdah 24: \'We made from among them leaders guiding by Our command when they were patient and certain of Our signs.\'",
        ar: "السجدة ٢٤: ﴿وجعلنا منهم أئمّة يهدون بأمرنا لمّا صبروا وكانوا بآياتنا يوقنون﴾",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Sabr (Patience)", ar: "صبر" } },
          { image: IMG.grandMosque, keyword: { en: "Yaqin (Certainty)", ar: "يقين" } },
          { image: IMG.lantern, keyword: { en: "Imamah (Leadership)", ar: "إمامة" } },
          { image: IMG.bookshelf, keyword: { en: "Musa (Moses)", ar: "موسى" } },
          { image: IMG.skyBlue, keyword: { en: "Ba\'th (Resurrection)", ar: "بعث" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "As-Sajdah 23-24: \'We gave Musa the Scripture... We made leaders who guide by Our command when they were patient.\'",
        ar: "السجدة ٢٣-٢٤: ﴿ولقد آتينا موسى الكتاب... وجعلنا منهم أئمّة يهدون بأمرنا لمّا صبروا﴾",
      },
    },
    {
      title: { en: "Patience and Certainty (As-Sajdah 23-30)", ar: "الصَّبرُ واليَقينُ (السجدة ٢٣-٣٠)" },
      learningObjectives: [
        { en: "Explain how patience and certainty lead to spiritual leadership.", ar: "أشرح كيف يقود الصبر واليقين إلى القيادة الروحيّة." },
        { en: "Analyse the signs of resurrection in As-Sajdah 25-30.", ar: "أحلّل آيات البعث في السجدة ٢٥-٣٠." },
      ],
      successCriteria: [
        { en: "I can explain the condition for leadership in As-Sajdah 24.", ar: "أشرح شرط الإمامة في السجدة ٢٤." },
        { en: "I can describe how rain reviving earth proves resurrection.", ar: "أصف كيف يُثبت الغيث الذي يحيي الأرض البعث." },
        { en: "I can connect patience and certainty to daily life.", ar: "أربط الصبر واليقين بالحياة اليوميّة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Patience and Certainty — As-Sajdah 23-30", ar: "الصبر واليقين — السجدة ٢٣-٣٠" },
      learningObjectives: [
        { en: "Understand how patience and certainty earn leadership, and the proofs of resurrection.", ar: "أفهم كيف ينال الصبر واليقين الإمامة وبراهين البعث." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Leadership through Patience", ar: "الإمامة بالصبر" },
          lines: [
            { en: "As-Sajdah 24: \'We made from them leaders guiding by Our command when they were patient and certain.\' The formula: sabr + yaqin = spiritual leadership. Musa endured Pharaoh\'s oppression, Bani Isra\'il\'s complaints, yet persevered.", ar: "السجدة ٢٤: ﴿وجعلنا منهم أئمّة يهدون بأمرنا لمّا صبروا وكانوا بآياتنا يوقنون﴾ المعادلة: صبر + يقين = إمامة. موسى صبر على فرعون وشكاوى بني إسرائيل." },
          ],
        },
        {
          label: { en: "Proof of Resurrection", ar: "برهان البعث" },
          lines: [
            { en: "As-Sajdah 27: \'Have they not seen how We drive rain to barren land and produce crops?\' Dead earth comes alive = dead humans will be raised. This is Allah\'s proof in nature.", ar: "السجدة ٢٧: ﴿أولم يروا أنّا نسوق الماء إلى الأرض الجُرُز فنُخرج به زرعًا﴾ الأرض الميّتة تحيا = البشر الموتى سيُبعثون." },
          ],
        },
        {
          label: { en: "Day of Decision", ar: "يوم الفصل" },
          lines: [
            { en: "As-Sajdah 29: \'On the Day of Conquest (al-Fath), believing will not benefit those who did not believe before.\' Act now — repentance after death is too late.", ar: "السجدة ٢٩: ﴿يوم الفتح لا ينفع الذين كفروا إيمانهم﴾ اعمل الآن — التوبة بعد الموت لا تنفع." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Leadership needs patience and certainty.", ar: "الإمامة تحتاج صبرًا ويقينًا." }, answer: true },
        { statement: { en: "Anyone can lead without effort.", ar: "أيّ أحد يقود بلا جهد." }, answer: false },
        { statement: { en: "Rain reviving earth proves resurrection.", ar: "الغيث يحيي الأرض = دليل البعث." }, answer: true },
        { statement: { en: "Repentance after death is accepted.", ar: "التوبة بعد الموت مقبولة." }, answer: false },
        { statement: { en: "Musa was given the Scripture.", ar: "موسى أُوتي الكتاب." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'We made from them _______ guiding by Our command.\'", ar: "﴿وجعلنا منهم _______ يهدون بأمرنا﴾" }, answer: { en: "leaders", ar: "أئمّة" } },
        { sentence: { en: "Leadership requires patience and _______.", ar: "الإمامة تحتاج صبرًا و_______." }, answer: { en: "certainty", ar: "يقينًا" } },
        { sentence: { en: "Rain revives _______ earth.", ar: "الغيث يحيي الأرض _______." }, answer: { en: "barren", ar: "الجُرُز" } },
        { sentence: { en: "\'On the Day of _______, believing will not benefit.\'", ar: "﴿يوم _______ لا ينفع الذين كفروا إيمانهم﴾" }, answer: { en: "Conquest", ar: "الفتح" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Patience and certainty earn spiritual leadership — As-Sajdah 24. Rain reviving earth proves resurrection — As-Sajdah 27.",
        ar: "الصبر واليقين ينالان الإمامة — السجدة ٢٤. الغيث يحيي الأرض = دليل البعث — السجدة ٢٧.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore patience, certainty, and resurrection proofs.", ar: "استكشف الصبر واليقين وبراهين البعث." },
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
            title: { en: "Sabr — Patience", ar: "الصبر" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "The key to leadership", ar: "مفتاح الإمامة" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 24: Leadership is earned through sabr.", ar: "السجدة ٢٤: الإمامة تُنال بالصبر." } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "Musa endured Pharaoh, desert, complaints — yet never gave up.", ar: "موسى صبر على فرعون والصحراء والشكاوى ولم يستسلم." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Patience is not passive — it is active perseverance.", ar: "الصبر ليس سلبيًّا — إنّه مثابرة فاعلة." } },
            ],
            task: {
              title: { en: "Define True Patience", ar: "عرّف الصبر الحقيقي" },
              description: { en: "Explain what sabr means with examples from prophets.", ar: "اشرح معنى الصبر بأمثلة من الأنبياء." },
              hint: { en: "Include: Musa, Ayub, Muhammad, Quran evidence.", ar: "ضمّن: موسى وأيّوب ومحمّد والأدلّة القرآنيّة." },
            },
          },
          {
            id: "B",
            title: { en: "Yaqin — Certainty", ar: "اليقين" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Unwavering belief", ar: "إيمان لا يتزعزع" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 24: \'They were certain of Our signs.\'", ar: "السجدة ٢٤: ﴿وكانوا بآياتنا يوقنون﴾" } },
              { label: { en: "Meaning", ar: "معنى" }, content: { en: "Yaqin = certainty beyond doubt. Not blind faith but evidence-based conviction.", ar: "اليقين = إيمان بلا شكّ. ليس إيمانًا أعمى بل قناعة قائمة على الأدلّة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Certainty comes from reflection on Allah\'s signs.", ar: "اليقين يأتي من التأمّل في آيات الله." } },
            ],
            task: {
              title: { en: "Explore Certainty", ar: "استكشف اليقين" },
              description: { en: "Write about how certainty is built through reflection.", ar: "اكتب كيف يُبنى اليقين بالتأمّل." },
              hint: { en: "Include: signs in nature, Quran, personal experience.", ar: "ضمّن: آيات الطبيعة والقرآن والتجربة الشخصيّة." },
            },
          },
          {
            id: "C",
            title: { en: "Musa\'s Journey", ar: "رحلة موسى" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "A model of patience", ar: "نموذج الصبر" },
            infoSections: [
              { label: { en: "Story", ar: "قصّة" }, content: { en: "Musa faced Pharaoh, Red Sea, desert, golden calf — yet he never lost faith or patience.", ar: "موسى واجه فرعون والبحر والصحراء والعجل ولم يفقد إيمانه أو صبره." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 23: \'We gave Musa the Scripture — so doubt not receiving it.\'", ar: "السجدة ٢٣: ﴿ولقد آتينا موسى الكتاب فلا تكن في مرية من لقائه﴾" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every trial Musa faced made him stronger.", ar: "كلّ محنة واجهها موسى جعلته أقوى." } },
            ],
            task: {
              title: { en: "Map Musa\'s Trials", ar: "ارسم خريطة محن موسى" },
              description: { en: "Create a timeline of Musa\'s major trials.", ar: "أنشئ جدولًا زمنيًّا لمحن موسى." },
              hint: { en: "Include: the trial, his response, the outcome, the lesson.", ar: "ضمّن: المحنة واستجابته والنتيجة والدرس." },
            },
          },
          {
            id: "D",
            title: { en: "Proof of Resurrection", ar: "برهان البعث" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Rain revives earth", ar: "الغيث يحيي الأرض" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 27: \'We drive rain to barren land and produce crops.\'", ar: "السجدة ٢٧: ﴿أنّا نسوق الماء إلى الأرض الجُرُز فنُخرج به زرعًا﴾" } },
              { label: { en: "Logic", ar: "منطق" }, content: { en: "If Allah can bring dead land to life with rain, He can raise the dead on Judgement Day.", ar: "إذا أحيا الله الأرض الميّتة بالمطر فيمكنه بعث الموتى يوم القيامة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Nature is a sign of Allah\'s power over life and death.", ar: "الطبيعة آية على قدرة الله على الحياة والموت." } },
            ],
            task: {
              title: { en: "Find Nature Proofs", ar: "أوجد أدلّة الطبيعة" },
              description: { en: "List 5 natural signs that prove Allah\'s power.", ar: "اذكر ٥ آيات طبيعيّة تُثبت قدرة الله." },
              hint: { en: "Include: rain, plants, seasons, animal life, human body.", ar: "ضمّن: المطر والنبات والفصول والحيوان وجسم الإنسان." },
            },
          },
          {
            id: "E",
            title: { en: "Act Now", ar: "اعمل الآن" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Before it\'s too late", ar: "قبل فوات الأوان" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 29: \'On the Day of Conquest, believing will not benefit those who didn\'t believe before.\'", ar: "السجدة ٢٩: ﴿يوم الفتح لا ينفع الذين كفروا إيمانهم﴾" } },
              { label: { en: "Urgency", ar: "إلحاح" }, content: { en: "Time is limited — we don\'t know when our \'day of conquest\' will come.", ar: "الوقت محدود — لا نعلم متى يأتي \'يوم الفتح.\'" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every moment is an opportunity to earn Allah\'s pleasure.", ar: "كلّ لحظة فرصة لنيل رضا الله." } },
            ],
            task: {
              title: { en: "Write Your Action Plan", ar: "اكتب خطّة عملك" },
              description: { en: "Create a personal plan to strengthen sabr and yaqin.", ar: "أنشئ خطّة شخصيّة لتقوية الصبر واليقين." },
              hint: { en: "Include: daily habits, Quran goals, patience exercises.", ar: "ضمّن: عادات يوميّة وأهداف قرآنيّة وتمارين صبر." },
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
            question: { en: "Leadership needs?", ar: "الإمامة تحتاج؟" },
            options: [
            { en: "Patience and certainty", ar: "صبرًا ويقينًا" },
            { en: "Money", ar: "مالًا" },
            { en: "Fame", ar: "شهرة" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Patience and certainty.", ar: "صبرًا ويقينًا." },
          },
          {
            question: { en: "Who received the Scripture?", ar: "من أُوتي الكتاب؟" },
            options: [
            { en: "Musa", ar: "موسى" },
            { en: "Fir\'awn", ar: "فرعون" },
            { en: "Qarun", ar: "قارون" },
            { en: "Haman", ar: "هامان" },
            ],
            correctIndex: 0,
            explanation: { en: "Musa.", ar: "موسى." },
          },
          {
            question: { en: "Rain to barren land proves?", ar: "الغيث للأرض الجُرُز يُثبت؟" },
            options: [
            { en: "Resurrection", ar: "البعث" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Extinction", ar: "الانقراض" },
            { en: "Sadness", ar: "الحزن" },
            ],
            correctIndex: 0,
            explanation: { en: "Resurrection.", ar: "البعث." },
          },
          {
            question: { en: "Day of Conquest means?", ar: "يوم الفتح يعني؟" },
            options: [
            { en: "Too late to believe", ar: "فات وقت الإيمان" },
            { en: "Celebration", ar: "احتفال" },
            { en: "Holiday", ar: "عطلة" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Too late to repent.", ar: "فات وقت التوبة." },
          },
          {
            question: { en: "Sabr means?", ar: "الصبر يعني؟" },
            options: [
            { en: "Active perseverance", ar: "مثابرة فاعلة" },
            { en: "Giving up", ar: "الاستسلام" },
            { en: "Sleeping", ar: "النوم" },
            { en: "Ignoring", ar: "التجاهل" },
            ],
            correctIndex: 0,
            explanation: { en: "Active perseverance.", ar: "مثابرة فاعلة." },
          },
          {
            question: { en: "Yaqin means?", ar: "اليقين يعني؟" },
            options: [
            { en: "Certainty beyond doubt", ar: "إيمان بلا شكّ" },
            { en: "Doubt", ar: "شكّ" },
            { en: "Fear", ar: "خوف" },
            { en: "Anger", ar: "غضب" },
            ],
            correctIndex: 0,
            explanation: { en: "Certainty beyond doubt.", ar: "إيمان بلا شكّ." },
          },
          {
            question: { en: "Musa faced?", ar: "موسى واجه؟" },
            options: [
            { en: "Pharaoh", ar: "فرعون" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Easy life", ar: "حياة سهلة" },
            { en: "Wealth", ar: "ثروة" },
            ],
            correctIndex: 0,
            explanation: { en: "Pharaoh and many trials.", ar: "فرعون ومحنًا كثيرة." },
          },
          {
            question: { en: "As-Sajdah 24 talks about?", ar: "السجدة ٢٤ تتحدّث عن؟" },
            options: [
            { en: "Leaders from sabr and yaqin", ar: "أئمّة بالصبر واليقين" },
            { en: "Money", ar: "المال" },
            { en: "Food", ar: "الطعام" },
            { en: "Sleep", ar: "النوم" },
            ],
            correctIndex: 0,
            explanation: { en: "Leaders made through patience and certainty.", ar: "أئمّة بالصبر واليقين." },
          },
          {
            question: { en: "\'We drive rain to?\'", ar: "﴿نسوق الماء إلى؟﴾" },
            options: [
            { en: "Barren land", ar: "الأرض الجُرُز" },
            { en: "Ocean", ar: "المحيط" },
            { en: "Sky", ar: "السماء" },
            { en: "Moon", ar: "القمر" },
            ],
            correctIndex: 0,
            explanation: { en: "Barren land.", ar: "الأرض الجُرُز." },
          },
          {
            question: { en: "Act now because?", ar: "اعمل الآن لأنّ؟" },
            options: [
            { en: "Belief won\'t benefit later", ar: "الإيمان لن ينفع لاحقًا" },
            { en: "No reason", ar: "بلا سبب" },
            { en: "For fun", ar: "للمرح" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Belief won\'t benefit after the Day of Conquest.", ar: "الإيمان لن ينفع بعد يوم الفتح." },
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
        title: { en: "Patience and Certainty", ar: "الصبر واليقين" },
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
        code: "PATCE001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Patience and Certainty (As-Sajdah 23-30)", ar: "ورقة عمل — الصَّبرُ واليَقينُ (السجدة ٢٣-٣٠)" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Patience and Certainty (As-Sajdah 23-30)", ar: "ورقة عمل — الصَّبرُ واليَقينُ (السجدة ٢٣-٣٠)" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Leadership needs?", ar: "الإمامة تحتاج؟" },
                options: [
                { en: "Patience + certainty", ar: "صبر + يقين" },
                { en: "Money", ar: "مال" },
                { en: "Fame", ar: "شهرة" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Musa received?", ar: "موسى أُوتي؟" },
                options: [
                { en: "Scripture", ar: "الكتاب" },
                { en: "Gold", ar: "ذهب" },
                { en: "Army", ar: "جيش" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Rain proves?", ar: "الغيث يُثبت؟" },
                options: [
                { en: "Resurrection", ar: "البعث" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Destruction", ar: "الدمار" },
                { en: "Sadness", ar: "الحزن" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Act now before?", ar: "اعمل قبل؟" },
                options: [
                { en: "Day of Conquest", ar: "يوم الفتح" },
                { en: "Lunch", ar: "الغداء" },
                { en: "Sleep", ar: "النوم" },
                { en: "School", ar: "المدرسة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Sabr is?", ar: "الصبر؟" },
                options: [
                { en: "Perseverance", ar: "مثابرة" },
                { en: "Giving up", ar: "استسلام" },
                { en: "Sleeping", ar: "نوم" },
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
              { statement: { en: "Leadership needs patience.", ar: "الإمامة تحتاج صبرًا." }, answer: true },
              { statement: { en: "Anyone leads without effort.", ar: "أيّ أحد يقود بلا جهد." }, answer: false },
              { statement: { en: "Rain proves resurrection.", ar: "الغيث يُثبت البعث." }, answer: true },
              { statement: { en: "Repentance after death works.", ar: "التوبة بعد الموت تنفع." }, answer: false },
              { statement: { en: "Musa was patient.", ar: "موسى كان صبورًا." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Sabr", ar: "صبر" }, answer: { en: "Patience", ar: "الصبر" } },
              { prompt: { en: "Yaqin", ar: "يقين" }, answer: { en: "Certainty", ar: "اليقين" } },
              { prompt: { en: "Imamah", ar: "إمامة" }, answer: { en: "Leadership", ar: "الإمامة" } },
              { prompt: { en: "Ba\'th", ar: "بعث" }, answer: { en: "Resurrection", ar: "البعث" } },
              { prompt: { en: "Al-Fath", ar: "الفتح" }, answer: { en: "Conquest/Decision", ar: "الفتح" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'We made from them _______ guiding by Our command.\'", ar: "﴿وجعلنا منهم _______ يهدون بأمرنا﴾" }, blankAnswer: { en: "leaders", ar: "أئمّة" } },
              { sentence: { en: "Leadership requires sabr and _______.", ar: "الإمامة تحتاج صبرًا و_______." }, blankAnswer: { en: "yaqin", ar: "يقينًا" } },
              { sentence: { en: "Rain revives _______ earth.", ar: "الغيث يحيي الأرض _______." }, blankAnswer: { en: "barren", ar: "الجُرُز" } },
              { sentence: { en: "Day of _______ — too late to believe.", ar: "يوم _______ — فات وقت الإيمان." }, blankAnswer: { en: "Conquest", ar: "الفتح" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Receive the concept of sabr and yaqin", ar: "تلقَّ مفهوم الصبر واليقين" },
              { en: "Study Musa\'s example of patience", ar: "ادرس مثال موسى في الصبر" },
              { en: "Understand the resurrection proof", ar: "افهم برهان البعث" },
              { en: "Reflect on the Day of Conquest warning", ar: "تأمّل إنذار يوم الفتح" },
              { en: "Build patience in daily life", ar: "ابنِ الصبر في الحياة اليوميّة" },
              { en: "Strengthen certainty through reflection", ar: "قوِّ اليقين بالتأمّل" },
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
