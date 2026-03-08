import React from "react";
import { MiniGameContent } from "./miniGameContent";
import SnakeGameClient from "./SnakeGameClient";
import MemoryCardsClient from "./MemoryCardsClient";
import CatchGameClient from "./CatchGameClient";
import WhackGameClient from "./WhackGameClient";
import WordSearchClient from "./WordSearchClient";
import QuickTapClient from "./QuickTapClient";
import TileSliderClient from "./TileSliderClient";
import PathMazeClient from "./PathMazeClient";

export type Difficulty = "easy" | "medium" | "hard";

export type GameId =
  | "snake"
  | "memory"
  | "catch"
  | "whack"
  | "wordsearch"
  | "quicktap"
  | "tileslider"
  | "pathmaze";

export type GameMeta = {
  id: GameId;
  label: string;
  icon: string;
};

type RenderFn = (args: {
  content: MiniGameContent;
  difficulty: Difficulty;
  onComplete: (won: boolean) => void;
  slug: string;
  checkpoint: number;
}) => React.ReactElement;

type GameEntry = {
  meta: GameMeta;
  render: RenderFn;
};

const gameRegistry: Record<GameId, GameEntry> = {
  snake: {
    meta: { id: "snake", label: "Snake", icon: "SN" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(SnakeGameClient, {
        collectibles: content.snake.collectibles,
        theme: content.snake.theme,
        difficulty,
        onComplete,
      }),
  },
  memory: {
    meta: { id: "memory", label: "Memory Cards", icon: "MC" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(MemoryCardsClient, {
        pairs: content.memory.pairs,
        theme: content.memory.theme,
        difficulty,
        onComplete,
      }),
  },
  catch: {
    meta: { id: "catch", label: "Catch", icon: "CT" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(CatchGameClient, {
        goodItems: content.catch.goodItems,
        badItems: content.catch.badItems,
        theme: content.catch.theme,
        difficulty,
        onComplete,
      }),
  },
  whack: {
    meta: { id: "whack", label: "Whack", icon: "WH" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(WhackGameClient, {
        temptations: content.whack.temptations,
        virtues: content.whack.virtues,
        theme: content.whack.theme,
        difficulty,
        onComplete,
      }),
  },
  wordsearch: {
    meta: { id: "wordsearch", label: "Word Search", icon: "WS" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(WordSearchClient, {
        words: content.wordsearch.words,
        letters: content.wordsearch.letters,
        theme: content.wordsearch.theme,
        difficulty,
        onComplete,
      }),
  },
  quicktap: {
    meta: { id: "quicktap", label: "Quick Tap", icon: "QT" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(QuickTapClient, {
        prompts: content.quicktap.prompts,
        difficulty,
        onComplete,
      }),
  },
  tileslider: {
    meta: { id: "tileslider", label: "Tile Slider", icon: "TS" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(TileSliderClient, {
        tiles: content.tileslider.tiles,
        difficulty,
        onComplete,
      }),
  },
  pathmaze: {
    meta: { id: "pathmaze", label: "Path Maze", icon: "PM" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(PathMazeClient, {
        grid: content.pathmaze.grid,
        difficulty,
        onComplete,
      }),
  },
};

const defaultRotation: GameId[] = [
  "snake",
  "memory",
  "catch",
  "whack",
  "wordsearch",
  "quicktap",
  "tileslider",
  "pathmaze",
];

const defaultCheckpointMap: Record<number, GameId> = {};

const perSlugOverrides: Record<string, Partial<Record<number, GameId>>> = {
  // Prophet Adam - Temptation and knowledge theme
  adam: {
    1: "whack",        // Whack temptations (Satan's whispers)
    2: "catch",        // Catch good deeds
    3: "memory",       // Remember Allah's names
    4: "wordsearch",   // Find key words from the story
    5: "snake",        // Collect virtues
    6: "quicktap",     // Quick responses to truth
    7: "pathmaze",     // Find the straight path
    8: "tileslider",   // Arrange priorities
    9: "catch",        // Practice catching good
    10: "memory",      // Strengthen memory
  },
  
  // Prophet Idris - Discipline and accountability
  idris: {
    1: "tileslider",   // Arrange virtues in order
    2: "quicktap",     // Fast accountability check
    3: "memory",       // Remember teachings
    4: "wordsearch",   // Search for wisdom
    5: "catch",        // Catch blessings to share
    6: "whack",        // Whack excess behaviors
    7: "snake",        // Collect good habits
    8: "pathmaze",     // Navigate life's journey
  },
  
  // Prophet Nuh - Patience and endurance
  nuh: {
    1: "snake",        // Long journey like Nuh's mission
    2: "catch",        // Catch believers (few)
    3: "memory",       // Remember the warnings
    4: "pathmaze",     // Navigate through opposition
    5: "wordsearch",   // Find truth in confusion
    6: "quicktap",     // Quick faith responses
    7: "whack",        // Whack idolatry
    8: "tileslider",   // Patience puzzle
  },
  
  // Prophet Hud - Standing firm
  hud: {
    1: "catch",        // Catch truth, avoid lies
    2: "whack",        // Whack arrogance
    3: "memory",       // Remember Allah's power
    4: "wordsearch",   // Search for guidance
    5: "snake",        // Journey of faith
    6: "pathmaze",     // Navigate challenges
    7: "quicktap",     // Quick conviction
  },
  
  // Prophet Salih - Miracle and test
  salih: {
    1: "memory",       // Remember the miracle
    2: "catch",        // Catch blessings
    3: "whack",        // Whack disobedience
    4: "wordsearch",   // Find signs of Allah
    5: "snake",        // Test journey
    6: "tileslider",   // Arrange responses
    7: "pathmaze",     // Path of obedience
  },
  
  // Prophet Ibrahim - Faith and sacrifice
  ibrahim: {
    1: "whack",        // Whack idols
    2: "catch",        // Catch monotheism
    3: "memory",       // Remember arguments
    4: "snake",        // Journey of faith
    5: "wordsearch",   // Search for truth
    6: "pathmaze",     // Navigate trials
    7: "quicktap",     // Quick submission
    8: "tileslider",   // Arrange priorities
    9: "memory",       // Remember sacrifice
    10: "catch",       // Catch blessings
  },
  
  // Prophet Lut - Courage and warning
  lut: {
    1: "catch",        // Catch righteousness
    2: "whack",        // Whack corruption
    3: "memory",       // Remember warnings
    4: "wordsearch",   // Find truth
    5: "snake",        // Journey away from evil
    6: "pathmaze",     // Navigate escape
    7: "quicktap",     // Quick obedience
  },
  
  // Prophet Ismail - Trust and submission
  ismail: {
    1: "memory",       // Remember trust
    2: "catch",        // Catch obedience
    3: "snake",        // Journey of submission
    4: "wordsearch",   // Find devotion
    5: "whack",        // Whack doubt
    6: "tileslider",   // Arrange faith
  },
  
  // Prophet Ishaq - Blessed legacy
  ishaq: {
    1: "catch",        // Catch blessings
    2: "memory",       // Remember lineage
    3: "wordsearch",   // Find guidance
    4: "snake",        // Journey of faith
    5: "quicktap",     // Quick gratitude
  },
  
  // Prophet Yaqub - Hope and family
  yaqub: {
    1: "memory",       // Remember family bonds
    2: "catch",        // Catch hope
    3: "snake",        // Long journey of patience
    4: "wordsearch",   // Search for Yusuf
    5: "whack",        // Whack despair
    6: "pathmaze",     // Navigate hardship
    7: "tileslider",   // Arrange priorities
    8: "quicktap",     // Quick trust in Allah
  },
  
  // Prophet Yusuf - Patience and forgiveness
  yusuf: {
    1: "catch",        // Catch dreams
    2: "whack",        // Whack jealousy
    3: "memory",       // Remember tests
    4: "snake",        // Journey through trials
    5: "pathmaze",     // Navigate prison
    6: "wordsearch",   // Find interpretation
    7: "tileslider",   // Arrange forgiveness
    8: "quicktap",     // Quick gratitude
    9: "memory",       // Remember family
    10: "catch",       // Catch reunion
  },
  
  // Prophet Ayyub - Ultimate patience
  ayyub: {
    1: "snake",        // Long endurance
    2: "catch",        // Catch blessings after trial
    3: "memory",       // Remember perseverance
    4: "whack",        // Whack complaints
    5: "wordsearch",   // Find strength
    6: "pathmaze",     // Navigate suffering
    7: "tileslider",   // Arrange resilience
  },
  
  // Prophet Shuayb - Justice in trade
  shuayb: {
    1: "catch",        // Catch honesty
    2: "whack",        // Whack cheating
    3: "memory",       // Remember fairness
    4: "wordsearch",   // Find justice
    5: "snake",        // Journey of integrity
    6: "quicktap",     // Quick honesty
    7: "tileslider",   // Arrange trade ethics
  },
  
  // Prophet Musa - Leadership and courage
  musa: {
    1: "catch",        // Catch courage
    2: "whack",        // Whack Pharaoh's tyranny
    3: "memory",       // Remember miracles
    4: "snake",        // Staff miracle / journey
    5: "wordsearch",   // Find commandments
    6: "pathmaze",     // Navigate exodus
    7: "quicktap",     // Quick obedience
    8: "tileslider",   // Arrange tablets
    9: "memory",       // Remember Sinai
    10: "catch",       // Catch guidance
  },
  
  // Prophet Harun - Support and unity
  harun: {
    1: "memory",       // Remember teamwork
    2: "catch",        // Catch support
    3: "wordsearch",   // Find cooperation
    4: "snake",        // Journey together
    5: "quicktap",     // Quick assistance
    6: "whack",        // Whack golden calf
  },
  
  // Prophet Dhul-Kifl - Keeping promises
  "dhul-kifl": {
    1: "catch",        // Catch commitments
    2: "memory",       // Remember promises
    3: "wordsearch",   // Find integrity
    4: "snake",        // Journey of trust
    5: "tileslider",   // Arrange priorities
  },
  
  // Prophet Dawud - Justice and worship
  dawud: {
    1: "memory",       // Remember psalms
    2: "catch",        // Catch justice
    3: "whack",        // Whack corruption
    4: "wordsearch",   // Find righteousness
    5: "snake",        // Journey of kingship
    6: "pathmaze",     // Navigate judgment
    7: "quicktap",     // Quick worship
    8: "tileslider",   // Arrange justice
  },
  
  // Prophet Sulayman - Wisdom and gratitude
  sulayman: {
    1: "memory",       // Remember wisdom
    2: "catch",        // Catch gratitude
    3: "wordsearch",   // Find knowledge
    4: "snake",        // Journey of kingdom
    5: "whack",        // Whack arrogance
    6: "pathmaze",     // Navigate power
    7: "tileslider",   // Arrange resources
    8: "quicktap",     // Quick thanks
  },
  
  // Prophet Ilyas - Firm belief
  ilyas: {
    1: "catch",        // Catch conviction
    2: "whack",        // Whack Baal worship
    3: "memory",       // Remember firmness
    4: "wordsearch",   // Find truth
    5: "snake",        // Journey of faith
    6: "pathmaze",     // Navigate opposition
  },
  
  // Prophet Al-Yasa - Steadfastness
  "al-yasa": {
    1: "snake",        // Steady journey
    2: "catch",        // Catch perseverance
    3: "memory",       // Remember mission
    4: "wordsearch",   // Find guidance
    5: "quicktap",     // Quick devotion
  },
  
  // Prophet Yunus - Repentance and return
  yunus: {
    1: "catch",        // Catch the lesson
    2: "whack",        // Whack impatience
    3: "memory",       // Remember the dua
    4: "snake",        // Journey in whale
    5: "wordsearch",   // Find repentance
    6: "pathmaze",     // Navigate return
    7: "tileslider",   // Arrange priorities
  },
  
  // Prophet Zakariyya - Beautiful dua
  zakariyya: {
    1: "memory",       // Remember the dua
    2: "catch",        // Catch hope
    3: "wordsearch",   // Find prayer
    4: "snake",        // Journey of waiting
    5: "quicktap",     // Quick supplication
    6: "whack",        // Whack despair
  },
  
  // Prophet Yahya - Purity and courage
  yahya: {
    1: "catch",        // Catch purity
    2: "memory",       // Remember righteousness
    3: "whack",        // Whack corruption
    4: "wordsearch",   // Find truth
    5: "snake",        // Journey of bravery
  },
  
  // Prophet Isa - Mercy and miracles
  isa: {
    1: "memory",       // Remember miracles
    2: "catch",        // Catch mercy
    3: "wordsearch",   // Find Gospel
    4: "snake",        // Journey of calling
    5: "whack",        // Whack falsehood
    6: "pathmaze",     // Navigate trials
    7: "quicktap",     // Quick compassion
    8: "tileslider",   // Arrange teachings
  },
  
  // Prophet Muhammad - Final message
  muhammad: {
    1: "memory",       // Remember revelation
    2: "catch",        // Catch guidance
    3: "whack",        // Whack ignorance
    4: "wordsearch",   // Find Quran
    5: "snake",        // Journey of dawah
    6: "pathmaze",     // Navigate Hijra
    7: "tileslider",   // Arrange Sunnah
    8: "quicktap",     // Quick obedience
    9: "memory",       // Remember hadith
    10: "catch",       // Catch final message
  },
};

function pickFromRotation(slug: string, checkpoint: number): GameId {
  const baseIndex = checkpoint === 4 ? 0 : checkpoint === 8 ? 1 : checkpoint === 12 ? 2 : 0;
  let hash = 0;
  for (const ch of slug) hash = (hash + ch.charCodeAt(0)) % defaultRotation.length;
  return defaultRotation[(baseIndex + hash) % defaultRotation.length];
}

export function resolveMiniGame(slug: string, checkpoint: number) {
  const override = perSlugOverrides[slug]?.[checkpoint];
  const gameId = override ?? defaultCheckpointMap[checkpoint] ?? pickFromRotation(slug, checkpoint);
  const entry = gameRegistry[gameId];
  return { entry, gameId, meta: entry.meta };
}

export { gameRegistry };

