"use client";

import { Button, Modal } from "antd";
import type { SchoolPeriod } from "@/lib/schoolPeriods";

type AvailabilityTeacher = {
  id: string;
  name: string;
  availability: Record<string, boolean[]>;
};

interface TeacherAvailabilityModalProps {
  open: boolean;
  teacher: AvailabilityTeacher | null;
  schoolDays: string[];
  teachingPeriods: SchoolPeriod[];
  onClose: () => void;
  onToggleAvailability: (teacherId: string, day: string, periodIdx: number) => void;
}

export default function TeacherAvailabilityModal({
  open,
  teacher,
  schoolDays,
  teachingPeriods,
  onClose,
  onToggleAvailability,
}: TeacherAvailabilityModalProps) {
  return (
    <Modal
      title={`Availability — ${teacher?.name ?? ""}`}
      open={open}
      onCancel={onClose}
      footer={<Button type="primary" onClick={onClose}>Done</Button>}
      width={600}
    >
      {teacher && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="border p-1 bg-slate-50 text-slate-500">Period</th>
                {schoolDays.map((day) => (
                  <th key={day} className="border p-1 bg-slate-50 text-slate-500">{day.slice(0, 3)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachingPeriods.map((period, periodIdx) => (
                <tr key={period.id}>
                  <td className="border p-1 text-center font-medium text-slate-600">
                    {period.label}<br />
                    <span className="text-slate-400 text-[10px]">{period.startTime}</span>
                  </td>
                  {schoolDays.map((day) => {
                    const availability = teacher.availability[day];
                    const isAvailable = !availability || availability[periodIdx] !== false;
                    return (
                      <td
                        key={day}
                        className={`border p-1 text-center cursor-pointer transition-colors ${
                          isAvailable
                            ? "bg-green-50 hover:bg-green-100 text-green-700"
                            : "bg-red-50 hover:bg-red-100 text-red-500"
                        }`}
                        onClick={() => onToggleAvailability(teacher.id, day, periodIdx)}
                      >
                        {isAvailable ? "✓" : "✕"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-xs text-slate-400">
            Click a cell to toggle availability. Green = available, Red = unavailable.
          </div>
        </div>
      )}
    </Modal>
  );
}