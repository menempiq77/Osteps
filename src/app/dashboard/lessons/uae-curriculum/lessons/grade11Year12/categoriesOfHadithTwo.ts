import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const categoriesOfHadithTwo: CourseLesson = {
  slug: "g11y12-categories-of-hadith-2",
  name: { en: "Categories of Hadith 2", ar: "أقسامُ الحَديثِ الشَّريف ٢" },
  shortIntro: {
    en: "Building on the first lesson, this lesson goes deeper into the science of hadith: the divisions of hadith by the number of narrators (mutawatir and ahad), the further categories of the accepted hadith (sahih li-dhatihi, sahih li-ghayrihi, hasan), the categories of the rejected (da'if and its causes, and the mawdu' or fabricated), and the immense effort of the scholars of hadith to protect the Sunnah of the Prophet ﷺ.",
    ar: "بِناءً على الدَّرسِ الأوَّل، يَتَعَمَّقُ هذا الدَّرسُ في عِلمِ الحَديث: تَقسيمِ الحَديثِ بِحَسَبِ عَدَدِ الرُّواةِ (المُتَواتِرِ والآحاد)، وأقسامِ المَقبولِ الأُخرى (الصَّحيحِ لِذاتِه، والصَّحيحِ لِغَيرِه، والحَسَن)، وأقسامِ المَردودِ (الضَّعيفِ وأسبابِه، والمَوضوعِ المَكذوب)، والجُهدِ العَظيمِ الذي بَذَلَهُ عُلَماءُ الحَديثِ لِحِفظِ سُنّةِ النَّبِيِّ ﷺ.",
  },
  quranSurahs: ["Al-Hijr 9", "Al-Hujurat 6"],
  sections: [
    {
      title: { en: "Hadith by number of narrators", ar: "الحَديثُ بِحَسَبِ عَدَدِ الرُّواة" },
      learningObjectives: [
        { en: "Distinguish mutawatir from ahad hadith.", ar: "أُمَيِّزُ المُتَواتِرَ مِنَ الآحاد." },
        { en: "Explain the categories of accepted hadith.", ar: "أشرَحُ أقسامَ الحَديثِ المَقبول." },
      ],
      successCriteria: [
        { en: "I can define mutawatir and ahad.", ar: "أُعَرِّفُ المُتَواتِرَ والآحاد." },
        { en: "I can explain sahih and hasan.", ar: "أشرَحُ الصَّحيحَ والحَسَن." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "The classification of hadith.", ar: "تَصنيفُ الحَديث." },
        caption: { en: "'Indeed, We sent down the Reminder and We will guard it' (Al-Hijr 9).", ar: "﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحِجر ٩)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How did Muslims build a science to grade every hadith?", ar: "كَيفَ بَنى المُسلِمونَ عِلمًا لِتَصنيفِ كُلِّ حَديث؟" },
        body: {
          en: "The Sunnah is the second source of Islam, but unlike the Qur'an — preserved word for word and mass-transmitted — hadith reached us through chains of narrators of varying reliability. To protect the Sunnah from error and forgery, the scholars built a rigorous science that grades every hadith by how many people transmitted it and how trustworthy they were. Reflect: how did the scholars classify hadith by the number of narrators (mutawatir and ahad) and by reliability (sahih, hasan, da'if); why was this enormous effort necessary; and how does it give us confidence in the authentic Sunnah while protecting us from fabrications?",
          ar: "السُّنّةُ المَصدَرُ الثّاني لِلإسلام، لكِنَّها — بِخِلافِ القُرآنِ المَحفوظِ حَرفًا حَرفًا والمَنقولِ تَواتُرًا — وَصَلَتنا عَبرَ سَلاسِلِ رُواةٍ مُتَفاوِتي الثِّقة. ولِحِفظِ السُّنّةِ مِنَ الخَطَإِ والوَضع، بَنى العُلَماءُ عِلمًا دَقيقًا يُصَنِّفُ كُلَّ حَديثٍ بِحَسَبِ عَدَدِ مَن نَقَلَهُ ومَدى ثِقَتِهِم. تَأمَّل: كَيفَ صَنَّفَ العُلَماءُ الحَديثَ بِحَسَبِ عَدَدِ الرُّواةِ (المُتَواتِرِ والآحاد) وبِحَسَبِ الثِّقةِ (الصَّحيحِ والحَسَنِ والضَّعيف)؛ ولِمَ كانَ هذا الجُهدُ العَظيمُ ضَروريًّا؛ وكَيفَ يُعطينا الثِّقةَ بِالسُّنّةِ الصَّحيحةِ ويَحمينا مِنَ المَوضوعات؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Mutawatir (المُتَواتِر): narrated by so many it cannot be a lie. Ahad (الآحاد): narrated by fewer.", ar: "المُتَواتِر: ما رَواهُ جَمعٌ يَستَحيلُ تَواطُؤُهُم على الكَذِب. الآحاد: ما رَواهُ عَدَدٌ أقَلّ." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Sahih li-dhatihi (صَحيحٌ لِذاتِه), sahih li-ghayrihi (صَحيحٌ لِغَيرِه), hasan (حَسَن).", ar: "صَحيحٌ لِذاتِه، صَحيحٌ لِغَيرِه، حَسَن." },
          ],
        },
      ],
      body: {
        en: "In the previous lesson on the categories of hadith, we studied the parts of a hadith (the sanad, or chain of narrators, and the matn, or text) and the broad division of hadith into the accepted (maqbul) and the rejected (mardud). In this lesson we go deeper into the science of hadith ('ilm mustalah al-hadith), one of the greatest intellectual achievements of the Muslim Ummah, by which the scholars classified every report attributed to the Prophet ﷺ with extraordinary precision in order to protect the Sunnah. The first way the scholars classified hadith is according to the number of narrators in each generation of the chain, dividing hadith into two great categories: the mutawatir and the ahad.\n\nThe mutawatir hadith is a report transmitted by such a large number of narrators in every generation — from the Companions down through the generations — that it is impossible for them all to have agreed upon a lie. The sheer number and independence of the narrators gives certainty (yaqin) that the Prophet ﷺ truly said or did what is reported. Examples include the mass-transmitted reports about the obligation of the five daily prayers, and the famous warning of the Prophet ﷺ: 'Whoever deliberately lies about me, let him take his seat in the Fire,' which was narrated by a great many Companions. The mutawatir is the highest level of certainty in hadith, second only to the Qur'an itself. The ahad hadith (or khabar al-wahid) is a report transmitted by fewer narrators than the mutawatir — it may be narrated by one, two, or several in a generation. The great majority of hadith are ahad. An ahad hadith does not give the same absolute certainty as the mutawatir, but if its chain and narrators meet the conditions of authenticity, it is accepted and acted upon, and it gives strong, well-founded knowledge sufficient as proof in the religion.\n\nThe second way the scholars classified hadith — and the most detailed — is according to the reliability and strength of the report, which determines whether it is accepted or rejected. Within the accepted (maqbul) hadith, the scholars distinguished several levels. The highest is the sahih li-dhatihi (authentic in itself): a hadith whose chain is continuous, every narrator being upright in character ('adl) and precise in memory (dabit), free of any hidden defect ('illah) or irregularity (shudhudh). Below it is the hasan li-dhatihi (good in itself), which meets all the same conditions except that one or more narrators are slightly less precise in memory, though still trustworthy. A hadith may also be raised in grade through supporting chains: a hasan hadith strengthened by another chain becomes sahih li-ghayrihi (authentic due to other evidence), and a weak hadith strengthened by several other weak chains may rise to hasan li-ghayrihi (good due to other evidence). These fine distinctions allowed the scholars to weigh the strength of every report with great care. In the next section, we will study the rejected hadith — the weak (da'if) and the fabricated (mawdu') — and the immense effort of the scholars to protect the Sunnah from error and forgery.",
        ar: "في الدَّرسِ السّابِقِ عن أقسامِ الحَديثِ دَرَسنا أجزاءَ الحَديثِ (السَّنَدَ، أيِ سِلسِلةَ الرُّواة، والمَتنَ، أيِ النَّصّ) والتَّقسيمَ العامَّ لِلحَديثِ إلى مَقبولٍ ومَردود. وفي هذا الدَّرسِ نَتَعَمَّقُ في عِلمِ مُصطَلَحِ الحَديث، أحَدِ أعظَمِ الإنجازاتِ العِلميّةِ لِلأُمّةِ الإسلاميّة، الذي صَنَّفَ بِهِ العُلَماءُ كُلَّ ما نُسِبَ إلى النَّبِيِّ ﷺ بِدِقّةٍ عَجيبةٍ لِحِفظِ السُّنّة. والطَّريقةُ الأولى التي صَنَّفَ بِها العُلَماءُ الحَديثَ بِحَسَبِ عَدَدِ الرُّواةِ في كُلِّ طَبَقةٍ مِنَ السَّنَد، فَقَسَموا الحَديثَ إلى قِسمَينِ كَبيرَين: المُتَواتِرِ والآحاد.\n\nفَالحَديثُ المُتَواتِرُ ما رَواهُ في كُلِّ طَبَقةٍ عَدَدٌ كَبيرٌ مِنَ الرُّواة — مِنَ الصَّحابةِ فَمَن بَعدَهُم — يَستَحيلُ تَواطُؤُهُم جَميعًا على الكَذِب. فَكَثرةُ الرُّواةِ واستِقلالُهُم يُعطي اليَقينَ بِأنَّ النَّبِيَّ ﷺ قالَ أو فَعَلَ ما رُوِيَ حَقًّا. ومِن أمثِلَتِهِ ما تَواتَرَ مِن وُجوبِ الصَّلَواتِ الخَمس، وتَحذيرِ النَّبِيِّ ﷺ المَشهور: «مَن كَذَبَ عَلَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار»، وقَد رَواهُ جَمعٌ كَبيرٌ مِنَ الصَّحابة. والمُتَواتِرُ أعلى دَرَجاتِ اليَقينِ في الحَديثِ بَعدَ القُرآنِ نَفسِه. وأمّا حَديثُ الآحادِ (خَبَرُ الواحِد) فَما رَواهُ عَدَدٌ أقَلُّ مِنَ المُتَواتِر — قَد يَرويهِ واحِدٌ أوِ اثنانِ أو عَدَدٌ في الطَّبَقة. وجُمهورُ الأحاديثِ آحاد. وحَديثُ الآحادِ لا يُفيدُ اليَقينَ المُطلَقَ كَالمُتَواتِر، لكِنَّهُ إن تَوافَرَت في سَنَدِهِ ورُواتِهِ شُروطُ الصِّحّةِ قُبِلَ وعُمِلَ بِه، وأفادَ عِلمًا قَويًّا راجِحًا يَكفي حُجّةً في الدّين.\n\nوالطَّريقةُ الثّانيةُ التي صَنَّفَ بِها العُلَماءُ الحَديثَ — وهي أدَقُّها — بِحَسَبِ ثِقةِ الخَبَرِ وقُوَّتِه، وبِها يَتَحَدَّدُ قَبولُهُ أو رَدُّه. ففي المَقبولِ مَيَّزَ العُلَماءُ دَرَجات. أعلاها الصَّحيحُ لِذاتِه: حَديثٌ اتَّصَلَ سَنَدُه، وكانَ كُلُّ راوٍ عَدلًا في خُلُقِهِ ضابِطًا في حِفظِه، سالِمًا مِن عِلّةٍ خَفيّةٍ أو شُذوذ. ودونَهُ الحَسَنُ لِذاتِه، وهو يَستَوفي الشُّروطَ نَفسَها إلّا أنَّ راويًا أو أكثَرَ أخَفُّ ضَبطًا قَليلًا معَ بَقاءِ الثِّقة. وقَد يَرتَفِعُ الحَديثُ بِالشَّواهِدِ والمُتابَعات: فَالحَسَنُ إذا اعتَضَدَ بِسَنَدٍ آخَرَ صارَ صَحيحًا لِغَيرِه، والضَّعيفُ إذا اعتَضَدَ بِطُرُقٍ ضَعيفةٍ أُخرى قَد يَرتَقي إلى الحَسَنِ لِغَيرِه. وهذه الفُروقُ الدَّقيقةُ مَكَّنَتِ العُلَماءَ مِن وَزنِ قُوّةِ كُلِّ خَبَرٍ بِعِنايةٍ بالِغة. وفي القِسمِ التّالي نَدرُسُ الحَديثَ المَردود — الضَّعيفَ والمَوضوع — وجُهدَ العُلَماءِ العَظيمَ في حِفظِ السُّنّةِ مِنَ الخَطَإِ والوَضع.",
      },
    },
    {
      title: { en: "The rejected hadith and protecting the Sunnah", ar: "الحَديثُ المَردودُ وحِفظُ السُّنّة" },
      learningObjectives: [
        { en: "Explain the weak (da'if) and fabricated (mawdu') hadith.", ar: "أشرَحُ الضَّعيفَ والمَوضوع." },
        { en: "Appreciate the scholars' effort to protect the Sunnah.", ar: "أُقَدِّرُ جُهدَ العُلَماءِ في حِفظِ السُّنّة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Protecting the Sunnah for every generation.", ar: "حِفظُ السُّنّةِ لِكُلِّ جيل." },
        caption: { en: "Verify reports carefully (Al-Hujurat 6).", ar: "التَّثَبُّتُ مِنَ الأخبار (الحُجُرات ٦)." },
      },
      groupTasks: {
        title: { en: "Grading and guarding hadith", ar: "تَصنيفُ الحَديثِ وحِراسَتُه" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "rejected-hadith",
            name: { en: "Team A — The weak and the fabricated", ar: "الفَريقُ أ — الضَّعيفُ والمَوضوع" },
            learningObjective: { en: "Present the categories of rejected hadith.", ar: "نَعرِضُ أقسامَ الحَديثِ المَردود." },
            task: { en: "Present the categories of rejected (mardud) hadith and explain each clearly: the da'if (weak) hadith — a report that fails one or more conditions of acceptance (a break in the chain, or a narrator who is weak in memory or character) — and its main causes (broken chains such as the munqati', mu'dal, mursal; and defects in narrators such as poor memory or lying); and the mawdu' (fabricated) hadith — a lie deliberately invented and falsely attributed to the Prophet ﷺ, which is the worst of all and forbidden to narrate as hadith. Explain how scholars detect fabrications (contradiction of the Qur'an or established Sunnah, a known liar in the chain, poor language or impossible claims). Present a 'rejected hadith' chart.", ar: "اعرِضوا أقسامَ الحَديثِ المَردودِ واشرَحوا كُلًّا بِوُضوح: الحَديثَ الضَّعيف — ما اختَلَّ فيهِ شَرطٌ أو أكثَرُ مِن شُروطِ القَبول (انقِطاعٌ في السَّنَد، أو راوٍ ضَعيفُ الحِفظِ أوِ الخُلُق) — وأهَمَّ أسبابِه (الانقِطاعِ كَالمُنقَطِعِ والمُعضَلِ والمُرسَل؛ والطَّعنِ في الرّاوي كَسوءِ الحِفظِ أوِ الكَذِب)؛ والحَديثَ المَوضوع — الكَذِبَ المُختَلَقَ المَنسوبَ زورًا إلى النَّبِيِّ ﷺ، وهو شَرُّها ويَحرُمُ روايَتُهُ على أنَّهُ حَديث. اشرَحوا كَيفَ يَكشِفُ العُلَماءُ الوَضعَ (مُخالَفةَ القُرآنِ أوِ السُّنّةِ الثّابِتة، أو كَذّابًا في السَّنَد، أو رَكاكةَ اللَّفظِ أوِ استِحالةَ المَعنى). اعرِضوا لَوحةَ «الحَديثِ المَردود»." },
            evidence: [
              { en: "'Whoever deliberately lies about me, let him take his seat in the Fire.'", ar: "«مَن كَذَبَ عَلَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار»." },
            ],
            sourceNotes: [
              { en: "Fabricating hadith is a grave sin against the Prophet ﷺ.", ar: "وَضعُ الحَديثِ كَبيرةٌ في حَقِّ النَّبِيِّ ﷺ." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'rejected hadith' chart.", ar: "لَوحةُ «الحَديثِ المَردود»." },
          },
          {
            slug: "protecting-sunnah",
            name: { en: "Team B — How the scholars protected the Sunnah", ar: "الفَريقُ ب — كَيفَ حَفِظَ العُلَماءُ السُّنّة" },
            learningObjective: { en: "Present the scholars' methods of protecting the Sunnah.", ar: "نَعرِضُ مَناهِجَ العُلَماءِ في حِفظِ السُّنّة." },
            task: { en: "Present the immense effort by which the scholars of hadith protected the Sunnah: the science of isnad (demanding a chain for every report); the science of al-jarh wa al-ta'dil (critically evaluating every narrator's reliability); travelling vast distances to verify a single hadith; compiling the great authentic collections (Sahih al-Bukhari, Sahih Muslim, the Sunan); and refusing to accept any report without verification, in obedience to the Qur'an's command: 'O you who believe, if a wrongdoer comes to you with news, verify it' (Al-Hujurat 6). Show that this is part of Allah's promise to guard His Reminder (Al-Hijr 9) and explain why a Muslim today should rely on authenticated hadith and beware of false attributions circulating on social media. Present a 'guarding the Sunnah' display.", ar: "اعرِضوا الجُهدَ العَظيمَ الذي حَفِظَ بِهِ عُلَماءُ الحَديثِ السُّنّة: عِلمَ الإسناد (اشتِراطَ سَنَدٍ لِكُلِّ خَبَر)؛ وعِلمَ الجَرحِ والتَّعديل (نَقدَ ثِقةِ كُلِّ راوٍ)؛ والرِّحلةَ الطَّويلةَ لِلتَّثَبُّتِ مِن حَديثٍ واحِد؛ وتَدوينَ الجَوامِعِ الصَّحيحةِ العَظيمة (صَحيحِ البُخاريّ، صَحيحِ مُسلِم، السُّنَن)؛ ورَفضَ قَبولِ أيِّ خَبَرٍ بِلا تَثَبُّت، طاعةً لِأمرِ القُرآن: ﴿يا أيُّها الذينَ آمَنوا إن جاءَكُم فاسِقٌ بِنَبَإٍ فَتَبَيَّنوا﴾ (الحُجُرات ٦). بَيِّنوا أنَّ هذا مِن وَعدِ اللهِ بِحِفظِ ذِكرِه (الحِجر ٩)، واشرَحوا لِمَ يَنبَغي لِلمُسلِمِ اليَومَ أن يَعتَمِدَ الحَديثَ المُحَقَّقَ ويَحذَرَ النِّسبةَ الكاذِبةَ المُنتَشِرةَ في وَسائِلِ التَّواصُل. اعرِضوا لَوحةَ «حِراسةِ السُّنّة»." },
            evidence: [
              { en: "'Indeed, it is We who sent down the Reminder and We will be its guardian' (Al-Hijr 9).", ar: "﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحِجر ٩)." },
            ],
            sourceNotes: [
              { en: "The science of hadith is a unique gift of this Ummah.", ar: "عِلمُ الحَديثِ هِبةٌ فَريدةٌ لِهذه الأُمّة." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'guarding the Sunnah' display.", ar: "لَوحةُ «حِراسةِ السُّنّة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Why I trust the authentic Sunnah", ar: "لِمَ أثِقُ بِالسُّنّةِ الصَّحيحة" },
        prompt: { en: "The scholars of hadith classified every report by the number of its narrators (mutawatir and ahad) and by its reliability (sahih, hasan, da'if, mawdu'), and devoted their lives to the sciences of isnad and al-jarh wa al-ta'dil to protect the Sunnah from error and forgery — fulfilling Allah's promise to guard His Reminder. Reflect on what this means for you. In an age when false sayings are wrongly attributed to the Prophet ﷺ and spread quickly on social media, why is it so important to rely only on authenticated hadith? Write about how the science of hadith strengthens your confidence in the Sunnah, and how you will be careful to verify a hadith before believing it or sharing it.", ar: "صَنَّفَ عُلَماءُ الحَديثِ كُلَّ خَبَرٍ بِحَسَبِ عَدَدِ رُواتِهِ (المُتَواتِرِ والآحاد) وبِحَسَبِ ثِقَتِهِ (الصَّحيحِ والحَسَنِ والضَّعيفِ والمَوضوع)، وأفنَوا أعمارَهُم في عِلمِ الإسنادِ والجَرحِ والتَّعديلِ لِحِفظِ السُّنّةِ مِنَ الخَطَإِ والوَضع — تَحقيقًا لِوَعدِ اللهِ بِحِفظِ ذِكرِه. تَأمَّل ماذا يَعني هذا لَك. في زَمَنٍ تُنسَبُ فيهِ أقوالٌ كاذِبةٌ إلى النَّبِيِّ ﷺ وتَنتَشِرُ سَريعًا في وَسائِلِ التَّواصُل، لِمَ يُهِمُّ أن تَعتَمِدَ الحَديثَ المُحَقَّقَ وَحدَه؟ اكتُب كَيفَ يُقَوّي عِلمُ الحَديثِ ثِقَتَكَ بِالسُّنّة، وكَيفَ سَتَحرِصُ على التَّثَبُّتِ مِنَ الحَديثِ قَبلَ أن تُصَدِّقَهُ أو تَنشُرَه." },
        placeholder: { en: "The science of hadith shows me... Before sharing a hadith I will...", ar: "عِلمُ الحَديثِ يُريني... وقَبلَ نَشرِ حَديثٍ سَأ..." },
      },
      body: {
        en: "While the accepted (maqbul) hadith — the sahih and the hasan — form the foundation on which rulings and beliefs may be built, the scholars also identified and set aside the rejected (mardud) hadith, those reports that cannot be relied upon. The rejected hadith fall into two main categories: the weak (da'if) and the fabricated (mawdu'). The da'if (weak) hadith is one that fails to meet one or more of the conditions of acceptance. Its weakness may come from a break in the chain of narration — where one or more narrators are missing — producing categories the scholars named precisely (such as the munqati', where a narrator is dropped in the middle; the mu'dal, where two consecutive narrators are missing; and the mursal, where the Companion is omitted and a Successor narrates directly from the Prophet ﷺ). Or its weakness may come from a defect in a narrator — such as poor memory, known unreliability, or being accused of lying. A weak hadith is not necessarily a lie, but it has not met the standard of proof, and so the majority of scholars do not use it to establish rulings or beliefs.\n\nFar graver than the merely weak is the mawdu' (fabricated) hadith — a saying that someone deliberately invented and falsely attributed to the Prophet ﷺ. This is not a defective report but an outright lie against the Messenger of Allah ﷺ, and it is among the gravest of sins, for the Prophet ﷺ warned in a mass-transmitted (mutawatir) hadith: 'Whoever deliberately lies about me, let him take his seat in the Fire.' Fabrications were invented by various people for various corrupt motives — to support a sect or political faction, to encourage people to good or frighten them from evil (wrongly thinking the end justified the lie), to gain favour with rulers, or to attack Islam from within. The scholars of hadith became expert at detecting fabrications: a report is recognised as fabricated if it contradicts the clear meaning of the Qur'an or the well-established Sunnah, if a known liar appears in its chain, if its language is weak and unworthy of the Prophet's eloquence, or if it promises absurdly huge rewards for tiny deeds or makes impossible claims. To narrate a fabricated hadith as though it were a genuine saying of the Prophet ﷺ, knowing its state, is itself forbidden.\n\nThe classification of hadith into these careful categories is the fruit of one of the most remarkable scholarly efforts in human history — the effort of the muhaddithun (scholars of hadith) to protect the Sunnah of the Prophet ﷺ from error and forgery. They built the science of isnad, insisting that no report be accepted without a chain of narrators reaching back to the Prophet ﷺ, so that, as one early scholar said, 'the isnad is part of the religion; were it not for the isnad, anyone could say whatever they wished.' They developed the science of al-jarh wa al-ta'dil (the critical evaluation of narrators), in which they examined the life, character, memory, and reliability of every single narrator, recording their findings with honesty and precision, never allowing personal feelings to distort the truth. They travelled enormous distances — across deserts and countries — to verify a single hadith from its source. And they compiled the great authentic collections, foremost among them Sahih al-Bukhari and Sahih Muslim, which gathered the soundest hadith after rigorous testing. All of this was done in obedience to the Qur'anic command to verify reports — 'O you who have believed, if a wrongdoer comes to you with news, verify it' (Al-Hujurat 6) — and as part of Allah's promise to guard His Reminder: 'Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian' (Al-Hijr 9), for the Sunnah is the explanation of the Qur'an and part of the revelation that Allah has preserved. For a young Muslim today, surrounded by countless sayings falsely attributed to the Prophet ﷺ on social media, this science is a priceless gift and a serious responsibility: to honour the authentic Sunnah, to rely only on what the scholars have authenticated, and never to spread a saying about the Prophet ﷺ without verifying it — for to do so carelessly is to risk the very lie against which he ﷺ so sternly warned. The science of hadith stands as a shining proof of how seriously this Ummah has guarded the words of its Prophet ﷺ, and as our firm assurance that the authentic Sunnah we follow truly comes from him.",
        ar: "بَينَما يُشَكِّلُ الحَديثُ المَقبول — الصَّحيحُ والحَسَن — الأساسَ الذي تُبنى علَيهِ الأحكامُ والعَقائِد، فَإنَّ العُلَماءَ مَيَّزوا كَذلك الحَديثَ المَردودَ ونَحَّوهُ جانِبًا، وهو ما لا يُعتَمَدُ علَيه. والمَردودُ قِسمانِ رَئيسان: الضَّعيفُ والمَوضوع. فَالضَّعيفُ ما اختَلَّ فيهِ شَرطٌ أو أكثَرُ مِن شُروطِ القَبول. وقَد يَأتي ضَعفُهُ مِنِ انقِطاعٍ في السَّنَد — حَيثُ يَسقُطُ راوٍ أو أكثَر — مُنتِجًا أقسامًا سَمّاها العُلَماءُ بِدِقّة (كَالمُنقَطِعِ إذا سَقَطَ راوٍ في الوَسَط؛ والمُعضَلِ إذا سَقَطَ راوِيانِ مُتَتالِيان؛ والمُرسَلِ إذا حُذِفَ الصَّحابيُّ ورَوى التّابِعيُّ مُباشَرةً عنِ النَّبِيِّ ﷺ). وقَد يَأتي ضَعفُهُ مِن طَعنٍ في راوٍ — كَسوءِ الحِفظ، أوِ الضَّعفِ المَعروف، أوِ الاتِّهامِ بِالكَذِب. ولَيسَ الضَّعيفُ بِالضَّرورةِ كَذِبًا، لكِنَّهُ لَم يَبلُغ دَرَجةَ الحُجّة، فَلِذا لا يَستَعمِلُهُ جُمهورُ العُلَماءِ في إثباتِ حُكمٍ أو عَقيدة.\n\nوأشَدُّ مِنَ الضَّعيفِ بِكَثيرٍ الحَديثُ المَوضوع — قَولٌ اختَلَقَهُ أحَدٌ عَمدًا ونَسَبَهُ زورًا إلى النَّبِيِّ ﷺ. وهذا لَيسَ خَبَرًا مَعلولًا بل كَذِبٌ صَريحٌ على رَسولِ اللهِ ﷺ، وهو مِن أعظَمِ الكَبائِر، فَقَد حَذَّرَ النَّبِيُّ ﷺ في حَديثٍ مُتَواتِر: «مَن كَذَبَ عَلَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار». وقَدِ اختَلَقَ الوَضّاعونَ الأحاديثَ لِدَوافِعَ فاسِدةٍ شَتّى — لِنُصرةِ فِرقةٍ أو حِزب، أو لِتَرغيبِ النّاسِ في الخَيرِ أو تَرهيبِهِم مِنَ الشَّرّ (ظَنًّا خاطِئًا أنَّ الغايةَ تُبَرِّرُ الكَذِب)، أو لِلتَّقَرُّبِ مِنَ الحُكّام، أو لِلطَّعنِ في الإسلامِ مِن داخِلِه. وقَد بَرَعَ عُلَماءُ الحَديثِ في كَشفِ الوَضع: فَيُعرَفُ المَوضوعُ إذا خالَفَ صَريحَ القُرآنِ أوِ السُّنّةِ الثّابِتة، أو ظَهَرَ في سَنَدِهِ كَذّابٌ مَعروف، أو رَكَّت ألفاظُهُ بِما لا يَليقُ بِفَصاحةِ النَّبِيِّ ﷺ، أو وَعَدَ بِأجورٍ ضَخمةٍ سَخيفةٍ على عَمَلٍ يَسيرٍ أو ادَّعى المُستَحيل. وروايةُ المَوضوعِ على أنَّهُ حَديثٌ صَحيحٌ معَ العِلمِ بِحالِهِ مُحَرَّمةٌ في نَفسِها.\n\nوتَصنيفُ الحَديثِ إلى هذه الأقسامِ الدَّقيقةِ ثَمَرةُ أحَدِ أعظَمِ الجُهودِ العِلميّةِ في تاريخِ البَشَريّة — جُهدِ المُحَدِّثينَ في حِفظِ سُنّةِ النَّبِيِّ ﷺ مِنَ الخَطَإِ والوَضع. بَنوا عِلمَ الإسناد، فَاشتَرَطوا ألّا يُقبَلَ خَبَرٌ بِلا سَنَدٍ يَبلُغُ النَّبِيَّ ﷺ، حتّى قالَ بَعضُ السَّلَف: «الإسنادُ مِنَ الدّين، ولَولا الإسنادُ لَقالَ مَن شاءَ ما شاء». وطَوَّروا عِلمَ الجَرحِ والتَّعديل، فَفَحَصوا حَياةَ كُلِّ راوٍ وخُلُقَهُ وحِفظَهُ وثِقَتَه، ودَوَّنوا أحكامَهُم بِصِدقٍ ودِقّة، لا يَدَعونَ عاطِفةً تُحَرِّفُ الحَقّ. ورَحَلوا المَسافاتِ الهائِلةَ — عَبرَ الصَّحارى والبُلدان — لِلتَّثَبُّتِ مِن حَديثٍ واحِدٍ مِن مَصدَرِه. ودَوَّنوا الجَوامِعَ الصَّحيحةَ العَظيمة، وعلى رَأسِها صَحيحُ البُخاريِّ وصَحيحُ مُسلِم، اللَّذانِ جَمَعا أصَحَّ الحَديثِ بَعدَ اختِبارٍ صارِم. وكُلُّ ذلك طاعةً لِأمرِ القُرآنِ بِالتَّثَبُّتِ مِنَ الأخبار — ﴿يا أيُّها الذينَ آمَنوا إن جاءَكُم فاسِقٌ بِنَبَإٍ فَتَبَيَّنوا﴾ (الحُجُرات ٦) — وجُزءًا مِن وَعدِ اللهِ بِحِفظِ ذِكرِه: ﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحِجر ٩)، فَالسُّنّةُ بَيانُ القُرآنِ وجُزءٌ مِنَ الوَحيِ الذي حَفِظَهُ الله. ولِلشّابِّ المُسلِمِ اليَوم، وهو مُحاطٌ بِأقوالٍ لا تُحصى تُنسَبُ زورًا إلى النَّبِيِّ ﷺ في وَسائِلِ التَّواصُل، هذا العِلمُ هِبةٌ لا تُقَدَّرُ ومَسؤوليّةٌ جادّة: أن يُكرِمَ السُّنّةَ الصَّحيحة، ويَعتَمِدَ ما حَقَّقَهُ العُلَماءُ وَحدَه، ولا يَنشُرَ قَولًا عنِ النَّبِيِّ ﷺ دونَ تَثَبُّت — فَفِعلُ ذلك بِتَهاوُنٍ مُخاطَرةٌ بِعَينِ الكَذِبِ الذي حَذَّرَ مِنهُ أشَدَّ التَّحذير. ويَقِفُ عِلمُ الحَديثِ بُرهانًا ساطِعًا على مَدى عِنايةِ هذه الأُمّةِ بِحِفظِ كَلامِ نَبِيِّها ﷺ، وضَمانًا راسِخًا لَنا أنَّ السُّنّةَ الصَّحيحةَ التي نَتَّبِعُها جاءَتنا مِنهُ حَقًّا.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is a mutawatir hadith?", ar: "ما الحَديثُ المُتَواتِر؟" },
      options: [
        { en: "One narrated by so many it cannot be a lie", ar: "ما رَواهُ جَمعٌ يَستَحيلُ تَواطُؤُهُم على الكَذِب" },
        { en: "One narrated by a single liar", ar: "ما رَواهُ كَذّابٌ واحِد" },
        { en: "A fabricated saying", ar: "قَولٌ مَوضوع" },
        { en: "A weak report", ar: "خَبَرٌ ضَعيف" },
      ],
      correctIndex: 0,
      explanation: { en: "Its many independent narrators give certainty.", ar: "كَثرةُ رُواتِهِ المُستَقِلّينَ تُفيدُ اليَقين." },
    },
    {
      prompt: { en: "Which is the highest grade of accepted hadith?", ar: "ما أعلى دَرَجاتِ الحَديثِ المَقبول؟" },
      options: [
        { en: "Sahih li-dhatihi (authentic in itself)", ar: "الصَّحيحُ لِذاتِه" },
        { en: "Da'if (weak)", ar: "الضَّعيف" },
        { en: "Mawdu' (fabricated)", ar: "المَوضوع" },
        { en: "Munqati' (broken)", ar: "المُنقَطِع" },
      ],
      correctIndex: 0,
      explanation: { en: "Continuous chain of upright, precise narrators with no defect.", ar: "سَنَدٌ مُتَّصِلٌ بِعُدولٍ ضابِطينَ بِلا عِلّة." },
    },
    {
      prompt: { en: "What is a mawdu' hadith?", ar: "ما الحَديثُ المَوضوع؟" },
      options: [
        { en: "A lie deliberately invented and attributed to the Prophet ﷺ", ar: "كَذِبٌ مُختَلَقٌ مَنسوبٌ إلى النَّبِيِّ ﷺ" },
        { en: "A sound hadith", ar: "حَديثٌ صَحيح" },
        { en: "A verse of the Qur'an", ar: "آيةٌ مِنَ القُرآن" },
        { en: "A mass-transmitted report", ar: "خَبَرٌ مُتَواتِر" },
      ],
      correctIndex: 0,
      explanation: { en: "Lying about the Prophet ﷺ is a grave sin.", ar: "الكَذِبُ على النَّبِيِّ ﷺ كَبيرةٌ عَظيمة." },
    },
    {
      prompt: { en: "What science evaluates the reliability of narrators?", ar: "ما العِلمُ الذي يَنقُدُ ثِقةَ الرُّواة؟" },
      options: [
        { en: "Al-jarh wa al-ta'dil", ar: "الجَرحُ والتَّعديل" },
        { en: "Astronomy", ar: "الفَلَك" },
        { en: "Medicine", ar: "الطِّبّ" },
        { en: "Poetry", ar: "الشِّعر" },
      ],
      correctIndex: 0,
      explanation: { en: "Scholars examined every narrator's character and memory.", ar: "فَحَصَ العُلَماءُ خُلُقَ كُلِّ راوٍ وحِفظَه." },
    },
    {
      prompt: { en: "What does Al-Hujurat 6 command regarding reports?", ar: "بِمَ تَأمُرُ الحُجُرات ٦ في الأخبار؟" },
      options: [
        { en: "To verify them before accepting", ar: "بِالتَّثَبُّتِ مِنها قَبلَ القَبول" },
        { en: "To accept all of them", ar: "بِقَبولِها جَميعًا" },
        { en: "To ignore them", ar: "بِتَجاهُلِها" },
        { en: "To spread them quickly", ar: "بِنَشرِها سَريعًا" },
      ],
      correctIndex: 0,
      explanation: { en: "'If a wrongdoer comes to you with news, verify it.'", ar: "﴿إن جاءَكُم فاسِقٌ بِنَبَإٍ فَتَبَيَّنوا﴾." },
    },
    {
      prompt: { en: "True or False: The science of hadith helps guarantee that the authentic Sunnah truly comes from the Prophet ﷺ.", ar: "صَوابٌ أم خَطأ: عِلمُ الحَديثِ يُساعِدُ على ضَمانِ أنَّ السُّنّةَ الصَّحيحةَ جاءَت مِنَ النَّبِيِّ ﷺ حَقًّا." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "It is part of Allah's preservation of His Reminder.", ar: "هو مِن حِفظِ اللهِ لِذِكرِه." },
    },
  ],
};
