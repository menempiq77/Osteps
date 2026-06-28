import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const uaeServiceWorld: CourseLesson = {
  slug: "g6y7-the-uae-in-service-of-the-world",
  name: { en: "The UAE in Service of the World", ar: "الإمارات في خدمة العالم" },
  shortIntro: {
    en: "How the UAE embodies Islamic values of charity, aid, and global humanitarianism inspired by its founding vision.",
    ar: "كيف تجسّد الإمارات القيم الإسلاميّة في الإحسان والمساعدة والعمل الإنساني العالمي المستلهَم من رؤية المؤسّس.",
  },
  quranSurahs: ["Al-Maidah 2","Al-Anbiya 107"],
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
        title: { en: "Is the UAE only about wealth?", ar: "هل الإمارات عن الثروة فقط؟" },
        body: {
          en: "A student says: \'The UAE is just rich from oil. They don\'t do anything for the world. They only care about buildings and luxury. Humanitarian work is for NGOs, not countries.\'",
          ar: "طالب يقول: «الإمارات غنيّة من النفط فقط. لا تفعل شيئًا للعالم. تهتمّ بالمباني والرفاهية فقط. العمل الإنساني للمنظّمات لا الدول.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using evidence of UAE global humanitarian leadership.",
          ar: "انتقد بأدلّة على قيادة الإمارات الإنسانيّة العالميّة.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Cooperate in righteousness and piety.\' (Al-Ma\'idah 2)",
        ar: "﴿وتعاونوا على البرّ والتقوى﴾ (المائدة ٢)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Khidmah (Service)", ar: "خدمة" } },
          { image: IMG.skyBlue, keyword: { en: "Ta\'awun (Cooperation)", ar: "تعاون" } },
          { image: IMG.childQuran, keyword: { en: "Ihsan (Excellence)", ar: "إحسان" } },
          { image: IMG.lantern, keyword: { en: "Zakat (Giving)", ar: "زكاة" } },
          { image: IMG.bookshelf, keyword: { en: "Ummah (Community)", ar: "أمّة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'The best of people are those most beneficial to others.\' (Tabarani)",
        ar: "«خير الناس أنفعهم للناس.» (الطبراني)",
      },
    },
    {
      title: { en: "The UAE in Service of the World", ar: "الإمارات في خدمة العالم" },
      learningObjectives: [
        { en: "Explain UAE\'s role in global humanitarian service.", ar: "أشرح دور الإمارات في الخدمة الإنسانيّة العالميّة." },
        { en: "Connect UAE service values to Islamic principles.", ar: "أربط قيم خدمة الإمارات بالمبادئ الإسلاميّة." },
      ],
      successCriteria: [
        { en: "I can list 5 UAE humanitarian initiatives.", ar: "أذكر ٥ مبادرات إنسانيّة إماراتيّة." },
        { en: "I can connect UAE service to Islamic values.", ar: "أربط خدمة الإمارات بالقيم الإسلاميّة." },
        { en: "I can explain Sheikh Zayed\'s vision of giving.", ar: "أشرح رؤية الشيخ زايد في العطاء." },
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
      title: { en: "UAE — Service to the World", ar: "الإمارات — خدمة العالم" },
      learningObjectives: [
        { en: "Understand UAE\'s global humanitarian role and its Islamic foundation.", ar: "أفهم دور الإمارات الإنساني العالمي وأساسه الإسلامي." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Sheikh Zayed\'s Vision", ar: "رؤية الشيخ زايد" },
          lines: [
            { en: "\'Money is worthless if not used for the benefit of the people.\' He built hospitals, schools, mosques worldwide. Established Zayed Charitable Foundation, supported education and health across developing nations.", ar: "«المال بلا قيمة إن لم يُنفق لخدمة الناس.» بنى مستشفيات ومدارس ومساجد في العالم. أسّس مؤسّسة زايد الخيريّة ودعم التعليم والصحّة في الدول النامية." },
          ],
        },
        {
          label: { en: "UAE Humanitarian Record", ar: "السجلّ الإنساني الإماراتي" },
          lines: [
            { en: "#1 per capita in humanitarian aid multiple years. Emirates Red Crescent in 150+ countries. Dubai Cares educating millions. UAE aided earthquake, flood, pandemic relief globally. Over $50 billion in aid since founding.", ar: "#١ في المساعدات للفرد سنوات عديدة. الهلال الأحمر في ١٥٠+ دولة. دبي العطاء تعلّم الملايين. الإمارات أغاثت في الزلازل والفيضانات والجوائح. أكثر من ٥٠ مليار دولار منذ التأسيس." },
          ],
        },
        {
          label: { en: "Islamic Foundation", ar: "الأساس الإسلامي" },
          lines: [
            { en: "Al-Ma\'idah 2: Cooperate in righteousness. The Prophet said: \'Allah helps the servant as long as the servant helps his brother.\' (Muslim). UAE service = ta\'awun in action.", ar: "المائدة ٢: ﴿وتعاونوا على البرّ والتقوى﴾. قال النبيّ: «الله في عون العبد ما كان العبد في عون أخيه.» (مسلم). خدمة الإمارات = تعاون عملي." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "UAE leads in humanitarian aid per capita.", ar: "الإمارات تقود في المساعدات للفرد." }, answer: true },
        { statement: { en: "UAE only cares about luxury.", ar: "الإمارات تهتمّ بالرفاهية فقط." }, answer: false },
        { statement: { en: "Sheikh Zayed built schools worldwide.", ar: "الشيخ زايد بنى مدارس في العالم." }, answer: true },
        { statement: { en: "Emirates Red Crescent works in 5 countries only.", ar: "الهلال الأحمر يعمل في ٥ دول فقط." }, answer: false },
        { statement: { en: "Cooperation in righteousness is from Al-Ma\'idah.", ar: "التعاون على البرّ من المائدة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Money is worthless if not for the _______ of people.\'", ar: "«المال بلا قيمة إن لم يكن ل_______ الناس.»" }, answer: { en: "benefit", ar: "خدمة" } },
        { sentence: { en: "UAE is #1 in _______ aid per capita.", ar: "الإمارات #١ في المساعدات _______ للفرد." }, answer: { en: "humanitarian", ar: "الإنسانيّة" } },
        { sentence: { en: "\'Cooperate in _______ and piety.\'", ar: "﴿وتعاونوا على _______ والتقوى﴾" }, answer: { en: "righteousness", ar: "البرّ" } },
        { sentence: { en: "Red Crescent works in _______+ countries.", ar: "الهلال الأحمر في _______+ دولة." }, answer: { en: "150", ar: "١٥٠" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "UAE leads globally in humanitarian aid — inspired by Sheikh Zayed\'s vision and Islamic values of service.",
        ar: "الإمارات تقود العالم في المساعدات الإنسانيّة — مستلهمة من رؤية الشيخ زايد وقيم الخدمة الإسلاميّة.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore UAE global service from different perspectives.", ar: "استكشف خدمة الإمارات العالميّة من منظورات مختلفة." },
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
            title: { en: "Zayed\'s Legacy", ar: "إرث زايد" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "Vision of giving", ar: "رؤية العطاء" },
            infoSections: [
              { label: { en: "Quote", ar: "اقتباس" }, content: { en: "\'Money is worthless if not used for the benefit of the people.\'", ar: "«المال بلا قيمة إن لم يُنفق لخدمة الناس.»" } },
              { label: { en: "Legacy", ar: "إرث" }, content: { en: "Hospitals, schools, mosques worldwide. Zayed Charitable Foundation.", ar: "مستشفيات ومدارس ومساجد في العالم. مؤسّسة زايد الخيريّة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "True leadership is service to humanity.", ar: "القيادة الحقيقيّة خدمة للبشريّة." } },
            ],
            task: {
              title: { en: "Research Zayed\'s Projects", ar: "ابحث عن مشاريع زايد" },
              description: { en: "List 5 of Zayed\'s global projects.", ar: "اذكر ٥ من مشاريع زايد العالميّة." },
              hint: { en: "Include: project, country, impact, Islamic value.", ar: "ضمّن: المشروع والدولة والأثر والقيمة الإسلاميّة." },
            },
          },
          {
            id: "B",
            title: { en: "Emirates Red Crescent", ar: "الهلال الأحمر" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "150+ countries", ar: "١٥٠+ دولة" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Present in 150+ countries. Disaster relief, education, health, poverty alleviation.", ar: "موجود في ١٥٠+ دولة. إغاثة كوارث وتعليم وصحّة وتخفيف فقر." } },
              { label: { en: "Islamic Root", ar: "جذر إسلامي" }, content: { en: "\'Whoever saves a life, it is as if he saved all of humanity.\' (Al-Ma\'idah 32)", ar: "﴿من أحياها فكأنّما أحيا الناس جميعًا﴾ (المائدة ٣٢)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Saving lives is the highest form of service.", ar: "إنقاذ الأرواح أعلى أشكال الخدمة." } },
            ],
            task: {
              title: { en: "Map Red Crescent Work", ar: "ارسم خريطة عمل الهلال" },
              description: { en: "Create a map of Red Crescent projects worldwide.", ar: "أنشئ خريطة لمشاريع الهلال الأحمر." },
              hint: { en: "Include: region, project type, people helped.", ar: "ضمّن: المنطقة ونوع المشروع والمستفيدين." },
            },
          },
          {
            id: "C",
            title: { en: "Dubai Cares", ar: "دبي العطاء" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "Education for all", ar: "التعليم للجميع" },
            infoSections: [
              { label: { en: "Mission", ar: "رسالة" }, content: { en: "Educating millions of children in developing countries.", ar: "تعليم ملايين الأطفال في الدول النامية." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Seeking knowledge is an obligation upon every Muslim.\' (Ibn Majah)", ar: "«طلب العلم فريضة على كلّ مسلم.» (ابن ماجه)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Education breaks cycles of poverty.", ar: "التعليم يكسر دوائر الفقر." } },
            ],
            task: {
              title: { en: "Design Education Campaign", ar: "صمّم حملة تعليم" },
              description: { en: "Create a campaign to support education globally.", ar: "أنشئ حملة لدعم التعليم عالميًّا." },
              hint: { en: "Include: goal, plan, Islamic motivation, impact.", ar: "ضمّن: الهدف والخطّة والدافع الإسلامي والأثر." },
            },
          },
          {
            id: "D",
            title: { en: "Islamic Service Values", ar: "قيم الخدمة الإسلاميّة" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Quran and Hadith", ar: "القرآن والحديث" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Ma\'idah 2: Cooperate in righteousness and piety.", ar: "المائدة ٢: ﴿وتعاونوا على البرّ والتقوى﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Allah helps the servant as long as the servant helps his brother.\' (Muslim)", ar: "«الله في عون العبد ما كان العبد في عون أخيه.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Service to humanity = service to Allah.", ar: "خدمة البشريّة = خدمة الله." } },
            ],
            task: {
              title: { en: "Connect Quran to Service", ar: "اربط القرآن بالخدمة" },
              description: { en: "Write how Quran motivates humanitarian work.", ar: "اكتب كيف يحفّز القرآن العمل الإنساني." },
              hint: { en: "Include: 5 verses, explanation, UAE examples.", ar: "ضمّن: ٥ آيات وشرح وأمثلة إماراتيّة." },
            },
          },
          {
            id: "E",
            title: { en: "My Service Plan", ar: "خطّة خدمتي" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Personal contribution", ar: "مساهمة شخصيّة" },
            infoSections: [
              { label: { en: "Goal", ar: "هدف" }, content: { en: "Every student can contribute to UAE\'s service vision.", ar: "كلّ طالب يستطيع المساهمة في رؤية خدمة الإمارات." } },
              { label: { en: "Ideas", ar: "أفكار" }, content: { en: "School projects, community clean-ups, charity drives, tutoring.", ar: "مشاريع مدرسيّة وتنظيف مجتمعي وحملات خير وتدريس." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Small actions create big change.", ar: "الأعمال الصغيرة تصنع تغييرًا كبيرًا." } },
            ],
            task: {
              title: { en: "Write Your Contribution Plan", ar: "اكتب خطّة مساهمتك" },
              description: { en: "Create a plan for your personal service project.", ar: "أنشئ خطّة لمشروع خدمتك الشخصي." },
              hint: { en: "Include: what, who, how, Islamic motivation.", ar: "ضمّن: ماذا ومن وكيف والدافع الإسلامي." },
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
            question: { en: "UAE #1 in?", ar: "الإمارات #١ في؟" },
            options: [
            { en: "Humanitarian aid per capita", ar: "المساعدات للفرد" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Pollution", ar: "التلوّث" },
            { en: "War", ar: "الحرب" },
            ],
            correctIndex: 0,
            explanation: { en: "Humanitarian aid.", ar: "المساعدات الإنسانيّة." },
          },
          {
            question: { en: "Zayed said money is for?", ar: "زايد قال المال ل؟" },
            options: [
            { en: "People\'s benefit", ar: "خدمة الناس" },
            { en: "Himself", ar: "نفسه" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Waste", ar: "الإسراف" },
            ],
            correctIndex: 0,
            explanation: { en: "People\'s benefit.", ar: "خدمة الناس." },
          },
          {
            question: { en: "Red Crescent in how many countries?", ar: "الهلال في كم دولة؟" },
            options: [
            { en: "150+", ar: "١٥٠+" },
            { en: "5", ar: "٥" },
            { en: "1", ar: "١" },
            { en: "0", ar: "٠" },
            ],
            correctIndex: 0,
            explanation: { en: "150+.", ar: "١٥٠+." },
          },
          {
            question: { en: "Cooperate in?", ar: "تعاونوا على؟" },
            options: [
            { en: "Righteousness", ar: "البرّ" },
            { en: "Sin", ar: "الإثم" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Harm", ar: "الضرر" },
            ],
            correctIndex: 0,
            explanation: { en: "Righteousness and piety.", ar: "البرّ والتقوى." },
          },
          {
            question: { en: "Dubai Cares focuses on?", ar: "دبي العطاء تركّز على؟" },
            options: [
            { en: "Education", ar: "التعليم" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "War", ar: "الحرب" },
            { en: "Luxury", ar: "الرفاهية" },
            ],
            correctIndex: 0,
            explanation: { en: "Education.", ar: "التعليم." },
          },
          {
            question: { en: "Saving a life equals?", ar: "إنقاذ نفس يساوي؟" },
            options: [
            { en: "Saving all humanity", ar: "إنقاذ الناس جميعًا" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "One person", ar: "شخص واحد" },
            { en: "Harm", ar: "ضرر" },
            ],
            correctIndex: 0,
            explanation: { en: "Saving all of humanity.", ar: "إنقاذ الناس جميعًا." },
          },
          {
            question: { en: "Service is?", ar: "الخدمة؟" },
            options: [
            { en: "Worship", ar: "عبادة" },
            { en: "Waste", ar: "إسراف" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Boring", ar: "ممل" },
            ],
            correctIndex: 0,
            explanation: { en: "Worship.", ar: "عبادة." },
          },
          {
            question: { en: "Allah helps who?", ar: "الله يعين من؟" },
            options: [
            { en: "Helps his brother", ar: "يعين أخاه" },
            { en: "Sleeps", ar: "ينام" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Is lazy", ar: "كسول" },
            ],
            correctIndex: 0,
            explanation: { en: "Helps his brother.", ar: "يعين أخاه." },
          },
          {
            question: { en: "UAE aid since founding?", ar: "مساعدات الإمارات منذ التأسيس؟" },
            options: [
            { en: "50B+ dollars", ar: "٥٠+ مليار دولار" },
            { en: "0", ar: "٠" },
            { en: "100", ar: "١٠٠" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Over 50 billion dollars.", ar: "أكثر من ٥٠ مليار دولار." },
          },
          {
            question: { en: "Seeking knowledge is?", ar: "طلب العلم؟" },
            options: [
            { en: "Obligation", ar: "فريضة" },
            { en: "Optional", ar: "اختياري" },
            { en: "Haram", ar: "حرام" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "An obligation upon every Muslim.", ar: "فريضة على كلّ مسلم." },
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
        title: { en: "UAE Service to the World", ar: "الإمارات خدمة العالم" },
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
        code: "UAESW001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — The UAE in Service of the World", ar: "ورقة عمل — الإمارات في خدمة العالم" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — The UAE in Service of the World", ar: "ورقة عمل — الإمارات في خدمة العالم" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "UAE #1?", ar: "الإمارات #١؟" },
                options: [
                { en: "Aid per capita", ar: "المساعدات للفرد" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "War", ar: "الحرب" },
                { en: "Pollution", ar: "التلوّث" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Zayed\'s vision?", ar: "رؤية زايد؟" },
                options: [
                { en: "Serve people", ar: "خدمة الناس" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Self", ar: "نفسه" },
                { en: "War", ar: "الحرب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Red Crescent?", ar: "الهلال الأحمر؟" },
                options: [
                { en: "150+ countries", ar: "١٥٠+ دولة" },
                { en: "1", ar: "١" },
                { en: "0", ar: "٠" },
                { en: "5", ar: "٥" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Cooperate in?", ar: "تعاونوا في؟" },
                options: [
                { en: "Righteousness", ar: "البرّ" },
                { en: "Sin", ar: "الإثم" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Harm", ar: "ضرر" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Service is?", ar: "الخدمة؟" },
                options: [
                { en: "Worship", ar: "عبادة" },
                { en: "Waste", ar: "إسراف" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Boring", ar: "ممل" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "UAE leads in aid.", ar: "الإمارات تقود في المساعدات." }, answer: true },
              { statement: { en: "UAE only cares about luxury.", ar: "الإمارات تهتمّ بالرفاهية فقط." }, answer: false },
              { statement: { en: "Zayed built worldwide.", ar: "زايد بنى في العالم." }, answer: true },
              { statement: { en: "Red Crescent in 5 countries.", ar: "الهلال في ٥ دول." }, answer: false },
              { statement: { en: "Service is worship.", ar: "الخدمة عبادة." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Khidmah", ar: "خدمة" }, answer: { en: "Service", ar: "الخدمة" } },
              { prompt: { en: "Ta\'awun", ar: "تعاون" }, answer: { en: "Cooperation", ar: "التعاون" } },
              { prompt: { en: "Ihsan", ar: "إحسان" }, answer: { en: "Excellence", ar: "الإحسان" } },
              { prompt: { en: "Ummah", ar: "أمّة" }, answer: { en: "Community", ar: "الأمّة" } },
              { prompt: { en: "Birr", ar: "برّ" }, answer: { en: "Righteousness", ar: "البرّ" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Money for the _______ of people.", ar: "المال ل_______ الناس." }, blankAnswer: { en: "benefit", ar: "خدمة" } },
              { sentence: { en: "UAE #1 in _______ aid.", ar: "الإمارات #١ في المساعدات _______." }, blankAnswer: { en: "humanitarian", ar: "الإنسانيّة" } },
              { sentence: { en: "Cooperate in _______ and piety.", ar: "تعاونوا على _______ والتقوى." }, blankAnswer: { en: "righteousness", ar: "البرّ" } },
              { sentence: { en: "Saving a life = saving _______.", ar: "إنقاذ نفس = إنقاذ _______." }, blankAnswer: { en: "all humanity", ar: "الناس جميعًا" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn Zayed\'s vision of giving", ar: "تعلّم رؤية زايد في العطاء" },
              { en: "Explore Red Crescent\'s global work", ar: "استكشف عمل الهلال العالمي" },
              { en: "Understand Dubai Cares mission", ar: "افهم رسالة دبي العطاء" },
              { en: "Connect service to Islamic values", ar: "اربط الخدمة بالقيم الإسلاميّة" },
              { en: "Plan your personal service project", ar: "خطّط مشروع خدمتك الشخصي" },
              { en: "Start making a difference today", ar: "ابدأ في إحداث فرق اليوم" },
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
