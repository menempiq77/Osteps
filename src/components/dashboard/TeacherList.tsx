"use client";
import { useEffect, useMemo, useState } from "react";
import { AddTeacherModal } from "../modals/teacherModals/AddTeacherModal";
import { EditTeacherModal } from "../modals/teacherModals/EditTeacherModal";
import AssignTeacherModal from "../modals/teacherModals/AssignTeacherModal";
import { Spin, Modal, Button, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import {
  fetchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher as deleteTeacherApi,
  assignTeacherToClass,
} from "@/services/teacherApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { fetchSubjects } from "@/services/subjectsApi";
import { assignStaffSubjects, fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubjectContext } from "@/contexts/SubjectContext";

type Teacher = {
  id: string;
  userId: number | null;
  name: string;
  phone: string;
  email: string;
  role: string;
  subjects: Array<{ id: number; name: string }>;
};

type TeacherFormInput = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  subjects: number[];
  password?: string;
};
interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
}

const TEACHER_THEME_STORAGE_KEY = "osteps-dashboard-theme";
const TEACHER_THEMES = {
  green: { label: "Green", primary: "#38C16C", soft: "#eef9f2", soft2: "#dff3e7", border: "#b9e2cd", dark: "#2f8f5b", shadow: "rgba(22, 101, 52, 0.35)", scrollStart: "#34d399", scrollEnd: "#16a34a" },
  blue: { label: "Blue", primary: "#2F80ED", soft: "#edf4ff", soft2: "#d9e9ff", border: "#b9d2ff", dark: "#1f5fb8", shadow: "rgba(30, 64, 175, 0.35)", scrollStart: "#60a5fa", scrollEnd: "#2563eb" },
  red: { label: "Red", primary: "#E35D5D", soft: "#fff0f0", soft2: "#ffe0e0", border: "#f7bbbb", dark: "#b84141", shadow: "rgba(153, 27, 27, 0.32)", scrollStart: "#f87171", scrollEnd: "#dc2626" },
  purple: { label: "Purple", primary: "#8B5CF6", soft: "#f3efff", soft2: "#e9dfff", border: "#d3c0ff", dark: "#6a3fd0", shadow: "rgba(109, 40, 217, 0.33)", scrollStart: "#a78bfa", scrollEnd: "#7c3aed" },
  orange: { label: "Orange", primary: "#F08A24", soft: "#fff5e9", soft2: "#ffe8cd", border: "#f6d0a2", dark: "#b86315", shadow: "rgba(180, 83, 9, 0.34)", scrollStart: "#fb923c", scrollEnd: "#ea580c" },
} as const;

type TeacherThemeName = keyof typeof TEACHER_THEMES;

const applyTeacherTheme = (themeName: TeacherThemeName) => {
  const theme = TEACHER_THEMES[themeName];
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--theme-soft", theme.soft);
  root.style.setProperty("--theme-soft-2", theme.soft2);
  root.style.setProperty("--theme-border", theme.border);
  root.style.setProperty("--theme-dark", theme.dark);
  root.style.setProperty("--theme-shadow", theme.shadow);
  root.style.setProperty("--theme-scroll-start", theme.scrollStart);
  root.style.setProperty("--theme-scroll-end", theme.scrollEnd);
  root.style.setProperty("--theme-name", themeName);
};

/** Assign a HOD to every linked class of each given subject. Non-blocking per class. */
async function assignHODToAllSubjectClasses(teacherId: number, subjectIds: number[]) {
  for (const subjectId of subjectIds) {
    try {
      const rows = await fetchSubjectClasses({ subject_id: subjectId, include_inactive: false });
      for (const row of (Array.isArray(rows) ? rows : [])) {
        try {
          const linkedId = await resolveSubjectClassLinkedIdWithFallback(row, subjectId);
          const classId = Number(linkedId || 0);
          if (classId > 0) {
            await assignTeacherToClass(teacherId, classId);
          }
        } catch {
          // continue to next class
        }
      }
    } catch {
      // continue to next subject
    }
  }
}

export default function TeacherList() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Teacher | null>(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [themeName, setThemeName] = useState<TeacherThemeName>("green");
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isHOD = currentUser?.role === "HOD";
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const schoolId = currentUser?.school;
  const { subjects: assignedSubjects } = useSubjectContext();

  const queryClient = useQueryClient();

  const {
    data: teachers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await fetchTeachers();
      return response.map((teacher: any) => ({
        id: teacher.id.toString(),
        userId: Number(teacher.user_id || 0) > 0 ? Number(teacher.user_id) : null,
        name: teacher.teacher_name,
        phone: teacher.phone,
        email: teacher.email,
        role: teacher.role,
        subjects: Array.isArray(teacher.subjects)
          ? teacher.subjects.map((s: any) => {
              const name = typeof s === "object" ? s.name : s;
              return {
                id: Number(typeof s === "object" ? s.id : 0),
                name: String(name || "").replace(/islamiat/gi, "Islamic"),
              };
            })
          : [],
      }));
    },
    onError: (err) => {
      console.error(err);
      setError("Failed to fetch teachers");
      messageApi.error("Failed to fetch teachers");
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const data = await fetchSubjects();
      return data;
    },
    onError: (err) => {
      console.error(err);
      messageApi.error("Failed to fetch subjects");
    },
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem(TEACHER_THEME_STORAGE_KEY) as TeacherThemeName | null;
    const nextTheme =
      storedTheme && Object.prototype.hasOwnProperty.call(TEACHER_THEMES, storedTheme)
        ? storedTheme
        : "green";
    setThemeName(nextTheme);
    applyTeacherTheme(nextTheme);
  }, []);

  const filteredTeachers = (() => {
    let rows = teachers;

    if (hasAccess && selectedSubjectFilter !== "all") {
      const wanted = selectedSubjectFilter.trim().toLowerCase();
      rows = rows.filter((teacher) =>
        Array.isArray(teacher.subjects) &&
        teacher.subjects.some((subject) => String(subject?.name || "").trim().toLowerCase() === wanted)
      );
    }

    if (!isHOD) return rows;
    const allowedSubjectNames = new Set(
      (assignedSubjects || []).map((subject) => String(subject.name || "").trim().toLowerCase())
    );
    if (!allowedSubjectNames.size) return [];

    return rows.filter((teacher) =>
      Array.isArray(teacher.subjects) &&
      teacher.subjects.some((subject) =>
        allowedSubjectNames.has(String(subject?.name || "").trim().toLowerCase())
      )
    );
  })();

  const stats = useMemo(() => {
    const visibleTeachers = filteredTeachers.length;
    const hodCount = filteredTeachers.filter((teacher) => teacher.role === "HOD").length;
    const teacherCount = filteredTeachers.filter((teacher) => teacher.role === "TEACHER").length;
    const subjectCount = new Set(
      filteredTeachers.flatMap((teacher) =>
        Array.isArray(teacher.subjects)
          ? teacher.subjects.map((subject) => String(subject?.name || "").trim())
          : []
      ).filter(Boolean)
    ).size;

    return { visibleTeachers, hodCount, teacherCount, subjectCount };
  }, [filteredTeachers]);

  const handleThemeChange = (nextTheme: TeacherThemeName) => {
    setThemeName(nextTheme);
    applyTeacherTheme(nextTheme);
    localStorage.setItem(TEACHER_THEME_STORAGE_KEY, nextTheme);
  };

  const handleSaveEdit = async (teacher: TeacherFormInput) => {
    try {
      const existingTeacher = teachers.find((item) => item.id === teacher.id) ?? null;
      const payload: any = {
        teacher_name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        subjects: teacher.subjects,
        role: teacher.role,
        school_id: schoolId,
      };

      if (teacher.password) payload.password = teacher.password;

      await updateTeacher(teacher.id, payload);

      const roleScope = teacher.role === "HOD" ? "HOD" : "TEACHER";
      const targetUserId = Number(existingTeacher?.userId || 0);
      if (targetUserId > 0 && Array.isArray(teacher.subjects) && teacher.subjects.length > 0) {
        await assignStaffSubjects({
          user_id: targetUserId,
          subject_ids: teacher.subjects,
          role_scope: roleScope,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["teachers"] });

      // If HOD: auto-assign to all classes of their subjects
      if (teacher.role === "HOD" && Array.isArray(teacher.subjects) && teacher.subjects.length > 0) {
        await assignHODToAllSubjectClasses(Number(teacher.id), teacher.subjects);
      }

      messageApi?.success(`${teacher.role || "Teacher"} updated successfully`);
    } catch (err) {
      console.error("Failed to update teacher:", err);
      messageApi?.error("Failed to update teacher");
    }
  };

  const handleAddNewTeacher = async (teacher: TeacherFormInput) => {
    try {
      await addTeacher({
        teacher_name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        role: teacher?.role,
        school_id: schoolId,
        subjects: teacher.subjects,
        password: teacher.password,
      });

      const refreshedTeachers = await fetchTeachers();
      const createdTeacher = (Array.isArray(refreshedTeachers) ? refreshedTeachers : []).find(
        (item: any) =>
          String(item?.email || "").trim().toLowerCase() === String(teacher.email || "").trim().toLowerCase()
      );
      const createdUserId = Number(createdTeacher?.user_id || 0);
      const roleScope = teacher.role === "HOD" ? "HOD" : "TEACHER";
      if (createdUserId > 0 && Array.isArray(teacher.subjects) && teacher.subjects.length > 0) {
        await assignStaffSubjects({
          user_id: createdUserId,
          subject_ids: teacher.subjects,
          role_scope: roleScope,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsAddTeacherModalOpen(false);

      // If HOD: auto-assign to all classes of their subjects
      const createdTeacherId = Number(createdTeacher?.id || 0);
      if (teacher.role === "HOD" && createdTeacherId > 0 && Array.isArray(teacher.subjects) && teacher.subjects.length > 0) {
        await assignHODToAllSubjectClasses(createdTeacherId, teacher.subjects);
      }

      messageApi?.success(`${teacher.role || "Teacher"} added successfully`);
    } catch (err) {
      console.error("Failed to add teacher:", err);
      messageApi?.error("Failed to add teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      // find the teacher first
      const teacherToDelete = teachers.find((t) => t.id === teacherId);

      await deleteTeacherApi(Number(teacherId));
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });

      setIsDeleteModalOpen(false);
      setDeleteTeacher(null);

      messageApi.success(
        `${teacherToDelete?.role || "Teacher"} deleted successfully`
      );
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      setError("Failed to delete teacher");
      messageApi.error("Failed to delete teacher");
    }
  };

  const handleTeacherAssignedClasses = (teacherId: string) => {
    router.push(`/dashboard/teachers/${teacherId}/assignedClasses`);
  };

  const handleAssignTeacher = (teacher: Teacher) => {
    setAssignTarget(teacher);
  };

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="premium-page overflow-auto rounded-3xl p-4 md:p-6 space-y-6 font-[var(--font-raleway)]">
      {contextHolder}
      <div className="premium-hero overflow-hidden rounded-[28px] border border-[var(--theme-border)] px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-[var(--theme-border)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-dark)]">
              Teacher Management
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Teachers
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Manage teachers, heads of department, class assignments, and subject ownership
                from one place.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 xl:max-w-[640px]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="flex items-center justify-center rounded-full border border-[var(--theme-border)] bg-white/90 px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Theme
                  </span>
                  <div className="flex items-center gap-2">
                    {(Object.keys(TEACHER_THEMES) as TeacherThemeName[]).map((name) => (
                      <button
                        key={name}
                        type="button"
                        title={TEACHER_THEMES[name].label}
                        onClick={() => handleThemeChange(name)}
                        className={`h-5 w-5 rounded-full border transition ${
                          themeName === name
                            ? "scale-110 border-white ring-2 ring-[var(--theme-border)]"
                            : "border-white/70 opacity-85 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: TEACHER_THEMES[name].primary }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:flex-1">
                {hasAccess && (
                  <Select
                    value={selectedSubjectFilter}
                    onChange={(value) => setSelectedSubjectFilter(value)}
                    className="min-h-[44px] sm:min-w-[250px] sm:flex-1 xl:max-w-[280px]"
                    options={[
                      { label: "All Subjects", value: "all" },
                      ...subjects.map((subject: Subject) => ({
                        label: subject.name,
                        value: String(subject.name || "").trim().toLowerCase(),
                      })),
                    ]}
                  />
                )}

                {hasAccess && (
                  <Button
                    type="primary"
                    onClick={() => setIsAddTeacherModalOpen(true)}
                    className="premium-pill-btn !h-[44px] !rounded-xl !bg-[var(--primary)] hover:!bg-[var(--theme-dark)] !text-white !border-0 uppercase !font-semibold"
                  >
                    {isHOD ? "Add Teacher" : "Add Teacher / HOD"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Visible Staff", value: stats.visibleTeachers },
          { label: "Teachers", value: stats.teacherCount },
          { label: "Heads of Department", value: stats.hodCount },
          { label: "Subjects Covered", value: stats.subjectCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--theme-border)] bg-white/90 p-5 shadow-[0_18px_40px_-28px_var(--theme-shadow)]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {item.label}
            </div>
            <div className="mt-3 text-3xl font-bold text-[var(--theme-dark)] md:text-4xl">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="premium-card relative overflow-hidden rounded-[28px] border border-[var(--theme-border)] p-2 shadow-[0_20px_60px_-38px_var(--theme-shadow)]">
        <div className="overflow-x-auto rounded-lg">
          <table className="premium-table min-w-full overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white mb-2">
            <thead>
              <tr className="text-center text-xs md:text-sm font-semibold text-slate-700">
                <th className="p-0">
                  <span className="block border-r border-[var(--theme-border)] bg-[var(--theme-soft)] py-3 px-3">
                    Teacher Name
                  </span>
                </th>
                <th className="p-0">
                  <span className="block border-r border-[var(--theme-border)] bg-[var(--theme-soft)] py-3 px-3">
                    Phone
                  </span>
                </th>
                <th className="p-0">
                  <span className="block border-r border-[var(--theme-border)] bg-[var(--theme-soft)] py-3 px-3">
                    Email
                  </span>
                </th>
                <th className="p-0">
                  <span className="block border-r border-[var(--theme-border)] bg-[var(--theme-soft)] py-3 px-3">
                    Subjects
                  </span>
                </th>
                <th className="p-0">
                  <span className="block border-r border-[var(--theme-border)] bg-[var(--theme-soft)] py-3 px-3">
                    Role
                  </span>
                </th>
                {hasAccess && (
                  <th className="bg-[var(--theme-soft)] p-4 text-xs md:text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTeachers && filteredTeachers.length > 0 ? (
                filteredTeachers?.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-[var(--theme-border)] text-xs md:text-sm text-center text-slate-700 transition-colors hover:bg-[var(--theme-soft)] even:bg-[color:color-mix(in_srgb,var(--theme-soft)_58%,white)] odd:bg-white"
                  >
                    {hasAccess || isHOD ? (
                      <td className="p-2 md:p-4 font-medium">
                        <button
                          onClick={() =>
                            handleTeacherAssignedClasses(teacher.id)
                          }
                          className="cursor-pointer text-[var(--theme-dark)] transition hover:opacity-80"
                        >
                          {teacher.name || "N/A"}
                        </button>
                      </td>
                    ) : (
                      <td className="p-2 md:p-4 font-medium">
                        {teacher.name || "N/A"}
                      </td>
                    )}
                    <td className="p-2 md:p-4">{teacher.phone || "N/A"}</td>
                    <td className="p-2 md:p-4">{teacher.email || "N/A"}</td>
                    <td className="p-2 md:p-4">
                      {Array.isArray(teacher.subjects) &&
                      teacher.subjects.length > 0
                        ? (
                          <div className="flex flex-wrap justify-center gap-2">
                            {teacher.subjects.map((subject) => (
                              <span
                                key={`${teacher.id}-${subject.id || subject.name}`}
                                className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--theme-dark)]"
                              >
                                {subject.name}
                              </span>
                            ))}
                          </div>
                        )
                        : "N/A"}
                    </td>
                    <td className="p-2 md:p-4">
                      <span className="rounded-full border border-[var(--theme-border)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                        {teacher.role || "N/A"}
                      </span>
                    </td>

                    {hasAccess && (
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <button
                          onClick={() => handleAssignTeacher(teacher)}
                          className="cursor-pointer text-blue-500 transition hover:text-blue-700"
                          title="Assign to Classes"
                        >
                          <TeamOutlined />
                        </button>

                        <button
                          onClick={() => setEditTeacher(teacher)}
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                          title="Edit"
                        >
                          <EditOutlined />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteTeacher(teacher);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="mx-auto max-w-md space-y-2">
                      <div className="text-lg font-semibold text-slate-800">No teachers found</div>
                      <div className="text-sm text-slate-500">
                        Try a different subject filter, or add a new teacher to start assigning
                        subjects and classes.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddTeacherModalOpen}
        onOpenChange={setIsAddTeacherModalOpen}
        onAddTeacher={handleAddNewTeacher}
        isHOD={isHOD}
        subjects={subjects}
      />

      {/* Edit Teacher Modal */}
      {editTeacher && (
        <EditTeacherModal
          teacher={editTeacher}
          isOpen={!!editTeacher}
          onOpenChange={(open) => !open && setEditTeacher(null)}
          onSave={handleSaveEdit}
          isHOD={isHOD}
          subjects={subjects}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={() => deleteTeacher && handleDeleteTeacher(deleteTeacher.id)}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteTeacher(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {deleteTeacher && (
          <p>
            Are you sure you want to delete
            <strong> {deleteTeacher.name}</strong>? This action cannot be
            undone.
          </p>
        )}
      </Modal>

      {/* Assign Teacher to Classes Modal */}
      {assignTarget && (
        <AssignTeacherModal
          open={!!assignTarget}
          onClose={() => setAssignTarget(null)}
          teacherId={assignTarget.id}
          teacherUserId={assignTarget.userId}
          teacherName={assignTarget.name}
          teacherRole={assignTarget.role}
          teacherSubjects={assignTarget.subjects ?? []}
        />
      )}
    </div>
  );
}
