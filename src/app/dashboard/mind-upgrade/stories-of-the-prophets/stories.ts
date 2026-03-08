import { PROPHETS } from "./prophets";
import { formatProphetNamesWithPbuh } from "@/components/stories/pbuh";
import { PDF_BOOK_STORY_CONTENT } from "./pdfBookStoryContent";

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

const NON_NUMBERED_SECTION_PREFIXES = [
	"moral lessons",
	"practical actions",
	"quiz",
	"classroom questions",
	"teacher notes",
];

function isNonNumberedSectionTitle(title: string): boolean {
	const normalized = title.trim().toLowerCase();
	return NON_NUMBERED_SECTION_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function stripPartPrefix(title: string): string {
	return title.replace(/^part\s+\d+\s*:\s*/i, "").trim();
}

function normalizeSectionTitleValue(value: string, partNumber: number): string {
	if (isNonNumberedSectionTitle(value)) return value;
	const coreTitle = stripPartPrefix(value) || value.trim();
	return `Part ${partNumber}: ${coreTitle}`;
}

function normalizeSectionTitle(section: ProphetStorySection, partNumber: number): ProphetStorySection {
	if (typeof section.title === "string") {
		return {
			...section,
			title: normalizeSectionTitleValue(section.title, partNumber),
		};
	}

	return {
		...section,
		title: {
			en: normalizeSectionTitleValue(section.title.en ?? "", partNumber),
			ar: normalizeSectionTitleValue(section.title.ar ?? "", partNumber),
		},
	};
}

function normalizeSectionNumbering(sections: ProphetStorySection[]): ProphetStorySection[] {
	let partCounter = 0;

	return sections.map((section) => {
		const currentTitle = getText(section.title);
		if (isNonNumberedSectionTitle(currentTitle)) {
			return section;
		}

		partCounter += 1;
		return normalizeSectionTitle(section, partCounter);
	});
}

// Stories are sourced and adapted for student readability from Ibn Kathir's
// "Stories of the Prophets" with Qur'anic references.
const STORY_CONTENT_BY_SLUG: Record<string, StoryContent> = {
	adam: {
		shortIntro:
			"Prophet Adam (peace be upon him) was the first human being and the first prophet. His story begins before human life on earth itself, with Allah announcing his creation to the angels, honoring him with knowledge, testing him in Paradise, and teaching mankind the path of repentance after error. It is a story of dignity, temptation, fall, forgiveness, and the beginning of the human journey under Allah's guidance.",
		sections: [
			{
				title: "Part 1: Before mankind began, Allah announced Adam's creation",
				body: `The story of Prophet Adam (peace be upon him) begins before there was any human life on earth. Allah informed the angels that He was going to place generations of mankind upon the earth. The angels, who knew only obedience and glorification, asked about the wisdom of creating beings who would commit wrong and shed blood, while they themselves glorified Allah continuously.

Allah answered them with words that open the entire human story: He knew what they did not know. That answer established from the beginning that mankind would not be understood only by what they might do wrong. Human beings were being created for a wisdom deeper than the angels could yet see.`,
			},
			{
				title: "Part 2: Clay from the earth and the shaping of the first man",
				body: `Ibn Kathir records narrations that Allah commanded angels to bring clay from the earth, and that the clay was taken from different parts of it. This is one reason human beings differ in color, temperament, and outward form. The first human was not made from one narrow piece of the world, but from material taken from the earth itself.

Then Allah shaped Prophet Adam (peace be upon him). Before the soul was breathed into him, his form stood as a created figure of clay. This stage of the story carries a powerful reminder: the one who would be honored above much of creation began from humble earth. Human dignity is real, but it is a dignity given by Allah, not one that gives room for pride.`,
			},
			{
				title: "Part 3: The soul enters and life begins",
				body: `When Allah breathed the soul into Prophet Adam (peace be upon him), life began in the first human being. Ibn Kathir includes reports that when the soul reached his head he sneezed, and Allah taught him words of praise and mercy. As the soul moved through his body, the human experience itself began: sight, appetite, movement, desire, and awareness.

This moment is profound. The first human was not a random creature thrown into existence without direction. He came into life already under the teaching of Allah. His first experience was not abandonment. It was divine attention, instruction, and care.`,
			},
			{
				title: "Part 4: Prophet Adam (peace be upon him) is honored with knowledge",
				body: `Then Allah taught Prophet Adam (peace be upon him) the names of all things. This was one of the greatest honors given to him and one of the clearest signs of why mankind was created with such unique responsibility. Allah then presented that knowledge before the angels, who acknowledged openly that they knew only what Allah had taught them.

When Prophet Adam (peace be upon him) informed them of the names, the wisdom of his creation became clearer. He had been given a gift that marked the human story forever: knowledge. That is why the story of mankind begins not with brute force, but with learning. The first human is honored through knowledge before he is tested through desire.`,
			},
			{
				title: "Part 5: The command to prostrate and the pride of Iblis",
				body: `Allah commanded the angels to prostrate to Prophet Adam (peace be upon him) as an act of honor by Allah's order. They obeyed. But one being refused: Iblis. His refusal did not come from confusion. It came from pride. He argued that he was better than Adam because he was created from fire while Adam was created from clay.

This was the first open act of arrogant rebellion in the human story. Iblis looked at the material and ignored the command. He looked at himself and ignored the wisdom of Allah. That is why his sin was not merely disobedience. It was self-exalting pride. And that pride became the root of his curse and the beginning of his enmity toward mankind.`,
			},
			{
				title: "Part 6: Hawa is created and tranquility enters the story",
				body: `Allah created Hawa for Prophet Adam (peace be upon him), making from him his spouse so that he might find tranquility with her. The human story was never meant to be one of isolated existence only. From its beginning, it included companionship, mercy, and mutual closeness.

Ibn Kathir records reports that she was created from Adam, and this deep connection became part of the story of human family life. Before children, nations, and civilizations, there was one man and one woman under the care of Allah, living in a place of peace and provision.`,
			},
			{
				title: "Part 7: Paradise, ease, and the one forbidden tree",
				body: `Allah placed Prophet Adam (peace be upon him) and Hawa in Paradise and allowed them to eat freely from its blessings. But one tree was forbidden to them. The command was clear. The boundary was simple. This is important because the test in Paradise was not confusion over right and wrong. It was obedience in the presence of abundance.

Allah also warned them plainly about Iblis, telling them that he was an enemy and that they should not let him drive them out of Paradise into hardship. The danger was identified before the temptation came. That makes what happened next one of the most important lessons for all mankind.`,
			},
			{
				title: "Part 8: The whisper, the deception, and the fall",
				body: `Iblis came to them through whispering and deception. He did not present disobedience as ugly. He wrapped it in false promises. He suggested that the forbidden tree was connected to immortality and an everlasting kingdom. He even swore that he was a sincere adviser to them.

This reveals the pattern of temptation for all generations after Prophet Adam (peace be upon him): Satan beautifies sin, questions divine wisdom, promises gain, and disguises himself as a helper. Under that deception, Prophet Adam (peace be upon him) and Hawa ate from the tree. Immediately the consequences appeared, and they became aware of their exposure and loss. The first human mistake had entered the story.`,
			},
			{
				title: "Part 9: Shame, realization, and the first repentance",
				body: `What makes the story of Prophet Adam (peace be upon him) so beautiful is that it does not stop at the sin. The moment of error became the beginning of repentance. Adam and Hawa did not argue with Allah. They did not justify themselves. They did not turn against one another. They confessed the truth: they had wronged themselves, and if Allah did not forgive them and show them mercy, they would be among the losers.

Allah then taught Prophet Adam (peace be upon him) words of repentance, and his repentance was accepted. This is one of the greatest lessons in the entire human story. Mankind begins not with sin alone, but with the opening of tawbah. The first father of humanity teaches every later sinner that the road back to Allah remains open through sincerity, humility, and return.`,
			},
			{
				title: "Part 10: Descent to earth and the real beginning of human life",
				body: `After repentance was accepted, Allah sent them down to the earth. This descent was not outside Allah's original knowledge and wisdom. The earth would become the place of struggle, worship, guidance, family, labor, temptation, and test. Here mankind would live under the ongoing tension between revelation and whispering, obedience and desire.

But Allah did not send them down abandoned. He promised that guidance would come, and whoever followed that guidance would have no fear and would not grieve in the final sense. So the story of earth began with both warning and hope: Satan would remain an enemy, but divine guidance would remain available.`,
			},
			{
				title: "Part 11: Prophet Adam (peace be upon him) on earth",
				body: `Ibn Kathir records that Prophet Adam (peace be upon him) lived on earth with knowledge, worship, repentance, and the burden of teaching his children. He knew what it meant to be tempted, what it meant to lose, and what it meant to return to Allah. This made him the perfect first prophet for mankind: not an angel untouched by struggle, but a human being taught by Allah how to rise after error.

Reports also mention that he taught his descendants skills and ways of living. This fits the broader meaning of his story: human civilization begins with guidance, not with purposeless wandering. The first human being was also the first teacher, carrying the earliest knowledge, worship, and warning into human history.`,
			},
			{
				title: "Part 12: Why the story of Prophet Adam (peace be upon him) is the story of all of us",
				body: `The story of Prophet Adam (peace be upon him) is the story of mankind in miniature. It begins with honor, moves through knowledge, confronts pride, enters temptation, falls into error, returns through repentance, and continues under guidance on earth. Every human life carries echoes of that first story.

That is why Adam is not only the first man in a historical sense. He is also the first mirror in which mankind sees itself. His dignity teaches us our nobility. His mistake teaches us our weakness. His repentance teaches us our hope. And his story teaches us that the path back to Allah is one of the greatest gifts ever given to humanity.`,
			},
			{
				title: "Moral lessons",
				body: ` Human beings are honored by Allah, but that honor should produce humility, not pride.

 Knowledge is one of the greatest gifts Allah gave mankind.

 Pride, like the pride of Iblis, is spiritually destructive.

 Satan works through whispering, beautifying sin, and false promises.

 The first human mistake was followed by the first human repentance.

 Allah does not leave people without guidance in the struggle of life.

 Returning to Allah after error is part of the human story from its very beginning.`,
			},
			{
				title: "Practical actions for students",
				body: ` Memorize and reflect on the du'a of repentance from Qur'an 7:23.

 When you make a mistake this week, repent immediately instead of delaying.

 Choose one area where Satan often whispers to you and make a practical plan to protect yourself.

 Thank Allah for one form of knowledge He has given you, and use it in a good way.

 Read Qur'an 2:30-39, 7:11-27, 20:115-123, and 15:28-42.`,
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
			"Prophet Idris (peace be upon him) is mentioned in the Qur'an as a man of truth and a prophet whom Allah raised to a high station. His story is quieter than some of the longer prophetic stories, but it carries deep lessons in truthfulness, disciplined worship, wisdom, justice, migration for faith, and steady devotion in a time when corruption was beginning to spread. Ibn Kathir presents Prophet Idris (peace be upon him) as a prophet of knowledge, restraint, and spiritual seriousness.",
		sections: [
			{
				title: "Part 1: A prophet remembered with honor in the Qur'an",
				body: `Allah mentions Prophet Idris (peace be upon him) with remarkable honor: he was a man of truth, a prophet, and one whom Allah raised to a high station. Even though the Qur'an gives only brief direct mention of him, those words are enough to show that he held a noble rank among the earliest prophets.

That briefness itself is important. Not every great servant of Allah is known through a long dramatic story. Some are known through the weight of their character. In the case of Prophet Idris (peace be upon him), the Qur'an centers three qualities: truthfulness, prophethood, and elevation by Allah. Those three are enough to tell us that his life was one of unusual purity and faithfulness.`,
			},
			{
				title: "Part 2: Living in the generations after Adam",
				body: `Ibn Kathir places Prophet Idris (peace be upon him) among the early generations after Prophet Adam (peace be upon him) and after Seth. He lived at a time when humanity was still close to its earliest beginnings, but moral and spiritual decline had already begun to show itself in human life.

This setting matters because Prophet Idris (peace be upon him) stood in an age when people still had traces of earlier prophetic guidance, yet they were beginning to drift. He was not sent into total ignorance without precedent. He was sent to revive and preserve the path of tawhid before corruption could harden further.`,
			},
			{
				title: "Part 3: Prophet Idris (peace be upon him) calls people back to Allah",
				body: `When Allah sent Prophet Idris (peace be upon him), he called people back to the religion of their righteous forefathers: worship Allah alone, live truthfully, and do not let the world carry you into heedlessness. Ibn Kathir notes that only a smaller number responded positively, while many turned away from his teaching.

This is one of the earliest examples in prophetic history of a messenger standing firm even when response was limited. Prophet Idris (peace be upon him) did not abandon the truth because it was not popular. He remained committed to the message because a prophet measures success by obedience to Allah, not by the size of the audience.`,
			},
			{
				title: "Part 4: Migration for the sake of preserving faith",
				body: `Ibn Kathir records that when corruption and resistance grew stronger, Prophet Idris (peace be upon him) and those with him moved from Babylon toward Egypt. This migration was not a search for comfort. It was a movement for the sake of faith and continued guidance.

That makes his story powerful in a quiet way. Sometimes serving Allah means remaining and enduring. At other times it means leaving a place where truth is suffocated and carrying the mission elsewhere. Prophet Idris (peace be upon him) shows that protecting faith can require hard relocation, separation from familiar land, and beginning again under Allah's care.`,
			},
			{
				title: "Part 5: A prophet of discipline, not only inspiration",
				body: `In Egypt, Prophet Idris (peace be upon him) continued teaching people practical acts of worship. Ibn Kathir records that he instructed them in prayer, fasting, and giving from their wealth to the poor. This reveals something essential about his mission: he was not calling people to vague spirituality. He was building disciplined servants of Allah.

Worship in his teaching was structured, regular, and embodied. Prayer trained the heart. Fasting trained restraint. Charity trained gratitude and mercy. Prophet Idris (peace be upon him) teaches us that faith grows strong not through occasional emotional moments, but through repeated obedience lived day after day.`,
			},
			{
				title: "Part 6: Justice and fairness as part of religion",
				body: `Ibn Kathir also presents Prophet Idris (peace be upon him) as a caller to justice and fairness. He did not separate worship of Allah from treatment of people. He taught that honesty, fairness, and compassion are part of the path of obedience, not secondary decorations around religion.

That balance matters. A person who prays but cheats people has not understood prophetic guidance. A person who fasts but acts with cruelty has missed the purpose of worship. Prophet Idris (peace be upon him) called people to both devotion toward Allah and fairness toward creation, and that combination is one of the marks of real prophetic teaching.`,
			},
			{
				title: "Part 7: His wisdom on gratitude and sharing blessings",
				body: `Among the wise sayings Ibn Kathir attributes to Prophet Idris (peace be upon him) is the idea that no one shows gratitude for Allah's favors better than the one who shares those favors with others. This is a profound insight into what gratitude really means.

Gratitude is not only a word on the tongue. It is action. If Allah gave you knowledge, gratitude means teaching beneficially. If Allah gave you wealth, gratitude means giving. If Allah gave you strength, gratitude means helping those who are weaker. Prophet Idris (peace be upon him) understood that blessings become more meaningful when they are used in service, not hoarded in pride.`,
			},
			{
				title: "Part 8: Self-accountability and mastery over the self",
				body: `Ibn Kathir records words of wisdom from Prophet Idris (peace be upon him) about looking closely at one's own deeds. This is the path of muhasabah: self-accountability. Before a person judges others, he must examine himself. Before blaming the world, he must ask what his own hands, tongue, heart, and habits are doing.

This makes Prophet Idris (peace be upon him) deeply relevant to any believer trying to grow. He teaches that spiritual strength comes from honest self-examination. A careless soul becomes weak because it never stops to review itself. But a heart that checks itself regularly becomes more awake, more disciplined, and more sincere before Allah.`,
			},
			{
				title: "Part 9: Warning against excess and wasted life",
				body: `Another wise teaching linked to Prophet Idris (peace be upon him) is a warning against excess. Excess in food, wealth, talk, possessions, or indulgence may feel enjoyable for a moment, but it weakens the soul over time. Ibn Kathir presents him as a man who understood restraint and lived with seriousness, not frivolous waste.

That is one reason he stands out as a prophet of discipline. He knew that desires become dangerous when they stop being governed. A believer does not destroy himself by enjoying what Allah made lawful, but he can weaken himself by turning lawful things into obsession, waste, and distraction. Prophet Idris (peace be upon him) taught balance, and balance protects iman.`,
			},
			{
				title: "Part 10: Raised to a high station by Allah",
				body: `After a life of truthfulness, worship, discipline, wisdom, and steadfast service, Allah honored Prophet Idris (peace be upon him) by raising him to a high station. The exact nature of that elevation is not fully detailed in the Qur'an, and Muslim scholars mention different reports while remaining anchored to what Allah explicitly revealed.

What matters most is the meaning: Allah saw his truthfulness and raised him. That is the enduring lesson of his story. A servant may live quietly, be ignored by many people, and still be held in extraordinary honor by Allah. Prophet Idris (peace be upon him) is a proof that deep truthfulness, steady worship, and sincere discipline never go unseen by the Lord.`,
			},
			{
				title: "Part 11: Why Prophet Idris (peace be upon him) still matters",
				body: `The story of Prophet Idris (peace be upon him) matters because many believers imagine greatness only in dramatic moments: great battles, public miracles, and famous confrontations. But his life teaches another kind of greatness: inner truthfulness, disciplined worship, self-accountability, migration for faith, justice in dealings, and wisdom lived consistently.

He stands as an early prophetic model of serious faith. He shows that a person can be elevated by Allah through daily integrity, not only through visible public triumph. That is why his story, though brief in direct revelation, remains powerful in meaning.`,
			},
			{
				title: "Moral lessons",
				body: ` Truthfulness is more than honest speech; it is a whole life aligned with Allah.

 Real worship grows through discipline and consistency, not temporary emotion.

 Protecting faith may require leaving a harmful environment.

 Justice toward people is part of religion, not separate from it.

 Gratitude is shown by sharing blessings, not only speaking about them.

 Self-accountability protects the heart from pride and carelessness.

 Allah raises the sincere servant even if the world barely notices him.`,
			},
			{
				title: "Practical actions for students",
				body: ` Choose one act of worship this week and do it at the same time every day to build discipline.

 Spend five minutes tonight reviewing your actions honestly before sleep.

 Share one blessing Allah gave you with someone else this week.

 Reduce one excess in your life, whether in food, screen time, spending, or speech.

 Read Qur'an 19:56-57 and 21:85-86 and reflect on how little wording can carry great honor.`,
			},
		],
		quranSurahs: ["Maryam", "Al-Anbiya"],
	},

	nuh: {
		shortIntro:
			"Prophet Nuh (peace be upon him) was the first messenger sent to a people who had sunk into idolatry after earlier generations of righteousness. His story is one of extraordinary patience, long years of calling to Allah, mockery from his people, the building of the Ark, the heartbreak of a son who refused faith, and the flood that ended a civilization built on stubborn shirk. Ibn Kathir presents Prophet Nuh (peace be upon him) as a prophet of endurance, clarity, and complete loyalty to tawhid.",
		sections: [
			{
				title: "Part 1: How a righteous memory became idolatry",
				body: `Ibn Kathir explains that the people before Prophet Nuh (peace be upon him) did not fall into idolatry all at once. It began gradually. There had been righteous people among them, and later generations wanted to preserve their memory. Images and statues were made at first as reminders, not as declared gods. But with time, knowledge weakened and Satan beautified falsehood until people began worshipping what had only been made to remember the pious.

This is why the story of Prophet Nuh (peace be upon him) begins with a warning that remains relevant forever: shirk often begins with seemingly small steps, emotional exaggeration, and neglect of clear tawhid. By the time Prophet Nuh (peace be upon him) was sent, his people were deeply attached to idols such as Wadd, Suwa', Yaghuth, Ya'uq, and Nasr. Their religion had become a corruption of memory and desire.`,
			},
			{
				title: "Part 2: Prophet Nuh (peace be upon him) is sent as the first messenger",
				body: `Allah sent Prophet Nuh (peace be upon him) to his people as a clear warner. He came with the simplest and greatest truth: worship Allah alone, fear Him, obey the messenger, and seek forgiveness before the punishment arrives. His message was not complicated, political, or philosophical. It was the call of every prophet: tawhid first.

This is what makes his long mission so powerful. He was not trying to introduce novelty. He was restoring the pure worship of Allah after people had drifted into false devotion and inherited corruption.`,
			},
			{
				title: "Part 3: He called them night and day",
				body: `One of the most moving parts of the story is how Prophet Nuh (peace be upon him) described his own da'wah. He called his people night and day. He spoke publicly and privately. He addressed them openly, then came to them in more personal ways. He used every lawful means to reach their hearts.

Yet the more he called, the more they fled. They put their fingers in their ears. They wrapped themselves in their garments. They insisted on arrogance. This is not just a story of preaching; it is a story of preaching carried through rejection for an astonishing length of time. Ibn Kathir presents him as the model of persistence when results appear painfully slow.`,
			},
			{
				title: "Part 4: The proud leaders attack the believers",
				body: `The elite of his people did not only reject Prophet Nuh (peace be upon him). They also looked down on those who believed in him. They measured worth by status and power, not by iman. They saw the poorer believers around him and used that as a reason to mock the message itself.

But Prophet Nuh (peace be upon him) refused to drive the believers away just to impress the leaders. He made it clear that he was not a keeper of treasures, not a claimant to unseen knowledge independent of revelation, and not someone who would sell the truth in exchange for approval. This is a crucial part of his story: the messenger stands with the believers even when society ranks them as low.`,
			},
			{
				title: "Part 5: Nine hundred and fifty years of patience",
				body: `Allah tells us that Prophet Nuh (peace be upon him) remained among his people for a thousand years minus fifty. That is nine hundred and fifty years of calling, warning, teaching, enduring, and waiting. Few statements in revelation communicate perseverance as powerfully as this one.

Think about what that means. Generations rose and passed while he remained calling to the same truth. Children grew into adults and repeated the disbelief of their elders. Yet Prophet Nuh (peace be upon him) did not abandon the mission because it was long. He stayed because Allah had sent him, and the messenger's duty is to convey, not to control the outcome.`,
			},
			{
				title: "Part 6: The decree comes after proof is complete",
				body: `Eventually Allah revealed to Prophet Nuh (peace be upon him) that no one else from his people would believe beyond those who already had faith. That was the moment when the mission shifted from extended warning to the nearing decree. Only after long proof, repeated invitation, and stubborn rejection did the final judgment move forward.

Then Prophet Nuh (peace be upon him) made du'a against the persistent disbelievers, asking Allah not to leave on the earth any dwelling of the rejecters. This was not impatience. It came after generations of refusal, after mercy had already been offered again and again.`,
			},
			{
				title: "Part 7: Building the Ark under Allah's command",
				body: `Allah commanded Prophet Nuh (peace be upon him) to build the Ark under divine guidance and inspiration. Imagine the scene: a prophet building a ship while people around him mocked him, laughed at him, and treated him as if he had lost all sense. Yet he continued with complete obedience.

This is one of the clearest lessons in his story. Obedience to Allah may look strange to people who only judge by immediate appearances. But the believer does not measure truth by public reaction. Prophet Nuh (peace be upon him) kept building because the command had come from Allah, and that was enough.`,
			},
			{
				title: "Part 8: The sign appears and the believers board",
				body: `Then the sign came: the oven gushed forth, just as Allah had indicated. That was the signal that the decree had begun. Prophet Nuh (peace be upon him) boarded the believers, and pairs of creatures were brought onto the Ark. Ibn Kathir notes that the number of believers was small, despite the enormous length of the mission.

This part of the story destroys the illusion that numbers prove truth. Prophet Nuh (peace be upon him) was one of the greatest prophets, yet only a few believed with him. Success with Allah is not measured by crowd size. It is measured by truthfulness and obedience.`,
			},
			{
				title: "Part 9: The heartbreak of his son",
				body: `One of the most painful scenes in the story is when Prophet Nuh (peace be upon him) called out to his son and invited him to board the Ark. His son refused, believing a mountain would protect him from the flood. In that moment, family affection met divine truth in one of the hardest ways imaginable.

A wave came between them, and the son was among those drowned. The lesson is severe, but it is clear: lineage does not save without faith. Even the son of a prophet cannot be protected by family connection when he rejects Allah's command. This scene gives the story of Prophet Nuh (peace be upon him) a deep emotional weight that should never be overlooked.`,
			},
			{
				title: "Part 10: The flood ends and a new beginning begins",
				body: `Then Allah commanded the earth to swallow its water and the sky to withhold. The flood ended, the Ark came to rest, and the believers stepped into a new beginning by Allah's mercy. The civilization built on stubborn shirk had ended, and a purified beginning was granted to those who obeyed.

This ending shows another great lesson in the story of Prophet Nuh (peace be upon him): after immense hardship, Allah can open a new chapter so completely that the past world seems like something washed away. For the obedient, the end of one world can be the beginning of another blessed one.`,
			},
			{
				title: "Part 11: His final legacy of tawhid and humility",
				body: `Ibn Kathir mentions reports about the final counsel of Prophet Nuh (peace be upon him): hold firmly to tawhid and stay far away from shirk and pride. This is fitting, because his whole life revolved around these two truths. Tawhid raises a servant; pride destroys him.

That is why the story of Prophet Nuh (peace be upon him) is not just the story of a flood. It is the story of the first great battle between revealed tawhid and entrenched shirk in human history, carried by a prophet whose patience became one of the greatest examples ever given to mankind.`,
			},
			{
				title: "Moral lessons",
				body: ` Shirk often begins gradually, so tawhid must be guarded carefully.

 Long patience in da'wah is still obedience, even when results are small.

 Social status does not matter before Allah; iman does.

 Public ridicule must not stop obedience to Allah.

 Family ties do not save without faith.

 After hardship, Allah can open a completely new beginning.`,
			},
			{
				title: "Practical actions for students",
				body: ` Protect your tawhid by avoiding any practice that gives worship, fear, or hope in an ultimate sense to other than Allah.

 Stay consistent in one act of worship this week even if no one notices it.

 Make du'a for guidance for at least three people by name.

 Read Qur'an 71, Qur'an 11:25-49, and Qur'an 29:14.

 When people ignore a good reminder you give, do not quit immediately; learn patience from Prophet Nuh (peace be upon him).`,
			},
		],
		quranSurahs: ["Hud", "Nuh", "Al-Muminun", "Ash-Shuara", "Al-Araf", "Al-Ankabut"],
	},

	hud: {
		shortIntro:
			"Prophet Hud (peace be upon him) was sent to the people of 'Ad, a mighty nation of strength, wealth, and towering buildings. His story is one of power without humility, warning without response, and a punishment that came in the form of a devastating wind. Ibn Kathir presents Prophet Hud (peace be upon him) as a prophet of firmness, dignity, and complete reliance upon Allah in the face of a proud and intimidating people.",
		sections: [
			{
				title: "Part 1: The rise of a powerful nation",
				body: `After the people of Nuh were destroyed, another nation rose in prominence: the people of 'Ad. They lived in a region associated with strength, physical power, and impressive construction. They built lofty structures and took pride in their abilities. Compared to the peoples around them, they appeared formidable, secure, and difficult to challenge.

But worldly power can become a trap when it is no longer tied to gratitude. Allah had given the people of 'Ad strength, resources, and status, yet instead of using those blessings in obedience, they became arrogant. Their strength entered their language, their attitude, and their treatment of truth.`,
			},
			{
				title: "Part 2: Prophet Hud (peace be upon him) is sent from among them",
				body: `Allah sent Prophet Hud (peace be upon him) to them from among their own people. He was not a foreigner speaking about a community he did not understand. They knew him, his background, and his truthfulness. This made his call even clearer and their rejection even more blameworthy.

His message was the message of every prophet: worship Allah alone, abandon false gods, and stop walking the path of arrogance and corruption. He reminded them that the One who gave them strength was the same One who could remove it in a moment.`,
			},
			{
				title: "Part 3: A proud people reject a clear message",
				body: `But the leaders of 'Ad answered with mockery. They called Prophet Hud (peace be upon him) foolish and treated his warning as weakness. This is often how pride responds to revelation: instead of answering the truth, it attacks the dignity of the one who brings it.

Prophet Hud (peace be upon him) answered with calm certainty. There was no foolishness in him, he said. He was a messenger from the Lord of the worlds, conveying the messages of his Lord and advising them sincerely. This exchange captures the heart of the story: arrogance on one side, clear prophetic dignity on the other.`,
			},
			{
				title: "Part 4: He calls them to repentance and increase",
				body: `Prophet Hud (peace be upon him) did not only warn them of punishment. He invited them to mercy. Ibn Kathir highlights that he called them to seek forgiveness from Allah and repent so that Allah would send rain upon them and increase them in strength. This is a beautiful dimension of his story: even while confronting arrogance, he still opened the door of return.

The message was clear. Repentance would not diminish them. It would restore and increase them. But corrupt pride often interprets repentance as humiliation, when in reality it is the path back to honor before Allah.`,
			},
			{
				title: "Part 5: Drought as a warning before destruction",
				body: `Before the final punishment came, the people of 'Ad were tested with hardship. Ibn Kathir and the Qur'anic storyline show warning before destruction, not destruction without notice. Their land was affected, their ease was disturbed, and they were given space to reflect and return.

But hardship does not always soften a proud people. Sometimes it only exposes what is already inside them. Instead of repenting, they remained stubborn and continued to speak as if power itself could protect them from the decree of Allah.`,
			},
			{
				title: "Part 6: Prophet Hud (peace be upon him) stands with complete tawakkul",
				body: `As the confrontation deepened, Prophet Hud (peace be upon him) made one of the strongest declarations of trust in Allah found in the prophetic stories. He placed his reliance completely on Allah, his Lord and their Lord, and declared that they could all plot against him together if they wished.

This was not recklessness. It was the courage of a prophet who knew that no creature moves except under the authority of Allah. The people of 'Ad had visible power, but Prophet Hud (peace be upon him) had something greater: certainty in the Lord of the worlds.`,
			},
			{
				title: "Part 7: A cloud appears, and they mistake punishment for relief",
				body: `Then came one of the most striking moments in the story. The people saw a cloud advancing toward their valleys. They rejoiced, thinking it was the rain they needed. To them it looked like relief. But the Qur'an makes clear that it was the very punishment they had demanded to be hastened.

This is one of the deepest lessons in the story of Prophet Hud (peace be upon him): not everything that looks exciting, strong, or long-awaited is mercy. A believer learns caution before Allah, because what appears pleasant on the outside may carry destruction within it.`,
			},
			{
				title: "Part 8: The furious wind over seven nights and eight days",
				body: `Allah sent upon them a furious, violent wind that continued for seven nights and eight days. The people who had once boasted of their strength were thrown down and ruined by a force they could not resist. Their great structures and physical might could not defend them.

The Qur'an describes them as if they were hollow trunks of palm trees. It is a powerful image: the nation that once stood tall in arrogance was reduced to lifeless bodies under a decree from the One they had refused to obey.`,
			},
			{
				title: "Part 9: The fall of 'Ad and the survival of the believers",
				body: `When the punishment ended, the people of 'Ad were gone. Their pride, their towers, and their claims of unmatched strength did not remain. What remained was the truth of Allah's warning and the salvation of Prophet Hud (peace be upon him) and those who believed with him.

This is one of the repeated laws in the prophetic stories: what saves is not worldly strength, tribe, or architecture. What saves is faith, obedience, and Allah's mercy. The believers were protected not by their own power but by the One who controls all power.`,
			},
			{
				title: "Part 10: Why the story of Prophet Hud (peace be upon him) still matters",
				body: `The story of Prophet Hud (peace be upon him) is not just about an ancient nation destroyed by wind. It is about what happens when strength becomes pride, when blessings erase gratitude, and when truth is mocked because it threatens the ego. It is also about the unshakable calm of a prophet who stands before a powerful people and still speaks with certainty.

For every generation after 'Ad, the lesson remains: no civilization is safe if it rebels against Allah in arrogance. And no believer is truly weak when he relies upon Allah with sincerity.`,
			},
			{
				title: "Moral lessons",
				body: ` Strength without gratitude becomes arrogance.

 Repentance increases blessing; pride blocks mercy.

 Mocking truth does not weaken truth; it only exposes the mocker.

 What looks like relief may be punishment if a people are defiant.

 No human power can resist Allah's decree.

 Allah always saves the believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Thank Allah explicitly this week for one strength, skill, or advantage you have.

 Make istighfar daily and connect it to humility, not habit only.

 Read Qur'an 7:65-72, 11:50-60, and 46:21-26.

 If you succeed at something this week, say alhamdulillah before speaking about yourself.

 Reflect on one area where pride could quietly enter your heart and write how to fight it.`,
			},
		],
		quranSurahs: ["Hud", "Al-Araf", "Al-Ahqaf", "Al-Haqqah", "Al-Muminun"],
	},

	salih: {
		shortIntro:
			"Prophet Salih (peace be upon him) was sent to the powerful people of Thamud, a nation known for skill, strength, and carved homes in the mountains. His story is one of warning, miracle, arrogance, and the destruction that follows when people attack the very sign they asked Allah to show them. Ibn Kathir presents the she-camel as a decisive test, and the story remains a warning against pride, delay in repentance, and disrespect for Allah's signs.",
		sections: [
			{
				title: "Part 1: A nation of stone, skill, and arrogance",
				body: `After the destruction of the people of 'Ad, another nation rose in strength: Thamud. They lived among rocky lands and mountains, and they became famous for carving homes directly into the stone. Their buildings gave them a feeling of permanence and safety. They looked at their power, their engineering, and their environment and felt almost untouchable.

But strength is not the same as guidance. Allah had given them ability, resources, and stability, yet instead of gratitude they fell into arrogance. They worshipped other than Allah and became proud of the very blessings that should have led them back to Him.`,
			},
			{
				title: "Part 2: Prophet Salih (peace be upon him) rises from among them",
				body: `Allah sent Prophet Salih (peace be upon him) to Thamud from among their own people. He was not a stranger to them. They knew him, his lineage, and his character. That made their rejection even more serious, because they were not rejecting an unknown outsider. They were rejecting a truthful man from among themselves after clear warning had come.

His message began where every prophetic message begins: worship Allah alone, fear Him, and stop spreading corruption on the earth. He reminded them that the One who gave them homes in the mountains and strength in the land was the One deserving of worship, gratitude, and obedience.`,
			},
			{
				title: "Part 3: Pride makes them demand a sign",
				body: `But the leaders of Thamud did not respond with humility. Like many arrogant peoples before them, they demanded a miracle while already preparing themselves not to submit. They challenged Prophet Salih (peace be upon him) and asked him to bring a clear sign if he were truly sent by Allah.

This is an important turning point in the story. Asking for proof is not always sincere. Sometimes people ask for signs only because they believe they will still find a way to deny them. When a heart is proud, even miracles can become material for rebellion instead of guidance.`,
			},
			{
				title: "Part 4: The she-camel emerges as a living miracle",
				body: `Allah answered their demand with a sign they could not dismiss: the she-camel. Ibn Kathir presents her as a clear miracle from Allah and a visible proof standing before the eyes of the people. She was not merely an unusual animal. She was a divine sign tied directly to the truthfulness of Prophet Salih (peace be upon him).

Then came the command that turned the miracle into a test: do not harm her. She was to graze in Allah's land, and there was to be an appointed sharing of water. One day was for her drinking, and another day was for the people. This meant the miracle was not just to amaze them for a moment. It was meant to test whether they would obey Allah after seeing the sign they had demanded.`,
			},
			{
				title: "Part 5: A sign becomes a test of character",
				body: `For a period of time, the sign stood among them. They saw it. They knew what it meant. They understood the command tied to it. Yet the deeper sickness in their hearts remained. The problem with Thamud was not lack of evidence. It was hatred of limits. They wanted the sign, but they did not want the obedience that came with the sign.

This is why the story of Prophet Salih (peace be upon him) is so relevant: some people are impressed by religion only until religion begins to regulate their desires, their resources, and their pride. Once obedience costs them something, admiration turns into resentment.`,
			},
			{
				title: "Part 6: They kill the she-camel and challenge the prophet",
				body: `Eventually the arrogant among them conspired against the she-camel and killed her. This was not a small act of disobedience. It was direct aggression against a sign of Allah. They had asked for a miracle, received it, and then attacked it when it required humility from them.

After killing the she-camel, they spoke with even greater boldness and demanded that Prophet Salih (peace be upon him) bring the punishment if he were truthful. This is how arrogance behaves when it reaches its ugliest stage: it sins openly and then mocks the warning that follows.`,
			},
			{
				title: "Part 7: The final three-day warning",
				body: `Prophet Salih (peace be upon him) then gave them a clear and final warning: enjoy yourselves in your homes for three days. That was not vague language. It was a countdown. It was mercy in the form of one last notice before punishment.

Even then, the story shows that people who have hardened themselves may hear the clearest warning and still not return. Delay can become a trap. A sinner thinks there is still time, then more time, then later. But when Allah's decree arrives, the time for repentance closes with it.`,
			},
			{
				title: "Part 8: Plots against Prophet Salih (peace be upon him)",
				body: `Ibn Kathir also records that some among them went beyond attacking the sign and plotted against Prophet Salih (peace be upon him) himself and against his household. That reveals the full moral collapse of the people. When falsehood cannot bear truth, it moves from mockery to violence.

But no conspiracy can overtake the decree of Allah. The same people who believed themselves secure in stone houses and tribal power were already moving under a judgment from which none of their planning could save them.`,
			},
			{
				title: "Part 9: The cry and the destruction of Thamud",
				body: `Then the punishment came. A terrible cry and overwhelming blast struck them, and the people of Thamud fell lifeless in their homes. The very houses carved into the mountains, the symbols of their confidence and technical power, became silent witnesses against them.

This ending carries one of the strongest lessons in prophetic history: skill, architecture, and worldly advancement cannot protect a people who rebel against Allah. Their knowledge of stone could not shield them from the Lord who created stone, mountain, sky, and soul.`,
			},
			{
				title: "Part 10: The believers are saved and the lesson remains",
				body: `Prophet Salih (peace be upon him) and the believers were saved by Allah's mercy. Those who obeyed did not survive because they had superior physical strength or better buildings. They survived because Allah protects the people of faith.

The story of Prophet Salih (peace be upon him) remains a warning for every later generation: do not become proud of your civilization, your technology, or your ability. If those gifts do not lead to humility before Allah, they can become part of the evidence against you. The people of Thamud were strong, but their arrogance was stronger, and that arrogance destroyed them.`,
			},
			{
				title: "Moral lessons",
				body: ` Blessings can become a path to arrogance if they are not tied to gratitude.

 Miracles do not benefit the person who has already decided to reject the truth.

 Allah's signs must be honored, not tested with rebellion.

 Delaying repentance after clear warning is dangerous.

 Human skill and technology cannot protect anyone from Allah's decree.

 Allah always saves the believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Thank Allah this week for one ability or skill you usually take for granted.

 If you are corrected about a wrong action, respond early instead of delaying repentance.

 Read Qur'an 7:73-79, 11:61-68, and 91:11-15.

 Reflect on one area where success could make a person proud, and write how to protect yourself with gratitude.

 Treat every sign of Allah, whether in revelation or life, with respect instead of casual neglect.`,
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
			"Prophet Lut (peace be upon him) was sent to a people who had fallen into shocking and open corruption. His story is one of lonely truth-telling in the face of public immorality, mockery, and social collapse. Ibn Kathir describes his courage, the betrayal inside his own home, the arrival of the angels, the final night escape, and the destruction that came upon a people who refused purity and fought against guidance.",
		sections: [
			{
				title: "Part 1: A people who normalized corruption",
				body: `Prophet Lut (peace be upon him) was sent to a people whose society had become deeply diseased. Their sin was not hidden shame followed by repentance. It had become open behavior, public identity, and collective pride. Ibn Kathir explains that they committed acts no people before them had made into a public way of life. Their corruption touched desire, public gatherings, and even how they treated travelers and guests.

That is one of the frightening things about their story: evil had stopped feeling evil to them. When a society reaches that point, warning becomes harder because people no longer feel they need to be corrected. They begin to defend the very behavior that is destroying them.`,
			},
			{
				title: "Part 2: Prophet Lut (peace be upon him) speaks the truth openly",
				body: `Into this dark atmosphere Allah sent Prophet Lut (peace be upon him). He did not soften the truth until it lost meaning, and he did not speak in vague language that avoided the real sickness of the people. He confronted them directly and told them that they were committing an immorality no one among the worlds had done before them in that way.

This took enormous courage. Prophet Lut (peace be upon him) was standing against a community, a culture, and a public mindset. Yet he remained a prophet: clear, principled, and unashamed of revelation. His story teaches that mercy does not mean hiding the truth. It means speaking the truth because souls are in danger.`,
			},
			{
				title: "Part 3: The call to purity became a reason for mockery",
				body: `Prophet Lut (peace be upon him) called them to purity, obedience, and fear of Allah. He did not simply condemn their evil; he invited them to something better. But the people had fallen so far that purity itself began to offend them. They mocked him and treated his righteousness as a threat.

One of the most shocking lines in his story is that they wanted to expel the family of Prophet Lut (peace be upon him) because they wanted to remain pure. That is the reversal created by corruption: the clean become strangers, and the shameless become the judges of society. Once that reversal becomes normal, destruction draws near.`,
			},
			{
				title: "Part 4: Loneliness in calling to Allah",
				body: `Very few people believed in Prophet Lut (peace be upon him). The city heard his warnings again and again, but most people preferred desire to truth. This made his mission one of the loneliest prophetic missions. He was not supported by crowds, and he did not see large numbers responding around him.

Even more painful, the test reached into his own home. A prophet can guide, warn, and teach, but he cannot force faith into hearts. This is an important part of the story: truth is not measured by numbers. A prophet may stand nearly alone and still be completely right before Allah.`,
			},
			{
				title: "Part 5: Betrayal inside the house",
				body: `The wife of Prophet Lut (peace be upon him) did not stand with revelation. She did not carry the mission of her husband, and she did not share his concern for purity and obedience. Ibn Kathir explains that her betrayal was not one of immorality in the marital sense, but betrayal of faith and loyalty to the prophetic mission. She supported the sinful people and informed them when guests came to the house.

This makes her one of the clearest warnings in the Qur'an: closeness to a prophet is worthless without faith. Living in the same house as a righteous person does not save anyone who sides with falsehood. That is why Allah mentions the wife of Prophet Lut (peace be upon him) as an example for those who disbelieve.`,
			},
			{
				title: "Part 6: The angels arrive as honored guests",
				body: `Then came the final and decisive test. Angels arrived in the form of handsome young men as guests to Prophet Lut (peace be upon him). The moment he saw them, he felt fear and distress. He knew exactly what kind of people lived around him, and he feared for his guests before he feared for himself.

He brought them into his house, but the betrayal inside the home moved quickly. His wife informed the people. Soon the city that had rejected every moral warning came rushing toward the house, not in repentance, not in curiosity, but in pursuit of sin. The scene grew more tense by the moment.`,
			},
			{
				title: "Part 7: Prophet Lut (peace be upon him) stands at the door",
				body: `Prophet Lut (peace be upon him) stood between the mob and his guests. He pleaded with them to fear Allah and not disgrace him concerning those under his protection. It was a painful and humiliating moment for a prophet: to stand at the door of his own house while his people pressed forward in shamelessness.

But at the exact point when the situation seemed most desperate, the guests revealed the truth. They were messengers from Allah. The people were struck and prevented from reaching what they intended. Here the story shows a repeated divine pattern: Allah may delay relief, but when relief comes, it comes with perfect precision.`,
			},
			{
				title: "Part 8: The command to leave before dawn",
				body: `The angels then gave Prophet Lut (peace be upon him) the command that would separate the saved from the destroyed: leave at night with the believers from your family, and let no one look back. But one person would not be saved: his wife. She belonged inwardly to the people of corruption, so she would share their end.

The departure of Prophet Lut (peace be upon him) from the city must have been filled with urgency, silence, and heaviness. Every step away from the city was a step toward safety, but also a witness that the people had chosen their fate by refusing every call to return to Allah.`,
			},
			{
				title: "Part 9: The city is overturned",
				body: `Then the punishment of Allah came. The town was turned upside down, and stones of baked clay were sent down upon the people. Their homes, their streets, and their confidence collapsed under a decree they had mocked when they demanded that the punishment be brought.

The wife of Prophet Lut (peace be upon him) was destroyed with them because she had chosen their side against revelation. This ending is severe, but its justice is clear. The people were not destroyed without warning. They had been warned, reminded, confronted, and given time. But when corruption becomes stubborn after proof has come, punishment follows.`,
			},
			{
				title: "Part 10: What remains after the smoke clears",
				body: `Only Prophet Lut (peace be upon him) and the believers were saved. The people who had once mocked him disappeared, while the one they treated as weak was carried out by Allah's mercy. This is one of the great endings of the prophetic stories: survival does not belong to the powerful, but to those protected by Allah.

The story of Prophet Lut (peace be upon him) remained as a warning for generations after him. It teaches that shamelessness, public corruption, hostility to purity, and rejection of the prophets are not small social problems. They are signs of a society moving toward ruin. And it teaches something else just as clearly: Allah never abandons the obedient believers, even when they seem to stand almost alone.`,
			},
			{
				title: "Moral lessons",
				body: ` When evil becomes public and defended, a society becomes spiritually dangerous.

 Purity may be mocked by corrupt people, but it remains honorable before Allah.

 Supporting falsehood is betrayal, even without committing the sin directly.

 Family ties do not save anyone without faith.

 Allah's relief may come late in appearance, but never late in reality.

 Allah always saves the obedient believers.`,
			},
			{
				title: "Practical actions for students",
				body: ` Stay away from places where shameless sin is celebrated as normal.

 Practice speaking truth respectfully even when it is unpopular.

 Never defend a wrong action just because the wrongdoer is close to you.

 Read Qur'an 7:80-84, 11:77-83, and 66:10.

 Make one concrete effort this week to protect purity in your speech, media, and friendships.`,
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
		shortIntro:
			"Prophet Ayyub (peace be upon him) was tested in wealth, family, and health for a long period, yet he remained thankful and returned constantly to Allah. Ibn Kathir highlights his discipline, gentle dua, and Allah's complete restoration and praise: 'Indeed, We found him patient. What an excellent servant.'",
		sections: [
			{
				title: "Part 1: A righteous servant blessed by Allah",
				body: `Ayyub was a righteous prophet from a noble lineage. Ibn Kathir describes him as a man of worship, gratitude, and service.\n\nAllah had blessed him with family, livestock, land, health, and good reputation. He used these blessings in obedience and charity.\n\nHis early life teaches that blessings are a trust, not a reason for pride.`,
			},
			{
				title: "Part 2: The first test - loss of wealth",
				body: `Allah tested Ayyub by removing his wealth. His fields, flocks, and possessions were gone.\n\nAyyub did not rebel, accuse, or despair. He knew Allah gives and Allah takes with perfect wisdom.\n\nHis response was sabr with worship, not sabr with bitterness.`,
			},
			{
				title: "Part 3: The second test - loss of children",
				body: `Ayyub was then tested with the loss of his children. This grief is among the hardest trials for any parent.\n\nYet he stayed firm upon faith, hoping for Allah's reward and meeting in the Hereafter.\n\nHe recognized that people and possessions are not owned by us absolutely; all return to their Creator.`,
			},
			{
				title: "Part 4: The third test - a long and painful illness",
				body: `After those losses, Ayyub faced a prolonged illness. Ibn Kathir mentions that his trial became very severe and long.\n\nPeople distanced themselves from him. His body weakened, but his heart remained alive with dhikr and trust.\n\nHis story separates physical weakness from spiritual weakness. The body may break, but faith can remain strong.`,
			},
			{
				title: "Part 5: His faithful wife and continued remembrance",
				body: `During this period, his wife remained loyal and served him with patience. She worked and cared for him despite hardship.\n\nAyyub kept worshipping Allah and guarding his tongue from objection to divine decree.\n\nThis part of the story teaches family loyalty in hardship and spiritual discipline under pressure.`,
			},
			{
				title: "Part 6: The humble dua without complaint",
				body: `After long suffering, Ayyub made one of the most beautiful duas in the Qur'an: "Indeed, harm has touched me, and You are the Most Merciful of the merciful" (Qur'an 21:83).\n\nHe did not demand, argue, or accuse. He simply confessed need and praised Allah's mercy.\n\nThis is adab in dua: humility, hope, and trust.`,
			},
			{
				title: "Part 7: Allah's command - strike the ground",
				body: `Allah answered him and commanded: "Strike with your foot; here is cool water to wash and drink" (Qur'an 38:42).\n\nA spring appeared by Allah's command. Ayyub washed and drank from it.\n\nThe cure came from Allah alone, but with a practical action from Ayyub. This combines tawakkul and action.`,
			},
			{
				title: "Part 8: Complete restoration of health and strength",
				body: `Allah removed his suffering completely and restored his health and dignity.\n\nThe Qur'an states: "So We answered him and removed what was with him of harm, and We gave him back his family and the like of them with them, as mercy from Us" (Qur'an 21:84).\n\nRestoration after patience is one of the great themes of this story.`,
			},
			{
				title: "Part 9: Restoration of family and blessings",
				body: `Allah restored his family life and multiplied his blessings. Ibn Kathir explains that Allah compensated Ayyub with both return and increase.\n\nThis teaches that Allah can return what was lost, replace what was lost, or reserve the reward for the Hereafter - all are mercy.\n\nBelievers are not promised an easy path, but they are promised perfect justice from their Lord.`,
			},
			{
				title: "Part 10: The oath and Allah's mercy through ease",
				body: `Ayyub had made an oath during hardship. After healing, Allah gave him a merciful legal ease: "Take in your hand a bundle and strike with it, and do not break your oath" (Qur'an 38:44).\n\nThen Allah praised him: "Indeed, We found him patient. What an excellent servant. Indeed, he was always turning back [to Allah]" (Qur'an 38:44).\n\nHis story ends not with pain, but with honor.`,
			},
			{
				title: "Moral lessons",
				body: ` Hardship is not proof of Allah's anger; it can be elevation for believers.\n\n Patience is not passive - it is disciplined worship under pressure.\n\n Complaining to Allah in dua is worship; complaining about Allah is dangerous.\n\n Family support during trials is part of righteous character.\n\n Allah can heal and restore in ways beyond expectation.`,
			},
			{
				title: "Practical actions for students",
				body: ` Memorize and repeat Ayyub's dua this week: "Rabbi anni massaniya ad-durru wa anta arham ar-rahimin" (Qur'an 21:83).\n\n When stressed, avoid negative speech and replace it with dhikr and dua.\n\n Visit or message one sick person and support them practically.\n\n Keep one worship habit consistent for 7 days to train sabr.\n\n Write one page on how tests can increase faith instead of decrease it.`,
			},
		],
		quranSurahs: ["Sad (Sura 38)", "Al-Anbiya (Sura 21)"],
	},
	"dhul-kifl": {
		shortIntro:
			"Prophet Dhul-Kifl (peace be upon him) is one of the more quietly mentioned prophets in the Qur'an, yet Allah honored him with magnificent praise by naming him among the patient and the excellent. The reports mentioned by Ibn Kathir present him as a man of covenant, discipline, justice, and astonishing self-control: one who accepted a difficult responsibility when others could not, ruled fairly, kept a life of fasting and night prayer, and would not allow anger to defeat him. His story is not about dramatic conquest, but about something rarer: steady faithfulness.",
		sections: [
			{
				title: "Part 1: Praised by Allah even with few details",
				body: `The story of Prophet Dhul-Kifl (peace be upon him) begins with something very important: Allah mentioned him in the Qur'an with honor. Allah placed him among those known for patience and among those described as excellent. This alone gives him a high and noble rank.

Ibn Kathir notes that some scholars considered him a prophet, while some described him as an exceptionally righteous and just man. What is certain is that Allah praised him. And when Allah praises someone in the Qur'an, that praise is more valuable than long stories without certainty.`,
			},
			{
				title: "Part 2: A heavy responsibility no one wanted",
				body: `The historical reports preserved by Ibn Kathir describe a moment when an elderly prophet among the Children of Israel needed someone to take on a crushing responsibility after him. This was not just a title or public position. It was a life of sacrifice.

The conditions were severe: the one who took this role would judge between people with justice, fast during the day, pray at night, and never give in to anger. Many people may desire leadership when it brings honor, but very few accept it when it comes wrapped in worship, patience, burden, and accountability.`,
			},
			{
				title: "Part 3: When others stepped back, Prophet Dhul-Kifl (peace be upon him) stepped forward",
				body: `The reports say that when others failed to carry these conditions, Prophet Dhul-Kifl (peace be upon him) accepted them. He did not step forward because the burden was easy. He stepped forward because he feared Allah and trusted that divine help would carry him through what human strength alone could not bear.

This is one of the most powerful moments in his story. Greatness often begins when a person says yes to a difficult amanah that others avoid.`,
			},
			{
				title: "Part 4: A life built on justice and covenant",
				body: `After taking that responsibility, Prophet Dhul-Kifl (peace be upon him) became known for justice among his people. He did not bend rulings for the rich, overlook wrongdoing because of status, or allow private feelings to shape public judgment.

The meaning often attached to his name points toward sufficiency, responsibility, or a double portion of burden or reward. In the spirit of these reports, his life appears as the life of a man who carried what others could not and remained reliable under the weight of duty.`,
			},
			{
				title: "Part 5: Fasting by day and prayer by night",
				body: `The reports about Prophet Dhul-Kifl (peace be upon him) describe him as a man of intense discipline. He did not separate leadership from worship. During the day he fasted. During the night he stood in prayer. Between those two acts, he judged among the people and carried their affairs.

This made his life a continuous act of obedience. His public authority was supported by private worship, and his private worship strengthened his public justice. That combination is rare, and it is one reason his story remains so striking.`,
			},
			{
				title: "Part 6: The real battlefield was anger",
				body: `One of the best-known reports about Prophet Dhul-Kifl (peace be upon him) is that Shaytan tried hard to break him through anger. This is deeply meaningful. Shaytan did not test him only through wealth or fear or laziness. He targeted the part of leadership that ruins many good people: losing control of the self.

Again and again the provocation came, at difficult times and in frustrating moments, trying to make him snap, become unfair, or betray the calm discipline he had promised to maintain.`,
			},
			{
				title: "Part 7: Prophet Dhul-Kifl (peace be upon him) defeated Shaytan without a sword",
				body: `But Prophet Dhul-Kifl (peace be upon him) remained patient. He did not let anger drive him. He did not let irritation become injustice. He did not allow provocation to turn into sin. In this way, he defeated one of the hardest enemies a human being faces: the undisciplined self when it is inflamed by anger.

This is part of what makes his story so powerful. There is no giant battlefield here, no public spectacle. Yet the victory is immense. To control anger when one has authority is among the greatest forms of strength.`,
			},
			{
				title: "Part 8: Allah named him among the patient and the excellent",
				body: `The Qur'an honors Prophet Dhul-Kifl (peace be upon him) in two beautiful ways. Allah places him among those who were patient, and Allah also places him among those who were excellent. These two praises summarize his whole story.

He was patient in worship, patient in leadership, patient in covenant, patient in self-control, and patient under testing. And because of that patience, he rose to the rank of excellence. Not loud greatness, but deep greatness. Not fame, but honor with Allah.`,
			},
			{
				title: "Part 9: Why his story matters so much",
				body: `The story of Prophet Dhul-Kifl (peace be upon him) matters because many people imagine greatness only in dramatic acts. But his story teaches another form of greatness: keeping your word, staying disciplined when no one sees you, ruling fairly when emotions pull hard, and continuing worship when duty is exhausting.

He shows that constancy can be more difficult than excitement, and more beloved to Allah than display.`,
			},
			{
				title: "Moral lessons",
				body: ` Greatness often appears in consistency rather than spectacle.

 Keeping a covenant with Allah is a sign of strong faith.

 The ability to control anger is one of the highest forms of strength.

 Leadership without worship becomes dangerous, and worship without responsibility can become incomplete.

 Allah honors those who remain patient, disciplined, and just over time.`,
			},
			{
				title: "Practical actions for students",
				body: ` Keep the promises you make, especially the ones connected to Allah.

 Train yourself to pause when angry before speaking or reacting.

 Build a steady routine of worship instead of depending only on bursts of motivation.

 Be fair when judging between friends, classmates, or siblings.

 Respect quiet people of discipline, because Allah may raise them higher than the famous.`,
			},
		],
		quranSurahs: ["Al-Anbiya (Sura 21)", "Sad (Sura 38)"],
	},
	dawud: {
		shortIntro: "Prophet Dawud (peace be upon him) was both a prophet and a king, a man in whom Allah joined courage, worship, wisdom, justice, and humility. His story begins with a young believer stepping forward when trained warriors were afraid, then unfolds into one of the most beautiful lives of leadership in the Qur'an: defeating Jalut by Allah's permission, receiving kingship and prophethood, singing the praises of Allah until mountains and birds echoed with him, ruling with justice, repenting immediately when tested, and raising Prophet Sulayman (peace be upon him) to continue the legacy after him.",
		sections: [
			{
				title: "Part 1: A fearful battlefield and a young believer",
				body: `The story of Prophet Dawud (peace be upon him) begins at a moment of fear and tension among the Children of Israel. Their enemy was led by the mighty Jalut, a giant warrior whose strength terrified soldiers before battle had even begun. Men looked at his size, his armor, and his reputation and felt their courage collapse.

It was in this atmosphere that a young man stepped forward. He was not yet a king, not a famous commander, and not the one anyone expected to save the day. He was Dawud (peace be upon him), still young, but carrying something more powerful than military experience: complete trust in Allah.`,
			},
			{
				title: "Part 2: Prophet Dawud (peace be upon him) faces Jalut",
				body: `When everyone else hesitated, Prophet Dawud (peace be upon him) offered himself to face Jalut. He had already learned courage in a quieter place, protecting the sheep of his family and confronting danger in the open land. So when the battlefield came, he did not see himself as weak. He saw Allah as sufficient.

He did not depend on heavy armor or the appearance of strength. He carried simple means, but his heart was full of certainty. This is one of the strongest moments in his story: a young servant standing before a giant, not with pride in himself, but with trust in his Lord.`,
			},
			{
				title: "Part 3: Jalut falls and history changes",
				body: `By Allah's permission, Prophet Dawud (peace be upon him) struck Jalut down and killed him. The Qur'an records the turning point with powerful simplicity: "So they defeated them by permission of Allah, and Dawud killed Jalut." (Qur'an 2:251)

This was more than a military victory. It was the moment Allah raised Prophet Dawud (peace be upon him) before his people and changed the course of his life. The giant who terrified armies fell before a young believer because victory does not belong to size, weapons, or appearances. It belongs to Allah alone.`,
			},
			{
				title: "Part 4: From victory to prophethood and kingship",
				body: `After this victory, Allah granted Prophet Dawud (peace be upon him) both kingship and wisdom. In time, he became not only a ruler but also a prophet charged with guiding people by revelation. The Qur'an says that Allah gave him the kingdom, wisdom, and taught him what He willed.

This joining of prophethood and kingship is one of the special features of his story. He was not merely a spiritual teacher far from public affairs, nor merely a ruler concerned with worldly power. He was both: a servant who governed by truth and a prophet who ruled with fear of Allah.`,
			},
			{
				title: "Part 5: The Zabur, the mountains, and the birds",
				body: `Allah gave Prophet Dawud (peace be upon him) the Zabur and blessed him with an extraordinarily beautiful voice. When he recited and glorified Allah, something remarkable happened: the mountains echoed his tasbih, and the birds gathered and joined in praise.

Imagine the scene: a prophet standing in worship, his voice filled with sincerity, the natural world around him brought into harmony by Allah's command. This is one of the most moving images in his story. His kingship did not distance him from worship. It deepened it. And his worship became so beloved that creation itself seemed to respond.`,
			},
			{
				title: "Part 6: A king whose heart belonged to worship",
				body: `Prophet Dawud (peace be upon him) was known for deep devotion to Allah. The Prophet Muhammad described his worship as a model: he fasted every other day and stood much of the night in prayer. Even while carrying the burdens of rule, justice, and public responsibility, he remained a man of constant return to Allah.

This balance is one of the greatest lessons of his story. He did not say that public leadership excused him from private worship. Nor did he let worship become an excuse to neglect the needs of people. He carried both.`,
			},
			{
				title: "Part 7: Strength, skill, and humble labor",
				body: `Allah gave Prophet Dawud (peace be upon him) not only spiritual excellence but physical strength and practical skill. Allah softened iron for him and taught him how to make coats of armor that would protect people in battle. This was a gift of technology, craftsmanship, and service.

Yet even as king, Prophet Dawud (peace be upon him) did not live as a man spoiled by power. Reports describe him earning through the work of his own hands rather than depending arrogantly on the wealth of rule. This made his leadership cleaner, humbler, and more sincere.`,
			},
			{
				title: "Part 8: The test of judgment and immediate repentance",
				body: `One day, while Prophet Dawud (peace be upon him) was in his place of worship, two disputants suddenly came before him. One complained that the other, who had many sheep, wanted to take his single sheep as well. Prophet Dawud (peace be upon him) responded quickly, recognizing the apparent injustice.

Then he realized that Allah had tested him. He had judged before hearing fully from the other side. This is what makes his story so noble: the moment he understood, he did not defend himself, justify himself, or hide behind his status. He immediately sought forgiveness from Allah, fell in repentance, and returned to his Lord.

Allah forgave him and taught him again to judge between people in truth and not to follow desire.`,
			},
			{
				title: "Part 9: What made Prophet Dawud (peace be upon him) great",
				body: `The greatness of Prophet Dawud (peace be upon him) was not that he never faced challenge, nor that he possessed power. His greatness was that every blessing increased his obedience, and every test drove him back to Allah more quickly. The Qur'an praises him as strong, patient, and constantly returning to Allah.

He ruled with justice, worshipped with sincerity, worked with humility, repented with speed, and used every gift as an amanah. This is why he remains one of the most complete examples of leadership under revelation.`,
			},
			{
				title: "Part 10: His legacy and the preparation of Sulayman",
				body: `Allah blessed Prophet Dawud (peace be upon him) with a righteous son, Prophet Sulayman (peace be upon him), who inherited knowledge, prophethood, and dominion after him. Even before his death, signs of Sulayman's wisdom began to appear, showing that the house of Dawud would continue as a house of gratitude and guidance.

So the story of Prophet Dawud (peace be upon him) ends not only with his own excellence, but with a legacy passed forward: power joined to worship, judgment joined to humility, and leadership joined to gratitude. After him came Prophet Sulayman (peace be upon him), continuing the line of a father whose life had already become a lesson for all generations.`,
			},
			{
				title: "Moral lessons",
				body: ` Courage is strongest when it comes from trust in Allah rather than trust in self.

 Leadership becomes noble when joined to worship, humility, and justice.

 Talents and practical skills are gifts from Allah and should be used to benefit people.

 A great believer repents immediately when shown a mistake.

 True success is not fame or kingship, but being a servant who constantly returns to Allah.`,
			},
			{
				title: "Practical actions for students",
				body: ` Face difficult situations with trust in Allah instead of fear of appearances.

 Build both private worship and public responsibility together.

 Use your skills to help and protect others, not only to impress them.

 Listen carefully before judging between people or taking sides.

 When you make a mistake, repent quickly instead of defending your ego.`,
			},
		],
		quranSurahs: ["Al-Baqarah (Sura 2)", "Al-Anbiya (Sura 21)", "Saba (Sura 34)", "Sad (Sura 38)", "Al-Isra (Sura 17)"],
	},
	sulayman: {
		shortIntro: "Prophet Sulayman (peace be upon him) was the son of Prophet Dawud (peace be upon him) and one of the most extraordinary kings and prophets in history. Allah gave him wisdom, judgment, prophethood, and a kingdom unlike any other: the wind obeyed him, the jinn worked under his command, birds and animals were understood by him, and rulers were brought to submit before the truth he carried. Yet the beauty of his story is not merely power. It is the way Prophet Sulayman (peace be upon him) kept returning every blessing back to Allah with humility, gratitude, and obedience.",
		sections: [
			{
				title: "Part 1: Wisdom appeared in him while still young",
				body: `Even before becoming king, Prophet Sulayman (peace be upon him) showed signs of unusual wisdom. Ibn Kathir mentions the famous case of the field damaged by sheep, when a dispute was brought before Prophet Dawud (peace be upon him). Allah inspired Prophet Sulayman (peace be upon him) with a more balanced judgment: the field should be restored while the owners benefited fairly in the meantime.

The Qur'an says: "And We gave understanding of it to Sulayman, and to each of them We gave judgment and knowledge." (Qur'an 21:79)

This early moment is important. It shows that his greatness did not begin only with kingship. Allah had already placed in him the mind of a prophet and the insight of a ruler.`,
			},
			{
				title: "Part 2: He inherited prophethood and dominion from Dawud",
				body: `After the death of Prophet Dawud (peace be upon him), Prophet Sulayman (peace be upon him) inherited prophethood and dominion. This inheritance was not about wealth, because prophets do not leave behind worldly inheritance for their families. It was the inheritance of knowledge, leadership, sacred responsibility, and rule by revelation.

The Qur'an says: "And Sulayman inherited Dawud." (Qur'an 27:16)

With that inheritance came enormous responsibility. He was now both prophet and king, carrying the burden of justice over people and the burden of faith before Allah.`,
			},
			{
				title: "Part 3: His remarkable dua for a unique kingdom",
				body: `Prophet Sulayman (peace be upon him) turned to Allah with a remarkable dua. After trial, repentance, and return to his Lord, he asked: "My Lord, forgive me and grant me a kingdom that will not belong to anyone after me. Indeed, You are the Bestower." (Qur'an 38:35)

Allah answered this dua and gave him a kingdom unlike any other. But this kingdom was not given as luxury for its own sake. It was a test, a trust, and a sign. Through it, Allah would show the world what power looks like when it belongs to a prophet who remains a grateful servant.`,
			},
			{
				title: "Part 4: The wind, the jinn, and the vast kingdom",
				body: `Allah subjected the wind to Prophet Sulayman (peace be upon him), carrying him vast distances with astonishing speed. A morning journey could cover what normally took a month, and an evening journey could cover another month.

Allah also subjected the jinn to him. They built structures, worked with metal, dived into the sea, and carried out difficult labor by Allah's permission. This made Prophet Sulayman (peace be upon him) ruler over a kingdom unlike anything people had seen: armies of human beings, jinn, and birds, all organized under divine favor.

Yet even in such magnificence, his story is never the story of self-worship. Again and again, he attributes everything back to Allah.`,
			},
			{
				title: "Part 5: The language of birds and the gratitude of a prophet",
				body: `Allah taught Prophet Sulayman (peace be upon him) the language of birds and gave him understanding of creatures in a way no ordinary ruler could possess. He announced this gift openly, but not with arrogance. Rather, he said it as recognition of Allah's favor: that they had been taught the speech of birds and given from all things.

This is one of the most striking features of his story. Every time power increases, gratitude also increases. Prophet Sulayman (peace be upon him) never lets extraordinary gifts turn into pride. Instead, they deepen his awareness that he is being tested by Allah.`,
			},
			{
				title: "Part 6: The ant in the valley",
				body: `One of the most beautiful scenes in the story of Prophet Sulayman (peace be upon him) is the moment his army approached a valley of ants. One ant warned the others to enter their dwellings so that Sulayman and his army would not crush them unknowingly.

When Prophet Sulayman (peace be upon him) heard her words, he smiled. But he did not respond with amusement alone. He immediately turned to Allah in gratitude and made dua that he be enabled to thank Allah for His favor and to do righteous deeds that please Him.

This scene reveals his heart. A lesser ruler might have been entertained by his own power. Prophet Sulayman (peace be upon him) heard the ant and remembered Allah.`,
			},
			{
				title: "Part 7: The missing hoopoe and the news of Sheba",
				body: `Then came one of the most dramatic episodes of his life. While inspecting the birds, Prophet Sulayman (peace be upon him) noticed that the hoopoe was missing. He demanded an explanation, and when the bird returned, it brought astonishing news: far away in Sheba there was a queen with a great throne and a prosperous kingdom, but she and her people worshipped the sun instead of Allah.

The hoopoe's report immediately turned into a mission of da'wah. Prophet Sulayman (peace be upon him) sent a letter calling the queen not to exalt herself against him, but to come in submission to Allah. His concern was not treasure, conquest, or pride. It was that a powerful people had turned their worship away from the Creator.`,
			},
			{
				title: "Part 8: Bilqis, the throne, and submission to Allah",
				body: `The Queen of Sheba, Bilqis, responded intelligently. She consulted her advisors, tested the situation with gifts, and eventually traveled to meet Prophet Sulayman (peace be upon him). But before she arrived, one of the greatest signs in his story occurred: her throne was brought before him in an instant by one who had knowledge from the Book.

When Prophet Sulayman (peace be upon him) saw this, he did not boast. He said: "This is from the favor of my Lord to test me whether I will be grateful or ungrateful." (Qur'an 27:40)

Then Bilqis entered his palace and saw wonders that shattered her previous worldview. She realized that this was not the kingdom of a magician or a vain tyrant. This was a prophet supported by Allah. At last she declared: "My Lord, indeed I have wronged myself, and I submit with Sulayman to Allah, Lord of the worlds." (Qur'an 27:44)

This was one of the greatest victories of his mission: not merely political success, but the guidance of a ruler and her people toward Allah.`,
			},
			{
				title: "Part 9: His kingdom was power under worship",
				body: `The life of Prophet Sulayman (peace be upon him) teaches that power itself is not evil. What matters is who it belongs to and how it is used. In his case, authority served worship, justice, reform, organization, and gratitude. He ruled a kingdom of immense strength, yet remained a servant who kept returning to Allah.

Even moments that could have become distractions, like his admiration for fine horses, became occasions of repentance, reflection, and turning back to Allah. That is why the Qur'an praises him not only for dominion but for being an excellent servant who constantly returned in repentance.`,
			},
			{
				title: "Part 10: His death and the humiliation of false claims",
				body: `The death of Prophet Sulayman (peace be upon him) was itself a lesson written into history. He died while leaning upon his staff, overseeing the labor of the jinn. Yet the jinn continued working, unaware that he had already died. Only when a creature of the earth ate through his staff and his body fell did they realize the truth.

This destroyed a dangerous illusion: the claim that the jinn know the unseen. If they had known the unseen, they would never have remained in humiliating labor thinking their master still watched them. Through the death of Prophet Sulayman (peace be upon him), Allah made clear that unseen knowledge belongs to Him alone.

So his life ended just as it had been lived: as a sign, a lesson, and a proof of Allah's wisdom.`,
			},
			{
				title: "Moral lessons",
				body: ` Wisdom and leadership should begin with obedience to Allah.

 Great power becomes beautiful only when joined to gratitude and humility.

 Every blessing is a test of whether a person will be grateful or arrogant.

 Calling rulers and powerful people to Allah is part of prophetic mission.

 No one knows the unseen except Allah alone.`,
			},
			{
				title: "Practical actions for students",
				body: ` When Allah gives you a gift, train yourself to say and feel that it is from Him.

 Use ability, influence, or leadership to serve truth rather than your ego.

 Reflect on nature and creation as signs that increase gratitude.

 Do not be impressed by power unless it is connected to obedience to Allah.

 Correct false ideas about fortune-telling, hidden knowledge, and the unseen with the lesson of Sulayman's death.`,
			},
		],
		quranSurahs: ["An-Naml (Sura 27)", "Saba (Sura 34)", "Sad (Sura 38)", "Al-Anbiya (Sura 21)"],
	},
	ilyas: {
		shortIntro: "Prophet Ilyas (peace be upon him) was one of the courageous prophets sent to the Children of Israel when they had fallen into idol worship and begun calling upon Baal instead of Allah. His story is the story of a lone voice of tawhid rising in a society that had become attached to false gods, false traditions, and stubborn disbelief. He spoke with clarity, warned with courage, stood firm when only a few believed, and was honored by Allah as one of the messengers and among the righteous doers of good.",
		sections: [
			{
				title: "Part 1: Sent when the Children of Israel had drifted far away",
				body: `Prophet Ilyas (peace be upon him) was sent to the Children of Israel in a period when they had once again drifted away from the worship of Allah. After generations of prophets and guidance, many among them had grown weak in faith and had opened the door to corruption and idol worship.

Ibn Kathir places his mission after the Israelites had already suffered repeated cycles of obedience and decline. This gave the story of Prophet Ilyas (peace be upon him) a painful background: he was not speaking to a people unfamiliar with revelation, but to a people who had known guidance and still turned away from it.`,
			},
			{
				title: "Part 2: The people began worshipping Baal",
				body: `The great trial of Prophet Ilyas (peace be upon him) was that his people had become devoted to an idol called Baal. Instead of worshipping Allah, the Lord who created them, sustained them, and controlled all things, they directed their reverence and dependence toward a powerless false god.

This was not a small mistake. It was a direct collapse into shirk. A people who should have remembered Allah through revelation had allowed superstition, custom, and false worship to take root in their society.`,
			},
			{
				title: "Part 3: Prophet Ilyas (peace be upon him) confronted them openly",
				body: `Prophet Ilyas (peace be upon him) did not hide the truth or soften it until it lost its meaning. He stood before his people and called them directly back to Allah. The Qur'an preserves his challenge in words full of force and clarity:

"Will you not fear Allah? Do you call upon Baal and leave the Best of creators, Allah, your Lord and the Lord of your forefathers?" (Qur'an 37:124-126)

These words cut through the heart of the matter. Why call upon an idol when Allah alone is the Creator? Why cling to a false object of worship when the Lord of the worlds is the One who created their fathers and would judge them all?`,
			},
			{
				title: "Part 4: He reminded them who truly controls life",
				body: `Prophet Ilyas (peace be upon him) reminded his people that Baal had no power at all. It could not give life, bring death, send provision, hear prayer, remove harm, or grant benefit. It was only an idol around which people had built delusion, ritual, and inherited falsehood.

Allah alone is the Creator, the Sustainer, and the Lord of all causes. By returning again and again to this truth, Prophet Ilyas (peace be upon him) was not merely arguing against one idol. He was tearing down an entire false worldview built on dependence upon other than Allah.`,
			},
			{
				title: "Part 5: The courage of his warning",
				body: `Calling a society away from its public idol is never an easy task. Baal worship was not only a private belief; it had become part of the social order. To challenge it was to challenge pride, custom, and power all at once.

Yet Prophet Ilyas (peace be upon him) warned them without fear. He told them clearly that worshipping false gods would lead to Allah's punishment, and that safety lay only in repentance, sincerity, and returning to tawhid. His warning came from mercy, not anger. He wanted to save them before judgment came.`,
			},
			{
				title: "Part 6: Most of the people rejected him",
				body: `Despite the clarity of his message, the majority of the people rejected Prophet Ilyas (peace be upon him). They mocked him, clung to their old practices, and preferred inherited falsehood over revealed truth. This is one of the saddest patterns in prophetic history: people often defend the very things destroying them.

The story of Prophet Ilyas (peace be upon him) therefore becomes a story of standing against the crowd. He did not measure truth by numbers. He remained firm because truth comes from Allah, whether many accept it or few.`,
			},
			{
				title: "Part 7: Only a small group believed",
				body: `In the midst of widespread rejection, a small group responded to the call of Prophet Ilyas (peace be upon him). They abandoned idol worship and returned to the worship of Allah alone. Though few in number, they were sincere, and that sincerity mattered more than the size of the crowd.

This detail gives the story a deeply important lesson: prophets are not judged by popularity. A small circle of truth can be greater in Allah's sight than a whole nation gathered around falsehood.`,
			},
			{
				title: "Part 8: Allah judged the deniers and saved His prophet",
				body: `The Qur'an states that the people denied Prophet Ilyas (peace be upon him), and therefore they would be brought for punishment, except for the chosen servants of Allah. This means that disbelief did not simply end as an argument. It led to consequence.

Those who rejected the prophet and persisted in worshipping Baal faced Allah's judgment. But Prophet Ilyas (peace be upon him) and the believers with him were saved. In this, Allah showed a recurring truth in the stories of the prophets: those who stand with revelation may be few, but they are never abandoned by their Lord.`,
			},
			{
				title: "Part 9: Allah honored Prophet Ilyas (peace be upon him) forever",
				body: `Allah honored Prophet Ilyas (peace be upon him) with magnificent praise in the Qur'an. Allah declared that he was among the messengers. Allah also said: "Peace be upon Ilyas." And then Allah added: "Indeed, thus do We reward the doers of good."

This is a remarkable ending. A prophet rejected by many people was given lasting honor by the Lord of the worlds. The people may have mocked, denied, or opposed him, but Allah preserved his name with peace, praise, and reward.

His story teaches that real success is not public acceptance. It is to be truthful before Allah and to leave this world having stood firmly for tawhid.`,
			},
			{
				title: "Moral lessons",
				body: ` Shirk can return when people become careless with revelation.

 A prophet's courage appears in speaking clearly against public falsehood.

 The truth does not become false because most people reject it.

 A small group of sincere believers is more valuable than a large crowd upon error.

 Allah honors those who stand firmly for tawhid even if people do not.`,
			},
			{
				title: "Practical actions for students",
				body: ` Learn to identify modern forms of false devotion that pull hearts away from Allah.

 Stand for what is true even when it is unpopular.

 Do not follow a belief or trend just because it is inherited or socially accepted.

 Stay close to sincere believers even if they are few.

 Ask Allah to make tawhid the strongest truth in your heart.`,
			},
		],
		quranSurahs: ["As-Saffat (Sura 37)", "Al-An'am (Sura 6)"],
	},
	"al-yasa": {
		shortIntro:
			"Prophet Al-Yasa (peace be upon him) was one of Allah's honored prophets from the Children of Israel, raised to continue the mission after Prophet Ilyas (peace be upon him). His story is quieter than some of the other prophets, but it carries a powerful lesson: after a great reformer passes away, someone still must remain steady, preserve the truth, and keep calling people back to Allah. Ibn Kathir presents Prophet Al-Yasa (peace be upon him) as a prophet of continuity, patience, and excellence in a time when sins were spreading and tyrants were rising.",
		sections: [
			{
				title: "Part 1: After Prophet Ilyas came Prophet Al-Yasa (peace be upon him)",
				body: `After the mission of Prophet Ilyas (peace be upon him), Allah did not leave the Children of Israel without guidance. He raised Prophet Al-Yasa (peace be upon him) to continue the work of calling people back to tawhid, obedience, and reform.

This was an important moment. Often, a community may respond strongly to one prophet, but after he passes away, people begin to slip back into old habits. That is why the role of Prophet Al-Yasa (peace be upon him) was so important. He was not starting a new religion. He was preserving the truth already revealed and keeping the people connected to the path of Allah.`,
			},
			{
				title: "Part 2: A time of growing corruption",
				body: `Ibn Kathir explains that after Prophet Ilyas (peace be upon him), dissension increased among the people. Events became more turbulent. Sins spread widely, and tyranny grew stronger. Some rulers became oppressive, and even the prophets were not safe from the violence of wicked people.

This gave the story of Prophet Al-Yasa (peace be upon him) a serious and difficult setting. He was not preaching to a calm, obedient society. He was standing in a time when moral decline had already begun to deepen.`,
			},
			{
				title: "Part 3: Close to Prophet Ilyas and shaped by struggle",
				body: `Reports mentioned by Ibn Kathir state that Prophet Al-Yasa (peace be upon him) was connected closely to Prophet Ilyas (peace be upon him). Some narrations say he was his cousin. Others mention that he had hidden with him in a cave to escape from a tyrant ruler.

Whether in kinship, companionship, or shared struggle, the message is clear: Prophet Al-Yasa (peace be upon him) was formed in an atmosphere of faith under pressure. He knew what it meant to preserve truth when falsehood had power. He did not inherit an easy mission. He inherited a dangerous one.`,
			},
			{
				title: "Part 4: He carried the same message forward",
				body: `When Prophet Al-Yasa (peace be upon him) became the prophet among his people, he called them to the same core message taught by the prophets before him: worship Allah alone, obey revelation, reject corruption, and prepare for the Hereafter.

Ibn Kathir presents him as abiding by the message and law of Prophet Ilyas (peace be upon him), not changing it and not compromising it. This itself is a form of greatness. Not every prophetic mission is remembered for dramatic miracles in public view. Some are remembered for steadfast preservation of truth.`,
			},
			{
				title: "Part 5: A prophet of steady excellence",
				body: `The Qur'an honors Prophet Al-Yasa (peace be upon him) in a very striking way. Allah mentions him among a noble line of prophets and says that they are among the chosen and the best.

That praise tells us something profound about his character. Prophet Al-Yasa (peace be upon him) was not honored because of fame among people, but because of excellence with Allah. He remained firm in worship, sound in religious understanding, and sincere in calling people to what would save them in the Hereafter.

His story teaches that consistency itself can be a form of prophetic heroism.`,
			},
			{
				title: "Part 6: Leading people when hearts are unstable",
				body: `One of the hardest tasks in religious leadership is not starting reform, but continuing it after people become tired, divided, or forgetful. Prophet Al-Yasa (peace be upon him) had to guide people whose hearts were unstable and whose society had already been damaged by sin and political oppression.

He continued teaching, correcting, warning, and reminding. He had to preserve order where disorder was spreading, and faith where negligence was rising. This required patience, courage, and a long-view commitment to Allah's cause.`,
			},
			{
				title: "Part 7: His struggle was not loud, but it was great",
				body: `There are prophets whose stories are filled with dramatic confrontations, and there are prophets whose greatness appears in quiet endurance. The story of Prophet Al-Yasa (peace be upon him) belongs to the second kind.

He remained among his people, calling them back to Allah while corruption spread and tyrants grew stronger. He did not abandon the mission because it was difficult, and he did not dilute the truth to gain acceptance. His struggle may sound quiet on the page, but in reality it was immense: to keep revelation alive in a society moving in the opposite direction.`,
			},
			{
				title: "Part 8: Allah named him among the best",
				body: `Allah says: "And remember Ismail, Al-Yasa, and Dhul-Kifl, and all are among the excellent." (Qur'an 38:48)

He is also included among those prophets whom Allah favored and guided. This is enough to show his rank. The believer may not know as many details about Prophet Al-Yasa (peace be upon him) as about Musa or Ibrahim, but Allah's praise is more than enough to establish his honor.

To be named by Allah among the excellent is a distinction greater than any worldly reputation.`,
			},
			{
				title: "Part 9: A legacy of continuity and faithfulness",
				body: `Prophet Al-Yasa (peace be upon him) completed his mission as a faithful servant of Allah. He preserved the path of truth after another prophet, carried guidance forward in a difficult age, and stood as a reminder that the work of da'wah cannot stop when circumstances become hard.

His story leaves behind a powerful legacy: not every servant of Allah is famous among people, but the ones who remain true, patient, and excellent are never forgotten by their Lord.`,
			},
			{
				title: "Moral lessons",
				body: ` Great work often means continuing the truth after others have started it.

 Not every prophet's greatness appears in dramatic public events; some shine through steady endurance.

 Reform must be preserved, not only launched.

 Allah values faithfulness, excellence, and consistency even when people overlook them.

 A difficult environment is not an excuse to abandon the mission of truth.`,
			},
			{
				title: "Practical actions for students",
				body: ` Stay consistent in worship even after initial excitement fades.

 Be willing to continue good work that others started instead of always wanting attention for yourself.

 Stand firm in truth when your environment becomes careless or negative.

 Respect quiet, faithful people who preserve goodness in a community.

 Ask Allah to make you excellent in sincerity, not just visible to others.`,
			},
		],
		quranSurahs: ["Sad (Sura 38)", "Al-An'am (Sura 6)"],
	},
	harun: {
		shortIntro: "Prophet Harun (peace be upon him) was the noble brother of Prophet Musa (peace be upon him) and one of the prophets sent to confront Pharaoh and guide Bani Isra'il. His story is one of support, eloquence, patience, and wise leadership under pressure. Ibn Kathir presents Prophet Harun (peace be upon him) as a partner in the mission of tawhid, a helper requested by Musa himself, and a prophet who faced one of the hardest internal crises in the history of Bani Isra'il when the people turned to the golden calf.",
		sections: [
			{
				title: "Part 1: A brother chosen for prophetic support",
				body: `When Allah commanded Prophet Musa (peace be upon him) to go to Pharaoh, Musa asked his Lord for help from within his own family. He asked that his brother, Prophet Harun (peace be upon him), be appointed as a minister and support for him. Musa knew Harun was more eloquent in speech and would strengthen the mission.

Allah accepted this dua. That itself is one of the great honors of Prophet Harun (peace be upon him). He was not a minor figure added later. He was chosen by Allah in response to the request of another great prophet, and he entered the struggle against tyranny as a messenger beside his brother.`,
			},
			{
				title: "Part 2: Sent with Musa to the court of Pharaoh",
				body: `Prophet Harun (peace be upon him) stood with Prophet Musa (peace be upon him) in one of the most dangerous missions ever given to prophets. They went to Pharaoh, the arrogant ruler who claimed lordship and oppressed the Children of Israel. Their task was not merely political resistance. It was the call to tawhid before one of the greatest tyrants in history.

Ibn Kathir presents their mission as united and complementary. Musa carried the major confrontation and signs, while Prophet Harun (peace be upon him) strengthened, supported, and shared in delivery of the message.`,
			},
			{
				title: "Part 3: Eloquence in the service of truth",
				body: `One of the reasons Prophet Musa (peace be upon him) asked for Prophet Harun (peace be upon him) was his clarity and eloquence in speech. This was not a worldly talent used for pride. It was a gift placed in the service of revelation.

Prophet Harun (peace be upon him) teaches that clear speech, calm explanation, and strong communication can be acts of worship when they are used to defend truth and guide people.`,
			},
			{
				title: "Part 4: Witnessing the downfall of Pharaoh",
				body: `Prophet Harun (peace be upon him) shared in the great stages of liberation for Bani Isra'il. He witnessed the struggle with Pharaoh, the exposure of falsehood before the magicians, the plagues, the exodus, and finally the drowning of Pharaoh and his army by Allah's decree.

These events were not only dramatic victories. They were lessons for the believers. Tyranny can look permanent, but Allah can destroy it in a moment.`,
			},
			{
				title: "Part 5: Left in charge during Musa's absence",
				body: `When Prophet Musa (peace be upon him) went to the appointed meeting with Allah, he left Prophet Harun (peace be upon him) in charge of Bani Isra'il. This was a heavy trust. Leadership over a difficult people is not a small matter, especially when hearts are unstable and old habits of weakness remain.

Prophet Harun (peace be upon him) was therefore not only a helper in public mission. He was also entrusted with stewardship over the community in a delicate moment.`,
			},
			{
				title: "Part 6: The crisis of the golden calf",
				body: `Then came one of the most painful scenes in the history of Bani Isra'il. During Musa's absence, the Samiri led many of the people into the worship of the golden calf. After being saved from Pharaoh and witnessing major signs, they still fell into a terrible fitnah.

Ibn Kathir shows that Prophet Harun (peace be upon him) did not remain silent in approval. He warned them clearly. He told them that they were being tested, that their Lord was the Most Merciful, and that they should follow him and obey his command.`,
			},
			{
				title: "Part 7: Patience under internal rebellion",
				body: `The people did not simply disagree with Prophet Harun (peace be upon him). They overpowered him. He feared that if he used force immediately, the community would break apart into even greater bloodshed and division before Musa returned. So he remained firm in truth while trying to contain the damage as much as possible.

This is one of the deepest lessons in his story. Leadership is not only about denouncing wrong. Sometimes it is about choosing the wisest course among dangerous options while never compromising the truth itself.`,
			},
			{
				title: "Part 8: Explaining himself to Musa",
				body: `When Prophet Musa (peace be upon him) returned and saw the people around the calf, he was overcome with anger for Allah's sake. He confronted Prophet Harun (peace be upon him) strongly. At that moment Prophet Harun (peace be upon him) answered with humility and urgency.

He explained that the people had considered him weak and were close to killing him, and that he feared causing a split among Bani Isra'il. This response shows that Prophet Harun (peace be upon him) had remained truthful, but also judged the situation according to what would prevent an even wider collapse before Musa's return.`,
			},
			{
				title: "Part 9: A prophet of mercy, truth, and restraint",
				body: `The story of Prophet Harun (peace be upon him) is not the story of cowardice. It is the story of principled restraint. Some people act harshly and call it strength. But prophetic strength includes mercy, wisdom, and control.

Ibn Kathir's account helps us understand that preserving unity does not mean approving falsehood. It means resisting falsehood in the most truthful and wise way possible when circumstances become dangerous.`,
			},
			{
				title: "Part 10: His rank among the prophets",
				body: `The Qur'an honors Prophet Harun (peace be upon him) clearly. Allah mentions him repeatedly beside Musa and identifies him as a prophet. He was not simply a righteous assistant. He was a messenger, a man of revelation, and one of the honored servants of Allah.

His role also teaches believers something beautiful about brotherhood and shared mission. Two brothers stood together in revelation, one supporting the other, each carrying the burden of truth.`,
			},
			{
				title: "Moral lessons",
				body: ` Different strengths can serve the same mission of truth.

 Supporting a righteous leader is itself a noble form of service to Allah.

 Clear warning against falsehood must be joined with wisdom and patience.

 Community crises often require restraint, not impulsive reaction.

 Preserving unity never means accepting shirk or approving corruption.`,
			},
			{
				title: "Practical actions for students",
				body: ` Support good work done by others instead of always wanting the main role.

 Use your strongest skill, speech, writing, organization, or patience, in the service of something pleasing to Allah.

 When conflict appears, tell the truth clearly but do not make the situation worse through ego.

 Read Qur'an 7:142-151, 20:90-94, and 25:35.

 Ask Allah to make you both truthful and wise when dealing with people.`,
			},
		],
		quranSurahs: ["Al-A'raf (Sura 7)", "Ta-Ha (Sura 20)", "Al-Furqan (Sura 25)", "Maryam (Sura 19)"],
	},
	zakariyya: {
		shortIntro: "Prophet Zakariyya (peace be upon him) was a noble prophet from the Children of Israel, known for age, gentleness, worship, and steadfast service to Allah. Though he had grown weak with old age and his wife had remained barren for years, his heart never lost hope in the mercy of his Lord. His story is moving and deeply human: an elderly prophet caring for Maryam, witnessing Allah's hidden gifts, whispering a private dua in the silence of worship, and then receiving the miracle of Prophet Yahya (peace be upon him) as a son and successor.",
		sections: [
			{
				title: "Part 1: An old prophet still serving Allah",
				body: `The years had left their mark on Prophet Zakariyya (peace be upon him). Ibn Kathir describes him as elderly, bent with age, and physically weak, yet still constant in worship and service. Even in old age, he continued going to the place of worship, teaching people, reminding them of Allah, and caring for their religious life.

He was not known as a wealthy man or a ruler of worldly power. His greatness was in his sincerity, kindness, and quiet devotion. He lived for the message, not for status.

But in his heart there was one sadness that remained with him for many years: he had no child, and his wife was barren. He feared that after his death, the people would be left without strong guidance and that the sacred teachings would be weakened or altered.`,
			},
			{
				title: "Part 2: Guardian of Maryam and witness to a miracle",
				body: `Allah honored Prophet Zakariyya (peace be upon him) by making him the guardian of Maryam (peace be upon her). He looked after her in the sanctuary, checking on her and caring for her spiritual and physical well-being.

Then something remarkable happened. Whenever Prophet Zakariyya (peace be upon him) entered her prayer chamber, he found provision with her, fresh food and fruit that no one had brought and that sometimes appeared out of season.

He asked her in surprise, "O Maryam, from where does this come to you?" She answered with certainty that it was from Allah, for Allah provides to whom He wills without measure.

This moment touched the heart of Prophet Zakariyya (peace be upon him). If Allah could provide for Maryam in a way beyond all normal expectation, then surely Allah could also bless an old prophet and his barren wife with a child.`,
			},
			{
				title: "Part 3: A longing that never died",
				body: `By every worldly measure, the matter seemed impossible. Prophet Zakariyya (peace be upon him) had reached extreme old age, and his wife had long been unable to bear children. Yet prophets do not measure hope by the limits of creation. They measure by the power of the Creator.

His wish for a child was not a selfish wish for pride, wealth, or family name. He wanted a righteous heir who would inherit knowledge, prophethood, and service to the religion. He wanted someone who would continue the call to Allah after him and protect the people from drifting into corruption.`,
			},
			{
				title: "Part 4: The whispered dua in secret",
				body: `So Prophet Zakariyya (peace be upon him) turned to Allah in one of the most tender duas in the Qur'an. He did not shout, complain, or despair. He called upon his Lord quietly and secretly, with the adab of a servant who knows that Allah hears even the faintest whisper.

He said that his bones had grown weak and his head had filled with white hair, but that he had never been disappointed in calling upon his Lord. Then he asked for an heir who would inherit from him and from the family of Yaqub, meaning the inheritance of guidance and sacred responsibility, not merely wealth.

This is one of the most beautiful scenes in his story: an old prophet, physically frail but spiritually strong, placing his impossible hope before the One for whom nothing is impossible.`,
			},
			{
				title: "Part 5: Glad tidings while standing in prayer",
				body: `Allah answered Prophet Zakariyya (peace be upon him) while he was standing in prayer. The angels called to him with glad tidings that would change the rest of his life: he would be granted a son named Yahya.

This name itself was part of the miracle. Allah said that no one had been given that name before. And the child would not be ordinary. He would be noble, pure, righteous, chaste, and a prophet from among the righteous.

The answer came exactly where the dua had risen from: in worship, in humility, and in complete dependence upon Allah.`,
			},
			{
				title: "Part 6: Amazement before divine power",
				body: `Like any truthful servant hearing miraculous news, Prophet Zakariyya (peace be upon him) was amazed. He asked how he could have a son when he had reached extreme old age and his wife was barren.

The answer came with complete clarity: this matter was easy for Allah. The One who had created Zakariyya himself from nothing could certainly grant him a child despite age and barrenness.

In that answer is a powerful lesson: human impossibility is not a barrier when Allah wills something to be.`,
			},
			{
				title: "Part 7: The sign of silence and remembrance",
				body: `Prophet Zakariyya (peace be upon him) then asked Allah for a sign. Allah gave him a remarkable sign: for three nights, or three days according to another verse, he would not be able to speak to people even though he remained physically sound.

This was not a punishment. It was a sign of certainty, wonder, and transition. During those days, he turned even more intensely toward the remembrance of Allah and signaled to his people that they too should glorify Allah morning and evening.

Silence became worship. His inability to speak to people only made his heart more occupied with his Lord.`,
			},
			{
				title: "Part 8: The birth of Yahya and a father's joy",
				body: `Then the promise was fulfilled. Allah granted Prophet Zakariyya (peace be upon him) a blessed son: Prophet Yahya (peace be upon him).

What joy must have filled the heart of this elderly prophet. The child he had hoped for in secret had now arrived by Allah's mercy. And soon it became clear that Yahya was exactly the righteous child Zakariyya had prayed for. Allah gave him wisdom while still a child, purity in character, mercy, dutifulness to his parents, and the rank of prophethood.

The answer to Zakariyya's dua was not just a son. It was the birth of another prophet.`,
			},
			{
				title: "Part 9: Patience in an age of corruption",
				body: `The story of Prophet Zakariyya (peace be upon him) was not a story of comfort from beginning to end. He lived in a time when many people had become weak in religion and vulnerable to corruption. The need for guidance was urgent, which is exactly why he had feared leaving the people without righteous leadership.

Even after receiving Allah's gift, he remained a patient caller to truth. He continued worshipping, teaching, and guiding while others resisted, neglected, or betrayed the message. His life shows that miracles do not remove the need for patience; they strengthen the believer to continue.`,
			},
			{
				title: "Part 10: Martyrdom and lasting honor",
				body: `Like many prophets before and after him, Prophet Zakariyya (peace be upon him) faced the hostility of those who rejected truth. Reports mentioned by Ibn Kathir state that he was eventually killed unjustly by his people.

This ending is painful, but it is also noble. He died as a martyr, remaining faithful to Allah until his final breath. The enemies of truth may have harmed his body, but they could never erase his rank, his sincerity, or his place among the prophets.

So the story of Prophet Zakariyya (peace be upon him) closes with both sorrow and honor: sorrow at the cruelty of those who reject guidance, and honor for a prophet whose old age, private dua, patience, and faith continue to inspire believers forever.`,
			},
			{
				title: "Moral lessons",
				body: ` Never stop making dua, even when the situation looks impossible.

 Allah's power is not limited by age, weakness, or natural barriers.

 A righteous child and a righteous successor are among the greatest gifts from Allah.

 Secret worship and humble dua carry immense power.

 Prophets may be harmed by people, but Allah preserves their honor forever.`,
			},
			{
				title: "Practical actions for students",
				body: ` Make private dua regularly and ask Allah with humility and certainty.

 Do not let age, weakness, or difficulty make you despair of Allah's mercy.

 Care about leaving behind good influence, knowledge, and righteous work.

 Stay patient in serving Allah even when your efforts are quiet or unnoticed.

 Reflect on Allah's gifts in the lives of others and let that increase your hope, not your envy.`,
			},
		],
		quranSurahs: ["Maryam (Sura 19)", "Al-Imran (Sura 3)", "Al-Anbiya (Sura 21)"],
	},
	isa: {
		shortIntro: "Prophet Isa ibn Maryam (peace be upon him) is one of the greatest messengers of Allah. Ibn Kathir presents his story with deep detail: the choosing of Mary, miraculous birth without a father, cradle speech, powerful miracles by Allah's permission, call to pure tawhid, opposition from hostile priests, the disciples, the heavenly table, and Allah's raising of Isa while refuting all false claims of divinity.",
		sections: [
			{
				title: "Allah Declares He Has No Son",
				body: `In many verses of the Glorious Qur'an Allah the Exalted denied the claim that He has a son. A delegation from Najran discussed the Trinity, and Allah clarified that Isa is a servant and messenger - created in Maryam's womb by divine command, just as Adam was created without father and mother.\n\nIbn Kathir emphasizes that Isa's miraculous creation is a sign of Allah's power, not evidence of sonship or divinity.`,
			},
			{
				title: "The Birth of Mary - Quranic and Historical Context",
				body: `Allah the Almighty said He chose Adam, Nuh, the family of Ibrahim, and the family of Imran. The wife of Imran vowed what was in her womb for Allah's service. When she delivered a daughter, she named her Mary and sought protection for her and her offspring from Satan (Qur'an 3:33-36).\n\nIbn Kathir narrates Hannah's long yearning for a child, her vow, the death of Imran during pregnancy, and Maryam's delivery into temple care. Through drawing lots, Zakariyah became her guardian, and Allah honored this choice.`,
			},
			{
				title: "Mary's Sustenance and High Status",
				body: `Whenever Zakariyah entered her prayer chamber, he found provision with her. She said: "It is from Allah. Verily, Allah provides sustenance to whom He wills without limit" (Qur'an 3:37).\n\nIbn Kathir also cites prophetic narrations honoring Mary among the greatest women. These scenes prepared the believer to understand the coming miracle of Isa's birth.`,
			},
			{
				title: "Mary Receives News of Jesus",
				body: `While Mary was in worship, an angel came in the form of a man. She sought refuge in Allah. He said: "I am only a Messenger from your Lord, to announce to you a righteous son." She asked how this could be when no man had touched her. The answer came: "That is easy for Allah" (Qur'an 19:18-21).\n\nThis announcement established both Mary's purity and Allah's absolute creative power.`,
			},
			{
				title: "The Birth of Jesus and Return to the City",
				body: `Mary withdrew to a distant place and gave birth by a palm tree. She cried in distress, then Allah comforted her with water and ripe dates (Qur'an 19:22-26).\n\nWhen she returned carrying Isa, the people accused her. She pointed to the infant, and Isa spoke in the cradle: "Verily! I am a slave of Allah. He has given me the Scripture and made me a Prophet..." (Qur'an 19:27-33).\n\nIbn Kathir presents this as public vindication of Mary and immediate declaration of Isa's servanthood.`,
			},
			{
				title: "Jesus's Message and Moral Reform",
				body: `As Isa grew, he called people to Allah alone, denounced hypocrisy, and revived the spirit of revelation, not merely ritual formalism. Ibn Kathir describes his confrontation with priestly corruption, materialism, and misuse of religious authority.\n\nHe taught purity of heart, mercy, repentance, and the true spirit of the Torah while confirming that worship belongs only to Allah.`,
			},
			{
				title: "Miracles by Allah's Permission",
				body: `Allah supported Isa with miracles: healing the blind and leper, reviving the dead, forming a bird from clay and breathing into it by Allah's leave, and informing people what they ate and stored (Qur'an 3:48-54, 5:110-111).\n\nIbn Kathir narrates additional reports about revivals of the dead and the massive public impact these signs had on belief and disbelief alike.`,
			},
			{
				title: "The Disciples and the Heavenly Table",
				body: `The disciples declared faith and asked to be recorded among witnesses. They requested a table spread from heaven to reassure their hearts. Isa prayed, and Allah warned that disbelief after this sign would bring severe punishment (Qur'an 5:112-116).\n\nIbn Kathir reports that this became a major sign and test: gratitude and submission for the sincere, while later generations drifted into distortion.`,
			},
			{
				title: "Plot to Kill Jesus and Allah's Rescue",
				body: `The hostile leadership plotted against Isa and moved toward execution. Ibn Kathir records widespread conspiracy and betrayal narratives, while the Qur'anic ruling is decisive:\n\n"They killed him not, nor crucified him, but it was made to appear so to them... But Allah raised him up unto Himself" (Qur'an 4:157-159), and "O Isa! I will take you and raise you to Myself" (Qur'an 3:55).\n\nThus Allah saved His messenger and defeated the plot.`,
			},
			{
				title: "Quranic Refutation of False Beliefs",
				body: `Ibn Kathir's chapter concludes with broad Qur'anic refutations: Allah has no son; Isa is messenger and servant; worship is for Allah alone; and trinity claims are false (Qur'an 4:171-173, 5:72-75, 9:30-32, 19:88-95, 112:1-4).\n\nIsa himself declared: "And verily Allah is my Lord and your Lord, so worship Him. That is the Straight Path."`,
			},
			{
				title: "Moral lessons",
				body: ` Isa (peace be upon him) is a noble messenger, not divine, and his miracles were by Allah's permission.\n\n The purity of Maryam is a central truth protected by revelation and miracle.\n\n Religious leadership without sincerity can become corruption and oppression.\n\n Allah's plan prevails over every conspiracy against truth.\n\n Tawhid is the final and unchanging message of all prophets.`,
			},
			{
				title: "Practical actions for students",
				body: ` Memorize and reflect on Qur'an 19:30 and 3:51 to understand Isa's own call to servanthood and tawhid.\n\n Study one authentic tafsir passage weekly on verses about Isa and Maryam.\n\n Correct any mistaken statements about Isa with adab and clear evidence.\n\n Make dua for firmness on tawhid and protection from confusion.\n\n Practice mercy and truthfulness together, as taught in the prophetic mission.`,
			},
		],
		quranSurahs: ["Maryam (Sura 19)", "Al-Imran (Sura 3)", "An-Nisa (Sura 4)", "Al-Ma'idah (Sura 5)", "At-Tawbah (Sura 9)", "Al-Ikhlas (Sura 112)"] ,
	},
	muhammad: {
		shortIntro:
			"Prophet Muhammad (peace and blessings be upon him) is the final messenger sent to all humanity. Ibn Kathir's chapter moves in a detailed historical flow: noble birth and orphanhood in Makkah, al-Amin character, first revelation in Hira, years of persecution, Hijrah and state formation in Madinah, Badr-Uhud-Khandaq, Hudaybiyyah, conquest of Makkah, delegations and expansion of Islam, Farewell Hajj, and completion of the message.",
		sections: [
			{
				title: "Description of Muhammad",
				body:
`Ibn Kathir records that Prophet Muhammad (peace and blessings be upon him) was born in Makkah on Monday, 12 Rabi al-Awwal, in the Year of the Elephant.

He was from the noble Quraysh line through Ismail, son of Ibrahim (peace be upon them). His father Abdullah died before his birth. His mother Aminah died when he was six. His grandfather Abd al-Muttalib cared for him, then his uncle Abu Talib.

These early losses trained him in patience, trust in Allah, and compassion for the weak and orphaned.`,
			},
			{
				title: "Journey to Busra and Recognition by Bahira",
				body:
`At around twelve, he traveled with Abu Talib toward Busra in Syria. Ibn Kathir mentions the monk Bahira recognizing signs of future prophethood and advising that the boy be protected.

This incident became part of the early signs narrative in seerah and increased concern for his safety.

He returned to Makkah with growing maturity, dignity, and a reputation for trust.`,
			},
			{
				title: "Part 3: Al-Amin and Solitary Reflection",
				body:
`In Makkah he became known as al-Amin for honesty, fairness, and reliability. He stayed away from idolatrous corruption and protected rights where possible.

Ibn Kathir describes his thoughtful nature and concern over lawlessness, tribal injustice, and spiritual decline. This inner burden prepared him for revelation and mission.`,
			},
			{
				title: "Part 4: Marriage to Khadijah and Public Trust",
				body:
`At age twenty-five he led Khadijah's trade caravan with exceptional integrity. She later proposed marriage, and this marriage became a major source of support, stability, and mercy.

Ibn Kathir also records his kindness with family and dependents, including Zayd ibn Harithah, whom he treated with honor and affection.

When Quraysh disputed over placing the Black Stone during rebuilding of the Kabah, he solved the crisis by placing the stone on a cloth, having all tribal leaders lift it together, then setting it in place himself. This prevented civil conflict and strengthened his standing as a trusted arbiter.`,
			},
			{
				title: "Part 5: Seclusion in Hira and First Revelation",
				body:
`Before prophethood he increasingly withdrew to Cave Hira for worship and reflection. There Jibril came with the first command: "Read," and the opening verses of Surah Al-Alaq were revealed (Quran 96:1-5).

He returned shaken to Khadijah, who reassured him and took him to Waraqah ibn Nawfal, who affirmed that the same angelic messenger who came to Musa had now come to him.

After a pause in revelation, the command came to rise and warn (Quran 74:1-3), marking the beginning of active mission.`,
			},
			{
				title: "Part 6: Early Converts and Public Call",
				body:
`The earliest believers included Khadijah, Ali, Zayd ibn Harithah, and Abu Bakr (may Allah be pleased with them), followed by others from different social classes.

Ibn Kathir describes an initial private phase, then public proclamation of tawhid in Makkah. The Prophet (peace and blessings be upon him) called Quraysh to leave idols and worship Allah alone.

Opposition intensified because this message challenged false religion, tribal pride, and unjust social order.`,
			},
			{
				title: "Part 7: Quraysh Resistance and Demands for Miracles",
				body:
`Quraysh tried many methods: ridicule, accusations, social pressure, and offers of wealth and leadership if he would stop the message. He refused all compromise.

Ibn Kathir notes repeated demands for extraordinary signs while they rejected the clearest sign already present: the Quran itself. The Prophet warned them through Qur'anic recitation and examples of destroyed nations who denied earlier messengers.

The Prophet stayed firm, patient, and truthful despite intensifying hostility.`,
			},
			{
				title: "Part 8: Persecution and First Hijrah to Abyssinia",
				body:
`As torture and oppression increased, the Prophet permitted believers to migrate to Abyssinia under the just ruler al-Najashi.

Ibn Kathir includes Ja'far ibn Abi Talib's clear explanation of Islam before the king: truthfulness, prayer, charity, chastity, justice, and rejection of idolatry.

The Muslims found temporary safety there, showing that preserving faith can require migration when persecution becomes severe.`,
			},
			{
				title: "Part 9: Boycott, Year of Sadness, and Taif",
				body:
`Quraysh imposed a harsh boycott on Banu Hashim and Banu al-Muttalib. Ibn Kathir describes severe hardship before the pact was finally broken.

Then came the Year of Sadness with the deaths of Abu Talib and Khadijah (may Allah be pleased with her), losing both external protection and inner support.

He later went to Taif seeking support, but was rejected and harmed. Even then he hoped their future generations would worship Allah.`,
			},
			{
				title: "Part 10: Al-Isra wal-Miraj and Five Daily Prayers",
				body:
`Allah honored His Messenger with the night journey from al-Masjid al-Haram to al-Masjid al-Aqsa, then ascension through the heavens.

Ibn Kathir records narrations of meeting prophets in the heavens and the command of fifty prayers, then repeated return for reduction until five remained, with reward of fifty in value.

This event strengthened believers and established salah as the daily pillar connecting the ummah to Allah.`,
			},
			{
				title: "Part 11: Pledges of Aqabah and the Hijrah",
				body:
`Delegations from Yathrib accepted Islam and pledged support at al-Aqabah, opening the path for Hijrah.

When Quraysh plotted assassination, the Prophet departed with Abu Bakr. They stayed in the Cave of Thawr while pursuers searched nearby.

Ibn Kathir also narrates the pursuit of Suraqah ibn Malik, whose horse repeatedly stumbled as he attempted to capture them, and he eventually withdrew. The Prophet reached Quba, then entered Madinah to great welcome.`,
			},
			{
				title: "Part 11: Building the Madinah state and Charter",
				body:
`In Madinah, he built the mosque, established brotherhood between Muhajirun and Ansar, and organized a revealed social order.

Ibn Kathir records the Charter of Madinah: one civic community, rights and obligations, defense cooperation, and reference of disputes to Allah and His Messenger.

This transformed tribal conflict into covenant-based governance and justice.`,
			},
			{
				title: "Part 12: Badr and its consequences",
				body:
`At Badr, a small Muslim force faced a larger Makkan army. Allah granted decisive victory and strengthened the believers (Quran 3:123-127).

Ibn Kathir notes the discipline of command, strategic placement, and the moral effect of victory on Arabia.

Treatment of prisoners showed prophetic balance: firmness in justice with mercy and human dignity.`,
			},
			{
				title: "Part 13: Uhud and lessons in obedience",
				body:
`At Uhud, the Muslims initially advanced but the battle turned when some archers left their assigned position. The Prophet was injured and many companions were martyred.

The Quran explained the setback as a test, purification, and lesson in obedience and unity.

Ibn Kathir highlights that temporary loss did not break the mission; it educated the ummah.`,
			},
			{
				title: "Part 14: Confederates, internal betrayal, and perseverance",
				body:
`In the Battle of al-Khandaq (the Confederates), Madinah faced a coalition attack. The trench strategy blocked direct assault.

The siege brought fear, hunger, and pressure, along with internal betrayal by hostile elements.

Through patience, unity, and Allah's aid, the coalition failed and withdrew.`,
			},
			{
				title: "Part 15: Hudaybiyyah and strategic opening",
				body:
`The Treaty of Hudaybiyyah appeared difficult to many companions but became a turning point. Ibn Kathir presents it as clear political wisdom and a manifest opening (Quran 48).

Truce conditions reduced warfare, allowed wider interaction, and accelerated entry into Islam.

This period shows prophetic leadership through foresight, restraint, and long-term planning.`,
			},
			{
				title: "Part 16: Letters to rulers and expansion of call",
				body:
`Ibn Kathir records the Prophet's letters to regional rulers, including Heraclius of Byzantium, inviting them to Islam with clarity and dignity.

Some responses were respectful, some hostile, but the message had moved beyond Arabia's tribal frame into global invitation.

This stage demonstrates the universality of his mission.`,
			},
			{
				title: "Part 17: Conquest of Makkah and removal of idols",
				body:
`After treaty violations by Quraysh allies, the Prophet marched on Makkah and entered with broad amnesty and minimal bloodshed.

He purified the Kabah from idols and proclaimed the triumph of truth over falsehood (Quran 17:81).

Ibn Kathir emphasizes this as victory without revenge and power with mercy.`,
			},
			{
				title: "Part 18: Hunayn, Tabuk era, and Year of Delegations",
				body:
`After Makkah, major confrontations such as Hunayn occurred, followed by wider consolidation of Muslim authority.

In the following phase, Arab delegations came to Madinah in large numbers, accepting Islam and forming covenant relations.

The ninth year became known as the Year of Delegations, marking the end of idolatrous political dominance in Arabia.`,
			},
			{
				title: "Part 19: Farewell Hajj and completion of guidance",
				body:
`In the Farewell Hajj, he taught core principles: sanctity of life and wealth, justice in social dealings, trust obligations, and brotherhood of believers.

His sermon at Arafah summarized prophetic ethics for the ummah: no oppression, no tribal superiority, and responsibility before Allah.

This phase marked completion and full delivery of the mission.`,
			},
			{
				title: "Part 20: Final illness, passing, and Abu Bakr's clarity",
				body:
`In his final illness he remained concerned with prayer, justice, and trusts. He passed away in the room of Aishah (may Allah be pleased with her).

When people were shaken, Abu Bakr recited the decisive truth: "Muhammad is no more than a messenger; messengers passed away before him" (Quran 3:144). He said: whoever worshipped Muhammad, Muhammad has died; whoever worships Allah, Allah is Ever-Living.

Ibn Kathir closes by affirming that the Prophet fully delivered revelation and left the ummah on clear guidance.`,
			},
			{
				title: "Moral lessons",
				body: ` Prophetic leadership combines worship, law, mercy, strategy, and courage.

 The Makkan phase teaches sabr under persecution; the Madinan phase teaches governance with justice.

 Victory is not revenge; it is restoration of truth with mercy.

 Treaties, diplomacy, and patience are prophetic strengths, not weakness.

 Finality of prophethood requires loyalty to Quran and authentic Sunnah in belief and action.`,
			},
			{
				title: "Practical actions for students",
				body: ` Read one section of seerah weekly and write one action point from it.

 Send daily salawat on the Prophet (peace and blessings be upon him).

 Practice one Sunnah trait each week: truthfulness, mercy, patience, or promise-keeping.

 In conflict, choose justice and forgiveness over ego and retaliation.

 Protect the five daily prayers, especially on time and with focus.`,
			},
		],
		quranSurahs: ["Al-Alaq (Sura 96)", "Al-Muddaththir (Sura 74)", "Al-Isra (Sura 17)", "An-Najm (Sura 53)", "Al-Imran (Sura 3)", "Al-Anfal (Sura 8)", "Al-Ahzab (Sura 33)", "Al-Fath (Sura 48)", "At-Tawbah (Sura 9)", "Al-Ma'idah (Sura 5)", "Al-Hujurat (Sura 49)", "Muhammad (Sura 47)"],
	},
};

const SUPPLEMENTAL_IBN_KATHIR_STORIES: Partial<Record<string, StoryContent>> = {
	ismail: {
		shortIntro:
			"Prophet Ismail (peace be upon him) was the noble son of Prophet Ibrahim (peace be upon him) and Hajar. His story is one of desert hardship, trust in Allah, family obedience, the rise of Makkah, the spring of Zamzam, the rebuilding of the Ka'bah, and the unforgettable test of sacrifice. It is a story in which a child in a barren valley becomes part of a legacy that would shape the worship of millions until the end of time.",
		sections: [
			{
				title: "Part 1: A child left in a silent valley",
				body: `The story of Prophet Ismail (peace be upon him) begins in one of the most moving scenes in prophetic history. By the command of Allah, Prophet Ibrahim (peace be upon him) brought Hajar and her infant son Ismail to a barren valley where there was no cultivated land, no settled town, and no visible source of life. It was the place where the Sacred House would one day stand, but at that moment it looked empty, harsh, and silent.

When Prophet Ibrahim (peace be upon him) turned to leave, Hajar followed him and asked whether Allah had commanded this. When he answered yes, her heart settled even though the valley remained empty before her. She said with certainty that Allah would not neglect them. Then Prophet Ibrahim (peace be upon him) raised one of the most beautiful du'as in the Qur'an, asking Allah to make hearts incline toward them and to provide them with fruits. The story of Makkah begins not with buildings, but with tawakkul, tears, and dua.`,
			},
			{
				title: "Part 2: A mother's running between hope and fear",
				body: `Soon the little water and food were gone. The cries of baby Prophet Ismail (peace be upon him) grew urgent with thirst, and Hajar could not stand still. She ran to Safa, looking for help. She saw no one. Then she rushed to Marwah. Again, nothing. Back and forth she ran, again and again, driven by desperation, love, and trust in Allah.

This running was not panic without faith. It was faith in motion. Ibn Kathir records this event as the origin of sa'y in Hajj. Hajar teaches every believer that tawakkul is not passive. She trusted Allah completely, but she also used every effort available to her.`,
			},
			{
				title: "Part 3: Zamzam bursts forth beside Prophet Ismail (peace be upon him)",
				body: `Then relief came from where no human being could have expected it. By Allah's mercy, water sprang forth near Prophet Ismail (peace be upon him). The angel had come, and the dry valley suddenly held life. Hajar hurried to gather and contain the water, protecting it carefully.

Ibn Kathir transmits the prophetic report that if she had not gathered it, Zamzam would have flowed as an open stream. But even as a contained spring, it became one of the greatest signs in sacred history. The crying child in the desert had become the means by which Allah brought forth a well that would serve believers for generations upon generations.`,
			},
			{
				title: "Part 4: From empty desert to a growing settlement",
				body: `Travelers from Jurhum noticed birds circling over the valley and realized there must be water there. When they arrived and found Zamzam, they asked Hajar permission to settle nearby, and she agreed while preserving her connection to the well. In this way, the valley that had looked abandoned began to fill with life.

Prophet Ismail (peace be upon him) grew up among Jurhum. He learned Arabic from them, became known for noble character, and matured in a place that Allah was preparing for a far greater future. A lonely valley was slowly becoming Makkah, and the child once left there helpless was growing into one of Allah's honored prophets.`,
			},
			{
				title: "Part 5: Ibrahim's return and the lessons of the household",
				body: `Years later, Prophet Ibrahim (peace be upon him) returned to visit Prophet Ismail (peace be upon him). On one visit he met Ismail's wife while Ismail was away and found in her words ingratitude and hardship of spirit. So he left a subtle message for his son: change the threshold of your door. Prophet Ismail (peace be upon him) understood immediately that his father was instructing him to separate from that marriage.

On a later visit, Prophet Ibrahim (peace be upon him) met another wife of Prophet Ismail (peace be upon him), and this time he heard gratitude, contentment, and better character. So he left a different message: keep your threshold. Ibn Kathir includes this account to show that righteous homes are built not only on lineage, but on gratitude, faith, and character.`,
			},
			{
				title: "Part 6: Father and son raise the Ka'bah",
				body: `Then came one of the greatest honors in the life of Prophet Ismail (peace be upon him). Allah commanded Prophet Ibrahim (peace be upon him) to raise the foundations of the Ka'bah, and Prophet Ismail (peace be upon him) stood beside him helping with the work. One brought stones, the other placed them, and both were engaged not in worldly construction but in sacred worship.

As they built, they made dua with humility: our Lord, accept this from us; indeed, You are the All-Hearing, the All-Knowing. That is one of the most beautiful parts of the story. Even while performing one of the greatest acts in history, they did not rely on the greatness of the act itself. They asked Allah to accept it. This is the adab of prophets.`,
			},
			{
				title: "Part 7: A prayer that reached the final Prophet",
				body: `After the House was raised, Prophet Ibrahim (peace be upon him) and Prophet Ismail (peace be upon him) asked Allah for more than a building. They asked for a messenger to arise among their descendants who would recite revelation, teach the Book and wisdom, and purify the people.

Muslim scholars explain that this dua was fulfilled in Prophet Muhammad (peace and blessings be upon him). That means the story of Prophet Ismail (peace be upon him) is tied not only to Makkah and the Ka'bah, but also to the final message sent to humanity. His life stands at the beginning of a line that reaches the Seal of the Prophets.`,
			},
			{
				title: "Part 8: The test of sacrifice",
				body: `Then came the test that made the name of Prophet Ismail (peace be upon him) unforgettable in the hearts of believers. Prophet Ibrahim (peace be upon him) saw in a dream that he was sacrificing his son. This was no ordinary dream. It was revelation, and it carried a command that would test both father and son at the deepest level.

When Prophet Ibrahim (peace be upon him) spoke to Prophet Ismail (peace be upon him), the response of the son was as extraordinary as the obedience of the father. He said: do what you are commanded; you will find me, if Allah wills, among the patient. There was no dramatic resistance, no rebellion, no attempt to escape. There was surrender, courage, and trust in Allah. This scene is one of the purest expressions of Islam in its literal sense: submission.`,
			},
			{
				title: "Part 9: Allah replaces the sacrifice and honors them both",
				body: `When both father and son had fully submitted, Allah replaced the sacrifice with a great ransom. The knife did not take the life of Prophet Ismail (peace be upon him), because the point of the trial had already been fulfilled. The obedience had been proven. The love of Allah had been placed above every other attachment.

Ibn Kathir highlights this as one of the clearest proofs that Allah does not waste sincere obedience. That is why the Ummah remembers this event every year in Eid al-Adha. It is not remembered as distant history only, but as living gratitude, living submission, and living trust.`,
			},
			{
				title: "Part 10: Prophet Ismail (peace be upon him) as a prophet of promise and prayer",
				body: `The Qur'an describes Prophet Ismail (peace be upon him) as truthful to his promise and as one who commanded his family to pray and give zakah. This description is powerful because it shows his greatness not only in dramatic moments, but in steady daily faithfulness.

Ibn Kathir presents Prophet Ismail (peace be upon him) as a prophet of obedience, covenant-keeping, prayer, family leadership, and long-term service to tawhid. His life began with thirst in the desert, moved through sacrifice and construction of the Ka'bah, and ended as a legacy woven permanently into Hajj, Makkah, and the final prophetic message.`,
			},
			{
				title: "Moral lessons",
				body: ` Tawakkul means trust in Allah joined with serious effort.\n\n A barren place can become blessed by Allah's decree.\n\n Gratitude strengthens homes; ingratitude weakens them.\n\n The greatest acts require humility and dua for acceptance.\n\n Obedience to Allah is the highest proof of love.\n\n Family cooperation in worship can shape generations.`,
			},
			{
				title: "Practical actions for students",
				body: ` Read and reflect on Qur'an 14:37-38, 2:127-129, 19:54-55, and 37:100-111.\n\n Write one dua for your family and repeat it daily for 7 days.\n\n Keep one promise this week with complete honesty.\n\n In one difficulty, practice Hajar's example: trust Allah and still take every lawful step you can.\n\n When you complete a good deed, make dua for acceptance instead of admiring yourself.`,
			},
		],
		quranSurahs: ["Al-Baqarah", "Ibrahim", "As-Saffat", "Maryam"],
	},
	ishaq: {
		shortIntro:
			"Ishaq (peace be upon him) was the son granted to Ibrahim and Sarah in old age. Ibn Kathir notes that the Qur'an gives concise mention of his life while affirming his prophethood, blessing, and role in the continuation of the prophetic line.",
		sections: [
			{
				title: "Part 1: Glad tidings to Ibrahim and Sarah",
				body: `Ibn Kathir records the Qur'anic account of angels visiting Ibrahim, then giving glad tidings of Ishaq and, after him, Yaqub (Qur'an 11:69-73). The news came when both Ibrahim and Sarah were advanced in age.\n\nThis established from the beginning that Ishaq's birth was a sign of Allah's unlimited power.`,
			},
			{
				title: "Part 2: Sarah's amazement and the angels' response",
				body: `Sarah reacted in astonishment at receiving news of a child in old age. The angels answered by redirecting her to Allah's decree and mercy, reminding the family that divine promise is never restricted by human expectation.\n\nIbn Kathir emphasizes this as a lesson in yaqeen (certainty) when circumstances seem impossible.`,
			},
			{
				title: "Part 3: Ishaq as a blessed prophet",
				body: `The Qur'an repeatedly includes Ishaq among the chosen and righteous prophets. Ibn Kathir presents him as part of the purified house of Ibrahim, carrying the same call of tawhid and obedience.\n\nHis life is less detailed in the Qur'an than some prophets, but his rank and blessing are clear.`,
			},
			{
				title: "Part 4: Continuity of revelation through his line",
				body: `Through Ishaq came Yaqub and many prophets among Bani Isra'il. Ibn Kathir treats this as a major dimension of Ishaq's legacy: continuity of guidance through generations.\n\nThis continuity is not lineage pride; it is responsibility to preserve revelation.`,
			},
			{
				title: "Part 5: Reports about marriage and family",
				body: `Ibn Kathir transmits historical reports that Ishaq married and was granted children, including Yaqub. He also cites details narrated by commentators regarding family tensions and migration.\n\nImportant note for students: many biographical details here come through historical reports and not explicit Qur'anic narration, so they are read with care.`,
			},
			{
				title: "Part 6: The role of patience before blessing",
				body: `Before Ishaq's birth there were long years of waiting. Ibn Kathir uses this to teach that delayed answers are not denied mercy. Allah grants at the appointed time with complete wisdom.\n\nThe household of Ibrahim remained grateful before and after blessing.`,
			},
			{
				title: "Part 7: House of prophethood and worship",
				body: `Ishaq grew within a home built on sacrifice, revelation, and obedience. That environment shaped a prophetic household where faith, dua, and worship were central.\n\nIbn Kathir highlights this as a model that spiritual legacy is built intentionally inside families.`,
			},
			{
				title: "Part 8: Ishaq's rank in Islamic belief",
				body: `Muslims affirm Ishaq as a true prophet and make no distinction in belief between Allah's messengers (Qur'an 2:136). Respecting all prophets is part of correct creed.\n\nIbn Kathir links Ishaq's mention to this broader Qur'anic principle.`,
			},
			{
				title: "Part 9: Closing years and transmitted reports",
				body: `Ibn Kathir includes reports about Ishaq's later life and death, including burial near his fathers. These details are transmitted in historical narrations and are not all equally strong in chain.\n\nStudents should distinguish between what is explicitly Qur'anic and what is reported historically.`,
			},
			{
				title: "Part 10: Ishaq's enduring legacy",
				body: `Ishaq's enduring legacy is faithful continuity: revelation preserved through generations, family worship sustained, and prophetic ethics transmitted.\n\nHis story teaches calm certainty, gratitude after waiting, and honor through obedience rather than worldly status.`,
			},
			{
				title: "Moral lessons",
				body: ` Allah's promise is true even when means look impossible.\n\n Not every authentic lesson needs long narrative detail.\n\n Families become blessed through worship and obedience.\n\n Distinguish clearly between Qur'anic certainty and historical reports.`,
			},
			{
				title: "Practical actions for students",
				body: ` Read Qur'an 11:69-73, 37:112-113, and 2:136.\n\n Make one dua daily for family guidance and consistency in worship.\n\n When studying seerah/history, label facts as "Qur'an explicit" or "historical report" to build disciplined understanding.`,
			},
		],
		quranSurahs: ["Hud", "As-Saffat", "Adh-Dhariyat", "Al-Baqarah"],
	},
	yaqub: {
		shortIntro:
			"Prophet Ya'qub (peace be upon him), the son of Ishaq and grandson of Ibrahim, was a prophet of deep worship, family leadership, insight, and extraordinary patience. His story is not built around one dramatic miracle alone, but around years of love, grief, wisdom, and trust in Allah. Through separation, fear, and prolonged sorrow, Prophet Ya'qub (peace be upon him) remained a model of sabr jamil, hope, and unwavering tawhid.",
		sections: [
			{
				title: "Part 1: A prophet born into a house of revelation",
				body: `Prophet Ya'qub (peace be upon him) was born into one of the most honored households in human history. He was the son of Prophet Ishaq (peace be upon him) and the grandson of Prophet Ibrahim (peace be upon him). He grew up in a home where revelation, worship, and obedience to Allah were not occasional acts but the center of life itself.

This matters because the story of Prophet Ya'qub (peace be upon him) begins long before the loss of Prophet Yusuf (peace be upon him). He was already a prophet shaped by tawhid, discipline, and inherited responsibility. Belonging to a noble family did not make his path easy. It made his responsibility greater.`,
			},
			{
				title: "Part 2: Early reports, movement, and the growth of his household",
				body: `Ibn Kathir records historical reports about the early life of Prophet Ya'qub (peace be upon him), including family tensions, movement to other lands, and the building of his household over time. Some of these details come through transmitted historical narrations rather than direct Qur'anic wording, so they are read with respect and care.

What remains clear is that Prophet Ya'qub (peace be upon him) was not merely a private worshipper. He was a leader of a family that would grow into a major prophetic line. His home would become the setting for one of the greatest tests of patience ever experienced by a prophet.`,
			},
			{
				title: "Part 3: A father with many sons and a heavy trust",
				body: `Allah gave Prophet Ya'qub (peace be upon him) many children, including Prophet Yusuf (peace be upon him) and Binyamin. A large family can be a blessing, but it can also become a place where love, jealousy, insecurity, and competition appear. As a prophet and father, Prophet Ya'qub (peace be upon him) had to guide hearts, not only manage a household.

His role was larger than providing food and order. He had to preserve faith, teach character, and watch over the spiritual condition of his children. That is why his story feels so human and so powerful. It is the story of a prophet living inside the emotional complexity of family life.`,
			},
			{
				title: "Part 4: The dream of Yusuf and a father's insight",
				body: `When Prophet Yusuf (peace be upon him) came to his father with the dream of the eleven stars, the sun, and the moon prostrating, Prophet Ya'qub (peace be upon him) immediately understood that this dream carried great meaning. He did not laugh it away as childish imagination, nor did he announce it publicly. He understood both the beauty of the dream and the danger surrounding it.

So he warned Prophet Yusuf (peace be upon him) not to tell the dream to his brothers. This was not secrecy without reason. It was wisdom. Prophet Ya'qub (peace be upon him) knew that jealousy can grow in hearts even within the same family. In this one moment, we see him clearly: loving, insightful, protective, and deeply aware of human weakness.`,
			},
			{
				title: "Part 5: The night of the shirt and the beginning of grief",
				body: `Then came the wound that would define so much of his life. The brothers returned at night weeping, carrying the false story that a wolf had eaten Prophet Yusuf (peace be upon him). They brought a shirt stained with false blood, but Prophet Ya'qub (peace be upon him) saw what they were hiding. The shirt did not convince him, and the behavior of his sons did not calm his heart.

That was the moment in which he uttered one of the most famous responses in the Qur'an: beautiful patience. This did not mean he felt no pain. It meant he would not rebel against Allah. He would carry grief with dignity, sorrow with faith, and pain without accusing his Lord. This is what makes his patience so extraordinary.`,
			},
			{
				title: "Part 6: Long years of absence, tears, and endurance",
				body: `The loss of Prophet Yusuf (peace be upon him) was not a short test. It lasted for years. Prophet Ya'qub (peace be upon him) lived with memory, uncertainty, and aching absence. Every passing day stretched the test further. He had no grave to visit, no clear answer, no closure. Only longing, suspicion, and hope.

Over time his grief became visible even in his body. His sorrow deepened and his eyes turned white from sadness. Yet even after so many years, he did not lose hope in Allah. This is one of the strongest lessons in his story: true hope is not measured by how easy the situation looks. It is measured by how firmly the heart remains attached to Allah when the situation looks impossible.`,
			},
			{
				title: "Part 7: Another test through Binyamin",
				body: `The trial of Prophet Ya'qub (peace be upon him) did not end with Yusuf. Later, when the food crisis drove his sons to Egypt and they were told to bring Binyamin, the old wound opened again. This was not simply a travel decision for him. It was the fear of losing another beloved son after the first had already been taken.

Still, Prophet Ya'qub (peace be upon him) did not act recklessly or blindly. He took a solemn promise from his sons and then sent them with practical instruction, telling them not to enter by one gate but by different gates. In the same breath, he made clear that no plan can stand independently of Allah. Judgment belongs only to Allah. This is tawakkul in its correct form: take the means, but never trust the means more than the Lord of the means.`,
			},
			{
				title: "Part 8: He complained only to Allah",
				body: `When the second wave of grief struck and Binyamin too was held back, the pain of Prophet Ya'qub (peace be upon him) became even more intense. His sons could see that he was breaking under grief, but they did not understand the depth of his faith. He answered them with words that remain a lesson for all believers: he complained of his sorrow and grief only to Allah, and he knew from Allah what they did not know.

This is one of the most beautiful parts of his story. He did not deny his sadness. He did not pretend to be untouched. He cried, remembered, and longed. But he carried all of that to Allah. That is the difference between despair and faith-filled grief.`,
			},
			{
				title: "Part 9: Do not despair of Allah's mercy",
				body: `Then came one of the greatest commands of hope in the Qur'an. Prophet Ya'qub (peace be upon him) told his sons to go and search for Prophet Yusuf (peace be upon him) and his brother, and not to despair of relief from Allah. After all the years, all the tears, all the disappointment, he was still teaching hope.

That command is not only family advice. It is creed. Despair is not a mark of realism in Islam. It is a spiritual failure. Prophet Ya'qub (peace be upon him) was training his children, and all who read his story after them, to understand that Allah can open closed doors long after human beings think the story has ended.`,
			},
			{
				title: "Part 10: The smell of Yusuf and the return of light",
				body: `At last the hidden plan of Allah opened fully. The shirt of Prophet Yusuf (peace be upon him) was brought, and even before the caravan arrived, Prophet Ya'qub (peace be upon him) sensed that relief was near. When the shirt was placed upon his face, his sight returned by the mercy of Allah.

Then came the reunion after all those years of separation. The father who had wept through the long night of patience was reunited with the son whose loss had pierced his heart so deeply. Ibn Kathir presents this reunion as the victory of sabr over betrayal, of trust over appearances, and of Allah's hidden wisdom over human plotting.`,
			},
			{
				title: "Part 11: His greatest concern at the end of life",
				body: `Even after all these emotional trials, the greatest concern of Prophet Ya'qub (peace be upon him) was not personal relief. It was tawhid. Before death, he gathered his children and asked what they would worship after him. They answered that they would worship the God of their fathers Ibrahim, Ismail, and Ishaq, one God, and that they would submit to Him.

This final scene shows his true greatness. His story is not only about sorrow and reunion. It is about preserving the religion of Allah inside the family, across generations, until the last breath. That is why his legacy is so enduring. He was a prophet of tears, yes, but also a prophet of covenant, worship, and unwavering truth.`,
			},
			{
				title: "Moral lessons",
				body: ` Beautiful patience means deep human sorrow without rebellion against Allah.\n\n Wise parenting includes love, foresight, and protection from jealousy.\n\n A believer may cry intensely and still be full of faith.\n\n Hope in Allah is an obligation even during prolonged hardship.\n\n Tawakkul means taking practical steps while depending only on Allah.\n\n The greatest family legacy is preservation of tawhid.`,
			},
			{
				title: "Practical actions for students",
				body: ` Read Qur'an 12:4-6, 12:18, 12:67, 12:83-87, and 2:132-133.\n\n In a hardship, delay complaint to people and make dua to Allah first.\n\n Write one sentence of family advice you would want remembered after you.\n\n For one week, remove despair language from your speech and replace it with dua, sabr, and action.\n\n Reflect on one situation in your life where Allah may be working through delay, not denial.`,
			},
		],
		quranSurahs: ["Yusuf", "Al-Baqarah", "Hud"],
	},
};

const IBN_KATHIR_BATCH_ADDITIONS: Record<string, ProphetStorySection[]> = {
	adam: [
		{
			title: "Book check (Batch 1: Prophets 1-5)",
			body: `Ibn Kathir also records early events after Adam's descent: repentance accepted, guidance promised to his descendants, and the beginning of life's test between revelation and Shaytan's whispering.\n\nThe book further includes the account of Adam's children (Qabil and Habil) as an early lesson in jealousy, accountability, and the sanctity of life (Qur'an 5:27-31).`,
		},
	],
	idris: [
		{
			title: "Book check (Batch 1: Prophets 1-5)",
			body: `Ibn Kathir highlights Idris as among the earliest prophets after Adam and Seth, with emphasis on truthful character and disciplined worship.\n\nHe also transmits reports that Idris taught writing, order, and social responsibility, and includes his wise sayings on gratitude, self-accountability, and restraint.`,
		},
	],
	nuh: [
		{
			title: "Book check (Batch 1: Prophets 1-5)",
			body: `Ibn Kathir emphasizes that idolatry started gradually through exaggerating righteous people, then images, then worship.\n\nHe also narrates Nuh's final counsel: hold firmly to tawhid, avoid shirk, and avoid arrogance. The flood account is tied to divine justice after prolonged warning and proof.`,
		},
	],
	hud: [
		{
			title: "Book check (Batch 1: Prophets 1-5)",
			body: `Ibn Kathir's account of 'Ad stresses strength, architecture, and arrogance. Hud repeatedly called them to seek forgiveness and repentance so Allah would increase them in strength.\n\nThe punishment came as a destructive wind over seven nights and eight days, while believers were saved by Allah's mercy (Qur'an 69:6-8, 11:58).`,
		},
	],
	salih: [
		{
			title: "Book check (Batch 1: Prophets 1-5)",
			body: `Ibn Kathir gives detailed focus to the she-camel miracle, the water-sharing test, and the deliberate conspiracy to kill the sign and then plot against Salih.\n\nAfter their crime, Salih warned of three remaining days before punishment; then came the cry/earthquake, and only believers were saved.`,
		},
	],
	ibrahim: [
		{
			title: "Book check (Batch 2: Prophets 6-10)",
			body: `Ibn Kathir expands Ibrahim's story beyond idol-breaking: his debates with his father, people, and king; migration for Allah; and major covenant tests.\n\nKey additions include the guests (angels), destruction news for Lut's people, and repeated duas for Makkah, family faith, and future guidance.`,
		},
	],
	lut: [
		{
			title: "Book check (Batch 2: Prophets 6-10)",
			body: `Ibn Kathir highlights Lut's repeated warnings, social corruption, and the final night command to leave without looking back.\n\nHis wife is presented as an example of betrayal of faith. The punishment is described as overturning the town and raining marked stones.`,
		},
	],
	ismail: [
		{
			title: "Book check (Batch 2: Prophets 6-10)",
			body: `Ibn Kathir includes hadith-rich details of Hajar's running between Safa and Marwah, Zamzam's emergence, Jurhum settlement, and Ibrahim's visits.\n\nHe also links Ismail's legacy to raising the Ka'bah, covenantal worship, eloquence among Arabs, and the line culminating in the final Prophet.`,
		},
	],
	ishaq: [
		{
			title: "Book check (Batch 2: Prophets 6-10)",
			body: `Ibn Kathir presents Ishaq's birth as a direct sign of divine promise despite old age and impossibility by normal means.\n\nHe clarifies that Qur'anic certainty centers on Ishaq's prophethood, blessing, and continuation of guidance through Yaqub, while some biographical details are historical reports.`,
		},
	],
	yaqub: [
		{
			title: "Book check (Batch 2: Prophets 6-10)",
			body: `Ibn Kathir repeatedly stresses Yaqub's sabr jamil: deep grief without objection to Allah's decree, plus active family leadership.\n\nHis final concern was preservation of tawhid among his children (Qur'an 2:132-133), making creed continuity his greatest legacy.`,
		},
	],
	yusuf: [
		{
			title: "Book check (Batch 3: Prophets 11-15)",
			body: `Ibn Kathir treats Surah Yusuf as a complete arc of trial to empowerment: jealousy, well, temptation, prison, governance, and forgiveness.\n\nHe also emphasizes Yusuf's tawhid dawah in prison and his refusal to leave prison before public vindication of his innocence.`,
		},
	],
	ayyub: [
		{
			title: "Book check (Batch 3: Prophets 11-15)",
			body: `Ibn Kathir highlights the long duration of Ayyub's suffering, his guarded tongue, and his concise dua with adab.\n\nThe "bundle" ruling in Surah Sad is a key legal-ethical mercy point: oath fulfillment with compassion and without injustice.`,
		},
	],
	shuayb: [
		{
			title: "Book check (Batch 3: Prophets 11-15)",
			body: `Ibn Kathir gives major weight to financial ethics in Shuayb's message: full measure, full weight, and no corruption on earth.\n\nHe links moral collapse in trade to societal collapse, then records the final destruction after warnings were mocked.`,
		},
	],
	musa: [
		{
			title: "Book check (Batch 3: Prophets 11-15)",
			body: `Ibn Kathir's Musa account is one of the longest: birth under tyranny, revelation, confrontation with Pharaoh, exodus, Torah, calf trial, and wilderness years.\n\nIt also includes key episodes: al-Khidr journey, the cow case, and many corrections for Bani Isra'il's repeated disobedience.`,
		},
	],
	harun: [
		{
			title: "Book check (Batch 3: Prophets 11-15)",
			body: `Ibn Kathir emphasizes Harun's role as Musa's supported partner in mission and his restraint during the calf fitnah.\n\nHe maintained unity as far as possible, warned the people clearly, and explained he was overpowered by the rebels.`,
		},
	],
	yahya: [
		{
			title: "Book check (Batch 5: Prophets 21-25)",
			body: `Ibn Kathir stresses Yahya's purity, early wisdom, and fearlessness in truth. He is presented as an example of disciplined youth and principled speech.\n\nHis martyrdom reports are included as part of the cost of refusing to normalize corruption.`,
		},
	],
	isa: [
		{
			title: "Book check (Batch 5: Prophets 21-25)",
			body: `Ibn Kathir covers miraculous birth, signs by Allah's permission, support to his mother, call to worship Allah alone, and rejection by some among Bani Isra'il.\n\nHe also emphasizes Islamic creed: Isa was neither killed nor crucified as claimed, and Allah raised him; his return is among major end-time signs.`,
		},
	],
	muhammad: [
		{
			title: "Book check (Batch 5: Prophets 21-25)",
			body: `Ibn Kathir presents Muhammad (peace and blessings be upon him) as final messenger and completion of prophetic chain, with emphasis on revelation, character, and universal mission.\n\nCore additions include finality of prophethood, preservation of Qur'an, and mercy-oriented leadership in law, worship, and social justice.`,
		},
	],
};

const IBN_KATHIR_SOURCE_CHAPTER: Record<string, string> = {
	adam: "Prophet Adam",
	idris: "Prophet Idris (Enoch)",
	nuh: "Prophet Nuh (Noah)",
	hud: "Prophet Hud",
	salih: "Prophet Salih",
	ibrahim: "Prophet Ibrahim (Abraham)",
	lut: "Prophet Lot (Lot)",
	ismail: "Prophet Isma'il (Ishmael)",
	ishaq: "Prophet Ishaq (Isaac)",
	yaqub: "Prophet Yaqub (Jacob)",
	yusuf: "Prophet Yusuf (Joseph)",
	ayyub: "Prophet Ayoub (Job)",
	shuayb: "Prophet Shuaib",
	musa: "Prophet Musa (Moses) & Harun (Aaron)",
	harun: "Prophet Musa (Moses) & Harun (Aaron)",
	"dhul-kifl": "Prophet Dhul-Kifl",
	dawud: "Prophet Dawud (David)",
	sulayman: "Prophet Sulaiman (Soloman)",
	ilyas: "Prophet Elyas (Elisha)",
	"al-yasa": "Prophet Elyas (Elisha) and related later-prophet sections",
	yunus: "Prophet Yunus (Jonah)",
	zakariyya: "Prophet Zakariyah (Zechariah)",
	yahya: "Prophet Yahya (John)",
	isa: "Prophet Isa (Jesus)",
	muhammad: "Prophet Muhammad",
};

const IBN_KATHIR_CLASSROOM_PROMPTS: Record<string, ProphetStorySection[]> = {
	adam: [
		{
			title: "Classroom questions (Batch 1: Prophets 1-5)",
			body: ` What was Iblis's core sin, and how does that appear in school life today?\n\n Why is "knowledge" central in Adam's story?\n\n What is the difference between making a mistake and persisting in arrogance?\n\n How can students practice immediate repentance this week?`,
		},
	],
	idris: [
		{
			title: "Classroom questions (Batch 1: Prophets 1-5)",
			body: ` Why does Idris's story connect worship with discipline?\n\n Which of Idris's wise sayings is most practical for teenagers and why?\n\n How does self-accountability (muhasabah) improve character?\n\n What is one "excess" students can reduce this week?`,
		},
	],
	nuh: [
		{
			title: "Classroom questions (Batch 1: Prophets 1-5)",
			body: ` Why does shirk often begin with "small steps"?\n\n What methods did Nuh use in dawah (public/private, day/night)?\n\n What lesson comes from the story of Nuh's son?\n\n How should students define success when results are slow?`,
		},
	],
	hud: [
		{
			title: "Classroom questions (Batch 1: Prophets 1-5)",
			body: ` How can strength and wealth become a test instead of a blessing?\n\n What signs of arrogance appear in 'Ad?\n\n Why do people reject reminders even when they are clear?\n\n What protects a student from pride?`,
		},
	],
	salih: [
		{
			title: "Classroom questions (Batch 1: Prophets 1-5)",
			body: ` Why did Thamud demand a miracle, then reject it?\n\n What does the she-camel test teach about respecting limits?\n\n How does delaying repentance increase danger?\n\n What modern examples resemble "harming clear signs"?`,
		},
	],
	ibrahim: [
		{
			title: "Classroom questions (Batch 2: Prophets 6-10)",
			body: ` How did Ibrahim use reasoning against idolatry?\n\n Why is migration for Allah a recurring theme in his story?\n\n What do his family duas teach about long-term vision?\n\n How can students practice principled courage without disrespect?`,
		},
	],
	lut: [
		{
			title: "Classroom questions (Batch 2: Prophets 6-10)",
			body: ` Why did Lut continue warning despite severe mockery?\n\n What does his wife's story teach about loyalty to truth?\n\n Why was immediate obedience in leaving the city essential?\n\n How can students reject public sin without becoming harsh?`,
		},
	],
	ismail: [
		{
			title: "Classroom questions (Batch 2: Prophets 6-10)",
			body: ` What is the difference between tawakkul and passivity in Hajar's effort?\n\n Why is Ismail's obedience central to his prophetic rank?\n\n How does building the Ka'bah connect worship and legacy?\n\n What promise can a student keep this week to imitate Ismail's reliability?`,
		},
	],
	ishaq: [
		{
			title: "Classroom questions (Batch 2: Prophets 6-10)",
			body: ` What does Ishaq's birth in old age teach about Allah's decree?\n\n Why must students distinguish Qur'anic certainty from extra reports?\n\n How does family lineage become responsibility, not pride?\n\n What makes a family spiritually blessed across generations?`,
		},
	],
	yaqub: [
		{
			title: "Classroom questions (Batch 2: Prophets 6-10)",
			body: ` What is "beautiful patience" in practical behavior?\n\n Why did Yaqub pair planning with tawakkul?\n\n How can grief remain faithful without becoming despair?\n\n What final advice would you leave your family about tawhid?`,
		},
	],
	yusuf: [
		{
			title: "Classroom questions (Batch 3: Prophets 11-15)",
			body: ` Which stage in Yusuf's life best defines integrity and why?\n\n Why did Yusuf prioritize clearing his name before leaving prison?\n\n How did he use authority ethically after hardship?\n\n What does prophetic forgiveness look like in school conflicts?`,
		},
	],
	ayyub: [
		{
			title: "Classroom questions (Batch 3: Prophets 11-15)",
			body: ` What is the adab of dua in Ayyub's supplication?\n\n How can someone suffer deeply and still stay spiritually strong?\n\n Why is family support part of the story's lesson?\n\n What daily habit builds sabr in teenagers?`,
		},
	],
	shuayb: [
		{
			title: "Classroom questions (Batch 3: Prophets 11-15)",
			body: ` Why is business honesty treated as a faith issue?\n\n How does cheating harm both individuals and society?\n\n Why did Shuayb reject compromise under pressure?\n\n What small school-level actions reflect economic integrity?`,
		},
	],
	musa: [
		{
			title: "Classroom questions (Batch 3: Prophets 11-15)",
			body: ` Which trial in Musa's life best teaches leadership under pressure?\n\n Why did miracles not benefit Pharaoh's arrogant heart?\n\n How do we balance courage with humility in confronting wrong?\n\n What does Musa's story teach about repeated repentance after failure?`,
		},
	],
	harun: [
		{
			title: "Classroom questions (Batch 3: Prophets 11-15)",
			body: ` Why was Harun's supportive role essential to Musa's mission?\n\n What does his response during the calf fitnah teach about crisis leadership?\n\n How do we preserve unity without approving wrongdoing?\n\n What does healthy teamwork look like in Islamic service?`,
		},
	],
	"dhul-kifl": [
		{
			title: "Classroom questions (Batch 4: Prophets 16-20)",
			body: ` Why is Dhul-Kifl linked to patience and excellence even with fewer details?\n\n What do promises reveal about a person's faith?\n\n How does anger control improve judgment?\n\n What covenant can students commit to and keep this month?`,
		},
	],
	dawud: [
		{
			title: "Classroom questions (Batch 4: Prophets 16-20)",
			body: ` How did Dawud combine worship with governance?\n\n Why is justice impossible without careful listening?\n\n What does his story teach about talent as an amanah?\n\n How can students use strengths without arrogance?`,
		},
	],
	sulayman: [
		{
			title: "Classroom questions (Batch 4: Prophets 16-20)",
			body: ` Why did Sulayman repeatedly attribute power to Allah's favor?\n\n How does his death story correct beliefs about unseen knowledge?\n\n What leadership habits in his story should students imitate?\n\n How can gratitude protect people in high positions?`,
		},
	],
	ilyas: [
		{
			title: "Classroom questions (Batch 4: Prophets 16-20)",
			body: ` Why does idol worship reappear across generations?\n\n What made Ilyas steadfast despite small support?\n\n How can students stand firm without being socially aggressive?\n\n What is one modern "false idol" teenagers may follow?`,
		},
	],
	"al-yasa": [
		{
			title: "Classroom questions (Batch 4: Prophets 16-20)",
			body: ` Why is continuity after a great leader difficult?\n\n How does Al-Yasa's story teach consistency over hype?\n\n What systems help preserve guidance in a community?\n\n What weekly routine can students sustain for 30 days?`,
		},
	],
	yunus: [
		{
			title: "Classroom questions (Batch 5: Prophets 21-25)",
			body: ` What does Yunus's dua teach about repentance language?\n\n Why is acting in emotion risky in leadership?\n\n How did Allah turn correction into mercy?\n\n What should a student do immediately after a mistake?`,
		},
	],
	zakariyya: [
		{
			title: "Classroom questions (Batch 5: Prophets 21-25)",
			body: ` Why is private dua emphasized in Zakariyya's story?\n\n How did hope survive old age and impossible means?\n\n What kind of legacy did he ask Allah for?\n\n How can students make sincere dua without show?`,
		},
	],
	yahya: [
		{
			title: "Classroom questions (Batch 5: Prophets 21-25)",
			body: ` What does "wisdom in youth" challenge in our assumptions?\n\n How are purity and courage connected in Yahya's story?\n\n Why is respect for parents highlighted with prophethood?\n\n What does moral bravery look like for teenagers today?`,
		},
	],
	isa: [
		{
			title: "Classroom questions (Batch 5: Prophets 21-25)",
			body: ` Which beliefs about Isa are essential in Islamic creed?\n\n Why must miracles be described as "by Allah's permission"?\n\n How did Isa combine mercy with truth?\n\n Why is correct belief about prophets necessary for salvation?`,
		},
	],
	muhammad: [
		{
			title: "Classroom questions (Batch 5: Prophets 21-25)",
			body: ` What does "final messenger" require from Muslims today?\n\n How did prophetic character shape justice and mercy together?\n\n Why is Qur'an preservation central to his mission?\n\n What sunnah habit can students adopt consistently this week?`,
		},
	],
};

const IBN_KATHIR_TEACHER_NOTES: Record<string, ProphetStorySection[]> = {
	adam: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Understand repentance, obedience, and Shaytan's deception.\n\n Explain why knowledge is an honor and responsibility.\n\n Distinguish mistake-plus-repentance from arrogance.` }],
	idris: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Define sidq (truthfulness) as a full-life commitment.\n\n Practice muhasabah as a daily discipline.\n\n Connect worship routines to character formation.` }],
	nuh: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Describe how shirk can begin gradually.\n\n Identify multiple methods of prophetic dawah.\n\n Explain patient perseverance without number-based success.` }],
	hud: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Analyze arrogance as a social and spiritual disease.\n\n Connect gratitude to preservation of blessings.\n\n Explain why warnings preceded punishment.` }],
	salih: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain the she-camel as a test of obedience.\n\n Analyze rebellion after clear evidence.\n\n Recognize urgency of repentance before consequences.` }],
	ibrahim: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Evaluate rational argument against false worship.\n\n Explain sacrifice and migration for Allah's sake.\n\n Trace Ibrahim's long-term family and ummah vision through dua.` }],
	lut: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain prophetic courage in morally hostile societies.\n\n Distinguish family ties from faith-based loyalty.\n\n Analyze urgency and completeness of obedience in crisis.` }],
	ismail: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain tawakkul as trust with action.\n\n Identify obedience and reliability in Ismail's character.\n\n Connect Ka'bah-building to intergenerational worship legacy.` }],
	ishaq: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain divine promise beyond material probabilities.\n\n Distinguish Qur'anic certainties from historical reports.\n\n Connect family blessing to guidance responsibility.` }],
	yaqub: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Define sabr jamil in practical emotional behavior.\n\n Balance planning with trust in Allah.\n\n Explain why hope in Allah is creed, not mood.` }],
	yusuf: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Trace integrity across Yusuf's trials.\n\n Explain justice, patience, and forgiveness in leadership.\n\n Apply prophetic conflict resolution in student life.` }],
	ayyub: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain sabr during prolonged hardship.\n\n Analyze adab of dua in Ayyub's supplication.\n\n Identify restorative mercy after faithful endurance.` }],
	shuayb: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Connect economic honesty to faith.\n\n Identify social damage caused by cheating and corruption.\n\n Explain steadfast truth under pressure.` }],
	musa: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Trace major stages of Musa's mission and leadership.\n\n Explain reliance on Allah in confrontation with tyranny.\n\n Analyze repeated correction, repentance, and covenant discipline.` }],
	harun: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain helper-leadership in prophetic missions.\n\n Analyze Harun's strategy during the calf crisis.\n\n Balance unity-preservation with truth-speaking.` }],
	"dhul-kifl": [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain patience and covenant-keeping as prophetic virtues.\n\n Practice anger control as ethical strength.\n\n Connect consistency in worship to moral reliability.` }],
	dawud: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain integration of worship, skill, and governance.\n\n Analyze justice through careful hearing and humility.\n\n Identify gratitude in power and talent use.` }],
	sulayman: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain power as test, not entitlement.\n\n Analyze gratitude language in leadership moments.\n\n Correct beliefs about unseen knowledge using his death account.` }],
	ilyas: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain resistance to idolatry and social falsehood.\n\n Analyze steadfastness with low public support.\n\n Apply principled firmness with respectful communication.` }],
	"al-yasa": [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain continuity of guidance after major prophets.\n\n Value consistency over short-term enthusiasm.\n\n Identify structures that preserve communal faith practice.` }],
	yunus: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain repentance formula in Yunus's dua.\n\n Analyze emotional haste and prophetic correction.\n\n Show how communities can still change through repentance.` }],
	zakariyya: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain sincere private dua and certainty in Allah's power.\n\n Analyze hope beyond age and apparent impossibility.\n\n Connect righteous legacy with prophetic concern.` }],
	yahya: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain wisdom and purity in youth.\n\n Connect moral courage with taqwa.\n\n Highlight respect for parents as prophetic character.` }],
	isa: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Clarify Islamic creed regarding Isa and his miracles.\n\n Emphasize "by Allah's permission" in miracle narratives.\n\n Distinguish authentic belief from theological exaggeration.` }],
	muhammad: [{ title: "Teacher notes", body: ` Lesson objectives:\n\n Explain finality of prophethood and universality of message.\n\n Analyze prophetic character as model for justice and mercy.\n\n Connect Qur'an preservation to ongoing guidance responsibility.` }],
};

export const PROPHET_STORIES: ProphetStory[] = PROPHETS.map((p) => {
	const content =
		STORY_CONTENT_BY_SLUG[p.slug] ??
		SUPPLEMENTAL_IBN_KATHIR_STORIES[p.slug] ??
		PDF_BOOK_STORY_CONTENT[p.slug];
	if (!content) {
		throw new Error(`Missing Stories of the Prophets content for slug: ${p.slug}`);
	}
	const teacherNotes = IBN_KATHIR_TEACHER_NOTES[p.slug] ?? [];
	const sectionsFinal = content.sections.slice();
	if (teacherNotes.length > 0 && sectionsFinal.length > 0) {
		const objectives = teacherNotes.map((n) => n.body).join("\n\n");
		const first = sectionsFinal[0];
		const firstBody = getText(first.body);
		sectionsFinal[0] = {
			...first,
			body: `Learning objectives:\n\n${objectives}\n\n${firstBody}`,
		};
	}

	return {
		slug: p.slug,
		name: formatProphetNamesWithPbuh(p.name),
		shortIntro: content.shortIntro,
		sections: normalizeSectionsWithQuiz(
			normalizeSectionNumbering(sectionsFinal)
		),
		quranSurahs: content.quranSurahs,
	};
});

export function getProphetStoryBySlug(slug: string): ProphetStory | undefined {
	return PROPHET_STORIES.find((p) => p.slug === slug);
}

