"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Input, Modal, Progress, Spin, message } from "antd";
import {
  updateTopicStatus,
  fetchTrackerStudentTopics,
  addTopicMark,
} from "@/services/api";
import {
  fetchTrackers,
  fetchStudentTrackerPoints,
} from "@/services/trackersApi";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";

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

const normalizeProgressOption = (value: string) =>
  String(value || "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export default function TrackerTopicsPage() {
  const { trackerId, classId } = useParams();
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

  const [markModal, setMarkModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [marks, setMarks] = useState("");
  const [savingMarks, setSavingMarks] = useState(false);
  const [lastMarksSavedAt, setLastMarksSavedAt] = useState<number>(0);

  const [messageApi, contextHolder] = message.useMessage();
  const isStudent = currentUser?.role === "STUDENT";
  const currentStudentId = Number(currentUser?.student);
  const [deadline, setDeadline] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.student || !trackerId) return;
    loadStudentTrackerData();
  }, [trackerId, currentUser?.student]);

  useEffect(() => {
    if (!classId || !trackerId) return;
    (async () => {
      try {
        const list = await fetchTrackers(Number(classId));
        const match = list?.find((t: any) => {
          const id = Number(t?.tracker_id ?? t?.id);
          return id === Number(trackerId);
        });
        const d =
          match?.tracker?.deadline ??
          match?.tracker?.deadline_at ??
          match?.tracker?.deadline_date ??
          match?.tracker?.last_updated ??
          match?.deadline ??
          match?.deadline_at ??
          match?.deadline_date ??
          match?.last_updated ??
          null;
        setDeadline(d ? String(d).slice(0, 10) : null);
      } catch {
        setDeadline(null);
      }
    })();
  }, [classId, trackerId]);


  const loadStudentTrackerData = async (opts?: { showLoading?: boolean }) => {
    try {
      const showLoading = opts?.showLoading ?? true;
      if (showLoading) setLoading(true);
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
      if (opts?.showLoading ?? true) setLoading(false);
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
      
      // Optimistically update the UI first
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

      // Then update the server
      const response = await updateTopicStatus(topicId, statusId, newStatus === 1);
      
      // Verify the update was successful
      if (response && response.success !== false) {
        messageApi.success(newStatus === 1 ? "Topic marked as completed!" : "Topic marked as pending");
        // Reload the data to ensure consistency across all viewers
        await loadStudentTrackerData({ showLoading: false });
      } else {
        // Revert the optimistic update if API call failed
        setTopics((prev) =>
          prev.map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                status_progress: topic.status_progress.map((sp) =>
                  sp.status_id === statusId
                    ? { ...sp, is_completed: currentStatus }
                    : sp
              ),
              };
            }
            return topic;
          })
        );
        messageApi.error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status", error);
      messageApi.error("Failed to update status");
      
      // Revert the optimistic update on error
      setTopics((prev) =>
        prev.map((topic) => {
          if (topic.id === topicId) {
            return {
              ...topic,
              status_progress: topic.status_progress.map((sp) =>
                sp.status_id === statusId
                  ? { ...sp, is_completed: currentStatus }
                  : sp
              ),
            };
          }
          return topic;
        })
      );
    }
  };

  const handleEnterMarks = (topic: Topic) => {
    // Prevent "click-through" where the modal closes and the same click hits the
    // underlying button, instantly reopening the modal.
    if (Date.now() - lastMarksSavedAt < 600) return;
    setSelectedTopic(topic);
    const existing =
      topic.topic_mark?.find((m) => Number(m.student_id) === currentStudentId)
        ?.marks ?? null;
    setMarks(existing === null || existing === undefined ? "" : String(existing));
    setMarkModal(true);
  };
  const handleSubmitMarks = async () => {
      if (savingMarks) return;
      if (marks.trim() === "") {
        messageApi.warning("Please enter points");
        return;
      }
  
      if (!selectedTopic) {
        messageApi.warning("No topic selected");
        return;
      }
   
      try {
        setSavingMarks(true);
        const marksValue = Number(marks);
        if (isNaN(marksValue)) {
          messageApi.warning("Please enter valid points");
          return;
        }
        if (!Number.isInteger(marksValue)) {
          messageApi.warning("Please enter a whole number");
          return;
        }
  
        // Get the maximum marks from the topic (10 in this case)
        const maxMarks = selectedTopic.marks ? Number(selectedTopic.marks) : 100;
  
        if (marksValue > maxMarks) {
          messageApi.warning(`Points cannot exceed ${maxMarks}`);
          return;
        }

        if (!Number.isFinite(currentStudentId) || currentStudentId <= 0) {
          messageApi.error("Student profile not found");
          return;
        }

        await addTopicMark(
          selectedTopic.id,
          marksValue,
          currentStudentId,
          Number(trackerId),
          classId ? Number(classId) : undefined
        );

        messageApi.success(
          `Saved ${marksValue}/${maxMarks} for ${selectedTopic.title}.`
        );
        setMarkModal(false);
        setMarks("");
        setSelectedTopic(null);
        setLastMarksSavedAt(Date.now());

        await Promise.all([
          loadStudentTrackerData({ showLoading: false }),
          loadStudentProgressPoints(),
        ]);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Failed to save points";
        messageApi.error(errorMessage);
        console.error("Error saving marks:", error);
      } finally {
        setSavingMarks(false);
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

  if (loading && !trackerData)
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
        <div className="mt-3 md:mt-0 text-sm text-gray-600">
          <span className="mr-2 font-medium text-gray-700">Deadline:</span>
          <DeadlineCountdown deadline={deadline} showDate />
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {trackerData?.name || "Tracker Progress"}
          </h1>

          {trackerData?.claim_certificate !== 1 && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-5 py-3">
              {/* Points Info */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Progress Points</span>
                <span className="text-lg font-semibold text-gray-900">
                  {progressPoints?.earned_points || 0} /{" "}
                  {progressPoints?.total_points || 0}
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
          )}
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full"
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
                <th className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Points
                </th>
                <th className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topics?.slice(0, visibleTopics)?.map((topic, index) => (
                    <tr
                      key={topic.id ?? `${topic.title}-${index}`}
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
                              <div className="flex justify-center items-center">
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
                                    h-5 w-5 cursor-pointer 
                                    accent-primary
                                    disabled:cursor-not-allowed disabled:opacity-50
                                  `}
                                  style={{
                                    accentColor: statusProgress?.is_completed === 1 ? '#16a34a' : undefined,
                                  }}
                                />
                                {statusProgress?.is_completed === 1 && isStudent && (
                                  <span className="ml-1 text-primary font-bold text-lg">✓</span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-4 whitespace-nowrap text-center border-r border-gray-200">
                        <span className="text-primary">
                          {topic.type === "quiz"
                            ? topic.quiz?.submissions?.find(
                                (s) =>
                                  Number(s.student_id) === currentStudentId &&
                                  s.type === "tracker"
                              )?.obtained_marks || "0"
                            : topic.topic_mark?.find(
                                (m) => Number(m.student_id) === currentStudentId
                              )?.marks || "0"}
                          /{" "}
                          {topic?.marks || topic?.quiz?.total_marks || "0"}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-center">
                        {topic.type !== "quiz" && (
                            <Button
                              className={`!text-primary ${
                                !topic?.status_progress?.some(
                                  (sp) => sp.is_completed === 1
                                )
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !topic?.status_progress?.some(
                                  (sp) => sp.is_completed === 1
                                )
                              }
                              onClick={() => handleEnterMarks(topic)}
                            >
                              Enter Points
                            </Button>
                          )}
                      </td>
                    </tr>
              ))}
            </tbody>
          </table>
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

      {/* Points Modal */}
        <Modal
          title={`Enter Points (Max: ${selectedTopic?.marks || 100})`}
          open={markModal}
          onOk={handleSubmitMarks}
          onCancel={() => setMarkModal(false)}
          okText="Save Points"
          okButtonProps={{
            className: "!bg-primary !text-white",
            loading: savingMarks,
            disabled: savingMarks,
          }}
          centered
        >
          <div className="my-4">
            <Input
              name="marks"
              type="number"
              placeholder={`Enter points (0-${selectedTopic?.marks || 100})`}
              min={0}
              max={selectedTopic?.marks || 100}
              step={1}
              inputMode="numeric"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>
        </Modal>
        
    </div>
  );
}
