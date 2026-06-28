import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const lifeInMadinah: CourseLesson = {
  slug: "g6y7-life-in-madinah-after-the-migration",
  name: { en: "Life in Madinah After the Migration", ar: "الحَياةُ في المَدينةِ المُنَوَّرةِ بَعدَ الهِجرة" },
  shortIntro: {
    en: "How the Prophet ﷺ turned a divided town into the first Muslim society: building the mosque, joining the Muhajirun and Ansar in brotherhood, drafting the Constitution of Madinah, and establishing justice, security, and worship as the foundations of a community.",
    ar: "كَيفَ حَوَّلَ النَّبِيُّ ﷺ بَلدةً مُنقَسِمةً إلى أوَّلِ مُجتَمَعٍ مُسلِم: بِناءِ المَسجِد، والمُؤاخاةِ بَينَ المُهاجِرينَ والأنصار، وكِتابةِ صَحيفةِ المَدينة، وإرساءِ العَدلِ والأمنِ والعِبادةِ أُسُسًا لِلمُجتَمَع.",
  },
  quranSurahs: ["Al-Hashr 9", "Al-Anfal 72", "Al-Hujurat 10"],
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
        title: { en: "Was the Hijrah just moving to another city?", ar: "هل الهجرة مجرّد انتقال لمدينة أخرى؟" },
        body: {
          en: "A student says: \'The Prophet just moved cities because Makkah was hard. Anyone would do that. It was not a big deal — just a relocation.\'",
          ar: "طالب يقول: «النبيّ انتقل فقط لأنّ مكّة كانت صعبة. أيّ شخص سيفعل ذلك. ليست مسألة كبيرة.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using the significance of Hijrah and the Muslim society built in Madinah.",
          ar: "انتقد مستخدمًا أهمّيّة الهجرة والمجتمع الذي بُني في المدينة.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "The Hijrah was the foundation of the first Islamic state and community.",
        ar: "كانت الهجرة أساس أوّل دولة ومجتمع إسلامي.",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Hijrah (Migration)", ar: "هجرة" } },
          { image: IMG.childQuran, keyword: { en: "Muakhah (Brotherhood)", ar: "مؤاخاة" } },
          { image: IMG.lantern, keyword: { en: "Masjid (Mosque building)", ar: "بناء المسجد" } },
          { image: IMG.skyBlue, keyword: { en: "Sahifah (Constitution)", ar: "صحيفة المدينة" } },
          { image: IMG.bookshelf, keyword: { en: "Ansar (Helpers)", ar: "أنصار" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Those who believed and emigrated... they are the true believers.\' (Al-Anfal 74)",
        ar: "﴿والذين آمنوا وهاجروا... أولئك هم المؤمنون حقًّا﴾ (الأنفال ٧٤)",
      },
    },
    {
      title: { en: "Life in Madinah After the Migration", ar: "الحَياةُ في المَدينةِ المُنَوَّرةِ بَعدَ الهِجرة" },
      learningObjectives: [
        { en: "Explain the key events of the Prophet\'s early life in Madinah.", ar: "أشرح أهمّ أحداث حياة النبيّ الأولى في المدينة." },
        { en: "Describe the establishment of the Muslim community.", ar: "أصف تأسيس المجتمع الإسلامي." },
      ],
      successCriteria: [
        { en: "I can list 3 key actions upon arriving in Madinah.", ar: "أذكر ٣ أعمال أساسيّة عند الوصول للمدينة." },
        { en: "I can explain the brotherhood system (muakhah).", ar: "أشرح نظام المؤاخاة." },
        { en: "I can describe the Sahifah (Madinah Constitution).", ar: "أصف صحيفة المدينة." },
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
      title: { en: "Life in Madinah — Building the First Islamic Community", ar: "الحياة في المدينة — بناء أوّل مجتمع إسلامي" },
      learningObjectives: [
        { en: "Understand how the Prophet built society in Madinah.", ar: "أفهم كيف بنى النبيّ المجتمع في المدينة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Building Masjid an-Nabawi", ar: "بناء المسجد النبوي" },
          lines: [
            { en: "The first act was building the mosque — centre for prayer, education, governance, and community. Everyone participated.", ar: "أوّل عمل بناء المسجد — مركز الصلاة والتعليم والحكم والمجتمع. شارك الجميع." },
          ],
        },
        {
          label: { en: "Muakhah (Brotherhood)", ar: "المؤاخاة" },
          lines: [
            { en: "The Prophet paired each Muhajir (migrant from Makkah) with an Ansari (Madinah helper). They shared homes, wealth, and support.", ar: "آخى النبيّ بين كلّ مهاجر وأنصاري. تشاركوا المنازل والأموال والدعم." },
          ],
        },
        {
          label: { en: "Sahifah of Madinah", ar: "صحيفة المدينة" },
          lines: [
            { en: "The first written constitution — established rights and duties for Muslims, Jews, and all residents. Justice for all.", ar: "أوّل دستور مكتوب — حدّد حقوق وواجبات المسلمين واليهود وجميع السكّان. عدالة للجميع." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "The first thing built was the mosque.", ar: "أوّل شيء بُني المسجد." }, answer: true },
        { statement: { en: "Muakhah means competition.", ar: "المؤاخاة تعني المنافسة." }, answer: false },
        { statement: { en: "The Sahifah was the first constitution.", ar: "الصحيفة أوّل دستور." }, answer: true },
        { statement: { en: "Only Muslims were covered by the Sahifah.", ar: "الصحيفة غطّت المسلمين فقط." }, answer: false },
        { statement: { en: "Ansar means the helpers of Madinah.", ar: "الأنصار يعني أهل المدينة المساعدون." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "The first act in Madinah was building the _______.", ar: "أوّل عمل في المدينة بناء _______." }, answer: { en: "mosque", ar: "المسجد" } },
        { sentence: { en: "The Prophet paired Muhajirin with _______.", ar: "آخى النبيّ بين المهاجرين و_______." }, answer: { en: "Ansar", ar: "الأنصار" } },
        { sentence: { en: "The Sahifah was the first written _______.", ar: "الصحيفة أوّل _______ مكتوب." }, answer: { en: "constitution", ar: "دستور" } },
        { sentence: { en: "Muhajir means _______ from Makkah.", ar: "المهاجر يعني _______ من مكّة." }, answer: { en: "migrant", ar: "المنتقل" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "The Prophet established Madinah by building the mosque, creating brotherhood (muakhah), and writing the Sahifah constitution.",
        ar: "أسّس النبيّ المدينة ببناء المسجد وإنشاء المؤاخاة وكتابة صحيفة المدينة.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore key aspects of life in Madinah.", ar: "استكشف جوانب الحياة في المدينة." },
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
            title: { en: "Building the Mosque", ar: "بناء المسجد" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "Centre of community", ar: "مركز المجتمع" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "The Prophet carried bricks himself alongside the Sahabah.", ar: "حمل النبيّ الطوب بنفسه مع الصحابة." } },
              { label: { en: "Role", ar: "دور" }, content: { en: "Mosque = prayer + education + governance + social.", ar: "المسجد = صلاة + تعليم + حكم + اجتماع." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Leaders work alongside their people.", ar: "القادة يعملون مع شعبهم." } },
            ],
            task: {
              title: { en: "Draw the Mosque", ar: "ارسم المسجد" },
              description: { en: "Design a diagram of Masjid an-Nabawi\'s roles.", ar: "صمّم مخطّطًا لأدوار المسجد النبوي." },
              hint: { en: "Include: prayer, education, governance, community roles.", ar: "ضمّن: الصلاة والتعليم والحكم والأدوار." },
            },
          },
          {
            id: "B",
            title: { en: "Brotherhood (Muakhah)", ar: "المؤاخاة" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "Uniting migrants and helpers", ar: "توحيد المهاجرين والأنصار" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Ansar shared half their wealth and homes with Muhajirin.", ar: "تشارك الأنصار نصف أموالهم ومنازلهم مع المهاجرين." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Those who gave shelter and aided — they are allies of one another.\' (Al-Anfal 72)", ar: "﴿والذين آووا ونصروا أولئك بعضهم أولياء بعض﴾ (الأنفال ٧٢)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "True brotherhood means sacrifice.", ar: "الأخوّة الحقيقيّة تعني التضحية." } },
            ],
            task: {
              title: { en: "Write a Brotherhood Story", ar: "اكتب قصّة أخوّة" },
              description: { en: "Write about the pairing of Abdur-Rahman and Sa\'d.", ar: "اكتب عن مؤاخاة عبد الرحمن وسعد." },
              hint: { en: "Include: the offer, the response, the lesson.", ar: "ضمّن: العرض والاستجابة والدرس." },
            },
          },
          {
            id: "C",
            title: { en: "The Constitution", ar: "الدستور" },
            image: IMG.bookshelf,
            color: "purple",
            topic: { en: "Rights for all residents", ar: "حقوق لجميع السكّان" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "The Sahifah covered 47 clauses for all groups.", ar: "الصحيفة تضمّنت ٤٧ بندًا لجميع الفئات." } },
              { label: { en: "Principle", ar: "مبدأ" }, content: { en: "Religious freedom, mutual defence, justice for all.", ar: "حرّيّة الدين والدفاع المشترك والعدالة للجميع." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Islam established rule of law from the start.", ar: "أسّس الإسلام سيادة القانون من البداية." } },
            ],
            task: {
              title: { en: "Analyse the Sahifah", ar: "حلّل الصحيفة" },
              description: { en: "List 5 key clauses and their modern relevance.", ar: "اذكر ٥ بنود رئيسيّة وأهمّيّتها المعاصرة." },
              hint: { en: "Include: rights, duties, justice, tolerance.", ar: "ضمّن: الحقوق والواجبات والعدالة والتسامح." },
            },
          },
          {
            id: "D",
            title: { en: "The Ansar", ar: "الأنصار" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "The helpers of Madinah", ar: "أنصار المدينة" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Love of Ansar is a sign of faith.\' (Bukhari & Muslim)", ar: "«حبّ الأنصار من الإيمان.» (البخاري ومسلم)" } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "They gave up their best homes, farms, and wealth.", ar: "تنازلوا عن أفضل بيوتهم ومزارعهم وأموالهم." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Generosity is the hallmark of strong iman.", ar: "الكرم سمة الإيمان القويّ." } },
            ],
            task: {
              title: { en: "Create an Ansar Profile", ar: "أنشئ ملفّ أنصار" },
              description: { en: "Write profiles of 3 notable Ansar.", ar: "اكتب ملفّات ٣ أنصار بارزين." },
              hint: { en: "Include: name, sacrifice, Hadith about them.", ar: "ضمّن: الاسم والتضحية والحديث." },
            },
          },
          {
            id: "E",
            title: { en: "Lessons for Today", ar: "دروس لليوم" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Applying Madinah principles now", ar: "تطبيق مبادئ المدينة اليوم" },
            infoSections: [
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Community building starts with shared spaces (mosque/school).", ar: "بناء المجتمع يبدأ بالأماكن المشتركة." } },
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Supporting newcomers (refugees, new students) is Islamic duty.", ar: "دعم القادمين الجدد واجب إسلامي." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The Madinah model is timeless.", ar: "نموذج المدينة خالد." } },
            ],
            task: {
              title: { en: "Design a Modern Madinah Plan", ar: "صمّم خطّة مدينة معاصرة" },
              description: { en: "Apply the 3 Madinah principles to your school.", ar: "طبّق مبادئ المدينة الثلاثة على مدرستك." },
              hint: { en: "Include: shared space, welcoming newcomers, fair rules.", ar: "ضمّن: مكان مشترك واستقبال الجدد وقواعد عادلة." },
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
            question: { en: "First thing built in Madinah?", ar: "أوّل شيء بُني في المدينة؟" },
            options: [
            { en: "The mosque", ar: "المسجد" },
            { en: "A palace", ar: "قصر" },
            { en: "A market", ar: "سوق" },
            { en: "A fort", ar: "حصن" },
            ],
            correctIndex: 0,
            explanation: { en: "Masjid an-Nabawi.", ar: "المسجد النبوي." },
          },
          {
            question: { en: "What is muakhah?", ar: "ما المؤاخاة؟" },
            options: [
            { en: "Brotherhood between Muhajirin and Ansar", ar: "الأخوّة بين المهاجرين والأنصار" },
            { en: "War", ar: "حرب" },
            { en: "Trade", ar: "تجارة" },
            { en: "Travel", ar: "سفر" },
            ],
            correctIndex: 0,
            explanation: { en: "Pairing migrants with helpers.", ar: "مؤاخاة المهاجرين والأنصار." },
          },
          {
            question: { en: "What is the Sahifah?", ar: "ما الصحيفة؟" },
            options: [
            { en: "The first constitution", ar: "أوّل دستور" },
            { en: "A poem", ar: "قصيدة" },
            { en: "A map", ar: "خريطة" },
            { en: "A recipe", ar: "وصفة" },
            ],
            correctIndex: 0,
            explanation: { en: "The first written constitution.", ar: "أوّل دستور مكتوب." },
          },
          {
            question: { en: "Who are the Ansar?", ar: "من الأنصار؟" },
            options: [
            { en: "Madinah helpers", ar: "أهل المدينة المساعدون" },
            { en: "Makkah fighters", ar: "محاربو مكّة" },
            { en: "Foreign traders", ar: "تجّار أجانب" },
            { en: "Roman soldiers", ar: "جنود روم" },
            ],
            correctIndex: 0,
            explanation: { en: "The helpers of Madinah.", ar: "أهل المدينة." },
          },
          {
            question: { en: "Who are the Muhajirin?", ar: "من المهاجرون؟" },
            options: [
            { en: "Migrants from Makkah", ar: "المنتقلون من مكّة" },
            { en: "Madinah locals", ar: "أهل المدينة" },
            { en: "Ethiopian refugees", ar: "لاجئون إثيوبيّون" },
            { en: "Yemen traders", ar: "تجّار يمنيّون" },
            ],
            correctIndex: 0,
            explanation: { en: "Those who emigrated from Makkah.", ar: "الذين هاجروا من مكّة." },
          },
          {
            question: { en: "Did the Sahifah include non-Muslims?", ar: "هل شملت الصحيفة غير المسلمين؟" },
            options: [
            { en: "Yes", ar: "نعم" },
            { en: "No", ar: "لا" },
            { en: "Only Christians", ar: "المسيحيّين فقط" },
            { en: "Only pagans", ar: "المشركين فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Yes — all residents including Jews.", ar: "نعم — كلّ السكّان بمن فيهم اليهود." },
          },
          {
            question: { en: "What did Ansar share?", ar: "ماذا شارك الأنصار؟" },
            options: [
            { en: "Homes, wealth, support", ar: "المنازل والأموال والدعم" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Only food", ar: "الطعام فقط" },
            { en: "Only money", ar: "المال فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Everything — homes, wealth, and support.", ar: "كلّ شيء — المنازل والأموال والدعم." },
          },
          {
            question: { en: "Who carried bricks for the mosque?", ar: "من حمل الطوب للمسجد؟" },
            options: [
            { en: "The Prophet himself", ar: "النبيّ بنفسه" },
            { en: "Only slaves", ar: "العبيد فقط" },
            { en: "Hired workers", ar: "عمّال مأجورون" },
            { en: "Angels", ar: "الملائكة" },
            ],
            correctIndex: 0,
            explanation: { en: "The Prophet himself with the Sahabah.", ar: "النبيّ بنفسه مع الصحابة." },
          },
          {
            question: { en: "Love of Ansar is a sign of?", ar: "حبّ الأنصار علامة؟" },
            options: [
            { en: "Faith", ar: "الإيمان" },
            { en: "Wealth", ar: "الثروة" },
            { en: "Power", ar: "القوّة" },
            { en: "Intelligence", ar: "الذكاء" },
            ],
            correctIndex: 0,
            explanation: { en: "Sign of faith (Bukhari).", ar: "علامة الإيمان (البخاري)." },
          },
          {
            question: { en: "The Hijrah marks the start of?", ar: "الهجرة تؤرّخ بداية؟" },
            options: [
            { en: "Islamic calendar", ar: "التقويم الهجري" },
            { en: "Roman calendar", ar: "التقويم الروماني" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Trade season", ar: "موسم التجارة" },
            ],
            correctIndex: 0,
            explanation: { en: "The Islamic (Hijri) calendar.", ar: "التقويم الهجري." },
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
        title: { en: "Life in Madinah", ar: "الحياة في المدينة" },
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
        code: "MADIN001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Life in Madinah After the Migration", ar: "ورقة عمل — الحَياةُ في المَدينةِ المُنَوَّرةِ بَعدَ الهِجرة" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Life in Madinah After the Migration", ar: "ورقة عمل — الحَياةُ في المَدينةِ المُنَوَّرةِ بَعدَ الهِجرة" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "First act in Madinah?", ar: "أوّل عمل في المدينة؟" },
                options: [
                { en: "Build mosque", ar: "بناء المسجد" },
                { en: "Fight", ar: "القتال" },
                { en: "Trade", ar: "التجارة" },
                { en: "Migrate again", ar: "هجرة أخرى" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "What is muakhah?", ar: "ما المؤاخاة؟" },
                options: [
                { en: "Brotherhood", ar: "الأخوّة" },
                { en: "War", ar: "حرب" },
                { en: "Trade", ar: "تجارة" },
                { en: "Travel", ar: "سفر" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "First constitution?", ar: "أوّل دستور؟" },
                options: [
                { en: "Sahifah", ar: "الصحيفة" },
                { en: "Quran only", ar: "القرآن فقط" },
                { en: "Roman law", ar: "القانون الروماني" },
                { en: "None", ar: "لا يوجد" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Ansar shared?", ar: "الأنصار شاركوا؟" },
                options: [
                { en: "Homes and wealth", ar: "المنازل والأموال" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Only food", ar: "الطعام" },
                { en: "Only advice", ar: "النصيحة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Hijrah starts?", ar: "الهجرة بداية؟" },
                options: [
                { en: "Islamic calendar", ar: "التقويم الهجري" },
                { en: "Trade", ar: "التجارة" },
                { en: "War", ar: "الحرب" },
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
              { statement: { en: "Mosque was the first building.", ar: "المسجد أوّل بناء." }, answer: true },
              { statement: { en: "Muakhah means fighting.", ar: "المؤاخاة تعني القتال." }, answer: false },
              { statement: { en: "The Sahifah was the first constitution.", ar: "الصحيفة أوّل دستور." }, answer: true },
              { statement: { en: "Only Muslims lived in Madinah.", ar: "المسلمون فقط عاشوا في المدينة." }, answer: false },
              { statement: { en: "The Prophet carried bricks himself.", ar: "النبيّ حمل الطوب بنفسه." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Hijrah", ar: "هجرة" }, answer: { en: "Migration to Madinah", ar: "الهجرة إلى المدينة" } },
              { prompt: { en: "Muakhah", ar: "مؤاخاة" }, answer: { en: "Brotherhood system", ar: "نظام الأخوّة" } },
              { prompt: { en: "Sahifah", ar: "صحيفة" }, answer: { en: "Constitution of Madinah", ar: "دستور المدينة" } },
              { prompt: { en: "Ansar", ar: "أنصار" }, answer: { en: "Helpers of Madinah", ar: "أهل المدينة المساعدون" } },
              { prompt: { en: "Muhajirin", ar: "مهاجرون" }, answer: { en: "Migrants from Makkah", ar: "المنتقلون من مكّة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "The first act was building the _______.", ar: "أوّل عمل بناء _______." }, blankAnswer: { en: "mosque", ar: "المسجد" } },
              { sentence: { en: "Brotherhood paired Muhajirin with _______.", ar: "المؤاخاة بين المهاجرين و_______." }, blankAnswer: { en: "Ansar", ar: "الأنصار" } },
              { sentence: { en: "The _______ was the first constitution.", ar: "_______ أوّل دستور." }, blankAnswer: { en: "Sahifah", ar: "الصحيفة" } },
              { sentence: { en: "Love of Ansar is a sign of _______.", ar: "حبّ الأنصار علامة _______." }, blankAnswer: { en: "faith", ar: "الإيمان" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "The Prophet arrives in Madinah", ar: "وصول النبيّ إلى المدينة" },
              { en: "Build Masjid an-Nabawi", ar: "بناء المسجد النبوي" },
              { en: "Establish brotherhood (muakhah)", ar: "إنشاء المؤاخاة" },
              { en: "Write the Sahifah constitution", ar: "كتابة صحيفة المدينة" },
              { en: "Organize the Muslim community", ar: "تنظيم المجتمع الإسلامي" },
              { en: "Begin the Islamic state", ar: "بداية الدولة الإسلاميّة" },
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
