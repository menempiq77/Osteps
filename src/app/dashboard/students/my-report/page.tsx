"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Breadcrumb, Card, List, Select, Spin, Statistic, Tabs, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchBehaviour, fetchBehaviourType } from "@/services/behaviorApi";
import { fetchAssessmentByStudent, fetchTasks, fetchStudentTasks } from "@/services/api";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { fetchTerm } from "@/services/termsApi";
import { isSubmittedStatus } from "@/lib/studentSubmissionStatus";
import { normalizeTaskRecord } from "@/lib/taskTypeMetadata";

interface CurrentUser {
  student?: string;
  studentClass?: string | number;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
  studentClassName?: string;
}

type BehaviorType = {
  id: string;
  name: string;
  points: number;
  color: string;
};

type Behavior = {
  id: string;
  behaviour_id: string;
  description: string;
  date: string;
  teacher?: { teacher_name?: string } | string;
  points: number;
  teacher_name: string;
  subject_name?: string;
  subject?: { name?: string; subject_name?: string };
  behaviour?: {
    id?: string;
    name?: string;
    points?: number;
    color?: string;
  };
};

const resolveBehaviorMeta = (behavior: Behavior, types: BehaviorType[]) => {
  const matchId = String(behavior?.behaviour_id ?? behavior?.behaviour?.id ?? "");
  const matched = types.find((t) => String(t.id) === matchId);
  if (matched) return matched;
  if (behavior?.behaviour?.name) {
    return {
      name: behavior.behaviour.name,
      points: behavior.behaviour.points ?? behavior.points ?? 0,
      color: behavior.behaviour.color ?? "default",
    };
  }
  return { name: "Unknown", points: behavior?.points ?? 0, color: "default" };
};

export default function StudentMyReportPage() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();
  const studentId = currentUser?.student;

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Record<string, any> | null>(null);

  // Behavior
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>([]);
  const [behaviorFilter, setBehaviorFilter] = useState<string>("all");

  // Assessments
  const [terms, setTerms] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [enrichedAssessments, setEnrichedAssessments] = useState<
    { id: number; title: string; totalTasks: number; completedTasks: number; totalMarks: number; earnedMarks: number }[]
  >([]);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);

  const scopedSubjectId = canUseSubjectContext ? activeSubjectId ?? undefined : undefined;

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [profile, behaviorData, behaviorTypeData] = await Promise.allSettled([
          fetchStudentProfileData(Number(studentId), scopedSubjectId),
          fetchBehaviour(Number(studentId), scopedSubjectId),
          fetchBehaviourType(scopedSubjectId),
        ]);

        if (!cancelled) {
          if (profile.status === "fulfilled") setProfileData(profile.value);
          if (behaviorData.status === "fulfilled") {
            const data = Array.isArray(behaviorData.value) ? behaviorData.value : [];
            setBehaviors(data);
          }
          if (behaviorTypeData.status === "fulfilled") {
            setBehaviorTypes(Array.isArray(behaviorTypeData.value) ? behaviorTypeData.value : []);
          }
        }
      } catch (err) {
        console.error("Failed to load report data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [studentId, scopedSubjectId]);

  useEffect(() => {
    const classId = Number(
      profileData?.class_id ?? profileData?.class?.id ?? currentUser?.studentClass ?? 0
    );
    if (!classId || classId <= 0) return;
    let cancelled = false;

    const loadTerms = async () => {
      try {
        const termData = await fetchTerm(classId);
        if (!cancelled && Array.isArray(termData) && termData.length > 0) {
          setTerms(termData);
          setSelectedTermId(termData[0].id);
        }
      } catch (err) {
        console.error("Failed to load terms:", err);
      }
    };

    loadTerms();
    return () => { cancelled = true; };
  }, [profileData, currentUser?.studentClass]);

  useEffect(() => {
    if (selectedTermId == null || !studentId) return;
    let cancelled = false;

    const loadAssessments = async () => {
      setAssessmentsLoading(true);
      try {
        const data = await fetchAssessmentByStudent(selectedTermId, scopedSubjectId);
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setAssessments(list);
          const enriched = await Promise.all(
            list
              .filter((a: any) => a.type === "assessment")
              .map(async (assessment: any) => {
                try {
                  const [allTasks, studentTasks] = await Promise.all([
                    fetchTasks(assessment.id),
                    fetchStudentTasks(assessment.id),
                  ]);
                  const taskArray = Array.isArray(allTasks?.data) ? allTasks.data : [];
                  const studentTaskArray = Array.isArray(studentTasks?.data) ? studentTasks.data : [];

                  let completedTasks = 0;
                  let totalMarks = 0;
                  let earnedMarks = 0;

                  for (const task of taskArray) {
                    const normalized = normalizeTaskRecord(task);
                    const matchingStudentTask = studentTaskArray.find(
                      (st: any) =>
                        String(st.task_id ?? st.id) === String(normalized.id) &&
                        String(st.student_id) === String(studentId)
                    );
                    const hasSubmission = Boolean(matchingStudentTask);
                    if (hasSubmission) completedTasks++;

                    if (normalized.type === "quiz") {
                      totalMarks += Number(normalized.total_marks) || 0;
                      earnedMarks += Number(matchingStudentTask?.teacher_assessment_mark ?? matchingStudentTask?.teacher_assessment_score ?? 0);
                    } else {
                      totalMarks += Number(normalized.allocated_marks) || 0;
                      earnedMarks += Number(matchingStudentTask?.teacher_assessment_score ?? matchingStudentTask?.teacher_assessment_marks ?? 0);
                    }
                  }

                  return {
                    id: assessment.id,
                    title: assessment.name || assessment.title || `Assessment ${assessment.id}`,
                    totalTasks: taskArray.length,
                    completedTasks,
                    totalMarks,
                    earnedMarks,
                  };
                } catch {
                  return {
                    id: assessment.id,
                    title: assessment.name || assessment.title || `Assessment ${assessment.id}`,
                    totalTasks: 0,
                    completedTasks: 0,
                    totalMarks: 0,
                    earnedMarks: 0,
                  };
                }
              })
          );
          if (!cancelled) setEnrichedAssessments(enriched);
        }
      } catch (err) {
        console.error("Failed to load assessments:", err);
      } finally {
        if (!cancelled) setAssessmentsLoading(false);
      }
    };

    loadAssessments();
    return () => { cancelled = true; };
  }, [selectedTermId, studentId, scopedSubjectId]);

  const behaviorStats = useMemo(() => {
    let totalPositive = 0;
    let totalNegative = 0;

    behaviors.forEach((b) => {
      const meta = resolveBehaviorMeta(b, behaviorTypes);
      const points = Number(meta.points ?? b.points ?? 0) || 0;
      if (points > 0) totalPositive += points;
      else if (points < 0) totalNegative += points;
    });

    return {
      total: totalPositive + totalNegative,
      positive: totalPositive,
      negative: totalNegative,
    };
  }, [behaviors, behaviorTypes]);

  const filteredBehaviors = useMemo(() => {
    if (behaviorFilter === "all") return behaviors;
    return behaviors.filter((b) => {
      const meta = resolveBehaviorMeta(b, behaviorTypes);
      const points = meta.points ?? b.points ?? 0;
      if (behaviorFilter === "positive") return points > 0;
      if (behaviorFilter === "negative") return points < 0;
      return points === 0;
    });
  }, [behaviors, behaviorTypes, behaviorFilter]);

  const assessmentSummary = useMemo(() => {
    const totalTasks = enrichedAssessments.reduce((s, a) => s + a.totalTasks, 0);
    const completedTasks = enrichedAssessments.reduce((s, a) => s + a.completedTasks, 0);
    const totalMarks = enrichedAssessments.reduce((s, a) => s + a.totalMarks, 0);
    const earnedMarks = enrichedAssessments.reduce((s, a) => s + a.earnedMarks, 0);
    return { totalTasks, completedTasks, totalMarks, earnedMarks };
  }, [enrichedAssessments]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const studentName = currentUser?.name || "Student";
  const className = currentUser?.studentClassName || currentUser?.class || "";

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto space-y-6">
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>My Report</span> },
        ]}
        className="!mb-2"
      />

      {/* Profile Header */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <Avatar src={currentUser?.avatar || null} size={64} className="shrink-0">
          {studentName.charAt(0)}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{studentName}</h1>
          {className && <p className="text-sm text-gray-500">{className}</p>}
        </div>
      </div>

      <Tabs
        defaultActiveKey="behavior"
        size="large"
        items={[
          {
            key: "behavior",
            label: "Behavior",
            children: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <Statistic
                      title="Total Points"
                      value={behaviorStats.total}
                      valueStyle={{ color: behaviorStats.total >= 0 ? "#3f8600" : "#cf1322" }}
                      prefix={behaviorStats.total >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      title="Positive Points"
                      value={behaviorStats.positive}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined />}
                    />
                  </Card>
                  <Card>
                    <Statistic
                      title="Negative Points"
                      value={behaviorStats.negative}
                      valueStyle={{ color: "#cf1322" }}
                      prefix={<ArrowDownOutlined />}
                    />
                  </Card>
                </div>

                <Card
                  title="Behavior History"
                  extra={
                    <Select
                      value={behaviorFilter}
                      style={{ width: 140 }}
                      onChange={setBehaviorFilter}
                      options={[
                        { value: "all", label: "All" },
                        { value: "positive", label: "Positive" },
                        { value: "negative", label: "Negative" },
                        { value: "neutral", label: "Neutral" },
                      ]}
                    />
                  }
                >
                  <List
                    dataSource={filteredBehaviors}
                    renderItem={(item) => {
                      const meta = resolveBehaviorMeta(item, behaviorTypes);
                      return (
                        <List.Item>
                          <div className="w-full">
                            <Tag color={meta.color}>
                              {meta.name} ({meta.points > 0 ? "+" : ""}{meta.points})
                            </Tag>
                            {item.subject?.name && (
                              <Tag color="blue">{item.subject.name}</Tag>
                            )}
                            <p className="mt-1 font-medium">{item.description}</p>
                            <p className="text-xs text-gray-500">
                              {typeof item.teacher === "object"
                                ? item.teacher?.teacher_name || "Teacher"
                                : item.teacher_name || "Teacher"}{" "}
                              &middot; {item.date}
                            </p>
                          </div>
                        </List.Item>
                      );
                    }}
                    locale={{ emptyText: "No behavior records found." }}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: "assessments",
            label: "Assessments",
            children: (
              <div className="space-y-4">
                {terms.length > 1 && (
                  <Select
                    value={selectedTermId ?? undefined}
                    style={{ width: 200 }}
                    onChange={(v) => setSelectedTermId(v)}
                    options={terms.map((t) => ({ value: t.id, label: t.name }))}
                  />
                )}

                {assessmentsLoading ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <Spin />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <Statistic title="Tasks Completed" value={assessmentSummary.completedTasks} suffix={`/ ${assessmentSummary.totalTasks}`} />
                      </Card>
                      <Card>
                        <Statistic
                          title="Completion Rate"
                          value={assessmentSummary.totalTasks > 0 ? Math.round((assessmentSummary.completedTasks / assessmentSummary.totalTasks) * 100) : 0}
                          suffix="%"
                        />
                      </Card>
                      <Card>
                        <Statistic title="Marks Earned" value={assessmentSummary.earnedMarks} suffix={`/ ${assessmentSummary.totalMarks}`} />
                      </Card>
                      <Card>
                        <Statistic
                          title="Average Score"
                          value={assessmentSummary.totalMarks > 0 ? Math.round((assessmentSummary.earnedMarks / assessmentSummary.totalMarks) * 100) : 0}
                          suffix="%"
                        />
                      </Card>
                    </div>

                    <div className="space-y-3">
                      {enrichedAssessments.map((assessment) => {
                        const taskPercent = assessment.totalTasks > 0
                          ? Math.round((assessment.completedTasks / assessment.totalTasks) * 100)
                          : 0;
                        const markPercent = assessment.totalMarks > 0
                          ? Math.round((assessment.earnedMarks / assessment.totalMarks) * 100)
                          : 0;

                        return (
                          <Link
                            key={assessment.id}
                            href={`/dashboard/students/assignments/${assessment.id}`}
                            className="block rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
                          >
                            <h3 className="font-semibold text-gray-800">{assessment.title}</h3>
                            <div className="mt-2 grid gap-3 sm:grid-cols-2">
                              <div>
                                <div className="mb-1 flex justify-between text-xs text-gray-500">
                                  <span>Tasks</span>
                                  <span>{assessment.completedTasks}/{assessment.totalTasks}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-emerald-500 transition-all"
                                    style={{ width: `${taskPercent}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="mb-1 flex justify-between text-xs text-gray-500">
                                  <span>Marks</span>
                                  <span>{assessment.earnedMarks}/{assessment.totalMarks}</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-blue-500 transition-all"
                                    style={{ width: `${markPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}

                      {enrichedAssessments.length === 0 && (
                        <Card>
                          <p className="text-center text-gray-500">No assessments found for this term.</p>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
