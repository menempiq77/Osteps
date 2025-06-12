"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button, Progress } from "antd";

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
  }[];
}

export default function QuizResultPage() {
  const router = useRouter();
  
  // Mock data - in a real app, this would come from your API
  const result: QuizResult = {
    totalQuestions: 5,
    correctAnswers: 3,
    scorePercentage: 60,
    timeTaken: "5:30",
    quizDetails: [
      {
        question: "What is the meaning of Iman?",
        userAnswer: "Belief in Allah",
        correctAnswer: "Belief in Allah and His Messenger",
        isCorrect: false,
      },
      {
        question: "Describe the importance of prayer in Islam.",
        userAnswer: "Prayer is the pillar of religion and connects a believer with Allah.",
        correctAnswer: "Prayer is the pillar of religion and connects a believer with Allah.",
        isCorrect: true,
      },
      {
        question: "How many pillars of Islam are there?",
        userAnswer: "Five",
        correctAnswer: "Five",
        isCorrect: true,
      },
      {
        question: "Which of the following are prophets?",
        userAnswer: "Isa,Pharaoh",
        correctAnswer: "Isa,Musa,Yunus",
        isCorrect: false,
      },
      {
        question: "Select the first month of the Islamic calendar.",
        userAnswer: "Muharram",
        correctAnswer: "Muharram",
        isCorrect: true,
      },
    ],
  };

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
                  You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
                </p>
                <p className="text-gray-600">Time taken: {result.timeTaken}</p>
              </div>

              <div className="flex flex-col items-center">
                <Progress
                  type="circle"
                  percent={result.scorePercentage}
                  strokeColor="#4f46e5"
                  trailColor="#e0e7ff"
                  strokeWidth={10}
                  width={120}
                  format={(percent) => (
                    <span className="text-2xl font-bold text-indigo-600">
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
                  item.isCorrect
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
                        <span
                          className={
                            item.isCorrect ? "text-green-600" : "text-red-600"
                          }
                        >
                          {item.userAnswer}
                        </span>
                      </p>
                      {!item.isCorrect && (
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
                    {item.isCorrect ? (
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
              className="bg-indigo-600 hover:bg-indigo-700"
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