"use client";

import { Select } from "antd";
import { useMemo } from "react";
import { useSubjectContext } from "@/contexts/SubjectContext";

export default function SubjectSwitcher() {
  const { subjects, activeSubjectId, loading, canUseSubjectContext, setActiveSubjectId } = useSubjectContext();

  const options = useMemo(
    () =>
      subjects.map((subject) => ({
        value: subject.id,
        label: subject.name,
      })),
    [subjects]
  );

  if (!canUseSubjectContext || subjects.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subject</span>
      <Select
        size="small"
        loading={loading}
        value={activeSubjectId ?? undefined}
        options={options}
        style={{ minWidth: 180 }}
        onChange={(value) => setActiveSubjectId(Number(value))}
        placeholder="Select subject"
      />
    </div>
  );
}
