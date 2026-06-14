import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const makkanMadinanQuran: CourseLesson = {
  slug: "g10y11-makkan-and-madinan-quran",
  name: { en: "Makkan and Madinan Quran", ar: "القُرآنُ المَكِّيُّ والمَدَنيّ" },
  shortIntro: {
    en: "The Qur'an was revealed in two great phases — the Makkan period before the Hijrah and the Madinan period after it — each with its own themes and character. This lesson studies how scholars distinguish the two, their distinctive features, and the wisdom of this gradual, staged revelation.",
    ar: "نَزَلَ القُرآنُ في مَرحَلَتَينِ عَظيمَتَين — المَكِّيِّ قَبلَ الهِجرةِ والمَدَنيِّ بَعدَها — لِكُلٍّ مَوضوعاتُهُ وطابَعُه. يَدرُسُ هذا الدَّرسُ كَيفَ يُمَيِّزُ العُلَماءُ بَينَهُما، وخَصائِصَ كُلٍّ، وحِكمةَ هذا التَّنزيلِ المُتَدَرِّجِ المُنَجَّم.",
  },
  quranSurahs: ["Al-Isra 106", "Al-Furqan 32"],
  sections: [
    {
      title: { en: "The two phases of revelation", ar: "مَرحَلَتا التَّنزيل" },
      learningObjectives: [
        { en: "Define Makkan and Madinan revelation.", ar: "أُعَرِّفُ المَكِّيَّ والمَدَنيّ." },
        { en: "Explain how scholars distinguish between the two.", ar: "أشرَحُ كَيفَ يُمَيِّزُ العُلَماءُ بَينَهُما." },
      ],
      successCriteria: [
        { en: "I can state the most accepted definition of Makkan/Madinan.", ar: "أُبَيِّنُ أرجَحَ تَعريفٍ لِلمَكِّيِّ والمَدَنيّ." },
        { en: "I can explain how scholars knew which is which.", ar: "أشرَحُ كَيفَ عَرَفَ العُلَماءُ كُلًّا." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A great mosque — recalling Makkah and Madinah, the two cities of revelation.", ar: "مَسجِدٌ عَظيم — يُذَكِّرُ بِمَكّةَ والمَدينةِ مَدينَتَيِ التَّنزيل." },
        caption: { en: "'And [it is] a Qur'an which We have separated [by intervals]...' (Al-Isra 106).", ar: "﴿وقُرآنًا فَرَقناهُ...﴾ (الإسراء ١٠٦)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does it matter to know where and when a verse was revealed?", ar: "لِمَ يُهِمُّ أن نَعرِفَ أينَ ومَتى نَزَلَت آية؟" },
        body: {
          en: "The science of Makkan and Madinan revelation (al-Makki wal-Madani) is one of the great Qur'anic sciences. Reflect: how does knowing whether a verse was revealed in Makkah (before the Hijrah) or Madinah (after it) help us understand its context, its rulings, and the wisdom of how Allah built the Muslim community step by step?",
          ar: "عِلمُ المَكِّيِّ والمَدَنيِّ مِن عُلومِ القُرآنِ العَظيمة. تَأمَّل: كَيفَ تُعينُنا مَعرِفةُ نُزولِ الآيةِ في مَكّةَ (قَبلَ الهِجرة) أو المَدينةِ (بَعدَها) على فَهمِ سِياقِها وأحكامِها وحِكمةِ بِناءِ اللهِ لِلأُمّةِ المُسلِمةِ خُطوةً خُطوة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Most accepted definition", ar: "أرجَحُ التَّعريف" },
          lines: [
            { en: "Makkan = revealed before the Hijrah; Madinan = revealed after it (by time, not place).", ar: "المَكِّيُّ: ما نَزَلَ قَبلَ الهِجرة؛ المَدَنيُّ: ما نَزَلَ بَعدَها (بِالزَّمَنِ لا المَكان)." },
          ],
        },
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Tanjim (تَنجيم): the revelation of the Qur'an in stages over ~23 years.", ar: "التَّنجيم: نُزولُ القُرآنِ مُنَجَّمًا على نَحوِ ٢٣ سَنة." },
          ],
        },
      ],
      body: {
        en: "Among the noble sciences that scholars developed to serve the Book of Allah is the science of the Makkan and Madinan revelation ('ilm al-Makki wal-Madani), which studies which parts of the Qur'an were revealed in the Makkan period and which in the Madinan period, and what distinguishes each. This science is one of the foundations of Qur'anic study, for it helps us understand the context in which each verse was revealed, the gradual building of the Muslim community, the development of Islamic legislation, and the wisdom of Allah in how He sent down His final revelation. The Qur'an was not revealed all at once, but gradually over approximately twenty-three years of the Prophet's mission ﷺ — about thirteen years in Makkah before the Hijrah, and about ten years in Madinah after it. Allah Himself points to this gradual, staged revelation: 'And [it is] a Qur'an which We have separated [by intervals] that you might recite it to the people over a prolonged period. And We have sent it down progressively' (Al-Isra 106), and He explains the wisdom of it: 'And those who disbelieve say, \"Why was the Qur'an not revealed to him all at once?\" Thus [it is] that We may strengthen thereby your heart. And We have spaced it distinctly' (Al-Furqan 32).\n\nScholars offered several ways to define what makes a passage Makkan or Madinan, but the most accepted and precise definition is based on time: the Makkan revelation is everything that was revealed before the Hijrah (the Prophet's migration from Makkah to Madinah), and the Madinan revelation is everything revealed after the Hijrah — even if it was revealed in Makkah itself, such as the verses revealed during the Conquest of Makkah or the Farewell Pilgrimage, which are counted as Madinan because they came after the Hijrah. This time-based definition is the most accurate because it provides a clear dividing line (the Hijrah) and accounts for all of the Qur'an. Other definitions were proposed — some based on place (what was revealed in Makkah and its surroundings versus Madinah and its surroundings) and some based on the audience addressed (what addresses the people of Makkah versus the people of Madinah) — but these have exceptions and gaps, which is why the time-based definition is preferred by the majority of scholars.\n\nHow did the scholars come to know which verses and surahs were Makkan and which were Madinan, given that the Qur'an itself does not generally state this? They relied on two main sources. The first and most important is authentic transmission (naql) from the Companions and the Successors (Tabi'un) who witnessed the revelation and knew the circumstances of each passage — the Companions lived through the revelation, knew when and where verses came down, and transmitted this knowledge carefully to those after them. This transmitted knowledge is the primary foundation of the science. The second source is scholarly analysis and deduction (ijtihad) based on the distinctive features and characteristics (khasa'is) of Makkan and Madinan passages: scholars carefully studied the themes, style, length, and content of the verses and surahs, and from this they could often identify the likely period of revelation. For example, if a surah contains the address 'O you who have believed,' it is typically Madinan, since the community of believers had been established in Madinah; if it contains 'O mankind' and focuses on the fundamentals of faith, it is typically Makkan. The combination of authentic transmission as the foundation and careful scholarly analysis as a support allowed the scholars to classify the entire Qur'an with great precision, producing one of the most valuable sciences for understanding the Book of Allah. In the next section we examine the distinctive features of each period and the great wisdom of this staged revelation.",
        ar: "مِنَ العُلومِ الشَّريفةِ التي وَضَعَها العُلَماءُ خِدمةً لِكِتابِ اللهِ عِلمُ المَكِّيِّ والمَدَنيّ، الذي يَدرُسُ ما نَزَلَ مِنَ القُرآنِ في العَهدِ المَكِّيِّ وما نَزَلَ في العَهدِ المَدَنيّ، وما يُمَيِّزُ كُلًّا. وهذا العِلمُ مِن أُسُسِ دِراسةِ القُرآن، إذ يُعينُنا على فَهمِ سِياقِ نُزولِ كُلِّ آية، وبِناءِ الأُمّةِ المُسلِمةِ تَدريجيًّا، وتَطَوُّرِ التَّشريعِ الإسلاميّ، وحِكمةِ اللهِ في كَيفيّةِ إنزالِ وَحيِهِ الخاتَم. ولم يَنزِلِ القُرآنُ جُملةً واحِدة، بل تَدريجيًّا على نَحوِ ثَلاثٍ وعِشرينَ سَنةً مِن بَعثةِ النَّبِيِّ ﷺ — نَحوَ ثَلاثَ عَشرةَ سَنةً في مَكّةَ قَبلَ الهِجرة، ونَحوَ عَشرِ سَنَواتٍ في المَدينةِ بَعدَها. وقد أشارَ اللهُ نَفسُهُ إلى هذا التَّنزيلِ المُتَدَرِّجِ المُنَجَّم: ﴿وقُرآنًا فَرَقناهُ لِتَقرَأهُ على النّاسِ على مُكثٍ ونَزَّلناهُ تَنزيلًا﴾ (الإسراء ١٠٦)، وبَيَّنَ حِكمَتَه: ﴿وقالَ الذينَ كَفَروا لَولا نُزِّلَ علَيهِ القُرآنُ جُملةً واحِدة، كَذلك لِنُثَبِّتَ بِهِ فُؤادَكَ ورَتَّلناهُ تَرتيلًا﴾ (الفرقان ٣٢).\n\nوقد ذَكَرَ العُلَماءُ طُرُقًا عِدّةً لِتَعريفِ المَكِّيِّ والمَدَنيّ، لكِنَّ أرجَحَها وأدَقَّها ما بُنيَ على الزَّمَن: فالمَكِّيُّ كُلُّ ما نَزَلَ قَبلَ الهِجرة (هِجرةِ النَّبِيِّ مِن مَكّةَ إلى المَدينة)، والمَدَنيُّ كُلُّ ما نَزَلَ بَعدَ الهِجرة — ولَو نَزَلَ في مَكّةَ نَفسِها، كَالآياتِ التي نَزَلَت في فَتحِ مَكّةَ أو حَجّةِ الوَداع، فَتُعَدُّ مَدَنيّةً لِأنَّها بَعدَ الهِجرة. وهذا التَّعريفُ الزَّمَنيُّ أدَقُّها لِأنَّهُ يُقَدِّمُ حَدًّا فاصِلًا واضِحًا (الهِجرة) ويَشمَلُ القُرآنَ كُلَّه. وثَمّةَ تَعريفاتٌ أُخرى — بَعضُها بِالمَكان (ما نَزَلَ في مَكّةَ ونَواحيها مُقابِلَ المَدينةِ ونَواحيها) وبَعضُها بِالمُخاطَب (ما خاطَبَ أهلَ مَكّةَ مُقابِلَ أهلِ المَدينة) — لكِن فيها استِثناءاتٌ وثَغَرات، ولِذا رَجَّحَ الجُمهورُ التَّعريفَ الزَّمَنيّ.\n\nفَكَيفَ عَرَفَ العُلَماءُ ما هو مَكِّيٌّ وما هو مَدَنيٌّ، والقُرآنُ نَفسُهُ لا يَنُصُّ على ذلك غالِبًا؟ اعتَمَدوا على مَصدَرَينِ رَئيسَين. الأوَّلُ والأهَمُّ النَّقلُ الصَّحيحُ عنِ الصَّحابةِ والتّابِعينَ الذينَ شَهِدوا التَّنزيلَ وعَرَفوا ظُروفَ كُلِّ آية — فالصَّحابةُ عاشوا الوَحي، وعَرَفوا مَتى وأينَ نَزَلَتِ الآيات، ونَقَلوا هذا العِلمَ بِعِنايةٍ لِمَن بَعدَهُم. وهذا العِلمُ المَنقولُ هو الأساسُ الأوَّلُ لِهذا العِلم. والمَصدَرُ الثّاني الاجتِهادُ والاستِنباطُ القائِمُ على خَصائِصِ المَكِّيِّ والمَدَنيِّ ومُمَيِّزاتِهِما: فَقد دَرَسَ العُلَماءُ بِعِنايةٍ مَوضوعاتِ الآياتِ والسُّوَرِ وأسلوبَها وطولَها ومَضمونَها، فَأمكَنَهُم غالِبًا تَحديدُ عَهدِ النُّزولِ المُرَجَّح. فَمَثَلًا إذا تَضَمَّنَتِ السّورةُ خِطابَ «يا أيُّها الذينَ آمَنوا» فَهي غالِبًا مَدَنيّة، إذِ استَقَرَّت جَماعةُ المُؤمِنينَ في المَدينة؛ وإذا تَضَمَّنَت «يا أيُّها النّاس» ورَكَّزَت على أُصولِ الإيمانِ فَهي غالِبًا مَكِّيّة. وبِالجَمعِ بَينَ النَّقلِ الصَّحيحِ أساسًا والتَّحليلِ العِلميِّ الدَّقيقِ سَنَدًا، تَمَكَّنَ العُلَماءُ مِن تَصنيفِ القُرآنِ كُلِّهِ بِدِقّةٍ بالِغة، فَأنتَجوا أحَدَ أنفَسِ العُلومِ لِفَهمِ كِتابِ الله. وفي القِسمِ التّالي نَتَناوَلُ خَصائِصَ كُلِّ عَهدٍ وحِكمةَ هذا التَّنزيلِ المُتَدَرِّج.",
      },
    },
    {
      title: { en: "Features and wisdom of the two periods", ar: "خَصائِصُ العَهدَينِ وحِكمَتُهُما" },
      learningObjectives: [
        { en: "Compare the features of Makkan and Madinan revelation.", ar: "أُقارِنُ خَصائِصَ المَكِّيِّ والمَدَنيّ." },
        { en: "Explain the wisdom of gradual revelation.", ar: "أشرَحُ حِكمةَ التَّنزيلِ المُتَدَرِّج." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "An open sky — the Qur'an descending in stages over 23 years.", ar: "سَماءٌ مَفتوحة — القُرآنُ يَنزِلُ مُنَجَّمًا في ٢٣ سَنة." },
        caption: { en: "'...that We may strengthen thereby your heart' (Al-Furqan 32).", ar: "﴿لِنُثَبِّتَ بِهِ فُؤادَكَ﴾ (الفرقان ٣٢)." },
      },
      groupTasks: {
        title: { en: "Reading the revelation", ar: "قِراءةُ التَّنزيل" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "features-comparison",
            name: { en: "Team A — Comparing features", ar: "الفَريقُ أ — مُقارَنةُ الخَصائِص" },
            learningObjective: { en: "Present the distinctive features of each period.", ar: "نَعرِضُ خَصائِصَ كُلِّ عَهد." },
            task: { en: "Present a clear comparison of Makkan and Madinan features. Makkan: mostly shorter surahs and verses; focus on tawhid (oneness of Allah), the resurrection and the Hereafter, refuting shirk, stories of the prophets and earlier nations, and building belief and character; often addressed 'O mankind.' Madinan: often longer surahs and verses; detailed legislation (worship, transactions, family, jihad, hudud), addressing the hypocrites and People of the Book, building the community and state; often addressed 'O you who have believed.' Present a side-by-side comparison chart with examples.", ar: "اعرِضوا مُقارَنةً واضِحةً لِخَصائِصِ المَكِّيِّ والمَدَنيّ. المَكِّيُّ: غالِبًا سُوَرٌ وآياتٌ قِصار؛ التَّركيزُ على التَّوحيدِ والبَعثِ والآخِرةِ وإبطالِ الشِّركِ وقِصَصِ الأنبياءِ والأُمَمِ وبِناءِ العَقيدةِ والخُلُق؛ وكَثيرًا ما خاطَبَ «يا أيُّها النّاس». المَدَنيُّ: غالِبًا سُوَرٌ وآياتٌ طِوال؛ التَّشريعُ المُفَصَّلُ (العِباداتُ والمُعامَلاتُ والأُسرةُ والجِهادُ والحُدود)، ومُخاطَبةُ المُنافِقينَ وأهلِ الكِتاب، وبِناءُ الأُمّةِ والدَّولة؛ وكَثيرًا ما خاطَبَ «يا أيُّها الذينَ آمَنوا». اعرِضوا جَدوَلَ مُقارَنةٍ بِأمثِلة." },
            evidence: [
              { en: "Makkan surahs build faith; Madinan surahs build the community and law.", ar: "السُّوَرُ المَكِّيّةُ تَبني الإيمان؛ والمَدَنيّةُ تَبني الأُمّةَ والتَّشريع." },
            ],
            sourceNotes: [
              { en: "These are general features, with some exceptions.", ar: "هذه خَصائِصُ عامّةٌ، معَ بَعضِ الاستِثناءات." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A Makkan/Madinan comparison chart.", ar: "جَدوَلُ مُقارَنةِ المَكِّيِّ والمَدَنيّ." },
          },
          {
            slug: "wisdom-of-gradual-revelation",
            name: { en: "Team B — Wisdom of gradual revelation", ar: "الفَريقُ ب — حِكمةُ التَّدَرُّج" },
            learningObjective: { en: "Explain why the Qur'an came in stages.", ar: "نَشرَحُ لِمَ نَزَلَ القُرآنُ مُنَجَّمًا." },
            task: { en: "Explore the wisdom of why Allah revealed the Qur'an gradually over 23 years rather than all at once: to strengthen the heart of the Prophet ﷺ and the believers (Al-Furqan 32); to make it easier to memorise, understand, and act upon; to respond to events and questions as they arose; and to build faith first, then introduce laws gradually (e.g. the staged prohibition of alcohol) so people could accept and apply them. Show how this gradual method is the best way to change hearts and build a community. Present a 'wisdom of gradual revelation' display.", ar: "استَكشِفوا حِكمةَ إنزالِ اللهِ القُرآنَ مُتَدَرِّجًا على ٢٣ سَنةً لا جُملةً واحِدة: تَثبيتُ قَلبِ النَّبِيِّ ﷺ والمُؤمِنين (الفرقان ٣٢)؛ وتَيسيرُ الحِفظِ والفَهمِ والعَمَل؛ والاستِجابةُ لِلأحداثِ والأسئِلةِ عِندَ وُقوعِها؛ وبِناءُ العَقيدةِ أوَّلًا ثُمَّ التَّشريعُ تَدريجيًّا (كَتَدَرُّجِ تَحريمِ الخَمر) لِيَقبَلَهُ النّاسُ ويُطَبِّقوه. بَيِّنوا أنَّ التَّدَرُّجَ أنجَعُ سَبيلٍ لِتَغييرِ القُلوبِ وبِناءِ الأُمّة. اعرِضوا لَوحةَ «حِكمةِ التَّدَرُّج»." },
            evidence: [
              { en: "Al-Furqan 32: revealed gradually 'that We may strengthen thereby your heart.'", ar: "الفرقان ٣٢: نَزَلَ مُتَدَرِّجًا ﴿لِنُثَبِّتَ بِهِ فُؤادَك﴾." },
            ],
            sourceNotes: [
              { en: "The staged ban on alcohol shows the wisdom of gradual law.", ar: "تَدَرُّجُ تَحريمِ الخَمرِ يُبَيِّنُ حِكمةَ التَّشريعِ المُتَدَرِّج." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'wisdom of gradual revelation' display.", ar: "لَوحةُ «حِكمةِ التَّدَرُّج»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Built step by step", ar: "بِناءٌ خُطوةً خُطوة" },
        prompt: { en: "Allah revealed the Qur'an gradually over 23 years, building faith first in Makkah and then law and community in Madinah — a wise, step-by-step method for changing hearts. Reflect on your own growth: do you try to change everything at once and then give up, or do you build good habits gradually and firmly? What does the gradual method of revelation teach you about patience, building strong foundations, and steady self-improvement? Write about one good habit you will build gradually and firmly, the way Allah built the believing community.", ar: "أنزَلَ اللهُ القُرآنَ مُتَدَرِّجًا على ٢٣ سَنة، فَبَنى العَقيدةَ أوَّلًا في مَكّةَ ثُمَّ التَّشريعَ والأُمّةَ في المَدينة — مَنهَجٌ حَكيمٌ مُتَدَرِّجٌ لِتَغييرِ القُلوب. تَأمَّل نُمُوَّكَ أنتَ: أتُحاوِلُ تَغييرَ كُلِّ شَيءٍ دَفعةً ثُمَّ تَيأَس، أم تَبني العاداتِ الحَسَنةَ تَدريجيًّا وثابِتًا؟ ماذا يُعَلِّمُكَ تَدَرُّجُ التَّنزيلِ عنِ الصَّبرِ وبِناءِ الأُسُسِ القَويّةِ والتَّحَسُّنِ المُطَّرِد؟ اكتُب عادةً حَسَنةً واحِدةً سَتَبنيها تَدريجيًّا وثابِتًا، كَما بَنى اللهُ جَماعةَ المُؤمِنين." },
        placeholder: { en: "Gradual change works better because... I will build this habit step by step by... Strong foundations matter because...", ar: "التَّدَرُّجُ أنجَعُ لِأنَّ... وسَأبني هذه العادةَ خُطوةً خُطوةً بِـ... والأُسُسُ القَويّةُ مُهِمّةٌ لِأنَّ..." },
      },
      body: {
        en: "The Makkan and Madinan periods of revelation each have distinctive features and characteristics that reflect the different stages of the Prophet's mission ﷺ and the different needs of the community at each stage. The Makkan period, lasting about thirteen years, was the foundational phase in which the core of the faith was established in the hearts of a small, often persecuted community of believers. The Makkan revelation therefore focuses overwhelmingly on the fundamentals of belief: the oneness of Allah (tawhid) and the call to worship Him alone; the refutation of shirk (polytheism) and idol-worship; the affirmation of the resurrection, the Day of Judgement, Paradise and Hell; the truthfulness of the Prophet ﷺ and the message; and the building of sound character and morals. Makkan surahs and verses tend to be shorter, with powerful, rhythmic, and emotionally moving language designed to shake the heart, awaken the conscience, and establish firm conviction. They often contain the stories of earlier prophets and nations — to console the Prophet ﷺ and the believers and to warn the deniers — and they frequently address all of humanity with 'O mankind,' since the message at this stage was a universal call to the basic truths of faith.\n\nThe Madinan period, lasting about ten years after the Hijrah, was the phase in which the Muslim community became established as a society and a state, and so the Madinan revelation has a markedly different character. With the foundations of faith firmly in place, the Madinan verses turn to the detailed legislation needed to organise the life of the believing community: the detailed rulings of worship (prayer, zakat, fasting, Hajj); the laws of transactions and finance; the rules of marriage, divorce, and family life; the laws of inheritance; the legislation of jihad and the rules of war and peace; the prescribed punishments (hudud); and the principles of justice and governance. Madinan surahs and verses therefore tend to be longer and more detailed. The Madinan revelation also addresses groups that became prominent in Madinah: the hypocrites (munafiqun), who outwardly professed Islam while concealing disbelief, and the People of the Book (Jews and Christians), engaging with their claims and inviting them to the truth. And it frequently uses the address 'O you who have believed,' speaking directly to the established community of believers, calling them to fulfil their duties and perfect their faith. These features are general tendencies rather than absolute rules — there are some short passages in Madinan surahs and some legislative verses revealed in Makkah — but together they give each period its recognisable character.\n\nBehind this two-stage, gradual revelation lies profound wisdom that every believer can learn from. Allah could have revealed the entire Qur'an at once, but in His wisdom He sent it down gradually over twenty-three years, and He Himself explained some of the reasons. The first is the strengthening of the heart: 'that We may strengthen thereby your heart' (Al-Furqan 32) — the ongoing, staged revelation continually renewed the connection between the Prophet ﷺ and his Lord, consoled him in hardship, and strengthened the resolve of the believers through every trial. The second is ease of memorisation, understanding, and application: revealing the Qur'an piece by piece made it easier for the Companions to memorise it, to understand it deeply, and to put it into practice in their lives. The third is responsiveness to events: many verses were revealed in direct response to specific events, questions, and needs as they arose in the life of the community, providing timely guidance and making the meanings clearer. The fourth, and one of the most important, is the wisdom of gradual legislation (tadarruj): Allah established faith firmly in the hearts first, during the Makkan period, before introducing the detailed laws in Madinah; and even within the laws, some were introduced gradually, the most famous example being the prohibition of alcohol, which came in stages — first discouraging it, then forbidding it near prayer, then prohibiting it completely — so that hearts already filled with faith could accept and obey the command. This gradual method is the wisest way to change hearts and build a community, and it carries a timeless lesson for the young Muslim: that real and lasting change — whether in oneself or in society — is usually built gradually and firmly, on strong foundations, with patience and steadiness, rather than all at once. Just as Allah built the greatest community in history step by step, the believer builds his own faith, character, and good habits step by step, beginning with the foundations and growing steadily toward perfection.",
        ar: "لِلعَهدَينِ المَكِّيِّ والمَدَنيِّ خَصائِصُ ومُمَيِّزاتٌ تَعكِسُ مَراحِلَ بَعثةِ النَّبِيِّ ﷺ المُختَلِفةَ وحاجاتِ الأُمّةِ المُختَلِفةَ في كُلِّ مَرحَلة. فالعَهدُ المَكِّيُّ، الذي امتَدَّ نَحوَ ثَلاثَ عَشرةَ سَنة، كانَ مَرحَلةَ التَّأسيسِ التي رُسِّخَ فيها لُبُّ العَقيدةِ في قُلوبِ جَماعةٍ صَغيرةٍ مِنَ المُؤمِنينَ كَثيرًا ما اضطُهِدَت. ولِذا يُرَكِّزُ التَّنزيلُ المَكِّيُّ تَركيزًا غالِبًا على أُصولِ الإيمان: تَوحيدِ اللهِ ودَعوةِ عِبادَتِهِ وَحدَه؛ وإبطالِ الشِّركِ وعِبادةِ الأصنام؛ وإثباتِ البَعثِ ويَومِ القيامةِ والجَنّةِ والنّار؛ وصِدقِ النَّبِيِّ ﷺ والرِّسالة؛ وبِناءِ الأخلاقِ والخُلُقِ القَويم. وتَميلُ السُّوَرُ والآياتُ المَكِّيّةُ إلى القِصَر، بِلُغةٍ قَويّةٍ مُؤَثِّرةٍ تَهُزُّ القَلبَ وتوقِظُ الضَّميرَ وتُرَسِّخُ اليَقين. وكَثيرًا ما تَحوي قِصَصَ الأنبياءِ والأُمَمِ السّابِقةِ — تَسليةً لِلنَّبِيِّ ﷺ والمُؤمِنينَ وإنذارًا لِلمُكَذِّبين — وتُخاطِبُ النّاسَ جَميعًا بِـ«يا أيُّها النّاس»، إذ كانَتِ الرِّسالةُ في هذه المَرحَلةِ دَعوةً عامّةً إلى حَقائِقِ الإيمانِ الأساسيّة.\n\nأمّا العَهدُ المَدَنيُّ، الذي امتَدَّ نَحوَ عَشرِ سَنَواتٍ بَعدَ الهِجرة، فَكانَ مَرحَلةَ استِقرارِ الأُمّةِ المُسلِمةِ مُجتَمَعًا ودَولة، ولِذا كانَ لِلتَّنزيلِ المَدَنيِّ طابَعٌ مُختَلِفٌ بَيِّن. فَلَمّا رَسَخَت أُسُسُ الإيمان، التَفَتَتِ الآياتُ المَدَنيّةُ إلى التَّشريعِ المُفَصَّلِ اللّازِمِ لِتَنظيمِ حَياةِ الأُمّةِ المُؤمِنة: أحكامِ العِبادةِ المُفَصَّلةِ (الصَّلاةِ والزَّكاةِ والصَّومِ والحَجّ)؛ وأحكامِ المُعامَلاتِ والمال؛ وأحكامِ الزَّواجِ والطَّلاقِ والأُسرة؛ وأحكامِ الميراث؛ وتَشريعِ الجِهادِ وأحكامِ الحَربِ والسَّلم؛ والحُدود؛ ومَبادِئِ العَدلِ والحُكم. ولِذا تَميلُ السُّوَرُ والآياتُ المَدَنيّةُ إلى الطّولِ والتَّفصيل. كَما يُخاطِبُ التَّنزيلُ المَدَنيُّ فِئاتٍ بَرَزَت في المَدينة: المُنافِقينَ الذينَ أظهَروا الإسلامَ وأبطَنوا الكُفر، وأهلَ الكِتابِ مِنَ اليَهودِ والنَّصارى، يُحاوِرُ دَعاويهِم ويَدعوهُم إلى الحَقّ. وكَثيرًا ما يَستَعمِلُ خِطابَ «يا أيُّها الذينَ آمَنوا»، مُخاطِبًا جَماعةَ المُؤمِنينَ المُستَقِرّة، يَدعوها إلى أداءِ واجِباتِها وإكمالِ إيمانِها. وهذه خَصائِصُ غالِبةٌ لا قَواعِدُ مُطلَقة — فَثَمّةَ آياتٌ قِصارٌ في سُوَرٍ مَدَنيّة، وآياتٌ تَشريعيّةٌ نَزَلَت في مَكّة — لكِنَّها مَعًا تَمنَحُ كُلَّ عَهدٍ طابَعَهُ المُمَيَّز.\n\nووَراءَ هذا التَّنزيلِ المُتَدَرِّجِ على مَرحَلَتَينِ حِكمةٌ عَميقةٌ يَتَعَلَّمُ مِنها كُلُّ مُؤمِن. كانَ في مَقدورِ اللهِ أن يُنزِلَ القُرآنَ كُلَّهُ دَفعةً واحِدة، لكِنَّهُ بِحِكمَتِهِ أنزَلَهُ مُتَدَرِّجًا على ثَلاثٍ وعِشرينَ سَنة، وبَيَّنَ هو بَعضَ الأسباب. الأوَّلُ تَثبيتُ القَلب: ﴿لِنُثَبِّتَ بِهِ فُؤادَك﴾ (الفرقان ٣٢) — فالتَّنزيلُ المُتَواصِلُ المُتَدَرِّجُ كانَ يُجَدِّدُ صِلةَ النَّبِيِّ ﷺ بِرَبِّهِ باستِمرار، ويُسَلّيهِ في الشِّدّة، ويُقَوّي عَزمَ المُؤمِنينَ في كُلِّ مِحنة. والثّاني تَيسيرُ الحِفظِ والفَهمِ والتَّطبيق: فَإنزالُ القُرآنِ شَيئًا فَشَيئًا يَسَّرَ على الصَّحابةِ حِفظَهُ وفَهمَهُ العَميقَ والعَمَلَ بِهِ في حَياتِهِم. والثّالِثُ الاستِجابةُ لِلأحداث: فَكَثيرٌ مِنَ الآياتِ نَزَلَ مُباشَرةً جَوابًا لِأحداثٍ وأسئِلةٍ وحاجاتٍ وَقَعَت في حَياةِ الأُمّة، فَقَدَّمَ هَديًا مُناسِبًا وزادَ المَعانيَ وُضوحًا. والرّابِعُ، وهو مِن أهَمِّها، حِكمةُ التَّدَرُّجِ في التَّشريع: فَقد رَسَّخَ اللهُ الإيمانَ في القُلوبِ أوَّلًا في العَهدِ المَكِّيِّ قَبلَ إنزالِ الأحكامِ المُفَصَّلةِ في المَدينة؛ وحَتّى في الأحكامِ، نَزَلَ بَعضُها مُتَدَرِّجًا، وأشهَرُ مِثالٍ تَحريمُ الخَمرِ الذي جاءَ على مَراحِل — تَزهيدًا أوَّلًا، ثُمَّ مَنعًا عِندَ الصَّلاة، ثُمَّ تَحريمًا تامًّا — حَتّى تَقبَلَ القُلوبُ المَملوءةُ إيمانًا الأمرَ وتُطيعَه. وهذا المَنهَجُ المُتَدَرِّجُ أحكَمُ سَبيلٍ لِتَغييرِ القُلوبِ وبِناءِ الأُمّة، ويَحمِلُ دَرسًا خالِدًا لِلشّابِّ المُسلِم: أنَّ التَّغييرَ الحَقيقيَّ الباقيَ — في النَّفسِ أوِ المُجتَمَع — يُبنى عادةً تَدريجيًّا وثابِتًا، على أُسُسٍ قَويّة، بِصَبرٍ وثَبات، لا دَفعةً واحِدة. وكَما بَنى اللهُ أعظَمَ أُمّةٍ في التّاريخِ خُطوةً خُطوة، يَبني المُؤمِنُ إيمانَهُ وخُلُقَهُ وعاداتِهِ الحَسَنةَ خُطوةً خُطوة، يَبدَأُ بِالأُسُسِ ويَنمو مُطَّرِدًا نَحوَ الكَمال.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the most accepted definition of Makkan revelation?", ar: "ما أرجَحُ تَعريفِ المَكِّيّ؟" },
      options: [
        { en: "What was revealed before the Hijrah", ar: "ما نَزَلَ قَبلَ الهِجرة" },
        { en: "What was revealed in winter", ar: "ما نَزَلَ في الشِّتاء" },
        { en: "Only short surahs", ar: "السُّوَرُ القِصارُ فَقَط" },
        { en: "What mentions Makkah", ar: "ما ذَكَرَ مَكّة" },
      ],
      correctIndex: 0,
      explanation: { en: "The time-based definition (before/after Hijrah) is most precise.", ar: "التَّعريفُ الزَّمَنيُّ (قَبلَ/بَعدَ الهِجرة) أدَقّ." },
    },
    {
      prompt: { en: "How did scholars mainly know which verses were Makkan/Madinan?", ar: "بِمَ عَرَفَ العُلَماءُ المَكِّيَّ والمَدَنيَّ أساسًا؟" },
      options: [
        { en: "Authentic transmission from the Companions, plus analysis", ar: "النَّقلِ الصَّحيحِ عنِ الصَّحابةِ، معَ التَّحليل" },
        { en: "Guessing", ar: "التَّخمين" },
        { en: "Dreams", ar: "الأحلام" },
        { en: "It is written in the Qur'an", ar: "مَكتوبٌ في القُرآن" },
      ],
      correctIndex: 0,
      explanation: { en: "Transmission is the foundation; analysis of features supports it.", ar: "النَّقلُ الأساس، وتَحليلُ الخَصائِصِ سَنَد." },
    },
    {
      prompt: { en: "Which is a typical feature of Makkan revelation?", ar: "أيٌّ مِن خَصائِصِ المَكِّيِّ الغالِبة؟" },
      options: [
        { en: "Focus on tawhid, resurrection, and shorter surahs", ar: "التَّركيزُ على التَّوحيدِ والبَعثِ وقِصَرِ السُّوَر" },
        { en: "Detailed inheritance laws", ar: "أحكامُ الميراثِ المُفَصَّلة" },
        { en: "Addressing the hypocrites", ar: "مُخاطَبةُ المُنافِقين" },
        { en: "Rules of war", ar: "أحكامُ الحَرب" },
      ],
      correctIndex: 0,
      explanation: { en: "Makkan revelation builds the foundations of faith.", ar: "المَكِّيُّ يَبني أُصولَ الإيمان." },
    },
    {
      prompt: { en: "Which address typically marks Madinan verses?", ar: "أيُّ خِطابٍ يُمَيِّزُ الآياتِ المَدَنيّةَ غالِبًا؟" },
      options: [
        { en: "'O you who have believed'", ar: "«يا أيُّها الذينَ آمَنوا»" },
        { en: "'O mankind'", ar: "«يا أيُّها النّاس»" },
        { en: "'O disbelievers'", ar: "«يا أيُّها الكافِرون»" },
        { en: "No address", ar: "بِلا خِطاب" },
      ],
      correctIndex: 0,
      explanation: { en: "It addresses the established community of believers.", ar: "يُخاطِبُ جَماعةَ المُؤمِنينَ المُستَقِرّة." },
    },
    {
      prompt: { en: "What is a key wisdom of gradual revelation?", ar: "ما حِكمةٌ رَئيسةٌ لِلتَّنزيلِ المُتَدَرِّج؟" },
      options: [
        { en: "Strengthening the heart and easing memorisation and practice", ar: "تَثبيتُ القَلبِ وتَيسيرُ الحِفظِ والعَمَل" },
        { en: "To make it longer", ar: "لِيَطولَ أكثَر" },
        { en: "To confuse people", ar: "لِيُحَيِّرَ النّاس" },
        { en: "No reason", ar: "بِلا سَبَب" },
      ],
      correctIndex: 0,
      explanation: { en: "Al-Furqan 32 — to strengthen the heart; gradual law builds faith first.", ar: "الفرقان ٣٢ — تَثبيتُ القَلب؛ والتَّدَرُّجُ يَبني الإيمانَ أوَّلًا." },
    },
    {
      prompt: { en: "True or False: The staged prohibition of alcohol shows the wisdom of gradual legislation.", ar: "صَوابٌ أم خَطأ: تَدَرُّجُ تَحريمِ الخَمرِ يُبَيِّنُ حِكمةَ التَّشريعِ المُتَدَرِّج." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "It came in stages so faith-filled hearts could accept it.", ar: "جاءَ مَراحِلَ لِتَقبَلَهُ القُلوبُ المُؤمِنة." },
    },
  ],
};
