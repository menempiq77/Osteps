"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Languages,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  GripVertical,
  SendIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Button,
  Select,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Chapter {
  number: number;
  name: string;
  status: {
    read: boolean;
    memorized: boolean;
    tafsir: boolean;
  };
  type?: "surah" | "quiz";
  quizId?: string;
}

interface Quiz {
  id: string;
  type: "mcq" | "true_false" | "writing";
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
}

export default function QuranTrackerAdminPage() {
  const { trackerId, classId } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [visibleChapters, setVisibleChapters] = useState(10);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<number | null>(null);
  const [newChapterName, setNewChapterName] = useState("");
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [editingQuizSelection, setEditingQuizSelection] = useState<string>("");
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";

  const quizOptions = [
    { value: "quiz1", label: "Quiz 1" },
    { value: "quiz2", label: "Quiz 2" },
    { value: "quiz3", label: "Quiz 3" },
  ];

  // Initialize with sample data
  useEffect(() => {
    const initialChapters = [
      {
        number: 1,
        name: "Al-Fatihah (the Opening)",
        status: { read: false, memorized: false, tafsir: false },
        type: "surah",
      },
      {
        number: 2,
        name: "Al-Baqarah (the Cow)",
        status: { read: false, memorized: false, tafsir: false },
        type: "surah",
      },
      {
        number: 3,
        name: "Quiz 1",
        status: { read: false, memorized: false, tafsir: false },
        type: "quiz",
        quizId: "quiz1"
      },
    ].slice(0, 20);

    const initialQuizzes = [
      {
        id: "quiz1",
        type: "mcq",
        question: "What is the meaning of Al-Fatihah?",
        options: ["The Opening", "The Cow", "The Light"],
        correctAnswer: "The Opening",
      },
      {
        id: "quiz2",
        type: "true_false",
        question: "The Quran has 114 surahs.",
        correctAnswer: "true",
      },
    ];

    setChapters(initialChapters);
    setQuizzes(initialQuizzes);
  }, []);

  const handleStatusChange = (
    chapterNumber: number,
    type: "read" | "memorized" | "tafsir"
  ) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.number === chapterNumber
          ? {
              ...chapter,
              status: { ...chapter.status, [type]: !chapter.status[type] },
            }
          : chapter
      )
    );
  };

  const loadMoreChapters = () => {
    setVisibleChapters((prev) => prev + 10);
  };

  const startEditing = (chapterNumber: number) => {
    const chapter = chapters.find((c) => c.number === chapterNumber);
    if (chapter) {
      if (chapter.type === "quiz") {
        setEditingQuiz(chapterNumber);
        setEditingQuizSelection(chapter.quizId || "");
      } else {
        setEditingChapter(chapterNumber);
        setNewChapterName(chapter.name);
      }
    }
  };

  const saveEdit = () => {
    if (editingChapter && newChapterName.trim()) {
      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.number === editingChapter
            ? { ...chapter, name: newChapterName.trim() }
            : chapter
        )
      );
      setEditingChapter(null);
    }
  };

  const saveQuizEdit = () => {
    if (editingQuiz && editingQuizSelection) {
      const selectedQuiz = quizOptions.find(q => q.value === editingQuizSelection);
      
      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.number === editingQuiz
            ? { 
                ...chapter, 
                name: selectedQuiz?.label || editingQuizSelection,
                quizId: editingQuizSelection
              }
            : chapter
        )
      );
      setEditingQuiz(null);
      setEditingQuizSelection("");
    }
  };

  const cancelEdit = () => {
    setEditingChapter(null);
    setEditingQuiz(null);
    setEditingQuizSelection("");
  };

  const addNewChapter = () => {
    if (newChapterName.trim()) {
      const newChapterNumber =
        chapters.length > 0
          ? Math.max(...chapters.map((c) => c.number)) + 1
          : 1;

      setChapters((prev) => [
        ...prev,
        {
          number: newChapterNumber,
          name: newChapterName.trim(),
          status: { read: false, memorized: false, tafsir: false },
          type: "surah",
        },
      ]);
      setNewChapterName("");
      setIsAddingChapter(false);
    }
  };

  const addNewQuiz = () => {
    if (!selectedQuiz) {
      console.log("Please select a quiz");
      return;
    }

    const newChapterNumber =
      chapters.length > 0 ? Math.max(...chapters.map((c) => c.number)) + 1 : 1;

    const selectedQuizLabel = quizOptions.find(
      (quiz) => quiz.value === selectedQuiz
    )?.label;

    const newQuizChapter: Chapter = {
      number: newChapterNumber,
      name: selectedQuizLabel || selectedQuiz,
      status: { read: false, memorized: false, tafsir: false },
      type: "quiz",
      quizId: selectedQuiz
    };

    setChapters((prev) => [...prev, newQuizChapter]);
    setIsAddingQuiz(false);
    setSelectedQuiz("");
  };

  const deleteChapter = (chapterNumber: number) => {
    setChapters((prev) =>
      prev.filter((chapter) => chapter.number !== chapterNumber)
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedChapters = items.map((item, index) => ({
      ...item,
      number: index + 1,
    }));

    setChapters(updatedChapters);
  };

  const totalChapters = chapters.length;
  const readCount = chapters.filter((c) => c.status.read).length;
  const memorizedCount = chapters.filter((c) => c.status.memorized).length;
  const tafsirCount = chapters.filter((c) => c.status.tafsir).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header and stats remain the same */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BookOpen size={16} className="text-green-500" />
            <span className="text-sm font-medium">
              {readCount}/{totalChapters}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BrainCircuit size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {memorizedCount}/{totalChapters}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Languages size={16} className="text-purple-500" />
            <span className="text-sm font-medium">
              {tafsirCount}/{totalChapters}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Title and buttons remain the same */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quran Progress Management
            </h1>
            <p className="text-gray-500 mt-1">
              Admin panel for managing Quran tracking
            </p>
          </div>
          {canUpload && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsAddingChapter(true);
                  setIsAddingQuiz(false);
                  setNewChapterName("");
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Add Option
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(true);
                  setIsAddingChapter(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Add Quiz
              </Button>
            </div>
          )}
        </div>

        {/* Add chapter form remains the same */}
        {isAddingChapter && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
            <input
              type="text"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              placeholder="Enter Option"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <Button
                onClick={addNewChapter}
                variant="solid"
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingChapter(false);
                  setNewChapterName("");
                }}
                variant="outlined"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Add quiz form remains the same */}
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
              <Button onClick={addNewQuiz} className="flex items-center gap-1">
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(false);
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="chapters">
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
                          <BookOpen size={16} className="text-green-500" />
                          <span>Read</span>
                        </div>
                      </th>
                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-1">
                          <BrainCircuit size={16} className="text-blue-500" />
                          <span>Memorized</span>
                        </div>
                      </th>
                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-1">
                          <Languages size={16} className="text-purple-500" />
                          <span>Tafsir</span>
                        </div>
                      </th>

                      <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {chapters
                      .slice(0, visibleChapters)
                      .map((chapter, index) => (
                        <Draggable
                          key={`chapter-${chapter.number}`}
                          draggableId={chapter.number.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`hover:bg-gray-50 transition-colors ${
                                chapter.type === "quiz"
                                  ? "cursor-pointer bg-blue-50"
                                  : ""
                              }`}
                              onClick={
                                chapter.type === "quiz" && !editingQuiz
                                  ? (e) => {
                                      router.push(
                                        `${trackerId}/quiz/${chapter.number}`
                                      );
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
                                      <GripVertical size={16} className="text-gray-400" />
                                    </div>
                                  )}
                                  
                                  {editingChapter === chapter.number ? (
                                    <input
                                      type="text"
                                      value={newChapterName}
                                      onChange={(e) =>
                                        setNewChapterName(e.target.value)
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  ) : editingQuiz === chapter.number ? (
                                    <Select
                                      value={editingQuizSelection}
                                      onChange={(value) => setEditingQuizSelection(value)}
                                      placeholder="Select a quiz"
                                      style={{ width: '100%' }}
                                      options={quizOptions}
                                    />
                                  ) : (
                                    <div className="flex items-center">
                                      <div
                                        className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${
                                          chapter.type === "quiz"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700"
                                        } font-medium`}
                                      >
                                        {chapter.number}
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {chapter.name.split(" (")[0]}
                                        </div>
                                        {chapter.type !== "quiz" && (
                                          <div className="text-sm text-gray-500">
                                            {
                                              chapter.name.match(
                                                /\((.*)\)/
                                              )?.[1]
                                            }
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 border whitespace-nowrap text-center">
                                {chapter.type !== "quiz" && (
                                  <input
                                    type="checkbox"
                                    checked={chapter.status.read}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        chapter.number,
                                        "read"
                                      );
                                    }}
                                    className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 transition"
                                  />
                                )}
                              </td>
                              <td className="p-4 border whitespace-nowrap text-center">
                                {chapter.type !== "quiz" && (
                                  <input
                                    type="checkbox"
                                    checked={chapter.status.memorized}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        chapter.number,
                                        "memorized"
                                      );
                                    }}
                                    className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                                  />
                                )}
                              </td>
                              <td className="p-4 border whitespace-nowrap text-center">
                                {chapter.type !== "quiz" && (
                                  <input
                                    type="checkbox"
                                    checked={chapter.status.tafsir}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        chapter.number,
                                        "tafsir"
                                      );
                                    }}
                                    className="h-5 w-5 text-purple-500 rounded border-gray-300 focus:ring-purple-500 transition"
                                  />
                                )}
                              </td>
                              <td className="p-4 border whitespace-nowrap text-center">
                                {canUpload && (
                                  <>
                                    {editingChapter === chapter.number ? (
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
                                    ) : editingQuiz === chapter.number ? (
                                      <div className="flex justify-center gap-2">
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            saveQuizEdit();
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
                                            startEditing(chapter.number);
                                          }}
                                          className="text-blue-600 hover:text-blue-800"
                                        >
                                          <Edit size={16} />
                                        </Button>

                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteChapter(chapter.number);
                                          }}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <Trash2 size={16} />
                                        </Button>
                                      </div>
                                    )}
                                  </>
                                )}

                                {chapter.type !== "quiz" && isStudent && (
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
              Showing {Math.min(visibleChapters, chapters.length)} of{" "}
              {chapters.length} Topics
            </div>
            {visibleChapters < chapters.length && (
              <Button onClick={loadMoreChapters}>Load More (10)</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}