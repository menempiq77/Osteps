"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GripVertical } from "lucide-react";
import {
  Button,
  Input,
  Modal,
  Progress,
  Select,
  Spin,
  Tooltip,
  message,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchTrackerTopics, addTopicMark } from "@/services/api";
import { fetchStudents } from "@/services/studentsApi";
import { useQuery } from "@tanstack/react-query";
import { BellOutlined } from "@ant-design/icons";
import {
  checkCertificateRequest,
  fetchTrackers,
  fetchTeacherTrackerPoints,
  uploadCertificate,
} from "@/services/trackersApi";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";

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

interface Student {
  id: number;
  student_name: string;
  // Add other student properties as needed
}

export default function ViewTrackerTopicPage() {
  const { trackerId, classId } = useParams();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(10);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [markModal, setMarkModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [marks, setMarks] = useState("");
  const [submittingMarks, setSubmittingMarks] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [certificateModal, setCertificateModal] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateRemarks, setCertificateRemarks] = useState("");
  const [certificateClaimId, setCertificateClaimId] = useState<number | null>(
    null
  );

  const [progressPoints, setProgressPoints] = useState<{
    earned_points: number;
    total_points: number;
    percentage: number;
  } | null>(null);

  const [hasCertificateRequest, setHasCertificateRequest] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [deadline, setDeadline] = useState<string | null>(null);

  const checkCertificate = async () => {
    if (!selectedStudentId) return;

    try {
      const data = await checkCertificateRequest({
        tracker_id: Number(trackerId),
        student_id: selectedStudentId,
      });

      // If there's a request, store the claim_id
      if (Array.isArray(data) && data.length > 0) {
        setHasCertificateRequest(true);
        setCertificateClaimId(data[0].id); // take the first request's id
      } else {
        setHasCertificateRequest(false);
        setCertificateClaimId(null);
      }
    } catch (err) {
      console.error("Failed to check certificate request:", err);
      setHasCertificateRequest(false);
      setCertificateClaimId(null);
    }
  };

  useEffect(() => {
    loadTeacherProgressPoints();
  }, [trackerId, selectedStudentId]);

  const loadTeacherProgressPoints = async () => {
    if (!trackerId || !selectedStudentId) return;

    try {
      const data = await fetchTeacherTrackerPoints(
        Number(trackerId),
        selectedStudentId
      );
      setProgressPoints(data);
    } catch (error) {
      console.error("Failed to load progress points", error);
      setProgressPoints(null);
    }
  };
  useEffect(() => {
    if (!selectedStudentId) {
      setProgressPoints(null);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    checkCertificate();
  }, [selectedStudentId, trackerId]);

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

  const {
    data: trackerData,
    isLoading,
    refetch: refetchTracker,
  } = useQuery({
    queryKey: ["tracker-topics", trackerId],
    queryFn: () => fetchTrackerTopics(Number(trackerId)),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    loadStudents();
  }, [classId]);

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

  const handleEnterMarks = (topic: Topic) => {
    if (!selectedStudentId) {
      messageApi.warning("Please select a student first");
      return;
    }
    setSelectedTopic(topic);
    setMarkModal(true);
  };

  useEffect(() => {
    setTopics(trackerData?.topics || []);
  }, [trackerData]);

  const handleSubmitMarks = async () => {
    if (submittingMarks) return; 

    if (!marks) {
      messageApi.warning("Please enter marks");
      return;
    }

    if (!selectedTopic) {
      messageApi.warning("No topic selected");
      return;
    }

    if (!selectedStudentId) {
      messageApi.warning("No student selected");
      return;
    }

    try {
       setSubmittingMarks(true);

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

      await addTopicMark(
        selectedTopic.id,
        marksValue,
        selectedStudentId,
        Number(trackerId),
        classId ? Number(classId) : undefined
      );
      await refetchTracker();

      messageApi.success(`Marks ${marks} submitted for ${selectedTopic.title}`);
      setMarkModal(false);
      setMarks("");
    } catch (error) {
      messageApi.error("Failed to submit marks");
      console.error("Error submitting marks:", error);
    } finally {
      setSubmittingMarks(false);
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
        <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {trackerData?.name || "Tracker Progress"}
          </h1>

          <div className="text-sm text-gray-600">
            <span className="mr-2 font-medium text-gray-700">Deadline:</span>
            <DeadlineCountdown deadline={deadline} showDate />
          </div>

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
                  <span className="text-green-700 font-semibold">{percent}%</span>
                )}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Tooltip title="Certificate Request">
              <div
                className={`relative flex items-center ${
                  !selectedStudentId
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (hasCertificateRequest && selectedStudentId) {
                    setCertificateModal(true);
                  }
                }}
              >
                <BellOutlined className="text-orange-500 text-lg" />

                {hasCertificateRequest && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                )}
              </div>
            </Tooltip>

            <Select
              value={selectedStudentId || undefined}
              onChange={(val) => setSelectedStudentId(val)}
              placeholder="Select Student"
              className="w-48"
              style={{ minWidth: "120px" }}
              options={students?.map((student) => ({
                label: student.student_name,
                value: student.id,
              }))}
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
                            <span>{String(statusName || "").toUpperCase()}</span>
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
                                    <div className="flex justify-center items-center">
                                      <input
                                        type="checkbox"
                                        readOnly
                                        disabled
                                        checked={
                                          studentProgress?.is_completed === 1
                                        }
                                        className={`
                                          h-5 w-5 cursor-not-allowed 
                                          accent-primary
                                          disabled:opacity-50
                                        `}
                                        style={{
                                          accentColor: studentProgress?.is_completed === 1 ? '#16a34a' : undefined,
                                        }}
                                      />
                                      {studentProgress?.is_completed === 1 && (
                                        <span className="ml-1 text-primary font-bold text-lg">✓</span>
                                      )}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-4 whitespace-nowrap text-center border-r border-gray-200">
                              <span>
                                {topic.type === "quiz"
                                  ? topic.quiz?.submissions?.find(
                                      (s) =>
                                        s.student_id === selectedStudentId &&
                                        s.type === "tracker"
                                    )?.obtained_marks || "0"
                                  : topic.topic_mark?.find(
                                      (m) =>
                                        Number(m.student_id) ===
                                        Number(selectedStudentId)
                                    )?.marks || "0"}
                                /{" "}
                                {topic?.marks ||
                                  topic?.quiz?.total_marks ||
                                  "0"}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap text-center">
                              {topic.type !== "quiz" && (
                                <Button
                                  title={
                                    !selectedStudentId &&
                                    "Please select a student first"
                                  }
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
        okButtonProps={{ 
          className: "!bg-primary !text-white",
          loading: submittingMarks,
          disabled: submittingMarks,
        }}
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
      <Modal
        title="Upload Certificate"
        open={certificateModal}
        onCancel={() => {
          setCertificateModal(false);
          setCertificateFile(null);
          setCertificateRemarks("");
        }}
        onOk={async () => {
          if (!certificateFile) {
            messageApi.warning("Please upload a file");
            return;
          }

          if (!selectedStudentId) {
            messageApi.warning("Please select a student first");
            return;
          }

          try {
            await uploadCertificate({
              claim_id: certificateClaimId!,
              certificate: certificateFile,
              remarks: certificateRemarks,
            });

            messageApi.success("Certificate uploaded");
            setCertificateModal(false);
            setCertificateFile(null);
            setCertificateRemarks("");

            await checkCertificate();
          } catch (err) {
            console.error(err);
            messageApi.error("Failed to Certificate uploaded");
          }
        }}
        okText="Submit"
        okButtonProps={{ className: "!bg-primary !text-white" }}
        centered
      >
        <div className="space-y-4">
          <div className="mb-3">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setCertificateFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <Input.TextArea
            placeholder="Enter remarks (optional)"
            value={certificateRemarks}
            onChange={(e) => setCertificateRemarks(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
