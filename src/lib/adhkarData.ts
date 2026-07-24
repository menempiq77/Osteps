import library from "@/data/adhkarLibrary.json";

export type AdhkarEntry = {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  source: string;
};

export type AdhkarGroup = {
  id: string;
  name: string;
  arabicName: string;
  accent: string;
  soft: string;
  border: string;
};

export type AdhkarCategory = {
  id: string;
  chapterNumber: number;
  group: string;
  name: string;
  arabicName: string;
  description: string;
  accent: string;
  soft: string;
  border: string;
  entries: AdhkarEntry[];
};

type AdhkarLibrary = {
  attribution: string;
  groups: AdhkarGroup[];
  categories: AdhkarCategory[];
};

const COMPLETE_LIBRARY = library as AdhkarLibrary;

export const ADHKAR_ATTRIBUTION = COMPLETE_LIBRARY.attribution;
export const ADHKAR_GROUPS = COMPLETE_LIBRARY.groups;
export const ADHKAR_CATEGORIES = COMPLETE_LIBRARY.categories;

const morningAndEvening = ADHKAR_CATEGORIES.find(
  (category) => category.chapterNumber === 27,
);

if (!morningAndEvening) {
  throw new Error(
    "The morning and evening Hisnul Muslim collection is missing.",
  );
}

const entryNumber = (entry: AdhkarEntry) =>
  Number(entry.id.replace("hisn-", ""));

const MORNING_ENTRY_NUMBERS = new Set([
  ...Array.from({ length: 22 }, (_, index) => index + 75),
  98,
]);
const EVENING_ENTRY_NUMBERS = new Set([
  ...Array.from({ length: 18 }, (_, index) => index + 75),
  96,
  97,
  98,
]);

const MORNING_VARIANTS: Record<string, Partial<AdhkarEntry>> = {
  "hisn-77": {
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    translation:
      "We have reached the morning and all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belong all sovereignty and praise, and He is over all things omnipotent. My Lord, I ask You for the good of this day and what follows it, and I take refuge in You from the evil of this day and what follows it. My Lord, I take refuge in You from laziness, senility, torment in the Fire, and punishment in the grave.",
  },
  "hisn-78": {
    arabic:
      "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.",
    translation:
      "O Allah, by You we enter the morning and by You we enter the evening; by You we live and by You we die, and to You is the resurrection.",
  },
  "hisn-80": {
    arabic:
      "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ.",
  },
  "hisn-81": {
    arabic:
      "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
  },
  "hisn-89": {
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ: فَتْحَهُ، وَنَصْرَهُ، وَنورَهُ، وَبَرَكَتَهُ، وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ.",
    translation:
      "We have reached the morning and all sovereignty belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day: its triumph, victory, light, blessing, and guidance. I take refuge in You from the evil within it and the evil that follows it.",
  },
  "hisn-90": {
    arabic:
      "أَصْبَحْنا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ.",
  },
};

const EVENING_VARIANTS: Record<string, Partial<AdhkarEntry>> = {
  "hisn-77": {
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    transliteration:
      "Amsayna wa amsal-mulku lillah, wal-hamdu lillah. La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",
    translation:
      "We have reached the evening and all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner. To Him belong all sovereignty and praise, and He is over all things omnipotent. My Lord, I ask You for the good of this night and what follows it, and I take refuge in You from the evil of this night and what follows it. My Lord, I take refuge in You from laziness, senility, torment in the Fire, and punishment in the grave.",
  },
  "hisn-78": {
    arabic:
      "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
    transliteration:
      "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir.",
    translation:
      "O Allah, by You we enter the evening and by You we enter the morning; by You we live and by You we die, and to You is the return.",
  },
  "hisn-80": {
    arabic:
      "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ.",
    transliteration:
      "Allahumma inni amsaytu ushhiduka, wa ushhidu hamalata 'arshika, wa mala'ikataka, wa jami'a khalqika, annaka Antallahu la ilaha illa Anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa rasuluk.",
    translation:
      "O Allah, I have reached the evening and call You, the bearers of Your Throne, Your angels, and all Your creation to witness that You are Allah; none has the right to be worshipped except You alone, without partner, and Muhammad is Your servant and Messenger.",
  },
  "hisn-81": {
    arabic:
      "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
    transliteration:
      "Allahumma ma amsa bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu wa lakash-shukr.",
    translation:
      "O Allah, whatever blessing I or any of Your creation have entered the evening with is from You alone, without partner; all praise and thanks belong to You.",
  },
  "hisn-89": {
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ: فَتْحَهَا، وَنَصْرَهَا، وَنورَهَا، وَبَرَكَتَهَا، وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا.",
    transliteration:
      "Amsayna wa amsal-mulku lillahi Rabbil-'alamin. Allahumma inni as'aluka khayra hadhihil-laylati: fathaha, wa nasraha, wa nuraha, wa barakataha, wa hudaha, wa a'udhu bika min sharri ma fiha wa sharri ma ba'daha.",
    translation:
      "We have reached the evening and all sovereignty belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this night: its triumph, victory, light, blessing, and guidance. I take refuge in You from the evil within it and the evil that follows it.",
  },
  "hisn-90": {
    arabic:
      "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ.",
    transliteration:
      "Amsayna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammad, wa 'ala millati abina Ibrahim, hanifan musliman wa ma kana minal-mushrikin.",
    translation:
      "We have reached the evening upon the natural religion of Islam, the word of sincere faith, the religion of our Prophet Muhammad, and the way of our father Ibrahim, who was upright, Muslim, and not among those who associate partners with Allah.",
  },
};

const buildFeaturedCategory = (
  id: string,
  name: string,
  arabicName: string,
  entryNumbers: Set<number>,
  variants: Record<string, Partial<AdhkarEntry>>,
  accent: string,
  soft: string,
  border: string,
): AdhkarCategory => {
  const entries = morningAndEvening.entries
    .filter((entry) => entryNumbers.has(entryNumber(entry)))
    .map((entry) => ({ ...entry, ...variants[entry.id] }));

  return {
    id,
    chapterNumber: morningAndEvening.chapterNumber,
    group: "daily",
    name,
    arabicName,
    description: `${entries.length} verified invocations for this time of day.`,
    accent,
    soft,
    border,
    entries,
  };
};

export const FEATURED_ADHKAR_CATEGORIES = [
  buildFeaturedCategory(
    "featured-morning",
    "Morning Adhkar",
    "أذكار الصباح",
    MORNING_ENTRY_NUMBERS,
    MORNING_VARIANTS,
    "#d97706",
    "#fffbeb",
    "#fde68a",
  ),
  buildFeaturedCategory(
    "featured-evening",
    "Evening Adhkar",
    "أذكار المساء",
    EVENING_ENTRY_NUMBERS,
    EVENING_VARIANTS,
    "#4f46e5",
    "#eef2ff",
    "#c7d2fe",
  ),
];

export const ALL_ADHKAR_CATEGORIES = [
  ...FEATURED_ADHKAR_CATEGORIES,
  ...ADHKAR_CATEGORIES,
];

export const ADHKAR_TOTAL_ENTRIES = ADHKAR_CATEGORIES.reduce(
  (total, category) => total + category.entries.length,
  0,
);

const LATIN_ISLAMIC_SUBJECT_KEYWORD =
  /(^|[^a-z])(?:islam(?:ic|i(?:a|at|yat|yah|yyah)?)?|religious)(?=$|[^a-z])/i;
const ARABIC_ISLAMIC_SUBJECT_KEYWORD =
  /(^|[^\u0621-\u064a])(?:ال)?(?:اسلام(?:ي(?:ة|ه|ك|ات)?)?|دين(?:ي(?:ة|ه)?)?)(?=$|[^\u0621-\u064a])/;

export const isIslamicSubjectName = (value?: string | null) => {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0640\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLowerCase();

  return (
    LATIN_ISLAMIC_SUBJECT_KEYWORD.test(normalized) ||
    ARABIC_ISLAMIC_SUBJECT_KEYWORD.test(normalized)
  );
};
