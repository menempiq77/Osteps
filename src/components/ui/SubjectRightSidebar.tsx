"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  FileText,
  MoreVertical,
  PanelRightOpen,
  X,
} from "lucide-react";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  buildDashboardNavigation,
  formatDashboardSubjectName,
  normalizeDashboardRole,
  type DashboardNavItem,
} from "@/lib/dashboardNavigation";
import { isSharedPath, stripSubjectScope } from "@/lib/subjectRouting";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { useReadOnlyWorkspace } from "@/lib/readOnlyWorkspace";

// Inside the archived read-only workspace only these view-only sections are
// reachable. Everything that can change data (Manager, Content Approvals, etc.)
// is removed from the side bar. Matched against the unscoped href.
const READ_ONLY_ALLOWED_UNSCOPED_HREFS = new Set([
  "/dashboard",
  "/dashboard/view",
]);
const READ_ONLY_EXTRA_ITEMS: DashboardNavItem[] = [
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    description: "View students' read-only reports.",
    section: "Teaching",
  },
  {
    name: "Markbook",
    href: "/dashboard/students/markbook",
    icon: BookMarked,
    description: "View the subject markbook (read-only).",
    section: "Teaching",
  },
];

const sectionAccent: Record<DashboardNavItem["section"], string> = {
  Subjects: "#60a5fa",
  Workspace: "#93c5fd",
  Teaching: "#a78bfa",
  Communication: "#f9a8d4",
  Resources: "#86efac",
  Account: "#fbbf24",
};

const normalizePath = (value?: string) =>
  value ? value.split("?")[0].replace(/\/+$/, "") || "/" : "/";

const compactLabel = (value: string) =>
  value
    .replace(/ Dashboard$/i, "")
    .replace(/Content Approvals/i, "Approvals")
    .replace(/Manage Quiz/i, "Quiz")
    .replace(/Mind-upgrade/i, "Mind Upgrade");

const subjectInitials = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "S";
};

type SubjectRightSidebarProps = {
  overlayState?: "pinned" | "hidden" | "revealed";
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export default function SubjectRightSidebar({
  overlayState = "pinned",
  onPointerEnter,
  onPointerLeave,
}: SubjectRightSidebarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    activeSubjectId,
    activeSubject,
    canUseSubjectContext,
    subjects,
    setActiveSubjectId,
    toSubjectHref,
    loading: subjectContextLoading,
  } = useSubjectContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSubjectPickerOpen, setIsSubjectPickerOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const subjectButtonRef = useRef<HTMLButtonElement | null>(null);
  const subjectPickerRef = useRef<HTMLDivElement | null>(null);
  const shouldSuppressUnscopedSubjectNav = canUseSubjectContext && !activeSubjectId;
  const isResolvingSubjectContext = shouldSuppressUnscopedSubjectNav && subjectContextLoading;

  const isReadOnly = useReadOnlyWorkspace();
  const roleKey = normalizeDashboardRole(currentUser?.role);
  const isStudent = roleKey === "STUDENT";
  const isIslamicContext =
    !canUseSubjectContext ||
    !activeSubject ||
    /islam|islamiat|islamic/i.test(activeSubject.name);

  const { data: studentSubjectClasses = [] } = useQuery({
    queryKey: ["subject-right-sidebar-student-subject-classes", activeSubjectId],
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

  // In the archived read-only workspace the "Choose subject" switcher must list
  // only archived subjects (every class inactive) — never active ones. Work out
  // which of the school's subjects are archived so we can filter the picker.
  const subjectIdsKey = subjects.map((subject) => subject.id).join(",");
  const { data: archivedSubjectIds } = useQuery({
    queryKey: ["subject-right-sidebar-archived-subject-ids", subjectIdsKey],
    queryFn: async () => {
      const isActive = (row: any) =>
        row?.is_active === undefined ? true : Number(row?.is_active) === 1;
      const ids = new Set<number>();
      await Promise.all(
        subjects.map(async (subject) => {
          try {
            const classes = await fetchSubjectClasses({
              subject_id: Number(subject.id),
              include_inactive: true,
            });
            const hasActiveClass =
              Array.isArray(classes) && classes.some((row) => isActive(row));
            if (!hasActiveClass) ids.add(Number(subject.id));
          } catch {
            // On a transient error, don't mark it archived (avoid hiding wrongly).
          }
        })
      );
      return ids;
    },
    enabled: isReadOnly && subjects.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isSubjectPickerOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (subjectPickerRef.current?.contains(target)) return;
      if (subjectButtonRef.current?.contains(target)) return;
      setIsSubjectPickerOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSubjectPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubjectPickerOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setIsSubjectPickerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const sortedSubjects = useMemo(
    () => [...subjects].sort((a, b) => formatDashboardSubjectName(a.name).localeCompare(formatDashboardSubjectName(b.name))),
    [subjects]
  );

  // In read-only (archived) mode, restrict the switcher to archived subjects.
  // Until the archived lookup resolves, show only the currently open subject so
  // active subjects never flash in the list.
  const switchableSubjects = useMemo(() => {
    if (!isReadOnly) return sortedSubjects;
    if (!archivedSubjectIds) {
      return sortedSubjects.filter(
        (subject) => Number(subject.id) === Number(activeSubjectId)
      );
    }
    return sortedSubjects.filter((subject) =>
      archivedSubjectIds.has(Number(subject.id))
    );
  }, [isReadOnly, sortedSubjects, archivedSubjectIds, activeSubjectId]);

  const visibleSubjects = useMemo(() => {
    const query = subjectSearch.trim().toLowerCase();
    if (!query) return switchableSubjects;
    return switchableSubjects.filter((subject) =>
      [subject.name, formatDashboardSubjectName(subject.name), subject.code, subject.class_label]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [sortedSubjects, subjectSearch]);

  const handleSubjectPick = (subjectId: number) => {
    setActiveSubjectId(subjectId, { navigate: true });
    setIsSubjectPickerOpen(false);
    setSubjectSearch("");
  };

  const entries = useMemo(() => {
    if (shouldSuppressUnscopedSubjectNav) return [];

    const items = buildDashboardNavigation({
      roleKey,
      canUseSubjectContext,
      activeSubjectId,
      formattedActiveSubjectName: activeSubject?.name,
      isIslamicContext,
      studentTrackerHref,
    });

    // Archived read-only workspace: keep only the view-only sections and add
    // direct Reports + Markbook shortcuts. No Manager, no Approvals, no editing.
    const scopedItems =
      isReadOnly && !isStudent
        ? [
            ...items.filter((item) =>
              READ_ONLY_ALLOWED_UNSCOPED_HREFS.has(
                normalizePath(stripSubjectScope(item.href))
              )
            ),
            ...READ_ONLY_EXTRA_ITEMS,
          ]
        : items;

    return scopedItems.map((item) => {
      const href =
        canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
          ? toSubjectHref(item.href)
          : item.href;
      return {
        ...item,
        href,
      };
    });
  }, [activeSubject?.name, activeSubjectId, canUseSubjectContext, isIslamicContext, isReadOnly, isStudent, roleKey, shouldSuppressUnscopedSubjectNav, studentTrackerHref, toSubjectHref]);

  const currentPath = normalizePath(pathname);
  const currentUnscoped = normalizePath(stripSubjectScope(pathname));

  const isActive = (href: string) => {
    const target = normalizePath(href);
    const targetUnscoped = normalizePath(stripSubjectScope(href));
    if (currentPath === target || currentUnscoped === targetUnscoped) return true;
    if (targetUnscoped === "/dashboard") return currentUnscoped === "/dashboard";
    return currentUnscoped.startsWith(`${targetUnscoped}/`);
  };

  const isOverlay = overlayState !== "pinned";
  const desktopAsideClassName = isOverlay
    ? `fixed bottom-0 right-0 top-[56px] z-[710] hidden w-[64px] flex-col overflow-hidden border-l border-white/10 bg-[#424253] text-white shadow-[-12px_0_28px_rgba(15,23,42,0.28)] transition-transform duration-300 ease-out md:flex ${
        overlayState === "revealed" ? "translate-x-0" : "translate-x-full"
      }`
    : "fixed bottom-0 right-0 top-[56px] z-[640] hidden w-[64px] flex-col overflow-hidden border-l border-white/10 bg-[#424253] text-white shadow-[-12px_0_28px_rgba(15,23,42,0.18)] md:flex";

  const renderSidebarContent = (mobile = false) => (
    <>
        <div className="border-b border-white/10 px-1.5 py-2 text-center">
          <button
            ref={subjectButtonRef}
            type="button"
            onClick={() => setIsSubjectPickerOpen((open) => !open)}
            disabled={!canUseSubjectContext || (isResolvingSubjectContext && subjects.length === 0)}
            className={`group w-full rounded-xl px-1.5 py-1.5 text-center transition ${
              canUseSubjectContext && !(isResolvingSubjectContext && subjects.length === 0) ? "hover:bg-white/10" : "cursor-not-allowed opacity-60"
            }`}
            aria-haspopup="dialog"
            aria-expanded={isSubjectPickerOpen}
            title={
              isResolvingSubjectContext
                ? "Loading subject"
                : canUseSubjectContext
                ? "Choose subject"
                : "Subject switching unavailable"
            }
          >
            <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-[#38C16C] transition group-hover:w-10" />
            <div className="text-[10px] font-black uppercase tracking-wide text-white/70">
              Subject
            </div>
            {activeSubject ? (
              <div className="mt-1 line-clamp-2 text-[10px] font-semibold leading-tight text-white">
                {formatDashboardSubjectName(activeSubject.name)}
              </div>
            ) : isResolvingSubjectContext ? (
              <div className="mt-1 text-[10px] font-semibold leading-tight text-white/55">
                Loading...
              </div>
            ) : shouldSuppressUnscopedSubjectNav ? (
              <div className="mt-1 text-[10px] font-semibold leading-tight text-white/55">
                Choose
              </div>
            ) : null}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-1.5">
          <div className="space-y-0.5">
            {isResolvingSubjectContext ? (
              <div className="space-y-4 px-3 py-3" aria-label="Loading subject sidebar">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex animate-pulse flex-col items-center gap-2">
                    <div className="h-5 w-5 rounded-lg bg-white/10" />
                    <div className="h-2.5 w-10 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            ) : shouldSuppressUnscopedSubjectNav ? (
              <div className="px-3 py-6 text-center text-[11px] font-semibold leading-tight text-white/50">
                Choose a subject to show shortcuts.
              </div>
            ) : entries.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const accent = sectionAccent[item.section] || "#93c5fd";
              return (
                <button
                  key={`${item.name}-${item.href}`}
                  type="button"
                  onClick={() => {
                    router.push(item.href);
                    setMobileOpen(false);
                  }}
                  className={`group relative flex w-full items-center transition ${
                    mobile
                      ? "gap-3 px-4 py-3 text-left"
                      : "flex-col gap-1 px-1 py-2 text-center"
                  } ${
                    active ? "bg-[#525264] text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                  title={item.name}
                >
                  <span
                    className={`absolute right-0 top-1/2 h-9 w-0.5 -translate-y-1/2 rounded-l-full transition ${
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                    }`}
                    style={{ backgroundColor: accent }}
                  />
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                  <span
                    className={`font-semibold leading-tight drop-shadow ${
                      mobile ? "text-sm" : "line-clamp-2 max-w-[56px] text-[9px]"
                    }`}
                  >
                    {compactLabel(item.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-white/10 p-2">
          <div className="flex h-8 items-center justify-center rounded bg-white/10 text-white/75">
            <MoreVertical className="h-4 w-4" />
          </div>
        </div>
    </>
  );

  return (
    <>
      <aside
        className={desktopAsideClassName}
        onMouseEnter={onPointerEnter}
        onMouseLeave={onPointerLeave}
      >
        {renderSidebarContent()}
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed right-0 top-[58%] z-[680] flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-2xl border border-r-0 border-white/15 bg-[#424253] px-2 py-3 text-white shadow-[-8px_0_22px_rgba(15,23,42,0.28)] md:hidden"
        aria-label="Open subject shortcuts"
        aria-expanded={mobileOpen}
        aria-controls="mobile-subject-sidebar"
      >
        <PanelRightOpen className="h-5 w-5 text-[#93c5fd]" />
        <span className="text-[9px] font-black uppercase tracking-wide">Subject</span>
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[800] md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close subject shortcuts"
          />
          <aside
            id="mobile-subject-sidebar"
            className="absolute bottom-0 right-0 top-0 flex w-[min(78vw,280px)] flex-col overflow-hidden border-l border-white/10 bg-[#424253] text-white shadow-[-18px_0_40px_rgba(15,23,42,0.36)]"
            role="dialog"
            aria-modal="true"
            aria-label="Subject shortcuts"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <span className="text-sm font-black">Subject shortcuts</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Close subject shortcuts"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderSidebarContent(true)}
          </aside>
        </div>
      ) : null}

      {isSubjectPickerOpen ? (
        <div
          ref={subjectPickerRef}
          className="fixed right-3 top-[68px] z-[820] w-[calc(100vw-24px)] max-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#353545] text-white shadow-[0_24px_60px_rgba(15,23,42,0.35)] md:right-[76px] md:z-[720] md:w-[300px]"
          role="dialog"
          aria-label="Choose subject"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black">Choose subject</div>
                <div className="text-xs text-white/55">
                  {isReadOnly
                    ? `${switchableSubjects.length} archived ${
                        switchableSubjects.length === 1 ? "subject" : "subjects"
                      }`
                    : `${switchableSubjects.length} ${
                        switchableSubjects.length === 1 ? "subject" : "subjects"
                      } available`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubjectPickerOpen(false)}
                className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="Close subject chooser"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-3">
            <input
              value={subjectSearch}
              onChange={(event) => setSubjectSearch(event.target.value)}
              placeholder="Search subjects..."
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#38C16C] focus:ring-2 focus:ring-[#38C16C]/25"
            />
          </div>

          <div className="max-h-[360px] overflow-y-auto px-2 pb-2">
            {subjectContextLoading ? (
              <div className="rounded-xl px-3 py-6 text-center text-sm text-white/60">
                Loading subjects...
              </div>
            ) : visibleSubjects.length === 0 ? (
              <div className="rounded-xl px-3 py-6 text-center text-sm text-white/60">
                No subjects found.
              </div>
            ) : (
              <div className="space-y-1.5">
                {visibleSubjects.map((subject) => {
                  const label = formatDashboardSubjectName(subject.name);
                  const active = Number(activeSubjectId) === Number(subject.id);
                  return (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => handleSubjectPick(subject.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        active ? "bg-[#38C16C] text-white shadow-lg shadow-[#38C16C]/20" : "text-white/88 hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          active ? "bg-white/20 text-white" : "bg-white/10 text-[#86efac]"
                        }`}
                      >
                        {subjectInitials(label)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{label}</span>
                        <span className={`block text-[11px] ${active ? "text-white/85" : "text-white/45"}`}>
                          {subject.class_label ? subject.class_label : "Open this subject"}
                        </span>
                      </span>
                      {active ? (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                          {isReadOnly ? "Viewing" : "Active"}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}