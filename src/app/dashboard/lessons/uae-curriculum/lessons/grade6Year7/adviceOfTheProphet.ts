import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const adviceOfTheProphet: CourseLesson = {
  slug: "g6y7-from-the-advice-of-the-prophet",
  name: { en: "From the Advice of the Prophet ﷺ", ar: "من وصايا الرسول ﷺ" },
  shortIntro: {
    en: "A study of the Prophet’s concise advice to Ibn Abbas — trust in Allah, mindfulness, and reliance on Him — and how to live by it.",
    ar: "دراسة لوصية النبي ﷺ الجامعة لابن عباس — حفظ الله، والمراقبة، والتوكل — وكيف نعيش بها.",
  },
  quranSurahs: ["At-Talaq 2-3"],
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
        title: { en: "Is it enough to just believe without acting?", ar: "هل يكفي أن نؤمن دون أن نعمل؟" },
        body: {
          en: "A student says: \'I believe in Allah in my heart, so I don\'t need to pray, be honest, or help others. Faith is in the heart, not in actions. If I get in trouble, I\'ll just make dua.\'",
          ar: "طالب يقول: «أنا أؤمن بالله في قلبي، فلا أحتاج للصلاة أو الصدق. الإيمان في القلب لا في الأفعال. إذا وقعت في مشكلة سأدعو فقط.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using the hadith of Ibn Abbas about preserving Allah.",
          ar: "انتقد باستخدام حديث ابن عبّاس عن حفظ الله.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Preserve Allah and He will preserve you. Preserve Allah and you will find Him before you.\' (Tirmidhi)",
        ar: "«احفظ الله يحفظك. احفظ الله تجده تجاهك.» (الترمذي)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Tawakkul (Reliance)", ar: "توكّل" } },
          { image: IMG.grandMosque, keyword: { en: "Hifz (Preservation)", ar: "حفظ" } },
          { image: IMG.lantern, keyword: { en: "Muraqabah (Mindfulness)", ar: "مراقبة" } },
          { image: IMG.skyBlue, keyword: { en: "Sabr (Patience)", ar: "صبر" } },
          { image: IMG.bookshelf, keyword: { en: "Yaqin (Certainty)", ar: "يقين" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Whoever is mindful of Allah, He will make a way out for him.\' (At-Talaq 2)",
        ar: "﴿ومن يتّق الله يجعل له مخرجًا﴾ (الطلاق ٢)",
      },
    },
    {
      title: { en: "From the Advice of the Prophet ﷺ", ar: "من وصايا الرسول ﷺ" },
      learningObjectives: [
        { en: "Explain the Prophet\'s advice to Ibn Abbas and its life applications.", ar: "أشرح وصيّة النبيّ لابن عبّاس وتطبيقاتها." },
        { en: "Analyse the connection between tawakkul and action.", ar: "أحلّل العلاقة بين التوكّل والعمل." },
      ],
      successCriteria: [
        { en: "I can recite the hadith of Ibn Abbas.", ar: "أسرد حديث ابن عبّاس." },
        { en: "I can explain tawakkul with examples.", ar: "أشرح التوكّل بأمثلة." },
        { en: "I can apply the advice in daily life.", ar: "أطبّق الوصيّة في الحياة اليوميّة." },
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
      title: { en: "From the Advice of the Prophet", ar: "من وصايا الرسول ﷺ" },
      learningObjectives: [
        { en: "Understand and apply the Prophet\'s advice to Ibn Abbas in daily life.", ar: "أفهم وأطبّق وصيّة النبيّ لابن عبّاس في الحياة اليوميّة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "The Hadith of Ibn Abbas", ar: "حديث ابن عبّاس" },
          lines: [
            { en: "\'O young man, I shall teach you some words: Preserve Allah and He will preserve you. Preserve Allah and you will find Him before you. If you ask, ask Allah. If you seek help, seek help from Allah.\' (Tirmidhi)", ar: "«يا غلام إنّي أعلّمك كلمات: احفظ الله يحفظك. احفظ الله تجده تجاهك. إذا سألت فاسأل الله. وإذا استعنت فاستعن بالله.» (الترمذي)" },
          ],
        },
        {
          label: { en: "Tawakkul — Reliance on Allah", ar: "التوكّل على الله" },
          lines: [
            { en: "Tawakkul means trusting Allah while taking action. \'Tie your camel and then rely on Allah.\' (Tirmidhi). At-Talaq 2-3: \'Whoever is mindful of Allah, He will make a way out and provide from where he does not expect.\'", ar: "التوكّل يعني الثقة بالله مع العمل. «اعقلها وتوكّل.» (الترمذي). الطلاق ٢-٣: ﴿ومن يتّق الله يجعل له مخرجًا ويرزقه من حيث لا يحتسب﴾" },
          ],
        },
        {
          label: { en: "Mindfulness of Allah", ar: "المراقبة" },
          lines: [
            { en: "Being aware that Allah sees you always. Al-Hadid 4: \'He is with you wherever you are.\' This awareness shapes all behaviour — honesty, prayer, helping others.", ar: "الوعي بأنّ الله يراك دائمًا. الحديد ٤: ﴿وهو معكم أين ما كنتم﴾ هذا الوعي يشكّل كلّ السلوك — الصدق والصلاة ومساعدة الآخرين." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Preserve Allah and He will preserve you.", ar: "احفظ الله يحفظك." }, answer: true },
        { statement: { en: "Faith is only in the heart, not actions.", ar: "الإيمان في القلب فقط لا الأفعال." }, answer: false },
        { statement: { en: "Tawakkul means relying on Allah without action.", ar: "التوكّل يعني الاعتماد على الله بلا عمل." }, answer: false },
        { statement: { en: "The hadith was told to Ibn Abbas.", ar: "الحديث قيل لابن عبّاس." }, answer: true },
        { statement: { en: "Allah is with us wherever we are.", ar: "الله معنا أينما كنّا." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Preserve Allah and He will _______ you.\'", ar: "«احفظ الله _______ يحفظك.»" }, answer: { en: "preserve", ar: "يحفظك" } },
        { sentence: { en: "\'If you ask, ask _______.", ar: "«إذا سألت فاسأل _______.»" }, answer: { en: "Allah", ar: "الله" } },
        { sentence: { en: "\'Tie your camel and then _______.", ar: "«اعقلها و_______.»" }, answer: { en: "rely on Allah", ar: "توكّل" } },
        { sentence: { en: "\'Whoever is _______ of Allah, He makes a way out.\'", ar: "﴿ومن _______ الله يجعل له مخرجًا﴾" }, answer: { en: "mindful", ar: "يتّق" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Preserve Allah and He preserves you — act, trust, and be mindful. Faith is heart + action.",
        ar: "احفظ الله يحفظك — اعمل وتوكّل وراقب. الإيمان قلب وعمل.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the Prophet\'s advice from different angles.", ar: "استكشف وصيّة النبيّ من زوايا مختلفة." },
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
            title: { en: "Preserving Allah", ar: "حفظ الله" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "What does it mean?", ar: "ما معناه؟" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Preserve Allah and He will preserve you.\'", ar: "«احفظ الله يحفظك.»" } },
              { label: { en: "Meaning", ar: "معنى" }, content: { en: "Preserving = keeping His commands, staying away from sins.", ar: "الحفظ = التزام أوامره والابتعاد عن المعاصي." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "When you guard your relationship with Allah, He guards you.", ar: "حين تحفظ علاقتك بالله يحفظك." } },
            ],
            task: {
              title: { en: "Define Preservation", ar: "عرّف الحفظ" },
              description: { en: "Explain what preserving Allah means with 5 examples.", ar: "اشرح معنى حفظ الله بـ٥ أمثلة." },
              hint: { en: "Include: prayer, honesty, avoiding sins, helping others, Quran.", ar: "ضمّن: الصلاة والصدق وتجنّب المعاصي والمساعدة والقرآن." },
            },
          },
          {
            id: "B",
            title: { en: "Tawakkul in Action", ar: "التوكّل بالعمل" },
            image: IMG.grandMosque,
            color: "blue",
            topic: { en: "Trust + effort", ar: "الثقة + الجهد" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Tie your camel and rely on Allah.\' (Tirmidhi)", ar: "«اعقلها وتوكّل.» (الترمذي)" } },
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "At-Talaq 2-3: mindfulness leads to solutions.", ar: "الطلاق ٢-٣: التقوى تؤدّي إلى الحلول." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Real tawakkul = trust Allah + do your part.", ar: "التوكّل الحقيقي = ثق بالله + ابذل جهدك." } },
            ],
            task: {
              title: { en: "Create Tawakkul Examples", ar: "أنشئ أمثلة توكّل" },
              description: { en: "Write 5 real-life tawakkul situations.", ar: "اكتب ٥ مواقف توكّل واقعيّة." },
              hint: { en: "Include: the situation, the action, the trust, the outcome.", ar: "ضمّن: الموقف والعمل والثقة والنتيجة." },
            },
          },
          {
            id: "C",
            title: { en: "Muraqabah — Mindfulness", ar: "المراقبة" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Allah sees you", ar: "الله يراك" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Hadid 4: \'He is with you wherever you are.\'", ar: "الحديد ٤: ﴿وهو معكم أين ما كنتم﴾" } },
              { label: { en: "Ihsan", ar: "إحسان" }, content: { en: "\'Worship Allah as if you see Him; if not, He sees you.\' (Muslim)", ar: "«اعبد الله كأنّك تراه فإن لم تكن تراه فإنّه يراك.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Knowing Allah watches changes your behaviour completely.", ar: "معرفة أنّ الله يراقب تغيّر سلوكك تمامًا." } },
            ],
            task: {
              title: { en: "Write a Muraqabah Reflection", ar: "اكتب تأمّلًا في المراقبة" },
              description: { en: "Reflect on how awareness of Allah changes your day.", ar: "تأمّل كيف يغيّر وعيك بالله يومك." },
              hint: { en: "Include: morning, school, home, before sleep.", ar: "ضمّن: الصباح والمدرسة والبيت وقبل النوم." },
            },
          },
          {
            id: "D",
            title: { en: "Asking Allah Alone", ar: "سؤال الله وحده" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "If you ask, ask Allah", ar: "إذا سألت فاسأل الله" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'If you ask, ask Allah. If you seek help, seek help from Allah.\' (Tirmidhi)", ar: "«إذا سألت فاسأل الله. وإذا استعنت فاستعن بالله.» (الترمذي)" } },
              { label: { en: "Meaning", ar: "معنى" }, content: { en: "Ultimate reliance is on Allah — people are means, not the source.", ar: "الاعتماد النهائي على الله — الناس وسائل لا مصدر." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Turn to Allah first in all matters.", ar: "توجّه لله أوّلًا في كلّ أمر." } },
            ],
            task: {
              title: { en: "Practise Asking Allah", ar: "تدرّب على سؤال الله" },
              description: { en: "Write 5 situations where you should ask Allah first.", ar: "اكتب ٥ مواقف يجب فيها سؤال الله أوّلًا." },
              hint: { en: "Include: exams, illness, fear, decisions, gratitude.", ar: "ضمّن: الامتحانات والمرض والخوف والقرارات والشكر." },
            },
          },
          {
            id: "E",
            title: { en: "Living the Advice", ar: "عش الوصيّة" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Daily application", ar: "التطبيق اليومي" },
            infoSections: [
              { label: { en: "Goal", ar: "هدف" }, content: { en: "Make the Prophet\'s advice your daily guide — morning to night.", ar: "اجعل وصيّة النبيّ دليلك اليومي — من الصباح إلى الليل." } },
              { label: { en: "Steps", ar: "خطوات" }, content: { en: "Morning dua, mindful prayer, honest speech, helping others, night reflection.", ar: "دعاء الصباح وصلاة واعية وكلام صادق ومساعدة الآخرين وتأمّل الليل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Small daily actions = big changes in faith.", ar: "أعمال يوميّة صغيرة = تغييرات كبيرة في الإيمان." } },
            ],
            task: {
              title: { en: "Write Your Daily Guide", ar: "اكتب دليلك اليومي" },
              description: { en: "Create a daily schedule applying the hadith.", ar: "أنشئ جدولًا يوميًّا بتطبيق الحديث." },
              hint: { en: "Include: morning, afternoon, evening actions with evidence.", ar: "ضمّن: أعمال الصباح والظهر والمساء بأدلّة." },
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
            question: { en: "The hadith was told to?", ar: "الحديث قيل ل؟" },
            options: [
            { en: "Ibn Abbas", ar: "ابن عبّاس" },
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Umar", ar: "عمر" },
            { en: "Ali", ar: "علي" },
            ],
            correctIndex: 0,
            explanation: { en: "Ibn Abbas.", ar: "ابن عبّاس." },
          },
          {
            question: { en: "Preserve Allah and He will?", ar: "احفظ الله و؟" },
            options: [
            { en: "Preserve you", ar: "يحفظك" },
            { en: "Ignore you", ar: "يتجاهلك" },
            { en: "Test you", ar: "يختبرك" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Preserve you.", ar: "يحفظك." },
          },
          {
            question: { en: "Tawakkul means?", ar: "التوكّل يعني؟" },
            options: [
            { en: "Trust + action", ar: "ثقة + عمل" },
            { en: "Laziness", ar: "كسل" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Fear", ar: "خوف" },
            ],
            correctIndex: 0,
            explanation: { en: "Trust in Allah + taking action.", ar: "الثقة بالله + العمل." },
          },
          {
            question: { en: "If you ask, ask?", ar: "إذا سألت فاسأل؟" },
            options: [
            { en: "Allah", ar: "الله" },
            { en: "People", ar: "الناس" },
            { en: "No one", ar: "لا أحد" },
            { en: "Friends", ar: "الأصدقاء" },
            ],
            correctIndex: 0,
            explanation: { en: "Allah.", ar: "الله." },
          },
          {
            question: { en: "Tie your camel means?", ar: "اعقلها يعني؟" },
            options: [
            { en: "Take action + trust", ar: "اعمل + توكّل" },
            { en: "Do nothing", ar: "لا تفعل شيئًا" },
            { en: "Run away", ar: "اهرب" },
            { en: "Sleep", ar: "نم" },
            ],
            correctIndex: 0,
            explanation: { en: "Take practical steps then trust Allah.", ar: "اتّخذ خطوات عمليّة ثمّ توكّل." },
          },
          {
            question: { en: "Ihsan means worship as if?", ar: "الإحسان يعني العبادة كأنّك؟" },
            options: [
            { en: "You see Allah", ar: "تراه" },
            { en: "Sleeping", ar: "نائم" },
            { en: "Alone", ar: "وحيد" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "You see Allah; if not, He sees you.", ar: "تراه فإن لم تراه فإنّه يراك." },
          },
          {
            question: { en: "At-Talaq 2-3 says?", ar: "الطلاق ٢-٣ تقول؟" },
            options: [
            { en: "Allah makes a way out", ar: "الله يجعل مخرجًا" },
            { en: "Give up", ar: "استسلم" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Ignore problems", ar: "تجاهل" },
            ],
            correctIndex: 0,
            explanation: { en: "Makes a way out for the mindful.", ar: "يجعل مخرجًا للمتّقين." },
          },
          {
            question: { en: "Faith requires?", ar: "الإيمان يتطلّب؟" },
            options: [
            { en: "Heart and actions", ar: "القلب والأفعال" },
            { en: "Heart only", ar: "القلب فقط" },
            { en: "Actions only", ar: "الأفعال فقط" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Both heart and actions.", ar: "القلب والأفعال معًا." },
          },
          {
            question: { en: "Allah is with you?", ar: "الله معكم؟" },
            options: [
            { en: "Wherever you are", ar: "أينما كنتم" },
            { en: "Only in mosque", ar: "في المسجد فقط" },
            { en: "Never", ar: "أبدًا" },
            { en: "Sometimes", ar: "أحيانًا" },
            ],
            correctIndex: 0,
            explanation: { en: "Wherever you are (Al-Hadid 4).", ar: "أينما كنتم (الحديد ٤)." },
          },
          {
            question: { en: "The hadith is in?", ar: "الحديث في؟" },
            options: [
            { en: "Tirmidhi", ar: "الترمذي" },
            { en: "Not recorded", ar: "غير مسجّل" },
            { en: "Unknown", ar: "مجهول" },
            { en: "Newspaper", ar: "جريدة" },
            ],
            correctIndex: 0,
            explanation: { en: "Tirmidhi.", ar: "الترمذي." },
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
        title: { en: "Advice of the Prophet", ar: "وصايا الرسول" },
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
        code: "ADVCE001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — From the Advice of the Prophet ﷺ", ar: "ورقة عمل — من وصايا الرسول ﷺ" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — From the Advice of the Prophet ﷺ", ar: "ورقة عمل — من وصايا الرسول ﷺ" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Told to?", ar: "قيل ل؟" },
                options: [
                { en: "Ibn Abbas", ar: "ابن عبّاس" },
                { en: "Abu Bakr", ar: "أبو بكر" },
                { en: "Umar", ar: "عمر" },
                { en: "Ali", ar: "علي" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Preserve Allah?", ar: "احفظ الله؟" },
                options: [
                { en: "He preserves you", ar: "يحفظك" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Punishment", ar: "عقاب" },
                { en: "Test", ar: "اختبار" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Tawakkul?", ar: "التوكّل؟" },
                options: [
                { en: "Trust + act", ar: "ثقة + عمل" },
                { en: "Lazy", ar: "كسل" },
                { en: "Fear", ar: "خوف" },
                { en: "Nothing", ar: "لا شيء" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Ask?", ar: "اسأل؟" },
                options: [
                { en: "Allah", ar: "الله" },
                { en: "People", ar: "الناس" },
                { en: "No one", ar: "لا أحد" },
                { en: "Teacher", ar: "المعلّم" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Faith needs?", ar: "الإيمان يحتاج؟" },
                options: [
                { en: "Heart + actions", ar: "قلب + أفعال" },
                { en: "Heart only", ar: "قلب فقط" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Money", ar: "مال" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Preserve Allah = He preserves you.", ar: "احفظ الله = يحفظك." }, answer: true },
              { statement: { en: "Faith is heart only.", ar: "الإيمان قلب فقط." }, answer: false },
              { statement: { en: "Tawakkul needs action.", ar: "التوكّل يحتاج عملًا." }, answer: true },
              { statement: { en: "Ask people first.", ar: "اسأل الناس أوّلًا." }, answer: false },
              { statement: { en: "Allah is always with us.", ar: "الله معنا دائمًا." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Tawakkul", ar: "توكّل" }, answer: { en: "Reliance on Allah", ar: "التوكّل" } },
              { prompt: { en: "Hifz", ar: "حفظ" }, answer: { en: "Preservation", ar: "الحفظ" } },
              { prompt: { en: "Muraqabah", ar: "مراقبة" }, answer: { en: "Mindfulness", ar: "المراقبة" } },
              { prompt: { en: "Ihsan", ar: "إحسان" }, answer: { en: "Excellence", ar: "الإحسان" } },
              { prompt: { en: "Sabr", ar: "صبر" }, answer: { en: "Patience", ar: "الصبر" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Preserve Allah and He will _______ you.\'", ar: "«احفظ الله _______.»" }, blankAnswer: { en: "preserve", ar: "يحفظك" } },
              { sentence: { en: "\'If you ask, ask _______.", ar: "«إذا سألت فاسأل _______.»" }, blankAnswer: { en: "Allah", ar: "الله" } },
              { sentence: { en: "\'Tie your camel and _______.", ar: "«اعقلها و_______.»" }, blankAnswer: { en: "rely on Allah", ar: "توكّل" } },
              { sentence: { en: "Faith = heart + _______.", ar: "الإيمان = قلب + _______." }, blankAnswer: { en: "actions", ar: "أفعال" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn the hadith of Ibn Abbas", ar: "تعلّم حديث ابن عبّاس" },
              { en: "Understand preservation (hifz)", ar: "افهم الحفظ" },
              { en: "Practise tawakkul with action", ar: "تدرّب على التوكّل بالعمل" },
              { en: "Develop muraqabah (mindfulness)", ar: "طوّر المراقبة" },
              { en: "Ask Allah in all matters", ar: "اسأل الله في كلّ أمر" },
              { en: "Apply the advice daily", ar: "طبّق الوصيّة يوميًّا" },
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
