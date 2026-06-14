import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const battleOfBadr: CourseLesson = {
  slug: "g6y7-the-great-battle-of-badr",
  name: { en: "The Great Battle of Badr", ar: "غَزوةُ بَدرٍ الكُبرى" },
  shortIntro: {
    en: "The Day of Criterion (Yawm al-Furqan): how 313 ill-equipped believers, with Allah's help, defeated a much larger Quraysh army in the second year after the Hijrah. A deep study of the causes, the events, and the timeless lessons of faith, reliance on Allah, and the means of victory.",
    ar: "يَومُ الفُرقان: كَيفَ انتَصَرَ ثَلاثُمِئةٍ وثَلاثةَ عَشَرَ مُؤمِنًا قَليلي العُدّةِ، بِعَونِ الله، على جَيشِ قُرَيشٍ الأكبَرِ في السَّنةِ الثّانيةِ لِلهِجرة. دِراسةٌ عَميقةٌ لِأسبابِها وأحداثِها ودُروسِها الخالِدةِ في الإيمانِ والتَّوَكُّلِ وأخذِ الأسباب.",
  },
  quranSurahs: ["Al-Anfal 9", "Al-Anfal 17", "Aal 'Imran 123"],
  sections: [
    {
      title: { en: "The road to Badr: causes and setting", ar: "الطَّريقُ إلى بَدر: الأسبابُ والسِّياق" },
      learningObjectives: [
        { en: "Explain the background and causes that led to Badr.", ar: "أُبَيِّنُ خَلفيّةَ بَدرٍ وأسبابَها." },
        { en: "Describe the two opposing forces.", ar: "أصِفُ الجَيشَينِ المُتَقابِلَين." },
      ],
      successCriteria: [
        { en: "I can state when and why Badr happened.", ar: "أذكُرُ مَتى ولِماذا وَقَعَت بَدر." },
        { en: "I can compare the size of the two armies.", ar: "أُقارِنُ حَجمَ الجَيشَين." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A desert valley at dawn, like the plain of Badr.", ar: "وادٍ صَحراويٌّ عِندَ الفَجر، كَأرضِ بَدر." },
        caption: { en: "Badr: a valley between Makkah and Madinah, in Ramadan, year 2 AH.", ar: "بَدرٌ: وادٍ بَينَ مَكّةَ والمَدينة، في رَمَضان، سَنةَ ٢ هـ." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why was Badr a turning point?", ar: "لِماذا كانَت بَدرٌ نُقطةَ تَحَوُّل؟" },
        body: {
          en: "Before Badr, the Muslims were a persecuted, expelled minority. Argue why a single battle could transform the standing of the young Muslim community and why Allah called it 'the Day of Criterion' (Yawm al-Furqan) that separated truth from falsehood.",
          ar: "قَبلَ بَدرٍ كانَ المُسلِمونَ أقَلِّيّةً مُضطَهَدةً مُخرَجةً مِن دِيارِها. حاجِجْ لِماذا تُحَوِّلُ مَعرَكةٌ واحِدةٌ مَكانةَ الأُمّةِ الفَتيّة، ولِماذا سَمّاها اللهُ «يَومَ الفُرقان» الذي فَرَّقَ بَينَ الحَقِّ والباطِل.",
        },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And Allah had already given you victory at Badr while you were few in number; so fear Allah that you may be grateful.\" — Aal 'Imran 123", ar: "﴿ولَقَد نَصَرَكُمُ اللهُ بِبَدرٍ وأنتُم أذِلّةٌ ۖ فاتَّقوا اللهَ لَعَلَّكُم تَشكُرون﴾ — آل عمران ١٢٣" },
          ],
        },
        {
          label: { en: "Key facts", ar: "حَقائِقُ مِفتاحيّة" },
          lines: [
            { en: "Date: 17 Ramadan, 2 AH. Muslims: ~313, with 2 horses and ~70 camels. Quraysh: ~1000, well-armed, with 100+ horses. Place: the wells of Badr.", ar: "التّاريخ: ١٧ رَمَضان ٢ هـ. المُسلِمون: نَحوَ ٣١٣، بِفَرَسَينِ ونَحوِ ٧٠ بَعيرًا. قُرَيش: نَحوَ ١٠٠٠، كامِلو السِّلاح، بِأكثَرَ مِن ١٠٠ فَرَس. المَكان: آبارُ بَدر." },
          ],
        },
      ],
      body: {
        en: "The Battle of Badr took place on the 17th of Ramadan in the second year after the Hijrah, and it was the first major military encounter between the Muslims and the disbelievers of Quraysh. To understand it, we must remember the situation of the Muslims at the time. They had been persecuted in Makkah for thirteen years, tortured, boycotted, and finally forced to abandon their homes and wealth and migrate to Madinah. Quraysh had seized the property the Muhajirun left behind. The young Muslim community in Madinah was small, poor, and surrounded by enemies.\n\nThe immediate cause of the battle was a large Quraysh trade caravan returning from Syria, led by Abu Sufyan. The Prophet ﷺ set out with a modest group, intending to intercept the caravan as a measure against the Quraysh who had wronged and expelled them. But Abu Sufyan, learning of this, changed his route and sent urgent word to Makkah calling for help. Although the caravan escaped safely, the leaders of Quraysh — driven by arrogance and a desire to crush the Muslims once and for all — marched out anyway with a large, well-armed army of around a thousand men. So what began as a small expedition became a decisive confrontation that Allah Himself had decreed.\n\nThe contrast between the two sides was stark. The Muslims numbered only about 313, with just two horses and around seventy camels that they took turns riding. They were lightly armed and had not set out expecting a full battle. Facing them was an army of roughly a thousand experienced, heavily-armed Makkan fighters with over a hundred horses, marching with pride, music, and confidence. By every worldly measure, the Muslims were hopelessly outmatched. Yet Allah describes them in the Qur'an as 'few' and 'lowly' in the eyes of the world — 'while you were few in number' — precisely to highlight that the victory which followed could only have come from Him. A demanding student should grasp from the outset that Badr was not a story of military strength, but a demonstration of what Allah does for a small band of sincere believers who obey Him and rely upon Him. This sets the stage for the events of the battle itself.",
        ar: "وَقَعَت غَزوةُ بَدرٍ في السّابِعَ عَشَرَ مِن رَمَضانَ في السَّنةِ الثّانيةِ لِلهِجرة، وكانَت أوَّلَ لِقاءٍ عَسكَريٍّ كَبيرٍ بَينَ المُسلِمينَ وكُفّارِ قُرَيش. ولِفَهمِها يَجِبُ أن نَتَذَكَّرَ حالَ المُسلِمينَ حينَئِذ. فقد اضطُهِدوا في مَكّةَ ثَلاثَ عَشرةَ سَنة، وعُذِّبوا، وحوصِروا، ثُمَّ أُكرِهوا على تَركِ دِيارِهِم وأموالِهِم والهِجرةِ إلى المَدينة. واستَولَت قُرَيشٌ على ما تَرَكَهُ المُهاجِرون. وكانَتِ الأُمّةُ الفَتيّةُ في المَدينةِ صَغيرةً فَقيرةً مُحاطةً بِالأعداء.\n\nوكانَ السَّبَبُ المُباشِرُ لِلمَعرَكةِ قافِلةً تِجاريّةً كَبيرةً لِقُرَيشٍ عائِدةً مِنَ الشّامِ بِقِيادةِ أبي سُفيان. خَرَجَ النَّبِيُّ ﷺ في جَماعةٍ يَسيرةٍ قاصِدًا اعتِراضَ القافِلةِ كَإجراءٍ تُجاهَ قُرَيشٍ التي ظَلَمَتهُم وأخرَجَتهُم. لكِنَّ أبا سُفيان، حينَ عَلِمَ بِذلك، غَيَّرَ طَريقَهُ وأرسَلَ يَستَنجِدُ مَكّة. ومَعَ أنَّ القافِلةَ نَجَت سالِمة، خَرَجَ ساداتُ قُرَيش — بِدافِعِ الكِبرِ والرَّغبةِ في سَحقِ المُسلِمينَ مَرّةً واحِدة — بِجَيشٍ كَبيرٍ كامِلِ السِّلاحِ نَحوَ ألفِ رَجُل. فَما بَدَأَ بَعثًا صَغيرًا صارَ مُواجَهةً فاصِلةً قَدَّرَها اللهُ نَفسُه.\n\nوكانَ التَّبايُنُ بَينَ الجانِبَينِ صارِخًا. فالمُسلِمونَ نَحوُ ٣١٣ فَقَط، بِفَرَسَينِ ونَحوِ سَبعينَ بَعيرًا يَتَناوَبونَ رُكوبَها. كانوا خِفافَ السِّلاحِ ولم يَخرُجوا مُتَوَقِّعينَ مَعرَكةً كامِلة. ويُقابِلُهُم جَيشٌ نَحوُ ألفٍ مِن مُقاتِلي مَكّةَ المُحَنَّكينَ كامِلي السِّلاحِ بِأكثَرَ مِن مِئةِ فَرَس، يَسيرونَ بِالكِبرِ والمَعازِفِ والثِّقة. فَبِكُلِّ مِقياسٍ دُنيَوِيٍّ كانَ المُسلِمونَ في مَوقِفٍ مَيؤوسٍ مِنه. ومَعَ ذلك يَصِفُهُمُ اللهُ في القُرآنِ بِأنَّهُم «أذِلّة» قَليلونَ في عَينِ الدُّنيا — ﴿وأنتُم أذِلّة﴾ — تَحديدًا لِيُبَيِّنَ أنَّ النَّصرَ الذي تَلا لا يُمكِنُ أن يَكونَ إلّا مِنه. وعلى الطّالِبِ المُطالِبِ أن يُدرِكَ مِنَ البِدايةِ أنَّ بَدرًا لَيسَت قِصّةَ قُوّةٍ عَسكَريّة، بل بَيانٌ لِما يَصنَعُهُ اللهُ لِطائِفةٍ صَغيرةٍ مِنَ المُؤمِنينَ المُخلِصينَ إذا أطاعوهُ وتَوَكَّلوا عليه. وبِهذا يَتَهَيَّأُ المَشهَدُ لِأحداثِ المَعرَكةِ نَفسِها.",
      },
    },
    {
      title: { en: "The day of the battle: faith and reliance", ar: "يَومُ المَعرَكة: إيمانٌ وتَوَكُّل" },
      learningObjectives: [
        { en: "Describe the key events and the role of du'a and angels.", ar: "أصِفُ أحداثَ المَعرَكةِ ودَورَ الدُّعاءِ والمَلائِكة." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "Dawn sky over a valley — angels descending in aid.", ar: "فَجرٌ فَوقَ وادٍ — المَلائِكةُ تَنزِلُ مَدَدًا." },
        caption: { en: "'I will reinforce you with a thousand angels following one another.'", ar: "﴿أنّي مُمِدُّكُم بِأَلفٍ مِنَ المَلائِكةِ مُردِفين﴾." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...I will reinforce you with a thousand angels following one another.\" (Al-Anfal 9) And: \"You did not kill them, but Allah killed them. And you did not throw when you threw, but Allah threw.\" (Al-Anfal 17)", ar: "﴿...أنّي مُمِدُّكُم بِأَلفٍ مِنَ المَلائِكةِ مُردِفين﴾ (الأنفال ٩). و﴿فَلَم تَقتُلوهُم ولٰكِنَّ اللهَ قَتَلَهُم ۚ وما رَمَيتَ إذ رَمَيتَ ولٰكِنَّ اللهَ رَمى﴾ (الأنفال ١٧)" },
          ],
        },
        {
          label: { en: "The Prophet's du'a", ar: "دُعاءُ النَّبِيِّ ﷺ" },
          lines: [
            { en: "On the night and morning of Badr the Prophet ﷺ prayed intensely: 'O Allah, fulfil what You promised me. O Allah, if this band of Muslims is destroyed, You will not be worshipped on earth.' — Muslim", ar: "في لَيلةِ بَدرٍ وصَباحِها دَعا النَّبِيُّ ﷺ بِإلحاح: «اللّهُمَّ أنجِزْ لي ما وَعَدتَني. اللّهُمَّ إن تَهلِكْ هذه العِصابةُ مِن أهلِ الإسلامِ لا تُعبَدْ في الأرض» — مسلم" },
          ],
        },
      ],
      callout: {
        label: { en: "Balance the two truths", ar: "وازِنْ بَينَ الحَقيقَتَين" },
        title: { en: "Take the means AND rely on Allah", ar: "خُذْ بِالأسبابِ وتَوَكَّلْ على الله" },
        body: {
          en: "The Prophet ﷺ prepared the army, chose ground near the water, and built a shelter — yet he spent the night begging Allah in du'a. Argue how Badr perfectly unites taking the practical means (asbab) with total reliance on Allah (tawakkul), and why neglecting either is a mistake.",
          ar: "هَيَّأَ النَّبِيُّ ﷺ الجَيش، واختارَ أرضًا قُربَ الماء، وبَنى عَريشًا — ومَعَ ذلك قَضى اللَّيلَ يَتَضَرَّعُ إلى اللهِ دُعاءً. حاجِجْ كَيفَ تَجمَعُ بَدرٌ تَمامًا بَينَ الأخذِ بِالأسبابِ والتَّوَكُّلِ المُطلَقِ على الله، ولِماذا إهمالُ أحَدِهِما خَطأ.",
        },
      },
      responsePrompt: {
        title: { en: "Written response", ar: "إجابةٌ مَكتوبة" },
        prompt: { en: "Allah says the victory was His ('You did not throw when you threw, but Allah threw'), yet the Muslims still fought hard. Explain how a believer combines effort with reliance on Allah, using Badr as your example. How does this apply to a student facing a hard exam?", ar: "يَقولُ اللهُ إنَّ النَّصرَ مِنه (﴿وما رَمَيتَ إذ رَمَيتَ ولٰكِنَّ اللهَ رَمى﴾)، ومَعَ ذلك قاتَلَ المُسلِمونَ بِجِدّ. بَيِّنْ كَيفَ يَجمَعُ المُؤمِنُ بَينَ السَّعيِ والتَّوَكُّلِ على الله، مُستَدِلًّا بِبَدر. وكَيفَ يَنطَبِقُ ذلك على طالِبٍ أمامَ امتِحانٍ صَعب؟" },
        placeholder: { en: "At Badr the Muslims took the means by... yet relied on Allah by... A student should both... and...", ar: "في بَدرٍ أخَذَ المُسلِمونَ بِالأسبابِ بِـ... وتَوَكَّلوا على اللهِ بِـ... وعلى الطّالِبِ أن... وأن..." },
      },
      body: {
        en: "When it became clear that battle was unavoidable, the Prophet ﷺ consulted his Companions, and both the Muhajirun and the Ansar pledged their total support, saying they would follow him even into the sea. This consultation (shura) and the loyalty of the Companions were themselves part of the means of victory. The Prophet ﷺ then took careful, practical measures: on the advice of al-Hubab ibn al-Mundhir he positioned the army at the nearest well so as to control the water, and a shelter ('arish) was built from which he could direct the battle. He arranged the rows and prepared his small force as best he could.\n\nBut alongside this practical preparation, the Prophet ﷺ turned to the true source of victory. Throughout the night and into the morning he stood in prayer and made intense, weeping du'a, raising his hands to Allah and pleading: 'O Allah, fulfil for me what You promised me. O Allah, if this small band of Muslims is destroyed, You will not be worshipped on earth.' He begged so earnestly that his cloak fell from his shoulders, until Abu Bakr reassured him that Allah would surely fulfil His promise. This is the heart of Badr: the Prophet ﷺ did everything within human power, and then relied completely on Allah.\n\nAnd Allah answered. He sent down a calming sleep over the believers as a sign of security, sent rain that firmed the sand beneath the Muslims' feet, and — most remarkably — sent down angels to support and strengthen them, as He says: 'I will reinforce you with a thousand angels following one another.' When the fighting began and the Prophet ﷺ threw a handful of dust toward the enemy, Allah revealed that the true thrower was Him: 'You did not throw when you threw, but Allah threw.' The result was a stunning victory. The Muslims defeated the army that was three times their size; around seventy of the Quraysh's leading men were killed and seventy taken captive, including many of the very chiefs who had led the persecution. The mighty pride of Quraysh was broken in a single day. A demanding student should see clearly the two threads woven together at Badr: the believers took every legitimate means available to them — consultation, strategy, courage, and effort — yet they knew with certainty that victory comes from Allah alone. This balance, neither lazy fatalism nor arrogant self-reliance, is the model for every believer in every struggle of life.",
        ar: "لَمّا تَبَيَّنَ أنَّ القِتالَ لا مَفَرَّ مِنه، شاوَرَ النَّبِيُّ ﷺ أصحابَه، فَبايَعَهُ المُهاجِرونَ والأنصارُ على التَّأييدِ التّامّ، وقالوا إنَّهُم يَتبَعونَهُ ولَو خاضَ بِهِمُ البَحر. وكانَتِ الشّورى ووَفاءُ الصَّحابةِ مِن أسبابِ النَّصرِ نَفسِها. ثُمَّ اتَّخَذَ النَّبِيُّ ﷺ تَدابيرَ عَمَليّةً مُحكَمة: بِمَشورةِ الحُبابِ بنِ المُنذِرِ نَزَلَ بِالجَيشِ عِندَ أدنى بِئرٍ لِيَتَحَكَّمَ في الماء، وبُنِيَ عَريشٌ يُديرُ مِنهُ المَعرَكة. ورَتَّبَ الصُّفوفَ وهَيَّأَ قُوَّتَهُ الصَّغيرةَ قَدرَ المُستَطاع.\n\nلكِنْ إلى جانِبِ هذا الإعدادِ العَمَلِيّ، الْتَفَتَ النَّبِيُّ ﷺ إلى مَصدَرِ النَّصرِ الحَقيقِيّ. فَطَوالَ اللَّيلِ وإلى الصَّباحِ قامَ يُصَلّي ويَدعو دُعاءً مُلِحًّا باكِيًا، رافِعًا يَدَيهِ إلى اللهِ مُتَضَرِّعًا: «اللّهُمَّ أنجِزْ لي ما وَعَدتَني. اللّهُمَّ إن تَهلِكْ هذه العِصابةُ مِن أهلِ الإسلامِ لا تُعبَدْ في الأرض». وألَحَّ حَتّى سَقَطَ رِداؤُهُ عن مَنكِبَيه، فَطَمأنَهُ أبو بَكرٍ أنَّ اللهَ مُنجِزٌ وَعدَهُ حَتمًا. وهذا لُبُّ بَدر: فَعَلَ النَّبِيُّ ﷺ كُلَّ ما في طاقةِ البَشَر، ثُمَّ تَوَكَّلَ على اللهِ تَوَكُّلًا تامًّا.\n\nفاستَجابَ الله. أنزَلَ على المُؤمِنينَ نُعاسًا مُطَمئِنًا آيةَ أمن، وأنزَلَ مَطَرًا ثَبَّتَ الرَّملَ تَحتَ أقدامِهِم، و — وهو الأعجَب — أنزَلَ مَلائِكةً تُؤَيِّدُهُم وتُقَوّيهِم، كَما قال: ﴿أنّي مُمِدُّكُم بِأَلفٍ مِنَ المَلائِكةِ مُردِفين﴾. ولَمّا بَدَأَ القِتالُ ورَمى النَّبِيُّ ﷺ قَبضةً مِنَ التُّرابِ تُجاهَ العَدُوّ، أوحى اللهُ أنَّ الرّاميَ الحَقيقيَّ هو: ﴿وما رَمَيتَ إذ رَمَيتَ ولٰكِنَّ اللهَ رَمى﴾. وكانَتِ النَّتيجةُ نَصرًا باهِرًا. هَزَمَ المُسلِمونَ جَيشًا ثَلاثةَ أضعافِهِم؛ قُتِلَ نَحوُ سَبعينَ مِن ساداتِ قُرَيشٍ وأُسِرَ سَبعون، فيهِم كَثيرٌ مِنَ الزُّعَماءِ الذينَ قادوا الاضطِهاد. وانكَسَرَ كِبرُ قُرَيشٍ العَظيمُ في يَومٍ واحِد. وعلى الطّالِبِ المُطالِبِ أن يَرى بِوُضوحٍ الخَيطَينِ المَنسوجَينِ في بَدر: أخَذَ المُؤمِنونَ بِكُلِّ سَبَبٍ مَشروعٍ مُتاح — شورى، وتَخطيطًا، وشَجاعة، وجُهدًا — ومَعَ ذلك أيقَنوا أنَّ النَّصرَ مِنَ اللهِ وَحدَه. وهذا التَّوازُن، لا الجَبريّةَ الكَسولةَ ولا الاعتِدادَ المُتَكَبِّرَ بِالنَّفس، هو القُدوةُ لِكُلِّ مُؤمِنٍ في كُلِّ كِفاحٍ في الحَياة.",
      },
    },
    {
      title: { en: "The lessons of Badr", ar: "دُروسُ بَدر" },
      learningObjectives: [
        { en: "Derive timeless lessons from Badr for personal life.", ar: "أستَخرِجُ دُروسًا خالِدةً مِن بَدرٍ لِلحَياة." },
      ],
      image: {
        src: IMG.lantern,
        alt: { en: "A guiding light — lessons that endure.", ar: "ضَوءٌ هادٍ — دُروسٌ باقِية." },
        caption: { en: "Few but faithful, with Allah's help, prevail over many.", ar: "القِلّةُ المُؤمِنةُ بِعَونِ اللهِ تَغلِبُ الكَثرة." },
      },
      groupTasks: {
        title: { en: "Extract the lessons", ar: "استَخرِجوا الدُّروس" },
        instruction: { en: "Each group studies one major lesson of Badr.", ar: "تَدرُسُ كُلُّ مَجموعةٍ دَرسًا كَبيرًا مِن بَدر." },
        groups: [
          {
            slug: "victory-from-allah",
            name: { en: "Team A — Victory is from Allah", ar: "الفَريقُ أ — النَّصرُ مِنَ الله" },
            learningObjective: { en: "Show that numbers do not decide victory.", ar: "نُبَيِّنُ أنَّ العَدَدَ لا يُقَرِّرُ النَّصر." },
            task: { en: "Using Aal 'Imran 123 and Al-Anfal 17, explain how Badr proves victory comes from Allah, and give a modern example of relying on Allah while working hard.", ar: "بِآل عمران ١٢٣ والأنفال ١٧، بَيِّنوا كَيفَ تُثبِتُ بَدرٌ أنَّ النَّصرَ مِنَ الله، واضرِبوا مِثالًا مُعاصِرًا لِلتَّوَكُّلِ مَعَ السَّعي." },
            evidence: [
              { en: "313 vs ~1000; angels; 'but Allah threw'.", ar: "٣١٣ مُقابِلَ ~١٠٠٠؛ المَلائِكة؛ «ولٰكِنَّ اللهَ رَمى»." },
            ],
            sourceNotes: [
              { en: "Few + faithful + reliant > many + arrogant.", ar: "قِلّةٌ + إيمانٌ + تَوَكُّلٌ > كَثرةٌ + كِبر." },
            ],
            memberRoles: [
              { en: "Evidence-finder, Explainer, Presenter.", ar: "باحِثُ الدَّليل، الشّارِح، العارِض." },
            ],
            finalProduct: { en: "A short talk on victory from Allah.", ar: "كَلِمةٌ قَصيرةٌ عنِ النَّصرِ مِنَ الله." },
          },
          {
            slug: "means-and-mercy",
            name: { en: "Team B — Means, mercy, and dignity", ar: "الفَريقُ ب — الأسبابُ والرَّحمةُ والكَرامة" },
            learningObjective: { en: "Show the Prophet's planning and his treatment of captives.", ar: "نُبَيِّنُ تَخطيطَ النَّبِيِّ ﷺ ومُعامَلَتَهُ لِلأسرى." },
            task: { en: "Describe the practical means the Prophet ﷺ took, and how captives at Badr were treated (some ransomed by teaching ten Muslims to read). What does this teach about Islam?", ar: "صِفوا الأسبابَ العَمَليّةَ التي أخَذَ بِها النَّبِيُّ ﷺ، وكَيفَ عُومِلَ أسرى بَدر (فُدِيَ بَعضُهُم بِتَعليمِ عَشَرةِ مُسلِمينَ القِراءة). ماذا يُعَلِّمُ هذا عنِ الإسلام؟" },
            evidence: [
              { en: "Controlling the water; shelter; consultation; ransom by teaching literacy.", ar: "التَّحَكُّمُ في الماء؛ العَريش؛ الشّورى؛ الفِداءُ بِتَعليمِ القِراءة." },
            ],
            sourceNotes: [
              { en: "Islam values knowledge and mercy even with enemies.", ar: "الإسلامُ يُقَدِّرُ العِلمَ والرَّحمةَ حَتّى مَعَ العَدُوّ." },
            ],
            memberRoles: [
              { en: "Researcher, Summariser, Presenter.", ar: "الباحِث، المُلَخِّص، العارِض." },
            ],
            finalProduct: { en: "A summary of means and mercy at Badr.", ar: "مُلَخَّصٌ لِلأسبابِ والرَّحمةِ في بَدر." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final synthesis", ar: "التَّركيبُ الخِتامِيّ" },
        prompt: { en: "List three lessons from Badr that a Muslim student can apply today (e.g. reliance on Allah with effort, the power of sincere du'a, that truth is not measured by numbers). For each, give a concrete example from your own life.", ar: "اذكُرْ ثَلاثةَ دُروسٍ مِن بَدرٍ يُطَبِّقُها الطّالِبُ المُسلِمُ اليَوم (كَالتَّوَكُّلِ مَعَ السَّعي، وقُوّةِ الدُّعاءِ الصّادِق، وأنَّ الحَقَّ لا يُقاسُ بِالعَدَد). ولِكُلٍّ هاتِ مِثالًا واقِعيًّا مِن حَياتِك." },
        placeholder: { en: "Lesson 1: ... In my life: ... Lesson 2: ... Lesson 3: ...", ar: "الدَّرسُ ١: ... في حَياتي: ... الدَّرسُ ٢: ... الدَّرسُ ٣: ..." },
      },
      body: {
        en: "The Battle of Badr is far more than a historical event; it is a treasury of lessons that Allah preserved for every believer until the end of time. Allah devoted much of Surat Al-Anfal to it, drawing out its meanings, which shows how important these lessons are. Let us gather the greatest of them.\n\nThe first and central lesson is that true victory comes from Allah, not from numbers or weapons. The Muslims were outnumbered three to one, poorly equipped, and weak by every worldly measure — yet they triumphed, because Allah was with them. As He reminded them, 'Allah had already given you victory at Badr while you were few in number.' This frees the believer from despair: a person of faith never measures the truth by how many follow it or how strong its enemies appear. The second great lesson is the perfect balance between taking the means and relying on Allah. The Prophet ﷺ planned the battle with skill, controlled the water, arranged his rows, and built a command shelter — and at the same time spent the night weeping in du'a, knowing victory was in Allah's hands alone. A believer is neither lazy (expecting results without effort) nor arrogant (trusting only in his own strength); he works hard and relies on Allah. The third lesson is the power of sincere du'a: the Prophet's desperate prayer at Badr was answered with angels and victory, teaching us never to underestimate calling upon Allah with a sincere, broken heart.\n\nThere are further lessons too. Badr showed the value of unity and consultation — the Prophet ﷺ consulted his Companions and they stood together as one. It showed Islam's nobility even in war: many captives were treated kindly, and some were freed in exchange for teaching ten Muslim children to read and write — a striking sign that Islam honours knowledge even in the aftermath of battle. And Badr showed that this religion is precious enough that Allah Himself defends it, for the Prophet ﷺ had pleaded that if this small band perished, Allah would not be worshipped on earth — and Allah answered by preserving them. A demanding student should carry these lessons far beyond the history class. In every difficulty — an exam, a hardship, standing up for what is right when few others do — the believer remembers Badr: do everything in your power, rely completely on Allah, call upon Him sincerely, and never let small numbers or great obstacles shake your certainty that, with Allah, the few and the faithful can overcome the many. That is the eternal message of the Day of Criterion.",
        ar: "غَزوةُ بَدرٍ أكبَرُ بِكَثيرٍ مِن حَدَثٍ تاريخِيّ؛ إنَّها كَنزٌ مِنَ الدُّروسِ حَفِظَهُ اللهُ لِكُلِّ مُؤمِنٍ إلى آخِرِ الزَّمان. وقد أفرَدَ اللهُ لَها كَثيرًا مِن سورةِ الأنفال، يَستَخرِجُ مَعانِيَها، وهذا يُبَيِّنُ أهَمّيّةَ هذه الدُّروس. فَلنَجمَعْ أعظَمَها.\n\nالدَّرسُ الأوَّلُ المِحوَريُّ أنَّ النَّصرَ الحَقَّ مِنَ اللهِ لا مِنَ العَدَدِ والسِّلاح. فقد فاقَ العَدُوُّ المُسلِمينَ ثَلاثةَ أضعاف، وكانوا ضِعافَ العُدّةِ بِكُلِّ مِقياسٍ دُنيَوِيّ — ومَعَ ذلك انتَصَروا، لِأنَّ اللهَ كانَ مَعَهُم. كَما ذَكَّرَهُم: ﴿ولَقَد نَصَرَكُمُ اللهُ بِبَدرٍ وأنتُم أذِلّة﴾. وهذا يُحَرِّرُ المُؤمِنَ مِنَ اليَأس: فَصاحِبُ الإيمانِ لا يَقيسُ الحَقَّ بِكَثرةِ أتباعِهِ أو قُوّةِ أعدائِه. والدَّرسُ الثّاني التَّوازُنُ التّامُّ بَينَ الأخذِ بِالأسبابِ والتَّوَكُّلِ على الله. فقد خَطَّطَ النَّبِيُّ ﷺ لِلمَعرَكةِ بِمَهارة، وتَحَكَّمَ في الماء، ورَتَّبَ صُفوفَه، وبَنى عَريشَ القِيادة — وفي الوَقتِ نَفسِهِ قَضى اللَّيلَ باكِيًا في الدُّعاء، يَعلَمُ أنَّ النَّصرَ بِيَدِ اللهِ وَحدَه. فالمُؤمِنُ لا كَسولٌ (يَنتَظِرُ النَّتائِجَ بِلا عَمَل) ولا مُتَكَبِّرٌ (يَثِقُ بِقُوّتِهِ وَحدَها)؛ بل يَسعى ويَتَوَكَّل. والدَّرسُ الثّالِثُ قُوّةُ الدُّعاءِ الصّادِق: فَدُعاءُ النَّبِيِّ ﷺ المُلِحُّ في بَدرٍ أُجيبَ بِالمَلائِكةِ والنَّصر، يُعَلِّمُنا ألّا نَستَهينَ بِدُعاءِ اللهِ بِقَلبٍ صادِقٍ مُنكَسِر.\n\nوثَمّةَ دُروسٌ أُخرى. أظهَرَت بَدرٌ قيمةَ الوَحدةِ والشّورى — شاوَرَ النَّبِيُّ ﷺ أصحابَهُ فَوَقَفوا صَفًّا واحِدًا. وأظهَرَت نُبلَ الإسلامِ حَتّى في الحَرب: فقد عومِلَ كَثيرٌ مِنَ الأسرى بِرِفق، وأُطلِقَ بَعضُهُم لِقاءَ تَعليمِ عَشَرةٍ مِن أطفالِ المُسلِمينَ القِراءةَ والكِتابة — آيةٌ بَيِّنةٌ أنَّ الإسلامَ يُكرِمُ العِلمَ حَتّى عَقِبَ المَعرَكة. وأظهَرَت بَدرٌ أنَّ هذا الدّينَ نَفيسٌ يَدفَعُ اللهُ عَنهُ بِنَفسِه، فقد تَضَرَّعَ النَّبِيُّ ﷺ أنَّهُ إن هَلَكَت هذه العِصابةُ لا يُعبَدُ اللهُ في الأرض — فاستَجابَ اللهُ بِحِفظِهِم. وعلى الطّالِبِ المُطالِبِ أن يَحمِلَ هذه الدُّروسَ بَعيدًا عن دَرسِ التّاريخ. ففي كُلِّ شِدّة — امتِحانٍ، أو بَلاء، أوِ الوُقوفِ مَعَ الحَقِّ حينَ يَقِلُّ النّاصِر — يَتَذَكَّرُ المُؤمِنُ بَدرًا: افعَلْ كُلَّ ما في وُسعِك، وتَوَكَّلْ على اللهِ تَمامًا، وادعُهُ صادِقًا، ولا تَدَعْ قِلّةَ العَدَدِ أو عِظَمَ العَقَباتِ تَهُزُّ يَقينَكَ أنَّكَ مَعَ اللهِ، تَغلِبُ القِلّةُ المُؤمِنةُ الكَثرة. تِلكَ رِسالةُ يَومِ الفُرقانِ الخالِدة.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "When did the Battle of Badr take place?", ar: "مَتى وَقَعَت غَزوةُ بَدر؟" },
      options: [
        { en: "17 Ramadan, in the 2nd year after the Hijrah", ar: "١٧ رَمَضان، في السَّنةِ الثّانيةِ لِلهِجرة" },
        { en: "In the first year in Makkah", ar: "في السَّنةِ الأولى بِمَكّة" },
        { en: "After the conquest of Makkah", ar: "بَعدَ فَتحِ مَكّة" },
        { en: "Before the Hijrah", ar: "قَبلَ الهِجرة" },
      ],
      correctIndex: 0,
      explanation: { en: "Badr was the first major battle, in Ramadan of year 2 AH.", ar: "بَدرٌ أوَّلُ مَعرَكةٍ كُبرى، في رَمَضانَ سَنةَ ٢ هـ." },
    },
    {
      prompt: { en: "How did the two armies compare?", ar: "كَيفَ تَقابَلَ الجَيشان؟" },
      options: [
        { en: "~313 lightly-armed Muslims against ~1000 well-armed Quraysh", ar: "نَحوُ ٣١٣ مُسلِمًا خِفافَ السِّلاحِ مُقابِلَ نَحوِ ١٠٠٠ مِن قُرَيشٍ كامِلي السِّلاح" },
        { en: "The Muslims were the larger army", ar: "كانَ المُسلِمونَ الجَيشَ الأكبَر" },
        { en: "Both armies were equal", ar: "كانَ الجَيشانِ مُتَساوِيَين" },
        { en: "There were no weapons on either side", ar: "لم يَكُنْ سِلاحٌ في الجانِبَين" },
      ],
      correctIndex: 0,
      explanation: { en: "The Muslims were outnumbered roughly three to one — the victory was clearly from Allah.", ar: "فاقَ العَدُوُّ المُسلِمينَ نَحوَ ثَلاثةِ أضعاف — فالنَّصرُ بَيِّنٌ مِنَ الله." },
    },
    {
      prompt: { en: "What did Allah send to support the believers at Badr?", ar: "بِماذا أيَّدَ اللهُ المُؤمِنينَ في بَدر؟" },
      options: [
        { en: "Angels, calming sleep, and rain that firmed the ground", ar: "مَلائِكةً، ونُعاسًا مُطَمئِنًا، ومَطَرًا ثَبَّتَ الأرض" },
        { en: "A larger army of men", ar: "جَيشًا أكبَرَ مِنَ الرِّجال" },
        { en: "Gold and treasure", ar: "ذَهَبًا وكُنوزًا" },
        { en: "Nothing at all", ar: "لا شَيءَ البَتّة" },
      ],
      correctIndex: 0,
      explanation: { en: "'I will reinforce you with a thousand angels following one another' (Al-Anfal 9).", ar: "﴿أنّي مُمِدُّكُم بِأَلفٍ مِنَ المَلائِكةِ مُردِفين﴾ (الأنفال ٩)." },
    },
    {
      prompt: { en: "What does 'You did not throw when you threw, but Allah threw' (Al-Anfal 17) teach?", ar: "ماذا يُعَلِّمُ ﴿وما رَمَيتَ إذ رَمَيتَ ولٰكِنَّ اللهَ رَمى﴾ (الأنفال ١٧)؟" },
      options: [
        { en: "Even with effort, the real result and victory come from Allah", ar: "مَعَ السَّعي، النَّتيجةُ والنَّصرُ الحَقيقيّانِ مِنَ الله" },
        { en: "That we should never make any effort", ar: "ألّا نَسعى أبَدًا" },
        { en: "That throwing dust is forbidden", ar: "أنَّ رَميَ التُّرابِ حَرام" },
        { en: "That the Prophet ﷺ did nothing", ar: "أنَّ النَّبِيَّ ﷺ لم يَفعَلْ شَيئًا" },
      ],
      correctIndex: 0,
      explanation: { en: "The believer acts fully, yet attributes the outcome to Allah.", ar: "المُؤمِنُ يَعمَلُ تَمامًا، ويَنسِبُ النَّتيجةَ إلى الله." },
    },
    {
      prompt: { en: "How were some captives of Badr freed?", ar: "كَيفَ أُطلِقَ بَعضُ أسرى بَدر؟" },
      options: [
        { en: "By teaching ten Muslim children to read and write", ar: "بِتَعليمِ عَشَرةٍ مِن أطفالِ المُسلِمينَ القِراءةَ والكِتابة" },
        { en: "They were all executed", ar: "قُتِلوا جَميعًا" },
        { en: "They were never released", ar: "لم يُطلَقوا أبَدًا" },
        { en: "By giving up their religion only", ar: "بِتَركِ دينِهِم فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "This shows Islam's high value of knowledge and mercy even toward enemies.", ar: "يُبَيِّنُ هذا تَعظيمَ الإسلامِ لِلعِلمِ والرَّحمةِ حَتّى مَعَ الأعداء." },
    },
    {
      prompt: { en: "True or False: Badr teaches that a believer should rely on Allah AND take practical means.", ar: "صَوابٌ أم خَطأ: تُعَلِّمُ بَدرٌ أنَّ المُؤمِنَ يَتَوَكَّلُ على اللهِ ويَأخُذُ بِالأسباب." },
      options: [
        { en: "True — the Prophet ﷺ planned carefully and made intense du'a", ar: "صَواب — خَطَّطَ النَّبِيُّ ﷺ بِعِنايةٍ ودَعا بِإلحاح" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Badr unites effort (asbab) and total reliance on Allah (tawakkul).", ar: "تَجمَعُ بَدرٌ بَينَ الأخذِ بِالأسبابِ والتَّوَكُّلِ التّامِّ على الله." },
    },
  ],
};
