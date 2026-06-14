import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const noonSakinahIzhar: CourseLesson = {
  slug: "g6y7-rules-of-noon-sakinah-and-tanwin-clear-pronunciation",
  name: {
    en: "Rules of Noon Sakinah and Tanwin: Clear Pronunciation (Izhar)",
    ar: "أحكامُ النّونِ السّاكِنةِ والتَّنوين: الإظهارُ الحَلقِيّ",
  },
  shortIntro: {
    en: "A precise study of the first rule of noon sakinah and tanwin — Izhar Halqi (clear pronunciation): what it is, its six throat letters, why the noon is pronounced clearly without ghunnah, and how mastering it honours the right of the Qur'an to be recited as it was revealed.",
    ar: "دِراسةٌ دَقيقةٌ لِأوَّلِ أحكامِ النّونِ السّاكِنةِ والتَّنوين — الإظهارِ الحَلقِيّ: ما هو، وحُروفُهُ الحَلقِيّةُ السِّتّة، ولِماذا تُنطَقُ النّونُ واضِحةً بِلا غُنّة، وكَيفَ يُؤَدّي إتقانُهُ حَقَّ القُرآنِ أن يُتلى كَما أُنزِل.",
  },
  quranSurahs: ["Al-Muzzammil 4", "An-Nahl 98", "Al-Ikhlas 1-4"],
  sections: [
    {
      title: { en: "Why tajweed? The right of the Qur'an", ar: "لِماذا التَّجويد؟ حَقُّ القُرآن" },
      learningObjectives: [
        { en: "Define tajweed and explain why reciting the Qur'an correctly is a duty.", ar: "أُعَرِّفُ التَّجويدَ وأُبَيِّنُ لِماذا تِلاوةُ القُرآنِ بِإتقانٍ واجِب." },
        { en: "Identify noon sakinah and tanwin in written words.", ar: "أُمَيِّزُ النّونَ السّاكِنةَ والتَّنوينَ في الكَلِماتِ المَكتوبة." },
      ],
      successCriteria: [
        { en: "I can define tajweed, noon sakinah, and tanwin precisely.", ar: "أُعَرِّفُ التَّجويدَ والنّونَ السّاكِنةَ والتَّنوينَ بِدِقّة." },
        { en: "I can explain the duty of reciting 'in measured tones'.", ar: "أُبَيِّنُ واجِبَ التِّلاوةِ «تَرتيلًا»." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an carefully.", ar: "طِفلٌ يَقرَأُ القُرآنَ بِعِناية." },
        caption: { en: "Tajweed gives every letter its right — reciting the Qur'an as it was revealed.", ar: "التَّجويدُ يُعطي كُلَّ حَرفٍ حَقَّه — تِلاوةُ القُرآنِ كَما أُنزِل." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does Allah command 'tartil'?", ar: "لِماذا يَأمُرُ اللهُ بِـ«التَّرتيل»؟" },
        body: {
          en: "Allah commands, 'and recite the Qur'an with measured recitation (tartil)' (Al-Muzzammil 4). Argue why the *manner* of recitation — not only understanding the meaning — is part of honouring the Qur'an, and what is lost when letters are slurred or mispronounced.",
          ar: "يَأمُرُ اللهُ: ﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤). حاجِجْ لِماذا تَكونُ *كَيفِيّةُ* التِّلاوةِ — لا فَهمُ المَعنى فَحَسب — جُزءًا مِن تَعظيمِ القُرآن، وما الذي يَضيعُ حينَ تُدغَمُ الحُروفُ أو تُنطَقُ خَطأ.",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحاتٌ مِفتاحِيّة" },
          lines: [
            { en: "Tajweed: reciting the Qur'an giving every letter its due — its correct articulation point (makhraj) and qualities (sifat). Noon sakinah (نْ): a noon with sukoon (no vowel). Tanwin (ـً ـٍ ـٌ): a doubled vowel ending pronounced as an 'n' sound but not written as a noon.", ar: "التَّجويد: تِلاوةُ القُرآنِ بِإعطاءِ كُلِّ حَرفٍ حَقَّهُ — مَخرَجَهُ الصَّحيحَ وصِفاتِه. النّونُ السّاكِنة (نْ): نونٌ بِسُكونٍ بِلا حَرَكة. التَّنوين (ـً ـٍ ـٌ): نونٌ ساكِنةٌ زائِدةٌ في آخِرِ الاسمِ تُنطَقُ ولا تُكتَبُ نونًا." },
          ],
        },
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...and recite the Qur'an with measured recitation.\" — Al-Muzzammil 4", ar: "﴿...ورَتِّلِ القُرآنَ تَرتيلًا﴾ — المزمل ٤" },
          ],
        },
      ],
      body: {
        en: "Before we study any single rule, we must understand why tajweed matters at all. The Qur'an is the literal speech of Allah, revealed to the Prophet ﷺ through the angel Jibril, and passed down to us recited exactly as it was first heard. Tajweed is the science of reciting it correctly: giving every letter its right — its proper articulation point in the mouth or throat (makhraj) and its proper qualities (sifat). Allah Himself commands the manner of recitation: 'and recite the Qur'an with measured recitation (tartil)' (Al-Muzzammil 4). The scholars explain that learning enough tajweed to recite without clear error is a duty upon every Muslim, because mispronouncing a letter can distort the very words of Allah.\n\nThis lesson begins the study of one of the most important chapters of tajweed: the rules of the noon sakinah and the tanwin. First, be precise about these two. A noon sakinah is the letter noon carrying a sukoon — that is, a noon with no vowel on it, written نْ, as in the word مِنْ. A tanwin is the doubled vowel sign at the end of a noun (ـً ـٍ ـٌ) which is pronounced as an extra 'n' sound but is not written with the letter noon — as in سَميعٌ or عَليمًا. The crucial point is that, for the purposes of these rules, the noon sakinah and the tanwin behave identically: both are an 'n' sound with no vowel, and what happens to that sound depends entirely on the letter that comes immediately after it.\n\nThere are four possible things that can happen to a noon sakinah or tanwin, depending on the next letter: Izhar (clear pronunciation), Idgham (merging), Iqlab (conversion), and Ikhfa (concealment). This lesson focuses on the first and simplest: Izhar. A demanding student should approach tajweed not as a set of dry technical rules, but as the discipline of beautifully and faithfully delivering the words of the Creator — a way of honouring the Qur'an with the tongue, just as we honour it with the heart and the actions.",
        ar: "قَبلَ دِراسةِ أيِّ حُكمٍ مُفرَد، يَجِبُ أن نَفهَمَ لِماذا التَّجويدُ مُهِمٌّ أصلًا. القُرآنُ كَلامُ اللهِ الحَقيقِيّ، أُنزِلَ على النَّبِيِّ ﷺ بِواسِطةِ المَلَكِ جِبريل، ووَصَلَ إلينا مَتلُوًّا كَما سُمِعَ أوَّلَ مَرّة. والتَّجويدُ عِلمُ تِلاوَتِهِ بِإتقان: إعطاءُ كُلِّ حَرفٍ حَقَّهُ — مَخرَجَهُ الصَّحيحَ في الفَمِ أو الحَلقِ وصِفاتِه. واللهُ نَفسُهُ يَأمُرُ بِكَيفِيّةِ التِّلاوة: ﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾ (المزمل ٤). ويُبَيِّنُ العُلَماءُ أنَّ تَعَلُّمَ ما يَكفي مِنَ التَّجويدِ لِلتِّلاوةِ بِلا خَطأٍ بَيِّنٍ واجِبٌ على كُلِّ مُسلِم، لِأنَّ نُطقَ الحَرفِ خَطأً قد يُحَرِّفُ كَلامَ اللهِ نَفسَه.\n\nويَبدَأُ هذا الدَّرسُ دِراسةَ أحَدِ أهَمِّ أبوابِ التَّجويد: أحكامِ النّونِ السّاكِنةِ والتَّنوين. أوَّلًا كُنْ دَقيقًا في هاتَين. النّونُ السّاكِنةُ هي حَرفُ النّونِ يَحمِلُ سُكونًا — أي نونٌ بِلا حَرَكةٍ تُكتَبُ نْ، كَما في كَلِمةِ مِنْ. والتَّنوينُ عَلامةُ حَرَكةٍ مُضاعَفةٍ في آخِرِ الاسمِ (ـً ـٍ ـٌ) تُنطَقُ نونًا زائِدةً ولا تُكتَبُ بِحَرفِ النّون — كَما في سَميعٌ أو عَليمًا. والنُّقطةُ الحاسِمةُ أنَّ النّونَ السّاكِنةَ والتَّنوينَ في هذه الأحكامِ يَتَصَرَّفانِ تَصَرُّفًا واحِدًا: كِلاهُما صَوتُ نونٍ بِلا حَرَكة، وما يَحدُثُ لِذلك الصَّوتِ يَتَوَقَّفُ كُلِّيًّا على الحَرفِ التّالي لَه.\n\nوهُناكَ أربَعُ حالاتٍ مُمكِنةٍ لِلنّونِ السّاكِنةِ أو التَّنوينِ بِحَسَبِ الحَرفِ التّالي: الإظهار، والإدغام، والإقلاب، والإخفاء. ويُرَكِّزُ هذا الدَّرسُ على الأوَّلِ والأبسَط: الإظهار. وعلى الطّالِبِ المُطالِبِ أن يَتَناوَلَ التَّجويدَ لا قَواعِدَ فَنِّيّةً جافّة، بل انضِباطَ الأداءِ الجَميلِ الأمينِ لِكَلامِ الخالِق — طَريقةً لِتَعظيمِ القُرآنِ بِاللِّسان، كَما نُعَظِّمُهُ بِالقَلبِ والعَمَل.",
      },
    },
    {
      title: { en: "Izhar: clear pronunciation", ar: "الإظهار: النُّطقُ الواضِح" },
      learningObjectives: [
        { en: "Define Izhar Halqi and explain its meaning.", ar: "أُعَرِّفُ الإظهارَ الحَلقِيَّ وأُبَيِّنُ مَعناه." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "An open Qur'an showing clear letters.", ar: "مُصحَفٌ مَفتوحٌ تَظهَرُ حُروفُهُ واضِحة." },
        caption: { en: "Izhar = making the noon clear and distinct, with no merging and no ghunnah.", ar: "الإظهار = إظهارُ النّونِ واضِحةً مُتَمَيِّزة، بِلا إدغامٍ ولا غُنّة." },
      },
      infoBoxes: [
        {
          label: { en: "Definition", ar: "تَعريف" },
          lines: [
            { en: "Izhar (إظهار) literally means 'to make clear/manifest'. In tajweed: pronouncing the noon sakinah or tanwin clearly and distinctly from its makhraj, WITHOUT any ghunnah (nasal hum) being prolonged and without merging it into the next letter.", ar: "الإظهارُ لُغةً: البَيانُ والإيضاح. واصطِلاحًا: نُطقُ النّونِ السّاكِنةِ أو التَّنوينِ واضِحةً مُتَمَيِّزةً مِن مَخرَجِها، دونَ غُنّةٍ مُطَوَّلةٍ ودونَ إدغامٍ في الحَرفِ التّالي." },
          ],
        },
        {
          label: { en: "Why 'Halqi'?", ar: "لِماذا «الحَلقِيّ»؟" },
          lines: [
            { en: "It is called Izhar Halqi ('throat Izhar') because all six letters that cause it come from the throat (al-halq).", ar: "سُمِّيَ الإظهارَ الحَلقِيَّ لِأنَّ حُروفَهُ السِّتّةَ كُلَّها تَخرُجُ مِنَ الحَلق." },
          ],
        },
      ],
      callout: {
        label: { en: "Listen closely", ar: "أنصِتْ جَيِّدًا" },
        title: { en: "What is ghunnah, and why is it absent here?", ar: "ما الغُنّة، ولِماذا تَغيبُ هُنا؟" },
        body: {
          en: "Ghunnah is the nasal sound that hums through the nose. In other rules (idgham, ikhfa, iqlab) the noon keeps a ghunnah. But in Izhar the noon is pronounced cleanly with no prolonged nasal hum. Explain why pairing the noon with a throat letter naturally produces this clear, ghunnah-free sound.",
          ar: "الغُنّةُ صَوتٌ أنفِيٌّ يَخرُجُ مِنَ الأنف. في الأحكامِ الأُخرى (الإدغام، الإخفاء، الإقلاب) تَبقى لِلنّونِ غُنّة. أمَّا في الإظهارِ فَتُنطَقُ النّونُ نَقِيّةً بِلا غُنّةٍ مُطَوَّلة. بَيِّنْ لِماذا يُنتِجُ اقتِرانُ النّونِ بِحَرفٍ حَلقِيٍّ هذا الصَّوتَ الواضِحَ الخالِيَ مِنَ الغُنّة.",
        },
      },
      body: {
        en: "Of the four rules, Izhar is the most straightforward, and its name tells you exactly what to do: izhar means 'to make clear' or 'to make manifest'. In tajweed, Izhar means that when a noon sakinah or tanwin is followed by one of certain letters, you pronounce the noon sound clearly and distinctly — straight from its articulation point — without merging it into the next letter and without dragging out a nasal hum (ghunnah). The noon simply comes out clean and pure, exactly as the letter sounds on its own.\n\nTo understand what makes Izhar special, you need to know about ghunnah. Ghunnah is the gentle nasal sound that hums through the nose, and it accompanies the noon in three of the four rules — when the noon merges (idgham), is concealed (ikhfa), or is converted (iqlab). Izhar is the exception: here there is no prolonged ghunnah at all. The noon is articulated cleanly and the reciter moves immediately to the next letter. This is why getting Izhar right often means resisting the habit of humming the noon — you must let it ring out clear.\n\nThe full name of this rule is Izhar Halqi — 'throat Izhar' — and the reason is beautifully logical, which we will see in the next section. A demanding student should already sense the underlying wisdom of the tajweed system: the rules are not arbitrary. The way a letter is pronounced depends on a real, physical relationship between the place the noon comes from and the place the following letter comes from. Izhar happens precisely when those two places are far enough apart that the noon can be pronounced cleanly, with no need to blend the two sounds. Understanding the *reason* behind the rule, not just memorising it, is what separates surface learning from mastery.",
        ar: "مِنَ الأحكامِ الأربَعةِ الإظهارُ أيسَرُها، واسمُهُ يُخبِرُكَ تَمامًا بِما تَفعَل: الإظهارُ مَعناهُ البَيانُ والإيضاح. وفي التَّجويدِ يَعني الإظهارُ أنَّكَ إذا جاءَتِ النّونُ السّاكِنةُ أو التَّنوينُ مَتبوعةً بِحَرفٍ مِن حُروفٍ مُعَيَّنة، نَطَقتَ صَوتَ النّونِ واضِحًا مُتَمَيِّزًا — مِن مَخرَجِهِ مُباشَرةً — دونَ إدغامٍ في الحَرفِ التّالي ودونَ إطالةِ غُنّة. فَتَخرُجُ النّونُ نَقِيّةً صافِيةً، كَما يُسمَعُ الحَرفُ وَحدَه.\n\nولِفَهمِ ما يُمَيِّزُ الإظهارَ تَحتاجُ مَعرِفةَ الغُنّة. الغُنّةُ صَوتٌ أنفِيٌّ لَطيفٌ يَخرُجُ مِنَ الأنف، ويُصاحِبُ النّونَ في ثَلاثةٍ مِنَ الأحكامِ الأربَعة — حينَ تُدغَمُ النّونُ أو تُخفى أو تُقلَب. والإظهارُ هو الاستِثناء: فَلا غُنّةَ مُطَوَّلةً فيهِ البَتّة. فَتُنطَقُ النّونُ نَقِيّةً ويَنتَقِلُ القارِئُ فَورًا إلى الحَرفِ التّالي. ولِهذا فإنَّ إتقانَ الإظهارِ كَثيرًا ما يَعني مُقاوَمةَ عادةِ غَنِّ النّون — إذ يَجِبُ أن تَدَعَها تَخرُجُ صافِية.\n\nواسمُهُ الكامِلُ الإظهارُ الحَلقِيّ — والسَّبَبُ بَديعٌ مَنطِقِيّ، نَراهُ في القِسمِ التّالي. وعلى الطّالِبِ المُطالِبِ أن يَستَشعِرَ أصلًا حِكمةَ نِظامِ التَّجويد: فالقَواعِدُ لَيسَت اعتِباطيّة. فَكَيفِيّةُ نُطقِ الحَرفِ تَتَوَقَّفُ على عَلاقةٍ فِعليّةٍ ماديّةٍ بَينَ مَوضِعِ خُروجِ النّونِ ومَوضِعِ خُروجِ الحَرفِ التّالي. ويَحدُثُ الإظهارُ تَحديدًا حينَ يَكونُ المَوضِعانِ مُتَباعِدَينِ بِما يَكفي لِتُنطَقَ النّونُ نَقِيّةً دونَ حاجةٍ لِمَزجِ الصَّوتَين. وفَهمُ *السَّبَبِ* خَلفَ القاعِدةِ، لا حِفظُها فَحَسب، هو ما يُفَرِّقُ التَّعَلُّمَ السَّطحِيَّ مِنَ الإتقان.",
      },
    },
    {
      title: { en: "The six throat letters", ar: "حُروفُ الحَلقِ السِّتّة" },
      learningObjectives: [
        { en: "Memorise the six letters of Izhar and their throat origin.", ar: "أحفَظُ حُروفَ الإظهارِ السِّتّةَ ومَخرَجَها الحَلقِيّ." },
      ],
      image: {
        src: IMG.lantern,
        alt: { en: "A lantern symbolising clarity and light.", ar: "مِصباحٌ يَرمُزُ لِلوُضوحِ والنّور." },
        caption: { en: "ء هـ ع ح غ خ — the six throat letters that cause clear pronunciation.", ar: "ء هـ ع ح غ خ — حُروفُ الحَلقِ السِّتّةُ التي تُوجِبُ الإظهار." },
      },
      infoBoxes: [
        {
          label: { en: "The six letters", ar: "الحُروفُ السِّتّة" },
          lines: [
            { en: "ء (hamzah), هـ (ha), ع ('ayn), ح (ha), غ (ghayn), خ (kha). Collected in the mnemonic: أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر — the first letter of each word gives the six.", ar: "ء (الهَمزة)، هـ (الهاء)، ع (العَين)، ح (الحاء)، غ (الغَين)، خ (الخاء). جُمِعَت في أوائِلِ كَلِماتِ: أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر." },
          ],
        },
        {
          label: { en: "The logic", ar: "العِلّة" },
          lines: [
            { en: "The noon comes from the tip of the tongue (front of the mouth); these six letters come from the throat (the back). Because the two makharij are FAR apart, the noon is pronounced clearly — there is no closeness to cause merging.", ar: "النّونُ تَخرُجُ مِن طَرَفِ اللِّسانِ (مُقَدِّمةِ الفَم)؛ وهذه السِّتّةُ تَخرُجُ مِنَ الحَلقِ (المُؤَخِّرة). ولِبُعدِ المَخرَجَينِ تُنطَقُ النّونُ واضِحةً — فَلا قُربَ يوجِبُ الإدغام." },
          ],
        },
      ],
      callout: {
        label: { en: "Grasp the principle", ar: "أدرِكِ المَبدَأ" },
        title: { en: "Distance creates clarity", ar: "البُعدُ يُنتِجُ الوُضوح" },
        body: {
          en: "The whole reason Izhar happens with these six letters is distance: the noon (tongue-tip) and the throat letters are far apart, so the tongue does not need to blend them. Argue how this single principle — that closeness causes merging and distance causes clarity — explains why Izhar is the rule precisely for the throat letters and no others.",
          ar: "كُلُّ سَبَبِ وُقوعِ الإظهارِ مَعَ هذه السِّتّةِ هو البُعد: فالنّونُ (طَرَفُ اللِّسان) وحُروفُ الحَلقِ مُتَباعِدةٌ، فَلا يَحتاجُ اللِّسانُ لِمَزجِها. حاجِجْ كَيفَ يُفَسِّرُ هذا المَبدَأُ الواحِدُ — أنَّ القُربَ يوجِبُ الإدغامَ والبُعدَ يوجِبُ الإظهار — لِماذا كانَ الإظهارُ حُكمَ حُروفِ الحَلقِ دونَ غَيرِها.",
        },
      },
      matchingActivity: {
        title: { en: "Match the example to its Izhar letter", ar: "طابِقِ المِثالَ بِحَرفِ إظهارِه" },
        instruction: { en: "Each Qur'anic example contains a noon sakinah or tanwin followed by a throat letter. Match it to the letter causing Izhar.", ar: "كُلُّ مِثالٍ قُرآنِيٍّ فيهِ نونٌ ساكِنةٌ أو تَنوينٌ يَتلوهُ حَرفٌ حَلقِيّ. طابِقهُ بِالحَرفِ المُوجِبِ لِلإظهار." },
        prompts: [
          { en: "مِنْ هادٍ (min hadin)", ar: "مِنْ هادٍ" },
          { en: "مَنْ آمَنَ (man amana)", ar: "مَنْ آمَنَ" },
          { en: "يَنْعِقُ (yan'iqu)", ar: "يَنْعِقُ" },
          { en: "عَذابٌ غَليظٌ ('adhabun ghalith)", ar: "عَذابٌ غَليظٌ" },
        ].map((p, i) => ({
          prompt: p,
          answer: [
            { en: "هـ (ha) — throat letter", ar: "هـ (الهاء) — حَرفٌ حَلقِيّ" },
            { en: "ء (hamzah) — throat letter", ar: "ء (الهَمزة) — حَرفٌ حَلقِيّ" },
            { en: "ع ('ayn) — throat letter", ar: "ع (العَين) — حَرفٌ حَلقِيّ" },
            { en: "غ (ghayn) — throat letter", ar: "غ (الغَين) — حَرفٌ حَلقِيّ" },
          ][i],
        })),
      },
      body: {
        en: "Here is the heart of the rule: Izhar occurs when the noon sakinah or tanwin is followed by one of six specific letters — and only these six. They are: the hamzah (ء), the ha (هـ), the 'ayn (ع), the ha (ح), the ghayn (غ), and the kha (خ). Scholars of tajweed gathered them in a memorable phrase whose words each begin with one of the letters: 'أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر' ('My brother, here is knowledge gained by one who is not a loser'). Take the first letter of each word and you have the six letters of Izhar. Memorising this sentence is the easiest way to never forget them.\n\nBut why these six and no others? This is where the beauty of tajweed appears. All six of these letters share one feature: they are all pronounced from the throat (al-halq). The noon, by contrast, is pronounced from the very tip of the tongue, at the front of the mouth. Because the place where the noon is made and the place where these throat letters are made are so far apart, the tongue cannot easily blend them together. The natural result is that the noon comes out clear and distinct — which is exactly what Izhar means. The rule is not an arbitrary command to memorise; it is a description of what naturally happens when two distant sounds meet.\n\nThis reveals the deep principle that governs the entire chapter on noon sakinah: closeness causes merging, and distance causes clarity. When the noon meets a letter very close to it, the sounds merge (idgham). When it meets a letter from the throat — far away — the sound stays clear (izhar). When it meets letters in between, we get the partial blends of ikhfa and iqlab. A demanding student who grasps this one principle does not merely memorise four rules; they understand the logic that makes the whole system coherent. The next time you recite words like 'مِنْ هادٍ' or 'مَنْ آمَنَ' or 'يَنْعِقُ', pronounce the noon cleanly and clearly, and know that you are giving the letter its right — and giving the Qur'an its right to be recited as Allah revealed it.",
        ar: "هذا لُبُّ القاعِدة: يَقَعُ الإظهارُ حينَ يَتلو النّونَ السّاكِنةَ أو التَّنوينَ حَرفٌ مِن سِتّةِ حُروفٍ مُحَدَّدة — وهذه السِّتّةُ فَقَط. وهي: الهَمزة (ء)، والهاء (هـ)، والعَين (ع)، والحاء (ح)، والغَين (غ)، والخاء (خ). وقد جَمَعَها عُلَماءُ التَّجويدِ في عِبارةٍ سَهلةٍ تَبدَأُ كَلِماتُها بِهذه الحُروف: «أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر». خُذْ أوَّلَ حَرفٍ مِن كُلِّ كَلِمةٍ تَجِدِ السِّتّة. وحِفظُ هذه الجُملةِ أسهَلُ طَريقةٍ لِئَلّا تَنساها.\n\nلكِنْ لِمَ هذه السِّتّةُ دونَ غَيرِها؟ هُنا يَظهَرُ جَمالُ التَّجويد. فهذه السِّتّةُ تَشتَرِكُ في صِفةٍ واحِدة: كُلُّها تَخرُجُ مِنَ الحَلق. أمَّا النّونُ فَتَخرُجُ مِن طَرَفِ اللِّسانِ، في مُقَدِّمةِ الفَم. ولِأنَّ مَوضِعَ خُروجِ النّونِ ومَوضِعَ خُروجِ هذه الحُروفِ الحَلقِيّةِ مُتَباعِدانِ جِدًّا، لا يَستَطيعُ اللِّسانُ مَزجَهُما بِسُهولة. والنَّتيجةُ الطَّبيعيّةُ أن تَخرُجَ النّونُ واضِحةً مُتَمَيِّزة — وهو عَينُ مَعنى الإظهار. فالقاعِدةُ لَيسَت أمرًا اعتِباطيًّا لِلحِفظِ؛ بل وَصفٌ لِما يَحدُثُ طَبعًا حينَ يَلتَقي صَوتانِ مُتَباعِدان.\n\nويَكشِفُ هذا المَبدَأَ العَميقَ الذي يَحكُمُ بابَ النّونِ السّاكِنةِ كُلَّه: القُربُ يوجِبُ الإدغام، والبُعدُ يوجِبُ الإظهار. فحينَ تَلتَقي النّونُ بِحَرفٍ قَريبٍ جِدًّا تَندَمِجُ الأصواتُ (إدغام). وحينَ تَلتَقي بِحَرفٍ مِنَ الحَلقِ — بَعيدٍ — يَبقى الصَّوتُ واضِحًا (إظهار). وحينَ تَلتَقي بِحُروفٍ وَسَطٍ نَحصُلُ على المَزجِ الجُزئِيِّ في الإخفاءِ والإقلاب. والطّالِبُ المُطالِبُ الذي يُدرِكُ هذا المَبدَأَ الواحِدَ لا يَحفَظُ أربَعَ قَواعِدَ فَحَسب؛ بل يَفهَمُ المَنطِقَ الذي يَجعَلُ النِّظامَ كُلَّهُ مُتَّسِقًا. وفي المَرّةِ القادِمةِ حينَ تَتلو «مِنْ هادٍ» أو «مَنْ آمَنَ» أو «يَنْعِقُ»، انطِقِ النّونَ نَقِيّةً واضِحة، واعلَمْ أنَّكَ تُعطي الحَرفَ حَقَّه — وتُعطي القُرآنَ حَقَّهُ أن يُتلى كَما أنزَلَهُ الله.",
      },
    },
    {
      title: { en: "Practice and mastery", ar: "التَّطبيقُ والإتقان" },
      learningObjectives: [
        { en: "Apply Izhar correctly when reciting Qur'anic examples.", ar: "أُطَبِّقُ الإظهارَ صَحيحًا عِندَ تِلاوةِ الأمثِلةِ القُرآنيّة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A student practising recitation aloud.", ar: "طالِبٌ يَتَدَرَّبُ على التِّلاوةِ جَهرًا." },
        caption: { en: "Tajweed is learned by the ear and the tongue — recite aloud and listen.", ar: "التَّجويدُ يُتَعَلَّمُ بِالأُذُنِ واللِّسان — اتلُ جَهرًا وأنصِت." },
      },
      groupTasks: {
        title: { en: "Recitation workshop", ar: "وَرشةُ تِلاوة" },
        instruction: { en: "In groups, find and recite Izhar examples, then teach them.", ar: "في مَجموعاتٍ، ابحَثوا عن أمثِلةِ الإظهارِ واتلوها ثُمَّ عَلِّموها." },
        groups: [
          {
            slug: "find-izhar",
            name: { en: "Team A — Hunt for Izhar", ar: "الفَريقُ أ — اصطِيادُ الإظهار" },
            learningObjective: { en: "Identify noon sakinah/tanwin + throat letter in real verses.", ar: "نُمَيِّزُ النّونَ السّاكِنةَ/التَّنوينَ مَعَ حَرفٍ حَلقِيٍّ في آياتٍ حَقيقيّة." },
            task: { en: "From Surat Al-Ikhlas and An-Nas, find every example of Izhar and explain which throat letter causes each.", ar: "مِن سورتَي الإخلاصِ والنّاس، جِدوا كُلَّ مِثالِ إظهارٍ وبَيِّنوا الحَرفَ الحَلقِيَّ المُوجِبَ لِكُلٍّ." },
            evidence: [
              { en: "The six letters: ء هـ ع ح غ خ.", ar: "الحُروفُ السِّتّة: ء هـ ع ح غ خ." },
            ],
            sourceNotes: [
              { en: "Recite aloud to hear the clear noon with no ghunnah.", ar: "اتلوا جَهرًا لِتَسمَعوا النّونَ الواضِحةَ بِلا غُنّة." },
            ],
            memberRoles: [
              { en: "Reciter, Checker, Recorder.", ar: "القارِئ، المُدَقِّق، المُسَجِّل." },
            ],
            finalProduct: { en: "A list of Izhar examples with their letters.", ar: "قائِمةُ أمثِلةِ إظهارٍ مَعَ حُروفِها." },
          },
          {
            slug: "teach-izhar",
            name: { en: "Team B — Teach the rule", ar: "الفَريقُ ب — عَلِّمِ القاعِدة" },
            learningObjective: { en: "Explain Izhar clearly to a beginner.", ar: "نَشرَحُ الإظهارَ بِوُضوحٍ لِمُبتَدِئ." },
            task: { en: "Prepare a 2-minute mini-lesson teaching Izhar: its meaning, the six letters (with the mnemonic), and why distance from the throat causes clarity.", ar: "أعِدّوا دَرسًا مُصَغَّرًا (دَقيقَتَين) يُعَلِّمُ الإظهار: مَعناه، والحُروفَ السِّتّ (بِالعِبارة)، ولِماذا يوجِبُ البُعدُ عنِ الحَلقِ الوُضوح." },
            evidence: [
              { en: "The mnemonic أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر.", ar: "العِبارة: أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر." },
            ],
            sourceNotes: [
              { en: "Use one clear Qur'anic example for each letter.", ar: "استَعمِلوا مِثالًا قُرآنيًّا واضِحًا لِكُلِّ حَرف." },
            ],
            memberRoles: [
              { en: "Presenter, Examples-finder, Mnemonic-coach.", ar: "العارِض، باحِثُ الأمثِلة، مُدَرِّبُ العِبارة." },
            ],
            finalProduct: { en: "A 2-minute taught mini-lesson on Izhar.", ar: "دَرسٌ مُصَغَّرٌ (دَقيقَتَين) عنِ الإظهار." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Explain in your own words", ar: "اشرَحْ بِأسلوبِك" },
        prompt: { en: "Define Izhar, list its six letters, and explain — using the principle of distance between makharij — exactly why these throat letters cause the noon to be pronounced clearly. Give two Qur'anic examples.", ar: "عَرِّفِ الإظهار، واذكُرْ حُروفَهُ السِّتّة، واشرَحْ — بِمَبدَأِ بُعدِ المَخارِج — لِماذا تُوجِبُ حُروفُ الحَلقِ هذه نُطقَ النّونِ واضِحة. واضرِبْ مِثالَين قُرآنيَّين." },
        placeholder: { en: "Izhar means... The six letters are... They cause clarity because... For example...", ar: "الإظهارُ مَعناه... والحُروفُ السِّتّةُ هي... وتوجِبُ الوُضوحَ لِأنَّ... مِثالًا..." },
      },
      body: {
        en: "Tajweed is ultimately a practical science: it is learned not only by the eye reading rules, but by the ear hearing and the tongue practising. So the final step is to apply Izhar to real recitation. Look for any noon sakinah (نْ) or tanwin (ـً ـٍ ـٌ) followed by one of the six throat letters, and pronounce the noon clearly, moving straight to the next letter with no prolonged nasal hum. Consider these clear examples from the Qur'an: 'مِنْ هادٍ' (min hadin — noon then ha هـ), 'مَنْ آمَنَ' (man amana — noon then hamzah ء), 'يَنْعِقُ' (yan'iqu — noon then 'ayn ع), 'وَمِنْ خَيرٍ' (wa min khayrin — noon then kha خ), 'مِنْ غِلٍّ' (min ghillin — noon then ghayn غ), and 'يَنْحِتونَ' (yanhitoon — noon then ha ح). And with tanwin: 'عَذابٌ غَليظٌ', 'حَكيمٌ عَليمٌ', 'كُلٌّ آمَنَ'.\n\nWhen you recite these, the test is simple: the noon should sound exactly like a clear, complete noon, with no humming drawn out and no blending into the next letter. If you find yourself wanting to merge the noon or hum it, that is the habit of the other rules creeping in — resist it, and let the noon ring clear.\n\nMastering even this one rule has a value far beyond the technical. Every time you give a letter its right, you are obeying the command 'and recite the Qur'an with measured recitation' and honouring the speech of Allah with care and love. The Prophet ﷺ said, 'The one who is proficient in the Qur'an will be with the noble, righteous scribes (the angels), and the one who recites the Qur'an and struggles with it, finding it difficult, will have a double reward' (al-Bukhari & Muslim). A demanding student takes from this lesson both a precise skill and a deeper attitude: that the Qur'an deserves to be recited beautifully and correctly, and that learning tajweed — letter by letter, rule by rule — is itself an act of worship and a way of drawing closer to the words of our Lord.",
        ar: "التَّجويدُ في النِّهايةِ عِلمٌ عَمَلِيّ: يُتَعَلَّمُ لا بِالعَينِ تَقرَأُ القَواعِدَ فَحَسب، بل بِالأُذُنِ تَسمَعُ واللِّسانِ يَتَدَرَّب. فالخُطوةُ الأخيرةُ تَطبيقُ الإظهارِ على تِلاوةٍ حَقيقيّة. ابحَثْ عن أيِّ نونٍ ساكِنةٍ (نْ) أو تَنوينٍ (ـً ـٍ ـٌ) يَتلوهُ حَرفٌ مِنَ السِّتّةِ الحَلقِيّة، وانطِقِ النّونَ واضِحةً، مُنتَقِلًا فَورًا إلى الحَرفِ التّالي بِلا غُنّةٍ مُطَوَّلة. تَأمَّلْ هذه الأمثِلةَ الواضِحةَ مِنَ القُرآن: «مِنْ هادٍ» (نونٌ ثُمَّ هاء)، «مَنْ آمَنَ» (نونٌ ثُمَّ هَمزة)، «يَنْعِقُ» (نونٌ ثُمَّ عَين)، «وَمِنْ خَيرٍ» (نونٌ ثُمَّ خاء)، «مِنْ غِلٍّ» (نونٌ ثُمَّ غَين)، «يَنْحِتونَ» (نونٌ ثُمَّ حاء). ومَعَ التَّنوين: «عَذابٌ غَليظٌ»، «حَكيمٌ عَليمٌ»، «كُلٌّ آمَنَ».\n\nوحينَ تَتلوها فالاختِبارُ بَسيط: يَنبَغي أن تُسمَعَ النّونُ نونًا واضِحةً تامّة، بِلا غُنّةٍ مَمدودةٍ ولا اندِماجٍ في الحَرفِ التّالي. فإن وَجَدتَ نَفسَكَ تُريدُ إدغامَ النّونِ أو غَنَّها، فَتِلكَ عادةُ الأحكامِ الأُخرى تَتَسَلَّل — قاوِمها، ودَعِ النّونَ تَخرُجُ صافِية.\n\nوإتقانُ هذه القاعِدةِ الواحِدةِ قيمَتُهُ أبعَدُ مِنَ الجانِبِ الفَنِّيِّ بِكَثير. فَكُلَّما أعطَيتَ حَرفًا حَقَّهُ كُنتَ مُطيعًا أمرَ ﴿ورَتِّلِ القُرآنَ تَرتيلًا﴾، مُعَظِّمًا كَلامَ اللهِ بِعِنايةٍ وحُبّ. قالَ النَّبِيُّ ﷺ: «الماهِرُ بِالقُرآنِ مَعَ السَّفَرةِ الكِرامِ البَرَرة، والذي يَقرَأُ القُرآنَ ويَتَتَعتَعُ فيهِ وهو عليهِ شاقٌّ لَهُ أجران» (البخاري ومسلم). والطّالِبُ المُطالِبُ يَأخُذُ مِن هذا الدَّرسِ مَهارةً دَقيقةً ومَوقِفًا أعمَق: أنَّ القُرآنَ يَستَحِقُّ أن يُتلى جَميلًا صَحيحًا، وأنَّ تَعَلُّمَ التَّجويدِ — حَرفًا حَرفًا وحُكمًا حُكمًا — عِبادةٌ بِنَفسِهِ وطَريقٌ لِلتَّقَرُّبِ إلى كَلامِ رَبِّنا.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What does 'Izhar' mean and require?", ar: "ما مَعنى «الإظهار» وما الذي يَقتَضيه؟" },
      options: [
        { en: "To make clear — pronounce the noon distinctly with no merging and no prolonged ghunnah", ar: "البَيان — نُطقُ النّونِ واضِحةً بِلا إدغامٍ ولا غُنّةٍ مُطَوَّلة" },
        { en: "To merge the noon fully into the next letter", ar: "إدغامُ النّونِ كُلِّيًّا في الحَرفِ التّالي" },
        { en: "To convert the noon into a meem", ar: "قَلبُ النّونِ ميمًا" },
        { en: "To skip the noon entirely", ar: "حَذفُ النّونِ تَمامًا" },
      ],
      correctIndex: 0,
      explanation: { en: "Izhar = clear, distinct pronunciation of the noon from its makhraj, with no ghunnah dragged out.", ar: "الإظهارُ = نُطقُ النّونِ واضِحةً مُتَمَيِّزةً مِن مَخرَجِها بِلا إطالةِ غُنّة." },
    },
    {
      prompt: { en: "How many letters cause Izhar, and where do they come from?", ar: "كَم حَرفًا يوجِبُ الإظهار، ومِن أينَ تَخرُج؟" },
      options: [
        { en: "Six letters, all from the throat (al-halq)", ar: "سِتّةُ حُروف، كُلُّها مِنَ الحَلق" },
        { en: "Four letters from the lips", ar: "أربَعةٌ مِنَ الشَّفَتَين" },
        { en: "One letter, the meem", ar: "حَرفٌ واحِد، الميم" },
        { en: "Fifteen letters from the tongue", ar: "خَمسةَ عَشَرَ حَرفًا مِنَ اللِّسان" },
      ],
      correctIndex: 0,
      explanation: { en: "The six throat letters are ء هـ ع ح غ خ — hence 'Izhar Halqi' (throat Izhar).", ar: "الحُروفُ الحَلقيّةُ السِّتّةُ هي ء هـ ع ح غ خ — ولِذا سُمِّيَ الإظهارَ الحَلقِيّ." },
    },
    {
      prompt: { en: "Which are the six letters of Izhar?", ar: "ما حُروفُ الإظهارِ السِّتّة؟" },
      options: [
        { en: "ء هـ ع ح غ خ", ar: "ء هـ ع ح غ خ" },
        { en: "ب م و", ar: "ب م و" },
        { en: "ي ر م ل و ن", ar: "ي ر م ل و ن" },
        { en: "ق ك ج ش", ar: "ق ك ج ش" },
      ],
      correctIndex: 0,
      explanation: { en: "Remembered by 'أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر' — the first letter of each word.", ar: "تُحفَظُ بِـ«أَخي هاكَ عِلْمًا حازَهُ غَيرُ خاسِر» — أوَّلُ حَرفٍ مِن كُلِّ كَلِمة." },
    },
    {
      prompt: { en: "Why do the throat letters cause clear pronunciation (Izhar)?", ar: "لِماذا تُوجِبُ حُروفُ الحَلقِ الإظهار؟" },
      options: [
        { en: "Because they are far from the noon's makhraj (tongue-tip), so the sounds do not merge", ar: "لِبُعدِها عن مَخرَجِ النّونِ (طَرَفِ اللِّسان)، فَلا تَندَمِجُ الأصوات" },
        { en: "Because they are the same as the noon", ar: "لِأنَّها تُماثِلُ النّون" },
        { en: "Because they have no sound", ar: "لِأنَّها بِلا صَوت" },
        { en: "Because they are always at the end of words", ar: "لِأنَّها دائِمًا في آخِرِ الكَلِمات" },
      ],
      correctIndex: 0,
      explanation: { en: "Principle: distance between makharij causes clarity; closeness causes merging.", ar: "المَبدَأ: بُعدُ المَخارِجِ يوجِبُ الوُضوح، والقُربُ يوجِبُ الإدغام." },
    },
    {
      prompt: { en: "In 'مَنْ آمَنَ', why is there Izhar?", ar: "في «مَنْ آمَنَ» لِماذا وَقَعَ الإظهار؟" },
      options: [
        { en: "The noon sakinah is followed by the hamzah (ء), a throat letter", ar: "النّونُ السّاكِنةُ يَتلوها الهَمزة (ء) وهي حَرفٌ حَلقِيّ" },
        { en: "The noon is followed by a meem", ar: "النّونُ يَتلوها ميم" },
        { en: "There is no noon in the word", ar: "لا نونَ في الكَلِمة" },
        { en: "The noon has a vowel", ar: "النّونُ مُتَحَرِّكة" },
      ],
      correctIndex: 0,
      explanation: { en: "Noon sakinah + hamzah (a throat letter) = Izhar; the noon is said clearly.", ar: "نونٌ ساكِنةٌ + هَمزة (حَرفٌ حَلقِيّ) = إظهار؛ تُنطَقُ النّونُ واضِحة." },
    },
    {
      prompt: { en: "True or False: In Izhar the noon is pronounced with a long, prominent ghunnah (nasal hum).", ar: "صَوابٌ أم خَطأ: في الإظهارِ تُنطَقُ النّونُ بِغُنّةٍ طَويلةٍ ظاهِرة." },
      options: [
        { en: "False — Izhar has no prolonged ghunnah; the noon is pronounced clean and clear", ar: "خَطأ — لا غُنّةَ مُطَوَّلةَ في الإظهار؛ تُنطَقُ النّونُ نَقِيّةً واضِحة" },
        { en: "True", ar: "صَواب" },
      ],
      correctIndex: 0,
      explanation: { en: "Ghunnah accompanies idgham, ikhfa and iqlab — but Izhar is the clear, ghunnah-free rule.", ar: "الغُنّةُ تُصاحِبُ الإدغامَ والإخفاءَ والإقلاب — أمَّا الإظهارُ فَواضِحٌ بِلا غُنّة." },
    },
  ],
};
