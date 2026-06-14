import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const iLovePlanting: CourseLesson = {
  slug: "g1y2-i-love-planting",
  name: { en: "I Love Planting", ar: "أحبُ الزِّراعةَ" },
  shortIntro: {
    en: "Planting and caring for the earth is a good deed in Islam. Let us learn why we love to plant.",
    ar: "الزِّراعةُ ورِعايةُ الأرضِ عَمَلٌ طَيِّبٌ في الإسلام. لِنَتَعَلَّمْ لِماذا نُحِبُّ الزِّراعة.",
  },
  quranSurahs: ["Abasa 24-32"],
  sections: [
    {
      title: { en: "Allah makes plants grow", ar: "اللهُ يُنبِتُ الزَّرع" },
      learningObjective: {
        en: "I can say that planting and caring for plants is loved in Islam.",
        ar: "أستَطيعُ أن أقولَ إنَّ الزِّراعةَ ورِعايةَ النَّباتِ مَحبوبةٌ في الإسلام.",
      },
      image: {
        src: IMG.greenValley,
        alt: { en: "Green plants growing in a valley.", ar: "نَباتاتٌ خَضراءُ تَنمو في وادٍ." },
        caption: { en: "From a tiny seed, Allah grows food for us all.", ar: "مِن بِذرةٍ صَغيرةٍ يُنبِتُ اللهُ لَنا الطَّعام." },
      },
      body: {
        en: "Have you ever watched a tiny seed grow into a tall plant with leaves and fruit? Only Allah can do that! He sends the rain, warms the soil with the sun, and makes the seed grow. When we plant a seed and care for it, we are taking part in one of Allah's most beautiful gifts: life from the earth.",
        ar: "هل رَأيتَ يَومًا بِذرةً صَغيرةً تَنمو نَباتًا طَويلًا بِأوراقٍ وثِمار؟ اللهُ وَحدَهُ يَستَطيعُ ذلِك! يُنزِلُ المَطَر، ويُدفِئُ التُّربةَ بالشَّمس، ويُنبِتُ البِذرة. وحينَ نَزرَعُ بِذرةً ونَرعاها نُشارِكُ في واحِدةٍ مِن أجمَلِ هِباتِ الله: الحَياةُ مِنَ الأرض.",
      },
    },
    {
      title: { en: "Look at your food", ar: "انظُرْ إلى طَعامِك" },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child reading about Allah's gifts.", ar: "طِفلٌ يَقرَأُ عن نِعَمِ الله." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"So let the human look at his food: that We poured down water in abundance, then We split the earth, and caused to grow grain, grapes, vegetables...\" — Abasa 24-28", ar: "﴿فَلْيَنظُرِ الْإِنسَانُ إِلَىٰ طَعَامِهِ ۝ أَنَّا صَبَبْنَا الْمَاءَ صَبًّا ۝ ثُمَّ شَقَقْنَا الْأَرْضَ شَقًّا ۝ فَأَنبَتْنَا فِيهَا حَبًّا ۝ وَعِنَبًا وَقَضْبًا﴾ — عبس ٢٤-٢٨" },
          ],
        },
      ],
      body: {
        en: "Allah tells us to look at our food and think: the rain came down, the earth opened, and grains, grapes, and vegetables grew. All of this is from Allah. When we eat fruit and vegetables, we remember that Allah grew them for us, and we say 'Alhamdulillah'. Planting helps us see Allah's power and kindness up close.",
        ar: "يَأمُرُنا اللهُ أن نَنظُرَ إلى طَعامِنا ونُفَكِّر: نَزَلَ المَطَر، وانشَقَّتِ الأرض، فَنَبَتَتِ الحُبوبُ والعِنَبُ والخُضَر. وكُلُّ هذا مِنَ الله. وحينَ نَأكُلُ الفاكِهةَ والخُضارَ نَتَذَكَّرُ أنَّ اللهَ أنبَتَها لَنا، فَنَقولُ «الحَمدُ لله». والزِّراعةُ تُرينا قُدرةَ اللهِ ولُطفَهُ عن قُرب.",
      },
    },
    {
      title: { en: "Planting is a charity", ar: "الزِّراعةُ صَدَقة" },
      image: {
        src: IMG.plantBulb,
        alt: { en: "A small green plant being cared for.", ar: "نَبتةٌ خَضراءُ صَغيرةٌ تُرعى." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"If a Muslim plants a tree, and a person or a bird or an animal eats from it, it is counted as charity for him.\" (Bukhari)", ar: "قال النَّبِيُّ ﷺ: «ما مِن مُسلِمٍ يَغرِسُ غَرسًا فَيَأكُلُ مِنهُ إنسانٌ أو طائِرٌ أو بَهيمةٌ إلّا كانَ لَهُ بهِ صَدَقة». (رواه البخاري)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ gave us wonderful news: when we plant a tree or a plant, and any person, bird, or animal eats from it, Allah writes it as a charity (sadaqah) for us — even after we forget about it! So planting is not just fun; it is a way to keep earning good deeds. The Prophet ﷺ encouraged us to plant even on our very last day.",
        ar: "بَشَّرَنا نَبِيُّنا ﷺ بِبُشرى رائِعة: حينَ نَغرِسُ شَجَرةً أو نَباتًا فَيَأكُلُ مِنهُ إنسانٌ أو طائِرٌ أو حَيَوان، يَكتُبُها اللهُ لَنا صَدَقة، حتّى بعدَ أن نَنساها! فالزِّراعةُ ليسَت مُتعةً فَحَسب، بل طَريقٌ لِكَسبِ الحَسَناتِ باستِمرار. وقد حَثَّنا النَّبِيُّ ﷺ على الغَرسِ حتّى في آخِرِ يَومٍ لَنا.",
      },
    },
    {
      title: { en: "Caring for the earth", ar: "العِنايةُ بالأرض" },
      image: {
        src: IMG.waterfall,
        alt: { en: "Fresh water that helps plants grow.", ar: "ماءٌ عَذبٌ يُساعِدُ النَّباتَ على النُّمُوّ." },
      },
      body: {
        en: "Loving planting means caring for the earth Allah gave us. We water plants gently, we do not pick or break them for no reason, we keep gardens and parks clean, and we do not waste water. The UAE plants many trees in the desert to make it green. We can help too, by growing a plant at home or at school and looking after it well.",
        ar: "حُبُّ الزِّراعةِ يَعني العِنايةَ بالأرضِ التي أعطانا اللهُ إيّاها. نَسقي النَّباتَ بِرِفق، ولا نَقطِفُهُ أو نَكسِرُهُ بِلا سَبَب، ونُبقي الحَدائِقَ والمُتَنَزَّهاتِ نَظيفة، ولا نُبَذِّرُ الماء. وتَزرَعُ الإماراتُ أشجارًا كَثيرةً في الصَّحراءِ لِتُخَضِّرَها. ونَستَطيعُ أن نُساعِدَ أيضًا بِزِراعةِ نَبتةٍ في البَيتِ أوِ المَدرَسةِ والاعتِناءِ بِها.",
      },
    },
    {
      title: { en: "In my life", ar: "في حَياتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A child caring for a small plant.", ar: "طِفلٌ يَعتَني بِنَبتةٍ صَغيرة." },
      },
      callout: {
        label: { en: "Activity", ar: "نَشاط" },
        title: { en: "Grow your own plant", ar: "ازرَعْ نَبتَتَك" },
        body: {
          en: "Imagine you plant a small seed in a pot. What will you do every day to help it grow into a healthy plant? Think about water, sunlight, and care.",
          ar: "تَخَيَّلْ أنَّكَ زَرَعتَ بِذرةً صَغيرةً في أصيص. ماذا سَتَفعَلُ كُلَّ يَومٍ لِتُساعِدَها على أن تَصيرَ نَبتةً صَحِّيّة؟ فَكِّرْ في الماءِ والشَّمسِ والعِناية.",
        },
      },
      responsePrompt: {
        title: { en: "My planting plan", ar: "خُطَّتي في الزِّراعة" },
        prompt: {
          en: "Write what you would plant and how you would care for it.",
          ar: "اكتُبْ ماذا سَتَزرَعُ وكَيفَ سَتَعتَني بِه.",
        },
        placeholder: { en: "I would plant... and care for it by...", ar: "سأزرَعُ... وأعتَني بِهِ بِأن..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "Planting is a beautiful way to thank Allah and to keep earning rewards. Let us love to plant, care for the earth, and remember that even a small green plant can be a charity that pleases Allah.",
        ar: "الزِّراعةُ طَريقةٌ جَميلةٌ لِشُكرِ اللهِ ولِكَسبِ الحَسَناتِ باستِمرار. فَلْنُحِبَّ الزِّراعة، ونَعتَنِ بالأرض، ولْنَتَذَكَّرْ أنَّ نَبتةً خَضراءَ صَغيرةً قد تَكونُ صَدَقةً تُرضي الله.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Who makes a seed grow into a plant?", ar: "مَن يُنبِتُ البِذرةَ نَباتًا؟" },
      options: [
        { en: "Allah", ar: "الله" },
        { en: "No one", ar: "لا أحَد" },
        { en: "The seed by itself", ar: "البِذرةُ وَحدَها" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah sends rain and sun and makes plants grow.", ar: "اللهُ يُنزِلُ المَطَرَ والشَّمسَ ويُنبِتُ الزَّرع." },
    },
    {
      prompt: { en: "What happens when a bird eats from a tree you planted?", ar: "ماذا يَحدُثُ حينَ يَأكُلُ طائِرٌ مِن شَجَرةٍ زَرَعتَها؟" },
      options: [
        { en: "It is counted as a charity for you", ar: "تُحتَسَبُ لَكَ صَدَقة" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "A punishment", ar: "عُقوبة" },
      ],
      correctIndex: 0,
      explanation: { en: "The Prophet ﷺ said it is a charity for the planter.", ar: "قال النَّبِيُّ ﷺ إنَّها صَدَقةٌ للغارِس." },
    },
    {
      prompt: { en: "How do we care for the earth?", ar: "كَيفَ نَعتَني بالأرض؟" },
      options: [
        { en: "Water plants and do not waste water", ar: "نَسقي النَّباتَ ولا نُبَذِّرُ الماء" },
        { en: "Break plants", ar: "نَكسِرُ النَّبات" },
        { en: "Throw rubbish in gardens", ar: "نَرمي النِّفاياتِ في الحَدائِق" },
      ],
      correctIndex: 0,
      explanation: { en: "We water gently and do not waste or harm.", ar: "نَسقي بِرِفقٍ ولا نُبَذِّرُ ولا نُؤذي." },
    },
    {
      prompt: { en: "What should we say when we see how Allah grows our food?", ar: "ماذا نَقولُ حينَ نَرى كَيفَ يُنبِتُ اللهُ طَعامَنا؟" },
      options: [
        { en: "Alhamdulillah", ar: "الحَمدُ لله" },
        { en: "Nothing", ar: "لا شيء" },
        { en: "We complain", ar: "نَتَذَمَّر" },
      ],
      correctIndex: 0,
      explanation: { en: "We thank Allah by saying Alhamdulillah.", ar: "نَشكُرُ اللهَ بِقَولِ «الحَمدُ لله»." },
    },
    {
      prompt: { en: "True or False: Planting a tree can keep earning good deeds for us.", ar: "صَوابٌ أم خَطأ: غَرسُ الشَّجَرةِ قد يَستَمِرُّ في كَسبِ الحَسَناتِ لَنا." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. It is charity every time someone eats from it.", ar: "صَواب. تَكونُ صَدَقةً كُلَّما أكَلَ مِنها أحَد." },
    },
  ],
};
