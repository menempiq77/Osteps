"use client";

import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, ArrowRight, Home, LogOut, Settings as SettingsIcon } from "lucide-react";
import { RootState } from "@/store/store";
import SubjectSwitcher from "@/components/ui/SubjectSwitcher";
import SchoolNotificationBell from "@/components/dashboard/SchoolNotificationBell";
import { SubjectContextProvider } from "@/contexts/SubjectContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getStoredSubjectName } from "@/lib/subjectScope";
import { IMPERSONATION_STORAGE_KEY, isImpersonating, logout, setCurrentUser } from "@/features/auth/authSlice";
import { User } from "@/features/auth/types";

const QuickLauncher = dynamic(() => import("@/components/ui/QuickLauncher"));
const FavoriteSidebar = dynamic(() => import("@/components/ui/FavoriteSidebar"));
const SubjectRightSidebar = dynamic(() => import("@/components/ui/SubjectRightSidebar"));
const RightSidebarReveal = dynamic(() => import("@/components/ui/RightSidebarReveal"));
const PinnedPagesDock = dynamic(() => import("@/components/ui/PinnedPagesDock"));

const THEME_STORAGE_KEY = "osteps-dashboard-theme";
const THEMES = {
  green: {
    label: "Green",
    primary: "#38C16C",
    soft: "#eef9f2",
    soft2: "#dff3e7",
    border: "#b9e2cd",
    dark: "#2f8f5b",
    shadow: "rgba(22, 101, 52, 0.35)",
    scrollStart: "#34d399",
    scrollEnd: "#16a34a",
  },
  blue: {
    label: "Blue",
    primary: "#2F80ED",
    soft: "#edf4ff",
    soft2: "#d9e9ff",
    border: "#b9d2ff",
    dark: "#1f5fb8",
    shadow: "rgba(30, 64, 175, 0.35)",
    scrollStart: "#60a5fa",
    scrollEnd: "#2563eb",
  },
  red: {
    label: "Red",
    primary: "#E35D5D",
    soft: "#fff0f0",
    soft2: "#ffe0e0",
    border: "#f7bbbb",
    dark: "#b84141",
    shadow: "rgba(153, 27, 27, 0.32)",
    scrollStart: "#f87171",
    scrollEnd: "#dc2626",
  },
  purple: {
    label: "Purple",
    primary: "#8B5CF6",
    soft: "#f3efff",
    soft2: "#e9dfff",
    border: "#d3c0ff",
    dark: "#6a3fd0",
    shadow: "rgba(109, 40, 217, 0.33)",
    scrollStart: "#a78bfa",
    scrollEnd: "#7c3aed",
  },
  orange: {
    label: "Orange",
    primary: "#F08A24",
    soft: "#fff5e9",
    soft2: "#ffe8cd",
    border: "#f6d0a2",
    dark: "#b86315",
    shadow: "rgba(180, 83, 9, 0.34)",
    scrollStart: "#fb923c",
    scrollEnd: "#ea580c",
  },
} as const;

type ThemeName = keyof typeof THEMES;

const applyTheme = (themeName: ThemeName) => {
  const theme = THEMES[themeName];
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--theme-soft", theme.soft);
  root.style.setProperty("--theme-soft-2", theme.soft2);
  root.style.setProperty("--theme-border", theme.border);
  root.style.setProperty("--theme-dark", theme.dark);
  root.style.setProperty("--theme-shadow", theme.shadow);
  root.style.setProperty("--theme-scroll-start", theme.scrollStart);
  root.style.setProperty("--theme-scroll-end", theme.scrollEnd);
  root.style.setProperty("--theme-name", themeName);
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const [themeName, setThemeName] = useState<ThemeName>("green");
  const [storedSubjectName, setStoredSubjectName] = useState<string | null>(null);
  const [impersonating, setImpersonating] = useState(false);
  const unscopedPathname = pathname.replace(
    /^\/dashboard\/s\/\d+(?:\/[^/]+)?(?=\/|$)/,
    "/dashboard"
  );

  const formatSubjectName = (value?: string | null) =>
    String(value || "Subject").replace(/islamiat/gi, "Islamic").trim();

  const formatSegmentLabel = (segment: string) => {
    if (segment === "dashboard" && /^\/dashboard\/s\/\d+$/.test(pathname) && storedSubjectName) {
      return `${formatSubjectName(storedSubjectName)} Dashboard`;
    }
    const cleaned = decodeURIComponent(segment).replace(/[-_]+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = useMemo(() => {
    let segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "dashboard" && segments[1] === "s" && /^\d+$/.test(segments[2] || "")) {
      segments = ["dashboard", ...segments.slice(3)];
    }
    const items: Array<{ label: string; href: string }> = [];

    if (!segments.length) return items;

    let runningPath = "";
    segments.forEach((segment) => {
      runningPath += `/${segment}`;
      items.push({
        label: formatSegmentLabel(segment),
        href: runningPath,
      });
    });

    return items;
  }, [pathname]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    setImpersonating(isImpersonating());
  }, [isHydrated, pathname]);

  const handleStopImpersonation = () => {
    const raw = localStorage.getItem(IMPERSONATION_STORAGE_KEY);
    localStorage.removeItem(IMPERSONATION_STORAGE_KEY);
    let returnPath = "/dashboard/students/all-students";
    if (raw) {
      const { currentUser: adminUser, returnPath: storedReturnPath } = JSON.parse(raw) as { currentUser: User; token: string; returnPath?: string };
      dispatch(setCurrentUser(adminUser));
      if (storedReturnPath?.startsWith("/dashboard")) {
        returnPath = storedReturnPath;
      }
    }
    setImpersonating(false);
    router.push(returnPath);
  };

  useEffect(() => {
    if (!isHydrated) return;
    setStoredSubjectName(getStoredSubjectName());
  }, [isHydrated, pathname]);

  useEffect(() => {
    if (!isHydrated) return;
    const raw = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    const nextTheme: ThemeName =
      raw && Object.prototype.hasOwnProperty.call(THEMES, raw) ? raw : "green";
    setThemeName(nextTheme);
    applyTheme(nextTheme);
  }, [isHydrated]);

  const handleThemeChange = (nextTheme: ThemeName) => {
    setThemeName(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const isImmersiveLessonGroupRoute =
    pathname.startsWith("/dashboard/lessons/uae-curriculum/") && pathname.includes("/groups/");
  const isSubjectCardsEntryRoute =
    pathname === "/dashboard/subject-cards" ||
    /^\/dashboard\/s\/\d+\/subject-cards$/.test(pathname);
  const isSubjectWorkspaceRoute = /^\/dashboard\/s\/\d+(?:\/|$)/.test(pathname);
  const isStandaloneTeacherRoute =
    pathname === "/dashboard/teachers" || pathname.startsWith("/dashboard/teachers/");
  const isLibraryRoute = unscopedPathname === "/dashboard/library";
  const isLeaderboardRoute =
    unscopedPathname === "/dashboard/leaderboard" ||
    unscopedPathname === "/dashboard/leaderboard/" ||
    /^\/dashboard\/s\/\d+(?:\/[^/]+)?\/leaderboard\/?$/.test(pathname);
  const isTimeTableRoute = unscopedPathname === "/dashboard/time_table";
  const isTimetableBuilderRoute =
    unscopedPathname === "/dashboard/timetable-builder" ||
    pathname.endsWith("/timetable-builder");
  const isTimetableGeneratorRoute =
    unscopedPathname === "/dashboard/timetable-generator" ||
    pathname.endsWith("/timetable-generator");
  const isToolsRoute = unscopedPathname === "/dashboard/tools" || unscopedPathname.startsWith("/dashboard/tools/");
  const isStudentsStaffRoute = unscopedPathname === "/dashboard/students-staff";
  const isCoursesRoute = unscopedPathname === "/dashboard/courses" || unscopedPathname.startsWith("/dashboard/courses/");
  const isLessonsRoute = !isImmersiveLessonGroupRoute && (unscopedPathname === "/dashboard/lessons" || unscopedPathname.startsWith("/dashboard/lessons/"));
  const isMindUpgradeRoute = unscopedPathname === "/dashboard/mind-upgrade" || unscopedPathname.startsWith("/dashboard/mind-upgrade/");
  const isAnnouncementsRoute = unscopedPathname === "/dashboard/announcements";
  const isAssessmentDocumentRoute = unscopedPathname === "/dashboard/assessment-document";
  const isStudentExamAssessmentRoute =
    isAssessmentDocumentRoute &&
    searchParams.get("role") !== "teacher" &&
    searchParams.get("examMode") === "1";
  const isReportsRoute = pathname === "/dashboard/students/reports" ||
    pathname.startsWith("/dashboard/students/reports/") ||
    pathname === "/dashboard/students/markbook" ||
    pathname.startsWith("/dashboard/students/markbook/") ||
    /^\/dashboard\/s\/\d+\/students\/(reports|markbook)(\/|$)/.test(pathname);
  const isSettingsRoute = unscopedPathname.endsWith("/settings");
  const isAllStudentsStandaloneRoute =
    pathname === "/dashboard/students/all-students" ||
    pathname === "/dashboard/students/all-school" ||
    pathname === "/dashboard/students/all";
  const isGlobalStudentProfileRoute = pathname.startsWith("/dashboard/students/all-students/profile/");
  const isStudentStandaloneUtilityRoute =
    currentUser?.role === "STUDENT" &&
    (
      unscopedPathname === "/dashboard/library" ||
      unscopedPathname === "/dashboard/time_table" ||
      unscopedPathname === "/dashboard/announcements" ||
      unscopedPathname === "/dashboard/questions" ||
      unscopedPathname.startsWith("/dashboard/questions/") ||
      unscopedPathname.startsWith("/dashboard/behavior") ||
      /\/behavior\//.test(pathname)
    );

  useEffect(() => {
    if (isHydrated && !currentUser) {
      if (isImmersiveLessonGroupRoute) {
        return;
      }

      try {
        const storedUser = window.localStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as Partial<User> | null;
          if (parsedUser?.id && parsedUser?.role) {
            dispatch(setCurrentUser(parsedUser as User));
            return;
          }
        }
      } catch {
        // Fall through to sign-in redirect when stored auth is missing or invalid.
      }

      router.replace("/");
      window.location.replace("/");
    }
  }, [currentUser, dispatch, router, isHydrated, isImmersiveLessonGroupRoute]);

  useEffect(() => {
    if (!isHydrated) return;
    setIsRouteTransitioning(true);
    const timer = setTimeout(() => setIsRouteTransitioning(false), 420);
    return () => clearTimeout(timer);
  }, [pathname, isHydrated]);

  if (!currentUser && isImmersiveLessonGroupRoute) {
    return (
      <div className="dashboard-theme-scope min-h-screen bg-white">
        <div className="relative min-h-screen">
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="dashboard-theme-scope flex min-h-screen items-center justify-center bg-[var(--theme-soft)] px-4 text-center">
        <div className="max-w-md rounded-2xl border border-[var(--theme-border)] bg-white px-6 py-5 shadow-sm">
          <div className="text-sm font-semibold text-[var(--theme-dark)]">
            {isHydrated ? "Redirecting to sign in" : "Loading dashboard"}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {isHydrated
              ? "This dashboard needs an active session. If you opened it in a fresh incognito window, sign in first."
              : "Please wait while your dashboard session is restored."}
          </p>
        </div>
      </div>
    );
  }

  const shouldApplyMaxWidth = !isImmersiveLessonGroupRoute && !isReportsRoute;
  const showSubjectRightSidebar = isSubjectWorkspaceRoute && !isStudentExamAssessmentRoute;
  const showRightEdgeReveal =
    !showSubjectRightSidebar &&
    !isStudentExamAssessmentRoute &&
    !isImmersiveLessonGroupRoute;
  const dashboardPaddingClass = showSubjectRightSidebar
    ? "px-3 pb-3 pt-[78px] md:pb-6 md:pl-[84px] md:pr-[84px] md:pt-[66px]"
    : "px-3 pb-3 pt-[78px] md:pb-6 md:pl-[84px] md:pr-6 md:pt-[66px]";
  const mainContentPaddingClass = showSubjectRightSidebar
    ? "max-w-7xl px-3 pb-3 pt-[78px] md:pb-6 md:pl-[84px] md:pr-[84px] md:pt-[66px]"
    : "max-w-7xl px-3 pb-3 pt-[78px] md:pb-6 md:pl-[84px] md:pr-6 md:pt-[66px]";
  const fullWidthContentPaddingClass = showSubjectRightSidebar
    ? "pt-[78px] md:pl-[72px] md:pr-[72px] md:pt-[66px]"
    : "pt-[78px] md:pl-[72px] md:pt-[66px]";

  const userRoleLabel = (() => {
    const role = (currentUser?.role || "").toUpperCase().replace(/\s+/g, "_");
    if (role === "STUDENT") return (currentUser as any)?.studentClassName || "Student";
    if (role === "SCHOOL_ADMIN") return "School Admin";
    if (role === "HOD") return "HOD";
    if (role === "TEACHER") return "Teacher";
    if (role === "SUPER_ADMIN") return "Super Admin";
    return role;
  })();
  const userDisplayName = String(currentUser?.name || currentUser?.email || "").replace(/_/g, " ");
  const userInitials =
    userDisplayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "O";
  const userFirstName = userDisplayName.trim().split(/\s+/)[0] || "there";
  const normalizedRole = String(currentUser?.role || "").trim().toUpperCase();
  const workspaceLabel = `${userRoleLabel} Workspace`.toUpperCase();
  const settingsHref =
    normalizedRole === "STUDENT" ? "/dashboard/students/settings"
    : normalizedRole === "TEACHER" ? "/dashboard/teachers/settings"
    : "/dashboard/school-admin/settings";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const renderThemeSwitcher = () => (
    <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1.5 shadow-inner backdrop-blur-md">
      {(Object.keys(THEMES) as ThemeName[]).map((name) => (
        <button
          key={name}
          type="button"
          title={THEMES[name].label}
          onClick={() => handleThemeChange(name)}
          className={`h-5 w-5 rounded-full border transition ${
            themeName === name
              ? "scale-110 ring-2 ring-offset-1 ring-[var(--theme-border)]"
              : "opacity-80 hover:opacity-100"
          }`}
          style={{ backgroundColor: THEMES[name].primary }}
        />
      ))}
    </div>
  );

  const renderNavigationButtons = () => (
    <div className="flex flex-wrap items-center justify-start gap-1.5 lg:justify-end">
      <button
        type="button"
        onClick={() => router.push("/dashboard/subject-cards")}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white shadow-sm backdrop-blur-md transition hover:bg-white/20"
        aria-label="Home"
        title="Home"
      >
        <Home className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white shadow-sm backdrop-blur-md transition hover:bg-white/20"
        aria-label="Back"
        title="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => window.history.forward()}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white shadow-sm backdrop-blur-md transition hover:bg-white/20"
        aria-label="Next"
        title="Next"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  const renderAccountActions = () => (
    <div className="flex shrink-0 items-center gap-2">
      <SchoolNotificationBell />
      <button
        type="button"
        onClick={() => router.push(settingsHref)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
        aria-label="Open settings"
        title="Settings"
      >
        <SettingsIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );

  const renderDashboardTopBar = ({
    showSubjectSwitcher = false,
  }: {
    showSubjectSwitcher?: boolean;
  }) => {
    return (
      <div
        className="fixed left-0 right-0 top-0 z-[900] overflow-hidden border-b border-white/10 px-3 py-1.5 text-white shadow-[0_18px_42px_rgba(15,23,42,0.22)] md:h-14 md:px-4 md:py-0"
        style={{
          background:
            "linear-gradient(105deg, #242936 0%, #253742 30%, #373f61 63%, #403344 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_8%_18%,rgba(56,193,108,0.18),transparent_24%),radial-gradient(circle_at_92%_50%,rgba(255,255,255,0.10),transparent_25%)]" />
        <div className="pointer-events-none absolute -left-10 -top-16 h-36 w-36 rounded-full bg-[#38C16C]/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-[#38C16C]/10 blur-3xl" />
        <div className="relative flex min-h-[46px] w-full flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between md:h-full md:min-h-0">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex shrink-0 items-center gap-2.5">
              <QuickLauncher />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-[#38C16C] text-sm font-black text-white shadow-[0_0_0_3px_rgba(56,193,108,0.20)] sm:h-10 sm:w-10 sm:text-base">
                {userInitials}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-green-300 md:text-[10px]">
                {workspaceLabel}
              </p>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                <h1 className="truncate text-base font-black leading-tight text-white md:text-lg">
                  Welcome back, {userFirstName}
                </h1>
                <span className="rounded-full border border-[#38C16C]/30 bg-[#38C16C]/15 px-2.5 py-0.5 text-[11px] font-black text-green-300">
                  {userRoleLabel}
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-0.5 text-[11px] font-semibold text-slate-200 backdrop-blur-md">
                  {userDisplayName || "Osteps User"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
            {showSubjectSwitcher ? <SubjectSwitcher /> : null}
            {renderThemeSwitcher()}
            {renderNavigationButtons()}
            {renderAccountActions()}
          </div>
        </div>
      </div>
    );
  };

  const withSubjectContext = (content: React.ReactNode) => (
    <SubjectContextProvider>{content}</SubjectContextProvider>
  );

  if (isSubjectCardsEntryRoute) {
    return withSubjectContext(
      <>
        {/* Impersonation banner on subject-cards route */}
        {impersonating && (
          <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between bg-amber-500 px-4 py-2 text-white text-sm font-medium shadow-lg">
            <span>👁️ Viewing as <strong>{currentUser?.name || currentUser?.email}</strong> ({currentUser?.role})</span>
            <button
              onClick={handleStopImpersonation}
              className="ml-4 rounded bg-white px-3 py-1 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
            >
              ← Return to Admin
            </button>
          </div>
        )}
        <FavoriteSidebar />
        {showSubjectRightSidebar ? <SubjectRightSidebar /> : null}
        {showRightEdgeReveal ? <RightSidebarReveal /> : null}
        <PinnedPagesDock />
        <div
          className={`dashboard-theme-scope min-h-screen bg-[var(--theme-soft)] ${dashboardPaddingClass}`}
          style={impersonating ? { paddingTop: 136 } : undefined}
        >
          <div className="mx-auto max-w-7xl">
            {renderDashboardTopBar({})}
            {children}
          </div>
        </div>
      </>
    );
  }

  if (isStudentExamAssessmentRoute) {
    return withSubjectContext(
      <>
        {impersonating && (
          <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between bg-amber-500 px-4 py-2 text-white text-sm font-medium shadow-lg">
            <span>👁️ Viewing as <strong>{currentUser?.name || currentUser?.email}</strong> ({currentUser?.role})</span>
            <button
              onClick={handleStopImpersonation}
              className="ml-4 rounded bg-white px-3 py-1 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
            >
              ← Return to Admin
            </button>
          </div>
        )}
        <div className="dashboard-theme-scope min-h-screen bg-slate-100" style={impersonating ? { paddingTop: 40 } : undefined}>
          {children}
        </div>
      </>
    );
  }

  return withSubjectContext(
    <>
      {/* Impersonation banner */}
      {impersonating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between bg-amber-500 px-4 py-2 text-white text-sm font-medium shadow-lg">
          <span>👁️ Viewing as <strong>{currentUser?.name || currentUser?.email}</strong> ({currentUser?.role})</span>
          <button
            onClick={handleStopImpersonation}
            className="ml-4 rounded bg-white px-3 py-1 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
          >
            ← Return to Admin
          </button>
        </div>
      )}
      {!isImmersiveLessonGroupRoute ? <FavoriteSidebar /> : null}
      {showSubjectRightSidebar ? <SubjectRightSidebar /> : null}
      {showRightEdgeReveal ? <RightSidebarReveal /> : null}
      {!isImmersiveLessonGroupRoute ? <PinnedPagesDock /> : null}
      <div style={impersonating ? { paddingTop: 40 } : undefined}>
      {isStandaloneTeacherRoute ||
      isAllStudentsStandaloneRoute ||
      isGlobalStudentProfileRoute ||
      isStudentStandaloneUtilityRoute ||
      isLibraryRoute ||
      isLeaderboardRoute ||
      isTimeTableRoute ||
      isTimetableBuilderRoute ||
      isTimetableGeneratorRoute ||
      isToolsRoute ||
      isStudentsStaffRoute ||
      isCoursesRoute ||
      isLessonsRoute ||
      isMindUpgradeRoute ||
      isAnnouncementsRoute ||
      isReportsRoute ||
      isSettingsRoute ? (
        <div className={`dashboard-theme-scope min-h-screen bg-[var(--theme-soft)] ${dashboardPaddingClass}`}>
          <div className="mx-auto max-w-7xl">
            {renderDashboardTopBar({})}
            <div
              key={pathname}
              className={`dashboard-route-transition ${
                isRouteTransitioning ? "dashboard-route-transition-active" : ""
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
      <div
        className={
          "dashboard-theme-scope min-h-screen " +
          (isImmersiveLessonGroupRoute ? "bg-white" : "bg-[var(--theme-soft)] flex")
        }
      >
        <div className={(isImmersiveLessonGroupRoute ? "min-h-screen" : "flex-1 h-screen overflow-y-auto") + " relative"}>
          {!isImmersiveLessonGroupRoute ? (
            <div
              className={`dashboard-route-overlay ${
                isRouteTransitioning ? "dashboard-route-overlay-active" : ""
              }`}
            />
          ) : null}
          <div
            className={
              isImmersiveLessonGroupRoute
                ? "w-full"
                : `mx-auto ${shouldApplyMaxWidth ? mainContentPaddingClass : fullWidthContentPaddingClass}`
            }
          >
            {!isImmersiveLessonGroupRoute ? (
              renderDashboardTopBar({
                showSubjectSwitcher: !isLibraryRoute,
              })
            ) : null}

            <div
              key={pathname}
              className={
                isImmersiveLessonGroupRoute
                  ? ""
                  : `dashboard-route-transition ${
                      isRouteTransitioning ? "dashboard-route-transition-active" : ""
                    }`
              }
            >
              {children}
            </div>
          </div>
        </div>
      </div>
      )}
      <style jsx global>{`
        .dashboard-theme-scope [class*="text-green-"],
        .dashboard-theme-scope [class*="text-emerald-"],
        .dashboard-theme-scope [class*="text-sky-"],
        .dashboard-theme-scope [class*="text-blue-"],
        .dashboard-theme-scope [class*="text-violet-"],
        .dashboard-theme-scope [class*="text-fuchsia-"],
        .dashboard-theme-scope [class*="text-amber-"],
        .dashboard-theme-scope [class*="text-yellow-"],
        .dashboard-theme-scope [class*="text-orange-"],
        .dashboard-theme-scope [class*="text-rose-"],
        .dashboard-theme-scope [class*="text-red-"],
        .dashboard-theme-scope [class*="text-lime-"],
        .dashboard-theme-scope [class*="text-indigo-"] {
          color: var(--theme-dark) !important;
        }
        .dashboard-theme-scope [class*="bg-green-50"],
        .dashboard-theme-scope [class*="bg-emerald-50"],
        .dashboard-theme-scope [class*="bg-sky-50"],
        .dashboard-theme-scope [class*="bg-blue-50"],
        .dashboard-theme-scope [class*="bg-violet-50"],
        .dashboard-theme-scope [class*="bg-fuchsia-50"],
        .dashboard-theme-scope [class*="bg-amber-50"],
        .dashboard-theme-scope [class*="bg-yellow-50"],
        .dashboard-theme-scope [class*="bg-orange-50"],
        .dashboard-theme-scope [class*="bg-rose-50"],
        .dashboard-theme-scope [class*="bg-red-50"],
        .dashboard-theme-scope [class*="bg-lime-50"],
        .dashboard-theme-scope [class*="bg-indigo-50"] {
          background-color: color-mix(in srgb, var(--primary) 12%, white) !important;
        }
        .dashboard-theme-scope [class*="bg-green-100"],
        .dashboard-theme-scope [class*="bg-emerald-100"],
        .dashboard-theme-scope [class*="bg-sky-100"],
        .dashboard-theme-scope [class*="bg-blue-100"],
        .dashboard-theme-scope [class*="bg-violet-100"],
        .dashboard-theme-scope [class*="bg-fuchsia-100"],
        .dashboard-theme-scope [class*="bg-amber-100"],
        .dashboard-theme-scope [class*="bg-yellow-100"],
        .dashboard-theme-scope [class*="bg-orange-100"],
        .dashboard-theme-scope [class*="bg-rose-100"],
        .dashboard-theme-scope [class*="bg-red-100"],
        .dashboard-theme-scope [class*="bg-lime-100"],
        .dashboard-theme-scope [class*="bg-indigo-100"] {
          background-color: color-mix(in srgb, var(--primary) 20%, white) !important;
        }
        .dashboard-theme-scope [class*="border-green-"],
        .dashboard-theme-scope [class*="border-emerald-"],
        .dashboard-theme-scope [class*="border-sky-"],
        .dashboard-theme-scope [class*="border-blue-"],
        .dashboard-theme-scope [class*="border-violet-"],
        .dashboard-theme-scope [class*="border-fuchsia-"],
        .dashboard-theme-scope [class*="border-amber-"],
        .dashboard-theme-scope [class*="border-yellow-"],
        .dashboard-theme-scope [class*="border-orange-"],
        .dashboard-theme-scope [class*="border-rose-"],
        .dashboard-theme-scope [class*="border-red-"],
        .dashboard-theme-scope [class*="border-lime-"],
        .dashboard-theme-scope [class*="border-indigo-"] {
          border-color: color-mix(in srgb, var(--primary) 45%, white) !important;
        }
        .dashboard-theme-scope [class*="hover:text-green-"]:hover,
        .dashboard-theme-scope [class*="hover:text-emerald-"]:hover,
        .dashboard-theme-scope [class*="hover:text-sky-"]:hover,
        .dashboard-theme-scope [class*="hover:text-blue-"]:hover,
        .dashboard-theme-scope [class*="hover:text-violet-"]:hover,
        .dashboard-theme-scope [class*="hover:text-fuchsia-"]:hover,
        .dashboard-theme-scope [class*="hover:text-amber-"]:hover,
        .dashboard-theme-scope [class*="hover:text-yellow-"]:hover,
        .dashboard-theme-scope [class*="hover:text-orange-"]:hover,
        .dashboard-theme-scope [class*="hover:text-rose-"]:hover,
        .dashboard-theme-scope [class*="hover:text-red-"]:hover,
        .dashboard-theme-scope [class*="hover:text-lime-"]:hover,
        .dashboard-theme-scope [class*="hover:text-indigo-"]:hover {
          color: var(--theme-dark) !important;
        }
        .dashboard-theme-scope [class*="hover:bg-green-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-emerald-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-sky-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-blue-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-violet-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-fuchsia-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-amber-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-yellow-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-orange-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-rose-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-red-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-lime-"]:hover,
        .dashboard-theme-scope [class*="hover:bg-indigo-"]:hover {
          background-color: color-mix(in srgb, var(--primary) 20%, white) !important;
        }
        .dashboard-theme-scope span.status-pending-pill {
          background-color: #ffedd5 !important;
          color: #c2410c !important;
        }
        .dashboard-theme-scope span.status-pending-text {
          color: #f97316 !important;
        }
        .dashboard-route-transition {
          animation: dashboardRouteSwap 420ms cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: top center;
          will-change: transform, opacity, filter;
        }
        .dashboard-route-transition-active {
          animation: dashboardRouteSwap 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dashboard-route-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          z-index: 10;
          background: linear-gradient(
            110deg,
            color-mix(in srgb, var(--primary) 20%, transparent) 0%,
            color-mix(in srgb, var(--primary) 12%, transparent) 45%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-12%);
        }
        .dashboard-route-overlay-active {
          animation: dashboardRouteOverlay 420ms ease;
        }
        @keyframes dashboardRouteSwap {
          0% {
            opacity: 0;
            transform: translateX(28px) translateY(6px) scale(0.992);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes dashboardRouteOverlay {
          0% {
            opacity: 0;
            transform: translateX(-12%);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(10%);
          }
        }
      `}</style>
      </div>
    </>
  );
}
