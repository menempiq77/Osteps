import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const hajj: CourseLesson = {
  slug: "g9y10-hajj",
  name: { en: "Hajj", ar: "الحَجّ" },
  shortIntro: {
    en: "Hajj is the fifth pillar of Islam — the pilgrimage to the Sacred House, obligatory once in a lifetime upon those who are able. This lesson studies its meaning, rank, and great virtues, its essential rites, and the profound lessons it teaches.",
    ar: "الحَجُّ خامِسُ أركانِ الإسلام — قَصدُ البَيتِ الحَرام، فَريضةٌ مَرّةً في العُمُرِ على المُستَطيع. يَدرُسُ هذا الدَّرسُ مَعناهُ ومَكانَتَهُ وفَضائِلَهُ العَظيمة، ومَناسِكَهُ الأساسيّة، ودُروسَهُ العَميقة.",
  },
  quranSurahs: ["Al-'Imran 96-97", "Al-Hajj 27-28", "Al-Baqarah 197"],
  sections: [
    {
      title: { en: "The fifth pillar and its virtues", ar: "الرُّكنُ الخامِسُ وفَضائِلُه" },
      learningObjectives: [
        { en: "Explain the meaning, rank, and obligation of Hajj.", ar: "أشرَحُ مَعنى الحَجِّ ومَكانَتَهُ ووُجوبَه." },
        { en: "Describe the great virtues of an accepted Hajj.", ar: "أصِفُ فَضائِلَ الحَجِّ المَبرور." },
      ],
      successCriteria: [
        { en: "I can state Hajj is the fifth pillar, once in a lifetime for the able.", ar: "أُقَرِّرُ أنَّ الحَجَّ الرُّكنُ الخامِس، مَرّةً لِلمُستَطيع." },
        { en: "I can quote the reward of an accepted Hajj.", ar: "أذكُرُ جَزاءَ الحَجِّ المَبرور." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "The Sacred Mosque — the destination of the pilgrims.", ar: "المَسجِدُ الحَرام — مَقصِدُ الحُجّاج." },
        caption: { en: "'Pilgrimage to the House is a duty owed to Allah by those who can' (Al-'Imran 97).", ar: "﴿ولِلهِ على النّاسِ حِجُّ البَيتِ مَنِ استَطاعَ﴾ (آل عمران ٩٧)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why does Hajt gather all humanity in one place and dress?", ar: "لِمَ يَجمَعُ الحَجُّ النّاسَ في مَكانٍ ولِباسٍ واحِد؟" },
        body: {
          en: "On Hajj, millions of people from every nation, race, and class shed their ordinary clothes and wealth, dress in simple white garments, and stand together in one place calling on one Lord. Reflect: what profound truths about equality, brotherhood, and the human being's standing before Allah does this magnificent scene teach?",
          ar: "في الحَجّ، يَخلَعُ مَلايينُ النّاسِ مِن كُلِّ أُمّةٍ وعِرقٍ وطَبَقةٍ ثيابَهُم وأموالَهُم، يَلبَسونَ بَياضًا بَسيطًا، ويَقِفونَ معًا في مَكانٍ واحِدٍ يُلَبّونَ رَبًّا واحِدًا. تَأمَّل: أيَّ حَقائِقَ عَميقةٍ عنِ المُساواةِ والأُخُوّةِ ومَوقِفِ الإنسانِ بَينَ يَدَيِ اللهِ يُعَلِّمُها هذا المَشهَدُ العَظيم؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key term", ar: "مُصطَلَح" },
          lines: [
            { en: "Hajj (الحَجّ): linguistically 'to intend/head toward'; the pilgrimage to the Sacred House.", ar: "الحَجّ: لُغةً «القَصد»؛ قَصدُ البَيتِ الحَرامِ لِأداءِ المَناسِك." },
          ],
        },
        {
          label: { en: "Rank", ar: "المَكانة" },
          lines: [
            { en: "The fifth pillar of Islam, obligatory once in a lifetime for the able.", ar: "الرُّكنُ الخامِس، واجِبٌ مَرّةً في العُمُرِ لِلمُستَطيع." },
          ],
        },
      ],
      body: {
        en: "Hajj is the fifth and final pillar of Islam, a magnificent act of worship that combines worship of the body, the wealth, and the heart, and which gathers Muslims from every corner of the earth in the holiest place on earth. The word 'Hajj' in Arabic means 'to head toward' or 'to intend a noble destination,' and in the religion it means heading to the Sacred House of Allah, the Ka'bah in Makkah, at a specified time, to perform specified rites of worship in a specified manner. The Prophet ﷺ named it among the five pillars: 'Islam is built upon five: the testimony of faith, establishing the prayer, giving the zakat, fasting Ramadan, and the pilgrimage to the House for whoever is able to find a way to it' (Bukhari and Muslim). Allah made Hajj obligatory in His clear command: 'And pilgrimage to the House is a duty owed to Allah by those people who are able to find a way there. But whoever disbelieves — then indeed, Allah is free from need of the worlds' (Al-'Imran 97). From this verse, the scholars derive that Hajj is obligatory upon every Muslim who is adult, sane, free, and able — and ability (istita'ah) includes physical health and strength, sufficient wealth to make the journey and provide for one's dependents during one's absence, and a safe route. Hajj is obligatory only once in a person's lifetime; anything beyond that is voluntary and a means of even greater reward. The obligation is not to be delayed without excuse by the one who is able, for the Prophet ﷺ urged believers to hasten to perform it, since no one knows what may prevent him in the future.\n\nThe Ka'bah, toward which the pilgrims journey, is the most honoured place on earth and holds a special status in the history of faith. Allah describes it: 'Indeed, the first House established for mankind was that at Bakkah [Makkah] — blessed and a guidance for the worlds. In it are clear signs, the standing place of Ibrahim. And whoever enters it shall be safe' (Al-'Imran 96-97). It was built, by Allah's command, by the Prophet Ibrahim and his son Isma'il, peace be upon them, who raised its foundations praying: 'Our Lord, accept this from us. Indeed, You are the Hearing, the Knowing' (Al-Baqarah 127). And it was Ibrahim who, by Allah's command, called all of humanity to the pilgrimage: 'And proclaim to the people the Hajj; they will come to you on foot and on every lean camel; they will come from every distant pass' (Al-Hajj 27). The Hajj, therefore, is not a new institution but the revival of the ancient way of Ibrahim, the father of the prophets, and a journey that connects the believer to the very roots of monotheism. The Prophet Muhammad ﷺ performed Hajj once, in the tenth year after the Hijrah — his famous Farewell Pilgrimage — and taught the believers its rites in detail, saying: 'Take from me your rites of Hajj' (Muslim).\n\nThe virtues and rewards of Hajj are immense, reflecting the greatness of this act of worship and the hardship and devotion it requires. The Prophet ﷺ said: 'Whoever performs Hajj for the sake of Allah and does not commit any obscenity or wrongdoing returns [free of sin] like the day his mother bore him' (Bukhari and Muslim) — meaning the accepted Hajj wipes away all previous sins, so that the pilgrim returns purified as a newborn. He ﷺ also said: 'The accepted Hajj (al-hajj al-mabrur) has no reward except Paradise' (Bukhari and Muslim), and when asked which deeds are best, he listed 'an accepted Hajj' among the greatest (Bukhari). He described Hajj as a form of jihad for the weak, the elderly, and women, and taught that the pilgrims are 'the delegation of Allah' — He called them, they responded, they ask of Him, and He gives them. Every step of the journey, every difficulty endured, and every rite performed with sincerity brings immense reward. The 'accepted Hajj' (mabrur) that earns Paradise is the one performed sincerely for Allah alone, with lawful wealth, in accordance with the Sunnah, free of sin and disobedience, and followed by a life of greater righteousness. This is why Hajj is the dream and longing of every believer, and why those who are blessed to perform it describe it as the most moving and transformative experience of their lives. In the next section we examine the essential rites of Hajj and the profound lessons each of them teaches.",
        ar: "الحَجُّ خامِسُ أركانِ الإسلامِ وآخِرُها، عِبادةٌ عَظيمةٌ تَجمَعُ عِبادةَ البَدَنِ والمالِ والقَلب، وتَجمَعُ المُسلِمينَ مِن كُلِّ بِقاعِ الأرضِ في أقدَسِ مَكانٍ علَيها. وكَلِمةُ «الحَجّ» في العَرَبيّةِ تَعني «القَصد» أو «قَصدَ الوِجهةِ الشَّريفة»، وفي الدّينِ قَصدُ بَيتِ اللهِ الحَرام، الكَعبةِ في مَكّة، في زَمَنٍ مَخصوص، لِأداءِ مَناسِكَ مَخصوصةٍ على وَجهٍ مَخصوص. وقد عَدَّهُ النَّبِيُّ ﷺ مِنَ الأركانِ الخَمسة: «بُنيَ الإسلامُ على خَمس: شَهادةِ التَّوحيد، وإقامِ الصَّلاة، وإيتاءِ الزَّكاة، وصَومِ رَمَضان، وحَجِّ البَيتِ لِمَنِ استَطاعَ إلَيهِ سَبيلًا» (البخاري ومسلم). وفَرَضَ اللهُ الحَجَّ في أمرِهِ الواضِح: ﴿ولِلهِ على النّاسِ حِجُّ البَيتِ مَنِ استَطاعَ إلَيهِ سَبيلًا، ومَن كَفَرَ فَإنَّ اللهَ غَنيٌّ عنِ العالَمين﴾ (آل عمران ٩٧). ومِن هذه الآيةِ استَنبَطَ العُلَماءُ أنَّ الحَجَّ واجِبٌ على كُلِّ مُسلِمٍ بالِغٍ عاقِلٍ حُرٍّ مُستَطيع — والاستِطاعةُ تَشمَلُ صِحّةَ البَدَنِ وقُوَّتَه، والمالَ الكافيَ لِلسَّفَرِ ولِنَفَقةِ مَن يَعولُ في غيابِه، وأمنَ الطَّريق. والحَجُّ واجِبٌ مَرّةً واحِدةً في العُمُر؛ وما زادَ فَتَطَوُّعٌ وأجرٌ أعظَم. ولا يَنبَغي لِلمُستَطيعِ تَأخيرُهُ بِلا عُذر، فَقد حَثَّ النَّبِيُّ ﷺ على المُبادَرةِ إلَيه، إذ لا يَدري المَرءُ ما يَعرِضُ لَهُ في المُستَقبَل.\n\nوالكَعبةُ، التي يَقصِدُها الحُجّاج، أشرَفُ بُقعةٍ على الأرضِ ولَها مَكانةٌ خاصّةٌ في تاريخِ الإيمان. يَصِفُها الله: ﴿إنَّ أوَّلَ بَيتٍ وُضِعَ لِلنّاسِ لَلَّذي بِبَكّةَ مُبارَكًا وهُدًى لِلعالَمين، فيهِ آياتٌ بَيِّناتٌ مَقامُ إبراهيم، ومَن دَخَلَهُ كانَ آمِنًا﴾ (آل عمران ٩٦-٩٧). بَناها بِأمرِ اللهِ النَّبِيُّ إبراهيمُ وابنُهُ إسماعيلُ علَيهِما السَّلام، رَفَعا قَواعِدَها داعِيَين: ﴿رَبَّنا تَقَبَّل مِنّا إنَّكَ أنتَ السَّميعُ العَليم﴾ (البقرة ١٢٧). وإبراهيمُ هو الذي، بِأمرِ الله، دَعا النّاسَ كافّةً إلى الحَجّ: ﴿وأذِّن في النّاسِ بِالحَجِّ يَأتوكَ رِجالًا وعلى كُلِّ ضامِرٍ يَأتينَ مِن كُلِّ فَجٍّ عَميق﴾ (الحَجّ ٢٧). فالحَجُّ إذَن لَيسَ شَعيرةً جَديدةً بل إحياءٌ لِمِلّةِ إبراهيمَ أبي الأنبياء، ورِحلةٌ تَصِلُ المُؤمِنَ بِجُذورِ التَّوحيدِ نَفسِها. وحَجَّ النَّبِيُّ مُحَمَّدٌ ﷺ مَرّةً واحِدة، في السَّنةِ العاشِرةِ لِلهِجرة — حِجّةَ الوَداعِ المَشهورة — وعَلَّمَ المُؤمِنينَ مَناسِكَها بِالتَّفصيل، فَقال: «خُذوا عَنّي مَناسِكَكُم» (مسلم).\n\nوفَضائِلُ الحَجِّ وأجورُهُ عَظيمة، تَعكِسُ عَظَمةَ هذه العِبادةِ وما تَتَطَلَّبُهُ مِن مَشَقّةٍ وتَفانٍ. قالَ النَّبِيُّ ﷺ: «مَن حَجَّ لِلهِ فَلَم يَرفُث ولَم يَفسُق رَجَعَ كَيَومِ وَلَدَتهُ أُمُّه» (البخاري ومسلم) — أيِ الحَجُّ المَقبولُ يَمحو الذُّنوبَ السّابِقةَ كُلَّها، فَيَعودُ الحاجُّ نَقيًّا كَالمَولودِ الجَديد. وقالَ ﷺ: «الحَجُّ المَبرورُ لَيسَ لَهُ جَزاءٌ إلّا الجَنّة» (البخاري ومسلم)، ولَمّا سُئِلَ عن أفضَلِ الأعمالِ عَدَّ «حَجًّا مَبرورًا» مِن أعظَمِها (البخاري). ووَصَفَ الحَجَّ بِأنَّهُ جِهادُ الضَّعيفِ والكَبيرِ والمَرأة، وعَلَّمَ أنَّ الحُجّاجَ «وَفدُ الله» — دَعاهُم فَأجابوا، ويَسألونَهُ فَيُعطيهِم. فَكُلُّ خُطوةٍ في الرِّحلة، وكُلُّ مَشَقّةٍ تُحتَمَل، وكُلُّ نُسُكٍ يُؤَدّى بِإخلاصٍ يَجلِبُ أجرًا عَظيمًا. والحَجُّ «المَبرور» الذي يَستَحِقُّ الجَنّةَ هو ما أُدّيَ خالِصًا لِلهِ وَحدَه، بِمالٍ حَلال، على وَفقِ السُّنّة، نَقيًّا مِنَ الإثمِ والمَعصية، يَتبَعُهُ صَلاحٌ أعظَمُ في الحَياة. ولِهذا كانَ الحَجُّ حُلمَ كُلِّ مُؤمِنٍ وشَوقَه، ولِهذا يَصِفُهُ مَن وُفِّقَ لِأدائِهِ بِأنَّهُ أعظَمُ تَجارِبِ حَياتِهِ وأبلَغُها أثَرًا. وفي القِسمِ التّالي نَتَناوَلُ مَناسِكَ الحَجِّ الأساسيّةَ والدُّروسَ العَميقةَ التي يُعَلِّمُها كُلٌّ مِنها.",
      },
    },
    {
      title: { en: "The rites of Hajj and their lessons", ar: "مَناسِكُ الحَجِّ ودُروسُها" },
      learningObjectives: [
        { en: "Describe the essential rites of Hajj in order.", ar: "أصِفُ مَناسِكَ الحَجِّ الأساسيّةَ مُرَتَّبة." },
        { en: "Explain the spiritual lessons of the rites.", ar: "أشرَحُ الدُّروسَ الرّوحيّةَ لِلمَناسِك." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "A mountain at dawn — the standing at 'Arafah, the greatest day.", ar: "جَبَلٌ عِندَ الفَجر — الوُقوفُ بِعَرَفة، أعظَمُ الأيّام." },
        caption: { en: "'Hajj is 'Arafah' (Tirmidhi) — the greatest pillar of the pilgrimage.", ar: "«الحَجُّ عَرَفة» (التِّرمذي) — أعظَمُ أركانِ الحَجّ." },
      },
      groupTasks: {
        title: { en: "The journey of a lifetime", ar: "رِحلةُ العُمُر" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "the-rites-in-order",
            name: { en: "Team A — The rites of Hajj in order", ar: "الفَريقُ أ — مَناسِكُ الحَجِّ مُرَتَّبة" },
            learningObjective: { en: "Map the main rites of Hajj clearly.", ar: "نَرسُمُ مَناسِكَ الحَجِّ الرَّئيسةَ بِوُضوح." },
            task: { en: "Create a clear map of the main rites of Hajj: entering ihram (the white garments and the intention) with the talbiyah ('Labbayk Allahumma labbayk'); tawaf (circling the Ka'bah seven times); sa'i (walking between Safa and Marwah); standing at 'Arafah on the 9th of Dhul-Hijjah (the greatest pillar); spending the night at Muzdalifah; stoning the pillars at Mina; the sacrifice ('Eid al-Adha); shaving/shortening the hair; and the farewell tawaf. Present a clear 'steps of Hajj' map with dates and places.", ar: "اصنَعوا خَريطةً واضِحةً لِمَناسِكِ الحَجِّ الرَّئيسة: الإحرامُ (لِباسُ البَياضِ والنِّيّة) معَ التَّلبية («لَبَّيكَ اللَّهُمَّ لَبَّيك»)؛ والطَّوافُ (حَولَ الكَعبةِ سَبعًا)؛ والسَّعيُ (بَينَ الصَّفا والمَروة)؛ والوُقوفُ بِعَرَفةَ في التّاسِعِ مِن ذي الحِجّة (أعظَمُ الأركان)؛ والمَبيتُ بِمُزدَلِفة؛ ورَميُ الجِمارِ بِمِنى؛ والهَديُ (عيدُ الأضحى)؛ والحَلقُ أوِ التَّقصير؛ وطَوافُ الوَداع. اعرِضوا خَريطةَ «خُطُواتِ الحَجّ» الواضِحةَ بِالتَّواريخِ والأماكِن." },
            evidence: [
              { en: "'Take from me your rites of Hajj' (Muslim); 'Hajj is 'Arafah' (Tirmidhi).", ar: "«خُذوا عَنّي مَناسِكَكُم» (مسلم)؛ «الحَجُّ عَرَفة» (التِّرمذي)." },
            ],
            sourceNotes: [
              { en: "Standing at 'Arafah is the greatest pillar of Hajj.", ar: "الوُقوفُ بِعَرَفةَ أعظَمُ أركانِ الحَجّ." },
            ],
            memberRoles: [
              { en: "Researcher, Mapper, Presenter.", ar: "الباحِث، راسِمُ الخَريطة، العارِض." },
            ],
            finalProduct: { en: "A 'steps of Hajj' map.", ar: "خَريطةُ «خُطُواتِ الحَجّ»." },
          },
          {
            slug: "lessons-of-hajj",
            name: { en: "Team B — The lessons of Hajj", ar: "الفَريقُ ب — دُروسُ الحَجّ" },
            learningObjective: { en: "Show the spiritual and social lessons of Hajj.", ar: "نُبَيِّنُ دُروسَ الحَجِّ الرّوحيّةَ والاجتِماعيّة." },
            task: { en: "Explore the great lessons of Hajj: equality and brotherhood (all in simple white ihram, no rich or poor, no race above another); sincerity and tawhid (the talbiyah declares Allah alone); following the example of Ibrahim and his family (Hagar's sa'i, the sacrifice); remembrance of the Day of Judgement (the standing at 'Arafah resembles the gathering); patience and self-discipline; and unity of the Ummah from every nation. Connect each lesson to how a pilgrim returns changed. Present a 'lessons of Hajj' display.", ar: "استَكشِفوا دُروسَ الحَجِّ العَظيمة: المُساواةُ والأُخُوّة (الكُلُّ في إحرامٍ أبيَضَ بَسيط، لا غَنِيَّ ولا فَقير، لا عِرقَ فَوقَ عِرق)؛ والإخلاصُ والتَّوحيد (التَّلبيةُ تُعلِنُ اللهَ وَحدَه)؛ واتِّباعُ هَديِ إبراهيمَ وأهلِهِ (سَعيُ هاجَر، الهَدي)؛ وتَذَكُّرُ يَومِ القِيامة (الوُقوفُ بِعَرَفةَ يُشبِهُ الحَشر)؛ والصَّبرُ وضَبطُ النَّفس؛ ووَحدةُ الأُمّةِ مِن كُلِّ أُمّة. اربِطوا كُلَّ دَرسٍ بِكَيفَ يَعودُ الحاجُّ مُتَغَيِّرًا. اعرِضوا لَوحةَ «دُروسِ الحَجّ»." },
            evidence: [
              { en: "Al-Hajj 28: 'that they may witness benefits for themselves'.", ar: "الحَجّ ٢٨: ﴿لِيَشهَدوا مَنافِعَ لَهُم﴾." },
            ],
            sourceNotes: [
              { en: "Hajj unites the Ummah and revives Ibrahim's tawhid.", ar: "الحَجُّ يُوَحِّدُ الأُمّةَ ويُحيي تَوحيدَ إبراهيم." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'lessons of Hajj' display.", ar: "لَوحةُ «دُروسِ الحَجّ»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "My longing for the House", ar: "شَوقي إلى البَيت" },
        prompt: { en: "Hajj wipes away sins so the pilgrim returns pure as a newborn, and its only reward is Paradise. Reflect on what this journey means: standing in simple white among millions, equal before Allah; reliving the sacrifice and devotion of Ibrahim's family; standing at 'Arafah as if on the Day of Judgement. Even before you are able to go, how can the meanings of Hajj — sincerity, equality, brotherhood, remembrance of the Hereafter — shape your life now? Write about what you most long to experience in Hajj and one lesson of Hajj you will live by today.", ar: "الحَجُّ يَمحو الذُّنوبَ فَيَعودُ الحاجُّ نَقيًّا كَالمَولود، وجَزاؤُهُ الجَنّة. تَأمَّل ما تَعنيهِ هذه الرِّحلة: الوُقوفُ في بَياضٍ بَسيطٍ بَينَ المَلايين، سَواءً بَينَ يَدَيِ الله؛ وإحياءُ تَضحيةِ آلِ إبراهيمَ وتَفانيهِم؛ والوُقوفُ بِعَرَفةَ كَأنَّكَ في يَومِ القِيامة. وحَتّى قَبلَ أن تَستَطيعَ الذَّهاب، كَيفَ تُشَكِّلُ مَعاني الحَجِّ — الإخلاصُ والمُساواةُ والأُخُوّةُ وذِكرُ الآخِرة — حَياتَكَ الآن؟ اكتُب أكثَرَ ما تَشتاقُ أن تَعيشَهُ في الحَجّ، ودَرسًا واحِدًا مِنَ الحَجِّ سَتَحيا بِهِ اليَوم." },
        placeholder: { en: "What I most long for in Hajj is... The meanings of Hajj that shape me now are... One lesson I will live by today is...", ar: "أكثَرُ ما أشتاقُ إلَيهِ في الحَجّ... ومَعاني الحَجِّ التي تُشَكِّلُني الآن... ودَرسٌ سَأحيا بِهِ اليَوم..." },
      },
      body: {
        en: "The rites of Hajj are a series of profound acts of worship, each performed at a specific place and time, each rich with meaning and lessons, and all of them following the example taught by the Prophet ﷺ, who said, 'Take from me your rites of Hajj.' The pilgrimage begins with entering the state of ihram before reaching the sacred precincts: the pilgrim sheds his ordinary clothes and, if male, dons two simple unstitched white cloths, and makes the intention to begin the Hajj. From this moment, certain things become forbidden to him — cutting hair or nails, using perfume, hunting, and marital relations — and he begins to call out the talbiyah, the stirring proclamation of the pilgrim: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Indeed, all praise, grace, and dominion belong to You. You have no partner.' Upon reaching Makkah, the pilgrim performs tawaf, circling the Ka'bah seven times in devotion and remembrance, expressing that his whole life revolves around the worship of Allah. He then performs the sa'i, walking seven times between the hills of Safa and Marwah, reliving the desperate search of Hagar, the wife of Ibrahim, as she ran between these hills seeking water for her infant son Isma'il — until Allah caused the spring of Zamzam to gush forth. In this rite, the pilgrim relives a mother's faith and trust in Allah, and witnesses how Allah rewards reliance upon Him.\n\nThe greatest rite and the very pillar of Hajj is the standing at 'Arafah on the ninth day of Dhul-Hijjah. On this day, all the pilgrims gather on the vast plain of 'Arafah, standing before their Lord from midday until sunset, raising their hands in du'a, weeping, repenting, and beseeching Allah's forgiveness and mercy. The Prophet ﷺ declared the absolute centrality of this rite when he said, 'Hajj is 'Arafah' (Tirmidhi) — meaning that whoever misses the standing at 'Arafah has missed the Hajj. This day is the day of the greatest forgiveness; the Prophet ﷺ said that on no day does Allah free more people from the Fire than on the Day of 'Arafah, and that He draws near and boasts of the pilgrims to His angels. The immense gathering at 'Arafah, with millions standing humbled and equal before Allah, is a powerful reminder of the gathering of all humanity on the Day of Judgement. After sunset, the pilgrims move to Muzdalifah, where they spend the night under the open sky and gather pebbles. The next day is 'Eid al-Adha, on which the pilgrims stone the large pillar at Mina (re-enacting Ibrahim's rejection of Satan's temptation), offer the sacrifice (commemorating Ibrahim's willingness to sacrifice his son in obedience to Allah, and Allah's ransoming of Isma'il), and shave or shorten their hair, exiting the state of ihram. They then return to Makkah for the tawaf of Hajj, and over the following days at Mina continue the stoning of the pillars, before finally performing the farewell tawaf as they leave the Sacred House.\n\nBeyond their forms, the rites of Hajj are overflowing with profound lessons that transform the pilgrim and that every believer can learn from, for Allah says of the Hajj 'that they may witness benefits for themselves' (Al-Hajj 28). The first and most striking lesson is equality and human brotherhood: when millions of pilgrims shed their fine clothes and worldly distinctions and stand together in the same simple white garments, the king beside the pauper, every race and nation mingled together, all calling on the same Lord, the artificial barriers of wealth, status, and race dissolve, and the fundamental equality of all human beings before Allah is made visible in the most powerful way. The second lesson is sincere tawhid: the talbiyah, repeated throughout the journey, is a constant proclamation that Allah alone is worshipped and has no partner, purifying the pilgrim's faith. The third is the revival of the way of Ibrahim and his family — their faith, their sacrifice, their submission, and their reliance on Allah — connecting the pilgrim to the timeless legacy of pure monotheism. The fourth is the remembrance of the Hereafter: the white garments resemble the burial shroud, and the vast gathering at 'Arafah resembles the standing before Allah on the Day of Resurrection, awakening the pilgrim to prepare for that Day. The fifth is patience, self-discipline, and the mastery of desires, as the pilgrim endures hardship, crowds, and the restrictions of ihram for the sake of Allah. And the sixth is the unity of the Muslim Ummah, gathered from every corner of the earth, reminding the believers that despite their differences of language, nation, and colour, they are one community bound by one faith. The pilgrim who performs Hajj with sincerity and understanding returns not only forgiven of his sins but transformed in his heart — more conscious of Allah, more humble, more grateful, more attached to his brothers and sisters in faith, and more focused on the life to come. For the young Muslim today, even before he is able to make the journey, the meanings of Hajj — sincerity, equality, brotherhood, patience, and the remembrance of the Hereafter — are lessons to carry into his daily life, so that when Allah blesses him with the ability to answer the call of Ibrahim and stand before the Sacred House, his heart is already prepared for the journey of a lifetime.",
        ar: "مَناسِكُ الحَجِّ سِلسِلةٌ مِنَ العِباداتِ العَميقة، كُلٌّ يُؤَدّى في مَكانٍ وزَمَنٍ مَخصوص، كُلٌّ غَنيٌّ بِالمَعاني والدُّروس، وكُلُّها على هَديِ النَّبِيِّ ﷺ القائِل: «خُذوا عَنّي مَناسِكَكُم». يَبدَأُ الحَجُّ بِالإحرامِ قَبلَ بُلوغِ الحَرَم: يَخلَعُ الحاجُّ ثيابَهُ المُعتادة، ويَلبَسُ الرَّجُلُ ثَوبَينِ أبيَضَينِ غَيرَ مَخيطَين، ويَنوي البَدءَ بِالحَجّ. ومِن تِلكَ اللَّحظةِ تَحرُمُ علَيهِ أُمور — قَصُّ الشَّعرِ والأظفار، والطّيب، والصَّيد، والجِماع — ويَبدَأُ التَّلبية، نِداءَ الحاجِّ المُؤَثِّر: «لَبَّيكَ اللَّهُمَّ لَبَّيك، لَبَّيكَ لا شَريكَ لَكَ لَبَّيك، إنَّ الحَمدَ والنِّعمةَ لَكَ والمُلك، لا شَريكَ لَك». وعِندَ بُلوغِ مَكّةَ يَطوفُ الحاجُّ، يَدورُ حَولَ الكَعبةِ سَبعًا تَعَبُّدًا وذِكرًا، مُعَبِّرًا أنَّ حَياتَهُ كُلَّها تَدورُ على عِبادةِ الله. ثُمَّ يَسعى، يَمشي سَبعًا بَينَ الصَّفا والمَروة، مُحييًا سَعيَ هاجَرَ زَوجِ إبراهيمَ وهي تَركُضُ بَينَ التَّلَّينِ تَطلُبُ الماءَ لِرَضيعِها إسماعيل — حَتّى فَجَّرَ اللهُ زَمزَم. في هذا النُّسُك، يُحيي الحاجُّ إيمانَ أُمٍّ وتَوَكُّلَها على الله، ويَشهَدُ كَيفَ يُجازي اللهُ التَّوَكُّلَ علَيه.\n\nوأعظَمُ المَناسِكِ ورُكنُ الحَجِّ الأكبَرُ الوُقوفُ بِعَرَفةَ في اليَومِ التّاسِعِ مِن ذي الحِجّة. في هذا اليَوم، يَجتَمِعُ الحُجّاجُ في سَهلِ عَرَفةَ الواسِع، واقِفينَ بَينَ يَدَي رَبِّهِم مِنَ الزَّوالِ إلى الغُروب، يَرفَعونَ أيديَهُم بِالدُّعاء، يَبكونَ ويَتوبونَ ويَستَغفِرونَ اللهَ ويَستَرحِمونَه. وأعلَنَ النَّبِيُّ ﷺ مَركَزيّةَ هذا النُّسُكِ المُطلَقةَ بِقَولِه: «الحَجُّ عَرَفة» (التِّرمذي) — أيْ مَن فاتَهُ الوُقوفُ بِعَرَفةَ فاتَهُ الحَجّ. وهذا يَومُ المَغفِرةِ العُظمى؛ قالَ النَّبِيُّ ﷺ إنَّهُ ما مِن يَومٍ يُعتِقُ اللهُ فيهِ مِنَ النّارِ أكثَرَ مِن يَومِ عَرَفة، وإنَّهُ يَدنو ويُباهي بِالحُجّاجِ مَلائِكَتَه. والحَشدُ العَظيمُ بِعَرَفة، بِمَلايينِهِ الواقِفينَ مُتَواضِعينَ سَواءً بَينَ يَدَيِ الله، تَذكيرٌ قَوِيٌّ بِحَشرِ النّاسِ يَومَ القِيامة. وبَعدَ الغُروبِ يَنتَقِلُ الحُجّاجُ إلى مُزدَلِفة، يَبيتونَ تَحتَ السَّماءِ المَفتوحةِ ويَجمَعونَ الحَصى. واليَومُ التّالي عيدُ الأضحى، فيهِ يَرمي الحُجّاجُ الجَمرةَ الكُبرى بِمِنى (تَجسيدًا لِرَفضِ إبراهيمَ وَسوَسةَ الشَّيطان)، ويَنحَرونَ الهَدي (إحياءً لِاستِعدادِ إبراهيمَ لِذَبحِ ابنِهِ طاعةً لِله، وفِداءِ اللهِ إسماعيل)، ويَحلِقونَ أو يُقَصِّرونَ شُعورَهُم، فَيَتَحَلَّلونَ مِنَ الإحرام. ثُمَّ يَعودونَ إلى مَكّةَ لِطَوافِ الحَجّ، وفي الأيّامِ التّاليةِ بِمِنى يُواصِلونَ رَميَ الجِمار، قَبلَ أن يُؤَدّوا أخيرًا طَوافَ الوَداعِ وهُم يُغادِرونَ البَيتَ الحَرام.\n\nووَراءَ صُوَرِها، مَناسِكُ الحَجِّ تَفيضُ بِدُروسٍ عَميقةٍ تُحَوِّلُ الحاجَّ ويَتَعَلَّمُ مِنها كُلُّ مُؤمِن، فَاللهُ يَقولُ عنِ الحَجِّ ﴿لِيَشهَدوا مَنافِعَ لَهُم﴾ (الحَجّ ٢٨). والدَّرسُ الأوَّلُ والأبلَغُ المُساواةُ والأُخُوّةُ الإنسانيّة: فَحينَ يَخلَعُ مَلايينُ الحُجّاجِ ثيابَهُمُ الفاخِرةَ وفَوارِقَهُمُ الدُّنيَويّة، يَقِفونَ معًا في بَياضٍ بَسيطٍ واحِد، المَلِكُ إلى جِوارِ الفَقير، كُلُّ عِرقٍ وأُمّةٍ مُختَلِطون، كُلُّهُم يُلَبّونَ رَبًّا واحِدًا، تَذوبُ حَواجِزُ المالِ والجاهِ والعِرقِ المُصطَنَعة، وتَتَجَلّى مُساواةُ البَشَرِ الأساسيّةُ بَينَ يَدَيِ اللهِ بِأقوى صورة. والدَّرسُ الثّاني التَّوحيدُ الخالِص: فالتَّلبيةُ، المُكَرَّرةُ طَوالَ الرِّحلة، إعلانٌ دائِمٌ أنَّ اللهَ وَحدَهُ يُعبَدُ ولا شَريكَ لَه، تُطَهِّرُ إيمانَ الحاجّ. والثّالِثُ إحياءُ مِلّةِ إبراهيمَ وأهلِه — إيمانِهِم وتَضحيَتِهِم وخُضوعِهِم وتَوَكُّلِهِم على الله — يَصِلُ الحاجَّ بِإرثِ التَّوحيدِ الخالِدِ الخالِص. والرّابِعُ ذِكرُ الآخِرة: فَثيابُ الإحرامِ تُشبِهُ الكَفَن، والحَشدُ العَظيمُ بِعَرَفةَ يُشبِهُ الوُقوفَ بَينَ يَدَيِ اللهِ يَومَ القِيامة، يوقِظُ الحاجَّ لِيَستَعِدَّ لِذلك اليَوم. والخامِسُ الصَّبرُ وضَبطُ النَّفسِ وقَهرُ الشَّهَوات، إذ يَحتَمِلُ الحاجُّ المَشَقّةَ والزِّحامَ وقُيودَ الإحرامِ لِوَجهِ الله. والسّادِسُ وَحدةُ الأُمّةِ المُسلِمة، مُجتَمِعةً مِن كُلِّ بِقاعِ الأرض، تُذَكِّرُ المُؤمِنينَ أنَّهُم رَغمَ اختِلافِ اللُّغةِ والأُمّةِ واللَّونِ أُمّةٌ واحِدةٌ يَجمَعُها إيمانٌ واحِد. والحاجُّ الذي يُؤَدّي الحَجَّ بِإخلاصٍ وفَهمٍ يَعودُ لا مَغفورًا لَهُ فَحَسب، بل مُتَحَوِّلًا في قَلبِه — أكثَرَ وَعيًا بِالله، أشَدَّ تَواضُعًا، أعظَمَ شُكرًا، أوثَقَ تَعَلُّقًا بِإخوانِهِ وأخَواتِهِ في الإيمان، وأشَدَّ تَرَكُّزًا على الآخِرة. ولِلشّابِّ المُسلِمِ اليَومَ، حَتّى قَبلَ أن يَستَطيعَ الرِّحلة، مَعاني الحَجِّ — الإخلاصُ والمُساواةُ والأُخُوّةُ والصَّبرُ وذِكرُ الآخِرة — دُروسٌ يَحمِلُها إلى حَياتِهِ اليَوميّة، حَتّى إذا رَزَقَهُ اللهُ القُدرةَ على تَلبيةِ نِداءِ إبراهيمَ والوُقوفِ أمامَ البَيتِ الحَرام، كانَ قَلبُهُ مُهَيَّأً بِالفِعلِ لِرِحلةِ العُمُر.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What pillar of Islam is Hajj?", ar: "أيُّ أركانِ الإسلامِ الحَجّ؟" },
      options: [
        { en: "The fifth pillar, once in a lifetime for the able", ar: "الرُّكنُ الخامِس، مَرّةً لِلمُستَطيع" },
        { en: "The first pillar", ar: "الرُّكنُ الأوَّل" },
        { en: "Not a pillar", ar: "لَيسَ رُكنًا" },
        { en: "Required every year", ar: "واجِبٌ كُلَّ عام" },
      ],
      correctIndex: 0,
      explanation: { en: "Obligatory on the able once in life (Al-'Imran 97).", ar: "واجِبٌ على المُستَطيعِ مَرّةً (آل عمران ٩٧)." },
    },
    {
      prompt: { en: "Who built the Ka'bah by Allah's command?", ar: "مَن بَنى الكَعبةَ بِأمرِ الله؟" },
      options: [
        { en: "Ibrahim and his son Isma'il", ar: "إبراهيمُ وابنُهُ إسماعيل" },
        { en: "Musa", ar: "موسى" },
        { en: "Nuh", ar: "نوح" },
        { en: "Adam's enemies", ar: "أعداءُ آدَم" },
      ],
      correctIndex: 0,
      explanation: { en: "They raised its foundations (Al-Baqarah 127).", ar: "رَفَعا قَواعِدَه (البقرة ١٢٧)." },
    },
    {
      prompt: { en: "What is the greatest pillar of Hajj?", ar: "ما أعظَمُ أركانِ الحَجّ؟" },
      options: [
        { en: "Standing at 'Arafah", ar: "الوُقوفُ بِعَرَفة" },
        { en: "Buying souvenirs", ar: "شِراءُ الهَدايا" },
        { en: "Sleeping in a hotel", ar: "النَّومُ في فُندُق" },
        { en: "Travelling fast", ar: "السَّفَرُ سَريعًا" },
      ],
      correctIndex: 0,
      explanation: { en: "'Hajj is 'Arafah' (Tirmidhi).", ar: "«الحَجُّ عَرَفة» (التِّرمذي)." },
    },
    {
      prompt: { en: "What is the reward of an accepted Hajj (mabrur)?", ar: "ما جَزاءُ الحَجِّ المَبرور؟" },
      options: [
        { en: "Nothing less than Paradise", ar: "لَيسَ لَهُ جَزاءٌ إلّا الجَنّة" },
        { en: "Wealth only", ar: "المالُ فَقَط" },
        { en: "Fame", ar: "الشُّهرة" },
        { en: "Nothing", ar: "لا شَيء" },
      ],
      correctIndex: 0,
      explanation: { en: "'The accepted Hajj has no reward but Paradise' (Bukhari & Muslim).", ar: "«الحَجُّ المَبرورُ لَيسَ لَهُ جَزاءٌ إلّا الجَنّة» (البخاري ومسلم)." },
    },
    {
      prompt: { en: "What does the sa'i between Safa and Marwah commemorate?", ar: "ماذا يُحيي السَّعيُ بَينَ الصَّفا والمَروة؟" },
      options: [
        { en: "Hagar's search for water for baby Isma'il", ar: "سَعيَ هاجَرَ طَلَبًا لِلماءِ لِلطِّفلِ إسماعيل" },
        { en: "A battle", ar: "مَعرَكة" },
        { en: "A marketplace", ar: "سوقًا" },
        { en: "A race for prizes", ar: "سِباقًا لِلجَوائِز" },
      ],
      correctIndex: 0,
      explanation: { en: "Allah rewarded her trust with the spring of Zamzam.", ar: "جازى اللهُ تَوَكُّلَها بِزَمزَم." },
    },
    {
      prompt: { en: "True or False: On Hajj, rich and poor of every race wear the same simple garments.", ar: "صَوابٌ أم خَطأ: في الحَجِّ يَلبَسُ الغَنِيُّ والفَقيرُ مِن كُلِّ عِرقٍ اللِّباسَ البَسيطَ نَفسَه." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Hajj displays the equality of all before Allah.", ar: "الحَجُّ يُظهِرُ مُساواةَ الجَميعِ بَينَ يَدَيِ الله." },
    },
  ],
};
