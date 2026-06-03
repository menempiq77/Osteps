"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
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

export default function SubjectRightSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    activeSubjectId,
    activeSubject,
    canUseSubjectContext,
    toSubjectHref,
  } = useSubjectContext();

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

  const entries = useMemo(() => {
    const items = buildDashboardNavigation({
      roleKey,
      canUseSubjectContext,
      activeSubjectId,
      formattedActiveSubjectName: activeSubject?.name,
      isIslamicContext,
      studentTrackerHref,
    });

    return items.map((item) => {
      const href =
        canUseSubjectContext && activeSubjectId && !isSharedPath(item.href)
          ? toSubjectHref(item.href)
          : item.href;
      return {
        ...item,
        href,
      };
    });
  }, [activeSubject?.name, activeSubjectId, canUseSubjectContext, isIslamicContext, roleKey, studentTrackerHref, toSubjectHref]);

  const currentPath = normalizePath(pathname);
  const currentUnscoped = normalizePath(stripSubjectScope(pathname));

  const isActive = (href: string) => {
    const target = normalizePath(href);
    const targetUnscoped = normalizePath(stripSubjectScope(href));
    if (currentPath === target || currentUnscoped === targetUnscoped) return true;
    if (targetUnscoped === "/dashboard") return currentUnscoped === "/dashboard";
    return currentUnscoped.startsWith(`${targetUnscoped}/`);
  };

  return (
    <aside className="fixed bottom-0 right-0 top-[78px] z-[640] hidden w-[92px] flex-col overflow-hidden rounded-tl-2xl border-l border-white/10 bg-[#424253] text-white shadow-[-12px_0_28px_rgba(15,23,42,0.18)] md:flex">
      <div className="border-b border-white/10 px-2 py-3 text-center">
        <div className="mx-auto mb-1 h-1 w-8 rounded-full bg-[#38C16C]" />
        <div className="text-[10px] font-black uppercase tracking-wide text-white/70">
          Subject
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1.5">
          {entries.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const accent = sectionAccent[item.section] || "#93c5fd";
            return (
              <button
                key={`${item.name}-${item.href}`}
                type="button"
                onClick={() => router.push(item.href)}
                className={`group relative flex w-full flex-col items-center gap-1.5 px-2 py-3 text-center transition ${
                  active ? "bg-[#525264] text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                title={item.name}
              >
                <span
                  className={`absolute right-0 top-1/2 h-12 w-1 -translate-y-1/2 rounded-l-full transition ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                  style={{ backgroundColor: accent }}
                />
                <Icon className="h-8 w-8" style={{ color: accent }} />
                <span className="line-clamp-2 max-w-[74px] text-[11px] font-semibold leading-tight drop-shadow">
                  {compactLabel(item.name)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex h-10 items-center justify-center rounded bg-white/10 text-white/75">
          <MoreVertical className="h-5 w-5" />
        </div>
      </div>
    </aside>
  );
}