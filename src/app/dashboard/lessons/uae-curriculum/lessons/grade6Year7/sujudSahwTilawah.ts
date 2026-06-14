import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const sujudSahwTilawah: CourseLesson = {
  slug: "g6y7-sujud-as-sahw-and-sujud-at-tilawah",
  name: {
    en: "Sujud As-Sahw and Sujud At-Tilawah",
    ar: "سُجودُ السَّهوِ وسُجودُ التِّلاوة",
  },
  shortIntro: {
    en: "Two special prostrations every Muslim should master: Sujud As-Sahw, which mends mistakes made in prayer, and Sujud At-Tilawah, the prostration of recitation. A precise study of their rulings, causes, and how to perform them — grounded in the Sunnah and the fiqh of Ahl as-Sunnah.",
    ar: "سَجدَتانِ خاصَّتانِ يَنبَغي لِكُلِّ مُسلِمٍ إتقانُهُما: سُجودُ السَّهوِ الذي يَجبُرُ خَلَلَ الصَّلاة، وسُجودُ التِّلاوةِ سَجدةُ القُرآن. دِراسةٌ دَقيقةٌ لِأحكامِهِما وأسبابِهِما وكَيفيّةِ أدائِهِما — مُؤَصَّلةٌ بِالسُّنّةِ وفِقهِ أهلِ السُّنّة.",
  },
  quranSurahs: ["Al-Inshiqaq 20-21", "Maryam 58", "As-Sajdah 15"],
  sections: [
    {
      title: { en: "Why these prostrations? Mercy and worship", ar: "لِماذا هاتانِ السَّجدَتان؟ رَحمةٌ وعِبادة" },
      learningObjectives: [
        { en: "Explain the purpose of Sujud As-Sahw and Sujud At-Tilawah.", ar: "أُبَيِّنُ مَقصِدَ سُجودِ السَّهوِ وسُجودِ التِّلاوة." },
        { en: "Connect prostration to humility before Allah.", ar: "أربِطُ السُّجودَ بِالخُشوعِ بَينَ يَدَيِ الله." },
      ],
      successCriteria: [
        { en: "I can state the purpose of each prostration.", ar: "أذكُرُ مَقصِدَ كُلِّ سَجدة." },
        { en: "I can explain why Islam allows mistakes to be mended.", ar: "أُبَيِّنُ لِماذا يُتيحُ الإسلامُ جَبرَ الخَطأ." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A worshipper in prostration in a mosque.", ar: "مُصَلٍّ ساجِدٌ في مَسجِد." },
        caption: { en: "The closest a servant is to his Lord is in prostration.", ar: "أقرَبُ ما يَكونُ العَبدُ مِن رَبِّهِ وهو ساجِد." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does Islam provide a way to mend a mistaken prayer?", ar: "لِماذا شَرَعَ الإسلامُ جَبرَ الصَّلاةِ المُخطِئة؟" },
        body: {
          en: "Instead of invalidating a prayer when a person forgets, Islam gives Sujud As-Sahw to mend it. Argue what this teaches about Allah's mercy and about the difference between deliberate sin and honest human forgetfulness.",
          ar: "بَدَلَ إبطالِ الصَّلاةِ حينَ يَنسى المَرء، شَرَعَ الإسلامُ سُجودَ السَّهوِ لِجَبرِها. حاجِجْ ماذا يُعَلِّمُ هذا عن رَحمةِ اللهِ وعنِ الفَرقِ بَينَ الذَّنبِ المُتَعَمَّدِ والنِّسيانِ البَشَرِيِّ الصّادِق.",
        },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: 'When one of you is unsure in his prayer... let him complete what he is sure of, then prostrate twice before the salam.' — Muslim", ar: "قالَ النَّبِيُّ ﷺ: «إذا شَكَّ أحَدُكُم في صَلاتِه... فَليُتِمَّ على ما استَيقَنَ، ثُمَّ يَسجُدُ سَجدَتَين قَبلَ أن يُسَلِّم» — مسلم" },
          ],
        },
        {
          label: { en: "Key terms", ar: "مُصطَلَحاتٌ مِفتاحِيّة" },
          lines: [
            { en: "Sujud As-Sahw: 'prostration of forgetfulness' — two prostrations to make up for an error in the prayer. Sujud At-Tilawah: 'prostration of recitation' — a single prostration done when reciting or hearing a verse of prostration (ayat sajdah).", ar: "سُجودُ السَّهو: سَجدَتانِ تَجبُرانِ خَلَلًا في الصَّلاة. سُجودُ التِّلاوة: سَجدةٌ واحِدةٌ عِندَ تِلاوةِ أو سَماعِ آيةِ سَجدة." },
          ],
        },
      ],
      body: {
        en: "Prostration (sujud) is the highest expression of a servant's humility before Allah. The Prophet ﷺ said, 'The closest a servant is to his Lord is when he is in prostration.' We prostrate in every unit of every prayer, but Islam also legislates two special prostrations outside the ordinary flow of the prayer, and both reveal something beautiful about our religion.\n\nThe first is Sujud As-Sahw — the prostration of forgetfulness. Human beings forget; it is part of how Allah created us. The Prophet ﷺ himself once forgot in his prayer, and when reminded he said, 'I am only a human like you; I forget as you forget' (al-Bukhari). Rather than ruling that a forgetful prayer is simply ruined, Allah in His mercy gave us a way to mend it: two extra prostrations that 'patch' the mistake and complete the prayer. This is a profound mercy — it distinguishes between deliberate disobedience and honest human error, and it teaches that the door to correcting our worship is always open.\n\nThe second is Sujud At-Tilawah — the prostration of recitation. Throughout the Qur'an there are specific verses (about fifteen, called ayat as-sajdah) where Allah mentions prostration, often describing how the angels, the prophets, or all creation fall down in worship. When a Muslim recites or hears one of these verses, it is recommended to prostrate once, joining the believers and all creation in submitting to Allah at the very moment the verse calls for it. A demanding student should see that neither of these is a dry technicality: Sujud As-Sahw reflects the mercy and realism of Islam toward human weakness, and Sujud At-Tilawah reflects how the Qur'an is meant to move us to action, not just be read with the tongue. This lesson examines both in detail.",
        ar: "السُّجودُ أعلى تَعبيرٍ عن خُضوعِ العَبدِ بَينَ يَدَيِ الله. قالَ النَّبِيُّ ﷺ: «أقرَبُ ما يَكونُ العَبدُ مِن رَبِّهِ وهو ساجِد». ونَحنُ نَسجُدُ في كُلِّ رَكعةٍ مِن كُلِّ صَلاة، لكِنَّ الإسلامَ شَرَعَ أيضًا سَجدَتَينِ خاصَّتَينِ خارِجَ سِياقِ الصَّلاةِ المُعتاد، وكِلتاهُما تَكشِفُ شَيئًا جَميلًا عن دينِنا.\n\nالأولى سُجودُ السَّهو. فالإنسانُ يَنسى؛ وذلك مِن خِلقةِ اللهِ لَنا. وقد نَسِيَ النَّبِيُّ ﷺ نَفسُهُ في صَلاتِه، فَلَمّا ذُكِّرَ قالَ: «إنَّما أنا بَشَرٌ مِثلُكُم، أنسى كَما تَنسَون» (البخاري). فَبَدَلَ الحُكمِ بِأنَّ الصَّلاةَ المَنسِيَّةَ تَفسُدُ، أعطانا اللهُ بِرَحمَتِهِ سَبيلًا لِجَبرِها: سَجدَتَينِ تَجبُرانِ الخَلَلَ وتُكمِلانِ الصَّلاة. وهذه رَحمةٌ عَظيمة — تُفَرِّقُ بَينَ العِصيانِ المُتَعَمَّدِ والخَطأِ البَشَرِيِّ الصّادِق، وتُعَلِّمُ أنَّ بابَ تَصحيحِ عِبادَتِنا مَفتوحٌ دائِمًا.\n\nوالثّانيةُ سُجودُ التِّلاوة. ففي القُرآنِ آياتٌ مُعَيَّنة (نَحوَ خَمسَ عَشرةَ، تُسَمّى آياتِ السَّجدة) يَذكُرُ اللهُ فيها السُّجود، يَصِفُ كَثيرًا كَيفَ يَخِرُّ المَلائِكةُ أوِ الأنبِياءُ أوِ الخَلقُ كُلُّهُ ساجِدين. فإذا تَلا المُسلِمُ أو سَمِعَ إحدى هذه الآياتِ استُحِبَّ لَهُ أن يَسجُدَ سَجدةً واحِدة، مُنضَمًّا إلى المُؤمِنينَ والخَلقِ كُلِّهِ في الخُضوعِ للهِ في اللَّحظةِ التي تَدعو إليها الآية. وعلى الطّالِبِ المُطالِبِ أن يَرى أنَّ كِلتَيهِما لَيسَتا شَكلِيّةً جافّة: فَسُجودُ السَّهوِ يَعكِسُ رَحمةَ الإسلامِ وواقِعيَّتَهُ تُجاهَ ضَعفِ الإنسان، وسُجودُ التِّلاوةِ يَعكِسُ كَيفَ يُرادُ لِلقُرآنِ أن يُحَرِّكَنا لِلعَمَلِ لا أن يُتلى بِاللِّسانِ فَقَط. ويَدرُسُ هذا الدَّرسُ كِلتَيهِما بِتَفصيل.",
      },
    },
    {
      title: { en: "Sujud As-Sahw: when and how", ar: "سُجودُ السَّهو: مَتى وكَيف" },
      learningObjectives: [
        { en: "List the three causes of Sujud As-Sahw and how to perform it.", ar: "أذكُرُ أسبابَ سُجودِ السَّهوِ الثَّلاثةَ وكَيفيّةَ أدائِه." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "A fiqh book open to the chapter on prayer.", ar: "كِتابُ فِقهٍ مَفتوحٌ على بابِ الصَّلاة." },
        caption: { en: "Three causes: adding, omitting, or doubting in the prayer.", ar: "ثَلاثةُ أسباب: الزِّيادةُ، أوِ النَّقصُ، أوِ الشَّكُّ في الصَّلاة." },
      },
      infoBoxes: [
        {
          label: { en: "The three causes", ar: "الأسبابُ الثَّلاثة" },
          lines: [
            { en: "1) Ziyadah (addition) — e.g. an extra rak'ah or sajdah. 2) Naqs (omission) — e.g. forgetting the first tashahhud. 3) Shakk (doubt) — being unsure how many rak'ahs you prayed.", ar: "١) الزِّيادة — كَرَكعةٍ أو سَجدةٍ زائِدة. ٢) النَّقص — كَنِسيانِ التَّشَهُّدِ الأوَّل. ٣) الشَّكّ — عَدَمُ التَّيَقُّنِ مِن عَدَدِ الرَّكَعات." },
          ],
        },
        {
          label: { en: "How to perform", ar: "كَيفيّةُ الأداء" },
          lines: [
            { en: "Two prostrations like the prostrations of prayer (with takbir), then the tashahhud (if applicable) and salam. Generally before the salam, though it is valid after, following the Sunnah for each case.", ar: "سَجدَتانِ كَسَجدَتَيِ الصَّلاةِ (بِالتَّكبير)، ثُمَّ التَّشَهُّدُ (إن لَزِم) والسَّلام. وغالِبًا قَبلَ السَّلام، ويَصِحُّ بَعدَهُ اتِّباعًا لِلسُّنّةِ في كُلِّ حال." },
          ],
        },
      ],
      callout: {
        label: { en: "Apply the ruling", ar: "طَبِّقِ الحُكم" },
        title: { en: "What should you do if you doubt?", ar: "ماذا تَفعَلُ إذا شَكَكت؟" },
        body: {
          en: "The Prophet ﷺ taught: if unsure between (say) three and four rak'ahs, build on what you are certain of (the lower number), complete the prayer, then perform Sujud As-Sahw. Explain the wisdom of building on certainty rather than guessing.",
          ar: "عَلَّمَ النَّبِيُّ ﷺ: إذا شَكَكتَ بَينَ ثَلاثٍ وأربَعٍ مَثَلًا، فابنِ على ما تَيَقَّنتَ (الأقَلّ)، وأتِمَّ الصَّلاة، ثُمَّ اسجُدْ لِلسَّهو. بَيِّنْ حِكمةَ البِناءِ على اليَقينِ بَدَلَ الظَّنّ.",
        },
      },
      responsePrompt: {
        title: { en: "Solve the scenario", ar: "حُلَّ المَوقِف" },
        prompt: { en: "A person praying Dhuhr forgets the first tashahhud and stands up. What should they do, and why? Then describe exactly how to perform Sujud As-Sahw.", ar: "شَخصٌ يُصَلّي الظُّهرَ نَسِيَ التَّشَهُّدَ الأوَّلَ وقامَ. ماذا يَفعَلُ ولِماذا؟ ثُمَّ صِفْ بِدِقّةٍ كَيفَ يُؤَدّي سُجودَ السَّهو." },
        placeholder: { en: "Because the omission was..., they should... To perform Sujud As-Sahw, you...", ar: "لِأنَّ النَّقصَ كانَ...، فَعليهِ أن... ولِأداءِ سُجودِ السَّهو..." },
      },
      body: {
        en: "Sujud As-Sahw is legislated for three situations, all of which arise from forgetfulness in the prayer. The first is ziyadah — addition. If a person mistakenly adds something to the prayer, such as praying an extra rak'ah, or adding a bowing or prostration out of forgetfulness, this is repaired with Sujud As-Sahw. The second is naqs — omission. If a person leaves out one of the required parts of the prayer (a wajib), the most common example being the first tashahhud (when a person stands up forgetfully without sitting for it), this too is mended with the two prostrations. The third is shakk — doubt. If a person genuinely cannot remember how many rak'ahs they have prayed, they are not left helpless.\n\nThe Prophet ﷺ gave a clear method for doubt: 'When one of you is unsure in his prayer and does not know how many he has prayed — three or four — let him cast away the doubt and build on what he is certain of (the lower number), then prostrate twice before he gives salam' (Muslim). So if you are unsure whether you prayed three or four, you assume three (the certain amount), pray one more to complete four, and then perform Sujud As-Sahw. The wisdom is beautiful: rather than guessing and risking an invalid prayer, you build on certainty and let the prostration cover any small error.\n\nAs for how to perform it: Sujud As-Sahw consists of two prostrations exactly like the prostrations within the prayer — saying 'Allahu akbar' to go down, glorifying Allah, sitting up between them, then giving salam afterward. The Sunnah shows it can be done before the salam or after it depending on the situation, and the scholars detail this; for a student, the essential thing is to know its three causes and that it is two prostrations that complete and correct the prayer. A demanding student should notice the realism here: Islam does not demand robotic perfection from human beings. It expects sincerity and provides a clear, dignified way to put right our honest mistakes — a mercy woven into the very structure of worship.",
        ar: "يُشرَعُ سُجودُ السَّهوِ في ثَلاثِ حالاتٍ كُلُّها مِنَ النِّسيانِ في الصَّلاة. الأولى الزِّيادة. فإذا زادَ المَرءُ في صَلاتِهِ سَهوًا، كَرَكعةٍ زائِدةٍ أو رُكوعٍ أو سُجودٍ نِسيانًا، جُبِرَ ذلك بِسُجودِ السَّهو. والثّانيةُ النَّقص. فإذا تَرَكَ واجِبًا مِن واجِباتِ الصَّلاة، وأشهَرُ مِثالٍ التَّشَهُّدُ الأوَّلُ (حينَ يَقومُ ناسِيًا دونَ أن يَجلِسَ لَه)، جُبِرَ كَذلك بِالسَّجدَتَين. والثّالثةُ الشَّكّ. فإذا لم يَتَذَكَّرِ المَرءُ حَقًّا كَم رَكعةً صَلّى، لم يُترَكْ حائِرًا.\n\nأعطى النَّبِيُّ ﷺ طَريقةً واضِحةً لِلشَّكّ: «إذا شَكَّ أحَدُكُم في صَلاتِهِ فَلَم يَدرِ كَم صَلّى، ثَلاثًا أم أربَعًا، فَليَطرَحِ الشَّكَّ وليَبنِ على ما استَيقَن (الأقَلّ)، ثُمَّ يَسجُدُ سَجدَتَينِ قَبلَ أن يُسَلِّم» (مسلم). فإن شَكَكتَ أصَلَّيتَ ثَلاثًا أم أربَعًا، افتَرَضتَ ثَلاثًا (المُتَيَقَّن)، وصَلَّيتَ واحِدةً لِتُكمِلَ أربَعًا، ثُمَّ سَجَدتَ لِلسَّهو. والحِكمةُ بَديعة: بَدَلَ الظَّنِّ ومُخاطَرةِ بُطلانِ الصَّلاة، تَبني على اليَقينِ وتَدَعُ السَّجدةَ تَجبُرُ أيَّ خَطأٍ يَسير.\n\nوأمَّا كَيفيّةُ أدائِه: فَسُجودُ السَّهوِ سَجدَتانِ كَسَجدَتَيِ الصَّلاةِ تَمامًا — تُكَبِّرُ لِلنُّزول، وتُسَبِّحُ الله، وتَجلِسُ بَينَهُما، ثُمَّ تُسَلِّمُ بَعدَهُما. وتُبَيِّنُ السُّنّةُ أنَّهُ يَكونُ قَبلَ السَّلامِ أو بَعدَهُ بِحَسَبِ الحال، وفَصَّلَ العُلَماءُ ذلك؛ والمُهِمُّ لِلطّالِبِ أن يَعرِفَ أسبابَهُ الثَّلاثةَ وأنَّهُ سَجدَتانِ تُكمِلانِ الصَّلاةَ وتُصَحِّحانِها. وعلى الطّالِبِ المُطالِبِ أن يُلاحِظَ الواقِعيّةَ هُنا: فالإسلامُ لا يَطلُبُ مِنَ البَشَرِ كَمالًا آلِيًّا. بل يَطلُبُ الإخلاصَ ويُتيحُ سَبيلًا واضِحًا كَريمًا لِتَصحيحِ أخطائِنا الصّادِقة — رَحمةً مَنسوجةً في بِنيةِ العِبادةِ نَفسِها.",
      },
    },
    {
      title: { en: "Sujud At-Tilawah: the prostration of the Qur'an", ar: "سُجودُ التِّلاوة: سَجدةُ القُرآن" },
      learningObjectives: [
        { en: "Explain the ruling, cause, and method of Sujud At-Tilawah.", ar: "أُبَيِّنُ حُكمَ سُجودِ التِّلاوةِ وسَبَبَهُ وكَيفيّتَه." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A reader reaching a verse of prostration.", ar: "قارِئٌ يَبلُغُ آيةَ سَجدة." },
        caption: { en: "When the verse calls, the believer falls down in submission to Allah.", ar: "حينَ تُنادي الآيةُ، يَخِرُّ المُؤمِنُ ساجِدًا للهِ خاضِعًا." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And when the Qur'an is recited to them, they do not prostrate?\" (Al-Inshiqaq 21) — and of the angels: \"...they prostrate, and they do not grow arrogant.\" (As-Sajdah 15)", ar: "﴿وإذا قُرِئَ عليهِمُ القُرآنُ لا يَسجُدون﴾ (الانشقاق ٢١) — وعنِ المَلائِكة: ﴿...سَجَدوا وهُم لا يَستَكبِرون﴾ (السجدة ١٥)" },
          ],
        },
        {
          label: { en: "Ruling & method", ar: "الحُكمُ والكَيفيّة" },
          lines: [
            { en: "It is a confirmed Sunnah (recommended) for the reciter and the listener. Method: say takbir, prostrate once saying 'Subhana Rabbiya al-A'la' and the du'a of sajdah, then rise. Outside prayer no salam is needed by the stronger view; wudu is recommended.", ar: "سُنّةٌ مُؤَكَّدةٌ لِلقارِئِ والمُستَمِع. الكَيفيّة: تُكَبِّرُ وتَسجُدُ سَجدةً واحِدةً قائِلًا «سُبحانَ رَبِّيَ الأعلى» ودُعاءَ السَّجدة، ثُمَّ تَرفَع. وخارِجَ الصَّلاةِ لا سَلامَ على الأرجَح؛ والوُضوءُ مُستَحَبّ." },
          ],
        },
      ],
      callout: {
        label: { en: "Reflect on the response", ar: "تَأمَّلِ الاستِجابة" },
        title: { en: "Why prostrate at these verses?", ar: "لِماذا نَسجُدُ عِندَ هذه الآيات؟" },
        body: {
          en: "The verses of prostration describe creation bowing to Allah, or rebuke the arrogant who refuse. Argue how prostrating at these moments turns the Qur'an from words we read into a command we obey — and distinguishes the humble believer from the arrogant Shaytan, who refused to prostrate.",
          ar: "آياتُ السَّجدةِ تَصِفُ خُضوعَ الخَلقِ للهِ، أو تُوَبِّخُ المُستَكبِرينَ المُمتَنِعين. حاجِجْ كَيفَ يُحَوِّلُ السُّجودُ في هذه اللَّحظاتِ القُرآنَ مِن كَلِماتٍ نَقرَؤُها إلى أمرٍ نُطيعُه — ويُمَيِّزُ المُؤمِنَ المُتَواضِعَ مِنَ الشَّيطانِ المُستَكبِرِ الذي أبى أن يَسجُد.",
        },
      },
      matchingActivity: {
        title: { en: "Match the term to its meaning", ar: "طابِقِ المُصطَلَحَ بِمَعناه" },
        instruction: { en: "Connect each prostration concept to its correct description.", ar: "اربِطْ كُلَّ مَفهومٍ مِنَ السُّجودِ بِوَصفِهِ الصَّحيح." },
        prompts: [
          { en: "Sujud As-Sahw", ar: "سُجودُ السَّهو" },
          { en: "Sujud At-Tilawah", ar: "سُجودُ التِّلاوة" },
          { en: "Ayat as-Sajdah", ar: "آياتُ السَّجدة" },
          { en: "Building on certainty", ar: "البِناءُ على اليَقين" },
        ].map((p, i) => ({
          prompt: p,
          answer: [
            { en: "Two prostrations that mend a mistake in prayer.", ar: "سَجدَتانِ تَجبُرانِ خَطأً في الصَّلاة." },
            { en: "One prostration on reciting/hearing a verse of prostration.", ar: "سَجدةٌ واحِدةٌ عِندَ تِلاوةِ/سَماعِ آيةِ سَجدة." },
            { en: "The ~15 verses where prostration is legislated.", ar: "الآياتُ الـ ١٥ التي تُشرَعُ عِندَها السَّجدة." },
            { en: "When in doubt, assume the lower number you are sure of.", ar: "عِندَ الشَّكِّ تَفتَرِضُ الأقَلَّ المُتَيَقَّن." },
          ][i],
        })),
      },
      body: {
        en: "Sujud At-Tilawah is the prostration connected to the recitation of the Qur'an itself. Scattered through the Qur'an are roughly fifteen verses — known as ayat as-sajdah and usually marked in the mushaf with a special symbol — in which Allah speaks of prostration. Often these verses describe the angels, the prophets, or all of creation falling down in submission to Allah; sometimes they rebuke the arrogant who refuse to prostrate, as in 'And when the Qur'an is recited to them, they do not prostrate?' (Al-Inshiqaq 21). When a Muslim recites one of these verses, or hears it recited, it is a confirmed Sunnah to prostrate once — joining, in that very moment, the worship the verse is describing.\n\nThe method is simple. Upon reaching the verse, you say 'Allahu akbar' and go down into a single prostration, saying the normal words of prostration ('Subhana Rabbiya al-A'la') and adding the supplication the Prophet ﷺ taught for it: 'My face has prostrated to the One who created it and shaped it, and brought forth its hearing and sight by His might and power.' Then you rise. According to the stronger scholarly view, when done outside the prayer it does not require a tashahhud or salam, and although wudu and facing the qiblah are recommended, the matter is broad. If the verse occurs during a prayer, the reciter simply prostrates and then rises to continue.\n\nThe deeper meaning is what a demanding student must grasp. Sujud At-Tilawah trains us to let the Qur'an move us. The arrogant hear Allah's words and remain unmoved; the proud Shaytan was commanded to prostrate and refused, and that refusal was his ruin. The believer is the opposite: when the verse speaks of submission, the believer's whole body submits, falling to the ground in humility before the Lord of the worlds. In this small act lies a whole attitude toward revelation — that the Qur'an is not merely beautiful words to be admired, but the speech of our Creator that demands a response from the heart and the limbs. To prostrate at these verses is to say, with your body, 'I hear, and I obey.'",
        ar: "سُجودُ التِّلاوةِ هو السُّجودُ المُتَّصِلُ بِتِلاوةِ القُرآنِ نَفسِه. ففي القُرآنِ نَحوَ خَمسَ عَشرةَ آية — تُعرَفُ بِآياتِ السَّجدةِ وتُعَلَّمُ غالِبًا في المُصحَفِ بِعَلامةٍ خاصّة — يَذكُرُ اللهُ فيها السُّجود. وكَثيرًا ما تَصِفُ هذه الآياتُ خُضوعَ المَلائِكةِ أوِ الأنبِياءِ أوِ الخَلقِ كُلِّهِ ساجِدينَ للهِ؛ وأحيانًا تُوَبِّخُ المُستَكبِرينَ المُمتَنِعينَ عنِ السُّجود، كَما في ﴿وإذا قُرِئَ عليهِمُ القُرآنُ لا يَسجُدون﴾ (الانشقاق ٢١). فإذا تَلا المُسلِمُ إحدى هذه الآياتِ أو سَمِعَها، فالسُّنّةُ المُؤَكَّدةُ أن يَسجُدَ سَجدةً واحِدة — مُنضَمًّا في تِلكَ اللَّحظةِ إلى العِبادةِ التي تَصِفُها الآية.\n\nوالكَيفيّةُ يَسيرة. عِندَ بُلوغِ الآيةِ تُكَبِّرُ وتَنزِلُ لِسَجدةٍ واحِدة، قائِلًا ذِكرَ السُّجودِ المُعتادَ («سُبحانَ رَبِّيَ الأعلى») مُضيفًا الدُّعاءَ الذي عَلَّمَهُ النَّبِيُّ ﷺ لَها: «سَجَدَ وَجهي لِلَّذي خَلَقَهُ وصَوَّرَهُ، وشَقَّ سَمعَهُ وبَصَرَهُ بِحَولِهِ وقُوَّتِه». ثُمَّ تَرفَع. وعلى الأرجَحِ إذا كانَت خارِجَ الصَّلاةِ فَلا تَشَهُّدَ ولا سَلام، ومَعَ أنَّ الوُضوءَ واستِقبالَ القِبلةِ مُستَحَبّان، فالأمرُ واسِع. وإن وَقَعَتِ الآيةُ في الصَّلاةِ سَجَدَ القارِئُ ثُمَّ قامَ لِيُتِمّ.\n\nوالمَعنى الأعمَقُ هو ما يَجِبُ أن يُدرِكَهُ الطّالِبُ المُطالِب. فَسُجودُ التِّلاوةِ يُدَرِّبُنا أن نَدَعَ القُرآنَ يُحَرِّكُنا. المُستَكبِرُ يَسمَعُ كَلامَ اللهِ فَلا يَتَحَرَّك؛ والشَّيطانُ المُتَكَبِّرُ أُمِرَ بِالسُّجودِ فَأبى، فَكانَ ذلك هَلاكَه. والمُؤمِنُ نَقيضُه: حينَ تَتَكَلَّمُ الآيةُ عنِ الخُضوعِ يَخضَعُ بَدَنُهُ كُلُّه، فَيَخِرُّ على الأرضِ مُتَواضِعًا بَينَ يَدَي رَبِّ العالَمين. وفي هذا العَمَلِ الصَّغيرِ مَوقِفٌ كامِلٌ مِنَ الوَحي — أنَّ القُرآنَ لَيسَ كَلِماتٍ جَميلةً تُستَحسَنُ فَحَسب، بل كَلامُ خالِقِنا الذي يَطلُبُ استِجابةً مِنَ القَلبِ والجَوارِح. والسُّجودُ عِندَ هذه الآياتِ قَولٌ بِالبَدَن: «سَمِعنا وأطَعنا».",
      },
    },
    {
      title: { en: "Synthesis: worship done with care", ar: "تَركيبٌ: عِبادةٌ بِإتقان" },
      learningObjectives: [
        { en: "Compare both prostrations and apply their lessons.", ar: "أُقارِنُ بَينَ السَّجدَتَينِ وأُطَبِّقُ دُروسَهُما." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Worshippers in disciplined prostration.", ar: "مُصَلّونَ في سُجودٍ مُنضَبِط." },
        caption: { en: "Mending mistakes and responding to revelation — both perfect our worship.", ar: "جَبرُ الخَطأِ والاستِجابةُ لِلوَحي — كِلاهُما يُكمِلُ عِبادَتَنا." },
      },
      groupTasks: {
        title: { en: "Apply the fiqh", ar: "طَبِّقِ الفِقه" },
        instruction: { en: "Each group works through real scenarios.", ar: "تُعالِجُ كُلُّ مَجموعةٍ مَواقِفَ واقِعيّة." },
        groups: [
          {
            slug: "sahw-cases",
            name: { en: "Team A — Mending the prayer", ar: "الفَريقُ أ — جَبرُ الصَّلاة" },
            learningObjective: { en: "Diagnose which cause of Sujud As-Sahw applies.", ar: "نُشَخِّصُ أيَّ أسبابِ سُجودِ السَّهوِ يَنطَبِق." },
            task: { en: "For three cases (added a rak'ah; forgot first tashahhud; unsure if prayed 2 or 3) state the cause and the correct action.", ar: "لِثَلاثِ حالات (زادَ رَكعة؛ نَسِيَ التَّشَهُّدَ الأوَّل؛ شَكَّ أصَلّى ٢ أم ٣) بَيِّنوا السَّبَبَ والعَمَلَ الصَّحيح." },
            evidence: [
              { en: "The three causes: ziyadah, naqs, shakk; hadith of building on certainty.", ar: "الأسبابُ الثَّلاثة: الزِّيادة، النَّقص، الشَّكّ؛ حَديثُ البِناءِ على اليَقين." },
            ],
            sourceNotes: [
              { en: "Sujud As-Sahw = two prostrations.", ar: "سُجودُ السَّهو = سَجدَتان." },
            ],
            memberRoles: [
              { en: "Diagnoser, Evidence-checker, Reporter.", ar: "المُشَخِّص، مُدَقِّقُ الدَّليل، المُقَرِّر." },
            ],
            finalProduct: { en: "Three solved prayer scenarios.", ar: "ثَلاثُ حالاتِ صَلاةٍ مَحلولة." },
          },
          {
            slug: "tilawah-practice",
            name: { en: "Team B — Responding to the Qur'an", ar: "الفَريقُ ب — الاستِجابةُ لِلقُرآن" },
            learningObjective: { en: "Explain and demonstrate Sujud At-Tilawah.", ar: "نَشرَحُ ونَعرِضُ سُجودَ التِّلاوة." },
            task: { en: "Find one verse of prostration in the Qur'an, explain its meaning, and describe step by step how to perform Sujud At-Tilawah upon it.", ar: "جِدوا آيةَ سَجدةٍ في القُرآن، واشرَحوا مَعناها، وصِفوا خُطوةً خُطوةً كَيفَ تُؤَدّونَ سُجودَ التِّلاوةِ عِندَها." },
            evidence: [
              { en: "Al-Inshiqaq 21; As-Sajdah 15; the du'a of sujud at-tilawah.", ar: "الانشقاق ٢١؛ السجدة ١٥؛ دُعاءُ سُجودِ التِّلاوة." },
            ],
            sourceNotes: [
              { en: "Sujud At-Tilawah = one prostration; confirmed Sunnah.", ar: "سُجودُ التِّلاوة = سَجدةٌ واحِدة؛ سُنّةٌ مُؤَكَّدة." },
            ],
            memberRoles: [
              { en: "Reciter, Explainer, Demonstrator.", ar: "القارِئ، الشّارِح، العارِض." },
            ],
            finalProduct: { en: "A demonstrated Sujud At-Tilawah with explanation.", ar: "عَرضُ سُجودِ تِلاوةٍ مَعَ شَرح." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final synthesis", ar: "التَّركيبُ الخِتامِيّ" },
        prompt: { en: "Compare Sujud As-Sahw and Sujud At-Tilawah: their causes, number of prostrations, and purpose. Then explain what both teach about how a Muslim should approach worship — with both care for correctness and a heart that responds to Allah.", ar: "قارِنْ بَينَ سُجودِ السَّهوِ وسُجودِ التِّلاوة: أسبابَهُما وعَدَدَ السَّجَداتِ والمَقصِد. ثُمَّ بَيِّنْ ما يُعَلِّمُهُ كِلاهُما عن كَيفَ يَنبَغي لِلمُسلِمِ أن يَتَعامَلَ مَعَ العِبادة — بِعِنايةٍ بِالصَّوابِ وقَلبٍ يَستَجيبُ للهِ." },
        placeholder: { en: "Sujud As-Sahw is... while Sujud At-Tilawah is... Both teach that worship should be...", ar: "سُجودُ السَّهو... بَينَما سُجودُ التِّلاوة... وكِلاهُما يُعَلِّمُ أنَّ العِبادةَ يَنبَغي أن..." },
      },
      body: {
        en: "Bring the two prostrations together and the lesson becomes clear. Sujud As-Sahw and Sujud At-Tilawah are different in their details — one is two prostrations to mend a mistake in the prayer, triggered by addition, omission, or doubt; the other is a single prostration done in response to a verse of the Qur'an, joining all creation in submission. But they share a single spirit: both call the Muslim to worship Allah with care, attentiveness, and a heart that is awake.\n\nSujud As-Sahw teaches us that worship should be performed with care and that our honest mistakes can be put right — Allah does not demand impossible perfection, but He does ask that we take our prayer seriously enough to correct it. Sujud At-Tilawah teaches us that worship is not mechanical: when the words of Allah call us to humble ourselves, our hearts and bodies should respond. Together they form a beautiful balance. The first guards the form of worship; the second guards its spirit. The first says, 'Be careful and precise in how you worship.' The second says, 'Let your worship be alive, responding to your Lord.'\n\nA demanding student leaves this lesson not only knowing the rulings — the three causes of Sujud As-Sahw, the method of each prostration, the verses of prostration — but understanding the attitude they cultivate. Islam wants worshippers who are both precise and present: who get the details of their prayer right, and whose hearts are moved when they encounter the speech of Allah. These two small prostrations, easily overlooked, are in truth a training in exactly that. The challenge they leave you with is to pray with such presence of heart that you would notice a mistake and care to mend it, and to recite the Qur'an with such attentiveness that its verses still have the power to bring you to the ground in submission before your Lord.",
        ar: "اجمَعِ السَّجدَتَينِ يَتَّضِحِ الدَّرس. سُجودُ السَّهوِ وسُجودُ التِّلاوةِ مُختَلِفانِ في تَفاصيلِهِما — أحَدُهُما سَجدَتانِ لِجَبرِ خَطأٍ في الصَّلاة، سَبَبُهُ الزِّيادةُ أوِ النَّقصُ أوِ الشَّكّ؛ والآخَرُ سَجدةٌ واحِدةٌ استِجابةً لِآيةٍ مِنَ القُرآن، انضِمامًا إلى الخَلقِ كُلِّهِ في الخُضوع. لكِنَّهُما يَشتَرِكانِ في روحٍ واحِدة: كِلاهُما يَدعو المُسلِمَ لِعِبادةِ اللهِ بِعِنايةٍ ويَقَظةٍ وقَلبٍ حاضِر.\n\nسُجودُ السَّهوِ يُعَلِّمُنا أنَّ العِبادةَ تُؤَدّى بِعِنايةٍ وأنَّ أخطاءَنا الصّادِقةَ يُمكِنُ جَبرُها — فاللهُ لا يَطلُبُ كَمالًا مُستَحيلًا، لكِنَّهُ يَطلُبُ أن نَأخُذَ صَلاتَنا بِجِدّيّةٍ تَكفي لِتَصحيحِها. وسُجودُ التِّلاوةِ يُعَلِّمُنا أنَّ العِبادةَ لَيسَت آليّة: فحينَ تَدعونا كَلِماتُ اللهِ لِلتَّواضُع، يَنبَغي أن تَستَجيبَ قُلوبُنا وأبدانُنا. وهُما مَعًا تَوازُنٌ بَديع. فالأولى تَحرُسُ صورةَ العِبادة؛ والثّانيةُ تَحرُسُ روحَها. الأولى تَقول: «كُنْ دَقيقًا حَريصًا في عِبادَتِك». والثّانيةُ تَقول: «اجعَلْ عِبادَتَكَ حَيّةً تَستَجيبُ لِرَبِّك».\n\nوالطّالِبُ المُطالِبُ يُغادِرُ هذا الدَّرسَ لا عارِفًا الأحكامَ فَحَسب — أسبابَ سُجودِ السَّهوِ الثَّلاثة، وكَيفيّةَ كُلِّ سَجدة، وآياتِ السَّجدة — بل فاهِمًا المَوقِفَ الذي تُنَمّيه. فالإسلامُ يُريدُ عابِدينَ دَقيقينَ حاضِرين: يُتقِنونَ تَفاصيلَ صَلاتِهِم، وتَتَحَرَّكُ قُلوبُهُم حينَ يَلقَونَ كَلامَ الله. وهاتانِ السَّجدَتانِ الصَّغيرَتانِ، السَّهلُ إغفالُهُما، هُما في الحَقيقةِ تَدريبٌ على ذلك بِالضَّبط. والتَّحَدّي الذي تَترُكانِهِ لَك أن تُصَلِّيَ بِحُضورِ قَلبٍ يَجعَلُكَ تَنتَبِهُ لِلخَطأِ فَتَحرِصَ على جَبرِه، وأن تَتلوَ القُرآنَ بِيَقَظةٍ تَبقى لِآياتِهِ القُدرةُ أن تَخِرَّ بِكَ ساجِدًا بَينَ يَدَي رَبِّك.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the purpose of Sujud As-Sahw?", ar: "ما مَقصِدُ سُجودِ السَّهو؟" },
      options: [
        { en: "To mend a mistake (addition, omission, or doubt) made in the prayer", ar: "جَبرُ خَطأٍ (زِيادةٍ أو نَقصٍ أو شَكٍّ) في الصَّلاة" },
        { en: "To begin a new prayer", ar: "بَدءُ صَلاةٍ جَديدة" },
        { en: "To replace wudu", ar: "الاستِغناءُ عنِ الوُضوء" },
        { en: "To give charity", ar: "إخراجُ الصَّدَقة" },
      ],
      correctIndex: 0,
      explanation: { en: "It is two prostrations that repair forgetfulness in the prayer.", ar: "هي سَجدَتانِ تَجبُرانِ النِّسيانَ في الصَّلاة." },
    },
    {
      prompt: { en: "What are the three causes of Sujud As-Sahw?", ar: "ما أسبابُ سُجودِ السَّهوِ الثَّلاثة؟" },
      options: [
        { en: "Addition (ziyadah), omission (naqs), and doubt (shakk)", ar: "الزِّيادة، والنَّقص، والشَّكّ" },
        { en: "Travel, illness, and fear", ar: "السَّفَر، المَرَض، الخَوف" },
        { en: "Sleeping, eating, and talking", ar: "النَّوم، الأكل، الكَلام" },
        { en: "Sunrise, noon, and sunset", ar: "الشُّروق، الظُّهر، الغُروب" },
      ],
      correctIndex: 0,
      explanation: { en: "Any of these three errors in prayer calls for Sujud As-Sahw.", ar: "أيٌّ مِن هذه الثَّلاثةِ في الصَّلاةِ يوجِبُ سُجودَ السَّهو." },
    },
    {
      prompt: { en: "If you doubt whether you prayed three or four rak'ahs, what does the Sunnah say?", ar: "إذا شَكَكتَ أصَلَّيتَ ثَلاثًا أم أربَعًا، فَماذا تَقولُ السُّنّة؟" },
      options: [
        { en: "Build on what you are certain of (the lower number), complete the prayer, then do Sujud As-Sahw", ar: "ابنِ على المُتَيَقَّن (الأقَلّ)، وأتِمَّ الصَّلاة، ثُمَّ اسجُدْ لِلسَّهو" },
        { en: "Stop the prayer and start over", ar: "اقطَعِ الصَّلاةَ وابدَأْ مِن جَديد" },
        { en: "Assume the higher number always", ar: "افتَرِضِ الأكثَرَ دائِمًا" },
        { en: "Ignore it; doubt does not matter", ar: "تَجاهَلْه؛ الشَّكُّ لا يَهُمّ" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ taught to discard doubt and build on certainty, then prostrate.", ar: "عَلَّمَ النَّبِيُّ ﷺ طَرحَ الشَّكِّ والبِناءَ على اليَقين، ثُمَّ السُّجود." },
    },
    {
      prompt: { en: "When is Sujud At-Tilawah performed?", ar: "مَتى يُؤَدّى سُجودُ التِّلاوة؟" },
      options: [
        { en: "When reciting or hearing a verse of prostration (ayat as-sajdah)", ar: "عِندَ تِلاوةِ أو سَماعِ آيةِ سَجدة" },
        { en: "Only on Fridays", ar: "يَومَ الجُمُعةِ فَقَط" },
        { en: "After every prayer", ar: "بَعدَ كُلِّ صَلاة" },
        { en: "Only during Ramadan", ar: "في رَمَضانَ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "It is a confirmed Sunnah for both reciter and listener at the verses of prostration.", ar: "سُنّةٌ مُؤَكَّدةٌ لِلقارِئِ والمُستَمِعِ عِندَ آياتِ السَّجدة." },
    },
    {
      prompt: { en: "How many prostrations is Sujud At-Tilawah?", ar: "كَم سَجدةً سُجودُ التِّلاوة؟" },
      options: [
        { en: "One single prostration", ar: "سَجدةٌ واحِدة" },
        { en: "Two prostrations", ar: "سَجدَتان" },
        { en: "Three prostrations", ar: "ثَلاثُ سَجَدات" },
        { en: "A full rak'ah", ar: "رَكعةٌ كامِلة" },
      ],
      correctIndex: 0,
      explanation: { en: "Sujud At-Tilawah is a single prostration; Sujud As-Sahw is two.", ar: "سُجودُ التِّلاوةِ سَجدةٌ واحِدة؛ وسُجودُ السَّهوِ سَجدَتان." },
    },
    {
      prompt: { en: "True or False: A prayer in which a person honestly forgets something is always completely invalid and must be repeated.", ar: "صَوابٌ أم خَطأ: الصَّلاةُ التي يَنسى فيها المَرءُ شَيئًا صادِقًا باطِلةٌ دائِمًا ويَجِبُ إعادَتُها." },
      options: [
        { en: "False — Islam allows it to be mended with Sujud As-Sahw, a mercy for human forgetfulness", ar: "خَطأ — يُتيحُ الإسلامُ جَبرَها بِسُجودِ السَّهو، رَحمةً بِنِسيانِ الإنسان" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Sujud As-Sahw exists precisely so honest mistakes can be repaired, not the prayer thrown away.", ar: "شُرِعَ سُجودُ السَّهوِ تَحديدًا لِتُجبَرَ الأخطاءُ الصّادِقةُ لا لِتُطرَحَ الصَّلاة." },
    },
  ],
};
