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
};

export default function AdamQuizClient({ slug, totalSections, quizSectionIndex, unlocked }: Props) {
  const router = useRouter();
  const questions: Question[] = useMemo(
    () => {
      const raw: Question[] = [
      {
        prompt: "Why did Allah announce Adam's creation to the angels?",
        options: [
          "To show Allah's wisdom and purpose in creation",
          "To test the angels' obedience",
          "To show Adam's physical strength",
          "To make the angels jealous",
        ],
        correctIndex: 0,
      },
      {
        prompt: "What made Adam honored above the angels?",
        options: [
          "His long worship",
          "His physical creation",
          "His place in Paradise",
          "The knowledge Allah taught him",
        ],
        correctIndex: 3,
      },
      {
        prompt: "Why did Iblis refuse to bow to Adam?",
        options: [
          "He did not hear the command",
          "He was arrogant and proud",
          "He feared Adam",
          "He misunderstood the order",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What was the purpose of Allah's command regarding the tree?",
        options: [
          "To punish Adam",
          "To make Paradise difficult",
          "To test obedience",
          "To remove Adam from Paradise",
        ],
        correctIndex: 2,
      },
      {
        prompt: "How did Satan deceive Adam and Eve?",
        options: [
          "By whispering and misleading promises",
          "By forcing them",
          "By threatening them",
          "By hiding the command",
        ],
        correctIndex: 0,
      },
      {
        prompt: "What happened immediately after Adam and Eve disobeyed Allah?",
        options: [
          "They were forgiven instantly",
          "They felt shame and loss",
          "They forgot the command",
          "The angels punished them",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What lesson does Adam's repentance teach us?",
        options: [
          "Mistakes are not forgiven",
          "Repentance is unnecessary",
          "Only prophets can repent",
          "Sincere repentance leads to Allah's mercy",
        ],
        correctIndex: 3,
      },
      {
        prompt: "Why was Adam sent down to earth?",
        options: [
          "As a punishment only",
          "To live with responsibility and guidance",
          "To escape Satan",
          "To end his mission",
        ],
        correctIndex: 1,
      },
      {
        prompt: "What is the ongoing reality of human life on earth according to the story?",
        options: [
          "Comfort without struggle",
          "Freedom without rules",
          "Continuous struggle with guidance from Allah",
          "Life without accountability",
        ],
        correctIndex: 2,
      },
      {
        prompt: "What is the main message of the entire story of Prophet Adam?",
        options: [
          "Humans are better than angels",
          "Paradise is easy to enter",
          "Disobedience has no consequences",
          "Knowledge, obedience, repentance, and responsibility define human life",
        ],
        correctIndex: 3,
      },
      ];

      return raw.map((q) => ({
        ...q,
        prompt: formatProphetNamesWithPbuh(q.prompt),
        options: q.options.map((opt) => formatProphetNamesWithPbuh(opt)),
      }));
    },
    [],
  );

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
      return {
        submitted: hasScore,
        score: hasScore ? (parsed.score as number) : (null as number | null),
        passed: isCompleted,
        answers:
          Array.isArray(parsed.answers) && parsed.answers.length === total
            ? parsed.answers.map((n) => (typeof n === "number" ? n : null))
            : undefined,
      };
    } catch {
      return { submitted: false, score: null as number | null, passed: false };
    }
  }, [slug, total]);

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => stored.answers ?? Array(total).fill(null),
  );
  const [submitted, setSubmitted] = useState<boolean>(stored.submitted);
  const [score, setScore] = useState<number | null>(stored.score);
  const [passed, setPassed] = useState<boolean>(stored.passed);

  const reviewUnavailable = submitted && passed && answers.every((a) => a === null);

  function computeScore(nextAnswers: (number | null)[]) {
    let nextScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (nextAnswers[i] === questions[i].correctIndex) nextScore++;
    }
    return nextScore;
  }

  function onSubmit() {
    if (!unlocked) return;
    const nextScore = computeScore(answers);
    setSubmitted(true);
    setScore(nextScore);

    const passMark = Math.ceil(total * 0.7);
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
      total,
      completedAt: new Date().toISOString(),
      attempts: nextAttempts,
      passedAtAttempt,
      answers,
    };
    window.localStorage.setItem(quizKey(slug), JSON.stringify(payload));

    if (didPass) {
      markSectionCompleted(slug, quizSectionIndex, totalSections);
      recordQuizRewards(slug, nextScore, total);
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

          {questions.map((q, idx) => {
            const selected = answers[idx];
            return (
              <div key={`adam-quiz-q:${idx}`} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 text-sm font-black text-gray-900">
                  {idx + 1}. {q.prompt}
                </div>

                <div className="grid gap-2">
                  {q.options.map((opt, optIdx) => {
                    const id = `adam-quiz-${idx}-${optIdx}`;
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
                          name={`adam-quiz-q-${idx}`}
                          disabled={disabled}
                          checked={selected === optIdx}
                          onChange={() => {
                            if (passed) return;
                            setAnswers((prev) => {
                              const next = [...prev];
                              next[idx] = optIdx;
                              return next;
                            });
                          }}
                          className="mt-0.5"
                        />
                        <span>{opt}</span>
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
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <div className="text-sm font-bold text-gray-700">
          {submitted && score !== null ? (
            passed ? (
              <span className="text-green-700">Score: {score}/{total}. Completed.</span>
            ) : (
              <span className="text-amber-700">Score: {score}/{total}. You need at least 7/10.</span>
            )
          ) : (
            <span>Answer the questions, then submit.</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!passed ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!unlocked}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              Submit
            </button>
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
    </div>
  );
}
