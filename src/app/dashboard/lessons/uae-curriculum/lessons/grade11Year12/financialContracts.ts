import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const financialContracts: CourseLesson = {
  slug: "g11y12-financial-contracts-in-islam",
  name: { en: "Financial Contracts in Islam", ar: "العُقودُ المالِيّةُ في الإسلام" },
  shortIntro: {
    en: "Islam organises financial dealings through clear contracts ('uqud) built on honesty, mutual consent, and justice, and free from riba (interest), gharar (excessive uncertainty), and deception. This lesson studies the meaning and conditions of valid contracts, the major types (sale, partnership, lease, loan), the prohibitions that protect them, and how a young Muslim deals honestly and lawfully in money in the modern economy.",
    ar: "يُنَظِّمُ الإسلامُ المُعامَلاتِ المالِيّةَ بِعُقودٍ واضِحةٍ مَبنيّةٍ على الصِّدقِ والتَّراضي والعَدل، خالِيةٍ مِنَ الرِّبا والغَرَرِ والخِداع. يَدرُسُ هذا الدَّرسُ مَعنى العُقودِ الصَّحيحةِ وشُروطَها، وأنواعَها الكُبرى (البَيع، الشَّرِكة، الإجارة، القَرض)، والمُحَرَّماتِ التي تَحميها، وكَيفَ يَتَعامَلُ الشّابُّ المُسلِمُ بِصِدقٍ وحَلالٍ في المالِ في الاقتِصادِ الحَديث.",
  },
  quranSurahs: ["Al-Ma'idah 1", "Al-Baqarah 275"],
  sections: [
    {
      title: { en: "The foundations of financial contracts", ar: "أُسُسُ العُقودِ المالِيّة" },
      learningObjectives: [
        { en: "Define a financial contract ('aqd) and its conditions.", ar: "أُعَرِّفُ العَقدَ المالِيَّ وشُروطَه." },
        { en: "Explain the principles of honesty, consent, and justice.", ar: "أشرَحُ مَبادِئَ الصِّدقِ والتَّراضي والعَدل." },
      ],
      successCriteria: [
        { en: "I can explain Al-Ma'idah 1 and Al-Baqarah 275.", ar: "أشرَحُ المائِدةَ ١ والبَقَرةَ ٢٧٥." },
        { en: "I can state the conditions of a valid contract.", ar: "أذكُرُ شُروطَ العَقدِ الصَّحيح." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Records and contracts — fairness in dealings.", ar: "سِجِلّاتٌ وعُقود — العَدلُ في المُعامَلات." },
        caption: { en: "'O you who believe, fulfil your contracts' (Al-Ma'idah 1).", ar: "﴿يا أيُّها الذينَ آمَنوا أوفوا بِالعُقود﴾ (المائِدة ١)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does Islam place rules on how we earn and trade?", ar: "لِمَ يَضَعُ الإسلامُ ضَوابِطَ على كَيفِيّةِ الكَسبِ والتِّجارة؟" },
        body: {
          en: "Money and trade are part of everyone's life, and many people think that in business 'anything goes' as long as one makes a profit. Islam teaches that earning and trade are not outside religion: they are acts that can be worship when done lawfully and sin when done unlawfully. Islam permits trade and profit, but organises dealings through clear contracts built on honesty, consent, and justice, and forbids riba, deception, and exploitation. Reflect: why does Islam place rules on how we earn and trade rather than leaving money to 'anything goes' — and how do these rules protect both the individual and society?",
          ar: "المالُ والتِّجارةُ جُزءٌ مِن حَياةِ كُلِّ أحَد، ويَظُنُّ كَثيرونَ أنَّ في التِّجارةِ «كُلَّ شَيءٍ مُباح» ما دامَ يَربَح. ويُعَلِّمُ الإسلامُ أنَّ الكَسبَ والتِّجارةَ لَيسا خارِجَ الدّين: بل أعمالٌ تَكونُ عِبادةً إذا كانَت حَلالًا، وإثمًا إذا كانَت حَرامًا. يُبيحُ الإسلامُ التِّجارةَ والرِّبح، لكِنَّهُ يُنَظِّمُ المُعامَلاتِ بِعُقودٍ واضِحةٍ مَبنيّةٍ على الصِّدقِ والتَّراضي والعَدل، ويُحَرِّمُ الرِّبا والخِداعَ والاستِغلال. تَأمَّل: لِمَ يَضَعُ الإسلامُ ضَوابِطَ على كَيفِيّةِ الكَسبِ والتِّجارةِ بَدَلَ تَركِ المالِ لِـ«كُلِّ شَيءٍ مُباح» — وكَيفَ تَحمي هذه الضَّوابِطُ الفَردَ والمُجتَمَعَ مَعًا؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "'Aqd (عَقد): a binding agreement between parties. Riba (الرِّبا): interest/usury. Gharar (الغَرَر): excessive uncertainty.", ar: "العَقد: اتِّفاقٌ مُلزِمٌ بَينَ طَرَفَين. الرِّبا: الزِّيادةُ المُحَرَّمة. الغَرَر: الجَهالةُ الفاحِشة." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Al-Baqarah 275: 'Allah has permitted trade and forbidden riba.'", ar: "البَقَرة ٢٧٥: ﴿وأحَلَّ اللهُ البَيعَ وحَرَّمَ الرِّبا﴾." },
          ],
        },
      ],
      body: {
        en: "Islam is a complete way of life that organises not only worship and belief but also the dealings of people in money and trade. Financial contracts ('uqud, singular 'aqd) — agreements such as buying and selling, partnership, leasing, lending, and hiring — are a major part of human life, and Islam, rather than leaving them to chaos or to the rule of 'anything goes,' organises them through clear principles and rulings that protect the rights of all parties and bring justice and blessing to the economy. The foundation is Allah's command: 'O you who believe, fulfil your contracts' (Al-Ma'idah 1) — a command to honour agreements, keep one's word, and meet one's obligations, which is the basis of all trust in dealings. And Islam makes clear that earning and trade are not outside religion: lawful earning is itself a form of worship and a duty, the honest trader is praised by the Prophet ﷺ as being 'with the Prophets, the truthful, and the martyrs,' and unlawful earning is a sin that destroys blessing and brings the wrath of Allah.\n\nFor a financial contract to be valid in Islam, it must meet certain conditions that ensure justice and prevent dispute and exploitation. Among the most important: mutual consent (at-taradi) — both parties must agree freely, without compulsion, fraud, or coercion, for the Prophet ﷺ said, 'Trade is only by mutual consent,' and Allah forbids consuming wealth wrongfully 'except that it be a trade by mutual consent' (An-Nisa 29). The parties must be competent to contract (of sound mind and the legal capacity to deal). The subject of the contract must be something lawful (one cannot validly contract over wine, pork, or anything Allah has forbidden) and must be owned or rightfully disposable by the seller. The terms must be clear and known — the price, the goods, the quantity, and the conditions — so that there is no major uncertainty (gharar) that leads to dispute. And the contract must be free of riba (interest), deception, and injustice. When these conditions are met, the contract is valid and binding, and both parties are obliged to fulfil it.\n\nThree great principles run through all of Islam's organisation of financial dealings: honesty, consent, and justice. Honesty (sidq and amanah) requires truthfulness about the goods, the price, and any defects; the Prophet ﷺ said, 'The two parties to a sale have the choice as long as they have not parted; if they are truthful and make things clear, their transaction is blessed, but if they conceal and lie, the blessing of their transaction is wiped out.' Consent requires that the agreement be free and willing, with no fraud, coercion, or exploitation of need or ignorance. And justice requires fairness in price and terms, the prohibition of exploiting the weak, and the removal of all forms of oppression from dealings. Around these principles, Islam builds specific prohibitions that protect them — above all the prohibition of riba (interest), which Allah condemned in the strongest terms: 'Allah has permitted trade and forbidden riba' (Al-Baqarah 275); the prohibition of gharar (excessive uncertainty and gambling-like transactions); and the prohibition of cheating, fraud, hoarding to drive up prices, and consuming people's wealth unjustly. In the next section, we will look at the major types of contracts Islam permits and the prohibitions that protect them, and how a young Muslim deals honestly and lawfully in money in the modern economy.",
        ar: "الإسلامُ مَنهَجُ حَياةٍ كامِلٌ يُنَظِّمُ لا العِبادةَ والعَقيدةَ فَحَسب بل مُعامَلاتِ النّاسِ في المالِ والتِّجارة. والعُقودُ المالِيّةُ — كَالبَيعِ والشِّراءِ والشَّرِكةِ والإجارةِ والقَرضِ والاستِئجار — جُزءٌ كَبيرٌ مِن حَياةِ النّاس، والإسلامُ، بَدَلَ أن يَترُكَها لِلفَوضى أو لِحُكمِ «كُلِّ شَيءٍ مُباح»، يُنَظِّمُها بِمَبادِئَ وأحكامٍ واضِحةٍ تَحفَظُ حُقوقَ الجَميعِ وتَجلِبُ العَدلَ والبَرَكةَ لِلاقتِصاد. والأساسُ قَولُ الله: ﴿يا أيُّها الذينَ آمَنوا أوفوا بِالعُقود﴾ (المائِدة ١) — أمرٌ بِالوَفاءِ بِالعُهودِ وحِفظِ الكَلِمةِ وأداءِ الالتِزامات، وهو أساسُ كُلِّ ثِقةٍ في المُعامَلات. ويُبَيِّنُ الإسلامُ أنَّ الكَسبَ والتِّجارةَ لَيسا خارِجَ الدّين: فَالكَسبُ الحَلالُ عِبادةٌ وواجِب، والتّاجِرُ الصَّدوقُ أثنى علَيهِ النَّبِيُّ ﷺ بِأنَّهُ «معَ النَّبِيّينَ والصِّدّيقينَ والشُّهَداء»، والكَسبُ الحَرامُ إثمٌ يَمحَقُ البَرَكةَ ويَجلِبُ سَخَطَ الله.\n\nولِكَي يَصِحَّ العَقدُ المالِيُّ في الإسلامِ لا بُدَّ مِن شُروطٍ تَضمَنُ العَدلَ وتَمنَعُ النِّزاعَ والاستِغلال. ومِن أهَمِّها: التَّراضي — أن يَتَّفِقَ الطَّرَفانِ بِحُرّيّةٍ بِلا إكراهٍ ولا غِشٍّ ولا قَهر، فَقالَ النَّبِيُّ ﷺ: «إنَّما البَيعُ عن تَراض»، وحَرَّمَ اللهُ أكلَ المالِ بِالباطِلِ ﴿إلّا أن تَكونَ تِجارةً عن تَراضٍ مِنكُم﴾ (النِّساء ٢٩). وأن يَكونَ العاقِدانِ أهلًا لِلتَّعاقُد (عاقِلَينِ ذَوَي أهلِيّة). وأن يَكونَ مَحَلُّ العَقدِ حَلالًا (فَلا يَصِحُّ العَقدُ على خَمرٍ أو خِنزيرٍ أو ما حَرَّمَ الله) ومَملوكًا لِلبائِعِ أو مَأذونًا لَهُ فيه. وأن تَكونَ الشُّروطُ واضِحةً مَعلومةً — الثَّمَنُ والمَبيعُ والمِقدارُ والشُّروط — فَلا غَرَرَ فاحِشٌ يُؤَدّي إلى النِّزاع. وأن يَخلوَ العَقدُ مِنَ الرِّبا والخِداعِ والظُّلم. فَإذا تَوَفَّرَت هذه الشُّروطُ صَحَّ العَقدُ ولَزِم، ووَجَبَ على الطَّرَفَينِ الوَفاءُ بِه.\n\nوثَلاثةُ مَبادِئَ عَظيمةٍ تَسري في كُلِّ تَنظيمِ الإسلامِ لِلمُعامَلاتِ المالِيّة: الصِّدقُ والتَّراضي والعَدل. فَالصِّدقُ والأمانةُ يوجِبانِ الصِّدقَ في السِّلعةِ والثَّمَنِ وبَيانَ العُيوب؛ قالَ النَّبِيُّ ﷺ: «البَيِّعانِ بِالخِيارِ ما لَم يَتَفَرَّقا، فَإن صَدَقا وبَيَّنا بورِكَ لَهُما في بَيعِهِما، وإن كَتَما وكَذَبا مُحِقَت بَرَكةُ بَيعِهِما». والتَّراضي يوجِبُ أن يَكونَ الاتِّفاقُ حُرًّا طائِعًا بِلا غِشٍّ ولا إكراهٍ ولا استِغلالِ حاجةٍ أو جَهل. والعَدلُ يوجِبُ الإنصافَ في الثَّمَنِ والشُّروط، وتَحريمَ استِغلالِ الضَّعيف، ورَفعَ كُلِّ ظُلمٍ عنِ المُعامَلات. وحَولَ هذه المَبادِئِ يَبني الإسلامُ مُحَرَّماتٍ مُحَدَّدةً تَحميها — وعلى رَأسِها تَحريمُ الرِّبا الذي ذَمَّهُ اللهُ بِأشَدِّ العِبارات: ﴿وأحَلَّ اللهُ البَيعَ وحَرَّمَ الرِّبا﴾ (البَقَرة ٢٧٥)؛ وتَحريمُ الغَرَر (الجَهالةِ الفاحِشةِ والمُعامَلاتِ شِبهِ القُمار)؛ وتَحريمُ الغِشِّ والاحتِكارِ وأكلِ أموالِ النّاسِ بِالباطِل. وفي القِسمِ التّالي نَنظُرُ في أنواعِ العُقودِ التي يُبيحُها الإسلامُ والمُحَرَّماتِ التي تَحميها، وكَيفَ يَتَعامَلُ الشّابُّ المُسلِمُ بِصِدقٍ وحَلالٍ في المالِ في الاقتِصادِ الحَديث.",
      },
    },
    {
      title: { en: "Types of contracts and the prohibitions that protect them", ar: "أنواعُ العُقودِ والمُحَرَّماتُ التي تَحميها" },
      learningObjectives: [
        { en: "Identify the major types of valid contracts.", ar: "أُحَدِّدُ أنواعَ العُقودِ الصَّحيحةِ الكُبرى." },
        { en: "Explain riba, gharar, and deception and how to avoid them.", ar: "أشرَحُ الرِّبا والغَرَرَ والخِداعَ وكَيفَ أتَجَنَّبُها." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A just economy serves the whole community.", ar: "اقتِصادٌ عادِلٌ يَخدُمُ المُجتَمَعَ كُلَّه." },
        caption: { en: "'Allah has permitted trade and forbidden riba' (Al-Baqarah 275).", ar: "﴿وأحَلَّ اللهُ البَيعَ وحَرَّمَ الرِّبا﴾ (البَقَرة ٢٧٥)." },
      },
      groupTasks: {
        title: { en: "Dealing lawfully in money", ar: "التَّعامُلُ الحَلالُ في المال" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "types-of-contracts",
            name: { en: "Team A — Types of lawful contracts", ar: "الفَريقُ أ — أنواعُ العُقودِ الحَلال" },
            learningObjective: { en: "Present the major types of valid Islamic contracts.", ar: "نَعرِضُ أنواعَ العُقودِ الإسلاميّةِ الصَّحيحةِ الكُبرى." },
            task: { en: "Present the major types of valid financial contracts in Islam with a simple example of each: sale (bay') — exchange of goods for a price; partnership (sharikah/mudarabah) — sharing capital and/or labour and dividing profit and loss justly; lease/hire (ijarah) — renting property or hiring labour for a known wage; and the loan (qard hasan) — a benevolent interest-free loan that is an act of charity. Explain the basic conditions of each and how they reflect honesty, consent, and justice. Present a 'types of contracts' chart.", ar: "اعرِضوا أنواعَ العُقودِ المالِيّةِ الصَّحيحةِ الكُبرى في الإسلامِ معَ مِثالٍ بَسيطٍ لِكُلٍّ: البَيعُ — مُبادَلةُ سِلعةٍ بِثَمَن؛ والشَّرِكةُ والمُضارَبةُ — اشتِراكٌ في المالِ و/أوِ العَمَلِ وقِسمةُ الرِّبحِ والخَسارةِ بِعَدل؛ والإجارةُ — كِراءُ عَينٍ أوِ استِئجارُ عَمَلٍ بِأجرٍ مَعلوم؛ والقَرضُ الحَسَنُ — قَرضٌ بِلا فائِدةٍ هو صَدَقةٌ وإحسان. اشرَحوا شُروطَ كُلٍّ الأساسيّةَ وكَيفَ تَعكِسُ الصِّدقَ والتَّراضي والعَدل. اعرِضوا لَوحةَ «أنواعِ العُقود»." },
            evidence: [
              { en: "'Allah has permitted trade' (Al-Baqarah 275).", ar: "﴿وأحَلَّ اللهُ البَيع﴾ (البَقَرة ٢٧٥)." },
            ],
            sourceNotes: [
              { en: "Valid contracts rest on honesty, consent, and justice.", ar: "العُقودُ الصَّحيحةُ على الصِّدقِ والتَّراضي والعَدل." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'types of contracts' chart.", ar: "لَوحةُ «أنواعِ العُقود»." },
          },
          {
            slug: "prohibitions",
            name: { en: "Team B — Riba, gharar, and deception", ar: "الفَريقُ ب — الرِّبا والغَرَرُ والخِداع" },
            learningObjective: { en: "Present the major prohibitions and how to avoid them today.", ar: "نَعرِضُ المُحَرَّماتِ الكُبرى وكَيفَ نَتَجَنَّبُها اليَوم." },
            task: { en: "Present the major prohibitions that Islam places to protect financial dealings, and how a young Muslim avoids them in the modern economy: riba (interest) — the increase taken on loans or in certain exchanges, forbidden in the strongest terms, and a warning to avoid interest-based loans, credit, and accounts where lawful alternatives exist; gharar (excessive uncertainty) — gambling, betting, and contracts where the outcome or goods are unknown; and deception — cheating in weights, measures, descriptions, and prices, hiding defects, and fraud. Explain why these are forbidden (they cause injustice and harm) and give practical guidance for dealing lawfully today. Present a 'lawful dealing' guide.", ar: "اعرِضوا المُحَرَّماتِ الكُبرى التي وَضَعَها الإسلامُ لِحِمايةِ المُعامَلاتِ المالِيّة، وكَيفَ يَتَجَنَّبُها الشّابُّ المُسلِمُ في الاقتِصادِ الحَديث: الرِّبا — الزِّيادةُ المَأخوذةُ على القُروضِ أو في بَعضِ المُبادَلات، مُحَرَّمٌ بِأشَدِّ العِبارات، معَ التَّحذيرِ مِنَ القُروضِ والبِطاقاتِ والحِساباتِ الرِّبَويّةِ حَيثُ تَتَوَفَّرُ البَدائِلُ الحَلال؛ والغَرَرُ — القِمارُ والمُراهَناتُ والعُقودُ المَجهولةُ النَّتيجةِ أوِ السِّلعة؛ والخِداعُ — الغِشُّ في الكَيلِ والوَزنِ والوَصفِ والثَّمَن، وكِتمانُ العُيوب، والاحتِيال. اشرَحوا لِمَ حُرِّمَت (لِما فيها مِن ظُلمٍ وضَرَر) وأعطوا إرشادًا عَمَليًّا لِلتَّعامُلِ الحَلالِ اليَوم. اعرِضوا دَليلَ «التَّعامُلِ الحَلال»." },
            evidence: [
              { en: "'Whoever cheats us is not one of us' (Muslim).", ar: "«مَن غَشَّنا فَلَيسَ مِنّا» (مُسلِم)." },
            ],
            sourceNotes: [
              { en: "Prohibitions protect justice and remove harm.", ar: "المُحَرَّماتُ تَحفَظُ العَدلَ وتَرفَعُ الضَّرَر." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'lawful dealing' guide.", ar: "دَليلُ «التَّعامُلِ الحَلال»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Honest dealing in money", ar: "الصِّدقُ في التَّعامُلِ المالِيّ" },
        prompt: { en: "Islam organises financial dealings through clear contracts built on honesty, consent, and justice, and free from riba, gharar, and deception — because lawful earning is worship and unlawful earning destroys blessing. Reflect on money in your own life and the world around you: where do you see honest, lawful dealing, and where do you see riba, cheating, or injustice? Write about why dealing honestly and lawfully in money matters to a believer, and describe how you intend to deal with money lawfully — naming at least two specific things you will do or avoid (such as avoiding interest, being honest in buying and selling, fulfilling agreements, or earning only from lawful sources).", ar: "يُنَظِّمُ الإسلامُ المُعامَلاتِ المالِيّةَ بِعُقودٍ واضِحةٍ مَبنيّةٍ على الصِّدقِ والتَّراضي والعَدل، خالِيةٍ مِنَ الرِّبا والغَرَرِ والخِداع — لِأنَّ الكَسبَ الحَلالَ عِبادةٌ والحَرامَ يَمحَقُ البَرَكة. تَأمَّل المالَ في حَياتِكَ والعالَمِ حَولَك: أينَ تَرى التَّعامُلَ الصّادِقَ الحَلال، وأينَ تَرى الرِّبا أوِ الغِشَّ أوِ الظُّلم؟ اكتُب لِمَ يُهِمُّ المُؤمِنَ التَّعامُلُ الصّادِقُ الحَلالُ في المال، وصِف كَيفَ تَنوي التَّعامُلَ بِالمالِ حَلالًا — ذاكِرًا أمرَينِ مُحَدَّدَينِ على الأقَلِّ سَتَفعَلُهُما أو تَتَجَنَّبُهُما (كَتَجَنُّبِ الرِّبا، والصِّدقِ في البَيعِ والشِّراء، والوَفاءِ بِالعُهود، أوِ الكَسبِ مِنَ الحَلالِ فَقَط)." },
        placeholder: { en: "Honest dealing matters because... I will... and I will avoid...", ar: "الصِّدقُ في التَّعامُلِ يُهِمُّ لِأنَّ... وسَأفعَلُ... وسَأتَجَنَّبُ..." },
      },
      body: {
        en: "Islam permits a wide range of financial contracts by which people meet their needs, build wealth, and serve one another, as long as these contracts follow its principles of honesty, consent, and justice. The most common is the sale (bay'), the exchange of goods for a price, which Allah explicitly permitted: 'Allah has permitted trade' (Al-Baqarah 275); a valid sale requires clear knowledge of the goods and price, ownership of what is sold, mutual consent, and truthfulness about quality and defects. Partnership contracts allow people to pool resources for mutual benefit: in a sharikah, partners share capital, work, profit, and loss; in mudarabah, one party provides capital and the other provides labour and expertise, sharing the profit by agreement while the loss is borne by the capital provider — a just arrangement that ties reward to real risk and effort, unlike interest. The lease or hire contract (ijarah) allows renting property or hiring labour and services for a known wage and period, and it is the basis of much lawful employment and rental. And the benevolent loan (qard hasan) is an interest-free loan given to help someone in need, which Islam treats not as a means of profit but as an act of charity and brotherhood, greatly rewarded by Allah. Through these and other contracts, Islam provides a complete, flexible, and just framework for economic life.\n\nTo protect these dealings and keep them just, Islam forbids certain practices in the strongest terms, chief among them riba (interest or usury). Riba is the unlawful increase taken in loans or in certain exchanges — most clearly, the increase a lender takes from a borrower simply for the loan of money over time. Allah condemned riba more severely than almost any other financial sin: 'Allah has permitted trade and forbidden riba' (Al-Baqarah 275), and He declared war from Himself and His Messenger upon those who persist in it (Al-Baqarah 279). The wisdom is clear: riba is injustice, for it guarantees the lender an increase while placing all risk on the borrower, exploits the needy, concentrates wealth in few hands, and separates profit from real effort and risk — corrupting the economy and oppressing the weak. Islam therefore commands the believer to avoid interest-based loans, accounts, and credit wherever lawful alternatives exist, and provides just alternatives such as partnership, lawful trade, and the benevolent loan. Alongside riba, Islam forbids gharar — excessive uncertainty, gambling, and betting, where one party gains and another loses by pure chance and the outcome or goods are unknown — and it forbids all forms of deception and cheating: lying about goods, hiding defects, cheating in weights and measures, fraud, and hoarding goods to drive up prices. The Prophet ﷺ declared, 'Whoever cheats us is not one of us' (Muslim).\n\nFor a young Muslim living and earning in the modern economy, these principles are a practical guide to dealing honestly and lawfully in money — a matter of real religious importance, for the Prophet ﷺ warned that a time would come when people would not care whether what they took was lawful or unlawful, and he taught that a body nourished by the unlawful is more deserving of the Fire. The young Muslim should therefore strive to earn only from lawful sources; to be honest and clear in all buying, selling, and dealings; to fulfil their contracts, debts, and agreements faithfully, as Allah commanded; to avoid riba in loans, credit cards, and accounts wherever lawful alternatives exist, and to seek out Islamic financial alternatives; to avoid gambling, betting, and uncertain speculative dealings; and never to cheat, deceive, or consume others' wealth unjustly. They should also remember that lawful earning is itself a noble act, that the honest trader is greatly honoured, and that wealth earned and spent lawfully is a blessing, while wealth earned unlawfully destroys blessing and brings ruin. To deal in money with honesty, consent, and justice, avoiding riba, gharar, and deception — this is how a believer makes their economic life a part of their worship of Allah, brings blessing to their wealth, and contributes to a just and trustworthy society.",
        ar: "يُبيحُ الإسلامُ طائِفةً واسِعةً مِنَ العُقودِ المالِيّةِ التي يَقضي بِها النّاسُ حاجاتِهِم ويُنَمّونَ أموالَهُم ويَخدِمُ بَعضُهُم بَعضًا، ما دامَت تَتبَعُ مَبادِئَهُ في الصِّدقِ والتَّراضي والعَدل. وأشيَعُها البَيعُ، مُبادَلةُ سِلعةٍ بِثَمَن، وقَد أباحَهُ اللهُ صَراحةً: ﴿وأحَلَّ اللهُ البَيع﴾ (البَقَرة ٢٧٥)؛ ويَشتَرِطُ البَيعُ الصَّحيحُ العِلمَ بِالمَبيعِ والثَّمَن، ومِلكَ المَبيع، والتَّراضي، والصِّدقَ في الوَصفِ وبَيانِ العُيوب. وعُقودُ الشَّرِكةِ تُتيحُ لِلنّاسِ جَمعَ مَواردِهِم لِلنَّفعِ المُتَبادَل: فَفي الشَّرِكةِ يَشتَرِكونَ في المالِ والعَمَلِ والرِّبحِ والخَسارة؛ وفي المُضارَبةِ يُقَدِّمُ طَرَفٌ المالَ وآخَرُ العَمَلَ والخِبرة، ويَقتَسِمانِ الرِّبحَ بِالاتِّفاقِ والخَسارةُ على صاحِبِ المال — وهو تَرتيبٌ عادِلٌ يَربِطُ الجَزاءَ بِالمُخاطَرةِ والجُهدِ الحَقيقيِّ، بِخِلافِ الرِّبا. وعَقدُ الإجارةِ يُتيحُ كِراءَ الأعيانِ أوِ استِئجارَ العَمَلِ والخِدماتِ بِأجرٍ ومُدّةٍ مَعلومَين، وهو أساسُ كَثيرٍ مِنَ التَّوظيفِ والكِراءِ الحَلال. والقَرضُ الحَسَنُ قَرضٌ بِلا فائِدةٍ يُعطى عَونًا لِمُحتاج، يَجعَلُهُ الإسلامُ لا وَسيلةَ رِبحٍ بل صَدَقةً وأُخُوّةً عَظيمةَ الأجرِ عِندَ الله. وبِهذه العُقودِ وغَيرِها يُقَدِّمُ الإسلامُ إطارًا كامِلًا مَرِنًا عادِلًا لِلحَياةِ الاقتِصاديّة.\n\nولِحِفظِ هذه المُعامَلاتِ وإبقائِها عادِلةً يُحَرِّمُ الإسلامُ مُمارَساتٍ بِأشَدِّ العِبارات، على رَأسِها الرِّبا. والرِّبا الزِّيادةُ المُحَرَّمةُ في القُروضِ أو في بَعضِ المُبادَلات — وأظهَرُها الزِّيادةُ التي يَأخُذُها المُقرِضُ مِنَ المُقتَرِضِ لِمُجَرَّدِ قَرضِ المالِ عَبرَ الزَّمَن. وقَد ذَمَّ اللهُ الرِّبا أشَدَّ مِن كادَ أيِّ إثمٍ مالِيٍّ آخَر: ﴿وأحَلَّ اللهُ البَيعَ وحَرَّمَ الرِّبا﴾ (البَقَرة ٢٧٥)، وأعلَنَ الحَربَ مِنهُ ومِن رَسولِهِ على المُصِرّينَ علَيه (البَقَرة ٢٧٩). والحِكمةُ واضِحة: الرِّبا ظُلمٌ، يَضمَنُ لِلمُقرِضِ زِيادةً ويُلقي كُلَّ المُخاطَرةِ على المُقتَرِض، ويَستَغِلُّ المُحتاج، ويُرَكِّزُ الثَّروةَ في أيدٍ قَليلة، ويَفصِلُ الرِّبحَ عنِ الجُهدِ والمُخاطَرةِ الحَقيقيّة — فَيُفسِدُ الاقتِصادَ ويَظلِمُ الضَّعيف. فَيَأمُرُ الإسلامُ المُؤمِنَ بِتَجَنُّبِ القُروضِ والحِساباتِ والبِطاقاتِ الرِّبَويّةِ حَيثُ تَتَوَفَّرُ البَدائِلُ الحَلال، ويُقَدِّمُ بَدائِلَ عادِلةً كَالشَّرِكةِ والتِّجارةِ الحَلالِ والقَرضِ الحَسَن. ومعَ الرِّبا يُحَرِّمُ الإسلامُ الغَرَرَ — الجَهالةَ الفاحِشةَ والقِمارَ والمُراهَنة، حَيثُ يَربَحُ طَرَفٌ ويَخسَرُ آخَرُ بِمَحضِ الصُّدفةِ والنَّتيجةُ أوِ السِّلعةُ مَجهولة — ويُحَرِّمُ كُلَّ صُوَرِ الخِداعِ والغِشّ: الكَذِبَ في السِّلعة، وكِتمانَ العُيوب، والغِشَّ في الكَيلِ والوَزن، والاحتِيال، واحتِكارَ السِّلَعِ لِرَفعِ الأسعار. قالَ النَّبِيُّ ﷺ: «مَن غَشَّنا فَلَيسَ مِنّا» (مُسلِم).\n\nوهذه المَبادِئُ لِلشّابِّ المُسلِمِ الذي يَعيشُ ويَكسِبُ في الاقتِصادِ الحَديثِ دَليلٌ عَمَليٌّ لِلتَّعامُلِ الصّادِقِ الحَلالِ في المال — وهو أمرٌ دينيٌّ بالِغُ الأهَمّيّة، فَقَد حَذَّرَ النَّبِيُّ ﷺ مِن زَمَنٍ لا يُبالي فيهِ المَرءُ أمِن حَلالٍ أخَذَ المالَ أم مِن حَرام، وعَلَّمَ أنَّ الجَسَدَ الذي نَبَتَ مِنَ الحَرامِ أولى بِالنّار. فَلْيَحرِصِ الشّابُّ المُسلِمُ على الكَسبِ مِنَ الحَلالِ وَحدَه؛ والصِّدقِ والوُضوحِ في كُلِّ بَيعٍ وشِراءٍ ومُعامَلة؛ والوَفاءِ بِعُقودِهِ ودُيونِهِ وعُهودِهِ كَما أمَرَ الله؛ وتَجَنُّبِ الرِّبا في القُروضِ والبِطاقاتِ والحِساباتِ حَيثُ تَتَوَفَّرُ البَدائِلُ الحَلال، وطَلَبِ البَدائِلِ المالِيّةِ الإسلاميّة؛ وتَجَنُّبِ القِمارِ والمُراهَنةِ والمُضارَباتِ المَجهولة؛ وألّا يَغُشَّ أو يَخدَعَ أو يَأكُلَ مالَ غَيرِهِ بِالباطِل. ولْيَذكُر أنَّ الكَسبَ الحَلالَ نَفسَهُ عَمَلٌ نَبيل، وأنَّ التّاجِرَ الصَّدوقَ عَظيمُ المَنزِلة، وأنَّ المالَ المُكتَسَبَ والمُنفَقَ حَلالًا بَرَكة، والمُكتَسَبَ حَرامًا يَمحَقُ البَرَكةَ ويَجلِبُ الخَراب. وأن يَتَعامَلَ المَرءُ في المالِ بِالصِّدقِ والتَّراضي والعَدل، مُجتَنِبًا الرِّبا والغَرَرَ والخِداع — بِهذا يَجعَلُ المُؤمِنُ حَياتَهُ الاقتِصاديّةَ جُزءًا مِن عِبادَتِهِ لِلهِ، ويَجلِبُ البَرَكةَ لِمالِه، ويُسهِمُ في مُجتَمَعٍ عادِلٍ أمين.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the basis of all valid contracts according to Al-Ma'idah 1?", ar: "ما أساسُ كُلِّ العُقودِ الصَّحيحةِ بِحَسَبِ المائِدة ١؟" },
      options: [
        { en: "Fulfilling contracts and honouring agreements", ar: "الوَفاءُ بِالعُقودِ وحِفظُ العُهود" },
        { en: "Breaking promises", ar: "نَقضُ العُهود" },
        { en: "Cheating", ar: "الغِشّ" },
        { en: "Taking riba", ar: "أخذُ الرِّبا" },
      ],
      correctIndex: 0,
      explanation: { en: "'O you who believe, fulfil your contracts' (Al-Ma'idah 1).", ar: "﴿أوفوا بِالعُقود﴾ (المائِدة ١)." },
    },
    {
      prompt: { en: "What did Allah permit and forbid in Al-Baqarah 275?", ar: "ماذا أحَلَّ اللهُ وحَرَّمَ في البَقَرة ٢٧٥؟" },
      options: [
        { en: "Permitted trade and forbade riba", ar: "أحَلَّ البَيعَ وحَرَّمَ الرِّبا" },
        { en: "Forbade trade and permitted riba", ar: "حَرَّمَ البَيعَ وأحَلَّ الرِّبا" },
        { en: "Forbade both", ar: "حَرَّمَهُما" },
        { en: "Permitted both", ar: "أحَلَّهُما" },
      ],
      correctIndex: 0,
      explanation: { en: "Trade is lawful; interest is forbidden.", ar: "البَيعُ حَلالٌ والرِّبا حَرام." },
    },
    {
      prompt: { en: "Which is a condition of a valid contract?", ar: "أيٌّ مِن شُروطِ العَقدِ الصَّحيح؟" },
      options: [
        { en: "Mutual consent without compulsion or fraud", ar: "التَّراضي بِلا إكراهٍ ولا غِشّ" },
        { en: "Hiding defects", ar: "كِتمانُ العُيوب" },
        { en: "Coercion", ar: "الإكراه" },
        { en: "Excessive uncertainty", ar: "الغَرَرُ الفاحِش" },
      ],
      correctIndex: 0,
      explanation: { en: "'Trade is only by mutual consent.'", ar: "«إنَّما البَيعُ عن تَراض»." },
    },
    {
      prompt: { en: "What is a qard hasan?", ar: "ما القَرضُ الحَسَن؟" },
      options: [
        { en: "A benevolent interest-free loan, an act of charity", ar: "قَرضٌ بِلا فائِدةٍ صَدَقةٌ وإحسان" },
        { en: "A loan with interest", ar: "قَرضٌ بِفائِدة" },
        { en: "A gambling contract", ar: "عَقدُ قِمار" },
        { en: "A forbidden sale", ar: "بَيعٌ مُحَرَّم" },
      ],
      correctIndex: 0,
      explanation: { en: "Islam treats it as charity, not a means of profit.", ar: "يَجعَلُهُ الإسلامُ صَدَقةً لا وَسيلةَ رِبح." },
    },
    {
      prompt: { en: "What did the Prophet ﷺ say about cheating?", ar: "ماذا قالَ النَّبِيُّ ﷺ في الغِشّ؟" },
      options: [
        { en: "'Whoever cheats us is not one of us'", ar: "«مَن غَشَّنا فَلَيسَ مِنّا»" },
        { en: "Cheating is allowed in trade", ar: "الغِشُّ جائِزٌ في التِّجارة" },
        { en: "Nothing", ar: "لا شَيء" },
        { en: "It is encouraged", ar: "إنَّهُ مُرَغَّب" },
      ],
      correctIndex: 0,
      explanation: { en: "Deception is forbidden in all dealings.", ar: "الخِداعُ مُحَرَّمٌ في كُلِّ المُعامَلات." },
    },
    {
      prompt: { en: "True or False: Earning lawfully is a form of worship in Islam.", ar: "صَوابٌ أم خَطأ: الكَسبُ الحَلالُ عِبادةٌ في الإسلام." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Lawful earning is a duty and brings blessing; unlawful earning destroys it.", ar: "الكَسبُ الحَلالُ واجِبٌ وبَرَكة، والحَرامُ يَمحَقُها." },
    },
  ],
};
