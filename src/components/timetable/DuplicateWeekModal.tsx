"use client";

import { useState } from "react";
import type { Dayjs } from "dayjs";
import { DatePicker, Modal } from "antd";

type TimetableSlot = {
  date?: string;
};

interface DuplicateWeekModalProps {
  open: boolean;
  onClose: () => void;
  sourceWeek: Dayjs;
  allSlots: TimetableSlot[];
  onConfirm: (targetWeekSun: Dayjs) => Promise<void>;
}

function weekStart(anchor: Dayjs) {
  return anchor.subtract(anchor.day(), "day");
}

function weekLabel(sun: Dayjs) {
  return `${sun.format("D MMM")} – ${sun.add(6, "day").format("D MMM YYYY")}`;
}

function slotsForWeek(slots: TimetableSlot[], weekSun: Dayjs) {
  const sunStr = weekSun.format("YYYY-MM-DD");
  const satStr = weekSun.add(6, "day").format("YYYY-MM-DD");
  return slots.filter((slot) => {
    const date = slot.date;
    return !!date && date >= sunStr && date <= satStr;
  });
}

export default function DuplicateWeekModal({
  open,
  onClose,
  sourceWeek,
  allSlots,
  onConfirm,
}: DuplicateWeekModalProps) {
  const [target, setTarget] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const slotCount = slotsForWeek(allSlots, sourceWeek).length;

  const handleOk = async () => {
    if (!target) return;
    setLoading(true);
    try {
      await onConfirm(target);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Copy Week"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Copy"
      confirmLoading={loading}
      okButtonProps={{ disabled: !target }}
    >
      <p className="mb-3 text-sm text-slate-600">
        Copy <strong>{slotCount} slot{slotCount !== 1 ? "s" : ""}</strong> from{" "}
        <strong>{weekLabel(sourceWeek)}</strong> to a new week.
      </p>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Target week (pick any day in that week)</label>
        <DatePicker
          onChange={(value) => {
            if (!value) {
              setTarget(null);
              return;
            }
            setTarget(weekStart(value));
          }}
          format="DD MMM YYYY"
          style={{ width: "100%" }}
        />
        {target && (
          <p className="text-xs text-slate-500 mt-1">→ {weekLabel(target)}</p>
        )}
      </div>
    </Modal>
  );
}