"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Empty, Spin } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  LogoutOutlined,
  NotificationOutlined,
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
  const { subjects, loading, canUseSubjectContext, activeSubjectId, setActiveSubjectId } =
    useSubjectContext();

  const role = String(currentUser?.role || "").trim().toUpperCase();
  const isStudent = role === "STUDENT";
  const isSchoolAdmin = isSchoolAdminRole(currentUser?.role ?? null);
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
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
                  className="relative overflow-hidden rounded-3xl cursor-pointer
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
                    className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full opacity-15"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />

                  <div className="relative p-6">
                    {/* active badge */}
                    {isActive && (
                      <div
                        className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full
                                   px-3 py-1 text-xs font-bold"
                        style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
                      >
                        <CheckCircleFilled />
                        Active
                      </div>
                    )}

                    {/* icon */}
                    <div
                      className="mb-4 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: "rgba(255,255,255,0.20)", color: "#fff" }}
                    >
                      <BookOutlined />
                    </div>

                    {/* name */}
                    <h3 className="text-xl font-bold text-white leading-tight mb-1">
                      {displayName}
                    </h3>
                    {displayCode && (
                      <p className="text-xs font-medium mb-5" style={{ color: "rgba(255,255,255,0.70)" }}>
                        {displayCode}
                      </p>
                    )}

                    {/* CTA */}
                    <button
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold
                                 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: "rgba(255,255,255,0.22)",
                        border: "1.5px solid rgba(255,255,255,0.35)",
                        color: "#fff",
                      }}
                    >
                      <RocketOutlined />
                      Open Dashboard
                    </button>
                  </div>
                </div>
              );
            })}
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
            <QuickLinkCard name="Courses"     href="/dashboard/courses"    desc="Access subject courses including Lessons and Mind-upgrade."       Icon={ReadOutlined} />
            <QuickLinkCard name="Library"     href="/dashboard/library"    desc="Open shared resources for the current school workspace."          Icon={BookOutlined} />
            <QuickLinkCard name="Leaderboard" href={leaderboardHref}       desc="School-wide student rankings across all subjects."               Icon={TrophyOutlined} />

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
            <QuickLinkCard name="Library"       href="/dashboard/library"               desc="Shared resources available to subjects you assign."                 Icon={BookOutlined} />
            <QuickLinkCard name="Timetable"     href="/dashboard/time_table"            desc="Build the school timetable across years and classes."               Icon={CalendarOutlined} />
            <QuickLinkCard name="Announcements" href="/dashboard/announcements"         desc="Send announcements to HODs, teachers, and students."                Icon={NotificationOutlined} />
            <QuickLinkCard name="Tools"         href="/dashboard/tools"                 desc="Extra tools that support all subjects."                             Icon={ToolOutlined} />
            <QuickLinkCard name="Leaderboard"   href={leaderboardHref}                  desc="See school-wide student rankings across all subjects."              Icon={TrophyOutlined} />
          </div>
        </div>
      )}
    </div>
  );
}
