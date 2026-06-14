import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const oathsAndVows: CourseLesson = {
  slug: "g8y9-oaths-and-vows",
  name: { en: "Oaths and Vows", ar: "الأيمانُ والنُّذور" },
  shortIntro: {
    en: "Honouring our words before Allah. Islam regulates the oath (yamin) and the vow (nadhr) — sacred commitments that bind a believer's word. This lesson explores their rulings, the expiation for a broken oath, and why we swear only by Allah.",
    ar: "صِيانةُ كَلِمَتِنا أمامَ الله. يُنَظِّمُ الإسلامُ اليَمينَ والنَّذر — التِزاماتٍ مُقَدَّسةٌ تَربِطُ كَلِمةَ المُؤمِن. يَستَكشِفُ هذا الدَّرسُ أحكامَهُما، وكَفّارةَ اليَمين، ولِمَ لا نَحلِفُ إلّا بِالله.",
  },
  quranSurahs: ["Al-Ma'idah 89", "An-Nahl 91", "Al-Insan 7"],
  sections: [
    {
      title: { en: "The oath (al-yamin)", ar: "اليَمين" },
      learningObjectives: [
        { en: "Define the oath and explain swearing only by Allah.", ar: "أُعَرِّفُ اليَمينَ وأشرَحُ الحَلِفَ بِاللهِ فَقَط." },
        { en: "Explain the expiation (kaffarah) for a broken oath.", ar: "أشرَحُ كَفّارةَ اليَمين." },
      ],
      successCriteria: [
        { en: "I can explain why we swear only by Allah.", ar: "أشرَحُ لِمَ لا نَحلِفُ إلّا بِالله." },
        { en: "I can describe the kaffarah of an oath.", ar: "أصِفُ كَفّارةَ اليَمين." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Books of fiqh — Islam regulates oaths and vows with precision.", ar: "كُتُبُ الفِقه — يُنَظِّمُ الإسلامُ الأيمانَ والنُّذورَ بِدِقّة." },
        caption: { en: "'Allah will not impose blame for the thoughtlessness in your oaths.' (Al-Ma'idah 89).", ar: "﴿لا يُؤاخِذُكُمُ اللهُ بِاللَّغوِ في أيمانِكُم﴾ (المائدة ٨٩)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why swear by Allah alone?", ar: "لِمَ الحَلِفُ بِاللهِ وَحدَه؟" },
        body: {
          en: "The Prophet ﷺ said, 'Whoever must swear an oath, let him swear by Allah or remain silent,' and warned that swearing by anything other than Allah is a form of shirk. Reflect: what does it say about the greatness of Allah that we may call only upon Him to witness the truth of our words?",
          ar: "قالَ النَّبِيُّ ﷺ: «مَن كانَ حالِفًا فَليَحلِف بِاللهِ أو لِيَصمُت»، وحَذَّرَ أنَّ الحَلِفَ بِغَيرِ اللهِ نَوعٌ مِنَ الشِّرك. تَأمَّل: ماذا يَقولُ عن عَظَمةِ اللهِ أنَّنا لا نَستَشهِدُ إلّا بِهِ على صِدقِ كَلامِنا؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Yamin (يَمين): an oath — confirming something by Allah's name.", ar: "اليَمين: تَأكيدُ الأمرِ بِاسمِ الله." },
            { en: "Kaffarah (كَفّارة): the expiation for breaking an oath.", ar: "الكَفّارة: ما يُكَفِّرُ بِهِ الحانِثُ في يَمينِه." },
          ],
        },
        {
          label: { en: "Rule", ar: "حُكم" },
          lines: [
            { en: "Swear only by Allah; swearing by other than Him is forbidden.", ar: "لا حَلِفَ إلّا بِالله؛ والحَلِفُ بِغَيرِهِ مُحَرَّم." },
          ],
        },
      ],
      body: {
        en: "Islam attaches great importance to the words a person speaks, and especially to the solemn commitments by which he binds himself before Allah — the oath (al-yamin) and the vow (an-nadhr). These are not casual matters but sacred undertakings that involve the name and the rights of Allah, and the Sharia regulates them with precision and care, teaching the believer how to take them, how to fulfil them, and what to do if he falls short. An oath (yamin) is a statement in which a person confirms or emphasises something by swearing in the name of Allah or by one of His names or attributes — such as saying 'By Allah (wallahi), I will do such-and-such,' or 'By Allah, I did not do it.' The oath is a serious matter, for the one who swears is calling upon Allah Himself to witness the truth of his words, and is therefore obliged to be truthful and to take care with what he swears. The first and most fundamental rule of oaths in Islam is that one may swear only by Allah — by His name, or by one of His attributes — and never by anything created. The Prophet ﷺ established this clearly: 'Whoever must swear an oath, let him swear by Allah or remain silent' (Bukhari and Muslim), and he warned sternly: 'Whoever swears by other than Allah has committed disbelief or shirk' (Tirmidhi). The reason is profound: swearing by something is a way of glorifying it and affirming its greatness and its knowledge of the truth, and this level of glorification belongs to Allah alone. To swear by one's father, one's life, the Prophet, the Ka'bah, one's honour, or anything else created is therefore forbidden, because it gives to the creation a glorification that belongs only to the Creator. The believer must train himself never to swear by anything other than Allah, and to correct the common but forbidden habits of swearing by one's life, one's children, or other created things.\n\nBecause an oath is so serious, the believer must be careful not to swear rashly or frequently, and must strive always to keep the oaths he takes. However, Allah, in His mercy, distinguishes between the casual, unintended utterances of the tongue and the deliberate, binding oaths of the heart. Allah says: 'Allah will not impose blame upon you for what is thoughtless (laghw) in your oaths, but He will impose blame upon you for what your hearts have earned' (Al-Baqarah 225). The 'thoughtless' oaths (laghw al-yamin) are the expressions that flow from the tongue without real intention to swear — such as a person's habitual 'no, by Allah' or 'yes, by Allah' in ordinary conversation — and these carry no expiation. But the deliberate, intended oath (al-yamin al-mun'aqidah), in which a person genuinely resolves to commit himself to doing or not doing something, is binding, and breaking it requires expiation. The believer should also know that if he swears to do something, and then realises that something else is better or more righteous, the Prophet ﷺ taught him what to do: 'If you swear an oath and then see that something else is better than it, then do that which is better and make expiation for your oath' (Bukhari and Muslim). So an oath should never become a means of persisting in a wrong or harmful course of action; if keeping the oath would mean doing something bad or missing something better, the believer does the good thing and expiates for the oath.\n\nThe expiation (kaffarah) for breaking a deliberate oath is clearly specified by Allah in the Qur'an, in a beautiful verse that shows the mercy and wisdom of the Sharia: 'Allah will not impose blame upon you for the thoughtlessness in your oaths, but He will impose blame upon you for what you intended of oaths. So its expiation is the feeding of ten needy people from the average of that which you feed your own families, or clothing them, or the freeing of a slave. But whoever cannot find the means — then a fast of three days. That is the expiation for oaths when you have sworn. But guard your oaths' (Al-Ma'idah 89). The mufassirin, such as Ibn Kathir, explain that the one who breaks a deliberate oath has three options, of which he may choose any one: feeding ten poor people, or clothing ten poor people, or freeing a believing slave; and only if he is unable to do any of these may he fast three days instead. The verse ends with the command 'But guard your oaths' (wahfazu aymanakum), which the scholars explain as a command both to be careful not to swear rashly or excessively, and to keep and fulfil the oaths one does take, rather than breaking them carelessly. This balanced and merciful system teaches the believer to take his words and commitments seriously, to swear only by Allah and only when necessary, to strive to fulfil his oaths, to choose the good over a harmful oath, and to make the prescribed expiation when he does break a deliberate oath. In the next section we examine the vow (an-nadhr) and its rulings, and the believer's responsibility toward all his commitments.",
        ar: "يولي الإسلامُ أهَمّيّةً كَبيرةً لِما يَنطِقُ بِهِ المَرء، وبِخاصّةٍ لِلالتِزاماتِ الجَليلةِ التي يَربِطُ بِها نَفسَهُ أمامَ الله — اليَمينِ والنَّذر. فَهذه ليسَت أمورًا عابِرةً بل تَعَهُّداتٌ مُقَدَّسةٌ تَتَعَلَّقُ بِاسمِ اللهِ وحَقِّه، وتُنَظِّمُها الشَّريعةُ بِدِقّةٍ وعِناية، تُعَلِّمُ المُؤمِنَ كَيفَ يَتَّخِذُها، وكَيفَ يَفي بِها، وما يَصنَعُ إن قَصَّر. واليَمينُ قَولٌ يُؤَكِّدُ بِهِ المَرءُ أمرًا أو يُثبِتُهُ بِالحَلِفِ بِاسمِ اللهِ أو بِاسمٍ مِن أسمائِهِ أو صِفةٍ مِن صِفاتِه — كَقَولِه: «واللهِ لَأفعَلَنَّ كَذا»، أو «واللهِ ما فَعَلتُه». واليَمينُ أمرٌ جَليل، فالحالِفُ يَستَشهِدُ اللهَ نَفسَهُ على صِدقِ كَلامِه، فَوَجَبَ علَيهِ الصِّدقُ والتَّحَرّي فيما يَحلِفُ علَيه. والقاعِدةُ الأولى الأصليّةُ في الأيمانِ أنَّهُ لا يَجوزُ الحَلِفُ إلّا بِالله — بِاسمِهِ أو بِصِفةٍ مِن صِفاتِه — ولا يَجوزُ الحَلِفُ بِمَخلوقٍ أبَدًا. قَرَّرَ النَّبِيُّ ﷺ هذا بِوُضوح: «مَن كانَ حالِفًا فَليَحلِف بِاللهِ أو لِيَصمُت» (البخاري ومسلم)، وحَذَّرَ بِشِدّة: «مَن حَلَفَ بِغَيرِ اللهِ فَقَد كَفَرَ أو أشرَك» (الترمذي). والعِلّةُ عَميقة: فالحَلِفُ بِالشَّيءِ تَعظيمٌ لَهُ وإثباتٌ لِعَظَمَتِهِ وعِلمِهِ بِالحَقّ، وهذا القَدرُ مِنَ التَّعظيمِ لِلّهِ وَحدَه. فالحَلِفُ بِالأبِ أوِ العُمرِ أوِ النَّبِيِّ أوِ الكَعبةِ أوِ الشَّرَفِ أو أيِّ مَخلوقٍ مُحَرَّم، لِأنَّهُ يَمنَحُ المَخلوقَ تَعظيمًا لا يَكونُ إلّا لِلخالِق. فَلْيُدَرِّبِ المُؤمِنُ نَفسَهُ ألّا يَحلِفَ إلّا بِالله، ولْيُصَحِّح عاداتِ الحَلِفِ الشّائِعةِ المُحَرَّمةِ بِالعُمرِ أوِ الأولادِ أوِ المَخلوقات.\n\nولَمّا كانَتِ اليَمينُ بِهذه الخُطورة، وَجَبَ على المُؤمِنِ ألّا يَحلِفَ مُتَسَرِّعًا أو مُكثِرًا، وأن يَجتَهِدَ دائِمًا في الوَفاءِ بِأيمانِه. لكِنَّ اللهَ بِرَحمَتِهِ يُفَرِّقُ بَينَ ما يَجري على اللِّسانِ بِلا قَصدٍ وبَينَ اليَمينِ المَقصودةِ المُنعَقِدةِ في القَلب. يَقولُ الله: ﴿لا يُؤاخِذُكُمُ اللهُ بِاللَّغوِ في أيمانِكُم ولكِن يُؤاخِذُكُم بِما كَسَبَت قُلوبُكُم﴾ (البقرة ٢٢٥). فَلَغوُ اليَمينِ ما يَجري على اللِّسانِ بِلا قَصدِ حَلِف — كَقَولِ المَرءِ في عادَتِه: «لا واللهِ» و«بَلى واللهِ» في حَديثِهِ العاديّ — ولا كَفّارةَ فيه. أمّا اليَمينُ المَقصودةُ المُنعَقِدة، التي يَعزِمُ فيها المَرءُ حَقًّا على إلزامِ نَفسِهِ بِفِعلٍ أو تَركٍ، فَهي مُنعَقِدةٌ، ويَلزَمُ في حِنثِها كَفّارة. ولْيَعلَمِ المُؤمِنُ أنَّهُ إن حَلَفَ على فِعلٍ ثُمَّ رَأى أنَّ غَيرَهُ خَيرٌ وأبَرّ، فَقَد عَلَّمَهُ النَّبِيُّ ﷺ ما يَصنَع: «إذا حَلَفتَ على يَمينٍ فَرَأيتَ غَيرَها خَيرًا مِنها فَأتِ الذي هو خَير، وكَفِّر عن يَمينِك» (البخاري ومسلم). فَلا تَكونُ اليَمينُ سَبيلًا لِلإصرارِ على باطِلٍ أو ضارّ؛ فإن كانَ الوَفاءُ بِها يَعني فِعلَ سَيِّئٍ أو تَركَ خَير، فَعَلَ المُؤمِنُ الخَيرَ وكَفَّرَ عنِ اليَمين.\n\nوكَفّارةُ حِنثِ اليَمينِ المَقصودةِ بَيَّنَها اللهُ بِوُضوحٍ في القُرآن، في آيةٍ جَميلةٍ تُظهِرُ رَحمةَ الشَّريعةِ وحِكمَتَها: ﴿لا يُؤاخِذُكُمُ اللهُ بِاللَّغوِ في أيمانِكُم ولكِن يُؤاخِذُكُم بِما عَقَّدتُمُ الأيمان، فَكَفّارَتُهُ إطعامُ عَشَرةِ مَساكينَ مِن أوسَطِ ما تُطعِمونَ أهليكُم أو كِسوَتُهُم أو تَحريرُ رَقَبة، فَمَن لم يَجِد فَصيامُ ثَلاثةِ أيّام، ذلك كَفّارةُ أيمانِكُم إذا حَلَفتُم، واحفَظوا أيمانَكُم﴾ (المائدة ٨٩). يَشرَحُ المُفَسِّرونَ، كَابنِ كَثير، أنَّ الحانِثَ في يَمينِهِ المَقصودةِ مُخَيَّرٌ بَينَ ثَلاث، يَفعَلُ أيَّها شاء: إطعامُ عَشَرةِ مَساكين، أو كِسوَتُهُم، أو تَحريرُ رَقَبةٍ مُؤمِنة؛ فإن عَجَزَ عن ذلك كُلِّهِ صامَ ثَلاثةَ أيّام. وتَختِمُ الآيةُ بِأمرِ ﴿واحفَظوا أيمانَكُم﴾، ويَشرَحُهُ العُلَماءُ أمرًا بِالتَّحَرُّزِ مِنَ الحَلِفِ المُتَسَرِّعِ المُكثِر، وبِحِفظِ الأيمانِ والوَفاءِ بِها لا الحِنثِ فيها بِتَهاوُن. وهذا النِّظامُ المُتَوازِنُ الرَّحيمُ يُعَلِّمُ المُؤمِنَ أن يَأخُذَ كَلامَهُ والتِزاماتِهِ بِجِدّيّة، ويَحلِفَ بِاللهِ وَحدَهُ وعِندَ الحاجةِ فَقَط، ويَجتَهِدَ في الوَفاءِ بِأيمانِه، ويَختارَ الخَيرَ على يَمينٍ ضارّة، ويُؤَدّيَ الكَفّارةَ المَشروعةَ إذا حَنِثَ في يَمينٍ مَقصودة. وفي القِسمِ التّالي نَتَناوَلُ النَّذرَ وأحكامَه، ومَسؤوليّةَ المُؤمِنِ تُجاهَ التِزاماتِهِ كُلِّها.",
      },
    },
    {
      title: { en: "The vow (an-nadhr)", ar: "النَّذر" },
      learningObjectives: [
        { en: "Define the vow and explain its ruling.", ar: "أُعَرِّفُ النَّذرَ وأشرَحُ حُكمَه." },
        { en: "Explain the duty to fulfil vows of obedience.", ar: "أشرَحُ وُجوبَ الوَفاءِ بِنَذرِ الطّاعة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque — a place to fulfil vows of worship to Allah.", ar: "مَسجِد — مَوضِعُ الوَفاءِ بِنَذرِ الطّاعةِ لِله." },
        caption: { en: "'They fulfil their vows and fear a Day...' (Al-Insan 7).", ar: "﴿يوفونَ بِالنَّذرِ ويَخافونَ يَومًا...﴾ (الإنسان ٧)." },
      },
      groupTasks: {
        title: { en: "Oaths and vows in practice", ar: "الأيمانُ والنُّذورُ تَطبيقًا" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "rulings-oaths",
            name: { en: "Team A — Rulings of the oath", ar: "الفَريقُ أ — أحكامُ اليَمين" },
            learningObjective: { en: "Explain the rulings and expiation of oaths.", ar: "نَشرَحُ أحكامَ اليَمينِ وكَفّارَتَها." },
            task: { en: "Prepare a clear guide to oaths: swearing only by Allah (and why swearing by others is forbidden); the difference between thoughtless oaths (no expiation) and deliberate oaths (binding); the three options of expiation plus fasting (Al-Ma'idah 89); and the rule 'do the better thing and expiate' (Bukhari & Muslim). Give realistic scenarios — e.g. swearing not to speak to a relative, or swearing 'by my life' — and the correct rulings. Present as a Q&A.", ar: "أعِدّوا دَليلًا واضِحًا لِليَمين: الحَلِفُ بِاللهِ وَحدَه (ولِمَ يَحرُمُ الحَلِفُ بِغَيرِه)؛ الفَرقُ بَينَ لَغوِ اليَمين (لا كَفّارة) واليَمينِ المُنعَقِدة (مُلزِمة)؛ خيارُ الكَفّارةِ الثَّلاثُ معَ الصِّيام (المائدة ٨٩)؛ وقاعِدةُ «افعَلِ الخَيرَ وكَفِّر» (متفق عليه). هاتوا سيناريوهاتٍ واقِعيّة — كَالحَلِفِ على هَجرِ قَريب، أوِ الحَلِفِ «بِعُمري» — والأحكامَ الصَّحيحة. اعرِضوها سُؤالًا وجَوابًا." },
            evidence: [
              { en: "Al-Ma'idah 89; 'Swear by Allah or be silent' (Bukhari & Muslim).", ar: "المائدة ٨٩؛ «فَليَحلِف بِاللهِ أو لِيَصمُت» (متفق عليه)." },
            ],
            sourceNotes: [
              { en: "Three expiation options; fasting only if unable.", ar: "ثَلاثةُ خياراتٍ لِلكَفّارة؛ والصِّيامُ عِندَ العَجز." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A Q&A guide to oaths.", ar: "دَليلُ سُؤالٍ وجَوابٍ لِليَمين." },
          },
          {
            slug: "rulings-vows",
            name: { en: "Team B — Rulings of the vow", ar: "الفَريقُ ب — أحكامُ النَّذر" },
            learningObjective: { en: "Explain the vow and the duty to fulfil it.", ar: "نَشرَحُ النَّذرَ ووُجوبَ الوَفاءِ بِه." },
            task: { en: "Prepare a guide to the vow (nadhr): its definition (committing oneself to an act of worship not otherwise obligatory); the obligation to fulfil a vow of obedience — Allah praises 'they fulfil their vows' (Al-Insan 7) and 'whoever vows to obey Allah, let him obey Him' (Bukhari); that one must NOT vow to do something sinful (and such a vow must not be kept); and the discouragement of making vows ('the vow does not bring good' — Bukhari & Muslim, it only extracts from the stingy). Give examples and present the rulings clearly.", ar: "أعِدّوا دَليلًا لِلنَّذر: تَعريفُه (إلزامُ المَرءِ نَفسَهُ عِبادةً ليسَت واجِبةً أصلًا)؛ ووُجوبُ الوَفاءِ بِنَذرِ الطّاعة — يَمدَحُ اللهُ ﴿يوفونَ بِالنَّذر﴾ (الإنسان ٧)، و«مَن نَذَرَ أن يُطيعَ اللهَ فَليُطِعه» (البخاري)؛ وأنَّهُ لا يَجوزُ نَذرُ مَعصية (ولا يُوفى بِها)؛ وكَراهةُ النَّذرِ («النَّذرُ لا يَأتي بِخَير» — متفق عليه، إنَّما يُستَخرَجُ بِهِ مِنَ البَخيل). هاتوا أمثِلةً واعرِضوا الأحكامَ بِوُضوح." },
            evidence: [
              { en: "Al-Insan 7; 'Whoever vows to obey Allah, let him obey' (Bukhari).", ar: "الإنسان ٧؛ «مَن نَذَرَ أن يُطيعَ اللهَ فَليُطِعه» (البخاري)." },
            ],
            sourceNotes: [
              { en: "Fulfil vows of obedience; never vow to sin.", ar: "يوفى بِنَذرِ الطّاعة؛ ولا يُنذَرُ مَعصية." },
            ],
            memberRoles: [
              { en: "Researcher, Planner, Presenter.", ar: "الباحِث، المُخَطِّط، العارِض." },
            ],
            finalProduct: { en: "A guide to the rulings of vows.", ar: "دَليلُ أحكامِ النَّذر." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "My word before Allah", ar: "كَلِمَتي أمامَ الله" },
        prompt: { en: "Islam teaches us to take our oaths and vows seriously, to swear only by Allah, and to honour our commitments. Reflect on your own speech: do you swear by Allah carelessly and often, or swear by other than Allah (like 'by my life')? Write about one habit in your speech you will correct after this lesson, and explain how taking your word seriously — keeping promises, swearing only by Allah and only when needed, and fulfilling commitments — reflects true faith and trustworthiness.", ar: "يُعَلِّمُنا الإسلامُ أن نَأخُذَ أيمانَنا ونُذورَنا بِجِدّيّة، وألّا نَحلِفَ إلّا بِالله، وأن نَفيَ بِالتِزاماتِنا. تَأمَّل في كَلامِك: أتَحلِفُ بِاللهِ مُتَهاوِنًا كَثيرًا، أم تَحلِفُ بِغَيرِ اللهِ (كَـ«عُمري»)؟ اكتُب عادةً واحِدةً في كَلامِكَ سَتُصَحِّحُها بَعدَ هذا الدَّرس، واشرَح كَيفَ يَعكِسُ أخذُ كَلِمَتِكَ بِجِدّيّة — حِفظُ الوَعد، والحَلِفُ بِاللهِ وَحدَهُ وعِندَ الحاجة، والوَفاءُ بِالعَهد — الإيمانَ الحَقَّ والأمانة." },
        placeholder: { en: "A habit in my speech I will correct is... I will swear only by Allah and only when... Honouring my word reflects faith because...", ar: "عادةٌ في كَلامي سَأُصَحِّحُها هي... وسَأحلِفُ بِاللهِ وَحدَهُ وعِندَ... وأخذُ كَلِمَتي بِجِدّيّةٍ يَعكِسُ الإيمانَ لِأنَّ..." },
      },
      body: {
        en: "The second of the two solemn commitments regulated by Islam is the vow (an-nadhr). A vow is when a person obligates upon himself an act of worship or obedience that was not originally obligatory upon him — such as saying, 'For Allah upon me is that I will fast three days,' or 'If Allah cures my illness, I will give such-and-such in charity.' The vow, like the oath, involves a commitment made to Allah, and the Sharia gives clear rulings about it. The most important principle is that a vow to do an act of obedience to Allah MUST be fulfilled. Allah praises the righteous precisely for fulfilling their vows: 'They fulfil their vows and fear a Day whose evil will be widespread' (Al-Insan 7), and He describes the believers as those who keep their covenants and commitments. The Prophet ﷺ commanded: 'Whoever vows to obey Allah, let him obey Him; and whoever vows to disobey Allah, let him not disobey Him' (Bukhari). This hadith gives the two key rulings of the vow: a vow to do something good and pleasing to Allah (like fasting, charity, or prayer) is binding and must be fulfilled, while a vow to do something sinful (like a vow to harm someone or to abandon a duty) must NOT be carried out, because one may never use a vow as a means to commit a sin. If someone makes a vow to do something disobedient, the scholars explain that he must not fulfil it, and according to many of them he must make the expiation of an oath instead.\n\nIt is important to understand that while fulfilling a vow of obedience is obligatory, making vows in the first place is actually discouraged in Islam. The Prophet ﷺ said: 'Do not make vows, for a vow does not avert anything of the divine decree; it only extracts (wealth) from the stingy' (Bukhari and Muslim). The meaning is that a vow — especially the common kind in which a person says 'If Allah grants me such-and-such, I will do so-and-so' — does not cause Allah to give what was not already decreed, and it often reflects a kind of bargaining with Allah or an attempt to extract obedience from oneself only in exchange for getting what one wants, rather than worshipping Allah freely and willingly out of love and gratitude. The believer should worship Allah, give charity, fast, and do good freely and constantly, out of love for Allah and hope in His reward, rather than binding himself with vows. Nevertheless, if a person does make a vow of obedience, he is obligated to fulfil it, for he has committed himself to Allah, and breaking such a commitment is a serious matter.\n\nFor the demanding young student, the lessons of oaths and vows extend far beyond their technical rulings to a deep principle that lies at the heart of Islamic character: the believer honours his word, takes his commitments seriously, and is truthful and trustworthy in all that he says and promises. The same seriousness that Islam attaches to oaths and vows — commitments made with the name of Allah — should characterise the believer's attitude toward all his words and promises. A believer does not swear carelessly or excessively, does not swear by anything other than Allah, does not make false oaths (which are among the gravest of sins, called 'the oath that plunges one into sin'), and does not break his deliberate commitments without good reason and proper expiation. More broadly, he keeps his promises, fulfils his agreements, and is known among people as someone whose word can be trusted. The Prophet ﷺ identified breaking one's word as a sign of hypocrisy: 'The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks his promise, and when he is entrusted he betrays the trust' (Bukhari and Muslim), and he praised the fulfilment of covenants as a mark of true faith. A young Muslim should therefore train himself, even in small matters, to mean what he says, to keep his promises, to swear only by Allah and only when truly necessary, and to honour every commitment he makes. In doing so, he embodies the trustworthiness and truthfulness that are among the most beautiful qualities of the believer, follows the example of the Prophet ﷺ who was known even before his prophethood as 'al-Amin' (the trustworthy), and earns the love of Allah and the trust and respect of all those around him.",
        ar: "والثّاني مِنَ الالتِزامَينِ الجَليلَينِ اللَّذَينِ يُنَظِّمُهُمَا الإسلامُ هو النَّذر. والنَّذرُ أن يُلزِمَ المَرءُ نَفسَهُ عِبادةً أو طاعةً لم تَكُن واجِبةً علَيهِ أصلًا — كَقَولِه: «لِلّهِ عليَّ أن أصومَ ثَلاثةَ أيّام»، أو «إن شَفى اللهُ مَرَضي تَصَدَّقتُ بِكَذا». والنَّذرُ كَاليَمينِ التِزامٌ معَ الله، وقد أعطَتهُ الشَّريعةُ أحكامًا واضِحة. وأهَمُّ مَبدَأٍ أنَّ نَذرَ الطّاعةِ لِلّهِ يَجِبُ الوَفاءُ بِه. يَمدَحُ اللهُ الأبرارَ على وَفائِهِم بِالنَّذرِ بِالذّات: ﴿يوفونَ بِالنَّذرِ ويَخافونَ يَومًا كانَ شَرُّهُ مُستَطيرًا﴾ (الإنسان ٧)، ويَصِفُ المُؤمِنينَ بِأنَّهُم يَحفَظونَ عُهودَهُم والتِزاماتِهِم. وأمَرَ النَّبِيُّ ﷺ: «مَن نَذَرَ أن يُطيعَ اللهَ فَليُطِعه، ومَن نَذَرَ أن يَعصِيَ اللهَ فَلا يَعصِه» (البخاري). فَأعطى هذا الحديثُ حُكمَيِ النَّذرِ الرَّئيسَين: نَذرُ الطّاعةِ المُرضيةِ لِلّه (كَالصِّيامِ والصَّدَقةِ والصَّلاة) مُلزِمٌ يَجِبُ الوَفاءُ بِه، ونَذرُ المَعصية (كَنَذرِ إيذاءِ أحَدٍ أو تَركِ واجِب) لا يَجوزُ الوَفاءُ بِه، إذ لا يَجوزُ اتِّخاذُ النَّذرِ سَبيلًا لِلمَعصية. ومَن نَذَرَ مَعصيةً فَلا يَفي بِها كَما يَشرَحُ العُلَماء، وعِندَ كَثيرٍ مِنهُم تَلزَمُهُ كَفّارةُ يَمين.\n\nومِنَ المُهِمِّ فَهمُ أنَّ الوَفاءَ بِنَذرِ الطّاعةِ واجِبٌ، لكِنَّ النَّذرَ نَفسَهُ مَكروهٌ في الإسلامِ ابتِداءً. قالَ النَّبِيُّ ﷺ: «لا تَنذِروا، فإنَّ النَّذرَ لا يَرُدُّ مِنَ القَدَرِ شَيئًا، وإنَّما يُستَخرَجُ بِهِ مِنَ البَخيل» (البخاري ومسلم). ومَعناهُ أنَّ النَّذرَ — وبِخاصّةٍ النَّوعَ الشّائِعَ: «إن أعطاني اللهُ كَذا فَعَلتُ كَذا» — لا يَجعَلُ اللهَ يُعطي ما لم يُقَدَّر، وكَثيرًا ما يَعكِسُ نَوعًا مِنَ المُساوَمةِ معَ الله، أو مُحاوَلةَ استِخراجِ الطّاعةِ مِنَ النَّفسِ فَقَط مُقابِلَ نَيلِ المُراد، بَدَلَ عِبادةِ اللهِ طَوعًا واختيارًا حُبًّا وشُكرًا. فَلْيَعبُدِ المُؤمِنُ اللهَ، ويَتَصَدَّق، ويَصُم، ويَفعَلِ الخَيرَ طَوعًا ودَوامًا، حُبًّا لِلّهِ ورَجاءً لِأجرِه، لا أن يَربِطَ نَفسَهُ بِالنُّذور. ومعَ ذلك، إن نَذَرَ طاعةً وَجَبَ علَيهِ الوَفاءُ بِها، فَقَد ألزَمَ نَفسَهُ لِلّه، وإخلافُ هذا الالتِزامِ أمرٌ جَليل.\n\nوعِبَرُ الأيمانِ والنُّذورِ لِلطّالِبِ المُجِدِّ تَتَجاوَزُ أحكامَها الفِقهيّةَ إلى مَبدَأٍ عَميقٍ في صَميمِ الخُلُقِ الإسلاميّ: أنَّ المُؤمِنَ يَصونُ كَلِمَتَه، ويَأخُذُ التِزاماتِهِ بِجِدّيّة، ويَكونُ صادِقًا أمينًا في كُلِّ ما يَقولُ ويَعِد. فَنَفسُ الجِدّيّةِ التي يوليها الإسلامُ لِلأيمانِ والنُّذورِ — وهي التِزاماتٌ بِاسمِ الله — يَنبَغي أن تَطبَعَ مَوقِفَ المُؤمِنِ مِن كَلامِهِ ووُعودِهِ كُلِّها. فالمُؤمِنُ لا يَحلِفُ مُتَهاوِنًا ولا مُكثِرًا، ولا يَحلِفُ بِغَيرِ الله، ولا يَحلِفُ يَمينًا كاذِبة (وهي مِن أعظَمِ الكَبائِر، وتُسَمّى اليَمينَ الغَموسَ التي تَغمِسُ صاحِبَها في الإثم)، ولا يَنقُضُ التِزاماتِهِ المَقصودةَ بِلا عُذرٍ وكَفّارة. وأوسَعُ مِن ذلك: يَفي بِوُعودِه، ويُنجِزُ عُهودَه، ويُعرَفُ بَينَ النّاسِ بِأنَّهُ مَن يوثَقُ بِكَلِمَتِه. وقد جَعَلَ النَّبِيُّ ﷺ إخلافَ الكَلِمةِ عَلامةَ نِفاق: «آيةُ المُنافِقِ ثَلاث: إذا حَدَّثَ كَذَب، وإذا وَعَدَ أخلَف، وإذا اؤتُمِنَ خان» (البخاري ومسلم)، ومَدَحَ الوَفاءَ بِالعَهدِ عَلامةً لِلإيمانِ الحَقّ. فَلْيُدَرِّبِ الشّابُّ المُسلِمُ نَفسَهُ، حَتّى في صَغائِرِ الأمور، أن يَعنيَ ما يَقول، ويَفيَ بِوُعودِه، ويَحلِفَ بِاللهِ وَحدَهُ وعِندَ الحاجةِ الحَقّ، ويَصونَ كُلَّ التِزامٍ يَقطَعُه. وبِذلك يُجَسِّدُ الأمانةَ والصِّدقَ اللَّذَينِ هُما مِن أجمَلِ صِفاتِ المُؤمِن، ويَقتَدي بِالنَّبِيِّ ﷺ الذي عُرِفَ قَبلَ نُبُوَّتِهِ بِـ«الأمين»، ويَنالُ مَحَبّةَ اللهِ وثِقةَ النّاسِ واحتِرامَهُم.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "By whom may a Muslim swear an oath?", ar: "بِمَن يَجوزُ لِلمُسلِمِ أن يَحلِف؟" },
      options: [
        { en: "By Allah alone (His name or attribute)", ar: "بِاللهِ وَحدَه (اسمِهِ أو صِفَتِه)" },
        { en: "By his life", ar: "بِعُمرِه" },
        { en: "By his parents", ar: "بِوالِدَيه" },
        { en: "By the Ka'bah", ar: "بِالكَعبة" },
      ],
      correctIndex: 0,
      explanation: { en: "'Let him swear by Allah or remain silent' (Bukhari & Muslim).", ar: "«فَليَحلِف بِاللهِ أو لِيَصمُت» (متفق عليه)." },
    },
    {
      prompt: { en: "What is the expiation (kaffarah) for breaking a deliberate oath?", ar: "ما كَفّارةُ حِنثِ اليَمينِ المُنعَقِدة؟" },
      options: [
        { en: "Feed or clothe 10 poor, or free a slave; else fast 3 days", ar: "إطعامُ أو كِسوةُ ١٠ مَساكين، أو عِتقُ رَقَبة؛ وإلّا صِيامُ ٣ أيّام" },
        { en: "Nothing at all", ar: "لا شَيء" },
        { en: "Pay a large fine", ar: "دَفعُ غَرامةٍ كَبيرة" },
        { en: "Fast 60 days", ar: "صِيامُ ٦٠ يَومًا" },
      ],
      correctIndex: 0,
      explanation: { en: "Al-Ma'idah 89 gives three options, then fasting if unable.", ar: "المائدة ٨٩ تُخَيِّرُ بَينَ ثَلاثٍ ثُمَّ الصِّيامِ عِندَ العَجز." },
    },
    {
      prompt: { en: "If you swear to do something but see something better, what do you do?", ar: "إن حَلَفتَ على شَيءٍ ثُمَّ رَأيتَ غَيرَهُ خَيرًا، ماذا تَفعَل؟" },
      options: [
        { en: "Do the better thing and expiate for the oath", ar: "افعَلِ الخَيرَ وكَفِّر عنِ اليَمين" },
        { en: "Keep the oath no matter what", ar: "أوفِ بِاليَمينِ مَهما كان" },
        { en: "Ignore both", ar: "اترُكهُما" },
        { en: "Swear again", ar: "احلِف مَرّةً أُخرى" },
      ],
      correctIndex: 0,
      explanation: { en: "'Do that which is better and expiate' (Bukhari & Muslim).", ar: "«فَأتِ الذي هو خَيرٌ وكَفِّر» (متفق عليه)." },
    },
    {
      prompt: { en: "What is the ruling on a vow (nadhr) to obey Allah?", ar: "ما حُكمُ نَذرِ طاعةِ الله؟" },
      options: [
        { en: "It must be fulfilled", ar: "يَجِبُ الوَفاءُ بِه" },
        { en: "It can be ignored", ar: "يُمكِنُ تَركُه" },
        { en: "It is forbidden to fulfil", ar: "يَحرُمُ الوَفاءُ بِه" },
        { en: "It has no ruling", ar: "لا حُكمَ لَه" },
      ],
      correctIndex: 0,
      explanation: { en: "'Whoever vows to obey Allah, let him obey Him' (Bukhari).", ar: "«مَن نَذَرَ أن يُطيعَ اللهَ فَليُطِعه» (البخاري)." },
    },
    {
      prompt: { en: "Can a vow to do something sinful be carried out?", ar: "هل يُوفى بِنَذرِ المَعصية؟" },
      options: [
        { en: "No — one must not obey a vow to sin", ar: "لا — لا يُطاعُ نَذرُ المَعصية" },
        { en: "Yes, always", ar: "نَعَم دائِمًا" },
        { en: "Only if easy", ar: "إن كانَ سَهلًا" },
        { en: "Only on Fridays", ar: "في الجُمَعِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "'Whoever vows to disobey Allah, let him not disobey' (Bukhari).", ar: "«ومَن نَذَرَ أن يَعصِيَ اللهَ فَلا يَعصِه» (البخاري)." },
    },
    {
      prompt: { en: "True or False: Swearing by other than Allah is a form of shirk.", ar: "صَوابٌ أم خَطأ: الحَلِفُ بِغَيرِ اللهِ نَوعٌ مِنَ الشِّرك." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "'Whoever swears by other than Allah has committed shirk' (Tirmidhi).", ar: "«مَن حَلَفَ بِغَيرِ اللهِ فَقَد أشرَك» (الترمذي)." },
    },
  ],
};
