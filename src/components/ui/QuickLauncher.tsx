"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BarChart3,
  BookOpen,
  BookText,
  Brain,
  CalendarDays,
  ChevronRight,
  Library,
  Megaphone,
  Search,
  Settings,
  Star,
  Users,
  Wrench,
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
import {
  getQuickLauncherFavoritesStorageKey,
  readQuickLauncherFavoriteIds,
  writeQuickLauncherFavoriteIds,
} from "@/lib/quickLauncherFavorites";
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

const getModuleEmoji = (entry: Pick<LauncherEntry, "name" | "section">) => {
  const name = entry.name.toLowerCase();
  if (name.includes("arabic")) return "📙";
  if (name.includes("islam") || name.includes("quran")) return "📖";
  if (name.includes("math")) return "➗";
  if (name.includes("social") || name.includes("moral")) return "🌍";
  if (name.includes("student")) return "👥";
  if (name.includes("teacher")) return "👩‍🏫";
  if (name.includes("manager")) return "🗂️";
  if (name.includes("view")) return "📁";
  if (name.includes("hub") || name.includes("subject")) return "📚";
  if (name.includes("approval")) return "✅";
  if (name.includes("setting")) return "⚙️";
  if (name.includes("course")) return "📘";
  if (name.includes("quiz") || name.includes("assessment")) return "📝";
  if (name.includes("tracker") || name.includes("progress")) return "📈";
  if (name.includes("report") || name.includes("markbook")) return "📊";
  if (name.includes("library") || name.includes("lesson")) return "📚";
  if (name.includes("material")) return "📄";
  if (name.includes("class") || name.includes("school")) return "🏫";
  if (name.includes("timetable") || name.includes("calendar")) return "🗓️";
  if (name.includes("announcement")) return "📣";
  if (name.includes("tool")) return "🛠️";
  if (name.includes("leaderboard")) return "🏆";
  if (name.includes("behaviour") || name.includes("behavior")) return "🌱";
  if (entry.section === "Account") return "⚙️";
  if (entry.section === "Teaching") return "🎓";
  if (entry.section === "Resources") return "📚";
  return "✨";
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
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);
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
  const favoriteStorageKey = getQuickLauncherFavoritesStorageKey(currentUser);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readQuickLauncherFavoriteIds(currentUser));
  const [loadedFavoriteStorageKey, setLoadedFavoriteStorageKey] = useState(favoriteStorageKey);

  const roleKey = normalizeDashboardRole(currentUser?.role);
  const currentUserLabel = String(
    (currentUser as any)?.name ??
      (currentUser as any)?.user_name ??
      (currentUser as any)?.email ??
      roleLabel(currentUser?.role)
  );
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
    enabled: open && isStudent && !!activeSubjectId,
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
    const addEntryIfMissing = (entry: LauncherEntry) => {
      const alreadyExists = [...navigationEntries, ...items].some(
        (item) => item.name === entry.name || (entry.href && item.href === entry.href)
      );
      if (!alreadyExists) items.push(entry);
    };

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

    if (roleKey === "SCHOOL_ADMIN") {
      [
        {
          id: "school-students-staff",
          name: "Students & Staff",
          description: "Manage all students and teachers across subjects.",
          section: "Workspace",
          keywords: ["students", "teachers", "staff", "school-wide"],
          icon: Users,
          href: "/dashboard/students-staff",
          kind: "link" as const,
        },
        {
          id: "school-courses",
          name: "Courses",
          description: "Access subject courses including Lessons and Mind-upgrade.",
          section: "Resources",
          keywords: ["courses", "lessons", "mind upgrade"],
          icon: BookText,
          href: "/dashboard/courses",
          kind: "link" as const,
        },
        {
          id: "school-markbook",
          name: "Markbook",
          description: "Open student reports and performance summaries.",
          section: "Teaching",
          keywords: ["markbook", "reports", "performance"],
          icon: BarChart3,
          href: "/dashboard/students/markbook",
          kind: "link" as const,
        },
        {
          id: "nav-Library-/dashboard/library",
          name: "Library",
          description: "Open shared resources available to assigned subjects.",
          section: "Resources",
          keywords: ["library", "resources", "books", "materials"],
          icon: Library,
          href: "/dashboard/library",
          kind: "link" as const,
        },
        {
          id: "nav-Timetable-/dashboard/timetable-builder",
          name: "Timetable",
          description: "Open the timetable builder and schedule tools.",
          section: "Workspace",
          keywords: ["timetable", "schedule", "builder"],
          icon: CalendarDays,
          href: "/dashboard/timetable-builder",
          kind: "link" as const,
        },
        {
          id: "school-calendar",
          name: "Calendar",
          description: "Open the calendar view by subject, class, or teacher.",
          section: "Workspace",
          keywords: ["calendar", "schedule", "time table"],
          icon: CalendarDays,
          href: "/dashboard/time_table?view=calendar",
          kind: "link" as const,
        },
        {
          id: "nav-Announcements-/dashboard/announcements",
          name: "Announcements",
          description: "Send announcements to HODs, teachers, and students.",
          section: "Communication",
          keywords: ["announcements", "messages", "updates"],
          icon: Megaphone,
          href: "/dashboard/announcements",
          kind: "link" as const,
        },
        {
          id: "nav-Tools-/dashboard/tools",
          name: "Tools",
          description: "Open extra tools that support all subjects.",
          section: "Workspace",
          keywords: ["tools", "utilities", "support"],
          icon: Wrench,
          href: "/dashboard/tools",
          kind: "link" as const,
        },
        {
          id: "nav-Leaderboard-/dashboard/leaderboard/",
          name: "Leaderboard",
          description: "See school-wide student rankings across all subjects.",
          section: "Teaching",
          keywords: ["leaderboard", "ranking", "points"],
          icon: Award,
          href: activeSubjectId ? `/dashboard/s/${activeSubjectId}/leaderboard` : "/dashboard/leaderboard",
          kind: "link" as const,
        },
      ].forEach(addEntryIfMissing);
    }

    if (["HOD", "TEACHER"].includes(roleKey)) {
      [
        {
          id: "school-courses",
          name: "Courses",
          description: "Access subject courses including Lessons and Mind-upgrade.",
          section: "Resources",
          keywords: ["courses", "lessons", "mind upgrade"],
          icon: BookText,
          href: "/dashboard/courses",
          kind: "link" as const,
        },
        {
          id: "school-markbook",
          name: "Markbook",
          description: "Open student reports and performance summaries.",
          section: "Teaching",
          keywords: ["markbook", "reports", "performance"],
          icon: BarChart3,
          href: "/dashboard/students/markbook",
          kind: "link" as const,
        },
        {
          id: "nav-Library-/dashboard/library",
          name: "Library",
          description: "Open shared resources for the current school workspace.",
          section: "Resources",
          keywords: ["library", "resources", "materials"],
          icon: Library,
          href: "/dashboard/library",
          kind: "link" as const,
        },
        {
          id: "nav-Leaderboard-/dashboard/leaderboard/",
          name: "Leaderboard",
          description: "See school-wide student rankings across all subjects.",
          section: "Teaching",
          keywords: ["leaderboard", "ranking", "points"],
          icon: Award,
          href: activeSubjectId ? `/dashboard/s/${activeSubjectId}/leaderboard` : "/dashboard/leaderboard",
          kind: "link" as const,
        },
      ].forEach(addEntryIfMissing);
    }

    if (roleKey === "STUDENT") {
      [
        {
          id: "nav-Library-/dashboard/library",
          name: "Library",
          description: "Open shared reading and learning resources.",
          section: "Resources",
          keywords: ["library", "resources", "books", "materials"],
          icon: Library,
          href: "/dashboard/library",
          kind: "link" as const,
        },
        {
          id: "nav-Leaderboard-/dashboard/leaderboard",
          name: "Leaderboard",
          description: "See your points and ranking across the school.",
          section: "Teaching",
          keywords: ["leaderboard", "ranking", "points"],
          icon: Award,
          href: activeSubjectId ? `/dashboard/s/${activeSubjectId}/leaderboard` : "/dashboard/leaderboard",
          kind: "link" as const,
        },
        {
          id: "nav-Lessons-/dashboard/lessons",
          name: "Lessons",
          description: "Review subject lessons and activities.",
          section: "Teaching",
          keywords: ["lessons", "activities", "learning"],
          icon: BookText,
          href: "/dashboard/lessons",
          kind: "link" as const,
        },
        ...(isIslamicContext
          ? [
              {
                id: "nav-Mind-upgrade-/dashboard/mind-upgrade",
                name: "Mind-upgrade",
                description: "Open your Islamic mind-upgrade space.",
                section: "Resources",
                keywords: ["mind upgrade", "islamic", "activities"],
                icon: Brain,
                href: "/dashboard/mind-upgrade",
                kind: "link" as const,
              },
            ]
          : []),
      ].forEach(addEntryIfMissing);
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
  }, [activeSubjectId, canUseSubjectContext, isIslamicContext, navigationEntries, roleKey]);

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

  const availableCategories = useMemo(() => {
    const sections = new Set(allEntries.map((entry) => entry.section));
    return FILTER_ORDER.filter((filter) => filter !== "All" && sections.has(filter));
  }, [allEntries]);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allEntries.filter((entry) => {
      const passesFilter =
        activeFilter === "All" ||
        (activeFilter === "Favourites" ? favoriteIdSet.has(entry.id) : entry.section === activeFilter);
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
  }, [activeFilter, allEntries, favoriteIdSet, query]);

  const activeFilterTitle =
    activeFilter === "All"
      ? "All Modules"
      : activeFilter === "Favourites"
        ? "Favourites"
        : SECTION_LABELS[activeFilter]?.title || activeFilter;

  const toggleFavorite = (entryId: string) => {
    setFavoriteIds((current) =>
      current.includes(entryId)
        ? current.filter((id) => id !== entryId)
        : [...current, entryId]
    );
  };

  useEffect(() => {
    setFavoriteIds(readQuickLauncherFavoriteIds(currentUser));
    setLoadedFavoriteStorageKey(favoriteStorageKey);
  }, [currentUser, favoriteStorageKey]);

  useEffect(() => {
    if (loadedFavoriteStorageKey !== favoriteStorageKey) return;
    writeQuickLauncherFavoriteIds(favoriteIds, currentUser);
  }, [currentUser, favoriteIds, favoriteStorageKey, loadedFavoriteStorageKey]);

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
    const timer = window.setTimeout(() => {
      const target = window.matchMedia("(max-width: 767px)").matches
        ? mobileSearchRef.current
        : searchRef.current;
      target?.focus();
    }, 60);

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
        className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-md"
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
        <div className="fixed inset-0 z-[1200] bg-[#3f3f4d]">
          <div className="flex h-full w-full flex-col overflow-hidden bg-[#3f3f4d] text-white">
            <header className="flex h-14 shrink-0 items-center justify-between bg-white px-5 text-[#3f3f4d] shadow-sm">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 bg-white text-[#3f3f4d] shadow-sm transition hover:bg-slate-50"
                  aria-label="Close quick launcher"
                >
                  <span className="grid grid-cols-3 gap-[3px]">
                    {triggerSquares.map((_, index) => (
                      <span key={index} className="h-1.5 w-1.5 rounded-[1px] bg-[#3f3f4d]" />
                    ))}
                  </span>
                </button>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm">
                    👤
                  </span>
                  <span className="truncate text-sm font-semibold">
                    {currentUserLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:inline">
                  Quick Launcher
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close quick launcher"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 overflow-hidden">
            <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-[#3b3b49] p-6 md:block">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#4d4d5a] text-white shadow-inner">
                  <span className="grid grid-cols-3 gap-[3px]">
                    {triggerSquares.map((_, index) => (
                      <span key={index} className="h-1.5 w-1.5 rounded-[1px] bg-white/90" />
                    ))}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-white">Quick Launcher</p>
                  <p className="truncate text-[11px] text-white/55">
                    {roleLabel(currentUser?.role)} modules
                    {activeSubject ? ` / ${formatDashboardSubjectName(activeSubject.name)}` : ""}
                  </p>
                </div>
              </div>

              <label className="flex h-9 items-center gap-2 bg-white px-3 text-[#3f3f4d]">
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search for a module..."
                  className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
                />
                <Search className="h-4 w-4 shrink-0 text-[#3f3f4d]" />
              </label>

              <div className="mt-6">
                <p className="mb-2 text-sm font-bold uppercase text-white">Filters</p>
                <div className="space-y-1">
                  {[
                    { key: "All", label: "All Modules" },
                    { key: "Favourites", label: "Favourites" },
                  ].map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setActiveFilter(filter.key)}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold transition ${
                          isActive ? "bg-[#575666] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{filter.label}</span>
                        {filter.key === "Favourites" && favoriteIds.length > 0 ? (
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80">
                            {favoriteIds.length}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-2 text-sm font-bold uppercase text-white">Categories</p>
                <div className="space-y-1">
                  {availableCategories.map((category) => {
                    const isActive = activeFilter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveFilter(category)}
                        className={`block w-full px-3 py-2 text-left text-xs transition ${
                          isActive ? "bg-[#575666] font-semibold text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1 overflow-y-auto p-5 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-white/50 md:hidden">
                    Quick Launcher
                  </p>
                  <h2 className="text-lg font-bold uppercase text-white">{activeFilterTitle}</h2>
                  <p className="mt-0.5 text-xs text-white/50">
                    {filteredEntries.length} module{filteredEntries.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close quick launcher"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-5 grid gap-2 md:hidden">
                <label className="flex h-9 items-center gap-2 bg-white px-3 text-[#3f3f4d]">
                  <input
                    ref={mobileSearchRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search for a module..."
                    className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
                  />
                  <Search className="h-4 w-4 shrink-0 text-[#3f3f4d]" />
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {["All", "Favourites", ...availableCategories].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`shrink-0 px-3 py-1.5 text-xs font-semibold ${
                        activeFilter === filter ? "bg-[#575666] text-white" : "bg-white/5 text-white/70"
                      }`}
                    >
                      {filter === "All" ? "All Modules" : filter}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-white/15 text-center">
                  <Search className="h-7 w-7 text-white/40" />
                  <p className="mt-3 text-sm font-semibold text-white">No modules found</p>
                  <p className="mt-1 text-xs text-white/45">Try another search, filter, or category.</p>
                </div>
              ) : (
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredEntries.map((entry) => {
                    const isFavorite = favoriteIdSet.has(entry.id);
                    const emoji = getModuleEmoji(entry);
                    return (
                      <div
                        key={entry.id}
                        className="group flex min-h-[78px] items-center bg-[#555462] transition hover:bg-[#616071]"
                      >
                        <button
                          type="button"
                          onClick={() => handleEntryClick(entry)}
                          className="flex min-w-0 flex-1 items-center gap-5 px-6 py-5 text-left"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#474654] shadow-inner">
                            <span className="text-2xl leading-none opacity-85 saturate-75">
                              {emoji}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-white/90">
                              {entry.name}
                            </span>
                            {entry.active || entry.badge ? (
                              <span className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">
                                {entry.active ? "Active" : null}
                                {entry.active && entry.badge ? <span>•</span> : null}
                                {entry.badge ? `${entry.badge}` : null}
                              </span>
                            ) : null}
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/55" />
                        </button>
                        <button
                          type="button"
                          aria-label={isFavorite ? `Remove ${entry.name} from favourites` : `Add ${entry.name} to favourites`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(entry.id);
                          }}
                          className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center text-white/70 transition hover:text-white"
                        >
                          <Star className={`h-4 w-4 ${isFavorite ? "fill-white text-white" : ""}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
