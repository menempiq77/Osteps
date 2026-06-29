import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const signsOfTheHour: CourseLesson = {
  slug: "g6y7-from-the-signs-of-the-hour",
  name: { en: "From the Signs of the Hour", ar: "مِن عَلاماتِ السّاعة" },
  shortIntro: {
    en: "Belief in the Last Day is a pillar of faith. Allah has hidden the time of the Hour but told us of its signs. A careful study of the minor and major signs, the wisdom in believing in them, and how this belief shapes a serious, God-conscious life.",
    ar: "الإيمانُ بِاليَومِ الآخِرِ رُكنٌ مِن أركانِ الإيمان. أخفى اللهُ مَوعِدَ السّاعةِ وأخبَرَنا بِعَلاماتِها. دِراسةٌ مُتأنّيةٌ لِلعَلاماتِ الصُّغرى والكُبرى، والحِكمةِ في الإيمانِ بِها، وكَيفَ يَصوغُ هذا الإيمانُ حَياةً جادّةً تَقِيّة.",
  },
  quranSurahs: ["Muhammad 18", "Al-A'raf 187", "Luqman 34"],
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
        title: { en: "Should we fear the Day of Judgement?", ar: "هل يجب أن نخاف يوم القيامة؟" },
        body: {
          en: "A student says: \'The Day of Judgement will never come. These are just old stories to scare people. I do not need to worry about it — I will live my life however I want.\'",
          ar: "طالب يقول: «يوم القيامة لن يأتي أبدًا. هذه قصص قديمة لتخويف الناس. سأعيش حياتي كما أريد.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on the reality of the Hour.",
          ar: "انتقد بالقرآن والحديث عن حقيقة الساعة.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'The Hour is coming — there is no doubt about it.\' (Ghafir 59)",
        ar: "﴿إنّ الساعة لآتية لا ريب فيها﴾ (غافر ٥٩)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.skyBlue, keyword: { en: "As-Sa\'ah (The Hour)", ar: "الساعة" } },
          { image: IMG.mountainSnow, keyword: { en: "Ashrat (Signs)", ar: "أشراط" } },
          { image: IMG.childQuran, keyword: { en: "Yawm al-Qiyamah (Day)", ar: "يوم القيامة" } },
          { image: IMG.grandMosque, keyword: { en: "Akhirah (Hereafter)", ar: "آخرة" } },
          { image: IMG.lantern, keyword: { en: "Hisab (Account)", ar: "حساب" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'They ask you about the Hour: when is its arrival? Say: Its knowledge is only with my Lord.\' (Al-A\'raf 187)",
        ar: "﴿يسألونك عن الساعة أيّان مرساها قل إنّما علمها عند ربّي﴾ (الأعراف ١٨٧)",
      },
    },
    {
      title: { en: "From the Signs of the Hour", ar: "مِن عَلاماتِ السّاعة" },
      learningObjectives: [
        { en: "Identify the minor and major signs of the Hour.", ar: "أحدّد العلامات الصغرى والكبرى للساعة." },
        { en: "Explain why believing in the Day of Judgement is a pillar of faith.", ar: "أشرح لماذا الإيمان بيوم القيامة ركن إيماني." },
      ],
      successCriteria: [
        { en: "I can list 5 minor signs of the Hour.", ar: "أذكر ٥ علامات صغرى للساعة." },
        { en: "I can describe 3 major signs.", ar: "أصف ٣ علامات كبرى." },
        { en: "I can explain how belief in Akhirah affects behaviour.", ar: "أشرح كيف يؤثّر الإيمان بالآخرة على السلوك." },
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
      title: { en: "Signs of the Hour — Minor and Major", ar: "علامات الساعة — الصغرى والكبرى" },
      learningObjectives: [
        { en: "Understand the Islamic belief in the Day of Judgement and its signs.", ar: "أفهم الإيمان الإسلامي بيوم القيامة وعلاماته." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Minor Signs", ar: "العلامات الصغرى" },
          lines: [
            { en: "Already occurring: knowledge decreasing, ignorance spreading, alcohol consumption, tall buildings competition, time passing quickly, family ties cut, dishonesty in trade. (Bukhari & Muslim)", ar: "حدثت: نقص العلم وانتشار الجهل وشرب الخمر والتطاول في البنيان وسرعة الزمن وقطع الأرحام والغشّ. (البخاري ومسلم)" },
          ],
        },
        {
          label: { en: "Major Signs", ar: "العلامات الكبرى" },
          lines: [
            { en: "10 major signs including: Dajjal (Antichrist), descent of Isa (Jesus), Yajuj and Majuj (Gog and Magog), the sun rising from the west, the Beast, three major earthquakes, smoke, and fire. (Muslim)", ar: "١٠ علامات كبرى منها: الدجّال ونزول عيسى ويأجوج ومأجوج وطلوع الشمس من المغرب والدابّة وثلاث خسوفات والدخان والنار. (مسلم)" },
          ],
        },
        {
          label: { en: "Why It Matters", ar: "لماذا يهمّ" },
          lines: [
            { en: "Belief in the Day of Judgement is the 5th pillar of Iman. It motivates good deeds, accountability, and purpose in life.", ar: "الإيمان بيوم القيامة الركن الخامس من الإيمان. يحفّز الأعمال الصالحة والمسؤوليّة والهدف في الحياة." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "The Hour is certain (Ghafir 59).", ar: "الساعة آتية (غافر ٥٩)." }, answer: true },
        { statement: { en: "Only Allah knows when.", ar: "الله وحده يعلم متى." }, answer: true },
        { statement: { en: "Tall buildings are a minor sign.", ar: "التطاول في البنيان علامة صغرى." }, answer: true },
        { statement: { en: "Dajjal is a minor sign.", ar: "الدجّال علامة صغرى." }, answer: false },
        { statement: { en: "Belief in Akhirah is a pillar of Iman.", ar: "الإيمان بالآخرة ركن من الإيمان." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'The Hour is coming, no _______ about it.\'", ar: "﴿الساعة لآتية لا _______ فيها﴾" }, answer: { en: "doubt", ar: "ريب" } },
        { sentence: { en: "Only _______ knows when the Hour comes.", ar: "_______ وحده يعلم متى الساعة." }, answer: { en: "Allah", ar: "الله" } },
        { sentence: { en: "Dajjal is a _______ sign.", ar: "الدجّال علامة _______." }, answer: { en: "major", ar: "كبرى" } },
        { sentence: { en: "Belief in Akhirah is the _______ pillar of Iman.", ar: "الإيمان بالآخرة الركن _______ من الإيمان." }, answer: { en: "5th", ar: "الخامس" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "The Hour is certain. Minor signs are already appearing. Major signs will precede the Day of Judgement.",
        ar: "الساعة حقّ. العلامات الصغرى ظهرت. العلامات الكبرى ستسبق يوم القيامة.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the signs of the Hour in depth.", ar: "استكشف علامات الساعة بعمق." },
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
            title: { en: "Minor Signs", ar: "العلامات الصغرى" },
            image: IMG.skyBlue,
            color: "teal",
            topic: { en: "Already happening", ar: "تحدث الآن" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The Hour will not come until knowledge is taken away and ignorance spreads.\' (Bukhari)", ar: "«لا تقوم الساعة حتّى يُقبض العلم ويظهر الجهل.» (البخاري)" } },
              { label: { en: "Examples", ar: "أمثلة" }, content: { en: "Competition in tall buildings, time flying, family ties cut.", ar: "التطاول في البنيان وسرعة الزمن وقطع الأرحام." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "These signs are warnings to improve ourselves.", ar: "هذه العلامات تحذيرات لنصلح أنفسنا." } },
            ],
            task: {
              title: { en: "List Minor Signs You See", ar: "اذكر علامات صغرى تراها" },
              description: { en: "List 5 minor signs you can observe today.", ar: "اذكر ٥ علامات صغرى تلاحظها اليوم." },
              hint: { en: "Include: the sign, Hadith evidence, real-life example.", ar: "ضمّن: العلامة والحديث والمثال." },
            },
          },
          {
            id: "B",
            title: { en: "Major Signs", ar: "العلامات الكبرى" },
            image: IMG.mountainSnow,
            color: "blue",
            topic: { en: "10 major signs", ar: "١٠ علامات كبرى" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "The Prophet listed 10 major signs in order. (Muslim)", ar: "ذكر النبيّ ١٠ علامات كبرى بالترتيب. (مسلم)" } },
              { label: { en: "Key Signs", ar: "أبرز العلامات" }, content: { en: "Dajjal, Isa\'s descent, Yajuj and Majuj, sun from the west.", ar: "الدجّال ونزول عيسى ويأجوج ومأجوج والشمس من المغرب." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "These are future — we must prepare now.", ar: "هذه مستقبليّة — يجب أن نستعدّ الآن." } },
            ],
            task: {
              title: { en: "Create a Signs Timeline", ar: "أنشئ خطًّا زمنيًّا" },
              description: { en: "Draw a timeline of the 10 major signs in order.", ar: "ارسم خطًّا زمنيًّا للعلامات الكبرى." },
              hint: { en: "Include: sign, brief description, Hadith source.", ar: "ضمّن: العلامة ووصف مختصر والمصدر." },
            },
          },
          {
            id: "C",
            title: { en: "Dajjal", ar: "الدجّال" },
            image: IMG.bookshelf,
            color: "purple",
            topic: { en: "The greatest trial", ar: "أعظم فتنة" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'No trial greater than Dajjal from creation of Adam to the Hour.\' (Muslim)", ar: "«ما من فتنة أعظم من الدجّال من خلق آدم إلى الساعة.» (مسلم)" } },
              { label: { en: "Protection", ar: "حماية" }, content: { en: "Memorise first 10 ayat of Surah Al-Kahf. Seek refuge from Dajjal in every prayer.", ar: "احفظ أوّل ١٠ آيات من الكهف. استعذ من الدجّال في كلّ صلاة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowledge protects from the greatest trial.", ar: "العلم يحمي من أعظم الفتن." } },
            ],
            task: {
              title: { en: "Research the Dajjal", ar: "ابحث عن الدجّال" },
              description: { en: "Write what the Hadith teaches about Dajjal and protection.", ar: "اكتب ما يعلّمه الحديث عن الدجّال والحماية." },
              hint: { en: "Include: description, how to recognise, protection methods.", ar: "ضمّن: الوصف والتعرّف وطرق الحماية." },
            },
          },
          {
            id: "D",
            title: { en: "The Descent of Isa", ar: "نزول عيسى" },
            image: IMG.grandMosque,
            color: "amber",
            topic: { en: "Jesus returns", ar: "عيسى يعود" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "An-Nisa 159: \'There is none from the People of the Book but will believe in him before his death.\'", ar: "النساء ١٥٩: ﴿وإن من أهل الكتاب إلّا ليؤمننّ به قبل موته﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Isa will descend as a just ruler, break the cross, kill the pig, abolish the jizyah.\' (Bukhari)", ar: "«ينزل عيسى حكمًا مقسطًا فيكسر الصليب ويقتل الخنزير ويضع الجزية.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Justice will prevail in the end.", ar: "العدل سينتصر في النهاية." } },
            ],
            task: {
              title: { en: "Write About Isa\'s Return", ar: "اكتب عن عودة عيسى" },
              description: { en: "Summarise what will happen when Isa descends.", ar: "لخّص ما سيحدث عند نزول عيسى." },
              hint: { en: "Include: Hadith evidence, his actions, the outcome.", ar: "ضمّن: الأحاديث وأفعاله والنتيجة." },
            },
          },
          {
            id: "E",
            title: { en: "Preparation", ar: "الاستعداد" },
            image: IMG.lantern,
            color: "rose",
            topic: { en: "How to prepare", ar: "كيف نستعدّ" },
            infoSections: [
              { label: { en: "Action", ar: "عمل" }, content: { en: "Strengthen faith, pray regularly, memorise Al-Kahf, good deeds, avoid sins.", ar: "قوِّ الإيمان وصلِّ بانتظام واحفظ الكهف والأعمال الصالحة واجتنب الذنوب." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'If the Hour comes while you are planting a seed, plant it.\' (Ahmad)", ar: "«إن قامت الساعة وبيد أحدكم فسيلة فليغرسها.» (أحمد)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Keep doing good regardless of timing.", ar: "استمرّ في الخير بصرف النظر عن الوقت." } },
            ],
            task: {
              title: { en: "Create a Preparation Plan", ar: "أنشئ خطّة استعداد" },
              description: { en: "Write a personal plan to prepare for the Akhirah.", ar: "اكتب خطّة شخصيّة للاستعداد للآخرة." },
              hint: { en: "Include: daily worship, avoiding sins, Al-Kahf, good deeds.", ar: "ضمّن: العبادة اليوميّة واجتناب الذنوب والكهف والأعمال." },
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
            question: { en: "The Hour is?", ar: "الساعة؟" },
            options: [
            { en: "Certain", ar: "حقّ" },
            { en: "Doubtful", ar: "مشكوك" },
            { en: "Never", ar: "لن تأتي" },
            { en: "Already happened", ar: "حدثت" },
            ],
            correctIndex: 0,
            explanation: { en: "Certain — no doubt.", ar: "حقّ — لا ريب." },
          },
          {
            question: { en: "Who knows when?", ar: "من يعلم متى؟" },
            options: [
            { en: "Only Allah", ar: "الله وحده" },
            { en: "Scholars", ar: "العلماء" },
            { en: "Scientists", ar: "العلماء" },
            { en: "Everyone", ar: "الجميع" },
            ],
            correctIndex: 0,
            explanation: { en: "Only Allah.", ar: "الله وحده." },
          },
          {
            question: { en: "Tall buildings are?", ar: "التطاول في البنيان؟" },
            options: [
            { en: "Minor sign", ar: "علامة صغرى" },
            { en: "Major sign", ar: "علامة كبرى" },
            { en: "Not a sign", ar: "ليست علامة" },
            { en: "Invention", ar: "اختراع" },
            ],
            correctIndex: 0,
            explanation: { en: "A minor sign.", ar: "علامة صغرى." },
          },
          {
            question: { en: "Dajjal is?", ar: "الدجّال؟" },
            options: [
            { en: "Greatest trial", ar: "أعظم فتنة" },
            { en: "Minor issue", ar: "أمر بسيط" },
            { en: "Not real", ar: "ليس حقيقيًّا" },
            { en: "Good person", ar: "شخص طيّب" },
            ],
            correctIndex: 0,
            explanation: { en: "The greatest trial.", ar: "أعظم فتنة." },
          },
          {
            question: { en: "Isa will?", ar: "عيسى سوف؟" },
            options: [
            { en: "Descend as just ruler", ar: "ينزل حكمًا مقسطًا" },
            { en: "Not return", ar: "لا يعود" },
            { en: "Build a city", ar: "يبني مدينة" },
            { en: "Write a book", ar: "يكتب كتابًا" },
            ],
            correctIndex: 0,
            explanation: { en: "Descend as a just ruler.", ar: "ينزل حكمًا مقسطًا." },
          },
          {
            question: { en: "Protection from Dajjal?", ar: "الحماية من الدجّال؟" },
            options: [
            { en: "First 10 of Al-Kahf", ar: "أوّل ١٠ من الكهف" },
            { en: "Sleeping", ar: "النوم" },
            { en: "Running", ar: "الركض" },
            { en: "Eating", ar: "الأكل" },
            ],
            correctIndex: 0,
            explanation: { en: "First 10 ayat of Al-Kahf.", ar: "أوّل ١٠ آيات من الكهف." },
          },
          {
            question: { en: "Akhirah is which pillar?", ar: "الآخرة أيّ ركن؟" },
            options: [
            { en: "5th pillar of Iman", ar: "الركن الخامس" },
            { en: "1st pillar", ar: "الأوّل" },
            { en: "Not a pillar", ar: "ليس ركنًا" },
            { en: "3rd pillar", ar: "الثالث" },
            ],
            correctIndex: 0,
            explanation: { en: "5th pillar of Iman.", ar: "الركن الخامس." },
          },
          {
            question: { en: "Keep doing good even if?", ar: "استمرّ في الخير حتّى لو؟" },
            options: [
            { en: "The Hour is coming", ar: "الساعة تقوم" },
            { en: "Rich", ar: "غني" },
            { en: "Famous", ar: "مشهور" },
            { en: "Tired", ar: "متعب" },
            ],
            correctIndex: 0,
            explanation: { en: "Even if planting a seed (Ahmad).", ar: "حتّى لو تغرس فسيلة (أحمد)." },
          },
          {
            question: { en: "How many major signs?", ar: "كم علامة كبرى؟" },
            options: [
            { en: "10", ar: "١٠" },
            { en: "3", ar: "٣" },
            { en: "1", ar: "١" },
            { en: "100", ar: "١٠٠" },
            ],
            correctIndex: 0,
            explanation: { en: "10 major signs.", ar: "١٠ علامات." },
          },
          {
            question: { en: "Minor signs are?", ar: "العلامات الصغرى؟" },
            options: [
            { en: "Already happening", ar: "تحدث الآن" },
            { en: "Never happening", ar: "لن تحدث" },
            { en: "All done", ar: "انتهت" },
            { en: "Not real", ar: "ليست حقيقيّة" },
            ],
            correctIndex: 0,
            explanation: { en: "Already happening.", ar: "تحدث الآن." },
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
        title: { en: "Signs of the Hour", ar: "علامات الساعة" },
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
        code: "SIGNS001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — From the Signs of the Hour", ar: "ورقة عمل — مِن عَلاماتِ السّاعة" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — From the Signs of the Hour", ar: "ورقة عمل — مِن عَلاماتِ السّاعة" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "The Hour is?", ar: "الساعة؟" },
                options: [
                { en: "Certain", ar: "حقّ" },
                { en: "Doubtful", ar: "مشكوك" },
                { en: "Never", ar: "لن تأتي" },
                { en: "Myth", ar: "خرافة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Who knows timing?", ar: "من يعلم الوقت؟" },
                options: [
                { en: "Allah only", ar: "الله وحده" },
                { en: "Scientists", ar: "العلماء" },
                { en: "Kings", ar: "الملوك" },
                { en: "Everyone", ar: "الجميع" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Dajjal is?", ar: "الدجّال؟" },
                options: [
                { en: "Greatest trial", ar: "أعظم فتنة" },
                { en: "Good", ar: "خير" },
                { en: "Minor", ar: "بسيط" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How many major signs?", ar: "كم علامة كبرى؟" },
                options: [
                { en: "10", ar: "١٠" },
                { en: "3", ar: "٣" },
                { en: "1", ar: "١" },
                { en: "50", ar: "٥٠" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Protection: first 10 of?", ar: "الحماية: أوّل ١٠ من؟" },
                options: [
                { en: "Al-Kahf", ar: "الكهف" },
                { en: "Al-Fatiha", ar: "الفاتحة" },
                { en: "Al-Nas", ar: "الناس" },
                { en: "Al-Ikhlas", ar: "الإخلاص" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "The Hour is certain.", ar: "الساعة حقّ." }, answer: true },
              { statement: { en: "Everyone knows when.", ar: "الجميع يعلم متى." }, answer: false },
              { statement: { en: "Dajjal is the greatest trial.", ar: "الدجّال أعظم فتنة." }, answer: true },
              { statement: { en: "Minor signs have not started.", ar: "العلامات الصغرى لم تبدأ." }, answer: false },
              { statement: { en: "Al-Kahf protects from Dajjal.", ar: "الكهف يحمي من الدجّال." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "As-Sa\'ah", ar: "الساعة" }, answer: { en: "The Hour", ar: "الساعة" } },
              { prompt: { en: "Ashrat", ar: "أشراط" }, answer: { en: "Signs", ar: "العلامات" } },
              { prompt: { en: "Dajjal", ar: "دجّال" }, answer: { en: "Antichrist", ar: "المسيح الكذّاب" } },
              { prompt: { en: "Akhirah", ar: "آخرة" }, answer: { en: "Hereafter", ar: "الآخرة" } },
              { prompt: { en: "Hisab", ar: "حساب" }, answer: { en: "Account/Reckoning", ar: "الحساب" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'The Hour is coming, no _______ about it.\'", ar: "﴿الساعة لآتية لا _______ فيها﴾" }, blankAnswer: { en: "doubt", ar: "ريب" } },
              { sentence: { en: "Only _______ knows when.", ar: "_______ وحده يعلم." }, blankAnswer: { en: "Allah", ar: "الله" } },
              { sentence: { en: "Dajjal is the greatest _______.", ar: "الدجّال أعظم _______." }, blankAnswer: { en: "trial", ar: "فتنة" } },
              { sentence: { en: "Memorise first 10 of _______ for protection.", ar: "احفظ أوّل ١٠ من _______ للحماية." }, blankAnswer: { en: "Al-Kahf", ar: "الكهف" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Study the signs of the Hour", ar: "ادرس علامات الساعة" },
              { en: "Recognise minor signs around you", ar: "تعرّف على العلامات الصغرى حولك" },
              { en: "Learn about the major signs", ar: "تعلّم العلامات الكبرى" },
              { en: "Memorise first 10 of Al-Kahf", ar: "احفظ أوّل ١٠ من الكهف" },
              { en: "Strengthen your faith and good deeds", ar: "قوِّ إيمانك وأعمالك الصالحة" },
              { en: "Prepare for the Akhirah daily", ar: "استعدّ للآخرة يوميًّا" },
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
