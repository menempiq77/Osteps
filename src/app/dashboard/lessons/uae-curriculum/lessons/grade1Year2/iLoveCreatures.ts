import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const iLoveCreatures: CourseLesson = {
  slug: "g1y2-i-love-the-creatures-of-my-lord",
  name: { en: "I Love the Creatures of My Lord", ar: "أحبُ مخلوقاتِ ربي" },
  shortIntro: {
    en: "Allah made all living things. Let us learn to love and care for animals, birds, plants, and people.",
    ar: "اللهُ خَلَقَ كُلَّ الكائِناتِ الحَيّة. لِنَتَعَلَّمْ أن نُحِبَّ ونَرعى الحَيَواناتِ والطُّيورَ والنَّباتاتِ والنّاس.",
  },
  quranSurahs: ["Hud 6"],
  sections: [
    {
      title: { en: "All creatures belong to Allah", ar: "كُلُّ المَخلوقاتِ لله" },
      learningObjective: {
        en: "I can say that Allah cares for every creature and so should I.",
        ar: "أستَطيعُ أن أقولَ إنَّ اللهَ يَرعى كُلَّ مَخلوقٍ وكَذلِكَ يَنبَغي لي.",
      },
      image: {
        src: IMG.elephant,
        alt: { en: "A gentle elephant in nature.", ar: "فيلٌ وَديعٌ في الطَّبيعة." },
        caption: { en: "Big and small, every creature is made and loved by Allah.", ar: "كَبيرٌ وصَغير، كُلُّ مَخلوقٍ خَلَقَهُ اللهُ ويَرعاه." },
      },
      body: {
        en: "Allah created so many wonderful creatures: tall elephants, tiny ants, colourful birds, swimming fish, and beautiful flowers. Every one of them is a creation of Allah. When we love and care for Allah's creatures, we show that we love Allah, the One who made them all.",
        ar: "خَلَقَ اللهُ مَخلوقاتٍ كَثيرةً عَجيبة: الفِيَلةَ الطَّويلة، والنَّملَ الصَّغير، والطُّيورَ المُلَوَّنة، والأسماكَ السّابِحة، والأزهارَ الجَميلة. وكُلٌّ مِنها مِن خَلقِ الله. وحينَ نُحِبُّ مَخلوقاتِ اللهِ ونَرعاها نُظهِرُ أنَّنا نُحِبُّ اللهَ الذي خَلَقَها جَميعًا.",
      },
    },
    {
      title: { en: "Allah provides for every creature", ar: "اللهُ يَرزُقُ كُلَّ مَخلوق" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading about Allah's creatures.", ar: "طِفلٌ يَقرَأُ عن مَخلوقاتِ الله." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"And there is no creature on earth but that its provision is due from Allah...\" — Hud 6", ar: "﴿وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا...﴾ — هود ٦" },
            { en: "It means: Allah feeds and takes care of every living thing.", ar: "مَعناها: اللهُ يَرزُقُ كُلَّ كائِنٍ حَيٍّ ويَرعاه." },
          ],
        },
      ],
      body: {
        en: "Allah tells us that He gives food and care to every creature on earth — even the smallest ant and the bird in the sky. Allah's mercy reaches all of them. Since Allah is so kind to His creatures, we should also be kind: feeding a hungry cat, giving water to a bird, and never harming any animal.",
        ar: "يُخبِرُنا اللهُ أنَّهُ يُعطي الطَّعامَ والرِّعايةَ لِكُلِّ مَخلوقٍ في الأرض، حتّى أصغَرِ نَملةٍ والطّائِرِ في السَّماء. ورَحمةُ اللهِ تَشمَلُها جَميعًا. ولأنَّ اللهَ رَحيمٌ بِمَخلوقاتِه، يَنبَغي أن نَكونَ رُحَماءَ أيضًا: نُطعِمُ القِطّةَ الجائِعة، ونَسقي الطّائِر، ولا نُؤذي حَيَوانًا أبَدًا.",
      },
    },
    {
      title: { en: "Kindness to a creature is rewarded", ar: "الرِّفقُ بالمَخلوقِ مَأجور" },
      image: {
        src: IMG.puppies,
        alt: { en: "Two puppies among flowers.", ar: "جِرْوانِ بَينَ الأزهار." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"In every living being there is a reward (for kindness).\" (Bukhari)", ar: "قال النَّبِيُّ ﷺ: «في كُلِّ كَبِدٍ رَطبةٍ أجر». (رواه البخاري)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ taught us that being kind to any living creature brings us reward from Allah. He told the story of a man who gave water to a thirsty dog, and Allah forgave his sins. He also warned about a woman who was punished for locking up a cat with no food. So kindness to animals is rewarded, and cruelty is a sin.",
        ar: "عَلَّمَنا نَبِيُّنا ﷺ أنَّ الرِّفقَ بِأيِّ مَخلوقٍ حَيٍّ يَجلِبُ الأجرَ مِنَ الله. وحَكى قِصّةَ رَجُلٍ سَقى كَلبًا عَطشانَ فَغَفَرَ اللهُ لَه. وحَذَّرَ مِنِ امرأةٍ عُذِّبَت لأنَّها حَبَسَت قِطّةً بِلا طَعام. فالرِّفقُ بالحَيَوانِ مَأجور، والقَسوةُ ذَنب.",
      },
    },
    {
      title: { en: "Caring for plants and the earth too", ar: "نَرعى النَّباتاتِ والأرضَ أيضًا" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A green valley full of life.", ar: "وادٍ أخضَرُ مَملوءٌ بالحَياة." },
      },
      body: {
        en: "Loving Allah's creation also means caring for plants and the earth. We water plants, we do not pick flowers for no reason, we do not break branches, and we keep nature clean. Planting a tree is a great deed — the Prophet ﷺ said that if a bird or a person eats from a tree you planted, it counts as charity for you.",
        ar: "مَحَبّةُ خَلقِ اللهِ تَعني أيضًا رِعايةَ النَّباتاتِ والأرض. نَسقي النَّبات، ولا نَقطِفُ الأزهارَ بِلا سَبَب، ولا نَكسِرُ الأغصان، ونُبقي الطَّبيعةَ نَظيفة. وغَرسُ شَجَرةٍ عَمَلٌ عَظيم، فقد قال النَّبِيُّ ﷺ إنَّ مَن غَرَسَ شَجَرةً فَأكَلَ مِنها طائِرٌ أو إنسانٌ كانَت لَهُ صَدَقة.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.cat,
        alt: { en: "A friendly cat looking for kindness.", ar: "قِطّةٌ أليفةٌ تَطلُبُ اللُّطف." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "A bird with a broken wing", ar: "طائِرٌ بِجَناحٍ مَكسور" },
        body: {
          en: "You find a little bird that cannot fly. Some children want to throw stones at it. What is the kind, Islamic thing for you to do?",
          ar: "تَجِدُ طائِرًا صَغيرًا لا يَستَطيعُ الطَّيَران، ويُريدُ بَعضُ الأطفالِ أن يَرموهُ بالحِجارة. ما الشَّيءُ اللَّطيفُ الإسلاميُّ الذي تَفعَلُه؟",
        },
      },
      responsePrompt: {
        title: { en: "My kindness to creatures", ar: "رِفقي بالمَخلوقات" },
        prompt: {
          en: "Write one way you can be kind to an animal or a plant.",
          ar: "اكتُبْ طَريقةً واحِدةً تَرفُقُ بِها بِحَيَوانٍ أو نَبات.",
        },
        placeholder: { en: "I will be kind by...", ar: "سأرفُقُ بِأن..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Allah created and cares for every creature, and He rewards us when we are kind to them. Let us love and protect animals, birds, and plants — for loving Allah's creation is part of loving Allah.",
        ar: "اللهُ خَلَقَ كُلَّ مَخلوقٍ ويَرعاه، ويُثيبُنا حينَ نَرفُقُ بِها. فَلْنُحِبَّ ونَحمِ الحَيَواناتِ والطُّيورَ والنَّباتات، فَمَحَبّةُ خَلقِ اللهِ مِن مَحَبّةِ الله.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who provides food for every creature?", ar: "مَن يَرزُقُ كُلَّ مَخلوق؟" },
      options: [
        { en: "Allah", ar: "الله" },
        { en: "No one", ar: "لا أحَد" },
        { en: "Only people", ar: "النّاسُ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah provides for every creature on earth.", ar: "اللهُ يَرزُقُ كُلَّ مَخلوقٍ في الأرض." },
    },
    {
      prompt: { en: "What did the man who gave water to a thirsty dog receive?", ar: "ماذا نالَ الرَّجُلُ الذي سَقى الكَلبَ العَطشان؟" },
      options: [
        { en: "Allah forgave his sins", ar: "غَفَرَ اللهُ ذُنوبَه" },
        { en: "A punishment", ar: "عُقوبة" },
        { en: "Nothing", ar: "لا شيء" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah forgave him for his kindness to the dog.", ar: "غَفَرَ اللهُ لَهُ لِرِفقِهِ بالكَلب." },
    },
    {
      prompt: { en: "Is there reward for being kind to animals?", ar: "هل في الرِّفقِ بالحَيَوانِ أجر؟" },
      options: [
        { en: "Yes, in every living being there is a reward", ar: "نَعَم، في كُلِّ كائِنٍ حَيٍّ أجر" },
        { en: "No", ar: "لا" },
        { en: "Only for big animals", ar: "للحَيَواناتِ الكَبيرةِ فَقَط" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ said kindness to any living being is rewarded.", ar: "قال النَّبِيُّ ﷺ إنَّ الرِّفقَ بِأيِّ كائِنٍ حَيٍّ مَأجور." },
    },
    {
      prompt: { en: "What is the reward for planting a tree that others eat from?", ar: "ما أجرُ غَرسِ شَجَرةٍ يَأكُلُ مِنها الآخَرون؟" },
      options: [
        { en: "It counts as charity", ar: "تُحتَسَبُ صَدَقة" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "A punishment", ar: "عُقوبة" },
      ],
      correctIndex: 0,
      explanation: { en: "It is charity for you whenever a creature eats from it.", ar: "تَكونُ لَكَ صَدَقةً كُلَّما أكَلَ مِنها مَخلوق." },
    },
    {
      prompt: { en: "True or False: Hurting animals for fun is wrong in Islam.", ar: "صَوابٌ أم خَطأ: إيذاءُ الحَيَواناتِ للتَّسلِيةِ خَطأٌ في الإسلام." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. Cruelty to animals is a sin; Islam teaches mercy.", ar: "صَواب. القَسوةُ على الحَيَوانِ ذَنب، والإسلامُ يُعَلِّمُ الرَّحمة." },
    },
  ],
};
