"use client";
import React, { useState, useEffect } from "react";
import AddClassForm from "@/components/dashboard/AddClassForm";
import ClassesList from "@/components/dashboard/ClassesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { Breadcrumb, Spin, Modal, Button, message } from "antd";
import Link from "next/link";
import { addClass, deleteClass, fetchClasses, updateClass } from "@/services/classesApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchStudents } from "@/services/studentsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  archiveSubjectClass,
  createSubjectClass,
  fetchSubjectClasses,
  permanentlyDeleteSubjectClass,
  restoreSubjectClass,
} from "@/services/subjectWorkspaceApi";
import { filterStudentsBySubjectScope, studentMatchesSubjectScope } from "@/lib/subjectStudentScope";
import {
  makeSubjectHintScopeKey,
  matchesSubjectStudentHint,
  readSubjectStudentHints,
} from "@/lib/subjectStudentHints";
import {
  readSubjectClassBaseMap,
  resolveSubjectClassLinkedIdWithFallback,
  writeSubjectClassBaseEntry,
} from "@/lib/subjectClassResolution";
interface ApiClass {
  id: string;
  class_name: string;
  teacher_id: number;
  year_id: number;
  number_of_terms: string;
  teacher_name?: string;
  color?: string;
  base_class_label?: string;
  linked_class_id?: string;
  is_active?: boolean;
}

type SubjectClassRow = {
  id?: number | string;
  year_id?: number | string | null;
  base_class_label?: string | null;
  name?: string | null;
  class_id?: number | string | null;
  base_class_id?: number | string | null;
  class?: { id?: number | string | null } | null;
  classes?: { id?: number | string | null } | null;
  base_class?: { id?: number | string | null } | null;
  is_active?: number | boolean | null;
};

const normalizeLabel = (value: unknown) => String(value ?? "").trim().toLowerCase();

const extractStudentSubjectClassIds = (student: Record<string, any>) =>
  [
    student?.subject_class_id,
    student?.subjectClassId,
    student?.pivot?.subject_class_id,
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

const mapSubjectClassToApiClass = (row: SubjectClassRow): ApiClass => ({
  id: String(row.id ?? ""),
  class_name: String(row.base_class_label ?? row.name ?? `Class ${row.id ?? ""}`),
  teacher_id: 0,
  year_id: Number(row.year_id ?? 0),
  number_of_terms: "three",
  base_class_label: String(row.base_class_label ?? row.name ?? ""),
  linked_class_id: String(
    row.class_id ??
      row.base_class_id ??
      row.class?.id ??
      row.classes?.id ??
      row.base_class?.id ??
      ""
  ).trim(),
  // Treat null/undefined is_active as inactive (null means the column existed but was never set to 1,
  // so the backend already excludes it from default queries via WHERE is_active = 1).
  // Only undefined means "backend has no is_active column at all" — fall back to active for compat.
  is_active: row.is_active === undefined ? true : Number(row.is_active) === 1,
});

export default function Page() {
  const searchParams = useSearchParams();
  const year_id = searchParams.get("year");

  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentClass, setCurrentClass] = useState<ApiClass | null>(null);
  const [classStats, setClassStats] = useState<Record<string, { students: number }>>({});
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const { activeSubjectId, activeSubject, canUseSubjectContext, loading: subjectContextLoading } = useSubjectContext();
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const isTeacher = currentUser?.role === "TEACHER";
  const isSubjectWorkspaceMode = canUseSubjectContext && !!activeSubjectId;
  const subjectStorageSuffix = isSubjectWorkspaceMode && activeSubjectId ? `-s${activeSubjectId}` : "";
  const classesOrderStorageKey = `classes-order-${year_id ?? "all"}-${currentUser?.school ?? "global"}${subjectStorageSuffix}`;
  const classesColorStorageKey = `classes-colors-${currentUser?.school ?? "global"}${subjectStorageSuffix}`;

  const readClassesColorMap = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(classesColorStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const writeClassesColorMap = (nextMap: Record<string, string>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(classesColorStorageKey, JSON.stringify(nextMap));
  };

  const applySavedColors = (list: ApiClass[]) => {
    const colorMap = readClassesColorMap();
    return list.map((cls) => ({
      ...cls,
      color: cls.color || colorMap[String(cls.id)] || "green",
    }));
  };

  const applySavedOrder = (list: ApiClass[]) => {
    if (typeof window === "undefined") return list;
    try {
      const raw = localStorage.getItem(classesOrderStorageKey);
      if (!raw) return list;
      const savedOrder: string[] = JSON.parse(raw);
      if (!Array.isArray(savedOrder) || savedOrder.length === 0) return list;
      const rank = new Map(savedOrder.map((id, index) => [String(id), index]));
      return [...list].sort((a, b) => {
        const aRank = rank.has(String(a.id)) ? (rank.get(String(a.id)) as number) : Number.MAX_SAFE_INTEGER;
        const bRank = rank.has(String(b.id)) ? (rank.get(String(b.id)) as number) : Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      });
    } catch {
      return list;
    }
  };

  const persistClassesOrder = (ordered: ApiClass[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      classesOrderStorageKey,
      JSON.stringify(ordered.map((cls) => String(cls.id)))
    );
  };

 useEffect(() => {
  if (subjectContextLoading) return;
  const loadClasses = async () => {
    let classesData: any[] = [];
    try {
      setLoading(true);

      if (isSubjectWorkspaceMode && activeSubjectId) {
        const subjectClasses = (await fetchSubjectClasses({
          subject_id: Number(activeSubjectId),
          year_id: year_id ? Number(year_id) : undefined,
          include_inactive: true,
        })) as SubjectClassRow[];
        classesData = await Promise.all(
          (Array.isArray(subjectClasses) ? subjectClasses : []).map(async (row) => {
            const mapped = mapSubjectClassToApiClass(row);
            const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
              row,
              Number(activeSubjectId)
            );
            return {
              ...mapped,
              linked_class_id: linkedClassId || mapped.linked_class_id,
            };
          })
        );
        classesData = classesData.filter(
          (row) => Boolean(row) && Boolean(row.id) && Boolean(row.is_active) !== showArchived
        );
      } else if (isTeacher) {
        const res = await fetchAssignYears();

        classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);

        classesData = Array.from(
          new Map(classesData.map((cls: any) => [String(cls.id), cls] as const)).values()
        );

        if (year_id) {
          classesData = classesData.filter(
            (cls: any) => cls.year_id === Number(year_id)
          );
        }
      } else {
        if (!year_id) {
          const schoolId = Number(currentUser?.school);
          if (!schoolId) {
            setError("School is missing for current user");
            return;
          }

          const years = await fetchYearsBySchool(schoolId);
          const byYear = await Promise.all(
            (years || []).map((year: any) => fetchClasses(String(year.id)))
          );
          classesData = byYear.flat();

          classesData = Array.from(
            new Map(classesData.map((cls: any) => [String(cls.id), cls] as const)).values()
          );
        } else {
          classesData = await fetchClasses(year_id);
        }
      }

      setClasses(applySavedOrder(applySavedColors(classesData)));
    } catch (err) {
      setError("Failed to fetch classes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadClasses();
}, [year_id, isTeacher, currentUser?.school, isSubjectWorkspaceMode, activeSubjectId, subjectContextLoading, showArchived]);

useEffect(() => {
  const loadClassStats = async () => {
    if (!classes.length) {
      setClassStats({});
      return;
    }

    const baseClassesByYear = new Map<number, any[]>();
    const getBaseClassesForYear = async (yearId: number) => {
      if (baseClassesByYear.has(yearId)) {
        return baseClassesByYear.get(yearId) as any[];
      }
      try {
        const rows = await fetchClasses(String(yearId));
        const list = Array.isArray(rows) ? rows : [];
        baseClassesByYear.set(yearId, list);
        return list;
      } catch {
        baseClassesByYear.set(yearId, []);
        return [];
      }
    };

    const entries = await Promise.all(
      classes.map(async (cls) => {
        try {
          if (isSubjectWorkspaceMode && activeSubjectId) {
            const storedBaseId = readSubjectClassBaseMap(Number(activeSubjectId))[String(cls.id)] ?? "";
            let linkedClassId = String(cls.linked_class_id ?? "").trim() || storedBaseId;

            if (!linkedClassId && Number(cls.year_id) > 0) {
              const baseRows = await getBaseClassesForYear(Number(cls.year_id));
              const targetLabel = normalizeLabel(cls.base_class_label || cls.class_name);
              const matched = (Array.isArray(baseRows) ? baseRows : []).find(
                (row: any) => normalizeLabel(row?.class_name ?? row?.name) === targetLabel
              );
              linkedClassId = String(matched?.id ?? "").trim();
            }

            if (!linkedClassId) {
              return [String(cls.id), { students: 0 }] as const;
            }

            const students = await fetchStudents(linkedClassId, Number(activeSubjectId));
            const studentRows = Array.isArray(students) ? students : [];
            const inScopeRows = filterStudentsBySubjectScope(
              studentRows,
              {
                subjectId: Number(activeSubjectId),
                subjectName: activeSubject?.name,
                subjectClassId: cls.id,
              }
            );

            const hintScopeKey = makeSubjectHintScopeKey(Number(activeSubjectId), cls.id);
            const hintBucket = readSubjectStudentHints(hintScopeKey);
            const hintedRows = studentRows.filter((student: any) => {
              if (
                studentMatchesSubjectScope(student, {
                  subjectId: Number(activeSubjectId),
                  subjectName: activeSubject?.name,
                  subjectClassId: cls.id,
                })
              ) {
                return false;
              }

              const scopedIds = extractStudentSubjectClassIds(student);
              if (scopedIds.length > 0) return false;
              return matchesSubjectStudentHint(student, hintBucket);
            });

            const total = new Set(
              [...inScopeRows, ...hintedRows]
                .map((student: any) => String(student?.id ?? "").trim())
                .filter(Boolean)
            ).size;
            return [String(cls.id), { students: total }] as const;
          }

          const students = await fetchStudents(cls.id);
          const total = Array.isArray(students)
            ? isSubjectWorkspaceMode
              ? students.filter((student: any) => {
                  const rawSubjects = Array.isArray(student.subjects)
                    ? student.subjects
                    : student.subject_name
                      ? [student.subject_name]
                      : student.subject
                        ? [student.subject]
                        : [];
                  return rawSubjects.some((item: any) => {
                    const name =
                      typeof item === "string"
                        ? item
                        : item && typeof item === "object"
                          ? item.name ?? item.subject_name ?? ""
                          : "";
                    return (
                      String(name ?? "")
                        .replace(/islamiat/gi, "Islamic")
                        .trim()
                        .toLowerCase() ===
                      String(activeSubject?.name ?? "")
                        .replace(/islamiat/gi, "Islamic")
                        .trim()
                        .toLowerCase()
                    );
                  });
                }).length
              : students.length
            : 0;
          return [String(cls.id), { students: total }] as const;
        } catch {
          return [String(cls.id), { students: 0 }] as const;
        }
      })
    );
    setClassStats(Object.fromEntries(entries));
  };

  loadClassStats();
}, [classes, isSubjectWorkspaceMode, activeSubject?.name]);

  const handleReorderClasses = (ordered: {
    id: string;
    class_name: string;
    teacher_id: number;
    year_id: number;
    number_of_terms: string;
    teacher_name?: string;
    color?: string;
  }[]) => {
    const orderedIds = new Set(ordered.map((c) => String(c.id)));
    const remaining = classes.filter((c) => !orderedIds.has(String(c.id)));
    const next = [...ordered, ...remaining] as ApiClass[];
    setClasses(next);
    persistClassesOrder(next);
  };

  const handleAddClass = async (classData: {
    class_name: string;
    number_of_terms: string;
    color?: string;
  }) => {
    try {
      if (!year_id) {
        throw new Error("Year parameter is missing");
      }

      if (isSubjectWorkspaceMode && activeSubjectId) {
        // Create a base class first so add-student API has a valid class_id
        const baseClassResponse = await addClass({
          class_name: classData.class_name,
          number_of_terms: classData.number_of_terms || "three",
          year_id: parseInt(year_id),
        });
        const baseClassId = String(
          baseClassResponse?.data?.id ?? baseClassResponse?.id ?? ""
        ).trim();

        const response = await createSubjectClass({
          subject_id: Number(activeSubjectId),
          year_id: parseInt(year_id),
          name: classData.class_name,
          base_class_label: classData.class_name,
        });

        // Store subject_class → base_class mapping in localStorage for student add flow
        const createdSubjectClassId = String(
          response?.data?.id ?? response?.id ?? ""
        ).trim();
        if (baseClassId && createdSubjectClassId) {
          writeSubjectClassBaseEntry(
            Number(activeSubjectId),
            createdSubjectClassId,
            baseClassId
          );
        }

        const subjectClasses = (await fetchSubjectClasses({
          subject_id: Number(activeSubjectId),
          year_id: parseInt(year_id),
        })) as SubjectClassRow[];
        const nextClasses = applySavedOrder(
          applySavedColors(
            await Promise.all(
              (Array.isArray(subjectClasses) ? subjectClasses : []).map(async (row) => {
                const mapped = mapSubjectClassToApiClass(row);
                const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
                  row,
                  Number(activeSubjectId)
                );
                return {
                  ...mapped,
                  linked_class_id: linkedClassId || mapped.linked_class_id,
                };
              })
            )
          )
        );
        const createdId = String(response?.data?.id ?? subjectClasses.at(-1)?.id ?? "");
        setClasses(nextClasses.map((item) =>
          String(item.id) === createdId ? { ...item, color: classData.color || item.color || "green" } : item
        ));
        writeClassesColorMap({
          ...readClassesColorMap(),
          [createdId]: classData.color || "green",
        });
        setModalOpen(false);
        messageApi.success("Class added successfully");
        return;
      }

      const response = await addClass({
        class_name: classData.class_name,
        number_of_terms: classData.number_of_terms,
        year_id: parseInt(year_id),
      });
      const added = { ...response.data, color: classData.color || "green" };
      setClasses([...classes, added]);
      writeClassesColorMap({
        ...readClassesColorMap(),
        [String(added.id)]: added.color as string,
      });
      setModalOpen(false);
      messageApi.success("Class added successfully");
    } catch (err) {
      let backendMessage =
        (err as any)?.response?.data?.msg ||
        (err as any)?.response?.data?.message ||
        (err as any)?.response?.data?.data?.message ||
        (err instanceof Error ? err.message : "Failed to add class");
      
      // Detect duplicate key constraint violation and provide friendly message
      const messageStr = String(backendMessage ?? "");
      if (messageStr.includes("Duplicate entry") && messageStr.includes("subject_classes_school_subject_name_unique")) {
        backendMessage = `A class named "${classData.class_name}" already exists for this subject. Please use a different name.`;
      }
      
      setError(String(backendMessage));
      console.error(err);
      messageApi.error(String(backendMessage || "Failed to add class"));
    }
  };

  const handleEditClass = async (classData: {
    class_name: string;
    number_of_terms: string;
    color?: string;
  }) => {
    try {
      if (!currentClass?.id) {
        throw new Error("Class ID is missing");
      }

      const updatedClass = await updateClass(String(currentClass.id), {
        class_name: classData.class_name,
        number_of_terms: classData.number_of_terms,
      });

      setClasses(
        classes.map((cls) =>
          cls.id === currentClass.id
            ? { ...updatedClass.data, color: classData.color || cls.color || "green" }
            : cls
        )
      );
      writeClassesColorMap({
        ...readClassesColorMap(),
        [String(currentClass.id)]: classData.color || currentClass.color || "green",
      });
      setCurrentClass(null);
      setModalOpen(false);
      messageApi.success("Class Update successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update class");
      console.error(err);
      messageApi.error("Failed to Update Class");
    }
  };

  const confirmDeleteClass = (id: string) => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete classes.");
      return;
    }
    setClassToDelete(id);
    setIsDeleteClassModalOpen(true);
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;
    const id = classToDelete;

    if (isSubjectWorkspaceMode && activeSubjectId) {
      try {
        if (showArchived) {
          await permanentlyDeleteSubjectClass(Number(id));
          messageApi.success("Class deleted permanently.");
        } else {
          await archiveSubjectClass(Number(id));
          messageApi.success("Class archived.");
        }
        setClasses(classes.filter((cls) => String(cls.id) !== String(id)));
        setIsDeleteClassModalOpen(false);
        setClassToDelete(null);
        return;
      } catch (err) {
        const backendMessage =
          (err as any)?.response?.data?.msg ||
          (err as any)?.response?.data?.message ||
          (err as Error)?.message ||
          (showArchived ? "Failed to delete class permanently." : "Failed to archive class.");
        setError(String(backendMessage));
        messageApi.error(String(backendMessage));
        return;
      }
    }

    try {
      await deleteClass(parseInt(id));
      setClasses(classes.filter((cls) => cls.id !== id));
      setIsDeleteClassModalOpen(false);
      setClassToDelete(null);
      messageApi.success("Class deleted successfully");
    } catch (err) {
      setError("Failed to delete class");
      console.error(err);
      messageApi.error("Failed to delete Class");
    }
  };

  const handleRestoreClass = async (id: string) => {
    if (!isSubjectWorkspaceMode || !activeSubjectId) return;
    try {
      await restoreSubjectClass(Number(id));
      setClasses(classes.filter((cls) => String(cls.id) !== String(id)));
      messageApi.success("Class restored.");
    } catch (err) {
      const backendMessage =
        (err as any)?.response?.data?.msg ||
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        "Failed to restore class.";
      setError(String(backendMessage));
      messageApi.error(String(backendMessage));
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="premium-page rounded-2xl p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/dashboard/years">Academic Years</Link>,
          },
          {
            title: <span>Classes</span>,
          },
        ]}
        className="!mb-2"
      />

      <div className="premium-hero mb-6 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Classes</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isSubjectWorkspaceMode
                ? "Manage active and archived subject classes from one place."
                : "Organize classes as folders and drag cards to set display order."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSubjectWorkspaceMode ? (
              <div className="inline-flex rounded-full border border-emerald-200 bg-white p-1">
                <button
                  onClick={() => setShowArchived(false)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
                    !showArchived
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:text-emerald-700"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setShowArchived(true)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
                    showArchived
                      ? "bg-amber-100 text-amber-700"
                      : "text-gray-600 hover:text-amber-700"
                  }`}
                >
                  Archived
                </button>
              </div>
            ) : null}
            {hasAccess && !!year_id && !showArchived && (
              <Button
                type="primary"
                className="!bg-emerald-600 !border-emerald-600 !text-white hover:!bg-emerald-700 !cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                Add Class
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={currentClass ? "Edit Class" : "Add New Class"}
        open={modalOpen}
        onCancel={() => {
          setCurrentClass(null);
          setModalOpen(false);
        }}
        footer={null}
      >
        <AddClassForm
          onSubmit={currentClass ? handleEditClass : handleAddClass}
          initialData={currentClass}
          visible={modalOpen}
          onCancel={() => setModalOpen(false)}
          hideTerms={isSubjectWorkspaceMode}
        />
      </Modal>

      <Modal
        title={
          isSubjectWorkspaceMode
            ? showArchived
              ? "Delete Class Forever"
              : "Archive Class"
            : "Delete Class"
        }
        open={isDeleteClassModalOpen}
        onOk={handleDeleteClass}
        onCancel={() => {
          setIsDeleteClassModalOpen(false);
          setClassToDelete(null);
        }}
        okText={isSubjectWorkspaceMode ? (showArchived ? "Delete Forever" : "Archive") : "Delete"}
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {classToDelete && (() => {
          const cls = classes.find((c) => String(c.id) === String(classToDelete));
          const stats = classStats[String(classToDelete)] ?? { students: 0 };
          return (
            <div className="space-y-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {cls?.class_name ?? `Class ${classToDelete}`}
              </p>
              <p>Students: <span className="font-medium">{stats.students}</span></p>
              {isSubjectWorkspaceMode ? (
                showArchived ? (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-3 text-rose-900">
                    This will permanently delete the archived subject class and remove its related subject enrollments and subject-class assignments. This cannot be undone.
                  </div>
                ) : (
                  <p>
                    This will archive the class from the current subject workspace. Archived classes are removed from normal assignment flows and can be restored later from the Archived view.
                  </p>
                )
              ) : (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-3 text-rose-900">
                  This will permanently delete the class and cannot be undone. Are you sure?
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      <ClassesList
        classes={classes}
        onDeleteClass={confirmDeleteClass}
        onRestoreClass={handleRestoreClass}
        onEditClass={(cls) => {
          setCurrentClass(cls);
          setModalOpen(true);
        }}
        onReorderClasses={handleReorderClasses}
        classStats={classStats}
        subjectScoped={isSubjectWorkspaceMode}
        archivedView={showArchived}
      />
    </div>
  );
}
