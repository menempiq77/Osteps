import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const etiquetteOfTheMosque: CourseLesson = {
  slug: "g6y7-etiquette-of-the-mosque",
  name: {
    en: "Etiquette of the Mosque",
    ar: "آدابُ المَسجِد",
  },
  shortIntro: {
    en: "Why the mosque is 'the most beloved of places to Allah', the adab of entering, sitting, and leaving, the reward of those 'whose hearts are attached to the mosque', and how the masjid built a community — not just a building.",
    ar: "لِماذا المَسجِدُ «أحَبُّ البِقاعِ إلى الله»، وآدابُ الدُّخولِ والجُلوسِ والخُروج، وأجرُ مَن «قَلبُهُ مُعَلَّقٌ بِالمَساجِد»، وكَيفَ بَنى المَسجِدُ أُمّةً لا مَبنًى فَحَسب.",
  },
  quranSurahs: ["At-Tawbah 18", "An-Nur 36-37", "Al-A'raf 31"],
  sections: [
    {
      title: { en: "Retrieval & the house of Allah", ar: "استِرجاعٌ وبَيتُ الله" },
      learningObjectives: [
        { en: "Define the status of the mosque from At-Tawbah 18 and the hadith on beloved places.", ar: "أُحَدِّدُ مَكانةَ المَسجِدِ مِنَ التَّوبةِ ١٨ وحَديثِ أحَبِّ البِقاع." },
        { en: "Explain what truly 'maintaining' a mosque (i'mar) means.", ar: "أُبَيِّنُ مَعنى «عِمارةِ» المَسجِدِ الحَقيقيّ." },
      ],
      successCriteria: [
        { en: "I can list the qualities At-Tawbah 18 attaches to those who maintain mosques.", ar: "أُعَدِّدُ الصِّفاتِ التي تَربِطُها التَّوبةُ ١٨ بِعُمّارِ المَساجِد." },
        { en: "I can distinguish building a mosque from filling it with worship.", ar: "أُفَرِّقُ بَينَ بِناءِ المَسجِدِ وعِمارَتِهِ بِالعِبادة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A grand mosque with open courtyards.", ar: "مَسجِدٌ جامِعٌ بِساحاتٍ مَفتوحة." },
        caption: { en: "The mosque: a house of Allah and the beating heart of the Muslim community.", ar: "المَسجِد: بَيتُ اللهِ وقَلبُ المُجتَمَعِ المُسلِمِ النّابِض." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "What does it mean to 'maintain' a mosque?", ar: "ماذا يَعني أن «تَعمُرَ» مَسجِدًا؟" },
        body: {
          en: "At-Tawbah 18 says only certain believers truly 'maintain' (ya'mur) the mosques of Allah. The Arabic i'mar means both to build/keep up and to fill with life. Analyse the difference: can a person fund a magnificent mosque yet not be among its true maintainers? What does the verse require beyond bricks?",
          ar: "تَقولُ التَّوبةُ ١٨ إنَّ مُؤمِنينَ مَخصوصينَ هُم مَن «يَعمُرُ» مَساجِدَ الله. و«العِمارةُ» في العَرَبيّةِ تَشمَلُ البِناءَ والصِّيانةَ ومَلءَ المَكانِ بِالحَياة. حَلِّلِ الفَرق: أيُمكِنُ أن يُمَوِّلَ المَرءُ مَسجِدًا فاخِرًا ولا يَكونَ مِن عُمّارِهِ الحَقيقيّين؟ ماذا تَطلُبُ الآيةُ وراءَ الحِجارة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"The mosques of Allah are only maintained by those who believe in Allah and the Last Day, establish prayer, give zakah, and fear none but Allah. It is they who may be among the rightly guided.\" — At-Tawbah 18", ar: "﴿إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ ۖ فَعَسَىٰ أُولَٰئِكَ أَن يَكُونُوا مِنَ الْمُهْتَدِينَ﴾ — التوبة ١٨" },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: 'The most beloved of places to Allah are its mosques, and the most hated of places to Allah are its markets.' — Muslim", ar: "قالَ النَّبِيُّ ﷺ: «أحَبُّ البِلادِ إلى اللهِ مَساجِدُها، وأبغَضُ البِلادِ إلى اللهِ أسواقُها» — مسلم" },
          ],
        },
      ],
      body: {
        en: "The mosque holds a rank in Islam that no other building can match. The Prophet ﷺ taught that 'the most beloved of places to Allah are its mosques.' To understand etiquette of the mosque, we must first feel why it matters: this is not merely a hall where prayers happen, but a house attributed directly to Allah — 'the mosques of Allah.' Manners flow naturally from understanding whose house we are entering.\n\nAt-Tawbah 18 sets out who is truly worthy to 'maintain' the mosques, and the word it uses — i'mar — is rich. It means to build them and keep them in good repair, but far more, to fill them with life and worship. A magnificent empty mosque is not 'maintained' in the Qur'anic sense; a humble mosque full of sincere worshippers is. This is why the verse does not list architects or donors but believers: those who believe in Allah and the Last Day, who establish the prayer, who give zakah, and who fear none but Allah. The true keeper of a mosque is the one who keeps it alive with sincere devotion.\n\nNotice how the verse ends — 'It is they who may be among the rightly guided.' Allah uses the word 'may' ('asa), which from Allah is a promise of hope, to teach humility: even those who fill the mosques must not grow complacent, but keep hoping in His acceptance. A thoughtful student should grasp the order of priorities here. Before any rule about how to enter or sit, the foundation is set: the mosque is precious because it is Allah's, and the person who honours it most is not the richest builder but the most sincere worshipper. Etiquette, then, is simply the outward form of this inner reverence.",
        ar: "لِلمَسجِدِ في الإسلامِ مَنزِلةٌ لا يُدانيها مَبنًى آخَر. عَلَّمَنا النَّبِيُّ ﷺ أنَّ «أحَبَّ البِلادِ إلى اللهِ مَساجِدُها». ولِنَفهَمَ آدابَ المَسجِدِ لا بُدَّ أوَّلًا أن نَستَشعِرَ لِمَ هو مُهِمّ: فَلَيسَ مُجَرَّدَ قاعةٍ تُقامُ فيها الصَّلاة، بل بَيتٌ مَنسوبٌ إلى اللهِ مُباشَرةً — «مَساجِدَ الله». والأدَبُ يَنبَعُ طَبعًا مِن إدراكِ بَيتِ مَن نَدخُل.\n\nوتُبَيِّنُ التَّوبةُ ١٨ مَن يَستَحِقُّ حَقًّا «عِمارةَ» المَساجِد، واللَّفظُ الذي تَستَعمِلُهُ — العِمارة — ثَرِيّ. يَعني بِناءَها وصيانَتَها، وأعظَمَ مِن ذلك مَلأَها بِالحَياةِ والعِبادة. فالمَسجِدُ الفاخِرُ الخالي لَيسَ «مَعمورًا» بِالمَعنى القُرآنيّ؛ والمَسجِدُ المُتَواضِعُ المُمتَلِئُ بِالمُصَلّينَ المُخلِصينَ هو المَعمور. ولِهذا لم تَذكُرِ الآيةُ مِعمارِيّينَ ولا مُتَبَرِّعينَ بل مُؤمِنين: مَن آمَنَ بِاللهِ واليَومِ الآخِر، وأقامَ الصَّلاة، وآتى الزَّكاة، ولم يَخشَ إلّا الله. فَحارِسُ المَسجِدِ الحَقُّ مَن يُبقيهِ حَيًّا بِالعِبادةِ الصّادِقة.\n\nوتَأمَّلْ كَيفَ خَتَمَتِ الآية — «فَعَسى أُولئكَ أن يَكونوا مِنَ المُهتَدين». استَعمَلَ اللهُ «عَسى»، وهي مِنَ اللهِ رَجاءٌ مُؤَكَّد، لِيُعَلِّمَ التَّواضُع: فَحَتّى عُمّارُ المَساجِدِ لا يَنبَغي أن يَغتَرّوا، بل يَبقَونَ راجينَ قَبولَه. وعلى الطّالِبِ المُتَأمِّلِ أن يُدرِكَ تَرتيبَ الأولَوِيّاتِ هُنا. فَقَبلَ أيِّ قاعِدةٍ في كَيفيّةِ الدُّخولِ أو الجُلوس، يُؤَسَّسُ الأصل: المَسجِدُ نَفيسٌ لِأنَّهُ للهِ، وأكثَرُ النّاسِ تَكريمًا لَهُ لَيسَ أغنى بانٍ بل أصدَقُ عابِد. والأدَبُ إذَن صورةٌ ظاهِرةٌ لِهذا التَّعظيمِ الباطِن.",
      },
    },
    {
      title: { en: "Entering and leaving with adab", ar: "الدُّخولُ والخُروجُ بِأدَب" },
      learningObjectives: [
        { en: "List the prophetic etiquettes of entering, sitting in, and leaving the mosque.", ar: "أُعَدِّدُ آدابَ النَّبِيِّ ﷺ في دُخولِ المَسجِدِ والجُلوسِ فيهِ والخُروجِ مِنه." },
      ],
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern by a doorway at night.", ar: "مِصباحٌ عِندَ مَدخَلٍ لَيلًا." },
        caption: { en: "Right foot in with a du'a, left foot out with a du'a: every step is worship.", ar: "اليُمنى دُخولًا بِدُعاء، واليُسرى خُروجًا بِدُعاء: كُلُّ خُطوةٍ عِبادة." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith (entering & leaving)", ar: "حَديث (الدُّخولِ والخُروج)" },
          lines: [
            { en: "The Prophet ﷺ said: 'When one of you enters the mosque, let him say: O Allah, open for me the gates of Your mercy; and when he leaves, let him say: O Allah, I ask You of Your bounty.' — Muslim", ar: "قالَ النَّبِيُّ ﷺ: «إذا دَخَلَ أحَدُكُمُ المَسجِدَ فَليَقُل: اللّهُمَّ افتَحْ لي أبوابَ رَحمَتِك، وإذا خَرَجَ فَليَقُل: اللّهُمَّ إنّي أسألُكَ مِن فَضلِك» — مسلم" },
          ],
        },
        {
          label: { en: "Hadith (greeting the mosque)", ar: "حَديث (تَحيّةِ المَسجِد)" },
          lines: [
            { en: "The Prophet ﷺ said: 'When one of you enters the mosque, let him not sit until he prays two rak'ahs.' — Al-Bukhari & Muslim", ar: "قالَ النَّبِيُّ ﷺ: «إذا دَخَلَ أحَدُكُمُ المَسجِدَ فَلا يَجلِسْ حَتّى يُصَلِّيَ رَكعَتَين» — البخاري ومسلم" },
          ],
        },
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"O children of Adam, take your adornment at every place of prayer...\" — Al-A'raf 31", ar: "﴿يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِندَ كُلِّ مَسْجِدٍ...﴾ — الأعراف ٣١" },
          ],
        },
      ],
      callout: {
        label: { en: "Connect the rules", ar: "اربِطِ الآداب" },
        title: { en: "Why so much care over a single visit?", ar: "لِماذا كُلُّ هذه العِنايةِ بِزيارةٍ واحِدة؟" },
        body: {
          en: "From the foot you step with, to the du'a you say, to praying two rak'ahs before sitting, to leaving in peace — the Sunnah surrounds the whole visit with care. Argue what all these details have in common: what attitude of heart are they each training, and how does small, consistent adab shape a believer?",
          ar: "مِنَ القَدَمِ التي تَطَأُ بِها، إلى الدُّعاءِ الذي تَقولُه، إلى رَكعَتَينِ قَبلَ الجُلوس، إلى الخُروجِ بِسَلام — تُحيطُ السُّنّةُ الزِّيارةَ كُلَّها بِعِناية. حاجِجْ ما يَجمَعُ هذه التَّفاصيلَ كُلَّها: أيَّ حالِ قَلبٍ تُدَرِّبُ كُلُّ واحِدةٍ مِنها، وكَيفَ يُشَكِّلُ الأدَبُ الصَّغيرُ المُستَمِرُّ المُؤمِنَ؟",
        },
      },
      body: {
        en: "Because the mosque is the house of Allah, the Sunnah surrounds a visit to it with beautiful, deliberate manners — and each one trains the heart. Before even arriving, the believer prepares: 'take your adornment at every place of prayer' (Al-A'raf 31) means coming clean, in good clothing, and with a pleasant scent, never with the smell of food like raw onion or garlic that would disturb others, as the Prophet ﷺ instructed. We dress for Allah's house as we would for an honoured occasion, because that is exactly what every prayer is.\n\nAt the threshold, the believer enters with the right foot, saying, 'O Allah, open for me the gates of Your mercy.' Stepping into the mosque, you literally ask to step into mercy. Then comes a beautiful rule: do not sit down until you have prayed two rak'ahs, the 'greeting of the mosque' (tahiyyat al-masjid). The mosque is greeted not with words to the walls but with prayer to its Lord. While inside, the adab continues: keep the voice low, do not disturb others' prayer or recitation, do not pass directly in front of someone praying, keep the mosque clean, and never make it a place for buying and selling or raising worldly disputes.\n\nWhen leaving, the believer steps out with the left foot, saying, 'O Allah, I ask You of Your bounty' — a moving detail. Inside Allah's house we ask for mercy; as we return to the world to earn our living, we ask for His bounty. The whole visit is wrapped in remembrance of Allah from first step to last. A serious student should see that none of these rules are empty ritual. Each small act of adab is training the heart in reverence (ta'zim) — teaching us that how we behave in Allah's house reflects how seriously we take Allah Himself. The believer who masters these details is being shaped, visit after visit, into a person of humility and presence before their Lord.",
        ar: "لِأنَّ المَسجِدَ بَيتُ الله، أحاطَتِ السُّنّةُ زيارَتَهُ بِآدابٍ بَديعةٍ مَقصودة — وكُلُّ واحِدةٍ تُدَرِّبُ القَلب. فَقَبلَ الوُصولِ يَستَعِدُّ المُؤمِن: «خُذوا زينَتَكُم عِندَ كُلِّ مَسجِد» (الأعراف ٣١) يَعني المَجيءَ نَظيفًا، بِثِيابٍ حَسَنةٍ ورائِحةٍ طَيِّبة، لا بِرائِحةِ طَعامٍ كَالبَصَلِ أوِ الثّومِ النِّيءِ تُؤذي النّاس، كما أمَرَ النَّبِيُّ ﷺ. فَنَتَزَيَّنُ لِبَيتِ اللهِ كما نَتَزَيَّنُ لِمُناسَبةٍ مُكَرَّمة، لِأنَّ كُلَّ صَلاةٍ كَذلك.\n\nوعِندَ العَتَبةِ يَدخُلُ المُؤمِنُ بِاليُمنى قائِلًا: «اللّهُمَّ افتَحْ لي أبوابَ رَحمَتِك». فَبِدُخولِكَ المَسجِدَ تَسألُ حَرفيًّا أن تَدخُلَ في الرَّحمة. ثُمَّ يَأتي أدَبٌ جَميل: لا تَجلِسْ حَتّى تُصَلِّيَ رَكعَتَين، «تَحيّةَ المَسجِد». فالمَسجِدُ يُحَيّى لا بِكَلامٍ لِلجُدرانِ بل بِصَلاةٍ لِرَبِّه. وفي الدّاخِلِ يَستَمِرُّ الأدَب: خَفضُ الصَّوت، وعَدَمُ إيذاءِ صَلاةِ الآخَرينَ أو تِلاوَتِهِم، وألّا تَمُرَّ بَينَ يَدَيِ المُصَلّي، والحِفاظُ على نَظافَةِ المَسجِد، وألّا يُجعَلَ مَكانًا لِبَيعٍ وشِراءٍ أو خُصوماتٍ دُنيَوِيّة.\n\nوعِندَ الخُروجِ يَخرُجُ بِاليُسرى قائِلًا: «اللّهُمَّ إنّي أسألُكَ مِن فَضلِك» — وهي لَفتةٌ مُؤَثِّرة. فَفي بَيتِ اللهِ نَسألُ الرَّحمة؛ وإذ نَعودُ إلى الدُّنيا لِنَكسِبَ رِزقَنا نَسألُ فَضلَه. فالزِّيارةُ كُلُّها مَغمورةٌ بِذِكرِ اللهِ مِنَ الخُطوةِ الأولى إلى الأخيرة. وعلى الطّالِبِ الجادِّ أن يَرى أنَّ شَيئًا مِن هذه الآدابِ لَيسَ طَقسًا فارِغًا. فَكُلُّ أدَبٍ صَغيرٍ يُدَرِّبُ القَلبَ على التَّعظيم — يُعَلِّمُنا أنَّ سُلوكَنا في بَيتِ اللهِ يَعكِسُ مَدى تَعظيمِنا للهِ نَفسِه. والمُؤمِنُ الذي يُتقِنُ هذه التَّفاصيلَ يُشَكَّلُ، زيارةً بَعدَ زيارة، إنسانًا ذا تَواضُعٍ وحُضورٍ بَينَ يَدَي رَبِّه.",
      },
    },
    {
      title: { en: "Hearts attached to the mosque", ar: "قُلوبٌ مُعَلَّقةٌ بِالمَساجِد" },
      learningObjectives: [
        { en: "Explain the great reward for loving and frequenting the mosque.", ar: "أُبَيِّنُ عَظيمَ أجرِ مَحَبّةِ المَسجِدِ ومُلازَمَتِه." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "Open sky symbolising Allah's shade on the Day.", ar: "سَماءٌ مَفتوحةٌ تَرمُزُ إلى ظِلِّ اللهِ يَومَ القِيامة." },
        caption: { en: "One of the seven shaded on a day with no shade: a heart tied to the mosque.", ar: "أحَدُ السَّبعةِ المُظَلَّلينَ يَومَ لا ظِلَّ إلّا ظِلُّه: قَلبٌ مُعَلَّقٌ بِالمَسجِد." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"In houses Allah has ordered to be raised and that His name be mentioned therein; exalting Him within them in the morning and the evening are men whom neither commerce nor sale distracts from the remembrance of Allah...\" — An-Nur 36-37", ar: "﴿فِي بُيُوتٍ أَذِنَ اللَّهُ أَن تُرْفَعَ وَيُذْكَرَ فِيهَا اسْمُهُ يُسَبِّحُ لَهُ فِيهَا بِالْغُدُوِّ وَالْآصَالِ ۝ رِجَالٌ لَّا تُلْهِيهِمْ تِجَارَةٌ وَلَا بَيْعٌ عَن ذِكْرِ اللَّهِ...﴾ — النور ٣٦-٣٧" },
          ],
        },
        {
          label: { en: "Hadith (the seven shaded)", ar: "حَديث (السَّبعةُ المُظَلَّلون)" },
          lines: [
            { en: "Among the seven whom Allah will shade on the Day when there is no shade but His: '...a man whose heart is attached to the mosques,' and 'two who love one another for Allah's sake.' — Al-Bukhari & Muslim", ar: "مِنَ السَّبعةِ الذينَ يُظِلُّهُمُ اللهُ يَومَ لا ظِلَّ إلّا ظِلُّه: «...ورَجُلٌ قَلبُهُ مُعَلَّقٌ بِالمَساجِد»، و«رَجُلانِ تَحابّا في الله» — البخاري ومسلم" },
          ],
        },
      ],
      callout: {
        label: { en: "Examine the wording", ar: "تَأمَّلِ اللَّفظ" },
        title: { en: "Why 'heart attached' and not just 'often in the mosque'?", ar: "لِماذا «قَلبُهُ مُعَلَّق» لا مُجَرَّد «كَثيرِ الحُضور»؟" },
        body: {
          en: "The hadith praises the one whose heart is 'attached' (mu'allaq) to the mosque — as if the heart is left hanging there even when the body has gone home, longing to return. Analyse the difference between merely attending the mosque and having your heart tied to it. Which one earns Allah's shade, and why?",
          ar: "يَمدَحُ الحَديثُ مَن «قَلبُهُ مُعَلَّقٌ» بِالمَسجِد — كَأنَّ القَلبَ مُعَلَّقٌ هُناكَ حَتّى بَعدَ أن يَعودَ الجَسَدُ لِلبَيت، يَشتاقُ لِلرُّجوع. حَلِّلِ الفَرقَ بَينَ مُجَرَّدِ حُضورِ المَسجِدِ وبَينَ تَعَلُّقِ القَلبِ بِه. أيُّهُما يَنالُ ظِلَّ الله، ولِماذا؟",
        },
      },
      responsePrompt: {
        title: { en: "Written response", ar: "إجابةٌ مَكتوبة" },
        prompt: { en: "Explain what it means for a heart to be 'attached to the mosque,' using An-Nur 36-37 and the hadith of the seven. Then describe two practical habits that could attach your own heart to the masjid.", ar: "اشرَحْ ما مَعنى أن يَكونَ القَلبُ «مُعَلَّقًا بِالمَسجِد»، مُستَعمِلًا النورَ ٣٦-٣٧ وحَديثَ السَّبعة. ثُمَّ صِفْ عادَتَينِ عَمَلِيَّتَينِ تُعَلِّقانِ قَلبَكَ بِالمَسجِد." },
        placeholder: { en: "A heart attached to the mosque is one that... Two habits I could build are...", ar: "القَلبُ المُعَلَّقُ بِالمَسجِدِ هو الذي... وعادَتانِ يُمكِنُني بِناؤُهُما هُما..." },
      },
      body: {
        en: "The mosque is not only a place to perform duties; it is a place to fall in love with. Surat An-Nur describes the masjid as 'houses Allah has ordered to be raised and that His name be mentioned therein,' and then praises 'men whom neither commerce nor sale distracts from the remembrance of Allah.' These are people who do business and live full lives, yet their hearts are never truly pulled away from Allah and His house. The mosque has become the centre of gravity in their lives.\n\nThe Prophet ﷺ promised an astonishing reward for such love. On the Day of Judgement, when the sun is brought near and people are drowning in their sweat, Allah will shade seven kinds of people in His shade, 'on a day when there is no shade but His.' Among them is 'a man whose heart is attached to the mosques.' Reflect on that precise wording. It is not the man who merely walks in occasionally, but the man whose heart is mu'allaq — left hanging in the mosque even after he leaves, aching to return, counting the minutes until the next prayer. His body may be at work or at home, but his heart never fully departs Allah's house.\n\nThis teaches a profound truth: the highest etiquette of the mosque is love. All the outward manners — the right foot, the du'a, the two rak'ahs, the quiet voice — exist to nurture this inner attachment. A child taught only the rules may obey them coldly; a believer whose heart is attached keeps the rules joyfully, because they bring him closer to a place he loves. The same hadith lists 'two who love one another for Allah's sake,' reminding us that the mosque also binds believers together in brotherhood. A demanding student should set this as a personal goal: not merely to attend the mosque, but to let it capture the heart — for that captured heart is precisely what earns the shade of Allah on the Day when nothing else can shade us.",
        ar: "المَسجِدُ لَيسَ مَكانَ أداءِ واجِباتٍ فَحَسب؛ بل مَكانٌ يُحَبُّ ويُعشَق. تَصِفُ سورةُ النورِ المَسجِدَ بِأنَّهُ «بُيوتٌ أذِنَ اللهُ أن تُرفَعَ ويُذكَرَ فيها اسمُه»، ثُمَّ تَمدَحُ «رِجالًا لا تُلهيهِم تِجارةٌ ولا بَيعٌ عن ذِكرِ الله». فَهؤُلاءِ يَتاجِرونَ ويَعيشونَ حَياةً كامِلة، ومَعَ ذلك لا تُجذَبُ قُلوبُهُم حَقًّا عنِ اللهِ وبَيتِه. فقد صارَ المَسجِدُ مَركَزَ الثِّقَلِ في حَياتِهِم.\n\nووَعَدَ النَّبِيُّ ﷺ بِأجرٍ مُذهِلٍ لِهذا الحُبّ. فَيَومَ القِيامة، حينَ تُدنى الشَّمسُ ويَغرَقُ النّاسُ في عَرَقِهِم، يُظِلُّ اللهُ سَبعةَ أصنافٍ في ظِلِّه، «يَومَ لا ظِلَّ إلّا ظِلُّه». مِنهُم «رَجُلٌ قَلبُهُ مُعَلَّقٌ بِالمَساجِد». تَأمَّلْ دِقّةَ اللَّفظ. فَلَيسَ مَن يَدخُلُ أحيانًا فَقَط، بل مَن قَلبُهُ مُعَلَّقٌ — باقٍ في المَسجِدِ حَتّى بَعدَ أن يَخرُج، يَتوقُ لِلعَودة، يَعُدُّ الدَّقائِقَ لِلصَّلاةِ التّالية. قد يَكونُ جَسَدُهُ في العَمَلِ أوِ البَيت، لكِنَّ قَلبَهُ لا يُفارِقُ بَيتَ اللهِ تَمامًا.\n\nويُعَلِّمُنا هذا حَقيقةً عَميقة: أرفَعُ آدابِ المَسجِدِ المَحَبّة. فَكُلُّ الآدابِ الظّاهِرةِ — اليُمنى، والدُّعاء، والرَّكعَتان، وخَفضُ الصَّوت — وُجِدَت لِتُغَذِّيَ هذا التَّعَلُّقَ الباطِن. فالطِّفلُ الذي يُعَلَّمُ القَواعِدَ وَحدَها قد يُطيعُها بِبُرود؛ والمُؤمِنُ المُعَلَّقُ قَلبُهُ يَحفَظُها بِفَرَح، لِأنَّها تُقَرِّبُهُ مِن مَكانٍ يُحِبُّه. وذَكَرَ الحَديثُ نَفسُهُ «رَجُلَينِ تَحابّا في الله»، يُذَكِّرُنا أنَّ المَسجِدَ يَجمَعُ المُؤمِنينَ أيضًا في أُخُوّة. وعلى الطّالِبِ المُطالِبِ أن يَجعَلَ هذا هَدَفًا شَخصيًّا: لا مُجَرَّدَ حُضورِ المَسجِد، بل أن يَدَعَهُ يَأسِرُ القَلب — فَذلك القَلبُ الأسيرُ هو بِالضَّبطِ ما يَنالُ ظِلَّ اللهِ يَومَ لا يُظِلُّنا سِواه.",
      },
    },
    {
      title: { en: "The mosque that built a nation", ar: "المَسجِدُ الذي بَنى أُمّة" },
      learningObjectives: [
        { en: "Explain the social and communal roles of the mosque from the Seerah.", ar: "أُبَيِّنُ الأدوارَ الاجتِماعيّةَ والجَماعيّةَ لِلمَسجِدِ مِنَ السّيرة." },
      ],
      image: {
        src: IMG.greenValley,
        alt: { en: "A gathering place at the heart of a community.", ar: "مَكانُ اجتِماعٍ في قَلبِ مُجتَمَع." },
        caption: { en: "The Prophet's first act in Madinah: build the mosque, then build the Ummah.", ar: "أوَّلُ أعمالِ النَّبِيِّ ﷺ في المَدينة: بِناءُ المَسجِد، ثُمَّ بِناءُ الأُمّة." },
      },
      infoBoxes: [
        {
          label: { en: "Seerah", ar: "السّيرة" },
          lines: [
            { en: "On reaching Madinah, the very first institution the Prophet ﷺ established was the Mosque (Masjid an-Nabawi). From it he led prayer, taught, judged disputes, received delegations, cared for the poor and travellers (Ahl as-Suffah), and organised the community.", ar: "حينَ بَلَغَ المَدينةَ، كانَ أوَّلَ مُؤَسَّسةٍ أقامَها النَّبِيُّ ﷺ المَسجِدَ (المَسجِدَ النَّبَوِيّ). مِنهُ أمَّ الصَّلاة، وعَلَّمَ، وقَضى بَينَ الخُصوم، واستَقبَلَ الوُفود، ورَعى الفُقَراءَ وعابِري السَّبيل (أهلَ الصُّفّة)، ونَظَّمَ المُجتَمَع." },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: 'Whoever builds a mosque for Allah, Allah will build for him the like of it in Paradise.' — Al-Bukhari & Muslim", ar: "قالَ النَّبِيُّ ﷺ: «مَن بَنى مَسجِدًا للهِ بَنى اللهُ لَهُ مِثلَهُ في الجَنّة» — البخاري ومسلم" },
          ],
        },
      ],
      callout: {
        label: { en: "Apply to the UAE", ar: "طَبِّقْ على الإمارات" },
        title: { en: "Is the mosque only for prayer?", ar: "أالمَسجِدُ لِلصَّلاةِ فَقَط؟" },
        body: {
          en: "In the Prophet's Madinah, the mosque was the school, the court, the welfare centre, and the meeting hall — all centred on worship. Reflect on the mosques of the UAE today: how can a modern masjid still be a centre of learning, charity, and community, and what role could you play in keeping it alive?",
          ar: "في مَدينةِ النَّبِيِّ ﷺ كانَ المَسجِدُ المَدرَسةَ والمَحكَمةَ ومَركَزَ الرِّعايةِ وقاعةَ الاجتِماع — كُلَّها حَولَ العِبادة. تَأمَّلْ مَساجِدَ الإماراتِ اليَوم: كَيفَ يَبقى المَسجِدُ الحَديثُ مَركَزَ عِلمٍ وصَدَقةٍ ومُجتَمَع، وأيَّ دَورٍ يُمكِنُكَ أن تُؤَدِّيَهُ لِإبقائِهِ حَيًّا؟",
        },
      },
      body: {
        en: "To understand how central the mosque is, look at the Prophet's very first act on arriving in Madinah after the migration. He did not first build a palace, a fortress, or a marketplace. He built a mosque. The Masjid an-Nabawi was a simple structure of palm trunks and mud, yet from it flowed an entire civilisation. This single choice reveals the mosque's true place in Islam: it is the foundation on which a Muslim community is built.\n\nFrom that mosque, the Prophet ﷺ did far more than lead the five prayers. It was the first school of Islam, where the Companions learned the Qur'an and the Sunnah directly from him. It was the courthouse where he settled disputes with justice. It was the assembly hall where he received delegations and consulted his people. It was a welfare centre: at its side lived the Ahl as-Suffah, poor and homeless Companions whom the community fed and taught. The mosque was, in short, the beating heart of the city — a place of worship that radiated learning, justice, charity, and brotherhood into every corner of life.\n\nThis history teaches us that mosque etiquette is not only about personal manners but about a shared treasure. The Prophet ﷺ promised that 'whoever builds a mosque for Allah, Allah will build for him the like of it in Paradise' — and 'building' includes caring for it, cleaning it, attending it, and keeping it alive with worship and good. In the UAE, where beautiful mosques stand in every neighbourhood, this legacy continues: the masjid remains a place of prayer, Qur'an classes, charity drives, and community gathering. A serious student should see their own role in this. To honour the mosque's etiquette is to protect something the Prophet ﷺ planted with his own hands — and to keep alive, in our own time, the institution that once turned a scattered people into a single Ummah.",
        ar: "لِتُدرِكَ مَركَزِيّةَ المَسجِد، انظُرْ إلى أوَّلِ أعمالِ النَّبِيِّ ﷺ حينَ بَلَغَ المَدينةَ بَعدَ الهِجرة. لم يَبنِ أوَّلًا قَصرًا ولا حِصنًا ولا سوقًا. بَنى مَسجِدًا. كانَ المَسجِدُ النَّبَوِيُّ بِناءً بَسيطًا مِن جُذوعِ النَّخلِ والطِّين، ومَعَ ذلك تَدَفَّقَت مِنهُ حَضارةٌ كامِلة. ويَكشِفُ هذا الاختِيارُ الواحِدُ مَكانةَ المَسجِدِ الحَقّةَ في الإسلام: فَهو الأساسُ الذي يُبنى عليهِ المُجتَمَعُ المُسلِم.\n\nومِن ذلك المَسجِدِ فَعَلَ النَّبِيُّ ﷺ أكثَرَ بِكَثيرٍ مِن إمامةِ الصَّلَواتِ الخَمس. كانَ أوَّلَ مَدرَسةٍ لِلإسلام، تَعَلَّمَ فيها الصَّحابةُ القُرآنَ والسُّنّةَ مِنهُ مُباشَرةً. وكانَ المَحكَمةَ التي قَضى فيها بِالعَدلِ بَينَ الخُصوم. وكانَ قاعةَ المَجلِسِ التي استَقبَلَ فيها الوُفودَ وشاوَرَ قَومَه. وكانَ مَركَزَ رِعاية: فَإلى جانِبِهِ سَكَنَ أهلُ الصُّفّة، فُقَراءُ الصَّحابةِ ومَن لا مَأوى لَهُم، يُطعِمُهُمُ المُجتَمَعُ ويُعَلِّمُهُم. كانَ المَسجِدُ بِاختِصارٍ قَلبَ المَدينةِ النّابِض — مَكانَ عِبادةٍ يُشِعُّ عِلمًا وعَدلًا وصَدَقةً وأُخُوّةً في كُلِّ زاوِيةٍ مِنَ الحَياة.\n\nويُعَلِّمُنا هذا التّاريخُ أنَّ أدَبَ المَسجِدِ لَيسَ شَأنًا فَردِيًّا فَحَسب بل صَونًا لِكَنزٍ مُشتَرَك. وعَدَ النَّبِيُّ ﷺ أنَّ «مَن بَنى مَسجِدًا للهِ بَنى اللهُ لَهُ مِثلَهُ في الجَنّة» — و«البِناءُ» يَشمَلُ رِعايَتَهُ وتَنظيفَهُ والحُضورَ إليهِ وإبقاءَهُ حَيًّا بِالعِبادةِ والخَير. وفي الإماراتِ، حَيثُ تَقومُ مَساجِدُ بَديعةٌ في كُلِّ حَيّ، يَستَمِرُّ هذا الإرث: فَيَبقى المَسجِدُ مَكانَ صَلاةٍ وحِلَقِ قُرآنٍ وحَملاتِ صَدَقةٍ ولِقاءِ مُجتَمَع. وعلى الطّالِبِ الجادِّ أن يَرى دَورَهُ في هذا. فَتَكريمُ أدَبِ المَسجِدِ صَونٌ لِشَيءٍ غَرَسَهُ النَّبِيُّ ﷺ بِيَدَيه — وإبقاءٌ، في زَمانِنا، لِلمُؤَسَّسةِ التي صَيَّرَت يَومًا قَومًا مُتَفَرِّقينَ أُمّةً واحِدة.",
      },
    },
    {
      title: { en: "Synthesis: reverence made visible", ar: "تَركيبٌ: تَعظيمٌ مَرئيّ" },
      learningObjectives: [
        { en: "Synthesise the status, etiquette, reward, and role of the mosque into one understanding.", ar: "أُرَكِّبُ مَكانةَ المَسجِدِ وآدابَهُ وأجرَهُ ودَورَهُ في فَهمٍ واحِد." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque welcoming worshippers at prayer time.", ar: "مَسجِدٌ يَستَقبِلُ المُصَلّينَ وَقتَ الصَّلاة." },
        caption: { en: "Every act of adab is reverence for Allah made visible.", ar: "كُلُّ أدَبٍ هو تَعظيمٌ للهِ صارَ مَرئيًّا." },
      },
      matchingActivity: {
        title: { en: "Match the text to its lesson on the mosque", ar: "طابِقِ النَّصَّ بِدَرسِهِ في المَسجِد" },
        instruction: { en: "Connect each text to the truth it teaches about the masjid.", ar: "اربِطْ كُلَّ نَصٍّ بِالحَقيقةِ التي يُعَلِّمُها عنِ المَسجِد." },
        prompts: [
          { en: "At-Tawbah 18: 'only maintained by those who believe...'", ar: "التوبة ١٨: «إنَّما يَعمُرُ مَساجِدَ اللهِ مَن آمَنَ...»" },
          { en: "'do not sit until you pray two rak'ahs'", ar: "«لا يَجلِسْ حَتّى يُصَلِّيَ رَكعَتَين»" },
          { en: "'a man whose heart is attached to the mosques'", ar: "«رَجُلٌ قَلبُهُ مُعَلَّقٌ بِالمَساجِد»" },
          { en: "The Prophet ﷺ built the mosque first in Madinah", ar: "بَنى النَّبِيُّ ﷺ المَسجِدَ أوَّلًا في المَدينة" },
        ].map((p, i) => ({
          prompt: p,
          answer: [
            { en: "The mosque is truly kept alive by sincere faith, not bricks alone.", ar: "المَسجِدُ يُعمَرُ حَقًّا بِالإيمانِ الصّادِقِ لا بِالحِجارةِ وَحدَها." },
            { en: "Greet the house of Allah with prayer, not idle sitting.", ar: "حَيِّ بَيتَ اللهِ بِالصَّلاةِ لا بِالجُلوسِ العابِث." },
            { en: "Loving the mosque earns Allah's shade on the Day.", ar: "حُبُّ المَسجِدِ يَنالُ ظِلَّ اللهِ يَومَ القِيامة." },
            { en: "The mosque is the foundation of the whole community.", ar: "المَسجِدُ أساسُ المُجتَمَعِ كُلِّه." },
          ][i],
        })),
      },
      groupTasks: {
        title: { en: "Collaborative inquiry", ar: "تَحَرٍّ جَماعِيّ" },
        instruction: { en: "Each group produces one practical outcome about mosque life.", ar: "تُنتِجُ كُلُّ مَجموعةٍ ناتِجًا عَمَلِيًّا واحِدًا عن حَياةِ المَسجِد." },
        groups: [
          {
            slug: "adab-guide",
            name: { en: "Team A — A visitor's adab guide", ar: "الفَريقُ أ — دَليلُ آدابِ الزّائِر" },
            learningObjective: { en: "Produce a clear etiquette guide for entering, being in, and leaving the mosque.", ar: "نُنتِجُ دَليلَ آدابٍ واضِحًا لِدُخولِ المَسجِدِ والمُكثِ فيهِ والخُروجِ مِنه." },
            task: { en: "Turn the Sunnah etiquettes into a friendly step-by-step guide a new Muslim student could follow.", ar: "حَوِّلوا آدابَ السُّنّةِ إلى دَليلٍ خُطوةً خُطوةً وَدودٍ يَتبَعُهُ طالِبٌ مُسلِمٌ جَديد." },
            evidence: [
              { en: "Hadith of entering/leaving du'as; greeting the mosque; Al-A'raf 31.", ar: "حَديثُ دُعاءِ الدُّخولِ والخُروج؛ تَحيّةُ المَسجِد؛ الأعراف ٣١." },
            ],
            sourceNotes: [
              { en: "Right foot + mercy du'a in; left foot + bounty du'a out.", ar: "اليُمنى مَعَ دُعاءِ الرَّحمةِ دُخولًا؛ واليُسرى مَعَ دُعاءِ الفَضلِ خُروجًا." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A one-page illustrated 'Mosque adab' guide.", ar: "دَليلُ «آدابِ المَسجِد» مُصَوَّرٌ مِن صَفحة." },
          },
          {
            slug: "living-mosque",
            name: { en: "Team B — Keeping our mosque alive", ar: "الفَريقُ ب — إبقاءُ مَسجِدِنا حَيًّا" },
            learningObjective: { en: "Plan ways students can help their local mosque thrive, as in Madinah.", ar: "نُخَطِّطُ سُبُلًا لِيُسهِمَ الطُّلّابُ في ازدِهارِ مَسجِدِهِم، كَما في المَدينة." },
            task: { en: "Propose three realistic activities (learning, charity, cleanliness, community) to make your mosque a centre of life.", ar: "اقتَرِحوا ثَلاثَ أنشِطةٍ واقِعيّةٍ (عِلمٍ، صَدَقةٍ، نَظافةٍ، مُجتَمَعٍ) لِجَعلِ مَسجِدِكُم مَركَزَ حَياة." },
            evidence: [
              { en: "Seerah: the Prophet's mosque as school, court, welfare; hadith on building a mosque.", ar: "السّيرة: مَسجِدُ النَّبِيِّ مَدرَسةً ومَحكَمةً ورِعايةً؛ حَديثُ بِناءِ المَسجِد." },
            ],
            sourceNotes: [
              { en: "'Building' includes caring for and enlivening the mosque.", ar: "«البِناءُ» يَشمَلُ رِعايةَ المَسجِدِ وإحياءَه." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A three-point plan to enliven the local mosque.", ar: "خِطّةٌ مِن ثَلاثِ نِقاطٍ لِإحياءِ المَسجِدِ المَحَلِّيّ." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final synthesis", ar: "التَّركيبُ الخِتامِيّ" },
        prompt: { en: "Bring the lesson together: how do the status of the mosque, its etiquette, the reward of loving it, and its role in building the community all flow from one idea — reverence for Allah? Write a developed paragraph.", ar: "اجمَعِ الدَّرس: كَيفَ تَنبَعُ مَكانةُ المَسجِدِ وآدابُهُ وأجرُ حُبِّهِ ودَورُهُ في بِناءِ المُجتَمَع، كُلُّها مِن فِكرةٍ واحِدة — تَعظيمِ الله؟ اكتُبْ فِقرةً مُكتَمِلة." },
        placeholder: { en: "Every etiquette of the mosque flows from one root, which is...", ar: "كُلُّ أدَبٍ لِلمَسجِدِ يَنبَعُ مِن أصلٍ واحِدٍ هو..." },
      },
      body: {
        en: "Draw the lesson together around a single idea: every etiquette of the mosque is reverence for Allah made visible. We began with the mosque's status — 'the most beloved of places to Allah,' a house attributed to Him, truly maintained not by donors but by sincere believers. From that status flows the adab: we prepare and dress for it, enter with the right foot begging for mercy, greet it with two rak'ahs, keep it clean and quiet, and leave with the left foot asking for bounty. None of these are arbitrary; each is the body's way of showing the heart's awe for the One whose house this is.\n\nFrom that reverence grows love, and love earns the highest reward: to be among the seven shaded by Allah on the Day when there is no shade but His, because one's heart was 'attached to the mosques.' And from that love grows community, for the Prophet ﷺ made the mosque the very first foundation of Madinah — its school, court, welfare centre, and meeting place — turning a scattered people into one Ummah. The matching activity asks you to fix each text to its lesson; the group work asks you to write a real adab guide and a real plan to enliven your mosque; and this synthesis returns it to you. The point of studying mosque etiquette is not to memorise rules but to become the kind of believer the rules are training: someone whose outward manners reveal an inward reverence, whose heart is tied to the house of Allah, and who helps keep that house a living heart for the whole community. A demanding student leaves this lesson resolved not merely to behave well in the mosque, but to love it as the Companions did — and to guard, in their own neighbourhood, what the Prophet ﷺ built with his own hands.",
        ar: "اجمَعِ الدَّرسَ حَولَ فِكرةٍ واحِدة: كُلُّ أدَبٍ لِلمَسجِدِ هو تَعظيمٌ للهِ صارَ مَرئيًّا. بَدَأنا بِمَكانةِ المَسجِد — «أحَبِّ البِقاعِ إلى الله»، بَيتٍ مَنسوبٍ إليه، يُعمَرُ حَقًّا لا بِالمُتَبَرِّعينَ بل بِالمُؤمِنينَ الصّادِقين. ومِن هذه المَكانةِ تَنبَعُ الآداب: نَستَعِدُّ ونَتَزَيَّنُ لَه، ونَدخُلُ بِاليُمنى نَستَجدي الرَّحمة، ونُحَيّيهِ بِرَكعَتَين، ونُبقيهِ نَظيفًا هادِئًا، ونَخرُجُ بِاليُسرى نَسألُ الفَضل. ولَيسَ شَيءٌ مِن هذا اعتِباطًا؛ بل كُلُّهُ طَريقةُ الجَسَدِ في إظهارِ هَيبةِ القَلبِ لِمَن هذا بَيتُه.\n\nومِن هذا التَّعظيمِ تَنمو المَحَبّة، والمَحَبّةُ تَنالُ أعلى الأجر: أن تَكونَ مِنَ السَّبعةِ الذينَ يُظِلُّهُمُ اللهُ يَومَ لا ظِلَّ إلّا ظِلُّه، لِأنَّ قَلبَهُ كانَ «مُعَلَّقًا بِالمَساجِد». ومِن هذه المَحَبّةِ يَنمو المُجتَمَع، فقد جَعَلَ النَّبِيُّ ﷺ المَسجِدَ أوَّلَ أساسٍ لِلمَدينة — مَدرَسَتَها ومَحكَمَتَها ومَركَزَ رِعايَتِها ومُلتَقاها — فَصَيَّرَ قَومًا مُتَفَرِّقينَ أُمّةً واحِدة. تَطلُبُ مِنكَ المُطابَقةُ أن تُثَبِّتَ كُلَّ نَصٍّ بِدَرسِه؛ ويَطلُبُ العَمَلُ الجَماعِيُّ أن تَكتُبَ دَليلَ آدابٍ حَقيقيًّا وخِطّةً حَقيقيّةً لِإحياءِ مَسجِدِك؛ وهذا التَّركيبُ يَرُدُّهُ إليك. فَغايةُ دِراسةِ أدَبِ المَسجِدِ لَيسَت حِفظَ قَواعِدَ بل أن تَصيرَ المُؤمِنَ الذي تُدَرِّبُهُ القَواعِد: مَن تَكشِفُ آدابُهُ الظّاهِرةُ تَعظيمًا باطِنًا، ومَن قَلبُهُ مُعَلَّقٌ بِبَيتِ الله، ومَن يُعينُ على إبقاءِ ذلك البَيتِ قَلبًا حَيًّا لِلمُجتَمَعِ كُلِّه. والطّالِبُ المُطالِبُ يُغادِرُ هذا الدَّرسَ عازِمًا لا على حُسنِ السُّلوكِ في المَسجِدِ فَحَسب، بل على حُبِّهِ كما أحَبَّهُ الصَّحابة — وعلى أن يَصونَ، في حَيِّهِ، ما بَناهُ النَّبِيُّ ﷺ بِيَدَيه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "According to At-Tawbah 18, who truly 'maintains' (ya'mur) the mosques of Allah?", ar: "بِحَسَبِ التَّوبةِ ١٨، مَن «يَعمُرُ» مَساجِدَ اللهِ حَقًّا؟" },
      options: [
        { en: "Those who believe, establish prayer, give zakah, and fear none but Allah", ar: "مَن آمَنَ وأقامَ الصَّلاةَ وآتى الزَّكاةَ ولم يَخشَ إلّا الله" },
        { en: "Only the wealthiest donors", ar: "أغنى المُتَبَرِّعينَ فَقَط" },
        { en: "Only professional builders", ar: "البَنّاؤونَ المُحتَرِفونَ فَقَط" },
        { en: "Anyone who visits once a year", ar: "كُلُّ مَن يَزورُ مَرّةً في العام" },
      ],
      correctIndex: 0,
      explanation: { en: "I'mar means filling the mosque with sincere worship, not merely funding or building it.", ar: "العِمارةُ مَلءُ المَسجِدِ بِالعِبادةِ الصّادِقة، لا مُجَرَّدُ تَمويلِهِ أو بِنائِه." },
    },
    {
      prompt: { en: "What should a believer do upon entering the mosque before sitting down?", ar: "ماذا يَفعَلُ المُؤمِنُ عِندَ دُخولِ المَسجِدِ قَبلَ أن يَجلِس؟" },
      options: [
        { en: "Pray two rak'ahs (tahiyyat al-masjid)", ar: "يُصَلّي رَكعَتَين (تَحيّةَ المَسجِد)" },
        { en: "Begin trading and selling", ar: "يَبدَأُ البَيعَ والشِّراء" },
        { en: "Raise his voice loudly", ar: "يَرفَعُ صَوتَهُ عالِيًا" },
        { en: "Walk in front of those praying", ar: "يَمُرُّ بَينَ يَدَيِ المُصَلّين" },
      ],
      correctIndex: 0,
      explanation: { en: "'Let him not sit until he prays two rak'ahs' — the mosque is greeted with prayer, not idle sitting.", ar: "«فَلا يَجلِسْ حَتّى يُصَلِّيَ رَكعَتَين» — يُحَيّى المَسجِدُ بِالصَّلاةِ لا بِالجُلوس." },
    },
    {
      prompt: { en: "Which du'a is said when entering the mosque?", ar: "أيُّ دُعاءٍ يُقالُ عِندَ دُخولِ المَسجِد؟" },
      options: [
        { en: "'O Allah, open for me the gates of Your mercy'", ar: "«اللّهُمَّ افتَحْ لي أبوابَ رَحمَتِك»" },
        { en: "'O Allah, I ask You of Your bounty'", ar: "«اللّهُمَّ إنّي أسألُكَ مِن فَضلِك»" },
        { en: "There is no du'a for entering", ar: "لا دُعاءَ لِلدُّخول" },
        { en: "Only a greeting to the people", ar: "مُجَرَّدُ سَلامٍ على النّاس" },
      ],
      correctIndex: 0,
      explanation: { en: "Entering, we ask for mercy; leaving, we say 'O Allah, I ask You of Your bounty' as we return to earn a living.", ar: "دُخولًا نَسألُ الرَّحمة؛ وخُروجًا نَقول «اللّهُمَّ إنّي أسألُكَ مِن فَضلِك» إذ نَعودُ لِلكَسب." },
    },
    {
      prompt: { en: "What does 'a man whose heart is attached to the mosques' describe?", ar: "ماذا يَصِفُ «رَجُلٌ قَلبُهُ مُعَلَّقٌ بِالمَساجِد»؟" },
      options: [
        { en: "One who loves the mosque so deeply his heart longs to return to it", ar: "مَن يُحِبُّ المَسجِدَ حُبًّا عَميقًا حَتّى يَتوقَ قَلبُهُ لِلعَودةِ إليه" },
        { en: "One who only visits to do business", ar: "مَن يَزورُهُ لِلتِّجارةِ فَقَط" },
        { en: "One who sleeps in the mosque all day", ar: "مَن يَنامُ في المَسجِدِ طَوالَ اليَوم" },
        { en: "One who never prays at all", ar: "مَن لا يُصَلّي أبَدًا" },
      ],
      correctIndex: 0,
      explanation: { en: "He is among the seven Allah will shade on the Day when there is no shade but His.", ar: "هو أحَدُ السَّبعةِ الذينَ يُظِلُّهُمُ اللهُ يَومَ لا ظِلَّ إلّا ظِلُّه." },
    },
    {
      prompt: { en: "What was the first thing the Prophet ﷺ established on arriving in Madinah?", ar: "ما أوَّلُ ما أقامَهُ النَّبِيُّ ﷺ عِندَ وُصولِهِ المَدينة؟" },
      options: [
        { en: "The mosque, which became the centre of the whole community", ar: "المَسجِد، الذي صارَ مَركَزَ المُجتَمَعِ كُلِّه" },
        { en: "A marketplace", ar: "سوقًا" },
        { en: "A fortress", ar: "حِصنًا" },
        { en: "A palace for himself", ar: "قَصرًا لِنَفسِه" },
      ],
      correctIndex: 0,
      explanation: { en: "From the mosque he taught, judged, cared for the poor, and built the Ummah — worship at the heart of community life.", ar: "مِنَ المَسجِدِ عَلَّمَ وقَضى ورَعى الفُقَراءَ وبَنى الأُمّة — والعِبادةُ في قَلبِ حَياةِ المُجتَمَع." },
    },
    {
      prompt: { en: "True or False: The highest etiquette of the mosque is simply following rules coldly, without any love for it.", ar: "صَوابٌ أم خَطأ: أرفَعُ آدابِ المَسجِدِ مُجَرَّدُ اتِّباعِ القَواعِدِ بِبُرودٍ بِلا حُبٍّ لَه." },
      options: [
        { en: "False — the rules exist to nurture a heart attached to the mosque out of love", ar: "خَطأ — القَواعِدُ وُجِدَت لِتُغَذِّيَ قَلبًا مُعَلَّقًا بِالمَسجِدِ حُبًّا" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "All outward adab serves the inner goal: reverence and love for the house of Allah.", ar: "كُلُّ أدَبٍ ظاهِرٍ يَخدُمُ الغايةَ الباطِنة: تَعظيمَ بَيتِ اللهِ وحُبَّه." },
    },
  ],
};
