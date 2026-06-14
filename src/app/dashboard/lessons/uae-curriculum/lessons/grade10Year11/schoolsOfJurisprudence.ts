import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const schoolsOfJurisprudence: CourseLesson = {
  slug: "g10y11-schools-of-jurisprudence",
  name: { en: "Schools of Jurisprudence", ar: "المَدارِسُ الفِقهيّة" },
  shortIntro: {
    en: "The great schools of Islamic jurisprudence (madhahib) — Hanafi, Maliki, Shafi'i, and Hanbali — are the fruit of the scholars' efforts to understand and apply the Qur'an and Sunnah. This lesson studies how they arose, their shared foundations, and the right attitude toward them.",
    ar: "المَذاهِبُ الفِقهيّةُ الكُبرى — الحَنَفيُّ والمالِكيُّ والشّافِعيُّ والحَنبَليُّ — ثَمَرةُ جُهودِ العُلَماءِ في فَهمِ القُرآنِ والسُّنّةِ وتَطبيقِهِما. يَدرُسُ هذا الدَّرسُ كَيفَ نَشَأت، وأُصولَها المُشتَرَكة، والمَوقِفَ الصَّحيحَ مِنها.",
  },
  quranSurahs: ["An-Nahl 43", "An-Nisa 59"],
  sections: [
    {
      title: { en: "The rise of the schools of fiqh", ar: "نَشأةُ المَذاهِبِ الفِقهيّة" },
      learningObjectives: [
        { en: "Define fiqh and madhhab.", ar: "أُعَرِّفُ الفِقهَ والمَذهَب." },
        { en: "Explain why the schools of fiqh arose.", ar: "أشرَحُ لِمَ نَشَأتِ المَذاهِبُ الفِقهيّة." },
      ],
      successCriteria: [
        { en: "I can name the four famous Sunni schools and their imams.", ar: "أُسَمّي المَذاهِبَ السُّنّيّةَ الأربَعةَ وأئِمَّتَها." },
        { en: "I can explain the role of ijtihad.", ar: "أشرَحُ دَورَ الاجتِهاد." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A great mosque — the schools served the understanding of one religion.", ar: "مَسجِدٌ عَظيم — خَدَمَتِ المَذاهِبُ فَهمَ دينٍ واحِد." },
        caption: { en: "'So ask the people of knowledge if you do not know' (An-Nahl 43).", ar: "﴿فاسألوا أهلَ الذِّكرِ إن كُنتُم لا تَعلَمون﴾ (النحل ٤٣)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "If Islam is one, why are there different schools of fiqh?", ar: "إن كانَ الإسلامُ واحِدًا، فَلِمَ تَعَدَّدَتِ المَذاهِبُ الفِقهيّة؟" },
        body: {
          en: "The four great schools of jurisprudence all draw from the same Qur'an and Sunnah, yet they sometimes differ on details of rulings. Reflect: how can faithful scholars, all seeking the truth from the same sources, arrive at different conclusions? Is this difference a weakness and division, or a mercy and richness — and what is the right attitude a Muslim should have toward the madhahib?",
          ar: "المَذاهِبُ الأربَعةُ الكُبرى تَستَقي كُلُّها مِنَ القُرآنِ والسُّنّةِ أنفُسِهِما، ومعَ ذلك تَختَلِفُ أحيانًا في تَفاصيلِ الأحكام. تَأمَّل: كَيفَ يَصِلُ عُلَماءٌ مُخلِصونَ، يَطلُبونَ الحَقَّ مِنَ المَصادِرِ نَفسِها، إلى نَتائِجَ مُختَلِفة؟ أهذا الاختِلافُ ضَعفٌ وفُرقة، أم رَحمةٌ وسَعة — وما المَوقِفُ الصَّحيحُ الذي يَنبَغي لِلمُسلِمِ تُجاهَ المَذاهِب؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Fiqh: the science of understanding Islamic rulings from their detailed evidences.", ar: "الفِقه: عِلمُ مَعرِفةِ الأحكامِ الشَّرعيّةِ مِن أدِلَّتِها التَّفصيليّة." },
            { en: "Madhhab: a school of legal thought built on an imam's method of ijtihad.", ar: "المَذهَب: مَدرَسةٌ فِقهيّةٌ على مَنهَجِ إمامٍ في الاجتِهاد." },
          ],
        },
        {
          label: { en: "The four imams", ar: "الأئِمّةُ الأربَعة" },
          lines: [
            { en: "Abu Hanifa, Malik, Ash-Shafi'i, Ahmad ibn Hanbal (may Allah have mercy on them).", ar: "أبو حَنيفة، ومالِك، والشّافِعيّ، وأحمَد بنُ حَنبَل (رَحِمَهُمُ الله)." },
          ],
        },
      ],
      body: {
        en: "Fiqh (Islamic jurisprudence) is the great science of understanding the detailed rulings of the Shari'ah — what is obligatory, recommended, permitted, disliked, and forbidden — derived from the sources of Islam through careful study. A madhhab (school of jurisprudence) is a comprehensive body of legal understanding built upon the method (manhaj) that a great scholar (mujtahid) followed in deriving rulings from the Qur'an, the Sunnah, and the other sources. The four most famous and widely followed schools in Sunni Islam are named after their founding imams: the Hanafi school of Imam Abu Hanifa an-Nu'man (d. 150 AH), the Maliki school of Imam Malik ibn Anas (d. 179 AH), the Shafi'i school of Imam Muhammad ibn Idris ash-Shafi'i (d. 204 AH), and the Hanbali school of Imam Ahmad ibn Hanbal (d. 241 AH) — may Allah have mercy on them all. These imams were among the greatest scholars in the history of the Ummah, men of deep knowledge, piety, and sincerity, who devoted their lives to understanding and serving the religion of Allah.\n\nThe schools of fiqh did not arise from any disagreement about the fundamentals of the religion — the matters of creed, the oneness of Allah, the pillars of Islam and faith, and the clear obligations and prohibitions are agreed upon by all. Rather, they arose in the realm of detailed rulings (furu') through the noble process of ijtihad: the exertion of a qualified scholar's utmost effort to derive a ruling from the evidence. After the age of the Prophet ﷺ and the Companions, as Islam spread across vast lands and new situations and questions arose that had no explicit text addressing them directly, the great scholars applied their deep knowledge to derive rulings from the Qur'an and Sunnah and the principles of the religion. The Qur'an itself directs the believers to refer to the people of knowledge: 'So ask the people of knowledge if you do not know' (An-Nahl 43). Through this process of qualified ijtihad, carried out by the most learned and God-fearing scholars, the schools of jurisprudence developed as organised, rigorous methods for understanding and applying Islam in every age and place.\n\nLegitimate differences among the scholars in matters of detail are a natural and even beneficial result of this process, and they have always existed in the Ummah, beginning even among the Companions themselves. These differences arise for valid reasons: a scholar may not have been aware of a particular hadith that another knew; or two scholars may understand the same text differently; or a text may carry more than one possible meaning; or scholars may weigh and reconcile different evidences in different ways. When such differences come from sincere, qualified scholars all striving to reach the truth from the same revealed sources, they are not a cause for blame, division, or conflict. On the contrary, the scholars have described this kind of difference as a mercy and a breadth (sa'ah) for the Ummah, providing valid options and rich scholarship that allow Islam to be applied with wisdom in varying circumstances. The Prophet ﷺ even indicated the honour of sincere ijtihad: 'When a judge gives a ruling, having tried his best to decide correctly, and is right, he will have two rewards; and if he gives a ruling, having tried his best to decide correctly, but is wrong, he will have one reward' (Bukhari and Muslim) — showing that the sincere scholar who strives is rewarded even when he errs. In the next section we examine the shared foundations of the schools and the right attitude every Muslim should have toward them.",
        ar: "الفِقهُ عِلمٌ عَظيمٌ لِفَهمِ الأحكامِ الشَّرعيّةِ التَّفصيليّة — مِن واجِبٍ ومَندوبٍ ومُباحٍ ومَكروهٍ ومُحَرَّم — المُستَنبَطةِ مِن مَصادِرِ الإسلامِ بِالدِّراسةِ الدَّقيقة. والمَذهَبُ الفِقهيُّ بِناءٌ مُتَكامِلٌ مِنَ الفَهمِ الفِقهيِّ قائِمٌ على المَنهَجِ الذي سَلَكَهُ عالِمٌ مُجتَهِدٌ كَبيرٌ في استِنباطِ الأحكامِ مِنَ القُرآنِ والسُّنّةِ وسائِرِ المَصادِر. وأشهَرُ المَذاهِبِ وأوسَعُها اتِّباعًا في أهلِ السُّنّةِ أربَعةٌ تُنسَبُ إلى أئِمَّتِها: المَذهَبُ الحَنَفيُّ لِلإمامِ أبي حَنيفةَ النُّعمان (ت ١٥٠هـ)، والمالِكيُّ لِلإمامِ مالِكِ بنِ أنَس (ت ١٧٩هـ)، والشّافِعيُّ لِلإمامِ مُحَمَّدِ بنِ إدريسَ الشّافِعيّ (ت ٢٠٤هـ)، والحَنبَليُّ لِلإمامِ أحمَدَ بنِ حَنبَل (ت ٢٤١هـ) — رَحِمَهُمُ اللهُ جَميعًا. وكانَ هؤلاءِ الأئِمّةُ مِن أعظَمِ عُلَماءِ تاريخِ الأُمّة، أهلَ عِلمٍ عَميقٍ وتَقوى وإخلاص، وقَفوا حَياتَهُم على فَهمِ دينِ اللهِ وخِدمَتِه.\n\nولم تَنشَأِ المَذاهِبُ الفِقهيّةُ مِن خِلافٍ في أُصولِ الدّين — فَمَسائِلُ العَقيدةِ وتَوحيدِ اللهِ وأركانِ الإسلامِ والإيمانِ والواجِباتِ والمُحَرَّماتِ الظّاهِرةِ مُتَّفَقٌ علَيها بَينَ الجَميع. بل نَشَأت في مَجالِ الأحكامِ التَّفصيليّةِ (الفُروع) عَبرَ الاجتِهادِ الشَّريف: بَذلِ العالِمِ المُؤَهَّلِ غايةَ وُسعِهِ في استِنباطِ الحُكمِ مِنَ الدَّليل. فَبَعدَ عَصرِ النَّبِيِّ ﷺ والصَّحابة، ولَمّا انتَشَرَ الإسلامُ في بِلادٍ واسِعة، وطَرَأت نَوازِلُ ومَسائِلُ لا نَصَّ صَريحًا فيها مُباشَرةً، أعمَلَ العُلَماءُ الكِبارُ عِلمَهُمُ العَميقَ في استِنباطِ الأحكامِ مِنَ القُرآنِ والسُّنّةِ ومَبادِئِ الدّين. والقُرآنُ نَفسُهُ يُوَجِّهُ المُؤمِنينَ إلى أهلِ العِلم: ﴿فاسألوا أهلَ الذِّكرِ إن كُنتُم لا تَعلَمون﴾ (النحل ٤٣). وعَبرَ هذا الاجتِهادِ المُؤَهَّل، الذي قامَ بِهِ أعلَمُ العُلَماءِ وأتقاهُم، تَطَوَّرَتِ المَذاهِبُ الفِقهيّةُ مَناهِجَ مُنَظَّمةً دَقيقةً لِفَهمِ الإسلامِ وتَطبيقِهِ في كُلِّ زَمانٍ ومَكان.\n\nوالخِلافُ المُعتَبَرُ بَينَ العُلَماءِ في المَسائِلِ التَّفصيليّةِ نَتيجةٌ طَبيعيّةٌ بل نافِعةٌ لِهذا المَسار، وقد وُجِدَ في الأُمّةِ دائِمًا، بَدءًا مِنَ الصَّحابةِ أنفُسِهِم. ويَقَعُ هذا الخِلافُ لِأسبابٍ مُعتَبَرة: فَقد لا يَبلُغُ عالِمًا حَديثٌ بَلَغَ غَيرَه؛ أو يَفهَمُ عالِمانِ النَّصَّ نَفسَهُ فَهمَينِ مُختَلِفَين؛ أو يَحتَمِلُ النَّصُّ أكثَرَ مِن مَعنى؛ أو يُرَجِّحُ العُلَماءُ بَينَ الأدِلّةِ ويَجمَعونَ بَينَها بِطُرُقٍ مُختَلِفة. وحينَ يَأتي هذا الخِلافُ مِن عُلَماءَ مُخلِصينَ مُؤَهَّلينَ يَطلُبونَ الحَقَّ مِنَ المَصادِرِ المُنَزَّلةِ نَفسِها، فَلَيسَ مَوضِعَ ذَمٍّ ولا فُرقةٍ ولا نِزاع. بل وَصَفَ العُلَماءُ هذا النَّوعَ مِنَ الاختِلافِ بِأنَّهُ رَحمةٌ وسَعةٌ لِلأُمّة، يُقَدِّمُ خَياراتٍ مُعتَبَرةً وعِلمًا غَزيرًا يُتيحُ تَطبيقَ الإسلامِ بِحِكمةٍ في الأحوالِ المُختَلِفة. بل أشارَ النَّبِيُّ ﷺ إلى شَرَفِ الاجتِهادِ المُخلِص: «إذا حَكَمَ الحاكِمُ فاجتَهَدَ ثُمَّ أصابَ فَلَهُ أجران، وإذا حَكَمَ فاجتَهَدَ ثُمَّ أخطَأَ فَلَهُ أجرٌ» (البخاري ومسلم) — فالعالِمُ المُخلِصُ المُجتَهِدُ مَأجورٌ ولَو أخطَأ. وفي القِسمِ التّالي نَتَناوَلُ الأُصولَ المُشتَرَكةَ لِلمَذاهِبِ والمَوقِفَ الصَّحيحَ الذي يَنبَغي لِكُلِّ مُسلِمٍ تُجاهَها.",
      },
    },
    {
      title: { en: "Shared foundations and the right attitude", ar: "الأُصولُ المُشتَرَكةُ والمَوقِفُ الصَّحيح" },
      learningObjectives: [
        { en: "List the agreed sources the schools draw from.", ar: "أُعَدِّدُ المَصادِرَ المُتَّفَقَ علَيها لِلمَذاهِب." },
        { en: "Describe the correct, respectful attitude toward the madhahib.", ar: "أصِفُ المَوقِفَ الصَّحيحَ المُحتَرِمَ تُجاهَ المَذاهِب." },
      ],
      image: {
        src: IMG.greenValley,
        alt: { en: "Many paths through one valley — schools serving one religion.", ar: "طُرُقٌ في وادٍ واحِد — مَذاهِبُ تَخدِمُ دينًا واحِدًا." },
        caption: { en: "All the schools draw from the Qur'an and the Sunnah.", ar: "تَستَقي المَذاهِبُ كُلُّها مِنَ القُرآنِ والسُّنّة." },
      },
      groupTasks: {
        title: { en: "One religion, organised understanding", ar: "دينٌ واحِد، فَهمٌ مُنَظَّم" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "shared-sources",
            name: { en: "Team A — Shared sources", ar: "الفَريقُ أ — المَصادِرُ المُشتَرَكة" },
            learningObjective: { en: "Present the agreed sources of all the schools.", ar: "نَعرِضُ المَصادِرَ المُتَّفَقَ علَيها لِلمَذاهِب." },
            task: { en: "Present the foundations that all four schools share. The two primary, agreed sources are the Qur'an and the authentic Sunnah; then the consensus of the scholars (ijma') and analogy (qiyas), which the majority accept. Show that the schools differ mainly in the details of method — how they weigh certain evidences or apply secondary principles — but they all build on the same revealed foundations and all seek to obey Allah and His Messenger ﷺ. Present a 'shared foundations of the schools' diagram.", ar: "اعرِضوا الأُصولَ التي تَشتَرِكُ فيها المَذاهِبُ الأربَعة. المَصدَرانِ الأوَّلانِ المُتَّفَقُ علَيهِما القُرآنُ والسُّنّةُ الصَّحيحة؛ ثُمَّ إجماعُ العُلَماءِ والقِياس، اللَّذانِ يَقبَلُهُما الجُمهور. بَيِّنوا أنَّ المَذاهِبَ تَختَلِفُ أساسًا في تَفاصيلِ المَنهَج — في تَرجيحِ بَعضِ الأدِلّةِ أو تَطبيقِ الأُصولِ الفَرعيّة — لكِنَّها كُلَّها تَبني على المَصادِرِ المُنَزَّلةِ نَفسِها، وكُلَّها تَطلُبُ طاعةَ اللهِ ورَسولِهِ ﷺ. اعرِضوا مُخَطَّطَ «الأُصولِ المُشتَرَكةِ لِلمَذاهِب»." },
            evidence: [
              { en: "Qur'an and Sunnah are the agreed primary sources; then ijma' and qiyas.", ar: "القُرآنُ والسُّنّةُ المَصدَرانِ المُتَّفَقُ علَيهِما؛ ثُمَّ الإجماعُ والقِياس." },
            ],
            sourceNotes: [
              { en: "The schools serve one religion, not rival religions.", ar: "المَذاهِبُ تَخدِمُ دينًا واحِدًا، لا أديانًا مُتَنافِسة." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'shared foundations' diagram.", ar: "مُخَطَّطُ «الأُصولِ المُشتَرَكة»." },
          },
          {
            slug: "right-attitude-madhahib",
            name: { en: "Team B — The right attitude", ar: "الفَريقُ ب — المَوقِفُ الصَّحيح" },
            learningObjective: { en: "Present how a Muslim should regard the schools.", ar: "نَعرِضُ كَيفَ يَنبَغي لِلمُسلِمِ أن يَنظُرَ لِلمَذاهِب." },
            task: { en: "Present the correct, balanced attitude a Muslim should have toward the schools of fiqh: deep respect and love for all four imams and their scholarship; recognising that legitimate differences in detail are a mercy, not a cause for fighting; that an ordinary Muslim who lacks the tools of ijtihad follows qualified scholars and may follow a recognised school; that no one should be fanatical for one imam against another, nor mock or belittle any of them; and that the goal of all the schools is the same — to obey Allah and follow the Prophet ﷺ. Warn against the two errors of blind fanaticism and of disrespecting the great scholars. Present a 'respecting the imams' charter.", ar: "اعرِضوا المَوقِفَ الصَّحيحَ المُتَوازِنَ الذي يَنبَغي لِلمُسلِمِ تُجاهَ المَذاهِب: احتِرامٌ عَميقٌ ومَحَبّةٌ لِلأئِمّةِ الأربَعةِ وعِلمِهِم؛ وإدراكُ أنَّ الخِلافَ المُعتَبَرَ في الفُروعِ رَحمةٌ لا مَدعاةَ لِلخِصام؛ وأنَّ العاميَّ الذي لا يَملِكُ أدَواتِ الاجتِهادِ يُقَلِّدُ العُلَماءَ المُؤَهَّلينَ وقد يَتَّبِعُ مَذهَبًا مُعتَبَرًا؛ وألّا يَتَعَصَّبَ أحَدٌ لِإمامٍ ضِدَّ آخَر، ولا يَسخَرَ مِن أحَدِهِم أو يُحَقِّرَه؛ وأنَّ غايةَ المَذاهِبِ كُلِّها واحِدة — طاعةُ اللهِ واتِّباعُ النَّبِيِّ ﷺ. حَذِّروا مِن خَطَأَيِ التَّعَصُّبِ الأعمى وعَدَمِ احتِرامِ العُلَماءِ الكِبار. اعرِضوا ميثاقَ «احتِرامِ الأئِمّة»." },
            evidence: [
              { en: "'When a judge strives and is right he has two rewards; if wrong, one' (Bukhari, Muslim).", ar: "«إذا اجتَهَدَ الحاكِمُ فَأصابَ فَلَهُ أجران، وإن أخطَأَ فَلَهُ أجر» (البخاري ومسلم)." },
            ],
            sourceNotes: [
              { en: "Respect all the imams; reject fanaticism and disrespect alike.", ar: "احتَرِم الأئِمّةَ جَميعًا؛ وارفُضِ التَّعَصُّبَ والتَّحقيرَ مَعًا." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'respecting the imams' charter.", ar: "ميثاقُ «احتِرامِ الأئِمّة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Unity in essentials, mercy in details", ar: "وَحدةٌ في الأُصول، رَحمةٌ في الفُروع" },
        prompt: { en: "The four schools of fiqh all draw from the same Qur'an and Sunnah, agree on the essentials, and differ only in some details — a difference the scholars called a mercy. Reflect: how should this shape the way you treat fellow Muslims who follow a different valid opinion or school? Do you argue and divide over minor matters, or do you respect the scholars, hold firmly to the essentials, and show breadth in the details? Write about one way you will uphold respect for the scholars and unity with other Muslims while seeking knowledge of your religion.", ar: "المَذاهِبُ الأربَعةُ تَستَقي كُلُّها مِنَ القُرآنِ والسُّنّةِ أنفُسِهِما، وتَتَّفِقُ في الأُصول، ولا تَختَلِفُ إلّا في بَعضِ الفُروع — خِلافٌ سَمّاهُ العُلَماءُ رَحمة. تَأمَّل: كَيفَ يَنبَغي أن يَصوغَ هذا طَريقةَ تَعامُلِكَ معَ إخوَتِكَ المُسلِمينَ مِمَّن يَتَّبِعُ رَأيًا مُعتَبَرًا أو مَذهَبًا آخَر؟ أتُجادِلُ وتَفتَرِقُ في صِغارِ المَسائِل، أم تَحتَرِمُ العُلَماء، وتَتَمَسَّكُ بِالأُصول، وتَتَّسِعُ في الفُروع؟ اكتُب طَريقةً واحِدةً سَتَصونُ بِها احتِرامَ العُلَماءِ والوَحدةَ معَ المُسلِمينَ وأنتَ تَطلُبُ عِلمَ دينِك." },
        placeholder: { en: "I will respect the scholars by... I will avoid dividing over details by... I will seek knowledge by...", ar: "سَأحتَرِمُ العُلَماءَ بِـ... وسَأتَجَنَّبُ الفُرقةَ في الفُروعِ بِـ... وسَأطلُبُ العِلمَ بِـ..." },
      },
      body: {
        en: "Although the schools of jurisprudence differ in some details of rulings, they are united upon the same foundations, and understanding this shared basis is essential to seeing the schools rightly. All the recognised Sunni schools draw their rulings from the same revealed sources, in the same order of authority. The first and highest source is the Qur'an, the Book of Allah, the foundation of all rulings. The second is the authentic Sunnah of the Prophet ﷺ, which explains, details, and complements the Qur'an, for Allah commanded obedience to His Messenger alongside obedience to Himself: 'O you who have believed, obey Allah and obey the Messenger and those in authority among you' (An-Nisa 59). Beyond these two primary, agreed sources, the majority of the schools also accept the consensus of the qualified scholars (ijma') and reasoning by analogy (qiyas) — applying the ruling of a case mentioned in the texts to a similar new case that shares the same underlying cause. The schools may give differing weight to certain secondary principles, but they all build upon the Qur'an and Sunnah as their foundation, and they all share the single goal of understanding and obeying the command of Allah and following His Messenger ﷺ. The schools are therefore not competing religions or sects, but organised, scholarly methods for understanding one religion.\n\nGiven this, the correct attitude a Muslim should have toward the schools of jurisprudence is one of respect, balance, and wisdom, steering clear of two opposite errors. The first error is blind fanaticism (ta'assub) for one school or imam against the others — insisting that one's own school alone is correct, belittling or attacking the others, and turning legitimate scholarly differences into a cause of division, argument, and enmity among Muslims. This contradicts the spirit of the imams themselves, who were humble, respected one another, and openly acknowledged that the truth might lie with another. Imam Ash-Shafi'i famously said that his opinion is right with the possibility of being wrong, and another's opinion is wrong with the possibility of being right. The four imams never called people to themselves; they called people to follow the evidence and to follow the Prophet ﷺ. The second error is the opposite extreme: disrespecting, mocking, or belittling the great imams and the schools of fiqh, dismissing the immense scholarship of the Ummah, or imagining that an unqualified person can simply set aside all the scholars and derive rulings directly without the necessary knowledge and tools. Both fanaticism and disrespect are blameworthy.\n\nThe balanced way is this: the Muslim holds deep love and respect for all four imams and the scholars of the Ummah, recognising them as among the greatest servants of this religion; he understands that their differences in matters of detail are a mercy and a breadth, not a defect or a cause for fighting; and he holds firmly together with all Muslims upon the agreed essentials of the faith. As for following rulings in practice, the ordinary Muslim who does not possess the deep knowledge and tools required for ijtihad is not left to his own opinion; rather, he asks and follows the qualified scholars, as Allah commanded: 'So ask the people of knowledge if you do not know' (An-Nahl 43), and he may follow one of the recognised schools as a reliable, organised path to understanding and applying his religion. The student of knowledge, as he grows, learns to understand the evidences and the reasoning of the scholars with humility and respect. In all of this, the goal is never to glorify a particular imam for his own sake, but to obey Allah and follow His Messenger ﷺ as faithfully as possible — which is the very purpose for which all the schools of jurisprudence were developed. For the young Muslim today, this teaching brings a precious lesson in unity and humility: to honour the great scholars of Islam, to seek knowledge of his religion through them, to hold firmly to the essentials that unite all Muslims, and to show breadth, respect, and brotherhood in the matters of legitimate difference — never allowing the rich diversity of Islamic scholarship to become a cause of division in the one Ummah of Muhammad ﷺ.",
        ar: "معَ أنَّ المَذاهِبَ الفِقهيّةَ تَختَلِفُ في بَعضِ تَفاصيلِ الأحكام، فَإنَّها مُتَّحِدةٌ على الأُصولِ نَفسِها، وفَهمُ هذا الأساسِ المُشتَرَكِ ضَروريٌّ لِرُؤيةِ المَذاهِبِ رُؤيةً صَحيحة. فَكُلُّ المَذاهِبِ السُّنّيّةِ المُعتَبَرةِ تَستَقي أحكامَها مِنَ المَصادِرِ المُنَزَّلةِ نَفسِها، بِالتَّرتيبِ نَفسِهِ في الحُجّيّة. فالمَصدَرُ الأوَّلُ الأعلى القُرآنُ، كِتابُ اللهِ، أساسُ الأحكامِ كُلِّها. والثّاني السُّنّةُ النَّبَويّةُ الصَّحيحة، التي تُبَيِّنُ القُرآنَ وتُفَصِّلُهُ وتُكَمِّلُه، فَقد أمَرَ اللهُ بِطاعةِ رَسولِهِ معَ طاعَتِه: ﴿يا أيُّها الذينَ آمَنوا أطيعوا اللهَ وأطيعوا الرَّسولَ وأُولي الأمرِ مِنكُم﴾ (النساء ٥٩). وفَوقَ هذَينِ المَصدَرَينِ الأوَّلَينِ المُتَّفَقِ علَيهِما، يَقبَلُ جُمهورُ المَذاهِبِ أيضًا إجماعَ العُلَماءِ المُؤَهَّلينَ والقِياس — وهو إلحاقُ مَسألةٍ جَديدةٍ مُشابِهةٍ بِمَسألةٍ مَنصوصةٍ تُشارِكُها العِلّةَ نَفسَها. وقد تُعطي المَذاهِبُ بَعضَ الأُصولِ الفَرعيّةِ أوزانًا مُختَلِفة، لكِنَّها كُلَّها تَبني على القُرآنِ والسُّنّةِ أساسًا، وتَشتَرِكُ في غايةٍ واحِدة: فَهمِ أمرِ اللهِ وطاعَتِهِ واتِّباعِ رَسولِهِ ﷺ. فالمَذاهِبُ إذًا لَيسَت أديانًا أو فِرَقًا مُتَنافِسة، بل مَناهِجُ عِلميّةٌ مُنَظَّمةٌ لِفَهمِ دينٍ واحِد.\n\nوبِناءً على ذلك، فالمَوقِفُ الصَّحيحُ الذي يَنبَغي لِلمُسلِمِ تُجاهَ المَذاهِبِ مَوقِفُ احتِرامٍ وتَوازُنٍ وحِكمة، يَتَجَنَّبُ خَطَأَينِ مُتَقابِلَين. الخَطأُ الأوَّلُ التَّعَصُّبُ الأعمى لِمَذهَبٍ أو إمامٍ ضِدَّ غَيرِه — الإصرارُ على أنَّ مَذهَبَهُ وَحدَهُ الصَّواب، وتَحقيرُ غَيرِهِ أوِ الطَّعنُ فيه، وتَحويلُ الخِلافِ العِلميِّ المُعتَبَرِ إلى سَبَبِ فُرقةٍ وجِدالٍ وعَداوةٍ بَينَ المُسلِمين. وهذا يُناقِضُ رُوحَ الأئِمّةِ أنفُسِهِم، فَقد كانوا مُتَواضِعين، يَحتَرِمُ بَعضُهُم بَعضًا، ويُقِرّونَ صَراحةً بِأنَّ الحَقَّ قد يَكونُ معَ غَيرِهِم. وقَولُ الشّافِعيِّ مَشهور: رَأيي صَوابٌ يَحتَمِلُ الخَطأ، ورَأيُ غَيري خَطأٌ يَحتَمِلُ الصَّواب. ولم يَدْعُ الأئِمّةُ الأربَعةُ النّاسَ إلى أنفُسِهِم قَطّ؛ بل دَعَوهُم إلى اتِّباعِ الدَّليلِ واتِّباعِ النَّبِيِّ ﷺ. والخَطأُ الثّاني النَّقيضُ: عَدَمُ احتِرامِ الأئِمّةِ الكِبارِ والمَذاهِبِ أوِ السُّخريةُ مِنهُم أو تَحقيرُهُم، أوِ الاستِهانةُ بِعِلمِ الأُمّةِ الهائِل، أو تَوَهُّمُ أنَّ غَيرَ المُؤَهَّلِ يُمكِنُهُ أن يُلغيَ العُلَماءَ ويَستَنبِطَ الأحكامَ مُباشَرةً بِلا عِلمٍ ولا أدَوات. وكِلا التَّعَصُّبِ والتَّحقيرِ مَذمومٌ.\n\nوالطَّريقُ المُتَوازِنُ هو: أن يَحمِلَ المُسلِمُ مَحَبّةً واحتِرامًا عَميقَينِ لِلأئِمّةِ الأربَعةِ وعُلَماءِ الأُمّة، يَعُدُّهُم مِن أعظَمِ خَدَمةِ هذا الدّين؛ وأن يَفهَمَ أنَّ خِلافَهُم في الفُروعِ رَحمةٌ وسَعةٌ لا عَيبٌ ولا مَدعاةُ خِصام؛ وأن يَتَماسَكَ معَ المُسلِمينَ جَميعًا على أُصولِ الدّينِ المُتَّفَقِ علَيها. وأمّا في تَطبيقِ الأحكام، فالعاميُّ الذي لا يَملِكُ العِلمَ العَميقَ وأدَواتِ الاجتِهادِ لا يُترَكُ لِرَأيِه؛ بل يَسألُ العُلَماءَ المُؤَهَّلينَ ويَتَّبِعُهُم، كَما أمَرَ الله: ﴿فاسألوا أهلَ الذِّكرِ إن كُنتُم لا تَعلَمون﴾ (النحل ٤٣)، وقد يَتَّبِعُ أحَدَ المَذاهِبِ المُعتَبَرةِ سَبيلًا مَوثوقًا مُنَظَّمًا لِفَهمِ دينِهِ وتَطبيقِه. وطالِبُ العِلم، إذ يَنمو، يَتَعَلَّمُ فَهمَ الأدِلّةِ وأنظارِ العُلَماءِ بِتَواضُعٍ واحتِرام. وفي ذلك كُلِّهِ لَيسَتِ الغايةُ تَعظيمَ إمامٍ بِعَينِهِ لِذاتِه، بل طاعةُ اللهِ واتِّباعُ رَسولِهِ ﷺ على أكمَلِ وَجهٍ مُمكِن — وهي عَينُ الغايةِ التي نَشَأت لِأجلِها المَذاهِبُ الفِقهيّةُ كُلُّها. ولِلشّابِّ المُسلِمِ اليَومَ في هذا دَرسٌ نَفيسٌ في الوَحدةِ والتَّواضُع: أن يُكرِمَ عُلَماءَ الإسلامِ الكِبار، ويَطلُبَ عِلمَ دينِهِ عَبرَهُم، ويَتَمَسَّكَ بِالأُصولِ التي تَجمَعُ المُسلِمينَ جَميعًا، ويَتَّسِعَ ويَحتَرِمَ ويُؤاخيَ في مَسائِلِ الخِلافِ المُعتَبَر — فَلا يَدَعَ ثَراءَ العِلمِ الإسلاميِّ يَصيرُ سَبَبَ فُرقةٍ في أُمّةِ مُحَمَّدٍ ﷺ الواحِدة.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is a madhhab?", ar: "ما المَذهَب؟" },
      options: [
        { en: "A school of legal thought built on an imam's method of deriving rulings", ar: "مَدرَسةٌ فِقهيّةٌ على مَنهَجِ إمامٍ في استِنباطِ الأحكام" },
        { en: "A separate religion", ar: "دينٌ مُستَقِلّ" },
        { en: "A type of prayer", ar: "نَوعُ صَلاة" },
        { en: "A mosque", ar: "مَسجِد" },
      ],
      correctIndex: 0,
      explanation: { en: "A school of fiqh built on a mujtahid imam's method.", ar: "مَدرَسةُ فِقهٍ على مَنهَجِ إمامٍ مُجتَهِد." },
    },
    {
      prompt: { en: "Who are the four famous Sunni imams of fiqh?", ar: "مَنِ الأئِمّةُ الأربَعةُ المَشهورونَ في الفِقه؟" },
      options: [
        { en: "Abu Hanifa, Malik, Ash-Shafi'i, Ahmad ibn Hanbal", ar: "أبو حَنيفة، ومالِك، والشّافِعيّ، وأحمَد بنُ حَنبَل" },
        { en: "Bukhari, Muslim, Tirmidhi, Abu Dawud", ar: "البخاري، ومسلم، والترمذي، وأبو داود" },
        { en: "The four caliphs", ar: "الخُلَفاءُ الأربَعة" },
        { en: "The four angels", ar: "المَلائِكةُ الأربَعة" },
      ],
      correctIndex: 0,
      explanation: { en: "The founders of the four schools of jurisprudence.", ar: "أصحابُ المَذاهِبِ الفِقهيّةِ الأربَعة." },
    },
    {
      prompt: { en: "In what realm do the schools mainly differ?", ar: "في أيِّ مَجالٍ تَختَلِفُ المَذاهِبُ أساسًا؟" },
      options: [
        { en: "Detailed rulings (furu'), not the fundamentals", ar: "الأحكامِ التَّفصيليّةِ (الفُروع)، لا الأُصول" },
        { en: "The oneness of Allah", ar: "تَوحيدِ الله" },
        { en: "The pillars of Islam", ar: "أركانِ الإسلام" },
        { en: "Whether to pray at all", ar: "أصلِ الصَّلاة" },
      ],
      correctIndex: 0,
      explanation: { en: "They agree on essentials; they differ in details via ijtihad.", ar: "يَتَّفِقونَ في الأُصولِ ويَختَلِفونَ في الفُروعِ بِالاجتِهاد." },
    },
    {
      prompt: { en: "What are the two primary, agreed sources of all the schools?", ar: "ما المَصدَرانِ الأوَّلانِ المُتَّفَقُ علَيهِما لِلمَذاهِب؟" },
      options: [
        { en: "The Qur'an and the authentic Sunnah", ar: "القُرآنُ والسُّنّةُ الصَّحيحة" },
        { en: "Custom and opinion", ar: "العُرفُ والرَّأي" },
        { en: "Poetry and history", ar: "الشِّعرُ والتّاريخ" },
        { en: "Dreams", ar: "الأحلام" },
      ],
      correctIndex: 0,
      explanation: { en: "Then ijma' and qiyas as accepted by the majority.", ar: "ثُمَّ الإجماعُ والقِياسُ عِندَ الجُمهور." },
    },
    {
      prompt: { en: "What is the right attitude toward the four imams?", ar: "ما المَوقِفُ الصَّحيحُ تُجاهَ الأئِمّةِ الأربَعة؟" },
      options: [
        { en: "Respect all of them; avoid both fanaticism and disrespect", ar: "احتِرامُهُم جَميعًا؛ وتَجَنُّبُ التَّعَصُّبِ والتَّحقيرِ مَعًا" },
        { en: "Follow one and curse the rest", ar: "اتِّباعُ واحِدٍ ولَعنُ الباقين" },
        { en: "Mock all of them", ar: "السُّخريةُ مِنهُم جَميعًا" },
        { en: "Ignore the scholars", ar: "إهمالُ العُلَماء" },
      ],
      correctIndex: 0,
      explanation: { en: "Their differences are a mercy; honour them all.", ar: "خِلافُهُم رَحمة؛ فاحتَرِمهُم جَميعًا." },
    },
    {
      prompt: { en: "True or False: Sincere scholarly difference in details was called a mercy by the scholars.", ar: "صَوابٌ أم خَطأ: سَمّى العُلَماءُ الخِلافَ العِلميَّ المُخلِصَ في الفُروعِ رَحمة." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "It provides valid options and richness for the Ummah.", ar: "يُقَدِّمُ خَياراتٍ مُعتَبَرةً وسَعةً لِلأُمّة." },
    },
  ],
};
