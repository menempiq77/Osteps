"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, X } from "lucide-react";
import {
  Button,
  Form,
  Divider,
  Input,
  Select,
  Checkbox,
  Space,
  Radio,
  message,
  Skeleton,
  Modal,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  addQuizQuestion,
  deleteQuizQuestion,
  fetchQuizQuestions,
} from "@/services/quizApi";

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
  const [quizForm] = Form.useForm();
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [quizType, setQuizType] = useState<string>("short_answer");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [optionCount, setOptionCount] = useState(3);

  const [deleteState, setDeleteState] = useState<{
    visible: boolean;
    questionId: number | null;
    loading: boolean;
  }>({
    visible: false,
    questionId: null,
    loading: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizQuestions(Number(quizId));
      setQuizData(response);
    } catch (error) {
      messageApi.error("Failed to load quiz questions");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadQuizQuestions();
  }, [quizId]);

  const showDeleteModal = (questionId: number) => {
    setDeleteState({
      visible: true,
      questionId,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    const currentQuestionId = deleteState.questionId;
    if (!currentQuestionId) {
      messageApi.warning("No question selected for deletion");
      return;
    }

    try {
      setDeleteState((prev) => ({ ...prev, loading: true }));
      await deleteQuizQuestion(currentQuestionId);

      setQuizData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          quiz_queston: prev.quiz_queston.filter(
            (q) => q.id !== currentQuestionId
          ),
        };
      });

      messageApi.success("Question deleted successfully");
    } catch (error) {
      messageApi.error("Failed to delete question");
      console.error("Error deleting question:", error);
    } finally {
      setDeleteState({
        visible: false,
        questionId: null,
        loading: false,
      });
    }
  };

  const toggleAddQuestion = () => {
    setShowAddQuestion(!showAddQuestion);
    if (!showAddQuestion) {
      quizForm.resetFields();
      setQuizType("short_answer");
      setOptionCount(3);
    }
  };

  const addOption = () => {
    setOptionCount((prev) => prev + 1);
  };

  const removeOption = () => {
    if (optionCount > 1) {
      setOptionCount((prev) => prev - 1);
      const values = quizForm.getFieldsValue();
      delete values[`option${optionCount}`];
      quizForm.setFieldsValue(values);
    }
  };

  const handleAddQuestion = async () => {
    try {
      await quizForm.validateFields();
      const values = quizForm.getFieldsValue();

      let options: string[] = [];
      let correctAnswer: number | null = null;

      if (
        ["multiple_choice", "check_boxes", "drop_down"].includes(values.type)
      ) {
        for (let i = 1; i <= optionCount; i++) {
          if (values[`option${i}`]) {
            options.push(values[`option${i}`]);
          }
        }
        correctAnswer = values.correctAnswer;
      } else if (values.type === "true_false") {
        options = ["True", "False"];
        correctAnswer = values.correctAnswer ? 1 : 0;
      } else {
        correctAnswer = values.correctAnswer ? 1 : 0;
      }

      const questionData = {
        quiz_id: quizId,
        question_text: values.question_text,
        type: values.type,
        correct_answer: correctAnswer,
        marks: values.marks,
        options: options.length > 0 ? options : undefined,
      };

      const response = await addQuizQuestion(Number(quizId), questionData);

      setQuizData((prev) => {
        if (!prev) return null;
        const newQuestion = {
          ...response,
          options: response.options || [],
        };

        return {
          ...prev,
          quiz_queston: [...prev.quiz_queston, newQuestion],
        };
      });

      setShowAddQuestion(false);
      quizForm.resetFields();
      setOptionCount(3);
      await loadQuizQuestions();
      messageApi.success("Question added successfully");
    } catch (error) {
      messageApi.error("Failed to add question");
      console.error("Error adding question:", error);
    }
  };

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
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      {contextHolder}
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Quizzes
        </Button>
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
            {canUpload && (
              <Button
                type="primary"
                onClick={toggleAddQuestion}
                icon={showAddQuestion ? <X size={16} /> : <Plus size={16} />}
                loading={loading}
                className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
              >
                {showAddQuestion ? "Cancel" : "Add Question"}
              </Button>
            )}
          </div>

          {showAddQuestion && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <Form form={quizForm} layout="vertical">
                <Form.Item
                  name="type"
                  label="Question Type"
                  initialValue="short_answer"
                  rules={[
                    {
                      required: true,
                      message: "Please select a question type",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select question type"
                    onChange={(val) => setQuizType(val)}
                  >
                    <Select.Option value="short_answer">
                      Short Answer
                    </Select.Option>
                    <Select.Option value="paragraph">Paragraph</Select.Option>
                    <Select.Option value="multiple_choice">
                      Multiple Choice
                    </Select.Option>
                    <Select.Option value="check_boxes">
                      Checkboxes
                    </Select.Option>
                    <Select.Option value="drop_down">Dropdown</Select.Option>
                    <Select.Option value="true_false">True/False</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="question_text"
                  label="Question"
                  rules={[
                    { required: true, message: "Please enter the question" },
                  ]}
                >
                  <Input.TextArea rows={3} placeholder="Enter question" />
                </Form.Item>

                <Form.Item
                  name="marks"
                  label="Marks"
                  initialValue={1}
                  rules={[
                    {
                      required: true,
                      message: "Please enter marks for this question",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter marks for this question"
                  />
                </Form.Item>
                {quizType === "true_false" && (
                  <Form.Item
                    name="correctAnswer"
                    label="Correct Answer"
                    valuePropName="checked"
                    initialValue={true}
                    rules={[
                      {
                        required: true,
                        message: "Please specify the correct answer",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={1}>True</Radio>
                      <Radio value={0}>False</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}

                {["multiple_choice", "check_boxes", "drop_down"].includes(
                  quizType
                ) && (
                  <>
                    <Divider orientation="left">Options</Divider>

                    {Array.from({ length: optionCount }).map((_, index) => (
                      <Form.Item
                        key={index}
                        name={`option${index + 1}`}
                        label={`Option ${index + 1}`}
                        rules={[
                          {
                            required: index < 2,
                            message: `Option ${index + 1} is required`,
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter option ${index + 1}`}
                          suffix={
                            index >= 2 && (
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<Trash2 size={14} />}
                                onClick={() => {
                                  const values = quizForm.getFieldsValue();
                                  const updatedValues = {};
                                  let shiftIndex = 1;

                                  for (let i = 1; i <= optionCount; i++) {
                                    if (i !== index + 1) {
                                      updatedValues[`option${shiftIndex}`] =
                                        values[`option${i}`];
                                      shiftIndex++;
                                    }
                                  }

                                  quizForm.setFieldsValue(updatedValues);
                                  setOptionCount((prev) => prev - 1);
                                }}
                                className="opacity-70 hover:opacity-100"
                              />
                            )
                          }
                        />
                      </Form.Item>
                    ))}

                    <div className="flex justify-start gap-3 mt-2">
                      <Button
                        type="dashed"
                        onClick={addOption}
                        icon={<Plus size={14} />}
                      >
                        Add Option
                      </Button>
                      {optionCount > 2 && (
                        <Button
                          type="dashed"
                          danger
                          onClick={removeOption}
                          icon={<Trash2 size={14} />}
                        >
                          Remove Last Option
                        </Button>
                      )}
                    </div>

                    <Form.Item
                      name="correctAnswer"
                      label="Correct Answer"
                      rules={[
                        {
                          required: true,
                          message: "Please specify the correct answer",
                        },
                      ]}
                    >
                      {quizType === "multiple_choice" ||
                      quizType === "drop_down" ? (
                        <Radio.Group>
                          <Space direction="vertical">
                            {Array.from({ length: optionCount }).map(
                              (_, index) => (
                                <Radio key={index} value={index}>
                                  {quizForm.getFieldValue(
                                    `option${index + 1}`
                                  ) || `Option ${index + 1}`}
                                </Radio>
                              )
                            )}
                          </Space>
                        </Radio.Group>
                      ) : quizType === "check_boxes" ? (
                        <Checkbox.Group>
                          <Space direction="vertical">
                            {Array.from({ length: optionCount }).map(
                              (_, index) => (
                                <Checkbox key={index} value={index}>
                                  {quizForm.getFieldValue(
                                    `option${index + 1}`
                                  ) || `Option ${index + 1}`}
                                </Checkbox>
                              )
                            )}
                          </Space>
                        </Checkbox.Group>
                      ) : null}
                    </Form.Item>
                  </>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={toggleAddQuestion}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={handleAddQuestion}
                    className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
                  >
                    Add Question
                  </Button>
                </div>
              </Form>
            </div>
          )}

          <div className="p-6 space-y-6">
            {!quizData?.quiz_queston?.length ? (
              <div className="text-center text-gray-500 py-8">
                No questions available.
              </div>
            ) : (
              quizData?.quiz_queston?.map((question) => (
                <div
                  key={question?.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-700">Q:</span>{" "}
                      {question.question_text}
                    </div>
                    {canUpload && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          showDeleteModal(question.id);
                        }}
                        size="small"
                        danger
                        icon={<Trash2 size={14} />}
                        loading={
                          deleteState.loading &&
                          deleteState.questionId === question.id
                        }
                      />
                    )}
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

      <Modal
        title="Delete Question"
        open={deleteState.visible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteState((prev) => ({ ...prev, visible: false }))}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        confirmLoading={deleteState.loading}
      >
        <p>Are you sure you want to delete this question?</p>
      </Modal>
    </div>
  );
}
