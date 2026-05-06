"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ALL_CANONICAL_DAYS,
  resetPeriodsToDefault,
  resetSchoolDaysToDefault,
} from "@/lib/schoolPeriods";
import type { SchoolPeriod } from "@/lib/schoolPeriods";

const { Option } = Select;

interface PeriodsConfigModalProps {
  open: boolean;
  onClose: () => void;
  periods: SchoolPeriod[];
  schoolDays: string[];
  onChange: (periods: SchoolPeriod[], days: string[]) => void;
}

export default function PeriodsConfigModal({
  open,
  onClose,
  periods,
  schoolDays,
  onChange,
}: PeriodsConfigModalProps) {
  const [local, setLocal] = useState<SchoolPeriod[]>(periods);
  const [localDays, setLocalDays] = useState<string[]>(schoolDays);

  useEffect(() => {
    if (open) {
      setLocal(periods);
      setLocalDays(schoolDays);
    }
  }, [open, periods, schoolDays]);

  const update = (idx: number, field: keyof SchoolPeriod, value: string | boolean) => {
    setLocal((prev) => prev.map((period, index) => (index === idx ? { ...period, [field]: value } : period)));
  };

  const add = () =>
    setLocal((prev) => [
      ...prev,
      { id: `p${Date.now()}`, label: "New", startTime: "08:00", endTime: "09:00", isTeaching: true },
    ]);

  const remove = (idx: number) => setLocal((prev) => prev.filter((_, index) => index !== idx));

  const toggleDay = (day: string) => {
    setLocalDays((prev) =>
      prev.includes(day) ? prev.filter((value) => value !== day) : [...prev, day]
    );
  };

  const moveDay = (day: string, dir: -1 | 1) => {
    setLocalDays((prev) => {
      const idx = prev.indexOf(day);
      if (idx === -1) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  return (
    <Modal
      title="Configure Schedule"
      open={open}
      onCancel={onClose}
      onOk={() => {
        onChange(local, localDays);
        onClose();
      }}
      okText="Save"
      width={560}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: "#374151" }}>
          School Days
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {ALL_CANONICAL_DAYS.map((day) => {
            const active = localDays.includes(day);
            return (
              <span
                key={day}
                onClick={() => toggleDay(day)}
                style={{
                  cursor: "pointer",
                  padding: "3px 12px",
                  borderRadius: 20,
                  border: `1px solid ${active ? "#3b82f6" : "#d1d5db"}`,
                  background: active ? "#eff6ff" : "#f9fafb",
                  color: active ? "#1d4ed8" : "#6b7280",
                  fontWeight: active ? 600 : 400,
                  fontSize: 12,
                  userSelect: "none",
                }}
              >
                {day}
              </span>
            );
          })}
        </div>
        {localDays.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
              Week order (use arrows to reorder):
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {localDays.map((day, i) => (
                <span
                  key={day}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    border: "1px solid #93c5fd",
                    fontSize: 12,
                  }}
                >
                  {day.slice(0, 3)}
                  {i > 0 && (
                    <span
                      onClick={() => moveDay(day, -1)}
                      style={{ cursor: "pointer", fontSize: 10, color: "#3b82f6", paddingLeft: 2 }}
                    >
                      ◀
                    </span>
                  )}
                  {i < localDays.length - 1 && (
                    <span
                      onClick={() => moveDay(day, 1)}
                      style={{ cursor: "pointer", fontSize: 10, color: "#3b82f6" }}
                    >
                      ▶
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 12 }} />

      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: "#374151" }}>
        Periods
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {local.map((period, idx) => (
          <div key={period.id} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
            <Input
              size="small"
              value={period.label}
              style={{ width: 60 }}
              onChange={(e) => update(idx, "label", e.target.value)}
            />
            <Input
              size="small"
              value={period.startTime}
              style={{ width: 70 }}
              placeholder="HH:mm"
              onChange={(e) => update(idx, "startTime", e.target.value)}
            />
            <span style={{ color: "#94a3b8" }}>–</span>
            <Input
              size="small"
              value={period.endTime}
              style={{ width: 70 }}
              placeholder="HH:mm"
              onChange={(e) => update(idx, "endTime", e.target.value)}
            />
            <Select
              size="small"
              value={period.isTeaching ? "teaching" : "break"}
              style={{ width: 90 }}
              onChange={(value) => update(idx, "isTeaching", value === "teaching")}
            >
              <Option value="teaching">Teaching</Option>
              <Option value="break">Break</Option>
            </Select>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => remove(idx)} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Button size="small" icon={<PlusOutlined />} onClick={add}>Add Period</Button>
        <Button
          size="small"
          danger
          onClick={() => {
            setLocal(resetPeriodsToDefault());
            setLocalDays(resetSchoolDaysToDefault());
          }}
        >
          Reset to Default
        </Button>
      </div>
    </Modal>
  );
}