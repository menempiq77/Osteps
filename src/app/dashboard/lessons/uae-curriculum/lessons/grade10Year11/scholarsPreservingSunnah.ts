import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const scholarsPreservingSunnah: CourseLesson = {
  slug: "g10y11-the-efforts-of-scholars-in-preserving-the-sunnah",
  name: { en: "The Efforts of Scholars in Preserving the Sunnah", ar: "جُهودُ العُلَماءِ في حِفظِ السُّنّة" },
  shortIntro: {
    en: "How did the Sunnah of the Prophet ﷺ reach us across fourteen centuries, pure and authenticated? This lesson honours the colossal efforts of the hadith scholars — the science of isnad (chains of narration), the critical study of narrators (jarh wa ta'dil), the great journeys for knowledge, and the monumental collections that preserved the second source of Islam with a precision unmatched in human history.",
    ar: "كَيفَ وَصَلَت إلَينا سُنّةُ النَّبِيِّ ﷺ عَبرَ أربَعةَ عَشَرَ قَرنًا نَقيّةً مُحَقَّقة؟ يُكرِمُ هذا الدَّرسُ جُهودَ عُلَماءِ الحَديثِ الجَبّارة — عِلمَ الإسناد، ونَقدَ الرُّواةِ (الجَرحَ والتَّعديل)، والرَّحَلاتِ العَظيمةَ في طَلَبِ العِلم، والمُصَنَّفاتِ الكُبرى التي حَفِظَت مَصدَرَ الإسلامِ الثّاني بِدِقّةٍ لا نَظيرَ لَها في تاريخِ البَشَر.",
  },
  quranSurahs: ["Al-Hijr 9", "An-Najm 3"],
  sections: [
    {
      title: { en: "The science of isnad and the study of narrators", ar: "عِلمُ الإسنادِ ونَقدُ الرُّواة" },
      learningObjectives: [
        { en: "Explain the importance of preserving the Sunnah.", ar: "أشرَحُ أهَمّيّةَ حِفظِ السُّنّة." },
        { en: "Describe the science of isnad and narrator criticism.", ar: "أصِفُ عِلمَ الإسنادِ ونَقدَ الرُّواة." },
      ],
      successCriteria: [
        { en: "I can explain what an isnad is and why it matters.", ar: "أشرَحُ ما الإسنادُ ولِمَ يَهُمّ." },
        { en: "I can explain jarh wa ta'dil.", ar: "أشرَحُ الجَرحَ والتَّعديل." },
      ],
      image: {
        src: IMG.bookshelf,
        alt: { en: "Shelves of books — the preserved heritage of hadith.", ar: "رُفوفُ كُتُب — تُراثُ الحَديثِ المَحفوظ." },
        caption: { en: "'The isnad is part of the religion' (Imam Muslim's introduction).", ar: "«الإسنادُ مِنَ الدّين» (مُقَدِّمةُ صَحيحِ مُسلِم)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why did Allah preserve the Sunnah alongside the Qur'an?", ar: "لِمَ حَفِظَ اللهُ السُّنّةَ معَ القُرآن؟" },
        body: {
          en: "The Qur'an commands prayer, zakat, and hajj — but it is the Sunnah that explains how to perform them. Reflect: why is the Sunnah indispensable for understanding and living Islam, and what does the astonishing science the scholars built to authenticate it — found in no other religion or body of knowledge on earth — tell us about Allah's promise to preserve His religion?",
          ar: "يَأمُرُ القُرآنُ بِالصَّلاةِ والزَّكاةِ والحَجّ — لكِنَّ السُّنّةَ هي التي تُبَيِّنُ كَيفَ تُؤَدّى. تَأمَّل: لِمَ كانَتِ السُّنّةُ لازِمةً لِفَهمِ الإسلامِ والعَمَلِ بِه، وماذا يَقولُ لَنا ذلك العِلمُ المُذهِلُ الذي بَناهُ العُلَماءُ لِتَوثيقِها — وهو لا يوجَدُ في أيِّ دينٍ أو عِلمٍ آخَرَ على الأرض — عن وَعدِ اللهِ بِحِفظِ دينِه؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Key terms", ar: "مُصطَلَحات" },
          lines: [
            { en: "Isnad (إسناد): the chain of narrators who transmitted a hadith.", ar: "الإسناد: سِلسِلةُ الرُّواةِ الذينَ نَقَلوا الحَديث." },
            { en: "Matn (مَتن): the actual text/content of the hadith.", ar: "المَتن: نَصُّ الحَديثِ ومَضمونُه." },
            { en: "Jarh wa ta'dil (الجَرحُ والتَّعديل): criticising or vouching for narrators.", ar: "الجَرحُ والتَّعديل: تَجريحُ الرُّواةِ أو تَوثيقُهُم." },
          ],
        },
        {
          label: { en: "Cross-reference", ar: "إحالة" },
          lines: [
            { en: "Allah's promise of preservation: Al-Hijr 9.", ar: "وَعدُ اللهِ بِالحِفظ: الحجر ٩." },
          ],
        },
      ],
      body: {
        en: "The Sunnah of the Prophet Muhammad ﷺ — his sayings, actions, and approvals — is the second source of Islam after the Qur'an, and it is indispensable to the religion. Allah commands in the Qur'an, 'And establish prayer and give zakat,' but it is the Sunnah that teaches us how to pray and how to give zakat. Allah commands obedience to His Messenger: 'Whoever obeys the Messenger has obeyed Allah' (An-Nisa 80), and 'And whatever the Messenger has given you, take; and what he has forbidden you, refrain from' (Al-Hashr 7). Allah testifies that the Prophet ﷺ does not speak from his own desire: 'Nor does he speak from inclination. It is not but a revelation revealed' (An-Najm 3-4). The Sunnah, therefore, is a form of revelation, and without it, the Qur'an itself cannot be properly understood or practised. For this reason, the preservation of the Sunnah was a matter of the gravest importance — and indeed, it falls under Allah's promise to preserve His religion: 'Indeed, it is We who sent down the message (adh-Dhikr), and indeed, We will be its guardian' (Al-Hijr 9), which the scholars explained includes both the Qur'an and the Sunnah that explains it.\n\nAllah preserved the Sunnah through the colossal, meticulous, and unprecedented efforts of the Muslim scholars of hadith — efforts that produced a science of authentication unmatched by any other nation or body of knowledge in human history. The cornerstone of this science is the isnad: the chain of narrators through whom a hadith was transmitted, each one naming the person they heard it from, going back link by link to the Prophet ﷺ himself. The scholars understood that a report could only be trusted if its chain of transmission was sound, and so they made the isnad a science in itself. Ibn al-Mubarak, a great early scholar, said: 'The isnad is part of the religion; were it not for the isnad, anyone could say whatever they wished.' And Imam Muslim recorded in the introduction to his Sahih the statement of the early scholars that 'this knowledge is religion, so look carefully from whom you take your religion.' The Muslims, by the care of Allah, became the only nation on earth to attach a verified chain of named, scrutinised transmitters to the reports of their Prophet — so that for every hadith, one can trace exactly who narrated it, all the way back.\n\nBeyond the chain itself, the scholars developed the extraordinary science of jarh wa ta'dil — the critical evaluation of the narrators. Because a chain is only as reliable as the people in it, the scholars made it their life's work to investigate every single narrator: their honesty and piety (was this person truthful, trustworthy, and righteous?), and their precision and memory (was this person accurate and reliable in retaining and conveying what they heard?). They compiled vast biographical dictionaries — works like Tahdhib al-Kamal and others containing the names, lives, teachers, students, and reliability ratings of tens of thousands of narrators. They graded narrators with precise terminology, from thiqah (trustworthy) down to da'if (weak) and matruk (abandoned). They cross-checked narrations, comparing different chains for the same text to detect errors, additions, or contradictions. They distinguished the connected chain from the broken one, the sound from the defective. So rigorous were they that they would travel for months to verify a single narrator, and they did not hesitate to declare even a relative or a pious worshipper 'weak' in hadith if his memory was unreliable — for they held the words of the Prophet ﷺ to be a sacred trust. Through this science of the isnad and the criticism of narrators, the scholars built a fortress around the Sunnah, distinguishing the authentic from the fabricated. In the next section, we look at the great journeys for knowledge and the monumental collections in which this preserved Sunnah was gathered.",
        ar: "سُنّةُ النَّبِيِّ مُحَمَّدٍ ﷺ — أقوالُهُ وأفعالُهُ وتَقريراتُهُ — هي المَصدَرُ الثّاني لِلإسلامِ بَعدَ القُرآن، وهي لازِمةٌ لِلدّين. يَأمُرُ اللهُ في القُرآن: ﴿وأقيموا الصَّلاةَ وآتوا الزَّكاة﴾، لكِنَّ السُّنّةَ هي التي تُعَلِّمُنا كَيفَ نُصَلّي وكَيفَ نُؤَدّي الزَّكاة. ويَأمُرُ اللهُ بِطاعةِ رَسولِه: ﴿مَن يُطِعِ الرَّسولَ فَقَد أطاعَ الله﴾ (النساء ٨٠)، و﴿وما آتاكُمُ الرَّسولُ فَخُذوهُ وما نَهاكُم عنهُ فانتَهوا﴾ (الحشر ٧). ويَشهَدُ اللهُ أنَّ النَّبِيَّ ﷺ لا يَنطِقُ عنِ الهَوى: ﴿وما يَنطِقُ عنِ الهَوى، إن هو إلّا وَحيٌ يوحى﴾ (النجم ٣-٤). فَالسُّنّةُ إذًا ضَربٌ مِنَ الوَحي، وبِدونِها لا يُفهَمُ القُرآنُ نَفسُهُ ولا يُعمَلُ بِهِ على وَجهِه. ولِهذا كانَ حِفظُ السُّنّةِ أمرًا بالِغَ الأهَمّيّة — بل هو داخِلٌ في وَعدِ اللهِ بِحِفظِ دينِه: ﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحجر ٩)، الذي بَيَّنَ العُلَماءُ أنَّهُ يَشمَلُ القُرآنَ والسُّنّةَ المُبَيِّنةَ لَه.\n\nحَفِظَ اللهُ السُّنّةَ بِجُهودِ عُلَماءِ الحَديثِ المُسلِمينَ الجَبّارةِ الدَّقيقةِ التي لا سابِقةَ لَها — جُهودٌ أنتَجَت عِلمَ تَوثيقٍ لا تُضاهيهِ أُمّةٌ ولا عِلمٌ في تاريخِ البَشَر. وحَجَرُ الزّاويةِ في هذا العِلمِ الإسناد: سِلسِلةُ الرُّواةِ الذينَ نُقِلَ بِهِمُ الحَديث، يُسَمّي كُلٌّ مَن سَمِعَ مِنهُ، رُجوعًا حَلقةً حَلقةً إلى النَّبِيِّ ﷺ نَفسِه. أدرَكَ العُلَماءُ أنَّ الخَبَرَ لا يوثَقُ بِهِ إلّا إذا صَحَّ سَنَدُه، فَجَعَلوا الإسنادَ عِلمًا قائِمًا. قالَ ابنُ المُبارَكِ، أحَدُ كِبارِ المُتَقَدِّمين: «الإسنادُ مِنَ الدّين، ولَولا الإسنادُ لَقالَ مَن شاءَ ما شاء». ورَوى الإمامُ مُسلِمٌ في مُقَدِّمةِ صَحيحِهِ قَولَ السَّلَف: «إنَّ هذا العِلمَ دين، فانظُروا عَمَّن تَأخُذونَ دينَكُم». فَصارَ المُسلِمونَ، بِعِنايةِ الله، الأُمّةَ الوَحيدةَ على الأرضِ التي تَصِلُ سَنَدًا مُحَقَّقًا مِن رُواةٍ مُسَمَّينَ مَفحوصينَ بِأخبارِ نَبيِّها — فَيُعرَفُ في كُلِّ حَديثٍ مَن رَواهُ بِالضَّبطِ رُجوعًا إلى أوَّلِه.\n\nوفَوقَ السَّنَدِ نَفسِه، طَوَّرَ العُلَماءُ عِلمًا عَجيبًا هو الجَرحُ والتَّعديل — النَّقدُ الدَّقيقُ لِلرُّواة. ولِأنَّ السَّنَدَ لا يَصِحُّ إلّا بِصِحّةِ مَن فيه، جَعَلوا عَمَلَ أعمارِهِمُ البَحثَ في كُلِّ راوٍ: في عَدالَتِهِ وتَقواه (أصادِقٌ أمينٌ صالِح؟)، وفي ضَبطِهِ وحِفظِه (أدَقيقٌ مُتقِنٌ فيما حَفِظَ وأدّى؟). فَصَنَّفوا مَعاجِمَ تَراجِمَ ضَخمة — كَتَهذيبِ الكَمالِ وغَيرِهِ، فيها أسماءُ عَشَراتِ الآلافِ مِنَ الرُّواةِ وحَياتُهُم وشُيوخُهُم وتَلاميذُهُم ودَرَجاتُ تَوثيقِهِم. ودَرَّجوا الرُّواةَ بِمُصطَلَحاتٍ دَقيقة، مِنَ الثِّقةِ إلى الضَّعيفِ والمَتروك. وقابَلوا الرِّواياتِ، يُوازِنونَ الأسانيدَ المُختَلِفةَ لِلنَّصِّ الواحِدِ لِيَكشِفوا الخَطَأَ أوِ الزِّيادةَ أوِ التَّعارُض. ومَيَّزوا المُتَّصِلَ مِنَ المُنقَطِع، والصَّحيحَ مِنَ المُعَلّ. وبَلَغوا مِنَ الدِّقّةِ أن يَرحَلوا شُهورًا لِيَتَحَقَّقوا مِن راوٍ واحِد، ولم يَتَرَدَّدوا في تَضعيفِ قَريبٍ أو عابِدٍ صالِحٍ في الحَديثِ إن كانَ سَيِّئَ الحِفظ — لِأنَّهُم رَأَوا كَلامَ النَّبِيِّ ﷺ أمانةً مُقَدَّسة. وبِعِلمِ الإسنادِ ونَقدِ الرُّواةِ بَنى العُلَماءُ حِصنًا حَولَ السُّنّة، يُمَيِّزونَ الصَّحيحَ مِنَ المَوضوع. وفي القِسمِ التّالي نَنظُرُ في الرَّحَلاتِ العَظيمةِ في طَلَبِ العِلمِ والمُصَنَّفاتِ الكُبرى التي جُمِعَت فيها هذه السُّنّةُ المَحفوظة.",
      },
    },
    {
      title: { en: "The journeys for knowledge and the great collections", ar: "الرَّحَلاتُ في طَلَبِ العِلمِ والمُصَنَّفاتُ الكُبرى" },
      learningObjectives: [
        { en: "Describe the scholars' journeys to gather hadith.", ar: "أصِفُ رَحَلاتِ العُلَماءِ لِجَمعِ الحَديث." },
        { en: "Name the great collections of the Sunnah.", ar: "أُسَمّي المُصَنَّفاتِ الكُبرى لِلسُّنّة." },
      ],
      image: {
        src: IMG.childQuran,
        alt: { en: "A learner with a book — knowledge passed faithfully on.", ar: "طالِبٌ معَ كِتاب — عِلمٌ يُنقَلُ بِأمانة." },
        caption: { en: "'Whoever travels a path seeking knowledge, Allah eases for him a path to Paradise' (Muslim).", ar: "«مَن سَلَكَ طَريقًا يَلتَمِسُ فيهِ عِلمًا سَهَّلَ اللهُ لَهُ طَريقًا إلى الجَنّة» (مسلم)." },
      },
      groupTasks: {
        title: { en: "How the Sunnah was preserved", ar: "كَيفَ حُفِظَتِ السُّنّة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "journeys-for-knowledge",
            name: { en: "Team A — The journeys for knowledge", ar: "الفَريقُ أ — الرَّحَلاتُ في طَلَبِ العِلم" },
            learningObjective: { en: "Present the scholars' devotion in seeking hadith.", ar: "نَعرِضُ هِمّةَ العُلَماءِ في طَلَبِ الحَديث." },
            task: { en: "Present the extraordinary devotion of the hadith scholars (the rihlah, journey, for knowledge). Show how they crossed deserts and travelled for months between cities and lands — Makkah, Madinah, Kufa, Basra, Baghdad, Damascus, Egypt, Khurasan — to hear a single hadith from a reliable teacher or to verify a narrator. Give examples: Jabir ibn Abdullah travelling a month's journey for one hadith; Imam al-Bukhari travelling for years across the Muslim world, meeting over a thousand teachers, and memorising hundreds of thousands of narrations with their chains. Quote the Prophet ﷺ: 'Whoever travels a path seeking knowledge, Allah will make easy for him a path to Paradise' (Muslim). Present a 'journeys for knowledge' map showing their travels and sacrifices.", ar: "اعرِضوا هِمّةَ عُلَماءِ الحَديثِ العَجيبةَ (الرِّحلةَ في طَلَبِ العِلم). بَيِّنوا كَيفَ قَطَعوا الصَّحارى ورَحَلوا شُهورًا بَينَ المُدُنِ والبُلدان — مَكّةَ والمَدينةِ والكوفةِ والبَصرةِ وبَغدادَ ودِمَشقَ ومِصرَ وخُراسان — لِيَسمَعوا حَديثًا واحِدًا مِن شَيخٍ ثِقةٍ أو يَتَحَقَّقوا مِن راوٍ. اضرِبوا أمثِلة: رِحلةَ جابِرِ بنِ عَبدِ اللهِ شَهرًا في حَديثٍ واحِد؛ ورِحلةَ الإمامِ البُخاريِّ سِنينَ في العالَمِ الإسلاميّ، لَقيَ أكثَرَ مِن ألفِ شَيخ، وحَفِظَ مِئاتِ الآلافِ مِنَ الرِّواياتِ بِأسانيدِها. اقتَبِسوا قَولَ النَّبِيِّ ﷺ: «مَن سَلَكَ طَريقًا يَلتَمِسُ فيهِ عِلمًا سَهَّلَ اللهُ لَهُ طَريقًا إلى الجَنّة» (مسلم). اعرِضوا خَريطةَ «الرَّحَلاتِ في طَلَبِ العِلم» تُبَيِّنُ أسفارَهُم وتَضحياتِهِم." },
            evidence: [
              { en: "'Whoever travels a path seeking knowledge...' (Muslim).", ar: "«مَن سَلَكَ طَريقًا يَلتَمِسُ فيهِ عِلمًا...» (مسلم)." },
            ],
            sourceNotes: [
              { en: "They sacrificed comfort and years to preserve the Sunnah.", ar: "بَذَلوا الرّاحةَ والسِّنينَ لِحِفظِ السُّنّة." },
            ],
            memberRoles: [
              { en: "Researcher, Cartographer, Presenter.", ar: "الباحِث، راسِمُ الخَريطة، العارِض." },
            ],
            finalProduct: { en: "A 'journeys for knowledge' map.", ar: "خَريطةُ «الرَّحَلاتِ في طَلَبِ العِلم»." },
          },
          {
            slug: "the-great-collections",
            name: { en: "Team B — The great collections", ar: "الفَريقُ ب — المُصَنَّفاتُ الكُبرى" },
            learningObjective: { en: "Present the major books of hadith.", ar: "نَعرِضُ كُتُبَ الحَديثِ الكُبرى." },
            task: { en: "Present the great books in which the authenticated Sunnah was preserved. Show the codification under Umar ibn Abdul Aziz and the early works (the Muwatta of Imam Malik). Then present the most famous collections: Sahih al-Bukhari and Sahih Muslim (the two most authentic books after the Qur'an), and the four Sunan — Abu Dawud, at-Tirmidhi, an-Nasa'i, and Ibn Majah — together forming the famous collections relied upon by the Ummah, alongside the Musnad of Imam Ahmad and others. Explain how al-Bukhari selected only a few thousand sound hadiths from hundreds of thousands, with strict conditions, and how these books made the authentic Sunnah accessible and protected for all generations. Present a 'great books of hadith' display.", ar: "اعرِضوا الكُتُبَ الكُبرى التي حُفِظَت فيها السُّنّةُ المُحَقَّقة. بَيِّنوا التَّدوينَ في عَهدِ عُمَرَ بنِ عَبدِ العَزيزِ والمُصَنَّفاتِ المُبَكِّرة (مُوَطَّأَ الإمامِ مالِك). ثُمَّ اعرِضوا أشهَرَ الجَوامِع: صَحيحَ البُخاريِّ وصَحيحَ مُسلِم (أصَحَّ كِتابَينِ بَعدَ القُرآن)، والسُّنَنَ الأربَع — أبا داودَ والتِّرمِذيَّ والنَّسائيَّ وابنَ ماجه — معًا الكُتُبَ المَشهورةَ التي اعتَمَدَتها الأُمّة، معَ مُسنَدِ الإمامِ أحمَدَ وغَيرِها. بَيِّنوا كَيفَ انتَقى البُخاريُّ بِضعةَ آلافِ حَديثٍ صَحيحٍ مِن مِئاتِ الآلافِ بِشُروطٍ صارِمة، وكَيفَ جَعَلَت هذه الكُتُبُ السُّنّةَ الصَّحيحةَ مَيسورةً مَحفوظةً لِكُلِّ الأجيال. اعرِضوا لَوحةَ «كُتُبِ الحَديثِ الكُبرى»." },
            evidence: [
              { en: "Sahih al-Bukhari and Sahih Muslim: the most authentic after the Qur'an.", ar: "صَحيحا البُخاريِّ ومُسلِم: أصَحُّ الكُتُبِ بَعدَ القُرآن." },
            ],
            sourceNotes: [
              { en: "Strict conditions preserved only the authentic.", ar: "شُروطٌ صارِمةٌ حَفِظَتِ الصَّحيحَ وَحدَه." },
            ],
            memberRoles: [
              { en: "Researcher, Designer, Presenter.", ar: "الباحِث، المُصَمِّم، العارِض." },
            ],
            finalProduct: { en: "A 'great books of hadith' display.", ar: "لَوحةُ «كُتُبِ الحَديثِ الكُبرى»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Honouring those who preserved the Sunnah", ar: "إكرامُ مَن حَفِظوا السُّنّة" },
        prompt: { en: "The Sunnah reached us, pure and authenticated across fourteen centuries, only through the staggering efforts of the hadith scholars: the science of the isnad, the critical study of every narrator, lifetimes of travel and memorisation, and the great collections like Sahih al-Bukhari and Sahih Muslim — a precision of preservation found nowhere else on earth, by which Allah fulfilled His promise to guard His religion. Reflect on what these efforts mean for you. Write about how learning the cost at which the Sunnah was preserved increases your respect and love for the hadith of the Prophet ﷺ, why it gives you confidence in the authenticity of your religion, and how you will honour this trust — by learning, following, and respecting the authentic Sunnah, and by being careful and truthful in what you attribute to the Prophet ﷺ.", ar: "ما وَصَلَتنا السُّنّةُ نَقيّةً مُحَقَّقةً عَبرَ أربَعةَ عَشَرَ قَرنًا إلّا بِجُهودِ عُلَماءِ الحَديثِ المُذهِلة: عِلمِ الإسناد، ونَقدِ كُلِّ راوٍ، وأعمارٍ مِنَ الرِّحلةِ والحِفظ، والمُصَنَّفاتِ الكُبرى كَصَحيحَيِ البُخاريِّ ومُسلِم — دِقّةُ حِفظٍ لا توجَدُ في غَيرِها على الأرض، أنجَزَ بِها اللهُ وَعدَهُ بِحِفظِ دينِه. تَأمَّل ماذا تَعني لَكَ هذه الجُهود. اكتُب كَيفَ يَزيدُ عِلمُكَ بِالثَّمَنِ الذي حُفِظَت بِهِ السُّنّةُ احتِرامَكَ وحُبَّكَ لِحَديثِ النَّبِيِّ ﷺ، ولِمَ يَمنَحُكَ ثِقةً بِصِحّةِ دينِك، وكَيفَ سَتُؤَدّي هذه الأمانة — بِتَعَلُّمِ السُّنّةِ الصَّحيحةِ واتِّباعِها واحتِرامِها، وبِالحَذَرِ والصِّدقِ فيما تَنسُبُهُ إلى النَّبِيِّ ﷺ." },
        placeholder: { en: "Learning how the Sunnah was preserved makes me... It gives me confidence because... I will honour this trust by...", ar: "عِلمي بِكَيفِ حُفِظَتِ السُّنّةُ يَجعَلُني... وهو يَمنَحُني ثِقةً لِأنَّ... وسَأُؤَدّي الأمانةَ بِـ..." },
      },
      body: {
        en: "The preservation of the Sunnah was not achieved from libraries and comfort, but through a devotion to knowledge so intense that it stands among the wonders of human history: the rihlah, the journey in search of knowledge. The early scholars and the seekers of hadith would leave their homes, families, and lands and travel for weeks, months, and even years, crossing deserts and enduring hardship and poverty, all to hear a hadith directly from a trustworthy teacher or to verify a chain or a narrator. The Companion Jabir ibn Abdullah, it is reported, once travelled the distance of a month's journey to Syria to confirm a single hadith from another Companion. The imams of hadith embodied this devotion to the highest degree: Imam al-Bukhari left his homeland as a young man and spent some sixteen years travelling throughout the Muslim world — to Makkah, Madinah, Basra, Kufa, Baghdad, Egypt, Syria, and the lands of Khurasan — meeting more than a thousand teachers and committing to memory hundreds of thousands of narrations with their full chains, testing his own memory and that of his teachers with painstaking care. These scholars sacrificed wealth, comfort, and years of their lives, fulfilling the Prophet's words ﷺ: 'Whoever travels a path seeking knowledge, Allah will make easy for him a path to Paradise' (Muslim). Their love for the Sunnah and their fear of misrepresenting the Prophet ﷺ drove them to a precision and effort that no other field of knowledge has ever witnessed.\n\nThe fruit of all these efforts — the science of the isnad, the criticism of narrators, and the great journeys — was the compilation of the Sunnah into the monumental collections that the Ummah relies upon to this day. The first major step of formal codification (tadwin) came under the righteous caliph Umar ibn Abdul Aziz, who feared the loss of knowledge and officially ordered the gathering and writing of the hadith. Among the earliest great works was the Muwatta of Imam Malik ibn Anas, a foundational collection of sound hadith and the practice of Madinah. Then, in the third century after the Hijrah, came the golden age of hadith compilation, producing the most rigorous and celebrated collections. Foremost among them are Sahih al-Bukhari and Sahih Muslim, regarded by the Ummah as the two most authentic books after the Book of Allah. Imam al-Bukhari applied the strictest conditions, selecting only a few thousand authentic hadiths from the hundreds of thousands he had memorised, and it is reported that he would not record a hadith without first purifying himself and praying for guidance. Alongside the two Sahihs, the Ummah relies on the four Sunan — those of Abu Dawud, at-Tirmidhi, an-Nasa'i, and Ibn Majah — and the great Musnad of Imam Ahmad ibn Hanbal, among many others. Through these books, the authenticated Sunnah was organised, preserved, and made accessible to every generation, with the weak and fabricated reports identified and separated from the sound.\n\nThe efforts of the scholars in preserving the Sunnah carry profound lessons and a deep significance for every Muslim. First, they are a manifestation of Allah's promise to preserve His religion: 'Indeed, it is We who sent down the message, and indeed, We will be its guardian' (Al-Hijr 9). Allah preserved His religion through these scholars, raising up in every generation those who would protect the Qur'an and the Sunnah from loss and corruption. Second, they give the Muslim certainty and confidence in the authenticity of their religion: unlike the followers of earlier scriptures, whose texts were altered and lost their chains of transmission, the Muslim can know with confidence which words truly belong to the Prophet ﷺ, because they came through a verified, scrutinised chain and were tested by a science of authentication unmatched anywhere on earth. This is a unique blessing and a proof of the truth of Islam. Third, these efforts teach us the immense value of knowledge, the virtue of sincerity and precision in preserving it, and the example of devotion, sacrifice, and truthfulness set by these great scholars. For the young Muslim, this topic instils a deep respect and love for the hadith of the Prophet ﷺ and gratitude to those who preserved it at such cost. It calls them to honour this priceless trust: to learn the authentic Sunnah, to follow it, to respect it, and to be extremely careful and truthful in whatever they attribute to the Prophet ﷺ — for he warned: 'Whoever lies about me deliberately, let him take his seat in the Fire' (Bukhari and Muslim). The student who understands how the Sunnah was preserved comes to love their religion more deeply, to trust its sources, and to feel honoured to be part of an Ummah that guarded the words of its Prophet ﷺ with a faithfulness the world has never seen.",
        ar: "لم يَتَحَقَّق حِفظُ السُّنّةِ مِنَ المَكتَباتِ والرّاحة، بل بِشَغَفٍ بِالعِلمِ بَلَغَ مِنَ الشِّدّةِ أن صارَ مِن عَجائِبِ التّاريخ: الرِّحلةُ في طَلَبِ العِلم. كانَ العُلَماءُ الأوائِلُ وطُلّابُ الحَديثِ يَترُكونَ بُيوتَهُم وأهليهِم وبِلادَهُم ويَرحَلونَ أسابيعَ وشُهورًا بل سِنين، يَقطَعونَ الصَّحارى ويَحتَمِلونَ المَشَقّةَ والفَقر، لِيَسمَعوا حَديثًا مِن شَيخٍ ثِقةٍ مُباشَرةً أو يَتَحَقَّقوا مِن سَنَدٍ أو راوٍ. ويُروى أنَّ الصَّحابيَّ جابِرَ بنَ عَبدِ اللهِ رَحَلَ مَسيرةَ شَهرٍ إلى الشّامِ لِيَتَأكَّدَ مِن حَديثٍ واحِدٍ عن صَحابيٍّ آخَر. وجَسَّدَ أئِمّةُ الحَديثِ هذا الشَّغَفَ في أعلى دَرَجاتِه: تَرَكَ الإمامُ البُخاريُّ وَطَنَهُ شابًّا وقَضى نَحوَ سِتَّةَ عَشَرَ عامًا يَرحَلُ في العالَمِ الإسلاميّ — إلى مَكّةَ والمَدينةِ والبَصرةِ والكوفةِ وبَغدادَ ومِصرَ والشّامِ وبِلادِ خُراسان — لَقيَ أكثَرَ مِن ألفِ شَيخ، وحَفِظَ مِئاتِ الآلافِ مِنَ الرِّواياتِ بِأسانيدِها كامِلة، يَختَبِرُ حِفظَهُ وحِفظَ شُيوخِهِ بِدِقّةٍ بالِغة. بَذَلَ هؤُلاءِ العُلَماءُ المالَ والرّاحةَ وسِنينَ مِن أعمارِهِم، مُحَقِّقينَ قَولَ النَّبِيِّ ﷺ: «مَن سَلَكَ طَريقًا يَلتَمِسُ فيهِ عِلمًا سَهَّلَ اللهُ لَهُ طَريقًا إلى الجَنّة» (مسلم). فَحُبُّهُم لِلسُّنّةِ وخَوفُهُم مِنَ الخَطَإِ على النَّبِيِّ ﷺ دَفَعاهُم إلى دِقّةٍ وجَهدٍ ما شَهِدَهُ عِلمٌ آخَرُ قَطّ.\n\nوثَمَرةُ هذه الجُهودِ كُلِّها — عِلمِ الإسناد، ونَقدِ الرُّواة، والرَّحَلاتِ العَظيمة — جَمعُ السُّنّةِ في المُصَنَّفاتِ الكُبرى التي تَعتَمِدُها الأُمّةُ إلى اليَوم. وكانَت أوَّلَ خُطوةٍ كُبرى لِلتَّدوينِ الرَّسميِّ في عَهدِ الخَليفةِ الرّاشِدِ عُمَرَ بنِ عَبدِ العَزيز، الذي خَشيَ ضَياعَ العِلمِ فَأمَرَ رَسميًّا بِجَمعِ الحَديثِ وكِتابَتِه. ومِن أوائِلِ المُصَنَّفاتِ العَظيمةِ مُوَطَّأُ الإمامِ مالِكِ بنِ أنَس، جامِعٌ أساسيٌّ لِلحَديثِ الصَّحيحِ وعَمَلِ المَدينة. ثُمَّ جاءَ في القَرنِ الثّالِثِ الهِجريِّ عَصرُ التَّدوينِ الذَّهَبيّ، فَأنتَجَ أدَقَّ الجَوامِعِ وأشهَرَها. وفي مُقَدِّمَتِها صَحيحُ البُخاريِّ وصَحيحُ مُسلِم، يَراهُمَا الأُمّةُ أصَحَّ كِتابَينِ بَعدَ كِتابِ الله. طَبَّقَ الإمامُ البُخاريُّ أصرَمَ الشُّروط، فانتَقى بِضعةَ آلافِ حَديثٍ صَحيحٍ مِن مِئاتِ الآلافِ التي حَفِظَها، ويُروى أنَّهُ ما كانَ يُدخِلُ حَديثًا حَتّى يَتَطَهَّرَ ويُصَلّيَ ويَستَخير. ومعَ الصَّحيحَين، تَعتَمِدُ الأُمّةُ السُّنَنَ الأربَع — لِأبي داودَ والتِّرمِذيِّ والنَّسائيِّ وابنِ ماجه — ومُسنَدَ الإمامِ أحمَدَ بنِ حَنبَلٍ العَظيم، وغَيرَها كَثير. وبِهذه الكُتُبِ نُظِّمَتِ السُّنّةُ المُحَقَّقةُ وحُفِظَت وأُتيحَت لِكُلِّ جيل، معَ تَمييزِ الضَّعيفِ والمَوضوعِ وفَصلِهِ عنِ الصَّحيح.\n\nوجُهودُ العُلَماءِ في حِفظِ السُّنّةِ تَحمِلُ دُروسًا عَميقةً ودَلالةً كَبيرةً لِكُلِّ مُسلِم. أوَّلًا: هي مَظهَرٌ مِن مَظاهِرِ وَعدِ اللهِ بِحِفظِ دينِه: ﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحجر ٩). حَفِظَ اللهُ دينَهُ بِهؤُلاءِ العُلَماء، فَقَيَّضَ في كُلِّ جيلٍ مَن يَحمي القُرآنَ والسُّنّةَ مِنَ الضَّياعِ والتَّحريف. ثانيًا: تَمنَحُ المُسلِمَ يَقينًا وثِقةً بِصِحّةِ دينِه: فَخِلافًا لِأتباعِ الكُتُبِ السّابِقةِ التي حُرِّفَت وفُقِدَت أسانيدُها، يَستَطيعُ المُسلِمُ أن يَعلَمَ بِثِقةٍ أيَّ الكَلامِ هو حَقًّا لِلنَّبِيِّ ﷺ، لِأنَّهُ جاءَ بِسَنَدٍ مُحَقَّقٍ مَفحوصٍ واختُبِرَ بِعِلمِ تَوثيقٍ لا نَظيرَ لَهُ على الأرض. وهذه نِعمةٌ فَريدةٌ ودَليلٌ على صِدقِ الإسلام. ثالِثًا: تُعَلِّمُنا هذه الجُهودُ عَظيمَ قَدرِ العِلم، وفَضلَ الإخلاصِ والدِّقّةِ في حِفظِه، ومِثالَ التَّفاني والتَّضحيةِ والصِّدقِ الذي ضَرَبَهُ هؤُلاءِ العُلَماءُ العِظام. ولِلشّابِّ المُسلِمِ يَغرِسُ هذا المَوضوعُ احتِرامًا وحُبًّا عَميقَينِ لِحَديثِ النَّبِيِّ ﷺ وشُكرًا لِمَن حَفِظوهُ بِهذا الثَّمَن. ويَدعوهُ أن يُؤَدّيَ هذه الأمانةَ الغاليةَ: أن يَتَعَلَّمَ السُّنّةَ الصَّحيحةَ ويَتَّبِعَها ويَحتَرِمَها، وأن يَكونَ بالِغَ الحَذَرِ والصِّدقِ فيما يَنسُبُهُ إلى النَّبِيِّ ﷺ — فَقَد حَذَّرَ: «مَن كَذَبَ علَيَّ مُتَعَمِّدًا فَليَتَبَوَّأ مَقعَدَهُ مِنَ النّار» (البخاري ومسلم). والطّالِبُ الذي يَفهَمُ كَيفَ حُفِظَتِ السُّنّةُ يَزدادُ حُبًّا لِدينِهِ وثِقةً بِمَصادِرِه، ويَشعُرُ بِشَرَفِ الانتِماءِ إلى أُمّةٍ حَفِظَت كَلامَ نَبيِّها ﷺ بِأمانةٍ لم يَشهَدِ العالَمُ مِثلَها.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is an isnad?", ar: "ما الإسناد؟" },
      options: [
        { en: "The chain of narrators who transmitted a hadith", ar: "سِلسِلةُ الرُّواةِ الذينَ نَقَلوا الحَديث" },
        { en: "The text of the Qur'an", ar: "نَصُّ القُرآن" },
        { en: "A type of prayer", ar: "نَوعٌ مِنَ الصَّلاة" },
        { en: "A city", ar: "مَدينة" },
      ],
      correctIndex: 0,
      explanation: { en: "'The isnad is part of the religion' (Ibn al-Mubarak).", ar: "«الإسنادُ مِنَ الدّين» (ابن المبارك)." },
    },
    {
      prompt: { en: "What is jarh wa ta'dil?", ar: "ما الجَرحُ والتَّعديل؟" },
      options: [
        { en: "Critically evaluating the reliability of narrators", ar: "نَقدُ الرُّواةِ وتَقييمُ تَوثيقِهِم" },
        { en: "Writing the Qur'an", ar: "كِتابةُ القُرآن" },
        { en: "Building mosques", ar: "بِناءُ المَساجِد" },
        { en: "Leading prayer", ar: "إمامةُ الصَّلاة" },
      ],
      correctIndex: 0,
      explanation: { en: "Examining narrators' honesty and precision.", ar: "فَحصُ عَدالةِ الرُّواةِ وضَبطِهِم." },
    },
    {
      prompt: { en: "Which are the two most authentic hadith books?", ar: "ما أصَحُّ كِتابَيِ الحَديث؟" },
      options: [
        { en: "Sahih al-Bukhari and Sahih Muslim", ar: "صَحيحُ البُخاريِّ وصَحيحُ مُسلِم" },
        { en: "Two poetry books", ar: "ديوانا شِعر" },
        { en: "Two history books", ar: "كِتابا تاريخ" },
        { en: "There are none", ar: "لا يوجَد" },
      ],
      correctIndex: 0,
      explanation: { en: "The two most authentic books after the Qur'an.", ar: "أصَحُّ الكُتُبِ بَعدَ القُرآن." },
    },
    {
      prompt: { en: "Who officially ordered the codification of hadith?", ar: "مَن أمَرَ رَسميًّا بِتَدوينِ الحَديث؟" },
      options: [
        { en: "The caliph Umar ibn Abdul Aziz", ar: "الخَليفةُ عُمَرُ بنُ عَبدِ العَزيز" },
        { en: "A king of Persia", ar: "مَلِكُ فارِس" },
        { en: "No one", ar: "لا أحَد" },
        { en: "A poet", ar: "شاعِر" },
      ],
      correctIndex: 0,
      explanation: { en: "He feared the loss of knowledge.", ar: "خَشيَ ضَياعَ العِلم." },
    },
    {
      prompt: { en: "Why did scholars make great journeys (rihlah)?", ar: "لِمَ رَحَلَ العُلَماءُ الرَّحَلاتِ العَظيمة؟" },
      options: [
        { en: "To hear hadith from reliable teachers and verify narrators", ar: "لِسَماعِ الحَديثِ مِن ثِقاتٍ والتَّحَقُّقِ مِنَ الرُّواة" },
        { en: "For trade only", ar: "لِلتِّجارةِ فَقَط" },
        { en: "For tourism", ar: "لِلسِّياحة" },
        { en: "For no reason", ar: "بِلا سَبَب" },
      ],
      correctIndex: 0,
      explanation: { en: "Their devotion preserved the Sunnah accurately.", ar: "تَفانيهِم حَفِظَ السُّنّةَ بِدِقّة." },
    },
    {
      prompt: { en: "True or False: The precise science of authenticating reports is unique to the Muslims.", ar: "صَوابٌ أم خَطأ: عِلمُ تَوثيقِ الأخبارِ الدَّقيقُ خاصٌّ بِالمُسلِمين." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "No other nation preserved its reports with verified chains like this.", ar: "ما حَفِظَت أُمّةٌ أخبارَها بِأسانيدَ مُحَقَّقةٍ كَهذه." },
    },
  ],
};
