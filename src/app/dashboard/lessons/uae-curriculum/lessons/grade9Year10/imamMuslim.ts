import type { CourseLesson } from "@/components/lessons/LessonCourseStepper";
import { IMG } from "../images";

export const imamMuslim: CourseLesson = {
  slug: "g9y10-imam-muslim-may-allah-have-mercy-on-him",
  name: { en: "Imam Muslim, May Allah Have Mercy on Him", ar: "الإمامُ مُسلِمٌ رَحِمَهُ الله" },
  shortIntro: {
    en: "Imam Muslim ibn al-Hajjaj was one of the greatest scholars of hadith, whose collection 'Sahih Muslim' is, after Sahih al-Bukhari, the most authentic book after the Qur'an. This lesson studies his life, his rigorous method, and his lasting service to the preservation of the Sunnah.",
    ar: "الإمامُ مُسلِمُ بنُ الحَجّاجِ مِن أعظَمِ عُلَماءِ الحَديث، كِتابُهُ «صَحيحُ مُسلِم»، بَعدَ صَحيحِ البُخاريّ، أصَحُّ كِتابٍ بَعدَ القُرآن. يَدرُسُ هذا الدَّرسُ حَياتَهُ ومَنهَجَهُ الدَّقيقَ وخِدمَتَهُ الخالِدةَ لِحِفظِ السُّنّة.",
  },
  quranSurahs: ["Al-Hijr 9", "Fatir 28", "An-Nahl 43"],
  sections: [
    {
      title: { en: "His life and quest for knowledge", ar: "حَياتُهُ ورِحلَتُهُ في طَلَبِ العِلم" },
      learningObjectives: [
        { en: "Describe the life and character of Imam Muslim.", ar: "أصِفُ حَياةَ الإمامِ مُسلِمٍ وأخلاقَه." },
        { en: "Explain his journey in seeking hadith.", ar: "أشرَحُ رِحلَتَهُ في طَلَبِ الحَديث." },
      ],
      successCriteria: [
        { en: "I can outline key facts of Imam Muslim's life.", ar: "أُجمِلُ أبرَزَ حَقائِقِ حَياةِ الإمامِ مُسلِم." },
        { en: "I can describe his character and dedication.", ar: "أصِفُ أخلاقَهُ وتَفانِيَه." },
      ],
      image: {
        src: IMG.mountainSnow,
        alt: { en: "The lands of Khurasan and Nishapur, where Imam Muslim lived.", ar: "بِلادُ خُراسانَ ونيسابورَ حَيثُ عاشَ الإمامُ مُسلِم." },
        caption: { en: "'The scholars are the inheritors of the prophets' (Abu Dawud, Tirmidhi).", ar: "«العُلَماءُ وَرَثةُ الأنبياء» (أبو داود، التِّرمذي)." },
      },
      callout: {
        label: { en: "High-order question", ar: "سُؤالٌ عالي المُستوى" },
        title: { en: "Why did scholars travel the world to verify a single hadith?", ar: "لِمَ جابَ العُلَماءُ الأرضَ لِلتَّحَقُّقِ مِن حَديثٍ واحِد؟" },
        body: {
          en: "Imam Muslim and the hadith scholars travelled thousands of miles, enduring great hardship, sometimes for a single hadith — to hear it directly, examine its chain, and verify every narrator. Reflect: what does this immense effort tell us about how precious the Sunnah of the Prophet ﷺ is, and the lengths to which Allah inspired these scholars to go to preserve it?",
          ar: "جابَ الإمامُ مُسلِمٌ وعُلَماءُ الحَديثِ آلافَ الأميال، يَحتَمِلونَ المَشَقّةَ العَظيمة، أحيانًا لِحَديثٍ واحِد — لِيَسمَعوهُ مُباشَرةً، ويَفحَصوا سَنَدَه، ويَتَحَقَّقوا مِن كُلِّ راوٍ. تَأمَّل: ماذا يَقولُ لَنا هذا الجُهدُ الهائِلُ عن نَفاسةِ سُنّةِ النَّبِيِّ ﷺ، وعنِ المَدى الذي ألهَمَ اللهُ هؤُلاءِ العُلَماءَ أن يَبلُغوهُ لِحِفظِها؟",
        },
      },
      infoBoxes: [
        {
          label: { en: "Who was he?", ar: "مَن هو؟" },
          lines: [
            { en: "Muslim ibn al-Hajjaj an-Naysaburi (c. 206–261 AH), from Nishapur in Khurasan.", ar: "مُسلِمُ بنُ الحَجّاجِ النَّيسابوريّ (نَحوَ ٢٠٦–٢٦١ هـ)، مِن نيسابورَ بِخُراسان." },
          ],
        },
        {
          label: { en: "His teacher", ar: "شَيخُه" },
          lines: [
            { en: "He studied under Imam al-Bukhari, whom he revered greatly.", ar: "تَتَلمَذَ على الإمامِ البُخاريِّ الذي عَظَّمَهُ كَثيرًا." },
          ],
        },
      ],
      body: {
        en: "Among the towering figures in the history of Islamic scholarship stands Imam Muslim ibn al-Hajjaj al-Qushayri an-Naysaburi, may Allah have mercy on him, one of the greatest scholars of hadith the Ummah has ever produced, whose monumental collection of authentic hadith, known as Sahih Muslim, stands second only to Sahih al-Bukhari among the most authentic books ever compiled, both of them ranking, by the agreement of the scholars, as the most reliable books after the Book of Allah itself. Imam Muslim was born around the year 206 after the Hijrah in the city of Nishapur (Naysabur), a great centre of learning in the region of Khurasan in the eastern lands of the Muslim world. He was raised in a household of religion and knowledge, for his father was himself a man of learning, and from his earliest years Muslim showed a remarkable aptitude and an intense love for knowledge, beginning his study of hadith while still a young boy. He memorised the Qur'an, learned the Arabic language, and immersed himself in the religious sciences, but it was the science of hadith — the preservation and authentication of the sayings, actions, and approvals of the Prophet Muhammad ﷺ — that became the great passion and life's work to which he devoted all his energy and gifts.\n\nLike the great hadith scholars of his age, Imam Muslim understood that to gather and verify the hadith of the Prophet ﷺ, he could not remain in one place but had to travel far and wide to meet the scholars who carried the narrations, to hear the hadith directly from them, to examine their reliability, and to verify the chains of transmission. So he embarked on the rihlah — the great scholarly journey in search of knowledge — that defined the lives of the hadith masters. He travelled across the vast Muslim world, journeying to the great centres of learning: to Iraq, where he studied in Baghdad, Basra, and Kufa; to the Hijaz, the blessed lands of Makkah and Madinah; to Syria (Sham); to Egypt; and to many other cities, meeting and studying under the foremost scholars of hadith of his time. He sat with hundreds of teachers, listened to and recorded countless narrations, and tested everything he heard against the rigorous standards of the science of hadith. Among all his teachers, the one he revered most was the great Imam Muhammad ibn Isma'il al-Bukhari, the author of the most authentic collection of all. Imam Muslim recognised al-Bukhari's unmatched mastery of hadith and held him in the highest esteem, learning from his method and benefiting greatly from his knowledge; the deep respect and love between the student and the teacher is well known, and Imam Muslim defended al-Bukhari and remained loyal to him even when others turned against him.\n\nImam Muslim was renowned not only for his vast knowledge but also for his noble character, his piety, his honesty, and his scrupulous care in the religion. He was known for his truthfulness and his trustworthiness, qualities that are absolutely essential in the science of hadith, where the entire enterprise rests upon the reliability and integrity of those who transmit the narrations. He was generous, dignified, and beautiful in conduct, earning the love and respect of the scholars and the people of his city. He combined immense learning with deep humility and God-consciousness, never using his knowledge for worldly gain or fame, but devoting it entirely to the service of the religion and the preservation of the Sunnah of the Prophet ﷺ. The scholars of his age and those who came after him praised him in the highest terms, recognising him as one of the imams of hadith, a master of the science, and a man of exceptional precision and reliability. He lived a life wholly dedicated to knowledge — gathering it, verifying it, preserving it, and teaching it — until he passed away in his native Nishapur around the year 261 after the Hijrah, leaving behind a legacy that would benefit the Ummah until the end of time. His life stands as a shining example of what it means to dedicate oneself entirely to the service of Allah's religion, and of the immense effort, sacrifice, and devotion through which Allah preserved the Sunnah of His Prophet ﷺ for all generations. In the next section we examine his greatest achievement: his Sahih and his service to the preservation of the Sunnah.",
        ar: "مِنَ القاماتِ الشّامِخةِ في تاريخِ العِلمِ الإسلاميِّ يَقِفُ الإمامُ مُسلِمُ بنُ الحَجّاجِ القُشَيريُّ النَّيسابوريُّ رَحِمَهُ الله، أحَدُ أعظَمِ عُلَماءِ الحَديثِ الذينَ أنجَبَتهُمُ الأُمّة، صاحِبُ المَجموعةِ العَظيمةِ مِنَ الحَديثِ الصَّحيحِ المَعروفةِ بِـ«صَحيحِ مُسلِم»، التي لا تَتلوها في الصِّحّةِ إلّا «صَحيحُ البُخاريّ»، وكِلاهُما، بِاتِّفاقِ العُلَماء، أصَحُّ الكُتُبِ بَعدَ كِتابِ اللهِ نَفسِه. وُلِدَ الإمامُ مُسلِمٌ نَحوَ سَنةِ ٢٠٦ لِلهِجرةِ في مَدينةِ نيسابور، أحَدِ مَراكِزِ العِلمِ العَظيمةِ في إقليمِ خُراسانَ في شَرقِ العالَمِ الإسلاميّ. نَشَأَ في بَيتِ دينٍ وعِلم، فَأبوهُ كانَ هو نَفسُهُ مِن أهلِ العِلم، ومُنذُ نُعومةِ أظفارِهِ أظهَرَ مُسلِمٌ نُبوغًا لافِتًا وحُبًّا شَديدًا لِلعِلم، فَبَدَأَ طَلَبَ الحَديثِ وهو غُلامٌ صَغير. حَفِظَ القُرآن، وتَعَلَّمَ العَرَبيّة، وانكَبَّ على العُلومِ الشَّرعيّة، لكِن عِلمَ الحَديثِ — حِفظَ أقوالِ النَّبِيِّ مُحَمَّدٍ ﷺ وأفعالِهِ وتَقريراتِهِ والتَّحَقُّقَ مِنها — هو الذي صارَ شَغَفَهُ العَظيمَ وعَمَلَ عُمُرِهِ الذي وَهَبَ لَهُ كُلَّ طاقَتِهِ ومَواهِبِه.\n\nوكَما عُلَماءُ الحَديثِ العِظامُ في عَصرِه، أدرَكَ الإمامُ مُسلِمٌ أنَّهُ لِيَجمَعَ حَديثَ النَّبِيِّ ﷺ ويَتَحَقَّقَ مِنه، لا يَستَطيعُ البَقاءَ في مَكانٍ واحِد، بل علَيهِ أن يُسافِرَ بَعيدًا واسِعًا لِيَلقى العُلَماءَ الذينَ يَحمِلونَ الرِّواياتِ، ويَسمَعَ الحَديثَ مِنهُم مُباشَرةً، ويَفحَصَ ثِقَتَهُم، ويَتَحَقَّقَ مِن أسانيدِ النَّقل. فانطَلَقَ في الرِّحلةِ — الرِّحلةِ العِلميّةِ العَظيمةِ في طَلَبِ العِلم — التي عَرَّفَت حَياةَ أئِمّةِ الحَديث. جابَ العالَمَ الإسلاميَّ الواسِع، مُرتَحِلًا إلى مَراكِزِ العِلمِ الكُبرى: إلى العِراق، حَيثُ دَرَسَ في بَغدادَ والبَصرةِ والكوفة؛ وإلى الحِجاز، أرضِ مَكّةَ والمَدينةِ المُبارَكة؛ وإلى الشّام؛ ومِصر؛ ومُدُنٍ أُخرى كَثيرة، يَلقى ويَدرُسُ على كِبارِ عُلَماءِ الحَديثِ في زَمانِه. جالَسَ مِئاتِ الشُّيوخ، وسَمِعَ وسَجَّلَ رِواياتٍ لا تُحصى، واختَبَرَ كُلَّ ما سَمِعَ بِمَعاييرِ عِلمِ الحَديثِ الصّارِمة. وكانَ أعظَمَ مَن عَظَّمَ مِن شُيوخِهِ الإمامَ العَظيمَ مُحَمَّدَ بنَ إسماعيلَ البُخاريّ، صاحِبَ أصَحِّ المَجموعاتِ على الإطلاق. أدرَكَ الإمامُ مُسلِمٌ تَفَوُّقَ البُخاريِّ الذي لا يُجارى في الحَديث، وأكبَرَهُ غايةَ الإكبار، يَتَعَلَّمُ مِن مَنهَجِهِ ويُفيدُ مِن عِلمِهِ كَثيرًا؛ والاحتِرامُ والحُبُّ العَميقُ بَينَ التِّلميذِ والشَّيخِ مَعروف، وقد دافَعَ مُسلِمٌ عنِ البُخاريِّ وبَقيَ وَفيًّا لَهُ حَتّى حينَ انقَلَبَ علَيهِ غَيرُه.\n\nواشتُهِرَ الإمامُ مُسلِمٌ لا بِغَزارةِ عِلمِهِ فَحَسب بل بِنُبلِ خُلُقِهِ وتَقواهُ وصِدقِهِ ووَرَعِهِ في الدّين. عُرِفَ بِالصِّدقِ والأمانة، وهُما صِفَتانِ لا غِنى عَنهُما في عِلمِ الحَديثِ الذي يَقومُ كُلُّهُ على ثِقةِ ناقِليهِ ونَزاهَتِهِم. كانَ كَريمًا وَقورًا حَسَنَ السَّمت، نالَ بِهِ حُبَّ العُلَماءِ وأهلِ مَدينَتِهِ واحتِرامَهُم. جَمَعَ بَينَ العِلمِ الواسِعِ والتَّواضُعِ العَميقِ وخَشيةِ الله، لم يَستَعمِلْ عِلمَهُ لِمَكسَبٍ دُنيَويٍّ أو شُهرة، بل وَهَبَهُ كُلَّهُ لِخِدمةِ الدّينِ وحِفظِ سُنّةِ النَّبِيِّ ﷺ. وأثنى علَيهِ عُلَماءُ عَصرِهِ ومَن بَعدَهُم بِأعظَمِ الثَّناء، فَعَدّوهُ أحَدَ أئِمّةِ الحَديثِ وحُذّاقِ هذا العِلمِ ورِجالَ الدِّقّةِ والإتقانِ النّادِرين. عاشَ حَياةً وَقفًا كامِلًا على العِلم — جَمعًا وتَحَقُّقًا وحِفظًا وتَعليمًا — حَتّى تُوُفِّيَ في نيسابورَ مَسقَطِ رَأسِهِ نَحوَ سَنةِ ٢٦١ لِلهِجرة، تارِكًا إرثًا يَنفَعُ الأُمّةَ إلى آخِرِ الزَّمان. وحَياتُهُ مَثَلٌ مُضيءٌ لِمَعنى أن يَهَبَ المَرءُ نَفسَهُ كُلَّها لِخِدمةِ دينِ الله، ولِلجُهدِ والتَّضحيةِ والتَّفاني الهائِلِ الذي حَفِظَ اللهُ بِهِ سُنّةَ نَبِيِّهِ ﷺ لِكُلِّ الأجيال. وفي القِسمِ التّالي نَتَناوَلُ أعظَمَ إنجازاتِه: صَحيحَهُ وخِدمَتَهُ لِحِفظِ السُّنّة.",
      },
    },
    {
      title: { en: "Sahih Muslim and the preservation of the Sunnah", ar: "صَحيحُ مُسلِمٍ وحِفظُ السُّنّة" },
      learningObjectives: [
        { en: "Describe Sahih Muslim and its rigorous method.", ar: "أصِفُ صَحيحَ مُسلِمٍ ومَنهَجَهُ الدَّقيق." },
        { en: "Explain the importance of preserving the Sunnah.", ar: "أشرَحُ أهَمِّيّةَ حِفظِ السُّنّة." },
      ],
      image: {
        src: IMG.grandMosque,
        alt: { en: "Manuscripts and a mosque — the preserved Sunnah of the Prophet ﷺ.", ar: "مَخطوطاتٌ ومَسجِد — سُنّةُ النَّبِيِّ ﷺ المَحفوظة." },
        caption: { en: "Sahih Muslim is, after Sahih al-Bukhari, the most authentic book after the Qur'an.", ar: "صَحيحُ مُسلِمٍ بَعدَ صَحيحِ البُخاريِّ أصَحُّ كِتابٍ بَعدَ القُرآن." },
      },
      groupTasks: {
        title: { en: "Guardians of the Sunnah", ar: "حُرّاسُ السُّنّة" },
        instruction: { en: "Each group prepares one part.", ar: "تُعِدُّ كُلُّ مَجموعةٍ جُزءًا." },
        groups: [
          {
            slug: "the-method-of-sahih-muslim",
            name: { en: "Team A — The method of Sahih Muslim", ar: "الفَريقُ أ — مَنهَجُ صَحيحِ مُسلِم" },
            learningObjective: { en: "Explain how Imam Muslim verified hadith.", ar: "نَشرَحُ كَيفَ تَحَقَّقَ الإمامُ مُسلِمٌ مِنَ الحَديث." },
            task: { en: "Explain the rigorous method of Sahih Muslim: how Imam Muslim selected only authentic (sahih) hadith from a huge number he had collected; his strict conditions for an unbroken chain (sanad) of reliable, trustworthy narrators; his care in arranging narrations and gathering the different routes of a hadith; and his famous introduction on the science of hadith. Show how the science of isnad (chain of narration) protected the Sunnah from forgery. Present a 'how a hadith is verified' explainer.", ar: "اشرَحوا مَنهَجَ صَحيحِ مُسلِمٍ الدَّقيق: كَيفَ انتَقى الإمامُ مُسلِمٌ الصَّحيحَ فَقَط مِن عَدَدٍ هائِلٍ جَمَعَه؛ وشُروطَهُ الصّارِمةَ لِسَنَدٍ مُتَّصِلٍ مِن رُواةٍ ثِقاتٍ عُدول؛ وعِنايَتَهُ بِتَرتيبِ الرِّواياتِ وجَمعِ طُرُقِ الحَديث؛ ومُقَدِّمَتَهُ المَشهورةَ في عِلمِ الحَديث. بَيِّنوا كَيفَ حَمى عِلمُ الإسنادِ السُّنّةَ مِنَ الوَضع. اعرِضوا شَرحَ «كَيفَ يُتَحَقَّقُ مِن حَديث»." },
            evidence: [
              { en: "The science of isnad is unique to this Ummah and preserved the Sunnah.", ar: "عِلمُ الإسنادِ خاصٌّ بِهذه الأُمّةِ وحَفِظَ السُّنّة." },
            ],
            sourceNotes: [
              { en: "Only rigorously authenticated hadith entered the Sahih.", ar: "لم يَدخُلِ الصَّحيحَ إلّا ما صَحَّ بِدِقّة." },
            ],
            memberRoles: [
              { en: "Researcher, Explainer, Presenter.", ar: "الباحِث، الشّارِح، العارِض." },
            ],
            finalProduct: { en: "A 'how a hadith is verified' explainer.", ar: "شَرحُ «كَيفَ يُتَحَقَّقُ مِن حَديث»." },
          },
          {
            slug: "preserving-the-sunnah",
            name: { en: "Team B — Preserving the Sunnah", ar: "الفَريقُ ب — حِفظُ السُّنّة" },
            learningObjective: { en: "Explain why preserving the Sunnah matters.", ar: "نَشرَحُ لِمَ يُهِمُّ حِفظُ السُّنّة." },
            task: { en: "Explore why the preservation of the Sunnah is so important: the Sunnah explains and complements the Qur'an; it is a source of Islamic law (Allah commanded obedience to the Messenger); Allah promised to preserve His revelation (Al-Hijr 9); and scholars like Bukhari, Muslim, and the authors of the other Sunan books were a means of this preservation. Show how we benefit from their work today and our duty to honour, study, and act upon authentic hadith. Present a 'preserving the Sunnah' display.", ar: "استَكشِفوا لِمَ حِفظُ السُّنّةِ بالِغُ الأهَمِّيّة: السُّنّةُ تُبَيِّنُ القُرآنَ وتُكَمِّلُه؛ وهي مَصدَرٌ مِن مَصادِرِ التَّشريع (أمَرَ اللهُ بِطاعةِ الرَّسول)؛ ووَعَدَ اللهُ بِحِفظِ وَحيِه (الحجر ٩)؛ وكانَ عُلَماءُ كَالبُخاريِّ ومُسلِمٍ وأصحابِ السُّنَنِ وَسيلةً لِهذا الحِفظ. بَيِّنوا كَيفَ نَنتَفِعُ بِعَمَلِهِمُ اليَوم، وواجِبَنا في تَكريمِ الحَديثِ الصَّحيحِ ودِراسَتِهِ والعَمَلِ بِه. اعرِضوا لَوحةَ «حِفظِ السُّنّة»." },
            evidence: [
              { en: "Al-Hijr 9: 'Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian'.", ar: "الحجر ٩: ﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾." },
            ],
            sourceNotes: [
              { en: "Honouring scholars means studying and acting on their work.", ar: "تَكريمُ العُلَماءِ بِدِراسةِ عِلمِهِم والعَمَلِ بِه." },
            ],
            memberRoles: [
              { en: "Researcher, Writer, Presenter.", ar: "الباحِث، الكاتِب، العارِض." },
            ],
            finalProduct: { en: "A 'preserving the Sunnah' display.", ar: "لَوحةُ «حِفظِ السُّنّة»." },
          },
        ],
      },
      responsePrompt: {
        title: { en: "Honouring the guardians of the Sunnah", ar: "تَكريمُ حُرّاسِ السُّنّة" },
        prompt: { en: "Imam Muslim devoted his entire life — travelling the world, enduring hardship, and applying the strictest standards — to gather and preserve the authentic Sunnah of the Prophet ﷺ, so that we today can read it with confidence. Reflect on the debt we owe to scholars like him: how often do you read or study hadith? Do you value the Sunnah as it deserves? What does Imam Muslim's lifelong dedication to knowledge inspire in you? Write about one way you will honour his legacy — by learning, valuing, and acting upon the authentic Sunnah of the Prophet ﷺ.", ar: "وَهَبَ الإمامُ مُسلِمٌ حَياتَهُ كُلَّها — يَجوبُ العالَمَ، ويَحتَمِلُ المَشَقّة، ويُطَبِّقُ أصرَمَ المَعايير — لِجَمعِ سُنّةِ النَّبِيِّ ﷺ الصَّحيحةِ وحِفظِها، حَتّى نَقرَأَها اليَومَ بِثِقة. تَأمَّل ما نَدينُ بِهِ لِعُلَماءَ مِثلِه: كَم تَقرَأُ الحَديثَ أو تَدرُسُه؟ أتُقَدِّرُ السُّنّةَ حَقَّ قَدرِها؟ ماذا يُلهِمُكَ تَفاني الإمامِ مُسلِمٍ في العِلمِ طَوالَ حَياتِه؟ اكتُب طَريقةً واحِدةً سَتُكرِمُ بِها إرثَه — بِتَعَلُّمِ سُنّةِ النَّبِيِّ ﷺ الصَّحيحةِ وتَقديرِها والعَمَلِ بِها." },
        placeholder: { en: "We owe scholars like Imam Muslim... His dedication inspires me to... I will honour the Sunnah by...", ar: "نَدينُ لِعُلَماءَ كَالإمامِ مُسلِمٍ بِـ... ويُلهِمُني تَفانيهِ أن... وسَأُكرِمُ السُّنّةَ بِـ..." },
      },
      body: {
        en: "The crowning achievement of Imam Muslim's life, and the legacy through which Allah preserved his service to the Ummah, is his great collection of authentic hadith, known as Al-Musnad as-Sahih or, as it is universally called, Sahih Muslim. This monumental work stands, by the consensus of the scholars, as one of the two most authentic books ever compiled by human hands — second only to Sahih al-Bukhari — and together the two are honoured as the most reliable books in Islam after the Book of Allah itself. The greatness of Sahih Muslim lies not merely in the number of hadith it contains, but in the extraordinary rigour and precision with which Imam Muslim selected and verified every single narration. It is reported that Imam Muslim gathered an enormous number of hadith — around three hundred thousand by some accounts — yet he included in his Sahih only those that met his exacting conditions of authenticity, selecting a few thousand carefully verified hadith from this vast pool. He himself stated that he did not place a hadith in his Sahih except with proof, nor did he omit one except with proof, showing the deliberate care behind every choice he made. He applied the strictest standards: the chain of narration (isnad) had to be unbroken, connecting all the way back to the Prophet ﷺ; and every single narrator in the chain had to be reliable, trustworthy, of sound memory, and known for integrity and precision.\n\nImam Muslim also distinguished his work through its excellent arrangement and organisation. He took great care to gather all the different chains and wordings of a single hadith together in one place, making it easier for scholars to study and compare the various routes of transmission — a method that scholars have praised as superior to others in this respect. He prefaced his collection with a valuable and famous introduction (muqaddimah), in which he laid out important principles of the science of hadith, discussed the conditions of acceptable narration, and warned against weak and unreliable narrators, making his introduction itself a foundational text in the methodology of hadith criticism. The work of Imam Muslim, like that of his teacher al-Bukhari and the other great compilers of hadith such as the authors of the Sunan — Abu Dawud, at-Tirmidhi, an-Nasa'i, and Ibn Majah — was part of a magnificent collective endeavour by which Allah preserved the Sunnah of His Prophet ﷺ. This is connected to one of the greatest miracles of this Ummah: the science of isnad, the chain of narration, by which every hadith was traced back through a documented chain of named, examined, and verified transmitters all the way to the Prophet ﷺ. No other nation or religion in history has preserved the words of its prophet with such meticulous, scientific precision. Through this science, forged and weak narrations could be distinguished from authentic ones, and the pure Sunnah of the Prophet ﷺ was protected from corruption and loss.\n\nThe preservation of the Sunnah, which was the life's work of Imam Muslim and the scholars of hadith, is of immense importance in Islam, for the Sunnah of the Prophet ﷺ is the second great source of the religion after the Qur'an. The Sunnah explains and clarifies the Qur'an, detailing how its general commands are to be carried out — it is the Sunnah that teaches us how to pray, how to give zakat, how to perform Hajj, and how to apply the guidance of the Qur'an in every area of life. Allah commanded obedience to His Messenger alongside obedience to Himself, saying, 'Whoever obeys the Messenger has obeyed Allah' (An-Nisa 80), and He made the Prophet ﷺ the perfect example to be followed: 'There has certainly been for you in the Messenger of Allah an excellent pattern' (Al-Ahzab 21). Allah has promised to preserve His revelation, declaring, 'Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian' (Al-Hijr 9), and part of the fulfilment of this divine promise was that Allah raised up scholars like Imam Muslim — men of extraordinary memory, precision, integrity, and devotion — to gather, verify, and preserve the Sunnah for all generations. For the young Muslim today, the life and work of Imam Muslim carry a profound lesson and inspiration. First, they teach the immense value of the Sunnah and the duty to honour, study, and act upon the authentic hadith of the Prophet ﷺ, which has reached us through the sacrifices of these great scholars. Second, they offer a shining example of dedication to knowledge: a man who travelled the world, endured hardship, and devoted his entire life to a single noble goal in the service of Allah's religion, never for fame or wealth but purely for the sake of preserving the guidance of the Prophet ﷺ. And third, they fill the heart with gratitude to Allah, who preserved the religion through such men, and with love and respect for the scholars who are, as the Prophet ﷺ described them, 'the inheritors of the prophets' (Abu Dawud and Tirmidhi). The young Muslim honours the legacy of Imam Muslim not merely by remembering his name, but by valuing the Sunnah he preserved, by seeking authentic knowledge, by following the example of the Prophet ﷺ that has been so carefully transmitted to us, and by aspiring to dedicate his own talents and energy to the service of his religion, each in his own way.",
        ar: "تاجُ إنجازاتِ الإمامِ مُسلِمٍ في حَياتِه، والإرثُ الذي حَفِظَ اللهُ بِهِ خِدمَتَهُ لِلأُمّة، مَجموعَتُهُ العَظيمةُ مِنَ الحَديثِ الصَّحيحِ المَعروفةُ بِـ«المُسنَدِ الصَّحيح» أو، كَما تُسَمّى عُمومًا، «صَحيحِ مُسلِم». هذا العَمَلُ الضَّخمُ يَقِفُ، بِإجماعِ العُلَماء، أحَدَ أصَحِّ كِتابَينِ صَنَّفَتهُما يَدُ البَشَرِ على الإطلاق — لا يَتَقَدَّمُهُ إلّا «صَحيحُ البُخاريّ» — وكِلاهُما يُكَرَّمُ بِكَونِهِ أوثَقَ الكُتُبِ في الإسلامِ بَعدَ كِتابِ اللهِ نَفسِه. وعَظَمةُ صَحيحِ مُسلِمٍ لا تَكمُنُ في عَدَدِ ما فيهِ مِنَ الحَديثِ فَحَسب، بل في الدِّقّةِ والصَّرامةِ الفائِقةِ التي انتَقى بِها الإمامُ مُسلِمٌ كُلَّ رِوايةٍ وتَحَقَّقَ مِنها. ويُروى أنَّ الإمامَ مُسلِمًا جَمَعَ عَدَدًا هائِلًا مِنَ الحَديث — نَحوَ ثَلاثِمِئةِ ألفٍ في بَعضِ الأقوال — لكِنَّهُ لم يُدخِل صَحيحَهُ إلّا ما استَوفى شُروطَهُ الصّارِمةَ في الصِّحّة، فانتَقى بِضعةَ آلافٍ مِنَ الحَديثِ المُحَقَّقِ بِعِنايةٍ مِن هذا البَحرِ الواسِع. وقد قالَ هو نَفسُه إنَّهُ ما وَضَعَ حَديثًا في صَحيحِهِ إلّا بِحُجّة، ولا تَرَكَ حَديثًا إلّا بِحُجّة، مُبَيِّنًا العِنايةَ المَقصودةَ خَلفَ كُلِّ اختيار. طَبَّقَ أصرَمَ المَعايير: فالسَّنَدُ يَجِبُ أن يَكونَ مُتَّصِلًا، يَصِلُ حَتّى النَّبِيِّ ﷺ؛ وكُلُّ راوٍ في السَّنَدِ يَجِبُ أن يَكونَ ثِقةً عَدلًا ضابِطًا مَعروفًا بِالنَّزاهةِ والإتقان.\n\nوتَمَيَّزَ عَمَلُ الإمامِ مُسلِمٍ كَذلك بِحُسنِ تَرتيبِهِ وتَنظيمِه. اعتَنى غايةَ العِنايةِ بِجَمعِ كُلِّ أسانيدِ الحَديثِ الواحِدِ وألفاظِهِ في مَكانٍ واحِد، مُيَسِّرًا على العُلَماءِ دِراسةَ طُرُقِ النَّقلِ المُختَلِفةِ ومُقارَنَتَها — مَنهَجٌ أثنى علَيهِ العُلَماءُ وعَدّوهُ مُتَفَوِّقًا على غَيرِهِ في هذا الجانِب. وصَدَّرَ مَجموعَتَهُ بِمُقَدِّمةٍ قَيِّمةٍ مَشهورة، وَضَعَ فيها مَبادِئَ مُهِمّةً في عِلمِ الحَديث، وبَحَثَ شُروطَ الرِّوايةِ المَقبولة، وحَذَّرَ مِنَ الرُّواةِ الضُّعَفاءِ غَيرِ الثِّقات، فَصارَت مُقَدِّمَتُهُ نَفسُها نَصًّا تَأسيسيًّا في مَنهَجِ نَقدِ الحَديث. وعَمَلُ الإمامِ مُسلِمٍ، كَعَمَلِ شَيخِهِ البُخاريِّ وسائِرِ كِبارِ جامِعي الحَديثِ كَأصحابِ السُّنَن — أبي داود، والتِّرمذيّ، والنَّسائيّ، وابنِ ماجه — كانَ جُزءًا مِن جُهدٍ جَماعيٍّ عَظيمٍ حَفِظَ اللهُ بِهِ سُنّةَ نَبِيِّهِ ﷺ. وهذا مُتَّصِلٌ بِأحَدِ أعظَمِ مُعجِزاتِ هذه الأُمّة: عِلمِ الإسناد، سِلسِلةِ النَّقل، التي رُدَّ بِها كُلُّ حَديثٍ عَبرَ سِلسِلةٍ مُوَثَّقةٍ مِن رُواةٍ مُسَمَّينَ مَفحوصينَ مُحَقَّقينَ حَتّى النَّبِيِّ ﷺ. ولم تَحفَظ أُمّةٌ ولا دينٌ في التّاريخِ كَلامَ نَبِيِّها بِمِثلِ هذه الدِّقّةِ العِلميّةِ المُتناهِية. وبِهذا العِلمِ أمكَنَ تَمييزُ المَوضوعِ والضَّعيفِ مِنَ الصَّحيح، وحُفِظَت سُنّةُ النَّبِيِّ ﷺ الطّاهِرةُ مِنَ التَّحريفِ والضَّياع.\n\nوحِفظُ السُّنّة، الذي كانَ عَمَلَ عُمُرِ الإمامِ مُسلِمٍ وعُلَماءِ الحَديث، بالِغُ الأهَمِّيّةِ في الإسلام، فَسُنّةُ النَّبِيِّ ﷺ هي المَصدَرُ الثّاني العَظيمُ لِلدّينِ بَعدَ القُرآن. السُّنّةُ تَشرَحُ القُرآنَ وتُبَيِّنُه، تُفَصِّلُ كَيفَ تُؤَدّى أوامِرُهُ المُجمَلة — فَالسُّنّةُ هي التي تُعَلِّمُنا كَيفَ نُصَلّي، وكَيفَ نُؤَدّي الزَّكاة، وكَيفَ نَحُجّ، وكَيفَ نُطَبِّقُ هَديَ القُرآنِ في كُلِّ مَجالٍ مِنَ الحَياة. وقد أمَرَ اللهُ بِطاعةِ رَسولِهِ معَ طاعَتِه، فَقال: ﴿مَن يُطِعِ الرَّسولَ فَقَد أطاعَ الله﴾ (النساء ٨٠)، وجَعَلَ النَّبِيَّ ﷺ القُدوةَ الكامِلةَ المُتَّبَعة: ﴿لَقَد كانَ لَكُم في رَسولِ اللهِ أُسوةٌ حَسَنة﴾ (الأحزاب ٢١). ووَعَدَ اللهُ بِحِفظِ وَحيِه، فَقال: ﴿إنّا نَحنُ نَزَّلنا الذِّكرَ وإنّا لَهُ لَحافِظون﴾ (الحجر ٩)، وكانَ مِن تَمامِ هذا الوَعدِ الإلهيِّ أنْ أقامَ اللهُ عُلَماءَ كَالإمامِ مُسلِم — رِجالَ حِفظٍ وإتقانٍ ونَزاهةٍ وتَفانٍ نادِر — لِجَمعِ السُّنّةِ والتَّحَقُّقِ مِنها وحِفظِها لِكُلِّ الأجيال. ولِلشّابِّ المُسلِمِ اليَومَ، تَحمِلُ حَياةُ الإمامِ مُسلِمٍ وعَمَلُهُ دَرسًا عَميقًا وإلهامًا. أوَّلًا، تُعَلِّمُهُ القيمةَ العَظيمةَ لِلسُّنّةِ وواجِبَ تَكريمِ حَديثِ النَّبِيِّ ﷺ الصَّحيحِ ودِراسَتِهِ والعَمَلِ بِه، الذي وَصَلَنا بِتَضحياتِ هؤُلاءِ العُلَماءِ العِظام. وثانيًا، تُقَدِّمُ مَثَلًا مُضيئًا لِلتَّفاني في العِلم: رَجُلٌ جابَ العالَم، واحتَمَلَ المَشَقّة، ووَهَبَ حَياتَهُ كُلَّها لِهَدَفٍ نَبيلٍ واحِدٍ في خِدمةِ دينِ الله، لا لِشُهرةٍ ولا مال، بل خالِصًا لِحِفظِ هَديِ النَّبِيِّ ﷺ. وثالِثًا، تَملَأُ القَلبَ شُكرًا لِلهِ الذي حَفِظَ الدّينَ بِمِثلِ هؤُلاء، وحُبًّا واحتِرامًا لِلعُلَماءِ الذينَ هُم، كَما وَصَفَهُمُ النَّبِيُّ ﷺ، «وَرَثةُ الأنبياء» (أبو داود والتِّرمذي). ويُكرِمُ الشّابُّ المُسلِمُ إرثَ الإمامِ مُسلِمٍ لا بِتَذَكُّرِ اسمِهِ فَحَسب، بل بِتَقديرِ السُّنّةِ التي حَفِظَها، وطَلَبِ العِلمِ الصَّحيح، واتِّباعِ هَديِ النَّبِيِّ ﷺ الذي نُقِلَ إلَينا بِكُلِّ هذه العِناية، والطُّموحِ إلى أن يَهَبَ مَواهِبَهُ وطاقَتَهُ لِخِدمةِ دينِه، كُلٌّ بِطَريقَتِه.",
      },
    },
  ],
  quizQuestions: [
    {
      prompt: { en: "What is the rank of Sahih Muslim among Islamic books?", ar: "ما مَنزِلةُ صَحيحِ مُسلِمٍ بَينَ كُتُبِ الإسلام؟" },
      options: [
        { en: "After Sahih al-Bukhari, the most authentic book after the Qur'an", ar: "بَعدَ صَحيحِ البُخاريّ، أصَحُّ كِتابٍ بَعدَ القُرآن" },
        { en: "A book of poetry", ar: "كِتابُ شِعر" },
        { en: "A weak collection", ar: "مَجموعةٌ ضَعيفة" },
        { en: "A history book", ar: "كِتابُ تاريخ" },
      ],
      correctIndex: 0,
      explanation: { en: "The two Sahihs are the most reliable books after the Qur'an.", ar: "الصَّحيحانِ أوثَقُ الكُتُبِ بَعدَ القُرآن." },
    },
    {
      prompt: { en: "Where was Imam Muslim from?", ar: "مِن أينَ كانَ الإمامُ مُسلِم؟" },
      options: [
        { en: "Nishapur, in Khurasan", ar: "نيسابور، في خُراسان" },
        { en: "Makkah", ar: "مَكّة" },
        { en: "Cordoba", ar: "قُرطُبة" },
        { en: "Damascus", ar: "دِمَشق" },
      ],
      correctIndex: 0,
      explanation: { en: "He was born and died in Nishapur.", ar: "وُلِدَ وتُوُفِّيَ في نيسابور." },
    },
    {
      prompt: { en: "Who was Imam Muslim's most revered teacher?", ar: "مَن أعظَمُ شُيوخِ الإمامِ مُسلِم؟" },
      options: [
        { en: "Imam al-Bukhari", ar: "الإمامُ البُخاريّ" },
        { en: "Abu Jahl", ar: "أبو جَهل" },
        { en: "A poet", ar: "شاعِر" },
        { en: "No one", ar: "لا أحَد" },
      ],
      correctIndex: 0,
      explanation: { en: "He revered al-Bukhari and stayed loyal to him.", ar: "عَظَّمَ البُخاريَّ وبَقيَ وَفيًّا لَه." },
    },
    {
      prompt: { en: "What made Sahih Muslim so reliable?", ar: "ما الذي جَعَلَ صَحيحَ مُسلِمٍ مَوثوقًا؟" },
      options: [
        { en: "Strict conditions: unbroken chains of reliable narrators", ar: "شُروطٌ صارِمة: أسانيدُ مُتَّصِلةٌ مِن رُواةٍ ثِقات" },
        { en: "It included every hadith he heard", ar: "ضَمَّ كُلَّ ما سَمِعَ" },
        { en: "It was written quickly", ar: "كُتِبَ بِسُرعة" },
        { en: "It had no method", ar: "بِلا مَنهَج" },
      ],
      correctIndex: 0,
      explanation: { en: "He selected only authenticated hadith from a vast number.", ar: "انتَقى الصَّحيحَ فَقَط مِن عَدَدٍ هائِل." },
    },
    {
      prompt: { en: "What science uniquely preserved the Sunnah from forgery?", ar: "أيُّ عِلمٍ حَفِظَ السُّنّةَ مِنَ الوَضعِ تَفَرُّدًا؟" },
      options: [
        { en: "The science of isnad (chain of narration)", ar: "عِلمُ الإسناد (سِلسِلةُ النَّقل)" },
        { en: "Astronomy", ar: "عِلمُ الفَلَك" },
        { en: "Poetry", ar: "الشِّعر" },
        { en: "Trade", ar: "التِّجارة" },
      ],
      correctIndex: 0,
      explanation: { en: "Every hadith traced back through verified narrators to the Prophet ﷺ.", ar: "كُلُّ حَديثٍ مَردودٌ عَبرَ رُواةٍ مُحَقَّقينَ لِلنَّبِيِّ ﷺ." },
    },
    {
      prompt: { en: "True or False: Allah promised to preserve His revelation (Al-Hijr 9).", ar: "صَوابٌ أم خَطأ: وَعَدَ اللهُ بِحِفظِ وَحيِه (الحجر ٩)." },
      options: [
        { en: "True", ar: "صَواب" },
        { en: "False", ar: "خَطأ" },
      ],
      correctIndex: 0,
      explanation: { en: "Scholars like Imam Muslim were a means of this preservation.", ar: "كانَ عُلَماءُ كَمُسلِمٍ وَسيلةً لِهذا الحِفظ." },
    },
  ],
};
