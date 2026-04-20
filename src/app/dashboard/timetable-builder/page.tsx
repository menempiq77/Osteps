"use client";

import React, { useState, useMemo, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  Badge, Button, DatePicker, Dropdown, Form, Input, Modal, Popover, Select, Spin,
  Tag, Tooltip, Typography, message,
} from "antd";
import {
  ArrowLeftOutlined, ArrowRightOutlined, CopyOutlined,
  DeleteOutlined, EditOutlined, FilterOutlined, PlusOutlined, SettingOutlined,
  WarningOutlined, ClearOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchTimetableData,
  addTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} from "@/services/timetableApi";
import { fetchTeachers } from "@/services/teacherApi";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchSubjects } from "@/services/subjectsApi";
import {
  loadPeriods, savePeriods, resetPeriodsToDefault,
  loadSchoolDays, saveSchoolDays, resetSchoolDaysToDefault,
  DEFAULT_PERIODS, DAYS_OF_WEEK, ALL_CANONICAL_DAYS,
  SchoolPeriod,
} from "@/lib/schoolPeriods";
import { detectConflicts, hasHardConflict, hasSoftConflict } from "@/lib/timetableConflicts";

dayjs.extend(isoWeek);

const { Title, Text } = Typography;
const { Option } = Select;

// ── colour chips for subjects ─────────────────────────────────────────────────
const CHIP_COLORS = [
  { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  { bg: "#ede9fe", text: "#6d28d9", border: "#c4b5fd" },
  { bg: "#fce7f3", text: "#be185d", border: "#f9a8d4" },
  { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  { bg: "#ffedd5", text: "#c2410c", border: "#fdba74" },
  { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
  { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
  { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
];
const subjectColorCache: Record<string, number> = {};
let colorCounter = 0;
function chipColor(subjectName: string) {
  if (!subjectColorCache[subjectName]) {
    subjectColorCache[subjectName] = colorCounter % CHIP_COLORS.length;
    colorCounter++;
  }
  return CHIP_COLORS[subjectColorCache[subjectName]];
}

// ── date helpers ──────────────────────────────────────────────────────────────
const SCHOOL_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

function weekStart(anchor: Dayjs, firstDayIdx = 0) {
  // Snap to the configured first school day (0=Sun, 1=Mon, ...)
  const diff = (anchor.day() - firstDayIdx + 7) % 7;
  return anchor.subtract(diff, "day");
}

function weekLabel(sun: Dayjs) {
  return `${sun.format("D MMM")} – ${sun.add(6, "day").format("D MMM YYYY")}`;
}

// Slots that fall within the displayed week
function slotsForWeek(slots: any[], weekSun: Dayjs) {
  const sunStr = weekSun.format("YYYY-MM-DD");
  const satStr = weekSun.add(6, "day").format("YYYY-MM-DD");
  return slots.filter((s) => {
    const d = s.date;
    return d >= sunStr && d <= satStr;
  });
}

function dayOffset(dayName: string, weekStartDate: Dayjs, firstDayIdx = 0) {
  const idx = DAYS_OF_WEEK.findIndex((d) => d.value === dayName);
  const offset = (idx - firstDayIdx + 7) % 7;
  return weekStartDate.add(offset, "day").format("YYYY-MM-DD");
}

// ── SlotForm ──────────────────────────────────────────────────────────────────
interface SlotFormValues {
  subject_id: string;
  teacher_id: string;
  year_id: string;
  class_id: string;
  room: string;
  zoom_link: string;
}

interface SlotFormProps {
  initial?: Partial<SlotFormValues>;
  subjects: any[];
  teachers: any[];
  years: any[];
  classes: any[];
  onYearChange: (yearId: string) => void;
  onSave: (values: SlotFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  conflicts?: ReturnType<typeof detectConflicts>;
}

function SlotForm({
  initial, subjects, teachers, years, classes,
  onYearChange, onSave, onCancel, loading, conflicts = [],
}: SlotFormProps) {
  const [form] = Form.useForm<SlotFormValues>();
  const selectedSubjectId = Form.useWatch("subject_id", form);

  // Filter teachers to only those assigned to the selected subject
  const filteredTeachers = selectedSubjectId
    ? teachers.filter((t: any) =>
        !t.subject_id || String(t.subject_id) === String(selectedSubjectId)
      )
    : teachers;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initial}
      onFinish={onSave}
      size="small"
      style={{ width: 270 }}
    >
      <Form.Item name="subject_id" label="Subject" rules={[{ required: true }]}>
        <Select
          showSearch
          optionFilterProp="children"
          placeholder="Select subject"
          onChange={() => form.setFieldValue("teacher_id", undefined)}
        >
          {subjects.map((s: any) => (
            <Option key={s.id} value={String(s.id)}>
              {s.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="teacher_id" label="Teacher" rules={[{ required: true }]}>
        <Select showSearch optionFilterProp="children" placeholder="Select teacher">
          {filteredTeachers.map((t: any) => (
            <Option key={t.id} value={String(t.id)}>{t.teacher_name || t.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="year_id" label="Year">
        <Select placeholder="Year" onChange={onYearChange} allowClear>
          {years.map((y: any) => (
            <Option key={y.id} value={String(y.id)}>{y.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="class_id" label="Class" rules={[{ required: true }]}>
        <Select showSearch optionFilterProp="children" placeholder="Select class">
          {classes.map((c: any) => (
            <Option key={c.id} value={String(c.id)}>{c.class_name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="room" label="Room">
        <Input placeholder="e.g. Room 101" />
      </Form.Item>
      <Form.Item name="zoom_link" label="Zoom link">
        <Input placeholder="https://..." />
      </Form.Item>
      {conflicts.length > 0 && (
        <div className="mb-2">
          {conflicts.map((c, i) => (
            <Tag
              key={i}
              color={hasHardConflict([c]) ? "error" : "warning"}
              icon={<WarningOutlined />}
              style={{ whiteSpace: "normal", marginBottom: 4 }}
            >
              {c.message}
            </Tag>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <Button size="small" onClick={onCancel}>Cancel</Button>
        <Button size="small" type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
}

// ── PeriodsConfigModal ────────────────────────────────────────────────────────
interface PeriodsConfigModalProps {
  open: boolean;
  onClose: () => void;
  periods: SchoolPeriod[];
  schoolDays: string[];
  onChange: (periods: SchoolPeriod[], days: string[]) => void;
}

function PeriodsConfigModal({ open, onClose, periods, schoolDays, onChange }: PeriodsConfigModalProps) {
  const [local, setLocal] = useState<SchoolPeriod[]>(periods);
  const [localDays, setLocalDays] = useState<string[]>(schoolDays);

  // Sync when modal opens
  React.useEffect(() => {
    if (open) { setLocal(periods); setLocalDays(schoolDays); }
  }, [open, periods, schoolDays]);

  const update = (idx: number, field: keyof SchoolPeriod, value: string | boolean) => {
    setLocal((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const add = () =>
    setLocal((prev) => [
      ...prev,
      { id: `p${Date.now()}`, label: "New", startTime: "08:00", endTime: "09:00", isTeaching: true },
    ]);

  const remove = (idx: number) => setLocal((prev) => prev.filter((_, i) => i !== idx));

  const toggleDay = (day: string) => {
    setLocalDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Move a day earlier in the order list
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
      onOk={() => { onChange(local, localDays); onClose(); }}
      okText="Save"
      width={560}
    >
      {/* ── Days section ── */}
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
        {/* Active days order */}
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
                    display: "inline-flex", alignItems: "center", gap: 2,
                    padding: "2px 8px", borderRadius: 12,
                    background: "#dbeafe", color: "#1d4ed8",
                    border: "1px solid #93c5fd", fontSize: 12,
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

      {/* ── Periods section ── */}
      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: "#374151" }}>
        Periods
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {local.map((p, idx) => (
          <div key={p.id} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
            <Input
              size="small" value={p.label} style={{ width: 60 }}
              onChange={(e) => update(idx, "label", e.target.value)}
            />
            <Input
              size="small" value={p.startTime} style={{ width: 70 }} placeholder="HH:mm"
              onChange={(e) => update(idx, "startTime", e.target.value)}
            />
            <span style={{ color: "#94a3b8" }}>–</span>
            <Input
              size="small" value={p.endTime} style={{ width: 70 }} placeholder="HH:mm"
              onChange={(e) => update(idx, "endTime", e.target.value)}
            />
            <Select
              size="small" value={p.isTeaching ? "teaching" : "break"}
              style={{ width: 90 }}
              onChange={(v) => update(idx, "isTeaching", v === "teaching")}
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
          size="small" danger
          onClick={() => { setLocal(resetPeriodsToDefault()); setLocalDays(resetSchoolDaysToDefault()); }}
        >Reset to Default</Button>
      </div>
    </Modal>
  );
}

// ── DuplicateWeekModal ────────────────────────────────────────────────────────
interface DuplicateWeekProps {
  open: boolean;
  onClose: () => void;
  sourceWeek: Dayjs;
  allSlots: any[];
  onConfirm: (targetWeekSun: Dayjs) => Promise<void>;
}

function DuplicateWeekModal({ open, onClose, sourceWeek, allSlots, onConfirm }: DuplicateWeekProps) {
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
          onChange={(d) => {
            if (!d) { setTarget(null); return; }
            const sun = weekStart(d);
            setTarget(sun);
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TimetableBuilderPage() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const schoolId = currentUser?.school;

  // Periods config
  const [periods, setPeriods] = useState<SchoolPeriod[]>(() => loadPeriods());
  const [schoolDays, setSchoolDays] = useState<string[]>(() => loadSchoolDays());
  const [periodsModalOpen, setPeriodsModalOpen] = useState(false);

  // Week navigation
  const [anchor, setAnchor] = useState<Dayjs>(dayjs());
  const firstDayIdx = useMemo(() => {
    const first = schoolDays[0] ?? "Sunday";
    return DAYS_OF_WEEK.findIndex((d) => d.value === first);
  }, [schoolDays]);
  const weekSun = useMemo(() => weekStart(anchor, firstDayIdx), [anchor, firstDayIdx]);

  // Duplicate week modal
  const [duplicateOpen, setDuplicateOpen] = useState(false);

  // Popover state: { key: "day|periodId", mode: "add"|"edit", slotId?: number }
  const [popoverKey, setPopoverKey] = useState<string | null>(null);
  const [popoverMode, setPopoverMode] = useState<"add" | "edit">("add");
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [formConflicts, setFormConflicts] = useState<ReturnType<typeof detectConflicts>>([]);

  // Year/class cascade for the form
  const [formYear, setFormYear] = useState<string | null>(null);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filterSubjectId, setFilterSubjectId] = useState<string | null>(null);
  const [filterYearId,    setFilterYearId]    = useState<string | null>(null);
  const [filterClassId,   setFilterClassId]   = useState<string | null>(null);
  const [filterTeacherId, setFilterTeacherId] = useState<string | null>(null);

  // ── Data queries ──────────────────────────────────────────────────────────
  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["timetable", "all"],
    queryFn: () => fetchTimetableData("all"),
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(),
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers", "all"],
    queryFn: () => fetchTeachers("all"),
  });

  const { data: years = [] } = useQuery({
    queryKey: ["years", schoolId],
    enabled: !!schoolId,
    queryFn: () => fetchYearsBySchool(schoolId as number),
  });

  const { data: classes = [] } = useQuery<any[]>({
    queryKey: ["classes", formYear],
    enabled: !!formYear,
    queryFn: () => fetchClasses(String(formYear)),
  });

  // All classes for conflict detection (load lazily – use all years)
  const { data: allClasses = [] } = useQuery<any[]>({
    queryKey: ["all-classes-builder", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      const yr: any[] = (await fetchYearsBySchool(schoolId as number)) ?? [];
      const arr = await Promise.all(yr.map((y) => fetchClasses(String(y.id)).catch(() => [])));
      return arr.flat();
    },
  });

  // Subject name for the active filter (used as fallback when API omits subject_id on slots)
  const filterSubjectName = useMemo(() => {
    if (!filterSubjectId) return null;
    return (subjects as any[]).find((s: any) => String(s.id) === filterSubjectId)?.name ?? null;
  }, [filterSubjectId, subjects]);

  // ── Week slots ────────────────────────────────────────────────────────────
  const weekSlots = useMemo(() => {
    let ws = slotsForWeek(slots, weekSun);
    if (filterSubjectId) ws = ws.filter((s: any) =>
      String(s.subject_id) === filterSubjectId ||
      (filterSubjectName && s.subject === filterSubjectName)
    );
    if (filterYearId)    ws = ws.filter((s: any) => String(s.year_id)    === filterYearId);
    if (filterClassId)   ws = ws.filter((s: any) => String(s.class_id)   === filterClassId);
    if (filterTeacherId) ws = ws.filter((s: any) => String(s.teacher_id) === filterTeacherId);
    return ws;
  }, [slots, weekSun, filterSubjectId, filterSubjectName, filterYearId, filterClassId, filterTeacherId]);

  // All week slots unfiltered (used for stats total)
  const weekSlotsAll = useMemo(() => slotsForWeek(slots, weekSun), [slots, weekSun]);

  // Subject-classes for the active subject filter — used to derive which years are valid
  const { data: subjectClassRows = [], isFetched: subjectClassesFetched } = useQuery<any[]>({
    queryKey: ["subject-classes-filter", filterSubjectId],
    enabled: !!filterSubjectId,
    queryFn: () => fetchSubjectClasses({ subject_id: Number(filterSubjectId) }),
  });

  // Years that actually appear in ANY slot (for filter bar dropdown).
  // When a subject filter is active, ONLY show years from that subject's classes.
  // An empty result for the subject stays empty — never fall through to global list.
  // Falls back to years that have at least one class configured (excludes empty/test years).
  const yearsInUse = useMemo(() => {
    if (filterSubjectId) {
      if (!subjectClassesFetched) return []; // still loading — show nothing yet
      const ids = new Set((subjectClassRows as any[]).map((r) => String(r.year_id)).filter(Boolean));
      return (years as any[]).filter((y) => ids.has(String(y.id))); // may be [] if no classes
    }
    const slotYearIds = new Set((slots as any[]).map((s) => String(s.year_id)).filter(Boolean));
    if (slotYearIds.size > 0) return (years as any[]).filter((y) => slotYearIds.has(String(y.id)));
    const classYearIds = new Set((allClasses as any[]).map((c) => String(c.year_id)).filter(Boolean));
    if (classYearIds.size > 0) return (years as any[]).filter((y) => classYearIds.has(String(y.id)));
    return years as any[];
  }, [filterSubjectId, subjectClassesFetched, subjectClassRows, slots, years, allClasses]);

  // Classes for filter dropdown (filtered by selected year)
  const { data: filterClasses = [] } = useQuery<any[]>({
    queryKey: ["filter-classes", filterYearId],
    enabled: !!filterYearId,
    queryFn: () => fetchClasses(String(filterYearId)),
  });

  // Build conflict map: slotId → Conflict[]
  const conflictMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof detectConflicts>> = {};
    for (const slot of slots) {
      const candidate = {
        id: slot.id,
        day_of_week: slot.day,
        start_time: slot.start_time,
        end_time: slot.end_time,
        teacher_id: slot.teacher_id,
        class_id: slot.class_id,
        room: slot.room,
      };
      map[slot.id] = detectConflicts(
        slots.map((s: any) => ({
          id: s.id,
          day_of_week: s.day,
          start_time: s.start_time,
          end_time: s.end_time,
          teacher_id: s.teacher_id,
          class_id: s.class_id,
          room: s.room,
        })),
        candidate
      );
    }
    return map;
  }, [slots]);

  // Stats (always based on unfiltered week slots)
  const stats = useMemo(() => {
    const teacherSet = new Set(weekSlotsAll.map((s: any) => s.teacher_id).filter(Boolean));
    const classSet   = new Set(weekSlotsAll.map((s: any) => s.class_id).filter(Boolean));
    const conflictSlots = weekSlotsAll.filter((s: any) => (conflictMap[s.id] ?? []).length > 0);
    const activeFilters = [filterSubjectId, filterYearId, filterClassId, filterTeacherId].filter(Boolean).length;
    return { slots: weekSlotsAll.length, shown: weekSlots.length, teachers: teacherSet.size, classes: classSet.size, conflicts: conflictSlots.length, activeFilters };
  }, [weekSlotsAll, weekSlots, conflictMap, filterSubjectId, filterYearId, filterClassId, filterTeacherId]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["timetable"] });

  const addMutation = useMutation({
    mutationFn: (data: Parameters<typeof addTimetableSlot>[0]) =>
      addTimetableSlot(data, "all"),
    onSuccess: () => { invalidate(); messageApi.success("Slot added"); },
    onError: () => messageApi.error("Failed to add slot"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTimetableSlot>[1] }) =>
      updateTimetableSlot(id, data, "all"),
    onSuccess: () => { invalidate(); messageApi.success("Slot updated"); },
    onError: () => messageApi.error("Failed to update slot"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTimetableSlot(id),
    onSuccess: () => { invalidate(); messageApi.success("Slot deleted"); },
    onError: () => messageApi.error("Failed to delete slot"),
  });

  // ── Popover helpers ───────────────────────────────────────────────────────
  const openAdd = (day: string, period: SchoolPeriod) => {
    setPopoverMode("add");
    setEditingSlot({ day, period });
    setFormConflicts([]);
    setFormYear(null);
    setPopoverKey(`${day}|${period.id}`);
  };

  const openEdit = (slot: any) => {
    setPopoverMode("edit");
    setEditingSlot(slot);
    setFormConflicts([]);
    setFormYear(String(slot.year_id ?? ""));
    setPopoverKey(`edit|${slot.id}`);
    // Also trigger class load for the slot's year
    if (slot.year_id) setFormYear(String(slot.year_id));
  };

  const closePopover = () => setPopoverKey(null);

  const handleFormSave = useCallback(
    (values: SlotFormValues) => {
      if (!editingSlot) return;

      // Build candidate for conflict detection
      const candidate = {
        id: popoverMode === "edit" ? editingSlot.id : undefined,
        day_of_week: popoverMode === "add" ? editingSlot.day : editingSlot.day,
        start_time: popoverMode === "add" ? editingSlot.period.startTime : editingSlot.start_time,
        end_time: popoverMode === "add" ? editingSlot.period.endTime : editingSlot.end_time,
        teacher_id: Number(values.teacher_id) || null,
        class_id: Number(values.class_id) || null,
        room: values.room || null,
      };

      const foundConflicts = detectConflicts(
        slots.map((s: any) => ({
          id: s.id,
          day_of_week: s.day,
          start_time: s.start_time,
          end_time: s.end_time,
          teacher_id: s.teacher_id,
          class_id: s.class_id,
          room: s.room,
        })),
        candidate
      );

      if (hasHardConflict(foundConflicts)) {
        setFormConflicts(foundConflicts);
        return; // block save
      }
      if (hasSoftConflict(foundConflicts)) {
        setFormConflicts(foundConflicts);
        // soft conflicts: show warning but still proceed
      }

      const day = popoverMode === "add" ? editingSlot.day : editingSlot.day;
      const date = dayOffset(day, weekSun, firstDayIdx);
      // Resolve subject name from the selected subject_id
      const selectedSubject = (subjects as any[]).find(
        (s: any) => String(s.id) === String(values.subject_id)
      );
      const payload = {
        subject: selectedSubject?.name ?? "",
        subject_id: values.subject_id,
        teacher_id: values.teacher_id,
        year_id: values.year_id ?? "",
        class_id: values.class_id,
        room: values.room ?? "",
        zoom_link: values.zoom_link,
        date,
        day,
        start_time: popoverMode === "add" ? editingSlot.period.startTime : editingSlot.start_time,
        end_time: popoverMode === "add" ? editingSlot.period.endTime : editingSlot.end_time,
        school_id: schoolId ?? undefined,
      };

      if (popoverMode === "add") {
        addMutation.mutate(payload as any, { onSuccess: closePopover });
      } else {
        updateMutation.mutate(
          { id: String(editingSlot.id), data: payload as any },
          { onSuccess: closePopover }
        );
      }
    },
    [editingSlot, popoverMode, slots, weekSun, schoolId, subjects, addMutation, updateMutation]
  );

  // ── Reset timetable ──────────────────────────────────────────────────────
  const [resetting, setResetting] = useState(false);
  const [resetScope, setResetScope] = useState<"week" | "all" | null>(null);

  const handleReset = (scope: "week" | "all") => setResetScope(scope);

  const confirmReset = async () => {
    if (!resetScope) return;
    const target = resetScope === "week"
      ? slotsForWeek(slots, weekSun)
      : (slots as any[]);
    setResetting(true);
    setResetScope(null);
    let failed = 0;
    for (const slot of target) {
      try {
        await deleteTimetableSlot(String(slot.id));
      } catch {
        failed++;
      }
    }
    await invalidate();
    setResetting(false);
    if (failed === 0) {
      messageApi.success(`Deleted ${target.length} slot${target.length !== 1 ? "s" : ""}`);
    } else {
      messageApi.warning(`Deleted ${target.length - failed}/${target.length} slots (${failed} failed)`);
    }
  };

  // ── Duplicate week ────────────────────────────────────────────────────────
  const handleDuplicate = async (targetSun: Dayjs) => {
    const source = slotsForWeek(slots, weekSun);
    for (const slot of source) {
      const srcDate = dayjs(slot.date);
      const dayDiff = srcDate.diff(weekSun, "day");
      const newDate = targetSun.add(dayDiff, "day").format("YYYY-MM-DD");
      await addTimetableSlot(
        {
          subject: slot.subject,
          teacher_id: String(slot.teacher_id ?? ""),
          year_id: String(slot.year_id ?? ""),
          class_id: String(slot.class_id ?? ""),
          room: slot.room ?? "",
          zoom_link: slot.zoom_link,
          date: newDate,
          day: slot.day,
          start_time: slot.start_time,
          end_time: slot.end_time,
          school_id: schoolId ?? undefined,
        },
        "all"
      );
    }
    invalidate();
    messageApi.success(`Copied ${source.length} slot${source.length !== 1 ? "s" : ""}`);
  };

  // ── Grid helpers ──────────────────────────────────────────────────────────
  const teachingPeriods = periods.filter((p) => p.isTeaching);
  const allDisplayedPeriods = periods;

  const getCellSlots = (day: string, period: SchoolPeriod) => {
    return weekSlots.filter(
      (s: any) =>
        s.day === day &&
        s.start_time.slice(0, 5) === period.startTime &&
        s.end_time.slice(0, 5) === period.endTime
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
      {contextHolder}

      {/* Header */}
      <div className="max-w-screen-xl mx-auto mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title level={3} style={{ margin: 0 }}>Timetable Builder</Title>
            <Text type="secondary" className="text-sm">
              Click a cell to add a slot · Click a chip to edit
            </Text>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Week nav */}
            <Button icon={<ArrowLeftOutlined />} onClick={() => setAnchor((a) => a.subtract(7, "day"))} />
            <DatePicker
              value={weekSun}
              format="DD MMM YYYY"
              style={{ width: 160 }}
              onChange={(d) => { if (d) setAnchor(d); }}
            />
            <Button icon={<ArrowRightOutlined />} onClick={() => setAnchor((a) => a.add(7, "day"))} />
            <Button onClick={() => setAnchor(dayjs())}>This Week</Button>
            <Button icon={<CopyOutlined />} onClick={() => setDuplicateOpen(true)}>Copy Week</Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "week",
                    label: `Reset this week (${slotsForWeek(slots, weekSun).length} slots)`,
                    danger: true,
                  },
                  {
                    key: "all",
                    label: `Reset entire timetable (${(slots as any[]).length} slots)`,
                    danger: true,
                  },
                ],
                onClick: ({ key }) => handleReset(key as "week" | "all"),
              }}
              trigger={["click"]}
            >
              <Button danger icon={<ClearOutlined />} loading={resetting}>Reset</Button>
            </Dropdown>
            <Button icon={<SettingOutlined />} onClick={() => setPeriodsModalOpen(true)}>Periods</Button>
            <a href="/dashboard/timetable-generator">
              <Button type="primary" className="bg-gradient-to-r from-blue-500 to-indigo-500">
                ⚡ Generate
              </Button>
            </a>
          </div>
        </div>

        {/* Week label + stats */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Tag color="blue" style={{ fontSize: 13 }}>{weekLabel(weekSun)}</Tag>
          <span className="text-xs text-slate-500">
            {stats.activeFilters > 0
              ? <><strong>{stats.shown}</strong> shown / {stats.slots} total</>
              : <>{stats.slots} slots</>}
            {" · "}{stats.teachers} teachers · {stats.classes} classes
          </span>
          {stats.conflicts > 0 && (
            <Tag color="error" icon={<WarningOutlined />}>{stats.conflicts} conflict{stats.conflicts !== 1 ? "s" : ""} this week</Tag>
          )}
        </div>

        {/* Filter bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 p-3 rounded-xl border border-slate-200 bg-white">
          <FilterOutlined className="text-slate-400" />
          <span className="text-xs font-medium text-slate-500 mr-1">Filter:</span>

          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="All Subjects"
            style={{ width: 150 }}
            size="small"
            value={filterSubjectId ?? undefined}
            onChange={(v) => {
              setFilterSubjectId(v ?? null);
              setFilterYearId(null);
              setFilterClassId(null);
            }}
          >
            {(subjects as any[]).map((s: any) => (
              <Option key={s.id} value={String(s.id)}>{s.name}</Option>
            ))}
          </Select>

          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="All Years"
            style={{ width: 120 }}
            size="small"
            value={filterYearId ?? undefined}
            onChange={(v) => {
              setFilterYearId(v ?? null);
              setFilterClassId(null);
            }}
          >
            {yearsInUse.map((y: any) => (
              <Option key={y.id} value={String(y.id)}>{y.name}</Option>
            ))}
          </Select>

          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="All Classes"
            style={{ width: 120 }}
            size="small"
            disabled={!filterYearId}
            value={filterClassId ?? undefined}
            onChange={(v) => setFilterClassId(v ?? null)}
          >
            {filterClasses.map((c: any) => (
              <Option key={c.id} value={String(c.id)}>{c.class_name}</Option>
            ))}
          </Select>

          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="All Teachers"
            style={{ width: 150 }}
            size="small"
            value={filterTeacherId ?? undefined}
            onChange={(v) => setFilterTeacherId(v ?? null)}
          >
            {(teachers as any[]).map((t: any) => (
              <Option key={t.id} value={String(t.id)}>{t.teacher_name || t.name}</Option>
            ))}
          </Select>

          {stats.activeFilters > 0 && (
            <Button
              size="small"
              type="link"
              className="text-xs"
              onClick={() => {
                setFilterSubjectId(null);
                setFilterYearId(null);
                setFilterClassId(null);
                setFilterTeacherId(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-screen-xl mx-auto overflow-x-auto">
        {slotsLoading ? (
          <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
        ) : (
          <table className="w-full border-collapse text-xs" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th className="bg-slate-100 border border-slate-200 p-2 text-slate-500 font-medium w-20">Period</th>
                {schoolDays.map((day) => {
                  const date = weekSun.add((DAYS_OF_WEEK.findIndex((d) => d.value === day) - firstDayIdx + 7) % 7, "day");
                  const isToday = date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
                  return (
                    <th
                      key={day}
                      className={`border border-slate-200 p-2 font-medium text-center ${isToday ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      <div>{day.slice(0, 3)}</div>
                      <div className={`text-xs font-normal ${isToday ? "text-blue-500" : "text-slate-400"}`}>
                        {date.format("D MMM")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {allDisplayedPeriods.map((period) => (
                <tr key={period.id} className={period.isTeaching ? "" : "bg-slate-50"}>
                  {/* Period label */}
                  <td className="border border-slate-200 p-1.5 text-center align-middle bg-slate-50">
                    <div className="font-semibold text-slate-700">{period.label}</div>
                    <div className="text-slate-400">{period.startTime}</div>
                    <div className="text-slate-400">{period.endTime}</div>
                  </td>

                  {schoolDays.map((day) => {
                    const cellSlots = getCellSlots(day, period);
                    const cellKey = `${day}|${period.id}`;
                    const isAddOpen = popoverKey === cellKey && popoverMode === "add";

                    return (
                      <td
                        key={day}
                        className={`border border-slate-200 p-1 align-top min-w-[120px] ${!period.isTeaching ? "bg-slate-50" : "hover:bg-blue-50/20 cursor-pointer"}`}
                        style={{ verticalAlign: "top" }}
                      >
                        {/* Existing slot chips */}
                        <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5">
                        {cellSlots.slice(0, 4).map((slot: any) => {
                          const slotKey = `edit|${slot.id}`;
                          const isEditOpen = popoverKey === slotKey;
                          const slotConflicts = conflictMap[slot.id] ?? [];
                          const chip = chipColor(slot.subject ?? "");
                          const hasHard = hasHardConflict(slotConflicts);
                          const hasSoft = hasSoftConflict(slotConflicts);

                          return (
                            <Popover
                              key={slot.id}
                              open={isEditOpen}
                              trigger="click"
                              placement="right"
                              onOpenChange={(open) => {
                                if (!open) closePopover();
                              }}
                              content={
                                isEditOpen ? (
                                  <SlotForm
                                    initial={{
                                      subject_id: String(slot.subject_id ?? ""),
                                      teacher_id: String(slot.teacher_id ?? ""),
                                      year_id: String(slot.year_id ?? ""),
                                      class_id: String(slot.class_id ?? ""),
                                      room: slot.room ?? "",
                                      zoom_link: slot.zoom_link ?? "",
                                    }}
                                    subjects={subjects}
                                    teachers={teachers}
                                    years={years}
                                    classes={classes}
                                    onYearChange={(y) => setFormYear(y)}
                                    onSave={handleFormSave}
                                    onCancel={closePopover}
                                    loading={updateMutation.isPending}
                                    conflicts={formConflicts}
                                  />
                                ) : null
                              }
                            >
                              <Tooltip
                                title={
                                  slotConflicts.length > 0
                                    ? slotConflicts.map((c) => c.message).join("; ")
                                    : `${slot.subject} · ${slot.teacher?.teacher_name ?? ""}`
                                }
                              >
                                <div
                                  onClick={() => openEdit(slot)}
                                  className="rounded mb-0.5 px-1.5 py-0.5 cursor-pointer border text-xs flex items-center justify-between gap-1 group"
                                  style={{
                                    background: chip.bg,
                                    color: chip.text,
                                    borderColor: hasHard ? "#ef4444" : hasSoft ? "#f59e0b" : chip.border,
                                    borderWidth: hasHard || hasSoft ? 2 : 1,
                                  }}
                                >
                                  <span className="truncate max-w-[80px]">{slot.subject}</span>
                                  <div className="flex items-center gap-0.5 shrink-0">
                                    {hasHard && <span title="Conflict">🔴</span>}
                                    {hasSoft && !hasHard && <span title="Room conflict">🟡</span>}
                                    <EditOutlined
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      style={{ fontSize: 10 }}
                                    />
                                    <DeleteOutlined
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
                                      style={{ fontSize: 10 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        Modal.confirm({
                                          title: "Delete slot?",
                                          content: `${slot.subject} on ${slot.day}`,
                                          okType: "danger",
                                          okText: "Delete",
                                          onOk: () => deleteMutation.mutate(String(slot.id)),
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </Tooltip>
                            </Popover>
                          );
                        })}

                        {/* +N more overflow badge */}
                        {cellSlots.length > 4 && (
                          <Popover
                            trigger="click"
                            placement="right"
                            content={
                              <div style={{ maxWidth: 260 }}>
                                <p className="text-xs font-semibold text-slate-600 mb-2">
                                  All {cellSlots.length} slots in this cell
                                </p>
                                {cellSlots.map((slot: any) => {
                                  const chip = chipColor(slot.subject ?? "");
                                  return (
                                    <div
                                      key={slot.id}
                                      className="rounded px-2 py-1 mb-1 text-xs border flex items-center justify-between gap-2 cursor-pointer hover:opacity-80"
                                      style={{ background: chip.bg, color: chip.text, borderColor: chip.border }}
                                      onClick={() => openEdit(slot)}
                                    >
                                      <span className="font-medium truncate max-w-[140px]">{slot.subject}</span>
                                      <span className="text-slate-400 shrink-0">{slot.class?.class_name ?? ""}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            }
                          >
                            <button className="w-full text-[10px] text-blue-500 hover:text-blue-700 text-center py-0.5 rounded hover:bg-blue-50">
                              +{cellSlots.length - 4} more
                            </button>
                          </Popover>
                        )}
                        </div>

                        {/* Add button (only for teaching periods) */}
                        {period.isTeaching && (
                          <Popover
                            open={isAddOpen}
                            trigger="click"
                            placement="right"
                            onOpenChange={(open) => { if (!open) closePopover(); }}
                            content={
                              isAddOpen ? (
                                <SlotForm
                                  subjects={subjects}
                                  teachers={teachers}
                                  years={years}
                                  classes={classes}
                                  onYearChange={(y) => setFormYear(y)}
                                  onSave={handleFormSave}
                                  onCancel={closePopover}
                                  loading={addMutation.isPending}
                                  conflicts={formConflicts}
                                />
                              ) : null
                            }
                          >
                            <button
                              className="w-full mt-0.5 rounded border border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-0.5 py-0.5"
                              onClick={() => openAdd(day, period)}
                            >
                              <PlusOutlined style={{ fontSize: 9 }} />
                              <span className="text-[10px]">Add</span>
                            </button>
                          </Popover>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Legend */}
      <div className="max-w-screen-xl mx-auto mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span>🔴</span> Hard conflict (teacher/class double-booked)</span>
        <span className="flex items-center gap-1"><span>🟡</span> Soft conflict (room double-booked)</span>
        <span className="flex items-center gap-1 ml-auto">
          <a href="/dashboard/time_table" className="text-blue-500 hover:underline">← Calendar view</a>
        </span>
      </div>

      {/* Modals */}
      <PeriodsConfigModal
        open={periodsModalOpen}
        onClose={() => setPeriodsModalOpen(false)}
        periods={periods}
        schoolDays={schoolDays}
        onChange={(p, d) => { savePeriods(p); setPeriods(p); saveSchoolDays(d); setSchoolDays(d); }}
      />
      <DuplicateWeekModal
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
        sourceWeek={weekSun}
        allSlots={slots}
        onConfirm={handleDuplicate}
      />

      {/* Reset confirmation modal */}
      <Modal
        open={!!resetScope}
        title={resetScope === "week" ? "Reset This Week" : "Reset Entire Timetable"}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        onCancel={() => setResetScope(null)}
        onOk={confirmReset}
      >
        {resetScope === "week" && (
          <p>This will permanently delete all <strong>{slotsForWeek(slots, weekSun).length} slot{slotsForWeek(slots, weekSun).length !== 1 ? "s" : ""}</strong> in <strong>{weekLabel(weekSun)}</strong>. This cannot be undone.</p>
        )}
        {resetScope === "all" && (
          <p>This will permanently delete <strong>all {(slots as any[]).length} slot{(slots as any[]).length !== 1 ? "s" : ""}</strong> across the entire timetable. This cannot be undone.</p>
        )}
      </Modal>
    </div>
  );
}
