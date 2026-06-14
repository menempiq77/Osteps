import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const buildingTheFamily: CourseLesson = {
  slug: "g11y12-building-the-family",
  name: { en: "Islam's Method in Building the Family", ar: "مَنهَجُ الإسلامِ في بِناءِ الأُسرة" },
  shortIntro: {
    en: "The family is the first foundation of society, and Islam gave it a complete method built on marriage, mutual rights, love and mercy, and the upbringing of righteous children. This lesson studies the importance of the family in Islam, the foundations on which Islam builds it (a sound marriage, tranquillity, love and mercy, and clear rights and duties), and how a young Muslim should value and prepare for family life.",
    ar: "الأُسرةُ أوَّلُ أساسٍ لِلمُجتَمَع، وقَد أعطاها الإسلامُ مَنهَجًا كامِلًا قائِمًا على الزَّواجِ والحُقوقِ المُتَبادَلةِ والمَوَدّةِ والرَّحمةِ وتَربيةِ الأبناءِ الصّالِحين. يَدرُسُ هذا الدَّرسُ أهَمّيّةَ الأُسرةِ في الإسلام، والأُسُسَ التي يَبني علَيها الإسلامُ الأُسرة (الزَّواجَ الصَّحيحَ والسَّكينةَ والمَوَدّةَ والرَّحمةَ والحُقوقَ والواجِباتِ الواضِحة)، وكَيفَ يُقَدِّرُ الشّابُّ المُسلِمُ حَياةَ الأُسرةِ ويَستَعِدُّ لَها.",
  },
  quranSurahs: ["Ar-Rum 21", "At-Tahrim 6"],
  sections: [
    {
      title: { en: "The family: foundation of society", ar: "الأُسرة: أساسُ المُجتَمَع" },
      learningObjectives: [
        { en: "Explain the importance of the family in Islam.", ar: "أشرَحُ أهَمّيّةَ الأُسرةِ في الإسلام." },
        { en: "Explain the foundations of marriage in Islam.", ar: "أشرَحُ أُسُسَ الزَّواجِ في الإسلام." },
      ],
      successCriteria: [
        { en: "I can explain Ar-Rum 21.", ar: "أشرَحُ الرّوم ٢١." },
        { en: "I can describe why the family matters.", ar: "أصِفُ أهَمّيّةَ الأُسرة." },
      ],
      image: {
        src: IMG.greenValley,
        alt: { en: "The family grows like a fertile valley.", ar: "الأُسرةُ تَنمو كَوادٍ خَصيب." },
        caption: { en: "'He created for you mates that you may find tranquillity' (Ar-Rum 21).", ar: "﴿خَلَقَ لَكُم مِن أنفُسِكُم أزواجًا لِتَسكُنوا إلَيها﴾ (الرّوم ٢١)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does a strong society begin with a strong family?", ar: "لِمَ يَبدَأُ المُجتَمَعُ القَويُّ بِالأُسرةِ القَويّة؟" },
        body: {
          en: "Societies are made up of families, and the character of a people is shaped first in the home. Islam gives the family enormous importance, building it on marriage, clear rights and duties, and an atmosphere of love and mercy. In many places today, however, the family is under great strain — weakened by neglect, breakdown, and ideas that treat marriage and family as unimportant or optional. Reflect: why does Islam make the family the first foundation of a healthy society, what are the foundations on which Islam builds a strong family, and why should a young Muslim value and prepare for family life rather than dismiss it?",
          ar: "المُجتَمَعاتُ مُكَوَّنةٌ مِنَ الأُسَر، وأخلاقُ الشُّعوبِ تُصاغُ أوَّلًا في البَيت. ويولي الإسلامُ الأُسرةَ أهَمّيّةً عَظيمة، يَبنيها على الزَّواجِ والحُقوقِ والواجِباتِ الواضِحةِ وجَوٍّ مِنَ المَوَدّةِ والرَّحمة. لكِنَّ الأُسرةَ في أماكِنَ كَثيرةٍ اليَومَ تَحتَ ضَغطٍ شَديد — أضعَفَها الإهمالُ والتَّفَكُّكُ وأفكارٌ تَعُدُّ الزَّواجَ والأُسرةَ غَيرَ مُهِمٍّ أوِ اختياريًّا. تَأمَّل: لِمَ يَجعَلُ الإسلامُ الأُسرةَ أوَّلَ أساسٍ لِمُجتَمَعٍ سَليم، وما الأُسُسُ التي يَبني علَيها الإسلامُ الأُسرةَ القَويّة، ولِمَ يَنبَغي لِلشّابِّ المُسلِمِ أن يُقَدِّرَ حَياةَ الأُسرةِ ويَستَعِدَّ لَها لا أن يَستَهينَ بِها؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Sakan (السَّكَن): tranquillity. Mawaddah (المَوَدّة): love. Rahmah (الرَّحمة): mercy/compassion.", ar: "السَّكَن: الطُّمَأنينة. المَوَدّة: المَحَبّة. الرَّحمة: الشَّفَقة." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "An-Nisa 1: Allah created people from a single soul and made from it its mate.", ar: "النِّساء ١: خَلَقَ اللهُ النّاسَ مِن نَفسٍ واحِدةٍ وجَعَلَ مِنها زَوجَها." },
          ],
        },
      ],
      body: {
        en: "The family is the first and most fundamental unit of human society, and Islam gives it an importance and care unmatched by any other system. From the family come individuals; from sound families come sound communities; and from strong, righteous families comes a strong, righteous nation. The home is the first school in which a child learns faith, character, language, and values, and the first place where love, mercy, security, and belonging are experienced. For this reason, Islam did not leave the family to chance or to the changing customs of every age, but gave it a complete method (manhaj): a foundation in lawful marriage, clear rights and duties for each member, an atmosphere of love and mercy, and the goal of raising a righteous generation. To build the family well is, in Islam, to build the foundation of the whole of society and to lay up reward for the Hereafter; to neglect it is to weaken everything that is built upon it.\n\nIslam builds the family upon marriage (nikah), which it honours as a sacred bond and 'a solemn covenant' (mithaqan ghaliza, An-Nisa 21), not a mere contract of convenience nor a casual relationship. Marriage in Islam is the only lawful foundation for family life and the bearing of children, and it is described in the Qur'an in some of its most beautiful verses. Allah says: 'And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection (mawaddah) and mercy (rahmah). Indeed in that are signs for a people who give thought' (Ar-Rum 21). This single verse lays out the very foundations on which Islam builds the family. First, marriage is a sign of Allah — one of the proofs of His wisdom and mercy in creation. Second, its purpose is tranquillity (sakan): the spouses are a place of rest, peace, and security for one another, each finding in the other calm from the storms of life. Third, Allah Himself places between the spouses mawaddah (love and affection) and rahmah (mercy and compassion) — the two great bonds that hold a family together through every stage: love in its warmth and joy, and mercy in its tenderness, patience, and forgiveness when love alone is tested. A family built on these — a lawful, honoured marriage that is a source of tranquillity, love, and mercy — has the foundation Islam intends.\n\nThe Qur'an further reminds us that humanity itself began as a family: 'O mankind, fear your Lord, who created you from one soul and created from it its mate and dispersed from both of them many men and women' (An-Nisa 1). The whole human race is, in this sense, one extended family descended from Adam and Hawwa, and the bonds of kinship are sacred. Islam therefore surrounds the family with rights and duties that protect and strengthen it: the rights of the spouses upon each other, the rights of children upon parents and parents upon children, and the rights of relatives and kin. It commands the maintaining of family ties (silat al-rahim) and warns severely against cutting them. And it makes the family a field of worship and reward: a person's spending on their family, their kindness to their parents, their raising of righteous children, and their patience in family life are all acts of worship beloved to Allah. In the next section, we will study these rights and duties in more detail, the central duty of raising righteous children, and how a young Muslim should value and prepare for the responsibility of family life.",
        ar: "الأُسرةُ هي الوَحدةُ الأولى الأساسُ لِلمُجتَمَعِ الإنسانيّ، ويولِيها الإسلامُ أهَمّيّةً وعِنايةً لا يُماثِلُهُ فيها نِظامٌ آخَر. فَمِنَ الأُسرةِ يَخرُجُ الأفراد؛ ومِنَ الأُسَرِ الصّالِحةِ تَنشَأُ المُجتَمَعاتُ الصّالِحة؛ ومِنَ الأُسَرِ القَويّةِ الصّالِحةِ تَنشَأُ الأُمّةُ القَويّةُ الصّالِحة. والبَيتُ أوَّلُ مَدرَسةٍ يَتَعَلَّمُ فيها الطِّفلُ الإيمانَ والخُلُقَ واللُّغةَ والقِيَم، وأوَّلُ مَكانٍ يَذوقُ فيهِ الحُبَّ والرَّحمةَ والأمانَ والانتِماء. ولِهذا لَم يَترُكِ الإسلامُ الأُسرةَ لِلصُّدفةِ أو لِعاداتِ كُلِّ عَصرٍ المُتَغَيِّرة، بل أعطاها مَنهَجًا كامِلًا: أساسًا في الزَّواجِ الشَّرعيّ، وحُقوقًا وواجِباتٍ واضِحةً لِكُلِّ فَرد، وجَوًّا مِنَ المَوَدّةِ والرَّحمة، وغايةً في إنشاءِ جيلٍ صالِح. فَبِناءُ الأُسرةِ في الإسلامِ بِناءٌ لِأساسِ المُجتَمَعِ كُلِّهِ وادِّخارٌ لِأجرِ الآخِرة؛ وإهمالُها إضعافٌ لِكُلِّ ما يُبنى علَيها.\n\nويَبني الإسلامُ الأُسرةَ على الزَّواج (النِّكاح)، ويُكرِمُهُ رِباطًا مُقَدَّسًا و«ميثاقًا غَليظًا» (النِّساء ٢١)، لا مُجَرَّدَ عَقدِ مَصلَحةٍ ولا عَلاقةٍ عابِرة. والزَّواجُ في الإسلامِ الأساسُ الشَّرعيُّ الوَحيدُ لِحَياةِ الأُسرةِ وإنجابِ الأبناء، وقَد وُصِفَ في القُرآنِ بِأجمَلِ الآيات. قالَ الله: ﴿ومِن آياتِهِ أن خَلَقَ لَكُم مِن أنفُسِكُم أزواجًا لِتَسكُنوا إلَيها وجَعَلَ بَينَكُم مَوَدّةً ورَحمةً إنَّ في ذلك لَآياتٍ لِقَومٍ يَتَفَكَّرون﴾ (الرّوم ٢١). تَضَعُ هذه الآيةُ الواحِدةُ الأُسُسَ التي يَبني علَيها الإسلامُ الأُسرة. أوَّلًا: الزَّواجُ آيةٌ مِن آياتِ الله — مِن دَلائِلِ حِكمَتِهِ ورَحمَتِهِ في الخَلق. ثانيًا: غايَتُهُ السَّكَن: فَالزَّوجانِ مَوضِعُ راحةٍ وطُمَأنينةٍ وأمانٍ كُلٌّ لِلآخَر، يَجِدُ كُلٌّ في الآخَرِ سُكونًا مِن عَواصِفِ الحَياة. ثالِثًا: اللهُ نَفسُهُ يَجعَلُ بَينَ الزَّوجَينِ المَوَدّةَ والرَّحمة — الرِّباطَينِ العَظيمَينِ اللَّذَينِ يُمسِكانِ الأُسرةَ عَبرَ كُلِّ مَرحَلة: المَوَدّةَ في دِفئِها وفَرَحِها، والرَّحمةَ في رِفقِها وصَبرِها وعَفوِها حينَ تُمتَحَنُ المَوَدّةُ وَحدَها. فَالأُسرةُ المَبنيّةُ على هذه — زَواجٍ شَرعيٍّ مُكَرَّمٍ مَصدَرٍ لِلسَّكَنِ والمَوَدّةِ والرَّحمة — لَها الأساسُ الذي أرادَهُ الإسلام.\n\nويُذَكِّرُنا القُرآنُ كَذلك أنَّ البَشَريّةَ نَفسَها بَدَأَت أُسرةً: ﴿يا أيُّها النّاسُ اتَّقوا رَبَّكُمُ الذي خَلَقَكُم مِن نَفسٍ واحِدةٍ وخَلَقَ مِنها زَوجَها وبَثَّ مِنهُما رِجالًا كَثيرًا ونِساءً﴾ (النِّساء ١). فَالجِنسُ البَشَريُّ كُلُّهُ، بِهذا المَعنى، أُسرةٌ واحِدةٌ مُمتَدّةٌ مِن آدَمَ وحَوّاء، ورَوابِطُ القَرابةِ مُقَدَّسة. فَيُحيطُ الإسلامُ الأُسرةَ بِحُقوقٍ وواجِباتٍ تَحفَظُها وتُقَوّيها: حُقوقِ الزَّوجَينِ بَعضِهِما على بَعض، وحُقوقِ الأبناءِ على الآباءِ والآباءِ على الأبناء، وحُقوقِ الأقارِبِ والرَّحِم. ويَأمُرُ بِصِلةِ الرَّحِم، ويُحَذِّرُ بِشِدّةٍ مِن قَطعِها. ويَجعَلُ الأُسرةَ مَيدانَ عِبادةٍ وأجر: فَإنفاقُ المَرءِ على أهلِه، وبِرُّهُ بِوالِدَيه، وتَربيَتُهُ أبناءً صالِحين، وصَبرُهُ في حَياةِ الأُسرة، كُلُّها عِباداتٌ مَحبوبةٌ إلى الله. وفي القِسمِ التّالي نَدرُسُ هذه الحُقوقَ والواجِباتِ بِتَفصيلٍ أكثَر، والواجِبَ المَركَزيَّ في تَربيةِ الأبناءِ الصّالِحين، وكَيفَ يُقَدِّرُ الشّابُّ المُسلِمُ مَسؤوليّةَ حَياةِ الأُسرةِ ويَستَعِدُّ لَها.",
      },
    },
    {
      title: { en: "Rights, duties, and raising children", ar: "الحُقوقُ والواجِباتُ وتَربيةُ الأبناء" },
      learningObjectives: [
        { en: "Identify the rights and duties within the family.", ar: "أُحَدِّدُ الحُقوقَ والواجِباتِ في الأُسرة." },
        { en: "Explain the duty of raising righteous children.", ar: "أشرَحُ واجِبَ تَربيةِ الأبناءِ الصّالِحين." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Raising a righteous generation.", ar: "تَربيةُ جيلٍ صالِح." },
        caption: { en: "'Protect yourselves and your families from a Fire' (At-Tahrim 6).", ar: "﴿قوا أنفُسَكُم وأهليكُم نارًا﴾ (التَّحريم ٦)." },
      },
      groupTasks: {
        title: { en: "Building a strong family", ar: "بِناءُ أُسرةٍ قَويّة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "rights-and-duties",
            name: { en: "Team A — Rights and duties in the family", ar: "الفَريقُ أ — الحُقوقُ والواجِباتُ في الأُسرة" },
            learningObjective: { en: "Present the mutual rights and duties of family members.", ar: "نَعرِضُ الحُقوقَ والواجِباتِ المُتَبادَلةَ لِأفرادِ الأُسرة." },
            task: { en: "Present the mutual rights and duties Islam established within the family: between spouses (kindness, good companionship — 'live with them in kindness', mutual rights, the husband's responsibility to provide and protect, cooperation in the home and in raising children); the rights of children upon parents (a good name, love, provision, education, and especially religious and moral upbringing); the rights of parents upon children (honour, obedience in good, kindness, and care, especially in old age — birr al-walidayn); and the keeping of family ties (silat al-rahim) with relatives. Show these rights as a balanced web of love and responsibility, not domination. Present a 'family rights and duties' display.", ar: "اعرِضوا الحُقوقَ والواجِباتِ المُتَبادَلةَ التي أقامَها الإسلامُ في الأُسرة: بَينَ الزَّوجَين (الإحسانَ وحُسنَ العِشرة — ﴿وعاشِروهُنَّ بِالمَعروف﴾، والحُقوقَ المُتَبادَلة، ومَسؤوليّةَ الزَّوجِ في النَّفَقةِ والحِماية، والتَّعاوُنَ في البَيتِ وتَربيةِ الأبناء)؛ وحُقوقَ الأبناءِ على الآباء (الاسمَ الحَسَنَ والحُبَّ والنَّفَقةَ والتَّعليمَ وخاصّةً التَّربيةَ الدّينيّةَ والخُلُقيّة)؛ وحُقوقَ الآباءِ على الأبناء (التَّوقيرَ والطّاعةَ في المَعروفِ والإحسانَ والرِّعايةَ خاصّةً عِندَ الكِبَر — بِرَّ الوالِدَين)؛ وصِلةَ الرَّحِمِ بِالأقارِب. اظهِروا هذه الحُقوقَ شَبَكةً مُتَوازِنةً مِنَ الحُبِّ والمَسؤوليّةِ لا تَسَلُّطًا. اعرِضوا لَوحةَ «حُقوقِ الأُسرةِ وواجِباتِها»." },
            evidence: [
              { en: "'And live with them in kindness' (An-Nisa 19).", ar: "﴿وعاشِروهُنَّ بِالمَعروف﴾ (النِّساء ١٩)." },
            ],
            sourceNotes: [
              { en: "Rights and duties bind the family in love and responsibility.", ar: "الحُقوقُ والواجِباتُ تَربِطُ الأُسرةَ بِالحُبِّ والمَسؤوليّة." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'family rights and duties' display.", ar: "لَوحةُ «حُقوقِ الأُسرةِ وواجِباتِها»." },
          },
          {
            slug: "raising-children",
            name: { en: "Team B — Raising a righteous generation", ar: "الفَريقُ ب — تَربيةُ جيلٍ صالِح" },
            learningObjective: { en: "Present the duty of raising righteous children and valuing family.", ar: "نَعرِضُ واجِبَ تَربيةِ الأبناءِ الصّالِحينَ وتَقديرَ الأُسرة." },
            task: { en: "Present the great duty of raising righteous children and how a young Muslim should value and prepare for family life: the parents' duty to protect their family from the Fire by teaching them faith and good character (At-Tahrim 6), following the Prophet's example and that of Luqman's advice to his son in the Qur'an; the value of righteous children as an ongoing reward (a righteous child who prays for the parent); the importance of choosing a spouse of good religion and character; and how a young Muslim today can prepare — by building good character, honouring their own parents, learning the deen, and valuing marriage and family rather than dismissing them. Present a 'building a righteous family' guide.", ar: "اعرِضوا الواجِبَ العَظيمَ في تَربيةِ الأبناءِ الصّالِحينَ وكَيفَ يُقَدِّرُ الشّابُّ المُسلِمُ حَياةَ الأُسرةِ ويَستَعِدُّ لَها: واجِبَ الوالِدَينِ في وِقايةِ أهلِهِم مِنَ النّارِ بِتَعليمِهِمِ الإيمانَ والخُلُقَ (التَّحريم ٦)، اقتِداءً بِالنَّبِيِّ ﷺ وبِوَصايا لُقمانَ لِابنِهِ في القُرآن؛ وقيمةَ الوَلَدِ الصّالِحِ أجرًا جاريًا (وَلَدٌ صالِحٌ يَدعو لِوالِدَيه)؛ وأهَمّيّةَ اختيارِ الزَّوجِ ذي الدّينِ والخُلُق؛ وكَيفَ يَستَعِدُّ الشّابُّ اليَومَ — بِبِناءِ الخُلُقِ الحَسَن، وبِرِّ والِدَيه، وتَعَلُّمِ الدّين، وتَقديرِ الزَّواجِ والأُسرةِ لا الاستِهانةِ بِهِما. اعرِضوا دَليلَ «بِناءِ الأُسرةِ الصّالِحة»." },
            evidence: [
              { en: "'O you who believe, protect yourselves and your families from a Fire' (At-Tahrim 6).", ar: "﴿يا أيُّها الذينَ آمَنوا قوا أنفُسَكُم وأهليكُم نارًا﴾ (التَّحريم ٦)." },
            ],
            sourceNotes: [
              { en: "Raising righteous children is a great act of worship.", ar: "تَربيةُ الأبناءِ الصّالِحينَ عِبادةٌ عَظيمة." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'building a righteous family' guide.", ar: "دَليلُ «بِناءِ الأُسرةِ الصّالِحة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "My family and my future family", ar: "أُسرَتي وأُسرَتي المُستَقبَليّة" },
        prompt: { en: "Islam builds the family on a lawful, honoured marriage that is a source of tranquillity, love (mawaddah), and mercy (rahmah), with clear mutual rights and the goal of raising righteous children — and commands us to protect ourselves and our families from the Fire. Reflect on your own family life today: how well do you fulfil your duties toward your parents and family, and value the home Allah has given you? Then think about the future: why does it matter to value marriage and family rather than dismiss them, and how can you begin preparing now to one day build a strong, righteous family? Write about one way you will better honour your current family, and one way you will prepare yourself for righteous family life in the future.", ar: "يَبني الإسلامُ الأُسرةَ على زَواجٍ شَرعيٍّ مُكَرَّمٍ مَصدَرٍ لِلسَّكَنِ والمَوَدّةِ والرَّحمة، بِحُقوقٍ مُتَبادَلةٍ واضِحة، وغايةٍ في تَربيةِ أبناءٍ صالِحين — ويَأمُرُنا بِوِقايةِ أنفُسِنا وأهلينا النّار. تَأمَّل حَياةَ أُسرَتِكَ اليَوم: كَم تُؤَدّي واجِباتِكَ نَحوَ والِدَيكَ وأُسرَتِك، وتُقَدِّرُ البَيتَ الذي أعطاكَهُ الله؟ ثُمَّ فَكِّر في المُستَقبَل: لِمَ يُهِمُّ تَقديرُ الزَّواجِ والأُسرةِ لا الاستِهانةُ بِهِما، وكَيفَ تَبدَأُ الآنَ الاستِعدادَ لِتَبنيَ يَومًا أُسرةً قَويّةً صالِحة؟ اكتُب طَريقةً سَتُحسِنُ بِها بِرَّ أُسرَتِكَ الحاليّة، وطَريقةً سَتُعِدُّ بِها نَفسَكَ لِحَياةِ أُسرةٍ صالِحةٍ في المُستَقبَل." },
        placeholder: { en: "I will honour my family by... I will prepare for the future by...", ar: "سَأبَرُّ أُسرَتي بِـ... وسَأستَعِدُّ لِلمُستَقبَلِ بِـ..." },
      },
      body: {
        en: "Islam protects and strengthens the family through a balanced web of rights and duties, in which each member has rights to be honoured and duties to fulfil, so that the family is held together by both love and responsibility. Between the spouses, Islam commands good companionship: 'And live with them in kindness' (An-Nisa 19), and the Prophet ﷺ taught that 'the best of you are the best to their families, and I am the best of you to my family.' The spouses have mutual rights upon each other, the husband bearing the responsibility of providing for and protecting the family, and both cooperating in building the home and raising the children in an atmosphere of love and mercy. Children have great rights upon their parents: a good name, love and care, provision, and above all a sound upbringing in faith and good character. And parents have great rights upon their children — the rights of honour, obedience in what is good, kindness, and care, especially in old age — for the Qur'an joins kindness to parents (birr al-walidayn) directly to the worship of Allah: 'Worship Allah and associate nothing with Him, and to parents do good' (An-Nisa 36). Beyond the immediate household, Islam commands the keeping of family ties (silat al-rahim) with grandparents, aunts, uncles, and relatives, and warns severely against cutting them off. These rights are not a structure of domination but a balanced order of love and responsibility in which the strong care for the weak and each member contributes to the good of all.\n\nAt the heart of Islam's method for the family lies the duty of raising a righteous generation. This is one of the gravest and most rewarding responsibilities Allah places upon parents, expressed in the command: 'O you who have believed, protect yourselves and your families from a Fire whose fuel is people and stones' (At-Tahrim 6). The scholars explain that protecting one's family from the Fire means teaching them faith, worship, and good character, commanding them to good and forbidding them from evil, and raising them upon the love and obedience of Allah. The Prophet ﷺ is the perfect example of mercy and good upbringing toward children, and the Qur'an preserves the beautiful model of Luqman, who advised his son with the most important lessons: not to associate partners with Allah, to establish prayer, to enjoin good and forbid evil, to be patient, and to be humble and gentle with people (Luqman 13-19). A righteous child is also a lasting treasure for the parents: the Prophet ﷺ taught that when a person dies, their deeds end except for three, among them 'a righteous child who prays for them' — so that good upbringing brings reward that continues even after death. For all these reasons, Islam places great importance on choosing a spouse of sound religion and character as the foundation of a good family, the Prophet ﷺ advising to choose above all the one of religion.\n\nFor a young Muslim, all of this means that the family is not a small or optional matter to be dismissed, but one of the most important fields of faith and life, deserving to be valued, honoured, and prepared for. In a time when some ideas treat marriage and family as burdens, outdated, or unimportant, the believing young person understands the family to be a great good, a sign of Allah, a source of tranquillity and reward, and the foundation of a healthy society. Preparing for family life begins long before marriage: by honouring and serving one's own parents and family now, learning the rights and duties Islam teaches, building good character — patience, kindness, responsibility, and self-control — and learning the deen so as to one day raise children upon it. The young Muslim should value the home Allah has given them, fulfil their duties within it, and look forward to one day, by Allah's help, building a family of their own founded on a lawful marriage, filled with love and mercy, and devoted to raising a righteous generation. To honour one's parents and family, to value marriage and family life, and to prepare to build a strong and righteous home is to follow Islam's method for the family — and to build, one household at a time, the foundation of a strong and righteous society, while laying up reward with Allah for the life to come.",
        ar: "يَحفَظُ الإسلامُ الأُسرةَ ويُقَوّيها بِشَبَكةٍ مُتَوازِنةٍ مِنَ الحُقوقِ والواجِبات، لِكُلِّ فَردٍ فيها حُقوقٌ تُؤَدّى وواجِباتٌ تُقام، فَتُمسِكُ الأُسرةَ المَحَبّةُ والمَسؤوليّةُ مَعًا. فَبَينَ الزَّوجَينِ يَأمُرُ الإسلامُ بِحُسنِ العِشرة: ﴿وعاشِروهُنَّ بِالمَعروف﴾ (النِّساء ١٩)، وعَلَّمَ النَّبِيُّ ﷺ أنَّ «خَيرَكُم خَيرُكُم لِأهلِهِ وأنا خَيرُكُم لِأهلي». ولِلزَّوجَينِ حُقوقٌ مُتَبادَلة، يَحمِلُ الزَّوجُ مَسؤوليّةَ النَّفَقةِ والحِماية، ويَتَعاوَنانِ في بِناءِ البَيتِ وتَربيةِ الأبناءِ في جَوٍّ مِنَ المَوَدّةِ والرَّحمة. ولِلأبناءِ على الآباءِ حُقوقٌ عَظيمة: الاسمُ الحَسَنُ والحُبُّ والرِّعايةُ والنَّفَقة، وقَبلَ كُلِّ شَيءٍ التَّربيةُ السَّليمةُ في الإيمانِ والخُلُق. ولِلآباءِ على الأبناءِ حُقوقٌ عَظيمة — حُقوقُ التَّوقيرِ والطّاعةِ في المَعروفِ والإحسانِ والرِّعايةِ خاصّةً عِندَ الكِبَر — فَالقُرآنُ يَقرِنُ بِرَّ الوالِدَينِ بِعِبادةِ اللهِ مُباشَرةً: ﴿واعبُدوا اللهَ ولا تُشرِكوا بِهِ شَيئًا وبِالوالِدَينِ إحسانًا﴾ (النِّساء ٣٦). وفَوقَ البَيتِ المُباشِرِ يَأمُرُ الإسلامُ بِصِلةِ الرَّحِمِ بِالأجدادِ والأعمامِ والأخوالِ والأقارِب، ويُحَذِّرُ بِشِدّةٍ مِن قَطعِها. ولَيسَت هذه الحُقوقُ بِناءَ تَسَلُّطٍ بل نِظامًا مُتَوازِنًا مِنَ الحُبِّ والمَسؤوليّةِ يَرعى فيهِ القَويُّ الضَّعيفَ ويُسهِمُ كُلُّ فَردٍ في خَيرِ الجَميع.\n\nوفي قَلبِ مَنهَجِ الإسلامِ لِلأُسرةِ واجِبُ تَربيةِ الجيلِ الصّالِح. وهذا مِن أعظَمِ المَسؤوليّاتِ وأكثَرِها أجرًا مِمّا يَضَعُهُ اللهُ على الآباء، يُعَبِّرُ عَنهُ الأمر: ﴿يا أيُّها الذينَ آمَنوا قوا أنفُسَكُم وأهليكُم نارًا وَقودُها النّاسُ والحِجارة﴾ (التَّحريم ٦). ويُبَيِّنُ العُلَماءُ أنَّ وِقايةَ الأهلِ مِنَ النّارِ تَعليمُهُمُ الإيمانَ والعِبادةَ والخُلُقَ الحَسَن، وأمرُهُم بِالمَعروفِ ونَهيُهُم عنِ المُنكَر، وتَربيَتُهُم على حُبِّ اللهِ وطاعَتِه. والنَّبِيُّ ﷺ المِثالُ الكامِلُ في الرَّحمةِ وحُسنِ تَربيةِ الأطفال، ويَحفَظُ القُرآنُ نَموذَجَ لُقمانَ البَديعَ إذ وَصّى ابنَهُ بِأهَمِّ الدُّروس: ألّا يُشرِكَ بِالله، وأن يُقيمَ الصَّلاة، ويَأمُرَ بِالمَعروفِ ويَنهى عنِ المُنكَر، ويَصبِرَ، ويَتَواضَعَ ويَرفُقَ بِالنّاسِ (لُقمان ١٣-١٩). والوَلَدُ الصّالِحُ كَنزٌ باقٍ لِلوالِدَينِ أيضًا: عَلَّمَ النَّبِيُّ ﷺ أنَّ الإنسانَ إذا ماتَ انقَطَعَ عَمَلُهُ إلّا مِن ثَلاثٍ مِنها «وَلَدٌ صالِحٌ يَدعو لَه» — فَحُسنُ التَّربيةِ يَجلِبُ أجرًا يَستَمِرُّ حتّى بَعدَ المَوت. ولِهذا كُلِّهِ يولي الإسلامُ اختيارَ الزَّوجِ ذي الدّينِ والخُلُقِ أهَمّيّةً كُبرى أساسًا لِلأُسرةِ الصّالِحة، وقَد أوصى النَّبِيُّ ﷺ بِاختيارِ ذاتِ الدّينِ قَبلَ كُلِّ شَيء.\n\nوهذا كُلُّهُ يَعني لِلشّابِّ المُسلِمِ أنَّ الأُسرةَ لَيسَت أمرًا صَغيرًا أوِ اختياريًّا يُستَهانُ بِه، بل مِن أهَمِّ مَيادينِ الإيمانِ والحَياة، تَستَحِقُّ التَّقديرَ والإكرامَ والاستِعداد. وفي زَمَنٍ تَعُدُّ فيهِ بَعضُ الأفكارِ الزَّواجَ والأُسرةَ أعباءً أو شَيئًا بالِيًا أو غَيرَ مُهِمّ، يَفهَمُ الشّابُّ المُؤمِنُ أنَّ الأُسرةَ خَيرٌ عَظيم، وآيةٌ مِن آياتِ الله، ومَصدَرُ سَكَنٍ وأجر، وأساسُ مُجتَمَعٍ سَليم. والاستِعدادُ لِحَياةِ الأُسرةِ يَبدَأُ قَبلَ الزَّواجِ بِزَمَنٍ طَويل: بِبِرِّ الوالِدَينِ والأُسرةِ وخِدمَتِهِمِ الآن، وتَعَلُّمِ الحُقوقِ والواجِباتِ التي يُعَلِّمُها الإسلام، وبِناءِ الخُلُقِ الحَسَن — الصَّبرِ والرِّفقِ والمَسؤوليّةِ وضَبطِ النَّفس — وتَعَلُّمِ الدّينِ لِيُرَبّيَ يَومًا أبناءَهُ علَيه. فَلْيُقَدِّرِ الشّابُّ المُسلِمُ البَيتَ الذي أعطاهُ الله، ولْيُؤَدِّ واجِباتِهِ فيه، ولْيَتَطَلَّع أن يَبنيَ يَومًا بِعَونِ اللهِ أُسرةً لَهُ مُؤَسَّسةً على زَواجٍ شَرعيّ، مَملوءةً مَوَدّةً ورَحمة، مُكَرَّسةً لِتَربيةِ جيلٍ صالِح. وأن يَبَرَّ المَرءُ والِدَيهِ وأُسرَتَه، ويُقَدِّرَ الزَّواجَ وحَياةَ الأُسرة، ويَستَعِدَّ لِبِناءِ بَيتٍ قَويٍّ صالِح، اتِّباعٌ لِمَنهَجِ الإسلامِ في الأُسرة — وبِناءٌ، بَيتًا بَيتًا، لِأساسِ مُجتَمَعٍ قَويٍّ صالِح، معَ ادِّخارِ الأجرِ عِندَ اللهِ لِلحَياةِ الآتية.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does Ar-Rum 21 say Allah placed between spouses?", ar: "ماذا تَقولُ الرّوم ٢١ إنَّ اللهَ جَعَلَهُ بَينَ الزَّوجَين؟" },
      options: [
        { en: "Affection (mawaddah) and mercy (rahmah)", ar: "المَوَدّةَ والرَّحمة" },
        { en: "Wealth and fame", ar: "المالَ والشُّهرة" },
        { en: "Conflict", ar: "الخِصام" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "Marriage is for tranquillity, with love and mercy between spouses.", ar: "الزَّواجُ لِلسَّكَن، بِمَوَدّةٍ ورَحمةٍ بَينَ الزَّوجَين." },
    },
    {
      prompt: { en: "On what does Islam build the family?", ar: "على ماذا يَبني الإسلامُ الأُسرة؟" },
      options: [
        { en: "A lawful, honoured marriage", ar: "زَواجٍ شَرعيٍّ مُكَرَّم" },
        { en: "Casual relationships", ar: "عَلاقاتٍ عابِرة" },
        { en: "Wealth alone", ar: "المالِ وَحدَه" },
        { en: "Chance", ar: "الصُّدفة" },
      ],
      correctIndex: 0,
      explanation: { en: "Marriage is 'a solemn covenant' and the only lawful foundation.", ar: "الزَّواجُ «ميثاقٌ غَليظ» والأساسُ الشَّرعيُّ الوَحيد." },
    },
    {
      prompt: { en: "What does At-Tahrim 6 command parents to do?", ar: "بِمَ تَأمُرُ التَّحريم ٦ الآباء؟" },
      options: [
        { en: "Protect themselves and their families from the Fire", ar: "وِقايةَ أنفُسِهِم وأهليهِمِ النّار" },
        { en: "Neglect their children", ar: "إهمالَ أبنائِهِم" },
        { en: "Seek only wealth", ar: "طَلَبَ المالِ فَقَط" },
        { en: "Avoid family life", ar: "تَجَنُّبَ حَياةِ الأُسرة" },
      ],
      correctIndex: 0,
      explanation: { en: "By teaching them faith and good character.", ar: "بِتَعليمِهِمِ الإيمانَ والخُلُقَ الحَسَن." },
    },
    {
      prompt: { en: "What is the believer's duty toward parents (birr al-walidayn)?", ar: "ما واجِبُ المُؤمِنِ نَحوَ الوالِدَين (بِرُّ الوالِدَين)؟" },
      options: [
        { en: "Honour, kindness, and care, joined to worship of Allah", ar: "التَّوقيرُ والإحسانُ والرِّعاية، مَقرونًا بِعِبادةِ الله" },
        { en: "Ignoring them", ar: "تَجاهُلُهُما" },
        { en: "Obeying them in disobeying Allah", ar: "طاعَتُهُما في مَعصيةِ الله" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "'Worship Allah... and to parents do good' (An-Nisa 36).", ar: "﴿واعبُدوا اللهَ... وبِالوالِدَينِ إحسانًا﴾ (النِّساء ٣٦)." },
    },
    {
      prompt: { en: "Which is the most important quality to seek in a spouse?", ar: "ما أهَمُّ صِفةٍ تُطلَبُ في الزَّوج؟" },
      options: [
        { en: "Sound religion and good character", ar: "الدّينُ والخُلُقُ الحَسَن" },
        { en: "Wealth only", ar: "المالُ فَقَط" },
        { en: "Fame only", ar: "الشُّهرةُ فَقَط" },
        { en: "Nothing matters", ar: "لا شَيءَ يُهِمّ" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ advised choosing the one of religion.", ar: "أوصى النَّبِيُّ ﷺ بِاختيارِ ذاتِ الدّين." },
    },
    {
      prompt: { en: "True or False: The family is a small, optional matter that a Muslim may dismiss.", ar: "صَوابٌ أم خَطأ: الأُسرةُ أمرٌ صَغيرٌ اختياريٌّ يُستَهانُ بِه." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "The family is the foundation of society and a great field of faith and reward.", ar: "الأُسرةُ أساسُ المُجتَمَعِ ومَيدانُ إيمانٍ وأجرٍ عَظيم." },
    },
  ],
};
