import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const jihadPartOne: CourseLesson = {
  slug: "g10y11-jihad-in-the-cause-of-allah-part-one",
  name: { en: "Jihad in the Cause of Allah (Part One)", ar: "الجِهادُ في سَبيلِ الله (الجُزءُ الأوّل)" },
  shortIntro: {
    en: "Jihad means striving and exerting effort in the cause of Allah. This first part studies the true and comprehensive meaning of jihad in Islam — striving against the self, with knowledge, with wealth, and in every form of good — its great virtue, and how the greatest jihad is the struggle to obey Allah and reform oneself. It corrects the common misunderstanding that reduces jihad to fighting alone.",
    ar: "الجِهادُ هو الاجتِهادُ وبَذلُ الجُهدِ في سَبيلِ الله. يَدرُسُ هذا الجُزءُ الأوّلُ المَعنى الحَقَّ الشّامِلَ لِلجِهادِ في الإسلام — جِهادَ النَّفس، وبِالعِلم، وبِالمال، وفي كُلِّ صورةِ خَير — وعَظيمَ فَضلِه، وكَيفَ أنَّ أعظَمَ الجِهادِ مُجاهَدةُ النَّفسِ على طاعةِ اللهِ وإصلاحِها. ويُصَحِّحُ الفَهمَ الشّائِعَ الذي يَختَزِلُ الجِهادَ في القِتالِ وَحدَه.",
  },
  quranSurahs: ["Al-Hajj 78", "Al-Ankabut 69"],
  sections: [
    {
      title: { en: "The true and comprehensive meaning of jihad", ar: "المَعنى الحَقُّ الشّامِلُ لِلجِهاد" },
      learningObjectives: [
        { en: "Define jihad linguistically and in the Shari'ah.", ar: "أُعَرِّفُ الجِهادَ لُغةً وشَرعًا." },
        { en: "List the comprehensive forms of jihad.", ar: "أُعَدِّدُ صُوَرَ الجِهادِ الشّامِلة." },
      ],
      successCriteria: [
        { en: "I can explain Al-Hajj 78 and Al-Ankabut 69.", ar: "أشرَحُ الحَجَّ ٧٨ والعَنكَبوتَ ٦٩." },
        { en: "I can correct the idea that jihad means only fighting.", ar: "أُصَحِّحُ ظَنَّ أنَّ الجِهادَ قِتالٌ فَقَط." },
      ],
      image: {
        src: IMG.plantBulb,
        alt: { en: "A seed striving upward into a plant — striving and effort for good.", ar: "بَذرةٌ تَجتَهِدُ صاعِدةً نَباتًا — الاجتِهادُ والجُهدُ في الخَير." },
        caption: { en: "'And strive for Allah with the striving due to Him' (Al-Hajj 78).", ar: "﴿وجاهِدوا في اللهِ حَقَّ جِهادِه﴾ (الحج ٧٨)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "What does jihad really mean in Islam?", ar: "ما حَقيقةُ الجِهادِ في الإسلام؟" },
        body: {
          en: "Many people today — both some Muslims and many non-Muslims — wrongly believe that jihad means only fighting or, worse, violence and terrorism. Yet the Qur'an speaks of jihad in Makkah, before any fighting was permitted, and the Prophet ﷺ called the struggle against one's own soul the greatest jihad. Reflect: what is the true, comprehensive meaning of jihad — striving in the cause of Allah — and why is the most constant and important jihad of every Muslim the daily struggle to obey Allah, reform oneself, and do good?",
          ar: "يَظُنُّ كَثيرٌ مِنَ النّاسِ اليَومَ — بَعضُ المُسلِمينَ وكَثيرٌ مِن غَيرِهِم — خَطأً أنَّ الجِهادَ قِتالٌ فَقَط، بل وأسوَأُ: عُنفٌ وإرهاب. ومعَ ذلك تَحَدَّثَ القُرآنُ عنِ الجِهادِ في مَكّةَ قَبلَ أن يُؤذَنَ بِالقِتال، وسَمّى النَّبِيُّ ﷺ مُجاهَدةَ النَّفسِ أعظَمَ الجِهاد. تَأمَّل: ما المَعنى الحَقُّ الشّامِلُ لِلجِهاد — الاجتِهادِ في سَبيلِ الله — ولِمَ كانَ أدوَمُ جِهادِ كُلِّ مُسلِمٍ وأهَمُّهُ مُجاهَدتَهُ اليَومِيّةَ على طاعةِ اللهِ وإصلاحِ نَفسِهِ وفِعلِ الخَير؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Jihad (جِهاد): striving and exerting effort in the cause of Allah, in all its forms.", ar: "جِهاد: الاجتِهادُ وبَذلُ الجُهدِ في سَبيلِ اللهِ بِكُلِّ صُوَرِه." },
          ],
        },
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "'The mujahid is the one who strives against his own soul in obedience to Allah' (At-Tirmidhi, sahih).", ar: "«المُجاهِدُ مَن جاهَدَ نَفسَهُ في طاعةِ الله» (الترمذي، صحيح)." },
          ],
        },
      ],
      body: {
        en: "Jihad is one of the great and noble concepts of Islam, yet it is also one of the most widely misunderstood — both by some Muslims and by many non-Muslims who wrongly reduce it to fighting alone, or even slander it as violence and terrorism, which is utterly false. To understand jihad correctly, we must begin with its true meaning. The word jihad in Arabic comes from the root meaning to strive, to exert effort, and to struggle. In the Shari'ah, jihad means striving and exerting one's utmost effort in the cause of Allah — to please Him, to obey Him, to establish His religion, to reform oneself, and to do good and resist evil. This is a vast and comprehensive concept that embraces every kind of sincere effort and struggle for the sake of Allah, of which armed fighting (qital) in its proper place and conditions is only one form. Allah commands the believers: 'And strive for Allah with the striving due to Him' (Al-Hajj 78), and He promises: 'And those who strive for Us — We will surely guide them to Our ways. And indeed, Allah is with the doers of good' (Al-Ankabut 69). It is highly significant that this command to strive (jihad) was revealed in Makkah, in surahs revealed before the migration, at a time when fighting had not yet been permitted at all — which proves beyond doubt that jihad in Islam is a far broader concept than fighting.\n\nThe forms of jihad in the cause of Allah are many, and the scholars have explained them in detail. The first and most fundamental is jihad an-nafs — the striving against one's own soul: struggling to make oneself obey Allah, to learn the religion and act upon it, to abandon sins and desires, and to be patient upon the path of faith. This is the foundation of all other jihad, for a person who cannot conquer their own desires and direct themselves to obedience cannot truly strive in any other way. There is jihad against Shaytan — resisting his whispers, his temptations, and his attempts to lead one toward doubt and disobedience. There is jihad with knowledge and proof — striving to learn the truth, to teach it, to call others to Allah with wisdom and good speech, and to refute falsehood. This is the jihad of the scholars, the callers, and every Muslim who spreads good. There is jihad with wealth — spending one's money in the cause of Allah, in charity, in supporting good causes, and in helping the needy. There is the jihad of doing good and forbidding evil within the lawful and wise means. And there is the jihad of struggling against open oppression and aggression in its proper place and with its strict conditions, which is the subject of the second part of this lesson. All of these are jihad — striving in the cause of Allah — and all of them require effort, sincerity, patience, and sacrifice.\n\nAmong all the forms of jihad, the Prophet ﷺ taught that the struggle against one's own soul is the greatest and most important, because it is the most constant, the most difficult, and the foundation of everything else. He said: 'The mujahid (the one who performs jihad) is the one who strives against his own soul in obedience to Allah' (At-Tirmidhi, authentic). And in another narration, returning from a military expedition, he is reported to have said, 'We have returned from the lesser jihad to the greater jihad' — and when asked what the greater jihad was, he said, 'The jihad against the soul.' Although scholars have discussed the chain of this particular wording, its meaning is firmly established by the authentic texts: the lifelong struggle to purify one's heart, conquer one's desires, and remain steadfast in the obedience of Allah is the most demanding and the most rewarding of all strivings, and it is the jihad that every single Muslim is called to perform every day of their life, in times of peace and ease no less than in times of hardship. This corrects the dangerous and false idea that jihad means only fighting: in truth, the believer who patiently strives to pray, to be honest, to control their tongue and temper, to learn and act upon their religion, to overcome laziness and sin, and to do good to others is engaged, every day, in the noble and beloved jihad in the cause of Allah. In the next part of this lesson, we will study the specific form of jihad as lawful struggle against aggression — its true purpose, its strict conditions and ethics in Islam, and how Islam absolutely forbids the killing of innocents, treachery, and the corruption that some falsely commit in its name.",
        ar: "الجِهادُ مِن أعظَمِ مَفاهيمِ الإسلامِ وأنبَلِها، لكِنَّهُ أيضًا مِن أكثَرِها سوءَ فَهم — عِندَ بَعضِ المُسلِمينَ وكَثيرٍ مِن غَيرِهِمُ الذينَ يَختَزِلونَهُ خَطأً في القِتالِ وَحدَه، بل ويَفتَرونَ علَيهِ أنَّهُ عُنفٌ وإرهاب، وهذا باطِلٌ تَمامًا. ولِفَهمِ الجِهادِ فَهمًا صَحيحًا نَبدَأُ بِمَعناهُ الحَقّ. والجِهادُ في العَرَبيّةِ مِنَ الجَهدِ بِمَعنى الاجتِهادِ وبَذلِ الوُسعِ والمُكافَحة. وفي الشَّرعِ هو بَذلُ غايةِ الجُهدِ في سَبيلِ الله — لِإرضائِهِ وطاعَتِهِ وإقامةِ دينِهِ وإصلاحِ النَّفسِ وفِعلِ الخَيرِ ودَفعِ الشَّرّ. وهذا مَفهومٌ واسِعٌ شامِلٌ يَشمَلُ كُلَّ جُهدٍ صادِقٍ ومُكافَحةٍ في سَبيلِ الله، والقِتالُ في مَوضِعِهِ وبِشُروطِهِ صورةٌ واحِدةٌ مِنه. يَأمُرُ اللهُ المُؤمِنين: ﴿وجاهِدوا في اللهِ حَقَّ جِهادِه﴾ (الحج ٧٨)، ويَعِدُ: ﴿والذينَ جاهَدوا فينا لَنَهدِيَنَّهُم سُبُلَنا وإنَّ اللهَ لَمَعَ المُحسِنين﴾ (العنكبوت ٦٩). ومِنَ المُهِمِّ جِدًّا أنَّ الأمرَ بِالجِهادِ نَزَلَ في مَكّةَ، في سُوَرٍ قَبلَ الهِجرة، حينَ لم يُؤذَن بِالقِتالِ أصلًا بَعد — وهذا يُثبِتُ قَطعًا أنَّ الجِهادَ في الإسلامِ أوسَعُ بِكَثيرٍ مِنَ القِتال.\n\nوصُوَرُ الجِهادِ في سَبيلِ اللهِ كَثيرة، فَصَّلَها العُلَماء. أوَّلُها وأصلُها جِهادُ النَّفس: مُجاهَدَتُها على طاعةِ الله، وتَعَلُّمِ الدّينِ والعَمَلِ بِه، وتَركِ الذُّنوبِ والشَّهَوات، والصَّبرِ على طَريقِ الإيمان. وهو أساسُ كُلِّ جِهادٍ آخَر، فَمَن لم يَقهَر هَواهُ ويُوَجِّه نَفسَهُ لِلطّاعةِ لم يَستَطِع أن يُجاهِدَ حَقًّا بِأيِّ صورةٍ أُخرى. وهُناكَ جِهادُ الشَّيطان — مُقاوَمةُ وَسوَسَتِهِ وإغوائِهِ ومُحاوَلاتِهِ جَرَّ المَرءِ إلى الشَّكِّ والمَعصية. وهُناكَ جِهادُ العِلمِ والحُجّة — السَّعيُ لِتَعَلُّمِ الحَقِّ وتَعليمِهِ، والدَّعوةِ إلى اللهِ بِالحِكمةِ والقَولِ الحَسَن، ودَفعِ الباطِل. وهو جِهادُ العُلَماءِ والدُّعاةِ وكُلِّ مُسلِمٍ يَنشُرُ خَيرًا. وهُناكَ جِهادُ المال — إنفاقُهُ في سَبيلِ الله، في الصَّدَقةِ ودَعمِ الخَيرِ وإغاثةِ المُحتاج. وهُناكَ جِهادُ الأمرِ بِالمَعروفِ والنَّهيِ عنِ المُنكَرِ بِالوَسائِلِ المَشروعةِ الحَكيمة. وهُناكَ جِهادُ دَفعِ الظُّلمِ والعُدوانِ الظّاهِرِ في مَوضِعِهِ وبِشُروطِهِ الدَّقيقة، وهو مَوضوعُ الجُزءِ الثّاني. وكُلُّ هذا جِهادٌ — اجتِهادٌ في سَبيلِ الله — وكُلُّهُ يَحتاجُ جُهدًا وإخلاصًا وصَبرًا وتَضحية.\n\nومِن بَينِ صُوَرِ الجِهادِ كُلِّها عَلَّمَ النَّبِيُّ ﷺ أنَّ مُجاهَدةَ النَّفسِ أعظَمُها وأهَمُّها، لِأنَّها أدوَمُها وأصعَبُها وأساسُ كُلِّ ما سِواها. قال: «المُجاهِدُ مَن جاهَدَ نَفسَهُ في طاعةِ الله» (الترمذي، صحيح). وفي رِوايةٍ، راجِعًا مِن غَزوة، رُويَ أنَّهُ قال: «رَجَعنا مِنَ الجِهادِ الأصغَرِ إلى الجِهادِ الأكبَر» — ولَمّا سُئِلَ ما الجِهادُ الأكبَرُ قال: «جِهادُ النَّفس». وإن تَكَلَّمَ العُلَماءُ في إسنادِ هذا اللَّفظِ بِعَينِه، فَمَعناهُ ثابِتٌ بِالنُّصوصِ الصَّحيحة: فَمُجاهَدةُ القَلبِ مَدى الحَياةِ على تَطهيرِهِ وقَهرِ الهَوى والثَّباتِ على طاعةِ اللهِ أشَقُّ الجِهادِ وأعظَمُهُ أجرًا، وهو الجِهادُ الذي يُدعى إلَيهِ كُلُّ مُسلِمٍ كُلَّ يَومٍ مِن حَياتِهِ، في السِّلمِ والرَّخاءِ كَما في الشِّدّة. وهذا يُصَحِّحُ الفِكرةَ الخَطيرةَ الباطِلةَ أنَّ الجِهادَ قِتالٌ فَقَط: فَالحَقيقةُ أنَّ المُؤمِنَ الذي يُجاهِدُ بِصَبرٍ على الصَّلاةِ والصِّدقِ وضَبطِ لِسانِهِ وغَضَبِهِ وتَعَلُّمِ دينِهِ والعَمَلِ بِهِ والتَّغَلُّبِ على الكَسَلِ والذَّنبِ وفِعلِ الخَيرِ لِلنّاسِ هو، كُلَّ يَوم، في الجِهادِ النَّبيلِ المَحبوبِ في سَبيلِ الله. وفي الجُزءِ الثّاني نَدرُسُ الصورةَ الخاصّةَ لِلجِهادِ بِمَعنى دَفعِ العُدوانِ المَشروع — مَقصِدَهُ الحَقّ، وشُروطَهُ وأخلاقَهُ الصّارِمةَ في الإسلام، وكَيفَ يُحَرِّمُ الإسلامُ تَحريمًا قاطِعًا قَتلَ الأبرياءِ والغَدرَ والفَسادَ الذي يَرتَكِبُهُ بَعضُهُم زورًا بِاسمِه.",
      },
    },
    {
      title: { en: "The greatest jihad: striving against the soul", ar: "أعظَمُ الجِهاد: مُجاهَدةُ النَّفس" },
      learningObjectives: [
        { en: "Explain the virtue of striving against the soul.", ar: "أشرَحُ فَضلَ مُجاهَدةِ النَّفس." },
        { en: "Apply the forms of jihad to daily life.", ar: "أُطَبِّقُ صُوَرَ الجِهادِ على الحَياة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A young person striving to learn — jihad with knowledge and self.", ar: "نَاشِئٌ يَجتَهِدُ في التَّعَلُّم — جِهادُ العِلمِ والنَّفس." },
        caption: { en: "'Those who strive for Us — We will guide them to Our ways' (Al-Ankabut 69).", ar: "﴿والذينَ جاهَدوا فينا لَنَهدِيَنَّهُم سُبُلَنا﴾ (العنكبوت ٦٩)." },
      },
      groupTasks: {
        title: { en: "The forms of striving", ar: "صُوَرُ الجِهاد" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "forms-of-jihad",
            name: { en: "Team A — The comprehensive forms of jihad", ar: "الفَريقُ أ — صُوَرُ الجِهادِ الشّامِلة" },
            learningObjective: { en: "Present the many forms of jihad in the cause of Allah.", ar: "نَعرِضُ صُوَرَ الجِهادِ في سَبيلِ الله." },
            task: { en: "Present the comprehensive forms of jihad in Islam, showing it is far more than fighting: jihad against the soul (struggling to obey Allah, learn and act on the religion, leave sins); jihad against Shaytan (resisting whispers and temptation); jihad with knowledge and proof (learning, teaching, calling to Allah with wisdom, refuting falsehood); jihad with wealth (spending in good causes and charity); jihad of doing good and forbidding evil wisely; and lawful struggle against aggression (Part Two). Give a real-life example of each form. Show that jihad was commanded in Makkah before fighting was permitted, proving its breadth. Present a 'forms of jihad' map. Be careful and accurate, presenting authentic Sunni understanding.", ar: "اعرِضوا صُوَرَ الجِهادِ الشّامِلةَ في الإسلام، مُبَيِّنينَ أنَّهُ أوسَعُ بِكَثيرٍ مِنَ القِتال: جِهادَ النَّفس (مُجاهَدَتَها على الطّاعةِ وتَعَلُّمِ الدّينِ والعَمَلِ بِهِ وتَركِ الذُّنوب)؛ وجِهادَ الشَّيطان (مُقاوَمةَ الوَسوَسةِ والإغواء)؛ وجِهادَ العِلمِ والحُجّة (التَّعَلُّمَ والتَّعليمَ والدَّعوةَ بِالحِكمةِ ودَفعَ الباطِل)؛ وجِهادَ المال (الإنفاقَ في الخَيرِ والصَّدَقة)؛ وجِهادَ الأمرِ بِالمَعروفِ والنَّهيِ عنِ المُنكَرِ بِحِكمة؛ ودَفعَ العُدوانِ المَشروع (الجُزءَ الثّاني). أعطوا مِثالًا واقِعيًّا لِكُلِّ صورة. بَيِّنوا أنَّ الجِهادَ أُمِرَ بِهِ في مَكّةَ قَبلَ الإذنِ بِالقِتال، دَليلًا على سَعَتِه. اعرِضوا خَريطةَ «صُوَرِ الجِهاد». تَدَقَّقوا في عَرضِ فَهمِ أهلِ السُّنّةِ الصَّحيح." },
            evidence: [
              { en: "'Strive for Allah with the striving due to Him' (Al-Hajj 78).", ar: "﴿وجاهِدوا في اللهِ حَقَّ جِهادِه﴾ (الحج ٧٨)." },
            ],
            sourceNotes: [
              { en: "Jihad was commanded in Makkah before fighting.", ar: "أُمِرَ بِالجِهادِ في مَكّةَ قَبلَ القِتال." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'forms of jihad' map.", ar: "خَريطةُ «صُوَرِ الجِهاد»." },
          },
          {
            slug: "jihad-of-the-self",
            name: { en: "Team B — The greatest jihad in daily life", ar: "الفَريقُ ب — أعظَمُ الجِهادِ في الحَياةِ اليَومِيّة" },
            learningObjective: { en: "Present striving against the soul as a daily practice.", ar: "نَعرِضُ جِهادَ النَّفسِ مُمارَسةً يَومِيّة." },
            task: { en: "Present why the struggle against one's own soul is the greatest and most constant jihad, and how students practise it every day. Show the hadith: 'The mujahid is the one who strives against his own soul in obedience to Allah' (At-Tirmidhi). Give concrete daily examples for a student: struggling to pray on time, to be truthful even when hard, to control anger and the tongue, to overcome laziness in study and worship, to resist the temptations of bad company or harmful content, to be patient and kind, and to keep learning and acting on the religion. Show that this jihad is for everyone, in peace and ease, and that it builds a strong, righteous character. Present a 'my daily jihad' self-reform plan. Make clear this corrects the false idea that jihad means only fighting.", ar: "اعرِضوا لِمَ مُجاهَدةُ النَّفسِ أعظَمُ الجِهادِ وأدوَمُه، وكَيفَ يُمارِسُها الطّالِبُ كُلَّ يَوم. بَيِّنوا الحَديث: «المُجاهِدُ مَن جاهَدَ نَفسَهُ في طاعةِ الله» (الترمذي). أعطوا أمثِلةً يَومِيّةً لِلطّالِب: المُجاهَدةَ على الصَّلاةِ في وَقتِها، والصِّدقِ ولَو شَقَّ، وضَبطِ الغَضَبِ واللِّسان، والتَّغَلُّبِ على الكَسَلِ في الدِّراسةِ والعِبادة، ومُقاوَمةِ إغراءِ رِفاقِ السوءِ أوِ المُحتوى الضّارّ، والصَّبرِ والرِّفق، ومُواصَلةِ تَعَلُّمِ الدّينِ والعَمَلِ بِه. بَيِّنوا أنَّ هذا الجِهادَ لِلجَميعِ في السِّلمِ والرَّخاء، وأنَّهُ يَبني شَخصيّةً قَويّةً صالِحة. اعرِضوا خِطّةَ «جِهادي اليَوميّ» لِإصلاحِ النَّفس. ووَضِّحوا أنَّ هذا يُصَحِّحُ ظَنَّ أنَّ الجِهادَ قِتالٌ فَقَط." },
            evidence: [
              { en: "'The mujahid is the one who strives against his own soul' (At-Tirmidhi).", ar: "«المُجاهِدُ مَن جاهَدَ نَفسَه» (الترمذي)." },
            ],
            sourceNotes: [
              { en: "The greatest, most constant jihad for everyone.", ar: "أعظَمُ الجِهادِ وأدوَمُهُ لِلجَميع." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'my daily jihad' self-reform plan.", ar: "خِطّةُ «جِهادي اليَوميّ»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "My daily jihad", ar: "جِهادي اليَوميّ" },
        prompt: { en: "Jihad means striving in the cause of Allah, and its forms are many — striving against the soul, with knowledge, with wealth, in doing good — with the struggle against one's own soul being the greatest and most constant of all, as the Prophet ﷺ taught: 'The mujahid is the one who strives against his own soul in obedience to Allah.' Reflect on your own daily jihad. Write about the real struggles you face every day in obeying Allah and reforming yourself — perhaps praying on time, being truthful when it is hard, controlling your anger or your tongue, overcoming laziness in study or worship, resisting bad company or harmful content, or being patient and kind. Choose one area where you most need to strive, and describe how you will struggle against your own soul in it, seeking Allah's help and His promise: 'Those who strive for Us — We will surely guide them to Our ways.'", ar: "الجِهادُ بَذلُ الجُهدِ في سَبيلِ الله، وصُوَرُهُ كَثيرة — جِهادُ النَّفسِ والعِلمِ والمالِ وفِعلِ الخَير — وأعظَمُها وأدوَمُها مُجاهَدةُ النَّفس، كَما قالَ النَّبِيُّ ﷺ: «المُجاهِدُ مَن جاهَدَ نَفسَهُ في طاعةِ الله». تَأمَّل جِهادَكَ اليَوميّ. اكتُب عنِ المُجاهَداتِ الحَقيقيّةِ التي تُواجِهُها كُلَّ يَومٍ في طاعةِ اللهِ وإصلاحِ نَفسِك — كَالصَّلاةِ في وَقتِها، والصِّدقِ حينَ يَشُقّ، وضَبطِ الغَضَبِ أوِ اللِّسان، والتَّغَلُّبِ على الكَسَلِ في الدِّراسةِ أوِ العِبادة، ومُقاوَمةِ رِفاقِ السوءِ أوِ المُحتوى الضّارّ، أوِ الصَّبرِ والرِّفق. اختَر مَجالًا تَحتاجُ فيهِ المُجاهَدةَ أكثَر، وصِف كَيفَ سَتُجاهِدُ نَفسَكَ فيهِ، مُستَعينًا بِاللهِ وبِوَعدِه: ﴿والذينَ جاهَدوا فينا لَنَهدِيَنَّهُم سُبُلَنا﴾." },
        placeholder: { en: "My biggest daily jihad is... I will strive against my soul by... I ask Allah's help to...", ar: "أكبَرُ جِهادي اليَوميِّ... وسَأُجاهِدُ نَفسي بِـ... وأسألُ اللهَ العَونَ على..." },
      },
      body: {
        en: "The greatest and most constant of all the forms of jihad, as the Prophet ﷺ taught, is the struggle against one's own soul — jihad an-nafs — and understanding this is the key to understanding the true spirit of jihad in Islam. The human soul, by its nature, is inclined toward ease, desire, and disobedience unless it is constantly struggled with, disciplined, and directed toward the obedience of Allah. The believer is therefore engaged in a lifelong inner struggle: to make the soul worship Allah when it inclines to laziness, to make it speak the truth when lying is easier, to make it control anger when it wishes to lash out, to make it abandon sins and desires when they tempt, and to make it patient upon the path of faith through every difficulty. This is why the Prophet ﷺ said, 'The mujahid is the one who strives against his own soul in obedience to Allah' (At-Tirmidhi, authentic), and why this struggle is described as the greatest jihad: it is the most difficult, because the enemy is within; it is the most constant, because it never ends as long as one lives; and it is the foundation of every other good, because a soul that is not conquered and disciplined cannot truly strive for Allah in any other field. The one who masters the jihad of the soul becomes capable of every other form of striving and good.\n\nFrom this we see how the comprehensive concept of jihad applies to the daily life of every Muslim, including every student. Your daily jihad is the real and constant struggle to obey Allah and reform yourself: striving to pray your prayers on time and with presence of heart even when you are tired or busy; striving to be truthful and honest even when a lie would be easier; striving to control your anger and guard your tongue from backbiting, insult, and bad speech; striving to overcome laziness in your studies and your worship; striving to resist the pull of bad company, harmful content online, and every temptation toward sin; striving to be patient, kind, and good to your parents, teachers, and others; and striving to keep learning your religion and acting upon it throughout your life. Beyond the jihad of the soul, you engage in jihad with knowledge whenever you learn the truth and share good with others; in jihad with wealth whenever you give in charity or support a good cause; and in the jihad of good character whenever you do good and gently turn others away from wrong. Every one of these daily strivings is the noble jihad in the cause of Allah, beloved to Him and richly rewarded, for Allah has promised: 'And those who strive for Us — We will surely guide them to Our ways. And indeed, Allah is with the doers of good' (Al-Ankabut 69).\n\nUnderstanding this comprehensive and beautiful meaning of jihad is of the greatest importance for the young Muslim today, for two reasons. First, it corrects the dangerous and false idea — spread by enemies of Islam and by misguided extremists alike — that jihad means only fighting, or worse, that it justifies violence against the innocent, terrorism, and corruption. This is a grotesque distortion of a noble concept, and the true understanding of jihad as comprehensive striving in the cause of Allah, with the struggle against the soul at its heart, is the answer to this lie. Second, it shows every Muslim that they are called to be a mujahid — one who strives in the cause of Allah — every single day, in times of peace and ease, through the patient struggle to obey Allah, to reform themselves, to seek and spread good, and to overcome their own weaknesses and sins. This is a jihad that is open to everyone, young and old, in every circumstance, and it builds strong, righteous, and disciplined characters and a healthy, virtuous society. In the second part of this lesson, we will turn to the specific form of jihad as the lawful and regulated struggle to repel aggression and oppression, and we will study its true purpose, its strict conditions, and its noble ethics in Islam — and how Islam absolutely forbids the killing of the innocent, treachery, and the corruption that some wrongly commit in its name, so that the true and balanced understanding of this great concept is complete.",
        ar: "أعظَمُ صُوَرِ الجِهادِ وأدوَمُها، كَما عَلَّمَ النَّبِيُّ ﷺ، مُجاهَدةُ النَّفس — جِهادُ النَّفس — وفَهمُ هذا مِفتاحُ فَهمِ روحِ الجِهادِ الحَقّةِ في الإسلام. فَالنَّفسُ البَشَريّةُ بِطَبعِها تَميلُ إلى الرّاحةِ والشَّهوةِ والمَعصيةِ ما لم تُجاهَد دائِمًا وتُؤَدَّب وتُوَجَّه إلى طاعةِ الله. فَالمُؤمِنُ في جِهادٍ داخِليٍّ مَدى الحَياة: أن يَحمِلَ نَفسَهُ على عِبادةِ اللهِ إذا مالَت إلى الكَسَل، وعلى الصِّدقِ إذا سَهُلَ الكَذِب، وعلى ضَبطِ الغَضَبِ إذا أرادَتِ الانفِجار، وعلى تَركِ الذُّنوبِ والشَّهَواتِ إذا أغرَت، وعلى الصَّبرِ على طَريقِ الإيمانِ في كُلِّ شِدّة. ولِذا قالَ النَّبِيُّ ﷺ: «المُجاهِدُ مَن جاهَدَ نَفسَهُ في طاعةِ الله» (الترمذي، صحيح)، ولِذا وُصِفَت هذه المُجاهَدةُ بِأعظَمِ الجِهاد: فَهي أصعَبُه، لِأنَّ العَدُوَّ في الدّاخِل؛ وأدوَمُه، لِأنَّهُ لا يَنتَهي ما دامَ المَرءُ حَيًّا؛ وأساسُ كُلِّ خَيرٍ آخَر، لِأنَّ نَفسًا لم تُقهَر وتُؤَدَّب لا تَستَطيعُ أن تُجاهِدَ لِلهِ حَقًّا في أيِّ مَيدانٍ آخَر. ومَن أتقَنَ جِهادَ النَّفسِ صارَ قادِرًا على كُلِّ صورةِ جِهادٍ وخَير.\n\nومِن هُنا نَرى كَيفَ يَنطَبِقُ مَفهومُ الجِهادِ الشّامِلُ على الحَياةِ اليَومِيّةِ لِكُلِّ مُسلِم، ومِنهُ كُلُّ طالِب. فَجِهادُكَ اليَوميُّ هو المُجاهَدةُ الحَقيقيّةُ الدّائِمةُ على طاعةِ اللهِ وإصلاحِ نَفسِك: المُجاهَدةُ على أداءِ الصَّلَواتِ في وَقتِها بِحُضورِ قَلبٍ ولَو تَعِبتَ أو شُغِلت؛ والمُجاهَدةُ على الصِّدقِ والأمانةِ ولَو كانَ الكَذِبُ أسهَل؛ والمُجاهَدةُ على ضَبطِ الغَضَبِ وحِفظِ اللِّسانِ مِنَ الغيبةِ والسَّبِّ وسَيِّئِ الكَلام؛ والمُجاهَدةُ على التَّغَلُّبِ على الكَسَلِ في الدِّراسةِ والعِبادة؛ والمُجاهَدةُ على مُقاوَمةِ جَذبِ رِفاقِ السوءِ والمُحتوى الضّارِّ وكُلِّ إغراءٍ بِالمَعصية؛ والمُجاهَدةُ على الصَّبرِ والرِّفقِ والإحسانِ إلى الوالِدَينِ والمُعَلِّمينَ وغَيرِهِم؛ والمُجاهَدةُ على مُواصَلةِ تَعَلُّمِ الدّينِ والعَمَلِ بِهِ طَوالَ الحَياة. وفَوقَ جِهادِ النَّفسِ تُجاهِدُ بِالعِلمِ كُلَّما تَعَلَّمتَ الحَقَّ وشارَكتَ الخَيرَ غَيرَك؛ وبِالمالِ كُلَّما تَصَدَّقتَ أو دَعَمتَ خَيرًا؛ وبِحُسنِ الخُلُقِ كُلَّما فَعَلتَ خَيرًا وصَرَفتَ غَيرَكَ بِرِفقٍ عن شَرّ. وكُلُّ مُجاهَدةٍ يَومِيّةٍ مِن هذه هي الجِهادُ النَّبيلُ في سَبيلِ الله، مَحبوبٌ إلَيهِ مَأجورٌ عَظيمًا، فَقَد وَعَدَ الله: ﴿والذينَ جاهَدوا فينا لَنَهدِيَنَّهُم سُبُلَنا وإنَّ اللهَ لَمَعَ المُحسِنين﴾ (العنكبوت ٦٩).\n\nوفَهمُ هذا المَعنى الشّامِلِ الجَميلِ لِلجِهادِ بالِغُ الأهَمّيّةِ لِلشّابِّ المُسلِمِ اليَومَ لِسَبَبَين. الأوّل: أنَّهُ يُصَحِّحُ الفِكرةَ الخَطيرةَ الباطِلةَ — التي يَنشُرُها أعداءُ الإسلامِ والمُتَطَرِّفونَ الضّالّونَ معًا — أنَّ الجِهادَ قِتالٌ فَقَط، بل وأنَّهُ يُبَرِّرُ العُنفَ ضِدَّ الأبرياءِ والإرهابَ والفَساد. وهذا تَشويهٌ بَشِعٌ لِمَفهومٍ نَبيل، والفَهمُ الحَقُّ لِلجِهادِ بِأنَّهُ اجتِهادٌ شامِلٌ في سَبيلِ اللهِ، وفي صَميمِهِ مُجاهَدةُ النَّفس، هو الرَّدُّ على هذه الفِريَة. والثّاني: أنَّهُ يُبَيِّنُ لِكُلِّ مُسلِمٍ أنَّهُ مَدعُوٌّ أن يَكونَ مُجاهِدًا — يَجتَهِدُ في سَبيلِ الله — كُلَّ يَوم، في السِّلمِ والرَّخاء، بِالمُجاهَدةِ الصّابِرةِ على طاعةِ اللهِ وإصلاحِ النَّفسِ وطَلَبِ الخَيرِ ونَشرِهِ والتَّغَلُّبِ على ضَعفِهِ وذُنوبِه. وهذا جِهادٌ مَفتوحٌ لِلجَميعِ، صَغيرًا وكَبيرًا، في كُلِّ حال، يَبني شَخصيّاتٍ قَويّةً صالِحةً مُنضَبِطة، ومُجتَمَعًا سَليمًا فاضِلًا. وفي الجُزءِ الثّاني نَنتَقِلُ إلى الصورةِ الخاصّةِ لِلجِهادِ بِمَعنى دَفعِ العُدوانِ والظُّلمِ المَشروعِ المُنَظَّم، ونَدرُسُ مَقصِدَهُ الحَقّ، وشُروطَهُ الصّارِمة، وأخلاقَهُ النَّبيلةَ في الإسلام — وكَيفَ يُحَرِّمُ الإسلامُ قَطعًا قَتلَ الأبرياءِ والغَدرَ والفَسادَ الذي يَرتَكِبُهُ بَعضُهُم زورًا بِاسمِه، حَتّى يَكتَمِلَ الفَهمُ الحَقُّ المُتَوازِنُ لِهذا المَفهومِ العَظيم.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does jihad mean linguistically?", ar: "ما مَعنى الجِهادِ لُغةً؟" },
      options: [
        { en: "Striving and exerting effort", ar: "الاجتِهادُ وبَذلُ الجُهد" },
        { en: "Fighting only", ar: "القِتالُ فَقَط" },
        { en: "Anger", ar: "الغَضَب" },
        { en: "Travel", ar: "السَّفَر" },
      ],
      correctIndex: 0,
      explanation: { en: "In Shari'ah: striving in the cause of Allah, in all forms.", ar: "وشَرعًا: بَذلُ الجُهدِ في سَبيلِ اللهِ بِكُلِّ صُوَرِه." },
    },
    {
      prompt: { en: "What proves jihad is broader than fighting?", ar: "ما الذي يُثبِتُ أنَّ الجِهادَ أوسَعُ مِنَ القِتال؟" },
      options: [
        { en: "It was commanded in Makkah before fighting was allowed", ar: "أُمِرَ بِهِ في مَكّةَ قَبلَ الإذنِ بِالقِتال" },
        { en: "It is never mentioned in the Qur'an", ar: "لم يُذكَر في القُرآن" },
        { en: "It means only war", ar: "يَعني الحَربَ فَقَط" },
        { en: "It is optional", ar: "أنَّهُ تَطَوُّع" },
      ],
      correctIndex: 0,
      explanation: { en: "Makkan verses commanded striving before qital.", ar: "آياتٌ مَكّيّةٌ أمَرَت بِالجِهادِ قَبلَ القِتال." },
    },
    {
      prompt: { en: "Which is the greatest jihad according to the Prophet ﷺ?", ar: "ما أعظَمُ الجِهادِ عِندَ النَّبِيِّ ﷺ؟" },
      options: [
        { en: "Striving against one's own soul in obedience to Allah", ar: "مُجاهَدةُ النَّفسِ في طاعةِ الله" },
        { en: "Collecting wealth", ar: "جَمعُ المال" },
        { en: "Travelling far", ar: "السَّفَرُ البَعيد" },
        { en: "Arguing with people", ar: "مُجادَلةُ النّاس" },
      ],
      correctIndex: 0,
      explanation: { en: "'The mujahid strives against his own soul' (At-Tirmidhi).", ar: "«المُجاهِدُ مَن جاهَدَ نَفسَه» (الترمذي)." },
    },
    {
      prompt: { en: "Which is a form of jihad in the cause of Allah?", ar: "أيٌّ صورةٌ مِنَ الجِهادِ في سَبيلِ الله؟" },
      options: [
        { en: "Jihad with knowledge, wealth, and against the soul", ar: "الجِهادُ بِالعِلمِ والمالِ ومُجاهَدةُ النَّفس" },
        { en: "Only violence", ar: "العُنفُ فَقَط" },
        { en: "Harming innocents", ar: "إيذاءُ الأبرياء" },
        { en: "Laziness", ar: "الكَسَل" },
      ],
      correctIndex: 0,
      explanation: { en: "Jihad is comprehensive striving in good.", ar: "الجِهادُ اجتِهادٌ شامِلٌ في الخَير." },
    },
    {
      prompt: { en: "What is Allah's promise to those who strive for Him?", ar: "ما وَعدُ اللهِ لِمَن جاهَدَ فيه؟" },
      options: [
        { en: "He will guide them to His ways", ar: "يَهديهِم سُبُلَه" },
        { en: "Nothing", ar: "لا شَيء" },
        { en: "Wealth only", ar: "المالَ فَقَط" },
        { en: "Fame", ar: "الشُّهرة" },
      ],
      correctIndex: 0,
      explanation: { en: "'We will surely guide them to Our ways' (Al-Ankabut 69).", ar: "﴿لَنَهدِيَنَّهُم سُبُلَنا﴾ (العنكبوت ٦٩)." },
    },
    {
      prompt: { en: "True or False: Jihad means only fighting.", ar: "صَوابٌ أم خَطأ: الجِهادُ يَعني القِتالَ فَقَط." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Jihad is comprehensive striving; the soul's jihad is greatest.", ar: "الجِهادُ اجتِهادٌ شامِل؛ وجِهادُ النَّفسِ أعظَمُه." },
    },
  ],
};
