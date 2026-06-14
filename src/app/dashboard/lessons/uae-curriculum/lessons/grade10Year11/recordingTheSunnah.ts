import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const recordingTheSunnah: CourseLesson = {
  slug: "g10y11-recording-the-sunnah",
  name: { en: "Recording the Sunnah", ar: "تَدوينُ السُّنّة" },
  shortIntro: {
    en: "How was the Sunnah of the Prophet ﷺ preserved and written down across the generations? This lesson studies the stages of recording the hadith, the memorisation and writing of the Companions, the formal codification under Umar ibn Abdul Aziz, and the great hadith collections — a story of unmatched precision that preserved the second source of Islam.",
    ar: "كَيفَ حُفِظَت سُنّةُ النَّبِيِّ ﷺ ودُوِّنَت عَبرَ الأجيال؟ يَدرُسُ هذا الدَّرسُ مَراحِلَ تَدوينِ الحَديث، وحِفظَ الصَّحابةِ وكِتابَتَهُم، والتَّدوينَ الرَّسميَّ في عَهدِ عُمَرَ بنِ عَبدِ العَزيز، وكُتُبَ الحَديثِ العَظيمة — قِصّةَ دِقّةٍ لا نَظيرَ لَها حَفِظَت المَصدَرَ الثّانيَ لِلإسلام.",
  },
  quranSurahs: ["Al-Hijr 9", "An-Nahl 44"],
  sections: [
    {
      title: { en: "Preservation in the Prophet's era ﷺ and the Companions", ar: "الحِفظُ في عَهدِ النَّبِيِّ ﷺ والصَّحابة" },
      learningObjectives: [
        { en: "Describe how the Sunnah was preserved in the Prophet's time ﷺ.", ar: "أصِفُ حِفظَ السُّنّةِ في عَهدِ النَّبِيِّ ﷺ." },
        { en: "Explain memorisation and early writing of hadith.", ar: "أشرَحُ الحِفظَ والكِتابةَ المُبَكِّرةَ لِلحَديث." },
      ],
      successCriteria: [
        { en: "I can explain why little hadith was written at first.", ar: "أشرَحُ سَبَبَ قِلّةِ كِتابةِ الحَديثِ أوَّلًا." },
        { en: "I can give examples of Companions who wrote hadith.", ar: "أذكُرُ صَحابةً كَتَبوا الحَديث." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "Reading and memorising — the heart of early preservation.", ar: "القِراءةُ والحِفظ — قَلبُ الحِفظِ المُبَكِّر." },
        caption: { en: "'Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian' (Al-Hijr 9).", ar: "﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحجر ٩)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How can we trust the hadith after fourteen centuries?", ar: "كَيفَ نَثِقُ بِالحَديثِ بَعدَ أربَعةَ عَشَرَ قَرنًا؟" },
        body: {
          en: "Some doubt whether the words and deeds of the Prophet ﷺ could really be preserved accurately across so many generations. But the Ummah developed a science of preservation — memorisation, writing, and the rigorous verification of chains of narration (isnad) — unmatched by any nation in history. Reflect: how did the combination of powerful memories, careful writing, and the scrutiny of every narrator give us a reliably preserved Sunnah, and why is protecting this source so important?",
          ar: "يَشُكُّ بَعضُهُم أكانَ يُمكِنُ حَقًّا حِفظُ أقوالِ النَّبِيِّ ﷺ وأفعالِهِ بِدِقّةٍ عَبرَ أجيالٍ كَثيرة. لكِنَّ الأُمّةَ طَوَّرَت عِلمًا لِلحِفظِ — الحِفظَ والكِتابةَ والتَّحَقُّقَ الدَّقيقَ مِن أسانيدِ الرُّواة — لا نَظيرَ لَهُ عِندَ أُمّةٍ في التّاريخ. تَأمَّل: كَيفَ أعطانا اجتِماعُ الحِفظِ القَويِّ والكِتابةِ الدَّقيقةِ وتَمحيصِ كُلِّ راوٍ سُنّةً مَحفوظةً مَوثوقة، ولِمَ كانَ حِفظُ هذا المَصدَرِ بِهذه الأهَمّيّة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Isnad (إسناد): the chain of narrators who transmitted a hadith.", ar: "الإسناد: سِلسِلةُ الرُّواةِ الذينَ نَقَلوا الحَديث." },
            { en: "Tadwin (تَدوين): the formal recording and codification of hadith.", ar: "التَّدوين: تَسجيلُ الحَديثِ وتَقعيدُهُ رَسميًّا." },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "'Write for me' — the Prophet ﷺ permitted Abdullah ibn Amr to write (Abu Dawud).", ar: "«اكتُب» — أذِنَ النَّبِيُّ ﷺ لِعَبدِ اللهِ بنِ عَمرٍو بِالكِتابة (أبو داود)." },
          ],
        },
      ],
      body: {
        en: "The Sunnah of the Prophet Muhammad ﷺ — his sayings, actions, and approvals — is the second source of Islam after the Qur'an, and its preservation across the centuries is one of the great miracles of this Ummah and a clear sign of Allah's protection of His religion. While the Qur'an was written down completely and in order during the Prophet's lifetime and compiled into one book shortly after, the recording and codification of the Sunnah followed a different and gradual path, yet was preserved with extraordinary precision through a combination of memorisation, writing, and the unique science of verifying chains of narration. Understanding how the Sunnah was preserved strengthens a Muslim's certainty in the authenticity of the hadith and answers the doubts of those who question whether the Prophet's words could truly have reached us reliably.\n\nIn the era of the Prophet ﷺ himself, the primary means of preserving the Sunnah was memorisation. The Companions were a people of remarkable memory, and they devoted themselves to learning, retaining, and acting upon every word and deed of the Prophet ﷺ, whom they loved more than themselves. They listened attentively to his teachings, witnessed his actions, asked him questions, and carried what they learned to others. Alongside this powerful memorisation, the writing of some hadith also occurred from the earliest period. It is true that, at the beginning, the Prophet ﷺ discouraged the general writing of hadith in the same documents as the Qur'an, out of concern that the two might be mixed or confused while the Qur'an was still being revealed — as in his words: 'Do not write from me anything except the Qur'an, and whoever has written anything from me other than the Qur'an, let him erase it' (Muslim). However, this was not an absolute or permanent prohibition. The Prophet ﷺ permitted and even instructed the writing of hadith in many specific cases. He allowed Abdullah ibn Amr ibn al-As to write down everything he heard from him, telling him: 'Write, for by the One in whose hand is my soul, nothing comes out of it (i.e. my mouth) except the truth' (Abu Dawud); Abdullah's collection became known as as-Sahifah as-Sadiqah. The Prophet ﷺ also ordered a letter of detailed rulings to be written for Amr ibn Hazm, dictated documents and treaties, and after the Conquest of Makkah, when Abu Shah requested a sermon in writing, he said: 'Write it for Abu Shah' (Bukhari). Thus both memorisation and selective writing preserved the Sunnah from the very beginning.\n\nThe apparent discouragement of writing in some narrations and the encouragement of it in others is understood by the scholars in a harmonious way: the early discouragement applied especially to writing hadith together with the Qur'an or in a way that risked confusing the two during the period of revelation, and to relying on writing while neglecting memorisation; while the permission applied to those who could write carefully without such confusion, and once the fear of mixing had passed. As the Qur'an became firmly established and distinguished in the minds and records of the Muslims, the writing of hadith increased and spread. The Companions and the generation after them (the Tabi'un) preserved the Sunnah through a living chain of teaching and learning, narrating from one another with great care, and increasingly committing hadith to writing in personal collections and pages (suhuf). This combination of disciplined memorisation and careful writing, carried by trustworthy narrators in an unbroken chain, laid the foundation for the formal codification of the Sunnah that would follow. In the next section, we examine the official recording of the Sunnah under Umar ibn Abdul Aziz, the great compilations of hadith, and the unmatched science of authentication that the scholars of this Ummah developed to protect the Prophet's words ﷺ.",
        ar: "سُنّةُ النَّبِيِّ مُحَمَّدٍ ﷺ — أقوالُهُ وأفعالُهُ وتَقريراتُهُ — هي المَصدَرُ الثّاني لِلإسلامِ بَعدَ القُرآن، وحِفظُها عَبرَ القُرونِ مِن أعظَمِ مُعجِزاتِ هذه الأُمّةِ ودَليلٌ واضِحٌ على حِفظِ اللهِ لِدينِه. فَبَينَما كُتِبَ القُرآنُ كامِلًا مُرَتَّبًا في حَياةِ النَّبِيِّ ﷺ وجُمِعَ في مُصحَفٍ واحِدٍ بَعدَهُ بِقَليل، سارَ تَدوينُ السُّنّةِ في طَريقٍ مُختَلِفٍ مُتَدَرِّج، ومعَ ذلك حُفِظَت بِدِقّةٍ عَجيبةٍ بِاجتِماعِ الحِفظِ والكِتابةِ وعِلمِ التَّحَقُّقِ مِنَ الأسانيدِ الفَريد. وفَهمُ كَيفَ حُفِظَتِ السُّنّةُ يُقَوّي يَقينَ المُسلِمِ بِصِحّةِ الحَديثِ ويُجيبُ شُبُهاتِ مَن يَشُكُّ أوَصَلَت أقوالُ النَّبِيِّ ﷺ إلَينا مَوثوقةً حَقًّا.\n\nوفي عَهدِ النَّبِيِّ ﷺ نَفسِهِ كانَ الحِفظُ هو الوَسيلةَ الأولى لِحِفظِ السُّنّة. فالصَّحابةُ قَومٌ ذَوو ذاكِرةٍ عَجيبة، وَقَفوا أنفُسَهُم على تَعَلُّمِ كُلِّ قَولٍ وفِعلٍ لِلنَّبِيِّ ﷺ الذي أحَبّوهُ أكثَرَ مِن أنفُسِهِم، وحِفظِهِ والعَمَلِ بِه. أصغوا إلى تَعاليمِهِ، وشَهِدوا أفعالَه، وسَألوهُ، ونَقَلوا ما تَعَلَّموا لِغَيرِهِم. ومعَ هذا الحِفظِ القَويِّ وَقَعَت كِتابةُ بَعضِ الحَديثِ مُنذُ العَهدِ الأوَّل. صَحيحٌ أنَّ النَّبِيَّ ﷺ كَرِهَ في البِدايةِ كِتابةَ الحَديثِ معَ القُرآنِ في صَحيفةٍ واحِدة، خَشيةَ اختِلاطِهِما والقُرآنُ ما زالَ يَنزِل — كَقَولِه: «لا تَكتُبوا عَنّي، ومَن كَتَبَ عَنّي غَيرَ القُرآنِ فَليَمحُه» (مسلم). لكِنَّ هذا لم يَكُن نَهيًا مُطلَقًا دائِمًا. فَقَد أذِنَ النَّبِيُّ ﷺ بِكِتابةِ الحَديثِ بل أمَرَ بِها في مَواضِعَ كَثيرة. أذِنَ لِعَبدِ اللهِ بنِ عَمرِو بنِ العاصِ أن يَكتُبَ كُلَّ ما يَسمَعُهُ مِنهُ، فَقالَ لَه: «اكتُب، فَوَالذي نَفسي بِيَدِهِ ما يَخرُجُ مِنهُ إلّا حَقّ» (أبو داود)؛ وعُرِفَت صَحيفَتُهُ بِالصَّحيفةِ الصّادِقة. وأمَرَ النَّبِيُّ ﷺ أن يُكتَبَ كِتابُ الأحكامِ المُفَصَّلِ لِعَمرِو بنِ حَزم، وأملى وَثائِقَ وعُهودًا، وبَعدَ فَتحِ مَكّةَ لَمّا طَلَبَ أبو شاهٍ خُطبةً مَكتوبة، قال: «اكتُبوا لِأبي شاه» (البخاري). فَحَفِظَ السُّنّةَ مُنذُ البِدايةِ الحِفظُ والكِتابةُ المُنتَقاةُ مَعًا.\n\nوكَراهةُ الكِتابةِ في بَعضِ الرِّواياتِ وإذنُها في أُخرى يَفهَمُهُ العُلَماءُ فَهمًا مُتَّسِقًا: فالكَراهةُ الأولى كانَت خاصّةً بِكِتابةِ الحَديثِ معَ القُرآنِ أو بِما يُخشى مَعَهُ خَلطُهُما زَمَنَ النُّزول، وبِالاعتِمادِ على الكِتابةِ معَ إهمالِ الحِفظ؛ والإذنُ كانَ لِمَن يَكتُبُ بِعِنايةٍ بِلا خَلط، وبَعدَ زَوالِ خَوفِ الالتِباس. ولَمّا رَسَخَ القُرآنُ وتَمَيَّزَ في صُدورِ المُسلِمينَ وسِجِلّاتِهِم، كَثُرَت كِتابةُ الحَديثِ وانتَشَرَت. وحَفِظَ الصَّحابةُ ومَن بَعدَهُمُ (التّابِعون) السُّنّةَ بِسِلسِلةٍ حَيّةٍ مِنَ التَّعليمِ والتَّعَلُّم، يَروي بَعضُهُم عن بَعضٍ بِعِنايةٍ شَديدة، ويُكثِرونَ مِن تَقييدِ الحَديثِ في صُحُفٍ ومَجاميعَ شَخصيّة. وهذا الاجتِماعُ بَينَ الحِفظِ المُنضَبِطِ والكِتابةِ الدَّقيقة، يَحمِلُهُ رُواةٌ ثِقاتٌ في سَنَدٍ مُتَّصِل، مَهَّدَ لِتَدوينِ السُّنّةِ الرَّسميِّ الذي تَلا. وفي القِسمِ التّالي نَتَناوَلُ التَّدوينَ الرَّسميَّ لِلسُّنّةِ في عَهدِ عُمَرَ بنِ عَبدِ العَزيز، وكُتُبَ الحَديثِ العَظيمة، وعِلمَ التَّحَقُّقِ الذي لا نَظيرَ لَهُ والذي طَوَّرَهُ عُلَماءُ هذه الأُمّةِ لِحِفظِ أقوالِ النَّبِيِّ ﷺ.",
      },
    },
    {
      title: { en: "Codification and the science of authentication", ar: "التَّدوينُ الرَّسميُّ وعِلمُ التَّحَقُّق" },
      learningObjectives: [
        { en: "Describe the official codification of the Sunnah.", ar: "أصِفُ التَّدوينَ الرَّسميَّ لِلسُّنّة." },
        { en: "Explain the science of isnad and hadith verification.", ar: "أشرَحُ عِلمَ الإسنادِ وتَمحيصِ الحَديث." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Shelves of hadith collections — the codified Sunnah preserved.", ar: "رُفوفُ كُتُبِ الحَديث — السُّنّةُ المُدَوَّنةُ مَحفوظة." },
        caption: { en: "The great collections preserved the Prophet's words ﷺ for all time.", ar: "حَفِظَتِ الكُتُبُ الكُبرى أقوالَ النَّبِيِّ ﷺ لِلأبَد." },
      },
      groupTasks: {
        title: { en: "How the Sunnah reached us", ar: "كَيفَ وَصَلَتنا السُّنّة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "the-codification",
            name: { en: "Team A — Codification and the great books", ar: "الفَريقُ أ — التَّدوينُ والكُتُبُ الكُبرى" },
            learningObjective: { en: "Present the stages of formal codification and the major collections.", ar: "نَعرِضُ مَراحِلَ التَّدوينِ الرَّسميِّ والكُتُبَ الكُبرى." },
            task: { en: "Present the formal codification (tadwin) of the Sunnah. Show the key turning point: the righteous caliph Umar ibn Abdul Aziz (d. 101 AH) feared the loss of knowledge with the passing of the scholars, so he ordered the official, organised collection of hadith, writing to his governors and to Abu Bakr ibn Hazm and Ibn Shihab az-Zuhri to gather and record the Sunnah — making Az-Zuhri among the first great compilers. Then present the later great collections: the Muwatta of Imam Malik, the Musnad of Ahmad, and especially the six famous books (al-Kutub as-Sittah): Sahih al-Bukhari and Sahih Muslim (the two most authentic), then the Sunan of Abu Dawud, at-Tirmidhi, an-Nasa'i, and Ibn Majah. Present a 'stages of recording the Sunnah' timeline.", ar: "اعرِضوا التَّدوينَ الرَّسميَّ لِلسُّنّة. بَيِّنوا المُنعَطَفَ المِفصَليّ: الخَليفةُ الرّاشِدُ عُمَرُ بنُ عَبدِ العَزيز (ت ١٠١هـ) خَشيَ ذَهابَ العِلمِ بِمَوتِ العُلَماء، فَأمَرَ بِجَمعِ الحَديثِ رَسميًّا مُنَظَّمًا، وكَتَبَ إلى وُلاتِهِ وإلى أبي بَكرِ بنِ حَزمٍ وابنِ شِهابٍ الزُّهريِّ بِجَمعِ السُّنّةِ وتَدوينِها — فَكانَ الزُّهريُّ مِن أوائِلِ المُدَوِّنينَ الكِبار. ثُمَّ اعرِضوا الكُتُبَ الكُبرى التّالية: المُوَطَّأَ لِلإمامِ مالِك، ومُسنَدَ أحمَد، وخاصّةً الكُتُبَ السِّتّةَ المَشهورة: صَحيحَ البُخاريِّ وصَحيحَ مُسلِم (أصَحَّ الكُتُب)، ثُمَّ سُنَنَ أبي داودَ والتِّرمِذيِّ والنَّسائيِّ وابنِ ماجَه. اعرِضوا خَطًّا زَمَنيًّا لِـ«مَراحِلِ تَدوينِ السُّنّة»." },
            evidence: [
              { en: "Umar ibn Abdul Aziz ordered the official gathering of hadith.", ar: "أمَرَ عُمَرُ بنُ عَبدِ العَزيزِ بِجَمعِ الحَديثِ رَسميًّا." },
            ],
            sourceNotes: [
              { en: "Al-Bukhari and Muslim are the two most authentic books after the Qur'an.", ar: "البُخاريُّ ومُسلِمٌ أصَحُّ الكُتُبِ بَعدَ القُرآن." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'stages of recording' timeline.", ar: "خَطٌّ زَمَنيٌّ لِمَراحِلِ التَّدوين." },
          },
          {
            slug: "science-of-isnad",
            name: { en: "Team B — The science of isnad", ar: "الفَريقُ ب — عِلمُ الإسناد" },
            learningObjective: { en: "Present the unique science of verifying hadith.", ar: "نَعرِضُ عِلمَ التَّحَقُّقِ مِنَ الحَديثِ الفَريد." },
            task: { en: "Present the unmatched science of hadith authentication. Show that the scholars did not accept any report blindly; they examined the isnad (chain of narrators) and the matn (text). They developed 'ilm al-rijal (the science of evaluating narrators), investigating each narrator's honesty, memory, and reliability, and building biographical records of thousands of narrators. They graded hadith as sahih (authentic), hasan (good), da'if (weak), or mawdu' (fabricated) according to strict conditions. Quote Ibn al-Mubarak: 'The isnad is part of the religion; were it not for the isnad, anyone could say whatever they wished.' Explain how this rigorous, scientific verification — unique to this Ummah — protected the Sunnah from fabrication and gives us confidence in the authentic hadith today. Present a 'how scholars test a hadith' explainer.", ar: "اعرِضوا عِلمَ تَحَقُّقِ الحَديثِ الذي لا نَظيرَ لَه. بَيِّنوا أنَّ العُلَماءَ لم يَقبَلوا خَبَرًا بِلا تَمحيص؛ فَحَصوا الإسنادَ (سِلسِلةَ الرُّواة) والمَتنَ (النَّصّ). وطَوَّروا عِلمَ الرِّجال (تَقييمِ الرُّواة)، يَبحَثونَ صِدقَ كُلِّ راوٍ وحِفظَهُ وضَبطَه، ويُؤَلِّفونَ تَراجِمَ آلافِ الرُّواة. وصَنَّفوا الحَديثَ إلى صَحيحٍ وحَسَنٍ وضَعيفٍ ومَوضوعٍ بِشُروطٍ دَقيقة. اقتَبِسوا قَولَ ابنِ المُبارَك: «الإسنادُ مِنَ الدّين، ولَولا الإسنادُ لَقالَ مَن شاءَ ما شاء». واشرَحوا كَيفَ حَمى هذا التَّحَقُّقُ الدَّقيقُ العِلميُّ — الفَريدُ لِهذه الأُمّة — السُّنّةَ مِنَ الوَضعِ وأعطانا الثِّقةَ بِالحَديثِ الصَّحيحِ اليَوم. اعرِضوا شَرحَ «كَيفَ يَختَبِرُ العُلَماءُ الحَديث»." },
            evidence: [
              { en: "'The isnad is part of the religion' (Ibn al-Mubarak).", ar: "«الإسنادُ مِنَ الدّين» (ابن المبارك)." },
            ],
            sourceNotes: [
              { en: "No nation preserved its sources with such rigour.", ar: "لم تَحفَظ أُمّةٌ مَصادِرَها بِمِثلِ هذه الدِّقّة." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'how scholars test a hadith' explainer.", ar: "شَرحُ «كَيفَ يَختَبِرُ العُلَماءُ الحَديث»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Trusting and honouring the Sunnah", ar: "الثِّقةُ بِالسُّنّةِ وتَعظيمُها" },
        prompt: { en: "You have learned how the Sunnah was preserved through the memorisation and writing of the Companions, the formal codification under Umar ibn Abdul Aziz, the great hadith collections, and the unmatched science of verifying narrators and chains. Reflect on how this incredible effort, spanning generations, was a means by which Allah protected the second source of His religion. Write about how learning the story of the preservation of the Sunnah strengthens your trust in the authentic hadith, and how you will honour this trust — by learning authentic hadith, verifying what you share, being careful not to spread weak or fabricated reports, and acting upon the Prophet's guidance ﷺ in your life.", ar: "عَلِمتَ كَيفَ حُفِظَتِ السُّنّةُ بِحِفظِ الصَّحابةِ وكِتابَتِهِم، والتَّدوينِ الرَّسميِّ في عَهدِ عُمَرَ بنِ عَبدِ العَزيز، وكُتُبِ الحَديثِ الكُبرى، وعِلمِ تَمحيصِ الرُّواةِ والأسانيدِ الذي لا نَظيرَ لَه. تَأمَّل كَيفَ كانَ هذا الجَهدُ العَظيمُ، المُمتَدُّ أجيالًا، وَسيلةً حَفِظَ اللهُ بِها المَصدَرَ الثّانيَ لِدينِه. اكتُب كَيفَ تُقَوّي مَعرِفةُ قِصّةِ حِفظِ السُّنّةِ ثِقَتَكَ بِالحَديثِ الصَّحيح، وكَيفَ سَتَرعى هذه الأمانة — بِتَعَلُّمِ الحَديثِ الصَّحيح، والتَّثَبُّتِ مِمّا تَنشُر، والحَذَرِ مِن نَشرِ الضَّعيفِ والمَوضوع، والعَمَلِ بِهَديِ النَّبِيِّ ﷺ في حَياتِك." },
        placeholder: { en: "The preservation of the Sunnah strengthens my trust because... I will honour the hadith by... Before sharing a hadith I will...", ar: "حِفظُ السُّنّةِ يُقَوّي ثِقَتي لِأنَّ... وسَأرعى الحَديثَ بِـ... وقَبلَ نَشرِ حَديثٍ سَـ..." },
      },
      body: {
        en: "While memorisation and selective writing preserved the Sunnah from the earliest period, a crucial turning point in its formal recording came with the righteous Umayyad caliph Umar ibn Abdul Aziz (d. 101 AH), often regarded as the fifth rightly-guided caliph for his justice and piety. As the generation of the Companions passed away and the early scholars who had memorised vast amounts of hadith began to die, Umar ibn Abdul Aziz feared that this priceless knowledge might be lost or that error might creep in, so he took the historic decision to officially codify the Sunnah. He wrote to his governors across the lands and to leading scholars — among them Abu Bakr ibn Hazm and the great Imam Ibn Shihab az-Zuhri — instructing them to gather, examine, and write down the hadith of the Prophet ﷺ in an organised manner. This marked the beginning of the formal, official era of recording the Sunnah (tadwin), and Imam az-Zuhri became known as among the first to systematically compile hadith at the command of the state. From this point, the writing and organising of hadith expanded rapidly across the Muslim world.\n\nThe generations that followed produced the great compilations of hadith that remain the treasure of this Ummah. Among the earliest and most important was the Muwatta of Imam Malik ibn Anas, a foundational collection of hadith and the practice of the people of Madinah. Then came the great Musnad of Imam Ahmad ibn Hanbal, organised by narrator, containing tens of thousands of reports. The most authoritative collections, however, are the six famous books known as al-Kutub as-Sittah (the Six Books). Foremost among them are the two Sahihs: Sahih al-Bukhari, compiled by Imam Muhammad ibn Isma'il al-Bukhari, who applied the strictest conditions of authenticity and is considered the most authentic book after the Book of Allah; and Sahih Muslim, compiled by Imam Muslim ibn al-Hajjaj, second only to al-Bukhari in authenticity. To these are added the four Sunan collections: Sunan Abi Dawud, Jami' at-Tirmidhi, Sunan an-Nasa'i, and Sunan Ibn Majah. These scholars travelled vast distances, examined hundreds of thousands of narrations, and selected from them only those that met their rigorous standards, recording the authentic Sunnah for all generations to come.\n\nWhat makes the preservation of the Sunnah truly remarkable — indeed unique in the history of all nations — is the science of authentication that the scholars of hadith developed to protect it from any error or fabrication. The Muslim scholars did not accept any report attributed to the Prophet ﷺ merely because someone narrated it; rather, they subjected every hadith to rigorous scrutiny of both its isnad (the chain of narrators who transmitted it) and its matn (the actual text). To verify the chains, they developed the extraordinary science of 'ilm al-rijal (the science of evaluating the narrators), in which they investigated the life, character, honesty, religious commitment, and precision of memory of every single narrator in every chain. They compiled vast biographical dictionaries documenting the lives and reliability of many thousands of narrators, noting who was trustworthy and precise and who was weak, forgetful, or unreliable. On this basis, they graded hadith into categories: sahih (authentic), hasan (good and acceptable), da'if (weak), and mawdu' (fabricated and to be rejected), according to strict and well-defined conditions concerning the unbroken connection of the chain, the integrity and precision of every narrator, and the absence of hidden defects or contradiction. The great scholar Abdullah ibn al-Mubarak captured the importance of this science when he said: 'The isnad is part of the religion; were it not for the isnad, anyone could say whatever they wished.' Through this painstaking, scientific, and unprecedented effort, the Ummah was able to distinguish the authentic words and deeds of the Prophet ﷺ from anything falsely attributed to him, and to preserve the genuine Sunnah with a reliability no other nation has achieved with its sacred sources. This entire history is a powerful proof of Allah's promise to protect His religion — for the protection of the Qur'an entails the protection of the Sunnah that explains it — and a source of deep confidence for the believer. For the young Muslim today, this topic teaches not only how the Sunnah reached us, but also a sense of responsibility: to honour this preserved trust by learning authentic hadith from reliable sources, by being careful and verifying before sharing any hadith — especially in an age when weak and fabricated narrations spread easily on social media — by avoiding the grave sin of attributing to the Prophet ﷺ what he did not say (about which he warned: 'Whoever lies upon me deliberately, let him take his seat in the Fire' — Bukhari and Muslim), and above all by acting upon the authentic Sunnah that this great Ummah preserved at such cost, out of love and reverence for the Messenger of Allah ﷺ.",
        ar: "بَينَما حَفِظَ السُّنّةَ مُنذُ العَهدِ الأوَّلِ الحِفظُ والكِتابةُ المُنتَقاة، جاءَ مُنعَطَفٌ حاسِمٌ في تَدوينِها الرَّسميِّ معَ الخَليفةِ الأُمَويِّ الرّاشِدِ عُمَرَ بنِ عَبدِ العَزيز (ت ١٠١هـ)، الذي يُعَدُّ خامِسَ الخُلَفاءِ الرّاشِدينَ لِعَدلِهِ وتَقواه. فَلَمّا ذَهَبَ جيلُ الصَّحابةِ وبَدأ العُلَماءُ الأوائِلُ الذينَ حَفِظوا الحَديثَ الكَثيرَ يَموتون، خَشيَ عُمَرُ بنُ عَبدِ العَزيزِ أن يَضيعَ هذا العِلمُ النَّفيسُ أو يَدخُلَهُ الخَطَأ، فاتَّخَذَ القَرارَ التّاريخيَّ بِتَدوينِ السُّنّةِ رَسميًّا. فَكَتَبَ إلى وُلاتِهِ في الأمصارِ وإلى كِبارِ العُلَماء — ومِنهُم أبو بَكرِ بنُ حَزمٍ والإمامُ الكَبيرُ ابنُ شِهابٍ الزُّهريّ — يَأمُرُهُم بِجَمعِ حَديثِ النَّبِيِّ ﷺ وتَمحيصِهِ وكِتابَتِهِ مُنَظَّمًا. فَكانَ هذا بِدايةَ عَصرِ التَّدوينِ الرَّسميِّ لِلسُّنّة، وعُرِفَ الإمامُ الزُّهريُّ بِأنَّهُ مِن أوائِلِ مَن دَوَّنَ الحَديثَ مُنَظَّمًا بِأمرِ الدَّولة. ومِن هُنا اتَّسَعَت كِتابةُ الحَديثِ وتَنظيمُهُ سَريعًا في العالَمِ الإسلاميّ.\n\nوأنتَجَتِ الأجيالُ التّاليةُ كُتُبَ الحَديثِ الكُبرى التي بَقيَت كَنزَ هذه الأُمّة. ومِن أوائِلِها وأهَمِّها المُوَطَّأُ لِلإمامِ مالِكِ بنِ أنَس، أصلٌ جامِعٌ لِلحَديثِ وعَمَلِ أهلِ المَدينة. ثُمَّ جاءَ مُسنَدُ الإمامِ أحمَدَ بنِ حَنبَلٍ العَظيم، مُرَتَّبًا على الرُّواة، يَحوي عَشَراتِ الألوفِ مِنَ الأخبار. لكِنَّ أوثَقَ الكُتُبِ الكُتُبُ السِّتّةُ المَشهورة. وأعلاها الصَّحيحان: صَحيحُ البُخاريِّ، جَمعَهُ الإمامُ مُحَمَّدُ بنُ إسماعيلَ البُخاريُّ بِأشَدِّ شُروطِ الصِّحّة، ويُعَدُّ أصَحَّ الكُتُبِ بَعدَ كِتابِ الله؛ وصَحيحُ مُسلِمٍ، جَمعَهُ الإمامُ مُسلِمُ بنُ الحَجّاج، وهو ثاني الصَّحيحَينِ في الصِّحّة. ويُضافُ إلَيهِما السُّنَنُ الأربَع: سُنَنُ أبي داود، وجامِعُ التِّرمِذيّ، وسُنَنُ النَّسائيّ، وسُنَنُ ابنِ ماجَه. رَحَلَ هؤُلاءِ العُلَماءُ مَسافاتٍ شاسِعة، وفَحَصوا مِئاتِ الألوفِ مِنَ الرِّوايات، وانتَقَوا مِنها ما وافَقَ شُروطَهُمُ الدَّقيقة، فَدَوَّنوا السُّنّةَ الصَّحيحةَ لِكُلِّ الأجيال.\n\nوالذي يَجعَلُ حِفظَ السُّنّةِ عَجيبًا حَقًّا — بل فَريدًا في تاريخِ الأُمَمِ كُلِّها — عِلمُ التَّحَقُّقِ الذي طَوَّرَهُ عُلَماءُ الحَديثِ لِحِمايَتِها مِن أيِّ خَطَإٍ أو وَضع. فَلَم يَقبَلِ العُلَماءُ خَبَرًا يُنسَبُ إلى النَّبِيِّ ﷺ لِمُجَرَّدِ أنَّ أحَدًا رَواه؛ بل أخضَعوا كُلَّ حَديثٍ لِتَمحيصٍ دَقيقٍ لِإسنادِهِ (سِلسِلةِ الرُّواة) ومَتنِهِ (نَصِّه). ولِتَمحيصِ الأسانيدِ طَوَّروا عِلمَ الرِّجالِ العَجيب، يَبحَثونَ حَياةَ كُلِّ راوٍ وخُلُقَهُ وصِدقَهُ ودينَهُ ودِقّةَ حِفظِه. وألَّفوا مَعاجِمَ ضَخمةً تُوَثِّقُ سِيَرَ آلافِ الرُّواةِ وثِقَتَهُم، تُبَيِّنُ مَنِ الثِّقةُ الضّابِطُ ومَنِ الضَّعيفُ النّاسي. وعلى هذا صَنَّفوا الحَديثَ: صَحيحًا، وحَسَنًا مَقبولًا، وضَعيفًا، ومَوضوعًا مَردودًا، بِشُروطٍ دَقيقةٍ مُحَدَّدةٍ في اتِّصالِ السَّنَدِ وعَدالةِ كُلِّ راوٍ وضَبطِهِ وخُلُوِّهِ مِنَ العِلَلِ والشُّذوذ. وعَبَّرَ الإمامُ عَبدُ اللهِ بنُ المُبارَكِ عن أهَمّيّةِ هذا العِلمِ فَقال: «الإسنادُ مِنَ الدّين، ولَولا الإسنادُ لَقالَ مَن شاءَ ما شاء». وبِهذا الجَهدِ المُضني العِلميِّ غَيرِ المَسبوقِ استَطاعَتِ الأُمّةُ أن تُمَيِّزَ أقوالَ النَّبِيِّ ﷺ وأفعالَهُ الصَّحيحةَ مِمّا نُسِبَ إلَيهِ زورًا، وأن تَحفَظَ السُّنّةَ الحَقّةَ بِوَثاقةٍ لم تَبلُغها أُمّةٌ في مَصادِرِها المُقَدَّسة. وهذا التّاريخُ كُلُّهُ دَليلٌ قَويٌّ على وَعدِ اللهِ بِحِفظِ دينِه — فَحِفظُ القُرآنِ يَستَلزِمُ حِفظَ السُّنّةِ المُبَيِّنةِ لَه — ومَصدَرُ ثِقةٍ عَميقةٍ لِلمُؤمِن. ولِلشّابِّ المُسلِمِ اليَومَ يُعَلِّمُ هذا المَوضوعُ، لا كَيفَ وَصَلَتنا السُّنّةُ فَحَسب، بل شُعورًا بِالمَسؤوليّة: أن يَرعى هذه الأمانةَ المَحفوظةَ بِتَعَلُّمِ الحَديثِ الصَّحيحِ مِنَ المَصادِرِ المَوثوقة، وبِالتَّثَبُّتِ قَبلَ نَشرِ أيِّ حَديث — خاصّةً في زَمَنٍ تَنتَشِرُ فيهِ الرِّواياتُ الضَّعيفةُ والمَوضوعةُ بِسُهولةٍ على وَسائِلِ التَّواصُل — وبِاجتِنابِ الإثمِ العَظيمِ في نِسبةِ ما لم يَقُلهُ النَّبِيُّ ﷺ إلَيه (وقد حَذَّرَ: «مَن كَذَبَ علَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار» البخاري ومسلم)، وقَبلَ ذلك كُلِّهِ بِالعَمَلِ بِالسُّنّةِ الصَّحيحةِ التي حَفِظَتها هذه الأُمّةُ العَظيمةُ بِهذا الثَّمَنِ الغالي، حُبًّا لِرَسولِ اللهِ ﷺ وتَعظيمًا لَه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What was the primary means of preserving the Sunnah in the Prophet's era ﷺ?", ar: "ما الوَسيلةُ الأولى لِحِفظِ السُّنّةِ في عَهدِ النَّبِيِّ ﷺ؟" },
      options: [
        { en: "Memorisation, alongside some writing", ar: "الحِفظُ، معَ بَعضِ الكِتابة" },
        { en: "Printing presses", ar: "المَطابِع" },
        { en: "Audio recordings", ar: "التَّسجيلاتُ الصَّوتيّة" },
        { en: "Nothing at all", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "The Companions memorised, and some wrote hadith.", ar: "حَفِظَ الصَّحابةُ وكَتَبَ بَعضُهُمُ الحَديث." },
    },
    {
      prompt: { en: "Why was writing hadith discouraged at first?", ar: "لِمَ كُرِهَت كِتابةُ الحَديثِ أوَّلًا؟" },
      options: [
        { en: "To avoid mixing it with the Qur'an during revelation", ar: "خَشيةَ خَلطِهِ بِالقُرآنِ زَمَنَ النُّزول" },
        { en: "Because hadith was unimportant", ar: "لِأنَّ الحَديثَ غَيرُ مُهِمّ" },
        { en: "Because writing was forbidden forever", ar: "لِأنَّ الكِتابةَ مُحَرَّمةٌ أبَدًا" },
        { en: "There was no reason", ar: "بِلا سَبَب" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ later permitted and ordered writing in many cases.", ar: "أذِنَ النَّبِيُّ ﷺ بَعدُ بِالكِتابةِ وأمَرَ بِها مِرارًا." },
    },
    {
      prompt: { en: "Who ordered the official codification of the Sunnah?", ar: "مَن أمَرَ بِالتَّدوينِ الرَّسميِّ لِلسُّنّة؟" },
      options: [
        { en: "Umar ibn Abdul Aziz", ar: "عُمَرُ بنُ عَبدِ العَزيز" },
        { en: "Harun al-Rashid", ar: "هارونُ الرَّشيد" },
        { en: "Mu'awiyah", ar: "مُعاوية" },
        { en: "Al-Ma'mun", ar: "المَأمون" },
      ],
      correctIndex: 0,
      explanation: { en: "He feared the loss of knowledge and ordered it gathered.", ar: "خَشيَ ذَهابَ العِلمِ فَأمَرَ بِجَمعِه." },
    },
    {
      prompt: { en: "Which are the two most authentic books of hadith?", ar: "ما أصَحُّ كِتابَيِ الحَديث؟" },
      options: [
        { en: "Sahih al-Bukhari and Sahih Muslim", ar: "صَحيحُ البُخاريِّ وصَحيحُ مُسلِم" },
        { en: "Two poetry books", ar: "كِتابا شِعر" },
        { en: "Two history books", ar: "كِتابا تاريخ" },
        { en: "Books of philosophy", ar: "كُتُبُ فَلسَفة" },
      ],
      correctIndex: 0,
      explanation: { en: "They are the most authentic books after the Qur'an.", ar: "هُما أصَحُّ الكُتُبِ بَعدَ القُرآن." },
    },
    {
      prompt: { en: "What is 'ilm al-rijal?", ar: "ما عِلمُ الرِّجال؟" },
      options: [
        { en: "The science of evaluating the narrators of hadith", ar: "عِلمُ تَقييمِ رُواةِ الحَديث" },
        { en: "The study of geography", ar: "دِراسةُ الجُغرافيا" },
        { en: "The study of poetry", ar: "دِراسةُ الشِّعر" },
        { en: "A type of prayer", ar: "نَوعُ صَلاة" },
      ],
      correctIndex: 0,
      explanation: { en: "Scholars examined each narrator's honesty and precision.", ar: "فَحَصَ العُلَماءُ صِدقَ كُلِّ راوٍ وضَبطَه." },
    },
    {
      prompt: { en: "True or False: Lying about the Prophet ﷺ is a grave sin.", ar: "صَوابٌ أم خَطأ: الكَذِبُ على النَّبِيِّ ﷺ إثمٌ عَظيم." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "'Whoever lies upon me deliberately, let him take his seat in the Fire' (Bukhari, Muslim).", ar: "«مَن كَذَبَ علَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار» (البخاري ومسلم)." },
    },
  ],
};
