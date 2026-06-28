import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const gratitudeAndPatience: CourseLesson = {
  slug: "g6y7-the-believer-between-gratitude-and-patience",
  name: { en: "The Believer Between Gratitude and Patience", ar: "المُؤمِنُ بَينَ الشُّكرِ والصَّبر" },
  shortIntro: {
    en: "The Prophet ﷺ said the affair of the believer is all good: in ease he is grateful, and in hardship he is patient — and both are rewarded. A deep study of how gratitude (shukr) and patience (sabr) make the believer\'s whole life a path to Allah.",
    ar: "قالَ النَّبِيُّ ﷺ إنَّ أمرَ المُؤمِنِ كُلَّهُ خَير: في السَّرّاءِ يَشكُر، وفي الضَّرّاءِ يَصبِر — وكِلاهُما مَأجور. دِراسةٌ عَميقةٌ لِكَيفَ يَجعَلُ الشُّكرُ والصَّبرُ حَياةَ المُؤمِنِ كُلَّها طَريقًا إلى الله.",
  },
  quranSurahs: ["Ibrahim 7", "Az-Zumar 10", "Al-Baqarah 152"],
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
        title: { en: "Are gratitude and patience really connected?", ar: "هل الشكر والصبر مرتبطان فعلًا؟" },
        body: {
          en: "A student says: \'I am grateful when things go well, but patience in hardship is pointless. If God loved me, He would not test me. I should only thank when I get what I want.\'",
          ar: "طالب يقول: «أشكر عندما تسير الأمور جيّدًا لكنّ الصبر في الشدّة لا فائدة منه. لو أحبّني الله لما اختبرني.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on gratitude and patience as twin virtues.",
          ar: "انتقد بالقرآن والحديث عن الشكر والصبر كفضيلتين متلازمتين.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'If you are grateful, I will surely increase you [in favour].\' (Ibrahim 7)",
        ar: "﴿لئن شكرتم لأزيدنّكم﴾ (إبراهيم ٧)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.waterfall, keyword: { en: "Shukr (Gratitude)", ar: "شكر" } },
          { image: IMG.mountainSnow, keyword: { en: "Sabr (Patience)", ar: "صبر" } },
          { image: IMG.childQuran, keyword: { en: "Rida (Contentment)", ar: "رضا" } },
          { image: IMG.lantern, keyword: { en: "Ni\'mah (Blessing)", ar: "نعمة" } },
          { image: IMG.skyBlue, keyword: { en: "Ibtila (Trial)", ar: "ابتلاء" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'How wonderful is the affair of the believer — if good befalls him he is grateful, if harm befalls him he is patient.\' (Muslim)",
        ar: "«عجبًا لأمر المؤمن — إن أصابته سرّاء شكر وإن أصابته ضرّاء صبر.» (مسلم)",
      },
    },
    {
      title: { en: "The Believer Between Gratitude and Patience", ar: "المُؤمِنُ بَينَ الشُّكرِ والصَّبر" },
      learningObjectives: [
        { en: "Explain the Islamic concept of shukr (gratitude) and its rewards.", ar: "أشرح مفهوم الشكر الإسلامي وثوابه." },
        { en: "Describe how sabr (patience) and shukr work together.", ar: "أصف كيف يعمل الصبر والشكر معًا." },
      ],
      successCriteria: [
        { en: "I can define shukr and sabr from Quran/Hadith.", ar: "أعرّف الشكر والصبر من القرآن/الحديث." },
        { en: "I can list 3 ways to show gratitude.", ar: "أذكر ٣ طرق للشكر." },
        { en: "I can explain how trials strengthen faith.", ar: "أشرح كيف تقوّي الابتلاءات الإيمان." },
      ],
      image: {
        src: IMG.waterfall,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Gratitude and Patience — Two Pillars of Faith", ar: "الشكر والصبر — ركيزتا الإيمان" },
      learningObjectives: [
        { en: "Master the Islamic virtues of gratitude (shukr) and patience (sabr).", ar: "أتقن فضيلتي الشكر والصبر في الإسلام." },
      ],
      image: {
        src: IMG.waterfall,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Shukr — Gratitude", ar: "الشكر" },
          lines: [
            { en: "Gratitude to Allah (heart, tongue, actions), to people, for blessings seen and unseen. Ibrahim 7: \'If you are grateful, I will increase you.\' Types: shukr of the heart, tongue, and limbs.", ar: "الشكر لله (بالقلب واللسان والعمل) وللناس على النعم الظاهرة والباطنة. إبراهيم ٧: ﴿لئن شكرتم لأزيدنّكم﴾" },
          ],
        },
        {
          label: { en: "Sabr — Patience", ar: "الصبر" },
          lines: [
            { en: "Patience in worship, from sin, and during trials. The believer\'s response to all situations. Az-Zumar 10: \'The patient receive reward without account.\'", ar: "الصبر على الطاعة وعن المعصية وعلى البلاء. استجابة المؤمن لكلّ المواقف. الزمر ١٠: ﴿يوفّى الصابرون أجرهم بغير حساب﴾" },
          ],
        },
        {
          label: { en: "The Connection", ar: "الصلة" },
          lines: [
            { en: "The believer is in a win-win: good = grateful = reward. Hardship = patient = reward. Both require faith and trust in Allah\'s wisdom.", ar: "المؤمن في ربح دائم: خير = شكر = ثواب. شدّة = صبر = ثواب. كلاهما يحتاج إيمانًا وتوكّلًا." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Gratitude increases blessings (Ibrahim 7).", ar: "الشكر يزيد النعم (إبراهيم ٧)." }, answer: true },
        { statement: { en: "Patience means complaining loudly.", ar: "الصبر يعني الشكوى بصوت عالٍ." }, answer: false },
        { statement: { en: "The believer benefits in all situations.", ar: "المؤمن يستفيد في كلّ الأحوال." }, answer: true },
        { statement: { en: "Trials mean Allah does not love you.", ar: "الابتلاءات تعني أنّ الله لا يحبّك." }, answer: false },
        { statement: { en: "Patient people get reward without account.", ar: "الصابرون أجرهم بغير حساب." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'If you are grateful, I will _______ you.\'", ar: "﴿لئن شكرتم ل_______.﴾" }, answer: { en: "increase", ar: "أزيدنّكم" } },
        { sentence: { en: "The patient receive reward without _______.", ar: "الصابرون أجرهم بغير _______." }, answer: { en: "account", ar: "حساب" } },
        { sentence: { en: "The believer is _______ when good comes.", ar: "المؤمن _______ عند الخير." }, answer: { en: "grateful", ar: "شاكر" } },
        { sentence: { en: "The believer is _______ when harm comes.", ar: "المؤمن _______ عند الضرّ." }, answer: { en: "patient", ar: "صابر" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Shukr and sabr are inseparable — gratitude in ease and patience in hardship both earn reward.",
        ar: "الشكر والصبر لا ينفصلان — الشكر في الرخاء والصبر في الشدّة كلاهما ثواب.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore gratitude and patience in detail.", ar: "استكشف الشكر والصبر بالتفصيل." },
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
            title: { en: "Types of Shukr", ar: "أنواع الشكر" },
            image: IMG.waterfall,
            color: "teal",
            topic: { en: "Heart, tongue, actions", ar: "القلب واللسان والعمل" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Ibrahim 7: \'If grateful, I will increase you.\'", ar: "إبراهيم ٧: ﴿لئن شكرتم لأزيدنّكم﴾" } },
              { label: { en: "Types", ar: "أنواع" }, content: { en: "Heart: feeling thankful. Tongue: saying Alhamdulillah. Actions: using blessings in obedience.", ar: "القلب: الشعور. اللسان: الحمد لله. العمل: استخدام النعم في الطاعة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Gratitude is expressed in three ways.", ar: "الشكر يُعبّر عنه بثلاث طرق." } },
            ],
            task: {
              title: { en: "Map Types of Shukr", ar: "ارسم أنواع الشكر" },
              description: { en: "Create a diagram of the three types of gratitude.", ar: "أنشئ مخطّطًا لأنواع الشكر الثلاثة." },
              hint: { en: "Include: definition, examples, Quran evidence.", ar: "ضمّن: التعريف والأمثلة والدليل القرآني." },
            },
          },
          {
            id: "B",
            title: { en: "Types of Sabr", ar: "أنواع الصبر" },
            image: IMG.mountainSnow,
            color: "blue",
            topic: { en: "On worship, from sin, on trials", ar: "على الطاعة وعن المعصية وعلى البلاء" },
            infoSections: [
              { label: { en: "Types", ar: "أنواع" }, content: { en: "1) Patience in worship. 2) Patience from sin. 3) Patience during trials.", ar: "١) صبر على الطاعة. ٢) صبر عن المعصية. ٣) صبر على البلاء." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'No fatigue or disease befalls a Muslim but Allah expiates sins.\' (Bukhari)", ar: "«ما يصيب المسلم من نصب ولا وصب إلّا كفّر الله.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every form of patience earns reward.", ar: "كلّ صبر له ثواب." } },
            ],
            task: {
              title: { en: "Analyse Patience Types", ar: "حلّل أنواع الصبر" },
              description: { en: "Write examples of each type of patience in your life.", ar: "اكتب أمثلة لكلّ نوع صبر في حياتك." },
              hint: { en: "Include: situation, type of sabr, how you responded.", ar: "ضمّن: الموقف ونوع الصبر واستجابتك." },
            },
          },
          {
            id: "C",
            title: { en: "The Believer\'s Win-Win", ar: "ربح المؤمن الدائم" },
            image: IMG.childQuran,
            color: "purple",
            topic: { en: "Always rewarded", ar: "دائمًا مُثاب" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'How wonderful is the affair of the believer...\' (Muslim)", ar: "«عجبًا لأمر المؤمن...» (مسلم)" } },
              { label: { en: "Logic", ar: "منطق" }, content: { en: "Good = grateful = reward. Bad = patient = reward. Both paths lead to Allah\'s pleasure.", ar: "خير = شكر = ثواب. شرّ = صبر = ثواب. كلاهما يؤدّي لرضا الله." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "A believer never truly loses.", ar: "المؤمن لا يخسر أبدًا." } },
            ],
            task: {
              title: { en: "Create a Win-Win Chart", ar: "أنشئ مخطّط ربح" },
              description: { en: "Draw how the believer wins in all situations.", ar: "ارسم كيف يربح المؤمن في كلّ حال." },
              hint: { en: "Include: good times, bad times, response, reward.", ar: "ضمّن: الخير والشرّ والاستجابة والثواب." },
            },
          },
          {
            id: "D",
            title: { en: "Gratitude in Practice", ar: "الشكر عمليًّا" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Daily acts of thanks", ar: "أعمال شكر يوميّة" },
            infoSections: [
              { label: { en: "Tip", ar: "نصيحة" }, content: { en: "Say Alhamdulillah 100 times. Thank people. Use blessings well.", ar: "قل الحمد لله ١٠٠ مرّة. اشكر الناس. استخدم النعم جيّدًا." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'He who does not thank people does not thank Allah.\' (Tirmidhi)", ar: "«من لم يشكر الناس لم يشكر الله.» (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Gratitude starts with small daily acts.", ar: "الشكر يبدأ بأعمال يوميّة صغيرة." } },
            ],
            task: {
              title: { en: "Design a Gratitude Journal", ar: "صمّم يوميّات شكر" },
              description: { en: "Create a daily gratitude journal for one week.", ar: "أنشئ يوميّات شكر لأسبوع." },
              hint: { en: "Track: 3 things grateful for, how you expressed it.", ar: "تتبّع: ٣ أشياء تشكرها وكيف عبّرت." },
            },
          },
          {
            id: "E",
            title: { en: "Stories of Sabr and Shukr", ar: "قصص الصبر والشكر" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Examples from prophets", ar: "أمثلة من الأنبياء" },
            infoSections: [
              { label: { en: "Story", ar: "قصّة" }, content: { en: "Prophet Ayyub: patient through extreme loss. Prophet Sulayman: grateful for immense wealth.", ar: "أيّوب: صبر على فقد شديد. سليمان: شكر على ثروة عظيمة." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Work in gratitude, O family of Dawud.\' (Saba 13)", ar: "﴿اعملوا آل داود شكرًا﴾ (سبأ ١٣)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Both prophets were tested differently but responded perfectly.", ar: "كلا النبيّين اختُبرا بشكل مختلف لكنّ استجابتهما كانت مثاليّة." } },
            ],
            task: {
              title: { en: "Compare Two Prophets", ar: "قارن بين نبيّين" },
              description: { en: "Compare Ayyub\'s patience with Sulayman\'s gratitude.", ar: "قارن صبر أيّوب بشكر سليمان." },
              hint: { en: "Include: their test, response, Quran evidence, lesson.", ar: "ضمّن: اختبارهما واستجابتهما والدليل والدرس." },
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
            question: { en: "Ibrahim 7 promises?", ar: "إبراهيم ٧ تعد؟" },
            options: [
            { en: "Increase for the grateful", ar: "الزيادة للشاكرين" },
            { en: "Punishment", ar: "عقاب" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Decrease", ar: "نقص" },
            ],
            correctIndex: 0,
            explanation: { en: "Increase.", ar: "الزيادة." },
          },
          {
            question: { en: "How many types of sabr?", ar: "كم نوعًا للصبر؟" },
            options: [
            { en: "Three", ar: "ثلاثة" },
            { en: "One", ar: "واحد" },
            { en: "Ten", ar: "عشرة" },
            { en: "None", ar: "لا يوجد" },
            ],
            correctIndex: 0,
            explanation: { en: "Three types.", ar: "ثلاثة أنواع." },
          },
          {
            question: { en: "Believer when good comes?", ar: "المؤمن عند الخير؟" },
            options: [
            { en: "Grateful", ar: "شاكر" },
            { en: "Angry", ar: "غاضب" },
            { en: "Sad", ar: "حزين" },
            { en: "Careless", ar: "لا مبالٍ" },
            ],
            correctIndex: 0,
            explanation: { en: "Grateful (shukr).", ar: "شاكر." },
          },
          {
            question: { en: "Believer when harm comes?", ar: "المؤمن عند الضرّ؟" },
            options: [
            { en: "Patient", ar: "صابر" },
            { en: "Angry", ar: "غاضب" },
            { en: "Gives up", ar: "يستسلم" },
            { en: "Careless", ar: "لا مبالٍ" },
            ],
            correctIndex: 0,
            explanation: { en: "Patient (sabr).", ar: "صابر." },
          },
          {
            question: { en: "Who was the most patient prophet?", ar: "من أصبر نبيّ؟" },
            options: [
            { en: "Ayyub", ar: "أيّوب" },
            { en: "Musa", ar: "موسى" },
            { en: "Adam", ar: "آدم" },
            { en: "Nuh", ar: "نوح" },
            ],
            correctIndex: 0,
            explanation: { en: "Prophet Ayyub.", ar: "أيّوب." },
          },
          {
            question: { en: "Who was the most grateful prophet?", ar: "من أشكر نبيّ؟" },
            options: [
            { en: "Sulayman", ar: "سليمان" },
            { en: "Isa", ar: "عيسى" },
            { en: "Lut", ar: "لوط" },
            { en: "Hud", ar: "هود" },
            ],
            correctIndex: 0,
            explanation: { en: "Prophet Sulayman.", ar: "سليمان." },
          },
          {
            question: { en: "He who does not thank people?", ar: "من لم يشكر الناس؟" },
            options: [
            { en: "Does not thank Allah", ar: "لم يشكر الله" },
            { en: "Is normal", ar: "طبيعي" },
            { en: "Is better", ar: "أفضل" },
            { en: "Is smarter", ar: "أذكى" },
            ],
            correctIndex: 0,
            explanation: { en: "Does not thank Allah (Tirmidhi).", ar: "لم يشكر الله (الترمذي)." },
          },
          {
            question: { en: "Patient reward without?", ar: "أجر الصابرين بغير؟" },
            options: [
            { en: "Account", ar: "حساب" },
            { en: "Effort", ar: "جهد" },
            { en: "Prayer", ar: "صلاة" },
            { en: "Money", ar: "مال" },
            ],
            correctIndex: 0,
            explanation: { en: "Without account (Az-Zumar 10).", ar: "بغير حساب." },
          },
          {
            question: { en: "Shukr types include?", ar: "أنواع الشكر تشمل؟" },
            options: [
            { en: "Heart, tongue, actions", ar: "القلب واللسان والعمل" },
            { en: "Only words", ar: "الكلمات فقط" },
            { en: "Only money", ar: "المال فقط" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Heart, tongue, and actions.", ar: "القلب واللسان والعمل." },
          },
          {
            question: { en: "Does trial mean Allah dislikes you?", ar: "هل البلاء يعني أنّ الله لا يحبّك؟" },
            options: [
            { en: "No", ar: "لا" },
            { en: "Yes", ar: "نعم" },
            { en: "Sometimes", ar: "أحيانًا" },
            { en: "Always", ar: "دائمًا" },
            ],
            correctIndex: 0,
            explanation: { en: "No — trials elevate the patient.", ar: "لا — الابتلاءات ترفع الصابرين." },
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
        title: { en: "Gratitude and Patience", ar: "الشكر والصبر" },
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
        code: "GRATI001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Believer Between Gratitude and Patience", ar: "ورقة عمل — المُؤمِنُ بَينَ الشُّكرِ والصَّبر" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Believer Between Gratitude and Patience", ar: "ورقة عمل — المُؤمِنُ بَينَ الشُّكرِ والصَّبر" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Ibrahim 7 promises?", ar: "إبراهيم ٧ تعد؟" },
                options: [
                { en: "Increase", ar: "الزيادة" },
                { en: "Decrease", ar: "النقص" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Punishment", ar: "العقاب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Types of sabr?", ar: "أنواع الصبر؟" },
                options: [
                { en: "Three", ar: "ثلاثة" },
                { en: "One", ar: "واحد" },
                { en: "Five", ar: "خمسة" },
                { en: "None", ar: "لا يوجد" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Believer always?", ar: "المؤمن دائمًا؟" },
                options: [
                { en: "Rewarded", ar: "مُثاب" },
                { en: "Punished", ar: "مُعاقب" },
                { en: "Ignored", ar: "مُهمل" },
                { en: "Lost", ar: "خاسر" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Patient prophet?", ar: "نبيّ الصبر؟" },
                options: [
                { en: "Ayyub", ar: "أيّوب" },
                { en: "Adam", ar: "آدم" },
                { en: "Nuh", ar: "نوح" },
                { en: "Lut", ar: "لوط" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Shukr of heart means?", ar: "شكر القلب يعني؟" },
                options: [
                { en: "Feeling thankful", ar: "الشعور بالامتنان" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Anger", ar: "غضب" },
                { en: "Doubt", ar: "شكّ" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Shukr increases blessings.", ar: "الشكر يزيد النعم." }, answer: true },
              { statement: { en: "Patience means giving up.", ar: "الصبر يعني الاستسلام." }, answer: false },
              { statement: { en: "Believers benefit in all situations.", ar: "المؤمنون يستفيدون في كلّ حال." }, answer: true },
              { statement: { en: "Trials prove Allah dislikes you.", ar: "الابتلاءات تعني عدم محبّة الله." }, answer: false },
              { statement: { en: "Thanking people is part of thanking Allah.", ar: "شكر الناس جزء من شكر الله." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Shukr", ar: "شكر" }, answer: { en: "Gratitude", ar: "الامتنان" } },
              { prompt: { en: "Sabr", ar: "صبر" }, answer: { en: "Patience", ar: "التحمّل" } },
              { prompt: { en: "Rida", ar: "رضا" }, answer: { en: "Contentment", ar: "القناعة" } },
              { prompt: { en: "Ibtila", ar: "ابتلاء" }, answer: { en: "Trial", ar: "الاختبار" } },
              { prompt: { en: "Ni\'mah", ar: "نعمة" }, answer: { en: "Blessing", ar: "النعمة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'If grateful, I will _______ you.\'", ar: "﴿لئن شكرتم ل_______.﴾" }, blankAnswer: { en: "increase", ar: "أزيدنّكم" } },
              { sentence: { en: "Patient reward without _______.", ar: "أجر الصابرين بغير _______." }, blankAnswer: { en: "account", ar: "حساب" } },
              { sentence: { en: "Believer is grateful when _______.", ar: "المؤمن شاكر عند _______." }, blankAnswer: { en: "good", ar: "الخير" } },
              { sentence: { en: "\'He who does not thank _______ does not thank Allah.\'", ar: "«من لم يشكر _______ لم يشكر الله.»" }, blankAnswer: { en: "people", ar: "الناس" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Receive a blessing from Allah", ar: "تلقّ نعمة من الله" },
              { en: "Recognise the blessing with the heart", ar: "أدرك النعمة بالقلب" },
              { en: "Express thanks with the tongue", ar: "عبّر عن الشكر باللسان" },
              { en: "Use the blessing in obedience to Allah", ar: "استخدم النعمة في طاعة الله" },
              { en: "When tested, respond with patience", ar: "عند الابتلاء استجب بالصبر" },
              { en: "Both paths lead to Allah\'s reward", ar: "كلا الطريقين يؤدّيان لثواب الله" },
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
