import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const sujudSahwTilawah: CourseLesson = {
  slug: "g6y7-sujud-as-sahw-and-sujud-at-tilawah",
  name: { en: "Sujud As-Sahw and Sujud At-Tilawah", ar: "سُجودُ السَّهوِ وسُجودُ التِّلاوة" },
  shortIntro: {
    en: "Two special prostrations every Muslim should master: Sujud As-Sahw, which mends mistakes made in prayer, and Sujud At-Tilawah, the prostration of recitation. A precise study of their rulings, causes, and how to perform them — grounded in the Sunnah and the fiqh of Ahl as-Sunnah.",
    ar: "سَجدَتانِ خاصَّتانِ يَنبَغي لِكُلِّ مُسلِمٍ إتقانُهُما: سُجودُ السَّهوِ الذي يَجبُرُ خَلَلَ الصَّلاة، وسُجودُ التِّلاوةِ سَجدةُ القُرآن. دِراسةٌ دَقيقةٌ لِأحكامِهِما وأسبابِهِما وكَيفيّةِ أدائِهِما — مُؤَصَّلةٌ بِالسُّنّةِ وفِقهِ أهلِ السُّنّة.",
  },
  quranSurahs: ["Al-Inshiqaq 20-21", "Maryam 58", "As-Sajdah 15"],
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
        title: { en: "Is it OK to just guess if I made a mistake in prayer?", ar: "هل يجوز أن أخمّن إن أخطأت في الصلاة؟" },
        body: {
          en: "A student is unsure if he prayed 3 or 4 rakahs. He says: \'I will just guess and move on. It does not matter — Allah knows what I meant.\'",
          ar: "طالب غير متأكّد هل صلّى ٣ أو ٤ ركعات. يقول: «سأخمّن وأتابع. لا يهمّ — الله يعلم.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using the ruling on Sujud as-Sahw.",
          ar: "انتقد بحكم سجود السهو.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "The Prophet ﷺ said: \'If one of you is in doubt, let him build on what he is certain of.\' (Muslim)",
        ar: "قال النبيّ ﷺ: «إذا شكّ أحدكم فليبنِ على ما استيقن.» (مسلم)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Sujud as-Sahw", ar: "سجود السهو" } },
          { image: IMG.childQuran, keyword: { en: "Sujud at-Tilawah", ar: "سجود التلاوة" } },
          { image: IMG.lantern, keyword: { en: "Tashahhud", ar: "التشهّد" } },
          { image: IMG.bookshelf, keyword: { en: "Sahw (Forgetfulness)", ar: "سهو" } },
          { image: IMG.skyBlue, keyword: { en: "Ayat as-Sajdah", ar: "آيات السجدة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "The Prophet performed sujud as-sahw when he forgot in prayer, teaching the ummah the correct method.",
        ar: "سجد النبيّ ﷺ سجود السهو عندما نسي في الصلاة معلّمًا الأمّة.",
      },
    },
    {
      title: { en: "Sujud As-Sahw and Sujud At-Tilawah", ar: "سُجودُ السَّهوِ وسُجودُ التِّلاوة" },
      learningObjectives: [
        { en: "Explain when and how to perform sujud as-sahw.", ar: "أشرح متى وكيف يُسجد سجود السهو." },
        { en: "Describe the ruling and method of sujud at-tilawah.", ar: "أصف حكم وطريقة سجود التلاوة." },
      ],
      successCriteria: [
        { en: "I can identify 3 reasons for sujud as-sahw.", ar: "أحدّد ٣ أسباب لسجود السهو." },
        { en: "I can demonstrate the method of sujud as-sahw.", ar: "أوضّح طريقة سجود السهو." },
        { en: "I can list the sajdah verses in the Quran.", ar: "أذكر آيات السجدة في القرآن." },
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
      title: { en: "Sujud as-Sahw and Sujud at-Tilawah", ar: "سجود السهو وسجود التلاوة" },
      learningObjectives: [
        { en: "Master the rulings and methods of both types of sujud.", ar: "أتقن أحكام وطريقة كلا نوعي السجود." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Sujud as-Sahw — When", ar: "سجود السهو — متى" },
          lines: [
            { en: "1) Adding extra actions (e.g., 5th rakah). 2) Omitting an obligatory act. 3) Doubt about number of rakahs. Build on the lesser count if unsure.", ar: "١) الزيادة (مثلًا ركعة خامسة). ٢) ترك واجب. ٣) الشكّ في عدد الركعات. ابنِ على الأقلّ." },
          ],
        },
        {
          label: { en: "Sujud as-Sahw — How", ar: "سجود السهو — كيف" },
          lines: [
            { en: "Two sajdahs after the final tashahhud (before or after salam depending on the case), then salam. Say SubhanAllah in each sajdah.", ar: "سجدتان بعد التشهّد الأخير (قبل أو بعد السلام حسب الحالة) ثمّ سلّم. قل سبحان الله." },
          ],
        },
        {
          label: { en: "Sujud at-Tilawah", ar: "سجود التلاوة" },
          lines: [
            { en: "When you read or hear one of the 15 sajdah verses in the Quran, prostrate immediately saying: SubhanAllah. No wudu needed outside prayer.", ar: "عند قراءة أو سماع إحدى آيات السجدة الـ١٥ في القرآن، اسجد فورًا. لا يحتاج وضوءًا خارج الصلاة." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Sujud as-Sahw is for forgetfulness in prayer.", ar: "سجود السهو للنسيان في الصلاة." }, answer: true },
        { statement: { en: "You perform 3 sajdahs for sahw.", ar: "تسجد ٣ سجدات للسهو." }, answer: false },
        { statement: { en: "If unsure of rakahs count, build on the lesser.", ar: "إن شككت في عدد الركعات ابنِ على الأقلّ." }, answer: true },
        { statement: { en: "Sujud at-Tilawah requires wudu outside prayer.", ar: "سجود التلاوة يحتاج وضوءًا خارج الصلاة." }, answer: false },
        { statement: { en: "There are 15 sajdah verses in the Quran.", ar: "هناك ١٥ آية سجدة في القرآن." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Sujud as-Sahw consists of _______ sajdahs.", ar: "سجود السهو يتكوّن من _______ سجدتين." }, answer: { en: "two", ar: "سجدتين" } },
        { sentence: { en: "If unsure of rakahs, build on the _______.", ar: "إن شككت ابنِ على _______." }, answer: { en: "lesser", ar: "الأقلّ" } },
        { sentence: { en: "Sujud at-Tilawah is at the _______ verses.", ar: "سجود التلاوة عند آيات _______." }, answer: { en: "sajdah", ar: "السجدة" } },
        { sentence: { en: "Sahw means _______ (forgetfulness).", ar: "السهو يعني _______." }, answer: { en: "forgetfulness", ar: "النسيان" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Sujud as-Sahw corrects mistakes in prayer; sujud at-tilawah is prostration at specific Quran verses.",
        ar: "سجود السهو يصحّح أخطاء الصلاة؛ سجود التلاوة عند آيات محدّدة.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore both types of sujud in detail.", ar: "استكشف نوعي السجود بالتفصيل." },
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
            title: { en: "Reasons for Sahw", ar: "أسباب السهو" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "When to perform sahw", ar: "متى تسجد للسهو" },
            infoSections: [
              { label: { en: "Reason 1", ar: "سبب ١" }, content: { en: "Addition: praying an extra rakah.", ar: "الزيادة: صلاة ركعة زائدة." } },
              { label: { en: "Reason 2", ar: "سبب ٢" }, content: { en: "Omission: forgetting a wajib act.", ar: "النقص: نسيان واجب." } },
              { label: { en: "Reason 3", ar: "سبب ٣" }, content: { en: "Doubt: unsure of the count.", ar: "الشكّ: عدم التأكّد من العدد." } },
            ],
            task: {
              title: { en: "Create a Decision Chart", ar: "أنشئ مخطّط قرار" },
              description: { en: "Design a flowchart for when to do sujud as-sahw.", ar: "صمّم مخطّطًا لمتى تسجد للسهو." },
              hint: { en: "Include: addition, omission, doubt scenarios.", ar: "ضمّن: سيناريوهات الزيادة والنقص والشكّ." },
            },
          },
          {
            id: "B",
            title: { en: "Method of Sahw", ar: "طريقة السهو" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "Step by step", ar: "خطوة بخطوة" },
            infoSections: [
              { label: { en: "Steps", ar: "خطوات" }, content: { en: "Complete tashahhud > make 2 sajdahs > say SubhanAllah > sit > salam.", ar: "أكمل التشهّد > اسجد ٢ > قل سبحان الله > اجلس > سلّم." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "The Prophet did this when he forgot. (Bukhari & Muslim)", ar: "فعل النبيّ ذلك عندما نسي. (البخاري ومسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Even the Prophet corrected mistakes — so should we.", ar: "حتّى النبيّ صحّح أخطاءه — وكذلك نحن." } },
            ],
            task: {
              title: { en: "Demonstrate the Steps", ar: "أظهر الخطوات" },
              description: { en: "Write or draw the exact steps of sujud as-sahw.", ar: "اكتب أو ارسم خطوات سجود السهو." },
              hint: { en: "Include: when before salam, when after salam.", ar: "ضمّن: متى قبل السلام ومتى بعده." },
            },
          },
          {
            id: "C",
            title: { en: "Sujud at-Tilawah", ar: "سجود التلاوة" },
            image: IMG.bookshelf,
            color: "purple",
            topic: { en: "Prostration at verses", ar: "السجود عند الآيات" },
            infoSections: [
              { label: { en: "Rule", ar: "قاعدة" }, content: { en: "15 sajdah verses in the Quran. Prostrate when you read or hear them.", ar: "١٥ آية سجدة في القرآن. اسجد عند القراءة أو السماع." } },
              { label: { en: "Method", ar: "طريقة" }, content: { en: "One sajdah, say SubhanAllah, then continue.", ar: "سجدة واحدة قل سبحان الله ثمّ تابع." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "It shows submission to Allah\'s commands.", ar: "يُظهر الخضوع لأوامر الله." } },
            ],
            task: {
              title: { en: "Find Sajdah Verses", ar: "أوجد آيات السجدة" },
              description: { en: "List all 15 sajdah verses with surah and ayah numbers.", ar: "اذكر آيات السجدة الـ١٥ بأرقام السور والآيات." },
              hint: { en: "Include: surah name, ayah number, topic of the verse.", ar: "ضمّن: اسم السورة ورقم الآية وموضوعها." },
            },
          },
          {
            id: "D",
            title: { en: "Common Mistakes", ar: "أخطاء شائعة" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "What people do wrong", ar: "ما يخطئ فيه الناس" },
            infoSections: [
              { label: { en: "Mistake", ar: "خطأ" }, content: { en: "Ignoring doubt and just guessing the count.", ar: "تجاهل الشكّ والتخمين." } },
              { label: { en: "Mistake", ar: "خطأ" }, content: { en: "Doing extra sajdahs instead of two.", ar: "سجود أكثر من سجدتين." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Learning the rules prevents invalid prayer.", ar: "تعلّم الأحكام يمنع بطلان الصلاة." } },
            ],
            task: {
              title: { en: "Analyse Mistakes", ar: "حلّل الأخطاء" },
              description: { en: "List 5 common mistakes and the correct rulings.", ar: "اذكر ٥ أخطاء شائعة والأحكام الصحيحة." },
              hint: { en: "Include: the mistake, why it is wrong, the correct action.", ar: "ضمّن: الخطأ وسببه والصواب." },
            },
          },
          {
            id: "E",
            title: { en: "Practice Scenarios", ar: "سيناريوهات تدريبيّة" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "What would you do?", ar: "ماذا ستفعل؟" },
            infoSections: [
              { label: { en: "Scenario", ar: "سيناريو" }, content: { en: "You prayed 5 rakahs by mistake.", ar: "صلّيت ٥ ركعات بالخطأ." } },
              { label: { en: "Scenario", ar: "سيناريو" }, content: { en: "You forgot the first tashahhud.", ar: "نسيت التشهّد الأوّل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowing the rules gives confidence in prayer.", ar: "معرفة الأحكام تعطي ثقة في الصلاة." } },
            ],
            task: {
              title: { en: "Solve 5 Scenarios", ar: "حلّ ٥ سيناريوهات" },
              description: { en: "For each scenario, write the correct action.", ar: "لكلّ سيناريو اكتب الفعل الصحيح." },
              hint: { en: "Include: the mistake, the ruling, the steps.", ar: "ضمّن: الخطأ والحكم والخطوات." },
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
            question: { en: "What is sujud as-sahw for?", ar: "ما سجود السهو؟" },
            options: [
            { en: "Correcting prayer mistakes", ar: "تصحيح أخطاء الصلاة" },
            { en: "Extra reward", ar: "ثواب إضافي" },
            { en: "Punishment", ar: "عقاب" },
            { en: "Fun", ar: "مرح" },
            ],
            correctIndex: 0,
            explanation: { en: "Correcting forgetfulness in prayer.", ar: "تصحيح النسيان في الصلاة." },
          },
          {
            question: { en: "How many sajdahs in sujud as-sahw?", ar: "كم سجدة في سجود السهو؟" },
            options: [
            { en: "Two", ar: "اثنتان" },
            { en: "One", ar: "واحدة" },
            { en: "Three", ar: "ثلاث" },
            { en: "Four", ar: "أربع" },
            ],
            correctIndex: 0,
            explanation: { en: "Two sajdahs.", ar: "سجدتان." },
          },
          {
            question: { en: "If unsure 3 or 4 rakahs?", ar: "إن شككت ٣ أو ٤ ركعات؟" },
            options: [
            { en: "Build on 3", ar: "ابنِ على ٣" },
            { en: "Guess 4", ar: "خمّن ٤" },
            { en: "Start over", ar: "أعد الصلاة" },
            { en: "Ignore it", ar: "تجاهل" },
            ],
            correctIndex: 0,
            explanation: { en: "Build on the lesser (3).", ar: "ابنِ على الأقلّ (٣)." },
          },
          {
            question: { en: "How many sajdah verses in Quran?", ar: "كم آية سجدة في القرآن؟" },
            options: [
            { en: "15", ar: "١٥" },
            { en: "5", ar: "٥" },
            { en: "3", ar: "٣" },
            { en: "20", ar: "٢٠" },
            ],
            correctIndex: 0,
            explanation: { en: "15 verses.", ar: "١٥ آية." },
          },
          {
            question: { en: "Does tilawah sajdah need wudu?", ar: "هل سجود التلاوة يحتاج وضوءًا؟" },
            options: [
            { en: "Not outside prayer", ar: "لا خارج الصلاة" },
            { en: "Always", ar: "دائمًا" },
            { en: "Never", ar: "أبدًا" },
            { en: "Only Friday", ar: "الجمعة فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Not required outside prayer.", ar: "لا يُشترط خارج الصلاة." },
          },
          {
            question: { en: "When did the Prophet do sujud as-sahw?", ar: "متى سجد النبيّ للسهو؟" },
            options: [
            { en: "When he forgot in prayer", ar: "عندما نسي في الصلاة" },
            { en: "Every prayer", ar: "كلّ صلاة" },
            { en: "Never", ar: "أبدًا" },
            { en: "Only Ramadan", ar: "رمضان فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "When he made mistakes in prayer.", ar: "عندما أخطأ في الصلاة." },
          },
          {
            question: { en: "Sahw means?", ar: "السهو يعني؟" },
            options: [
            { en: "Forgetfulness", ar: "النسيان" },
            { en: "Knowledge", ar: "العلم" },
            { en: "Speed", ar: "السرعة" },
            { en: "Anger", ar: "الغضب" },
            ],
            correctIndex: 0,
            explanation: { en: "Forgetfulness.", ar: "النسيان." },
          },
          {
            question: { en: "Sujud at-tilawah is?", ar: "سجود التلاوة هو؟" },
            options: [
            { en: "One sajdah at sajdah verses", ar: "سجدة عند آيات السجدة" },
            { en: "Two sajdahs", ar: "سجدتان" },
            { en: "Three rakahs", ar: "ثلاث ركعات" },
            { en: "A full prayer", ar: "صلاة كاملة" },
            ],
            correctIndex: 0,
            explanation: { en: "One sajdah at the sajdah verses.", ar: "سجدة عند آيات السجدة." },
          },
          {
            question: { en: "What do you say in sujud as-sahw?", ar: "ماذا تقول في سجود السهو؟" },
            options: [
            { en: "SubhanAllah", ar: "سبحان الله" },
            { en: "Allahu Akbar only", ar: "الله أكبر فقط" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Salam", ar: "السلام" },
            ],
            correctIndex: 0,
            explanation: { en: "SubhanAllah (glorify Allah).", ar: "سبحان الله." },
          },
          {
            question: { en: "Who taught us sujud as-sahw?", ar: "من علّمنا سجود السهو؟" },
            options: [
            { en: "The Prophet ﷺ", ar: "النبيّ ﷺ" },
            { en: "Umar", ar: "عمر" },
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Scholars only", ar: "العلماء فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "The Prophet through his practice.", ar: "النبيّ ﷺ بسنّته." },
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
        title: { en: "Sujud as-Sahw and Tilawah", ar: "سجود السهو والتلاوة" },
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
        code: "SUJUD001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Sujud As-Sahw and Sujud At-Tilawah", ar: "ورقة عمل — سُجودُ السَّهوِ وسُجودُ التِّلاوة" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Sujud As-Sahw and Sujud At-Tilawah", ar: "ورقة عمل — سُجودُ السَّهوِ وسُجودُ التِّلاوة" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "What is sahw?", ar: "ما السهو؟" },
                options: [
                { en: "Forgetfulness", ar: "النسيان" },
                { en: "Knowledge", ar: "العلم" },
                { en: "Speed", ar: "السرعة" },
                { en: "Anger", ar: "الغضب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How many sahw sajdahs?", ar: "كم سجدة سهو؟" },
                options: [
                { en: "Two", ar: "اثنتان" },
                { en: "One", ar: "واحدة" },
                { en: "Three", ar: "ثلاث" },
                { en: "Five", ar: "خمس" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Doubt in rakahs?", ar: "الشكّ في الركعات؟" },
                options: [
                { en: "Build on lesser", ar: "ابنِ على الأقلّ" },
                { en: "Guess", ar: "خمّن" },
                { en: "Stop", ar: "توقّف" },
                { en: "Start over", ar: "أعد" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Sajdah verses count?", ar: "عدد آيات السجدة؟" },
                options: [
                { en: "15", ar: "١٥" },
                { en: "5", ar: "٥" },
                { en: "10", ar: "١٠" },
                { en: "20", ar: "٢٠" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tilawah sajdah is?", ar: "سجود التلاوة؟" },
                options: [
                { en: "One sajdah", ar: "سجدة واحدة" },
                { en: "Two rakahs", ar: "ركعتان" },
                { en: "Full prayer", ar: "صلاة كاملة" },
                { en: "Three sajdahs", ar: "ثلاث سجدات" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Sujud as-sahw is 2 sajdahs.", ar: "سجود السهو سجدتان." }, answer: true },
              { statement: { en: "Build on the higher count when doubtful.", ar: "ابنِ على الأكثر عند الشكّ." }, answer: false },
              { statement: { en: "There are 15 sajdah verses.", ar: "هناك ١٥ آية سجدة." }, answer: true },
              { statement: { en: "Sujud at-tilawah always needs wudu.", ar: "سجود التلاوة يحتاج وضوءًا دائمًا." }, answer: false },
              { statement: { en: "The Prophet taught sujud as-sahw by example.", ar: "علّم النبيّ سجود السهو بالفعل." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Sahw", ar: "السهو" }, answer: { en: "Forgetfulness", ar: "النسيان" } },
              { prompt: { en: "Tilawah", ar: "التلاوة" }, answer: { en: "Recitation", ar: "القراءة" } },
              { prompt: { en: "Ayat as-Sajdah", ar: "آيات السجدة" }, answer: { en: "Verses requiring prostration", ar: "آيات تستوجب السجود" } },
              { prompt: { en: "Tashahhud", ar: "التشهّد" }, answer: { en: "Sitting testimony", ar: "الجلوس للشهادة" } },
              { prompt: { en: "Salam", ar: "السلام" }, answer: { en: "Prayer ending greeting", ar: "تسليم الصلاة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Sujud as-sahw is _______ sajdahs.", ar: "سجود السهو _______ سجدتين." }, blankAnswer: { en: "two", ar: "سجدتان" } },
              { sentence: { en: "Build on the _______ count.", ar: "ابنِ على _______." }, blankAnswer: { en: "lesser", ar: "الأقلّ" } },
              { sentence: { en: "There are _______ sajdah verses.", ar: "هناك _______ آية سجدة." }, blankAnswer: { en: "15", ar: "١٥" } },
              { sentence: { en: "Sahw means _______.", ar: "السهو يعني _______." }, blankAnswer: { en: "forgetfulness", ar: "النسيان" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Make a mistake in prayer", ar: "أخطئ في الصلاة" },
              { en: "Recognise the error (addition/omission/doubt)", ar: "أدرك الخطأ (زيادة/نقص/شكّ)" },
              { en: "Complete the prayer correctly", ar: "أكمل الصلاة بشكل صحيح" },
              { en: "Make final tashahhud", ar: "التشهّد الأخير" },
              { en: "Perform 2 sajdahs for sahw", ar: "سجدتان للسهو" },
              { en: "Make salam", ar: "التسليم" },
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
