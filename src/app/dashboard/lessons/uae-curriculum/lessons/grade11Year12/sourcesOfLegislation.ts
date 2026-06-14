import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const sourcesOfLegislation: CourseLesson = {
  slug: "g11y12-sources-of-islamic-legislation",
  name: { en: "Sources of Islamic Legislation", ar: "مَصادِرُ التَّشريعِ الإسلاميّ" },
  shortIntro: {
    en: "Islamic law (sharia) is derived from clear, ordered sources: the Qur'an, the Sunnah, the consensus of the scholars (ijma'), and analogy (qiyas), with other secondary sources. This lesson studies these sources, their order and authority, how the scholars derive rulings from them (fiqh and usul al-fiqh), and why understanding them protects a young Muslim from confusion and from following desires or unqualified voices.",
    ar: "الشَّريعةُ الإسلاميّةُ مُستَمَدّةٌ مِن مَصادِرَ واضِحةٍ مُرَتَّبة: القُرآنِ والسُّنّةِ وإجماعِ العُلَماءِ والقِياس، معَ مَصادِرَ أُخرى تَبَعيّة. يَدرُسُ هذا الدَّرسُ هذه المَصادِرَ وتَرتيبَها وحُجِّيَّتَها، وكَيفَ يَستَنبِطُ العُلَماءُ مِنها الأحكام (الفِقهُ وأُصولُ الفِقه)، ولِمَ يَحمي فَهمُها الشّابَّ المُسلِمَ مِنَ الاضطِرابِ ومِن اتِّباعِ الهَوى أوِ الأصواتِ غَيرِ المُؤَهَّلة.",
  },
  quranSurahs: ["An-Nisa 59", "An-Nisa 83"],
  sections: [
    {
      title: { en: "The primary sources: Qur'an and Sunnah", ar: "المَصدَرانِ الأصليّان: القُرآنُ والسُّنّة" },
      learningObjectives: [
        { en: "Identify the primary sources of Islamic legislation.", ar: "أُحَدِّدُ المَصدَرَينِ الأصليَّينِ لِلتَّشريع." },
        { en: "Explain the authority of the Qur'an and Sunnah.", ar: "أشرَحُ حُجّيّةَ القُرآنِ والسُّنّة." },
      ],
      successCriteria: [
        { en: "I can explain An-Nisa 59.", ar: "أشرَحُ النِّساء ٥٩." },
        { en: "I can describe the Qur'an and Sunnah as sources.", ar: "أصِفُ القُرآنَ والسُّنّةَ مَصدَرَين." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "The Qur'an — the first source of legislation.", ar: "القُرآن — المَصدَرُ الأوَّلُ لِلتَّشريع." },
        caption: { en: "'Obey Allah and obey the Messenger' (An-Nisa 59).", ar: "﴿أطيعوا اللهَ وأطيعوا الرَّسول﴾ (النِّساء ٥٩)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How do Muslims know what Allah wants of them, and who decides?", ar: "كَيفَ يَعرِفُ المُسلِمونَ ما يُريدُهُ اللهُ مِنهُم، ومَن يُقَرِّر؟" },
        body: {
          en: "Muslims believe their lives should follow the guidance of Allah — but how exactly do they know what Allah has commanded and forbidden in the countless situations of life, many of which were never mentioned by name in any text? Islam answers this with ordered, disciplined sources of legislation: the Qur'an, the Sunnah, the consensus of the scholars, and analogy. Reflect: how does a religion derive detailed guidance for every age from these sources, why does the order and authority of the sources matter, and why is it dangerous for a Muslim to take rulings from unqualified people or to follow personal desire rather than these established sources?",
          ar: "يُؤمِنُ المُسلِمونَ أنَّ حَياتَهُم يَنبَغي أن تَتبَعَ هُدى الله — لكِن كَيفَ يَعرِفونَ تَحديدًا ما أمَرَ بِهِ اللهُ ونَهى عَنهُ في مَواقِفِ الحَياةِ التي لا تُحصى، وكَثيرٌ مِنها لَم يُذكَر بِاسمِهِ في نَصّ؟ يُجيبُ الإسلامُ بِمَصادِرِ تَشريعٍ مُرَتَّبةٍ مُنضَبِطة: القُرآنِ والسُّنّةِ وإجماعِ العُلَماءِ والقِياس. تَأمَّل: كَيفَ يَستَنبِطُ الدّينُ هُدًى مُفَصَّلًا لِكُلِّ عَصرٍ مِن هذه المَصادِر، ولِمَ يُهِمُّ تَرتيبُها وحُجِّيَّتُها، ولِمَ يَخطُرُ بِالمُسلِمِ أن يَأخُذَ الأحكامَ مِن غَيرِ المُؤَهَّلينَ أو يَتبَعَ هَواهُ بَدَلًا مِن هذه المَصادِرِ الثّابِتة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Sharia (الشَّريعة): the path/law revealed by Allah. Usul al-fiqh (أُصولُ الفِقه): the science of the principles of deriving rulings.", ar: "الشَّريعة: الطَّريقُ الذي شَرَعَهُ الله. أُصولُ الفِقه: عِلمُ قَواعِدِ استِنباطِ الأحكام." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "An-Nisa 59: obey Allah, the Messenger, and those in authority; refer disputes to Allah and the Messenger.", ar: "النِّساء ٥٩: أطيعوا اللهَ والرَّسولَ وأُولي الأمر؛ ورُدّوا التَّنازُعَ إلى اللهِ والرَّسول." },
          ],
        },
      ],
      body: {
        en: "The sharia — the path that Allah has laid down for human life — is not left to guesswork or personal opinion. Allah, in His wisdom and mercy, provided ordered, disciplined sources from which the rulings of the religion are derived, and He raised up scholars to understand them and a whole science, usul al-fiqh (the principles of jurisprudence), to govern how rulings are correctly extracted. The scholars of Islam agree that the sources of legislation are, in order: the Qur'an, the Sunnah, the consensus of the scholars (ijma'), and analogy (qiyas), followed by a number of secondary sources. This ordered structure means that a Muslim does not derive the religion from feelings, customs, or the loudest voice, but from established sources understood according to sound principles. The foundational verse for this is Allah's command: 'O you who have believed, obey Allah and obey the Messenger and those in authority among you. And if you disagree over anything, refer it to Allah and the Messenger, if you should believe in Allah and the Last Day. That is the best way and best in result' (An-Nisa 59) — establishing obedience to Allah (the Qur'an), to the Messenger (the Sunnah), the role of legitimate authority and the scholars, and the principle of referring all disputes back to the Qur'an and Sunnah.\n\nThe first and greatest source is the Noble Qur'an, the very speech of Allah, revealed to the Prophet ﷺ and preserved without change. It is the absolute foundation: every ruling in Islam must agree with it, and nothing that contradicts it can be part of the religion. The Qur'an lays down the foundations of belief, worship, morality, and law — sometimes in detail, as in the laws of inheritance, and often in general principles that the Sunnah and the scholars then explain and apply. Because it is the certain, preserved word of Allah, it stands above every other source.\n\nThe second source is the Sunnah of the Prophet ﷺ — his authentic sayings, actions, and approvals. The Sunnah is the second foundation of Islam and is itself a form of revelation in meaning, for Allah says of the Prophet ﷺ: 'Nor does he speak from his own desire. It is but a revelation revealed' (An-Najm 3-4). The Sunnah explains and details the Qur'an: the Qur'an commands prayer, zakat, and Hajj, but it is the Sunnah that shows how to pray, how much zakat to give, and how to perform Hajj. The Sunnah also establishes rulings not mentioned explicitly in the Qur'an. This is why obedience to the Messenger is commanded alongside obedience to Allah throughout the Qur'an — 'Whoever obeys the Messenger has obeyed Allah' (An-Nisa 80) — and why rejecting the authentic Sunnah is, in reality, rejecting a part of the religion that Allah commanded us to follow. The Qur'an and the Sunnah together are the two primary, revealed sources of Islamic legislation, and the other sources, as we will see in the next section, are in reality ways of correctly understanding and applying these two and extending their guidance to new situations.",
        ar: "الشَّريعةُ — الطَّريقُ الذي شَرَعَهُ اللهُ لِحَياةِ الإنسان — لَيسَت مَترُوكةً لِلتَّخمينِ أوِ الرَّأيِ الشَّخصيّ. فَاللهُ بِحِكمَتِهِ ورَحمَتِهِ جَعَلَ مَصادِرَ مُرَتَّبةً مُنضَبِطةً تُستَمَدُّ مِنها أحكامُ الدّين، وأقامَ عُلَماءَ لِفَهمِها، وعِلمًا كامِلًا هو أُصولُ الفِقهِ يَضبِطُ كَيفَ تُستَنبَطُ الأحكامُ صَحيحةً. واتَّفَقَ عُلَماءُ الإسلامِ أنَّ مَصادِرَ التَّشريعِ بِالتَّرتيب: القُرآنُ، فَالسُّنّة، فَإجماعُ العُلَماء، فَالقِياس، ثُمَّ مَصادِرُ تَبَعيّةٌ عِدّة. وهذا البِناءُ المُرَتَّبُ يَعني أنَّ المُسلِمَ لا يَستَنبِطُ الدّينَ مِنَ المَشاعِرِ أوِ العاداتِ أو أعلى الأصوات، بل مِن مَصادِرَ ثابِتةٍ تُفهَمُ بِقَواعِدَ صَحيحة. والآيةُ الأساسُ في ذلك قَولُ الله: ﴿يا أيُّها الذينَ آمَنوا أطيعوا اللهَ وأطيعوا الرَّسولَ وأُولي الأمرِ مِنكُم فَإن تَنازَعتُم في شَيءٍ فَرُدّوهُ إلى اللهِ والرَّسولِ إن كُنتُم تُؤمِنونَ بِاللهِ واليَومِ الآخِر ذلك خَيرٌ وأحسَنُ تَأويلًا﴾ (النِّساء ٥٩) — فَأثبَتَت طاعةَ اللهِ (القُرآن)، وطاعةَ الرَّسول (السُّنّة)، ودَورَ وُلاةِ الأمرِ والعُلَماء، ومَبدَأَ رَدِّ كُلِّ نِزاعٍ إلى القُرآنِ والسُّنّة.\n\nوالمَصدَرُ الأوَّلُ الأعظَمُ هو القُرآنُ الكَريم، كَلامُ اللهِ نَفسُه، المُنَزَّلُ على النَّبِيِّ ﷺ المَحفوظُ دونَ تَغيير. وهو الأساسُ المُطلَق: كُلُّ حُكمٍ في الإسلامِ لا بُدَّ أن يُوافِقَه، وما خالَفَهُ لا يَكونُ مِنَ الدّين. يَضَعُ القُرآنُ أُصولَ العَقيدةِ والعِبادةِ والأخلاقِ والأحكام — أحيانًا بِتَفصيلٍ كَآياتِ المَواريث، وغالِبًا بِقَواعِدَ عامّةٍ تُبَيِّنُها وتُطَبِّقُها السُّنّةُ والعُلَماء. ولِأنَّهُ كَلامُ اللهِ القَطعيُّ المَحفوظ، فَهو فَوقَ كُلِّ مَصدَرٍ آخَر.\n\nوالمَصدَرُ الثّاني سُنّةُ النَّبِيِّ ﷺ — أقوالُهُ وأفعالُهُ وتَقريراتُهُ الصَّحيحة. والسُّنّةُ الأساسُ الثّاني لِلإسلام، وهي وَحيٌ في المَعنى، فَقَد قالَ اللهُ في النَّبِيِّ ﷺ: ﴿وما يَنطِقُ عنِ الهَوى إن هو إلّا وَحيٌ يوحى﴾ (النَّجم ٣-٤). والسُّنّةُ تُبَيِّنُ القُرآنَ وتُفَصِّلُه: فَالقُرآنُ يَأمُرُ بِالصَّلاةِ والزَّكاةِ والحَجّ، والسُّنّةُ تُبَيِّنُ كَيفَ نُصَلّي، وكَم نُزَكّي، وكَيفَ نَحُجّ. وتُثبِتُ السُّنّةُ أيضًا أحكامًا لَم تُذكَر صَراحةً في القُرآن. ولِهذا أُمِرَ بِطاعةِ الرَّسولِ معَ طاعةِ اللهِ في القُرآنِ كُلِّه — ﴿مَن يُطِعِ الرَّسولَ فَقَد أطاعَ الله﴾ (النِّساء ٨٠) — ولِهذا كانَ رَدُّ السُّنّةِ الصَّحيحةِ في الحَقيقةِ رَدًّا لِجُزءٍ مِنَ الدّينِ أمَرَنا اللهُ بِاتِّباعِه. فَالقُرآنُ والسُّنّةُ مَعًا هُما المَصدَرانِ الأصليّانِ المُوحَيانِ لِلتَّشريعِ الإسلاميّ، وسائِرُ المَصادِر، كَما سَنَرى في القِسمِ التّالي، هي في الحَقيقةِ طُرُقٌ لِفَهمِ هذَينِ المَصدَرَينِ وتَطبيقِهِما ومَدِّ هُداهُما إلى المَسائِلِ الجَديدة.",
      },
    },
    {
      title: { en: "Ijma', qiyas, and deriving rulings", ar: "الإجماعُ والقِياسُ واستِنباطُ الأحكام" },
      learningObjectives: [
        { en: "Explain ijma' and qiyas as sources.", ar: "أشرَحُ الإجماعَ والقِياسَ مَصدَرَين." },
        { en: "Explain why understanding the sources protects the believer.", ar: "أشرَحُ كَيفَ يَحمي فَهمُ المَصادِرِ المُؤمِن." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "The books of fiqh and usul al-fiqh.", ar: "كُتُبُ الفِقهِ وأُصولِه." },
        caption: { en: "The scholars derive rulings by disciplined principles.", ar: "يَستَنبِطُ العُلَماءُ الأحكامَ بِقَواعِدَ مُنضَبِطة." },
      },
      groupTasks: {
        title: { en: "The sources of the sharia", ar: "مَصادِرُ الشَّريعة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "ijma-qiyas",
            name: { en: "Team A — Consensus and analogy", ar: "الفَريقُ أ — الإجماعُ والقِياس" },
            learningObjective: { en: "Present ijma' and qiyas and secondary sources.", ar: "نَعرِضُ الإجماعَ والقِياسَ والمَصادِرَ التَّبَعيّة." },
            task: { en: "Present the third and fourth sources and the secondary ones, with simple examples: ijma' (the agreement of the qualified scholars of an age on a ruling) — a binding source because the Ummah does not unite on error; qiyas (analogy: applying the ruling of a text to a new case sharing the same effective cause, 'illah) — e.g. the prohibition of intoxicants beyond wine by analogy, or rulings on new drugs by analogy to khamr; and a brief mention of secondary sources used by scholars (such as istihsan, the custom 'urf, public interest maslahah, and the practice of the people of Madinah). Show that these are disciplined ways of understanding and extending the Qur'an and Sunnah, not new independent religions. Present a 'sources of the sharia' display.", ar: "اعرِضوا المَصدَرَ الثّالِثَ والرّابِعَ والتَّبَعيّةَ بِأمثِلةٍ بَسيطة: الإجماعَ (اتِّفاقَ عُلَماءِ العَصرِ المُؤَهَّلينَ على حُكم) — مَصدَرٌ مُلزِمٌ لِأنَّ الأُمّةَ لا تَجتَمِعُ على ضَلالة؛ والقِياسَ (إلحاقَ حُكمِ النَّصِّ بِمَسألةٍ جَديدةٍ تُشارِكُهُ في العِلّة) — كَتَحريمِ المُسكِراتِ غَيرِ الخَمرِ قِياسًا، أو أحكامِ المُخَدِّراتِ الجَديدةِ قِياسًا على الخَمر؛ وإشارةً مُوجَزةً إلى المَصادِرِ التَّبَعيّة (كَالاستِحسانِ والعُرفِ والمَصلَحةِ وعَمَلِ أهلِ المَدينة). بَيِّنوا أنَّها طُرُقٌ مُنضَبِطةٌ لِفَهمِ القُرآنِ والسُّنّةِ ومَدِّهِما، لا أديانٌ جَديدةٌ مُستَقِلّة. اعرِضوا لَوحةَ «مَصادِرِ الشَّريعة»." },
            evidence: [
              { en: "Qiyas connects new cases to texts by shared cause ('illah).", ar: "القِياسُ يَربِطُ الجَديدَ بِالنَّصِّ بِالعِلّةِ المُشتَرَكة." },
            ],
            sourceNotes: [
              { en: "These sources serve the Qur'an and Sunnah.", ar: "هذه المَصادِرُ تَخدِمُ القُرآنَ والسُّنّة." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'sources of the sharia' display.", ar: "لَوحةُ «مَصادِرِ الشَّريعة»." },
          },
          {
            slug: "protection-of-knowledge",
            name: { en: "Team B — Why the sources protect us", ar: "الفَريقُ ب — لِمَ تَحمينا المَصادِر" },
            learningObjective: { en: "Present how understanding the sources protects the believer.", ar: "نَعرِضُ كَيفَ يَحمي فَهمُ المَصادِرِ المُؤمِن." },
            task: { en: "Present why understanding the sources of legislation protects a young Muslim today: it shows that rulings come from revelation understood by qualified scholars, not from feelings, customs, or popularity; it protects against following desires (hawa) and against those who twist the religion; it teaches the believer to ask 'what is the evidence and who is the qualified scholar?' rather than taking religion from anyone online; it explains why scholars sometimes differ (a mercy within limits) and why the unqualified should not issue fatwas; and it builds respect for sound scholarship while keeping the Qur'an and Sunnah supreme. Present a 'protected by knowledge' guide.", ar: "اعرِضوا لِمَ يَحمي فَهمُ مَصادِرِ التَّشريعِ الشّابَّ المُسلِمَ اليَوم: يُبَيِّنُ أنَّ الأحكامَ مِنَ الوَحيِ بِفَهمِ العُلَماءِ المُؤَهَّلين، لا مِنَ المَشاعِرِ أوِ العاداتِ أوِ الشُّهرة؛ ويَحمي مِنَ اتِّباعِ الهَوى ومِمَّن يُحَرِّفونَ الدّين؛ ويُعَلِّمُ المُؤمِنَ أن يَسألَ «ما الدَّليلُ ومَنِ العالِمُ المُؤَهَّل؟» بَدَلَ أخذِ الدّينِ مِن أيِّ أحَدٍ على الشَّبَكة؛ ويُفَسِّرُ لِمَ يَختَلِفُ العُلَماءُ أحيانًا (رَحمةٌ ضِمنَ حُدود) ولِمَ لا يُفتي غَيرُ المُؤَهَّل؛ ويَبني احتِرامَ العِلمِ الصَّحيحِ معَ بَقاءِ القُرآنِ والسُّنّةِ فَوقَ الكُلّ. اعرِضوا دَليلَ «المَحفوظِ بِالعِلم»." },
            evidence: [
              { en: "'If you disagree, refer it to Allah and the Messenger' (An-Nisa 59).", ar: "﴿فَإن تَنازَعتُم في شَيءٍ فَرُدّوهُ إلى اللهِ والرَّسول﴾ (النِّساء ٥٩)." },
            ],
            sourceNotes: [
              { en: "Ask for evidence and qualified scholarship.", ar: "اطلُبِ الدَّليلَ والعِلمَ المُؤَهَّل." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'protected by knowledge' guide.", ar: "دَليلُ «المَحفوظِ بِالعِلم»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Where I take my religion from", ar: "مِن أينَ آخُذُ ديني" },
        prompt: { en: "Islamic rulings are derived from ordered sources — the Qur'an, the Sunnah, the consensus of scholars (ijma'), and analogy (qiyas) — understood by qualified scholars through the science of usul al-fiqh, not from feelings, customs, or the loudest voice online. Reflect on where you take your understanding of the religion from. When you have a question about what is halal or haram, do you seek the evidence and qualified scholars, or do you rely on random sources, social media, or your own desire? Write about why understanding the sources of legislation matters for you, and describe two practical ways you will make sure you take your religion from sound, qualified sources rather than from confusion or desire.", ar: "أحكامُ الإسلامِ مُستَمَدّةٌ مِن مَصادِرَ مُرَتَّبة — القُرآنِ والسُّنّةِ وإجماعِ العُلَماءِ والقِياس — يَفهَمُها العُلَماءُ المُؤَهَّلونَ بِعِلمِ أُصولِ الفِقه، لا مِنَ المَشاعِرِ أوِ العاداتِ أو أعلى الأصواتِ على الشَّبَكة. تَأمَّل مِن أينَ تَأخُذُ فَهمَكَ لِلدّين. حينَ يَكونُ عِندَكَ سُؤالٌ عن حَلالٍ أو حَرام، أتَطلُبُ الدَّليلَ والعُلَماءَ المُؤَهَّلين، أم تَعتَمِدُ على مَصادِرَ عَشوائيّةٍ أوِ التَّواصُلِ الاجتِماعيِّ أو هَواك؟ اكتُب لِمَ يُهِمُّكَ فَهمُ مَصادِرِ التَّشريع، وصِف طَريقَتَينِ عَمَليَّتَينِ سَتَضمَنُ بِهِما أن تَأخُذَ دينَكَ مِن مَصادِرَ صَحيحةٍ مُؤَهَّلةٍ لا مِنَ الاضطِرابِ أوِ الهَوى." },
        placeholder: { en: "I take my religion from... To be sure of sound sources I will...", ar: "آخُذُ ديني مِن... ولِأتَأَكَّدَ مِنَ المَصادِرِ الصَّحيحةِ سَأ..." },
      },
      body: {
        en: "After the two revealed sources — the Qur'an and the Sunnah — the scholars recognise two further agreed-upon sources, both of which are in reality disciplined ways of understanding and extending the guidance of the Qur'an and Sunnah. The third source is consensus (ijma'): the agreement of the qualified scholars (mujtahidun) of a particular age on a ruling. Ijma' is a binding proof, based on the Prophet's ﷺ teaching that his Ummah, as a whole, would not unite upon error or misguidance. When the qualified scholars of the Ummah agree on a ruling — such as the obligation of the five daily prayers or the precise share of inheritance for certain heirs — that agreement carries great authority, for it reflects the collective understanding of the experts of the religion grounded in the revealed texts. The fourth source is analogy (qiyas): extending the ruling of an established text to a new case that shares the same effective cause ('illah). For example, the Qur'an forbids wine (khamr) because it intoxicates; by analogy, every intoxicating substance is forbidden, including drugs and other intoxicants unknown in earlier times, because they share the same effective cause. Qiyas is how the limited texts of revelation provide guidance for the limitless new situations of every age, always anchored in the meaning and purpose of the texts. Beyond these four, the scholars also use a number of secondary sources and tools — such as istihsan (juristic preference), 'urf (sound custom), maslahah (consideration of genuine public interest within the bounds of the sharia), and the practice of the people of Madinah — to apply the sharia wisely, though these are subordinate to the primary sources and operate within their limits.\n\nThese sources are not separate or competing 'religions'; they form one integrated structure, with the Qur'an supreme, the Sunnah explaining and adding to it, ijma' reflecting the settled understanding of the scholars, and qiyas extending the texts to new cases. The deriving of rulings from these sources is the work of qualified scholars trained in the Arabic language, the Qur'anic sciences, the science of hadith, and usul al-fiqh — the science of the principles by which rulings are correctly extracted. This is a demanding discipline, which is why issuing rulings (fatwa) in the religion is the task of the qualified scholars, not of anyone who wishes to speak. The differences that sometimes appear among the great scholars in matters of detail arise from this careful process — from differences in the strength of evidence reaching them or in how texts are understood — and within proper limits these differences are a recognised mercy and breadth in the religion, not contradictions in its foundations.\n\nUnderstanding the sources of legislation is of great practical importance for a young Muslim today, because it protects against confusion, desire, and misguidance. In an age in which anyone can broadcast opinions about the religion online, and in which feelings, fashions, and 'what most people do' are often treated as if they were the measure of right and wrong, the believer who understands the sources knows that the religion is taken from revelation as understood by qualified scholars, not from the loudest or most popular voice. Such a believer learns to ask, when they hear a ruling, 'What is the evidence for this, and who is the qualified scholar saying it?' rather than accepting religious claims from unknown or unqualified sources. They are protected from following their own desires (hawa) and dressing them up as religion, for they know that the sharia is not bent to suit our wishes but derived from Allah's guidance. They understand why scholars sometimes differ, and so are not shaken by such differences nor misled by those who exploit them. And they grow in respect for sound, deep scholarship while keeping the Qur'an and Sunnah always supreme, refusing to follow even a scholar against a clear, authentic text. To know where the religion comes from, to take it only from sound and qualified sources, to ask always for the evidence, and to submit one's desires to the guidance of Allah rather than the reverse — this is the protection and the wisdom that understanding the sources of Islamic legislation gives to every believer.",
        ar: "بَعدَ المَصدَرَينِ المُوحَيَين — القُرآنِ والسُّنّة — يُثبِتُ العُلَماءُ مَصدَرَينِ آخَرَينِ مُتَّفَقًا علَيهِما، وكِلاهُما في الحَقيقةِ طَريقةٌ مُنضَبِطةٌ لِفَهمِ هُدى القُرآنِ والسُّنّةِ ومَدِّه. فَالمَصدَرُ الثّالِثُ الإجماع: اتِّفاقُ عُلَماءِ العَصرِ المُجتَهِدينَ على حُكم. والإجماعُ حُجّةٌ مُلزِمة، بِناءً على تَعليمِ النَّبِيِّ ﷺ أنَّ أُمَّتَهُ في جُملَتِها لا تَجتَمِعُ على ضَلالةٍ أو خَطأ. فَإذا اتَّفَقَ عُلَماءُ الأُمّةِ المُؤَهَّلونَ على حُكم — كَوُجوبِ الصَّلَواتِ الخَمسِ أو نَصيبِ بَعضِ الوَرَثةِ المُحَدَّد — كانَ لِذلك الاتِّفاقِ سُلطانٌ عَظيم، فَهو يَعكِسُ الفَهمَ الجَماعيَّ لِأهلِ العِلمِ المُؤَسَّسَ على النُّصوصِ المُوحاة. والمَصدَرُ الرّابِعُ القِياس: إلحاقُ حُكمِ النَّصِّ الثّابِتِ بِمَسألةٍ جَديدةٍ تُشارِكُهُ في العِلّة. فَمَثَلًا حَرَّمَ القُرآنُ الخَمرَ لِأنَّها تُسكِر؛ فَبِالقِياسِ يَحرُمُ كُلُّ مُسكِر، ومِنهُ المُخَدِّراتُ وغَيرُها مِمّا لَم يُعرَف قَديمًا، لِاشتِراكِها في العِلّةِ نَفسِها. والقِياسُ هو كَيفَ تُقَدِّمُ نُصوصُ الوَحيِ المَحدودةُ هُدًى لِمَسائِلِ كُلِّ عَصرٍ اللّامَحدودة، مَربوطًا دائِمًا بِمَعنى النُّصوصِ ومَقصِدِها. وفَوقَ هذه الأربَعةِ يَستَعمِلُ العُلَماءُ مَصادِرَ وأدَواتٍ تَبَعيّةً — كَالاستِحسانِ والعُرفِ الصَّحيحِ والمَصلَحةِ المُعتَبَرةِ ضِمنَ حُدودِ الشَّرعِ وعَمَلِ أهلِ المَدينة — لِتَطبيقِ الشَّريعةِ بِحِكمة، وهي تابِعةٌ لِلمَصادِرِ الأصليّةِ تَعمَلُ ضِمنَ حُدودِها.\n\nوهذه المَصادِرُ لَيسَت أديانًا مُنفَصِلةً مُتَنافِسة؛ بل تُكَوِّنُ بِناءً واحِدًا مُتَكامِلًا، القُرآنُ فَوقَه، والسُّنّةُ تُبَيِّنُهُ وتَزيدُ علَيه، والإجماعُ يَعكِسُ الفَهمَ المُستَقِرَّ لِلعُلَماء، والقِياسُ يَمُدُّ النُّصوصَ إلى الجَديد. واستِنباطُ الأحكامِ مِن هذه المَصادِرِ عَمَلُ العُلَماءِ المُؤَهَّلينَ المُتَمَكِّنينَ مِنَ العَرَبِيّةِ وعُلومِ القُرآنِ وعِلمِ الحَديثِ وأُصولِ الفِقه — عِلمِ القَواعِدِ التي تُستَخرَجُ بِها الأحكامُ صَحيحة. وهذا عِلمٌ دَقيقٌ شاقّ، ولِهذا كانَتِ الفَتوى في الدّينِ مِن مَهَمّةِ العُلَماءِ المُؤَهَّلين، لا كُلِّ مَن أرادَ أن يَتَكَلَّم. والخِلافُ الذي يَظهَرُ أحيانًا بَينَ كِبارِ العُلَماءِ في مَسائِلِ التَّفصيلِ ناشِئٌ مِن هذه العَمَليّةِ الدَّقيقة — مِن تَفاوُتِ قُوّةِ الأدِلّةِ التي بَلَغَتهُم أو فَهمِ النُّصوص — وهو ضِمنَ حُدودِهِ رَحمةٌ وسَعةٌ مُعتَبَرةٌ في الدّين، لا تَناقُضٌ في أُصولِه.\n\nوفَهمُ مَصادِرِ التَّشريعِ ذو أهَمّيّةٍ عَمَليّةٍ كُبرى لِلشّابِّ المُسلِمِ اليَوم، لِأنَّهُ يَحمي مِنَ الاضطِرابِ والهَوى والضَّلال. ففي عَصرٍ يَستَطيعُ فيهِ كُلُّ أحَدٍ أن يَبُثَّ آراءَهُ في الدّينِ على الشَّبَكة، وتُعامَلُ فيهِ المَشاعِرُ والمَوضاتُ و«ما يَفعَلُهُ أكثَرُ النّاس» كَأنَّها مِقياسُ الحَقِّ والباطِل، يَعلَمُ المُؤمِنُ الذي يَفهَمُ المَصادِرَ أنَّ الدّينَ يُؤخَذُ مِنَ الوَحيِ بِفَهمِ العُلَماءِ المُؤَهَّلين، لا مِن أعلى الأصواتِ أو أشهَرِها. فَيَتَعَلَّمُ أن يَسألَ، إذا سَمِعَ حُكمًا: «ما دَليلُ هذا، ومَنِ العالِمُ المُؤَهَّلُ القائِلُ بِه؟» بَدَلَ قَبولِ الدَّعاوى الدّينيّةِ مِن مَجاهيلَ أو غَيرِ مُؤَهَّلين. ويُحفَظُ مِن أن يَتبَعَ هَواهُ ويُلبِسَهُ ثَوبَ الدّين، فَيَعلَمُ أنَّ الشَّريعةَ لا تُلوى لِتُوافِقَ رَغَباتِنا بل تُستَمَدُّ مِن هُدى الله. ويَفهَمُ لِمَ يَختَلِفُ العُلَماءُ أحيانًا، فَلا تَهُزُّهُ تِلكَ الخِلافاتُ ولا يُضَلِّلُهُ مَن يَستَغِلُّها. ويَزدادُ احتِرامًا لِلعِلمِ الصَّحيحِ العَميقِ معَ بَقاءِ القُرآنِ والسُّنّةِ فَوقَ الكُلِّ دائِمًا، فَلا يَتبَعُ حتّى عالِمًا في مُقابِلِ نَصٍّ صَحيحٍ صَريح. وأن يَعرِفَ المَرءُ مِن أينَ يَأتي الدّين، ولا يَأخُذَهُ إلّا مِن مَصادِرَ صَحيحةٍ مُؤَهَّلة، ويَطلُبَ الدَّليلَ دائِمًا، ويُخضِعَ هَواهُ لِهُدى اللهِ لا العَكس — هذه هي الحِمايةُ والحِكمةُ التي يُعطيها فَهمُ مَصادِرِ التَّشريعِ الإسلاميِّ لِكُلِّ مُؤمِن.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the first and greatest source of Islamic legislation?", ar: "ما المَصدَرُ الأوَّلُ الأعظَمُ لِلتَّشريعِ الإسلاميّ؟" },
      options: [
        { en: "The Noble Qur'an", ar: "القُرآنُ الكَريم" },
        { en: "Custom", ar: "العُرف" },
        { en: "Personal opinion", ar: "الرَّأيُ الشَّخصيّ" },
        { en: "Analogy", ar: "القِياس" },
      ],
      correctIndex: 0,
      explanation: { en: "Every ruling must agree with the Qur'an, the speech of Allah.", ar: "كُلُّ حُكمٍ لا بُدَّ أن يُوافِقَ القُرآنَ كَلامَ الله." },
    },
    {
      prompt: { en: "What is the second source, and what is its relation to the Qur'an?", ar: "ما المَصدَرُ الثّاني وما عَلاقَتُهُ بِالقُرآن؟" },
      options: [
        { en: "The Sunnah — it explains and details the Qur'an", ar: "السُّنّة — تُبَيِّنُ القُرآنَ وتُفَصِّلُه" },
        { en: "Custom — it replaces the Qur'an", ar: "العُرف — يَحُلُّ مَحَلَّ القُرآن" },
        { en: "Opinion — it overrules the Qur'an", ar: "الرَّأي — يَنسَخُ القُرآن" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "The Sunnah shows how to pray, give zakat, and perform Hajj.", ar: "السُّنّةُ تُبَيِّنُ كَيفَ نُصَلّي ونُزَكّي ونَحُجّ." },
    },
    {
      prompt: { en: "What is ijma'?", ar: "ما الإجماع؟" },
      options: [
        { en: "The agreement of qualified scholars on a ruling", ar: "اتِّفاقُ العُلَماءِ المُؤَهَّلينَ على حُكم" },
        { en: "The opinion of one person", ar: "رَأيُ شَخصٍ واحِد" },
        { en: "A custom", ar: "عادة" },
        { en: "A feeling", ar: "شُعور" },
      ],
      correctIndex: 0,
      explanation: { en: "The Ummah does not unite upon error.", ar: "الأُمّةُ لا تَجتَمِعُ على ضَلالة." },
    },
    {
      prompt: { en: "What is qiyas?", ar: "ما القِياس؟" },
      options: [
        { en: "Extending a text's ruling to a new case with the same cause", ar: "إلحاقُ حُكمِ النَّصِّ بِمَسألةٍ جَديدةٍ بِالعِلّةِ نَفسِها" },
        { en: "Ignoring the texts", ar: "تَركُ النُّصوص" },
        { en: "Following desire", ar: "اتِّباعُ الهَوى" },
        { en: "Inventing new religion", ar: "ابتِداعُ دينٍ جَديد" },
      ],
      correctIndex: 0,
      explanation: { en: "E.g. forbidding all intoxicants by analogy to wine.", ar: "كَتَحريمِ كُلِّ مُسكِرٍ قِياسًا على الخَمر." },
    },
    {
      prompt: { en: "Why does understanding the sources protect a young Muslim?", ar: "لِمَ يَحمي فَهمُ المَصادِرِ الشّابَّ المُسلِم؟" },
      options: [
        { en: "It teaches taking religion from qualified scholars and evidence, not desire", ar: "يُعَلِّمُ أخذَ الدّينِ مِنَ العُلَماءِ والدَّليلِ لا الهَوى" },
        { en: "It lets anyone issue fatwas", ar: "يُتيحُ لِأيِّ أحَدٍ الفَتوى" },
        { en: "It makes religion follow feelings", ar: "يَجعَلُ الدّينَ يَتبَعُ المَشاعِر" },
        { en: "It removes the need for scholars", ar: "يُلغي الحاجةَ إلى العُلَماء" },
      ],
      correctIndex: 0,
      explanation: { en: "Ask: what is the evidence and who is the qualified scholar?", ar: "اسأل: ما الدَّليلُ ومَنِ العالِمُ المُؤَهَّل؟" },
    },
    {
      prompt: { en: "True or False: A Muslim may take rulings from anyone online without checking qualification or evidence.", ar: "صَوابٌ أم خَطأ: لِلمُسلِمِ أن يَأخُذَ الأحكامَ مِن أيِّ أحَدٍ على الشَّبَكةِ دونَ تَثَبُّتٍ مِنَ التَّأهيلِ أوِ الدَّليل." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Fatwa is the task of qualified scholars grounded in the sources.", ar: "الفَتوى مِن مَهَمّةِ العُلَماءِ المُؤَهَّلينَ المُؤَسَّسينَ على المَصادِر." },
    },
  ],
};
