import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const differencesAmongJurists: CourseLesson = {
  slug: "g10y11-differences-among-jurists",
  name: { en: "Differences Among Jurists", ar: "اختِلافُ الفُقَهاء" },
  shortIntro: {
    en: "Why do the great scholars of fiqh sometimes differ in their rulings? This lesson studies the causes of legitimate scholarly difference (ikhtilaf), the etiquette of dealing with it, the mercy and breadth it can bring, and how a Muslim should treat differences of opinion with knowledge, respect, and unity.",
    ar: "لِمَ يَختَلِفُ كِبارُ الفُقَهاءِ أحيانًا في أحكامِهِم؟ يَدرُسُ هذا الدَّرسُ أسبابَ الاختِلافِ الفِقهيِّ المُعتَبَر، وأدَبَ التَّعامُلِ مَعَه، وما فيهِ مِن رَحمةٍ وسَعة، وكَيفَ يَنبَغي لِلمُسلِمِ أن يَتَعامَلَ معَ الخِلافِ بِعِلمٍ واحتِرامٍ ووَحدة.",
  },
  quranSurahs: ["An-Nisa 59", "Al-Anbiya 79"],
  sections: [
    {
      title: { en: "Why scholars differ — the causes of ikhtilaf", ar: "لِمَ يَختَلِفُ العُلَماء — أسبابُ الاختِلاف" },
      learningObjectives: [
        { en: "Distinguish blameworthy from acceptable difference.", ar: "أُمَيِّزُ الخِلافَ المَذمومَ مِنَ المَقبول." },
        { en: "Identify the main causes of legitimate fiqh difference.", ar: "أُحَدِّدُ أسبابَ الاختِلافِ الفِقهيِّ المُعتَبَر." },
      ],
      successCriteria: [
        { en: "I can explain why differences in furu' (branches) arise.", ar: "أشرَحُ سَبَبَ الاختِلافِ في الفُروع." },
        { en: "I can distinguish usul (foundations) from furu' (branches).", ar: "أُمَيِّزُ الأُصولَ مِنَ الفُروع." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Shelves of books — the rich heritage of Islamic jurisprudence.", ar: "رُفوفُ كُتُب — تُراثُ الفِقهِ الإسلاميِّ الغَنيّ." },
        caption: { en: "'If you disagree over anything, refer it to Allah and the Messenger' (An-Nisa 59).", ar: "﴿فَإن تَنازَعتُم في شَيءٍ فَرُدّوهُ إلى اللهِ والرَّسول﴾ (النساء ٥٩)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Is difference of opinion always a bad thing?", ar: "أالاختِلافُ دائِمًا أمرٌ سَيِّئ؟" },
        body: {
          en: "Some imagine that any difference among scholars is a flaw or a sign of confusion in Islam. But the four great imams differed in many rulings while all worshipping the same Allah, following the same Qur'an and Sunnah, and respecting one another. Reflect: how can sincere scholars, all seeking the truth from the same sources, arrive at different conclusions — and why might this difference in the branches of fiqh actually be a mercy and breadth for the Ummah, not a defect?",
          ar: "يَظُنُّ بَعضُهُم أنَّ أيَّ اختِلافٍ بَينَ العُلَماءِ عَيبٌ أو دَليلُ اضطِرابٍ في الإسلام. لكِنَّ الأئمّةَ الأربعةَ اختَلَفوا في أحكامٍ كَثيرةٍ وهُم جَميعًا يَعبُدونَ اللهَ نَفسَهُ، ويَتبَعونَ القُرآنَ والسُّنّةَ نَفسَها، ويَحتَرِمُ بَعضُهُم بَعضًا. تَأمَّل: كَيفَ يَصِلُ عُلَماءُ صادِقونَ، كُلُّهُم يَبتَغي الحَقَّ مِنَ المَصادِرِ نَفسِها، إلى نَتائِجَ مُختَلِفة — ولِمَ قد يَكونُ هذا الاختِلافُ في فُروعِ الفِقهِ رَحمةً وسَعةً لِلأُمّةِ لا عَيبًا؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key distinction", ar: "تَمييزٌ مُهِمّ" },
          lines: [
            { en: "Usul (أُصول): foundations of faith — no legitimate difference (e.g. tawhid).", ar: "الأُصول: ثَوابِتُ الدّين — لا خِلافَ مُعتَبَرَ فيها (كَالتَّوحيد)." },
            { en: "Furu' (فُروع): detailed branches of fiqh — where scholarly ijtihad may differ.", ar: "الفُروع: مَسائِلُ الفِقهِ التَّفصيليّة — مَوضِعُ الاجتِهادِ والاختِلاف." },
          ],
        },
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Ijtihad (اجتِهاد): a qualified scholar's effort to derive a ruling from the sources.", ar: "الاجتِهاد: بَذلُ العالِمِ المُؤَهَّلِ وُسعَهُ لاستِنباطِ الحُكمِ مِنَ المَصادِر." },
          ],
        },
      ],
      body: {
        en: "One of the realities of Islamic scholarship that every educated Muslim should understand is that the great jurists (fuqaha') sometimes differed in their rulings on detailed matters of law — and that such difference, when it arises from sincere scholarship, is a natural, legitimate, and even beneficial feature of the religion, not a defect in it. To understand this correctly, we must first make a crucial distinction between two categories. The first is the usul (foundations) — the fundamental, definitive matters of belief and religion that are established by clear, decisive texts and on which there is no legitimate room for difference: the oneness of Allah (tawhid), the prophethood of Muhammad ﷺ, the obligation of the five daily prayers, the prohibition of major sins like shirk, and so on. On these foundations, the Ummah is united, and difference here is not the acceptable scholarly difference but error or deviation. The second category is the furu' (branches) — the detailed, secondary questions of fiqh where the texts may be open to more than one valid understanding, or where there is no explicit text and the ruling must be derived through ijtihad. It is in this second realm that the legitimate differences among the jurists occur.\n\nWhy, then, do sincere and learned scholars, all drawing from the same Qur'an and Sunnah, sometimes arrive at different conclusions on these detailed matters? The scholars have explained several genuine causes of acceptable difference (ikhtilaf). One cause is the wording of the texts themselves: some Arabic words carry more than one valid meaning, and a verse or hadith may legitimately be understood in different ways. A second cause relates to the hadith: a particular hadith may have reached one scholar but not another, so one ruled based on a text the other had not received; or scholars may differ over whether a particular narration is authentic and strong enough to act upon. A third cause is the apparent conflict between two texts, where scholars differ over how to reconcile them or which takes precedence. A fourth cause concerns the methods of deriving rulings: scholars differed over the weight given to certain secondary sources and tools of reasoning — such as analogy (qiyas), the practice of the people of Madinah, juristic preference, and considerations of public interest — leading to different conclusions on the same question. A fifth cause is the differing understanding of the reason ('illah) behind a ruling, and how widely it should be applied. All of these are causes rooted in sincere, qualified scholarship and the honest effort to reach the truth — not in whim, ignorance, or bias.\n\nIt is essential to understand that this kind of difference is not the blameworthy division that Islam condemns. Allah warns against splitting the religion into sects and against the kind of contention that destroys unity and stems from arrogance and following desires: 'And do not be like the ones who became divided and differed after the clear proofs had come to them' (Aal-Imran 105). This blameworthy difference is division in the foundations, sectarianism, and disputation driven by ego. But the difference of the qualified mujtahid scholars in the detailed branches of fiqh is of an entirely different nature: it is the difference of people who all submit to the same sources, all sincerely seek Allah's ruling, and all respect one another even while disagreeing. The Prophet ﷺ himself indicated that the sincere scholar who exercises ijtihad is rewarded even when he reaches the wrong conclusion: 'When a judge makes a ruling, striving to reach the correct decision, and is right, he has two rewards; and when he makes a ruling, striving to reach the correct decision, but is wrong, he has one reward' (Bukhari and Muslim). This noble hadith shows that sincere ijtihad is rewarded by Allah in both cases, which itself indicates that difference in these matters is anticipated and accommodated by the religion. In the next section, we will examine how this difference can be a mercy and breadth for the Ummah, and the beautiful etiquette with which the early scholars dealt with their differences — an etiquette we urgently need to revive today.",
        ar: "مِن حَقائِقِ العِلمِ الإسلاميِّ التي يَنبَغي لِكُلِّ مُسلِمٍ مُتَعَلِّمٍ أن يَفهَمَها أنَّ كِبارَ الفُقَهاءِ اختَلَفوا أحيانًا في أحكامِهِم في المَسائِلِ التَّفصيليّة — وأنَّ هذا الاختِلافَ، إذا نَشَأ مِن عِلمٍ صادِق، سِمةٌ طَبيعيّةٌ مُعتَبَرةٌ بل نافِعةٌ في الدّين، لا عَيبٌ فيه. ولِفَهمِ هذا فَهمًا صَحيحًا لا بُدَّ أوَّلًا مِن تَمييزٍ مُهِمٍّ بَينَ صِنفَين. الأوَّلُ الأُصول — قَطعيّاتُ العَقيدةِ والدّينِ الثّابِتةُ بِالنُّصوصِ الواضِحةِ الحاسِمةِ التي لا مَجالَ لِخِلافٍ مُعتَبَرٍ فيها: تَوحيدُ اللهِ، ونُبُوّةُ مُحَمَّدٍ ﷺ، ووُجوبُ الصَّلَواتِ الخَمس، وتَحريمُ كَبائِرَ كَالشِّرك، ونَحوُها. على هذه الأُصولِ تَجتَمِعُ الأُمّة، والخِلافُ فيها لَيسَ الخِلافَ المَقبولَ بل خَطَأٌ أو انحِراف. والصِّنفُ الثّاني الفُروع — المَسائِلُ الفِقهيّةُ التَّفصيليّةُ الفَرعيّةُ التي قد تَحتَمِلُ النُّصوصُ فيها أكثَرَ مِن فَهمٍ صَحيح، أو لا نَصَّ فيها صَريحٌ فَيُستَنبَطُ الحُكمُ بِالاجتِهاد. وفي هذا المَجالِ الثّاني تَقَعُ الاختِلافاتُ المُعتَبَرةُ بَينَ الفُقَهاء.\n\nفَلِمَ يَصِلُ عُلَماءُ صادِقونَ عالِمون، كُلُّهُم يَستَقي مِنَ القُرآنِ والسُّنّةِ نَفسِها، إلى نَتائِجَ مُختَلِفةٍ في هذه المَسائِلِ التَّفصيليّة؟ بَيَّنَ العُلَماءُ أسبابًا حَقيقيّةً عِدّةً لِلاختِلافِ المَقبول. مِنها لَفظُ النُّصوصِ نَفسِه: فَبَعضُ الألفاظِ العَرَبيّةِ تَحتَمِلُ أكثَرَ مِن مَعنًى صَحيح، وقد تُفهَمُ الآيةُ أوِ الحَديثُ على وُجوهٍ مُعتَبَرة. وسَبَبٌ ثانٍ يَتَّصِلُ بِالحَديث: فَقَد يَبلُغُ حَديثٌ عالِمًا دونَ آخَر، فَحَكَمَ هذا بِنَصٍّ لم يَبلُغِ الآخَر؛ أو يَختَلِفونَ في صِحّةِ روايةٍ وقُوَّتِها لِلعَمَلِ بِها. وسَبَبٌ ثالِثٌ تَعارُضُ نَصَّينِ في الظّاهِر، فَيَختَلِفونَ في كَيفيّةِ الجَمعِ بَينَهُما أو في المُقَدَّمِ مِنهُما. وسَبَبٌ رابِعٌ يَخُصُّ طُرُقَ الاستِنباط: فَقَد اختَلَفوا في حُجِّيّةِ بَعضِ المَصادِرِ والأدِلّةِ الفَرعيّةِ وأدَواتِ النَّظَر — كَالقِياسِ وعَمَلِ أهلِ المَدينةِ والاستِحسانِ والمَصلَحة — فَتَنَوَّعَتِ النَّتائِجُ في المَسألةِ الواحِدة. وسَبَبٌ خامِسٌ اختِلافُ الفَهمِ لِعِلّةِ الحُكمِ ومَدى تَعميمِها. وكُلُّ هذه أسبابٌ نابِعةٌ مِن عِلمٍ صادِقٍ مُؤَهَّلٍ واجتِهادٍ نَزيهٍ لِبُلوغِ الحَقّ — لا مِن هَوًى ولا جَهلٍ ولا تَعَصُّب.\n\nويَجِبُ أن نَفهَمَ أنَّ هذا النَّوعَ مِنَ الاختِلافِ لَيسَ الفُرقةَ المَذمومةَ التي يُنكِرُها الإسلام. فَيُحَذِّرُ اللهُ مِن تَفريقِ الدّينِ شِيَعًا ومِنَ التَّنازُعِ الذي يُفسِدُ الوَحدةَ ويَنبُعُ مِنَ الكِبرِ واتِّباعِ الهَوى: ﴿ولا تَكونوا كَالذينَ تَفَرَّقوا واختَلَفوا مِن بَعدِ ما جاءَهُمُ البَيِّنات﴾ (آل عمران ١٠٥). فَهذا الخِلافُ المَذمومُ فُرقةٌ في الأُصول، وتَحَزُّبٌ، ومُماراةٌ يَدفَعُها الكِبر. أمّا خِلافُ المُجتَهِدينَ المُؤَهَّلينَ في فُروعِ الفِقهِ التَّفصيليّةِ فَطَبيعَتُهُ مُختَلِفةٌ تَمامًا: خِلافُ قَومٍ كُلُّهُم يُذعِنُ لِلمَصادِرِ نَفسِها، وكُلُّهُم يَبتَغي حُكمَ اللهِ صادِقًا، وكُلُّهُم يَحتَرِمُ الآخَرَ معَ المُخالَفة. وقد أشارَ النَّبِيُّ ﷺ نَفسُهُ إلى أنَّ العالِمَ المُجتَهِدَ الصّادِقَ مَأجورٌ ولَو أخطَأ: «إذا حَكَمَ الحاكِمُ فاجتَهَدَ ثُمَّ أصابَ فَلَهُ أجران، وإذا حَكَمَ فاجتَهَدَ ثُمَّ أخطَأ فَلَهُ أجر» (البخاري ومسلم). فَهذا الحَديثُ الشَّريفُ يُبَيِّنُ أنَّ الاجتِهادَ الصّادِقَ مَأجورٌ عِندَ اللهِ في الحالَين، وهذا نَفسُهُ يَدُلُّ على أنَّ الخِلافَ في هذه المَسائِلِ مُتَوَقَّعٌ يَسَعُهُ الدّين. وفي القِسمِ التّالي نَتَناوَلُ كَيفَ يَكونُ هذا الخِلافُ رَحمةً وسَعةً لِلأُمّة، والأدَبَ الجَميلَ الذي تَعامَلَ بِهِ السَّلَفُ معَ خِلافِهِم — أدَبٌ نَحنُ في أمَسِّ الحاجةِ إلى إحيائِهِ اليَوم.",
      },
    },
    {
      title: { en: "Difference as mercy and the etiquette of disagreement", ar: "الخِلافُ رَحمةً وأدَبُ التَّعامُلِ مَعَه" },
      learningObjectives: [
        { en: "Explain how legitimate difference is a mercy and breadth.", ar: "أشرَحُ كَيفَ يَكونُ الخِلافُ المُعتَبَرُ رَحمةً وسَعة." },
        { en: "Apply the etiquette of dealing with difference.", ar: "أُطَبِّقُ أدَبَ التَّعامُلِ معَ الخِلاف." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A grand mosque — the Ummah united in faith despite differences in branches.", ar: "مَسجِدٌ جامِع — أُمّةٌ مُوَحَّدةٌ في الإيمانِ معَ الخِلافِ في الفُروع." },
        caption: { en: "United on foundations, broad-hearted in the branches.", ar: "اتِّحادٌ في الأُصول، وسَعةٌ في الفُروع." },
      },
      groupTasks: {
        title: { en: "Dealing with difference wisely", ar: "التَّعامُلُ معَ الخِلافِ بِحِكمة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "mercy-and-breadth",
            name: { en: "Team A — Mercy and breadth", ar: "الفَريقُ أ — الرَّحمةُ والسَّعة" },
            learningObjective: { en: "Present how legitimate difference benefits the Ummah.", ar: "نَعرِضُ كَيفَ يَنفَعُ الخِلافُ المُعتَبَرُ الأُمّة." },
            task: { en: "Present how legitimate difference in the branches is a mercy and breadth. Show that it gives flexibility for different circumstances, places, and times; that it preserves a rich treasury of scholarship to draw upon; that following any of the recognised madhhabs is valid since each is built on the Qur'an and Sunnah; and that it trains the mind in evidence and reasoning. Give a real example of a branch issue on which the imams differed (e.g. details of how to hold the hands in prayer, or saying Bismillah aloud) — showing that all the positions are within the bounds of valid difference and none breaks the unity of the Ummah. Present a 'mercy in difference' display.", ar: "اعرِضوا كَيفَ يَكونُ الخِلافُ المُعتَبَرُ في الفُروعِ رَحمةً وسَعة. بَيِّنوا أنَّهُ يُعطي مُرونةً لِظُروفٍ وأماكِنَ وأزمِنةٍ مُختَلِفة؛ ويَحفَظُ ثَروةً عِلميّةً غَنيّةً يُرجَعُ إلَيها؛ وأنَّ اتِّباعَ أيِّ مَذهَبٍ مُعتَبَرٍ صَحيحٌ إذ كُلٌّ مَبنيٌّ على القُرآنِ والسُّنّة؛ ويُدَرِّبُ العَقلَ على الدَّليلِ والنَّظَر. اضرِبوا مِثالًا حَقيقيًّا لِمَسألةٍ فَرعيّةٍ اختَلَفَ فيها الأئمّة (كَتَفاصيلِ وَضعِ اليَدَينِ في الصَّلاة، أو الجَهرِ بِالبَسمَلة) — مُبَيِّنينَ أنَّ الأقوالَ كُلَّها ضِمنَ الخِلافِ المُعتَبَرِ ولا يَكسِرُ شَيءٌ مِنها وَحدةَ الأُمّة. اعرِضوا لَوحةَ «رَحمةٌ في الاختِلاف»." },
            evidence: [
              { en: "The sincere mujtahid is rewarded even if wrong (Bukhari, Muslim).", ar: "المُجتَهِدُ الصّادِقُ مَأجورٌ ولَو أخطَأ (البخاري ومسلم)." },
            ],
            sourceNotes: [
              { en: "Breadth in the branches; unity in the foundations.", ar: "سَعةٌ في الفُروع؛ وَحدةٌ في الأُصول." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'mercy in difference' display.", ar: "لَوحةُ «رَحمةٌ في الاختِلاف»." },
          },
          {
            slug: "etiquette-of-disagreement",
            name: { en: "Team B — Etiquette of disagreement", ar: "الفَريقُ ب — أدَبُ الخِلاف" },
            learningObjective: { en: "Present the etiquette of dealing with difference.", ar: "نَعرِضُ أدَبَ التَّعامُلِ معَ الخِلاف." },
            task: { en: "Present the noble etiquette (adab) of disagreement, modelled by the early scholars. This includes: respecting other scholars and not insulting or belittling those who differ; recognising you may be wrong and the other right ('our opinion is correct with the possibility of error, and the other's is wrong with the possibility of being right,' as the scholars said); leaving issues of valid difference to the qualified scholars rather than ordinary people fighting over them; not splitting the community or breaking bonds of brotherhood over branch issues; and the famous example of Imam Ash-Shafi'i praying near Abu Hanifah's grave and choosing not to recite the qunut out of respect. Contrast this beautiful adab with the harmful behaviour of fanaticism (ta'assub), arguing without knowledge, and dividing Muslims over secondary matters. Present an 'etiquette of difference' charter for today.", ar: "اعرِضوا أدَبَ الخِلافِ النَّبيلَ كَما ضَرَبَهُ السَّلَف. ومِنه: احتِرامُ العُلَماءِ الآخَرينَ وعَدَمُ سَبِّ المُخالِفِ أوِ ازدِرائِه؛ وإدراكُ أنَّكَ قد تُخطِئُ والآخَرُ يُصيب («رَأيُنا صَوابٌ يَحتَمِلُ الخَطَأ، ورَأيُ غَيرِنا خَطَأٌ يَحتَمِلُ الصَّواب» كَما قالَ العُلَماء)؛ وتَركُ مَسائِلِ الخِلافِ المُعتَبَرِ لِأهلِ العِلمِ المُؤَهَّلينَ لا أن يَتَنازَعَ فيها العامّة؛ وعَدَمُ تَفريقِ الجَماعةِ أو قَطعِ الأُخُوّةِ لِأجلِ الفُروع؛ والمِثالُ المَشهورُ: صَلاةُ الإمامِ الشّافِعيِّ قُربَ قَبرِ أبي حَنيفةَ وتَركُهُ القُنوتَ أدَبًا. قابِلوا هذا الأدَبَ الجَميلَ بِسوءِ التَّعَصُّبِ والجِدالِ بِلا عِلمٍ وتَفريقِ المُسلِمينَ في الفُروع. اعرِضوا ميثاقَ «أدَبِ الخِلاف» لِليَوم." },
            evidence: [
              { en: "'If you disagree, refer it to Allah and the Messenger' (An-Nisa 59).", ar: "﴿فَإن تَنازَعتُم في شَيءٍ فَرُدّوهُ إلى اللهِ والرَّسول﴾ (النساء ٥٩)." },
            ],
            sourceNotes: [
              { en: "The salaf differed with mutual respect and love.", ar: "اختَلَفَ السَّلَفُ معَ التَّحابِّ والاحتِرام." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "An 'etiquette of difference' charter.", ar: "ميثاقُ «أدَبِ الخِلاف»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Respecting difference, preserving unity", ar: "احتِرامُ الخِلافِ وحِفظُ الوَحدة" },
        prompt: { en: "You have learned that the great jurists differed on detailed matters of fiqh out of sincere scholarship, that such difference can be a mercy and breadth for the Ummah, and that the early scholars dealt with their differences with remarkable respect and humility. Reflect on how Muslims today sometimes argue, divide, and even hate one another over secondary issues. Write about how you will deal with differences of opinion in religion — respecting qualified scholars, avoiding fanaticism and arrogance, distinguishing foundations from branches, and protecting the unity and brotherhood of the Ummah even when you hold a different view.", ar: "عَلِمتَ أنَّ كِبارَ الفُقَهاءِ اختَلَفوا في مَسائِلِ الفِقهِ التَّفصيليّةِ عن عِلمٍ صادِق، وأنَّ هذا الخِلافَ قد يَكونُ رَحمةً وسَعةً لِلأُمّة، وأنَّ السَّلَفَ تَعامَلوا معَ خِلافِهِم بِاحتِرامٍ وتَواضُعٍ عَجيب. تَأمَّل كَيفَ يَتَنازَعُ المُسلِمونَ اليَومَ أحيانًا ويَتَفَرَّقونَ بل يَتَباغَضونَ لِأجلِ مَسائِلَ فَرعيّة. اكتُب كَيفَ سَتَتَعامَلُ معَ الخِلافِ في الدّين — مُحتَرِمًا أهلَ العِلمِ المُؤَهَّلين، مُجتَنِبًا التَّعَصُّبَ والكِبر، مُمَيِّزًا الأُصولَ مِنَ الفُروع، حافِظًا وَحدةَ الأُمّةِ وأُخُوَّتَها وإن خالَفتَ في الرَّأي." },
        placeholder: { en: "I will respect difference by... I will avoid fanaticism by... To preserve unity I will...", ar: "سَأحتَرِمُ الخِلافَ بِـ... وسَأجتَنِبُ التَّعَصُّبَ بِـ... ولِحِفظِ الوَحدةِ سَـ..." },
      },
      body: {
        en: "Having understood the causes of legitimate scholarly difference, we now turn to two vital matters: how this difference can be a source of mercy and breadth for the Ummah, and the beautiful etiquette with which the early scholars dealt with it. Many of the early scholars regarded the difference of the qualified imams in matters of the branches as a form of mercy and ease for the Muslim community. This is because such difference provides a breadth and flexibility that allows the Ummah to deal with the vast variety of human circumstances, situations, places, and times — for what is suited to one situation may not be suited to another, and the existence of more than one valid scholarly view within the recognised schools provides room and ease. It also means that the Ummah possesses a rich treasury of carefully reasoned scholarship, the immense legacy of the imams and their schools, to draw upon and benefit from across the generations. A Muslim who follows any of the recognised madhhabs — the schools of Abu Hanifah, Malik, Ash-Shafi'i, and Ahmad — is following a valid path, for each of these schools is firmly built upon the Qur'an and the Sunnah and the sincere ijtihad of a great imam and his students. The ordinary Muslim is therefore not burdened with deriving rulings themselves; rather, they may follow the guidance of trustworthy, qualified scholars with confidence.\n\nYet the breadth of legitimate difference must always be accompanied by the noble etiquette of disagreement (adab al-ikhtilaf), in which the early generations of this Ummah set us an extraordinary example. The first principle of this etiquette is mutual respect: the great imams honoured, praised, and loved one another despite their differences. Imam Ash-Shafi'i was a student of Imam Malik and spoke of him with the greatest respect; he praised Abu Hanifah, saying that people are dependent upon him in fiqh. They debated and differed, but they did not insult, belittle, or declare one another misguided over these branch issues. The second principle is humility — the recognition that one's own ijtihad may be mistaken and the other's correct. The scholars beautifully expressed this with the saying: 'My opinion is correct but liable to be wrong, and the opinion of the one who differs from me is wrong but liable to be correct.' The third principle is leaving matters of valid scholarly difference to the qualified scholars, rather than ordinary people who lack the tools of ijtihad fighting and dividing over them. The fourth is never allowing differences in the branches to break the bonds of brotherhood, split the community, or become a cause of hatred and enmity among Muslims. A famous illustration of this adab is that Imam Ash-Shafi'i, when praying the dawn prayer near the resting place of Imam Abu Hanifah, chose not to recite the qunut supplication — even though it was his own view to do so — out of respect for the great imam who held a different opinion. Such was the humility and brotherhood of these giants of knowledge.\n\nThis beautiful etiquette stands in stark contrast to the harmful behaviour that sometimes afflicts Muslims, both in the past and today: the blameworthy fanaticism (ta'assub) that makes a person cling blindly to one view or school while attacking and belittling all others; the arrogant disputation and arguing about religion without knowledge; and the tragic splitting of the Ummah and breaking of its unity over secondary, branch matters that the great imams themselves treated with breadth and tolerance. Allah commanded the believers, when they differ, to return to the proper authorities: 'O you who have believed, obey Allah and obey the Messenger and those in authority among you. And if you disagree over anything, refer it to Allah and the Messenger, if you should believe in Allah and the Last Day' (An-Nisa 59) — that is, refer disputed matters back to the Qur'an and the Sunnah as understood by the qualified scholars, rather than to whim and division. And He warned sternly against the kind of difference that fragments the religion: 'And do not be like those who became divided and differed after the clear proofs had come to them; for those there is a great punishment' (Aal-Imran 105). For the young Muslim today, the lessons of this topic are vital and practical. We must learn to distinguish clearly between the unshakeable foundations of the religion — on which there is no compromise and no legitimate difference — and the detailed branches of fiqh, in which sincere scholars may differ and in which breadth and tolerance are required. We must respect the great scholars and the recognised schools, follow trustworthy scholars in what we do not know, avoid arguing about matters beyond our knowledge, reject blind fanaticism for any school or personality, and above all guard the precious unity and brotherhood of the Ummah. In an age where social media spreads ignorant arguments and where Muslims are too often divided over secondary issues while their real foundations are united, reviving the noble etiquette of difference — united on the foundations, broad-hearted and respectful in the branches — is among the most important things a young Muslim can learn and practise.",
        ar: "بَعدَ فَهمِ أسبابِ الاختِلافِ العِلميِّ المُعتَبَر، نَنتَقِلُ إلى أمرَينِ مُهِمَّين: كَيفَ يَكونُ هذا الخِلافُ رَحمةً وسَعةً لِلأُمّة، والأدَبَ الجَميلَ الذي تَعامَلَ بِهِ السَّلَفُ مَعَه. عَدَّ كَثيرٌ مِنَ السَّلَفِ خِلافَ الأئمّةِ المُؤَهَّلينَ في الفُروعِ رَحمةً وتَيسيرًا لِلأُمّة. ذلك أنَّ هذا الخِلافَ يُعطي سَعةً ومُرونةً تُمَكِّنُ الأُمّةَ مِنَ التَّعامُلِ معَ تَنَوُّعِ أحوالِ النّاسِ وظُروفِهِم وأماكِنِهِم وأزمِنَتِهِم — فَما يُناسِبُ حالًا قد لا يُناسِبُ آخَر، ووُجودُ أكثَرَ مِن قَولٍ مُعتَبَرٍ ضِمنَ المَذاهِبِ المُعتَرَفِ بِها يُعطي مَجالًا ويُسرًا. ويَعني كَذلك أنَّ الأُمّةَ تَملِكُ ثَروةً عِلميّةً غَنيّةً مَدروسة، تُراثَ الأئمّةِ ومَذاهِبِهِمِ العَظيم، تُرجَعُ إلَيهِ ويُنتَفَعُ بِهِ عَبرَ الأجيال. والمُسلِمُ الذي يَتبَعُ أيَّ مَذهَبٍ مُعتَبَرٍ — مَذاهِبِ أبي حَنيفةَ ومالِكٍ والشّافِعيِّ وأحمَد — على طَريقٍ صَحيح، إذ كُلُّ هذه المَذاهِبِ مَبنيّةٌ على القُرآنِ والسُّنّةِ واجتِهادِ إمامٍ كَبيرٍ وتَلامِذَتِهِ الصّادِق. فَالعامّيُّ لا يُكَلَّفُ باستِنباطِ الأحكامِ بِنَفسِه؛ بل يَتبَعُ هَديَ العُلَماءِ الثِّقاتِ المُؤَهَّلينَ بِثِقة.\n\nلكِنَّ سَعةَ الخِلافِ المُعتَبَرِ يَجِبُ أن تُصاحِبَها دائِمًا أدَبُ الخِلافِ النَّبيل، الذي ضَرَبَ فيهِ سَلَفُ هذه الأُمّةِ مِثالًا عَجيبًا. وأوَّلُ مَبادِئِ هذا الأدَبِ الاحتِرامُ المُتَبادَل: فالأئمّةُ الكِبارُ أجَلُّوا بَعضَهُم وأثنوا وتَحابّوا معَ خِلافِهِم. كانَ الشّافِعيُّ تِلميذَ مالِكٍ ويَذكُرُهُ بِأعظَمِ الاحتِرام؛ وأثنى على أبي حَنيفةَ فَقالَ: النّاسُ عِيالٌ علَيهِ في الفِقه. ناظَروا واختَلَفوا، لكِنَّهُم لم يَسُبّوا ولم يَزدَروا ولم يُضَلِّل بَعضُهُم بَعضًا في هذه الفُروع. والمَبدَأُ الثّاني التَّواضُع — إدراكُ أنَّ اجتِهادَ المَرءِ قد يُخطِئُ والآخَرَ يُصيب. وعَبَّرَ العُلَماءُ عن هذا بِقَولِهِمُ البَديع: «رَأيي صَوابٌ يَحتَمِلُ الخَطَأ، ورَأيُ مَن خالَفَني خَطَأٌ يَحتَمِلُ الصَّواب». والمَبدَأُ الثّالِثُ تَركُ مَسائِلِ الخِلافِ المُعتَبَرِ لِأهلِ العِلمِ المُؤَهَّلين، لا أن يَتَنازَعَ ويَتَفَرَّقَ فيها مَن لا يَملِكُ أدَواتِ الاجتِهاد. والرّابِعُ ألّا يُسمَحَ أبَدًا لِلخِلافِ في الفُروعِ أن يَقطَعَ أواصِرَ الأُخُوّة، أو يُفَرِّقَ الجَماعة، أو يَصيرَ سَبَبَ بَغضاءَ وعَداوةٍ بَينَ المُسلِمين. ومِنَ الأمثِلةِ المَشهورةِ في هذا الأدَبِ أنَّ الإمامَ الشّافِعيَّ، حينَ صَلّى الفَجرَ قُربَ مَقامِ الإمامِ أبي حَنيفة، تَرَكَ القُنوتَ — معَ أنَّهُ مَذهَبُهُ — أدَبًا معَ الإمامِ الكَبيرِ المُخالِفِ في الرَّأي. هكذا كانَ تَواضُعُ هؤُلاءِ الجَهابِذةِ وأُخُوَّتُهُم.\n\nوهذا الأدَبُ الجَميلُ يُناقِضُ تَمامًا السُّلوكَ الضّارَّ الذي يُصيبُ المُسلِمينَ أحيانًا، قَديمًا وحَديثًا: التَّعَصُّبَ المَذمومَ الذي يَجعَلُ المَرءَ يَتَمَسَّكُ بِقَولٍ أو مَذهَبٍ بِلا تَمييزٍ ويُهاجِمُ ويَزدَري ما عَداه؛ والجِدالَ المُتَكَبِّرَ والخَوضَ في الدّينِ بِلا عِلم؛ وتَفريقَ الأُمّةِ المُؤسِفَ وكَسرَ وَحدَتِها لِأجلِ مَسائِلَ فَرعيّةٍ عامَلَها الأئمّةُ أنفُسُهُم بِسَعةٍ وتَسامُح. وقد أمَرَ اللهُ المُؤمِنينَ عِندَ الاختِلافِ أن يَرُدّوا الأمرَ إلى أهلِه: ﴿يا أيُّها الذينَ آمَنوا أطيعوا اللهَ وأطيعوا الرَّسولَ وأُولي الأمرِ مِنكُم، فَإن تَنازَعتُم في شَيءٍ فَرُدّوهُ إلى اللهِ والرَّسولِ إن كُنتُم تُؤمِنونَ بِاللهِ واليَومِ الآخِر﴾ (النساء ٥٩) — أي رُدّوا المُتَنازَعَ فيهِ إلى القُرآنِ والسُّنّةِ بِفَهمِ العُلَماءِ المُؤَهَّلين، لا إلى الهَوى والفُرقة. وحَذَّرَ بِشِدّةٍ مِنَ الخِلافِ الذي يُمَزِّقُ الدّين: ﴿ولا تَكونوا كَالذينَ تَفَرَّقوا واختَلَفوا مِن بَعدِ ما جاءَهُمُ البَيِّناتُ وأُولئِكَ لَهُم عَذابٌ عَظيم﴾ (آل عمران ١٠٥). ولِلشّابِّ المُسلِمِ اليَومَ دُروسُ هذا المَوضوعِ حَيَويّةٌ عَمَليّة. فَعَلَينا أن نُحسِنَ التَّمييزَ بَينَ ثَوابِتِ الدّينِ الرّاسِخة — التي لا مُساوَمةَ فيها ولا خِلافَ مُعتَبَر — وبَينَ فُروعِ الفِقهِ التَّفصيليّةِ التي قد يَختَلِفُ فيها العُلَماءُ الصّادِقونَ والتي تُطلَبُ فيها السَّعةُ والتَّسامُح. وأن نَحتَرِمَ العُلَماءَ الكِبارَ والمَذاهِبَ المُعتَبَرة، ونَتبَعَ العُلَماءَ الثِّقاتِ فيما لا نَعلَم، ونَتَجَنَّبَ الجِدالَ فيما وَراءَ عِلمِنا، ونَرفُضَ التَّعَصُّبَ الأعمى لِأيِّ مَذهَبٍ أو شَخص، وقَبلَ ذلك كُلِّهِ نَحفَظَ وَحدةَ الأُمّةِ وأُخُوَّتَها الغالية. وفي زَمَنٍ تَنشُرُ فيهِ وَسائِلُ التَّواصُلِ الجِدالَ الجاهِل، ويَتَفَرَّقُ فيهِ المُسلِمونَ كَثيرًا على الفُروعِ معَ أنَّ أُصولَهُم مُجتَمِعة، يَكونُ إحياءُ أدَبِ الخِلافِ النَّبيل — اتِّحادًا في الأُصول، وسَعةً واحتِرامًا في الفُروع — مِن أهَمِّ ما يَتَعَلَّمُهُ الشّابُّ المُسلِمُ ويُمارِسُه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Where does legitimate scholarly difference occur?", ar: "أينَ يَقَعُ الخِلافُ العِلميُّ المُعتَبَر؟" },
      options: [
        { en: "In the detailed branches (furu') of fiqh", ar: "في فُروعِ الفِقهِ التَّفصيليّة" },
        { en: "In the foundations of faith (usul)", ar: "في أُصولِ العَقيدة" },
        { en: "In the oneness of Allah", ar: "في تَوحيدِ الله" },
        { en: "Nowhere is difference allowed", ar: "لا خِلافَ في شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "Usul are united; furu' may have valid difference.", ar: "الأُصولُ مُجتَمَعٌ علَيها، والفُروعُ يَسَعُها الخِلاف." },
    },
    {
      prompt: { en: "Which is a genuine cause of acceptable ikhtilaf?", ar: "أيٌّ سَبَبٌ حَقيقيٌّ لِلاختِلافِ المَقبول؟" },
      options: [
        { en: "Words with multiple meanings or a hadith reaching one scholar not another", ar: "ألفاظٌ مُتَعَدِّدةُ المَعنى أو حَديثٌ بَلَغَ عالِمًا دونَ آخَر" },
        { en: "Following desires", ar: "اتِّباعُ الهَوى" },
        { en: "Ignorance of Islam", ar: "الجَهلُ بِالإسلام" },
        { en: "Hatred of scholars", ar: "بُغضُ العُلَماء" },
      ],
      correctIndex: 0,
      explanation: { en: "Legitimate causes are rooted in sincere scholarship.", ar: "الأسبابُ المُعتَبَرةُ نابِعةٌ مِن عِلمٍ صادِق." },
    },
    {
      prompt: { en: "What does the hadith say about the mujtahid who errs?", ar: "ماذا يَقولُ الحَديثُ عنِ المُجتَهِدِ المُخطِئ؟" },
      options: [
        { en: "He still has one reward for his sincere effort", ar: "لَهُ أجرٌ واحِدٌ على اجتِهادِهِ الصّادِق" },
        { en: "He has sinned greatly", ar: "أثِمَ إثمًا عَظيمًا" },
        { en: "He leaves Islam", ar: "يَخرُجُ مِنَ الإسلام" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "Right = two rewards; wrong = one reward (Bukhari, Muslim).", ar: "المُصيبُ لَهُ أجران، والمُخطِئُ لَهُ أجر (البخاري ومسلم)." },
    },
    {
      prompt: { en: "How can difference in the branches benefit the Ummah?", ar: "كَيفَ يَنفَعُ الخِلافُ في الفُروعِ الأُمّة؟" },
      options: [
        { en: "It is a mercy giving breadth and a rich scholarly treasury", ar: "رَحمةٌ تُعطي سَعةً وثَروةً عِلميّةً غَنيّة" },
        { en: "It destroys the religion", ar: "يُدَمِّرُ الدّين" },
        { en: "It is always blameworthy", ar: "مَذمومٌ دائِمًا" },
        { en: "It has no benefit", ar: "لا فائِدةَ فيه" },
      ],
      correctIndex: 0,
      explanation: { en: "It provides flexibility and a wealth of reasoned scholarship.", ar: "يُوَفِّرُ مُرونةً وثَروةً عِلميّةً مَدروسة." },
    },
    {
      prompt: { en: "What is part of the etiquette of disagreement?", ar: "ما مِن أدَبِ الخِلاف؟" },
      options: [
        { en: "Respecting other scholars and not dividing the Ummah over branches", ar: "احتِرامُ العُلَماءِ وعَدَمُ تَفريقِ الأُمّةِ على الفُروع" },
        { en: "Insulting those who differ", ar: "سَبُّ المُخالِفين" },
        { en: "Blind fanaticism for one view", ar: "التَّعَصُّبُ الأعمى لِقَول" },
        { en: "Arguing without knowledge", ar: "الجِدالُ بِلا عِلم" },
      ],
      correctIndex: 0,
      explanation: { en: "The salaf differed with respect, humility, and brotherhood.", ar: "اختَلَفَ السَّلَفُ بِاحتِرامٍ وتَواضُعٍ وأُخُوّة." },
    },
    {
      prompt: { en: "True or False: Difference in the branches should break the unity of the Ummah.", ar: "صَوابٌ أم خَطأ: الخِلافُ في الفُروعِ يَنبَغي أن يَكسِرَ وَحدةَ الأُمّة." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "United on foundations, broad-hearted in the branches.", ar: "اتِّحادٌ في الأُصول، وسَعةٌ في الفُروع." },
    },
  ],
};
