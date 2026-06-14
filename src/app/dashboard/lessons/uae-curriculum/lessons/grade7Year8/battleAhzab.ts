import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const battleAhzab: CourseLesson = {
  slug: "g7y8-the-battle-of-al-ahzab",
  name: { en: "The Battle of Al-Ahzab", ar: "غَزوةُ الأحزاب" },
  shortIntro: {
    en: "The Battle of the Confederates (the Trench), when allied armies besieged Madinah. A study of the trench strategy, the believers' steadfastness, and how Allah turned back the enemy without a great battle.",
    ar: "غَزوةُ الأحزاب (الخَندَق)، حينَ حاصَرَتِ الجُيوشُ المُتَحالِفةُ المَدينة. دِراسةُ خِطّةِ الخَندَق، وثَباتِ المُؤمِنين، وكَيفَ رَدَّ اللهُ العَدُوَّ بِلا قِتالٍ كَبير.",
  },
  quranSurahs: ["Al-Ahzab 9-11", "Al-Ahzab 22", "Al-Ahzab 25"],
  sections: [
    {
      title: { en: "The siege and the trench", ar: "الحِصارُ والخَندَق" },
      learningObjectives: [
        { en: "Recount the cause and events of the Battle of Al-Ahzab.", ar: "أسرُدُ سَبَبَ غَزوةِ الأحزابِ وأحداثَها." },
        { en: "Explain the strategy of digging the trench.", ar: "أشرَحُ خِطّةَ حَفرِ الخَندَق." },
      ],
      successCriteria: [
        { en: "I can describe why the trench was dug.", ar: "أصِفُ سَبَبَ حَفرِ الخَندَق." },
        { en: "I can name the proposer of the strategy.", ar: "أُسَمّي صاحِبَ الخِطّة." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Rugged terrain — Madinah was protected on most sides.", ar: "أرضٌ وَعِرة — كانَتِ المَدينةُ مَحميّةً مِن أكثَرِ جِهاتِها." },
        caption: { en: "A trench was dug on the one exposed side.", ar: "حُفِرَ الخَندَقُ على الجِهةِ المَكشوفة." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Planning and trust in Allah", ar: "الأخذُ بِالأسبابِ والتَّوَكُّل" },
        body: {
          en: "Faced with a huge enemy coalition, the Prophet ﷺ consulted his companions and adopted Salman al-Farisi's idea of digging a trench — a strategy unknown to the Arabs. Yet victory came from Allah, who sent a fierce wind against the enemy. Reflect: how does this battle teach the balance between taking every practical means (asbab) and trusting completely in Allah (tawakkul)? Is relying on Allah a substitute for planning, or its companion?",
          ar: "أمامَ تَحالُفٍ ضَخمٍ مِنَ الأعداء، شاوَرَ النَّبِيُّ ﷺ أصحابَهُ وأخَذَ بِرَأيِ سَلمانَ الفارِسيِّ في حَفرِ خَندَق — خِطّةٍ لم تَعرِفها العَرَب. ومعَ ذلك جاءَ النَّصرُ مِنَ الله، الذي أرسَلَ ريحًا شَديدةً على العَدُوّ. تَأمَّل: كَيفَ تُعَلِّمُ هذه الغَزوةُ التَّوازُنَ بَينَ الأخذِ بِالأسبابِ والتَّوَكُّلِ التّامِّ على الله؟ هل التَّوَكُّلُ بَديلٌ عنِ التَّخطيطِ أم رَفيقُه؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "'O you who have believed, remember the favour of Allah upon you when armies came to (attack) you and We sent against them a wind...' — Al-Ahzab 9", ar: "﴿يا أيُّها الذينَ آمَنوا اذكُروا نِعمةَ اللهِ علَيكُم إذ جاءَتكُم جُنودٌ فَأرسَلنا علَيهِم ريحًا...﴾ — الأحزاب ٩" },
          ],
        },
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Al-Ahzab — the Confederates: the allied tribes who besieged Madinah in 5 AH.", ar: "الأحزاب — القَبائِلُ المُتَحالِفةُ التي حاصَرَتِ المَدينةَ سَنةَ ٥هـ." },
          ],
        },
      ],
      body: {
        en: "The Battle of Al-Ahzab, also known as the Battle of the Trench (al-Khandaq), took place in the fifth year after the Hijrah and was one of the most dangerous moments in the history of the young Muslim community in Madinah. Its name, Al-Ahzab, means 'the Confederates,' because it was fought against a coalition of allied enemy forces who joined together with a single aim: to wipe out Islam and the Muslims completely. The spark for this great alliance came from a group of leaders of the Jewish tribe of Banu an-Nadir, who had been expelled from Madinah for treachery. They travelled to Makkah and incited the Quraysh, then went to the powerful tribe of Ghatafan and other Arab tribes, persuading them all to march together against Madinah. The result was an enormous army — the sources mention around ten thousand fighters — far larger than anything the Muslims had faced before, while the defenders of Madinah numbered only about three thousand. The situation was grave, and the very survival of the Muslim community was at stake.\n\nWhen news of this advancing coalition reached the Prophet ﷺ, he did what a wise and responsible leader does: he gathered his companions and consulted them (shura) on how to defend the city. It was here that one of the most famous strategic decisions in Islamic history was made. Salman al-Farisi, the noble companion from Persia, drew on the military knowledge of his homeland and suggested a tactic the Arabs had never used: to dig a long, deep trench (khandaq) along the exposed northern side of Madinah, the only direction from which the cavalry of the enemy could easily attack, since the other sides were naturally protected by mountains, rocky ground, and dense palm groves. The Prophet ﷺ accepted this excellent idea, and the Muslims set to work digging the trench with their own hands. The Prophet ﷺ himself worked alongside them, carrying earth, his blessed body covered in dust, raising their spirits and reciting verses of encouragement with them. The work was exhausting, carried out in cold weather and severe hunger — companions tied stones to their stomachs to bear the pangs of hunger, and the Prophet ﷺ tied two. During the digging, when a great rock blocked their progress, the Prophet ﷺ struck it, and in the sparks that flew he gave glad tidings of future conquests of Persia, Byzantium, and Yemen — strengthening the believers' faith at the very moment of hardship.\n\nWhen the huge enemy army arrived, they were astonished and frustrated to find the trench blocking their path, for they had never encountered such a defence. Unable to cross it with their horses, they were forced into a long siege, camping around Madinah and attempting to find a way across. This phase of the battle was one of immense psychological and physical strain on the Muslims, who were vastly outnumbered, surrounded, cold, hungry, and afraid. To make matters worse, the Jewish tribe of Banu Qurayzah inside the city's alliance, who had a treaty with the Muslims, were persuaded by the enemy to break their covenant and turn against the Muslims from within, threatening the Muslim families and exposing the city to attack from a new direction. The Qur'an vividly describes the terror of this moment: 'When they came at you from above you and from below you, and when eyes shifted (in fear) and hearts reached the throats, and you assumed about Allah (various) assumptions. There the believers were tested and shaken with a severe shaking' (Al-Ahzab 10-11). This was a test that exposed the true state of every heart, separating the sincere believers from the hypocrites — and in the next section we will see how the believers responded, and how Allah delivered them.",
        ar: "غَزوةُ الأحزاب، وتُعرَفُ أيضًا بِغَزوةِ الخَندَق، كانَت في السَّنةِ الخامِسةِ لِلهِجرة، ومِن أخطَرِ لَحَظاتِ تاريخِ المُجتَمَعِ المُسلِمِ النّاشِئِ في المَدينة. واسمُها «الأحزاب» مَعناهُ القَبائِلُ المُتَحالِفة، لِأنَّها قامَت ضِدَّ تَحالُفٍ مِن قُوى العَدُوِّ اجتَمَعَت على هَدَفٍ واحِد: استِئصالِ الإسلامِ والمُسلِمينَ بِالكامِل. وكانَت شَرارةُ هذا التَّحالُفِ مِن جَماعةٍ مِن زُعَماءِ يَهودِ بَني النَّضيرِ الذينَ أُجلوا مِنَ المَدينةِ بِسَبَبِ الخِيانة. فَساروا إلى مَكّةَ وحَرَّضوا قُرَيشًا، ثُمَّ أتَوا قَبيلةَ غَطَفانَ القَوِيّةَ وقَبائِلَ عَرَبيّةً أُخرى، فَأقنَعوهُم بِالزَّحفِ مَعًا على المَدينة. فَكانَتِ النَّتيجةُ جَيشًا هائِلًا — تَذكُرُ المَصادِرُ نَحوَ عَشَرةِ آلافِ مُقاتِل — أكبَرَ بِكَثيرٍ مِن كُلِّ ما واجَهَهُ المُسلِمونَ مِن قَبل، بَينَما كانَ المُدافِعونَ عنِ المَدينةِ نَحوَ ثَلاثةِ آلافٍ فَقَط. فَكانَ المَوقِفُ خَطيرًا، وبَقاءُ المُجتَمَعِ المُسلِمِ نَفسِهِ على المِحَكّ.\n\nولَمّا بَلَغَ النَّبِيَّ ﷺ خَبَرُ زَحفِ هذا التَّحالُف، فَعَلَ ما يَفعَلُهُ القائِدُ الحَكيمُ المَسؤول: جَمَعَ أصحابَهُ وشاوَرَهُم في الدِّفاعِ عنِ المَدينة. وهُنا اتُّخِذَ أحَدُ أشهَرِ القَراراتِ الاستِراتيجيّةِ في تاريخِ الإسلام. فَقَدِ استَلهَمَ سَلمانُ الفارِسيُّ، الصَّحابيُّ الجَليلُ مِن فارِس، خِبرةَ بِلادِهِ العَسكَريّةَ فَاقتَرَحَ تَكتيكًا لم تَعرِفهُ العَرَبُ قَطّ: حَفرَ خَندَقٍ طَويلٍ عَميقٍ على الجِهةِ الشَّماليّةِ المَكشوفةِ مِنَ المَدينة، الجِهةِ الوَحيدةِ التي يَسهُلُ على خَيلِ العَدُوِّ الهُجومُ مِنها، إذ كانَتِ الجِهاتُ الأُخرى مَحميّةً طَبيعيًّا بِالجِبالِ والحِرارِ والنَّخيلِ الكَثيف. فَقَبِلَ النَّبِيُّ ﷺ هذا الرَّأيَ السَّديد، وشَرَعَ المُسلِمونَ يَحفِرونَ الخَندَقَ بِأيديهِم. وعَمِلَ النَّبِيُّ ﷺ نَفسُهُ مَعَهُم، يَنقُلُ التُّراب، وقدِ اغبَرَّ جَسَدُهُ الشَّريف، يَرفَعُ مَعنَوِيّاتِهِم ويُنشِدُ مَعَهُم أبياتَ التَّشجيع. وكانَ العَمَلُ مُرهِقًا في بَردٍ شَديدٍ وجوعٍ قاسٍ — رَبَطَ الصَّحابةُ الحِجارةَ على بُطونِهِم مِنَ الجوع، ورَبَطَ النَّبِيُّ ﷺ حَجَرَين. وأثناءَ الحَفر، لَمّا اعتَرَضَتهُم صَخرةٌ كَبيرةٌ ضَرَبَها النَّبِيُّ ﷺ، وفي الشَّرَرِ المُتَطايِرِ بَشَّرَ بِفُتوحِ فارِسَ والرّومِ واليَمَنِ مُستَقبَلًا — مُقَوِّيًا إيمانَ المُؤمِنينَ في عَينِ المِحنة.\n\nولَمّا وَصَلَ جَيشُ العَدُوِّ الضَّخمُ ذُهِلوا وغَضِبوا إذ وَجَدوا الخَندَقَ يَسُدُّ طَريقَهُم، فلم يَكونوا قد واجَهوا مِثلَ هذا الدِّفاعِ قَطّ. وإذ عَجَزوا عن عُبورِهِ بِخَيلِهِم، اضطُرّوا إلى حِصارٍ طَويل، فَخَيَّموا حَولَ المَدينةِ يُحاوِلونَ إيجادَ مَعبَر. وكانَت هذه المَرحَلةُ مِنَ الغَزوةِ مِن أشَدِّ ما أرهَقَ المُسلِمينَ نَفسيًّا وبَدَنيًّا، وهُم قِلّةٌ مُحاصَرون، في بَردٍ وجوعٍ وخَوف. وزادَ الأمرَ سوءًا أنَّ يَهودَ بَني قُرَيظةَ داخِلَ حِلفِ المَدينة، وكانَ بَينَهُم وبَينَ المُسلِمينَ عَهد، أقنَعَهُمُ العَدُوُّ بِنَقضِ عَهدِهِم والانقِلابِ على المُسلِمينَ مِنَ الدّاخِل، فَهَدَّدوا بُيوتَ المُسلِمينَ وكَشَفوا المَدينةَ لِهُجومٍ مِن جِهةٍ جَديدة. ويَصِفُ القُرآنُ هَولَ هذه اللَّحظةِ بِحَيَويّة: ﴿إذ جاءوكُم مِن فَوقِكُم ومِن أسفَلَ مِنكُم وإذ زاغَتِ الأبصارُ وبَلَغَتِ القُلوبُ الحَناجِرَ وتَظُنّونَ بِاللهِ الظُّنونا، هُنالِكَ ابتُلِيَ المُؤمِنونَ وزُلزِلوا زِلزالًا شَديدًا﴾ (الأحزاب ١٠-١١). كانَ ابتِلاءً كَشَفَ حَقيقةَ كُلِّ قَلب، فَمَيَّزَ المُؤمِنَ الصّادِقَ مِنَ المُنافِق — وفي القِسمِ التّالي نَرى كَيفَ استَجابَ المُؤمِنون، وكَيفَ نَجّاهُمُ الله.",
      },
    },
    {
      title: { en: "Steadfastness and divine deliverance", ar: "الثَّباتُ والنَّصرُ الإلهيّ" },
      learningObjectives: [
        { en: "Contrast the believers and hypocrites in the test.", ar: "أُقارِنُ بَينَ المُؤمِنينَ والمُنافِقينَ في الابتِلاء." },
        { en: "Draw lessons in faith, planning, and trust.", ar: "أستَخلِصُ دُروسًا في الإيمانِ والتَّخطيطِ والتَّوَكُّل." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "A windswept sky — Allah sent a wind against the enemy.", ar: "سَماءٌ تَعصِفُ بِها الرّيح — أرسَلَ اللهُ ريحًا على العَدُوّ." },
        caption: { en: "'We sent against them a wind and armies you did not see' (Al-Ahzab 9).", ar: "﴿فَأرسَلنا علَيهِم ريحًا وجُنودًا لم تَرَوها﴾ (الأحزاب ٩)." },
      },
      groupTasks: {
        title: { en: "Lessons of Al-Ahzab", ar: "دُروسُ الأحزاب" },
        instruction: { en: "Each group studies one theme.", ar: "تَدرُسُ كُلُّ مَجموعةٍ مِحوَرًا." },
        groups: [
          {
            slug: "believers-vs-hypocrites",
            name: { en: "Team A — Two responses to crisis", ar: "الفَريقُ أ — رَدّانِ على الأزمة" },
            learningObjective: { en: "Contrast faith and hypocrisy under pressure.", ar: "نُقابِلُ الإيمانَ والنِّفاقَ تَحتَ الضَّغط." },
            task: { en: "Compare the believers' response in Al-Ahzab 22 ('This is what Allah and His Messenger promised us... it only increased them in faith') with the hypocrites' excuses (Al-Ahzab 12-13). Explain how the same hardship produced opposite reactions, and what reveals true faith.", ar: "قارِنوا رَدَّ المُؤمِنينَ في الأحزاب ٢٢ (﴿هذا ما وَعَدَنا اللهُ ورَسولُه... وما زادَهُم إلّا إيمانًا﴾) بِأعذارِ المُنافِقين (الأحزاب ١٢-١٣). اشرَحوا كَيفَ أنتَجَتِ المِحنةُ الواحِدةُ رَدَّينِ مُتَضادَّين، وما الذي يَكشِفُ الإيمانَ الحَقّ." },
            evidence: [
              { en: "Al-Ahzab 22; Al-Ahzab 12-13.", ar: "الأحزاب ٢٢؛ الأحزاب ١٢-١٣." },
            ],
            sourceNotes: [
              { en: "Trials reveal and refine the heart.", ar: "البَلاءُ يَكشِفُ القَلبَ ويُمَحِّصُه." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A comparison of two responses.", ar: "مُقارَنةُ رَدَّين." },
          },
          {
            slug: "asbab-and-tawakkul",
            name: { en: "Team B — Planning and trust", ar: "الفَريقُ ب — الأخذُ بِالأسبابِ والتَّوَكُّل" },
            learningObjective: { en: "Show the union of effort and reliance on Allah.", ar: "نُبَيِّنُ اجتِماعَ السَّعيِ والتَّوَكُّل." },
            task: { en: "The Muslims dug a trench (means) yet victory came by Allah's wind (His decree). Explain how Islam joins taking every practical means with total trust in Allah. Apply this to a student's life (e.g. studying hard AND making du'a before exams).", ar: "حَفَرَ المُسلِمونَ خَندَقًا (سَبَب) ومعَ ذلك جاءَ النَّصرُ بِريحِ اللهِ (قَدَرِه). اشرَحوا كَيفَ يَجمَعُ الإسلامُ بَينَ الأخذِ بِكُلِّ الأسبابِ والتَّوَكُّلِ التّامّ. وطَبِّقوا على حَياةِ الطّالِب (كَالاجتِهادِ في المُذاكَرةِ معَ الدُّعاءِ قَبلَ الامتِحان)." },
            evidence: [
              { en: "The trench strategy; Al-Ahzab 9 (the wind).", ar: "خِطّةُ الخَندَق؛ الأحزاب ٩ (الرّيح)." },
            ],
            sourceNotes: [
              { en: "Tawakkul accompanies effort; it does not replace it.", ar: "التَّوَكُّلُ يُصاحِبُ السَّعيَ ولا يُلغيه." },
            ],
            memberRoles: [
              { en: "Researcher, Applier, Presenter.", ar: "الباحِث، المُطَبِّق، العارِض." },
            ],
            finalProduct: { en: "A life application of asbab + tawakkul.", ar: "تَطبيقٌ حَياتيٌّ لِلسَّبَبِ والتَّوَكُّل." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Faith under pressure", ar: "الإيمانُ تَحتَ الضَّغط" },
        prompt: { en: "The believers at Al-Ahzab, when surrounded and afraid, said: 'This is what Allah and His Messenger promised us, and Allah and His Messenger spoke the truth.' Write about a difficult or frightening situation you might face, and how this verse and the example of the companions could help you stay firm, keep planning wisely, and trust Allah at the same time.", ar: "قالَ المُؤمِنونَ في الأحزاب، وهُم مُحاصَرونَ خائِفون: ﴿هذا ما وَعَدَنا اللهُ ورَسولُهُ وصَدَقَ اللهُ ورَسولُه﴾. اكتُبْ عن مَوقِفٍ صَعبٍ أو مُخيفٍ قد تُواجِهُه، وكَيفَ تُعينُكَ هذه الآيةُ ومِثالُ الصَّحابةِ على الثَّبات، والتَّخطيطِ الحَكيم، والتَّوَكُّلِ على اللهِ في آنٍ واحِد." },
        placeholder: { en: "A difficult situation I might face... This verse helps me by... I would plan by... and trust Allah by...", ar: "مَوقِفٌ صَعبٌ قد أُواجِهُه... تُعينُني الآيةُ بِـ... وأُخَطِّطُ بِـ... وأتَوَكَّلُ بِـ..." },
      },
      body: {
        en: "The long siege of Madinah became a furnace that tested every heart, and the believers and the hypocrites responded in completely opposite ways. The hypocrites, whose faith was weak and whose loyalty was shallow, were filled with doubt and fear. The Qur'an records their words: 'And (remember) when the hypocrites and those in whose hearts is disease said, Allah and His Messenger did not promise us except delusion' (Al-Ahzab 12). They made false excuses to abandon their posts: 'And when a faction of them said, O people of Yathrib, there is no stability for you (here), so return (home). And a party of them asked permission of the Prophet, saying, Indeed, our houses are exposed — while they were not exposed. They did not intend except to flee' (Al-Ahzab 13). The sincere believers, by contrast, responded to the very same terror with deepened faith and trust. Allah praises them: 'And when the believers saw the Confederates, they said, This is what Allah and His Messenger had promised us, and Allah and His Messenger spoke the truth. And it increased them only in faith and acceptance' (Al-Ahzab 22). This is one of the most powerful contrasts in the Qur'an: identical circumstances, opposite hearts. The same hardship that shook loose the hypocrites only rooted the believers more firmly, because they understood that trials are part of Allah's promise and the path to victory.\n\nThe deliverance, when it came, was unmistakably from Allah. After weeks of siege, with the Muslims exhausted and surrounded, Allah worked their rescue through unseen means. First, He sent a believer, Nu'aym ibn Mas'ud, who had recently embraced Islam in secret, to sow distrust between the Confederate tribes and the treacherous Banu Qurayzah, so that the alliance began to crack from within. Then, on a bitterly cold night, Allah sent against the enemy a fierce, freezing wind that tore up their tents, overturned their cooking pots, extinguished their fires, and filled their hearts with terror, along with unseen angelic forces. The Qur'an describes it: 'O you who have believed, remember the favour of Allah upon you when armies came to (attack) you and We sent upon them a wind and armies (of angels) you did not see' (Al-Ahzab 9). Unable to endure the cold, the hunger, the internal division, and the strange dread that overcame them, the great coalition broke apart and fled in the night. By morning, the Muslims found the enemy gone. The Prophet ﷺ declared, 'Now we will march upon them and they will not march upon us' — the tide had turned permanently. The greatest combined assault that the enemies of Islam ever mounted had failed completely, and the Muslims had not had to fight a major battle at all; the victory was Allah's.\n\nThe Battle of Al-Ahzab is rich with lessons for every believer. It teaches the union of planning and trust: the Muslims took the very best practical means available — consulting, accepting wise counsel even from a new Persian convert, and undertaking the gruelling labour of the trench — and yet they knew with certainty that victory comes only from Allah. This is the true meaning of tawakkul: to tie one's camel and then trust in Allah, to study hard and then rely on Him, to take every lawful means and then place the outcome in His hands. The battle teaches that trials are a test that distinguishes sincere faith from hollow claims, and that the believer's response to hardship reveals the true state of his heart. It teaches the value of consultation (shura) and of valuing wisdom and talent wherever it is found, regardless of a person's background — for the strategy that saved Madinah came from Salman the Persian. It teaches the power of leadership by example, as the Prophet ﷺ dug, carried earth, and went hungry alongside his companions. And above all it teaches that no coalition, however vast, can overcome the believers when Allah is their protector: 'And sufficient was Allah for the believers in battle, and ever is Allah Powerful and Exalted in Might' (Al-Ahzab 25). A demanding student should carry from this seerah a faith that is both active and trusting — working with full effort and planning, while resting in complete reliance on the One in whose hand alone lies victory.",
        ar: "صارَ حِصارُ المَدينةِ الطَّويلُ أتونًا امتَحَنَ كُلَّ قَلب، فاستَجابَ المُؤمِنونَ والمُنافِقونَ بِطَريقَتَينِ مُتَضادَّتَينِ تَمامًا. فالمُنافِقونَ، ضُعَفاءُ الإيمانِ سَطحِيّو الوَلاء، مَلَأهُمُ الشَّكُّ والخَوف. ويُسَجِّلُ القُرآنُ قَولَهُم: ﴿وإذ يَقولُ المُنافِقونَ والذينَ في قُلوبِهِم مَرَضٌ ما وَعَدَنا اللهُ ورَسولُهُ إلّا غُرورًا﴾ (الأحزاب ١٢). وتَعَلَّلوا بِأعذارٍ كاذِبةٍ لِيَترُكوا مَواقِعَهُم: ﴿وإذ قالَت طائِفةٌ مِنهُم يا أهلَ يَثرِبَ لا مُقامَ لَكُم فارجِعوا، ويَستَأذِنُ فَريقٌ مِنهُمُ النَّبِيَّ يَقولونَ إنَّ بُيوتَنا عَورةٌ وما هي بِعَورةٍ، إن يُريدونَ إلّا فِرارًا﴾ (الأحزاب ١٣). أمّا المُؤمِنونَ الصّادِقونَ فاستَجابوا لِلهَولِ نَفسِهِ بِإيمانٍ وثِقةٍ أعمَق. يَمدَحُهُمُ الله: ﴿ولَمّا رَأى المُؤمِنونَ الأحزابَ قالوا هذا ما وَعَدَنا اللهُ ورَسولُهُ وصَدَقَ اللهُ ورَسولُه، وما زادَهُم إلّا إيمانًا وتَسليمًا﴾ (الأحزاب ٢٢). وهذا مِن أقوى التَّضادِّ في القُرآن: ظُروفٌ واحِدة، وقُلوبٌ مُتَضادّة. فالمِحنةُ التي زَلزَلَتِ المُنافِقينَ ما زادَتِ المُؤمِنينَ إلّا رُسوخًا، لِأنَّهُم فَهِموا أنَّ البَلاءَ مِن وَعدِ اللهِ وطَريقِ النَّصر.\n\nوكانَتِ النَّجاةُ حينَ جاءَت مِنَ اللهِ بِلا شَكّ. فَبَعدَ أسابيعَ مِنَ الحِصار، والمُسلِمونَ مُنهَكونَ مُحاصَرون، أجرى اللهُ نَجاتَهُم بِأسبابٍ خَفيّة. فَأوَّلًا، بَعَثَ مُؤمِنًا، نُعَيمَ بنَ مَسعودٍ الذي أسلَمَ سِرًّا حَديثًا، يوقِعُ الرَّيبةَ بَينَ قَبائِلِ الأحزابِ وبَني قُرَيظةَ الخائِنين، فَبَدَأ التَّحالُفُ يَتَصَدَّعُ مِنَ الدّاخِل. ثُمَّ في لَيلةٍ شَديدةِ البَرد، أرسَلَ اللهُ على العَدُوِّ ريحًا عاتيةً قارِسةً اقتَلَعَت خِيامَهُم، وقَلَبَت قُدورَهُم، وأطفَأت نيرانَهُم، ومَلَأت قُلوبَهُمُ الرُّعب، معَ جُنودٍ مِنَ المَلائِكةِ لا تُرى. يَصِفُهُ القُرآن: ﴿يا أيُّها الذينَ آمَنوا اذكُروا نِعمةَ اللهِ علَيكُم إذ جاءَتكُم جُنودٌ فَأرسَلنا علَيهِم ريحًا وجُنودًا لم تَرَوها﴾ (الأحزاب ٩). وإذ عَجَزوا عنِ احتِمالِ البَردِ والجوعِ والانقِسامِ والرُّعبِ الغَريبِ الذي غَشِيَهُم، تَفَكَّكَ التَّحالُفُ العَظيمُ وفَرَّ في اللَّيل. وفي الصَّباحِ وَجَدَ المُسلِمونَ العَدُوَّ قد رَحَل. وقالَ النَّبِيُّ ﷺ: «الآنَ نَغزوهُم ولا يَغزونَنا» — فَقدِ انقَلَبَ المَوقِفُ نِهائيًّا. فَأعظَمُ هَجمةٍ مُشتَرَكةٍ شَنَّها أعداءُ الإسلامِ قَطُّ فَشِلَت تَمامًا، ولم يَحتَجِ المُسلِمونَ إلى مَعرَكةٍ كَبيرةٍ أصلًا؛ كانَ النَّصرُ لِله.\n\nوغَزوةُ الأحزابِ غَنيّةٌ بِالدُّروسِ لِكُلِّ مُؤمِن. فَهي تُعَلِّمُ اجتِماعَ التَّخطيطِ والتَّوَكُّل: أخَذَ المُسلِمونَ بِأفضَلِ الأسبابِ المُتاحة — الشّورى، وقَبولِ الرَّأيِ السَّديدِ حَتّى مِن مُسلِمٍ فارِسيٍّ جَديد، ومُكابَدةِ مَشَقّةِ الخَندَق — ومعَ ذلك أيقَنوا أنَّ النَّصرَ مِنَ اللهِ وَحدَه. وهذا حَقيقةُ التَّوَكُّل: أن تَعقِلَ ناقَتَكَ ثُمَّ تَتَوَكَّل، أن تَجتَهِدَ في الدِّراسةِ ثُمَّ تَعتَمِدَ علَيه، أن تَأخُذَ بِكُلِّ سَبَبٍ مَشروعٍ ثُمَّ تُفَوِّضَ النَّتيجةَ إلَيه. وتُعَلِّمُ أنَّ البَلاءَ امتِحانٌ يُمَيِّزُ الإيمانَ الصّادِقَ مِنَ الدَّعاوى الجَوفاء، وأنَّ رَدَّ المُؤمِنِ على الشِّدّةِ يَكشِفُ حَقيقةَ قَلبِه. وتُعَلِّمُ قيمةَ الشّورى وتَقديرِ الحِكمةِ والمَوهِبةِ أينَما وُجِدَت، بِغَضِّ النَّظَرِ عنِ الأصل — فالخِطّةُ التي أنقَذَتِ المَدينةَ جاءَت مِن سَلمانَ الفارِسيّ. وتُعَلِّمُ قُوّةَ القُدوةِ في القِيادة، إذ حَفَرَ النَّبِيُّ ﷺ ونَقَلَ التُّرابَ وجاعَ معَ أصحابِه. وفَوقَ ذلك كُلِّهِ تُعَلِّمُ أنَّ لا تَحالُفَ، مَهما عَظُم، يَقوى على المُؤمِنينَ واللهُ ناصِرُهُم: ﴿وكَفى اللهُ المُؤمِنينَ القِتالَ وكانَ اللهُ قَوِيًّا عَزيزًا﴾ (الأحزاب ٢٥). وعلى الطّالِبِ المُجِدِّ أن يَحمِلَ مِن هذه السّيرةِ إيمانًا فاعِلًا مُتَوَكِّلًا — يَعمَلُ بِكُلِّ جُهدٍ وتَخطيط، ويَطمَئِنُّ في تَوَكُّلٍ تامٍّ على مَن بِيَدِهِ وَحدَهُ النَّصر.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does 'Al-Ahzab' mean?", ar: "ما مَعنى «الأحزاب»؟" },
      options: [
        { en: "The Confederates — allied enemy tribes", ar: "القَبائِلُ المُتَحالِفةُ مِنَ الأعداء" },
        { en: "The believers", ar: "المُؤمِنون" },
        { en: "The angels", ar: "المَلائِكة" },
        { en: "A mountain", ar: "جَبَل" },
      ],
      correctIndex: 0,
      explanation: { en: "Allied tribes joined to attack Madinah in 5 AH.", ar: "تَحالَفَتِ القَبائِلُ لِغَزوِ المَدينةِ سَنةَ ٥هـ." },
    },
    {
      prompt: { en: "Who proposed digging the trench?", ar: "مَن اقتَرَحَ حَفرَ الخَندَق؟" },
      options: [
        { en: "Salman al-Farisi", ar: "سَلمانُ الفارِسيّ" },
        { en: "Abu Lahab", ar: "أبو لَهَب" },
        { en: "The enemy", ar: "العَدُوّ" },
        { en: "No one", ar: "لا أحَد" },
      ],
      correctIndex: 0,
      explanation: { en: "He drew on Persian military knowledge.", ar: "استَلهَمَ خِبرةَ فارِسَ العَسكَريّة." },
    },
    {
      prompt: { en: "How did the believers respond when they saw the Confederates?", ar: "كَيفَ استَجابَ المُؤمِنونَ لَمّا رَأوا الأحزاب؟" },
      options: [
        { en: "Their faith increased; they trusted Allah's promise", ar: "زادَ إيمانُهُم ووَثِقوا بِوَعدِ الله" },
        { en: "They fled", ar: "فَرّوا" },
        { en: "They surrendered", ar: "استَسلَموا" },
        { en: "They despaired", ar: "يَئِسوا" },
      ],
      correctIndex: 0,
      explanation: { en: "'It increased them only in faith and acceptance' (Al-Ahzab 22).", ar: "﴿وما زادَهُم إلّا إيمانًا وتَسليمًا﴾ (الأحزاب ٢٢)." },
    },
    {
      prompt: { en: "How did Allah ultimately drive away the enemy?", ar: "كَيفَ رَدَّ اللهُ العَدُوَّ في النِّهاية؟" },
      options: [
        { en: "A fierce cold wind and unseen forces", ar: "ريحٌ شَديدةٌ بارِدةٌ وجُنودٌ لا تُرى" },
        { en: "A large Muslim army", ar: "جَيشٌ مُسلِمٌ كَبير" },
        { en: "A peace treaty", ar: "مُعاهَدةُ سَلام" },
        { en: "Gold payment", ar: "دَفعُ ذَهَب" },
      ],
      correctIndex: 0,
      explanation: { en: "'We sent upon them a wind and armies you did not see' (Al-Ahzab 9).", ar: "﴿فَأرسَلنا علَيهِم ريحًا وجُنودًا لم تَرَوها﴾ (الأحزاب ٩)." },
    },
    {
      prompt: { en: "What does the battle teach about tawakkul?", ar: "ماذا تُعَلِّمُ الغَزوةُ عنِ التَّوَكُّل؟" },
      options: [
        { en: "Take every means, then rely fully on Allah", ar: "خُذْ بِكُلِّ سَبَبٍ ثُمَّ تَوَكَّلْ على اللهِ تَمامًا" },
        { en: "Do nothing and wait", ar: "لا تَفعَلْ شَيئًا وانتَظِر" },
        { en: "Rely only on numbers", ar: "اعتَمِدْ على العَدَدِ فَقَط" },
        { en: "Avoid planning", ar: "تَجَنَّبِ التَّخطيط" },
      ],
      correctIndex: 0,
      explanation: { en: "They dug the trench yet victory came from Allah.", ar: "حَفَروا الخَندَقَ والنَّصرُ مِنَ الله." },
    },
    {
      prompt: { en: "True or False: The Muslims won by fighting a huge battle.", ar: "صَوابٌ أم خَطأ: انتَصَرَ المُسلِمونَ بِمَعرَكةٍ كَبيرة." },
      options: [
        { en: "False — the coalition broke and fled by Allah's aid", ar: "خَطأ — تَفَكَّكَ التَّحالُفُ وفَرَّ بِعَونِ الله" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "'Allah sufficed the believers in battle' (Al-Ahzab 25).", ar: "﴿وكَفى اللهُ المُؤمِنينَ القِتال﴾ (الأحزاب ٢٥)." },
    },
  ],
};
