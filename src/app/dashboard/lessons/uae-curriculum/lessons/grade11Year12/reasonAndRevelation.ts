import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const reasonAndRevelation: CourseLesson = {
  slug: "g11y12-reason-and-revelation",
  name: { en: "Reason and Revelation", ar: "العَقلُ والنَّقل" },
  shortIntro: {
    en: "Reason (al-'aql) and revelation (an-naql) are two great sources of knowledge, and Islam honours both. This lesson studies the high status of reason in Islam, the meaning and authority of revelation, the correct relationship between them — that sound reason never truly contradicts authentic revelation — and how a young Muslim uses both rightly, neither rejecting revelation in the name of reason nor abandoning reason in understanding the religion.",
    ar: "العَقلُ والنَّقلُ مَصدَرانِ عَظيمانِ لِلمَعرِفة، والإسلامُ يُكرِمُهُما مَعًا. يَدرُسُ هذا الدَّرسُ مَنزِلةَ العَقلِ الرَّفيعةَ في الإسلام، ومَعنى الوَحيِ وحُجِّيَّتَه، والعَلاقةَ الصَّحيحةَ بَينَهُما — أنَّ العَقلَ الصَّريحَ لا يُناقِضُ النَّقلَ الصَّحيحَ حَقيقةً — وكَيفَ يَستَعمِلُ الشّابُّ المُسلِمُ كِلَيهِما بِحَقّ، فَلا يَرُدُّ الوَحيَ بِاسمِ العَقل، ولا يُلغي العَقلَ في فَهمِ الدّين.",
  },
  quranSurahs: ["Az-Zumar 9", "Al-Mulk 10"],
  sections: [
    {
      title: { en: "The status of reason in Islam", ar: "مَنزِلةُ العَقلِ في الإسلام" },
      learningObjectives: [
        { en: "Explain the high status of reason in Islam.", ar: "أشرَحُ مَنزِلةَ العَقلِ الرَّفيعةَ في الإسلام." },
        { en: "Explain the meaning and authority of revelation.", ar: "أشرَحُ مَعنى الوَحيِ وحُجِّيَّتَه." },
      ],
      successCriteria: [
        { en: "I can explain Az-Zumar 9 and Al-Mulk 10.", ar: "أشرَحُ الزُّمَرَ ٩ والمُلكَ ١٠." },
        { en: "I can describe how Islam honours reason.", ar: "أصِفُ كَيفَ يُكرِمُ الإسلامُ العَقل." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Books of knowledge — reason and revelation together.", ar: "كُتُبُ العِلم — العَقلُ والنَّقلُ مَعًا." },
        caption: { en: "'Are those who know equal to those who do not know?' (Az-Zumar 9).", ar: "﴿هَل يَستَوي الذينَ يَعلَمونَ والذينَ لا يَعلَمون﴾ (الزُّمَر ٩)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "If Allah gave us reason, why did He also send revelation?", ar: "إن كانَ اللهُ وَهَبَنا العَقل، فَلِمَ أرسَلَ الوَحيَ أيضًا؟" },
        body: {
          en: "Some people today claim that reason alone is enough and revelation is unnecessary; others reject reason and treat thinking as opposed to faith. Islam takes neither extreme. It honours reason as a gift of Allah and the basis of human responsibility, and it commands us to think and reflect — yet it also tells us that reason alone cannot reach the deepest truths (the reality of Allah, the unseen, the purpose of life, the details of worship and law). Reflect: if Allah gave human beings reason, why did He also send revelation — and what is the right relationship between the two, so that a believer neither worships their own reasoning nor abandons the mind Allah gave them?",
          ar: "يَزعُمُ بَعضُ النّاسِ اليَومَ أنَّ العَقلَ وَحدَهُ يَكفي وأنَّ الوَحيَ لا حاجةَ إلَيه؛ ويَرُدُّ آخَرونَ العَقلَ ويَجعَلونَ التَّفكيرَ ضِدَّ الإيمان. والإسلامُ لا يَأخُذُ بِأيِّ الطَّرَفَين. يُكرِمُ العَقلَ بِوَصفِهِ هِبةً مِنَ اللهِ وأساسَ التَّكليف، ويَأمُرُ بِالتَّفَكُّرِ والتَّأَمُّل — لكِنَّهُ يُخبِرُنا أنَّ العَقلَ وَحدَهُ لا يَبلُغُ أعمَقَ الحَقائِق (حَقيقةَ اللهِ، والغَيبَ، وغايةَ الحَياة، وتَفاصيلَ العِبادةِ والشَّرع). تَأمَّل: إن وَهَبَ اللهُ الإنسانَ عَقلًا، فَلِمَ أرسَلَ الوَحيَ أيضًا — وما العَلاقةُ الصَّحيحةُ بَينَهُما، فَلا يَعبُدُ المُؤمِنُ عَقلَهُ ولا يُلغي العَقلَ الذي وَهَبَهُ اللهُ له؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Al-'aql (العَقل): reason/intellect. An-naql (النَّقل): revelation — the Qur'an and authentic Sunnah.", ar: "العَقل: الفِكرُ والإدراك. النَّقل: الوَحي — القُرآنُ والسُّنّةُ الصَّحيحة." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Al-Mulk 10: the people of the Fire say, 'If only we had listened or reasoned, we would not be among the companions of the Blaze.'", ar: "المُلك ١٠: يَقولُ أهلُ النّار: ﴿لَو كُنّا نَسمَعُ أو نَعقِلُ ما كُنّا في أصحابِ السَّعير﴾." },
          ],
        },
      ],
      body: {
        en: "Islam gives reason (al-'aql) a high and honoured status. Reason is the gift by which Allah distinguished human beings from animals, the faculty by which we know, understand, reflect, and choose, and the very basis of moral and religious responsibility: a person is held accountable before Allah precisely because they possess reason, and the one who loses it (the insane, the child below the age of discernment) is not held accountable. The Qur'an is filled with calls to use reason — to think, reflect, ponder, and understand. Allah repeatedly asks, 'Do they not reason?' 'Do they not reflect?' 'Will they not use their intellect?' He praises 'those of understanding' (ulul-albab) who reflect upon the creation of the heavens and the earth, and He elevates the people of knowledge: 'Are those who know equal to those who do not know? Only those of understanding will remember' (Az-Zumar 9). Islam condemns blind imitation that switches off the mind, and it rebukes those who follow their forefathers without thought. So Islam is not a religion that suppresses reason; on the contrary, it awakens reason, directs it, and honours it — and the proper use of reason leads a sound mind to faith, for reflecting upon the order and wisdom of creation points clearly to the Creator.\n\nYet alongside reason, Islam affirms a second great source of knowledge: revelation (an-naql) — the Qur'an and the authentic Sunnah of the Prophet ﷺ. Revelation is the knowledge that Allah Himself has given to humanity through His Messengers, and it is certain, true, and binding. The reason that revelation is necessary, even though Allah gave us intellect, is that reason, however great, has limits: it cannot, on its own, reach the deepest and most important truths. Reason can recognise that the universe has a Creator, but it cannot, by itself, know the true names and attributes of Allah, the reality of the unseen, what happens after death, the purpose for which we were created, or the details of how Allah wishes to be worshipped and how He commands us to live. These are matters beyond the reach of unaided reason, and so Allah, out of His mercy, sent revelation to guide humanity to the truths it could never discover alone, and to the straight path it could never map by itself. The people of the Fire will confess this very failure: 'If only we had listened or reasoned, we would not be among the companions of the Blaze' (Al-Mulk 10) — joining listening (to revelation) and reasoning (with the intellect) as the two paths to salvation they neglected.\n\nThis shows that reason and revelation are not rivals but partners, each with its role. Revelation is the higher authority, for it is the certain knowledge of Allah, while human reason is limited and can err. But revelation does not abolish reason; rather, it addresses it, awakens it, and guides it. Revelation gives reason the truths it cannot reach on its own, and reason is the faculty by which we understand revelation, reflect upon it, and apply it. A believer therefore uses both rightly: they accept the certain truths of revelation even when these go beyond what reason could discover (such as the details of the unseen), and at the same time they use their reason to understand the religion, to reflect upon its wisdom, to derive rulings from its sources, and to refute false doubts. The error of some is to set reason above revelation, rejecting clear texts because they do not grasp their wisdom — as if the limited human mind were the measure of all truth. The error of others is to abandon reason entirely, falling into blind imitation or superstition. The balanced path of Islam, which we will examine in the next section, is to honour both: to submit to authentic revelation as the certain word of Allah, and to use sound reason in its service — for, as the scholars established, sound reason never truly contradicts authentic revelation.",
        ar: "يُعطي الإسلامُ العَقلَ مَنزِلةً رَفيعةً مُكَرَّمة. فَالعَقلُ هو الهِبةُ التي مَيَّزَ اللهُ بِها الإنسانَ عنِ الحَيَوان، والقُوّةُ التي بِها نَعلَمُ ونَفهَمُ ونَتَأَمَّلُ ونَختار، وأساسُ التَّكليفِ الأخلاقيِّ والدّينيّ: فَالإنسانُ مُحاسَبٌ أمامَ اللهِ لِأنَّهُ يَملِكُ عَقلًا، ومَن فَقَدَهُ (كَالمَجنونِ والصَّبيِّ غَيرِ المُمَيِّز) لا يُحاسَب. والقُرآنُ مَملوءٌ بِالدَّعوةِ إلى إعمالِ العَقل — التَّفكيرِ والتَّأَمُّلِ والتَّدَبُّرِ والفَهم. ويُكَرِّرُ اللهُ: ﴿أفَلا يَعقِلون﴾ ﴿أفَلا يَتَفَكَّرون﴾، ويَمدَحُ ﴿أُولي الألباب﴾ الذينَ يَتَفَكَّرونَ في خَلقِ السَّماواتِ والأرض، ويَرفَعُ أهلَ العِلم: ﴿هَل يَستَوي الذينَ يَعلَمونَ والذينَ لا يَعلَمونَ إنَّما يَتَذَكَّرُ أُولو الألباب﴾ (الزُّمَر ٩). ويَذُمُّ الإسلامُ التَّقليدَ الأعمى الذي يُعَطِّلُ العَقل، ويُنكِرُ على مَن يَتبَعونَ آباءَهُم بِلا تَفَكُّر. فَلَيسَ الإسلامُ دينًا يَكبِتُ العَقل؛ بل على العَكسِ يوقِظُهُ ويُوَجِّهُهُ ويُكرِمُه — وحُسنُ استِعمالِ العَقلِ يَقودُ العَقلَ السَّليمَ إلى الإيمان، فَالتَّأَمُّلُ في نِظامِ الخَلقِ وحِكمَتِهِ يَدُلُّ بِوُضوحٍ على الخالِق.\n\nومعَ العَقلِ يُثبِتُ الإسلامُ مَصدَرًا ثانِيًا عَظيمًا لِلمَعرِفة: النَّقل — القُرآنَ والسُّنّةَ الصَّحيحةَ لِلنَّبِيِّ ﷺ. والوَحيُ هو العِلمُ الذي آتاهُ اللهُ نَفسُهُ لِلبَشَريّةِ عَبرَ رُسُلِه، وهو يَقينٌ حَقٌّ مُلزِم. والسَّبَبُ في ضَرورةِ الوَحيِ، معَ أنَّ اللهَ وَهَبَنا العَقل، أنَّ العَقلَ مَهما عَظُمَ مَحدودٌ: لا يَبلُغُ وَحدَهُ أعمَقَ الحَقائِقِ وأهَمَّها. فَالعَقلُ يُدرِكُ أنَّ لِلكَونِ خالِقًا، لكِنَّهُ لا يَعرِفُ بِنَفسِهِ أسماءَ اللهِ وصِفاتِهِ الحَقّ، ولا حَقيقةَ الغَيب، ولا ما بَعدَ المَوت، ولا الغايةَ التي خُلِقنا لَها، ولا تَفاصيلَ كَيفَ يُريدُ اللهُ أن يُعبَدَ وكَيفَ أمَرَنا أن نَحيا. وهذه أُمورٌ فَوقَ مُتَناوَلِ العَقلِ المُجَرَّد، فَأرسَلَ اللهُ بِرَحمَتِهِ الوَحيَ لِيَهديَ البَشَريّةَ إلى حَقائِقَ لا تُدرِكُها وَحدَها، وإلى صِراطٍ مُستَقيمٍ لا تَرسُمُهُ بِنَفسِها. وسَيُقِرُّ أهلُ النّارِ بِهذا الإخفاقِ نَفسِه: ﴿لَو كُنّا نَسمَعُ أو نَعقِلُ ما كُنّا في أصحابِ السَّعير﴾ (المُلك ١٠) — فَجَمَعوا بَينَ السَّماعِ (لِلوَحي) والعَقلِ (بِالفِكر) طَريقَينِ لِلنَّجاةِ أهمَلوهُما.\n\nيُبَيِّنُ هذا أنَّ العَقلَ والنَّقلَ لَيسا خَصمَينِ بل شَريكان، لِكُلٍّ دَورُه. فَالنَّقلُ هو الحُجّةُ العُليا، لِأنَّهُ عِلمُ اللهِ اليَقين، والعَقلُ البَشَريُّ مَحدودٌ يُخطِئ. لكِنَّ النَّقلَ لا يُلغي العَقل؛ بل يُخاطِبُهُ ويوقِظُهُ ويُوَجِّهُه. يُعطي الوَحيُ العَقلَ الحَقائِقَ التي لا يَبلُغُها وَحدَه، والعَقلُ هو القُوّةُ التي بِها نَفهَمُ الوَحيَ ونَتَدَبَّرُهُ ونُطَبِّقُه. فَيَستَعمِلُ المُؤمِنُ كِلَيهِما بِحَقّ: يَقبَلُ يَقينيّاتِ الوَحيِ ولَو جاوَزَت ما يُدرِكُهُ العَقل (كَتَفاصيلِ الغَيب)، ويَستَعمِلُ في الوَقتِ نَفسِهِ عَقلَهُ لِفَهمِ الدّين، والتَّأَمُّلِ في حِكمَتِه، واستِنباطِ الأحكامِ مِن مَصادِرِه، ودَفعِ الشُّبُهاتِ الباطِلة. وخَطأُ قَومٍ أن يَرفَعوا العَقلَ فَوقَ النَّقل، فَيَرُدّوا النُّصوصَ الواضِحةَ لِأنَّهُم لَم يُدرِكوا حِكمَتَها — كَأنَّ العَقلَ البَشَريَّ المَحدودَ مِعيارُ كُلِّ حَقّ. وخَطأُ آخَرينَ أن يُلغوا العَقلَ بِالكُلّيّة، فَيَقَعوا في التَّقليدِ الأعمى أوِ الخُرافة. والمَنهَجُ المُتَوازِنُ لِلإسلام، الذي نَنظُرُ فيهِ في القِسمِ التّالي، هو إكرامُ الاثنَين: الإذعانُ لِلوَحيِ الصَّحيحِ كَلِمةِ اللهِ اليَقين، واستِعمالُ العَقلِ السَّليمِ في خِدمَتِه — فَكَما قَرَّرَ العُلَماءُ: العَقلُ الصَّريحُ لا يُناقِضُ النَّقلَ الصَّحيحَ حَقيقةً.",
      },
    },
    {
      title: { en: "The right relationship between reason and revelation", ar: "العَلاقةُ الصَّحيحةُ بَينَ العَقلِ والنَّقل" },
      learningObjectives: [
        { en: "Explain that sound reason never contradicts authentic revelation.", ar: "أشرَحُ أنَّ العَقلَ الصَّريحَ لا يُناقِضُ النَّقلَ الصَّحيح." },
        { en: "Apply the balance between reason and revelation today.", ar: "أُطَبِّقُ التَّوازُنَ بَينَ العَقلِ والنَّقلِ اليَوم." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "The order of creation invites reflection.", ar: "نِظامُ الخَلقِ يَدعو إلى التَّفَكُّر." },
        caption: { en: "Sound reason and authentic revelation agree.", ar: "العَقلُ الصَّريحُ والنَّقلُ الصَّحيحُ يَتَّفِقان." },
      },
      groupTasks: {
        title: { en: "Reason in the service of revelation", ar: "العَقلُ في خِدمةِ النَّقل" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "reason-leads-to-faith",
            name: { en: "Team A — Reason leads to faith", ar: "الفَريقُ أ — العَقلُ يَقودُ إلى الإيمان" },
            learningObjective: { en: "Present how sound reason leads to faith and supports revelation.", ar: "نَعرِضُ كَيفَ يَقودُ العَقلُ السَّليمُ إلى الإيمانِ ويَدعَمُ النَّقل." },
            task: { en: "Present how the right use of reason leads to faith and supports revelation: reflecting on the order, design, and wisdom of creation points to a wise Creator; the perfection and inimitability of the Qur'an points to its divine origin; and the truthfulness and character of the Prophet ﷺ point to his prophethood. Show that Islam commands such reflection (ulul-albab who ponder the heavens and earth), and that sound reason, used honestly, leads to belief rather than away from it. Present a 'reason leads to faith' display.", ar: "اعرِضوا كَيفَ يَقودُ حُسنُ استِعمالِ العَقلِ إلى الإيمانِ ويَدعَمُ النَّقل: التَّأَمُّلُ في نِظامِ الخَلقِ وإتقانِهِ وحِكمَتِهِ يَدُلُّ على خالِقٍ حَكيم؛ وكَمالُ القُرآنِ وإعجازُهُ يَدُلُّ على مَصدَرِهِ الإلهيّ؛ وصِدقُ النَّبِيِّ ﷺ وخُلُقُهُ يَدُلُّ على نُبُوَّتِه. بَيِّنوا أنَّ الإسلامَ يَأمُرُ بِهذا التَّأَمُّل (أُولو الألبابِ المُتَفَكِّرونَ في السَّماواتِ والأرض)، وأنَّ العَقلَ السَّليمَ المُستَعمَلَ بِصِدقٍ يَقودُ إلى الإيمانِ لا إلى ضِدِّه. اعرِضوا لَوحةَ «العَقلُ يَقودُ إلى الإيمان»." },
            evidence: [
              { en: "'Indeed in the creation of the heavens and the earth... are signs for those of understanding' (Aal 'Imran 190).", ar: "﴿إنَّ في خَلقِ السَّماواتِ والأرضِ... لَآياتٍ لِأُولي الألباب﴾ (آل عِمران ١٩٠)." },
            ],
            sourceNotes: [
              { en: "Reflection on creation is a path to faith.", ar: "التَّأَمُّلُ في الخَلقِ طَريقٌ لِلإيمان." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'reason leads to faith' display.", ar: "لَوحةُ «العَقلُ يَقودُ إلى الإيمان»." },
          },
          {
            slug: "balance-today",
            name: { en: "Team B — The balance today", ar: "الفَريقُ ب — التَّوازُنُ اليَوم" },
            learningObjective: { en: "Present how to balance reason and revelation today.", ar: "نَعرِضُ كَيفَ نوازِنُ بَينَ العَقلِ والنَّقلِ اليَوم." },
            task: { en: "Present how a young Muslim balances reason and revelation today, avoiding two errors: first, setting reason above revelation — rejecting clear texts because one does not grasp their wisdom, as some do with rulings they dislike; second, abandoning reason — blind imitation, superstition, or refusing to think about the religion. Show the balanced path: submitting to authentic revelation as the certain word of Allah, while using sound reason to understand it, reflect on its wisdom, and answer doubts. Give examples of how to respond when reason and a text seem to conflict (re-examine: is the text authentic? is one's understanding of it correct? is one's reasoning truly sound?). Present a 'reason and revelation in balance' guide.", ar: "اعرِضوا كَيفَ يوازِنُ الشّابُّ المُسلِمُ بَينَ العَقلِ والنَّقلِ اليَوم، مُتَجَنِّبًا خَطأَين: الأوّل رَفعُ العَقلِ فَوقَ النَّقل — رَدُّ النُّصوصِ الواضِحةِ لِعَدَمِ إدراكِ حِكمَتِها، كَما يَفعَلُ بَعضُهُم في أحكامٍ لا تُعجِبُهُم؛ والثّاني إلغاءُ العَقل — التَّقليدُ الأعمى أوِ الخُرافةُ أو رَفضُ التَّفكيرِ في الدّين. بَيِّنوا المَنهَجَ المُتَوازِن: الإذعانَ لِلوَحيِ الصَّحيحِ كَلِمةِ اللهِ اليَقين، معَ استِعمالِ العَقلِ السَّليمِ لِفَهمِهِ والتَّأَمُّلِ في حِكمَتِهِ ودَفعِ الشُّبُهات. أعطوا أمثِلةً لِلتَّعامُلِ حينَ يَبدو تَعارُضٌ بَينَ العَقلِ والنَّصّ (راجِعوا: أصَحيحٌ النَّصّ؟ أصَحيحٌ فَهمُنا له؟ أصَريحٌ عَقلُنا حَقًّا؟). اعرِضوا دَليلَ «العَقلُ والنَّقلُ في تَوازُن»." },
            evidence: [
              { en: "'If only we had listened or reasoned' (Al-Mulk 10).", ar: "﴿لَو كُنّا نَسمَعُ أو نَعقِل﴾ (المُلك ١٠)." },
            ],
            sourceNotes: [
              { en: "Sound reason never truly contradicts authentic revelation.", ar: "العَقلُ الصَّريحُ لا يُناقِضُ النَّقلَ الصَّحيحَ حَقيقةً." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'reason and revelation in balance' guide.", ar: "دَليلُ «العَقلُ والنَّقلُ في تَوازُن»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Using reason and revelation rightly", ar: "استِعمالُ العَقلِ والنَّقلِ بِحَقّ" },
        prompt: { en: "Islam honours both reason and revelation: it commands us to think and reflect, yet it teaches that revelation is the higher authority, giving reason the truths it cannot reach alone — and that sound reason never truly contradicts authentic revelation. Reflect on your own thinking about the religion. Have you ever encountered a ruling or teaching whose wisdom you did not at first understand, or a doubt that made you question? Write about one such case, and describe how the balance between reason and revelation helps you respond: how you can use your reason to understand and reflect on the religion, while submitting to authentic revelation as the certain word of Allah, rather than either rejecting a clear text you dislike or switching off your mind altogether.", ar: "يُكرِمُ الإسلامُ العَقلَ والنَّقلَ مَعًا: يَأمُرُ بِالتَّفَكُّرِ والتَّأَمُّل، ويُعَلِّمُ أنَّ الوَحيَ هو الحُجّةُ العُليا، يُعطي العَقلَ الحَقائِقَ التي لا يَبلُغُها وَحدَه — وأنَّ العَقلَ الصَّريحَ لا يُناقِضُ النَّقلَ الصَّحيحَ حَقيقةً. تَأمَّل تَفكيرَكَ في الدّين. هَل مَرَّ بِكَ حُكمٌ أو تَعليمٌ لَم تُدرِك حِكمَتَهُ أوَّلًا، أو شُبهةٌ جَعَلَتكَ تَتَساءَل؟ اكتُب عن حالةٍ كَهذه، وصِف كَيفَ يُعينُكَ التَّوازُنُ بَينَ العَقلِ والنَّقلِ على الرَّدّ: كَيفَ تَستَعمِلُ عَقلَكَ لِفَهمِ الدّينِ والتَّأَمُّلِ فيه، معَ الإذعانِ لِلوَحيِ الصَّحيحِ كَلِمةِ اللهِ اليَقين، لا أن تَرُدَّ نَصًّا واضِحًا لا يُعجِبُك، ولا أن تُعَطِّلَ عَقلَكَ بِالكُلّيّة." },
        placeholder: { en: "A teaching I did not understand at first was... The balance helps me by...", ar: "تَعليمٌ لَم أفهَمهُ أوَّلًا... والتَّوازُنُ يُعينُني بِـ..." },
      },
      body: {
        en: "The correct relationship between reason and revelation is one of the most important foundations of Islamic thought, and the scholars of Ahl as-Sunnah established a clear and balanced principle concerning it: sound, clear reason (al-'aql as-sarih) never truly contradicts authentic, established revelation (an-naql as-sahih). Both come ultimately from Allah — He created the intellect and He sent down the revelation — and the truth does not contradict the truth. Therefore, whenever someone imagines a contradiction between reason and a religious text, the fault must lie in one of three things, not in a real conflict: either the text is not actually authentic (a weak or fabricated narration), or the understanding of the text is incorrect (it has been misinterpreted), or the supposed 'reasoning' is not truly sound (it is in fact a confused argument, a desire dressed as logic, or a claim beyond reason's reach). When these are examined honestly, the apparent contradiction dissolves. This principle protects the believer from two opposite errors and gives reason and revelation each its proper place.\n\nWhen reason is rightly used, it actually leads to faith and supports revelation. Islam does not ask people to believe blindly; it invites them to reflect, and the honest use of reason points clearly toward Allah. Reflecting upon the vast order, precision, beauty, and wisdom of creation — the heavens, the earth, the human being, the smallest cell and the largest galaxy — leads the sound mind to recognise a wise and powerful Creator, for such design cannot arise from nothing or by chance. Allah repeatedly directs us to this reflection: 'Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for those of understanding' (Aal 'Imran 190). Likewise, reflecting upon the Qur'an — its perfection, its inimitable language, its truthful reports, its consistency, and its guidance — leads the mind to recognise that it could only be from Allah; and reflecting upon the life, truthfulness, and character of the Prophet ﷺ leads to recognising his prophethood. So reason, used honestly, is a path to faith, and revelation then completes what reason has begun, giving certainty and detail where reason reached only the threshold.\n\nThe balanced path of Islam, then, is to honour both reason and revelation, each in its place, and a young Muslim must hold to this balance, especially today. On one side stand those who set reason above revelation, rejecting or 'reinterpreting' clear texts of the Qur'an and Sunnah whenever these conflict with their own opinions, desires, or the fashions of the age — treating the limited human mind as the final measure of truth and, in effect, worshipping their own reasoning. On the other side stand those who abandon reason altogether, falling into blind imitation, superstition, or a faith that refuses to think, reflect, or seek understanding. The believer rejects both extremes. They submit fully to authentic revelation as the certain word of Allah, accepting even what lies beyond the reach of reason (such as the realities of the unseen), trusting that the One who revealed it is the All-Knowing and All-Wise. And at the same time they use the precious gift of reason in the service of revelation: to understand the texts, to reflect upon their wisdom, to derive rulings, to refute false doubts, and to grow in faith through contemplation. This is the way of the people of knowledge, who were both the most submissive to revelation and the most thoughtful and reflective of people. To use reason and revelation together in this balanced way — neither rejecting the word of Allah in the name of one's own reasoning, nor abandoning the mind Allah honoured us with — is the path of sound faith and clear thinking, and the firm ground on which a young Muslim can stand in an age full of both doubts and superstitions.",
        ar: "العَلاقةُ الصَّحيحةُ بَينَ العَقلِ والنَّقلِ مِن أهَمِّ أُسُسِ الفِكرِ الإسلاميّ، وقَد قَرَّرَ عُلَماءُ أهلِ السُّنّةِ فيها قاعِدةً واضِحةً مُتَوازِنة: العَقلُ الصَّريحُ لا يُناقِضُ النَّقلَ الصَّحيحَ الثّابِتَ حَقيقةً. فَكِلاهُما مِنَ اللهِ في النِّهاية — خَلَقَ العَقلَ وأنزَلَ الوَحي — والحَقُّ لا يُناقِضُ الحَقّ. فَمَتى تَوَهَّمَ أحَدٌ تَعارُضًا بَينَ العَقلِ ونَصٍّ شَرعيّ، فَالخَلَلُ في واحِدٍ مِن ثَلاثةٍ لا في تَعارُضٍ حَقيقيّ: إمّا أنَّ النَّصَّ لَيسَ صَحيحًا (رِوايةٌ ضَعيفةٌ أو مَوضوعة)، أو أنَّ فَهمَ النَّصِّ خَطأٌ (أُسيءَ تَأويلُه)، أو أنَّ «العَقلَ» المَزعومَ لَيسَ صَريحًا حَقًّا (بل حُجّةٌ مُضطَرِبة، أو هَوًى بِزِيِّ مَنطِق، أو دَعوى فَوقَ طاقةِ العَقل). فَإذا فُحِصَت هذه بِصِدقٍ زالَ التَّعارُضُ الظّاهِريّ. وهذه القاعِدةُ تَحمي المُؤمِنَ مِن خَطأَينِ مُتَقابِلَين، وتُعطي العَقلَ والنَّقلَ كُلًّا مَكانَه.\n\nوإذا أُحسِنَ استِعمالُ العَقلِ قادَ في الحَقيقةِ إلى الإيمانِ ودَعَمَ النَّقل. فَالإسلامُ لا يَطلُبُ مِنَ النّاسِ إيمانًا أعمى؛ بل يَدعوهُم إلى التَّأَمُّل، وحُسنُ استِعمالِ العَقلِ يَدُلُّ بِوُضوحٍ على الله. فَالتَّأَمُّلُ في نِظامِ الخَلقِ الواسِعِ ودِقَّتِهِ وجَمالِهِ وحِكمَتِهِ — السَّماواتِ والأرضِ والإنسانِ وأصغَرِ خَلِيّةٍ وأكبَرِ مَجَرّة — يَقودُ العَقلَ السَّليمَ إلى إدراكِ خالِقٍ حَكيمٍ قَدير، فَمِثلُ هذا الإتقانِ لا يَنشَأُ مِن عَدَمٍ ولا بِمَحضِ صُدفة. ويُوَجِّهُنا اللهُ مِرارًا إلى هذا التَّأَمُّل: ﴿إنَّ في خَلقِ السَّماواتِ والأرضِ واختِلافِ اللَّيلِ والنَّهارِ لَآياتٍ لِأُولي الألباب﴾ (آل عِمران ١٩٠). وكَذلك التَّأَمُّلُ في القُرآنِ — كَمالِهِ ولُغَتِهِ المُعجِزةِ وأخبارِهِ الصّادِقةِ واتِّساقِهِ وهَديِهِ — يَقودُ العَقلَ إلى إدراكِ أنَّهُ لا يَكونُ إلّا مِنَ الله؛ والتَّأَمُّلُ في حَياةِ النَّبِيِّ ﷺ وصِدقِهِ وخُلُقِهِ يَقودُ إلى إدراكِ نُبُوَّتِه. فَالعَقلُ المُستَعمَلُ بِصِدقٍ طَريقٌ لِلإيمان، ثُمَّ يُتِمُّ الوَحيُ ما بَدَأهُ العَقل، فَيُعطي اليَقينَ والتَّفصيلَ حَيثُ بَلَغَ العَقلُ العَتَبةَ فَقَط.\n\nفَالمَنهَجُ المُتَوازِنُ لِلإسلامِ إذَن إكرامُ العَقلِ والنَّقلِ مَعًا، كُلٌّ في مَكانِه، وعلى الشّابِّ المُسلِمِ أن يَتَمَسَّكَ بِهذا التَّوازُن، خاصّةً اليَوم. فَفي جانِبٍ مَن يَرفَعونَ العَقلَ فَوقَ النَّقل، فَيَرُدّونَ أو «يُؤَوِّلونَ» نُصوصَ القُرآنِ والسُّنّةِ الواضِحةَ كُلَّما خالَفَت آراءَهُم أو أهواءَهُم أو مَوضاتِ العَصر — جاعِلينَ العَقلَ البَشَريَّ المَحدودَ المِعيارَ الأخيرَ لِلحَقّ، فَيَعبُدونَ في الحَقيقةِ عُقولَهُم. وفي الجانِبِ الآخَرِ مَن يُلغونَ العَقلَ بِالكُلّيّة، فَيَقَعونَ في التَّقليدِ الأعمى أوِ الخُرافةِ أو إيمانٍ يَأبى التَّفكيرَ والتَّأَمُّلَ وطَلَبَ الفَهم. والمُؤمِنُ يَرفُضُ الطَّرَفَين. يُذعِنُ تَمامًا لِلوَحيِ الصَّحيحِ كَلِمةِ اللهِ اليَقين، قابِلًا حتّى ما جاوَزَ مُتَناوَلَ العَقل (كَحَقائِقِ الغَيب)، واثِقًا أنَّ مَن أنزَلَهُ هو العَليمُ الحَكيم. وفي الوَقتِ نَفسِهِ يَستَعمِلُ نِعمةَ العَقلِ في خِدمةِ الوَحي: لِفَهمِ النُّصوص، والتَّأَمُّلِ في حِكمَتِها، واستِنباطِ الأحكام، ودَفعِ الشُّبُهات، والنُّمُوِّ في الإيمانِ بِالتَّفَكُّر. هذا مَنهَجُ أهلِ العِلمِ الذينَ كانوا أشَدَّ النّاسِ إذعانًا لِلوَحيِ وأكثَرَهُم تَفَكُّرًا وتَأَمُّلًا. وأن نَستَعمِلَ العَقلَ والنَّقلَ مَعًا بِهذا التَّوازُن — فَلا نَرُدُّ كَلامَ اللهِ بِاسمِ عُقولِنا، ولا نُلغي العَقلَ الذي أكرَمَنا اللهُ بِه — هو طَريقُ الإيمانِ السَّليمِ والفِكرِ الواضِح، والأرضُ الصُّلبةُ التي يَقِفُ علَيها الشّابُّ المُسلِمُ في عَصرٍ مَملوءٍ بِالشُّبُهاتِ والخُرافاتِ مَعًا.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the relationship between sound reason and authentic revelation?", ar: "ما العَلاقةُ بَينَ العَقلِ الصَّريحِ والنَّقلِ الصَّحيح؟" },
      options: [
        { en: "They never truly contradict each other", ar: "لا يَتَناقَضانِ حَقيقةً أبَدًا" },
        { en: "They always contradict", ar: "يَتَناقَضانِ دائِمًا" },
        { en: "Reason is useless", ar: "العَقلُ لا فائِدةَ فيه" },
        { en: "Revelation is unnecessary", ar: "الوَحيُ لا حاجةَ إلَيه" },
      ],
      correctIndex: 0,
      explanation: { en: "Both are from Allah; the truth does not contradict the truth.", ar: "كِلاهُما مِنَ الله؛ والحَقُّ لا يُناقِضُ الحَقّ." },
    },
    {
      prompt: { en: "Why is revelation necessary even though Allah gave us reason?", ar: "لِمَ الوَحيُ ضَروريٌّ معَ أنَّ اللهَ وَهَبَنا العَقل؟" },
      options: [
        { en: "Reason alone cannot reach the deepest truths (the unseen, worship, purpose)", ar: "العَقلُ وَحدَهُ لا يَبلُغُ أعمَقَ الحَقائِق (الغَيب، العِبادة، الغاية)" },
        { en: "Reason is forbidden", ar: "العَقلُ مُحَرَّم" },
        { en: "Revelation replaces thinking", ar: "الوَحيُ يُلغي التَّفكير" },
        { en: "There is no reason for it", ar: "لا سَبَبَ لِذلك" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah sent revelation to guide us to truths reason cannot discover alone.", ar: "أرسَلَ اللهُ الوَحيَ لِيَهديَنا إلى حَقائِقَ لا يُدرِكُها العَقلُ وَحدَه." },
    },
    {
      prompt: { en: "How does Islam view reason?", ar: "كَيفَ يَنظُرُ الإسلامُ إلى العَقل؟" },
      options: [
        { en: "It honours reason and commands reflection", ar: "يُكرِمُ العَقلَ ويَأمُرُ بِالتَّفَكُّر" },
        { en: "It forbids all thinking", ar: "يُحَرِّمُ كُلَّ تَفكير" },
        { en: "It treats reason as the highest authority above revelation", ar: "يَجعَلُ العَقلَ الحُجّةَ العُليا فَوقَ الوَحي" },
        { en: "It ignores reason", ar: "يُهمِلُ العَقل" },
      ],
      correctIndex: 0,
      explanation: { en: "Islam awakens and directs reason, but revelation is the higher authority.", ar: "يوقِظُ الإسلامُ العَقلَ ويُوَجِّهُهُ، والوَحيُ هو الحُجّةُ العُليا." },
    },
    {
      prompt: { en: "When someone imagines a contradiction between reason and a text, the fault is usually...", ar: "حينَ يَتَوَهَّمُ أحَدٌ تَعارُضًا بَينَ العَقلِ ونَصّ، فَالخَلَلُ غالِبًا..." },
      options: [
        { en: "A weak text, a wrong understanding, or unsound reasoning", ar: "نَصٌّ ضَعيف، أو فَهمٌ خاطِئ، أو عَقلٌ غَيرُ صَريح" },
        { en: "A real conflict in the truth", ar: "تَعارُضٌ حَقيقيٌّ في الحَقّ" },
        { en: "Always the text is wrong", ar: "النَّصُّ دائِمًا خاطِئ" },
        { en: "Always reason is wrong", ar: "العَقلُ دائِمًا خاطِئ" },
      ],
      correctIndex: 0,
      explanation: { en: "Examined honestly, the apparent contradiction dissolves.", ar: "بِالفَحصِ الصّادِقِ يَزولُ التَّعارُضُ الظّاهِريّ." },
    },
    {
      prompt: { en: "What does the right use of reason lead to?", ar: "إلامَ يَقودُ حُسنُ استِعمالِ العَقل؟" },
      options: [
        { en: "Faith — reflecting on creation points to the Creator", ar: "الإيمان — التَّأَمُّلُ في الخَلقِ يَدُلُّ على الخالِق" },
        { en: "Disbelief", ar: "الكُفر" },
        { en: "Confusion only", ar: "الحَيرةُ فَقَط" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "'Signs for those of understanding' (Aal 'Imran 190).", ar: "﴿لَآياتٍ لِأُولي الألباب﴾ (آل عِمران ١٩٠)." },
    },
    {
      prompt: { en: "True or False: A believer should reject clear authentic texts whenever they do not grasp their wisdom.", ar: "صَوابٌ أم خَطأ: على المُؤمِنِ أن يَرُدَّ النُّصوصَ الصَّحيحةَ الواضِحةَ كُلَّما لَم يُدرِك حِكمَتَها." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "We submit to authentic revelation, trusting the All-Wise who revealed it.", ar: "نُذعِنُ لِلوَحيِ الصَّحيح، واثِقينَ بِالحَكيمِ الذي أنزَلَه." },
    },
  ],
};
