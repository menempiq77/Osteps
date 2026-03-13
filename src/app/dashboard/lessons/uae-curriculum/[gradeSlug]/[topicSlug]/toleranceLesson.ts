import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";

export const toleranceLesson: CourseLesson = {
  slug: "lesson-grade-10-year-11-tolerance",
  name: { en: "Tolerance", ar: "التسامح" },
  shortIntro: {
    en: "A full Grade 10 Islamic Education lesson on tolerance, covering Qur'anic foundations, Prophetic examples, Islamic history, UAE values, and real-life application.",
    ar: "درس كامل في التربية الإسلامية للصف العاشر عن التسامح، يشمل الأسس القرآنية، والنماذج النبوية، والتاريخ الإسلامي، وقيم دولة الإمارات، والتطبيق في الحياة."
  },
  quranSurahs: [
    "Ali 'Imran 159",
    "Al-A'raf 199",
    "Al-'Ankabut 46",
    "Al-Qasas 77",
    "Al-Anbiya' 107",
    "An-Nahl 125",
    "Al-Mumtahanah 8",
    "Al-An'am 108",
    "Al-Baqarah 109",
    "Yusuf 92",
    "Ali 'Imran 134",
    "Al-Baqarah 256"
  ],
  sections: [
    {
      title: "Critical thinking & Retrieval practice",
      learningObjective:
        "Analyse how Islamic teachings can guide a wise and respectful response to bullying.",
      image: {
        src: "https://images.pexels.com/photos/6936469/pexels-photo-6936469.jpeg?cs=srgb&dl=pexels-rdne-6936469.jpg&fm=jpg",
        alt:
          "Students in school while two boys mock another student, creating a bullying situation that requires a thoughtful response.",
        caption:
          "A school bullying situation that needs a wise response."
      },
      callout: {
        label: "Dilemma",
        title: "A student is being mocked in front of others",
        body:
          "During break time, a group of boys laughs at another student because he looks and speaks differently. Some students want to reply angrily. Others want to stay silent."
      },
      responsePrompt: {
        title: "Post your response",
        prompt:
          "What should a Muslim student do to stop the harm and protect the victim? Recall a time when someone was mocked or excluded. What happened next? Which response helped most?",
        placeholder:
          "I would first...",
        buttonLabel: "Save comment"
      },
      body: {
        en: "",
        ar:
          ""
      }
    },
    {
      title: { en: "Tolerance in Islam", ar: "التسامح في الإسلام" },
      image: {
        src: "https://images.pexels.com/photos/1184572/pexels-photo-1184572.jpeg?cs=srgb&dl=pexels-fauxels-1184572.jpg&fm=jpg",
        alt: "A diverse group working together respectfully around a table, showing cooperation and positive interaction.",
        caption: "Tolerance in Islam supports respectful cooperation and peaceful coexistence."
      },
      learningObjectives: [
        "Explain the concept of tolerance in Islam using key ideas from the lesson.",
        "Analyse how mercy, forgiveness, kind dialogue, and doing good help build a tolerant society."
      ],
      successCriteria: [
        "I can define tolerance in Islam using at least two accurate key ideas.",
        "I can identify how one Islamic value such as mercy or forgiveness supports tolerance.",
        "I can compare a tolerant response with a harsh response and justify which one matches Islamic teaching."
      ],
      body: {
        en: "",
        ar: ""
      }
    },
    {
      title: { en: "Verse and Hadith", ar: "آية وحديث" },
      infoBoxes: [
        {
          label: "Qur'an",
          lines: [
            "Arabic:\nخُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ",
            "English:\n\"Hold to forgiveness; command what is right; but turn away from the ignorant.\" (Al-A'raf 199)",
            "Transliteration:\nKhudhi al-'afwa wa'mur bil-'urfi wa a'rid 'ani al-jahilin."
          ]
        },
        {
          label: "Hadith",
          lines: [
            "Arabic:\nرَحِمَ اللَّهُ رَجُلًا سَمْحًا إِذَا بَاعَ وَإِذَا اشْتَرَى وَإِذَا اقْتَضَى",
            "English:\n\"May Allah have mercy on a man who is tolerant and easygoing when he sells, when he buys, and when he asks for his due.\""
          ]
        }
      ],
      matchingActivity: {
        title: "Match up",
        instruction: "Match each phrase to the idea it teaches.",
        prompts: [
          {
            prompt: "Hold to forgiveness",
            answer: "Choose pardon instead of reacting with anger."
          },
          {
            prompt: "Command what is right",
            answer: "Encourage good behaviour and guide others wisely."
          },
          {
            prompt: "Turn away from the ignorant",
            answer: "Do not continue arguments with harsh or foolish people."
          },
          {
            prompt: "Be easygoing in buying and selling",
            answer: "Show fairness, patience, and kindness in daily dealings."
          }
        ]
      },
      body: {
        en: "",
        ar: ""
      }
    },
    {
      title: { en: "Part 4: Reflect and deduce from the Qur'an", ar: "الجزء 4: أتأمل وأستدل من القرآن" },
      body: {
        en:
          "Infer tolerance from these verses:\n\n" +
          "1. \"Invite to the way of your Lord with wisdom and good instruction, and argue with them in the best manner.\" (An-Nahl 125)\n" +
          "This teaches wisdom, respectful dialogue, and persuasive preaching without harshness.\n\n" +
          "2. \"Allah does not forbid you from dealing kindly and justly with those who do not fight you because of religion or drive you from your homes. Indeed, Allah loves those who are just.\" (Al-Mumtahanah 8)\n" +
          "This teaches kindness, justice, and fair dealing with peaceful people of other faiths.",
        ar:
          "يستدل على التسامح من الآيتين الآتيتين:\n\n" +
          "1. ﴿ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ﴾ [النحل: 125].\n" +
          "وتدل على الحكمة، وحسن الدعوة، والحوار الراقي، وترك الشدة في المخاطبة.\n\n" +
          "2. ﴿لَا يَنْهَاكُمُ اللَّهُ عَنِ الَّذِينَ لَمْ يُقَاتِلُوكُمْ فِي الدِّينِ... أَن تَبَرُّوهُمْ وَتُقْسِطُوا إِلَيْهِمْ﴾ [الممتحنة: 8].\n" +
          "وتدل على البر، والعدل، وحسن المعاملة مع غير المسلمين المسالمين."
      }
    },
    {
      title: { en: "Part 5: The Prophet ﷺ as the highest model of tolerance", ar: "الجزء 5: النبي ﷺ القدوة العليا في التسامح" },
      body: {
        en:
          "The Prophet ﷺ was the greatest example of tolerance toward Muslims and non-Muslims alike. Sayyidah Aishah said: \"He was not obscene, he did not shout in the markets, and he did not respond to evil with evil, but rather he pardoned and forgave.\" (At-Tirmidhi)\n\n" +
          "The Charter of Madinah was one of his earliest actions after migration. It organised relations between the Muhajirin, the Ansar, and non-Muslims, protected rights, and established justice and coexistence.\n\n" +
          "The lesson also highlights his treatment of the prisoners of Badr. He treated them generously and accepted teaching Muslim children to read and write as ransom for literate captives. This shows exceptional tolerance, wisdom, and care for knowledge.",
        ar:
          "كان النبي ﷺ أعظم نموذج للتسامح مع المسلمين وغير المسلمين. وقد وصفت السيدة عائشة رضي الله عنها خلقه فقالت: «لم يكن فاحشاً ولا صخاباً في الأسواق، ولا يجزي بالسيئة السيئة، ولكن يعفو ويصفح».\n\n" +
          "ومن أوائل أعماله بعد الهجرة إلى المدينة كتابة صحيفة المدينة التي نظمت العلاقة بين المهاجرين والأنصار وغير المسلمين، وحفظت الحقوق، وأرست مبادئ العدل والتعايش.\n\n" +
          "كما يبرز الدرس معاملته لأسرى بدر، فقد عاملهم بكرم، وجعل فداء بعض الأسرى المتعلمين تعليم أبناء المسلمين القراءة والكتابة. وهذا يدل على تسامح عظيم، وحكمة، واهتمام بالعلم."
      }
    },
    {
      title: { en: "Part 6: Respect for human dignity and followers of other religions", ar: "الجزء 6: كرامة الإنسان والتعامل مع أتباع الديانات الأخرى" },
      body: {
        en:
          "A funeral once passed by the Prophet ﷺ, and he stood up. When it was said to him, \"It is the funeral of a Jew,\" he replied, \"Is he not a soul?\" (Al-Bukhari)\n\n" +
          "This hadith teaches respect for human dignity, compassion, justice, and acknowledgment of the value of every human being.\n\n" +
          "The Charter of Madinah had nearly 52 articles, and 27 of them addressed relations between Muslims and followers of other religions. Students are also invited to reflect on the story of the man who used to throw garbage in the Prophet's path and the values of patience, mercy, and noble character.",
        ar:
          "مرّت جنازة على النبي ﷺ فقام لها، فقيل له: إنها جنازة يهودي، فقال: «أليست نفساً؟» [البخاري].\n\n" +
          "ويعلمنا هذا الحديث احترام كرامة الإنسان، والرحمة، والعدل، والاعتراف بقيمة النفس البشرية.\n\n" +
          "وقد اشتملت صحيفة المدينة على نحو 52 مادة، كان منها 27 مادة تتعلق بالعلاقة بين المسلمين وأتباع الديانات الأخرى. كما يدعو الدرس إلى البحث في قصة الرجل الذي كان يلقي القمامة في طريق النبي ﷺ وما فيها من صبر ورحمة وسمو أخلاق."
      }
    },
    {
      title: { en: "Part 7: Examples from Islamic history and responding to false claims", ar: "الجزء 7: نماذج من التاريخ الإسلامي والرد على الشبهات" },
      body: {
        en:
          "Islamic history gives clear examples of tolerance:\n\n" +
          "- Umar ibn Al-Khattab assured the people of Jerusalem safety for themselves, their property, and their churches, and guaranteed freedom of religion.\n" +
          "- Amr ibn Al-'As assured safety for the people of Egypt and their churches, and the Copts welcomed Islamic rule because of justice, tolerance, and mercy.\n\n" +
          "These examples are a logical response to claims that Islam is a religion of violence and inflexibility. The historical record shows coexistence, justice, and protection of rights.",
        ar:
          "يعرض التاريخ الإسلامي نماذج واضحة في التسامح:\n\n" +
          "- أمّن عمر بن الخطاب أهل القدس على أنفسهم وأموالهم وكنائسهم، وضمن لهم حرية الدين.\n" +
          "- وأمّن عمرو بن العاص أهل مصر وكنائسهم، ورحب الأقباط بالحكم الإسلامي لما وجدوا فيه من عدل وتسامح ورحمة.\n\n" +
          "وهذه النماذج تمثل رداً منطقياً على من يتهم الإسلام بالعنف والجمود، لأن الوقائع التاريخية تدل على التعايش، والعدل، وصيانة الحقوق."
      }
    },
    {
      title: { en: "Part 8: Values of tolerance in life", ar: "الجزء 8: قيم التسامح في حياتنا" },
      body: {
        en:
          "The lesson focuses on two major values:\n\n" +
          "1. Respecting others: regardless of religion, colour, or race. Allah says: \"Do not insult those they invoke besides Allah...\" (Al-An'am 108)\n" +
          "2. Forgiving insults: Allah says: \"Hold to forgiveness...\" (Al-A'raf 199) and \"So pardon and overlook...\" (Al-Baqarah 109)\n\n" +
          "The conquest of Makkah is a powerful model. The Prophet ﷺ forgave those who harmed him and said: \"No blame upon you today. Allah will forgive you.\" (Yusuf 92)\n\n" +
          "Students are asked to explain how tolerance appears with the teacher, the father, the non-Muslim neighbour, and the non-Muslim cleaner, and to distinguish between forgiveness and pardon.",
        ar:
          "يركز الدرس على قيمتين أساسيتين:\n\n" +
          "1. احترام الآخرين: مهما اختلف الدين أو اللون أو العرق. قال الله تعالى: ﴿وَلَا تَسُبُّوا الَّذِينَ يَدْعُونَ مِن دُونِ اللَّهِ﴾ [الأنعام: 108].\n" +
          "2. العفو عن الإساءة: قال الله تعالى: ﴿خُذِ الْعَفْوَ﴾ [الأعراف: 199]، وقال أيضاً: ﴿فَاعْفُوا وَاصْفَحُوا﴾ [البقرة: 109].\n\n" +
          "ويظهر فتح مكة مثالاً عظيماً، إذ عفا النبي ﷺ عمن آذوه وقال: ﴿لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ﴾ [يوسف: 92].\n\n" +
          "ويطلب من الطالب أن يبين كيف يمارس التسامح مع المعلم، والأب، والجار غير المسلم، والعامل غير المسلم، وأن يميز بين معنى العفو والصفح."
      }
    },
    {
      title: { en: "Part 9: The UAE, the importance of tolerance, and the harm of violence", ar: "الجزء 9: الإمارات وأهمية التسامح وأثر العنف" },
      body: {
        en:
          "The United Arab Emirates is committed to tolerance and rejects violence in internal life and international relations.\n\n" +
          "Tolerance is a cause of Paradise. Allah says: \"Those who restrain anger and pardon people - Allah loves the doers of good.\" (Ali 'Imran 134)\n\n" +
          "Tolerance purifies the heart, spreads peace, strengthens society, and creates security. Students reflect on its positive outcomes between colleagues, father and son, teacher and students, and Muslim and non-Muslim neighbours.\n\n" +
          "Violence, by contrast, harms the individual and society: it spreads anger, hatred, fear, broken trust, and division.\n\n" +
          "The lesson also connects this value to the words of Sheikh Zayed: \"The greatest advice I give to my sons is to avoid arrogance...\"",
        ar:
          "تلتزم دولة الإمارات العربية المتحدة بمبدأ التسامح وترفض العنف في ممارساتها الداخلية وعلاقاتها الخارجية.\n\n" +
          "والتسامح سبب من أسباب دخول الجنة، قال الله تعالى: ﴿وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ﴾ [آل عمران: 134].\n\n" +
          "والتسامح يطهر القلب، وينشر السلام، ويقوي المجتمع، ويحقق الأمن. ويتأمل الطالب آثاره الإيجابية بين الزملاء، والأب والابن، والمعلم والطلاب، والمسلم وجاره غير المسلم.\n\n" +
          "أما العنف فيضر الفرد والمجتمع، وينشر الغضب والكراهية والخوف، ويهدم الثقة ويمزق الوحدة.\n\n" +
          "كما يربط الدرس هذه القيمة بكلام الشيخ زايد رحمه الله: «أهم نصيحة أقدمها لأبنائي أن يتجنبوا الغرور...»"
      }
    },
    {
      title: { en: "Part 10: Tolerance-enhancing methods and student activities", ar: "الجزء 10: وسائل تنمية التسامح وأنشطة الطالب" },
      body: {
        en:
          "Tolerance can be strengthened through:\n" +
          "1. Controlling anger and rashness.\n" +
          "2. Keeping good company.\n" +
          "3. Remembering accountability before Allah.\n" +
          "4. Studying the biography of the Prophet ﷺ and righteous people.\n\n" +
          "Student activities:\n" +
          "- How would you act if a friend wronged you?\n" +
          "- How would you act if a non-Muslim student asked for help?\n" +
          "- What happens if everyone practices tolerance?\n" +
          "- Reflect on: \"There is no compulsion in religion.\" (Al-Baqarah 256)\n" +
          "- Write a dialogue titled \"Forgive Those Who Abuse You.\"\n" +
          "- Prepare a bulletin board about tolerance in Islam.\n" +
          "- Use the self-assessment checklist: greeting others, respecting non-Muslims, forgiving insults, helping others, apologising, and kind treatment.",
        ar:
          "تتنمى قيمة التسامح من خلال:\n" +
          "1. التحكم في الغضب وترك التسرع.\n" +
          "2. اختيار الصحبة الصالحة.\n" +
          "3. تذكر الحساب أمام الله تعالى.\n" +
          "4. دراسة سيرة النبي ﷺ والصالحين.\n\n" +
          "أنشطة الطالب:\n" +
          "- كيف تتصرف إذا أخطأ صديقك في حقك؟\n" +
          "- كيف تتصرف إذا طلب منك زميل غير مسلم المساعدة؟\n" +
          "- ماذا يحدث إذا مارس الجميع التسامح؟\n" +
          "- تأمل قوله تعالى: ﴿لَا إِكْرَاهَ فِي الدِّينِ﴾ [البقرة: 256].\n" +
          "- اكتب حواراً بعنوان: «اعفُ عمن أساء إليك».\n" +
          "- أعد لوحة أو وسيلة عن مظاهر التسامح في الإسلام.\n" +
          "- طبق بطاقة التقويم الذاتي: إلقاء السلام، احترام غير المسلمين، العفو، المساعدة، الاعتذار، وحسن المعاملة."
      }
    }
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the best definition of tolerance in Islam?", ar: "ما أفضل تعريف للتسامح في الإسلام؟" },
      options: [
        { en: "Silence in every disagreement", ar: "الصمت في كل اختلاف" },
        { en: "Mercy, justice, gentleness, and no compulsion", ar: "الرحمة والعدل واللين وعدم الإكراه" },
        { en: "Accepting all wrong actions", ar: "قبول كل السلوكيات الخاطئة" },
        { en: "Weakness in front of others", ar: "الضعف أمام الآخرين" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The lesson defines tolerance through mercy, justice, leniency, and rejection of compulsion and violence.",
        ar: "يعرف الدرس التسامح بالرحمة والعدل واللين ورفض الإكراه والعنف."
      }
    },
    {
      prompt: { en: "Which Quranic value is shown in Al-'Ankabut 46?", ar: "ما القيمة التي تدل عليها آية العنكبوت 46؟" },
      options: [
        { en: "Harsh debate", ar: "الجدال القاسي" },
        { en: "Kind dialogue", ar: "الحوار الحسن" },
        { en: "Avoiding all conversation", ar: "ترك كل حوار" },
        { en: "Punishing disagreement", ar: "معاقبة المخالف" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The verse commands disputation in the best manner.",
        ar: "لأن الآية تأمر بالمجادلة بالتي هي أحسن."
      }
    },
    {
      prompt: { en: "What did the Prophet ﷺ show in his treatment of the prisoners of Badr?", ar: "ماذا أظهر النبي ﷺ في تعامله مع أسرى بدر؟" },
      options: [
        { en: "Revenge", ar: "الانتقام" },
        { en: "Generosity and tolerance", ar: "الكرم والتسامح" },
        { en: "Neglect", ar: "الإهمال" },
        { en: "Compulsion", ar: "الإكراه" }
      ],
      correctIndex: 1,
      explanation: {
        en: "He treated them generously and used ransom in a wise and beneficial way.",
        ar: "عاملهم بكرم، وجعل الفداء وسيلة نافعة وحكيمة."
      }
    },
    {
      prompt: { en: "What value is learned from the hadith 'Is he not a soul?'", ar: "ما القيمة المستفادة من حديث «أليست نفساً؟»؟" },
      options: [
        { en: "Mocking difference", ar: "السخرية من الاختلاف" },
        { en: "Respect for human dignity", ar: "احترام كرامة الإنسان" },
        { en: "Separation from all people", ar: "الابتعاد عن الناس جميعاً" },
        { en: "Political power only", ar: "القوة السياسية فقط" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The hadith confirms the dignity and worth of every human soul.",
        ar: "يؤكد الحديث كرامة النفس الإنسانية وقيمتها."
      }
    },
    {
      prompt: { en: "Which two major values does the lesson focus on?", ar: "ما القيمتان الأساسيتان اللتان يركز عليهما الدرس؟" },
      options: [
        { en: "Competition and argument", ar: "التنافس والجدال" },
        { en: "Respecting others and forgiving insults", ar: "احترام الآخرين والعفو عن الإساءة" },
        { en: "Isolation and silence", ar: "العزلة والصمت" },
        { en: "Victory and control", ar: "الانتصار والسيطرة" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The lesson explicitly highlights respect and forgiveness as central values of tolerance.",
        ar: "أكد الدرس صراحة أن احترام الآخرين والعفو عن الإساءة من قيم التسامح الأساسية."
      }
    },
    {
      prompt: { en: "How did Umar ibn Al-Khattab deal with the people of Jerusalem?", ar: "كيف تعامل عمر بن الخطاب مع أهل القدس؟" },
      options: [
        { en: "He forced them to change religion", ar: "أجبرهم على تغيير الدين" },
        { en: "He guaranteed safety for them, their property, and their churches", ar: "ضمن لهم الأمان على أنفسهم وأموالهم وكنائسهم" },
        { en: "He removed their rights", ar: "سلبهم حقوقهم" },
        { en: "He prevented coexistence", ar: "منع التعايش" }
      ],
      correctIndex: 1,
      explanation: {
        en: "This is one of the historical examples of Islamic tolerance in leadership.",
        ar: "وهذا من النماذج التاريخية الواضحة للتسامح في القيادة الإسلامية."
      }
    },
    {
      prompt: { en: "What is one positive result of tolerance in society?", ar: "ما إحدى النتائج الإيجابية للتسامح في المجتمع؟" },
      options: [
        { en: "Spreading fear", ar: "نشر الخوف" },
        { en: "Strengthening peace and trust", ar: "تقوية السلام والثقة" },
        { en: "Increasing division", ar: "زيادة الانقسام" },
        { en: "Weakening relationships", ar: "إضعاف العلاقات" }
      ],
      correctIndex: 1,
      explanation: {
        en: "The lesson links tolerance to peace, security, affection, and social cohesion.",
        ar: "يربط الدرس التسامح بالسلام والأمن والمودة والتماسك الاجتماعي."
      }
    },
    {
      prompt: { en: "Which behaviour clearly opposes tolerance?", ar: "أي سلوك يعارض التسامح بوضوح؟" },
      options: [
        { en: "Helping a non-Muslim student", ar: "مساعدة زميل غير مسلم" },
        { en: "Pardoning someone who hurt you", ar: "العفو عمن أساء إليك" },
        { en: "Insulting what others hold sacred", ar: "سب ما يقدسه الآخرون" },
        { en: "Respectful disagreement", ar: "الاختلاف باحترام" }
      ],
      correctIndex: 2,
      explanation: {
        en: "The lesson cites Al-An'am 108 to forbid insulting others' sacred beliefs.",
        ar: "استدل الدرس بآية الأنعام 108 على تحريم سب مقدسات الآخرين."
      }
    },
    {
      prompt: { en: "Which method helps develop tolerance?", ar: "أي وسيلة تساعد على تنمية التسامح؟" },
      options: [
        { en: "Rash anger", ar: "التسرع والغضب" },
        { en: "Keeping good company", ar: "اختيار الصحبة الصالحة" },
        { en: "Ignoring accountability", ar: "نسيان الحساب" },
        { en: "Learning violence", ar: "تعلم العنف" }
      ],
      correctIndex: 1,
      explanation: {
        en: "Good company is one of the tolerance-enhancing methods named in the lesson.",
        ar: "الصحبة الصالحة من وسائل تنمية التسامح المذكورة في الدرس."
      }
    },
    {
      prompt: { en: "Which verse directly shows freedom of belief?", ar: "أي آية تدل مباشرة على حرية الاعتقاد؟" },
      options: [
        { en: "Al-Baqarah 256", ar: "البقرة 256" },
        { en: "Yusuf 92", ar: "يوسف 92" },
        { en: "Ali 'Imran 159", ar: "آل عمران 159" },
        { en: "Az-Zukhruf 67", ar: "الزخرف 67" }
      ],
      correctIndex: 0,
      explanation: {
        en: "\"There is no compulsion in religion\" is one of the clearest principles linked to tolerance.",
        ar: "تعد آية «لا إكراه في الدين» من أوضح الأصول المرتبطة بالتسامح."
      }
    }
  ]
};
