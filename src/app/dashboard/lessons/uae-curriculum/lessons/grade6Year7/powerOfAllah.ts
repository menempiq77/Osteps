import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const powerOfAllah: CourseLesson = {
  slug: "g6y7-the-power-of-allah-al-mulk-15-24",
  name: { en: "The Power of Allah (Al-Mulk 15-24)", ar: "قُدرةُ اللهِ تَعالى (المُلك ١٥-٢٤)" },
  shortIntro: {
    en: "A tafsir-level study of Surat Al-Mulk verses 15-24: Allah made the earth subservient for us, yet holds the heavens and the birds in the sky; He alone provides and sustains; and He warns those who deny His signs to reflect before it is too late.",
    ar: "دِراسةٌ تَفسيريّةٌ لِآياتِ سورةِ المُلك ١٥-٢٤: ذَلَّلَ اللهُ لَنا الأرض، وأمسَكَ السَّماءَ والطَّيرَ في الجَوّ؛ وهو وَحدَهُ الرّازِقُ المُمسِك؛ ويُحَذِّرُ مُنكِري آياتِهِ أن يَتَفَكَّروا قَبلَ فَواتِ الأوان.",
  },
  quranSurahs: ["Al-Mulk 15", "Al-Mulk 19", "Al-Mulk 21", "Al-Mulk 23"],
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
        title: { en: "Can nature explain everything without a Creator?", ar: "هل الطبيعة تفسّر كلّ شيء بلا خالق؟" },
        body: {
          en: "A student says: \'Science explains how the universe works. We do not need the idea of God. Nature created itself — everything is just atoms and energy.\'",
          ar: "طالب يقول: «العلم يفسّر كيف يعمل الكون. لا نحتاج فكرة الإله. الطبيعة خلقت نفسها.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran on the signs of Allah\'s power in creation.",
          ar: "انتقد بالقرآن عن آيات قدرة الله في الخلق.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for those of understanding.\' (Aal-Imran 190)",
        ar: "﴿إنّ في خلق السماوات والأرض واختلاف الليل والنهار لآيات لأولي الألباب﴾ (آل عمران ١٩٠)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.skyBlue, keyword: { en: "Qudrah (Power)", ar: "قدرة" } },
          { image: IMG.mountainSnow, keyword: { en: "Khalq (Creation)", ar: "خلق" } },
          { image: IMG.waterfall, keyword: { en: "Ayat (Signs)", ar: "آيات" } },
          { image: IMG.childQuran, keyword: { en: "Tafakkur (Reflection)", ar: "تفكّر" } },
          { image: IMG.grandMosque, keyword: { en: "Tawhid (Oneness)", ar: "توحيد" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'He created the heavens and the earth in truth.\' (An-Nahl 3)",
        ar: "﴿خلق السماوات والأرض بالحقّ﴾ (النحل ٣)",
      },
    },
    {
      title: { en: "The Power of Allah (Al-Mulk 15-24)", ar: "قُدرةُ اللهِ تَعالى (المُلك ١٥-٢٤)" },
      learningObjectives: [
        { en: "Explain how creation reflects Allah\'s power and wisdom.", ar: "أشرح كيف يعكس الخلق قدرة الله وحكمته." },
        { en: "Identify signs of Allah\'s power in nature and the universe.", ar: "أحدّد آيات قدرة الله في الطبيعة والكون." },
      ],
      successCriteria: [
        { en: "I can list 5 signs of Allah\'s power in creation.", ar: "أذكر ٥ آيات لقدرة الله في الخلق." },
        { en: "I can explain how the Quran encourages reflection on nature.", ar: "أشرح كيف يشجّع القرآن التفكّر في الطبيعة." },
        { en: "I can connect scientific facts to Quranic descriptions.", ar: "أربط الحقائق العلميّة بالوصف القرآني." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "The Power of Allah in Creation", ar: "قدرة الله في الخلق" },
      learningObjectives: [
        { en: "Understand how creation is evidence of Allah\'s infinite power and wisdom.", ar: "أفهم كيف يكون الخلق دليلًا على قدرة الله وحكمته اللانهائية." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "The Heavens and Earth", ar: "السماوات والأرض" },
          lines: [
            { en: "\'Do they not look at the sky above them — how We structured it and adorned it?\' (Qaf 6). The universe\'s vastness, order, and precision point to a Creator.", ar: "﴿أفلم ينظروا إلى السماء فوقهم كيف بنيناها وزيّنّاها﴾ (ق ٦). اتّساع الكون ونظامه ودقّته تدلّ على خالق." },
          ],
        },
        {
          label: { en: "Human Creation", ar: "خلق الإنسان" },
          lines: [
            { en: "\'We have certainly created man in the best of stature.\' (At-Tin 4). The human body — 206 bones, 600 muscles, 60,000 miles of blood vessels — all in perfect harmony.", ar: "﴿لقد خلقنا الإنسان في أحسن تقويم﴾ (التين ٤). جسم الإنسان — ٢٠٦ عظام و٦٠٠ عضلة و٦٠,٠٠٠ ميل أوعية دمويّة — في تناسق تامّ." },
          ],
        },
        {
          label: { en: "Nature and Balance", ar: "الطبيعة والتوازن" },
          lines: [
            { en: "\'And the earth — We spread it out and placed therein firmly set mountains, and We caused to grow therein every well-balanced thing.\' (Al-Hijr 19). Ecosystems, water cycle, seasons — all balanced.", ar: "﴿والأرض مددناها وألقينا فيها رواسي وأنبتنا فيها من كلّ شيء موزون﴾ (الحجر ١٩). النُّظم البيئيّة ودورة المياه والفصول — كلّها متوازنة." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "The Quran encourages reflection on creation.", ar: "القرآن يشجّع التفكّر في الخلق." }, answer: true },
        { statement: { en: "Nature created itself without a Creator.", ar: "الطبيعة خلقت نفسها بلا خالق." }, answer: false },
        { statement: { en: "The human body is created in the best stature.", ar: "الإنسان خُلق في أحسن تقويم." }, answer: true },
        { statement: { en: "Creation has no order or balance.", ar: "الخلق بلا نظام أو توازن." }, answer: false },
        { statement: { en: "Aal-Imran 190 mentions signs in creation.", ar: "آل عمران ١٩٠ تذكر آيات في الخلق." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Created man in the best of _______.", ar: "﴿خلقنا الإنسان في أحسن _______.﴾" }, answer: { en: "stature", ar: "تقويم" } },
        { sentence: { en: "The alternation of _______ and day are signs.", ar: "اختلاف _______ والنهار آيات." }, answer: { en: "night", ar: "الليل" } },
        { sentence: { en: "Signs are for those of _______.", ar: "الآيات لأولي _______." }, answer: { en: "understanding", ar: "الألباب" } },
        { sentence: { en: "\'We caused to grow every well-_______ thing.\'", ar: "﴿أنبتنا فيها من كلّ شيء _______.﴾" }, answer: { en: "balanced", ar: "موزون" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Creation — heavens, earth, human body, nature — all reflect Allah\'s infinite power, wisdom, and mercy.",
        ar: "الخلق — السماوات والأرض والإنسان والطبيعة — كلّها تعكس قدرة الله وحكمته ورحمته.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore signs of Allah\'s power in different aspects of creation.", ar: "استكشف آيات قدرة الله في جوانب الخلق المختلفة." },
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
            title: { en: "The Universe", ar: "الكون" },
            image: IMG.skyBlue,
            color: "teal",
            topic: { en: "Vastness and precision", ar: "الاتّساع والدقّة" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'And the heaven We constructed with strength, and indeed, We are [its] expander.\' (Adh-Dhariyat 47)", ar: "﴿والسماء بنيناها بأيد وإنّا لموسعون﴾ (الذاريات ٤٧)" } },
              { label: { en: "Science", ar: "علم" }, content: { en: "The universe contains 2 trillion galaxies, each with billions of stars.", ar: "الكون يحتوي ٢ تريليون مجرّة كلّ واحدة بمليارات النجوم." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The scale of creation humbles us before Allah.", ar: "عظمة الخلق تذلّنا أمام الله." } },
            ],
            task: {
              title: { en: "Research the Universe", ar: "ابحث عن الكون" },
              description: { en: "Write about 3 signs of Allah\'s power in the universe.", ar: "اكتب عن ٣ آيات لقدرة الله في الكون." },
              hint: { en: "Include: Quran verse, scientific fact, reflection.", ar: "ضمّن: آية وحقيقة علميّة وتأمّل." },
            },
          },
          {
            id: "B",
            title: { en: "The Human Body", ar: "جسم الإنسان" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "Perfect design", ar: "تصميم متقن" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "At-Tin 4: \'Created in the best stature.\'", ar: "التين ٤: ﴿في أحسن تقويم﴾" } },
              { label: { en: "Science", ar: "علم" }, content: { en: "The brain has 86 billion neurons. The heart beats 100,000 times daily.", ar: "الدماغ يحتوي ٨٦ مليار خليّة عصبيّة. القلب ينبض ١٠٠,٠٠٠ مرّة يوميًّا." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Our own bodies are the greatest proof of a Creator.", ar: "أجسادنا أعظم دليل على الخالق." } },
            ],
            task: {
              title: { en: "Map the Human Body", ar: "ارسم خريطة الجسم" },
              description: { en: "Highlight 5 amazing facts about the human body with Quran evidence.", ar: "أبرز ٥ حقائق مذهلة عن الجسم بأدلّة قرآنيّة." },
              hint: { en: "Include: organ, fact, verse, reflection.", ar: "ضمّن: العضو والحقيقة والآية والتأمّل." },
            },
          },
          {
            id: "C",
            title: { en: "Water and Life", ar: "الماء والحياة" },
            image: IMG.waterfall,
            color: "purple",
            topic: { en: "The source of all living things", ar: "مصدر كلّ حيّ" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'We made from water every living thing.\' (Al-Anbiya 30)", ar: "﴿وجعلنا من الماء كلّ شيء حيّ﴾ (الأنبياء ٣٠)" } },
              { label: { en: "Science", ar: "علم" }, content: { en: "Water covers 71% of Earth. The human body is 60% water. No life without water.", ar: "الماء يغطّي ٧١٪ من الأرض. الإنسان ٦٠٪ ماء. لا حياة بلا ماء." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Water is Allah\'s gift — we must be grateful and protect it.", ar: "الماء نعمة الله — نحن ممتنّون ونحافظ عليه." } },
            ],
            task: {
              title: { en: "Write About Water", ar: "اكتب عن الماء" },
              description: { en: "Explain the miracle of water in Islam and science.", ar: "اشرح معجزة الماء في الإسلام والعلم." },
              hint: { en: "Include: Quran, science facts, gratitude, conservation.", ar: "ضمّن: القرآن والحقائق العلميّة والامتنان والحفاظ." },
            },
          },
          {
            id: "D",
            title: { en: "Night and Day", ar: "الليل والنهار" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "The alternation as a sign", ar: "التعاقب كآية" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Aal-Imran 190: \'The alternation of night and day are signs.\'", ar: "آل عمران ١٩٠: ﴿اختلاف الليل والنهار لآيات﴾" } },
              { label: { en: "Science", ar: "علم" }, content: { en: "Earth rotates at 1,670 km/h creating perfect day-night cycles.", ar: "الأرض تدور بسرعة ١,٦٧٠ كم/ساعة لتعاقب مثالي." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every sunrise and sunset is a reminder of Allah\'s power.", ar: "كلّ شروق وغروب تذكير بقدرة الله." } },
            ],
            task: {
              title: { en: "Reflect on Day and Night", ar: "تأمّل في الليل والنهار" },
              description: { en: "Write about how day/night cycles point to Allah.", ar: "اكتب كيف يدلّ تعاقب الليل والنهار على الله." },
              hint: { en: "Include: Quran, science, personal reflection.", ar: "ضمّن: القرآن والعلم والتأمّل الشخصي." },
            },
          },
          {
            id: "E",
            title: { en: "Reflection (Tafakkur)", ar: "التفكّر" },
            image: IMG.grandMosque,
            color: "rose",
            topic: { en: "Thinking about creation", ar: "التفكّر في الخلق" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'And they reflect on the creation of the heavens and earth.\' (Aal-Imran 191)", ar: "﴿ويتفكّرون في خلق السماوات والأرض﴾ (آل عمران ١٩١)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'An hour of reflection is better than a year of worship.\' (attributed)", ar: "«تفكّر ساعة خير من عبادة سنة.» (منسوب)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Thinking about creation strengthens faith.", ar: "التفكّر في الخلق يقوّي الإيمان." } },
            ],
            task: {
              title: { en: "Write a Tafakkur Journal", ar: "اكتب يوميّات تفكّر" },
              description: { en: "Spend 10 minutes reflecting on creation and write what you noticed.", ar: "اقضِ ١٠ دقائق تتفكّر في الخلق واكتب ما لاحظت." },
              hint: { en: "Include: what you observed, Quran connection, how it makes you feel.", ar: "ضمّن: ما لاحظت والصلة القرآنيّة وشعورك." },
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
            question: { en: "Aal-Imran 190 mentions signs in?", ar: "آل عمران ١٩٠ تذكر آيات في؟" },
            options: [
            { en: "Creation of heavens and earth", ar: "خلق السماوات والأرض" },
            { en: "Money", ar: "المال" },
            { en: "Food", ar: "الطعام" },
            { en: "Sports", ar: "الرياضة" },
            ],
            correctIndex: 0,
            explanation: { en: "Creation and alternation of night/day.", ar: "الخلق وتعاقب الليل والنهار." },
          },
          {
            question: { en: "Man was created in?", ar: "خُلق الإنسان في؟" },
            options: [
            { en: "Best stature", ar: "أحسن تقويم" },
            { en: "Weakness", ar: "ضعف" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Stone", ar: "حجر" },
            ],
            correctIndex: 0,
            explanation: { en: "Best stature (At-Tin 4).", ar: "أحسن تقويم (التين ٤)." },
          },
          {
            question: { en: "All living things made from?", ar: "كلّ حيّ خُلق من؟" },
            options: [
            { en: "Water", ar: "الماء" },
            { en: "Fire", ar: "النار" },
            { en: "Air", ar: "الهواء" },
            { en: "Stone", ar: "الحجر" },
            ],
            correctIndex: 0,
            explanation: { en: "Water (Al-Anbiya 30).", ar: "الماء (الأنبياء ٣٠)." },
          },
          {
            question: { en: "What does tafakkur mean?", ar: "ما التفكّر؟" },
            options: [
            { en: "Reflecting on creation", ar: "التأمّل في الخلق" },
            { en: "Sleeping", ar: "النوم" },
            { en: "Eating", ar: "الأكل" },
            { en: "Running", ar: "الركض" },
            ],
            correctIndex: 0,
            explanation: { en: "Reflecting on Allah\'s creation.", ar: "التأمّل في خلق الله." },
          },
          {
            question: { en: "How many galaxies in universe?", ar: "كم مجرّة في الكون؟" },
            options: [
            { en: "~2 trillion", ar: "~٢ تريليون" },
            { en: "10", ar: "١٠" },
            { en: "1", ar: "١" },
            { en: "100", ar: "١٠٠" },
            ],
            correctIndex: 0,
            explanation: { en: "About 2 trillion.", ar: "نحو ٢ تريليون." },
          },
          {
            question: { en: "The earth rotates creating?", ar: "دوران الأرض يخلق؟" },
            options: [
            { en: "Day and night", ar: "الليل والنهار" },
            { en: "Seasons only", ar: "الفصول فقط" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Earthquakes", ar: "زلازل" },
            ],
            correctIndex: 0,
            explanation: { en: "Day and night cycles.", ar: "تعاقب الليل والنهار." },
          },
          {
            question: { en: "Water covers what % of Earth?", ar: "الماء يغطّي كم٪ من الأرض؟" },
            options: [
            { en: "71%", ar: "٧١٪" },
            { en: "10%", ar: "١٠٪" },
            { en: "99%", ar: "٩٩٪" },
            { en: "1%", ar: "١٪" },
            ],
            correctIndex: 0,
            explanation: { en: "About 71%.", ar: "نحو ٧١٪." },
          },
          {
            question: { en: "Human heart beats daily?", ar: "القلب ينبض يوميًّا؟" },
            options: [
            { en: "100,000 times", ar: "١٠٠,٠٠٠ مرّة" },
            { en: "10 times", ar: "١٠ مرّات" },
            { en: "1 time", ar: "مرّة" },
            { en: "50 times", ar: "٥٠ مرّة" },
            ],
            correctIndex: 0,
            explanation: { en: "About 100,000 times.", ar: "نحو ١٠٠,٠٠٠ مرّة." },
          },
          {
            question: { en: "Brain has how many neurons?", ar: "كم خليّة عصبيّة في الدماغ؟" },
            options: [
            { en: "86 billion", ar: "٨٦ مليار" },
            { en: "100", ar: "١٠٠" },
            { en: "1000", ar: "١٠٠٠" },
            { en: "10", ar: "١٠" },
            ],
            correctIndex: 0,
            explanation: { en: "About 86 billion.", ar: "نحو ٨٦ مليار." },
          },
          {
            question: { en: "Signs are for those of?", ar: "الآيات لأولي؟" },
            options: [
            { en: "Understanding (al-Albab)", ar: "الألباب" },
            { en: "Wealth", ar: "الثروة" },
            { en: "Power", ar: "القوّة" },
            { en: "Fame", ar: "الشهرة" },
            ],
            correctIndex: 0,
            explanation: { en: "Understanding (Aal-Imran 190).", ar: "الألباب (آل عمران ١٩٠)." },
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
        title: { en: "Power of Allah in Creation", ar: "قدرة الله في الخلق" },
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
        code: "POWER001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Power of Allah (Al-Mulk 15-24)", ar: "ورقة عمل — قُدرةُ اللهِ تَعالى (المُلك ١٥-٢٤)" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Power of Allah (Al-Mulk 15-24)", ar: "ورقة عمل — قُدرةُ اللهِ تَعالى (المُلك ١٥-٢٤)" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Signs in creation for?", ar: "آيات في الخلق ل؟" },
                options: [
                { en: "Those of understanding", ar: "أولي الألباب" },
                { en: "No one", ar: "لا أحد" },
                { en: "Only scholars", ar: "العلماء فقط" },
                { en: "Animals", ar: "الحيوانات" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "All living from?", ar: "كلّ حيّ من؟" },
                options: [
                { en: "Water", ar: "الماء" },
                { en: "Fire", ar: "النار" },
                { en: "Stone", ar: "الحجر" },
                { en: "Air", ar: "الهواء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Man in best?", ar: "الإنسان في أحسن؟" },
                options: [
                { en: "Stature", ar: "تقويم" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Weakness", ar: "ضعف" },
                { en: "Poverty", ar: "فقر" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tafakkur means?", ar: "التفكّر يعني؟" },
                options: [
                { en: "Reflection", ar: "التأمّل" },
                { en: "Sleep", ar: "النوم" },
                { en: "Eating", ar: "الأكل" },
                { en: "Running", ar: "الركض" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Quran encourages?", ar: "القرآن يشجّع؟" },
                options: [
                { en: "Reflection on creation", ar: "التفكّر في الخلق" },
                { en: "Ignoring nature", ar: "تجاهل الطبيعة" },
                { en: "Sleeping", ar: "النوم" },
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
              { statement: { en: "The Quran encourages tafakkur.", ar: "القرآن يشجّع التفكّر." }, answer: true },
              { statement: { en: "Nature has no order.", ar: "الطبيعة بلا نظام." }, answer: false },
              { statement: { en: "Man was created in best stature.", ar: "الإنسان في أحسن تقويم." }, answer: true },
              { statement: { en: "All living things from fire.", ar: "كلّ حيّ من النار." }, answer: false },
              { statement: { en: "Day/night alternation is a sign.", ar: "تعاقب الليل والنهار آية." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Qudrah", ar: "قدرة" }, answer: { en: "Power of Allah", ar: "قدرة الله" } },
              { prompt: { en: "Khalq", ar: "خلق" }, answer: { en: "Creation", ar: "الخلق" } },
              { prompt: { en: "Tafakkur", ar: "تفكّر" }, answer: { en: "Reflection", ar: "التأمّل" } },
              { prompt: { en: "Ayat", ar: "آيات" }, answer: { en: "Signs in creation", ar: "آيات في الخلق" } },
              { prompt: { en: "Tawhid", ar: "توحيد" }, answer: { en: "Oneness of Allah", ar: "وحدانيّة الله" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Signs in creation for those of _______.", ar: "الآيات لأولي _______." }, blankAnswer: { en: "understanding", ar: "الألباب" } },
              { sentence: { en: "Man created in best _______.", ar: "الإنسان في أحسن _______." }, blankAnswer: { en: "stature", ar: "تقويم" } },
              { sentence: { en: "All living from _______.", ar: "كلّ حيّ من _______." }, blankAnswer: { en: "water", ar: "الماء" } },
              { sentence: { en: "Night and _______ alternation is a sign.", ar: "تعاقب الليل و_______ آية." }, blankAnswer: { en: "day", ar: "النهار" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Observe the sky, earth, and nature", ar: "تأمّل السماء والأرض والطبيعة" },
              { en: "Reflect on the human body\'s design", ar: "تفكّر في تصميم جسم الإنسان" },
              { en: "Recognise order and balance in creation", ar: "أدرك النظام والتوازن في الخلق" },
              { en: "Connect observations to Quranic verses", ar: "اربط الملاحظات بالآيات القرآنيّة" },
              { en: "Feel gratitude and humility", ar: "اشعر بالامتنان والتواضع" },
              { en: "Strengthen faith through reflection", ar: "قوِّ الإيمان بالتفكّر" },
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
