import { PROPHETS } from "./prophets";
import { formatProphetNamesWithPbuh } from "@/components/stories/pbuh";

export type ProphetStorySection = {
	title: string | { en: string; ar: string };
	body: string | { en: string; ar: string };
};

export type ProphetStory = {
	slug: string;
	name: string;
	shortIntro: string | { en: string; ar: string };
	sections: ProphetStorySection[];
	quranSurahs: string[];
};

type StoryContent = {
	shortIntro: string;
	sections: ProphetStorySection[];
	quranSurahs: string[];
};

const DEFAULT_QUIZ_SECTION: ProphetStorySection = {
	title: "Quiz (10 questions)",
	body: `Finish all the sections above first. Then come back here to unlock the quiz.\n\nPass requirement: at least 7/10.`,
};

function getText(value: string | { en: string; ar: string }) {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		return typeof value.en === "string" ? value.en : "";
	}
	return "";
}

function normalizeSectionsWithQuiz(sections: ProphetStorySection[]): ProphetStorySection[] {
	const next = sections.slice();
	const quizIndex = next.findIndex((s) => getText(s.title).trim().toLowerCase().startsWith("quiz"));

	if (quizIndex === -1) {
		next.push(DEFAULT_QUIZ_SECTION);
		return next;
	}

	const [quizSection] = next.splice(quizIndex, 1);
	const quizTitle = getText(quizSection.title);
	const quizBody = getText(quizSection.body);
	next.push({
		...quizSection,
		title: quizTitle.trim().length ? quizSection.title : DEFAULT_QUIZ_SECTION.title,
		body: quizBody.trim().length ? quizSection.body : DEFAULT_QUIZ_SECTION.body,
	});
	return next;
}

// NOTE: Per current scope, we are enriching the first five prophets.
// Other stories fall back to the generic placeholder.
const STORY_CONTENT_BY_SLUG: Record<string, StoryContent> = {
	adam: {
		shortIntro:
			"Adam (peace be upon him) was the first human and first prophet sent to mankind. Allah created him with special honor—teaching him knowledge that even the angels did not possess. His life teaches us about obedience to Allah's commands, the real danger of pride and whispering, sincere repentance, and the importance of remaining steadfast in faith despite Satan's continuous attempts to mislead us.",
		sections: [
			{
				title: "Part 1: Allah announces Adam's creation to the angels",
				body: `Allah the Almighty revealed to the angels: "Verily, I am going to place mankind generations after generations on earth" (Qur'an 2:30). The angels were surprised and asked: "Will You place therein those who will make mischief therein and shed blood, while we glorify You with praises and thanks (exalted be You above all that they associate with You as partners) and sanctify You?" (Qur'an 2:30).\n\nAllah replied with perfect knowledge: "I know that which you do not know" (Qur'an 2:30).\n\nAllah then commanded Gabriel to bring clay from different parts of the earth. But the earth said: "I seek refuge in Allah from your decreasing my quantity or disfiguring me." Gabriel returned without taking anything. Then Allah sent Michael, and again the earth sought refuge and was granted it. Finally, Allah sent the Angel of Death, who said: "I also seek refuge with Allah from returning without carrying out His command." So the Angel of Death took clay from the face of the earth and mixed it, taking white, red, and black clay from different places (as recorded in Ibn Kathir from the narrations of Ibn Masud and the Prophet's companions).\n\nAllah shaped this clay: "So when I have fashioned him completely and breathed into him (Adam) the soul which I created for him then fall you down prostrating yourselves unto him" (Qur'an 15:29).`,
			},
			{
				title: "Part 2: The creation of Adam and his special honor",
				body: `Adam's body lay as clay for forty years before Allah breathed His spirit into him. When Allah's spirit entered Adam, something miraculous happened. The Prophet Muhammad (peace and blessings be upon him) said: "Allah created Adam from dust after He mixed the clay and left him for some time until it became sticky mud, after which Allah shaped him. After that Allah left him till it became like potter's clay. When the spirit reached Adam's head, Adam sneezed. Allah said: 'May your Lord have mercy upon you, O Adam!'" (Sahih al-Bukhari).\n\nWhen the spirit reached Adam's eyes, he looked at the fruits of Paradise. When it reached his abdomen, he felt hunger and jumped up eagerly to eat from Paradise's fruits — showing that mankind is created with haste and immediate desire (Qur'an 21:37).\n\nAllah then commanded: "When I breathe My spirit into him prostrate before him" (Qur'an 15:29). The angels obeyed immediately. But one being did not prostrate — Iblis.`,
			},
			{
				title: "Part 3: The pride of Iblis and his refusal",
				body: `Iblis was a jinn who lived among the angels. When Allah commanded the angels to prostrate to Adam (peace be upon him), Iblis refused out of pure pride. Allah asked him: "O Iblis! What is your reason for not being among the prostrators?" (Qur'an 15:32).\n\nIblis answered with arrogance: "I am not the one to prostrate myself to a human being, whom You created from sounding clay of altered black smooth mud" (Qur'an 15:33) and "I am better than him (Adam), You created me from fire and him You created from clay" (Qur'an 7:12).\n\nAllah responded with justice: "Then get out from here for verily you are Rajim (an outcast or cursed one). Verily the curse shall be upon you till Day of Recompense (Day of Resurrection)" (Qur'an 15:34-35).\n\nIbn Kathir explains: If we compare clay and fire, we see that clay contains qualities of calmness, clemency, perseverance and growth; whereas fire contains heedlessness, insignificance, haste, and incineration. Allah's wisdom chose clay as the better substance for creating mankind.`,
			},
			{
				title: "Part 4: Allah teaches Adam knowledge of all things",
				body: `Allah granted Adam (peace be upon him) a gift that elevated him above all creation: knowledge. "Allah taught Adam all the names of everything, then He showed them to the angels and said: 'Tell Me the names of these if you are truthful'" (Qur'an 2:31).\n\nThe angels immediately recognized their own limitation. They said: "Glory be to You, we have no knowledge except what You have taught us. Verily, it is You, the All-Knower, the All-Wise" (Qur'an 2:32).\n\nThen Allah addressed Adam: "O Adam! Inform them of their names," and when he had informed them of their names, Allah said: "Did I not tell you that I know the unseen in the heavens and the earth, and I know what you reveal and what you have been hiding?" (Qur'an 2:33).\n\nThis knowledge was not random — Allah implanted in Adam an insatiable love of learning and a desire to pass knowledge to his children. This was the true reason for his creation and the secret of his glorification above other creatures.`,
			},
			{
				title: "Part 5: Eve is created as a companion",
				body: `Allah designed the perfect solution for Adam's (peace be upon him) solitude. "And of His signs is that He created for you from yourselves mates that you may dwell in tranquility with them; and He has put between you affection and mercy" (Qur'an 30:21).\n\nMore specifically, Allah revealed: "It is He Who created you from a single soul, and made from it his mate that he might dwell with her" (Qur'an 7:189).\n\nAccording to Ibn Kathir's report from Ibn Abbas: When Adam was sleeping in Paradise, Allah took one of his ribs and created Eve (Hawa) from it. When Adam awoke and saw her, he immediately recognized her as part of himself. He said: "This is my wife, created from my rib. She is the closest of all people to me."\n\nAllah also revealed: "O mankind! Reverence your Guardian Lord, who created you from a single soul, created of like nature its mate, and from the two created countless men and women" (Qur'an 4:1).\n\nThis intimate connection between spouses—created from one soul—establishes the foundation of mercy, compassion, and respect that should characterize the relationship between husband and wife.`,
			},
			{
				title: "Part 6: The test — Allah's clear command in Paradise",
				body: `Allah placed Adam (peace be upon him) and Eve in the most glorious place: Paradise. But paradise required a test of obedience. "And We said: 'O Adam! Dwell you and your wife in the Garden and eat from where you desire, but approach not this tree or you both will be among the wrongdoers'" (Qur'an 2:35).\n\nAllah further warned them specifically about Satan: "Then We said: 'O Adam! Verily, this is an enemy to you and to your wife. So let him not drive you both out of the Garden so that you be thrown into misery. Verily, you have not to hunger therein nor go naked. And you suffer not from thirst therein nor from the sun's heat. Then the Satan whispered to them both in order to uncover that which was hidden from them of their private parts, he said: Your Lord did not forbid you this tree save you should become angels or become of the immortals'" (Qur'an 20:117-120).\n\nThe test was clear. The boundary was set. The danger was warned. All that remained was to see if they would obey their Lord or yield to temptation.`,
			},
			{
				title: "Part 7: Satan's cunning whispers and deception",
				body: `Satan began his whispering campaign with a seemingly innocent question designed to plant doubt. "And the Satan whispered to him saying: 'O Adam! Shall I lead you to the Tree of Eternity and to a kingdom that will never waste away?'" (Qur'an 20:120).\n\nHe made attractive promises: "O Adam! Shall I direct you to the tree of immortality and a kingdom that will never decay?" (Qur'an 20:120).\n\nAllah reveals the exact nature of Satan's lies: "The Satan made them fail therein, and he said: 'Your Lord did not forbid you this tree save you should become angels, or become of the immortals.' And he swore by Allah to them both (saying): 'Surely, I am one of the sincere well-wishers for you both'" (Qur'an 7:20-21).\n\nNotice Satan's tactics:\n1. He questioned Allah's reason ("Why did He forbid it?")\n2. He made a false promise (immortality and power)\n3. He swore an oath to gain their trust and make his words seem certain\n4. He presented himself as a sincere advisor\n\nThis is the pattern of temptation: doubt Allah's wisdom, promise worldly gain, build false credibility, and make sin seem reasonable.`,
			},
			{
				title: "Part 8: The moment of shame and recognition of loss",
				body: `The consequences came immediately. "Thus he brought about their fall with deception. So when they tasted the tree, their shame became apparent to them, and they began to sew together the leaves of the Garden in order to cover themselves; and their Lord called out to them (saying): 'Did I not forbid you that tree and tell you that Satan is an open enemy unto you?'" (Qur'an 7:22).\n\nQur'an describes the moment: "So they both ate of the tree, and so their private parts became apparent to them, and they began to sew together, for their covering, leaves from the Paradise, and their Lord called out to them (saying): 'Did I not forbid you that tree and tell you that Satan is an open enemy unto you?'" (Qur'an 20:121).\n\nIbn Kathir explains that in that moment, Adam and Eve felt a contraction of the heart—a spiritual pain that came with the realization of their disobedience. They were no longer in a state of innocence. They had chosen heedlessness over obedience. They had believed the liar over their Lord.\n\nThey tried to hide with leaves, not realizing that nothing can be hidden from Allah, the All-Knowing, the All-Seeing. They had lost something invaluable: Allah's pleasure and the purity they once possessed.`,
			},
			{
				title: "Part 9: Sincere repentance and Allah's forgiveness",
				body: `In that moment of shame and loss, Adam (peace be upon him) and Eve did not despair. They did not make excuses or blame one another. Instead, they turned to their Lord with broken hearts and sincere repentance. "They said: 'Our Lord! We have wronged ourselves. If You forgive us not, and bestow not upon us Your Mercy, we shall certainly be lost'" (Qur'an 7:23).\n\nTheir repentance was accepted with immediate mercy. Allah revealed: "Then his Lord chose him, and turned to him with forgiveness, and gave him guidance" (Qur'an 20:122) and "So Adam received some words from his Lord, and his Lord turned to him with forgiveness" (Qur'an 2:37).\n\nIn Sahih al-Bukhari, it is narrated that when Allah forgave Adam (peace be upon him), He showed the superiority of repentance. The Prophet Muhammad (peace be upon him) said: "Adam and Moses will argue on the Day of Resurrection. Moses will say, 'You are Adam who caused mankind to fall into error and misery.' Adam will reply, 'You are Moses whom Allah chose with His messages and His speech. You blame me for a sin that Allah has forgiven me? The Lord wrote my forgiveness fifty years before He created the heavens and the earth.'" This hadith shows that Allah's forgiveness of Adam was predetermined and absolute.\n\nThe lesson is profound: repentance, when sincere and immediate, restores the servant to Allah's favor. No one should despair of Allah's mercy.`,
			},
			{
				title: "Part 10: Descent to earth and the purpose of life",
				body: `The descent to earth was not a punishment for sin; it was a dignified continuation of Allah's plan. After accepting their repentance, Allah said to Adam (peace be upon him): "Go down, all of you together from the Paradise to the earth. Then whenever there comes to you Guidance from Me, and whoever follows My Guidance, there shall be no fear on them, nor shall they grieve. But those who disbelieve and belie Our Ayat (proofs, evidence, verses, signs, revelations, and in the Qur'an), such are the dwellers of the Fire. They will abide therein forever" (Qur'an 2:38-39).\n\nAllah also revealed: "He said: 'Get out from this place, disgraced and expelled. If there comes to you Guidance from Me, then whoever follows My Guidance shall neither go astray, nor fall into distress and misery. And whoever turns away from My Reminder (i.e., neither believes in this Qur'an nor acts on its teachings) verily, for him is a life of hardship'" (Qur'an 20:123-124).\n\nThe earth became a place of test and struggle—a place where mankind would prove their submission through trials, not ease. Yet it was also a place of purpose: to worship Allah alone, to establish justice, to spread knowledge, and to prepare for the final return to the Hereafter.\n\nAllah informed Adam: "And We said: 'O Adam! Dwell you and your wife in the Garden and eat from where you desire, but approach not this tree or you both will be among the wrongdoers. Then Satan whispered to them, saying: 'Your Lord did not forbid you this tree save you should become angels or become of the immortals.' And he swore by Allah to them both (saying): 'Surely, I am one of the sincere well-wishers for you both.' So he brought about their fall with deception" (Qur'an 7:19-22). Yet after repentance came wisdom—and now Adam (peace be upon him) and his children would live by that wisdom.`,
			},
			{
				title: "Part 11: Adam's life on earth and continuous struggle",
				body: `Adam (peace be upon him) descended to earth with knowledge, repentance, and divine guidance. Ibn Kathir narrates: On earth, Adam faced struggle, hardship, and the constant whispers of Satan. Yet he was equipped with something invaluable—the knowledge Allah had taught him and the experience of having repented at the very beginning of his existence.\n\nAllah revealed: "And We said: 'Get down all of you from this place. Then whenever there comes to you Guidance from Me, and whoever follows My Guidance, there shall be no fear on them, nor shall they grieve. But those who disbelieve and belie Our Ayat (proofs, evidence, verses, signs, revelations, and in the Qur'an), such are the dwellers of the Fire. They will abide therein forever'" (Qur'an 2:38-39).\n\nIbn Kathir reports that Adam lived 130 years on earth after his descent, and it is mentioned that on Friday, just as mankind was created on Friday, Adam did his greatest act of worship. Allah also blessed Adam's descendants with knowledge and prophethood—the ability to know His messages and guidance.\n\nIn an authenticated narration from Abdul Razzaq: Adam was given knowledge of all crafts and skills. He knew agriculture, weaving, tailoring, and the arts. This knowledge flowed through his children, allowing them to build civilizations, establish justice, and spread monotheism across the earth.\n\nYet the struggle continued. Satan kept his promise: "I will sit in wait against them on Your Straight Path. Then I will come to them from before them and behind them, from their right and from their left" (Qur'an 7:16-17). Adam (peace be upon him) and his children had to remain vigilant, turning back to Allah again and again, repenting, and choosing obedience.`,
			},
			{
				title: "Moral lessons",
				body: ` Pride and arrogance (like Iblis's refusal to obey) lead to eternal punishment and separation from Allah's mercy.\n\n Knowledge is the greatest gift — seek it sincerely and use it to draw closer to Allah (Qur'an 2:31-33).\n\n Satan's whispers are real, but they start small. Protect yourself through constant vigilance, dhikr (remembrance), and obedience to Allah's commands (Qur'an 7:20-22).\n\n Sincere repentance immediately after sin is accepted by Allah, even if the sin seems grave (Qur'an 2:37; Qur'an 7:23).\n\n Guidance from Allah is available to everyone, but following it requires choosing obedience over desire (Qur'an 2:38-39).\n\n The struggle between good and evil is continuous in this life, but Allah never leaves us without guidance.`,
			},
			{
				title: "Practical actions for students",
				body: ` Memorize and reflect on Qur'an 2:37: "Then Adam received from his Lord Words. His Lord pardoned him. Verily He is the One Who forgives, the most Merciful." Make this your du'a when you make mistakes.\n\n Make istighfar (say "Astaghfirullah") 100 times this week, especially when you feel tempted to disobey.\n\n Identify one area where Shaytan commonly whispers to you, and create a specific protection plan (like avoiding that place, friend, or activity; or reading Qur'an, making dhikr).\n\n Practice sincere repentance: When you disobey, immediately say: "Our Lord! We have wronged ourselves. If You forgive us not, and bestow not upon us Your Mercy, we shall certainly be of the losers" (Qur'an 7:23).\n\n Write down three things you learned from Adam's (peace be upon him) obedience and three things you learned from his mistake. Use these lessons to guide your own choices this week.`,
			},
		],
		quranSurahs: [
			"Al-Baqarah",
			"Al-Araf",
			"Al-Hijr",
			"Sad",
			"Ta-Ha",
			"Al-Isra",
			"An-Nisa",
			"Ali-Imran",
			"Al-Hajj",
		],
	},

	idris: {
		shortIntro:
			"Idris (peace be upon him) is mentioned in the Qur’an as truthful and a prophet, and Allah says He raised him to a high station. Ibn Kathir includes reports about his calling people to worship, and wise sayings about gratitude, discipline, and self-accountability.",
		sections: [
			{
				title: "Part 1: Mentioned with honor in the Qur'an",
				body: `Allah praises Idris (peace be upon him) with the highest honor: "Mention in the Book (Qur'an) Idris (Enoch). Verily! He was a man of truth (and) a prophet. We raised him to a high station" (Qur'an 19:56-57).\n\nIdris (peace be upon him) holds a unique place in Islamic history. He was the first from the Children of Adam to receive prophethood after Adam and Seth (peace be upon them). He lived in the generations after Seth, serving as a lighthouse of guidance when darkness was spreading among mankind.\n\nAllah emphasized three qualities about Idris: first, that he was a "man of truth" (sidiq)—not merely someone who spoke truth, but someone whose entire life embodied truthfulness in every deed and word. Second, that he was a prophet (nabi)—chosen by Allah to carry His message. Third, that Allah "raised him to a high station"—honoring him with a position so elevated that the Qur'an leaves its exact nature to Allah's knowledge, saying "we stay with what Allah revealed." This elevation reflects Allah's complete satisfaction with Idris's faithfulness and service.`,
			},
			{
				title: "Part 2: A caller to the way of the prophets",
				body: `Idris (peace be upon him) was born and raised in Babylon following the teachings and religion of Prophet Adam (peace be upon him) and his son Seth (peace be upon him). When Allah sent him as a prophet, Idris called the people back to his forefathers' pure religion—the worship of Allah alone with no partners.\n\nBut the response was discouraging. Ibn Kathir reports that only a few listened to him, while the majority turned away. The people were attached to their worldly desires and comfortable in their ways. They resisted his call, mocked his message, and refused to accept his guidance.\n\nYet Idris (peace be upon him) did not give up. He knew the truth was from Allah, and the small number of believers did not diminish its value. His example teaches us: do not measure success by popularity. The measure of success is obedience to Allah and faithfulness to His message, regardless of how many people respond.`,
			},
			{
				title: "Part 3: Migration to Egypt for guidance",
				body: `As the corruption in Babylon intensified and the rejection intensified, Idris (peace be upon him) and his followers made a courageous decision. They left Babylon—the land of their ancestors, their homes, and their possessions—and traveled to Egypt to continue their mission of guidance.\n\nIbn Kathir records that Idris (peace be upon him) chose to migrate to a place where he could freely call people to Allah's religion without constant hostility and harm. This was a profound choice: to leave everything familiar for the sake of Allah's deen.\n\nThis migration teaches an essential principle: sometimes protecting your faith and your followers' faith requires leaving a harmful environment. If a place pulls you toward sin, weakens your worship, or surrounds you with constant hostility to Islam, then changing that environment is not weakness—it is wisdom. Allah honored Idris for making this difficult choice, for it preserved his mission and allowed him to continue guiding others.`,
			},
			{
				title: "Part 4: Teaching worship and discipline",
				body: `In Egypt, Idris (peace be upon him) carried on his mission with renewed focus. Ibn Kathir records that he taught the people certain prayers and instructed them to fast on certain days and to give a portion of their wealth to the poor.\n\nNotice that Idris (peace be upon him) did not just preach abstract ideas. He gave specific, practical instructions: "Pray these prayers." "Fast on these days." "Give this portion to the poor." His teaching was concrete and actionable.\n\nIdris understood that worship is not a fleeting emotion or occasional motivation. Worship is discipline—consistent, daily, structured discipline. You pray at specific times. You fast on specific days. You give regularly. Through this discipline, the heart grows strong. Through repetition and structure, faith becomes part of your identity.\n\nThis is Idris's legacy for us: Build your connection with Allah through disciplined worship, not temporary feelings. Establish routines of prayer, fasting, and charity. These habits transform the heart far more effectively than momentary inspiration.`,
			},
			{
				title: "Part 5: Calling people to justice and fairness",
				body: `Idris (peace be upon him) understood that true worship is inseparable from just dealings with people. Ibn Kathir records that in Egypt, Idris called people to what is just and fair. He taught them to treat each other with honesty, fairness, and compassion.\n\nThis is a critical lesson: Prophets do not merely teach rituals; they teach character transformation. Idris taught prayer and fasting, but he also taught people to correct injustice (dhulm) and to deal fairly in all their transactions. He taught them to be truthful in business, merciful to the weak, and generous to the poor.\n\nTrue religion makes you better toward others. If your Islam makes you harsh, selfish, dishonest, or cruel, then you have not truly understood the message. But if your Islam makes you honest, fair, kind, and helpful—then you have understood the heart of Idris's mission. This balance—worship of Allah combined with justice toward creation—is what Idris called people to, and it is what made his message complete.`,
			},
			{
				title: "Part 6: Gratitude through sharing blessings",
				body: `Among the profound wise sayings recorded by Ibn Kathir from Idris (peace be upon him) is: "None can show better gratitude for Allah's favors than he who shares them with others."\n\nThis wisdom cuts to the heart of what gratitude means. Gratitude is not merely words—"Alhamdulillah, thank you Allah." True gratitude is action. It is using what Allah gave you to help others. If Allah blessed you with wealth, gratitude means sharing it with those in need. If Allah gave you knowledge, gratitude means teaching others. If Allah gave you strength, gratitude means working to help the weak.\n\nIdris (peace be upon him) recognized that true shukr (gratitude) is demonstrated through generosity. When you share your blessings with others, you are acknowledging that those blessings came from Allah and that Allah's generosity deserves to be mirrored in your own generosity. This is why Idris instructed people to "give a portion of their wealth to the poor." Sharing is gratitude in action.`,
			},
			{
				title: "Part 7: Self-accountability and muhasabah",
				body: `Idris (peace be upon him) taught a powerful principle of self-discipline that Ibn Kathir recorded: "Happy is he who looks at his own deeds and appoints them as pleaders to his Lord."\n\nThis speaks to the Islamic practice of muhasabah—self-reckoning and accountability. It means regularly examining your own actions, not judging others but examining yourself. Ask yourself: "Did I act with kindness today? Did I cheat anyone? Did I help someone in need? Did I pray with presence of heart? Did I waste my time?"\n\nThe phrase "appoints them as pleaders to his Lord" is profound. It means: let your good deeds speak for you before Allah on the Day of Judgment. But this is only possible if you consciously choose to do good deeds, if you are intentional and aware of your actions.\n\nIdris teaches us that happiness and success come through muhasabah—through the discipline of examining ourselves first before blaming others, of fixing our own character before judging others' characters. This self-awareness and accountability protected Idris (peace be upon him) from pride and kept him focused on pleasing Allah alone.`,
			},
			{
				title: "Part 8: Avoiding excess and extravagance",
				body: `Idris (peace be upon him) warned his followers with wisdom: "He who indulges in excess will not benefit from it."\n\nExcess (israf) means going beyond the boundaries of need, spending more than necessary, eating more than your body needs, sleeping more than necessary, or acquiring more possessions than you can properly use. Ibn Kathir emphasizes that Idris saw excess as spiritually destructive.\n\nThink about it: if you eat to excess, you become sluggish and heavy—your body weakens and your mind clouds. If you spend to excess, you become enslaved to earning more money. If you indulge in entertainments to excess, your time vanishes and your focus scatters. If you talk to excess, you lose wisdom and gain only exhaustion.\n\nBut discipline—keeping things balanced and moderate—protects everything: your time, your health, your finances, and most importantly, your iman. When you choose restraint, you prove to yourself that you are in control, not your desires. This self-mastery is what keeps the heart strong and the connection with Allah pure.\n\nIdris (peace be upon him) lived this principle, and it made him a beacon of strength even in times of widespread corruption.`,
			},
			{
				title: "Part 9: Raised to a high station",
				body: `After a lifetime of faithful service, calling people to Allah, teaching discipline, and maintaining justice, Allah honored Idris (peace be upon him) with an incomparable honor. Allah revealed: "We raised him to a high station" (Qur'an 19:57).\n\nThe Qur'an does not specify exactly what this elevation was, and Islamic scholarship varies on this matter. Some scholars mention it in relation to the heavens based on hadith reports about Prophet Muhammad's (peace be upon him) night journey. But Allah's wisdom chooses to leave the exact nature of this station unknown to us. We know only that it was so high, so elevated, that the Qur'an explicitly mentions it as a unique honor.\n\nThis teaches a profound lesson: Allah's rewards are real and they will come, even if the world does not see them right now. Idris (peace be upon him) was mocked by most of his people. His migration was painful. His struggle was long. But Allah saw his truthfulness, his dedication, his sacrifice—and Allah rewarded him.\n\nNever think that your good deeds are wasted because no one notices them. Allah notices. Allah rewards. And the rewards of Allah are far greater and more lasting than any worldly recognition.`,
			},
			{
				title: "Part 10: Patience and steadfastness in faith",
				body: `After describing Idris's elevation, Allah groups him with the greatest of the patient ones: "And Ismail (peace be upon him) and Idris (peace be upon him) and Dhul-Kifl—each was of the patient ones. We admitted them to Our Mercy" (Qur'an 21:85-86).\n\nNote that Allah does not just say Idris was patient; Allah places him alongside Ismail (peace be upon him), who was willing to be sacrificed, and Dhul-Kifl (peace be upon him), another righteous prophet. This grouping shows Idris's rank among the greatest prophets.\n\nWhat was Idris's patience? It was enduring decades of rejection. It was migrating from his homeland when his people refused guidance. It was maintaining his discipline and teaching truth even when only a few listened. It was continuing to preach justice and worship even when the world resisted. It was living a life of worship and accountability without seeking worldly reward.\n\nIdris's truthfulness (sidq) was not merely honest speech—it was an entire life of steady, unshakeable commitment to Allah. Every day was worship. Every deed reflected his dedication. Every word aligned with his actions. This integrity, maintained through patience and hardship, is what made Idris (peace be upon him) a beacon of light in the dark ages, and it is what earned him Allah's mercy and elevation.`,
			},
			{
				title: "Moral lessons",
				body: ` Truthfulness (sidq) is the foundation of faith—it means aligning your entire life with Allah's truth, not just speaking honestly (Qur'an 19:56).\n\n Consistency in worship and discipline builds unshakeable character far more than temporary motivation (Idris's example in Egypt).\n\n Gratitude is demonstrated through action and generosity—true shukr means sharing your blessings with others (Ibn Kathir's recorded saying).\n\n Self-accountability (muhasabah) protects the heart—examine your own deeds before judging others and let your good deeds speak for you on the Day of Judgment (Ibn Kathir).\n\n Avoiding excess in speech, food, possessions, and entertainment protects your iman, health, time, and spiritual focus (Ibn Kathir).\n\n Patience in calling people to Allah's way is rewarded by Allah, even if the world does not recognize your efforts (Qur'an 21:85).\n\n True religion is the balance between worship of Allah and justice toward people—the two cannot be separated (Idris's mission).`,
			},
			{
				title: "Practical actions for students",
				body: ` **Practice muhasabah**: Every evening for one week, spend 5 minutes writing down 3 good deeds you did and 2 mistakes you made. This builds self-awareness like Idris taught.\n\n **Establish a discipline habit**: Choose one worship practice (e.g., Qur'an after Fajr, or tahajjud once weekly) and commit to it for 40 days. This mirrors Idris's emphasis on structured discipline over temporary feelings.\n\n **Share a blessing**: Identify one blessing Allah gave you (knowledge, money, skill, strength) and use it to help someone in need this week. This is gratitude in action, as Idris taught.\n\n **Reduce one excess**: Identify one thing you do in excess (screen time, snacking, talking/gossiping) and consciously reduce it for one week. Track your progress and notice how you feel—clearer, stronger, more focused. This is the benefit Idris promised.\n\n **Live the balance**: Practice one act of kindness or justice at school, home, or with friends—be honest in a transaction, stand up for someone being treated unfairly, or help someone who cannot repay you. This embodies Idris's teaching that religion is both worship AND justice.`,
			},
		],
		quranSurahs: ["Maryam", "Al-Anbiya"],
	},

	nuh: {
		shortIntro:
			"Nuh (peace be upon him) called his people to worship Allah alone for 950 years with patience. Ibn Kathir explains how idolatry began, how Nuh warned and reasoned with his people, and how Allah saved the believers and destroyed persistent shirk and ظلم.",
		sections: [
			{
				title: "Part 1: How idolatry began",
				body: `Ibn Kathir explains that Nuh’s (peace be upon him) people fell into idolatry gradually. At first they honored righteous people, then made statues “to remember them,” then later generations began worshipping those statues. The Qur’an names their idols: Wadd, Suwa‘, Yaghuth, Ya‘uq, and Nasr (Qur’an 71:23).\n\nA hadith mentioned by Ibn Kathir warns about taking graves as places of worship and placing images; the Prophet Muhammad (peace and blessings be upon him) warned against this (Sahih al-Bukhari, as cited by Ibn Kathir).\n\nLesson: shirk often begins with a “small step.” Protect tawhid by keeping worship purely for Allah.`,
			},
			{
				title: "Part 2: Nuh’s clear message",
				body: `Allah sent Nuh (peace be upon him) as a plain warner: worship Allah alone, be dutiful to Him, and obey the messenger so that Allah forgives sins and gives respite (Qur’an 71:1–4).\n\nLesson: prophets begin with tawhid and sincere repentance.`,
			},
			{
				title: "Part 3: Patience day and night",
				body: `Nuh (peace be upon him) described his struggle: “I have called my people night and day… but my call added nothing but to their flight… they thrust their fingers into their ears…” (Qur’an 71:5–7).\n\nLesson: da‘wah requires patience and good manners — even when people refuse.`,
			},
			{
				title: "Part 4: The proud leaders resist",
				body: `The leaders attacked Nuh (peace be upon him) by insulting his followers. They wanted status, not truth. Nuh refused to push believers away and reminded them he does not claim treasures or unseen knowledge (Qur’an 11:25–31).\n\nLesson: Allah honors iman, not social class.`,
			},
			{
				title: "Part 5: A very long mission",
				body: `Allah tells us Nuh (peace be upon him) stayed among his people “a thousand years less fifty years” (Qur’an 29:14).\n\nLesson: keep doing the right thing for Allah — even when results are slow.`,
			},
			{
				title: "Part 6: The du’a and Allah’s decree",
				body: `When Allah revealed that no others would believe, Nuh (peace be upon him) made du‘a against persistent disbelief (Qur’an 71:26–27).\n\nLesson: Allah’s judgment comes after proof, warning, and stubborn refusal.`,
			},
			{
				title: "Part 7: Building the ark despite mockery",
				body: `Allah commanded Nuh (peace be upon him): “Construct the ship under Our Eyes and with Our Inspiration” (Qur’an 11:37). People mocked, but he continued.\n\nLesson: obedience may look “strange” to people who do not believe — stay firm with Allah.`,
			},
			{
				title: "Part 8: The sign and boarding the ark",
				body: `Allah gave a clear sign: the oven gushed forth (Qur’an 11:40). Nuh (peace be upon him) boarded believers and took pairs of creatures. Ibn Kathir notes only a few believed.\n\nLesson: faith is not about crowd size.`,
			},
			{
				title: "Part 9: A painful lesson about family",
				body: `Nuh (peace be upon him) called to his son to embark, but his son relied on a mountain. A wave came between them and he drowned (Qur’an 11:41–43).\n\nLesson: family ties do not replace iman. Safety is in Allah’s mercy and obedience.`,
			},
			{
				title: "Part 10: The end of the flood and a new beginning",
				body: `Allah ended the flood: “O Earth! Swallow up your water, and O sky! Withhold…” (Qur’an 11:44–48). The believers disembarked with peace and blessings.\n\nLesson: after hardship, Allah can open a clean new beginning for those who obey Him.`,
			},
			{
				title: "Part 11: Nuh’s final advice",
				body: `Ibn Kathir mentions a hadith about Nuh’s (peace be upon him) final advice: he commanded tawhid and warned against shirk and pride (Sahih al-Bukhari, as cited by Ibn Kathir).\n\nLesson: end your life with the most important truth: worship Allah alone and keep your heart humble.`,
			},
			{
				title: "Moral lessons",
				body: ` Patience in da‘wah (Qur’an 29:14).\n\n Guard tawhid and avoid “small steps” toward shirk (Qur’an 71:23).\n\n Obedience during ridicule (Qur’an 11:37).\n\n Family ties do not save without iman (Qur’an 11:41–43).`,
			},
			{
				title: "Practical actions for students",
				body: ` Stay consistent on salah this week, especially when you feel lazy.\n\n Don’t join mockery — be respectful when someone reminds you of Allah.\n\n Make du’a for guidance for 3 people by name.\n\n Do one worship act secretly (to fight showing off).`,
			},
		],
		quranSurahs: ["Hud", "Nuh", "Al-Muminun", "Ash-Shuara", "Al-Araf", "Al-Ankabut"],
	},

	hud: {
		shortIntro:
			"Hud (peace be upon him) warned the people of ‘Ad against arrogance and worshipping others besides Allah. Ibn Kathir highlights Hud’s clear call to tawhid, their stubborn pride, and Allah’s severe wind that destroyed them — while Allah saved the believers.",
		sections: [
			{
				title: "Part 1: A powerful nation that became arrogant",
				body: `After the people of Nuh were destroyed, Allah created another nation called ʿĀd.\n\nThe people of ʿĀd lived in a land between Yemen and Oman. They were very strong, tall, and powerful. They built great buildings and high towers. No nation at that time was stronger than them.\n\nAllah had given them strength, wealth, and skills. But instead of being thankful, they became arrogant. They said proudly:\n\n> "Who is stronger than us?"\n\nAllah says: "And to ʿĀd, We sent their brother Hud." (Qur'an 7:65)\n\nLesson: Strength without gratitude becomes arrogance and oppression.`,
			},
			{
				title: "Part 2: Hud is sent from among them",
				body: `The people worshipped idols instead of Allah. Their rulers were unjust, and no one dared to speak against them.\n\nSo Allah sent to them Prophet Hud (peace be upon him) — one of their own people.\n\nHud said to them:\n\n> "O my people! Worship Allah. You have no god but Him."\n\nAllah tells us: "And to ʿĀd, We sent their brother Hud." (Qur'an 7:65)\n\nHud reminded them that Allah was the One who gave them strength. He warned them not to be proud and to stop worshipping idols.\n\nLesson: Allah's guidance is close — not distant or impossible.`,
			},
			{
				title: "Part 3: The core call: worship Allah alone",
				body: `But the people of ʿĀd mocked him.\n\nThey said:\n\n> "We see you as foolish."\n> "We think you are a liar."\n\nAllah says: "The chiefs of those who disbelieved among his people said: 'We surely see you in foolishness.'" (Qur'an 7:66)\n\nHud replied calmly:\n\n> "O my people! There is no foolishness in me. I am a messenger from the Lord of the worlds."\n\nAllah says: "I convey to you the messages of my Lord, and I am a trustworthy adviser to you." (Qur'an 7:68)\n\nLesson: Tawhid comes first, and sincere teachers do not sell the truth.`,
			},
			{
				title: "Part 4: A promise of mercy if they repent",
				body: `Hud warned them that if they continued to disbelieve, Allah's punishment would come.\n\nThey challenged him and said:\n\n> "Bring to us what you threaten us with, if you are truthful."\n\nHud answered:\n\n> "I put my trust in Allah, my Lord and your Lord."\n\nAllah tells us that Hud said: "So plot against me all together and give me no respite. I put my trust in Allah, my Lord and your Lord." (Qur'an 11:55–56)\n\nLesson: Repentance is a path to mercy and blessing.`,
			},
			{
				title: "Part 5: The accusations and the challenge",
				body: `Soon, Allah tested them.\n\nRain stopped falling. The land became dry. Plants died. The heat became severe.\n\nThe people of ʿĀd came to Hud and asked about the drought.\n\nHud said:\n\n> "Allah is angry with you. If you believe in Him, rain will come, and you will become stronger."\n\nBut they refused and mocked him again.\n\nLesson: When people insult you for faith, keep dignity and rely on Allah.`,
			},
			{
				title: "Part 6: Teaching the reality of the Hereafter",
				body: `Then one day, they saw huge clouds coming toward their valley.\n\nThey became happy and said:\n\n> "This is a cloud bringing us rain!"\n\nBut Allah says: "Nay, but it is the torment you were asking to be hastened — a wind wherein is a painful punishment." (Qur'an 46:24)\n\nLesson: Belief in the Hereafter helps you stay fair and patient in this life.`,
			},
			{
				title: "Part 7: Drought as a warning",
				body: `Allah sent a furious, violent wind.\n\nThe wind lasted seven nights and eight days.\n\nAllah says: "And as for ʿĀd, they were destroyed by a furious violent wind, which Allah imposed on them for seven nights and eight days." (Qur'an 69:6–7)\n\nLesson: When blessings are removed, do self-check and return to Allah.`,
			},
			{
				title: "Part 8: Mistaking punishment for a blessing",
				body: `The wind destroyed:\n\nHouses, Tents, Trees, and People.\n\nThe strong men of ʿĀd were left lying like hollow trunks of palm trees.\n\nNothing survived…\n\nLesson: Not every "exciting sign" is good. A believer stays humble and cautious.`,
			},
			{
				title: "Part 9: The violent wind and the end of ‘Ad",
				body: `Except:\n\n👉 Prophet Hud and the believers.\n\nAllah saved them all.\n\nThe land of ʿĀd became ruins — a warning for all nations after them.\n\nLesson: No empire is safe from Allah's decree when ظلم becomes stubborn defiance.`,
			},
			{
				title: "Part 10: The believers are saved",
				body: `Allah says: "And We saved those who believed." (Qur'an 11:58)\n\nIbn Kathir describes how the believers were protected from the violent wind and lived afterward in worship and peace.\n\nTheir faith was their shield — not their buildings or their strength.\n\nLesson: Allah's protection is for faith and obedience, not for status or buildings.`,
			},
			{
				title: "Moral lessons",
				body: ` Strength and wealth can lead to arrogance — if people forget Allah.\n\n Pride blinds the heart — the people of ʿĀd rejected the truth because of pride.\n\n Allah gives warnings before punishment — Hud warned them many times.\n\n Mocking prophets leads to destruction — they laughed at Hud, but Allah destroyed them.\n\n Allah always saves the believers — true strength is obedience to Allah.`,
			},
			{
				title: "Practical actions for students",
				body: ` Memorize and reflect on Qur'an 7:65-68 about Hud's message.\n\n Thank Allah daily for strength and health — don't be arrogant.\n\n Make istighfar 50 times today and ask for humility.\n\n Share the story of ʿĀd with family or friends as a warning against pride.`,
			},
		],
		quranSurahs: ["Hud", "Al-Araf", "Al-Ahqaf", "Al-Haqqah", "Al-Muminun"],
	},

	salih: {
		shortIntro:
			"Salih (peace be upon him) called Thamud to worship Allah alone. Ibn Kathir explains the miracle of the she‑camel, the covenant not to harm it, the people’s stubbornness, and the punishment that followed — teaching students to respect Allah’s signs and stop wrongdoing early.",
		sections: [
			{
				title: "Part 1: A strong nation after ‘Ad",
				body: `After the people of ʿĀd were destroyed, Allah created another nation called Thamūd.\n\nThe people of Thamūd lived in rocky mountains. They were very skilled builders. They carved houses inside the rocks and felt completely safe.\n\nAllah gave them strength, skills, and security. But they became arrogant and ungrateful. They worshipped idols instead of Allah.\n\nLesson: Comfort can become a test. If you forget Allah, blessings can turn into arrogance and oppression.`,
			},
			{
				title: "Part 2: Salih’s message",
				body: `So Allah sent them a prophet from among themselves — Prophet Ṣāliḥ (peace be upon him).\n\nAllah says: "And to Thamūd, We sent their brother Ṣāliḥ." (Qur'an 7:73)\n\nṢāliḥ said to his people:\n\n> "O my people! Worship Allah. You have no god but Him."\n\nHe reminded them that Allah created them and gave them homes in the mountains. He warned them not to spread corruption on the earth.\n\nLesson: The message of every prophet begins with tawhid — worship Allah alone.`,
			},
			{
				title: "Part 3: They demand a miracle",
				body: `But the leaders of Thamūd mocked him and said:\n\n> "You are bewitched."\n> "We do not believe what you say."\n\nThey challenged Ṣāliḥ and demanded a miracle. They said:\n\n> "Bring us a sign, if you are truthful."\n\nAllah answered their challenge. By Allah's command, a she-camel came out of a rock.\n\nLesson: Demanding signs increases responsibility. If a person is proud, even clear signs may not help.`,
			},
			{
				title: "Part 4: The she-camel as a clear sign",
				body: `Ṣāliḥ said:\n\n> "This is the she-camel of Allah. Let her eat from Allah's land, and do not harm her."\n\nAllah says: "This is the she-camel of Allah, a sign for you. So leave her to eat in Allah's land, and do not touch her with harm." (Qur'an 7:73)\n\nṢāliḥ warned them clearly:\n\n> "She will drink on one day, and you will drink on another."\n\nLesson: When Allah shows a sign, the correct response is humility and obedience.`,
			},
			{
				title: "Part 5: A test with rules",
				body: `For a time, they obeyed.\n\nBut later, the arrogant leaders planned evil. They killed the she-camel and felt proud of what they had done.\n\nThey said to Ṣāliḥ:\n\n> "Bring us the punishment, if you are truthful."\n\nLesson: Faith is proven by obeying limits, not just being amazed by miracles.`,
			},
			{
				title: "Part 6: Complaints and stubbornness",
				body: `Ṣāliḥ replied:\n\n> "Enjoy yourselves in your homes for three days. This is a promise that will not be broken."\n\nAllah says: "So enjoy yourselves in your homes for three days. That is a promise not to be denied." (Qur'an 11:65)\n\nLesson: When a reminder feels "annoying," check your heart and return to Allah.`,
			},
			{
				title: "Part 7: The conspiracy to kill the sign",
				body: `After three days, Allah's punishment came.\n\nA terrible cry and earthquake struck them.\n\nAllah says: "So the earthquake seized them, and they lay dead in their homes." (Qur'an 7:78)\n\nThe mighty people of Thamūd were destroyed. Their rock houses could not protect them.\n\nLesson: Communities fall when wrongdoing becomes celebrated.`,
			},
			{
				title: "Part 8: A final warning",
				body: `Only Prophet Ṣāliḥ and the believers were saved by Allah.\n\nTheir faith was their shield — not their rock houses or their skills as builders.\n\nAllah always protects those who believe and obey Him, even when destruction comes to those around them.\n\nLesson: Allah gives chances to repent. Do not waste them.`,
			},
			{
				title: "Part 9: Plotting against the prophet",
				body: `The arrogant leaders felt confident in their power and their rock houses. They thought their buildings would protect them from Allah's punishment.\n\nBut they did not understand that no material thing — not strength, not skills, not buildings, not anything — can protect a person from Allah's decree.\n\nLesson: Allah protects believers in ways we do not expect.`,
			},
			{
				title: "Part 10: The punishment and the lesson",
				body: `Skills and technology cannot protect people from Allah. The people of Thamūd had knowledge of architecture and engineering. They could carve houses from solid rock. But when Allah sent His punishment, none of their skills saved them.\n\nTheir arrogance led them to reject Ṣāliḥ's warning. They harmed Allah's sign (the she-camel) and celebrated their wrongdoing. They chose destruction over obedience.\n\nLesson: Allah's justice is real. Delaying repentance is dangerous. Learn from history before repeating the sin.`,
			},
			{
				title: "Moral lessons",
				body: ` Skills and technology cannot protect people from Allah.\n\n Arrogance leads to destruction.\n\n Miracles do not benefit those who reject truth.\n\n Harming Allah's signs brings severe punishment.\n\n Allah always saves the believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Thank Allah for the skills and talents He gave you.\n\n Never feel arrogant about what you know or what you can do.\n\n Read Qur'an 7:73-78 about the she-camel and the punishment.\n\n List one way you can be humble this week instead of proud.`,
			},
		],
		quranSurahs: ["Hud", "Al-Araf", "An-Naml", "Al-Hijr", "Al-Isra", "Ash-Shams"],
	},

	ibrahim: {
		shortIntro:
			"Ibrahim (peace be upon him) was born among idol worshippers. Ibn Kathir describes his deep thinking, breaking the idols, the fire test, leaving Hagar and Ismail in the desert, and the ultimate test of sacrificing his son. Allah made him a friend and leader for mankind.",
		sections: [
			{
				title: "Part 1: A people lost in idol worship",
				body: `Prophet Ibrahim (peace be upon him) was born among people who worshipped idols.\n\nHis own father made idols. His people believed the idols could help them, protect them, and bring them good.\n\nBut Ibrahim thought deeply. He asked his people:\n\n> "Why do you worship what cannot hear, see, or help you?"\n\nThey became angry and refused to listen.\n\nLesson: True faith comes from thinking and questioning falsehood.`,
			},
			{
				title: "Part 2: Breaking the idols",
				body: `Ibrahim wanted to show them the truth.\n\nOne day, when the people left for a festival, Ibrahim went to the idol temple. He broke all the idols except the largest one.\n\nWhen the people returned, they were shocked. They shouted:\n\n> "Who has done this to our gods?"\n\nThey said:\n\n> "We heard a young man called Ibrahim."\n\nLesson: Obedience to Allah comes before people's approval.`,
			},
			{
				title: "Part 3: Confronting the truth",
				body: `They brought him and asked:\n\n> "Did you do this to our gods?"\n\nIbrahim answered calmly:\n\n> "Ask the biggest idol, if it can speak."\n\nThe people realized the truth — but their pride stopped them from believing.\n\nLesson: When you speak truth, let people's pride be their choice, not yours.`,
			},
			{
				title: "Part 4: The fire test",
				body: `They said:\n\n> "Burn him!"\n\nThey built a huge fire and threw Ibrahim into it.\n\nBut Allah protected His prophet.\n\nAllah says: "We said: O fire, be coolness and safety for Ibrahim." (Qur'an 21:69)\n\nThe fire did not harm him.\n\nLesson: Allah protects those who trust Him.`,
			},
			{
				title: "Part 5: Leaving Hagar and Ismail",
				body: `Instead of believing, the people rejected the truth again.\n\nLater, Allah tested Ibrahim with a great test. Allah commanded him to leave his wife Hagar and his son Ismail in a dry valley with no water.\n\nIbrahim obeyed Allah without hesitation.\n\nHe said:\n\n> "My Lord, I have left my family in a barren land so that they may establish prayer."\n\nLesson: Complete obedience comes before comfort.`,
			},
			{
				title: "Part 6: The well of Zamzam",
				body: `In that empty valley, Hagar searched desperately for water. She ran between the hills of Safa and Marwah.\n\nAllah provided water for them through the well of Zamzam.\n\nThis well became a source of blessing for all pilgrims for thousands of years.\n\nFrom this barren valley, a great city grew: Mecca. The house of Allah was built there.\n\nLesson: Great rewards come after great tests.`,
			},
			{
				title: "Part 7: The dream of sacrifice",
				body: `Years later, Allah tested Ibrahim again.\n\nHe saw in a dream that he must sacrifice his son.\n\nIbrahim told Ismail, and his son replied:\n\n> "O my father, do what Allah has commanded you."\n\nBoth father and son were ready to obey Allah, even in this hardest of tests.\n\nLesson: A believer must be ready for any test.`,
			},
			{
				title: "Part 8: The ultimate submission",
				body: `When Ibrahim was about to obey, Allah stopped him.\n\nAllah accepted his obedience and sent a ram instead.\n\nAllah says: "Indeed, this was a clear test." (Qur'an 37:106)\n\nIbrahim did not hesitate. He did not ask why. He simply obeyed.\n\nLesson: Complete submission to Allah leads to honor.`,
			},
			{
				title: "Part 9: Ibrahim, the leader of mankind",
				body: `Ibrahim passed every test with complete obedience.\n\nAllah made him a leader for mankind.\n\nAllah says: "Indeed, I will make you an Imam (leader) for the people." (Qur'an 2:124)\n\nMillions of people follow his way even today. His example teaches obedience, faith, and sacrifice.\n\nLesson: Allah honors those who honor Him.`,
			},
			{
				title: "Part 10: The legacy of obedience",
				body: `Ibrahim's life shows the perfect example of a Muslim: one who submits completely to Allah.\n\nHe did not compromise his faith for comfort, family, or safety. He trusted Allah in every test.\n\nThe Hajj (pilgrimage) is performed every year as a remembrance of Ibrahim's obedience and Hagar's patience.\n\nLesson: True success is to submit fully to Allah, like Prophet Ibrahim.`,
			},
			{
				title: "Moral lessons",
				body: ` True faith comes from thinking and questioning falsehood.\n\n Obedience to Allah comes before people's approval.\n\n Allah protects those who trust Him.\n\n Great rewards come after great tests.\n\n Complete submission to Allah leads to honor.`,
			},
			{
				title: "Practical actions for students",
				body: ` Think deeply about your beliefs — don't just follow others.\n\n Do one thing this week that shows obedience to Allah, even if others don't understand.\n\n Read Qur'an 21:69 and 37:106 and reflect on Ibrahim's patience.\n\n Visit or imagine a place where you can see Allah's power and provision (like nature or mountains).`,
			},
		],
		quranSurahs: ["Ibrahim", "As-Saffat", "Al-Hajj", "Al-Anbiya", "Al-Baqarah"],
	},

	lut: {
		shortIntro:
			"Lut (peace be upon him) was sent to warn the people of Sodom against their unprecedented immorality. Ibn Kathir describes their open sins, the rejection of Lut's message, his wife's betrayal, the arrival of angels, and Allah's punishment that destroyed them all except the believers.",
		sections: [
			{
				title: "Part 1: A nation drowning in sin",
				body: `Prophet Lut (peace be upon him) was sent by Allah to the people of Sodom.\n\nHis people committed evil acts that no nation before them had ever done. They used to commit immorality openly, men went to men instead of women, they attacked travelers, and they did evil acts in their gatherings. They felt proud of their sins.\n\nLesson: Open immorality brings Allah's punishment.`,
			},
			{
				title: "Part 2: Lut's clear warning",
				body: `Allah sent Prophet Lut to warn them.\n\nLut stood before his people and said:\n\n> "Do you commit such immorality as no one among the worlds has done before you?" (Qur'an 7:80)\n\nHe warned them clearly about their actions and said:\n\n> "Indeed, you approach men with desire instead of women. Rather, you are a transgressing people." (Qur'an 7:81)\n\nLesson: A prophet must speak truth even when rejected.`,
			},
			{
				title: "Part 3: The call to purity",
				body: `Lut called them to purity, obedience, and fear of Allah.\n\nBut the people mocked him. They replied with arrogance and said:\n\n> "Bring us the punishment of Allah, if you are of the truthful." (Qur'an 29:29)\n\nThey also said:\n\n> "Expel the family of Lut from your city. Indeed, they are people who want to remain pure." (Qur'an 27:56)\n\nLesson: Mocking truth hardens the heart.`,
			},
			{
				title: "Part 4: Almost no one believed",
				body: `Almost no one believed in Lut.\n\nThousands of people in the city heard his message, yet only a few believers followed him. Most chose their desires over truth.\n\nLut's family was split. Some believed, and some rejected the message.\n\nEven inside his own house, Lut faced rejection.\n\nLesson: Truth does not need numbers — it needs courage.`,
			},
			{
				title: "Part 5: The wife's betrayal",
				body: `The wife of Prophet Lut did not believe.\n\nShe did not commit the immoral act herself, but she rejected the message, supported her sinful people, and used to inform them when guests came to Lut's house.\n\nAllah gives her as an example and says: "Allah sets forth an example for those who disbelieve: the wife of Nuh and the wife of Lut." (Qur'an 66:10)\n\nLesson: Supporting sin is betrayal, even if you do not commit it yourself.`,
			},
			{
				title: "Part 6: The test with the angels",
				body: `One day, angels came to Lut in the form of handsome men.\n\nLut became very worried and said: "This is a difficult day."\n\nHe took the guests quietly into his house. But his wife saw them and went out to inform the people.\n\nSoon, the people rushed to Lut's house with evil intentions.\n\nLesson: Family ties do not save without faith.`,
			},
			{
				title: "Part 7: Lut pleads at the door",
				body: `Lut stood at the door and pleaded with them.\n\nHe said:\n\n> "O my people, fear Allah and do not disgrace me concerning my guests." (Qur'an 11:78)\n\nBut they refused and pushed forward.\n\nAt that moment, the guests revealed the truth: "O Lut, we are messengers of your Lord."\n\nThe angels struck the people with blindness, and they could not reach the door.\n\nLesson: Allah's protection comes at the right moment for believers.`,
			},
			{
				title: "Part 8: The command to leave",
				body: `The angels then commanded Lut:\n\nLeave the city at night. Take your family except your wife. Do not look back.\n\nLut obeyed without hesitation. His daughters who believed followed him. But his wife stayed behind because she did not believe.\n\nEvery moment was critical. Every step away from the city was a step toward safety.\n\nLesson: Obedience must be immediate and complete.`,
			},
			{
				title: "Part 9: The destruction of Sodom",
				body: `When Allah's command came:\n\nThe city was turned upside down. Stones of baked clay rained down. The people were completely destroyed.\n\nAllah says: "So when Our command came, We turned the town upside down and rained upon them stones of baked clay." (Qur'an 11:82)\n\nThe wife of Lut was destroyed with the disbelievers because she betrayed the message and sided with evil.\n\nLesson: Allah's punishment is just and certain.`,
			},
			{
				title: "Part 10: Only the believers were saved",
				body: `Only Prophet Lut and the believers were saved.\n\nAllah rescued them from the destruction. They escaped the punishment because they believed and obeyed.\n\nThis story became a warning sign for all future generations. The ruins of Sodom serve as proof of what happens to those who persist in sin and reject Allah's prophets.\n\nLesson: Allah always saves the obedient believers.`,
			},
			{
				title: "Moral lessons",
				body: ` Open immorality brings Allah's punishment.\n\n Mocking truth hardens the heart.\n\n Supporting sin is betrayal.\n\n Family ties do not save without faith.\n\n Allah always saves the obedient believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Stay away from people and places where sin is celebrated openly.\n\n Speak truth gently, even when people mock you.\n\n Never support wrong actions, even to protect family.\n\n Read Qur'an 7:80-84 and 11:77-82 about Lut's story.\n\n Commit today to purity in your words, actions, and thoughts.`,
			},
		],
		quranSurahs: ["Hud", "Al-Araf", "An-Naml", "Al-Ankabut", "At-Tahrim", "As-Shu'ara"],
	},

	shuayb: {
		shortIntro:
			"Shuayb (peace be upon him) was sent to warn the people of Madyan against their dishonesty in trade and corruption. Ibn Kathir describes their cheating in weights and measures, Shuayb's clear call to honesty, their mockery and threats, and the earthquake that destroyed them while saving the believers.",
		sections: [
			{
				title: "Part 1: A nation of dishonest traders",
				body: `After the people of Lut were destroyed, Allah sent Prophet Shuayb (peace be upon him) to the people of Madyan.\n\nThe people of Madyan were traders. But they were dishonest. They used to cheat in weights and measures, give less than what was due, steal people's wealth, spread corruption on the land, and block people from the path of Allah.\n\nLesson: Dishonesty destroys societies.`,
			},
			{
				title: "Part 2: The call to worship Allah alone",
				body: `Allah sent Shuayb to warn them.\n\nShuayb stood before his people and said:\n\n> "O my people! Worship Allah. You have no god but Him." (Qur'an 7:85)\n\nHe warned them clearly about their sins and said:\n\n> "Give full measure and weight, and do not reduce the people's things, and do not spread corruption on the earth after it has been set right." (Qur'an 7:85)\n\nLesson: Honest trade is worship to Allah.`,
			},
			{
				title: "Part 3: Shuayb reminds them of blessing",
				body: `Shuayb reminded them that honesty brings blessing and that Allah sees all actions.\n\nHe stood among them with patience, despite their wealth and power. He knew that no amount of money could buy true success without honesty.\n\nEvery word he spoke was truth. Every action he took was an example.\n\nLesson: Honesty is part of worship.`,
			},
			{
				title: "Part 4: The people mock him",
				body: `But the people mocked him.\n\nThey said:\n\n> "Does your prayer command you that we should leave what our fathers worship or stop doing what we want with our wealth?" (Qur'an 11:87)\n\nThey could not imagine giving up their dishonest ways. Cheating had become their normal way of life.\n\nLesson: When greed blinds the heart, truth becomes strange.`,
			},
			{
				title: "Part 5: Threats and intimidation",
				body: `They threatened Shuayb and said:\n\n> "We will surely expel you, O Shuayb, and those who believe with you from our city, unless you return to our religion." (Qur'an 7:88)\n\nBut Shuayb replied firmly and truthfully:\n\n> "Even if we dislike it? We would be inventing a lie against Allah if we returned to your religion after Allah has saved us from it." (Qur'an 7:88)\n\nLesson: Threatening truth does not stop punishment.`,
			},
			{
				title: "Part 6: The warning from history",
				body: `He warned them again and said:\n\n> "O my people, do not let hatred of me cause you to suffer the same fate as the people of Nuh, Hud, or Salih." (Qur'an 11:89)\n\nShuayb gave them examples of nations that came before them. Each one had rejected their prophet. Each one had been destroyed.\n\nBut the people of Madyan refused to learn from history.\n\nLesson: Rejecting warnings leads to the same punishment.`,
			},
			{
				title: "Part 7: The final challenge",
				body: `But the people refused to listen.\n\nThey challenged him and said:\n\n> "Bring upon us what you threaten us with, if you are one of the truthful."\n\nThey did not believe Allah's punishment would come. They felt safe in their wealth and numbers. They felt their dishonest wealth could protect them.\n\nThey were completely wrong.\n\nLesson: Arrogance is the step before destruction.`,
			},
			{
				title: "Part 8: The earthquake strikes",
				body: `Then Allah's punishment came.\n\nA mighty earthquake and terrible cry struck them.\n\nAllah says: "So the earthquake seized them, and they lay dead in their homes." (Qur'an 7:91)\n\nThe powerful traders of Madyan were destroyed. All their wealth could not protect them. All their numbers could not save them.\n\nLesson: Cheating wealth brings Allah's anger.`,
			},
			{
				title: "Part 9: The land becomes ruins",
				body: `The city of Madyan became ruins. Buildings collapsed. Bodies lay in the streets. Silence replaced the noise of the marketplace.\n\nThe place where dishonest traders once boasted of their wealth became a dead city.\n\nAllah preserved this as a sign for all future generations, a proof that dishonesty and corruption lead to destruction.\n\nLesson: Allah's signs are preserved for those who think.`,
			},
			{
				title: "Part 10: Only the believers were saved",
				body: `Only Prophet Shuayb and the believers were saved by Allah.\n\nThey escaped the destruction because they believed in Shuayb's message and obeyed Allah.\n\nThis is the pattern in all the stories: those who mock and reject are destroyed, but those who believe and obey are saved.\n\nLesson: Allah always saves the believers.`,
			},
			{
				title: "Moral lessons",
				body: ` Dishonesty destroys societies.\n\n Cheating wealth brings Allah's anger.\n\n Threatening truth does not stop punishment.\n\n Honesty is part of worship.\n\n Allah always saves the believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Be honest in all transactions this week, no matter how small.\n\n Return any extra money or items you received by mistake.\n\n Read Qur'an 7:85-91 and write one lesson about honesty.\n\n Commit to speaking truth even when it costs you something.`,
			},
		],
		quranSurahs: ["Hud", "Al-Araf", "As-Shu'ara", "Al-Ankabut"],
	},

	yusuf: {
		shortIntro:
			"Yusuf (peace be upon him), son of Prophet Yaaqub, was blessed with beauty and wisdom. Ibn Kathir describes his dream, his brothers' jealousy, the well, Egypt, the trial with the wife of al-Aziz, false imprisonment, interpreting dreams, becoming minister, and ultimate forgiveness—showing how patience and fear of Allah lead to honor.",
		sections: [
			{
				title: "Part 1: The dream and the jealousy",
				body: `Prophet Yusuf (peace be upon him) was the son of Prophet Yaaqub (peace be upon him).\n\nAllah blessed Yusuf with beauty, good character, and wisdom.\n\nWhen Yusuf was still a child, he saw a dream. He said to his father:\n\n> "O my father, indeed I saw eleven stars and the sun and the moon; I saw them prostrating to me." (Qur'an 12:4)\n\nYaaqub understood that Allah had chosen Yusuf for something great. But he warned him:\n\n> "O my son, do not tell your brothers about your dream, lest they plan against you." (Qur'an 12:5)\n\nLesson: Jealousy leads to injustice.`,
			},
			{
				title: "Part 2: The brothers' plan",
				body: `Yusuf's brothers became jealous because their father loved him greatly.\n\nThey said: "Yusuf and his brother are more beloved to our father than us."\n\nThey planned evil. They took Yusuf away and threw him into a deep well. They returned to their father crying and lied, saying a wolf had eaten him.\n\nBut Allah protected Yusuf. A group of travelers passed by, found him in the well, and sold him in Egypt as a slave.\n\nLesson: Patience brings honor.`,
			},
			{
				title: "Part 3: Yusuf in the house of al-Aziz",
				body: `Yusuf was bought by al-Aziz, the minister of Egypt.\n\nHe said to his wife: "Take good care of him. He may benefit us."\n\nYusuf grew up in that house, and Allah gave him wisdom and knowledge. He was honest, faithful, and always did the right thing.\n\nAllah was with him because Yusuf trusted Allah in every situation.\n\nLesson: Allah raises those who are grateful and obedient.`,
			},
			{
				title: "Part 4: The trial with the wife of al-Aziz",
				body: `The wife of al-Aziz desired Yusuf.\n\nOne day, she locked all the doors and called him to sin.\n\nAllah says: "And she, in whose house he was, tried to seduce him. She locked the doors and said: 'Come to me.'" (Qur'an 12:23)\n\nYusuf feared Allah and replied:\n\n> "I seek refuge in Allah! Indeed, my master has treated me well. Indeed, wrongdoers will never succeed." (Qur'an 12:23)\n\nLesson: Fear of Allah protects from sin.`,
			},
			{
				title: "Part 5: Running to escape",
				body: `She continued to insist.\n\nAllah says: "She desired him, and he would have desired her had he not seen the proof of his Lord." (Qur'an 12:24)\n\nYusuf ran toward the door, trying to escape.\n\nShe chased him and tore his shirt from behind.\n\nAt that moment, al-Aziz entered. She lied and accused Yusuf, but a witness observed what really happened.\n\nLesson: Allah's help comes to the obedient.`,
			},
			{
				title: "Part 6: The proof of innocence",
				body: `A witness said: If the shirt is torn from the front, she is truthful. If torn from the back, Yusuf is truthful.\n\nThe shirt was torn from the back. Yusuf was proven innocent.\n\nAl-Aziz realized his wife's lie. She was caught in her deception. But instead of accepting the truth, she became more insistent in her sin.\n\nYusuf remained calm, humble, and patient despite being falsely accused.\n\nLesson: Truth always becomes clear.`,
			},
			{
				title: "Part 7: The women of the city",
				body: `Women in the city gossiped about the wife of al-Aziz.\n\nShe invited them, gave them knives, and called Yusuf to appear.\n\nWhen they saw him, they were amazed and cut their hands by accident.\n\nThey said: "This is not a human. This is a noble angel!" (Qur'an 12:31)\n\nShe admitted: "I tried to seduce him, but he refused."\n\nLesson: Righteousness creates respect, even in a sinful place.`,
			},
			{
				title: "Part 8: Prison of innocence",
				body: `She threatened Yusuf with prison if he did not obey her.\n\nYusuf turned to Allah and said:\n\n> "My Lord, prison is more beloved to me than what they invite me to." (Qur'an 12:33)\n\nAllah answered his dua. Yusuf was sent to prison, though he was innocent.\n\nIn prison, he continued calling people to Allah. He interpreted dreams for fellow prisoners.\n\nAllah gave him the gift of interpreting dreams.\n\nLesson: Allah turns hardship into success.`,
			},
			{
				title: "Part 9: The king's dream",
				body: `Years later, the king of Egypt saw a dream that no one could explain.\n\nYusuf was brought from prison. He explained the dream truthfully.\n\nBut Yusuf refused to leave prison until his innocence was declared publicly.\n\nThe king honored Yusuf and made him in charge of the storehouses of Egypt.\n\nAllah says: "Thus did We establish Yusuf in the land." (Qur'an 12:56)\n\nLesson: Patience and integrity lead to true honor.`,
			},
			{
				title: "Part 10: Forgiveness and fulfillment",
				body: `Yusuf's brothers came to Egypt for food during famine.\n\nHe recognized them, but they did not recognize him. Later, he revealed the truth and forgave them.\n\nHe said:\n\n> "No blame will there be upon you today. Allah will forgive you." (Qur'an 12:92)\n\nHis parents and brothers came and bowed to him in respect. Yusuf's dream came true, exactly as Allah had promised.\n\nLesson: Forgiveness is the way of prophets.`,
			},
			{
				title: "Moral lessons",
				body: ` Jealousy leads to injustice.\n\n Patience brings honor.\n\n Fear of Allah protects from sin.\n\n Allah turns hardship into success.\n\n Forgiveness is the way of prophets.`,
			},
			{
				title: "Practical actions for students",
				body: ` Never speak negatively about your siblings out of jealousy.\n\n When tempted to do wrong, remember Allah and seek His protection.\n\n Read Qur'an 12 (Surah Yusuf) — the entire chapter is his story.\n\n Forgive someone who wronged you, just as Yusuf forgave his brothers.`,
			},
		],
		quranSurahs: ["Yusuf", "Al-Baqarah", "At-Tawbah"],
	},
	ayyub: {
		shortIntro: "The story of Prophet Ayyub, who was tested with loss of wealth, children, and health, yet remained patient and faithful. Allah restored everything to him and praised him as an excellent servant.",
		sections: [
			{
				title: "Part 1: A righteous servant blessed by Allah",
				body: `Prophet Ayyub was a righteous servant of Allah.\n\nAllah blessed Ayyub with great wealth, many children, good health, and strong faith.\n\nAyyub was thankful to Allah in all situations. He worshipped Allah sincerely and helped the poor with his blessings.`,
			},
			{
				title: "Part 2: The first test - loss of wealth",
				body: `Allah tested Prophet Ayyub with severe trials.\n\nFirst, Ayyub lost his wealth. All his possessions and riches disappeared.\n\nDespite this loss, Ayyub remained patient and did not lose faith in Allah.`,
			},
			{
				title: "Part 3: The second test - loss of children",
				body: `Then, Allah tested him by taking away all his children.\n\nThis was a deep grief for Ayyub, but he remained steadfast in his faith and trust in Allah.\n\nHe knew that everything belongs to Allah and returns to Allah.`,
			},
			{
				title: "Part 4: The third test - a long and painful illness",
				body: `After losing his wealth and children, Allah tested Ayyub with a severe and prolonged illness.\n\nHis body became weak and diseased. People avoided him because of his illness.\n\nYet Ayyub continued to remember Allah and maintain his patience.`,
			},
			{
				title: "Part 5: His faithful wife and continued remembrance",
				body: `During all his suffering, only Ayyub's faithful wife stayed with him and served him patiently.\n\nShe cared for him with compassion despite their poverty and his illness.\n\nDespite all his trials, Ayyub never complained about Allah. He remained patient and continued remembering Allah with gratitude.`,
			},
			{
				title: "Part 6: The humble duʿāʾ without complaint",
				body: `After a very long time of suffering, Ayyub turned to Allah with humility and sincerity.\n\nHe did not complain about his situation — he only asked Allah for mercy.\n\nAllah tells us his duʿāʾ: "Indeed, adversity has touched me, and You are the Most Merciful of the merciful." (Qur'an 21:83)\n\nHis supplication was filled with hope and trust in Allah's mercy.`,
			},
			{
				title: "Part 7: Allah's command - strike the ground",
				body: `Allah immediately answered Ayyub's humble duʿāʾ.\n\nAllah commanded: "Strike the ground with your foot." (Qur'an 38:42)\n\nWhen Ayyub struck the ground, a spring of water appeared.\n\nAllah ordered him to wash from it and drink from it for healing.`,
			},
			{
				title: "Part 8: Complete restoration of health and strength",
				body: `By Allah's command, Ayyub's health returned immediately.\n\nHis strength returned, and his youth returned. Allah completely healed him from the disease that had afflicted him for so long.\n\nAllah says: "So We answered him and removed what afflicted him of harm, and We restored to him his family and the like thereof with them." (Qur'an 21:84)\n\nThis was a complete miracle of Allah's mercy.`,
			},
			{
				title: "Part 9: Restoration of family and blessings",
				body: `Not only did Allah restore Ayyub's health, but He also restored his family.\n\nAllah gave him back his children and blessed him with even more children after that.\n\nAllah's mercy was complete — He restored everything that had been taken away and gave him additional blessings as a sign of His love for His patient servant.`,
			},
			{
				title: "Part 10: The oath and Allah's mercy through ease",
				body: `During his illness, Ayyub made an oath to discipline his wife gently.\n\nBut after Allah cured him, Allah showed him mercy and ease in fulfilling this oath.\n\nAllah commanded him to take a bundle of grass and strike lightly once so he would not break his oath.\n\nAllah praised Ayyub and said: "Indeed, We found him patient. An excellent servant! Indeed, he was constantly returning to Allah." (Qur'an 38:44)\n\nAyyub was a model of patience, faith, and obedience.`,
			},
			{
				title: "Moral lessons",
				body: ` Patience during hardship is beloved to Allah.\n\n True faith does not disappear during suffering.\n\n Complaining to Allah in duʿāʾ is different from complaining about Allah.\n\n Allah's mercy comes after patience and trust.\n\n Hardship is a test, not a punishment, for believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Remain patient when facing difficulties in school or life.\n\n Remember Allah and make duʿāʾ when you face trials.\n\n Do not avoid visiting or helping sick people.\n\n Have faith that Allah's mercy will follow your patience, just as it did for Prophet Ayyub.`,
			},
		],
		quranSurahs: ["Ayyub (Sura 38)", "Al-Anbiya (Sura 21)"],
	},
	"dhul-kifl": {
		shortIntro: "The story of Prophet Dhul-Kifl, a righteous servant among the Children of Israel, known for his patience, justice, and self-control. He was chosen to lead with wisdom and held true to his promises despite all tests.",
		sections: [
			{
				title: "Part 1: A righteous servant among Israel",
				body: `Prophet Dhul-Kifl was a righteous servant of Allah.\n\nHe lived among the people of Israel and was known for his patience, justice, and strong self-control.\n\nHe was a person of great character and faith in Allah.`,
			},
			{
				title: "Part 2: The old prophet's search for a successor",
				body: `After a prophet from the Children of Israel grew old, he wanted someone to take responsibility for the people.\n\nHe asked the people: "Who will take my place, judge between the people with justice, fast during the day, pray at night, and never become angry?"\n\nThis was a great responsibility that required someone of exceptional character and faith.`,
			},
			{
				title: "Part 3: Many fail the test",
				body: `Many people from the community tried to accept this responsibility.\n\nBut they all failed. No one had the strength, patience, and self-control needed for this important role.\n\nThey found it impossible to meet all these requirements — justice, fasting, night prayer, and controlling anger — all at the same time.`,
			},
			{
				title: "Part 4: Dhul-Kifl accepts the responsibility",
				body: `When it seemed no one could accept this burden, Dhul-Kifl stepped forward.\n\nHe said he would take this responsibility and fulfill it completely.\n\nUnlike others, Dhul-Kifl had true faith, deep patience, and complete trust in Allah's help.`,
			},
			{
				title: "Part 5: He judges with perfect justice",
				body: `Dhul-Kifl became the leader and judge of his people.\n\nHe judged fairly between them, never favoring the rich over the poor, and never letting personal feelings affect his decisions.\n\nEvery judgment he made was based on truth, justice, and the law of Allah.`,
			},
			{
				title: "Part 6: He fasts and prays throughout his life",
				body: `Despite his responsibility as a leader, Dhul-Kifl fasted during the day without fail.\n\nAt night, instead of resting, he stood in prayer to Allah, worshipping and seeking Allah's guidance and strength.\n\nHe maintained this discipline throughout his life, year after year, never missing his worship.`,
			},
			{
				title: "Part 7: The test of anger - Shaytan's provocation",
				body: `One day, Shaytan tried to test Dhul-Kifl's patience and self-control.\n\nShaytan came to him repeatedly at difficult times, trying to provoke his anger and make him lose control.\n\nShaytan wanted to make him break his promise and abandon his commitment to never become angry.`,
			},
			{
				title: "Part 8: Dhul-Kifl's perfect patience",
				body: `But Dhul-Kifl remained completely calm and patient.\n\nNo matter what Shaytan did or how many times he tried, Dhul-Kifl never allowed anger to control him.\n\nHe controlled every emotion, every thought, and every reaction. His faith in Allah gave him the strength to overcome all of Shaytan's attempts.`,
			},
			{
				title: "Part 9: Allah's praise for his excellence",
				body: `Because of his perfect patience, righteousness, and self-control, Allah honored Dhul-Kifl with His praise.\n\nAllah says: "And Ismail, Idris, and Dhul-Kifl — all were among the patient." (Qur'an 21:85)\n\nAllah also says: "And remember Ismail, al-Yasa, and Dhul-Kifl, and all are among the excellent." (Qur'an 38:48)\n\nAllah praised him for his patience, self-control, keeping promises, and justice.`,
			},
			{
				title: "Part 10: His legacy - consistency in worship",
				body: `Dhul-Kifl's life teaches us that true greatness comes from keeping our promises to Allah.\n\nHe showed that leadership means serving others with justice, and that strength comes from self-control, not from power.\n\nHis consistency in worship, fasting, night prayer, and fair judgment made him one of Allah's best servants.\n\nHe stands as an example of how patience and dedication to Allah's way raises a person's rank in this life and the Hereafter.`,
			},
			{
				title: "Moral lessons",
				body: ` Keeping promises is a sign of true faith.\n\n Controlling anger is the true strength.\n\n Leadership is responsibility, not power over others.\n\n Patience and consistency raise a person's rank with Allah.\n\n Allah honors those who remain constant in worship and justice.`,
			},
			{
				title: "Practical actions for students",
				body: ` Keep every promise you make — large or small.\n\n When you feel angry, control yourself and remember Allah.\n\n Be fair and just in all your decisions.\n\n Maintain regular prayer and good deeds — never break your routine.\n\n Lead by serving others, not by commanding them.`,
			},
		],
		quranSurahs: ["Al-Anbiya (Sura 21)", "Sad (Sura 38)"],
	},
	yunus: {
		shortIntro: "The story of Prophet Yunus, sent to the people of Nineveh. When they rejected him, he left before Allah's command and was tested with being swallowed by a great fish. His sincere repentance saved him and brought his entire nation to faith.",
		sections: [
			{
				title: "Part 1: A righteous prophet sent to Nineveh",
				body: `Prophet Yunus was a righteous servant of Allah sent to guide a people.\n\nAllah sent him to the people of Nineveh to call them to faith and obedience.\n\nYunus was a patient and faithful messenger of Allah.`,
			},
			{
				title: "Part 2: His call to his people",
				body: `Yunus came to his people with a clear message:\n\nWorship Allah alone and abandon all idolatry and disbelief.\n\nLeave your sins and obey Allah's commands.\n\nYunus called them with wisdom and compassion, inviting them to the path of truth.`,
			},
			{
				title: "Part 3: The people reject him",
				body: `But the people of Nineveh rejected Yunus and did not listen to his message.\n\nThey mocked him and refused to believe in what he brought them.\n\nDespite his sincere efforts, they turned away from the truth.`,
			},
			{
				title: "Part 4: Warning of Allah's punishment",
				body: `Yunus warned them that if they continued to disbelieve and disobey Allah, they would face Allah's severe punishment.\n\nHe told them that Allah's punishment would come to those who reject His prophets and persist in their sins.\n\nStill, they refused to listen to his warning.`,
			},
			{
				title: "Part 5: He leaves before Allah's command",
				body: `When Yunus saw that his people continued to reject him, he became frustrated and left the city.\n\nBut he left before Allah commanded him to leave.\n\nThis was a mistake on Yunus's part, because a prophet should wait for Allah's command.\n\nAllah tested him for this action.`,
			},
			{
				title: "Part 6: The ship and the violent storm",
				body: `Yunus boarded a ship that was full of passengers sailing through the sea.\n\nA violent and terrible storm came suddenly.\n\nThe ship was in great danger and was about to sink.\n\nAll the people on the ship were terrified and afraid they would die.`,
			},
			{
				title: "Part 7: The lots and Yunus is thrown into the sea",
				body: `The people agreed to draw lots to decide who was causing this disaster and should be thrown into the sea to save the others.\n\nThey drew lots again and again.\n\nEach time, the lot fell on Yunus.\n\nSo the people threw Yunus into the sea to save themselves and the ship.`,
			},
			{
				title: "Part 8: The great fish and darkness",
				body: `As Yunus sank into the sea, Allah commanded a great fish to swallow him — but to do him no harm.\n\nYunus found himself in complete darkness.\n\nHe was inside the belly of the fish, deep in the ocean, with no way to escape.\n\nBut it was in this darkness and despair that Yunus truly understood his mistake.`,
			},
			{
				title: "Part 9: His sincere repentance and duʿāʾ",
				body: `Inside the fish, Yunus realized what he had done wrong.\n\nHe turned to Allah with sincere repentance and called upon Him with complete humility:\n\n"There is no god but You. Glory be to You! Indeed, I was among the wrongdoers." (Qur'an 21:87)\n\nAllah immediately responded to him: "So We responded to him and saved him from distress." (Qur'an 21:88)\n\nAllah commanded the fish to release Yunus onto the shore.`,
			},
			{
				title: "Part 10: Salvation, healing, and his people's belief",
				body: `When Yunus came out of the fish, he was weak and sick.\n\nAllah caused a gourd plant to grow over him to give him shade and help him heal.\n\nAfter his recovery, Allah sent Yunus back to his people.\n\nThis time, something miraculous happened — his people believed in his message.\n\nThey repented sincerely and turned to Allah before the punishment came.\n\nAllah accepted their repentance and removed the punishment from them.\n\nAllah says: "So why was there not a town that believed and benefited from its belief, except the people of Yunus?" (Qur'an 10:98)\n\nYunus continued guiding them in faith and obedience.`,
			},
			{
				title: "Moral lessons",
				body: ` A prophet must wait for Allah's command before leaving.\n\n No mistake is too great for sincere repentance.\n\n Duʿāʾ in hardship brings Allah's help.\n\n Allah's mercy is greater than His punishment.\n\n True repentance can save an entire nation from punishment.`,
			},
			{
				title: "Practical actions for students",
				body: ` When you make a mistake, return to Allah sincerely and ask for forgiveness.\n\n Do not give up on people — Allah can change hearts at any time.\n\n Call people to faith with patience and wisdom.\n\n Remember that Allah's mercy is always available to those who truly repent.\n\n Have faith that sincere repentance and duʿāʾ bring Allah's help.`,
			},
		],
		quranSurahs: ["Yunus (Sura 10)", "Al-Anbiya (Sura 21)", "As-Saffat (Sura 37)"],
	},
	musa: {
		shortIntro: "The complete story of Prophet Musa, one of the greatest messengers of Allah. From his miraculous birth to his confrontation with Pharaoh, the exodus, receiving the Tablets, and his journey of faith spanning forty years. His story is full of trials, miracles, and eternal lessons.",
		sections: [
			{
				title: "Part 1: Birth and early life under Pharaoh's oppression",
				body: `Prophet Musa was born in Egypt during the reign of Pharaoh, the great tyrant.\n\nPharaoh ruled Egypt with cruelty and claimed to be a god. He oppressed the Children of Israel and ordered every newborn male child from them to be killed.\n\nWhen Musa was born, his mother was terrified. Allah inspired her with guidance: "Suckle him; but when you fear for him, cast him into the river, and fear not, nor grieve. Surely We shall return him to you and make him one of the messengers." (Qur'an 28:7)\n\nHis mother placed the baby Musa in a wooden chest and cast it into the river.`,
			},
			{
				title: "Part 2: Musa is raised in Pharaoh's palace",
				body: `The river carried the chest to Pharaoh's palace.\n\nPharaoh's wife found him and said: "A comfort of the eye for me and for you. Do not kill him." (Qur'an 28:9)\n\nShe took him into the palace. Allah returned Musa to his own mother so that she could nurse him: "Thus We restored him to his mother, so that her eye might be comforted." (Qur'an 28:13)\n\nMusa grew up inside the palace of the enemy of Allah, raised by Pharaoh's own wife, yet his heart remained faithful to Allah.`,
			},
			{
				title: "Part 3: Reaching adulthood and the Egyptian incident",
				body: `When Musa reached adulthood, Allah granted him great strength, wisdom, and knowledge.\n\nOne day, Musa saw an Israelite fighting an Egyptian in the street. Musa tried to separate them, and he struck the Egyptian unintentionally, and the man died.\n\nMusa was shocked and said: "This is from the work of Shaytan." (Qur'an 28:15)\n\nFearing that he would be punished by Pharaoh, Musa fled Egypt, leaving everything behind.`,
			},
			{
				title: "Part 4: Musa's life in Madyan",
				body: `Musa traveled alone through the desert until he reached the land of Madyan.\n\nThere he found two women trying to water their animals but could not. Musa helped them and watered their flock.\n\nTheir father invited Musa to stay with him, offering him shelter, work, and later marriage to one of his daughters.\n\nMusa lived in Madyan for many years, working as a faithful shepherd, serving his father-in-law with dedication and honesty.`,
			},
			{
				title: "Part 5: The call at Mount Tur — Allah's revelation",
				body: `While returning to Egypt after many years, Musa saw a fire in the distance.\n\nHe went toward it, and Allah called him from a burning bush: "O Musa! Indeed, I am Allah, Lord of the worlds." (Qur'an 28:30)\n\nAllah commanded him to worship Him alone and to establish prayer.\n\nMusa asked for a sign of his truthfulness, and Allah gave him great miracles: His staff became a living serpent, and when he put his hand in his robe and took it out, it shone bright white without any harm.`,
			},
			{
				title: "Part 6: Preparation and his brother Aaron",
				body: `Musa was afraid and hesitant about his mission.\n\nHe asked Allah: "And my tongue is not fluent, so send with me my brother Aaron." (Qur'an 28:34)\n\nAllah responded: "We will strengthen your arm with your brother, and We will give you both authority." (Qur'an 28:35)\n\nMusa and Aaron prepared for their great mission to Pharaoh.`,
			},
			{
				title: "Part 7: Confrontation with Pharaoh and his denial",
				body: `Musa and Aaron went to Pharaoh and said: "Indeed, we are messengers from the Lord of the worlds." (Qur'an 26:16)\n\nBut Pharaoh mocked them, denied Allah, and arrogantly claimed divinity.\n\nHe said: "What is the Lord of the worlds?" (Qur'an 26:23)\n\nPharaoh refused to listen and rejected their message completely.`,
			},
			{
				title: "Part 8: The nine signs and the magicians",
				body: `Allah sent nine clear signs to prove Musa's truthfulness: Flood, Locusts, Lice, Frogs, Blood, Drought, Loss of crops, the staff that swallowed what the magicians created, and the shining hand.\n\nEach sign was more powerful than the previous one, but Pharaoh rejected them all in arrogance and denial.\n\nThen Pharaoh gathered all the magicians of Egypt to compete with Musa.\n\nMusa threw his staff, and it swallowed all their magic and deception.\n\nThe magicians saw the truth and believed, saying: "We believe in the Lord of Musa and Aaron." (Qur'an 20:70)\n\nBut Pharaoh tortured them and tried to destroy them. Yet they remained firm in their faith.`,
			},
			{
				title: "Part 9: The exodus and the sea splitting",
				body: `Allah commanded Musa to leave Egypt at night with the believers.\n\nPharaoh gathered his army and chased them.\n\nWhen the believers reached the sea, they panicked, thinking they would be caught.\n\nBut Musa said: "No, indeed. With me is my Lord; He will guide me." (Qur'an 26:62)\n\nAllah commanded: "Strike the sea with your staff." (Qur'an 26:63)\n\nThe sea split into twelve dry paths, and each tribe knew its own path.\n\nThe believers crossed safely.\n\nBut Pharaoh and his army followed them into the sea, and Allah caused the sea to close upon them.\n\nAllah says: "So today We will save you in body, that you may be a sign for those after you." (Qur'an 10:92)`,
			},
			{
				title: "Part 10: The Tablets, the golden calf, trials, and his legacy",
				body: `After reaching safety, Allah gave Musa the Tablets containing the Torah and clear guidance.\n\nBut while he was away, some people worshipped a golden calf. When Musa returned, he destroyed the calf and corrected them.\n\nAllah commanded them to slaughter a cow as a test, but they argued and delayed, showing their stubbornness.\n\nBecause of their refusal to enter the Holy Land, Allah decreed: "It is forbidden to them for forty years; they will wander in the land." (Qur'an 5:26)\n\nYet Allah provided for them: Manna and quails from heaven, water from rocks, and shade from clouds.\n\nMusa also learned humility and patience from a righteous servant of Allah, understanding that Allah's wisdom is beyond human understanding.\n\nWhen death approached, Musa asked Allah to bring him near the Holy Land. The Prophet said Musa died close to the Holy Land, and only Allah knows his grave.\n\nMusa stands as one of the greatest messengers of Allah, whose life teaches patience, faith, and unwavering obedience.`,
			},
			{
				title: "Moral lessons",
				body: ` Allah plans all events long before they happen.\n\n Tyranny never lasts — truth always triumphs.\n\n Miracles do not benefit stubborn and arrogant hearts.\n\n True leadership requires patience and reliance on Allah.\n\n Obedience to Allah brings victory in this life and the Hereafter.`,
			},
			{
				title: "Practical actions for students",
				body: ` Trust in Allah's plan even when you cannot see the outcome.\n\n Stand firm for truth even when facing powerful opposition.\n\n Help others selflessly and with kindness.\n\n Never give up on your mission even after facing rejection.\n\n Remember that Allah's wisdom is greater than our understanding — seek knowledge with humility.`,
			},
		],
		quranSurahs: ["Al-Qasas (Sura 28)", "As-Shu'ara (Sura 26)", "Taha (Sura 20)", "Al-A'raf (Sura 7)", "Al-Baqarah (Sura 2)"],
	},
	harun: {
		shortIntro: "The story of Prophet Harun, the brother of Prophet Musa and his chosen helper. Allah made him a prophet to support Musa in guiding the Children of Israel. His character of gentleness, patience, and mercy stands as a model for all leaders.",
		sections: [
			{
				title: "Part 1: Musa asks Allah for a helper",
				body: `Prophet Musa received the honor of being chosen as a messenger of Allah.\n\nBut when given this enormous responsibility, Musa asked Allah for help and support.\n\nHe said: "Grant me a helper from my family — Harun, my brother. Increase through him my strength." (Qur'an 20:29-31)\n\nMusa told Allah that Harun spoke more clearly and was calm and gentle, qualities needed to help deliver the message to the people.`,
			},
			{
				title: "Part 2: Allah grants Harun as a prophet",
				body: `Allah accepted Musa's request and made Harun a prophet alongside his brother.\n\nAllah said: "We will strengthen your arm with your brother, and give you both authority." (Qur'an 28:35)\n\nAllah declared: "And We granted him his brother Harun as a prophet." (Qur'an 19:53)\n\nThis was a great honor for Harun — to be chosen as a prophet to support his brother in such an important mission.`,
			},
			{
				title: "Part 3: Standing before Pharaoh",
				body: `When Musa and Harun went to confront Pharaoh, they went together.\n\nThey said: "Indeed, we are messengers of the Lord of the worlds." (Qur'an 26:16)\n\nHarun stood beside Musa as an equal partner in the mission, facing Pharaoh's arrogance and cruelty.\n\nThey brought clear signs and miracles, but Pharaoh remained stubborn and denied the truth.`,
			},
			{
				title: "Part 4: Harun's support through challenges",
				body: `Throughout their confrontation with Pharaoh, Harun remained loyal and supportive.\n\nWhen Pharaoh mocked them and threatened them with punishment, Harun stayed strong in his faith and his support for Musa.\n\nHe helped deliver the message despite the dangers and the threats from the tyrant.\n\nAllah sent the nine great signs to prove their truthfulness, but Pharaoh rejected them all.`,
			},
			{
				title: "Part 5: Leadership of the people after the exodus",
				body: `After Allah saved the Children of Israel from Pharaoh and drowned him in the sea, the people were free at last.\n\nMusa appointed Harun as the leader of the people to guide them while he went to receive the Torah from Allah.\n\nMusa said to him: "Take my place among my people, act rightly, and do not follow the way of those who spread corruption." (Qur'an 7:142)\n\nHarun accepted this responsibility with patience and mercy.`,
			},
			{
				title: "Part 6: Harun's gentleness and clear advice",
				body: `Harun was known for his gentleness, patience, and mercy toward the people.\n\nHe treated them with kindness while trying to guide them to the right path.\n\nHe spoke clearly and had a gentle way of giving advice that touched people's hearts.\n\nHe used wisdom and compassion in his leadership rather than force or harshness.`,
			},
			{
				title: "Part 7: The trial of the golden calf",
				body: `While Musa was away receiving Allah's revelation, a man named as-Samiri led the people to make a golden calf.\n\nThey began to worship this false idol instead of Allah.\n\nHarun tried to stop them. He said: "O my people, you are only being tested by this, and indeed your Lord is the Most Merciful, so follow me and obey my command." (Qur'an 20:90)\n\nBut the people refused to listen to him and continued in their mistake.`,
			},
			{
				title: "Part 8: Harun's difficult choice",
				body: `Harun faced a very difficult situation. The people refused to obey and were turning away from Allah.\n\nBut Harun feared that if he used force to stop them, the community would split into groups and fight each other.\n\nHe chose to wait patiently, continuing to give them gentle advice and warnings.\n\nHe hoped that when Musa returned, the situation could be resolved without the community being torn apart.`,
			},
			{
				title: "Part 9: Musa's anger and Harun's explanation",
				body: `When Musa returned and saw the people worshipping the golden calf, he became very angry.\n\nIn his anger, he grabbed Harun by the beard and head.\n\nHarun immediately explained: "O son of my mother, the people overpowered me and almost killed me. So do not make enemies rejoice over me, and do not place me among the wrongdoing people." (Qur'an 7:150)\n\nHarun explained that he had tried to prevent this but was overcome by the people's stubbornness.`,
			},
			{
				title: "Part 10: His legacy - loyalty, gentleness, and righteousness",
				body: `Musa understood Harun's situation and both of them prayed for forgiveness.\n\nHarun remained known for his gentleness, patience, mercy, clear speech, and loyalty to his brother and to Allah.\n\nHe was a true helper and support in the great mission of calling people to Allah.\n\nAllah always mentioned Harun with honor, alongside his brother Musa.\n\nProphet Harun died before Prophet Musa, and Musa was deeply saddened by his death.\n\nHarun died as a righteous prophet, faithful to his mission to the very end, and his legacy teaches us about the power of gentleness and cooperation in guiding others.`,
			},
			{
				title: "Moral lessons",
				body: ` Support and cooperation strengthen any mission.\n\n Gentleness is a form of true strength.\n\n Leadership requires patience and mercy toward people.\n\n Preserving unity in the community is important.\n\n Prophets are loyal, sincere, and devoted to their mission.`,
			},
			{
				title: "Practical actions for students",
				body: ` Help your friends and family in their challenges — be like Harun to Musa.\n\n Use gentleness and patience when advising others.\n\n Choose wisdom and mercy over force when facing difficulties.\n\n Be loyal to those you care about, even when they are mistaken.\n\n Show clear support to those working toward good, even when they face opposition.`,
			},
		],
		quranSurahs: ["Taha (Sura 20)", "Al-A'raf (Sura 7)", "Maryam (Sura 19)", "Al-Qasas (Sura 28)", "Al-Ahzab (Sura 33)"],
	},
	dawud: {
		shortIntro: "The story of Prophet Dawud, both a prophet and a king, combining faith, strength, wisdom, and justice. From his youth defeating the giant Jalut to his kingship, worship, and humility, his life shows how to lead with power and devotion to Allah.",
		sections: [
			{
				title: "Part 1: Early life during the time of Talut",
				body: `Prophet Dawud lived during the time when Allah appointed Talut as king over the Children of Israel.\n\nThe enemies of the Children of Israel were strong and oppressive.\n\nThe greatest enemy of the Children of Israel was a giant named Jalut, huge and powerful, feared by all.\n\nDawud was born during this time of struggle and challenge for his people.`,
			},
			{
				title: "Part 2: The challenge of Jalut and fear of the army",
				body: `When the armies of the Children of Israel and their enemies met in battle, Jalut stepped forward with confidence.\n\nHe was massive and terrifying, and he challenged the entire army of the Children of Israel.\n\nBut the soldiers were afraid. No one dared to step forward to face this giant.\n\nThe whole army trembled with fear, unsure if anyone had the courage to fight Jalut.`,
			},
			{
				title: "Part 3: Young Dawud steps forward with faith",
				body: `Dawud was still young, not a king, not a military commander, not a seasoned soldier.\n\nBut Dawud stepped forward with a strong faith in Allah.\n\nHe believed that Allah could give him victory over any enemy, no matter how big or strong.\n\nDawud said he would fight Jalut, trusting completely in Allah's help and support.`,
			},
			{
				title: "Part 4: Dawud strikes down the giant Jalut",
				body: `By Allah's permission and power, Dawud struck Jalut and killed him.\n\nAllah says: "So they defeated them by permission of Allah, and Dawud killed Jalut." (Qur'an 2:251)\n\nThis was a miraculous victory — a young boy defeating the greatest giant and warrior of his time.\n\nBecause of this victory, Allah honored Dawud greatly among his people.`,
			},
			{
				title: "Part 5: Allah grants him kingship and prophethood",
				body: `After the death of Talut, Allah granted Dawud both kingship and prophethood.\n\nAllah says: "And Allah gave him the kingdom and wisdom, and taught him what He willed." (Qur'an 2:251)\n\nDawud ruled with perfect justice, complete humility, and deep fear of Allah.\n\nHe combined the strength of a king with the devotion of a prophet.`,
			},
			{
				title: "Part 6: The Zabur revelation and beautiful voice",
				body: `Allah revealed to Dawud the Zabur, the Psalms, containing guidance and wisdom.\n\nAllah blessed Dawud with an extremely beautiful voice.\n\nWhen Dawud glorified Allah and recited the Zabur, something miraculous happened:\n\nThe mountains echoed his glorification, and the birds gathered around him and glorified Allah with him.\n\nAllah says: "Indeed, We subjected the mountains with him, glorifying Allah in the evening and morning, and the birds gathered." (Qur'an 38:18-19)`,
			},
			{
				title: "Part 7: Extreme devotion and worship throughout life",
				body: `Dawud was extremely devoted in his worship of Allah, even while being a king.\n\nThe Prophet Muhammad said that the best fasting was the fasting of Dawud: he fasted one day and broke his fast the next day.\n\nDawud also prayed much of the night, standing in worship when others slept.\n\nHe combined the duties of kingship with deep devotion to Allah and constant worship.`,
			},
			{
				title: "Part 8: Strength, skills, and humility",
				body: `Allah strengthened Dawud physically and gave him great power.\n\nAllah also taught him special skills to benefit his people.\n\nAllah taught him to make coats of armor to protect people from violence.\n\nAllah says: "And We taught him the making of coats of armor for you, to protect you from your violence." (Qur'an 21:80)\n\nDespite all his power and skill, Dawud remained deeply humble before Allah.`,
			},
			{
				title: "Part 9: The test of judgment and quick repentance",
				body: `One day while Dawud was in his place of worship, two men suddenly entered his presence.\n\nOne man complained that the other had wronged him regarding a sheep — he had one sheep while the other had many, yet wanted to take his one.\n\nDawud judged quickly saying the rich man was wrong in his dispute.\n\nThen Dawud immediately realized that Allah had tested him — he should have listened more carefully before judging.\n\nAllah says: "And Dawud realized that We had tested him, so he sought forgiveness from his Lord and fell down bowing and repented." (Qur'an 38:24)\n\nAllah forgave him for his quick repentance.`,
			},
			{
				title: "Part 10: His legacy - strength with worship and preparing Sulayman",
				body: `Allah praised Dawud greatly, describing him as strong, patient, and constantly returning to Allah.\n\nAllah said: "O Dawud, indeed We have made you a successor on the earth, so judge between the people in truth and do not follow desire." (Qur'an 38:26)\n\nAllah also said: "Indeed, We found him patient. What an excellent servant! Indeed, he was one who constantly returned to Allah." (Qur'an 38:17)\n\nAllah blessed Dawud with a righteous son, Sulayman, who inherited knowledge, wisdom, and prophethood.\n\nDawud lived a life of worship, justice, leadership, and humility until his death.\n\nAfter him, Sulayman became king and prophet, continuing his father's legacy of combining power with devotion to Allah.`,
			},
			{
				title: "Moral lessons",
				body: ` Victory comes from faith in Allah, not from size or earthly power.\n\n Leadership requires justice and fairness toward all people.\n\n Worship must continue even with authority and power.\n\n Quick repentance and humility raise one's rank with Allah.\n\n True strength lies in humility and devotion, not in pride.`,
			},
			{
				title: "Practical actions for students",
				body: ` Trust in Allah even when facing opponents who seem stronger or more powerful.\n\n Always judge fairly and listen carefully before making decisions.\n\n Balance your responsibilities with worship and prayer to Allah.\n\n When you make a mistake, repent quickly and sincerely.\n\n Teach younger people wisdom and justice, preparing them to lead with integrity.`,
			},
		],
		quranSurahs: ["As-Saffat (Sura 37)", "Sad (Sura 38)", "Al-Anbiya (Sura 21)", "Al-Baqarah (Sura 2)", "An-Nisa (Sura 4)"],
	},
	sulayman: {
		shortIntro: "The complete story of Prophet Sulayman, son of Prophet Dawud. Allah granted him prophethood, kingship, and miraculous powers that no one before or after him received. From commanding the wind and jinn to his encounter with Queen of Sheba, his life shows power combined with profound humility.",
		sections: [
			{
				title: "Part 1: Early wisdom shown as a young man",
				body: `Prophet Sulayman was known from a young age for his intelligence and wisdom.\n\nOne day, a dispute was brought before his father Dawud and Sulayman.\n\nTwo men argued about a field and sheep: one owned a field and the other owned sheep that entered the field at night and destroyed the crops.\n\nAllah inspired Sulayman with a deeper understanding and better judgment.\n\nAllah says: "And We gave understanding of it to Sulayman, and to each We gave judgment and knowledge." (Qur'an 21:79)\n\nThis demonstrated that Sulayman was chosen for great leadership.`,
			},
			{
				title: "Part 2: Kingship and prophethood after Dawud",
				body: `After Prophet Dawud passed away, Sulayman became king, prophet, and judge of his people.\n\nSulayman realized the tremendous responsibility he carried.\n\nHe prayed to Allah with a special supplication:\n\n"My Lord, forgive me and grant me a kingdom that will not belong to anyone after me." (Qur'an 38:35)\n\nAllah accepted his supplication and granted him a kingdom like none other.`,
			},
			{
				title: "Part 3: Allah made the wind obedient to him",
				body: `Allah made the wind completely obedient to Sulayman's command.\n\nWith the wind, Sulayman and his army could travel vast distances:\n\nIn the morning, the wind carried them for a month's journey.\n\nIn the evening, the wind carried them for another month's journey.\n\nAllah says: "And to Sulayman We subjected the wind." (Qur'an 34:12)\n\nThis was a miraculous power that allowed him to protect his kingdom and travel wherever needed.`,
			},
			{
				title: "Part 4: Allah placed the jinn under his command",
				body: `Allah placed all the jinn under Sulayman's command.\n\nThey worked for him by permission of Allah:\n\nThey built palaces and monuments for him.\n\nThey made statues and decorative items.\n\nThey dived into the sea on his behalf.\n\nThey worked in heavy labor and construction.\n\nAllah says: "And among the jinn were those who worked for him by permission of his Lord." (Qur'an 34:12-13)\n\nIf any jinn disobeyed Sulayman's orders, Allah punished them.`,
			},
			{
				title: "Part 5: Allah taught him the language of animals",
				body: `Allah taught Sulayman the language of birds and all animals.\n\nHe could understand what they said and speak to them.\n\nSulayman said: "O people, we have been taught the language of birds, and we have been given from all things." (Qur'an 27:16)\n\nThis was an extraordinary gift that showed Allah's favor upon Sulayman.\n\nNone before him or after him received such a power.`,
			},
			{
				title: "Part 6: The ant and his humility",
				body: `While marching with his great army, Sulayman heard an ant warning others to enter their homes.\n\nThe ant was afraid that Sulayman's army would crush them without noticing.\n\nSulayman smiled in amusement at the ant's concern.\n\nThen Sulayman immediately thanked Allah and prayed:\n\n"My Lord, enable me to be grateful for Your favor." (Qur'an 27:19)\n\nThis showed Sulayman's humility despite his enormous power and authority.\n\nHe was grateful to Allah and mindful of all His creations.`,
			},
			{
				title: "Part 7: The hoopoe bird and Queen Bilqis of Sheba",
				body: `While reviewing his army, Sulayman noticed that the hoopoe bird was missing from those gathered before him.\n\nHe said: "Why do I not see the hoopoe? Is it absent?" (Qur'an 27:20)\n\nWhen the hoopoe returned, it brought news of a powerful kingdom — the Queen of Sheba and her people.\n\nThe hoopoe said they worshipped the sun instead of Allah.\n\nSulayman decided to test them and guide them to the truth.\n\nHe sent the hoopoe with a letter to the Queen saying: "Do not be arrogant toward me, but come to me in submission." (Qur'an 27:31)`,
			},
			{
				title: "Part 8: The throne of Queen Bilqis brought swiftly",
				body: `Sulayman asked his council: "Who will bring me her throne before she arrives?"\n\nA jinn from among the jinn offered: "I will bring it to you before you rise from your place." (Qur'an 27:39)\n\nBut a man who had knowledge from the Book said: "I will bring it to you in the blink of an eye."\n\nBefore Sulayman could even blink, the throne was brought before him.\n\nSulayman said: "This is from the favor of my Lord to test me." (Qur'an 27:40)\n\nThe throne was transformed to be according to his wish.`,
			},
			{
				title: "Part 9: The glass palace and Queen's faith",
				body: `Sulayman asked his people to prepare the throne for him.\n\nHe then prepared his palace for Queen Bilqis.\n\nThe floor was made of glass, so when she entered, she thought it was water.\n\nShe was astonished and lifted her garments, surprised.\n\nSulayman explained to her: "It is a courtyard paved with glass." (Qur'an 27:44)\n\nWhen she entered the palace and saw the majesty of Sulayman's kingdom and his knowledge, she realized:\n\nSulayman's wisdom and power came from Allah.\n\nHe was a true prophet of Allah.\n\nShe said: "I submit with Sulayman to Allah, Lord of the worlds." (Qur'an 27:44)`,
			},
			{
				title: "Part 10: His death and the worm eating his staff",
				body: `Sulayman continued ruling with perfect justice and wisdom.\n\nHe was devoted to Allah and used his power to guide people to faith.\n\nWhen death came for Sulayman, something remarkable happened.\n\nSulayman died while leaning on his staff.\n\nThe jinn continued working, not realizing that he had died.\n\nOnly when a worm ate through his staff and his body fell to the ground did they know.\n\nAllah says: "When We decreed death for him, nothing showed them his death except a creature of the earth eating his staff." (Qur'an 34:14)\n\nThis event proved that the jinn do not have knowledge of the unseen — only Allah knows all hidden things.\n\nSulayman left behind a legacy of justice, wisdom, humility, and perfect submission to Allah.`,
			},
			{
				title: "Moral lessons",
				body: ` Power and authority are tests from Allah, not honors in themselves.\n\n Gratitude and humility protect a person from arrogance.\n\n Knowledge and wisdom are greater than earthly power.\n\n True leadership must guide people toward faith in Allah.\n\n Even the greatest kings and prophets must face death — nothing is eternal except Allah.`,
			},
			{
				title: "Practical actions for students",
				body: ` Use any power or authority you have to help others and guide them toward good.\n\n Be grateful to Allah for everything He gives you, and never become arrogant.\n\n Seek knowledge and wisdom as treasures greater than money or power.\n\n Be kind and considerate toward all of Allah's creation, even the smallest creatures.\n\n Remember that power and position are temporary — focus on pleasing Allah.`,
			},
		],
		quranSurahs: ["An-Naml (Sura 27)", "Sad (Sura 38)", "Saba (Sura 34)", "Al-Anbiya (Sura 21)"],
	},
	ilyas: {
		shortIntro: "The story of Prophet Ilyas, sent to guide the Children of Israel who had turned to worshipping the idol Baal. He called them to abandon false gods and return to Allah alone. Despite rejection, he remained firm in truth and Allah saved him and the believers.",
		sections: [
			{
				title: "Part 1: Sent to the Children of Israel",
				body: `Prophet Ilyas was sent by Allah to guide the Children of Israel.\n\nThis was after the time of Prophet Sulayman, when the people had begun to drift away from the true path.\n\nAllah chose Ilyas to be His messenger and to call the people back to worshipping Allah alone.`,
			},
			{
				title: "Part 2: His people turn to idol worship",
				body: `The people among whom Ilyas lived had turned away from Allah completely.\n\nThey had abandoned the worship of Allah, the Creator and Sustainer of all things.\n\nInstead, they worshipped an idol called Baal, a false god that could neither help nor harm anyone.\n\nThis was a terrible sin and a clear deviation from the path of truth.`,
			},
			{
				title: "Part 3: Ilyas calls them to abandon the idol",
				body: `Allah sent Prophet Ilyas to correct his people and call them back to the truth.\n\nIlyas stood before his people with courage and said:\n\n"Will you not fear Allah? Do you call upon Baal and leave the Best of creators — Allah, your Lord and the Lord of your forefathers?" (Qur'an 37:124-126)\n\nHe called them clearly to abandon Baal and return to worshipping Allah alone.`,
			},
			{
				title: "Part 4: Reminding them Allah is the true Creator",
				body: `Ilyas reminded his people of the truth they had forgotten:\n\nAllah alone gives life and death.\n\nAllah alone controls all things in the heavens and earth.\n\nIdols like Baal cannot help anyone or harm anyone — they have no power at all.\n\nWorshipping Baal was complete falsehood and turning away from the truth.`,
			},
			{
				title: "Part 5: Clear warnings about false worship",
				body: `Ilyas warned his people with clear and direct words.\n\nHe told them that worshipping false gods would lead to punishment from Allah.\n\nHe explained that Allah is the only One worthy of worship, the One who created them and provides for them.\n\nHe called them to leave their false idols and turn back to Allah with sincere repentance.`,
			},
			{
				title: "Part 6: His people reject and mock him",
				body: `Despite Ilyas's clear message and sincere efforts, the people rejected him.\n\nThey mocked him and refused to abandon their worship of Baal.\n\nThey were arrogant and stubborn, preferring their false traditions over the truth that Ilyas brought.\n\nThey continued in their disbelief and idol worship.`,
			},
			{
				title: "Part 7: Only a small group believed",
				body: `Out of all the people, only a small group believed in Ilyas's message.\n\nThese believers accepted the truth and turned away from idol worship to worship Allah alone.\n\nThey were few in number, but they were sincere in their faith.\n\nThe majority rejected the message and continued in their disbelief.`,
			},
			{
				title: "Part 8: Allah's judgment on the disbelievers",
				body: `Because of their stubborn disbelief and rejection of Allah's messenger, Allah decreed punishment upon them.\n\nAllah tells us: "But they denied him, so indeed they will be brought for punishment, except the chosen servants of Allah." (Qur'an 37:127-128)\n\nThose who rejected Ilyas and persisted in worshipping Baal were destroyed by Allah's judgment.\n\nThis was a warning that no one can escape Allah's justice.`,
			},
			{
				title: "Part 9: Ilyas and the believers saved",
				body: `While the disbelievers faced Allah's punishment, Ilyas and those who believed with him were saved.\n\nAllah honored His prophet and protected him from harm.\n\nThe believers who stood with Ilyas were also rescued from the punishment that befell the disbelievers.\n\nThis showed that Allah always saves His sincere servants who stand firm for the truth.`,
			},
			{
				title: "Part 10: His honored status and legacy",
				body: `Allah raised the rank of Ilyas among the prophets and honored him greatly.\n\nAllah said: "And indeed, Ilyas was among the messengers." (Qur'an 37:123)\n\nAllah also said: "Peace be upon Ilyas." (Qur'an 37:130)\n\nAnd Allah praised him: "Indeed, thus do We reward the doers of good." (Qur'an 37:131)\n\nIlyas was firm in calling to truth, patient with rejection, sincere in worship, and fearless before false gods.\n\nAllah preserved his mention among later generations and said: "Indeed, he was of Our believing servants." (Qur'an 37:132)\n\nHis legacy teaches us to stand for truth no matter how few people support us.`,
			},
			{
				title: "Moral lessons",
				body: ` Idol worship can return if people forget Allah and His guidance.\n\n Calling people to truth requires great courage and firm faith.\n\n The majority rejecting a message does not mean it is false.\n\n Allah always saves His sincere servants who stand for truth.\n\n True honor comes from faith in Allah, not from large numbers of followers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Stand firm for what is right, even if others mock or reject you.\n\n Never worship anything except Allah alone — reject all false idols and ideas.\n\n Be courageous in calling people to truth and goodness.\n\n Do not follow the majority simply because they are many — follow the truth.\n\n Trust that Allah will protect and honor those who remain sincere in faith.`,
			},
		],
		quranSurahs: ["As-Saffat (Sura 37)"],
	},
	"al-yasa": {
		shortIntro: "The story of Prophet Al-Yasa, sent to the Children of Israel after Prophet Ilyas. He continued the mission of calling people to worship Allah alone, restoring justice, and guiding with patience. Though not widely known, he was honored by Allah among the excellent prophets.",
		sections: [
			{
				title: "Part 1: Sent after Prophet Ilyas",
				body: `Prophet Al-Yasa was a prophet of Allah sent to guide the Children of Israel.\n\nHe came after Prophet Ilyas, continuing the mission of guiding the people back to the straight path.\n\nAllah chose Al-Yasa to be a messenger and leader for his people during a difficult time.`,
			},
			{
				title: "Part 2: His people turn away from Allah again",
				body: `After the time of Ilyas, many people again turned away from Allah and His guidance.\n\nSome continued to worship false gods and idols instead of worshipping Allah alone.\n\nMany became unjust in their dealings with each other and disobedient to Allah's commands.\n\nThe people had forgotten the lessons of the past prophets.`,
			},
			{
				title: "Part 3: His mission - call back to Allah",
				body: `Allah chose Al-Yasa to call the people back to the truth.\n\nHis mission was to call people back to worship Allah alone, without any partners or idols.\n\nHe was sent to restore justice among the people and teach them the right way to live.\n\nHe guided them with patience and firmness, never compromising on the truth.`,
			},
			{
				title: "Part 4: His message - the same as all prophets",
				body: `Al-Yasa brought the same fundamental message that all prophets before him had brought:\n\nWorship Allah alone and do not associate any partners with Him.\n\nObey Allah's commands and follow His guidance.\n\nLeave false worship and turn back to the truth.\n\nThis message was consistent with what Ibrahim, Musa, Ilyas, and all the prophets had taught.`,
			},
			{
				title: "Part 5: His strong character and faith",
				body: `Al-Yasa was known for his exceptional character and devotion to Allah.\n\nHe had strong faith in Allah and never wavered in his mission.\n\nHe showed great patience in the face of rejection and hardship.\n\nHe was consistent in his worship of Allah, maintaining his devotion throughout his life.\n\nHe was firm against wrongdoing and never compromised on principles of truth and justice.`,
			},
			{
				title: "Part 6: Leadership with justice",
				body: `Al-Yasa ruled and judged with perfect justice among the Children of Israel.\n\nHe reminded them constantly of Allah's blessings upon them.\n\nHe warned them of the punishment that would come if they continued to disobey Allah.\n\nHe treated all people fairly, whether rich or poor, and maintained justice in all his decisions.`,
			},
			{
				title: "Part 7: His persistence despite resistance",
				body: `Though many people resisted Al-Yasa's message and rejected his guidance, he did not give up.\n\nHe continued calling them to the truth with patience and determination.\n\nSome people obeyed and followed him, but many refused and persisted in their disobedience.\n\nDespite all the hardship and rejection, Al-Yasa remained firm in his mission until the end of his life.`,
			},
			{
				title: "Part 8: Allah's praise and honor",
				body: `Allah mentioned Al-Yasa with great honor among the prophets in the Qur'an.\n\nAllah says: "And remember Ismail, Al-Yasa, and Dhul-Kifl, and all are among the excellent." (Qur'an 38:48)\n\nAllah also mentioned him among the patient ones: "And Ismail, Idris, and Dhul-Kifl — all were among the patient." (Qur'an 21:85)\n\nThis shows that Al-Yasa was excellent in character, patient in hardship, and deeply honored by Allah.`,
			},
			{
				title: "Part 9: Struggle and Allah's support",
				body: `Throughout his life, Al-Yasa faced rejection and hardship from many of his people.\n\nSome people obeyed him and followed the truth, but many did not.\n\nHe continued guiding them faithfully until the very end of his life, never abandoning his mission.\n\nAllah supported him and preserved his message, honoring him as one of His faithful messengers.`,
			},
			{
				title: "Part 10: His death and lasting legacy",
				body: `Al-Yasa completed his mission with complete sincerity and devotion to Allah.\n\nHe died as a righteous servant of Allah, having fulfilled his responsibility as a prophet.\n\nHe left behind a powerful legacy:\n\nA reminder of the importance of obedience to Allah.\n\nAn example of patience in the face of rejection and hardship.\n\nA place among the honored prophets whom Allah praised in the Qur'an.\n\nThough not every prophet is widely known or famous, all are honored by Allah for their faithfulness.`,
			},
			{
				title: "Moral lessons",
				body: ` Guidance must continue even after the passing of great prophets.\n\n Consistency in worship and obedience is beloved to Allah.\n\n Patience is a defining sign of true leadership and faith.\n\n Allah honors those who remain firm in their mission.\n\n Not every prophet is famous among people, but all are honored by Allah.`,
			},
			{
				title: "Practical actions for students",
				body: ` Continue doing good even when others around you are not — be consistent like Al-Yasa.\n\n Be patient when facing difficulties or rejection from others.\n\n Stand firm for justice in all situations, even when it is difficult.\n\n Remember that Allah values your faithfulness more than your fame.\n\n Never give up on calling people to good, even if they resist at first.`,
			},
		],
		quranSurahs: ["Sad (Sura 38)", "Al-Anbiya (Sura 21)"],
	},
	zakariyya: {
		shortIntro: "The story of Prophet Zakariyya, a righteous prophet from the Children of Israel known for piety, kindness, and constant worship. Despite old age and his wife's barrenness, he never lost hope. Allah answered his sincere supplication and blessed him with Prophet Yahya.",
		sections: [
			{
				title: "Part 1: A righteous guardian of worship",
				body: `Prophet Zakariyya was a righteous prophet from the Children of Israel.\n\nHe was known throughout his community for his piety, kindness, and constant worship of Allah.\n\nHe served as a guardian of the place of worship and cared deeply for the people of faith.\n\nHe dedicated his life to guiding people and serving Allah with devotion.`,
			},
			{
				title: "Part 2: Caring for Maryam and witnessing miracles",
				body: `Zakariyya was entrusted with the care of Maryam, the mother of Prophet Isa.\n\nWhenever Zakariyya entered her prayer place, he found provision with her — food that appeared miraculously.\n\nHe asked her: "O Maryam, from where did this come to you?"\n\nShe replied: "It is from Allah. Indeed, Allah provides for whom He wills without account." (Qur'an 3:37)\n\nSeeing Allah's blessings upon Maryam strengthened Zakariyya's faith and filled his heart with hope.`,
			},
			{
				title: "Part 3: His old age and desire for a righteous heir",
				body: `Zakariyya was very old, and his wife was barren — unable to have children.\n\nAccording to natural circumstances, it seemed impossible for them to have a child.\n\nYet despite his old age and these difficulties, Zakariyya never lost hope in Allah's power and mercy.\n\nHe feared that after his death, there would be no one to continue guiding the people properly.`,
			},
			{
				title: "Part 4: His sincere and secret supplication",
				body: `Zakariyya turned to Allah with complete humility and made supplication in secret.\n\nAllah tells us his words: "My Lord, indeed my bones have weakened, and my head has filled with white hair, and never have I been disappointed in my supplication to You." (Qur'an 19:4)\n\nHe asked Allah: "Grant me from Yourself an heir who will inherit from me and from the family of Yaqub and make him, my Lord, pleasing to You." (Qur'an 19:5-6)\n\nHis supplication was sincere, humble, and filled with trust in Allah's power.`,
			},
			{
				title: "Part 5: Allah's answer - glad tidings of Yahya",
				body: `Allah immediately answered Zakariyya's sincere supplication.\n\nThe angels called to him while he was standing in prayer:\n\n"O Zakariyya, indeed Allah gives you good news of a son, whose name will be Yahya." (Qur'an 19:7)\n\nAllah described this blessed child as one who would be pure, righteous, a prophet, and one who would never disobey Allah.\n\nThis was an extraordinary gift from Allah — a miracle beyond all natural expectations.`,
			},
			{
				title: "Part 6: His amazement at Allah's power",
				body: `Zakariyya was amazed at this news.\n\nHe asked Allah: "My Lord, how will I have a son when my wife is barren and I am very old?"\n\nAllah replied with words that show His infinite power: "Thus says your Lord: It is easy for Me." (Qur'an 19:9)\n\nThis response reminded Zakariyya that Allah's power has no limits — what is impossible for humans is easy for Allah.`,
			},
			{
				title: "Part 7: The sign - three days of silence",
				body: `Zakariyya asked Allah for a sign to confirm this miracle.\n\nAllah gave him a clear sign: "Your sign is that you will not speak to the people for three nights, while being sound." (Qur'an 19:10)\n\nFor three days and nights, Zakariyya could not speak to people, though he was healthy in every other way.\n\nBut he continued remembering Allah through gestures and devoted himself to worship during this time.`,
			},
			{
				title: "Part 8: Birth and righteousness of Yahya",
				body: `Allah granted Zakariyya a blessed son — Prophet Yahya.\n\nAllah says about Yahya: "O Yahya, take the Scripture with determination." (Qur'an 19:12)\n\nAllah described Yahya as wise from childhood, merciful to all people, pure in character, devoted to his parents, and never arrogant or disobedient.\n\nYahya grew up to become one of the greatest prophets, fulfilling everything Allah had promised about him.`,
			},
			{
				title: "Part 9: Living in times of corruption and trial",
				body: `Despite his righteousness and devotion, Zakariyya lived in a time of great corruption and evil.\n\nHe continued guiding the people patiently, calling them to worship Allah and follow the truth.\n\nHe faced rejection and harm from those who opposed the message of truth.\n\nYet he remained firm in his worship of Allah and his mission until the very end of his life.`,
			},
			{
				title: "Part 10: Martyrdom and eternal honor",
				body: `The enemies of truth plotted against Zakariyya because of his unwavering commitment to Allah's message.\n\nAccording to Ibn Kathir, Zakariyya was killed unjustly by his people who rejected his guidance.\n\nHe died as a martyr, faithful to Allah until his very last breath.\n\nDespite this tragic end, Allah honored Zakariyya greatly and preserved his mention among the prophets for all time.\n\nHis story teaches us that even the most righteous servants of Allah may face persecution, but Allah grants them eternal honor and reward.`,
			},
			{
				title: "Moral lessons",
				body: ` Never lose hope in making duʿāʾ to Allah — He always answers.\n\n Allah can give blessings beyond all natural limits and expectations.\n\n Righteous children are one of the greatest blessings from Allah.\n\n Quiet, secret worship can be more powerful than public displays.\n\n Truth may be opposed and prophets may suffer, but Allah honors His sincere servants.`,
			},
			{
				title: "Practical actions for students",
				body: ` Make duʿāʾ regularly and never lose hope that Allah will answer.\n\n Be patient and trust Allah even when things seem impossible.\n\n Worship Allah in secret with sincerity, not just in public.\n\n Be grateful for righteous friends and family members.\n\n Stand firm for truth even when others oppose you, trusting that Allah will honor your faithfulness.`,
			},
		],
		quranSurahs: ["Maryam (Sura 19)", "Al-Imran (Sura 3)", "Al-Anbiya (Sura 21)"],
	},
	yahya: {
		shortIntro: "The story of Prophet Yahya, the miracle son of Prophet Zakariyya. Given wisdom from childhood, known for extreme purity and self-control, he fearlessly spoke truth against corruption. He was martyred for refusing to stay silent about sin, and Allah honored him with eternal peace.",
		sections: [
			{
				title: "Part 1: A miracle child - answer to sincere supplication",
				body: `Prophet Yahya was the son of Prophet Zakariyya.\n\nHe was a miracle child, born after many long years of supplication from his father.\n\nAllah chose Yahya from before his birth, making him a special servant destined for prophethood.\n\nHis very existence was a sign of Allah's power and mercy.`,
			},
			{
				title: "Part 2: A blessed birth with a unique name",
				body: `Allah gave glad tidings of Yahya to Zakariyya while he was standing in prayer.\n\nAllah said: "O Zakariyya, indeed We give you good news of a son whose name will be Yahya; We have not assigned to any before this name." (Qur'an 19:7)\n\nThis name was chosen by Allah Himself, not by his parents.\n\nThis showed Yahya's special and honored status before Allah even before his birth.`,
			},
			{
				title: "Part 3: Wisdom given from childhood",
				body: `Unlike other children who play and learn slowly, Yahya was given wisdom at a very young age.\n\nAllah says: "O Yahya, take the Scripture with determination. And We gave him wisdom while yet a boy." (Qur'an 19:12)\n\nFrom his early childhood, Yahya was serious about worship, knowledge, and complete obedience to Allah.\n\nHe understood matters of faith and guidance that even adults struggled to comprehend.`,
			},
			{
				title: "Part 4: Extreme purity and noble character",
				body: `Allah described Yahya with rare and noble qualities that few people possess.\n\nAllah says: "And affection from Us and purity, and he was righteous." (Qur'an 19:13)\n\nYahya was known for extreme purity in thought, word, and action.\n\nHe had strong self-control and avoided all worldly desires and temptations.\n\nHe was in constant remembrance of Allah and never disobeyed Him in anything, large or small.`,
			},
			{
				title: "Part 5: Perfect obedience to his parents",
				body: `Yahya was especially kind, respectful, and obedient to his parents.\n\nAllah says: "And dutiful to his parents, and he was not a disobedient tyrant." (Qur'an 19:14)\n\nHe honored them, served them, and never showed them any disrespect or disobedience.\n\nThis shows that kindness and obedience to parents is one of the greatest signs of righteousness and faith.`,
			},
			{
				title: "Part 6: His mission to the Children of Israel",
				body: `Yahya was sent as a prophet to guide the Children of Israel back to the straight path.\n\nHe called them to sincere repentance and turning back to Allah.\n\nHe warned them against corruption, injustice, and disobedience to Allah's commands.\n\nHe reminded them constantly to follow and obey the law that Allah had revealed to them.`,
			},
			{
				title: "Part 7: Supporting and confirming Prophet Isa",
				body: `Yahya's mission included supporting and confirming the message of Prophet Isa (Jesus).\n\nAllah says about Yahya: "Confirming a word from Allah, and honorable, chaste, and a prophet from among the righteous." (Qur'an 3:39)\n\nHe prepared the people for the coming of Prophet Isa and testified to his truthfulness.\n\nBoth prophets worked to guide the Children of Israel to worship Allah alone.`,
			},
			{
				title: "Part 8: Fearless in speaking truth against corruption",
				body: `According to Ibn Kathir, Yahya was completely fearless in speaking the truth, no matter the consequences.\n\nHe openly condemned immorality, unlawful marriages, and corruption among the leaders and powerful people.\n\nHe refused to remain silent about sin and injustice, even when it put him in danger.\n\nHis honesty and courage made the powerful and corrupt people very angry with him.`,
			},
			{
				title: "Part 9: Martyrdom - killed for standing for truth",
				body: `Ibn Kathir narrates that Yahya was killed unjustly by tyrants from among his people.\n\nHe was martyred specifically because he refused to stay silent about sin and corruption.\n\nThe evil people could not tolerate his truthfulness and his condemnation of their sins.\n\nHis death was a great crime, and Allah severely condemned those who killed the prophets.\n\nYahya gave his life for the sake of truth and obedience to Allah.`,
			},
			{
				title: "Part 10: Allah's eternal honor and peace upon him",
				body: `Despite his tragic martyrdom, Allah honored Yahya with the highest dignity and peace.\n\nAllah says: "Peace be upon him the day he was born, the day he dies, and the day he will be raised alive." (Qur'an 19:15)\n\nThis honor and peace is given only to the purest and most devoted servants of Allah.\n\nYahya's legacy teaches us that true courage means standing firm for truth, even when it costs everything.\n\nAllah honored him in this life and the next, and his name is remembered with reverence among all believers.`,
			},
			{
				title: "Moral lessons",
				body: ` Righteousness and devotion to Allah can begin even in childhood.\n\n Purity and self-control are signs of true strength, not weakness.\n\n Speaking truth against corruption may cost one's life, but it is beloved to Allah.\n\n Obedience and kindness to parents is an essential part of worship.\n\n Allah honors and grants eternal peace to those who stand firm for truth.`,
			},
			{
				title: "Practical actions for students",
				body: ` Take your studies of Islam seriously from a young age, like Yahya did.\n\n Control your desires and avoid things that displease Allah.\n\n Always be kind, respectful, and obedient to your parents.\n\n Speak up against wrongdoing, even when it is difficult or unpopular.\n\n Remember that standing for truth brings Allah's honor, even if people reject you.`,
			},
		],
		quranSurahs: ["Maryam (Sura 19)", "Al-Imran (Sura 3)", "Al-Anbiya (Sura 21)"],
	},
	isa: {
		shortIntro: "The complete story of Prophet Isa ibn Maryam, one of the great messengers of Allah sent to the Children of Israel. Born miraculously without a father, he spoke from the cradle, performed miracles by Allah's permission, and was raised alive to the heavens. His story is filled with miracles, mercy, tests, and clear truth.",
		sections: [
			{
				title: "Part 1: Maryam chosen and honored by Allah",
				body: `Before the birth of Isa, Allah chose a pure and righteous woman named Maryam.\n\nShe was devoted to worship and protected by Allah from all evil.\n\nAllah says: "Indeed, Allah chose Adam, Nuh, the family of Ibrahim, and the family of Imran over the worlds." (Qur'an 3:33)\n\nMaryam was from this honored family, and Allah elevated her status above all women of her time.`,
			},
			{
				title: "Part 2: Angel Jibril's visit and the announcement",
				body: `Maryam withdrew from her people to a place of worship, dedicating herself to Allah.\n\nThen Allah sent Angel Jibril to her in the form of a perfect human man.\n\nMaryam was frightened and sought refuge in Allah.\n\nThe angel said: "I am only a messenger of your Lord to give you a pure boy." (Qur'an 19:19)\n\nMaryam asked: "How can I have a son when no man has touched me?"\n\nThe angel replied: "It is easy for Allah." (Qur'an 19:21)`,
			},
			{
				title: "Part 3: The miraculous birth without a father",
				body: `Maryam gave birth to Isa without a father — a miracle and sign from Allah.\n\nThis showed Allah's absolute power to create as He wills, without any means.\n\nDuring the birth, Maryam felt pain and sorrow, being alone and afraid of what people would say.\n\nBut Allah comforted her, saying: "Do not grieve. Your Lord has provided beneath you a stream." (Qur'an 19:24)\n\nAllah also told her to shake the palm tree, and fresh dates fell for her to eat.`,
			},
			{
				title: "Part 4: Speaking from the cradle - the first miracle",
				body: `Allah commanded Maryam to remain silent and let the baby speak for her.\n\nWhen she returned to her people carrying the baby, they accused her of wrongdoing.\n\nMaryam simply pointed to the baby Isa in her arms.\n\nThen, miraculously, Isa spoke from the cradle as a newborn infant.\n\nHe said: "Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet." (Qur'an 19:30)\n\nThis was the first miracle of Prophet Isa, proving his mother's innocence and his own prophethood.`,
			},
			{
				title: "Part 5: His message and call to pure monotheism",
				body: `When Isa grew up, Allah sent him as a prophet to the Children of Israel.\n\nHis mission was to call people to worship Allah alone, without any partners.\n\nHe came to confirm the Torah that was revealed before him.\n\nHe also came to correct the corruption and deviations among the Children of Israel.\n\nIsa said clearly: "Indeed, Allah is my Lord and your Lord, so worship Him." (Qur'an 3:51)\n\nHe never claimed divinity for himself — he was a servant and messenger of Allah.`,
			},
			{
				title: "Part 6: Miracles by Allah's permission",
				body: `Allah supported Isa with many extraordinary miracles, all by Allah's permission.\n\nAllah says: "I heal the blind and the leper, and I give life to the dead — by Allah's permission." (Qur'an 3:49)\n\nOther miracles included:\n\nSpeaking as a baby in the cradle.\n\nMaking a bird from clay, breathing into it, and it becoming a real bird by Allah's permission.\n\nKnowing what people ate in their homes and what they stored away.\n\nAll these miracles were to prove his prophethood, not to claim any divinity — they were all by Allah's permission and power.`,
			},
			{
				title: "Part 7: The disciples - sincere believers",
				body: `A group of sincere followers believed in Isa and his message.\n\nThey were called Al-Hawariyyun — the disciples.\n\nThey said with complete sincerity: "We believe in Allah, and bear witness that we are Muslims." (Qur'an 3:52)\n\nThey supported Isa in his mission and helped spread his message.\n\nThey asked Isa for a sign from Allah to strengthen their hearts and increase their faith.`,
			},
			{
				title: "Part 8: The table from heaven - a great sign",
				body: `The disciples asked Isa to pray to Allah for a table of food to descend from heaven.\n\nIsa prayed sincerely to Allah, and Allah answered his prayer.\n\nAllah sent down the table, called Al-Ma'idah, as a great miracle and sign.\n\nBut Allah warned them: if anyone disbelieves after seeing this sign, they would face severe punishment.\n\nThis was a great test of their faith — would they remain believers after witnessing such a clear miracle?`,
			},
			{
				title: "Part 9: The plot against Isa and Allah's perfect plan",
				body: `The leaders among the Children of Israel became jealous and angry at Isa's message.\n\nThey rejected him and plotted to kill him.\n\nAllah tells us: "They planned, and Allah planned. And Allah is the best of planners." (Qur'an 3:54)\n\nThe truth is clear: They did not kill him, and they did not crucify him.\n\nAllah says: "They did not kill him, nor did they crucify him, but it was made to appear so to them." (Qur'an 4:157)\n\nAllah saved His prophet from their evil plot.`,
			},
			{
				title: "Part 10: Allah raises him alive and his return",
				body: `Allah raised Isa alive to the heavens, body and soul.\n\nAllah says clearly: "Rather, Allah raised him to Himself." (Qur'an 4:158)\n\nIsa did not die, and he was not killed. Allah saved him and honored him by raising him to the heavens.\n\nAccording to Ibn Kathir, Isa will return to earth near the end of time.\n\nWhen he returns, he will:\n\nBreak the false beliefs about him.\n\nEstablish justice on earth.\n\nFollow the law of Prophet Muhammad.\n\nHe will be a sign of the Last Day approaching.\n\nIsa remains alive with Allah, and he will return as a follower of the final messenger, Muhammad.`,
			},
			{
				title: "Moral lessons",
				body: ` Allah creates as He wills — nothing is impossible for Him.\n\n Miracles do not mean divinity — all power belongs to Allah alone.\n\n Worship belongs only to Allah, not to any of His creation.\n\n Truth is often opposed by those in power, but Allah protects His messengers.\n\n Allah always protects His prophets and defeats the plots of their enemies.`,
			},
			{
				title: "Practical actions for students",
				body: ` Never worship any created being — worship Allah alone.\n\n Believe in all the prophets of Allah, including Isa, as servants and messengers of Allah.\n\n Do not be deceived by false beliefs — study authentic Islamic teachings about Prophet Isa.\n\n Trust that Allah will always protect truth and His faithful servants.\n\n Remember that miracles are signs from Allah, not proof of divinity.`,
			},
		],
		quranSurahs: ["Maryam (Sura 19)", "Al-Imran (Sura 3)", "An-Nisa (Sura 4)", "Al-Ma'idah (Sura 5)"],
	},
	muhammad: {
		shortIntro: "The complete life of Prophet Muhammad, peace be upon him, the final messenger of Allah sent to all of humanity. Born as an orphan in Makkah, he received the final revelation at age 40, called people to worship Allah alone, endured persecution with patience, migrated to Madinah, built the Islamic state, and completed the message before his death. His life is the perfect example for all Muslims until the Last Day.",
		sections: [
			{
				title: "Part 1: The world before his birth and his blessed lineage",
				body: `Arabia lived in Jahiliyyah (ignorance):\n\nIdol worship (360 idols in the Ka'bah).\n\nTribal wars with no mercy.\n\nAlcohol, gambling, injustice.\n\nWomen treated as property.\n\nBaby girls buried alive.\n\nAllah chose Arabia for His final message.\n\nProphet Muhammad was born in Makkah in 570 CE, the Year of the Elephant.\n\nHis lineage: Muhammad ibn Abdullah ibn Abdul-Muttalib ibn Hashim (from the tribe of Quraysh, descendants of Isma'il ibn Ibrahim).\n\nFather Abdullah died before his birth.\n\nMother Aminah died when he was 6.\n\nGrandfather Abdul-Muttalib cared for him.\n\nThen uncle Abu Talib raised him.\n\nAllah prepared him through orphanhood, teaching compassion.`,
			},
			{
				title: "Part 2: His childhood, youth, and early reputation",
				body: `He lived among Banu Sa'd.\n\nBreastfed by Halimah.\n\nKnown for calm behavior and intelligence.\n\nWorked as a shepherd (like all prophets).\n\nHe never:\n\nBowed to idols.\n\nDrank alcohol.\n\nLied or cheated.\n\nPeople called him:\n\nAl-Amin (The Trustworthy).\n\nAs-Sadiq (The Truthful).\n\nEveryone in Makkah knew him as honest and noble, even before prophethood.`,
			},
			{
				title: "Part 3: Marriage to Khadijah and rebuilding the Ka'bah",
				body: `At age 25, he married Khadijah bint Khuwaylid:\n\nNoble.\n\nWealthy.\n\nIntelligent.\n\n15 years older.\n\nShe trusted him fully and later became the first believer in Islam.\n\nYears later, Quraysh rebuilt the Ka'bah after flood damage.\n\nThey fought over who would place the Black Stone.\n\nMuhammad:\n\nPut the stone on a cloth.\n\nHad all tribes lift together.\n\nPlaced it himself.\n\nAllah showed his wisdom before prophethood.`,
			},
			{
				title: "Part 4: The first revelation at age 40",
				body: `He used to worship in Cave Hira'.\n\nAngel Jibril came and said: "Read!"\n\nThe Prophet replied: "I cannot read."\n\nThen revelation came:\n\n"Read in the Name of your Lord who created" (Qur'an 96:1–5)\n\nHe returned home trembling.\n\nKhadijah said: "Allah will never disgrace you."\n\nWaraqah ibn Nawfal confirmed: "You are the Prophet of this nation."\n\nRevelation paused for a short time.\n\nThe Prophet was anxious.\n\nThen Allah revealed:\n\n"O you wrapped in garments, arise and warn" (Qur'an 74:1–2)\n\nThe mission began.`,
			},
			{
				title: "Part 5: Beginning of the mission - private and public da'wah",
				body: `Private Da'wah:\n\nKhadijah.\n\nAbu Bakr.\n\n'Ali.\n\nZayd ibn Harithah.\n\nPublic Da'wah:\n\nHe stood on Mount Safa and called Quraysh.\n\nHe warned them to worship Allah alone.\n\nThey mocked him.\n\nThey rejected the message.\n\nBut he continued calling them patiently and with wisdom.`,
			},
			{
				title: "Part 6: Persecution in Makkah and the Year of Sadness",
				body: `Muslims were:\n\nBeaten.\n\nStarved.\n\nTortured.\n\nExamples:\n\nBilal dragged on hot sand.\n\nSumayyah killed (first martyr).\n\nBoycott lasted 3 years:\n\nNo food.\n\nNo marriage.\n\nNo trade.\n\nThen came the Year of Sadness:\n\nTwo huge losses:\n\nKhadijah (ra) died.\n\nAbu Talib died.\n\nProtection ended.\n\nThe persecution increased after this.`,
			},
			{
				title: "Part 7: Ta'if rejection, Isra & Mi'raj, and Hijrah to Madinah",
				body: `He went to Ta'if seeking support.\n\nThey:\n\nMocked him.\n\nThrew stones.\n\nMade him bleed.\n\nAngel offered destruction.\n\nHe replied: "I hope their children will worship Allah."\n\nThen came Al-Isra & Al-Mi'raj:\n\nNight journey to Jerusalem.\n\nAscended through the heavens.\n\nMet prophets.\n\nSalah made obligatory.\n\n"Glory be to Him who took His servant by night" (17:1)\n\nLater, Quraysh planned assassination.\n\nHe left with Abu Bakr.\n\nIn Cave Thawr:\n\n"Do not grieve, Allah is with us" (9:40)\n\nArrived in Madinah to great joy.`,
			},
			{
				title: "Part 8: Building the Islamic state and major battles",
				body: `He built the Islamic state:\n\nBuilt mosque.\n\nUnited Muhajirun & Ansar.\n\nEstablished law & justice.\n\nWrote treaties.\n\nMajor Battles:\n\nBadr:\n\n313 Muslims vs 1000.\n\nAngels supported Muslims.\n\n"Allah helped you at Badr" (3:123)\n\nUhud:\n\nArchers disobeyed.\n\nMuslims lost.\n\nProphet injured.\n\nLesson: obedience.\n\nKhandaq:\n\nTrench strategy.\n\nEnemies retreated.\n\nAllah protected the believers.`,
			},
			{
				title: "Part 9: Hudaybiyah, conquest of Makkah, and final years",
				body: `Hudaybiyah:\n\nSeemed unfair, but Allah said:\n\n"Indeed We have given you a clear victory" (48:1)\n\nIslam spread rapidly.\n\nConquest of Makkah:\n\nNo revenge.\n\nHe said: "Go, you are free."\n\nDestroyed idols.\n\n"Truth has come and falsehood has vanished" (17:81)\n\nFinal Years:\n\nLetters to kings.\n\nTribes accepted Islam.\n\nYear of Delegations.\n\nIslam spread throughout Arabia and beyond.`,
			},
			{
				title: "Part 10: Farewell pilgrimage and his death",
				body: `Farewell Pilgrimage:\n\nHe said:\n\nNo racism.\n\nWomen have rights.\n\nHold Qur'an & Sunnah.\n\n"Today I have perfected your religion" (5:3)\n\nDeath of the Prophet:\n\nHe fell ill.\n\nLast advice: "Prayer… prayer…"\n\nDied in 'A'ishah's room.\n\nAbu Bakr said:\n\n"Whoever worshipped Muhammad, he has died. Whoever worships Allah, Allah is Ever-Living."\n\nHis legacy:\n\nHe completed the message.\n\nHe left the Qur'an and Sunnah.\n\nHe is the final prophet.\n\nHe is the example for all of humanity until the Last Day.`,
			},
			{
				title: "Moral lessons",
				body: ` Mercy is strength, not weakness.\n\n Patience builds nations and changes the world.\n\n Islam transforms societies from darkness to light.\n\n The Prophet is our perfect example in worship, character, leadership, and patience.\n\n The message of Islam is complete and will never be changed until the Last Day.`,
			},
			{
				title: "Practical actions for students",
				body: ` Follow the Sunnah of the Prophet in daily life.\n\n Study his biography (Seerah) regularly.\n\n Send blessings upon him: "Peace and blessings be upon him."\n\n Defend his honor and teachings.\n\n Be merciful, patient, and honest like him in all situations.`,
			},
		],
		quranSurahs: ["Al-Alaq (Sura 96)", "Al-Muddaththir (Sura 74)", "Al-Isra (Sura 17)", "At-Tawbah (Sura 9)", "Al-Imran (Sura 3)", "Al-Fath (Sura 48)", "Al-Ma'idah (Sura 5)"],
	},
};

export const PROPHET_STORIES: ProphetStory[] = PROPHETS.map((p) => {
	const content = STORY_CONTENT_BY_SLUG[p.slug];

	const safeContent: StoryContent =
		content ??
		({
			shortIntro: "Student-friendly story content coming soon.",
			sections: [
				{
					title: "Part 1",
					body: "Content will be added soon.",
				},
				{
					title: "Moral lessons",
					body: " Seek knowledge.\n\n Practice good character.",
				},
				{
					title: "Practical actions for students",
					body: " Do one good deed today.\n\n Make dua for guidance.",
				},
				DEFAULT_QUIZ_SECTION,
			],
			quranSurahs: [],
		} satisfies StoryContent);

	return {
		slug: p.slug,
		name: formatProphetNamesWithPbuh(p.name),
		shortIntro: safeContent.shortIntro,
		sections: normalizeSectionsWithQuiz(safeContent.sections),
		quranSurahs: safeContent.quranSurahs,
	};
});

export function getProphetStoryBySlug(slug: string): ProphetStory | undefined {
	return PROPHET_STORIES.find((p) => p.slug === slug);
}
