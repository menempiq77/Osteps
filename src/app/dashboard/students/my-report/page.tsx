"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Alert, Empty, Select, Spin, Tag } from "antd";
import { FilePdfOutlined, TrophyOutlined } from "@ant-design/icons";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { fetchGrades } from "@/services/gradesApi";
import { fetchSchoolSelfLeaderBoardData } from "@/services/leaderboardApi";
import { fetchWholeAssessmentsReport } from "@/services/reportApi";
import { fetchMyClaimedCertificates } from "@/services/trackersApi";
import { IMG_BASE_URL } from "@/lib/config";
import {
  resolveCoinBalance,
  type LeaderboardRawEntry,
} from "@/lib/leaderboard";

type AnyObj = Record<string, unknown>;

const asArray = <T = AnyObj,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const num = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const normalizeSubjectName = (value: unknown) =>
  String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

const pct = (earned: number, max: number) =>
  max > 0 ? Math.round((earned / max) * 100) : 0;

const isAttendanceBehaviour = (name: string) => /attendance/i.test(name);

function SectionCard({
  title,
  subtitle,
  extra,
  children,
}: {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-base font-bold text-slate-800">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function StatTile({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "slate" | "green" | "amber" | "red" | "blue";
}) {
  const tones: Record<string, string> = {
    slate: "from-slate-50 to-white text-slate-800 border-slate-200",
    green: "from-emerald-50 to-white text-emerald-700 border-emerald-200",
    amber: "from-amber-50 to-white text-amber-700 border-amber-200",
    red: "from-rose-50 to-white text-rose-700 border-rose-200",
    blue: "from-blue-50 to-white text-blue-700 border-blue-200",
  };
  return (
    <div className={`rounded-xl border bg-gradient-to-b p-3.5 ${tones[tone]}`}>
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 mb-0 text-2xl font-extrabold leading-none">{value}</p>
      {hint ? (
        <p className="mt-1 mb-0 text-[11px] text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function Donut({
  percent,
  color,
  label,
}: {
  percent: number;
  color: string;
  label: string;
}) {
  const data = [
    { name: "v", value: Math.max(0, Math.min(100, percent)) },
    { name: "r", value: Math.max(0, 100 - percent) },
  ];
  return (
    <div className="relative h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={48}
            outerRadius={62}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#eef2f7" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-800">
          {percent}%
        </span>
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export default function StudentMyReportPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();
  const studentId = String(currentUser?.student ?? "").trim();
  const schoolId = currentUser?.school as number | undefined;
  const scopedSubjectId = canUseSubjectContext
    ? activeSubjectId ?? undefined
    : undefined;

  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student-my-report", studentId, scopedSubjectId ?? 0],
    queryFn: () =>
      fetchStudentProfileData(studentId, scopedSubjectId),
    enabled: Boolean(studentId),
  });

  const { data: rewardRows = [] } = useQuery({
    queryKey: ["student-my-report-reward-balances", studentId],
    queryFn: async () => {
      const response = await fetchSchoolSelfLeaderBoardData();
      return (response?.data ?? []) as LeaderboardRawEntry[];
    },
    enabled: Boolean(studentId),
    staleTime: 60 * 1000,
  });

  const { data: grades = [] } = useQuery({
    queryKey: ["student-my-report-grades", schoolId ?? 0],
    queryFn: () => fetchGrades(String(schoolId)),
    enabled: Boolean(schoolId),
  });

  // Assessment results across every class the student has been in (including
  // previous / archived classes). The student profile endpoint only returns
  // the current class, so this report is what powers the archived-class view.
  const { data: reportRows = [] } = useQuery({
    queryKey: ["student-my-report-assessments", schoolId ?? 0, scopedSubjectId ?? 0],
    queryFn: () => fetchWholeAssessmentsReport(String(schoolId), scopedSubjectId),
    enabled: Boolean(schoolId),
  });

  const { data: claimedCertificates = [] } = useQuery({
    queryKey: ["student-report-achievements", studentId],
    queryFn: fetchMyClaimedCertificates,
    enabled: Boolean(studentId),
  });

  const s = (student ?? {}) as AnyObj;
  const subjectContext = (s?.subject_context ?? {}) as AnyObj;

  const currentClassId = num(
    (s?.class as AnyObj)?.id ?? s?.class_id ?? currentUser?.studentClass
  );
  const studentIdNum = num(s?.id ?? studentId);

  // Classes the student has assessment data for, derived from the report.
  const classOptions = useMemo(() => {
    const map = new Map<number, string>();
    if (currentClassId > 0) {
      map.set(
        currentClassId,
        String(
          (s?.class as AnyObj)?.class_name ??
            subjectContext?.subject_class_name ??
            "Current class"
        )
      );
    }
    asArray(reportRows).forEach((assessment) => {
      const cid = num(assessment?.class_id);
      if (cid <= 0) return;
      const hasMark = asArray(assessment?.tasks).some((task) =>
        asArray(task?.submitted).some(
          (row) => num(row?.student_id) === studentIdNum
        )
      );
      if (!hasMark) return;
      if (!map.has(cid)) {
        map.set(
          cid,
          normalizeSubjectName(assessment?.class_name ?? `Class ${cid}`)
        );
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [reportRows, currentClassId, studentIdNum, s, subjectContext]);

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedClassId != null) return;
    if (currentClassId > 0) {
      setSelectedClassId(currentClassId);
    } else if (classOptions.length > 0) {
      setSelectedClassId(classOptions[0].id);
    }
  }, [selectedClassId, currentClassId, classOptions]);

  const effectiveClassId = selectedClassId ?? currentClassId;
  const isPreviousView =
    effectiveClassId > 0 && effectiveClassId !== currentClassId;
  const selectedClassName =
    classOptions.find((c) => c.id === effectiveClassId)?.name ?? "";

  const profile = useMemo(() => {
    return {
      name: String(
        s?.student_name ?? currentUser?.name ?? "Student"
      ),
      userName: String(s?.user_name ?? "").trim(),
      className: String(
        subjectContext?.subject_class_name ??
          subjectContext?.class_name ??
          (s?.class as AnyObj)?.class_name ??
          currentUser?.studentClassName ??
          ""
      ),
      gender: String(s?.gender ?? s?.student_gender ?? "").trim(),
      status: String(s?.status ?? "").trim(),
    };
  }, [s, subjectContext, currentUser]);

  const behaviourRows = useMemo(() => asArray(s?.behaviour), [s]);

  const attendance = useMemo(() => {
    let present = 0;
    let absent = 0;
    let other = 0;
    behaviourRows.forEach((row) => {
      const name = String((row?.behaviour as AnyObj)?.name ?? "");
      if (!isAttendanceBehaviour(name)) return;
      if (/present/i.test(name)) present += 1;
      else if (/absent/i.test(name)) absent += 1;
      else other += 1;
    });
    const total = present + absent + other;
    return { present, absent, other, total, percent: pct(present, total) };
  }, [behaviourRows]);

  const conduct = useMemo(() => {
    const rows = behaviourRows.filter(
      (row) =>
        !isAttendanceBehaviour(
          String((row?.behaviour as AnyObj)?.name ?? "")
        )
    );
    let positive = 0;
    let negative = 0;
    let posCount = 0;
    let negCount = 0;
    rows.forEach((row) => {
      const b = (row?.behaviour as AnyObj) ?? {};
      const points = num(b?.points);
      if (points > 0) {
        positive += points;
        posCount += 1;
      } else if (points < 0) {
        negative += points;
        negCount += 1;
      }
    });
    return { positive, negative, net: positive + negative, posCount, negCount };
  }, [behaviourRows]);

  // Assessment results for the selected class, derived from the whole
  // assessments report so previous / archived classes work the same way as the
  // student's current class.
  const academic = useMemo(() => {
    const sid = studentIdNum;
    const assessments: {
      key: string;
      name: string;
      earned: number;
      max: number;
      percent: number;
    }[] = [];
    const seenAssessments = new Set<string>();
    asArray(reportRows)
      .filter((assessment) =>
        effectiveClassId > 0
          ? num(assessment?.class_id) === effectiveClassId
          : true
      )
      .forEach((assessment) => {
        const assessmentId = String(
          assessment?.assessment_id ?? assessment?.id ?? ""
        );
        if (!assessmentId || seenAssessments.has(assessmentId)) return;
        let earned = 0;
        let max = 0;
        let hasMark = false;
        asArray(assessment?.tasks).forEach((task) => {
          const allocated = num(task?.allocated_marks);
          const row = asArray(task?.submitted).find(
            (r) => num(r?.student_id) === sid
          );
          if (!row) return;
          earned += num(
            row?.teacher_assessment_score ?? row?.teacher_assessment_marks
          );
          max += allocated;
          hasMark = true;
        });
        if (!hasMark) return;
        seenAssessments.add(assessmentId);
        assessments.push({
          key: assessmentId,
          name: normalizeSubjectName(
            assessment?.assessment_name ?? assessment?.name ?? "Assessment"
          ),
          earned,
          max,
          percent: pct(earned, max),
        });
      });
    const totalEarned = assessments.reduce((acc, a) => acc + a.earned, 0);
    const totalMax = assessments.reduce((acc, a) => acc + a.max, 0);
    return {
      assessments,
      totalEarned,
      totalMax,
      overall: pct(totalEarned, totalMax),
      count: assessments.length,
    };
  }, [reportRows, effectiveClassId, studentIdNum]);

  const overallGrade = useMemo(() => {
    const p = academic.overall;
    const row = asArray(grades).find(
      (g) => p >= num(g?.min_percentage) && p <= num(g?.max_percentage)
    );
    return row ? String(row?.grade ?? "") : "";
  }, [grades, academic.overall]);

  const tracker = useMemo(() => {
    const sid = num(s?.id ?? studentId);
    const sources = [
      ...asArray(s?.assign_trackers),
      ...asArray((s?.class as AnyObj)?.assign_trackers),
    ];
    const seen = new Set<string>();
    const trackers = sources
      .map((at) => {
        const t = (at?.tracker as AnyObj) ?? {};
        if (!t || !t.id) return null;
        const id = String(t.id);
        if (seen.has(id)) return null;
        seen.add(id);
        let earned = 0;
        let max = 0;
        let done = 0;
        const topics = asArray(t?.topics);
        topics.forEach((tp) => {
          const tmax = num(tp?.marks);
          const mark = asArray(tp?.topic_mark).find(
            (m) => num(m?.student_id) === sid
          );
          max += tmax;
          if (mark) {
            earned += num(mark?.marks);
            done += 1;
          }
        });
        return {
          key: id,
          name: normalizeSubjectName(t?.name ?? "Tracker"),
          topicsTotal: topics.length,
          topicsDone: done,
          earned,
          max,
          percent: pct(earned, max),
        };
      })
      .filter(Boolean) as {
      key: string;
      name: string;
      topicsTotal: number;
      topicsDone: number;
      earned: number;
      max: number;
      percent: number;
    }[];
    const totalEarned = trackers.reduce((a, t) => a + t.earned, 0);
    const totalMax = trackers.reduce((a, t) => a + t.max, 0);
    return { trackers, overall: pct(totalEarned, totalMax) };
  }, [s, studentId]);

  const rewards = useMemo(() => {
    const row = rewardRows.find(
      (entry) => String(entry?.student_id ?? "") === studentId
    );
    const trackerPoints = tracker.trackers.reduce(
      (total, current) => total + current.earned,
      0
    );
    return {
      coins: resolveCoinBalance(
        row ?? (s as LeaderboardRawEntry),
        trackerPoints
      ),
      points: num(
        row?.total_marks ??
          s?.total_marks ??
          s?.leaderboard_points ??
          trackerPoints
      ),
    };
  }, [rewardRows, s, studentId, tracker]);

  const achievements = useMemo(
    () =>
      asArray(claimedCertificates)
        .filter((certificate) => certificate?.certificate_path)
        .map((certificate) => ({
          key: String(certificate?.id ?? certificate?.tracker_id),
          trackerId: String(certificate?.tracker_id ?? ""),
          name:
            tracker.trackers.find(
              (item) =>
                String(item.key) === String(certificate?.tracker_id ?? "")
            )?.name ?? "Tracker achievement",
          certificatePath: String(certificate?.certificate_path ?? ""),
        })),
    [claimedCertificates, tracker.trackers]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Could not load report"
        description={
          error instanceof Error ? error.message : "Unknown error"
        }
      />
    );
  }

  if (!student) {
    return <Alert type="warning" showIcon message="No report data found." />;
  }

  const behaviourPieData = [
    { name: "Positive", value: conduct.posCount, color: "#22c55e" },
    { name: "Negative", value: conduct.negCount, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav>
        <ol className="flex items-center gap-1.5 text-sm text-slate-500">
          <li>
            <Link href="/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-800">My Report</li>
        </ol>
      </nav>

      {/* Class / year switcher — lets a student view a previous (archived)
          class read-only. */}
      {classOptions.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-sm font-semibold text-slate-700">
            Report for
          </span>
          <Select
            value={effectiveClassId > 0 ? effectiveClassId : undefined}
            onChange={(value) => setSelectedClassId(Number(value))}
            style={{ minWidth: 200 }}
            options={classOptions.map((c) => ({
              value: c.id,
              label:
                c.id === currentClassId ? `${c.name} (current)` : c.name,
            }))}
          />
          {isPreviousView ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Previous class — read-only
            </span>
          ) : null}
        </div>
      ) : null}

      {isPreviousView ? (
        <Alert
          type="warning"
          showIcon
          message={`Viewing your archived class "${selectedClassName}" (read-only)`}
          description="These are your saved assessment results for a previous class. Attendance, behaviour and tracker progress are only shown for your current class."
        />
      ) : null}

      {/* Profile header */}
      <header
        className="overflow-hidden rounded-3xl border p-5 shadow-sm md:p-6"
        style={{
          borderColor: "var(--theme-border)",
          background:
            "radial-gradient(900px 280px at 100% -50%, color-mix(in srgb, var(--primary) 20%, transparent), transparent 70%), linear-gradient(135deg, var(--theme-soft) 0%, #ffffff 60%)",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-white shadow"
            style={{ background: "var(--primary)" }}
          >
            {initialsOf(profile.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h1
              className="m-0 text-2xl font-extrabold leading-tight"
              style={{ color: "var(--theme-dark)" }}
            >
              {profile.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
              {profile.userName ? (
                <span className="font-mono text-slate-500">
                  @{profile.userName}
                </span>
              ) : null}
              {isPreviousView && selectedClassName ? (
                <span>· {selectedClassName}</span>
              ) : profile.className ? (
                <span>· {profile.className}</span>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {profile.gender ? (
                <Tag
                  color={
                    profile.gender.toLowerCase().startsWith("f")
                      ? "magenta"
                      : "blue"
                  }
                >
                  {profile.gender}
                </Tag>
              ) : null}
              {profile.status ? (
                <Tag
                  color={
                    profile.status.toLowerCase() === "active"
                      ? "green"
                      : "default"
                  }
                >
                  {profile.status.toUpperCase()}
                </Tag>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Overall attainment
            </p>
            <p
              className="m-0 text-3xl font-extrabold"
              style={{ color: "var(--theme-dark)" }}
            >
              {academic.overall}%
            </p>
            {overallGrade ? (
              <Tag color="blue" className="!mt-1">
                Grade {overallGrade}
              </Tag>
            ) : null}
          </div>
        </div>
      </header>

      {/* KPI tiles — current-class only (attendance/behaviour/tracker come
          from the profile, which reflects the current class). */}
      {!isPreviousView ? (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile
          label="Coins"
          value={rewards.coins.toLocaleString()}
          hint="Spendable pocket balance"
          tone="amber"
        />
        <StatTile
          label="Leaderboard points"
          value={rewards.points.toLocaleString()}
          hint="Permanent score"
          tone="blue"
        />
        <StatTile
          label="Attendance"
          value={attendance.total ? `${attendance.percent}%` : "N/A"}
          hint={
            attendance.total
              ? `${attendance.present}/${attendance.total} present`
              : "Not recorded"
          }
          tone={
            attendance.percent >= 90
              ? "green"
              : attendance.percent >= 75
                ? "amber"
                : "red"
          }
        />
        <StatTile
          label="Behaviour (net)"
          value={`${conduct.net > 0 ? "+" : ""}${conduct.net}`}
          hint={`${conduct.posCount} positive · ${conduct.negCount} incidents`}
          tone={conduct.net >= 0 ? "green" : "red"}
        />
        <StatTile
          label="Assessments"
          value={`${academic.overall}%`}
          hint={`${academic.count} marked`}
          tone={
            academic.overall >= 70
              ? "green"
              : academic.overall >= 50
                ? "amber"
                : "red"
          }
        />
        <StatTile
          label="Tracker progress"
          value={
            tracker.trackers.length ? `${tracker.overall}%` : "N/A"
          }
          hint={
            tracker.trackers.length
              ? `${tracker.trackers.length} tracker(s)`
              : "None assigned"
          }
          tone="blue"
        />
      </div>
      ) : null}

      {/* Attendance + Behaviour charts — current-class only */}
      {!isPreviousView ? (
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Attendance"
          subtitle={
            attendance.total
              ? "Derived from recorded attendance entries"
              : "No attendance has been recorded yet"
          }
        >
          {attendance.total ? (
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <Donut
                  percent={attendance.percent}
                  color="#22c55e"
                  label="Present"
                />
              </div>
              <div className="w-1/2 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                  <span className="font-medium text-emerald-700">
                    Present
                  </span>
                  <span className="font-bold text-emerald-700">
                    {attendance.present}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                  <span className="font-medium text-rose-700">Absent</span>
                  <span className="font-bold text-rose-700">
                    {attendance.absent}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="font-medium text-slate-600">
                    Total sessions
                  </span>
                  <span className="font-bold text-slate-700">
                    {attendance.total}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Empty
              description="No attendance records."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </SectionCard>

        <SectionCard
          title="Behaviour"
          subtitle={`${conduct.posCount + conduct.negCount} logged events`}
        >
          {behaviourPieData.length ? (
            <div className="flex items-center gap-4">
              <div className="h-[140px] w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={behaviourPieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={62}
                      stroke="none"
                    >
                      {behaviourPieData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                  <span className="font-medium text-emerald-700">
                    Positive points
                  </span>
                  <span className="font-bold text-emerald-700">
                    +{conduct.positive}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                  <span className="font-medium text-rose-700">
                    Negative points
                  </span>
                  <span className="font-bold text-rose-700">
                    {conduct.negative}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="font-medium text-slate-600">Net</span>
                  <span className="font-bold text-slate-700">
                    {conduct.net > 0 ? "+" : ""}
                    {conduct.net}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Empty
              description="No behaviour events."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </SectionCard>
      </div>
      ) : null}

      {/* Academic performance */}
      <SectionCard
        title="Academic performance"
        subtitle="Assessment results and marks"
        extra={
          academic.count ? (
            <Tag color="blue">
              {academic.totalEarned}/{academic.totalMax} marks
            </Tag>
          ) : null
        }
      >
        {academic.count ? (
          <>
            <div className="mb-4 h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={academic.assessments.map((a) => ({
                    name:
                      a.name.length > 16
                        ? `${a.name.slice(0, 16)}...`
                        : a.name,
                    percent: a.percent,
                  }))}
                  margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={48}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <ReTooltip
                    formatter={(v) => [`${v}%`, "Score"]}
                  />
                  <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                    {academic.assessments.map((a) => (
                      <Cell
                        key={a.key}
                        fill={
                          a.percent >= 70
                            ? "#22c55e"
                            : a.percent >= 50
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {academic.assessments.map((a) => (
                <div
                  key={a.key}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-700">
                    {a.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      {a.earned}/{a.max}
                    </span>
                    <Tag
                      color={
                        a.percent >= 70
                          ? "green"
                          : a.percent >= 50
                            ? "orange"
                            : "red"
                      }
                    >
                      {a.percent}%
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Empty
            description="No marked assessments yet."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </SectionCard>

      {/* Tracker progress — current-class only */}
      {!isPreviousView ? (
      <SectionCard
        title="Tracker progress"
        subtitle="Memorisation / curriculum trackers"
      >
        {tracker.trackers.length ? (
          <div className="space-y-3">
            {tracker.trackers.map((t) => (
              <div key={t.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {t.name}
                  </span>
                  <span className="text-slate-500">
                    {t.topicsDone}/{t.topicsTotal} topics · {t.earned}/
                    {t.max} marks
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.percent}%`,
                      background:
                        t.percent >= 70
                          ? "#22c55e"
                          : t.percent >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            description="No trackers assigned."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </SectionCard>
      ) : null}

      {!isPreviousView ? (
        <SectionCard
          title="Achievements"
          subtitle="Certificates awarded after completed tracker tests"
          extra={
            achievements.length ? (
              <Tag color="gold" icon={<TrophyOutlined />}>
                {achievements.length} earned
              </Tag>
            ) : null
          }
        >
          {achievements.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {achievements.map((achievement) => (
                <a
                  key={achievement.key}
                  href={`${IMG_BASE_URL}/storage/${achievement.certificatePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-xl text-amber-950 shadow-sm">
                    <TrophyOutlined />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">
                      Certificate earned
                    </span>
                    <span className="mt-1 block truncate font-bold text-slate-800">
                      {achievement.name}
                    </span>
                  </span>
                  <FilePdfOutlined className="text-xl text-rose-600 transition group-hover:scale-110" />
                </a>
              ))}
            </div>
          ) : (
            <Empty
              description="Complete a tracker and its teacher test to earn your first certificate."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </SectionCard>
      ) : null}
    </div>
  );
}
