import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const etiquetteOfSupplication: CourseLesson = {
  slug: "g6y7-etiquette-of-supplication",
  name: { en: "Etiquette of Supplication", ar: "آدابُ الدُّعاء" },
  shortIntro: {
    en: "Du\'a is the essence of worship — direct conversation with Allah. A deep study of the manners (adab) of supplication: how to call upon Allah, the best times and conditions, and why no sincere du\'a is ever wasted.",
    ar: "الدُّعاءُ مُخُّ العِبادة — مُناجاةٌ مُباشِرةٌ لِله. دِراسةٌ عَميقةٌ لِآدابِ الدُّعاء: كَيفَ نَدعو اللهَ، وأفضَلِ الأوقاتِ والأحوال، ولِماذا لا يَضيعُ دُعاءٌ صادِقٌ أبَدًا.",
  },
  quranSurahs: ["Ghafir 60", "Al-Baqarah 186", "Al-A'raf 55-56"],
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
        title: { en: "Does dua really work?", ar: "هل الدعاء يعمل فعلًا؟" },
        body: {
          en: "A student says: \'I made dua many times but nothing happened. Dua does not work. Allah does not listen. There is no point in asking — things happen on their own.\'",
          ar: "طالب يقول: «دعوت كثيرًا ولم يحدث شيء. الدعاء لا يعمل. الله لا يستمع. لا فائدة من السؤال.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Quran and Hadith on the reality and etiquette of dua.",
          ar: "انتقد بالقرآن والحديث عن حقيقة الدعاء وآدابه.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'Call upon Me; I will respond to you.\' (Ghafir 60)",
        ar: "﴿ادعوني أستجب لكم﴾ (غافر ٦٠)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.grandMosque, keyword: { en: "Du\'a (Supplication)", ar: "دعاء" } },
          { image: IMG.childQuran, keyword: { en: "Ikhlas (Sincerity)", ar: "إخلاص" } },
          { image: IMG.lantern, keyword: { en: "Yaqin (Certainty)", ar: "يقين" } },
          { image: IMG.bookshelf, keyword: { en: "Adab (Etiquette)", ar: "أدب" } },
          { image: IMG.skyBlue, keyword: { en: "Istijabah (Response)", ar: "استجابة" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'When My servants ask you about Me, I am near. I respond to the call of the caller when he calls.\' (Al-Baqara 186)",
        ar: "﴿وإذا سألك عبادي عنّي فإنّي قريب أجيب دعوة الداعي إذا دعان﴾ (البقرة ١٨٦)",
      },
    },
    {
      title: { en: "Etiquette of Supplication", ar: "آدابُ الدُّعاء" },
      learningObjectives: [
        { en: "Explain the etiquette and conditions of accepted dua.", ar: "أشرح آداب وشروط الدعاء المقبول." },
        { en: "Identify the best times and manners for supplication.", ar: "أحدّد أفضل الأوقات والآداب للدعاء." },
      ],
      successCriteria: [
        { en: "I can list 5 etiquettes of dua.", ar: "أذكر ٥ آداب للدعاء." },
        { en: "I can explain how Allah responds to dua.", ar: "أشرح كيف يستجيب الله للدعاء." },
        { en: "I can identify the best times for making dua.", ar: "أحدّد أفضل أوقات الدعاء." },
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
      title: { en: "Etiquette of Supplication (Du\'a)", ar: "آداب الدعاء" },
      learningObjectives: [
        { en: "Master the etiquette and conditions for accepted supplication.", ar: "أتقن آداب وشروط الدعاء المقبول." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "The Promise of Response", ar: "وعد الاستجابة" },
          lines: [
            { en: "Ghafir 60: \'Call upon Me; I will respond.\' Al-Baqara 186: \'I am near, I respond.\' Allah responds in 3 ways: gives what you asked, averts harm, or stores reward for the Hereafter. (Ahmad)", ar: "غافر ٦٠: ﴿ادعوني أستجب لكم﴾. البقرة ١٨٦: ﴿إنّي قريب أجيب﴾. الله يستجيب بثلاث: يعطيك أو يدفع عنك ضرًّا أو يدّخر لك ثوابًا. (أحمد)" },
          ],
        },
        {
          label: { en: "Etiquettes of Dua", ar: "آداب الدعاء" },
          lines: [
            { en: "1) Begin with praising Allah. 2) Send salawat on the Prophet. 3) Be sincere (ikhlas). 4) Have certainty (yaqin). 5) Be patient — don\'t rush. 6) Ask in humility. 7) Use Allah\'s Names. 8) Face the qiblah. 9) Raise hands. 10) End with Ameen.", ar: "١) ابدأ بحمد الله. ٢) صلِّ على النبيّ. ٣) أخلص. ٤) أيقن. ٥) اصبر. ٦) ادعُ بتواضع. ٧) استخدم أسماء الله. ٨) استقبل القبلة. ٩) ارفع اليدين. ١٠) ختم بآمين." },
          ],
        },
        {
          label: { en: "Best Times", ar: "أفضل الأوقات" },
          lines: [
            { en: "Last third of the night. While fasting. Between adhan and iqamah. In sujud. Day of Arafah. While it rains. While travelling. For the oppressed.", ar: "الثلث الأخير من الليل. أثناء الصيام. بين الأذان والإقامة. في السجود. يوم عرفة. أثناء المطر. المسافر. المظلوم." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Allah promises to respond to dua.", ar: "الله يعد بإجابة الدعاء." }, answer: true },
        { statement: { en: "Dua is useless.", ar: "الدعاء بلا فائدة." }, answer: false },
        { statement: { en: "Sincerity is required for dua.", ar: "الإخلاص مطلوب في الدعاء." }, answer: true },
        { statement: { en: "Rush and complain if dua is not answered.", ar: "استعجل واشتكِ إن لم يُستجب." }, answer: false },
        { statement: { en: "The last third of the night is a best time.", ar: "الثلث الأخير من الليل أفضل وقت." }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'Call upon Me; I will _______.", ar: "﴿ادعوني _______ لكم.﴾" }, answer: { en: "respond", ar: "أستجب" } },
        { sentence: { en: "Begin dua by praising _______.", ar: "ابدأ الدعاء بحمد _______." }, answer: { en: "Allah", ar: "الله" } },
        { sentence: { en: "Have _______ (certainty) when making dua.", ar: "كن ذا _______ عند الدعاء." }, answer: { en: "yaqin", ar: "يقين" } },
        { sentence: { en: "Allah responds in _______ ways.", ar: "الله يستجيب ب_______ طرق." }, answer: { en: "three", ar: "ثلاث" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Dua is worship — begin with praise, send salawat, ask with sincerity, be patient, and trust Allah\'s response.",
        ar: "الدعاء عبادة — ابدأ بالحمد وصلِّ على النبيّ وادعُ بإخلاص واصبر وتوكّل.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore the etiquette of dua in depth.", ar: "استكشف آداب الدعاء بعمق." },
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
            title: { en: "The Promise", ar: "الوعد" },
            image: IMG.grandMosque,
            color: "teal",
            topic: { en: "Allah hears and responds", ar: "الله يسمع ويستجيب" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "Ghafir 60 + Al-Baqara 186.", ar: "غافر ٦٠ + البقرة ١٨٦." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'No Muslim makes dua without Allah giving one of three things.\' (Ahmad)", ar: "«ما من مسلم يدعو إلّا أعطاه الله إحدى ثلاث.» (أحمد)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Every dua is heard — be patient for the answer.", ar: "كلّ دعاء مسموع — اصبر للإجابة." } },
            ],
            task: {
              title: { en: "Analyse the Promise", ar: "حلّل الوعد" },
              description: { en: "Write about the 3 ways Allah responds to dua.", ar: "اكتب عن الطرق الثلاث لاستجابة الله." },
              hint: { en: "Include: Quran, Hadith, personal reflection.", ar: "ضمّن: القرآن والحديث والتأمّل الشخصي." },
            },
          },
          {
            id: "B",
            title: { en: "10 Etiquettes", ar: "١٠ آداب" },
            image: IMG.childQuran,
            color: "blue",
            topic: { en: "How to make dua properly", ar: "كيف تدعو بشكل صحيح" },
            infoSections: [
              { label: { en: "List", ar: "قائمة" }, content: { en: "Praise Allah, salawat, sincerity, certainty, patience, humility, use Names, face qiblah, raise hands, Ameen.", ar: "حمد الله والصلاة على النبيّ والإخلاص واليقين والصبر والتواضع والأسماء والقبلة ورفع اليدين وآمين." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Allah is angry with the one who does not ask Him.\' (Tirmidhi)", ar: "«يغضب الله على من لم يسأله.» (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Dua has etiquettes like any act of worship.", ar: "للدعاء آداب كأيّ عبادة." } },
            ],
            task: {
              title: { en: "Create Dua Etiquette Chart", ar: "أنشئ مخطّط آداب الدعاء" },
              description: { en: "Design a visual chart of the 10 etiquettes.", ar: "صمّم مخطّطًا بصريًّا لـ١٠ آداب." },
              hint: { en: "Include: etiquette, evidence, explanation.", ar: "ضمّن: الأدب والدليل والشرح." },
            },
          },
          {
            id: "C",
            title: { en: "Best Times for Dua", ar: "أفضل أوقات الدعاء" },
            image: IMG.lantern,
            color: "purple",
            topic: { en: "When to ask", ar: "متى تسأل" },
            infoSections: [
              { label: { en: "Times", ar: "أوقات" }, content: { en: "Last third of night, in sujud, between adhan/iqamah, while fasting, Day of Arafah, while raining, while travelling.", ar: "الثلث الأخير وفي السجود وبين الأذان والإقامة وأثناء الصيام ويوم عرفة والمطر والسفر." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The closest a servant is to his Lord is in sujud, so make much dua.\' (Muslim)", ar: "«أقرب ما يكون العبد من ربّه وهو ساجد فأكثروا الدعاء.» (مسلم)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Timing increases the chance of acceptance.", ar: "التوقيت يزيد فرصة القبول." } },
            ],
            task: {
              title: { en: "Create a Dua Schedule", ar: "أنشئ جدول دعاء" },
              description: { en: "Plan the best times for dua in your daily routine.", ar: "خطّط لأفضل أوقات الدعاء في روتينك." },
              hint: { en: "Include: time, type of dua, evidence.", ar: "ضمّن: الوقت ونوع الدعاء والدليل." },
            },
          },
          {
            id: "D",
            title: { en: "Obstacles to Acceptance", ar: "موانع القبول" },
            image: IMG.bookshelf,
            color: "amber",
            topic: { en: "What blocks dua", ar: "ما يمنع الدعاء" },
            infoSections: [
              { label: { en: "Obstacles", ar: "موانع" }, content: { en: "Haram income, impatience (\'I asked but was not answered\'), sinful heart, not believing Allah will respond.", ar: "الكسب الحرام والاستعجال والقلب الآثم وعدم الثقة بالاستجابة." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'One of you is answered so long as he is not impatient.\' (Bukhari)", ar: "«يُستجاب لأحدكم ما لم يعجل.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Remove obstacles for dua to be accepted.", ar: "أزل الموانع ليُقبل الدعاء." } },
            ],
            task: {
              title: { en: "List Obstacles and Solutions", ar: "اذكر الموانع والحلول" },
              description: { en: "Write 5 obstacles to dua and how to overcome them.", ar: "اكتب ٥ موانع للدعاء وكيف تتغلّب عليها." },
              hint: { en: "Include: the obstacle, the hadith, the solution.", ar: "ضمّن: المانع والحديث والحلّ." },
            },
          },
          {
            id: "E",
            title: { en: "Prophet\'s Duas", ar: "أدعية النبيّ" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Beautiful supplications", ar: "أدعية جميلة" },
            infoSections: [
              { label: { en: "Dua", ar: "دعاء" }, content: { en: "\'O Allah, I ask You for guidance, piety, chastity, and contentment.\' (Muslim)", ar: "«اللهمّ إنّي أسألك الهدى والتقى والعفاف والغنى.» (مسلم)" } },
              { label: { en: "Dua", ar: "دعاء" }, content: { en: "\'Our Lord, give us in this world good and in the Hereafter good.\' (Al-Baqara 201)", ar: "﴿ربّنا آتنا في الدنيا حسنة وفي الآخرة حسنة﴾ (البقرة ٢٠١)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "The Prophet\'s duas are the most comprehensive.", ar: "أدعية النبيّ أشمل الأدعية." } },
            ],
            task: {
              title: { en: "Memorise 5 Prophet Duas", ar: "احفظ ٥ أدعية نبويّة" },
              description: { en: "Write 5 duas from the Prophet with meaning.", ar: "اكتب ٥ أدعية نبويّة بمعناها." },
              hint: { en: "Include: Arabic text, meaning, when to say.", ar: "ضمّن: النصّ العربي والمعنى ومتى تقول." },
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
            question: { en: "Ghafir 60 says?", ar: "غافر ٦٠ تقول؟" },
            options: [
            { en: "Call upon Me; I respond", ar: "ادعوني أستجب" },
            { en: "Do not ask", ar: "لا تسألوا" },
            { en: "Ignore dua", ar: "تجاهلوا الدعاء" },
            { en: "Give up", ar: "استسلموا" },
            ],
            correctIndex: 0,
            explanation: { en: "Call upon Me; I will respond.", ar: "ادعوني أستجب لكم." },
          },
          {
            question: { en: "How does Allah respond?", ar: "كيف يستجيب الله؟" },
            options: [
            { en: "3 ways", ar: "٣ طرق" },
            { en: "1 way", ar: "طريقة واحدة" },
            { en: "Never", ar: "أبدًا" },
            { en: "Only money", ar: "بالمال فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "3 ways.", ar: "٣ طرق." },
          },
          {
            question: { en: "Begin dua with?", ar: "ابدأ الدعاء ب؟" },
            options: [
            { en: "Praising Allah", ar: "حمد الله" },
            { en: "Complaining", ar: "الشكوى" },
            { en: "Crying", ar: "البكاء" },
            { en: "Sleeping", ar: "النوم" },
            ],
            correctIndex: 0,
            explanation: { en: "Praising Allah.", ar: "حمد الله." },
          },
          {
            question: { en: "Closest to Allah in?", ar: "أقرب لله في؟" },
            options: [
            { en: "Sujud", ar: "السجود" },
            { en: "Sleeping", ar: "النوم" },
            { en: "Eating", ar: "الأكل" },
            { en: "Walking", ar: "المشي" },
            ],
            correctIndex: 0,
            explanation: { en: "Sujud (Muslim).", ar: "السجود (مسلم)." },
          },
          {
            question: { en: "Impatience in dua?", ar: "الاستعجال في الدعاء؟" },
            options: [
            { en: "Blocks response", ar: "يمنع الاستجابة" },
            { en: "Helps", ar: "يساعد" },
            { en: "No effect", ar: "لا أثر" },
            { en: "Required", ar: "مطلوب" },
            ],
            correctIndex: 0,
            explanation: { en: "Blocks response.", ar: "يمنع الاستجابة." },
          },
          {
            question: { en: "Best night time for dua?", ar: "أفضل وقت ليلي للدعاء؟" },
            options: [
            { en: "Last third", ar: "الثلث الأخير" },
            { en: "First third", ar: "الثلث الأوّل" },
            { en: "Middle", ar: "الوسط" },
            { en: "Dawn", ar: "الفجر" },
            ],
            correctIndex: 0,
            explanation: { en: "Last third of the night.", ar: "الثلث الأخير من الليل." },
          },
          {
            question: { en: "Dua is?", ar: "الدعاء؟" },
            options: [
            { en: "Worship", ar: "عبادة" },
            { en: "Waste of time", ar: "مضيعة" },
            { en: "Optional extra", ar: "إضافي" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Worship.", ar: "عبادة." },
          },
          {
            question: { en: "Allah is angry if you?", ar: "الله يغضب إن؟" },
            options: [
            { en: "Don\'t ask Him", ar: "لم تسأله" },
            { en: "Ask too much", ar: "سألت كثيرًا" },
            { en: "Pray", ar: "صلّيت" },
            { en: "Fasted", ar: "صمت" },
            ],
            correctIndex: 0,
            explanation: { en: "Don\'t ask Him (Tirmidhi).", ar: "لم تسأله (الترمذي)." },
          },
          {
            question: { en: "Raise hands is?", ar: "رفع اليدين؟" },
            options: [
            { en: "An etiquette of dua", ar: "أدب من الدعاء" },
            { en: "Forbidden", ar: "محرّم" },
            { en: "Unnecessary", ar: "غير ضروري" },
            { en: "Wrong", ar: "خاطئ" },
            ],
            correctIndex: 0,
            explanation: { en: "An etiquette.", ar: "أدب من الدعاء." },
          },
          {
            question: { en: "Haram income affects?", ar: "الكسب الحرام يؤثّر على؟" },
            options: [
            { en: "Dua acceptance", ar: "قبول الدعاء" },
            { en: "Nothing", ar: "لا شيء" },
            { en: "Sleep", ar: "النوم" },
            { en: "Work", ar: "العمل" },
            ],
            correctIndex: 0,
            explanation: { en: "Dua acceptance.", ar: "قبول الدعاء." },
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
        title: { en: "Etiquette of Supplication", ar: "آداب الدعاء" },
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
        code: "SUPPL001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Etiquette of Supplication", ar: "ورقة عمل — آدابُ الدُّعاء" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Etiquette of Supplication", ar: "ورقة عمل — آدابُ الدُّعاء" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Ghafir 60?", ar: "غافر ٦٠؟" },
                options: [
                { en: "Call Me, I respond", ar: "ادعوني أستجب" },
                { en: "Ignore", ar: "تجاهلوا" },
                { en: "Don\'t ask", ar: "لا تسألوا" },
                { en: "Be silent", ar: "اصمتوا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Allah responds?", ar: "الله يستجيب؟" },
                options: [
                { en: "3 ways", ar: "٣ طرق" },
                { en: "Never", ar: "أبدًا" },
                { en: "Only once", ar: "مرّة" },
                { en: "Randomly", ar: "عشوائيًّا" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Begin dua?", ar: "ابدأ الدعاء؟" },
                options: [
                { en: "Praise Allah", ar: "حمد الله" },
                { en: "Complain", ar: "الشكوى" },
                { en: "Sleep", ar: "النوم" },
                { en: "Eat", ar: "الأكل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Closest in?", ar: "أقرب في؟" },
                options: [
                { en: "Sujud", ar: "السجود" },
                { en: "Sleep", ar: "النوم" },
                { en: "Walk", ar: "المشي" },
                { en: "Eat", ar: "الأكل" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Impatience?", ar: "الاستعجال؟" },
                options: [
                { en: "Blocks dua", ar: "يمنع" },
                { en: "Helps", ar: "يساعد" },
                { en: "Nothing", ar: "لا شيء" },
                { en: "Required", ar: "مطلوب" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Allah responds to dua.", ar: "الله يستجيب للدعاء." }, answer: true },
              { statement: { en: "Dua is pointless.", ar: "الدعاء بلا فائدة." }, answer: false },
              { statement: { en: "Sincerity is needed.", ar: "الإخلاص مطلوب." }, answer: true },
              { statement: { en: "Rush if not answered.", ar: "استعجل إن لم يُستجب." }, answer: false },
              { statement: { en: "Sujud is closest time.", ar: "السجود أقرب وقت." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Du\'a", ar: "دعاء" }, answer: { en: "Supplication", ar: "المناجاة" } },
              { prompt: { en: "Ikhlas", ar: "إخلاص" }, answer: { en: "Sincerity", ar: "الإخلاص" } },
              { prompt: { en: "Yaqin", ar: "يقين" }, answer: { en: "Certainty", ar: "اليقين" } },
              { prompt: { en: "Adab", ar: "أدب" }, answer: { en: "Etiquette", ar: "الآداب" } },
              { prompt: { en: "Istijabah", ar: "استجابة" }, answer: { en: "Response", ar: "الاستجابة" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Call upon Me; I will _______.", ar: "﴿ادعوني _______ لكم.﴾" }, blankAnswer: { en: "respond", ar: "أستجب" } },
              { sentence: { en: "Begin with praising _______.", ar: "ابدأ بحمد _______." }, blankAnswer: { en: "Allah", ar: "الله" } },
              { sentence: { en: "Closest to Allah in _______.", ar: "أقرب لله في _______." }, blankAnswer: { en: "sujud", ar: "السجود" } },
              { sentence: { en: "Allah responds in _______ ways.", ar: "الله يستجيب ب_______ طرق." }, blankAnswer: { en: "three", ar: "ثلاث" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Recognise the need for dua", ar: "أدرك الحاجة للدعاء" },
              { en: "Learn the etiquettes (praise, salawat, sincerity)", ar: "تعلّم الآداب" },
              { en: "Choose the best times", ar: "اختر أفضل الأوقات" },
              { en: "Make dua with certainty and patience", ar: "ادعُ بيقين وصبر" },
              { en: "Remove obstacles (haram, impatience)", ar: "أزل الموانع" },
              { en: "Trust Allah\'s response in all forms", ar: "توكّل على استجابة الله بكلّ أشكالها" },
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
