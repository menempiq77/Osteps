import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const choosingCompanions: CourseLesson = {
  slug: "g6y7-choosing-companions",
  name: { en: "Choosing Companions", ar: "اختِيارُ الجَليس" },
  shortIntro: {
    en: "\'A person follows the way of his close friend.\' A deep study of why choosing companions wisely shapes our faith and future — the parable of the musk-seller and the blacksmith, the dangers of bad company, and how to be a good companion ourselves.",
    ar: "«المَرءُ على دينِ خَليلِه». دِراسةٌ عَميقةٌ لِماذا يُشَكِّلُ حُسنُ اختيارِ الأصحابِ إيمانَنا ومُستَقبَلَنا — مَثَلُ بائِعِ المِسكِ ونافِخِ الكير، وأخطارُ الرُّفقةِ السَّيِّئة، وكَيفَ نَكونُ نَحنُ الجَليسَ الصّالِح.",
  },
  quranSurahs: ["Al-Furqan 27-29", "Az-Zukhruf 67", "Al-Kahf 28"],
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
        title: { en: "Does it matter who your friends are?", ar: "هل يهمّ من هم أصدقاؤك؟" },
        body: {
          en: "A student says: \'My friends do not affect me. I can be friends with anyone — even if they lie, cheat, or skip prayers. I am strong enough to not be influenced.\'",
          ar: "طالب يقول: «أصدقائي لا يؤثّرون عليّ. أصادق أيّ شخص — حتّى لو كذب أو غشّ أو ترك الصلاة. أنا قويّ بما يكفي.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Hadith on the effect of companions.",
          ar: "انتقد بالحديث عن تأثير الأصحاب.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'A person is upon the religion of his friend, so let each of you look whom he befriends.\' (Tirmidhi)",
        ar: "«المرء على دين خليله فلينظر أحدكم من يخالل.» (الترمذي)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Sahib (Companion)", ar: "صاحب" } },
          { image: IMG.grandMosque, keyword: { en: "Ukhuwwah (Brotherhood)", ar: "أخوّة" } },
          { image: IMG.bookshelf, keyword: { en: "Ta\'thir (Influence)", ar: "تأثير" } },
          { image: IMG.lantern, keyword: { en: "Nasiha (Advice)", ar: "نصيحة" } },
          { image: IMG.skyBlue, keyword: { en: "Qudwah (Role model)", ar: "قدوة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'The example of a good and bad companion is like a perfume seller and a blacksmith...\' (Bukhari)",
        ar: "«مثل الجليس الصالح والسوء كحامل المسك ونافخ الكير...» (البخاري)",
      },
    },
    {
      title: { en: "Choosing Companions", ar: "اختِيارُ الجَليس" },
      learningObjectives: [
        { en: "Explain the Islamic guidance on choosing companions.", ar: "أشرح التوجيه الإسلامي لاختيار الأصحاب." },
        { en: "Describe how friends influence behaviour and faith.", ar: "أصف كيف يؤثّر الأصدقاء على السلوك والإيمان." },
      ],
      successCriteria: [
        { en: "I can explain the perfume/blacksmith hadith.", ar: "أشرح حديث المسك والكير." },
        { en: "I can list 5 qualities of good companions.", ar: "أذكر ٥ صفات للصاحب الصالح." },
        { en: "I can identify how friends affect my choices.", ar: "أحدّد كيف يؤثّر الأصدقاء على خياراتي." },
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
      title: { en: "Choosing Companions — Friends in Islam", ar: "اختيار الأصحاب — الصداقة في الإسلام" },
      learningObjectives: [
        { en: "Understand how friends shape character, faith, and behaviour.", ar: "أفهم كيف يُشكّل الأصدقاء الشخصيّة والإيمان والسلوك." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "The Hadith on Companions", ar: "حديث الأصحاب" },
          lines: [
            { en: "Like a perfume seller: you get fragrance. Like a blacksmith: you get smoke. Good friends pull you to good, bad friends pull you to bad. You absorb what surrounds you.", ar: "كحامل المسك: تحصل على عطر. كنافخ الكير: تحصل على دخان. الأصدقاء الصالحون يجذبونك للخير والسوء يجذبونك للشرّ." },
          ],
        },
        {
          label: { en: "Qualities of Good Friends", ar: "صفات الأصدقاء الصالحين" },
          lines: [
            { en: "Truthful, prayerful, respectful, encouraging, remind you of Allah. They help you grow, correct you kindly, and never lead you to sin.", ar: "صادقون مصلّون محترمون مشجّعون يذكّرونك بالله. يساعدونك على النموّ ويصحّحونك بلطف ولا يقودونك للذنب." },
          ],
        },
        {
          label: { en: "Bad Influence", ar: "التأثير السيّئ" },
          lines: [
            { en: "\'On that Day the wrongdoer will bite his hands, saying: I wish I had not taken so-and-so as a friend!\' (Al-Furqan 27-28). Bad friends can destroy your faith and reputation.", ar: "﴿ويوم يعضّ الظالم على يديه يقول يا ليتني لم أتّخذ فلانًا خليلًا﴾ (الفرقان ٢٧-٢٨). الأصدقاء السوء يدمّرون إيمانك وسمعتك." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "A person is on the religion of his friend.", ar: "المرء على دين خليله." }, answer: true },
        { statement: { en: "Friends do not affect you.", ar: "الأصدقاء لا يؤثّرون عليك." }, answer: false },
        { statement: { en: "Good friends are like perfume sellers.", ar: "الأصدقاء الصالحون كحامل المسك." }, answer: true },
        { statement: { en: "Bad friends have no consequence.", ar: "الأصدقاء السوء بلا نتيجة." }, answer: false },
        { statement: { en: "Al-Furqan warns about bad friends.", ar: "الفرقان تحذّر من أصدقاء السوء." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'A person is upon the _______ of his friend.\'", ar: "«المرء على _______ خليله.»" }, answer: { en: "religion", ar: "دين" } },
        { sentence: { en: "Good companion is like _______ seller.", ar: "الجليس الصالح كحامل _______." }, answer: { en: "perfume", ar: "المسك" } },
        { sentence: { en: "Bad companion is like a _______.", ar: "الجليس السوء كنافخ _______." }, answer: { en: "blacksmith", ar: "الكير" } },
        { sentence: { en: "\'I wish I had not taken _______ as a friend!\'", ar: "﴿يا ليتني لم أتّخذ _______ خليلًا﴾" }, answer: { en: "so-and-so", ar: "فلانًا" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Choose friends wisely — they shape your faith and character like perfume or smoke.",
        ar: "اختر أصدقاءك بحكمة — يُشكّلون إيمانك وأخلاقك كالمسك أو الدخان.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore friendship from different perspectives.", ar: "استكشف الصداقة من زوايا مختلفة." },
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
            title: { en: "The Perfume and Blacksmith", ar: "المسك والكير" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "The famous hadith", ar: "الحديث الشهير" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Like perfume seller (good) and blacksmith (bad).\' (Bukhari)", ar: "«كحامل المسك (خير) ونافخ الكير (شرّ).» (البخاري)" } },
              { label: { en: "Explanation", ar: "شرح" }, content: { en: "Perfume: fragrance clings to you. Smoke: burns and stains.", ar: "المسك: العطر يلتصق بك. الدخان: يحرق ويلوّث." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "You become like those you spend time with.", ar: "تصبح مثل من تقضي وقتك معه." } },
            ],
            task: {
              title: { en: "Analyse the Hadith", ar: "حلّل الحديث" },
              description: { en: "Draw the perfume/blacksmith comparison.", ar: "ارسم مقارنة المسك/الكير." },
              hint: { en: "Include: what each represents, examples, modern scenarios.", ar: "ضمّن: ما يمثّله كلّ منهما والأمثلة والمواقف." },
            },
          },
          {
            id: "B",
            title: { en: "Qualities of Good Friends", ar: "صفات الصديق الصالح" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "What to look for", ar: "ماذا تبحث عنه" },
            infoSections: [
              { label: { en: "Qualities", ar: "صفات" }, content: { en: "Truthful, prayerful, kind, encouraging, reminds you of Allah.", ar: "صادق مصلٍّ لطيف مشجّع يذكّرك بالله." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'A believer is a mirror to his brother.\' (Abu Dawud)", ar: "«المؤمن مرآة أخيه.» (أبو داود)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Good friends reflect your best self.", ar: "الأصدقاء الصالحون يعكسون أفضل ما فيك." } },
            ],
            task: {
              title: { en: "Create Friend Criteria", ar: "أنشئ معايير صداقة" },
              description: { en: "Write 10 qualities you want in a friend.", ar: "اكتب ١٠ صفات تريدها في صديقك." },
              hint: { en: "Include: Islamic evidence for each quality.", ar: "ضمّن: الدليل الإسلامي لكلّ صفة." },
            },
          },
          {
            id: "C",
            title: { en: "Bad Influence Warning", ar: "تحذير التأثير السيّئ" },
            image: IMG.bookshelf,
            color: "purple",
            topic: { en: "Al-Furqan\'s warning", ar: "تحذير الفرقان" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Furqan 27-28: Regret over bad friends on Judgement Day.", ar: "الفرقان ٢٧-٢٨: ندم على أصدقاء السوء يوم القيامة." } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "A friend who encourages cheating, lying, or missing prayer.", ar: "صديق يشجّع على الغشّ والكذب وترك الصلاة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Choose now, or regret later.", ar: "اختر الآن أو اندم لاحقًا." } },
            ],
            task: {
              title: { en: "Write Warning Scenarios", ar: "اكتب مواقف تحذيريّة" },
              description: { en: "Write 3 scenarios of bad friendship influence.", ar: "اكتب ٣ مواقف تأثير صداقة سيّئة." },
              hint: { en: "Include: the bad influence, the consequence, the Islamic response.", ar: "ضمّن: التأثير والنتيجة والاستجابة الإسلاميّة." },
            },
          },
          {
            id: "D",
            title: { en: "Friendship Stories", ar: "قصص صداقة" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "From the Seerah", ar: "من السيرة" },
            infoSections: [
              { label: { en: "Story", ar: "قصّة" }, content: { en: "Abu Bakr and the Prophet — the best friendship in Islam. They supported, trusted, and sacrificed for each other.", ar: "أبو بكر والنبيّ — أعظم صداقة في الإسلام. تدعّما وتوثّقا وضحّيا." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'If I were to take a khalil, it would be Abu Bakr.\' (Bukhari)", ar: "«لو كنت متّخذًا خليلًا لاتّخذت أبا بكر.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The best friendships are built on faith.", ar: "أفضل الصداقات مبنيّة على الإيمان." } },
            ],
            task: {
              title: { en: "Research Seerah Friendships", ar: "ابحث عن صداقات السيرة" },
              description: { en: "Write about 2 great friendships from Islamic history.", ar: "اكتب عن صداقتين عظيمتين من التاريخ الإسلامي." },
              hint: { en: "Include: who, what bonded them, evidence.", ar: "ضمّن: من وما وثّقهم والدليل." },
            },
          },
          {
            id: "E",
            title: { en: "My Friendship Plan", ar: "خطّة صداقتي" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Practical steps", ar: "خطوات عمليّة" },
            infoSections: [
              { label: { en: "Action", ar: "عمل" }, content: { en: "Evaluate current friends. Seek friends at the mosque, Quran circles, and study groups.", ar: "قيّم أصدقاءك الحاليّين. ابحث عن أصدقاء في المسجد وحلقات القرآن ومجموعات الدراسة." } },
              { label: { en: "Tip", ar: "نصيحة" }, content: { en: "Be the good friend you want to have.", ar: "كن الصديق الصالح الذي تريده." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "You choose your friends — make it a conscious choice.", ar: "أنت تختار أصدقاءك — اجعله اختيارًا واعيًا." } },
            ],
            task: {
              title: { en: "Write Your Friendship Plan", ar: "اكتب خطّة صداقتك" },
              description: { en: "Write 5 action steps for choosing better friends.", ar: "اكتب ٥ خطوات لاختيار أصدقاء أفضل." },
              hint: { en: "Include: current assessment, criteria, where to find, how to maintain.", ar: "ضمّن: التقييم والمعايير وأين تجد وكيف تحافظ." },
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
            question: { en: "A person is on religion of?", ar: "المرء على دين؟" },
            options: [
            { en: "His friend", ar: "خليله" },
            { en: "His teacher", ar: "معلّمه" },
            { en: "His country", ar: "بلده" },
            { en: "His hobby", ar: "هوايته" },
            ],
            correctIndex: 0,
            explanation: { en: "His friend.", ar: "خليله." },
          },
          {
            question: { en: "Good companion like?", ar: "الجليس الصالح ك؟" },
            options: [
            { en: "Perfume seller", ar: "حامل المسك" },
            { en: "Blacksmith", ar: "نافخ الكير" },
            { en: "Farmer", ar: "مزارع" },
            { en: "Cook", ar: "طبّاخ" },
            ],
            correctIndex: 0,
            explanation: { en: "Perfume seller.", ar: "حامل المسك." },
          },
          {
            question: { en: "Bad companion like?", ar: "الجليس السوء ك؟" },
            options: [
            { en: "Blacksmith", ar: "نافخ الكير" },
            { en: "Perfume seller", ar: "حامل المسك" },
            { en: "Doctor", ar: "طبيب" },
            { en: "Teacher", ar: "معلّم" },
            ],
            correctIndex: 0,
            explanation: { en: "Blacksmith.", ar: "نافخ الكير." },
          },
          {
            question: { en: "Al-Furqan warns about?", ar: "الفرقان تحذّر من؟" },
            options: [
            { en: "Bad friends", ar: "أصدقاء السوء" },
            { en: "Good friends", ar: "أصدقاء الخير" },
            { en: "Teachers", ar: "المعلّمين" },
            { en: "Parents", ar: "الوالدين" },
            ],
            correctIndex: 0,
            explanation: { en: "Bad friends.", ar: "أصدقاء السوء." },
          },
          {
            question: { en: "If I took a khalil?", ar: "لو اتّخذت خليلًا؟" },
            options: [
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Umar", ar: "عمر" },
            { en: "Ali", ar: "عليّ" },
            { en: "Uthman", ar: "عثمان" },
            ],
            correctIndex: 0,
            explanation: { en: "Abu Bakr.", ar: "أبو بكر." },
          },
          {
            question: { en: "Good friends remind of?", ar: "الأصدقاء الصالحون يذكّرون ب؟" },
            options: [
            { en: "Allah", ar: "الله" },
            { en: "Money", ar: "المال" },
            { en: "Games", ar: "الألعاب" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Allah.", ar: "الله." },
          },
          {
            question: { en: "Believer is mirror to?", ar: "المؤمن مرآة ل؟" },
            options: [
            { en: "His brother", ar: "أخيه" },
            { en: "Himself", ar: "نفسه" },
            { en: "Strangers", ar: "الغرباء" },
            { en: "No one", ar: "لا أحد" },
            ],
            correctIndex: 0,
            explanation: { en: "His brother.", ar: "أخيه." },
          },
          {
            question: { en: "Bad friends lead to?", ar: "أصدقاء السوء يقودون إلى؟" },
            options: [
            { en: "Sin and regret", ar: "الذنب والندم" },
            { en: "Success", ar: "النجاح" },
            { en: "Happiness", ar: "السعادة" },
            { en: "Wealth", ar: "الثروة" },
            ],
            correctIndex: 0,
            explanation: { en: "Sin and regret.", ar: "الذنب والندم." },
          },
          {
            question: { en: "Best friendships built on?", ar: "أفضل الصداقات مبنيّة على؟" },
            options: [
            { en: "Faith", ar: "الإيمان" },
            { en: "Money", ar: "المال" },
            { en: "Games", ar: "الألعاب" },
            { en: "Food", ar: "الطعام" },
            ],
            correctIndex: 0,
            explanation: { en: "Faith.", ar: "الإيمان." },
          },
          {
            question: { en: "You become like?", ar: "تصبح مثل؟" },
            options: [
            { en: "Those you spend time with", ar: "من تقضي وقتك معه" },
            { en: "No one", ar: "لا أحد" },
            { en: "Yourself only", ar: "نفسك فقط" },
            { en: "Your teacher", ar: "معلّمك" },
            ],
            correctIndex: 0,
            explanation: { en: "Those you spend time with.", ar: "من تقضي وقتك معه." },
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
        title: { en: "Choosing Companions", ar: "اختيار الأصحاب" },
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
        code: "COMPN001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Choosing Companions", ar: "ورقة عمل — اختِيارُ الجَليس" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Choosing Companions", ar: "ورقة عمل — اختِيارُ الجَليس" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Friend is on religion of?", ar: "المرء على دين؟" },
                options: [
                { en: "His friend", ar: "خليله" },
                { en: "Teacher", ar: "معلّمه" },
                { en: "City", ar: "مدينته" },
                { en: "Book", ar: "كتابه" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Good friend like?", ar: "الصديق الصالح ك؟" },
                options: [
                { en: "Perfume seller", ar: "حامل المسك" },
                { en: "Blacksmith", ar: "الكير" },
                { en: "Farmer", ar: "مزارع" },
                { en: "Baker", ar: "خبّاز" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Bad friend like?", ar: "الصديق السوء ك؟" },
                options: [
                { en: "Blacksmith", ar: "نافخ الكير" },
                { en: "Perfume", ar: "المسك" },
                { en: "Doctor", ar: "طبيب" },
                { en: "Chef", ar: "طاهٍ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Al-Furqan warns?", ar: "الفرقان تحذّر؟" },
                options: [
                { en: "Bad friends", ar: "أصدقاء السوء" },
                { en: "Teachers", ar: "المعلّمين" },
                { en: "Parents", ar: "الوالدين" },
                { en: "Books", ar: "الكتب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Best khalil?", ar: "أفضل خليل؟" },
                options: [
                { en: "Abu Bakr", ar: "أبو بكر" },
                { en: "Umar", ar: "عمر" },
                { en: "Ali", ar: "عليّ" },
                { en: "Uthman", ar: "عثمان" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "A person follows his friend\'s religion.", ar: "المرء على دين خليله." }, answer: true },
              { statement: { en: "Friends have no influence.", ar: "الأصدقاء بلا تأثير." }, answer: false },
              { statement: { en: "Good friends are like perfume.", ar: "الأصدقاء الصالحون كالمسك." }, answer: true },
              { statement: { en: "Bad friends are harmless.", ar: "أصدقاء السوء بلا ضرر." }, answer: false },
              { statement: { en: "Abu Bakr was the Prophet\'s best friend.", ar: "أبو بكر أفضل أصدقاء النبيّ." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Sahib", ar: "صاحب" }, answer: { en: "Companion", ar: "الصاحب" } },
              { prompt: { en: "Khalil", ar: "خليل" }, answer: { en: "Close friend", ar: "الخليل" } },
              { prompt: { en: "Misk", ar: "مسك" }, answer: { en: "Perfume", ar: "العطر" } },
              { prompt: { en: "Kir", ar: "كير" }, answer: { en: "Blacksmith\'s bellows", ar: "منفاخ الحداد" } },
              { prompt: { en: "Ukhuwwah", ar: "أخوّة" }, answer: { en: "Brotherhood", ar: "الأخوّة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'A person is on the _______ of his friend.\'", ar: "«المرء على _______ خليله.»" }, blankAnswer: { en: "religion", ar: "دين" } },
              { sentence: { en: "Good friend like _______ seller.", ar: "الجليس الصالح كحامل _______." }, blankAnswer: { en: "perfume", ar: "المسك" } },
              { sentence: { en: "Bad friend like a _______.", ar: "الجليس السوء كنافخ _______." }, blankAnswer: { en: "blacksmith", ar: "الكير" } },
              { sentence: { en: "\'I wish I had not taken _______ as friend.\'", ar: "﴿يا ليتني لم أتّخذ _______ خليلًا﴾" }, blankAnswer: { en: "so-and-so", ar: "فلانًا" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Meet different types of people", ar: "قابل أنواعًا مختلفة من الناس" },
              { en: "Evaluate their character and values", ar: "قيّم شخصيّتهم وقيمهم" },
              { en: "Choose those who remind you of Allah", ar: "اختر من يذكّرك بالله" },
              { en: "Build friendships on faith and honesty", ar: "ابنِ صداقات على الإيمان والصدق" },
              { en: "Distance from bad influence", ar: "ابتعد عن التأثير السيّئ" },
              { en: "Be the good friend you wish to have", ar: "كن الصديق الصالح الذي تتمنّاه" },
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
