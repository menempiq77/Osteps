"use client";
import dynamic from "next/dynamic";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg, DateSelectArg, type EventApi } from "@fullcalendar/core";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addTimetableSlot,
  deleteTimetableSlot,
  fetchTimetableData,
  updateTimetableSlot,
} from "@/services/timetableApi";
import {
  Modal,
  Form,
  Select,
  message,
  Spin,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  CalendarOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTeachers } from "@/services/teacherApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TimetableModal from "@/components/dashboard/TimetableModal";
import TimetableModeTabs from "@/components/timetable/TimetableModeTabs";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { asRecord, toRecord, errorMessage } from "@/lib/safeRecord";

const TimetableImportModal = dynamic(
  () => import("@/components/dashboard/TimetableImportModal"),
  { ssr: false }
);

const { Option } = Select;

// View-by tab definitions
type ViewByMode = "subject" | "class" | "teacher";

const VIEW_TABS: { key: ViewByMode; label: string; icon: React.ReactNode }[] = [
  { key: "subject",  label: "Subject",  icon: <BookOutlined /> },
  { key: "class",    label: "Class",    icon: <TeamOutlined /> },
  { key: "teacher",  label: "Teacher",  icon: <UserOutlined /> },
];

function Timetable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const calendarView = searchParams.get("view") === "calendar";
  const subjectId = searchParams.get("subject_id");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventApi | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";
  const [teachers, setTeachers] = useState<Record<string, unknown>[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const { activeSubjectId, subjects } = useSubjectContext();
  const [importModalOpen, setImportModalOpen] = useState(false);

  useEffect(() => {
    if (calendarView) return;

    const params = new URLSearchParams();
    if (subjectId) params.set("subject_id", subjectId);
    const query = params.toString();
    router.replace(`/dashboard/timetable-builder${query ? `?${query}` : ""}`);
  }, [calendarView, router, subjectId]);

  // "View By" tab state
  const [viewBy, setViewBy] = useState<ViewByMode>("subject");

  // Subject filter for server-side fetch
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>(
    activeSubjectId ? String(activeSubjectId) : "all"
  );

  const { data: events = [], isLoading: isTimetableLoading } = useQuery({
    queryKey: ["timetable", selectedSubjectFilter],
    queryFn: () =>
      fetchTimetableData(selectedSubjectFilter === "all" ? "all" : Number(selectedSubjectFilter)),
    select: (res) =>
      res?.map((item: Record<string, unknown>) => ({
        title: String(item.subject || ""),
        start: `${String(item.date || "")}T${dayjs(String(item.start_time), "HH:mm:ss").format("HH:mm:ss")}`,
        end:   `${String(item.date || "")}T${dayjs(String(item.end_time),   "HH:mm:ss").format("HH:mm:ss")}`,
        extendedProps: {
          id:         item.id,
          teacher:    asRecord(item?.teacher)?.teacher_name || "N/A",
          teacher_id: item?.teacher_id || null,
          room:       item.room || "N/A",
          zoomLink:   item?.zoom_link,
          year_id:    item?.year_id || null,
          class_id:   item?.class_id || null,
        },
      })) || [],
  });

  const schoolId = currentUser?.school;

  // All classes across all years — used by the Import modal for fuzzy matching
  const { data: allClassesForImport = [] } = useQuery({
    queryKey: ["all-classes-timetable-import", schoolId, currentUser?.id],
    enabled: !isStudent,
    queryFn: async (): Promise<Record<string, unknown>[]> => {
      if (!schoolId) return [];
      if (isTeacher) {
        const res = (await fetchAssignYears()) as Record<string, unknown>[];
        const raw = res.map((item) => asRecord(item?.classes)).filter(Boolean) as Record<string, unknown>[];
        return Array.from(new Map(raw.map((c) => [String(c.id), c])).values())
          .map((c) => ({
            id: Number(c.id),
            year_id: Number(c.year_id ?? 0) || undefined,
            class_name: String(c.class_name || (c.id ?? "")),
            year_name: asRecord(c.year)?.name,
          }));
      }
      const years: Record<string, unknown>[] = (await fetchYearsBySchool(schoolId as number)) ?? [];
      const arrays = await Promise.all(
        years.map((y) => fetchClasses(String(y.id)).catch(() => []))
      );
      return (arrays.flat() as Record<string, unknown>[]).map((c) => ({
        id: Number(c.id),
        year_id: Number(c.year_id ?? 0) || undefined,
        class_name: String(c.class_name || (c.id ?? "")),
        year_name: years.find((y) => String(y.id) === String(c.year_id))?.name,
      }));
    },
  });

  // Client-side filter (class / teacher view)
  const filteredEvents = useMemo(() => {
    return events.filter((event: Record<string, unknown>) => {
      const p = event.extendedProps;
      if (viewBy === "class") {
        const yearMatch  = !selectedYear  ||toRecord(p).year_id  === Number(selectedYear);
        const classMatch = !selectedClass ||toRecord(p).class_id === Number(selectedClass);
        return yearMatch && classMatch;
      }
      if (viewBy === "teacher") {
        return !selectedTeacher ||toRecord(p).teacher_id === Number(selectedTeacher);
      }
      // "subject" — server already filtered; no extra client filter
      return true;
    });
  }, [events, viewBy, selectedYear, selectedClass, selectedTeacher]);

  // Fetch years
  const { data: yearsData = [] } = useQuery({
    queryKey: ["years", currentUser?.id],
    queryFn: async (): Promise<Record<string, unknown>[]> => {
      if (isTeacher) {
        const res = (await fetchAssignYears()) as Record<string, unknown>[];
        const years = res
          .map((item) => asRecord(item?.classes)?.year)
          .filter((y): y is Record<string, unknown> => !!y && typeof y === "object");
        return Array.from(new Map(years.map((y) => [String(y.id), y])).values());
      }
      return (await fetchYearsBySchool(Number(schoolId))) as Record<string, unknown>[];
    },
  });

  // Only show years that have at least one real class configured
  const yearIdsWithClasses = useMemo(
    () => new Set((allClassesForImport as Record<string, unknown>[]).map((c) => String(c.year_id)).filter(Boolean)),
    [allClassesForImport]
  );
  const filteredYearsData = useMemo(
    () => yearIdsWithClasses.size > 0
      ? (yearsData as Record<string, unknown>[]).filter((y) => yearIdsWithClasses.has(String(y.id)))
      : yearsData,
    [yearsData, yearIdsWithClasses]
  );

  // Fetch classes (depends on selectedYear)
  const { data: classesData = [] } = useQuery({
    queryKey: ["classes", selectedYear, currentUser?.id],
    enabled: !!selectedYear,
    queryFn: async (): Promise<Record<string, unknown>[]> => {
      if (isTeacher) {
        const res = (await fetchAssignYears()) as Record<string, unknown>[];
        const all = res.map((item) => asRecord(item?.classes)).filter(Boolean) as Record<string, unknown>[];
        const unique = Array.from(new Map(all.map((c) => [String(c.id), c])).values()) as Record<string, unknown>[];
        return unique.filter((c) => Number(c.year_id) === Number(selectedYear));
      }
      return (await fetchClasses(String(selectedYear))) as Record<string, unknown>[];
    },
  });

  // classesData already comes from fetchClasses which only returns existing classes
  const filteredClassesData = classesData;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchTeachers();
        setTeachers(res);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addMutation = useMutation({
    mutationFn: (payload: Parameters<typeof addTimetableSlot>[0]) =>
      addTimetableSlot(
        payload,
        selectedSubjectFilter === "all" ? undefined : Number(selectedSubjectFilter)
      ),
    onSuccess: () => {
      messageApi.success("Event added successfully");
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: unknown) => {       messageApi.error(errorMessage(error, "Failed to add event"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTimetableSlot>[1] }) =>
      updateTimetableSlot(id, data),
    onSuccess: () => {
      messageApi.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      setIsModalVisible(false);
      form.resetFields();
      setIsEditMode(false);
      setCurrentEventId(null);
    },
    onError: (error: unknown) => {       messageApi.error(errorMessage(error, "Failed to update event"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimetableSlot,
    onSuccess: () => {
      messageApi.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
      setIsDeleteModalVisible(false);
    },
    onError: () => {
      messageApi.error("Failed to delete event");
    },
  });

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const startStr = String(selectInfo.startStr || "");
    const endStr = String(selectInfo.endStr || "");
    form.setFieldsValue({
      date:       dayjs(startStr.split("T")[0]),
      start_time: dayjs(startStr.split("T")[1], "HH:mm:ss"),
      end_time:   dayjs(endStr.split("T")[1],   "HH:mm:ss"),
    });
    setIsModalVisible(true);
  };

  const handleAddEvent = async () => {
    try {
      const values  = await form.validateFields();
      const dateObj = values.date as Dayjs;
      const date    = dateObj.format("YYYY-MM-DD");
      const days    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const dayName = days[dateObj.day()];
      const payload: Parameters<typeof addTimetableSlot>[0] = {
        subject:    String(values.subject ?? ""),
        year_id:    String(values.year ?? ""),
        teacher_id: values.teacher
          ? String(values.teacher)
          : String(currentUser?.id ?? ""),
        class_id:   String(values.class ?? ""),
        room:       String(values.room ?? ""),
        date,
        day:        dayName,
        start_time: (values.start_time as Dayjs).format("HH:mm"),
        end_time:   (values.end_time as Dayjs).format("HH:mm"),
        zoom_link:  String(values.zoom_link ?? ""),
        school_id:  schoolId ?? undefined,
      };
      if (isEditMode && currentEventId) {
        updateMutation.mutate({ id: currentEventId, data: payload });
      } else {
        addMutation.mutate(payload);
      }
    } catch {
      // antd shows inline errors
    }
  };

  const handleEditEvent = (event: EventApi) => {
    const p = event.extendedProps;
    const startStr = String(event.startStr || "");
    const endStr = String(event.endStr || "");
    form.setFieldsValue({
      subject:    event.title,
      year:       toRecord(p).year_id,
      teacher:    toRecord(p).teacher_id,
      class:      toRecord(p).class_id,
      room:       toRecord(p).room,
      date:       dayjs(startStr.split("T")[0]),
      start_time: dayjs(startStr.split("T")[1], "HH:mm:ss"),
      end_time:   dayjs(endStr.split("T")[1],   "HH:mm:ss"),
      zoom_link:  toRecord(p).zoomLink || "",
    });
    setIsEditMode(true);
    setCurrentEventId(String(toRecord(p).id || ""));
    setIsModalVisible(true);
  };

  const handleDeleteEvent = (event: EventApi) => {
    setEventToDelete(event);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (!eventToDelete) return;
    const eventProps = asRecord(eventToDelete.extendedProps);
    deleteMutation.mutate(String(eventProps?.id || eventToDelete.id));
  };

  const handleExport = async () => {
    const exportedEvents = filteredEvents.map((ev: Record<string, unknown>) => ({
      subject: ev.title || "",
      date: (ev.start as string).split("T")[0],
      startTime: (ev.start as string).split("T")[1]?.substring(0, 5) || "",
      endTime: (ev.end as string)?.split("T")[1]?.substring(0, 5) || "",
      teacher: asRecord(ev.extendedProps)?.teacher || "",       room: asRecord(ev.extendedProps)?.room || "",
      className:
        (allClassesForImport as Record<string, unknown>[]).find(           (c) => Number(c.id) === asRecord(ev.extendedProps)?.class_id
        )?.class_name || "",
    }));
    const label =
      selectedSubjectFilter !== "all"
        ? (subjects.find((s) => String(s.id) === selectedSubjectFilter)?.name
            ?.replace(/islamiat/gi, "Islamic")
            .replace(/\s+/g, "_") ?? "timetable")
        : "school_timetable";
    const { exportTimetableToExcel } = await import("@/lib/timetableExport");
    exportTimetableToExcel(exportedEvents, label);
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div
      className="relative overflow-hidden rounded p-1.5 h-full"
      style={{ background: "var(--primary)", color: "#fff" }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="font-bold text-xs leading-tight truncate">{eventInfo.event.title}</p>
          <p className="text-[10px] opacity-80 truncate mt-0.5">
            {eventInfo.event.extendedProps.teacher}
          </p>
          <p className="text-[10px] opacity-70 truncate">
            {eventInfo.event.extendedProps.room}
          </p>
        </div>
        {!isStudent && (
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); handleEditEvent(eventInfo.event); }}
              className="opacity-80 hover:opacity-100"
              title="Edit"
            >
              <EditOutlined style={{ fontSize: 10 }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteEvent(eventInfo.event); }}
              className="opacity-80 hover:opacity-100 text-red-200"
              title="Delete"
            >
              <DeleteOutlined style={{ fontSize: 10 }} />
            </button>
          </div>
        )}
      </div>
      {eventInfo.event.extendedProps.zoomLink && (
        <a
          href={eventInfo.event.extendedProps.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] underline opacity-80 hover:opacity-100 mt-0.5 block"
          onClick={(e) => e.stopPropagation()}
        >
          Join Zoom
        </a>
      )}
    </div>
  );

  if (isTimetableLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!calendarView) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {contextHolder}

      <div className="max-w-screen-xl mx-auto space-y-4">
        <TimetableModeTabs activeTab="calendar" />

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--primary)" }}
            >
              <CalendarOutlined style={{ fontSize: 18 }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">School Timetable</h1>
              <p className="text-xs text-slate-500">
                View &amp; manage schedules by subject, class, or teacher.
              </p>
            </div>
          </div>
          {!isStudent && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Export */}
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold
                         transition-all hover:opacity-90 active:scale-95 border"
                style={{
                  background: "var(--theme-soft)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-dark)",
                }}
                title="Export current view to Excel"
              >
                <DownloadOutlined />
                Export
              </button>
              {/* Import */}
              <button
                onClick={() => setImportModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold
                         transition-all hover:opacity-90 active:scale-95 border"
                style={{
                  background: "var(--theme-soft)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-dark)",
                }}
                title="Import timetable from CSV or Excel"
              >
                <UploadOutlined />
                Import
              </button>
              {/* Add Slot */}
              <button
                onClick={() => { setIsEditMode(false); setCurrentEventId(null); form.resetFields(); setIsModalVisible(true); }}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white
                         transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--primary)" }}
              >
                <PlusOutlined />
                Add Slot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── View-by filter panel ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        {/* Tab row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            View By
          </span>
          <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--theme-soft)" }}>
            {VIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setViewBy(tab.key)}
                className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold
                           transition-all duration-150"
                style={
                  viewBy === tab.key
                    ? { background: "var(--primary)", color: "#fff", boxShadow: "0 2px 8px var(--theme-shadow)" }
                    : { color: "var(--theme-dark)", background: "transparent" }
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Context-sensitive sub-filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viewBy === "subject" && (
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
              <Select
                value={selectedSubjectFilter}
                onChange={(val) => setSelectedSubjectFilter(val)}
                className="w-full"
                size="large"
              >
                <Option value="all">All Subjects</Option>
                {subjects.map((s) => (
                  <Option key={s.id} value={String(s.id)}>
                    {String(s.name).replace(/islamiat/gi, "Islamic")}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {viewBy === "class" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Year</label>
                <Select
                  value={selectedYear || undefined}
                  onChange={(v) => setSelectedYear(v)}
                  className="w-full"
                  placeholder="All Years"
                  allowClear
                  size="large"
                >
                  {filteredYearsData.map((year: Record<string, unknown>) => (
                    <Option key={String(year.id)} value={String(year.id)}>{String(year.name)}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Class</label>
                <Select
                  value={selectedClass || undefined}
                  onChange={(v) => setSelectedClass(v)}
                  className="w-full"
                  placeholder="All Classes"
                  allowClear
                  size="large"
                >
                  {filteredClassesData.map((cls: Record<string, unknown>) => (
                    <Option key={String(cls.id)} value={String(cls.id)}>{String(cls.class_name)}</Option>
                  ))}
                </Select>
              </div>
            </>
          )}

          {viewBy === "teacher" && !isTeacher && (
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Teacher</label>
              <Select
                value={selectedTeacher || undefined}
                onChange={(v) => setSelectedTeacher(v)}
                className="w-full"
                placeholder="All Teachers"
                allowClear
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {teachers.map((t) => (
                  <Option key={String(t.id)} value={String(t.id)}>{String(t.teacher_name)}</Option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* Active filter summary chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {viewBy === "subject" && selectedSubjectFilter !== "all" && (() => {
            const subj = subjects.find((s) => String(s.id) === selectedSubjectFilter);
            return subj ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                <BookOutlined style={{ fontSize: 10 }} />
                {String(subj.name).replace(/islamiat/gi, "Islamic")}
                <button onClick={() => setSelectedSubjectFilter("all")} className="opacity-70 hover:opacity-100 ml-1">✕</button>
              </span>
            ) : null;
          })()}
          {viewBy === "class" && selectedClass && (() => {
            const cls = classesData.find((c: Record<string, unknown>) => String(c.id) === selectedClass);
            const yr  = yearsData.find((y: Record<string, unknown>) => String(y.id) === selectedYear);
            return cls ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                <TeamOutlined style={{ fontSize: 10 }} />
                {yr ? `${String(yr.name)} — ` : ""}{String(cls.class_name)}
                <button onClick={() => { setSelectedClass(null); }} className="opacity-70 hover:opacity-100 ml-1">✕</button>
              </span>
            ) : null;
          })()}
          {viewBy === "teacher" && selectedTeacher && (() => {
            const t = teachers.find((t) => String(t.id) === selectedTeacher);
            return t ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                <UserOutlined style={{ fontSize: 10 }} />
                {String(t.teacher_name)}
                <button onClick={() => setSelectedTeacher("")} className="opacity-70 hover:opacity-100 ml-1">✕</button>
              </span>
            ) : null;
          })()}
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-slate-500"
                style={{ background: "var(--theme-soft)", border: "1px solid var(--theme-border)" }}>
            {filteredEvents.length} slot{filteredEvents.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Calendar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left:   "prev,next today",
            center: "title",
            right:  "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={filteredEvents}
          eventContent={renderEventContent}
          editable={!isStudent}
          selectable={!isStudent}
          select={handleDateSelect}
          nowIndicator={true}
          height="auto"
          allDaySlot={false}
          slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: true, meridiem: "short" }}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: true, meridiem: "short" }}
          expandRows={true}
          contentHeight="auto"
          eventMinHeight={48}
        />
      </div>

      {/* ── Add/Edit modal ────────────────────────────────────────────── */}
      {!isStudent && (
        <TimetableModal
          isModalVisible={isModalVisible}
          isEditMode={isEditMode}
          onCancel={() => { setIsModalVisible(false); form.resetFields(); setIsEditMode(false); setCurrentEventId(null); }}
          onSubmit={handleAddEvent}
          form={form}
          yearsData={yearsData}
          classesData={classesData}
          teachers={teachers}
          isTeacher={isTeacher}
          handleYearChange={(v) => setSelectedYear(v)}
        />
      )}

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Are you sure you want to delete this event?</p>
      </Modal>

      {/* ── Import modal ───────────────────────────────────────────────── */}
      {!isStudent && (
        <TimetableImportModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          teachers={teachers}
          allClasses={allClassesForImport as Record<string, unknown>[]}
          schoolId={schoolId}
          onImported={() => {
            queryClient.invalidateQueries({ queryKey: ["timetable"] });
          }}
        />
      )}
    </div>
  );
}

export default Timetable;