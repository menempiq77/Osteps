"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import { Checkbox, Modal, Select } from "antd";

type DestinationClass = {
  id: string | number;
  class_name?: string | null;
};

type CopyClassWeekModalProps = {
  open: boolean;
  onClose: () => void;
  sourceWeek: Dayjs;
  sourceClassName?: string | null;
  sourceSlotCount: number;
  destinationClasses: DestinationClass[];
  onConfirm: (payload: {
    targetClassIds: string[];
    clearExisting: boolean;
    copyTeachers: boolean;
  }) => Promise<void>;
  loading?: boolean;
};

function weekLabel(sun: Dayjs) {
  return `${sun.format("D MMM")} – ${sun.add(6, "day").format("D MMM YYYY")}`;
}

export default function CopyClassWeekModal({
  open,
  onClose,
  sourceWeek,
  sourceClassName,
  sourceSlotCount,
  destinationClasses,
  onConfirm,
  loading = false,
}: CopyClassWeekModalProps) {
  const [targetClassIds, setTargetClassIds] = useState<string[]>([]);
  const [clearExisting, setClearExisting] = useState(true);
  const [copyTeachers, setCopyTeachers] = useState(false);

  useEffect(() => {
    if (!open) {
      setTargetClassIds([]);
      setClearExisting(true);
      setCopyTeachers(false);
    }
  }, [open]);

  const options = useMemo(
    () => destinationClasses.map((klass) => ({
      value: String(klass.id),
      label: klass.class_name || `Class ${klass.id}`,
    })),
    [destinationClasses]
  );

  const handleOk = async () => {
    if (targetClassIds.length === 0) return;
    await onConfirm({ targetClassIds, clearExisting, copyTeachers });
  };

  return (
    <Modal
      title="Copy This Class Week"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Copy"
      confirmLoading={loading}
      okButtonProps={{ disabled: targetClassIds.length === 0 }}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Copy <strong>{sourceSlotCount} slot{sourceSlotCount !== 1 ? "s" : ""}</strong> from{" "}
          <strong>{sourceClassName ?? "this class"}</strong> in <strong>{weekLabel(sourceWeek)}</strong>
          {" "}to other classes in the same year group.
        </p>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Destination classes</label>
          <Select
            mode="multiple"
            allowClear
            placeholder="Select one or more classes"
            style={{ width: "100%" }}
            value={targetClassIds}
            onChange={(value) => setTargetClassIds(value)}
            options={options}
          />
          {options.length === 0 && (
            <p className="mt-1 text-xs text-slate-500">No other classes are available in this year group.</p>
          )}
        </div>

        <Checkbox checked={clearExisting} onChange={(event) => setClearExisting(event.target.checked)}>
          Replace lessons already saved for those classes in this week
        </Checkbox>

        <Checkbox checked={copyTeachers} onChange={(event) => setCopyTeachers(event.target.checked)}>
          Also copy teacher assignments
        </Checkbox>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Leave teacher assignments off if the target classes will be taught by different teachers.
        </div>
      </div>
    </Modal>
  );
}
