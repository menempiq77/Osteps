"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Space,
  Radio,
  message,
  Skeleton,
  Breadcrumb,
  Modal,
  Alert,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchQuizQuestions,
  submitTaskQuizByStudent,
} from "@/services/quizApi";
import {
  exitDocumentFullscreenIfActive,
  isDocumentFullscreenActive,
  requestDocumentFullscreenFromGesture,
} from "@/lib/browserFullscreen";
import {
  QuizExamIncidentContext,
  saveQuizExamIncident,
} from "@/services/quizExamIntegrityApi";
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
  marks?: number | string;
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
  const [selfAssessmentMark, setSelfAssessmentMark] = useState<number | null>(null);
  const [selfAssessmentTouched, setSelfAssessmentTouched] = useState(false);
  const [fullscreenPromptOpen, setFullscreenPromptOpen] = useState(false);
  const [fullscreenWarningCount, setFullscreenWarningCount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const quizFinishedRef = useRef(false);
  const lastIncidentRef = useRef<{ key: string; time: number } | null>(null);
  const titleRef = useRef("Quiz");

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";
  const totalSelfAssessmentMarks =
    quizData?.quiz_queston?.reduce(
      (sum, question) => sum + (parseFloat(String(question.marks ?? 0)) || 0),
      0
    ) || 0;

  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchQuizQuestions(Number(quizId));
        setQuizData(response);

        // Pre-populate answers from localStorage if student already submitted
        const stored = localStorage.getItem(`quiz_${response?.id}_answers`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const restored: Record<number, any> = {};
            (parsed.answers || []).forEach((a: { question_id: number; answer: any }) => {
              restored[a.question_id] = a.answer;
            });
            setAnswers(restored);
            if (parsed.selfAssessmentMark != null) {
              setSelfAssessmentMark(parsed.selfAssessmentMark);
            }
          } catch {}
        }
      } catch (error) {
        message.error("Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };

    loadQuizQuestions();
  }, [quizId]);

  useEffect(() => {
    titleRef.current = quizData?.name || "Quiz";
  }, [quizData?.name]);

  const recordIntegrityIncident = (
    reason: string,
    context: QuizExamIncidentContext,
    options?: { keepalive?: boolean }
  ) => {
    if (!isStudent || quizFinishedRef.current || !currentUser?.student || !quizId || !Id) return;

    const now = Date.now();
    const key = `${reason}:${context}`;
    if (
      lastIncidentRef.current?.key === key &&
      now - lastIncidentRef.current.time < 2000
    ) {
      return;
    }
    lastIncidentRef.current = { key, time: now };
    setFullscreenWarningCount((count) => count + 1);

    void saveQuizExamIncident(
      {
        assessmentId: String(Id),
        quizId: String(quizId),
        studentId: String(currentUser.student),
        title: titleRef.current,
        reason,
        context,
      },
      options
    ).catch((error) => {
      console.error("Failed to save quiz integrity incident:", error);
    });
  };

  const requireQuizFullscreen = (reason: string, context: QuizExamIncidentContext) => {
    if (!isStudent || quizFinishedRef.current) return;

    if (!isDocumentFullscreenActive()) {
      setFullscreenPromptOpen(true);
      recordIntegrityIncident(reason, context);
    } else {
      setFullscreenPromptOpen(false);
    }
  };

  const returnToFullscreen = async () => {
    const enteredFullscreen = await requestDocumentFullscreenFromGesture();
    if (enteredFullscreen) {
      setFullscreenPromptOpen(false);
      messageApi.success("Fullscreen restored. Continue your quiz.");
    } else {
      messageApi.warning("Please allow fullscreen to continue the quiz.");
    }
  };

  useEffect(() => {
    if (!isStudent || !quizData || !currentUser?.student) return;

    const handleFullscreenChange = () => {
      requireQuizFullscreen("Student left fullscreen during quiz", "fullscreen");
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !quizFinishedRef.current) {
        recordIntegrityIncident("Student switched tab or minimized the quiz", "screen", {
          keepalive: true,
        });
      }
    };

    const handleWindowBlur = () => {
      if (!quizFinishedRef.current) {
        recordIntegrityIncident("Quiz window lost focus", "screen", {
          keepalive: true,
        });
      }
    };

    const handlePageHide = () => {
      if (!quizFinishedRef.current) {
        recordIntegrityIncident("Student tried to leave or close the quiz", "leave", {
          keepalive: true,
        });
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (quizFinishedRef.current) return;
      recordIntegrityIncident("Student tried to refresh or close the quiz", "leave", {
        keepalive: true,
      });
      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      if (quizFinishedRef.current) return;
      recordIntegrityIncident("Student tried to use browser back during the quiz", "leave");
      window.history.pushState(null, "", window.location.href);
      setFullscreenPromptOpen(true);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (quizFinishedRef.current) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      event.preventDefault();
      event.stopPropagation();
      recordIntegrityIncident("Student tried to navigate away during the quiz", "leave");
      setFullscreenPromptOpen(true);
    };

    const initialCheck = window.setTimeout(() => {
      requireQuizFullscreen("Quiz opened outside fullscreen", "fullscreen");
    }, 700);

    window.history.pushState(null, "", window.location.href);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearTimeout(initialCheck);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isStudent, quizData, currentUser?.student, quizId, Id]);

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

    if (selfAssessmentMark === null || selfAssessmentMark === undefined) {
      setSelfAssessmentTouched(true);
      messageApi.error("Self Assessment Mark is required before submitting.");
      return;
    }

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
          selfAssessmentMark: selfAssessmentMark,
          submittedAt: new Date().toISOString(),
        })
      );

      const res = await submitTaskQuizByStudent(
        quizData.id,
        currentUser.student,
        Id,
        formattedAnswers,
        "task",
        undefined,
        selfAssessmentMark ?? undefined
      );

      // ✅ check if already submitted
      if (res?.status === 409) {
        quizFinishedRef.current = true;
        setFullscreenPromptOpen(false);
        await exitDocumentFullscreenIfActive();
        messageApi.warning(
          res.message || "You have already submitted this quiz."
        );
        return; // stop further execution
      }

      messageApi.success("Quiz submitted successfully!");
      quizFinishedRef.current = true;
      setFullscreenPromptOpen(false);
      await exitDocumentFullscreenIfActive();
      router.push(`${quizId}/quiz-result`);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        quizFinishedRef.current = true;
        setFullscreenPromptOpen(false);
        await exitDocumentFullscreenIfActive();
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
      <Modal
        open={isStudent && fullscreenPromptOpen && !quizFinishedRef.current}
        title="Stay in fullscreen to continue"
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Button
            key="fullscreen"
            type="primary"
            onClick={() => void returnToFullscreen()}
            className="!bg-primary !border-primary"
          >
            Return to fullscreen
          </Button>,
        ]}
      >
        <p className="text-gray-700">
          This quiz is protected. Leaving fullscreen, switching tabs, or moving away
          from the quiz is recorded for your teacher.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          You can exit fullscreen normally after you submit your answers.
        </p>
      </Modal>
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
                <Link href={`/dashboard/students/assignments/${Id}`}>
                  Tasks
                </Link>
              ),
            },
            {
              title: <span>Quiz</span>,
            },
          ]}
          className="!mb-6"
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
            {isStudent && fullscreenWarningCount > 0 && (
              <Alert
                type="warning"
                showIcon
                message="Quiz integrity warning"
                description={`Fullscreen/tab-change attempts recorded: ${fullscreenWarningCount}. Your teacher can review these attempts.`}
              />
            )}

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
                        value={answers[question.id] || ""}
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
                        value={answers[question.id] || ""}
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
                              checked={answers[question.id] === option.id}
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
                        value={Array.isArray(answers[question.id])
                          ? question.options
                              .filter((o) => (answers[question.id] as number[]).includes(o.id))
                              .map((o) => o.option_text)
                          : []}
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
                        value={answers[question.id]
                          ? question.options.find((o) => o.id === answers[question.id])?.option_text
                          : undefined}
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
                        value={answers[question.id] === true ? "true" : answers[question.id] === false ? "false" : undefined}
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
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>
                  Self Assessment Mark
                  {quizData?.quiz_queston && totalSelfAssessmentMarks > 0 && (
                    <span className="text-gray-400 font-normal ml-1">
                      (out of {totalSelfAssessmentMarks})
                    </span>
                  )}
                </label>
                <InputNumber
                  min={0}
                  max={totalSelfAssessmentMarks || undefined}
                  value={selfAssessmentMark ?? undefined}
                  status={selfAssessmentTouched && selfAssessmentMark == null ? "error" : undefined}
                  onChange={(val) => {
                    setSelfAssessmentMark(val);
                    setSelfAssessmentTouched(true);
                  }}
                  placeholder="Enter your self mark"
                  className="w-40"
                />
                {selfAssessmentTouched && selfAssessmentMark == null && (
                  <p className="mt-1 text-xs text-red-600">
                    Self Assessment Mark is required.
                  </p>
                )}
              </div>
              <div className="text-right">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
