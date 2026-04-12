"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Empty, Spin, Modal, Input, Form, message } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
  NotificationOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  RocketOutlined,
  SettingOutlined,
  SolutionOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { RootState, AppDispatch } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/authSlice";
import { addSubject, updateSubject, deleteSubject } from "@/services/subjectsApi";

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

// ── Helpers ───────────────────────────────────────────────────────────────────
const roleLabel = (role?: string) => {
  const n = String(role || "").trim().toUpperCase();
  if (n === "SCHOOL_ADMIN") return "School Admin";
  if (n === "ADMIN") return "Platform Admin";
  if (n === "HOD") return "HOD";
  if (n === "TEACHER") return "Teacher";
  if (n === "STUDENT") return "Student";
  return "User";
};

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

export default function SubjectCardsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { subjects, loading, canUseSubjectContext, activeSubjectId, setActiveSubjectId, refreshSubjects } =
    useSubjectContext();

  const role = String(currentUser?.role || "").trim().toUpperCase();
  const isStudent = role === "STUDENT";
  const isSchoolAdmin = isSchoolAdminRole(currentUser?.role ?? null);

  // ── Create / Edit subject modal state ───────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ id: number; name: string } | null>(null);
  const [form] = Form.useForm();
  // ── Delete confirmation modal state ──────────────────────────────────
  const [deleteConfirmSubject, setDeleteConfirmSubject] = useState<{ id: number; name: string } | null>(null);
  const [deleteTyped, setDeleteTyped] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteNameMatches = deleteTyped.trim().toLowerCase() === (deleteConfirmSubject?.name ?? "").trim().toLowerCase();
  const isStaffWorkspaceRole = ["ADMIN", "HOD", "TEACHER"].includes(role);
  const showAccountInfoChips = ["TEACHER", "STUDENT", "HOD"].includes(role) || isSchoolAdmin;
  const settingsHref =
    role === "STUDENT" ? "/dashboard/students/settings"
    : role === "TEACHER" ? "/dashboard/teachers/settings"
    : "/dashboard/school-admin/settings";
  const accountDisplayName = String(currentUser?.name || "User").trim() || "User";
  const leaderboardHref = activeSubjectId
    ? `/dashboard/s/${activeSubjectId}/leaderboard`
    : "/dashboard/leaderboard";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
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
        message.success("Subject updated");
      } else {
        await addSubject({ name: values.name.trim(), school_id: currentUser?.school });
        message.success("Subject created");
      }
      refreshSubjects();
      setModalOpen(false);
      form.resetFields();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!canUseSubjectContext || !canEnterSubjectWorkspace) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <Empty description="Subject workspace is not enabled for this account." />
      </div>
    );
  }

  const studentQuickLinks: QLProps[] = [
    { name: "Library",        href: "/dashboard/library",                       desc: "Open your shared reading and learning resources.",                 Icon: BookOutlined },
    { name: "Timetable",      href: "/dashboard/time_table",                    desc: "Check your schedule for classes and activities.",                  Icon: CalendarOutlined },
    { name: "Announcements",  href: "/dashboard/announcements",                 desc: "Read the latest updates sent to students.",                        Icon: NotificationOutlined },
    { name: "Ask a Question", href: "/dashboard/questions",                     desc: "Send questions and view replies from teachers.",                   Icon: QuestionCircleOutlined },
    { name: "Behavior",       href: `/dashboard/behavior/${currentUser?.student}`, desc: "Review your behaviour notes and updates.",                     Icon: SolutionOutlined },
    { name: "Leaderboard",    href: leaderboardHref,                            desc: "See how you rank against your classmates and the whole school.",   Icon: TrophyOutlined },
  ];

  // ── Hero header ─────────────────────────────────────────────────────────────
  const initials = accountDisplayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="space-y-6 pb-10">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0a2318 100%)",
        }}
      >
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #38C16C, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-20 h-32 w-32 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #38C16C, transparent 70%)" }} />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* left: avatar + info */}
          <div className="flex items-center gap-5">
            <div
              className="flex-shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center
                         text-xl font-bold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #38C16C 0%, #16a34a 100%)",
                boxShadow: "0 0 0 3px rgba(56,193,108,0.35)",
              }}
            >
              {initials || "U"}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-1">
                {roleLabel(currentUser?.role)} workspace
              </p>
              <h1 className="text-2xl font-bold text-white leading-tight">
                Welcome back, {accountDisplayName.split(" ")[0]}
              </h1>
              {showAccountInfoChips && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1
                               text-xs font-semibold text-green-300"
                    style={{ background: "rgba(56,193,108,0.15)", border: "1px solid rgba(56,193,108,0.3)" }}
                  >
                    {roleLabel(currentUser?.role)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1
                               text-xs font-medium text-slate-300"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    {accountDisplayName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* right: settings + sign out */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href={settingsHref}>
              <button
                className="flex items-center justify-center h-10 w-10 rounded-xl text-white
                           transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
              >
                <SettingOutlined />
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm
                         font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.35)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.28)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            >
              <LogoutOutlined />
              Sign Out
            </button>
          </div>
        </div>
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

        {subjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10">
            <Empty description="No assigned subjects found." />
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {subjects.map((subject, idx) => {
              const isActive = Number(activeSubjectId) === Number(subject.id);
              const displayName = typeof subject.name === "string"
                ? subject.name.replace(/islamiat/gi, "Islamic")
                : subject.name;
              const displayCode = typeof subject.code === "string"
                ? subject.code.replace(/islamiat/gi, "Islamic")
                : subject.code;
              const pal = getPalette(String(displayName), idx);

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
            <QuickLinkCard name="Markbook"    href="/dashboard/students/reports"    desc="Open student reports and performance summaries."                 Icon={BarChartOutlined} />
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
            <QuickLinkCard name="Markbook"          href="/dashboard/students/reports"   desc="Open student reports and performance summaries."                    Icon={BarChartOutlined} />
            <QuickLinkCard name="Library"       href="/dashboard/library"               desc="Shared resources available to subjects you assign."                 Icon={BookOutlined} />
            <QuickLinkCard name="Timetable"     href="/dashboard/time_table"            desc="Build the school timetable across years and classes."               Icon={CalendarOutlined} />
            <QuickLinkCard name="Announcements" href="/dashboard/announcements"         desc="Send announcements to HODs, teachers, and students."                Icon={NotificationOutlined} />
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
