import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const takeAccountOfYourselves: CourseLesson = {
  slug: "g6y7-take-account-of-yourselves",
  name: {
    en: "Take Account of Yourselves",
    ar: "حاسِبوا أنفُسَكُم",
  },
  shortIntro: {
    en: "A demanding study of muhasabah (self-accountability): the Qur'anic command to look at what we send ahead for tomorrow, 'Umar's famous principle of judging the self before being judged, and a practical method for examining the heart, the tongue, and the day.",
    ar: "دِراسةٌ مُطالِبةٌ لِمُحاسَبةِ النَّفس: الأمرُ القُرآنِيُّ بِالنَّظَرِ فيما نُقَدِّمُهُ لِلغَد، وقاعِدةُ عُمَرَ المَشهورةُ في مُحاسَبةِ النَّفسِ قَبلَ الحِساب، ومَنهَجٌ عَمَلِيٌّ لِمُراجَعةِ القَلبِ واللِّسانِ واليَوم.",
  },
  quranSurahs: ["Al-Hashr 18", "Al-Qiyamah 2", "Al-Infitar 5"],
  sections: [
    {
      title: { en: "Retrieval & the command to look ahead", ar: "استِرجاعٌ والأمرُ بِالنَّظَرِ لِلغَد" },
      learningObjectives: [
        { en: "Define muhasabah and distinguish it from mere regret or worry.", ar: "أُعَرِّفُ المُحاسَبةَ وأُمَيِّزُها مِن مُجَرَّدِ النَّدَمِ أو القَلَق." },
        { en: "Explain the command of Al-Hashr 18 and why taqwa frames it twice.", ar: "أُبَيِّنُ أمرَ الحَشرِ ١٨ ولِماذا أحاطَتهُ التَّقوى مَرَّتَين." },
      ],
      successCriteria: [
        { en: "I can explain 'let every soul look to what it has sent ahead for tomorrow.'", ar: "أُفَسِّرُ «ولتَنظُرْ نَفسٌ ما قَدَّمَت لِغَدٍ»." },
        { en: "I can give one reason muhasabah is a duty, not an option.", ar: "أُعطي سَبَبًا واحِدًا لِكَونِ المُحاسَبةِ واجِبًا لا خِيارًا." },
      ],
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern lighting a path in the dark.", ar: "مِصباحٌ يُنيرُ طَريقًا في الظَّلام." },
        caption: { en: "Self-accountability is a light a believer carries to inspect the road already walked.", ar: "مُحاسَبةُ النَّفسِ نورٌ يَحمِلُهُ المُؤمِنُ لِيَتَفَقَّدَ الطَّريقَ الذي سَلَكَه." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does the verse say 'for tomorrow' and not 'for the Hereafter'?", ar: "لِماذا قالَتِ الآيةُ «لِغَدٍ» ولم تَقُلْ «لِلآخِرة»؟" },
        body: {
          en: "Allah calls the Day of Judgement 'tomorrow' (ghad). Tomorrow feels close, certain, and personal — not a distant abstraction. Analyse the rhetorical effect: how does naming the Hereafter 'tomorrow' change the way a person should treat today's choices?",
          ar: "سَمّى اللهُ يَومَ القِيامةِ «غَدًا». والغَدُ قَريبٌ مُؤَكَّدٌ شَخصِيّ — لا فِكرةً بَعيدةً مُجَرَّدة. حَلِّلِ الأثَرَ البَلاغِيّ: كَيفَ تُغَيِّرُ تَسميةُ الآخِرةِ «غَدًا» طَريقةَ تَعامُلِ المَرءِ مَعَ خِياراتِ يَومِه؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"O you who believe, fear Allah. And let every soul look to what it has sent ahead for tomorrow; and fear Allah. Indeed, Allah is Aware of what you do.\" — Al-Hashr 18", ar: "﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ ۖ وَاتَّقُوا اللَّهَ ۚ إِنَّ اللَّهَ خَبِيرٌ بِمَا تَعْمَلُونَ﴾ — الحشر ١٨" },
          ],
        },
        {
          label: { en: "Key term", ar: "مُصطَلَحٌ مِفتاحِيّ" },
          lines: [
            { en: "Muhasabah: a believer calling himself to account — reviewing intentions and deeds, praising Allah for good and repenting from wrong — so the self is corrected before the final reckoning.", ar: "المُحاسَبة: أن يُحاسِبَ المُؤمِنُ نَفسَهُ — يُراجِعُ النِّيّاتِ والأعمال، يَحمَدُ اللهَ على الخَيرِ ويَتوبُ مِنَ الخَطأ — لِتُقَوَّمَ النَّفسُ قَبلَ الحِسابِ الأخير." },
          ],
        },
      ],
      body: {
        en: "Al-Hashr 18 is one of the most concentrated verses on self-accountability in the Qur'an, and every word repays close reading. It opens by addressing the believers — 'O you who believe' — then commands taqwa, then commands self-examination, then repeats taqwa, and finally seals it with a reminder that Allah is fully aware of what we do. Notice the design: the command to inspect the self is wrapped on both sides by the command to fear Allah. Muhasabah without taqwa becomes anxious self-criticism; taqwa without muhasabah becomes a claim with no inspection. The verse binds the two together.\n\nThe heart of the verse is 'let every soul look to what it has sent ahead for tomorrow.' The word for 'look' (tanzur) means a careful, deliberate examination, not a passing glance. And the word for 'sent ahead' (qaddamat) pictures life as a series of deeds we are constantly dispatching forward to meet us on the Day of Judgement. We do not arrive at the Hereafter empty-handed; we arrive to find exactly what we sent.\n\nThe choice of the word 'tomorrow' (ghad) for the Day of Judgement is deliberate and powerful. Allah, who could have named it in the most awesome terms, calls it simply 'tomorrow' — as near and as certain as the day after today. This is not to make it small but to make it real: just as a wise person prepares tonight for tomorrow's important task, the believer prepares today for the Day that is, in truth, only one 'tomorrow' away. Muhasabah, then, is not optional self-improvement. It is the believer's response to a direct command and to the certainty that Allah, 'Aware of what you do,' is recording it all.",
        ar: "الحَشرُ ١٨ مِن أكثَفِ آياتِ المُحاسَبةِ في القُرآن، وكُلُّ كَلِمةٍ فيها تُجزي بِالتَّأمُّل. تَفتَتِحُ بِنِداءِ المُؤمِنين — «يا أيُّها الذينَ آمَنوا» — ثُمَّ تَأمُرُ بِالتَّقوى، ثُمَّ بِمُحاسَبةِ النَّفس، ثُمَّ تُعيدُ الأمرَ بِالتَّقوى، ثُمَّ تَختِمُ بِالتَّذكيرِ بِأنَّ اللهَ خَبيرٌ بِما نَعمَل. وتَأمَّلِ التَّصميم: فأمرُ مُراجَعةِ النَّفسِ مَحفوفٌ مِن جانِبَيهِ بِأمرِ تَقوى الله. فالمُحاسَبةُ بِلا تَقوى تَصيرُ جَلدًا قَلِقًا لِلنَّفس؛ والتَّقوى بِلا مُحاسَبةٍ دَعوى بِلا تَفَقُّد. والآيةُ تَجمَعُ بَينَهُما.\n\nوقَلبُ الآيةِ «ولتَنظُرْ نَفسٌ ما قَدَّمَت لِغَد». و«النَّظَرُ» هُنا تَأَمُّلٌ مُتَأنٍّ مَقصود، لا لَمحةً عابِرة. و«قَدَّمَت» تُصَوِّرُ الحَياةَ سِلسِلةَ أعمالٍ نُرسِلُها دَومًا إلى الأمامِ لِتَلقانا يَومَ القِيامة. فَنَحنُ لا نَصِلُ الآخِرةَ صِفرَ اليَدَين؛ بل نَصِلُ لِنَجِدَ ما قَدَّمناهُ بِالضَّبط.\n\nواختِيارُ لَفظِ «غَدٍ» لِيَومِ القِيامةِ مَقصودٌ بَليغ. فاللهُ الذي كانَ بِوُسعِهِ تَسميَتُهُ بِأهوَلِ الأوصاف، سَمّاهُ ببساطةٍ «غَدًا» — قَريبًا مُؤَكَّدًا كَيَومٍ بَعدَ يَومِنا. لا تَصغيرًا لَهُ بل تَحقيقًا لِواقِعِيَّتِه: فَكَما يُعِدُّ العاقِلُ اللَّيلةَ لِمُهِمّةِ الغَدِ المُهِمّة، يُعِدُّ المُؤمِنُ اليَومَ لِليَومِ الذي هو في الحَقيقةِ على بُعدِ «غَدٍ» واحِد. فالمُحاسَبةُ إذَن لَيسَت تَطويرًا اختِيارِيًّا لِلذّات؛ بل هي استِجابةُ المُؤمِنِ لِأمرٍ صَريحٍ ولِيَقينِ أنَّ اللهَ «خَبيرٌ بِما تَعمَلون» يُحصي ذلك كُلَّه.",
      },
    },
    {
      title: { en: "'Umar's principle: judge yourself first", ar: "قاعِدةُ عُمَر: حاسِبْ نَفسَكَ أوَّلًا" },
      learningObjectives: [
        { en: "Explain 'Umar's saying and connect it to weighing deeds on the Day.", ar: "أُبَيِّنُ قَولَ عُمَرَ وأربِطُهُ بِوَزنِ الأعمالِ يَومَ القِيامة." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A balance of mountain and sky.", ar: "تَوازُنٌ بَينَ جَبَلٍ وسَماء." },
        caption: { en: "'Weigh yourselves before you are weighed' — the believer's daily court.", ar: "«وزِنوا أنفُسَكُم قَبلَ أن توزَنوا» — مَحكَمةُ المُؤمِنِ اليَومِيّة." },
      },
      infoBoxes: [
        {
          label: { en: "Athar (saying of 'Umar)", ar: "أثَرٌ (قَولُ عُمَر)" },
          lines: [
            { en: "'Umar ibn al-Khattab (RA) said: 'Call yourselves to account before you are called to account, and weigh your deeds before they are weighed for you, and adorn yourselves for the greatest review — the Day you will be presented and nothing of yours will be hidden.'", ar: "قالَ عُمَرُ بنُ الخَطّابِ رضي الله عنه: «حاسِبوا أنفُسَكُم قَبلَ أن تُحاسَبوا، وزِنوا أعمالَكُم قَبلَ أن توزَنَ عليكُم، وتَزَيَّنوا لِلعَرضِ الأكبَر، يَومَ تُعرَضونَ لا تَخفى مِنكُم خافِية»." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "شاهِدٌ قُرآنِيّ" },
          lines: [
            { en: "\"And the weighing on that Day will be the truth. So those whose scales are heavy — it is they who will be successful.\" — Al-A'raf 8", ar: "﴿وَالْوَزْنُ يَوْمَئِذٍ الْحَقُّ ۚ فَمَن ثَقُلَتْ مَوَازِينُهُ فَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ﴾ — الأعراف ٨" },
          ],
        },
      ],
      callout: {
        label: { en: "Analyse the logic", ar: "حَلِّلِ المَنطِق" },
        title: { en: "Why is it easier to be judged if you judge yourself first?", ar: "لِماذا يَهونُ الحِسابُ على مَن حاسَبَ نَفسَهُ أوَّلًا؟" },
        body: {
          en: "'Umar argues that the wise person settles the account now, while corrections are still possible, rather than discovering the deficit when nothing can be changed. Construct the comparison: how is muhasabah like a student who marks his own work before the exam, and what does that reveal about the mercy of being commanded to do it?",
          ar: "يُحاجُّ عُمَرُ بِأنَّ العاقِلَ يُسَوّي الحِسابَ الآنَ وما زالَ التَّصحيحُ مُمكِنًا، لا أن يَكتَشِفَ العَجزَ حينَ لا يُمكِنُ تَغييرُ شَيء. اصنَعِ المُقارَنة: كَيفَ تُشبِهُ المُحاسَبةُ طالِبًا يُصَحِّحُ عَمَلَهُ قَبلَ الامتِحان، وماذا يَكشِفُ ذلك عن رَحمةِ الأمرِ بِها؟",
        },
      },
      body: {
        en: "The famous words of 'Umar ibn al-Khattab translate the command of Al-Hashr 18 into a way of living: 'Call yourselves to account before you are called to account.' This is one of the great principles of Islamic spiritual life, and its wisdom is the wisdom of every person who prepares. The reckoning of the Day of Judgement is coming whether we are ready or not; the only question is whether we meet it having already reviewed our own record, or whether we meet it shocked by what we find.\n\nConsider 'Umar's image of weighing. On the Day, deeds will be placed on a scale that is perfectly just (Al-A'raf 8), and the one whose scale is heavy with good will succeed. The believer who practices muhasabah is, in effect, weighing his deeds in advance — testing his prayer, his honesty, his treatment of his parents — so that he can add good and remove evil while there is still time. The person who never does this is like a merchant who never checks his accounts until the day the debts are demanded.\n\nThere is great mercy hidden in this command. To be told 'judge yourself first' is to be given the chance to correct the paper before it is marked. A student who reviews his own answers and fixes his mistakes walks into the exam calm; the one who refuses to look will face every error at once. 'Umar then adds the deepest motive: 'adorn yourselves for the greatest review' — the muhasabah of the believer is not driven by fear of failure alone but by love of standing before Allah with a record worth presenting. A serious student should hear in these words both a warning and an invitation: the account is certain, but the time to settle it generously is now.",
        ar: "كَلِماتُ عُمَرَ بنِ الخَطّابِ المَشهورةُ تُتَرجِمُ أمرَ الحَشرِ ١٨ إلى مَنهَجِ حَياة: «حاسِبوا أنفُسَكُم قَبلَ أن تُحاسَبوا». وهذا مِن عَظائِمِ قَواعِدِ الحَياةِ الرّوحيّةِ في الإسلام، وحِكمَتُهُ حِكمةُ كُلِّ مَن يَستَعِدّ. فَحِسابُ يَومِ القِيامةِ آتٍ سَواءٌ استَعدَدنا أم لا؛ والسُّؤالُ الوَحيدُ: أنَلقاهُ وقد راجَعنا سِجِلَّنا، أم نَلقاهُ مَصدومينَ بِما نَجِد؟\n\nتَأمَّلْ صورةَ الوَزنِ عِندَ عُمَر. فَيَومَ القِيامةِ توضَعُ الأعمالُ في ميزانٍ عَدلٍ تامّ (الأعراف ٨)، ويُفلِحُ مَن ثَقُلَ ميزانُهُ بِالخَير. والمُؤمِنُ الذي يُحاسِبُ نَفسَهُ كَأنَّهُ يَزِنُ أعمالَهُ مُقَدَّمًا — يَختَبِرُ صَلاتَهُ وصِدقَهُ وبِرَّهُ بِوالِدَيه — لِيَزيدَ الخَيرَ ويَطرَحَ الشَّرَّ وما زالَ في الوَقتِ مُتَّسَع. أمّا مَن لا يَفعَلُ ذلك أبَدًا فَكَتاجِرٍ لا يُراجِعُ حِساباتِهِ حَتّى يَومِ المُطالَبةِ بِالدُّيون.\n\nوفي هذا الأمرِ رَحمةٌ عَظيمةٌ مَخبوءة. فأن يُقالَ لَكَ «حاسِبْ نَفسَكَ أوَّلًا» مَنحٌ لَكَ فُرصةَ تَصحيحِ الوَرَقةِ قَبلَ تَصحيحِها. فالطّالِبُ الذي يُراجِعُ إجاباتِهِ ويُصلِحُ أخطاءَهُ يَدخُلُ الامتِحانَ مُطمَئِنًّا؛ ومَن أبى النَّظَرَ واجَهَ أخطاءَهُ كُلَّها دَفعةً واحِدة. ثُمَّ يُضيفُ عُمَرُ أعمَقَ الدَّوافِع: «وتَزَيَّنوا لِلعَرضِ الأكبَر» — فَمُحاسَبةُ المُؤمِنِ لا يَدفَعُها خَوفُ الفَشَلِ وَحدَه بل حُبُّ الوُقوفِ بَينَ يَدَيِ اللهِ بِسِجِلٍّ يَستَحِقُّ العَرض. وعلى الطّالِبِ الجادِّ أن يَسمَعَ في هذا الكَلامِ إنذارًا ودَعوةً مَعًا: الحِسابُ مُؤَكَّد، ووَقتُ تَسويَتِهِ بِسَخاءٍ هو الآن.",
      },
    },
    {
      title: { en: "The self that blames itself", ar: "النَّفسُ اللَّوّامة" },
      learningObjectives: [
        { en: "Distinguish the three states of the self (ammarah, lawwamah, mutma'innah).", ar: "أُمَيِّزُ مَراتِبَ النَّفسِ الثَّلاث (الأمّارة، اللَّوّامة، المُطمَئِنّة)." },
      ],
      image: {
        src: IMG.sea,
        alt: { en: "Restless waves and calm water meeting.", ar: "أمواجٌ مُضطَرِبةٌ تَلتَقي ماءً ساكِنًا." },
        caption: { en: "The self moves from commanding evil, to blaming itself, to peace.", ar: "تَنتَقِلُ النَّفسُ مِنَ الأمرِ بِالسّوء، إلى لَومِ نَفسِها، إلى الطُّمأنينة." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And I swear by the self-reproaching soul.\" — Al-Qiyamah 2", ar: "﴿وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ﴾ — القيامة ٢" },
            { en: "\"Indeed, the soul is a persistent enjoiner of evil, except those upon whom my Lord has mercy.\" — Yusuf 53", ar: "﴿إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي﴾ — يوسف ٥٣" },
            { en: "\"O reassured soul, return to your Lord, well-pleased and pleasing to Him.\" — Al-Fajr 27-28", ar: "﴿يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ۝ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً﴾ — الفجر ٢٧-٢٨" },
          ],
        },
      ],
      callout: {
        label: { en: "Think deeply", ar: "تَأمَّلْ بِعُمق" },
        title: { en: "Is a guilty conscience a weakness or a gift?", ar: "أتَأنيبُ الضَّميرِ ضَعفٌ أم نِعمة؟" },
        body: {
          en: "Allah swears by 'the self-reproaching soul' — the inner voice that blames us when we slip. Many today try to silence that voice as if it were harmful. Argue the opposite: how is the blaming self a sign of life and mercy, and what happens to a person who manages to switch it off completely?",
          ar: "أقسَمَ اللهُ بِـ«النَّفسِ اللَّوّامة» — ذلك الصَّوتِ الباطِنِ الذي يَلومُنا إذا زَلَلنا. ويُحاوِلُ كَثيرونَ اليَومَ إسكاتَ هذا الصَّوتِ كَأنَّهُ مُؤذٍ. حاجِجْ بِالعَكس: كَيفَ يَكونُ لَومُ النَّفسِ عَلامةَ حَياةٍ ورَحمة، وماذا يَحِلُّ بِمَن نَجَحَ في إطفائِهِ تَمامًا؟",
        },
      },
      body: {
        en: "Muhasabah is only possible because Allah placed within us a conscience — and the Qur'an gives that conscience names. In Surat Yusuf, the self at its lowest is 'ammarah bis-su'' — the self that constantly commands evil, pushing toward desire and ease. Left unchecked, this is the self that follows every whim. But mercy intervenes: 'except those upon whom my Lord has mercy.'\n\nAbove it is the 'nafs lawwamah,' the self-reproaching soul, so honoured that Allah swears by it at the opening of Surat Al-Qiyamah. This is the self of the struggling believer: it slips, then immediately blames itself; it does good, then worries it did not do enough. Far from being a flaw, this inner blame is the engine of muhasabah. The person whose conscience still stings when they sin is spiritually alive. The truly dangerous condition is to sin and feel nothing — for that is a heart that has managed to silence its own alarm.\n\nThe highest state is the 'nafs mutma'innah,' the soul at peace, addressed tenderly in Surat Al-Fajr: 'Return to your Lord, well-pleased and pleasing to Him.' This is the goal of a lifetime of self-accountability — a self that, through constant correction, has been trained into tranquillity and trust. Notice the journey these three names describe: from a self that drags us down, through a self that pulls us back up by blaming us, to a self finally at rest with its Lord. Muhasabah is the daily work that moves us along this path. A demanding student should value the discomfort of a guilty conscience for what it really is: not a sickness to be numbed, but a mercy to be obeyed.",
        ar: "لا تُمكِنُ المُحاسَبةُ إلّا لِأنَّ اللهَ أودَعَ فينا ضَميرًا — وقد سَمّى القُرآنُ هذا الضَّميرَ أسماء. ففي سورةِ يوسُفَ النَّفسُ في أحَطِّ حالاتِها «أمّارةٌ بِالسّوء» — تَأمُرُ بِالشَّرِّ دَومًا وتَدفَعُ إلى الهَوى والدَّعة. وإذا تُرِكَت بِلا ضابِطٍ كانَتِ النَّفسَ التّابِعةَ لِكُلِّ هَوًى. لكِنَّ الرَّحمةَ تَتَدَخَّل: «إلّا ما رَحِمَ رَبِّي».\n\nوفَوقَها «النَّفسُ اللَّوّامة»، وهي مِنَ الشَّرَفِ بِحَيثُ أقسَمَ اللهُ بِها في مَطلَعِ سورةِ القِيامة. وهي نَفسُ المُؤمِنِ المُجاهِد: تَزِلُّ فَتَلومُ نَفسَها فَورًا؛ وتُحسِنُ فَتَخشى أنَّها لم تُحسِنْ بِما يَكفي. وهذا اللَّومُ الباطِنُ — بَعيدًا عن كَونِهِ عَيبًا — مُحَرِّكُ المُحاسَبة. فَمَن لا يَزالُ ضَميرُهُ يُؤلِمُهُ إذا أذنَبَ فَهو حَيٌّ رُوحيًّا. والحالُ الخَطيرةُ حَقًّا أن يُذنِبَ المَرءُ فَلا يَشعُرَ بِشَيء — فَذاكَ قَلبٌ نَجَحَ في إسكاتِ إنذارِهِ.\n\nوأرفَعُ المَراتِبِ «النَّفسُ المُطمَئِنّة»، تُنادى بِرِفقٍ في سورةِ الفَجر: «ارجِعي إلى رَبِّكِ راضيةً مَرضيّة». وهذه غايةُ عُمُرٍ مِنَ المُحاسَبة — نَفسٌ دُرِّبَت بِالتَّصحيحِ الدّائِمِ حَتّى صارَت إلى طُمَأنينةٍ وثِقة. وتَأمَّلِ الرِّحلةَ التي تَصِفُها هذه الأسماءُ الثَّلاثة: مِن نَفسٍ تَجُرُّنا إلى أسفَل، إلى نَفسٍ تَشُدُّنا إلى أعلى بِلَومِها، إلى نَفسٍ تَستَقِرُّ أخيرًا مَعَ رَبِّها. والمُحاسَبةُ هي العَمَلُ اليَومِيُّ الذي يَنقُلُنا في هذا الطَّريق. وعلى الطّالِبِ المُطالِبِ أن يُثَمِّنَ ألَمَ الضَّميرِ على حَقيقَتِه: لَيسَ مَرَضًا يُخَدَّر، بل رَحمةً تُطاع.",
      },
    },
    {
      title: { en: "A method for examining the day", ar: "مَنهَجٌ لِمُراجَعةِ اليَوم" },
      learningObjectives: [
        { en: "Design a practical daily muhasabah covering intention, worship, tongue, and dealings.", ar: "أُصَمِّمُ مُحاسَبةً يَومِيّةً عَمَلِيّةً تَشمَلُ النِّيّةَ والعِبادةَ واللِّسانَ والمُعامَلة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A notebook and an open Qur'an.", ar: "دَفتَرٌ ومُصحَفٌ مَفتوح." },
        caption: { en: "A few honest minutes each night can reshape an entire life.", ar: "دَقائِقُ صادِقةٌ كُلَّ لَيلةٍ قد تُعيدُ تَشكيلَ حَياةٍ بِأكمَلِها." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: 'The clever one is he who holds himself to account and works for what comes after death, and the helpless one is he who follows his desires and merely wishes upon Allah.' — At-Tirmidhi", ar: "قالَ النَّبِيُّ ﷺ: «الكَيِّسُ مَن دانَ نَفسَهُ وعَمِلَ لِما بَعدَ المَوت، والعاجِزُ مَن أتبَعَ نَفسَهُ هَواها وتَمَنّى على اللهِ» — الترمذي" },
          ],
        },
        {
          label: { en: "Method (four questions)", ar: "مَنهَج (أربَعةُ أسئِلة)" },
          lines: [
            { en: "1) Intention: Why did I do what I did today? 2) Obligations: Did I pray on time and with presence? 3) Tongue: Did I lie, backbite, or harm anyone with words? 4) Dealings: Was I just and kind to family, classmates, and strangers?", ar: "١) النِّيّة: لِماذا فَعَلتُ ما فَعَلتُ اليَوم؟ ٢) الفَرائِض: أصَلَّيتُ في الوَقتِ بِحُضورِ قَلب؟ ٣) اللِّسان: أكَذَبتُ أو اغتَبتُ أو آذَيتُ بِكَلِمة؟ ٤) المُعامَلة: أكُنتُ عادِلًا رَحيمًا مَعَ الأهلِ والزُّمَلاءِ والغُرَباء؟" },
          ],
        },
      ],
      responsePrompt: {
        title: { en: "Written response", ar: "إجابةٌ مَكتوبة" },
        prompt: { en: "Design your own short nightly muhasabah of 4-5 honest questions you would truly ask yourself, and explain why you chose them. Then describe what you would do the moment you find a fault.", ar: "صَمِّمْ مُحاسَبةً لَيلِيّةً قَصيرةً مِن ٤-٥ أسئِلةٍ صادِقةٍ تَسألُها نَفسَكَ حَقًّا، وعَلِّلِ اختِيارَك. ثُمَّ صِفْ ماذا تَفعَلُ لَحظةَ تَجِدُ خَطأً." },
        placeholder: { en: "Each night I would ask myself... and when I find a fault I will...", ar: "كُلَّ لَيلةٍ أسألُ نَفسي... وإذا وَجَدتُ خَطأً سأ..." },
      },
      body: {
        en: "Muhasabah is not a vague feeling of guilt; it is a method, and like any skill it can be learned and practiced. The Prophet ﷺ defined the intelligent person precisely as the one who 'holds himself to account and works for what comes after death,' contrasting him with the one who chases his desires and then merely hopes for the best from Allah. Wishful thinking is not faith; faith plans and reviews.\n\nA simple, powerful method is to set aside a few honest minutes each night and pass the day before the heart in four areas. First, intention: ask not only what you did but why — did you pray, study, or help others for Allah, or for praise? Sincerity is examined first because it is the root of every deed's worth. Second, the obligations: did you guard your five prayers in their times and with presence of heart, or did they become a rushed habit? Third, the tongue, which the Prophet ﷺ warned topples people into the Fire: did you lie, mock, backbite, or wound someone with a careless word? Fourth, your dealings: were you just, honest, and gentle with your parents, classmates, and even strangers?\n\nThe purpose of finding a fault is not to drown in regret but to act at once. Imam al-Ghazali and others describe the steps that follow muhasabah: sincere repentance (tawbah) for what was wrong, a concrete resolve not to repeat it, and where possible, making amends — returning a right, apologising, repairing the harm. A fault discovered and repaired tonight is a fault removed from tomorrow's scale. This is why the believer's nightly accounting, though it takes only minutes, can over months and years reshape an entire character. The demanding student should treat muhasabah as seriously as any subject they study: with honesty, with a method, and with the courage to change what the review reveals.",
        ar: "المُحاسَبةُ لَيسَت شُعورًا غامِضًا بِالذَّنب؛ بل مَنهَج، وكَأيِّ مَهارةٍ تُتَعَلَّمُ وتُمارَس. عَرَّفَ النَّبِيُّ ﷺ العاقِلَ بِأنَّهُ «مَن دانَ نَفسَهُ وعَمِلَ لِما بَعدَ المَوت»، في مُقابِلِ مَن يَتبَعُ هَواهُ ثُمَّ يَتَمَنّى على اللهِ الخَير. فالتَّمَنّي لَيسَ إيمانًا؛ والإيمانُ يُخَطِّطُ ويُراجِع.\n\nومِن أبسَطِ المَناهِجِ وأقواها أن تُفرِدَ دَقائِقَ صادِقةً كُلَّ لَيلةٍ تَعرِضُ فيها اليَومَ على قَلبِكَ في أربَعةِ مَيادين. أوَّلًا النِّيّة: لا تَسألْ ماذا فَعَلتَ فَقَط بل لِماذا — أصَلَّيتَ وذاكَرتَ وأعَنتَ للهِ أم لِلمَدح؟ والإخلاصُ يُحاسَبُ أوَّلًا لِأنَّهُ أصلُ قيمةِ كُلِّ عَمَل. ثانيًا الفَرائِض: أحَفِظتَ صَلَواتِكَ الخَمسَ في أوقاتِها بِحُضورِ قَلب، أم صارَت عادةً مُستَعجَلة؟ ثالثًا اللِّسانُ الذي حَذَّرَ النَّبِيُّ ﷺ أن يَكُبَّ النّاسَ في النّار: أكَذَبتَ أو سَخِرتَ أو اغتَبتَ أو جَرَحتَ بِكَلِمةٍ عابِرة؟ رابعًا مُعامَلَتُك: أكُنتَ عادِلًا صادِقًا رَفيقًا مَعَ والِدَيكَ وزُمَلائِكَ وحَتّى الغُرَباء؟\n\nوالغايةُ مِن وِجدانِ الخَطأ لَيسَتِ الغَرَقَ في النَّدَمِ بل العَمَلَ فَورًا. وقد ذَكَرَ الإمامُ الغَزالِيُّ وغَيرُهُ خَطَواتٍ تَتلو المُحاسَبة: تَوبةٌ صادِقةٌ مِنَ الخَطأ، وعَزمٌ مَلموسٌ على عَدَمِ العَودة، وما أمكَنَ مِن جَبرٍ — رَدِّ حَقٍّ، أوِ اعتِذار، أو إصلاحِ ضَرَر. فالخَطأُ الذي يُكتَشَفُ ويُجبَرُ اللَّيلةَ خَطأٌ يُرفَعُ مِن ميزانِ الغَد. ولِهذا فإنَّ حِسابَ المُؤمِنِ اللَّيلِيَّ، وإن لم يَستَغرِقْ إلّا دَقائِق، قد يُعيدُ على مَدى الشُّهورِ والسِّنينَ تَشكيلَ خُلُقٍ بِأكمَلِه. وعلى الطّالِبِ المُطالِبِ أن يَأخُذَ المُحاسَبةَ بِجِدِّيّةِ أيِّ مادّةٍ يَدرُسُها: بِصِدقٍ، وبِمَنهَج، وبِشَجاعةِ تَغييرِ ما تَكشِفُهُ المُراجَعة.",
      },
    },
    {
      title: { en: "The danger of delay and false hope", ar: "خَطَرُ التَّسويفِ والأمَلِ الكاذِب" },
      learningObjectives: [
        { en: "Explain why delaying repentance and relying on bare wishes is spiritually fatal.", ar: "أُبَيِّنُ لِماذا يَكونُ تَأخيرُ التَّوبةِ والاتِّكالُ على مُجَرَّدِ الأمانِيِّ قاتِلًا رُوحيًّا." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "Daylight that will not last forever.", ar: "ضَوءُ نَهارٍ لَن يَدومَ أبَدًا." },
        caption: { en: "'Before you are called to account' — the door of correction is open only now.", ar: "«قَبلَ أن تُحاسَبوا» — بابُ التَّصحيحِ مَفتوحٌ الآنَ فَقَط." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"What has deceived you concerning your Lord, the Most Generous?\" — Al-Infitar 6", ar: "﴿يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ﴾ — الانفطار ٦" },
            { en: "\"And spend from what We have provided you before death approaches one of you and he says, 'My Lord, if only You would delay me...'\" — Al-Munafiqun 10", ar: "﴿وَأَنفِقُوا مِن مَّا رَزَقْنَاكُم مِّن قَبْلِ أَن يَأْتِيَ أَحَدَكُمُ الْمَوْتُ فَيَقُولَ رَبِّ لَوْلَا أَخَّرْتَنِي...﴾ — المنافقون ١٠" },
          ],
        },
      ],
      callout: {
        label: { en: "Confront it", ar: "واجِهْها" },
        title: { en: "'I'll repent when I'm older' — examine the trap", ar: "«سأتوبُ حينَ أكبَر» — افحَصِ الفَخّ" },
        body: {
          en: "Many delay change with a quiet bargain: enjoy now, repent later. Expose the flaw in this plan: it assumes you will have a 'later,' that your heart will still be soft then, and that a habit fed for years will be easy to break. Argue why the only safe time to take account is the present moment.",
          ar: "يُؤَجِّلُ كَثيرونَ التَّغييرَ بِصَفقةٍ صامِتة: تَمَتَّعِ الآنَ وتُبْ لاحِقًا. اكشِفْ خَلَلَ هذه الخِطّة: فهي تَفتَرِضُ أنَّ لَكَ «لاحِقًا»، وأنَّ قَلبَكَ سَيَبقى لَيِّنًا حينَئذٍ، وأنَّ عادةً غُذِّيَت سِنينَ يَسهُلُ كَسرُها. حاجِجْ لِماذا لا وَقتَ آمِنًا لِلمُحاسَبةِ إلّا اللَّحظةَ الحاضِرة.",
        },
      },
      body: {
        en: "The greatest enemy of muhasabah is not open rebellion but quiet postponement. Few people decide never to improve; most simply decide to improve later. The Qur'an confronts this directly in Surat Al-Infitar with a piercing question: 'O man, what has deceived you concerning your Lord, the Most Generous?' The mufassirun note the subtlety: it is often Allah's very generosity that people exploit — they sin freely, reasoning that the Most Merciful will forgive anyway. But mercy is for the one who turns back, not for the one who uses mercy as an excuse never to turn.\n\nDelay is a trap built on three false assumptions. First, that you will have a 'later' — yet no one is promised tomorrow, and Surat Al-Munafiqun shows the soul at death begging, 'My Lord, if only You would delay me,' a request that is never granted. Second, that your heart will be as soft then as it is now — but hearts harden with each ignored warning, and the conscience that stings today can be silenced by years of neglect. Third, that a sin fed for years will be easy to abandon — yet habits sink roots, and the longer they grow the harder they are to pull out.\n\nThis is exactly why 'Umar said 'before you are called to account' and why Al-Hashr 18 commands looking ahead now. The door of correction is open only in the present; the past cannot be relived and the future is not guaranteed. False hope (tamanni) whispers that wishing for Paradise is the same as working for it — but the Prophet ﷺ called that person 'helpless.' True hope (raja') is the confidence of someone who is actually striving, repenting, and improving. A serious student must learn to tell the two apart, and to act on the only certainty they possess: this moment, in which the account can still be set right.",
        ar: "أعدى أعداءِ المُحاسَبةِ لَيسَ التَّمَرُّدَ الصَّريحَ بل التَّأجيلَ الهادِئ. فَقَليلٌ مَن يُقَرِّرُ ألّا يُصلِحَ أبَدًا؛ وأكثَرُ النّاسِ يُقَرِّرونَ الإصلاحَ لاحِقًا فَحَسب. ويُواجِهُ القُرآنُ هذا مُباشَرةً في سورةِ الانفِطارِ بِسُؤالٍ نافِذ: «يا أيُّها الإنسانُ ما غَرَّكَ بِرَبِّكَ الكَريم؟» ويُنَبِّهُ المُفَسِّرونَ على اللَّطيفة: فَكَثيرًا ما يَستَغِلُّ النّاسُ كَرَمَ اللهِ نَفسَه — يُذنِبونَ بِلا تَحَرُّجٍ مُحتَجّينَ بِأنَّ الرَّحيمَ سَيَغفِرُ على كُلِّ حال. لكِنَّ الرَّحمةَ لِمَن رَجَع، لا لِمَنِ اتَّخَذَ الرَّحمةَ ذَريعةً ألّا يَرجِعَ أبَدًا.\n\nوالتَّأجيلُ فَخٌّ مَبنِيٌّ على ثَلاثِ مُقَدِّماتٍ كاذِبة. الأولى: أنَّ لَكَ «لاحِقًا» — ولا أحَدَ يُضمَنُ لَهُ غَد، وتُري سورةُ المنافِقونَ النَّفسَ عِندَ المَوتِ تَستَجدي: «رَبِّ لَولا أخَّرتَني»، وهو طَلَبٌ لا يُجاب. والثانية: أنَّ قَلبَكَ سَيَبقى حينَئذٍ لَيِّنًا كَما هو الآن — لكِنَّ القُلوبَ تَقسو مَعَ كُلِّ نَذيرٍ يُهمَل، والضَّميرُ الذي يُؤلِمُ اليَومَ قد تُسكِتُهُ سِنونَ الغَفلة. والثالثة: أنَّ ذَنبًا غُذِّيَ سِنينَ يَسهُلُ تَركُه — لكِنَّ العاداتِ تَضرِبُ جُذورًا، وكُلَّما طالَت صَعُبَ اقتِلاعُها.\n\nولِهذا قالَ عُمَرُ «قَبلَ أن تُحاسَبوا»، وأمَرَ الحَشرُ ١٨ بِالنَّظَرِ لِلغَدِ الآن. فَبابُ التَّصحيحِ مَفتوحٌ في الحاضِرِ فَقَط؛ فالماضي لا يُعادُ والمُستَقبَلُ غَيرُ مَضمون. والأمَلُ الكاذِبُ (التَّمَنّي) يُوَسوِسُ بِأنَّ تَمَنّي الجَنّةِ كالعَمَلِ لَها — وقد سَمّى النَّبِيُّ ﷺ صاحِبَهُ «عاجِزًا». أمّا الرَّجاءُ الحَقُّ فَثِقةُ مَن يَسعى ويَتوبُ ويَتَحَسَّنُ فِعلًا. وعلى الطّالِبِ الجادِّ أن يُمَيِّزَ بَينَ الاثنَين، وأن يَعمَلَ بِاليَقينِ الوَحيدِ الذي يَملِكُه: هذه اللَّحظة، التي ما زالَ الحِسابُ فيها قابِلًا لِلتَّسوية.",
      },
    },
    {
      title: { en: "Synthesis: the believer's daily court", ar: "تَركيبٌ: مَحكَمةُ المُؤمِنِ اليَومِيّة" },
      learningObjectives: [
        { en: "Synthesise muhasabah into a lifelong practice linking this world to the next.", ar: "أُرَكِّبُ المُحاسَبةَ مُمارَسةً عُمُريّةً تَصِلُ الدُّنيا بِالآخِرة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque at the close of day.", ar: "مَسجِدٌ عِندَ خِتامِ النَّهار." },
        caption: { en: "Judge yourself gently each night so the greatest review finds you ready.", ar: "حاسِبْ نَفسَكَ بِرِفقٍ كُلَّ لَيلةٍ لِيَجِدَكَ العَرضُ الأكبَرُ مُستَعِدًّا." },
      },
      matchingActivity: {
        title: { en: "Match the source to the truth it teaches", ar: "طابِقِ النَّصَّ بِالحَقيقةِ التي يُعَلِّمُها" },
        instruction: { en: "Connect each text to the lesson it gives about self-accountability.", ar: "اربِطْ كُلَّ نَصٍّ بِالدَّرسِ الذي يُعطيهِ في المُحاسَبة." },
        prompts: [
          { en: "Al-Hashr 18: 'look to what it sent ahead for tomorrow'", ar: "الحشر ١٨: «ولتَنظُرْ نَفسٌ ما قَدَّمَت لِغَد»" },
          { en: "'Umar: 'judge yourselves before you are judged'", ar: "عُمَر: «حاسِبوا أنفُسَكُم قَبلَ أن تُحاسَبوا»" },
          { en: "Al-Qiyamah 2: oath by the self-reproaching soul", ar: "القيامة ٢: القَسَمُ بِالنَّفسِ اللَّوّامة" },
          { en: "Al-Infitar 6: 'what has deceived you...?'", ar: "الانفطار ٦: «ما غَرَّكَ...؟»" },
        ].map((p, i) => ({
          prompt: p,
          answer: [
            { en: "Deeds are sent ahead; we will meet exactly what we prepared.", ar: "الأعمالُ تُقَدَّم؛ وسَنَلقى ما أعدَدناهُ بِالضَّبط." },
            { en: "Settle the account now, while correction is still possible.", ar: "سَوِّ الحِسابَ الآن، وما زالَ التَّصحيحُ مُمكِنًا." },
            { en: "A blaming conscience is a mercy and a sign of life.", ar: "الضَّميرُ اللَّوّامُ رَحمةٌ وعَلامةُ حَياة." },
            { en: "Beware exploiting Allah's generosity to delay repentance.", ar: "احذَرِ استِغلالَ كَرَمِ اللهِ لِتَأجيلِ التَّوبة." },
          ][i],
        })),
      },
      groupTasks: {
        title: { en: "Collaborative inquiry", ar: "تَحَرٍّ جَماعِيّ" },
        instruction: { en: "Each group builds and presents one practical outcome of this lesson.", ar: "تَبني كُلُّ مَجموعةٍ ناتِجًا عَمَلِيًّا واحِدًا مِنَ الدَّرسِ وتَعرِضُه." },
        groups: [
          {
            slug: "muhasabah-tool",
            name: { en: "Team A — The nightly review tool", ar: "الفَريقُ أ — أداةُ المُراجَعةِ اللَّيلِيّة" },
            learningObjective: { en: "Produce a clear, usable nightly muhasabah checklist for students.", ar: "نُنتِجُ قائِمةَ مُحاسَبةٍ لَيلِيّةً واضِحةً قابِلةً لِلاستِعمالِ لِلطُّلّاب." },
            task: { en: "Turn the four areas (intention, worship, tongue, dealings) into a short checklist with one honest question and one repair action each.", ar: "حَوِّلوا المَيادينَ الأربَعةَ (النِّيّة، العِبادة، اللِّسان، المُعامَلة) إلى قائِمةٍ قَصيرةٍ بِسُؤالٍ صادِقٍ وإجراءِ جَبرٍ لِكُلٍّ." },
            evidence: [
              { en: "Al-Hashr 18 and the hadith of 'the clever one' (At-Tirmidhi).", ar: "الحشر ١٨ وحَديثُ «الكَيِّس» (الترمذي)." },
            ],
            sourceNotes: [
              { en: "After finding a fault: repent, resolve, make amends.", ar: "بَعدَ وِجدانِ الخَطأ: تُبْ، واعزِمْ، واجبُر." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A one-page nightly muhasabah card for the class.", ar: "بِطاقةُ مُحاسَبةٍ لَيلِيّةٍ مِن صَفحةٍ لِلصَّفّ." },
          },
          {
            slug: "answer-delay",
            name: { en: "Team B — Answering 'repent later'", ar: "الفَريقُ ب — الرَّدُّ على «التَّوبةُ لاحِقًا»" },
            learningObjective: { en: "Refute the bargain of delayed repentance with evidence.", ar: "نُفَنِّدُ صَفقةَ تَأجيلِ التَّوبةِ بِالأدِلّة." },
            task: { en: "List the false assumptions behind 'I'll change when I'm older' and answer each with a verse or hadith from this lesson.", ar: "عَدِّدوا المُقَدِّماتِ الكاذِبةَ خَلفَ «سأتَغَيَّرُ حينَ أكبَر» وأجيبوا عن كُلٍّ بِآيةٍ أو حَديثٍ مِنَ الدَّرس." },
            evidence: [
              { en: "Al-Infitar 6; Al-Munafiqun 10; the hadith of the 'helpless one'.", ar: "الانفطار ٦؛ المنافقون ١٠؛ حَديثُ «العاجِز»." },
            ],
            sourceNotes: [
              { en: "Hearts harden with ignored warnings; tomorrow is not promised.", ar: "القُلوبُ تَقسو بِالنُّذُرِ المُهمَلة؛ والغَدُ غَيرُ مَوعود." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A short spoken rebuttal: 'Why later is a lie.'", ar: "رَدٌّ مَنطوقٌ قَصير: «لِماذا (لاحِقًا) كَذِبة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final synthesis", ar: "التَّركيبُ الخِتامِيّ" },
        prompt: { en: "Bring the lesson together: how do Al-Hashr 18, 'Umar's principle, the states of the self, a daily method, and the danger of delay form one connected argument for making muhasabah a lifelong habit? Write a developed paragraph.", ar: "اجمَعِ الدَّرس: كَيفَ يَتَّحِدُ الحَشرُ ١٨، وقاعِدةُ عُمَر، ومَراتِبُ النَّفس، والمَنهَجُ اليَومِيّ، وخَطَرُ التَّأجيل، في حُجّةٍ واحِدةٍ لِجَعلِ المُحاسَبةِ عادةَ العُمُر؟ اكتُبْ فِقرةً مُكتَمِلة." },
        placeholder: { en: "Muhasabah is commanded, modelled, and made practical because...", ar: "المُحاسَبةُ مَأمورٌ بِها ومَنهَجيّةٌ وعَمَلِيّةٌ لِأنَّ..." },
      },
      body: {
        en: "Gather the threads of this lesson into one picture, because seeing how they connect is itself the goal. Allah commands us in Al-Hashr 18 to look carefully at what we are sending ahead for a 'tomorrow' that is closer than it feels. 'Umar translates that command into a daily court: judge yourself now, weigh your own deeds, before the Day when the weighing is out of your hands. The Qur'an then shows us the instrument that makes this possible — the conscience Allah placed within us, which can drag us down as the 'commanding self,' pull us back as the 'blaming self,' or finally rest as the 'reassured self.' Muhasabah is the daily labour that moves us up that ladder.\n\nThe practice itself is simple and within every student's reach: a few honest minutes each night examining intention, worship, tongue, and dealings, followed not by despair but by repentance, resolve, and repair. And the one great obstacle is named clearly — the quiet lie of 'later,' which gambles on a tomorrow we are not promised and a soft heart we may not keep. The matching activity asks you to fix each source to the truth it teaches; the group work asks you to build a real tool and to dismantle a real excuse; and this final synthesis returns the lesson to you. The point of studying muhasabah is not to admire it but to begin it tonight. 'The clever one,' the Prophet ﷺ said, 'is he who holds himself to account and works for what comes after death.' Hold your own court gently and honestly each night, and the greatest review will find you among those whose scales are heavy and whose souls have come home, 'well-pleased and pleasing' to their Lord.",
        ar: "اجمَعْ خُيوطَ هذا الدَّرسِ في صورةٍ واحِدة، فَرُؤيةُ تَرابُطِها هي الغاية. يَأمُرُنا اللهُ في الحَشرِ ١٨ أن نَنظُرَ بِتَدَبُّرٍ فيما نُقَدِّمُهُ لِـ«غَدٍ» أقرَبَ مِمّا نَظُنّ. ويُتَرجِمُ عُمَرُ الأمرَ إلى مَحكَمةٍ يَومِيّة: حاسِبْ نَفسَكَ الآن، وزِنْ أعمالَكَ بِنَفسِك، قَبلَ اليَومِ الذي يَخرُجُ فيهِ الوَزنُ مِن يَدَيك. ثُمَّ يُرينا القُرآنُ الأداةَ التي تُمَكِّنُ ذلك — الضَّميرَ الذي أودَعَهُ اللهُ فينا، يَجُرُّنا أسفَلَ «أمّارةً»، أو يَشُدُّنا أعلى «لَوّامة»، أو يَستَقِرُّ أخيرًا «مُطمَئِنّة». والمُحاسَبةُ هي الكَدحُ اليَومِيُّ الذي يَرقى بِنا في هذا السُّلَّم.\n\nوالمُمارَسةُ نَفسُها بَسيطةٌ في مُتَناوَلِ كُلِّ طالِب: دَقائِقُ صادِقةٌ كُلَّ لَيلةٍ تَفحَصُ النِّيّةَ والعِبادةَ واللِّسانَ والمُعامَلة، يَتلوها لا قُنوطٌ بل تَوبةٌ وعَزمٌ وجَبر. والعَقَبةُ الكُبرى مُسَمّاةٌ بِوُضوح — كَذِبةُ «لاحِقًا» الهادِئة، التي تُقامِرُ بِغَدٍ غَيرِ مَوعودٍ وقَلبٍ لَيِّنٍ قد لا يَبقى. تَطلُبُ مِنكَ المُطابَقةُ أن تُثَبِّتَ كُلَّ نَصٍّ بِالحَقيقةِ التي يُعَلِّمُها؛ ويَطلُبُ العَمَلُ الجَماعِيُّ أن تَبنِيَ أداةً حَقيقيّةً وأن تَهدِمَ عُذرًا حَقيقيًّا؛ ويَرُدُّ هذا التَّركيبُ الدَّرسَ إليك. فَغايةُ دِراسةِ المُحاسَبةِ لَيسَتِ الإعجابَ بِها بل البَدءَ بِها اللَّيلة. قالَ النَّبِيُّ ﷺ: «الكَيِّسُ مَن دانَ نَفسَهُ وعَمِلَ لِما بَعدَ المَوت». فأقِمْ مَحكَمَتَكَ بِرِفقٍ وصِدقٍ كُلَّ لَيلة، يَجِدْكَ العَرضُ الأكبَرُ مِمَّن ثَقُلَت مَوازينُهُم ورَجَعَت نُفوسُهُم إلى رَبِّها «راضيةً مَرضيّة».",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does Al-Hashr 18 command the believers to do?", ar: "بِماذا يَأمُرُ الحَشرُ ١٨ المُؤمِنين؟" },
      options: [
        { en: "To fear Allah and let every soul examine what it has sent ahead for tomorrow", ar: "بِتَقوى اللهِ وأن تَنظُرَ كُلُّ نَفسٍ ما قَدَّمَت لِغَد" },
        { en: "To gather as much wealth as possible", ar: "بِجَمعِ أكبَرِ قَدرٍ مِنَ المال" },
        { en: "To avoid ever thinking about the Hereafter", ar: "بِتَجَنُّبِ التَّفكيرِ في الآخِرةِ أبَدًا" },
        { en: "To rely only on the deeds of others", ar: "بِالاعتِمادِ على أعمالِ الآخَرينَ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "The verse frames self-examination between two commands of taqwa and ends 'Allah is Aware of what you do.'", ar: "تُحيطُ الآيةُ المُحاسَبةَ بِأمرَينِ بِالتَّقوى وتَختِمُ «إنَّ اللهَ خَبيرٌ بِما تَعمَلون»." },
    },
    {
      prompt: { en: "What is the meaning of 'Umar's principle 'judge yourselves before you are judged'?", ar: "ما مَعنى قاعِدةِ عُمَرَ «حاسِبوا أنفُسَكُم قَبلَ أن تُحاسَبوا»؟" },
      options: [
        { en: "Settle your account now, while you can still correct it", ar: "سَوِّ حِسابَكَ الآن، وما زالَ بِإمكانِكَ تَصحيحُه" },
        { en: "Never reflect on your own actions", ar: "لا تُفَكِّرْ في أفعالِكَ أبَدًا" },
        { en: "Judge other people harshly", ar: "احكُمْ على النّاسِ بِقَسوة" },
        { en: "Wealth alone will save you on the Day", ar: "المالُ وَحدَهُ يُنجيكَ يَومَ القِيامة" },
      ],
      correctIndex: 0,
      explanation: { en: "Like a student marking his own work before the exam, muhasabah lets us fix faults while change is still possible.", ar: "كَطالِبٍ يُصَحِّحُ عَمَلَهُ قَبلَ الامتِحان، تُتيحُ المُحاسَبةُ إصلاحَ الخَطأ وما زالَ التَّغييرُ مُمكِنًا." },
    },
    {
      prompt: { en: "Which state of the self does Allah swear by in Surat Al-Qiyamah?", ar: "بِأيِّ مَرتَبةٍ مِنَ النَّفسِ أقسَمَ اللهُ في سورةِ القِيامة؟" },
      options: [
        { en: "The self-reproaching soul (an-nafs al-lawwamah)", ar: "النَّفسُ اللَّوّامة" },
        { en: "The soul that commands only evil", ar: "النَّفسُ الأمّارةُ بِالسّوءِ فَقَط" },
        { en: "A soul with no conscience at all", ar: "نَفسٌ بِلا ضَميرٍ البَتّة" },
        { en: "The soul of the disbelievers only", ar: "نَفسُ الكافِرينَ فَحَسب" },
      ],
      correctIndex: 0,
      explanation: { en: "The blaming conscience is honoured by an oath — it is a sign of a living, struggling faith.", ar: "الضَّميرُ اللَّوّامُ مُكَرَّمٌ بِقَسَمٍ — وهو عَلامةُ إيمانٍ حَيٍّ مُجاهِد." },
    },
    {
      prompt: { en: "According to the Prophet ﷺ, who is the truly clever (al-kayyis) person?", ar: "مَنِ «الكَيِّس» في قَولِ النَّبِيِّ ﷺ؟" },
      options: [
        { en: "One who holds himself to account and works for what comes after death", ar: "مَن دانَ نَفسَهُ وعَمِلَ لِما بَعدَ المَوت" },
        { en: "One who follows his desires and only wishes", ar: "مَن أتبَعَ نَفسَهُ هَواهُ وتَمَنّى فَحَسب" },
        { en: "One who never prays", ar: "مَن لا يُصَلّي أبَدًا" },
        { en: "One who has the most money", ar: "مَن يَملِكُ أكثَرَ المال" },
      ],
      correctIndex: 0,
      explanation: { en: "The hadith contrasts him with 'the helpless one' who chases desire and merely wishes upon Allah.", ar: "يُقابِلُهُ الحَديثُ بِـ«العاجِز» الذي يَتبَعُ هَواهُ ويَتَمَنّى على اللهِ فَقَط." },
    },
    {
      prompt: { en: "Why is delaying repentance ('I'll repent later') a dangerous trap?", ar: "لِماذا يَكونُ تَأجيلُ التَّوبةِ («سأتوبُ لاحِقًا») فَخًّا خَطيرًا؟" },
      options: [
        { en: "Tomorrow is not promised, hearts harden, and old habits grow harder to break", ar: "الغَدُ غَيرُ مَوعود، والقُلوبُ تَقسو، والعاداتُ القَديمةُ يَصعُبُ كَسرُها" },
        { en: "Because repentance is never accepted at all", ar: "لِأنَّ التَّوبةَ لا تُقبَلُ أبَدًا" },
        { en: "Because the Hereafter is not real", ar: "لِأنَّ الآخِرةَ غَيرُ حَقيقيّة" },
        { en: "Because only the elderly need to repent", ar: "لِأنَّ كِبارَ السِّنِّ وَحدَهُم بِحاجةٍ لِلتَّوبة" },
      ],
      correctIndex: 0,
      explanation: { en: "Al-Munafiqun 10 shows the dying soul begging for delay in vain; the only safe time is now.", ar: "تُري المنافِقونَ ١٠ النَّفسَ المُحتَضِرةَ تَستَجدي التَّأخيرَ بِلا جَدوى؛ ولا وَقتَ آمِنًا إلّا الآن." },
    },
    {
      prompt: { en: "True or False: Muhasabah is best practised as a method with honest questions and concrete repair, not a vague feeling of guilt.", ar: "صَوابٌ أم خَطأ: المُحاسَبةُ تُمارَسُ مَنهَجًا بِأسئِلةٍ صادِقةٍ وجَبرٍ مَلموس، لا شُعورًا غامِضًا بِالذَّنب." },
      options: [
        { en: "True — examine intention, worship, tongue, and dealings, then repent, resolve, and make amends", ar: "صَواب — افحَصِ النِّيّةَ والعِبادةَ واللِّسانَ والمُعامَلة، ثُمَّ تُبْ واعزِمْ واجبُر" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Finding a fault should lead to action — repentance, resolve, and amends — not to despair.", ar: "وِجدانُ الخَطأ يَنبَغي أن يَقودَ إلى عَمَل — تَوبةٍ وعَزمٍ وجَبرٍ — لا إلى قُنوط." },
    },
  ],
};
