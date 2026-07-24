export type AdhkarEntry = {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  source: string;
};

export type AdhkarCategory = {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  accent: string;
  soft: string;
  border: string;
  entries: AdhkarEntry[];
};

export const isIslamicSubjectName = (value?: string | null) =>
  /islam|islamiat|islamic/i.test(String(value || ""));

const sayyidAlIstighfar: AdhkarEntry = {
  id: "sayyid-al-istighfar",
  title: "The master supplication for forgiveness",
  arabic:
    "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
  transliteration:
    "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika alayya, wa abu'u bidhanbi, faghfir li fa innahu la yaghfirudh-dhunuba illa ant.",
  translation:
    "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I remain faithful to Your covenant and promise as much as I can. I seek refuge in You from the evil I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for no one forgives sins except You.",
  target: 1,
  source: "Sahih al-Bukhari 6306",
};

const protectionByName: AdhkarEntry = {
  id: "protection-by-allahs-name",
  title: "Protection by Allah's name",
  arabic:
    "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
  transliteration:
    "Bismillahil-ladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-Alim.",
  translation:
    "In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
  target: 3,
  source: "Abu Dawud 5088",
};

const praiseOneHundred: AdhkarEntry = {
  id: "subhanallahi-wa-bihamdih",
  title: "Glorify and praise Allah",
  arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
  transliteration: "SubhanAllahi wa bihamdih.",
  translation: "Glory and praise belong to Allah.",
  target: 100,
  source: "Sahih Muslim 2692",
};

export const ADHKAR_CATEGORIES: AdhkarCategory[] = [
  {
    id: "morning",
    name: "Morning Adhkar",
    arabicName: "أذكار الصباح",
    description: "Begin the day with remembrance, gratitude, and protection.",
    accent: "#d97706",
    soft: "#fffbeb",
    border: "#fde68a",
    entries: [
      {
        id: "morning-kingdom",
        title: "We have entered the morning",
        arabic:
          "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ. رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        transliteration:
          "Asbahna wa asbahal-mulku lillah, walhamdu lillah. La ilaha illAllahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhal-yawmi wa khayra ma ba'dah, wa a'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba'dah. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min adhabin fin-nari wa adhabin fil-qabr.",
        translation:
          "We have entered the morning and all sovereignty belongs to Allah. Praise belongs to Allah. None has the right to be worshipped except Allah alone, without partner. To Him belong sovereignty and praise, and He is able to do all things. My Lord, I ask You for the good of this day and what follows it, and seek refuge in You from its evil and what follows it. I seek refuge in You from laziness, the difficulties of old age, punishment in the Fire, and punishment in the grave.",
        target: 1,
        source: "Sahih Muslim 2723",
      },
      {
        id: "morning-by-you",
        title: "By You we enter the morning",
        arabic:
          "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration:
          "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilaykan-nushur.",
        translation:
          "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
        target: 1,
        source: "At-Tirmidhi 3391",
      },
      { ...sayyidAlIstighfar, id: "morning-sayyid-al-istighfar" },
      { ...protectionByName, id: "morning-protection-by-name" },
      { ...praiseOneHundred, id: "morning-subhanallahi-wa-bihamdih" },
    ],
  },
  {
    id: "evening",
    name: "Evening Adhkar",
    arabicName: "أذكار المساء",
    description: "Close the day with trust, protection, and praise.",
    accent: "#4f46e5",
    soft: "#eef2ff",
    border: "#c7d2fe",
    entries: [
      {
        id: "evening-kingdom",
        title: "We have entered the evening",
        arabic:
          "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ. رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        transliteration:
          "Amsayna wa amsal-mulku lillah, walhamdu lillah. La ilaha illAllahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa ala kulli shay'in qadir. Rabbi as'aluka khayra ma fi hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min adhabin fin-nari wa adhabin fil-qabr.",
        translation:
          "We have entered the evening and all sovereignty belongs to Allah. Praise belongs to Allah. None has the right to be worshipped except Allah alone, without partner. To Him belong sovereignty and praise, and He is able to do all things. My Lord, I ask You for the good of this night and what follows it, and seek refuge in You from its evil and what follows it. I seek refuge in You from laziness, the difficulties of old age, punishment in the Fire, and punishment in the grave.",
        target: 1,
        source: "Sahih Muslim 2723",
      },
      {
        id: "evening-by-you",
        title: "By You we enter the evening",
        arabic:
          "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        transliteration:
          "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namut, wa ilaykal-masir.",
        translation:
          "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the final return.",
        target: 1,
        source: "At-Tirmidhi 3391",
      },
      { ...sayyidAlIstighfar, id: "evening-sayyid-al-istighfar" },
      {
        id: "evening-perfect-words",
        title: "Refuge in Allah's perfect words",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
        translation: "I seek refuge in Allah's perfect words from the evil of what He created.",
        target: 3,
        source: "Sahih Muslim 2709",
      },
      { ...praiseOneHundred, id: "evening-subhanallahi-wa-bihamdih" },
    ],
  },
  {
    id: "sleep",
    name: "Sleeping Adhkar",
    arabicName: "أذكار النوم",
    description: "Remembrances to recite as you settle for the night.",
    accent: "#7c3aed",
    soft: "#f5f3ff",
    border: "#ddd6fe",
    entries: [
      {
        id: "sleep-lie-down",
        title: "When lying down",
        arabic:
          "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
        transliteration:
          "Bismika Rabbi wada'tu janbi, wa bika arfa'uh. Fa in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi ibadakas-salihin.",
        translation:
          "In Your name, my Lord, I lie down and in Your name I rise. If You take my soul, have mercy upon it; and if You return it, protect it as You protect Your righteous servants.",
        target: 1,
        source: "Sahih al-Bukhari 6320; Sahih Muslim 2714",
      },
      {
        id: "sleep-soul",
        title: "Entrusting the soul to Allah",
        arabic:
          "اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
        transliteration:
          "Allahumma khalaqta nafsi wa anta tawaffaha, laka mamatuha wa mahyaha. In ahyaytaha fahfazha, wa in amattaha faghfir laha. Allahumma inni as'alukal-afiyah.",
        translation:
          "O Allah, You created my soul and You take it in death. Its death and life belong to You. If You keep it alive, protect it; and if You cause it to die, forgive it. O Allah, I ask You for well-being.",
        target: 1,
        source: "Sahih Muslim 2712",
      },
      {
        id: "sleep-protection",
        title: "Protection on the Day of Resurrection",
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini adhabaka yawma tab'athu ibadak.",
        translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
        target: 3,
        source: "Abu Dawud 5045",
      },
      {
        id: "sleep-live-die",
        title: "In Your name I die and live",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya.",
        translation: "In Your name, O Allah, I die and I live.",
        target: 1,
        source: "Sahih al-Bukhari 6324",
      },
    ],
  },
  {
    id: "waking",
    name: "Waking Up",
    arabicName: "أذكار الاستيقاظ",
    description: "Start a new day by thanking Allah for life and well-being.",
    accent: "#ea580c",
    soft: "#fff7ed",
    border: "#fed7aa",
    entries: [
      {
        id: "waking-life",
        title: "Praise for renewed life",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
        translation:
          "Praise belongs to Allah Who gave us life after causing us to die, and to Him is the resurrection.",
        target: 1,
        source: "Sahih al-Bukhari 6312",
      },
      {
        id: "waking-health",
        title: "Praise for health and remembrance",
        arabic:
          "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ",
        transliteration:
          "Alhamdu lillahil-ladhi afani fi jasadi, wa radda alayya ruhi, wa adhina li bidhikrih.",
        translation:
          "Praise belongs to Allah Who restored health to my body, returned my soul to me, and permitted me to remember Him.",
        target: 1,
        source: "At-Tirmidhi 3401",
      },
    ],
  },
  {
    id: "travel",
    name: "Traveling Adhkar",
    arabicName: "أذكار السفر",
    description: "Supplications for departure, the journey, and a safe return.",
    accent: "#0284c7",
    soft: "#f0f9ff",
    border: "#bae6fd",
    entries: [
      {
        id: "travel-vehicle",
        title: "When beginning a journey",
        arabic:
          "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى. اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ. اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ",
        transliteration:
          "Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun. Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-amali ma tarda. Allahumma hawwin alayna safarana hadha watwi anna bu'dah. Allahumma Antas-sahibu fis-safar, wal-khalifatu fil-ahl. Allahumma inni a'udhu bika min wa'tha'is-safar, wa ka'abatil-manzar, wa su'il-munqalabi fil-mali wal-ahl.",
        translation:
          "Allah is the Greatest. Glory belongs to the One Who placed this at our service, though we could not have mastered it ourselves, and surely to our Lord we will return. O Allah, we ask You on this journey for righteousness, mindfulness of You, and deeds that please You. Make this journey easy and shorten its distance. You are our Companion on the journey and the Guardian of our family. I seek refuge in You from the journey's hardship, a distressing sight, and an unhappy return concerning family or wealth.",
        target: 1,
        source: "Sahih Muslim 1342",
      },
      {
        id: "travel-return",
        title: "When returning from travel",
        arabic:
          "آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ",
        transliteration: "Ayibuna, ta'ibuna, abiduna, li Rabbina hamidun.",
        translation: "We return repentant, worshipping and praising our Lord.",
        target: 1,
        source: "Sahih Muslim 1342",
      },
    ],
  },
  {
    id: "home",
    name: "Home Adhkar",
    arabicName: "أذكار المنزل",
    description: "Remember Allah when leaving and entering home.",
    accent: "#059669",
    soft: "#ecfdf5",
    border: "#a7f3d0",
    entries: [
      {
        id: "home-leaving",
        title: "When leaving home",
        arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        transliteration: "Bismillah, tawakkaltu alAllah, la hawla wa la quwwata illa billah.",
        translation:
          "In the name of Allah, I place my trust in Allah. There is no might and no power except with Allah.",
        target: 1,
        source: "Abu Dawud 5095",
      },
      {
        id: "home-entering",
        title: "When entering home",
        arabic:
          "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
        transliteration:
          "Bismillahi walajna, wa bismillahi kharajna, wa ala Rabbina tawakkalna.",
        translation:
          "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.",
        target: 1,
        source: "Abu Dawud 5096",
      },
    ],
  },
  {
    id: "food",
    name: "Food & Drink",
    arabicName: "أذكار الطعام",
    description: "Simple remembrances before and after eating.",
    accent: "#c2410c",
    soft: "#fff7ed",
    border: "#fed7aa",
    entries: [
      {
        id: "food-beginning",
        title: "Before eating",
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah.",
        translation: "In the name of Allah.",
        target: 1,
        source: "Sahih al-Bukhari 5376; Sahih Muslim 2022",
      },
      {
        id: "food-finished",
        title: "After eating",
        arabic:
          "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        transliteration:
          "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
        translation:
          "Praise belongs to Allah Who fed me this and provided it for me without any power or strength from me.",
        target: 1,
        source: "Abu Dawud 4023; At-Tirmidhi 3458",
      },
    ],
  },
  {
    id: "mosque",
    name: "Mosque Adhkar",
    arabicName: "أذكار المسجد",
    description: "Supplications for entering and leaving the mosque.",
    accent: "#0f766e",
    soft: "#f0fdfa",
    border: "#99f6e4",
    entries: [
      {
        id: "mosque-entering",
        title: "When entering the mosque",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Allahumma-ftah li abwaba rahmatik.",
        translation: "O Allah, open for me the gates of Your mercy.",
        target: 1,
        source: "Sahih Muslim 713",
      },
      {
        id: "mosque-leaving",
        title: "When leaving the mosque",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        transliteration: "Allahumma inni as'aluka min fadlik.",
        translation: "O Allah, I ask You from Your bounty.",
        target: 1,
        source: "Sahih Muslim 713",
      },
    ],
  },
  {
    id: "after-prayer",
    name: "After Prayer",
    arabicName: "أذكار بعد الصلاة",
    description: "Keep count of the established remembrances after prayer.",
    accent: "#2563eb",
    soft: "#eff6ff",
    border: "#bfdbfe",
    entries: [
      {
        id: "prayer-forgiveness",
        title: "Seek forgiveness",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        transliteration: "Astaghfirullah.",
        translation: "I seek Allah's forgiveness.",
        target: 3,
        source: "Sahih Muslim 591",
      },
      {
        id: "prayer-peace",
        title: "Allah is the source of peace",
        arabic:
          "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        transliteration:
          "Allahumma Antas-Salam, wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
        translation:
          "O Allah, You are Peace and from You comes peace. Blessed are You, Owner of majesty and honour.",
        target: 1,
        source: "Sahih Muslim 591",
      },
      {
        id: "prayer-subhanallah",
        title: "Glorify Allah",
        arabic: "سُبْحَانَ اللَّهِ",
        transliteration: "SubhanAllah.",
        translation: "Glory belongs to Allah.",
        target: 33,
        source: "Sahih Muslim 597",
      },
      {
        id: "prayer-alhamdulillah",
        title: "Praise Allah",
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alhamdulillah.",
        translation: "Praise belongs to Allah.",
        target: 33,
        source: "Sahih Muslim 597",
      },
      {
        id: "prayer-allahu-akbar",
        title: "Magnify Allah",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        target: 34,
        source: "Sahih Muslim 596",
      },
    ],
  },
  {
    id: "worry",
    name: "Worry & Relief",
    arabicName: "أذكار الهم والفرج",
    description: "Turn to Allah during worry, sadness, and distress.",
    accent: "#be123c",
    soft: "#fff1f2",
    border: "#fecdd3",
    entries: [
      {
        id: "worry-grief",
        title: "Refuge from worry and sadness",
        arabic:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        transliteration:
          "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",
        translation:
          "O Allah, I seek refuge in You from worry and sadness, weakness and laziness, miserliness and cowardice, the burden of debt, and being overpowered by others.",
        target: 1,
        source: "Sahih al-Bukhari 6369",
      },
      {
        id: "worry-yunus",
        title: "The supplication of Prophet Yunus",
        arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        transliteration: "La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin.",
        translation:
          "There is no deity worthy of worship except You. Glory belongs to You. I was truly among the wrongdoers.",
        target: 1,
        source: "Qur'an 21:87; At-Tirmidhi 3505",
      },
    ],
  },
];
