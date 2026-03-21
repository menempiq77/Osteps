"use client";

import { useSubjectContext } from "@/contexts/SubjectContext";

export default function SubjectSwitcher() {
  const { subjects, activeSubject, canUseSubjectContext } = useSubjectContext();

  const displaySubjectName = (value: unknown) =>
    String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

  if (!canUseSubjectContext || subjects.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subject</span>
      <div className="min-w-[180px] rounded-full border border-[var(--theme-border)] bg-white px-4 py-1.5 text-base font-medium text-gray-900 shadow-sm">
        {displaySubjectName(activeSubject?.name || "Subject")}
      </div>
    </div>
  );
}
