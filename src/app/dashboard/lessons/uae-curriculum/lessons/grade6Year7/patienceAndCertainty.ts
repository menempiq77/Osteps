import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const patienceAndCertainty: CourseLesson = {
  slug: "g6y7-patience-and-certainty-as-sajdah-23-30",
  name: {
    en: "Patience and Certainty (As-Sajdah 23-30)",
    ar: "الصَّبرُ واليَقينُ (السجدة ٢٣-٣٠)",
  },
  shortIntro: {
    en: "The conclusion of Surat As-Sajdah: how Allah made Musa a guide, the law that leadership in faith is earned by patience and certainty, the sign of rain reviving dead earth as proof of resurrection, and the final warning to act before 'the day of conquest'.",
    ar: "خِتامُ سورةِ السَّجدة: كَيفَ جَعَلَ اللهُ موسى إمامًا، وقانونُ أنَّ إمامةَ الدِّينِ تُنالُ بِالصَّبرِ واليَقين، وآيةُ الغَيثِ يُحيي الأرضَ المَيتةَ بُرهانًا على البَعث، والإنذارُ الأخيرُ بِالعَمَلِ قَبلَ «يَومِ الفَتح».",
  },
  quranSurahs: ["As-Sajdah 23-30", "Al-Ankabut 69", "Fatir 9"],
  sections: [
    {
      title: { en: "Retrieval & the gift of guidance to Musa", ar: "استِرجاعٌ وعَطاءُ الهُدى لِموسى" },
      learningObjectives: [
        { en: "Recall the argument of As-Sajdah 13-22 and connect it to the example of Musa.", ar: "أستَرجِعُ حُجّةَ السجدة ١٣-٢٢ وأربِطُها بِمَثَلِ موسى." },
        { en: "Explain why the Qur'an points to earlier scriptures as confirming this revelation.", ar: "أُبَيِّنُ لِماذا يُشيرُ القُرآنُ إلى الكُتُبِ السّابِقةِ مُصَدِّقةً لِهذا الوَحي." },
      ],
      successCriteria: [
        { en: "I can explain 'do not be in doubt about meeting Him' (verse 23).", ar: "أُفَسِّرُ «فلا تَكُنْ في مِريةٍ مِن لِقائِه» (الآية ٢٣)." },
        { en: "I can link the Torah given to Musa with the Qur'an given to Muhammad ﷺ.", ar: "أربِطُ التَّوراةَ المُعطاةَ لِموسى بِالقُرآنِ المُعطى لِمُحَمَّدٍ ﷺ." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A high mountain, recalling the mount where Musa received revelation.", ar: "جَبَلٌ شامِخٌ، يُذَكِّرُ بِالطّورِ حَيثُ تَلَقّى موسى الوَحي." },
        caption: { en: "One source of guidance across the prophets: 'Do not be in doubt about meeting Him.'", ar: "مَصدَرٌ واحِدٌ لِلهُدى عَبرَ الأنبياء: «فلا تَكُنْ في مِريةٍ مِن لِقائِه»." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why mention Musa right after defending the Qur'an?", ar: "لِماذا يُذكَرُ موسى مُباشَرةً بَعدَ الدِّفاعِ عنِ القُرآن؟" },
        body: {
          en: "After proving the Qur'an is true revelation, Allah reminds the Prophet ﷺ that He 'gave Musa the Book' too. Build the argument: how does pointing to a previous, well-known revelation strengthen the case that Muhammad ﷺ is not an innovation but the continuation of one divine message?",
          ar: "بَعدَ إثباتِ أنَّ القُرآنَ وَحيٌ حَقّ، يُذَكِّرُ اللهُ النَّبِيَّ ﷺ بِأنَّهُ «آتى موسى الكِتاب» أيضًا. ابنِ الحُجّة: كَيفَ يُقَوّي الإشارةُ إلى وَحيٍ سابِقٍ مَعروفٍ كَونَ مُحَمَّدٍ ﷺ لَيسَ بِدعًا بل امتِدادًا لِرِسالةٍ إلهيّةٍ واحِدة؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And We certainly gave Musa the Book, so do not be in doubt about meeting Him, and We made it a guidance for the Children of Israel.\" — As-Sajdah 23", ar: "﴿وَلَقَدْ آتَيْنَا مُوسَى الْكِتَابَ فَلَا تَكُن فِي مِرْيَةٍ مِّن لِّقَائِهِ ۖ وَجَعَلْنَاهُ هُدًى لِّبَنِي إِسْرَائِيلَ﴾ — السجدة ٢٣" },
          ],
        },
        {
          label: { en: "Tafsir note (Ibn Kathir)", ar: "فائدةٌ تَفسيريّة (ابن كثير)" },
          lines: [
            { en: "Mufassirun explain the linking of Musa's Book here: the Qur'an, like the Torah, is genuine guidance from the same Lord. The unity of the prophetic message is itself evidence against those who treat Muhammad ﷺ as something unheard-of.", ar: "يُبَيِّنُ المُفَسِّرونَ رَبطَ كِتابِ موسى هُنا: فالقُرآنُ كالتَّوراةِ هُدًى حَقٌّ مِنَ الرَّبِّ نَفسِه. ووَحدةُ الرِّسالةِ النَّبَوِيّةِ دَليلٌ على بُطلانِ مَن يَعُدُّ مُحَمَّدًا ﷺ أمرًا غَيرَ مَسبوق." },
          ],
        },
      ],
      body: {
        en: "Having defended the Qur'an's origin and divided humanity into the path of faith and the path of denial, Surat As-Sajdah now offers a powerful historical witness. 'We certainly gave Musa the Book' — the same kind of revelation, from the same Lord, to a prophet the Makkans themselves acknowledged. The point is profound: Muhammad ﷺ is not bringing a strange new claim. He stands in a long line of messengers carrying one continuous message. The unbeliever who finds it incredible that Allah would send a Book to a man has forgotten that Allah already did so, repeatedly, throughout history.\n\nThe verse then turns to the Prophet ﷺ with reassurance: 'so do not be in doubt about meeting Him.' Scholars explain this in more than one way — do not doubt your meeting with your Lord, or do not doubt that Musa received his Book, or do not doubt your meeting with Musa (as occurred on the Night Journey). All these meanings comfort the Prophet ﷺ under the pressure of denial: the truth he carries is well-attested and certain, not something to be anxious about.\n\nFinally, the Torah was made 'a guidance for the Children of Israel.' Each revelation was guidance for its people in its time, and now the Qur'an is guidance for all people until the end. A thoughtful student sees the design of the passage: before teaching the law of how guidance becomes leadership (the next verse), Allah grounds it in the most famous example of a guided nation. History is not decoration here; it is evidence. The same God who guided through Musa is guiding through Muhammad ﷺ, and the response demanded is the same — certainty, not doubt.",
        ar: "بَعدَ الدِّفاعِ عن مَصدَرِ القُرآنِ وقِسمةِ النّاسِ إلى طَريقِ إيمانٍ وطَريقِ جُحود، تُقَدِّمُ سورةُ السَّجدةِ الآنَ شاهِدًا تاريخيًّا قَوِيًّا. «ولَقَد آتَينا موسى الكِتاب» — وَحيٌ مِن جِنسِه، مِنَ الرَّبِّ نَفسِه، لِنَبِيٍّ اعتَرَفَ بِهِ أهلُ مَكّةَ أنفُسُهُم. والمَغزى عَميق: فَمُحَمَّدٌ ﷺ لا يَأتي بِدَعوى غَريبةٍ جَديدة. بل يَقِفُ في سِلسِلةٍ طَويلةٍ مِنَ الرُّسُلِ يَحمِلونَ رِسالةً واحِدةً مُتَّصِلة. والكافِرُ الذي يَستَبعِدُ أن يُرسِلَ اللهُ كِتابًا إلى رَجُلٍ قد نَسِيَ أنَّ اللهَ فَعَلَ ذلك مِرارًا عَبرَ التّاريخ.\n\nثُمَّ تَلتَفِتُ الآيةُ إلى النَّبِيِّ ﷺ بِالتَّطمين: «فلا تَكُنْ في مِريةٍ مِن لِقائِه». ويُفَسِّرُهُ العُلَماءُ بِأكثَرَ مِن وَجه — لا تَشُكَّ في لِقاءِ رَبِّك، أو لا تَشُكَّ أنَّ موسى تَلَقّى كِتابَه، أو لا تَشُكَّ في لِقائِكَ بِموسى (كما وَقَعَ لَيلةَ الإسراء). وكُلُّ هذه المَعاني تُسَلّي النَّبِيَّ ﷺ تَحتَ ضَغطِ الجُحود: فالحَقُّ الذي يَحمِلُهُ ثابِتٌ مُؤَكَّد، لا مَوضِعَ قَلَقٍ فيه.\n\nوأخيرًا جُعِلَتِ التَّوراةُ «هُدًى لِبَني إسرائيل». فَكُلُّ وَحيٍ كانَ هُدًى لِأهلِهِ في زَمانِه، والآنَ القُرآنُ هُدًى لِلنّاسِ كافّةً إلى آخِرِ الزَّمان. والطّالِبُ المُتَأمِّلُ يَرى تَصميمَ المَقطَع: فَقَبلَ تَعليمِ قانونِ كَيفَ يَصيرُ الهُدى إمامةً (في الآيةِ التّالية)، يُؤَصِّلُهُ اللهُ بِأشهَرِ مَثَلٍ لِأُمّةٍ مَهديّة. فالتّاريخُ هُنا لَيسَ زينةً؛ بل دَليل. فالإلهُ الذي هَدى بِموسى يَهدي بِمُحَمَّدٍ ﷺ، والمَطلوبُ واحِد — يَقينٌ لا شَكّ.",
      },
    },
    {
      title: { en: "Leadership earned by patience and certainty", ar: "الإمامةُ تُنالُ بِالصَّبرِ واليَقين" },
      learningObjectives: [
        { en: "State the law of verse 24 and explain its two conditions.", ar: "أُحَدِّدُ قانونَ الآيةِ ٢٤ وأُبَيِّنُ شَرطَيه." },
      ],
      image: {
        src: IMG.greenValley,
        alt: { en: "A steady road climbing through a valley.", ar: "طَريقٌ ثابِتٌ يَصعَدُ عَبرَ وادٍ." },
        caption: { en: "Patience plus certainty: the Qur'an's formula for spiritual leadership.", ar: "صَبرٌ مَعَ يَقين: مُعادَلةُ القُرآنِ لِلإمامةِ في الدِّين." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And We made from among them leaders guiding by Our command when they were patient and were certain of Our signs.\" — As-Sajdah 24", ar: "﴿وَجَعَلْنَا مِنْهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا لَمَّا صَبَرُوا ۖ وَكَانُوا بِآيَاتِنَا يُوقِنُونَ﴾ — السجدة ٢٤" },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "شاهِدٌ قُرآنِيّ" },
          lines: [
            { en: "\"And those who strive for Us — We will surely guide them to Our ways.\" — Al-Ankabut 69", ar: "﴿وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا﴾ — العنكبوت ٦٩" },
          ],
        },
      ],
      callout: {
        label: { en: "Analyse the formula", ar: "حَلِّلِ المُعادَلة" },
        title: { en: "Why these two together — patience and certainty?", ar: "لِماذا هاتانِ مَعًا — الصَّبرُ واليَقين؟" },
        body: {
          en: "As-Sa'di calls patience and certainty the two pillars of all religion: patience restrains us from disobedience and steadies us through hardship, while certainty drives us forward with conviction. Analyse why neither alone is enough — what goes wrong with patience without certainty, or certainty without patience?",
          ar: "يُسَمّي السعدِيُّ الصَّبرَ واليَقينَ رُكنَيِ الدِّينِ كُلِّه: فالصَّبرُ يَكُفُّنا عنِ المَعصيةِ ويُثَبِّتُنا في الشِّدّة، واليَقينُ يَدفَعُنا إلى الأمامِ بِقَناعة. حَلِّلْ لِماذا لا يَكفي أحَدُهُما وَحدَه — ماذا يَختَلُّ في صَبرٍ بِلا يَقين، أو يَقينٍ بِلا صَبر؟",
        },
      },
      body: {
        en: "Verse 24 is one of the most important leadership principles in the entire Qur'an, and it deserves to be memorised and lived. Allah says He made from the Children of Israel 'leaders guiding by Our command' — but notice the precise condition He attaches: 'when they were patient and were certain of Our signs.' Spiritual leadership, the honour of guiding others to Allah, is not handed out by accident or inheritance. It is earned, and it is earned by exactly two qualities working together.\n\nThe first is sabr — patience. This is far more than enduring pain quietly. The scholars describe three kinds: patience in obeying Allah (which is hard work), patience in staying away from sin (which resists desire), and patience under the decrees of life (which accepts trials without complaint). The second is yaqin — certainty: a deep, unshakeable conviction in the truth of Allah's signs, the kind of inner sight that no doubt can erode. As-Sa'di famously observed that with patience and certainty, leadership in religion is attained — and that these two are the foundation of every good thing in faith.\n\nWhy must they come together? Consider the failure of each alone. Patience without certainty is mere endurance with no direction — a person grinds on, but for what? Doubt eventually drains his effort of meaning. Certainty without patience is conviction that collapses at the first hardship — a person believes, but the moment faith costs him something, he gives up. It is only when conviction (certainty) fuels perseverance (patience) that a believer becomes someone others can follow. The early Muslims who held firm under torture in Makkah were living this verse, and so the leadership of the Ummah passed to them. A demanding student should read this as a personal roadmap: if you want Allah to make you a guide for good, the path is plain — be patient and be certain, and refuse to let go of either.",
        ar: "الآيةُ ٢٤ مِن أهَمِّ قَواعِدِ القِيادةِ في القُرآنِ كُلِّه، وهي جَديرةٌ بِأن تُحفَظَ وتُعاش. يَقولُ اللهُ إنَّهُ جَعَلَ مِن بَني إسرائيلَ «أئِمّةً يَهدونَ بِأمرِنا» — لكِنْ تَأمَّلِ الشَّرطَ الدَّقيقَ الذي رَبَطَهُ بِها: «لَمّا صَبَروا وكانوا بِآياتِنا يوقِنون». فإمامةُ الدِّين، وشَرَفُ هِدايةِ الآخَرينَ إلى الله، لا تُمنَحُ مُصادَفةً ولا تُورَث. بل تُكتَسَب، وتُكتَسَبُ بِخَصلَتَينِ تَعمَلانِ مَعًا بِالضَّبط.\n\nالأولى الصَّبر. وهو أوسَعُ مِن تَحَمُّلِ الألَمِ صامِتًا. ذَكَرَ العُلَماءُ لَهُ ثَلاثةَ أنواع: صَبرٌ على طاعةِ اللهِ (وهو كَدح)، وصَبرٌ عن مَعصيَتِهِ (وهو مُقاوَمةُ الهَوى)، وصَبرٌ على أقدارِهِ (وهو قَبولُ البَلاءِ بِلا تَسَخُّط). والثانيةُ اليَقين: قَناعةٌ عَميقةٌ راسِخةٌ بِصِدقِ آياتِ الله، بَصيرةٌ باطِنةٌ لا يَنخُرُها شَكّ. وقد قالَ السعدِيُّ قَولَتَهُ المَشهورة: بِالصَّبرِ واليَقينِ تُنالُ الإمامةُ في الدِّين — وهُما أساسُ كُلِّ خَيرٍ في الإيمان.\n\nولِمَ لا بُدَّ أن يَجتَمِعا؟ تَأمَّلْ فَشَلَ كُلٍّ وَحدَه. فالصَّبرُ بِلا يَقينٍ مُجَرَّدُ احتِمالٍ بِلا وِجهة — يَكدَحُ المَرءُ، لكِنْ لِماذا؟ والشَّكُّ يُفرِغُ جُهدَهُ مِنَ المَعنى آخِرَ الأمر. واليَقينُ بِلا صَبرٍ قَناعةٌ تَنهارُ عِندَ أوَّلِ شِدّة — يُؤمِنُ المَرء، فإذا كَلَّفَهُ الإيمانُ شَيئًا تَخَلّى. ولا يَصيرُ المُؤمِنُ مَن يَقتَدي بِهِ غَيرُهُ إلّا حينَ تُغَذّي القَناعةُ (اليَقينُ) المُثابَرةَ (الصَّبرَ). والمُسلِمونَ الأوائِلُ الذينَ ثَبَتوا تَحتَ التَّعذيبِ في مَكّةَ كانوا يَعيشونَ هذه الآية، فانتَقَلَت إليهِم إمامةُ الأُمّة. وعلى الطّالِبِ المُطالِبِ أن يَقرَأَها خَريطةً شَخصيّة: إن أرَدتَ أن يَجعَلَكَ اللهُ هادِيًا لِلخَير، فالطَّريقُ واضِح — اصبِرْ وأيقِنْ، ولا تُفَرِّطْ في أيٍّ مِنهُما.",
      },
    },
    {
      title: { en: "The sign of the reviving rain", ar: "آيةُ الغَيثِ المُحيي" },
      learningObjectives: [
        { en: "Explain how verse 27 uses the water cycle as proof of resurrection.", ar: "أُبَيِّنُ كَيفَ تَستَعمِلُ الآيةُ ٢٧ دَورةَ الماءِ بُرهانًا على البَعث." },
      ],
      image: {
        src: IMG.waterfall,
        alt: { en: "Water bringing life to a green landscape.", ar: "ماءٌ يَبعَثُ الحَياةَ في أرضٍ خَضراء." },
        caption: { en: "Dead earth turning green: a resurrection you can watch every season.", ar: "أرضٌ مَيتةٌ تَخضَرّ: بَعثٌ تُشاهِدُهُ كُلَّ فَصل." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"Do they not see that We drive water to the barren land and bring forth crops from which their cattle and they themselves eat? Then will they not see?\" — As-Sajdah 27", ar: "﴿أَوَلَمْ يَرَوْا أَنَّا نَسُوقُ الْمَاءَ إِلَى الْأَرْضِ الْجُرُزِ فَنُخْرِجُ بِهِ زَرْعًا تَأْكُلُ مِنْهُ أَنْعَامُهُمْ وَأَنفُسُهُمْ ۖ أَفَلَا يُبْصِرُونَ﴾ — السجدة ٢٧" },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "شاهِدٌ قُرآنِيّ" },
          lines: [
            { en: "\"...and We send down from the sky pure water, that We may bring to life a dead land... Thus is the resurrection.\" — cf. Al-Furqan 48-49; Fatir 9", ar: "﴿...وَأَنزَلْنَا مِنَ السَّمَاءِ مَاءً طَهُورًا ۝ لِّنُحْيِيَ بِهِ بَلْدَةً مَّيْتًا...﴾ كَذلِكَ النُّشور — انظُر الفرقان ٤٨-٤٩؛ فاطر ٩" },
          ],
        },
      ],
      callout: {
        label: { en: "Reason it through", ar: "استَدِلَّ بِنَفسِك" },
        title: { en: "From green fields to the Day of Resurrection", ar: "مِنَ الحُقولِ الخَضراءِ إلى يَومِ البَعث" },
        body: {
          en: "The verse ends twice with a challenge to 'see.' Build the argument it expects you to make: if you watch Allah bring a dead, barren land to life every single year, on what rational grounds could you deny that He can bring dead bodies back to life? Why is everyday nature itself a standing proof of the Hereafter?",
          ar: "تَختِمُ الآيةُ مَرَّتَينِ بِتَحَدّي «النَّظَر». ابنِ الحُجّةَ التي تَنتَظِرُها مِنك: إذا كُنتَ تَرى اللهَ يُحيي أرضًا مَيتةً جُرُزًا كُلَّ عامٍ، فَبِأيِّ أساسٍ عَقلِيٍّ تُنكِرُ قُدرَتَهُ على إحياءِ الأجسادِ المَيتة؟ ولِماذا تَكونُ الطَّبيعةُ اليَومِيّةُ نَفسُها بُرهانًا قائِمًا على الآخِرة؟",
        },
      },
      responsePrompt: {
        title: { en: "Written response", ar: "إجابةٌ مَكتوبة" },
        prompt: { en: "Using As-Sajdah 27, construct a clear argument for resurrection from the example of rain reviving dead earth. State the observation, the principle, and the conclusion in your own words.", ar: "مُستَعمِلًا السجدةَ ٢٧، اصنَعْ حُجّةً واضِحةً على البَعثِ مِن مَثَلِ الغَيثِ يُحيي الأرضَ المَيتة. اذكُرِ المُشاهَدةَ والمَبدَأَ والنَّتيجةَ بِكَلِماتِك." },
        placeholder: { en: "Every year we observe that... The principle is... Therefore...", ar: "نُشاهِدُ كُلَّ عامٍ أنَّ... والمَبدَأُ هو... ولِذلك..." },
      },
      body: {
        en: "Surat As-Sajdah opened by establishing that the Qur'an is true and that resurrection is real; now, near its close, it offers one of the Qur'an's most accessible proofs of the Hereafter — a proof anyone can verify with their own eyes. 'Do they not see that We drive water to the barren land and bring forth crops?' The word for barren land (juruz) describes earth that is utterly dry, lifeless, seemingly finished. Then the rain comes, and within weeks that same dead ground bursts into green life, feeding both cattle and people.\n\nThe argument hidden inside this verse is elegant and forceful. The disbelievers of Makkah could not imagine how scattered bones and dust could be brought back to life. Allah answers not with abstract theology but by pointing to something they witnessed every season: He brings the dead earth to life constantly, before their very eyes. If you accept the smaller miracle that you see every year, on what logical basis do you reject the greater one? The God who revives the land can certainly revive its people. This is why the cross-references in Surat Fatir and Al-Furqan state it directly: 'Thus is the resurrection.'\n\nNotice the double command to 'see.' The first asks whether they observe the physical event; the second, 'will they not see?', asks whether they will perceive its meaning. There is a difference between watching rain fall and understanding what it proves. The Qur'an constantly turns the believer into a reader of the natural world, treating every spring as a rehearsal for the Day of Resurrection. A serious student should leave this verse unable to look at a green field after rain in the same way again — for in it Allah has placed a small, repeating resurrection, a sign for anyone willing not just to look, but to truly see.",
        ar: "افتَتَحَت سورةُ السَّجدةِ بِتَقريرِ أنَّ القُرآنَ حَقٌّ وأنَّ البَعثَ واقِع؛ والآنَ قُربَ خِتامِها تُقَدِّمُ واحِدًا مِن أيسَرِ بَراهينِ القُرآنِ على الآخِرة — بُرهانًا يَتَحَقَّقُ مِنهُ كُلُّ أحَدٍ بِعَينَيه. «أوَلَم يَرَوا أنّا نَسوقُ الماءَ إلى الأرضِ الجُرُزِ فَنُخرِجُ بِهِ زَرعًا؟» ولَفظُ «الجُرُز» يَصِفُ أرضًا يابِسةً تامّةَ المَوت، كَأنَّها انتَهَت. ثُمَّ يَأتي الغَيث، فإذا تِلكَ الأرضُ المَيتةُ نَفسُها تَنفَجِرُ خَضراءَ حَيّةً في أسابيعَ تُطعِمُ الأنعامَ والنّاسَ.\n\nوالحُجّةُ الكامِنةُ في الآيةِ أنيقةٌ قَوِيّة. فَكُفّارُ مَكّةَ لم يَتَصَوَّروا كَيفَ تُبعَثُ عِظامٌ مُتَناثِرةٌ وتُرابٌ إلى الحَياة. فأجابَهُمُ اللهُ لا بِلاهوتٍ مُجَرَّدٍ بل بِالإشارةِ إلى ما يَرَونَهُ كُلَّ فَصل: إنَّهُ يُحيي الأرضَ المَيتةَ دَومًا أمامَ أعيُنِهِم. فإذا قَبِلتَ المُعجِزةَ الصُّغرى التي تَراها كُلَّ عام، فَبِأيِّ مَنطِقٍ تَرفُضُ الكُبرى؟ فالإلهُ الذي يُحيي الأرضَ قادِرٌ يَقينًا على إحياءِ أهلِها. ولِهذا تَقولُ الشَّواهِدُ في فاطِرٍ والفُرقانِ صَراحةً: «كَذلِكَ النُّشور».\n\nوتَأمَّلِ الأمرَ المُكَرَّرَ بِـ«النَّظَر». فالأوَّلُ يَسألُ: أيُشاهِدونَ الحَدَثَ الحِسِّيّ؟ والثاني «أفَلا يُبصِرون؟» يَسألُ: أيُدرِكونَ مَعناه؟ فَفَرقٌ بَينَ مُشاهَدةِ نُزولِ المَطَرِ وفَهمِ ما يُثبِتُه. والقُرآنُ يُحَوِّلُ المُؤمِنَ دَومًا إلى قارِئٍ لِكِتابِ الكَون، يَجعَلُ كُلَّ رَبيعٍ بُروفةً لِيَومِ البَعث. وعلى الطّالِبِ الجادِّ أن يُغادِرَ هذه الآيةَ وهو لا يَستَطيعُ أن يَنظُرَ إلى حَقلٍ أخضَرَ بَعدَ المَطَرِ كَما كانَ يَنظُرُ — فقد أودَعَ اللهُ فيهِ بَعثًا صَغيرًا مُتَكَرِّرًا، آيةً لِمَن شاءَ ألّا يَنظُرَ فَقَط بل أن يُبصِرَ حَقًّا.",
      },
    },
    {
      title: { en: "'When is this conquest?' — acting before it is too late", ar: "«مَتى هذا الفَتح؟» — العَمَلُ قَبلَ فَواتِ الأوان" },
      learningObjectives: [
        { en: "Explain the deniers' question in verse 28 and Allah's answer in verses 29-30.", ar: "أُبَيِّنُ سُؤالَ الجاحِدينَ في الآيةِ ٢٨ وجَوابَ اللهِ في الآيتَين ٢٩-٣٠." },
      ],
      image: {
        src: IMG.skyBlue,
        alt: { en: "A bright sky before a decisive day.", ar: "سَماءٌ مُشرِقةٌ قَبلَ يَومٍ فاصِل." },
        caption: { en: "The deniers mock and ask 'when?'; the answer is: faith then will not help.", ar: "يَسخَرُ الجاحِدونَ ويَسألونَ «مَتى؟»؛ والجَوابُ: لَن يَنفَعَ الإيمانُ حينَئذٍ." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And they say, 'When is this conquest, if you are truthful?' Say, 'On the Day of Conquest the belief of those who had disbelieved will not benefit them, nor will they be granted respite.' So turn away from them and wait; indeed, they are waiting too.\" — As-Sajdah 28-30", ar: "﴿وَيَقُولُونَ مَتَىٰ هَٰذَا الْفَتْحُ إِن كُنتُمْ صَادِقِينَ ۝ قُلْ يَوْمَ الْفَتْحِ لَا يَنفَعُ الَّذِينَ كَفَرُوا إِيمَانُهُمْ وَلَا هُمْ يُنظَرُونَ ۝ فَأَعْرِضْ عَنْهُمْ وَانتَظِرْ إِنَّهُم مُّنتَظِرُونَ﴾ — السجدة ٢٨-٣٠" },
          ],
        },
        {
          label: { en: "Tafsir note (Ibn Kathir / As-Sa'di)", ar: "فائدةٌ تَفسيريّة (ابن كثير / السعدي)" },
          lines: [
            { en: "'The Day of Conquest' (yawm al-fath) is explained as the decisive judgement — for some, death or the conquest of Makkah; ultimately, the Day of Resurrection. The point: faith offered when the truth becomes undeniable comes too late to benefit.", ar: "«يَومُ الفَتح» فُسِّرَ بِالفَصلِ الحاسِم — لِبَعضِهِم بِالمَوتِ أو فَتحِ مَكّة؛ وغايَتُهُ يَومُ القِيامة. والمَغزى: أنَّ الإيمانَ المَبذولَ حينَ يَصيرُ الحَقُّ لا يُنكَرُ يَأتي مُتَأخِّرًا فَلا يَنفَع." },
          ],
        },
      ],
      callout: {
        label: { en: "Expose the question", ar: "افضَحِ السُّؤال" },
        title: { en: "Is 'when will it happen?' a real question or an excuse?", ar: "أسُؤالُ «مَتى يَقَعُ؟» سُؤالٌ حَقيقيٌّ أم عُذر؟" },
        body: {
          en: "The deniers demand a date for the judgement, as if a missing timetable disproves the event. Analyse the trick: how does asking 'when?' let a person avoid the real question 'is it true?' — and why does Allah refuse to give a date, answering instead about what that Day will mean for them?",
          ar: "يُطالِبُ الجاحِدونَ بِتاريخٍ لِلفَصل، كَأنَّ غِيابَ المَوعِدِ يُبطِلُ الحَدَث. حَلِّلِ الحِيلة: كَيفَ يُتيحُ سُؤالُ «مَتى؟» لِلمَرءِ أن يَتَهَرَّبَ مِنَ السُّؤالِ الحَقيقيِّ «أحَقٌّ هو؟» — ولِماذا يَأبى اللهُ إعطاءَ تاريخٍ ويُجيبُ بَدَلَهُ عمّا يَعنيهِ ذلك اليَومُ لَهُم؟",
        },
      },
      body: {
        en: "The surah closes with the deniers' final taunt: 'When is this conquest, if you are truthful?' On the surface it sounds like a fair question, but the Qur'an exposes it as an evasion. They are not really asking for information; they are mocking, demanding a date as if the absence of a timetable disproves the Day itself. It is a familiar tactic — to bury the real question ('Is this true?') under a question that cannot be answered now ('Exactly when?').\n\nAllah's reply is striking because He refuses to play their game. He does not give a date. Instead He tells them what that Day will mean: 'On the Day of Conquest the belief of those who had disbelieved will not benefit them, nor will they be granted respite.' This is the heart of the warning. There is a point at which the truth becomes so undeniable that 'believing' is no longer a choice but a forced recognition — and faith at that moment is worthless, like a student who only starts studying once the exam paper is being collected. The whole value of faith lies in believing the unseen now, while denial is still possible and belief still costs something.\n\nThe surah ends with calm command to the Prophet ﷺ: 'So turn away from them and wait; indeed, they are waiting too.' Both sides are waiting — but for opposite ends. The believer waits in patience and certainty (the very qualities of verse 24) for the promise of his Lord; the denier waits, often unknowingly, for the moment his denial runs out. With this, As-Sajdah completes its arc: it began by proving the Book is true and resurrection is real, described the believers and the rebels, taught that leadership is won by patience and certainty, pointed to the reviving rain as a sign, and now leaves every reader at the same decision the Makkans faced. The lesson for the demanding student is sharp and personal: do not waste the only valuable time for faith — which is now — asking 'when?' when the real question is 'will I respond?'",
        ar: "تَختِمُ السّورةُ بِآخِرِ تَهَكُّمِ الجاحِدين: «مَتى هذا الفَتحُ إن كُنتُم صادِقين؟» وظاهِرُهُ سُؤالٌ مُنصِف، لكِنَّ القُرآنَ يَكشِفُهُ تَهَرُّبًا. فَهُم لا يَطلُبونَ مَعلومةً حَقًّا؛ بل يَسخَرون، يُطالِبونَ بِتاريخٍ كَأنَّ غِيابَ المَوعِدِ يُبطِلُ اليَومَ نَفسَه. وهي حِيلةٌ مَألوفة — دَفنُ السُّؤالِ الحَقيقيِّ («أحَقٌّ هذا؟») تَحتَ سُؤالٍ لا يُجابُ الآن («مَتى بِالضَّبط؟»).\n\nوجَوابُ اللهِ لافِتٌ لِأنَّهُ يَأبى أن يُجارِيَ لُعبَتَهُم. فَلا يُعطي تاريخًا. بل يُخبِرُهُم بِما يَعنيهِ ذلك اليَوم: «يَومَ الفَتحِ لا يَنفَعُ الذينَ كَفَروا إيمانُهُم ولا هُم يُنظَرون». وهذا لُبُّ الإنذار. فَثَمَّةَ لَحظةٌ يَصيرُ فيها الحَقُّ مِنَ الوُضوحِ بِحَيثُ لا يَبقى «الإيمانُ» خِيارًا بل اعتِرافًا مُلجَأً إليه — والإيمانُ حينَئذٍ بِلا قيمة، كَطالِبٍ لا يَبدَأُ المُذاكَرةَ إلّا وأوراقُ الامتِحانِ تُجمَع. فَكُلُّ قيمةِ الإيمانِ في تَصديقِ الغَيبِ الآن، وما زالَ الجُحودُ مُمكِنًا والإيمانُ يُكَلِّفُ شَيئًا.\n\nوتَنتَهي السّورةُ بِأمرٍ هادِئٍ لِلنَّبِيِّ ﷺ: «فأعرِضْ عَنهُم وانتَظِرْ إنَّهُم مُنتَظِرون». فالطَّرَفانِ يَنتَظِران — لكِنْ غايَتَينِ مُتَضادَّتَين. المُؤمِنُ يَنتَظِرُ بِصَبرٍ ويَقينٍ (وهُما خَصلَتا الآيةِ ٢٤) وَعدَ رَبِّه؛ والجاحِدُ يَنتَظِرُ، وهو غالِبًا لا يَدري، لَحظةَ نَفادِ جُحودِه. وبِهذا تُكمِلُ السَّجدةُ قَوسَها: بَدَأَت بِإثباتِ أنَّ الكِتابَ حَقٌّ والبَعثَ واقِع، ووَصَفَتِ المُؤمِنينَ والمُتَمَرِّدين، وعَلَّمَت أنَّ الإمامةَ تُنالُ بِالصَّبرِ واليَقين، وأشارَت إلى الغَيثِ المُحيي آيةً، وها هي تَترُكُ كُلَّ قارِئٍ أمامَ القَرارِ نَفسِهِ الذي واجَهَهُ أهلُ مَكّة. والدَّرسُ لِلطّالِبِ المُطالِبِ حادٌّ وشَخصِيّ: لا تُضَيِّعِ الوَقتَ الوَحيدَ الثَّمينَ لِلإيمانِ — وهو الآن — في سُؤالِ «مَتى؟» والسُّؤالُ الحَقُّ هو «هل أستَجيب؟»",
      },
    },
    {
      title: { en: "Synthesis: the surah's complete argument", ar: "تَركيبٌ: حُجّةُ السّورةِ الكامِلة" },
      learningObjectives: [
        { en: "Synthesise As-Sajdah 23-30 and connect it to the whole surah's message.", ar: "أُرَكِّبُ السجدةَ ٢٣-٣٠ وأربِطُها بِرِسالةِ السّورةِ كامِلةً." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "A mosque under an open sky.", ar: "مَسجِدٌ تَحتَ سَماءٍ مَفتوحة." },
        caption: { en: "From proof, to patience, to the reviving rain, to the final choice.", ar: "مِنَ البُرهان، إلى الصَّبر، إلى الغَيثِ المُحيي، إلى القَرارِ الأخير." },
      },
      matchingActivity: {
        title: { en: "Match the verse to its role in the argument", ar: "طابِقِ الآيةَ بِدَورِها في الحُجّة" },
        instruction: { en: "Connect each verse to the point it contributes to the surah's conclusion.", ar: "اربِطْ كُلَّ آيةٍ بِالنُّقطةِ التي تُسهِمُ بِها في خِتامِ السّورة." },
        prompts: [
          { en: "'We gave Musa the Book' (23)", ar: "«آتَينا موسى الكِتاب» (٢٣)" },
          { en: "'leaders... when they were patient and certain' (24)", ar: "«أئِمّةً... لَمّا صَبَروا وأيقَنوا» (٢٤)" },
          { en: "'We drive water to the barren land' (27)", ar: "«نَسوقُ الماءَ إلى الأرضِ الجُرُز» (٢٧)" },
          { en: "'their belief will not benefit them' (29)", ar: "«لا يَنفَعُهُم إيمانُهُم» (٢٩)" },
        ].map((p, i) => ({
          prompt: p,
          answer: [
            { en: "Revelation is one continuous message across the prophets.", ar: "الوَحيُ رِسالةٌ واحِدةٌ مُتَّصِلةٌ عَبرَ الأنبياء." },
            { en: "Spiritual leadership is earned by patience plus certainty.", ar: "إمامةُ الدِّينِ تُنالُ بِالصَّبرِ مَعَ اليَقين." },
            { en: "Reviving dead earth proves the reality of resurrection.", ar: "إحياءُ الأرضِ المَيتةِ يُثبِتُ حَقيقةَ البَعث." },
            { en: "Faith forced at the end, when denial is impossible, is too late.", ar: "الإيمانُ المُلجَأُ إليهِ آخِرًا، حينَ يَستَحيلُ الجُحود، يَأتي مُتَأخِّرًا." },
          ][i],
        })),
      },
      groupTasks: {
        title: { en: "Collaborative inquiry", ar: "تَحَرٍّ جَماعِيّ" },
        instruction: { en: "Each group develops and defends one conclusion of the surah.", ar: "تُطَوِّرُ كُلُّ مَجموعةٍ نَتيجةً مِنَ السّورةِ وتُدافِعُ عَنها." },
        groups: [
          {
            slug: "patience-certainty",
            name: { en: "Team A — Patience & certainty as a life-plan", ar: "الفَريقُ أ — الصَّبرُ واليَقينُ خِطّةَ حَياة" },
            learningObjective: { en: "Show how verse 24 maps onto a student's real challenges.", ar: "نُبَيِّنُ كَيفَ تَنطَبِقُ الآيةُ ٢٤ على تَحَدّياتِ الطّالِبِ الواقِعيّة." },
            task: { en: "Take three real pressures a Year 7 Muslim faces and show how patience and certainty together would meet each.", ar: "خُذوا ثَلاثَ ضُغوطٍ واقِعيّةٍ يُواجِهُها مُسلِمُ الصَّفِّ السّابِع وبَيِّنوا كَيفَ يُواجِهُها الصَّبرُ واليَقينُ مَعًا." },
            evidence: [
              { en: "As-Sajdah 24; Al-Ankabut 69; As-Sa'di's note on the two pillars.", ar: "السجدة ٢٤؛ العنكبوت ٦٩؛ فائدةُ السعديِّ في الرُّكنَين." },
            ],
            sourceNotes: [
              { en: "Patience without certainty drifts; certainty without patience collapses.", ar: "الصَّبرُ بِلا يَقينٍ يَتيه؛ واليَقينُ بِلا صَبرٍ يَنهار." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A 'patience + certainty' plan for three real challenges.", ar: "خِطّةُ «صَبرٍ ويَقين» لِثَلاثةِ تَحَدّياتٍ واقِعيّة." },
          },
          {
            slug: "rain-proof",
            name: { en: "Team B — Nature as evidence", ar: "الفَريقُ ب — الطَّبيعةُ دَليلًا" },
            learningObjective: { en: "Defend resurrection using the sign of the reviving rain.", ar: "نُدافِعُ عنِ البَعثِ بِآيةِ الغَيثِ المُحيي." },
            task: { en: "Build a clear three-step argument (observation, principle, conclusion) from verse 27 and add one other natural sign of Allah's power.", ar: "ابنوا حُجّةً واضِحةً مِن ثَلاثِ خُطُواتٍ (مُشاهَدة، مَبدَأ، نَتيجة) مِنَ الآيةِ ٢٧ وأضيفوا آيةً طَبيعيّةً أُخرى على قُدرةِ الله." },
            evidence: [
              { en: "As-Sajdah 27; Fatir 9; Al-Furqan 48-49.", ar: "السجدة ٢٧؛ فاطر ٩؛ الفرقان ٤٨-٤٩." },
            ],
            sourceNotes: [
              { en: "'Thus is the resurrection' — the small revival proves the great one.", ar: "«كَذلِكَ النُّشور» — الإحياءُ الصَّغيرُ يُثبِتُ الكَبير." },
            ],
            memberRoles: [
              { en: "Reader, Scribe, Spokesperson.", ar: "القارِئ، الكاتِب، المُتَحَدِّث." },
            ],
            finalProduct: { en: "A short 'proof from nature' presentation.", ar: "عَرضٌ قَصير: «بُرهانٌ مِنَ الطَّبيعة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Final synthesis", ar: "التَّركيبُ الخِتامِيّ" },
        prompt: { en: "Tie As-Sajdah 23-30 into the whole surah: how does the ending (Musa's guidance, the law of patience and certainty, the reviving rain, and the warning of the Day of Conquest) complete the argument that began with 'no doubt' about the Book? Write a developed paragraph.", ar: "اربِطِ السجدةَ ٢٣-٣٠ بِالسّورةِ كُلِّها: كَيفَ يُكمِلُ الخِتامُ (هُدى موسى، وقانونُ الصَّبرِ واليَقين، والغَيثُ المُحيي، وإنذارُ يَومِ الفَتح) الحُجّةَ التي بَدَأَت بِـ«لا رَيب» في الكِتاب؟ اكتُبْ فِقرةً مُكتَمِلة." },
        placeholder: { en: "Surat As-Sajdah ends by completing its argument: the same Lord who...", ar: "تَختِمُ سورةُ السَّجدةِ بِإكمالِ حُجَّتِها: فالرَّبُّ نَفسُهُ الذي..." },
      },
      body: {
        en: "Now read the close of the surah as the completion of a single, beautifully built argument. Surat As-Sajdah began by declaring that the Book is 'from the Lord of the worlds' with 'no doubt' in it, and that the Creator who made all things will raise the dead. Its ending gathers every thread. First, it grounds the message in history: the same Lord 'gave Musa the Book,' so this revelation is no novelty but the continuation of one divine guidance — there is no reason for doubt. Second, it teaches the law by which that guidance becomes leadership: patience and certainty, the two pillars that turned a persecuted few into imams of the Ummah. Third, it answers the deniers' deepest objection — resurrection — not with argument alone but with a sign they see every year: the rain that raises dead earth to life. And fourth, it closes the door on delay, warning that faith offered at 'the Day of Conquest,' when truth can no longer be denied, will not be accepted.\n\nSeen whole, the surah moves from proof, to people, to a principle for living, to a sign in nature, to a final choice. The matching activity asks you to fix each closing verse to its exact role in that structure. The group inquiry asks you to turn the law of verse 24 into a personal plan and to defend resurrection from the world around you, as the surah itself does. And this synthesis returns it all to you. As-Sajdah does not want to be admired; it wants a response. Its name is a command — to prostrate — and its whole argument bends toward a single moment: the moment a reader stops asking 'when?' and answers 'now.' The demanding student leaves this surah carrying two lifelong companions: the patience to hold firm and the certainty to know why — the very qualities by which Allah makes ordinary believers into guides for others.",
        ar: "اقرَأِ الآنَ خِتامَ السّورةِ بِوَصفِهِ إكمالًا لِحُجّةٍ واحِدةٍ بَديعةِ البِناء. بَدَأَت سورةُ السَّجدةِ بِإعلانِ أنَّ الكِتابَ «مِن رَبِّ العالَمين» «لا رَيبَ فيه»، وأنَّ الخالِقَ الذي صَنَعَ كُلَّ شَيءٍ يَبعَثُ المَوتى. وخِتامُها يَجمَعُ كُلَّ خَيط. أوَّلًا يُؤَصِّلُ الرِّسالةَ في التّاريخ: فالرَّبُّ نَفسُهُ «آتى موسى الكِتاب»، فَهذا الوَحيُ لَيسَ بِدعًا بل امتِدادُ هُدًى إلهيٍّ واحِد — فَلا مَوضِعَ لِلشَّكّ. ثانيًا يُعَلِّمُ القانونَ الذي يَصيرُ بِهِ الهُدى إمامةً: الصَّبرُ واليَقين، الرُّكنانِ اللَّذانِ حَوَّلا قِلّةً مُضطَهَدةً إلى أئِمّةٍ لِلأُمّة. ثالثًا يُجيبُ عن أعمَقِ اعتِراضِ الجاحِدين — البَعث — لا بِالحُجّةِ وَحدَها بل بِآيةٍ يَرَونَها كُلَّ عام: الغَيثُ يُحيي الأرضَ المَيتة. ورابِعًا يُغلِقُ بابَ التَّسويف، مُنذِرًا بِأنَّ الإيمانَ المَبذولَ «يَومَ الفَتح»، حينَ لا يُمكِنُ إنكارُ الحَقّ، لَن يُقبَل.\n\nوبِالنَّظَرِ الكُلِّيّ، تَتَنَقَّلُ السّورةُ مِنَ البُرهان، إلى النّاس، إلى مَبدَأٍ لِلحَياة، إلى آيةٍ في الطَّبيعة، إلى قَرارٍ أخير. تَطلُبُ مِنكَ المُطابَقةُ أن تُثَبِّتَ كُلَّ آيةٍ خِتاميّةٍ بِدَورِها الدَّقيقِ في هذا البِناء. ويَطلُبُ التَّحَرّي الجَماعِيُّ أن تُحَوِّلَ قانونَ الآيةِ ٢٤ إلى خِطّةٍ شَخصيّةٍ وأن تُدافِعَ عنِ البَعثِ مِنَ العالَمِ حَولَك، كَما تَفعَلُ السّورةُ نَفسُها. وهذا التَّركيبُ يَرُدُّ ذلك كُلَّهُ إليك. فالسَّجدةُ لا تُريدُ أن يُعجَبَ بِها؛ بل تُريدُ جَوابًا. واسمُها أمرٌ — بِالسُّجود — وحُجَّتُها كُلُّها تَنحَني نَحوَ لَحظةٍ واحِدة: لَحظةَ يَكُفُّ القارِئُ عن سُؤالِ «مَتى؟» ويُجيبُ «الآن». والطّالِبُ المُطالِبُ يُغادِرُ هذه السّورةَ حامِلًا رَفيقَينِ لِلعُمُر: صَبرًا يُثَبِّتُهُ ويَقينًا يُعَرِّفُهُ لِماذا — وهُما الخَصلَتانِ اللَّتانِ يَجعَلُ اللهُ بِهِما مِنَ المُؤمِنينَ العادِيّينَ هُداةً لِغَيرِهِم.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Why does As-Sajdah 23 mention that Allah 'gave Musa the Book'?", ar: "لِماذا تَذكُرُ السجدةُ ٢٣ أنَّ اللهَ «آتى موسى الكِتاب»؟" },
      options: [
        { en: "To show the Qur'an continues one divine message, so there is no cause for doubt", ar: "لِتُبَيِّنَ أنَّ القُرآنَ امتِدادُ رِسالةٍ إلهيّةٍ واحِدة، فَلا مَوضِعَ لِلشَّكّ" },
        { en: "To claim the Qur'an replaced all belief in God", ar: "لِتَزعُمَ أنَّ القُرآنَ ألغى الإيمانَ بِاللهِ كُلَّه" },
        { en: "Because Musa wrote the Qur'an", ar: "لِأنَّ موسى كَتَبَ القُرآن" },
        { en: "To prove revelation only happened once in history", ar: "لِتُثبِتَ أنَّ الوَحيَ وَقَعَ مَرّةً واحِدةً في التّاريخ" },
      ],
      correctIndex: 0,
      explanation: { en: "Pointing to a previous, accepted revelation shows Muhammad ﷺ is no novelty but part of one continuous guidance.", ar: "الإشارةُ إلى وَحيٍ سابِقٍ مَقبولٍ تُبَيِّنُ أنَّ مُحَمَّدًا ﷺ لَيسَ بِدعًا بل جُزءٌ مِن هُدًى واحِدٍ مُتَّصِل." },
    },
    {
      prompt: { en: "According to verse 24, how is leadership in faith (imamah) earned?", ar: "بِحَسَبِ الآيةِ ٢٤، كَيفَ تُنالُ الإمامةُ في الدِّين؟" },
      options: [
        { en: "By patience (sabr) together with certainty (yaqin)", ar: "بِالصَّبرِ مَعَ اليَقين" },
        { en: "By wealth and family name", ar: "بِالمالِ واسمِ العائِلة" },
        { en: "By avoiding all hardship", ar: "بِتَجَنُّبِ كُلِّ مَشَقّة" },
        { en: "By simply wishing for it", ar: "بِمُجَرَّدِ تَمَنّيها" },
      ],
      correctIndex: 0,
      explanation: { en: "'leaders guiding by Our command when they were patient and were certain of Our signs' — As-Sa'di: the two pillars of religion.", ar: "«أئِمّةً يَهدونَ بِأمرِنا لَمّا صَبَروا وكانوا بِآياتِنا يوقِنون» — قالَ السعدي: هُما رُكنا الدِّين." },
    },
    {
      prompt: { en: "What happens if you have patience without certainty, or certainty without patience?", ar: "ماذا يَحدُثُ لَو كانَ عِندَكَ صَبرٌ بِلا يَقين، أو يَقينٌ بِلا صَبر؟" },
      options: [
        { en: "Patience without certainty drifts aimlessly; certainty without patience collapses under hardship", ar: "الصَّبرُ بِلا يَقينٍ يَتيهُ بِلا وِجهة؛ واليَقينُ بِلا صَبرٍ يَنهارُ عِندَ الشِّدّة" },
        { en: "Either one alone is always enough", ar: "كُلٌّ مِنهُما وَحدَهُ كافٍ دائِمًا" },
        { en: "They have nothing to do with each other", ar: "لا عَلاقةَ لِأحَدِهِما بِالآخَر" },
        { en: "Both are unnecessary for faith", ar: "كِلاهُما غَيرُ ضَرورِيٍّ لِلإيمان" },
      ],
      correctIndex: 0,
      explanation: { en: "The verse joins them deliberately: conviction must fuel perseverance for a believer to lead.", ar: "تَجمَعُهُما الآيةُ عَمدًا: فَلا بُدَّ أن تُغَذّيَ القَناعةُ المُثابَرةَ لِيَكونَ المُؤمِنُ إمامًا." },
    },
    {
      prompt: { en: "How does As-Sajdah 27 (rain reviving dead land) serve as a proof?", ar: "كَيفَ تَكونُ السجدةُ ٢٧ (الغَيثُ يُحيي الأرضَ المَيتة) بُرهانًا؟" },
      options: [
        { en: "If Allah revives dead earth every year before our eyes, He can certainly resurrect the dead", ar: "إن كانَ اللهُ يُحيي الأرضَ المَيتةَ كُلَّ عامٍ أمامَ أعيُنِنا، فَهو قادِرٌ يَقينًا على بَعثِ المَوتى" },
        { en: "It proves rain is more important than faith", ar: "تُثبِتُ أنَّ المَطَرَ أهَمُّ مِنَ الإيمان" },
        { en: "It shows farming is forbidden", ar: "تُبَيِّنُ أنَّ الزِّراعةَ مُحَرَّمة" },
        { en: "It has no link to the Hereafter", ar: "لا صِلةَ لَها بِالآخِرة" },
      ],
      correctIndex: 0,
      explanation: { en: "The verse twice commands us to 'see'; other verses state plainly: 'Thus is the resurrection' (Fatir 9; Al-Furqan 49).", ar: "تَأمُرُ الآيةُ مَرَّتَينِ بِـ«النَّظَر»؛ وتَقولُ آياتٌ صَراحةً: «كَذلِكَ النُّشور» (فاطر ٩؛ الفرقان ٤٩)." },
    },
    {
      prompt: { en: "In verses 28-30, why is faith on 'the Day of Conquest' said not to benefit the deniers?", ar: "في الآياتِ ٢٨-٣٠، لِماذا قيلَ إنَّ الإيمانَ «يَومَ الفَتح» لا يَنفَعُ الجاحِدين؟" },
      options: [
        { en: "Because faith only has value when the unseen is believed now, while denial is still possible", ar: "لِأنَّ الإيمانَ لا قيمةَ لَهُ إلّا حينَ يُؤمَنُ بِالغَيبِ الآن، وما زالَ الجُحودُ مُمكِنًا" },
        { en: "Because Allah never forgives anyone", ar: "لِأنَّ اللهَ لا يَغفِرُ لِأحَدٍ أبَدًا" },
        { en: "Because belief is always useless", ar: "لِأنَّ الإيمانَ بِلا فائِدةٍ دائِمًا" },
        { en: "Because they asked for the exact date", ar: "لِأنَّهُم سَألوا عنِ التّاريخِ بِالضَّبط" },
      ],
      correctIndex: 0,
      explanation: { en: "Faith forced when truth becomes undeniable is like studying as the exam is collected — too late to count.", ar: "الإيمانُ المُلجَأُ إليهِ حينَ يَستَحيلُ إنكارُ الحَقِّ كَمُذاكَرةٍ وأوراقُ الامتِحانِ تُجمَع — مُتَأخِّرٌ لا يُحتَسَب." },
    },
    {
      prompt: { en: "True or False: The deniers' question 'When is this conquest?' was a sincere request for information.", ar: "صَوابٌ أم خَطأ: سُؤالُ الجاحِدينَ «مَتى هذا الفَتح؟» كانَ طَلَبًا صادِقًا لِلمَعلومة." },
      options: [
        { en: "False — it was a mocking evasion, burying 'is it true?' under 'exactly when?'", ar: "خَطأ — كانَ تَهَرُّبًا ساخِرًا، يَدفِنُ «أحَقٌّ هو؟» تَحتَ «مَتى بِالضَّبط؟»" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah refuses to give a date and instead warns what that Day will mean for them.", ar: "يَأبى اللهُ إعطاءَ تاريخٍ ويُنذِرُ بَدَلَهُ بِما يَعنيهِ ذلك اليَومُ لَهُم." },
    },
  ],
};
