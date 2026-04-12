"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  buildDashboardNavigation,
  buildStudentUtilityLinks,
  formatDashboardSubjectName,
  normalizeDashboardRole,
  type DashboardNavItem,
} from "@/lib/dashboardNavigation";
import { isSharedPath } from "@/lib/subjectRouting";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";

type LauncherEntry = {
  id: string;
  name: string;
  description: string;
  section: string;
  keywords: string[];
  icon: DashboardNavItem["icon"];
  href?: string;
  badge?: number;
  meta?: string;
  active?: boolean;
  kind: "link" | "subject";
  subjectId?: number;
  subjectName?: string;
};

// ── Subject gradient palette (mirrors subject-cards page) ──────────────────
const SUBJECT_PALETTE = [
  { from: "#f97316", to: "#c2410c", glow: "rgba(249,115,22,0.4)" },   // orange
  { from: "#0ea5e9", to: "#0369a1", glow: "rgba(14,165,233,0.4)" },   // sky
  { from: "#8b5cf6", to: "#5b21b6", glow: "rgba(139,92,246,0.4)" },   // violet
  { from: "#ec4899", to: "#9d174d", glow: "rgba(236,72,153,0.4)" },   // pink
  { from: "#14b8a6", to: "#0f766e", glow: "rgba(20,184,166,0.4)" },   // teal
  { from: "#f59e0b", to: "#b45309", glow: "rgba(245,158,11,0.4)" },   // amber
  { from: "#6366f1", to: "#3730a3", glow: "rgba(99,102,241,0.4)" },   // indigo
  { from: "#10b981", to: "#065f46", glow: "rgba(16,185,129,0.4)" },   // emerald
];
const SUBJECT_NAME_MAP: Record<string, number> = {
  arabic: 0, "al arabiyya": 0,
  islamic: 4, islamiat: 4,
  quran: 5,
  english: 1,
  math: 6, maths: 6,
  science: 7,
  history: 3,
};
const getSubjectPalette = (name: string, idx: number) => {
  const n = name.toLowerCase();
  for (const [key, pi] of Object.entries(SUBJECT_NAME_MAP)) {
    if (n.includes(key)) return SUBJECT_PALETTE[pi];
  }
  return SUBJECT_PALETTE[idx % SUBJECT_PALETTE.length];
};

const SECTION_LABELS: Record<string, { title: string; note: string }> = {
  Subjects: {
    title: "Subject Dashboards",
    note: "Jump straight into any assigned subject.",
  },
  Workspace: {
    title: "Workspace",
    note: "Core pages that help you move around quickly.",
  },
  Teaching: {
    title: "Teaching & Progress",
    note: "Assessments, trackers, behaviour, and learning progress.",
  },
  Communication: {
    title: "Communication",
    note: "Announcements, questions, and updates.",
  },
  Resources: {
    title: "Resources",
    note: "Library, materials, lessons, and supporting content.",
  },
  Account: {
    title: "Account",
    note: "Settings and personal management pages.",
  },
};

const FILTER_ORDER = ["All", "Subjects", "Workspace", "Teaching", "Communication", "Resources", "Account"];

const SECTION_ICON_STYLES: Record<string, { shell: string; icon: string; accent: string }> = {
  Subjects: {
    shell: "border-emerald-300/35 bg-emerald-300/12",
    icon: "text-emerald-300",
    accent: "#34d399",
  },
  Workspace: {
    shell: "border-sky-400/35 bg-sky-400/12",
    icon: "text-sky-300",
    accent: "#38bdf8",
  },
  Teaching: {
    shell: "border-violet-400/35 bg-violet-400/12",
    icon: "text-violet-300",
    accent: "#a78bfa",
  },
  Communication: {
    shell: "border-amber-400/35 bg-amber-400/12",
    icon: "text-amber-300",
    accent: "#fbbf24",
  },
  Resources: {
    shell: "border-cyan-400/35 bg-cyan-400/12",
    icon: "text-cyan-300",
    accent: "#22d3ee",
  },
  Account: {
    shell: "border-rose-400/35 bg-rose-400/12",
    icon: "text-rose-300",
    accent: "#fb7185",
  },
};

const roleLabel = (role?: string | null) => {
  const normalized = normalizeDashboardRole(role);
  if (normalized === "SUPER_ADMIN") return "Super Admin";
  if (normalized === "ADMIN") return "Admin";
  if (normalized === "SCHOOL_ADMIN") return "School Admin";
  if (normalized === "HOD") return "HOD";
  if (normalized === "TEACHER") return "Teacher";
  if (normalized === "STUDENT") return "Student";
  return "User";
};

const dedupeEntries = (entries: LauncherEntry[]) => {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.section}:${entry.name}:${entry.href ?? entry.subjectId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function QuickLauncher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    subjects,
    activeSubjectId,
    activeSubject,
    canUseSubjectContext,
    setActiveSubjectId,
    toSubjectHref,
  } = useSubjectContext();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const roleKey = normalizeDashboardRole(currentUser?.role);
  const isStudent = roleKey === "STUDENT";
  const isIslamicContext =
    !canUseSubjectContext ||
    !activeSubject ||
    /islam|islamiat|islamic/i.test(activeSubject.name);

  const { data: studentSubjectClasses = [] } = useQuery({
    queryKey: ["dashboard-student-subject-classes", activeSubjectId],
    queryFn: async () => {
      if (!activeSubjectId) return [];
      const classes = await fetchSubjectClasses({ subject_id: Number(activeSubjectId) });
      return Array.isArray(classes) ? classes : [];
    },
    enabled: isStudent && !!activeSubjectId,
    staleTime: 1000 * 60,
  });

  const studentSubjectClassId =
    (Array.isArray(studentSubjectClasses) && studentSubjectClasses[0]?.id) || currentUser?.studentClass;
  const studentTrackerHref = studentSubjectClassId
    ? `/dashboard/trackers/${studentSubjectClassId}`
    : "/dashboard/subject-cards";

  const navigationEntries = useMemo<LauncherEntry[]>(() => {
    const items = buildDashboardNavigation({
      roleKey,
      canUseSubjectContext,
      activeSubjectId,
      formattedActiveSubjectName: activeSubject?.name,
      isIslamicContext,
      studentTrackerHref,
    });

    return items
      .filter((item) => item.section !== "Subjects")
      .map((item) => ({
      id: `nav-${item.name}-${item.href}`,
      name: item.name,
      description: item.description,
      section: item.section,
      keywords: item.keywords ?? [],
      icon: item.icon,
      href:
        canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
          ? toSubjectHref(item.href)
          : item.href,
      badge: item.badge,
      active:
        typeof item.href === "string" &&
        pathname.replace(/\/+$/, "") ===
          (
            canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
              ? toSubjectHref(item.href)
              : item.href
          ).replace(/\/+$/, ""),
      kind: "link",
    }));
  }, [
    activeSubject?.name,
    activeSubjectId,
    canUseSubjectContext,
    isIslamicContext,
    pathname,
    roleKey,
    studentTrackerHref,
    toSubjectHref,
  ]);

  const subjectEntries = useMemo<LauncherEntry[]>(() => {
    const subjectRank = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes("arabic")) return 0;
      if (n.includes("islamic") || n.includes("islamiat")) return 1;
      return 2;
    };

    return [...subjects]
      .sort((a, b) => {
        const rankDiff = subjectRank(a.name) - subjectRank(b.name);
        if (rankDiff !== 0) return rankDiff;
        return a.name.localeCompare(b.name);
      })
      .map((subject, idx) => {
        const displayName = formatDashboardSubjectName(subject.name);
        const meta = subject.class_label ? `Class ${subject.class_label}` : subject.code || "Subject workspace";
        return {
          id: `subject-${subject.id}`,
          name: `${displayName} Dashboard`,
          description: `Open ${displayName} and continue where you left off.`,
          section: "Subjects",
          keywords: [displayName, subject.code || "", subject.class_label || "", "subject dashboard"],
          icon: BookOpen,
          meta,
          active: Number(activeSubjectId) === Number(subject.id),
          kind: "subject" as const,
          subjectId: subject.id,
          subjectName: displayName,
        };
      });
  }, [activeSubjectId, subjects]);

  const extraEntries = useMemo<LauncherEntry[]>(() => {
    const items: LauncherEntry[] = [];

    if (canUseSubjectContext && !navigationEntries.some((item) => item.href === "/dashboard/subject-cards")) {
      items.push({
        id: "extra-subject-hub",
        name: "Subject Hub",
        description: "See all assigned subjects and switch dashboards from one place.",
        section: "Workspace",
        keywords: ["subject cards", "subject hub", "all subjects"],
        icon: BookOpen,
        href: "/dashboard/subject-cards",
        kind: "link",
      });
    }

    if (roleKey === "SCHOOL_ADMIN") {
      items.push(
        {
          id: "extra-all-students",
          name: "All Students",
          description: "Open the school-wide student list across all subjects.",
          section: "Workspace",
          keywords: ["students", "profiles", "all students"],
          icon: Users,
          href: "/dashboard/students/all-students",
          kind: "link",
        },
        {
          id: "extra-teachers",
          name: "Teachers",
          description: "Open teacher accounts and assignments.",
          section: "Workspace",
          keywords: ["staff", "teachers"],
          icon: Users,
          href: "/dashboard/teachers",
          kind: "link",
        }
      );
    }

    if (["SCHOOL_ADMIN", "HOD", "TEACHER", "STUDENT"].includes(roleKey)) {
      const settingsHref =
        roleKey === "STUDENT" ? "/dashboard/students/settings"
        : roleKey === "TEACHER" ? "/dashboard/teachers/settings"
        : "/dashboard/school-admin/settings";
      items.push({
        id: "extra-settings",
        name: "Settings",
        description: "Update your account preferences and settings.",
        section: "Account",
        keywords: ["settings", "account", "preferences", "profile"],
        icon: Settings,
        href: settingsHref,
        kind: "link",
      });
    }

    return items;
  }, [canUseSubjectContext, navigationEntries, roleKey]);

  const studentUtilityEntries = useMemo<LauncherEntry[]>(() => {
    if (!isStudent) return [];
    return buildStudentUtilityLinks(currentUser?.student).map((item) => ({
      id: `utility-${item.name}-${item.href}`,
      name: item.name,
      description: item.description,
      section: item.section,
      keywords: item.keywords ?? [],
      icon: item.icon,
      href:
        canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
          ? toSubjectHref(item.href)
          : item.href,
      active:
        typeof item.href === "string" &&
        pathname.replace(/\/+$/, "") ===
          (
            canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
              ? toSubjectHref(item.href)
              : item.href
          ).replace(/\/+$/, ""),
      kind: "link",
    }));
  }, [activeSubjectId, canUseSubjectContext, currentUser?.student, isStudent, pathname, toSubjectHref]);

  const allEntries = useMemo(() => {
    return dedupeEntries([...subjectEntries, ...navigationEntries, ...studentUtilityEntries, ...extraEntries]);
  }, [extraEntries, navigationEntries, studentUtilityEntries, subjectEntries]);

  const availableFilters = useMemo(() => {
    const sections = new Set(allEntries.map((entry) => entry.section));
    return FILTER_ORDER.filter((filter) => filter === "All" || sections.has(filter));
  }, [allEntries]);

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = allEntries.filter((entry) => {
      const passesFilter = activeFilter === "All" || entry.section === activeFilter;
      if (!passesFilter) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        entry.name,
        entry.description,
        entry.meta || "",
        ...entry.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    return FILTER_ORDER.filter((section) => section !== "All")
      .map((section) => ({
        section,
        items: filtered.filter((entry) => entry.section === section),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeFilter, allEntries, query]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => searchRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open]);

  const handleEntryClick = (entry: LauncherEntry) => {
    if (entry.kind === "subject" && entry.subjectId) {
      setOpen(false);
      setActiveSubjectId(entry.subjectId, { navigate: true });
      return;
    }

    if (entry.href) {
      setOpen(false);
      router.push(entry.href);
    }
  };

  const triggerSquares = Array.from({ length: 9 });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800 hover:text-white hover:shadow-md"
        aria-label="Open quick launcher"
      >
        <span className="grid grid-cols-3 gap-1">
          {triggerSquares.map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-[2px] bg-current transition group-hover:scale-110"
            />
          ))}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close quick launcher"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div
            className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl shadow-[0_32px_80px_rgba(2,6,23,0.55)]"
            style={{
              background: "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)",
              border: "1px solid rgba(148,163,184,0.12)",
              maxHeight: "min(86vh, 780px)",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex flex-shrink-0 items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(148,163,184,0.10)" }}
            >
              <div className="flex items-center gap-3">
                {/* grid icon */}
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "rgba(56,193,108,0.15)", border: "1px solid rgba(56,193,108,0.25)" }}
                >
                  <span className="grid grid-cols-3 gap-[3px]">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span key={i} className="h-1 w-1 rounded-[2px]" style={{ background: "#38C16C" }} />
                    ))}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#38C16C" }}>
                    Quick Launcher
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <span>{roleLabel(currentUser?.role)} shortcuts</span>
                    {activeSubject ? (
                      <>
                        <span className="text-slate-600">/</span>
                        <span className="font-semibold text-slate-200">
                          {formatDashboardSubjectName(activeSubject.name)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700/60 hover:text-slate-100"
                aria-label="Close quick launcher"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
              {/* ── Sidebar ── */}
              <aside
                className="flex-shrink-0 p-3"
                style={{ borderRight: "1px solid rgba(148,163,184,0.10)" }}
              >
                {/* search */}
                <label
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition focus-within:ring-1"
                  style={{
                    background: "rgba(148,163,184,0.08)",
                    border: "1px solid rgba(148,163,184,0.14)",
                  }}
                >
                  <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search…"
                    className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </label>

                {/* filters */}
                <div className="mt-4">
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Filters
                  </p>
                  <div className="space-y-0.5">
                    {availableFilters.map((filter) => {
                      const isActive = activeFilter === filter;
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setActiveFilter(filter)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition"
                          style={{
                            background: isActive ? "rgba(56,193,108,0.14)" : "transparent",
                            border: isActive ? "1px solid rgba(56,193,108,0.28)" : "1px solid transparent",
                            color: isActive ? "#86efac" : "rgba(148,163,184,0.85)",
                          }}
                        >
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#38C16C" }} />
                          )}
                          <span className={isActive ? "font-semibold" : "font-medium"}>
                            {filter === "All" ? "Everything" : filter}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* ── Content ── */}
              <div className="overflow-y-auto p-4">
                {filteredSections.length === 0 ? (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl px-6 text-center"
                    style={{ border: "1px dashed rgba(148,163,184,0.15)" }}>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.15)" }}
                    >
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-300">No matches</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try a different search or switch the filter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredSections.map(({ section, items }) => {
                      const sectionMeta = SECTION_LABELS[section] || {
                        title: section,
                        note: "",
                      };
                      const accentColor = SECTION_ICON_STYLES[section]?.accent ?? "#64748b";

                      return (
                        <section key={section}>
                          <div className="mb-2.5 flex items-center gap-2.5">
                            <span
                              className="h-3 w-0.5 rounded-full flex-shrink-0"
                              style={{ background: accentColor }}
                            />
                            <h3 className="text-sm font-bold text-slate-100">{sectionMeta.title}</h3>
                            <div className="h-px flex-1" style={{ background: "rgba(148,163,184,0.08)" }} />
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                            {items.map((entry, entryIdx) => {
                              const Icon = entry.icon;

                              // ── Gradient subject card ──
                              if (entry.kind === "subject" && entry.subjectName) {
                                const pal = getSubjectPalette(entry.subjectName, entryIdx);
                                return (
                                  <button
                                    key={entry.id}
                                    type="button"
                                    onClick={() => handleEntryClick(entry)}
                                    className="group relative overflow-hidden rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                      background: `linear-gradient(135deg, ${pal.from} 0%, ${pal.to} 100%)`,
                                      boxShadow: entry.active
                                        ? `0 0 0 2px ${pal.from}, 0 6px 20px ${pal.glow}`
                                        : `0 3px 14px ${pal.glow}`,
                                    }}
                                  >
                                    <div
                                      className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-20"
                                      style={{ background: "rgba(255,255,255,0.6)" }}
                                    />
                                    <div className="relative p-3.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <div
                                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                          style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
                                        >
                                          <Icon className="h-3.5 w-3.5" />
                                        </div>
                                        {entry.active && (
                                          <span
                                            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                                            style={{ background: "rgba(255,255,255,0.22)" }}
                                          >
                                            ✓ Active
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-2.5 text-sm font-bold text-white leading-snug">{entry.name}</p>
                                      <p
                                        className="mt-0.5 text-[11px] font-medium"
                                        style={{ color: "rgba(255,255,255,0.65)" }}
                                      >
                                        {entry.meta}
                                      </p>
                                      <div
                                        className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-white"
                                        style={{ opacity: 0.80 }}
                                      >
                                        Open dashboard
                                        <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                                      </div>
                                    </div>
                                  </button>
                                );
                              }

                              // ── Standard card ──
                              const iconStyle = SECTION_ICON_STYLES[entry.section];
                              return (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => handleEntryClick(entry)}
                                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5"
                                  style={{
                                    background: entry.active
                                      ? "rgba(148,163,184,0.12)"
                                      : "rgba(148,163,184,0.06)",
                                    border: entry.active
                                      ? `1px solid rgba(148,163,184,0.22)`
                                      : "1px solid rgba(148,163,184,0.10)",
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(148,163,184,0.12)";
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(148,163,184,0.22)";
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!entry.active) {
                                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(148,163,184,0.06)";
                                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(148,163,184,0.10)";
                                    }
                                  }}
                                >
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${iconStyle?.shell ?? "border-slate-600 bg-slate-800"}`}
                                  >
                                    <Icon className={`h-3.5 w-3.5 ${iconStyle?.icon ?? "text-slate-300"}`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-sm font-semibold text-slate-100 truncate">{entry.name}</span>
                                      {entry.active && (
                                        <span
                                          className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                                          style={{ background: iconStyle?.accent ?? "#64748b" }}
                                        >
                                          Active
                                        </span>
                                      )}
                                      {entry.badge ? (
                                        <span
                                          className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
                                          style={{ background: iconStyle?.accent ?? "#64748b" }}
                                        >
                                          {entry.badge}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-slate-300 group-hover:translate-x-0.5" />
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
