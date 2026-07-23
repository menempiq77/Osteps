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
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      {showLabel ? (
        <span className="hidden text-xs font-semibold uppercase tracking-wide text-gray-500 sm:inline">Subject</span>
      ) : null}
      <div className="max-w-[42vw] min-w-[128px] truncate rounded-full border border-[var(--theme-border)] bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm sm:max-w-none sm:min-w-[180px] sm:px-4 sm:py-1.5 sm:text-base">
        {displaySubjectName(activeSubject?.name || "Subject")}
      </div>
    </div>
  );
}
