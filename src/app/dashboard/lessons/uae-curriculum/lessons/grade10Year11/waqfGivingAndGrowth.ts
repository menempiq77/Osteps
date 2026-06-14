import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const waqfGivingAndGrowth: CourseLesson = {
  slug: "g10y11-waqf-as-giving-and-growth",
  name: { en: "Waqf as Giving and Growth", ar: "الوَقفُ عَطاءٌ ونَماء" },
  shortIntro: {
    en: "Waqf (endowment) is one of the noblest forms of giving in Islam: a believer dedicates a lasting asset so that its benefit flows to people continuously, earning ongoing reward (sadaqah jariyah). This lesson studies the meaning, evidence, types, and civilisational impact of waqf as a source of both spiritual and social growth.",
    ar: "الوَقفُ مِن أنبَلِ صُوَرِ العَطاءِ في الإسلام: يُخَصِّصُ المُؤمِنُ أصلًا دائِمًا لِيَجريَ نَفعُهُ لِلنّاسِ مُستَمِرًّا، فَيَنالَ أجرًا مُتَّصِلًا (صَدَقةً جارِية). يَدرُسُ هذا الدَّرسُ مَعنى الوَقفِ وأدِلَّتَهُ وأنواعَهُ وأثَرَهُ الحَضاريَّ مَصدَرًا لِلنَّماءِ الرّوحيِّ والاجتِماعيّ.",
  },
  quranSurahs: ["Aal-Imran 92", "Al-Baqarah 261"],
  sections: [
    {
      title: { en: "The meaning and reward of waqf", ar: "مَعنى الوَقفِ وأجرُه" },
      learningObjectives: [
        { en: "Define waqf and explain it as ongoing charity.", ar: "أُعَرِّفُ الوَقفَ وأشرَحُهُ صَدَقةً جارِية." },
        { en: "Cite the evidence for waqf from Qur'an and Sunnah.", ar: "أستَدِلُّ لِلوَقفِ مِنَ القُرآنِ والسُّنّة." },
      ],
      successCriteria: [
        { en: "I can explain the concept of sadaqah jariyah.", ar: "أشرَحُ مَفهومَ الصَّدَقةِ الجارِية." },
        { en: "I can give the example of Umar's endowment.", ar: "أذكُرُ مِثالَ وَقفِ عُمَر." },
      ],
      image: {
        src: IMG.waterfall,
        alt: { en: "Flowing water — like a waqf whose benefit flows on continuously.", ar: "ماءٌ جارٍ — كَالوَقفِ يَجري نَفعُهُ مُستَمِرًّا." },
        caption: { en: "'Never will you attain righteousness until you spend from what you love' (Aal-Imran 92).", ar: "﴿لَن تَنالوا البِرَّ حَتّى تُنفِقوا مِمّا تُحِبّون﴾ (آل عمران ٩٢)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How can your good deeds keep growing after you die?", ar: "كَيفَ تَستَمِرُّ حَسَناتُكَ في النَّماءِ بَعدَ مَوتِك؟" },
        body: {
          en: "When a person dies, their deeds normally come to an end — except for a few that keep earning reward long after they are gone. Waqf is one of the greatest of these: an asset given once whose benefit flows to people for years, even centuries, with the reward returning continuously to the one who gave it. Reflect: what lasting good could you set in motion that would keep benefiting people — and earning you reward — long after your lifetime?",
          ar: "إذا ماتَ الإنسانُ انقَطَعَ عَمَلُهُ عادةً — إلّا قَليلًا يَستَمِرُّ أجرُهُ بَعدَ رَحيلِهِ بِزَمَن. والوَقفُ مِن أعظَمِها: أصلٌ يُعطى مَرّةً يَجري نَفعُهُ لِلنّاسِ سِنينَ بل قُرونًا، والأجرُ يَعودُ مُتَّصِلًا إلى صاحِبِه. تَأمَّل: أيَّ خَيرٍ باقٍ يُمكِنُكَ أن تَزرَعَهُ فَيَظَلَّ يَنفَعُ النّاسَ — ويَأجُرُكَ — طَويلًا بَعدَ حَياتِك؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Waqf (وَقف): dedicating a lasting asset so its benefit flows to others permanently.", ar: "الوَقف: حَبسُ أصلٍ دائِمٍ وتَسبيلُ مَنفَعَتِهِ لِلنّاس." },
            { en: "Sadaqah jariyah (صَدَقةٌ جارِية): ongoing charity that keeps earning reward.", ar: "صَدَقةٌ جارِية: عَطاءٌ مُستَمِرٌّ يَجري أجرُه." },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "When a person dies their deeds end except three, including ongoing charity (Muslim).", ar: "إذا ماتَ الإنسانُ انقَطَعَ عَمَلُهُ إلّا ثَلاثًا، مِنها صَدَقةٌ جارِية (مسلم)." },
          ],
        },
      ],
      body: {
        en: "Waqf, often translated as an Islamic endowment, is one of the most beautiful and far-reaching institutions of charity in Islam. Linguistically, waqf means to hold or restrain something; in the terminology of the Shari'ah, it means to dedicate a lasting asset — such as land, a building, a well, a date-palm grove, books, or money invested productively — in such a way that the asset itself is held permanently (it is not sold, given away, or inherited), while its benefit and produce flow continuously to a charitable purpose: the poor, students, travellers, mosques, hospitals, or any good cause. In this way, a single act of giving becomes a permanent fountain of benefit that keeps flowing for years, generations, or even centuries. This is why waqf is the highest example of what the Prophet ﷺ called sadaqah jariyah — ongoing charity. He said: 'When a person dies, his deeds come to an end except for three: ongoing charity (sadaqah jariyah), beneficial knowledge, or a righteous child who prays for him' (Muslim). A waqf is precisely such an ongoing charity: long after the giver has died, the well still gives water, the school still teaches, the hospital still heals, and the reward continues to return to them in their grave.\n\nThe foundation of waqf rests on the broad and powerful encouragement of charitable giving found throughout the Qur'an and Sunnah, and on specific guidance from the Prophet ﷺ. Allah ties true righteousness to giving from what we love: 'Never will you attain righteousness until you spend from that which you love. And whatever you spend — indeed, Allah is Knowing of it' (Aal-Imran 92). And He describes the immense multiplication of reward for charity: 'The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains. And Allah multiplies for whom He wills' (Al-Baqarah 261). Waqf is charity in its most lasting and fruitful form, and so it shares most fully in this multiplied, growing reward. The specific practice of waqf was established directly by the guidance of the Prophet ﷺ. The famous foundational example is that of Umar ibn al-Khattab (may Allah be pleased with him), who acquired a valuable piece of land at Khaybar and came to the Prophet ﷺ asking how best to use it for good. The Prophet ﷺ advised him: 'If you wish, you may hold the property as an endowment and give its produce in charity.' So Umar dedicated it as a waqf — the land itself could not be sold, gifted, or inherited, while its fruits were given in charity to the poor, relatives, the freeing of slaves, travellers, and guests (Bukhari and Muslim). This became the model for the entire institution of waqf in Islam.\n\nThe spiritual meaning of waqf is profound. It embodies the truth that real wealth is not what we hoard for ourselves, but what we send ahead for the Hereafter; that giving from what we love purifies the soul from greed and attachment to the world; and that the wisest investment a believer can make is one whose returns continue into eternal life. Waqf transforms a temporary, perishable worldly asset into a permanent, growing store of reward with Allah. It teaches the believer to think beyond their own lifetime, to plant trees whose shade they may never sit under, and to be a source of lasting good for people they will never meet. In this sense, waqf is both giving (ata') — a generous gift to the community — and growth (nama') — a continuously growing reward for the giver and a continuously growing benefit for society. In the next section, we examine the types of waqf and its remarkable impact in building Islamic civilisation.",
        ar: "الوَقفُ مِن أجمَلِ مُؤَسَّساتِ العَطاءِ في الإسلامِ وأبعَدِها أثَرًا. والوَقفُ لُغةً الحَبسُ والمَنع؛ وفي اصطِلاحِ الشَّرعِ تَخصيصُ أصلٍ دائِمٍ — كَأرضٍ أو بِناءٍ أو بِئرٍ أو بُستانِ نَخلٍ أو كُتُبٍ أو مالٍ مُستَثمَر — على وَجهٍ يُحبَسُ فيهِ الأصلُ نَفسُهُ دائِمًا (فَلا يُباعُ ولا يُوهَبُ ولا يورَث)، وتَجري مَنفَعَتُهُ وثَمَرَتُهُ مُستَمِرّةً في وَجهٍ خَيريّ: الفُقَراءِ، أوِ الطَّلَبة، أوِ المُسافِرين، أوِ المَساجِد، أوِ المُستَشفَيات، أو أيِّ وَجهِ بِرّ. فَيَصيرُ العَطاءُ الواحِدُ نَبعَ خَيرٍ دائِمًا يَجري سِنينَ وأجيالًا بل قُرونًا. ولِهذا كانَ الوَقفُ أعلى مِثالٍ لِما سَمّاهُ النَّبِيُّ ﷺ صَدَقةً جارِية. قال: «إذا ماتَ الإنسانُ انقَطَعَ عَنهُ عَمَلُهُ إلّا مِن ثَلاث: صَدَقةٍ جارِية، أو عِلمٍ يُنتَفَعُ بِه، أو وَلَدٍ صالِحٍ يَدعو لَه» (مسلم). والوَقفُ صَدَقةٌ جارِيةٌ بِعَينِها: فَبَعدَ مَوتِ الواقِفِ بِزَمَنٍ طَويلٍ ما زالَتِ البِئرُ تَسقي، والمَدرَسةُ تُعَلِّم، والمُستَشفى يُداوي، والأجرُ يَعودُ إلَيهِ في قَبرِه.\n\nويَقومُ الوَقفُ على التَّرغيبِ الواسِعِ القَويِّ في الإنفاقِ في القُرآنِ والسُّنّة، وعلى تَوجيهٍ خاصٍّ مِنَ النَّبِيِّ ﷺ. يَربِطُ اللهُ البِرَّ الحَقَّ بِالإنفاقِ مِمّا نُحِبّ: ﴿لَن تَنالوا البِرَّ حَتّى تُنفِقوا مِمّا تُحِبّونَ وما تُنفِقوا مِن شَيءٍ فَإنَّ اللهَ بِهِ عَليم﴾ (آل عمران ٩٢). ويَصِفُ مُضاعَفةَ أجرِ الصَّدَقةِ العَظيمة: ﴿مَثَلُ الذينَ يُنفِقونَ أموالَهُم في سَبيلِ اللهِ كَمَثَلِ حَبّةٍ أنبَتَت سَبعَ سَنابِلَ في كُلِّ سُنبُلةٍ مِئةُ حَبّةٍ واللهُ يُضاعِفُ لِمَن يَشاء﴾ (البقرة ٢٦١). والوَقفُ صَدَقةٌ في أبقى صُوَرِها وأثمَرِها، فَهو أوفَرُ نَصيبًا مِن هذا الأجرِ المُضاعَفِ النّامي. وثَبَتَ الوَقفُ بِتَوجيهِ النَّبِيِّ ﷺ مُباشَرة. والمِثالُ التَّأسيسيُّ المَشهورُ وَقفُ عُمَرَ بنِ الخَطّابِ (رَضِيَ اللهُ عَنه)، إذ أصابَ أرضًا نَفيسةً بِخَيبَرَ فَأتى النَّبِيَّ ﷺ يَسألُهُ كَيفَ يَستَعمِلُها في الخَير. فَأرشَدَهُ النَّبِيُّ ﷺ: «إن شِئتَ حَبَستَ أصلَها وتَصَدَّقتَ بِها». فَوَقَفَها عُمَرُ — لا يُباعُ أصلُها ولا يوهَبُ ولا يورَث، وتُتَصَدَّقُ ثَمَرَتُها على الفُقَراءِ والقُربى وفي الرِّقابِ وابنِ السَّبيلِ والضَّيف (البخاري ومسلم). فَصارَ هذا نَموذَجًا لِمُؤَسَّسةِ الوَقفِ كُلِّها في الإسلام.\n\nومَعنى الوَقفِ الرّوحيُّ عَميق. فَهو يُجَسِّدُ حَقيقةَ أنَّ الغِنى الحَقَّ لَيسَ ما نَكنِزُهُ لِأنفُسِنا بل ما نُقَدِّمُهُ لِلآخِرة؛ وأنَّ الإنفاقَ مِمّا نُحِبُّ يُطَهِّرُ النَّفسَ مِنَ الشُّحِّ والتَّعَلُّقِ بِالدُّنيا؛ وأنَّ أحكَمَ استِثمارٍ لِلمُؤمِنِ ما تَستَمِرُّ عائِداتُهُ إلى الحَياةِ الباقِية. والوَقفُ يُحَوِّلُ أصلًا دُنيَويًّا زائِلًا إلى ذُخرٍ دائِمٍ نامٍ مِنَ الأجرِ عِندَ الله. ويُعَلِّمُ المُؤمِنَ أن يُفَكِّرَ أبعَدَ مِن عُمرِه، وأن يَغرِسَ شَجَرًا قد لا يَجلِسُ في ظِلِّه، وأن يَكونَ مَصدَرَ خَيرٍ باقٍ لِأُناسٍ لَن يَلقاهُم. فالوَقفُ بِهذا عَطاءٌ — هِبةٌ كَريمةٌ لِلمُجتَمَع — ونَماءٌ — أجرٌ مُتَنامٍ لِلواقِفِ ونَفعٌ مُتَنامٍ لِلمُجتَمَع. وفي القِسمِ التّالي نَتَناوَلُ أنواعَ الوَقفِ وأثَرَهُ البالِغَ في بِناءِ الحَضارةِ الإسلاميّة.",
      },
    },
    {
      title: { en: "Types of waqf and its civilisational impact", ar: "أنواعُ الوَقفِ وأثَرُهُ الحَضاريّ" },
      learningObjectives: [
        { en: "Distinguish charitable and family waqf.", ar: "أُمَيِّزُ الوَقفَ الخَيريَّ والذُّرّيّ." },
        { en: "Explain the role of waqf in building society.", ar: "أشرَحُ دَورَ الوَقفِ في بِناءِ المُجتَمَع." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A great mosque — many were built and maintained by waqf.", ar: "مَسجِدٌ عَظيم — بُنِيَ كَثيرٌ مِنها وحُفِظَ بِالوَقف." },
        caption: { en: "Endowments built mosques, schools, hospitals, and wells.", ar: "بَنَتِ الأوقافُ المَساجِدَ والمَدارِسَ والمُستَشفَياتِ والآبار." },
      },
      groupTasks: {
        title: { en: "Giving that builds a civilisation", ar: "عَطاءٌ يَبني حَضارة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "types-of-waqf",
            name: { en: "Team A — Types and rules of waqf", ar: "الفَريقُ أ — أنواعُ الوَقفِ وأحكامُه" },
            learningObjective: { en: "Present the types and basic rules of waqf.", ar: "نَعرِضُ أنواعَ الوَقفِ وأحكامَهُ الأساسيّة." },
            task: { en: "Present the main types of waqf and its basic rules. Charitable waqf (waqf khayri) dedicates the benefit directly to public good causes (mosques, schools, the poor, hospitals, wells). Family/offspring waqf (waqf dhurri/ahli) directs the benefit first to one's descendants and family, then ultimately to charity, providing for one's family in a lasting, protected way. Explain the basic conditions: the asset must be lawfully owned and lasting, the purpose must be a good and lawful one, and once made the waqf is binding and the asset is held permanently. Present a 'types and rules of waqf' chart with examples.", ar: "اعرِضوا أنواعَ الوَقفِ الرَّئيسةَ وأحكامَهُ الأساسيّة. الوَقفُ الخَيريُّ يُسَبِّلُ نَفعَهُ مُباشَرةً لِوُجوهِ البِرِّ العامّةِ (المَساجِد، المَدارِس، الفُقَراء، المُستَشفَيات، الآبار). والوَقفُ الذُّرّيُّ/الأهليُّ يُوَجِّهُ نَفعَهُ أوَّلًا لِلذُّرّيّةِ والأهل، ثُمَّ يَؤولُ آخِرًا إلى الخَير، فَيَكفُلُ الأهلَ كِفايةً باقيةً مَحفوظة. اشرَحوا الشُّروطَ الأساسيّة: أن يَكونَ الأصلُ مَملوكًا حَلالًا دائِمًا، والوَجهُ بِرًّا مَشروعًا، وأنَّ الوَقفَ متى تَمَّ لَزِمَ وحُبِسَ أصلُهُ دائِمًا. اعرِضوا جَدوَلَ «أنواعِ الوَقفِ وأحكامِه» بِأمثِلة." },
            evidence: [
              { en: "Umar's waqf served relatives, the poor, travellers, and guests.", ar: "خَدَمَ وَقفُ عُمَرَ القُربى والفُقَراءَ وابنَ السَّبيلِ والضَّيف." },
            ],
            sourceNotes: [
              { en: "The asset is held; only its benefit is given.", ar: "يُحبَسُ الأصل، ويُعطى نَفعُهُ فَقَط." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'types and rules of waqf' chart.", ar: "جَدوَلُ «أنواعِ الوَقفِ وأحكامِه»." },
          },
          {
            slug: "impact-of-waqf",
            name: { en: "Team B — Waqf and civilisation", ar: "الفَريقُ ب — الوَقفُ والحَضارة" },
            learningObjective: { en: "Present the civilisational impact of waqf.", ar: "نَعرِضُ الأثَرَ الحَضاريَّ لِلوَقف." },
            task: { en: "Present the remarkable role waqf played in building Islamic civilisation. For centuries, endowments funded and maintained mosques, great libraries and schools, universities, hospitals that treated the poor for free, wells and water fountains, bridges and roads, shelters for travellers and the needy, and even care for animals. Waqf created a vast, self-sustaining network of social welfare and public services centuries before modern states. Connect this to today: how can the institution of waqf, and its spirit of lasting giving, address the needs of Muslim communities now (endowments for education, healthcare, orphans, scientific research)? Present an 'endowments that built a civilisation' display, including the UAE's living tradition of charitable giving.", ar: "اعرِضوا الدَّورَ البالِغَ الذي أدّاهُ الوَقفُ في بِناءِ الحَضارةِ الإسلاميّة. فَلِقُرونٍ مَوَّلَتِ الأوقافُ وحَفِظَتِ المَساجِدَ، والمَكتَباتِ والمَدارِسَ الكُبرى، والجامِعات، والمُستَشفَياتِ التي تُداوي الفُقَراءَ مَجّانًا، والآبارَ والسِّقايات، والجُسورَ والطُّرُق، ومَأوى المُسافِرينَ والمُحتاجين، حَتّى رِعايةَ الحَيَوان. وأنشَأ الوَقفُ شَبَكةً واسِعةً مُكتَفيةً مِنَ الرِّعايةِ الاجتِماعيّةِ والخِدماتِ العامّةِ قَبلَ الدُّوَلِ الحَديثةِ بِقُرون. اربِطوا ذلك بِاليَوم: كَيفَ يُمكِنُ لِلوَقفِ ورُوحِ العَطاءِ الباقي أن يُلَبِّيَ حاجاتِ المُجتَمَعاتِ المُسلِمةِ الآنَ (أوقافِ التَّعليمِ والصِّحّةِ والأيتامِ والبَحثِ العِلميّ)؟ اعرِضوا لَوحةَ «أوقافٌ بَنَت حَضارة»، معَ تَقليدِ الإمارات الحَيِّ في العَطاءِ الخَيريّ." },
            evidence: [
              { en: "Endowments sustained hospitals, schools, and services for centuries.", ar: "أدامَتِ الأوقافُ المُستَشفَياتِ والمَدارِسَ والخِدماتِ قُرونًا." },
            ],
            sourceNotes: [
              { en: "Waqf is a model of sustainable, faith-driven welfare.", ar: "الوَقفُ نَموذَجٌ لِرِعايةٍ مُستَدامةٍ بِدافِعِ الإيمان." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "An 'endowments that built a civilisation' display.", ar: "لَوحةُ «أوقافٌ بَنَت حَضارة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "A lasting good I can begin", ar: "خَيرٌ باقٍ أبدَؤه" },
        prompt: { en: "Waqf teaches that the best giving is the kind that keeps benefiting people and earning reward long after the giver is gone. You may not own land or wealth yet, but the spirit of waqf — lasting, selfless giving — can begin now. Reflect: what ongoing good could you contribute to (sharing beneficial knowledge, helping maintain a mosque or library, supporting a charity, planting trees, or saving toward a future endowment)? Write about one lasting good you will work toward, and how the idea of sadaqah jariyah changes the way you think about giving.", ar: "يُعَلِّمُ الوَقفُ أنَّ أفضَلَ العَطاءِ ما يَظَلُّ يَنفَعُ النّاسَ ويَجري أجرُهُ بَعدَ رَحيلِ صاحِبِهِ بِزَمَن. قد لا تَملِكُ أرضًا أو مالًا بَعد، لكِنَّ رُوحَ الوَقفِ — العَطاءَ الباقيَ المُجَرَّدَ — تَبدَأُ الآن. تَأمَّل: أيَّ خَيرٍ مُستَمِرٍّ يُمكِنُكَ أن تُسهِمَ فيه (نَشرِ عِلمٍ نافِع، أوِ الإعانةِ على رِعايةِ مَسجِدٍ أو مَكتَبة، أو دَعمِ جَمعيّةِ خَير، أو غَرسِ شَجَر، أوِ الادِّخارِ لِوَقفٍ مُستَقبَليّ)؟ اكتُب خَيرًا باقيًا واحِدًا سَتَسعى إلَيه، وكَيفَ تُغَيِّرُ فِكرةُ الصَّدَقةِ الجارِيةِ نَظرَتَكَ لِلعَطاء." },
        placeholder: { en: "A lasting good I will work toward is... The idea of sadaqah jariyah changes my giving by...", ar: "خَيرٌ باقٍ سَأسعى إلَيهِ هو... وفِكرةُ الصَّدَقةِ الجارِيةِ تُغَيِّرُ عَطائي بِـ..." },
      },
      body: {
        en: "Building on the meaning and reward of waqf, the scholars classified endowments into two main types, each serving a noble purpose. The first is the charitable endowment (waqf khayri), in which the benefit of the asset is dedicated directly to a public good cause from the beginning — for example, dedicating a building as a mosque, an income-producing property to fund a school or hospital, a well to provide water, or land whose produce feeds the poor. This is the most visible and widely known form of waqf, and it directly serves the community and the public welfare. The second is the family or offspring endowment (waqf dhurri or ahli), in which the giver dedicates the benefit first to their own descendants and family — to provide for them in a lasting and protected way that cannot be squandered or seized — with the stipulation that when the line of beneficiaries eventually ends, the benefit passes permanently to a charitable cause. This combines care for one's family with eventual public charity. In both types, the essential principle is the same: the asset itself is held permanently and cannot be sold, gifted, or inherited, while its benefit flows to the designated purpose. For a waqf to be valid, the asset must be something the person lawfully owns and that lasts (so its benefit can continue), and it must be dedicated to a purpose that is good and lawful in Islam; once validly made, the endowment becomes binding and irreversible.\n\nThe historical impact of waqf on Islamic civilisation is nothing short of extraordinary, and it stands as one of the greatest practical expressions of Islam's social vision. For more than a thousand years, the system of awqaf (endowments) created and sustained a vast network of services and institutions that benefited rich and poor alike, funded not by taxes or governments but by the voluntary, faith-driven generosity of believers seeking the pleasure of Allah. Endowments built and maintained countless mosques where people prayed and learned. They funded great libraries and schools, and famous centres of learning and universities that preserved and advanced knowledge in every field. They established hospitals that treated the sick — including the poor — free of charge, complete with doctors, medicines, and care. They dug wells and built fountains, canals, bridges, and roads. They provided shelter, food, and support for travellers, the poor, orphans, and widows. There were even endowments dedicated to caring for stray and elderly animals, to providing dowries for poor brides, and to countless other acts of mercy. In this way, waqf wove charity into the very fabric of Islamic society and built a self-sustaining civilisation of giving, centuries before the modern concept of social welfare existed.\n\nThis remarkable legacy carries powerful lessons for Muslims today. It shows that Islam does not view giving as an occasional, individual act alone, but as a system capable of building and sustaining the welfare of an entire civilisation. It teaches that the believer's wealth is a trust from Allah, meant to be invested in lasting good rather than hoarded or wasted on the fleeting pleasures of this world. And it inspires the revival of the spirit and institution of waqf in our own time, to meet the great needs of Muslim communities: endowments for education and scholarships, for healthcare and the care of orphans, for scientific research and the building of beneficial institutions, and for relief of the poor and suffering. The United Arab Emirates continues this noble tradition through its strong culture of charitable giving and humanitarian endowments at home and around the world. For the young Muslim, the lesson of waqf is both inspiring and practical: that the greatest and wisest giving is the giving that lasts; that true growth (nama') comes not from hoarding wealth but from spending it in the way of Allah, where it multiplies as both reward in the Hereafter and benefit in this world; and that even now, in small ways, one can begin to live the spirit of waqf — contributing to lasting good, sharing beneficial knowledge, supporting good causes, and aspiring to leave behind a flowing charity whose benefit, by the mercy of Allah, will continue long after one's own life has ended.",
        ar: "بِناءً على مَعنى الوَقفِ وأجرِه، صَنَّفَ العُلَماءُ الأوقافَ نَوعَينِ رَئيسَين، كُلٌّ لِغايةٍ نَبيلة. الأوَّلُ الوَقفُ الخَيريّ، وفيهِ يُسَبَّلُ نَفعُ الأصلِ مُباشَرةً لِوَجهِ بِرٍّ عامٍّ مِنَ البِداية — كَجَعلِ بِناءٍ مَسجِدًا، أو عَقارٍ مُغِلٍّ لِتَمويلِ مَدرَسةٍ أو مُستَشفى، أو بِئرٍ لِلسَّقي، أو أرضٍ تُطعِمُ ثَمَرَتُها الفُقَراء. وهو أظهَرُ صُوَرِ الوَقفِ وأشهَرُها، ويَخدِمُ المُجتَمَعَ والمَصلَحةَ العامّةَ مُباشَرة. والثّاني الوَقفُ الذُّرّيُّ أوِ الأهليّ، وفيهِ يُسَبِّلُ الواقِفُ النَّفعَ أوَّلًا لِذُرِّيَّتِهِ وأهلِه — كِفايةً باقيةً مَحفوظةً لا تُبَدَّدُ ولا تُنتَزَع — معَ شَرطِ أنَّهُ متى انقَطَعَ المُستَحِقّونَ آلَ النَّفعُ دائِمًا إلى وَجهِ بِرّ. فَيَجمَعُ بَينَ رِعايةِ الأهلِ والخَيرِ العامِّ آخِرًا. وفي النَّوعَينِ الأصلُ واحِد: يُحبَسُ الأصلُ دائِمًا فَلا يُباعُ ولا يوهَبُ ولا يورَث، ويَجري نَفعُهُ لِلوَجهِ المُعَيَّن. ولِصِحّةِ الوَقفِ يَجِبُ أن يَكونَ الأصلُ مَملوكًا حَلالًا باقيًا (لِيَدومَ نَفعُه)، وأن يَكونَ الوَجهُ بِرًّا مَشروعًا في الإسلام؛ ومتى صَحَّ الوَقفُ لَزِمَ ولم يُرجَع فيه.\n\nوأثَرُ الوَقفِ التّاريخيُّ في الحَضارةِ الإسلاميّةِ عَظيمٌ حَقًّا، وهو مِن أعظَمِ التَّطبيقاتِ العَمَليّةِ لِرُؤيةِ الإسلامِ الاجتِماعيّة. فَلِأكثَرَ مِن ألفِ عام، أنشَأ نِظامُ الأوقافِ وأدامَ شَبَكةً واسِعةً مِنَ الخِدماتِ والمُؤَسَّساتِ نَفَعَتِ الغَنيَّ والفَقيرَ سَواء، مَوَّلَها لا الضَّرائِبُ ولا الحُكوماتُ بل سَخاءُ المُؤمِنينَ الطَّوعيُّ بِدافِعِ الإيمانِ طَلَبًا لِرِضا الله. بَنَتِ الأوقافُ وحَفِظَت مَساجِدَ لا تُحصى يُصَلّي فيها النّاسُ ويَتَعَلَّمون. ومَوَّلَتِ المَكتَباتِ والمَدارِسَ الكُبرى، والمَراكِزَ والجامِعاتِ الشَّهيرةَ التي حَفِظَتِ العِلمَ ونَهَضَت بِهِ في كُلِّ فَنّ. وأقامَتِ المُستَشفَياتِ التي تُداوي المَرضى — والفُقَراءَ — مَجّانًا، بِأطِبّاءَ وأدويةٍ ورِعاية. وحَفَرَتِ الآبارَ وأقامَتِ السِّقاياتِ والقَنَواتِ والجُسورَ والطُّرُق. ووَفَّرَتِ المَأوى والطَّعامَ والعَونَ لِلمُسافِرينَ والفُقَراءِ والأيتامِ والأرامِل. بل كانَت هُناكَ أوقافٌ لِرِعايةِ الحَيَواناتِ الضّالّةِ والمُسِنّة، ولِتَجهيزِ الفَقيراتِ لِلزَّواج، ولِأعمالِ رَحمةٍ لا تُعَدّ. وهكَذا نَسَجَ الوَقفُ الخَيرَ في نَسيجِ المُجتَمَعِ الإسلاميّ، وبَنى حَضارةَ عَطاءٍ مُكتَفيةً قَبلَ مَفهومِ الرِّعايةِ الاجتِماعيّةِ الحَديثِ بِقُرون.\n\nويَحمِلُ هذا الإرثُ العَظيمُ دُروسًا قَويّةً لِلمُسلِمينَ اليَوم. فَهو يُبَيِّنُ أنَّ الإسلامَ لا يَرى العَطاءَ مُجَرَّدَ عَمَلٍ فَرديٍّ عابِرٍ فَحَسب، بل نِظامًا قادِرًا على بِناءِ رِعايةِ حَضارةٍ كامِلةٍ وإدامَتِها. ويُعَلِّمُ أنَّ مالَ المُؤمِنِ أمانةٌ مِنَ الله، يُستَثمَرُ في خَيرٍ باقٍ لا يُكنَزُ ولا يُبَدَّدُ في مَتاعِ الدُّنيا الزّائِل. ويُلهِمُ إحياءَ رُوحِ الوَقفِ ومُؤَسَّسَتِهِ في زَمانِنا، لِسَدِّ حاجاتِ المُجتَمَعاتِ المُسلِمةِ الكُبرى: أوقافِ التَّعليمِ والمِنَح، والصِّحّةِ ورِعايةِ الأيتام، والبَحثِ العِلميِّ وبِناءِ المُؤَسَّساتِ النّافِعة، وإغاثةِ الفُقَراءِ والمَنكوبين. وتُواصِلُ الإماراتُ العَرَبيّةُ المُتَّحِدةُ هذا التَّقليدَ النَّبيلَ بِثَقافَتِها الرّاسِخةِ في العَطاءِ الخَيريِّ والأوقافِ الإنسانيّةِ في الدّاخِلِ والعالَم. ولِلشّابِّ المُسلِمِ في دَرسِ الوَقفِ إلهامٌ وعَمَلٌ مَعًا: أنَّ أعظَمَ العَطاءِ وأحكَمَهُ ما يَبقى؛ وأنَّ النَّماءَ الحَقَّ لا يَأتي مِن كَنزِ المالِ بل مِن إنفاقِهِ في سَبيلِ اللهِ حَيثُ يُضاعَفُ أجرًا في الآخِرةِ ونَفعًا في الدُّنيا؛ وأنَّهُ يَستَطيعُ الآنَ، في أمورٍ صَغيرة، أن يَبدَأَ بِعَيشِ رُوحِ الوَقف — يُسهِمُ في خَيرٍ باقٍ، ويَنشُرُ عِلمًا نافِعًا، ويَدعَمُ وُجوهَ الخَير، ويَطمَحُ أن يُخَلِّفَ صَدَقةً جارِيةً يَستَمِرُّ نَفعُها — بِرَحمةِ الله — طَويلًا بَعدَ انقِضاءِ حَياتِه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is waqf?", ar: "ما الوَقف؟" },
      options: [
        { en: "Dedicating a lasting asset so its benefit flows to others permanently", ar: "حَبسُ أصلٍ دائِمٍ وتَسبيلُ نَفعِهِ لِلنّاسِ دائِمًا" },
        { en: "Selling property quickly", ar: "بَيعُ المُلكِ سَريعًا" },
        { en: "A type of prayer", ar: "نَوعُ صَلاة" },
        { en: "A loan that must be repaid", ar: "قَرضٌ يُرَدّ" },
      ],
      correctIndex: 0,
      explanation: { en: "The asset is held; its benefit is given continuously.", ar: "يُحبَسُ الأصل، ويُعطى نَفعُهُ مُستَمِرًّا." },
    },
    {
      prompt: { en: "Why is waqf a great example of sadaqah jariyah?", ar: "لِمَ كانَ الوَقفُ مِثالًا عَظيمًا لِلصَّدَقةِ الجارِية؟" },
      options: [
        { en: "Its reward continues after the giver dies", ar: "يَستَمِرُّ أجرُهُ بَعدَ مَوتِ الواقِف" },
        { en: "It must be repaid", ar: "يَجِبُ رَدُّه" },
        { en: "It ends at death", ar: "يَنتَهي بِالمَوت" },
        { en: "It is only for the rich", ar: "لِلأغنياءِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Deeds end at death except three, including ongoing charity (Muslim).", ar: "يَنقَطِعُ العَمَلُ إلّا ثَلاثًا مِنها صَدَقةٌ جارِية (مسلم)." },
    },
    {
      prompt: { en: "Whose famous endowment is the model of waqf?", ar: "وَقفُ مَنِ النَّموذَجُ المَشهور؟" },
      options: [
        { en: "Umar ibn al-Khattab's land at Khaybar", ar: "أرضُ عُمَرَ بنِ الخَطّابِ بِخَيبَر" },
        { en: "A Roman emperor's palace", ar: "قَصرُ إمبراطورٍ رومانيّ" },
        { en: "A merchant's ship", ar: "سَفينةُ تاجِر" },
        { en: "No one's", ar: "لا أحَد" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ advised him to hold the land and give its produce.", ar: "أرشَدَهُ النَّبِيُّ ﷺ أن يَحبِسَ الأصلَ ويَتَصَدَّقَ بِالثَّمَرة." },
    },
    {
      prompt: { en: "What are the two main types of waqf?", ar: "ما نَوعا الوَقفِ الرَّئيسان؟" },
      options: [
        { en: "Charitable (khayri) and family/offspring (dhurri)", ar: "الخَيريُّ والذُّرّيُّ (الأهليّ)" },
        { en: "Cash and credit", ar: "النَّقديُّ والآجِل" },
        { en: "Big and small", ar: "الكَبيرُ والصَّغير" },
        { en: "New and old", ar: "الجَديدُ والقَديم" },
      ],
      correctIndex: 0,
      explanation: { en: "Khayri serves the public; dhurri serves family then charity.", ar: "الخَيريُّ لِلعامّة، والذُّرّيُّ لِلأهلِ ثُمَّ الخَير." },
    },
    {
      prompt: { en: "What did waqf build in Islamic civilisation?", ar: "ماذا بَنى الوَقفُ في الحَضارةِ الإسلاميّة؟" },
      options: [
        { en: "Mosques, schools, hospitals, wells, and welfare services", ar: "المَساجِدَ والمَدارِسَ والمُستَشفَياتِ والآبارَ وخِدماتِ الرِّعاية" },
        { en: "Only palaces for kings", ar: "قُصورَ المُلوكِ فَقَط" },
        { en: "Nothing lasting", ar: "لا شَيءَ باقيًا" },
        { en: "Weapons only", ar: "السِّلاحَ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Endowments sustained a vast network of public services.", ar: "أدامَتِ الأوقافُ شَبَكةً واسِعةً مِنَ الخِدماتِ العامّة." },
    },
    {
      prompt: { en: "True or False: True growth comes from spending in Allah's way, not hoarding.", ar: "صَوابٌ أم خَطأ: النَّماءُ الحَقُّ مِنَ الإنفاقِ في سَبيلِ اللهِ لا الكَنز." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Charity is multiplied like a seed growing many grains (Al-Baqarah 261).", ar: "الصَّدَقةُ تُضاعَفُ كَحَبّةٍ تُنبِتُ حَبّاتٍ كَثيرة (البقرة ٢٦١)." },
    },
  ],
};
