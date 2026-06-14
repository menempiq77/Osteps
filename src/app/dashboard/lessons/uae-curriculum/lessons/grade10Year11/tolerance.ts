import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const tolerance: CourseLesson = {
  slug: "g10y11-tolerance",
  name: { en: "Tolerance", ar: "التَّسامُح" },
  shortIntro: {
    en: "Tolerance (as-samahah) is a defining quality of Islam: gentleness, forgiveness, fair dealing, and respectful coexistence with all people. This lesson studies the meaning of tolerance in Islam, its roots in the Qur'an and the Sunnah and the conduct of the Prophet ﷺ, its scope (with Muslims and non-Muslims, in worship, dealings, and disagreement), and its vital importance in our diverse world.",
    ar: "التَّسامُح (السَّماحة) صِفةٌ بارِزةٌ لِلإسلام: لينٌ وعَفوٌ وإنصافٌ وحُسنُ تَعايُشٍ معَ النّاسِ جَميعًا. يَدرُسُ هذا الدَّرسُ مَعنى التَّسامُحِ في الإسلام، وأصلَهُ في القُرآنِ والسُّنّةِ وهَديِ النَّبِيِّ ﷺ، ومَجالَه (معَ المُسلِمينَ وغَيرِهِم، في العِبادةِ والمُعامَلةِ والخِلاف)، وأهَمّيَّتَهُ البالِغةَ في عالَمِنا المُتَنَوِّع.",
  },
  quranSurahs: ["Al-Mumtahanah 8", "Fussilat 34"],
  sections: [
    {
      title: { en: "The meaning of tolerance in Islam", ar: "مَعنى التَّسامُحِ في الإسلام" },
      learningObjectives: [
        { en: "Define tolerance (as-samahah) in Islam.", ar: "أُعَرِّفُ التَّسامُحَ (السَّماحة) في الإسلام." },
        { en: "Show its roots in the Qur'an and Sunnah.", ar: "أُبَيِّنُ أصلَهُ في القُرآنِ والسُّنّة." },
      ],
      successCriteria: [
        { en: "I can explain Fussilat 34.", ar: "أشرَحُ فُصِّلَت ٣٤." },
        { en: "I can give examples of the Prophet's tolerance.", ar: "أُعطي أمثِلةً مِن تَسامُحِ النَّبِيِّ ﷺ." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "An open sky over many lands — Islam's call to gentle coexistence.", ar: "سَماءٌ مَفتوحةٌ فَوقَ بِلادٍ كَثيرة — دَعوةُ الإسلامِ لِلتَّعايُشِ بِلين." },
        caption: { en: "'Repel evil with that which is better' (Fussilat 34).", ar: "﴿ادفَع بِالتي هي أحسَن﴾ (فصلت ٣٤)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How can firm faith and gentle tolerance live together?", ar: "كَيفَ يَجتَمِعُ ثَباتُ الإيمانِ معَ لينِ التَّسامُح؟" },
        body: {
          en: "Some imagine that being firm in your faith means being harsh, and that being tolerant means abandoning your principles. Yet the Prophet ﷺ was the most certain of all people in his faith and at the same time the most gentle, forgiving, and tolerant of all people. Reflect: what does true Islamic tolerance (samahah) really mean — and how does a Muslim combine firm belief and clear principles with mercy, forgiveness, fair dealing, and respectful coexistence with all people, including those who differ?",
          ar: "يَظُنُّ بَعضُهُم أنَّ الثَّباتَ في الدّينِ غِلظة، وأنَّ التَّسامُحَ تَخَلٍّ عنِ المَبادِئ. ومعَ ذلك كانَ النَّبِيُّ ﷺ أيقَنَ النّاسِ بِدينِهِ وفي الوَقتِ نَفسِهِ ألينَهُم وأعفاهُم وأسمَحَهُم. تَأمَّل: ما حَقيقةُ التَّسامُحِ الإسلاميِّ (السَّماحة) — وكَيفَ يَجمَعُ المُسلِمُ بَينَ الإيمانِ الثّابِتِ والمَبادِئِ الواضِحةِ وبَينَ الرَّحمةِ والعَفوِ والإنصافِ وحُسنِ التَّعايُشِ معَ النّاسِ جَميعًا، ومِنهُمُ المُختَلِفون؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "As-samahah (السَّماحة): ease, gentleness, generosity, and forbearance in dealings.", ar: "السَّماحة: اليُسرُ واللينُ والجودُ والحِلمُ في المُعامَلة." },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "'May Allah have mercy on a man who is lenient when he sells, buys, and asks for repayment' (Bukhari).", ar: "«رَحِمَ اللهُ رَجُلًا سَمحًا إذا باعَ وإذا اشتَرى وإذا اقتَضى» (البخاري)." },
          ],
        },
      ],
      body: {
        en: "Tolerance — in Arabic as-samahah — is one of the most beautiful and defining qualities of Islam. It means ease, gentleness, generosity, forbearance, and the broad-hearted readiness to overlook, forgive, and deal kindly and fairly with others. The Prophet ﷺ summed up the very character of the religion when he said: 'The most beloved religion to Allah is the easy, tolerant monotheism (al-hanifiyyah as-samhah)' (Bukhari). Islam is built on ease, not hardship, and on mercy and good treatment of all of Allah's creation. It is crucial, however, to understand what tolerance truly means and what it does not mean. True Islamic tolerance does not mean weakness in faith, abandoning one's principles, watering down the religion, or accepting falsehood as truth. The Muslim remains firm and certain in their belief and clear in their principles. Rather, tolerance means gentleness in character, forgiveness of wrongs, fairness and kindness in dealings, respect for others, and peaceful, respectful coexistence — combining firm faith with a soft and merciful heart. The Prophet ﷺ himself, who was the most certain of all people in his faith, was at the very same time the most gentle, forgiving, and tolerant of all people in his conduct.\n\nThe roots of tolerance run deep through the Qur'an and the Sunnah. Allah commands the believer to repel evil with good and to respond to harshness with gentleness: 'And not equal are the good deed and the bad. Repel evil by that which is better; and thereupon the one whom between you and him is enmity will become as though he was a devoted friend' (Fussilat 34). What a profound principle: the way to turn an enemy into a friend is not more hostility, but better conduct. Allah also describes the servants of the Most Merciful as those who, 'when the ignorant address them harshly, they say words of peace' (Al-Furqan 63), and He praises 'those who restrain anger and who pardon the people; and Allah loves the doers of good' (Aal Imran 134). Allah commands kindness and justice even toward non-Muslims who are peaceful: 'Allah does not forbid you from those who do not fight you because of religion and do not expel you from your homes — from being righteous toward them and acting justly toward them. Indeed, Allah loves those who act justly' (Al-Mumtahanah 8). The Sunnah is full of the same spirit: the Prophet ﷺ invoked Allah's mercy upon 'a man who is lenient (samh) when he sells, when he buys, and when he asks for what is owed to him' (Bukhari), tying tolerance to the everyday dealings of the marketplace and of life.\n\nThe life of the Prophet ﷺ is the living embodiment of tolerance, and his example shines most brightly precisely where tolerance is hardest — toward those who had wronged him. When he was driven from Makkah, persecuted, and made war upon for years, and then finally returned victorious at the Conquest of Makkah with the power to take revenge on all who had harmed him, he instead forgave them, declaring: 'Go, for you are free.' When the people of Ta'if had stoned him and driven him out, and the angel offered to destroy them, he refused, hoping instead that guidance would come to their descendants. He was patient and gentle with the harsh and the ignorant, forgiving toward the one who wronged him, kind to his neighbours, fair in his dealings, and merciful even to enemies who later embraced Islam because of his magnificent character. This is the tolerance of strength, not of weakness — the forgiveness of one who has the power to punish but chooses mercy, the gentleness of one whose faith is unshakeable. In the next section, we examine the scope of tolerance in Islam — with Muslims and with non-Muslims, in worship, in dealings, and in disagreement — and its vital importance for living together in our diverse world.",
        ar: "التَّسامُح — بِالعَرَبيّةِ السَّماحة — مِن أجمَلِ صِفاتِ الإسلامِ وأبرَزِها. ومَعناهُ اليُسرُ واللينُ والجودُ والحِلمُ وسَعةُ الصَّدرِ لِلعَفوِ والصَّفحِ والمُعامَلةِ بِالرِّفقِ والإنصاف. وقَد لَخَّصَ النَّبِيُّ ﷺ خُلُقَ الدّينِ كُلِّهِ حينَ قال: «أحَبُّ الدّينِ إلى اللهِ الحَنيفيّةُ السَّمحة» (البخاري). فَالإسلامُ مَبنيٌّ على اليُسرِ لا العُسر، وعلى الرَّحمةِ وحُسنِ مُعامَلةِ خَلقِ اللهِ جَميعًا. لكِنّ المُهِمَّ أن نَفهَمَ ما حَقيقةُ التَّسامُحِ وما لَيسَ بِتَسامُح. فَالتَّسامُحُ الإسلاميُّ الحَقُّ لا يَعني ضَعفًا في الإيمان، ولا تَخَلّيًا عنِ المَبادِئ، ولا تَمييعًا لِلدّين، ولا قَبولَ الباطِلِ حَقًّا. فَالمُسلِمُ يَبقى ثابِتًا موقِنًا في عَقيدَتِهِ واضِحًا في مَبادِئِه. وإنَّما التَّسامُحُ لينُ الخُلُق، والعَفوُ عنِ الإساءة، والإنصافُ والرِّفقُ في المُعامَلة، واحتِرامُ الآخَر، وحُسنُ التَّعايُشِ بِسَلامٍ واحتِرام — جَمعًا بَينَ الإيمانِ الثّابِتِ والقَلبِ اللَّيِّنِ الرَّحيم. والنَّبِيُّ ﷺ نَفسُهُ، وكانَ أيقَنَ النّاسِ بِدينِهِ، كانَ في الوَقتِ نَفسِهِ ألينَ النّاسِ وأعفاهُم وأسمَحَهُم خُلُقًا.\n\nوأصلُ التَّسامُحِ ضارِبٌ في القُرآنِ والسُّنّة. يَأمُرُ اللهُ المُؤمِنَ أن يَدفَعَ السَّيِّئةَ بِالحَسَنةِ وأن يُقابِلَ الغِلظةَ بِاللين: ﴿ولا تَستَوي الحَسَنةُ ولا السَّيِّئة، ادفَع بِالتي هي أحسَنُ فَإذا الذي بَينَكَ وبَينَهُ عَداوةٌ كَأنَّهُ وَليٌّ حَميم﴾ (فصلت ٣٤). فَما أعمَقَ هذا المَبدَأ: طَريقُ تَحويلِ العَدُوِّ صَديقًا لَيسَ مَزيدَ العَداوة، بل أحسَنَ السُّلوك. ويَصِفُ اللهُ عِبادَ الرَّحمنِ بِأنَّهُم ﴿وإذا خاطَبَهُمُ الجاهِلونَ قالوا سَلامًا﴾ (الفرقان ٦٣)، ويَمدَحُ ﴿والكاظِمينَ الغَيظَ والعافينَ عنِ النّاسِ واللهُ يُحِبُّ المُحسِنين﴾ (آل عمران ١٣٤). ويَأمُرُ اللهُ بِالبِرِّ والعَدلِ حَتّى معَ غَيرِ المُسلِمينَ المُسالِمين: ﴿لا يَنهاكُمُ اللهُ عنِ الذينَ لم يُقاتِلوكُم في الدّينِ ولم يُخرِجوكُم مِن دِيارِكُم أن تَبَرّوهُم وتُقسِطوا إلَيهِم، إنَّ اللهَ يُحِبُّ المُقسِطين﴾ (الممتحنة ٨). والسُّنّةُ مَملوءةٌ بِالرّوحِ نَفسِها: دَعا النَّبِيُّ ﷺ بِرَحمةِ اللهِ لِـ«رَجُلٍ سَمحٍ إذا باعَ وإذا اشتَرى وإذا اقتَضى» (البخاري)، رابِطًا التَّسامُحَ بِمُعامَلاتِ السّوقِ والحَياةِ اليَومِيّة.\n\nوحَياةُ النَّبِيِّ ﷺ تَجسيدٌ حَيٌّ لِلتَّسامُح، ويَسطَعُ مِثالُهُ أشَدَّ ما يَسطَعُ حَيثُ يَصعُبُ التَّسامُح — معَ مَن ظَلَموه. فَحينَ أُخرِجَ مِن مَكّةَ، وعُذِّبَ، وحورِبَ سِنينَ، ثُمَّ عادَ مُنتَصِرًا في فَتحِ مَكّةَ قادِرًا على الانتِقامِ مِن كُلِّ مَن آذاه، عَفا عنهُم قائِلًا: «اذهَبوا فَأنتُمُ الطُّلَقاء». وحينَ رَجَمَهُ أهلُ الطّائِفِ وأخرَجوه، وعَرَضَ المَلَكُ أن يُهلِكَهُم، أبى، راجِيًا أن يَهديَ اللهُ مِن ذُرّيّاتِهِم. وكانَ صَبورًا لَطيفًا معَ الجاهِلِ الغَليظ، عَفُوًّا عَمَّن ظَلَمَه، رَحيمًا بِجارِه، مُنصِفًا في مُعامَلَتِه، رَحيمًا حَتّى بِأعداءٍ أسلَموا بَعدُ لِعَظيمِ خُلُقِه. هذا تَسامُحُ القُوّةِ لا الضَّعف — عَفوُ القادِرِ على العُقوبةِ يَختارُ الرَّحمة، ولينُ مَن إيمانُهُ لا يَتَزَعزَع. وفي القِسمِ التّالي نَنظُرُ في مَجالِ التَّسامُحِ في الإسلام — معَ المُسلِمينَ وغَيرِهِم، في العِبادةِ والمُعامَلةِ والخِلاف — وأهَمّيَّتِهِ البالِغةِ لِلعَيشِ معًا في عالَمِنا المُتَنَوِّع.",
      },
    },
    {
      title: { en: "The scope and importance of tolerance", ar: "مَجالُ التَّسامُحِ وأهَمّيَّتُه" },
      learningObjectives: [
        { en: "Describe the scope of tolerance in Islam.", ar: "أصِفُ مَجالَ التَّسامُحِ في الإسلام." },
        { en: "Explain its importance in a diverse world.", ar: "أشرَحُ أهَمّيَّتَهُ في عالَمٍ مُتَنَوِّع." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "People of many backgrounds together — coexistence in peace.", ar: "نّاسٌ مِن خَلفيّاتٍ شَتّى معًا — تَعايُشٌ بِسَلام." },
        caption: { en: "'Be righteous toward them and act justly toward them' (Al-Mumtahanah 8).", ar: "﴿أن تَبَرّوهُم وتُقسِطوا إلَيهِم﴾ (الممتحنة ٨)." },
      },
      groupTasks: {
        title: { en: "Living tolerance", ar: "تَطبيقُ التَّسامُح" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "scope-of-tolerance",
            name: { en: "Team A — The scope of tolerance", ar: "الفَريقُ أ — مَجالُ التَّسامُح" },
            learningObjective: { en: "Present where and how tolerance applies.", ar: "نَعرِضُ أينَ وكَيفَ يَكونُ التَّسامُح." },
            task: { en: "Present the broad scope of tolerance in Islam. Show: tolerance among Muslims — forgiving one another, overlooking faults, gentleness in disagreement, accepting valid scholarly differences without enmity; tolerance with non-Muslims who are peaceful — kind and just dealing, good neighbourliness, honouring agreements, no compulsion in religion ('There is no compulsion in religion', Al-Baqarah 256); tolerance in dealings and daily life — leniency in buying, selling, and debts, forgiving the one in difficulty; and tolerance of character — controlling anger, pardoning, answering harshness with peace. Be clear that tolerance is gentleness and fairness, NOT abandoning one's faith, approving falsehood, or staying silent about clear truth. Present a 'scope of tolerance' map.", ar: "اعرِضوا سَعةَ مَجالِ التَّسامُحِ في الإسلام. بَيِّنوا: التَّسامُحَ بَينَ المُسلِمين — العَفوَ، وتَجاوُزَ الأخطاء، واللينَ في الخِلاف، وقَبولَ الخِلافِ العِلميِّ المُعتَبَرِ بِلا عَداوة؛ والتَّسامُحَ معَ غَيرِ المُسلِمينَ المُسالِمين — حُسنَ المُعامَلةِ والعَدل، وحُسنَ الجِوار، والوَفاءَ بِالعُهود، ولا إكراهَ في الدّين (﴿لا إكراهَ في الدّين﴾، البقرة ٢٥٦)؛ والتَّسامُحَ في المُعامَلاتِ والحَياةِ اليَومِيّة — اللينَ في البَيعِ والشِّراءِ والدَّين، والعَفوَ عنِ المُعسِر؛ وتَسامُحَ الخُلُق — كَظمَ الغَيظِ والعَفوِ ومُقابَلةِ الغِلظةِ بِالسَّلام. ووَضِّحوا أنَّ التَّسامُحَ لينٌ وإنصاف، لا تَخَلٍّ عنِ الدّينِ ولا إقرارٍ لِلباطِلِ ولا سُكوتٍ عنِ الحَقِّ البَيِّن. اعرِضوا خَريطةَ «مَجالِ التَّسامُح»." },
            evidence: [
              { en: "'There is no compulsion in religion' (Al-Baqarah 256).", ar: "﴿لا إكراهَ في الدّين﴾ (البقرة ٢٥٦)." },
            ],
            sourceNotes: [
              { en: "Gentleness and fairness, not abandoning the faith.", ar: "لينٌ وإنصاف، لا تَخَلٍّ عنِ الدّين." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'scope of tolerance' map.", ar: "خَريطةُ «مَجالِ التَّسامُح»." },
          },
          {
            slug: "importance-today",
            name: { en: "Team B — Why tolerance matters today", ar: "الفَريقُ ب — لِمَ يُهِمُّ التَّسامُحُ اليَوم" },
            learningObjective: { en: "Present the importance of tolerance in our world.", ar: "نَعرِضُ أهَمّيّةَ التَّسامُحِ في عالَمِنا." },
            task: { en: "Present why tolerance is vital today, especially in a diverse society like the UAE, where people of many nationalities, cultures, and religions live and work together. Show how Islamic tolerance: enables peaceful coexistence and social harmony; reflects the beautiful image of Islam and attracts people to it through good character (as it did in the Prophet's time); prevents extremism, harshness, and hatred; builds bridges and friendships ('repel evil with what is better'); and strengthens communities and nations. Contrast tolerance with harshness, prejudice, and intolerance and the harm they cause. Apply directly to students: how to be tolerant at school and online — with classmates of different backgrounds, in disagreements, with those who annoy or wrong you, while staying firm in your own faith and values. Present a 'tolerance in my life' action plan.", ar: "اعرِضوا لِمَ التَّسامُحُ بالِغُ الأهَمّيّةِ اليَوم، خاصّةً في مُجتَمَعٍ مُتَنَوِّعٍ كَالإمارات، حَيثُ يَعيشُ ويَعمَلُ معًا نّاسٌ مِن جِنسيّاتٍ وثَقافاتٍ ودِياناتٍ شَتّى. بَيِّنوا كَيفَ يُحَقِّقُ التَّسامُحُ الإسلاميّ: التَّعايُشَ السِّلميَّ والوِئامَ الاجتِماعيّ؛ ويَعكِسُ صورةَ الإسلامِ الجَميلةَ ويَجذِبُ النّاسَ إلَيهِ بِحُسنِ الخُلُقِ (كَما في عَهدِ النَّبِيِّ ﷺ)؛ ويَمنَعُ التَّطَرُّفَ والغِلظةَ والكَراهية؛ ويَبني الجُسورَ والصَّداقات (﴿ادفَع بِالتي هي أحسَن﴾)؛ ويُقَوّي المُجتَمَعاتِ والأُمَم. قابِلوا التَّسامُحَ بِالغِلظةِ والتَّعَصُّبِ وعَدَمِ التَّسامُحِ وما تُسَبِّبُهُ مِن ضَرَر. طَبِّقوا على الطُّلّابِ مُباشَرةً: كَيفَ يَكونونَ مُتَسامِحينَ في المَدرَسةِ وعلى الإنترنت — معَ زُمَلاءَ مِن خَلفيّاتٍ مُختَلِفة، وفي الخِلافات، ومعَ مَن يُضايِقُ أو يُسيء، معَ الثَّباتِ على دينِهِم وقِيَمِهِم. اعرِضوا خِطّةَ «التَّسامُحِ في حَياتي»." },
            evidence: [
              { en: "'Repel evil by that which is better' (Fussilat 34).", ar: "﴿ادفَع بِالتي هي أحسَن﴾ (فصلت ٣٤)." },
            ],
            sourceNotes: [
              { en: "Tolerance builds harmony and reflects Islam's beauty.", ar: "التَّسامُحُ يَبني الوِئامَ ويَعكِسُ جَمالَ الإسلام." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'tolerance in my life' action plan.", ar: "خِطّةُ «التَّسامُحِ في حَياتي»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Being a person of tolerance", ar: "أن تَكونَ صاحِبَ تَسامُح" },
        prompt: { en: "Islamic tolerance (samahah) is gentleness, forgiveness, fair and kind dealing, and respectful coexistence with all people — combined with firm faith and clear principles, just as the Prophet ﷺ was the most certain in faith and at the same time the most gentle and forgiving of people. Reflect on your own life, especially in a diverse society where you meet people of many backgrounds. Write about a situation where you could show more tolerance — perhaps forgiving someone who wronged you, being gentle with someone who annoyed you, dealing fairly and kindly with a classmate of a different background, controlling your anger, or answering harshness with peace — and how you can do this while remaining firm and proud in your own faith and values. Describe one concrete way you will practise tolerance this week, at school or online.", ar: "التَّسامُحُ الإسلاميُّ (السَّماحة) لينٌ وعَفوٌ وإنصافٌ وحُسنُ مُعامَلةٍ وتَعايُشٌ بِاحتِرامٍ معَ النّاسِ جَميعًا — معَ إيمانٍ ثابِتٍ ومَبادِئَ واضِحة، كَما كانَ النَّبِيُّ ﷺ أيقَنَ النّاسِ إيمانًا وألينَهُم وأعفاهُم في الوَقتِ نَفسِه. تَأمَّل حَياتَك، خاصّةً في مُجتَمَعٍ مُتَنَوِّعٍ تَلقى فيهِ نّاسًا مِن خَلفيّاتٍ شَتّى. اكتُب عن مَوقِفٍ تَستَطيعُ فيهِ أن تُظهِرَ تَسامُحًا أكثَر — كَالعَفوِ عَمَّن أساءَ إلَيك، أوِ اللينِ معَ مَن ضايَقَك، أوِ الإنصافِ والرِّفقِ معَ زَميلٍ مِن خَلفيّةٍ مُختَلِفة، أو كَظمِ غَيظِك، أو مُقابَلةِ الغِلظةِ بِالسَّلام — وكَيفَ تَفعَلُ ذلك معَ ثَباتِكَ واعتِزازِكَ بِدينِكَ وقِيَمِك. صِف طَريقةً واحِدةً عَمَليّةً سَتُمارِسُ بِها التَّسامُحَ هذا الأُسبوعَ في المَدرَسةِ أو على الإنترنت." },
        placeholder: { en: "I can show more tolerance by... I will stay firm in my faith while... This week I will...", ar: "أُظهِرُ تَسامُحًا أكثَرَ بِـ... وأبقى ثابِتًا في ديني معَ... وهذا الأُسبوعَ سَـ..." },
      },
      body: {
        en: "The tolerance taught by Islam is broad in its scope, embracing every area of life and every kind of relationship. Among Muslims, tolerance means forgiving one another, overlooking faults and mistakes, being gentle and kind even in disagreement, and accepting valid scholarly differences of opinion without enmity or division — recognising, as we learned in the topic of the differences among jurists, that legitimate scholarly disagreement is a mercy and a breadth, not a cause for hatred. With non-Muslims who are peaceful and do not fight or oppress Muslims, Islam commands kindness, justice, and good treatment: 'Allah does not forbid you from those who do not fight you because of religion and do not expel you from your homes — from being righteous toward them and acting justly toward them' (Al-Mumtahanah 8). Islam upholds good neighbourliness, the honouring of agreements and covenants, and the foundational principle that 'there is no compulsion in religion' (Al-Baqarah 256) — no one is to be forced to accept Islam. In dealings and daily life, tolerance means leniency in buying, selling, and the collection of debts, and mercy toward the one in difficulty. And in character, tolerance means controlling anger, pardoning those who wrong us, and answering harshness with words of peace. At the same time, it must always be remembered that this tolerance is gentleness and fairness of conduct — it never means abandoning one's faith, approving of falsehood, or staying silent when clear truth must be spoken. The Muslim is tolerant in dealings and character while remaining firm and proud in belief.\n\nThe importance of this tolerance in our world today can hardly be overstated, and it is especially vital in a diverse society such as the United Arab Emirates, where people of many nationalities, cultures, languages, and religions live, work, and build their lives side by side. Islamic tolerance is the very foundation of peaceful coexistence and social harmony, enabling people of different backgrounds to live together in mutual respect, cooperation, and peace. It reflects the true and beautiful image of Islam and, through good character, attracts hearts to the religion — just as the magnificent tolerance and mercy of the Prophet ﷺ caused many of his former enemies to embrace Islam. Tolerance is the antidote to extremism, harshness, prejudice, and hatred, which poison societies and bring only conflict and suffering. It builds bridges and friendships, turning enmity into affection, just as Allah promised: 'Repel evil by that which is better; and thereupon the one whom between you and him is enmity will become as though he was a devoted friend' (Fussilat 34). A society built on tolerance is strong, harmonious, and prosperous, while one poisoned by intolerance is divided, fearful, and weak. Tolerance, then, is not a luxury but a necessity for the wellbeing of communities and nations.\n\nFor the young Muslim today, this topic carries a clear and practical call. You live in a wonderfully diverse world, meeting people of countless backgrounds at school, online, and throughout your life. The example of the Prophet ﷺ teaches you that the strongest faith and the gentlest, most tolerant character belong together in the heart of the believer. Be tolerant: forgive those who wrong you, be gentle with those who are harsh or ignorant, deal fairly and kindly with classmates and others of every background, control your anger, and answer rudeness with calm and peace — all while remaining firm, certain, and proud in your faith and your values. Reject the harshness, prejudice, name-calling, and bullying that intolerance breeds, whether in person or online. Let your tolerance be the tolerance of strength, like the Prophet ﷺ — the forgiveness of one who could respond but chooses mercy, the kindness of one whose belief is unshakeable. In doing so, you become a true representative of Islam, a builder of harmony and peace in your community, and a living example of the easy, tolerant monotheism that Allah loves. This is the noble character that Islam calls every Muslim to embody: firm in faith, gentle in conduct, just in dealing, and tolerant with all of Allah's creation.",
        ar: "التَّسامُحُ الذي يُعَلِّمُهُ الإسلامُ واسِعُ المَجالِ، يَشمَلُ كُلَّ مَجالِ حَياةٍ وكُلَّ نَوعِ عَلاقة. فَبَينَ المُسلِمينَ يَعني التَّسامُحُ العَفوَ بَعضِهِم عن بَعض، وتَجاوُزَ الأخطاءِ والهَفَوات، واللينَ والرِّفقَ حَتّى في الخِلاف، وقَبولَ الخِلافِ العِلميِّ المُعتَبَرِ بِلا عَداوةٍ ولا فُرقة — إدراكًا، كَما تَعَلَّمنا في مَوضوعِ اختِلافِ الفُقَهاء، أنَّ الخِلافَ العِلميَّ المُعتَبَرَ رَحمةٌ وسَعةٌ لا سَبَبٌ لِلبُغض. ومعَ غَيرِ المُسلِمينَ المُسالِمينَ الذينَ لا يُقاتِلونَ المُسلِمينَ ولا يَظلِمونَهُم يَأمُرُ الإسلامُ بِالرِّفقِ والعَدلِ وحُسنِ المُعامَلة: ﴿لا يَنهاكُمُ اللهُ عنِ الذينَ لم يُقاتِلوكُم في الدّينِ ولم يُخرِجوكُم مِن دِيارِكُم أن تَبَرّوهُم وتُقسِطوا إلَيهِم﴾ (الممتحنة ٨). ويَدعو الإسلامُ إلى حُسنِ الجِوار، والوَفاءِ بِالعُهودِ والمَواثيق، والأصلِ الأصيل: ﴿لا إكراهَ في الدّين﴾ (البقرة ٢٥٦) — فَلا يُكرَهُ أحَدٌ على الإسلام. وفي المُعامَلاتِ والحَياةِ اليَومِيّةِ يَعني التَّسامُحُ اللينَ في البَيعِ والشِّراءِ واقتِضاءِ الدَّين، والرَّحمةَ بِالمُعسِر. وفي الخُلُقِ يَعني كَظمَ الغَيظ، والعَفوَ عَمَّن أساءَ، ومُقابَلةَ الغِلظةِ بِكَلِمةِ السَّلام. ومعَ ذلك يَجِبُ أن يُذكَرَ دائِمًا أنَّ هذا التَّسامُحَ لينُ سُلوكٍ وإنصاف — لا يَعني أبَدًا تَركَ الدّين، أوِ الإقرارَ بِالباطِل، أوِ السُّكوتَ حينَ يَجِبُ بَيانُ الحَقِّ الواضِح. فَالمُسلِمُ سَمحٌ في المُعامَلةِ والخُلُقِ ثابِتٌ مُعتَزٌّ في العَقيدة.\n\nوأهَمّيّةُ هذا التَّسامُحِ في عالَمِنا اليَومَ لا تَكادُ توصَف، وهي بالِغةٌ خاصّةً في مُجتَمَعٍ مُتَنَوِّعٍ كَالإماراتِ العَرَبيّةِ المُتَّحِدة، حَيثُ يَعيشُ ويَعمَلُ ويَبني حَياتَهُ جَنبًا إلى جَنبٍ نّاسٌ مِن جِنسيّاتٍ وثَقافاتٍ ولُغاتٍ ودِياناتٍ شَتّى. فَالتَّسامُحُ الإسلاميُّ أساسُ التَّعايُشِ السِّلميِّ والوِئامِ الاجتِماعيّ، يُمَكِّنُ النّاسَ مِن خَلفيّاتٍ مُختَلِفةٍ مِنَ العَيشِ معًا بِاحتِرامٍ مُتَبادَلٍ وتَعاوُنٍ وسَلام. ويَعكِسُ صورةَ الإسلامِ الحَقّةَ الجَميلة، ويَجذِبُ القُلوبَ إلى الدّينِ بِحُسنِ الخُلُق — كَما جَذَبَ تَسامُحُ النَّبِيِّ ﷺ ورَحمَتُهُ العَظيمةُ كَثيرًا مِن أعدائِهِ السّابِقينَ إلى الإسلام. والتَّسامُحُ تِرياقُ التَّطَرُّفِ والغِلظةِ والتَّعَصُّبِ والكَراهيةِ التي تُسَمِّمُ المُجتَمَعاتِ ولا تَجلِبُ إلّا النِّزاعَ والمُعاناة. ويَبني الجُسورَ والصَّداقات، فَيُحَوِّلُ العَداوةَ مَوَدّة، كَما وَعَدَ الله: ﴿ادفَع بِالتي هي أحسَنُ فَإذا الذي بَينَكَ وبَينَهُ عَداوةٌ كَأنَّهُ وَليٌّ حَميم﴾ (فصلت ٣٤). فَالمُجتَمَعُ المَبنيُّ على التَّسامُحِ قَويٌّ مُتَآلِفٌ مُزدَهِر، والمَسمومُ بِعَدَمِ التَّسامُحِ مُنقَسِمٌ خائِفٌ ضَعيف. فَالتَّسامُحُ إذًا لَيسَ تَرَفًا بل ضَرورةً لِخَيرِ المُجتَمَعاتِ والأُمَم.\n\nولِلشّابِّ المُسلِمِ اليَومَ في هذا المَوضوعِ دَعوةٌ واضِحةٌ عَمَليّة. أنتَ تَعيشُ في عالَمٍ مُتَنَوِّعٍ رائِع، تَلقى فيهِ نّاسًا مِن خَلفيّاتٍ لا تُحصى في المَدرَسةِ وعلى الإنترنتِ وطَوالَ حَياتِك. ومِثالُ النَّبِيِّ ﷺ يُعَلِّمُكَ أنَّ أقوى الإيمانِ وألينَ الخُلُقِ وأسمَحَهُ يَجتَمِعانِ في قَلبِ المُؤمِن. فَكُن سَمحًا: اعفُ عَمَّن أساءَ إلَيك، وكُن لَيِّنًا معَ الغَليظِ والجاهِل، وعامِل زُمَلاءَكَ وغَيرَهُم مِن كُلِّ خَلفيّةٍ بِالإنصافِ والرِّفق، واكظِم غَيظَك، وقابِلِ الفَظاظةَ بِالهُدوءِ والسَّلام — وأنتَ ثابِتٌ موقِنٌ مُعتَزٌّ بِدينِكَ وقِيَمِك. وارفُضِ الغِلظةَ والتَّعَصُّبَ والسُّخريةَ والتَّنَمُّرَ الذي يُوَلِّدُهُ عَدَمُ التَّسامُح، في الواقِعِ أو على الإنترنت. ولْيَكُن تَسامُحُكَ تَسامُحَ القُوّةِ كَالنَّبِيِّ ﷺ — عَفوَ القادِرِ على الرَّدِّ يَختارُ الرَّحمة، ورِفقَ مَن إيمانُهُ لا يَتَزَعزَع. وبِذلك تَصيرُ مُمَثِّلًا حَقًّا لِلإسلام، وبانيًا لِلوِئامِ والسَّلامِ في مُجتَمَعِك، ومِثالًا حَيًّا لِلحَنيفيّةِ السَّمحةِ التي يُحِبُّها الله. هذا الخُلُقُ النَّبيلُ الذي يَدعو إلَيهِ الإسلامُ كُلَّ مُسلِم: ثَباتٌ في الإيمان، ولينٌ في السُّلوك، وعَدلٌ في المُعامَلة، وتَسامُحٌ معَ خَلقِ اللهِ جَميعًا.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does tolerance (as-samahah) mean in Islam?", ar: "ما مَعنى التَّسامُحِ (السَّماحة) في الإسلام؟" },
      options: [
        { en: "Gentleness, forgiveness, fair dealing, respectful coexistence", ar: "اللينُ والعَفوُ والإنصافُ وحُسنُ التَّعايُش" },
        { en: "Abandoning your faith", ar: "تَركُ دينِك" },
        { en: "Approving all falsehood", ar: "إقرارُ كُلِّ باطِل" },
        { en: "Weakness", ar: "الضَّعف" },
      ],
      correctIndex: 0,
      explanation: { en: "Firm faith combined with a gentle, merciful heart.", ar: "إيمانٌ ثابِتٌ معَ قَلبٍ لَيِّنٍ رَحيم." },
    },
    {
      prompt: { en: "How does Fussilat 34 say to deal with evil?", ar: "كَيفَ تَأمُرُ فُصِّلَت ٣٤ بِمُعامَلةِ السَّيِّئة؟" },
      options: [
        { en: "Repel it with that which is better", ar: "ادفَعها بِالتي هي أحسَن" },
        { en: "Repay it with worse", ar: "قابِلها بِأسوَأ" },
        { en: "Ignore all people", ar: "أهمِل النّاسَ جَميعًا" },
        { en: "Take revenge always", ar: "انتَقِم دائِمًا" },
      ],
      correctIndex: 0,
      explanation: { en: "Then enmity can turn to friendship.", ar: "فَتَتَحَوَّلُ العَداوةُ صَداقة." },
    },
    {
      prompt: { en: "How did the Prophet ﷺ treat the Makkans at the Conquest of Makkah?", ar: "كَيفَ عامَلَ النَّبِيُّ ﷺ أهلَ مَكّةَ في الفَتح؟" },
      options: [
        { en: "He forgave them: 'Go, for you are free'", ar: "عَفا عنهُم: «اذهَبوا فَأنتُمُ الطُّلَقاء»" },
        { en: "He took revenge on all", ar: "انتَقَمَ مِنَ الجَميع" },
        { en: "He expelled everyone", ar: "أخرَجَ الجَميع" },
        { en: "He ignored them", ar: "أهمَلَهُم" },
      ],
      correctIndex: 0,
      explanation: { en: "The tolerance of strength, not weakness.", ar: "تَسامُحُ القُوّةِ لا الضَّعف." },
    },
    {
      prompt: { en: "How does Islam command treating peaceful non-Muslims?", ar: "كَيفَ يَأمُرُ الإسلامُ بِمُعامَلةِ غَيرِ المُسلِمينَ المُسالِمين؟" },
      options: [
        { en: "With righteousness and justice", ar: "بِالبِرِّ والعَدل" },
        { en: "With hostility", ar: "بِالعَداوة" },
        { en: "By forcing them into Islam", ar: "بِإكراهِهِم على الإسلام" },
        { en: "By ignoring them", ar: "بِإهمالِهِم" },
      ],
      correctIndex: 0,
      explanation: { en: "'Be righteous toward them and act justly' (Al-Mumtahanah 8).", ar: "﴿أن تَبَرّوهُم وتُقسِطوا إلَيهِم﴾ (الممتحنة ٨)." },
    },
    {
      prompt: { en: "Why is tolerance especially important in a diverse society?", ar: "لِمَ التَّسامُحُ مُهِمٌّ خاصّةً في مُجتَمَعٍ مُتَنَوِّع؟" },
      options: [
        { en: "It enables peaceful coexistence and harmony", ar: "يُحَقِّقُ التَّعايُشَ السِّلميَّ والوِئام" },
        { en: "It weakens society", ar: "يُضعِفُ المُجتَمَع" },
        { en: "It causes conflict", ar: "يُسَبِّبُ النِّزاع" },
        { en: "It has no value", ar: "لا قيمةَ لَه" },
      ],
      correctIndex: 0,
      explanation: { en: "And reflects the beauty of Islam.", ar: "ويَعكِسُ جَمالَ الإسلام." },
    },
    {
      prompt: { en: "True or False: Tolerance means abandoning your faith and principles.", ar: "صَوابٌ أم خَطأ: التَّسامُحُ يَعني تَركَ دينِكَ ومَبادِئِك." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "It is gentleness of conduct with firm faith.", ar: "هو لينُ السُّلوكِ معَ ثَباتِ الإيمان." },
    },
  ],
};
