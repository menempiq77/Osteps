"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoryProgress, markSectionCompleted, setStoryProgress, recordQuizRewards } from "./storyProgress";
import { formatProphetNamesWithPbuh } from "./pbuh";

const QUIZ_STORAGE_PREFIX = "islamic_curriculum_story_quiz_v1";

function quizKey(slug: string) {
  return `${QUIZ_STORAGE_PREFIX}:${slug}`;
}

type QuizStoredState = {
  passed: boolean;
  status?: "COMPLETED" | "FAILED";
  score: number;
  total: number;
  completedAt: string;
  attempts: number;
  passedAtAttempt?: number;
  answers?: Array<number | null>;
  questions?: Question[];
};

type Question = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

type Props = {
  slug: string;
  totalSections: number;
  quizSectionIndex: number;
  unlocked: boolean;
  /** Sections (title + body) before the quiz section (in order). */
  sections: { title: string; body: string }[];
};

function hashStringToUint32(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pickUniqueIndices(count: number, maxExclusive: number, rand: () => number) {
  const chosen = new Set<number>();
  const triesLimit = 500;
  let tries = 0;
  while (chosen.size < Math.min(count, maxExclusive) && tries < triesLimit) {
    tries++;
    chosen.add(Math.floor(rand() * maxExclusive));
  }
  return Array.from(chosen);
}

function shuffle<T>(arr: T[], rand: () => number) {
  const next = arr.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const STOP_WORDS = new Set(
  [
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "in",
    "on",
    "for",
    "with",
    "as",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "that",
    "this",
    "these",
    "those",
    "it",
    "its",
    "his",
    "her",
    "their",
    "them",
    "he",
    "she",
    "they",
    "we",
    "you",
    "i",
    "not",
    "no",
    "do",
    "does",
    "did",
    "so",
    "but",
    "from",
    "into",
    "at",
    "by",
    "up",
    "down",
    "over",
    "under",
    "then",
    "than",
    "when",
    "while",
    "because",
    "before",
    "after",
  ].map((w) => w.toLowerCase()),
);

const PBUH_WORDS = new Set(["peace", "upon", "pbuh"]);

function toCandidateNarrativeText(body: string) {
  const trimmed = (body ?? "").trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\n\nLesson:\s*/i);
  return (parts[0] ?? trimmed).trim() || trimmed;
}

function splitSentences(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractWords(text: string) {
  // Keep letters, numbers, apostrophes, and hyphens.
  const cleaned = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'\-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return [];

  return cleaned
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length >= 4)
    .filter((w) => !STOP_WORDS.has(w));
}

function buildQuestions(slug: string, sections: { title: string; body: string }[]): Question[] {
  const rand = mulberry32(hashStringToUint32(slug));

  const narrativeTexts = sections
    .map((s) => toCandidateNarrativeText(formatProphetNamesWithPbuh(s.body)))
    .filter((t) => t.trim().length > 0);

  const sentences = narrativeTexts
    .flatMap((t) => splitSentences(t))
    .filter((s) => s.length >= 40 && s.length <= 220);

  if (sentences.length === 0) {
    return [
      {
        prompt: "Quiz is not available for this story yet.",
        options: ["OK"],
        correctIndex: 0,
      },
    ];
  }

  // Build a word frequency map so we can pick more distinctive words.
  const allWords = sentences.flatMap((s) => extractWords(s));
  const freq = new Map<string, number>();
  for (const w of allWords) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  const uniqueWords = Array.from(new Set(allWords));

  function pickBlankWord(sentence: string) {
    const words = extractWords(sentence);
    if (words.length === 0) return null;

    let best: { word: string; score: number } | null = null;
    for (const w of words) {
      if (PBUH_WORDS.has(w)) continue;

      // Never blank prophet names; otherwise they can appear in options without PBUH.
      if (formatProphetNamesWithPbuh(w) !== w) continue;

      const f = freq.get(w) ?? 1;
      const score = w.length * 2 + Math.max(0, 8 - f);
      if (!best || score > best.score) best = { word: w, score };
    }
    return best?.word ?? null;
  }

  function blankSentence(sentence: string, word: string) {
    // Replace the first case-insensitive whole-word occurrence.
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "i");
    if (!re.test(sentence)) return null;
    return sentence.replace(re, "____");
  }

  const chosenSentenceIdxs = shuffle(
    pickUniqueIndices(10, sentences.length, rand),
    rand,
  );

  const questions: Question[] = [];
  for (const idx of chosenSentenceIdxs) {
    const sentence = sentences[idx];
    const word = pickBlankWord(sentence);
    if (!word) continue;
    const blanked = blankSentence(sentence, word);
    if (!blanked) continue;

    const distractors = shuffle(
      uniqueWords.filter((w) => w !== word).slice(0, 50),
      rand,
    )
      .filter((w) => w !== word)
      .slice(0, 3);

    const optionObjs = shuffle(
      [
        { kind: "correct" as const, v: word },
        ...distractors.map((d) => ({ kind: "wrong" as const, v: d })),
      ],
      rand,
    );

    questions.push({
      prompt: `Fill in the blank (from the story):\n\n“${blanked}”`,
      options: optionObjs.map((o) => o.v),
      correctIndex: optionObjs.findIndex((o) => o.kind === "correct"),
    });

    if (questions.length >= 10) break;
  }

  // If we couldn't generate enough (very short story), pad with simpler questions.
  while (questions.length < 10) {
    const sentence = sentences[Math.floor(rand() * sentences.length)];
    const word = pickBlankWord(sentence);
    if (!word) break;
    const blanked = blankSentence(sentence, word);
    if (!blanked) break;

    const distractors = shuffle(uniqueWords.filter((w) => w !== word), rand).slice(0, 3);
    const optionObjs = shuffle(
      [
        { kind: "correct" as const, v: word },
        ...distractors.map((d) => ({ kind: "wrong" as const, v: d })),
      ],
      rand,
    );

    questions.push({
      prompt: `Fill in the blank (from the story):\n\n“${blanked}”`,
      options: optionObjs.map((o) => o.v),
      correctIndex: optionObjs.findIndex((o) => o.kind === "correct"),
    });
  }

  return questions.slice(0, 10);
}

export default function StoryQuizClient({
  slug,
  totalSections,
  quizSectionIndex,
  unlocked,
  sections,
}: Props) {
  const router = useRouter();
  const questions = useMemo(() => buildQuestions(slug, sections), [slug, sections]);
  const total = questions.length;

  const stored = useMemo(() => {
    if (typeof window === "undefined") {
      return { submitted: false, score: null as number | null, passed: false };
    }
    try {
      const raw = window.localStorage.getItem(quizKey(slug));
      if (!raw) return { submitted: false, score: null as number | null, passed: false };
      const parsed = JSON.parse(raw) as Partial<QuizStoredState>;
      const hasScore = typeof parsed.score === "number";
      const isCompleted = parsed.status === "COMPLETED" || Boolean(parsed.passed);
      const hasStoredQuestions =
        Array.isArray(parsed.questions) &&
        parsed.questions.length > 0 &&
        parsed.questions.every(
          (q) =>
            q &&
            typeof (q as Question).prompt === "string" &&
            Array.isArray((q as Question).options) &&
            typeof (q as Question).correctIndex === "number",
        );

      const storedTotal = typeof parsed.total === "number" && parsed.total > 0 ? parsed.total : undefined;
      const effectiveTotal = storedTotal ?? (hasStoredQuestions ? (parsed.questions as Question[]).length : total);

      return {
        submitted: hasScore,
        score: hasScore ? (parsed.score as number) : (null as number | null),
        passed: isCompleted,
        answers:
          Array.isArray(parsed.answers) && parsed.answers.length === effectiveTotal
            ? parsed.answers.map((n) => (typeof n === "number" ? n : null))
            : undefined,
        questions: hasStoredQuestions ? (parsed.questions as Question[]) : undefined,
      };
    } catch {
      return { submitted: false, score: null as number | null, passed: false };
    }
  }, [slug, total]);

  const effectiveQuestions = stored.questions ?? questions;
  const effectiveTotal = effectiveQuestions.length;

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => stored.answers ?? Array(effectiveTotal).fill(null),
  );
  const [submitted, setSubmitted] = useState<boolean>(stored.submitted);
  const [score, setScore] = useState<number | null>(stored.score);
  const [passed, setPassed] = useState<boolean>(stored.passed);

  const reviewUnavailable = submitted && passed && answers.every((a) => a === null);

  function computeScore(nextAnswers: (number | null)[]) {
    let nextScore = 0;
    for (let i = 0; i < effectiveQuestions.length; i++) {
      if (nextAnswers[i] === effectiveQuestions[i].correctIndex) nextScore++;
    }
    return nextScore;
  }

  function onSubmit() {
    if (!unlocked) return;
    const nextScore = computeScore(answers);
    setSubmitted(true);
    setScore(nextScore);

    const passMark = Math.ceil(effectiveTotal * 0.7);
    const didPass = nextScore >= passMark;
    setPassed(didPass);

    let nextAttempts = 1;
    let passedAtAttempt: number | undefined;
    try {
      const rawPrev = window.localStorage.getItem(quizKey(slug));
      if (rawPrev) {
        const prev = JSON.parse(rawPrev) as Partial<QuizStoredState>;
        if (typeof prev.attempts === "number" && prev.attempts >= 0) {
          nextAttempts = prev.attempts + 1;
        }
        if (typeof prev.passedAtAttempt === "number") {
          passedAtAttempt = prev.passedAtAttempt;
        }
      }
    } catch {
      // ignore
    }
    if (didPass && typeof passedAtAttempt !== "number") {
      passedAtAttempt = nextAttempts;
    }

    const payload: QuizStoredState = {
      passed: didPass,
      status: didPass ? "COMPLETED" : "FAILED",
      score: nextScore,
      total: effectiveTotal,
      completedAt: new Date().toISOString(),
      attempts: nextAttempts,
      passedAtAttempt,
      answers,
      questions: effectiveQuestions,
    };
    window.localStorage.setItem(quizKey(slug), JSON.stringify(payload));

    if (didPass) {
      markSectionCompleted(slug, quizSectionIndex, totalSections);
      recordQuizRewards(slug, nextScore, effectiveTotal);
    } else {
      const progress = getStoryProgress(slug);
      const nextCompleted = (progress.completedSectionIndices ?? []).filter((n) => n !== quizSectionIndex);
      setStoryProgress(slug, {
        ...progress,
        completedSectionIndices: nextCompleted,
        isStoryCompleted: false,
      });
    }

    try {
      window.dispatchEvent(new Event("story-progress-updated"));
    } catch {
      // ignore
    }

    router.push("/mind-upgrade/stories-of-the-prophets");
  }

  function onResetQuiz() {
    setAnswers(Array(effectiveTotal).fill(null));
    setSubmitted(false);
    setScore(null);
    setPassed(false);
    try {
      window.localStorage.removeItem(quizKey(slug));
    } catch {
      // ignore
    }

    const progress = getStoryProgress(slug);
    const nextCompleted = (progress.completedSectionIndices ?? []).filter((n) => n !== quizSectionIndex);
    setStoryProgress(slug, {
      ...progress,
      completedSectionIndices: nextCompleted,
      isStoryCompleted: false,
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xl font-black text-gray-900">Quiz (10 questions)</div>
        {passed ? (
          <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
            ✓ Completed
          </div>
        ) : null}
      </div>

      <div className="mb-5 text-sm font-bold text-gray-700">Pass requirement: at least 7/10.</div>

      {!unlocked && !passed ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          The quiz is locked. Complete all sections above first to unlock the questions.
        </div>
      ) : null}

      {unlocked || passed ? (
        <div className="grid gap-4">
          {reviewUnavailable ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
              Review details are unavailable for older attempts. If you want to see which answers were correct,
              please reset and retake the quiz once.
            </div>
          ) : null}

          {effectiveQuestions.map((q, idx) => {
            const selected = answers[idx];
            return (
              <div key={`${slug}-quiz-q:${idx}`} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 text-sm font-black text-gray-900">
                  {idx + 1}. {q.prompt}
                </div>

                <div className="grid gap-2">
                  {q.options.map((opt, optIdx) => {
                    const id = `${slug}-quiz-${idx}-${optIdx}`;
                    const disabled = passed;
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className={
                          "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-sm font-bold " +
                          (selected === optIdx
                            ? "border-teal-300 bg-teal-50 text-teal-900"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50") +
                          (disabled ? " cursor-not-allowed opacity-75" : "")
                        }
                      >
                        <input
                          id={id}
                          type="radio"
                          name={`${slug}-quiz-q-${idx}`}
                          value={optIdx}
                          disabled={disabled}
                          checked={selected === optIdx}
                          onChange={() => {
                            if (passed) return;
                            const next = answers.slice();
                            next[idx] = optIdx;
                            setAnswers(next);
                          }}
                          className="mt-1"
                        />
                        <span className="flex-1">{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && passed && !reviewUnavailable ? (
                  <div
                    className={
                      "mt-3 rounded-md px-3 py-2 text-sm font-bold " +
                      (answers[idx] === q.correctIndex
                        ? "bg-green-50 text-green-700"
                        : "bg-rose-50 text-rose-700")
                    }
                  >
                    {answers[idx] === q.correctIndex
                      ? `Correct. Correct answer: ${q.options[q.correctIndex]}`
                      : `Incorrect. Correct answer: ${q.options[q.correctIndex]}`}
                  </div>
                ) : null}
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-3">
            {!passed ? (
              <button
                type="button"
                onClick={onSubmit}
                disabled={!unlocked}
                className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Quiz
              </button>
            ) : null}

            {submitted && score !== null ? (
              <div className="text-sm font-black text-gray-900">
                Score: {score}/{effectiveTotal} {passed ? "(Passed)" : "(Try again)"}
              </div>
            ) : null}

            <button
              type="button"
              onClick={onResetQuiz}
              className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Reset quiz
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
