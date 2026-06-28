import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const voluntaryFasting: CourseLesson = {
  slug: "g6y7-voluntary-fasting",
  name: { en: "Voluntary Fasting", ar: "صِيامُ التَّطَوُّع" },
  shortIntro: {
    en: "Beyond Ramadan, Islam opens the door to voluntary fasting (sawm at-tatawwu\') — Mondays and Thursdays, the white days, Ashura, Arafah, and the six days of Shawwal. A deep study of these fasts, their immense rewards, and how voluntary worship draws us closer to Allah.",
    ar: "وراءَ رَمَضان، يَفتَحُ الإسلامُ بابَ صِيامِ التَّطَوُّع — الاثنَينِ والخَميس، والأيّامِ البيض، وعاشوراء، وعَرَفة، وسِتٍّ مِن شَوّال. دِراسةٌ عَميقةٌ لِهذه الصِّيامات، وعَظيمِ أجرِها، وكَيفَ تُقَرِّبُنا نَوافِلُ العِبادةِ إلى الله.",
  },
  quranSurahs: ["Al-Baqarah 183", "Aal Imran 133-134", "Al-Ahzab 35"],
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
        title: { en: "Is fasting outside Ramadan unnecessary?", ar: "هل الصيام خارج رمضان غير ضروري؟" },
        body: {
          en: "A student says: \'Ramadan fasting is enough. Fasting on other days is extreme and unnecessary. Allah only required one month. Extra fasting is for very religious people, not normal students.\'",
          ar: "طالب يقول: «صيام رمضان كافٍ. الصيام في أيّام أخرى تطرّف وغير ضروري. الله أوجب شهرًا واحدًا فقط.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Hadith on the virtues of voluntary fasting.",
          ar: "انتقد بالحديث عن فضائل صيام التطوّع.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Fasting is a shield.\' (Bukhari)",
        ar: "«الصيام جُنّة.» (البخاري)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Sawm (Fasting)", ar: "صوم" } },
          { image: IMG.childQuran, keyword: { en: "Tatawwu (Voluntary)", ar: "تطوّع" } },
          { image: IMG.lantern, keyword: { en: "Ajr (Reward)", ar: "أجر" } },
          { image: IMG.skyBlue, keyword: { en: "Taqwa (God-consciousness)", ar: "تقوى" } },
          { image: IMG.bookshelf, keyword: { en: "Sunnah (Prophetic practice)", ar: "سنّة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Whoever fasts one day in the way of Allah, Allah will keep his face seventy years\' distance from the Fire.\' (Bukhari)",
        ar: "«من صام يومًا في سبيل الله باعد الله وجهه عن النار سبعين خريفًا.» (البخاري)",
      },
    },
    {
      title: { en: "Voluntary Fasting", ar: "صِيامُ التَّطَوُّع" },
      learningObjectives: [
        { en: "Identify the types and virtues of voluntary fasting.", ar: "أحدّد أنواع وفضائل صيام التطوّع." },
        { en: "Explain the spiritual benefits of fasting beyond Ramadan.", ar: "أشرح الفوائد الروحيّة للصيام خارج رمضان." },
      ],
      successCriteria: [
        { en: "I can list 5 types of voluntary fasting.", ar: "أذكر ٥ أنواع لصيام التطوّع." },
        { en: "I can explain the reward of each type.", ar: "أشرح ثواب كلّ نوع." },
        { en: "I can describe the health benefits of fasting.", ar: "أصف الفوائد الصحّيّة للصيام." },
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
      title: { en: "Voluntary Fasting — Beyond Ramadan", ar: "صيام التطوّع — ما بعد رمضان" },
      learningObjectives: [
        { en: "Understand the types, virtues, and benefits of voluntary fasting.", ar: "أفهم أنواع وفضائل وفوائد صيام التطوّع." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Types of Voluntary Fasting", ar: "أنواع صيام التطوّع" },
          lines: [
            { en: "1) 6 days of Shawwal (= fasting the whole year). 2) Day of Arafah (sins of 2 years forgiven). 3) Ashura (10th Muharram — sins of 1 year). 4) Mondays and Thursdays (deeds presented to Allah). 5) 3 white days (13th, 14th, 15th of each lunar month). 6) Alternate day fasting of Dawud.", ar: "١) ٦ من شوّال (= صيام السنة). ٢) يوم عرفة (كفّارة سنتين). ٣) عاشوراء (كفّارة سنة). ٤) الاثنين والخميس (تُعرض الأعمال). ٥) أيّام البيض (١٣-١٤-١٥). ٦) صيام داود يومًا ويومًا." },
          ],
        },
        {
          label: { en: "Virtues and Rewards", ar: "الفضائل والثواب" },
          lines: [
            { en: "Fasting is between the servant and Allah — \'Every deed is multiplied 10 to 700 times, except fasting — it is for Me and I reward it.\' (Bukhari). Special gate in Paradise: Ar-Rayyan for fasters.", ar: "الصيام بين العبد والله — «كلّ عمل يُضاعف ١٠ إلى ٧٠٠ إلّا الصيام فإنّه لي وأنا أجزي به.» (البخاري). باب الريّان في الجنّة للصائمين." },
          ],
        },
        {
          label: { en: "Health Benefits", ar: "الفوائد الصحّيّة" },
          lines: [
            { en: "Detoxification, improved metabolism, mental clarity, self-discipline, gratitude for food. Modern science confirms intermittent fasting has health benefits.", ar: "التخلّص من السموم وتحسين الأيض والوضوح الذهني والانضباط وشكر الطعام. العلم الحديث يؤكّد فوائد الصيام المتقطّع." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Fasting is a shield.", ar: "الصيام جُنّة." }, answer: true },
        { statement: { en: "Voluntary fasting is extreme.", ar: "صيام التطوّع تطرّف." }, answer: false },
        { statement: { en: "6 Shawwal days = whole year.", ar: "٦ من شوّال = صيام السنة." }, answer: true },
        { statement: { en: "Only Ramadan fasting matters.", ar: "صيام رمضان فقط يهمّ." }, answer: false },
        { statement: { en: "Ar-Rayyan is a gate for fasters.", ar: "الريّان باب للصائمين." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Fasting is a _______.", ar: "«الصيام _______.»" }, answer: { en: "shield", ar: "جُنّة" } },
        { sentence: { en: "6 days of _______ after Ramadan.", ar: "٦ أيّام من _______ بعد رمضان." }, answer: { en: "Shawwal", ar: "شوّال" } },
        { sentence: { en: "Day of _______ forgives 2 years\' sins.", ar: "يوم _______ يكفّر سنتين." }, answer: { en: "Arafah", ar: "عرفة" } },
        { sentence: { en: "\'Fasting is for Me and I _______ it.\'", ar: "«الصيام لي وأنا _______ به.»" }, answer: { en: "reward", ar: "أجزي" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Voluntary fasting — 6 Shawwal, Arafah, Ashura, Mon/Thu, white days — earns immense reward and builds taqwa.",
        ar: "صيام التطوّع — ٦ شوّال وعرفة وعاشوراء والاثنين/الخميس والبيض — يكسب ثوابًا عظيمًا ويبني التقوى.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the types and benefits of voluntary fasting.", ar: "استكشف أنواع وفوائد صيام التطوّع." },
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
            title: { en: "Types of Fasting", ar: "أنواع الصيام" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "All voluntary fasts", ar: "كلّ صيام التطوّع" },
            infoSections: [
              { label: { en: "Types", ar: "أنواع" }, content: { en: "Shawwal 6, Arafah, Ashura, Mon/Thu, White Days, Dawud fasting.", ar: "شوّال ٦ وعرفة وعاشوراء والاثنين/الخميس والبيض وصيام داود." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Whoever fasts Ramadan then follows with 6 of Shawwal, it is as if he fasted the whole year.\' (Muslim)", ar: "«من صام رمضان ثمّ أتبعه ستًّا من شوّال كان كصيام الدهر.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Many opportunities beyond Ramadan.", ar: "فرص كثيرة بعد رمضان." } },
            ],
            task: {
              title: { en: "Create Fasting Calendar", ar: "أنشئ تقويم صيام" },
              description: { en: "Design a monthly fasting plan with evidence.", ar: "صمّم خطّة صيام شهريّة بأدلّة." },
              hint: { en: "Include: day, type of fast, hadith, reward.", ar: "ضمّن: اليوم ونوع الصيام والحديث والثواب." },
            },
          },
          {
            id: "B",
            title: { en: "Arafah and Ashura", ar: "عرفة وعاشوراء" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "Greatest days for fasting", ar: "أعظم أيّام الصيام" },
            infoSections: [
              { label: { en: "Arafah", ar: "عرفة" }, content: { en: "9th Dhul-Hijjah: forgives sins of past year and coming year. (Muslim)", ar: "٩ ذو الحجّة: يكفّر السنة الماضية والقادمة. (مسلم)" } },
              { label: { en: "Ashura", ar: "عاشوراء" }, content: { en: "10th Muharram: forgives sins of the past year. (Muslim)", ar: "١٠ محرّم: يكفّر السنة الماضية. (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Two days that erase years of sins.", ar: "يومان يمحوان سنوات ذنوب." } },
            ],
            task: {
              title: { en: "Research Arafah & Ashura", ar: "ابحث عن عرفة وعاشوراء" },
              description: { en: "Write about the significance and rewards of both.", ar: "اكتب عن أهمّيّة وثواب كليهما." },
              hint: { en: "Include: hadith, the reward, the story behind each.", ar: "ضمّن: الحديث والثواب والقصّة." },
            },
          },
          {
            id: "C",
            title: { en: "Monday & Thursday", ar: "الاثنين والخميس" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Weekly fasting", ar: "الصيام الأسبوعي" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Deeds are presented on Monday and Thursday. I love my deeds presented while I am fasting.\' (Tirmidhi)", ar: "«تُعرض الأعمال يوم الاثنين والخميس فأحبّ أن يُعرض عملي وأنا صائم.» (الترمذي)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'I was born on Monday.\' (Muslim)", ar: "«وُلدت يوم الاثنين.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Weekly fasting keeps you spiritually consistent.", ar: "الصيام الأسبوعي يحافظ على استمرار روحي." } },
            ],
            task: {
              title: { en: "Plan Weekly Fasting", ar: "خطّط للصيام الأسبوعي" },
              description: { en: "Create a practical Mon/Thu fasting plan.", ar: "أنشئ خطّة صيام عمليّة للاثنين/الخميس." },
              hint: { en: "Include: preparation, suhur tips, dua, benefits felt.", ar: "ضمّن: التحضير ونصائح السحور والدعاء والفوائد." },
            },
          },
          {
            id: "D",
            title: { en: "Health Benefits", ar: "الفوائد الصحّيّة" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Science of fasting", ar: "علم الصيام" },
            infoSections: [
              { label: { en: "Science", ar: "علم" }, content: { en: "Autophagy (cell cleanup), improved insulin sensitivity, weight management, mental clarity. Nobel Prize 2016 for autophagy research.", ar: "الالتهام الذاتي (تنظيف الخلايا) وتحسين حساسيّة الأنسولين وإدارة الوزن والوضوح الذهني. نوبل ٢٠١٦ لبحث الالتهام الذاتي." } },
              { label: { en: "Connection", ar: "صلة" }, content: { en: "Islam prescribed fasting 1400 years before modern science discovered its benefits.", ar: "الإسلام فرض الصيام قبل ١٤٠٠ سنة من اكتشاف العلم فوائده." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Islam\'s prescriptions align with modern health science.", ar: "وصفات الإسلام تتوافق مع العلم الصحّي الحديث." } },
            ],
            task: {
              title: { en: "Research Fasting Science", ar: "ابحث عن علم الصيام" },
              description: { en: "Find 3 scientific benefits of fasting.", ar: "أوجد ٣ فوائد علميّة للصيام." },
              hint: { en: "Include: benefit, scientific study, Islamic connection.", ar: "ضمّن: الفائدة والدراسة والصلة الإسلاميّة." },
            },
          },
          {
            id: "E",
            title: { en: "My Fasting Plan", ar: "خطّة صيامي" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Personal commitment", ar: "التزام شخصي" },
            infoSections: [
              { label: { en: "Action", ar: "عمل" }, content: { en: "Start with Monday fasting. Add Thursday. Try white days. Build gradually.", ar: "ابدأ بصيام الاثنين. أضف الخميس. جرّب البيض. ابنِ تدريجيًّا." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The most beloved deeds to Allah are the most consistent, even if small.\' (Bukhari)", ar: "«أحبّ الأعمال إلى الله أدومها وإن قلّ.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Consistency beats intensity.", ar: "الاستمراريّة تفوق الشدّة." } },
            ],
            task: {
              title: { en: "Write Your Fasting Plan", ar: "اكتب خطّة صيامك" },
              description: { en: "Create a personal voluntary fasting plan.", ar: "أنشئ خطّة صيام تطوّع شخصيّة." },
              hint: { en: "Include: which days, how often, gradual build-up.", ar: "ضمّن: أيّ الأيّام وكم مرّة والبناء التدريجي." },
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
            question: { en: "Fasting is a?", ar: "الصيام؟" },
            options: [
            { en: "Shield", ar: "جُنّة" },
            { en: "Punishment", ar: "عقاب" },
            { en: "Waste", ar: "إسراف" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Shield.", ar: "جُنّة." },
          },
          {
            question: { en: "6 Shawwal = fasting?", ar: "٦ شوّال = صيام؟" },
            options: [
            { en: "Whole year", ar: "السنة" },
            { en: "One week", ar: "أسبوع" },
            { en: "One day", ar: "يوم" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "The whole year.", ar: "السنة." },
          },
          {
            question: { en: "Arafah forgives?", ar: "عرفة يكفّر؟" },
            options: [
            { en: "2 years", ar: "سنتين" },
            { en: "1 day", ar: "يومًا" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "1 hour", ar: "ساعة" },
            ],
            correctIndex: 0,
            explanation: { en: "2 years\' sins.", ar: "سنتين." },
          },
          {
            question: { en: "Ashura forgives?", ar: "عاشوراء يكفّر؟" },
            options: [
            { en: "1 year", ar: "سنة" },
            { en: "2 years", ar: "سنتين" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "1 day", ar: "يومًا" },
            ],
            correctIndex: 0,
            explanation: { en: "1 year\'s sins.", ar: "سنة." },
          },
          {
            question: { en: "Deeds presented on?", ar: "الأعمال تُعرض يوم؟" },
            options: [
            { en: "Monday and Thursday", ar: "الاثنين والخميس" },
            { en: "Friday", ar: "الجمعة" },
            { en: "Saturday", ar: "السبت" },
            { en: "Sunday", ar: "الأحد" },
            ],
            correctIndex: 0,
            explanation: { en: "Monday and Thursday.", ar: "الاثنين والخميس." },
          },
          {
            question: { en: "Gate for fasters?", ar: "باب الصائمين؟" },
            options: [
            { en: "Ar-Rayyan", ar: "الريّان" },
            { en: "Ar-Rahman", ar: "الرحمن" },
            { en: "As-Salam", ar: "السلام" },
            { en: "Al-Firdaws", ar: "الفردوس" },
            ],
            correctIndex: 0,
            explanation: { en: "Ar-Rayyan.", ar: "الريّان." },
          },
          {
            question: { en: "Fasting is for Me and I?", ar: "الصيام لي وأنا؟" },
            options: [
            { en: "Reward it", ar: "أجزي به" },
            { en: "Ignore it", ar: "أتجاهله" },
            { en: "Reject it", ar: "أرفضه" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Reward it.", ar: "أجزي به." },
          },
          {
            question: { en: "White days are?", ar: "أيّام البيض؟" },
            options: [
            { en: "13, 14, 15 of lunar month", ar: "١٣-١٤-١٥ من الشهر" },
            { en: "1, 2, 3", ar: "١-٢-٣" },
            { en: "28, 29, 30", ar: "٢٨-٢٩-٣٠" },
            { en: "Random", ar: "عشوائيّة" },
            ],
            correctIndex: 0,
            explanation: { en: "13th, 14th, 15th.", ar: "١٣-١٤-١٥." },
          },
          {
            question: { en: "Prophet born on?", ar: "النبيّ وُلد يوم؟" },
            options: [
            { en: "Monday", ar: "الاثنين" },
            { en: "Friday", ar: "الجمعة" },
            { en: "Tuesday", ar: "الثلاثاء" },
            { en: "Sunday", ar: "الأحد" },
            ],
            correctIndex: 0,
            explanation: { en: "Monday.", ar: "الاثنين." },
          },
          {
            question: { en: "Best deeds are?", ar: "أفضل الأعمال؟" },
            options: [
            { en: "Most consistent", ar: "أدومها" },
            { en: "Hardest", ar: "أصعبها" },
            { en: "Rarest", ar: "أندرها" },
            { en: "Easiest", ar: "أسهلها" },
            ],
            correctIndex: 0,
            explanation: { en: "Most consistent.", ar: "أدومها." },
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
        title: { en: "Voluntary Fasting", ar: "صيام التطوّع" },
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
        code: "VFAST001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Voluntary Fasting", ar: "ورقة عمل — صِيامُ التَّطَوُّع" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Voluntary Fasting", ar: "ورقة عمل — صِيامُ التَّطَوُّع" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Fasting is?", ar: "الصيام؟" },
                options: [
                { en: "Shield", ar: "جُنّة" },
                { en: "Punishment", ar: "عقاب" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Waste", ar: "إسراف" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Arafah forgives?", ar: "عرفة يكفّر؟" },
                options: [
                { en: "2 years", ar: "سنتين" },
                { en: "1 day", ar: "يومًا" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "1 week", ar: "أسبوعًا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Gate for fasters?", ar: "باب الصائمين؟" },
                options: [
                { en: "Ar-Rayyan", ar: "الريّان" },
                { en: "Ar-Rahman", ar: "الرحمن" },
                { en: "As-Salam", ar: "السلام" },
                { en: "Al-Bab", ar: "الباب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "6 Shawwal?", ar: "٦ شوّال؟" },
                options: [
                { en: "Whole year", ar: "السنة" },
                { en: "Week", ar: "أسبوع" },
                { en: "Day", ar: "يوم" },
                { en: "Hour", ar: "ساعة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Best deeds?", ar: "أفضل الأعمال؟" },
                options: [
                { en: "Consistent", ar: "أدومها" },
                { en: "Hardest", ar: "أصعبها" },
                { en: "Once", ar: "مرّة" },
                { en: "Random", ar: "عشوائيّة" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Fasting is a shield.", ar: "الصيام جُنّة." }, answer: true },
              { statement: { en: "Voluntary fasting is extreme.", ar: "صيام التطوّع تطرّف." }, answer: false },
              { statement: { en: "Arafah forgives 2 years.", ar: "عرفة يكفّر سنتين." }, answer: true },
              { statement: { en: "Only Ramadan fasting counts.", ar: "صيام رمضان فقط يُحسب." }, answer: false },
              { statement: { en: "Ar-Rayyan is the gate for fasters.", ar: "الريّان باب الصائمين." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Sawm", ar: "صوم" }, answer: { en: "Fasting", ar: "الصيام" } },
              { prompt: { en: "Tatawwu", ar: "تطوّع" }, answer: { en: "Voluntary", ar: "التطوّع" } },
              { prompt: { en: "Arafah", ar: "عرفة" }, answer: { en: "9th Dhul-Hijjah", ar: "٩ ذو الحجّة" } },
              { prompt: { en: "Ashura", ar: "عاشوراء" }, answer: { en: "10th Muharram", ar: "١٠ محرّم" } },
              { prompt: { en: "Ar-Rayyan", ar: "الريّان" }, answer: { en: "Gate for fasters", ar: "باب الصائمين" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Fasting is a _______.", ar: "«الصيام _______.»" }, blankAnswer: { en: "shield", ar: "جُنّة" } },
              { sentence: { en: "6 days of _______ = whole year.", ar: "٦ أيّام من _______ = السنة." }, blankAnswer: { en: "Shawwal", ar: "شوّال" } },
              { sentence: { en: "Arafah forgives _______ years.", ar: "عرفة يكفّر _______ سنتين." }, blankAnswer: { en: "two", ar: "سنتين" } },
              { sentence: { en: "\'Most beloved deeds are most _______.", ar: "«أحبّ الأعمال _______.»" }, blankAnswer: { en: "consistent", ar: "أدومها" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn about voluntary fasting types", ar: "تعلّم أنواع صيام التطوّع" },
              { en: "Understand the reward of each type", ar: "افهم ثواب كلّ نوع" },
              { en: "Start with one day per week", ar: "ابدأ بيوم واحد في الأسبوع" },
              { en: "Add more days gradually", ar: "أضف أيّامًا تدريجيًّا" },
              { en: "Experience the health benefits", ar: "عش الفوائد الصحّيّة" },
              { en: "Build a consistent fasting habit", ar: "ابنِ عادة صيام مستمرّة" },
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
