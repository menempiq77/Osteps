import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const imamMalik: CourseLesson = {
  slug: "g6y7-imam-malik-ibn-anas",
  name: {
    en: "Imam Malik ibn Anas",
    ar: "الإمامُ مالِكُ بنُ أنَس",
  },
  shortIntro: {
    en: "The life of the 'Imam of Madinah' (711-795 CE): his deep reverence for hadith, his masterwork al-Muwatta', his courage before rulers, his famous humility ('everyone's word is taken or rejected except the one in this grave'), and what his school (the Maliki madhhab) teaches us about scholarship.",
    ar: "سيرةُ «إمامِ دارِ الهِجرة» (٩٣-١٧٩هـ): تَعظيمُهُ العَميقُ لِلحَديث، وكِتابُهُ المُوَطَّأ، وشَجاعَتُهُ أمامَ الحُكّام، وتَواضُعُهُ المَشهور («كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا صاحِبَ هذا القَبر»)، وما يُعَلِّمُنا مَذهَبُهُ المالِكِيُّ عنِ العِلم.",
  },
  quranSurahs: ["Fatir 28", "Al-Mujadila 11", "An-Nahl 43"],
  sections: [
    {
      title: { en: "Retrieval & the rank of the scholars", ar: "استِرجاعٌ ومَكانةُ العُلَماء" },
      learningObjectives: [
        { en: "Explain the Qur'anic status of knowledge and those who carry it.", ar: "أُبَيِّنُ المَكانةَ القُرآنيّةَ لِلعِلمِ وحَمَلَتِه." },
        { en: "Identify when and where Imam Malik lived and why he is called 'Imam of Madinah'.", ar: "أُحَدِّدُ زَمانَ ومَكانَ الإمامِ مالِكٍ ولِماذا لُقِّبَ بِإمامِ دارِ الهِجرة." },
      ],
      successCriteria: [
        { en: "I can explain 'only those who have knowledge truly fear Allah' (Fatir 28).", ar: "أُفَسِّرُ «إنَّما يَخشى اللهَ مِن عِبادِهِ العُلَماء» (فاطر ٢٨)." },
        { en: "I can place Imam Malik among the four great imams of fiqh.", ar: "أُنزِلُ الإمامَ مالِكًا بَينَ أئِمّةِ الفِقهِ الأربَعة." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Shelves of classical books of knowledge.", ar: "رُفوفٌ مِن كُتُبِ العِلمِ الكلاسيكيّة." },
        caption: { en: "The scholars are the heirs of the prophets — and Imam Malik was among the greatest.", ar: "العُلَماءُ وَرَثةُ الأنبياء — وكانَ الإمامُ مالِكٌ مِن أعظَمِهِم." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does knowledge produce fear of Allah?", ar: "لِماذا يُثمِرُ العِلمُ خَشيةَ الله؟" },
        body: {
          en: "Fatir 28 says 'only those who have knowledge truly fear Allah.' At first this seems strange — surely fear comes from ignorance? Argue the Qur'anic logic: how does deeper knowledge of Allah's greatness, names, and creation increase, rather than decrease, a person's awe of Him? What does this tell you about the purpose of studying religion?",
          ar: "تَقولُ فاطِرٌ ٢٨: «إنَّما يَخشى اللهَ مِن عِبادِهِ العُلَماء». وقد يَبدو هذا غَريبًا — أوَلَيسَ الخَوفُ مِنَ الجَهل؟ حاجِجِ المَنطِقَ القُرآنيّ: كَيفَ يَزيدُ العِلمُ الأعمَقُ بِعَظَمةِ اللهِ وأسمائِهِ وخَلقِهِ هَيبةَ المَرءِ لَهُ لا يُنقِصُها؟ وماذا يَدُلُّكَ ذلك على غايةِ دِراسةِ الدِّين؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"Only those of His servants who have knowledge truly fear Allah.\" — Fatir 28", ar: "﴿إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ﴾ — فاطر ٢٨" },
            { en: "\"Allah will raise those who believe among you and those given knowledge by degrees.\" — Al-Mujadila 11", ar: "﴿يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ﴾ — المجادلة ١١" },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: 'The scholars are the heirs of the prophets; the prophets did not leave behind dinars or dirhams, but they left behind knowledge.' — Abu Dawud & At-Tirmidhi", ar: "قالَ النَّبِيُّ ﷺ: «العُلَماءُ وَرَثةُ الأنبياء، إنَّ الأنبياءَ لم يُوَرِّثوا دينارًا ولا دِرهَمًا، إنَّما وَرَّثوا العِلم» — أبو داود والترمذي" },
          ],
        },
      ],
      body: {
        en: "Islam gives the seeker of knowledge an extraordinary rank. The Qur'an declares that 'only those who have knowledge truly fear Allah,' and that Allah 'will raise those given knowledge by degrees.' The Prophet ﷺ called scholars 'the heirs of the prophets,' for they inherit and protect the most precious legacy of all: the understanding of revelation. To study the life of a great scholar like Imam Malik, then, is to study one of these heirs — a man who carried the Prophet's knowledge faithfully across the centuries to us.\n\nNotice the deep logic of Fatir 28. The verse links knowledge not to pride but to khashyah — a fear mixed with awe and love. The more a person truly knows of Allah's majesty, His perfect names, the wonders of His creation, and the weight of His commands, the more their heart trembles before Him. Ignorance breeds carelessness; real knowledge breeds humility. This is the kind of knowledge the great imams possessed: not information stored in the head, but understanding that reshaped the heart.\n\nImam Malik ibn Anas (d. 179 AH / 795 CE) was one of the four great imams of fiqh, alongside Abu Hanifah, ash-Shafi'i, and Ahmad ibn Hanbal — the founders of the four Sunni schools of law that Muslims have followed for over a thousand years. Malik was born and lived in Madinah, the city of the Prophet ﷺ, and earned the title 'Imam of the Abode of Migration' (Imam Dar al-Hijrah). Living where the Prophet ﷺ had lived, among the descendants of the Companions, gave Malik a unique closeness to the original practice of Islam. A thoughtful student should approach his life not as a distant history lesson but as a model: here is what it looks like when a believer dedicates a whole life to inheriting, preserving, and living the knowledge of the Prophet ﷺ.",
        ar: "يَمنَحُ الإسلامُ طالِبَ العِلمِ مَنزِلةً عَظيمة. يُعلِنُ القُرآنُ أنَّ «إنَّما يَخشى اللهَ مِن عِبادِهِ العُلَماء»، وأنَّ اللهَ «يَرفَعُ الذينَ أوتوا العِلمَ دَرَجات». وسَمّى النَّبِيُّ ﷺ العُلَماءَ «وَرَثةَ الأنبياء»، فَهُم يَرِثونَ ويَصونونَ أنفَسَ إرثٍ على الإطلاق: فَهمَ الوَحي. ودِراسةُ سيرةِ عالِمٍ عَظيمٍ كالإمامِ مالِكٍ هي إذَن دِراسةٌ لِأحَدِ هؤُلاءِ الوَرَثة — رَجُلٍ حَمَلَ عِلمَ النَّبِيِّ ﷺ بِأمانةٍ عَبرَ القُرونِ إلينا.\n\nوتَأمَّلْ عُمقَ مَنطِقِ فاطِرٍ ٢٨. تَربِطُ الآيةُ العِلمَ لا بِالكِبرِ بل بِالخَشية — خَوفٍ مَمزوجٍ بِالهَيبةِ والمَحَبّة. فَكُلَّما عَرَفَ المَرءُ حَقًّا أكثَرَ مِن جَلالِ اللهِ وأسمائِهِ الحُسنى وعَجائِبِ خَلقِهِ وثِقَلِ أوامِرِهِ، ارتَجَفَ قَلبُهُ بَينَ يَدَيه. فالجَهلُ يُورِثُ الغَفلة؛ والعِلمُ الحَقُّ يُورِثُ التَّواضُع. وهذا نَوعُ العِلمِ الذي مَلَكَهُ الأئِمّةُ العِظام: لا مَعلوماتٍ مَخزونةً في الرَّأس، بل فَهمًا أعادَ تَشكيلَ القَلب.\n\nوالإمامُ مالِكُ بنُ أنَسٍ (ت ١٧٩هـ / ٧٩٥م) أحَدُ أئِمّةِ الفِقهِ الأربَعة، مَعَ أبي حَنيفةَ والشّافِعِيِّ وأحمَدَ بنِ حَنبَل — مُؤَسِّسي المَذاهِبِ السُّنِّيّةِ الأربَعةِ التي اتَّبَعَها المُسلِمونَ أكثَرَ مِن ألفِ عام. وُلِدَ مالِكٌ وعاشَ في المَدينة، مَدينةِ النَّبِيِّ ﷺ، ونالَ لَقَبَ «إمامِ دارِ الهِجرة». وعَيشُهُ حَيثُ عاشَ النَّبِيُّ ﷺ، بَينَ أبناءِ الصَّحابة، أكسَبَهُ قُربًا فَريدًا مِنَ العَمَلِ الأصلِيِّ لِلإسلام. وعلى الطّالِبِ المُتَأمِّلِ أن يَتَناوَلَ سيرَتَهُ لا دَرسَ تاريخٍ بَعيدٍ بل قُدوة: فَهذا ما يَكونُ عليهِ الأمرُ حينَ يُكَرِّسُ مُؤمِنٌ حَياتَهُ كُلَّها لِوِراثةِ عِلمِ النَّبِيِّ ﷺ وحِفظِهِ والعَمَلِ بِه.",
      },
    },
    {
      title: { en: "Reverence for the hadith of the Prophet ﷺ", ar: "تَعظيمُ حَديثِ النَّبِيِّ ﷺ" },
      learningObjectives: [
        { en: "Describe Imam Malik's etiquette and reverence when teaching hadith.", ar: "أصِفُ أدَبَ الإمامِ مالِكٍ وتَعظيمَهُ عِندَ تَدريسِ الحَديث." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Hands carefully holding a book of knowledge.", ar: "يَدانِ تَحمِلانِ كِتابَ عِلمٍ بِعِناية." },
        caption: { en: "Malik would not narrate the Prophet's words except in a state of purity and dignity.", ar: "كانَ مالِكٌ لا يُحَدِّثُ بِحَديثِ النَّبِيِّ ﷺ إلّا على طَهارةٍ ووَقار." },
      },
      infoBoxes: [
        {
          label: { en: "Reported about Imam Malik", ar: "مَرويٌّ عنِ الإمامِ مالِك" },
          lines: [
            { en: "It is reported that Malik would perform wudu', wear his best clothes and perfume, and sit with dignity before narrating the hadith of the Prophet ﷺ, saying he loved to honour the words of the Messenger ﷺ. He disliked narrating hadith while standing or hurried.", ar: "رُوِيَ أنَّ مالِكًا كانَ يَتَوَضَّأُ ويَلبَسُ أحسَنَ ثيابِهِ ويَتَطَيَّبُ ويَجلِسُ بِوَقارٍ قَبلَ أن يُحَدِّثَ بِحَديثِ النَّبِيِّ ﷺ، ويَقولُ إنَّهُ يُحِبُّ تَعظيمَ كَلامِ رَسولِ اللهِ ﷺ. وكَرِهَ أن يُحَدِّثَ قائِمًا أو على عَجَل." },
          ],
        },
        {
          label: { en: "Famous saying", ar: "قَولٌ مَشهور" },
          lines: [
            { en: "Imam Malik said: 'This knowledge is religion, so look carefully from whom you take your religion.' (reported by Muslim in his introduction)", ar: "قالَ الإمامُ مالِك: «إنَّ هذا العِلمَ دين، فانظُروا عمَّن تَأخُذونَ دينَكُم» (رواهُ مسلمٌ في مُقَدِّمَتِه)" },
          ],
        },
      ],
      callout: {
        label: { en: "Reflect", ar: "تَأمَّل" },
        title: { en: "Does how we treat knowledge change how we receive it?", ar: "هل تُغَيِّرُ طَريقةُ تَعامُلِنا مَعَ العِلمِ طَريقةَ تَلَقّينا لَه؟" },
        body: {
          en: "Malik treated every hadith as the actual words of the Messenger ﷺ deserving honour. Compare this with how we often treat knowledge today — scrolling quickly, half-distracted. Argue what is lost when sacred knowledge is received carelessly, and what Malik's example teaches about preparing the heart to learn.",
          ar: "عامَلَ مالِكٌ كُلَّ حَديثٍ على أنَّهُ كَلامُ الرَّسولِ ﷺ نَفسُهُ يَستَحِقُّ التَّكريم. قارِنْ هذا بِطَريقةِ تَعامُلِنا مَعَ العِلمِ اليَومَ غالِبًا — تَصَفُّحٍ سَريعٍ ونِصفِ انتِباه. حاجِجْ ما الذي يَضيعُ حينَ يُتَلَقّى العِلمُ المُقَدَّسُ بِإهمال، وما الذي يُعَلِّمُهُ مَثَلُ مالِكٍ عن تَهيِئةِ القَلبِ لِلتَّعَلُّم.",
        },
      },
      body: {
        en: "If there is one quality for which Imam Malik is most remembered, it is the overwhelming reverence with which he treated the hadith of the Prophet ﷺ. To Malik, a hadith was not mere data; it was the speech of the Messenger of Allah ﷺ, and it deserved to be honoured as such. It is reported that before he would sit to narrate hadith, he would make wudu', put on his finest clothes, apply perfume, comb his beard, and sit with calm dignity. When asked why, he explained that these were the words of the Messenger of Allah ﷺ, and he could not bear to relay them in a careless or undignified state.\n\nOnce, while teaching hadith, Malik was stung repeatedly by a scorpion, yet he refused to interrupt the lesson or show his pain, out of respect for the gathering of the Prophet's words. He disliked answering questions about the Prophet's hadith while walking or in a hurry. This was not for show; it flowed from a heart that genuinely magnified the Sunnah. His famous warning captures his whole attitude: 'This knowledge is religion, so look carefully from whom you take your religion.' Because the stakes were eternal, he was extremely careful about which narrators he accepted from, demanding honesty, accuracy, and good character.\n\nThere is a powerful lesson here for every student. The way we treat knowledge shapes how deeply it enters us. We live in an age of endless, instant information, often consumed while distracted and half-interested. Malik's example is a corrective: sacred knowledge is a trust and a treasure, and approaching it with humility, attention, and respect is part of truly receiving it. A demanding student should ask whether they prepare their heart before opening the Qur'an or studying a hadith, the way Malik prepared his whole body and bearing. His reverence was not an obstacle to learning; it was the very soil in which the deepest learning grew.",
        ar: "إن كانَت خَصلةٌ واحِدةٌ يُذكَرُ بِها الإمامُ مالِكٌ أكثَرَ مِن غَيرِها، فَهي تَعظيمُهُ الغامِرُ لِحَديثِ النَّبِيِّ ﷺ. فالحَديثُ عِندَ مالِكٍ لم يَكُنْ مُجَرَّدَ مَعلومة؛ بل كَلامَ رَسولِ اللهِ ﷺ، يَستَحِقُّ التَّكريمَ بِما يَليقُ بِه. رُوِيَ أنَّهُ قَبلَ أن يَجلِسَ لِيُحَدِّثَ كانَ يَتَوَضَّأُ ويَلبَسُ أجمَلَ ثيابِهِ ويَتَطَيَّبُ ويُسَرِّحُ لِحيَتَهُ ويَجلِسُ بِوَقارٍ وسَكينة. ولَمّا سُئِلَ عن ذلك بَيَّنَ أنَّها كَلِماتُ رَسولِ اللهِ ﷺ، وأنَّهُ لا يَطيقُ نَقلَها على حالِ إهمالٍ أو قِلّةِ وَقار.\n\nومَرّةً، وهو يُعَلِّمُ الحَديث، لَدَغَتهُ عَقرَبٌ مِرارًا، فَأبى أن يَقطَعَ الدَّرسَ أو يُظهِرَ ألَمَهُ، تَعظيمًا لِمَجلِسِ حَديثِ النَّبِيِّ ﷺ. وكَرِهَ أن يُجيبَ عن حَديثِ النَّبِيِّ ﷺ ماشِيًا أو مُستَعجِلًا. ولم يَكُنْ هذا تَكَلُّفًا؛ بل نَبَعَ مِن قَلبٍ يُعَظِّمُ السُّنّةَ حَقًّا. وقَولُهُ المَشهورُ يَختَصِرُ مَوقِفَهُ كُلَّه: «إنَّ هذا العِلمَ دين، فانظُروا عمَّن تَأخُذونَ دينَكُم». ولِأنَّ العاقِبةَ أبَدِيّة، كانَ شَديدَ التَّحَرّي عمَّن يَأخُذُ عَنهُم، يَطلُبُ الصِّدقَ والضَّبطَ وحُسنَ الخُلُق.\n\nوفي هذا دَرسٌ قَوِيٌّ لِكُلِّ طالِب. فَطَريقةُ تَعامُلِنا مَعَ العِلمِ تُشَكِّلُ عُمقَ دُخولِهِ فينا. نَعيشُ عَصرَ مَعلوماتٍ لا تَنتَهي فَورِيّة، تُستَهلَكُ غالِبًا ونَحنُ مَشغولونَ نِصفَ مُهتَمّين. ومَثَلُ مالِكٍ تَصحيح: فالعِلمُ المُقَدَّسُ أمانةٌ وكَنز، والإقبالُ عليهِ بِتَواضُعٍ وانتِباهٍ واحتِرامٍ جُزءٌ مِن تَلَقّيهِ حَقًّا. وعلى الطّالِبِ المُطالِبِ أن يَسألَ: أيُهَيِّئُ قَلبَهُ قَبلَ أن يَفتَحَ المُصحَفَ أو يَدرُسَ حَديثًا، كَما هَيَّأَ مالِكٌ جَسَدَهُ وهَيئَتَهُ كُلَّها؟ فَتَعظيمُهُ لم يَكُنْ عائِقًا لِلتَّعَلُّم؛ بل كانَ التُّربةَ التي نَما فيها أعمَقُ العِلم.",
      },
    },
    {
      title: { en: "Al-Muwatta': a masterwork of knowledge", ar: "المُوَطَّأ: تُحفةُ العِلم" },
      learningObjectives: [
        { en: "Explain what al-Muwatta' is and why it was so important.", ar: "أُبَيِّنُ ما هو المُوَطَّأ ولِماذا كانَ بالِغَ الأهَمِّيّة." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "An old, treasured manuscript among books.", ar: "مَخطوطةٌ قَديمةٌ نَفيسةٌ بَينَ الكُتُب." },
        caption: { en: "Al-Muwatta': among the earliest and most carefully verified books of Islamic law.", ar: "المُوَطَّأ: مِن أوائِلِ كُتُبِ الفِقهِ وأشَدِّها تَحَرِّيًا." },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَحٌ مِفتاحِيّ" },
          lines: [
            { en: "Al-Muwatta' ('the well-trodden path' / 'the made-easy'): Imam Malik's collection of hadith arranged by topics of fiqh, combined with the practice of the people of Madinah and the rulings of the Companions and their students.", ar: "المُوَطَّأ («المُمَهَّد» / «المُيَسَّر»): جَمعُ الإمامِ مالِكٍ لِلأحاديثِ مُرَتَّبةً على أبوابِ الفِقه، مَعَ عَمَلِ أهلِ المَدينةِ وفَتاوى الصَّحابةِ والتّابِعين." },
          ],
        },
        {
          label: { en: "Historical note", ar: "فائِدةٌ تاريخيّة" },
          lines: [
            { en: "Malik reportedly spent around forty years refining al-Muwatta', selecting only a small fraction of the narrations he knew. Imam ash-Shafi'i, his student, praised it as among the soundest and most beneficial books after the Qur'an in his time.", ar: "يُذكَرُ أنَّ مالِكًا قَضى نَحوَ أربَعينَ عامًا في تَنقيحِ المُوَطَّأ، يَنتَقي جُزءًا يَسيرًا مِنَ المَرويّاتِ التي يَعرِفُها. وأثنى عليهِ تِلميذُهُ الإمامُ الشّافِعِيُّ بِأنَّهُ مِن أصَحِّ الكُتُبِ وأنفَعِها بَعدَ القُرآنِ في زَمانِه." },
          ],
        },
      ],
      callout: {
        label: { en: "Appreciate the effort", ar: "قَدِّرِ الجُهد" },
        title: { en: "Forty years for one book?", ar: "أربَعونَ عامًا لِكِتابٍ واحِد؟" },
        body: {
          en: "Malik refined al-Muwatta' over decades, keeping only what he was certain of. In an age where we publish thoughts in seconds, reflect on what such patience reveals about his sense of responsibility before Allah for every word attributed to the Prophet ﷺ.",
          ar: "نَقَّحَ مالِكٌ المُوَطَّأ عَبرَ عُقود، لا يُبقي إلّا ما تَيَقَّنَه. في زَمَنٍ نَنشُرُ فيهِ أفكارَنا في ثَوانٍ، تَأمَّلْ ما يَكشِفُهُ هذا الصَّبرُ عن شُعورِهِ بِالمَسؤوليّةِ أمامَ اللهِ عن كُلِّ كَلِمةٍ تُنسَبُ إلى النَّبِيِّ ﷺ.",
        },
      },
      responsePrompt: {
        title: { en: "Written response", ar: "إجابةٌ مَكتوبة" },
        prompt: { en: "Explain what al-Muwatta' was and why Imam Malik spending around forty years refining it shows his sense of responsibility. What can a student today learn from his care and patience?", ar: "اشرَحْ ما هو المُوَطَّأ ولِماذا يَدُلُّ إنفاقُ الإمامِ مالِكٍ نَحوَ أربَعينَ عامًا في تَنقيحِهِ على شُعورِهِ بِالمَسؤوليّة. وماذا يَتَعَلَّمُ طالِبُ اليَومِ مِن عِنايَتِهِ وصَبرِه؟" },
        placeholder: { en: "Al-Muwatta' was... His forty years of care show... A student today can learn...", ar: "المُوَطَّأُ هو... وأربَعونَ عامًا مِن عِنايَتِهِ تَدُلُّ على... وطالِبُ اليَومِ يَتَعَلَّمُ..." },
      },
      body: {
        en: "Imam Malik's reverence for knowledge produced one of the most important books in Islamic history: al-Muwatta'. The name means 'the well-trodden path' or 'the made-easy,' and it was exactly that — a carefully organised collection of authentic hadith, arranged by the topics of fiqh (prayer, zakah, fasting, transactions, and so on), combined with the rulings of the Companions, their students, and the living practice of the people of Madinah. It was among the earliest comprehensive works of its kind, a foundation stone for the science of Islamic law.\n\nWhat makes al-Muwatta' so remarkable is the care that went into it. Imam Malik is reported to have spent around forty years refining the book, returning to it again and again, removing anything he was not fully certain of. From the vast number of narrations he had memorised, he selected only a relatively small, rigorously verified portion. This was not laziness in collecting but the opposite — an extreme sense of responsibility. He understood that every hadith he recorded would be attributed to the Messenger of Allah ﷺ and acted upon by generations to come, so he refused to include anything doubtful.\n\nThe value of his work was recognised immediately and has endured for over twelve centuries. His own student, Imam ash-Shafi'i — himself one of the four great imams — famously declared that in his time there was no book on earth, after the Book of Allah, more sound and beneficial than the Muwatta' of Malik. For a teacher to be praised so highly by a student who became a master in his own right is a rare honour. The lesson for the demanding student is clear: greatness in knowledge is built on patience, precision, and a deep fear of misrepresenting the truth. In an age when anyone can broadcast claims about religion in seconds, Malik's forty years of careful refinement stand as a towering reminder that knowledge of the deen is a sacred trust, to be handled with the utmost care.",
        ar: "أثمَرَ تَعظيمُ الإمامِ مالِكٍ لِلعِلمِ واحِدًا مِن أهَمِّ كُتُبِ التّاريخِ الإسلاميّ: المُوَطَّأ. والاسمُ يَعني «الطَّريقَ المُمَهَّد» أو «المُيَسَّر»، وكانَ كَذلكَ بِالضَّبط — جَمعًا مُنَظَّمًا بِعِنايةٍ لِلأحاديثِ الصَّحيحة، مُرَتَّبًا على أبوابِ الفِقه (الصَّلاةِ والزَّكاةِ والصِّيامِ والمُعامَلاتِ وغَيرِها)، مَعَ فَتاوى الصَّحابةِ وتَلاميذِهِم وعَمَلِ أهلِ المَدينةِ الحَيّ. وكانَ مِن أوائِلِ المُصَنَّفاتِ الجامِعةِ مِن نَوعِهِ، وحَجَرَ أساسٍ لِعِلمِ الفِقه.\n\nوما يَجعَلُ المُوَطَّأ بالِغَ الرَّوعةِ العِنايةُ التي بُذِلَت فيه. يُذكَرُ أنَّ الإمامَ مالِكًا قَضى نَحوَ أربَعينَ عامًا في تَنقيحِ الكِتاب، يَعودُ إليهِ مَرّةً بَعدَ مَرّة، يَحذِفُ ما لم يَتَيَقَّنْهُ تَمامًا. ومِنَ العَدَدِ الهائِلِ مِنَ المَرويّاتِ التي حَفِظَها، انتَقى قِسمًا صَغيرًا نِسبيًّا مُحَرَّرًا بِدِقّة. ولم يَكُنْ هذا كَسَلًا في الجَمعِ بل ضِدَّه — شُعورًا بالِغًا بِالمَسؤوليّة. فقد أدرَكَ أنَّ كُلَّ حَديثٍ يُثبِتُهُ سَيُنسَبُ إلى رَسولِ اللهِ ﷺ ويَعمَلُ بِهِ أجيالٌ قادِمة، فَأبى أن يُدخِلَ شَيئًا مَشكوكًا فيه.\n\nوعُرِفَت قيمةُ عَمَلِهِ فَورًا وبَقِيَت أكثَرَ مِن اثنَي عَشَرَ قَرنًا. فَتِلميذُهُ الإمامُ الشّافِعِيُّ — وهو أحَدُ الأئِمّةِ الأربَعةِ — أعلَنَ قَولَتَهُ المَشهورةَ أنَّهُ لَيسَ على الأرضِ في زَمانِهِ كِتابٌ بَعدَ كِتابِ اللهِ أصَحُّ وأنفَعُ مِن مُوَطَّأ مالِك. وأن يُثني تِلميذٌ صارَ إمامًا بِنَفسِهِ على شَيخِهِ هذا الثَّناءَ شَرَفٌ نادِر. والدَّرسُ لِلطّالِبِ المُطالِبِ واضِح: عَظَمةُ العِلمِ تُبنى على الصَّبرِ والدِّقّةِ وخَشيةٍ عَميقةٍ مِن تَحريفِ الحَقّ. وفي زَمَنٍ يَستَطيعُ فيهِ كُلُّ أحَدٍ أن يَبُثَّ دَعاوى عنِ الدِّينِ في ثَوانٍ، يَقِفُ تَنقيحُ مالِكٍ على مَدى أربَعينَ عامًا تَذكيرًا شامِخًا بِأنَّ عِلمَ الدِّينِ أمانةٌ مُقَدَّسةٌ تُتَناوَلُ بِأشَدِّ العِناية.",
      },
    },
    {
      title: { en: "Courage and humility: the marks of a true scholar", ar: "الشَّجاعةُ والتَّواضُع: عَلامتا العالِمِ الحَقّ" },
      learningObjectives: [
        { en: "Explain how Imam Malik combined courage before rulers with deep humility about himself.", ar: "أُبَيِّنُ كَيفَ جَمَعَ الإمامُ مالِكٌ بَينَ الشَّجاعةِ أمامَ الحُكّامِ والتَّواضُعِ العَميقِ في نَفسِه." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A firm mountain unmoved by storms.", ar: "جَبَلٌ راسِخٌ لا تُزَحزِحُهُ العَواصِف." },
        caption: { en: "Firm before kings, yet humble before the truth: 'everyone's word is taken or rejected — except the one in this grave.'", ar: "ثابِتٌ أمامَ المُلوك، مُتَواضِعٌ أمامَ الحَقّ: «كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا صاحِبَ هذا القَبر»." },
      },
      infoBoxes: [
        {
          label: { en: "Famous saying (humility)", ar: "قَولٌ مَشهور (تَواضُع)" },
          lines: [
            { en: "Imam Malik said, pointing to the grave of the Prophet ﷺ: 'Everyone's word may be taken or rejected, except the one in this grave (ﷺ).'", ar: "قالَ الإمامُ مالِكٌ مُشيرًا إلى قَبرِ النَّبِيِّ ﷺ: «كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا صاحِبَ هذا القَبرِ ﷺ»." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "شاهِدٌ قُرآنِيّ" },
          lines: [
            { en: "\"So ask the people of knowledge if you do not know.\" — An-Nahl 43", ar: "﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾ — النحل ٤٣" },
          ],
        },
      ],
      callout: {
        label: { en: "Hold the tension", ar: "أمسِكِ التَّوازُن" },
        title: { en: "How can one person be both bold and humble?", ar: "كَيفَ يَكونُ المَرءُ جَريئًا ومُتَواضِعًا مَعًا؟" },
        body: {
          en: "Malik stood firm against an unjust ruler yet said his own opinions could be rejected. These seem opposite — boldness and humility. Argue how they actually come from the same root: a heart that fears Allah more than people and loves the truth more than its own ego.",
          ar: "ثَبَتَ مالِكٌ أمامَ حاكِمٍ ظالِمٍ، ومَعَ ذلك قالَ إنَّ آراءَهُ يُمكِنُ أن تُرَدّ. ويَبدو هذانِ مُتَناقِضَين — الجَرأةُ والتَّواضُع. حاجِجْ كَيفَ يَنبَعانِ في الحَقيقةِ مِن أصلٍ واحِد: قَلبٍ يَخشى اللهَ أكثَرَ مِنَ النّاسِ ويُحِبُّ الحَقَّ أكثَرَ مِن نَفسِه.",
        },
      },
      body: {
        en: "A true scholar is recognised by two qualities that seem opposite but in fact spring from the same source: courage before the powerful and humility before the truth. Imam Malik embodied both. In his courage, he did not bend his rulings to please rulers. In one famous trial, he was pressured and even harmed by the authorities of his time over a legal opinion he would not retract, yet he held firm, because to him the truth was answerable to Allah alone, not to any governor or caliph. His firmness made him trusted by the entire Ummah: people knew his fatwas were sold to no one.\n\nYet alongside this lion-like courage stood a striking humility. Despite being the Imam of Madinah, whose opinions were sought across the Muslim world, Malik never imagined himself above correction. His most famous statement, spoken while pointing toward the grave of the Prophet ﷺ, is one of the great principles of Sunni Islam: 'Everyone's word may be taken or rejected, except the one in this grave.' In a single sentence he placed the Prophet ﷺ above all and placed himself — the greatest scholar of his city — among the fallible. His own school, the Maliki madhhab, is built on this very spirit: deep respect for evidence, never blind worship of any human being.\n\nThese two traits are not really opposites; they grow from one root. A heart that genuinely fears Allah more than it fears people will be brave before kings, because no human threat outweighs the displeasure of Allah. And that same heart will be humble about itself, because it knows that only Allah and His Messenger ﷺ are beyond error. The Qur'an commands us, 'ask the people of knowledge if you do not know' (An-Nahl 43) — and Malik shows us what such people should look like: bold in defending the truth, humble in claiming it for themselves. A demanding student should take this as a measure for judging any teacher, and as a goal for their own character: seek knowledge that makes you braver in standing for the truth and humbler in your own opinions, never the reverse.",
        ar: "يُعرَفُ العالِمُ الحَقُّ بِخَصلَتَينِ تَبدوانِ مُتَضادَّتَينِ لكِنَّهُما في الحَقيقةِ مِن مَنبَعٍ واحِد: الشَّجاعةِ أمامَ الأقوياءِ والتَّواضُعِ أمامَ الحَقّ. وقد جَمَعَهُما الإمامُ مالِك. ففي شَجاعَتِهِ لم يَلوِ فَتاواهُ إرضاءً لِلحُكّام. وفي مِحنةٍ مَشهورةٍ ضُغِطَ عليهِ بل أُوذِيَ مِن سُلطةِ زَمانِهِ بِسَبَبِ رَأيٍ فِقهِيٍّ أبى الرُّجوعَ عَنه، ومَعَ ذلك ثَبَت، لِأنَّ الحَقَّ عِندَهُ مَسؤولٌ أمامَ اللهِ وَحدَهُ لا أمامَ والٍ أو خَليفة. فَجَعَلَهُ ثَباتُهُ مَوضِعَ ثِقةِ الأُمّةِ كُلِّها: عَلِمَ النّاسُ أنَّ فَتاواهُ لا تُباعُ لِأحَد.\n\nومَعَ هذه الشَّجاعةِ الأسَدِيّةِ وَقَفَ تَواضُعٌ لافِت. فَرَغمَ كَونِهِ إمامَ المَدينةِ، تُطلَبُ آراؤُهُ عَبرَ العالَمِ الإسلاميّ، لم يَتَوَهَّمْ مالِكٌ نَفسَهُ فَوقَ التَّصحيح. وقَولُهُ الأشهَر، وهو يُشيرُ نَحوَ قَبرِ النَّبِيِّ ﷺ، مِن عَظائِمِ قَواعِدِ أهلِ السُّنّة: «كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا صاحِبَ هذا القَبر». فَفي جُملةٍ واحِدةٍ رَفَعَ النَّبِيَّ ﷺ فَوقَ الجَميعِ ووَضَعَ نَفسَهُ — أعظَمَ عُلَماءِ مَدينَتِهِ — بَينَ مَن يُخطِئون. ومَذهَبُهُ المالِكِيُّ مَبنِيٌّ على هذه الرّوحِ نَفسِها: احتِرامٌ عَميقٌ لِلدَّليل، لا تَقديسٌ أعمى لِأيِّ بَشَر.\n\nوهاتانِ الخَصلَتانِ لَيسَتا مُتَضادَّتَينِ حَقًّا؛ بل تَنبُتانِ مِن أصلٍ واحِد. فالقَلبُ الذي يَخشى اللهَ حَقًّا أكثَرَ مِنَ النّاسِ يَكونُ جَريئًا أمامَ المُلوك، لِأنَّ تَهديدَ بَشَرٍ لا يَرجَحُ سَخَطَ الله. وذاكَ القَلبُ نَفسُهُ يَكونُ مُتَواضِعًا في نَفسِهِ، لِأنَّهُ يَعلَمُ أنَّ اللهَ ورَسولَهُ ﷺ وَحدَهُما فَوقَ الخَطأ. ويَأمُرُنا القُرآن: «فاسألوا أهلَ الذِّكرِ إن كُنتُم لا تَعلَمون» (النحل ٤٣) — ويُرينا مالِكٌ كَيفَ يَنبَغي أن يَكونَ هؤُلاء: جُرَآءَ في نُصرةِ الحَقّ، مُتَواضِعينَ في ادِّعائِهِ لِأنفُسِهِم. وعلى الطّالِبِ المُطالِبِ أن يَتَّخِذَ هذا ميزانًا لِلحُكمِ على أيِّ مُعَلِّم، وهَدَفًا لِخُلُقِهِ: اطلُبْ عِلمًا يَزيدُكَ جَرأةً في الوُقوفِ لِلحَقِّ وتَواضُعًا في رَأيِكَ، لا العَكس.",
      },
    },
    {
      title: { en: "Synthesis: inheriting the legacy", ar: "تَركيبٌ: وِراثةُ الإرث" },
      learningObjectives: [
        { en: "Synthesise the example of Imam Malik into lessons for a student of today.", ar: "أُرَكِّبُ مَثَلَ الإمامِ مالِكٍ دُروسًا لِطالِبِ اليَوم." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A place of learning and worship.", ar: "مَكانُ عِلمٍ وعِبادة." },
        caption: { en: "Reverence, precision, courage, humility: the inheritance Malik leaves every student.", ar: "تَعظيمٌ ودِقّةٌ وشَجاعةٌ وتَواضُع: إرثُ مالِكٍ لِكُلِّ طالِب." },
      },
      matchingActivity: {
        title: { en: "Match each detail to the quality it shows", ar: "طابِقْ كُلَّ تَفصيلٍ بِالخَصلةِ التي يُظهِرُها" },
        instruction: { en: "Connect each fact about Imam Malik to the lesson it teaches.", ar: "اربِطْ كُلَّ خَبَرٍ عنِ الإمامِ مالِكٍ بِالدَّرسِ الذي يُعَلِّمُه." },
        prompts: [
          { en: "Wudu' and best clothes before narrating hadith", ar: "الوُضوءُ وأحسَنُ الثِّيابِ قَبلَ التَّحديث" },
          { en: "Forty years refining al-Muwatta'", ar: "أربَعونَ عامًا في تَنقيحِ المُوَطَّأ" },
          { en: "Holding firm under pressure from rulers", ar: "الثَّباتُ تَحتَ ضَغطِ الحُكّام" },
          { en: "'Everyone's word is taken or rejected except...'", ar: "«كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا...»" },
        ].map((p, i) => ({
          prompt: p,
          answer: [
            { en: "Reverence for the words of the Prophet ﷺ.", ar: "تَعظيمُ كَلامِ النَّبِيِّ ﷺ." },
            { en: "Precision and responsibility in knowledge.", ar: "الدِّقّةُ والمَسؤوليّةُ في العِلم." },
            { en: "Courage to defend the truth before the powerful.", ar: "الشَّجاعةُ في نُصرةِ الحَقِّ أمامَ الأقوياء." },
            { en: "Humility — only the Prophet ﷺ is beyond error.", ar: "التَّواضُع — لا مَعصومَ إلّا النَّبِيُّ ﷺ." },
          ][i],
        })),
      },
      groupTasks: {
        title: { en: "Collaborative inquiry", ar: "تَحَرٍّ جَماعِيّ" },
        instruction: { en: "Each group draws one practical lesson from Imam Malik's life.", ar: "تَستَخلِصُ كُلُّ مَجموعةٍ دَرسًا عَمَلِيًّا مِن حَياةِ الإمامِ مالِك." },
        groups: [
          {
            slug: "how-to-learn",
            name: { en: "Team A — How to seek knowledge today", ar: "الفَريقُ أ — كَيفَ نَطلُبُ العِلمَ اليَوم" },
            learningObjective: { en: "Turn Malik's reverence and care into habits for a modern student.", ar: "نُحَوِّلُ تَعظيمَ مالِكٍ وعِنايَتَهُ إلى عاداتٍ لِطالِبٍ مُعاصِر." },
            task: { en: "Propose three habits (e.g. checking sources, focus, respect) inspired by Malik for learning religion online and at school.", ar: "اقتَرِحوا ثَلاثَ عاداتٍ (كَتَحَرّي المَصادِر، والتَّركيز، والاحتِرام) مُستَوحاةً مِن مالِكٍ لِتَعَلُّمِ الدِّينِ عَبرَ الإنتِرنِت وفي المَدرَسة." },
            evidence: [
              { en: "'Look from whom you take your religion'; reverence before hadith.", ar: "«انظُروا عمَّن تَأخُذونَ دينَكُم»؛ التَّعظيمُ قَبلَ الحَديث." },
            ],
            sourceNotes: [
              { en: "Knowledge is a trust; verify before you accept or share.", ar: "العِلمُ أمانة؛ تَحَقَّقْ قَبلَ أن تَقبَلَ أو تَنشُر." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A 'how to seek knowledge' habit list inspired by Malik.", ar: "قائِمةُ عاداتِ «كَيفَ نَطلُبُ العِلم» مُستَوحاةٌ مِن مالِك." },
          },
          {
            slug: "character",
            name: { en: "Team B — Brave and humble", ar: "الفَريقُ ب — جَريءٌ ومُتَواضِع" },
            learningObjective: { en: "Explain how courage and humility grow from one root.", ar: "نُبَيِّنُ كَيفَ تَنبُتُ الشَّجاعةُ والتَّواضُعُ مِن أصلٍ واحِد." },
            task: { en: "Give a real example of when a student needs both courage and humility, and show how fearing Allah produces both.", ar: "اضرِبوا مَثَلًا واقِعِيًّا يَحتاجُ فيهِ الطّالِبُ إلى الشَّجاعةِ والتَّواضُعِ مَعًا، وبَيِّنوا كَيفَ تُنتِجُ خَشيةُ اللهِ كِلَيهِما." },
            evidence: [
              { en: "Malik's firmness before rulers; his statement at the Prophet's grave.", ar: "ثَباتُ مالِكٍ أمامَ الحُكّام؛ قَولُهُ عِندَ قَبرِ النَّبِيِّ ﷺ." },
            ],
            sourceNotes: [
              { en: "Fear of Allah > fear of people = courage; truth > ego = humility.", ar: "خَشيةُ اللهِ > خَوفِ النّاسِ = شَجاعة؛ والحَقُّ > الأنا = تَواضُع." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A short talk: 'Courage and humility from one heart.'", ar: "كَلِمةٌ قَصيرة: «الشَّجاعةُ والتَّواضُعُ مِن قَلبٍ واحِد»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final synthesis", ar: "التَّركيبُ الخِتامِيّ" },
        prompt: { en: "Bring Imam Malik's life together: how do his reverence for hadith, his precise scholarship in al-Muwatta', his courage before rulers, and his humility about himself form one consistent character — and what is the most important thing his example teaches you personally? Write a developed paragraph.", ar: "اجمَعْ حَياةَ الإمامِ مالِك: كَيفَ يُشَكِّلُ تَعظيمُهُ لِلحَديثِ ودِقّةُ عِلمِهِ في المُوَطَّأ وشَجاعَتُهُ أمامَ الحُكّامِ وتَواضُعُهُ في نَفسِهِ خُلُقًا واحِدًا مُتَّسِقًا — وما أهَمُّ ما يُعَلِّمُكَ مَثَلُهُ شَخصيًّا؟ اكتُبْ فِقرةً مُكتَمِلة." },
        placeholder: { en: "The life of Imam Malik forms one consistent character because...", ar: "تُشَكِّلُ حَياةُ الإمامِ مالِكٍ خُلُقًا واحِدًا مُتَّسِقًا لِأنَّ..." },
      },
      body: {
        en: "Gather the life of Imam Malik into a single portrait, for its parts are not scattered virtues but one consistent character built on the fear and love of Allah. Because the scholars are 'the heirs of the prophets,' Malik gave his whole life to inheriting their legacy faithfully. His reverence for hadith — the wudu', the fine clothes, the calm dignity — showed that to him every word of the Prophet ﷺ was sacred. His masterwork al-Muwatta', refined over forty patient years, showed that this reverence translated into rigorous precision: he would attribute nothing to the Messenger ﷺ that he had not verified with the utmost care. His courage before unjust rulers showed that this truth was answerable to Allah alone. And his humility — 'everyone's word is taken or rejected except the one in this grave' — showed that he never confused his own greatness with infallibility.\n\nSeen whole, these are not four separate traits but one heart expressed in four ways: a heart that feared Allah, and so revered His Messenger ﷺ, guarded His knowledge, stood firm for His truth, and stayed humble before Him. The matching activity asks you to connect each detail of his life to the quality it reveals; the group work asks you to turn his example into habits for seeking knowledge today and into an understanding of how courage and humility share one root. And this synthesis returns it to you. The point of studying Imam Malik is not to admire a man from long ago but to inherit, in your own small way, what he carried. Every time you check a source before believing a claim about religion, every time you treat the Qur'an and hadith with reverence, every time you stand for the truth yet stay humble about your own knowledge, you are walking a small step on the well-trodden path that Malik helped to clear. A demanding student leaves this lesson not merely informed about a great imam, but inspired to become a faithful heir of the same prophetic legacy.",
        ar: "اجمَعْ حَياةَ الإمامِ مالِكٍ في صورةٍ واحِدة، فَأجزاؤُها لَيسَت فَضائِلَ مُتَناثِرةً بل خُلُقٌ واحِدٌ مُتَّسِقٌ مَبنِيٌّ على خَشيةِ اللهِ وحُبِّه. لِأنَّ العُلَماءَ «وَرَثةُ الأنبياء»، أعطى مالِكٌ حَياتَهُ كُلَّها لِوِراثةِ إرثِهِم بِأمانة. فَتَعظيمُهُ لِلحَديثِ — مِنَ الوُضوءِ والثِّيابِ الحَسَنةِ والوَقارِ الهادِئ — أظهَرَ أنَّ كُلَّ كَلِمةٍ لِلنَّبِيِّ ﷺ مُقَدَّسةٌ عِندَه. وكِتابُهُ المُوَطَّأ، المُنَقَّحُ على مَدى أربَعينَ عامًا صابِرًا، أظهَرَ أنَّ هذا التَّعظيمَ تَحَوَّلَ دِقّةً صارِمة: فَلا يَنسُبُ إلى الرَّسولِ ﷺ شَيئًا لم يَتَحَقَّقْ مِنهُ بِأشَدِّ العِناية. وشَجاعَتُهُ أمامَ الحُكّامِ الظَّلَمةِ أظهَرَت أنَّ هذا الحَقَّ مَسؤولٌ أمامَ اللهِ وَحدَه. وتَواضُعُهُ — «كُلٌّ يُؤخَذُ مِن قَولِهِ ويُرَدُّ إلّا صاحِبَ هذا القَبر» — أظهَرَ أنَّهُ لم يَخلِطْ يَومًا بَينَ عَظَمَتِهِ والعِصمة.\n\nوبِالنَّظَرِ الكُلِّيّ، لَيسَت هذه أربَعَ خِصالٍ مُنفَصِلةً بل قَلبٌ واحِدٌ تَجَلّى في أربَعِ صُوَر: قَلبٌ خَشِيَ الله، فَعَظَّمَ رَسولَهُ ﷺ، وصانَ عِلمَه، وثَبَتَ لِحَقِّه، وبَقِيَ مُتَواضِعًا بَينَ يَدَيه. تَطلُبُ مِنكَ المُطابَقةُ أن تَربِطَ كُلَّ تَفصيلٍ بِالخَصلةِ التي يَكشِفُها؛ ويَطلُبُ العَمَلُ الجَماعِيُّ أن تُحَوِّلَ مَثَلَهُ إلى عاداتٍ لِطَلَبِ العِلمِ اليَومَ وإلى فَهمٍ لِكَيفِ تَشتَرِكُ الشَّجاعةُ والتَّواضُعُ في أصلٍ واحِد. وهذا التَّركيبُ يَرُدُّهُ إليك. فَغايةُ دِراسةِ الإمامِ مالِكٍ لَيسَتِ الإعجابَ بِرَجُلٍ مِن قَديمٍ بل أن تَرِثَ، بِطَريقَتِكَ الصَّغيرة، ما حَمَلَه. فَكُلَّما تَحَقَّقتَ مِن مَصدَرٍ قَبلَ تَصديقِ دَعوى عنِ الدِّين، وكُلَّما عامَلتَ القُرآنَ والحَديثَ بِتَعظيم، وكُلَّما وَقَفتَ لِلحَقِّ وبَقيتَ مُتَواضِعًا في عِلمِك، خَطَوتَ خُطوةً صَغيرةً على الطَّريقِ المُمَهَّدِ الذي أعانَ مالِكٌ على تَمهيدِه. والطّالِبُ المُطالِبُ يُغادِرُ هذا الدَّرسَ لا مُجَرَّدَ عالِمٍ بِإمامٍ عَظيم، بل مُلهَمًا لِيَصيرَ وارِثًا أمينًا لِلإرثِ النَّبَوِيِّ نَفسِه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Why does the Qur'an say 'only those who have knowledge truly fear Allah' (Fatir 28)?", ar: "لِماذا يَقولُ القُرآن «إنَّما يَخشى اللهَ مِن عِبادِهِ العُلَماء» (فاطر ٢٨)؟" },
      options: [
        { en: "Deeper knowledge of Allah's greatness increases awe and humility before Him", ar: "العِلمُ الأعمَقُ بِعَظَمةِ اللهِ يَزيدُ الهَيبةَ والتَّواضُعَ بَينَ يَدَيه" },
        { en: "Because scholars never make mistakes", ar: "لِأنَّ العُلَماءَ لا يُخطِئونَ أبَدًا" },
        { en: "Because fear comes only from ignorance", ar: "لِأنَّ الخَوفَ مِنَ الجَهلِ وَحدَه" },
        { en: "Because knowledge makes people proud", ar: "لِأنَّ العِلمَ يورِثُ الكِبر" },
      ],
      correctIndex: 0,
      explanation: { en: "True knowledge breeds khashyah — awe mixed with love — not arrogance.", ar: "العِلمُ الحَقُّ يورِثُ الخَشيةَ — هَيبةً مَمزوجةً بِمَحَبّةٍ — لا الكِبر." },
    },
    {
      prompt: { en: "What was special about how Imam Malik narrated the hadith of the Prophet ﷺ?", ar: "ما الذي مَيَّزَ طَريقةَ تَحديثِ الإمامِ مالِكٍ بِحَديثِ النَّبِيِّ ﷺ؟" },
      options: [
        { en: "He would make wudu', wear his best clothes, and sit with dignity out of reverence", ar: "كانَ يَتَوَضَّأُ ويَلبَسُ أحسَنَ ثيابِهِ ويَجلِسُ بِوَقارٍ تَعظيمًا" },
        { en: "He narrated quickly while walking", ar: "كانَ يُحَدِّثُ بِسُرعةٍ وهو يَمشي" },
        { en: "He accepted hadith from anyone without checking", ar: "كانَ يَقبَلُ الحَديثَ مِن أيِّ أحَدٍ بِلا تَحَقُّق" },
        { en: "He refused to teach hadith at all", ar: "كانَ يَرفُضُ تَدريسَ الحَديثِ كُلِّيًّا" },
      ],
      correctIndex: 0,
      explanation: { en: "He said: 'This knowledge is religion, so look from whom you take your religion' — reverence and care together.", ar: "قالَ: «إنَّ هذا العِلمَ دين، فانظُروا عمَّن تَأخُذونَ دينَكُم» — تَعظيمٌ وعِنايةٌ مَعًا." },
    },
    {
      prompt: { en: "What is al-Muwatta'?", ar: "ما هو المُوَطَّأ؟" },
      options: [
        { en: "Imam Malik's carefully verified collection of hadith and fiqh, refined over decades", ar: "جَمعُ الإمامِ مالِكٍ المُحَرَّرُ لِلحَديثِ والفِقهِ، المُنَقَّحُ عَبرَ عُقود" },
        { en: "A book of poetry", ar: "ديوانُ شِعر" },
        { en: "A history of the kings of Madinah", ar: "تاريخُ مُلوكِ المَدينة" },
        { en: "A book Malik wrote in a single night", ar: "كِتابٌ كَتَبَهُ مالِكٌ في لَيلةٍ واحِدة" },
      ],
      correctIndex: 0,
      explanation: { en: "Ash-Shafi'i praised it as among the soundest, most beneficial books after the Qur'an in his time.", ar: "أثنى عليهِ الشّافِعِيُّ بِأنَّهُ مِن أصَحِّ الكُتُبِ وأنفَعِها بَعدَ القُرآنِ في زَمانِه." },
    },
    {
      prompt: { en: "What does Imam Malik's saying at the Prophet's grave teach?", ar: "ماذا يُعَلِّمُ قَولُ الإمامِ مالِكٍ عِندَ قَبرِ النَّبِيِّ ﷺ؟" },
      options: [
        { en: "Everyone's opinion can be accepted or rejected — only the Prophet ﷺ is beyond error", ar: "كُلُّ رَأيٍ يُقبَلُ أو يُرَدّ — ولا مَعصومَ إلّا النَّبِيُّ ﷺ" },
        { en: "That Malik considered himself infallible", ar: "أنَّ مالِكًا عَدَّ نَفسَهُ مَعصومًا" },
        { en: "That we should never ask scholars anything", ar: "أنَّنا لا نَسألُ العُلَماءَ شَيئًا أبَدًا" },
        { en: "That all opinions are equally correct", ar: "أنَّ كُلَّ الآراءِ صَحيحةٌ سَواء" },
      ],
      correctIndex: 0,
      explanation: { en: "This humility is a core principle of Sunni Islam: respect evidence, never blindly worship any human being.", ar: "هذا التَّواضُعُ أصلٌ عِندَ أهلِ السُّنّة: احتِرامُ الدَّليلِ لا التَّقديسُ الأعمى لِأيِّ بَشَر." },
    },
    {
      prompt: { en: "How can courage before rulers and humility about oneself come from the same root?", ar: "كَيفَ تَنبَعُ الشَّجاعةُ أمامَ الحُكّامِ والتَّواضُعُ في النَّفسِ مِن أصلٍ واحِد؟" },
      options: [
        { en: "A heart that fears Allah more than people is brave for the truth yet humble about itself", ar: "القَلبُ الذي يَخشى اللهَ أكثَرَ مِنَ النّاسِ يَشجُعُ لِلحَقِّ ويَتَواضَعُ في نَفسِه" },
        { en: "They cannot come from the same person", ar: "لا يُمكِنُ أن يَجتَمِعا في شَخصٍ واحِد" },
        { en: "Courage requires arrogance", ar: "الشَّجاعةُ تَتَطَلَّبُ الكِبر" },
        { en: "Humility requires staying silent about the truth", ar: "التَّواضُعُ يَتَطَلَّبُ السُّكوتَ عنِ الحَقّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Fear of Allah over people produces courage; loving truth over ego produces humility — one heart, two fruits.", ar: "خَشيةُ اللهِ فَوقَ النّاسِ تُنتِجُ الشَّجاعة؛ وحُبُّ الحَقِّ فَوقَ الأنا يُنتِجُ التَّواضُع — قَلبٌ واحِدٌ وثَمَرَتان." },
    },
    {
      prompt: { en: "True or False: Imam Malik was one of the four great imams of Sunni fiqh and was known as the Imam of Madinah.", ar: "صَوابٌ أم خَطأ: كانَ الإمامُ مالِكٌ أحَدَ أئِمّةِ الفِقهِ السُّنِّيِّ الأربَعةِ وعُرِفَ بِإمامِ المَدينة." },
      options: [
        { en: "True — alongside Abu Hanifah, ash-Shafi'i, and Ahmad ibn Hanbal", ar: "صَواب — مَعَ أبي حَنيفةَ والشّافِعِيِّ وأحمَدَ بنِ حَنبَل" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "He founded the Maliki madhhab and lived in Madinah, the city of the Prophet ﷺ.", ar: "أسَّسَ المَذهَبَ المالِكِيَّ وعاشَ في المَدينةِ، مَدينةِ النَّبِيِّ ﷺ." },
    },
  ],
};
