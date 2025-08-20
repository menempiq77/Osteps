"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Select,
  message,
  Skeleton,
  Tag,
  Input,
  InputNumber,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchStudents } from "@/services/studentsApi";
import { fetchQuizQuestions, fetchSubmittedQuizDetails, quizAnswerMarks } from "@/services/quizApi";

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

interface SubmittedAnswer {
  id: number;
  question_id: number;
  question_text: string;
  question_type: string;
  submitted_answer: any;
  is_correct: number;
  correct_answer: string | null;
  marks: number;
}

interface Student {
  id: string;
  student_name: string;
  class_id: string;
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
  const { quizId, classId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswer[]>(
    []
  );
  const [customMarks, setCustomMarks] = useState<Record<number, number>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {}
  );
  const [messageApi, contextHolder] = message.useMessage();

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER" || currentUser?.role === "HOD";

  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchQuizQuestions(Number(quizId));
        setQuizData(response);
      } catch {
        message.error("Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };
    loadQuizQuestions();
  }, [quizId]);

  useEffect(() => {
    const loadSubmittedQuizDetails = async () => {
      if (!selectedStudentId) return;
      try {
        setLoading(true);
        const response = await fetchSubmittedQuizDetails(
          Number(quizId),
          Number(selectedStudentId),
          "assessment"
        );
        setSubmittedAnswers(response);

        // Initialize custom marks with existing marks from submitted answers
        const marksMap: Record<number, number> = {};
        response.forEach((ans) => {
          marksMap[ans.question_id] = ans.marks;
        });
        setCustomMarks(marksMap);
      } catch {
        message.error("Failed to load submitted answers");
      } finally {
        setLoading(false);
      }
    };
    loadSubmittedQuizDetails();
  }, [quizId, selectedStudentId]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents(Number(classId));
        setStudents(data);
        if (data.length > 0) setSelectedStudentId(data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (classId) loadStudents();
  }, [classId]);

  const handleStudentChange = (value: string) => {
    setSelectedStudentId(value);
  };

  const getCorrectAnswerText = (question: QuizQuestion) => {
    if (question.type === "true_false") {
      return question.correct_answer === 1 ? "True" : "False";
    }
    if (question.type === "multiple_choice" || question.type === "drop_down") {
      const correctOption = question.options.find(
        (opt) => opt.is_correct === 1
      );
      return correctOption?.option_text || "Not specified";
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

  const renderSubmittedAnswer = (question: QuizQuestion): string => {
    const submitted = submittedAnswers?.find(
      (ans) => ans.question_id === question.id
    );
    if (!submitted) return "No answer submitted";

    const { submitted_answer } = submitted;

    switch (question.type) {
      case "short_answer":
      case "paragraph":
        return submitted_answer || "Not answered";
      case "true_false":
        return submitted_answer ? "True" : "False";
      case "multiple_choice":
      case "drop_down": {
        const opt = question.options.find((o) => o.id === submitted_answer);
        return opt?.option_text || "Not answered";
      }
      case "check_boxes":
        if (Array.isArray(submitted_answer)) {
          const selectedOptions = question.options.filter((opt) =>
            submitted_answer.includes(opt.id)
          );
          return (
            selectedOptions.map((o) => o.option_text).join(", ") ||
            "Not answered"
          );
        }
        return "Invalid format";
      default:
        return "Unknown type";
    }
  };

  const handleCustomMarkChange = (questionId: number, value: number | null) => {
    if (value === null) return;
    setCustomMarks((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const markAnswer = async (
    answerId: number,
    isCorrect: boolean,
    questionId: number,
    maxMarks: number
  ) => {
    const key = `${questionId}-${isCorrect ? "correct" : "incorrect"}`;
    try {
      setLoadingStates((prev) => ({ ...prev, [key]: true }));

      const question = quizData?.quiz_queston.find((q) => q.id === questionId);
      const isTextType =
        question?.type === "short_answer" || question?.type === "paragraph";

      const marksToUse = isTextType
        ? customMarks[questionId] ?? 0
        : isCorrect
        ? maxMarks
        : 0;

      await quizAnswerMarks(answerId, isCorrect ? 1 : 0, marksToUse);
      messageApi.success("Answer marked successfully");

      setSubmittedAnswers((prev) =>
        prev.map((ans) =>
          ans.id === answerId
            ? { ...ans, is_correct: isCorrect ? 1 : 0, marks: marksToUse }
            : ans
        )
      );
    } catch (error) {
      messageApi.error("Failed to mark answer");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto min-h-screen">
      {contextHolder}
      <div className="mb-8 flex justify-between items-center">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Quizzes
        </Button>

        <div className="min-w-xs mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Students
          </label>
          <Select
            value={selectedStudentId}
            onChange={handleStudentChange}
            placeholder="Select student"
            style={{ width: "100%" }}
          >
            {students.map((student) => (
              <Select.Option key={student.id} value={student.id}>
                {student.student_name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {loading && !quizData ? (
        <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
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
                  className="bg-white p-4 rounded shadow-sm border border-gray-200 relative"
                >
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">Q:</span>{" "}
                    {question.question_text}
                  </div>

                  {/* Correct Answer */}
                  {canUpload && (
                    <div className="my-2 text-xs text-green-600">
                      <strong className="text-black font-medium">
                        Correct Answer:
                      </strong>{" "}
                      {getCorrectAnswerText(question)}
                    </div>
                  )}

                  {/* Submitted Answer */}
                  {(() => {
                    const submitted = submittedAnswers?.find(
                      (ans) => ans.question_id === question.id
                    );
                    const isCorrect = submitted?.is_correct === 1;
                    const isTextType =
                      question.type === "short_answer" ||
                      question.type === "paragraph";

                    return (
                      <div className="mt-2 text-sm">
                        {submitted && (
                          <>
                            <Tag
                              color={isCorrect ? "green" : "red"}
                              className="mt-1 w-full !py-2"
                            >
                              <div className="">
                                <strong>Submitted Answer:</strong>{" "}
                                {renderSubmittedAnswer(question)}
                              </div>
                            </Tag>

                            {canUpload && (
                              <div className="mt-4">
                                <div className="flex items-center gap-4 flex-wrap">
                                  {isTextType ? (
                                    <>
                                      <InputNumber
                                        min={0}
                                        max={question.marks}
                                        value={
                                          customMarks[question.id] ??
                                          submitted.marks
                                        }
                                        onChange={(value) =>
                                          handleCustomMarkChange(
                                            question.id,
                                            value
                                          )
                                        }
                                        className="w-24"
                                      />
                                      <span className="text-sm text-gray-600">
                                        / {question.marks}
                                      </span>
                                      <Button
                                        size="small"
                                        type="primary"
                                        onClick={() =>
                                          markAnswer(
                                            submitted.id,
                                            true,
                                            question.id,
                                            question.marks
                                          )
                                        }
                                        loading={loadingStates[question.id]}
                                      >
                                        Save Marks
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="small"
                                        type={isCorrect ? "primary" : "default"}
                                        onClick={() =>
                                          markAnswer(
                                            submitted.id,
                                            true,
                                            question.id,
                                            question.marks
                                          )
                                        }
                                        loading={loadingStates[question.id]}
                                      >
                                        Correct
                                      </Button>
                                      <Button
                                        size="small"
                                        danger={!isCorrect}
                                        onClick={() =>
                                          markAnswer(
                                            submitted.id,
                                            false,
                                            question.id,
                                            question.marks
                                          )
                                        }
                                        loading={loadingStates[question.id]}
                                      >
                                        Incorrect
                                      </Button>
                                    </>
                                  )}
                                  <span className="text-sm text-gray-600">
                                    Marks: {submitted.marks || 0}/
                                    {question.marks}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })()}
                  <div className="mt-1 text-xs text-white bg-primary inline-block px-2 py-1 rounded absolute top-2 right-2">
                    {quizTypeLabels[question.type] || question.type}
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
