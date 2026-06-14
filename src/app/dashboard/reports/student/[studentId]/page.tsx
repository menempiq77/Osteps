"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Empty,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
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
import { fetchStudentProfileData } from "@/services/studentsApi";
import { fetchGrades } from "@/services/gradesApi";
import { fetchStudentNarrativeReports } from "@/services/studentNarrativeReportApi";
import TeacherReportEditor from "@/components/reports/TeacherReportEditor";
import SupportWellbeingEditor from "@/components/reports/SupportWellbeingEditor";

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

const senFlag = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }
  return false;
};

const pct = (earned: number, max: number) =>
  max > 0 ? Math.round((earned / max) * 100) : 0;

const isAttendanceBehaviour = (name: string) =>
  /attendance/i.test(name);

const formatDate = (value: unknown) => {
  const s = String(value ?? "").trim();
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString();
};

// ── small presentational helpers ──────────────────────────────────────────────
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
    <div
      className={`rounded-xl border bg-gradient-to-b p-3.5 ${tones[tone]}`}
    >
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 mb-0 text-2xl font-extrabold leading-none">{value}</p>
      {hint ? <p className="mt-1 mb-0 text-[11px] text-slate-400">{hint}</p> : null}
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
        <span className="text-2xl font-extrabold text-slate-800">{percent}%</span>
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export default function StudentReportPage() {
  const params = useParams<{ studentId?: string }>();
  const searchParams = useSearchParams();
  const studentId = String(params?.studentId ?? "").trim();
  const subjectIdParam = searchParams.get("subject_id");
  const subjectId = subjectIdParam ? Number(subjectIdParam) : undefined;

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const schoolId = currentUser?.school as number | undefined;

  const {
    data: student,
    isLoading,
    isError,
    error,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["student-report-profile", studentId, subjectId ?? 0],
    queryFn: () => fetchStudentProfileData(studentId, subjectId ?? 0),
    enabled: Boolean(studentId),
  });

  const normalizedRole = String(currentUser?.role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  const canEditSupport =
    normalizedRole === "SCHOOL_ADMIN" ||
    normalizedRole === "SUPER_ADMIN" ||
    normalizedRole === "HOD" ||
    normalizedRole === "TEACHER";

  const { data: grades = [] } = useQuery({
    queryKey: ["student-report-grades", schoolId ?? 0],
    queryFn: () => fetchGrades(String(schoolId)),
    enabled: Boolean(schoolId),
  });

  const {
    data: narrativeReports = [],
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["student-narrative-reports", studentId, subjectId ?? 0],
    queryFn: () => fetchStudentNarrativeReports(studentId, subjectId ?? null),
    enabled: Boolean(studentId),
  });

  const s = (student ?? {}) as AnyObj;
  const subjectContext = (s?.subject_context ?? {}) as AnyObj;

  const profile = useMemo(() => {
    return {
      name: String(s?.student_name ?? "Student"),
      userName: String(s?.user_name ?? "").trim(),
      email: String(s?.email ?? "").trim(),
      gender: String(s?.gender ?? s?.student_gender ?? "").trim(),
      nationality: String(s?.nationality ?? "").trim(),
      className: String(
        subjectContext?.subject_class_name ??
          subjectContext?.class_name ??
          (s?.class as AnyObj)?.class_name ??
          ""
      ),
      isSen: senFlag(s?.is_sen ?? s?.isSen),
      senDetails: String(s?.sen_details ?? s?.senDetails ?? "").trim(),
      status: String(s?.status ?? "").trim(),
    };
  }, [s, subjectContext]);

  // ── Behaviour & attendance ──────────────────────────────────────────────────
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
      (row) => !isAttendanceBehaviour(String((row?.behaviour as AnyObj)?.name ?? ""))
    );
    let positive = 0;
    let negative = 0;
    let posCount = 0;
    let negCount = 0;
    const events = rows
      .map((row, i) => {
        const b = (row?.behaviour as AnyObj) ?? {};
        const points = num(b?.points);
        if (points > 0) {
          positive += points;
          posCount += 1;
        } else if (points < 0) {
          negative += points;
          negCount += 1;
        }
        return {
          key: String(row?.id ?? i),
          date: String(row?.date ?? row?.created_at ?? ""),
          type: String(b?.name ?? "Behaviour"),
          points,
          description: String(row?.description ?? ""),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      );
    return {
      events,
      positive,
      negative,
      net: positive + negative,
      posCount,
      negCount,
      incidents: negCount,
    };
  }, [behaviourRows]);

  // ── Academic (assessments) ──────────────────────────────────────────────────
  const academic = useMemo(() => {
    const sid = num(s?.id ?? studentId);
    const terms = asArray((s?.class as AnyObj)?.term);
    const assessments: {
      key: string;
      name: string;
      earned: number;
      max: number;
      percent: number;
    }[] = [];
    terms.forEach((term) => {
      asArray(term?.assign_assessments).forEach((aa) => {
        const a = (aa?.assessment as AnyObj) ?? {};
        if (!a || !a.id) return;
        let earned = 0;
        let max = 0;
        let hasMark = false;
        asArray(a?.tasks).forEach((task) => {
          const allocated = num(task?.allocated_marks);
          const sats = asArray(task?.student_assessment_tasks).filter(
            (r) => num(r?.student_id) === sid
          );
          if (sats.length === 0) return;
          const score = num(
            sats[0]?.teacher_assessment_score ?? sats[0]?.teacher_assessment_marks
          );
          earned += score;
          max += allocated;
          hasMark = true;
        });
        if (!hasMark) return;
        assessments.push({
          key: String(a.id),
          name: normalizeSubjectName(a?.assessment_name ?? a?.name ?? "Assessment"),
          earned,
          max,
          percent: pct(earned, max),
        });
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
  }, [s, studentId]);

  const overallGrade = useMemo(() => {
    const p = academic.overall;
    const row = asArray(grades).find(
      (g) => p >= num(g?.min_percentage) && p <= num(g?.max_percentage)
    );
    return row ? String(row?.grade ?? "") : "";
  }, [grades, academic.overall]);

  // ── Tracker ─────────────────────────────────────────────────────────────────
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
        message="Could not load student report"
        description={error instanceof Error ? error.message : "Unknown error"}
      />
    );
  }

  if (!student) {
    return <Alert type="warning" showIcon message="Student not found." />;
  }

  const behaviourPieData = [
    { name: "Positive", value: conduct.posCount, color: "#22c55e" },
    { name: "Negative", value: conduct.negCount, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-4" id="report-print">
      {/* Top actions (hidden on print) */}
      <div className="no-print flex items-center justify-between gap-3">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeftOutlined /> Back to Reports
        </Link>
        <Button
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          style={{
            background: "var(--primary)",
            color: "#fff",
            borderColor: "var(--primary)",
          }}
        >
          Print / Export PDF
        </Button>
      </div>

      {/* Report header / profile */}
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
                <span className="font-mono text-slate-500">@{profile.userName}</span>
              ) : null}
              {profile.className ? <span>· {profile.className}</span> : null}
              {profile.email ? <span>· {profile.email}</span> : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {profile.gender ? (
                <Tag color={profile.gender.toLowerCase().startsWith("f") ? "magenta" : "blue"}>
                  {profile.gender}
                </Tag>
              ) : null}
              {profile.nationality ? <Tag color="gold">{profile.nationality}</Tag> : null}
              {profile.isSen ? <Tag color="purple">Extra support (SEN)</Tag> : null}
              {profile.status ? (
                <Tag color={profile.status.toLowerCase() === "active" ? "green" : "default"}>
                  {profile.status.toUpperCase()}
                </Tag>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Overall attainment
            </p>
            <p className="m-0 text-3xl font-extrabold" style={{ color: "var(--theme-dark)" }}>
              {academic.overall}%
            </p>
            {overallGrade ? (
              <Tag color="blue" className="!mt-1">Grade {overallGrade}</Tag>
            ) : null}
          </div>
        </div>
      </header>

      {/* KPI tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Attendance"
          value={attendance.total ? `${attendance.percent}%` : "N/A"}
          hint={attendance.total ? `${attendance.present}/${attendance.total} present` : "Not recorded"}
          tone={attendance.percent >= 90 ? "green" : attendance.percent >= 75 ? "amber" : "red"}
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
          tone={academic.overall >= 70 ? "green" : academic.overall >= 50 ? "amber" : "red"}
        />
        <StatTile
          label="Tracker progress"
          value={tracker.trackers.length ? `${tracker.overall}%` : "N/A"}
          hint={tracker.trackers.length ? `${tracker.trackers.length} tracker(s)` : "None assigned"}
          tone="blue"
        />
      </div>

      {/* Attendance + Behaviour charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Attendance"
          subtitle={
            attendance.total
              ? "Derived from recorded attendance entries"
              : "No attendance has been recorded for this student yet"
          }
        >
          {attendance.total ? (
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <Donut percent={attendance.percent} color="#22c55e" label="Present" />
              </div>
              <div className="w-1/2 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                  <span className="font-medium text-emerald-700">Present</span>
                  <span className="font-bold text-emerald-700">{attendance.present}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                  <span className="font-medium text-rose-700">Absent</span>
                  <span className="font-bold text-rose-700">{attendance.absent}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="font-medium text-slate-600">Total sessions</span>
                  <span className="font-bold text-slate-700">{attendance.total}</span>
                </div>
              </div>
            </div>
          ) : (
            <Empty description="No attendance records." image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
                  <span className="font-medium text-emerald-700">Positive points</span>
                  <span className="font-bold text-emerald-700">+{conduct.positive}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2">
                  <span className="font-medium text-rose-700">Negative points</span>
                  <span className="font-bold text-rose-700">{conduct.negative}</span>
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
            <Empty description="No behaviour events." image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </SectionCard>
      </div>

      {/* Academic */}
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
                    name: a.name.length > 16 ? `${a.name.slice(0, 16)}…` : a.name,
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
                  <ReTooltip formatter={(v) => [`${v}%`, "Score"]} />
                  <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                    {academic.assessments.map((a) => (
                      <Cell
                        key={a.key}
                        fill={a.percent >= 70 ? "#22c55e" : a.percent >= 50 ? "#f59e0b" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Table
              size="small"
              rowKey="key"
              pagination={false}
              dataSource={academic.assessments}
              columns={[
                { title: "Assessment", dataIndex: "name", key: "name" },
                {
                  title: "Marks",
                  key: "marks",
                  render: (_: unknown, r) => `${r.earned}/${r.max}`,
                },
                {
                  title: "Score",
                  dataIndex: "percent",
                  key: "percent",
                  render: (v: number) => (
                    <Tag color={v >= 70 ? "green" : v >= 50 ? "orange" : "red"}>{v}%</Tag>
                  ),
                },
              ]}
            />
          </>
        ) : (
          <Empty description="No marked assessments yet." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </SectionCard>

      {/* Tracker */}
      <SectionCard
        title="Tracker progress"
        subtitle="Memorisation / curriculum trackers"
      >
        {tracker.trackers.length ? (
          <div className="space-y-3">
            {tracker.trackers.map((t) => (
              <div key={t.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{t.name}</span>
                  <span className="text-slate-500">
                    {t.topicsDone}/{t.topicsTotal} topics · {t.earned}/{t.max} marks
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.percent}%`,
                      background:
                        t.percent >= 70 ? "#22c55e" : t.percent >= 40 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No trackers assigned." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </SectionCard>

      {/* Support needs */}
      <SectionCard title="Support & wellbeing" subtitle="Extra support / SEN information">
        <SupportWellbeingEditor
          studentId={num(s?.id ?? studentId)}
          subjectId={subjectId ?? null}
          isSen={profile.isSen}
          senDetails={profile.senDetails}
          canEdit={canEditSupport}
          onChanged={() => refetchProfile()}
        />
      </SectionCard>

      {/* Behaviour history */}
      <SectionCard title="Behaviour history" subtitle="Most recent conduct events">
        <Table
          size="small"
          rowKey="key"
          dataSource={conduct.events}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          columns={[
            { title: "Date", dataIndex: "date", key: "date", render: formatDate, width: 110 },
            { title: "Type", dataIndex: "type", key: "type" },
            {
              title: "Points",
              dataIndex: "points",
              key: "points",
              width: 90,
              render: (v: number) => (
                <Tag color={v > 0 ? "green" : v < 0 ? "red" : "default"}>
                  {v > 0 ? "+" : ""}
                  {v}
                </Tag>
              ),
            },
            {
              title: "Note",
              dataIndex: "description",
              key: "description",
              render: (v: string) =>
                v ? (
                  <Tooltip title={v}>
                    <span className="line-clamp-1 max-w-[280px]">{v}</span>
                  </Tooltip>
                ) : (
                  "—"
                ),
            },
          ]}
        />
      </SectionCard>

      {/* Teacher reports */}
      <SectionCard
        title="Teacher reports & comments"
        subtitle="Written reports for this student (visible on inspections)"
      >
        <TeacherReportEditor
          studentId={num(s?.id ?? studentId)}
          subjectId={subjectId ?? null}
          reports={narrativeReports}
          onChanged={() => refetchReports()}
        />
      </SectionCard>

      <p className="no-print pb-4 text-center text-xs text-slate-400">
        Generated by OSTEPS · {new Date().toLocaleString()}
      </p>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #report-print,
          #report-print * {
            visibility: visible !important;
          }
          #report-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 12px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
