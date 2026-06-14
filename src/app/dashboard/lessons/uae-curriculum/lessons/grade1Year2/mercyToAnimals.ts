import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const mercyToAnimals: CourseLesson = {
  slug: "g1y2-mercy-to-animals",
  name: { en: "Mercy to Animals", ar: "الرَّحْمَة بِالْحَيَوانِ" },
  shortIntro: {
    en: "Allah made the animals, and Islam teaches us to be kind and gentle to every creature.",
    ar: "اللهُ خَلَقَ الحَيَوانات، والإسلامُ يُعَلِّمُنا أن نَكونَ لُطَفاءَ رُحَماءَ بِكُلِّ مَخلوق.",
  },
  quranSurahs: ["Al-An'am 38"],
  sections: [
    {
      title: { en: "Animals are Allah's creation", ar: "الحَيَواناتُ خَلقُ الله" },
      learningObjective: {
        en: "I can say that Allah loves us to be kind to animals.",
        ar: "أستَطيعُ أن أقولَ إنَّ اللهَ يُحِبُّ أن نَرفُقَ بالحَيَوان.",
      },
      image: {
        src: IMG.chickens,
        alt: { en: "Hens being cared for kindly.", ar: "دَجاجٌ يُعتَنى بهِ بِلُطف." },
        caption: { en: "Allah created the animals and put them in our care.", ar: "خَلَقَ اللهُ الحَيَواناتِ وجَعَلَها في رِعايَتِنا." },
      },
      body: {
        en: "Allah made all the animals: the birds in the sky, the fish in the sea, and the cats and camels on the land. Animals feel hunger, thirst, and pain just like us. Because Allah made them, we must treat them with kindness and never hurt them.",
        ar: "خَلَقَ اللهُ كُلَّ الحَيَوانات: الطَّيرَ في السَّماء، والسَّمَكَ في البَحر، والقِطَطَ والإبِلَ في البَرّ. والحَيَواناتُ تَشعُرُ بالجوعِ والعَطَشِ والألَمِ مِثلَنا. ولأنَّ اللهَ خَلَقَها، يَجِبُ أن نُعامِلَها بِرِفقٍ ولا نُؤذِيَها أبَدًا.",
      },
    },
    {
      title: { en: "Animals are communities", ar: "الحَيَواناتُ أُمَمٌ مِثلُنا" },
      image: {
        src: IMG.butterflies,
        alt: { en: "Butterflies, small wonders of Allah's creation.", ar: "فَراشاتٌ، مِن عَجائِبِ خَلقِ الله." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"...There is no animal on the earth nor a bird flying with its wings but they are communities like you...\" — Al-An'am 38", ar: "﴿...وَمَا مِنْ دَابَّةٍ فِي الْأَرْضِ وَلَا طَائِرٍ يَطِيرُ بِجَنَاحَيْهِ إِلَّا أُمَمٌ أَمْثَالُكُمْ...﴾ — الأنعام ٣٨" },
            { en: "It means: animals are special groups created by Allah, just as people are.", ar: "مَعناها: الحَيَواناتُ أُمَمٌ خَلَقَها اللهُ مِثلَ النّاس." },
          ],
        },
      ],
      body: {
        en: "Allah tells us that animals are 'communities like you'. They have families, they care for their young, and they praise Allah in their own way. This teaches us to respect animals and remember that they belong to Allah, not just to us.",
        ar: "يُخبِرُنا اللهُ أنَّ الحَيَواناتِ (أُمَمٌ أمثالُكُم). فَلَها عائِلاتٌ، وتَرعى صِغارَها، وتُسَبِّحُ اللهَ بِطَريقَتِها. وهذا يُعَلِّمُنا أن نَحتَرِمَ الحَيَوانَ ونَتَذَكَّرَ أنَّها مِلكٌ لله لا لَنا وَحدَنا.",
      },
    },
    {
      title: { en: "A warning and a reward", ar: "تَحذيرٌ وأجر" },
      image: {
        src: IMG.cat,
        alt: { en: "A well-fed, happy cat.", ar: "قِطّةٌ سَعيدةٌ مُشبَعة." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ told of a woman who was punished because she locked up a cat with no food, and of a man forgiven because he gave water to a thirsty dog. (Bukhari & Muslim)", ar: "أخبَرَ النَّبِيُّ ﷺ عنِ امرأةٍ عُذِّبَت لأنَّها حَبَسَت قِطّةً بِلا طَعام، وعن رَجُلٍ غُفِرَ لَهُ لأنَّهُ سَقى كَلبًا عَطشان. (متفق عليه)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ taught us two important lessons. Being cruel to an animal is a great sin — a woman was punished for starving a cat. But being kind to an animal is greatly rewarded — a man was forgiven and given Paradise for giving a thirsty dog water. Even a small kindness to an animal is loved by Allah.",
        ar: "عَلَّمَنا نَبِيُّنا ﷺ دَرسَينِ مُهِمَّين. القَسوةُ على الحَيَوانِ ذَنبٌ عَظيم؛ فقد عُذِّبَتِ امرأةٌ لأنَّها جَوَّعَت قِطّة. أمّا الرِّفقُ بالحَيَوانِ فَلَهُ أجرٌ كَبير؛ فقد غُفِرَ لِرَجُلٍ وأُدخِلَ الجَنّةَ لأنَّهُ سَقى كَلبًا عَطشان. وحتّى الرِّفقُ الصَّغيرُ بالحَيَوانِ يُحِبُّهُ الله.",
      },
    },
    {
      title: { en: "The Prophet ﷺ loved animals", ar: "النَّبِيُّ ﷺ أحَبَّ الحَيَوان" },
      image: {
        src: IMG.elephant,
        alt: { en: "A large gentle elephant.", ar: "فيلٌ كَبيرٌ وَديع." },
      },
      body: {
        en: "Our Prophet ﷺ was gentle with animals. Once he saw a camel that was tired and crying, and he comforted it and told its owner to treat it well and not to overwork it. He told us to feed our animals, give them water, and never make them carry too much or hit them in the face. Kindness to animals is part of being a good Muslim.",
        ar: "كانَ نَبِيُّنا ﷺ رَفيقًا بالحَيَوان. رَأى مَرّةً جَمَلًا مُتعَبًا يَبكي فَهَدَّأَهُ وأمَرَ صاحِبَهُ أن يُحسِنَ إلَيهِ ولا يُرهِقَه. وأمَرَنا أن نُطعِمَ حَيَواناتِنا ونَسقِيَها ولا نُحَمِّلَها فَوقَ طاقَتِها ولا نَضرِبَها في وَجهِها. والرِّفقُ بالحَيَوانِ مِن حُسنِ الإسلام.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.puppies,
        alt: { en: "Cared-for puppies.", ar: "جِراءٌ يُعتَنى بِها." },
      },
      callout: {
        label: { en: "Scenario", ar: "موقِف" },
        title: { en: "A hungry cat at school", ar: "قِطّةٌ جائِعةٌ في المَدرَسة" },
        body: {
          en: "You see a thin, hungry cat near the school gate. Some children want to chase it away. What would the Prophet ﷺ want you to do?",
          ar: "تَرى قِطّةً نَحيلةً جائِعةً قُربَ بابِ المَدرَسة. ويُريدُ بَعضُ الأطفالِ طَردَها. ماذا يُريدُ النَّبِيُّ ﷺ أن تَفعَل؟",
        },
      },
      responsePrompt: {
        title: { en: "My kindness to animals", ar: "رِفقي بالحَيَوان" },
        prompt: {
          en: "Write one kind thing you can do for an animal this week.",
          ar: "اكتُبْ عَمَلًا طَيِّبًا واحِدًا تَفعَلُهُ لِحَيَوانٍ هذا الأُسبوع.",
        },
        placeholder: { en: "This week I will...", ar: "هذا الأُسبوعَ سأ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Animals are a beautiful part of Allah's creation. When we feed them, give them water, and treat them gently, we earn Allah's love and reward. Mercy to animals is mercy that Allah remembers.",
        ar: "الحَيَواناتُ جُزءٌ جَميلٌ مِن خَلقِ الله. وحينَ نُطعِمُها ونَسقيها ونَرفُقُ بِها نَنالُ مَحَبّةَ اللهِ وأجرَه. والرَّحمةُ بالحَيَوانِ رَحمةٌ يَذكُرُها الله.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who created all the animals?", ar: "مَن خَلَقَ كُلَّ الحَيَوانات؟" },
      options: [
        { en: "Allah", ar: "الله" },
        { en: "People", ar: "النّاس" },
        { en: "No one", ar: "لا أحَد" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah created every animal.", ar: "اللهُ خَلَقَ كُلَّ حَيَوان." },
    },
    {
      prompt: { en: "In the Qur'an, animals are described as...", ar: "في القُرآن، وُصِفَتِ الحَيَواناتُ بِأنَّها..." },
      options: [
        { en: "Communities like us", ar: "أُمَمٌ مِثلُنا" },
        { en: "Toys for play", ar: "ألعابٌ للَّعِب" },
        { en: "Not important", ar: "غَيرُ مُهِمّة" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah says animals are 'communities like you'.", ar: "يَقولُ اللهُ إنَّ الحَيَواناتِ (أُمَمٌ أمثالُكُم)." },
    },
    {
      prompt: { en: "Why was a woman punished in the hadith?", ar: "لِماذا عُذِّبَتِ المرأةُ في الحَديث؟" },
      options: [
        { en: "She locked up a cat with no food", ar: "حَبَسَت قِطّةً بِلا طَعام" },
        { en: "She fed a cat", ar: "أطعَمَت قِطّة" },
        { en: "She prayed too much", ar: "صَلَّت كَثيرًا" },
      ],
      correctIndex: 0,
      explanation: { en: "She was cruel to a cat by starving it.", ar: "قَسَت على قِطّةٍ فَجَوَّعَتها." },
    },
    {
      prompt: { en: "How should we treat animals?", ar: "كَيفَ نُعامِلُ الحَيَوانات؟" },
      options: [
        { en: "Feed them and be gentle", ar: "نُطعِمُها ونَرفُقُ بِها" },
        { en: "Hit them and scare them", ar: "نَضرِبُها ونُخيفُها" },
        { en: "Ignore them when hungry", ar: "نَتَجاهَلُها وهي جائِعة" },
      ],
      correctIndex: 0,
      explanation: { en: "We should feed animals, give them water, and be gentle.", ar: "نُطعِمُ الحَيَوانَ ونَسقيهِ ونَرفُقُ بِه." },
    },
    {
      prompt: { en: "True or False: Being kind to animals is loved by Allah.", ar: "صَوابٌ أم خَطأ: الرِّفقُ بالحَيَوانِ يُحِبُّهُ الله." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. A man was forgiven for giving a thirsty dog water.", ar: "صَواب. غُفِرَ لِرَجُلٍ لأنَّهُ سَقى كَلبًا عَطشان." },
    },
  ],
};
