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
const PRIORITY_SUBJECT_DASHBOARDS = ["arabic", "islamic", "islamiat"];

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
    const prioritizedSubjects = subjects.filter((subject) => {
      const normalizedName = subject.name.toLowerCase();
      return PRIORITY_SUBJECT_DASHBOARDS.some((name) => normalizedName.includes(name));
    });

    const subjectRank = (name: string) => {
      const normalizedName = name.toLowerCase();
      if (normalizedName.includes("arabic")) return 0;
      if (normalizedName.includes("islamic") || normalizedName.includes("islamiat")) return 1;
      return 2;
    };

    return prioritizedSubjects
      .sort((left, right) => subjectRank(left.name) - subjectRank(right.name))
      .map((subject) => {
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
        kind: "subject",
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
        <div className="fixed inset-0 z-[120]">
          <button
            type="button"
            aria-label="Close quick launcher"
            className="absolute inset-0 bg-slate-950/80"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-0 overflow-hidden border border-slate-700/70 bg-slate-800 shadow-[0_28px_80px_rgba(2,6,23,0.45)]">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-5 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300/95">
                  Quick Launcher
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-300/80">
                  <span>{roleLabel(currentUser?.role)} shortcuts</span>
                  {activeSubject ? (
                    <>
                      <span className="text-slate-500">/</span>
                      <span className="font-medium text-slate-100/95">
                        {formatDashboardSubjectName(activeSubject.name)}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-700/60 text-slate-300 transition hover:border-slate-500 hover:bg-slate-700 hover:text-slate-100"
                aria-label="Close quick launcher"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid h-[calc(100vh-65px)] min-h-[420px] overflow-hidden lg:grid-cols-[330px_minmax(0,1fr)]">
              <aside className="border-b border-slate-700 bg-slate-800 p-4 lg:border-b-0 lg:border-r">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 shadow-sm">
                  <label className="flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-700/45 px-3 py-2.5 focus-within:border-slate-500 focus-within:bg-slate-700/70">
                    <Search className="h-4 w-4 text-slate-500" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search pages, tools, or modules"
                      className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-400/80"
                    />
                  </label>

                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300/80">
                      Filters
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {availableFilters.map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm transition ${
                              isActive
                                ? "border-slate-500 bg-slate-700/75 text-slate-100 shadow-sm"
                                : "border-transparent bg-slate-800 text-slate-300/80 hover:border-slate-600 hover:bg-slate-700/50"
                            }`}
                          >
                            <span className="font-medium">{filter === "All" ? "Everything" : filter}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="overflow-y-auto bg-slate-800 p-4">
                {filteredSections.length === 0 ? (
                  <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-600 bg-slate-700/30 px-6 text-center">
                    <div className="rounded-2xl border border-slate-600 bg-slate-700/50 p-4 text-slate-300 shadow-sm">
                      <Search className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-100">No matches yet</h3>
                    <p className="mt-2 max-w-md text-sm text-slate-400">
                      Try a different search term or switch the filter on the left to reveal more pages.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSections.map(({ section, items }) => {
                      const sectionMeta = SECTION_LABELS[section] || {
                        title: section,
                        note: "Important pages and shortcuts for this workspace.",
                      };

                      return (
                        <section key={section}>
                          <div className="mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-100/95">
                                {sectionMeta.title}
                              </h3>
                            </div>
                          </div>

                          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
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
                                    className="group relative overflow-hidden rounded-[18px] text-left transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                      background: `linear-gradient(135deg, ${pal.from} 0%, ${pal.to} 100%)`,
                                      boxShadow: entry.active
                                        ? `0 0 0 2.5px ${pal.from}, 0 8px 28px ${pal.glow}`
                                        : `0 4px 18px ${pal.glow}`,
                                    }}
                                  >
                                    {/* decorative circle */}
                                    <div
                                      className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full opacity-20"
                                      style={{ background: "rgba(255,255,255,0.6)" }}
                                    />
                                    <div className="relative p-4">
                                      <div className="flex items-start justify-between gap-2">
                                        <div
                                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                          style={{ background: "rgba(255,255,255,0.20)", color: "#fff" }}
                                        >
                                          <Icon className="h-4 w-4" />
                                        </div>
                                        {entry.active && (
                                          <span
                                            className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                                            style={{ background: "rgba(255,255,255,0.25)" }}
                                          >
                                            ✓ Active
                                          </span>
                                        )}
                                      </div>
                                      <div className="mt-3">
                                        <p className="text-sm font-bold text-white leading-snug">{entry.name}</p>
                                        {entry.meta && (
                                          <p className="mt-1 text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>
                                            {entry.meta}
                                          </p>
                                        )}
                                      </div>
                                      <div
                                        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-white"
                                        style={{ opacity: 0.85 }}
                                      >
                                        Open dashboard
                                        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                                      </div>
                                    </div>
                                  </button>
                                );
                              }

                              // ── Standard dark card ──
                              const iconStyle = SECTION_ICON_STYLES[entry.section];
                              return (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => handleEntryClick(entry)}
                                  className={`group rounded-[16px] border p-3 text-left transition-all duration-200 ${
                                    entry.active
                                      ? "border-slate-500 bg-slate-700/70 shadow-[0_12px_28px_rgba(2,6,23,0.26)]"
                                      : "border-slate-600/70 bg-slate-700/35 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-700/65 hover:shadow-[0_10px_24px_rgba(2,6,23,0.30)]"
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div
                                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border shadow-sm ${
                                        iconStyle?.shell ?? "border-slate-600 bg-slate-800"
                                      }`}
                                    >
                                      <Icon
                                        className={`h-4 w-4 ${
                                          iconStyle?.icon ?? "text-slate-300"
                                        }`}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-100">
                                          {entry.name}
                                        </span>
                                        {entry.badge ? (
                                          <span
                                            className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                                            style={{ background: iconStyle?.accent ?? "#64748b" }}
                                          >
                                            {entry.badge}
                                          </span>
                                        ) : null}
                                        {entry.active ? (
                                          <span
                                            className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                                            style={{ background: iconStyle?.accent ?? "#64748b", opacity: 0.9 }}
                                          >
                                            Active
                                          </span>
                                        ) : null}
                                      </div>
                                      {entry.meta ? (
                                        <div className="mt-1.5 inline-flex rounded-full bg-slate-700/80 px-2.5 py-1 text-[11px] font-medium text-slate-300/85">
                                          {entry.meta}
                                        </div>
                                      ) : null}
                                    </div>
                                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-slate-200 group-hover:translate-x-0.5" />
                                  </div>
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
