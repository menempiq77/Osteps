"use client";

import { useEffect, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type MemoryCard = { id: string; content: string; emoji?: string };

type MemoryCardsGameProps = {
  pairs: MemoryCard[];
  theme: string;
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

type CardType = {
  id: string;
  content: string;
  emoji?: string;
  uniqueId: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const GAME_DURATION_EASY = 150;
const GAME_DURATION_MEDIUM = 120;
const GAME_DURATION_HARD = 120;

export default function MemoryCardsClient({
  pairs,
  theme,
  difficulty = "easy",
  onComplete,
}: MemoryCardsGameProps) {
  const GAME_DURATION = difficulty === "easy" ? GAME_DURATION_EASY : difficulty === "medium" ? GAME_DURATION_MEDIUM : GAME_DURATION_HARD;
  
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);

  // Initialize and shuffle cards
  const [cards, setCards] = useState<CardType[]>(() => {
    const duplicatedPairs = [...pairs, ...pairs].map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
      isFlipped: false,
      isMatched: false,
    }));
    return duplicatedPairs.sort(() => Math.random() - 0.5);
  });

  // Timer countdown
  useEffect(() => {
    if (gameWon || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameWon, gameOver]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find((c) => c.uniqueId === first);
      const secondCard = cards.find((c) => c.uniqueId === second);

      if (firstCard && secondCard && firstCard.id === secondCard.id) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.uniqueId === first || card.uniqueId === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((p) => p + 1);
          setFlippedCards([]);

          if (matchedPairs + 1 === pairs.length) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.uniqueId === first || card.uniqueId === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matchedPairs, pairs.length]);

  const handleCardClick = (uniqueId: string) => {
    if (gameWon || gameOver) return;
    
    const card = cards.find((c) => c.uniqueId === uniqueId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    setCards((prev) =>
      prev.map((c) =>
        c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c
      )
    );

    const newFlipped = [...flippedCards, uniqueId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
    }
  };

  const handlePlayAgain = () => {
    const duplicatedPairs = [...pairs, ...pairs].map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
      isFlipped: false,
      isMatched: false,
    }));
    const shuffled = duplicatedPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">
          Memory Cards! 🃏
        </h2>
        <p className="text-gray-600">{theme}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="font-bold text-purple-700">Matches:</span> {matchedPairs}/
            {pairs.length}
          </div>
          <div className="text-sm">
            <span className="font-bold text-purple-700">Moves:</span> {moves}
          </div>
          <div className="text-sm">
            <span className="font-bold text-amber-600">Time:</span> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {cards.map((card) => (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(card.uniqueId)}
              className={`aspect-square rounded-lg text-3xl font-bold transition-all duration-300 transform ${
                card.isMatched
                  ? "bg-green-100 border-2 border-green-400 scale-95 opacity-50"
                  : card.isFlipped
                  ? "bg-purple-100 border-2 border-purple-400 scale-105"
                  : "bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 border-2 border-purple-700 shadow-lg hover:scale-105"
              }`}
              disabled={card.isFlipped || card.isMatched || gameWon || gameOver}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="flex flex-col items-center justify-center h-full">
                  {card.emoji && (
                    <div className="text-2xl mb-1">{card.emoji}</div>
                  )}
                  <div className="text-xs text-gray-700 px-1 leading-tight">
                    {card.content}
                  </div>
                </div>
              ) : (
                <div className="text-white text-4xl">?</div>
              )}
            </button>
          ))}
        </div>

        <div className="text-xs text-center text-gray-500">
          <p>💡 Click cards to flip them and find matching pairs!</p>
        </div>
      </div>

      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-purple-600 mb-4">
              Excellent Memory!
            </h3>
            <p className="text-lg mb-2">
              You matched all {pairs.length} pairs in {moves} moves!
            </p>
            <p className="text-2xl font-bold text-amber-600 mb-6">+30 XP</p>
            <button
              onClick={() => onComplete(true)}
              className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-lg font-semibold"
            >
              Continue Story →
            </button>
          </div>
        </div>
      )}

      {gameOver && !gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-3xl font-bold text-red-600 mb-4">Time's Up!</h3>
            <p className="text-lg mb-4">
              Matches: {matchedPairs}/{pairs.length}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
              <button
                onClick={() => onComplete(false)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Continue Story →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

