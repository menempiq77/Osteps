// Default mini-game content for all prophet stories
// Generic Islamic-themed items that work for any prophet

import { Difficulty } from "./miniGameConfig";

export type MiniGameContent = {
  snake: {
    collectibles: Array<{ emoji: string; label: string }>;
    theme: string;
  };
  memory: {
    pairs: Array<{ id: string; content: string; emoji?: string }>;
    theme: string;
  };
  catch: {
    goodItems: Array<{ emoji: string; label: string }>;
    badItems: Array<{ emoji: string; label: string }>;
    theme: string;
  };
  whack: {
    temptations: Array<{ emoji: string; label: string }>;
    virtues: Array<{ emoji: string; label: string }>;
    theme: string;
  };
  wordsearch: {
    words: string[];
    letters: string[];
    theme: string;
  };
  quicktap: {
    prompts: string[];
    theme: string;
  };
  tileslider: {
    tiles: number[];
    theme: string;
  };
  pathmaze: {
    grid: string[];
    theme: string;
  };
};

export const defaultMiniGameContent: MiniGameContent = {
  snake: {
    theme: "Collect the beautiful names of Allah",
    collectibles: [
      { emoji: "🌟", label: "Ar-Rahman (The Most Merciful)" },
      { emoji: "✨", label: "Ar-Raheem (The Most Compassionate)" },
      { emoji: "💫", label: "Al-Malik (The King)" },
      { emoji: "🌙", label: "Al-Quddus (The Most Holy)" },
      { emoji: "⭐", label: "As-Salam (The Source of Peace)" },
      { emoji: "🌠", label: "Al-Hakeem (The All-Wise)" },
      { emoji: "💎", label: "Al-Aleem (The All-Knowing)" },
      { emoji: "🔆", label: "Al-Qadir (The All-Powerful)" },
      { emoji: "🌺", label: "Al-Kareem (The Most Generous)" },
      { emoji: "🌸", label: "Al-Ghafoor (The Most Forgiving)" },
    ],
  },
  memory: {
    theme: "Match the pairs of Islamic concepts",
    pairs: [
      { id: "1", content: "Shahada", emoji: "☝️" },
      { id: "2", content: "Salah", emoji: "🕌" },
      { id: "3", content: "Zakat", emoji: "💰" },
      { id: "4", content: "Sawm", emoji: "🌙" },
      { id: "5", content: "Hajj", emoji: "🕋" },
      { id: "6", content: "Quran", emoji: "📖" },
      { id: "7", content: "Tawakkul", emoji: "🤲" },
      { id: "8", content: "Sabr", emoji: "⏳" },
    ],
  },
  catch: {
    theme: "Catch the good deeds, avoid the bad ones!",
    goodItems: [
      { emoji: "🤲", label: "Dua" },
      { emoji: "📖", label: "Reading Quran" },
      { emoji: "😊", label: "Kindness" },
      { emoji: "🤝", label: "Helping Others" },
      { emoji: "💚", label: "Honesty" },
      { emoji: "🌟", label: "Patience" },
      { emoji: "✨", label: "Gratitude" },
      { emoji: "💖", label: "Charity" },
      { emoji: "🕊️", label: "Forgiveness" },
      { emoji: "🌙", label: "Prayer" },
    ],
    badItems: [
      { emoji: "😡", label: "Anger" },
      { emoji: "🤥", label: "Lying" },
      { emoji: "😤", label: "Arrogance" },
      { emoji: "💢", label: "Rudeness" },
      { emoji: "😠", label: "Jealousy" },
    ],
  },
  whack: {
    theme: "Whack temptations, protect virtues!",
    temptations: [
      { emoji: "😈", label: "Whisper of pride" },
      { emoji: "🕳️", label: "Shortcut cheat" },
      { emoji: "💤", label: "Laziness" },
      { emoji: "😡", label: "Anger" },
      { emoji: "🤥", label: "Lying" },
      { emoji: "💸", label: "Greed" },
    ],
    virtues: [
      { emoji: "🤲", label: "Dua" },
      { emoji: "🕌", label: "Prayer" },
      { emoji: "😊", label: "Kindness" },
      { emoji: "📖", label: "Quran" },
      { emoji: "🛡️", label: "Patience" },
      { emoji: "❤️", label: "Honesty" },
    ],
  },
  wordsearch: {
    theme: "Find the key Islamic words",
    words: ["SABR", "ZAKAT", "SALAH", "RAHMA", "SIDQ", "DUA"],
    letters: [
      "S", "A", "B", "R", "X", "D",
      "Z", "A", "K", "A", "T", "U",
      "S", "A", "L", "A", "H", "A",
      "R", "A", "H", "M", "A", "Q",
      "S", "I", "D", "Q", "P", "W",
      "K", "M", "N", "O", "L", "X",
    ],
  },
  quicktap: {
    theme: "Type virtues fast!",
    prompts: ["Patience", "Honesty", "Kindness", "Charity", "Gratitude", "Respect", "Sabr", "Taqwa"],
  },
  tileslider: {
    theme: "Slide to arrange the virtues",
    tiles: [1, 2, 3, 4, 5, 6, 0, 7, 8],
  },
  pathmaze: {
    theme: "Find the straight path",
    grid: [
      "S", " ", "#", " ", " ", " ",
      "#", " ", "#", " ", "#", " ",
      " ", " ", " ", " ", "#", " ",
      " ", "#", "#", " ", " ", " ",
      " ", " ", "#", "#", " ", "#",
      " ", " ", " ", " ", " ", "E",
    ],
  },
};

// Difficulty-based configuration for each game type
export type DifficultyConfig = {
  easy: MiniGameContent;
  medium: MiniGameContent;
  hard: MiniGameContent;
};

export const difficultyConfigs: DifficultyConfig = {
  easy: {
    snake: {
      theme: "Collect the beautiful names of Allah (Easy)",
      collectibles: defaultMiniGameContent.snake.collectibles.slice(0, 10),
    },
    memory: {
      theme: "Match the pairs of Islamic concepts (Easy)",
      pairs: defaultMiniGameContent.memory.pairs.slice(0, 8),
    },
    catch: {
      theme: "Catch the good deeds, avoid the bad ones! (Easy)",
      goodItems: defaultMiniGameContent.catch.goodItems.slice(0, 10),
      badItems: defaultMiniGameContent.catch.badItems.slice(0, 5),
    },
    whack: {
      theme: "Whack temptations, protect virtues! (Easy)",
      temptations: defaultMiniGameContent.whack.temptations.slice(0, 6),
      virtues: defaultMiniGameContent.whack.virtues.slice(0, 6),
    },
    wordsearch: {
      theme: "Find the key Islamic words (Easy)",
      words: ["SABR", "SALAH", "DUA"],
      letters: [
        "S", "A", "B", "R", "X", "D",
        "Z", "A", "K", "L", "T", "U",
        "S", "A", "L", "A", "H", "A",
        "R", "M", "N", "O", "P", "Q",
        "W", "X", "Y", "Z", "K", "R",
        "T", "Q", "R", "S", "M", "N",
      ],
    },
    quicktap: {
      theme: "Type virtues fast! (Easy)",
      prompts: ["Patience", "Honesty", "Kindness"],
    },
    tileslider: {
      theme: "Slide to arrange the virtues (Easy)",
      tiles: [1, 2, 3, 4, 5, 6, 0, 7, 8],
    },
    pathmaze: {
      theme: "Find the straight path (Easy - 6x6)",
      grid: [
        "S", " ", "#", " ", " ", " ",
        "#", " ", "#", " ", "#", " ",
        " ", " ", " ", " ", "#", " ",
        " ", "#", "#", " ", " ", " ",
        " ", " ", "#", "#", " ", "#",
        " ", " ", " ", " ", " ", "E",
      ],
    },
  },
  medium: {
    snake: {
      theme: "Collect the beautiful names of Allah (Medium)",
      collectibles: defaultMiniGameContent.snake.collectibles,
    },
    memory: {
      theme: "Match the pairs of Islamic concepts (Medium)",
      pairs: defaultMiniGameContent.memory.pairs,
    },
    catch: {
      theme: "Catch the good deeds, avoid the bad ones! (Medium)",
      goodItems: defaultMiniGameContent.catch.goodItems,
      badItems: defaultMiniGameContent.catch.badItems,
    },
    whack: {
      theme: "Whack temptations, protect virtues! (Medium)",
      temptations: defaultMiniGameContent.whack.temptations,
      virtues: defaultMiniGameContent.whack.virtues,
    },
    wordsearch: {
      theme: "Find the key Islamic words (Medium)",
      words: ["SABR", "ZAKAT", "SALAH", "RAHMA", "SIDQ", "DUA"],
      letters: [
        "S", "A", "B", "R", "X", "D",
        "Z", "A", "K", "A", "T", "U",
        "S", "A", "L", "A", "H", "A",
        "R", "A", "H", "M", "A", "Q",
        "S", "I", "D", "Q", "P", "W",
        "K", "M", "N", "O", "L", "X",
      ],
    },
    quicktap: {
      theme: "Type virtues fast! (Medium)",
      prompts: ["Patience", "Honesty", "Kindness", "Charity", "Gratitude", "Respect", "Sabr", "Taqwa", "Mercy", "Justice"],
    },
    tileslider: {
      theme: "Slide to arrange the virtues (Medium)",
      tiles: [1, 2, 3, 4, 5, 6, 0, 7, 8],
    },
    pathmaze: {
      theme: "Find the straight path (Medium - 8x8)",
      grid: [
        "S", " ", "#", " ", " ", " ", "#", " ",
        "#", " ", "#", " ", "#", " ", " ", " ",
        " ", " ", " ", " ", "#", " ", "#", " ",
        " ", "#", "#", " ", " ", " ", " ", " ",
        " ", " ", "#", "#", " ", "#", " ", " ",
        " ", " ", " ", " ", " ", "E", " ", "#",
        "#", " ", "#", " ", "#", " ", " ", " ",
        " ", " ", " ", " ", " ", " ", "#", " ",
      ],
    },
  },
  hard: {
    snake: {
      theme: "Collect the beautiful names of Allah (Hard)",
      collectibles: [
        ...defaultMiniGameContent.snake.collectibles,
        { emoji: "🌟", label: "Al-Latif (The Most Subtle)" },
        { emoji: "✨", label: "Al-Qawi (The Most Strong)" },
      ],
    },
    memory: {
      theme: "Match the pairs of Islamic concepts (Hard)",
      pairs: [
        ...defaultMiniGameContent.memory.pairs,
        { id: "9", content: "Taqwa", emoji: "🛡️" },
        { id: "10", content: "Ummah", emoji: "👥" },
        { id: "11", content: "Ikhlas", emoji: "💚" },
        { id: "12", content: "Adl", emoji: "⚖️" },
      ],
    },
    catch: {
      theme: "Catch the good deeds, avoid the bad ones! (Hard)",
      goodItems: [
        ...defaultMiniGameContent.catch.goodItems,
        { emoji: "🕋", label: "Hajj" },
        { emoji: "💰", label: "Zakat" },
      ],
      badItems: [
        ...defaultMiniGameContent.catch.badItems,
        { emoji: "🧣", label: "Envy" },
      ],
    },
    whack: {
      theme: "Whack temptations, protect virtues! (Hard)",
      temptations: [
        ...defaultMiniGameContent.whack.temptations,
        { emoji: "🌀", label: "Greed" },
        { emoji: "🎭", label: "Hypocrisy" },
      ],
      virtues: [
        ...defaultMiniGameContent.whack.virtues,
        { emoji: "⚖️", label: "Justice" },
        { emoji: "🌟", label: "Wisdom" },
      ],
    },
    wordsearch: {
      theme: "Find the key Islamic words (Hard)",
      words: ["SABR", "ZAKAT", "SALAH", "RAHMA", "SIDQ", "DUA", "IMAN", "TAQWA"],
      letters: [
        "S", "A", "B", "R", "X", "D", "Z", "P",
        "Z", "A", "K", "A", "T", "U", "W", "L",
        "S", "A", "L", "A", "H", "A", "Q", "M",
        "R", "A", "H", "M", "A", "X", "Y", "N",
        "S", "I", "D", "Q", "P", "Y", "R", "A",
        "I", "M", "A", "N", "O", "L", "W", "T",
        "K", "X", "Y", "Z", "T", "A", "Q", "W",
        "Q", "W", "E", "R", "T", "Y", "U", "A",
      ],
    },
    quicktap: {
      theme: "Type virtues fast! (Hard)",
      prompts: ["Patience", "Honesty", "Kindness", "Charity", "Gratitude", "Respect", "Sabr", "Taqwa", "Mercy", "Justice", "Wisdom", "Hope", "Trust", "Peace", "Humility"],
    },
    tileslider: {
      theme: "Slide to arrange the virtues (Hard - 4x4)",
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
    },
    pathmaze: {
      theme: "Find the straight path (Hard - 10x10)",
      grid: [
        "S", " ", "#", " ", " ", " ", "#", " ", " ", " ",
        "#", " ", "#", " ", "#", " ", " ", " ", "#", " ",
        " ", " ", " ", " ", "#", " ", "#", " ", " ", " ",
        " ", "#", "#", " ", " ", " ", " ", " ", "#", " ",
        " ", " ", "#", "#", " ", "#", " ", " ", " ", " ",
        "#", " ", " ", " ", " ", "E", " ", "#", " ", " ",
        " ", " ", "#", " ", "#", " ", " ", " ", " ", "#",
        " ", "#", " ", " ", " ", " ", "#", " ", "#", " ",
        " ", " ", " ", "#", " ", " ", " ", " ", " ", " ",
        "#", " ", " ", " ", "#", " ", "#", " ", " ", " ",
      ],
    },
  },
};

// Prophet-specific content overrides for themed games
const prophetContentOverrides: Partial<Record<string, Partial<MiniGameContent>>> = {
  adam: {
    snake: {
      theme: "Collect the Knowledge Allah Taught Adam",
      collectibles: [
        { emoji: "📚", label: "Names of All Things" },
        { emoji: "🧠", label: "Divine Knowledge" },
        { emoji: "🌟", label: "Wisdom" },
        { emoji: "✨", label: "Understanding" },
        { emoji: "💫", label: "Recognition" },
        { emoji: "🎯", label: "Truth" },
        { emoji: "🔆", label: "Insight" },
        { emoji: "💎", label: "Clear Speech" },
      ],
    },
    whack: {
      theme: "Whack Satan's Whispers, Protect Faith",
      temptations: [
        { emoji: "😈", label: "Satan's Promise" },
        { emoji: "🍃", label: "Forbidden Tree" },
        { emoji: "🌀", label: "Immortality Lie" },
        { emoji: "💤", label: "Heedlessness" },
        { emoji: "🎭", label: "False Trust" },
      ],
      virtues: [
        { emoji: "🤲", label: "Repentance" },
        { emoji: "💚", label: "Obedience" },
        { emoji: "🛡️", label: "Vigilance" },
        { emoji: "📖", label: "Remembrance" },
        { emoji: "✨", label: "Gratitude" },
      ],
    },
    wordsearch: {
      theme: "Find Key Words from Adam's Story",
      words: ["ADAM", "IBLIS", "PARADISE", "KNOWLEDGE", "REPENT"],
      letters: [
        "A", "D", "A", "M", "X", "R",
        "I", "B", "L", "I", "S", "E",
        "P", "A", "R", "A", "D", "I", "S", "E",
        "K", "N", "O", "W", "L", "E", "D", "G", "E",
        "R", "E", "P", "E", "N", "T",
      ],
    },
  },
  
  nuh: {
    snake: {
      theme: "Navigate Nuh's 950-Year Journey",
      collectibles: [
        { emoji: "🛶", label: "Build the Ark" },
        { emoji: "⏳", label: "Patience" },
        { emoji: "☔", label: "Warning Signs" },
        { emoji: "🕊️", label: "Hope" },
        { emoji: "🌊", label: "Faith in Flood" },
        { emoji: "⛰️", label: "Safety" },
        { emoji: "🌈", label: "Promise" },
        { emoji: "🙏", label: "Perseverance" },
      ],
    },
    catch: {
      theme: "Save the Few Believers",
      goodItems: [
        { emoji: "🙏", label: "True Believer" },
        { emoji: "👨‍👩‍👦", label: "Faithful Family" },
        { emoji: "💎", label: "Pure Heart" },
        { emoji: "🛶", label: "Board the Ark" },
      ],
      badItems: [
        { emoji: "🗿", label: "Idol Worship" },
        { emoji: "😤", label: "Mockery" },
        { emoji: "🚫", label: "Rejection" },
        { emoji: "💢", label: "Arrogance" },
      ],
    },
  },
  
  ibrahim: {
    whack: {
      theme: "Smash the Idols Like Ibrahim",
      temptations: [
        { emoji: "🗿", label: "Stone Idol" },
        { emoji: "🌙", label: "Moon Worship" },
        { emoji: "☀️", label: "Sun Worship" },
        { emoji: "⭐", label: "Star Worship" },
        { emoji: "👑", label: "King's Command" },
      ],
      virtues: [
        { emoji: "☝️", label: "Tawhid" },
        { emoji: "🔥", label: "Courage" },
        { emoji: "🤲", label: "Trust Allah" },
        { emoji: "💪", label: "Stand Firm" },
        { emoji: "🛡️", label: "Protection" },
      ],
    },
    catch: {
      theme: "Catch the Signs of Tawhid",
      goodItems: [
        { emoji: "☝️", label: "One Allah" },
        { emoji: "🕋", label: "Build Kaaba" },
        { emoji: "🐏", label: "Sacrifice Test" },
        { emoji: "💚", label: "Submission" },
      ],
      badItems: [
        { emoji: "🗿", label: "Idolatry" },
        { emoji: "🔥", label: "Fire of Nimrod" },
        { emoji: "😠", label: "Opposition" },
      ],
    },
  },
  
  yusuf: {
    memory: {
      theme: "Remember Yusuf's Journey",
      pairs: [
        { id: "1", content: "Dream", emoji: "🌙" },
        { id: "2", content: "Well", emoji: "🕳️" },
        { id: "3", content: "Egypt", emoji: "🏛️" },
        { id: "4", content: "Prison", emoji: "🔒" },
        { id: "5", content: "Interpretation", emoji: "💭" },
        { id: "6", content: "Minister", emoji: "👑" },
        { id: "7", content: "Forgiveness", emoji: "💚" },
        { id: "8", content: "Reunion", emoji: "👨‍👩‍👦" },
      ],
    },
    catch: {
      theme: "Catch Virtues, Avoid Temptations",
      goodItems: [
        { emoji: "💎", label: "Patience" },
        { emoji: "🛡️", label: "Chastity" },
        { emoji: "💚", label: "Forgiveness" },
        { emoji: "🤲", label: "Trust Allah" },
        { emoji: "🌟", label: "Gratitude" },
      ],
      badItems: [
        { emoji: "😡", label: "Jealousy" },
        { emoji: "🎭", label: "Temptation" },
        { emoji: "💢", label: "Envy" },
      ],
    },
  },
  
  musa: {
    snake: {
      theme: "Follow Musa's Staff Miracle",
      collectibles: [
        { emoji: "🪄", label: "Staff of Musa" },
        { emoji: "🐍", label: "Serpent Miracle" },
        { emoji: "💪", label: "Courage" },
        { emoji: "🌊", label: "Sea Parts" },
        { emoji: "⚡", label: "Divine Power" },
        { emoji: "📜", label: "Ten Commandments" },
        { emoji: "✨", label: "Truth Prevails" },
        { emoji: "🏔️", label: "Mount Sinai" },
      ],
    },
    whack: {
      theme: "Defeat Pharaoh's Tyranny",
      temptations: [
        { emoji: "👑", label: "Pharaoh's Pride" },
        { emoji: "⛓️", label: "Slavery" },
        { emoji: "🎭", label: "Magic" },
        { emoji: "💰", label: "Worldly Power" },
      ],
      virtues: [
        { emoji: "🗣️", label: "Speak Truth" },
        { emoji: "💪", label: "Stand Up" },
        { emoji: "🤲", label: "Call to Allah" },
        { emoji: "⚡", label: "Divine Help" },
      ],
    },
  },
  
  yunus: {
    snake: {
      theme: "Journey Through the Whale",
      collectibles: [
        { emoji: "🐋", label: "Whale's Belly" },
        { emoji: "🌊", label: "Deep Sea" },
        { emoji: "🤲", label: "The Dua" },
        { emoji: "💚", label: "Repentance" },
        { emoji: "🌅", label: "Rescue" },
        { emoji: "🙏", label: "Patience" },
        { emoji: "✨", label: "Return" },
      ],
    },
    wordsearch: {
      theme: "Find Yunus's Famous Dua",
      words: ["YUNUS", "WHALE", "DUA", "RETURN", "PATIENCE"],
      letters: [
        "Y", "U", "N", "U", "S", "X",
        "W", "H", "A", "L", "E", "D",
        "D", "U", "A", "R", "T", "U",
        "R", "E", "T", "U", "R", "N",
        "P", "A", "T", "I", "E", "N", "C", "E",
      ],
    },
  },
  
  muhammad: {
    memory: {
      theme: "Remember the Final Revelation",
      pairs: [
        { id: "1", content: "Hira Cave", emoji: "🏔️" },
        { id: "2", content: "Angel Jibreel", emoji: "👼" },
        { id: "3", content: "Quran", emoji: "📖" },
        { id: "4", content: "Hijra", emoji: "🏃" },
        { id: "5", content: "Madinah", emoji: "🕌" },
        { id: "6", content: "Victory", emoji: "🎯" },
        { id: "7", content: "Sunnah", emoji: "🌟" },
        { id: "8", content: "Ummah", emoji: "👥" },
      ],
    },
    catch: {
      theme: "Catch the Teachings of Islam",
      goodItems: [
        { emoji: "📖", label: "Quran" },
        { emoji: "🕌", label: "Prayer" },
        { emoji: "💰", label: "Zakat" },
        { emoji: "🤝", label: "Brotherhood" },
        { emoji: "💚", label: "Mercy" },
        { emoji: "⚖️", label: "Justice" },
      ],
      badItems: [
        { emoji: "🗿", label: "Jahiliyyah" },
        { emoji: "💢", label: "Oppression" },
        { emoji: "🎭", label: "Hypocrisy" },
      ],
    },
  },
};

export function getDifficultyContent(difficulty: Difficulty, slug?: string): MiniGameContent {
  const baseContent = difficultyConfigs[difficulty];
  
  // If no slug provided or no overrides for this prophet, return base content
  if (!slug || !prophetContentOverrides[slug]) {
    return baseContent;
  }
  
  // Merge prophet-specific content with base content
  const prophetOverride = prophetContentOverrides[slug];
  return {
    snake: prophetOverride.snake ?? baseContent.snake,
    memory: prophetOverride.memory ?? baseContent.memory,
    catch: prophetOverride.catch ?? baseContent.catch,
    whack: prophetOverride.whack ?? baseContent.whack,
    wordsearch: prophetOverride.wordsearch ?? baseContent.wordsearch,
    quicktap: prophetOverride.quicktap ?? baseContent.quicktap,
    tileslider: prophetOverride.tileslider ?? baseContent.tileslider,
    pathmaze: prophetOverride.pathmaze ?? baseContent.pathmaze,
  };
}
