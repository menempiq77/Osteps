"use client";

import dynamic from "next/dynamic";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  Badge, Button, DatePicker, Dropdown, Form, Input, Modal, Popover, Select, Spin,
  Tag, Tooltip, Typography, message,
} from "antd";
import {
  ArrowLeftOutlined, ArrowRightOutlined, CopyOutlined,
  DeleteOutlined, EditOutlined, FilterOutlined, PlusOutlined, SettingOutlined,
  WarningOutlined, ClearOutlined, UploadOutlined,
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
  loadPeriods, savePeriods,
  loadSchoolDays, saveSchoolDays,
  DAYS_OF_WEEK,
  SchoolPeriod,
} from "@/lib/schoolPeriods";
import { detectConflicts, hasHardConflict, hasSoftConflict } from "@/lib/timetableConflicts";
import TimetableManagerSidebar, { TimetableManagerSidebarKey } from "@/components/timetable/TimetableManagerSidebar";
import TimetableModeTabs from "@/components/timetable/TimetableModeTabs";

const TimetableImportModal = dynamic(
  () => import("@/components/timetable/TimetableImportModal"),
  { ssr: false }
);
const PeriodsConfigModal = dynamic(
  () => import("@/components/timetable/PeriodsConfigModal"),
  { ssr: false }
);
const DuplicateWeekModal = dynamic(
  () => import("@/components/timetable/DuplicateWeekModal"),
  { ssr: false }
);

dayjs.extend(isoWeek);

const { Option } = Select;
const { Title, Text } = Typography;

type BuilderSidebarView = "spreadsheets" | "subject" | "teacher" | "year-group";

interface SlotFormValues {
  subject_id: string;
  teacher_id: string;
  year_id?: string;
  class_id: string;
  room?: string;
  zoom_link?: string;
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
  const [importOpen, setImportOpen] = useState(false);

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
  const [sidebarView, setSidebarView] = useState<BuilderSidebarView>("spreadsheets");

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

  const selectedSubject = useMemo(() => {
    if (!filterSubjectId) return null;
    return (subjects as any[]).find((subject: any) => String(subject.id) === filterSubjectId) ?? null;
  }, [filterSubjectId, subjects]);

  // Subject name for the active filter (used as fallback when API omits subject_id on slots)
  const filterSubjectName = selectedSubject?.name ?? null;

  const selectedTeacher = useMemo(() => {
    if (!filterTeacherId) return null;
    return (teachers as any[]).find((teacher: any) => String(teacher.id) === filterTeacherId) ?? null;
  }, [filterTeacherId, teachers]);

  const selectedYearGroup = useMemo(() => {
    if (!filterYearId) return null;
    return (years as any[]).find((year: any) => String(year.id) === filterYearId) ?? null;
  }, [filterYearId, years]);

  const selectedClassGroup = useMemo(() => {
    if (!filterClassId) return null;
    return (filterClasses as any[]).find((klass: any) => String(klass.id) === filterClassId) ?? null;
  }, [filterClassId, filterClasses]);

  useEffect(() => {
    if (sidebarView !== "subject") return;
    if (filterSubjectId) return;
    const firstSubject = (subjects as any[])[0];
    if (!firstSubject) return;
    setFilterSubjectId(String(firstSubject.id));
  }, [sidebarView, filterSubjectId, subjects]);

  useEffect(() => {
    if (sidebarView !== "teacher") return;
    if (filterTeacherId) return;
    const firstTeacher = (teachers as any[])[0];
    if (!firstTeacher) return;
    setFilterTeacherId(String(firstTeacher.id));
  }, [sidebarView, filterTeacherId, teachers]);

  useEffect(() => {
    if (sidebarView !== "year-group") return;
    if (filterYearId) return;
    const firstYear = (yearsInUse as any[])[0] ?? (years as any[])[0];
    if (!firstYear) return;
    setFilterYearId(String(firstYear.id));
  }, [sidebarView, filterYearId, yearsInUse, years]);

  const handleSidebarSelect = useCallback((key: TimetableManagerSidebarKey) => {
    if (key === "subject") {
      setSidebarView("subject");
      setFilterTeacherId(null);
      setFilterYearId(null);
      setFilterClassId(null);
      setFilterSubjectId((current) => {
        if (current) return current;
        const firstSubject = (subjects as any[])[0];
        return firstSubject ? String(firstSubject.id) : null;
      });
      return;
    }

    if (key === "teacher") {
      setSidebarView("teacher");
      setFilterSubjectId(null);
      setFilterYearId(null);
      setFilterClassId(null);
      setFilterTeacherId((current) => {
        if (current) return current;
        const firstTeacher = (teachers as any[])[0];
        return firstTeacher ? String(firstTeacher.id) : null;
      });
      return;
    }

    if (key === "year-group") {
      setSidebarView("year-group");
      setFilterSubjectId(null);
      setFilterTeacherId(null);
      setFilterClassId(null);
      setFilterYearId((current) => {
        if (current) return current;
        const firstYear = (yearsInUse as any[])[0] ?? (years as any[])[0];
        return firstYear ? String(firstYear.id) : null;
      });
      return;
    }

    if (key === "spreadsheets") {
      setSidebarView("spreadsheets");
      setFilterSubjectId(null);
      setFilterTeacherId(null);
      setFilterYearId(null);
      setFilterClassId(null);
    }
  }, [subjects, teachers, yearsInUse, years]);

  // ── Week slots ────────────────────────────────────────────────────────────
  const weekSlots = useMemo(() => {
    if (sidebarView === "subject" && !filterSubjectId) return [];
    if (sidebarView === "teacher" && !filterTeacherId) return [];
    if (sidebarView === "year-group" && !filterYearId) return [];

    let ws = slotsForWeek(slots, weekSun);
    if (filterSubjectId) ws = ws.filter((s: any) =>
      String(s.subject_id) === filterSubjectId ||
      (filterSubjectName && s.subject === filterSubjectName)
    );
    if (filterYearId)    ws = ws.filter((s: any) => String(s.year_id)    === filterYearId);
    if (filterClassId)   ws = ws.filter((s: any) => String(s.class_id)   === filterClassId);
    if (filterTeacherId) ws = ws.filter((s: any) => String(s.teacher_id) === filterTeacherId);
    return ws;
  }, [slots, weekSun, sidebarView, filterSubjectId, filterSubjectName, filterYearId, filterClassId, filterTeacherId]);

  // All week slots unfiltered (used for stats total)
  const weekSlotsAll = useMemo(() => slotsForWeek(slots, weekSun), [slots, weekSun]);

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
        <div className="mb-4">
          <TimetableModeTabs activeTab="timetable" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {sidebarView === "teacher"
                ? "Teacher Timetable"
                : sidebarView === "subject"
                  ? "Subject Timetable"
                : sidebarView === "year-group"
                  ? "Year Group Timetable"
                  : "Timetable Builder"}
            </Title>
            <Text type="secondary" className="text-sm">
              {sidebarView === "teacher"
                ? "Choose a teacher and review the weekly teaching timetable in one spreadsheet."
                : sidebarView === "subject"
                  ? "Choose a subject and review the weekly timetable across all assigned classes."
                : sidebarView === "year-group"
                  ? "Build and review the timetable by year group, then narrow to a class if needed."
                : "Click a cell to add a slot · Click a chip to edit"}
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
            <Button icon={<UploadOutlined />} onClick={() => setImportOpen(true)}>Import</Button>
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

      </div>

      <div className="max-w-screen-xl mx-auto grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
        <TimetableManagerSidebar
          className="xl:sticky xl:top-6"
          referenceDate={weekSun.toDate()}
          activeKey={sidebarView}
          enabledKeys={["spreadsheets", "subject", "teacher", "year-group"]}
          onSelect={handleSidebarSelect}
        />

        <div className="min-w-0 space-y-4">
          {sidebarView === "subject" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-800">View Subject Timetable</div>
                  <div className="text-sm text-slate-500">
                    Focus the weekly spreadsheet on one subject, then narrow to a year group or class if needed.
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="Select a subject"
                    style={{ width: 240 }}
                    value={filterSubjectId ?? undefined}
                    onChange={(value) => {
                      setFilterSubjectId(value ?? null);
                      setFilterYearId(null);
                      setFilterClassId(null);
                    }}
                  >
                    {(subjects as any[]).map((subject: any) => (
                      <Option key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    placeholder="All years"
                    style={{ width: 180 }}
                    value={filterYearId ?? undefined}
                    onChange={(value) => {
                      setFilterYearId(value ?? null);
                      setFilterClassId(null);
                    }}
                  >
                    {(filterSubjectId ? yearsInUse : years).map((year: any) => (
                      <Option key={year.id} value={String(year.id)}>
                        {year.name}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    placeholder="All classes"
                    style={{ width: 220 }}
                    disabled={!filterYearId}
                    value={filterClassId ?? undefined}
                    onChange={(value) => setFilterClassId(value ?? null)}
                  >
                    {filterClasses.map((klass: any) => (
                      <Option key={klass.id} value={String(klass.id)}>
                        {klass.class_name}
                      </Option>
                    ))}
                  </Select>

                  <Button
                    onClick={() => {
                      setSidebarView("spreadsheets");
                      setFilterSubjectId(null);
                      setFilterYearId(null);
                      setFilterClassId(null);
                    }}
                  >
                    Back To Spreadsheets
                  </Button>
                </div>
              </div>

              {selectedSubject ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag color="gold">Subject: {selectedSubject.name}</Tag>
                  {filterYearId ? <Tag color="blue">Year Group: {selectedYearGroup?.name ?? filterYearId}</Tag> : <Tag color="blue">All Years</Tag>}
                  {selectedClassGroup ? <Tag color="cyan">Class: {selectedClassGroup.class_name}</Tag> : <Tag color="cyan">All Classes</Tag>}
                  <Tag color="green">{weekSlots.length} slot{weekSlots.length !== 1 ? "s" : ""} this week</Tag>
                </div>
              ) : (
                <div className="mt-4 text-xs text-slate-500">
                  Select a subject to load the timetable grid.
                </div>
              )}
            </div>
          )}

          {sidebarView === "teacher" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-800">View Teacher Timetable</div>
                  <div className="text-sm text-slate-500">
                    Focus the weekly spreadsheet on one teacher at a time.
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="Select a teacher"
                    style={{ width: 280 }}
                    value={filterTeacherId ?? undefined}
                    onChange={(value) => setFilterTeacherId(value ?? null)}
                  >
                    {(teachers as any[]).map((teacher: any) => (
                      <Option key={teacher.id} value={String(teacher.id)}>
                        {teacher.teacher_name || teacher.name}
                      </Option>
                    ))}
                  </Select>

                  <Button
                    onClick={() => {
                      setSidebarView("spreadsheets");
                      setFilterTeacherId(null);
                    }}
                  >
                    Back To Spreadsheets
                  </Button>
                </div>
              </div>

              {selectedTeacher ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag color="orange">{selectedTeacher.teacher_name || selectedTeacher.name}</Tag>
                  <Tag color="blue">{weekSlots.length} slot{weekSlots.length !== 1 ? "s" : ""} this week</Tag>
                </div>
              ) : (
                <div className="mt-4 text-xs text-slate-500">
                  Select a teacher to load the timetable grid.
                </div>
              )}
            </div>
          )}

          {sidebarView === "year-group" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="text-base font-semibold text-slate-800">View Year Group Timetable</div>
                  <div className="text-sm text-slate-500">
                    Select a year group to manage the timetable for all its classes. Students see slots through their class, and teachers see the lessons assigned to them.
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="Select a year group"
                    style={{ width: 220 }}
                    value={filterYearId ?? undefined}
                    onChange={(value) => {
                      setFilterYearId(value ?? null);
                      setFilterClassId(null);
                    }}
                  >
                    {(yearsInUse.length > 0 ? yearsInUse : years).map((year: any) => (
                      <Option key={year.id} value={String(year.id)}>
                        {year.name}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    placeholder="All classes in year"
                    style={{ width: 220 }}
                    disabled={!filterYearId}
                    value={filterClassId ?? undefined}
                    onChange={(value) => setFilterClassId(value ?? null)}
                  >
                    {filterClasses.map((klass: any) => (
                      <Option key={klass.id} value={String(klass.id)}>
                        {klass.class_name}
                      </Option>
                    ))}
                  </Select>

                  <Button
                    onClick={() => {
                      setSidebarView("spreadsheets");
                      setFilterYearId(null);
                      setFilterClassId(null);
                    }}
                  >
                    Back To Spreadsheets
                  </Button>
                </div>
              </div>

              {selectedYearGroup ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag color="blue">Year Group: {selectedYearGroup.name}</Tag>
                  {selectedClassGroup ? <Tag color="cyan">Class: {selectedClassGroup.class_name}</Tag> : <Tag color="cyan">All Classes</Tag>}
                  <Tag color="green">{weekSlots.length} slot{weekSlots.length !== 1 ? "s" : ""} this week</Tag>
                </div>
              ) : (
                <div className="mt-4 text-xs text-slate-500">
                  Select a year group to load its timetable grid.
                </div>
              )}
            </div>
          )}

          {/* Week label + stats */}
          <div className="flex flex-wrap items-center gap-3">
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
            {sidebarView === "subject" && selectedSubject && (
              <Tag color="gold">Subject: {selectedSubject.name}</Tag>
            )}
            {sidebarView === "teacher" && selectedTeacher && (
              <Tag color="orange">Teacher: {selectedTeacher.teacher_name || selectedTeacher.name}</Tag>
            )}
            {sidebarView === "year-group" && selectedYearGroup && (
              <Tag color="blue">Year Group: {selectedYearGroup.name}</Tag>
            )}
          </div>

          {sidebarView === "spreadsheets" && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <FilterOutlined className="text-slate-400" />
              <span className="mr-1 text-xs font-medium text-slate-500">Filter:</span>

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
          )}

          {/* Grid */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
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
          <div className="flex flex-wrap gap-3 px-1 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span>🔴</span> Hard conflict (teacher/class double-booked)</span>
            <span className="flex items-center gap-1"><span>🟡</span> Soft conflict (room double-booked)</span>
          </div>
        </div>
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
      <TimetableImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        initialWeek={weekSun}
        firstDayIdx={firstDayIdx}
        schoolId={schoolId ?? undefined}
        periods={periods}
        schoolDays={schoolDays}
        subjects={subjects as any[]}
        teachers={teachers as any[]}
        years={years as any[]}
        classes={allClasses as any[]}
        existingSlots={slots as any[]}
        onApplied={invalidate}
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function weekStart(anchor: Dayjs, firstDayIdx: number): Dayjs {
  const anchorDay = anchor.day(); // 0=Sun … 6=Sat
  const diff = (anchorDay - firstDayIdx + 7) % 7;
  return anchor.subtract(diff, "day").startOf("day");
}

function slotsForWeek(slots: any[], weekSun: Dayjs): any[] {
  const from = weekSun.format("YYYY-MM-DD");
  const to = weekSun.add(6, "day").format("YYYY-MM-DD");
  return (slots as any[]).filter((s: any) => s.date >= from && s.date <= to);
}

function dayOffset(day: string, weekSun: Dayjs, firstDayIdx: number): string {
  const dayIdx = DAYS_OF_WEEK.findIndex((d) => d.value === day);
  const offset = (dayIdx - firstDayIdx + 7) % 7;
  return weekSun.add(offset, "day").format("YYYY-MM-DD");
}

function weekLabel(weekSun: Dayjs): string {
  return `${weekSun.format("D MMM")} – ${weekSun.add(6, "day").format("D MMM YYYY")}`;
}

const CHIP_PALETTE = [
  { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
  { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
  { bg: "#fce7f3", text: "#be185d", border: "#f9a8d4" },
  { bg: "#ede9fe", text: "#7c3aed", border: "#c4b5fd" },
  { bg: "#ffedd5", text: "#c2410c", border: "#fdba74" },
  { bg: "#cffafe", text: "#0891b2", border: "#67e8f9" },
  { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
];

function chipColor(subject: string): { bg: string; text: string; border: string } {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = (hash * 31 + subject.charCodeAt(i)) & 0xffffffff;
  }
  return CHIP_PALETTE[Math.abs(hash) % CHIP_PALETTE.length];
}

// ── SlotForm ──────────────────────────────────────────────────────────────────

interface SlotFormProps {
  initial?: SlotFormValues;
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
  initial,
  subjects,
  teachers,
  years,
  classes,
  onYearChange,
  onSave,
  onCancel,
  loading,
  conflicts = [],
}: SlotFormProps) {
  const [form] = Form.useForm<SlotFormValues>();

  useEffect(() => {
    if (initial) {
      form.setFieldsValue(initial);
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const hardConflict = hasHardConflict(conflicts);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initial}
      onFinish={onSave}
      style={{ width: 280 }}
      size="small"
    >
      {conflicts.length > 0 && (
        <div
          className={`mb-2 rounded p-2 text-xs ${
            hardConflict
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }`}
        >
          {conflicts.map((c, i) => (
            <div key={i}>⚠ {c.message}</div>
          ))}
        </div>
      )}

      <Form.Item
        name="subject_id"
        label="Subject"
        rules={[{ required: true, message: "Select a subject" }]}
      >
        <Select placeholder="Subject" showSearch optionFilterProp="children" allowClear>
          {subjects.map((s: any) => (
            <Option key={s.id} value={String(s.id)}>{s.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="teacher_id" label="Teacher">
        <Select placeholder="Teacher" showSearch optionFilterProp="children" allowClear>
          {teachers.map((t: any) => (
            <Option key={t.id} value={String(t.id)}>{t.teacher_name || t.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="year_id" label="Year Group">
        <Select
          placeholder="Year Group"
          showSearch
          optionFilterProp="children"
          allowClear
          onChange={(v: string) => {
            onYearChange(v ?? "");
            form.setFieldValue("class_id", undefined);
          }}
        >
          {years.map((y: any) => (
            <Option key={y.id} value={String(y.id)}>{y.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="class_id" label="Class">
        <Select placeholder="Class" showSearch optionFilterProp="children" allowClear>
          {classes.map((c: any) => (
            <Option key={c.id} value={String(c.id)}>{c.class_name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="room" label="Room">
        <Input placeholder="Room" />
      </Form.Item>

      <Form.Item name="zoom_link" label="Zoom Link">
        <Input placeholder="https://..." />
      </Form.Item>

      <div className="flex justify-end gap-2 mt-1">
        <Button size="small" onClick={onCancel}>Cancel</Button>
        <Button
          size="small"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={hardConflict}
          className="bg-blue-500"
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
