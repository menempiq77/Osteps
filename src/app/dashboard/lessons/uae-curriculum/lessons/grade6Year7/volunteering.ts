import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const volunteering: CourseLesson = {
  slug: "g6y7-volunteering-is-worship-and-belonging",
  name: { en: "Volunteering Is Worship and Belonging", ar: "التطوع عبادة وانتماء" },
  shortIntro: {
    en: "Volunteering combines worship of Allah with service to society. We study its evidences, rewards, and its place in UAE values.",
    ar: "التطوع يجمع عبادة الله وخدمة المجتمع. ندرس أدلته وثوابه ومكانته في قيم الإمارات.",
  },
  quranSurahs: ["Al-Ma'idah 2", "Al-Baqarah 195"],
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
        title: { en: "Is volunteering a waste of time?", ar: "هل التطوّع مضيعة للوقت؟" },
        body: {
          en: "A student says: \'Why should I volunteer? I don\'t get paid. My time is more valuable doing my own things. Helping others is the government\'s job, not mine.\'",
          ar: "طالب يقول: «لماذا أتطوّع؟ لا أُدفع لي. وقتي أثمن في أشيائي. مساعدة الآخرين وظيفة الحكومة لا وظيفتي.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on the value of volunteering.",
          ar: "انتقد بالقرآن والحديث عن قيمة التطوّع.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'And do good — indeed, Allah loves the doers of good.\' (Al-Baqara 195)",
        ar: "﴿وأحسنوا إنّ الله يحبّ المحسنين﴾ (البقرة ١٩٥)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Tatawwu (Volunteering)", ar: "تطوّع" } },
          { image: IMG.childQuran, keyword: { en: "Ihsan (Excellence)", ar: "إحسان" } },
          { image: IMG.lantern, keyword: { en: "Sadaqah (Charity)", ar: "صدقة" } },
          { image: IMG.skyBlue, keyword: { en: "Ta\'awun (Cooperation)", ar: "تعاون" } },
          { image: IMG.bookshelf, keyword: { en: "Khidmah (Service)", ar: "خدمة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'The best of people are those most beneficial to others.\' (Tabarani)",
        ar: "«خير الناس أنفعهم للناس.» (الطبراني)",
      },
    },
    {
      title: { en: "Volunteering Is Worship and Belonging", ar: "التطوع عبادة وانتماء" },
      learningObjectives: [
        { en: "Explain the Islamic value of volunteering and community service.", ar: "أشرح القيمة الإسلاميّة للتطوّع وخدمة المجتمع." },
        { en: "Identify UAE volunteering initiatives and their Islamic roots.", ar: "أحدّد مبادرات التطوّع الإماراتيّة وجذورها الإسلاميّة." },
      ],
      successCriteria: [
        { en: "I can explain why volunteering is worship.", ar: "أشرح لماذا التطوّع عبادة." },
        { en: "I can list 5 types of volunteering.", ar: "أذكر ٥ أنواع تطوّع." },
        { en: "I can connect UAE service culture to Islamic values.", ar: "أربط ثقافة الخدمة الإماراتيّة بالقيم الإسلاميّة." },
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
      title: { en: "Volunteering — Service to Community", ar: "التطوّع — خدمة المجتمع" },
      learningObjectives: [
        { en: "Understand volunteering as worship and community responsibility.", ar: "أفهم التطوّع كعبادة ومسؤوليّة مجتمعيّة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Volunteering in Islam", ar: "التطوّع في الإسلام" },
          lines: [
            { en: "Every good deed is sadaqah (Bukhari). Removing harm from the road is charity. Smiling is charity. Guiding someone lost is charity. Islam makes volunteering part of daily worship.", ar: "كلّ معروف صدقة (البخاري). إماطة الأذى عن الطريق صدقة. التبسّم صدقة. إرشاد الضالّ صدقة. الإسلام يجعل التطوّع جزءًا من العبادة اليوميّة." },
          ],
        },
        {
          label: { en: "Types of Volunteering", ar: "أنواع التطوّع" },
          lines: [
            { en: "1) Environmental (clean-ups, planting). 2) Educational (tutoring, mentoring). 3) Social (visiting sick, feeding hungry). 4) Humanitarian (disaster relief). 5) Religious (mosque maintenance, Quran teaching). 6) Community (neighbourhood projects).", ar: "١) بيئي (تنظيف وزراعة). ٢) تعليمي (تدريس وإرشاد). ٣) اجتماعي (زيارة مرضى وإطعام). ٤) إنساني (إغاثة كوارث). ٥) ديني (خدمة مسجد وتحفيظ). ٦) مجتمعي (مشاريع حيّ)." },
          ],
        },
        {
          label: { en: "UAE Volunteering Culture", ar: "ثقافة التطوّع الإماراتيّة" },
          lines: [
            { en: "UAE Year of Giving, Emirates Red Crescent, community service requirements in schools, Sheikh Zayed\'s legacy of giving. UAE leads in humanitarian aid per capita.", ar: "عام الخير والهلال الأحمر ومتطلّبات الخدمة المجتمعيّة وإرث الشيخ زايد. الإمارات تقود في المساعدات الإنسانيّة للفرد." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Every good deed is sadaqah.", ar: "كلّ معروف صدقة." }, answer: true },
        { statement: { en: "Volunteering is a waste of time.", ar: "التطوّع مضيعة للوقت." }, answer: false },
        { statement: { en: "Smiling is a form of charity.", ar: "التبسّم صدقة." }, answer: true },
        { statement: { en: "Only money counts as charity.", ar: "المال فقط يُعتبر صدقة." }, answer: false },
        { statement: { en: "UAE leads in humanitarian aid.", ar: "الإمارات تقود في المساعدات الإنسانيّة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'The best people are those most _______ to others.\'", ar: "«خير الناس _______ للناس.»" }, answer: { en: "beneficial", ar: "أنفعهم" } },
        { sentence: { en: "Every good deed is _______.", ar: "كلّ معروف _______." }, answer: { en: "charity", ar: "صدقة" } },
        { sentence: { en: "Removing _______ from the road is charity.", ar: "إماطة _______ عن الطريق صدقة." }, answer: { en: "harm", ar: "الأذى" } },
        { sentence: { en: "\'Do good — Allah loves the _______ of good.\'", ar: "﴿أحسنوا إنّ الله يحبّ _______.﴾" }, answer: { en: "doers", ar: "المحسنين" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Volunteering is worship — every good deed is sadaqah. The best people benefit others the most.",
        ar: "التطوّع عبادة — كلّ معروف صدقة. خير الناس أنفعهم للناس.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore volunteering from different Islamic perspectives.", ar: "استكشف التطوّع من منظورات إسلاميّة مختلفة." },
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
            title: { en: "Volunteering as Worship", ar: "التطوّع كعبادة" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "Sadaqah in action", ar: "الصدقة عملًا" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Every good deed is sadaqah.\' (Bukhari)", ar: "«كلّ معروف صدقة.» (البخاري)" } },
              { label: { en: "Examples", ar: "أمثلة" }, content: { en: "Smile, remove harm, guide lost, share food, teach.", ar: "ابتسم وأزل الأذى وأرشد الضالّ وشارك الطعام وعلّم." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Worship is not just prayer — it is serving others.", ar: "العبادة ليست صلاة فقط — إنّها خدمة الآخرين." } },
            ],
            task: {
              title: { en: "List 10 Daily Sadaqah Acts", ar: "اذكر ١٠ صدقات يوميّة" },
              description: { en: "Write 10 acts of sadaqah you can do every day.", ar: "اكتب ١٠ صدقات تفعلها يوميًّا." },
              hint: { en: "Include: the act, the hadith evidence, the impact.", ar: "ضمّن: العمل والحديث والأثر." },
            },
          },
          {
            id: "B",
            title: { en: "Types of Volunteering", ar: "أنواع التطوّع" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "6 categories", ar: "٦ فئات" },
            infoSections: [
              { label: { en: "Categories", ar: "فئات" }, content: { en: "Environmental, educational, social, humanitarian, religious, community.", ar: "بيئي وتعليمي واجتماعي وإنساني وديني ومجتمعي." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Best people are most beneficial to others.\' (Tabarani)", ar: "«خير الناس أنفعهم للناس.» (الطبراني)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "There is a volunteering type for everyone.", ar: "هناك نوع تطوّع لكلّ شخص." } },
            ],
            task: {
              title: { en: "Explore Categories", ar: "استكشف الفئات" },
              description: { en: "Describe each volunteering category with Islamic evidence.", ar: "صف كلّ فئة تطوّع بدليل إسلامي." },
              hint: { en: "Include: category, example, evidence, personal plan.", ar: "ضمّن: الفئة والمثال والدليل والخطّة." },
            },
          },
          {
            id: "C",
            title: { en: "UAE Service Culture", ar: "ثقافة الخدمة الإماراتيّة" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "A nation of giving", ar: "أمّة العطاء" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "UAE Year of Giving, Emirates Red Crescent, school community service — UAE leads in humanitarian aid per capita.", ar: "عام الخير والهلال الأحمر وخدمة المجتمع المدرسيّة — الإمارات تقود عالميًّا." } },
              { label: { en: "Zayed", ar: "زايد" }, content: { en: "Sheikh Zayed: \'Money is worthless if not used for the benefit of the people.\'", ar: "الشيخ زايد: «المال بلا قيمة إن لم يُنفق لخدمة الناس.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "UAE values align perfectly with Islamic service principles.", ar: "قيم الإمارات تتوافق تمامًا مع مبادئ الخدمة الإسلاميّة." } },
            ],
            task: {
              title: { en: "Research UAE Projects", ar: "ابحث عن مشاريع الإمارات" },
              description: { en: "Research 3 UAE volunteering projects.", ar: "ابحث عن ٣ مشاريع تطوّع إماراتيّة." },
              hint: { en: "Include: project, goal, impact, Islamic connection.", ar: "ضمّن: المشروع والهدف والأثر والصلة الإسلاميّة." },
            },
          },
          {
            id: "D",
            title: { en: "Helping Others", ar: "مساعدة الآخرين" },
            image: IMG.skyBlue,
            color: "amber",
            topic: { en: "Practical kindness", ar: "لطف عملي" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Whoever relieves a believer\'s hardship, Allah relieves his on the Day of Judgement.\' (Muslim)", ar: "«من نفّس عن مؤمن كربة نفّس الله عنه كربة يوم القيامة.» (مسلم)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Allah helps the servant as long as the servant helps his brother.\' (Muslim)", ar: "«الله في عون العبد ما كان العبد في عون أخيه.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Helping others is helping yourself — with Allah.", ar: "مساعدة الآخرين مساعدة لنفسك — مع الله." } },
            ],
            task: {
              title: { en: "Plan a Help Project", ar: "خطّط مشروع مساعدة" },
              description: { en: "Design a project to help people in your community.", ar: "صمّم مشروعًا لمساعدة الناس في مجتمعك." },
              hint: { en: "Include: who, what, how, when, Islamic motivation.", ar: "ضمّن: من وماذا وكيف ومتى والدافع الإسلامي." },
            },
          },
          {
            id: "E",
            title: { en: "My Volunteering Plan", ar: "خطّة تطوّعي" },
            image: IMG.bookshelf,
            color: "rose",
            topic: { en: "Personal commitment", ar: "التزام شخصي" },
            infoSections: [
              { label: { en: "Action", ar: "عمل" }, content: { en: "Start small — weekly volunteering, then grow.", ar: "ابدأ صغيرًا — تطوّع أسبوعي ثمّ تنمو." } },
              { label: { en: "Goal", ar: "هدف" }, content: { en: "100 hours of service per year.", ar: "١٠٠ ساعة خدمة في السنة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Consistency in service is the key.", ar: "الاستمراريّة في الخدمة هي المفتاح." } },
            ],
            task: {
              title: { en: "Write Your Plan", ar: "اكتب خطّتك" },
              description: { en: "Create a personal volunteering plan.", ar: "أنشئ خطّة تطوّع شخصيّة." },
              hint: { en: "Include: type, hours, weekly schedule, Islamic goals.", ar: "ضمّن: النوع والساعات والجدول الأسبوعي والأهداف." },
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
            question: { en: "Best people are?", ar: "خير الناس؟" },
            options: [
            { en: "Most beneficial", ar: "أنفعهم" },
            { en: "Richest", ar: "أغناهم" },
            { en: "Strongest", ar: "أقواهم" },
            { en: "Tallest", ar: "أطولهم" },
            ],
            correctIndex: 0,
            explanation: { en: "Most beneficial to others.", ar: "أنفعهم للناس." },
          },
          {
            question: { en: "Every good deed is?", ar: "كلّ معروف؟" },
            options: [
            { en: "Sadaqah", ar: "صدقة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Waste", ar: "إسراف" },
            { en: "Optional", ar: "اختياري" },
            ],
            correctIndex: 0,
            explanation: { en: "Sadaqah.", ar: "صدقة." },
          },
          {
            question: { en: "Smiling is?", ar: "التبسّم؟" },
            options: [
            { en: "Charity", ar: "صدقة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Waste", ar: "إسراف" },
            { en: "Strange", ar: "غريب" },
            ],
            correctIndex: 0,
            explanation: { en: "Charity.", ar: "صدقة." },
          },
          {
            question: { en: "UAE leads in?", ar: "الإمارات تقود في؟" },
            options: [
            { en: "Humanitarian aid", ar: "المساعدات" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "War", ar: "الحرب" },
            { en: "Pollution", ar: "التلوّث" },
            ],
            correctIndex: 0,
            explanation: { en: "Humanitarian aid per capita.", ar: "المساعدات الإنسانيّة." },
          },
          {
            question: { en: "\'Do good\' is from?", ar: "﴿أحسنوا﴾ من؟" },
            options: [
            { en: "Al-Baqara 195", ar: "البقرة ١٩٥" },
            { en: "Al-Fatiha", ar: "الفاتحة" },
            { en: "Al-Nas", ar: "الناس" },
            { en: "Al-Falaq", ar: "الفلق" },
            ],
            correctIndex: 0,
            explanation: { en: "Al-Baqara 195.", ar: "البقرة ١٩٥." },
          },
          {
            question: { en: "Volunteering is?", ar: "التطوّع؟" },
            options: [
            { en: "Worship", ar: "عبادة" },
            { en: "Waste", ar: "إسراف" },
            { en: "Boring", ar: "ممل" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Worship.", ar: "عبادة." },
          },
          {
            question: { en: "Relieving hardship earns?", ar: "تنفيس الكربة يكسب؟" },
            options: [
            { en: "Relief on Judgement Day", ar: "فرجًا يوم القيامة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Punishment", ar: "عقاب" },
            { en: "Debt", ar: "دين" },
            ],
            correctIndex: 0,
            explanation: { en: "Relief on Judgement Day.", ar: "فرجًا يوم القيامة." },
          },
          {
            question: { en: "Removing harm from road is?", ar: "إماطة الأذى عن الطريق؟" },
            options: [
            { en: "Charity", ar: "صدقة" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Strange", ar: "غريب" },
            { en: "Wrong", ar: "خطأ" },
            ],
            correctIndex: 0,
            explanation: { en: "Charity.", ar: "صدقة." },
          },
          {
            question: { en: "Sheikh Zayed said money is?", ar: "الشيخ زايد قال المال؟" },
            options: [
            { en: "For people\'s benefit", ar: "لخدمة الناس" },
            { en: "For himself", ar: "لنفسه" },
            { en: "Worthless always", ar: "بلا قيمة دائمًا" },
            { en: "Not important", ar: "غير مهمّ" },
            ],
            correctIndex: 0,
            explanation: { en: "For the benefit of people.", ar: "لخدمة الناس." },
          },
          {
            question: { en: "Allah helps who?", ar: "الله يعين من؟" },
            options: [
            { en: "Helps his brother", ar: "يعين أخاه" },
            { en: "Sleeps", ar: "ينام" },
            { en: "Does nothing", ar: "لا يفعل شيئًا" },
            { en: "Is lazy", ar: "كسول" },
            ],
            correctIndex: 0,
            explanation: { en: "Helps his brother.", ar: "يعين أخاه." },
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
        title: { en: "Volunteering", ar: "التطوّع" },
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
        code: "VOLNT001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Volunteering Is Worship and Belonging", ar: "ورقة عمل — التطوع عبادة وانتماء" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Volunteering Is Worship and Belonging", ar: "ورقة عمل — التطوع عبادة وانتماء" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Best people?", ar: "خير الناس؟" },
                options: [
                { en: "Beneficial", ar: "أنفعهم" },
                { en: "Rich", ar: "أغناهم" },
                { en: "Strong", ar: "أقواهم" },
                { en: "Tall", ar: "أطولهم" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Good deed?", ar: "المعروف؟" },
                options: [
                { en: "Sadaqah", ar: "صدقة" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Waste", ar: "إسراف" },
                { en: "Loss", ar: "خسارة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Smiling?", ar: "التبسّم؟" },
                options: [
                { en: "Charity", ar: "صدقة" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Waste", ar: "إسراف" },
                { en: "Wrong", ar: "خطأ" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Volunteering?", ar: "التطوّع؟" },
                options: [
                { en: "Worship", ar: "عبادة" },
                { en: "Waste", ar: "إسراف" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Boring", ar: "ممل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Relief earns?", ar: "تنفيس الكربة؟" },
                options: [
                { en: "Relief on QD", ar: "فرج يوم القيامة" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Debt", ar: "دين" },
                { en: "Loss", ar: "خسارة" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Every good deed is charity.", ar: "كلّ معروف صدقة." }, answer: true },
              { statement: { en: "Volunteering is a waste.", ar: "التطوّع مضيعة." }, answer: false },
              { statement: { en: "Smiling is sadaqah.", ar: "التبسّم صدقة." }, answer: true },
              { statement: { en: "Only money is charity.", ar: "المال فقط صدقة." }, answer: false },
              { statement: { en: "UAE leads in aid.", ar: "الإمارات تقود في المساعدات." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Tatawwu", ar: "تطوّع" }, answer: { en: "Volunteering", ar: "التطوّع" } },
              { prompt: { en: "Sadaqah", ar: "صدقة" }, answer: { en: "Charity", ar: "الصدقة" } },
              { prompt: { en: "Ihsan", ar: "إحسان" }, answer: { en: "Excellence", ar: "الإحسان" } },
              { prompt: { en: "Ta\'awun", ar: "تعاون" }, answer: { en: "Cooperation", ar: "التعاون" } },
              { prompt: { en: "Khidmah", ar: "خدمة" }, answer: { en: "Service", ar: "الخدمة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Best people are most _______ to others.", ar: "خير الناس _______ للناس." }, blankAnswer: { en: "beneficial", ar: "أنفعهم" } },
              { sentence: { en: "Every good deed is _______.", ar: "كلّ معروف _______." }, blankAnswer: { en: "charity", ar: "صدقة" } },
              { sentence: { en: "Removing _______ from road is charity.", ar: "إماطة _______ عن الطريق صدقة." }, blankAnswer: { en: "harm", ar: "الأذى" } },
              { sentence: { en: "\'Do good — Allah loves _______.", ar: "﴿أحسنوا إنّ الله يحبّ _______.﴾" }, blankAnswer: { en: "the doers of good", ar: "المحسنين" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn volunteering is worship", ar: "تعلّم أنّ التطوّع عبادة" },
              { en: "Identify types of volunteering", ar: "حدّد أنواع التطوّع" },
              { en: "Explore UAE service culture", ar: "استكشف ثقافة الخدمة الإماراتيّة" },
              { en: "Plan a help project", ar: "خطّط مشروع مساعدة" },
              { en: "Start weekly volunteering", ar: "ابدأ تطوّعًا أسبوعيًّا" },
              { en: "Build a consistent service habit", ar: "ابنِ عادة خدمة مستمرّة" },
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
