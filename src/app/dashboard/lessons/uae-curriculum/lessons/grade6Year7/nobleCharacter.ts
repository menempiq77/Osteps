import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const nobleCharacter: CourseLesson = {
  slug: "g6y7-noble-character-traits",
  name: { en: "Noble Character Traits", ar: "مَكارِمُ الأخلاق" },
  shortIntro: {
    en: "The Prophet ﷺ said he was sent to perfect noble character. A deep study of why good character (husn al-khuluq) is central to Islam, how it weighs heaviest on the Scale, and the key traits — honesty, mercy, humility, and forgiveness — that mark the true believer.",
    ar: "قالَ النَّبِيُّ ﷺ إنَّهُ بُعِثَ لِيُتَمِّمَ مَكارِمَ الأخلاق. دِراسةٌ عَميقةٌ لِماذا حُسنُ الخُلُقِ مِحوَرٌ في الإسلام، وكَيفَ يَثقُلُ في الميزان، وأهَمِّ الصِّفات — الصِّدقِ والرَّحمةِ والتَّواضُعِ والعَفو — التي تُمَيِّزُ المُؤمِنَ الحَقّ.",
  },
  quranSurahs: ["Al-Qalam 4", "Aal Imran 159", "Al-A'raf 199"],
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
        title: { en: "Is good character optional in Islam?", ar: "هل الأخلاق الحسنة اختياريّة في الإسلام؟" },
        body: {
          en: "A student says: \'As long as I pray and fast, my character does not matter. Being nice to people is extra — the important thing is worship.\'",
          ar: "طالب يقول: «طالما أصلّي وأصوم فأخلاقي لا تهمّ. اللطف مع الناس إضافي — المهمّ العبادة.»",
        },
      },
      responsePrompt: {
        title: { en: "Write your critical response", ar: "اكتب ردّك الناقد" },
        prompt: {
          en: "Criticise using Hadith on the weight of good character.",
          ar: "انتقد بالحديث عن ثقل حُسن الخُلُق.",
        },
        placeholder: { en: "This is wrong because...", ar: "هذا خطأ لأنّ..." },
        buttonLabel: { en: "Save response", ar: "احفظ الإجابة" },
        coinsReward: 10,
      },
      body: {
        en: "\'The most beloved to me and nearest in assembly on the Day of Resurrection are those with the best character.\' (Tirmidhi)",
        ar: "«أحبّكم إليّ وأقربكم منّي مجلسًا يوم القيامة أحاسنكم أخلاقًا.» (الترمذي)",
      },
    },
    {
      title: { en: "Retrieval practise", ar: "ممارسة الاسترجاع" },
      imageMatchingActivity: {
        title: { en: "Match each image to its Islamic keyword", ar: "طابق كلّ صورة بكلمتها الإسلاميّة" },
        instruction: { en: "Drag the keyword to the correct image.", ar: "اسحب الكلمة إلى الصورة الصحيحة." },
        pairs: [
          { image: IMG.childQuran, keyword: { en: "Akhlaq (Character)", ar: "أخلاق" } },
          { image: IMG.grandMosque, keyword: { en: "Sidq (Truthfulness)", ar: "صدق" } },
          { image: IMG.lantern, keyword: { en: "Hilm (Forbearance)", ar: "حلم" } },
          { image: IMG.bookshelf, keyword: { en: "Amanah (Trustworthiness)", ar: "أمانة" } },
          { image: IMG.skyBlue, keyword: { en: "Tawadu (Humility)", ar: "تواضع" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "\'I was sent to perfect noble character.\' (Ahmad)",
        ar: "«إنّما بُعثت لأتمّم مكارم الأخلاق.» (أحمد)",
      },
    },
    {
      title: { en: "Noble Character Traits", ar: "مَكارِمُ الأخلاق" },
      learningObjectives: [
        { en: "Explain the importance of noble character (akhlaq) in Islam.", ar: "أشرح أهمّيّة الأخلاق الحسنة في الإسلام." },
        { en: "Identify the Prophet\'s character traits as a model.", ar: "أحدّد صفات النبيّ الأخلاقيّة كنموذج." },
      ],
      successCriteria: [
        { en: "I can define akhlaq and its importance.", ar: "أعرّف الأخلاق وأهمّيّتها." },
        { en: "I can list 5 noble character traits.", ar: "أذكر ٥ صفات أخلاقيّة." },
        { en: "I can explain how character complements worship.", ar: "أشرح كيف تكمّل الأخلاق العبادة." },
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
      title: { en: "Noble Character — Akhlaq in Islam", ar: "الأخلاق الحسنة في الإسلام" },
      learningObjectives: [
        { en: "Understand the central role of noble character in Islam.", ar: "أفهم الدور المركزي للأخلاق في الإسلام." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Lesson content image.", ar: "صورة محتوى الدرس." },
      },
      infoBoxes: [
        {
          label: { en: "Character in Islam", ar: "الأخلاق في الإسلام" },
          lines: [
            { en: "The Prophet ﷺ said: \'I was sent to perfect noble character.\' (Ahmad). Character is not separate from worship — it IS worship. The heaviest thing on the scale is good character. (Tirmidhi)", ar: "قال النبيّ ﷺ: «إنّما بُعثت لأتمّم مكارم الأخلاق.» (أحمد). الأخلاق ليست منفصلة عن العبادة بل هي عبادة. أثقل شيء في الميزان حُسن الخُلُق. (الترمذي)" },
          ],
        },
        {
          label: { en: "The Prophet\'s Character", ar: "أخلاق النبيّ" },
          lines: [
            { en: "Allah said: \'And indeed, you are of a great moral character.\' (Al-Qalam 4). He was truthful, trustworthy, patient, humble, generous, forgiving, and merciful.", ar: "﴿وإنّك لعلى خلق عظيم﴾ (القلم ٤). كان صادقًا أمينًا صبورًا متواضعًا كريمًا عفوًّا رحيمًا." },
          ],
        },
        {
          label: { en: "Key Traits", ar: "الصفات الأساسيّة" },
          lines: [
            { en: "Sidq (truthfulness), Amanah (trustworthiness), Hilm (forbearance), Tawadu (humility), Ihsan (excellence), Adl (justice), Rahma (mercy).", ar: "الصدق والأمانة والحلم والتواضع والإحسان والعدل والرحمة." },
          ],
        },
      ],
      trueFalseActivity: {
        title: { en: "True or False", ar: "صواب أم خطأ" },
        questions: [
        { statement: { en: "Character is worship in Islam.", ar: "الأخلاق عبادة في الإسلام." }, answer: true },
        { statement: { en: "Only prayer matters, not character.", ar: "الصلاة فقط تهمّ لا الأخلاق." }, answer: false },
        { statement: { en: "The Prophet had the best character.", ar: "النبيّ كان أحسن الناس خُلُقًا." }, answer: true },
        { statement: { en: "Good character is light on the scale.", ar: "حُسن الخُلُق خفيف في الميزان." }, answer: false },
        { statement: { en: "\'I was sent to perfect noble character.\'", ar: "«بُعثت لأتمّم مكارم الأخلاق.»" }, answer: true },
        ],
        coinsReward: 10,
      },
      fillBlanksActivity: {
        title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
        questions: [
        { sentence: { en: "\'I was sent to perfect _______ character.\'", ar: "«بُعثت لأتمّم _______ الأخلاق.»" }, answer: { en: "noble", ar: "مكارم" } },
        { sentence: { en: "\'You are of a great moral _______.\' (Al-Qalam)", ar: "﴿إنّك لعلى _______ عظيم﴾ (القلم)" }, answer: { en: "character", ar: "خُلُق" } },
        { sentence: { en: "The heaviest thing on the scale is good _______.", ar: "أثقل شيء في الميزان حُسن _______." }, answer: { en: "character", ar: "الخُلُق" } },
        { sentence: { en: "Sidq means _______.", ar: "الصدق يعني _______." }, answer: { en: "truthfulness", ar: "الصدق" } },
        ],
        coinsReward: 10,
      },
      body: {
        en: "Noble character is central to Islam — the Prophet was sent to perfect it, and it is the heaviest thing on the scale.",
        ar: "الأخلاق محوريّة في الإسلام — النبيّ بُعث لإتمامها وهي أثقل شيء في الميزان.",
      },
    },
    {
      title: { en: "Group Work", ar: "عمل جماعي" },
      learningObjectives: [
        { en: "Explore different aspects of noble character.", ar: "استكشف جوانب الأخلاق الحسنة." },
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
            title: { en: "Truthfulness", ar: "الصدق" },
            image: IMG.childQuran,
            color: "teal",
            topic: { en: "Sidq in word and action", ar: "الصدق في القول والعمل" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Truthfulness leads to righteousness, and righteousness leads to Paradise.\' (Bukhari)", ar: "«الصدق يهدي إلى البرّ والبرّ يهدي إلى الجنّة.» (البخاري)" } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "The Prophet was called As-Sadiq Al-Amin before prophethood.", ar: "النبيّ لُقّب بالصادق الأمين قبل البعثة." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Truthfulness builds trust and respect.", ar: "الصدق يبني الثقة والاحترام." } },
            ],
            task: {
              title: { en: "Analyse Truthfulness", ar: "حلّل الصدق" },
              description: { en: "Write 3 scenarios where truthfulness is tested.", ar: "اكتب ٣ مواقف يُختبر فيها الصدق." },
              hint: { en: "Include: the scenario, the challenge, the right response, the reward.", ar: "ضمّن: الموقف والتحدّي والاستجابة والثواب." },
            },
          },
          {
            id: "B",
            title: { en: "Trustworthiness", ar: "الأمانة" },
            image: IMG.bookshelf,
            color: "blue",
            topic: { en: "Amanah in all things", ar: "الأمانة في كلّ شيء" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Allah commands you to return trusts to their owners.\' (An-Nisa 58)", ar: "﴿إنّ الله يأمركم أن تؤدّوا الأمانات إلى أهلها﴾ (النساء ٥٨)" } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'Signs of a hypocrite: breaks promises, betrays trust, lies.\' (Bukhari)", ar: "«آية المنافق: يخلف ويخون ويكذب.» (البخاري)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Trust is the foundation of all relationships.", ar: "الأمانة أساس كلّ العلاقات." } },
            ],
            task: {
              title: { en: "Write About Trust", ar: "اكتب عن الأمانة" },
              description: { en: "Explain 3 ways to be trustworthy at school.", ar: "اشرح ٣ طرق للأمانة في المدرسة." },
              hint: { en: "Include: with friends, teachers, belongings, work.", ar: "ضمّن: مع الأصدقاء والمعلّمين والأغراض والعمل." },
            },
          },
          {
            id: "C",
            title: { en: "Humility", ar: "التواضع" },
            image: IMG.grandMosque,
            color: "purple",
            topic: { en: "Tawadu before Allah and people", ar: "التواضع لله وللناس" },
            infoSections: [
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'No one humbles himself for the sake of Allah but Allah raises him.\' (Muslim)", ar: "«ما تواضع أحد لله إلّا رفعه الله.» (مسلم)" } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "The Prophet sat with the poor, mended his own shoes, milked his goat.", ar: "النبيّ جلس مع الفقراء وخصف نعله وحلب شاته." } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "True greatness is in humility, not arrogance.", ar: "العظمة الحقيقيّة في التواضع لا الكبر." } },
            ],
            task: {
              title: { en: "Research Humility Examples", ar: "ابحث عن أمثلة تواضع" },
              description: { en: "List 5 examples of the Prophet\'s humility.", ar: "اذكر ٥ أمثلة لتواضع النبيّ." },
              hint: { en: "Include: the action, the Hadith, the lesson for today.", ar: "ضمّن: العمل والحديث ودرس اليوم." },
            },
          },
          {
            id: "D",
            title: { en: "Forgiveness", ar: "المسامحة" },
            image: IMG.lantern,
            color: "amber",
            topic: { en: "Afw and pardon", ar: "العفو والصفح" },
            infoSections: [
              { label: { en: "Quran", ar: "القرآن" }, content: { en: "\'Let them pardon and overlook. Do you not wish that Allah should forgive you?\' (An-Nur 22)", ar: "﴿وليعفوا وليصفحوا ألا تحبّون أن يغفر الله لكم﴾ (النور ٢٢)" } },
              { label: { en: "Example", ar: "مثال" }, content: { en: "The Prophet forgave the people of Makkah at the Conquest: \'Go, you are free.\'", ar: "النبيّ عفا عن أهل مكّة: «اذهبوا فأنتم الطلقاء.»" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Forgiveness heals hearts and earns Allah\'s forgiveness.", ar: "المسامحة تشفي القلوب وتكسب مغفرة الله." } },
            ],
            task: {
              title: { en: "Write a Forgiveness Story", ar: "اكتب قصّة مسامحة" },
              description: { en: "Write about a time you forgave someone or should have.", ar: "اكتب عن مرّة سامحت أو كان يجب أن تسامح." },
              hint: { en: "Include: what happened, your feelings, the Islamic response.", ar: "ضمّن: ما حدث ومشاعرك والاستجابة الإسلاميّة." },
            },
          },
          {
            id: "E",
            title: { en: "Character at School", ar: "الأخلاق في المدرسة" },
            image: IMG.skyBlue,
            color: "rose",
            topic: { en: "Daily akhlaq", ar: "الأخلاق اليوميّة" },
            infoSections: [
              { label: { en: "Application", ar: "تطبيق" }, content: { en: "Truthfulness with teachers, trustworthiness with homework, humility with classmates, forgiveness with friends.", ar: "الصدق مع المعلّمين والأمانة في الواجبات والتواضع مع الزملاء والمسامحة مع الأصدقاء." } },
              { label: { en: "Hadith", ar: "حديث" }, content: { en: "\'The best of you is the best to his family.\' (Tirmidhi)", ar: "«خيركم خيركم لأهله.» (الترمذي)" } },
              { label: { en: "Moral", ar: "درس" }, content: { en: "Character starts at home and school.", ar: "الأخلاق تبدأ في البيت والمدرسة." } },
            ],
            task: {
              title: { en: "Create a Character Checklist", ar: "أنشئ قائمة أخلاق" },
              description: { en: "Write a daily character checklist for school.", ar: "اكتب قائمة أخلاق يوميّة للمدرسة." },
              hint: { en: "Include: truthfulness, trust, humility, forgiveness, kindness.", ar: "ضمّن: الصدق والأمانة والتواضع والمسامحة واللطف." },
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
            question: { en: "What was the Prophet sent to perfect?", ar: "لماذا بُعث النبيّ؟" },
            options: [
            { en: "Noble character", ar: "مكارم الأخلاق" },
            { en: "Buildings", ar: "المباني" },
            { en: "Weapons", ar: "الأسلحة" },
            { en: "Trade", ar: "التجارة" },
            ],
            correctIndex: 0,
            explanation: { en: "Noble character.", ar: "مكارم الأخلاق." },
          },
          {
            question: { en: "Heaviest on the scale?", ar: "أثقل في الميزان؟" },
            options: [
            { en: "Good character", ar: "حُسن الخُلُق" },
            { en: "Gold", ar: "الذهب" },
            { en: "Food", ar: "الطعام" },
            { en: "Money", ar: "المال" },
            ],
            correctIndex: 0,
            explanation: { en: "Good character.", ar: "حُسن الخُلُق." },
          },
          {
            question: { en: "Al-Qalam 4 says?", ar: "القلم ٤ تقول؟" },
            options: [
            { en: "Great moral character", ar: "خُلُق عظيم" },
            { en: "Weak character", ar: "خُلُق ضعيف" },
            { en: "No character", ar: "لا خُلُق" },
            { en: "Average", ar: "عادي" },
            ],
            correctIndex: 0,
            explanation: { en: "Great moral character.", ar: "خُلُق عظيم." },
          },
          {
            question: { en: "Sidq means?", ar: "الصدق يعني؟" },
            options: [
            { en: "Truthfulness", ar: "الصدق" },
            { en: "Lying", ar: "الكذب" },
            { en: "Speed", ar: "السرعة" },
            { en: "Wealth", ar: "الثروة" },
            ],
            correctIndex: 0,
            explanation: { en: "Truthfulness.", ar: "الصدق." },
          },
          {
            question: { en: "Amanah means?", ar: "الأمانة تعني؟" },
            options: [
            { en: "Trustworthiness", ar: "الأمانة" },
            { en: "Speed", ar: "السرعة" },
            { en: "Wealth", ar: "الثروة" },
            { en: "Power", ar: "القوّة" },
            ],
            correctIndex: 0,
            explanation: { en: "Trustworthiness.", ar: "الأمانة." },
          },
          {
            question: { en: "What did Prophet do at Conquest of Makkah?", ar: "ماذا فعل النبيّ عند فتح مكّة؟" },
            options: [
            { en: "Forgave everyone", ar: "عفا عن الجميع" },
            { en: "Punished all", ar: "عاقب الجميع" },
            { en: "Left", ar: "غادر" },
            { en: "Hid", ar: "اختبأ" },
            ],
            correctIndex: 0,
            explanation: { en: "Forgave: \'Go, you are free.\'", ar: "عفا: «اذهبوا فأنتم الطلقاء.»" },
          },
          {
            question: { en: "Is character separate from worship?", ar: "هل الأخلاق منفصلة عن العبادة؟" },
            options: [
            { en: "No — character IS worship", ar: "لا — الأخلاق عبادة" },
            { en: "Yes", ar: "نعم" },
            { en: "Sometimes", ar: "أحيانًا" },
            { en: "Only for scholars", ar: "للعلماء فقط" },
            ],
            correctIndex: 0,
            explanation: { en: "No — it IS worship.", ar: "لا — هي عبادة." },
          },
          {
            question: { en: "Humility results in?", ar: "التواضع يؤدّي إلى؟" },
            options: [
            { en: "Allah raising you", ar: "الله يرفعك" },
            { en: "Weakness", ar: "الضعف" },
            { en: "Poverty", ar: "الفقر" },
            { en: "Nothing", ar: "لا شيء" },
            ],
            correctIndex: 0,
            explanation: { en: "Allah raises the humble.", ar: "الله يرفع المتواضع." },
          },
          {
            question: { en: "Signs of hypocrite include?", ar: "علامات المنافق تشمل؟" },
            options: [
            { en: "Breaking trust, lying", ar: "الخيانة والكذب" },
            { en: "Praying", ar: "الصلاة" },
            { en: "Fasting", ar: "الصيام" },
            { en: "Charity", ar: "الصدقة" },
            ],
            correctIndex: 0,
            explanation: { en: "Breaks trust and lies.", ar: "الخيانة والكذب." },
          },
          {
            question: { en: "Best to his family?", ar: "خيركم لأهله؟" },
            options: [
            { en: "Best of you", ar: "خيركم" },
            { en: "Worst", ar: "شرّكم" },
            { en: "Average", ar: "عاديّكم" },
            { en: "Smartest", ar: "أذكاكم" },
            ],
            correctIndex: 0,
            explanation: { en: "Best of you is best to family.", ar: "خيركم خيركم لأهله." },
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
        title: { en: "Noble Character", ar: "الأخلاق الحسنة" },
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
        code: "NOBLE001",
      },
      body: { en: "", ar: "" },
    },
    {
      title: { en: "Worksheet — Noble Character Traits", ar: "ورقة عمل — مَكارِمُ الأخلاق" },
      learningObjectives: [
        { en: "Demonstrate understanding through an auto-marked worksheet.", ar: "أظهر فهمي من خلال ورقة عمل تُصحّح تلقائيًّا." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Worksheet.", ar: "ورقة عمل." },
      },
      worksheet: {
        title: { en: "Worksheet — Noble Character Traits", ar: "ورقة عمل — مَكارِمُ الأخلاق" },
        instruction: { en: "Answer all questions. Auto-marked. Cannot re-answer after submission.", ar: "أجب عن جميع الأسئلة. تُصحّح تلقائيًّا. لن تستطيع الإجابة مجدّدًا." },
        sections: [
          {
            type: "mcq" as const,
            title: { en: "Multiple Choice", ar: "اختيار من متعدّد" },
            questions: [
              {
                question: { en: "Prophet sent to?", ar: "النبيّ بُعث ل؟" },
                options: [
                { en: "Perfect character", ar: "إتمام الأخلاق" },
                { en: "Build", ar: "بناء" },
                { en: "Trade", ar: "تجارة" },
                { en: "Fight", ar: "قتال" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Heaviest on scale?", ar: "أثقل في الميزان؟" },
                options: [
                { en: "Good character", ar: "حُسن الخُلُق" },
                { en: "Gold", ar: "الذهب" },
                { en: "Silver", ar: "الفضّة" },
                { en: "Food", ar: "الطعام" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Sidq means?", ar: "الصدق؟" },
                options: [
                { en: "Truth", ar: "الصدق" },
                { en: "Lie", ar: "الكذب" },
                { en: "Speed", ar: "السرعة" },
                { en: "Wealth", ar: "الثروة" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Amanah means?", ar: "الأمانة؟" },
                options: [
                { en: "Trust", ar: "الأمانة" },
                { en: "Betrayal", ar: "الخيانة" },
                { en: "Speed", ar: "السرعة" },
                { en: "Anger", ar: "الغضب" },
                ],
                correctIndex: 0,
              },
              {
                question: { en: "Character is worship?", ar: "الأخلاق عبادة؟" },
                options: [
                { en: "Yes", ar: "نعم" },
                { en: "No", ar: "لا" },
                { en: "Maybe", ar: "ربّما" },
                { en: "Only sometimes", ar: "أحيانًا" },
                ],
                correctIndex: 0,
              },
            ],
          },
          {
            type: "trueFalse" as const,
            title: { en: "True or False", ar: "صواب أم خطأ" },
            questions: [
              { statement: { en: "Character is worship.", ar: "الأخلاق عبادة." }, answer: true },
              { statement: { en: "Only prayer matters.", ar: "الصلاة فقط تهمّ." }, answer: false },
              { statement: { en: "Prophet had best character.", ar: "النبيّ أحسن الناس خُلُقًا." }, answer: true },
              { statement: { en: "Arrogance is praised.", ar: "الكبر ممدوح." }, answer: false },
              { statement: { en: "Truthfulness leads to Paradise.", ar: "الصدق يهدي للجنّة." }, answer: true },
            ],
          },
          {
            type: "matchUp" as const,
            title: { en: "Match Up", ar: "وصّل" },
            prompts: [
              { prompt: { en: "Akhlaq", ar: "أخلاق" }, answer: { en: "Character", ar: "الخُلُق" } },
              { prompt: { en: "Sidq", ar: "صدق" }, answer: { en: "Truthfulness", ar: "الصدق" } },
              { prompt: { en: "Amanah", ar: "أمانة" }, answer: { en: "Trustworthiness", ar: "الأمانة" } },
              { prompt: { en: "Hilm", ar: "حلم" }, answer: { en: "Forbearance", ar: "الحلم" } },
              { prompt: { en: "Tawadu", ar: "تواضع" }, answer: { en: "Humility", ar: "التواضع" } },
            ],
          },
          {
            type: "fillBlanks" as const,
            title: { en: "Fill in the Blanks", ar: "املأ الفراغات" },
            questions: [
              { sentence: { en: "\'Sent to perfect _______ character.\'", ar: "«بُعثت لأتمّم _______ الأخلاق.»" }, blankAnswer: { en: "noble", ar: "مكارم" } },
              { sentence: { en: "Heaviest on scale: good _______.", ar: "أثقل في الميزان: حُسن _______." }, blankAnswer: { en: "character", ar: "الخُلُق" } },
              { sentence: { en: "\'You are of great moral _______.\'", ar: "﴿إنّك لعلى _______ عظيم﴾" }, blankAnswer: { en: "character", ar: "خُلُق" } },
              { sentence: { en: "Truthfulness leads to _______.", ar: "الصدق يهدي إلى _______." }, blankAnswer: { en: "righteousness", ar: "البرّ" } },
            ],
          },
          {
            type: "ordering" as const,
            title: { en: "Put in Correct Order", ar: "رتّب ترتيبًا صحيحًا" },
            items: [
              { en: "Learn the importance of akhlaq", ar: "تعلّم أهمّيّة الأخلاق" },
              { en: "Study the Prophet\'s character traits", ar: "ادرس صفات النبيّ الأخلاقيّة" },
              { en: "Practise truthfulness in word and action", ar: "تدرّب على الصدق قولًا وعملًا" },
              { en: "Develop trustworthiness and humility", ar: "طوّر الأمانة والتواضع" },
              { en: "Forgive others as the Prophet did", ar: "سامح كما سامح النبيّ" },
              { en: "Apply noble character daily at school and home", ar: "طبّق الأخلاق يوميًّا في المدرسة والبيت" },
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
