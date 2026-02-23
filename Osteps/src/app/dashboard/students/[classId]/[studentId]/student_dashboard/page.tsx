"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Input,
  message,
  Popconfirm,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  SaveOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteBehaviour } from "@/services/behaviorApi";
import { fetchStudentProfileData } from "@/services/studentsApi";

type AnyObj = Record<string, any>;

type AssessmentRow = {
  key: string;
  termName: string;
  assessmentName: string;
  taskName: string;
  taskType: string;
  dueDate: string;
  allocatedMarks: number;
  submissionStatus: string;
  teacherScore: string;
};

type TrackerTopicRow = {
  key: string;
  trackerName: string;
  topicTitle: string;
  topicType: string;
  marks: number;
  completed: boolean;
};

function asArray<T = AnyObj>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toDateValue(value: unknown): number {
  const t = new Date(String(value ?? "")).getTime();
  return Number.isFinite(t) ? t : 0;
}

function isAttendanceRecord(row: AnyObj): boolean {
  const t = String(row?.behaviour?.name ?? "").toLowerCase();
  const d = String(row?.description ?? "").toLowerCase();
  return (
    t.includes("attendance") ||
    t.includes("present") ||
    t.includes("absent") ||
    d.includes("[attendance]")
  );
}

function isPresentRecord(row: AnyObj): boolean {
  const t = String(row?.behaviour?.name ?? "").toLowerCase();
  const d = String(row?.description ?? "").toLowerCase();
  return t.includes("present") || d.includes("present");
}

function isAbsentRecord(row: AnyObj): boolean {
  const t = String(row?.behaviour?.name ?? "").toLowerCase();
  const d = String(row?.description ?? "").toLowerCase();
  return t.includes("absent") || d.includes("absent");
}

export default function StudentProfilePage() {
  const params = useParams<{ classId?: string; studentId?: string }>();
  const queryClient = useQueryClient();
  const classId = String(params?.classId ?? "");
  const studentId = String(params?.studentId ?? "");
  const { currentUser, token } = useSelector((state: RootState) => state.auth);
  const canManageAttendance =
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";
  const [profileNote, setProfileNote] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-profile-v2", classId, studentId],
    queryFn: () => fetchStudentProfileData(studentId),
    enabled: Boolean(studentId),
  });

  const { data: noteData } = useQuery({
    queryKey: ["student-note", studentId],
    queryFn: async () => {
      const res = await fetch(`/api/students/${studentId}/notes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load note");
      return (await res.json()) as { note?: string };
    },
    enabled: Boolean(studentId),
  });

  useEffect(() => {
    setProfileNote(String(noteData?.note ?? ""));
  }, [noteData?.note]);

  const deleteAttendanceMutation = useMutation({
    mutationFn: (id: number) => deleteBehaviour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-profile-v2", classId, studentId],
      });
      message.success("Attendance record removed.");
    },
    onError: () => {
      message.error("Failed to remove attendance record.");
    },
  });

  const saveNoteMutation = useMutation({
    mutationFn: async (note: string) => {
      const res = await fetch(`/api/students/${studentId}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-note", studentId] });
      message.success("Note saved.");
    },
    onError: () => {
      message.error("Failed to save note.");
    },
  });

  const student = useMemo<AnyObj | null>(() => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return data as AnyObj;
  }, [data]);

  const behaviourRecords = useMemo(() => {
    const rows = asArray<AnyObj>(student?.behaviour);
    return [...rows].sort(
      (a, b) =>
        toDateValue(b?.date ?? b?.created_at) -
        toDateValue(a?.date ?? a?.created_at)
    );
  }, [student]);

  const attendanceRecords = useMemo(
    () => behaviourRecords.filter((row) => isAttendanceRecord(row)),
    [behaviourRecords]
  );

  const behaviorOnlyRecords = useMemo(
    () => behaviourRecords.filter((row) => !isAttendanceRecord(row)),
    [behaviourRecords]
  );

  const attendancePresentCount = useMemo(
    () => attendanceRecords.filter((row) => isPresentRecord(row)).length,
    [attendanceRecords]
  );

  const attendanceAbsentCount = useMemo(
    () => attendanceRecords.filter((row) => isAbsentRecord(row)).length,
    [attendanceRecords]
  );

  const terms = asArray<AnyObj>(student?.class?.term);
  const assessments = terms.flatMap((term) =>
    asArray<AnyObj>(term?.assign_assessments).map((a) => ({ term, assignment: a }))
  );

  const tasks = assessments.flatMap(({ assignment }) =>
    asArray<AnyObj>(assignment?.assessment?.tasks)
  );

  const completedTasks = tasks.filter((task) => {
    const sub = asArray<AnyObj>(task?.student_assessment_tasks)[0];
    return String(sub?.status ?? "").toLowerCase() === "completed";
  }).length;

  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const behaviorPoints = behaviorOnlyRecords.reduce(
    (sum, row) => sum + Number(row?.behaviour?.points ?? 0),
    0
  );

  const trackers = asArray<AnyObj>(student?.class?.assign_trackers);

  const trackerRows = trackers.map((assigned, index) => {
    const tracker = assigned?.tracker ?? {};
    const topics = asArray<AnyObj>(tracker?.topics);
    const done = topics.filter((topic) =>
      asArray<AnyObj>(topic?.status_progress).some((sp) => sp?.is_completed)
    ).length;
    return {
      id: String(
        assigned?.id ?? tracker?.id ?? `${tracker?.name ?? "tracker"}-${index}`
      ),
      name: String(tracker?.name ?? "Tracker"),
      done,
      total: topics.length,
    };
  });

  const assessmentRows = useMemo<AssessmentRow[]>(() => {
    return assessments.flatMap(({ term, assignment }, indexA) => {
      const termName = String(term?.name ?? "Term");
      const assessmentName = String(assignment?.assessment?.name ?? "Assessment");
      const assignmentTasks = asArray<AnyObj>(assignment?.assessment?.tasks);

      return assignmentTasks.map((task, indexT) => {
        const submission = asArray<AnyObj>(task?.student_assessment_tasks)[0] ?? {};
        return {
          key: `${termName}-${assessmentName}-${indexA}-${indexT}`,
          termName,
          assessmentName,
          taskName: String(task?.task_name ?? "N/A"),
          taskType: String(task?.task_type ?? "N/A"),
          dueDate: String(task?.due_date ?? "N/A"),
          allocatedMarks: Number(task?.allocated_marks ?? 0),
          submissionStatus: String(submission?.status ?? "not_submitted"),
          teacherScore:
            submission?.teacher_assessment_score != null
              ? String(submission.teacher_assessment_score)
              : "N/A",
        };
      });
    });
  }, [assessments]);

  const trackerTopicRows = useMemo<TrackerTopicRow[]>(() => {
    return trackers.flatMap((assigned, idxA) => {
      const tracker = assigned?.tracker ?? {};
      const trackerName = String(tracker?.name ?? "Tracker");
      const topics = asArray<AnyObj>(tracker?.topics);

      return topics.map((topic, idxT) => {
        const completed = asArray<AnyObj>(topic?.status_progress).some(
          (sp) => sp?.is_completed
        );

        return {
          key: `${trackerName}-${idxA}-${idxT}`,
          trackerName,
          topicTitle: String(topic?.title ?? "Untitled"),
          topicType: String(topic?.type ?? "topic"),
          marks: Number(topic?.marks ?? 0),
          completed,
        };
      });
    });
  }, [trackers]);

  const downloadCsv = (fileName: string, rows: string[][]) => {
    const esc = (value: string | number) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = rows.map((r) => r.map((c) => esc(c)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAttendanceCsv = () => {
    const rows: string[][] = [["Date", "Type", "Description", "Points"]];
    attendanceRecords.forEach((row) => {
      rows.push([
        String(row?.date || row?.created_at || ""),
        String(row?.behaviour?.name || "Attendance"),
        String(row?.description || ""),
        String(row?.behaviour?.points ?? ""),
      ]);
    });
    downloadCsv(`student-${studentId}-attendance.csv`, rows);
  };

  const exportAssessmentsCsv = () => {
    const rows: string[][] = [
      [
        "Term",
        "Assessment",
        "Task",
        "Type",
        "Due Date",
        "Allocated Marks",
        "Submission",
        "Teacher Score",
      ],
    ];
    assessmentRows.forEach((row) => {
      rows.push([
        row.termName,
        row.assessmentName,
        row.taskName,
        row.taskType,
        row.dueDate,
        String(row.allocatedMarks),
        row.submissionStatus,
        row.teacherScore,
      ]);
    });
    downloadCsv(`student-${studentId}-assessments.csv`, rows);
  };

  const saveNote = () => {
    saveNoteMutation.mutate(profileNote);
  };

  const exportPdf = async () => {
    const res = await fetch(`/api/students/${studentId}/profile-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: student?.student_name,
        email: student?.email,
        className: student?.class?.class_name,
        status: student?.status,
        completedTasks,
        totalTasks,
        behaviorPoints,
        attendanceTotal: attendanceRecords.length,
        attendancePresent: attendancePresentCount,
        attendanceAbsent: attendanceAbsentCount,
      }),
    });
    if (!res.ok) {
      message.error("Failed to export PDF.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-${studentId}-profile.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert
          type="error"
          showIcon
          message="Could not load student profile"
          description={error instanceof Error ? error.message : "Unknown error"}
        />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4 md:p-6">
        <Alert type="warning" showIcon message="Student record not found." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-3 md:p-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-semibold">
              {student?.student_name || "Student"}
            </div>
            <div className="text-gray-600">{student?.email || "No email"}</div>
            <div className="mt-2 flex gap-2">
              <Tag color="blue">ID: {student?.id ?? studentId}</Tag>
              <Tag color={student?.status === "active" ? "green" : "default"}>
                {String(student?.status || "unknown").toUpperCase()}
              </Tag>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Statistic
              title="Completed"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
            />
            <Statistic
              title="Total Tasks"
              value={totalTasks}
              prefix={<TeamOutlined />}
            />
            <Statistic
              title="Behaviour Points"
              value={behaviorPoints}
              prefix={<TrophyOutlined />}
            />
            <Statistic
              title="Class"
              value={student?.class?.class_name || "N/A"}
              prefix={<UserOutlined />}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button icon={<DownloadOutlined />} onClick={exportAttendanceCsv}>
            Attendance CSV
          </Button>
          <Button icon={<DownloadOutlined />} onClick={exportAssessmentsCsv}>
            Assessments CSV
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={exportPdf}>
            Print / PDF
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Attendance Total" className="rounded-2xl">
            <Statistic value={attendanceRecords.length} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Present" className="rounded-2xl">
            <Statistic value={attendancePresentCount} valueStyle={{ color: "#389e0d" }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Absent" className="rounded-2xl">
            <Statistic value={attendanceAbsentCount} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
      </Row>

      <Card title="Academic Progress" className="rounded-2xl">
        <Progress
          percent={progressPercent}
          status={progressPercent >= 100 ? "success" : "active"}
        />
        <div className="mt-2 text-sm text-gray-600">
          {completedTasks} / {totalTasks} tasks completed
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Attendance (Recent 10)" className="rounded-2xl">
            <div className="space-y-2">
              {attendanceRecords.slice(0, 10).map((row) => {
                const name = String(row?.behaviour?.name ?? "Attendance");
                const rowId = Number(row?.id);
                return (
                  <div
                    key={String(row?.id)}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-gray-500">
                        {row?.date || row?.created_at || "No date"}
                      </div>
                    </div>
                    <Space>
                      <Tag color={name.toLowerCase().includes("absent") ? "volcano" : "green"}>
                        {name}
                      </Tag>
                      {canManageAttendance && Number.isFinite(rowId) && (
                        <Popconfirm
                          title="Remove this attendance record?"
                          onConfirm={() => deleteAttendanceMutation.mutate(rowId)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleteAttendanceMutation.isPending}
                          />
                        </Popconfirm>
                      )}
                    </Space>
                  </div>
                );
              })}
              {attendanceRecords.length === 0 && (
                <div className="text-sm text-gray-500">No attendance records.</div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Behaviour (Recent 10)" className="rounded-2xl">
            <div className="space-y-2">
              {behaviorOnlyRecords.slice(0, 10).map((row) => {
                const points = Number(row?.behaviour?.points ?? 0);
                return (
                  <div
                    key={String(row?.id)}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <div className="font-medium">
                        {row?.behaviour?.name || "Behaviour"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {row?.description || "No description"}
                      </div>
                    </div>
                    <Tag color={points >= 0 ? "green" : "volcano"}>
                      {points >= 0 ? `+${points}` : points}
                    </Tag>
                  </div>
                );
              })}
              {behaviorOnlyRecords.length === 0 && (
                <div className="text-sm text-gray-500">No behaviour records.</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Assessments By Term" className="rounded-2xl">
        <Collapse
          items={terms.map((term, idx) => {
            const termName = String(term?.name ?? `Term ${idx + 1}`);
            const termRows = assessmentRows.filter((r) => r.termName === termName);

            return {
              key: termName,
              label: `${termName} (${termRows.length} tasks)`,
              children: (
                <Table<AssessmentRow>
                  rowKey="key"
                  size="small"
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 900 }}
                  columns={[
                    { title: "Assessment", dataIndex: "assessmentName", width: 180 },
                    { title: "Task", dataIndex: "taskName", width: 220 },
                    {
                      title: "Type",
                      dataIndex: "taskType",
                      width: 120,
                      render: (v: string) => <Tag>{String(v || "N/A")}</Tag>,
                    },
                    { title: "Due", dataIndex: "dueDate", width: 120 },
                    { title: "Marks", dataIndex: "allocatedMarks", width: 90 },
                    {
                      title: "Submission",
                      dataIndex: "submissionStatus",
                      width: 130,
                      render: (v: string) => {
                        const low = String(v || "not_submitted").toLowerCase();
                        const color = low === "completed" ? "green" : "orange";
                        return <Tag color={color}>{low.toUpperCase()}</Tag>;
                      },
                    },
                    { title: "Score", dataIndex: "teacherScore", width: 90 },
                  ]}
                  dataSource={termRows}
                />
              ),
            };
          })}
        />
      </Card>

      <Card title="Tracker Topic Drill-Down" className="rounded-2xl">
        <Table<TrackerTopicRow>
          rowKey="key"
          size="small"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          columns={[
            { title: "Tracker", dataIndex: "trackerName", width: 180 },
            { title: "Topic", dataIndex: "topicTitle", width: 260 },
            {
              title: "Type",
              dataIndex: "topicType",
              width: 110,
              render: (v: string) => <Tag>{String(v || "topic").toUpperCase()}</Tag>,
            },
            { title: "Marks", dataIndex: "marks", width: 90 },
            {
              title: "Completed",
              dataIndex: "completed",
              width: 120,
              render: (v: boolean) => (
                <Tag color={v ? "green" : "default"}>{v ? "YES" : "NO"}</Tag>
              ),
            },
          ]}
          dataSource={trackerTopicRows}
        />
      </Card>

      <Card title="Teacher/Admin Notes" className="rounded-2xl">
        <div className="space-y-3">
          <Input.TextArea
            rows={4}
            value={profileNote}
            onChange={(e) => setProfileNote(e.target.value)}
            placeholder="Write private notes for this student (saved in browser for now)."
          />
          <Button type="primary" icon={<SaveOutlined />} onClick={saveNote}>
            Save Note
          </Button>
        </div>
      </Card>

      <Card title="Student Details" className="rounded-2xl">
        <Row gutter={[16, 12]}>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Username</div>
            <div>{student?.user_name || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Phone</div>
            <div>{student?.phone_number || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Class ID</div>
            <div>{student?.class_id || classId || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">School</div>
            <div>{student?.school?.name || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">School Email</div>
            <div>{student?.school?.email || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Last Updated</div>
            <div>
              <CalendarOutlined className="mr-1" />
              {student?.updated_at || "N/A"}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
