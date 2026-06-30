"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { Empty, Modal, Input, Form, message } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  NotificationOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  RocketOutlined,
  SearchOutlined,
  SolutionOutlined,
  TableOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { addSubject, updateSubject, deleteSubject } from "@/services/subjectsApi";
import { fetchAssessmentByStudent, fetchTasks, fetchStudentTasks } from "@/services/api";
import { fetchTerm } from "@/services/termsApi";
import { fetchStudentProfileData } from "@/services/studentsApi";

const MyScheduleWidget = dynamic(() => import("@/components/dashboard/MyScheduleWidget"), {
  loading: () => <ScheduleWidgetSkeleton />,
});

// ── Subject colour palette ────────────────────────────────────────────────────
const PALETTE = [
  { gradFrom: "#f59e0b", gradTo: "#8a4f12", glow: "rgba(245,158,11,0.18)" },   // amber
  { gradFrom: "#60a5fa", gradTo: "#2f527e", glow: "rgba(96,165,250,0.18)" },   // blue
  { gradFrom: "#a78bfa", gradTo: "#46338f", glow: "rgba(167,139,250,0.18)" },   // violet
  { gradFrom: "#f472b6", gradTo: "#90345f", glow: "rgba(244,114,182,0.17)" },   // rose
  { gradFrom: "#38C16C", gradTo: "#28745c", glow: "rgba(56,193,108,0.18)" },   // green
  { gradFrom: "#facc15", gradTo: "#915f1f", glow: "rgba(250,204,21,0.16)" },   // gold
  { gradFrom: "#818cf8", gradTo: "#393b91", glow: "rgba(129,140,248,0.18)" },   // indigo
  { gradFrom: "#2dd4bf", gradTo: "#2c776f", glow: "rgba(45,212,191,0.16)" },   // teal
];

const NAME_MAP: Record<string, number> = {
  arabic: 0, "al arabiyya": 0,
  islamic: 4, islamiat: 4,
  quran: 5,
  english: 1,
  math: 6, maths: 6,
  science: 7,
  history: 3,
};

const getPalette = (name: string, idx: number) => {
  const n = String(name).toLowerCase();
  for (const [key, palIdx] of Object.entries(NAME_MAP)) {
    if (n.includes(key)) return PALETTE[palIdx];
  }
  return PALETTE[idx % PALETTE.length];
};

// ── Per-subject color override (localStorage) ─────────────────────────────────
const SUBJECT_COLOR_MAP_KEY = "osteps_subject_color_map";

function readSubjectColorMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(SUBJECT_COLOR_MAP_KEY) || "{}"); }
  catch { return {}; }
}

function persistSubjectColorMap(map: Record<string, number>) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SUBJECT_COLOR_MAP_KEY, JSON.stringify(map));
  }
}

function getSubjectPalette(colorMap: Record<string, number>, subjectId: number, name: string, idx: number) {
  const map = colorMap;
  const stored = map[String(subjectId)];
  if (stored != null && stored >= 0 && stored < PALETTE.length) return PALETTE[stored];
  return getPalette(name, idx);
}

// ── Quick-link colour map ─────────────────────────────────────────────────────
type LinkColor = { bg: string; iconColor: string; border: string };
const LINK_COLORS: Record<string, LinkColor> = {
  "Library":       { bg: "#edf7f2", iconColor: "#259b5a", border: "#b9e2cd" },
  "Timetable":     { bg: "#f3f4f8", iconColor: "#424253", border: "#d9dfeb" },
  "Announcements": { bg: "#fff1f8", iconColor: "#c0266f", border: "#f5c6dc" },
  "Ask a Question":{ bg: "#f3f0ff", iconColor: "#6d5bd0", border: "#d8cffd" },
  "Behavior":      { bg: "#fff9df", iconColor: "#a16207", border: "#efd676" },
  "My Report":     { bg: "#eef4ff", iconColor: "#3b5bdb", border: "#c2d2ff" },
  "Leaderboard":   { bg: "#fff8df", iconColor: "#a16207", border: "#efd676" },
  "Settings":      { bg: "#f5f7fb", iconColor: "#424253", border: "#d9dfeb" },
  "All Students":  { bg: "#ecfbf4", iconColor: "#229463", border: "#a8e4c7" },
  "Teachers":      { bg: "#eef5ff", iconColor: "#3867be", border: "#bfd4ff" },
  "Students & Staff": { bg: "#ecfbf4", iconColor: "#229463", border: "#a8e4c7" },
  "Markbook":      { bg: "#eefbf1", iconColor: "#31a65c", border: "#a8e4b8" },
  "Reports":       { bg: "#eef4ff", iconColor: "#3b5bdb", border: "#c2d2ff" },
  "Tools":         { bg: "#f3f0ff", iconColor: "#6d5bd0", border: "#d8cffd" },
};
const DEFAULT_LINK: LinkColor = { bg: "#effaf3", iconColor: "#38C16C", border: "#b9e2cd" };
const lc = (name: string): LinkColor => LINK_COLORS[name] ?? DEFAULT_LINK;

const isSchoolAdminRole = (role?: string | null) =>
  String(role || "").trim().toUpperCase() === "SCHOOL_ADMIN";

// ── Quick-link card ───────────────────────────────────────────────────────────
type QLProps = { name: string; href: string; desc: string; Icon: React.ComponentType<any> };
function QuickLinkCard({ name, href, desc, Icon }: QLProps) {
  const c = lc(name);
  return (
    <Link href={href} className="block">
      <div
        className="group flex min-h-[54px] cursor-pointer items-center gap-2 rounded-xl border bg-white/95 p-2
                   shadow-[0_8px_18px_rgba(66,66,83,0.04)] transition-all duration-200
                   hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(66,66,83,0.10)]"
        style={{ borderColor: c.border }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm
                     transition-transform duration-200 group-hover:scale-110"
          style={{ background: c.bg, color: c.iconColor, border: `1px solid ${c.border}` }}
        >
          <Icon />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-extrabold text-[#303042]">{name}</p>
          <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-slate-500">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

type SectionHeaderProps = {
  accent: string;
  title: string;
  subtitle?: string;
  count?: string;
};

function SectionHeader({ accent, title, subtitle, count }: SectionHeaderProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
        style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}32` }}
      >
        <div className="h-3.5 w-1.5 rounded-full" style={{ background: accent }} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-[13px] font-black leading-tight text-[#252538] sm:text-sm">{title}</h2>
          {count ? (
            <span className="rounded-full border border-[#38C16C]/25 bg-[#38C16C]/10 px-2 py-0.5 text-[10px] font-black text-[#229463]">
              {count}
            </span>
          ) : null}
        </div>
        {subtitle ? <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function ScheduleWidgetSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-[0_10px_24px_rgba(66,66,83,0.05)]">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 px-3 py-2">
        <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="ml-auto h-7 w-40 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            <div className="mb-2.5 h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="mb-2 h-3.5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectCardsSkeleton({ includeCreateCard }: { includeCreateCard: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
      {Array.from({ length: includeCreateCard ? 6 : 5 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[94px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm"
        >
          <div className="mb-3 h-4 w-12 animate-pulse rounded-full bg-slate-100" />
          <div className="mb-2 h-7 w-7 animate-pulse rounded-lg bg-slate-100" />
          <div className="mb-1.5 h-3.5 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mb-2 h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-14 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ percent, size = 36 }: { percent: number; size?: number }) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-white font-black"
        style={{ fontSize: size * 0.28 }}
      >
        {Math.round(percent)}%
      </span>
    </div>
  );
}

function useStudentSubjectProgress(
  isStudent: boolean,
  studentId: string | undefined,
  studentClass: string | number | undefined,
  subjects: Array<{ id: number; name?: string }>,
  canUseSubjectContext: boolean,
) {
  const [progress, setProgress] = useState<Record<number, number>>({});
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!isStudent || !studentId || !studentClass || subjects.length === 0 || fetchedRef.current) return;
    fetchedRef.current = true;

    const loadProgress = async () => {
      const classId = Number(studentClass);
      if (!classId || classId <= 0) {
        try {
          const profile = await fetchStudentProfileData(Number(studentId));
          const resolvedClassId = Number(
            profile?.class_id ?? profile?.class?.id ?? 0
          );
          if (resolvedClassId > 0) await computeForClass(resolvedClassId);
        } catch { /* ignore */ }
        return;
      }
      await computeForClass(classId);
    };

    const computeForClass = async (classId: number) => {
      let terms: any[] = [];
      try {
        terms = await fetchTerm(classId);
      } catch { return; }

      if (!Array.isArray(terms) || terms.length === 0) return;
      const termId = Number(terms[0].id);

      const results: Record<number, number> = {};

      await Promise.allSettled(
        subjects.map(async (subject) => {
          try {
            const subjectId = canUseSubjectContext ? Number(subject.id) : undefined;
            const assessments = await fetchAssessmentByStudent(termId, subjectId);
            const assessmentList = Array.isArray(assessments)
              ? assessments.filter((a: any) => a.type === "assessment")
              : [];

            let totalTasks = 0;
            let completedTasks = 0;

            await Promise.allSettled(
              assessmentList.map(async (assessment: any) => {
                const [allTasks, studentTasks] = await Promise.all([
                  fetchTasks(assessment.id),
                  fetchStudentTasks(assessment.id),
                ]);
                const taskArray = Array.isArray(allTasks?.data) ? allTasks.data : [];
                const studentTaskArray = Array.isArray(studentTasks?.data) ? studentTasks.data : [];

                totalTasks += taskArray.length;
                for (const task of taskArray) {
                  const hasSubmission = studentTaskArray.some(
                    (st: any) =>
                      String(st.task_id ?? st.id) === String(task.id) &&
                      String(st.student_id) === String(studentId)
                  );
                  if (hasSubmission) completedTasks++;
                }
              })
            );

            results[subject.id] = totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0;
          } catch { /* ignore */ }
        })
      );

      setProgress(results);
    };

    loadProgress();
  }, [isStudent, studentId, studentClass, subjects, canUseSubjectContext]);

  return progress;
}

export default function SubjectCardsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { subjects, loading, canUseSubjectContext, activeSubjectId, setActiveSubjectId, refreshSubjects } =
    useSubjectContext();

  const role = String(currentUser?.role || "").trim().toUpperCase();
  const isStudent = role === "STUDENT";
  const isSchoolAdmin = isSchoolAdminRole(currentUser?.role ?? null);

  // ── Create / Edit subject modal state ───────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ id: number; name: string } | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectColorMap, setSubjectColorMap] = useState<Record<string, number>>({});
  const [form] = Form.useForm();
  // ── Delete confirmation modal state ──────────────────────────────────
  const [deleteConfirmSubject, setDeleteConfirmSubject] = useState<{ id: number; name: string } | null>(null);
  const [deleteTyped, setDeleteTyped] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteNameMatches = deleteTyped.trim().toLowerCase() === (deleteConfirmSubject?.name ?? "").trim().toLowerCase();
  const isStaffWorkspaceRole = ["ADMIN", "HOD", "TEACHER"].includes(role);
  const subjectProgress = useStudentSubjectProgress(
    isStudent,
    currentUser?.student as string | undefined,
    currentUser?.studentClass,
    subjects,
    canUseSubjectContext,
  );
  const leaderboardHref = activeSubjectId
    ? `/dashboard/s/${activeSubjectId}/leaderboard`
    : "/dashboard/leaderboard";

  useEffect(() => {
    setSubjectColorMap(readSubjectColorMap());
  }, []);

  const applySubjectColor = (subjectId: number, palIdx: number) => {
    setSubjectColorMap((current) => {
      const next = {
        ...current,
        [String(subjectId)]: palIdx,
      };
      persistSubjectColorMap(next);
      return next;
    });
  };

  // ── Subject CRUD handlers ───────────────────────────────────────────
  const openCreateModal = () => {
    setEditingSubject(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (subject: { id: number; name: string }) => {
    setEditingSubject(subject);
    form.setFieldsValue({ name: subject.name });
    // Pre-select stored color if any
    const stored = subjectColorMap[String(subject.id)];
    setSelectedColorIdx(stored != null ? stored : null);
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    let values: { name: string };
    try {
      values = await form.validateFields();
    } catch {
      return; // antd shows inline validation errors
    }
    setModalLoading(true);
    try {
      if (editingSubject) {
        await updateSubject(String(editingSubject.id), { name: values.name.trim(), school_id: currentUser?.school });
        // Persist chosen color to localStorage
        if (selectedColorIdx != null) {
          applySubjectColor(editingSubject.id, selectedColorIdx);
        }
        message.success("Subject updated");
      } else {
        await addSubject({ name: values.name.trim(), school_id: currentUser?.school });
        message.success("Subject created");
      }
      refreshSubjects();
      setModalOpen(false);
      form.resetFields();
      setSelectedColorIdx(null);
      setEditingSubject(null);
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";
      message.error(apiMsg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSubject = (subject: { id: number; name: string }) => {
    setDeleteTyped("");
    setDeleteConfirmSubject(subject);
  };

  const canEnterSubjectWorkspace = useMemo(
    () => ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER", "STUDENT"].includes(role),
    [role]
  );

  const normalizedSubjectSearch = subjectSearch.trim().toLowerCase();
  const filteredSubjects = useMemo(() => {
    if (!normalizedSubjectSearch) return subjects;
    return subjects.filter((subject) => {
      const name = String(subject.name ?? "").toLowerCase();
      const code = String(subject.code ?? "").toLowerCase();
      return name.includes(normalizedSubjectSearch) || code.includes(normalizedSubjectSearch);
    });
  }, [normalizedSubjectSearch, subjects]);
  if (!loading && (!canUseSubjectContext || !canEnterSubjectWorkspace)) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <Empty description="Subject workspace is not enabled for this account." />
      </div>
    );
  }

  const studentQuickLinks: QLProps[] = [
    { name: "Library",        href: "/dashboard/library",                       desc: "Open your shared reading and learning resources.",                 Icon: BookOutlined },
    { name: "Timetable",      href: "/dashboard/time_table?view=calendar",      desc: "Check your schedule for classes and activities.",                  Icon: CalendarOutlined },
    { name: "Announcements",  href: "/dashboard/announcements",                 desc: "Read the latest updates sent to students.",                        Icon: NotificationOutlined },
    { name: "Ask a Question", href: "/dashboard/questions",                     desc: "Send questions and view replies from teachers.",                   Icon: QuestionCircleOutlined },
    { name: "My Report",      href: "/dashboard/students/my-report",              desc: "View your full report: behavior, assessments & progress.",    Icon: SolutionOutlined },
    { name: "Leaderboard",    href: leaderboardHref,                            desc: "See how you rank against your classmates and the whole school.",   Icon: TrophyOutlined },
  ];

  return (
    <div className="relative space-y-3 overflow-hidden rounded-[22px] border border-white/80 bg-[linear-gradient(135deg,#f8fafc_0%,#eef7f1_44%,#f7f8fb_100%)] p-2.5 pb-4 shadow-[0_18px_44px_rgba(66,66,83,0.10)] sm:p-3">
      <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[#38C16C]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-[#424253]/10 blur-2xl" />
      {/* ── My Schedule ─────────────────────────────────────────────────── */}
      <section className="relative rounded-[18px] border border-white/80 bg-white/70 p-2 shadow-[0_10px_26px_rgba(66,66,83,0.05)] backdrop-blur">
        <div className="mb-2">
          <SectionHeader
            accent="#38C16C"
            title="My Schedule"
            subtitle="Today’s timetable and quick calendar controls"
          />
        </div>
        {loading ? <ScheduleWidgetSkeleton /> : <MyScheduleWidget currentUser={currentUser} isStudent={isStudent} />}
      </section>

      {/* ── Subject cards ─────────────────────────────────────────────────── */}
      <section className="relative rounded-[18px] border border-white/80 bg-white/75 p-2.5 shadow-[0_12px_30px_rgba(66,66,83,0.06)] backdrop-blur">
        <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeader
            accent="#38C16C"
            title={isStudent ? "Choose a Subject" : "Choose a Subject Dashboard"}
            subtitle="Open the subject workspace quickly"
            count={!loading && subjects.length > 0 ? `${filteredSubjects.length}/${subjects.length}` : undefined}
          />

          {!loading && subjects.length > 0 && (
            <Input
              value={subjectSearch}
              onChange={(event) => setSubjectSearch(event.target.value)}
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search subjects by name or code"
              size="small"
              className="!h-8 !rounded-xl !border-slate-200 !bg-white/95 text-xs lg:!w-[270px]"
            />
          )}
        </div>

        {loading ? (
          <SubjectCardsSkeleton includeCreateCard={isSchoolAdmin} />
        ) : subjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10">
            <Empty description="No assigned subjects found." />
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10">
            <Empty description="No subjects match that search." />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
            {filteredSubjects.map((subject, idx) => {
              const isActive = Number(activeSubjectId) === Number(subject.id);
              const displayName = typeof subject.name === "string"
                ? subject.name.replace(/islamiat/gi, "Islamic")
                : subject.name;
              const displayCode = typeof subject.code === "string"
                ? subject.code.replace(/islamiat/gi, "Islamic")
                : subject.code;
              const pal = getSubjectPalette(subjectColorMap, subject.id, String(displayName), idx);

              return (
                <div
                  key={subject.id}
                  className="relative min-h-[94px] cursor-pointer overflow-hidden rounded-xl
                             ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${pal.gradFrom} 0%, ${pal.gradTo} 100%)`,
                    boxShadow: isActive
                      ? `0 0 0 2px rgba(56,193,108,0.85), 0 10px 22px ${pal.glow}`
                      : `0 7px 18px ${pal.glow}`,
                  }}
                  onClick={() => setActiveSubjectId(Number(subject.id), { navigate: true })}
                >
                  {/* decorative circle */}
                  <div
                    className="pointer-events-none absolute -right-6 -top-8 h-[72px] w-[72px] rounded-full opacity-20"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-4 -left-4 h-12 w-12 rounded-full opacity-10"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />

                  <div className="relative flex min-h-[94px] flex-col p-2.5">
                    {/* admin actions row */}
                    {isSchoolAdmin && (
                      <div className="absolute right-2 top-2 flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal({ id: subject.id, name: subject.name }); }}
                          className="flex h-[18px] w-[18px] items-center justify-center rounded-full
                                     transition-all duration-200 hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                          title="Edit subject"
                        >
                          <EditOutlined style={{ fontSize: 11 }} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSubject({ id: subject.id, name: subject.name }); }}
                          className="flex h-[18px] w-[18px] items-center justify-center rounded-full
                                     transition-all duration-200 hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                          title="Delete subject"
                        >
                          <DeleteOutlined style={{ fontSize: 11 }} />
                        </button>
                      </div>
                    )}

                    {/* active badge */}
                    {isActive && (
                      <div
                        className="absolute left-2 top-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                        style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                      >
                        <CheckCircleFilled style={{ fontSize: 10 }} />
                        Active
                      </div>
                    )}

                    {/* student progress ring */}
                    {isStudent && subjectProgress[subject.id] != null && (
                      <div className="absolute right-2 top-2">
                        <ProgressRing percent={subjectProgress[subject.id]} size={34} />
                      </div>
                    )}

                    {/* icon */}
                    <div
                      className="mb-1.5 mt-5 flex h-7 w-7 items-center justify-center rounded-lg text-xs"
                      style={{ background: "rgba(255,255,255,0.20)", color: "#fff" }}
                    >
                      <BookOutlined />
                    </div>

                    {/* name */}
                    <h3 className="mb-0.5 truncate text-[12px] font-extrabold leading-tight text-white">
                      {displayName}
                    </h3>
                    {displayCode && (
                      <p className="mb-1.5 truncate text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>
                        {displayCode}
                      </p>
                    )}

                    {/* CTA */}
                    <button
                      className="mt-auto flex w-fit items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold
                                 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: "rgba(255,255,255,0.22)",
                        border: "1px solid rgba(255,255,255,0.35)",
                        color: "#fff",
                      }}
                    >
                      <RocketOutlined style={{ fontSize: 11 }} />
                      Open
                    </button>
                  </div>
                </div>
              );
            })}

            {/* ── Create Subject card (SCHOOL_ADMIN only) ──────────────── */}
            {isSchoolAdmin && (
              <div
                onClick={openCreateModal}
                className="relative flex min-h-[94px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl
                           transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  border: "1.5px dashed #93a0b7",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                <div
                  className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg text-xs"
                  style={{ background: "#eef2f7", color: "#424253" }}
                >
                  <PlusOutlined />
                </div>
                <p className="text-[10px] font-bold text-slate-600">Create a Subject</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Student quick links ───────────────────────────────────────────── */}
      {isStudent && (
        <section className="relative rounded-[18px] border border-white/80 bg-white/75 p-2.5 shadow-[0_10px_26px_rgba(66,66,83,0.05)] backdrop-blur">
          <div className="mb-2">
            <SectionHeader
              accent="#818cf8"
              title="Student Tools"
              subtitle="Quick access to the pages you use most"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            {studentQuickLinks.map((item) => (
              <QuickLinkCard key={item.name} {...item} />
            ))}
          </div>
        </section>
      )}

      {/* ── Staff shared resources ────────────────────────────────────────── */}
      {isStaffWorkspaceRole && (
        <section className="relative rounded-[18px] border border-white/80 bg-white/75 p-2.5 shadow-[0_10px_26px_rgba(66,66,83,0.05)] backdrop-blur">
          <div className="mb-2">
            <SectionHeader
              accent="#2dd4bf"
              title="Shared Resources"
              subtitle="Available outside the subject workspace"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
            <QuickLinkCard name="Courses"     href="/dashboard/courses"             desc="Access subject courses including Lessons and Mind-upgrade."       Icon={ReadOutlined} />
            <QuickLinkCard name="Markbook"    href="/dashboard/students/markbook"    desc="Open student reports and performance summaries."                 Icon={BarChartOutlined} />
            <QuickLinkCard name="Reports"     href="/dashboard/reports"             desc="Full student reports — attendance, behaviour, marks & tracker."   Icon={FileSearchOutlined} />
            <QuickLinkCard name="Library"     href="/dashboard/library"             desc="Open shared resources for the current school workspace."          Icon={BookOutlined} />
            <QuickLinkCard name="Leaderboard" href={leaderboardHref}                desc="School-wide student rankings across all subjects."               Icon={TrophyOutlined} />

          </div>
        </section>
      )}

      {/* ── School-admin management ───────────────────────────────────────── */}
      {isSchoolAdmin && !isStudent && (
        <section className="relative rounded-[18px] border border-white/80 bg-white/75 p-2.5 shadow-[0_10px_26px_rgba(66,66,83,0.05)] backdrop-blur">
          <div className="mb-2">
            <SectionHeader
              accent="#f472b6"
              title="School-wide Management"
              subtitle="All-subject tools — manage students and staff here"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
            <QuickLinkCard name="Students & Staff" href="/dashboard/students-staff"      desc="Manage all students and teachers across subjects."                  Icon={TeamOutlined} />
            <QuickLinkCard name="Courses"           href="/dashboard/courses"            desc="Access subject courses including Lessons and Mind-upgrade."         Icon={ReadOutlined} />
            <QuickLinkCard name="Markbook"          href="/dashboard/students/markbook"   desc="Open student reports and performance summaries."                    Icon={BarChartOutlined} />
            <QuickLinkCard name="Reports"           href="/dashboard/reports"            desc="Full student reports — behaviour, marks, tracker & teacher notes." Icon={FileSearchOutlined} />
            <QuickLinkCard name="Library"       href="/dashboard/library"               desc="Shared resources available to subjects you assign."                 Icon={BookOutlined} />
            <QuickLinkCard name="Timetable"          href="/dashboard/timetable-builder"  desc="Open the builder first, then switch to the calendar when needed."    Icon={TableOutlined} />
            <QuickLinkCard name="Calendar"           href="/dashboard/time_table?view=calendar" desc="Open the calendar view by subject, class, or teacher."            Icon={CalendarOutlined} />
            <QuickLinkCard name="Announcements"     href="/dashboard/announcements"      desc="Send announcements to HODs, teachers, and students."                Icon={NotificationOutlined} />
            <QuickLinkCard name="Tools"         href="/dashboard/tools"                 desc="Extra tools that support all subjects."                             Icon={ToolOutlined} />
            <QuickLinkCard name="Leaderboard"   href={leaderboardHref}                  desc="See school-wide student rankings across all subjects."              Icon={TrophyOutlined} />
          </div>
        </section>
      )}

      {/* ── Create / Edit subject modal ───────────────────────────────── */}
      <Modal
        title={editingSubject ? "Edit Subject" : "Create a Subject"}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => { setModalOpen(false); setEditingSubject(null); form.resetFields(); }}
        confirmLoading={modalLoading}
        okText={editingSubject ? "Save" : "Create"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Subject Name"
            rules={[{ required: true, message: "Please enter a subject name" }]}
          >
            <Input placeholder="e.g. Math, Art, Science" maxLength={100} autoFocus />
          </Form.Item>
          {editingSubject && (
            <Form.Item label="Card Color">
              <div className="flex flex-wrap gap-2 mt-1">
                {PALETTE.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColorIdx(i)}
                    title={`Color ${i + 1}`}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `linear-gradient(135deg, ${p.gradFrom} 0%, ${p.gradTo} 100%)`,
                      border: selectedColorIdx === i
                        ? `3px solid #1d1d1d`
                        : "2px solid transparent",
                      outline: selectedColorIdx === i ? `2px solid ${p.gradFrom}` : "none",
                      cursor: "pointer",
                      transition: "transform 0.15s",
                      transform: selectedColorIdx === i ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* ── Delete subject confirmation modal ─────────────────────────── */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <DeleteOutlined />
            <span>Delete Subject</span>
          </div>
        }
        open={!!deleteConfirmSubject}
        onCancel={() => { setDeleteConfirmSubject(null); setDeleteTyped(""); }}
        footer={
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => { setDeleteConfirmSubject(null); setDeleteTyped(""); }}
              className="rounded-lg px-4 py-2 text-sm font-semibold border border-slate-200
                         text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!deleteNameMatches || deleteLoading}
              onClick={async () => {
                if (!deleteConfirmSubject || !deleteNameMatches) return;
                setDeleteLoading(true);
                try {
                  await deleteSubject(deleteConfirmSubject.id);
                  message.success(`"${deleteConfirmSubject.name}" has been deleted`);
                  refreshSubjects();
                  setDeleteConfirmSubject(null);
                  setDeleteTyped("");
                } catch (err: any) {
                  const apiMsg =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    "Failed to delete subject.";
                  message.error(apiMsg);
                } finally {
                  setDeleteLoading(false);
                }
              }}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-all"
              style={{
                background: deleteNameMatches && !deleteLoading ? "#dc2626" : "#fca5a5",
                color: "#fff",
                cursor: deleteNameMatches && !deleteLoading ? "pointer" : "not-allowed",
              }}
            >
              {deleteLoading ? "Deleting…" : "Permanently Delete"}
            </button>
          </div>
        }
        destroyOnClose
      >
        <div className="space-y-4 py-2">
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <p className="font-semibold text-red-700 mb-1">This action is irreversible.</p>
            <p className="text-red-600">
              Deleting <strong>{deleteConfirmSubject?.name}</strong> will permanently remove the
              subject and all of its data — classes, enrollments, assignments and grades.
              There is no undo.
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">
              To confirm, type the subject name exactly:{" "}
              <strong className="text-slate-800">{deleteConfirmSubject?.name}</strong>
            </p>
            <Input
              value={deleteTyped}
              onChange={(e) => setDeleteTyped(e.target.value)}
              placeholder={`Type "${deleteConfirmSubject?.name}" to confirm`}
              status={deleteTyped && !deleteNameMatches ? "error" : undefined}
              autoFocus
            />
            {deleteTyped && !deleteNameMatches && (
              <p className="text-xs text-red-500 mt-1">Name does not match.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
