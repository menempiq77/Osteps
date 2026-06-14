import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const arabicLanguageAndCulture: CourseLesson = {
  slug: "g11y12-arabic-language-and-culture",
  name: { en: "Arabic Language and Culture", ar: "اللُّغةُ والثَّقافةُ العَرَبِيّة" },
  shortIntro: {
    en: "The Arabic language is the language of the Qur'an and the key to understanding Islam, and it carries a rich culture of knowledge, manners, and identity. This lesson studies the honour Allah gave the Arabic language by revealing His final Book in it, its role in preserving and understanding the religion, the heritage of Arabic culture in the service of Islam, and the duty of a young Muslim to cherish, learn, and protect this language.",
    ar: "اللُّغةُ العَرَبِيّةُ لُغةُ القُرآنِ ومِفتاحُ فَهمِ الإسلام، وتَحمِلُ ثَقافةً غَنيّةً مِنَ العِلمِ والأدَبِ والهُوِيّة. يَدرُسُ هذا الدَّرسُ الشَّرَفَ الذي أعطاهُ اللهُ لِلُغةِ العَرَبِيّةِ بِإنزالِ كِتابِهِ الخاتِمِ بِها، ودَورَها في حِفظِ الدّينِ وفَهمِه، وتُراثَ الثَّقافةِ العَرَبِيّةِ في خِدمةِ الإسلام، وواجِبَ الشّابِّ المُسلِمِ في حُبِّ هذه اللُّغةِ وتَعَلُّمِها وحِمايَتِها.",
  },
  quranSurahs: ["Yusuf 2", "Ash-Shu'ara 192-195"],
  sections: [
    {
      title: { en: "The honour of the Arabic language", ar: "شَرَفُ اللُّغةِ العَرَبِيّة" },
      learningObjectives: [
        { en: "Explain why Allah honoured the Arabic language.", ar: "أشرَحُ لِمَ شَرَّفَ اللهُ اللُّغةَ العَرَبِيّة." },
        { en: "Explain its role in understanding Islam.", ar: "أشرَحُ دَورَها في فَهمِ الإسلام." },
      ],
      successCriteria: [
        { en: "I can explain Yusuf 2 and Ash-Shu'ara 192-195.", ar: "أشرَحُ يوسُفَ ٢ والشُّعَراءَ ١٩٢-١٩٥." },
        { en: "I can describe the link between Arabic and the Qur'an.", ar: "أصِفُ الصِّلةَ بَينَ العَرَبِيّةِ والقُرآن." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Reading the Qur'an in its Arabic language.", ar: "قِراءةُ القُرآنِ بِلُغَتِهِ العَرَبِيّة." },
        caption: { en: "'Indeed, We have sent it down as an Arabic Qur'an' (Yusuf 2).", ar: "﴿إنّا أنزَلناهُ قُرآنًا عَرَبيًّا﴾ (يوسُف ٢)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why did Allah choose Arabic for His final revelation?", ar: "لِمَ اختارَ اللهُ العَرَبِيّةَ لِوَحيِهِ الخاتِم؟" },
        body: {
          en: "Allah, the All-Wise, chose Arabic as the language of the Qur'an, His final and complete revelation to humanity. This was not by chance: He praised it as a 'clear Arabic tongue,' and through this choice the Arabic language gained an everlasting honour and became the key to understanding Islam. Yet many young Muslims today, even Arabic speakers, are growing distant from their language — weak in classical Arabic, mixing it with other languages, and unable to understand the Qur'an in its own words. Reflect: why did Allah choose Arabic for His final revelation, what is lost when a Muslim cannot understand the language of the Qur'an, and what is the duty of a young Muslim toward this honoured language?",
          ar: "اختارَ اللهُ الحَكيمُ العَرَبِيّةَ لُغةً لِلقُرآن، وَحيِهِ الخاتِمِ الكامِلِ لِلبَشَريّة. ولَم يَكُن ذلك صُدفةً: فَقَد وَصَفَها بِأنَّها ﴿لِسانٌ عَرَبيٌّ مُبين﴾، وبِهذا الاختيارِ نالَتِ العَرَبِيّةُ شَرَفًا خالِدًا وصارَت مِفتاحَ فَهمِ الإسلام. لكِنَّ كَثيرًا مِنَ الشَّبابِ المُسلِمِ اليَوم، حتّى الناطِقينَ بِها، يَبتَعِدونَ عن لُغَتِهِم — ضَعفًا في الفُصحى، وخَلطًا بِغَيرِها، وعَجزًا عن فَهمِ القُرآنِ بِكَلِماتِه. تَأمَّل: لِمَ اختارَ اللهُ العَرَبِيّةَ لِوَحيِهِ الخاتِم، وماذا يُفقَدُ حينَ لا يَفهَمُ المُسلِمُ لُغةَ القُرآن، وما واجِبُ الشّابِّ المُسلِمِ تُجاهَ هذه اللُّغةِ المُشَرَّفة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Al-lughah al-'arabiyyah (اللُّغةُ العَرَبِيّة): the Arabic language — the language of the Qur'an and the Sunnah.", ar: "اللُّغةُ العَرَبِيّة: لُغةُ القُرآنِ والسُّنّة." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Ash-Shu'ara 195: revealed 'in a clear Arabic tongue.'", ar: "الشُّعَراء ١٩٥: نَزَلَ ﴿بِلِسانٍ عَرَبيٍّ مُبين﴾." },
          ],
        },
      ],
      body: {
        en: "The Arabic language holds a unique and honoured place in Islam, for Allah, the All-Wise, chose it as the language of the Qur'an, His final, complete, and protected revelation to all of humanity. This choice is repeated and emphasised throughout the Qur'an itself: 'Indeed, We have sent it down as an Arabic Qur'an that you might understand' (Yusuf 2); and 'And indeed, it [the Qur'an] is the revelation of the Lord of the worlds. The Trustworthy Spirit [Jibril] has brought it down upon your heart, that you may be among the warners, in a clear Arabic tongue' (Ash-Shu'ara 192-195). By this divine choice, the Arabic language gained an everlasting honour: it became the language in which Allah's eternal speech was revealed, the language the Prophet ﷺ spoke, the language of the prayers, the call to prayer, and the worship of over a billion Muslims, and a language preserved by the very preservation of the Qur'an that Allah guaranteed. While other sacred languages and texts have been altered or lost over time, the Arabic of the Qur'an remains exactly as it was revealed, understood and recited by Muslims across fourteen centuries and the whole world.\n\nThis honour is not mere sentiment; it carries a profound practical importance, for the Arabic language is the key to understanding Islam. The Qur'an was revealed in Arabic, and to understand it fully — its precise meanings, its depths, its eloquence (balaghah), and the subtleties that translations cannot fully capture — one must understand the Arabic in which Allah chose to speak. The Sunnah of the Prophet ﷺ, the second source of Islam, is likewise in Arabic. The vast heritage of Islamic scholarship — tafsir (Qur'anic commentary), hadith, fiqh (jurisprudence), aqidah (creed), and the sciences built to serve them — is recorded in Arabic. And the correct performance of worship, from the recitation of Al-Fatihah in every prayer to the words of dhikr and du'a, is in Arabic. For this reason, the scholars of Islam regarded learning Arabic as a means to a religious duty: since understanding the Qur'an and Sunnah and performing worship correctly depends on Arabic, learning it to the degree needed becomes part of serving the religion. 'Umar ibn al-Khattab encouraged people to learn Arabic, saying it is part of the religion, and the great scholars across the centuries mastered it as the foundation of all the Islamic sciences.\n\nThe loss that comes when a Muslim cannot understand the language of the Qur'an is therefore great. A Muslim who recites the Qur'an without understanding a word of it is cut off from direct contact with the meanings of Allah's speech, dependent entirely on translations, and unable to taste the beauty and power of the divine words. A Muslim who cannot understand Arabic struggles to access the immense heritage of Islamic knowledge in its original sources, and is more easily misled by those who distort meanings. And a community that loses its connection to Arabic loses a vital link to its faith, its scholarship, and its identity. This is why the weakening of Arabic among young Muslims today — even among native Arabic speakers, many of whom are weak in classical Arabic (al-fusha), mix their speech heavily with other languages, and cannot read or understand the Qur'an in its own words — is a serious matter that the religion calls us to address. In the next section, we will look at the rich heritage of Arabic culture in the service of Islam, and the duty of a young Muslim to cherish, learn, and protect this honoured language.",
        ar: "تَحتَلُّ اللُّغةُ العَرَبِيّةُ مَكانةً فَريدةً مُشَرَّفةً في الإسلام، فَقَدِ اختارَها اللهُ الحَكيمُ لُغةً لِلقُرآن، وَحيِهِ الخاتِمِ الكامِلِ المَحفوظِ لِلبَشَريّةِ كافّة. وهذا الاختيارُ مُكَرَّرٌ مُؤَكَّدٌ في القُرآنِ نَفسِه: ﴿إنّا أنزَلناهُ قُرآنًا عَرَبيًّا لَعَلَّكُم تَعقِلون﴾ (يوسُف ٢)؛ و﴿وإنَّهُ لَتَنزيلُ رَبِّ العالَمين. نَزَلَ بِهِ الرّوحُ الأمين. على قَلبِكَ لِتَكونَ مِنَ المُنذِرين. بِلِسانٍ عَرَبيٍّ مُبين﴾ (الشُّعَراء ١٩٢-١٩٥). وبِهذا الاختيارِ الإلهيِّ نالَتِ العَرَبِيّةُ شَرَفًا خالِدًا: صارَتِ اللُّغةَ التي نَزَلَ بِها كَلامُ اللهِ الأزَليّ، ولُغةَ النَّبِيِّ ﷺ، ولُغةَ الصَّلاةِ والأذانِ وعِبادةِ ما يَزيدُ على مِليارِ مُسلِم، ولُغةً مَحفوظةً بِحِفظِ القُرآنِ نَفسِهِ الذي ضَمِنَهُ الله. فَبَينَما تَغَيَّرَت لُغاتٌ ونُصوصٌ مُقَدَّسةٌ أُخرى أو ضاعَت عَبرَ الزَّمَن، بَقِيَت عَرَبِيّةُ القُرآنِ كَما نَزَلَت تَمامًا، يَفهَمُها ويَتلوها المُسلِمونَ عَبرَ أربَعةَ عَشَرَ قَرنًا وفي العالَمِ كُلِّه.\n\nولَيسَ هذا الشَّرَفُ مُجَرَّدَ عاطِفة؛ بل يَحمِلُ أهَمّيّةً عَمَليّةً عَميقة، فَاللُّغةُ العَرَبِيّةُ مِفتاحُ فَهمِ الإسلام. فَالقُرآنُ نَزَلَ بِالعَرَبِيّة، ولِفَهمِهِ كامِلًا — مَعانيَهُ الدَّقيقةَ وأعماقَهُ وبَلاغَتَهُ ولَطائِفَهُ التي لا تُدرِكُها التَّرجَماتُ كامِلةً — لا بُدَّ مِن فَهمِ العَرَبِيّةِ التي اختارَ اللهُ أن يَتَكَلَّمَ بِها. وسُنّةُ النَّبِيِّ ﷺ، مَصدَرُ الإسلامِ الثّاني، عَرَبِيّةٌ كَذلك. والتُّراثُ العَظيمُ لِلعِلمِ الإسلاميِّ — التَّفسيرُ والحَديثُ والفِقهُ والعَقيدةُ والعُلومُ المَبنيّةُ لِخِدمَتِها — مُدَوَّنٌ بِالعَرَبِيّة. وأداءُ العِبادةِ الصَّحيحُ، مِن قِراءةِ الفاتِحةِ في كُلِّ صَلاةٍ إلى كَلِماتِ الذِّكرِ والدُّعاء، بِالعَرَبِيّة. ولِهذا عَدَّ عُلَماءُ الإسلامِ تَعَلُّمَ العَرَبِيّةِ وَسيلةً إلى واجِبٍ دينيّ: فَلَمّا كانَ فَهمُ القُرآنِ والسُّنّةِ وأداءُ العِبادةِ الصَّحيحُ مُتَوَقِّفًا على العَرَبِيّة، صارَ تَعَلُّمُها بِالقَدرِ المُحتاجِ إلَيهِ جُزءًا مِن خِدمةِ الدّين. وحَثَّ عُمَرُ بنُ الخَطّابِ على تَعَلُّمِ العَرَبِيّةِ وقالَ إنَّها مِنَ الدّين، وأتقَنَها كِبارُ العُلَماءِ عَبرَ القُرونِ أساسًا لِكُلِّ العُلومِ الإسلاميّة.\n\nفَالخُسرانُ الذي يَأتي حينَ لا يَفهَمُ المُسلِمُ لُغةَ القُرآنِ عَظيمٌ إذَن. فَالمُسلِمُ الذي يَتلو القُرآنَ ولا يَفهَمُ مِنهُ كَلِمةً مَقطوعٌ عنِ الاتِّصالِ المُباشَرِ بِمَعاني كَلامِ الله، مُعتَمِدٌ كُلّيًّا على التَّرجَمات، عاجِزٌ عن تَذَوُّقِ جَمالِ الكَلِماتِ الإلهيّةِ وقُوَّتِها. والمُسلِمُ الذي لا يَفهَمُ العَرَبِيّةَ يَعسُرُ علَيهِ الوُصولُ إلى تُراثِ العِلمِ الإسلاميِّ الهائِلِ في مَصادِرِهِ الأصيلة، ويَسهُلُ تَضليلُهُ مِمَّن يُحَرِّفونَ المَعاني. والمُجتَمَعُ الذي يَفقِدُ صِلَتَهُ بِالعَرَبِيّةِ يَفقِدُ رابِطًا حَيَويًّا بِدينِهِ وعِلمِهِ وهُوِيَّتِه. ولِهذا فَإنَّ ضَعفَ العَرَبِيّةِ بَينَ الشَّبابِ المُسلِمِ اليَوم — حتّى بَينَ الناطِقينَ بِها، وكَثيرٌ مِنهُم ضِعافٌ في الفُصحى، يَخلِطونَ كَلامَهُم كَثيرًا بِغَيرِها، ولا يَقرَؤونَ القُرآنَ أو يَفهَمونَهُ بِكَلِماتِه — أمرٌ خَطيرٌ يَدعونا الدّينُ إلى عِلاجِه. وفي القِسمِ التّالي نَنظُرُ في تُراثِ الثَّقافةِ العَرَبِيّةِ الغَنيِّ في خِدمةِ الإسلام، وواجِبِ الشّابِّ المُسلِمِ في حُبِّ هذه اللُّغةِ المُشَرَّفةِ وتَعَلُّمِها وحِمايَتِها.",
      },
    },
    {
      title: { en: "Arabic culture and the duty to protect the language", ar: "الثَّقافةُ العَرَبِيّةُ وواجِبُ حِمايةِ اللُّغة" },
      learningObjectives: [
        { en: "Describe the heritage of Arabic culture in service of Islam.", ar: "أصِفُ تُراثَ الثَّقافةِ العَرَبِيّةِ في خِدمةِ الإسلام." },
        { en: "Explain the duty to learn and protect Arabic.", ar: "أشرَحُ واجِبَ تَعَلُّمِ العَرَبِيّةِ وحِمايَتِها." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Books of Arabic knowledge and heritage.", ar: "كُتُبُ العِلمِ والتُّراثِ العَرَبيّ." },
        caption: { en: "Learning Arabic is part of serving the religion.", ar: "تَعَلُّمُ العَرَبِيّةِ مِن خِدمةِ الدّين." },
      },
      groupTasks: {
        title: { en: "Cherishing the language of the Qur'an", ar: "حُبُّ لُغةِ القُرآن" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "arabic-heritage",
            name: { en: "Team A — The heritage of Arabic", ar: "الفَريقُ أ — تُراثُ العَرَبِيّة" },
            learningObjective: { en: "Present the heritage of Arabic in the service of knowledge and Islam.", ar: "نَعرِضُ تُراثَ العَرَبِيّةِ في خِدمةِ العِلمِ والإسلام." },
            task: { en: "Present the rich heritage carried by the Arabic language in the service of Islam and knowledge: the sciences built to serve the Qur'an (grammar/nahw, morphology/sarf, rhetoric/balaghah, tafsir); the vast libraries of Islamic scholarship written in Arabic; the role of Arabic as the language of science, medicine, and philosophy during the golden age of Islamic civilisation; and the beauty of Arabic poetry and prose. Show how Arabic became a global language of knowledge through Islam. Present an 'Arabic heritage' display.", ar: "اعرِضوا التُّراثَ الغَنيَّ الذي تَحمِلُهُ العَرَبِيّةُ في خِدمةِ الإسلامِ والعِلم: العُلومَ المَبنيّةَ لِخِدمةِ القُرآن (النَّحوَ والصَّرفَ والبَلاغةَ والتَّفسير)؛ والمَكتَباتِ الهائِلةَ لِلعِلمِ الإسلاميِّ المَكتوبةَ بِالعَرَبِيّة؛ ودَورَ العَرَبِيّةِ لُغةً لِلعِلمِ والطِّبِّ والفَلسَفةِ في العَصرِ الذَّهَبيِّ لِلحَضارةِ الإسلاميّة؛ وجَمالَ الشِّعرِ والنَّثرِ العَرَبيّ. بَيِّنوا كَيفَ صارَتِ العَرَبِيّةُ لُغةً عالَميّةً لِلعِلمِ بِالإسلام. اعرِضوا لَوحةَ «تُراثِ العَرَبِيّة»." },
            evidence: [
              { en: "Arabic preserved and transmitted vast knowledge across centuries.", ar: "حَفِظَتِ العَرَبِيّةُ ونَقَلَت عِلمًا هائِلًا عَبرَ القُرون." },
            ],
            sourceNotes: [
              { en: "Arabic served the Qur'an and all the Islamic sciences.", ar: "خَدَمَتِ العَرَبِيّةُ القُرآنَ وكُلَّ العُلومِ الإسلاميّة." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "An 'Arabic heritage' display.", ar: "لَوحةُ «تُراثِ العَرَبِيّة»." },
          },
          {
            slug: "protecting-arabic",
            name: { en: "Team B — Learning and protecting Arabic", ar: "الفَريقُ ب — تَعَلُّمُ العَرَبِيّةِ وحِمايَتُها" },
            learningObjective: { en: "Present how to learn, cherish, and protect Arabic today.", ar: "نَعرِضُ كَيفَ نَتَعَلَّمُ العَرَبِيّةَ ونُحِبُّها ونَحميها اليَوم." },
            task: { en: "Present the duty of a young Muslim toward Arabic and how to fulfil it today: cherishing the language as the language of the Qur'an; learning classical Arabic (al-fusha) and improving one's reading and understanding of the Qur'an; using Arabic well and avoiding the excessive mixing of languages that weakens it; reading Arabic books and the Qur'an with understanding; and, for non-native speakers, learning at least enough Arabic to understand the words of the prayer and the Qur'an. Give a practical plan for strengthening one's Arabic. Present a 'cherish your language' guide.", ar: "اعرِضوا واجِبَ الشّابِّ المُسلِمِ تُجاهَ العَرَبِيّةِ وكَيفَ يُؤَدّيهِ اليَوم: حُبَّ اللُّغةِ لُغةً لِلقُرآن؛ وتَعَلُّمَ الفُصحى وتَحسينَ قِراءةِ القُرآنِ وفَهمِه؛ واستِعمالَ العَرَبِيّةِ جَيِّدًا واجتِنابَ الخَلطِ المُفرِطِ بَينَ اللُّغاتِ الذي يُضعِفُها؛ وقِراءةَ الكُتُبِ العَرَبِيّةِ والقُرآنِ بِفَهم؛ ولِغَيرِ الناطِقينَ بِها، تَعَلُّمَ ما يَكفي على الأقَلِّ لِفَهمِ كَلِماتِ الصَّلاةِ والقُرآن. أعطوا خِطّةً عَمَليّةً لِتَقويةِ العَرَبِيّة. اعرِضوا دَليلَ «أحِبَّ لُغَتَك»." },
            evidence: [
              { en: "'Indeed, We have sent it down as an Arabic Qur'an that you might understand' (Yusuf 2).", ar: "﴿إنّا أنزَلناهُ قُرآنًا عَرَبيًّا لَعَلَّكُم تَعقِلون﴾ (يوسُف ٢)." },
            ],
            sourceNotes: [
              { en: "Learning Arabic helps one understand the Qur'an.", ar: "تَعَلُّمُ العَرَبِيّةِ يُعينُ على فَهمِ القُرآن." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'cherish your language' guide.", ar: "دَليلُ «أحِبَّ لُغَتَك»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "My relationship with the language of the Qur'an", ar: "عَلاقَتي بِلُغةِ القُرآن" },
        prompt: { en: "Allah honoured the Arabic language by revealing the Qur'an in it, making it the key to understanding Islam, performing worship, and accessing the vast heritage of Islamic knowledge. Reflect honestly on your own relationship with Arabic: How well can you read and understand the Qur'an in its own language? Do you cherish Arabic, or have you grown distant from it? Write about why the Arabic language matters to you as a Muslim, and describe a concrete plan to strengthen your relationship with it — naming at least two specific things you will do (such as learning to understand the meanings of the Qur'an you recite, improving your classical Arabic, reducing excessive language-mixing, or reading Arabic with understanding).", ar: "شَرَّفَ اللهُ اللُّغةَ العَرَبِيّةَ بِإنزالِ القُرآنِ بِها، فَجَعَلَها مِفتاحَ فَهمِ الإسلامِ وأداءِ العِبادةِ والوُصولِ إلى تُراثِ العِلمِ الإسلاميِّ الهائِل. تَأمَّل بِصِدقٍ عَلاقَتَكَ بِالعَرَبِيّة: كَم تُحسِنُ قِراءةَ القُرآنِ وفَهمَهُ بِلُغَتِه؟ أتُحِبُّ العَرَبِيّةَ أم ابتَعَدتَ عَنها؟ اكتُب لِمَ تُهِمُّكَ اللُّغةُ العَرَبِيّةُ كَمُسلِم، وصِف خِطّةً عَمَليّةً لِتَقويةِ عَلاقَتِكَ بِها — ذاكِرًا أمرَينِ مُحَدَّدَينِ على الأقَلِّ سَتَفعَلُهُما (كَتَعَلُّمِ مَعاني ما تَتلوهُ مِنَ القُرآن، وتَحسينِ فُصحاك، وتَقليلِ الخَلطِ المُفرِطِ بَينَ اللُّغات، أو قِراءةِ العَرَبِيّةِ بِفَهم)." },
        placeholder: { en: "Arabic matters to me because... My plan to strengthen it is...", ar: "العَرَبِيّةُ تُهِمُّني لِأنَّ... وخِطّتي لِتَقويَتِها..." },
      },
      body: {
        en: "Because Allah chose Arabic as the language of His final revelation, the Arabic language became, through Islam, one of the greatest carriers of knowledge and culture in human history. To understand and serve the Qur'an, Muslim scholars developed an entire family of sciences around the Arabic language: grammar (nahw) and morphology (sarf) to understand its structure precisely; rhetoric and eloquence (balaghah) to appreciate the inimitable beauty of the Qur'anic expression; lexicography to record its vast vocabulary; and the sciences of recitation, tafsir, and the principles of interpretation. The vast libraries of Islamic civilisation — millions of works in tafsir, hadith, fiqh, aqidah, history, and the Arabic sciences — were written in Arabic, preserving the religion and transmitting it faithfully across the centuries. And beyond the religious sciences, Arabic became, during the golden age of Islamic civilisation, the leading global language of knowledge: the works of medicine, mathematics, astronomy, chemistry, geography, and philosophy were written in Arabic, and scholars from many lands and faiths learned Arabic to access this knowledge, much of which later passed to Europe. Alongside this, Arabic carried a rich heritage of poetry and prose of extraordinary beauty and depth. All of this culture grew up in the service of the Qur'an and around the honour Allah gave the Arabic language.\n\nGiven this honour and this heritage, the believer has a real duty toward the Arabic language — a duty rooted in the religion itself. The first part of this duty is to cherish and respect the language as the language of the Qur'an, the speech of Allah, and the words of the Prophet ﷺ; loving the Arabic language is, for the believer, connected to loving the Qur'an and the religion. The second part is to learn it: to strive to read the Qur'an correctly and, beyond that, to understand its meanings in its own words rather than depending entirely on translations; to learn classical Arabic (al-fusha) to the degree one is able; and, for those who are not native speakers, to learn at least enough Arabic to understand the words of the prayer and the basic meanings of the Qur'an. The third part is to use the language well and protect it: to speak and write good Arabic, to avoid the excessive and careless mixing of Arabic with other languages that weakens it (a widespread problem today), and to pass the language on to the next generation. The scholars considered the preservation of Arabic to be tied to the preservation of the religion, and the weakening of the language among Muslims to be a danger to their understanding of their faith.\n\nFor a young Muslim today, this duty is especially pressing, because the Arabic language faces real challenges. Even among native Arabic speakers, many young people are weak in classical Arabic, conduct much of their lives in other languages, mix their speech heavily with foreign words, and cannot comfortably read or understand the Qur'an in its own words; and among non-Arabic-speaking Muslims, many recite the Qur'an and pray in Arabic without understanding the meaning of a single word. This distance from the language of the Qur'an weakens one's connection to the direct meanings of Allah's speech and to the heritage of Islamic knowledge. The young Muslim should therefore take practical steps to strengthen their relationship with Arabic: learning to understand the meanings of the Qur'an they recite, improving their reading and their classical Arabic, reducing careless language-mixing, reading good Arabic books, and, for non-native speakers, beginning to learn the language of their faith. This is not merely a cultural preference; it is a way of drawing closer to the Qur'an, of understanding the religion more deeply, of preserving a precious heritage, and of honouring the language that Allah Himself honoured by choosing it for His final words to humanity. To cherish, learn, and protect the Arabic language is, for the believer, part of cherishing, learning, and protecting Islam itself.",
        ar: "لِأنَّ اللهَ اختارَ العَرَبِيّةَ لُغةً لِوَحيِهِ الخاتِم، صارَتِ العَرَبِيّةُ بِالإسلامِ مِن أعظَمِ حَوامِلِ العِلمِ والثَّقافةِ في تاريخِ البَشَر. فَلِفَهمِ القُرآنِ وخِدمَتِهِ طَوَّرَ عُلَماءُ المُسلِمينَ أُسرةً كامِلةً مِنَ العُلومِ حَولَ العَرَبِيّة: النَّحوَ والصَّرفَ لِفَهمِ بِنائِها بِدِقّة؛ والبَلاغةَ لِإدراكِ جَمالِ التَّعبيرِ القُرآنيِّ المُعجِز؛ والمُعجَماتِ لِتَسجيلِ ثَروَتِها اللَّفظيّة؛ وعُلومَ القِراءاتِ والتَّفسيرِ وأُصولِ التَّأويل. وكُتِبَت مَكتَباتُ الحَضارةِ الإسلاميّةِ الهائِلةُ — مَلايينُ المُؤَلَّفاتِ في التَّفسيرِ والحَديثِ والفِقهِ والعَقيدةِ والتّاريخِ والعُلومِ العَرَبِيّة — بِالعَرَبِيّة، فَحَفِظَتِ الدّينَ ونَقَلَتهُ بِأمانةٍ عَبرَ القُرون. وفَوقَ العُلومِ الدّينيّةِ صارَتِ العَرَبِيّةُ في العَصرِ الذَّهَبيِّ لِلحَضارةِ الإسلاميّةِ اللُّغةَ العالَميّةَ الأولى لِلعِلم: كُتِبَت بِها كُتُبُ الطِّبِّ والرّياضيّاتِ والفَلَكِ والكيمياءِ والجُغرافيا والفَلسَفة، وتَعَلَّمَها عُلَماءُ مِن بِلادٍ وأديانٍ شَتّى لِلوُصولِ إلى هذا العِلمِ الذي انتَقَلَ كَثيرٌ مِنهُ لاحِقًا إلى أوروبّا. ومعَ هذا حَمَلَتِ العَرَبِيّةُ تُراثًا غَنيًّا مِنَ الشِّعرِ والنَّثرِ بالِغَ الجَمالِ والعُمق. وكُلُّ هذه الثَّقافةِ نَشَأَت في خِدمةِ القُرآنِ وحَولَ الشَّرَفِ الذي أعطاهُ اللهُ لِلعَرَبِيّة.\n\nوبِهذا الشَّرَفِ وهذا التُّراثِ يَكونُ على المُؤمِنِ واجِبٌ حَقيقيٌّ تُجاهَ العَرَبِيّة — واجِبٌ مُتَأصِّلٌ في الدّينِ نَفسِه. أوَّلُ هذا الواجِبِ حُبُّ اللُّغةِ واحتِرامُها لُغةً لِلقُرآنِ وكَلامِ اللهِ وكَلِماتِ النَّبِيِّ ﷺ؛ فَحُبُّ العَرَبِيّةِ عِندَ المُؤمِنِ مُتَّصِلٌ بِحُبِّ القُرآنِ والدّين. وثانيهِ تَعَلُّمُها: السَّعيُ لِقِراءةِ القُرآنِ صَحيحًا، وفَوقَ ذلك فَهمُ مَعانيهِ بِكَلِماتِهِ لا الاعتِمادُ كُلّيًّا على التَّرجَمات؛ وتَعَلُّمُ الفُصحى بِقَدرِ المُستَطاع؛ ولِغَيرِ الناطِقينَ بِها، تَعَلُّمُ ما يَكفي على الأقَلِّ لِفَهمِ كَلِماتِ الصَّلاةِ ومَعاني القُرآنِ الأساسيّة. وثالِثُهُ حُسنُ استِعمالِ اللُّغةِ وحِمايَتُها: التَّحَدُّثُ والكِتابةُ بِعَرَبِيّةٍ جَيِّدة، واجتِنابُ الخَلطِ المُفرِطِ المُهمِلِ بَينَ العَرَبِيّةِ وغَيرِها الذي يُضعِفُها (وهي مُشكِلةٌ مُنتَشِرةٌ اليَوم)، ونَقلُ اللُّغةِ إلى الجيلِ التّالي. وقَد عَدَّ العُلَماءُ حِفظَ العَرَبِيّةِ مُتَّصِلًا بِحِفظِ الدّين، وضَعفَ اللُّغةِ بَينَ المُسلِمينَ خَطَرًا على فَهمِهِم لِدينِهِم.\n\nوهذا الواجِبُ لِلشّابِّ المُسلِمِ اليَومَ ألَحُّ، لِأنَّ العَرَبِيّةَ تُواجِهُ تَحَدّياتٍ حَقيقيّة. فَحتّى بَينَ الناطِقينَ بِها، كَثيرٌ مِنَ الشَّبابِ ضِعافٌ في الفُصحى، يَعيشونَ جُلَّ حَياتِهِم بِغَيرِها، يَخلِطونَ كَلامَهُم كَثيرًا بِأَلفاظٍ أجنَبيّة، ولا يَقرَؤونَ القُرآنَ أو يَفهَمونَهُ بِيُسرٍ بِكَلِماتِه؛ وبَينَ غَيرِ الناطِقينَ بِها، كَثيرونَ يَتلونَ القُرآنَ ويُصَلّونَ بِالعَرَبِيّةِ دونَ فَهمِ مَعنى كَلِمةٍ واحِدة. وهذا البُعدُ عن لُغةِ القُرآنِ يُضعِفُ الصِّلةَ بِمَعاني كَلامِ اللهِ المُباشَرةِ وبِتُراثِ العِلمِ الإسلاميّ. فَلْيَتَّخِذِ الشّابُّ المُسلِمُ خُطُواتٍ عَمَليّةً لِتَقويةِ عَلاقَتِهِ بِالعَرَبِيّة: تَعَلُّمَ مَعاني ما يَتلوهُ مِنَ القُرآن، وتَحسينَ قِراءَتِهِ وفُصحاه، وتَقليلَ الخَلطِ المُهمِل، وقِراءةَ الكُتُبِ العَرَبِيّةِ الجَيِّدة، ولِغَيرِ الناطِقينَ بِها، البَدءَ بِتَعَلُّمِ لُغةِ دينِه. ولَيسَ هذا مُجَرَّدَ تَفضيلٍ ثَقافيّ؛ بل وَسيلةٌ لِلتَّقَرُّبِ مِنَ القُرآن، ولِفَهمِ الدّينِ أعمَق، ولِحِفظِ تُراثٍ ثَمين، ولِتَعظيمِ اللُّغةِ التي عَظَّمَها اللهُ نَفسُهُ بِاختيارِها لِكَلِماتِهِ الخاتِمةِ لِلبَشَريّة. وأن يُحِبَّ المُؤمِنُ العَرَبِيّةَ ويَتَعَلَّمَها ويَحميها هو جُزءٌ مِن أن يُحِبَّ الإسلامَ نَفسَهُ ويَتَعَلَّمَهُ ويَحميه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Why is the Arabic language honoured in Islam?", ar: "لِمَ شُرِّفَتِ العَرَبِيّةُ في الإسلام؟" },
      options: [
        { en: "Allah chose it as the language of the Qur'an", ar: "اختارَها اللهُ لُغةً لِلقُرآن" },
        { en: "It is the easiest language", ar: "إنَّها أسهَلُ لُغة" },
        { en: "It has the most speakers", ar: "إنَّها الأكثَرُ نُطقًا" },
        { en: "For no reason", ar: "بِلا سَبَب" },
      ],
      correctIndex: 0,
      explanation: { en: "'Indeed, We have sent it down as an Arabic Qur'an' (Yusuf 2).", ar: "﴿إنّا أنزَلناهُ قُرآنًا عَرَبيًّا﴾ (يوسُف ٢)." },
    },
    {
      prompt: { en: "Why is Arabic called the key to understanding Islam?", ar: "لِمَ سُمِّيَتِ العَرَبِيّةُ مِفتاحَ فَهمِ الإسلام؟" },
      options: [
        { en: "The Qur'an, Sunnah, and Islamic scholarship are in Arabic", ar: "القُرآنُ والسُّنّةُ والعِلمُ الإسلاميُّ بِالعَرَبِيّة" },
        { en: "It is only a cultural matter", ar: "إنَّها أمرٌ ثَقافيٌّ فَقَط" },
        { en: "It has no link to the religion", ar: "لا صِلةَ لَها بِالدّين" },
        { en: "It is unimportant", ar: "إنَّها غَيرُ مُهِمّة" },
      ],
      correctIndex: 0,
      explanation: { en: "Understanding the sources and worship depends on Arabic.", ar: "فَهمُ المَصادِرِ والعِبادةِ مُتَوَقِّفٌ على العَرَبِيّة." },
    },
    {
      prompt: { en: "What did 'Umar ibn al-Khattab say about learning Arabic?", ar: "ماذا قالَ عُمَرُ بنُ الخَطّابِ في تَعَلُّمِ العَرَبِيّة؟" },
      options: [
        { en: "It is part of the religion", ar: "إنَّها مِنَ الدّين" },
        { en: "It is unnecessary", ar: "إنَّها غَيرُ ضَروريّة" },
        { en: "It is forbidden", ar: "إنَّها مُحَرَّمة" },
        { en: "It is only for Arabs", ar: "إنَّها لِلعَرَبِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "He encouraged people to learn it as part of the religion.", ar: "حَثَّ على تَعَلُّمِها لِأنَّها مِنَ الدّين." },
    },
    {
      prompt: { en: "What is lost when a Muslim cannot understand Arabic?", ar: "ماذا يُفقَدُ حينَ لا يَفهَمُ المُسلِمُ العَرَبِيّة؟" },
      options: [
        { en: "Direct access to the meanings of the Qur'an and Islamic heritage", ar: "الوُصولُ المُباشَرُ لِمَعاني القُرآنِ والتُّراثِ الإسلاميّ" },
        { en: "Nothing", ar: "لا شَيء" },
        { en: "Only some vocabulary", ar: "بَعضُ المُفرَداتِ فَقَط" },
        { en: "An advantage", ar: "مَيزة" },
      ],
      correctIndex: 0,
      explanation: { en: "They depend entirely on translations and miss the depth.", ar: "يَعتَمِدُ كُلّيًّا على التَّرجَماتِ ويَفوتُهُ العُمق." },
    },
    {
      prompt: { en: "Which is part of a Muslim's duty toward Arabic?", ar: "أيٌّ مِن واجِبِ المُسلِمِ تُجاهَ العَرَبِيّة؟" },
      options: [
        { en: "Cherishing, learning, and protecting it", ar: "حُبُّها وتَعَلُّمُها وحِمايَتُها" },
        { en: "Abandoning it", ar: "هَجرُها" },
        { en: "Mocking it", ar: "الاستِهزاءُ بِها" },
        { en: "Mixing it carelessly with other languages", ar: "خَلطُها المُهمِلُ بِغَيرِها" },
      ],
      correctIndex: 0,
      explanation: { en: "Preserving Arabic is tied to preserving understanding of the religion.", ar: "حِفظُ العَرَبِيّةِ مُتَّصِلٌ بِحِفظِ فَهمِ الدّين." },
    },
    {
      prompt: { en: "True or False: The Arabic of the Qur'an has been preserved unchanged across the centuries.", ar: "صَوابٌ أم خَطأ: عَرَبِيّةُ القُرآنِ حُفِظَت دونَ تَغييرٍ عَبرَ القُرون." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "It is preserved by the preservation of the Qur'an that Allah guaranteed.", ar: "حُفِظَت بِحِفظِ القُرآنِ الذي ضَمِنَهُ الله." },
    },
  ],
};
