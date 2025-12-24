"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Languages,
  GripVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Progress, Spin, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  fetchTrackerTopics,
  updateTopicStatus,
  fetchTrackerStudentTopics,
} from "@/services/api";
import { fetchStudentTrackerPoints } from "@/services/trackersApi";

interface Status {
  id: number;
  name: string;
}

interface StatusProgress {
  id: number;
  topic_id: number;
  status_id: number;
  is_completed: number;
  status: Status;
}

interface QuizSubmission {
  id: number;
  student_id: number;
  type: string;
  status: string;
  obtained_marks?: number;
}

interface Quiz {
  id: number;
  name: string;
  total_marks?: number;
  submissions?: QuizSubmission[];
}

interface TopicMark {
  id: number;
  student_id: number;
  marks: number;
}

interface Topic {
  id: number;
  tracker_id: number;
  title: string;
  type: string;
  marks?: number;
  quiz_id?: number;
  quiz?: Quiz;
  topic_mark?: TopicMark[];
  status_progress: StatusProgress[];
}

interface TrackerData {
  id: number;
  name: string;
  type: string;
  topics: Topic[];
}

export default function TrackerTopicsPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(10);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [progressPoints, setProgressPoints] = useState<{
    earned_points: number;
    total_points: number;
    percentage: number;
  } | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";
  const schoolId = currentUser?.school;

  useEffect(() => {
    if (isStudent) {
      loadStudentTrackerData();
    } else {
      loadTrackerData();
    }
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

  useEffect(() => {
    if (isStudent && trackerId) {
      loadStudentProgressPoints();
    }
  }, [trackerId]);

  const loadStudentProgressPoints = async () => {
    try {
      const data = await fetchStudentTrackerPoints(Number(trackerId));
      setProgressPoints(data);
    } catch (error) {
      console.error("Failed to load progress points", error);
    }
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
      messageApi.error("Failed to update status");
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

  // const statusTypes = Array.from(
  //   new Set(
  //     topics?.flatMap((topic) =>
  //       topic?.status_progress?.map((sp) => sp.status.name)
  //     )
  //   )
  // );
  const statusTypes = trackerData?.status_progress?.map((sp) => sp.name) || [];

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {contextHolder}
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

          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-5 py-3">
            {/* Points Info */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Progress Points</span>
              <span className="text-lg font-semibold text-gray-900">
                {progressPoints?.earned_points || 0} / {progressPoints?.total_points || 0}
              </span>
            </div>
            {/* Circular Progress */}
            <Progress
              type="circle"
              percent={progressPoints?.percentage}
              size={40}
              strokeColor="#16a34a"
              format={(percent) => (
                <span className="text-green-700 font-semibold">
                  {percent}%
                </span>
              )}
            />
          </div>
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
                                    const trackerSubmission =
                                      topic.quiz?.submissions?.find(
                                        (s) =>
                                          s.student_id ===
                                            currentUser?.student &&
                                          s.type === "tracker"
                                      );

                                    if (
                                      trackerSubmission?.status === "completed"
                                    ) {
                                      e.preventDefault();
                                      messageApi.info(
                                        "You have already submitted this quiz."
                                      );
                                      return;
                                    }

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
                                    className={`text-gray-400`}
                                  />
                                </div>
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
                                                  checked:after:font-semibold 
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
                              {isStudent && (
                                <span className="text-primary">
                                  {topic.type === "quiz"
                                    ? topic.quiz?.submissions?.find(
                                        (s) =>
                                          s.student_id ===
                                            currentUser?.student &&
                                          s.type === "tracker"
                                      )?.obtained_marks || "0"
                                    : topic.topic_mark?.find(
                                        (m) =>
                                          m.student_id === currentUser?.student
                                      )?.marks || "0"}
                                  /{" "}
                                  {topic?.marks ||
                                    topic?.quiz?.total_marks ||
                                    "0"}
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
