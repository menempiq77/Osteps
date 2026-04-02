"use client";

import { useEffect, useMemo, useState } from "react";
import { Empty, Modal, Select, Spin, Tag, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { assignStaffSubjects, fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import {
  assignTeacherToClass,
  getAssignClassesTeacher,
  unassignTeacherFromClass,
} from "@/services/teacherApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import {
  resolveSubjectClassLabel,
  resolveSubjectClassLinkedIdWithFallback,
  resolveSubjectClassYearId,
} from "@/lib/subjectClassResolution";
import { RootState } from "@/store/store";

interface AssignTeacherModalProps {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  teacherUserId?: number | null;
  teacherName: string;
  teacherRole: string;
  teacherSubjects: Array<{ id: number; name: string }>;
}

type ClassRow = {
  id: number;
  name: string;
  yearId: string;
  isAssigned: boolean;
};

const displaySubject = (value: string) =>
  String(value || "").replace(/islamiat/gi, "Islamic");

export default function AssignTeacherModal({
  open,
  onClose,
  teacherId,
  teacherUserId,
  teacherName,
  teacherRole,
  teacherSubjects,
}: AssignTeacherModalProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [busyClassIds, setBusyClassIds] = useState<Set<number>>(new Set());
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const schoolId = Number(
    (currentUser as any)?.school?.id ??
      (currentUser as any)?.school_id ??
      (currentUser as any)?.school ??
      0
  );

  const subjectOptions = useMemo(
    () =>
      teacherSubjects.map((subject) => ({
        key: String(subject.id || subject.name),
        id: Number(subject.id || 0),
        name: displaySubject(subject.name),
      })),
    [teacherSubjects]
  );

  useEffect(() => {
    if (subjectOptions.length > 0 && !selectedSubject) {
      setSelectedSubject(subjectOptions[0].key);
    }
  }, [subjectOptions, selectedSubject]);

  useEffect(() => {
    if (open) {
      setSelectedSubject(null);
      setSelectedYear(null);
      setBusyClassIds(new Set());
    }
  }, [open, teacherId]);

  useEffect(() => {
    const syncStaffSubjects = async () => {
      const targetUserId = Number(teacherUserId || 0);
      const subjectIds = teacherSubjects
        .map((subject) => Number(subject.id || 0))
        .filter((id) => Number.isFinite(id) && id > 0);

      if (!open || targetUserId <= 0 || subjectIds.length === 0) return;

      try {
        await assignStaffSubjects({
          user_id: targetUserId,
          subject_ids: Array.from(new Set(subjectIds)),
          role_scope: String(teacherRole || "").toUpperCase() === "HOD" ? "HOD" : "TEACHER",
        });
      } catch {
        // non-blocking repair for legacy teacher subject records
      }
    };

    void syncStaffSubjects();
  }, [open, teacherRole, teacherSubjects, teacherUserId]);

  const { data: assignedRows = [], isLoading: assignedLoading } = useQuery({
    queryKey: ["teacher-assigned-classes", teacherId],
    queryFn: async () => {
      try {
        const response = await getAssignClassesTeacher(teacherId);
        return Array.isArray(response?.data) ? response.data : [];
      } catch {
        return [];
      }
    },
    enabled: open,
  });

  const assignedClassIds = useMemo(() => {
    const ids = new Set<number>();
    (assignedRows as any[]).forEach((row: any) => {
      if (row?.class_id) ids.add(Number(row.class_id));
    });
    return ids;
  }, [assignedRows]);

  const { data: years = [], isLoading: yearsLoading } = useQuery({
    queryKey: ["assign-teacher-years", schoolId],
    queryFn: async () => {
      if (schoolId > 0) {
        const response = await fetchYearsBySchool(schoolId);
        if (Array.isArray(response) && response.length > 0) {
          return response;
        }
      }

      const response = await fetchAssignYears();
      const mapped = (response || [])
        .map((item: any) => item?.classes?.year)
        .filter(Boolean);
      return Array.from(new Map(mapped.map((year: any) => [year.id, year])).values());
    },
    enabled: open,
    staleTime: 1000 * 60,
  });

  const selectedSubjectId = useMemo(() => {
    const selected = subjectOptions.find((subject) => subject.key === selectedSubject);
    return Number(selected?.id || 0);
  }, [selectedSubject, subjectOptions]);

  const { data: subjectClasses = [], isLoading: subjectClassesLoading } = useQuery({
    queryKey: ["assign-teacher-subject-classes", selectedSubjectId],
    queryFn: async () => {
      if (!selectedSubjectId) return [];
      const rows = await fetchSubjectClasses({
        subject_id: selectedSubjectId,
        include_inactive: true,
      });

      const resolved = await Promise.all(
        (Array.isArray(rows) ? rows : []).map(async (row: any) => {
          const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(row, selectedSubjectId);
          return {
            linkedClassId: Number(linkedClassId || 0),
            label: resolveSubjectClassLabel(row),
            yearId: String(resolveSubjectClassYearId(row) || ""),
          };
        })
      );

      return resolved.filter((row) => row.linkedClassId > 0 && row.yearId);
    },
    enabled: open && selectedSubjectId > 0,
  });

  const { data: teacherSubjectClassMap = new Map<number, string>(), isLoading: subjectSummaryLoading } = useQuery({
    queryKey: [
      "assign-teacher-subject-class-map",
      teacherSubjects.map((subject) => subject.id).join(","),
    ],
    queryFn: async () => {
      const map = new Map<number, string>();

      await Promise.all(
        teacherSubjects.map(async (subject) => {
          const subjectId = Number(subject.id || 0);
          if (!subjectId) return;

          try {
            const rows = await fetchSubjectClasses({
              subject_id: subjectId,
              include_inactive: true,
            });

            const resolvedRows = await Promise.all(
              (Array.isArray(rows) ? rows : []).map(async (row: any) => {
                const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(row, subjectId);
                return Number(linkedClassId || 0);
              })
            );

            resolvedRows.forEach((classId) => {
              if (classId > 0 && !map.has(classId)) {
                map.set(classId, displaySubject(subject.name));
              }
            });
          } catch {
            return;
          }
        })
      );

      return map;
    },
    enabled: open && teacherSubjects.length > 0,
  });

  const validClassRows = useMemo(() => {
    const rows = (subjectClasses as any[]).map((row: any) => ({
      id: Number(row.linkedClassId),
      name: String(row.label || "Class"),
      yearId: String(row.yearId || ""),
      isAssigned: assignedClassIds.has(Number(row.linkedClassId)),
    }));

    return Array.from(new Map(rows.map((row) => [row.id, row])).values());
  }, [assignedClassIds, subjectClasses]);

  const availableYears = useMemo(() => {
    const yearSet = new Set(validClassRows.map((row) => row.yearId).filter(Boolean));
    return (years as any[])
      .filter((year: any) => yearSet.has(String(year?.id)))
      .map((year: any) => ({
        id: String(year.id),
        name: String(year.name || `Year ${year.id}`),
      }));
  }, [validClassRows, years]);

  useEffect(() => {
    setSelectedYear(null);
  }, [selectedSubject]);

  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0].id);
    }
  }, [availableYears, selectedYear]);

  const classRows = useMemo(
    () =>
      validClassRows
        .filter((row) => !selectedYear || row.yearId === selectedYear)
        .sort((a, b) => {
          if (a.isAssigned !== b.isAssigned) return a.isAssigned ? -1 : 1;
          return a.name.localeCompare(b.name);
        }),
    [selectedYear, validClassRows]
  );

  const assignmentSummary = useMemo(() => {
    const grouped = new Map<string, Set<string>>();

    (assignedRows as any[]).forEach((row: any) => {
      const classId = Number(row?.class_id ?? row?.classes?.id ?? 0);
      const subjectName =
        teacherSubjectClassMap.get(classId) ||
        displaySubject(String(row?.subject || "General"));
      const className = String(row?.classes?.class_name || row?.class_name || "").trim();
      if (!grouped.has(subjectName)) {
        grouped.set(subjectName, new Set<string>());
      }
      if (className) {
        grouped.get(subjectName)?.add(className);
      }
    });

    return Array.from(grouped.entries()).map(([subject, classes]) => ({
      subject,
      classes: Array.from(classes).sort((a, b) => a.localeCompare(b)),
    }));
  }, [assignedRows, teacherSubjectClassMap]);

  const totalAssigned = assignedClassIds.size;

  const handleAssign = async (classId: number) => {
    setBusyClassIds((prev) => new Set(prev).add(classId));
    try {
      await assignTeacherToClass(Number(teacherId), classId);
      messageApi.success("Assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["teacher-assigned-classes", teacherId] });
      queryClient.invalidateQueries({ queryKey: ["assign-teacher-all-classes"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    } catch {
      messageApi.error("Failed to assign");
    } finally {
      setBusyClassIds((prev) => {
        const next = new Set(prev);
        next.delete(classId);
        return next;
      });
    }
  };

  const handleUnassign = async (classId: number) => {
    setBusyClassIds((prev) => new Set(prev).add(classId));
    try {
      await unassignTeacherFromClass(Number(teacherId), classId);
      messageApi.success("Unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["teacher-assigned-classes", teacherId] });
      queryClient.invalidateQueries({ queryKey: ["assign-teacher-all-classes"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    } catch {
      messageApi.error("Failed to unassign");
    } finally {
      setBusyClassIds((prev) => {
        const next = new Set(prev);
        next.delete(classId);
        return next;
      });
    }
  };

  const loading = yearsLoading || subjectClassesLoading || subjectSummaryLoading || assignedLoading;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={620}
      centered
      destroyOnClose
    >
      {contextHolder}

      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">Assign Classes</h2>
            <Tag
              className="!text-[10px] !font-semibold !uppercase !tracking-wider"
              color={teacherRole === "HOD" ? "gold" : "green"}
            >
              {teacherRole}
            </Tag>
          </div>
          <p className="text-sm text-slate-500">
            {teacherName} &mdash; <span className="font-semibold text-slate-700">{totalAssigned} class{totalAssigned !== 1 ? "es" : ""}</span> assigned
          </p>
        </div>

        <div className="min-w-[240px] max-w-[320px] rounded-2xl border border-[var(--theme-border)] bg-white px-4 py-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Current Assignments
          </div>
          {assignmentSummary.length === 0 ? (
            <div className="text-xs text-slate-400">No classes assigned yet.</div>
          ) : (
            <div className="space-y-2 text-xs text-slate-600">
              {assignmentSummary.map((item) => (
                <div key={item.subject}>
                  <div className="font-semibold text-slate-700">{item.subject}</div>
                  <div className="leading-5 text-slate-500">
                    {item.classes.length > 0 ? item.classes.join(", ") : "No classes"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {teacherSubjects.length === 0 ? (
        <Empty
          description="This teacher has no subjects assigned. Add subjects first."
          className="py-10"
        />
      ) : (
        <>
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Subject
            </label>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map((subject) => {
                const isActive = selectedSubject === subject.key;
                return (
                  <button
                    key={subject.key}
                    onClick={() => setSelectedSubject(subject.key)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm"
                        : "border-[var(--theme-border)] bg-white text-slate-600 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    {subject.name}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSubject && (
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Year
              </label>
              <Select
                value={selectedYear ?? undefined}
                onChange={(value) => setSelectedYear(value)}
                className="w-full max-w-xs"
                placeholder="Select a year"
                loading={yearsLoading || subjectClassesLoading}
              >
                {availableYears.map((year) => (
                  <Select.Option key={year.id} value={year.id}>
                    {year.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {!selectedSubject || !selectedYear ? null : loading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : classRows.length === 0 ? (
            <Empty description="No classes found for this year" className="py-6" />
          ) : (
            <div className="max-h-[400px] overflow-y-auto rounded-xl border border-[var(--theme-border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[var(--theme-soft)] text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-4 text-left">#</th>
                    <th className="py-2.5 px-4 text-left">Class</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classRows.map((cls, index) => {
                    const busy = busyClassIds.has(cls.id);
                    return (
                      <tr
                        key={cls.id}
                        className="border-t border-[var(--theme-border)] transition-colors hover:bg-[var(--theme-soft)]"
                      >
                        <td className="py-2.5 px-4 text-slate-500 font-medium">{index + 1}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{cls.name}</td>
                        <td className="py-2.5 px-4 text-center">
                          {cls.isAssigned ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {cls.isAssigned ? (
                            <button
                              disabled={busy}
                              onClick={() => handleUnassign(cls.id)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              {busy ? "..." : "Unassign"}
                            </button>
                          ) : (
                            <button
                              disabled={busy}
                              onClick={() => handleAssign(cls.id)}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                            >
                              {busy ? "..." : "Assign"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
