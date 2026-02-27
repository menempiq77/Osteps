import type { ProphetStory, ProphetStorySection } from "../stories-of-the-prophets/stories";

const TOPIC_TITLES = [
  { en: "Foundations of 'Aqidah", ar: "أسس العقيدة" },
  { en: "Methodology of Ahl al-Sunnah in Allah's Names and Attributes", ar: "منهج أهل السنة في أسماء الله وصفاته" },
  { en: "Evidence for the Methodology", ar: "الدليل على المنهج" },
  { en: "Allah's Attributes in the Qur'an", ar: "صفات الله في القرآن" },
  { en: "Affirmation and Negation in Surah Al-Ikhlas", ar: "الإثبات والنفي في سورة الإخلاص" },
  { en: "Affirmation and Negation in Ayat al-Kursi", ar: "الإثبات والنفي في آية الكرسي" },
  { en: "Attributes of Life, First, Last, Outward, and Inward", ar: "صفات الحياة والأول والآخر والظاهر والباطن" },
  { en: "Attributes of Knowledge and Might", ar: "صفات العلم والقدرة" },
  { en: "Attributes of Hearing, Seeing, and Will", ar: "صفات السمع والبصر والإرادة" },
  { en: "Attribute of Love", ar: "صفة المحبة" },
  { en: "Attribute of Mercy", ar: "صفة الرحمة" },
  { en: "Attributes of Pleasure, Anger, and Coming", ar: "صفات الرضا والغضب والمجيء" },
  { en: "Attributes of Face and Hand", ar: "صفات الوجه واليد" },
  { en: "Attributes of Eyes, Seeing, and Hearing", ar: "صفات العين والبصر والسمع" },
  { en: "Attribute of Power and Planning", ar: "صفة القوة والمكر" },
  { en: "Attributes of Forgiveness and Might", ar: "صفات المغفرة والعزة" },
  { en: "Attribute of Oneness", ar: "صفة الوحدانية" },
  { en: "Attribute of Settling on the Throne and Highness", ar: "صفة الاستواء والعلو" },
  { en: "Attribute of Omnipresence (Closeness)", ar: "صفة القرب" },
  { en: "Attribute of Speech", ar: "صفة الكلام" },
  { en: "The Qur'an is the Speech of Allah", ar: "القرآن كلام الله" },
  { en: "Seeing Allah", ar: "رؤية الله" },
  { en: "Evidence from the Sunnah Regarding Allah's Attributes", ar: "الدليل من السنة على صفات الله" },
  { en: "Belief in the Hereafter", ar: "الإيمان بالآخرة" },
  { en: "The Trial of the Grave and Resurrection", ar: "فتنة القبر والبعث" },
  { en: "Records of Deeds", ar: "الصحف والكتب" },
  { en: "The Prophet's Fountain (Al-Hawd)", ar: "الحوض" },
  { en: "Intercession (Shafa'ah)", ar: "الشفاعة" },
  { en: "Divine Decree (Al-Qadar)", ar: "القدر" },
  { en: "Belief (Iman)", ar: "الإيمان" },
  { en: "The Companions of the Prophet (Sahabah)", ar: "الصحابة" },
  { en: "The Family of the Prophet (Ahl al-Bayt)", ar: "أهل البيت" },
  { en: "The Wives of the Prophet (Mothers of the Believers)", ar: "أمهات المؤمنين" },
  { en: "The Miracles of the Saints (Awliya')", ar: "كرامات الأولياء" },
  { en: "The Path of Ahl al-Sunnah wal-Jama'ah", ar: "طريق أهل السنة والجماعة" },
  { en: "Belief of Ahl al-Sunnah in Rulings (Ahkam)", ar: "اعتقاد أهل السنة في الأحكام" },
  { en: "The Virtue of Ahl al-Sunnah Over All Sects", ar: "فضل أهل السنة على الفرق" },
];

const DEFAULT_QUIZ_SECTION: ProphetStorySection = {
  title: "Quiz (10 questions)",
  body: "Finish all the sections above first. Then come back here to unlock the quiz.\n\nPass requirement: at least 7/10.",
};

const PLACEHOLDER_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1",
    body: "Content coming soon. This part will include Qur'an verses (translated) and authentic hadith evidences.",
  },
  {
    title: "Part 2",
    body: "More detailed explanations and evidences will be added here.",
  },
  {
    title: "Moral lessons",
    body: " Key takeaways will be summarized here once the full content is provided.",
  },
  {
    title: "Practical actions for students",
    body: " Actionable steps and reflections will be added after the content is organized.",
  },
  DEFAULT_QUIZ_SECTION,
];

const FOUNDATIONS_SECTIONS: ProphetStorySection[] = [
  {
    title: { en: "Part 1: What is 'Aqidah and why it matters", ar: "الجزء الأول: ما هي العقيدة ولماذا هي مهمة" },
    body: {
      en: "'Aqidah is what a Muslim believes with full certainty in the heart. It is not an opinion, a guess, or a feeling; it is a firm belief that does not change. If the foundation (belief) is correct, actions are accepted. If the foundation is corrupt, actions lose value. Just like a building: a strong foundation makes a strong building; a weak foundation collapses.\n\nQur'an: \"Your God is One God. There is no god but Him.\" (Al-Baqarah 2:163)\n\nThink: a pure foundation means you rely on Allah alone, not on charms, luck, or people.",
      ar: "العقيدة هي ما يؤمن به المسلم بيقين تام في القلب. ليست رأياً أو تخميناً أو شعوراً، بل اعتقاد راسخ لا يتغير. إذا كان الأساس (الاعتقاد) صحيحاً، قُبلت الأعمال. وإذا كان الأساس فاسداً، فقدت الأعمال قيمتها. تماماً كالبناء: الأساس القوي يجعل البناء قوياً، والأساس الضعيف ينهار.\n\nقال الله تعالى: ﴿إِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ﴾ (البقرة: ١٦٣)\n\nتأمل: الأساس النقي يعني أنك تتوكل على الله وحده، لا على التمائم أو الحظ أو الناس."
    }
  },
  {
    title: { en: "Part 2: Who is being described (Saved and Victorious Group)", ar: "الجزء الثاني: من هم الموصوفون (الفرقة الناجية والطائفة المنصورة)" },
    body: {
      en: "Ibn Taymiyyah opens by saying: this is the belief of the Saved Group and Victorious Group until the Day of Judgment: Ahl al-Sunnah wal-Jama'ah.\n\nSaved Group (Al-Firqat an-Najiyah): they are saved from punishment because they are upon correct belief. Hadith: \"My Ummah will split into seventy-three groups. All of them will be in the Fire except one.\" They asked: Who are they, O Messenger of Allah? He said: \"Those who follow what I and my companions are upon.\"\n\nVictorious Group (At-Ta'ifah al-Mansurah): they remain upon the truth and are victorious by evidence and clarity until the Day of Judgment. Hadith: \"There will remain a group from my Ummah upon the truth, victorious, until the Hour is established.\"\n\nVictory here is proof and clarity, not worldly power.",
      ar: "يفتتح ابن تيمية بقوله: هذا اعتقاد الفرقة الناجية والطائفة المنصورة إلى قيام الساعة: أهل السنة والجماعة.\n\nالفرقة الناجية: هم الناجون من العذاب لأنهم على الاعتقاد الصحيح. قال النبي ﷺ: «ستفترق أمتي على ثلاث وسبعين فرقة، كلها في النار إلا واحدة» قالوا: من هي يا رسول الله؟ قال: «من كان على مثل ما أنا عليه وأصحابي».\n\nالطائفة المنصورة: يبقون على الحق ومنتصرون بالحجة والبيان إلى يوم القيامة. قال النبي ﷺ: «لا تزال طائفة من أمتي على الحق ظاهرين حتى تقوم الساعة».\n\nالنصرة هنا بالحجة والبيان، لا بالقوة الدنيوية."
    }
  },
  {
    title: { en: "Part 3: Why Ahl al-Sunnah wal-Jama'ah are named so", ar: "الجزء الثالث: لماذا سُمُّوا أهل السنة والجماعة" },
    body: {
      en: "Ahl al-Sunnah: they follow the Sunnah of the Prophet, taking belief from the Qur'an and authentic Sunnah. They do not invent beliefs, change meanings, or follow philosophy and desires.\n\nAl-Jama'ah: they are united upon the truth and do not split into sects. Unity is built on truth, not on compromise. Unity without truth is not Islam; truth brings real unity.",
      ar: "أهل السنة: يتبعون سنة النبي ﷺ، يأخذون الاعتقاد من القرآن والسنة الصحيحة. لا يبتدعون عقائد، ولا يحرفون المعاني، ولا يتبعون الفلسفة والأهواء.\n\nالجماعة: متحدون على الحق ولا يتفرقون إلى فرق. الوحدة مبنية على الحق، لا على المساومة. الوحدة بلا حق ليست إسلاماً؛ الحق هو الذي يجلب الوحدة الحقيقية."
    }
  },
  {
    title: { en: "Part 4: The six foundations (pillars of Iman)", ar: "الجزء الرابع: الأصول الستة (أركان الإيمان)" },
    body: {
      en: "1) Belief in Allah: Allah exists, creates, controls everything, alone deserves worship, perfect in His Names and Attributes. Qur'an: \"Your God is One God. There is no god but Him.\" (Al-Baqarah 2:163)\n\n2) Belief in the angels: angels are real, created from light, always obey Allah, record deeds and carry commands. Qur'an: \"They do not disobey Allah in what He commands them.\" (At-Tahrim 66:6)\n\n3) Belief in the Books: Allah sent revelations; the Qur'an is the final preserved book. Qur'an: \"This is the Book in which there is no doubt.\" (Al-Baqarah 2:2)\n\n4) Belief in the Messengers: all called to worship Allah alone; Muhammad is the final messenger. Qur'an: \"Muhammad is the Messenger of Allah.\" (Al-Fath 48:29)\n\n5) Belief in the Resurrection: death is not the end; people are raised, judged; Paradise and Hell are real. Qur'an: \"As We began the first creation, We will repeat it.\" (Al-Anbiya 21:104)\n\n6) Belief in Divine Decree (Al-Qadar): Allah knows, wrote, wills, and created all things. Good and bad happen by His wisdom. Qur'an: \"Indeed, all things We created with decree.\" (Al-Qamar 54:49)",
      ar: "١) الإيمان بالله: الله موجود، يخلق ويتحكم في كل شيء، يستحق العبادة وحده، كامل في أسمائه وصفاته. قال الله تعالى: ﴿إِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ﴾ (البقرة: ١٦٣)\n\n٢) الإيمان بالملائكة: الملائكة حقيقيون، مخلوقون من نور، يطيعون الله دائماً، يسجلون الأعمال وينفذون الأوامر. قال تعالى: ﴿لَا يَعْصُونَ اللَّهَ مَا أَمَرَهُمْ﴾ (التحريم: ٦)\n\n٣) الإيمان بالكتب: أنزل الله الوحي، والقرآن هو الكتاب الأخير المحفوظ. قال تعالى: ﴿ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ﴾ (البقرة: ٢)\n\n٤) الإيمان بالرسل: كلهم دعوا إلى عبادة الله وحده، ومحمد ﷺ هو الرسول الخاتم. قال تعالى: ﴿مُّحَمَّدٌ رَّسُولُ اللَّهِ﴾ (الفتح: ٢٩)\n\n٥) الإيمان بالبعث: الموت ليس النهاية؛ الناس يُبعثون ويُحاسبون؛ الجنة والنار حقيقيتان. قال تعالى: ﴿كَمَا بَدَأْنَا أَوَّلَ خَلْقٍ نُّعِيدُهُ﴾ (الأنبياء: ١٠٤)\n\n٦) الإيمان بالقدر: الله يعلم وكتب وشاء وخلق كل شيء. الخير والشر يحدثان بحكمته. قال تعالى: ﴿إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ﴾ (القمر: ٤٩)"
    }
  },
  {
    title: { en: "Part 5: Why groups go astray and key lessons", ar: "الجزء الخامس: لماذا تضل الفرق والدروس الأساسية" },
    body: {
      en: "Deviant groups oppose Qur'an and Sunnah, rely on opinions and philosophy, and fade away. Truth remains until the Day of Judgment.\n\nKey lessons: correct belief comes before actions; Islam is built on revelation, not human ideas; Ahl al-Sunnah follow rather than invent; unity is built on truth.\n\nReflection: Why does belief in the Hereafter change daily behavior? It makes you act with accountability, even when no one is watching.",
      ar: "الفرق المنحرفة تخالف القرآن والسنة، تعتمد على الآراء والفلسفة، وتتلاشى. الحق يبقى إلى يوم القيامة.\n\nالدروس الأساسية: الاعتقاد الصحيح يسبق الأعمال؛ الإسلام مبني على الوحي لا على أفكار البشر؛ أهل السنة يتبعون ولا يبتدعون؛ الوحدة تُبنى على الحق.\n\nتأمل: لماذا يغير الإيمان بالآخرة السلوك اليومي؟ يجعلك تتصرف بمسؤولية، حتى لو لم يراك أحد."
    }
  },
  {
    title: { en: "Moral lessons", ar: "الدروس الأخلاقية" },
    body: {
      en: " Sound 'aqidah is the foundation; actions rest on it.\n\n Salvation is tied to following Qur'an and Sunnah as the Prophet and his companions did.\n\n Truth-based unity matters more than labels or claims.\n\n Real victory is clarity of evidence and staying on truth, not just power.\n\n Belief in the Hereafter shapes honest, careful behavior every day.",
      ar: " العقيدة السليمة هي الأساس؛ الأعمال ترتكز عليها.\n\n النجاة مرتبطة باتباع القرآن والسنة كما فعل النبي ﷺ وأصحابه.\n\n الوحدة المبنية على الحق أهم من الأسماء أو الادعاءات.\n\n النصر الحقيقي هو وضوح الدليل والثبات على الحق، لا مجرد القوة.\n\n الإيمان بالآخرة يشكّل سلوكاً صادقاً وحذراً كل يوم."
    }
  },
  {
    title: { en: "Practical actions for students", ar: "الإجراءات العملية للطلاب" },
    body: {
      en: " Review the six pillars of Iman this week and memorize the paired verses.\n\n Before any belief-related question, ask: what did the Qur'an and authentic Sunnah say?\n\n When you feel pressured to follow trends, remember unity is on truth, not popularity.\n\n Write one way belief in the Hereafter will change how you act in a private situation.\n\n Make du'a to stay firm: O Allah, keep my heart firm upon Your religion.",
      ar: " راجع أركان الإيمان الستة هذا الأسبوع واحفظ الآيات المقترنة.\n\n قبل أي سؤال متعلق بالاعتقاد، اسأل: ماذا قال القرآن والسنة الصحيحة؟\n\n عندما تشعر بضغط لاتباع الموضات، تذكر أن الوحدة على الحق لا على الشعبية.\n\n اكتب طريقة واحدة سيغير بها الإيمان بالآخرة تصرفك في موقف خاص.\n\n ادع بالثبات: اللهم ثبت قلبي على دينك."
    }
  },
  DEFAULT_QUIZ_SECTION,
];

const METHODOLOGY_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: What this section covers",
    body:
      "This explains how Muslims must believe in Allah's Names and Attributes. It is not about inventing ideas; it is about believing exactly as Allah and His Messenger taught, with no additions or alterations.",
  },
  {
    title: "Part 2: Sources of knowledge",
    body: `Ahl al-Sunnah take Allah's Names and Attributes only from two sources: the Qur'an and the authentic Sunnah. Ibn Taymiyyah: "From belief in Allah is belief in how He described Himself in His Book and how His Messenger described Him." No philosophy, logic games, opinions, or culture are used to define His attributes.`,
  },
  {
    title: "Part 3: The golden rule",
    body:
      "We affirm Allah's Attributes without distortion, without denial, without asking how, and without resemblance. This is the core methodology.",
  },
  {
    title: "Part 4: Four things to avoid",
    body:
      "1) Distortion (tahrif): changing meanings. Wrong: saying Allah rising over the Throne only means conquering it.\n\n2) Denial (ta'til): rejecting attributes. Wrong: claiming Allah has no rising, speech, or mercy.\n\n3) Asking how (takyif): trying to describe how. Wrong: asking how Allah rises over the Throne.\n\n4) Resemblance (tamthil): comparing to creation. Wrong: saying Allah's Hand is like a human hand.",
  },
  {
    title: "Part 5: Key Qur'an principle",
    body: `Qur'an (Ash-Shura 42:11): "There is nothing like Him, and He is the All-Hearing, the All-Seeing." Two rules together: nothing is like Him (no resemblance) and He hears and sees (affirmation).`,
  },
  {
    title: "Part 6: How to affirm correctly",
    body:
      "Ahl al-Sunnah affirm what Allah affirmed, negate what He negated, and stay silent where revelation is silent. They do not add or remove meanings and do not imagine how.",
  },
  {
    title: "Part 7: Why this method is correct",
    body: `Allah knows Himself best, is most truthful, and the Prophet spoke with revelation. Qur'an: "And who is more truthful than Allah in speech?" (An-Nisa 4:87). "Glorified is your Lord above what they describe." (As-Saffat 37:180). Human ideas are imperfect; revelation is perfect.`,
  },
  {
    title: "Part 8: Easy examples and differences",
    body: `Example: Allah hears; we do not ask how or compare to human hearing. Example: Allah is Merciful; we do not deny or imagine it like human mercy.\n\nDifference: Ahl al-Sunnah follow Qur'an and Sunnah, affirm without resemblance, and say "Allah knows best"; deviant groups use philosophy, distort or deny, and speculate.`,
  },
  {
    title: "Moral lessons",
    body: ` Guard tawhid by taking attributes only from Qur'an and authentic Sunnah.\n\n Affirm without twisting, denying, or imagining how.\n\n Revelation is perfect; speculation is not.\n\n Saying "Allah knows best" protects humility and faith.\n\n Protecting the meanings of Allah's Names and Attributes keeps belief pure.`,
  },
  {
    title: "Practical actions for students",
    body: ` Memorize the rule: we affirm what Allah affirmed for Himself without distortion, denial, asking how, or resemblance.\n\n Read Ash-Shura 42:11 and note both parts: no likeness and affirmation of hearing/seeing.\n\n When you hear a claim about Allah's attributes, ask: what is the evidence from Qur'an or authentic Sunnah?\n\n Practice humility: respond with "Allah knows best" when asked about how.\n\n Reflect: Why did Allah not explain how His attributes are? To keep us within humility and revelation.`,
  },
  DEFAULT_QUIZ_SECTION,
];

const EVIDENCE_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Why evidence matters",
    body:
      "Ahl al-Sunnah do not speak about Allah with opinions, philosophy, or imagination. Belief in Allah's Names and Attributes is built only on clear evidence from the Qur'an and authentic Sunnah because talking about Allah is sacred and must be precise.",
  },
  {
    title: "Part 2: Core Qur'an proof (Ash-Shura 42:11)",
    body:
      '"There is nothing like Him, and He is the All-Hearing, the All-Seeing." (Ash-Shura 42:11)\n\nTwo principles in one verse: (1) Negation: nothing is like Him, so no resemblance to creation. (2) Affirmation: He truly hears and sees, so the attributes are real. Together: affirm the attributes; deny likeness to creation.',
  },
  {
    title: "Part 3: Three evidences to reject distortion and denial",
    body:
      "1) Allah knows Himself best, so what He says about Himself is the most accurate.\n\n2) Allah is the most truthful in speech (An-Nisa 4:87), so His descriptions are perfect while human logic can fail.\n\n3) The Messengers speak with truth and revelation (As-Saffat 37:181), so opposing them means speaking without knowledge.",
  },
  {
    title: "Part 4: Allah is above false descriptions",
    body:
      '"Glorified is your Lord, the Lord of Might, above what they describe." (As-Saffat 37:180)\n\nThis verse rejects all false claims about Allah and protects His perfection from distortion.',
  },
  {
    title: "Part 5: Why human comparison fails",
    body:
      "Ibn Taymiyyah notes: even created beings differ (humans are not like animals) though they share words like existence. If creation differs from creation, then Allah is far more different from His creation. Sharing a name like 'hearing' does not mean sharing the reality of that attribute.",
  },
  {
    title: "Part 6: How resemblance leads to misguidance",
    body:
      "Some groups first compared Allah to creation, then feared resemblance, so they denied or distorted His Attributes. Ahl al-Sunnah avoid this by affirming the attributes with no resemblance from the start.",
  },
  {
    title: "Part 7: Summary of the evidence-based method",
    body:
      "Ahl al-Sunnah affirm what Allah and His Messenger affirmed, deny likeness to creation, do not distort meanings, do not deny attributes, and do not ask how. Revelation sets the limits.",
  },
  {
    title: "Part 8: Key sentence to remember",
    body:
      "Allah is described only as He described Himself and as His Messenger described Him, without distortion, denial, asking how, or resemblance.",
  },
  {
    title: "Moral lessons",
    body:
      " Evidence protects belief; opinions do not.\n\n Affirmation without resemblance honors Allah's perfection.\n\n Revelation is always truthful; human logic can be flawed.\n\n Guard your tongue from speaking about Allah without knowledge.\n\n Humility (saying Allah knows best) keeps belief safe.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize Ash-Shura 42:11 and explain both parts (negation and affirmation).\n\n Repeat the key sentence daily until it sticks.\n\n When you hear a claim about Allah's attributes, ask: what is the evidence from Qur'an or authentic Sunnah?\n\n Reflect: Why did Allah warn against speaking about Him without knowledge? Write your answer in one sentence.\n\n Share one example of an attribute you affirm without asking how (hearing, seeing, mercy).",
  },
  DEFAULT_QUIZ_SECTION,
];

const ATTRIBUTES_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: How Allah describes Himself",
    body:
      "Allah describes Himself in the Qur'an in the most perfect and complete way. Ahl al-Sunnah believe that Allah's description of Himself is the best and most truthful. Qur'an: 'And who is more truthful than Allah in speech?' (An-Nisa 4:87). Whatever Allah says about Himself is true, perfect, and contains no mistake or deficiency.",
  },
  {
    title: "Part 2: Affirmation and Negation",
    body:
      "Ibn Taymiyyah explains that Allah's attributes are described using two methods together: (1) Affirmation (إثبات): believing in attributes Allah affirmed for Himself. (2) Negation (نفي): rejecting imperfections Allah negated from Himself. Ahl al-Sunnah do not choose one and leave the other; they take both exactly as Allah revealed them.",
  },
  {
    title: "Part 3: What is Affirmation?",
    body:
      "Affirmation means believing in the attributes Allah affirmed for Himself. Examples: Life, Knowledge, Power, Hearing, Seeing, Mercy, Love. Qur'an: 'Indeed, Allah is All-Hearing, All-Seeing.' (Ash-Shura 42:11). We affirm: Allah truly hears and sees, but not like creation.",
  },
  {
    title: "Part 4: What is Negation?",
    body:
      "Negation means rejecting imperfections Allah negated from Himself. Examples: Sleep, Tiredness, Forgetfulness, Need, Weakness. Qur'an: 'Neither slumber nor sleep overtakes Him.' (Al-Baqarah 2:255). We believe: Allah never becomes tired, never sleeps, because these are imperfections.",
  },
  {
    title: "Part 5: Why both affirmation and negation?",
    body:
      "Ibn Taymiyyah explains: affirmation alone could lead to resemblance to creation; negation alone could lead to denial of attributes. So Allah combined both to give perfect balance. Qur'anic example (Ash-Shura 42:11): 'There is nothing like Him, and He is the All-Hearing, the All-Seeing.' Nothing like Him (negation) + All-Hearing, All-Seeing (affirmation).",
  },
  {
    title: "Part 6: The path of Ahl al-Sunnah",
    body:
      "Ahl al-Sunnah do not go beyond the Qur'an, do not reject Qur'anic descriptions, and do not interpret based on philosophy. Ibn Taymiyyah: they do not deviate from what the Messengers brought. This is the straight path of the Prophets, the truthful, the martyrs, and the righteous. Qur'an: 'This is My straight path, so follow it.' (Al-An'am 6:153)",
  },
  {
    title: "Part 7: The important rule",
    body:
      "Every attribute Allah affirmed: we affirm it. Every imperfection Allah negated: we negate it. We do not add or remove anything. We do not ask how. We do not compare Allah to humans.",
  },
  {
    title: "Part 8: Easy example for students",
    body:
      "Allah says He knows everything: we believe it. Allah says He does not sleep: we believe it. We do not ask how. We do not compare Allah to humans. Simple: take what Allah said, believe it, stay humble.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah's own description of Himself is the most perfect.\n\n Affirmation protects belief in His attributes; negation protects against resemblance.\n\n Balance is key: affirm and negate as Allah revealed.\n\n Philosophy cannot improve on revelation; it can only confuse.\n\n Humility means not asking how, but accepting as Allah revealed.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence: Allah described Himself using affirmation and negation, and Ahl al-Sunnah follow exactly what Allah revealed without deviation.\n\n List five affirmed attributes (Knowledge, Power, Mercy, etc.) with their Qur'anic verses.\n\n List five negated attributes (Sleep, Tiredness, Forgetfulness, etc.) with their Qur'anic verses.\n\n When you hear a new attribute of Allah, ask: did Allah affirm it or negate it?\n\n Practice saying: Allah described Himself perfectly; I trust His words.",
  },
  DEFAULT_QUIZ_SECTION,
];

const IKHLAS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The importance of Surah Al-Ikhlas",
    body:
      "Surah Al-Ikhlas is one of the greatest surahs in the Qur'an. The Prophet ﷺ said: 'By Him in Whose Hand is my soul, it is equal to one-third of the Qur'an.' (Bukhari). This is because Surah Al-Ikhlas is entirely about Allah—His Oneness and perfection.",
  },
  {
    title: "Part 2: The text of Surah Al-Ikhlas",
    body:
      '"Say: He is Allah, One. Allah, the Self-Sufficient. He neither begets nor is born. And there is none comparable to Him." (Surah Al-Ikhlas 112:1–4)',
  },
  {
    title: "Part 3: Affirmation in Surah Al-Ikhlas",
    body:
      "Affirmation means confirming what Allah affirmed about Himself. Affirmed attributes in this surah: (1) Oneness (Ahadiyyah): 'He is Allah, One'—Allah is one in His essence, worship, and attributes. (2) Self-Sufficiency (As-Samad): 'Allah, the Self-Sufficient'—Allah needs nothing, while all creation needs Him. These are attributes of perfection.",
  },
  {
    title: "Part 4: Negation in Surah Al-Ikhlas",
    body:
      "Negation means rejecting imperfections from Allah. Negated attributes in this surah: (1) Having children: 'He neither begets'. (2) Being created or born: 'Nor is born'. (3) Having equals or likenesses: 'There is none comparable to Him'. These are attributes of deficiency, and Allah is free from all deficiency.",
  },
  {
    title: "Part 5: Balance between affirmation and negation",
    body:
      "Surah Al-Ikhlas perfectly balances affirmation of Allah's perfection and negation of any imperfection or resemblance. This balance protects belief from resembling Allah to creation and denying Allah's attributes.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah from this surah",
    body:
      "Ahl al-Sunnah learn from Surah Al-Ikhlas that Allah is affirmed with attributes of perfection and negated from all imperfections. Allah has no equal, partner, or likeness. They do not deny Allah's attributes, explain them with imagination, or compare Allah to creation.",
  },
  {
    title: "Part 7: Why this surah is a foundation of 'Aqidah",
    body:
      "Surah Al-Ikhlas establishes pure Tawḥīd, refutes shirk, refutes false beliefs about Allah, and summarizes belief in Allah clearly and perfectly.",
  },
  {
    title: "Part 8: Key sentence to memorize",
    body:
      "Surah Al-Ikhlas combines affirmation of Allah's perfection and negation of every form of deficiency or resemblance.",
  },
  {
    title: "Moral lessons",
    body:
      " Surah Al-Ikhlas equals one-third of the Qur'an because tawhid is that important.\n\n Affirmation and negation together protect true belief.\n\n Allah's Oneness and Self-Sufficiency are the foundation of all belief.\n\n Deficiency and need belong to creation, never to Allah.\n\n True tawhid means affirming what belongs to Allah and rejecting what does not.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize Surah Al-Ikhlas in Arabic (it is only 4 verses).\n\n Recite it every morning and evening as part of your daily dhikr.\n\n Reflect on one affirmed attribute and one negated deficiency each day.\n\n When learning about other attributes of Allah, ask: is this an affirmation of perfection or negation of deficiency?\n\n Teach someone else the two balanced principles from this surah.",
  },
  DEFAULT_QUIZ_SECTION,
];

const KURSI_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The status of Ayat al-Kursi",
    body:
      "Ayat al-Kursi is the greatest verse in the Qur'an. The Prophet ﷺ asked Ubayy ibn Ka'b which verse is the greatest, and he replied Ayat al-Kursi. The Prophet ﷺ approved his answer. Ayat al-Kursi speaks entirely about Allah—His greatness, perfection, and authority.",
  },
  {
    title: "Part 2: The text of Ayat al-Kursi",
    body:
      "\"Allah – there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither slumber nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what is behind them, and they encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.\" (Surah Al-Baqarah 2:255)",
  },
  {
    title: "Part 3: Affirmations in Ayat al-Kursi (Part A)",
    body:
      "Ayat al-Kursi contains many affirmed attributes of Allah, showing His perfection. (1) Oneness: 'Allah – there is no deity except Him'—Allah alone deserves worship. (2) Life and Sustaining Power: 'The Ever-Living (Al-Hayy), the Sustainer (Al-Qayyum)'—Allah has perfect life that never ends, and He sustains all creation. (3) Ownership: 'To Him belongs whatever is in the heavens and whatever is on the earth'—Everything belongs to Allah.",
  },
  {
    title: "Part 4: Affirmations in Ayat al-Kursi (Part B)",
    body:
      "(4) Authority and Permission: 'Who is it that can intercede with Him except by His permission?'—No one can speak or intercede before Allah unless He allows it. (5) Knowledge: 'He knows what is before them and what is behind them'—Allah's knowledge is complete: past, present, and future. 'They encompass nothing of His knowledge except what He wills'—Creation only knows what Allah allows them to know.",
  },
  {
    title: "Part 5: Affirmations in Ayat al-Kursi (Part C)",
    body:
      "(6) Power and Preservation: 'His Kursi extends over the heavens and the earth'—Allah's authority and dominion cover everything. 'Their preservation tires Him not'—Allah maintains the universe with no effort or weakness. (7) Highness and Greatness: 'And He is the Most High, the Most Great'—Allah is above all creation and greater than everything.",
  },
  {
    title: "Part 6: Negation in Ayat al-Kursi",
    body:
      "Alongside affirmation, Ayat al-Kursi clearly negates imperfections from Allah. 'Neither slumber nor sleep overtakes Him'—Allah never becomes tired, sleepy, or weak. Sleep is a sign of need and weakness, and Allah is free from all weakness.",
  },
  {
    title: "Part 7: Balance of affirmation and negation",
    body:
      "Ayat al-Kursi shows the perfect balance taught by Ahl al-Sunnah: it affirms Allah's perfect attributes and negates every form of deficiency. This prevents resembling Allah to creation and denying Allah's attributes.",
  },
  {
    title: "Part 8: Methodology and example",
    body:
      "Ahl al-Sunnah learn from Ayat al-Kursi that Allah is described with perfection and free from all deficiency. Attributes are believed as they are, without asking how. Allah is not compared to His creation. Easy example: Humans get tired → Allah never gets tired. Humans forget → Allah's knowledge is complete. Humans need rest → Allah never sleeps. This shows Allah's absolute perfection.",
  },
  {
    title: "Moral lessons",
    body:
      " Ayat al-Kursi is the greatest verse because it encompasses Allah's complete perfection.\n\n Affirmation and negation together present a complete picture of tawhid.\n\n Allah's sustenance of creation requires no effort or tiredness.\n\n Perfect knowledge belongs only to Allah; all others know partially.\n\n True greatness and highness belong to Allah alone, not to creation.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize Ayat al-Kursi in Arabic and recite it daily for protection (as authentically reported).\n\n Reflect on one affirmation and one negation from the verse each day.\n\n Compare your own weakness and need with Allah's perfection and self-sufficiency.\n\n When facing hardship, remember 'their preservation tires Him not'—Allah's care is effortless.\n\n Teach others about the seven affirmations and the negation in this supreme verse.",
  },
  DEFAULT_QUIZ_SECTION,
];

const LIFE_FIRST_LAST_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The Qur'anic verses used in the book",
    body:
      "Ibn Taymiyyah uses the following verses as evidence: 'He is the First and the Last, the Outward and the Inward, and He is Knowing of all things.' (Surah Al-Hadid 57:3). 'And rely upon the Ever-Living who does not die.' (Surah Al-Furqan 25:58). These verses affirm five great attributes of Allah.",
  },
  {
    title: "Part 2: Attribute of Life (Al-Hayah)",
    body:
      "Allah is described as Ever-Living. This means: Allah's life is perfect, it has no beginning, it has no end, and it is not like the life of creation. Allah does not get tired, sleep, or die. This is why Allah says: 'the Ever-Living who does not die'",
  },
  {
    title: "Part 3: Attribute of The First (Al-Awwal)",
    body:
      "Al-Awwal means Allah existed before everything. Nothing existed before Him. Allah was there before creation, before time, and before place. This affirms Allah's eternity with no beginning.",
  },
  {
    title: "Part 4: Attribute of The Last (Al-Akhir)",
    body:
      "Al-Akhir means Allah will exist after everything. Everything will perish except Allah. Creation ends, but Allah remains forever. This affirms Allah's eternity with no end.",
  },
  {
    title: "Part 5: Attribute of The Outward (Aẓ-Ẓāhir)",
    body:
      "Aẓ-Ẓāhir means Allah is high above His creation. Allah is above everything in His essence. This supports the belief that Allah is above the heavens, above the Throne, and nothing is above Allah. This attribute relates to Allah's highness ('uluww).",
  },
  {
    title: "Part 6: Attribute of The Inward (Al-Bāṭin)",
    body:
      "Al-Bāṭin means Allah is close with His knowledge. Nothing is hidden from Him. Allah knows what is inside hearts, what is secret, and what is hidden. This does not mean Allah is inside creation; it means His knowledge reaches everything.",
  },
  {
    title: "Part 7: How Ahl al-Sunnah understand these attributes",
    body:
      "According to the book, Ahl al-Sunnah affirm all five attributes, do not distort their meanings, do not deny them, and do not ask how. They do not compare them to creation. They believe: Allah's life is not like created life, Allah's highness is not like created height, Allah's closeness is through knowledge, not physical mixing.",
  },
  {
    title: "Part 8: Balance between highness and knowledge",
    body:
      "Ibn Taymiyyah shows an important balance: Allah is high above creation (Outward) and Allah knows everything (Inward). Highness does not cancel closeness; closeness does not cancel highness. Both are true without contradiction.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah's life is eternal and perfect; creation's life is temporary and limited.\n\n First and Last capture Allah's eternity in both directions.\n\n Outward and Inward show Allah's absolute control: authority above and knowledge within.\n\n Closeness through knowledge is more intimate than physical closeness.\n\n Balancing highness and knowledge protects against false beliefs in both directions.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the verse: 'He is the First and the Last, the Outward and the Inward, and He is Knowing of all things.' (Al-Hadid 57:3).\n\n Reflect daily on one attribute: think about Allah's eternity, His highness, and His knowledge.\n\n When making a private decision, remember Al-Bāṭin (The Inward)—Allah knows even your secret thoughts.\n\n When feeling weak, remember Al-Awwal and Al-Akhir—Allah is eternal and will remain when all else passes.\n\n Teach someone else the difference between Allah being 'high above' and 'close with knowledge'.",
  },
  DEFAULT_QUIZ_SECTION,
];

const KNOWLEDGE_MIGHT_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic evidence used in the book",
    body:
      "Ibn Taymiyyah affirms the Attributes of Knowledge and Might using multiple verses: 'And He is the All-Knowing, the All-Wise.' 'He knows what enters the earth and what comes out of it, and what descends from the heaven and what ascends therein.' 'With Him are the keys of the unseen; none knows them except Him.' 'Not a leaf falls but He knows it.' 'No female conceives nor gives birth except with His knowledge.' 'That you may know that Allah is over all things competent and that Allah has encompassed all things in knowledge.' 'Indeed, Allah is the Provider, the Possessor of strength, the Firm.' These verses establish these two attributes.",
  },
  {
    title: "Part 2: Attribute of Knowledge ('Ilm)",
    body:
      "Allah's knowledge is complete, perfect, unlimited, and eternal. Allah knows everything that happened in the past, everything happening now, and everything that will happen in the future. Allah knows everything hidden and unseen. Nothing escapes Allah's knowledge.",
  },
  {
    title: "Part 3: Scope of Allah's Knowledge",
    body:
      "Allah knows: what enters the earth and what leaves it, what comes down from the sky and what goes up, what is in the land and the sea, every falling leaf, every grain hidden in darkness, and every pregnancy and birth. Allah's knowledge includes small and large matters, public and secret matters, and visible and unseen matters.",
  },
  {
    title: "Part 4: Human knowledge vs Allah's knowledge",
    body:
      "Human knowledge is limited and learned; Allah's knowledge is inherent and complete. Humans forget, make mistakes, and discover; Allah never forgets and never learns. Creation only knows what Allah allows them to know.",
  },
  {
    title: "Part 5: Attribute of Might and Power (Qudrah)",
    body:
      "Allah's Might means Allah has complete power over everything. Nothing can stop Allah. Nothing is difficult for Allah. Allah is described as the Possessor of strength, the Firm, and Able to do all things. Allah's power is perfect, unlimited, not weakened, and not exhausted.",
  },
  {
    title: "Part 6: Evidence of Allah's Might",
    body:
      "Allah's power is shown by creation of the heavens and earth, control of life and death, providing sustenance, and ability to do whatever He wills.",
  },
  {
    title: "Part 7: Relationship between knowledge and might",
    body:
      "Ibn Taymiyyah shows that Allah's knowledge is complete and Allah's might is complete. So Allah knows everything and is able to do everything He wills. Nothing happens outside Allah's knowledge and nothing happens outside Allah's power.",
  },
  {
    title: "Part 8: Methodology and effects of belief",
    body:
      "Ahl al-Sunnah affirm Allah's knowledge and might as real and perfect, do not deny or distort these attributes, and do not ask how. Allah's knowledge is not like human knowledge; Allah's power is not like created power. Belief in Allah's knowledge teaches sincerity and awareness that Allah sees everything. Belief in Allah's might teaches reliance, humility, fear, and trust during hardship.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah's knowledge reaching everything calls for constant awareness and honesty.\n\n Allah's might over all things calls for complete reliance and trust.\n\n Nothing is hidden from Allah; secrecy of sins is an illusion.\n\n Allah's power makes impossible become possible through His will.\n\n Combining knowledge and might shows Allah's absolute authority over all creation.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize one verse about Allah's knowledge and one about His might; reflect on them daily.\n\n When tempted to sin in secret, remember: 'Not a leaf falls but He knows it'—Allah knows your hidden deeds.\n\n When facing a difficult situation, remember Allah's might: 'Indeed, Allah is over all things competent'—trust in His power to help.\n\n List ten examples of Allah's knowledge (from Qur'an) and ten examples of His might.\n\n In du'a, combine trust in Allah's knowledge and power: 'O Allah, You know my need and You are able to provide it.'",
  },
  DEFAULT_QUIZ_SECTION,
];

const HEARING_SEEING_WILL_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic evidence used in the book",
    body:
      "Ibn Taymiyyah affirms the Attributes of Hearing, Seeing, and Will using clear verses: 'There is nothing like Him, and He is the All-Hearing, the All-Seeing.' (Ash-Shura 42:11). 'Indeed, Allah is Hearing and Seeing.' (An-Nisa 4:58). 'If Allah had willed, they would not have fought, but Allah does what He wills.' (Al-Baqarah 2:253). 'Indeed, Allah does what He wills.' (Al-Ma'idah 5:1). 'Whomever Allah wills to guide, He opens his chest to Islam, and whomever He wills to misguide, He makes his chest tight and constricted.' (Al-An'am 6:125).",
  },
  {
    title: "Part 2: Attribute of Hearing (As-Sam')",
    body:
      "Allah's Hearing means Allah hears everything: all voices loud and quiet, all languages at the same time, and nothing is hidden from Allah's hearing. Allah hears what is spoken openly, what is whispered, and what is kept secret in the heart. Allah's hearing is perfect and complete.",
  },
  {
    title: "Part 3: Attribute of Seeing (Al-Basar)",
    body:
      "Allah's Seeing means Allah sees everything: visible and invisible, darkness does not hide anything, and distance does not block Allah's sight. Allah sees actions, intentions, movements, and stillness. Nothing escapes Allah's sight.",
  },
  {
    title: "Part 4: Attribute of Will (Al-Iradah)",
    body:
      "Allah's Will means everything that happens occurs by Allah's will. Nothing happens against Allah's will. Allah does whatever He wills with wisdom. If Allah wills something to happen, it happens. If Allah does not will it, it cannot happen.",
  },
  {
    title: "Part 5: Allah's Will and human actions",
    body:
      "Ibn Taymiyyah affirms that Allah has will and humans also have choice and responsibility. Human actions happen within Allah's will. Allah's will does not cancel responsibility, accountability, or commands and prohibitions.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah",
    body:
      "Ahl al-Sunnah affirm Allah's Hearing, Seeing, and Will as real attributes. They do not deny them, do not distort their meanings, and do not ask how. They do not compare them to creation. Allah hears, but not like creation hears. Allah sees, but not like creation sees. Allah wills, but not like creation wills.",
  },
  {
    title: "Part 7: Effects of believing in these attributes",
    body:
      "Belief in Allah's Hearing protects the tongue, encourages remembrance, and prevents lying and gossip. Belief in Allah's Seeing encourages sincerity, prevents hidden sins, and builds awareness of Allah. Belief in Allah's Will teaches reliance, brings patience in hardship, and prevents arrogance in success.",
  },
  {
    title: "Part 8: Key sentence and summary",
    body:
      "Allah hears everything, sees everything, and whatever happens occurs by His will, without resemblance to creation and without asking how. These three attributes together show Allah's complete control and knowledge of all creation.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah hears what others do not hear; guard your words accordingly.\n\n Allah sees what others do not see; act with awareness of His watching.\n\n Allah's will is absolute; trust it even when you do not understand.\n\n Hearing and seeing together prevent hidden wrong; seeing and will together show divine wisdom.\n\n Perfect attributes mean perfect knowledge and control; submit with confidence.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize and reflect daily on Ash-Shura 42:11: 'There is nothing like Him, and He is the All-Hearing, the All-Seeing.'\n\n When tempted to speak harshly, remember: Allah hears even whispers; speak kindly.\n\n When about to sin in private, remember: Allah sees; nothing is hidden.\n\n When facing a closed door, remember: If Allah wills it to open, it opens; trust His will.\n\n Teach someone the three attributes and their effects: hearing (tongue protection), seeing (heart purity), will (trust and reliance).",
  },
  DEFAULT_QUIZ_SECTION,
];

const LOVE_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic evidence used in the book",
    body:
      "Ibn Taymiyyah affirms the Attribute of Love using clear verses: 'Indeed, Allah loves the doers of good.' (Al-Baqarah 2:195). 'Indeed, Allah loves those who act justly.' (Al-Hujurat 49:9). 'Indeed, Allah loves the righteous.' (At-Tawbah 9:7). 'Indeed, Allah loves those who repent and loves those who purify themselves.' (Al-Baqarah 2:222). 'Say, if you love Allah, then follow me; Allah will love you.' (Al Imran 3:31). 'Allah will bring a people whom He loves and who love Him.' (Al-Ma'idah 5:54). 'Indeed, Allah loves those who fight in His cause in rows as though they are a solid structure.' (As-Saff 61:4). 'And He is the All-Forgiving, the Most Loving.' (Al-Buruj 85:14). These verses clearly prove that love is a real attribute of Allah.",
  },
  {
    title: "Part 2: Meaning of Allah's Love",
    body:
      "Allah's Love means Allah truly loves. His love is real, not symbolic. His love is perfect, not deficient. His love is befitting His majesty. Allah's love is not like human love: it is not emotional weakness, it does not resemble creation, and it is not imagined or explained how.",
  },
  {
    title: "Part 3: Who does Allah love?",
    body:
      "The book shows that Allah loves specific people based on their actions and qualities: those who do good (al-muhsinun), those who are just (al-muqsitin), those who fear Allah (al-muttaqun), those who repent (at-tawwabun), those who purify themselves (al-mutatahhirun), those who follow the Prophet, and those who strive sincerely in Allah's cause. Allah's love is connected to obedience.",
  },
  {
    title: "Part 4: Mutual love between Allah and believers",
    body:
      "One verse shows mutual love: 'He loves them, and they love Him.' This proves Allah loves His believing servants and believers also love Allah. Love for Allah leads to obedience and sacrifice.",
  },
  {
    title: "Part 5: Love is linked to following the Prophet",
    body:
      "Allah says: 'If you love Allah, then follow me; Allah will love you.' This verse teaches: love of Allah is not just a claim, true love requires following the Sunnah, and obedience is proof of love.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah",
    body:
      "Ahl al-Sunnah affirm that Allah loves and affirm love as a true attribute. They do not deny it, do not distort it into 'reward only,' and do not ask how. They do not compare Allah's love to human love. They believe Allah loves in a way that suits Him, and His love is real and perfect.",
  },
  {
    title: "Part 7: Effects of believing in Allah's Love",
    body:
      "Belief in Allah's love encourages good deeds, increases repentance, strengthens sincerity, motivates following the Prophet, and gives hope and closeness to Allah.",
  },
  {
    title: "Part 8: Key sentence and summary",
    body:
      "Allah truly loves His believing servants who obey Him. His love is real, perfect, and befitting His majesty without resembling the love of creation. This attribute connects obedience to divine reward and mercy.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah's love is conditional on obedience and good deeds; it motivates striving in righteousness.\n\n Real love of Allah is proven by following His commands, not by words alone.\n\n Allah loves those who repent; hope and change are always possible.\n\n Mutual love between Allah and believers creates a bond stronger than any other.\n\n Allah's love is merciful and just; it rewards what is deserved.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize one verse about Allah's love and reflect on its meaning daily.\n\n When tempted to disobey, remember: following the Prophet proves love of Allah and earns His love.\n\n List the seven categories of people Allah loves (good-doers, just ones, righteous, repentant, pure, followers of Prophet, fighters in Allah's cause).\n\n Perform one good deed each day seeking Allah's love, not other rewards.\n\n Ask yourself: Do I truly love Allah? Is my obedience reflecting that love?",
  },
  DEFAULT_QUIZ_SECTION,
];

const MERCY_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence for Allah's Mercy",
    body:
      "Ibn Taymiyyah affirms the Attribute of Mercy using many clear verses from the Qur'an mentioned in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"In the name of Allah, the Most Merciful, the Most Compassionate.\" (Surah Al-Fātiḥah 1:1)\n\n\"Our Lord, You have encompassed all things in mercy and knowledge.\" (Surah Ghāfir 40:7)\n\n\"And He is ever Merciful to the believers.\" (Surah Al-Aḥzāb 33:43)\n\n\"My mercy encompasses all things.\" (Surah Al-A'rāf 7:156)\n\n\"Your Lord has prescribed mercy for Himself.\" (Surah Al-An'ām 6:54)\n\n\"And He is the All-Forgiving, the Most Merciful.\" (Surah Yūnus 10:107)\n\n\"Allah is the best guardian, and He is the Most Merciful of the merciful.\" (Surah Yūsuf 12:64)\n\nThese verses prove clearly that mercy is a real attribute of Allah.",
  },
  {
    title: "Part 2: Meaning of Allah's Mercy",
    body:
      "Allah's Mercy means:\n• Allah truly shows mercy\n• His mercy is real and perfect\n• His mercy is vast and unlimited\n• His mercy is befitting His majesty\n\nAllah's mercy is not like human mercy:\n• It is not weakness\n• It is not emotional need\n• It does not resemble creation\n\nAllah's mercy is an essential attribute that suits His perfection and greatness.",
  },
  {
    title: "Part 3: The Vastness of Allah's Mercy",
    body:
      "The book shows that Allah's mercy:\n• covers all creation\n• includes believers and non-believers in this life\n• is especially for the believers in the Hereafter\n\n\"My mercy encompasses all things.\" (Al-A'rāf 7:156)\n\nThis means:\n• every blessing comes from Allah's mercy\n• life, health, provision, and guidance are from His mercy\n• rain, sustenance, and protection are manifestations of His mercy\n\nAllah's mercy reaches all, but eternal mercy in Paradise is reserved for believers.",
  },
  {
    title: "Part 4: Allah Prescribed Mercy for Himself",
    body:
      "Allah says: \"Your Lord has prescribed mercy for Himself.\" (Al-An'ām 6:54)\n\nThis shows:\n• Allah chose mercy for Himself\n• Mercy is from His perfection\n• Allah deals with His servants with mercy, not injustice\n\nPrescribing mercy for Himself means:\n• It is His commitment to His servants\n• He will never be unjust\n• His decree is filled with mercy, even in trials\n• Believers should have hope in His mercy\n\nThis verse opens the door of hope for those who repent and seek forgiveness.",
  },
  {
    title: "Part 5: Mercy and Forgiveness",
    body:
      "Allah often combines mercy with forgiveness: \"And He is the All-Forgiving, the Most Merciful.\" (Yūnus 10:107)\n\nThis shows:\n• Allah forgives sins\n• Allah has mercy even after mistakes\n• Repentance is always open\n\nThe pairing teaches:\n• Forgiveness removes sin\n• Mercy grants blessings beyond forgiveness\n• Allah does not just pardon; He replaces sins with good\n• No sin is too great for Allah's mercy\n\nThis encourages believers to never despair, no matter how many sins they committed.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah in This Attribute",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm mercy as a real attribute of Allah\n• do not deny it\n• do not distort it into 'reward only'\n• do not ask how\n• do not compare Allah's mercy to human mercy\n\nThey believe:\n• Allah's mercy is real\n• Allah's mercy suits His greatness\n• Allah's mercy has no deficiency\n\nDeviant groups either:\n• deny it completely\n• reduce it to material blessings only\n• compare it to created mercy\n\nAhl al-Sunnah take the middle path: affirm without distortion or resemblance.",
  },
  {
    title: "Part 7: Effects of Believing in Allah's Mercy",
    body:
      "Belief in Allah's mercy:\n• gives hope\n• prevents despair\n• encourages repentance\n• softens the heart\n• strengthens trust in Allah\n\nA believer never loses hope in Allah's mercy.\n\nPractical impacts:\n• You turn back to Allah after sinning, knowing He is Merciful\n• You treat others with mercy because Allah is Merciful\n• You rely on Allah's mercy, not just your deeds\n• You balance fear and hope in worship\n• You see trials as mercy in disguise\n\nBelieving in Allah's mercy keeps the heart alive and motivated.",
  },
  {
    title: "Part 8: Key Sentence to Memorize",
    body:
      "Allah is truly Merciful, His mercy encompasses all things, and His mercy is real and perfect without resembling the mercy of creation.\n\nThis sentence summarizes:\n• Affirmation of the attribute\n• Its vastness\n• Its perfection\n• Negation of resemblance\n\nMemorise this and use it as a foundation when discussing Allah's mercy. It protects belief from distortion and denial.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah's mercy is real and vast; it covers all creation and is especially for believers.\n\n Believing in Allah's mercy gives hope, encourages repentance, and prevents despair.\n\n Allah prescribed mercy for Himself; He deals with His servants mercifully, not unjustly.\n\n Mercy is always paired with forgiveness; no sin is beyond Allah's mercy for those who repent.\n\n Ahl al-Sunnah affirm Allah's mercy without distortion, denial, or resemblance to creation.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence: Allah is truly Merciful, His mercy encompasses all things, and His mercy is real and perfect without resembling the mercy of creation.\n\n Read Surah Al-Fātiḥah daily and reflect on \"the Most Merciful, the Most Compassionate.\"\n\n When you sin, immediately turn to Allah in repentance, remembering His mercy.\n\n Show mercy to others (family, animals, the needy) because Allah loves the merciful.\n\n Balance fear and hope: fear Allah's punishment, but have greater hope in His mercy.",
  },
  DEFAULT_QUIZ_SECTION,
];

const PLEASURE_ANGER_COMING_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attributes of Pleasure, Anger, and Coming using clear verses from the Qur'an cited in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"Allah is pleased with them, and they are pleased with Him.\" (Surah Al-Mā'idah 5:119)\n\n\"And whoever kills a believer intentionally, his recompense is Hell… and Allah is angry with him and has cursed him.\" (Surah An-Nisā' 4:93)\n\n\"That is because they followed what angered Allah and disliked what pleased Him.\" (Surah Muḥammad 47:28)\n\n\"So when they angered Us, We took retribution from them.\" (Surah Az-Zukhruf 43:55)\n\n\"But Allah disliked their being sent forth, so He kept them back.\" (Surah At-Tawbah 9:46)\n\n\"Great is hatred in the sight of Allah that you say what you do not do.\" (Surah Aṣ-Ṣaff 61:3)\n\n\"Do they wait except that Allah should come to them in shades of clouds and the angels?\" (Surah Al-Baqarah 2:210)\n\n\"Are they waiting except that the angels should come to them or that your Lord should come?\" (Surah Al-An'ām 6:158)\n\n\"And your Lord will come, and the angels, row upon row.\" (Surah Al-Fajr 89:22)\n\n\"And the heaven will split open with clouds, and the angels will be sent down in succession.\" (Surah Al-Furqān 25:25)\n\nThese verses prove clearly that pleasure, anger, and coming are real attributes of Allah.",
  },
  {
    title: "Part 2: Attribute of Pleasure (Riḍā)",
    body:
      "Allah's Pleasure means:\n• Allah is truly pleased\n• His pleasure is real\n• It is befitting His majesty\n• It is not like human pleasure\n\nAllah is pleased with:\n• obedience\n• faith\n• truthfulness\n• righteousness\n\n\"Allah is pleased with them, and they are pleased with Him.\" (Al-Mā'idah 5:119)\n\nThis shows that Allah's pleasure is connected to good deeds and faith. When a believer obeys Allah, Allah is pleased with them. This pleasure is real, not metaphorical. It is an attribute that suits Allah's majesty, without any imperfection or resemblance to human emotions.",
  },
  {
    title: "Part 3: Attribute of Anger (Ghaḍab)",
    body:
      "Allah's Anger means:\n• Allah truly becomes angry\n• His anger is real\n• It is just and wise\n• It is not emotional or uncontrolled\n\nAllah's anger is directed at:\n• disbelief\n• oppression\n• hypocrisy\n• major sins\n\n\"Allah is angry with him and has cursed him.\" (An-Nisā' 4:93)\n\nAllah's anger is perfect and just. It is not like human anger which can be unjust, uncontrolled, or based on ignorance. Allah's anger is always deserved and always wise. It shows that Allah hates evil and injustice, and this is from His perfection.",
  },
  {
    title: "Part 4: Attribute of Coming (Al-Majī')",
    body:
      "Allah's Coming means:\n• Allah will come on the Day of Judgment\n• This coming is real\n• It is mentioned clearly in the Qur'an\n• It is befitting Allah's majesty\n\nWe affirm:\n• the coming itself\n• without asking how\n• without comparing it to creation\n\n\"And your Lord will come, and the angels, row upon row.\" (Al-Fajr 89:22)\n\nThis verse is explicit and clear. Allah will come on the Day of Judgment to judge His creation. We affirm this coming without asking how it will happen and without comparing it to the movement of creation. It is a coming that suits Allah's majesty and greatness.",
  },
  {
    title: "Part 5: Balance Between These Attributes",
    body:
      "The book shows that:\n• Allah is pleased with obedience\n• Allah is angry with disobedience\n• Allah will come to judge His creation\n\nThese attributes show:\n• Allah's justice\n• Allah's wisdom\n• Allah's authority\n\nThese three attributes work together:\n• Pleasure rewards the righteous\n• Anger punishes the wrongdoers\n• Coming brings final judgment\n\nThis balance shows that Allah is not indifferent. He cares about how His servants act. He rewards good and punishes evil. And on the Day of Judgment, He will come to settle all accounts with perfect justice.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah in These Attributes",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm pleasure, anger, and coming as real attributes\n• do not deny them\n• do not distort their meanings\n• do not ask how\n• do not compare Allah to creation\n\nThey believe:\n• Allah is pleased in a way that suits Him\n• Allah is angry in a way that suits Him\n• Allah comes in a way that suits Him\n\nDeviant groups either:\n• deny these attributes completely\n• interpret pleasure as \"giving reward\" only\n• interpret anger as \"giving punishment\" only\n• interpret coming as \"angels coming\" instead of Allah\n\nAhl al-Sunnah reject all of this and take the verses at face value, affirming what Allah affirmed for Himself.",
  },
  {
    title: "Part 7: Effects of Believing in These Attributes",
    body:
      "Belief in Allah's pleasure:\n• motivates obedience\n• encourages good deeds\n• creates desire for Paradise\n• strengthens love for Allah\n\nBelief in Allah's anger:\n• prevents sins\n• creates fear of accountability\n• increases awareness of consequences\n• motivates repentance\n\nBelief in Allah's coming:\n• strengthens belief in the Day of Judgment\n• increases seriousness in worship\n• reminds of final accountability\n• prevents arrogance and heedlessness\n\nTogether, these beliefs create a balanced Muslim who strives for Allah's pleasure, avoids His anger, and prepares for the meeting with Him.",
  },
  {
    title: "Part 8: Key Sentence to Memorize",
    body:
      "Allah is pleased with obedience, angry with disobedience, and will come on the Day of Judgment in a manner befitting His majesty, without resemblance and without asking how.\n\nThis sentence summarizes:\n• Affirmation of all three attributes\n• Their connection to actions\n• Their reality and perfection\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this and use it when explaining these attributes. It protects belief from distortion and keeps it within the methodology of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah's pleasure and anger are real attributes that show He cares about how we act.\n\n Obedience leads to Allah's pleasure; disobedience leads to His anger.\n\n Allah will come on the Day of Judgment to judge creation with perfect justice.\n\n These attributes show Allah's justice, wisdom, and authority.\n\n Ahl al-Sunnah affirm these attributes without distortion, denial, or resemblance.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about pleasure, anger, and coming.\n\n Strive for actions that earn Allah's pleasure (prayer, honesty, kindness).\n\n Avoid actions that earn Allah's anger (lying, backbiting, disobedience).\n\n Remember the Day of Judgment daily to increase seriousness in worship.\n\n Reflect on Surah Al-Fajr (89:22) and understand that Allah will truly come.",
  },
  DEFAULT_QUIZ_SECTION,
];

const FACE_HAND_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attributes of Face and Hand using clear verses from the Qur'an mentioned in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"And there will remain the Face of your Lord, Owner of Majesty and Honor.\" (Surah Ar-Raẖmān 55:27)\n\n\"Everything will perish except His Face.\" (Surah Al-Qaṣaṣ 28:88)\n\n\"[Allah said:] O Iblis, what prevented you from prostrating to what I created with My two Hands?\" (Surah Sād 38:75)\n\n\"The Jews say, 'Allah's Hand is chained.' Chained are their hands, and cursed are they for what they say. Rather, both His Hands are outstretched; He spends as He wills.\" (Surah Al-Mā'idah 5:64)\n\nThese verses affirm clearly that Allah has a Face and Hands. They are real attributes affirmed explicitly in the Qur'an.",
  },
  {
    title: "Part 2: Attribute of the Face (Al-Wajh)",
    body:
      "Allah has a Face:\n• affirmed clearly in the Qur'an\n• real and true\n• eternal and everlasting\n• befitting His majesty\n\n\"And there will remain the Face of your Lord, Owner of Majesty and Honor.\" (Ar-Raẖmān 55:27)\n\n\"Everything will perish except His Face.\" (Al-Qaṣaṣ 28:88)\n\nAllah's Face:\n• does not perish\n• is not like the faces of creation\n• is not imagined or described how\n\nThe verses show that everything in creation will end. The sun will darken, the mountains will crumble, the seas will boil. But only Allah remains eternal. His Face is eternal and everlasting. This proves the perfection of Allah - His face does not age or perish like creation.",
  },
  {
    title: "Part 3: Attribute of the Hand (Al-Yad)",
    body:
      "Allah has Hands:\n• affirmed clearly in the Qur'an\n• mentioned explicitly as two Hands\n• real attributes of Allah\n\n\"O Iblis, what prevented you from prostrating to what I created with My two Hands?\" (Sād 38:75)\n\nAllah's Hands:\n• are not like human hands\n• are not organs like creation\n• are affirmed without asking how\n\nAllah uses His Hands:\n• to create\n• to give\n• to provide as He wills\n\nWhen Allah says \"My two Hands,\" it shows the perfection of His power and generosity. He creates with complete power, and He gives with complete generosity. Both are attributes befitting His majesty.",
  },
  {
    title: "Part 4: Refutation of False Claims",
    body:
      "The Qur'an refutes those who deny Allah's Hands:\n\n\"The Jews say, 'Allah's Hand is chained.'\" (Al-Mā'idah 5:64)\n\nSome people tried to deny this attribute. They claimed Allah's hand is weak or restrained. But Allah responds by affirming both His Hands and His generosity.\n\nAllah says:\n\"Chained are their hands, and cursed are they for what they say. Rather, both His Hands are outstretched; He spends as He wills.\" (Al-Mā'idah 5:64)\n\nThis shows:\n• denial of attributes is false\n• affirmation does not imply resemblance\n• those who deny are the ones deserving curse\n• Allah's hands are always outstretched in generosity\n\nAllah spends as He wills. Nothing limits His giving. This is the sign of true power and generosity.",
  },
  {
    title: "Part 5: Methodology of Ahl al-Sunnah in These Attributes",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm the Face and Hands of Allah\n• affirm them as real attributes\n• do not deny them\n• do not distort their meanings\n• do not ask how\n• do not compare them to creation\n\nThey believe:\n• Allah has a Face befitting His majesty\n• Allah has Hands befitting His majesty\n\nDeviant groups:\n• deny these attributes completely\n• interpret \"Face\" as \"reward\" or \"reward from Allah\" only\n• interpret \"Hands\" as \"power\" metaphorically\n• reduce these clear verses to abstract meanings\n\nAhl al-Sunnah reject all of this and affirm what the Qur'an affirms, believing these are real attributes of Allah without asking how they exist or what they are like.",
  },
  {
    title: "Part 6: Effects of Believing in These Attributes",
    body:
      "Belief in Allah's Face:\n• reminds believers of the Hereafter\n• encourages sincerity for Allah alone\n• motivates seeking the pleasure of Allah's Face\n• strengthens focus on the eternal, not the temporary\n\nBelief in Allah's Hands:\n• strengthens belief in Allah's generosity\n• increases reliance on Allah for provision\n• removes despair and hopelessness\n• encourages gratitude for blessings\n• prevents miserliness and arrogance\n\nTogether, these beliefs create a believer who\n• lives for the eternal (seeking Allah's Face)\n• trusts in Allah's provision (through His Hands)\n• never despairs because Allah's hands are outstretched\n• is grateful and not arrogant",
  },
  {
    title: "Part 7: Key Sentence to Memorize",
    body:
      "Allah has a Face and Hands as real attributes affirmed in the Qur'an, without resemblance to creation and without asking how.\n\nThis sentence summarizes:\n• Affirmation of both attributes\n• Their reality and truth\n• Their source (the Qur'an)\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this sentence. Use it when explaining these attributes. It keeps belief within the methodology of Ahl al-Sunnah and protects from distortion.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah has a Face and Hands - these are real attributes affirmed in the Qur'an.\n\n Everything in creation will perish except Allah's Face, showing His eternal nature.\n\n Allah's Hands are outstretched in generosity; He gives as He wills and nothing limits His provision.\n\n Denying Allah's attributes is false; affirmation does not imply resemblance to creation.\n\n Ahl al-Sunnah affirm these attributes as they are, without distortion or denial.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's Face and Hands.\n\n Reflect on Surah Ar-Rahman (55:27): \"And there will remain the Face of your Lord.\"\n\n Seek Allah's Face in your actions; do things sincerely for His pleasure alone.\n\n Trust in Allah's provision through His Hands; rely on Him for sustenance.\n\n Remember that only Allah's Face remains eternal; do not cling to temporary worldly gains.\n\n When you receive blessings, remember they come from Allah's outstretched Hands.",
  },
  DEFAULT_QUIZ_SECTION,
];

const EYES_SEEING_HEARING_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attributes of Eyes, Seeing, and Hearing using many clear verses from the Qur'an explicitly cited in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"And be patient for the decision of your Lord, for indeed, you are under Our Eyes.\" (Surah At-Tū̱r 52:48)\n\n\"And We carried him on a ship made of planks and nails, sailing under Our Eyes, as a reward for one who was denied.\" (Surah Al-Qamar 54:13–14)\n\n\"And I cast upon you love from Me so that you would be brought up under My Eye.\" (Surah Tā-Hā 20:39)\n\n\"Indeed, Allah has heard the statement of she who disputes with you concerning her husband and complains to Allah; and Allah hears your dialogue. Indeed, Allah is All-Hearing, All-Seeing.\" (Surah Al-Mujādilah 58:1)\n\n\"Indeed, Allah has heard the saying of those who said, 'Allah is poor, and we are rich.'\" (Surah Āl 'Imrān 3:181)\n\n\"Or do they think that We do not hear their secrets and their private conversations? Yes, and Our messengers are with them recording.\" (Surah Az-Zukhruf 43:80)\n\n\"Indeed, I am with you both; I hear and I see.\" (Surah Tā-Hā 20:46)\n\n\"Does he not know that Allah sees?\" (Surah Al-'Alaq 96:14)\n\n\"Who sees you when you stand, and your movements among those who prostrate.\" (Surah Ash-Shu'arā' 26:218–219)\n\n\"And say: Work, for Allah will see your deeds, and His Messenger and the believers.\" (Surah At-Tawbah 9:105)\n\nAll these verses are used in the book to establish these attributes clearly.",
  },
  {
    title: "Part 2: Attribute of the Eyes (Al-'Ayn)",
    body:
      "Allah has Eyes:\n• affirmed clearly in the Qur'an\n• mentioned using the plural form \"Our Eyes\"\n• real attributes of Allah\n• befitting His majesty\n\nThese verses show that:\n• Allah watches over His servants\n• Allah protects whom He wills\n• Allah's care is constant and perfect\n\nAllah's Eyes are:\n• not like human eyes\n• not imagined\n• not described how\n\n\"And be patient for the decision of your Lord, for indeed, you are under Our Eyes.\" (At-Tū̱r 52:48)\n\nThis shows that Allah's Eyes watch over believers. They are under His protection and supervision. Nothing escapes His sight, and His care for them is perfect. The Sunnah clarifies that Allah has two Eyes, while the Qur'an affirms the attribute in general terms.",
  },
  {
    title: "Part 3: Attribute of Seeing (Al-Baṣar)",
    body:
      "Allah's Seeing means:\n• Allah sees everything\n• Allah sees what is visible and hidden\n• Allah sees movements and stillness\n• Darkness and distance do not block Allah's sight\n\nAllah sees:\n• actions\n• intentions\n• secrets\n• public deeds\n\nNothing escapes Allah's sight.\n\n\"Indeed, Allah is All-Hearing, All-Seeing.\" (Al-Mujādilah 58:1)\n\n\"Does he not know that Allah sees?\" (Al-'Alaq 96:14)\n\n\"Who sees you when you stand, and your movements among those who prostrate.\" (Ash-Shu'arā' 26:218–219)\n\nThese verses show that Allah sees openly and in secret. He sees when you stand in prayer and when you move. He sees your intentions and your deeds. Nothing is hidden from Him.",
  },
  {
    title: "Part 4: Attribute of Hearing (As-Sam')",
    body:
      "Allah's Hearing means:\n• Allah hears all voices\n• Allah hears all sounds\n• Allah hears secret speech and whispers\n• Allah hears many voices at the same time\n\nAllah hears:\n• private conversations\n• whispered complaints\n• silent supplications\n• words spoken openly\n\n\"Indeed, Allah has heard the statement of she who disputes with you concerning her husband and complains to Allah; and Allah hears your dialogue.\" (Al-Mujādilah 58:1)\n\nThis verse is about a woman who came to complain to the Prophet about her husband. Allah heard her, even though her voice was quiet and distant. He heard even when others could not. This shows the perfection of Allah's hearing - it encompasses all sounds, whether loud or whispered, whether open or secret.",
  },
  {
    title: "Part 5: Connection Between Eyes, Seeing, and Hearing",
    body:
      "Ibn Taymiyyah shows through these verses that:\n• Allah watches His creation (Eyes)\n• Allah sees their actions (Seeing)\n• Allah hears their speech (Hearing)\n\nTogether, these attributes show:\n• Allah's complete awareness\n• Allah's perfect supervision\n• Allah's absolute knowledge of His creation\n\n\"Indeed, I am with you both; I hear and I see.\" (Tā-Hā 20:46)\n\nMusa and Harun needed reassurance. Allah said He is with them, hearing and seeing. This means:\n• Allah's presence through His attributes\n• Allah hears their du'a'\n• Allah sees their struggles\n• Allah knows what they face\n\nThese three attributes work together to show that Allah is completely aware of everything His creation does, says, and intends.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah in These Attributes",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm Allah's Eyes, Seeing, and Hearing\n• affirm them as real attributes\n• do not deny them\n• do not distort their meanings\n• do not ask how\n• do not compare them to creation\n\nThey believe:\n• Allah sees in a way that suits Him\n• Allah hears in a way that suits Him\n• Allah has Eyes in a way that suits Him\n\nDeviant groups:\n• deny these attributes completely\n• interpret them as \"knowledge\" only\n• reduce them to abstract concepts\n• claim they are not real attributes\n\nAhl al-Sunnah affirm what the Qur'an affirms, taking the clear verses at their face value while rejecting any resemblance to creation.",
  },
  {
    title: "Part 7: Effects of Believing in These Attributes",
    body:
      "Belief in Allah's Eyes:\n• creates awareness of Allah's protection\n• increases trust in Allah\n• makes believers feel safe and secure\n• reminds them they are watched over\n\nBelief in Allah's Seeing:\n• encourages sincerity\n• prevents hidden sins\n• makes you careful of your actions\n• increases consciousness of Allah (Taqwa)\n\nBelief in Allah's Hearing:\n• protects the tongue\n• encourages du'a' and remembrance\n• reminds you Allah hears complaints and prayers\n• prevents backbiting and harmful speech\n\nTogether, belief in these three attributes creates a believer who:\n• is always aware of Allah's presence\n• guards their actions and speech\n• trusts in Allah's protection\n• turns to Allah with their needs",
  },
  {
    title: "Part 8: Key Sentence to Memorize",
    body:
      "Allah has Eyes, He sees everything, and He hears everything, as real attributes affirmed in the Qur'an and Sunnah, without resemblance to creation and without asking how.\n\nThis sentence summarizes:\n• Affirmation of all three attributes\n• Their scope (everything)\n• Their reality and truth\n• Their sources (Qur'an and Sunnah)\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this sentence. Use it when discussing these attributes. It protects your belief and keeps it within the methodology of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah has Eyes, sees everything, and hears everything as real attributes affirmed in the Qur'an and Sunnah.\n\n Allah watches over His servants with perfect care; nothing escapes His sight or hearing.\n\n Believers should be conscious that Allah sees their deeds and hears their words, both openly and in secret.\n\n Awareness of Allah's Eyes, Seeing, and Hearing creates consciousness of Allah (Taqwa) and prevents sin.\n\n These attributes show Allah's complete knowledge and perfect supervision of all creation.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's Eyes, Seeing, and Hearing.\n\n Reflect on Surah At-Tur (52:48): \"You are under Our Eyes\" - feel Allah's protection.\n\n Reflect on Surah Al-Alaq (96:14): \"Does he not know that Allah sees?\" - guard your hidden actions.\n\n Guard your tongue, remembering Allah hears all speech, whispered and open.\n\n Before doing something secretly, ask yourself: \"Am I comfortable if Allah sees this?\"\n\n Make du'a' confidently, knowing Allah hears even whispered supplications.",
  },
  DEFAULT_QUIZ_SECTION,
];

const POWER_PLANNING_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attribute of Power and Planning using clear verses from the Qur'an cited in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"And He is severe in power.\" (Surah Ar-Ra'd 13:13)\n\n\"And they planned, and Allah planned; and Allah is the Best of planners.\" (Surah Āl 'Imrān 3:54)\n\n\"They plotted a plot, and We plotted a plot, while they perceived not.\" (Surah An-Naml 27:50)\n\n\"Indeed, they are plotting a plot, and I am plotting a plot.\" (Surah Aṭ-Tāriq 86:15–16)\n\nThese verses are explicitly used to establish these attributes. They show that Allah's power is complete and His planning is perfect.",
  },
  {
    title: "Part 2: Attribute of Power (Al-Qudrah)",
    body:
      "Allah's Power means:\n• Allah has complete and perfect ability\n• Nothing weakens Him\n• Nothing is difficult for Him\n• He controls everything in existence\n\nAllah's power includes:\n• creating\n• giving life and death\n• controlling events\n• helping whom He wills\n• preventing whom He wills\n\n\"And He is severe in power.\" (Ar-Ra'd 13:13)\n\nThis means Allah's power is overwhelming and complete. Nothing in the universe happens outside Allah's power. Every creature, every atom, every thought - all are under Allah's complete control. His power is not weak or limited. It is severe, overwhelming, and absolute.",
  },
  {
    title: "Part 3: Attribute of Planning (Al-Makr)",
    body:
      "Allah's Planning means:\n• Allah plans in response to the plans of others\n• His planning is real\n• His planning is perfect and wise\n• His planning always overcomes all other plans\n\nAllah's planning:\n• is never unjust\n• is never oppressive\n• is never deceitful in a blameworthy way\n\n\"And they planned, and Allah planned; and Allah is the Best of planners.\" (Āl 'Imrān 3:54)\n\nWhen the disbelievers plotted to kill 'Isa, Allah also planned. Allah's plan was executed perfectly, and the enemies' plan failed completely. This shows that even when powerful enemies scheme, Allah's planning overcomes everything. Allah is the Best of planners - His planning is perfect, wise, and always succeeds.",
  },
  {
    title: "Part 4: Difference Between Praiseworthy and Blameworthy Planning",
    body:
      "Ibn Taymiyyah explains an important rule:\n\nBlameworthy planning: Planning to harm someone who does not deserve harm. This is deceit and injustice.\n\nPraiseworthy planning: Planning against those who deserve it, such as:\n• disbelievers who plot against the truth\n• enemies who seek to harm the believers\n\nAllah's planning is always praiseworthy, because:\n• Allah is just\n• Allah only plans against wrongdoing\n• Allah never commits injustice\n\nSo when the Qur'an says Allah \"plans\" or uses the word makr, it means praiseworthy, wise planning against evil. It is not deception or injustice. It is justice in response to wrongdoing.",
  },
  {
    title: "Part 5: How Allah's Planning Differs From Human Planning",
    body:
      "Human planning:\n• is limited\n• can fail\n• can be unjust\n• can be based on ignorance\n\nAllah's planning:\n• is perfect\n• never fails\n• is based on full knowledge\n• always leads to the best outcome\n\n\"They plotted a plot, and We plotted a plot, while they perceived not.\" (An-Naml 27:50)\n\nThe enemies plotted openly, thinking they would succeed. But Allah was planning in ways they could not see. They did not perceive Allah's planning. In the end, Allah's plan overcame theirs completely. Even when people think they succeed, Allah's plan prevails. This is the difference between human limitation and Allah's perfection.",
  },
  {
    title: "Part 6: Methodology of Ahl al-Sunnah in This Attribute",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm Allah's power as real and complete\n• affirm Allah's planning as real and true\n• do not deny these attributes\n• do not distort their meanings\n• do not ask how\n• do not compare Allah's planning to human deception\n\nThey believe:\n• Allah is powerful in a way that suits Him\n• Allah plans in a way that suits His justice and wisdom\n\nDeviant groups:\n• deny Allah's planning\n• claim Allah does not plan\n• interpret planning as merely knowing the future\n• reduce these attributes to abstract concepts\n\nAhl al-Sunnah affirm both attributes as they are understood from the Qur'an, taking the verses at their clear meaning while rejecting any resemblance to creation.",
  },
  {
    title: "Part 7: Effects of Believing in These Attributes",
    body:
      "Belief in Allah's power:\n• removes fear of creation\n• strengthens reliance on Allah\n• builds confidence in Allah's help\n• prevents weakness in front of enemies\n• increases submission to Allah\n\nBelief in Allah's planning:\n• gives comfort during trials\n• reminds believers that injustice never wins\n• teaches patience and trust in Allah\n• removes anxiety about the future\n• strengthens hope that good will overcome evil\n\nTogether, these beliefs create a believer who:\n• trusts in Allah's power to help\n• relies on Allah's planning to lead to good\n• fears only Allah, not enemies\n• is patient during hardship\n• is confident in Allah's final victory",
  },
  {
    title: "Part 8: Key Sentence to Memorize",
    body:
      "Allah has complete power over all things, and His planning always overcomes the plans of others with perfect justice and wisdom, without resemblance to creation and without asking how.\n\nThis sentence summarizes:\n• Affirmation of both attributes\n• Their scope and completeness\n• Their supremacy over all plans\n• Their justice and wisdom\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this sentence. It protects your belief and keeps it firmly within the methodology of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah has complete power over all things; nothing is impossible for Him.\n\n Allah's planning is perfect and always succeeds, even when it is hidden from people.\n\n Human plans can be defeated, but Allah's plan cannot be overcome.\n\n Allah never uses His power and planning unjustly; they are always for wise purposes.\n\n Belief in Allah's power and planning gives comfort and confidence during trials.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's power and planning.\n\n Reflect on Surah Al Imran (3:54) and how Allah's plan overcame the plots of the disbelievers.\n\n When facing enemies or difficulties, remember \"Allah is the Best of planners\" and trust His plan.\n\n Do your best in your affairs, then rely on Allah's power and planning.\n\n When you fear the future, remember Allah's power controls everything and His planning is perfect.\n\n Encourage others with the knowledge that wrongdoing never ultimately succeeds against Allah's plan.",
  },
  DEFAULT_QUIZ_SECTION,
];

const FORGIVENESS_MIGHT_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attributes of Forgiveness and Might using clear verses from the Qur'an cited in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"If you show good or conceal it, or pardon an offense—indeed, Allah is Ever-Pardoning, All-Powerful.\" (Surah An-Nisā' 4:149)\n\n\"Let them pardon and overlook. Do you not love that Allah should forgive you? And Allah is All-Forgiving, Most Merciful.\" (Surah An-Nūr 24:22)\n\n\"And to Allah belongs all might, and to His Messenger, and to the believers.\" (Surah Al-Munāfiqūn 63:8)\n\n\"[Iblis said:] By Your might, I will surely mislead them all.\" (Surah Sād 38:82)\n\n\"Blessed is the Name of your Lord, Owner of Majesty and Honor.\" (Surah Ar-Raẖmān 55:78)\n\n\"So worship Him and be patient in His worship. Do you know of any comparable to Him?\" (Surah Maryam 19:65)\n\nThese verses are used to establish both attributes clearly in the book.",
  },
  {
    title: "Part 2: Attribute of Forgiveness (Al-'Afw and Al-Maghfirah)",
    body:
      "Allah's Forgiveness means:\n• Allah pardons sins\n• Allah covers and erases sins\n• Allah does not punish after forgiving\n• Allah forgives out of mercy and wisdom\n\nThe book mentions two related meanings:\n• 'Afw (Pardon): erasing and removing the sin\n• Maghfirah (Forgiveness): covering the sin and protecting from punishment\n\n\"Let them pardon and overlook. Do you not love that Allah should forgive you? And Allah is All-Forgiving, Most Merciful.\" (An-Nūr 24:22)\n\nBoth meanings show Allah's perfect mercy toward His servants. When Allah forgives, the sin is completely removed. It is as if it never happened. This is the extent of Allah's forgiveness and mercy.",
  },
  {
    title: "Part 3: Allah Forgives Despite Having Full Power",
    body:
      "A key point in the book is that:\n• Allah forgives while having full might\n• Allah is not weak when He forgives\n• Forgiveness comes from strength, not inability\n\n\"Indeed, Allah is Ever-Pardoning, All-Powerful.\" (An-Nisā' 4:149)\n\nThis verse combines:\n• Forgiveness\n• Power\n\nThis proves that Allah forgives by choice, not by weakness. Allah could punish anyone for any sin. He has complete power and might. Yet He chooses to forgive. This makes His forgiveness even more meaningful. His forgiveness is not from inability to punish; it is from choice and mercy despite having perfect power.",
  },
  {
    title: "Part 4: Attribute of Might (Al-'Izzah)",
    body:
      "Allah's Might means:\n• Allah is completely dominant\n• Allah is never defeated\n• Allah is never humiliated\n• Allah controls all honor and power\n\nMight belongs:\n• first to Allah\n• then to His Messenger\n• then to the believers (by Allah's granting)\n\n\"And to Allah belongs all might, and to His Messenger, and to the believers.\" (Al-Munāfiqūn 63:8)\n\nAllah's might is:\n• perfect\n• eternal\n• absolute\n\nNo one can stand against Allah. No one can overcome His plan. No one can resist His will. His might is complete and overwhelming.",
  },
  {
    title: "Part 5: Evidence of Allah's Might",
    body:
      "The book shows Allah's might by:\n• the statement of Iblis acknowledging Allah's might\n• Allah's ownership of all honor\n• Allah's uniqueness and greatness\n\n\"By Your might, I will mislead them all.\" (Sād 38:82)\n\nEven Iblis, the enemy of Allah, admits that Allah's might is real and overwhelming. Iblis swears by Allah's might to emphasize that his determination is firm. Yet despite his oath and his effort to mislead people, Allah's might will ultimately prove superior. Allah's plan will prevail over Iblis's plan.\n\n\"Blessed is the Name of your Lord, Owner of Majesty and Honor.\" (Ar-Raẖmān 55:78)\n\nAllah alone possesses majesty and honor. All might, power, and dominion belong to Him.",
  },
  {
    title: "Part 6: Relationship Between Forgiveness and Might",
    body:
      "Ibn Taymiyyah shows an important balance:\n• Allah forgives, yet He is Mighty\n• Allah is Merciful, yet He is Dominant\n\nThis balance shows Allah's perfection:\n• Forgiveness does not cancel might\n• Might does not prevent forgiveness\n\nAllah can forgive completely while remaining completely powerful. He can be merciful while being just. These attributes do not contradict; they complement each other and show the completeness of Allah's nature.\n\nSome people wrongly think:\n\u2022 A mighty being cannot be merciful\n• A merciful being cannot be mighty\n\nAllah proves both are true. He is simultaneously the All-Mighty and the All-Forgiving. This is the beauty of Allah's perfection.",
  },
  {
    title: "Part 7: Methodology of Ahl al-Sunnah in These Attributes",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm forgiveness as a real attribute of Allah\n• affirm might as a real attribute of Allah\n• do not deny these attributes\n• do not distort their meanings\n• do not ask how\n• do not compare Allah's attributes to creation\n\nThey believe:\n• Allah forgives in a way befitting His majesty\n• Allah is Mighty in a way befitting His majesty\n\nDeviant groups:\n• deny or diminish Allah's forgiveness\n• deny or diminish Allah's might\n• interpret these as abstract concepts only\n• claim contradiction between them\n\nAhl al-Sunnah affirm both attributes as they are understood from the Qur'an, believing that Allah's perfection encompasses both complete forgiveness and complete might.",
  },
  {
    title: "Part 8: Effects of Believing in These Attributes",
    body:
      "Belief in Allah's forgiveness:\n• encourages repentance\n• removes despair\n• softens the heart\n• motivates seeking Allah's pardon\n• prevents feelings of hopelessness\n\nBelief in Allah's might:\n• removes fear of creation\n• strengthens dignity of faith\n• builds trust in Allah's justice\n• prevents reliance on others\n• encourages facing trials with confidence\n\nTogether, these beliefs create a believer who:\n• hopes for Allah's forgiveness while avoiding sin\n• fears Allah's might and does not disobey\n• balances hope and fear in worship\n• is neither arrogant nor despairing",
  },
  {
    title: "Part 9: Key Sentence to Memorize",
    body:
      "Allah forgives sins while possessing complete might; His forgiveness and His power are both perfect attributes befitting His majesty, without resemblance to creation and without asking how.\n\nThis sentence summarizes:\n• Affirmation of both attributes\n• Their coexistence\n• Their perfection\n• Their scope\n• Negation of contradiction\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this sentence. It keeps your belief balanced and protects it within the methodology of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah is Both the All-Forgiving and the All-Mighty; both attributes are perfect and real.\n\n Allah's forgiveness comes from strength, not weakness; He forgives by choice while possessing complete power.\n\n All might and honor belong to Allah; no one can resist His will or overcome His might.\n\n Forgiveness and might do not contradict; Allah perfectly combines both in His nature.\n\n Belief in Allah's forgiveness and might creates a balanced faith that is neither arrogant nor despairing.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's forgiveness and might.\n\n Reflect on Surah An-Nisa (4:149): \"Indeed, Allah is Ever-Pardoning, All-Powerful.\"\n\n When you sin, remember Allah's forgiveness and repent immediately.\n\n When you face enemies or difficulties, remember Allah's might and trust Him.\n\n Be merciful to others while being firm in truth, following Allah's example of forgiveness and might.\n\n Teach others that Allah combines perfect forgiveness with perfect power.",
  },
  DEFAULT_QUIZ_SECTION,
];

const ONENESS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attribute of Oneness (Tawḥīd) using many clear verses from the Qur'an mentioned in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"And there is none comparable to Him.\" (Surah Al-Ikhāṣ 112:4)\n\n\"So do not set up rivals to Allah while you know.\" (Surah Al-Baqarah 2:22)\n\n\"And among the people are those who take others besides Allah as equals; they love them as they should love Allah. But those who believe are stronger in love for Allah.\" (Surah Al-Baqarah 2:165)\n\n\"Say: Praise be to Allah, who has not taken a son, and has no partner in His dominion, and has no protector from weakness.\" (Surah Al-Isrā' 17:111)\n\n\"Whatever is in the heavens and whatever is on the earth glorifies Allah. To Him belongs dominion, and to Him belongs praise, and He is over all things capable.\" (Surah At-Taghābun 64:1)\n\n\"Blessed is He who sent down the Criterion upon His servant… to whom belongs the dominion of the heavens and the earth; He has not taken a son, nor does He have a partner in dominion.\" (Surah Al-Furqān 25:1–2)\n\n\"Allah has not taken a son, nor is there any god with Him.\" (Surah Al-Mu'minūn 23:91)\n\n\"So do not strike examples for Allah. Indeed, Allah knows and you do not know.\" (Surah An-Naḥl 16:74)\n\n\"Say: My Lord has forbidden immorality… and that you associate with Allah that for which He has sent down no authority.\" (Surah Al-A'rāf 7:33)\n\nThese verses establish Allah's absolute oneness.",
  },
  {
    title: "Part 2: Meaning of Allah's Oneness",
    body:
      "Allah's Oneness means:\n• Allah is One in His essence\n• Allah is One in His lordship\n• Allah is One in His right to be worshipped\n• Allah is One in His Names and Attributes\n\nAllah has:\n• no equal\n• no partner\n• no rival\n• no helper\n• no son\n\n\"And there is none comparable to Him.\" (Al-Ikhāṣ 112:4)\n\nThis is the foundation of Islamic belief. Allah is completely and absolutely One. There is nothing in creation that resembles Him. There is nothing that equals Him. There is no one beside Him who shares any aspect of His lordship, authority, or right to be worshipped.",
  },
  {
    title: "Part 3: Oneness in Worship (Tawḥīd al-Ulūhiyyah)",
    body:
      "Allah alone deserves:\n• prayer\n• supplication\n• reliance\n• fear\n• hope\n• sacrifice\n\nDirecting any act of worship to other than Allah is shirk.\n\nAllah forbade:\n• worshipping others\n• loving others as Allah should be loved\n• relying on others like Allah\n\n\"And among the people are those who take others besides Allah as equals; they love them as they should love Allah. But those who believe are stronger in love for Allah.\" (Al-Baqarah 2:165)\n\nThis is the practical application of oneness. A Muslim gives all forms of worship, love, and trust exclusively to Allah. When someone directs any of this to someone else, claiming they deserve it like Allah does, that is shirk (polytheism), and it nullifies oneness.",
  },
  {
    title: "Part 4: Oneness in Dominion and Power",
    body:
      "The book emphasizes that:\n• all dominion belongs to Allah\n• Allah controls the heavens and earth\n• no one shares authority with Him\n\n\"Whatever is in the heavens and whatever is on the earth glorifies Allah. To Him belongs dominion, and to Him belongs praise, and He is over all things capable.\" (At-Taghābun 64:1)\n\n\"To whom belongs the dominion of the heavens and the earth; He has not taken a son, nor does He have a partner in dominion.\" (Al-Furqān 25:2)\n\nIf Allah had a partner in dominion, the system of creation would collapse. Multiple rulers with conflicting wills would lead to chaos and destruction. The fact that creation operates in perfect order proves that Allah alone is the Ruler, the Manager, and the Creator.",
  },
  {
    title: "Part 5: Negation of False Beliefs",
    body:
      "Allah negates:\n• having a son\n• having partners\n• having equals\n• having helpers out of weakness\n\n\"Say: Praise be to Allah, who has not taken a son, and has no partner in His dominion, and has no protector from weakness.\" (Al-Isrā' 17:111)\n\n\"Allah has not taken a son, nor is there any god with Him.\" (Al-Mu'minūn 23:91)\n\nThese beliefs are false and contradict Allah's perfection. Allah does not need a son (as He is not weak like humans who need children for support). Allah does not have a partner (as He is self-sufficient and all-powerful). Allah does not have a helper (as He is all-powerful and needs no one). All these false beliefs contradict the perfection of Allah.",
  },
  {
    title: "Part 6: Prohibition of Speaking About Allah Without Knowledge",
    body:
      "The book warns strongly against:\n• inventing beliefs about Allah\n• describing Allah without evidence\n• making comparisons or examples\n\n\"So do not strike examples for Allah. Indeed, Allah knows and you do not know.\" (An-Naḥl 16:74)\n\n\"And that you say about Allah what you do not know.\" (Al-A'rāf 7:33)\n\nA Muslim must base their belief about Allah only on the Qur'an and Sunnah. They must not invent beliefs, must not make false comparisons, and must not speak about Allah without knowledge. This is a serious warning because speaking about Allah without knowledge is a major sin.",
  },
  {
    title: "Part 7: Methodology of Ahl al-Sunnah in the Attribute of Oneness",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm Allah's absolute oneness\n• negate every form of shirk\n• rely only on Qur'an and Sunnah\n• do not philosophize or speculate\n• do not invent beliefs\n\nThey worship Allah alone:\n• inwardly and outwardly\n• openly and secretly\n\nThey reject all forms of shirk:\n• major shirk (associating partners with Allah)\n• minor shirk (hidden forms of reliance on other than Allah)\n• shirk in names and attributes\n\nAhl al-Sunnah follow the clear evidence from the Qur'an and Sunnah. They do not add to their belief or subtract from it. They reject innovations in religion and remain firm on the original message brought by the Prophet .",
  },
  {
    title: "Part 8: Effects of Believing in Allah's Oneness",
    body:
      "Belief in Allah's oneness:\n• purifies worship\n• strengthens reliance on Allah\n• removes fear of creation\n• builds sincerity\n• unites the believers upon truth\n• brings peace and tranquility\n• prevents despair and hopelessness\n• motivates good deeds\n• protects from innovation and falsehood\n\nWhen a believer truly believes that Allah is One with no partner, they stop seeking help from false sources. They stop fearing anyone except Allah. They trust only in Allah. This creates a strong, unified Muslim community based on truth.",
  },
  {
    title: "Part 9: Key Sentence to Memorize",
    body:
      "Allah is One with no partner, no equal, and no rival; He alone deserves worship, dominion, and praise, without any form of shirk or resemblance.\n\nThis sentence summarizes:\n• Allah's absolute oneness\n• Negation of all partners, equals, and rivals\n• Allah's exclusive right to worship\n• Allah's exclusive dominion and authority\n• Negation of shirk\n• Negation of resemblance\n\nThis is the central belief of Islam. Memorise it and understand it deeply. It is the foundation upon which all other beliefs are built.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah is absolutely One with no partner, equal, or rival in any way.\n\n Worship, reliance, fear, and hope belong exclusively to Allah.\n\n All dominion and authority belong to Allah; no one shares power with Him.\n\n False beliefs about Allah (like having a son or partner) contradict His perfection.\n\n Speaking about Allah without knowledge is prohibited and a serious sin.\n\n Ahl al-Sunnah affirm Allah's oneness purely from Qur'an and Sunnah without innovation.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's absolute oneness.\n\n Read Surah Al-Ikhlas (Chapter 112) daily and reflect on its meaning.\n\n Guard against all forms of shirk, both major (associating partners) and minor (hidden reliance).\n\n Give all worship and reliance exclusively to Allah in your daily life.\n\n Never invent beliefs about Allah; base all beliefs only on Qur'an and Sunnah.\n\n Teach others about Allah's oneness and warn them against shirk.",
  },
  DEFAULT_QUIZ_SECTION,
];

const ISTIWA_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Meaning of Al-Istiwā'",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms that Al-Istiwā' means that Allah rose over the Throne in a manner that befits His majesty.\n\nIt is:\n• real and true\n• affirmed exactly as stated in revelation\n• without asking how\n• without likening Allah to creation\n• without distortion or denial\n\nThe wording is known, but the manner (how) is unknown to us.\n\nThis is the methodology of Ahl al-Sunnah. We do not deny what Allah affirmed. We do not distort its meaning. We do not ask how it is (since how-ness belongs only to Allah). We do not compare it to creation. We simply believe what Allah said, understanding it according to its clear meaning, and leaving the details to Allah's wisdom.",
  },
  {
    title: "Part 2: Qur'anic Evidence for Al-Istiwā'",
    body:
      "The Qur'an mentions Allah's rising over the Throne seven times, all with the same meaning:\n\n\"The Most Merciful rose over the Throne.\" (7:54)\n\n\"Then He rose over the Throne.\" (10:3)\n\n\"Then He rose over the Throne.\" (13:2)\n\n\"The Most Merciful rose over the Throne.\" (20:5)\n\n\"Then He rose over the Throne.\" (25:59)\n\n\"Then He rose over the Throne.\" (32:4)\n\n\"Then He rose over the Throne.\" (57:4)\n\nThese verses clearly affirm:\n• the Throne ('Arsh) is a created entity\n• Allah is above it\n• the action of rising is attributed to Allah without metaphor\n\nThe repetition of this attribute in the Qur'an emphasizes its importance. It is mentioned across different chapters and in different contexts. This teaches us that affirming Al-Istiwā' is a fundamental part of correct belief in Allah.",
  },
  {
    title: "Part 3: The Throne ('Arsh)",
    body:
      "The Throne is:\n• the greatest and highest of all created things\n• above the heavens\n• distinct from creation\n\nAllah mentioning His rising over the Throne indicates:\n• His supremacy\n• His greatness\n• His absolute authority\n\nThe Throne is the greatest of all creations. It is above the seven heavens. To say that Allah rose over the Throne means that Allah is above this greatest of creations. The Throne represents the highest point in creation, and Allah is above it. This shows Allah's absolute supremacy. Nothing in creation is higher than the Throne, and Allah is above even the Throne. This is the greatest demonstration of Allah's highness and authority.",
  },
  {
    title: "Part 4: Attribute of Highness ('Uluww)",
    body:
      "Closely connected to Al-Istiwā' is Allah's Highness ('Uluww).\n\nAllah is:\n• high above His creation\n• above the heavens\n• above the Throne\n• separate from creation\n\nThis highness is:\n• highness of essence (Allah's being itself is high)\n• highness of status (Allah's position is supreme)\n• highness of power and authority (Allah's command is absolute)\n\nAllah's highness is not just physical distance. It includes His complete dominion, His absolute authority, and His supreme status above all creation. Nothing rivals Allah. Nothing compares to Allah. No creation reaches the level of Allah's status and power. This highness is one of Allah's attributes that believers must affirm.",
  },
  {
    title: "Part 5: Additional Qur'anic Proofs of Highness",
    body:
      "The book also mentions verses showing that things are raised to Allah, which proves His highness:\n\n\"To Him ascend good words.\" (35:10)\n\n\"Rather, Allah raised him to Himself.\" (4:158)\n\n\"Do you feel secure that He who is above the heaven...?\" (67:16)\n\nHere, \"above the heaven\" refers to absolute highness, not that Allah is contained within creation.\n\nWhen good words ascend to Allah, it means they reach Allah who is high above. When Allah raised Prophet Isa (Jesus) to Himself, it means He elevated him to a high position with Allah. When the Qur'an says Allah is \"above the heaven,\" it means He is above it in a way befitting His majesty. All of these verses prove that Allah is truly and absolutely high above His creation.",
  },
  {
    title: "Part 6: Highness Does Not Contradict Closeness",
    body:
      "Ibn Taymiyyah explains an important balance:\n\nAllah is above the Throne in His essence.\n\nAllah is with His creation by His knowledge, hearing, and seeing.\n\nThese two are both true and do not contradict each other.\n\nBeing \"with\" creation does not mean Allah is physically present within it.\n\nThink of it this way: A king can be in his high palace, separated by distance from his kingdom, yet he knows everything that happens there through reports and surveillance. He hears of events, sees developments, and controls the kingdom. He is \"with\" his kingdom in authority and knowledge, yet he is \"above\" it in position. Similarly, Allah is above the Throne in His essence, yet He is with His creation by His knowledge, seeing, hearing, and support. Both attributes are true and both are essential to correct belief.",
  },
  {
    title: "Part 7: Statement of the Salaf",
    body:
      "The famous statement of the early scholars applies here:\n\n\"Al-Istiwā' is known, how is unknown, believing in it is obligatory, and asking about it is an innovation.\"\n\nThis summarizes the methodology of Ahl al-Sunnah perfectly.\n\nAl-Istiwā' is known: The Qur'an is clear. Allah rose over the Throne. This is known from the text.\n\nHow is unknown: We do not know the manner of Allah rising. We do not ask how Allah performs this action. How-ness is beyond our comprehension for Allah's attributes.\n\nBelieving in it is obligatory: It is a part of faith. We must affirm it.\n\nAsking about it is an innovation: Creating questions and speculations about the how is an innovation in religion. The Prophet and the Companions did not do this. We should follow their path, not invent new ways.",
  },
  {
    title: "Part 8: Rejection of Deviant Interpretations",
    body:
      "The book rejects:\n• interpreting Al-Istiwā' as mere \"control\" or \"dominion\"\n• denying the attribute altogether\n• claiming Allah is everywhere physically\n\nAll of these oppose the clear wording of the Qur'an and the understanding of the Salaf.\n\nSome people try to reinterpret Al-Istiwā'. They say it means Allah \"conquered\" the Throne or \"controlled\" it. But this is wrong. The Arabic word Istiwā' (rose over) has a clear meaning. If we interpret it as something else, we are distorting the Qur'an. The Companions understood it as rising over, and that is the correct understanding. Some people deny it altogether and claim Allah is not above the Throne. This contradicts the Qur'an. Others claim Allah is everywhere, meaning He is physically present in all places. This is also wrong. It contradicts Allah's attribute of being above the Throne. We must affirm what the Qur'an clearly states.",
  },
  {
    title: "Part 9: Methodology of Ahl al-Sunnah wal-Jamā'ah",
    body:
      "Ahl al-Sunnah:\n• affirm Allah's settling over the Throne\n• affirm His absolute highness\n• do not distort meanings\n• do not deny attributes\n• do not ask how\n• do not compare Allah to creation\n\nThey affirm what Allah affirmed for Himself, and remain silent where revelation is silent.\n\nAhl al-Sunnah take the middle path. They do not exaggerate like some sects that claim Allah has physical form. They do not minimize like other sects that deny or reinterpret His attributes. They simply take the Qur'an and Sunnah as they are. They affirm what Allah affirmed. They use the words Allah used. They understand it as the Companions understood it. They believe it is true. They do not ask how. They do not make comparisons. They simply stand on the path of truth.",
  },
  {
    title: "Part 10: Effects of Believing in Al-Istiwā' and Highness",
    body:
      "Correct belief in these attributes:\n• increases reverence for Allah\n• strengthens humility in worship\n• elevates the heart above worldly attachment\n• deepens awe and submission\n\nWhen you truly believe that Allah is high above all creation, that He is above the Throne, that He is supreme and unrivaled, your heart fills with awe. You realize you are insignificant compared to Allah's greatness. This makes you humble. This makes you sincere in worship. You stop fearing creation and start fearing Allah alone. You stop relying on anyone except Allah. You stop worrying about worldly matters. Your heart becomes attached to the Hereafter. You become a strong believer focused on pleasing Allah.",
  },
  {
    title: "Part 11: Key Sentence to Memorize",
    body:
      "Allah rose over the Throne and is above all His creation in a manner befitting His majesty, without resemblance, without distortion, and without asking how.\n\nThis sentence summarizes:\n• Al-Istiwā' (rising over the Throne)\n• Highness above creation\n• Manner befitting His majesty (without resemblance to creation)\n• Without distortion (taking the meaning as it is)\n• Without asking how (unknown to us)\n• Complete summary of the correct belief\n\nMemorise this sentence. It confirms your belief in Allah's attributes. It protects you from deviant interpretations. It reminds you of the correct path. It gives you the key to understanding this important attribute.",
  },
  {
    title: "Moral lessons",
    body:
      "• Allah rose over the Throne; He is above all creation in a manner befitting His majesty.\n\n• Affirm Al-Istiwā' and Allah's highness exactly as stated in the Qur'an without distortion or denial.\n\n• Do not ask how Allah performs His attributes; the manner is beyond our knowledge.\n\n• Allah's highness is compatible with His closeness; both are true and do not contradict.\n\n• Believing in Allah's absolute highness increases reverence, humility, and submission in worship.\n\n• Follow the path of Ahl al-Sunnah: affirm, do not distort, do not deny, and do not compare Allah to creation.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about Al-Istiwā' and Allah's highness.\n\n• Read the seven Qur'anic verses about Al-Istiwā' and reflect on their meaning.\n\n• Understand that the Throne is the greatest creation and Allah is above it.\n\n• Do not attempt to interpret or philosophize about how Allah rose over the Throne.\n\n• Remember Allah's highness when you face difficulties; it strengthens your trust in Allah.\n\n• Use this belief to increase your humility and submission in prayer and throughout your day.\n\n• Teach others about Allah's correct attributes using evidence from the Qur'an.",
  },
  DEFAULT_QUIZ_SECTION,
];

const OMNIPRESENCE_CLOSENESS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attribute of Closeness (Ma'iyyah) using clear verses from the Qur'an cited in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"And He is with you wherever you are, and Allah sees what you do.\" (Surah Al-Ħadīd 57:4)\n\n\"Indeed, Allah is with those who fear Him and those who do good.\" (Surah An-Naḥl 16:128)\n\n\"Indeed, Allah is with the patient.\" (Surah Al-Baqarah 2:153)\n\n\"Do not grieve; indeed Allah is with us.\" (Surah At-Tawbah 9:40)\n\n\"Indeed, I am with you both; I hear and I see.\" (Surah Tā-Hā 20:46)\n\nThese verses establish the attribute of being \"with\" creation. They show that Allah is close to His servants in knowledge, support, and care.",
  },
  {
    title: "Part 2: Meaning of Allah's Closeness (Al-Ma'iyyah)",
    body:
      "Allah's Closeness means:\n• Allah is with His creation by His knowledge\n• Allah sees everything\n• Allah hears everything\n• Allah knows everything\n• Allah supports and aids whom He wills\n\nThis does NOT mean Allah is physically inside creation.\n\n\"And He is with you wherever you are, and Allah sees what you do.\" (Al-Ħadīd 57:4)\n\nAllah is with you in every place, every moment. He knows what you do openly and in secret. He hears what you say and even what you think. Yet His being \"with you\" does not mean He is in the same place as you physically. Rather, it means He is aware of you, supporting you, and supervising your affairs.",
  },
  {
    title: "Part 3: General Closeness",
    body:
      "General Closeness: Allah is with all creation by:\n• knowledge\n• hearing\n• seeing\n• control\n\n\"And He is with you wherever you are.\" (Al-Ħadīd 57:4)\n\nThis includes believers and non-believers. All creatures are under Allah's supervision. Whether a person acknowledges it or not, Allah is aware of them. Allah knows everything they do. Allah sees their actions. Allah controls their affairs. This general closeness applies to everyone without exception.\n\nIt means that\n• no one can hide from Allah\n• Allah's knowledge encompasses all\n• Allah's control is complete\n• escape is impossible",
  },
  {
    title: "Part 4: Special Closeness",
    body:
      "Special Closeness: Allah is with specific people by:\n• support\n• help\n• protection\n• guidance\n\n\"Indeed, Allah is with those who fear Him and those who do good.\" (An-Naḥl 16:128)\n\n\"Indeed, Allah is with the patient.\" (Al-Baqarah 2:153)\n\n\"Do not grieve; indeed Allah is with us.\" (At-Tawbah 9:40)\n\nThis special closeness is only for believers. Those who fear Allah and do good deeds experience Allah's help, protection, and guidance in a special way. When believers face trials, Allah is with them giving them strength. When they face enemies, Allah is with them giving them victory. When they feel afraid, Allah is with them giving them comfort. This is a special mercy from Allah to His believing servants.",
  },
  {
    title: "Part 5: Closeness Does Not Contradict Highness",
    body:
      "Ibn Taymiyyah clearly explains:\n• Allah is above the Throne\n• Allah is with His creation by knowledge\n\nHighness and closeness are both true. They do not contradict each other.\n\nAllah is:\n• high in His essence\n• close by His knowledge, power, and care\n\nThink of it this way: A king can be in his palace (high above) while being aware of everything in his kingdom (close by knowledge). He can see his kingdom, hear about its affairs, and control what happens in it, all while sitting in his palace. Similarly, Allah is above the Throne in His essence, yet by His knowledge and power, He is close to all creation, supervising and controlling everything.",
  },
  {
    title: "Part 6: Common Mistake Corrected by the Book",
    body:
      "Some people wrongly believe: Allah is everywhere physically.\n\nThe book rejects this and teaches:\n• Allah is not inside creation\n• Allah is not mixed with creation\n• Allah is distinct from His creation\n\nThis false belief comes from misunderstanding the verses about Allah being \"with\" His creation. Some people think it means Allah is physically present everywhere. But the correct understanding is:\n\n\"With you\" means:\n• with knowledge\n• with support\n• with supervision\n\nNot physical presence. Allah is separate from creation. He is above it. He is not in His creation, nor is His creation in Him. But by His knowledge, He is aware of all creation. By His power, He controls all creation. By His will, He supports those He chooses.",
  },
  {
    title: "Part 7: Methodology of Ahl al-Sunnah in This Attribute",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm Allah's closeness as mentioned in the Qur'an\n• affirm Allah's highness over the Throne\n• do not deny either attribute\n• do not distort meanings\n• do not ask how\n• do not compare Allah to creation\n\nThey believe: Allah is with His servants in a way befitting His majesty.\n\nDeviant groups:\n• claim Allah is everywhere physically\n• claim Allah is mixed with creation\n• deny Allah's highness over the Throne\n• interpret \"with\" in ways that contradict other attributes\n\nAhl al-Sunnah maintain the balance. They affirm both the closeness and the highness. They understand \"with\" in the correct Islamic sense. They do not philosophize or invent meanings. They take the verses as they are and understand them correctly.",
  },
  {
    title: "Part 8: Effects of Believing in Allah's Closeness",
    body:
      "Belief in Allah's closeness:\n• increases awareness of Allah\n• strengthens patience in hardship\n• brings comfort in fear\n• encourages sincerity\n• increases trust in Allah's help\n• prevents feeling alone or abandoned\n• builds confidence during trials\n• motivates obedience\n\nWhen a believer knows that Allah is with them, they feel:\n• protected and safe\n• supported and helped\n• watched over and cared for\n• never truly alone\n\nThis knowledge transforms how they face life. They are patient because Allah is with them. They are courageous because Allah is with them. They are sincere because Allah is watching them. They are hopeful because Allah is helping them.",
  },
  {
    title: "Part 9: Key Sentence to Memorize",
    body:
      "Allah is with His creation by His knowledge, hearing, seeing, and support, while being above the Throne in His essence, without resemblance and without asking how.\n\nThis sentence summarizes:\n• Affirmation of Allah's closeness\n• Types of closeness (knowledge, hearing, seeing, support)\n• Affirmation of Allah's highness\n• No contradiction between closeness and highness\n• Negation of physical presence\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this carefully. It protects your belief from confusion between contradictory ideas. It teaches the correct Islamic balance.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah is with all creation by His knowledge; nothing escapes His awareness.\n\n Allah is with believers by His support, help, and protection in a special way.\n\n Allah is both above the Throne and close to creation by knowledge; these do not contradict.\n\n Allah is not physically inside creation; His closeness is through knowledge and power, not physical presence.\n\n Believers should never feel alone or abandoned because Allah is with them.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's closeness and highness.\n\n Reflect on Surah Al-Hadid (57:4): \"He is with you wherever you are,\" and feel Allah's presence.\n\n Remember Allah is with you in private; guard your hidden actions as you guard your public ones.\n\n In times of fear or difficulty, remind yourself: \"Allah is with me.\"\n\n Have confidence that Allah hears your du'a' and sees your struggles.\n\n Teach others the correct understanding: Allah is close by knowledge and power, not physically.",
  },
  DEFAULT_QUIZ_SECTION,
];

const SPEECH_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah affirms the Attribute of Speech (Al-Kalām) using clear verses from the Qur'an cited in Al-'Aqidah Al-Wāsitiyyah. Allah says:\n\n\"And Allah spoke to Mūsā directly.\" (Surah An-Nisā' 4:164)\n\n\"And when Mūsā came at Our appointed time and his Lord spoke to him…\" (Surah Al-A'rāf 7:143)\n\n\"And Allah spoke to him.\" (Surah Al-Baqarah 2:253)\n\n\"His command, when He intends a thing, is only that He says to it, 'Be,' and it is.\" (Surah Yā-Sīn 36:82)\n\n\"And if one of the polytheists seeks your protection, then grant him protection so that he may hear the words of Allah.\" (Surah At-Tawbah 9:6)\n\nThese verses clearly prove that Allah truly speaks.",
  },
  {
    title: "Part 2: Meaning of Allah's Speech",
    body:
      "Allah's Speech means:\n• Allah speaks whenever He wills\n• Allah speaks however He wills\n• Allah speaks with real speech\n• His speech is perfect and complete\n\nAllah's speech is:\n• not silence\n• not imagination\n• not created\n\n\"His command, when He intends a thing, is only that He says to it, 'Be,' and it is.\" (Yā-Sīn 36:82)\n\nWhen Allah wants to create something, He simply says \"Be,\" and it comes into existence. This shows that Allah truly speaks. His speech is real and has real effects. His words create. His words command. His words guide. This proves that Allah's speech is not empty or meaningless.",
  },
  {
    title: "Part 3: Allah Spoke to the Prophets",
    body:
      "The book highlights that:\n• Allah spoke directly to Mūsā\n• This speech was real, not metaphorical\n• Mūsā heard Allah's speech\n\n\"And Allah spoke to Mūsā directly.\" (An-Nisā' 4:164)\n\n\"And when Mūsā came at Our appointed time and his Lord spoke to him…\" (Al-A'rāf 7:143)\n\nThis is why Mūsā is called Kalīmullāh (the one Allah spoke to). This is a special honor and distinction. Allah actually spoke to Mūsā. Not in dreams or visions or inspiration only, but real speech that Mūsā heard with his ears. This confirms the reality of Allah's attribute of speech.",
  },
  {
    title: "Part 4: Allah's Speech Is With Letters and Sound",
    body:
      "Ibn Taymiyyah explains (based on Qur'an and Sunnah) that:\n• Allah's speech is heard\n• What is heard must be speech in reality\n• The Qur'an itself is described as the words of Allah\n\n\"So that he may hear the words of Allah.\" (At-Tawbah 9:6)\n\nThe Qur'an says that the polytheist should hear the \"words of Allah.\" Words are made of letters and sounds. When we speak, we use letters arranged in order to form words. Similarly, Allah's speech consists of words, which are real. The Qur'an is the speech of Allah. We read the Qur'an, and we are reading the actual words of Allah.",
  },
  {
    title: "Part 5: Allah Speaks When He Wills",
    body:
      "Allah's speech is:\n• linked to His will\n• not constant silence\n• not forced\n\nAllah spoke:\n• to Mūsā\n• to the angels\n• will speak on the Day of Judgment\n\nAllah is not silent. He is not prevented from speaking. He speaks when He chooses to speak. He has spoken to the prophets with revelation. He speaks through the Qur'an. He will speak on the Day of Judgment when He addresses His creation. This shows that Allah's speech is active and real. It is not a quality that is locked away. It is exercised and expressed.",
  },
  {
    title: "Part 6: Rejection of False Beliefs",
    body:
      "The book rejects claims that:\n• Allah does not speak\n• Allah's speech is only created sounds\n• Allah's speech is only meaning without words\n\nThese beliefs contradict clear Qur'anic texts.\n\nSome deviant groups claim:\n• Allah is silent and does not speak at all\n• What we call Allah's speech is actually created by something else\n• Allah's speech is only abstract meaning with no actual words\n\nBut the Qur'an is clear. Allah speaks. The Qur'an is the speech of Allah. Mūsā heard Allah speak. These are all explicit in the Qur'an. To deny this is to deny the clear words of Allah.",
  },
  {
    title: "Part 7: Methodology of Ahl al-Sunnah in the Attribute of Speech",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm that Allah speaks\n• affirm His speech as real\n• affirm it without distortion\n• affirm it without denial\n• do not ask how\n• do not compare Allah's speech to creation\n\nThey believe: Allah speaks in a way befitting His majesty.\n\nDeviant groups:\n• deny Allah's speech completely\n• claim the Qur'an is created\n• reduce speech to abstract concept\n• invent strange theories about what Allah's speech means\n\nAhl al-Sunnah take the middle path. They affirm what is clear in the Qur'an. They do not deny. They do not distort. They do not ask how. They accept that Allah speaks and that His speech is real, in a way befitting His majesty and perfection.",
  },
  {
    title: "Part 8: Effects of Believing in Allah's Speech",
    body:
      "Belief in Allah's speech:\n• increases respect for revelation\n• strengthens love for the Qur'an\n• increases obedience to Allah's commands\n• builds certainty in guidance\n• deepens reverence for the Qur'an\n• motivates careful reading of the Qur'an\n• strengthens faith in the Qur'an as guidance\n• increases compliance with Allah's commands\n\nWhen you truly believe that the Qur'an is the actual speech of Allah, not just human words, it changes how you treat it. You read it with reverence. You obey it with certainty. You love it deeply. You seek its guidance in all matters. This belief transforms the Qur'an from merely a book into a living connection to Allah.",
  },
  {
    title: "Part 9: Key Sentence to Memorize",
    body:
      "Allah truly speaks whenever He wills and however He wills; His speech is real and perfect, without resemblance to creation and without asking how.\n\nThis sentence summarizes:\n• Affirmation of Allah's speech\n• Its connection to His will\n• Its reality and perfection\n• Its scope and nature\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this sentence. It protects your belief about the Qur'an and Allah's attributes. It keeps you firm on the path of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " Allah truly speaks; His speech is real and not metaphorical.\n\n The Qur'an is the actual speech of Allah, not the speech of anyone else.\n\n Allah spoke to the prophets directly, making them the most honored of creation.\n\n Allah's speech creates and commands; His words have real effects.\n\n Belief in Allah's speech increases respect for the Qur'an and obedience to its guidance.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about Allah's speech.\n\n Read the Qur'an with reverence, remembering it is the actual speech of Allah.\n\n Reflect on Surah An-Nisa (4:164): \"And Allah spoke to Mūsā directly.\"\n\n Obey the Qur'an fully, knowing every command comes directly from Allah.\n\n Teach others that the Qur'an is the speech of Allah and should be treated with utmost respect.\n\n When reading or listening to the Qur'an, remember you are hearing the words of Allah himself.",
  },
  DEFAULT_QUIZ_SECTION,
];

const QURAN_IS_SPEECH_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The Central Belief in This Section",
    body:
      "Ibn Taymiyyah clearly states in Al-'Aqidah Al-Wāsitiyyah that:\n\nThe Qur'an is the Speech of Allah. It is not created, and it truly came from Allah.\n\nThis belief is a core foundation of Ahl al-Sunnah wal-Jama'ah. It is not an optional belief or something to debate about. This is foundational to Islamic creed. The Qur'an is not merely a beautiful book written by humans. It is not the words of the Prophet \ufe0f. It is the words of Allah Himself, revealed through the Prophet \ufe0f as a mercy to all creation.",
  },
  {
    title: "Part 2: Qur'anic Evidence Used in the Book",
    body:
      "The book uses clear verses to prove that the Qur'an is Allah's speech:\n\n\"And if one of the polytheists seeks your protection, then grant him protection so that he may hear the words of Allah.\" (Surah At-Tawbah 9:6)\n\n\"They want to change the words of Allah.\" (Surah Al-Fath 48:15)\n\n\"And recite what has been revealed to you of the Book of your Lord; none can change His words.\" (Surah Al-Kahf 18:27)\n\n\"Falsehood cannot approach it from before it or from behind it; [it is] a revelation from One Wise and Praiseworthy.\" (Surah Fussila̱t 41:42)\n\nThese verses prove that:\n• the Qur'an is Allah's words\n• it is revealed\n• it cannot be changed or corrupted\n• it is protected and preserved\n• it is a revelation from Allah, the Wise and Praiseworthy",
  },
  {
    title: "Part 3: What Does 'The Qur'an Is the Speech of Allah' Mean?",
    body:
      "It means:\n• Allah spoke the Qur'an\n• Jibrīl (peace be upon him) heard it from Allah\n• Jibrīl conveyed it to the Prophet \ufe0f\n• The Prophet \ufe0f conveyed it to the Ummah\n\nThe Qur'an:\n• began from Allah\n• was revealed, not invented\n• is guidance, not poetry or philosophy\n• is preserved by Allah\n• is complete and perfect\n\nThis is the Islamic understanding. The Qur'an did not come from the mind of the Prophet \ufe0f. It did not come from the culture or environment of Arabia. It came directly from Allah through Jibrīl. This is why it is unique and inimitable.",
  },
  {
    title: "Part 4: The Qur'an Is Not Created",
    body:
      "Ibn Taymiyyah affirms clearly:\n• Allah's speech is an attribute of Allah\n• Allah's attributes are not created\n• Therefore, the Qur'an is not created\n\nCreated things:\n• have a beginning\n• are limited\n• perish\n\nThe Qur'an:\n• is Allah's speech\n• belongs to His attribute of speech\n• is not like created speech\n\nThis is a crucial belief. Some misguided groups claim the Qur'an is created. But if the Qur'an is created, then it has the weakness of creation. It could be changed, corrupted, or lost. But Allah has guaranteed to preserve the Qur'an. This guarantee only makes sense if the Qur'an is not created but is the eternal speech of Allah.",
  },
  {
    title: "Part 5: Writing, Recitation, and Memorization",
    body:
      "The book explains an important distinction:\n• The Qur'an itself is the uncreated speech of Allah\n• Our voices, writing, and recitation are created\n\nExample:\n• Ink and paper are created\n• Voices are created\n• But what is written and recited is Allah's uncreated speech\n\nWhen we write the Qur'an on paper, the paper is created. When we recite the Qur'an with our voices, the voice is created. But the actual Qur'an—the words, the meaning, the content—is uncreated speech of Allah. This distinction is important to protect belief from confusion. It means:\n• We treat the physical Qur'an with respect (the paper, the ink)\n• We recognize the recitation as created but as a vehicle for conveying the uncreated speech\n• We affirm that the actual speech of Allah is uncreated",
  },
  {
    title: "Part 6: Rejection of Deviant Beliefs",
    body:
      "The book rejects the belief of those who say:\n• the Qur'an is created\n• the Qur'an is only a human expression\n• the Qur'an is just meaning without real words\n\nThese beliefs contradict:\n• the Qur'an itself\n• the Sunnah\n• the consensus of Ahl al-Sunnah\n\nThese false beliefs came from philosophers and deviant sects. They tried to reduce the Qur'an to mere meaning without real words. They tried to claim human creation played a role. But all of this contradicts the clear teachings of Islam. The Qur'an is clear in its claim to be the words of Allah. The consensus of the Sahabah and the righteous scholars has always been that the Qur'an is uncreated speech of Allah.",
  },
  {
    title: "Part 7: The Qur'an Is From Allah and Will Return to Him",
    body:
      "Ibn Taymiyyah explains:\n• the Qur'an came from Allah\n• it will return to Allah at the end of time\n\nThis shows:\n• its divine origin\n• its unique status\n• its separation from creation\n\nThe Qur'an is not like other books that are written and then forgotten. It is not like creation that has a beginning and an end. The Qur'an came from Allah and will return to Allah. This is a profound statement about the nature of the Qur'an. It shows that the Qur'an has a special status. It is not merely a historical document. It is not merely a record of the past. It is the uncreated speech of Allah that came to guide humanity and will remain a sign of Allah's truth.",
  },
  {
    title: "Part 8: Methodology of Ahl al-Sunnah in This Belief",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• believe the Qur'an is Allah's speech\n• believe it is uncreated\n• believe it was revealed\n• do not distort its meaning\n• do not deny its reality\n• do not philosophize about it\n\nThey say: The Qur'an is the Speech of Allah, uncreated, from Him it began and to Him it will return.\n\nThis statement combines:\n• Affirmation of it being Allah's speech\n• Affirmation that it is uncreated\n• Affirmation of its divine origin\n• Affirmation of its return to Allah\n\nDeviant groups throughout history have tried to attack this belief. Some claim it is created. Some claim it is merely human. Some claim it is corrupted. But Ahl al-Sunnah remain firm on this truth, deriving it directly from Qur'an, Sunnah, and the consensus of the Sahabah.",
  },
  {
    title: "Part 9: Effects of Believing the Qur'an Is Allah's Speech",
    body:
      "This belief:\n• increases reverence for the Qur'an\n• strengthens obedience to its commands\n• builds certainty in guidance\n• protects from innovation\n• deepens humility before Allah\n• increases love for the Qur'an\n• motivates memorization and learning\n• strengthens faith and certainty\n\nWhen a Muslim truly believes that the Qur'an is the speech of Allah, not created, not made by humans, but directly from Allah, it transforms how they relate to it. They read it with reverence and awe. They obey it without hesitation. They defend it passionately. They memorize it with love. They turn to it for all answers. This belief makes the Qur'an not just a book, but a connection to Allah.",
  },
  {
    title: "Part 10: Key Sentence to Memorize",
    body:
      "The Qur'an is the Speech of Allah—uncreated, revealed from Him, truly spoken by Him, and it will return to Him—without distortion, denial, or resemblance to creation.\n\nThis statement summarizes:\n• The Qur'an is Allah's speech\n• It is uncreated\n• It was revealed\n• It came from Allah\n• It will return to Allah\n• Negation of distortion\n• Negation of denial\n• Negation of comparing it to creation\n\nMemorise this sentence. Understand it deeply. Believe in it firmly. This is the belief of Ahl al-Sunnah, and it is the foundation of Islamic creed regarding the Qur'an.",
  },
  {
    title: "Moral lessons",
    body:
      " The Qur'an is the speech of Allah, not created, but uncreated and eternal.\n\n The Qur'an came from Allah through Jibrīl to the Prophet \ufe0f and to us.\n\n No book is comparable to the Qur'an because it is the words of Allah himself.\n\n Belief in the Qur'an as Allah's speech increases reverence and obedience.\n\n The Qur'an is complete, preserved, and will return to Allah.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about the Qur'an being Allah's speech.\n\n Treat the Qur'an with utmost respect; never touch it in a state of impurity.\n\n Recite the Qur'an regularly and reflect on it as the actual words of Allah.\n\n Learn the Qur'an with the firm belief that you are learning the speech of Allah.\n\n Teach others that the Qur'an is uncreated and from Allah, not created by humans.\n\n Follow the Qur'an in all matters, knowing it is the guidance of Allah to humanity.",
  },
  DEFAULT_QUIZ_SECTION,
];

const SEEING_ALLAH_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The Core Belief in This Section",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms that the believers will see Allah with their own eyes in the Hereafter.\n\nThis belief is part of the creed of Ahl al-Sunnah wal-Jama'ah and is established by:\n• the Qur'an\n• the Sunnah\n• the consensus of the Companions\n\nThis is not a minor or optional belief. It is a core part of Islamic creed. The believers will meet their Lord face to face and see Him. This will be the greatest joy in Paradise. It is what the believers long for throughout their lives.",
  },
  {
    title: "Part 2: Qur'anic Evidence Used in the Book",
    body:
      "The book cites clear verses proving the believers will see Allah:\n\n\"Faces on that Day will be radiant, looking at their Lord.\" (Surah Al-Qiyāmah 75:22–23)\n\nThis verse affirms:\n• real faces\n• real looking\n• directed toward Allah\n\nThe word \"looking\" here is clear and literal, not metaphorical. In the Arabic language, when you say \"looking at\" (nazira ila), it means physically seeing with the eyes. So the believers' faces will be radiant with light, and they will be looking directly at Allah.\n\nAnother verse used to contrast believers and disbelievers:\n\n\"No! Indeed, from their Lord, that Day, they will be veiled.\" (Surah Al-Mutaffifīn 83:15)\n\nIf disbelievers are veiled, it proves that:\n• believers are not veiled\n• believers will see Allah\n\nThe disbelievers are prevented from seeing Allah. This is a punishment for them. But the believers, by contrast, will see Him. This is their reward.",
  },
  {
    title: "Part 3: Evidence from the Sunnah (Hadith)",
    body:
      "The book relies on mutawātir (mass-transmitted) hadiths, including:\n\nThe Prophet \ufe0f said: \"You will see your Lord as you see the full moon on a clear night; you will have no difficulty seeing Him.\"\n\nThis hadith proves:\n• seeing Allah is real\n• believers will see Him clearly\n• the comparison is about clarity of seeing, not resemblance\n\nNotice the Prophet \ufe0f did not say \"You will see your Lord and He looks like the moon.\" That would be resemblance. Instead, he said you will see Him as you see the moon — meaning you will see Him clearly without any obstruction or difficulty. Just as you can look at the full moon on a clear night without straining, you will see Allah without any barrier.\n\nThis hadith is narrated by multiple Companions and is considered mutawātir (mass-transmitted), meaning it reached such a level of authenticity that it is beyond doubt.",
  },
  {
    title: "Part 4: When Will the Believers See Allah?",
    body:
      "According to the creed explained in the book:\n• Believers will see Allah in the Hereafter\n• They will see Him in Paradise\n• They will see Him on the Day of Judgment\n\nThis is the greatest reward for the believers.\n\nThe scholars explain that believers will see Allah on multiple occasions:\n• On the Day of Judgment during the reckoning\n• In Paradise, where they will see Him regularly\n\nThe most frequent narrations focus on seeing Allah in Paradise. This seeing will be the greatest pleasure and joy in Paradise. It will surpass all other blessings. Even the beauty and comfort of Paradise cannot compare to the joy of seeing Allah.",
  },
  {
    title: "Part 5: Seeing Allah Does NOT Mean Resemblance",
    body:
      "Ibn Taymiyyah stresses an essential rule:\n• Seeing Allah does not mean Allah is like creation\n• Seeing does not require Allah to be limited, contained, or similar\n\n\"There is nothing like Him, and He is the All-Hearing, the All-Seeing.\" (Surah Ash-Shūrā 42:11)\n\nWe affirm:\n• the seeing\n✖ We do not describe how\n✖ We do not imagine a form\n\nSome people wrongly think that if we can see something, it must be physical like creation. But this is a false assumption. Allah is not like creation. His attributes are not like the attributes of creation. We can see Allah without Him being limited or confined. We cannot imagine how this seeing will be, but we affirm that it will happen.\n\nThis is the methodology: affirm what the Qur'an and Sunnah say, without asking how, without comparing to creation.",
  },
  {
    title: "Part 6: Refutation of False Beliefs",
    body:
      "The book rejects the belief of those who claim:\n• Allah cannot be seen\n• seeing Allah is impossible\n• the verses mean \"seeing reward only\"\n\nThese claims contradict:\n• clear Qur'anic language\n• authentic hadith\n• understanding of the Companions\n\nSome deviant groups interpret the verse \"looking at their Lord\" to mean \"looking at the reward from their Lord.\" But this is distortion. The verse is clear. It says \"looking at their Lord,\" not \"looking at their Lord's reward.\" There is no reason to distort the plain meaning of the text.\n\nOthers claim seeing is impossible. But the Qur'an and Sunnah say it will happen. Who are we to declare impossible what Allah has declared will happen? This is arrogance and rejection of revelation.",
  },
  {
    title: "Part 7: The Position of the Companions",
    body:
      "The Companions unanimously believed that:\n• the believers will see Allah\n• there was no disagreement among them on this issue\n\nAny later disagreement came from innovated theology, not from the early generations.\n\nThe Companions heard the verses and the hadiths directly from the Prophet \ufe0f. They understood them in the plain, straightforward way. They did not philosophize about it. They did not deny it. They did not distort it. They simply believed it.\n\nAll major Companions — Abu Bakr, 'Umar, 'Uthman, 'Ali, Ibn 'Abbas, and others — affirmed this belief. There was unanimous agreement among them. Any disagreement came later from groups influenced by Greek philosophy and other deviant ideas.",
  },
  {
    title: "Part 8: Methodology of Ahl al-Sunnah in This Attribute",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm seeing Allah as true\n• affirm it without distortion\n• affirm it without denial\n• do not ask how\n• do not compare Allah to creation\n\nThey say: The believers will see their Lord in the Hereafter, in a way befitting His majesty.\n\nDeviant groups:\n• deny seeing completely\n• claim it means seeing reward only\n• claim it is impossible\n• philosophize about what can and cannot be seen\n\nAhl al-Sunnah take the clear evidence from Qur'an and Sunnah and accept it. They do not impose limitations based on human reason or imagination. They trust that Allah has told the truth about what will happen in the Hereafter.",
  },
  {
    title: "Part 9: Effects of Believing in Seeing Allah",
    body:
      "Belief in seeing Allah:\n• increases longing for Paradise\n• strengthens patience in hardship\n• motivates obedience\n• reduces attachment to the dunya\n• fills the heart with hope\n• creates love for Allah\n• builds excitement for the Hereafter\n\nWhen a believer knows they will see Allah, their priorities change. The pleasures of this world become small. The difficulties of this world become bearable. The goal becomes clear: to reach Paradise and see Allah.\n\nThis belief transforms worship. You are not just obeying rules. You are preparing to meet the One you love and worship. You will see Him. You will be in His presence. This is the ultimate goal.",
  },
  {
    title: "Part 10: Key Sentence to Memorize",
    body:
      "The believers will see Allah with their own eyes in the Hereafter, a true seeing without resemblance, without asking how, and as the greatest reward in Paradise.\n\nThis sentence summarizes:\n• Affirmation of seeing\n• Real physical seeing with eyes\n• In the Hereafter (Paradise and Day of Judgment)\n• True and real\n• Negation of resemblance\n• Negation of asking how\n• It is the greatest reward\n\nMemorise this sentence. It protects your belief from distortion and denial. It keeps you firm on the path of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " The believers will see Allah with their own eyes in the Hereafter; this is affirmed by Qur'an, Sunnah, and Companions.\n\n Seeing Allah is the greatest reward and joy in Paradise, surpassing all other blessings.\n\n Seeing Allah does not mean He resembles creation; we affirm it without asking how.\n\n The Companions unanimously agreed on this belief; any denial came from later deviant groups.\n\n Belief in seeing Allah increases longing for Paradise and motivates obedience.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about seeing Allah in the Hereafter.\n\n Reflect on Surah Al-Qiyamah (75:22-23): \"Faces on that Day will be radiant, looking at their Lord.\"\n\n Increase your longing for Paradise by remembering you will see Allah there.\n\n Let the hope of seeing Allah motivate you during hardship and trials.\n\n Teach others this core Islamic belief and protect it from distortion or denial.\n\n Make du'a' regularly: \"O Allah, make me among those who see Your Noble Face in Paradise.\"",
  },
  DEFAULT_QUIZ_SECTION,
];

const SUNNAH_EVIDENCE_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Why the Sunnah Is Evidence in 'Aqidah",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that belief in Allah's Names and Attributes is taken from two sources only:\n• the Qur'an\n• the authentic Sunnah of the Prophet \ufe0f\n\nThe Sunnah is revelation from Allah, just like the Qur'an.\n\nAllah says: \"Nor does he speak from his own desire. It is only a revelation revealed.\" (Surah An-Najm 53:3–4)\n\nThis proves that what the Prophet \ufe0f said about Allah is true, correct, and divinely revealed. When the Prophet \ufe0f teaches us about Allah's attributes, he is not giving his personal opinion. He is conveying revelation from Allah. Therefore, the Sunnah is as authoritative as the Qur'an in matters of belief.",
  },
  {
    title: "Part 2: The Sunnah Confirms What Is in the Qur'an",
    body:
      "Ibn Taymiyyah shows that the Sunnah:\n• explains the Qur'an\n• confirms Allah's Attributes\n• adds details not always mentioned explicitly in the Qur'an\n\nThe Sunnah never contradicts the Qur'an; it supports and clarifies it.\n\nFor example, the Qur'an mentions that Allah speaks, hears, and sees. The Sunnah provides more details about how these attributes manifest, such as Allah speaking to individuals on the Day of Judgment. The Sunnah does not contradict the Qur'an. It complements it. Together, they provide a complete picture of Allah's attributes.",
  },
  {
    title: "Part 3: Attribute of Descending",
    body:
      "The Prophet \ufe0f said: \"Our Lord descends every night to the lowest heaven when the last third of the night remains…\"\n\nThis hadith proves:\n• Allah descends\n• the descending is real\n• it happens in a manner befitting Allah\n\nWe affirm the attribute. We do not ask how.\n\nThis is one of the most well-known hadiths about Allah's attributes. It shows that Allah descends to the lowest heaven every night during the last third of the night. He calls out, asking if anyone is seeking forgiveness, if anyone is making du'a', if anyone needs help. This descent is real. It is not metaphorical. But it is not like the descent of creation. Allah descends in a way befitting His majesty.",
  },
  {
    title: "Part 4: Attribute of Laughter",
    body:
      "The Prophet \ufe0f said: \"Allah laughs at two men: one of them kills the other, yet both enter Paradise.\"\n\nThis proves:\n• Allah laughs\n• His laughter is real\n• it is befitting His majesty\n\nIt is not like human laughter.\n\nThis hadith is about a scenario where one man fights and kills another in battle. The first man was a disbeliever who killed a Muslim. Then the disbeliever later embraces Islam and dies as a martyr. Both enter Paradise. Allah laughs at this situation — not in mockery, but expressing His approval and pleasure at the unexpected turn of events. Allah's laughter is a real attribute, affirmed as it came in the hadith, without comparing it to human laughter.",
  },
  {
    title: "Part 5: Attribute of Wonder",
    body:
      "The Prophet \ufe0f said: \"Allah wonders at a young person who has no inclination toward desires.\"\n\nThis proves:\n• Allah has the attribute of wonder\n• it is affirmed as it came in the Sunnah\n\nWhen a young person, at the peak of their physical desires, restrains themselves for the sake of Allah, Allah is pleased and expresses wonder. This is not wonder due to ignorance or surprise (as humans experience). It is wonder that befits Allah's majesty. Ahl al-Sunnah affirm this attribute as it came, without asking how and without resembling it to human wonder.",
  },
  {
    title: "Part 6: Attribute of Hand and Fingers",
    body:
      "The Prophet \ufe0f said: \"The hearts of the children of Adam are between two fingers of the Most Merciful.\"\n\nThis confirms:\n• Allah has fingers\n• they are real attributes\n• not like created fingers\n\nThis hadith shows that Allah has control over the hearts of people through His fingers. He turns them as He wills. The mention of fingers is affirmed as it came. These are real attributes of Allah, not metaphorical. But they are not like the fingers of creation. We do not ask how Allah's fingers are. We simply affirm them as they came in the authentic Sunnah.",
  },
  {
    title: "Part 7: Attribute of Foot",
    body:
      "The Prophet \ufe0f said regarding Hellfire: \"Hell will continue to say: 'Is there more?' until the Lord places His Foot in it…\"\n\nThis affirms:\n• the attribute of the Foot\n• as a real attribute\n• without resemblance\n\nThis hadith describes a scene from the Day of Judgment. Hellfire will keep asking for more to consume. Finally, Allah will place His Foot in it, and it will be satisfied and say, \"Enough, enough.\" This is affirmation of the attribute of the Foot for Allah, mentioned in authentic hadith. We affirm it as it came, without asking how, without comparing it to the feet of creation.",
  },
  {
    title: "Part 8: Attribute of Speech",
    body:
      "The Prophet \ufe0f said: \"Allah will speak to each person without an interpreter.\"\n\nThis confirms:\n• Allah speaks\n• His speech is real\n• it will occur on the Day of Judgment\n\nOn the Day of Judgment, Allah will speak directly to each person. There will be no interpreter between Allah and His servants. Each person will stand before Allah and Allah will speak to them directly. This confirms the attribute of speech for Allah, which was already established in the Qur'an. The Sunnah adds the detail that Allah will speak to each person individually without an intermediary.",
  },
  {
    title: "Part 9: The Position of the Companions",
    body:
      "Ibn Taymiyyah explains that:\n• the Companions accepted these hadiths as they are\n• they did not reinterpret them\n• they did not deny them\n• they did not ask how\n\nThis was the original understanding of Islam.\n\nThe Companions heard these hadiths directly from the Prophet \ufe0f. When they heard that Allah descends, laughs, has fingers, or has a foot, they accepted it. They did not say, \"This is impossible.\" They did not say, \"This must be a metaphor.\" They simply believed it as it came. This is the safest and most correct methodology.",
  },
  {
    title: "Part 10: Rejection of Philosophical Interpretation",
    body:
      "The book rejects the approach of those who:\n• reject hadith in 'aqidah\n• reinterpret attributes metaphorically\n• prefer logic over revelation\n\nIbn Taymiyyah clarifies that:\n• the safest path is following the Salaf\n• revelation comes before reason\n• reason submits to authentic texts\n\nSome people, influenced by Greek philosophy, tried to interpret these attributes metaphorically. They said descending means \"sending mercy,\" or laughter means \"accepting deeds.\" But this is distortion. The Companions did not do this. The early scholars did not do this. This is innovation. The safest path is to follow the Salaf — accept the texts as they are, without distortion.",
  },
  {
    title: "Part 11: Agreement Between Qur'an and Sunnah",
    body:
      "Ibn Taymiyyah emphasizes:\n• every attribute mentioned in the Sunnah agrees with the Qur'an\n• there is no contradiction between them\n• both come from Allah\n\nRejecting authentic Sunnah is rejecting revelation.\n\nSome people try to create a division. They say, \"We accept what is in the Qur'an, but not what is in the hadith.\" This is deviation. The Qur'an and Sunnah are both revelation. They both come from Allah. What the Prophet \ufe0f said is revelation just as the Qur'an is revelation. To reject authentic Sunnah is to reject part of the revelation.",
  },
  {
    title: "Part 12: Methodology of Ahl al-Sunnah in Using the Sunnah",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• accept authentic hadith in Allah's Attributes\n• affirm them as they came\n• do not distort meanings\n• do not deny attributes\n• do not ask how\n• do not compare Allah to creation\n\nThey say: We believe in it as it came, without asking how.\n\nThis is the methodology that protects belief. It is simple, clear, and safe. When you hear an authentic hadith about Allah's attributes, you accept it. You believe in it. You do not twist its meaning. You do not deny it. You do not ask how. You do not compare Allah to creation. This is the path of the Companions and the Salaf.",
  },
  {
    title: "Part 13: Effects of Accepting the Sunnah in 'Aqidah",
    body:
      "Accepting the Sunnah:\n• preserves correct belief\n• prevents deviation\n• keeps unity upon truth\n• protects from innovation\n• connects Muslims to the understanding of the Salaf\n• increases reverence for the Prophet \ufe0f\n• strengthens faith and certainty\n\nWhen Muslims accept the Sunnah in matters of belief, they remain united on the truth. They avoid the divisions and innovations that plagued other groups. They remain connected to the original understanding of Islam as practiced by the Companions. This is the key to preserving correct belief.",
  },
  {
    title: "Part 14: Key Sentence to Memorize",
    body:
      "Everything authentically reported from the Prophet \ufe0f about Allah's Names and Attributes is true, affirmed as it came, without distortion, denial, resemblance, or asking how.\n\nThis sentence summarizes:\n• Authority of authentic Sunnah\n• Truth of what the Prophet \ufe0f said\n• Affirmation as it came\n• Negation of distortion\n• Negation of denial\n• Negation of resemblance\n• Negation of asking how\n\nMemorise this sentence. It protects your belief and keeps you on the methodology of Ahl al-Sunnah regarding the Sunnah and Allah's attributes.",
  },
  {
    title: "Moral lessons",
    body:
      " The Sunnah is revelation from Allah, just like the Qur'an, and is equally authoritative in matters of belief.\n\n The Companions accepted hadiths about Allah's attributes as they are, without reinterpretation or denial.\n\n Attributes proven by Sunnah (like descending, laughter, wonder, fingers, foot) are real and affirmed without asking how.\n\n The safest path is following the Salaf: accepting texts as they are without distortion or philosophical interpretation.\n\n Rejecting authentic Sunnah in 'aqidah is rejecting revelation and leads to deviation.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about accepting the Sunnah in 'aqidah.\n\n Study authentic hadiths about Allah's attributes with the correct methodology.\n\n When you hear an authentic hadith about Allah, accept it as it came without distorting or denying it.\n\n Follow the example of the Companions: simple acceptance without philosophical complications.\n\n Teach others that the Sunnah is revelation and must be accepted in matters of belief.\n\n Reject attempts to reinterpret or deny attributes mentioned in authentic hadiths.",
  },
  DEFAULT_QUIZ_SECTION,
];

const HEREAFTER_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The Place of the Hereafter in 'Aqidah",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms that belief in the Hereafter is a core foundation of faith. It includes belief in everything that happens after death, exactly as reported in the Qur'an and authentic Sunnah.\n\nBelief in the Hereafter shapes:\n• behavior\n• worship\n• morals\n• accountability\n\nWithout belief in the Hereafter, there is no real motivation for righteousness. If people think this life is all there is, they might behave selfishly and unjustly. But when they believe in the Hereafter, they know there will be consequences for their actions. This belief transforms how people live.",
  },
  {
    title: "Part 2: What 'Belief in the Hereafter' Includes",
    body:
      "According to the book, belief in the Hereafter includes believing in:\n• death\n• the life of the grave\n• resurrection after death\n• the gathering\n• the reckoning\n• the scales\n• the records of deeds\n• Paradise and Hellfire\n\nAll of this is believed literally and truly, not symbolically.\n\nBelief in the Hereafter is not vague or abstract. It includes specific beliefs about what will happen after death. Each stage — from death to resurrection to judgment to final destination — is real and will happen exactly as Allah described. This is not metaphor or symbolism. It is reality.",
  },
  {
    title: "Part 3: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah cites many verses, including:\n\n\"And after that you will surely die. Then indeed, on the Day of Resurrection, you will be resurrected.\" (Surah Al-Mu'minūn 23:15–16)\n\n\"As We began the first creation, We will repeat it.\" (Surah Al-Anbiyā' 21:104)\n\n\"Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection.\" (Surah Āl 'Imrān 3:185)\n\nThese verses prove:\n• resurrection is real\n• recompense is real\n• the Hereafter is inevitable\n\nThe Qur'an repeatedly emphasizes the certainty of the Hereafter. Death is certain. Resurrection is certain. Judgment is certain. Final destination is certain. No one can escape it.",
  },
  {
    title: "Part 4: Belief in Resurrection (Al-Ba'th)",
    body:
      "Resurrection means:\n• Allah will bring people back to life\n• bodies and souls will be reunited\n• people will rise from their graves\n\nResurrection is:\n• physical and real\n• not spiritual only\n• not imaginary\n\nAllah is fully capable of recreating people, just as He created them the first time.\n\n\"As We began the first creation, We will repeat it.\" (Al-Anbiyā' 21:104)\n\nSome people doubt resurrection. They ask: How can bodies that have turned to dust be brought back? But Allah who created them from nothing can easily recreate them. The same power that created the universe can resurrect the dead. This is not difficult for Allah.",
  },
  {
    title: "Part 5: The Gathering and Standing Before Allah",
    body:
      "After resurrection:\n• all people will be gathered\n• all people will stand before Allah\n• no one will escape judgment\n\n\"The Day mankind will stand before the Lord of the worlds.\" (Surah Al-Mutaffifīn 83:6)\n\nKings, poor people, leaders, and followers will all stand equally.\n\nOn that Day, all distinctions of this world will disappear. Rich and poor, powerful and weak, famous and unknown — all will stand before Allah as His servants. No one will have special privilege. No one will be able to hide or run away. Everyone will be present and accountable.",
  },
  {
    title: "Part 6: Reckoning and Accountability",
    body:
      "Allah will judge:\n• every action\n• every word\n• every intention\n\n\"Whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.\" (Surah Az-Zalzalah 99:7–8)\n\nNo injustice will occur. Allah's judgment is perfectly just.\n\nNothing is too small to be recorded and judged. Even the smallest good deed will be rewarded. Even the smallest sin will be accounted for. But Allah is also merciful. He multiplies good deeds and forgives sins for those who repent. His judgment is perfect, combining justice and mercy.",
  },
  {
    title: "Part 7: Paradise and Hellfire",
    body:
      "The book affirms that:\n• Paradise is real\n• Hellfire is real\n• both are already created\n• both will remain forever\n\nParadise is for:\n• believers\n• the obedient\n• those whom Allah shows mercy\n\nHellfire is for:\n• disbelievers\n• hypocrites\n• those who persist in major sins (as Allah wills)\n\nParadise and Hellfire are not symbolic. They are real places. They exist now. They will be the eternal homes for people after judgment. Paradise is filled with blessings beyond imagination. Hellfire is filled with punishments beyond comprehension. Both will last forever.",
  },
  {
    title: "Part 8: Refutation of False Beliefs",
    body:
      "Ibn Taymiyyah rejects claims that:\n• the Hereafter is symbolic\n• resurrection is spiritual only\n• Paradise and Hell are metaphors\n\nThese beliefs contradict:\n• the Qur'an\n• the Sunnah\n• the understanding of the Companions\n\nSome philosophers and modernists try to reinterpret the Hereafter as symbolic or spiritual concepts. They claim Paradise means \"inner peace\" and Hell means \"guilty conscience.\" But this is completely false. The Qur'an describes Paradise and Hell with physical details — gardens, rivers, fruits, fire, chains, torment. These are real, not metaphors.",
  },
  {
    title: "Part 9: Methodology of Ahl al-Sunnah in Belief in the Hereafter",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• believe in the Hereafter exactly as revealed\n• affirm all details authentically reported\n• do not distort meanings\n• do not deny unseen matters\n• submit to revelation even if the mind cannot fully grasp it\n\nThe Hereafter is part of the unseen (al-ghayb). We cannot see it now. We cannot fully comprehend it with our limited minds. But we believe in it completely because Allah and His Messenger \ufe0f told us about it. This is the foundation of faith — believing in the unseen based on truthful revelation.",
  },
  {
    title: "Part 10: Effects of Believing in the Hereafter",
    body:
      "Belief in the Hereafter:\n• creates fear of Allah\n• increases sincerity\n• restrains from sin\n• encourages patience\n• motivates good deeds\n• reduces attachment to the dunya\n\nA person who truly believes in the Hereafter lives differently.\n\nWhen you believe in the Hereafter, you understand that this life is temporary and the next life is permanent. You understand that every action has consequences. You understand that pleasure in this world is not worth punishment in the Hereafter. You understand that hardship in this world is bearable if it leads to Paradise. This belief changes everything about how you live.",
  },
  {
    title: "Part 11: Key Sentence to Memorize",
    body:
      "Belief in the Hereafter includes believing in resurrection, judgment, Paradise, and Hellfire as real truths that will occur exactly as Allah and His Messenger \ufe0f informed, without distortion or denial.\n\nThis sentence summarizes:\n• Core components of belief in the Hereafter\n• Their reality and certainty\n• Their basis in revelation\n• Negation of distortion\n• Negation of denial\n\nMemorise this sentence. It protects your belief about the Hereafter and keeps it firmly within the methodology of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " Belief in the Hereafter is a core foundation of faith that shapes behavior, worship, and morals.\n\n The Hereafter includes death, the grave, resurrection, gathering, judgment, and final destination (Paradise or Hell).\n\n Resurrection is physical and real, not spiritual or symbolic; Allah will reunite bodies and souls.\n\n Allah's judgment will account for every action, word, and intention with perfect justice and mercy.\n\n Paradise and Hellfire are real places that already exist and will last forever.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about belief in the Hereafter.\n\n Reflect daily on death and the Hereafter to reduce attachment to worldly things.\n\n Read Surah Az-Zalzalah (Chapter 99) and remember that every small deed will be seen.\n\n Before every action, ask yourself: \"Will this please Allah on the Day of Judgment?\"\n\n Increase good deeds and repent from sins, knowing you will meet Allah and be accountable.\n\n Visit graveyards occasionally to remind yourself of death and the Hereafter.",
  },
  DEFAULT_QUIZ_SECTION,
];

const GRAVE_RESURRECTION_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: What This Belief Includes",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms that what happens after death begins in the grave, and that resurrection after death is real and physical. Both matters are from the unseen (ghayb) and are believed exactly as reported in the Qur'an and authentic Sunnah.\n\nThe journey to the Hereafter does not begin on the Day of Judgment. It begins immediately after death. The grave is the first stage. What happens there is real, though we cannot see it. This is part of the unseen that we must believe in.",
  },
  {
    title: "Part 2: The Trial of the Grave (Fitnat al-Qabr)",
    body:
      "The trial of the grave means that:\n• when a person is buried,\n• two angels come to him,\n• and he is questioned about his belief.\n\nThe questions are:\n• Who is your Lord?\n• What is your religion?\n• Who is your Prophet?\n\nThis questioning is real, not symbolic.\n\nAfter a person is placed in the grave and those who buried him leave, two angels come. They are called Munkar and Nakir. They sit the person up and ask these three fundamental questions. The believer who lived with true faith will answer correctly. The disbeliever or hypocrite will fail to answer. This is a real event that happens to every person after burial.",
  },
  {
    title: "Part 3: Evidence for the Trial of the Grave from the Qur'an",
    body:
      "Allah says: \"Allah keeps firm those who believe with the firm word in the worldly life and in the Hereafter.\" (Surah Ibrāhīm 14:27)\n\nThe Companions explained that \"the Hereafter\" here includes the grave, where believers are given firmness when questioned.\n\nThis verse was revealed to explain what happens in the grave. When the believer is questioned, Allah keeps him firm. He is able to answer clearly: My Lord is Allah, my religion is Islam, my Prophet is Muhammad \ufe0f. This is Allah's help and guidance for the believer even after death.",
  },
  {
    title: "Part 4: Evidence for the Trial of the Grave from the Sunnah",
    body:
      "The Prophet \ufe0f said that when a believer is placed in the grave:\n• he is asked,\n• he answers correctly,\n• his grave is widened,\n• and he is shown his place in Paradise.\n\nAnd when a disbeliever or hypocrite is questioned:\n• he cannot answer,\n• he says \"I don't know,\"\n• his grave is constricted,\n• and he is shown his place in Hellfire.\n\nThese narrations are authentic and well-known in the Sunnah.\n\nThe Prophet \ufe0f described this in multiple authentic hadiths. He explained that the believer's grave becomes spacious, filled with light, and a window to Paradise is opened for him. The disbeliever's grave becomes tight, crushing him, and a window to Hellfire is opened for him. He experiences torment until the Day of Resurrection.",
  },
  {
    title: "Part 5: The Punishment and Bliss of the Grave",
    body:
      "Ibn Taymiyyah affirms that the grave can contain:\n• punishment for some people\n• bliss for others\n\nPunishment of the Grave:\n• real\n• affects the soul, and sometimes the body\n• happens before the Day of Judgment\n\nBliss of the Grave:\n• peace\n• comfort\n• light\n• connection to Paradise\n\nNot everyone is punished; some are blessed.\n\nThe grave is not the same experience for everyone. For the believer, it is a garden from the gardens of Paradise. For the disbeliever or hypocrite, it is a pit from the pits of Hell. The punishment of the grave is real. People are punished for sins like lying, backbiting, not cleaning after urination, and other major sins. But the righteous believers experience peace and comfort.",
  },
  {
    title: "Part 6: Resurrection After Death (Al-Ba'th)",
    body:
      "Resurrection means:\n• Allah will bring people back to life\n• bodies will be recreated\n• souls will be returned to their bodies\n• people will rise from their graves\n\nResurrection is physical and real, not spiritual only.\n\nOn the Day of Resurrection, Allah will command Israfil to blow the trumpet. At the sound, all the dead will be brought back to life. Bodies that turned to dust will be recreated. Souls will return to their bodies. People will rise from their graves and gather for judgment. This is bodily resurrection, not just spiritual awakening.",
  },
  {
    title: "Part 7: Qur'anic Evidence for Resurrection",
    body:
      "Ibn Taymiyyah cites verses such as:\n\n\"Then indeed, after that you will die. Then indeed, on the Day of Resurrection you will be resurrected.\" (Surah Al-Mu'minūn 23:15–16)\n\n\"Say: He who created them the first time will give them life again.\" (Surah Yā-Sīn 36:79)\n\nAllah proves resurrection by reminding people of the first creation.\n\nPeople doubt resurrection because they think it is impossible to bring decayed bodies back to life. But Allah responds: if He created you from nothing the first time, why is it difficult to recreate you? The One who initiated creation can certainly repeat it. This is a logical proof from the Qur'an.",
  },
  {
    title: "Part 8: Denial of Resurrection Is Disbelief",
    body:
      "The book clarifies that:\n• denying resurrection is disbelief\n• denying the trial of the grave contradicts the Sunnah\n• these beliefs were unanimously held by the Companions\n\nAny rejection comes from later innovations, not from Islam.\n\nResurrection is such a fundamental belief that denying it takes a person out of Islam. The Qur'an is filled with verses about resurrection. The Prophet \ufe0f spoke about it constantly. The Companions believed in it unanimously. Anyone who denies resurrection cannot be considered a Muslim. As for the trial of the grave, denying it contradicts authentic Sunnah and the consensus of the early Muslims.",
  },
  {
    title: "Part 9: Relationship Between the Grave and the Resurrection",
    body:
      "Ibn Taymiyyah explains:\n• the grave is the first stage of the Hereafter\n• resurrection is the beginning of the final judgment\n• whoever is saved in the grave will be safer afterward\n• whoever is punished in the grave has greater fear ahead\n\nThe grave is like a preview. If a person passes the trial of the grave with success, this is a good sign for what comes next. But if a person fails in the grave and experiences punishment, this is a warning of greater punishment to come. The Prophet \ufe0f used to seek refuge from the punishment of the grave regularly in his prayers.",
  },
  {
    title: "Part 10: Methodology of Ahl al-Sunnah in This Belief",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• believe in the trial of the grave\n• believe in its punishment and bliss\n• believe in bodily resurrection\n• affirm these matters without distortion\n• submit even if the mind cannot fully understand\n\nThey rely on:\n• the Qur'an\n• the authentic Sunnah\n• the understanding of the Companions\n\nThese matters are from the unseen. We cannot witness them with our eyes in this life. But we believe in them with certainty because Allah and His Messenger \ufe0f informed us. We do not demand to see or understand everything before believing. Faith means trusting in what Allah has revealed.",
  },
  {
    title: "Part 11: Effects of Believing in the Trial of the Grave and Resurrection",
    body:
      "This belief:\n• increases fear of Allah\n• encourages repentance\n• makes death serious\n• restrains from sin\n• motivates preparation for the Hereafter\n• builds consciousness of accountability\n• strengthens resolve to live righteously\n\nA believer prepares for what comes immediately after death, not only for the Day of Judgment.\n\nWhen you truly believe that you will be questioned in the grave about your Lord, your religion, and your Prophet, you make sure you can answer. When you believe you might be punished in the grave for sins, you work to avoid those sins. When you believe in resurrection and final judgment, you live every day with purpose and accountability. This belief changes behavior.",
  },
  {
    title: "Part 12: Key Sentence to Memorize",
    body:
      "The trial of the grave, its punishment and bliss, and the resurrection after death are all real truths affirmed by the Qur'an and Sunnah, believed as they came without denial or distortion.\n\nThis sentence summarizes:\n• Affirmation of the trial of the grave\n• Affirmation of punishment and bliss in the grave\n• Affirmation of bodily resurrection\n• Their reality and certainty\n• Their basis in revelation\n• Negation of denial\n• Negation of distortion\n\nMemorise this sentence. It protects your belief about what happens after death and keeps you firm on the path of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      " The trial of the grave is real; two angels question every person about their Lord, religion, and Prophet.\n\n The grave contains either punishment or bliss depending on the person's faith and deeds.\n\n Resurrection is physical and real; Allah will recreate bodies and reunite them with souls.\n\n Denying resurrection is disbelief; denying the trial of the grave contradicts authentic Sunnah.\n\n The grave is the first stage of the Hereafter; whoever is saved there will be safer on the Day of Judgment.",
  },
  {
    title: "Practical actions for students",
    body:
      " Memorize the key sentence about the trial of the grave and resurrection.\n\n Reflect on Surah Ibrahim (14:27) about Allah keeping believers firm in the grave.\n\n Regularly say the du'a': \"O Allah, I seek refuge in You from the punishment of the grave.\"\n\n Prepare for the three questions by strengthening your knowledge of Allah, Islam, and the Prophet \ufe0f.\n\n Remember death frequently and let it motivate you to repent and do good deeds.\n\n Avoid sins that lead to punishment in the grave (lying, backbiting, not cleaning after urination).",
  },
  DEFAULT_QUIZ_SECTION,
];

const RECORDS_OF_DEEDS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: What Are the Records of Deeds?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms belief in the Records of Deeds (Kutub al-A'māl) as part of belief in the Hereafter.\n\nEvery human being has a record in which all deeds are written:\n• good deeds\n• bad deeds\n• words\n• intentions (as Allah wills)\n\nNothing is left out.\n\nFrom the moment you reach the age of accountability, everything you do is being recorded. Every good deed, every sin, every word you speak, every intention you have—all of it is written in your record. This record will be preserved until the Day of Judgment, when it will be presented to you as complete evidence of your life.",
  },
  {
    title: "Part 2: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah cites clear verses proving the reality of the records:\n\n\"And every person We have imposed his fate upon his neck, and We will bring forth for him on the Day of Resurrection a record which he will encounter spread open.\" (Surah Al-Isrā' 17:13)\n\n\"And the record will be placed, and you will see the criminals fearful of what is in it.\" (Surah Al-Kahf 18:49)\n\n\"This is Our record which speaks about you with truth.\" (Surah Al-Jāthiyah 45:29)\n\nThese verses prove:\n• the record is real\n• it will be presented openly\n• it will speak with truth\n• it contains no injustice\n\nThe Qur'an describes the record in multiple places. It is not a metaphor or a figure of speech. It is a real book that will be opened on the Day of Judgment. Everyone will see their record spread before them. The criminals will be terrified of what they see in it. But the record will speak only truth—no lies, no additions, no omissions.",
  },
  {
    title: "Part 3: Who Writes the Deeds?",
    body:
      "The book affirms that angels are assigned to write deeds.\n\n\"When the two receivers receive, seated on the right and on the left.\" (Surah Qāf 50:17)\n\nOne angel records good deeds. One angel records bad deeds.\n\nThey write:\n• actions\n• speech\n• visible and hidden matters (as Allah wills)\n\nThese angels are called the Kiraman Katibin—the noble scribes. They never sleep. They never forget. They never make mistakes. They write exactly what you do and say. The angel on the right records your good deeds. The angel on the left records your sins. They accompany you everywhere—in your home, at work, in the street, even when you are alone. Nothing escapes their knowledge, for Allah has informed them of all that you do.",
  },
  {
    title: "Part 4: Nothing Is Missed in the Records",
    body:
      "Allah says: \"It has not omitted a small thing or a great thing except that it has enumerated it.\" (Surah Al-Kahf 18:49)\n\nThis proves:\n• even small deeds are written\n• even forgotten actions are recorded\n• nothing is lost or ignored\n\nYou may forget what you did years ago. You may think a small sin or a small good deed does not matter. But Allah does not forget. The angels do not miss anything. A smile you gave someone, a harsh word you spoke, a moment of patience, a glance you cast—everything is written. On the Day of Judgment, you will see it all. You will remember what you had forgotten. The record is complete.",
  },
  {
    title: "Part 5: How the Records Will Be Given",
    body:
      "On the Day of Judgment:\n• some people will receive their record in their right hand\n• others will receive their record in their left hand or from behind their backs\n\n\"Then as for he who is given his record in his right hand…\" (Surah Al-Ḥāqqah 69:19)\n\n\"But as for he who is given his record in his left hand…\" (Surah Al-Ḥāqqah 69:25)\n\nReceiving the record in the right hand is a sign of success.\n\nThe believer who lived a righteous life will receive his record in his right hand. He will be joyful. He will call out to people, 'Come and read my record!' He will enter Paradise. But the disbeliever and the one whose sins outweigh his good deeds will receive his record in his left hand, or from behind his back. He will wish he had never received his record. He will wish for death. But there will be no escape.",
  },
  {
    title: "Part 6: The Record as Evidence Against or For a Person",
    body:
      "The record will be:\n• proof for the believer\n• proof against the disbeliever and sinner\n\nNo one will be able to deny what is written.\n\n\"Read your record. Sufficient is yourself against you this Day as accountant.\" (Surah Al-Isrā' 17:14)\n\nOn the Day of Judgment, people will try to deny their sins. They will try to make excuses. But then Allah will command: 'Read your record.' And when they read it, they will see everything they did. They will not be able to argue. The record is the ultimate proof. It is written by angels who do not lie. It is preserved by Allah who knows all. You will be your own witness against yourself.",
  },
  {
    title: "Part 7: Justice in the Records of Deeds",
    body:
      "Ibn Taymiyyah emphasizes:\n• Allah does not wrong anyone\n• no good deed is lost\n• no sin is added falsely\n\nAllah's justice is perfect.\n\nSome people fear that they will be wronged on the Day of Judgment. But this is impossible. Allah says: 'Indeed, Allah does not do injustice, even as much as an atom's weight. And if there is a good deed, He multiplies it and gives from Himself a great reward.' (Surah An-Nisa 4:40)\n\nEvery good deed you did will be there. Even if people did not see it. Even if you forgot it. Allah will reward you for it. And no sin will be added to your record that you did not commit. The record is absolutely accurate and just.",
  },
  {
    title: "Part 8: Methodology of Ahl al-Sunnah in This Belief",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• believe the records of deeds are real\n• believe they will be presented on the Day of Judgment\n• believe angels record deeds by Allah's command\n• affirm this without denial or distortion\n\nThis belief is established by clear texts in the Qur'an and Sunnah. There is no room for symbolic interpretation or denial. The Companions believed in the records of deeds literally and completely. We follow their understanding. We do not ask 'how' the records are written or preserved. We believe as we have been told and submit to Allah's revelation.",
  },
  {
    title: "Part 9: Effects of Believing in the Records of Deeds",
    body:
      "Belief in the records of deeds:\n• encourages mindfulness of actions\n• protects the tongue\n• promotes sincerity\n• discourages hidden sins\n• motivates repentance and good deeds\n• creates constant awareness of Allah's watch\n• develops self-accountability\n\nA believer lives knowing everything is being written.\n\nWhen you truly believe that angels are recording your every deed, you become careful. You think before you speak. You restrain yourself from sin. You do good deeds even when no one is watching. You repent quickly when you make mistakes. You do not take sins lightly, because you know they are being written. This belief transforms the way you live.",
  },
  {
    title: "Part 10: Key Sentence to Memorize",
    body:
      "Every person has a true record in which all deeds are written, and it will be presented on the Day of Judgment as complete and just evidence, without omission or injustice.\n\nThis sentence summarizes:\n• Universality: every person has a record\n• Content: all deeds are written\n• Accuracy: the record is true and complete\n• Presentation: it will be shown on the Day of Judgment\n• Function: it serves as evidence\n• Completeness: nothing is omitted\n• Justice: no injustice will occur\n\nMemorise this sentence. It protects your belief about the records of deeds and motivates you to live righteously, knowing that everything is being recorded for the Day of Accountability.",
  },
  {
    title: "Moral lessons",
    body:
      "• Every person has a record in which all their deeds are written by angels.\n\n• Nothing is missed in the records; even small deeds and forgotten actions are recorded.\n\n• Records will be given in the right hand to believers (success) and in the left hand to disbelievers (failure).\n\n• The record will be complete and just evidence; no good deed is lost, no sin is added falsely.\n\n• Allah's justice is perfect; everyone will be accountable for exactly what they did.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about the records of deeds.\n\n• Reflect on Surah Al-Isra (17:13-14) about your record being presented on the Day of Judgment.\n\n• Be mindful of all your actions, knowing that angels are recording everything.\n\n• Protect your tongue from lying, backbiting, and harmful speech.\n\n• Repent from sins before they accumulate in your record.\n\n• Do good deeds consistently, even small ones, as they will be recorded and rewarded.\n\n• Remember that hidden sins are also written; develop sincerity and fear of Allah in private.",
  },
  DEFAULT_QUIZ_SECTION,
];

const PROPHETS_FOUNTAIN_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Belief in the Prophet's Fountain",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms belief in the Fountain (Al-Ḥawḍ) of the Prophet ️ as part of belief in the Hereafter. This fountain is real, true, and established by authentic Sunnah.\n\nAhl al-Sunnah wal-Jama'ah believe in it exactly as reported, without denial or reinterpretation.\n\nThe fountain is not a metaphor or a symbolic concept. It is a real fountain with real water, located in a real place on the Day of Judgment. The Prophet ️ described it in detail. His descriptions were confirmed by multiple Companions who narrated them. The scholars of Ahl al-Sunnah have always affirmed belief in the fountain as a fundamental matter of faith.",
  },
  {
    title: "Part 2: What Is Al-Ḥawḍ?",
    body:
      "Al-Ḥawḍ is:\n• a great fountain given to the Prophet ️\n• located on the Day of Judgment\n• a place where believers will drink before entering Paradise\n\nWhoever drinks from it will never feel thirst again.\n\nThis fountain is one of the special honors Allah granted to the Prophet ️. On the Day of Judgment, when people are gathered under the scorching heat, suffering from thirst, the believers who followed the Prophet ️ will be brought to this fountain. They will drink from it, and that drink will quench their thirst forever. They will never experience thirst again, even in Paradise.",
  },
  {
    title: "Part 3: Evidence from the Sunnah",
    body:
      "The book relies on authentic and widely transmitted hadiths, including:\n\nThe Prophet ️ said:\n• his fountain is larger than the distance between Madinah and Sana'a\n• its water is whiter than milk\n• its taste is sweeter than honey\n• its fragrance is better than musk\n• its cups are as numerous as the stars\n\nThese descriptions prove that:\n• the fountain is real\n• its water is real\n• it is not symbolic or metaphorical\n\nThe hadiths about Al-Ḥawḍ are mutawātir—meaning they were narrated by so many Companions that it is impossible they all agreed on a lie. The descriptions are vivid and detailed. They describe size, color, taste, smell, and appearance. These are not the descriptions of a symbolic concept. They are descriptions of a real fountain.",
  },
  {
    title: "Part 4: Who Will Drink from the Fountain?",
    body:
      "Those who will drink from Al-Ḥawḍ are:\n• the followers of the Prophet ️\n• those who remained upon his Sunnah\n• those who did not change or innovate in religion\n\nDrinking from the fountain is an honor for true followers.\n\nNot everyone who claims to be from the Ummah of the Prophet ️ will drink from the fountain. Only those who truly followed his guidance, remained firm on his Sunnah, and did not introduce innovations into the religion will be granted this honor. The more you follow the Prophet ️ in this life, the closer you will be to his fountain on the Day of Judgment.",
  },
  {
    title: "Part 5: Who Will Be Prevented from the Fountain?",
    body:
      "The Prophet ️ informed that:\n• some people will be driven away from the fountain\n• he will say: 'My Ummah! My Ummah!'\n• it will be said to him: 'You do not know what they introduced after you.'\n\nThis shows that:\n• innovation in religion is dangerous\n• changing the Sunnah can lead to deprivation from Al-Ḥawḍ\n\nThis hadith is a severe warning. Some people who appeared to be Muslims, who prayed and fasted and claimed to follow the Prophet ️, will be prevented from drinking. Why? Because they changed the religion after him. They introduced new practices that were not from Islam. They abandoned the Sunnah. They followed their desires instead of revelation. The Prophet ️ will try to defend them, but he will be told: 'You do not know what they did after you.'",
  },
  {
    title: "Part 6: Al-Ḥawḍ and the River Al-Kawthar",
    body:
      "The book clarifies that:\n• Al-Kawthar is a river in Paradise\n• Al-Ḥawḍ is the fountain on the Day of Judgment\n• the water of Al-Ḥawḍ comes from Al-Kawthar\n\nBoth are real and distinct.\n\nSome people confuse Al-Ḥawḍ and Al-Kawthar, thinking they are the same thing. But they are different. Al-Kawthar is a river inside Paradise. It is mentioned in the Qur'an: 'Indeed, We have granted you Al-Kawthar.' (Surah Al-Kawthar 108:1) Al-Ḥawḍ is the fountain located on the plains of the Day of Judgment, before people enter Paradise. The water of Al-Ḥawḍ flows from Al-Kawthar. So they are connected, but they are not identical.",
  },
  {
    title: "Part 7: Methodology of Ahl al-Sunnah in This Belief",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• believe in Al-Ḥawḍ as real\n• believe in its descriptions as they came\n• do not reinterpret it symbolically\n• do not deny it\n• submit to authentic Sunnah\n\nSome deviant groups denied the existence of the fountain. Others said it is symbolic and not literal. But Ahl al-Sunnah affirm it as the Prophet ️ described it. We believe in its size, its water, its taste, its smell, and its cups. We do not need to see it to believe in it. The testimony of the Prophet ️ is sufficient for us. This is the way of the Companions and the righteous predecessors.",
  },
  {
    title: "Part 8: Effects of Believing in Al-Ḥawḍ",
    body:
      "Belief in the Prophet's fountain:\n• increases love for the Prophet ️\n• encourages following the Sunnah\n• warns against innovation\n• strengthens hope in the Hereafter\n• motivates adherence to authentic practices\n• discourages changing the religion\n\nA believer hopes to be among those who drink from it.\n\nWhen you believe in Al-Ḥawḍ, you realize how important it is to follow the Sunnah exactly as it came. You become careful not to introduce any innovation into your worship or belief. You guard yourself against changing the religion in any way. You love the Prophet ️ more because you hope to meet him at his fountain. You make du'a that Allah allows you to drink from it. This belief shapes your practice and your relationship with the Sunnah.",
  },
  {
    title: "Part 9: Key Sentence to Memorize",
    body:
      "The Prophet ️ has a real fountain on the Day of Judgment; whoever drinks from it will never thirst again, and only those who follow his Sunnah will be allowed to drink from it.\n\nThis sentence summarizes:\n• The fountain belongs to the Prophet ️\n• It is real, not symbolic\n• It is located on the Day of Judgment\n• Drinking from it removes thirst forever\n• Access to it is conditional on following the Sunnah\n• Innovators will be prevented from it\n\nMemorise this sentence. It protects your belief in Al-Ḥawḍ and motivates you to follow the Sunnah faithfully, hoping to be among those honored to drink from the fountain of the Prophet ️.",
  },
  {
    title: "Moral lessons",
    body:
      "• The Prophet ️ has a real fountain on the Day of Judgment, established by authentic Sunnah.\n\n• Whoever drinks from Al-Ḥawḍ will never feel thirst again.\n\n• Only those who follow the Prophet's Sunnah without innovation will be allowed to drink from it.\n\n• Some who claim to be Muslims will be driven away because they changed the religion after the Prophet ️.\n\n• Al-Ḥawḍ (fountain on Day of Judgment) and Al-Kawthar (river in Paradise) are distinct but connected.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about the Prophet's fountain.\n\n• Learn about the authentic Sunnah to ensure you follow it correctly.\n\n• Avoid all forms of innovation (bid'ah) in worship and belief.\n\n• Make du'a that Allah grants you the honor of drinking from the Prophet's fountain.\n\n• Increase your love for the Prophet ️ by studying his life and following his example.\n\n• Warn others against changing the religion or introducing practices not from Islam.\n\n• Remain steadfast on the Sunnah, knowing that this is the path to the fountain.",
  },
  DEFAULT_QUIZ_SECTION,
];

const INTERCESSION_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: What Is Intercession?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms belief in Intercession (Shafā'ah) as a true and established reality on the Day of Judgment.\n\nIntercession means:\n• asking Allah to grant benefit or remove harm from someone\n• this will happen only in the Hereafter\n• and only with Allah's permission\n\nIntercession is not independent power. It belongs to Allah alone.\n\nIntercession is not something that anyone can do by their own authority. No one has the power to intercede except by Allah's permission. No one can force Allah to accept their intercession. Intercession is entirely under Allah's control. He decides who can intercede, for whom they can intercede, and whether the intercession is accepted. This understanding protects belief in Tawḥīd and prevents shirk.",
  },
  {
    title: "Part 2: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah cites clear Qur'anic verses proving intercession:\n\n\"Who is it that can intercede with Him except by His permission?\" (Surah Al-Baqarah 2:255)\n\n\"And they cannot intercede except for one with whom He is pleased.\" (Surah Al-Anbiyā' 21:28)\n\n\"Say: To Allah belongs all intercession.\" (Surah Az-Zumar 39:44)\n\n\"On that Day, no intercession will benefit except for one whom the Most Merciful has permitted and whose word He is pleased with.\" (Surah Ṭā-Hā 20:109)\n\nThese verses establish two strict conditions for intercession.\n\nThe Qur'an is filled with verses about intercession. They all emphasize the same point: intercession is real, but it is completely controlled by Allah. No one intercedes without His permission. No intercession benefits anyone unless Allah is pleased with them. All intercession belongs to Allah. These verses refute both those who deny intercession and those who misuse it by asking creation for intercession.",
  },
  {
    title: "Part 3: The Two Conditions for Intercession",
    body:
      "According to the Qur'an and explained in the book, intercession will only occur if both conditions are met:\n\n1️⃣ Allah Gives Permission to the Intercessor\nNo one can intercede unless Allah allows them.\n\n2️⃣ Allah Is Pleased with the One Interceded For\nAllah only accepts intercession for:\n• people of Tawḥīd\n• people who did not commit shirk\n\nIntercession does not benefit disbelievers.\n\nThese two conditions are critical. Even if a Prophet wants to intercede for someone, he cannot do so unless Allah permits him. And even if Allah permits intercession, it will only benefit someone Allah is pleased with. Disbelievers and those who committed shirk will not receive any intercession. Their intercession is rejected because Allah is not pleased with them. Only people of Tawḥīd—those who worshipped Allah alone—can hope for intercession.",
  },
  {
    title: "Part 4: Types of Intercession Affirmed in the Book",
    body:
      "1️⃣ The Greatest Intercession (Ash-Shafā'ah Al-'Uẓmā)\nThis is the special intercession of the Prophet ️ on the Day of Judgment. It happens when people are suffering on the Day of Standing. They go to the Prophets asking for help. Each Prophet declines. They come to Prophet Muhammad ️. He intercedes with Allah. This intercession begins the judgment and is exclusive to Prophet Muhammad ️.\n\n2️⃣ Intercession for Entering Paradise\nThe Prophet ️ will intercede so that some believers may enter Paradise without punishment.\n\n3️⃣ Intercession for Those Who Deserve Hellfire\nThe Prophet ️ and others will intercede for believers who committed major sins, so they may be forgiven or removed from Hellfire after punishment. These people did not commit shirk.\n\n4️⃣ Intercession to Raise Ranks in Paradise\nIntercession will occur to raise the status of believers in Paradise, increasing their reward.\n\nThese are the main types of intercession affirmed by Ahl al-Sunnah based on authentic hadiths. Each type serves a different purpose, but all are by Allah's permission and for people of Tawḥīd.",
  },
  {
    title: "Part 5: Who Will Intercede?",
    body:
      "The book affirms that intercession will be made by:\n• the Prophet Muhammad ️\n• other Prophets\n• angels\n• righteous believers\n\nBut all intercession is by Allah's permission only.\n\nThe Prophet Muhammad ️ is the first and greatest intercessor. But he is not the only one. Other Prophets, like Ibrahim, Musa, and 'Isa, will also intercede. Angels will intercede. Even righteous believers will intercede for their family members and loved ones. Children who died young will intercede for their parents. Scholars who taught people the truth will intercede. But no matter who intercedes, it is always by Allah's permission. No one has automatic authority to intercede.",
  },
  {
    title: "Part 6: Intercession Does Not Contradict Allah's Justice",
    body:
      "Ibn Taymiyyah explains:\n• intercession does not mean injustice\n• Allah already knows who deserves mercy\n• intercession is a manifestation of Allah's mercy\n\nAllah forgives by His will, not because He is forced.\n\nSome people might think: if someone is punished, and then intercession saves them, does that mean the punishment was unjust? No. Allah's judgment is always just. If He punishes someone, they deserve it. And if He forgives them through intercession, that is His mercy. Allah already knew, before creating the universe, who would be forgiven and who would be punished. Intercession is one of the means by which Allah's mercy is manifested. It does not change Allah's will. It is part of Allah's will.",
  },
  {
    title: "Part 7: Refutation of False Beliefs About Intercession",
    body:
      "The book rejects two extremes:\n\n❌ Denial of Intercession\nSome groups deny intercession completely. This contradicts the Qur'an, Sunnah, and consensus of the Companions.\n\n❌ Misuse of Intercession\nOthers ask the dead for intercession. They call upon graves and saints. This is shirk, because intercession belongs to Allah and it cannot be requested from creation.\n\n\"Say: To Allah belongs all intercession.\" (Surah Az-Zumar 39:44)\n\nThe Khawarij and Mu'tazilah denied intercession. They said no sinner will be forgiven. But this contradicts numerous verses and hadiths. On the other hand, many Muslims today commit shirk by asking the dead for intercession. They go to graves and say, 'O saint, intercede for me!' But this is forbidden. Intercession is asked from Allah, not from creation. Asking the dead to intercede is a form of shirk, because it gives them a power that belongs only to Allah.",
  },
  {
    title: "Part 8: Correct Way to Seek Intercession",
    body:
      "According to Ahl al-Sunnah:\n• intercession is sought from Allah\n• through obedience\n• through following the Prophet ️\n• through Tawḥīd\n\nWe do not ask the Prophet ️ directly after his death.\n\nThe correct way to seek intercession is to ask Allah to grant you the intercession of the Prophet ️. You say: 'O Allah, grant me the intercession of Your Prophet.' You do not say: 'O Muhammad, intercede for me.' This is because the Prophet ️ is dead, and asking the dead for anything is shirk. But asking Allah to grant you the benefit of the Prophet's intercession is permissible and correct. You earn intercession by following the Sunnah, maintaining Tawḥīd, doing good deeds, and avoiding major sins.",
  },
  {
    title: "Part 9: Methodology of Ahl al-Sunnah in Intercession",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm intercession as real\n• affirm all authentic types of intercession\n• restrict it to Allah's permission\n• reject shirk and innovation\n• follow the understanding of the Companions\n\nAhl al-Sunnah take the middle path. They do not deny intercession like the Khawarij and Mu'tazilah. And they do not misuse it by asking creation for intercession. They affirm it exactly as it came in the Qur'an and Sunnah. They believe in all the types of intercession that are authentically reported. They emphasize that it is by Allah's permission only. They warn against shirk. This is the way of the Companions and the righteous predecessors.",
  },
  {
    title: "Part 10: Effects of Believing in Intercession",
    body:
      "Belief in intercession:\n• increases hope without encouraging sin\n• encourages Tawḥīd\n• strengthens love for the Prophet ️\n• warns against shirk\n• motivates repentance\n• balances fear and hope\n• promotes following the Sunnah\n\nA believer hopes for intercession, but does not rely on it while persisting in sin.\n\nBelieving in intercession gives hope. You know that even if you sin, there is a chance for mercy. But this hope should not make you careless. You should not think, 'I can sin now and the Prophet ️ will intercede for me later.' No. Intercession is not guaranteed. It is only for people Allah is pleased with. So you strive to live righteously, maintain Tawḥīd, and follow the Sunnah, hoping that Allah will grant you the intercession of His Prophet ️.",
  },
  {
    title: "Part 11: Key Sentence to Memorize",
    body:
      "Intercession on the Day of Judgment is real and true, but it occurs only by Allah's permission and only for those with whom He is pleased, and all intercession belongs to Allah alone.\n\nThis sentence summarizes:\n• Intercession is real (affirming its existence)\n• It is on the Day of Judgment (its timing)\n• It requires Allah's permission (first condition)\n• It is only for those Allah is pleased with (second condition)\n• All intercession belongs to Allah (preventing shirk)\n\nMemorise this sentence. It protects your belief in intercession, prevents you from falling into denial or misuse, and keeps you firm on the path of Tawḥīd and the understanding of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      "• Intercession is real and will happen on the Day of Judgment by Allah's permission.\n\n• No one can intercede without Allah's permission, and intercession only benefits people of Tawḥīd.\n\n• The Prophet ️ will have the greatest intercession and will intercede for believers in multiple ways.\n\n• Asking the dead or graves for intercession is shirk; intercession is sought from Allah alone.\n\n• Believing in intercession increases hope, encourages Tawḥīd, and motivates following the Sunnah.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about intercession.\n\n• Reflect on Surah Al-Baqarah (2:255) and the conditions for intercession.\n\n• Avoid asking the dead or anyone other than Allah for intercession.\n\n• Ask Allah in your du'a to grant you the intercession of the Prophet ️.\n\n• Follow the Sunnah faithfully, as this is the path to earning intercession.\n\n• Maintain Tawḥīd and avoid all forms of shirk to be among those Allah is pleased with.\n\n• Balance hope in Allah's mercy (including intercession) with fear of His punishment; do not rely on intercession while persisting in sin.",
  },
  DEFAULT_QUIZ_SECTION,
];

const DIVINE_DECREE_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: The Place of Al-Qadar in 'Aqidah",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms belief in Divine Decree (Al-Qadar) as one of the pillars of faith and a fundamental part of the creed of Ahl al-Sunnah wal-Jama'ah.\n\nBelief in Al-Qadar includes believing that:\n• everything happens by Allah's knowledge\n• everything happens by Allah's will\n• everything happens by Allah's creation\n• both good and bad are from Allah's decree\n\nBelief in Al-Qadar is not optional or secondary. It is a pillar of faith. The Prophet ️ said: 'Iman is to believe in Allah, His angels, His Books, His Messengers, the Last Day, and to believe in Divine Decree, both its good and its bad.' (Muslim) Denying Al-Qadar takes a person out of Islam. This is how central and important this belief is.",
  },
  {
    title: "Part 2: Qur'anic Evidence Used in the Book",
    body:
      "Ibn Taymiyyah cites clear Qur'anic verses, including:\n\n\"Indeed, all things We created with decree.\" (Surah Al-Qamar 54:49)\n\n\"No disaster strikes upon the earth or among yourselves except that it is in a record before We bring it into being.\" (Surah Al-Ḥadīd 57:22)\n\n\"And you do not will except that Allah wills.\" (Surah Al-Insān 76:30)\n\n\"Allah created you and what you do.\" (Surah Aṣ-Ṣāffāt 37:96)\n\n\"That you may know that Allah is over all things competent and that Allah has encompassed all things in knowledge.\" (Surah Aṭ-Ṭalāq 65:12)\n\nThese verses establish the reality of Al-Qadar.\n\nThe Qur'an is filled with verses about Allah's knowledge, will, and creation. These verses prove that nothing happens by chance. Everything is planned, known, willed, and created by Allah. Even your own actions, your choices, your movements—all of it is within Allah's knowledge and decree. This is a fundamental truth of existence.",
  },
  {
    title: "Part 3: The Four Levels of Al-Qadar",
    body:
      "Ibn Taymiyyah explains that belief in Al-Qadar includes four levels, all of which must be believed together.\n\nThese four levels are:\n1️⃣ Knowledge (Al-'Ilm): Allah knows everything eternally\n2️⃣ Writing (Al-Kitābah): Allah wrote everything in the Preserved Tablet\n3️⃣ Will (Al-Mashī'ah): Allah wills everything that occurs\n4️⃣ Creation (Al-Khalq): Allah created all things including actions\n\nThese four levels build on each other. You cannot believe in one without the others. If you deny any of these levels, your belief in Al-Qadar is incomplete. Ahl al-Sunnah affirm all four levels fully and without exception.",
  },
  {
    title: "Part 4: First Level - Knowledge (Al-'Ilm)",
    body:
      "Allah:\n• knows everything eternally\n• knows what was, what is, and what will be\n• knows what never happens and how it would happen if it did\n\nNothing is hidden from Allah's knowledge.\n\nAllah's knowledge is absolute and eternal. He knew everything before He created anything. He knows what you will do tomorrow. He knows what you did yesterday. He knows what would have happened if you had made a different choice. His knowledge encompasses everything—past, present, future, and even things that will never occur. Nothing surprises Allah. Nothing is hidden from Him. His knowledge is perfect and complete.\n\nThis is proven by the verse: 'That you may know that Allah is over all things competent and that Allah has encompassed all things in knowledge.' (Surah Aṭ-Ṭalāq 65:12)",
  },
  {
    title: "Part 5: Second Level - Writing (Al-Kitābah)",
    body:
      "Allah:\n• wrote everything in the Preserved Tablet\n• wrote all events before they happened\n\n'Allah has written the decrees of the creation fifty thousand years before creating the heavens and the earth.' (Hadith)\n\nEverything is written, large and small.\n\nAllah did not only know everything; He also wrote it down. Before He created the heavens and the earth, before He created Adam, before He created anything, Allah wrote everything that would happen until the Day of Judgment. This record is called Al-Lawh Al-Mahfuz (the Preserved Tablet). Everything you do, everything that happens to you, every joy and every hardship—all of it was written before you were born.\n\nThis is proven by the verse: 'No disaster strikes upon the earth or among yourselves except that it is in a record before We bring it into being.' (Surah Al-Ḥadīd 57:22)",
  },
  {
    title: "Part 6: Third Level - Will (Al-Mashī'ah)",
    body:
      "Allah:\n• wills everything that occurs\n• nothing happens outside His will\n• what Allah wills happens\n• what Allah does not will does not happen\n\nHuman will exists, but it is under Allah's will.\n\nAllah's will is supreme. Nothing happens in the universe unless Allah wills it. When you choose to do something, Allah has willed that you make that choice. When something happens to you, Allah has willed it. This does not mean humans have no will. You have a will. You make choices. But your will operates within Allah's greater will. You cannot will anything unless Allah wills it.\n\nThis is proven by the verse: 'And you do not will except that Allah wills.' (Surah Al-Insān 76:30) And: 'If Allah had willed, they would not have done it.' (Surah Al-An'ām 6:137)",
  },
  {
    title: "Part 7: Fourth Level - Creation (Al-Khalq)",
    body:
      "Allah:\n• created all things\n• created people and their actions\n• created good and evil actions\n\nCreation does not mean approval of evil, but creation by wisdom.\n\nAllah is the Creator of everything. He created you. He created your ability to act. He created your actions themselves. When you pray, Allah created that action. When you sin, Allah created that action too. But creation is not the same as approval. Allah created the sin, but He does not approve of it. He commanded you not to do it. He will punish you for it if you do not repent. But He created it by His wisdom, as a test for you.\n\nThis is proven by the verse: 'Allah created you and what you do.' (Surah Aṣ-Ṣāffāt 37:96) And: 'Indeed, all things We created with decree.' (Surah Al-Qamar 54:49)",
  },
  {
    title: "Part 8: Good and Evil Are Both by Allah's Decree",
    body:
      "Ibn Taymiyyah affirms that:\n• good is from Allah\n• evil occurs by Allah's decree\n• Allah is just and wise\n• Allah does not commit injustice\n\nEvil exists:\n• as a test\n• as a means of justice\n• to show Allah's wisdom\n\nSome people struggle with this concept. They ask: if Allah decreed evil, how can He blame people for it? The answer is: Allah decreed that evil would occur, but He gave humans the choice and the ability to avoid it. He commanded them not to do it. He warned them of punishment. And He created it as a test. The existence of evil serves many purposes: it tests faith, it reveals people's true character, it brings justice (as in the punishment of wrongdoers), and it shows Allah's perfect wisdom in managing His creation. Allah is just. He does not wrong anyone. But His decree encompasses all things, good and bad.",
  },
  {
    title: "Part 9: Human Responsibility and Free Will",
    body:
      "The book explains clearly:\n• humans have choice\n• humans act willingly\n• humans are responsible for their actions\n\nAllah's decree does not excuse sin.\n\n'Whoever wills – let him believe; and whoever wills – let him disbelieve.' (Surah Al-Kahf 18:29)\n\nYou are responsible for your choices. You chose to read this right now. You choose what you do every moment. Allah decreed that you would make these choices, but He did not force you. You acted willingly. And because you acted willingly, you are responsible. On the Day of Judgment, no one can say, 'Allah made me do it.' Allah will say, 'I gave you knowledge, I gave you ability, I sent you guidance, I warned you. You chose to disobey.' The decree does not remove responsibility. It coexists with choice. This is a profound truth that Ahl al-Sunnah affirm fully.",
  },
  {
    title: "Part 10: Refutation of Deviant Views on Al-Qadar",
    body:
      "The book rejects two extremes:\n\n❌ Denial of Decree\nSome say Allah does not decree actions; humans create their own actions. This denies Allah's power. This was the view of the Qadariyyah sect. They denied that Allah created human actions. But this contradicts the Qur'an: 'Allah created you and what you do.' (Surah Aṣ-Ṣāffāt 37:96)\n\n❌ Fatalism\nOthers say humans have no choice; they are forced. This denies responsibility. This was the view of the Jabriyyah sect. They said humans have no will at all and are forced to do what they do. But this contradicts the Qur'an: 'Whoever wills – let him believe; and whoever wills – let him disbelieve.' (Surah Al-Kahf 18:29)\n\nAhl al-Sunnah take the middle path. They affirm Allah's decree fully and human responsibility fully. Both are true. This is the correct understanding.",
  },
  {
    title: "Part 11: Methodology of Ahl al-Sunnah in Al-Qadar",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm all four levels of decree\n• affirm human responsibility\n• submit to Allah's wisdom\n• do not delve into speculative philosophy\n\nThey believe:\n• Allah is just\n• Allah is wise\n• Allah is not questioned about what He does\n\nAhl al-Sunnah do not try to fully comprehend how Allah's decree and human free will coexist. They affirm both truths based on revelation. They do not engage in endless philosophical debates. They do not demand that their limited minds fully grasp Allah's infinite wisdom. They submit. They say: 'We believe in what Allah revealed. We accept what the Prophet ️ taught. We do not question Allah's decree. We trust His wisdom.' This is the way of the Companions and the righteous predecessors.",
  },
  {
    title: "Part 12: Practical Effects of Believing in Al-Qadar",
    body:
      "Belief in Al-Qadar:\n• creates patience in hardship\n• prevents arrogance in success\n• builds trust in Allah (Tawakkul)\n• encourages effort and action\n• removes despair\n• provides inner peace\n• balances hope and fear\n\nA believer works, makes du'ā', takes means, and trusts Allah.\n\nWhen hardship strikes, you remember: Allah decreed this. There is wisdom in it. You remain patient. When you succeed, you remember: Allah willed this. You remain humble. You do not despair when things go wrong, because you know Allah's decree is full of wisdom. And you do not become lazy, because you know Allah commanded you to work and take means. Belief in Al-Qadar gives you strength, peace, balance, and purpose. It transforms the way you live.",
  },
  {
    title: "Part 13: Key Sentence to Memorize",
    body:
      "Allah knew, wrote, willed, and created everything that happens, good and bad, while humans act by choice and are fully responsible for their actions, and Allah is perfectly just and wise.\n\nThis sentence summarizes:\n• The four levels of Al-Qadar (knew, wrote, willed, created)\n• The scope of decree (everything, good and bad)\n• Human choice and responsibility\n• Allah's justice and wisdom\n• The balance between decree and responsibility\n\nMemorise this sentence. It protects your belief in Al-Qadar, prevents you from falling into denial or fatalism, and keeps you firm on the path of Ahl al-Sunnah who affirm both Allah's absolute control and human accountability.",
  },
  {
    title: "Moral lessons",
    body:
      "• Belief in Al-Qadar is a pillar of faith; denying it takes a person out of Islam.\n\n• Al-Qadar has four levels: Allah's knowledge, writing, will, and creation of all things.\n\n• Both good and evil are by Allah's decree; Allah is perfectly just and wise.\n\n• Humans have choice and are fully responsible for their actions; Allah's decree does not excuse sin.\n\n• Ahl al-Sunnah affirm both Allah's decree and human responsibility; they reject denial and fatalism.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about Al-Qadar and the four levels.\n\n• Reflect on Surah Al-Qamar (54:49) and Surah Al-Hadid (57:22) about Allah's decree.\n\n• Practice patience in hardship, remembering that Allah decreed it with wisdom.\n\n• Remain humble in success, knowing that Allah willed it and granted it.\n\n• Work hard and take means, while trusting in Allah's decree (Tawakkul).\n\n• Do not use decree as an excuse for sin; take responsibility for your choices.\n\n• Avoid philosophical debates about Al-Qadar; submit to what Allah revealed and trust His wisdom.",
  },
  DEFAULT_QUIZ_SECTION,
];

const BELIEF_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Meaning of Īmān According to Ahl al-Sunnah",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that Īmān (belief/faith) is not only a feeling in the heart. Rather, Īmān consists of three inseparable parts:\n\n• Belief of the heart\n• Speech of the tongue\n• Actions of the limbs\n\nIf one part is missing, Īmān is incomplete.\n\nThis is a fundamental principle of Ahl al-Sunnah. Many deviant groups defined Īmān as only belief in the heart. They said actions are not part of faith. But this contradicts the Qur'an and Sunnah. The Companions understood Īmān as including all three components. If you believe with your heart but do not say the Shahādah, you are not a believer. If you believe and speak but never do any actions, you are not a believer. All three parts are necessary.",
  },
  {
    title: "Part 2: Qur'anic Evidence That Actions Are Part of Īmān",
    body:
      "The book shows that the Qur'an constantly joins belief with action, proving that actions are part of Īmān.\n\nAllah says: \"The believers are only those who believe in Allah and His Messenger, then do not doubt, and strive with their wealth and their lives in the cause of Allah.\" (Surah Al-Ḥujurāt 49:15)\n\nHere Allah:\n• calls them believers\n• then describes their actions\n\nThis proves actions are included in Īmān.\n\nThe Qur'an is filled with verses that describe believers and then list their actions. Allah says: 'Successful indeed are the believers: those who humble themselves in their prayer, and those who turn away from ill speech, and those who are active in giving charity...' (Surah Al-Mu'minūn 23:1-4) Notice how Allah defines believers by their actions. This is consistent throughout the Qur'an. Actions are not separate from Īmān. They are part of Īmān.",
  },
  {
    title: "Part 3: Definition of Īmān in Simple Terms",
    body:
      "According to the methodology explained in the book:\n\n• Belief of the heart: affirming Allah, His oneness, and the truth of Islam\n\n• Speech of the tongue: saying the Shahādah and speaking what Allah commanded\n\n• Actions of the limbs: prayer, fasting, charity, obedience, avoiding sins\n\nAll three together form true Īmān.\n\nLet's break this down. Belief of the heart means you truly believe in Allah, His Oneness, His Names and Attributes, the Prophets, the Books, the Angels, the Day of Judgment, and Divine Decree. Speech of the tongue means you testify with your mouth: 'There is no god but Allah, and Muhammad is the Messenger of Allah.' You also speak truth, remember Allah, and say what Allah commanded. Actions of the limbs means you pray, fast, give charity, perform Hajj, obey parents, and avoid sins. These three together make you a true believer.",
  },
  {
    title: "Part 4: Īmān Increases and Decreases",
    body:
      "Ibn Taymiyyah clearly states:\n• Īmān increases with obedience\n• Īmān decreases with sin\n\nAllah says: \"That they may increase in faith along with their faith.\" (Surah Al-Fatḥ 48:4)\n\nIf Īmān were only belief in the heart, it would not increase or decrease.\n\nThis is another key principle of Ahl al-Sunnah. Some groups said Īmān is either present or absent, like pregnancy—you are either pregnant or not. But Ahl al-Sunnah say Īmān is like health—it can be strong or weak, increasing or decreasing. The Qur'an explicitly says Īmān increases. The Companions said: 'Īmān increases and decreases. It increases with obedience and decreases with disobedience.' This is why some believers are stronger in faith than others. And this is why you should constantly work to increase your Īmān.",
  },
  {
    title: "Part 5: Examples of Increase and Decrease",
    body:
      "Increase of Īmān:\n• prayer\n• Qur'an recitation\n• remembrance of Allah\n• obedience\n• repentance\n• seeking knowledge\n• good deeds\n\nDecrease of Īmān:\n• sins\n• neglecting obligations\n• persistent disobedience\n• heedlessness\n• following desires\n• neglecting Qur'an\n\nA believer constantly works to strengthen his Īmān.\n\nYou can feel the increase and decrease of Īmān in your own life. When you pray Fajr on time, read Qur'an, and remember Allah throughout the day, you feel strong. Your Īmān is high. But when you neglect prayer, waste time, or commit sins, you feel weak. Your Īmān has decreased. This is normal. The key is to recognize it and take action to increase it again.",
  },
  {
    title: "Part 6: The Position on Major Sins",
    body:
      "The book clarifies the balanced position of Ahl al-Sunnah:\n\nA Muslim who commits a major sin:\n• is still a believer\n• but his Īmān is deficient\n• he is under Allah's will\n\nAllah may:\n• forgive him\n• punish him\n• but he is not declared a disbeliever\n\nThis rejects two extremes:\n• those who declare sinners disbelievers (Khawarij)\n• those who say sins do not affect faith (Murji'ah)\n\nAhl al-Sunnah say: a Muslim who commits a major sin like drinking alcohol, fornication, or stealing is still a Muslim. He is not a disbeliever. But his Īmān is weak and deficient. He is called a 'believer with deficient Īmān' or a 'sinful believer.' His fate is up to Allah. Allah may forgive him out of mercy. Or Allah may punish him in Hellfire for a time, then bring him out. But he will not remain in Hell forever like disbelievers. This is the balanced path.",
  },
  {
    title: "Part 7: Qur'anic Evidence for This Balance",
    body:
      "Allah says: \"Indeed, Allah does not forgive associating partners with Him, but He forgives what is less than that for whom He wills.\" (Surah An-Nisā' 4:48)\n\nMajor sins are dangerous, but not disbelief unless shirk.\n\nThis verse is critical. It draws a clear line. Shirk (associating partners with Allah) is the one sin Allah will not forgive. It takes you out of Islam completely. But all sins below shirk—no matter how major—can be forgiven by Allah. He may forgive them out of His mercy. Or He may forgive them after punishment. Or He may forgive them through the intercession of the Prophet ️. The point is: major sins are very serious and dangerous, but they do not make you a disbeliever unless they involve shirk or denying a fundamental principle of Islam.",
  },
  {
    title: "Part 8: Difference Between Īmān and Islām",
    body:
      "Ibn Taymiyyah explains:\n• sometimes Īmān and Islām are mentioned together\n• sometimes they are mentioned separately\n\nWhen mentioned together:\n• Islām refers to outward actions\n• Īmān refers to inward belief\n\nWhen mentioned alone:\n• each includes the other\n\nThis is a subtle but important point. In the famous hadith of Jibril, the Prophet ️ defined Islām and Īmān separately. Islām was defined as the five pillars (testifying, praying, fasting, charity, Hajj). Īmān was defined as belief in Allah, angels, books, messengers, the Last Day, and Divine Decree. So when both terms are mentioned together, Islām means the outward actions and Īmān means the inward belief. But when only one term is used, it includes both meanings. For example, if someone asks 'Are you a Muslim?' they mean: do you believe and practice Islam? So the term 'Muslim' includes both belief and action.",
  },
  {
    title: "Part 9: Refutation of Deviant Views About Īmān",
    body:
      "The book rejects:\n\n❌ Those who say Īmān is only belief in the heart\nThis removes actions from faith. This was the view of the Murji'ah sect. They said you can believe in your heart and never do a single good deed and still be a complete believer. This contradicts the Qur'an and Sunnah.\n\n❌ Those who say actions are not part of Īmān\nThis contradicts Qur'an and Sunnah, which constantly describe believers by their actions.\n\n❌ Those who declare sinners disbelievers\nThis contradicts Allah's mercy and justice. This was the view of the Khawarij. They said anyone who commits a major sin is a disbeliever. This is extreme and wrong.\n\nAhl al-Sunnah take the middle path. They affirm that Īmān includes belief, speech, and action. They say Īmān increases and decreases. And they say sinners are believers with deficient Īmān, not disbelievers.",
  },
  {
    title: "Part 10: Methodology of Ahl al-Sunnah Regarding Īmān",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• define Īmān as belief, speech, and action\n• believe Īmān increases and decreases\n• do not declare Muslims disbelievers for sins\n• fear sins while maintaining hope in Allah\n• follow the understanding of the Companions\n\nThis methodology protects the Muslim Ummah from division and extremism. By not declaring sinners disbelievers, we prevent the bloodshed and chaos that the Khawarij caused. By affirming that actions are part of Īmān, we prevent laziness and carelessness about obedience. By saying Īmān increases and decreases, we encourage constant self-improvement. This is the balanced, just, and wise path of the Companions and the righteous predecessors.",
  },
  {
    title: "Part 11: Effects of Correct Belief About Īmān",
    body:
      "Correct understanding of Īmān:\n• encourages obedience\n• prevents despair\n• prevents arrogance\n• motivates self-improvement\n• balances fear and hope\n• builds humility and accountability\n• promotes community unity\n\nA believer:\n• strives to increase Īmān\n• repents when it decreases\n• never feels safe from sin\n• never loses hope in Allah\n\nWhen you understand Īmān correctly, you live with balance. You are not arrogant, thinking your Īmān is perfect. You are not despairing, thinking you are doomed because you sinned. You work hard to increase your Īmān through obedience. You repent when you fall short. You fear Allah's punishment. You hope for His mercy. This is the way of true believers.",
  },
  {
    title: "Part 12: Key Sentence to Memorize",
    body:
      "Īmān is belief of the heart, speech of the tongue, and actions of the limbs; it increases with obedience and decreases with sin, and the believer remains under Allah's will.\n\nThis sentence summarizes:\n• The three components of Īmān (heart, tongue, limbs)\n• The nature of Īmān (increases and decreases)\n• The causes of increase (obedience) and decrease (sin)\n• The status of the believer who sins (under Allah's will)\n• The rejection of extremes (neither certain disbeliever nor perfect believer)\n\nMemorise this sentence. It protects your understanding of Īmān, prevents you from falling into the errors of deviant sects, and keeps you on the balanced path of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      "• Īmān consists of three inseparable parts: belief of the heart, speech of the tongue, and actions of the limbs.\n\n• Īmān increases with obedience and decreases with sin; it is not fixed or unchanging.\n\n• A Muslim who commits a major sin is still a believer but with deficient Īmān; he is not declared a disbeliever.\n\n• Major sins are dangerous but can be forgiven by Allah; only shirk is unforgivable without repentance.\n\n• Ahl al-Sunnah take the middle path: they do not declare sinners disbelievers, nor do they say sins do not affect faith.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about Īmān and its three components.\n\n• Reflect on Surah Al-Hujurat (49:15) about believers and their actions.\n\n• Work to increase your Īmān through prayer, Qur'an recitation, and remembrance of Allah.\n\n• Recognize when your Īmān decreases (after sins or heedlessness) and take immediate action to strengthen it.\n\n• Avoid declaring Muslims disbelievers for their sins; maintain the balanced view of Ahl al-Sunnah.\n\n• Repent quickly from sins, knowing they decrease Īmān and damage your relationship with Allah.\n\n• Balance fear of Allah's punishment with hope in His mercy; do not despair nor become arrogant.",
  },
  DEFAULT_QUIZ_SECTION,
];

const COMPANIONS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Who Are the Companions?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that the Companions (Ṣaḥābah) are:\n\n• those who met the Prophet ️\n• believed in him\n• and died as Muslims\n\nThey are the best generation of this Ummah and the closest people to the Prophet ️ in knowledge, action, and faith.\n\nThe Companions are not just any Muslims. They are the people who saw the Prophet ️ with their own eyes, heard his words directly, learned Islam from him personally, and lived during the time of revelation. They witnessed the miracles. They fought alongside him. They sacrificed everything for Islam. This unique experience and closeness to the Prophet ️ gives them a status that no later generation can ever reach.",
  },
  {
    title: "Part 2: The Status of the Companions in Islam",
    body:
      "The book affirms that:\n• the Companions are the best of all Muslims after the Prophets\n• no one can reach their level\n• loving them is part of correct belief\n\nTheir virtue comes from:\n• accompanying the Prophet ️\n• supporting Islam at its beginning\n• sacrificing wealth, homes, and lives\n\nThe Prophet ️ said: 'The best of people are my generation, then those who come after them, then those who come after them.' (Bukhari & Muslim) No matter how much you worship, no matter how much knowledge you gain, you cannot reach the level of a Companion. Why? Because they were with the Prophet ️. They left their families, their wealth, their homes for Islam. They endured torture, persecution, and poverty. They spread Islam across the world. Their sacrifices and sincerity cannot be matched.",
  },
  {
    title: "Part 3: Qur'anic Evidence for Their Virtue",
    body:
      "Ibn Taymiyyah cites verses such as:\n\n\"And the first forerunners among the Muhājirīn and the Anṣār and those who followed them with excellence—Allah is pleased with them and they are pleased with Him.\" (Surah At-Tawbah 9:100)\n\nThis verse proves:\n• Allah is pleased with the Companions\n• Allah promised them Paradise\n• Allah praised them clearly\n\nAnother verse: \"Muhammad is the Messenger of Allah; and those with him are firm against the disbelievers, merciful among themselves.\" (Surah Al-Fatḥ 48:29)\n\nAllah praised their character, mercy, and strength.\n\nThe Qur'an is filled with praise for the Companions. Allah testified to their faith, their sincerity, and their reward. Allah declared His pleasure with them. When Allah is pleased with someone and promises them Paradise, who are we to criticize them? Any insult to the Companions is an insult to the Qur'an itself, because the Qur'an praises them.",
  },
  {
    title: "Part 4: The Companions as the Best Example",
    body:
      "The book explains that:\n• the Companions understood Islam directly from the Prophet ️\n• they practiced Islam most correctly\n• their understanding is the reference for later generations\n\nAny belief or action that contradicts their understanding is a deviation.\n\nThe Companions are the link between us and the Prophet ️. They heard the revelation. They saw how the Prophet ️ prayed, fasted, dealt with people, and ruled. They asked him questions. They witnessed his life. When they transmitted Islam to us, they transmitted it accurately. So if you want to know the correct understanding of a verse, you look at how the Companions understood it. If you want to know the correct way to practice Islam, you follow their example. Any new interpretation or practice that contradicts their understanding is innovation and misguidance.",
  },
  {
    title: "Part 5: Loving the Companions",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• love all the Companions\n• mention them with respect\n• make du'ā' for them\n• believe they were sincere believers\n\nAllah says: \"Our Lord, forgive us and our brothers who preceded us in faith, and put not in our hearts any hatred toward those who believe.\" (Surah Al-Ḥashr 59:10)\n\nLoving the Companions is a sign of correct Īmān. The Prophet ️ said: 'Do not curse my Companions, for if one of you were to spend the equivalent of Uhud in gold, it would not reach the measure of one of them, nor even half of it.' (Bukhari & Muslim) When you mention a Companion, you say: 'May Allah be pleased with him/her' (raḍiya Allāhu 'anhu/anhā). You make du'ā' for them. You defend them against insults. You teach your children to love them.",
  },
  {
    title: "Part 6: Silence Regarding Their Disputes",
    body:
      "Ibn Taymiyyah explains that:\n• disagreements occurred among some Companions\n• they were based on ijtihād (sincere effort)\n• they did not seek evil or corruption\n\nAhl al-Sunnah:\n• remain silent about their disputes\n• do not insult any Companion\n• excuse them and leave their matter to Allah\n\nYes, there were conflicts among the Companions. The most famous is the conflict between 'Ali and Mu'āwiyah, may Allah be pleased with both of them. But these were not conflicts about Islam. They were political disagreements about who should lead and how to handle certain situations. Each side believed they were correct. They made ijtihād (sincere effort to determine the right course). They are all rewarded for their intention. Ahl al-Sunnah do not take sides. We do not say one was right and the other was wrong. We remain silent. We love all of them. We leave the judgment to Allah.",
  },
  {
    title: "Part 7: The Correct Position Toward Their Mistakes",
    body:
      "The book clarifies:\n• the Companions were human\n• they could make mistakes\n• but their virtues far outweigh their errors\n\nA single good deed of a Companion is better than many deeds of later generations.\n\nThe Companions were not infallible. They were not prophets. They could make mistakes. But their mistakes were rare and minor compared to their virtues. And when they made mistakes, they repented quickly. The Prophet ️ corrected them when needed. But no mistake they made diminishes their overall status. A single day they spent with the Prophet ️, a single battle they fought, a single sacrifice they made—all of this outweighs any error. We focus on their virtues, not their faults.",
  },
  {
    title: "Part 8: Refutation of Extremes",
    body:
      "Ibn Taymiyyah rejects two wrong approaches:\n\n❌ Those who insult or curse the Companions\nThis contradicts the Qur'an, the Sunnah, and consensus of Muslims. Some sects, particularly the Rāfiḍah (extreme Shi'a), curse and insult the Companions, especially Abū Bakr, 'Umar, and 'Ā'ishah, may Allah be pleased with them. This is a major sin and a sign of deviation. It contradicts Allah's praise of them in the Qur'an.\n\n❌ Those who exaggerate and give them divine qualities\nThis is also wrong and forbidden. Some people exaggerate the status of certain Companions to the point of attributing divine qualities to them. This is also forbidden.\n\nThe Companions are honored humans, not prophets, not divine.\n\nAhl al-Sunnah take the middle path. They love the Companions without exaggeration, and they defend them without deification.",
  },
  {
    title: "Part 9: Methodology of Ahl al-Sunnah Regarding the Companions",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• love all the Companions\n• respect their ranks\n• believe the best of them are: Abū Bakr, then 'Umar, then 'Uthmān, then 'Alī\n• follow their understanding of Islam\n• avoid insults, hatred, and exaggeration\n\nThis ranking is based on the Prophet's own words and the consensus of the Companions themselves. Abū Bakr was the closest to the Prophet ️, the first to believe, the most generous, the most sincere. Then 'Umar, the strong, just, and decisive. Then 'Uthmān, the generous and modest. Then 'Alī, the brave and knowledgeable. These four are the Rightly Guided Caliphs (Khulafā' Rāshidūn). But we love all the Companions, from the greatest to the least known. This is the way of Ahl al-Sunnah.",
  },
  {
    title: "Part 10: Effects of Correct Belief About the Companions",
    body:
      "Correct belief regarding the Companions:\n• protects unity\n• preserves authentic Islam\n• prevents sectarian hatred\n• connects Muslims to the original Islam\n• strengthens love for the Prophet ️\n• builds respect for Islamic history\n\nLoving the Companions is a sign of sound faith.\n\nWhen you love the Companions, you are connected to the best generation. You follow their example. You avoid the sectarian hatred that has divided the Muslim Ummah. You preserve the correct understanding of Islam. You respect the people who transmitted the Qur'an and Sunnah to you. This belief unites Muslims and protects them from deviation. It is one of the distinguishing characteristics of Ahl al-Sunnah wal-Jama'ah.",
  },
  {
    title: "Part 11: Key Sentence to Memorize",
    body:
      "The Companions of the Prophet ️ are the best of this Ummah; loving them is part of faith, insulting them is misguidance, and their understanding of Islam is the correct reference for the religion.\n\nThis sentence summarizes:\n• The status of the Companions (best of the Ummah)\n• The obligation to love them (part of faith)\n• The prohibition of insulting them (misguidance)\n• Their role as the reference (correct understanding)\n• The link between them and authentic Islam\n\nMemorise this sentence. It protects your belief about the Companions, prevents you from falling into sectarian hatred or exaggeration, and keeps you connected to the original Islam as practiced by those who learned directly from the Prophet ️.",
  },
  {
    title: "Moral lessons",
    body:
      "• The Companions are the best of this Ummah after the Prophets; no one can reach their level.\n\n• Loving the Companions is part of correct faith; insulting them contradicts the Qur'an.\n\n• The Companions' understanding of Islam is the reference; any belief contradicting theirs is deviation.\n\n• Ahl al-Sunnah remain silent about disputes among Companions; they excuse them and leave judgment to Allah.\n\n• The best Companions are Abū Bakr, 'Umar, 'Uthmān, and 'Alī, in that order.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about the Companions.\n\n• Reflect on Surah At-Tawbah (9:100) about Allah's pleasure with the Companions.\n\n• Always say 'May Allah be pleased with him/her' (raḍiya Allāhu 'anhu/anhā) when mentioning a Companion.\n\n• Learn about the lives of the four Rightly Guided Caliphs and other major Companions.\n\n• Defend the Companions against insults or false accusations.\n\n• Avoid discussions about conflicts among Companions; remain silent and respect all of them.\n\n• Teach your children to love and respect the Companions as part of correct Islamic belief.",
  },
  DEFAULT_QUIZ_SECTION,
];

const AHL_AL_BAYT_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Who Are Ahl al-Bayt?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that Ahl al-Bayt refers to:\n\n• the family of the Prophet Muhammad ️\n• his close relatives who were connected to him by lineage and marriage\n\nThis includes:\n• his wives\n• his children\n• his grandchildren\n• the believing members of Banū Hāshim\n\nAhl al-Bayt are honored by their connection to the Prophet ️. They witnessed his life. They learned from him. They were close to him. Many of them became great scholars and leaders. But connection to the Prophet ️, while an honor, does not automatically give someone a special position in Islam unless they have faith and piety.",
  },
  {
    title: "Part 2: Qur'anic Evidence for the Virtue of Ahl al-Bayt",
    body:
      "Ibn Taymiyyah cites clear verses showing their honor:\n\n\"Allah only intends to remove from you impurity, O people of the household, and to purify you completely.\" (Surah Al-Aḥzāb 33:33)\n\nThis verse shows:\n• Allah honored Ahl al-Bayt\n• Allah praised their purity\n• Allah elevated their status\n\nThis verse, called āyat al-taṭhīr (the verse of purification), proves that Ahl al-Bayt have a special place in Islam. Allah specifically protected them and purified them. This is an honor. But this verse does not mean they are infallible or that they must be obeyed in all matters. It means Allah honored them and kept them pure from major sins and hypocrisy.",
  },
  {
    title: "Part 3: Love and Respect for Ahl al-Bayt",
    body:
      "The book affirms that:\n• loving Ahl al-Bayt is part of correct belief\n• respecting them is obligatory\n• praying for them is recommended\n\nLoving them does not mean exaggerating their status.\n\nThe Prophet ️ said: 'Love me and love my family.' We are commanded to love Ahl al-Bayt. The Prophet ️ asked for their love in his final sermon. This is an obligation. When you see a member of Ahl al-Bayt, you show them respect. You make du'ā' for them: 'O Allah, grant them good.' This is part of honoring the Prophet ️. But love does not mean blindness. Love combined with wisdom means respecting them while not giving them authority they do not deserve.",
  },
  {
    title: "Part 4: Balance in Dealing With Ahl al-Bayt",
    body:
      "Ibn Taymiyyah stresses balance, rejecting two extremes:\n\n❌ Neglect and Disrespect\nSome people ignore the rights of Ahl al-Bayt or speak badly of them. This is misguidance and injustice. Ahl al-Bayt deserve respect and honor. They are the family of the Prophet ️. Insulting them is wrong.\n\n❌ Exaggeration and Deification\nOthers give them divine qualities, claim infallibility, or elevate them above all Companions. This is also misguidance and contradicts Islam. Ahl al-Bayt are honored humans, not gods. They can make mistakes. They are not infallible except in the area of transmitting revelation (if they are Prophets).\n\nAhl al-Sunnah take the middle path. They honor Ahl al-Bayt without exaggeration, and they respect them without treating them as divine.",
  },
  {
    title: "Part 5: The Rank of Ahl al-Bayt Among the Companions",
    body:
      "The book explains that:\n• many members of Ahl al-Bayt were Companions\n• they are honored both as family and as believers\n• they are not automatically above all other Companions\n\nRank is based on:\n• faith\n• piety\n• obedience\n• not lineage alone\n\nSome members of Ahl al-Bayt, like 'Alī ibn Abī Ṭālib, were among the best of the Companions and the best of all Muslims. 'Alī was the cousin of the Prophet ️, raised by him, and one of the four Rightly Guided Caliphs. His rank is due to his faith, his knowledge, his justice, and his sacrifice. On the other hand, some members of Ahl al-Bayt may not have been as great in piety or knowledge. Rank in Islam is determined by closeness to Allah through faith and obedience, not by biological connection to the Prophet ️.",
  },
  {
    title: "Part 6: Ahl al-Bayt and Leadership",
    body:
      "Ibn Taymiyyah clarifies:\n• leadership is not restricted to Ahl al-Bayt\n• righteousness, knowledge, and capability are the criteria\n• Islam does not establish inherited religious authority\n\nSome groups claim that leadership must be from Ahl al-Bayt and that they have special religious authority passed down through lineage. But this contradicts Islam. The Khilafah (leadership) is not hereditary in Islam. The Prophet ️ did not appoint anyone as his successor before his death. Leadership is chosen based on capability and trustworthiness. The first Khalifah, Abū Bakr, was chosen by the Companions because of his virtue and knowledge, not because of lineage. Many non-Ahl al-Bayt served as Khalifah and did great things for Islam. This is the Islamic way.",
  },
  {
    title: "Part 7: Methodology of Ahl al-Sunnah Regarding Ahl al-Bayt",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• love Ahl al-Bayt\n• respect them\n• defend their honor\n• pray for them\n• follow the Qur'an and Sunnah, not lineage-based authority\n\nThey do not:\n• curse them\n• exaggerate about them\n• neglect their rights\n• claim they have special authority or infallibility\n\nThis is the balanced path. Ahl al-Sunnah do not go to extremes. They do not neglect Ahl al-Bayt or insult them. And they do not exaggerate about them or claim they have special powers or authority. They love them as family of the Prophet ️ and respect their learning and piety, but they do not follow them in matters of faith based solely on lineage. They follow the Qur'an and Sunnah and the understanding of the righteous scholars, whether they are from Ahl al-Bayt or not.",
  },
  {
    title: "Part 8: Effects of Correct Belief About Ahl al-Bayt",
    body:
      "Correct belief regarding Ahl al-Bayt:\n• preserves unity\n• prevents sectarian hatred\n• maintains justice and balance\n• connects Muslims to the Prophet ️ through love and respect\n• honors the Prophet ️ by honoring his family\n• avoids extremism and deviation\n\nWhen Muslims correctly believe about Ahl al-Bayt, they are united. Sunni Muslims respect Ahl al-Bayt. Shi'a Muslims respect Ahl al-Bayt. But Ahl al-Sunnah do not divide over Ahl al-Bayt. They do not curse them or exaggerate about them. This balanced belief prevents sectarian hatred and preserves the unity of the Muslim Ummah.",
  },
  {
    title: "Part 9: Key Sentence to Memorize",
    body:
      "Ahl al-Bayt of the Prophet ️ are honored and loved, but they are respected without exaggeration or neglect, and virtue is based on faith and obedience, not lineage alone.\n\nThis sentence summarizes:\n• The honor of Ahl al-Bayt\n• The command to love them\n• The rejection of exaggeration\n• The rejection of neglect\n• The basis of rank in Islam (faith and obedience, not lineage)\n• The balanced methodology of Ahl al-Sunnah\n\nMemorise this sentence. It protects your belief about Ahl al-Bayt, prevents you from falling into extremes of neglect or exaggeration, and keeps you on the balanced path of Ahl al-Sunnah that honors the family of the Prophet ️ without deifying them or giving them unearned authority.",
  },
  {
    title: "Moral lessons",
    body:
      "• Ahl al-Bayt of the Prophet ️ are honored; loving and respecting them is part of correct belief.\n\n• Ahl al-Bayt deserve respect without exaggeration; they are honored humans, not divine.\n\n• Rank in Islam is based on faith, piety, and obedience; not on lineage or family connection alone.\n\n• Leadership in Islam is not restricted to Ahl al-Bayt; it is chosen based on righteousness and capability.\n\n• Ahl al-Sunnah take the middle path: they honor Ahl al-Bayt without exaggeration or neglect.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about Ahl al-Bayt.\n\n• Reflect on Surah Al-Ahzab (33:33) about Allah's purification of Ahl al-Bayt.\n\n• Show respect to Ahl al-Bayt when you encounter them; make du'ā' for them.\n\n• Learn about the great scholars and leaders from Ahl al-Bayt, like 'Ali, Al-Ḥasan, Al-Ḥusayn, 'Abdullah ibn 'Abbas, and others.\n\n• Avoid insulting any member of Ahl al-Bayt; defend their honor against attacks.\n\n• Do not exaggerate the status of Ahl al-Bayt; treat them with honor but not as divine or infallible.\n\n• Follow the Qur'an and Sunnah for matters of faith and law, regardless of whether the teacher is from Ahl al-Bayt or not.",
  },
  DEFAULT_QUIZ_SECTION,
];

const MOTHERS_OF_BELIEVERS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Who Are the Mothers of the Believers?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah affirms that the wives of the Prophet ️ are called the Mothers of the Believers (Ummāhāt al-Mu'minīn).\n\nThey are:\n• the wives of Prophet Muhammad ️\n• honored by Allah\n• respected by all believers\n\nThis title is permanent and remains after the Prophet's death.\n\nThe Prophet ️ had several wives. The exact number is nine (though some scholars mention thirteen if different reports are counted). Each of them is a Mother of the Believers. From the moment she married the Prophet ️, she became the mother of every Muslim. This is not a blood relationship; it is an honor and a status. This title is not temporary. Even after the Prophet's death, they remain the Mothers of the Believers. They are the wives of the Prophet ️ in the Hereafter as well.",
  },
  {
    title: "Part 2: Qur'anic Evidence for Their Status",
    body:
      "Allah says: \"The Prophet is closer to the believers than their own selves, and his wives are their mothers.\" (Surah Al-Aḥzāb 33:6)\n\nThis verse establishes:\n• their unique status\n• their honor\n• their respect above all other women of the Ummah\n\nCalling them 'mothers' means:\n• respect\n• honor\n• prohibition of marriage to them\n• It does not mean blood relationship\n\nThis verse is clear and explicit. Allah Himself declared that the wives of the Prophet ️ are the mothers of believers. No other woman has this status. No woman, no matter how pious or learned, can be called 'the Mother of the Believers.' This status belongs exclusively to the wives of the Prophet ️. It means believers should show them the respect they would show their mothers. It means we cannot marry them. It means we honor them above other women. This is an Islamic law based on the Qur'an.",
  },
  {
    title: "Part 3: Their Special Rank and Virtue",
    body:
      "The book explains that:\n• the wives of the Prophet ️ have a higher status than all other women\n• they supported the Prophet ️\n• they preserved and transmitted the Sunnah\n\nMany rulings of Islam were narrated through them, especially:\n• matters of family life\n• worship inside the home\n• character of the Prophet ️\n\nThe wives of the Prophet ️, especially Ā'ishah, Umm Salamah, and others, narrated thousands of hadiths. Ā'ishah, in particular, is one of the greatest scholars of Islam. The Prophet ️ praised her knowledge. She spent years learning from him and transmitting his Sunnah. Through her hadiths, we know how the Prophet ️ prayed in private, how he treated his family, how he spent his nights. The wives of the Prophet ️ are treasures of Islamic knowledge and guidance. Every Muslim, male and female, should love and respect them.",
  },
  {
    title: "Part 4: Their Marriage to the Prophet ️ Is Eternal",
    body:
      "Ibn Taymiyyah affirms:\n• they are his wives in this world and the Hereafter\n• no one is allowed to marry them after him\n\nAllah says: \"And it is not lawful for you to harm the Messenger of Allah or to marry his wives after him, ever.\" (Surah Al-Aḥzāb 33:53)\n\nThis is an eternal command from Allah. After the death of the Prophet ️, no man can marry any of his wives. If a wife survived him (which some did), she remains his wife forever. She cannot remarry. And it is forbidden to propose to her or try to marry her. This prohibition comes directly from Allah and shows the eternal bond between the Prophet ️ and his wives. In the Hereafter, they will be his wives. This is their honor.",
  },
  {
    title: "Part 5: Their Human Nature",
    body:
      "The book clarifies that:\n• the wives of the Prophet ️ were human\n• they were not infallible\n• they could make mistakes\n\nHowever:\n• Allah corrected them when needed\n• Allah forgave them\n• Allah elevated their rank\n\nTheir mistakes do not reduce their honor.\n\nThe wives of the Prophet ️ were human, not angels. The Qur'an mentions disputes that occurred among them. It also mentions a mistake that Ā'ishah made regarding the Prophet ️ and Zaynab (Surah At-Taḥrīm 66:4-5). The Prophet ️ rebuked her for it. This shows they were human. They could make mistakes. But Allah corrected them when they made mistakes. And their overall virtue and honor remained intact. One or two mistakes do not erase a lifetime of service to Islam and the Prophet ️.",
  },
  {
    title: "Part 6: Prohibition of Insulting the Mothers of the Believers",
    body:
      "Ibn Taymiyyah strongly emphasizes:\n• insulting them is forbidden\n• accusing them is a grave sin\n• doing so contradicts the Qur'an\n\nInsulting them is an attack on:\n• the Prophet ️\n• the honor of Islam\n• the Qur'an itself\n\nThe Prophet ️ said: 'Do not harm the wives of the Prophet ️ in the Dunya [this life], for Allah will harm him who harms them on the Day of Resurrection.' (Aḥmad) When you insult a wife of the Prophet ️, you insult the Prophet ️ himself. You are attacking someone he chose. You are contradicting the Qur'an which honors them. This is a grave sin that brings Allah's anger. Any Muslim who truly loves the Prophet ️ will defend his wives and speak of them with respect and kindness.",
  },
  {
    title: "Part 7: Refutation of Deviant Views",
    body:
      "The book rejects:\n• those who curse or insult the wives of the Prophet ️\n• those who single out some wives for hatred\n• those who question their honor or faith\n\nThis behavior is misguidance and deviation from Ahl al-Sunnah.\n\nThere are deviant groups that curse or insult the wives of the Prophet ️. Some extreme Shi'a sects curse Ā'ishah and Hafsah. Some groups accuse them of betraying the Prophet ️. Others spread false stories about them. All of this is forbidden and is a major sin. It is deviation from Islam. Ahl al-Sunnah reject all such attacks. We defend all the wives of the Prophet ️ equally. We do not single out one for hatred. We do not listen to false accusations. We follow the Qur'an and Sunnah which honor them all.",
  },
  {
    title: "Part 8: Methodology of Ahl al-Sunnah Regarding the Mothers of the Believers",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• love all the wives of the Prophet ️\n• respect them equally\n• defend their honor\n• speak of them with goodness\n• remain silent about personal disputes\n\nThey believe:\n• all of them died as believers\n• all are among the righteous women of this Ummah\n\nWe love Ā'ishah for her knowledge and piety. We love Khadijah for her support of the Prophet ️ when he was in need. We love Zaynab bint Jahsh for her generosity. We love Umm Salamah for her wisdom. We love all of them. We do not compare them or say one was better than another in a way that causes hatred. We respect all of them. When we read their biographies, we learn from them. When we transmit their hadiths, we honor them. When we teach our children about them, we instill in them love and respect for the wives of the Prophet ️.",
  },
  {
    title: "Part 9: Effects of Correct Belief About the Mothers of the Believers",
    body:
      "Correct belief:\n• preserves respect for the Prophet ️\n• protects the Sunnah\n• prevents sectarian hatred\n• maintains unity\n• strengthens love for the Prophet's household\n• builds moral character through their examples\n• protects women's honor in Islam\n\nWhen you respect the wives of the Prophet ️, you respect the Prophet ️. When you listen to them and learn from them, you preserve the Sunnah. When you defend them against false accusations, you take a stand against misguidance. The wives of the Prophet ️ are role models for Muslim women. They are examples of sincerity, knowledge, courage, and faith. By learning from their lives, Muslim women can strengthen their own faith.",
  },
  {
    title: "Part 10: Key Sentence to Memorize",
    body:
      "The wives of the Prophet ️ are the Mothers of the Believers; they are honored, respected, and defended, and insulting them is forbidden and a deviation from the creed of Ahl al-Sunnah wal-Jama'ah.\n\nThis sentence summarizes:\n• Their title (Mothers of the Believers)\n• Their status (honored and respected)\n• Our obligation (defend them)\n• What is forbidden (insulting them)\n• What is deviation (not respecting them)\n• The path of Ahl al-Sunnah\n\nMemorise this sentence. It protects your belief about the wives of the Prophet ️, reminds you of your obligation to respect them, and keeps you on the path of Ahl al-Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      "• The wives of the Prophet ️ are the Mothers of the Believers; they have a unique status in Islam.\n\n• They are honored above all other women; disrespecting them is an attack on the Prophet ️.\n\n• They are wives of the Prophet ️ in this life and the Hereafter; no one can marry them after him.\n\n• They were human and could make mistakes, but their virtues far outweigh their errors.\n\n• Insulting them is forbidden; defending them is obligatory for every true believer.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about the Mothers of the Believers.\n\n• Reflect on Surah Al-Ahzab (33:6) about the status of the Prophet's wives.\n\n• Learn about the lives of the wives of the Prophet ️: their struggles, their sacrifices, their knowledge.\n\n• Study hadiths narrated by them, especially from Ā'ishah, the most prolific narrator.\n\n• Always speak of them with respect; use honorable titles and pleasant language.\n\n• Defend them against any false accusations or insults; this is a duty to the Prophet ️.\n\n• Teach your children to respect and love the Mothers of the Believers as examples of faith and virtue.",
  },
  DEFAULT_QUIZ_SECTION,
];

const MIRACLES_OF_SAINTS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Who Are the Awliyā' (Saints)?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that the Awliyā' of Allah are:\n\n• the believers\n• who have true faith (Īmān)\n• and have taqwā (piety and obedience)\n\nAllah says: \"Indeed, the allies (awliyā') of Allah—there will be no fear concerning them, nor will they grieve. Those who believed and were fearing Allah.\" (Surah Yūnus 10:62–63)\n\nWilāyah (being a saint) is based on:\n• faith\n• obedience\n• not lineage, claims, or titles\n\nA saint is not someone with a fancy title or someone people call holy. A saint is a believer who believes in Allah and His Prophet, obeys the commands of Allah, and avoids what Allah forbade. Any believer can be a saint. Your grandmother who prays regularly and teaches the Qur'an to her grandchildren is a saint. Your uncle who is honest in business and helps the poor is a saint. This is the Islamic understanding of sainthood.",
  },
  {
    title: "Part 2: What Are the Miracles of the Awliyā' (Karāmāt)?",
    body:
      "Karāmāt are:\n\n• extraordinary events\n• that Allah causes to occur\n• at the hands of righteous believers\n• without their claim of prophethood\n\nThese events:\n• break normal patterns\n• occur by Allah's power\n• are a sign of Allah's support\n• are not magic, not trickery, and not independent power\n\nKarāmah means 'honor' or 'generosity.' When Allah grants a miracle to a righteous believer, it is an honor from Allah. Allah is showing His power and His support for His righteous servant. These are real events that happen. A person walks on water. A saint finds food appears from nowhere. A wall that should collapse is held up by Allah's power. These are not tricks or illusions. They are real miracles from Allah.",
  },
  {
    title: "Part 3: Difference Between Miracles and Prophetic Signs",
    body:
      "Ibn Taymiyyah makes a clear distinction:\n\nMu'jizāt (Miracles of Prophets):\n• prove prophethood\n• accompanied by a challenge\n• occur when someone claims to be a prophet\n• establish a new Sharī'ah (law)\n\nKarāmāt (Miracles of Saints):\n• honor the believer\n• support the truth\n• do not establish prophethood\n• do not bring new laws or commands\n\nA saint never becomes a prophet.\n\nThis is an important distinction. When a Prophet performs a miracle, it proves he is a Prophet. It is a sign that he is telling the truth about prophethood. But when a saint performs a miracle, it does not make him a prophet. It just shows Allah's support and power. There will be no prophet after Muhammad ️. So no miracle, no matter how great, can establish someone as a prophet. Miracles of saints simply honor them and show Allah's power and care for His righteous servants.",
  },
  {
    title: "Part 4: Qur'anic Evidence for Karāmāt",
    body:
      "The book affirms karāmāt using clear Qur'anic examples:\n\n1️⃣ The People of the Cave\nAllah preserved them for many years without food or water. (Surah Al-Kahf) They were believers, not prophets. Yet Allah caused an extraordinary event. The sun turned in their cave. Time passed differently for them.\n\n2️⃣ Maryam (peace be upon her)\nShe received provision without visible means.\n\"Whenever Zakariyyā entered upon her in the prayer chamber, he found with her provision.\" (Surah Āl 'Imrān 3:37)\nMaryam was not a prophet. She was a righteous believer. Yet Allah provided for her in extraordinary ways.\n\n3️⃣ The One Who Brought the Throne\nA righteous servant brought the throne of Bilqīs instantly.\n\"The one who had knowledge of the Book said: 'I will bring it to you before your glance returns to you.'\" (Surah An-Naml 27:40)\nThis person was not a prophet. He was a believer with knowledge. Yet Allah granted him an extraordinary miracle.\n\nThese were not prophets, yet Allah honored them with karāmāt.",
  },
  {
    title: "Part 5: Karāmāt Do Not Contradict the Sharī'ah",
    body:
      "A crucial principle in the book:\n\nAny claimed miracle that contradicts the Qur'an or Sunnah is false.\n\nTrue karāmāt:\n• increase obedience\n• strengthen faith\n• support the truth\n• align with Islamic teachings\n\nFalse claims:\n• justify sins\n• cancel obligations\n• promote innovations\n• contradict the Sharī'ah\n\nFor example, if someone claims: 'I have a miracle that allows me to not pray,' this is false. No miracle can cancel prayer. If someone says: 'I can commune with the Prophet ️ directly, and he commanded me to do something that contradicts the Sunnah,' this is false. No miracle justifies innovation or contradicts the Qur'an and Sunnah. True karāmāt always support obedience and truth. They never support disobedience or innovation.",
  },
  {
    title: "Part 6: Saints Are Not Infallible",
    body:
      "Ibn Taymiyyah stresses:\n• Awliyā' are human\n• they can make mistakes\n• they are not protected from error\n\nObedience is measured by:\n• Qur'an\n• Sunnah\n• not by miraculous claims\n\nA saint can have a karāmah (miracle) and still make a mistake in other areas. A saint can perform an extraordinary act and still commit a sin. The presence of a miracle does not mean someone is infallible or always right. We judge the righteousness of a person by their adherence to the Qur'an and Sunnah, not by their miraculous claims. If a person claims a miracle that contradicts the Qur'an, we reject the claim as false, even if the person appears to be pious.",
  },
  {
    title: "Part 7: Refutation of Deviations Regarding Awliyā'",
    body:
      "The book rejects:\n\n❌ Denying Karāmāt Entirely\nThis contradicts Qur'an, Sunnah, and consensus of the Salaf. Some groups deny that Allah grants miracles to righteous believers. But the Qur'an clearly shows that Allah grants extraordinary events to believers. Denying this is wrong.\n\n❌ Exaggeration About Saints\nSuch as:\n• claiming they control the universe\n• asking them for help (du'ā' to them)\n• believing they know the unseen\n• attributing divine qualities to them\n\nThis is shirk and false belief.\n\nMany people have deviated regarding saints. Some claim that saints can do things only Allah can do. They ask saints for help in matters that only Allah can decide. They believe saints can hear their prayers from any distance. This is shirk. It is taking the saints as partners with Allah. This is forbidden. A saint is a human. A saint dies and returns to dust. Only Allah can hear prayers from all places. Only Allah knows the unseen. Only Allah can cause events. A saint is honored, but not divine.",
  },
  {
    title: "Part 8: The Correct Way to View Awliyā'",
    body:
      "Ahl al-Sunnah wal-Jama'ah:\n• affirm karāmāt as real\n• attribute them to Allah, not the saint\n• love the righteous\n• follow their obedience, not their miracles\n• do not worship them or ask them for help\n• do not exaggerate about their abilities\n\nWe can admire a saint. We can love a saint. We can learn from their example of obedience. But we do not make them our gods. We do not ask them to fulfill our needs. We ask only Allah. We do not claim they have powers they do not have. When we read about the karāmāt of saints, we learn that Allah supports the righteous. We are motivated to increase our own obedience. But we do not become dependent on saints or worship them.",
  },
  {
    title: "Part 9: Effects of Correct Belief in Karāmāt",
    body:
      "Correct belief:\n• increases trust in Allah\n• strengthens love for righteousness\n• protects from deception\n• maintains balance and humility\n• prevents shirk\n• encourages obedience\n\nA believer seeks:\n• obedience, not miracles\n\nWhen you understand karāmāt correctly, you realize that Allah is with the righteous. This increases your trust in Allah. You see that when you obey Allah and maintain piety, Allah supports you. You may not see miracles, but you will see Allah's care and support. You become motivated to live righteously. You do not become obsessed with seeking miracles or following people who claim miraculous powers. You focus on what matters: obeying Allah and following the Sunnah.",
  },
  {
    title: "Part 10: Key Sentence to Memorize",
    body:
      "The miracles of the Awliyā' are real and true, granted by Allah to righteous believers, but they never contradict the Qur'an and Sunnah, and they do not elevate anyone above prophetic guidance.\n\nThis sentence summarizes:\n• The reality of karāmāt\n• Their source (Allah alone)\n• Their recipients (righteous believers)\n• Their boundaries (within Sharī'ah)\n• Their limit (they do not override prophethood)\n• Protection against deviations\n\nMemorise this sentence. It protects your belief about saints and their miracles, prevents you from falling into shirk or denying the miraculous, and keeps you on the balanced path of Ahl al-Sunnah that affirms karāmāt while maintaining the supremacy of the Qur'an and Sunnah.",
  },
  {
    title: "Moral lessons",
    body:
      "• The Awliyā' (saints) are righteous believers with true faith and piety; sainthood is based on obedience, not lineage or claims.\n\n• Karāmāt (miracles of saints) are real; Allah grants extraordinary events to righteous believers as a sign of His support.\n\n• Karāmāt do not establish prophethood and never contradict the Qur'an and Sunnah.\n\n• Saints are human and not infallible; they can make mistakes, and obedience to them is only in what agrees with Islamic law.\n\n• Asking saints for help or believing they know the unseen is shirk; only Allah can hear prayers and determine outcomes.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about the miracles of saints.\n\n• Reflect on Surah Yūnus (10:62-63) about who the allies (awliyā') of Allah are.\n\n• Learn about the karāmāt mentioned in the Qur'an, like those of Maryam and Ahl al-Kahf.\n\n• Avoid asking saints (living or dead) for help; direct all du'ā' and requests to Allah alone.\n\n• Follow the example of righteous people in their obedience, not in claims of miracles or special powers.\n\n• Be cautious of people who claim special miracles or extraordinary powers; measure them against the Qur'an and Sunnah.\n\n• Understand that true sainthood comes from faith and obedience; work to increase your own piety and righteousness.",
  },
  DEFAULT_QUIZ_SECTION,
];

const SUNNAH_PATH_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: What Is Meant by the Path of Ahl al-Sunnah wal-Jamā'ah?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that Ahl al-Sunnah wal-Jamā'ah are:\n\n• those who adhere to the Qur'an\n• and the authentic Sunnah\n• according to the understanding of the Companions and the early righteous generations (Salaf)\n\nThey are called:\n• Ahl al-Sunnah → because they follow the Sunnah\n• Al-Jamā'ah → because they remain united upon the truth\n\nAhl al-Sunnah wal-Jamā'ah is not just a name. It is a complete path of Islam. It means you follow what the Prophet ️ and his Companions followed. You do not follow your own opinions. You do not follow secular philosophy. You do not follow sects that contradict the Qur'an. You follow the truth as it came, understand it as the Companions understood it, and live it as they lived it.",
  },
  {
    title: "Part 2: The Primary Sources of Their Religion",
    body:
      "The path of Ahl al-Sunnah is built strictly upon:\n\n• the Book of Allah (Qur'an)\n• the Sunnah of the Messenger ️\n• the consensus (ijmā') of the Companions\n\nThey do not:\n• prefer opinions over revelation\n• introduce innovations\n• follow desires or philosophy\n\nThese are the three pillars upon which all Islamic belief and law are built. If something contradicts the Qur'an, it is rejected. If something contradicts the Sunnah, it is rejected. If it was done by the Companions and became consensus, it is accepted. Ahl al-Sunnah do not change these sources or rank them differently. They do not say reason is above revelation. They do not say culture can override the Sunnah. They follow the revelation strictly.",
  },
  {
    title: "Part 3: Their Methodology in Belief ('Aqidah)",
    body:
      "Ahl al-Sunnah wal-Jamā'ah:\n• affirm Allah's Names and Attributes as they came\n• do not distort meanings\n• do not deny attributes\n• do not compare Allah to creation\n• do not ask how\n\nTheir belief is text-based, not speculative.\n\nIn matters of belief about Allah, Ahl al-Sunnah follow the Qur'an and Sunnah literally. Allah says: 'The Most Merciful has settled upon the Throne.' (Surah Tā Hā 20:5) Ahl al-Sunnah say: Allah is truly on the Throne. They do not say it is metaphorical. They do not distort the meaning to fit philosophical theories. They affirm what Allah affirmed. They do not try to explain how Allah is on the Throne because Allah's nature is beyond our understanding. This is the balanced path between those who deny Allah's attributes and those who compare Allah to creation.",
  },
  {
    title: "Part 4: Their Position Regarding the Companions",
    body:
      "The book emphasizes that Ahl al-Sunnah:\n• love all the Companions\n• respect their ranks\n• remain silent about their disputes\n• believe the best of them are: Abū Bakr, then 'Umar, then 'Uthmān, then 'Alī\n\nThey do not curse or insult any Companion.\n\nThe Companions are the reference point for understanding Islam. They lived with the Prophet ️. They heard the revelation. They witnessed Islam being established. By loving the Companions, we connect to the original Islam. By learning from them, we understand Islam correctly. The best of them are Abū Bakr and 'Umar because they were the closest to the Prophet ️ and the most knowledgeable. But all Companions are honored and respected. We do not curse them or insult them. Those who do so contradict the path of Ahl al-Sunnah.",
  },
  {
    title: "Part 5: Their Balance in Matters of Faith and Deeds",
    body:
      "Ahl al-Sunnah follow the middle path:\n• between exaggeration and neglect\n• between declaring sinners disbelievers and excusing sins\n• between denying intercession and misusing it\n• between denying decree and fatalism\n\nBalance is a key feature of their path.\n\nAhl al-Sunnah are called the Moderate Ummah (Al-Ummah al-Wasatah). They take the middle position in all matters. They do not go to extremes. In belief, they do not exaggerate or diminish. In law, they do not make things forbidden that Allah permitted or permit things Allah forbade. In behavior, they are neither too strict nor too lenient. This balance is found throughout their understanding of Islam. It is what distinguishes them from sects that go to extremes in either direction.",
  },
  {
    title: "Part 6: Their Position on Innovation (Bid'ah)",
    body:
      "Ibn Taymiyyah explains that Ahl al-Sunnah:\n• reject religious innovations\n• believe every innovation in religion is misguidance\n• hold that worship must be based on evidence\n\nGood intention does not justify innovation.\n\nThe Prophet ️ said: 'Every innovation is misguidance.' (Tirmidhi) Innovation means adding something to Islam that is not from Islam. For example, creating new ways of worship, new holidays, new rituals. Even if the intention is good, if it is not from the Qur'an and Sunnah, it is forbidden. Ahl al-Sunnah are strict about this. They do not allow practices that lack evidence from the Qur'an and Sunnah. This protects Islam from being distorted or corrupted over time.",
  },
  {
    title: "Part 7: Their Method in Unity and Disagreement",
    body:
      "Ahl al-Sunnah:\n• strive for unity upon truth\n• avoid division and sectarianism\n• do not split the Ummah over secondary issues\n• differentiate between major beliefs and minor disagreements\n\nUnity is based on truth, not compromise of creed.\n\nAhl al-Sunnah value unity, but not at the cost of truth. They do not say: 'Let's agree to disagree on fundamental matters.' No. On fundamental matters, there is only one truth. But on secondary issues—like the details of how something will happen in the future—there can be different views. On such matters, scholars can disagree. This does not divide the Ummah. What divides the Ummah is disagreement on fundamental creed. Ahl al-Sunnah work to maintain unity on the fundamentals while allowing room for scholarly disagreement on secondary matters.",
  },
  {
    title: "Part 8: Their Conduct and Character",
    body:
      "The path of Ahl al-Sunnah is not only belief, but also:\n• justice\n• mercy\n• patience\n• humility\n• good manners\n\nThey:\n• do not oppress\n• do not exaggerate\n• do not transgress limits\n\nBeing from Ahl al-Sunnah is not just believing correctly. It is also behaving correctly. A person with correct belief but evil behavior is not truly following the path. Ahl al-Sunnah are known for their justice to all people, including enemies. They are merciful and kind. They are patient in hardship. They are humble before Allah and humble with people. They do not oppress anyone. They do not treat others harshly. They do not speak lies or backbite. Their character reflects their correct belief.",
  },
  {
    title: "Part 9: Distinction From Deviant Sects",
    body:
      "The book clarifies that Ahl al-Sunnah are distinct from groups that:\n• deny Allah's attributes\n• exaggerate about people\n• follow philosophical theology\n• abandon the understanding of the Salaf\n\nTruth is known by evidence, not by numbers.\n\nThere are many sects in Islam. Each claims to be correct. But truth is not determined by how many people follow a sect. Truth is known by evidence from the Qur'an and Sunnah. The Mu'tazilah deny Allah's attributes. The Jabriyyah deny human will. The Rāfiḍah curse the Companions. The Khawārij declare believers disbelievers. None of these groups have evidence from the Qur'an and Sunnah for their claims. Ahl al-Sunnah distinguish themselves by their adherence to evidence, not by numbers or political power.",
  },
  {
    title: "Part 10: Methodology of Salvation",
    body:
      "Ibn Taymiyyah affirms that:\n• salvation is in following the Qur'an and Sunnah\n• the saved group is Ahl al-Sunnah wal-Jamā'ah\n• deviation begins when revelation is abandoned\n\nThe Prophet ️ said: 'My Ummah will split into seventy-three sects; all of them will be in the Fire except one.'\nThey asked: Who are they?\nHe said: 'Those who are upon what I and my Companions are upon today.'\n\nThis hadith is clear. There is one group that will be saved in the Hereafter: those who follow the Prophet ️ and his Companions. That is Ahl al-Sunnah wal-Jamā'ah. All other sects, no matter how large or how many followers they have, will face punishment in the Hereafter if they do not return to the path of the Qur'an and Sunnah. This is not arrogance or judgment. It is a fact based on the hadith of the Prophet ️.",
  },
  {
    title: "Part 11: Effects of Following the Path of Ahl al-Sunnah",
    body:
      "Following this path:\n• preserves correct belief\n• protects from innovation\n• unites the Ummah\n• brings balance and clarity\n• leads to salvation by Allah's permission\n• gives peace of mind and clarity\n• connects to the original Islam\n\nWhen you follow the path of Ahl al-Sunnah, you have certainty. You know your belief is correct because it comes from the Qur'an and Sunnah. You are not confused by philosophical theories or innovations. You are united with millions of other Muslims who follow the same path. You have balance in your life. You have clarity about what is halal and haram. You have hope in Allah's mercy and fear of His punishment. Most importantly, you have the promise from the Prophet ️ that this path leads to salvation.",
  },
  {
    title: "Part 12: Key Sentence to Memorize",
    body:
      "The path of Ahl al-Sunnah wal-Jamā'ah is adherence to the Qur'an and Sunnah upon the understanding of the Companions, with balance, justice, unity, and rejection of innovation.\n\nThis sentence summarizes:\n• The foundation (Qur'an and Sunnah)\n• The reference (Companions' understanding)\n• The approach (balance and justice)\n• The goal (unity)\n• The protection (rejection of innovation)\n• The comprehensive path of Ahl al-Sunnah\n\nMemorise this sentence. It defines the path you should follow, protects you from deviations, connects you to the original Islam, and keeps you firm on the way that leads to salvation.",
  },
  {
    title: "Moral lessons",
    body:
      "• Ahl al-Sunnah wal-Jamā'ah are those who follow the Qur'an, Sunnah, and the understanding of the Companions.\n\n• Their path is based on revelation, not philosophy or secular reasoning.\n\n• They take the middle path in all matters, avoiding extremism and exaggeration.\n\n• They love and respect all Companions; they do not curse or insult any of them.\n\n• They reject religious innovation and demand evidence for all practices.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about Ahl al-Sunnah wal-Jamā'ah.\n\n• Study the Qur'an and authentic Sunnah as the primary sources of your belief and practice.\n\n• Learn about the lives of the Companions to understand Islam from their example.\n\n• Avoid religious innovations; ask for evidence from Qur'an and Sunnah for all practices.\n\n• Maintain balance in your faith: fear Allah but do not despair; hope for mercy but do not become careless.\n\n• Study with scholars of Ahl al-Sunnah to ensure you understand Islam correctly.\n\n• Teach others about the path of Ahl al-Sunnah; contribute to spreading the correct understanding of Islam.",
  },
  DEFAULT_QUIZ_SECTION,
];

const BELIEF_IN_RULINGS_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: What Is Meant by Aḥkām (Rulings)?",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that Aḥkām are:\n\n• the commands and prohibitions of Allah\n• what Allah made obligatory, recommended, permissible, disliked, and forbidden\n• all practical rulings related to worship, dealings, and behavior\n\nAhl al-Sunnah believe that Allah alone is the Lawgiver, and His rulings are perfect, just, and wise.\n\nAḥkām (rulings) cover everything in life. Whether you are praying, doing business, treating your family, or dealing with strangers, there are rulings from Allah. Some acts are obligatory like prayer and fasting. Some are recommended like making du'ā' and charity. Some are permissible like eating and drinking. Some are disliked like divorce (though permissible). Some are forbidden like murder and theft. All of these come from Allah's perfect wisdom. No one else has the authority to make rulings. No government, no leader, no scholar can change Allah's rulings. Only Allah can legislate.",
  },
  {
    title: "Part 2: The Source of Rulings",
    body:
      "Ahl al-Sunnah wal-Jamā'ah take rulings from:\n\n• the Qur'an\n• the authentic Sunnah\n• the consensus of the Companions\n• valid ijtihād based on evidence\n\nNo ruling is accepted if it contradicts the Qur'an or Sunnah.\n\nWhen a Muslim wants to know if something is allowed or forbidden, he looks to the Qur'an first. If he finds a ruling there, that is decisive. If not, he looks to the Sunnah (the authentic hadiths about the Prophet ️). If both are silent on a specific issue, he looks to the consensus of the Companions. If there is no consensus, then scholars can do ijtihād (independent reasoning) based on principles established in the Qur'an and Sunnah. But any ruling that contradicts the Qur'an or Sunnah is rejected, no matter who makes it.",
  },
  {
    title: "Part 3: Allah's Wisdom and Justice in His Rulings",
    body:
      "Ibn Taymiyyah emphasizes that:\n• all of Allah's rulings are based on wisdom\n• Allah does not command except what is good\n• Allah does not forbid except what is harmful\n\n\"And the word of your Lord has been fulfilled in truth and justice.\" (Surah Al-An'ām 6:115)\n\nEven if humans do not understand the wisdom, Allah's ruling remains correct.\n\nSometimes we understand why Allah made something obligatory or forbidden. For example, we understand that prayer brings us closer to Allah. We understand that stealing harms society. But sometimes we might not understand all the wisdom behind a ruling. For example, why did Allah forbid a specific animal for eating? Why did Allah command a specific number of days for fasting? Even if we cannot fully understand the wisdom, we trust that Allah is the All-Wise. His rulings are always correct and just. Our job is to obey, not to question or demand that Allah explain Himself.",
  },
  {
    title: "Part 4: Obligation of Submission to Allah's Rulings",
    body:
      "Ahl al-Sunnah believe:\n• submission to Allah's rulings is obligatory\n• rejecting Allah's ruling is misguidance\n• believing something is better than Allah's law is disbelief\n\n\"But no, by your Lord, they will not truly believe until they make you judge in what they dispute among themselves.\" (Surah An-Nisā' 4:65)\n\nThis is one of the strictest verses in the Qur'an. It says that a person does not truly believe until he accepts the Prophet ️ as the judge. This means accepting the Shariah completely. Not just in what you like, but in everything. Even if a ruling contradicts your desires or traditions, you must accept it. Even if society around you does something different, you must follow Allah's law. This submission is a condition of faith.",
  },
  {
    title: "Part 5: Balance Between Text and Reason",
    body:
      "The book explains that Ahl al-Sunnah:\n• use reason to understand revelation\n• do not use reason to override revelation\n\nReason follows revelation, not the opposite.\n\nReason is a blessing from Allah. We use reason to understand the Qur'an and Sunnah. We use reason to apply rulings to new situations. But reason has limits. When reason contradicts revelation, revelation is correct and reason is wrong. Some people today say: 'My reason tells me this ruling is unjust. My mind tells me this is outdated.' But they are wrong. Allah's wisdom is infinite. Our reason is limited. We cannot judge Allah's rulings by our limited understanding. Instead, we accept the rulings and use our reason to understand them better.",
  },
  {
    title: "Part 6: Difference Between Ruling and the One Who Acts",
    body:
      "A key principle in this section:\n• the ruling on an action is one thing\n• the ruling on the person is another\n\nA sinful act may be disbelief or sin, but:\n• the individual may be excused due to ignorance\n• or mistaken interpretation\n• or coercion\n\nThis preserves justice and fairness.\n\nFor example, drinking alcohol is forbidden. This is a clear ruling. But if someone drinks alcohol out of ignorance (not knowing it was forbidden), they may be excused. If someone was coerced (forced at gunpoint to drink), they are not sinful. If someone made a sincere ijtihād and made a mistake, they may be excused. This distinction between the ruling (alcohol is forbidden) and the person (this person is excused) is important for justice. Allah is perfectly just. He judges people fairly based on their knowledge, circumstances, and intentions.",
  },
  {
    title: "Part 7: Position on Major Sins",
    body:
      "Ahl al-Sunnah believe:\n• major sins are forbidden\n• committing them is serious\n• but the sinner does not leave Islam\n• unless he declares the sin lawful\n\nThe sinner is under Allah's will:\n• Allah may forgive\n• or punish\n• but He does not wrong anyone\n\nThis is the middle path of Ahl al-Sunnah. A person who commits murder or theft or fornication has committed a grave sin. It is forbidden. The ruling is clear. But this sin does not make the person a disbeliever, as long as he does not say the sin is lawful. Why? Because the Qur'an says: 'Indeed, Allah does not forgive associating partners with Him, but He forgives what is less than that for whom He wills.' (Surah An-Nisa 4:48) Only shirk takes someone out of Islam. All other sins, no matter how serious, do not make someone a disbeliever. The sinner is under Allah's will. Allah may forgive him, or punish him for a time, or accept his repentance.",
  },
  {
    title: "Part 8: Enjoining Good and Forbidding Evil",
    body:
      "The book affirms that:\n• enjoining good and forbidding evil is obligatory\n• it must be done with knowledge\n• with wisdom\n• without injustice or chaos\n\n\"You are the best nation produced for mankind: you enjoin what is right and forbid what is wrong.\" (Surah Āl 'Imrān 3:110)\n\nMuslims have a duty to promote what is good and prevent what is evil. But this must be done wisely. If you see someone about to do something forbidden, you should stop them if you can. If you see someone doing something obligatory, you should encourage them. But you do this with knowledge, not ignorance. You do it with wisdom, not harshness. You do it with justice, not oppression. And you do it in ways that will actually lead to change, not just make people angry. This is a balanced and just approach.",
  },
  {
    title: "Part 9: Rulings and Leadership",
    body:
      "Ibn Taymiyyah clarifies that:\n• obedience to rulers is obligatory in what is good\n• rebellion is forbidden due to its harm\n• disobedience is allowed only if they command sin\n\nStability and prevention of harm are major objectives of Sharī'ah.\n\nAllah commanded obedience to those in authority. The Prophet ️ said: 'Hear and obey, even if they appoint an Abyssinian slave.' But this obedience is qualified. You obey in what is lawful. If a ruler commands you to pray, pray. If he commands you to treat people justly, do so. But if a ruler commands you to commit a sin, disobey. 'There is no obedience to creation in disobeying the Creator.' (Tirmidhi) Rebellion against rulers is forbidden because it causes chaos and harm. But disobeying a sinful command is obligatory. This is the Islamic balance.",
  },
  {
    title: "Part 10: Methodology of Ahl al-Sunnah in Aḥkām",
    body:
      "Ahl al-Sunnah wal-Jamā'ah:\n• follow the Sharī'ah in belief and action\n• apply rulings with justice and mercy\n• avoid extremism and negligence\n• judge actions by evidence\n• judge people with fairness\n\nThey are known for being balanced. They do not go to extremes in applying rulings. They do not make things forbidden that Allah permitted. They do not permit things Allah forbade. They apply the law with mercy, considering circumstances and intentions. They are strict about the rulings themselves, but fair in judging people. This is the way of Ahl al-Sunnah in dealing with practical Islamic law.",
  },
  {
    title: "Part 11: Effects of Correct Belief in Aḥkām",
    body:
      "Correct belief in rulings:\n• strengthens obedience\n• brings contentment\n• preserves justice\n• protects society\n• balances mercy and firmness\n\nA believer submits to Allah's law out of faith, not compulsion.\n\nWhen you truly believe that Allah's rulings are perfect and wise, you obey them willingly. You are not reluctant. You are not looking for loopholes. You accept the law. This brings peace and contentment to your heart. You know that you are following the best way. In society, when people follow Allah's rulings, there is justice. The strong do not oppress the weak. The rich do not exploit the poor. Contracts are honored. Trust is preserved. Society is stable. This is the benefit of believing in Allah's rulings correctly.",
  },
  {
    title: "Part 12: Key Sentence to Memorize",
    body:
      "Ahl al-Sunnah wal-Jamā'ah believe that Allah's rulings are true, just, and wise; they submit to them, apply them with knowledge and justice, and do not place opinion or desire above revelation.\n\nThis sentence summarizes:\n• The foundation of rulings (Allah alone legislates)\n• The nature of rulings (true, just, wise)\n• The obligation (submit to them)\n• The application (with knowledge and justice)\n• The protection (never place opinion above revelation)\n• The commitment of Ahl al-Sunnah\n\nMemorise this sentence. It protects your belief about Islamic law, keeps you from abandoning the Sharī'ah, prevents you from placing culture or opinion above revelation, and keeps you firm on following Allah's rulings in all aspects of life.",
  },
  {
    title: "Moral lessons",
    body:
      "• Aḥkām (rulings) are Allah's commands and prohibitions covering all aspects of life.\n\n• All of Allah's rulings are based on perfect wisdom and justice; we obey them even if we do not understand all the wisdom.\n\n• Submission to Allah's rulings is obligatory; rejecting them is misguidance and disbelief.\n\n• A sinful act is forbidden, but the person may be excused due to ignorance, mistake, or coercion.\n\n• Ahl al-Sunnah apply rulings with justice and mercy, balancing firmness with fairness.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about Ahl al-Sunnah's belief in rulings.\n\n• Reflect on Surah An-Nisa (4:65) about making Allah and His Messenger the judge.\n\n• Learn the basic rulings of Islam in the five pillars and Islamic law from reliable sources.\n\n• Submit to Allah's rulings willingly, even if they contradict your desires or society's norms.\n\n• When you see evil, forbid it with knowledge, wisdom, and justice.\n\n• Obey rulers in what is good; disobey only when they command sin.\n\n• Be fair in judging people; consider their knowledge, circumstances, and intentions.",
  },
  DEFAULT_QUIZ_SECTION,
];

const VIRTUE_OF_SUNNAH_SECTIONS: ProphetStorySection[] = [
  {
    title: "Part 1: Meaning of This Section",
    body:
      "In Al-'Aqidah Al-Wāsitiyyah, Ibn Taymiyyah explains that Ahl al-Sunnah wal-Jamā'ah are superior to all other sects because they are the closest to the truth, not because of names or numbers, but because of their adherence to revelation.\n\nTheir virtue is based on:\n• correctness of belief\n• sound methodology\n• following the path of the Prophet ️ and his Companions\n\nThis is not arrogance or tribalism. It is based on objective criteria. Just as a doctor is superior to an unqualified person in medical matters because he has correct knowledge, Ahl al-Sunnah are superior in religious matters because they have correct belief and methodology based on revelation. This superiority comes from following truth, not from claims or numbers.",
  },
  {
    title: "Part 2: The Criterion of Virtue: Truth, Not Claims",
    body:
      "The book makes a clear principle:\n\nVirtue is measured by truth, not by affiliation or slogans.\n\nAhl al-Sunnah are virtuous because:\n• they follow the Qur'an\n• they follow the Sunnah\n• they follow the understanding of the Companions\n\nAny group that departs from this path loses virtue according to the level of its deviation.\n\nSome groups claim to be virtuous based on their numbers. They say: 'Millions of people follow us, so we must be right.' Others claim virtue based on names: 'We are the party of Allah.' Still others claim it based on leadership: 'Our leader is the most learned.' But Islamic virtue is not based on any of these. It is based on one thing: closeness to truth. The more you follow the Qur'an and Sunnah, the more virtuous you are. The more you deviate from them, the less virtuous you are. This is the objective criterion.",
  },
  {
    title: "Part 3: Qur'anic Evidence for This Virtue",
    body:
      "Ibn Taymiyyah supports this with clear Qur'anic principles:\n\n\"And if you obey him, you will be guided.\" (Surah An-Nūr 24:54)\n\n\"And the first forerunners among the Muhājirīn and the Anṣār and those who followed them with excellence—Allah is pleased with them.\" (Surah At-Tawbah 9:100)\n\nFollowing the Prophet ️ and the Companions is the path to guidance and Allah's pleasure.\n\nThe Qur'an is clear. Following the Prophet ️ leads to guidance. Obeying him protects you from error. Following the Companions' understanding gives you the best interpretation of Islam. This is not just our opinion. It is the Qur'an's own testimony. So those who follow this path have the Qur'an's support. They are on the path the Qur'an commanded us to take.",
  },
  {
    title: "Part 4: Connection to the Saved Group",
    body:
      "The book connects the virtue of Ahl al-Sunnah to the hadith of the saved group:\n\nThe Prophet ️ said: 'My Ummah will split into seventy-three sects; all of them will be in the Fire except one.'\n\nWhen asked who they are, he replied: 'Those who are upon what I and my Companions are upon today.'\n\nThis description exactly matches Ahl al-Sunnah wal-Jamā'ah.\n\nThis hadith is crucial. It divides the Ummah into seventy-three groups. Seventy-two will face punishment. Only one will be saved. That one group is defined by one characteristic: they are upon what the Prophet ️ and his Companions were upon. That is exactly the definition of Ahl al-Sunnah. They follow the Qur'an and Sunnah according to the understanding of the Companions. So the hadith is telling us that Ahl al-Sunnah are the saved group. This is a tremendous virtue.",
  },
  {
    title: "Part 5: Superiority in Belief ('Aqidah)",
    body:
      "Ahl al-Sunnah are superior because:\n• they affirm Allah's Names and Attributes without distortion\n• they avoid philosophical speculation\n• they rely on revelation, not logic alone\n\nOther sects:\n• deny attributes\n• reinterpret revelation\n• place reason above text\n\nSound belief gives Ahl al-Sunnah their primary virtue.\n\nThe foundation of superiority is correct belief. The Mu'tazilah deny Allah's attributes. The Ash'arites reinterpret them. The Jabriyyah deny human will. The Qadariyyah deny Allah's decree. The Rafidah curse the Companions. All of these groups departed from the path of the Qur'an and Sunnah. So their beliefs are wrong. Ahl al-Sunnah, on the other hand, affirm what Allah and His Prophet said. They do not deny or distort. They affirm that Allah has Names and Attributes. They affirm that humans have will and Allah has absolute power. They affirm all aspects of belief as revealed. This correct belief is the source of their primary virtue.",
  },
  {
    title: "Part 6: Superiority in Methodology",
    body:
      "Ibn Taymiyyah highlights that Ahl al-Sunnah:\n• take the middle path\n• avoid extremism and negligence\n• balance fear and hope\n• balance text and understanding\n\nDeviant sects usually fall into excess or deficiency.\n\nLook at any deviant sect and you will find extremism. The Khawarij are extreme in declaring Muslims disbelievers. The Murji'ah are extreme in excusing sins. The Jabriyyah deny human choice. The Qadariyyah deny Allah's power. But Ahl al-Sunnah are balanced. They affirm human choice and Allah's power. They do not make things forbidden that Allah permitted or permit things Allah forbade. They balance strictness with mercy. They balance text with understanding. This balanced methodology is a sign of their superiority. Balance is a sign of wisdom.",
  },
  {
    title: "Part 7: Superiority in Unity and Justice",
    body:
      "Ahl al-Sunnah:\n• preserve unity upon truth\n• avoid unnecessary division\n• are most just toward opponents\n• do not declare Muslims disbelievers unjustly\n\nTheir justice even extends to those who oppose them.\n\nOne sign of Ahl al-Sunnah's superiority is their justice. They do not curse those who disagree with them. They do not declare all opponents disbelievers. Even when they refute errors, they do so with knowledge and fairness. They acknowledge truth wherever it comes from. They respect those who are sincere even if mistaken. This justice is beautiful. It shows the superior character that comes from following the truth. In contrast, some deviant sects curse those who disagree with them. They declare massive numbers of people disbelievers for minor differences. This injustice is a sign of deviation.",
  },
  {
    title: "Part 8: Superiority in Conduct and Character",
    body:
      "The book explains that Ahl al-Sunnah:\n• are most merciful to creation\n• most patient with disagreement\n• most committed to good character\n• least likely to commit oppression\n\nCorrect belief produces correct behavior.\n\nWhen your belief is correct, it produces correct behavior. You fear Allah, so you do not oppress anyone. You hope for His mercy, so you are kind and merciful. You understand that all humans are Allah's creation, so you respect them. You believe that you will be judged for your deeds, so you are careful about how you treat others. Ahl al-Sunnah are known throughout history for their justice, their mercy, their patience, and their good character. This comes from their correct belief and sound understanding. In contrast, some groups known for deviation are known for oppression and harsh treatment of those who disagree with them.",
  },
  {
    title: "Part 9: Their Position Toward Other Sects",
    body:
      "Ibn Taymiyyah clarifies:\n• Ahl al-Sunnah acknowledge truth wherever it exists\n• they reject falsehood wherever it appears\n• they do not declare all opponents disbelievers\n• they judge deviations with knowledge and fairness\n\nThey combine clarity with justice.\n\nAhl al-Sunnah do not say: 'Everyone who disagrees with us is completely wrong.' No. They say: 'Let's look at the evidence.' If a person from another sect says something true, Ahl al-Sunnah acknowledge it. If they make an error, Ahl al-Sunnah refute it kindly and with evidence. They judge deviations by the level of deviation. Someone who makes an error in ijtihād is not the same as someone who denies clear Qur'anic principles. Someone born in a deviant group and never learned better is not judged the same as someone who intentionally rejects truth. This fairness and nuance is a sign of their justice and wisdom.",
  },
  {
    title: "Part 10: Why Their Path Endures",
    body:
      "The book concludes that Ahl al-Sunnah endure because:\n• their foundation is revelation\n• truth remains preserved\n• Allah supports the people of truth\n\n\"Rather, We hurl the truth against falsehood, and it destroys it.\" (Surah Al-Anbiyā' 21:18)\n\nThroughout history, many groups have claimed to be Islamic and opposed Ahl al-Sunnah. But they disappeared. Their groups split. Their teachings were forgotten. Meanwhile, Ahl al-Sunnah remains. Their scholars' books are still studied. Their methodology is still followed. Their teachings are still transmitted. Why? Because their foundation is the Qur'an and Sunnah. Truth endures. Falsehood perishes. Allah said: 'Rather, We hurl the truth against falsehood, and it destroys it.' This is a divine law. Truth wins in the end. So the very endurance of Ahl al-Sunnah is evidence of their virtue.",
  },
  {
    title: "Part 11: Effects of Knowing This Virtue",
    body:
      "Understanding the virtue of Ahl al-Sunnah:\n• strengthens certainty\n• removes confusion\n• protects from deviation\n• increases gratitude for guidance\n• encourages firmness upon truth\n\nWhen you understand that Ahl al-Sunnah are the saved group, it gives you certainty. You are not confused about which path to follow. You know the correct way. This removes doubt and confusion. You become firm and resolute. You are grateful to Allah for guiding you to the truth. You work to preserve this guidance and transmit it to others. You encourage others to follow this path because you know it is the way to salvation. This knowledge transforms how you live your faith.",
  },
  {
    title: "Part 12: Key Sentence to Memorize",
    body:
      "Ahl al-Sunnah wal-Jamā'ah are superior to all sects because they adhere to the Qur'an and Sunnah upon the understanding of the Companions, with justice, balance, and truth.\n\nThis sentence summarizes:\n• The group that is superior (Ahl al-Sunnah wal-Jamā'ah)\n• Their scope (superior to all sects)\n• The basis of their superiority (Qur'an, Sunnah, Companions' understanding)\n• Their characteristics (justice, balance, truth)\n• The complete picture of their virtue\n\nMemorise this sentence. It confirms that you are on the correct path, reminds you of what makes this path superior, motivates you to stay firm upon it, and protects you from being swayed by deviant groups or false claims.",
  },
  {
    title: "Moral lessons",
    body:
      "• Ahl al-Sunnah wal-Jamā'ah are the saved group mentioned in the hadith; their virtue is based on adherence to truth, not claims or numbers.\n\n• Their superiority comes from correct belief, sound methodology, and balance in all matters.\n\n• They are most just, most merciful, and most patient; they do not oppress or declare Muslims disbelievers unjustly.\n\n• Truth endures and falsehood perishes; the continued preservation of Ahl al-Sunnah is evidence of their virtue.\n\n• Correct belief produces correct behavior; those on the path of truth have superior character and conduct.",
  },
  {
    title: "Practical actions for students",
    body:
      "• Memorize the key sentence about the virtue of Ahl al-Sunnah.\n\n• Study the hadith about the seventy-three sects and understand what it means.\n\n• Learn the characteristics of Ahl al-Sunnah: correct belief, balance, justice, mercy.\n\n• Be grateful to Allah for guiding you to the path of Ahl al-Sunnah.\n\n• Stay firm upon this path despite pressures from society or other groups.\n\n• When disagreeing with others, follow the example of Ahl al-Sunnah: be just, kind, and evidence-based.\n\n• Teach others about the virtue and superiority of following the Qur'an and Sunnah upon the understanding of the Companions.",
  },
  DEFAULT_QUIZ_SECTION,
];

// Helper function to get English name for now (we'll handle translation in the component)
function getTitleName(title: { en: string; ar: string }): string {
  return title.en;
}

export const AQEEDAH_TOPICS: ProphetStory[] = TOPIC_TITLES.map((title, idx) => {
  const slug = `aqeedah-${idx + 1}`;
  const titleName = getTitleName(title);

  if (idx === 0) {
    return {
      slug,
      name: titleName,
      shortIntro: {
        en: "The core foundations of 'aqidah from Al-'Aqidah Al-Wasitiyyah: what 'aqidah means, who Ahl al-Sunnah are, the Saved and Victorious Group, and the six pillars of Iman with evidences.",
        ar: "الأسس الجوهرية للعقيدة من العقيدة الواسطية: ما معنى العقيدة، من هم أهل السنة، الفرقة الناجية والطائفة المنصورة، وأركان الإيمان الستة بالأدلة."
      },
      sections: FOUNDATIONS_SECTIONS,
      quranSurahs: [
        "Al-Baqarah",
        "At-Tahrim",
        "Al-Fath",
        "Al-Anbiya",
        "Al-Qamar",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 1) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "How Ahl al-Sunnah understand Allah's Names and Attributes: only from Qur'an and authentic Sunnah, affirming without distortion, denial, asking how, or resemblance.",
      sections: METHODOLOGY_SECTIONS,
      quranSurahs: ["Ash-Shura", "An-Nisa", "As-Saffat"],
    } satisfies ProphetStory;
  }

  if (idx === 2) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Evidence from the Qur'an and Sunnah proving the Ahl al-Sunnah method: affirming Allah's attributes with no distortion, denial, how, or resemblance.",
      sections: EVIDENCE_SECTIONS,
      quranSurahs: ["Ash-Shura", "An-Nisa", "As-Saffat"],
    } satisfies ProphetStory;
  }

  if (idx === 3) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "How Allah describes Himself perfectly in the Qur'an using affirmation and negation: affirming perfect attributes and negating imperfections.",
      sections: ATTRIBUTES_SECTIONS,
      quranSurahs: ["An-Nisa", "Ash-Shura", "Al-Baqarah", "Al-An'am"],
    } satisfies ProphetStory;
  }

  if (idx === 4) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Deep study of Surah Al-Ikhlas: affirming Allah's Oneness and Self-Sufficiency, and negating deficiencies and resemblance. One-third of the Qur'an in power and meaning.",
      sections: IKHLAS_SECTIONS,
      quranSurahs: ["Al-Ikhlas"],
    } satisfies ProphetStory;
  }

  if (idx === 5) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "In-depth study of Ayat al-Kursi: the greatest verse in the Qur'an. Seven affirmations of Allah's perfection and negation of all weakness, showing the complete methodology.",
      sections: KURSI_SECTIONS,
      quranSurahs: ["Al-Baqarah"],
    } satisfies ProphetStory;
  }

  if (idx === 6) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Five foundational attributes: Life (eternal), First (no beginning), Last (no end), Outward (above all), Inward (knowing all). Balance between Allah's highness and His knowledge.",
      sections: LIFE_FIRST_LAST_SECTIONS,
      quranSurahs: ["Al-Hadid", "Al-Furqan"],
    } satisfies ProphetStory;
  }

  if (idx === 7) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Knowledge and Might: Allah's knowledge encompasses all past, present, and future; Allah's power is absolute over all creation. Both complete and unlimited.",
      sections: KNOWLEDGE_MIGHT_SECTIONS,
      quranSurahs: ["As-Sajdah", "Al-Shura", "Al-Anaam"],
    } satisfies ProphetStory;
  }

  if (idx === 8) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Hearing, Seeing, and Will: Allah hears all voices, sees all deeds, and wills all events. Perfect attributes without resemblance to creation.",
      sections: HEARING_SEEING_WILL_SECTIONS,
      quranSurahs: ["Ash-Shura", "An-Nisa", "Al-Baqarah", "Al-Ma'idah", "Al-An'am"],
    } satisfies ProphetStory;
  }

  if (idx === 9) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "The Attribute of Love: Allah truly loves His believing servants who obey Him. His love is real, perfect, and connected to righteousness.",
      sections: LOVE_SECTIONS,
      quranSurahs: ["Al-Baqarah", "Al-Hujurat", "At-Tawbah", "Al Imran", "Al-Ma'idah", "As-Saff", "Al-Buruj"],
    } satisfies ProphetStory;
  }

  if (idx === 10) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attribute of Mercy for Allah: Allah is truly Merciful, His mercy encompasses all things, and it is real and perfect. Allah prescribed mercy for Himself, paired with forgiveness, giving hope to believers and encouraging repentance. His mercy is not like the mercy of creation.",
      sections: MERCY_SECTIONS,
      quranSurahs: [
        "Al-Fatihah",
        "Ghafir",
        "Al-Ahzab",
        "Al-A'raf",
        "Al-An'am",
        "Yunus",
        "Yusuf",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 11) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attributes of Pleasure, Anger, and Coming for Allah: Allah is truly pleased with obedience and truly angry with disobedience. He will come on the Day of Judgment to judge His creation. These attributes are real and befitting His majesty, without resemblance to creation and without asking how.",
      sections: PLEASURE_ANGER_COMING_SECTIONS,
      quranSurahs: [
        "Al-Ma'idah",
        "An-Nisa",
        "Muhammad",
        "Az-Zukhruf",
        "At-Tawbah",
        "As-Saff",
        "Al-Baqarah",
        "Al-An'am",
        "Al-Fajr",
        "Al-Furqan",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 12) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attributes of Face and Hand for Allah: Allah has a Face that is eternal and will not perish, and He has Hands through which He creates and gives. These are real attributes affirmed in the Qur'an, befitting His majesty, without resemblance to creation and without asking how.",
      sections: FACE_HAND_SECTIONS,
      quranSurahs: [
        "Ar-Rahman",
        "Al-Qasas",
        "Sad",
        "Al-Ma'idah",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 13) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attributes of Eyes, Seeing, and Hearing for Allah: Allah has Eyes and sees everything openly and in secret. Allah hears all voices and whispers. These are real attributes affirmed in the Qur'an and Sunnah, befitting His majesty, without resemblance to creation and without asking how.",
      sections: EYES_SEEING_HEARING_SECTIONS,
      quranSurahs: [
        "At-Tur",
        "Al-Qamar",
        "Ta-Ha",
        "Al-Mujadilah",
        "Aal Imran",
        "Az-Zukhruf",
        "Al-Alaq",
        "Ash-Shuara",
        "At-Tawbah",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 14) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attributes of Power and Planning for Allah: Allah has complete power over all things, and His planning is perfect and always overcomes all other plans. His power and planning are real attributes, based on justice and wisdom, without resemblance to creation and without asking how.",
      sections: POWER_PLANNING_SECTIONS,
      quranSurahs: [
        "Ar-Ra'd",
        "Aal Imran",
        "An-Naml",
        "At-Tariq",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 15) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attributes of Forgiveness and Might for Allah: Allah forgives sins while possessing complete and perfect might. His forgiveness is from strength, not weakness, and both attributes coexist perfectly in His nature. These are real attributes befitting His majesty, without resemblance to creation and without asking how.",
      sections: FORGIVENESS_MIGHT_SECTIONS,
      quranSurahs: [
        "An-Nisa",
        "An-Nur",
        "Al-Munafiqun",
        "Sad",
        "Ar-Rahman",
        "Maryam",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 16) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm Allah's Absolute Oneness: Allah is completely One with no partner, equal, or rival. He alone deserves all worship, dominion, and praise. This is the foundation of Islamic belief and practice. Oneness must be affirmed in belief and worship, protected from all forms of shirk.",
      sections: ONENESS_SECTIONS,
      quranSurahs: [
        "Al-Ikhlas",
        "Al-Baqarah",
        "Al-Isra",
        "At-Taghabun",
        "Al-Furqan",
        "Al-Mu'minun",
        "An-Nahl",
        "Al-A'raf",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 17) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attribute of Settling on the Throne and Highness: Allah rose over the Throne in a manner befitting His majesty. He is above all creation, above the heavens, above the Throne. His highness is in essence, status, and power. Do not ask how; do not distort; affirm exactly as revealed. Highness and closeness are both true.",
      sections: ISTIWA_SECTIONS,
      quranSurahs: [
        "Al-A'raf",
        "Yunus",
        "Al-Ra'd",
        "Ta-Ha",
        "Al-Furqan",
        "As-Sajdah",
        "Al-Hadid",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 18) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attribute of Closeness (Omnipresence): Allah is with His creation by His knowledge, hearing, seeing, and support. He sees and hears all things and nothing escapes His awareness. Yet Allah remains above the Throne in His essence. Closeness and highness are both true and do not contradict.",
      sections: OMNIPRESENCE_CLOSENESS_SECTIONS,
      quranSurahs: [
        "Al-Hadid",
        "An-Nahl",
        "Al-Baqarah",
        "At-Tawbah",
        "Ta-Ha",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 19) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Attribute of Speech (Al-Kalam): Allah truly speaks whenever He wills and however He wills. His speech is real, perfect, and heard. The Qur'an is the speech of Allah. Allah spoke directly to Musa, making him Kalimullah (the one Allah spoke to). His speech is a real attribute befitting His majesty, without resemblance to creation.",
      sections: SPEECH_SECTIONS,
      quranSurahs: [
        "An-Nisa",
        "Al-A'raf",
        "Al-Baqarah",
        "Ya-Sin",
        "At-Tawbah",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 20) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm That the Qur'an Is the Speech of Allah: The Qur'an is the uncreated speech of Allah, revealed through Jibril to the Prophet Muhammad. It came from Allah and will return to Him. It is not created like other things. It is the words of Allah, complete, preserved, and guidance for all humanity. This is the core belief of Ahl al-Sunnah.",
      sections: QURAN_IS_SPEECH_SECTIONS,
      quranSurahs: [
        "At-Tawbah",
        "Al-Fath",
        "Al-Kahf",
        "Fussilat",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 21) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm That Believers Will See Allah in the Hereafter: The believers will see Allah with their own eyes in Paradise and on the Day of Judgment. This is the greatest reward and joy, proven by Qur'an, Sunnah, and the consensus of the Companions. Seeing Allah does not mean He resembles creation; it is real seeing without asking how or comparing to creation.",
      sections: SEEING_ALLAH_SECTIONS,
      quranSurahs: [
        "Al-Qiyamah",
        "Al-Mutaffifin",
        "Ash-Shura",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 22) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm Evidence from the Sunnah Regarding Allah's Attributes: The authentic Sunnah is revelation from Allah and is equal to the Qur'an in authority for matters of belief. The Companions accepted hadiths about Allah's attributes as they came, without reinterpretation or denial. Attributes like descending, laughter, wonder, fingers, and foot are affirmed as real without asking how or resembling creation. This is the methodology of Ahl al-Sunnah.",
      sections: SUNNAH_EVIDENCE_SECTIONS,
      quranSurahs: [
        "An-Najm",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 23) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm Belief in the Hereafter: Belief in the Hereafter is a core foundation of faith. It includes believing in death, the grave, resurrection, gathering, judgment, Paradise, and Hellfire as real truths that will occur exactly as Allah informed. Resurrection is physical and real. Allah's judgment accounts for every action with perfect justice. Paradise and Hellfire are real, already created, and eternal. This belief shapes behavior and motivates righteousness.",
      sections: HEREAFTER_SECTIONS,
      quranSurahs: [
        "Al-Mu'minun",
        "Al-Anbiya",
        "Aal Imran",
        "Al-Mutaffifin",
        "Az-Zalzalah",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 24) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Affirm the Trial of the Grave and Resurrection: The trial of the grave is real; every person is questioned by two angels about their Lord, religion, and Prophet. The grave contains punishment or bliss. Resurrection is physical and real; Allah will recreate bodies and reunite them with souls. These are affirmed by Qur'an and Sunnah. Denying resurrection is disbelief. The grave is the first stage of the Hereafter.",
      sections: GRAVE_RESURRECTION_SECTIONS,
      quranSurahs: [
        "Ibrahim",
        "Al-Mu'minun",
        "Ya-Sin",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 25) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Believe in the Records of Deeds: Every person has a record in which all deeds are written by angels. Nothing is missed—small or great deeds are recorded. Records will be presented on the Day of Judgment as complete and just evidence. Believers receive their record in the right hand (success); disbelievers in the left (failure). Allah's justice is perfect; no good deed is lost, no sin is added falsely.",
      sections: RECORDS_OF_DEEDS_SECTIONS,
      quranSurahs: [
        "Al-Isra",
        "Al-Kahf",
        "Al-Jathiyah",
        "Qaf",
        "Al-Haqqah",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 26) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Believe in the Prophet's Fountain (Al-Ḥawḍ): The Prophet ️ has a real fountain on the Day of Judgment. Whoever drinks from it will never thirst again. It is larger than the distance between Madinah and Sana'a, with water whiter than milk, sweeter than honey. Only followers of the Sunnah without innovation will drink from it. Innovators will be prevented.",
      sections: PROPHETS_FOUNTAIN_SECTIONS,
      quranSurahs: [
        "Al-Kawthar",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 27) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Believe in Intercession (Shafā'ah): Intercession on the Day of Judgment is real but occurs only by Allah's permission and only for people of Tawḥīd whom He is pleased with. The Prophet ️ will have the greatest intercession. All intercession belongs to Allah alone. Asking the dead for intercession is shirk. Intercession is sought from Allah through obedience and following the Sunnah.",
      sections: INTERCESSION_SECTIONS,
      quranSurahs: [
        "Al-Baqarah",
        "Al-Anbiya",
        "Az-Zumar",
        "Ta-Ha",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 28) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Believe in Divine Decree (Al-Qadar): Al-Qadar is a pillar of faith with four levels: Allah knew, wrote, willed, and created everything that happens. Both good and bad are by Allah's decree. Humans act by choice and are fully responsible for their actions. Allah is perfectly just and wise. Belief in Al-Qadar creates patience in hardship, humility in success, and trust in Allah.",
      sections: DIVINE_DECREE_SECTIONS,
      quranSurahs: [
        "Al-Qamar",
        "Al-Hadid",
        "Al-Insan",
        "As-Saffat",
        "At-Talaq",
        "Al-Kahf",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 29) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Understand Īmān Correctly: Īmān is belief of the heart, speech of the tongue, and actions of the limbs. It increases with obedience and decreases with sin. A Muslim who commits major sins is still a believer but with deficient Īmān. Ahl al-Sunnah take the middle path: they do not declare sinners disbelievers, nor do they remove actions from faith.",
      sections: BELIEF_SECTIONS,
      quranSurahs: [
        "Al-Hujurat",
        "Al-Fath",
        "An-Nisa",
        "Al-Mu'minun",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 30) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Love and Respect the Companions: The Companions (Ṣaḥābah) are the best of this Ummah after the Prophets. Loving them is part of faith; insulting them is misguidance. Their understanding of Islam is the correct reference. The best are Abū Bakr, 'Umar, 'Uthmān, and 'Alī. Ahl al-Sunnah love all Companions, remain silent about their disputes, and avoid extremes.",
      sections: COMPANIONS_SECTIONS,
      quranSurahs: [
        "At-Tawbah",
        "Al-Fath",
        "Al-Hashr",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 31) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Honor Ahl al-Bayt Correctly: Ahl al-Bayt (family of the Prophet ️) are honored and loved without exaggeration. Rank in Islam is based on faith and obedience, not lineage. Leadership is not restricted to Ahl al-Bayt. Ahl al-Sunnah respect them while following the Qur'an and Sunnah for all matters of faith and law.",
      sections: AHL_AL_BAYT_SECTIONS,
      quranSurahs: [
        "Al-Ahzab",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 32) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Respect the Mothers of the Believers: The wives of the Prophet ️ are the Mothers of the Believers with a unique status in Islam. They are honored, respected, and defended. Insulting them is forbidden and contradicts the Qur'an. They are wives of the Prophet ️ in this life and the Hereafter. They were human and could make mistakes, but their virtues are immense.",
      sections: MOTHERS_OF_BELIEVERS_SECTIONS,
      quranSurahs: [
        "Al-Ahzab",
        "At-Tahrim",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 33) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Understand the Miracles of Saints: The Awliyā' (saints) are righteous believers with faith and piety. Karāmāt (their miracles) are real, granted by Allah, but never contradict the Qur'an and Sunnah. Saints are human and not infallible. Asking them for help is shirk. True belief in karāmāt increases trust in Allah and strengthens love for righteousness.",
      sections: MIRACLES_OF_SAINTS_SECTIONS,
      quranSurahs: [
        "Yunus",
        "Al-Kahf",
        "Aal-Imran",
        "An-Naml",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 34) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Follow the Path of Ahl al-Sunnah wal-Jamā'ah: This path is adherence to the Qur'an and Sunnah upon the understanding of the Companions. It emphasizes balance, justice, unity, and rejection of innovation. Ahl al-Sunnah love all Companions, avoid extremism, differentiate between major and minor issues, and strive for salvation through obedience to Allah.",
      sections: SUNNAH_PATH_SECTIONS,
      quranSurahs: [
        "Al-Hashr",
        "An-Nisa",
        "Al-Araf",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 35) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Believe in Allah's Rulings: Allah's rulings (Aḥkām) are true, just, and wise. Submission to them is obligatory. They cover all aspects of life: worship, dealings, behavior. Ahl al-Sunnah take rulings from Qur'an and Sunnah, apply them with justice and mercy, distinguish between the ruling and the person, and never place opinion above revelation.",
      sections: BELIEF_IN_RULINGS_SECTIONS,
      quranSurahs: [
        "Al-An'am",
        "An-Nisa",
        "Aal-Imran",
      ],
    } satisfies ProphetStory;
  }

  if (idx === 36) {
    return {
      slug,
      name: titleName,
      shortIntro:
        "Recognize the Virtue of Ahl al-Sunnah: They are superior to all sects because they adhere to the Qur'an and Sunnah upon the understanding of the Companions. They are the saved group, with correct belief, sound methodology, balance, justice, and mercy. Their virtue comes from truth, not claims. Truth endures; falsehood perishes.",
      sections: VIRTUE_OF_SUNNAH_SECTIONS,
      quranSurahs: [
        "An-Nur",
        "At-Tawbah",
        "Al-Anbiya",
      ],
    } satisfies ProphetStory;
  }

  return {
    slug,
    name: titleName,
    shortIntro:
      "Comprehensive Aqeedah lesson coming soon. Content will be organized with Qur'an translations, hadith, sections, and a quiz.",
    sections: PLACEHOLDER_SECTIONS.map((s) => ({ ...s })),
    quranSurahs: [],
  } satisfies ProphetStory;
});

export function getAqeedahTopicBySlug(slug: string): ProphetStory | undefined {
  return AQEEDAH_TOPICS.find((t) => t.slug === slug);
}

export function getTopicTitle(idx: number, language: 'en' | 'ar'): string {
  return TOPIC_TITLES[idx]?.[language] || TOPIC_TITLES[idx]?.en || '';
}

export { TOPIC_TITLES };