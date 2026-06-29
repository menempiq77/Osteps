import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const battleOfUhud: CourseLesson = {
  slug: "g6y7-the-battle-of-uhud",
  name: { en: "The Battle of Uhud", ar: "غَزوةُ أُحُد" },
  shortIntro: {
    en: "One year after Badr, Quraysh returned for revenge at the mountain of Uhud. A deep study of how a near-victory turned to hardship when some archers left their posts — and the profound lessons Allah taught the believers about obedience, sincerity, and rising again after a setback.",
    ar: "بَعدَ بَدرٍ بِعامٍ عادَت قُرَيشٌ لِلثَّأرِ عِندَ جَبَلِ أُحُد. دِراسةٌ عَميقةٌ لِكَيفَ تَحَوَّلَ نَصرٌ وَشيكٌ إلى شِدّةٍ حينَ تَرَكَ بَعضُ الرُّماةِ مَواقِعَهُم — والدُّروسِ العَظيمةِ التي عَلَّمَها اللهُ المُؤمِنينَ في الطّاعةِ والإخلاصِ والنُّهوضِ بَعدَ الكَبوة.",
  },
  quranSurahs: ["Aal 'Imran 152", "Aal 'Imran 159", "Aal 'Imran 139"],
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
        title: { en: "Does one mistake erase all success?", ar: "هل خطأ واحد يمحو كلّ النجاح؟" },
        body: {
          en: "A student says: \'The Muslims lost at Uhud, so clearly Allah was not helping them. If they were right, they would always win.\'",
          ar: "طالب يقول: «المسلمون خسروا في أحد إذن الله لم يساعدهم. لو كانوا على حقّ لفازوا دائمًا.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using lessons from Uhud about obedience and trials.",
          ar: "انتقد بدروس أحد عن الطاعة والابتلاء.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Do not lose heart, do not grieve, for you will have the upper hand if you are believers.\' (Aal-Imran 139)",
        ar: "﴿ولا تهنوا ولا تحزنوا وأنتم الأعلون إن كنتم مؤمنين﴾ (آل عمران ١٣٩)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.mountainSnow, keyword: { en: "Uhud (The battle)", ar: "أحد" } },
          { image: IMG.grandMosque, keyword: { en: "Ta\'ah (Obedience)", ar: "طاعة" } },
          { image: IMG.childQuran, keyword: { en: "Ibtila (Trial)", ar: "ابتلاء" } },
          { image: IMG.lantern, keyword: { en: "Hamzah", ar: "حمزة" } },
          { image: IMG.bookshelf, keyword: { en: "Sabr (Patience)", ar: "صبر" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'And Allah had certainly fulfilled His promise to you when you were killing them by His permission.\' (Aal-Imran 152)",
        ar: "﴿ولقد صدقكم الله وعده إذ تحسّونهم بإذنه﴾ (آل عمران ١٥٢)",
      },
    },
    {
      title: { en: "The Battle of Uhud", ar: "غَزوةُ أُحُد" },
      learningObjectives: [
        { en: "Describe the causes and events of the Battle of Uhud.", ar: "أصف أسباب وأحداث غزوة أحد." },
        { en: "Explain the key lessons from the Muslim setback.", ar: "أشرح الدروس الرئيسيّة من تراجع المسلمين." },
      ],
      successCriteria: [
        { en: "I can describe why Uhud happened.", ar: "أصف لماذا وقعت أحد." },
        { en: "I can explain what the archers did wrong.", ar: "أشرح خطأ الرماة." },
        { en: "I can list 3 lessons from Uhud.", ar: "أذكر ٣ دروس من أحد." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "The Battle of Uhud — Lessons from a Setback", ar: "غزوة أحد — دروس من نكسة" },
      learningObjectives: [
        { en: "Understand the Battle of Uhud and the importance of obedience.", ar: "أفهم غزوة أحد وأهمّيّة الطاعة." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Background", ar: "الخلفيّة" },
          lines: [
            { en: "3 AH, Shawwal. Quraysh (3000) sought revenge for Badr. Muslims (700) met them at Mount Uhud. The Prophet placed 50 archers on the hill with orders: \'Do not leave your positions.\'", ar: "٣ هـ شوّال. قريش (٣٠٠٠) أرادت الثأر لبدر. المسلمون (٧٠٠) لاقوهم عند جبل أحد. وضع النبيّ ٥٠ راميًا على الجبل: «لا تبرحوا.»" },
          ],
        },
        {
          label: { en: "The Turning Point", ar: "نقطة التحوّل" },
          lines: [
            { en: "Initially Muslims won. The archers saw victory and left their posts to collect spoils, disobeying the Prophet. Khalid ibn al-Walid (then with Quraysh) attacked from behind.", ar: "في البداية انتصر المسلمون. الرماة رأوا النصر وتركوا مواقعهم للغنائم عصيانًا للنبيّ. خالد بن الوليد (مع قريش آنذاك) هاجم من الخلف." },
          ],
        },
        {
          label: { en: "Aftermath and Lessons", ar: "ما بعد المعركة والدروس" },
          lines: [
            { en: "70 Muslims martyred including Hamzah. Key lessons: obey the leader, do not love dunya over command, trials test faith, setbacks are not failures.", ar: "٧٠ شهيدًا منهم حمزة. الدروس: أطع القائد ولا تحبّ الدنيا فوق الأمر والابتلاء اختبار والنكسات ليست فشلًا." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Uhud was in 3 AH.", ar: "أحد كانت في ٣ هـ." }, answer: true },
        { statement: { en: "Muslims won completely at Uhud.", ar: "المسلمون انتصروا كلّيًّا في أحد." }, answer: false },
        { statement: { en: "The archers disobeyed the Prophet.", ar: "الرماة عصوا النبيّ." }, answer: true },
        { statement: { en: "Hamzah survived Uhud.", ar: "حمزة نجا في أحد." }, answer: false },
        { statement: { en: "Uhud teaches the importance of obedience.", ar: "أحد تعلّم أهمّيّة الطاعة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "The Prophet placed _______ archers on the hill.", ar: "وضع النبيّ _______ راميًا على الجبل." }, answer: { en: "50", ar: "٥٠" } },
        { sentence: { en: "Quraysh numbered about _______.", ar: "عدد قريش نحو _______." }, answer: { en: "3000", ar: "٣٠٠٠" } },
        { sentence: { en: "The archers left to collect _______.", ar: "ترك الرماة مواقعهم لجمع _______." }, answer: { en: "spoils", ar: "الغنائم" } },
        { sentence: { en: "_______ Muslims were martyred.", ar: "استُشهد _______ مسلمًا." }, answer: { en: "70", ar: "٧٠" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Uhud was 3 AH — Muslims initially won but archers disobeyed, leading to a setback. It teaches obedience and patience.",
        ar: "أحد ٣ هـ — انتصر المسلمون أوّلًا لكنّ الرماة عصوا فحدثت النكسة. تعلّم الطاعة والصبر.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the Battle of Uhud from multiple angles.", ar: "استكشف غزوة أحد من زوايا متعدّدة." },
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
            title: { en: "The Archers\' Mistake", ar: "خطأ الرماة" },
            image: IMG.mountainSnow,
            color: "teal",
            topic: { en: "Disobedience changes outcomes", ar: "العصيان يغيّر النتائج" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "50 archers ordered to stay; most left for spoils.", ar: "٥٠ راميًا أُمروا بالبقاء؛ معظمهم تركوا للغنائم." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Among you are those who desire this world.\' (Aal-Imran 152)", ar: "﴿منكم من يريد الدنيا﴾ (آل عمران ١٥٢)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "One act of disobedience can undo success.", ar: "عصيان واحد قد يمحو النجاح." } },
            ],
            task: {
              title: { en: "Analyse the Mistake", ar: "حلّل الخطأ" },
              description: { en: "Write what the archers should have done differently.", ar: "اكتب ما كان ينبغي للرماة فعله." },
              hint: { en: "Include: the order, what happened, the consequence, the lesson.", ar: "ضمّن: الأمر وما حدث والنتيجة والدرس." },
            },
          },
          {
            id: "B",
            title: { en: "Hamzah — The Lion", ar: "حمزة — أسد الله" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Martyrdom at Uhud", ar: "الاستشهاد في أحد" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Hamzah ibn Abdul-Muttalib, the Prophet\'s uncle, was killed by Wahshi.", ar: "حمزة بن عبد المطّلب عمّ النبيّ قتله وحشي." } },
              { label: { en: "Title", ar: "لقب" }, content: { en: "Called \'Lion of Allah and His Messenger.\'", ar: "لُقّب بـ«أسد الله ورسوله.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The greatest heroes give their lives for truth.", ar: "أعظم الأبطال يضحّون بحياتهم للحقّ." } },
            ],
            task: {
              title: { en: "Write Hamzah\'s Story", ar: "اكتب قصّة حمزة" },
              description: { en: "Write a biography of Hamzah\'s role at Uhud.", ar: "اكتب سيرة حمزة في أحد." },
              hint: { en: "Include: his character, his fighting, his martyrdom.", ar: "ضمّن: شخصيّته وقتاله واستشهاده." },
            },
          },
          {
            id: "C",
            title: { en: "The Prophet\'s Resilience", ar: "صمود النبيّ" },
            image: IMG.childQuran,
            color: "purple",
            topic: { en: "Injured but steadfast", ar: "جُرح لكن ثبت" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "The Prophet was wounded — his tooth broken, face cut. Yet he said: \'O Allah, forgive my people, they do not know.\'", ar: "جُرح النبيّ — كُسرت رباعيته وشُجّ وجهه. قال: «اللهمّ اغفر لقومي فإنّهم لا يعلمون.»" } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Muhammad is only a messenger.\' (Aal-Imran 144)", ar: "﴿وما محمّد إلّا رسول﴾ (آل عمران ١٤٤)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "True leadership means forgiveness even when hurt.", ar: "القيادة الحقيقيّة: المسامحة حتّى عند الأذى." } },
            ],
            task: {
              title: { en: "Reflect on the Prophet\'s Response", ar: "تأمّل في ردّ النبيّ" },
              description: { en: "Write how the Prophet\'s response to injury is a model for us.", ar: "اكتب كيف يكون ردّ النبيّ على الجرح نموذجًا لنا." },
              hint: { en: "Include: the injury, his words, the lesson for today.", ar: "ضمّن: الإصابة وكلماته ودرس اليوم." },
            },
          },
          {
            id: "D",
            title: { en: "Aal-Imran Lessons", ar: "دروس آل عمران" },
            image: IMG.bookshelf,
            color: "amber",
            topic: { en: "Quranic commentary on Uhud", ar: "التفسير القرآني لأحد" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Aal-Imran 139-152 discusses Uhud in detail.", ar: "آل عمران ١٣٩-١٥٢ تتناول أحد بالتفصيل." } },
              { label: { en: "Key Verse", ar: "آية مفتاحيّة" }, content: { en: "\'Do not lose heart, do not grieve, for you will have the upper hand.\' (139)", ar: "﴿ولا تهنوا ولا تحزنوا وأنتم الأعلون﴾ (١٣٩)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Allah\'s words console and guide after setbacks.", ar: "كلمات الله تعزّي وتهدي بعد النكسات." } },
            ],
            task: {
              title: { en: "Analyse the Verses", ar: "حلّل الآيات" },
              description: { en: "Pick 3 verses from Aal-Imran about Uhud and explain them.", ar: "اختر ٣ آيات من آل عمران عن أحد واشرحها." },
              hint: { en: "Include: verse, meaning, lesson, application.", ar: "ضمّن: الآية والمعنى والدرس والتطبيق." },
            },
          },
          {
            id: "E",
            title: { en: "Uhud Lessons for Students", ar: "دروس أحد للطلّاب" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Applying Uhud at school", ar: "تطبيق أحد في المدرسة" },
            infoSections: [
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Obey teachers and parents like the archers should have.", ar: "أطع المعلّمين والأهل كما كان ينبغي للرماة." } },
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Setbacks are learning opportunities, not failures.", ar: "النكسات فرص تعلّم لا فشل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Patience and obedience lead to long-term success.", ar: "الصبر والطاعة يؤدّيان للنجاح." } },
            ],
            task: {
              title: { en: "Write Personal Lessons", ar: "اكتب دروسًا شخصيّة" },
              description: { en: "Apply 5 Uhud lessons to your school life.", ar: "طبّق ٥ دروس من أحد في حياتك المدرسيّة." },
              hint: { en: "Include: obedience, patience, teamwork, resilience, trust.", ar: "ضمّن: الطاعة والصبر والعمل الجماعي والمرونة والتوكّل." },
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
            question: { en: "When was Uhud?", ar: "متى كانت أحد؟" },
            options: [
            { en: "3 AH", ar: "٣ هـ" },
            { en: "2 AH", ar: "٢ هـ" },
            { en: "5 AH", ar: "٥ هـ" },
            { en: "8 AH", ar: "٨ هـ" },
            ],
            correctIndex: 0,
            explanation: { en: "3 AH, Shawwal.", ar: "٣ هـ شوّال." },
          },
          {
            question: { en: "How many archers?", ar: "كم عدد الرماة؟" },
            options: [
            { en: "50", ar: "٥٠" },
            { en: "100", ar: "١٠٠" },
            { en: "10", ar: "١٠" },
            { en: "200", ar: "٢٠٠" },
            ],
            correctIndex: 0,
            explanation: { en: "50 archers.", ar: "٥٠ راميًا." },
          },
          {
            question: { en: "Why did archers leave?", ar: "لماذا ترك الرماة؟" },
            options: [
            { en: "To collect spoils", ar: "لجمع الغنائم" },
            { en: "To pray", ar: "للصلاة" },
            { en: "To eat", ar: "للأكل" },
            { en: "To sleep", ar: "للنوم" },
            ],
            correctIndex: 0,
            explanation: { en: "To collect spoils.", ar: "لجمع الغنائم." },
          },
          {
            question: { en: "Who was martyred?", ar: "من استُشهد؟" },
            options: [
            { en: "Hamzah", ar: "حمزة" },
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Umar", ar: "عمر" },
            { en: "Ali", ar: "عليّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Hamzah, Lion of Allah.", ar: "حمزة أسد الله." },
          },
          {
            question: { en: "How many martyred?", ar: "كم شهيدًا؟" },
            options: [
            { en: "70", ar: "٧٠" },
            { en: "10", ar: "١٠" },
            { en: "300", ar: "٣٠٠" },
            { en: "5", ar: "٥" },
            ],
            correctIndex: 0,
            explanation: { en: "70 Muslims.", ar: "٧٠ مسلمًا." },
          },
          {
            question: { en: "Main lesson of Uhud?", ar: "الدرس الرئيسي من أحد؟" },
            options: [
            { en: "Obedience to the leader", ar: "طاعة القائد" },
            { en: "Speed", ar: "السرعة" },
            { en: "Money", ar: "المال" },
            { en: "Retreat", ar: "الانسحاب" },
            ],
            correctIndex: 0,
            explanation: { en: "Obey the leader.", ar: "أطع القائد." },
          },
          {
            question: { en: "The Prophet was?", ar: "النبيّ كان؟" },
            options: [
            { en: "Wounded but steadfast", ar: "جُرح لكن ثبت" },
            { en: "Unharmed", ar: "لم يُصب" },
            { en: "Absent", ar: "غائبًا" },
            { en: "Retreated", ar: "انسحب" },
            ],
            correctIndex: 0,
            explanation: { en: "Wounded but steadfast.", ar: "جُرح لكن ثبت." },
          },
          {
            question: { en: "What did the Prophet say about his people?", ar: "ماذا قال النبيّ عن قومه؟" },
            options: [
            { en: "Forgive them, they do not know", ar: "اغفر لهم لا يعلمون" },
            { en: "Punish them", ar: "عاقبهم" },
            { en: "Leave them", ar: "اتركهم" },
            { en: "Fight them", ar: "حاربهم" },
            ],
            correctIndex: 0,
            explanation: { en: "O Allah forgive them.", ar: "اللهمّ اغفر لهم." },
          },
          {
            question: { en: "Quraysh numbered?", ar: "عدد قريش؟" },
            options: [
            { en: "3000", ar: "٣٠٠٠" },
            { en: "313", ar: "٣١٣" },
            { en: "100", ar: "١٠٠" },
            { en: "10000", ar: "١٠٠٠٠" },
            ],
            correctIndex: 0,
            explanation: { en: "About 3000.", ar: "نحو ٣٠٠٠." },
          },
          {
            question: { en: "Aal-Imran 139 says?", ar: "آل عمران ١٣٩ تقول؟" },
            options: [
            { en: "Do not lose heart", ar: "لا تهنوا" },
            { en: "Give up", ar: "استسلموا" },
            { en: "Run away", ar: "اهربوا" },
            { en: "Stay silent", ar: "اصمتوا" },
            ],
            correctIndex: 0,
            explanation: { en: "Do not lose heart or grieve.", ar: "لا تهنوا ولا تحزنوا." },
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
        title: { en: "Battle of Uhud", ar: "غزوة أحد" },
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
        code: "UHUD0001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Battle of Uhud", ar: "ورقة عمل — غَزوةُ أُحُد" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Battle of Uhud", ar: "ورقة عمل — غَزوةُ أُحُد" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "When was Uhud?", ar: "متى أحد؟" },
                options: [
                { en: "3 AH", ar: "٣ هـ" },
                { en: "2 AH", ar: "٢ هـ" },
                { en: "5 AH", ar: "٥ هـ" },
                { en: "1 AH", ar: "١ هـ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Archers left for?", ar: "الرماة تركوا ل؟" },
                options: [
                { en: "Spoils", ar: "الغنائم" },
                { en: "Prayer", ar: "الصلاة" },
                { en: "Food", ar: "الطعام" },
                { en: "Sleep", ar: "النوم" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How many martyred?", ar: "كم شهيدًا؟" },
                options: [
                { en: "70", ar: "٧٠" },
                { en: "10", ar: "١٠" },
                { en: "300", ar: "٣٠٠" },
                { en: "5", ar: "٥" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Who was martyred?", ar: "من استُشهد؟" },
                options: [
                { en: "Hamzah", ar: "حمزة" },
                { en: "Umar", ar: "عمر" },
                { en: "Ali", ar: "عليّ" },
                { en: "Abu Bakr", ar: "أبو بكر" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Main lesson?", ar: "الدرس الرئيسي؟" },
                options: [
                { en: "Obedience", ar: "الطاعة" },
                { en: "Speed", ar: "السرعة" },
                { en: "Wealth", ar: "الثروة" },
                { en: "Fame", ar: "الشهرة" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Uhud was in 3 AH.", ar: "أحد في ٣ هـ." }, answer: true },
              { statement: { en: "Muslims won completely.", ar: "المسلمون انتصروا كلّيًّا." }, answer: false },
              { statement: { en: "Archers disobeyed the Prophet.", ar: "الرماة عصوا النبيّ." }, answer: true },
              { statement: { en: "Hamzah survived.", ar: "حمزة نجا." }, answer: false },
              { statement: { en: "Obedience is a key lesson.", ar: "الطاعة درس رئيسي." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Uhud", ar: "أحد" }, answer: { en: "Second major battle", ar: "ثاني معركة كبرى" } },
              { prompt: { en: "Shuhada", ar: "شهداء" }, answer: { en: "Martyrs", ar: "الشهداء" } },
              { prompt: { en: "Ta\'ah", ar: "طاعة" }, answer: { en: "Obedience", ar: "الطاعة" } },
              { prompt: { en: "Ghanima", ar: "غنيمة" }, answer: { en: "War spoils", ar: "الغنائم" } },
              { prompt: { en: "Sabr", ar: "صبر" }, answer: { en: "Patience in adversity", ar: "الصبر في الشدّة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Archers numbered _______.", ar: "عدد الرماة _______." }, blankAnswer: { en: "50", ar: "٥٠" } },
              { sentence: { en: "Quraysh numbered _______.", ar: "عدد قريش _______." }, blankAnswer: { en: "3000", ar: "٣٠٠٠" } },
              { sentence: { en: "_______ Muslims were martyred.", ar: "استُشهد _______ مسلمًا." }, blankAnswer: { en: "70", ar: "٧٠" } },
              { sentence: { en: "The archers left for _______.", ar: "الرماة تركوا لل_______." }, blankAnswer: { en: "spoils", ar: "غنائم" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Quraysh gathers 3000 for revenge", ar: "قريش تجمع ٣٠٠٠ للثأر" },
              { en: "Prophet positions army at Mount Uhud", ar: "النبيّ يرتّب الجيش عند جبل أحد" },
              { en: "50 archers placed on the hill", ar: "٥٠ راميًا على الجبل" },
              { en: "Muslims initially win", ar: "المسلمون ينتصرون أوّلًا" },
              { en: "Archers leave their posts for spoils", ar: "الرماة يتركون مواقعهم للغنائم" },
              { en: "Khalid attacks from behind; 70 martyred", ar: "خالد يهاجم من الخلف؛ ٧٠ شهيدًا" },
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
