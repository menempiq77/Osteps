import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const etiquetteOfTheMosque: CourseLesson = {
  slug: "g6y7-etiquette-of-the-mosque",
  name: { en: "Etiquette of the Mosque", ar: "آدابُ المَسجِد" },
  shortIntro: {
    en: "Why the mosque is \'the most beloved of places to Allah\', the adab of entering, sitting, and leaving, the reward of those \'whose hearts are attached to the mosque\', and how the masjid built a community — not just a building.",
    ar: "لِماذا المَسجِدُ «أحَبُّ البِقاعِ إلى الله»، وآدابُ الدُّخولِ والجُلوسِ والخُروج، وأجرُ مَن «قَلبُهُ مُعَلَّقٌ بِالمَساجِد»، وكَيفَ بَنى المَسجِدُ أُمّةً لا مَبنًى فَحَسب.",
  },
  quranSurahs: ["At-Tawbah 18", "An-Nur 36-37", "Al-A'raf 31"],
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
        title: { en: "Is going to the mosque just about praying?", ar: "هل الذهاب للمسجد مجرّد صلاة؟" },
        body: {
          en: "A student says: \'The mosque is just a building. I can pray at home. There is no need for special manners — just walk in, pray, and leave. Being loud or eating inside is no big deal.\'",
          ar: "طالب يقول: «المسجد مجرّد مبنى. أصلّي في البيت. لا حاجة لآداب خاصّة — ادخل وصلِّ واخرج. الصوت العالي أو الأكل فيه ليس مشكلة.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on the sanctity and etiquette of mosques.",
          ar: "انتقد بالقرآن والحديث عن حرمة المساجد وآدابها.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'The mosques are for Allah, so do not invoke with Allah anyone else.\' (Al-Jinn 18)",
        ar: "﴿وأنّ المساجد لله فلا تدعوا مع الله أحدًا﴾ (الجنّ ١٨)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Masjid (Mosque)", ar: "مسجد" } },
          { image: IMG.childQuran, keyword: { en: "Adab (Etiquette)", ar: "أدب" } },
          { image: IMG.lantern, keyword: { en: "Salah (Prayer)", ar: "صلاة" } },
          { image: IMG.skyBlue, keyword: { en: "Ihsan (Excellence)", ar: "إحسان" } },
          { image: IMG.bookshelf, keyword: { en: "Jama\'ah (Congregation)", ar: "جماعة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'The most beloved places to Allah are the mosques.\' (Muslim)",
        ar: "«أحبّ البقاع إلى الله المساجد.» (مسلم)",
      },
    },
    {
      title: { en: "Etiquette of the Mosque", ar: "آدابُ المَسجِد" },
      learningObjectives: [
        { en: "Explain the Islamic etiquette of entering, sitting in, and leaving the mosque.", ar: "أشرح آداب دخول المسجد والجلوس فيه والخروج منه." },
        { en: "Identify the rewards and virtues of attending the mosque.", ar: "أحدّد ثواب وفضائل حضور المسجد." },
      ],
      successCriteria: [
        { en: "I can list 5 etiquettes of the mosque.", ar: "أذكر ٥ آداب للمسجد." },
        { en: "I can explain the reward of walking to the mosque.", ar: "أشرح ثواب المشي إلى المسجد." },
        { en: "I can describe the dua for entering and leaving.", ar: "أصف دعاء الدخول والخروج." },
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
      title: { en: "Etiquette of the Mosque", ar: "آداب المسجد" },
      learningObjectives: [
        { en: "Master the etiquettes and virtues of attending the mosque.", ar: "أتقن آداب وفضائل حضور المسجد." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Entering the Mosque", ar: "دخول المسجد" },
          lines: [
            { en: "Enter with right foot. Say: \'Bismillah, Allahumma iftah li abwaba rahmatik\' (O Allah, open for me the gates of Your mercy). Pray 2 raka\'at tahiyyat al-masjid before sitting.", ar: "ادخل بالرجل اليمنى. قل: «بسم الله اللهمّ افتح لي أبواب رحمتك.» صلِّ ركعتي تحيّة المسجد قبل الجلوس." },
          ],
        },
        {
          label: { en: "Inside the Mosque", ar: "داخل المسجد" },
          lines: [
            { en: "Do not speak loudly. Do not buy or sell. Do not eat strong-smelling foods (garlic, onion) before coming. Keep it clean. Engage in dhikr, Quran, or prayer. Sit facing qiblah if possible.", ar: "لا ترفع صوتك. لا تبع ولا تشترِ. لا تأكل الثوم والبصل قبل المجيء. حافظ على النظافة. اشتغل بالذكر والقرآن والصلاة." },
          ],
        },
        {
          label: { en: "Leaving the Mosque", ar: "الخروج من المسجد" },
          lines: [
            { en: "Exit with left foot. Say: \'Bismillah, Allahumma inni as\'aluka min fadlik\' (O Allah, I ask You of Your bounty). Do not step over people. Do not rush.", ar: "اخرج بالرجل اليسرى. قل: «بسم الله اللهمّ إنّي أسألك من فضلك.» لا تتخطَّ الناس. لا تعجل." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Enter the mosque with the right foot.", ar: "ادخل المسجد بالرجل اليمنى." }, answer: true },
        { statement: { en: "It is fine to shout inside the mosque.", ar: "لا بأس بالصراخ في المسجد." }, answer: false },
        { statement: { en: "Tahiyyat al-masjid is 2 raka\'at.", ar: "تحيّة المسجد ركعتان." }, answer: true },
        { statement: { en: "Eating garlic before the mosque is encouraged.", ar: "أكل الثوم قبل المسجد مستحبّ." }, answer: false },
        { statement: { en: "The mosque is the most beloved place to Allah.", ar: "المسجد أحبّ البقاع إلى الله." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Enter with the _______ foot.", ar: "ادخل بالرجل _______." }, answer: { en: "right", ar: "اليمنى" } },
        { sentence: { en: "\'The most beloved places to Allah are the _______.", ar: "«أحبّ البقاع إلى الله _______.»" }, answer: { en: "mosques", ar: "المساجد" } },
        { sentence: { en: "Pray _______ raka\'at before sitting.", ar: "صلِّ _______ ركعتين قبل الجلوس." }, answer: { en: "two", ar: "ركعتي" } },
        { sentence: { en: "Exit with the _______ foot.", ar: "اخرج بالرجل _______." }, answer: { en: "left", ar: "اليسرى" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "The mosque is the most beloved place to Allah — enter with adab, pray tahiyyat al-masjid, and leave with dua.",
        ar: "المسجد أحبّ البقاع إلى الله — ادخل بأدب وصلِّ التحيّة واخرج بدعاء.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore mosque etiquette from different angles.", ar: "استكشف آداب المسجد من زوايا مختلفة." },
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
            title: { en: "Entering Etiquette", ar: "آداب الدخول" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "Right foot, dua, tahiyyah", ar: "اليمنى والدعاء والتحيّة" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'When you enter the mosque, say: O Allah open for me the gates of Your mercy.\' (Muslim)", ar: "«إذا دخل أحدكم المسجد فليقل اللهمّ افتح لي أبواب رحمتك.» (مسلم)" } },
              { label: { en: "Action", ar: "عمل" }, content: { en: "Enter right foot first, pray 2 raka\'at before sitting.", ar: "ادخل باليمنى وصلِّ ركعتين قبل الجلوس." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Entering with etiquette shows respect for Allah\'s house.", ar: "الدخول بأدب يُظهر احترام بيت الله." } },
            ],
            task: {
              title: { en: "Create Entry Guide", ar: "أنشئ دليل دخول" },
              description: { en: "Design a visual step-by-step entry guide.", ar: "صمّم دليلًا بصريًّا خطوة بخطوة." },
              hint: { en: "Include: dua, foot, tahiyyah, evidence.", ar: "ضمّن: الدعاء والقدم والتحيّة والدليل." },
            },
          },
          {
            id: "B",
            title: { en: "Inside Manners", ar: "آداب الداخل" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "How to behave inside", ar: "كيف تتصرّف في الداخل" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Whoever eats garlic or onion, let him stay away from our mosque.\' (Bukhari)", ar: "«من أكل ثومًا أو بصلًا فليعتزل مسجدنا.» (البخاري)" } },
              { label: { en: "Rules", ar: "قواعد" }, content: { en: "No loud talking, no buying/selling, keep clean, recite Quran.", ar: "لا صوت عالٍ ولا بيع ولا شراء والنظافة والقرآن." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The mosque is sacred space for worship.", ar: "المسجد مكان مقدّس للعبادة." } },
            ],
            task: {
              title: { en: "List Inside Rules", ar: "اذكر قواعد الداخل" },
              description: { en: "Write 10 dos and don\'ts inside the mosque.", ar: "اكتب ١٠ أشياء افعل ولا تفعل في المسجد." },
              hint: { en: "Include: hadith evidence for each rule.", ar: "ضمّن: حديث لكلّ قاعدة." },
            },
          },
          {
            id: "C",
            title: { en: "Leaving Etiquette", ar: "آداب الخروج" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Left foot, dua", ar: "اليسرى والدعاء" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'When you leave, say: O Allah I ask You of Your bounty.\' (Muslim)", ar: "«إذا خرج فليقل اللهمّ إنّي أسألك من فضلك.» (مسلم)" } },
              { label: { en: "Action", ar: "عمل" }, content: { en: "Exit left foot first, don\'t step over people, don\'t rush.", ar: "اخرج باليسرى ولا تتخطَّ ولا تعجل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Even leaving has its own respectful manner.", ar: "حتّى الخروج له أدبه." } },
            ],
            task: {
              title: { en: "Create Exit Guide", ar: "أنشئ دليل خروج" },
              description: { en: "Design a leaving guide with dua and steps.", ar: "صمّم دليل خروج بالدعاء والخطوات." },
              hint: { en: "Include: dua text, foot, manners, evidence.", ar: "ضمّن: نصّ الدعاء والقدم والآداب والدليل." },
            },
          },
          {
            id: "D",
            title: { en: "Rewards of the Mosque", ar: "ثواب المسجد" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Why go to the mosque?", ar: "لماذا نذهب للمسجد؟" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Whoever walks to the mosque, for every step Allah raises him a degree and erases a sin.\' (Muslim)", ar: "«من مشى إلى المسجد رفعه الله درجة وحطّ عنه خطيئة.» (مسلم)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Seven shaded by Allah\'s Throne... a person whose heart is attached to the mosque.\' (Bukhari)", ar: "«سبعة يظلّهم الله... ورجل قلبه معلّق بالمساجد.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every step to the mosque earns immense reward.", ar: "كلّ خطوة للمسجد تكسب ثوابًا عظيمًا." } },
            ],
            task: {
              title: { en: "Calculate Rewards", ar: "احسب الثواب" },
              description: { en: "Calculate how many rewards you earn walking to the mosque daily.", ar: "احسب كم ثوابًا تكسبه بالمشي للمسجد يوميًّا." },
              hint: { en: "Include: distance, steps, hadith, annual total.", ar: "ضمّن: المسافة والخطوات والحديث والمجموع السنوي." },
            },
          },
          {
            id: "E",
            title: { en: "My Mosque Plan", ar: "خطّتي للمسجد" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Personal commitment", ar: "التزام شخصي" },
            infoSections: [
              { label: { en: "Action", ar: "عمل" }, content: { en: "Go to the mosque regularly, learn all duas, follow all etiquettes.", ar: "اذهب للمسجد بانتظام وتعلّم كلّ الأدعية واتّبع كلّ الآداب." } },
              { label: { en: "Goal", ar: "هدف" }, content: { en: "Make the mosque part of your daily life — not just Friday.", ar: "اجعل المسجد جزءًا من حياتك اليوميّة — ليس الجمعة فقط." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Regular attendance strengthens faith and community.", ar: "الحضور المنتظم يقوّي الإيمان والمجتمع." } },
            ],
            task: {
              title: { en: "Write Your Mosque Commitment", ar: "اكتب التزامك بالمسجد" },
              description: { en: "Create a weekly mosque attendance plan.", ar: "أنشئ خطّة حضور أسبوعيّة للمسجد." },
              hint: { en: "Include: which prayers, which etiquettes to practice, dua goals.", ar: "ضمّن: أيّ الصلوات وأيّ الآداب وأهداف الدعاء." },
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
            question: { en: "Most beloved places to Allah?", ar: "أحبّ البقاع إلى الله؟" },
            options: [
            { en: "Mosques", ar: "المساجد" },
            { en: "Markets", ar: "الأسواق" },
            { en: "Schools", ar: "المدارس" },
            { en: "Homes", ar: "البيوت" },
            ],
            correctIndex: 0,
            explanation: { en: "Mosques.", ar: "المساجد." },
          },
          {
            question: { en: "Enter mosque with?", ar: "ادخل المسجد ب؟" },
            options: [
            { en: "Right foot", ar: "اليمنى" },
            { en: "Left foot", ar: "اليسرى" },
            { en: "Both feet", ar: "القدمين" },
            { en: "Any foot", ar: "أيّ قدم" },
            ],
            correctIndex: 0,
            explanation: { en: "Right foot.", ar: "اليمنى." },
          },
          {
            question: { en: "Tahiyyat al-masjid is?", ar: "تحيّة المسجد؟" },
            options: [
            { en: "2 raka\'at", ar: "ركعتان" },
            { en: "1 raka\'ah", ar: "ركعة" },
            { en: "3 raka\'at", ar: "٣ ركعات" },
            { en: "None", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "2 raka\'at.", ar: "ركعتان." },
          },
          {
            question: { en: "Forbidden food before mosque?", ar: "طعام ممنوع قبل المسجد؟" },
            options: [
            { en: "Garlic and onion", ar: "الثوم والبصل" },
            { en: "Bread", ar: "الخبز" },
            { en: "Water", ar: "الماء" },
            { en: "Rice", ar: "الأرز" },
            ],
            correctIndex: 0,
            explanation: { en: "Garlic and onion.", ar: "الثوم والبصل." },
          },
          {
            question: { en: "Exit with?", ar: "اخرج ب؟" },
            options: [
            { en: "Left foot", ar: "اليسرى" },
            { en: "Right foot", ar: "اليمنى" },
            { en: "Both", ar: "القدمين" },
            { en: "Any", ar: "أيّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Left foot.", ar: "اليسرى." },
          },
          {
            question: { en: "Walking to mosque earns?", ar: "المشي للمسجد يكسب؟" },
            options: [
            { en: "A degree per step", ar: "درجة لكلّ خطوة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Only on Friday", ar: "الجمعة فقط" },
            { en: "Punishment", ar: "عقاب" },
            ],
            correctIndex: 0,
            explanation: { en: "A degree and sin erased per step.", ar: "درجة وحطّ خطيئة لكلّ خطوة." },
          },
          {
            question: { en: "Heart attached to mosque = ?", ar: "قلبه معلّق بالمسجد = ؟" },
            options: [
            { en: "Shaded by Allah\'s Throne", ar: "يظلّه الله" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Punishment", ar: "عقاب" },
            { en: "Loss", ar: "خسارة" },
            ],
            correctIndex: 0,
            explanation: { en: "One of seven shaded.", ar: "من السبعة الذين يظلّهم الله." },
          },
          {
            question: { en: "Inside mosque avoid?", ar: "في المسجد تجنّب؟" },
            options: [
            { en: "Loud talking and selling", ar: "الصوت العالي والبيع" },
            { en: "Praying", ar: "الصلاة" },
            { en: "Quran", ar: "القرآن" },
            { en: "Dhikr", ar: "الذكر" },
            ],
            correctIndex: 0,
            explanation: { en: "Loud talking and selling.", ar: "الصوت العالي والبيع." },
          },
          {
            question: { en: "Dua entering mosque?", ar: "دعاء دخول المسجد؟" },
            options: [
            { en: "Allahumma iftah li abwaba rahmatik", ar: "اللهمّ افتح لي أبواب رحمتك" },
            { en: "Allahumma ajirni minan-nar", ar: "اللهمّ أجرني من النار" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Any dua", ar: "أيّ دعاء" },
            ],
            correctIndex: 0,
            explanation: { en: "O Allah open for me gates of mercy.", ar: "اللهمّ افتح لي أبواب رحمتك." },
          },
          {
            question: { en: "Congregation prayer reward?", ar: "ثواب صلاة الجماعة؟" },
            options: [
            { en: "27 times more", ar: "٢٧ ضعفًا" },
            { en: "Same as alone", ar: "كالفرد" },
            { en: "Less", ar: "أقلّ" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "27 times more reward.", ar: "٢٧ ضعفًا." },
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
        title: { en: "Etiquette of the Mosque", ar: "آداب المسجد" },
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
        code: "MOSQU001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Etiquette of the Mosque", ar: "ورقة عمل — آدابُ المَسجِد" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Etiquette of the Mosque", ar: "ورقة عمل — آدابُ المَسجِد" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Enter with?", ar: "ادخل ب؟" },
                options: [
                { en: "Right foot", ar: "اليمنى" },
                { en: "Left", ar: "اليسرى" },
                { en: "Both", ar: "القدمين" },
                { en: "Any", ar: "أيّ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tahiyyah?", ar: "التحيّة؟" },
                options: [
                { en: "2 raka\'at", ar: "ركعتان" },
                { en: "1", ar: "واحدة" },
                { en: "3", ar: "٣" },
                { en: "None", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Most beloved place?", ar: "أحبّ مكان؟" },
                options: [
                { en: "Mosque", ar: "المسجد" },
                { en: "Market", ar: "السوق" },
                { en: "Home", ar: "البيت" },
                { en: "School", ar: "المدرسة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Exit with?", ar: "اخرج ب؟" },
                options: [
                { en: "Left foot", ar: "اليسرى" },
                { en: "Right", ar: "اليمنى" },
                { en: "Both", ar: "القدمين" },
                { en: "Any", ar: "أيّ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Garlic before mosque?", ar: "الثوم قبل المسجد؟" },
                options: [
                { en: "Forbidden", ar: "ممنوع" },
                { en: "Fine", ar: "عادي" },
                { en: "Required", ar: "مطلوب" },
                { en: "Rewarded", ar: "مُثاب" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Enter right foot.", ar: "ادخل باليمنى." }, answer: true },
              { statement: { en: "Shout in mosque is OK.", ar: "الصراخ في المسجد مقبول." }, answer: false },
              { statement: { en: "Tahiyyah is 2 raka\'at.", ar: "التحيّة ركعتان." }, answer: true },
              { statement: { en: "Eat garlic before mosque.", ar: "كل الثوم قبل المسجد." }, answer: false },
              { statement: { en: "Walking to mosque is rewarded.", ar: "المشي للمسجد مُثاب." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Masjid", ar: "مسجد" }, answer: { en: "Mosque", ar: "المسجد" } },
              { prompt: { en: "Tahiyyah", ar: "تحيّة" }, answer: { en: "Greeting prayer", ar: "صلاة التحيّة" } },
              { prompt: { en: "Adab", ar: "أدب" }, answer: { en: "Etiquette", ar: "الآداب" } },
              { prompt: { en: "Jama\'ah", ar: "جماعة" }, answer: { en: "Congregation", ar: "الجماعة" } },
              { prompt: { en: "Mihrab", ar: "محراب" }, answer: { en: "Prayer niche", ar: "المحراب" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Enter with _______ foot.", ar: "ادخل بالرجل _______." }, blankAnswer: { en: "right", ar: "اليمنى" } },
              { sentence: { en: "Most beloved places are _______.", ar: "أحبّ البقاع _______." }, blankAnswer: { en: "mosques", ar: "المساجد" } },
              { sentence: { en: "Tahiyyat al-masjid is _______ raka\'at.", ar: "تحيّة المسجد _______ ركعتان." }, blankAnswer: { en: "two", ar: "ركعتي" } },
              { sentence: { en: "Exit with _______ foot.", ar: "اخرج بالرجل _______." }, blankAnswer: { en: "left", ar: "اليسرى" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Arrive at the mosque", ar: "الوصول للمسجد" },
              { en: "Enter with right foot and dua", ar: "الدخول باليمنى والدعاء" },
              { en: "Pray tahiyyat al-masjid", ar: "صلاة تحيّة المسجد" },
              { en: "Follow inside etiquettes", ar: "اتّباع آداب الداخل" },
              { en: "Exit with left foot and dua", ar: "الخروج باليسرى والدعاء" },
              { en: "Make mosque attendance a habit", ar: "جعل حضور المسجد عادة" },
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
