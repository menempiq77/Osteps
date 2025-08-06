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
  Breadcrumb,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchQuizQuestions,
  submitTaskQuizByStudent,
} from "@/services/quizApi";
import Link from "next/link";

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
}

interface Quiz {
  id: number;
  name: string;
  quiz_queston: QuizQuestion[];
}

interface Answer {
  question_id: number;
  answer: string | number | boolean | number[];
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
  const { quizId, Id } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [messageApi, contextHolder] = message.useMessage();

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";

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

  const handleAnswerChange = (
    questionId: number,
    value: any,
    questionType: string
  ) => {
    let formattedValue = value;

    // Handle different question types
    if (questionType === "check_boxes") {
      // For checkboxes, we need to store the selected option IDs
      formattedValue = value
        .map((v: string) => {
          const option = quizData?.quiz_queston
            .find((q) => q.id === questionId)
            ?.options.find((o) => o.option_text === v);
          return option?.id || 0;
        })
        .filter((id: number) => id !== 0);
    } else if (
      questionType === "multiple_choice" ||
      questionType === "drop_down"
    ) {
      // For radio/dropdown, store the selected option ID
      const option = quizData?.quiz_queston
        .find((q) => q.id === questionId)
        ?.options.find((o) => o.option_text === value);
      formattedValue = option?.id || 0;
    } else if (questionType === "true_false") {
      // For true/false, convert to boolean
      formattedValue = value === "true";
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: formattedValue,
    }));
  };

  const handleSubmit = async () => {
    if (!quizData || !currentUser) return;

    try {
      setSubmitting(true);

      const formattedAnswers: Answer[] = quizData.quiz_queston.map(
        (question) => {
          const answer = answers[question.id] || "";
          return {
            question_id: question.id,
            answer: answer,
          };
        }
      );

      localStorage.setItem(
        `quiz_${quizData.id}_answers`,
        JSON.stringify({
          answers: formattedAnswers,
          submittedAt: new Date().toISOString(),
        })
      );

      const res = await submitTaskQuizByStudent(
        quizData.id,
        currentUser.student,
        Id,
        formattedAnswers,
        "task"
      );

      // ✅ check if already submitted
      if (res?.status === 409) {
        messageApi.warning(
          res.message || "You have already submitted this quiz."
        );
        return; // stop further execution
      }

      messageApi.success("Quiz submitted successfully!");
      router.push(`${quizId}/quiz-result`);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        messageApi.warning("You have already submitted this quiz.");
      } else {
        messageApi.error("Failed to submit quiz");
        console.error("Submission error:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto min-h-screen">
      {contextHolder}
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              title: (
                <Link href="/dashboard/students/assignments">Assesments</Link>
              ),
            },
            {
              title: (
                <Link href={`/dashboard/students/assignments/${quizId}`}>
                  Tasks
                </Link>
              ),
            },
            {
              title: <span>Quiz</span>,
            },
          ]}
          className="!mb-2"
        />
      </div>

      {loading && !quizData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              quizData.quiz_queston.map((question) => (
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
                      <Input
                        placeholder="Your answer"
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id,
                            e.target.value,
                            question.type
                          )
                        }
                      />
                    )}

                    {question.type === "paragraph" && (
                      <Input.TextArea
                        rows={4}
                        placeholder="Your answer"
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id,
                            e.target.value,
                            question.type
                          )
                        }
                      />
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
                              onChange={() =>
                                handleAnswerChange(
                                  question.id,
                                  option.option_text,
                                  question.type
                                )
                              }
                            />
                            <label htmlFor={`${question.id}-${option.id}`}>
                              {option.option_text}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "check_boxes" && (
                      <Checkbox.Group
                        onChange={(values) =>
                          handleAnswerChange(question.id, values, question.type)
                        }
                      >
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
                        onChange={(value) =>
                          handleAnswerChange(question.id, value, question.type)
                        }
                      >
                        {question.options?.map((opt) => (
                          <Select.Option key={opt.id} value={opt.option_text}>
                            {opt.option_text}
                          </Select.Option>
                        ))}
                      </Select>
                    )}

                    {question.type === "true_false" && (
                      <Radio.Group
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id,
                            e.target.value,
                            question.type
                          )
                        }
                      >
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

                  <div className="mt-1 text-xs text-gray-500">
                    Type: {quizTypeLabels[question.type] || question.type}
                  </div>
                </div>
              ))
            )}
          </div>

          {isStudent && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={submitting}
                disabled={!quizData?.quiz_queston?.length}
                className="!bg-primary !border-primary hover:!bg-primary/90 disabled:!bg-gray-300 disabled:!border-gray-300 disabled:!text-gray-500"
              >
                Submit Answers
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
