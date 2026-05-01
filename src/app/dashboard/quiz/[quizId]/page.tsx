"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, X, Edit, GripVertical } from "lucide-react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
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
  InputNumber,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  addQuizQuestion,
  deleteQuizQuestion,
  fetchQuizQuestions,
  reorderQuizQuestions,
  updateQuizQuestion,
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
  correct_answer: number | string | null;
  options: Option[];
  marks: number;
  position?: number | null;
}

interface Quiz {
  id: number;
  name: string;
  quiz_queston: QuizQuestion[];
}

interface QuestionPayload {
  question_text: string;
  type: string;
  correct_answer: number | number[] | null;
  marks: number;
  options?: string[];
}

interface ImportedQuestionPayload extends QuestionPayload {
  needsReview?: boolean;
  reviewNote?: string | null;
  sourceNumber?: number | null;
}

type ComposerMode = "manual" | "paste" | "upload";

const quizTypeLabels: Record<string, string> = {
  short_answer: "Short Answer",
  paragraph: "Full Assessment",
  multiple_choice: "Multiple Choice",
  check_boxes: "Checkboxes",
  drop_down: "Dropdown",
  true_false: "True/False",
};

const quizTypeOptions = [
  { value: "short_answer", label: "Short Answer" },
  { value: "paragraph", label: "Full Assessment" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "check_boxes", label: "Checkboxes" },
  { value: "drop_down", label: "Dropdown" },
  { value: "true_false", label: "True/False" },
];

const questionTypeAliases: Record<string, string> = {
  shortanswer: "short_answer",
  short_answer: "short_answer",
  shortanswerquestion: "short_answer",
  paragraph: "paragraph",
  assessment: "paragraph",
  fullassessment: "paragraph",
  full_assessment: "paragraph",
  essay: "paragraph",
  written: "paragraph",
  multiplechoice: "multiple_choice",
  multiple_choice: "multiple_choice",
  choice: "multiple_choice",
  checkbox: "check_boxes",
  checkboxes: "check_boxes",
  check_boxes: "check_boxes",
  multipleanswers: "check_boxes",
  dropdown: "drop_down",
  drop_down: "drop_down",
  droplist: "drop_down",
  truefalse: "true_false",
  true_false: "true_false",
};

const normalizeQuestionType = (rawType?: string | null): string | null => {
  if (!rawType) return null;
  const normalized = rawType.toLowerCase().replace(/[^a-z]/g, "");
  return questionTypeAliases[normalized] ?? null;
};

const parseQuestionHeader = (line: string) => {
  let working = String(line ?? "").trim();
  let marks = 1;
  let explicitType: string | null = null;

  const marksMatch = working.match(/\|\s*(\d+(?:\.\d+)?)\s*$/);
  const parenthesizedMarksMatch = working.match(/\(\s*(\d+(?:\.\d+)?)\s*marks?\s*\)\s*$/i);

  if (marksMatch) {
    marks = Math.max(1, Number(marksMatch[1]));
    working = working.slice(0, marksMatch.index).trim();
  } else if (parenthesizedMarksMatch) {
    marks = Math.max(1, Number(parenthesizedMarksMatch[1]));
    working = working.slice(0, parenthesizedMarksMatch.index).trim();
  }

  const typeMatch = working.match(/::\s*([a-zA-Z _-]+)\s*$/);
  if (typeMatch) {
    explicitType = normalizeQuestionType(typeMatch[1]);
    if (!explicitType) {
      throw new Error(`Unsupported question type \"${typeMatch[1].trim()}\".`);
    }
    working = working.slice(0, typeMatch.index).trim();
  }

  if (!working) {
    throw new Error("Question text is missing.");
  }

  return {
    questionText: working,
    marks,
    explicitType,
  };
};

const parseOptionLine = (line: string) => {
  let working = String(line ?? "").trim();
  let isCorrect = false;

  if (/^(\*|\[x\]|✅)\s*/i.test(working)) {
    isCorrect = true;
    working = working.replace(/^(\*|\[x\]|✅)\s*/i, "");
  } else {
    working = working.replace(/^\[\s\]\s*/i, "");
  }

  working = working.replace(/^[-•]\s*/, "");
  working = working.replace(/^([A-Z]|\d+)[\).:-]\s*/i, "");

  const text = working.trim();
  if (!text) {
    throw new Error("An option is missing its text.");
  }

  return { text, isCorrect };
};

const isTrueFalseOptions = (options: string[]) => {
  if (options.length !== 2) return false;
  const normalized = options.map((option) => option.trim().toLowerCase()).sort();
  return normalized[0] === "false" && normalized[1] === "true";
};

const normalizeTrueFalseAnswer = (value: number | string | null | undefined) => {
  if (value == null || value === "") {
    return null;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  return numericValue === 1 ? 1 : 0;
};

const parseBulkQuestions = (rawText: string): QuestionPayload[] => {
  const blocks = String(rawText ?? "")
    .split(/\r?\n\s*\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    throw new Error("Paste at least one question block.");
  }

  return blocks.map((block, blockIndex) => {
    try {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const header = parseQuestionHeader(lines[0]);
      const optionLines = lines.slice(1);

      if (!optionLines.length) {
        const textType = header.explicitType ?? "short_answer";
        if (!["short_answer", "paragraph"].includes(textType)) {
          throw new Error("This question type needs answer options.");
        }

        return {
          question_text: header.questionText,
          type: textType,
          correct_answer: null,
          marks: header.marks,
        };
      }

      const parsedOptions = optionLines.map(parseOptionLine);
      const options = parsedOptions.map((option) => option.text);
      const correctIndexes = parsedOptions.reduce<number[]>((indexes, option, index) => {
        if (option.isCorrect) indexes.push(index);
        return indexes;
      }, []);

      if (!correctIndexes.length) {
        throw new Error("Mark the correct answer with * at the start of the option line.");
      }

      if (header.explicitType === "short_answer" || header.explicitType === "paragraph") {
        throw new Error("Text questions should not include option lines.");
      }

      if (header.explicitType === "true_false" || isTrueFalseOptions(options)) {
        const truthySet = new Set(options.map((option) => option.trim().toLowerCase()));
        if (!(truthySet.has("true") && truthySet.has("false"))) {
          throw new Error("True/False questions must include True and False options.");
        }
        if (correctIndexes.length !== 1) {
          throw new Error("True/False questions must have exactly one correct answer.");
        }

        const correctOption = options[correctIndexes[0]].trim().toLowerCase();

        return {
          question_text: header.questionText,
          type: "true_false",
          correct_answer: correctOption === "true" ? 1 : 0,
          marks: header.marks,
          options: ["True", "False"],
        };
      }

      const inferredType = header.explicitType ?? (correctIndexes.length > 1 ? "check_boxes" : "multiple_choice");

      if (["multiple_choice", "drop_down"].includes(inferredType) && correctIndexes.length !== 1) {
        throw new Error("Single-answer questions must have exactly one correct option.");
      }

      if (inferredType === "check_boxes") {
        return {
          question_text: header.questionText,
          type: "check_boxes",
          correct_answer: correctIndexes,
          marks: header.marks,
          options,
        };
      }

      return {
        question_text: header.questionText,
        type: inferredType,
        correct_answer: correctIndexes[0],
        marks: header.marks,
        options,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Could not parse this block.";
      throw new Error(`Question ${blockIndex + 1}: ${reason}`);
    }
  });
};

export default function QuranQuizPage() {
  const { quizId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const numericQuizId = Number(quizId);
  const [quizForm] = Form.useForm();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [composerMode, setComposerMode] = useState<ComposerMode>("manual");
  const [quizType, setQuizType] = useState<string>("short_answer");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [orderedQuestions, setOrderedQuestions] = useState<QuizQuestion[]>([]);
  const [reorderingQuestions, setReorderingQuestions] = useState(false);
  const [optionCount, setOptionCount] = useState(3);
  const [bulkPasteText, setBulkPasteText] = useState("");
  const [savingBulk, setSavingBulk] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadingAssessment, setUploadingAssessment] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<ImportedQuestionPayload[]>([]);
  const [generatedWarnings, setGeneratedWarnings] = useState<string[]>([]);
  const [savingGenerated, setSavingGenerated] = useState(false);
  const [generatedSourceName, setGeneratedSourceName] = useState("");

  const [deleteState, setDeleteState] = useState<{
    visible: boolean;
    questionId: number | null;
    loading: boolean;
  }>({
    visible: false,
    questionId: null,
    loading: false,
  });
  const [editState, setEditState] = useState<{
    isEditing: boolean;
    questionId: number | null;
  }>({
    isEditing: false,
    questionId: null,
  });

  const [messageApi, contextHolder] = message.useMessage();
  const composerValues = Form.useWatch([], quizForm);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";

  const scrollComposerIntoView = () => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const resetUploadState = () => {
    setUploadFile(null);
    setGeneratedQuestions([]);
    setGeneratedWarnings([]);
    setGeneratedSourceName("");
  };

  const resetComposer = () => {
    quizForm.resetFields();
    quizForm.setFieldsValue({
      type: "short_answer",
      marks: 1,
      correctAnswer: null,
    });
    setQuizType("short_answer");
    setOptionCount(3);
    setEditState({ isEditing: false, questionId: null });
  };

  const openManualComposer = () => {
    resetUploadState();
    resetComposer();
    setComposerMode("manual");
    setShowAddQuestion(true);
    scrollComposerIntoView();
  };

  const openPasteComposer = () => {
    resetUploadState();
    resetComposer();
    setComposerMode("paste");
    setShowAddQuestion(true);
    scrollComposerIntoView();
  };

  const openUploadComposer = () => {
    resetComposer();
    setBulkPasteText("");
    resetUploadState();
    setComposerMode("upload");
    setShowAddQuestion(true);
    scrollComposerIntoView();
  };

  const closeComposer = () => {
    setShowAddQuestion(false);
    setBulkPasteText("");
    resetUploadState();
    resetComposer();
  };

  const removeOptionAt = (removeIndex: number) => {
    if (optionCount <= 2) return;

    const values = quizForm.getFieldsValue();
    const nextValues: Record<string, any> = {};

    let writeIndex = 1;
    for (let readIndex = 1; readIndex <= optionCount; readIndex++) {
      if (readIndex === removeIndex + 1) continue;
      nextValues[`option${writeIndex}`] = values[`option${readIndex}`];
      writeIndex += 1;
    }

    if (Array.isArray(values.correctAnswer)) {
      nextValues.correctAnswer = values.correctAnswer
        .filter((value: number) => value !== removeIndex)
        .map((value: number) => (value > removeIndex ? value - 1 : value));
    } else if (typeof values.correctAnswer === "number") {
      if (values.correctAnswer === removeIndex) {
        nextValues.correctAnswer = null;
      } else {
        nextValues.correctAnswer = values.correctAnswer > removeIndex ? values.correctAnswer - 1 : values.correctAnswer;
      }
    }

    quizForm.setFieldsValue(nextValues);
    setOptionCount((prev) => Math.max(2, prev - 1));
  };

  const buildQuestionPayload = (values: Record<string, any>): QuestionPayload => {
    let options: string[] = [];
    let correctAnswer: number | number[] | null = null;

    if (["multiple_choice", "check_boxes", "drop_down"].includes(values.type)) {
      for (let i = 1; i <= optionCount; i++) {
        if (values[`option${i}`]) {
          options.push(String(values[`option${i}`]).trim());
        }
      }
      correctAnswer = values.correctAnswer;
    } else if (values.type === "true_false") {
      options = ["True", "False"];
      correctAnswer = values.correctAnswer;
    }

    return {
      question_text: String(values.question_text ?? "").trim(),
      type: values.type,
      correct_answer: correctAnswer,
      marks: Math.max(1, Number(values.marks ?? 1)),
      options: options.length > 0 ? options : undefined,
    };
  };

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizQuestions(numericQuizId);
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

  useEffect(() => {
    if (!quizData) {
      setOrderedQuestions([]);
      return;
    }

    setOrderedQuestions(quizData.quiz_queston ?? []);
  }, [quizData]);

  const handleQuestionDragEnd = async (result: DropResult) => {
    if (!canUpload || reorderingQuestions) {
      return;
    }

    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    const previousQuestions = orderedQuestions;
    const nextQuestions = [...orderedQuestions];
    const [movedQuestion] = nextQuestions.splice(source.index, 1);

    if (!movedQuestion) {
      return;
    }

    nextQuestions.splice(destination.index, 0, movedQuestion);
    setOrderedQuestions(nextQuestions);
    setReorderingQuestions(true);

    try {
      const updatedQuiz = await reorderQuizQuestions(
        numericQuizId,
        nextQuestions.map((question) => question.id)
      );
      setQuizData(updatedQuiz);
    } catch (error) {
      setOrderedQuestions(previousQuestions);
      messageApi.error("Failed to save question order");
      console.error("Error reordering questions:", error);
    } finally {
      setReorderingQuestions(false);
    }
  };

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

  const addOption = () => {
    setOptionCount((prev) => prev + 1);
  };

  const removeOption = () => {
    removeOptionAt(optionCount - 1);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    resetUploadState();
    setComposerMode("manual");
    setShowAddQuestion(false);
    setEditState({ isEditing: true, questionId: question.id });
    setQuizType(question.type);

    // pre-fill options if type has them
    if (
      ["multiple_choice", "check_boxes", "drop_down"].includes(question.type)
    ) {
      setOptionCount(question.options.length);
      const optionValues: Record<string, string> = {};
      question.options.forEach((opt, i) => {
        optionValues[`option${i + 1}`] = opt.option_text;
      });

      quizForm.setFieldsValue({
        type: question.type,
        question_text: question.question_text,
        marks: question.marks,
        ...optionValues,
        correctAnswer:
          question.type === "check_boxes"
            ? question.options.reduce<number[]>((indexes, option, optionIndex) => {
                if (option.is_correct === 1) {
                  indexes.push(optionIndex);
                }
                return indexes;
              }, [])
            : question.options.find((opt) => opt.is_correct === 1)
            ? question.options.findIndex((opt) => opt.is_correct === 1)
            : null,
      });
    } else if (question.type === "true_false") {
      quizForm.setFieldsValue({
        type: question.type,
        question_text: question.question_text,
        marks: question.marks,
        correctAnswer: normalizeTrueFalseAnswer(question.correct_answer),
      });
    } else {
      quizForm.setFieldsValue({
        type: question.type,
        question_text: question.question_text,
        marks: question.marks,
        correctAnswer: question.correct_answer,
      });
    }

  };

  const handleSaveQuestion = async () => {
    try {
      const isEditingQuestion = editState.isEditing && Boolean(editState.questionId);
      await quizForm.validateFields();
      const values = quizForm.getFieldsValue();
      const questionData = buildQuestionPayload(values);

      if (isEditingQuestion && editState.questionId) {
        await updateQuizQuestion(editState.questionId, numericQuizId, questionData);
        messageApi.success("Question updated successfully");
      } else {
        await addQuizQuestion(numericQuizId, questionData);
        messageApi.success("Question added successfully");
      }

      resetComposer();
      if (isEditingQuestion) {
        setShowAddQuestion(false);
      } else {
        setShowAddQuestion(true);
        setComposerMode("manual");
      }
      await loadQuizQuestions();
    } catch (error) {
      messageApi.error("Failed to save question");
      console.error("Error saving question:", error);
    }
  };

  const renderManualQuestionForm = (inlineEditing = false) => (
    <Form form={quizForm} layout="vertical" initialValues={{ type: "short_answer", marks: 1 }}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
        <Form.Item
          name="question_text"
          label="Question"
          rules={[{ required: true, message: "Please enter the question" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Type your question here"
            className="rounded-xl"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
          <Form.Item
            name="type"
            label="Question Type"
            rules={[{ required: true, message: "Please select a question type" }]}
          >
            <Select onChange={(value) => setQuizType(value)}>
              {quizTypeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="marks"
            label="Marks"
            rules={[{ required: true, message: "Please enter marks for this question" }]}
          >
            <InputNumber min={1} className="!w-full" />
          </Form.Item>
        </div>
      </div>

      {quizType === "true_false" && (
        <Form.Item
          name="correctAnswer"
          label="Correct Answer"
          rules={[{ required: true, message: "Please specify the correct answer" }]}
        >
          <Radio.Group>
            <Radio value={1}>True</Radio>
            <Radio value={0}>False</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      {["multiple_choice", "check_boxes", "drop_down"].includes(quizType) && (
        <>
          <Divider orientation="left">Options</Divider>

          <div className="space-y-3">
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
                    index >= 2 ? (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<Trash2 size={14} />}
                        onClick={() => removeOptionAt(index)}
                        className="opacity-70 hover:opacity-100"
                      />
                    ) : null
                  }
                />
              </Form.Item>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap justify-start gap-3">
            <Button type="dashed" onClick={addOption} icon={<Plus size={14} />}>
              Add Option
            </Button>
            {optionCount > 2 && (
              <Button type="dashed" danger onClick={removeOption} icon={<Trash2 size={14} />}>
                Remove Last Option
              </Button>
            )}
          </div>

          <Form.Item
            name="correctAnswer"
            label="Correct Answer"
            rules={[{ required: true, message: "Please specify the correct answer" }]}
            className="mt-4"
          >
            {quizType === "check_boxes" ? (
              <Checkbox.Group>
                <Space direction="vertical">
                  {Array.from({ length: optionCount }).map((_, index) => (
                    <Checkbox key={index} value={index}>
                      {composerValues?.[`option${index + 1}`] || `Option ${index + 1}`}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            ) : (
              <Radio.Group>
                <Space direction="vertical">
                  {Array.from({ length: optionCount }).map((_, index) => (
                    <Radio key={index} value={index}>
                      {composerValues?.[`option${index + 1}`] || `Option ${index + 1}`}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            )}
          </Form.Item>
        </>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        {editState.isEditing && <Button onClick={resetComposer}>Cancel Edit</Button>}
        {!inlineEditing && <Button onClick={closeComposer}>Close Builder</Button>}
        <Button
          type="primary"
          onClick={handleSaveQuestion}
          className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
        >
          {editState.isEditing ? "Update Question" : "Save Question"}
        </Button>
      </div>
    </Form>
  );

  const handleBulkAddQuestions = async () => {
    try {
      const parsedQuestions = parseBulkQuestions(bulkPasteText);
      setSavingBulk(true);

      for (const question of parsedQuestions) {
        await addQuizQuestion(numericQuizId, question);
      }

      setBulkPasteText("");
      messageApi.success(`${parsedQuestions.length} questions added successfully`);
      await loadQuizQuestions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to import pasted questions";
      messageApi.error(errorMessage);
      console.error("Error importing pasted questions:", error);
    } finally {
      setSavingBulk(false);
    }
  };

  const handleUploadAssessment = async () => {
    if (!uploadFile) {
      messageApi.warning("Choose a Word, PDF, or text file first.");
      return;
    }

    try {
      setUploadingAssessment(true);
      setGeneratedQuestions([]);
      setGeneratedWarnings([]);
      setGeneratedSourceName(uploadFile.name);

      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await fetch("/api/quiz/import-assessment", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to process the assessment file.");
      }

      const questions = Array.isArray(payload?.questions)
        ? (payload.questions as ImportedQuestionPayload[])
        : [];

      if (!questions.length) {
        throw new Error("No questions were generated from this file.");
      }

      setGeneratedQuestions(questions);
      setGeneratedWarnings(
        Array.isArray(payload?.warnings)
          ? payload.warnings.filter((warning: unknown) => typeof warning === "string" && warning.trim())
          : []
      );
      setGeneratedSourceName(String(payload?.fileName || uploadFile.name));
      messageApi.success(`${questions.length} questions generated from ${uploadFile.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process the assessment file.";
      messageApi.error(errorMessage);
      console.error("Error generating quiz from file:", error);
    } finally {
      setUploadingAssessment(false);
    }
  };

  const handleAddGeneratedQuestions = async () => {
    if (!generatedQuestions.length) {
      messageApi.warning("Generate questions from a file first.");
      return;
    }

    try {
      setSavingGenerated(true);

      let addedCount = 0;
      let failedCount = 0;

      for (const question of generatedQuestions) {
        try {
          await addQuizQuestion(numericQuizId, question);
          addedCount += 1;
        } catch (error) {
          failedCount += 1;
          console.error("Error adding generated question:", error, question);
        }
      }

      if (addedCount > 0) {
        const reviewCount = generatedQuestions.filter((question) => question.needsReview).length;
        messageApi.success(
          `${addedCount} question${addedCount === 1 ? "" : "s"} added successfully${
            reviewCount > 0 ? `. ${reviewCount} need answer review.` : ""
          }`
        );
        await loadQuizQuestions();
      }

      if (failedCount > 0) {
        messageApi.warning(`${failedCount} generated question${failedCount === 1 ? "" : "s"} could not be added.`);
      }

      if (failedCount === 0) {
        resetUploadState();
      }
    } finally {
      setSavingGenerated(false);
    }
  };

  const getImportedCorrectAnswerText = (question: ImportedQuestionPayload) => {
    if (question.correct_answer == null) {
      return "Needs review";
    }

    if (question.type === "true_false") {
      return normalizeTrueFalseAnswer(question.correct_answer as number | string | null) === 1 ? "True" : "False";
    }

    if (question.type === "check_boxes" && Array.isArray(question.correct_answer) && question.options?.length) {
      return question.correct_answer
        .map((index) => question.options?.[index])
        .filter(Boolean)
        .join(", ");
    }

    if (typeof question.correct_answer === "number" && question.options?.length) {
      return question.options[question.correct_answer] || "Needs review";
    }

    return "Needs review";
  };

  const getCorrectAnswerText = (question: QuizQuestion) => {
    if (question.type === "true_false") {
      return normalizeTrueFalseAnswer(question.correct_answer) === 1 ? "True" : "False";
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
          <div className="p-6 border-b border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {quizData?.name || "Quiz"}
              </h1>
              {canUpload && (
                <p className="mt-1 text-sm text-gray-500">
                  Build questions inline or paste a whole question bank in one go.
                </p>
              )}
            </div>
            {canUpload && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type={showAddQuestion && composerMode === "manual" ? "primary" : "default"}
                  onClick={openManualComposer}
                  icon={<Plus size={16} />}
                  className={showAddQuestion && composerMode === "manual" ? "!bg-primary !border-primary hover:!bg-primary hover:!border-primary" : ""}
                >
                  Question Builder
                </Button>
                <Button
                  type={showAddQuestion && composerMode === "paste" ? "primary" : "default"}
                  onClick={openPasteComposer}
                  className={showAddQuestion && composerMode === "paste" ? "!bg-primary !border-primary hover:!bg-primary hover:!border-primary" : ""}
                >
                  Paste Questions
                </Button>
                <Button
                  type={showAddQuestion && composerMode === "upload" ? "primary" : "default"}
                  onClick={openUploadComposer}
                  className={showAddQuestion && composerMode === "upload" ? "!bg-primary !border-primary hover:!bg-primary hover:!border-primary" : ""}
                >
                  Upload Assessment
                </Button>
              </div>
            )}
          </div>

          {canUpload && showAddQuestion && (
            <div ref={composerRef} className="border-b border-gray-200 bg-slate-50/80 p-6">
              <div className="rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-50/70 via-white to-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {composerMode === "paste"
                        ? "Paste a whole question bank"
                        : composerMode === "upload"
                        ? "Upload an assessment file"
                        : editState.isEditing
                        ? "Edit question"
                        : "Question builder"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {composerMode === "paste"
                        ? "Paste multiple questions, answers, and correct options at once."
                        : composerMode === "upload"
                        ? "Upload a Word or PDF assessment and generate quiz questions from it."
                        : "Add questions in the page like a form builder instead of opening a modal every time."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type={composerMode === "manual" ? "primary" : "default"}
                      onClick={() => setComposerMode("manual")}
                      className={composerMode === "manual" ? "!bg-primary !border-primary hover:!bg-primary hover:!border-primary" : ""}
                    >
                      Manual Builder
                    </Button>
                    <Button
                      type={composerMode === "paste" ? "primary" : "default"}
                      onClick={() => setComposerMode("paste")}
                      className={composerMode === "paste" ? "!bg-primary !border-primary hover:!bg-primary hover:!border-primary" : ""}
                    >
                      Paste Questions
                    </Button>
                    <Button
                      type={composerMode === "upload" ? "primary" : "default"}
                      onClick={() => setComposerMode("upload")}
                      className={composerMode === "upload" ? "!bg-primary !border-primary hover:!bg-primary hover:!border-primary" : ""}
                    >
                      Upload Assessment
                    </Button>
                    <Button icon={<X size={16} />} onClick={closeComposer} />
                  </div>
                </div>

                {composerMode === "paste" ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-dashed border-teal-200 bg-white/90 p-4 text-sm text-gray-600">
                      <p className="font-semibold text-gray-800">Paste format</p>
                      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`What is 2 + 2? | 1
* 4
3
5

Sky is blue :: true false | 3
* True
False

Select the planets :: checkboxes | 2
* Earth
* Mars
Moon

Explain how Tawakkul helps a Muslim in daily life :: assessment (4 marks)`}
                      </pre>
                      <p className="mt-3">
                        Use a blank line between questions. Start a correct answer with <strong>*</strong>. Add <strong>::type</strong> when you want a specific type such as <strong>checkboxes</strong>, <strong>dropdown</strong>, <strong>short answer</strong>, <strong>assessment</strong> for long answers, or <strong>true false</strong>. Add marks either as <strong>| 3</strong> or <strong>(3 marks)</strong>. True/false questions should only include <strong>True</strong> and <strong>False</strong> on the next lines, and long-answer questions should not include any options underneath.
                      </p>
                    </div>

                    <Input.TextArea
                      rows={14}
                      value={bulkPasteText}
                      onChange={(event) => setBulkPasteText(event.target.value)}
                      placeholder="Paste one or many questions here..."
                    />

                    <div className="flex flex-wrap justify-end gap-2">
                      <Button onClick={() => setBulkPasteText("")}>Clear</Button>
                      <Button
                        type="primary"
                        onClick={handleBulkAddQuestions}
                        loading={savingBulk}
                        className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
                      >
                        Add Pasted Questions
                      </Button>
                    </div>
                  </div>
                ) : composerMode === "upload" ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-dashed border-teal-200 bg-white/90 p-4 text-sm text-gray-600">
                      <p className="font-semibold text-gray-800">Upload format tips</p>
                      <p className="mt-2">
                        Upload a <strong>.docx</strong>, <strong>.pdf</strong>, or <strong>.txt</strong> assessment file. Best results come from files that use numbered questions such as <strong>1.</strong>, <strong>2.</strong>, and options like <strong>A)</strong>, <strong>B)</strong>, <strong>C)</strong>.
                      </p>
                      <p className="mt-2">
                        If your file includes answer lines such as <strong>Answer: B</strong>, <strong>Answer: True</strong>, or <strong>Answer: A, C</strong>, the generator can turn them into MCQ, MAQ, and True/False questions automatically. Questions without clear answers are imported as draft questions that need review.
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white/90 p-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Assessment file
                      </label>
                      <input
                        type="file"
                        accept=".doc,.docx,.pdf,.txt"
                        onChange={(event) => setUploadFile(event.target.files?.[0] || null)}
                        className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Legacy <strong>.doc</strong> files should be saved as <strong>.docx</strong> first for best results.
                      </p>
                      {uploadFile && (
                        <p className="mt-3 text-sm text-gray-600">
                          Selected file: <strong>{uploadFile.name}</strong>
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <Button
                          onClick={() => {
                            setUploadFile(null);
                            resetUploadState();
                          }}
                          disabled={uploadingAssessment || savingGenerated}
                        >
                          Clear
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleUploadAssessment}
                          loading={uploadingAssessment}
                          className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
                        >
                          Generate Questions
                        </Button>
                      </div>
                    </div>

                    {generatedWarnings.length > 0 && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-semibold">Review notes</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {generatedWarnings.map((warning, index) => (
                            <li key={`${warning}-${index}`}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {generatedQuestions.length > 0 && (
                      <div className="space-y-4 rounded-xl border border-gray-200 bg-white/90 p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              Generated quiz draft{generatedSourceName ? ` from ${generatedSourceName}` : ""}
                            </p>
                            <p className="text-sm text-gray-500">
                              Review the generated questions below, then add them to this quiz.
                            </p>
                          </div>
                          <span className="inline-flex w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                            {generatedQuestions.length} question{generatedQuestions.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                          {generatedQuestions.map((question, index) => (
                            <div key={`${question.question_text}-${index}`} className="rounded-xl border border-gray-200 bg-slate-50/80 p-4">
                              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {question.sourceNumber ?? index + 1}. {question.question_text}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Type: {quizTypeLabels[question.type] || question.type} | Marks: {question.marks}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {question.needsReview && (
                                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                      Needs Review
                                    </span>
                                  )}
                                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                    Correct: {getImportedCorrectAnswerText(question)}
                                  </span>
                                </div>
                              </div>

                              {question.options?.length ? (
                                <div className="mt-3 space-y-2 text-sm text-gray-700">
                                  {question.options.map((option, optionIndex) => {
                                    const isCorrect = Array.isArray(question.correct_answer)
                                      ? question.correct_answer.includes(optionIndex)
                                      : question.correct_answer === optionIndex;

                                    return (
                                      <div
                                        key={`${option}-${optionIndex}`}
                                        className={`rounded-lg border px-3 py-2 ${
                                          isCorrect
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                            : "border-gray-200 bg-white"
                                        }`}
                                      >
                                        {option}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : null}

                              {question.reviewNote && (
                                <p className="mt-3 text-xs text-amber-700">{question.reviewNote}</p>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                          <Button onClick={resetUploadState} disabled={savingGenerated}>Clear Draft</Button>
                          <Button
                            type="primary"
                            onClick={handleAddGeneratedQuestions}
                            loading={savingGenerated}
                            className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
                          >
                            Add Generated Questions
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  renderManualQuestionForm()
                )}
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {!orderedQuestions.length ? (
              <div className="text-center text-gray-500 py-8">
                No questions available.
              </div>
            ) : (
              <DragDropContext onDragEnd={handleQuestionDragEnd}>
                <Droppable droppableId={`quiz-questions-${numericQuizId}`}>
                  {(dropProvided) => (
                    <div
                      ref={dropProvided.innerRef}
                      {...dropProvided.droppableProps}
                      className="space-y-6"
                    >
                      {orderedQuestions.map((question, index) => {
                        const isEditingThisQuestion =
                          editState.isEditing && editState.questionId === question.id;

                        return (
                          <Draggable
                            key={question.id}
                            draggableId={String(question.id)}
                            index={index}
                            isDragDisabled={!canUpload || isEditingThisQuestion || reorderingQuestions}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition ${
                                  dragSnapshot.isDragging ? "ring-2 ring-teal-100 shadow-md" : ""
                                }`}
                              >
                                  {isEditingThisQuestion ? (
                                    <>
                                      <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-base font-semibold text-gray-900">Edit question</p>
                                          <p className="text-sm text-gray-500">
                                            Update this question here without moving back to the top builder.
                                          </p>
                                        </div>
                                      </div>
                                      {renderManualQuestionForm(true)}
                                    </>
                                  ) : (
                                    <>
                                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 flex-1 break-words">
                                          <span className="font-medium text-gray-700">Q:</span>{" "}
                                          {question.question_text}
                                        </div>
                                        {canUpload && (
                                          <div className="flex shrink-0 items-start self-end gap-2 sm:self-start">
                                            <button
                                              type="button"
                                              aria-label="Drag to reorder question"
                                              disabled={reorderingQuestions}
                                              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-700 ${
                                                reorderingQuestions
                                                  ? "cursor-not-allowed opacity-50"
                                                  : "cursor-grab active:cursor-grabbing"
                                              }`}
                                              {...dragProvided.dragHandleProps}
                                            >
                                              <GripVertical size={16} />
                                            </button>
                                            <Button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditQuestion(question);
                                              }}
                                              size="small"
                                              icon={<Edit size={14} />}
                                            />
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
                                          </div>
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
                                            {question.options?.map((option) => (
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
                                                <Checkbox key={option.id} value={option.option_text}>
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

                                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                                        <span>
                                          Type: {quizTypeLabels[question.type] || question.type}
                                        </span>
                                        <span>Marks: {question.marks || "N/A"}</span>
                                      </div>
                                    </>
                                  )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
        centered
        destroyOnHidden
      >
        <p>Are you sure you want to delete this question?</p>
      </Modal>
    </div>
  );
}
