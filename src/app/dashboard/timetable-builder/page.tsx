"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Segmented,
  Select,
  Tooltip,
  message,
} from "antd";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Printer,
  Settings2,
  Users,
  DoorOpen,
  School as SchoolIcon,
  GraduationCap,
  User,
  BookOpen,
  Video,
  AlertTriangle,
  Copy,
} from "lucide-react";
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
import { fetchClasses } from "@/services/classesApi";
import { fetchSubjects } from "@/services/subjectsApi";
import { fetchStudents } from "@/services/studentsApi";
import {
  loadPeriods,
  savePeriods,
  loadSchoolDays,
  saveSchoolDays,
  DAYS_OF_WEEK,
  SchoolPeriod,
} from "@/lib/schoolPeriods";
import {
  loadPattern,
  savePattern,
  weekLabelForDate,
  TimetablePattern,
  WeekLabel,
} from "@/lib/timetablePattern";
import { detectConflicts, hasHardConflict } from "@/lib/timetableConflicts";

const PeriodsConfigModal = dynamic(
  () => import("@/components/timetable/PeriodsConfigModal"),
  { ssr: false }
);

const { Option } = Select;

type ViewMode = "class" | "teacher" | "room" | "school" | "student" | "subject";

interface StudentOption {
  id: number;
  name: string;
  classIds: number[];
  classNames: string[];
}

interface Lesson {
  id: number;
  subject: string;
  year_id: number | null;
  class_id: number | null;
  teacher_id: number | null;
  teacher_name: string;
  room: string;
  zoom_link: string;
  day: string;
  week_label: WeekLabel | null;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
}

interface IdName {
  id: number;
  name?: string;
  class_name?: string;
  teacher_name?: string;
  user_id?: number;
  year_id?: number;
}

const hhmm = (t?: string | null): string => (t ? String(t).slice(0, 5) : "");

const toMinutes = (t: string): number => {
  const [h, m] = hhmm(t).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const mapLesson = (raw: Record<string, unknown>): Lesson => {
  const teacher = (raw.teacher as Record<string, unknown> | undefined) ?? undefined;
  const wl = String(raw.week_label ?? "").toUpperCase();
  return {
    id: Number(raw.id),
    subject: String(raw.subject ?? "").trim(),
    year_id: raw.year_id != null ? Number(raw.year_id) : null,
    class_id: raw.class_id != null ? Number(raw.class_id) : null,
    teacher_id: raw.teacher_id != null ? Number(raw.teacher_id) : null,
    teacher_name: String(teacher?.teacher_name ?? "").trim(),
    room: String(raw.room ?? "").trim(),
    zoom_link: String(raw.zoom_link ?? "").trim(),
    day: String(raw.day ?? "").trim(),
    week_label: wl === "A" || wl === "B" ? (wl as WeekLabel) : null,
    start_time: hhmm(String(raw.start_time ?? "")),
    end_time: hhmm(String(raw.end_time ?? "")),
  };
};

export default function TimetablePage() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const schoolId = currentUser?.school ?? null;
  const role = String(currentUser?.role ?? "").toUpperCase();
  const isAdmin = role === "SCHOOL_ADMIN";
  const isHOD = role === "HOD";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";

  // ── Config (school days / periods / A-B pattern) ──────────────────────────
  const [periods, setPeriods] = useState<SchoolPeriod[]>(() => loadPeriods());
  const [schoolDays, setSchoolDays] = useState<string[]>(() => loadSchoolDays());
  const [pattern, setPattern] = useState<TimetablePattern>(() => loadPattern());
  const [configOpen, setConfigOpen] = useState(false);
  const [patternOpen, setPatternOpen] = useState(false);

  const orderedDays = useMemo(
    () =>
      DAYS_OF_WEEK.map((d) => d.value).filter((d) => schoolDays.includes(d)),
    [schoolDays]
  );

  // Active A/B week (defaults to whatever this calendar week is)
  const [activeWeek, setActiveWeek] = useState<WeekLabel>(() =>
    weekLabelForDate(loadPattern())
  );
  const thisCalendarWeek = useMemo(() => weekLabelForDate(pattern), [pattern]);

  // ── View state ────────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>(
    isTeacher ? "teacher" : "class"
  );
  const [yearId, setYearId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(
    isStudent && currentUser?.studentClass
      ? String(currentUser.studentClass)
      : null
  );
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: rawSlots = [], isLoading } = useQuery({
    queryKey: ["timetable", "all"],
    queryFn: () => fetchTimetableData("all"),
  });
  const lessons = useMemo<Lesson[]>(
    () => (rawSlots as Record<string, unknown>[]).map(mapLesson),
    [rawSlots]
  );

  const { data: subjects = [] } = useQuery<IdName[]>({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(),
  });

  const { data: teachers = [] } = useQuery<IdName[]>({
    queryKey: ["teachers", "all"],
    queryFn: () => fetchTeachers("all"),
  });

  const { data: years = [] } = useQuery<IdName[]>({
    queryKey: ["years", schoolId],
    enabled: !!schoolId,
    queryFn: () => fetchYearsBySchool(schoolId as number),
  });

  const { data: yearClasses = [] } = useQuery<IdName[]>({
    queryKey: ["classes", yearId],
    enabled: !!yearId,
    queryFn: () => fetchClasses(String(yearId)),
  });

  const { data: allClasses = [] } = useQuery<IdName[]>({
    queryKey: ["all-classes", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      const yr = (await fetchYearsBySchool(schoolId as number)) as IdName[];
      const arr = await Promise.all(
        (yr ?? []).map((y) => fetchClasses(String(y.id)).catch(() => []))
      );
      return arr.flat() as IdName[];
    },
  });

  // All students across the school (lazy — only when the By Student view is active)
  const { data: allStudents = [] } = useQuery<StudentOption[]>({
    queryKey: ["all-students", schoolId, allClasses.map((c) => c.id).join(",")],
    enabled: !isStudent && view === "student" && allClasses.length > 0,
    queryFn: async () => {
      const arr = await Promise.all(
        allClasses.map(async (c) => {
          const studs = await fetchStudents(c.id).catch(() => []);
          return ((Array.isArray(studs) ? studs : []) as Record<string, unknown>[]).map(
            (s) => ({
              id: Number(s.id),
              name: String(
                s.student_name ?? s.name ?? s.user_name ?? "Student"
              ),
              class_id: Number(c.id),
              class_name: String(c.class_name ?? ""),
            })
          );
        })
      );
      // A student can be enrolled in several (subject) classes — merge them so a
      // student appears once and their timetable spans all their classes.
      const map = new Map<number, StudentOption>();
      for (const s of arr.flat()) {
        if (!Number.isFinite(s.id)) continue;
        const ex = map.get(s.id);
        if (ex) {
          if (!ex.classIds.includes(s.class_id)) {
            ex.classIds.push(s.class_id);
            if (s.class_name) ex.classNames.push(s.class_name);
          }
        } else {
          map.set(s.id, {
            id: s.id,
            name: s.name,
            classIds: [s.class_id],
            classNames: s.class_name ? [s.class_name] : [],
          });
        }
      }
      return Array.from(map.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
  });

  const selectedStudent = useMemo(
    () => allStudents.find((s) => String(s.id) === studentId) ?? null,
    [allStudents, studentId]
  );

  const myTeacherId = useMemo(() => {
    if (!isTeacher || !currentUser?.id) return null;
    const me = teachers.find((t) => Number(t.user_id) === Number(currentUser.id));
    return me ? Number(me.id) : null;
  }, [teachers, currentUser?.id, isTeacher]);

  // Lock teacher view to own record
  useEffect(() => {
    if (isTeacher && myTeacherId != null && !teacherId) {
      setTeacherId(String(myTeacherId));
    }
  }, [isTeacher, myTeacherId, teacherId]);

  // Default year / class selection
  useEffect(() => {
    if (yearId || years.length === 0) return;
    setYearId(String(years[0].id));
  }, [yearId, years]);

  useEffect(() => {
    if (isStudent) return;
    if (!yearId || yearClasses.length === 0) return;
    if (classId && yearClasses.some((c) => String(c.id) === classId)) return;
    setClassId(String(yearClasses[0].id));
  }, [yearId, yearClasses, classId, isStudent]);

  const rooms = useMemo(() => {
    const set = new Set(lessons.map((l) => l.room).filter(Boolean));
    return Array.from(set).sort();
  }, [lessons]);

  useEffect(() => {
    if (view === "room" && !room && rooms.length > 0) setRoom(rooms[0]);
  }, [view, room, rooms]);

  useEffect(() => {
    if (view === "student" && !studentId && allStudents.length > 0) {
      setStudentId(String(allStudents[0].id));
    }
  }, [view, studentId, allStudents]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const subjectNames = useMemo(
    () => subjects.map((s) => s.name).filter(Boolean) as string[],
    [subjects]
  );

  useEffect(() => {
    if (view === "subject" && !subjectFilter && subjectNames.length > 0) {
      setSubjectFilter(subjectNames[0]);
    }
  }, [view, subjectFilter, subjectNames]);
  const teacherName = (id: number | null): string => {
    if (id == null) return "";
    const t = teachers.find((x) => Number(x.id) === id);
    return (t?.teacher_name || t?.name || "") as string;
  };
  const className = (id: number | null): string => {
    if (id == null) return "";
    const c = allClasses.find((x) => Number(x.id) === id);
    return (c?.class_name || "") as string;
  };

  const canEdit = (isAdmin || isHOD) && view === "class" && !!classId;

  // Lessons in the active A/B week (every-week lessons always included)
  const weekScoped = useMemo(() => {
    if (pattern.mode === "single") return lessons;
    return lessons.filter((l) => !l.week_label || l.week_label === activeWeek);
  }, [lessons, pattern.mode, activeWeek]);

  // Conflict map across the whole school for the active week
  const conflictMap = useMemo(() => {
    const pool = weekScoped.map((l) => ({
      id: l.id,
      day_of_week: l.day,
      start_time: l.start_time,
      end_time: l.end_time,
      teacher_id: l.teacher_id,
      class_id: l.class_id,
      room: l.room,
    }));
    const map: Record<number, ReturnType<typeof detectConflicts>> = {};
    for (const s of pool) {
      map[s.id as number] = detectConflicts(pool, s);
    }
    return map;
  }, [weekScoped]);

  // Which lessons appear given the current view
  const visibleLessons = useMemo(() => {
    if (view === "class") {
      const cid = classId ? Number(classId) : null;
      return weekScoped.filter((l) => l.class_id === cid);
    }
    if (view === "teacher") {
      const tid = teacherId ? Number(teacherId) : null;
      return weekScoped.filter((l) => l.teacher_id === tid);
    }
    if (view === "room") {
      return weekScoped.filter((l) => l.room && l.room === room);
    }
    if (view === "student") {
      const cids = selectedStudent ? selectedStudent.classIds : [];
      if (cids.length === 0) return [];
      return weekScoped.filter(
        (l) => l.class_id != null && cids.includes(l.class_id)
      );
    }
    if (view === "subject") {
      if (!subjectFilter) return [];
      const want = subjectFilter.toLowerCase();
      return weekScoped.filter((l) => (l.subject || "").toLowerCase() === want);
    }
    return weekScoped; // school
  }, [view, weekScoped, classId, teacherId, room, selectedStudent, subjectFilter]);

  const lessonsAt = (day: string, period: SchoolPeriod): Lesson[] => {
    const ps = toMinutes(period.startTime);
    const pe = toMinutes(period.endTime);
    return visibleLessons
      .filter((l) => l.day === day)
      .filter((l) => {
        const s = toMinutes(l.start_time);
        return s >= ps && s < pe;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  // ── Add / edit lesson ─────────────────────────────────────────────────────
  const [form] = Form.useForm();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editorCell, setEditorCell] = useState<{ day: string; period: SchoolPeriod } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["timetable"] });

  const addMutation = useMutation({
    mutationFn: (data: Parameters<typeof addTimetableSlot>[0]) =>
      addTimetableSlot(data, "all"),
    onSuccess: () => {
      messageApi.success("Lesson added");
      invalidate();
      closeEditor();
    },
    onError: () => messageApi.error("Failed to add lesson"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTimetableSlot>[1] }) =>
      updateTimetableSlot(id, data, "all"),
    onSuccess: () => {
      messageApi.success("Lesson updated");
      invalidate();
      closeEditor();
    },
    onError: () => messageApi.error("Failed to update lesson"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTimetableSlot(id),
    onSuccess: () => {
      messageApi.success("Lesson removed");
      invalidate();
      closeEditor();
    },
    onError: () => messageApi.error("Failed to remove lesson"),
  });

  const openAdd = (day: string, period: SchoolPeriod) => {
    setEditingLesson(null);
    setEditorCell({ day, period });
    form.resetFields();
    setEditorOpen(true);
  };

  const openEdit = (lesson: Lesson) => {
    // If editing from a non-class view, jump to that class first.
    if (view !== "class") {
      if (lesson.class_id) {
        const cls = allClasses.find((c) => Number(c.id) === lesson.class_id);
        if (cls?.year_id) setYearId(String(cls.year_id));
        setClassId(String(lesson.class_id));
      }
      if (isAdmin || isHOD) setView("class");
      return;
    }
    setEditingLesson(lesson);
    setEditorCell(null);
    form.setFieldsValue({
      subject: lesson.subject || undefined,
      teacher_id: lesson.teacher_id ? String(lesson.teacher_id) : undefined,
      room: lesson.room || undefined,
      zoom_link: lesson.zoom_link || undefined,
    });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingLesson(null);
    setEditorCell(null);
    setConfirmingDelete(false);
    form.resetFields();
  };

  const candidateConflicts = (values: { teacher_id?: string; room?: string }) => {
    const day = editingLesson ? editingLesson.day : editorCell?.day ?? "";
    const start = editingLesson
      ? editingLesson.start_time
      : editorCell?.period.startTime ?? "";
    const end = editingLesson
      ? editingLesson.end_time
      : editorCell?.period.endTime ?? "";
    return detectConflicts(
      weekScoped.map((l) => ({
        id: l.id,
        day_of_week: l.day,
        start_time: l.start_time,
        end_time: l.end_time,
        teacher_id: l.teacher_id,
        class_id: l.class_id,
        room: l.room,
      })),
      {
        id: editingLesson?.id,
        day_of_week: day,
        start_time: start,
        end_time: end,
        teacher_id: values.teacher_id ? Number(values.teacher_id) : null,
        class_id: classId ? Number(classId) : null,
        room: values.room ?? null,
      }
    );
  };

  const submitEditor = async () => {
    const values = await form.validateFields();
    const wl = pattern.mode === "ab" ? activeWeek : null;
    const base = {
      subject: values.subject ?? "",
      year_id: String(yearId ?? ""),
      teacher_id: values.teacher_id ? String(values.teacher_id) : "",
      class_id: String(classId ?? ""),
      room: values.room ?? "",
      date: "",
      zoom_link: values.zoom_link ?? "",
      week_label: wl,
      school_id: schoolId ?? undefined,
    };

    if (editingLesson) {
      updateMutation.mutate({
        id: String(editingLesson.id),
        data: {
          ...base,
          day: editingLesson.day,
          start_time: editingLesson.start_time,
          end_time: editingLesson.end_time,
        },
      });
    } else if (editorCell) {
      addMutation.mutate({
        ...base,
        day: editorCell.day,
        start_time: editorCell.period.startTime,
        end_time: editorCell.period.endTime,
      });
    }
  };

  // ── Copy a day's lessons to other days (class view) ───────────────────────
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyFromDay, setCopyFromDay] = useState<string | null>(null);
  const [copyToDays, setCopyToDays] = useState<string[]>([]);

  const doCopyDay = async () => {
    if (!copyFromDay || copyToDays.length === 0 || !classId) return;
    const source = weekScoped.filter(
      (l) => l.class_id === Number(classId) && l.day === copyFromDay
    );
    if (source.length === 0) {
      messageApi.warning("That day has no lessons to copy.");
      return;
    }
    const wl = pattern.mode === "ab" ? activeWeek : null;
    let count = 0;
    for (const targetDay of copyToDays) {
      for (const l of source) {
        await addTimetableSlot(
          {
            subject: l.subject,
            year_id: String(l.year_id ?? yearId ?? ""),
            teacher_id: l.teacher_id ? String(l.teacher_id) : "",
            class_id: String(classId),
            room: l.room,
            date: "",
            day: targetDay,
            week_label: wl,
            start_time: l.start_time,
            end_time: l.end_time,
            zoom_link: l.zoom_link,
            school_id: schoolId ?? undefined,
          },
          "all"
        );
        count += 1;
      }
    }
    messageApi.success(`Copied ${count} lesson${count !== 1 ? "s" : ""}.`);
    invalidate();
    setCopyOpen(false);
    setCopyToDays([]);
  };

  // ── Print / export ────────────────────────────────────────────────────────
  const handlePrint = () => {
    const title =
      view === "class"
        ? `Timetable — ${className(classId ? Number(classId) : null) || "Class"}`
        : view === "teacher"
        ? `Timetable — ${teacherName(teacherId ? Number(teacherId) : null) || "Teacher"}`
        : view === "room"
        ? `Timetable — Room ${room ?? ""}`
        : view === "student"
        ? `Timetable — ${selectedStudent?.name || "Student"}${
            selectedStudent?.classNames?.length
              ? ` (${selectedStudent.classNames.join(", ")})`
              : ""
          }`
        : view === "subject"
        ? `Timetable — ${subjectFilter || "Subject"}`
        : "School Timetable";

    const teachingPeriods = periods;
    const head = `<tr><th>Period</th>${orderedDays
      .map((d) => `<th>${d}</th>`)
      .join("")}</tr>`;
    const rows = teachingPeriods
      .map((p) => {
        if (!p.isTeaching) {
          return `<tr><td class="ph">${p.label}<br><span>${p.startTime}–${p.endTime}</span></td><td class="band" colspan="${orderedDays.length}">${p.label}</td></tr>`;
        }
        const cells = orderedDays
          .map((d) => {
            const items = lessonsAt(d, p)
              .map((l) => {
                const lines = [l.subject || "Lesson"];
                if (view !== "teacher" && l.teacher_id)
                  lines.push(teacherName(l.teacher_id));
                if (view !== "class" && l.class_id)
                  lines.push(className(l.class_id));
                if (l.room) lines.push("Room " + l.room);
                return `<div class="cell">${lines
                  .filter(Boolean)
                  .map((t, i) => `<span class="${i === 0 ? "s1" : "s2"}">${t}</span>`)
                  .join("")}</div>`;
              })
              .join("");
            return `<td>${items}</td>`;
          })
          .join("");
        return `<tr><td class="ph">${p.label}<br><span>${p.startTime}–${p.endTime}</span></td>${cells}</tr>`;
      })
      .join("");

    const win = window.open("", "_blank", "width=1100,height=800");
    if (!win) return;
    const ab =
      pattern.mode === "ab" ? ` — Week ${activeWeek}` : "";
    win.document.write(`<!doctype html><html><head><title>${title}</title>
<style>
  body{font-family:Inter,Arial,sans-serif;color:#0f172a;padding:24px}
  h1{font-size:18px;margin:0 0 12px}
  table{border-collapse:collapse;width:100%}
  th,td{border:1px solid #cbd5e1;padding:6px;vertical-align:top;font-size:11px}
  th{background:#f1f5f9;text-align:center}
  td.ph{background:#f8fafc;font-weight:700;text-align:center;white-space:nowrap}
  td.ph span{font-weight:400;color:#64748b;font-size:10px}
  td.band{background:#f1f5f9;text-align:center;font-weight:600;color:#64748b}
  .cell{margin-bottom:4px;padding:4px 6px;border-radius:6px;background:#eef2ff;display:flex;flex-direction:column}
  .s1{font-weight:700}
  .s2{color:#475569;font-size:10px}
</style></head><body>
  <h1>${title}${ab}</h1>
  <table><thead>${head}</thead><tbody>${rows}</tbody></table>
  <script>window.onload=function(){window.print();}</script>
</body></html>`);
    win.document.close();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const showSelectors = !isStudent;
  const cellEditable = canEdit;

  const viewOptions = [
    { label: "By Class", value: "class", icon: <GraduationCap size={14} /> },
    { label: "By Teacher", value: "teacher", icon: <Users size={14} /> },
    { label: "By Room", value: "room", icon: <DoorOpen size={14} /> },
    { label: "Whole school", value: "school", icon: <SchoolIcon size={14} /> },
    { label: "By Student", value: "student", icon: <User size={14} /> },
    { label: "By Subject", value: "subject", icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="dashboard-theme-scope px-1 pb-24">
      {contextHolder}

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1
            className="m-0 flex items-center gap-2 text-2xl font-extrabold leading-tight"
            style={{ color: "var(--theme-dark)" }}
          >
            <CalendarDays size={24} /> Timetable
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isStudent
              ? "Your weekly class schedule."
              : isTeacher
              ? "Your weekly teaching schedule."
              : "Build a repeating weekly schedule for your whole school."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button icon={<Printer size={15} />} onClick={handlePrint}>
            Print / PDF
          </Button>
          {(isAdmin || isHOD) && (
            <>
              <Button
                icon={<Settings2 size={15} />}
                onClick={() => setConfigOpen(true)}
              >
                Days &amp; periods
              </Button>
              <Button
                type="primary"
                icon={<CalendarDays size={15} />}
                onClick={() => setPatternOpen(true)}
              >
                {pattern.mode === "ab" ? "Two-week A/B" : "Same every week"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <Segmented
          value={view}
          onChange={(v) => setView(v as ViewMode)}
          options={
            isStudent
              ? [viewOptions[0]]
              : isTeacher
              ? [
                  viewOptions[1],
                  viewOptions[0],
                  viewOptions[2],
                  viewOptions[3],
                  viewOptions[4],
                  viewOptions[5],
                ]
              : viewOptions
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          {showSelectors && view === "class" && (
            <>
              <Select
                value={yearId ?? undefined}
                onChange={(v) => {
                  setYearId(v);
                  setClassId(null);
                }}
                placeholder="Year group"
                style={{ minWidth: 150 }}
                showSearch
                optionFilterProp="children"
              >
                {years.map((y) => (
                  <Option key={y.id} value={String(y.id)}>
                    {y.name}
                  </Option>
                ))}
              </Select>
              <Select
                value={classId ?? undefined}
                onChange={(v) => setClassId(v)}
                placeholder="Class"
                style={{ minWidth: 140 }}
                showSearch
                optionFilterProp="children"
              >
                {yearClasses.map((c) => (
                  <Option key={c.id} value={String(c.id)}>
                    {c.class_name}
                  </Option>
                ))}
              </Select>
            </>
          )}

          {showSelectors && view === "teacher" && (
            <Select
              value={teacherId ?? undefined}
              onChange={(v) => setTeacherId(v)}
              placeholder="Teacher"
              style={{ minWidth: 180 }}
              showSearch
              optionFilterProp="children"
              disabled={isTeacher}
            >
              {teachers.map((t) => (
                <Option key={t.id} value={String(t.id)}>
                  {t.teacher_name || t.name}
                </Option>
              ))}
            </Select>
          )}

          {view === "room" && (
            <Select
              value={room ?? undefined}
              onChange={(v) => setRoom(v)}
              placeholder="Room"
              style={{ minWidth: 140 }}
              showSearch
              notFoundContent="No rooms used yet"
            >
              {rooms.map((r) => (
                <Option key={r} value={r}>
                  Room {r}
                </Option>
              ))}
            </Select>
          )}

          {showSelectors && view === "student" && (
            <Select
              value={studentId ?? undefined}
              onChange={(v) => setStudentId(v)}
              placeholder="Search student"
              style={{ minWidth: 240 }}
              showSearch
              optionFilterProp="children"
              notFoundContent="Loading students…"
            >
              {allStudents.map((s) => (
                <Option key={s.id} value={String(s.id)}>
                  {s.name}
                  {s.classNames.length ? ` — ${s.classNames.join(", ")}` : ""}
                </Option>
              ))}
            </Select>
          )}

          {showSelectors && view === "subject" && (
            <Select
              value={subjectFilter ?? undefined}
              onChange={(v) => setSubjectFilter(v)}
              placeholder="Subject"
              style={{ minWidth: 180 }}
              showSearch
              optionFilterProp="children"
            >
              {subjectNames.map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          )}

          {canEdit && (
            <Button
              icon={<Copy size={14} />}
              onClick={() => {
                setCopyFromDay(orderedDays[0] ?? null);
                setCopyToDays([]);
                setCopyOpen(true);
              }}
            >
              Copy day
            </Button>
          )}
        </div>
      </div>

      {/* A/B week banner */}
      {pattern.mode === "ab" && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm">
          <span className="font-semibold text-indigo-900">Two-week rotation</span>
          <Segmented
            size="small"
            value={activeWeek}
            onChange={(v) => setActiveWeek(v as WeekLabel)}
            options={[
              { label: "Week A", value: "A" },
              { label: "Week B", value: "B" },
            ]}
          />
          <span className="text-indigo-700">
            This calendar week is <strong>Week {thisCalendarWeek}</strong>.
          </span>
          {(isAdmin || isHOD) && (
            <span className="text-xs text-indigo-500">
              Tip: mark a lesson&apos;s week below; lessons left as &quot;every week&quot; show in both.
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {orderedDays.length === 0 ? (
        <Empty text="No school days set. Click “Days & periods” to choose them." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-28 border-b border-r border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-500">
                  Period
                </th>
                {orderedDays.map((d) => (
                  <th
                    key={d}
                    className="border-b border-r border-slate-200 bg-slate-50 p-2 text-center text-xs font-semibold text-slate-600"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => {
                if (!p.isTeaching) {
                  return (
                    <tr key={p.id}>
                      <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500">
                        {p.label}
                        <div className="font-normal text-slate-400">
                          {p.startTime}
                        </div>
                      </td>
                      <td
                        colSpan={orderedDays.length}
                        className="border-b border-slate-200 bg-slate-50/60 p-1 text-center text-xs font-medium uppercase tracking-wide text-slate-400"
                      >
                        {p.label}
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={p.id}>
                    <td className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white p-2 text-center text-xs font-semibold text-slate-600">
                      {p.label}
                      <div className="font-normal text-slate-400">
                        {p.startTime}
                        <br />
                        {p.endTime}
                      </div>
                    </td>
                    {orderedDays.map((d) => {
                      const items = lessonsAt(d, p);
                      return (
                        <td
                          key={d}
                          className="border-b border-r border-slate-100 p-1 align-top"
                          style={{ minWidth: 150 }}
                        >
                          {items.map((l) => {
                            const conflicts = conflictMap[l.id] ?? [];
                            const hard = hasHardConflict(conflicts);
                            const soft = conflicts.length > 0 && !hard;
                            return (
                              <LessonCard
                                key={l.id}
                                lesson={l}
                                view={view}
                                teacherName={teacherName}
                                className={className}
                                hard={hard}
                                soft={soft}
                                conflictText={conflicts.map((c) => c.message).join("\n")}
                                editable={cellEditable}
                                onClick={() => {
                                  if (cellEditable || view !== "class") openEdit(l);
                                }}
                              />
                            );
                          })}
                          {cellEditable && (
                            <button
                              type="button"
                              onClick={() => openAdd(d, p)}
                              className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-slate-200 py-1.5 text-xs font-medium text-slate-400 transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)] hover:text-[var(--theme-dark)]"
                            >
                              <Plus size={12} /> Add
                            </button>
                          )}
                          {!cellEditable && items.length === 0 && (
                            <div className="py-2 text-center text-xs text-slate-300">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && (isAdmin || isHOD) && (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-rose-200 ring-1 ring-rose-400" />
            Teacher/class double-booked
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-amber-100 ring-1 ring-amber-400" />
            Room clash
          </span>
        </div>
      )}

      {/* Lesson editor */}
      <Modal
        title={editingLesson ? "Edit lesson" : "Add lesson"}
        open={editorOpen}
        onCancel={closeEditor}
        footer={null}
        destroyOnClose
      >
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <strong>{className(classId ? Number(classId) : null) || "Class"}</strong>
          {" · "}
          {editingLesson
            ? `${editingLesson.day} ${editingLesson.start_time}–${editingLesson.end_time}`
            : editorCell
            ? `${editorCell.day} ${editorCell.period.startTime}–${editorCell.period.endTime}`
            : ""}
          {pattern.mode === "ab" ? ` · Week ${activeWeek}` : ""}
        </div>
        <Form form={form} layout="vertical" onFinish={submitEditor}>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Pick a subject" }]}
          >
            <Select
              showSearch
              placeholder="Subject"
              optionFilterProp="children"
              allowClear
            >
              {subjectNames.map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="teacher_id" label="Teacher">
            <Select
              showSearch
              placeholder="Teacher"
              optionFilterProp="children"
              allowClear
            >
              {teachers.map((t) => (
                <Option key={t.id} value={String(t.id)}>
                  {t.teacher_name || t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="room" label="Room">
              <Input placeholder="e.g. C7" />
            </Form.Item>
            <Form.Item name="zoom_link" label="Online link (optional)">
              <Input placeholder="Zoom / Meet / Teams URL" />
            </Form.Item>
          </div>

          <ConflictHint getValues={() => form.getFieldsValue()} compute={candidateConflicts} />

          {editingLesson && confirmingDelete ? (
            <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="mb-2 text-sm text-rose-700">
                Remove {editingLesson.subject || "this lesson"} (
                {editingLesson.day} {editingLesson.start_time}&ndash;
                {editingLesson.end_time})? This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setConfirmingDelete(false)}>
                  Keep
                </Button>
                <Button
                  danger
                  type="primary"
                  icon={<Trash2 size={14} />}
                  loading={deleteMutation.isPending}
                  onClick={() =>
                    deleteMutation.mutate(String(editingLesson.id))
                  }
                >
                  Remove lesson
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between">
              {editingLesson ? (
                <Button
                  danger
                  icon={<Trash2 size={14} />}
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button onClick={closeEditor}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={addMutation.isPending || updateMutation.isPending}
                >
                  {editingLesson ? "Save" : "Add lesson"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* Copy day modal */}
      <Modal
        title="Copy a day's lessons"
        open={copyOpen}
        onCancel={() => setCopyOpen(false)}
        onOk={doCopyDay}
        okText="Copy"
        okButtonProps={{ disabled: !copyFromDay || copyToDays.length === 0 }}
      >
        <p className="mb-2 text-sm text-slate-600">
          Copy every lesson from one day to other days for{" "}
          <strong>{className(classId ? Number(classId) : null)}</strong>
          {pattern.mode === "ab" ? ` (Week ${activeWeek})` : ""}.
        </p>
        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold text-slate-500">From</div>
          <Select
            value={copyFromDay ?? undefined}
            onChange={(v) => setCopyFromDay(v)}
            style={{ width: "100%" }}
          >
            {orderedDays.map((d) => (
              <Option key={d} value={d}>
                {d}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-500">To</div>
          <Select
            mode="multiple"
            value={copyToDays}
            onChange={(v) => setCopyToDays(v)}
            style={{ width: "100%" }}
            placeholder="Pick day(s)"
          >
            {orderedDays
              .filter((d) => d !== copyFromDay)
              .map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
          </Select>
        </div>
      </Modal>

      {/* Pattern modal */}
      <Modal
        title="Weekly pattern"
        open={patternOpen}
        onCancel={() => setPatternOpen(false)}
        onOk={() => {
          savePattern(pattern);
          setActiveWeek(weekLabelForDate(pattern));
          setPatternOpen(false);
          messageApi.success("Pattern saved");
        }}
        okText="Save"
      >
        <Segmented
          block
          value={pattern.mode}
          onChange={(v) =>
            setPattern((p) => ({ ...p, mode: v as TimetablePattern["mode"] }))
          }
          options={[
            { label: "Same every week", value: "single" },
            { label: "Two-week A/B", value: "ab" },
          ]}
        />
        {pattern.mode === "single" ? (
          <p className="mt-3 text-sm text-slate-600">
            One repeating weekly timetable. Simplest option — what most schools use.
          </p>
        ) : (
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <p>
              Build a <strong>Week A</strong> and a <strong>Week B</strong>; the
              system shows the right one each calendar week automatically.
            </p>
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-500">
                Pick a date that is in <strong>Week A</strong>
              </div>
              <DatePicker
                value={dayjs(pattern.anchor)}
                onChange={(d) =>
                  setPattern((p) => ({
                    ...p,
                    anchor: (d ?? dayjs()).format("YYYY-MM-DD"),
                  }))
                }
                allowClear={false}
                style={{ width: "100%" }}
              />
              <p className="mt-1 text-xs text-slate-400">
                The week containing this date becomes Week A; weeks then alternate
                A, B, A, B…
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Days & periods config */}
      <PeriodsConfigModal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        periods={periods}
        schoolDays={schoolDays}
        onChange={(p, d) => {
          setPeriods(p);
          savePeriods(p);
          setSchoolDays(d);
          saveSchoolDays(d);
        }}
      />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

function LessonCard({
  lesson,
  view,
  teacherName,
  className,
  hard,
  soft,
  conflictText,
  editable,
  onClick,
}: {
  lesson: Lesson;
  view: ViewMode;
  teacherName: (id: number | null) => string;
  className: (id: number | null) => string;
  hard: boolean;
  soft: boolean;
  conflictText: string;
  editable: boolean;
  onClick: () => void;
}) {
  const base =
    "mb-1 w-full rounded-md border px-2 py-1 text-left text-xs transition";
  const tone = hard
    ? "border-rose-300 bg-rose-50"
    : soft
    ? "border-amber-300 bg-amber-50"
    : "border-[var(--theme-border)] bg-[var(--theme-soft)]";
  const sub = (
    <>
      <div className="flex items-center gap-1 font-semibold text-[var(--theme-dark)]">
        <span className="truncate">{lesson.subject || "Lesson"}</span>
        {lesson.zoom_link && (
          <Video size={12} className="shrink-0 text-indigo-500" />
        )}
        {(hard || soft) && (
          <AlertTriangle
            size={12}
            className={hard ? "shrink-0 text-rose-500" : "shrink-0 text-amber-500"}
          />
        )}
      </div>
      {view !== "teacher" && lesson.teacher_id != null && (
        <div className="truncate text-slate-500">
          {teacherName(lesson.teacher_id)}
        </div>
      )}
      {view !== "class" && lesson.class_id != null && (
        <div className="truncate text-slate-500">{className(lesson.class_id)}</div>
      )}
      {lesson.room && <div className="truncate text-slate-400">Room {lesson.room}</div>}
    </>
  );

  const inner = (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${tone} ${editable || view !== "class" ? "hover:brightness-95" : "cursor-default"} group relative`}
    >
      {sub}
      {editable && (
        <Pencil
          size={11}
          className="absolute right-1 top-1 text-slate-300 opacity-0 transition group-hover:opacity-100"
        />
      )}
    </button>
  );

  return conflictText ? (
    <Tooltip title={conflictText}>{inner}</Tooltip>
  ) : (
    inner
  );
}

function ConflictHint({
  getValues,
  compute,
}: {
  getValues: () => { teacher_id?: string; room?: string };
  compute: (v: { teacher_id?: string; room?: string }) => ReturnType<typeof detectConflicts>;
}) {
  const conflicts = compute(getValues());
  if (conflicts.length === 0) return null;
  const hard = hasHardConflict(conflicts);
  return (
    <div
      className={`mb-2 rounded-md border px-3 py-2 text-xs ${
        hard
          ? "border-rose-300 bg-rose-50 text-rose-700"
          : "border-amber-300 bg-amber-50 text-amber-700"
      }`}
    >
      <div className="mb-0.5 flex items-center gap-1 font-semibold">
        <AlertTriangle size={12} /> {hard ? "Conflict" : "Heads up"}
      </div>
      {conflicts.map((c, i) => (
        <div key={i}>{c.message}</div>
      ))}
    </div>
  );
}
