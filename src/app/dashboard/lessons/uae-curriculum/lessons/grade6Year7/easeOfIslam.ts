import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const easeOfIslam: CourseLesson = {
  slug: "g6y7-the-ease-of-islam",
  name: { en: "The Ease of Islam", ar: "يُسرُ الإسلام" },
  shortIntro: {
    en: "\'Allah intends ease for you, not hardship.\' A deep study of the principle of yusr (ease) in Islam — the concessions (rukhas) in worship, the removal of hardship, and the balance between ease and discipline, without distorting the religion.",
    ar: "﴿يُريدُ اللهُ بِكُمُ اليُسرَ ولا يُريدُ بِكُمُ العُسرَ﴾. دِراسةٌ عَميقةٌ لِمَبدأِ اليُسرِ في الإسلام — الرُّخَصِ في العِبادة، ورَفعِ الحَرَج، والتَّوازُنِ بَينَ اليُسرِ والانضِباط، دونَ تَحريفِ الدّين.",
  },
  quranSurahs: ["Al-Baqarah 185", "Al-Hajj 78", "Al-Baqarah 286"],
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
        title: { en: "Is Islam too strict?", ar: "هل الإسلام صارم جدًّا؟" },
        body: {
          en: "A student says: \'Islam has too many rules. Pray 5 times, fast a month, no music, no fun. It is designed to make life hard. Other ways of life are much easier and freer.\'",
          ar: "طالب يقول: «الإسلام فيه قواعد كثيرة. صلّ ٥ مرّات وصُم شهرًا ولا موسيقى ولا مرح. صُمّم ليصعّب الحياة. طرق أخرى أسهل وأحرّ.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran on the ease built into Islam.",
          ar: "انتقد بالقرآن عن اليُسر في الإسلام.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Allah intends for you ease and does not intend for you hardship.\' (Al-Baqara 185)",
        ar: "﴿يريد الله بكم اليُسر ولا يريد بكم العُسر﴾ (البقرة ١٨٥)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Yusr (Ease)", ar: "يُسر" } },
          { image: IMG.grandMosque, keyword: { en: "Rukhsah (Concession)", ar: "رخصة" } },
          { image: IMG.lantern, keyword: { en: "Taysir (Facilitation)", ar: "تيسير" } },
          { image: IMG.skyBlue, keyword: { en: "Rahma (Mercy)", ar: "رحمة" } },
          { image: IMG.bookshelf, keyword: { en: "Wasatiyyah (Moderation)", ar: "وسطيّة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Allah does not burden a soul beyond that it can bear.\' (Al-Baqara 286)",
        ar: "﴿لا يكلّف الله نفسًا إلّا وسعها﴾ (البقرة ٢٨٦)",
      },
    },
    {
      title: { en: "The Ease of Islam", ar: "يُسرُ الإسلام" },
      learningObjectives: [
        { en: "Explain the principle of ease (yusr) in Islamic law.", ar: "أشرح مبدأ اليُسر في الشريعة الإسلاميّة." },
        { en: "Identify examples of rukhsah (concessions) in worship.", ar: "أحدّد أمثلة الرُخص في العبادة." },
      ],
      successCriteria: [
        { en: "I can explain yusr in Islam.", ar: "أشرح اليُسر في الإسلام." },
        { en: "I can list 5 Islamic concessions.", ar: "أذكر ٥ رخص إسلاميّة." },
        { en: "I can demonstrate how Islam balances obligations with ease.", ar: "أبيّن كيف يوازن الإسلام بين الواجبات واليُسر." },
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
      title: { en: "The Ease of Islam — Yusr and Rukhsah", ar: "يُسر الإسلام — اليُسر والرُخص" },
      learningObjectives: [
        { en: "Understand that ease is a core principle of Islamic legislation.", ar: "أفهم أنّ اليُسر مبدأ أساسي في التشريع الإسلامي." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "The Principle of Ease", ar: "مبدأ اليُسر" },
          lines: [
            { en: "Al-Baqara 185: \'Allah intends ease.\' Al-Baqara 286: \'No soul burdened beyond capacity.\' Ash-Sharh 5-6: \'With hardship comes ease.\' Islam is designed for all people, all times, all places.", ar: "البقرة ١٨٥: ﴿يريد الله بكم اليُسر﴾. البقرة ٢٨٦: ﴿لا يكلّف الله نفسًا إلّا وسعها﴾. الشرح ٥-٦: ﴿إنّ مع العُسر يسرًا﴾. الإسلام مصمّم لكلّ الناس والأزمنة والأماكن." },
          ],
        },
        {
          label: { en: "Concessions (Rukhsah)", ar: "الرُخص" },
          lines: [
            { en: "Sick? Pray sitting. Travelling? Shorten/combine prayers. Ill during Ramadan? Fast later. Cannot find water? Do tayammum. Cannot stand? Pray lying down. Every hardship has a concession.", ar: "مريض؟ صلِّ جالسًا. مسافر؟ اقصر/اجمع. مريض في رمضان؟ أفطر وصم لاحقًا. لا ماء؟ تيمّم. لكلّ مشقّة رخصة." },
          ],
        },
        {
          label: { en: "Moderation (Wasatiyyah)", ar: "الوسطيّة" },
          lines: [
            { en: "\'We have made you a moderate nation.\' (Al-Baqara 143). Islam avoids extremes — neither too strict nor too lax. Balance between worship and life.", ar: "﴿جعلناكم أمّة وسطًا﴾ (البقرة ١٤٣). الإسلام يتجنّب التطرّف — لا إفراط ولا تفريط. توازن بين العبادة والحياة." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Allah intends ease for us.", ar: "الله يريد بنا اليُسر." }, answer: true },
        { statement: { en: "Islam is designed to be hard.", ar: "الإسلام مصمّم ليكون صعبًا." }, answer: false },
        { statement: { en: "Sick people can pray sitting.", ar: "المريض يصلّي جالسًا." }, answer: true },
        { statement: { en: "There are no concessions in Islam.", ar: "لا رخص في الإسلام." }, answer: false },
        { statement: { en: "Islam is a moderate religion.", ar: "الإسلام دين وسط." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Allah intends for you _______.", ar: "﴿يريد الله بكم _______.﴾" }, answer: { en: "ease", ar: "اليُسر" } },
        { sentence: { en: "\'No soul burdened beyond its _______.", ar: "﴿لا يكلّف الله نفسًا إلّا _______.﴾" }, answer: { en: "capacity", ar: "وسعها" } },
        { sentence: { en: "\'With hardship comes _______.", ar: "﴿إنّ مع العُسر _______.﴾" }, answer: { en: "ease", ar: "يسرًا" } },
        { sentence: { en: "\'We made you a _______ nation.\'", ar: "﴿جعلناكم أمّة _______.﴾" }, answer: { en: "moderate", ar: "وسطًا" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Ease is Islam\'s core — concessions for the sick, traveller, elderly. No soul is burdened beyond capacity.",
        ar: "اليُسر جوهر الإسلام — رخص للمريض والمسافر والكبير. لا يُكلّف الله نفسًا إلّا وسعها.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the ease of Islam from different angles.", ar: "استكشف يُسر الإسلام من زوايا مختلفة." },
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
            title: { en: "Ease in the Quran", ar: "اليُسر في القرآن" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Verses on ease", ar: "آيات اليُسر" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Baqara 185, 286. Ash-Sharh 5-6. Al-Hajj 78: \'He has not placed upon you any hardship.\'", ar: "البقرة ١٨٥ و٢٨٦. الشرح ٥-٦. الحجّ ٧٨: ﴿وما جعل عليكم في الدين من حرج﴾" } },
              { label: { en: "Principle", ar: "مبدأ" }, content: { en: "Ease is repeated throughout the Quran — not just once.", ar: "اليُسر يتكرّر في القرآن — ليس مرّة واحدة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Allah designed Islam to be livable and joyful.", ar: "الله صمّم الإسلام ليكون قابلًا للعيش ومفرحًا." } },
            ],
            task: {
              title: { en: "Collect Ease Verses", ar: "اجمع آيات اليُسر" },
              description: { en: "Find 5 Quran verses about ease in Islam.", ar: "أوجد ٥ آيات عن اليُسر في الإسلام." },
              hint: { en: "Include: verse, context, modern relevance.", ar: "ضمّن: الآية والسياق والصلة المعاصرة." },
            },
          },
          {
            id: "B",
            title: { en: "Concessions in Worship", ar: "رُخص العبادة" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Prayer, fasting, wudu", ar: "الصلاة والصيام والوضوء" },
            infoSections: [
              { label: { en: "Examples", ar: "أمثلة" }, content: { en: "Sick: pray sitting/lying. Travel: shorten prayers. Ramadan: fast later. No water: tayammum. Cold: wipe over socks.", ar: "مريض: صلِّ جالسًا. سفر: اقصر. رمضان: صم لاحقًا. لا ماء: تيمّم. برد: امسح على الخفّ." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Make things easy, do not make them hard.\' (Bukhari)", ar: "«يسّروا ولا تعسّروا.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every rule has built-in flexibility.", ar: "كلّ حكم فيه مرونة." } },
            ],
            task: {
              title: { en: "List All Concessions", ar: "اذكر كلّ الرخص" },
              description: { en: "Create a table of Islamic concessions.", ar: "أنشئ جدولًا للرُخص الإسلاميّة." },
              hint: { en: "Include: situation, normal rule, concession, evidence.", ar: "ضمّن: الموقف والحكم العادي والرخصة والدليل." },
            },
          },
          {
            id: "C",
            title: { en: "Moderation", ar: "الوسطيّة" },
            image: IMG.bookshelf,
            color: "purple",
            topic: { en: "No extremes", ar: "لا تطرّف" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Baqara 143: \'A moderate nation.\'", ar: "البقرة ١٤٣: ﴿أمّة وسطًا﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Beware of extremism — those before you were destroyed by it.\' (Ahmad)", ar: "«إيّاكم والغلوّ فإنّما هلك من قبلكم بالغلوّ.» (أحمد)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Balance is the key to sustainable worship.", ar: "التوازن مفتاح العبادة المستدامة." } },
            ],
            task: {
              title: { en: "Define Moderation", ar: "عرّف الوسطيّة" },
              description: { en: "Explain wasatiyyah with examples from daily life.", ar: "اشرح الوسطيّة بأمثلة من الحياة اليوميّة." },
              hint: { en: "Include: worship, study, rest, socialising.", ar: "ضمّن: العبادة والدراسة والراحة والاجتماع." },
            },
          },
          {
            id: "D",
            title: { en: "Ease in the Prophet\'s Life", ar: "اليُسر في حياة النبيّ" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "He chose the easier option", ar: "اختار الأيسر" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Whenever the Prophet was given a choice between two matters, he chose the easier one — as long as it was not sinful.\' (Bukhari)", ar: "«ما خُيّر النبيّ بين أمرين إلّا اختار أيسرهما ما لم يكن إثمًا.» (البخاري)" } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "He allowed sitting prayer, short sermons, gentle corrections.", ar: "أجاز الصلاة جالسًا والخطب القصيرة والتصحيح اللطيف." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The Prophet modelled ease, not severity.", ar: "النبيّ نمذج اليُسر لا الشدّة." } },
            ],
            task: {
              title: { en: "List Prophet\'s Easy Choices", ar: "اذكر اختيارات النبيّ الميسّرة" },
              description: { en: "Find 5 examples where the Prophet chose ease.", ar: "أوجد ٥ أمثلة اختار فيها النبيّ اليُسر." },
              hint: { en: "Include: the situation, the choice, the hadith.", ar: "ضمّن: الموقف والاختيار والحديث." },
            },
          },
          {
            id: "E",
            title: { en: "Islam vs Other Systems", ar: "الإسلام مقارنة بالأنظمة" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Why Islam is balanced", ar: "لماذا الإسلام متوازن" },
            infoSections: [
              { label: { en: "Comparison", ar: "مقارنة" }, content: { en: "Islam balances spiritual and material life. Prayer takes 5 minutes. Fasting is one month. Zakat is 2.5%. Hajj is once. All manageable.", ar: "الإسلام يوازن بين الروحي والمادّي. الصلاة ٥ دقائق. الصيام شهر. الزكاة ٢.٥٪. الحجّ مرّة. كلّها ممكنة." } },
              { label: { en: "Logic", ar: "منطق" }, content: { en: "Rules protect, not restrict. Like traffic lights keep everyone safe.", ar: "القواعد تحمي لا تقيّد. كإشارات المرور تحفظ الجميع." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Islam\'s rules are for your benefit.", ar: "قواعد الإسلام لمصلحتك." } },
            ],
            task: {
              title: { en: "Compare Islam\'s Balance", ar: "قارن توازن الإسلام" },
              description: { en: "Show how Islam balances obligations and ease.", ar: "بيّن كيف يوازن الإسلام بين الواجبات واليُسر." },
              hint: { en: "Include: obligation, time/effort, concession, purpose.", ar: "ضمّن: الواجب والوقت والرخصة والهدف." },
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
            question: { en: "Allah intends?", ar: "الله يريد؟" },
            options: [
            { en: "Ease", ar: "اليُسر" },
            { en: "Hardship", ar: "العُسر" },
            { en: "Punishment", ar: "العقاب" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Ease.", ar: "اليُسر." },
          },
          {
            question: { en: "No soul burdened beyond?", ar: "لا يكلّف الله نفسًا إلّا؟" },
            options: [
            { en: "Its capacity", ar: "وسعها" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Everything", ar: "كلّ شيء" },
            { en: "Twice", ar: "الضعف" },
            ],
            correctIndex: 0,
            explanation: { en: "Its capacity.", ar: "وسعها." },
          },
          {
            question: { en: "With hardship comes?", ar: "مع العُسر يأتي؟" },
            options: [
            { en: "Ease", ar: "يُسر" },
            { en: "More hardship", ar: "مزيد عُسر" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Confusion", ar: "حيرة" },
            ],
            correctIndex: 0,
            explanation: { en: "Ease.", ar: "يُسر." },
          },
          {
            question: { en: "Sick person can?", ar: "المريض يمكنه؟" },
            options: [
            { en: "Pray sitting", ar: "الصلاة جالسًا" },
            { en: "Skip everything", ar: "ترك كلّ شيء" },
            { en: "Give up", ar: "الاستسلام" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Pray sitting.", ar: "الصلاة جالسًا." },
          },
          {
            question: { en: "Prophet chose?", ar: "النبيّ اختار؟" },
            options: [
            { en: "The easier option", ar: "الأيسر" },
            { en: "The hardest", ar: "الأصعب" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Random", ar: "عشوائيًّا" },
            ],
            correctIndex: 0,
            explanation: { en: "The easier (non-sinful) option.", ar: "الأيسر (ما لم يكن إثمًا)." },
          },
          {
            question: { en: "Islam is?", ar: "الإسلام؟" },
            options: [
            { en: "Moderate", ar: "وسط" },
            { en: "Extreme", ar: "متطرّف" },
            { en: "Easy to abuse", ar: "سهل الاستغلال" },
            { en: "Hard", ar: "صعب" },
            ],
            correctIndex: 0,
            explanation: { en: "Moderate.", ar: "وسط." },
          },
          {
            question: { en: "Tayammum is for?", ar: "التيمّم ل؟" },
            options: [
            { en: "No water available", ar: "عدم توفّر الماء" },
            { en: "Fun", ar: "المرح" },
            { en: "Exercise", ar: "التمرين" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "When water is not available.", ar: "عند عدم توفّر الماء." },
          },
          {
            question: { en: "\'Make things?\'", ar: "«يسّروا ولا؟»" },
            options: [
            { en: "Easy, not hard", ar: "تعسّروا" },
            { en: "Hard", ar: "سهّلوا" },
            { en: "Complex", ar: "عقّدوا" },
            { en: "Boring", ar: "مملّوا" },
            ],
            correctIndex: 0,
            explanation: { en: "Easy, not hard.", ar: "ولا تعسّروا." },
          },
          {
            question: { en: "Zakat percentage?", ar: "نسبة الزكاة؟" },
            options: [
            { en: "2.5%", ar: "٢.٥٪" },
            { en: "50%", ar: "٥٠٪" },
            { en: "100%", ar: "١٠٠٪" },
            { en: "0%", ar: "٠٪" },
            ],
            correctIndex: 0,
            explanation: { en: "2.5%.", ar: "٢.٥٪." },
          },
          {
            question: { en: "Rules are like?", ar: "القواعد مثل؟" },
            options: [
            { en: "Traffic lights — protect", ar: "إشارات المرور — تحمي" },
            { en: "Chains", ar: "قيود" },
            { en: "Punishments", ar: "عقوبات" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Traffic lights — they protect.", ar: "إشارات المرور — تحمي." },
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
        title: { en: "Ease of Islam", ar: "يُسر الإسلام" },
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
        code: "EASEI001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Ease of Islam", ar: "ورقة عمل — يُسرُ الإسلام" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Ease of Islam", ar: "ورقة عمل — يُسرُ الإسلام" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Allah intends?", ar: "الله يريد؟" },
                options: [
                { en: "Ease", ar: "اليُسر" },
                { en: "Hardship", ar: "العُسر" },
                { en: "Pain", ar: "الألم" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Soul burdened beyond?", ar: "نفسًا إلّا؟" },
                options: [
                { en: "Capacity", ar: "وسعها" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Everything", ar: "كلّ شيء" },
                { en: "Twice", ar: "الضعف" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Sick pray?", ar: "المريض يصلّي؟" },
                options: [
                { en: "Sitting", ar: "جالسًا" },
                { en: "Cannot pray", ar: "لا يصلّي" },
                { en: "Running", ar: "راكضًا" },
                { en: "Dancing", ar: "راقصًا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Islam is?", ar: "الإسلام؟" },
                options: [
                { en: "Moderate", ar: "وسط" },
                { en: "Extreme", ar: "متطرّف" },
                { en: "Harsh", ar: "قاسٍ" },
                { en: "Impossible", ar: "مستحيل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "With hardship?", ar: "مع العُسر؟" },
                options: [
                { en: "Ease", ar: "يُسر" },
                { en: "More hardship", ar: "عُسر" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Pain", ar: "ألم" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Allah intends ease.", ar: "الله يريد اليُسر." }, answer: true },
              { statement: { en: "Islam is too hard.", ar: "الإسلام صعب جدًّا." }, answer: false },
              { statement: { en: "Concessions exist for hardship.", ar: "الرُخص موجودة للمشقّة." }, answer: true },
              { statement: { en: "No flexibility in worship.", ar: "لا مرونة في العبادة." }, answer: false },
              { statement: { en: "Islam is moderate.", ar: "الإسلام وسط." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Yusr", ar: "يُسر" }, answer: { en: "Ease", ar: "السهولة" } },
              { prompt: { en: "Rukhsah", ar: "رخصة" }, answer: { en: "Concession", ar: "الرخصة" } },
              { prompt: { en: "Wasatiyyah", ar: "وسطيّة" }, answer: { en: "Moderation", ar: "الاعتدال" } },
              { prompt: { en: "Taysir", ar: "تيسير" }, answer: { en: "Facilitation", ar: "التسهيل" } },
              { prompt: { en: "Tayammum", ar: "تيمّم" }, answer: { en: "Dry ablution", ar: "التيمّم" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Allah intends _______ for you.\'", ar: "﴿يريد الله بكم _______.﴾" }, blankAnswer: { en: "ease", ar: "اليُسر" } },
              { sentence: { en: "\'No soul burdened beyond _______.", ar: "﴿لا يكلّف الله نفسًا إلّا _______.﴾" }, blankAnswer: { en: "capacity", ar: "وسعها" } },
              { sentence: { en: "\'With hardship comes _______.", ar: "﴿إنّ مع العُسر _______.﴾" }, blankAnswer: { en: "ease", ar: "يسرًا" } },
              { sentence: { en: "Islam is a _______ religion.", ar: "الإسلام دين _______." }, blankAnswer: { en: "moderate", ar: "وسط" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Receive Islamic obligations", ar: "تلقّ الواجبات الإسلاميّة" },
              { en: "Discover built-in concessions", ar: "اكتشف الرُخص المدمجة" },
              { en: "Understand moderation (wasatiyyah)", ar: "افهم الوسطيّة" },
              { en: "Apply concessions when needed", ar: "طبّق الرُخص عند الحاجة" },
              { en: "Balance worship with daily life", ar: "وازن بين العبادة والحياة" },
              { en: "Appreciate Islam\'s wisdom and mercy", ar: "قدّر حكمة الإسلام ورحمته" },
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
