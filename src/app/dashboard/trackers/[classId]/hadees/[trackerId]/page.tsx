"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  ScrollText,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Button,
  Modal,
  Select,
  Input,
  Radio,
  Space,
  Form,
  Divider,
  Drawer,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

interface Book {
  id: number;
  name: string;
  author: string;
  status: {
    memorized: boolean;
    studied: boolean;
  };
  type?: "book" | "quiz";
}

interface Quiz {
  id: string;
  type: "mcq" | "true_false" | "writing";
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
}

export default function HadeesTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [visibleBooks, setVisibleBooks] = useState(5);
  const [editingBook, setEditingBook] = useState<number | null>(null);
  const [newBookName, setNewBookName] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [newQuizName, setNewQuizName] = useState("");
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isQuizDrawerVisible, setIsQuizDrawerVisible] = useState(false);
  const [quizForm] = Form.useForm();
  const [quizType, setQuizType] = useState<"mcq" | "true_false" | "writing">(
    "mcq"
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";
  const isAdmin = currentUser?.role === "SCHOOL_ADMIN";

  // Initialize with sample data
  useEffect(() => {
    const initialBooks = [
      {
        id: 1,
        name: "Sahih al-Bukhari",
        author: "Imam Bukhari",
        status: { memorized: false, studied: false },
        type: "book",
      },
      {
        id: 2,
        name: "Sahih Muslim",
        author: "Imam Muslim",
        status: { memorized: false, studied: false },
        type: "book",
      },
      {
        id: 3,
        name: "Quiz",
        author: "",
        status: { memorized: false, studied: false },
        type: "quiz",
      },
    ];

    const initialQuizzes = [
      {
        id: "1",
        type: "mcq",
        question: "How many hadith are in Sahih al-Bukhari?",
        options: ["7,275", "2,200", "4,000", "5,000"],
        correctAnswer: "7,275",
      },
      {
        id: "2",
        type: "true_false",
        question: "Sahih Muslim contains about 7,500 hadith.",
        correctAnswer: "true",
      },
    ];

    setBooks(initialBooks);
    setQuizzes(initialQuizzes);
  }, []);

  const handleStatusChange = (
    bookId: number,
    type: "memorized" | "studied"
  ) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId && book.type !== "quiz"
          ? {
              ...book,
              status: { ...book.status, [type]: !book.status[type] },
            }
          : book
      )
    );
  };

  const loadMoreBooks = () => {
    setVisibleBooks((prev) => prev + 5);
  };

  const startEditing = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setEditingBook(bookId);
      setNewBookName(book.name);
    }
  };

  const saveEdit = () => {
    if (editingBook && newBookName.trim()) {
      setBooks((prev) =>
        prev.map((book) =>
          book.id === editingBook
            ? {
                ...book,
                name: newBookName.trim(),
              }
            : book
        )
      );
      setEditingBook(null);
    }
  };

  const cancelEdit = () => {
    setEditingBook(null);
  };

  const addNewBook = () => {
    if (newBookName.trim() && newBookAuthor.trim()) {
      const newBookId =
        books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;

      setBooks((prev) => [
        ...prev,
        {
          id: newBookId,
          name: newBookName.trim(),
          author: newBookAuthor.trim(),
          status: { memorized: false, studied: false },
          type: "book",
        },
      ]);
      setNewBookName("");
      setNewBookAuthor("");
      setIsAddingBook(false);
    }
  };

  const addNewQuiz = () => {
    if (!newQuizName.trim()) {
      console.log("Please enter a quiz title");
      return;
    }

    const newBookId =
      books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;

    const newQuizBook: Book = {
      id: newBookId,
      name: newQuizName,
      author: "",
      status: { memorized: false, studied: false },
      type: "quiz",
    };

    setBooks((prev) => [...prev, newQuizBook]);
    setIsAddingQuiz(false);
    setNewQuizName("");
  };

  const deleteBook = (bookId: number) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
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

    const items = Array.from(books);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedBooks = items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setBooks(updatedBooks);
  };

  const totalBooks = books.length;
  const memorizedCount = books.filter(
    (b) => b.type !== "quiz" && b.status.memorized
  ).length;
  const studiedCount = books.filter(
    (b) => b.type !== "quiz" && b.status.studied
  ).length;
  const bookCount = books.filter((b) => b.type === "book").length;

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
            <BrainCircuit size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {memorizedCount}/{bookCount}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <ScrollText size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {studiedCount}/{bookCount}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hadith Progress Management
            </h1>
            <p className="text-gray-500 mt-1">
              Admin panel for managing Hadith tracking
            </p>
          </div>
          {canUpload && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsAddingBook(true);
                  setIsAddingQuiz(false);
                  setNewBookName("");
                  setNewBookAuthor("");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Add Book
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(true);
                  setIsAddingBook(false);
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

        {isAddingBook && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                placeholder="Enter book name (e.g., Sahih al-Bukhari)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
                placeholder="Enter author name (e.g., Imam Bukhari)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addNewBook} className="flex items-center gap-1">
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingBook(false);
                  setNewBookName("");
                  setNewBookAuthor("");
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        {isAddingQuiz && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
            <input
              type="text"
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}
              placeholder="Enter quiz title (e.g., Hadith Basics Quiz)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <Button onClick={addNewQuiz} className="flex items-center gap-1">
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(false);
                  setNewQuizName("");
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="books">
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
                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-1">
                          <BrainCircuit size={16} className="text-blue-500" />
                          <span>Memorized</span>
                        </div>
                      </th>
                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-1">
                          <ScrollText size={16} className="text-blue-500" />
                          <span>Studied</span>
                        </div>
                      </th>
                      {canUpload && (
                        <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {books.slice(0, visibleBooks).map((book, index) => (
                      <Draggable
                        key={`book-${book.id}`}
                        draggableId={book.id.toString()}
                        index={index}
                        isDragDisabled={editingBook !== null} // Disable drag when editing
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 transition-colors ${
                              book.type === "quiz"
                                ? "cursor-pointer bg-blue-50"
                                : ""
                            }`}
                            onClick={
                              book.type === "quiz"
                                ? (e) => {
                                    if (editingBook === null) {
                                      router.push(`${trackerId}/quiz/${book.id}`);
                                    }
                                  }
                                : undefined
                            }
                          >
                            <td className="p-4 border whitespace-nowrap">
                              <div className="flex items-center">
                                {canUpload && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-move"
                                  >
                                    <GripVertical
                                      size={16}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}

                                {editingBook === book.id ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      value={newBookName}
                                      onChange={(e) =>
                                        setNewBookName(e.target.value)
                                      }
                                      className="px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {book.name}
                                    </div>
                                    {book.type !== "quiz" && (
                                      <div className="text-sm text-gray-500">
                                        {book.author}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 border whitespace-nowrap text-center">
                              {book.type !== "quiz" && (
                                <input
                                  type="checkbox"
                                  checked={book.status.memorized}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(book.id, "memorized");
                                  }}
                                  className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                                />
                              )}
                            </td>
                            <td className="p-4 border whitespace-nowrap text-center">
                              {book.type !== "quiz" && (
                                <input
                                  type="checkbox"
                                  checked={book.status.studied}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(book.id, "studied");
                                  }}
                                  className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                                />
                              )}
                            </td>
                            {canUpload && (
                              <td className="p-4 border whitespace-nowrap text-center">
                                {editingBook === book.id ? (
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
                                        startEditing(book.id);
                                      }}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteBook(book.id);
                                      }}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                )}
                              </td>
                            )}
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
              Showing {Math.min(visibleBooks, books.length)} of {books.length}{" "}
              Books
            </div>
            {visibleBooks < books.length && (
              <Button onClick={loadMoreBooks}>Load More (5)</Button>
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
        title="Hadith Quiz"
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
                      size="small"
                      danger
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

                {/* Show correct answer and type info */}
                <div className="mt-3 text-xs text-gray-500">
                  Type: {quiz.type.replace("_", " ").toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>
    </div>
  );
}
