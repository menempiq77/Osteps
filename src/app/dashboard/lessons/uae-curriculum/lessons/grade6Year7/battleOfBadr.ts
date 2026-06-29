import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const battleOfBadr: CourseLesson = {
  slug: "g6y7-the-great-battle-of-badr",
  name: { en: "The Great Battle of Badr", ar: "غَزوةُ بَدرٍ الكُبرى" },
  shortIntro: {
    en: "The Day of Criterion (Yawm al-Furqan): how 313 ill-equipped believers, with Allah\'s help, defeated a much larger Quraysh army in the second year after the Hijrah. A deep study of the causes, the events, and the timeless lessons of faith, reliance on Allah, and the means of victory.",
    ar: "يَومُ الفُرقان: كَيفَ انتَصَرَ ثَلاثُمِئةٍ وثَلاثةَ عَشَرَ مُؤمِنًا قَليلي العُدّةِ، بِعَونِ الله، على جَيشِ قُرَيشٍ الأكبَرِ في السَّنةِ الثّانيةِ لِلهِجرة. دِراسةٌ عَميقةٌ لِأسبابِها وأحداثِها ودُروسِها الخالِدةِ في الإيمانِ والتَّوَكُّلِ وأخذِ الأسباب.",
  },
  quranSurahs: ["Al-Anfal 9", "Al-Anfal 17", "Aal 'Imran 123"],
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
        title: { en: "Was Badr just a lucky victory?", ar: "هل بدر مجرّد انتصار محظوظ؟" },
        body: {
          en: "A student says: \'The Muslims won Badr because they were lucky. Any army could have won that day. Divine help is just a story to motivate people.\'",
          ar: "طالب يقول: «المسلمون فازوا ببدر لأنّهم محظوظون. أيّ جيش كان سيفوز. المعونة الإلهيّة مجرّد قصّة.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran on Allah\'s help at Badr.",
          ar: "انتقد بالقرآن عن نصر الله في بدر.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Already there has been for you a sign in the two armies which met — one fighting in the cause of Allah.\' (Aal-Imran 13)",
        ar: "﴿قد كان لكم آية في فئتين التقتا فئة تقاتل في سبيل الله﴾ (آل عمران ١٣)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.skyBlue, keyword: { en: "Badr (The battle)", ar: "بدر" } },
          { image: IMG.grandMosque, keyword: { en: "Nasr (Victory)", ar: "نصر" } },
          { image: IMG.childQuran, keyword: { en: "Malaaikah (Angels)", ar: "ملائكة" } },
          { image: IMG.lantern, keyword: { en: "Sabr (Patience)", ar: "صبر" } },
          { image: IMG.bookshelf, keyword: { en: "Tawakkul (Reliance)", ar: "توكّل" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Remember when you asked your Lord for help and He answered: I will reinforce you with a thousand angels.\' (Al-Anfal 9)",
        ar: "﴿إذ تستغيثون ربّكم فاستجاب لكم أنّي ممدّكم بألف من الملائكة﴾ (الأنفال ٩)",
      },
    },
    {
      title: { en: "The Great Battle of Badr", ar: "غَزوةُ بَدرٍ الكُبرى" },
      learningObjectives: [
        { en: "Describe the causes and events of the Battle of Badr.", ar: "أصف أسباب وأحداث غزوة بدر." },
        { en: "Explain the lessons and significance of the Muslim victory.", ar: "أشرح دروس وأهمّيّة انتصار المسلمين." },
      ],
      successCriteria: [
        { en: "I can list the causes of the Battle of Badr.", ar: "أذكر أسباب غزوة بدر." },
        { en: "I can describe the key events of the battle.", ar: "أصف أهمّ أحداث المعركة." },
        { en: "I can explain 3 lessons from Badr.", ar: "أشرح ٣ دروس من بدر." },
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
      title: { en: "The Battle of Badr — The First Great Victory", ar: "غزوة بدر — أوّل انتصار عظيم" },
      learningObjectives: [
        { en: "Understand the Battle of Badr and its lessons for Muslims.", ar: "أفهم غزوة بدر ودروسها للمسلمين." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Background and Causes", ar: "الخلفيّة والأسباب" },
          lines: [
            { en: "17 Ramadan 2 AH. Muslims (313) vs Quraysh (1000). The Muslim caravan was seized by Quraysh. Abu Sufyan\'s trade caravan triggered the confrontation.", ar: "١٧ رمضان ٢ هـ. المسلمون (٣١٣) ضدّ قريش (١٠٠٠). صادرت قريش قافلة المسلمين. قافلة أبي سفيان أشعلت المواجهة." },
          ],
        },
        {
          label: { en: "Key Events", ar: "الأحداث الرئيسيّة" },
          lines: [
            { en: "The Prophet consulted the Sahabah. He positioned troops at the wells of Badr. Made dua all night. Allah sent angels (Al-Anfal 9). Key Quraysh leaders killed: Abu Jahl, Umayyah ibn Khalaf.", ar: "استشار النبيّ الصحابة. وضع الجيش عند آبار بدر. دعا الله طوال الليل. أرسل الله الملائكة (الأنفال ٩). قُتل قادة قريش: أبو جهل وأميّة بن خلف." },
          ],
        },
        {
          label: { en: "Lessons from Badr", ar: "دروس من بدر" },
          lines: [
            { en: "Trust in Allah (tawakkul), consultation (shura), patience, planning, and that numbers do not determine victory.", ar: "التوكّل على الله والشورى والصبر والتخطيط وأنّ العدد لا يحدّد النصر." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "The Battle of Badr was in 2 AH.", ar: "غزوة بدر كانت في ٢ هـ." }, answer: true },
        { statement: { en: "Muslims outnumbered the Quraysh.", ar: "المسلمون كانوا أكثر من قريش." }, answer: false },
        { statement: { en: "Allah sent angels to help.", ar: "أرسل الله ملائكة للنصر." }, answer: true },
        { statement: { en: "The Prophet did not consult anyone.", ar: "النبيّ لم يستشر أحدًا." }, answer: false },
        { statement: { en: "Badr happened in Ramadan.", ar: "بدر كانت في رمضان." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "The Muslims numbered _______ at Badr.", ar: "عدد المسلمين في بدر _______." }, answer: { en: "313", ar: "٣١٣" } },
        { sentence: { en: "Quraysh numbered about _______.", ar: "عدد قريش نحو _______." }, answer: { en: "1000", ar: "١٠٠٠" } },
        { sentence: { en: "Allah sent _______ to help the Muslims.", ar: "أرسل الله _______ لنصر المسلمين." }, answer: { en: "angels", ar: "الملائكة" } },
        { sentence: { en: "Badr happened in the month of _______.", ar: "بدر كانت في شهر _______." }, answer: { en: "Ramadan", ar: "رمضان" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Badr was the first decisive battle — 313 Muslims vs 1000 Quraysh. Allah sent angels and granted victory.",
        ar: "بدر أوّل معركة حاسمة — ٣١٣ مسلمًا ضدّ ١٠٠٠ من قريش. أرسل الله الملائكة ونصرهم.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore Badr from different perspectives.", ar: "استكشف بدر من زوايا مختلفة." },
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
            title: { en: "Causes of Battle", ar: "أسباب المعركة" },
            image: IMG.bookshelf,
            color: "teal",
            topic: { en: "Why Badr happened", ar: "لماذا وقعت بدر" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Quraysh seized Muslim property in Makkah after Hijrah.", ar: "صادرت قريش أموال المسلمين بعد الهجرة." } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Permission is given to those who fight because they were wronged.\' (Al-Hajj 39)", ar: "﴿أُذن للذين يُقاتَلون بأنّهم ظُلموا﴾ (الحجّ ٣٩)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Fighting for justice is permitted, not aggression.", ar: "القتال للعدل مباح لا العدوان." } },
            ],
            task: {
              title: { en: "Analyse the Causes", ar: "حلّل الأسباب" },
              description: { en: "Write the chain of events leading to Badr.", ar: "اكتب سلسلة الأحداث المؤدّية لبدر." },
              hint: { en: "Include: persecution, Hijrah, property seizure, caravan.", ar: "ضمّن: الاضطهاد والهجرة والمصادرة والقافلة." },
            },
          },
          {
            id: "B",
            title: { en: "The Prophet\'s Strategy", ar: "استراتيجيّة النبيّ" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Planning and consultation", ar: "التخطيط والشورى" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "He consulted Ansar and Muhajirin before fighting.", ar: "استشار الأنصار والمهاجرين قبل القتال." } },
              { label: { en: "Strategy", ar: "تكتيك" }, content: { en: "Positioned at the wells, blocked Quraysh from water.", ar: "تمركز عند الآبار وحرم قريشًا من الماء." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Good leadership combines consultation and strategy.", ar: "القيادة الجيّدة تجمع الشورى والتخطيط." } },
            ],
            task: {
              title: { en: "Draw the Battle Plan", ar: "ارسم خطّة المعركة" },
              description: { en: "Create a diagram of the battle positions.", ar: "أنشئ مخطّطًا لمواقع المعركة." },
              hint: { en: "Include: wells, Muslim position, Quraysh position.", ar: "ضمّن: الآبار ومواقع المسلمين وقريش." },
            },
          },
          {
            id: "C",
            title: { en: "Divine Help", ar: "النصر الإلهي" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Angels at Badr", ar: "الملائكة في بدر" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'I will reinforce you with a thousand angels.\' (Al-Anfal 9)", ar: "﴿أنّي ممدّكم بألف من الملائكة﴾ (الأنفال ٩)" } },
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "The Prophet made dua all night: \'O Allah, if this group is destroyed, You will not be worshipped on earth.\'", ar: "دعا النبيّ طوال الليل: «اللهمّ إن تُهلك هذه العصابة لا تُعبد في الأرض.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Human effort + divine help = victory.", ar: "الجهد البشري + العون الإلهي = النصر." } },
            ],
            task: {
              title: { en: "Write About Divine Help", ar: "اكتب عن العون الإلهي" },
              description: { en: "Explain how Allah helped at Badr with evidence.", ar: "اشرح كيف نصر الله في بدر بالأدلّة." },
              hint: { en: "Include: angels, rain, sleep, courage.", ar: "ضمّن: الملائكة والمطر والنعاس والشجاعة." },
            },
          },
          {
            id: "D",
            title: { en: "Key Figures", ar: "شخصيّات رئيسيّة" },
            image: IMG.childQuran,
            color: "amber",
            topic: { en: "Heroes and villains", ar: "أبطال وأشرار" },
            infoSections: [
              { label: { en: "Heroes", ar: "أبطال" }, content: { en: "Ali, Hamzah, Abu Bakr — fought bravely.", ar: "عليّ وحمزة وأبو بكر — قاتلوا بشجاعة." } },
              { label: { en: "Villains", ar: "أشرار" }, content: { en: "Abu Jahl — enemy of Islam, killed at Badr.", ar: "أبو جهل — عدوّ الإسلام قُتل في بدر." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Standing for truth requires courage.", ar: "الوقوف مع الحقّ يحتاج شجاعة." } },
            ],
            task: {
              title: { en: "Create Character Profiles", ar: "أنشئ ملفّات شخصيّات" },
              description: { en: "Write profiles of 4 key figures at Badr.", ar: "اكتب ملفّات ٤ شخصيّات رئيسيّة في بدر." },
              hint: { en: "Include: name, role, key action, lesson.", ar: "ضمّن: الاسم والدور والعمل والدرس." },
            },
          },
          {
            id: "E",
            title: { en: "Lessons for Today", ar: "دروس لليوم" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "What Badr teaches us", ar: "ماذا تعلّمنا بدر" },
            infoSections: [
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Tawakkul: trust Allah while planning.", ar: "التوكّل: ثق بالله مع التخطيط." } },
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Numbers do not determine success — quality and faith do.", ar: "العدد لا يحدّد النجاح — الجودة والإيمان." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Apply shura, patience, and trust in daily life.", ar: "طبّق الشورى والصبر والتوكّل يوميًّا." } },
            ],
            task: {
              title: { en: "Apply Badr Lessons", ar: "طبّق دروس بدر" },
              description: { en: "Write 5 ways Badr lessons apply to your life.", ar: "اكتب ٥ تطبيقات لدروس بدر في حياتك." },
              hint: { en: "Include: school, family, challenges, decisions.", ar: "ضمّن: المدرسة والعائلة والتحدّيات والقرارات." },
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
            question: { en: "When was Badr?", ar: "متى كانت بدر؟" },
            options: [
            { en: "2 AH / Ramadan", ar: "٢ هـ / رمضان" },
            { en: "1 AH", ar: "١ هـ" },
            { en: "5 AH", ar: "٥ هـ" },
            { en: "10 AH", ar: "١٠ هـ" },
            ],
            correctIndex: 0,
            explanation: { en: "17 Ramadan 2 AH.", ar: "١٧ رمضان ٢ هـ." },
          },
          {
            question: { en: "How many Muslims?", ar: "كم عدد المسلمين؟" },
            options: [
            { en: "313", ar: "٣١٣" },
            { en: "1000", ar: "١٠٠٠" },
            { en: "10000", ar: "١٠٠٠٠" },
            { en: "50", ar: "٥٠" },
            ],
            correctIndex: 0,
            explanation: { en: "313 Muslims.", ar: "٣١٣ مسلمًا." },
          },
          {
            question: { en: "How many Quraysh?", ar: "كم عدد قريش؟" },
            options: [
            { en: "About 1000", ar: "نحو ١٠٠٠" },
            { en: "313", ar: "٣١٣" },
            { en: "100", ar: "١٠٠" },
            { en: "50", ar: "٥٠" },
            ],
            correctIndex: 0,
            explanation: { en: "About 1000.", ar: "نحو ١٠٠٠." },
          },
          {
            question: { en: "Who sent angels?", ar: "من أرسل الملائكة؟" },
            options: [
            { en: "Allah", ar: "الله" },
            { en: "Jibril alone", ar: "جبريل وحده" },
            { en: "The Prophet", ar: "النبيّ" },
            { en: "Abu Bakr", ar: "أبو بكر" },
            ],
            correctIndex: 0,
            explanation: { en: "Allah sent angels (Al-Anfal 9).", ar: "الله (الأنفال ٩)." },
          },
          {
            question: { en: "Who was killed at Badr?", ar: "من قُتل في بدر؟" },
            options: [
            { en: "Abu Jahl", ar: "أبو جهل" },
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Umar", ar: "عمر" },
            { en: "Ali", ar: "عليّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Abu Jahl, enemy of Islam.", ar: "أبو جهل عدوّ الإسلام." },
          },
          {
            question: { en: "What did the Prophet do the night before?", ar: "ماذا فعل النبيّ ليلة المعركة؟" },
            options: [
            { en: "Made dua all night", ar: "دعا طوال الليل" },
            { en: "Slept", ar: "نام" },
            { en: "Left", ar: "غادر" },
            { en: "Ate", ar: "أكل" },
            ],
            correctIndex: 0,
            explanation: { en: "Made dua all night long.", ar: "دعا طوال الليل." },
          },
          {
            question: { en: "What principle did the Prophet use?", ar: "أيّ مبدأ استخدم النبيّ؟" },
            options: [
            { en: "Shura (consultation)", ar: "الشورى" },
            { en: "Dictatorship", ar: "الاستبداد" },
            { en: "Ignoring advice", ar: "تجاهل النصيحة" },
            { en: "Running away", ar: "الهروب" },
            ],
            correctIndex: 0,
            explanation: { en: "Shura — consultation.", ar: "الشورى." },
          },
          {
            question: { en: "What was the outcome?", ar: "ما كانت النتيجة؟" },
            options: [
            { en: "Muslim victory", ar: "انتصار المسلمين" },
            { en: "Quraysh victory", ar: "انتصار قريش" },
            { en: "Draw", ar: "تعادل" },
            { en: "Retreat", ar: "انسحاب" },
            ],
            correctIndex: 0,
            explanation: { en: "Decisive Muslim victory.", ar: "انتصار مسلم حاسم." },
          },
          {
            question: { en: "Badr was which number battle?", ar: "بدر المعركة رقم كم؟" },
            options: [
            { en: "First major battle", ar: "أوّل معركة كبرى" },
            { en: "Last battle", ar: "آخر معركة" },
            { en: "Fifth", ar: "الخامسة" },
            { en: "Tenth", ar: "العاشرة" },
            ],
            correctIndex: 0,
            explanation: { en: "First major battle in Islam.", ar: "أوّل معركة كبرى في الإسلام." },
          },
          {
            question: { en: "What does tawakkul mean?", ar: "ما التوكّل؟" },
            options: [
            { en: "Reliance on Allah with effort", ar: "الاعتماد على الله مع الجهد" },
            { en: "Laziness", ar: "الكسل" },
            { en: "Fighting", ar: "القتال" },
            { en: "Running", ar: "الركض" },
            ],
            correctIndex: 0,
            explanation: { en: "Trust Allah while taking action.", ar: "الاعتماد على الله مع العمل." },
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
        title: { en: "Battle of Badr", ar: "غزوة بدر" },
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
        code: "BADR0001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Great Battle of Badr", ar: "ورقة عمل — غَزوةُ بَدرٍ الكُبرى" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Great Battle of Badr", ar: "ورقة عمل — غَزوةُ بَدرٍ الكُبرى" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "When was Badr?", ar: "متى كانت بدر؟" },
                options: [
                { en: "2 AH", ar: "٢ هـ" },
                { en: "5 AH", ar: "٥ هـ" },
                { en: "10 AH", ar: "١٠ هـ" },
                { en: "1 AH", ar: "١ هـ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Muslims numbered?", ar: "عدد المسلمين؟" },
                options: [
                { en: "313", ar: "٣١٣" },
                { en: "1000", ar: "١٠٠٠" },
                { en: "500", ar: "٥٠٠" },
                { en: "50", ar: "٥٠" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Allah sent?", ar: "الله أرسل؟" },
                options: [
                { en: "Angels", ar: "ملائكة" },
                { en: "Money", ar: "مالًا" },
                { en: "Food", ar: "طعامًا" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Key enemy killed?", ar: "العدوّ الرئيسي الذي قُتل؟" },
                options: [
                { en: "Abu Jahl", ar: "أبو جهل" },
                { en: "Abu Bakr", ar: "أبو بكر" },
                { en: "Hamzah", ar: "حمزة" },
                { en: "Umar", ar: "عمر" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Month of battle?", ar: "شهر المعركة؟" },
                options: [
                { en: "Ramadan", ar: "رمضان" },
                { en: "Shawwal", ar: "شوّال" },
                { en: "Rajab", ar: "رجب" },
                { en: "Safar", ar: "صفر" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Badr was the first major battle.", ar: "بدر أوّل معركة كبرى." }, answer: true },
              { statement: { en: "Muslims outnumbered Quraysh.", ar: "المسلمون فاقوا قريشًا عددًا." }, answer: false },
              { statement: { en: "Allah sent angels.", ar: "أرسل الله ملائكة." }, answer: true },
              { statement: { en: "The Prophet did not plan.", ar: "النبيّ لم يخطّط." }, answer: false },
              { statement: { en: "Badr was in Ramadan.", ar: "بدر كانت في رمضان." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Badr", ar: "بدر" }, answer: { en: "First major battle in Islam", ar: "أوّل معركة كبرى" } },
              { prompt: { en: "Shura", ar: "شورى" }, answer: { en: "Consultation", ar: "المشاورة" } },
              { prompt: { en: "Tawakkul", ar: "توكّل" }, answer: { en: "Reliance on Allah", ar: "الاعتماد على الله" } },
              { prompt: { en: "Nasr", ar: "نصر" }, answer: { en: "Victory", ar: "الانتصار" } },
              { prompt: { en: "Malaaikah", ar: "ملائكة" }, answer: { en: "Angels", ar: "ملائكة الله" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Muslims numbered _______ at Badr.", ar: "عدد المسلمين _______ في بدر." }, blankAnswer: { en: "313", ar: "٣١٣" } },
              { sentence: { en: "Quraysh numbered about _______.", ar: "عدد قريش نحو _______." }, blankAnswer: { en: "1000", ar: "١٠٠٠" } },
              { sentence: { en: "Allah sent _______ to help.", ar: "أرسل الله _______ للنصر." }, blankAnswer: { en: "angels", ar: "الملائكة" } },
              { sentence: { en: "Badr was in _______ 2 AH.", ar: "بدر في _______ ٢ هـ." }, blankAnswer: { en: "Ramadan", ar: "رمضان" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Quraysh seizes Muslim property", ar: "قريش تصادر أموال المسلمين" },
              { en: "Muslims intercept the caravan", ar: "المسلمون يعترضون القافلة" },
              { en: "Prophet consults the Sahabah (shura)", ar: "النبيّ يستشير الصحابة" },
              { en: "Prophet positions at the wells", ar: "النبيّ يتمركز عند الآبار" },
              { en: "Allah sends angels and grants victory", ar: "الله يرسل الملائكة وينصر" },
              { en: "Muslims win despite being outnumbered", ar: "المسلمون ينتصرون رغم قلّة العدد" },
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
