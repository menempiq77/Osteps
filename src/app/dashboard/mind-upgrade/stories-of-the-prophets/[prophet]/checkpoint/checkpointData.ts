/**
 * Checkpoint game data for each prophet
 * Stage 1 (Part 4): Ordering events from Part 4
 * Stage 2 (Part 8): Cause & Effect matching from Part 8
 * Stage 3 (Part 12): Main lesson application from Parts 9-11
 */

export type CheckpointConfig = {
  part4: {
    events: Array<{ id: string; label: string }>;
  };
  part8: {
    pairs: Array<{ id: string; left: string; right: string }>;
  };
  part12: {
    options: Array<{ id: string; label: string; isCorrect: boolean }>;
  };
};

export const CHECKPOINT_DATA: Record<string, CheckpointConfig> = {
  adam: {
    part4: {
      events: [
        { id: "teach", label: "Allah teaches Adam the names of all things" },
        { id: "ask", label: "Allah asks the angels to name them" },
        { id: "admit", label: "The angels admit their limited knowledge" },
        { id: "inform", label: "Adam names the objects by Allah's teaching" },
      ],
    },
    part8: {
      pairs: [
        { id: "command", left: "Allah gives a clear command", right: "The beginning of the test of obedience" },
        { id: "whisper", left: "Satan whispers with deception", right: "Temptation and misleading promises" },
        { id: "eat", left: "Adam and Eve eat from the tree", right: "Feeling of shame and loss" },
        { id: "aware", left: "Awareness of disobedience", right: "Responsibility and accountability" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Adam was punished without mercy", isCorrect: false },
        { id: "B", label: "Life on earth has no purpose", isCorrect: false },
        { id: "C", label: "Sincere repentance leads to Allah's forgiveness and guidance", isCorrect: true },
        { id: "D", label: "Humans are free from struggle", isCorrect: false },
      ],
    },
  },

  idris: {
    part4: {
      events: [
        { id: "truth", label: "Idris was a man of complete truth" },
        { id: "prophet", label: "Allah chose him as a prophet" },
        { id: "guide", label: "He guided people after Adam and Seth" },
        { id: "elevated", label: "Allah raised him to a high station" },
      ],
    },
    part8: {
      pairs: [
        { id: "truth", left: "Idris embodied truthfulness", right: "His entire life reflected honesty" },
        { id: "prophet", left: "He received divine prophethood", right: "Carried Allah's message to people" },
        { id: "darkness", left: "Darkness spread among mankind", right: "Idris served as a lighthouse of guidance" },
        { id: "elevated", left: "Allah raised him", right: "Honored with a high station" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Speaking truth occasionally is enough", isCorrect: false },
        { id: "B", label: "Prophets don't need to practice what they teach", isCorrect: false },
        { id: "C", label: "Living with complete truthfulness in every deed earns Allah's elevation", isCorrect: true },
        { id: "D", label: "Guidance is only for prophets", isCorrect: false },
      ],
    },
  },

  nuh: {
    part4: {
      events: [
        { id: "call", label: "Nuh calls his people to worship Allah alone" },
        { id: "reject", label: "The people mock and reject him" },
        { id: "continue", label: "Nuh continues calling for 950 years" },
        { id: "command", label: "Allah commands him to build the ark" },
      ],
    },
    part8: {
      pairs: [
        { id: "call", left: "Nuh calls his people day and night", right: "They increase in their disbelief" },
        { id: "patience", left: "950 years of patience", right: "Ultimate trust in Allah's plan" },
        { id: "ark", left: "Building the ark on dry land", right: "People mock but Allah protects" },
        { id: "flood", left: "The flood comes", right: "Only believers are saved" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Give up when people don't listen quickly", isCorrect: false },
        { id: "B", label: "Results matter more than effort", isCorrect: false },
        { id: "C", label: "Continue calling to truth with patience, trusting Allah's wisdom", isCorrect: true },
        { id: "D", label: "Success is measured by numbers of followers", isCorrect: false },
      ],
    },
  },

  hud: {
    part4: {
      events: [
        { id: "sent", label: "Hud is sent to the people of 'Ad" },
        { id: "warn", label: "He warns them against arrogance and disobedience" },
        { id: "refuse", label: "They refuse and mock him" },
        { id: "destroy", label: "Allah destroys them with a fierce wind" },
      ],
    },
    part8: {
      pairs: [
        { id: "power", left: "'Ad had great power and wealth", right: "They became arrogant and forgot Allah" },
        { id: "hud", left: "Hud called them to humility", right: "They mocked and rejected him" },
        { id: "warning", left: "Clear warning given", right: "They chose arrogance over guidance" },
        { id: "wind", left: "Fierce wind came", right: "Complete destruction of the arrogant" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Wealth and power guarantee safety", isCorrect: false },
        { id: "B", label: "Arrogance is acceptable if you're strong", isCorrect: false },
        { id: "C", label: "True strength is humility before Allah, regardless of worldly power", isCorrect: true },
        { id: "D", label: "Warnings don't apply to successful people", isCorrect: false },
      ],
    },
  },

  salih: {
    part4: {
      events: [
        { id: "sent", label: "Salih sent to the people of Thamud" },
        { id: "camel", label: "Allah sends the she-camel as a sign" },
        { id: "kill", label: "They kill the she-camel" },
        { id: "punish", label: "Allah's punishment comes after three days" },
      ],
    },
    part8: {
      pairs: [
        { id: "sign", left: "The she-camel was a clear sign", right: "A test of obedience and mercy" },
        { id: "rebel", left: "Thamud rebelled against the command", right: "They killed the innocent animal" },
        { id: "warning", left: "Three days warning given", right: "Time to repent before punishment" },
        { id: "earth", left: "Earthquake struck", right: "Complete destruction of the defiant" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Harming innocents has no consequences", isCorrect: false },
        { id: "B", label: "Signs from Allah don't require obedience", isCorrect: false },
        { id: "C", label: "Respecting Allah's signs and commands protects from destruction", isCorrect: true },
        { id: "D", label: "Rebellion is freedom", isCorrect: false },
      ],
    },
  },

  ibrahim: {
    part4: {
      events: [
        { id: "idols", label: "Ibrahim questions his people's idol worship" },
        { id: "break", label: "He breaks the idols except the largest" },
        { id: "fire", label: "They throw him into the fire" },
        { id: "cool", label: "Allah makes the fire cool and safe" },
      ],
    },
    part8: {
      pairs: [
        { id: "truth", left: "Ibrahim seeks the truth", right: "Discovers Allah through reflection" },
        { id: "challenge", left: "Challenges idol worship logically", right: "People choose tradition over truth" },
        { id: "fire", left: "Thrown into burning fire", right: "Complete trust in Allah" },
        { id: "cool", left: "Fire becomes cool", right: "Allah protects those who trust Him" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Follow tradition even if it's wrong", isCorrect: false },
        { id: "B", label: "Fear people more than Allah", isCorrect: false },
        { id: "C", label: "Stand for truth with courage, trusting Allah's protection", isCorrect: true },
        { id: "D", label: "Avoid challenging wrongdoing", isCorrect: false },
      ],
    },
  },

  lut: {
    part4: {
      events: [
        { id: "sent", label: "Lut sent to a people committing terrible sins" },
        { id: "warn", label: "He warns them repeatedly" },
        { id: "reject", label: "They reject him and threaten him" },
        { id: "angels", label: "Angels come with Allah's command" },
      ],
    },
    part8: {
      pairs: [
        { id: "sin", left: "People committed shameful acts", right: "Lut warned them continuously" },
        { id: "threat", left: "They threatened to expel Lut", right: "He remained firm in his message" },
        { id: "angels", left: "Angels arrived as guests", right: "Lut worried for their safety" },
        { id: "escape", left: "Command to leave at night", right: "Immediate and complete obedience" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Stay silent about sin to avoid conflict", isCorrect: false },
        { id: "B", label: "Compromise your values to fit in", isCorrect: false },
        { id: "C", label: "Speak truth against evil even when threatened, trusting Allah", isCorrect: true },
        { id: "D", label: "Majority opinion defines right and wrong", isCorrect: false },
      ],
    },
  },

  ismail: {
    part4: {
      events: [
        { id: "left", label: "Ibrahim leaves Ismail and Hajar in Makkah" },
        { id: "trust", label: "Hajar trusts Allah's plan completely" },
        { id: "water", label: "Water springs from Zamzam" },
        { id: "build", label: "Ibrahim and Ismail build the Ka'bah" },
      ],
    },
    part8: {
      pairs: [
        { id: "desert", left: "Left in empty desert", right: "Complete trust in Allah" },
        { id: "search", left: "Hajar runs between hills", right: "Effort with trust brings provision" },
        { id: "zamzam", left: "Zamzam springs forth", right: "Allah's mercy for those who trust" },
        { id: "build", left: "Building the Ka'bah", right: "Establishing worship of One Allah" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Trust means don't make effort", isCorrect: false },
        { id: "B", label: "Difficult situations mean Allah has abandoned you", isCorrect: false },
        { id: "C", label: "Trust Allah completely while making effort, knowing He provides", isCorrect: true },
        { id: "D", label: "Question every command", isCorrect: false },
      ],
    },
  },

  ishaq: {
    part4: {
      events: [
        { id: "promise", label: "Allah promises Ibrahim a son in old age" },
        { id: "news", label: "Angels bring news of Ishaq" },
        { id: "born", label: "Ishaq is born to Sarah" },
        { id: "continue", label: "Prophethood continues through his line" },
      ],
    },
    part8: {
      pairs: [
        { id: "wait", left: "Long years of waiting", right: "Testing patience and trust" },
        { id: "news", left: "Angels bring glad tidings", right: "Allah's promise fulfilled perfectly" },
        { id: "family", left: "Blessed family established", right: "Legacy of faith and prophethood" },
        { id: "line", left: "Many prophets from his lineage", right: "Blessing continues through generations" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Allah's promises don't always come true", isCorrect: false },
        { id: "B", label: "Age prevents Allah's will", isCorrect: false },
        { id: "C", label: "Allah fulfills His promises perfectly in His perfect timing", isCorrect: true },
        { id: "D", label: "Blessings are random", isCorrect: false },
      ],
    },
  },

  yaqub: {
    part4: {
      events: [
        { id: "love", label: "Yaqub loves his son Yusuf deeply" },
        { id: "lost", label: "Yusuf is taken away" },
        { id: "patience", label: "Yaqub remains patient for years" },
        { id: "reunite", label: "Allah reunites them" },
      ],
    },
    part8: {
      pairs: [
        { id: "test", left: "Losing beloved son", right: "Test of patience and faith" },
        { id: "eyes", left: "Cried until his eyes became white", right: "Never complained about Allah" },
        { id: "hope", left: "Never lost hope", right: "Said 'I complain to Allah alone'" },
        { id: "reunite", left: "Patience rewarded", right: "Family reunited by Allah's mercy" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Crying means weak faith", isCorrect: false },
        { id: "B", label: "Loss means Allah doesn't care", isCorrect: false },
        { id: "C", label: "Beautiful patience means trusting Allah while feeling pain, never despairing", isCorrect: true },
        { id: "D", label: "Hide your feelings completely", isCorrect: false },
      ],
    },
  },

  yusuf: {
    part4: {
      events: [
        { id: "dream", label: "Yusuf sees a dream of stars bowing" },
        { id: "well", label: "Brothers throw him in the well" },
        { id: "egypt", label: "He is taken to Egypt" },
        { id: "prison", label: "He is imprisoned unjustly" },
      ],
    },
    part8: {
      pairs: [
        { id: "betray", left: "Betrayed by his brothers", right: "Remained patient and forgiving" },
        { id: "tempt", left: "Tempted by powerful woman", right: "Chose prison over sin" },
        { id: "prison", left: "Imprisoned unjustly", right: "Used time to call to Allah" },
        { id: "king", left: "Became minister of Egypt", right: "Used power for justice and mercy" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Revenge when you gain power", isCorrect: false },
        { id: "B", label: "Choose sin to escape difficulty", isCorrect: false },
        { id: "C", label: "Maintain integrity in hardship, forgive when able, trust Allah's plan", isCorrect: true },
        { id: "D", label: "Blame Allah for injustice", isCorrect: false },
      ],
    },
  },

  ayyub: {
    part4: {
      events: [
        { id: "wealth", label: "Ayyub had great wealth and family" },
        { id: "test", label: "He loses everything - wealth, health, family" },
        { id: "patience", label: "He remains patient, never complains" },
        { id: "restore", label: "Allah restores everything doubled" },
      ],
    },
    part8: {
      pairs: [
        { id: "loss", left: "Lost wealth and children", right: "Said 'Allah gave, Allah took'" },
        { id: "sick", left: "Became severely ill", right: "Never questioned Allah's wisdom" },
        { id: "alone", left: "People left him except his wife", right: "Remained grateful for Allah" },
        { id: "dua", left: "Made simple humble dua", right: "Allah responded with complete cure" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Good people don't face hardship", isCorrect: false },
        { id: "B", label: "Complain when tested", isCorrect: false },
        { id: "C", label: "True patience means submitting to Allah in all circumstances with gratitude", isCorrect: true },
        { id: "D", label: "Health and wealth are signs of faith", isCorrect: false },
      ],
    },
  },

  shuayb: {
    part4: {
      events: [
        { id: "sent", label: "Shu'ayb sent to people of Madyan" },
        { id: "cheat", label: "They cheated in business and measurements" },
        { id: "warn", label: "He warned them about dishonesty" },
        { id: "punish", label: "They rejected him and were destroyed" },
      ],
    },
    part8: {
      pairs: [
        { id: "cheat", left: "Cheating in measurements", right: "Stealing people's rights" },
        { id: "call", left: "Shu'ayb called to honesty", right: "They chose profit over principle" },
        { id: "threat", left: "They threatened him", right: "He remained firm on truth" },
        { id: "earth", left: "Earthquake struck", right: "Dishonest were destroyed" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Small dishonesty doesn't matter", isCorrect: false },
        { id: "B", label: "Business is separate from faith", isCorrect: false },
        { id: "C", label: "Complete honesty in all dealings is part of faith and protects society", isCorrect: true },
        { id: "D", label: "Profit justifies any means", isCorrect: false },
      ],
    },
  },

  musa: {
    part4: {
      events: [
        { id: "baby", label: "Baby Musa placed in the river by his mother" },
        { id: "palace", label: "Pharaoh's family takes him from the river" },
        { id: "kill", label: "Musa accidentally kills an Egyptian" },
        { id: "flee", label: "He flees to Madyan for safety" },
      ],
    },
    part8: {
      pairs: [
        { id: "fear", left: "Mother feared for her baby", right: "Allah guided her to the river" },
        { id: "palace", left: "Raised in Pharaoh's palace", right: "Prepared for future confrontation" },
        { id: "help", left: "Defended the oppressed", right: "Accident led to exile" },
        { id: "flee", left: "Fled from danger", right: "Found refuge and purpose" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Stay silent when witnessing injustice", isCorrect: false },
        { id: "B", label: "Fear prevents action", isCorrect: false },
        { id: "C", label: "Stand against oppression with courage, trusting Allah's plan", isCorrect: true },
        { id: "D", label: "Power justifies tyranny", isCorrect: false },
      ],
    },
  },

  harun: {
    part4: {
      events: [
        { id: "chosen", label: "Harun chosen as Musa's helper" },
        { id: "pharaoh", label: "They both go to Pharaoh" },
        { id: "left", label: "Harun left with the people" },
        { id: "calf", label: "People worship the golden calf" },
      ],
    },
    part8: {
      pairs: [
        { id: "help", left: "Musa asked for Harun's help", right: "Allah granted his request" },
        { id: "team", left: "Two prophets working together", right: "Stronger message delivery" },
        { id: "test", left: "Harun faced the calf worshippers", right: "He tried to stop them" },
        { id: "support", left: "Supporting his brother", right: "Shared responsibility" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Leadership means doing everything alone", isCorrect: false },
        { id: "B", label: "Asking for help shows weakness", isCorrect: false },
        { id: "C", label: "Working as a team strengthens the message and shares the burden", isCorrect: true },
        { id: "D", label: "Prophets don't need support", isCorrect: false },
      ],
    },
  },

  "dhul-kifl": {
    part4: {
      events: [
        { id: "promise", label: "Dhul-Kifl made promises to his people" },
        { id: "keep", label: "He fulfilled every commitment" },
        { id: "test", label: "Satan tried to make him break his word" },
        { id: "firm", label: "He remained firm on his promises" },
      ],
    },
    part8: {
      pairs: [
        { id: "commit", left: "Made clear commitments", right: "Took them seriously" },
        { id: "test", left: "Tested by Satan", right: "Refused to break his word" },
        { id: "patience", left: "Showed patience", right: "Allah honored him" },
        { id: "trust", left: "People could trust him", right: "Built strong community" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Promises can be broken when difficult", isCorrect: false },
        { id: "B", label: "Small promises don't matter", isCorrect: false },
        { id: "C", label: "Keeping promises builds trust and pleases Allah", isCorrect: true },
        { id: "D", label: "Only big promises need to be kept", isCorrect: false },
      ],
    },
  },

  dawud: {
    part4: {
      events: [
        { id: "giant", label: "Young Dawud faces Goliath" },
        { id: "sling", label: "He uses a slingshot with Allah's help" },
        { id: "king", label: "Becomes king after victory" },
        { id: "psalms", label: "Allah gives him the Psalms (Zabur)" },
      ],
    },
    part8: {
      pairs: [
        { id: "young", left: "Young but brave", right: "Size doesn't determine success" },
        { id: "trust", left: "Trusted Allah completely", right: "Defeated the giant" },
        { id: "justice", left: "Became a just king", right: "Ruled with wisdom" },
        { id: "worship", left: "Beautiful voice in worship", right: "Mountains echoed with him" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Only strong people can succeed", isCorrect: false },
        { id: "B", label: "Power comes from physical strength", isCorrect: false },
        { id: "C", label: "True strength comes from faith, and justice requires wisdom", isCorrect: true },
        { id: "D", label: "Age determines capability", isCorrect: false },
      ],
    },
  },

  sulayman: {
    part4: {
      events: [
        { id: "inherit", label: "Sulayman inherits prophethood and kingdom" },
        { id: "gift", label: "Allah gives him power over wind and jinn" },
        { id: "queen", label: "Queen of Sheba hears about him" },
        { id: "submit", label: "She submits to Allah after seeing his wisdom" },
      ],
    },
    part8: {
      pairs: [
        { id: "power", left: "Great power given", right: "Used for building and teaching" },
        { id: "wisdom", left: "Spoke with wisdom", right: "Guided others to truth" },
        { id: "grateful", left: "Always grateful to Allah", right: "Power didn't corrupt him" },
        { id: "queen", left: "Queen brought with respect", right: "Wisdom wins hearts" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Power is for personal pleasure", isCorrect: false },
        { id: "B", label: "Wealth means you don't need Allah", isCorrect: false },
        { id: "C", label: "Use blessings with gratitude to serve others and worship Allah", isCorrect: true },
        { id: "D", label: "Authority means you can do anything", isCorrect: false },
      ],
    },
  },

  ilyas: {
    part4: {
      events: [
        { id: "sent", label: "Ilyas sent to people worshipping Baal" },
        { id: "call", label: "He called them to worship Allah alone" },
        { id: "reject", label: "They rejected and threatened him" },
        { id: "firm", label: "He remained firm despite persecution" },
      ],
    },
    part8: {
      pairs: [
        { id: "idols", left: "People worshipped Baal idol", right: "Ilyas exposed the falsehood" },
        { id: "brave", left: "Stood alone against many", right: "Courage from faith" },
        { id: "threat", left: "Threatened by rulers", right: "Didn't compromise truth" },
        { id: "firm", left: "Remained steadfast", right: "Example of unwavering faith" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Compromise truth to avoid conflict", isCorrect: false },
        { id: "B", label: "Popular opinion defines right and wrong", isCorrect: false },
        { id: "C", label: "Hold firm to truth even when standing alone", isCorrect: true },
        { id: "D", label: "Avoid calling out falsehood", isCorrect: false },
      ],
    },
  },

  "al-yasa": {
    part4: {
      events: [
        { id: "succeed", label: "Al-Yasa' succeeds Prophet Ilyas" },
        { id: "continue", label: "He continues calling to Allah" },
        { id: "patient", label: "Shows patience with difficult people" },
        { id: "steady", label: "Remains steadfast in mission" },
      ],
    },
    part8: {
      pairs: [
        { id: "inherit", left: "Inherited the mission", right: "Continued without changing" },
        { id: "same", left: "Same message as Ilyas", right: "Truth doesn't change" },
        { id: "persist", left: "Faced similar rejection", right: "Persisted with patience" },
        { id: "steady", left: "Steady in commitment", right: "Consistency brings success" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Change the message to please people", isCorrect: false },
        { id: "B", label: "Give up when progress is slow", isCorrect: false },
        { id: "C", label: "Stay consistent with truth and persist patiently", isCorrect: true },
        { id: "D", label: "Quick results are necessary", isCorrect: false },
      ],
    },
  },

  yunus: {
    part4: {
      events: [
        { id: "leave", label: "Yunus leaves his people in anger" },
        { id: "ship", label: "Boards a ship that faces a storm" },
        { id: "whale", label: "Swallowed by a whale" },
        { id: "dua", label: "Makes sincere dua in darkness" },
      ],
    },
    part8: {
      pairs: [
        { id: "frustrate", left: "Left in frustration", right: "Learned about patience" },
        { id: "whale", left: "Darkness of the whale", right: "Perfect place for reflection" },
        { id: "dua", left: "Called to Allah sincerely", right: "Immediate response" },
        { id: "return", left: "Returned to his people", right: "They had believed" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Leave when people don't respond quickly", isCorrect: false },
        { id: "B", label: "Frustration justifies abandoning duty", isCorrect: false },
        { id: "C", label: "Return to Allah sincerely, trust His timing and wisdom", isCorrect: true },
        { id: "D", label: "Results must be immediate", isCorrect: false },
      ],
    },
  },

  zakariyya: {
    part4: {
      events: [
        { id: "old", label: "Zakariyya is old with no children" },
        { id: "dua", label: "Makes sincere dua for a child" },
        { id: "yahya", label: "Allah gives him Yahya in old age" },
        { id: "grateful", label: "He is grateful for the blessing" },
      ],
    },
    part8: {
      pairs: [
        { id: "hope", left: "Old age and no children", right: "Never lost hope in Allah" },
        { id: "private", left: "Made dua privately", right: "Sincere and humble" },
        { id: "miracle", left: "Birth in old age", right: "Allah's power is unlimited" },
        { id: "name", left: "Allah named the child", right: "Special blessing" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Age makes dua pointless", isCorrect: false },
        { id: "B", label: "Some things are impossible", isCorrect: false },
        { id: "C", label: "Never stop asking Allah; His power has no limits", isCorrect: true },
        { id: "D", label: "Public dua is better than private", isCorrect: false },
      ],
    },
  },

  yahya: {
    part4: {
      events: [
        { id: "born", label: "Yahya born as a miracle" },
        { id: "wisdom", label: "Given wisdom as a child" },
        { id: "pure", label: "Lives a pure and humble life" },
        { id: "brave", label: "Speaks truth against corruption" },
      ],
    },
    part8: {
      pairs: [
        { id: "child", left: "Wisdom given in childhood", right: "Age doesn't limit understanding" },
        { id: "pure", left: "Lived purely", right: "Protected from temptation" },
        { id: "humble", left: "Humble despite status", right: "Close to Allah" },
        { id: "truth", left: "Spoke truth to power", right: "Bravery from faith" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Youth means you can't understand faith", isCorrect: false },
        { id: "B", label: "Stay silent about corruption to stay safe", isCorrect: false },
        { id: "C", label: "Live purely and speak truth bravely, regardless of age", isCorrect: true },
        { id: "D", label: "Wisdom comes only with old age", isCorrect: false },
      ],
    },
  },

  isa: {
    part4: {
      events: [
        { id: "birth", label: "Isa born miraculously without a father" },
        { id: "cradle", label: "Speaks from the cradle defending his mother" },
        { id: "miracles", label: "Performs miracles by Allah's permission" },
        { id: "message", label: "Calls people to worship Allah alone" },
      ],
    },
    part8: {
      pairs: [
        { id: "miracle", left: "Born without father", right: "Allah's power over creation" },
        { id: "speak", left: "Spoke as a baby", right: "Defended his mother's honor" },
        { id: "heal", left: "Healed the sick", right: "People saw Allah's signs" },
        { id: "mercy", left: "Taught mercy and kindness", right: "Example of compassion" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Miracles make someone divine", isCorrect: false },
        { id: "B", label: "Prophets have power independent of Allah", isCorrect: false },
        { id: "C", label: "All miracles are by Allah's permission; worship Him alone", isCorrect: true },
        { id: "D", label: "Mercy is weakness", isCorrect: false },
      ],
    },
  },

  muhammad: {
    part4: {
      events: [
        { id: "orphan", label: "Born an orphan, raised with care" },
        { id: "known", label: "Known as Al-Amin (the trustworthy)" },
        { id: "cave", label: "Receives first revelation in Cave Hira" },
        { id: "call", label: "Begins calling to Islam publicly" },
      ],
    },
    part8: {
      pairs: [
        { id: "character", left: "Trustworthy before prophethood", right: "Character prepared him for message" },
        { id: "revelation", left: "Received the Quran", right: "Became a living example of it" },
        { id: "oppose", left: "Faced severe opposition", right: "Remained patient and kind" },
        { id: "complete", left: "Completed the message", right: "Final guidance for humanity" },
      ],
    },
    part12: {
      options: [
        { id: "A", label: "Religion is separate from character", isCorrect: false },
        { id: "B", label: "Success means no opposition", isCorrect: false },
        { id: "C", label: "Follow the Prophet's example completely: character, worship, and kindness", isCorrect: true },
        { id: "D", label: "Each generation needs a new religion", isCorrect: false },
      ],
    },
  },
};

export function getCheckpointData(prophet: string): CheckpointConfig {
  const data = CHECKPOINT_DATA[prophet];
  if (!data) {
    // Return generic checkpoint for prophets without specific data
    return {
      part4: {
        events: [
          { id: "call", label: "The prophet calls to Allah" },
          { id: "resist", label: "People resist the message" },
          { id: "patient", label: "The prophet remains patient" },
          { id: "result", label: "Allah's will prevails" },
        ],
      },
      part8: {
        pairs: [
          { id: "call", left: "Prophet calls to truth", right: "Some people believe" },
          { id: "test", left: "Believers are tested", right: "Faith becomes stronger" },
          { id: "reject", left: "Disbelievers reject", right: "They face consequences" },
          { id: "truth", left: "Truth remains", right: "Falsehood perishes" },
        ],
      },
      part12: {
        options: [
          { id: "A", label: "Following desires is freedom", isCorrect: false },
          { id: "B", label: "Truth changes with time", isCorrect: false },
          { id: "C", label: "Following Allah's guidance brings success in this life and the next", isCorrect: true },
          { id: "D", label: "Worldly success is the only goal", isCorrect: false },
        ],
      },
    };
  }
  return data;
}
