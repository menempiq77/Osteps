"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Languages,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Input, Modal, Progress, Spin, message } from "antd";
import {
  updateTopicStatus,
  fetchTrackerStudentTopics,
} from "@/services/api";
import {
  fetchStudentTrackerPoints,
  fetchMyTrackerPointClaims,
  submitTrackerPointsClaim,
} from "@/services/trackersApi";

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
  const [bucketMarks, setBucketMarks] = useState<Record<number, number>>({});
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const isStudent = currentUser?.role === "STUDENT";
  const bucketStorageKey =
    currentUser?.student && trackerId
      ? `tracker-bucket:${currentUser.student}:${trackerId}`
      : "";
  const claimStorageKey =
    currentUser?.student && trackerId
      ? `tracker-claim:${currentUser.student}:${trackerId}`
      : "";

  useEffect(() => {
    if (!currentUser?.student || !trackerId) return;
    loadStudentTrackerData();
  }, [trackerId, currentUser?.student]);


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

  useEffect(() => {
    if (!isStudent || !bucketStorageKey) return;
    try {
      const raw = localStorage.getItem(bucketStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, number>;
      const normalized: Record<number, number> = {};
      Object.entries(parsed || {}).forEach(([k, v]) => {
        const key = Number(k);
        const value = Number(v);
        if (Number.isFinite(key) && Number.isFinite(value)) {
          normalized[key] = value;
        }
      });
      setBucketMarks(normalized);
    } catch {
      setBucketMarks({});
    }
  }, [bucketStorageKey, isStudent]);

  useEffect(() => {
    if (!isStudent || !trackerId) return;

    const loadClaimsIntoBucket = async () => {
      try {
        const claims = await fetchMyTrackerPointClaims();
        if (!Array.isArray(claims) || claims.length === 0) return;

        const trackerClaims = claims.filter(
          (c: any) => Number(c?.tracker_id) === Number(trackerId)
        );
        if (trackerClaims.length === 0) return;

        const latest = trackerClaims.sort(
          (a: any, b: any) =>
            Number(b?.id ?? 0) - Number(a?.id ?? 0)
        )[0];

        const rawBucket =
          latest?.bucket_marks_json ??
          latest?.bucket_marks ??
          latest?.bucketMarks ??
          null;

        let parsed: Record<string, number> = {};
        if (typeof rawBucket === "string" && rawBucket.trim()) {
          parsed = JSON.parse(rawBucket);
        } else if (rawBucket && typeof rawBucket === "object") {
          parsed = rawBucket as Record<string, number>;
        }

        const normalized: Record<number, number> = {};
        Object.entries(parsed || {}).forEach(([k, v]) => {
          const key = Number(k);
          const value = Number(v);
          if (Number.isFinite(key) && Number.isFinite(value)) {
            normalized[key] = value;
          }
        });

        if (Object.keys(normalized).length > 0) {
          setBucketMarks((prev) =>
            Object.keys(prev).length > 0 ? prev : normalized
          );
        }

        const status = String(latest?.status ?? "").toLowerCase();
        if (status === "submitted" || status === "verified") {
          setClaimSubmitted(true);
          if (claimStorageKey) localStorage.setItem(claimStorageKey, "1");
        }
      } catch (error) {
        // Non-blocking: local bucket still works if API is unavailable
        console.error("Failed to load tracker point claims", error);
      }
    };

    loadClaimsIntoBucket();
  }, [isStudent, trackerId, claimStorageKey]);

  useEffect(() => {
    if (!isStudent || !claimStorageKey) return;
    setClaimSubmitted(localStorage.getItem(claimStorageKey) === "1");
  }, [claimStorageKey, isStudent]);

  useEffect(() => {
    if (!isStudent || !bucketStorageKey) return;
    localStorage.setItem(bucketStorageKey, JSON.stringify(bucketMarks));
  }, [bucketMarks, bucketStorageKey, isStudent]);

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

  const handleEnterMarks = (topic: Topic) => {
    setSelectedTopic(topic);
    const existing = bucketMarks[topic.id];
    setMarks(Number.isFinite(existing) ? String(existing) : "");
    setMarkModal(true);
  };
  const handleSubmitMarks = async () => {
      if (!marks) {
        messageApi.warning("Please enter marks");
        return;
      }
  
      if (!selectedTopic) {
        messageApi.warning("No topic selected");
        return;
      }
  
      try {
        const marksValue = Number(marks);
        if (isNaN(marksValue)) {
          messageApi.warning("Please enter valid marks");
          return;
        }
  
        // Get the maximum marks from the topic (10 in this case)
        const maxMarks = selectedTopic.marks ? Number(selectedTopic.marks) : 100;
  
        if (marksValue > maxMarks) {
          messageApi.warning(`Marks cannot exceed ${maxMarks}`);
          return;
        }
  
        setBucketMarks((prev) => ({
          ...prev,
          [selectedTopic.id]: marksValue,
        }));
        messageApi.success(
          `Saved ${marksValue}/${maxMarks} to Practice Bucket for ${selectedTopic.title}.`
        );
        setMarkModal(false);
        setMarks("");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Failed to save bucket marks";
        messageApi.error(errorMessage);
        console.error("Error saving bucket marks:", error);
      }
  };

  const nonQuizTopics = topics.filter((t) => t.type !== "quiz");
  const completedTopicIds = new Set(
    nonQuizTopics
      .filter((topic) => topic.status_progress?.some((sp) => sp.is_completed === 1))
      .map((topic) => topic.id)
  );
  const hasBucketForCompleted = Array.from(completedTopicIds).every(
    (topicId) => typeof bucketMarks[topicId] === "number"
  );
  const isTrackerReadyToClaim =
    nonQuizTopics.length > 0 &&
    completedTopicIds.size === nonQuizTopics.length &&
    hasBucketForCompleted;

  const bucketTotal = Object.entries(bucketMarks).reduce(
    (sum, [topicId, value]) =>
      completedTopicIds.has(Number(topicId)) ? sum + Number(value || 0) : sum,
    0
  );

  const handleClaimPoints = async () => {
    if (!isTrackerReadyToClaim) {
      messageApi.warning(
        "Complete all tracker topics and enter practice marks before claiming."
      );
      return;
    }
    try {
      setClaimSubmitting(true);
      await submitTrackerPointsClaim({
        tracker_id: Number(trackerId),
        class_id: classId ? Number(classId) : undefined,
        bucket_marks: Object.fromEntries(
          Object.entries(bucketMarks).map(([k, v]) => [String(k), Number(v)])
        ),
        bucket_total: bucketTotal,
      });
      if (claimStorageKey) {
        localStorage.setItem(claimStorageKey, "1");
      }
      setClaimSubmitted(true);
      messageApi.success("Claim submitted. Teacher verification is required.");
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit claim.";
      messageApi.error(String(errMsg));
    } finally {
      setClaimSubmitting(false);
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
          {isStudent && (
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-gray-600">
                Practice Bucket:{" "}
                <span className="font-semibold text-amber-700">
                  {bucketTotal}
                </span>{" "}
                points (not in leaderboard yet)
              </div>
              <Button
                type="primary"
                className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
                disabled={!isTrackerReadyToClaim || claimSubmitted}
                loading={claimSubmitting}
                onClick={handleClaimPoints}
              >
                {claimSubmitted ? "Claim Submitted" : "Claim My Points"}
              </Button>
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
                <th className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  {isStudent ? "Marks" : "Action"}
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
                      <td className="p-4 whitespace-nowrap text-center border-r border-gray-200">
                        {isStudent && (
                          <span className="text-primary">
                            {topic.type === "quiz"
                              ? topic.quiz?.submissions?.find(
                                  (s) =>
                                    s.student_id ===
                                      currentUser?.student &&
                                    s.type === "tracker"
                                )?.obtained_marks || "0"
                              : (bucketMarks[topic.id] ??
                                  topic.topic_mark?.find(
                                    (m) =>
                                      m.student_id === currentUser?.student
                                  )?.marks) ||
                                "0"}
                            /{" "}
                            {topic?.marks ||
                              topic?.quiz?.total_marks ||
                              "0"}
                          </span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap text-center">
                        {topic.type !== "quiz" && (
                            <Button
                              className={`!text-primary ${
                                (!topic?.status_progress?.some((sp) => sp.is_completed === 1) ||
                                  topic.topic_mark?.some(
                                    (m) =>
                                      m.student_id === currentUser?.student &&
                                      m.teacher_locked === 1
                                  ) ||
                                  claimSubmitted)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !topic?.status_progress?.some((sp) => sp.is_completed === 1) ||
                                topic.topic_mark?.some(
                                  (m) =>
                                    m.student_id === currentUser?.student &&
                                    m.teacher_locked === 1
                                ) ||
                                claimSubmitted
                              }
                              onClick={() => handleEnterMarks(topic)}
                            >
                              Add To Bucket
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

      {/* Marks Modal */}
        <Modal
          title={`Practice Bucket Marks (Max: ${selectedTopic?.marks || 100})`}
          open={markModal}
          onOk={handleSubmitMarks}
          onCancel={() => setMarkModal(false)}
          okText="Save To Bucket"
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
