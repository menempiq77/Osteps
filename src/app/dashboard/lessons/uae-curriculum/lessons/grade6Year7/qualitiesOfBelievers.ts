import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const qualitiesOfBelievers: CourseLesson = {
  slug: "g6y7-qualities-of-believers-as-sajdah-13-22",
  name: { en: "The Qualities of Believers and Their Reward (As-Sajdah 13-22)", ar: "صِفاتُ المُؤمِنينَ وجَزاؤُهُم (السجدة ١٣-٢٢)" },
  shortIntro: {
    en: "A close study of As-Sajdah 13-22: how the same revelation divides people into two paths, the inner traits of the believers whose sides forsake their beds, the hidden reward \'no soul knows\', and why the believer and the rebel can never be equal.",
    ar: "دِراسةٌ مُتَأنِّيةٌ لِلسجدة ١٣-٢٢: كَيفَ يَقسِمُ الوَحيُ النّاسَ إلى طَريقَين، وصِفاتُ المُؤمِنينَ الذينَ تَتَجافى جُنوبُهُم عنِ المَضاجِع، والجَزاءُ المَخفِيُّ الذي «لا تَعلَمُ نَفسٌ»، ولِماذا لا يَستَوي المُؤمِنُ والفاسِق.",
  },
  quranSurahs: ["As-Sajdah 13-22", "Adh-Dhariyat 15-18", "Al-Furqan 64"],
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
        title: { en: "Can believers and disbelievers be equal?", ar: "هل يتساوى المؤمنون والكافرون؟" },
        body: {
          en: "A student argues: \'It does not matter if you believe or not. Good people go to heaven regardless of faith. There is no difference between a believer and a disbeliever in the eyes of God.\'",
          ar: "طالب يقول: «لا يهمّ إن آمنت أم لا. الجيّدون يدخلون الجنّة بغضّ النظر عن الإيمان. لا فرق بين مؤمن وكافر عند الله.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using As-Sajdah 18-20 on the difference between believers and wrongdoers.",
          ar: "انتقد بالسجدة ١٨-٢٠ عن الفرق بين المؤمنين والفاسقين.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "As-Sajdah 18: \'Is one who is a believer like one who is defiantly disobedient? They are not equal.\'",
        ar: "السجدة ١٨: ﴿أفمن كان مؤمنًا كمن كان فاسقًا لا يستوون﴾",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Iman (Faith)", ar: "إيمان" } },
          { image: IMG.grandMosque, keyword: { en: "Taqwa (God-consciousness)", ar: "تقوى" } },
          { image: IMG.lantern, keyword: { en: "Qiyam al-Layl (Night prayer)", ar: "قيام الليل" } },
          { image: IMG.skyBlue, keyword: { en: "Jannah (Paradise)", ar: "جنّة" } },
          { image: IMG.waterfall, keyword: { en: "Sujud (Prostration)", ar: "سجود" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "As-Sajdah 15-16: \'Those who believe in Our signs fall down in prostration and glorify their Lord.\'",
        ar: "السجدة ١٥-١٦: ﴿إنّما يؤمن بآياتنا الذين إذا ذُكّروا بها خرّوا سجّدًا وسبّحوا بحمد ربّهم﴾",
      },
    },
    {
      title: { en: "The Qualities of Believers and Their Reward (As-Sajdah 13-22)", ar: "صِفاتُ المُؤمِنينَ وجَزاؤُهُم (السجدة ١٣-٢٢)" },
      learningObjectives: [
        { en: "Explain the qualities of true believers as described in As-Sajdah 13-22.", ar: "أشرح صفات المؤمنين الحقيقيّين في السجدة ١٣-٢٢." },
        { en: "Compare the rewards of believers with the consequences for disbelievers.", ar: "أقارن بين ثواب المؤمنين وعاقبة الكافرين." },
      ],
      successCriteria: [
        { en: "I can list 3 qualities of believers from As-Sajdah.", ar: "أذكر ٣ صفات للمؤمنين من السجدة." },
        { en: "I can describe the rewards of Jannah mentioned in these verses.", ar: "أصف نعيم الجنّة المذكور في هذه الآيات." },
        { en: "I can explain why believers and wrongdoers are not equal.", ar: "أشرح لماذا لا يتساوى المؤمنون والفاسقون." },
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
      title: { en: "Qualities of Believers — As-Sajdah 13-22", ar: "صفات المؤمنين — السجدة ١٣-٢٢" },
      learningObjectives: [
        { en: "Understand the characteristics and rewards of believers vs. wrongdoers.", ar: "أفهم صفات المؤمنين وثوابهم مقارنة بالفاسقين." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "As-Sajdah 15-16 — Believers\' Qualities", ar: "السجدة ١٥-١٦ — صفات المؤمنين" },
          lines: [
            { en: "They fall in prostration when reminded, glorify Allah, and pray at night forsaking their beds. They call upon Allah with hope and fear, and spend from what Allah provides.", ar: "يخرّون سجّدًا ويسبّحون ربّهم ويقومون الليل. يدعون ربّهم خوفًا وطمعًا وممّا رزقناهم ينفقون." },
          ],
        },
        {
          label: { en: "As-Sajdah 17 — Their Reward", ar: "السجدة ١٧ — ثوابهم" },
          lines: [
            { en: "\'No soul knows what has been hidden for them of comfort for eyes as reward for what they used to do.\'", ar: "﴿فلا تعلم نفس ما أُخفي لهم من قرّة أعين جزاءً بما كانوا يعملون﴾" },
          ],
        },
        {
          label: { en: "As-Sajdah 18-20 — Not Equal", ar: "السجدة ١٨-٢٠ — لا يستوون" },
          lines: [
            { en: "\'Is one who is a believer like one who is defiantly disobedient? They are not equal.\' Believers get Gardens of Refuge; wrongdoers get the Fire.", ar: "﴿أفمن كان مؤمنًا كمن كان فاسقًا لا يستوون﴾ المؤمنون في جنّات المأوى والفاسقون في النار." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Believers pray at night forsaking their beds.", ar: "المؤمنون يقومون الليل." }, answer: true },
        { statement: { en: "Believers and wrongdoers are equal before Allah.", ar: "المؤمنون والفاسقون سواء عند الله." }, answer: false },
        { statement: { en: "The reward hidden for believers is beyond imagination.", ar: "الثواب المخفيّ للمؤمنين فوق التصوّر." }, answer: true },
        { statement: { en: "As-Sajdah says wrongdoers will enter Jannah.", ar: "السجدة تقول الفاسقون يدخلون الجنّة." }, answer: false },
        { statement: { en: "Spending from what Allah provides is a quality of believers.", ar: "الإنفاق ممّا رزق الله صفة للمؤمنين." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'They forsake their _______ to call upon their Lord.\' (As-Sajdah 16)", ar: "﴿تتجافى جنوبهم عن _______ يدعون ربّهم﴾ (السجدة ١٦)" }, answer: { en: "beds", ar: "المضاجع" } },
        { sentence: { en: "\'No soul knows what has been hidden for them of _______ for eyes.\'", ar: "﴿فلا تعلم نفس ما أُخفي لهم من _______ أعين﴾" }, answer: { en: "comfort", ar: "قرّة" } },
        { sentence: { en: "Believers and _______ are not equal. (As-Sajdah 18)", ar: "المؤمنون و_______ لا يستوون. (السجدة ١٨)" }, answer: { en: "wrongdoers", ar: "الفاسقون" } },
        { sentence: { en: "The reward for believers is Gardens of _______.", ar: "ثواب المؤمنين جنّات _______." }, answer: { en: "Refuge", ar: "المأوى" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "As-Sajdah 13-22 contrasts true believers — who pray at night, give charity, and prostrate — with wrongdoers. They are not equal: believers earn hidden rewards beyond imagination.",
        ar: "تقارن السجدة ١٣-٢٢ بين المؤمنين الحقيقيّين والفاسقين. لا يستوون: للمؤمنين ثواب مخفيّ فوق التصوّر.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore different aspects of believers\' qualities from As-Sajdah.", ar: "استكشف جوانب صفات المؤمنين من السجدة." },
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
            title: { en: "Night Prayer", ar: "قيام الليل" },
            image: IMG.lantern,
            color: "teal",
            topic: { en: "The virtue of tahajjud", ar: "فضل التهجّد" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 16: \'They forsake their beds to call upon their Lord.\'", ar: "السجدة ١٦: ﴿تتجافى جنوبهم عن المضاجع﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The best prayer after the obligatory is night prayer.\' (Muslim)", ar: "«أفضل الصلاة بعد الفريضة صلاة الليل.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Sacrificing sleep for Allah shows true devotion.", ar: "التضحية بالنوم لله تُظهر الإخلاص." } },
            ],
            task: {
              title: { en: "Create a Night Prayer Guide", ar: "أنشئ دليل قيام الليل" },
              description: { en: "Design a guide to establishing night prayer.", ar: "صمّم دليلًا لإقامة صلاة الليل." },
              hint: { en: "Include: best times, how many rakahs, duas, benefits.", ar: "ضمّن: أفضل الأوقات والركعات والأدعية والفوائد." },
            },
          },
          {
            id: "B",
            title: { en: "Hope and Fear", ar: "الخوف والرجاء" },
            image: IMG.skyBlue,
            color: "blue",
            topic: { en: "Calling upon Allah with balance", ar: "دعاء الله بتوازن" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 16: \'They call upon their Lord in fear and hope.\'", ar: "السجدة ١٦: ﴿يدعون ربّهم خوفًا وطمعًا﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'If the believer knew the punishment of Allah, no one would hope for Jannah. And if the disbeliever knew Allah\'s mercy, no one would despair.\' (Muslim)", ar: "«لو يعلم المؤمن ما عند الله من العقوبة ما طمع بجنّته أحد ولو يعلم الكافر ما عند الله من الرحمة ما قنط من رحمته أحد.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Balance between hope and fear keeps faith strong.", ar: "التوازن بين الخوف والرجاء يقوّي الإيمان." } },
            ],
            task: {
              title: { en: "Write a Reflection on Hope and Fear", ar: "اكتب تأمّلًا في الخوف والرجاء" },
              description: { en: "Write about balancing hope and fear in daily life.", ar: "اكتب عن التوازن بين الخوف والرجاء يوميًّا." },
              hint: { en: "Include: Quran evidence, personal examples, how to achieve balance.", ar: "ضمّن: أدلّة قرآنيّة وأمثلة شخصيّة وكيفيّة التوازن." },
            },
          },
          {
            id: "C",
            title: { en: "Charity and Spending", ar: "الإنفاق والصدقة" },
            image: IMG.plantBulb,
            color: "purple",
            topic: { en: "Spending from what Allah provides", ar: "الإنفاق ممّا رزق الله" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 16: \'And from what We have provided them, they spend.\'", ar: "السجدة ١٦: ﴿وممّا رزقناهم ينفقون﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Charity does not decrease wealth.\' (Muslim)", ar: "«ما نقصت صدقة من مال.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Generosity is a sign of strong faith.", ar: "الكرم دليل قوّة الإيمان." } },
            ],
            task: {
              title: { en: "Design a Charity Project", ar: "صمّم مشروع إحسان" },
              description: { en: "Plan a class charity project based on Islamic values of giving.", ar: "خطّط لمشروع إحسان صفّي مبنيّ على قيم الإسلام." },
              hint: { en: "Include: what to give, who benefits, Islamic evidence.", ar: "ضمّن: ماذا تعطي ومن يستفيد والأدلّة." },
            },
          },
          {
            id: "D",
            title: { en: "The Hidden Reward", ar: "الثواب المخفيّ" },
            image: IMG.mountainSnow,
            color: "amber",
            topic: { en: "Rewards beyond imagination", ar: "ثواب فوق التصوّر" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 17: \'No soul knows what has been hidden for them of comfort for eyes.\'", ar: "السجدة ١٧: ﴿فلا تعلم نفس ما أُخفي لهم من قرّة أعين﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Allah said: I have prepared for My righteous servants what no eye has seen, no ear has heard, and no heart has imagined.\' (Bukhari & Muslim)", ar: "«أعددت لعبادي الصالحين ما لا عين رأت ولا أذن سمعت ولا خطر على قلب بشر.» (البخاري ومسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The best motivation for worship is the unseen reward.", ar: "أفضل دافع للعبادة الثواب المخفيّ." } },
            ],
            task: {
              title: { en: "Illustrate Jannah", ar: "ارسم الجنّة" },
              description: { en: "Create an illustration of Jannah based on Quran and Hadith descriptions.", ar: "أنشئ رسمًا توضيحيًّا للجنّة من وصف القرآن والحديث." },
              hint: { en: "Include: rivers, trees, comfort, companionship — all from authentic sources.", ar: "ضمّن: أنهار وأشجار ونعيم وصحبة — من مصادر صحيحة." },
            },
          },
          {
            id: "E",
            title: { en: "Believers vs. Wrongdoers", ar: "المؤمنون والفاسقون" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Why they are not equal", ar: "لماذا لا يتساوون" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 18-20: Believers get Jannah, wrongdoers get the Fire.", ar: "السجدة ١٨-٢٠: المؤمنون في الجنّة والفاسقون في النار." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "As-Sajdah 20: \'Every time they want to get out, they are returned.\'", ar: "السجدة ٢٠: ﴿كلّما أرادوا أن يخرجوا منها أُعيدوا فيها﴾" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Actions have consequences — faith matters in the afterlife.", ar: "للأعمال عواقب — الإيمان يهمّ في الآخرة." } },
            ],
            task: {
              title: { en: "Create a Comparison Chart", ar: "أنشئ جدول مقارنة" },
              description: { en: "Create a side-by-side comparison of believers vs. wrongdoers from As-Sajdah.", ar: "أنشئ مقارنة بين المؤمنين والفاسقين من السجدة." },
              hint: { en: "Include: qualities, actions, rewards/punishments, Quranic evidence.", ar: "ضمّن: الصفات والأعمال والثواب/العقاب والأدلّة." },
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
            question: { en: "What do believers do at night? (As-Sajdah 16)", ar: "ماذا يفعل المؤمنون ليلًا؟" },
            options: [
            { en: "Forsake beds to pray", ar: "يتركون المضاجع للصلاة" },
            { en: "Sleep all night", ar: "ينامون كلّ الليل" },
            { en: "Watch TV", ar: "يشاهدون التلفاز" },
            { en: "Play games", ar: "يلعبون" },
            ],
            correctIndex: 0,
            explanation: { en: "They leave their beds to call upon Allah.", ar: "يتركون فُرُشهم لدعاء الله." },
          },
          {
            question: { en: "Are believers and wrongdoers equal?", ar: "هل المؤمنون والفاسقون سواء؟" },
            options: [
            { en: "No, they are not equal", ar: "لا لا يستوون" },
            { en: "Yes", ar: "نعم" },
            { en: "Sometimes", ar: "أحيانًا" },
            { en: "Depends", ar: "يعتمد" },
            ],
            correctIndex: 0,
            explanation: { en: "As-Sajdah 18: They are NOT equal.", ar: "السجدة ١٨: لا يستوون." },
          },
          {
            question: { en: "What is hidden for believers?", ar: "ما المخفيّ للمؤمنين؟" },
            options: [
            { en: "Comfort for eyes beyond imagination", ar: "قرّة أعين فوق التصوّر" },
            { en: "Money", ar: "مال" },
            { en: "Fame", ar: "شهرة" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "As-Sajdah 17.", ar: "السجدة ١٧." },
          },
          {
            question: { en: "What do believers call upon Allah with?", ar: "بماذا يدعو المؤمنون ربّهم؟" },
            options: [
            { en: "Fear and hope", ar: "خوفًا وطمعًا" },
            { en: "Anger", ar: "غضبًا" },
            { en: "Indifference", ar: "لا مبالاة" },
            { en: "Pride", ar: "كبرًا" },
            ],
            correctIndex: 0,
            explanation: { en: "Fear and hope — balanced.", ar: "خوفًا وطمعًا — بتوازن." },
          },
          {
            question: { en: "What do believers spend from?", ar: "ممّا ينفق المؤمنون؟" },
            options: [
            { en: "What Allah provides", ar: "ممّا رزقهم الله" },
            { en: "Others\' money", ar: "مال الآخرين" },
            { en: "Stolen goods", ar: "بضاعة مسروقة" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "From what We have provided them.", ar: "ممّا رزقناهم." },
          },
          {
            question: { en: "Where do wrongdoers end up?", ar: "أين ينتهي الفاسقون؟" },
            options: [
            { en: "The Fire", ar: "النار" },
            { en: "Jannah", ar: "الجنّة" },
            { en: "Nowhere", ar: "لا مكان" },
            { en: "Earth again", ar: "الأرض مجدّدًا" },
            ],
            correctIndex: 0,
            explanation: { en: "As-Sajdah 20.", ar: "السجدة ٢٠." },
          },
          {
            question: { en: "What is the best prayer after obligatory?", ar: "أفضل صلاة بعد الفريضة؟" },
            options: [
            { en: "Night prayer", ar: "صلاة الليل" },
            { en: "Duha", ar: "الضحى" },
            { en: "Witr only", ar: "الوتر فقط" },
            { en: "None", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Night prayer (Muslim).", ar: "صلاة الليل (مسلم)." },
          },
          {
            question: { en: "Does charity decrease wealth?", ar: "هل الصدقة تنقص المال؟" },
            options: [
            { en: "No", ar: "لا" },
            { en: "Yes", ar: "نعم" },
            { en: "Sometimes", ar: "أحيانًا" },
            { en: "Only for poor", ar: "للفقراء فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Charity does not decrease wealth (Muslim).", ar: "ما نقصت صدقة من مال (مسلم)." },
          },
          {
            question: { en: "What does As-Sajdah 20 say about wrongdoers in Fire?", ar: "ماذا تقول السجدة ٢٠ عن الفاسقين في النار؟" },
            options: [
            { en: "Every time they try to leave, returned", ar: "كلّما أرادوا الخروج أُعيدوا" },
            { en: "They leave easily", ar: "يخرجون بسهولة" },
            { en: "They enjoy it", ar: "يستمتعون" },
            { en: "They sleep", ar: "ينامون" },
            ],
            correctIndex: 0,
            explanation: { en: "They are returned every time.", ar: "يُعادون كلّ مرّة." },
          },
          {
            question: { en: "What motivates believers to worship?", ar: "ما يحفّز المؤمنين للعبادة؟" },
            options: [
            { en: "Hidden rewards from Allah", ar: "ثواب مخفيّ من الله" },
            { en: "Money", ar: "المال" },
            { en: "Fame", ar: "الشهرة" },
            { en: "Social pressure", ar: "ضغط اجتماعي" },
            ],
            correctIndex: 0,
            explanation: { en: "The unseen reward prepared by Allah.", ar: "الثواب المخفيّ الذي أعدّه الله." },
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
        title: { en: "Qualities of Believers — As-Sajdah", ar: "صفات المؤمنين — السجدة" },
        url: "https://www.youtube.com/watch?v=YfHSMPjOpE8",
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
        code: "BELIEV01",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Qualities of Believers and Their Reward (As-Sajdah 13-22)", ar: "ورقة عمل — صِفاتُ المُؤمِنينَ وجَزاؤُهُم (السجدة ١٣-٢٢)" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Qualities of Believers and Their Reward (As-Sajdah 13-22)", ar: "ورقة عمل — صِفاتُ المُؤمِنينَ وجَزاؤُهُم (السجدة ١٣-٢٢)" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "What do believers forsake at night?", ar: "ماذا يترك المؤمنون ليلًا؟" },
                options: [
                { en: "Their beds to pray", ar: "فُرُشهم للصلاة" },
                { en: "Food", ar: "الطعام" },
                { en: "Family", ar: "العائلة" },
                { en: "Work", ar: "العمل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Are believers and wrongdoers equal?", ar: "هل المؤمنون والفاسقون سواء؟" },
                options: [
                { en: "No", ar: "لا" },
                { en: "Yes", ar: "نعم" },
                { en: "Sometimes", ar: "أحيانًا" },
                { en: "It depends", ar: "يعتمد" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "What is hidden for believers?", ar: "ما المخفيّ للمؤمنين؟" },
                options: [
                { en: "Comfort for eyes", ar: "قرّة أعين" },
                { en: "Gold", ar: "ذهب" },
                { en: "Cars", ar: "سيّارات" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Where do wrongdoers go?", ar: "أين الفاسقون؟" },
                options: [
                { en: "The Fire", ar: "النار" },
                { en: "Jannah", ar: "الجنّة" },
                { en: "Home", ar: "البيت" },
                { en: "School", ar: "المدرسة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Does charity decrease wealth?", ar: "هل الصدقة تنقص المال؟" },
                options: [
                { en: "No", ar: "لا" },
                { en: "Yes", ar: "نعم" },
                { en: "Maybe", ar: "ربّما" },
                { en: "Only sometimes", ar: "أحيانًا" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Believers pray at night.", ar: "المؤمنون يصلّون الليل." }, answer: true },
              { statement: { en: "Believers and wrongdoers are equal.", ar: "المؤمنون والفاسقون سواء." }, answer: false },
              { statement: { en: "The hidden reward is beyond imagination.", ar: "الثواب المخفيّ فوق التصوّر." }, answer: true },
              { statement: { en: "Wrongdoers can easily leave the Fire.", ar: "الفاسقون يخرجون من النار بسهولة." }, answer: false },
              { statement: { en: "Spending from what Allah provides is a quality of believers.", ar: "الإنفاق ممّا رزق الله صفة مؤمنين." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Qiyam al-Layl", ar: "قيام الليل" }, answer: { en: "Night prayer", ar: "صلاة الليل" } },
              { prompt: { en: "Jannah", ar: "الجنّة" }, answer: { en: "Paradise for believers", ar: "جنّة المؤمنين" } },
              { prompt: { en: "Taqwa", ar: "التقوى" }, answer: { en: "God-consciousness", ar: "الوعي بالله" } },
              { prompt: { en: "Infaq", ar: "الإنفاق" }, answer: { en: "Charitable spending", ar: "الإنفاق في سبيل الله" } },
              { prompt: { en: "Nar", ar: "النار" }, answer: { en: "Fire for wrongdoers", ar: "نار الفاسقين" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'They forsake their _______ to call upon their Lord.\'", ar: "﴿تتجافى جنوبهم عن _______﴾" }, blankAnswer: { en: "beds", ar: "المضاجع" } },
              { sentence: { en: "Believers and wrongdoers are not _______.", ar: "المؤمنون والفاسقون لا _______." }, blankAnswer: { en: "equal", ar: "يستوون" } },
              { sentence: { en: "\'No soul knows what has been _______ for them.\'", ar: "﴿فلا تعلم نفس ما _______ لهم﴾" }, blankAnswer: { en: "hidden", ar: "أُخفي" } },
              { sentence: { en: "They call upon their Lord in fear and _______.", ar: "يدعون ربّهم خوفًا و_______." }, blankAnswer: { en: "hope", ar: "طمعًا" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Believe in Allah and His signs", ar: "الإيمان بالله وآياته" },
              { en: "Forsake beds for night prayer", ar: "ترك المضاجع لقيام الليل" },
              { en: "Call upon Allah with fear and hope", ar: "دعاء الله خوفًا وطمعًا" },
              { en: "Spend from what Allah provides", ar: "الإنفاق ممّا رزق الله" },
              { en: "Receive hidden rewards of Jannah", ar: "نيل ثواب الجنّة المخفيّ" },
              { en: "Be distinguished from wrongdoers", ar: "التميّز عن الفاسقين" },
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
