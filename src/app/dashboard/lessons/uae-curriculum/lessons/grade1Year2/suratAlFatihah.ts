import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const suratAlFatihah: CourseLesson = {
  slug: "g1y2-surat-al-fatihah",
  name: { en: "Surat Al-Fatihah", ar: "سورة الفاتِحة" },
  shortIntro: {
    en: "The opening surah of the Qur'an. We read it in every prayer. Let us learn its meaning and why it is so special.",
    ar: "السّورةُ الأولى في القُرآن، نَقرَؤُها في كُلِّ صَلاة. لِنَتَعَلَّمَ مَعناها ولِماذا هي مُهِمّةٌ جِدًّا.",
  },
  quranSurahs: ["Al-Fatihah 1-7"],
  sections: [
    {
      title: { en: "The opening of the Qur'an", ar: "فاتِحةُ القُرآن" },
      learningObjective: {
        en: "I can say that Surat Al-Fatihah is the first surah and that we read it in every prayer.",
        ar: "أستَطيعُ أن أقولَ إنَّ سورةَ الفاتحةِ هي أوّلُ سورةٍ وأنَّنا نَقرَؤُها في كُلِّ صَلاة.",
      },
      image: {
        src: IMG.childQuran,
        alt: { en: "A child carefully reading the Qur'an.", ar: "طِفلٌ يَقرأُ القُرآنَ بِعِنايَة." },
        caption: { en: "Surat Al-Fatihah is the first surah in the Qur'an.", ar: "سورةُ الفاتحةِ هي أوّلُ سورةٍ في القُرآن." },
      },
      body: {
        en: "Surat Al-Fatihah is the very first surah in the Qur'an. Its name means 'The Opening'. It has seven short verses (ayat). We read Surat Al-Fatihah in every single prayer, in every rak'ah. It is a beautiful du'a (prayer) to Allah.",
        ar: "سورةُ الفاتحةِ هي أوّلُ سورةٍ في القُرآن، واسمُها مَعناهُ (الافتِتاح). فيها سَبعُ آياتٍ قَصيرة. ونَقرَأُ سورةَ الفاتحةِ في كُلِّ صَلاة، وفي كُلِّ رَكعة. وهي دُعاءٌ جَميلٌ لله.",
      },
    },
    {
      title: { en: "What the surah says", ar: "ماذا تَقولُ السّورة" },
      image: {
        src: IMG.bookshelf,
        alt: { en: "Shelves full of books, like the words of the Qur'an we learn.", ar: "رُفوفٌ مَليئةٌ بالكُتُب، كَكَلِماتِ القُرآنِ التي نَتَعَلَّمُها." },
      },
      infoBoxes: [
        {
          label: { en: "Qur'an", ar: "القُرآن" },
          lines: [
            { en: "\"In the name of Allah, the Most Merciful, the Especially Merciful.\"", ar: "﴿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾" },
            { en: "\"All praise is for Allah, Lord of all the worlds.\"", ar: "﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾" },
            { en: "\"It is You we worship and You we ask for help.\"", ar: "﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾" },
            { en: "\"Guide us to the straight path.\"", ar: "﴿اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ﴾" },
          ],
        },
      ],
      body: {
        en: "In Al-Fatihah we praise Allah, our kind Lord. We tell Allah: we worship only You, and we ask only You for help. Then we ask Allah for the best gift of all: 'Guide us to the straight path' — the good path that pleases Allah and leads to Paradise.",
        ar: "في الفاتحةِ نَحمَدُ اللهَ رَبَّنا الكَريم. ونَقولُ لله: نَعبُدُكَ وَحدَكَ، ونَطلُبُ العَونَ مِنكَ وَحدَكَ. ثُمَّ نَسألُ اللهَ أعظَمَ هَدِيّة: ﴿اهدِنا الصِّراطَ المُستَقيم﴾ أي الطَّريقَ الطَّيِّبَ الذي يُرضي اللهَ ويوصِلُ إلى الجَنّة.",
      },
    },
    {
      title: { en: "Why it matters", ar: "لِماذا هي مُهِمّة" },
      image: {
        src: IMG.grandMosque,
        alt: { en: "A beautiful mosque where people pray.", ar: "مَسجِدٌ جَميلٌ يُصَلّي فيهِ النّاس." },
      },
      infoBoxes: [
        {
          label: { en: "Hadith", ar: "حَديث" },
          lines: [
            { en: "The Prophet ﷺ said: \"There is no prayer for the one who does not recite the Opening of the Book (Al-Fatihah).\" (Bukhari & Muslim)", ar: "قال النَّبِيُّ ﷺ: «لا صَلاةَ لِمَن لَمْ يَقْرَأْ بِفاتِحةِ الكِتاب». (متفق عليه)" },
          ],
        },
      ],
      body: {
        en: "Our Prophet ﷺ told us that the prayer is not complete without reciting Al-Fatihah. That is why we learn it well and read it carefully in every prayer. When I read it slowly and think about the meaning, my prayer becomes more beautiful.",
        ar: "أخبَرَنا نَبِيُّنا ﷺ أنَّ الصَّلاةَ لا تَكتَمِلُ بِدونِ قِراءةِ الفاتحة. لِذلِكَ نَتَعَلَّمُها جَيِّدًا ونَقرَؤُها بِعِنايةٍ في كُلِّ صَلاة. وعِندَما أقرَؤُها بِتَأَنٍّ وأُفَكِّرُ في مَعناها تُصبِحُ صَلاتي أجمَل.",
      },
    },
    {
      title: { en: "Al-Fatihah brings goodness", ar: "الفاتحةُ تَجلِبُ الخَير" },
      image: {
        src: IMG.greenValley,
        alt: { en: "A peaceful green valley, calm like the heart of someone who reads the Qur'an.", ar: "وادٍ أخضَرُ هادِئٌ، كَقَلبِ مَن يَقرَأُ القُرآن." },
      },
      body: {
        en: "Al-Fatihah is so blessed that the companions of the Prophet ﷺ once read it over a sick man, and by Allah's permission he became well. This is called ruqyah. It shows us that the words of the Qur'an are full of good. We should respect the Qur'an, hold it with clean hands, and listen quietly when it is read.",
        ar: "الفاتحةُ مُبارَكةٌ جِدًّا، حتّى إنَّ أصحابَ النَّبِيِّ ﷺ قَرَؤوها مَرّةً على رَجُلٍ مَريضٍ فشُفِيَ بِإذنِ الله، ويُسمّى هذا (الرُّقية). وهذا يُعَلِّمُنا أنَّ كَلامَ القُرآنِ مَليءٌ بالخَير. وعَلَينا أن نَحتَرِمَ القُرآنَ، ونُمسِكَهُ بِأيدٍ نَظيفة، ونَستَمِعَ بِهُدوءٍ حينَ يُقرَأ.",
      },
    },
    {
      title: { en: "In my prayer", ar: "في صَلاتي" },
      image: {
        src: IMG.childBooks,
        alt: { en: "A young child learning.", ar: "طِفلٌ صَغيرٌ يَتَعَلَّم." },
      },
      callout: {
        label: { en: "Let's practise", ar: "لِنَتَدَرَّب" },
        title: { en: "I read Al-Fatihah every day", ar: "أقرَأُ الفاتحةَ كُلَّ يَوم" },
        body: {
          en: "Try to read Surat Al-Fatihah slowly and clearly in your prayer. Ask your teacher or family to listen and help you.",
          ar: "حاوِلْ أن تَقرَأَ سورةَ الفاتحةِ بِتَأَنٍّ ووُضوحٍ في صَلاتِكَ. واطلُبْ مِن مُعَلِّمِكَ أو أُسرَتِكَ أن يَستَمِعوا ويُساعِدوكَ.",
        },
      },
      responsePrompt: {
        title: { en: "My favourite verse", ar: "آيَتي المُفَضَّلة" },
        prompt: {
          en: "Which verse of Al-Fatihah do you like most, and why?",
          ar: "أيُّ آيةٍ مِنَ الفاتحةِ تُحِبُّها أكثَر، ولِماذا؟",
        },
        placeholder: { en: "I like the verse...", ar: "أُحِبُّ الآيةَ..." },
        buttonLabel: { en: "Save my answer", ar: "احفَظْ إجابَتي" },
      },
      body: {
        en: "When I read Al-Fatihah, I am talking to Allah and asking Him to guide me to the good path. The more I read it with my heart, the closer I feel to my Lord.",
        ar: "حينَ أقرَأُ الفاتحةَ فأنا أُكَلِّمُ اللهَ وأطلُبُ مِنهُ أن يَهدِيَني للطَّريقِ الطَّيِّب. وكُلَّما قَرَأتُها بِقَلبي شَعَرتُ بِقُربٍ أكثَرَ مِن رَبّي.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "Where is Surat Al-Fatihah in the Qur'an?", ar: "أينَ تَقَعُ سورةُ الفاتحةِ في القُرآن؟" },
      options: [
        { en: "It is the first surah", ar: "هي أوّلُ سورة" },
        { en: "It is the last surah", ar: "هي آخِرُ سورة" },
        { en: "It is in the middle", ar: "هي في الوَسَط" },
      ],
      correctIndex: 0,
      explanation: { en: "Al-Fatihah means 'The Opening' — it is the first surah of the Qur'an.", ar: "الفاتحةُ مَعناها (الافتِتاح)، وهي أوّلُ سورةٍ في القُرآن." },
    },
    {
      prompt: { en: "How many verses (ayat) are in Surat Al-Fatihah?", ar: "كَم آيةً في سورةِ الفاتحة؟" },
      options: [
        { en: "Seven", ar: "سَبع" },
        { en: "Three", ar: "ثَلاث" },
        { en: "Twenty", ar: "عِشرون" },
      ],
      correctIndex: 0,
      explanation: { en: "Surat Al-Fatihah has seven verses.", ar: "سورةُ الفاتحةِ فيها سَبعُ آيات." },
    },
    {
      prompt: { en: "When do we read Surat Al-Fatihah?", ar: "مَتى نَقرَأُ سورةَ الفاتحة؟" },
      options: [
        { en: "In every prayer", ar: "في كُلِّ صَلاة" },
        { en: "Only on holidays", ar: "في الأعيادِ فقط" },
        { en: "Never", ar: "أبَدًا" },
      ],
      correctIndex: 0,
      explanation: { en: "We read Al-Fatihah in every rak'ah of every prayer.", ar: "نَقرَأُ الفاتحةَ في كُلِّ رَكعةٍ مِن كُلِّ صَلاة." },
    },
    {
      prompt: { en: "True or False: The prayer is not complete without Al-Fatihah.", ar: "صَوابٌ أم خَطأ: الصَّلاةُ لا تَكتَمِلُ بِدونِ الفاتحة." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "True. The Prophet ﷺ said there is no prayer without Al-Fatihah.", ar: "صَواب. قال النَّبِيُّ ﷺ: لا صَلاةَ لِمَن لَم يَقرَأ بالفاتحة." },
    },
    {
      prompt: { en: "In Al-Fatihah, we ask Allah to guide us to...", ar: "في الفاتحةِ نَطلُبُ مِنَ اللهِ أن يَهدِيَنا إلى..." },
      options: [
        { en: "the straight path", ar: "الصِّراطِ المُستَقيم" },
        { en: "a big house", ar: "بَيتٍ كَبير" },
        { en: "lots of toys", ar: "ألعابٍ كَثيرة" },
      ],
      correctIndex: 0,
      explanation: { en: "We ask Allah: 'Guide us to the straight path' — the good path that pleases Him.", ar: "نَسألُ اللهَ: ﴿اهدِنا الصِّراطَ المُستَقيم﴾ أي الطَّريقَ الطَّيِّبَ الذي يُرضيه." },
    },
  ],
};
