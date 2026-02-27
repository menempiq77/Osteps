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
    meta: { id: "snake", label: "Snake", icon: "🐍" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(SnakeGameClient, {
        collectibles: content.snake.collectibles,
        theme: content.snake.theme,
        difficulty,
        onComplete,
      }),
  },
  memory: {
    meta: { id: "memory", label: "Memory Cards", icon: "🃏" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(MemoryCardsClient, {
        pairs: content.memory.pairs,
        theme: content.memory.theme,
        difficulty,
        onComplete,
      }),
  },
  catch: {
    meta: { id: "catch", label: "Catch", icon: "🧺" },
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
    meta: { id: "whack", label: "Whack", icon: "🔨" },
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
    meta: { id: "wordsearch", label: "Word Search", icon: "🔍" },
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
    meta: { id: "quicktap", label: "Quick Tap", icon: "⚡" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(QuickTapClient, {
        prompts: content.quicktap.prompts,
        difficulty,
        onComplete,
      }),
  },
  tileslider: {
    meta: { id: "tileslider", label: "Tile Slider", icon: "🧩" },
    render: ({ content, difficulty, onComplete }) =>
      React.createElement(TileSliderClient, {
        tiles: content.tileslider.tiles,
        difficulty,
        onComplete,
      }),
  },
  pathmaze: {
    meta: { id: "pathmaze", label: "Path Maze", icon: "🧭" },
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
  adam: {
    4: "whack",
    8: "wordsearch",
    12: "catch",
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
