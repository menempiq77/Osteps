"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { Empty, Modal, Input, Form, message } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleFilled,
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

const MyScheduleWidget = dynamic(() => import("@/components/dashboard/MyScheduleWidget"), {
  loading: () => <ScheduleWidgetSkeleton />,
});

// ── Subject colour palette ────────────────────────────────────────────────────
const PALETTE = [
  { gradFrom: "#f97316", gradTo: "#c2410c", glow: "rgba(249,115,22,0.35)" },   // orange
  { gradFrom: "#0ea5e9", gradTo: "#0369a1", glow: "rgba(14,165,233,0.35)" },   // sky
  { gradFrom: "#8b5cf6", gradTo: "#5b21b6", glow: "rgba(139,92,246,0.35)" },   // violet
  { gradFrom: "#ec4899", gradTo: "#9d174d", glow: "rgba(236,72,153,0.35)" },   // pink
  { gradFrom: "#14b8a6", gradTo: "#0f766e", glow: "rgba(20,184,166,0.35)" },   // teal
  { gradFrom: "#f59e0b", gradTo: "#b45309", glow: "rgba(245,158,11,0.35)" },   // amber
  { gradFrom: "#6366f1", gradTo: "#3730a3", glow: "rgba(99,102,241,0.35)" },   // indigo
  { gradFrom: "#10b981", gradTo: "#065f46", glow: "rgba(16,185,129,0.35)" },   // emerald
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
  "Library":       { bg: "#eff6ff", iconColor: "#2563eb", border: "#bfdbfe" },
  "Timetable":     { bg: "#fff7ed", iconColor: "#ea580c", border: "#fed7aa" },
  "Announcements": { bg: "#fff1f2", iconColor: "#e11d48", border: "#fecdd3" },
  "Ask a Question":{ bg: "#f5f3ff", iconColor: "#7c3aed", border: "#ddd6fe" },
  "Behavior":      { bg: "#fffbeb", iconColor: "#d97706", border: "#fde68a" },
  "Leaderboard":   { bg: "#fefce8", iconColor: "#b45309", border: "#fef08a" },
  "Settings":      { bg: "#f8fafc", iconColor: "#475569", border: "#e2e8f0" },
  "All Students":  { bg: "#ecfdf5", iconColor: "#059669", border: "#a7f3d0" },
  "Teachers":      { bg: "#eff6ff", iconColor: "#2563eb", border: "#bfdbfe" },
  "Students & Staff": { bg: "#ecfdf5", iconColor: "#059669", border: "#a7f3d0" },
  "Markbook":      { bg: "#f0fdf4", iconColor: "#16a34a", border: "#86efac" },
  "Tools":         { bg: "#f5f3ff", iconColor: "#7c3aed", border: "#ddd6fe" },
};
const DEFAULT_LINK: LinkColor = { bg: "#f0fdf4", iconColor: "#38C16C", border: "#b9e2cd" };
const lc = (name: string): LinkColor => LINK_COLORS[name] ?? DEFAULT_LINK;

const isSchoolAdminRole = (role?: string | null) =>
  String(role || "").trim().toUpperCase() === "SCHOOL_ADMIN";

// ── Quick-link card ───────────────────────────────────────────────────────────
type QLProps = { name: string; href: string; desc: string; Icon: React.ComponentType<any> };
function QuickLinkCard({ name, href, desc, Icon }: QLProps) {
  const c = lc(name);
  return (
    <Link href={href}>
      <div
        className="group cursor-pointer rounded-2xl border bg-white p-4 flex items-center gap-4
                   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{ borderColor: c.border }}
      >
        <div
          className="flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center text-xl
                     transition-transform duration-200 group-hover:scale-110"
          style={{ background: c.bg, color: c.iconColor, border: `1.5px solid ${c.border}` }}
        >
          <Icon />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function ScheduleWidgetSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="ml-auto h-8 w-44 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
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
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: includeCreateCard ? 6 : 5 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-6 h-6 w-16 animate-pulse rounded-full bg-slate-100" />
          <div className="mb-3 h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
          <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mb-4 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
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
    { name: "Behavior",       href: `/dashboard/behavior/${currentUser?.student}`, desc: "Review your behaviour notes and updates.",                     Icon: SolutionOutlined },
    { name: "Leaderboard",    href: leaderboardHref,                            desc: "See how you rank against your classmates and the whole school.",   Icon: TrophyOutlined },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ── My Schedule ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-7 w-1 rounded-full" style={{ background: "var(--primary)" }} />
          <h2 className="text-lg font-bold text-slate-800">My Schedule</h2>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        {loading ? <ScheduleWidgetSkeleton /> : <MyScheduleWidget currentUser={currentUser} isStudent={isStudent} />}
      </div>

      {/* ── Subject cards ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-7 w-1 rounded-full" style={{ background: "var(--primary)" }} />
          <h2 className="text-lg font-bold text-slate-800">
            {isStudent ? "Choose a Subject" : "Choose a Subject Dashboard"}
          </h2>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {!loading && subjects.length > 0 && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={subjectSearch}
              onChange={(event) => setSubjectSearch(event.target.value)}
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search subjects by name or code"
              className="sm:max-w-sm"
            />
            <div className="text-xs font-medium text-slate-500">
              {filteredSubjects.length} of {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

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
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                  className="relative overflow-hidden rounded-2xl cursor-pointer
                             transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, ${pal.gradFrom} 0%, ${pal.gradTo} 100%)`,
                    boxShadow: isActive
                      ? `0 0 0 3px ${pal.gradFrom}, 0 8px 32px ${pal.glow}`
                      : `0 4px 24px ${pal.glow}`,
                  }}
                  onClick={() => setActiveSubjectId(Number(subject.id), { navigate: true })}
                >
                  {/* decorative circle */}
                  <div
                    className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full opacity-20"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-3 -left-3 h-12 w-12 rounded-full opacity-15"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />

                  <div className="relative p-4">
                    {/* admin actions row */}
                    {isSchoolAdmin && (
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal({ id: subject.id, name: subject.name }); }}
                          className="flex items-center justify-center h-6 w-6 rounded-full
                                     transition-all duration-200 hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                          title="Edit subject"
                        >
                          <EditOutlined style={{ fontSize: 11 }} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSubject({ id: subject.id, name: subject.name }); }}
                          className="flex items-center justify-center h-6 w-6 rounded-full
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
                        className="absolute top-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                      >
                        <CheckCircleFilled style={{ fontSize: 10 }} />
                        Active
                      </div>
                    )}

                    {/* icon */}
                    <div
                      className="mt-6 mb-3 h-10 w-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: "rgba(255,255,255,0.20)", color: "#fff" }}
                    >
                      <BookOutlined />
                    </div>

                    {/* name */}
                    <h3 className="text-sm font-bold text-white leading-tight mb-1 truncate">
                      {displayName}
                    </h3>
                    {displayCode && (
                      <p className="text-xs font-medium mb-3 truncate" style={{ color: "rgba(255,255,255,0.70)" }}>
                        {displayCode}
                      </p>
                    )}

                    {/* CTA */}
                    <button
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold
                                 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: "rgba(255,255,255,0.22)",
                        border: "1.5px solid rgba(255,255,255,0.35)",
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
                className="relative overflow-hidden rounded-2xl cursor-pointer
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                           flex flex-col items-center justify-center min-h-[150px]"
                style={{
                  border: "2px dashed #94a3b8",
                  background: "rgba(248,250,252,0.6)",
                }}
              >
                <div
                  className="mb-2 h-10 w-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "#e2e8f0", color: "#475569" }}
                >
                  <PlusOutlined />
                </div>
                <p className="text-xs font-bold text-slate-600">Create a Subject</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Student quick links ───────────────────────────────────────────── */}
      {isStudent && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-7 w-1 rounded-full" style={{ background: "#6366f1" }} />
            <h2 className="text-lg font-bold text-slate-800">Student Tools</h2>
            <span className="text-xs font-medium text-slate-400 ml-1 hidden sm:block">
              Quick access to the pages you use most
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {studentQuickLinks.map((item) => (
              <QuickLinkCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Staff shared resources ────────────────────────────────────────── */}
      {isStaffWorkspaceRole && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-7 w-1 rounded-full" style={{ background: "#0ea5e9" }} />
            <h2 className="text-lg font-bold text-slate-800">Shared Resources</h2>
            <span className="text-xs font-medium text-slate-400 ml-1 hidden sm:block">
              Available outside the subject workspace
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <QuickLinkCard name="Courses"     href="/dashboard/courses"             desc="Access subject courses including Lessons and Mind-upgrade."       Icon={ReadOutlined} />
            <QuickLinkCard name="Markbook"    href="/dashboard/students/markbook"    desc="Open student reports and performance summaries."                 Icon={BarChartOutlined} />
            <QuickLinkCard name="Library"     href="/dashboard/library"             desc="Open shared resources for the current school workspace."          Icon={BookOutlined} />
            <QuickLinkCard name="Leaderboard" href={leaderboardHref}                desc="School-wide student rankings across all subjects."               Icon={TrophyOutlined} />

          </div>
        </div>
      )}

      {/* ── School-admin management ───────────────────────────────────────── */}
      {isSchoolAdmin && !isStudent && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-7 w-1 rounded-full" style={{ background: "#ec4899" }} />
            <h2 className="text-lg font-bold text-slate-800">School-wide Management</h2>
            <span className="text-xs font-medium text-slate-400 ml-1 hidden sm:block">
              All-subject tools — manage students and staff here
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <QuickLinkCard name="Students & Staff" href="/dashboard/students-staff"      desc="Manage all students and teachers across subjects."                  Icon={TeamOutlined} />
            <QuickLinkCard name="Courses"           href="/dashboard/courses"            desc="Access subject courses including Lessons and Mind-upgrade."         Icon={ReadOutlined} />
            <QuickLinkCard name="Markbook"          href="/dashboard/students/markbook"   desc="Open student reports and performance summaries."                    Icon={BarChartOutlined} />
            <QuickLinkCard name="Library"       href="/dashboard/library"               desc="Shared resources available to subjects you assign."                 Icon={BookOutlined} />
            <QuickLinkCard name="Timetable"          href="/dashboard/timetable-builder"  desc="Open the builder first, then switch to the calendar when needed."    Icon={TableOutlined} />
            <QuickLinkCard name="Calendar"           href="/dashboard/time_table?view=calendar" desc="Open the calendar view by subject, class, or teacher."            Icon={CalendarOutlined} />
            <QuickLinkCard name="Announcements"     href="/dashboard/announcements"      desc="Send announcements to HODs, teachers, and students."                Icon={NotificationOutlined} />
            <QuickLinkCard name="Tools"         href="/dashboard/tools"                 desc="Extra tools that support all subjects."                             Icon={ToolOutlined} />
            <QuickLinkCard name="Leaderboard"   href={leaderboardHref}                  desc="See school-wide student rankings across all subjects."              Icon={TrophyOutlined} />
          </div>
        </div>
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
