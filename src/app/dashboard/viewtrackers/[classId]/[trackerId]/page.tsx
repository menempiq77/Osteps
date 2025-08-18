// Updated QuranTrackerAdminPage component
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GripVertical } from "lucide-react";
import { Button, Input, Modal, Select, Spin, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  fetchTrackerTopics,
  addTopicMark,
} from "@/services/api";
import { fetchStudents } from "@/services/studentsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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

interface Student {
  id: number;
  student_name: string;
  // Add other student properties as needed
}

export default function QuranTrackerAdminPage() {
  const { trackerId, classId } = useParams();
  const router = useRouter();
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(10);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [markModal, setMarkModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [marks, setMarks] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(topics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTopics(items);
    // Note: You might want to add API call to save the new order
  };

  const statusTypes = React.useMemo(() => {
    const types = new Set<string>();
    trackerData?.topics?.forEach((topic) => {
      topic.status_progress?.forEach((sp) => {
        types.add(sp.status.name);
      });
    });
    return Array.from(types);
  }, [trackerData]);

  const studentIdsInData = React.useMemo(() => {
    const ids = new Set<number>();
    trackerData?.topics?.forEach((topic) => {
      topic.status_progress?.forEach((sp) => {
        ids.add(sp.student_id);
      });
    });
    return Array.from(ids);
  }, [trackerData]);

  // Match students from dropdown with those in data
  const availableStudents = React.useMemo(() => {
    return students.filter((student) => studentIdsInData.includes(student.id));
  }, [students, studentIdsInData]);

  const handleEnterMarks = (topic: Topic) => {
    if (!selectedStudentId) {
      message.warning("Please select a student first");
      return;
    }
    setSelectedTopic(topic);
    setMarkModal(true);
  };
  const handleSubmitMarks = async () => {
    if (!marks) {
      message.warning("Please enter marks");
      return;
    }

    if (!selectedTopic) {
      message.warning("No topic selected");
      return;
    }

    if (!selectedStudentId) {
      message.warning("No student selected");
      return;
    }

    try {
      const marksValue = Number(marks);
      if (isNaN(marksValue)) {
        message.warning("Please enter valid marks");
        return;
      }

      // Get the maximum marks from the topic (10 in this case)
      const maxMarks = selectedTopic.marks ? Number(selectedTopic.marks) : 100;
      
      if (marksValue > maxMarks) {
        message.warning(`Marks cannot exceed ${maxMarks}`);
        return;
      }


      await addTopicMark(selectedTopic.id, marksValue, selectedStudentId);

      message.success(`Marks ${marks} submitted for ${selectedTopic.title}`);
      setMarkModal(false);
      setMarks("");
    } catch (error) {
      message.error("Failed to submit marks");
      console.error("Error submitting marks:", error);
    }
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

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {trackerData?.name || "Tracker Progress"}
          </h1>

          <Select
            value={selectedStudentId || undefined}
            onChange={(val) => setSelectedStudentId(val)}
            placeholder="Select Student"
            className="w-48"
            style={{ minWidth: "120px" }}
            options={students.map((student) => ({
              label: student.student_name,
              value: student.id,
            }))}
          />
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
                        key={`topic-${topic.id}`}
                        draggableId={topic.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-4 whitespace-nowrap border-r border-gray-200">
                              {/* Topic title rendering */}
                              <div className="flex gap-1 items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 cursor-move"
                                >
                                  <GripVertical
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </div>
                                <button
                                  className={`hover:bg-gray-50 transition-colors ${
                                    topic.type === "quiz"
                                      ? "cursor-pointer hover:underline"
                                      : ""
                                  }`}
                                  onClick={
                                    topic.type === "quiz"
                                      ? (e) => {
                                          router.push(
                                            `${trackerId}/quiz/${topic.quiz_id}`
                                          );
                                        }
                                      : undefined
                                  }
                                >
                                  {topic.title || topic?.quiz?.name}
                                </button>
                              </div>
                            </td>

                            {statusTypes.map((statusName) => {
                              if (!selectedStudentId)
                                return (
                                  <td
                                    key={`${topic.id}-${statusName}`}
                                    className="p-4 whitespace-nowrap text-center border-r border-gray-200"
                                  >
                                    {topic?.type !== "quiz" && "-"}
                                  </td>
                                );

                              const studentProgress =
                                topic.status_progress.find(
                                  (sp) =>
                                    sp.status.name === statusName &&
                                    sp.student_id === selectedStudentId
                                );

                              return (
                                <td
                                  key={`${topic.id}-${statusName}`}
                                  className="p-4 whitespace-nowrap text-center border-r border-gray-200"
                                >
                                  {topic?.type !== "quiz" && (
                                    <input
                                      type="checkbox"
                                      readOnly
                                      disabled
                                      checked={
                                        studentProgress?.is_completed === 1
                                      }
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
                              {topic.type !== "quiz" && (
                                <Button
                                  className="!text-primary"
                                  onClick={() => handleEnterMarks(topic)}
                                  disabled={!selectedStudentId}
                                >
                                  Enter Marks
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
        title={`Enter Marks (Max: ${selectedTopic?.marks || 100})`}
        open={markModal}
        onOk={handleSubmitMarks}
        onCancel={() => setMarkModal(false)}
        okText="Submit Marks"
        okButtonProps={{ className: "!bg-primary !text-white" }}
        centered
      >
        <div className="my-4">
          <Input
            name="marks"
            type="number"
            placeholder={`Enter marks (0-${selectedTopic?.marks || 100})`}
            min={0}
            max={selectedTopic?.marks || 100}
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
