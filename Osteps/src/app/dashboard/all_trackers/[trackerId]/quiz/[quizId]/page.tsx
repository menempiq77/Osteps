"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Space,
  Radio,
  message,
  Skeleton,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchQuizQuestions } from "@/services/quizApi";
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
  correct_answer: number | null;
  options: Option[];
  marks: number;
}

interface Quiz {
  id: number;
  name: string;
  quiz_queston: QuizQuestion[];
}

const quizTypeLabels: Record<string, string> = {
  short_answer: "Short Answer",
  paragraph: "Paragraph",
  multiple_choice: "Multiple Choice",
  check_boxes: "Checkboxes",
  drop_down: "Dropdown",
  true_false: "True/False",
};

export default function QuranQuizPage() {
  const { quizId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchQuizQuestions(Number(quizId));
        setQuizData(response);
      } catch (error) {
        message.error("Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };

    loadQuizQuestions();
  }, [quizId]);

  const getCorrectAnswerText = (question: QuizQuestion) => {
    if (question.type === "true_false") {
      return question.correct_answer === 1 ? "True" : "False";
    }

    if (question.type === "multiple_choice" || question.type === "drop_down") {
      const correctOption = question.options.find(
        (opt) => opt.is_correct === 1
      );
      return correctOption ? correctOption.option_text : "Not specified";
    }

    if (question.type === "check_boxes") {
      const correctOptions = question.options.filter(
        (opt) => opt.is_correct === 1
      );
      return (
        correctOptions.map((opt) => opt.option_text).join(", ") ||
        "Not specified"
      );
    }

    return question.correct_answer?.toString() || "Not specified";
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Topics
        </Button>
      </div>

      {loading && !quizData ? (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {quizData?.name || "Quiz"}
            </h1>
          </div>

          <div className="p-6 space-y-6">
            {!quizData?.quiz_queston?.length ? (
              <div className="text-center text-gray-500 py-8">
                No questions available.
              </div>
            ) : (
              quizData?.quiz_queston?.map((question) => (
                <div
                  key={question.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-700">Q:</span>{" "}
                      {question.question_text}
                    </div>
                  </div>

                  <div className="mt-4">
                    {question.type === "short_answer" && (
                      <Input placeholder="Your answer" />
                    )}

                    {question.type === "paragraph" && (
                      <Input.TextArea rows={4} placeholder="Your answer" />
                    )}

                    {question.type === "multiple_choice" && (
                      <div className="space-y-2">
                        {question.options?.map((option, idx) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="radio"
                              id={`${question.id}-${option.id}`}
                              name={`quiz-${question.id}`}
                              value={option.option_text}
                              className="mr-2"
                            />
                            <label htmlFor={`${question.id}-${option.id}`}>
                              {option.option_text}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "check_boxes" && (
                      <Checkbox.Group>
                        <Space direction="vertical">
                          {question.options?.map((option) => (
                            <Checkbox
                              key={option.id}
                              value={option.option_text}
                            >
                              {option.option_text}
                            </Checkbox>
                          ))}
                        </Space>
                      </Checkbox.Group>
                    )}

                    {question.type === "drop_down" && (
                      <Select
                        style={{ width: 200 }}
                        placeholder="Select an answer"
                      >
                        {question.options?.map((opt) => (
                          <Select.Option key={opt.id} value={opt.option_text}>
                            {opt.option_text}
                          </Select.Option>
                        ))}
                      </Select>
                    )}

                    {question.type === "true_false" && (
                      <Radio.Group>
                        <Space direction="horizontal">
                          <Radio value="true">True</Radio>
                          <Radio value="false">False</Radio>
                        </Space>
                      </Radio.Group>
                    )}
                  </div>

                  {canUpload && (
                    <div className="mt-3 text-xs text-gray-500">
                      <strong>Correct Answer:</strong>{" "}
                      {getCorrectAnswerText(question)}
                    </div>
                  )}

                  <div className="mt-1 text-xs text-gray-500 flex justify-between">
                    <span>
                      Type: {quizTypeLabels[question.type] || question.type}
                    </span>
                    <span>Marks: {question.marks || "N/A"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
