import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const takeAccountOfYourselves: CourseLesson = {
  slug: "g6y7-take-account-of-yourselves",
  name: { en: "Take Account of Yourselves", ar: "حاسِبوا أنفُسَكُم" },
  shortIntro: {
    en: "A demanding study of muhasabah (self-accountability): the Qur\'anic command to look at what we send ahead for tomorrow, \'Umar\'s famous principle of judging the self before being judged, and a practical method for examining the heart, the tongue, and the day.",
    ar: "دِراسةٌ مُطالِبةٌ لِمُحاسَبةِ النَّفس: الأمرُ القُرآنِيُّ بِالنَّظَرِ فيما نُقَدِّمُهُ لِلغَد، وقاعِدةُ عُمَرَ المَشهورةُ في مُحاسَبةِ النَّفسِ قَبلَ الحِساب، ومَنهَجٌ عَمَلِيٌّ لِمُراجَعةِ القَلبِ واللِّسانِ واليَوم.",
  },
  quranSurahs: ["Al-Hashr 18", "Al-Qiyamah 2", "Al-Infitar 5"],
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
        title: { en: "Can I just live as I want with no accountability?", ar: "هل أستطيع أن أعيش كما أريد بلا حساب؟" },
        body: {
          en: "A teenager says: \'Life is short. Enjoy it now, worry about judgement later. Allah is merciful — He will forgive everything anyway. Why bother holding yourself accountable?\'",
          ar: "مراهق يقول: «الحياة قصيرة. استمتع الآن واقلق لاحقًا. الله رحيم سيغفر كلّ شيء. لماذا تحاسب نفسك؟»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Umar\'s famous quote and Quranic evidence on self-accounting.",
          ar: "انتقد مستخدمًا قول عمر والأدلّة القرآنيّة عن محاسبة النفس.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "Umar ibn al-Khattab said: \'Take account of yourselves before you are taken to account.\'",
        ar: "قال عمر بن الخطّاب: «حاسبوا أنفسكم قبل أن تحاسبوا.»",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Muhasabah (Self-accounting)", ar: "محاسبة" } },
          { image: IMG.childQuran, keyword: { en: "Tawbah (Repentance)", ar: "توبة" } },
          { image: IMG.lantern, keyword: { en: "Muraqabah (Self-monitoring)", ar: "مراقبة" } },
          { image: IMG.skyBlue, keyword: { en: "Akhirah (Hereafter)", ar: "آخرة" } },
          { image: IMG.bookshelf, keyword: { en: "Hisab (Reckoning)", ar: "حساب" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'O you who believe, fear Allah. Let every soul look to what it has sent forth for tomorrow.\' (Al-Hashr 18)",
        ar: "﴿يا أيّها الذين آمنوا اتّقوا الله ولتنظر نفس ما قدّمت لغد﴾ (الحشر ١٨)",
      },
    },
    {
      title: { en: "Take Account of Yourselves", ar: "حاسِبوا أنفُسَكُم" },
      learningObjectives: [
        { en: "Explain the concept of muhasabah (self-accounting) in Islam.", ar: "أشرح مفهوم محاسبة النفس في الإسلام." },
        { en: "Describe how self-accounting leads to self-improvement.", ar: "أصف كيف تؤدّي المحاسبة إلى تطوير الذات." },
      ],
      successCriteria: [
        { en: "I can define muhasabah with evidence.", ar: "أعرّف المحاسبة بالدليل." },
        { en: "I can list 3 benefits of daily self-accounting.", ar: "أذكر ٣ فوائد للمحاسبة اليوميّة." },
        { en: "I can explain the connection between muhasabah and tawbah.", ar: "أشرح العلاقة بين المحاسبة والتوبة." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Self-Accounting in Islam", ar: "محاسبة النفس في الإسلام" },
      learningObjectives: [
        { en: "Understand the importance and method of muhasabah.", ar: "أفهم أهمّيّة المحاسبة وطريقتها." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Quran — Al-Hashr 18", ar: "القرآن — الحشر ١٨" },
          lines: [
            { en: "\'Let every soul look to what it has sent forth for tomorrow, and fear Allah.\' This verse commands Muslims to examine their deeds daily.", ar: "﴿ولتنظر نفس ما قدّمت لغد واتّقوا الله﴾ تأمر المسلمين بمراجعة أعمالهم يوميًّا." },
          ],
        },
        {
          label: { en: "Umar\'s Statement", ar: "قول عمر" },
          lines: [
            { en: "\'Take account of yourselves before you are taken to account, and weigh your deeds before they are weighed for you.\' This sets the standard for daily reflection.", ar: "«حاسبوا أنفسكم قبل أن تحاسبوا وزنوا أعمالكم قبل أن توزن عليكم.» هذا يضع معيار التأمّل اليومي." },
          ],
        },
        {
          label: { en: "Steps of Muhasabah", ar: "خطوات المحاسبة" },
          lines: [
            { en: "1) Review your day. 2) Identify sins. 3) Make tawbah. 4) Plan improvement. 5) Thank Allah for good deeds. This builds continuous growth.", ar: "١) راجع يومك. ٢) حدّد الذنوب. ٣) تب. ٤) خطّط للتحسّن. ٥) اشكر الله على الحسنات." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Muhasabah means taking account of yourself.", ar: "المحاسبة معناها مراجعة النفس." }, answer: true },
        { statement: { en: "Self-accounting is only for scholars.", ar: "محاسبة النفس للعلماء فقط." }, answer: false },
        { statement: { en: "Umar said to account for yourself before being accounted.", ar: "قال عمر حاسبوا أنفسكم قبل أن تحاسبوا." }, answer: true },
        { statement: { en: "Al-Hashr 18 is about business accounting.", ar: "الحشر ١٨ عن المحاسبة الماليّة." }, answer: false },
        { statement: { en: "Tawbah is connected to muhasabah.", ar: "التوبة مرتبطة بالمحاسبة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Umar said: \'Take _______ of yourselves before you are taken to account.\'", ar: "قال عمر: «_______ أنفسكم قبل أن تحاسبوا.»" }, answer: { en: "account", ar: "حاسبوا" } },
        { sentence: { en: "\'Let every soul look to what it has sent forth for _______.", ar: "﴿ولتنظر نفس ما قدّمت ل_______.﴾" }, answer: { en: "tomorrow", ar: "غد" } },
        { sentence: { en: "Self-accounting leads to _______ (repentance).", ar: "المحاسبة تؤدّي إلى _______ (التوبة)." }, answer: { en: "tawbah", ar: "التوبة" } },
        { sentence: { en: "Muhasabah is daily self-_______.", ar: "المحاسبة هي _______ النفس اليوميّة." }, answer: { en: "review", ar: "مراجعة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Islam teaches self-accounting (muhasabah) — reviewing your deeds daily, repenting from sins, and planning improvement.",
        ar: "يعلّم الإسلام محاسبة النفس — مراجعة الأعمال يوميًّا والتوبة والتخطيط للتحسّن.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Apply muhasabah principles to daily life.", ar: "طبّق مبادئ المحاسبة على الحياة اليوميّة." },
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
            title: { en: "Daily Self-Review", ar: "المراجعة اليوميّة" },
            image: IMG.bookshelf,
            color: "teal",
            topic: { en: "How to review your day", ar: "كيف تراجع يومك" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Hashr 18 commands every soul to look at what it has prepared.", ar: "الحشر ١٨ تأمر كلّ نفس بالنظر فيما قدّمت." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'A wise person accounts for himself and works for what is after death.\' (Tirmidhi)", ar: "«الكيّس من دان نفسه وعمل لما بعد الموت.» (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Daily review prevents accumulated sins.", ar: "المراجعة اليوميّة تمنع تراكم الذنوب." } },
            ],
            task: {
              title: { en: "Design a Muhasabah Journal", ar: "صمّم يوميّات محاسبة" },
              description: { en: "Create a daily self-accounting journal template.", ar: "أنشئ قالب يوميّات لمحاسبة النفس." },
              hint: { en: "Sections: Good deeds, Sins, Tawbah, Tomorrow\'s goals.", ar: "أقسام: الحسنات والذنوب والتوبة وأهداف الغد." },
            },
          },
          {
            id: "B",
            title: { en: "The Power of Tawbah", ar: "قوّة التوبة" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "Repentance and its conditions", ar: "التوبة وشروطها" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Turn to Allah in repentance, all of you, that you may succeed.\' (An-Nur 31)", ar: "﴿وتوبوا إلى الله جميعًا أيّها المؤمنون لعلّكم تفلحون﴾ (النور ٣١)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Allah extends His hand at night for the sinner of the day, and by day for the sinner of the night.\' (Muslim)", ar: "«إنّ الله يبسط يده بالليل ليتوب مسيء النهار ويبسط يده بالنهار ليتوب مسيء الليل.» (مسلم)" } },
              { label: { en: "Conditions", ar: "شروط" }, content: { en: "Regret, stop the sin, resolve not to return. If against a person: also seek their forgiveness.", ar: "الندم والإقلاع والعزم. إن كان حقّ آدمي: طلب المسامحة." } },
            ],
            task: {
              title: { en: "Write Tawbah Steps", ar: "اكتب خطوات التوبة" },
              description: { en: "Create a step-by-step tawbah guide with evidence.", ar: "أنشئ دليل توبة خطوة بخطوة." },
              hint: { en: "Include: conditions, Quran, Hadith, practical tips.", ar: "ضمّن: الشروط والقرآن والحديث ونصائح عمليّة." },
            },
          },
          {
            id: "C",
            title: { en: "Umar\'s Example", ar: "نموذج عمر" },
            image: IMG.grandMosque,
            color: "purple",
            topic: { en: "Leadership in self-accountability", ar: "القيادة في محاسبة النفس" },
            infoSections: [
              { label: { en: "History", ar: "تاريخ" }, content: { en: "Umar would walk at night checking on his people. He held himself to the highest standard.", ar: "كان عمر يمشي ليلًا يتفقّد رعيّته. حاسب نفسه بأعلى المعايير." } },
              { label: { en: "Quote", ar: "مقولة" }, content: { en: "\'If a mule trips in Iraq, I fear Allah will ask me why I did not pave the road.\'", ar: "«لو عثرت بغلة في العراق لخشيت أن يسألني الله لِمَ لم أسوِّ لها الطريق.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "True leadership is self-accountability before holding others accountable.", ar: "القيادة الحقيقيّة محاسبة النفس قبل محاسبة الآخرين." } },
            ],
            task: {
              title: { en: "Write a Leadership Reflection", ar: "اكتب تأمّلًا في القيادة" },
              description: { en: "Reflect on Umar\'s self-accountability and apply to student life.", ar: "تأمّل في محاسبة عمر لنفسه وطبّقها." },
              hint: { en: "Include: Umar\'s quotes, practical lessons, how to apply.", ar: "ضمّن: أقوال عمر ودروس عمليّة." },
            },
          },
          {
            id: "D",
            title: { en: "Preparing for the Akhirah", ar: "الاستعداد للآخرة" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Accountability in the Hereafter", ar: "الحساب في الآخرة" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Then as for he whose scales are heavy [with good deeds], he will be in a pleasant life.\' (Al-Qariah 6-7)", ar: "﴿فأمّا من ثقلت موازينه فهو في عيشة راضية﴾ (القارعة ٦-٧)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The feet of a servant will not move on the Day of Judgement until asked about four things.\' (Tirmidhi)", ar: "«لا تزول قدما عبد يوم القيامة حتّى يُسأل عن أربع.» (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Preparing now makes the accounting easier later.", ar: "الاستعداد الآن يسهّل الحساب لاحقًا." } },
            ],
            task: {
              title: { en: "Create an Akhirah Preparation Plan", ar: "أنشئ خطّة استعداد للآخرة" },
              description: { en: "Design a plan to prepare for the Day of Judgement.", ar: "صمّم خطّة للاستعداد ليوم القيامة." },
              hint: { en: "Include: the 4 questions, how to answer well, daily habits.", ar: "ضمّن: الأسئلة الأربعة وكيف تجيب والعادات اليوميّة." },
            },
          },
          {
            id: "E",
            title: { en: "Muhasabah in Modern Life", ar: "المحاسبة في الحياة المعاصرة" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Applying self-accounting today", ar: "تطبيق المحاسبة اليوم" },
            infoSections: [
              { label: { en: "Challenge", ar: "تحدٍّ" }, content: { en: "Social media, distractions, and peer pressure make self-accounting harder today.", ar: "وسائل التواصل والمُلهيات وضغط الأقران تصعّب المحاسبة اليوم." } },
              { label: { en: "Solution", ar: "حلّ" }, content: { en: "Set daily reminders, use journaling, pair muhasabah with night prayer.", ar: "ضع تذكيرات يوميّة واستخدم اليوميّات وقارن المحاسبة بقيام الليل." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The tools change but the principle remains.", ar: "الأدوات تتغيّر لكنّ المبدأ يبقى." } },
            ],
            task: {
              title: { en: "Design a Modern Muhasabah App", ar: "صمّم تطبيق محاسبة" },
              description: { en: "Design an app concept for daily muhasabah.", ar: "صمّم فكرة تطبيق للمحاسبة اليوميّة." },
              hint: { en: "Features: daily review prompts, tawbah tracker, good deed counter.", ar: "ميزات: تذكيرات ومتتبّع توبة وعدّاد حسنات." },
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
            question: { en: "Who said \'Take account of yourselves\'?", ar: "من قال «حاسبوا أنفسكم»؟" },
            options: [
            { en: "Umar ibn al-Khattab", ar: "عمر بن الخطّاب" },
            { en: "Abu Bakr", ar: "أبو بكر" },
            { en: "Ali", ar: "عليّ" },
            { en: "Uthman", ar: "عثمان" },
            ],
            correctIndex: 0,
            explanation: { en: "Umar ibn al-Khattab.", ar: "عمر بن الخطّاب." },
          },
          {
            question: { en: "What does Al-Hashr 18 command?", ar: "ماذا تأمر الحشر ١٨؟" },
            options: [
            { en: "Look at what you prepared for tomorrow", ar: "انظر ما قدّمت لغد" },
            { en: "Eat well", ar: "كُل جيّدًا" },
            { en: "Sleep early", ar: "نم باكرًا" },
            { en: "Travel", ar: "سافر" },
            ],
            correctIndex: 0,
            explanation: { en: "Let every soul look to what it has sent forth for tomorrow.", ar: "ولتنظر نفس ما قدّمت لغد." },
          },
          {
            question: { en: "What is muhasabah?", ar: "ما المحاسبة؟" },
            options: [
            { en: "Self-accounting", ar: "مراجعة النفس" },
            { en: "Mathematics", ar: "الرياضيّات" },
            { en: "Cooking", ar: "الطبخ" },
            { en: "Swimming", ar: "السباحة" },
            ],
            correctIndex: 0,
            explanation: { en: "Reviewing your deeds and actions.", ar: "مراجعة أعمالك وأفعالك." },
          },
          {
            question: { en: "What are the conditions of tawbah?", ar: "ما شروط التوبة؟" },
            options: [
            { en: "Regret, stop, resolve", ar: "ندم وإقلاع وعزم" },
            { en: "Just say sorry", ar: "قول آسف فقط" },
            { en: "Pay money", ar: "دفع مال" },
            { en: "Fast 3 days", ar: "صيام ٣ أيّام" },
            ],
            correctIndex: 0,
            explanation: { en: "Regret, stop the sin, resolve not to return.", ar: "الندم والإقلاع والعزم." },
          },
          {
            question: { en: "What did Umar fear about a mule in Iraq?", ar: "ماذا خشي عمر بشأن بغلة في العراق؟" },
            options: [
            { en: "Allah asking why he did not pave the road", ar: "أن يسأله الله لِمَ لم يسوِّ الطريق" },
            { en: "It running away", ar: "هروبها" },
            { en: "It being stolen", ar: "سرقتها" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "He feared Allah\'s questioning about his responsibility.", ar: "خشي مساءلة الله عن مسؤوليّته." },
          },
          {
            question: { en: "When does Allah extend His hand for repentance?", ar: "متى يبسط الله يده للتوبة؟" },
            options: [
            { en: "Day and night", ar: "ليلًا ونهارًا" },
            { en: "Only Friday", ar: "الجمعة فقط" },
            { en: "Only Ramadan", ar: "رمضان فقط" },
            { en: "Never", ar: "أبدًا" },
            ],
            correctIndex: 0,
            explanation: { en: "By night for day sinners, by day for night sinners.", ar: "بالليل لمسيء النهار وبالنهار لمسيء الليل." },
          },
          {
            question: { en: "How many things is a servant asked about?", ar: "كم شيء يُسأل عنه العبد؟" },
            options: [
            { en: "Four", ar: "أربعة" },
            { en: "Two", ar: "اثنان" },
            { en: "One", ar: "واحد" },
            { en: "Ten", ar: "عشرة" },
            ],
            correctIndex: 0,
            explanation: { en: "Four things (Tirmidhi).", ar: "أربعة أشياء (الترمذي)." },
          },
          {
            question: { en: "What makes scales heavy on Judgement Day?", ar: "ما يثقّل الميزان يوم القيامة؟" },
            options: [
            { en: "Good deeds", ar: "الحسنات" },
            { en: "Body weight", ar: "وزن الجسم" },
            { en: "Gold", ar: "الذهب" },
            { en: "Friends", ar: "الأصدقاء" },
            ],
            correctIndex: 0,
            explanation: { en: "Good deeds make scales heavy (Al-Qariah).", ar: "الحسنات تثقّل الميزان." },
          },
          {
            question: { en: "What is the wise person\'s quality?", ar: "ما صفة الكيّس؟" },
            options: [
            { en: "Accounts for himself and works for afterlife", ar: "يحاسب نفسه ويعمل لما بعد الموت" },
            { en: "Ignores religion", ar: "يتجاهل الدين" },
            { en: "Sleeps all day", ar: "ينام كلّ اليوم" },
            { en: "Only studies worldly things", ar: "يدرس الدنيا فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "A wise person accounts and prepares (Tirmidhi).", ar: "الكيّس يحاسب نفسه ويستعدّ (الترمذي)." },
          },
          {
            question: { en: "Is muhasabah daily or yearly?", ar: "المحاسبة يوميّة أم سنويّة؟" },
            options: [
            { en: "Daily", ar: "يوميّة" },
            { en: "Yearly", ar: "سنويّة" },
            { en: "Never", ar: "أبدًا" },
            { en: "Only in Ramadan", ar: "في رمضان فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "Daily self-accounting is recommended.", ar: "محاسبة النفس اليوميّة مستحبّة." },
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
        title: { en: "Self-Accounting in Islam", ar: "محاسبة النفس في الإسلام" },
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
        code: "ACCOUN01",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Take Account of Yourselves", ar: "ورقة عمل — حاسِبوا أنفُسَكُم" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Take Account of Yourselves", ar: "ورقة عمل — حاسِبوا أنفُسَكُم" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Who said \'take account of yourselves\'?", ar: "من قال «حاسبوا أنفسكم»؟" },
                options: [
                { en: "Umar", ar: "عمر" },
                { en: "Abu Bakr", ar: "أبو بكر" },
                { en: "Ali", ar: "عليّ" },
                { en: "Uthman", ar: "عثمان" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "What is muhasabah?", ar: "ما المحاسبة؟" },
                options: [
                { en: "Self-accounting", ar: "مراجعة النفس" },
                { en: "Fasting", ar: "صيام" },
                { en: "Praying", ar: "صلاة" },
                { en: "Reading", ar: "قراءة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "What does Al-Hashr 18 say?", ar: "ماذا تقول الحشر ١٨؟" },
                options: [
                { en: "Look to what you prepared for tomorrow", ar: "انظر ما قدّمت لغد" },
                { en: "Fast on Monday", ar: "صم الإثنين" },
                { en: "Read Quran daily", ar: "اقرأ القرآن يوميًّا" },
                { en: "Sleep early", ar: "نم مبكّرًا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How many conditions of tawbah?", ar: "كم شرط للتوبة؟" },
                options: [
                { en: "Three", ar: "ثلاثة" },
                { en: "One", ar: "واحد" },
                { en: "Five", ar: "خمسة" },
                { en: "Seven", ar: "سبعة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "A wise person does what?", ar: "الكيّس يفعل ماذا؟" },
                options: [
                { en: "Accounts for himself", ar: "يحاسب نفسه" },
                { en: "Sleeps", ar: "ينام" },
                { en: "Ignores", ar: "يتجاهل" },
                { en: "Plays", ar: "يلعب" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Muhasabah means self-accounting.", ar: "المحاسبة معناها مراجعة النفس." }, answer: true },
              { statement: { en: "Self-accounting is only in Ramadan.", ar: "المحاسبة في رمضان فقط." }, answer: false },
              { statement: { en: "Umar held himself to highest standards.", ar: "حاسب عمر نفسه بأعلى المعايير." }, answer: true },
              { statement: { en: "Tawbah has no conditions.", ar: "التوبة بلا شروط." }, answer: false },
              { statement: { en: "Al-Hashr 18 commands looking at deeds.", ar: "الحشر ١٨ تأمر بالنظر في الأعمال." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Muhasabah", ar: "محاسبة" }, answer: { en: "Self-accounting", ar: "مراجعة النفس" } },
              { prompt: { en: "Tawbah", ar: "توبة" }, answer: { en: "Repentance", ar: "الرجوع إلى الله" } },
              { prompt: { en: "Muraqabah", ar: "مراقبة" }, answer: { en: "Self-monitoring", ar: "مراقبة النفس" } },
              { prompt: { en: "Hisab", ar: "حساب" }, answer: { en: "Reckoning on Judgement Day", ar: "الحساب يوم القيامة" } },
              { prompt: { en: "Akhirah", ar: "آخرة" }, answer: { en: "The Hereafter", ar: "الحياة الأخرى" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Take _______ of yourselves before you are taken to account.\'", ar: "«_______ أنفسكم قبل أن تحاسبوا.»" }, blankAnswer: { en: "account", ar: "حاسبوا" } },
              { sentence: { en: "\'Let every soul look to what it sent for _______.", ar: "﴿ولتنظر نفس ما قدّمت ل_______.﴾" }, blankAnswer: { en: "tomorrow", ar: "غد" } },
              { sentence: { en: "The conditions of tawbah are: regret, stop, and _______.", ar: "شروط التوبة: ندم وإقلاع و_______." }, blankAnswer: { en: "resolve", ar: "عزم" } },
              { sentence: { en: "A wise person works for what is after _______.", ar: "الكيّس يعمل لما بعد _______." }, blankAnswer: { en: "death", ar: "الموت" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Commit a sin", ar: "ارتكاب ذنب" },
              { en: "Recognise the sin through muhasabah", ar: "إدراك الذنب بالمحاسبة" },
              { en: "Feel regret", ar: "الشعور بالندم" },
              { en: "Stop the sin immediately", ar: "الإقلاع عن الذنب فورًا" },
              { en: "Make sincere tawbah", ar: "التوبة الصادقة" },
              { en: "Resolve never to return", ar: "العزم على عدم العودة" },
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
