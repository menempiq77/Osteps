import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const battleOfAhzab: CourseLesson = {
  slug: "g11y12-battle-of-al-ahzab",
  name: { en: "The Battle of Al-Ahzab (The Trench)", ar: "غَزوةُ الأحزابِ (الخَندَق)" },
  shortIntro: {
    en: "The Battle of Al-Ahzab (the Confederates), also called the Battle of the Trench (al-Khandaq), was a decisive trial in which a great alliance besieged Madinah and the believers were tested to the utmost, yet were delivered by their faith, unity, planning, and the help of Allah. This lesson studies the events of the battle, the lessons of consultation and the digging of the trench, the severe test of faith, and the way Allah turned back the enemy and what this teaches a young Muslim about trial and trust in Allah.",
    ar: "غَزوةُ الأحزاب، وتُسَمّى غَزوةَ الخَندَق، مِحنةٌ حاسِمةٌ حاصَرَ فيها تَحالُفٌ عَظيمٌ المَدينةَ، وابتُلِيَ المُؤمِنونَ أشَدَّ الابتِلاء، ثُمَّ نَجّاهُمُ اللهُ بِإيمانِهِم ووَحدَتِهِم وتَخطيطِهِم وعَونِ الله. يَدرُسُ هذا الدَّرسُ أحداثَ الغَزوة، ودُروسَ الشّورى وحَفرِ الخَندَق، والابتِلاءَ الشَّديدَ لِلإيمان، وكَيفَ رَدَّ اللهُ العَدُوَّ وما يُعَلِّمُهُ ذلك الشّابَّ المُسلِمَ عنِ الابتِلاءِ والتَّوَكُّلِ على الله.",
  },
  quranSurahs: ["Al-Ahzab 9-11", "Al-Ahzab 22-23"],
  sections: [
    {
      title: { en: "The events of the Battle of the Trench", ar: "أحداثُ غَزوةِ الخَندَق" },
      learningObjectives: [
        { en: "Describe the events of the Battle of Al-Ahzab.", ar: "أصِفُ أحداثَ غَزوةِ الأحزاب." },
        { en: "Explain the role of consultation and the trench.", ar: "أشرَحُ دَورَ الشّورى والخَندَق." },
      ],
      successCriteria: [
        { en: "I can describe the siege and how it ended.", ar: "أصِفُ الحِصارَ وكَيفَ انتَهى." },
        { en: "I can explain Al-Ahzab 9-11.", ar: "أشرَحُ الأحزابَ ٩-١١." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A harsh landscape — the trial of the Trench.", ar: "أرضٌ قاسِية — مِحنةُ الخَندَق." },
        caption: { en: "'When they came upon you from above you and from below you' (Al-Ahzab 10).", ar: "﴿إذ جاؤوكُم مِن فَوقِكُم ومِن أسفَلَ مِنكُم﴾ (الأحزاب ١٠)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How did a small, besieged community survive against overwhelming odds?", ar: "كَيفَ نَجَت جَماعةٌ صَغيرةٌ مُحاصَرةٌ أمامَ قُوّةٍ ساحِقة؟" },
        body: {
          en: "In the fifth year after the Hijrah, a vast alliance of tribes — the Confederates (al-Ahzab) — marched on Madinah with around ten thousand fighters to destroy the Muslims once and for all, far outnumbering the believers. The situation was desperate, and the test of faith was severe. Yet the believers survived and the alliance collapsed. Reflect: how did a small, surrounded community survive against such overwhelming odds — what role did faith, unity, consultation, careful planning, and ultimately the help of Allah play — and what does this great trial teach a believer about facing the hardest tests in life?",
          ar: "في السَّنةِ الخامِسةِ لِلهِجرة، زَحَفَ تَحالُفٌ هائِلٌ مِنَ القَبائِل — الأحزاب — على المَدينةِ بِنَحوِ عَشَرةِ آلافِ مُقاتِلٍ لِيَقضوا على المُسلِمينَ نِهائيًّا، يَفوقونَ المُؤمِنينَ عَدَدًا بِكَثير. كانَ المَوقِفُ بالِغَ الخَطَر، والابتِلاءُ شَديدًا. ومعَ ذلك نَجا المُؤمِنونَ وانهارَ التَّحالُف. تَأمَّل: كَيفَ نَجَت جَماعةٌ صَغيرةٌ مُحاصَرةٌ أمامَ قُوّةٍ ساحِقةٍ كَهذه — ما دَورُ الإيمانِ والوَحدةِ والشّورى والتَّخطيطِ الدَّقيقِ وأخيرًا عَونِ الله — وماذا تُعَلِّمُ هذه المِحنةُ العَظيمةُ المُؤمِنَ عن مُواجَهةِ أصعَبِ الابتِلاءاتِ في الحَياة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Al-Ahzab (الأحزاب): the Confederates — the allied tribes. Al-Khandaq (الخَندَق): the trench dug to defend Madinah.", ar: "الأحزاب: القَبائِلُ المُتَحالِفة. الخَندَق: الحُفرةُ التي حُفِرَت لِلدِّفاعِ عنِ المَدينة." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Salman al-Farisi suggested digging the trench — a strategy from his homeland.", ar: "اقتَرَحَ سَلمانُ الفارِسيُّ حَفرَ الخَندَق — تَدبيرٌ مِن بِلادِه." },
          ],
        },
      ],
      body: {
        en: "The Battle of Al-Ahzab (the Confederates), known also as the Battle of the Trench (al-Khandaq), took place in the fifth year after the Hijrah and was one of the most severe trials the early Muslim community ever faced. It came about when the leaders of the expelled Jewish tribe of Banu an-Nadir, together with the leaders of Quraysh and other tribes, formed a great alliance — the Confederates — to march on Madinah and destroy the Muslims once and for all. They gathered an army of around ten thousand fighters, far larger than any force the Muslims had faced, while the believers numbered only around three thousand. When news of this overwhelming alliance reached the Prophet ﷺ, he gathered the Muslims and did what he always did in matters of this world: he consulted them (shura). It was in this consultation that Salman al-Farisi, the Persian Companion, suggested a strategy unknown to the Arabs but used in his homeland: to dig a great trench (khandaq) along the exposed northern side of Madinah, which the cavalry of the enemy could not cross. The Prophet ﷺ accepted this excellent advice, and the Muslims set to work.\n\nThe digging of the trench was itself a trial and a lesson. In bitterly cold weather and severe hunger — the Companions tied stones to their stomachs to bear the hunger, and the Prophet ﷺ tied two — the believers, the Prophet ﷺ working among them with his own hands, laboured together to dig the long trench in time. When they struck a great rock that none could break, they called the Prophet ﷺ, who struck it himself, and with each strike he gave glad tidings of future victories — of Persia, of Byzantium, of Yemen — strengthening the believers' faith and hope in the very midst of their hardship. When the Confederates arrived, they were stopped by the trench, unable to cross it, and so they laid siege to Madinah. The siege lasted for weeks and brought the believers to the utmost test: surrounded by a vast enemy, suffering cold and hunger and fear, and then betrayed from within when the Jewish tribe of Banu Qurayzah, who had a treaty with the Muslims, broke it and sided with the Confederates, threatening the Muslims from within their own city. The Qur'an describes this moment of extreme trial with unforgettable power: 'When they came upon you from above you and from below you, and when the eyes shifted in fear and the hearts reached the throats, and you assumed about Allah various assumptions. There the believers were tested and shaken with a severe shaking' (Al-Ahzab 10-11).\n\nIn this most desperate hour, the difference between true faith and weak faith became clear. The hypocrites and those with disease in their hearts despaired, made excuses to abandon their posts, and even claimed that Allah and His Messenger had promised them only delusion. But the true believers responded with deepened faith and trust: 'And when the believers saw the Confederates, they said, This is what Allah and His Messenger had promised us, and Allah and His Messenger spoke the truth. And it only increased them in faith and submission' (Al-Ahzab 22). The believers held firm, guarded the trench, and turned to Allah in du'a; the Prophet ﷺ himself prayed against the Confederates, asking Allah to defeat them. And then Allah delivered the believers, not by their own strength but by His help, in a way they could not have achieved themselves — as we will see in the next section, where we examine how Allah turned back the enemy, the great lessons of this battle in faith, unity, planning, and trust in Allah, and what it teaches a young Muslim about facing the hardest trials of life.",
        ar: "غَزوةُ الأحزاب، المَعروفةُ أيضًا بِغَزوةِ الخَندَق، كانَت في السَّنةِ الخامِسةِ لِلهِجرة، ومِن أشَدِّ ما واجَهَتهُ الجَماعةُ المُسلِمةُ الأولى مِنَ الابتِلاء. وكانَ سَبَبُها أنَّ زُعَماءَ يَهودِ بَني النَّضيرِ المُجلَينَ تَحالَفوا معَ زُعَماءِ قُرَيشٍ وقَبائِلَ أُخرى في تَحالُفٍ عَظيم — الأحزاب — لِيَزحَفوا على المَدينةِ ويَقضوا على المُسلِمينَ نِهائيًّا. جَمَعوا جَيشًا نَحوَ عَشَرةِ آلافِ مُقاتِلٍ، أكبَرَ مِن أيِّ قُوّةٍ واجَهَها المُسلِمون، والمُؤمِنونَ نَحوُ ثَلاثةِ آلافٍ فَقَط. ولَمّا بَلَغَ النَّبِيَّ ﷺ خَبَرُ هذا التَّحالُفِ الساحِق، جَمَعَ المُسلِمينَ وفَعَلَ ما كانَ يَفعَلُهُ دائِمًا في أُمورِ الدُّنيا: شاوَرَهُم. وفي هذه الشّورى أشارَ سَلمانُ الفارِسيُّ، الصَّحابيُّ الفارِسيّ، بِتَدبيرٍ لَم يَعرِفهُ العَرَبُ وكانَ يُستَعمَلُ في بِلادِه: حَفرُ خَندَقٍ عَظيمٍ على الجِهةِ الشَّماليّةِ المَكشوفةِ مِنَ المَدينة، لا تَستَطيعُ خَيلُ العَدُوِّ عُبورَه. فَقَبِلَ النَّبِيُّ ﷺ هذه المَشورةَ المُمتازة، وشَرَعَ المُسلِمونَ في العَمَل.\n\nوكانَ حَفرُ الخَندَقِ نَفسُهُ مِحنةً ودَرسًا. ففي بَردٍ قارِسٍ وجوعٍ شَديد — رَبَطَ الصَّحابةُ الحِجارةَ على بُطونِهِم لِيَحتَمِلوا الجوع، ورَبَطَ النَّبِيُّ ﷺ حَجَرَين — عَمِلَ المُؤمِنونَ، والنَّبِيُّ ﷺ يَعمَلُ بَينَهُم بِيَدَيه، مَعًا لِحَفرِ الخَندَقِ الطَّويلِ في الوَقت. ولَمّا اعتَرَضَتهُم صَخرةٌ عَظيمةٌ عَجَزوا عن كَسرِها، دَعَوُا النَّبِيَّ ﷺ فَضَرَبَها بِنَفسِه، ومعَ كُلِّ ضَربةٍ بَشَّرَ بِفُتوحاتٍ آتية — فارِسَ والرّومِ واليَمَن — فَقَوّى إيمانَ المُؤمِنينَ ورَجاءَهُم في عَينِ شِدَّتِهِم. ولَمّا وَصَلَ الأحزابُ صَدَّهُمُ الخَندَقُ، فَلَم يَستَطيعوا عُبورَه، فَضَرَبوا الحِصارَ على المَدينة. ودامَ الحِصارُ أسابيعَ وبَلَغَ بِالمُؤمِنينَ أقصى الابتِلاء: مُحاصَرونَ بِعَدُوٍّ هائِل، يُعانونَ البَردَ والجوعَ والخَوف، ثُمَّ خانَهُم مِنَ الدّاخِلِ يَهودُ بَني قُرَيظةَ الذينَ كانَ بَينَهُم وبَينَ المُسلِمينَ عَهدٌ، فَنَقَضوهُ وانحازوا إلى الأحزاب، فَهَدَّدوا المُسلِمينَ مِن داخِلِ مَدينَتِهِم. ويَصِفُ القُرآنُ هذه اللَّحظةَ مِنَ الابتِلاءِ الشَّديدِ بِقُوّةٍ لا تُنسى: ﴿إذ جاؤوكُم مِن فَوقِكُم ومِن أسفَلَ مِنكُم وإذ زاغَتِ الأبصارُ وبَلَغَتِ القُلوبُ الحَناجِرَ وتَظُنّونَ بِاللهِ الظُّنونا. هُنالِكَ ابتُلِيَ المُؤمِنونَ وزُلزِلوا زِلزالًا شَديدًا﴾ (الأحزاب ١٠-١١).\n\nوفي هذه السّاعةِ الحَرِجةِ ظَهَرَ الفَرقُ بَينَ الإيمانِ الصّادِقِ والإيمانِ الضَّعيف. فَأمّا المُنافِقونَ ومَن في قُلوبِهِم مَرَضٌ فَيَئِسوا، واعتَذَروا لِيَترُكوا مَواقِعَهُم، بل زَعَموا أنَّ اللهَ ورَسولَهُ ما وَعَداهُم إلّا غُرورًا. وأمّا المُؤمِنونَ الصّادِقونَ فَاستَجابوا بِإيمانٍ وثِقةٍ أعمَق: ﴿ولَمّا رَأى المُؤمِنونَ الأحزابَ قالوا هذا ما وَعَدَنا اللهُ ورَسولُهُ وصَدَقَ اللهُ ورَسولُهُ وما زادَهُم إلّا إيمانًا وتَسليمًا﴾ (الأحزاب ٢٢). ثَبَتَ المُؤمِنونَ، وحَرَسوا الخَندَق، وأقبَلوا على اللهِ بِالدُّعاء؛ ودَعا النَّبِيُّ ﷺ نَفسُهُ على الأحزابِ أن يَهزِمَهُمُ الله. ثُمَّ نَجّى اللهُ المُؤمِنين، لا بِقُوَّتِهِم بل بِعَونِه، على وَجهٍ لَم يَكونوا لِيُحَقِّقوهُ بِأنفُسِهِم — كَما سَنَرى في القِسمِ التّالي، حَيثُ نَنظُرُ كَيفَ رَدَّ اللهُ العَدُوّ، ودُروسَ هذه الغَزوةِ العَظيمةِ في الإيمانِ والوَحدةِ والتَّخطيطِ والتَّوَكُّلِ على الله، وما تُعَلِّمُهُ الشّابَّ المُسلِمَ عن مُواجَهةِ أصعَبِ ابتِلاءاتِ الحَياة.",
      },
    },
    {
      title: { en: "The deliverance and lessons of the battle", ar: "النَّصرُ ودُروسُ الغَزوة" },
      learningObjectives: [
        { en: "Explain how Allah turned back the Confederates.", ar: "أشرَحُ كَيفَ رَدَّ اللهُ الأحزاب." },
        { en: "Derive lessons in faith, unity, and trust in Allah.", ar: "أستَخلِصُ دُروسًا في الإيمانِ والوَحدةِ والتَّوَكُّل." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "The wind that Allah sent against the enemy.", ar: "الرّيحُ التي أرسَلَها اللهُ على العَدُوّ." },
        caption: { en: "'We sent against them a wind and forces you did not see' (Al-Ahzab 9).", ar: "﴿فَأرسَلنا علَيهِم ريحًا وجُنودًا لَم تَرَوها﴾ (الأحزاب ٩)." },
      },
      groupTasks: {
        title: { en: "Lessons of the Trench", ar: "دُروسُ الخَندَق" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "deliverance",
            name: { en: "Team A — How Allah delivered the believers", ar: "الفَريقُ أ — كَيفَ نَجّى اللهُ المُؤمِنين" },
            learningObjective: { en: "Present how Allah turned back the Confederates.", ar: "نَعرِضُ كَيفَ رَدَّ اللهُ الأحزاب." },
            task: { en: "Present how Allah delivered the besieged believers: how He sent a fierce, cold wind that uprooted the enemy's tents, overturned their pots, and demoralised them; how He sent unseen forces (angels) that cast fear into the enemy's hearts; how He caused division and distrust among the allied tribes; and how the Confederates, exhausted and divided, broke up and withdrew without achieving their aim. Show that the victory came from Allah, as the Qur'an declares (Al-Ahzab 9, 25), not from the strength of the believers alone. Present a 'how Allah delivered them' display.", ar: "اعرِضوا كَيفَ نَجّى اللهُ المُؤمِنينَ المُحاصَرين: كَيفَ أرسَلَ ريحًا شَديدةً بارِدةً قَلَعَت خِيامَ العَدُوّ، وكَفَأَت قُدورَهُم، وحَطَّمَت مَعنَوِيّاتِهِم؛ وكَيفَ أرسَلَ جُنودًا لَم تُرَ (مَلائِكة) ألقَت الرُّعبَ في قُلوبِ العَدُوّ؛ وكَيفَ أوقَعَ الفُرقةَ والشَّكَّ بَينَ القَبائِلِ المُتَحالِفة؛ وكَيفَ تَفَرَّقَ الأحزابُ مُنهَكينَ مُختَلِفينَ وانسَحَبوا دونَ بُلوغِ غايَتِهِم. بَيِّنوا أنَّ النَّصرَ مِنَ اللهِ كَما يُعلِنُ القُرآن (الأحزاب ٩، ٢٥)، لا مِن قُوّةِ المُؤمِنينَ وَحدَها. اعرِضوا لَوحةَ «كَيفَ نَجّاهُمُ الله»." },
            evidence: [
              { en: "'And Allah turned back those who disbelieved in their rage; they gained no good' (Al-Ahzab 25).", ar: "﴿ورَدَّ اللهُ الذينَ كَفَروا بِغَيظِهِم لَم يَنالوا خَيرًا﴾ (الأحزاب ٢٥)." },
            ],
            sourceNotes: [
              { en: "The deliverance was a clear help from Allah.", ar: "النَّجاةُ كانَت عَونًا واضِحًا مِنَ الله." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'how Allah delivered them' display.", ar: "لَوحةُ «كَيفَ نَجّاهُمُ الله»." },
          },
          {
            slug: "lessons-of-trench",
            name: { en: "Team B — Lessons for life", ar: "الفَريقُ ب — دُروسٌ لِلحَياة" },
            learningObjective: { en: "Present the lessons of the battle for a believer's life.", ar: "نَعرِضُ دُروسَ الغَزوةِ لِحَياةِ المُؤمِن." },
            task: { en: "Present the great lessons of the Battle of the Trench for a believer's life today: consultation (shura) and accepting good advice from anyone (Salman's plan); careful planning and taking the means alongside trust in Allah (digging the trench); unity and working together through hardship (the Prophet ﷺ digging with the Companions); the testing of faith in trials, which separates the sincere from the hypocrites; holding firm and good assumption of Allah in the hardest moments; turning to Allah in du'a; and certainty that victory and relief come from Allah after the trial. Connect each lesson to facing hard trials in one's own life. Present a 'lessons of the Trench' guide.", ar: "اعرِضوا دُروسَ غَزوةِ الخَندَقِ العَظيمةَ لِحَياةِ المُؤمِنِ اليَوم: الشّورى وقَبولُ المَشورةِ الحَسَنةِ مِن أيِّ أحَد (تَدبيرُ سَلمان)؛ والتَّخطيطُ الدَّقيقُ والأخذُ بِالأسبابِ معَ التَّوَكُّلِ على الله (حَفرُ الخَندَق)؛ والوَحدةُ والعَمَلُ المُشتَرَكُ في الشِّدّة (النَّبِيُّ ﷺ يَحفِرُ معَ الصَّحابة)؛ وابتِلاءُ الإيمانِ في المِحَنِ الذي يُمَيِّزُ الصّادِقَ مِنَ المُنافِق؛ والثَّباتُ وحُسنُ الظَّنِّ بِاللهِ في أصعَبِ اللَّحَظات؛ والإقبالُ على اللهِ بِالدُّعاء؛ واليَقينُ أنَّ النَّصرَ والفَرَجَ مِنَ اللهِ بَعدَ الابتِلاء. اربِطوا كُلَّ دَرسٍ بِمُواجَهةِ المِحَنِ في حَياتِكُم. اعرِضوا دَليلَ «دُروسِ الخَندَق»." },
            evidence: [
              { en: "'It only increased them in faith and submission' (Al-Ahzab 22).", ar: "﴿وما زادَهُم إلّا إيمانًا وتَسليمًا﴾ (الأحزاب ٢٢)." },
            ],
            sourceNotes: [
              { en: "Take the means and trust in Allah.", ar: "خُذ بِالأسبابِ وتَوَكَّل على الله." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'lessons of the Trench' guide.", ar: "دَليلُ «دُروسِ الخَندَق»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Facing trials with faith and trust", ar: "مُواجَهةُ المِحَنِ بِإيمانٍ وتَوَكُّل" },
        prompt: { en: "In the Battle of the Trench, the believers faced an overwhelming trial — surrounded, hungry, afraid, and betrayed — yet they survived through faith, unity, careful planning (digging the trench), turning to Allah, and ultimately His help, while their faith only increased through the test. Reflect on a hard trial you have faced or may face in life (a difficulty, fear, or test of your faith). Write about what the Battle of the Trench teaches you about facing such trials: how the believer takes the means (planning, effort, seeking good advice) while trusting in Allah, holds firm and thinks well of Allah in the hardest moments, and remembers that relief comes from Allah after trial. Name at least two lessons from the battle you will apply.", ar: "في غَزوةِ الخَندَقِ واجَهَ المُؤمِنونَ ابتِلاءً ساحِقًا — مُحاصَرينَ جِياعًا خائِفينَ مَخذولينَ — ومعَ ذلك نَجَوا بِالإيمانِ والوَحدةِ والتَّخطيطِ الدَّقيق (حَفرِ الخَندَق) والإقبالِ على اللهِ وأخيرًا عَونِه، وما زادَهُمُ الابتِلاءُ إلّا إيمانًا. تَأمَّل مِحنةً صَعبةً واجَهتَها أو قَد تُواجِهُها (صُعوبةً أو خَوفًا أوِ ابتِلاءً لِإيمانِك). اكتُب ما تُعَلِّمُكَ إيّاهُ غَزوةُ الخَندَقِ عن مُواجَهةِ مِثلِ هذه المِحَن: كَيفَ يَأخُذُ المُؤمِنُ بِالأسباب (التَّخطيطِ والجُهدِ وطَلَبِ المَشورةِ الحَسَنة) معَ التَّوَكُّلِ على الله، ويَثبُتُ ويُحسِنُ الظَّنَّ بِاللهِ في أصعَبِ اللَّحَظات، ويَتَذَكَّرُ أنَّ الفَرَجَ مِنَ اللهِ بَعدَ الابتِلاء. اذكُر دَرسَينِ على الأقَلِّ مِنَ الغَزوةِ سَتُطَبِّقُهُما." },
        placeholder: { en: "The Battle of the Trench teaches me... I will apply...", ar: "تُعَلِّمُني غَزوةُ الخَندَق... وسَأُطَبِّق..." },
      },
      body: {
        en: "After weeks of siege, with the believers at the utmost limit of trial, Allah delivered them in a way that made absolutely clear that the victory was from Him, not from the strength of His servants. He sent against the Confederates a fierce, bitterly cold wind in the dark of a winter night, a wind that uprooted their tents, overturned their cooking pots, extinguished their fires, and threw their camp into chaos and terror; and He sent unseen forces — the angels — that cast fear and confusion into the hearts of the enemy. Allah describes it directly: 'O you who have believed, remember the favour of Allah upon you when armies came to you and We sent against them a wind and forces that you did not see' (Al-Ahzab 9). At the same time, Allah caused division, distrust, and discord among the allied tribes, so that they began to doubt and blame one another. Exhausted, freezing, divided, and demoralised, the great alliance broke up in the night and withdrew, defeated, without achieving anything of what they had come for. The Qur'an records: 'And Allah turned back those who disbelieved in their rage; they gained no good. And sufficient was Allah for the believers in battle, and ever is Allah Powerful and Exalted in Might' (Al-Ahzab 25). The greatest threat the early Muslim community had ever faced was thus turned back, and the Prophet ﷺ said afterward that now the Muslims would march on the disbelievers and not the reverse — a turning point in the history of the mission.\n\nThe Battle of the Trench is rich with lessons that remain a guide for believers in every age. It teaches the value of consultation (shura), for the very strategy that saved Madinah came from the Prophet ﷺ consulting his Companions and accepting the excellent advice of Salman al-Farisi — showing that wisdom can come from anyone, and that the leader who consults and listens is stronger than the one who acts alone. It teaches that the believer takes the means (al-asbab) — careful planning, hard work, and preparation — alongside trust in Allah; the Muslims dug the trench with their own exhausted hands, and only then did Allah's help come. It teaches unity and shared sacrifice, for the Prophet ﷺ himself dug alongside the Companions, sharing their cold and hunger, binding the community together in hardship. It teaches that trials test and reveal faith, separating the sincere believers, whose faith increased — 'This is what Allah and His Messenger promised us... and it only increased them in faith and submission' (Al-Ahzab 22) — from the hypocrites, whose weakness and excuses were exposed. It teaches the power of holding firm and thinking well of Allah in the darkest moments, when 'the hearts reached the throats.' And it teaches that turning to Allah in du'a, and relying on Him after taking the means, brings His help and relief.\n\nFor a young Muslim today, the Battle of the Trench is a powerful lesson in how to face the hardest trials of life — whether difficulties, fears, losses, or tests of faith. It teaches that trials, however overwhelming they seem, are part of the believer's path, and that Allah tests the believers precisely to strengthen and purify their faith, not to destroy them. It teaches the believer to respond to hardship not with despair, panic, or abandoning their principles, but with faith, patience, and trust in Allah; to take every lawful means — planning, effort, seeking good advice, working with others — while knowing that the outcome is ultimately in Allah's hands; to hold firm and think well of Allah even when the situation seems hopeless and 'the eyes shift in fear'; to turn to Allah in sincere du'a; and to be certain that relief and victory come from Allah after the trial, often in ways one could never have imagined or achieved alone. The believer who internalises these lessons faces life's storms not as one without hope, but as one who knows that the same Allah who sent the wind against the Confederates and delivered His servants is the One in whose hands all affairs rest. To take the means and trust in Allah, to hold firm and think well of Him in trial, and to be certain of His help after hardship — this is the legacy of the Trench, and a foundation of strength for every believer facing the trials of their own life.",
        ar: "بَعدَ أسابيعَ مِنَ الحِصار، والمُؤمِنونَ في أقصى حَدِّ الابتِلاء، نَجّاهُمُ اللهُ على وَجهٍ جَعَلَ النَّصرَ مِنهُ وَحدَهُ واضِحًا تَمامًا، لا مِن قُوّةِ عِبادِه. أرسَلَ على الأحزابِ ريحًا شَديدةً قارِسةً في ظَلامِ لَيلةٍ شِتائيّة، ريحًا قَلَعَت خِيامَهُم، وكَفَأَت قُدورَهُم، وأطفَأَت نيرانَهُم، وألقَت في مُعَسكَرِهِمُ الفَوضى والرُّعب؛ وأرسَلَ جُنودًا لَم تُرَ — المَلائِكة — ألقَت في قُلوبِ العَدُوِّ الخَوفَ والاضطِراب. يَصِفُ اللهُ ذلك مُباشَرةً: ﴿يا أيُّها الذينَ آمَنوا اذكُروا نِعمةَ اللهِ علَيكُم إذ جاءَتكُم جُنودٌ فَأرسَلنا علَيهِم ريحًا وجُنودًا لَم تَرَوها﴾ (الأحزاب ٩). وفي الوَقتِ نَفسِهِ أوقَعَ اللهُ الفُرقةَ والشَّكَّ والخِلافَ بَينَ القَبائِلِ المُتَحالِفة، فَبَدَؤوا يَرتابونَ ويَلومُ بَعضُهُم بَعضًا. مُنهَكينَ مُتَجَمِّدينَ مُتَفَرِّقينَ مَحطومي المَعنَويّات، تَفَكَّكَ التَّحالُفُ العَظيمُ في اللَّيلِ وانسَحَبَ مَهزومًا، دونَ أن يَنالَ شَيئًا مِمّا جاءَ لَه. يُسَجِّلُ القُرآن: ﴿ورَدَّ اللهُ الذينَ كَفَروا بِغَيظِهِم لَم يَنالوا خَيرًا وكَفى اللهُ المُؤمِنينَ القِتالَ وكانَ اللهُ قَوِيًّا عَزيزًا﴾ (الأحزاب ٢٥). فَرُدَّ أعظَمُ تَهديدٍ واجَهَتهُ الجَماعةُ المُسلِمةُ الأولى، وقالَ النَّبِيُّ ﷺ بَعدَها إنَّ المُسلِمينَ الآنَ يَغزونَ الكُفّارَ ولا يَغزونَهُم — نُقطةُ تَحَوُّلٍ في تاريخِ الدَّعوة.\n\nوغَزوةُ الخَندَقِ غَنيّةٌ بِالدُّروسِ التي تَبقى هاديةً لِلمُؤمِنينَ في كُلِّ عَصر. تُعَلِّمُ قيمةَ الشّورى، فَالتَّدبيرُ الذي أنقَذَ المَدينةَ جاءَ مِن مُشاوَرةِ النَّبِيِّ ﷺ أصحابَهُ وقَبولِهِ مَشورةَ سَلمانَ الفارِسيِّ المُمتازة — فَالحِكمةُ قَد تَأتي مِن أيِّ أحَد، والقائِدُ الذي يُشاوِرُ ويَستَمِعُ أقوى مِنَ الذي يَنفَرِدُ بِرَأيِه. وتُعَلِّمُ أنَّ المُؤمِنَ يَأخُذُ بِالأسباب — التَّخطيطِ الدَّقيقِ والعَمَلِ الشّاقِّ والإعداد — معَ التَّوَكُّلِ على الله؛ فَحَفَرَ المُسلِمونَ الخَندَقَ بِأيديهِمُ المُنهَكة، ثُمَّ جاءَ عَونُ الله. وتُعَلِّمُ الوَحدةَ والتَّضحيةَ المُشتَرَكة، فَالنَّبِيُّ ﷺ حَفَرَ معَ الصَّحابة، شارَكَهُم بَردَهُم وجوعَهُم، فَرَبَطَ الجَماعةَ في الشِّدّة. وتُعَلِّمُ أنَّ المِحَنَ تَبتَلي الإيمانَ وتَكشِفُه، فَتُمَيِّزُ المُؤمِنينَ الصّادِقينَ الذينَ زادَ إيمانُهُم — ﴿هذا ما وَعَدَنا اللهُ ورَسولُهُ... وما زادَهُم إلّا إيمانًا وتَسليمًا﴾ (الأحزاب ٢٢) — مِنَ المُنافِقينَ الذينَ انكَشَفَ ضَعفُهُم وأعذارُهُم. وتُعَلِّمُ قُوّةَ الثَّباتِ وحُسنِ الظَّنِّ بِاللهِ في أحلَكِ اللَّحَظات، حينَ ﴿بَلَغَتِ القُلوبُ الحَناجِر﴾. وتُعَلِّمُ أنَّ الإقبالَ على اللهِ بِالدُّعاء، والتَّوَكُّلَ علَيهِ بَعدَ الأخذِ بِالأسباب، يَجلِبُ عَونَهُ وفَرَجَه.\n\nوغَزوةُ الخَندَقِ لِلشّابِّ المُسلِمِ اليَومَ دَرسٌ قَويٌّ في كَيفِيّةِ مُواجَهةِ أصعَبِ ابتِلاءاتِ الحَياة — صُعوباتٍ أو مَخاوِفَ أو خَسائِرَ أوِ ابتِلاءاتٍ لِلإيمان. تُعَلِّمُ أنَّ المِحَنَ، مَهما بَدَت ساحِقة، جُزءٌ مِن طَريقِ المُؤمِن، وأنَّ اللهَ يَبتَلي المُؤمِنينَ لِيُقَوّيَ إيمانَهُم ويُطَهِّرَهُ لا لِيُهلِكَهُم. وتُعَلِّمُ المُؤمِنَ أن يَستَجيبَ لِلشِّدّةِ لا بِيَأسٍ ولا ذُعرٍ ولا تَركٍ لِمَبادِئِه، بل بِإيمانٍ وصَبرٍ وتَوَكُّلٍ على الله؛ وأن يَأخُذَ بِكُلِّ سَبَبٍ مَشروع — تَخطيطٍ وجُهدٍ وطَلَبِ مَشورةٍ حَسَنةٍ وعَمَلٍ معَ الآخَرين — عالِمًا أنَّ النَّتيجةَ بِيَدِ اللهِ في النِّهاية؛ وأن يَثبُتَ ويُحسِنَ الظَّنَّ بِاللهِ ولَو بَدا المَوقِفُ مَيؤوسًا و﴿زاغَتِ الأبصار﴾؛ وأن يُقبِلَ على اللهِ بِالدُّعاءِ الصّادِق؛ وأن يوقِنَ أنَّ الفَرَجَ والنَّصرَ مِنَ اللهِ بَعدَ الابتِلاء، كَثيرًا على وَجهٍ ما كانَ يَتَصَوَّرُهُ أو يُحَقِّقُهُ وَحدَه. والمُؤمِنُ الذي يَستَوعِبُ هذه الدُّروسَ يُواجِهُ عَواصِفَ الحَياةِ لا كَمَن لا رَجاءَ لَه، بل كَمَن يَعلَمُ أنَّ اللهَ الذي أرسَلَ الرّيحَ على الأحزابِ ونَجّى عِبادَهُ هو الذي بِيَدِهِ كُلُّ الأُمور. وأن يَأخُذَ المَرءُ بِالأسبابِ ويَتَوَكَّلَ على الله، ويَثبُتَ ويُحسِنَ الظَّنَّ بِهِ في البَلاء، ويوقِنَ بِعَونِهِ بَعدَ الشِّدّة — هذا إرثُ الخَندَق، وأساسُ قُوّةٍ لِكُلِّ مُؤمِنٍ يُواجِهُ مِحَنَ حَياتِه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Why is the Battle of Al-Ahzab also called the Battle of the Trench?", ar: "لِمَ سُمِّيَت غَزوةُ الأحزابِ أيضًا غَزوةَ الخَندَق؟" },
      options: [
        { en: "Because the Muslims dug a trench to defend Madinah", ar: "لِأنَّ المُسلِمينَ حَفَروا خَندَقًا لِلدِّفاعِ عنِ المَدينة" },
        { en: "Because they fought in a valley", ar: "لِأنَّهُم قاتَلوا في وادٍ" },
        { en: "Because of a river", ar: "بِسَبَبِ نَهر" },
        { en: "For no reason", ar: "بِلا سَبَب" },
      ],
      correctIndex: 0,
      explanation: { en: "Salman al-Farisi suggested digging a trench the cavalry could not cross.", ar: "أشارَ سَلمانُ الفارِسيُّ بِحَفرِ خَندَقٍ لا تَعبُرُهُ الخَيل." },
    },
    {
      prompt: { en: "Who suggested the strategy of digging the trench?", ar: "مَنِ الذي أشارَ بِتَدبيرِ حَفرِ الخَندَق؟" },
      options: [
        { en: "Salman al-Farisi", ar: "سَلمانُ الفارِسيّ" },
        { en: "Abu Lahab", ar: "أبو لَهَب" },
        { en: "A leader of Quraysh", ar: "أحَدُ ساداتِ قُرَيش" },
        { en: "No one", ar: "لا أحَد" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ consulted the Companions and accepted Salman's advice.", ar: "شاوَرَ النَّبِيُّ ﷺ الصَّحابةَ وقَبِلَ مَشورةَ سَلمان." },
    },
    {
      prompt: { en: "How did Allah turn back the Confederates?", ar: "كَيفَ رَدَّ اللهُ الأحزاب؟" },
      options: [
        { en: "By a fierce wind and unseen forces (angels) and division among them", ar: "بِريحٍ شَديدةٍ وجُنودٍ لَم تُرَ وفُرقةٍ بَينَهُم" },
        { en: "By the Muslims' army alone", ar: "بِجَيشِ المُسلِمينَ وَحدَه" },
        { en: "They were not turned back", ar: "لَم يُرَدّوا" },
        { en: "By a treaty", ar: "بِمُعاهَدة" },
      ],
      correctIndex: 0,
      explanation: { en: "'We sent against them a wind and forces you did not see' (Al-Ahzab 9).", ar: "﴿فَأرسَلنا علَيهِم ريحًا وجُنودًا لَم تَرَوها﴾ (الأحزاب ٩)." },
    },
    {
      prompt: { en: "How did the true believers respond when they saw the Confederates?", ar: "كَيفَ استَجابَ المُؤمِنونَ الصّادِقونَ حينَ رَأَوُا الأحزاب؟" },
      options: [
        { en: "Their faith and submission increased", ar: "زادَهُم إيمانًا وتَسليمًا" },
        { en: "They fled", ar: "فَرّوا" },
        { en: "They despaired", ar: "يَئِسوا" },
        { en: "They surrendered", ar: "استَسلَموا" },
      ],
      correctIndex: 0,
      explanation: { en: "'This is what Allah and His Messenger promised us' (Al-Ahzab 22).", ar: "﴿هذا ما وَعَدَنا اللهُ ورَسولُه﴾ (الأحزاب ٢٢)." },
    },
    {
      prompt: { en: "Which lesson does the Battle of the Trench teach?", ar: "أيُّ دَرسٍ تُعَلِّمُهُ غَزوةُ الخَندَق؟" },
      options: [
        { en: "Take the means (planning, shura) and trust in Allah", ar: "خُذ بِالأسباب (التَّخطيطِ والشّورى) وتَوَكَّل على الله" },
        { en: "Despair in hardship", ar: "اليَأسُ في الشِّدّة" },
        { en: "Act alone without advice", ar: "الانفِرادُ بِلا مَشورة" },
        { en: "Abandon principles under pressure", ar: "تَركُ المَبادِئِ تَحتَ الضَّغط" },
      ],
      correctIndex: 0,
      explanation: { en: "The believers dug the trench, then Allah's help came.", ar: "حَفَرَ المُؤمِنونَ الخَندَق، ثُمَّ جاءَ عَونُ الله." },
    },
    {
      prompt: { en: "True or False: The victory at the Trench came mainly from the believers' own strength.", ar: "صَوابٌ أم خَطأ: نَصرُ الخَندَقِ جاءَ أساسًا مِن قُوّةِ المُؤمِنينَ أنفُسِهِم." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah delivered them by the wind, the angels, and division among the enemy.", ar: "نَجّاهُمُ اللهُ بِالرّيحِ والمَلائِكةِ والفُرقةِ بَينَ العَدُوّ." },
    },
  ],
};
