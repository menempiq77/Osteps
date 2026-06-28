import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const idgham: CourseLesson = {
  slug: "g6y7-the-rule-of-idgham",
  name: { en: "The Rule of Idgham", ar: "حُكمُ الإدغام" },
  shortIntro: {
    en: "The second rule of noon sakinah and tanwin: Idgham (merging). A precise study of its two types — with ghunnah (yarmaloon letters ي ن م و) and without ghunnah (ل ر) — why the noon disappears into the next letter, and how to recite it correctly.",
    ar: "ثاني أحكامِ النّونِ السّاكِنةِ والتَّنوين: الإدغام. دِراسةٌ دَقيقةٌ لِنَوعَيه — بِغُنّة (حُروفِ يَرمَلون: ي ن م و) وبِغَيرِ غُنّة (ل ر) — ولِماذا تَختَفي النّونُ في الحَرفِ التّالي، وكَيفَ يُتلى صَحيحًا.",
  },
  quranSurahs: ["Al-Baqarah 5", "Al-Ikhlas 4", "Al-Qadr 4"],
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
        title: { en: "Does pronunciation really matter in Quran?", ar: "هل النطق مهمّ فعلًا في القرآن؟" },
        body: {
          en: "A student reads Quran quickly without tajweed. He says: \'Allah knows what I mean. The meaning is what counts, not how I say the letters.\'",
          ar: "طالب يقرأ القرآن بسرعة بلا تجويد. يقول: «الله يعلم ما أعنيه. المعنى هو المهمّ وليس نطق الحروف.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using evidence on tajweed importance and Idgham.",
          ar: "انتقد بأدلّة عن أهمّيّة التجويد والإدغام.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Recite the Quran with tarteel.\' (Al-Muzzammil 4)",
        ar: "﴿ورتّل القرآن ترتيلًا﴾ (المزّمّل ٤)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Tajweed", ar: "تجويد" } },
          { image: IMG.grandMosque, keyword: { en: "Idgham", ar: "الإدغام" } },
          { image: IMG.lantern, keyword: { en: "Noon Sakinah", ar: "نون ساكنة" } },
          { image: IMG.bookshelf, keyword: { en: "Tanween", ar: "تنوين" } },
          { image: IMG.skyBlue, keyword: { en: "Tarteel", ar: "ترتيل" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Those to whom We gave the Book recite it with its true recital.\' (Al-Baqarah 121)",
        ar: "﴿الذين آتيناهم الكتاب يتلونه حقّ تلاوته﴾ (البقرة ١٢١)",
      },
    },
    {
      title: { en: "The Rule of Idgham", ar: "حُكمُ الإدغام" },
      learningObjectives: [
        { en: "Define Idgham and identify its letters.", ar: "أعرّف الإدغام وأحدّد حروفه." },
        { en: "Apply Idgham correctly in Quran recitation.", ar: "أطبّق الإدغام بشكل صحيح في التلاوة." },
      ],
      successCriteria: [
        { en: "I can define Idgham.", ar: "أعرّف الإدغام." },
        { en: "I can list the letters of Idgham.", ar: "أذكر حروف الإدغام." },
        { en: "I can identify Idgham in Quranic verses.", ar: "أحدّد الإدغام في الآيات القرآنيّة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Noon Sakinah and Tanween — Idgham", ar: "النون الساكنة والتنوين — الإدغام" },
      learningObjectives: [
        { en: "Master Idgham: Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah).", ar: "أتقن الإدغام: دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "What is Idgham?", ar: "ما الإدغام؟" },
          lines: [
            { en: "Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah). It applies when Noon Sakinah or Tanween is followed by: ي ر م ل و ن.", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها). ينطبق عندما تأتي النون الساكنة أو التنوين قبل: ي ر م ل و ن." },
          ],
        },
        {
          label: { en: "Letters of Idgham", ar: "حروف الإدغام" },
          lines: [
            { en: "The letters are: ي ر م ل و ن. Remember: يرملون.", ar: "الحروف هي: ي ر م ل و ن. تذكّر: يرملون." },
          ],
        },
        {
          label: { en: "Examples from Quran", ar: "أمثلة من القرآن" },
          lines: [
            { en: "مِنْ يَعْمَلُ — Idgham before ي. مِنْ رَبِّهِمْ — Idgham before ر. مِنْ وَلِيٍّ — Idgham before و.", ar: "مِنْ يَعْمَلُ — الإدغام قبل ياء. مِنْ رَبِّهِمْ — الإدغام قبل راء. مِنْ وَلِيٍّ — الإدغام قبل واو." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Idgham means merging noon sakinah/tanween into the next letter (with or without ghunnah).", ar: "الإدغام يعني دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)." }, answer: true },
        { statement: { en: "There are 3 letters of Idgham.", ar: "هناك ٣ حروف الإدغام." }, answer: false },
        { statement: { en: "Idgham applies to Noon Sakinah and Tanween.", ar: "الإدغام ينطبق على النون الساكنة والتنوين." }, answer: true },
        { statement: { en: "Idgham means clear pronunciation.", ar: "الإدغام يعني النطق الواضح." }, answer: false },
        { statement: { en: "Tajweed is obligatory when reciting Quran.", ar: "التجويد واجب عند قراءة القرآن." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Idgham means _______.", ar: "الإدغام يعني _______." }, answer: { en: "idgham", ar: "الإدغام" } },
        { sentence: { en: "There are _______ letters of Idgham.", ar: "هناك _______ حرفًا في الإدغام." }, answer: { en: "6", ar: "6" } },
        { sentence: { en: "Idgham applies to Noon _______ and Tanween.", ar: "الإدغام ينطبق على النون _______ والتنوين." }, answer: { en: "Sakinah", ar: "الساكنة" } },
        { sentence: { en: "\'Recite the Quran with _______.\' (Al-Muzzammil 4)", ar: "﴿ورتّل القرآن _______.﴾ (المزّمّل ٤)" }, answer: { en: "tarteel", ar: "ترتيلًا" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Idgham is a key tajweed rule for Noon Sakinah and Tanween. Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah).",
        ar: "الإدغام حكم أساسي من أحكام النون الساكنة والتنوين. دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها).",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Practise identifying and applying Idgham in Quran.", ar: "تدرّب على تحديد وتطبيق الإدغام في القرآن." },
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
            title: { en: "Definition and Letters", ar: "التعريف والحروف" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Master Idgham", ar: "أتقن الإدغام" },
            infoSections: [
              { label: { en: "Rule", ar: "قاعدة" }, content: { en: "Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah). Letters: ي ر م ل و ن.", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها). الحروف: ي ر م ل و ن." } },
              { label: { en: "Mnemonic", ar: "طريقة حفظ" }, content: { en: "Remember: يرملون.", ar: "تذكّر: يرملون." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Mastering each rule perfects your recitation.", ar: "إتقان كلّ قاعدة يتقن تلاوتك." } },
            ],
            task: {
              title: { en: "Create a Rule Chart", ar: "أنشئ جدول قواعد" },
              description: { en: "Design a chart showing Idgham with letters and examples.", ar: "صمّم جدولًا يُظهر الإدغام مع الحروف والأمثلة." },
              hint: { en: "Include: definition, letters, Quran examples, pronunciation.", ar: "ضمّن: التعريف والحروف والأمثلة والنطق." },
            },
          },
          {
            id: "B",
            title: { en: "Finding Examples", ar: "إيجاد الأمثلة" },
            image: IMG.bookshelf,
            color: "blue",
            topic: { en: "Spot the rule in Quran", ar: "حدّد القاعدة في القرآن" },
            infoSections: [
              { label: { en: "Method", ar: "طريقة" }, content: { en: "Look for noon sakinah/tanween before the specific letters.", ar: "ابحث عن نون ساكنة/تنوين قبل الحروف المحدّدة." } },
              { label: { en: "Tip", ar: "نصيحة" }, content: { en: "Read slowly and mark each instance.", ar: "اقرأ ببطء وحدّد كلّ حالة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Practice makes perfect.", ar: "التدريب يصنع الإتقان." } },
            ],
            task: {
              title: { en: "Find 10 Examples", ar: "أوجد ١٠ أمثلة" },
              description: { en: "Find 10 examples of Idgham from Juz Amma.", ar: "أوجد ١٠ أمثلة الإدغام من جزء عمّ." },
              hint: { en: "Write: surah, ayah, word, letter.", ar: "اكتب: السورة والآية والكلمة والحرف." },
            },
          },
          {
            id: "C",
            title: { en: "Comparing Rules", ar: "مقارنة القواعد" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "How rules differ", ar: "كيف تختلف القواعد" },
            infoSections: [
              { label: { en: "Comparison", ar: "مقارنة" }, content: { en: "Izhar = clear. Idgham = merge. Ikhfa = hide. Iqlab = change.", ar: "إظهار = واضح. إدغام = دمج. إخفاء = إخفاء. إقلاب = تحويل." } },
              { label: { en: "Key", ar: "مفتاح" }, content: { en: "The letter after noon sakinah determines the rule.", ar: "الحرف بعد النون يحدّد القاعدة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Each rule has a unique sound.", ar: "لكلّ قاعدة صوت مميّز." } },
            ],
            task: {
              title: { en: "Compare All Four Rules", ar: "قارن القواعد الأربع" },
              description: { en: "Create a table comparing Izhar, Idgham, Ikhfa, Iqlab.", ar: "أنشئ جدولًا يقارن الإظهار والإدغام والإخفاء والإقلاب." },
              hint: { en: "Include: definition, letters, sound, examples.", ar: "ضمّن: التعريف والحروف والصوت والأمثلة." },
            },
          },
          {
            id: "D",
            title: { en: "Practice Recitation", ar: "تدرّب على التلاوة" },
            image: IMG.grandMosque,
            color: "amber",
            topic: { en: "Apply in reading", ar: "طبّق في القراءة" },
            infoSections: [
              { label: { en: "Tip", ar: "نصيحة" }, content: { en: "Identify the rule before reading each word.", ar: "حدّد القاعدة قبل قراءة كلّ كلمة." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The skilled reciter is with noble angels.\' (Bukhari)", ar: "«الماهر مع السفرة الكرام.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Beautiful recitation is worship.", ar: "التلاوة الجميلة عبادة." } },
            ],
            task: {
              title: { en: "Practise Reading", ar: "تدرّب على القراءة" },
              description: { en: "Read 5 ayahs applying Idgham correctly.", ar: "اقرأ ٥ آيات بتطبيق الإدغام بشكل صحيح." },
              hint: { en: "Mark each Idgham instance.", ar: "حدّد كلّ حالة." },
            },
          },
          {
            id: "E",
            title: { en: "Teaching Tajweed", ar: "تعليم التجويد" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Share your knowledge", ar: "شارك علمك" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The best of you learn Quran and teach it.\' (Bukhari)", ar: "«خيركم من تعلّم القرآن وعلّمه.» (البخاري)" } },
              { label: { en: "Tip", ar: "نصيحة" }, content: { en: "Use simple language and examples.", ar: "استخدم لغة بسيطة وأمثلة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Teaching reinforces your own learning.", ar: "التعليم يعزّز تعلّمك." } },
            ],
            task: {
              title: { en: "Create a Teaching Poster", ar: "أنشئ ملصقًا تعليميًّا" },
              description: { en: "Design a poster teaching Idgham to beginners.", ar: "صمّم ملصقًا لتعليم الإدغام للمبتدئين." },
              hint: { en: "Include: definition, letters, mnemonic, examples.", ar: "ضمّن: التعريف والحروف وطريقة الحفظ والأمثلة." },
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
            question: { en: "What does Idgham mean?", ar: "ما معنى الإدغام؟" },
            options: [
            { en: "Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah)", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)" },
            { en: "Silence", ar: "صمت" },
            { en: "Shouting", ar: "صراخ" },
            { en: "Skipping", ar: "تخطّي" },
            ],
            correctIndex: 0,
            explanation: { en: "Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah).", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)." },
          },
          {
            question: { en: "How many letters of Idgham?", ar: "كم حرفًا في الإدغام؟" },
            options: [
            { en: "6", ar: "6" },
            { en: "2", ar: "٢" },
            { en: "10", ar: "١٠" },
            { en: "1", ar: "١" },
            ],
            correctIndex: 0,
            explanation: { en: "6 letters.", ar: "6 حرفًا." },
          },
          {
            question: { en: "Idgham applies to?", ar: "الإدغام ينطبق على؟" },
            options: [
            { en: "Noon Sakinah and Tanween", ar: "النون الساكنة والتنوين" },
            { en: "Meem only", ar: "الميم فقط" },
            { en: "Lam only", ar: "اللام فقط" },
            { en: "All letters", ar: "كلّ الحروف" },
            ],
            correctIndex: 0,
            explanation: { en: "Noon Sakinah and Tanween.", ar: "النون الساكنة والتنوين." },
          },
          {
            question: { en: "Which is a letter of Idgham?", ar: "أيّ حرف من حروف الإدغام؟" },
            options: [
            { en: "ي", ar: "ياء" },
            { en: "ب", ar: "ب" },
            { en: "ت", ar: "ت" },
            { en: "ل", ar: "ل" },
            ],
            correctIndex: 0,
            explanation: { en: "ي is a letter of Idgham.", ar: "ياء حرف الإدغام." },
          },
          {
            question: { en: "مِنْ يَعْمَلُ — what rule?", ar: "مِنْ يَعْمَلُ — أيّ حكم؟" },
            options: [
            { en: "Idgham", ar: "الإدغام" },
            { en: "Izhar", ar: "إظهار" },
            { en: "Waqf", ar: "وقف" },
            { en: "Madd", ar: "مدّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Idgham.", ar: "الإدغام." },
          },
          {
            question: { en: "Is tajweed obligatory?", ar: "هل التجويد واجب؟" },
            options: [
            { en: "Yes", ar: "نعم" },
            { en: "No", ar: "لا" },
            { en: "Optional", ar: "اختياري" },
            { en: "Only for scholars", ar: "للعلماء فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Yes, obligatory when reciting Quran.", ar: "نعم واجب عند قراءة القرآن." },
          },
          {
            question: { en: "What verse commands tajweed?", ar: "أيّ آية تأمر بالتجويد؟" },
            options: [
            { en: "Al-Muzzammil 4", ar: "المزّمّل ٤" },
            { en: "Al-Fatiha 1", ar: "الفاتحة ١" },
            { en: "Al-Nas 1", ar: "الناس ١" },
            { en: "Al-Ikhlas 1", ar: "الإخلاص ١" },
            ],
            correctIndex: 0,
            explanation: { en: "Al-Muzzammil 4.", ar: "المزّمّل ٤." },
          },
          {
            question: { en: "What is Noon Sakinah?", ar: "ما النون الساكنة؟" },
            options: [
            { en: "Noon with sukun", ar: "نون عليها سكون" },
            { en: "Noon with fathah", ar: "نون بفتحة" },
            { en: "Any noon", ar: "أيّ نون" },
            { en: "Letter ba", ar: "حرف باء" },
            ],
            correctIndex: 0,
            explanation: { en: "Noon with sukun (no vowel).", ar: "نون عليها سكون." },
          },
          {
            question: { en: "Skilled Quran reciter is with?", ar: "الماهر في القرآن مع؟" },
            options: [
            { en: "Noble angels", ar: "السفرة الكرام" },
            { en: "Kings", ar: "الملوك" },
            { en: "Scholars", ar: "العلماء" },
            { en: "No one", ar: "لا أحد" },
            ],
            correctIndex: 0,
            explanation: { en: "Noble angels (Bukhari).", ar: "السفرة الكرام (البخاري)." },
          },
          {
            question: { en: "Best people regarding Quran?", ar: "خير الناس في القرآن؟" },
            options: [
            { en: "Learn and teach it", ar: "تعلّمه وعلّمه" },
            { en: "Just memorise", ar: "الحفظ فقط" },
            { en: "Read quickly", ar: "القراءة السريعة" },
            { en: "Skip tajweed", ar: "تخطّي التجويد" },
            ],
            correctIndex: 0,
            explanation: { en: "Those who learn and teach (Bukhari).", ar: "من تعلّمه وعلّمه (البخاري)." },
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
        title: { en: "Noon Sakinah — Idgham", ar: "النون الساكنة — الإدغام" },
        url: "https://www.youtube.com/watch?v=T4auGhmeBlw",
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
        code: "IDGHAM01",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Rule of Idgham", ar: "ورقة عمل — حُكمُ الإدغام" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Rule of Idgham", ar: "ورقة عمل — حُكمُ الإدغام" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "What is Idgham?", ar: "ما الإدغام؟" },
                options: [
                { en: "Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah)", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)" },
                { en: "Silence", ar: "صمت" },
                { en: "Shouting", ar: "صراخ" },
                { en: "Skipping", ar: "تخطّي" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How many letters?", ar: "كم حرفًا؟" },
                options: [
                { en: "6", ar: "6" },
                { en: "2", ar: "٢" },
                { en: "10", ar: "١٠" },
                { en: "1", ar: "١" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Applies to?", ar: "ينطبق على؟" },
                options: [
                { en: "Noon Sakinah/Tanween", ar: "النون الساكنة/التنوين" },
                { en: "Meem", ar: "الميم" },
                { en: "Lam", ar: "اللام" },
                { en: "All", ar: "الكلّ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tajweed is?", ar: "التجويد؟" },
                options: [
                { en: "Obligatory", ar: "واجب" },
                { en: "Optional", ar: "اختياري" },
                { en: "Forbidden", ar: "محرّم" },
                { en: "Disliked", ar: "مكروه" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "مِنْ رَبِّهِمْ — rule?", ar: "مِنْ رَبِّهِمْ — حكم؟" },
                options: [
                { en: "Idgham", ar: "الإدغام" },
                { en: "Waqf", ar: "وقف" },
                { en: "Madd", ar: "مدّ" },
                { en: "Ghunnah", ar: "غنّة" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Idgham is a tajweed rule.", ar: "الإدغام حكم تجويدي." }, answer: true },
              { statement: { en: "There are 10 letters of Idgham.", ar: "هناك ١٠ حروف الإدغام." }, answer: false },
              { statement: { en: "Tajweed is obligatory.", ar: "التجويد واجب." }, answer: true },
              { statement: { en: "Idgham applies to Meem Sakinah.", ar: "الإدغام ينطبق على الميم الساكنة." }, answer: false },
              { statement: { en: "Noon Sakinah and Tanween both use Idgham.", ar: "النون الساكنة والتنوين كلاهما يستخدم الإدغام." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Idgham", ar: "الإدغام" }, answer: { en: "Merging Noon Sakinah/Tanween into the next letter (with or without ghunnah)", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)" } },
              { prompt: { en: "Noon Sakinah", ar: "نون ساكنة" }, answer: { en: "Noon with sukun", ar: "نون بسكون" } },
              { prompt: { en: "Tanween", ar: "تنوين" }, answer: { en: "Double vowel mark", ar: "حركة مزدوجة" } },
              { prompt: { en: "Tarteel", ar: "ترتيل" }, answer: { en: "Measured recitation", ar: "القراءة المرتّلة" } },
              { prompt: { en: "Makhraj", ar: "مخرج" }, answer: { en: "Articulation point", ar: "نقطة النطق" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Idgham means _______.", ar: "الإدغام يعني _______." }, blankAnswer: { en: "idgham", ar: "دمج النون الساكنة/التنوين في الحرف التالي (بغنّة أو بدونها)" } },
              { sentence: { en: "There are _______ letters of Idgham.", ar: "هناك _______ حرفًا." }, blankAnswer: { en: "6", ar: "6" } },
              { sentence: { en: "Idgham applies to Noon _______ and Tanween.", ar: "ينطبق على النون _______ والتنوين." }, blankAnswer: { en: "Sakinah", ar: "الساكنة" } },
              { sentence: { en: "Recite the Quran with _______. (Al-Muzzammil 4)", ar: "رتّل القرآن _______. (المزّمّل ٤)" }, blankAnswer: { en: "tarteel", ar: "ترتيلًا" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn Noon Sakinah and Tanween", ar: "تعلّم النون الساكنة والتنوين" },
              { en: "Learn the definition of Idgham", ar: "تعلّم تعريف الإدغام" },
              { en: "Memorise the letters of Idgham", ar: "احفظ حروف الإدغام" },
              { en: "Identify Idgham in Quran", ar: "حدّد الإدغام في القرآن" },
              { en: "Practise correct pronunciation", ar: "تدرّب على النطق الصحيح" },
              { en: "Apply Idgham in full recitation", ar: "طبّق الإدغام في التلاوة" },
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
