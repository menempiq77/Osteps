import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const scientificThinking: CourseLesson = {
  slug: "g6y7-scientific-thinking",
  name: { en: "Scientific Thinking", ar: "التَّفكيرُ العِلميّ" },
  shortIntro: {
    en: "Islam honours the mind and commands us to observe, reflect, and seek knowledge. A deep study of how the Qur\'an invites scientific thinking — looking into creation as a path to faith — and how the Muslim balances reason and revelation.",
    ar: "يُكَرِّمُ الإسلامُ العَقلَ ويَأمُرُنا بِالمُلاحَظةِ والتَّأمُّلِ وطَلَبِ العِلم. دِراسةٌ عَميقةٌ لِكَيفَ يَدعو القُرآنُ إلى التَّفكيرِ العِلميِّ — النَّظَرِ في الخَلقِ طَريقًا إلى الإيمان — وكَيفَ يُوازِنُ المُسلِمُ بَينَ العَقلِ والوَحي.",
  },
  quranSurahs: ["Aal Imran 190-191", "Al-Ghashiyah 17-20", "Az-Zumar 9"],
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
        title: { en: "Does Islam oppose science?", ar: "هل الإسلام يعارض العلم؟" },
        body: {
          en: "A student says: \'Islam and science are enemies. Religion tells you to believe blindly. Science requires evidence. You cannot be a Muslim and a scientist.\'",
          ar: "طالب يقول: «الإسلام والعلم أعداء. الدين يأمرك بالإيمان الأعمى. العلم يحتاج أدلّة. لا يمكنك أن تكون مسلمًا وعالمًا.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and history of Muslim scientists.",
          ar: "انتقد بالقرآن وتاريخ العلماء المسلمين.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Read in the name of your Lord who created.\' (Al-Alaq 1)",
        ar: "﴿اقرأ باسم ربّك الذي خلق﴾ (العلق ١)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Ilm (Knowledge)", ar: "علم" } },
          { image: IMG.bookshelf, keyword: { en: "Tajribah (Experiment)", ar: "تجربة" } },
          { image: IMG.skyBlue, keyword: { en: "Ikhtira (Invention)", ar: "اختراع" } },
          { image: IMG.lantern, keyword: { en: "Burhan (Evidence)", ar: "برهان" } },
          { image: IMG.grandMosque, keyword: { en: "Tafakkur (Reflection)", ar: "تفكّر" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Say: Are those who know equal to those who do not know?\' (Az-Zumar 9)",
        ar: "﴿قل هل يستوي الذين يعلمون والذين لا يعلمون﴾ (الزمر ٩)",
      },
    },
    {
      title: { en: "Scientific Thinking", ar: "التَّفكيرُ العِلميّ" },
      learningObjectives: [
        { en: "Explain Islam\'s encouragement of scientific thinking.", ar: "أشرح تشجيع الإسلام للتفكير العلمي." },
        { en: "Identify Muslim contributions to science through history.", ar: "أحدّد إسهامات المسلمين في العلم عبر التاريخ." },
      ],
      successCriteria: [
        { en: "I can explain how Islam encourages knowledge.", ar: "أشرح كيف يشجّع الإسلام العلم." },
        { en: "I can name 3 Muslim scientists and their contributions.", ar: "أسمّي ٣ علماء مسلمين وإسهاماتهم." },
        { en: "I can connect Quranic verses to scientific discovery.", ar: "أربط آيات قرآنيّة بالاكتشاف العلمي." },
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
      title: { en: "Scientific Thinking in Islam", ar: "التفكير العلمي في الإسلام" },
      learningObjectives: [
        { en: "Understand how Islam pioneered and encouraged scientific thinking.", ar: "أفهم كيف ريادة الإسلام وتشجيعه للتفكير العلمي." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Quran and Science", ar: "القرآن والعلم" },
          lines: [
            { en: "First word revealed: \'Read.\' The Quran mentions embryology (Al-Muminun 12-14), water cycle (An-Nur 43), mountains as pegs (An-Naba 7), expanding universe (Adh-Dhariyat 47). Islam\'s first command is to seek knowledge.", ar: "أوّل كلمة نزلت: «اقرأ.» القرآن يذكر علم الأجنّة (المؤمنون ١٢-١٤) ودورة المياه (النور ٤٣) والجبال أوتادًا (النبأ ٧) والكون المتّسع (الذاريات ٤٧). أوّل أمر إسلامي طلب العلم." },
          ],
        },
        {
          label: { en: "Golden Age Scientists", ar: "علماء العصر الذهبي" },
          lines: [
            { en: "Ibn al-Haytham (optics), Al-Khwarizmi (algebra), Ibn Sina (medicine), Al-Zahrawi (surgery), Jabir ibn Hayyan (chemistry). The Islamic Golden Age (8th-14th century) advanced all sciences.", ar: "ابن الهيثم (البصريّات) والخوارزمي (الجبر) وابن سينا (الطبّ) والزهراوي (الجراحة) وجابر بن حيّان (الكيمياء). العصر الذهبي الإسلامي (القرن ٨-١٤) تقدّم في كلّ العلوم." },
          ],
        },
        {
          label: { en: "Islam\'s Scientific Method", ar: "المنهج العلمي الإسلامي" },
          lines: [
            { en: "The Quran encourages: observe, think, question, and conclude. This IS the scientific method. \'Travel through the earth and observe.\' (Al-Ankabut 20)", ar: "القرآن يشجّع: لاحظ وفكّر واسأل واستنتج. هذا هو المنهج العلمي. ﴿سيروا في الأرض فانظروا﴾ (العنكبوت ٢٠)" },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Islam encourages scientific thinking.", ar: "الإسلام يشجّع التفكير العلمي." }, answer: true },
        { statement: { en: "Islam opposes science.", ar: "الإسلام يعارض العلم." }, answer: false },
        { statement: { en: "\'Read\' was the first Quranic word.", ar: "«اقرأ» أوّل كلمة قرآنيّة." }, answer: true },
        { statement: { en: "Muslim scientists contributed nothing.", ar: "العلماء المسلمون لم يسهموا.." }, answer: false },
        { statement: { en: "The Quran mentions embryology.", ar: "القرآن يذكر علم الأجنّة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "First word revealed: \'_______.", ar: "أوّل كلمة نزلت: «_______.»" }, answer: { en: "Read", ar: "اقرأ" } },
        { sentence: { en: "Al-Khwarizmi founded _______.", ar: "الخوارزمي أسّس _______." }, answer: { en: "algebra", ar: "الجبر" } },
        { sentence: { en: "Ibn al-Haytham studied _______.", ar: "ابن الهيثم درس _______." }, answer: { en: "optics", ar: "البصريّات" } },
        { sentence: { en: "\'Are those who know _______ to those who do not?\'", ar: "﴿هل يستوي الذين _______ والذين لا يعلمون﴾" }, answer: { en: "know", ar: "يعلمون" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Islam pioneered scientific thinking — first word was \'Read\', the Quran encourages observation, and Muslim scientists built the foundations of modern science.",
        ar: "الإسلام ريادة التفكير العلمي — أوّل كلمة «اقرأ» والقرآن يشجّع الملاحظة والعلماء المسلمون بنوا أسس العلم الحديث.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore Islamic contributions to science.", ar: "استكشف إسهامات الإسلام في العلم." },
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
            title: { en: "Quran and Modern Science", ar: "القرآن والعلم الحديث" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Scientific miracles", ar: "إعجاز علمي" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Embryology (Al-Muminun 12-14), expanding universe (Adh-Dhariyat 47), water cycle (An-Nur 43).", ar: "علم الأجنّة (المؤمنون ١٢-١٤) والكون المتّسع (الذاريات ٤٧) ودورة المياه (النور ٤٣)." } },
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "These were described 1400 years before modern science confirmed them.", ar: "وُصفت قبل ١٤٠٠ سنة من تأكيد العلم الحديث." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Quran and science agree — both come from Allah.", ar: "القرآن والعلم يتّفقان — كلاهما من الله." } },
            ],
            task: {
              title: { en: "Research Quran and Science", ar: "ابحث عن القرآن والعلم" },
              description: { en: "Find 3 scientific facts in the Quran.", ar: "أوجد ٣ حقائق علميّة في القرآن." },
              hint: { en: "Include: verse, scientific discovery, when confirmed.", ar: "ضمّن: الآية والاكتشاف ومتى تأكّد." },
            },
          },
          {
            id: "B",
            title: { en: "Muslim Scientists", ar: "العلماء المسلمون" },
            image: IMG.bookshelf,
            color: "blue",
            topic: { en: "Pioneers of knowledge", ar: "روّاد المعرفة" },
            infoSections: [
              { label: { en: "Ibn al-Haytham", ar: "ابن الهيثم" }, content: { en: "Father of optics; invented the camera obscura.", ar: "أبو البصريّات؛ اخترع الغرفة المظلمة." } },
              { label: { en: "Al-Khwarizmi", ar: "الخوارزمي" }, content: { en: "Father of algebra; gave us the word \'algorithm\'.", ar: "أبو الجبر؛ أعطانا كلمة «خوارزميّة»." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Faith and science work together.", ar: "الإيمان والعلم يعملان معًا." } },
            ],
            task: {
              title: { en: "Create Scientist Profiles", ar: "أنشئ ملفّات علماء" },
              description: { en: "Write profiles of 3 Muslim scientists.", ar: "اكتب ملفّات ل٣ علماء مسلمين." },
              hint: { en: "Include: name, field, key contribution, impact.", ar: "ضمّن: الاسم والمجال والإسهام والأثر." },
            },
          },
          {
            id: "C",
            title: { en: "The Scientific Method in Islam", ar: "المنهج العلمي في الإسلام" },
            image: IMG.skyBlue,
            color: "purple",
            topic: { en: "Observe, think, conclude", ar: "لاحظ وفكّر واستنتج" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Travel through the earth and observe.\' (Al-Ankabut 20)", ar: "﴿سيروا في الأرض فانظروا﴾ (العنكبوت ٢٠)" } },
              { label: { en: "Method", ar: "منهج" }, content: { en: "Observe → Hypothesise → Experiment → Conclude. This is embedded in the Quran.", ar: "لاحظ ← افترض ← جرّب ← استنتج. هذا مدمج في القرآن." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Islam gave the world the scientific method.", ar: "الإسلام أعطى العالم المنهج العلمي." } },
            ],
            task: {
              title: { en: "Apply the Method", ar: "طبّق المنهج" },
              description: { en: "Use the scientific method on a Quranic observation.", ar: "طبّق المنهج العلمي على ملاحظة قرآنيّة." },
              hint: { en: "Include: observation, hypothesis, evidence, conclusion.", ar: "ضمّن: الملاحظة والفرضيّة والدليل والاستنتاج." },
            },
          },
          {
            id: "D",
            title: { en: "Knowledge in Hadith", ar: "العلم في الحديث" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Hadith on seeking knowledge", ar: "أحاديث طلب العلم" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Seeking knowledge is an obligation upon every Muslim.\' (Ibn Majah)", ar: "«طلب العلم فريضة على كلّ مسلم.» (ابن ماجه)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Allah makes the path to Paradise easy for whoever seeks knowledge.\' (Muslim)", ar: "«من سلك طريقًا يلتمس فيه علمًا سهّل الله له طريقًا إلى الجنّة.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowledge is worship in Islam.", ar: "العلم عبادة في الإسلام." } },
            ],
            task: {
              title: { en: "Collect Knowledge Hadiths", ar: "اجمع أحاديث العلم" },
              description: { en: "Find 5 hadiths about the importance of knowledge.", ar: "أوجد ٥ أحاديث عن أهمّيّة العلم." },
              hint: { en: "Include: hadith text, source, application.", ar: "ضمّن: نصّ الحديث والمصدر والتطبيق." },
            },
          },
          {
            id: "E",
            title: { en: "Being a Muslim Scientist", ar: "أن تكون عالمًا مسلمًا" },
            image: IMG.grandMosque,
            color: "rose",
            topic: { en: "Faith inspires discovery", ar: "الإيمان يلهم الاكتشاف" },
            infoSections: [
              { label: { en: "Vision", ar: "رؤية" }, content: { en: "Science helps us appreciate Allah\'s creation. Every discovery is a form of worship.", ar: "العلم يساعدنا على تقدير خلق الله. كلّ اكتشاف عبادة." } },
              { label: { en: "Goal", ar: "هدف" }, content: { en: "Be like Ibn al-Haytham — curious, methodical, faithful.", ar: "كن مثل ابن الهيثم — فضولي ومنهجي ومؤمن." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Your education is an act of worship.", ar: "تعليمك عبادة." } },
            ],
            task: {
              title: { en: "Write Your Science Plan", ar: "اكتب خطّتك العلميّة" },
              description: { en: "Plan how to combine faith and science in your studies.", ar: "خطّط لدمج الإيمان والعلم في دراستك." },
              hint: { en: "Include: your interest, Islamic motivation, study plan.", ar: "ضمّن: اهتمامك والدافع الإسلامي وخطّة الدراسة." },
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
            question: { en: "First Quranic word?", ar: "أوّل كلمة قرآنيّة؟" },
            options: [
            { en: "Read", ar: "اقرأ" },
            { en: "Pray", ar: "صلِّ" },
            { en: "Fast", ar: "صُم" },
            { en: "Fight", ar: "قاتل" },
            ],
            correctIndex: 0,
            explanation: { en: "Read (Al-Alaq 1).", ar: "اقرأ (العلق ١)." },
          },
          {
            question: { en: "Ibn al-Haytham studied?", ar: "ابن الهيثم درس؟" },
            options: [
            { en: "Optics", ar: "البصريّات" },
            { en: "Cooking", ar: "الطبخ" },
            { en: "Music", ar: "الموسيقى" },
            { en: "Sports", ar: "الرياضة" },
            ],
            correctIndex: 0,
            explanation: { en: "Optics.", ar: "البصريّات." },
          },
          {
            question: { en: "Al-Khwarizmi founded?", ar: "الخوارزمي أسّس؟" },
            options: [
            { en: "Algebra", ar: "الجبر" },
            { en: "Poetry", ar: "الشعر" },
            { en: "Cooking", ar: "الطبخ" },
            { en: "Art", ar: "الفنّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Algebra.", ar: "الجبر." },
          },
          {
            question: { en: "Islam and science?", ar: "الإسلام والعلم؟" },
            options: [
            { en: "Work together", ar: "يعملان معًا" },
            { en: "Are enemies", ar: "أعداء" },
            { en: "No relation", ar: "لا علاقة" },
            { en: "Opposite", ar: "متعاكسان" },
            ],
            correctIndex: 0,
            explanation: { en: "Work together.", ar: "يعملان معًا." },
          },
          {
            question: { en: "Seeking knowledge is?", ar: "طلب العلم؟" },
            options: [
            { en: "Obligation", ar: "فريضة" },
            { en: "Optional", ar: "اختياري" },
            { en: "Forbidden", ar: "محرّم" },
            { en: "Unimportant", ar: "غير مهمّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Obligation upon every Muslim.", ar: "فريضة على كلّ مسلم." },
          },
          {
            question: { en: "Golden Age was?", ar: "العصر الذهبي كان؟" },
            options: [
            { en: "8th-14th century", ar: "القرن ٨-١٤" },
            { en: "1st century", ar: "القرن الأوّل" },
            { en: "20th century", ar: "القرن ٢٠" },
            { en: "Never", ar: "لم يكن" },
            ],
            correctIndex: 0,
            explanation: { en: "8th-14th century.", ar: "القرن ٨-١٤." },
          },
          {
            question: { en: "Quran mentions embryology in?", ar: "القرآن يذكر الأجنّة في؟" },
            options: [
            { en: "Al-Muminun 12-14", ar: "المؤمنون ١٢-١٤" },
            { en: "Al-Fatiha", ar: "الفاتحة" },
            { en: "An-Nas", ar: "الناس" },
            { en: "Al-Ikhlas", ar: "الإخلاص" },
            ],
            correctIndex: 0,
            explanation: { en: "Al-Muminun 12-14.", ar: "المؤمنون ١٢-١٤." },
          },
          {
            question: { en: "Travel and observe is from?", ar: "سيروا فانظروا من؟" },
            options: [
            { en: "Al-Ankabut 20", ar: "العنكبوت ٢٠" },
            { en: "Al-Fatiha", ar: "الفاتحة" },
            { en: "Al-Baqara 1", ar: "البقرة ١" },
            { en: "An-Nas", ar: "الناس" },
            ],
            correctIndex: 0,
            explanation: { en: "Al-Ankabut 20.", ar: "العنكبوت ٢٠." },
          },
          {
            question: { en: "Knowledge leads to?", ar: "العلم يؤدّي إلى؟" },
            options: [
            { en: "Paradise", ar: "الجنّة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Confusion", ar: "الحيرة" },
            { en: "Poverty", ar: "الفقر" },
            ],
            correctIndex: 0,
            explanation: { en: "Paradise (Muslim).", ar: "الجنّة (مسلم)." },
          },
          {
            question: { en: "Science is form of?", ar: "العلم شكل من؟" },
            options: [
            { en: "Worship", ar: "العبادة" },
            { en: "Play", ar: "اللعب" },
            { en: "Waste", ar: "الإسراف" },
            { en: "Fun", ar: "المرح" },
            ],
            correctIndex: 0,
            explanation: { en: "Worship.", ar: "العبادة." },
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
        title: { en: "Scientific Thinking in Islam", ar: "التفكير العلمي" },
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
        code: "SCIEN001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Scientific Thinking", ar: "ورقة عمل — التَّفكيرُ العِلميّ" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Scientific Thinking", ar: "ورقة عمل — التَّفكيرُ العِلميّ" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "First word?", ar: "أوّل كلمة؟" },
                options: [
                { en: "Read", ar: "اقرأ" },
                { en: "Pray", ar: "صلِّ" },
                { en: "Fast", ar: "صُم" },
                { en: "Fight", ar: "قاتل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Ibn al-Haytham?", ar: "ابن الهيثم؟" },
                options: [
                { en: "Optics", ar: "البصريّات" },
                { en: "Cooking", ar: "الطبخ" },
                { en: "Music", ar: "الموسيقى" },
                { en: "Art", ar: "الفنّ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Seeking knowledge?", ar: "طلب العلم؟" },
                options: [
                { en: "Obligatory", ar: "فريضة" },
                { en: "Optional", ar: "اختياري" },
                { en: "Forbidden", ar: "محرّم" },
                { en: "Useless", ar: "عديم الفائدة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Islam & science?", ar: "الإسلام والعلم؟" },
                options: [
                { en: "Together", ar: "معًا" },
                { en: "Enemies", ar: "أعداء" },
                { en: "Unrelated", ar: "لا صلة" },
                { en: "Opposite", ar: "عكس" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Knowledge path to?", ar: "طريق العلم إلى؟" },
                options: [
                { en: "Paradise", ar: "الجنّة" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Loss", ar: "الخسارة" },
                { en: "Confusion", ar: "الحيرة" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Islam encourages science.", ar: "الإسلام يشجّع العلم." }, answer: true },
              { statement: { en: "Islam opposes science.", ar: "الإسلام يعارض العلم." }, answer: false },
              { statement: { en: "\'Read\' was the first command.", ar: "«اقرأ» أوّل أمر." }, answer: true },
              { statement: { en: "Muslim scientists contributed nothing.", ar: "العلماء المسلمون لم يسهموا." }, answer: false },
              { statement: { en: "Seeking knowledge is obligatory.", ar: "طلب العلم فريضة." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Ilm", ar: "علم" }, answer: { en: "Knowledge", ar: "المعرفة" } },
              { prompt: { en: "Tajribah", ar: "تجربة" }, answer: { en: "Experiment", ar: "التجربة" } },
              { prompt: { en: "Burhan", ar: "برهان" }, answer: { en: "Evidence", ar: "الدليل" } },
              { prompt: { en: "Tafakkur", ar: "تفكّر" }, answer: { en: "Reflection", ar: "التأمّل" } },
              { prompt: { en: "Ikhtira", ar: "اختراع" }, answer: { en: "Invention", ar: "الاختراع" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "First revealed: \'_______.", ar: "أوّل ما نزل: «_______.»" }, blankAnswer: { en: "Read", ar: "اقرأ" } },
              { sentence: { en: "Al-Khwarizmi founded _______.", ar: "الخوارزمي أسّس _______." }, blankAnswer: { en: "algebra", ar: "الجبر" } },
              { sentence: { en: "Seeking knowledge is an _______.", ar: "طلب العلم _______." }, blankAnswer: { en: "obligation", ar: "فريضة" } },
              { sentence: { en: "\'Travel and _______ how creation began.\'", ar: "﴿سيروا و_______ كيف بدأ الخلق﴾" }, blankAnswer: { en: "observe", ar: "انظروا" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Receive the command to \'Read\'", ar: "تلقّ أمر «اقرأ»" },
              { en: "Observe the world around you", ar: "لاحظ العالم من حولك" },
              { en: "Ask questions and hypothesise", ar: "اسأل وافترض" },
              { en: "Test through experiment and evidence", ar: "اختبر بالتجربة والدليل" },
              { en: "Conclude and apply findings", ar: "استنتج وطبّق" },
              { en: "Use knowledge to serve humanity and worship Allah", ar: "استخدم العلم لخدمة البشريّة وعبادة الله" },
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
