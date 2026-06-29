import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const environmentTrust: CourseLesson = {
  slug: "g6y7-my-environment-is-a-trust",
  name: { en: "My Environment Is a Trust", ar: "بيئَتي أمانة" },
  shortIntro: {
    en: "The earth is an amanah (trust) Allah placed in our care. A deep study of the Muslim\'s duty to protect the environment — as a khalifah (steward), avoiding waste and corruption, and earning reward through every act of conservation, as taught in the Qur\'an and Sunnah.",
    ar: "الأرضُ أمانةٌ ائتَمَنَنا اللهُ علَيها. دِراسةٌ عَميقةٌ لِواجِبِ المُسلِمِ في حِفظِ البيئة — خَليفةً في الأرض، يَتَجَنَّبُ الإسرافَ والفَساد، ويَنالُ الأجرَ بِكُلِّ عَمَلٍ لِحِفظِها، كَما عَلَّمَ القُرآنُ والسُّنّة.",
  },
  quranSurahs: ["Al-A'raf 56", "Ar-Rum 41", "Al-A'raf 31"],
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
        title: { en: "Is the environment our responsibility?", ar: "هل البيئة مسؤوليّتنا؟" },
        body: {
          en: "A student says: \'The environment is not my problem. I can throw rubbish anywhere, waste water, and pollute. Humans are more important than trees. Nature will fix itself.\'",
          ar: "طالب يقول: «البيئة ليست مشكلتي. أرمي القمامة وأبذّر الماء وألوّث. الإنسان أهمّ من الأشجار. الطبيعة ستصلح نفسها.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on stewardship of the earth.",
          ar: "انتقد بالقرآن والحديث عن رعاية الأرض.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Do not cause corruption on the earth after it has been set in order.\' (Al-A\'raf 56)",
        ar: "﴿ولا تفسدوا في الأرض بعد إصلاحها﴾ (الأعراف ٥٦)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.waterfall, keyword: { en: "Bi\'ah (Environment)", ar: "بيئة" } },
          { image: IMG.mountainSnow, keyword: { en: "Amanah (Trust)", ar: "أمانة" } },
          { image: IMG.skyBlue, keyword: { en: "Khalifah (Steward)", ar: "خليفة" } },
          { image: IMG.childQuran, keyword: { en: "Mizan (Balance)", ar: "ميزان" } },
          { image: IMG.grandMosque, keyword: { en: "Ni\'mah (Blessing)", ar: "نعمة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'He is the One who made you successors (stewards) on the earth.\' (Al-An\'am 165)",
        ar: "﴿هو الذي جعلكم خلائف الأرض﴾ (الأنعام ١٦٥)",
      },
    },
    {
      title: { en: "My Environment Is a Trust", ar: "بيئَتي أمانة" },
      learningObjectives: [
        { en: "Explain the Islamic concept of environmental stewardship.", ar: "أشرح مفهوم رعاية البيئة في الإسلام." },
        { en: "Identify Quran and Hadith on protecting the environment.", ar: "أحدّد آيات وأحاديث عن حماية البيئة." },
      ],
      successCriteria: [
        { en: "I can define khalifah (stewardship).", ar: "أعرّف الخلافة (الرعاية)." },
        { en: "I can list 5 Islamic environmental principles.", ar: "أذكر ٥ مبادئ بيئيّة إسلاميّة." },
        { en: "I can connect UAE green initiatives to Islamic values.", ar: "أربط مبادرات الإمارات الخضراء بالقيم الإسلاميّة." },
      ],
      image: {
        src: IMG.waterfall,
        alt: { en: "Topic image.", ar: "صورة الموضوع." },
      },
      readyButton: {
        label: { en: "I\'m ready to learn!", ar: "أنا مستعدّ للتعلّم!" },
        coinsReward: 5,
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "The Environment as a Trust (Amanah)", ar: "البيئة أمانة" },
      learningObjectives: [
        { en: "Understand that protecting the environment is an Islamic obligation.", ar: "أفهم أنّ حماية البيئة واجب إسلامي." },
      ],
      image: {
        src: IMG.waterfall,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Khilafah — Stewardship", ar: "الخلافة — الرعاية" },
          lines: [
            { en: "Humans are khalifah (stewards) on earth — responsible for its care. We will be asked about how we treated creation. Al-Baqara 30: \'I will make upon the earth a khalifah.\'", ar: "البشر خلفاء في الأرض — مسؤولون عن رعايتها. سنُسأل عن معاملتنا للخلق. البقرة ٣٠: ﴿إنّي جاعل في الأرض خليفة﴾" },
          ],
        },
        {
          label: { en: "Islamic Environmental Principles", ar: "المبادئ البيئيّة الإسلاميّة" },
          lines: [
            { en: "No corruption: Al-A\'raf 56. No waste: Al-A\'raf 31 \'eat and drink but do not waste.\' Balance: Ar-Rahman 7-9 \'He raised the heaven and established the balance.\' Kindness to animals: \'A woman entered Hell for a cat she imprisoned.\' (Bukhari)", ar: "لا إفساد: الأعراف ٥٦. لا إسراف: الأعراف ٣١ ﴿كلوا واشربوا ولا تسرفوا﴾. التوازن: الرحمن ٧-٩ ﴿والسماء رفعها ووضع الميزان﴾. الرفق بالحيوان: «دخلت النار امرأة في هرّة حبستها.» (البخاري)" },
          ],
        },
        {
          label: { en: "UAE Green Initiatives", ar: "مبادرات الإمارات الخضراء" },
          lines: [
            { en: "UAE Green Agenda 2030, clean energy, sustainability, mangrove planting, wildlife protection — all aligned with Islamic stewardship values.", ar: "أجندة الإمارات الخضراء ٢٠٣٠ والطاقة النظيفة والاستدامة وزراعة الشوريّات وحماية الحياة البرّيّة — كلّها تتوافق مع قيم الرعاية الإسلاميّة." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Humans are stewards of the earth.", ar: "البشر خلفاء في الأرض." }, answer: true },
        { statement: { en: "The environment is not our responsibility.", ar: "البيئة ليست مسؤوليّتنا." }, answer: false },
        { statement: { en: "Wasting water is forbidden.", ar: "إسراف الماء محرّم." }, answer: true },
        { statement: { en: "Nature can fix itself without care.", ar: "الطبيعة تصلح نفسها بلا رعاية." }, answer: false },
        { statement: { en: "A woman entered Hell for harming a cat.", ar: "دخلت النار امرأة لأذية هرّة." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Do not cause _______ on the earth.\'", ar: "﴿ولا _______ في الأرض﴾" }, answer: { en: "corruption", ar: "تفسدوا" } },
        { sentence: { en: "\'Eat and drink but do not _______.", ar: "﴿كلوا واشربوا ولا _______.﴾" }, answer: { en: "waste", ar: "تسرفوا" } },
        { sentence: { en: "Humans are _______ (stewards) on earth.", ar: "البشر _______ في الأرض." }, answer: { en: "khalifah", ar: "خلفاء" } },
        { sentence: { en: "Allah raised the heaven and set the _______.", ar: "الله رفع السماء ووضع _______." }, answer: { en: "balance", ar: "الميزان" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "The environment is an amanah — humans are stewards, not owners. Islam forbids waste, corruption, and harming creation.",
        ar: "البيئة أمانة — البشر خلفاء لا ملّاك. الإسلام يحرّم الإسراف والإفساد وأذية الخلق.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore environmental stewardship in Islam.", ar: "استكشف رعاية البيئة في الإسلام." },
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
            title: { en: "Stewardship (Khilafah)", ar: "الخلافة" },
            image: IMG.waterfall,
            color: "teal",
            topic: { en: "Our role on earth", ar: "دورنا في الأرض" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-Baqara 30: \'I will make on earth a khalifah.\'", ar: "البقرة ٣٠: ﴿إنّي جاعل في الأرض خليفة﴾" } },
              { label: { en: "Meaning", ar: "معنى" }, content: { en: "We are caretakers, not owners — accountable for the earth.", ar: "نحن رعاة لا ملّاك — مسؤولون عن الأرض." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Stewardship is a divine responsibility.", ar: "الرعاية مسؤوليّة إلهيّة." } },
            ],
            task: {
              title: { en: "Define Stewardship", ar: "عرّف الرعاية" },
              description: { en: "Explain what khalifah means for the environment.", ar: "اشرح ما تعني الخلافة للبيئة." },
              hint: { en: "Include: Quran, meaning, examples, personal actions.", ar: "ضمّن: القرآن والمعنى والأمثلة والأعمال." },
            },
          },
          {
            id: "B",
            title: { en: "No Waste (Israf)", ar: "لا إسراف" },
            image: IMG.skyBlue,
            color: "blue",
            topic: { en: "Water, food, energy", ar: "الماء والطعام والطاقة" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Al-A\'raf 31: \'Eat and drink but do not waste.\'", ar: "الأعراف ٣١: ﴿كلوا واشربوا ولا تسرفوا﴾" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Do not waste water even at a flowing river.\' (Ahmad)", ar: "«لا تسرف في الماء ولو كنت على نهر جارٍ.» (أحمد)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Moderation is worship.", ar: "الاعتدال عبادة." } },
            ],
            task: {
              title: { en: "Create a No-Waste Plan", ar: "أنشئ خطّة لا إسراف" },
              description: { en: "Write 5 ways to reduce waste at school.", ar: "اكتب ٥ طرق لتقليل الإسراف في المدرسة." },
              hint: { en: "Include: water, food, paper, energy, plastic.", ar: "ضمّن: الماء والطعام والورق والطاقة والبلاستيك." },
            },
          },
          {
            id: "C",
            title: { en: "Animal Rights", ar: "حقوق الحيوان" },
            image: IMG.mountainSnow,
            color: "purple",
            topic: { en: "Mercy to all creatures", ar: "الرحمة بكلّ المخلوقات" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'A man was forgiven for giving water to a thirsty dog.\' (Bukhari)", ar: "«غُفر لرجل سقى كلبًا عطشان.» (البخاري)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'A woman entered Hell for starving a cat.\' (Bukhari)", ar: "«دخلت النار امرأة في هرّة حبستها.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Animals have rights in Islam.", ar: "للحيوانات حقوق في الإسلام." } },
            ],
            task: {
              title: { en: "Research Animal Rights", ar: "ابحث عن حقوق الحيوان" },
              description: { en: "List 5 Islamic rules about treating animals.", ar: "اذكر ٥ قواعد إسلاميّة لمعاملة الحيوانات." },
              hint: { en: "Include: hadith evidence, the rule, modern application.", ar: "ضمّن: الحديث والقاعدة والتطبيق." },
            },
          },
          {
            id: "D",
            title: { en: "UAE Green Initiatives", ar: "مبادرات الإمارات" },
            image: IMG.grandMosque,
            color: "amber",
            topic: { en: "A model country", ar: "دولة نموذجيّة" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "UAE leads in clean energy (Masdar City, solar farms), mangrove planting, wildlife protection.", ar: "الإمارات تقود في الطاقة النظيفة (مدينة مصدر) وزراعة الشوريّات وحماية البرّيّة." } },
              { label: { en: "Values", ar: "قيم" }, content: { en: "These align with Islamic environmental stewardship.", ar: "هذه تتوافق مع الرعاية البيئيّة الإسلاميّة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Modern sustainability = Islamic values in action.", ar: "الاستدامة الحديثة = قيم إسلاميّة عمليّة." } },
            ],
            task: {
              title: { en: "Explore UAE Green Projects", ar: "استكشف مشاريع الإمارات" },
              description: { en: "Research 3 UAE environmental projects.", ar: "ابحث عن ٣ مشاريع بيئيّة إماراتيّة." },
              hint: { en: "Include: project name, goal, Islamic connection.", ar: "ضمّن: اسم المشروع والهدف والصلة الإسلاميّة." },
            },
          },
          {
            id: "E",
            title: { en: "My Green Actions", ar: "أعمالي الخضراء" },
            image: IMG.childQuran,
            color: "rose",
            topic: { en: "What can I do?", ar: "ماذا أفعل؟" },
            infoSections: [
              { label: { en: "Actions", ar: "أعمال" }, content: { en: "Plant a tree, save water, reduce waste, recycle, walk instead of drive.", ar: "ازرع شجرة ووفّر الماء وقلّل الإسراف وأعد التدوير وامشِ." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'If the Hour comes and you have a seedling, plant it.\' (Ahmad)", ar: "«إن قامت الساعة وبيد أحدكم فسيلة فليغرسها.» (أحمد)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every small action counts.", ar: "كلّ عمل صغير يُحسب." } },
            ],
            task: {
              title: { en: "Write Your Green Plan", ar: "اكتب خطّتك الخضراء" },
              description: { en: "Create a personal environmental action plan.", ar: "أنشئ خطّة عمل بيئيّة شخصيّة." },
              hint: { en: "Include: daily actions, weekly goals, Islamic motivation.", ar: "ضمّن: أعمال يوميّة وأهداف أسبوعيّة ودافع إسلامي." },
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
            question: { en: "Humans are on earth as?", ar: "البشر في الأرض ك؟" },
            options: [
            { en: "Stewards (khalifah)", ar: "خلفاء" },
            { en: "Owners", ar: "ملّاك" },
            { en: "Visitors", ar: "زوّار" },
            { en: "Destroyers", ar: "مدمّرين" },
            ],
            correctIndex: 0,
            explanation: { en: "Stewards.", ar: "خلفاء." },
          },
          {
            question: { en: "Al-A\'raf 56 says?", ar: "الأعراف ٥٦ تقول؟" },
            options: [
            { en: "Do not corrupt the earth", ar: "لا تفسدوا في الأرض" },
            { en: "Destroy freely", ar: "دمّروا بحرّيّة" },
            { en: "Ignore nature", ar: "تجاهلوا الطبيعة" },
            { en: "Waste water", ar: "أسرفوا الماء" },
            ],
            correctIndex: 0,
            explanation: { en: "Do not corrupt.", ar: "لا تفسدوا." },
          },
          {
            question: { en: "Wasting water is?", ar: "إسراف الماء؟" },
            options: [
            { en: "Forbidden", ar: "محرّم" },
            { en: "Encouraged", ar: "مشجّع" },
            { en: "Allowed", ar: "مباح" },
            { en: "Required", ar: "واجب" },
            ],
            correctIndex: 0,
            explanation: { en: "Forbidden — even at a flowing river.", ar: "محرّم — حتّى عند نهر جارٍ." },
          },
          {
            question: { en: "Woman entered Hell for?", ar: "دخلت النار لأجل؟" },
            options: [
            { en: "Starving a cat", ar: "حبس هرّة" },
            { en: "Prayer", ar: "الصلاة" },
            { en: "Charity", ar: "الصدقة" },
            { en: "Fasting", ar: "الصيام" },
            ],
            correctIndex: 0,
            explanation: { en: "Starving a cat.", ar: "حبس هرّة." },
          },
          {
            question: { en: "Man forgiven for?", ar: "غُفر لرجل ل؟" },
            options: [
            { en: "Giving water to a dog", ar: "سقى كلبًا" },
            { en: "Sleeping", ar: "النوم" },
            { en: "Eating", ar: "الأكل" },
            { en: "Running", ar: "الركض" },
            ],
            correctIndex: 0,
            explanation: { en: "Giving water to a thirsty dog.", ar: "سقى كلبًا عطشان." },
          },
          {
            question: { en: "\'Eat and drink but?\'", ar: "﴿كلوا واشربوا ولا؟﴾" },
            options: [
            { en: "Do not waste", ar: "تسرفوا" },
            { en: "Eat more", ar: "كلوا أكثر" },
            { en: "Drink more", ar: "اشربوا أكثر" },
            { en: "Do nothing", ar: "لا تفعلوا" },
            ],
            correctIndex: 0,
            explanation: { en: "Do not waste.", ar: "لا تسرفوا." },
          },
          {
            question: { en: "Balance (mizan) is in?", ar: "الميزان في؟" },
            options: [
            { en: "Ar-Rahman 7-9", ar: "الرحمن ٧-٩" },
            { en: "Al-Fatiha", ar: "الفاتحة" },
            { en: "An-Nas", ar: "الناس" },
            { en: "Al-Ikhlas", ar: "الإخلاص" },
            ],
            correctIndex: 0,
            explanation: { en: "Ar-Rahman 7-9.", ar: "الرحمن ٧-٩." },
          },
          {
            question: { en: "UAE Green Agenda?", ar: "أجندة الإمارات الخضراء؟" },
            options: [
            { en: "2030", ar: "٢٠٣٠" },
            { en: "2000", ar: "٢٠٠٠" },
            { en: "1990", ar: "١٩٩٠" },
            { en: "None", ar: "لا يوجد" },
            ],
            correctIndex: 0,
            explanation: { en: "UAE Green Agenda 2030.", ar: "أجندة ٢٠٣٠." },
          },
          {
            question: { en: "If Hour comes and you have seedling?", ar: "إن قامت الساعة وبيدك فسيلة؟" },
            options: [
            { en: "Plant it", ar: "ازرعها" },
            { en: "Drop it", ar: "ألقها" },
            { en: "Ignore it", ar: "تجاهلها" },
            { en: "Eat it", ar: "كلها" },
            ],
            correctIndex: 0,
            explanation: { en: "Plant it (Ahmad).", ar: "ازرعها (أحمد)." },
          },
          {
            question: { en: "Islamic view of animals?", ar: "نظرة الإسلام للحيوانات؟" },
            options: [
            { en: "Have rights and deserve mercy", ar: "لها حقوق وتستحقّ الرحمة" },
            { en: "No rights", ar: "بلا حقوق" },
            { en: "Only for food", ar: "للأكل فقط" },
            { en: "Not important", ar: "غير مهمّة" },
            ],
            correctIndex: 0,
            explanation: { en: "Have rights — mercy to all.", ar: "لها حقوق — رحمة بالجميع." },
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
        title: { en: "Environment as Trust", ar: "البيئة أمانة" },
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
        code: "ENVIR001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — My Environment Is a Trust", ar: "ورقة عمل — بيئَتي أمانة" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — My Environment Is a Trust", ar: "ورقة عمل — بيئَتي أمانة" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Humans on earth as?", ar: "البشر في الأرض ك؟" },
                options: [
                { en: "Stewards", ar: "خلفاء" },
                { en: "Owners", ar: "ملّاك" },
                { en: "Visitors", ar: "زوّار" },
                { en: "Kings", ar: "ملوك" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Wasting water?", ar: "إسراف الماء؟" },
                options: [
                { en: "Forbidden", ar: "محرّم" },
                { en: "Allowed", ar: "مباح" },
                { en: "Encouraged", ar: "مشجّع" },
                { en: "Required", ar: "واجب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Woman + cat?", ar: "المرأة والهرّة؟" },
                options: [
                { en: "Entered Hell", ar: "دخلت النار" },
                { en: "Entered Paradise", ar: "دخلت الجنّة" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Reward", ar: "ثواب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Man + dog?", ar: "الرجل والكلب؟" },
                options: [
                { en: "Forgiven", ar: "غُفر له" },
                { en: "Punished", ar: "عوقب" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Ignored", ar: "تُجوهل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Do not cause ___?", ar: "لا ___ في الأرض؟" },
                options: [
                { en: "Corruption", ar: "تفسدوا" },
                { en: "Goodness", ar: "تحسنوا" },
                { en: "Prayer", ar: "تصلّوا" },
                { en: "Charity", ar: "تتصدّقوا" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Humans are stewards.", ar: "البشر خلفاء." }, answer: true },
              { statement: { en: "Wasting is allowed.", ar: "الإسراف مباح." }, answer: false },
              { statement: { en: "Animals have rights.", ar: "للحيوانات حقوق." }, answer: true },
              { statement: { en: "Environment is not our concern.", ar: "البيئة ليست شأننا." }, answer: false },
              { statement: { en: "Planting trees is rewarded.", ar: "زراعة الأشجار مُثاب." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Bi\'ah", ar: "بيئة" }, answer: { en: "Environment", ar: "البيئة" } },
              { prompt: { en: "Khalifah", ar: "خليفة" }, answer: { en: "Steward", ar: "الوصيّ" } },
              { prompt: { en: "Israf", ar: "إسراف" }, answer: { en: "Waste", ar: "الإسراف" } },
              { prompt: { en: "Mizan", ar: "ميزان" }, answer: { en: "Balance", ar: "التوازن" } },
              { prompt: { en: "Amanah", ar: "أمانة" }, answer: { en: "Trust", ar: "الأمانة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Do not cause _______ on earth.\'", ar: "﴿ولا _______ في الأرض﴾" }, blankAnswer: { en: "corruption", ar: "تفسدوا" } },
              { sentence: { en: "\'Eat and drink but do not _______.", ar: "﴿كلوا واشربوا ولا _______.﴾" }, blankAnswer: { en: "waste", ar: "تسرفوا" } },
              { sentence: { en: "Humans are _______ on earth.", ar: "البشر _______ في الأرض." }, blankAnswer: { en: "stewards", ar: "خلفاء" } },
              { sentence: { en: "\'If you have a _______, plant it.\'", ar: "«إن بيدك _______ فازرعها.»" }, blankAnswer: { en: "seedling", ar: "فسيلة" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Receive the earth as an amanah (trust)", ar: "تلقّ الأرض كأمانة" },
              { en: "Learn Islamic environmental principles", ar: "تعلّم المبادئ البيئيّة الإسلاميّة" },
              { en: "Practise no-waste (no israf)", ar: "تدرّب على عدم الإسراف" },
              { en: "Show mercy to animals", ar: "ارحم الحيوانات" },
              { en: "Support green initiatives", ar: "ادعم المبادرات الخضراء" },
              { en: "Be a responsible khalifah", ar: "كن خليفة مسؤولًا" },
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
