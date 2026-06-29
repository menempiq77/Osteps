import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const sanctityOfMuslim: CourseLesson = {
  slug: "g6y7-the-sanctity-of-a-muslim",
  name: { en: "The Sanctity of a Muslim", ar: "حرمة المسلم" },
  shortIntro: {
    en: "Islam protects every person\'s life, honour, and property. We study the sacred rights that cannot be violated.",
    ar: "يحمي الإسلام حياة كلّ شخص وعرضه وماله. ندرس الحقوق المقدّسة التي لا تُنتهك.",
  },
  quranSurahs: ["Al-Hujurat 11-12","Al-Isra 33"],
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
        title: { en: "Can we harm a Muslim\'s reputation?", ar: "هل يجوز إيذاء سمعة المسلم؟" },
        body: {
          en: "A student says: \'Gossiping about classmates is just talking. Everyone does it. It is harmless — they won\'t know. Backbiting is normal conversation.\'",
          ar: "طالب يقول: «الغيبة مجرّد كلام. الكلّ يفعلها. لا ضرر — لن يعرفوا. الغيبة حديث عادي.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on the sanctity of a Muslim.",
          ar: "انتقد بالقرآن والحديث عن حرمة المسلم.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Do not spy or backbite each other. Would one of you like to eat the flesh of his dead brother?\' (Al-Hujurat 12)",
        ar: "﴿ولا تجسّسوا ولا يغتب بعضكم بعضًا أيحبّ أحدكم أن يأكل لحم أخيه ميتًا﴾ (الحجرات ١٢)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Hurmah (Sanctity)", ar: "حرمة" } },
          { image: IMG.childQuran, keyword: { en: "Ghibah (Backbiting)", ar: "غيبة" } },
          { image: IMG.lantern, keyword: { en: "Namimah (Slander)", ar: "نميمة" } },
          { image: IMG.bookshelf, keyword: { en: "Ukhuwwah (Brotherhood)", ar: "أخوّة" } },
          { image: IMG.skyBlue, keyword: { en: "Haqq (Right)", ar: "حقّ" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'The Muslim is the one from whose tongue and hand other Muslims are safe.\' (Bukhari)",
        ar: "«المسلم من سلم المسلمون من لسانه ويده.» (البخاري)",
      },
    },
    {
      title: { en: "The Sanctity of a Muslim", ar: "حرمة المسلم" },
      learningObjectives: [
        { en: "Explain the rights of a Muslim over another Muslim.", ar: "أشرح حقوق المسلم على المسلم." },
        { en: "Analyse the consequences of backbiting and slander in Islam.", ar: "أحلّل عواقب الغيبة والنميمة في الإسلام." },
      ],
      successCriteria: [
        { en: "I can define ghibah and namimah.", ar: "أعرّف الغيبة والنميمة." },
        { en: "I can list 5 rights of a Muslim.", ar: "أذكر ٥ حقوق للمسلم." },
        { en: "I can explain why backbiting is like eating dead flesh.", ar: "أشرح لماذا الغيبة كأكل لحم الميّت." },
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
      title: { en: "Sanctity of the Muslim", ar: "حرمة المسلم" },
      learningObjectives: [
        { en: "Understand the sacred rights of every Muslim and the gravity of violating them.", ar: "أفهم الحقوق المقدّسة لكلّ مسلم وخطورة انتهاكها." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Rights of a Muslim", ar: "حقوق المسلم" },
          lines: [
            { en: "6 rights: return greeting, visit sick, follow funeral, accept invitation, say yarhamukallah when sneezing, advise sincerely. (Muslim). Blood, wealth, and honour are sacred — Farewell Sermon.", ar: "٦ حقوق: ردّ السلام وعيادة المريض وتشييع الجنازة وإجابة الدعوة والتشميت والنصيحة. (مسلم). الدم والمال والعرض حرام — خطبة الوداع." },
          ],
        },
        {
          label: { en: "Backbiting (Ghibah)", ar: "الغيبة" },
          lines: [
            { en: "\'Mentioning your brother with what he dislikes.\' (Muslim). Even if true, it is ghibah. Al-Hujurat 12 compares it to eating dead flesh. The backbiter\'s good deeds go to the victim.", ar: "«ذكرك أخاك بما يكره.» (مسلم). حتّى لو حقيقة فهي غيبة. الحجرات ١٢ تشبّهها بأكل لحم الميّت. حسنات المغتاب تذهب للضحيّة." },
          ],
        },
        {
          label: { en: "Slander (Namimah)", ar: "النميمة" },
          lines: [
            { en: "Spreading gossip between people to cause fitna. \'The spreader of gossip will not enter Paradise.\' (Bukhari). Destroys friendships, families, and communities.", ar: "نقل الكلام بين الناس ليوقع الفتنة. «لا يدخل الجنّة نمّام.» (البخاري). يدمّر الصداقات والأسر والمجتمعات." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Backbiting is mentioning what someone dislikes.", ar: "الغيبة ذكر ما يكره." }, answer: true },
        { statement: { en: "Backbiting is harmless.", ar: "الغيبة غير مضرّة." }, answer: false },
        { statement: { en: "A Muslim\'s blood, wealth, and honour are sacred.", ar: "دم المسلم وماله وعرضه حرام." }, answer: true },
        { statement: { en: "Gossipers enter Paradise easily.", ar: "النمّامون يدخلون الجنّة بسهولة." }, answer: false },
        { statement: { en: "Visiting the sick is a right.", ar: "عيادة المريض حقّ." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'The Muslim is safe from whose _______ and hand.\'", ar: "«المسلم من سلم المسلمون من _______ ويده.»" }, answer: { en: "tongue", ar: "لسانه" } },
        { sentence: { en: "Backbiting is like eating _______ flesh.", ar: "الغيبة كأكل لحم _______." }, answer: { en: "dead", ar: "الميّت" } },
        { sentence: { en: "\'The spreader of _______ will not enter Paradise.\'", ar: "«لا يدخل الجنّة _______.»" }, answer: { en: "gossip", ar: "نمّام" } },
        { sentence: { en: "Every Muslim has _______ sacred rights.", ar: "لكلّ مسلم _______ حقوق مقدّسة." }, answer: { en: "six", ar: "ستّة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "A Muslim\'s blood, wealth, and honour are sacred. Backbiting = eating dead flesh. Gossip blocks Paradise.",
        ar: "دم المسلم وماله وعرضه حرام. الغيبة = أكل لحم الميّت. النميمة تمنع الجنّة.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the sanctity and rights of Muslims.", ar: "استكشف حرمة المسلم وحقوقه." },
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
            title: { en: "Six Rights", ar: "الحقوق الستّة" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "What every Muslim owes", ar: "ما يجب لكلّ مسلم" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "6 rights: greeting, visiting sick, funeral, invitation, sneezing, advice. (Muslim)", ar: "٦ حقوق: السلام وعيادة المريض والجنازة والدعوة والتشميت والنصيحة. (مسلم)" } },
              { label: { en: "Farewell Sermon", ar: "خطبة الوداع" }, content: { en: "Blood, wealth, honour are sacred.", ar: "الدم والمال والعرض حرام." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every Muslim has these rights — no exceptions.", ar: "كلّ مسلم له هذه الحقوق — بلا استثناء." } },
            ],
            task: {
              title: { en: "List All Rights", ar: "اذكر كلّ الحقوق" },
              description: { en: "Write the 6 rights with hadith evidence.", ar: "اكتب الحقوق الستّة بأدلّتها." },
              hint: { en: "Include: the right, the hadith, how you practise it.", ar: "ضمّن: الحقّ والحديث وكيف تمارسه." },
            },
          },
          {
            id: "B",
            title: { en: "Backbiting", ar: "الغيبة" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "A major sin", ar: "كبيرة" },
            infoSections: [
              { label: { en: "Definition", ar: "تعريف" }, content: { en: "\'Mentioning your brother with what he dislikes.\' Even if true. (Muslim)", ar: "«ذكرك أخاك بما يكره.» حتّى لو حقيقة. (مسلم)" } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Hujurat 12: eating dead flesh.", ar: "الحجرات ١٢: أكل لحم الميّت." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Guard your tongue — your good deeds depend on it.", ar: "احفظ لسانك — حسناتك تعتمد عليه." } },
            ],
            task: {
              title: { en: "Analyse Backbiting", ar: "حلّل الغيبة" },
              description: { en: "Explain why backbiting is compared to cannibalism.", ar: "اشرح لماذا شُبّهت الغيبة بأكل اللحم." },
              hint: { en: "Include: the verse, the hadith, the damage, the cure.", ar: "ضمّن: الآية والحديث والضرر والعلاج." },
            },
          },
          {
            id: "C",
            title: { en: "Slander (Namimah)", ar: "النميمة" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Destroys communities", ar: "تدمّر المجتمعات" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The spreader of gossip will not enter Paradise.\' (Bukhari)", ar: "«لا يدخل الجنّة نمّام.» (البخاري)" } },
              { label: { en: "Damage", ar: "ضرر" }, content: { en: "Breaks friendships, families, trust, and community bonds.", ar: "تكسر الصداقات والأسر والثقة والروابط المجتمعيّة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "One word of gossip can destroy years of brotherhood.", ar: "كلمة نميمة واحدة تدمّر سنوات أخوّة." } },
            ],
            task: {
              title: { en: "Research Namimah", ar: "ابحث عن النميمة" },
              description: { en: "Write about the consequences of slander.", ar: "اكتب عن عواقب النميمة." },
              hint: { en: "Include: hadith, real-life examples, Islamic cure.", ar: "ضمّن: الحديث وأمثلة واقعيّة والعلاج الإسلامي." },
            },
          },
          {
            id: "D",
            title: { en: "Brotherhood (Ukhuwwah)", ar: "الأخوّة" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Building bonds", ar: "بناء الروابط" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Hujurat 10: \'The believers are brothers.\' ", ar: "الحجرات ١٠: ﴿إنّما المؤمنون إخوة﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'None of you truly believes until he loves for his brother what he loves for himself.\' (Bukhari)", ar: "«لا يؤمن أحدكم حتّى يحبّ لأخيه ما يحبّ لنفسه.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Brotherhood is the foundation of Muslim society.", ar: "الأخوّة أساس المجتمع الإسلامي." } },
            ],
            task: {
              title: { en: "Build Brotherhood", ar: "ابنِ الأخوّة" },
              description: { en: "Write 5 ways to strengthen Muslim brotherhood.", ar: "اكتب ٥ طرق لتقوية الأخوّة." },
              hint: { en: "Include: action, evidence, personal commitment.", ar: "ضمّن: العمل والدليل والالتزام الشخصي." },
            },
          },
          {
            id: "E",
            title: { en: "Guarding the Tongue", ar: "حفظ اللسان" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Speech is responsibility", ar: "الكلام مسؤوليّة" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Whoever believes in Allah and the Last Day, let him speak good or be silent.\' (Bukhari)", ar: "«من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت.» (البخاري)" } },
              { label: { en: "Consequence", ar: "عاقبة" }, content: { en: "A word can throw a person into Hell 70 years deep. (Tirmidhi)", ar: "كلمة تهوي بصاحبها في النار ٧٠ سنة. (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Think before you speak — every word is recorded.", ar: "فكّر قبل أن تتكلّم — كلّ كلمة مسجّلة." } },
            ],
            task: {
              title: { en: "Write a Speech Guide", ar: "اكتب دليل كلام" },
              description: { en: "Create rules for responsible speech.", ar: "أنشئ قواعد للكلام المسؤول." },
              hint: { en: "Include: before speaking checklist, hadith evidence.", ar: "ضمّن: قائمة تحقّق قبل الكلام ودليل حديثي." },
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
            question: { en: "Backbiting is?", ar: "الغيبة؟" },
            options: [
            { en: "Mentioning what disliked", ar: "ذكر ما يكره" },
            { en: "Praise", ar: "مدح" },
            { en: "Neutral", ar: "محايد" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Mentioning what someone dislikes.", ar: "ذكر ما يكره." },
          },
          {
            question: { en: "Muslim is safe from?", ar: "المسلم سلم من؟" },
            options: [
            { en: "Tongue and hand", ar: "اللسان واليد" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Air", ar: "الهواء" },
            { en: "Water", ar: "الماء" },
            ],
            correctIndex: 0,
            explanation: { en: "Tongue and hand.", ar: "اللسان واليد." },
          },
          {
            question: { en: "Gossiper\'s fate?", ar: "مصير النمّام؟" },
            options: [
            { en: "Won\'t enter Paradise", ar: "لا يدخل الجنّة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Reward", ar: "ثواب" },
            { en: "Praise", ar: "مدح" },
            ],
            correctIndex: 0,
            explanation: { en: "Won\'t enter Paradise.", ar: "لا يدخل الجنّة." },
          },
          {
            question: { en: "Backbiting compared to?", ar: "الغيبة تُشبّه ب؟" },
            options: [
            { en: "Eating dead flesh", ar: "أكل لحم ميّت" },
            { en: "Drinking water", ar: "شرب الماء" },
            { en: "Sleeping", ar: "النوم" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Eating dead brother\'s flesh.", ar: "أكل لحم الأخ الميّت." },
          },
          {
            question: { en: "How many rights?", ar: "كم حقًّا؟" },
            options: [
            { en: "6", ar: "٦" },
            { en: "1", ar: "١" },
            { en: "0", ar: "٠" },
            { en: "100", ar: "١٠٠" },
            ],
            correctIndex: 0,
            explanation: { en: "6 rights.", ar: "٦ حقوق." },
          },
          {
            question: { en: "Blood, wealth, honour are?", ar: "الدم والمال والعرض؟" },
            options: [
            { en: "Sacred", ar: "حرام" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Public", ar: "عامّ" },
            { en: "Free", ar: "حرّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Sacred.", ar: "حرام." },
          },
          {
            question: { en: "Believers are?", ar: "المؤمنون؟" },
            options: [
            { en: "Brothers", ar: "إخوة" },
            { en: "Strangers", ar: "غرباء" },
            { en: "Enemies", ar: "أعداء" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Brothers.", ar: "إخوة." },
          },
          {
            question: { en: "Speak good or?", ar: "قل خيرًا أو؟" },
            options: [
            { en: "Be silent", ar: "اصمت" },
            { en: "Lie", ar: "اكذب" },
            { en: "Shout", ar: "اصرخ" },
            { en: "Run", ar: "اركض" },
            ],
            correctIndex: 0,
            explanation: { en: "Be silent.", ar: "اصمت." },
          },
          {
            question: { en: "A word can send to Hell?", ar: "كلمة تهوي في النار؟" },
            options: [
            { en: "70 years deep", ar: "٧٠ سنة" },
            { en: "No", ar: "لا" },
            { en: "1 day", ar: "يوم" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "70 years deep.", ar: "٧٠ سنة." },
          },
          {
            question: { en: "Love for brother what?", ar: "أحبّ لأخيك ما؟" },
            options: [
            { en: "You love for yourself", ar: "تحبّ لنفسك" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Hate", ar: "تكره" },
            { en: "Less", ar: "أقلّ" },
            ],
            correctIndex: 0,
            explanation: { en: "What you love for yourself.", ar: "ما تحبّ لنفسك." },
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
        title: { en: "Sanctity of the Muslim", ar: "حرمة المسلم" },
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
        code: "SANCT001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The Sanctity of a Muslim", ar: "ورقة عمل — حرمة المسلم" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The Sanctity of a Muslim", ar: "ورقة عمل — حرمة المسلم" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Backbiting?", ar: "الغيبة؟" },
                options: [
                { en: "What disliked", ar: "ما يكره" },
                { en: "Praise", ar: "مدح" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Fun", ar: "مرح" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tongue safe?", ar: "اللسان سلم؟" },
                options: [
                { en: "Muslim\'s right", ar: "حقّ المسلم" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Optional", ar: "اختياري" },
                { en: "Wrong", ar: "خطأ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Gossiper?", ar: "النمّام؟" },
                options: [
                { en: "No Paradise", ar: "لا جنّة" },
                { en: "Reward", ar: "ثواب" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Fine", ar: "عادي" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Believers?", ar: "المؤمنون؟" },
                options: [
                { en: "Brothers", ar: "إخوة" },
                { en: "Strangers", ar: "غرباء" },
                { en: "Enemies", ar: "أعداء" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Speak good or?", ar: "خيرًا أو؟" },
                options: [
                { en: "Silent", ar: "صمت" },
                { en: "Lie", ar: "كذب" },
                { en: "Shout", ar: "صراخ" },
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
              { statement: { en: "Backbiting is a sin.", ar: "الغيبة ذنب." }, answer: true },
              { statement: { en: "Gossip is harmless.", ar: "الغيبة غير مضرّة." }, answer: false },
              { statement: { en: "Blood/wealth/honour sacred.", ar: "الدم والمال والعرض حرام." }, answer: true },
              { statement: { en: "Gossiper enters Paradise.", ar: "النمّام يدخل الجنّة." }, answer: false },
              { statement: { en: "Believers are brothers.", ar: "المؤمنون إخوة." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Ghibah", ar: "غيبة" }, answer: { en: "Backbiting", ar: "الغيبة" } },
              { prompt: { en: "Namimah", ar: "نميمة" }, answer: { en: "Slander", ar: "النميمة" } },
              { prompt: { en: "Ukhuwwah", ar: "أخوّة" }, answer: { en: "Brotherhood", ar: "الأخوّة" } },
              { prompt: { en: "Hurmah", ar: "حرمة" }, answer: { en: "Sanctity", ar: "الحرمة" } },
              { prompt: { en: "Haqq", ar: "حقّ" }, answer: { en: "Right", ar: "الحقّ" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Muslim safe from _______ and hand.", ar: "المسلم سلم من _______ ويده." }, blankAnswer: { en: "tongue", ar: "لسانه" } },
              { sentence: { en: "Backbiting = eating _______ flesh.", ar: "الغيبة = أكل لحم _______." }, blankAnswer: { en: "dead", ar: "الميّت" } },
              { sentence: { en: "Gossiper won\'t enter _______.", ar: "النمّام لا يدخل _______." }, blankAnswer: { en: "Paradise", ar: "الجنّة" } },
              { sentence: { en: "Believers are _______.", ar: "المؤمنون _______." }, blankAnswer: { en: "brothers", ar: "إخوة" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn the rights of a Muslim", ar: "تعلّم حقوق المسلم" },
              { en: "Understand backbiting (ghibah)", ar: "افهم الغيبة" },
              { en: "Recognise slander (namimah)", ar: "تعرّف على النميمة" },
              { en: "Build brotherhood (ukhuwwah)", ar: "ابنِ الأخوّة" },
              { en: "Guard your tongue", ar: "احفظ لسانك" },
              { en: "Practise responsible speech", ar: "تدرّب على الكلام المسؤول" },
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
