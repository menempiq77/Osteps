"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  SendIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Modal,
  Input,
  Radio,
  Space,
  Form,
  Divider,
  Drawer,
  Select,
  Button,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

interface Period {
  id: number;
  name: string;
  description: string;
  status: {
    studied: boolean;
    recall: boolean;
  };
  type?: "period" | "quiz";
}

interface Quiz {
  id: string;
  type: "mcq" | "true_false" | "writing";
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
}

export default function SeerahTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [visiblePeriods, setVisiblePeriods] = useState(5);
  const [editingPeriod, setEditingPeriod] = useState<number | null>(null);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [newPeriodDescription, setNewPeriodDescription] = useState("");
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [newQuizName, setNewQuizName] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isQuizDrawerVisible, setIsQuizDrawerVisible] = useState(false);
  const [quizForm] = Form.useForm();
  const [quizType, setQuizType] = useState<"mcq" | "true_false" | "writing">(
    "mcq"
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";

  // Initialize with sample data
  useEffect(() => {
    const initialPeriods = [
      {
        id: 1,
        name: "Pre-Islamic Arabia",
        description: "The state of Arabia before Islam",
        status: { studied: false, recall: false },
        type: "period",
      },
      {
        id: 2,
        name: "Birth & Early Life",
        description: "The Prophet's birth and childhood",
        status: { studied: false, recall: false },
        type: "period",
      },
      {
        id: 3,
        name: "Prophethood Quiz",
        description: "Quiz about Prophet's life in Mecca and Medina",
        status: { studied: false, recall: false },
        type: "quiz",
      },
    ];

    const initialQuizzes = [
      {
        id: "1",
        type: "mcq",
        question: "What was the primary religion in pre-Islamic Arabia?",
        options: ["Christianity", "Judaism", "Polytheism", "Zoroastrianism"],
        correctAnswer: "Polytheism",
      },
      {
        id: "2",
        type: "true_false",
        question: "The Prophet Muhammad (PBUH) was born in Medina.",
        correctAnswer: "false",
      },
    ];

    setPeriods(initialPeriods);
    setQuizzes(initialQuizzes);
  }, []);

     const quizOptions = [
    { value: "quiz1", label: "Quiz 1" },
    { value: "quiz2", label: "Quiz 2" },
    { value: "quiz3", label: "Quiz 3" },
  ];

  const handleStatusChange = (periodId: number, type: "studied" | "recall") => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === periodId && period.type !== "quiz"
          ? {
              ...period,
              status: { ...period.status, [type]: !period.status[type] },
            }
          : period
      )
    );
  };

  const loadMorePeriods = () => {
    setVisiblePeriods((prev) => prev + 5);
  };

  const startEditing = (periodId: number) => {
    const period = periods.find((p) => p.id === periodId);
    if (period) {
      setEditingPeriod(periodId);
      setNewPeriodName(period.name);
      setNewPeriodDescription(period.description);
    }
  };

  const saveEdit = () => {
    if (editingPeriod && newPeriodName.trim() && newPeriodDescription.trim()) {
      setPeriods((prev) =>
        prev.map((period) =>
          period.id === editingPeriod
            ? {
                ...period,
                name: newPeriodName.trim(),
                description: newPeriodDescription.trim(),
              }
            : period
        )
      );
      setEditingPeriod(null);
    }
  };

  const cancelEdit = () => {
    setEditingPeriod(null);
  };

  const addNewPeriod = () => {
    if (newPeriodName.trim() && newPeriodDescription.trim()) {
      const newPeriodId =
        periods.length > 0 ? Math.max(...periods.map((p) => p.id)) + 1 : 1;

      setPeriods((prev) => [
        ...prev,
        {
          id: newPeriodId,
          name: newPeriodName.trim(),
          description: newPeriodDescription.trim(),
          status: { studied: false, recall: false },
          type: "period",
        },
      ]);
      setNewPeriodName("");
      setNewPeriodDescription("");
      setIsAddingPeriod(false);
    }
  };

  const addNewQuiz = () => {
    if (!newQuizName.trim()) {
      console.log("Please enter a quiz title");
      return;
    }

    const newPeriodId =
      periods.length > 0 ? Math.max(...periods.map((p) => p.id)) + 1 : 1;

        const selectedQuizLabel = quizOptions.find(
      (quiz) => quiz.value === selectedQuiz
    )?.label;
    
    const newQuizPeriod: Period = {
      id: newPeriodId,
      name: selectedQuizLabel || selectedQuiz,
      description: "Quiz about Seerah topics",
      status: { studied: false, recall: false },
      type: "quiz",
    };

    setPeriods((prev) => [...prev, newQuizPeriod]);
    setIsAddingQuiz(false);
    setSelectedQuiz("");
  };

  const deletePeriod = (periodId: number) => {
    setPeriods((prev) => prev.filter((period) => period.id !== periodId));
  };

  const showQuizModal = () => {
    setIsQuizModalVisible(true);
    quizForm.resetFields();
    setQuizType("mcq");
  };

  const handleQuizOk = () => {
    quizForm.validateFields().then((values) => {
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        type: values.type,
        question: values.question,
      };

      if (values.type === "mcq") {
        newQuiz.options = [
          values.option1,
          values.option2,
          values.option3,
          values.option4,
        ].filter((opt) => opt);
        newQuiz.correctAnswer = values.correctOption;
      } else if (values.type === "true_false") {
        newQuiz.correctAnswer = values.trueFalseAnswer;
      }

      setQuizzes((prev) => [...prev, newQuiz]);
      setIsQuizModalVisible(false);
      quizForm.resetFields();
    });
  };

  const handleQuizCancel = () => {
    setIsQuizModalVisible(false);
    quizForm.resetFields();
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const showQuizDrawer = () => {
    setIsQuizDrawerVisible(true);
  };

  const closeQuizDrawer = () => {
    setIsQuizDrawerVisible(false);
  };

  const handleSubmitAnswers = () => {
    console.log("Submitting answers...");
  };
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(periods);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedPeriods = items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setPeriods(updatedPeriods);
  };
  // Calculate progress statistics
  const totalPeriods = periods.filter((p) => p.type !== "quiz").length;
  const studiedCount = periods.filter(
    (p) => p.status.studied && p.type !== "quiz"
  ).length;
  const recallCount = periods.filter(
    (p) => p.status.recall && p.type !== "quiz"
  ).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Trackers
        </Button>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BookOpen size={16} className="text-green-500" />
            <span className="text-sm font-medium">
              {studiedCount}/{totalPeriods}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {recallCount}/{totalPeriods}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Seerah Progress Management
            </h1>
            <p className="text-gray-500 mt-1">
              Admin panel for managing Seerah tracking
            </p>
          </div>
          {canUpload && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsAddingPeriod(true);
                  setIsAddingQuiz(false);
                  setNewPeriodName("");
                  setNewPeriodDescription("");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Add Period
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(true);
                  setIsAddingPeriod(false);
                  setNewQuizName("");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Add Quiz
              </Button>
            </div>
          )}
        </div>

        {isAddingPeriod && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newPeriodName}
                onChange={(e) => setNewPeriodName(e.target.value)}
                placeholder="Enter period name (e.g., Prophethood in Mecca)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={newPeriodDescription}
                onChange={(e) => setNewPeriodDescription(e.target.value)}
                placeholder="Enter description"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addNewPeriod}
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingPeriod(false);
                  setNewPeriodName("");
                  setNewPeriodDescription("");
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        {isAddingQuiz && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
               <Select
                      value={selectedQuiz}
                      onChange={(value) => setSelectedQuiz(value)}
                      placeholder="Select a quiz"
                      style={{ width: '100%' }}
                      options={quizOptions}
                    />
            <div className="flex gap-2">
              <Button
                onClick={addNewQuiz}
                variant="default"
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(false);
                  setNewQuizName("");
                }}
                variant="outline"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="periods">
              {(provided) => (
                <table
                  className="w-full"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Topics
                      </th>
                      <th className="p-4 text-left border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-1">
                          <BookOpen size={16} className="text-green-500" />
                          <span>Studied</span>
                        </div>
                      </th>
                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-1">
                          <Clock size={16} className="text-blue-500" />
                          <span>Recall</span>
                        </div>
                      </th>

                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {periods.slice(0, visiblePeriods).map((period, index) => (
                      <Draggable
                        key={`period-${period.id}`}
                        draggableId={period.id.toString()}
                        index={index}
                        isDragDisabled={editingPeriod !== null} // Disable drag when editing
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 transition-colors ${
                              period.type === "quiz"
                                ? "cursor-pointer bg-blue-50"
                                : ""
                            }`}
                            onClick={
                              period.type === "quiz"
                                ? (e) => {
                                    if (editingPeriod === null) {
                                      router.push(
                                        `${trackerId}/quiz/${period.id}`
                                      );
                                    }
                                  }
                                : undefined
                            }
                          >
                            <td className="p-4 border whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 cursor-move"
                                >
                                  {canUpload && (
                                    <GripVertical
                                      size={16}
                                      className="text-gray-400"
                                    />
                                  )}
                                </div>

                                {editingPeriod === period.id ? (
                                  <input
                                    type="text"
                                    value={newPeriodName}
                                    onChange={(e) =>
                                      setNewPeriodName(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  />
                                ) : (
                                  <div className="flex items-center">
                                    <div
                                      className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${
                                        period.type === "quiz"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-gray-100 text-gray-700"
                                      } font-medium`}
                                    >
                                      {period.id}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {period.name}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 border">
                              {editingPeriod === period.id ? (
                                <input
                                  type="text"
                                  value={newPeriodDescription}
                                  onChange={(e) =>
                                    setNewPeriodDescription(e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                              ) : (
                                <div className="text-sm text-gray-500">
                                  {period.description}
                                </div>
                              )}
                            </td>
                            <td className="p-4 border whitespace-nowrap text-center">
                              {period.type !== "quiz" && (
                                <input
                                  type="checkbox"
                                  checked={period.status.studied}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(period.id, "studied");
                                  }}
                                  className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 transition"
                                />
                              )}
                            </td>
                            <td className="p-4 border whitespace-nowrap text-center">
                              {period.type !== "quiz" && (
                                <input
                                  type="checkbox"
                                  checked={period.status.recall}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(period.id, "recall");
                                  }}
                                  className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                                />
                              )}
                            </td>
                            <td className="p-4 border whitespace-nowrap text-center">
                              {canUpload && (
                                <>
                                  {editingPeriod === period.id ? (
                                    <div className="flex justify-center gap-2">
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          saveEdit();
                                        }}
                                        className="text-green-600 hover:text-green-800"
                                      >
                                        <Save size={16} />
                                      </Button>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          cancelEdit();
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center gap-2">
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startEditing(period.id);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        <Edit size={16} />
                                      </Button>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deletePeriod(period.id);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  )}
                                </>
                              )}
                              {period.type !== "quiz" && isStudent && (
                                <Button className="text-blue-600 hover:text-blue-800">
                                  <SendIcon size={16} />
                                </Button>
                              )}
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {Math.min(visiblePeriods, periods.length)} of{" "}
              {periods.length} Periods
            </div>
            {visiblePeriods < periods.length && (
              <Button onClick={loadMorePeriods}>Load More (5)</Button>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <Modal
        title="Add New Question"
        open={isQuizModalVisible}
        onOk={handleQuizOk}
        onCancel={handleQuizCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleQuizCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleQuizOk}>
            Add Question
          </Button>,
        ]}
      >
        <Form form={quizForm} layout="vertical">
          <Form.Item
            name="type"
            label="Quiz Type"
            initialValue="mcq"
            rules={[{ required: true, message: "Please select a quiz type" }]}
          >
            <Radio.Group onChange={(e) => setQuizType(e.target.value)}>
              <Radio value="mcq">Multiple Choice</Radio>
              <Radio value="true_false">True/False</Radio>
              <Radio value="writing">Writing Question</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter the question text" />
          </Form.Item>

          {quizType === "mcq" && (
            <>
              <Divider orientation="left">Options</Divider>
              <Form.Item
                name="option1"
                label="Option 1"
                rules={[{ required: true, message: "Please enter option 1" }]}
              >
                <Input placeholder="Enter option 1" />
              </Form.Item>
              <Form.Item
                name="option2"
                label="Option 2"
                rules={[{ required: true, message: "Please enter option 2" }]}
              >
                <Input placeholder="Enter option 2" />
              </Form.Item>
              <Form.Item name="option3" label="Option 3">
                <Input placeholder="Enter option 3 (optional)" />
              </Form.Item>
              <Form.Item name="option4" label="Option 4">
                <Input placeholder="Enter option 4 (optional)" />
              </Form.Item>
              <Form.Item
                name="correctOption"
                label="Correct Answer"
                rules={[
                  {
                    required: true,
                    message: "Please select the correct answer",
                  },
                ]}
              >
                <Select placeholder="Select correct option">
                  <Select.Option value="option1">Option 1</Select.Option>
                  <Select.Option value="option2">Option 2</Select.Option>
                  {quizForm.getFieldValue("option3") && (
                    <Select.Option value="option3">Option 3</Select.Option>
                  )}
                  {quizForm.getFieldValue("option4") && (
                    <Select.Option value="option4">Option 4</Select.Option>
                  )}
                </Select>
              </Form.Item>
            </>
          )}

          {quizType === "true_false" && (
            <Form.Item
              name="trueFalseAnswer"
              label="Correct Answer"
              rules={[
                { required: true, message: "Please select the correct answer" },
              ]}
            >
              <Radio.Group>
                <Radio value="true">True</Radio>
                <Radio value="false">False</Radio>
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Quiz Drawer */}
      <Drawer
        title="Seerah Quiz"
        placement="right"
        width={600}
        onClose={closeQuizDrawer}
        open={isQuizDrawerVisible}
        extra={
          canUpload && (
            <Button type="primary" onClick={showQuizModal}>
              Add New Question
            </Button>
          )
        }
        footer={
          !canUpload && (
            <div className="text-right">
              <Button type="primary" onClick={handleSubmitAnswers}>
                Submit Answers
              </Button>
            </div>
          )
        }
      >
        <div className="space-y-6">
          {quizzes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No quizzes available. Click "Add New Quiz" to create one.
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-700">Question:</span>{" "}
                    {quiz.question}
                  </div>
                  {canUpload && (
                    <Button
                      onClick={() => deleteQuiz(quiz.id)}
                      icon={<Trash2 size={14} />}
                    />
                  )}
                </div>

                {/* Solve Quiz Field */}
                <div className="mt-4">
                  {quiz.type === "mcq" && quiz.options && (
                    <div className="space-y-2">
                      {quiz.options.map((option, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            type="radio"
                            id={`${quiz.id}-${idx}`}
                            name={`quiz-${quiz.id}`}
                            value={option}
                            className="mr-2"
                          />
                          <label htmlFor={`${quiz.id}-${idx}`}>
                            {String.fromCharCode(65 + idx)}. {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {quiz.type === "true_false" && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`${quiz.id}-true`}
                          name={`quiz-${quiz.id}`}
                          value="True"
                          className="mr-2"
                        />
                        <label htmlFor={`${quiz.id}-true`}>True</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`${quiz.id}-false`}
                          name={`quiz-${quiz.id}`}
                          value="False"
                          className="mr-2"
                        />
                        <label htmlFor={`${quiz.id}-false`}>False</label>
                      </div>
                    </div>
                  )}

                  {quiz.type === "writing" && (
                    <div className="mt-2">
                      <textarea
                        placeholder="Write your answer here..."
                        className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={4}
                        name={`quiz-${quiz.id}`}
                      />
                    </div>
                  )}
                </div>

                {/* Show correct answer and type info for admins */}
                {canUpload && (
                  <div className="mt-3 text-xs text-gray-500">
                    <div>Type: {quiz.type.replace("_", " ").toUpperCase()}</div>
                    {quiz.correctAnswer && (
                      <div>
                        Correct Answer:{" "}
                        {quiz.type === "mcq"
                          ? quiz.correctAnswer
                          : quiz.correctAnswer === "true"
                          ? "True"
                          : "False"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Drawer>
    </div>
  );
}
