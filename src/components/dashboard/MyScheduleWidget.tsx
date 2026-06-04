"use client";

import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Form, Modal, message, Spin, DatePicker } from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTimetableData,
  addTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} from "@/services/timetableApi";
import { fetchTeachers } from "@/services/teacherApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import TimetableModal from "@/components/dashboard/TimetableModal";
import type { User } from "@/features/auth/types";

// ── Event colour palette ──────────────────────────────────────────────────────
const EVENT_COLORS = [
  { bg: "#fff7ed", border: "#f97316", text: "#9a3412", accent: "#f97316" }, // orange
  { bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a", accent: "#3b82f6" }, // blue
  { bg: "#f5f3ff", border: "#8b5cf6", text: "#4c1d95", accent: "#8b5cf6" }, // violet
  { bg: "#fff1f2", border: "#ec4899", text: "#831843", accent: "#ec4899" }, // pink
  { bg: "#f0fdfa", border: "#14b8a6", text: "#134e4a", accent: "#14b8a6" }, // teal
  { bg: "#fefce8", border: "#f59e0b", text: "#92400e", accent: "#f59e0b" }, // amber
  { bg: "#eef2ff", border: "#6366f1", text: "#312e81", accent: "#6366f1" }, // indigo
  { bg: "#f0fdf4", border: "#10b981", text: "#064e3b", accent: "#10b981" }, // emerald
];

const NAME_COLOR_MAP: Record<string, number> = {
  arabic: 0,
  "al arabiyya": 0,
  islamic: 4,
  islamiat: 4,
  quran: 5,
  english: 1,
  math: 6,
  maths: 6,
  mathematics: 6,
  science: 7,
  history: 3,
  jpt: 2,
};

function getEventColor(title: string, idx: number) {
  const t = (title || "").toLowerCase();
  for (const [key, colorIdx] of Object.entries(NAME_COLOR_MAP)) {
    if (t.includes(key)) return EVENT_COLORS[colorIdx];
  }
  return EVENT_COLORS[idx % EVENT_COLORS.length];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ── Props ─────────────────────────────────────────────────────────────────────
interface MyScheduleWidgetProps {
  currentUser: User | null;
  isStudent: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MyScheduleWidget({ currentUser, isStudent }: MyScheduleWidgetProps) {
  const role = String(currentUser?.role || "").trim().toUpperCase();
  const isTeacher = role === "TEACHER";
  const isHOD = role === "HOD";
  const isTeacherOrHOD = isTeacher || isHOD;
  const schoolId = currentUser?.school;

  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; eventId?: string | null }>({
    open: false,
  });
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [form] = Form.useForm();

  const queryRange = useMemo(() => ({
    dateFrom: selectedDate.startOf("week").format("YYYY-MM-DD"),
    dateTo: selectedDate.endOf("week").format("YYYY-MM-DD"),
  }), [selectedDate]);

  // ── Fetch all timetable data ──────────────────────────────────────────────
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ["timetable", "widget", "all", queryRange.dateFrom, queryRange.dateTo],
    queryFn: () => fetchTimetableData("all", queryRange),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    select: (res: any) =>
      (res || []).map((item: any) => ({
        id: item.id,
        title: item.subject || "Untitled",
        date: item.date,
        startTime: dayjs(item.start_time, "HH:mm:ss").format("HH:mm"),
        endTime: dayjs(item.end_time, "HH:mm:ss").format("HH:mm"),
        teacher: item?.teacher?.teacher_name || "N/A",
        teacher_id: item?.teacher_id ? Number(item.teacher_id) : null,
        teacher_user_id: item?.teacher?.user_id ? Number(item.teacher.user_id) : null,
        room: item.room || "",
        zoomLink: item.zoom_link || "",
        year_id: item.year_id ? Number(item.year_id) : null,
        class_id: item.class_id ? Number(item.class_id) : null,
      })),
  });

  // ── Fetch teachers list (to resolve current teacher's record ID) ──────────
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers", "schedule-widget"],
    queryFn: () => fetchTeachers("all"),
    enabled: isTeacherOrHOD,
    staleTime: 5 * 60 * 1000,
  });

  // Resolve "my teacher record ID" so we can filter my personal slots
  const myTeacherId = useMemo(() => {
    if (!isTeacher || !currentUser?.id) return null;
    const me = (teachers as any[]).find(
      (t) => Number(t.user_id) === Number(currentUser.id)
    );
    return me ? Number(me.id) : null;
  }, [teachers, currentUser?.id, isTeacher]);

  // ── Years & classes (for TimetableModal dropdowns) ────────────────────────
  const { data: yearsData = [] } = useQuery({
    queryKey: ["years-schedule-widget", currentUser?.id],
    enabled: slotModalOpen && !isStudent,
    queryFn: async (): Promise<any[]> => {
      if (isTeacherOrHOD) {
        const res = await fetchAssignYears();
        const years = res.map((item: any) => item?.classes?.year).filter(Boolean);
        return Array.from(new Map(years.map((y: any) => [y.id, y])).values()) as any[];
      }
      return fetchYearsBySchool(schoolId as number) as Promise<any[]>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: classesData = [] } = useQuery({
    queryKey: ["classes-schedule-widget", selectedYear, currentUser?.id],
    enabled: slotModalOpen && !!selectedYear && !isStudent,
    queryFn: async (): Promise<any[]> => {
      if (isTeacherOrHOD) {
        const res = await fetchAssignYears();
        const all = res.map((item: any) => item.classes).filter(Boolean);
        const unique = Array.from(new Map(all.map((c: any) => [c.id, c])).values()) as any[];
        return unique.filter((c) => c.year_id === Number(selectedYear));
      }
      return fetchClasses(selectedYear!) as Promise<any[]>;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Auto-pick first year/class for modal
  useEffect(() => {
    if (!slotModalOpen) return;
    if ((yearsData as any[]).length > 0 && !selectedYear) {
      setSelectedYear(String((yearsData as any[])[0].id));
    }
  }, [slotModalOpen, yearsData, selectedYear]);

  useEffect(() => {
    if (!slotModalOpen) return;
    if ((classesData as any[]).length > 0 && !selectedClass) {
      setSelectedClass(String((classesData as any[])[0].id));
    }
  }, [slotModalOpen, classesData, selectedClass]);

  // ── Filter events for selected date + user role ───────────────────────────
  const todayEvents = useMemo(() => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    return (allEvents as any[])
      .filter((event) => {
        if (event.date !== dateStr) return false;
        // Teachers see only their own slots
        if (isTeacher && myTeacherId != null) {
          return event.teacher_id === myTeacherId;
        }
        // Students see only their class slots
        if (isStudent && currentUser?.studentClass) {
          return event.class_id === Number(currentUser.studentClass);
        }
        // HODs and admins see all
        return true;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [allEvents, selectedDate, isTeacher, myTeacherId, isStudent, currentUser?.studentClass]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (data: Parameters<typeof addTimetableSlot>[0]) => addTimetableSlot(data),
    onSuccess: () => {
      messageApi.success("Slot added successfully");
      queryClient.invalidateQueries(["timetable"] as any);
      setSlotModalOpen(false);
      form.resetFields();
    },
    onError: (err: any) =>
      messageApi.error(err?.response?.data?.message || "Failed to add slot"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTimetableSlot(id, data),
    onSuccess: () => {
      messageApi.success("Slot updated successfully");
      queryClient.invalidateQueries(["timetable"] as any);
      setSlotModalOpen(false);
      form.resetFields();
      setIsEditMode(false);
      setCurrentEventId(null);
    },
    onError: (err: any) =>
      messageApi.error(err?.response?.data?.message || "Failed to update slot"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimetableSlot,
    onSuccess: () => {
      messageApi.success("Slot deleted");
      queryClient.invalidateQueries(["timetable"] as any);
      setDeleteModal({ open: false });
    },
    onError: () => messageApi.error("Failed to delete slot"),
  });

  // ── Modal handlers ────────────────────────────────────────────────────────
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentEventId(null);
    setSelectedClass(null);
    form.resetFields();
    form.setFieldsValue({ date: selectedDate });
    setSlotModalOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setSelectedYear(event.year_id ? String(event.year_id) : null);
    setSelectedClass(event.class_id ? String(event.class_id) : null);
    form.setFieldsValue({
      subject: event.title,
      year: event.year_id,
      teacher: event.teacher_id,
      class: event.class_id,
      room: event.room,
      date: dayjs(event.date),
      start_time: dayjs(event.startTime, "HH:mm"),
      end_time: dayjs(event.endTime, "HH:mm"),
      zoom_link: event.zoomLink || "",
    });
    setIsEditMode(true);
    setCurrentEventId(String(event.id));
    setSlotModalOpen(true);
  };

  const handleSubmitSlot = async () => {
    try {
      const values = await form.validateFields();
      const date = values.date.format("YYYY-MM-DD");
      const payload = {
        subject: values.subject,
        year_id: values.year,
        teacher_id: values.teacher || currentUser?.id,
        class_id: values.class,
        room: values.room,
        date,
        day: DAYS[values.date.day()],
        start_time: values.start_time.format("HH:mm"),
        end_time: values.end_time.format("HH:mm"),
        zoom_link: values.zoom_link,
        school_id: schoolId ?? undefined,
      };
      if (isEditMode && currentEventId) {
        updateMutation.mutate({ id: currentEventId, data: payload });
      } else {
        addMutation.mutate(payload);
      }
    } catch {
      // antd shows inline validation errors
    }
  };

  const isToday = selectedDate.isSame(dayjs(), "day");
  const isWeekend = selectedDate.day() === 5 || selectedDate.day() === 6;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-[0_10px_24px_rgba(66,66,83,0.06)]">
      {contextHolder}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 px-3 py-2">
        {/* Title */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #38C16C, var(--primary))" }}
          >
            <CalendarOutlined style={{ fontSize: 14 }} />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-[13px] leading-tight">My Schedule</p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {isToday ? "Today's classes" : selectedDate.format("dddd")}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Date navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedDate((d) => d.subtract(1, "day"))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200
                       text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <LeftOutlined style={{ fontSize: 11 }} />
          </button>

          <DatePicker
            value={selectedDate}
            onChange={(val) => val && setSelectedDate(val)}
            format="ddd, D MMM YYYY"
            allowClear={false}
            size="small"
            className="!h-7 !w-[170px]"
            inputReadOnly
          />

          <button
            onClick={() => setSelectedDate((d) => d.add(1, "day"))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200
                       text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <RightOutlined style={{ fontSize: 11 }} />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(dayjs())}
              className="rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors hover:opacity-80"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            >
              Today
            </button>
          )}
        </div>

        {/* Add slot — non-students only */}
        {!isStudent && (
          <button
            onClick={openAddModal}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold
                       text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--primary)" }}
          >
            <PlusOutlined />
            Add Slot
          </button>
        )}
      </div>

      {/* ── Event grid ──────────────────────────────────────────────── */}
      <div className="min-h-[108px] p-2">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : todayEvents.length === 0 ? (
          <div className="flex h-24 flex-col items-center justify-center gap-1.5 text-slate-400">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-2xl"
              style={{ background: "var(--theme-soft, #f8fafc)" }}
            >
              <CalendarOutlined style={{ fontSize: 16, opacity: 0.5 }} />
            </div>
            <p className="text-center text-xs font-medium text-slate-400">
              {isWeekend
                ? "Weekend — no classes scheduled"
                : `No slots for ${selectedDate.format("dddd, D MMMM")}`}
            </p>
            {!isStudent && !isWeekend && (
              <button
                onClick={openAddModal}
                className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                + Add a slot
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {todayEvents.map((event: any, idx: number) => {
              const c = getEventColor(event.title, idx);
              return (
                <div
                  key={event.id}
                  className="rounded-xl p-2.5 transition-all hover:shadow-md"
                  style={{
                    background: c.bg,
                    border: `1.5px solid ${c.border}30`,
                    borderLeft: `3px solid ${c.accent}`,
                  }}
                >
                  {/* Time badge + action buttons */}
                  <div className="mb-1.5 flex items-center justify-between gap-1">
                    <span
                      className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ background: `${c.accent}18`, color: c.accent }}
                    >
                      {event.startTime} – {event.endTime}
                    </span>
                    {!isStudent && (
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex h-5 w-5 items-center justify-center rounded-md
                                     text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit slot"
                        >
                          <EditOutlined style={{ fontSize: 11 }} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, eventId: String(event.id) })
                          }
                          className="flex h-5 w-5 items-center justify-center rounded-md
                                     text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete slot"
                        >
                          <DeleteOutlined style={{ fontSize: 11 }} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subject name */}
                  <p className="mb-1 truncate text-[13px] font-bold leading-tight" style={{ color: c.text }}>
                    {event.title}
                  </p>

                  {/* Meta */}
                  <div className="space-y-0.5">
                    {event.teacher && event.teacher !== "N/A" && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <span role="img" aria-label="teacher">👤</span>
                        <span className="truncate">{event.teacher}</span>
                      </p>
                    )}
                    {event.room && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <span role="img" aria-label="room">🏫</span>
                        <span className="truncate">{event.room}</span>
                      </p>
                    )}
                    {event.zoomLink && (
                      <a
                        href={event.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium underline block truncate"
                        style={{ color: c.accent }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 Join Zoom
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderTop: "1px solid #e2e8f0" }}
      >
        <p className="text-[11px] text-slate-400">
          {todayEvents.length} slot{todayEvents.length !== 1 ? "s" : ""}
          {isToday ? " today" : ` on ${selectedDate.format("D MMM")}`}
        </p>
        <Link
          href="/dashboard/time_table?view=calendar"
          className="text-[11px] font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          View Full Timetable →
        </Link>
      </div>

      {/* ── Add / Edit modal ────────────────────────────────────────── */}
      {!isStudent && (
        <TimetableModal
          isModalVisible={slotModalOpen}
          isEditMode={isEditMode}
          onCancel={() => {
            setSlotModalOpen(false);
            form.resetFields();
            setIsEditMode(false);
            setCurrentEventId(null);
          }}
          onSubmit={handleSubmitSlot}
          form={form}
          yearsData={yearsData as any[]}
          classesData={classesData as any[]}
          teachers={teachers as any[]}
          isTeacher={isTeacherOrHOD}
          handleYearChange={(v) => setSelectedYear(v)}
        />
      )}

      {/* ── Delete confirmation ──────────────────────────────────────── */}
      <Modal
        title="Confirm Delete"
        open={deleteModal.open}
        onOk={() => deleteModal.eventId && deleteMutation.mutate(deleteModal.eventId)}
        onCancel={() => setDeleteModal({ open: false })}
        okText="Delete"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Are you sure you want to delete this timetable slot?</p>
      </Modal>
    </div>
  );
}
