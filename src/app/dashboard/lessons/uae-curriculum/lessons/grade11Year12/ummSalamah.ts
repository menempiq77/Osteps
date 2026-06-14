import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const ummSalamah: CourseLesson = {
  slug: "g11y12-umm-salamah",
  name: { en: "Umm Salamah, May Allah Be Pleased with Her", ar: "أُمُّ سَلَمةَ رَضِيَ اللهُ عَنها" },
  shortIntro: {
    en: "Umm Salamah, Hind bint Abi Umayyah, was one of the Mothers of the Believers — an early Muslim of great patience, wisdom, and intelligence whose counsel at Al-Hudaybiyah helped the Ummah. This lesson studies her life, her patience through migration and the loss of her first husband, her wise advice to the Prophet ﷺ, and the lessons her example offers about patience, wisdom, and the honoured place of women in Islam.",
    ar: "أُمُّ سَلَمةَ هِندُ بِنتُ أبي أُمَيّةَ إحدى أُمَّهاتِ المُؤمِنين — مِنَ السّابِقاتِ إلى الإسلام، عَظيمةَ الصَّبرِ والحِكمةِ والعَقل، كانَت مَشورَتُها في الحُدَيبيّةِ خَيرًا لِلأُمّة. يَدرُسُ هذا الدَّرسُ حَياتَها، وصَبرَها في الهِجرةِ وفَقدِ زَوجِها الأوَّل، ومَشورَتَها الحَكيمةَ لِلنَّبِيِّ ﷺ، والدُّروسَ التي يُقَدِّمُها مِثالُها في الصَّبرِ والحِكمةِ ومَكانةِ المَرأةِ المُكَرَّمةِ في الإسلام.",
  },
  quranSurahs: ["Al-Baqarah 155-157", "Al-Ahzab 35"],
  sections: [
    {
      title: { en: "Her life and patience", ar: "حَياتُها وصَبرُها" },
      learningObjectives: [
        { en: "Describe the life and faith of Umm Salamah.", ar: "أصِفُ حَياةَ أُمِّ سَلَمةَ وإيمانَها." },
        { en: "Explain her patience through trial and loss.", ar: "أشرَحُ صَبرَها في البَلاءِ والفَقد." },
      ],
      successCriteria: [
        { en: "I can recount her migration and trials.", ar: "أحكي هِجرَتَها وبَلاءَها." },
        { en: "I can explain Al-Baqarah 155-157.", ar: "أشرَحُ البَقَرة ١٥٥-١٥٧." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Patience through hardship and migration.", ar: "الصَّبرُ في الشِّدّةِ والهِجرة." },
        caption: { en: "'Give good tidings to the patient' (Al-Baqarah 155).", ar: "﴿وبَشِّرِ الصّابِرين﴾ (البَقَرة ١٥٥)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How can faith turn the deepest loss into something good?", ar: "كَيفَ يُحَوِّلُ الإيمانُ أعمَقَ الفَقدِ إلى خَير؟" },
        body: {
          en: "Umm Salamah suffered greatly: she migrated twice for her faith, was cruelly separated from her husband and infant son, and then lost her beloved husband Abu Salamah, feeling she could never be consoled. Yet she made a du'a the Prophet ﷺ had taught, and Allah replaced her loss with something better than she could have imagined — she became a Mother of the Believers. Reflect: how can deep faith and patience (sabr) turn even the most painful loss into a doorway to good; what does the response of a believer to calamity look like; and what does the example of this wise, patient woman teach us about the honoured place of women in Islam?",
          ar: "عانَت أُمُّ سَلَمةَ كَثيرًا: هاجَرَت مَرَّتَينِ لِدينِها، وفُرِّقَ بَينَها وبَينَ زَوجِها ووَلَدِها الرَّضيعِ بِقَسوة، ثُمَّ فَقَدَت زَوجَها الحَبيبَ أبا سَلَمة، وظَنَّت أنَّها لَن تُعَزّى أبَدًا. لكِنَّها دَعَت بِدُعاءٍ عَلَّمَهُ النَّبِيُّ ﷺ، فَأبدَلَها اللهُ خَيرًا مِمّا تَصَوَّرَت — صارَت أُمًّا لِلمُؤمِنين. تَأمَّل: كَيفَ يُحَوِّلُ الإيمانُ العَميقُ والصَّبرُ أشَدَّ الفَقدِ بابًا إلى خَير؛ وكَيفَ يَكونُ رَدُّ المُؤمِنِ على المُصيبة؛ وماذا يُعَلِّمُنا مِثالُ هذه المَرأةِ الحَكيمةِ الصّابِرةِ عن مَكانةِ المَرأةِ المُكَرَّمةِ في الإسلام؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Ummahat al-Mu'minin (أُمَّهاتُ المُؤمِنين): the Mothers of the Believers (the Prophet's wives). Sabr (الصَّبر): patient endurance.", ar: "أُمَّهاتُ المُؤمِنين: زَوجاتُ النَّبِيِّ ﷺ. الصَّبر: الاحتِمالُ الجَميل." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "The du'a at calamity: 'Inna lillahi wa inna ilayhi raji'un... O Allah, reward me in my affliction and replace it for me with better.'", ar: "دُعاءُ المُصيبة: «إنّا لِلهِ وإنّا إلَيهِ راجِعون... اللّهُمَّ أجُرني في مُصيبَتي وأخلِف لي خَيرًا مِنها»." },
          ],
        },
      ],
      body: {
        en: "Umm Salamah, whose name was Hind bint Abi Umayyah, was one of the noble Mothers of the Believers (Ummahat al-Mu'minin) and among the earliest to embrace Islam. She came from a respected family of the Quraysh and was known for her intelligence, eloquence, beauty of character, and firmness of faith. She and her first husband, Abu Salamah ibn 'Abd al-Asad — himself a cousin and foster-brother of the Prophet ﷺ and one of the earliest Muslims — accepted Islam in its very first days and bore the persecution of the Quraysh with patience. They were among those who made the first migration to Abyssinia (Habashah) to escape oppression, and later prepared to migrate to Madinah, enduring great hardship for the sake of their faith.\n\nHer patience was tested in the most painful way at the time of the Hijrah to Madinah. As Abu Salamah set out with his wife and their little son, the clan of Umm Salamah seized her and forcibly separated her from her husband, while his clan snatched away their infant son, so cruelly that, it is reported, the child's arm was injured in the struggle. Abu Salamah went on to Madinah alone, the child was taken by one family, and Umm Salamah was held by another — husband, wife, and child torn apart in three directions. For about a year, Umm Salamah would go out each morning to the place where she had been parted from her family and weep until nightfall, in deep grief. Eventually, moved by her sorrow, her relatives relented and allowed her to go; she was reunited with her son and travelled the long, dangerous road to Madinah, largely alone, trusting in Allah, until she reached her husband. Her endurance through this ordeal — migration, separation, and the loss of home and family for the sake of faith — made her a model of the patience (sabr) that Allah praises and rewards.\n\nBut her greatest trial was yet to come. Her beloved husband Abu Salamah was wounded at the Battle of Uhud, and though he recovered for a time, the wound reopened and he died, leaving Umm Salamah a grieving widow with young children. In her grief she remembered a teaching of the Prophet ﷺ: that whoever is struck by a calamity and says, 'Inna lillahi wa inna ilayhi raji'un — to Allah we belong and to Him we shall return — O Allah, reward me in my affliction and replace it for me with something better,' Allah will reward them and give them something better. She said this du'a, though she wondered in her heart, 'Who could be better than Abu Salamah?' Yet she trusted Allah and made the supplication sincerely. This is the very response to calamity that Allah praises in the Qur'an: 'And give good tidings to the patient, who, when disaster strikes them, say: Indeed we belong to Allah, and indeed to Him we will return. Those are the ones upon whom are blessings from their Lord and mercy, and it is those who are the rightly guided' (Al-Baqarah 155-157). Allah answered her patience and her du'a in a way beyond her imagining: the Prophet ﷺ himself married her, and she became a Mother of the Believers — honoured forever, raised to a station far greater than she had lost. In the next section, we will study her wisdom and intelligence, especially her famous counsel at Al-Hudaybiyah, and the lessons her life offers.",
        ar: "أُمُّ سَلَمةَ، واسمُها هِندُ بِنتُ أبي أُمَيّة، إحدى أُمَّهاتِ المُؤمِنينَ الكَريمات، ومِنَ السّابِقاتِ إلى الإسلام. كانَت مِن أُسرةٍ شَريفةٍ مِن قُرَيش، مَعروفةً بِعَقلِها وفَصاحَتِها وحُسنِ خُلُقِها وثَباتِ إيمانِها. أسلَمَت هي وزَوجُها الأوَّلُ أبو سَلَمةَ بنُ عَبدِ الأسَد — وهو ابنُ عَمّةِ النَّبِيِّ ﷺ وأخوهُ مِنَ الرَّضاعةِ ومِن أوائِلِ المُسلِمين — في أوَّلِ أيّامِ الإسلام، وصَبَرا على أذى قُرَيش. وكانا مِمَّن هاجَرَ الهِجرةَ الأولى إلى الحَبَشةِ فِرارًا مِنَ الاضطِهاد، ثُمَّ تَهَيَّآ لِلهِجرةِ إلى المَدينة، فَاحتَمَلا مَشَقّةً عَظيمةً في سَبيلِ دينِهِما.\n\nوامتُحِنَ صَبرُها بِأشَدِّ ما يَكونُ وَقتَ الهِجرةِ إلى المَدينة. فَلَمّا خَرَجَ أبو سَلَمةَ بِزَوجِهِ وابنِهِما الصَّغير، أمسَكَ قَومُ أُمِّ سَلَمةَ بِها وفَرَّقوا بَينَها وبَينَ زَوجِها قَسرًا، وانتَزَعَ قَومُهُ ابنَهُمَا الرَّضيعَ بِقَسوةٍ حتّى أُصيبَت يَدُ الطِّفلِ في الجَذبِ كَما رُوِيَ. فَمَضى أبو سَلَمةَ إلى المَدينةِ وَحدَه، وأخَذَ الطِّفلَ أهلٌ، وحُبِسَت أُمُّ سَلَمةَ عِندَ آخَرين — زَوجٌ وزَوجةٌ ووَلَدٌ مُزِّقوا في ثَلاثِ جِهات. وكانَت أُمُّ سَلَمةَ نَحوَ سَنةٍ تَخرُجُ كُلَّ صَباحٍ إلى مَوضِعِ فِراقِها أهلَها فَتَبكي حتّى اللَّيلِ في حُزنٍ عَميق. ثُمَّ رَقَّ قَومُها لِحُزنِها فَأذِنوا لَها، فَلَحِقَها ابنُها، وقَطَعَتِ الطَّريقَ الطَّويلةَ الخَطِرةَ إلى المَدينةِ وَحدَها في أكثَرِها، مُتَوَكِّلةً على الله، حتّى بَلَغَت زَوجَها. فَصَبرُها في هذه المِحنة — الهِجرةِ والفُرقةِ وفَقدِ الوَطَنِ والأهلِ لِأجلِ الدّين — جَعَلَها نَموذَجًا لِلصَّبرِ الذي يُثني علَيهِ اللهُ ويُثيبُ.\n\nلكِنَّ أعظَمَ بَلائِها كانَ بَعدُ. فَزَوجُها الحَبيبُ أبو سَلَمةَ جُرِحَ يَومَ أُحُد، وبَرِئَ حينًا ثُمَّ انتَقَضَ جُرحُهُ فَتُوُفِّيَ، وتَرَكَ أُمَّ سَلَمةَ أرمَلةً حَزينةً ذاتَ أطفالٍ صِغار. وفي حُزنِها ذَكَرَت تَعليمَ النَّبِيِّ ﷺ: أنَّ مَن أصابَتهُ مُصيبةٌ فَقالَ «إنّا لِلهِ وإنّا إلَيهِ راجِعون، اللّهُمَّ أجُرني في مُصيبَتي وأخلِف لي خَيرًا مِنها» أجَرَهُ اللهُ وأخلَفَ لَهُ خَيرًا. فَقالَتها، وإن خَطَرَ في قَلبِها: «ومَن خَيرٌ مِن أبي سَلَمة؟» لكِنَّها وَثِقَت بِاللهِ ودَعَت صادِقة. وهذا هو الرَّدُّ على المُصيبةِ الذي يَمدَحُهُ اللهُ في القُرآن: ﴿وبَشِّرِ الصّابِرين الذينَ إذا أصابَتهُم مُصيبةٌ قالوا إنّا لِلهِ وإنّا إلَيهِ راجِعون أُولئِكَ علَيهِم صَلَواتٌ مِن رَبِّهِم ورَحمةٌ وأُولئِكَ هُمُ المُهتَدون﴾ (البَقَرة ١٥٥-١٥٧). فَأجابَ اللهُ صَبرَها ودُعاءَها بِما فَوقَ تَصَوُّرِها: تَزَوَّجَها النَّبِيُّ ﷺ نَفسُه، فَصارَت أُمًّا لِلمُؤمِنينَ — مُكَرَّمةً إلى الأبَد، مَرفوعةً إلى مَقامٍ أعظَمَ بِكَثيرٍ مِمّا فَقَدَت. وفي القِسمِ التّالي نَدرُسُ حِكمَتَها وعَقلَها، خاصّةً مَشورَتَها المَشهورةَ في الحُدَيبيّة، والدُّروسَ التي تُقَدِّمُها حَياتُها.",
      },
    },
    {
      title: { en: "Her wisdom and lessons", ar: "حِكمَتُها ودُروسُها" },
      learningObjectives: [
        { en: "Recount the wise counsel of Umm Salamah at Al-Hudaybiyah.", ar: "أحكي مَشورةَ أُمِّ سَلَمةَ الحَكيمةَ في الحُدَيبيّة." },
        { en: "Draw lessons about patience, wisdom, and women in Islam.", ar: "أستَخلِصُ دُروسًا في الصَّبرِ والحِكمةِ ومَكانةِ المَرأة." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Her wisdom and knowledge.", ar: "حِكمَتُها وعِلمُها." },
        caption: { en: "Believing men and women are equal in reward (Al-Ahzab 35).", ar: "المُؤمِنونَ والمُؤمِناتُ سَواءٌ في الأجرِ (الأحزاب ٣٥)." },
      },
      groupTasks: {
        title: { en: "Lessons from Umm Salamah", ar: "دُروسٌ مِن أُمِّ سَلَمة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "wisdom-at-hudaybiyah",
            name: { en: "Team A — Her wisdom at Al-Hudaybiyah", ar: "الفَريقُ أ — حِكمَتُها في الحُدَيبيّة" },
            learningObjective: { en: "Present her wise counsel and intelligence.", ar: "نَعرِضُ مَشورَتَها الحَكيمةَ وعَقلَها." },
            task: { en: "Present the story of Umm Salamah's wise counsel at Al-Hudaybiyah: after the treaty, the Prophet ﷺ ordered the Companions to sacrifice their animals and shave their heads to leave ihram, but, in their distress at the treaty's terms, they hesitated. The Prophet ﷺ, troubled, went to Umm Salamah, who advised him to go out himself and, without speaking to anyone, sacrifice his own animal and call his barber to shave his head. When he did, the Companions, seeing him, rushed to do the same. Show what this reveals about her intelligence and sound judgement, and how the Prophet ﷺ valued the wise counsel of a woman. Mention her standing as a narrator of many hadith. Present a 'wisdom of Umm Salamah' display.", ar: "اعرِضوا قِصّةَ مَشورةِ أُمِّ سَلَمةَ الحَكيمةِ في الحُدَيبيّة: بَعدَ الصُّلحِ أمَرَ النَّبِيُّ ﷺ الصَّحابةَ أن يَنحَروا هَديَهُم ويَحلِقوا رُؤوسَهُم لِيَتَحَلَّلوا، لكِنَّهُم — لِحُزنِهِم على شُروطِ الصُّلح — تَرَدَّدوا. فَدَخَلَ النَّبِيُّ ﷺ مَهمومًا على أُمِّ سَلَمة، فَأشارَت علَيهِ أن يَخرُجَ هو ولا يُكَلِّمَ أحَدًا حتّى يَنحَرَ بُدنَهُ ويَدعوَ حالِقَهُ فَيَحلِقَه. فَلَمّا فَعَل، رَآهُ الصَّحابةُ فَبادَروا إلى مِثلِه. بَيِّنوا ما يَكشِفُهُ هذا مِن عَقلِها وحُسنِ رَأيِها، وكَيفَ قَدَّرَ النَّبِيُّ ﷺ مَشورةَ امرَأةٍ حَكيمة. اذكُروا مَكانَتَها راويةً لِكَثيرٍ مِنَ الحَديث. اعرِضوا لَوحةَ «حِكمةِ أُمِّ سَلَمة»." },
            evidence: [
              { en: "Her counsel resolved a difficult moment for the whole Ummah.", ar: "مَشورَتُها حَلَّت مَوقِفًا صَعبًا لِلأُمّةِ كُلِّها." },
            ],
            sourceNotes: [
              { en: "The Prophet ﷺ valued and acted on her wise advice.", ar: "قَدَّرَ النَّبِيُّ ﷺ مَشورَتَها الحَكيمةَ وعَمِلَ بِها." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'wisdom of Umm Salamah' display.", ar: "لَوحةُ «حِكمةِ أُمِّ سَلَمة»." },
          },
          {
            slug: "lessons-and-women",
            name: { en: "Team B — Lessons and the honour of women", ar: "الفَريقُ ب — الدُّروسُ ومَكانةُ المَرأة" },
            learningObjective: { en: "Present the lessons of her life and the place of women in Islam.", ar: "نَعرِضُ دُروسَ حَياتِها ومَكانةَ المَرأةِ في الإسلام." },
            task: { en: "Present the lessons from the life of Umm Salamah and what it shows about the honoured place of women in Islam: patience (sabr) and the right response to calamity ('to Allah we belong...'); trusting Allah's wisdom, for He may replace a loss with something far better; the value of wisdom, intelligence, and good counsel; and the honour Islam gives women — as scholars, advisers, and full believers equal to men in faith and reward, as Allah declares in Al-Ahzab 35. Apply these to a young person's life today (facing loss and hardship with faith, valuing wise advice, respecting the role and dignity of women). Present a 'lessons from her life' guide.", ar: "اعرِضوا دُروسَ حَياةِ أُمِّ سَلَمةَ وما تُظهِرُهُ مِن مَكانةِ المَرأةِ المُكَرَّمةِ في الإسلام: الصَّبرَ والرَّدَّ الصَّحيحَ على المُصيبة («إنّا لِلهِ...»)؛ والثِّقةَ بِحِكمةِ اللهِ، فَقَد يُبدِلُ الفَقدَ بِما هو خَيرٌ بِكَثير؛ وقيمةَ الحِكمةِ والعَقلِ وحُسنِ المَشورة؛ والإكرامَ الذي يُعطيهِ الإسلامُ المَرأة — عالِمةً ومُستَشارةً ومُؤمِنةً كامِلةً سَواءً معَ الرَّجُلِ في الإيمانِ والأجر، كَما يُعلِنُ اللهُ في الأحزاب ٣٥. طَبِّقوها على حَياةِ الشّابِّ اليَوم (مُواجَهةِ الفَقدِ والشِّدّةِ بِالإيمان، وتَقديرِ المَشورةِ الحَكيمة، واحتِرامِ دَورِ المَرأةِ وكَرامَتِها). اعرِضوا دَليلَ «دُروسٍ مِن حَياتِها»." },
            evidence: [
              { en: "'The Muslim men and Muslim women... Allah has prepared for them forgiveness and great reward' (Al-Ahzab 35).", ar: "﴿إنَّ المُسلِمينَ والمُسلِماتِ... أعَدَّ اللهُ لَهُم مَغفِرةً وأجرًا عَظيمًا﴾ (الأحزاب ٣٥)." },
            ],
            sourceNotes: [
              { en: "Islam honours women as believers, scholars, and advisers.", ar: "يُكرِمُ الإسلامُ المَرأةَ مُؤمِنةً وعالِمةً ومُستَشارة." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'lessons from her life' guide.", ar: "دَليلُ «دُروسٍ مِن حَياتِها»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Patience and trust like Umm Salamah", ar: "الصَّبرُ والثِّقةُ كَأُمِّ سَلَمة" },
        prompt: { en: "Umm Salamah endured migration, separation, and the loss of her husband with patience, responding to calamity with 'To Allah we belong and to Him we return' and trusting Allah to replace her loss with better — and He honoured her as a Mother of the Believers and valued her wise counsel. Reflect on how you respond to hardship and loss in your own life. Do you meet difficulty with patience and trust in Allah's wisdom, or with despair and complaint? Write about a hardship you have faced or may face, and describe how the example of Umm Salamah — her patience, her du'a at calamity, and her trust that Allah can bring good from loss — can guide your response, and what her life teaches you about valuing wisdom and the honoured place of women in Islam.", ar: "احتَمَلَت أُمُّ سَلَمةَ الهِجرةَ والفُرقةَ وفَقدَ زَوجِها بِصَبر، تَرُدُّ على المُصيبةِ بِـ«إنّا لِلهِ وإنّا إلَيهِ راجِعون»، واثِقةً أنَّ اللهَ يُبدِلُها خَيرًا — فَأكرَمَها أُمًّا لِلمُؤمِنينَ وقَدَّرَ مَشورَتَها الحَكيمة. تَأمَّل كَيفَ تَرُدُّ على الشِّدّةِ والفَقدِ في حَياتِك. أتَلقى الصُّعوبةَ بِصَبرٍ وثِقةٍ بِحِكمةِ الله، أم بِيَأسٍ وشَكوى؟ اكتُب عن شِدّةٍ واجَهتَها أو قَد تُواجِهُها، وصِف كَيفَ يَهديكَ مِثالُ أُمِّ سَلَمة — صَبرُها، ودُعاؤُها عِندَ المُصيبة، وثِقَتُها أنَّ اللهَ يَأتي بِالخَيرِ مِنَ الفَقد — في رَدِّك، وماذا تُعَلِّمُكَ حَياتُها عن تَقديرِ الحِكمةِ ومَكانةِ المَرأةِ المُكَرَّمةِ في الإسلام." },
        placeholder: { en: "When I face hardship I will... Her example teaches me...", ar: "حينَ أُواجِهُ الشِّدّةَ سَأ... ومِثالُها يُعَلِّمُني..." },
      },
      body: {
        en: "Umm Salamah was not only a model of patience but also a woman of remarkable intelligence, wisdom, and sound judgement, and the most famous example of this is her counsel to the Prophet ﷺ at Al-Hudaybiyah. After the Treaty of Al-Hudaybiyah was concluded — its terms appearing, on the surface, to be a setback for the Muslims — the Prophet ﷺ commanded his Companions to sacrifice the animals they had brought and to shave their heads in order to come out of the state of ihram, since they would not be performing 'umrah that year. But the Companions, weighed down by grief and disappointment at the treaty, hesitated and did not move to obey, though he repeated the command. The Prophet ﷺ, troubled by this, went in to his wife Umm Salamah and told her what had happened. With great wisdom she advised him: 'O Messenger of Allah, go out yourself, and do not speak a word to any of them, until you have sacrificed your own animal and called your barber to shave your head.' The Prophet ﷺ took her advice. He went out, said nothing, sacrificed his animal, and had his head shaved. When the Companions saw him do it, they leapt up and rushed to sacrifice and shave one another's heads, the difficult moment dissolved. Her insight had perceived that the Companions needed to see their leader act first, and her counsel resolved a tense and dangerous moment for the entire Ummah. This story is preserved with honour, showing both her wisdom and the fact that the Prophet ﷺ valued and acted upon the counsel of a wise woman. Umm Salamah was also one of the great narrators of hadith among the women of the Companions, transmitting many ahadith and living long after the Prophet ﷺ, remaining a source of knowledge and guidance.\n\nThe life of Umm Salamah offers the believer rich and lasting lessons. The first is the lesson of patience (sabr) and the right response to calamity. She faced migration, the cruel separation from her husband and child, and the loss of her beloved husband, yet she met each trial with patient endurance and turned to Allah, responding to disaster as the Qur'an commands: 'Indeed we belong to Allah, and indeed to Him we will return' (Al-Baqarah 156). The second lesson is trust in Allah's wisdom: when she made the du'a for something better after Abu Salamah's death, she could not imagine anyone better than him — yet Allah, who knows what we do not, replaced her loss with a station beyond all she could have hoped, marriage to the Prophet ﷺ himself and the rank of a Mother of the Believers. Her life is a living proof that the believer who responds to loss with patience and trust may find that Allah brings from it a good far greater than what was taken. The third lesson is the value of wisdom, intelligence, and good counsel, embodied in her advice at Al-Hudaybiyah.\n\nFinally, the life of Umm Salamah, like those of the other great women of Islam, powerfully illustrates the honoured place of women in the religion. Far from being marginalised, women in Islam are full believers, equal to men in faith and in reward before Allah, as He declares: 'Indeed, the Muslim men and Muslim women, the believing men and believing women... Allah has prepared for them forgiveness and a great reward' (Al-Ahzab 35). Women in Islam are honoured as scholars and narrators of knowledge, as wise counsellors whose advice even the Prophet ﷺ valued, as patient bearers of hardship for the sake of faith, and as mothers, wives, and daughters with rights and dignity. The Mothers of the Believers, including Umm Salamah, are honoured forever in the hearts of the Muslims, their lives studied and their words transmitted across the centuries. For a young Muslim today, Umm Salamah is an example to learn from in many ways: in facing the losses and hardships of life with patience and faith rather than despair; in trusting that Allah's choice is better than our own and may bring good even from pain; in valuing and seeking wise counsel; and in honouring and respecting the dignity, intelligence, and faith of the women of this Ummah. May Allah be pleased with Umm Salamah, the patient, the wise, the Mother of the Believers.",
        ar: "لَم تَكُن أُمُّ سَلَمةَ نَموذَجَ صَبرٍ فَحَسب، بل امرَأةً عَظيمةَ العَقلِ والحِكمةِ وحُسنِ الرَّأي، وأشهَرُ أمثِلةِ ذلك مَشورَتُها لِلنَّبِيِّ ﷺ في الحُدَيبيّة. فَبَعدَ أن عُقِدَ صُلحُ الحُدَيبيّةِ — وشُروطُهُ في ظاهِرِها تَبدو نَكسةً لِلمُسلِمين — أمَرَ النَّبِيُّ ﷺ أصحابَهُ أن يَنحَروا هَديَهُم ويَحلِقوا رُؤوسَهُم لِيَخرُجوا مِنَ الإحرام، إذ لَن يَعتَمِروا ذلك العام. لكِنَّ الصَّحابةَ، وقَد أثقَلَهُمُ الحُزنُ على الصُّلح، تَرَدَّدوا ولَم يَنهَضوا لِلطّاعة، وإن كَرَّرَ الأمر. فَدَخَلَ النَّبِيُّ ﷺ مَهمومًا على زَوجِهِ أُمِّ سَلَمةَ فَأخبَرَها بِما جَرى. فَأشارَت بِحِكمةٍ بالِغة: «يا رَسولَ الله، اخرُج، ولا تُكَلِّم أحَدًا مِنهُم كَلِمة، حتّى تَنحَرَ بُدنَكَ وتَدعوَ حالِقَكَ فَيَحلِقَك». فَأخَذَ النَّبِيُّ ﷺ بِمَشورَتِها. خَرَجَ ولَم يُكَلِّم أحَدًا، ونَحَرَ بُدنَه، وحَلَقَ رَأسَه. فَلَمّا رَآهُ الصَّحابةُ فَعَلَ، وَثَبوا وبادَروا إلى النَّحرِ ويَحلِقُ بَعضُهُم بَعضًا، وانحَلَّ المَوقِفُ الصَّعب. أدرَكَت فِراسَتُها أنَّ الصَّحابةَ يَحتاجونَ أن يَرَوا قائِدَهُم يَفعَلُ أوَّلًا، فَحَلَّت مَشورَتُها مَوقِفًا مُتَوَتِّرًا خَطِرًا لِلأُمّةِ كُلِّها. وهذه القِصّةُ مَحفوظةٌ بِإكرام، تُظهِرُ حِكمَتَها وأنَّ النَّبِيَّ ﷺ قَدَّرَ مَشورةَ امرَأةٍ حَكيمةٍ وعَمِلَ بِها. وكانَت أُمُّ سَلَمةَ مِن كِبارِ راوياتِ الحَديثِ بَينَ نِساءِ الصَّحابة، رَوَت كَثيرًا مِنَ الأحاديث، وعاشَت طَويلًا بَعدَ النَّبِيِّ ﷺ مَصدَرَ عِلمٍ وهُدًى.\n\nوحَياةُ أُمِّ سَلَمةَ تُقَدِّمُ لِلمُؤمِنِ دُروسًا غَنيّةً باقية. أوَّلُها دَرسُ الصَّبرِ والرَّدِّ الصَّحيحِ على المُصيبة. واجَهَتِ الهِجرةَ، والفُرقةَ القاسيةَ عن زَوجِها ووَلَدِها، وفَقدَ زَوجِها الحَبيب، ومعَ ذلك لَقِيَت كُلَّ بَلاءٍ بِصَبرٍ جَميلٍ وعادَت إلى الله، تَرُدُّ على المُصيبةِ كَما يَأمُرُ القُرآن: ﴿إنّا لِلهِ وإنّا إلَيهِ راجِعون﴾ (البَقَرة ١٥٦). والدَّرسُ الثّاني الثِّقةُ بِحِكمةِ الله: حينَ دَعَت بِخَيرٍ بَعدَ وَفاةِ أبي سَلَمةَ، لَم تَستَطِع أن تَتَصَوَّرَ خَيرًا مِنه — لكِنَّ اللهَ، العالِمَ بِما لا نَعلَم، أبدَلَها مَقامًا فَوقَ كُلِّ ما رَجَت، الزَّواجَ مِنَ النَّبِيِّ ﷺ نَفسِهِ ومَرتَبةَ أُمِّ المُؤمِنين. وحَياتُها بُرهانٌ حَيٌّ أنَّ المُؤمِنَ الذي يَرُدُّ على الفَقدِ بِصَبرٍ وثِقةٍ قَد يَجِدُ أنَّ اللهَ أتى مِنهُ بِخَيرٍ أعظَمَ بِكَثيرٍ مِمّا أُخِذ. والدَّرسُ الثّالِثُ قيمةُ الحِكمةِ والعَقلِ وحُسنِ المَشورة، المُتَجَسِّدةُ في رَأيِها في الحُدَيبيّة.\n\nوأخيرًا، فَحَياةُ أُمِّ سَلَمة، كَحَياةِ سائِرِ عَظيماتِ الإسلام، تُجَسِّدُ بِقُوّةٍ مَكانةَ المَرأةِ المُكَرَّمةَ في الدّين. فَبَعيدًا عنِ التَّهميش، المَرأةُ في الإسلامِ مُؤمِنةٌ كامِلة، سَواءٌ معَ الرَّجُلِ في الإيمانِ والأجرِ عِندَ الله، كَما يُعلِنُ سُبحانَه: ﴿إنَّ المُسلِمينَ والمُسلِماتِ والمُؤمِنينَ والمُؤمِناتِ... أعَدَّ اللهُ لَهُم مَغفِرةً وأجرًا عَظيمًا﴾ (الأحزاب ٣٥). والمَرأةُ في الإسلامِ مُكَرَّمةٌ عالِمةً وراويةً لِلعِلم، ومُستَشارةً قَدَّرَ النَّبِيُّ ﷺ نَفسُهُ رَأيَها، وصابِرةً تَحتَمِلُ الشِّدّةَ لِأجلِ الدّين، وأُمًّا وزَوجةً وبِنتًا ذاتَ حُقوقٍ وكَرامة. وأُمَّهاتُ المُؤمِنين، ومِنهُنَّ أُمُّ سَلَمة، مُكَرَّماتٌ إلى الأبَدِ في قُلوبِ المُسلِمين، تُدرَسُ حَياتُهُنَّ وتُنقَلُ أقوالُهُنَّ عَبرَ القُرون. ولِلشّابِّ المُسلِمِ اليَومَ، أُمُّ سَلَمةَ مِثالٌ يَتَعَلَّمُ مِنهُ في وُجوهٍ كَثيرة: في مُواجَهةِ خَسائِرِ الحَياةِ وشَدائِدِها بِصَبرٍ وإيمانٍ لا يَأس؛ وفي الثِّقةِ أنَّ اختيارَ اللهِ خَيرٌ مِنِ اختيارِنا وقَد يَأتي بِالخَيرِ مِنَ الألَم؛ وفي تَقديرِ المَشورةِ الحَكيمةِ وطَلَبِها؛ وفي إكرامِ كَرامةِ نِساءِ هذه الأُمّةِ وعَقلِهِنَّ وإيمانِهِنَّ واحتِرامِها. رَضِيَ اللهُ عن أُمِّ سَلَمةَ الصّابِرةِ الحَكيمةِ أُمِّ المُؤمِنين.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who was Umm Salamah?", ar: "مَن أُمُّ سَلَمة؟" },
      options: [
        { en: "A Mother of the Believers, known for patience and wisdom", ar: "أُمٌّ لِلمُؤمِنين، مَعروفةٌ بِالصَّبرِ والحِكمة" },
        { en: "An enemy of Islam", ar: "عَدُوّةٌ لِلإسلام" },
        { en: "A queen of Persia", ar: "مَلِكةُ فارِس" },
        { en: "A poet of the Jahiliyyah only", ar: "شاعِرةُ جاهِليّةٍ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "She was among the earliest Muslims and a wife of the Prophet ﷺ.", ar: "كانَت مِنَ السّابِقاتِ إلى الإسلامِ وزَوجًا لِلنَّبِيِّ ﷺ." },
    },
    {
      prompt: { en: "What du'a did she say when her husband died?", ar: "بِمَ دَعَت حينَ ماتَ زَوجُها؟" },
      options: [
        { en: "'To Allah we belong... reward me and replace it with better'", ar: "«إنّا لِلهِ... أجُرني وأخلِف لي خَيرًا»" },
        { en: "She complained against Allah", ar: "شَكَت على الله" },
        { en: "She said nothing", ar: "لَم تَقُل شَيئًا" },
        { en: "She despaired", ar: "يَئِسَت" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah replaced her loss with marriage to the Prophet ﷺ.", ar: "أبدَلَها اللهُ الزَّواجَ مِنَ النَّبِيِّ ﷺ." },
    },
    {
      prompt: { en: "What was her wise counsel at Al-Hudaybiyah?", ar: "ما مَشورَتُها الحَكيمةُ في الحُدَيبيّة؟" },
      options: [
        { en: "That the Prophet ﷺ act first himself, then the Companions would follow", ar: "أن يَفعَلَ النَّبِيُّ ﷺ بِنَفسِهِ أوَّلًا فَيَتبَعَهُ الصَّحابة" },
        { en: "To break the treaty", ar: "أن يَنقُضَ الصُّلح" },
        { en: "To fight immediately", ar: "أن يُقاتِلَ فَورًا" },
        { en: "To return home", ar: "أن يَعودَ إلى البَيت" },
      ],
      correctIndex: 0,
      explanation: { en: "When he sacrificed and shaved first, the Companions rushed to follow.", ar: "لَمّا نَحَرَ وحَلَقَ أوَّلًا بادَرَ الصَّحابةُ إلى مِثلِه." },
    },
    {
      prompt: { en: "What does Al-Baqarah 155-157 promise the patient?", ar: "بِمَ تَعِدُ البَقَرة ١٥٥-١٥٧ الصّابِرين؟" },
      options: [
        { en: "Blessings, mercy, and guidance from their Lord", ar: "صَلَواتٍ ورَحمةً وهُدًى مِن رَبِّهِم" },
        { en: "Nothing", ar: "لا شَيء" },
        { en: "Wealth in this world only", ar: "مالًا في الدُّنيا فَقَط" },
        { en: "Punishment", ar: "عُقوبة" },
      ],
      correctIndex: 0,
      explanation: { en: "Those who say 'to Allah we return' receive blessings and mercy.", ar: "مَن قالَ «إنّا لِلهِ» نالَ الصَّلَواتِ والرَّحمة." },
    },
    {
      prompt: { en: "What does Al-Ahzab 35 show about men and women?", ar: "ماذا تُظهِرُ الأحزاب ٣٥ عنِ الرَّجُلِ والمَرأة؟" },
      options: [
        { en: "They are equal in faith and reward before Allah", ar: "هُما سَواءٌ في الإيمانِ والأجرِ عِندَ الله" },
        { en: "Women have no reward", ar: "لا أجرَ لِلنِّساء" },
        { en: "Only men are believers", ar: "الرِّجالُ وَحدَهُمُ المُؤمِنون" },
        { en: "Faith does not matter", ar: "الإيمانُ لا يُهِمّ" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah prepared forgiveness and great reward for believing men and women.", ar: "أعَدَّ اللهُ لِلمُؤمِنينَ والمُؤمِناتِ مَغفِرةً وأجرًا عَظيمًا." },
    },
    {
      prompt: { en: "True or False: The Prophet ﷺ valued and acted on the wise counsel of Umm Salamah.", ar: "صَوابٌ أم خَطأ: قَدَّرَ النَّبِيُّ ﷺ مَشورةَ أُمِّ سَلَمةَ الحَكيمةَ وعَمِلَ بِها." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Her advice at Al-Hudaybiyah resolved a difficult moment for the Ummah.", ar: "حَلَّت مَشورَتُها في الحُدَيبيّةِ مَوقِفًا صَعبًا لِلأُمّة." },
    },
  ],
};
