// Updated QuranTrackerAdminPage component
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
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Input, InputNumber, Select, Spin, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  fetchTrackerTopics,
  addTrackerTopic,
  updateTrackerTopic,
  deleteTrackerTopic,
  updateTopicStatus,
  fetchTrackerStudentTopics,
} from "@/services/api";
import { assignTrackerQuiz, fetchQuizes } from "@/services/quizApi";

interface Status {
  id: number;
  name: string;
  is_completed: boolean;
}

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

export default function QuranTrackerAdminPage() {
  const { trackerId, classId } = useParams();
  const router = useRouter();
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(10);
  const [editingTopic, setEditingTopic] = useState<number | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicMarks, setNewTopicMarks] = useState<number>(0);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "HOD" || currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";
  const schoolId = currentUser?.school;

  useEffect(() => {
    if (isStudent) {
      loadStudentTrackerData();
    } else {
      loadTrackerData();
    }
    loadQuizzes(schoolId);
  }, [trackerId]);

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      const data = await fetchTrackerTopics(Number(trackerId));

      setTrackerData(data);
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Failed to load tracker data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentTrackerData = async () => {
    try {
      setLoading(true);
      const response = await fetchTrackerStudentTopics(
        currentUser?.student,
        Number(trackerId)
      );

      let trackerData;
      if (Array.isArray(response)) {
        trackerData = response[0] || { topics: [] };
      } else {
        trackerData = response || { topics: [] };
      }

      setTrackerData(trackerData);
      setTopics(trackerData.topics || []);
    } catch (error) {
      console.error("Failed to load tracker data", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(trackerData, "trackerData");

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

  const handleStatusChange = async (
    topicId: number,
    statusId: number,
    currentStatus: number
  ) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      await updateTopicStatus(topicId, statusId, newStatus === 1);

      setTopics((prev) =>
        prev.map((topic) => {
          if (topic.id === topicId) {
            return {
              ...topic,
              status_progress: topic.status_progress.map((sp) =>
                sp.status_id === statusId
                  ? { ...sp, is_completed: newStatus }
                  : sp
              ),
            };
          }
          return topic;
        })
      );
    } catch (error) {
      console.error("Failed to update status", error);
      message.error("Failed to update status");
    }
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
        setTopics((prev) =>
          prev.map((topic) =>
            topic.id === editingTopic
              ? { ...topic, title: newTopicTitle.trim(), marks: newTopicMarks }
              : topic
          )
        );
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
      loadTrackerData();
    } catch (error) {
      console.error("Failed to assign quiz", error);
      message.error("Failed to assign quiz");
    } finally {
      setLoading(false);
    }
  };

  const addNewTopic = async () => {
    if (newTopicTitle.trim() && trackerId) {
      try {
        const response = await addTrackerTopic(Number(trackerId), {
          title: newTopicTitle.trim(),
          marks: newTopicMarks,
        });
        setTopics((prev) => [...prev, response.data]);
        setNewTopicTitle("");
        setNewTopicMarks(0);
        setIsAddingTopic(false);
        loadTrackerData();
        message.success("Topic added successfully");
      } catch (error) {
        console.error("Failed to add topic", error);
        message.error("Failed to add topic");
      }
    }
  };
  const deleteTopic = async (topicId: number) => {
    try {
      await deleteTrackerTopic(topicId);
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
      message.success("Topic deleted successfully");
    } catch (error) {
      console.error("Failed to delete topic", error);
      message.error("Failed to delete topic");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(topics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTopics(items);
    // Note: You might want to add API call to save the new order
  };

  const statusTypes = Array.from(
    new Set(
      topics?.flatMap((topic) =>
        topic?.status_progress?.map((sp) => sp.status.name)
      )
    )
  );

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:!border-green-500 hover:!text-green-500"
        >
          <ArrowLeft size={18} />
          Back to Trackers
        </Button>
      </div>

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
                  setNewTopicTitle("");
                }}
                className="flex items-center gap-2 cursor-pointer !bg-primary !text-white hover:!border-primary"
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
            <div className="flex items-center gap-4">
              <Input
                type="text"
                // value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Enter Topic Title"
                className="flex-1"
              />
              <InputNumber
                min={0}
                // value={newTopicMarks}
                onChange={(value) => setNewTopicMarks(value)}
                placeholder="Enter Marks"
                className="flex-grow"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setIsAddingTopic(false);
                  setNewTopicTitle("");
                  setNewTopicMarks(0);
                }}
              >
                Cancel
              </Button>
              <Button onClick={addNewTopic} className="flex items-center gap-1">
                <Save size={16} />
                Save
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
                          <div className="flex items-center justify-center gap-1">
                            {statusName === "memorization" ? (
                              <BrainCircuit
                                size={16}
                                className="text-blue-500"
                              />
                            ) : statusName === "Recall" ? (
                              <BookOpen size={16} className="text-green-500" />
                            ) : (
                              <Languages
                                size={16}
                                className="text-purple-500"
                              />
                            )}
                            <span className="capitalize">{statusName}</span>
                          </div>
                        </th>
                      ))}
                      <th className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {isStudent ? "Marks" : "Action"}
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
                                      placeholder="Enter Marks"
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
                              const statusProgress =
                                topic?.status_progress?.find(
                                  (sp) => sp.status.name === statusName
                                );

                              return (
                                <td
                                  key={index}
                                  className="p-4 whitespace-nowrap text-center border-r border-gray-200"
                                >
                                  {topic?.type !== "quiz" && (
                                    <input
                                      type="checkbox"
                                      disabled={!isStudent}
                                      checked={
                                        statusProgress?.is_completed === 1
                                      }
                                      onChange={(e) => {
                                        if (statusProgress) {
                                          handleStatusChange(
                                            topic.id,
                                            statusProgress.status_id,
                                            statusProgress.is_completed
                                          );
                                        }
                                      }}
                                      className={`
                                                  h-5 w-5 !appearance-none rounded border border-gray-300 
                                                  checked:!bg-primary checked:border-transparent 
                                                  focus:ring-2 focus:ring-primary 
                                                  transition duration-150 cursor-pointer 
                                                  disabled:cursor-not-allowed disabled:opacity-50
                                                  relative
                                                  checked:after:content-['✔'] 
                                                  checked:after:absolute 
                                                  checked:after:text-white 
                                                  checked:after:text-sm 
                                                  checked:after:font-bold 
                                                  checked:after:left-1/2 
                                                  checked:after:top-1/2 
                                                  checked:after:-translate-x-1/2 
                                                  checked:after:-translate-y-1/2
                                                `}
                                    />
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-4 whitespace-nowrap text-center">
                              {canUpload && (
                                <>
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
                                </>
                              )}
                              {isStudent && (
                                <span className="text-primary">
                                  {topic.topic_mark?.find(
                                    (m) => m.student_id === currentUser?.student
                                  )?.marks || "0"}
                                  / {topic.marks || "0"}
                                </span>
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
