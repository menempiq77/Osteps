"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button, Progress, message } from "antd";
import { fetchQuizQuestions } from "@/services/quizApi";

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeTaken: string;
  quizDetails: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    isSubjective: boolean;
  }[];
}

interface Option {
  id: number;
  option_text: string;
  is_correct: number;
}

interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  type: string;
  correct_answer: string | null;
  options: Option[];
}

interface Quiz {
  id: number;
  name: string;
  quiz_queston: QuizQuestion[];
}
interface StoredAnswer {
  question_id: number;
  answer: string | number | boolean | number[];
}

export default function QuizResultPage() {
  const router = useRouter();
  const { quizId } = useParams();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<StoredAnswer[]>([]);

  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchQuizQuestions(Number(quizId));
        setQuizData(response);
        
        // Retrieve stored answers from localStorage
        const storedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
        if (storedAnswers) {
          const parsedAnswers = JSON.parse(storedAnswers);
          setUserAnswers(parsedAnswers.answers || []);
        }
      } catch {
        message.error("Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };
    loadQuizQuestions();
  }, [quizId]);

  // Function to get user's answer text
  const getUserAnswerText = (questionId: number): string => {
    const answer = userAnswers.find(a => a.question_id === questionId);
    if (!answer) return "Not answered";

    const question = quizData?.quiz_queston.find(q => q.id === questionId);
    if (!question) return "Not answered";

    // Handle different question types
    if (question.type === "multiple_choice" || question.type === "drop_down") {
      const option = question.options.find(opt => opt.id === answer.answer);
      return option?.option_text || "Not answered";
    }

    if (question.type === "check_boxes") {
      const selectedOptions = question.options.filter(opt => 
        Array.isArray(answer.answer) && answer.answer.includes(opt.id)
      );
      return selectedOptions.map(opt => opt.option_text).join(", ") || "Not answered";
    }

    if (question.type === "true_false") {
      return answer.answer ? "True" : "False";
    }

    return answer.answer?.toString() || "Not answered";
  };

  // Function to check if answer is correct
  const isAnswerCorrect = (questionId: number): boolean | null => {
    const answer = userAnswers.find(a => a.question_id === questionId);
    if (!answer) return false;

    const question = quizData?.quiz_queston.find(q => q.id === questionId);
    if (!question) return false;

    // Return null for subjective questions (short answer and paragraph)
    if (question.type === "short_answer" || question.type === "paragraph") {
      return null;
    }

    if (question.type === "multiple_choice" || question.type === "drop_down") {
      const correctOption = question.options.find(opt => opt.is_correct === 1);
      return correctOption?.id === answer.answer;
    }

    if (question.type === "check_boxes") {
      const correctOptions = question.options.filter(opt => opt.is_correct === 1);
      const correctOptionIds = correctOptions.map(opt => opt.id);
      return (
        Array.isArray(answer.answer) &&
        correctOptionIds.length === answer.answer.length &&
        correctOptionIds.every(id => answer.answer.includes(id))
      );
    }

    if (question.type === "true_false") {
      const correctAnswer = question.correct_answer === "1";
      return answer.answer === correctAnswer;
    }

    return false;
  };

  // Function to get correct answer text
  const getCorrectAnswerText = (question: QuizQuestion): string => {
    switch (question.type) {
      case "multiple_choice":
      case "drop_down":
        const correctOption = question.options.find(opt => opt.is_correct === 1);
        return correctOption ? correctOption.option_text : "No correct answer specified";
      case "check_boxes":
        const correctOptions = question.options.filter(opt => opt.is_correct === 1);
        return correctOptions.map(opt => opt.option_text).join(", ") || "No correct answers specified";
      case "true_false":
        return question.correct_answer === "1" ? "True" : "False";
      case "short_answer":
      case "paragraph":
        return question.correct_answer || "No specific correct answer (subjective question)";
      default:
        return "No specific correct answer (subjective question)";
    }
  };

  // Calculate results
  const calculateResults = (): QuizResult => {
    if (!quizData) {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        scorePercentage: 0,
        timeTaken: "0:00",
        quizDetails: [],
      };
    }

    const totalQuestions = quizData?.quiz_queston?.length;
    const correctAnswers = quizData?.quiz_queston?.reduce((count, question) => {
      const isCorrect = isAnswerCorrect(question.id);
      return count + (isCorrect === true ? 1 : 0); // Only count truly correct answers
    }, 0);
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      totalQuestions,
      correctAnswers,
      scorePercentage,
      timeTaken: "0:00", // You can store and retrieve the time taken if needed
      quizDetails: quizData?.quiz_queston?.map(question => {
        const correctness = isAnswerCorrect(question.id);
        return {
          question: question.question_text,
          userAnswer: getUserAnswerText(question.id),
          correctAnswer: getCorrectAnswerText(question),
          isCorrect: correctness === true, // true for correct, false for incorrect, null for subjective
          isSubjective: question.type === "short_answer" || question.type === "paragraph"
        };
      }),
    };
  };

  const result = calculateResults();

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Quiz
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
          <p className="text-gray-600 mt-1">{quizData?.name}</p>
        </div>

        <div className="p-6">
          {/* Summary Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Your Performance
                </h2>
                <p className="text-gray-600">
                  You answered {result.correctAnswers} out of{" "}
                  {result.totalQuestions} questions correctly.
                </p>
                {/* <p className="text-gray-600">Time taken: {result.timeTaken}</p> */}
              </div>

              <div className="flex flex-col items-center">
                <Progress
                  type="circle"
                  percent={result.scorePercentage}
                  strokeColor="#38C16C"
                  trailColor="#e0e7ff"
                  strokeWidth={10}
                  size={120}
                  format={(percent) => (
                    <span className="text-2xl font-bold text-primary">
                      {percent}%
                    </span>
                  )}
                />
                <div className="mt-4 flex items-center gap-1">
                  {result.scorePercentage >= 80 ? (
                    <>
                      <Trophy className="text-yellow-500" size={18} />
                      <span className="font-medium text-yellow-600">
                        Excellent!
                      </span>
                    </>
                  ) : result.scorePercentage >= 50 ? (
                    <>
                      <CheckCircle2 className="text-green-500" size={18} />
                      <span className="font-medium text-green-600">
                        Good Job!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-500" size={18} />
                      <span className="font-medium text-red-600">
                        Keep Practicing!
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Question Breakdown
            </h3>

            {result.quizDetails.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  item.isSubjective 
                    ? "bg-gray-50 border-gray-200" 
                    : item.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      Q{index + 1}: {item.question}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Your answer:</span>{" "}
                        <span className="text-gray-600">
                          {item.userAnswer || "Not answered"}
                        </span>
                      </p>
                      {!item.isSubjective && (
                        <p className="text-sm">
                          <span className="font-medium">Correct answer:</span>{" "}
                          <span className="text-green-600">
                            {item.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    {item.isSubjective ? null : item.isCorrect ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              type="primary"
              onClick={() => router.push("/dashboard")}
              className="!bg-primary hover:!bg-primary/90"
            >
              Back to Dashboard
            </Button>
            <Button onClick={() => router.back()}>Review Quiz Again</Button>
          </div>
        </div>
      </div>
    </div>
  );
}