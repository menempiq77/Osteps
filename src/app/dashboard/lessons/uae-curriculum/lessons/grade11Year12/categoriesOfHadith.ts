import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const categoriesOfHadith: CourseLesson = {
  slug: "g11y12-categories-of-hadith",
  name: { en: "Categories of Hadith", ar: "أقسامُ الحَديثِ الشَّريف" },
  shortIntro: {
    en: "The hadith of the Prophet ﷺ is the second source of Islam, and the scholars developed a precise science to preserve it and grade its authenticity. This lesson studies the parts of a hadith (sanad and matn), the main categories of hadith by authenticity (sahih, hasan, da'if, mawdu'), the meaning of each, and why this science protects the religion from error and forgery.",
    ar: "حَديثُ النَّبِيِّ ﷺ هو المَصدَرُ الثّاني لِلإسلام، وقَد وَضَعَ العُلَماءُ عِلمًا دَقيقًا لِحِفظِهِ وتَمييزِ صِحَّتِه. يَدرُسُ هذا الدَّرسُ أجزاءَ الحَديثِ (السَّنَدَ والمَتن)، وأقسامَ الحَديثِ الرَّئيسةَ بِحَسَبِ الصِّحّة (الصَّحيحَ والحَسَنَ والضَّعيفَ والمَوضوع)، ومَعنى كُلٍّ مِنها، ولِمَ يَحمي هذا العِلمُ الدّينَ مِنَ الخَطأِ والوَضع.",
  },
  quranSurahs: ["Al-Hujurat 6", "An-Najm 3-4"],
  sections: [
    {
      title: { en: "The hadith and its parts", ar: "الحَديثُ وأجزاؤُه" },
      learningObjectives: [
        { en: "Explain the importance of the hadith and the need to verify it.", ar: "أشرَحُ أهَمّيّةَ الحَديثِ والحاجةَ إلى التَّثَبُّت." },
        { en: "Identify the sanad and matn of a hadith.", ar: "أُحَدِّدُ السَّنَدَ والمَتنَ في الحَديث." },
      ],
      successCriteria: [
        { en: "I can explain Al-Hujurat 6.", ar: "أشرَحُ الحُجُرات ٦." },
        { en: "I can define sanad and matn.", ar: "أُعَرِّفُ السَّنَدَ والمَتن." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "The great collections of hadith.", ar: "دَواوينُ الحَديثِ الكُبرى." },
        caption: { en: "The scholars preserved the Sunnah with a precise science.", ar: "حَفِظَ العُلَماءُ السُّنّةَ بِعِلمٍ دَقيق." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How do we know which sayings really come from the Prophet ﷺ?", ar: "كَيفَ نَعرِفُ أيَّ الأقوالِ هي حَقًّا مِنَ النَّبِيِّ ﷺ؟" },
        body: {
          en: "The Sunnah of the Prophet ﷺ is the second source of Islam, explaining the Qur'an and guiding the believer's life. But across the centuries, countless sayings have been attributed to the Prophet ﷺ — some authentic, some weak, and some entirely fabricated by liars. How, then, can a Muslim know which of the thousands of reported sayings truly come from the Prophet ﷺ and which do not? Allah commands us to verify news before accepting it. Reflect: how did the scholars of Islam protect the Sunnah from forgery and error, why is it dangerous to attribute false sayings to the Prophet ﷺ, and why should every Muslim today care whether a 'hadith' they share is authentic?",
          ar: "سُنّةُ النَّبِيِّ ﷺ هي المَصدَرُ الثّاني لِلإسلام، تُبَيِّنُ القُرآنَ وتَهدي حَياةَ المُؤمِن. لكِن عَبرَ القُرونِ نُسِبَت إلى النَّبِيِّ ﷺ أقوالٌ لا تُحصى — بَعضُها صَحيح، وبَعضُها ضَعيف، وبَعضُها مَوضوعٌ بِالكامِلِ افتَراهُ الكاذِبون. فَكَيفَ يَعرِفُ المُسلِمُ أيَّ هذه الأقوالِ مِنَ النَّبِيِّ ﷺ حَقًّا وأيَّها لَيسَ مِنه؟ يَأمُرُنا اللهُ بِالتَّثَبُّتِ مِنَ الخَبَرِ قَبلَ قَبولِه. تَأمَّل: كَيفَ حَمى عُلَماءُ الإسلامِ السُّنّةَ مِنَ الوَضعِ والخَطأ، ولِمَ يَخطُرُ نِسبةُ الكَذِبِ إلى النَّبِيِّ ﷺ، ولِمَ يَنبَغي لِكُلِّ مُسلِمٍ اليَومَ أن يُبالِيَ أصَحيحٌ «الحَديثُ» الذي يَنشُرُهُ أم لا؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Sanad (السَّنَد): the chain of narrators. Matn (المَتن): the text/content of the hadith.", ar: "السَّنَد: سِلسِلةُ الرُّواة. المَتن: نَصُّ الحَديثِ ومَضمونُه." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Hadith: 'Whoever lies about me deliberately, let him take his seat in the Fire.'", ar: "الحَديث: «مَن كَذَبَ علَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار»." },
          ],
        },
      ],
      body: {
        en: "The Sunnah of the Prophet ﷺ — his authentic sayings, actions, and approvals — is the second source of Islamic legislation after the Qur'an, and is itself a form of revelation in meaning, for Allah says of the Prophet ﷺ: 'Nor does he speak from his own desire. It is but a revelation revealed' (An-Najm 3-4). The hadith explains and details the Qur'an and establishes rulings, manners, and beliefs. Because the Sunnah is so central to the religion, it was vital that it be preserved with the greatest care and protected from corruption, error, and especially deliberate forgery. From very early in Islamic history, some people — out of misguided zeal, sectarian motives, political interests, or outright wickedness — began to invent sayings and attribute them falsely to the Prophet ﷺ, despite his stern warning: 'Whoever lies about me deliberately, let him take his seat in the Fire.' To lie about the Prophet ﷺ is among the gravest of sins, for it is to put words into the mouth of the Messenger of Allah and corrupt the religion itself.\n\nIn response, the scholars of Islam developed one of the most remarkable and rigorous sciences in human history: the science of hadith ('ulum al-hadith), dedicated to preserving the Prophet's words and distinguishing the authentic from the weak and the forged. This science is rooted in the Qur'anic principle of verification: 'O you who have believed, if there comes to you a disobedient one (fasiq) with information, investigate (fa-tabayyanu), lest you harm a people out of ignorance and become, over what you have done, regretful' (Al-Hujurat 6). From this principle of verifying the source of news, the scholars built an entire methodology for examining who reports a hadith and whether it can be trusted.\n\nThe foundation of this science is the recognition that every hadith has two essential parts. The first is the sanad (or isnad) — the chain of narrators: the list of people who transmitted the hadith, one from another, going back to the Prophet ﷺ, in the form 'so-and-so reported from so-and-so, from so-and-so, from the Prophet ﷺ.' The second is the matn — the actual text or content of the hadith, the words of the Prophet ﷺ being reported. The scholars realised that to know whether a hadith is authentic, one must examine both: the matn must not contradict the Qur'an, established Sunnah, or sound reason, and above all the sanad must be examined link by link — for a saying is only as reliable as the chain of people who reported it. This led the scholars to create the immense science of 'ilm al-rijal (the study of the narrators), in which they investigated the life, character, memory, truthfulness, and reliability of every single narrator, recording who was trustworthy and who was weak or a liar, and whether each narrator could actually have met the one they claimed to report from. By examining the chain in this way, the scholars could grade each hadith according to its authenticity — and it is to these categories that we turn in the next section.",
        ar: "سُنّةُ النَّبِيِّ ﷺ — أقوالُهُ وأفعالُهُ وتَقريراتُهُ الصَّحيحة — هي المَصدَرُ الثّاني لِلتَّشريعِ الإسلاميِّ بَعدَ القُرآن، وهي وَحيٌ في المَعنى، فَقَد قالَ اللهُ في النَّبِيِّ ﷺ: ﴿وما يَنطِقُ عنِ الهَوى إن هو إلّا وَحيٌ يوحى﴾ (النَّجم ٣-٤). والحَديثُ يُبَيِّنُ القُرآنَ ويُفَصِّلُهُ ويُثبِتُ أحكامًا وآدابًا وعَقائِد. ولِأنَّ السُّنّةَ بِهذه المَركَزيّةِ في الدّين، كانَ لا بُدَّ مِن حِفظِها بِأعظَمِ العِنايةِ وصَونِها مِنَ التَّحريفِ والخَطأ، وبِخاصّةٍ مِنَ الوَضعِ المُتَعَمَّد. فَمُنذُ وَقتٍ مُبَكِّرٍ في التّاريخِ الإسلاميِّ بَدَأَ بَعضُ النّاسِ — بِحَماسةٍ مُضَلَّلة، أو دَوافِعَ مَذهَبيّة، أو مَصالِحَ سياسيّة، أو شَرٍّ مَحض — يَختَرِعونَ أقوالًا ويَنسُبونَها زورًا إلى النَّبِيِّ ﷺ، رَغمَ تَحذيرِهِ الشَّديد: «مَن كَذَبَ علَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار». فَالكَذِبُ على النَّبِيِّ ﷺ مِن أعظَمِ الكَبائِر، فَهو وَضعُ كَلامٍ في فَمِ رَسولِ اللهِ وإفسادٌ لِلدّينِ نَفسِه.\n\nوفي مُقابِلِ ذلك وَضَعَ عُلَماءُ الإسلامِ واحِدًا مِن أبدَعِ العُلومِ وأدَقِّها في تاريخِ البَشَريّة: عِلمَ الحَديث (عُلومَ الحَديث)، المُكَرَّسَ لِحِفظِ كَلامِ النَّبِيِّ وتَمييزِ الصَّحيحِ مِنَ الضَّعيفِ والمَوضوع. وهذا العِلمُ مُؤَسَّسٌ على مَبدَأِ القُرآنِ في التَّثَبُّت: ﴿يا أيُّها الذينَ آمَنوا إن جاءَكُم فاسِقٌ بِنَبَإٍ فَتَبَيَّنوا أن تُصيبوا قَومًا بِجَهالةٍ فَتُصبِحوا على ما فَعَلتُم نادِمين﴾ (الحُجُرات ٦). فَمِن هذا المَبدَأِ في التَّثَبُّتِ مِن مَصدَرِ الخَبَرِ بَنى العُلَماءُ مَنهَجًا كامِلًا لِفَحصِ مَن يَروي الحَديثَ وهَل يُوثَقُ بِه.\n\nوأساسُ هذا العِلمِ إدراكُ أنَّ لِكُلِّ حَديثٍ جُزأَينِ أساسيَّين. الأوَّلُ السَّنَد (أوِ الإسناد) — سِلسِلةُ الرُّواة: قائِمةُ مَنِ نَقَلوا الحَديثَ واحِدًا عن واحِدٍ حتّى النَّبِيِّ ﷺ، على صورةِ «حَدَّثَني فُلانٌ عن فُلانٍ عن فُلانٍ عنِ النَّبِيِّ ﷺ». والثّاني المَتن — نَصُّ الحَديثِ أو مَضمونُه، كَلامُ النَّبِيِّ ﷺ المَرويّ. وأدرَكَ العُلَماءُ أنَّ مَعرِفةَ صِحّةِ الحَديثِ تَستَلزِمُ فَحصَ الأمرَين: فَالمَتنُ يَجِبُ ألّا يُخالِفَ القُرآنَ أوِ السُّنّةَ الثّابِتةَ أوِ العَقلَ السَّليم، وقَبلَ كُلِّ شَيءٍ يَجِبُ فَحصُ السَّنَدِ حَلقةً حَلقة — فَالقَولُ لا يَصِحُّ إلّا بِقَدرِ صِحّةِ سِلسِلةِ مَن نَقَلوه. وهذا قادَ العُلَماءَ إلى وَضعِ عِلمِ الرِّجالِ الضَّخم، حَيثُ بَحَثوا في حَياةِ كُلِّ راوٍ وخُلُقِهِ وحِفظِهِ وصِدقِهِ وضَبطِه، وسَجَّلوا مَن كانَ ثِقةً ومَن كانَ ضَعيفًا أو كاذِبًا، وهَل أمكَنَ كُلَّ راوٍ أن يَلقى مَن زَعَمَ الرِّوايةَ عَنه. وبِفَحصِ السَّنَدِ هكَذا أمكَنَ العُلَماءَ أن يُرَتِّبوا كُلَّ حَديثٍ بِحَسَبِ صِحَّتِه — وإلى هذه الأقسامِ نَنتَقِلُ في القِسمِ التّالي.",
      },
    },
    {
      title: { en: "The categories by authenticity", ar: "الأقسامُ بِحَسَبِ الصِّحّة" },
      learningObjectives: [
        { en: "Identify the main categories of hadith by authenticity.", ar: "أُحَدِّدُ أقسامَ الحَديثِ بِحَسَبِ الصِّحّة." },
        { en: "Explain why this science protects the religion.", ar: "أشرَحُ كَيفَ يَحمي هذا العِلمُ الدّين." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Learning the authentic Sunnah.", ar: "تَعَلُّمُ السُّنّةِ الصَّحيحة." },
        caption: { en: "'Investigate' before accepting news (Al-Hujurat 6).", ar: "﴿فَتَبَيَّنوا﴾ قَبلَ قَبولِ الخَبَر (الحُجُرات ٦)." },
      },
      groupTasks: {
        title: { en: "Grading the hadith", ar: "تَصنيفُ الحَديث" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "categories-of-authenticity",
            name: { en: "Team A — The categories of authenticity", ar: "الفَريقُ أ — أقسامُ الصِّحّة" },
            learningObjective: { en: "Present the main categories of hadith.", ar: "نَعرِضُ أقسامَ الحَديثِ الرَّئيسة." },
            task: { en: "Present the main categories of hadith by authenticity with simple definitions: sahih (authentic — an unbroken chain of fully reliable, precise narrators, free of defects and oddity); hasan (good — like sahih but with slightly less perfect precision in some narrators, still accepted); da'if (weak — failing one of the conditions, e.g. a broken chain or an unreliable narrator; not used to establish rulings); and mawdu' (fabricated — falsely invented and attributed to the Prophet ﷺ; not a hadith at all and forbidden to spread as such). Mention briefly mutawatir (reported by so many that error is impossible) versus ahad. Present a 'grades of hadith' display.", ar: "اعرِضوا أقسامَ الحَديثِ بِحَسَبِ الصِّحّةِ بِتَعريفاتٍ بَسيطة: الصَّحيحَ (سَنَدٌ مُتَّصِلٌ بِنَقلِ العَدلِ الضّابِطِ تامًّا، سالِمٌ مِنَ العِلّةِ والشُّذوذ)؛ والحَسَنَ (كَالصَّحيحِ لكِن بِضَبطٍ أخَفَّ في بَعضِ الرُّواة، ويُقبَل)؛ والضَّعيفَ (فَقَدَ شَرطًا، كَانقِطاعِ السَّنَدِ أو ضَعفِ راوٍ؛ لا تُبنى علَيهِ الأحكام)؛ والمَوضوعَ (المُختَلَقَ المَنسوبَ كَذِبًا إلى النَّبِيِّ ﷺ؛ لَيسَ حَديثًا أصلًا ويَحرُمُ نَشرُهُ كَذلك). أشيروا بِإيجازٍ إلى المُتَواتِرِ (الذي رَواهُ جَمعٌ يَستَحيلُ تَواطُؤُهُم على الكَذِب) مُقابِلَ الآحاد. اعرِضوا لَوحةَ «دَرَجاتِ الحَديث»." },
            evidence: [
              { en: "Sahih and hasan are accepted; da'if is weak; mawdu' is rejected.", ar: "الصَّحيحُ والحَسَنُ مَقبولان؛ والضَّعيفُ ضَعيف؛ والمَوضوعُ مَردود." },
            ],
            sourceNotes: [
              { en: "Authenticity depends on the chain and the text.", ar: "الصِّحّةُ بِحَسَبِ السَّنَدِ والمَتن." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'grades of hadith' display.", ar: "لَوحةُ «دَرَجاتِ الحَديث»." },
          },
          {
            slug: "protecting-the-sunnah",
            name: { en: "Team B — Protecting the Sunnah today", ar: "الفَريقُ ب — حِفظُ السُّنّةِ اليَوم" },
            learningObjective: { en: "Present why this science matters for Muslims today.", ar: "نَعرِضُ لِمَ يُهِمُّ هذا العِلمُ المُسلِمينَ اليَوم." },
            task: { en: "Present why the science of hadith matters for Muslims today, especially online: the danger of spreading fabricated or weak 'hadiths' on social media (lying about the Prophet ﷺ is a grave sin); the duty to verify before sharing — checking that a saying is authentic and from a reliable source/scholar; respecting the great collections (Sahih al-Bukhari, Sahih Muslim, and the other trusted books) and the scholars who graded hadith; and gratitude for the scholars who, by this rigorous science, preserved the Sunnah so that we can still know what the Prophet ﷺ truly said. Present a 'verify before you share' guide.", ar: "اعرِضوا لِمَ يُهِمُّ عِلمُ الحَديثِ المُسلِمينَ اليَوم، خاصّةً على الشَّبَكة: خَطَرَ نَشرِ «الأحاديثِ» المَوضوعةِ أوِ الضَّعيفةِ على وَسائِلِ التَّواصُل (والكَذِبُ على النَّبِيِّ ﷺ كَبيرة)؛ وواجِبَ التَّثَبُّتِ قَبلَ النَّشر — التَّأَكُّدِ أنَّ القَولَ صَحيحٌ مِن مَصدَرٍ أو عالِمٍ مَوثوق؛ واحتِرامَ الدَّواوينِ الكُبرى (صَحيحِ البُخاريِّ ومُسلِمٍ وسائِرِ الكُتُبِ المُعتَمَدة) والعُلَماءِ الذينَ صَنَّفوا الحَديث؛ وشُكرَ العُلَماءِ الذينَ حَفِظوا بِهذا العِلمِ الدَّقيقِ السُّنّةَ حتّى نَعرِفَ ما قالَهُ النَّبِيُّ ﷺ حَقًّا. اعرِضوا دَليلَ «تَثَبَّت قَبلَ النَّشر»." },
            evidence: [
              { en: "'If there comes to you a fasiq with news, investigate' (Al-Hujurat 6).", ar: "﴿إن جاءَكُم فاسِقٌ بِنَبَإٍ فَتَبَيَّنوا﴾ (الحُجُرات ٦)." },
            ],
            sourceNotes: [
              { en: "Verify a hadith before sharing it.", ar: "تَثَبَّت مِنَ الحَديثِ قَبلَ نَشرِه." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'verify before you share' guide.", ar: "دَليلُ «تَثَبَّت قَبلَ النَّشر»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Verifying what I share", ar: "التَّثَبُّتُ فيما أنشُر" },
        prompt: { en: "The scholars built a precise science to grade hadith — sahih, hasan, da'if, and mawdu' — examining the chain (sanad) and text (matn), because lying about the Prophet ﷺ is a grave sin and the Qur'an commands us to verify news before accepting it. Reflect on how careful you are with religious content you read and share, especially on social media. Have you ever shared a 'hadith' or religious quote without checking whether it is authentic? Write about why it matters to verify that a saying truly comes from the Prophet ﷺ, and describe two practical habits you will adopt to make sure you only share authentic, verified hadith and reliable religious knowledge.", ar: "بَنى العُلَماءُ عِلمًا دَقيقًا لِتَصنيفِ الحَديث — صَحيحٍ وحَسَنٍ وضَعيفٍ ومَوضوع — بِفَحصِ السَّنَدِ والمَتن، لِأنَّ الكَذِبَ على النَّبِيِّ ﷺ كَبيرة، ولِأنَّ القُرآنَ يَأمُرُنا بِالتَّثَبُّتِ مِنَ الخَبَرِ قَبلَ قَبولِه. تَأمَّل كَم أنتَ حَذِرٌ معَ المُحتَوى الدّينيِّ الذي تَقرَؤُهُ وتَنشُرُه، خاصّةً على وَسائِلِ التَّواصُل. هَل سَبَقَ أن نَشَرتَ «حَديثًا» أو نَصًّا دينيًّا دونَ التَّأَكُّدِ مِن صِحَّتِه؟ اكتُب لِمَ يُهِمُّ التَّثَبُّتُ أنَّ القَولَ مِنَ النَّبِيِّ ﷺ حَقًّا، وصِف عادَتَينِ عَمَليَّتَينِ سَتَتبَنّاهُما لِتَضمَنَ أنَّكَ لا تَنشُرُ إلّا حَديثًا صَحيحًا مُوَثَّقًا وعِلمًا دينيًّا مَوثوقًا." },
        placeholder: { en: "Before sharing a hadith I will... To verify authenticity I will...", ar: "قَبلَ نَشرِ حَديثٍ سَأ... ولِلتَّأَكُّدِ مِنَ الصِّحّةِ سَأ..." },
      },
      body: {
        en: "Having examined the chain of narrators (sanad) and the text (matn), the scholars of hadith graded every reported saying into categories according to its degree of authenticity. The highest category is the sahih (authentic) hadith. A hadith is graded sahih when it meets strict conditions: its chain of narration is unbroken (each narrator actually received it from the one before), every narrator in the chain is of upright character ('adl) and possesses precise, reliable memory (dabt), and the hadith is free of any hidden defect ('illah) and of oddity or contradiction (shudhudh) with more reliable reports. A sahih hadith is fully accepted as proof in the religion. The next category is the hasan (good) hadith, which meets all the same conditions except that the precision of one or more of its narrators is slightly less than the highest level; it is still accepted and acted upon, and is close to the sahih in authority. Sometimes a hasan hadith is strengthened by other chains to the level of sahih (sahih li-ghayrihi).\n\nBelow these is the da'if (weak) hadith, which fails to meet one or more of the conditions of authenticity — for example, its chain is broken (a narrator is missing), or one of its narrators is known for weak memory, or for some defect in character. A weak hadith is not established as the speech of the Prophet ﷺ with confidence, and the scholars agree that it cannot be used to establish rulings of halal and haram or matters of belief. Finally, and most seriously, there is the mawdu' (fabricated) hadith: a saying that was simply invented by someone and falsely attributed to the Prophet ﷺ. A fabricated 'hadith' is not a hadith at all; it is a lie against the Messenger of Allah, and it is forbidden to narrate or spread it as the Prophet's words except to warn that it is a forgery. The scholars also classified hadith in other ways — for example, by the number of narrators: a mutawatir hadith is one reported by so many narrators at every stage that it is impossible they could all have agreed upon a lie, giving certainty; while an ahad hadith is reported by fewer chains and gives strong probability. All of these careful distinctions exist to preserve the religion in its purity.\n\nThis magnificent science is not merely of historical interest; it has direct importance for every Muslim, and never more so than today. In the age of social media, fabricated and weak 'hadiths' spread with astonishing speed — quotes that sound pious or pleasing but were never said by the Prophet ﷺ — and many sincere Muslims share them without ever checking, unknowingly spreading lies about the Messenger of Allah and contributing to a serious sin. The science of hadith teaches the believer a vital habit: to verify before sharing, to check that a saying attributed to the Prophet ﷺ is actually authentic and comes from a reliable source or trusted scholar, and never to spread religious claims carelessly. It teaches respect for the great trusted collections — above all Sahih al-Bukhari and Sahih Muslim, which the Ummah received as the most authentic books after the Qur'an, along with the other recognised books of Sunnah — and for the scholars who graded the hadith. Above all, it should fill the believer with gratitude to Allah and to the scholars of this Ummah, who, through a precision and devotion unmatched in the history of any nation, examined the lives of tens of thousands of narrators and sifted the authentic Sunnah from the weak and the forged, so that fourteen centuries later we can still open a book and know, with confidence, what the Prophet Muhammad ﷺ truly said. To honour this science by learning the authentic Sunnah, verifying what we share, and refusing to spread what is weak or fabricated is both a protection of the religion and a duty of love and respect toward the Messenger of Allah ﷺ.",
        ar: "بَعدَ فَحصِ السَّنَدِ والمَتن، صَنَّفَ عُلَماءُ الحَديثِ كُلَّ قَولٍ مَرويٍّ في أقسامٍ بِحَسَبِ دَرَجةِ صِحَّتِه. وأعلى الأقسامِ الحَديثُ الصَّحيح. ويُحكَمُ بِصِحّةِ الحَديثِ إذا استَوفى شُروطًا دَقيقة: اتِّصالَ سَنَدِه (تَلَقّى كُلُّ راوٍ عَمَّن قَبلَهُ حَقًّا)، وأن يَكونَ كُلُّ راوٍ عَدلًا في خُلُقِهِ ضابِطًا في حِفظِه، وأن يَسلَمَ مِن عِلّةٍ خَفيّةٍ ومِن شُذوذٍ أو مُخالَفةٍ لِما هو أوثَق. والحَديثُ الصَّحيحُ مَقبولٌ تامًّا حُجّةً في الدّين. ويَليهِ الحَديثُ الحَسَن، الذي يَستَوفي الشُّروطَ نَفسَها إلّا أنَّ ضَبطَ راوٍ أو أكثَرَ أخَفُّ قَليلًا مِنَ الدَّرَجةِ العُليا؛ وهو مَقبولٌ مَعمولٌ بِه، قَريبٌ مِنَ الصَّحيحِ في الحُجّيّة. وقَد يَتَقَوّى الحَسَنُ بِطُرُقٍ أُخرى إلى دَرَجةِ الصَّحيحِ لِغَيرِه.\n\nودونَ هذَينِ الحَديثُ الضَّعيف، الذي يَفقِدُ شَرطًا أو أكثَرَ مِن شُروطِ الصِّحّة — كَانقِطاعِ سَنَدِهِ (سُقوطِ راوٍ)، أو كَونِ راوٍ مَعروفًا بِضَعفِ الحِفظِ أو بِعِلّةٍ في خُلُقِه. والضَّعيفُ لا يَثبُتُ كَلامًا لِلنَّبِيِّ ﷺ بِيَقين، واتَّفَقَ العُلَماءُ أنَّهُ لا تُبنى علَيهِ أحكامُ الحَلالِ والحَرامِ ولا مَسائِلُ العَقيدة. وأخيرًا، وأخطَرُها، الحَديثُ المَوضوع: قَولٌ اختَلَقَهُ أحَدُهُم ونَسَبَهُ كَذِبًا إلى النَّبِيِّ ﷺ. والحَديثُ المَوضوعُ لَيسَ حَديثًا أصلًا؛ بل كَذِبٌ على رَسولِ الله، ويَحرُمُ روايَتُهُ أو نَشرُهُ على أنَّهُ مِن كَلامِ النَّبِيِّ إلّا لِلتَّحذيرِ مِن أنَّهُ مَوضوع. وصَنَّفَ العُلَماءُ الحَديثَ بِوُجوهٍ أُخرى أيضًا — كَعَدَدِ الرُّواة: فَالمُتَواتِرُ ما رَواهُ في كُلِّ طَبَقةٍ جَمعٌ يَستَحيلُ تَواطُؤُهُم على الكَذِبِ فَيُفيدُ اليَقين؛ والآحادُ ما رَواهُ طُرُقٌ أقَلُّ فَيُفيدُ غَلَبةَ الظَّنّ. وكُلُّ هذه الفُروقِ الدَّقيقةِ لِحِفظِ الدّينِ نَقيًّا.\n\nوهذا العِلمُ العَظيمُ لَيسَ مُجَرَّدَ اهتِمامٍ تاريخيّ؛ بل لَهُ أهَمّيّةٌ مُباشَرةٌ لِكُلِّ مُسلِم، ولا سيَّما اليَوم. ففي عَصرِ وَسائِلِ التَّواصُلِ تَنتَشِرُ «الأحاديثُ» المَوضوعةُ والضَّعيفةُ بِسُرعةٍ مُذهِلة — نُصوصٌ تَبدو وَرِعةً أو مُحَبَّبةً لكِنَّ النَّبِيَّ ﷺ لَم يَقُلها قَطّ — ويَنشُرُها كَثيرٌ مِنَ المُسلِمينَ المُخلِصينَ دونَ تَثَبُّت، فَيَنشُرونَ مِن حَيثُ لا يَدرونَ كَذِبًا على رَسولِ اللهِ ويُشارِكونَ في إثمٍ عَظيم. ويُعَلِّمُ عِلمُ الحَديثِ المُؤمِنَ عادةً حَيَويّة: التَّثَبُّتَ قَبلَ النَّشر، والتَّأَكُّدَ أنَّ القَولَ المَنسوبَ إلى النَّبِيِّ ﷺ صَحيحٌ مِن مَصدَرٍ أو عالِمٍ مَوثوق، وألّا يَنشُرَ الدَّعاوى الدّينيّةَ بِلا مُبالاة. ويُعَلِّمُ احتِرامَ الدَّواوينِ الكُبرى المَوثوقة — وعلى رَأسِها صَحيحُ البُخاريِّ وصَحيحُ مُسلِمٍ اللَّذانِ تَلَقَّتهُما الأُمّةُ أصَحَّ الكُتُبِ بَعدَ القُرآن، معَ سائِرِ كُتُبِ السُّنّةِ المُعتَبَرة — واحتِرامَ العُلَماءِ الذينَ صَنَّفوا الحَديث. وقَبلَ كُلِّ شَيءٍ يَنبَغي أن يَملَأَ المُؤمِنَ الشُّكرُ لِلهِ ولِعُلَماءِ هذه الأُمّة، الذينَ بِدِقّةٍ وتَفانٍ لا نَظيرَ لَهُما في تاريخِ أُمّة، فَحَصوا حَياةَ عَشَراتِ الأُلوفِ مِنَ الرُّواةِ ومَيَّزوا السُّنّةَ الصَّحيحةَ مِنَ الضَّعيفِ والمَوضوع، حتّى بَعدَ أربَعةَ عَشَرَ قَرنًا ما زِلنا نَفتَحُ كِتابًا فَنَعرِفُ بِثِقةٍ ما قالَهُ النَّبِيُّ مُحَمَّدٌ ﷺ حَقًّا. وأن نُكرِمَ هذا العِلمَ بِتَعَلُّمِ السُّنّةِ الصَّحيحة، والتَّثَبُّتِ فيما نَنشُر، ورَفضِ نَشرِ الضَّعيفِ والمَوضوع، حِمايةٌ لِلدّينِ وواجِبُ حُبٍّ واحتِرامٍ لِرَسولِ اللهِ ﷺ مَعًا.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What are the two essential parts of a hadith?", ar: "ما الجُزآنِ الأساسيّانِ لِلحَديث؟" },
      options: [
        { en: "The sanad (chain) and the matn (text)", ar: "السَّنَد (السِّلسِلة) والمَتن (النَّصّ)" },
        { en: "The title and the date", ar: "العُنوانُ والتّاريخ" },
        { en: "The author and the price", ar: "المُؤَلِّفُ والثَّمَن" },
        { en: "The page and the chapter", ar: "الصَّفحةُ والباب" },
      ],
      correctIndex: 0,
      explanation: { en: "Sanad is the chain of narrators; matn is the content.", ar: "السَّنَدُ سِلسِلةُ الرُّواة؛ والمَتنُ المَضمون." },
    },
    {
      prompt: { en: "What is a sahih hadith?", ar: "ما الحَديثُ الصَّحيح؟" },
      options: [
        { en: "Authentic — unbroken chain of reliable, precise narrators, no defect", ar: "الصَّحيح — سَنَدٌ مُتَّصِلٌ بِعَدلٍ ضابِطٍ بِلا عِلّة" },
        { en: "A fabricated saying", ar: "قَولٌ مَوضوع" },
        { en: "A weak report", ar: "روايةٌ ضَعيفة" },
        { en: "Any quote online", ar: "أيُّ نَصٍّ على الشَّبَكة" },
      ],
      correctIndex: 0,
      explanation: { en: "It meets all conditions of authenticity and is accepted as proof.", ar: "يَستَوفي شُروطَ الصِّحّةِ ويُقبَلُ حُجّة." },
    },
    {
      prompt: { en: "What is a mawdu' hadith?", ar: "ما الحَديثُ المَوضوع؟" },
      options: [
        { en: "Fabricated — falsely invented and attributed to the Prophet ﷺ", ar: "المُختَلَقُ المَنسوبُ كَذِبًا إلى النَّبِيِّ ﷺ" },
        { en: "The most authentic kind", ar: "أصَحُّ الأنواع" },
        { en: "A verse of the Qur'an", ar: "آيةٌ مِنَ القُرآن" },
        { en: "A good hadith", ar: "حَديثٌ حَسَن" },
      ],
      correctIndex: 0,
      explanation: { en: "It is a lie against the Prophet ﷺ — not a hadith at all.", ar: "كَذِبٌ على النَّبِيِّ ﷺ — لَيسَ حَديثًا أصلًا." },
    },
    {
      prompt: { en: "Can a weak (da'if) hadith establish rulings of halal and haram?", ar: "هَل يُثبِتُ الحَديثُ الضَّعيفُ أحكامَ الحَلالِ والحَرام؟" },
      options: [
        { en: "No — it is not used to establish rulings", ar: "لا — لا تُبنى علَيهِ الأحكام" },
        { en: "Yes, always", ar: "نَعَم دائِمًا" },
        { en: "It is stronger than sahih", ar: "هو أقوى مِنَ الصَّحيح" },
        { en: "It replaces the Qur'an", ar: "يَحُلُّ مَحَلَّ القُرآن" },
      ],
      correctIndex: 0,
      explanation: { en: "A weak hadith fails a condition of authenticity.", ar: "الضَّعيفُ فَقَدَ شَرطًا مِن شُروطِ الصِّحّة." },
    },
    {
      prompt: { en: "What is the believer's duty before sharing a 'hadith' online?", ar: "ما واجِبُ المُؤمِنِ قَبلَ نَشرِ «حَديثٍ» على الشَّبَكة؟" },
      options: [
        { en: "Verify it is authentic from a reliable source", ar: "التَّثَبُّتُ مِن صِحَّتِهِ مِن مَصدَرٍ مَوثوق" },
        { en: "Share it immediately", ar: "نَشرُهُ فَورًا" },
        { en: "Ignore authenticity", ar: "إهمالُ الصِّحّة" },
        { en: "Change the words", ar: "تَغييرُ الكَلِمات" },
      ],
      correctIndex: 0,
      explanation: { en: "Spreading fabricated sayings is lying about the Prophet ﷺ.", ar: "نَشرُ المَوضوعِ كَذِبٌ على النَّبِيِّ ﷺ." },
    },
    {
      prompt: { en: "True or False: The science of hadith preserved the Sunnah by examining the narrators and chains.", ar: "صَوابٌ أم خَطأ: حَفِظَ عِلمُ الحَديثِ السُّنّةَ بِفَحصِ الرُّواةِ والأسانيد." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "The scholars studied tens of thousands of narrators to sift authentic from forged.", ar: "دَرَسَ العُلَماءُ عَشَراتِ الأُلوفِ مِنَ الرُّواةِ لِتَمييزِ الصَّحيحِ مِنَ المَوضوع." },
    },
  ],
};
