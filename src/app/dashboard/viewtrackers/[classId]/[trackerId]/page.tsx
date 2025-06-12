// Updated QuranTrackerAdminPage component
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Input, Modal, Select, Spin, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  fetchTrackerTopics,
  fetchQuizes,
  fetchStudents,
} from "@/services/api";

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
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [markModal, setMarkModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [marks, setMarks] = useState("");

  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudents(classId);
      setStudents(studentsData);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackerData();
    loadQuizzes();
  }, [trackerId]);

  useEffect(() => {
    loadStudents();
  }, [classId]);

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      const data = await fetchTrackerTopics(Number(trackerId));
      setTrackerData(data);
      setTopics(data?.topics || []);
    } catch (error) {
      console.error("Failed to load tracker data", error);
    } finally {
      setLoading(false);
    }
  };
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizes();
      setQuizzes(response);
    } catch (error) {
      console.error("Failed to load quizzes", error);
    } finally {
      setLoading(false);
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

  const handleEnterMarks = (topic: Topic) => {
    setSelectedTopic(topic);
    setMarkModal(true);
  };

  const handleSubmitMarks = () => {
    if (!marks) {
      message.warning("Please enter marks");
      return;
    }
    message.success(`Marks ${marks} submitted for ${selectedTopic?.title}`);
    setMarkModal(false);
    setMarks("");
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:!border-green-500 hover:!text-green-500"
        >
          <ArrowLeft size={18} />
          Back to Trackers
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {trackerData?.name || "Tracker Progress"}
          </h1>

          <Select
            value={selectedYear || undefined}
            onChange={(val) => setSelectedYear(val)}
            allowClear
            placeholder="Select Student"
            className="w-48"
            style={{ minWidth: "120px" }}
          >
            {students?.map((stud) => (
              <Option key={stud.id} value={stud.id}>
                {stud.student_name}
              </Option>
            ))}
          </Select>
        </div>

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
                            <span className="capitalize">
                              {statusName || "dsggsd"}
                            </span>
                          </div>
                        </th>
                      ))}
                      <th className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
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
                            className="hover:bg-gray-50 transition-colors"
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

                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium">
                                    {index + 1}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {topic?.title}
                                    </div>
                                  </div>
                                </div>
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
                                  <input
                                    type="checkbox"
                                    checked={statusProgress?.is_completed === 1}
                                    className={`h-5 w-5 rounded border-gray-300 focus:ring-2 transition ${
                                      statusName === "memorization"
                                        ? "text-blue-500 focus:ring-blue-500"
                                        : statusName === "Recall"
                                        ? "text-green-500 focus:ring-green-500"
                                        : "text-purple-500 focus:ring-purple-500"
                                    }`}
                                  />
                                </td>
                              );
                            })}
                            <td className="p-4 whitespace-nowrap text-center">
                              <Button
                                className="!text-primary"
                                onClick={() => handleEnterMarks(topic)}
                              >
                                Enter Marks
                              </Button>
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

      {/* Marks Modal */}
      <Modal
        title={`Enter Marks for ${selectedTopic?.title || "Topic"}`}
        open={markModal}
        onOk={handleSubmitMarks}
        onCancel={() => setMarkModal(false)}
        okText="Submit Marks"
      >
        <div className="my-4">
          <Input
            type="number"
            placeholder="Enter marks (0-100)"
            min={0}
            max={100}
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
