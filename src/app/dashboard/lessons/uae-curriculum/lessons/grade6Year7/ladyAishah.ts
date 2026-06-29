import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const ladyAishah: CourseLesson = {
  slug: "g6y7-lady-aishah-mother-of-the-believers",
  name: { en: "Lady Aishah, Mother of the Believers", ar: "السَّيِّدةُ عائِشةُ أُمُّ المُؤمِنين" },
  shortIntro: {
    en: "Aishah bint Abi Bakr (may Allah be pleased with her): the beloved wife of the Prophet ﷺ, one of the greatest scholars of Islam, and a foremost narrator of hadith. A deep study of her knowledge, her virtues, and her example of seeking and teaching the religion.",
    ar: "عائِشةُ بِنتُ أبي بَكرٍ (رَضِيَ اللهُ عنها): زَوجُ النَّبِيِّ ﷺ الحَبيبة، وإحدى أعظَمِ عُلَماءِ الإسلام، ومِن كِبارِ رُواةِ الحَديث. دِراسةٌ عَميقةٌ لِعِلمِها وفَضائِلِها وقُدوَتِها في طَلَبِ العِلمِ وتَعليمِ الدّين.",
  },
  quranSurahs: ["An-Nur 11", "Al-Ahzab 6", "Al-Ahzab 34"],
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
        title: { en: "Can women be scholars in Islam?", ar: "هل يمكن للمرأة أن تكون عالمة في الإسلام؟" },
        body: {
          en: "A student says: \'Women in Islam were only at home. They had no role in knowledge or scholarship. Islam limited women.\'",
          ar: "طالب يقول: «النساء في الإسلام كنّ في البيت فقط. لم يكن لهنّ دور في العلم. الإسلام قيّد المرأة.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Lady Aishah\'s scholarship and role in Islamic knowledge.",
          ar: "انتقد بعلم السيّدة عائشة ودورها في المعرفة الإسلاميّة.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "The Prophet ﷺ said: \'Take half your religion from this woman (Aishah).\' (Narrated by scholars)",
        ar: "قال النبيّ ﷺ: «خذوا نصف دينكم من هذه المرأة (عائشة).» (رواه العلماء)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Ilm (Knowledge)", ar: "علم" } },
          { image: IMG.bookshelf, keyword: { en: "Hadith (Narration)", ar: "رواية الحديث" } },
          { image: IMG.grandMosque, keyword: { en: "Fiqh (Jurisprudence)", ar: "فقه" } },
          { image: IMG.lantern, keyword: { en: "Tafsir (Interpretation)", ar: "تفسير" } },
          { image: IMG.skyBlue, keyword: { en: "Siddiqah (Truthful)", ar: "صدّيقة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Take half your religion from this woman.\' — about Aishah, emphasizing her vast knowledge.",
        ar: "«خذوا نصف دينكم من هذه المرأة.» — عن عائشة مؤكّدًا علمها الواسع.",
      },
    },
    {
      title: { en: "Lady Aishah, Mother of the Believers", ar: "السَّيِّدةُ عائِشةُ أُمُّ المُؤمِنين" },
      learningObjectives: [
        { en: "Learn about Lady Aishah\'s life and her role as a scholar.", ar: "تعرّف على حياة السيّدة عائشة ودورها كعالمة." },
        { en: "Explain her contributions to Hadith and Islamic knowledge.", ar: "أشرح إسهاماتها في الحديث والمعرفة الإسلاميّة." },
      ],
      successCriteria: [
        { en: "I can describe Aishah\'s early life and character.", ar: "أصف حياة عائشة وشخصيّتها." },
        { en: "I can explain how many hadiths she narrated.", ar: "أشرح كم حديثًا روت." },
        { en: "I can list 3 areas of her scholarly contribution.", ar: "أذكر ٣ مجالات لإسهاماتها العلميّة." },
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
      title: { en: "Lady Aishah bint Abu Bakr — Mother of the Believers", ar: "السيّدة عائشة بنت أبي بكر — أمّ المؤمنين" },
      learningObjectives: [
        { en: "Understand Lady Aishah\'s life and her immense contribution to Islam.", ar: "أفهم حياة السيّدة عائشة وإسهاماتها العظيمة في الإسلام." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Her Life", ar: "حياتها" },
          lines: [
            { en: "Daughter of Abu Bakr, wife of the Prophet ﷺ. Known for intelligence, memory, and eloquence. Called \'Mother of the Believers\' (Al-Ahzab 6). One of the most knowledgeable Sahabah.", ar: "بنت أبي بكر وزوج النبيّ ﷺ. عُرفت بالذكاء والحفظ والبلاغة. لُقّبت بـ«أمّ المؤمنين» (الأحزاب ٦). من أعلم الصحابة." },
          ],
        },
        {
          label: { en: "Her Scholarship", ar: "علمها" },
          lines: [
            { en: "Narrated 2,210 hadiths — among the top narrators. Senior Sahabah consulted her on fiqh. She corrected mistakes of other narrators. Taught hundreds of students.", ar: "روت ٢,٢١٠ أحاديث — من أكثر الرواة. استشارها كبار الصحابة في الفقه. صحّحت أخطاء رواة آخرين. علّمت مئات الطلّاب." },
          ],
        },
        {
          label: { en: "Her Legacy", ar: "إرثها" },
          lines: [
            { en: "She contributed to Hadith, Tafsir, Fiqh, Medicine, and Arabic poetry. Her example proves women\'s central role in Islamic scholarship.", ar: "أسهمت في الحديث والتفسير والفقه والطبّ والشعر العربي. مثالها يثبت دور المرأة المركزي في العلم." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Aishah narrated 2,210 hadiths.", ar: "روت عائشة ٢,٢١٠ أحاديث." }, answer: true },
        { statement: { en: "Aishah had no role in scholarship.", ar: "لم يكن لعائشة دور في العلم." }, answer: false },
        { statement: { en: "She was called Mother of the Believers.", ar: "لُقّبت بأمّ المؤمنين." }, answer: true },
        { statement: { en: "Aishah was the daughter of Umar.", ar: "عائشة بنت عمر." }, answer: false },
        { statement: { en: "Senior Sahabah consulted her.", ar: "استشارها كبار الصحابة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Aishah narrated _______ hadiths.", ar: "روت عائشة _______ حديثًا." }, answer: { en: "2210", ar: "٢٢١٠" } },
        { sentence: { en: "She was the daughter of _______.", ar: "كانت بنت _______." }, answer: { en: "Abu Bakr", ar: "أبي بكر" } },
        { sentence: { en: "She was called _______ of the Believers.", ar: "لُقّبت بـ_______ المؤمنين." }, answer: { en: "Mother", ar: "أمّ" } },
        { sentence: { en: "She contributed to Hadith, Tafsir, and _______.", ar: "أسهمت في الحديث والتفسير و_______." }, answer: { en: "Fiqh", ar: "الفقه" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Lady Aishah — daughter of Abu Bakr, wife of the Prophet, narrated 2,210 hadiths, and was one of the greatest scholars in Islam.",
        ar: "السيّدة عائشة — بنت أبي بكر وزوج النبيّ وروت ٢,٢١٠ حديثًا ومن أعظم العلماء في الإسلام.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore Lady Aishah\'s contributions from different angles.", ar: "استكشف إسهامات السيّدة عائشة من زوايا مختلفة." },
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
            title: { en: "Her Knowledge", ar: "علمها" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "A leading scholar", ar: "عالمة بارزة" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "She narrated 2,210 hadiths — fourth highest narrator overall.", ar: "روت ٢,٢١٠ حديثًا — رابع أكثر الرواة." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Take half your religion from this woman.\'", ar: "«خذوا نصف دينكم من هذه المرأة.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowledge has no gender barrier in Islam.", ar: "العلم لا حاجز جنسي في الإسلام." } },
            ],
            task: {
              title: { en: "Create a Knowledge Map", ar: "أنشئ خريطة معرفة" },
              description: { en: "Map Aishah\'s areas of expertise.", ar: "ارسم خريطة لمجالات خبرة عائشة." },
              hint: { en: "Include: Hadith, Fiqh, Tafsir, Medicine, Poetry.", ar: "ضمّن: الحديث والفقه والتفسير والطبّ والشعر." },
            },
          },
          {
            id: "B",
            title: { en: "Her Character", ar: "شخصيّتها" },
            image: IMG.bookshelf,
            color: "blue",
            topic: { en: "Intelligence, courage, and piety", ar: "الذكاء والشجاعة والتقوى" },
            infoSections: [
              { label: { en: "Quality", ar: "صفة" }, content: { en: "She questioned, debated, and corrected errors fearlessly.", ar: "ناقشت وجادلت وصحّحت الأخطاء بلا خوف." } },
              { label: { en: "Quality", ar: "صفة" }, content: { en: "Known for generosity — gave away everything in charity.", ar: "عُرفت بالكرم — تصدّقت بكلّ شيء." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Strong character + knowledge = lasting impact.", ar: "شخصيّة قويّة + علم = أثر دائم." } },
            ],
            task: {
              title: { en: "Write a Character Profile", ar: "اكتب ملفّ شخصيّة" },
              description: { en: "Create a detailed profile of Aishah\'s character.", ar: "أنشئ ملفًّا مفصّلًا لشخصيّة عائشة." },
              hint: { en: "Include: qualities, examples, evidence.", ar: "ضمّن: الصفات والأمثلة والأدلّة." },
            },
          },
          {
            id: "C",
            title: { en: "Correcting Narrators", ar: "تصحيح الرواة" },
            image: IMG.grandMosque,
            color: "purple",
            topic: { en: "Accuracy in Hadith", ar: "الدقّة في الحديث" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "She corrected 25+ mistakes made by prominent Sahabah.", ar: "صحّحت أكثر من ٢٥ خطأ لصحابة بارزين." } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "She corrected the hadith about the dead being punished by crying — clarifying the true meaning.", ar: "صحّحت حديث تعذيب الميّت ببكاء أهله — موضّحة المعنى الصحيح." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Accuracy matters more than status.", ar: "الدقّة أهمّ من المكانة." } },
            ],
            task: {
              title: { en: "Analyse Her Corrections", ar: "حلّل تصحيحاتها" },
              description: { en: "Research 3 hadiths she corrected and why.", ar: "ابحث عن ٣ أحاديث صحّحتها ولماذا." },
              hint: { en: "Include: the original narration, her correction, the evidence.", ar: "ضمّن: الرواية الأصليّة وتصحيحها والدليل." },
            },
          },
          {
            id: "D",
            title: { en: "Women in Islamic Scholarship", ar: "المرأة في العلم الإسلامي" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Aishah as a model", ar: "عائشة نموذجًا" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Aishah opened the door for women scholars throughout history.", ar: "فتحت عائشة الباب لعالمات على مرّ التاريخ." } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "Hundreds of women became hadith scholars in later centuries.", ar: "مئات النساء أصبحن محدّثات في القرون التالية." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Islam encourages women\'s education and scholarship.", ar: "الإسلام يشجّع تعليم المرأة وعلمها." } },
            ],
            task: {
              title: { en: "Research Women Scholars", ar: "ابحث عن عالمات" },
              description: { en: "Find 3 women scholars inspired by Aishah.", ar: "أوجد ٣ عالمات تأثّرن بعائشة." },
              hint: { en: "Include: name, era, contribution.", ar: "ضمّن: الاسم والعصر والإسهام." },
            },
          },
          {
            id: "E",
            title: { en: "Lessons for Students", ar: "دروس للطلّاب" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "What we learn from Aishah", ar: "ما نتعلّمه من عائشة" },
            infoSections: [
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Ask questions — never accept ignorance.", ar: "اسأل — لا تقبل الجهل." } },
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Accuracy and truth matter more than popularity.", ar: "الدقّة والصدق أهمّ من الشعبيّة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowledge is for everyone — seek it without limits.", ar: "العلم للجميع — اطلبه بلا حدود." } },
            ],
            task: {
              title: { en: "Write Personal Reflections", ar: "اكتب تأمّلات" },
              description: { en: "What can you learn from Aishah for your studies?", ar: "ماذا تتعلّم من عائشة لدراستك؟." },
              hint: { en: "Include: specific habits, study methods, character traits.", ar: "ضمّن: عادات محدّدة وأساليب دراسة وصفات." },
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
            question: { en: "How many hadiths did Aishah narrate?", ar: "كم حديثًا روت عائشة؟" },
            options: [
            { en: "2210", ar: "٢٢١٠" },
            { en: "100", ar: "١٠٠" },
            { en: "10", ar: "١٠" },
            { en: "5", ar: "٥" },
            ],
            correctIndex: 0,
            explanation: { en: "2,210 hadiths.", ar: "٢,٢١٠ حديثًا." },
          },
          {
            question: { en: "Who was her father?", ar: "من كان أبوها؟" },
            options: [
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Umar", ar: "عمر" },
            { en: "Ali", ar: "عليّ" },
            { en: "Uthman", ar: "عثمان" },
            ],
            correctIndex: 0,
            explanation: { en: "Abu Bakr as-Siddiq.", ar: "أبو بكر الصدّيق." },
          },
          {
            question: { en: "What was her title?", ar: "ما كان لقبها؟" },
            options: [
            { en: "Mother of the Believers", ar: "أمّ المؤمنين" },
            { en: "Queen", ar: "ملكة" },
            { en: "Scholar", ar: "عالمة" },
            { en: "Leader", ar: "قائدة" },
            ],
            correctIndex: 0,
            explanation: { en: "Mother of the Believers.", ar: "أمّ المؤمنين." },
          },
          {
            question: { en: "What fields did she contribute to?", ar: "في أيّ مجالات أسهمت؟" },
            options: [
            { en: "Hadith, Fiqh, Tafsir", ar: "الحديث والفقه والتفسير" },
            { en: "Only cooking", ar: "الطبخ فقط" },
            { en: "Only poetry", ar: "الشعر فقط" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Hadith, Fiqh, Tafsir, Medicine, Poetry.", ar: "الحديث والفقه والتفسير والطبّ والشعر." },
          },
          {
            question: { en: "Did senior Sahabah consult her?", ar: "هل استشارها كبار الصحابة؟" },
            options: [
            { en: "Yes", ar: "نعم" },
            { en: "No", ar: "لا" },
            { en: "Sometimes", ar: "أحيانًا" },
            { en: "Only women", ar: "النساء فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Yes — on matters of fiqh.", ar: "نعم — في الفقه." },
          },
          {
            question: { en: "What quote is said about her?", ar: "ما المقولة عنها؟" },
            options: [
            { en: "Take half your religion from her", ar: "خذوا نصف دينكم منها" },
            { en: "She knows nothing", ar: "لا تعلم شيئًا" },
            { en: "Ignore her", ar: "تجاهلوها" },
            { en: "She is average", ar: "عاديّة" },
            ],
            correctIndex: 0,
            explanation: { en: "Take half your religion from this woman.", ar: "خذوا نصف دينكم من هذه المرأة." },
          },
          {
            question: { en: "How many narrators did she correct?", ar: "كم راويًا صحّحت؟" },
            options: [
            { en: "25+", ar: "أكثر من ٢٥" },
            { en: "0", ar: "٠" },
            { en: "1", ar: "١" },
            { en: "2", ar: "٢" },
            ],
            correctIndex: 0,
            explanation: { en: "More than 25.", ar: "أكثر من ٢٥." },
          },
          {
            question: { en: "What does her example prove?", ar: "ماذا يثبت مثالها؟" },
            options: [
            { en: "Women can be leading scholars", ar: "المرأة يمكن أن تكون عالمة بارزة" },
            { en: "Women cannot learn", ar: "المرأة لا تتعلّم" },
            { en: "Only men teach", ar: "الرجال فقط يعلّمون" },
            { en: "Knowledge is limited", ar: "العلم محدود" },
            ],
            correctIndex: 0,
            explanation: { en: "Women have a central role in scholarship.", ar: "للمرأة دور مركزي في العلم." },
          },
          {
            question: { en: "She was known for?", ar: "عُرفت ب؟" },
            options: [
            { en: "Intelligence and memory", ar: "الذكاء والحفظ" },
            { en: "Cooking", ar: "الطبخ" },
            { en: "Fighting", ar: "القتال" },
            { en: "Trading", ar: "التجارة" },
            ],
            correctIndex: 0,
            explanation: { en: "Intelligence, memory, and eloquence.", ar: "الذكاء والحفظ والبلاغة." },
          },
          {
            question: { en: "Aishah\'s knowledge included?", ar: "علم عائشة شمل؟" },
            options: [
            { en: "Medicine and poetry too", ar: "الطبّ والشعر أيضًا" },
            { en: "Only Quran", ar: "القرآن فقط" },
            { en: "Only hadith", ar: "الحديث فقط" },
            { en: "Nothing extra", ar: "لا شيء إضافي" },
            ],
            correctIndex: 0,
            explanation: { en: "Also medicine and Arabic poetry.", ar: "أيضًا الطبّ والشعر العربي." },
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
        title: { en: "Lady Aishah", ar: "السيّدة عائشة" },
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
        code: "AISHA001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Lady Aishah, Mother of the Believers", ar: "ورقة عمل — السَّيِّدةُ عائِشةُ أُمُّ المُؤمِنين" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Lady Aishah, Mother of the Believers", ar: "ورقة عمل — السَّيِّدةُ عائِشةُ أُمُّ المُؤمِنين" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "How many hadiths?", ar: "كم حديثًا؟" },
                options: [
                { en: "2210", ar: "٢٢١٠" },
                { en: "100", ar: "١٠٠" },
                { en: "50", ar: "٥٠" },
                { en: "10", ar: "١٠" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Her father?", ar: "أبوها؟" },
                options: [
                { en: "Abu Bakr", ar: "أبو بكر" },
                { en: "Umar", ar: "عمر" },
                { en: "Ali", ar: "عليّ" },
                { en: "Uthman", ar: "عثمان" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Her title?", ar: "لقبها؟" },
                options: [
                { en: "Mother of the Believers", ar: "أمّ المؤمنين" },
                { en: "Queen", ar: "ملكة" },
                { en: "Leader", ar: "قائدة" },
                { en: "Scholar", ar: "عالمة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "She contributed to?", ar: "أسهمت في؟" },
                options: [
                { en: "Hadith, Fiqh, Tafsir", ar: "الحديث والفقه والتفسير" },
                { en: "Cooking", ar: "الطبخ" },
                { en: "Farming", ar: "الزراعة" },
                { en: "Trading", ar: "التجارة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Corrected how many?", ar: "صحّحت كم؟" },
                options: [
                { en: "25+", ar: "أكثر من ٢٥" },
                { en: "0", ar: "٠" },
                { en: "1", ar: "١" },
                { en: "2", ar: "٢" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Aishah narrated 2210 hadiths.", ar: "عائشة روت ٢٢١٠ حديثًا." }, answer: true },
              { statement: { en: "She had no scholarly role.", ar: "لم يكن لها دور علمي." }, answer: false },
              { statement: { en: "She was Abu Bakr\'s daughter.", ar: "كانت بنت أبي بكر." }, answer: true },
              { statement: { en: "She was called Mother of the Believers.", ar: "لُقّبت بأمّ المؤمنين." }, answer: true },
              { statement: { en: "She never corrected anyone.", ar: "لم تصحّح أحدًا أبدًا." }, answer: false },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Aishah", ar: "عائشة" }, answer: { en: "Mother of the Believers", ar: "أمّ المؤمنين" } },
              { prompt: { en: "Abu Bakr", ar: "أبو بكر" }, answer: { en: "Her father", ar: "والدها" } },
              { prompt: { en: "Hadith", ar: "حديث" }, answer: { en: "Prophetic narration", ar: "رواية نبويّة" } },
              { prompt: { en: "Fiqh", ar: "فقه" }, answer: { en: "Jurisprudence", ar: "الفقه" } },
              { prompt: { en: "Tafsir", ar: "تفسير" }, answer: { en: "Quran interpretation", ar: "تفسير القرآن" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Aishah narrated _______ hadiths.", ar: "عائشة روت _______ حديثًا." }, blankAnswer: { en: "2210", ar: "٢٢١٠" } },
              { sentence: { en: "She was daughter of _______.", ar: "كانت بنت _______." }, blankAnswer: { en: "Abu Bakr", ar: "أبي بكر" } },
              { sentence: { en: "Called _______ of the Believers.", ar: "لُقّبت بـ_______ المؤمنين." }, blankAnswer: { en: "Mother", ar: "أمّ" } },
              { sentence: { en: "She corrected _______ narrators.", ar: "صحّحت _______ راويًا." }, blankAnswer: { en: "25+", ar: "أكثر من ٢٥" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Aishah grows up in Abu Bakr\'s household", ar: "عائشة تنشأ في بيت أبي بكر" },
              { en: "Marries the Prophet ﷺ", ar: "تتزوّج النبيّ ﷺ" },
              { en: "Learns directly from the Prophet", ar: "تتعلّم من النبيّ مباشرة" },
              { en: "Becomes a leading hadith narrator", ar: "تصبح من أبرز رواة الحديث" },
              { en: "Teaches hundreds of students", ar: "تعلّم مئات الطلّاب" },
              { en: "Leaves legacy as greatest woman scholar", ar: "تترك إرثًا كأعظم عالمة" },
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
