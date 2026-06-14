import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const sanctityOfMuslim: CourseLesson = {
  slug: "g6y7-the-sanctity-of-a-muslim",
  name: { en: "The Sanctity of a Muslim", ar: "حُرْمَةُ المُسْلِمِ" },
  shortIntro: {
    en: "Islam protects every person's life, honour, and property. We study the sacred rights Muslims owe one another.",
    ar: "يَحفَظُ الإسلامُ دَمَ كُلِّ إنسانٍ وعِرضَهُ ومالَه. نَدرُسُ الحُقوقَ المُقَدَّسةَ بَينَ المُسلِمين.",
  },
  quranSurahs: ["Al-Hujurat 11-12", "Al-Isra 33"],
  sections: [
    {
      title: { en: "Every person is honoured", ar: "كُلُّ إنسانٍ مُكَرَّم" },
      learningObjectives: [
        { en: "State what 'the sanctity (hurmah) of a Muslim' protects.", ar: "أُبَيِّنُ ما الذي تَحفَظُهُ «حُرمةُ المُسلِم»." },
        { en: "List the three things made sacred in the Farewell Sermon.", ar: "أُعَدِّدُ الأشياءَ الثَّلاثةَ التي حُرِّمَت في خُطبةِ الوَداع." },
      ],
      successCriteria: [
        { en: "I can explain why harming a Muslim's honour is a serious sin.", ar: "أشرَحُ لِماذا الاعتِداءُ على عِرضِ المُسلِمِ إثمٌ كَبير." },
        { en: "I can give modern examples of protecting people's dignity.", ar: "أُعطي أمثِلةً مُعاصِرةً لِحِفظِ كَرامةِ النّاس." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque, a place of brotherhood.", ar: "مَسجِدٌ، مَكانُ الأُخُوّة." },
        caption: { en: "Islam makes a believer's life, honour, and wealth sacred.", ar: "يَجعَلُ الإسلامُ دَمَ المُؤمِنِ وعِرضَهُ ومالَهُ حَرامًا." },
      },
      callout: {
        label: { en: "Think", ar: "فَكِّر" },
        title: { en: "Words can wound", ar: "الكَلِماتُ قد تَجرَح" },
        body: {
          en: "We know hitting someone is wrong. But mocking, spreading rumours, and exposing people's faults online also break their sanctity. Why does Islam treat honour as seriously as physical safety?",
          ar: "نَعلَمُ أنَّ الضَّربَ خَطأ. لكِنَّ السُّخريةَ، ونَشرَ الإشاعات، وفَضحَ عُيوبِ النّاسِ عَبرَ الإنتِرنِت تَنتَهِكُ حُرمَتَهُم أيضًا. لِماذا يَتَعامَلُ الإسلامُ مَعَ العِرضِ بِجِدّيّةِ السَّلامةِ الجَسَديّة؟",
        },
      },
      body: {
        en: "Allah honoured the children of Adam. Islam protects this dignity by making certain things sacred (hurumat): a person's life, honour (dignity and reputation), and property. To violate them without right is a grave sin. The 'sanctity of a Muslim' means we are obliged to protect, not harm, one another's body, name, and wealth — in person and online.",
        ar: "كَرَّمَ اللهُ بَني آدَم. ويَحفَظُ الإسلامُ هذهِ الكَرامةَ بِجَعلِ أشياءَ حُرُماتٍ مُقَدَّسة: دَمُ الإنسانِ وعِرضُهُ ومالُه. والاعتِداءُ عَلَيها بِغَيرِ حَقٍّ إثمٌ عَظيم. و«حُرمةُ المُسلِم» تَعني أنَّنا مُلزَمونَ بِحِفظِ بَدَنِ بَعضِنا واسمِهِ ومالِهِ لا الاعتِداءِ عَلَيها — حُضورًا وعَبرَ الإنتِرنِت.",
      },
    },
    {
      title: { en: "The Farewell Sermon", ar: "خُطبةُ الوَداع" },
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Arafat-like plains where the sermon was given.", ar: "سُهولٌ كَعَرَفةَ حَيثُ أُلقِيَتِ الخُطبة." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "\"Indeed, your blood, your property, and your honour are sacred to one another, like the sanctity of this day, in this month, in this land.\" (Bukhari & Muslim)", ar: "«إنَّ دِماءَكُم وأموالَكُم وأعراضَكُم بَينَكُم حَرامٌ كَحُرمةِ يَومِكُم هذا في شَهرِكُم هذا في بَلَدِكُم هذا». (متفق عليه)" },
          ],
        },
      ],
      body: {
        en: "In his Farewell Sermon before over a hundred thousand pilgrims, the Prophet ﷺ declared the three sacred rights: blood (life), property (wealth), and honour (dignity). He compared their sacredness to the most sacred day, month, and place. This was the Prophet's lasting charter of human rights for the Muslim community — and a standard the world only formalised many centuries later.",
        ar: "في خُطبةِ الوَداعِ أمامَ أكثَرَ مِن مِئةِ ألفِ حاجّ، أعلَنَ النَّبِيُّ ﷺ الحُقوقَ الثَّلاثةَ المُقَدَّسة: الدَّمَ (الحَياة)، والمالَ، والعِرض. وشَبَّهَ حُرمَتَها بِأقدَسِ يَومٍ وشَهرٍ ومَكان. وكانَت هذهِ ميثاقَ النَّبِيِّ ﷺ الباقي لِحُقوقِ الإنسانِ في الأُمّة — معيارًا لم يُقَنِّنْهُ العالَمُ إلّا بعدَ قُرونٍ طَويلة.",
      },
    },
    {
      title: { en: "The Qur'an forbids mockery and backbiting", ar: "القُرآنُ يُحَرِّمُ السُّخريةَ والغيبة" },
      image: {
        src: IMG.childQuran,
        alt: { en: "Reading the verses of Al-Hujurat.", ar: "قِراءةُ آياتِ الحُجُرات." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"O you who believe! Let not a people ridicule another people... and do not insult one another and do not call each other by offensive nicknames...\" — Al-Hujurat 11", ar: "﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ... وَلَا تَلْمِزُوا أَنفُسَكُمْ وَلَا تَنَابَزُوا بِالْأَلْقَابِ...﴾ — الحجرات ١١" },
            { en: "\"...And do not spy or backbite one another. Would one of you like to eat the flesh of his dead brother? You would detest it...\" — Al-Hujurat 12", ar: "﴿...وَلَا تَجَسَّسُوا وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ...﴾ — الحجرات ١٢" },
          ],
        },
      ],
      body: {
        en: "Surat Al-Hujurat protects honour with precise commands: no mockery, no insulting names, no suspicion, no spying, no backbiting. Allah compares backbiting to eating the flesh of a dead brother — a powerful image of how ugly it is to speak ill of an absent person. These verses are a complete code for social media too: do not screenshot, expose, or ridicule others.",
        ar: "تَحفَظُ سورةُ الحُجُراتِ العِرضَ بِأوامِرَ دَقيقة: لا سُخريةَ، ولا ألقابَ سَيِّئة، ولا سوءَ ظَنّ، ولا تَجَسُّس، ولا غيبة. ويُشَبِّهُ اللهُ الغيبةَ بِأكلِ لَحمِ الأخِ المَيِّت — صورةٌ قَوِيّةٌ على بَشاعةِ الكَلامِ في الغائِب. وهذهِ الآياتُ دُستورٌ كامِلٌ لِمَواقِعِ التَّواصُلِ أيضًا: لا تُصَوِّرْ ولا تَفضَحْ ولا تَسخَرْ مِنَ الآخَرين.",
      },
    },
    {
      title: { en: "Rights of a Muslim upon a Muslim", ar: "حُقوقُ المُسلِمِ على المُسلِم" },
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern of mutual care.", ar: "فانوسُ الرِّعايةِ المُتَبادَلة." },
      },
      callout: {
        label: { en: "Apply", ar: "طَبِّق" },
        title: { en: "A rumour in the group chat", ar: "إشاعةٌ في مَجموعةِ الدَّردَشة" },
        body: {
          en: "Someone forwards an embarrassing claim about a classmate to your group chat. Using today's evidences, what is the right Islamic response, and what sanctities are at stake?",
          ar: "يُرسِلُ أحَدُهُم ادِّعاءً مُحرِجًا عن زَميلٍ إلى مَجموعَتِكُم. باستِخدامِ أدِلّةِ اليَوم، ما الرَّدُّ الإسلامِيُّ الصَّحيح، وما الحُرُماتُ المُعَرَّضةُ للخَطَر؟",
        },
      },
      responsePrompt: {
        title: { en: "Your decision", ar: "قَرارُك" },
        prompt: {
          en: "Write what you would do and the evidence behind your choice.",
          ar: "اكتُبْ ما سَتَفعَلُهُ والدَّليلَ على اختيارِك.",
        },
        placeholder: { en: "I would not forward it because...", ar: "لن أُعيدَ إرسالَهُ لأنَّ..." },
        buttonLabel: { en: "Save response", ar: "احفَظِ الإجابة" },
      },
      body: {
        en: "The Prophet ﷺ listed rights between Muslims: return the greeting of peace, visit the sick, follow funerals, accept invitations, and give sincere advice. He also said: 'The Muslim is the one from whose tongue and hand other Muslims are safe.' So sanctity is not only avoiding harm; it is active care. Defending an absent person's honour, and refusing to spread harmful content, are part of preserving their hurmah.",
        ar: "عَدَّدَ النَّبِيُّ ﷺ حُقوقًا بَينَ المُسلِمين: رَدَّ السَّلام، وعِيادةَ المَريض، واتِّباعَ الجَنائِز، وإجابةَ الدَّعوة، والنُّصحَ. وقال أيضًا: «المُسلِمُ مَن سَلِمَ المُسلِمونَ مِن لِسانِهِ ويَدِه». فالحُرمةُ ليسَت تَجَنُّبَ الأذى فَقَط، بل رِعايةٌ فاعِلة. والدِّفاعُ عن عِرضِ الغائِب، ورَفضُ نَشرِ المُحتوى المُؤذي، جُزءٌ مِن حِفظِ حُرمَتِه.",
      },
    },
    {
      title: { en: "A society built on trust", ar: "مُجتَمَعٌ قائِمٌ على الثِّقة" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A peaceful community.", ar: "مُجتَمَعٌ آمِن." },
      },
      body: {
        en: "When people honour each other's lives, dignity, and property, society becomes safe and trusting. When sanctities are violated — through violence, slander, fraud, or online abuse — fear and division spread. By protecting the hurmah of every person, a Muslim builds the kind of community Islam came to establish: secure, merciful, and just. Guard your tongue, your hands, and your screen.",
        ar: "حينَ يَحفَظُ النّاسُ دِماءَ بَعضِهِم وكَرامَتَهُم وأموالَهُم يُصبِحُ المُجتَمَعُ آمِنًا واثِقًا. وحينَ تُنتَهَكُ الحُرُماتُ — بالعُنفِ أوِ القَذفِ أوِ الغِشِّ أوِ الإساءةِ الإلكترونيّة — يَنتَشِرُ الخَوفُ والانقِسام. وبِحِفظِ حُرمةِ كُلِّ إنسانٍ يَبني المُسلِمُ المُجتَمَعَ الذي جاءَ الإسلامُ لِيُقيمَه: آمِنًا رَحيمًا عادِلًا. فاحفَظْ لِسانَكَ ويَدَكَ وشاشَتَك.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Which three things did the Prophet ﷺ declare sacred in the Farewell Sermon?", ar: "ما الأشياءُ الثَّلاثةُ التي حَرَّمَها النَّبِيُّ ﷺ في خُطبةِ الوَداع؟" },
      options: [
        { en: "Blood (life), property, and honour", ar: "الدَّمُ (الحَياة)، والمال، والعِرض" },
        { en: "Land, gold, and water", ar: "الأرضُ والذَّهَبُ والماء" },
        { en: "Sleep, food, and travel", ar: "النَّومُ والطَّعامُ والسَّفَر" },
      ],
      correctIndex: 0,
      explanation: { en: "Life, property, and honour are sacred among Muslims.", ar: "الدَّمُ والمالُ والعِرضُ حَرامٌ بَينَ المُسلِمين." },
    },
    {
      prompt: { en: "What does Al-Hujurat compare backbiting to?", ar: "بِماذا تُشَبِّهُ سورةُ الحُجُراتِ الغيبة؟" },
      options: [
        { en: "Eating the flesh of one's dead brother", ar: "أكلِ لَحمِ الأخِ المَيِّت" },
        { en: "A small joke", ar: "مِزاحٍ صَغير" },
        { en: "A reward", ar: "أجرٍ وثَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "The Qur'an likens backbiting to eating a dead brother's flesh.", ar: "يُشَبِّهُ القُرآنُ الغيبةَ بِأكلِ لَحمِ الأخِ المَيِّت." },
    },
    {
      prompt: { en: "Which acts does Al-Hujurat 11-12 forbid?", ar: "ما الأفعالُ التي تَنهى عَنها الحُجُراتُ ١١-١٢؟" },
      options: [
        { en: "Mockery, insulting names, suspicion, spying, backbiting", ar: "السُّخرية، والألقاب، وسوءَ الظَّنّ، والتَّجَسُّس، والغيبة" },
        { en: "Prayer and charity", ar: "الصَّلاةَ والصَّدَقة" },
        { en: "Trade and travel", ar: "التِّجارةَ والسَّفَر" },
      ],
      correctIndex: 0,
      explanation: { en: "These verses ban all forms of dishonouring others.", ar: "تَنهى هذهِ الآياتُ عن كُلِّ صُوَرِ الإساءةِ للآخَرين." },
    },
    {
      prompt: { en: "'The Muslim is the one from whose ___ and ___ others are safe.'", ar: "«المُسلِمُ مَن سَلِمَ المُسلِمونَ مِن ___ و___ه.»" },
      options: [
        { en: "Tongue and hand", ar: "لِسانِهِ ويَدِه" },
        { en: "Money and house", ar: "مالِهِ وبَيتِه" },
        { en: "Car and phone", ar: "سَيّارَتِهِ وهاتِفِه" },
      ],
      correctIndex: 0,
      explanation: { en: "Safety from one's tongue and hand defines a true Muslim.", ar: "السَّلامةُ مِنَ اللِّسانِ واليَدِ تُعَرِّفُ المُسلِمَ الحَقّ." },
    },
    {
      prompt: { en: "Does the sanctity of a Muslim apply to online behaviour?", ar: "هل تَنطَبِقُ حُرمةُ المُسلِمِ على السُّلوكِ الإلكتروني؟" },
      options: [
        { en: "Yes — exposing, mocking, or slandering online violates it too", ar: "نَعَم — الفَضحُ والسُّخريةُ والقَذفُ إلكترونيًّا يَنتَهِكُها أيضًا" },
        { en: "No, only in person", ar: "لا، حُضوريًّا فَقَط" },
        { en: "Only on phones", ar: "على الهَواتِفِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Honour is protected everywhere, including social media.", ar: "العِرضُ مَحفوظٌ في كُلِّ مَكانٍ ومِنهُ وسائِلُ التَّواصُل." },
    },
    {
      prompt: { en: "True or False: Protecting sanctity means only avoiding harm, not active care.", ar: "صَوابٌ أم خَطأ: حِفظُ الحُرمةِ تَجَنُّبُ الأذى فَقَط لا الرِّعايةُ الفاعِلة." },
      options: [
        { en: "False — it includes defending honour and helping one another", ar: "خَطأ — يَشمَلُ الدِّفاعَ عنِ العِرضِ والتَّعاوُن" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Sanctity includes positive duties like visiting the sick and giving advice.", ar: "الحُرمةُ تَشمَلُ واجِباتٍ إيجابيّةً كَعِيادةِ المَريضِ والنُّصح." },
    },
  ],
};
