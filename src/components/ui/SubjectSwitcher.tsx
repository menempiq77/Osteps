"use client";

import { useSubjectContext } from "@/contexts/SubjectContext";

type SubjectSwitcherProps = {
  showLabel?: boolean;
};

export default function SubjectSwitcher({ showLabel = true }: SubjectSwitcherProps) {
  const { subjects, activeSubject, canUseSubjectContext } = useSubjectContext();

  const displaySubjectName = (value: unknown) =>
    String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

  if (!canUseSubjectContext || subjects.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {showLabel ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subject</span>
      ) : null}
      <div className="min-w-[180px] rounded-full border border-[var(--theme-border)] bg-white px-4 py-1.5 text-base font-medium text-gray-900 shadow-sm">
        {displaySubjectName(activeSubject?.name || "Subject")}
      </div>
    </div>
  );
}
