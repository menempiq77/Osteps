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

export function getDifficultyContent(difficulty: Difficulty): MiniGameContent {
  return difficultyConfigs[difficulty];
}
