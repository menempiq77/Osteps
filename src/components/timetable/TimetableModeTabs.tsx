"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { stripSubjectScope } from "@/lib/subjectRouting";

type TimetableModeTabKey = "timetable" | "calendar";

type TimetableModeTabsProps = {
  className?: string;
  activeTab?: TimetableModeTabKey;
};

const TABS = [
  { key: "timetable", label: "Timetable", href: "/dashboard/timetable-builder" },
  { key: "calendar", label: "Calendar", href: "/dashboard/time_table", view: "calendar" },
] as const;

export default function TimetableModeTabs({ className = "", activeTab }: TimetableModeTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject_id");
  const currentPath = stripSubjectScope(pathname || "");

  const buildHref = (href: string, view?: string) => {
    const params = new URLSearchParams();
    if (view) params.set("view", view);
    if (subjectId) params.set("subject_id", subjectId);
    const query = params.toString();
    return query ? `${href}?${query}` : href;
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm ${className}`.trim()}
    >
      {TABS.map((tab) => {
        const active = activeTab ? activeTab === tab.key : currentPath === tab.href;

        return (
          <Link
            key={tab.href}
            href={buildHref(tab.href, tab.view)}
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}