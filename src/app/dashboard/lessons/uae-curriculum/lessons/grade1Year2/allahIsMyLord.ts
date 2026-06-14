import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const allahIsMyLord: CourseLesson = {
  slug: "g1y2-allah-is-my-lord",
  name: { en: "Allah Is My Lord", ar: "اللهُ رَبّي" },
  shortIntro: {
    en: "A gentle Grade 1 lesson: Allah is my Lord who created me, loves me, and takes care of everything around me.",
    ar: "درس بسيط للصف الأول: اللهُ رَبّي الذي خَلَقَني ويُحِبُّني ويَرعى كُلَّ شيءٍ حَوْلي.",
  },
  quranSurahs: ["Al-Fatihah 2", "Al-An'am 102"],
  sections: [
    {
      title: { en: "Allah is my Lord", ar: "اللهُ رَبّي" },
      learningObjective: {
        en: "I can say that Allah is my Lord who created me and everything.",
        ar: "أَستَطيعُ أن أقولَ إنَّ اللهَ رَبّي الذي خَلَقَني وخَلَقَ كُلَّ شيءٍ.",
      },
      image: {
        src: IMG.skyBlue,
        alt: { en: "A bright blue sky with soft white clouds.", ar: "سَماءٌ زَرقاءُ صافِيةٌ فيها غُيومٌ بَيضاء." },
        caption: { en: "Allah created the sky, the sun, and you.", ar: "اللهُ خَلَقَ السَّماءَ والشَّمسَ وخَلَقَكَ أنتَ." },
      },
      body: {
        en: "Allah is my Lord. The word Lord (Rabb) means the One who created us, gives us everything we need, and takes care of us. Allah made the sky, the sun, the trees, the animals, and me. Allah gives me food, water, and a loving family. I have only one Lord, and He is Allah.",
        ar: "اللهُ رَبّي. وكَلِمةُ (الرَّبّ) تَعني الذي خَلَقَنا، ويُعطينا كُلَّ ما نَحتاجُ، ويَرعانا. اللهُ خَلَقَ السَّماءَ والشَّمسَ والأشجارَ والحَيَواناتِ وخَلَقَني. اللهُ يُعطيني الطَّعامَ والماءَ وأُسرةً تُحِبُّني. لي رَبٌّ واحِدٌ هو اللهُ.",
      },
    },
    {
      title: { en: "A verse from the Qur'an", ar: "آيةٌ مِنَ القُرآن" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading the Qur'an on a wooden stand.", ar: "طِفلٌ يَقرأُ القُرآنَ على حامِلٍ خَشَبِيّ." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"All praise is for Allah, the Lord of all the worlds.\" — Al-Fatihah 2", ar: "﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾ — الفاتحة ٢" },
            { en: "It means: Allah is the Lord and Carer of everything and everyone.", ar: "مَعناها: اللهُ رَبُّ كُلِّ شيءٍ ومَن يَرعى كُلَّ أحَد." },
          ],
        },
      ],
      body: {
        en: "In Surat Al-Fatihah we say that Allah is 'Rabb al-'alamin' — the Lord of all the worlds. He is the Lord of people, animals, plants, the land, and the sky. When I say 'Alhamdulillah' (all praise is for Allah), I am thanking my Lord for His many gifts.",
        ar: "في سورةِ الفاتحةِ نَقولُ إنَّ اللهَ ﴿رَبِّ العالَمين﴾ أي رَبُّ كُلِّ العَوالِم. هو رَبُّ النّاسِ والحَيَواناتِ والنَّباتاتِ والأرضِ والسَّماءِ. وعِندَما أقولُ (الحَمدُ لِلهِ) فأنا أشكُرُ رَبّي على نِعَمِهِ الكَثيرة.",
      },
    },
    {
      title: { en: "Our Prophet's teaching", ar: "تَعليمُ نَبِيِّنا" },
      image: {
        src: IMG.lantern,
        alt: { en: "A warm glowing lantern.", ar: "فانوسٌ مُضيءٌ دافِئ." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"Be mindful of Allah, and Allah will protect you.\" (Tirmidhi)", ar: "قال النَّبِيُّ ﷺ: «احْفَظِ اللَّهَ يَحْفَظْكَ». (رواه الترمذي)" },
            { en: "It means: remember and obey Allah, and He will take care of you.", ar: "مَعناها: تَذَكَّرِ اللهَ وأطِعْهُ، يَحفَظْكَ ويَرعَكَ." },
          ],
        },
      ],
      body: {
        en: "Our Prophet Muhammad ﷺ taught us to remember Allah every day. When I obey Allah — like saying 'Bismillah' before I eat and being kind — Allah loves me and protects me. Knowing Allah is my Lord makes my heart calm and happy.",
        ar: "عَلَّمَنا نَبِيُّنا مُحمَّدٌ ﷺ أن نَتَذَكَّرَ اللهَ كُلَّ يَوم. وعِندَما أُطيعُ اللهَ — كأن أقولَ (بسمِ الله) قَبلَ الأكلِ وأكونَ لَطيفًا — يُحِبُّني اللهُ ويَحفَظُني. ومَعرِفَتي أنَّ اللهَ رَبّي تَجعَلُ قَلبي مُطمَئِنًّا سَعيدًا.",
      },
    },
    {
      title: { en: "Story: Prophet Ibrahim looks at the sky", ar: "قِصّة: إبراهيمُ يَنظُرُ إلى السَّماء" },
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A huge mountain under the sky, showing Allah's great creation.", ar: "جَبَلٌ كَبيرٌ تَحتَ السَّماءِ يُظهِرُ عَظَمةَ خَلقِ الله." },
        caption: { en: "Only Allah can make mountains, stars, and the sun.", ar: "اللهُ وَحدَهُ يَستَطيعُ أن يَصنَعَ الجِبالَ والنُّجومَ والشَّمس." },
      },
      body: {
        en: "Prophet Ibrahim (peace be upon him) looked at a bright star, then the moon, then the big sun. Each one rose and then disappeared. Ibrahim said: my Lord cannot be something that disappears. My Lord is Allah, who made the stars, the moon, and the sun, and who never disappears. So Ibrahim worshipped only Allah. (From Surat Al-An'am)",
        ar: "نَظَرَ النَّبِيُّ إبراهيمُ عليه السَّلامُ إلى نَجمٍ لامِع، ثُمَّ إلى القَمَر، ثُمَّ إلى الشَّمسِ الكَبيرة. وكُلُّ واحِدٍ يَطلُعُ ثُمَّ يَغيب. فقالَ إبراهيمُ: لا يُمكِنُ أن يَكونَ رَبّي شيئًا يَغيب. رَبّي هو اللهُ الذي خَلَقَ النُّجومَ والقَمَرَ والشَّمسَ ولا يَغيبُ أبَدًا. فعَبَدَ إبراهيمُ اللهَ وَحدَهُ. (مِن سورةِ الأنعام)",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A green valley and mountains made by Allah.", ar: "وادٍ أخضَرُ وجِبالٌ مِن خَلقِ الله." },
      },
      callout: {
        label: { en: "Think with me", ar: "فَكِّرْ مَعي" },
        title: { en: "Who gave me all of this?", ar: "مَن أعطاني كُلَّ هذا؟" },
        body: {
          en: "Look around you: your eyes that see, your family, your food, the water you drink. Who made all of it and gave it to you? Allah, my Lord. So I thank Him by saying 'Alhamdulillah'.",
          ar: "انظُرْ حَولَكَ: عَيناكَ اللَّتانِ تُبصِران، وأُسرَتُكَ، وطَعامُكَ، والماءُ الذي تَشرَبُهُ. مَن صَنَعَ كُلَّ هذا وأعطاكَ إيّاهُ؟ إنَّهُ اللهُ رَبّي. فأشكُرُهُ قائِلًا: (الحَمدُ لله).",
        },
      },
      responsePrompt: {
        title: { en: "My thank-you to Allah", ar: "شُكري لله" },
        prompt: {
          en: "Write one blessing from Allah that you are thankful for today (for example: my mother, my eyes, my food).",
          ar: "اكتُبْ نِعمةً واحِدةً مِنَ اللهِ تَشكُرُهُ عَلَيها اليَوم (مَثَلًا: أُمّي، عَينايَ، طَعامي).",
        },
        placeholder: { en: "I thank Allah for...", ar: "أشكُرُ اللهَ على..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Every day Allah gives me so many gifts. A good Muslim child remembers Allah, says 'Alhamdulillah' for the blessings, and is kind to others because Allah loves kindness.",
        ar: "في كُلِّ يَومٍ يُعطيني اللهُ نِعَمًا كَثيرة. والطِّفلُ المُسلِمُ الجَيِّدُ يَتَذَكَّرُ اللهَ، ويَقولُ (الحَمدُ لله) على النِّعَم، ويَكونُ لَطيفًا مَعَ الآخَرينَ لأنَّ اللهَ يُحِبُّ اللُّطف.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who is my Lord who created me and everything?", ar: "مَن رَبّي الذي خَلَقَني وخَلَقَ كُلَّ شيء؟" },
      options: [
        { en: "Allah", ar: "اللهُ" },
        { en: "The sun", ar: "الشَّمسُ" },
        { en: "A king", ar: "مَلِكٌ" },
      ],
      correctIndex: 0,
      explanation: {
        en: "Allah is my Lord (Rabb). He created me and everything around me.",
        ar: "اللهُ رَبّي. هو الذي خَلَقَني وخَلَقَ كُلَّ ما حَولي.",
      },
    },
    {
      prompt: { en: "What does the word 'Rabb' (Lord) mean?", ar: "ماذا تَعني كَلِمةُ (الرَّبّ)؟" },
      options: [
        { en: "The One who creates and takes care of us", ar: "الذي يَخلُقُنا ويَرعانا" },
        { en: "A big animal", ar: "حَيَوانٌ كَبير" },
        { en: "A kind of food", ar: "نَوعٌ مِنَ الطَّعام" },
      ],
      correctIndex: 0,
      explanation: {
        en: "Rabb means the One who created us, gives us what we need, and cares for us — that is Allah.",
        ar: "الرَّبُّ هو الذي خَلَقَنا وأعطانا ما نَحتاجُ ورَعانا، وهو اللهُ.",
      },
    },
    {
      prompt: { en: "True or False: Allah created the sky, the sun, and the animals.", ar: "صَوابٌ أم خَطأ: اللهُ خَلَقَ السَّماءَ والشَّمسَ والحَيَوانات." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: {
        en: "True. Allah is the Creator of everything.",
        ar: "صَواب. اللهُ خالِقُ كُلِّ شيء.",
      },
    },
    {
      prompt: { en: "Prophet Ibrahim knew his Lord is the One who...", ar: "عَرَفَ النَّبِيُّ إبراهيمُ أنَّ رَبَّهُ هو الذي..." },
      options: [
        { en: "never disappears and made the stars and sun", ar: "لا يَغيبُ أبَدًا وخَلَقَ النُّجومَ والشَّمس" },
        { en: "is the moon", ar: "هو القَمَر" },
        { en: "is the biggest star", ar: "هو أكبَرُ نَجم" },
      ],
      correctIndex: 0,
      explanation: {
        en: "The stars, moon, and sun disappear. Allah, who made them, never disappears.",
        ar: "النُّجومُ والقَمَرُ والشَّمسُ تَغيب، أمّا اللهُ الذي خَلَقَها فلا يَغيبُ أبَدًا.",
      },
    },
    {
      prompt: { en: "What do I say to thank Allah for His gifts?", ar: "ماذا أقولُ لأشكُرَ اللهَ على نِعَمِه؟" },
      options: [
        { en: "Alhamdulillah", ar: "الحَمدُ لله" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "I am the best", ar: "أنا الأفضَل" },
      ],
      correctIndex: 0,
      explanation: {
        en: "We thank our Lord by saying 'Alhamdulillah' — all praise is for Allah.",
        ar: "نَشكُرُ رَبَّنا بِقَولِ (الحَمدُ لله).",
      },
    },
  ],
};
