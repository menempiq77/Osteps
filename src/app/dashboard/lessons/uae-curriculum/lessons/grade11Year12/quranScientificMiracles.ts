import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const quranScientificMiracles: CourseLesson = {
  slug: "g11y12-quran-and-scientific-miracles",
  name: { en: "The Noble Quran and Scientific Miracles", ar: "القُرآنُ الكَريمُ والإعجازُ العِلميّ" },
  shortIntro: {
    en: "The Noble Qur'an, revealed over fourteen centuries ago, contains many statements about the natural world that agree with what modern science has only recently discovered — a sign of its divine origin. This lesson studies the meaning of the Qur'an's miraculous nature (i'jaz), examples of its scientific indications, the correct and balanced way to understand them, and how this strengthens a young Muslim's faith without falling into exaggeration or forcing interpretations.",
    ar: "القُرآنُ الكَريمُ، المُنَزَّلُ قَبلَ أربَعةَ عَشَرَ قَرنًا، يَحوي إشاراتٍ كَثيرةً عنِ الكَونِ تُوافِقُ ما اكتَشَفَهُ العِلمُ الحَديثُ حَديثًا — دَليلًا على مَصدَرِهِ الإلهيّ. يَدرُسُ هذا الدَّرسُ مَعنى إعجازِ القُرآن، وأمثِلةً مِن إشاراتِهِ العِلميّة، والمَنهَجَ الصَّحيحَ المُتَوازِنَ في فَهمِها، وكَيفَ يُقَوّي ذلك إيمانَ الشّابِّ المُسلِمِ دونَ مُبالَغةٍ أو تَكَلُّفٍ في التَّأويل.",
  },
  quranSurahs: ["Fussilat 53", "Al-Anbiya 30"],
  sections: [
    {
      title: { en: "The miraculous nature of the Qur'an", ar: "إعجازُ القُرآن" },
      learningObjectives: [
        { en: "Explain the meaning of the Qur'an's i'jaz (miraculousness).", ar: "أشرَحُ مَعنى إعجازِ القُرآن." },
        { en: "Explain the idea of scientific indications in the Qur'an.", ar: "أشرَحُ فِكرةَ الإشاراتِ العِلميّةِ في القُرآن." },
      ],
      successCriteria: [
        { en: "I can explain Fussilat 53 and Al-Anbiya 30.", ar: "أشرَحُ فُصِّلَت ٥٣ والأنبياءَ ٣٠." },
        { en: "I can describe what the scientific i'jaz means.", ar: "أصِفُ ما يَعنيهِ الإعجازُ العِلميّ." },
      ],
      image: {
        src: IMG.sea,
        alt: { en: "The sea — one of the signs the Qur'an describes.", ar: "البَحر — مِنَ الآياتِ التي يَصِفُها القُرآن." },
        caption: { en: "'We will show them Our signs in the horizons and within themselves' (Fussilat 53).", ar: "﴿سَنُريهِم آياتِنا في الآفاقِ وفي أنفُسِهِم﴾ (فُصِّلَت ٥٣)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "How could a book from 1400 years ago describe what science discovered only recently?", ar: "كَيفَ يَصِفُ كِتابٌ مِن قَبلِ ١٤٠٠ سَنةٍ ما اكتَشَفَهُ العِلمُ حَديثًا؟" },
        body: {
          en: "The Qur'an was revealed to an unlettered Prophet ﷺ in seventh-century Arabia, in a society with no microscopes, telescopes, or laboratories. Yet it contains precise statements about the stages of the human embryo, the expansion of the universe, the barriers between seas, mountains as stabilisers, and much more — statements that agree with what modern science discovered only in recent centuries. Reflect: how could a book revealed fourteen hundred years ago, to an unlettered man, describe realities of the natural world that humanity could only verify with modern instruments — and what does this tell us about the source of the Qur'an? (And how do we appreciate this without exaggerating or forcing the text?)",
          ar: "نَزَلَ القُرآنُ على نَبِيٍّ أُمّيٍّ ﷺ في جَزيرةِ العَرَبِ في القَرنِ السّابِع، في مُجتَمَعٍ بِلا مَجاهِرَ ولا مَناظيرَ ولا مَخابِر. ومعَ ذلك يَحوي عِباراتٍ دَقيقةً عن أطوارِ الجَنينِ البَشَريّ، وتَوَسُّعِ الكَون، والبَرزَخِ بَينَ البِحار، والجِبالِ كَأوتاد، وغَيرِ ذلك كَثير — عِباراتٍ تُوافِقُ ما اكتَشَفَهُ العِلمُ الحَديثُ في القُرونِ الأخيرةِ فَقَط. تَأمَّل: كَيفَ يَصِفُ كِتابٌ نَزَلَ قَبلَ أربَعةَ عَشَرَ قَرنًا، على رَجُلٍ أُمّيّ، حَقائِقَ كَونيّةً لَم تَستَطِعِ البَشَريّةُ التَّحَقُّقَ مِنها إلّا بِالأجهِزةِ الحَديثة — وماذا يُخبِرُنا هذا عن مَصدَرِ القُرآن؟ (وكَيفَ نُقَدِّرُ هذا دونَ مُبالَغةٍ أو تَكَلُّفٍ في النَّصّ؟)",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "I'jaz (الإعجاز): the miraculous, inimitable nature of the Qur'an. Al-i'jaz al-'ilmi (الإعجازُ العِلميّ): the agreement of the Qur'an with established scientific facts.", ar: "الإعجاز: كَونُ القُرآنِ مُعجِزًا لا يُؤتى بِمِثلِه. الإعجازُ العِلميّ: مُوافَقةُ القُرآنِ لِلحَقائِقِ العِلميّةِ الثّابِتة." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Al-Anbiya 30: 'the heavens and earth were joined, then We separated them; and We made from water every living thing.'", ar: "الأنبياء ٣٠: ﴿كانَتا رَتقًا فَفَتَقناهُما وجَعَلنا مِنَ الماءِ كُلَّ شَيءٍ حَيّ﴾." },
          ],
        },
      ],
      body: {
        en: "The Noble Qur'an is the everlasting miracle of the Prophet Muhammad ﷺ. Whereas the miracles of earlier Prophets were physical events witnessed by those present and then passed (such as the staff of Musa or the healing miracles of 'Isa), the Qur'an is a living, lasting miracle that remains with us, recited and witnessed in every age. Its miraculous nature (i'jaz) is many-sided: it challenged the eloquent Arabs, masters of their language, to produce even a single chapter like it, and they could not, though they were its fiercest enemies; it contains true reports of past nations and of the unseen; it is perfectly consistent across its whole, with no contradiction, though revealed over twenty-three years; it has guided and transformed individuals and civilisations; and it was preserved exactly as revealed, as Allah guaranteed. Among the many aspects of the Qur'an's i'jaz that scholars have noted in recent times is what is called the scientific indication or scientific i'jaz (al-i'jaz al-'ilmi): the fact that the Qur'an contains statements about the natural world — the heavens, the earth, the seas, the mountains, living things, and the human being — that agree with what modern science has discovered only in recent centuries, though the Qur'an was revealed over fourteen hundred years ago to an unlettered Prophet in a society without any of the instruments of modern science.\n\nThe Qur'an itself directs the human mind to reflect upon the natural world as a means of recognising its Creator and the truth of His revelation. Allah says: 'We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth' (Fussilat 53) — promising that the signs in creation, in the wide universe ('the horizons') and in the human being ('themselves'), will increasingly make clear the truth of the Qur'an. The Qur'an is full of verses inviting reflection on the heavens, the earth, the alternation of night and day, the rain and plants, the seas, the mountains, the animals, and the stages of human creation — not as a textbook of science, but as signs (ayat) pointing to the wisdom, power, and oneness of the Creator. It is in the course of this reflection that believers and researchers have noticed how precisely many Qur'anic statements about creation accord with established scientific facts.\n\nIt is important from the outset, however, to understand the scientific i'jaz correctly and with balance, for this is an area where some have fallen into error through exaggeration. The Qur'an is a book of guidance, not a book of science; its purpose is to guide humanity to Allah, to faith, to worship, and to righteous living, not to teach the details of physics or biology. When the Qur'an mentions matters of the natural world, it does so as signs pointing to the Creator, in language that the people of every age can understand, and these indications are real and remarkable. But the believer must be careful: established scientific facts (things definitively known) can be appreciated as agreeing beautifully with the Qur'an, but scientific theories that may change should not be forcibly read into the text, nor should verses be twisted or stretched to claim a 'miracle' that the words do not truly bear. The Qur'an does not need exaggeration or forced interpretation to prove its truth; its miraculous nature stands on many firm grounds. Understood rightly, the agreement of the Qur'an with what science has discovered is a genuine and powerful sign of its divine origin and a source of strengthened faith. In the next section, we will look at clear examples of these scientific indications and the balanced way a young Muslim should understand them.",
        ar: "القُرآنُ الكَريمُ هو المُعجِزةُ الخالِدةُ لِلنَّبِيِّ مُحَمَّدٍ ﷺ. فَبَينَما كانَت مُعجِزاتُ الأنبياءِ السّابِقينَ أحداثًا حِسّيّةً شَهِدَها الحاضِرونَ ثُمَّ انقَضَت (كَعَصا موسى ومُعجِزاتِ شِفاءِ عيسى)، فَإنَّ القُرآنَ مُعجِزةٌ حَيّةٌ باقيةٌ تَبقى مَعَنا، تُتلى وتُشهَدُ في كُلِّ عَصر. وإعجازُهُ مُتَعَدِّدُ الوُجوه: تَحَدّى العَرَبَ الفُصَحاءَ، أربابَ لُغَتِهِم، أن يَأتوا بِسورةٍ واحِدةٍ مِثلِهِ فَعَجَزوا، معَ أنَّهُم أشَدُّ أعدائِه؛ ويَحوي أخبارًا صادِقةً عنِ الأُمَمِ الماضيةِ وعنِ الغَيب؛ وهو مُتَّسِقٌ تَمامًا في كُلِّهِ بِلا تَناقُض، معَ نُزولِهِ في ثَلاثٍ وعِشرينَ سَنة؛ وقَد هَدى وغَيَّرَ أفرادًا وحَضاراتٍ؛ وحُفِظَ كَما نَزَلَ كَما ضَمِنَ الله. ومِن وُجوهِ إعجازِ القُرآنِ الكَثيرةِ التي نَبَّهَ علَيها العُلَماءُ حَديثًا ما يُسَمّى الإشارةَ العِلميّةَ أوِ الإعجازَ العِلميّ: كَونُ القُرآنِ يَحوي عِباراتٍ عنِ الكَون — السَّماواتِ والأرضِ والبِحارِ والجِبالِ والأحياءِ والإنسان — تُوافِقُ ما اكتَشَفَهُ العِلمُ الحَديثُ في القُرونِ الأخيرةِ فَقَط، معَ نُزولِ القُرآنِ قَبلَ أربَعةَ عَشَرَ قَرنًا على نَبِيٍّ أُمّيٍّ في مُجتَمَعٍ بِلا شَيءٍ مِن أجهِزةِ العِلمِ الحَديث.\n\nوالقُرآنُ نَفسُهُ يُوَجِّهُ العَقلَ البَشَريَّ إلى التَّأَمُّلِ في الكَونِ وَسيلةً لِإدراكِ خالِقِهِ وصِدقِ وَحيِه. قالَ الله: ﴿سَنُريهِم آياتِنا في الآفاقِ وفي أنفُسِهِم حتّى يَتَبَيَّنَ لَهُم أنَّهُ الحَقّ﴾ (فُصِّلَت ٥٣) — واعِدًا بِأنَّ آياتِ الخَلق، في الكَونِ الواسِعِ (الآفاق) وفي الإنسانِ (أنفُسِهِم)، سَتُبَيِّنُ حَقَّ القُرآنِ شَيئًا فَشَيئًا. والقُرآنُ مَملوءٌ بِآياتٍ تَدعو إلى التَّأَمُّلِ في السَّماواتِ والأرض، واختِلافِ اللَّيلِ والنَّهار، والمَطَرِ والنَّبات، والبِحار، والجِبال، والدَّوابّ، وأطوارِ خَلقِ الإنسان — لا كَكِتابِ عِلم، بل كَآياتٍ تَدُلُّ على حِكمةِ الخالِقِ وقُدرَتِهِ ووَحدانيَّتِه. وفي أثناءِ هذا التَّأَمُّلِ لاحَظَ المُؤمِنونَ والباحِثونَ كَم تُوافِقُ عِباراتٌ قُرآنيّةٌ كَثيرةٌ عنِ الخَلقِ الحَقائِقَ العِلميّةَ الثّابِتةَ بِدِقّة.\n\nلكِنَّ مِنَ المُهِمِّ مِنَ البِدايةِ أن نَفهَمَ الإعجازَ العِلميَّ فَهمًا صَحيحًا مُتَوازِنًا، فَهذا مَجالٌ وَقَعَ فيهِ بَعضُهُم في الخَطأِ بِالمُبالَغة. فَالقُرآنُ كِتابُ هِدايةٍ لا كِتابُ عِلمٍ تَجريبيّ؛ غايَتُهُ هِدايةُ البَشَريّةِ إلى اللهِ والإيمانِ والعِبادةِ والحَياةِ الصّالِحة، لا تَعليمُ تَفاصيلِ الفيزياءِ أوِ الأحياء. وحينَ يَذكُرُ القُرآنُ شَيئًا مِنَ الكَونِ فَإنَّهُ يَذكُرُهُ آياتٍ تَدُلُّ على الخالِق، بِلِسانٍ يَفهَمُهُ أهلُ كُلِّ عَصر، وهذه الإشاراتُ حَقيقيّةٌ باهِرة. لكِن لِيَحذَرِ المُؤمِن: فَالحَقائِقُ العِلميّةُ الثّابِتةُ (المَعلومةُ قَطعًا) يُمكِنُ تَقديرُها مُوافِقةً جَميلةً لِلقُرآن، أمّا النَّظَرِيّاتُ العِلميّةُ التي قَد تَتَغَيَّرُ فَلا يَنبَغي حَملُ النَّصِّ علَيها قَسرًا، ولا لَيُّ الآياتِ أو تَكَلُّفُها لِادِّعاءِ «إعجازٍ» لا تَحمِلُهُ الكَلِماتُ حَقًّا. فَالقُرآنُ لا يَحتاجُ إلى مُبالَغةٍ ولا تَأويلٍ مُتَكَلَّفٍ لِيُثبِتَ صِدقَه؛ فَإعجازُهُ قائِمٌ على أُسُسٍ راسِخةٍ كَثيرة. وإذا فُهِمَ صَحيحًا، فَإنَّ مُوافَقةَ القُرآنِ لِما اكتَشَفَهُ العِلمُ دَليلٌ حَقيقيٌّ قَويٌّ على مَصدَرِهِ الإلهيِّ ومَصدَرُ إيمانٍ راسِخ. وفي القِسمِ التّالي نَنظُرُ في أمثِلةٍ واضِحةٍ مِن هذه الإشاراتِ العِلميّةِ والمَنهَجِ المُتَوازِنِ الذي يَنبَغي لِلشّابِّ المُسلِمِ أن يَفهَمَها بِه.",
      },
    },
    {
      title: { en: "Examples and the balanced approach", ar: "أمثِلةٌ والمَنهَجُ المُتَوازِن" },
      learningObjectives: [
        { en: "Give examples of scientific indications in the Qur'an.", ar: "أُعطي أمثِلةً لِلإشاراتِ العِلميّةِ في القُرآن." },
        { en: "Apply the balanced approach to understanding them.", ar: "أُطَبِّقُ المَنهَجَ المُتَوازِنَ في فَهمِها." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "Mountains, which the Qur'an describes as stabilisers.", ar: "الجِبالُ التي يَصِفُها القُرآنُ أوتادًا." },
        caption: { en: "'And He placed within the earth firmly set mountains' (An-Nahl 15).", ar: "﴿وألقى في الأرضِ رَواسيَ﴾ (النَّحل ١٥)." },
      },
      groupTasks: {
        title: { en: "Signs in creation", ar: "آياتٌ في الخَلق" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "examples-of-indications",
            name: { en: "Team A — Examples of scientific indications", ar: "الفَريقُ أ — أمثِلةُ الإشاراتِ العِلميّة" },
            learningObjective: { en: "Present clear examples of the Qur'an's scientific indications.", ar: "نَعرِضُ أمثِلةً واضِحةً لِإشاراتِ القُرآنِ العِلميّة." },
            task: { en: "Present clear examples of the Qur'an's agreement with established scientific facts, with the verse for each: the stages of the human embryo (Al-Mu'minun 12-14: nutfah, 'alaqah, mudghah, bones then flesh); the origin of the universe from a single mass and the role of water in life (Al-Anbiya 30); the expansion of the universe (Adh-Dhariyat 47); the barrier between two seas that do not mix (Ar-Rahman 19-20); mountains as stabilisers with roots (An-Naba 6-7, An-Nahl 15); and the development of the sense of hearing before sight in the embryo (verses placing hearing before sight). Explain each carefully and accurately. Present a 'signs in creation' display.", ar: "اعرِضوا أمثِلةً واضِحةً لِمُوافَقةِ القُرآنِ لِلحَقائِقِ العِلميّةِ الثّابِتة، معَ الآيةِ لِكُلٍّ: أطوارُ الجَنينِ البَشَريّ (المُؤمِنون ١٢-١٤: نُطفةٌ فَعَلَقةٌ فَمُضغةٌ فَعِظامٌ ثُمَّ لَحم)؛ ونَشأةُ الكَونِ مِن كُتلةٍ واحِدةٍ ودَورُ الماءِ في الحَياة (الأنبياء ٣٠)؛ وتَوَسُّعُ الكَون (الذّارِيات ٤٧)؛ والبَرزَخُ بَينَ بَحرَينِ لا يَبغيان (الرَّحمن ١٩-٢٠)؛ والجِبالُ أوتادًا ذاتَ جُذور (النَّبأ ٦-٧، النَّحل ١٥)؛ وتَقَدُّمُ حاسّةِ السَّمعِ على البَصَرِ في الجَنين (الآياتُ التي تُقَدِّمُ السَّمعَ على البَصَر). اشرَحوا كُلًّا بِدِقّةٍ وعِناية. اعرِضوا لَوحةَ «آياتٍ في الخَلق»." },
            evidence: [
              { en: "'Then We made the sperm-drop into a clinging clot...' (Al-Mu'minun 14).", ar: "﴿ثُمَّ خَلَقنا النُّطفةَ عَلَقة...﴾ (المُؤمِنون ١٤)." },
            ],
            sourceNotes: [
              { en: "Use established facts, and quote verses accurately.", ar: "استَعمِلوا الحَقائِقَ الثّابِتةَ، واقتَبِسوا الآياتِ بِدِقّة." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'signs in creation' display.", ar: "لَوحةُ «آياتٍ في الخَلق»." },
          },
          {
            slug: "balanced-approach",
            name: { en: "Team B — The balanced approach", ar: "الفَريقُ ب — المَنهَجُ المُتَوازِن" },
            learningObjective: { en: "Present the balanced approach to scientific i'jaz.", ar: "نَعرِضُ المَنهَجَ المُتَوازِنَ لِلإعجازِ العِلميّ." },
            task: { en: "Present the correct, balanced approach to the scientific i'jaz, so that students benefit from it without falling into error: remember that the Qur'an is a book of guidance, not a science textbook; appreciate the agreement of the Qur'an with established facts, but do not force changeable theories onto the text; do not twist or stretch verses to claim miracles they do not bear; rely on qualified scholars for both the meaning of the verse and the science; and remember that the Qur'an's truth rests on many proofs, so it needs no exaggeration. Show how this approach strengthens faith honestly. Present a 'balanced approach' guide.", ar: "اعرِضوا المَنهَجَ الصَّحيحَ المُتَوازِنَ لِلإعجازِ العِلميّ، لِيَنتَفِعَ الطُّلّابُ بِهِ دونَ وُقوعٍ في الخَطأ: تَذَكَّروا أنَّ القُرآنَ كِتابُ هِدايةٍ لا كِتابُ عِلم؛ وقَدِّروا مُوافَقةَ القُرآنِ لِلحَقائِقِ الثّابِتة، ولا تَحمِلوا النَّظَرِيّاتِ المُتَغَيِّرةَ علَيهِ قَسرًا؛ ولا تَلووا الآياتِ أو تَتَكَلَّفوها لِادِّعاءِ إعجازٍ لا تَحمِلُه؛ واعتَمِدوا على العُلَماءِ المُؤَهَّلينَ في مَعنى الآيةِ وفي العِلمِ مَعًا؛ وتَذَكَّروا أنَّ صِدقَ القُرآنِ قائِمٌ على أدِلّةٍ كَثيرة، فَلا يَحتاجُ مُبالَغة. بَيِّنوا كَيفَ يُقَوّي هذا المَنهَجُ الإيمانَ بِصِدق. اعرِضوا دَليلَ «المَنهَجِ المُتَوازِن»." },
            evidence: [
              { en: "'We will show them Our signs... until it becomes clear that it is the truth' (Fussilat 53).", ar: "﴿سَنُريهِم آياتِنا... حتّى يَتَبَيَّنَ لَهُم أنَّهُ الحَقّ﴾ (فُصِّلَت ٥٣)." },
            ],
            sourceNotes: [
              { en: "Truth needs no exaggeration; the Qur'an is a book of guidance.", ar: "الحَقُّ لا يَحتاجُ مُبالَغة؛ والقُرآنُ كِتابُ هِداية." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'balanced approach' guide.", ar: "دَليلُ «المَنهَجِ المُتَوازِن»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "The Qur'an and my faith", ar: "القُرآنُ وإيماني" },
        prompt: { en: "The agreement of the Qur'an — revealed fourteen centuries ago to an unlettered Prophet — with realities of the natural world that science discovered only recently is a genuine sign of its divine origin, when understood with balance (remembering the Qur'an is a book of guidance, not forcing changeable theories, and not stretching verses). Reflect on one example of the Qur'an's scientific indications that you find striking (such as the stages of the embryo, the expansion of the universe, or the barriers between seas). Write about how reflecting on the signs of Allah in creation, and their agreement with the Qur'an, strengthens your faith — and how you can appreciate this in the correct, balanced way without exaggeration or forced interpretation.", ar: "مُوافَقةُ القُرآنِ — المُنَزَّلِ قَبلَ أربَعةَ عَشَرَ قَرنًا على نَبِيٍّ أُمّيّ — لِحَقائِقَ كَونيّةٍ لَم يَكتَشِفها العِلمُ إلّا حَديثًا دَليلٌ حَقيقيٌّ على مَصدَرِهِ الإلهيّ، إذا فُهِمَ بِتَوازُن (تَذَكُّرًا أنَّ القُرآنَ كِتابُ هِداية، ودونَ حَملِ النَّظَرِيّاتِ المُتَغَيِّرة، ودونَ لَيِّ الآيات). تَأمَّل مِثالًا واحِدًا مِن إشاراتِ القُرآنِ العِلميّةِ تَراهُ باهِرًا (كَأطوارِ الجَنين، أو تَوَسُّعِ الكَون، أوِ البَرزَخِ بَينَ البِحار). اكتُب كَيفَ يُقَوّي التَّأَمُّلُ في آياتِ اللهِ في الخَلق، ومُوافَقَتُها لِلقُرآن، إيمانَك — وكَيفَ تُقَدِّرُ هذا بِالطَّريقةِ الصَّحيحةِ المُتَوازِنةِ دونَ مُبالَغةٍ أو تَأويلٍ مُتَكَلَّف." },
        placeholder: { en: "An example that strikes me is... It strengthens my faith because... and I will keep balance by...", ar: "مِثالٌ يَبهَرُني... ويُقَوّي إيماني لِأنَّ... وأحفَظُ التَّوازُنَ بِـ..." },
      },
      body: {
        en: "The Qur'an contains many statements about the natural world that agree remarkably with what modern science has established, and reflecting on a few clear examples shows the power of this sign. Among the most striking is the Qur'an's description of the stages of the human embryo: 'Then We made the sperm-drop (nutfah) into a clinging clot ('alaqah), and We made the clot into a lump (mudghah), and We made from the lump bones, and We covered the bones with flesh' (Al-Mu'minun 14). This precise sequence — a clinging stage, a chewed-lump-like stage, the formation of bones, and then their covering with muscle — accords closely with what embryology discovered only with the microscope, fourteen centuries after the verse was revealed. Likewise, the Qur'an states: 'Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them, and made from water every living thing?' (Al-Anbiya 30) — pointing both to the origin of the universe from a single mass and to the dependence of all life on water. The Qur'an speaks of the expansion of the universe: 'And the heaven We constructed with strength, and indeed, We are its expander' (Adh-Dhariyat 47). It describes the barrier (barzakh) between two bodies of water that meet yet do not fully mix: 'He released the two seas, meeting; between them is a barrier they do not transgress' (Ar-Rahman 19-20). And it describes the mountains as stabilising pegs with deep roots: 'Have We not made the earth a resting place, and the mountains as pegs?' (An-Naba 6-7). These and many other indications, revealed to an unlettered Prophet in a society with none of the means to discover them, are genuine signs pointing to the divine origin of the Qur'an.\n\nYet, as stressed earlier, these indications must be approached with care and balance, and this balanced approach is itself part of the lesson. The first principle is to remember always that the Qur'an is a book of guidance, not a textbook of science: its central purpose is to lead humanity to Allah, to faith, and to righteous living, and its statements about creation are signs (ayat) pointing to the Creator, not technical scientific instruction. The second principle is to distinguish between established scientific facts and changing theories: where the Qur'an agrees with something definitively known (such as the stages of the embryo), this agreement can be appreciated with confidence; but one should not force the text to match a theory that may be revised or overturned tomorrow, for to tie the Qur'an to a changeable theory is to risk the theory's fall dragging down people's confidence with it. The third principle is to avoid twisting, stretching, or over-reading verses to claim 'miracles' the words do not actually bear; such exaggeration, however well-intentioned, harms the cause of the Qur'an and exposes it to ridicule when the forced claims are refuted. The fourth principle is to rely on those qualified in both fields — sound scholars of tafsir for the meaning of the verse, and reliable specialists for the science — rather than on enthusiastic but unqualified claims. And the fifth principle is to remember that the Qur'an's truth rests on many firm proofs, so it never needs exaggeration or forced interpretation to be defended.\n\nUnderstood in this balanced way, the agreement of the Qur'an with the discoveries of science is a true and powerful strengthener of faith for a young Muslim, especially in an age that sometimes presents science and religion as opposed. Far from contradicting faith, the honest study of the natural world increases the believer's awe at the wisdom, power, and knowledge of the Creator, and the discovery that the Qur'an described such realities fourteen centuries ago confirms that it could only be from the One who created those realities — 'We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth' (Fussilat 53). The believer thus looks at the universe and at the human being not as a godless machine, but as a vast book of signs, every one of which points back to its Maker, and finds that the Qur'an, the book of words, and the universe, the book of creation, both bear witness to the same truth. To reflect on the signs of Allah in creation, to appreciate honestly and without exaggeration how the Qur'an accords with what science has discovered, and to let this deepen one's awe of the Creator and certainty in His Book — this is how a young Muslim turns the knowledge of the modern age into a means of stronger, not weaker, faith.",
        ar: "يَحوي القُرآنُ عِباراتٍ كَثيرةً عنِ الكَونِ تُوافِقُ بِشَكلٍ باهِرٍ ما أثبَتَهُ العِلمُ الحَديث، والتَّأَمُّلُ في أمثِلةٍ واضِحةٍ يُظهِرُ قُوّةَ هذه الآية. ومِن أبهَرِها وَصفُ القُرآنِ لِأطوارِ الجَنينِ البَشَريّ: ﴿ثُمَّ خَلَقنا النُّطفةَ عَلَقةً فَخَلَقنا العَلَقةَ مُضغةً فَخَلَقنا المُضغةَ عِظامًا فَكَسَونا العِظامَ لَحمًا﴾ (المُؤمِنون ١٤). هذا التَّسَلسُلُ الدَّقيق — طَورُ التَّعَلُّق، فَطَورٌ يُشبِهُ اللُّقمةَ المَمضوغة، فَتَكَوُّنُ العِظام، ثُمَّ كَسوُها بِالعَضَل — يُوافِقُ بِدِقّةٍ ما اكتَشَفَهُ عِلمُ الأجِنّةِ بِالمَجهَرِ فَقَط، بَعدَ أربَعةَ عَشَرَ قَرنًا مِن نُزولِ الآية. وكَذلك يَقولُ القُرآن: ﴿أوَلَم يَرَ الذينَ كَفَروا أنَّ السَّماواتِ والأرضَ كانَتا رَتقًا فَفَتَقناهُما وجَعَلنا مِنَ الماءِ كُلَّ شَيءٍ حَيّ﴾ (الأنبياء ٣٠) — مُشيرًا إلى نَشأةِ الكَونِ مِن كُتلةٍ واحِدةٍ وإلى تَوَقُّفِ كُلِّ حَياةٍ على الماء. ويَتَحَدَّثُ القُرآنُ عن تَوَسُّعِ الكَون: ﴿والسَّماءَ بَنَيناها بِأيدٍ وإنّا لَموسِعون﴾ (الذّارِيات ٤٧). ويَصِفُ البَرزَخَ بَينَ ماءَينِ يَلتَقيانِ ولا يَختَلِطانِ تَمامًا: ﴿مَرَجَ البَحرَينِ يَلتَقيان. بَينَهُما بَرزَخٌ لا يَبغيان﴾ (الرَّحمن ١٩-٢٠). ويَصِفُ الجِبالَ أوتادًا مُثَبِّتةً ذاتَ جُذور: ﴿ألَم نَجعَلِ الأرضَ مِهادًا والجِبالَ أوتادًا﴾ (النَّبأ ٦-٧). وهذه الإشاراتُ وغَيرُها كَثير، نَزَلَت على نَبِيٍّ أُمّيٍّ في مُجتَمَعٍ بِلا وَسيلةٍ لِاكتِشافِها، آياتٌ حَقيقيّةٌ تَدُلُّ على مَصدَرِ القُرآنِ الإلهيّ.\n\nلكِن، كَما سَبَقَ التَّأكيد، لا بُدَّ مِن تَناوُلِ هذه الإشاراتِ بِعِنايةٍ وتَوازُن، وهذا المَنهَجُ المُتَوازِنُ نَفسُهُ جُزءٌ مِنَ الدَّرس. فَالمَبدَأُ الأوّلُ أن نَتَذَكَّرَ دائِمًا أنَّ القُرآنَ كِتابُ هِدايةٍ لا كِتابُ عِلم: غايَتُهُ الكُبرى هِدايةُ البَشَريّةِ إلى اللهِ والإيمانِ والحَياةِ الصّالِحة، وعِباراتُهُ عنِ الخَلقِ آياتٌ تَدُلُّ على الخالِق، لا تَعليمٌ عِلميٌّ تَقنيّ. والمَبدَأُ الثّاني التَّمييزُ بَينَ الحَقائِقِ العِلميّةِ الثّابِتةِ والنَّظَرِيّاتِ المُتَغَيِّرة: فَحَيثُ يُوافِقُ القُرآنُ شَيئًا مَعلومًا قَطعًا (كَأطوارِ الجَنين) يُقَدَّرُ هذا التَّوافُقُ بِثِقة؛ أمّا أن يُحمَلَ النَّصُّ على نَظَرِيّةٍ قَد تُراجَعُ أو تَسقُطُ غَدًا فَخَطَر، فَرَبطُ القُرآنِ بِنَظَرِيّةٍ مُتَغَيِّرةٍ قَد يَجُرُّ سُقوطُها ثِقةَ النّاسِ مَعَها. والمَبدَأُ الثّالِثُ اجتِنابُ لَيِّ الآياتِ أو تَكَلُّفِها أوِ المُبالَغةِ في قِراءَتِها لِادِّعاءِ «إعجازٍ» لا تَحمِلُهُ الكَلِماتُ حَقًّا؛ فَمِثلُ هذه المُبالَغةِ، معَ حُسنِ النِّيّة، تَضُرُّ بِقَضيّةِ القُرآنِ وتُعَرِّضُهُ لِلسُّخريةِ حينَ تُرَدُّ الدَّعاوى المُتَكَلَّفة. والمَبدَأُ الرّابِعُ الاعتِمادُ على المُؤَهَّلينَ في المَجالَين — عُلَماءِ التَّفسيرِ الثِّقاتِ لِمَعنى الآية، والمُختَصّينَ المَوثوقينَ لِلعِلم — لا على الدَّعاوى المُتَحَمِّسةِ غَيرِ المُؤَهَّلة. والمَبدَأُ الخامِسُ أن نَتَذَكَّرَ أنَّ صِدقَ القُرآنِ قائِمٌ على أدِلّةٍ راسِخةٍ كَثيرة، فَلا يَحتاجُ أبَدًا إلى مُبالَغةٍ أو تَأويلٍ مُتَكَلَّفٍ لِيُدافَعَ عَنه.\n\nوإذا فُهِمَ بِهذا التَّوازُن، فَإنَّ مُوافَقةَ القُرآنِ لِاكتِشافاتِ العِلمِ مُقَوٍّ حَقيقيٌّ قَويٌّ لِإيمانِ الشّابِّ المُسلِم، خاصّةً في عَصرٍ يُصَوِّرُ أحيانًا العِلمَ والدّينَ مُتَعارِضَين. فَدِراسةُ الكَونِ الصّادِقةُ، بَعيدًا عن مُناقَضةِ الإيمان، تَزيدُ المُؤمِنَ إعظامًا لِحِكمةِ الخالِقِ وقُدرَتِهِ وعِلمِه، واكتِشافُ أنَّ القُرآنَ وَصَفَ هذه الحَقائِقَ قَبلَ أربَعةَ عَشَرَ قَرنًا يُؤَكِّدُ أنَّهُ لا يَكونُ إلّا مِنَ الذي خَلَقَ تِلكَ الحَقائِق — ﴿سَنُريهِم آياتِنا في الآفاقِ وفي أنفُسِهِم حتّى يَتَبَيَّنَ لَهُم أنَّهُ الحَقّ﴾ (فُصِّلَت ٥٣). فَيَنظُرُ المُؤمِنُ إلى الكَونِ وإلى الإنسانِ لا كَآلةٍ بِلا إله، بل كَكِتابٍ عَظيمٍ مِنَ الآيات، كُلُّ آيةٍ فيهِ تَدُلُّ على صانِعِها، ويَجِدُ أنَّ القُرآنَ، كِتابَ الكَلِمات، والكَونَ، كِتابَ الخَلق، كِلَيهِما يَشهَدانِ بِالحَقِّ نَفسِه. وأن يَتَأَمَّلَ المَرءُ آياتِ اللهِ في الخَلق، ويُقَدِّرَ بِصِدقٍ ودونَ مُبالَغةٍ كَيفَ يُوافِقُ القُرآنُ ما اكتَشَفَهُ العِلم، ويَدَعَ ذلك يُعَمِّقُ إعظامَهُ لِلخالِقِ ويَقينَهُ بِكِتابِه — بِهذا يُحَوِّلُ الشّابُّ المُسلِمُ مَعارِفَ العَصرِ الحَديثِ إلى وَسيلةِ إيمانٍ أقوى لا أضعَف.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the everlasting miracle of the Prophet Muhammad ﷺ?", ar: "ما المُعجِزةُ الخالِدةُ لِلنَّبِيِّ مُحَمَّدٍ ﷺ؟" },
      options: [
        { en: "The Noble Qur'an", ar: "القُرآنُ الكَريم" },
        { en: "A staff", ar: "عَصا" },
        { en: "A building", ar: "بِناء" },
        { en: "A treasure", ar: "كَنز" },
      ],
      correctIndex: 0,
      explanation: { en: "Unlike earlier physical miracles, the Qur'an is a living, lasting miracle.", ar: "بِخِلافِ المُعجِزاتِ الحِسّيّةِ السّابِقة، القُرآنُ مُعجِزةٌ حَيّةٌ باقية." },
    },
    {
      prompt: { en: "What does Al-Anbiya 30 indicate?", ar: "علامَ تَدُلُّ الأنبياء ٣٠؟" },
      options: [
        { en: "The heavens and earth were joined then separated, and life is from water", ar: "السَّماواتُ والأرضُ كانَتا رَتقًا فَفُتِقَتا، والحَياةُ مِنَ الماء" },
        { en: "Nothing about creation", ar: "لا شَيءَ عنِ الخَلق" },
        { en: "Only history", ar: "التّاريخُ فَقَط" },
        { en: "A legal ruling", ar: "حُكمٌ فِقهيّ" },
      ],
      correctIndex: 0,
      explanation: { en: "'...and We made from water every living thing.'", ar: "﴿وجَعَلنا مِنَ الماءِ كُلَّ شَيءٍ حَيّ﴾." },
    },
    {
      prompt: { en: "What is the most important principle in understanding scientific i'jaz?", ar: "ما أهَمُّ مَبدَأٍ في فَهمِ الإعجازِ العِلميّ؟" },
      options: [
        { en: "The Qur'an is a book of guidance, not a science textbook", ar: "القُرآنُ كِتابُ هِدايةٍ لا كِتابُ عِلم" },
        { en: "The Qur'an is mainly a science textbook", ar: "القُرآنُ أساسًا كِتابُ عِلم" },
        { en: "Force theories onto verses", ar: "حَملُ النَّظَرِيّاتِ على الآيات" },
        { en: "Exaggerate every claim", ar: "المُبالَغةُ في كُلِّ دَعوى" },
      ],
      correctIndex: 0,
      explanation: { en: "Its statements about creation are signs pointing to the Creator.", ar: "عِباراتُهُ عنِ الخَلقِ آياتٌ تَدُلُّ على الخالِق." },
    },
    {
      prompt: { en: "How should one treat changeable scientific theories?", ar: "كَيفَ نُعامِلُ النَّظَرِيّاتِ العِلميّةَ المُتَغَيِّرة؟" },
      options: [
        { en: "Do not force them onto the text", ar: "لا نَحمِلُها على النَّصِّ قَسرًا" },
        { en: "Tie the Qur'an firmly to them", ar: "نَربِطُ القُرآنَ بِها بِإحكام" },
        { en: "Treat them as certain", ar: "نَعُدُّها قَطعيّة" },
        { en: "Ignore established facts", ar: "نُهمِلُ الحَقائِقَ الثّابِتة" },
      ],
      correctIndex: 0,
      explanation: { en: "Theories may change; only established facts should be appreciated with confidence.", ar: "النَّظَرِيّاتُ قَد تَتَغَيَّر؛ والثّابِتُ وَحدَهُ يُقَدَّرُ بِثِقة." },
    },
    {
      prompt: { en: "What did the Qur'an describe about the human embryo?", ar: "ماذا وَصَفَ القُرآنُ عنِ الجَنينِ البَشَريّ؟" },
      options: [
        { en: "Stages: nutfah, 'alaqah, mudghah, bones then flesh", ar: "أطوارًا: نُطفةً فَعَلَقةً فَمُضغةً فَعِظامًا ثُمَّ لَحمًا" },
        { en: "Nothing", ar: "لا شَيء" },
        { en: "Only its weight", ar: "وَزنَهُ فَقَط" },
        { en: "Its name", ar: "اسمَه" },
      ],
      correctIndex: 0,
      explanation: { en: "A precise sequence confirmed by modern embryology (Al-Mu'minun 14).", ar: "تَسَلسُلٌ دَقيقٌ أكَّدَهُ عِلمُ الأجِنّةِ الحَديث (المُؤمِنون ١٤)." },
    },
    {
      prompt: { en: "True or False: The Qur'an needs exaggerated claims to prove its truth.", ar: "صَوابٌ أم خَطأ: يَحتاجُ القُرآنُ إلى دَعاوى مُبالَغٍ فيها لِيُثبِتَ صِدقَه." },
      options: [
        { en: "False", ar: "خَطأ" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Its truth rests on many firm proofs; exaggeration only harms it.", ar: "صِدقُهُ على أدِلّةٍ راسِخةٍ كَثيرة، والمُبالَغةُ تَضُرُّه." },
    },
  ],
};
