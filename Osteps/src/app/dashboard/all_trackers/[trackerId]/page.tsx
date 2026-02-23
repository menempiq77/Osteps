"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Edit, Save, X, GripVertical } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Breadcrumb,
  Button,
  Input,
  InputNumber,
  Select,
  Spin,
  message,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  fetchTrackerTopics,
  addTrackerTopic,
  updateTrackerTopic,
  deleteTrackerTopic,
  reorderTrackerTopics,
} from "@/services/api";
import { assignTrackerQuiz, fetchQuizes } from "@/services/quizApi";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Topic {
  id: number;
  tracker_id: number;
  title: string;
  type: string;
  status_progress: {
    id: number;
    topic_id: number;
    status_id: number;
    is_completed: number;
    status: {
      id: number;
      name: string;
    };
  }[];
}

interface TrackerData {
  id: number;
  name: string;
  type: string;
  topics: Topic[];
}
interface Quiz {
  id: string;
  type: "mcq" | "true_false" | "writing";
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
}

interface NewTopicDraft {
  title: string;
  marks: number | null;
}

const normalizeProgressOption = (value: string) =>
  String(value || "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export default function TrackerTopicsPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [visibleTopics, setVisibleTopics] = useState(10);
  const [editingTopic, setEditingTopic] = useState<number | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicMarks, setNewTopicMarks] = useState<number>(0);
  const [newTopics, setNewTopics] = useState<NewTopicDraft[]>([
    { title: "", marks: 0 },
  ]);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [savingTopics, setSavingTopics] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";
  const schoolId = currentUser?.school;

  useEffect(() => {
    loadQuizzes(schoolId);
  }, [trackerId]);

  const queryClient = useQueryClient();

  const { data: trackerData, isLoading, error } = useQuery({
    queryKey: ["tracker-topics", trackerId],
    queryFn: () => fetchTrackerTopics(Number(trackerId)),
    enabled: !!trackerId,
    retry: 1,
  });

  const topics = trackerData?.topics?.slice().sort((a, b) => (a.position || 0) - (b.position || 0)) || [];

  const loadQuizzes = async (schoolId: string) => {
    try {
      setLoading(true);
      const response = await fetchQuizes(schoolId);
      setQuizzes(response);
    } catch (error) {
      console.error("Failed to load quizzes", error);
      // message.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const getQuizOptions = () => {
    return quizzes.map((quiz) => ({
      value: quiz.id,
      label: quiz.name || `Quiz ${quiz.id}`,
    }));
  };

  const startEditing = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setEditingTopic(topicId);
      setNewTopicTitle(topic.title);
      setNewTopicMarks(topic.marks);
    }
  };

  const saveEdit = async () => {
    if (editingTopic && newTopicTitle.trim()) {
      try {
        await updateTrackerTopic(editingTopic, {
          title: newTopicTitle.trim(),
          marks: newTopicMarks,
        });
        queryClient.invalidateQueries(["tracker-topics", trackerId]);
        setEditingTopic(null);
        message.success("Topic updated successfully");
      } catch (error) {
        console.error("Failed to update topic", error);
        message.error("Failed to update topic");
      }
    }
  };

  const cancelEdit = () => {
    setEditingTopic(null);
    setNewTopicTitle("");
    setNewTopicMarks(0);
  };

  const handleAssignQuiz = async () => {
    if (!selectedQuiz || !trackerId) {
      message.error("Please select a quiz first");
      return;
    }

    try {
      setLoading(true);
      await assignTrackerQuiz(Number(trackerId), Number(selectedQuiz));
      message.success("Quiz assigned successfully");
      setIsAddingQuiz(false);
      setSelectedQuiz("");
      queryClient.invalidateQueries(["tracker-topics", trackerId]);
    } catch (error) {
      console.error("Failed to assign quiz", error);
      message.error("Failed to assign quiz");
    } finally {
      setLoading(false);
    }
  };

  const updateNewTopicRow = (
    index: number,
    key: keyof NewTopicDraft,
    value: string | number | null
  ) => {
    setNewTopics((prev) =>
      prev.map((topic, topicIndex) => {
        if (topicIndex !== index) return topic;
        if (key === "title") {
          return { ...topic, title: String(value ?? "") };
        }
        return {
          ...topic,
          marks: typeof value === "number" ? value : value === null ? null : 0,
        };
      })
    );
  };

  const addNewTopicRow = () => {
    setNewTopics((prev) => [...prev, { title: "", marks: 0 }]);
  };

  const removeNewTopicRow = (index: number) => {
    setNewTopics((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, topicIndex) => topicIndex !== index);
    });
  };

  const resetAddTopicForm = () => {
    setIsAddingTopic(false);
    setNewTopics([{ title: "", marks: 0 }]);
  };

  const addNewTopics = async () => {
    const preparedTopics = newTopics
      .map((topic) => ({
        title: topic.title.trim(),
        marks: typeof topic.marks === "number" ? topic.marks : 0,
      }))
      .filter((topic) => topic.title.length > 0);

    if (!preparedTopics.length) {
      messageApi.error("Please add at least one topic title");
      return;
    }

    setSavingTopics(true);
    const failedTopics: NewTopicDraft[] = [];
    let addedCount = 0;

    try {
      for (const topic of preparedTopics) {
        try {
          const res = await addTrackerTopic(Number(trackerId), topic);
          if (res?.status_code === 400 && res?.msg) {
            failedTopics.push({
              title: topic.title,
              marks: topic.marks,
            });
            messageApi.warning(`${topic.title}: ${res.msg}`);
            continue;
          }
          addedCount += 1;
        } catch (error: any) {
          const backendMsg =
            error?.response?.data?.msg ||
            error?.response?.data?.message ||
            "Failed to add topic";
          failedTopics.push({
            title: topic.title,
            marks: topic.marks,
          });
          messageApi.error(`${topic.title}: ${backendMsg}`);
        }
      }

      if (addedCount > 0) {
        queryClient.invalidateQueries(["tracker-topics", trackerId]);
      }

      if (failedTopics.length === 0) {
        messageApi.success(
          `${addedCount} topic${addedCount > 1 ? "s" : ""} added successfully`
        );
        resetAddTopicForm();
      } else {
        messageApi.warning(
          `Added ${addedCount}. ${failedTopics.length} topic${
            failedTopics.length > 1 ? "s" : ""
          } need attention.`
        );
        setNewTopics(
          failedTopics.length ? failedTopics : [{ title: "", marks: 0 }]
        );
      }
    } finally {
      setSavingTopics(false);
    }
  };

  const deleteTopic = async (topicId: number) => {
    try {
      await deleteTrackerTopic(topicId);
      queryClient.invalidateQueries(["tracker-topics", trackerId]);
      message.success("Topic deleted successfully");
    } catch (error) {
      console.error("Failed to delete topic", error);
      message.error("Failed to delete topic");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(topics);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    // Update query data maintaining the correct structure
    queryClient.setQueryData(["tracker-topics", trackerId], {
      ...trackerData,
      topics: items,
    });


    const orders = items.map((topic, index) => ({
      id: topic.id,
      position: index + 1,
    }));

    try {
      await reorderTrackerTopics(orders);
      message.success("Topics reordered successfully");
      queryClient.invalidateQueries(["tracker-topics", trackerId]);
    } catch (error) {
      console.error("Failed to reorder topics", error);
      message.error("Failed to reorder topics");
    }
  };


  // const statusTypes = Array.from(
  //   new Set(
  //     topics?.flatMap((topic) =>
  //       topic?.status_progress?.map((sp) => sp.status.name)
  //     )
  //   )
  // );
  const statusTypes = trackerData?.status_progress?.map((sp) => sp.name) || [];

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Error loading tracker data</p>
          <p className="text-gray-600">{error?.message || "Unknown error occurred"}</p>
          <p className="text-gray-500 text-sm mt-2">Check console for details</p>
        </div>
      </div>
    );
  }

  if (!trackerData) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">No tracker data available</p>
          <p className="text-gray-500 text-sm">Please ensure the tracker exists</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto min-h-screen">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/dashboard/all_trackers">All Trackers</Link>,
          },
          {
            title: <span>Topics</span>,
          },
        ]}
        className="!mb-6"
      />

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {trackerData?.name || "Tracker Progress"}
            </h1>
          </div>
          {canUpload && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsAddingTopic(true);
                  setNewTopics([{ title: "", marks: 0 }]);
                }}
                type="primary"
                className="flex items-center gap-2 cursor-pointer !bg-[#38C16C] !border-[#38C16C] !text-white hover:!bg-[#32ad5f] hover:!border-[#32ad5f]"
              >
                <Plus size={16} />
                Add Topic
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(true);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Add Quiz
              </Button>
            </div>
          )}
        </div>

        {isAddingTopic && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {newTopics.map((topic, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input
                    type="text"
                    value={topic.title}
                    onChange={(e) =>
                      updateNewTopicRow(index, "title", e.target.value)
                    }
                    placeholder={`Enter Topic Title ${newTopics.length > 1 ? `#${index + 1}` : ""}`}
                    className="flex-1"
                  />
                  <InputNumber
                    min={0}
                    value={topic.marks}
                    onChange={(value) => updateNewTopicRow(index, "marks", value)}
                    placeholder="Enter Points"
                    className="flex-grow"
                  />
                  <Button
                    danger
                    disabled={newTopics.length === 1}
                    onClick={() => removeNewTopicRow(index)}
                    className="flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <Button onClick={addNewTopicRow} className="flex items-center gap-2">
                <Plus size={16} />
                Add Another Topic
              </Button>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={resetAddTopicForm}
              >
                Cancel
              </Button>
              <Button
                onClick={addNewTopics}
                className="flex items-center gap-1"
                loading={savingTopics}
              >
                <Save size={16} />
                Save All
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
              style={{ width: "100%" }}
              options={getQuizOptions()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAssignQuiz}
                className="flex items-center gap-1"
                loading={loading}
              >
                <Save size={16} />
                Assign
              </Button>
              <Button
                onClick={() => {
                  setIsAddingQuiz(false);
                  setSelectedQuiz("");
                }}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="topics">
              {(provided) => (
                <table
                  className="w-full"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        Topics
                      </th>
                      {statusTypes.map((statusName, index) => (
                        <th
                          key={index}
                          className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                        >
                          <div className="flex items-center justify-center">
                            <span>{normalizeProgressOption(statusName)}</span>
                          </div>
                        </th>
                      ))}
                      <th className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topics?.slice(0, visibleTopics)?.map((topic, index) => (
                      <Draggable
                        key={`topic-${topic?.id}`}
                        draggableId={topic?.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 transition-colors ${
                              topic?.type === "quiz"
                                ? "cursor-pointer bg-blue-50"
                                : ""
                            }`}
                            onClick={
                              topic?.type === "quiz"
                                ? (e) => {
                                    router.push(
                                      `${trackerId}/quiz/${topic?.quiz_id}`
                                    );
                                  }
                                : undefined
                            }
                          >
                            <td className="p-4 whitespace-nowrap border-r border-gray-200">
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className={`mr-2 cursor-move ${
                                    !canUpload ? "hidden" : "block"
                                  }`}
                                >
                                  <GripVertical
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </div>

                                {editingTopic === topic?.id ? (
                                  <div className="flex flex-col gap-1 w-full">
                                    <Input
                                      type="text"
                                      value={newTopicTitle}
                                      onChange={(e) =>
                                        setNewTopicTitle(e.target.value)
                                      }
                                      placeholder="Enter Topic Title"
                                      className="w-full"
                                    />
                                    <InputNumber
                                      min={0}
                                      value={newTopicMarks}
                                      onChange={(value) =>
                                        setNewTopicMarks(value || 0)
                                      }
                                      placeholder="Enter Points"
                                      className="!w-full"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {topic?.title || topic?.quiz?.name}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            {statusTypes?.map((statusName, index) => {
                              return (
                                <td
                                  key={index}
                                  className="p-4 whitespace-nowrap text-center border-r border-gray-200"
                                >
                                  {topic?.type !== "quiz" && (
                                    <input
                                      type="checkbox"
                                      disabled={!isStudent}
                                      className="h-5 w-5 !appearance-none rounded border border-gray-300 relative"
                                    />
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-4 whitespace-nowrap text-center">
                              {editingTopic === topic?.id ? (
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
                                      startEditing(topic.id);
                                    }}
                                    disabled={topic?.type === "quiz"}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteTopic(topic.id);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
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
              Showing {Math.min(visibleTopics, topics.length)} of{" "}
              {topics.length} Topics
            </div>
            {visibleTopics < topics.length && (
              <Button onClick={() => setVisibleTopics((prev) => prev + 10)}>
                Load More (10)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
