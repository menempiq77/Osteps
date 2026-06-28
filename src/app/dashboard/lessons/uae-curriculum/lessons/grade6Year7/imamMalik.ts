import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const imamMalik: CourseLesson = {
  slug: "g6y7-imam-malik-ibn-anas",
  name: { en: "Imam Malik ibn Anas", ar: "الإمامُ مالِكُ بنُ أنَس" },
  shortIntro: {
    en: "The life of the \'Imam of Madinah\' (711-795 CE): his deep reverence for hadith, his masterwork al-Muwatta\', his courage before rulers, his famous humility (\'everyone\'s word is taken or rejected except the one in this grave\'), and what his school (the Maliki madhhab) teaches us about scholarship.",
    ar: "سيرةُ «إمامِ دارِ الهِجرة» (٩٣-١٧٩هـ): تَعظيمُهُ العَميقُ لِلحَديث، وكِتابُهُ المُوَطَّأ، وشَجاعَتُهُ أمامَ الحُكّام، وتَواضُعُهُ المَشهور («كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا صاحِبَ هذا القَبر»)، وما يُعَلِّمُنا مَذهَبُهُ المالِكِيُّ عنِ العِلم.",
  },
  quranSurahs: ["Fatir 28", "Al-Mujadila 11", "An-Nahl 43"],
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
        title: { en: "Should we follow scholars blindly?", ar: "هل نتّبع العلماء بلا تفكير؟" },
        body: {
          en: "A student says: \'Imam Malik was just a man — why study his life? All scholars have bias. We only need the Quran, nothing else matters.\'",
          ar: "طالب يقول: «الإمام مالك مجرّد رجل — لماذا ندرسه؟ كلّ العلماء متحيّزون. نحتاج القرآن فقط.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran on following scholars and Imam Malik\'s contribution.",
          ar: "انتقد بالقرآن عن اتّباع العلماء وإسهامات الإمام مالك.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Ask the people of knowledge if you do not know.\' (An-Nahl 43)",
        ar: "﴿فاسألوا أهل الذكر إن كنتم لا تعلمون﴾ (النحل ٤٣)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Fiqh (Jurisprudence)", ar: "فقه" } },
          { image: IMG.childQuran, keyword: { en: "Hadith (Prophetic tradition)", ar: "حديث" } },
          { image: IMG.bookshelf, keyword: { en: "Al-Muwatta (Imam Malik book)", ar: "الموطّأ" } },
          { image: IMG.lantern, keyword: { en: "Madinah (City of Prophet)", ar: "المدينة" } },
          { image: IMG.skyBlue, keyword: { en: "Ilm (Knowledge)", ar: "علم" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'Ask the people of knowledge if you do not know.\' (An-Nahl 43)",
        ar: "﴿فاسألوا أهل الذكر إن كنتم لا تعلمون﴾ (النحل ٤٣)",
      },
    },
    {
      title: { en: "Imam Malik ibn Anas", ar: "الإمامُ مالِكُ بنُ أنَس" },
      learningObjectives: [
        { en: "Learn about Imam Malik\'s life, scholarship, and contributions.", ar: "تعرّف على حياة الإمام مالك وعلمه وإسهاماته." },
        { en: "Understand the Maliki school of thought and Al-Muwatta.", ar: "أفهم المذهب المالكي والموطّأ." },
      ],
      successCriteria: [
        { en: "I can describe Imam Malik\'s early life and education.", ar: "أصف حياة الإمام مالك وتعليمه." },
        { en: "I can explain the significance of Al-Muwatta.", ar: "أشرح أهمّيّة الموطّأ." },
        { en: "I can list 3 qualities of Imam Malik as a scholar.", ar: "أذكر ٣ صفات للإمام مالك كعالم." },
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
      title: { en: "Imam Malik ibn Anas — Scholar of Madinah", ar: "الإمام مالك بن أنس — عالم المدينة" },
      learningObjectives: [
        { en: "Understand Imam Malik\'s life, works, and the Maliki school.", ar: "أفهم حياة الإمام مالك وأعماله والمذهب المالكي." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Early Life", ar: "النشأة" },
          lines: [
            { en: "Born in Madinah 93 AH. Memorised the Quran young. Studied under 900+ scholars including Nafi, Ibn Shihab az-Zuhri. Known as \'Imam Dar al-Hijrah\' (Imam of the City of Migration).", ar: "ولد في المدينة ٩٣ هـ. حفظ القرآن صغيرًا. درس على ٩٠٠ عالم منهم نافع وابن شهاب الزهري. لُقّب بـ«إمام دار الهجرة»." },
          ],
        },
        {
          label: { en: "Al-Muwatta", ar: "الموطّأ" },
          lines: [
            { en: "First major Hadith and Fiqh book — compiled over 40 years. Contains hadiths, athar (companion sayings), and fiqh opinions. Imam Shafii said: \'After the Quran, the most authentic book is Al-Muwatta.\'", ar: "أوّل كتاب حديث وفقه كبير — جُمع في ٤٠ سنة. يحوي أحاديث وآثار وفتاوى. قال الشافعي: «أصحّ كتاب بعد القرآن الموطّأ.»" },
          ],
        },
        {
          label: { en: "His Qualities", ar: "صفاته" },
          lines: [
            { en: "Extreme reverence for Hadith — would make wudu and dress formally before teaching. Never rode a horse in Madinah out of respect for the Prophet\'s resting place. Patient when persecuted.", ar: "احترام شديد للحديث — كان يتوضّأ ويتزيّن قبل التدريس. لم يركب فرسًا في المدينة احترامًا. صبر على الأذى." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Imam Malik was born in Madinah.", ar: "ولد الإمام مالك في المدينة." }, answer: true },
        { statement: { en: "Al-Muwatta was written in one week.", ar: "كُتب الموطّأ في أسبوع." }, answer: false },
        { statement: { en: "Imam Malik studied under 900+ scholars.", ar: "درس الإمام مالك على أكثر من ٩٠٠ عالم." }, answer: true },
        { statement: { en: "Imam Malik disliked the Quran.", ar: "لم يحبّ الإمام مالك القرآن." }, answer: false },
        { statement: { en: "Imam Shafii praised Al-Muwatta.", ar: "أثنى الشافعي على الموطّأ." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "Imam Malik was born in _______ (city).", ar: "ولد الإمام مالك في _______ (المدينة)." }, answer: { en: "Madinah", ar: "المدينة" } },
        { sentence: { en: "His famous book is called Al-_______.", ar: "كتابه الشهير يسمّى _______." }, answer: { en: "Muwatta", ar: "الموطّأ" } },
        { sentence: { en: "He was called Imam Dar al-_______.", ar: "لُقّب بإمام دار _______." }, answer: { en: "Hijrah", ar: "الهجرة" } },
        { sentence: { en: "He studied under _______ scholars.", ar: "درس على _______ عالم." }, answer: { en: "900+", ar: "أكثر من ٩٠٠" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Imam Malik ibn Anas — born in Madinah, compiler of Al-Muwatta, founder of the Maliki school. A scholar of unmatched reverence and dedication.",
        ar: "الإمام مالك بن أنس — ولد في المدينة، مؤلّف الموطّأ، مؤسّس المذهب المالكي. عالم بإجلال وتفانٍ لا مثيل لهما.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore Imam Malik\'s legacy from multiple perspectives.", ar: "استكشف إرث الإمام مالك من زوايا متعدّدة." },
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
            title: { en: "His Education", ar: "تعليمه" },
            image: IMG.bookshelf,
            color: "teal",
            topic: { en: "How he became a great scholar", ar: "كيف أصبح عالمًا عظيمًا" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "He studied under Nafi (student of Ibn Umar), connecting him to the Prophet through short chains.", ar: "درس على نافع (تلميذ ابن عمر) بأسانيد قصيرة." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Seeking knowledge is an obligation upon every Muslim.\' (Ibn Majah)", ar: "«طلب العلم فريضة.» (ابن ماجه)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Patient learning over decades made him great.", ar: "التعلّم الصبور عبر عقود صنع عظمته." } },
            ],
            task: {
              title: { en: "Create a Timeline", ar: "أنشئ خطًّا زمنيًّا" },
              description: { en: "Draw Imam Malik\'s educational timeline.", ar: "ارسم خطًّا زمنيًّا لتعليم الإمام مالك." },
              hint: { en: "Include: teachers, age of memorisation, major milestones.", ar: "ضمّن: المعلّمين وسنّ الحفظ والمحطّات." },
            },
          },
          {
            id: "B",
            title: { en: "Al-Muwatta", ar: "الموطّأ" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "The first major hadith compilation", ar: "أوّل تصنيف حديثي كبير" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Compiled over 40 years. Originally 10,000 hadiths, refined to ~1,700.", ar: "جُمع في ٤٠ سنة. أصلًا ١٠,٠٠٠ حديث نُقّح إلى ~١,٧٠٠." } },
              { label: { en: "Quote", ar: "مقولة" }, content: { en: "Imam Shafii: \'No book on earth after Quran is more authentic.\'", ar: "الشافعي: «ما على وجه الأرض بعد القرآن أصحّ.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Quality over quantity in knowledge.", ar: "الجودة أهمّ من الكمّيّة في العلم." } },
            ],
            task: {
              title: { en: "Summarise Al-Muwatta", ar: "لخّص الموطّأ" },
              description: { en: "Write a summary of Al-Muwatta\'s structure and importance.", ar: "اكتب ملخّصًا لهيكل الموطّأ وأهمّيّته." },
              hint: { en: "Include: chapters, number of hadiths, why it matters.", ar: "ضمّن: الأبواب وعدد الأحاديث والأهمّيّة." },
            },
          },
          {
            id: "C",
            title: { en: "His Character", ar: "أخلاقه" },
            image: IMG.grandMosque,
            color: "purple",
            topic: { en: "The model scholar", ar: "العالم القدوة" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "He would make wudu and wear his best clothes before narrating hadith.", ar: "كان يتوضّأ ويلبس أحسن ثيابه قبل رواية الحديث." } },
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "Refused to ride a horse in Madinah: \'I will not let a horse\'s hooves step on the soil where the Prophet is buried.\'", ar: "رفض ركوب الفرس في المدينة: «لا أطأ تربة فيها النبيّ ﷺ.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Respect for knowledge = respect for the Prophet\'s legacy.", ar: "احترام العلم = احترام إرث النبيّ." } },
            ],
            task: {
              title: { en: "Write a Character Profile", ar: "اكتب ملفّ أخلاق" },
              description: { en: "Create a detailed character profile of Imam Malik.", ar: "أنشئ ملفّ أخلاق مفصّلًا للإمام مالك." },
              hint: { en: "Include: habits, quotes, principles, evidence of character.", ar: "ضمّن: العادات والأقوال والمبادئ." },
            },
          },
          {
            id: "D",
            title: { en: "The Maliki School", ar: "المذهب المالكي" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "One of four major schools", ar: "أحد المذاهب الأربعة" },
            infoSections: [
              { label: { en: "Fact", ar: "حقيقة" }, content: { en: "The Maliki school is followed across North/West Africa, UAE, and parts of the Gulf.", ar: "المذهب المالكي يُتّبع في شمال/غرب أفريقيا والإمارات وأجزاء من الخليج." } },
              { label: { en: "Method", ar: "منهج" }, content: { en: "Sources: Quran, Sunnah, Amal Ahl al-Madinah (practice of Madinah people), Ijma, Qiyas.", ar: "المصادر: القرآن والسنّة وعمل أهل المدينة والإجماع والقياس." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Diversity of schools = richness, not division.", ar: "تنوّع المذاهب = ثراء لا انقسام." } },
            ],
            task: {
              title: { en: "Compare the Four Schools", ar: "قارن المذاهب الأربعة" },
              description: { en: "Create a brief comparison of the four madhahib.", ar: "أنشئ مقارنة موجزة بين المذاهب الأربعة." },
              hint: { en: "Include: founder, region, key source emphasis.", ar: "ضمّن: المؤسّس والمنطقة والمصدر الرئيسي." },
            },
          },
          {
            id: "E",
            title: { en: "Lessons for Students", ar: "دروس للطلّاب" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "What we learn from Imam Malik", ar: "ما نتعلّمه من الإمام مالك" },
            infoSections: [
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Patience in learning — he studied for decades.", ar: "الصبر في التعلّم — درس عقودًا." } },
              { label: { en: "Lesson", ar: "درس" }, content: { en: "Integrity — refused to change his views under pressure.", ar: "النزاهة — رفض تغيير آرائه تحت الضغط." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "True knowledge requires sacrifice and sincerity.", ar: "العلم الحقيقي يحتاج تضحية وإخلاصًا." } },
            ],
            task: {
              title: { en: "Write a Reflection", ar: "اكتب تأمّلًا" },
              description: { en: "Write what you can learn from Imam Malik for your studies.", ar: "اكتب ما تتعلّمه من الإمام مالك لدراستك." },
              hint: { en: "Include: specific habits, how to apply, Islamic motivation.", ar: "ضمّن: عادات محدّدة والتطبيق والدافع." },
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
            question: { en: "Where was Imam Malik born?", ar: "أين ولد الإمام مالك؟" },
            options: [
            { en: "Madinah", ar: "المدينة" },
            { en: "Makkah", ar: "مكّة" },
            { en: "Baghdad", ar: "بغداد" },
            { en: "Damascus", ar: "دمشق" },
            ],
            correctIndex: 0,
            explanation: { en: "Madinah.", ar: "المدينة." },
          },
          {
            question: { en: "What is Al-Muwatta?", ar: "ما الموطّأ؟" },
            options: [
            { en: "A hadith and fiqh compilation", ar: "كتاب حديث وفقه" },
            { en: "A poem", ar: "قصيدة" },
            { en: "A novel", ar: "رواية" },
            { en: "A map", ar: "خريطة" },
            ],
            correctIndex: 0,
            explanation: { en: "First major hadith and fiqh book.", ar: "أوّل كتاب حديث وفقه كبير." },
          },
          {
            question: { en: "How long to compile Al-Muwatta?", ar: "كم استغرق تأليف الموطّأ؟" },
            options: [
            { en: "40 years", ar: "٤٠ سنة" },
            { en: "1 year", ar: "سنة" },
            { en: "1 week", ar: "أسبوع" },
            { en: "1 month", ar: "شهر" },
            ],
            correctIndex: 0,
            explanation: { en: "40 years of careful selection.", ar: "٤٠ سنة من الانتقاء." },
          },
          {
            question: { en: "What did Imam Shafii say about Al-Muwatta?", ar: "ماذا قال الشافعي عن الموطّأ؟" },
            options: [
            { en: "Most authentic after Quran", ar: "أصحّ بعد القرآن" },
            { en: "Not useful", ar: "ليس مفيدًا" },
            { en: "Too short", ar: "قصير جدًّا" },
            { en: "Outdated", ar: "قديم" },
            ],
            correctIndex: 0,
            explanation: { en: "Most authentic book after Quran.", ar: "أصحّ كتاب بعد القرآن." },
          },
          {
            question: { en: "Why didn\'t Malik ride in Madinah?", ar: "لماذا لم يركب مالك في المدينة؟" },
            options: [
            { en: "Respect for Prophet\'s resting place", ar: "احترامًا لمرقد النبيّ" },
            { en: "No horses", ar: "لا خيول" },
            { en: "Too old", ar: "كبير السنّ" },
            { en: "Fear", ar: "خوف" },
            ],
            correctIndex: 0,
            explanation: { en: "Out of reverence for the Prophet.", ar: "إجلالًا للنبيّ." },
          },
          {
            question: { en: "How many scholars did he study under?", ar: "كم عالمًا درس عليه؟" },
            options: [
            { en: "900+", ar: "أكثر من ٩٠٠" },
            { en: "5", ar: "٥" },
            { en: "10", ar: "١٠" },
            { en: "50", ar: "٥٠" },
            ],
            correctIndex: 0,
            explanation: { en: "More than 900 scholars.", ar: "أكثر من ٩٠٠ عالم." },
          },
          {
            question: { en: "Which school is followed in UAE?", ar: "أيّ مذهب يُتّبع في الإمارات؟" },
            options: [
            { en: "Maliki", ar: "المالكي" },
            { en: "Shafii", ar: "الشافعي" },
            { en: "Hanbali", ar: "الحنبلي" },
            { en: "Hanafi", ar: "الحنفي" },
            ],
            correctIndex: 0,
            explanation: { en: "Maliki school.", ar: "المذهب المالكي." },
          },
          {
            question: { en: "What did Malik do before teaching hadith?", ar: "ماذا فعل مالك قبل تدريس الحديث؟" },
            options: [
            { en: "Made wudu and dressed formally", ar: "توضّأ وتزيّن" },
            { en: "Ate a meal", ar: "أكل وجبة" },
            { en: "Went for a walk", ar: "تمشّى" },
            { en: "Nothing special", ar: "لا شيء خاصّ" },
            ],
            correctIndex: 0,
            explanation: { en: "Wudu and best clothes.", ar: "الوضوء وأحسن الثياب." },
          },
          {
            question: { en: "What title was Imam Malik known by?", ar: "بأيّ لقب عُرف الإمام مالك؟" },
            options: [
            { en: "Imam Dar al-Hijrah", ar: "إمام دار الهجرة" },
            { en: "Imam Baghdad", ar: "إمام بغداد" },
            { en: "Imam Makkah", ar: "إمام مكّة" },
            { en: "Imam Cairo", ar: "إمام القاهرة" },
            ],
            correctIndex: 0,
            explanation: { en: "Imam of the City of Migration.", ar: "إمام دار الهجرة." },
          },
          {
            question: { en: "What verse supports following scholars?", ar: "أيّ آية تدعم اتّباع العلماء؟" },
            options: [
            { en: "An-Nahl 43", ar: "النحل ٤٣" },
            { en: "Al-Fatiha 1", ar: "الفاتحة ١" },
            { en: "Al-Ikhlas 1", ar: "الإخلاص ١" },
            { en: "Al-Nas 1", ar: "الناس ١" },
            ],
            correctIndex: 0,
            explanation: { en: "Ask the people of knowledge.", ar: "فاسألوا أهل الذكر." },
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
        title: { en: "Imam Malik ibn Anas", ar: "الإمام مالك بن أنس" },
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
        code: "IMAMAL01",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Imam Malik ibn Anas", ar: "ورقة عمل — الإمامُ مالِكُ بنُ أنَس" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Imam Malik ibn Anas", ar: "ورقة عمل — الإمامُ مالِكُ بنُ أنَس" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Where was Imam Malik born?", ar: "أين ولد؟" },
                options: [
                { en: "Madinah", ar: "المدينة" },
                { en: "Makkah", ar: "مكّة" },
                { en: "Baghdad", ar: "بغداد" },
                { en: "Cairo", ar: "القاهرة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "What is Al-Muwatta?", ar: "ما الموطّأ؟" },
                options: [
                { en: "Hadith/fiqh book", ar: "كتاب حديث وفقه" },
                { en: "Novel", ar: "رواية" },
                { en: "Poem", ar: "قصيدة" },
                { en: "Map", ar: "خريطة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "How long to compile?", ar: "كم استغرق؟" },
                options: [
                { en: "40 years", ar: "٤٠ سنة" },
                { en: "1 year", ar: "سنة" },
                { en: "1 month", ar: "شهر" },
                { en: "1 day", ar: "يوم" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "His title?", ar: "لقبه؟" },
                options: [
                { en: "Imam Dar al-Hijrah", ar: "إمام دار الهجرة" },
                { en: "Imam Baghdad", ar: "إمام بغداد" },
                { en: "Sultan", ar: "سلطان" },
                { en: "Khalifah", ar: "خليفة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Which school?", ar: "أيّ مذهب؟" },
                options: [
                { en: "Maliki", ar: "المالكي" },
                { en: "Hanafi", ar: "الحنفي" },
                { en: "Shafii", ar: "الشافعي" },
                { en: "Hanbali", ar: "الحنبلي" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Imam Malik was born in Madinah.", ar: "ولد الإمام مالك في المدينة." }, answer: true },
              { statement: { en: "Al-Muwatta was written in one day.", ar: "كُتب الموطّأ في يوم." }, answer: false },
              { statement: { en: "He studied under 900+ scholars.", ar: "درس على ٩٠٠ عالم." }, answer: true },
              { statement: { en: "He rode horses in Madinah.", ar: "ركب الخيل في المدينة." }, answer: false },
              { statement: { en: "Shafii praised Al-Muwatta.", ar: "أثنى الشافعي على الموطّأ." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Imam Malik", ar: "الإمام مالك" }, answer: { en: "Scholar of Madinah", ar: "عالم المدينة" } },
              { prompt: { en: "Al-Muwatta", ar: "الموطّأ" }, answer: { en: "First hadith/fiqh book", ar: "أوّل كتاب حديث وفقه" } },
              { prompt: { en: "Maliki", ar: "المالكي" }, answer: { en: "School of jurisprudence", ar: "مذهب فقهي" } },
              { prompt: { en: "Nafi", ar: "نافع" }, answer: { en: "Malik\'s key teacher", ar: "أستاذ مالك" } },
              { prompt: { en: "Dar al-Hijrah", ar: "دار الهجرة" }, answer: { en: "City of Migration", ar: "مدينة الهجرة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "Imam Malik was born in _______.", ar: "ولد الإمام مالك في _______." }, blankAnswer: { en: "Madinah", ar: "المدينة" } },
              { sentence: { en: "His famous book is _______.", ar: "كتابه الشهير _______." }, blankAnswer: { en: "Al-Muwatta", ar: "الموطّأ" } },
              { sentence: { en: "He was called Imam Dar al-_______.", ar: "لُقّب بإمام دار _______." }, blankAnswer: { en: "Hijrah", ar: "الهجرة" } },
              { sentence: { en: "He compiled Al-Muwatta over _______ years.", ar: "جمع الموطّأ في _______ سنة." }, blankAnswer: { en: "40", ar: "٤٠" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Imam Malik born in Madinah", ar: "ولادة الإمام مالك في المدينة" },
              { en: "Memorised the Quran as a child", ar: "حفظ القرآن صغيرًا" },
              { en: "Studied under 900+ scholars", ar: "درس على ٩٠٠ عالم" },
              { en: "Began compiling Al-Muwatta", ar: "بدأ تأليف الموطّأ" },
              { en: "Became known as Imam Dar al-Hijrah", ar: "عُرف بإمام دار الهجرة" },
              { en: "Left legacy of Maliki school worldwide", ar: "ترك إرث المذهب المالكي" },
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
