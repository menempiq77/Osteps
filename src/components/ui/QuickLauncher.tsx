"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  Search,
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

    return items.map((item) => ({
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
    return subjects.map((subject) => {
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

  const resultCount = filteredSections.reduce((total, group) => total + group.items.length, 0);
  const triggerSquares = Array.from({ length: 9 });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--theme-soft)] hover:text-[var(--theme-dark)] hover:shadow-md"
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
            className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-1/2 top-20 w-[min(1180px,calc(100vw-1rem))] -translate-x-1/2 overflow-hidden rounded-[28px] border border-[var(--theme-border)] bg-white shadow-[0_40px_90px_rgba(15,23,42,0.2)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--theme-soft)_82%,white),white)] px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--theme-dark)]">
                  Quick Launcher
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>{roleLabel(currentUser?.role)} shortcuts</span>
                  {activeSubject ? (
                    <>
                      <span className="text-slate-300">/</span>
                      <span className="font-medium text-slate-700">
                        {formatDashboardSubjectName(activeSubject.name)}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)] hover:text-[var(--theme-dark)]"
                aria-label="Close quick launcher"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid max-h-[calc(100vh-7rem)] min-h-[420px] overflow-hidden lg:grid-cols-[270px_minmax(0,1fr)]">
              <aside className="border-b border-slate-200 bg-slate-50/80 p-5 lg:border-b-0 lg:border-r">
                <div className="rounded-2xl border border-[var(--theme-border)] bg-white p-3 shadow-sm">
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-[var(--primary)] focus-within:bg-white">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search pages, tools, or modules"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Filters
                    </div>
                    <div className="mt-3 space-y-2">
                      {availableFilters.map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                              isActive
                                ? "border-[var(--primary)] bg-[var(--theme-soft)] text-[var(--theme-dark)] shadow-sm"
                                : "border-transparent bg-white text-slate-600 hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)]"
                            }`}
                          >
                            <span className="font-medium">{filter === "All" ? "Everything" : filter}</span>
                            {filter !== "All" ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                                {allEntries.filter((entry) => entry.section === filter).length}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-soft)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    At a glance
                  </div>
                  <div className="mt-3 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Total shortcuts</span>
                      <span className="font-semibold text-slate-800">{allEntries.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shown now</span>
                      <span className="font-semibold text-slate-800">{resultCount}</span>
                    </div>
                    {subjects.length > 0 ? (
                      <div className="flex items-center justify-between">
                        <span>Assigned subjects</span>
                        <span className="font-semibold text-slate-800">{subjects.length}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </aside>

              <div className="overflow-y-auto bg-white p-5">
                {filteredSections.length === 0 ? (
                  <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--theme-border)] bg-[var(--theme-soft)] px-6 text-center">
                    <div className="rounded-2xl border border-[var(--theme-border)] bg-white p-4 text-[var(--theme-dark)] shadow-sm">
                      <Search className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">No matches yet</h3>
                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      Try a different search term or switch the filter on the left to reveal more pages.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredSections.map(({ section, items }) => {
                      const sectionMeta = SECTION_LABELS[section] || {
                        title: section,
                        note: "Important pages and shortcuts for this workspace.",
                      };

                      return (
                        <section key={section}>
                          <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">
                                {sectionMeta.title}
                              </h3>
                              <p className="text-sm text-slate-500">{sectionMeta.note}</p>
                            </div>
                            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                              {items.length} item{items.length === 1 ? "" : "s"}
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {items.map((entry) => {
                              const Icon = entry.icon;
                              return (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => handleEntryClick(entry)}
                                  className={`group rounded-[24px] border p-4 text-left transition ${
                                    entry.active
                                      ? "border-[var(--primary)] bg-[var(--theme-soft)] shadow-[0_18px_38px_rgba(22,101,52,0.12)]"
                                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)] hover:shadow-[0_16px_34px_rgba(15,23,42,0.1)]"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-white text-[var(--theme-dark)] shadow-sm">
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-base font-semibold text-slate-800">
                                          {entry.name}
                                        </span>
                                        {entry.badge ? (
                                          <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[11px] font-semibold text-white">
                                            {entry.badge}
                                          </span>
                                        ) : null}
                                        {entry.active ? (
                                          <span className="rounded-full border border-[var(--theme-border)] bg-white px-2 py-0.5 text-[11px] font-semibold text-[var(--theme-dark)]">
                                            Active
                                          </span>
                                        ) : null}
                                      </div>
                                      <p className="mt-1 text-sm leading-5 text-slate-500">
                                        {entry.description}
                                      </p>
                                      {entry.meta ? (
                                        <div className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
                                          {entry.meta}
                                        </div>
                                      ) : null}
                                    </div>
                                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[var(--theme-dark)]" />
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
