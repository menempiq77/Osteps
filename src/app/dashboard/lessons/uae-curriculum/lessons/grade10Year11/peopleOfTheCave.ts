import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const peopleOfTheCave: CourseLesson = {
  slug: "g10y11-the-people-of-the-cave",
  name: { en: "The People of the Cave", ar: "أصحابُ الكَهف" },
  shortIntro: {
    en: "The story of the People of the Cave (Ashab al-Kahf) in Surat Al-Kahf is one of the great Qur'anic narratives of faith. A group of young believers fled the persecution of a tyrant to preserve their belief in the One God, and Allah caused them to sleep in a cave for many years and then awoke them as a sign. This lesson studies their story and its lessons of faith, courage, and trust in Allah.",
    ar: "قِصّةُ أصحابِ الكَهفِ في سورةِ الكَهفِ مِن عَظائِمِ قَصَصِ الإيمانِ القُرآنيّ. فِتيةٌ مُؤمِنونَ فَرّوا مِن بَطشِ طاغيةٍ لِيَحفَظوا إيمانَهُم بِاللهِ الواحِد، فَأنامَهُمُ اللهُ في الكَهفِ سِنينَ كَثيرة، ثُمَّ بَعَثَهُم آيةً. يَدرُسُ هذا الدَّرسُ قِصَّتَهُم ودُروسَها في الإيمانِ والشَّجاعةِ والتَّوَكُّلِ على الله.",
  },
  quranSurahs: ["Al-Kahf 13-16", "Al-Kahf 9-10"],
  sections: [
    {
      title: { en: "The young believers who fled for their faith", ar: "الفِتيةُ المُؤمِنونَ الذينَ هاجَروا بِدينِهِم" },
      learningObjectives: [
        { en: "Recount the story of the People of the Cave from Surat Al-Kahf.", ar: "أحكي قِصّةَ أصحابِ الكَهفِ مِن سورةِ الكَهف." },
        { en: "Explain why Allah honoured their stand for faith.", ar: "أشرَحُ لِمَ أكرَمَ اللهُ ثَباتَهُم على الإيمان." },
      ],
      successCriteria: [
        { en: "I can describe their flight to the cave and Allah's protection.", ar: "أصِفُ هِجرَتَهُم إلى الكَهفِ وحِفظَ اللهِ لَهُم." },
        { en: "I can explain the lesson of choosing faith over comfort.", ar: "أشرَحُ دَرسَ إيثارِ الإيمانِ على الرّاحة." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A mountain cave — the refuge of the young believers.", ar: "كَهفٌ في جَبَل — مَلجَأُ الفِتيةِ المُؤمِنين." },
        caption: { en: "'They were youths who believed in their Lord, and We increased them in guidance' (Al-Kahf 13).", ar: "﴿إنَّهُم فِتيةٌ آمَنوا بِرَبِّهِم وزِدناهُم هُدًى﴾ (الكهف ١٣)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "What would you sacrifice to protect your faith?", ar: "ماذا تُضَحّي بِهِ لِتَحفَظَ إيمانَك؟" },
        body: {
          en: "The young men of the cave gave up their homes, their society, their comfort, and their safety rather than abandon their belief in the One God. Reflect: faith is the most precious thing a person possesses. How far should a believer go to protect their faith and conscience? And what does their story teach about trusting Allah completely when you make the right choice but cannot see the outcome?",
          ar: "تَرَكَ فِتيةُ الكَهفِ دِيارَهُم ومُجتَمَعَهُم وراحَتَهُم وأمنَهُم ولم يَترُكوا إيمانَهُم بِاللهِ الواحِد. تَأمَّل: الإيمانُ أنفَسُ ما يَملِكُ الإنسان. إلى أيِّ مَدًى يَنبَغي لِلمُؤمِنِ أن يَذهَبَ لِيَحفَظَ إيمانَهُ وضَميرَه؟ وماذا تُعَلِّمُ قِصَّتُهُم عنِ التَّوَكُّلِ على اللهِ كامِلًا حينَ تَختارُ الصَّوابَ ولا تَرى العاقِبة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Ashab al-Kahf (أصحابُ الكَهف): the People/Companions of the Cave.", ar: "أصحابُ الكَهف: الفِتيةُ الذينَ أوَوا إلى الكَهف." },
            { en: "Fityah (فِتية): young men — they were youths firm in faith.", ar: "فِتية: شَبابٌ — كانوا فِتيةً ثابِتينَ على الإيمان." },
          ],
        },
        {
          label: { en: "Where in the Qur'an", ar: "مَوضِعُها في القُرآن" },
          lines: [
            { en: "Their story is told in Surat Al-Kahf, the surah of trials and faith.", ar: "قِصَّتُهُم في سورةِ الكَهف، سورةِ الفِتَنِ والإيمان." },
          ],
        },
      ],
      body: {
        en: "The story of the People of the Cave (Ashab al-Kahf) is one of the most striking narratives in the Qur'an, told in Surat Al-Kahf, the surah revealed to strengthen believers against the trials (fitan) of life. The People of the Cave were a group of young men who lived in a society sunk in disbelief and idol-worship, ruled by a tyrannical king who persecuted anyone who worshipped Allah alone. Yet in the midst of this corruption, these youths recognised the truth: that there is no god worthy of worship except Allah, the Creator of the heavens and the earth. Allah describes them with honour: 'They were youths who believed in their Lord, and We increased them in guidance. And We bound up their hearts when they stood up and said, Our Lord is the Lord of the heavens and the earth; never will we invoke besides Him any deity. We would have certainly spoken an excessive transgression' (Al-Kahf 13-14). They had the courage to declare their faith openly, to reject the false gods their people worshipped, and to affirm the absolute Oneness (tawhid) of Allah — and Allah responded by strengthening their hearts and increasing their guidance.\n\nWhen the tyrant and their people threatened them, demanding they return to idolatry or be killed, the young believers faced a momentous choice: abandon their faith to save their worldly lives, or hold to the truth at any cost. They chose their faith. Rather than compromise their belief in Allah, they decided to flee — to leave their homes, their families, their society, and all their worldly comforts and security — and to take refuge in a cave in the mountains, placing their trust entirely in Allah. As they entered the cave they prayed: 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance' (Al-Kahf 10). This act of leaving everything behind for the sake of preserving one's faith is a form of hijrah — migration for the sake of Allah — and it shows the highest priority a believer places on faith above all worldly things. They did not know how their situation would end; they could not see the outcome. But they did the right thing — choosing Allah over the world — and trusted Him completely with the result.\n\nAllah honoured their faith and their trust with a tremendous sign. In response to their reliance upon Him, He caused them to fall into a deep, protected sleep within the cave — a sleep that lasted not for hours or days, but for many years (the Qur'an mentions three hundred years and nine more, Al-Kahf 25). Throughout this time Allah protected them: He turned them to the right and the left so their bodies would not be harmed by lying still, He kept the sun from reaching them directly, and He placed an awe about them so that anyone who saw them would be filled with fear and leave them undisturbed (Al-Kahf 17-18). When at last Allah awoke them, they thought they had slept only a day or part of a day, and when they sent one of their number into the town to buy food with their old coins, the people of that age discovered them — and their awakening became a clear sign to that generation of the power of Allah over life and death, and a proof of the truth of the resurrection. In the next section we draw out the great lessons of their story for the believer in every age.",
        ar: "قِصّةُ أصحابِ الكَهفِ مِن أبهَرِ ما في القُرآنِ مِنَ القَصَص، وَرَدَت في سورةِ الكَهف، السّورةِ المُنَزَّلةِ لِتَثبيتِ المُؤمِنينَ على فِتَنِ الحَياة. كانَ أصحابُ الكَهفِ فِتيةً عاشوا في مُجتَمَعٍ غارِقٍ في الكُفرِ وعِبادةِ الأصنام، يَحكُمُهُ مَلِكٌ طاغيةٌ يَضطَهِدُ مَن عَبَدَ اللهَ وَحدَه. ومعَ ذلك، وَسطَ هذا الفَساد، أدرَكَ هؤلاءِ الشَّبابُ الحَقّ: أن لا مَعبودَ بِحَقٍّ إلّا اللهُ خالِقُ السَّماواتِ والأرض. ويَصِفُهُمُ اللهُ بِالتَّكريم: ﴿إنَّهُم فِتيةٌ آمَنوا بِرَبِّهِم وزِدناهُم هُدًى ۝ ورَبَطنا على قُلوبِهِم إذ قاموا فَقالوا رَبُّنا رَبُّ السَّماواتِ والأرضِ لَن نَدعوَ مِن دونِهِ إلهًا لَقَد قُلنا إذًا شَطَطًا﴾ (الكهف ١٣-١٤). كانَت لَهُمُ الشَّجاعةُ أن يُعلِنوا إيمانَهُم، ويَرفُضوا آلِهةَ قَومِهِمِ الباطِلة، ويُثبِتوا تَوحيدَ اللهِ المُطلَق — فَأجابَهُمُ اللهُ بِأن رَبَطَ على قُلوبِهِم وزادَهُم هُدًى.\n\nولَمّا هَدَّدَهُمُ الطّاغيةُ وقَومُهُم، يَطلُبونَ رُجوعَهُم إلى الوَثَنيّةِ أوِ القَتل، واجَهَ الفِتيةُ المُؤمِنونَ خِيارًا مَصيريًّا: أن يَترُكوا إيمانَهُم لِيُنقِذوا حَياتَهُمُ الدُّنيا، أو يَثبُتوا على الحَقِّ مَهما كَلَّفَهُم. فاختاروا إيمانَهُم. وبَدَلًا مِنَ التَّفريطِ في إيمانِهِم بِالله، عَزَموا على الفِرار — أن يَترُكوا دِيارَهُم وأهلَهُم ومُجتَمَعَهُم وكُلَّ راحَتِهِمِ الدُّنيَويّةِ وأمنِهِم — ويَأووا إلى كَهفٍ في الجِبال، واضِعينَ ثِقَتَهُم كُلَّها في الله. وعِندَ دُخولِهِمِ الكَهفَ دَعَوا: ﴿رَبَّنا آتِنا مِن لَدُنكَ رَحمةً وهَيِّئ لَنا مِن أمرِنا رَشَدًا﴾ (الكهف ١٠). وتَركُ كُلِّ شَيءٍ خَلفَهُم لِأجلِ حِفظِ الإيمانِ نَوعٌ مِنَ الهِجرةِ في سَبيلِ الله، يُظهِرُ أعلى أولَويّةٍ يَضَعُها المُؤمِنُ لِلإيمانِ فَوقَ كُلِّ دُنيا. لم يَعلَموا كَيفَ يَنتَهي أمرُهُم؛ ولم يَرَوا العاقِبة. لكِنَّهُم فَعَلوا الصَّواب — إيثارَ اللهِ على الدُّنيا — وتَوَكَّلوا علَيهِ في النَّتيجةِ كامِلًا.\n\nوأكرَمَ اللهُ إيمانَهُم وتَوَكُّلَهُم بِآيةٍ عَظيمة. فاستِجابةً لِاعتِمادِهِم علَيه، أنامَهُم نَومًا عَميقًا مَحفوظًا في الكَهف — نَومًا لم يَدُم ساعاتٍ ولا أيّامًا، بل سِنينَ كَثيرة (ذَكَرَ القُرآنُ ثَلاثَمِئةٍ وتِسعًا، الكهف ٢٥). وطَوالَ ذلك حَفِظَهُمُ الله: يُقَلِّبُهُم ذاتَ اليَمينِ وذاتَ الشِّمالِ لِئَلّا تَتلَفَ أجسادُهُم، ويَصرِفُ عَنهُمُ الشَّمسَ أن تُصيبَهُم مُباشَرة، وألقى علَيهِم هَيبةً يَمتَلِئُ مِنها كُلُّ مَن رَآهُم رُعبًا فَيَترُكُهُم (الكهف ١٧-١٨). ولَمّا بَعَثَهُمُ اللهُ أخيرًا، ظَنّوا أنَّهُم لَبِثوا يَومًا أو بَعضَ يَوم، ولَمّا أرسَلوا أحَدَهُم إلى المَدينةِ لِيَشتَريَ طَعامًا بِعُملَتِهِمِ القَديمة، اكتَشَفَهُم أهلُ ذلك العَصر — فَصارَ بَعثُهُم آيةً واضِحةً لِذلك الجيلِ على قُدرةِ اللهِ على الحَياةِ والمَوت، ودَليلًا على صِدقِ البَعث. وفي القِسمِ التّالي نَستَخرِجُ دُروسَ قِصَّتِهِمِ العَظيمةَ لِلمُؤمِنِ في كُلِّ عَصر.",
      },
    },
    {
      title: { en: "Lessons of faith, courage, and trust", ar: "دُروسُ الإيمانِ والشَّجاعةِ والتَّوَكُّل" },
      learningObjectives: [
        { en: "Extract the lessons of the People of the Cave for today.", ar: "أستَخرِجُ دُروسَ أصحابِ الكَهفِ لِلحاضِر." },
        { en: "Explain how their story proves the resurrection.", ar: "أشرَحُ كَيفَ تَدُلُّ قِصَّتُهُم على البَعث." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "Dawn light — the awakening and the sign of resurrection.", ar: "ضَوءُ الفَجر — البَعثُ وآيةُ القِيامة." },
        caption: { en: "Their awakening was a sign of Allah's power over life and death.", ar: "بَعثُهُم آيةٌ على قُدرةِ اللهِ على الحَياةِ والمَوت." },
      },
      groupTasks: {
        title: { en: "Faith that does not bend", ar: "إيمانٌ لا يَنحَني" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "youth-and-faith",
            name: { en: "Team A — Youth and faith", ar: "الفَريقُ أ — الشَّبابُ والإيمان" },
            learningObjective: { en: "Present the lesson of the believing youth.", ar: "نَعرِضُ دَرسَ الفِتيةِ المُؤمِنين." },
            task: { en: "Present what the story teaches about young people and faith. Allah honoured these youths (fityah) for standing firm on tawhid in a corrupt society, gave them courage to declare the truth, and strengthened their hearts. Show that young age is no obstacle to deep faith and great deeds, that standing for the truth among those who oppose it takes courage, and that Allah strengthens the heart of whoever sincerely turns to Him. Connect this to the pressures young Muslims face today to follow the crowd against their faith. Present a 'courage of the believing youth' charter.", ar: "اعرِضوا ما تُعَلِّمُهُ القِصّةُ عنِ الشَّبابِ والإيمان. أكرَمَ اللهُ هؤلاءِ الفِتيةَ لِثَباتِهِم على التَّوحيدِ في مُجتَمَعٍ فاسِد، ومَنَحَهُمُ الشَّجاعةَ لِإعلانِ الحَقّ، ورَبَطَ على قُلوبِهِم. بَيِّنوا أنَّ صِغَرَ السِّنِّ لَيسَ عائِقًا عنِ الإيمانِ العَميقِ والعَمَلِ العَظيم، وأنَّ الوُقوفَ معَ الحَقِّ بَينَ مُعارِضيهِ يَحتاجُ شَجاعة، وأنَّ اللهَ يُثَبِّتُ قَلبَ مَن أقبَلَ علَيهِ بِصِدق. اربِطوا ذلك بِضُغوطِ الشَّبابِ المُسلِمِ اليَومَ لِمُجاراةِ النّاسِ ضِدَّ دينِهِم. اعرِضوا ميثاقَ «شَجاعةِ الفِتيةِ المُؤمِنين»." },
            evidence: [
              { en: "'They were youths who believed in their Lord, and We increased them in guidance' (Al-Kahf 13).", ar: "﴿إنَّهُم فِتيةٌ آمَنوا بِرَبِّهِم وزِدناهُم هُدًى﴾ (الكهف ١٣)." },
            ],
            sourceNotes: [
              { en: "Allah strengthens the hearts of those who stand for Him.", ar: "اللهُ يَربِطُ على قُلوبِ مَن قاموا لَه." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'courage of the believing youth' charter.", ar: "ميثاقُ «شَجاعةِ الفِتيةِ المُؤمِنين»." },
          },
          {
            slug: "trust-and-resurrection",
            name: { en: "Team B — Trust and the resurrection", ar: "الفَريقُ ب — التَّوَكُّلُ والبَعث" },
            learningObjective: { en: "Present trust in Allah and the proof of resurrection.", ar: "نَعرِضُ التَّوَكُّلَ على اللهِ ودَليلَ البَعث." },
            task: { en: "Present two deeper lessons. First, trust in Allah (tawakkul): the youths did the right thing and left the outcome to Allah, who protected them in ways they could never have arranged — teaching that when we obey Allah and rely on Him, He suffices and provides from where we do not expect. Second, the proof of resurrection: their sleep of centuries and their awakening was a living sign that the One who can preserve and then revive them after so long can surely raise all people after death. Show how their story strengthens belief in the Last Day. Present a 'trust in Allah and proof of resurrection' display.", ar: "اعرِضوا دَرسَينِ أعمَق. الأوَّلُ التَّوَكُّلُ على الله: فَعَلَ الفِتيةُ الصَّوابَ وتَرَكوا العاقِبةَ للهِ الذي حَفِظَهُم بِما لم يَكُن في حُسبانِهِم — فَنَتَعَلَّمُ أنَّنا إذا أطَعنا اللهَ وتَوَكَّلنا علَيهِ كَفانا ورَزَقَنا مِن حَيثُ لا نَحتَسِب. والثّاني دَليلُ البَعث: نَومُهُم قُرونًا ثُمَّ بَعثُهُم آيةٌ حَيّةٌ على أنَّ مَن قَدَرَ على حِفظِهِم ثُمَّ إحيائِهِم بَعدَ هذه المُدّةِ قادِرٌ على بَعثِ النّاسِ جَميعًا بَعدَ المَوت. بَيِّنوا كَيفَ تُقَوّي قِصَّتُهُمُ الإيمانَ بِاليَومِ الآخِر. اعرِضوا لَوحةَ «التَّوَكُّلِ على اللهِ ودَليلِ البَعث»." },
            evidence: [
              { en: "'And similarly, We awakened them that they might question one another' (Al-Kahf 19).", ar: "﴿وكَذلِكَ بَعَثناهُم لِيَتَساءَلوا بَينَهُم﴾ (الكهف ١٩)." },
            ],
            sourceNotes: [
              { en: "Whoever relies on Allah, He is sufficient for him (At-Talaq 3).", ar: "ومَن يَتَوَكَّل على اللهِ فَهو حَسبُه (الطلاق ٣)." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'trust and resurrection' display.", ar: "لَوحةُ «التَّوَكُّلِ والبَعث»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Standing firm like the youth of the cave", ar: "ثَباتٌ كَفِتيةِ الكَهف" },
        prompt: { en: "The People of the Cave gave up everything rather than abandon their faith, and Allah protected and honoured them. Reflect on a situation where you feel pressure to go against your faith or values to fit in — among friends, online, or in society. What would standing firm like the youth of the cave look like for you? Write about one way you will choose your faith over the pressure to conform, and how trusting Allah with the outcome can give you courage.", ar: "تَرَكَ أصحابُ الكَهفِ كُلَّ شَيءٍ ولم يَترُكوا إيمانَهُم، فَحَفِظَهُمُ اللهُ وأكرَمَهُم. تَأمَّل مَوقِفًا تَشعُرُ فيهِ بِضَغطٍ لِمُخالَفةِ دينِكَ أو قِيَمِكَ لِتُجاريَ النّاس — بَينَ الأصحاب، أو على الإنتَرنِت، أو في المُجتَمَع. كَيفَ يَكونُ الثَّباتُ كَفِتيةِ الكَهفِ في حالِك؟ اكتُب طَريقةً واحِدةً سَتَختارُ بِها إيمانَكَ على ضَغطِ المُجاراة، وكَيفَ يَمنَحُكَ التَّوَكُّلُ على اللهِ في العاقِبةِ شَجاعة." },
        placeholder: { en: "I feel pressure to... Standing firm would mean... I will trust Allah by...", ar: "أشعُرُ بِضَغطٍ لِـ... والثَّباتُ يَعني... وسَأتَوَكَّلُ على اللهِ بِـ..." },
      },
      body: {
        en: "The story of the People of the Cave is not merely a record of a wondrous event; it is a treasury of lessons that the Qur'an preserves for believers of every age, and it carries special meaning for the young. The first and greatest lesson is the supreme value of faith and the duty to protect it at any cost. These youths possessed nothing more precious than their belief in Allah, and they were willing to lose their homes, their families, their society, and their safety rather than lose their faith. This teaches the believer that faith is the most valuable thing a person owns, and that no worldly gain — not safety, not status, not the approval of others — is worth purchasing at the price of one's religion. In a world that constantly pressures people to compromise their beliefs to fit in or to gain worldly advantage, the youth of the cave stand as a timeless example of holding to the truth whatever the cost.\n\nThe second great lesson is the courage of faith and the honour Allah gives to sincere youth. The Qur'an specifically calls them fityah — young men — and praises them for standing up, in the midst of a hostile society, and openly declaring the Oneness of Allah and rejecting the false gods of their people. This refutes any notion that deep faith and great moral courage belong only to the old; rather, Allah honoured these young believers above their entire generation. For the young Muslim, this is a powerful encouragement: that youth is a time of strength, and that Allah can guide and strengthen the heart of a young person to stand firm for the truth even when those around them oppose it. Allah Himself describes how He strengthened them: 'And We bound up their hearts when they stood up' (Al-Kahf 14) — showing that whoever sincerely takes a stand for Allah will find Allah strengthening and supporting them.\n\nThe third lesson is the beauty and power of trust in Allah (tawakkul). The young men did the right thing — choosing faith and fleeing for its sake — but they could not control or even foresee the outcome. They simply did their duty and placed the result entirely in Allah's hands, praying for His mercy and right guidance. And Allah responded by protecting and providing for them in ways they could never have imagined or arranged: a guarded sleep across centuries, the turning of their bodies, shade from the sun, and an awe that kept enemies away. This is the fruit of true reliance on Allah: as He promises, 'And whoever relies upon Allah — then He is sufficient for him' (At-Talaq 3). The believer is responsible for doing what is right and obeying Allah; the outcome belongs to Allah, who is the best of protectors and providers. The fourth lesson is that their story is a clear proof of the resurrection: the One who could cause them to sleep for over three centuries and then awaken them whole and well is surely able to raise all people from death on the Day of Judgement. Indeed, Allah revealed their awakening so that people would know the truth of His promise and the certainty of the Hour. Together, these lessons make the story of the People of the Cave a guide for the believer's heart: to treasure faith above all things, to find courage in youth and in every age to stand for the truth, to trust Allah completely with the results of doing right, and to live in certainty of the meeting with Allah. The young Muslim who internalises this story carries within them a model of unshakeable faith for facing every pressure and trial of their own time.",
        ar: "قِصّةُ أصحابِ الكَهفِ لَيسَت مُجَرَّدَ تَسجيلٍ لِحَدَثٍ عَجيب؛ بل كَنزٌ مِنَ الدُّروسِ يَحفَظُهُ القُرآنُ لِلمُؤمِنينَ في كُلِّ عَصر، ولَها مَعنًى خاصٌّ لِلشَّباب. الدَّرسُ الأوَّلُ والأعظَمُ القيمةُ العُظمى لِلإيمانِ وواجِبُ حِفظِهِ مَهما كَلَّف. لم يَملِكْ هؤلاءِ الفِتيةُ أنفَسَ مِن إيمانِهِم بِالله، وكانوا مُستَعِدّينَ لِفَقدِ دِيارِهِم وأهلِهِم ومُجتَمَعِهِم وأمنِهِم ولا يَفقِدوا إيمانَهُم. وهذا يُعَلِّمُ المُؤمِنَ أنَّ الإيمانَ أنفَسُ ما يَملِكُ الإنسان، وأنَّ لا مَكسَبَ دُنيَويّ — لا أمنٌ ولا جاهٌ ولا رِضا النّاس — يَستَحِقُّ أن يُشترى بِثَمَنِ الدّين. وفي عالَمٍ يَضغَطُ على النّاسِ دائِمًا لِيُساوِموا على عَقائِدِهِم طَلَبًا لِلانسِجامِ أوِ المَنفَعةِ الدُّنيَويّة، يَقِفُ فِتيةُ الكَهفِ مِثالًا خالِدًا لِلتَّمَسُّكِ بِالحَقِّ مَهما كانَ الثَّمَن.\n\nوالدَّرسُ الثّاني شَجاعةُ الإيمانِ وما يُكرِمُ اللهُ بِهِ الشَّبابَ الصّادِق. سَمّاهُمُ القُرآنُ صَراحةً فِتيةً — شَبابًا — ومَدَحَهُم لِقيامِهِم، وَسطَ مُجتَمَعٍ مُعادٍ، يُعلِنونَ تَوحيدَ اللهِ ويَرفُضونَ آلِهةَ قَومِهِمِ الباطِلة. وهذا يَرُدُّ تَوَهُّمَ أنَّ الإيمانَ العَميقَ والشَّجاعةَ الخُلُقيّةَ العَظيمةَ لِلكِبارِ وَحدَهُم؛ بل أكرَمَ اللهُ هؤلاءِ الفِتيةَ على جيلِهِم كُلِّه. ولِلشّابِّ المُسلِمِ في هذا تَشجيعٌ قَويّ: أنَّ الشَّبابَ زَمَنُ قُوّة، وأنَّ اللهَ يَهدي ويُثَبِّتُ قَلبَ الشّابِّ لِيَصمُدَ لِلحَقِّ ولَو خالَفَهُ مَن حَولَه. ويَصِفُ اللهُ كَيفَ ثَبَّتَهُم: ﴿ورَبَطنا على قُلوبِهِم إذ قاموا﴾ (الكهف ١٤) — فَمَن قامَ للهِ بِصِدقٍ وَجَدَ اللهَ يُثَبِّتُهُ ويُؤَيِّدُه.\n\nوالدَّرسُ الثّالِثُ جَمالُ التَّوَكُّلِ على اللهِ وقُوَّتُه. فَعَلَ الفِتيةُ الصَّوابَ — اختاروا الإيمانَ وهاجَروا لِأجلِه — لكِنَّهُم لم يَملِكوا التَّحَكُّمَ في العاقِبةِ ولا حَتّى تَوَقُّعَها. أدَّوا واجِبَهُم فَحَسب ووَضَعوا النَّتيجةَ كُلَّها بِيَدِ الله، يَدعونَ رَحمَتَهُ ورَشَدَه. فَأجابَهُمُ اللهُ بِحِفظِهِم ورِزقِهِم بِما لم يَكُن في خَيالِهِم: نَومٌ مَحفوظٌ عَبرَ القُرون، وتَقليبُ أجسادِهِم، وظِلٌّ مِنَ الشَّمس، وهَيبةٌ تَصرِفُ الأعداء. هذا ثَمَرُ التَّوَكُّلِ الحَقّ: كَما وَعَدَ سُبحانَه: ﴿ومَن يَتَوَكَّل على اللهِ فَهو حَسبُه﴾ (الطلاق ٣). فالمُؤمِنُ مَسؤولٌ عن فِعلِ الصَّوابِ وطاعةِ الله؛ والعاقِبةُ للهِ خَيرِ الحافِظينَ والرّازِقين. والدَّرسُ الرّابِعُ أنَّ قِصَّتَهُم دَليلٌ واضِحٌ على البَعث: فَمَن قَدَرَ أن يُنيمَهُم فَوقَ ثَلاثةِ قُرونٍ ثُمَّ يَبعَثَهُم أصِحّاءَ قادِرٌ على بَعثِ النّاسِ جَميعًا مِنَ المَوتِ يَومَ القِيامة. بل أظهَرَ اللهُ بَعثَهُم لِيَعلَمَ النّاسُ صِدقَ وَعدِهِ ويَقينَ السّاعة. وبِهذه الدُّروسِ مَعًا تَصيرُ قِصّةُ أصحابِ الكَهفِ دَليلًا لِقَلبِ المُؤمِن: أن يَعتَزَّ بِالإيمانِ فَوقَ كُلِّ شَيء، ويَجِدَ في شَبابِهِ وفي كُلِّ عُمرٍ شَجاعةَ الوُقوفِ لِلحَقّ، ويَتَوَكَّلَ على اللهِ كامِلًا في عاقِبةِ الصَّواب، ويَحيا على يَقينٍ بِلِقاءِ الله. والشّابُّ المُسلِمُ الذي يَستَبطِنُ هذه القِصّةَ يَحمِلُ في داخِلِهِ نَموذَجَ إيمانٍ لا يَتَزَعزَعُ لِمُواجَهةِ كُلِّ ضَغطٍ وابتِلاءٍ في زَمانِه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who were the People of the Cave?", ar: "مَن أصحابُ الكَهف؟" },
      options: [
        { en: "Young believers who fled persecution to preserve their faith", ar: "فِتيةٌ مُؤمِنونَ فَرّوا مِنَ الاضطِهادِ لِيَحفَظوا إيمانَهُم" },
        { en: "A group of kings", ar: "جَماعةُ مُلوك" },
        { en: "Soldiers of Pharaoh", ar: "جُنودُ فِرعَون" },
        { en: "Traders", ar: "تُجّار" },
      ],
      correctIndex: 0,
      explanation: { en: "Youths (fityah) who believed in Allah alone in a corrupt society.", ar: "فِتيةٌ آمَنوا بِاللهِ وَحدَهُ في مُجتَمَعٍ فاسِد." },
    },
    {
      prompt: { en: "Why did they flee to the cave?", ar: "لِمَ فَرّوا إلى الكَهف؟" },
      options: [
        { en: "To protect their faith from a tyrant who forced idolatry", ar: "لِيَحفَظوا إيمانَهُم مِن طاغيةٍ يُكرِهُ على الوَثَنيّة" },
        { en: "To find treasure", ar: "لِيَجِدوا كَنزًا" },
        { en: "To hide from a flood", ar: "لِيَختَبِئوا مِن فَيَضان" },
        { en: "To hunt", ar: "لِيَصطادوا" },
      ],
      correctIndex: 0,
      explanation: { en: "They chose faith over comfort and safety.", ar: "اختاروا الإيمانَ على الرّاحةِ والأمن." },
    },
    {
      prompt: { en: "How did Allah honour their trust?", ar: "كَيفَ أكرَمَ اللهُ تَوَكُّلَهُم؟" },
      options: [
        { en: "He gave them a protected sleep for many years and preserved them", ar: "أنامَهُم نَومًا مَحفوظًا سِنينَ كَثيرةً وحَفِظَهُم" },
        { en: "He made them kings", ar: "جَعَلَهُم مُلوكًا" },
        { en: "He gave them wealth", ar: "أعطاهُم مالًا" },
        { en: "Nothing happened", ar: "لم يَحدُث شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "A guarded sleep, then awakening as a great sign.", ar: "نَومٌ مَحفوظ، ثُمَّ بَعثٌ آيةً عَظيمة." },
    },
    {
      prompt: { en: "What does the Qur'an call them, showing their age?", ar: "بِمَ سَمّاهُمُ القُرآنُ دالًّا على سِنِّهِم؟" },
      options: [
        { en: "Fityah (young men)", ar: "فِتية (شَباب)" },
        { en: "Shuyukh (elders)", ar: "شُيوخ" },
        { en: "Muluk (kings)", ar: "مُلوك" },
        { en: "Tujjar (traders)", ar: "تُجّار" },
      ],
      correctIndex: 0,
      explanation: { en: "'They were youths who believed in their Lord' (Al-Kahf 13).", ar: "﴿إنَّهُم فِتيةٌ آمَنوا بِرَبِّهِم﴾ (الكهف ١٣)." },
    },
    {
      prompt: { en: "What truth does their awakening prove?", ar: "أيَّ حَقيقةٍ يُثبِتُ بَعثُهُم؟" },
      options: [
        { en: "The resurrection — Allah's power to revive after death", ar: "البَعثَ — قُدرةَ اللهِ على الإحياءِ بَعدَ المَوت" },
        { en: "That sleep is forbidden", ar: "أنَّ النَّومَ حَرام" },
        { en: "That caves are holy", ar: "أنَّ الكُهوفَ مُقَدَّسة" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "The One who preserved and revived them can raise all people.", ar: "مَن حَفِظَهُم وأحياهُم قادِرٌ على بَعثِ النّاسِ جَميعًا." },
    },
    {
      prompt: { en: "True or False: Whoever relies on Allah will find Him sufficient.", ar: "صَوابٌ أم خَطأ: مَن تَوَكَّلَ على اللهِ وَجَدَهُ حَسبَه." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "'Whoever relies upon Allah — He is sufficient for him' (At-Talaq 3).", ar: "﴿ومَن يَتَوَكَّل على اللهِ فَهو حَسبُه﴾ (الطلاق ٣)." },
    },
  ],
};
