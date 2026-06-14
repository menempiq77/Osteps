"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  Library,
  Megaphone,
  MoreVertical,
  Settings,
  Star,
  Users,
  Wrench,
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
  QUICK_LAUNCHER_FAVORITES_CHANGED_EVENT,
  getQuickLauncherFavoritesStorageKey,
  readQuickLauncherFavoriteIds,
} from "@/lib/quickLauncherFavorites";
import { isSharedPath } from "@/lib/subjectRouting";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import OstepsLogo from "@/assets/images/Logo2.jpg";

type FavoriteEntry = {
  id: string;
  name: string;
  href?: string;
  icon: DashboardNavItem["icon"];
  section: DashboardNavItem["section"];
  active?: boolean;
  kind: "link" | "subject";
  subjectId?: number;
};

const sidebarAccent: Record<string, string> = {
  Subjects: "#60a5fa",
  Workspace: "#93c5fd",
  Teaching: "#a78bfa",
  Communication: "#f9a8d4",
  Resources: "#86efac",
  Account: "#fbbf24",
};

const itemLabel = (value: string) =>
  value
    .replace(/ Dashboard$/i, "")
    .replace(/Content Approvals/i, "Approvals")
    .replace(/Mind-upgrade/i, "Mind Upgrade");

export default function FavoriteSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    subjects,
    activeSubjectId,
    activeSubject,
    canUseSubjectContext,
    setActiveSubjectId,
    toSubjectHref,
  } = useSubjectContext();
  const favoriteStorageKey = getQuickLauncherFavoritesStorageKey(currentUser);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readQuickLauncherFavoriteIds(currentUser));

  const roleKey = normalizeDashboardRole(currentUser?.role);
  const isStudent = roleKey === "STUDENT";
  const isIslamicContext =
    !canUseSubjectContext ||
    !activeSubject ||
    /islam|islamiat|islamic/i.test(activeSubject.name);

  const { data: studentSubjectClasses = [] } = useQuery({
    queryKey: ["favorite-sidebar-student-subject-classes", activeSubjectId],
    queryFn: async () => {
      if (!activeSubjectId) return [];
      const classes = await fetchSubjectClasses({ subject_id: Number(activeSubjectId) });
      return Array.isArray(classes) ? classes : [];
    },
    enabled: isStudent && !!activeSubjectId,
    staleTime: 5 * 60 * 1000,
  });

  const studentSubjectClassId =
    (Array.isArray(studentSubjectClasses) && studentSubjectClasses[0]?.id) || currentUser?.studentClass;
  const studentTrackerHref = studentSubjectClassId
    ? `/dashboard/trackers/${studentSubjectClassId}`
    : "/dashboard/subject-cards";

  const subjectEntries = useMemo<FavoriteEntry[]>(() => {
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
      .map((subject) => ({
        id: `subject-${subject.id}`,
        name: `${formatDashboardSubjectName(subject.name)} Dashboard`,
        section: "Subjects",
        icon: BookOpen,
        active: Number(activeSubjectId) === Number(subject.id),
        kind: "subject" as const,
        subjectId: subject.id,
      }));
  }, [activeSubjectId, subjects]);

  const navigationEntries = useMemo<FavoriteEntry[]>(() => {
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
      .map((item) => {
        const href =
          canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
            ? toSubjectHref(item.href)
            : item.href;
        return {
          id: `nav-${item.name}-${item.href}`,
          name: item.name,
          section: item.section,
          icon: item.icon,
          href,
          active: pathname.replace(/\/+$/, "") === href.replace(/\/+$/, ""),
          kind: "link" as const,
        };
      });
  }, [activeSubject?.name, activeSubjectId, canUseSubjectContext, isIslamicContext, pathname, roleKey, studentTrackerHref, toSubjectHref]);

  const extraEntries = useMemo<FavoriteEntry[]>(() => {
    const items: FavoriteEntry[] = [];
    const addEntryIfMissing = (entry: FavoriteEntry) => {
      const alreadyExists = [...navigationEntries, ...items].some(
        (item) => item.name === entry.name || (entry.href && item.href === entry.href)
      );
      if (!alreadyExists) items.push(entry);
    };

    if (canUseSubjectContext && !navigationEntries.some((item) => item.href === "/dashboard/subject-cards")) {
      items.push({
        id: "extra-subject-hub",
        name: "Subject Hub",
        section: "Workspace",
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
          section: "Workspace",
          icon: Users,
          href: "/dashboard/students/all-students",
          kind: "link",
        },
        {
          id: "extra-teachers",
          name: "Teachers",
          section: "Workspace",
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
          section: "Workspace",
          icon: Users,
          href: "/dashboard/students-staff",
          kind: "link" as const,
        },
        {
          id: "school-courses",
          name: "Courses",
          section: "Resources",
          icon: BookText,
          href: "/dashboard/courses",
          kind: "link" as const,
        },
        {
          id: "school-markbook",
          name: "Markbook",
          section: "Teaching",
          icon: BarChart3,
          href: "/dashboard/students/markbook",
          kind: "link" as const,
        },
        {
          id: "nav-Library-/dashboard/library",
          name: "Library",
          section: "Resources",
          icon: Library,
          href: "/dashboard/library",
          kind: "link" as const,
        },
        {
          id: "nav-Timetable-/dashboard/timetable-builder",
          name: "Timetable",
          section: "Workspace",
          icon: CalendarDays,
          href: "/dashboard/timetable-builder",
          kind: "link" as const,
        },
        {
          id: "school-calendar",
          name: "Calendar",
          section: "Workspace",
          icon: CalendarDays,
          href: "/dashboard/time_table?view=calendar",
          kind: "link" as const,
        },
        {
          id: "nav-Announcements-/dashboard/announcements",
          name: "Announcements",
          section: "Communication",
          icon: Megaphone,
          href: "/dashboard/announcements",
          kind: "link" as const,
        },
        {
          id: "nav-Tools-/dashboard/tools",
          name: "Tools",
          section: "Workspace",
          icon: Wrench,
          href: "/dashboard/tools",
          kind: "link" as const,
        },
        {
          id: "nav-Leaderboard-/dashboard/leaderboard/",
          name: "Leaderboard",
          section: "Teaching",
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
          section: "Resources",
          icon: BookText,
          href: "/dashboard/courses",
          kind: "link" as const,
        },
        {
          id: "school-markbook",
          name: "Markbook",
          section: "Teaching",
          icon: BarChart3,
          href: "/dashboard/students/markbook",
          kind: "link" as const,
        },
        {
          id: "nav-Library-/dashboard/library",
          name: "Library",
          section: "Resources",
          icon: Library,
          href: "/dashboard/library",
          kind: "link" as const,
        },
        {
          id: "nav-Leaderboard-/dashboard/leaderboard/",
          name: "Leaderboard",
          section: "Teaching",
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
          section: "Resources",
          icon: Library,
          href: "/dashboard/library",
          kind: "link" as const,
        },
        {
          id: "nav-Leaderboard-/dashboard/leaderboard",
          name: "Leaderboard",
          section: "Teaching",
          icon: Award,
          href: activeSubjectId ? `/dashboard/s/${activeSubjectId}/leaderboard` : "/dashboard/leaderboard",
          kind: "link" as const,
        },
        {
          id: "nav-Lessons-/dashboard/lessons",
          name: "Lessons",
          section: "Teaching",
          icon: BookText,
          href: "/dashboard/lessons",
          kind: "link" as const,
        },
        ...(isIslamicContext
          ? [
              {
                id: "nav-Mind-upgrade-/dashboard/mind-upgrade",
                name: "Mind-upgrade",
                section: "Resources",
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
        section: "Account",
        icon: Settings,
        href: settingsHref,
        kind: "link",
      });
    }

    return items;
  }, [activeSubjectId, canUseSubjectContext, isIslamicContext, navigationEntries, roleKey]);

  const studentUtilityEntries = useMemo<FavoriteEntry[]>(() => {
    if (!isStudent) return [];
    return buildStudentUtilityLinks(currentUser?.student).map((item) => {
      const href =
        canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
          ? toSubjectHref(item.href)
          : item.href;
      return {
        id: `utility-${item.name}-${item.href}`,
        name: item.name,
        section: item.section,
        icon: item.icon,
        href,
        active: pathname.replace(/\/+$/, "") === href.replace(/\/+$/, ""),
        kind: "link" as const,
      };
    });
  }, [activeSubjectId, canUseSubjectContext, currentUser?.student, isStudent, pathname, toSubjectHref]);

  const allEntries = useMemo(() => {
    const seen = new Set<string>();
    return [...subjectEntries, ...navigationEntries, ...studentUtilityEntries, ...extraEntries].filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    });
  }, [extraEntries, navigationEntries, studentUtilityEntries, subjectEntries]);

  const favoriteEntries = useMemo(() => {
    return favoriteIds
      .map((id) => allEntries.find((entry) => entry.id === id))
      .filter((entry): entry is FavoriteEntry => Boolean(entry))
      .slice(0, 10);
  }, [allEntries, favoriteIds]);

  useEffect(() => {
    setFavoriteIds(readQuickLauncherFavoriteIds(currentUser));
  }, [currentUser, favoriteStorageKey]);

  useEffect(() => {
    const syncFavorites = () => setFavoriteIds(readQuickLauncherFavoriteIds(currentUser));
    window.addEventListener("storage", syncFavorites);
    window.addEventListener(QUICK_LAUNCHER_FAVORITES_CHANGED_EVENT, syncFavorites);
    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener(QUICK_LAUNCHER_FAVORITES_CHANGED_EVENT, syncFavorites);
    };
  }, [currentUser, favoriteStorageKey]);

  const handleClick = (entry: FavoriteEntry) => {
    if (entry.kind === "subject" && entry.subjectId) {
      setActiveSubjectId(entry.subjectId, { navigate: true });
      return;
    }
    if (entry.href) {
      router.push(entry.href);
    }
  };

  const isActiveHref = (href?: string) => {
    if (!href) return false;
    const current = pathname.replace(/\/+$/, "");
    const base = href.split("?")[0].replace(/\/+$/, "");
    return current === base || current.startsWith(`${base}/`);
  };

  const fixedEntries = useMemo<FavoriteEntry[]>(() => {
    const canManageTimetable = ["SCHOOL_ADMIN", "SUPER_ADMIN", "HOD", "TEACHER"].includes(roleKey);
    const items: FavoriteEntry[] = [
      {
        id: "fixed-library",
        name: "Library",
        section: "Resources",
        icon: Library,
        href: "/dashboard/library",
        kind: "link",
      },
      {
        id: "fixed-leaderboard",
        name: "Leaderboard",
        section: "Teaching",
        icon: Award,
        href: activeSubjectId ? `/dashboard/s/${activeSubjectId}/leaderboard` : "/dashboard/leaderboard",
        kind: "link",
      },
      {
        id: "fixed-timetable",
        name: "Timetable",
        section: "Workspace",
        icon: CalendarDays,
        href: canManageTimetable ? "/dashboard/timetable-builder" : "/dashboard/time_table",
        kind: "link",
      },
      {
        id: "fixed-announcements",
        name: "Announcements",
        section: "Communication",
        icon: Megaphone,
        href: "/dashboard/announcements",
        kind: "link",
      },
    ];
    return items.map((item) => ({ ...item, active: isActiveHref(item.href) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubjectId, roleKey, pathname]);

  const renderItem = (entry: FavoriteEntry) => {
    const Icon = entry.icon;
    const accent = sidebarAccent[entry.section] || "#93c5fd";
    return (
      <button
        key={entry.id}
        type="button"
        onClick={() => handleClick(entry)}
        className={`group relative flex w-full flex-col items-center gap-1 px-1 py-2 text-center transition ${
          entry.active ? "bg-[#525264] text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
        }`}
        title={entry.name}
      >
        <span
          className={`absolute left-0 top-1/2 h-9 w-0.5 -translate-y-1/2 rounded-r-full transition ${
            entry.active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
          }`}
          style={{ backgroundColor: accent }}
        />
        <Icon className="h-5 w-5" style={{ color: accent }} />
        <span className="line-clamp-2 max-w-[56px] text-[9px] font-semibold leading-tight drop-shadow">
          {itemLabel(entry.name)}
        </span>
      </button>
    );
  };

  return (
    <aside className="fixed bottom-0 left-0 top-[78px] z-[650] hidden w-[64px] flex-col overflow-hidden rounded-tr-2xl border-r border-white/10 bg-[#424253] text-white shadow-[12px_0_28px_rgba(15,23,42,0.18)] md:flex">
      <div className="shrink-0 border-b border-white/10 px-1.5 pb-2 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard/subject-cards")}
          className="group flex h-[50px] w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] p-1 shadow-inner transition hover:bg-white/15 hover:shadow-[0_0_0_3px_rgba(56,193,108,0.18)]"
          aria-label="Go to Home"
          title="Home"
        >
          <Image
            src={OstepsLogo}
            alt="Osteps Home"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-contain object-center transition group-hover:scale-105"
            priority
          />
        </button>
      </div>

      {/* Fixed quick-access shortcuts */}
      <div className="shrink-0 border-b-2 border-white/60 py-1.5">
        <div className="space-y-0.5">{fixedEntries.map(renderItem)}</div>
      </div>

      {/* User-chosen favourites */}
      <div className="flex-1 overflow-y-auto py-1.5">
        {favoriteEntries.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center text-white/45">
            <Star className="h-5 w-5" />
            <span className="text-[9px] font-semibold leading-tight">
              Star modules to pin favourites
            </span>
          </div>
        ) : (
          <div className="space-y-0.5">{favoriteEntries.map(renderItem)}</div>
        )}
      </div>

      <div className="border-t border-white/10 p-2">
        <div className="flex h-8 items-center justify-center rounded bg-white/10 text-white/75">
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>
    </aside>
  );
}