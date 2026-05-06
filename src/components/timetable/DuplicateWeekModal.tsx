"use client";

import { useState } from "react";
import type { Dayjs } from "dayjs";
import { DatePicker, Modal, Radio, Select } from "antd";

type TimetableSlot = {
  date?: string;
};

interface DuplicateWeekModalProps {
  open: boolean;
  onClose: () => void;
  sourceWeek: Dayjs;
  allSlots: TimetableSlot[];
  onConfirm: (payload: { targetWeekSuns: Dayjs[]; clearExisting: boolean }) => Promise<void>;
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
  const [mode, setMode] = useState<"single" | "repeat">("single");
  const [target, setTarget] = useState<Dayjs | null>(null);
  const [repeatCount, setRepeatCount] = useState<number>(4);
  const [clearExisting, setClearExisting] = useState(true);
  const [loading, setLoading] = useState(false);
  const slotCount = slotsForWeek(allSlots, sourceWeek).length;

  const handleOk = async () => {
    if (mode === "single" && !target) return;

    const targetWeekSuns = mode === "single"
      ? [target as Dayjs]
      : Array.from({ length: repeatCount }, (_, index) => sourceWeek.add(index + 1, "week"));

    setLoading(true);
    try {
      await onConfirm({ targetWeekSuns, clearExisting });
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
      okButtonProps={{ disabled: mode === "single" ? !target : repeatCount < 1 }}
    >
      <p className="mb-3 text-sm text-slate-600">
        Copy <strong>{slotCount} slot{slotCount !== 1 ? "s" : ""}</strong> from{" "}
        <strong>{weekLabel(sourceWeek)}</strong> to a new week.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-500 mb-2">Copy mode</label>
          <Radio.Group
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="single">One week</Radio.Button>
            <Radio.Button value="repeat">Repeat to future weeks</Radio.Button>
          </Radio.Group>
        </div>

        {mode === "single" ? (
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
        ) : (
          <div>
            <label className="block text-xs text-slate-500 mb-1">Repeat this class week into future weeks</label>
            <Select
              value={repeatCount}
              style={{ width: "100%" }}
              onChange={(value) => setRepeatCount(value)}
              options={[
                { value: 2, label: "Next 2 weeks" },
                { value: 4, label: "Next 4 weeks" },
                { value: 6, label: "Next 6 weeks" },
                { value: 8, label: "Next 8 weeks" },
              ]}
            />
            <p className="text-xs text-slate-500 mt-1">
              The current class week will be copied into the next {repeatCount} week{repeatCount !== 1 ? "s" : ""}.
            </p>
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={clearExisting}
            onChange={(event) => setClearExisting(event.target.checked)}
          />
          Replace lessons that already exist in the target week(s)
        </label>

        {mode === "repeat" && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            This is the faster repeat-pattern option for the current class.
          </div>
        )}
      </div>
    </Modal>
  );
}