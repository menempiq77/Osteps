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
import { createSubjectClass, fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
interface ApiClass {
  id: string;
  class_name: string;
  teacher_id: number;
  year_id: number;
  number_of_terms: string;
  teacher_name?: string;
  color?: string;
  base_class_label?: string;
}

type SubjectClassRow = {
  id?: number | string;
  year_id?: number | string | null;
  base_class_label?: string | null;
  name?: string | null;
};

const normalizeLabel = (value: unknown) => String(value ?? "").trim().toLowerCase();

const mapSubjectClassToApiClass = (row: SubjectClassRow): ApiClass => ({
  id: String(row.id ?? ""),
  class_name: String(row.base_class_label ?? row.name ?? `Class ${row.id ?? ""}`),
  teacher_id: 0,
  year_id: Number(row.year_id ?? 0),
  number_of_terms: "three",
  base_class_label: String(row.base_class_label ?? row.name ?? ""),
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
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const { activeSubjectId, activeSubject, canUseSubjectContext } = useSubjectContext();
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const isTeacher = currentUser?.role === "TEACHER";
  const isSubjectWorkspaceMode = canUseSubjectContext && !!activeSubjectId;
  const classesOrderStorageKey = `classes-order-${year_id ?? "all"}-${currentUser?.school ?? "global"}`;
  const classesColorStorageKey = `classes-colors-${currentUser?.school ?? "global"}`;

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
  const loadClasses = async () => {
    let classesData: any[] = [];
    try {
      setLoading(true);

      if (isSubjectWorkspaceMode && activeSubjectId) {
        const subjectClasses = (await fetchSubjectClasses({
          subject_id: Number(activeSubjectId),
          year_id: year_id ? Number(year_id) : undefined,
        })) as SubjectClassRow[];
        classesData = (Array.isArray(subjectClasses) ? subjectClasses : []).map(
          mapSubjectClassToApiClass
        );
      } else if (isTeacher) {
        const res = await fetchAssignYears();

        classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);

        classesData = Array.from(
          new Map(classesData.map((cls: any) => [cls.id, cls])).values()
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
            new Map(classesData.map((cls: any) => [cls.id, cls])).values()
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
}, [year_id, isTeacher, currentUser?.school, isSubjectWorkspaceMode, activeSubjectId]);

useEffect(() => {
  const loadClassStats = async () => {
    if (!classes.length) {
      setClassStats({});
      return;
    }

    const entries = await Promise.all(
      classes.map(async (cls) => {
        try {
          if (isSubjectWorkspaceMode && activeSubjectId) {
            const yearClasses = ((await fetchClasses(String(cls.year_id))) || []) as Array<{
              id: string | number;
              class_name?: string;
            }>;
            const targetLabel = normalizeLabel(cls.base_class_label ?? cls.class_name);
            const matchedBaseClass = yearClasses.find(
              (item) => normalizeLabel(item.class_name) === targetLabel
            );

            if (!matchedBaseClass) {
              return [String(cls.id), { students: 0 }] as const;
            }

            const students = await fetchStudents(matchedBaseClass.id);
            const total = Array.isArray(students)
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
              : 0;
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
        const response = await createSubjectClass({
          subject_id: Number(activeSubjectId),
          year_id: parseInt(year_id),
          name: classData.class_name,
          base_class_label: classData.class_name,
        });

        const subjectClasses = (await fetchSubjectClasses({
          subject_id: Number(activeSubjectId),
          year_id: parseInt(year_id),
        })) as SubjectClassRow[];
        const nextClasses = applySavedOrder(
          applySavedColors((Array.isArray(subjectClasses) ? subjectClasses : []).map(mapSubjectClassToApiClass))
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
      setError(err instanceof Error ? err.message : "Failed to add class");
      console.error(err);
      messageApi.error("Failed to delete Class");
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

      const updatedClass = await updateClass(parseInt(currentClass.id), {
        class_name: classData.class_name,
        number_of_terms: classData.number_of_terms,
        year_id: currentClass.year_id,
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

  const handleDeleteClass = async (id: string) => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete classes.");
      return;
    }
    try {
      await deleteClass(parseInt(id));
      setClasses(classes.filter((cls) => cls.id !== id));
      messageApi.success("Class deleted successfully");
    } catch (err) {
      setError("Failed to delete class");
      console.error(err);
      messageApi.error("Failed to delete Class");
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
              Organize classes as folders and drag cards to set display order.
            </p>
          </div>
          {hasAccess && !!year_id && (
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

      <ClassesList
        classes={classes}
        onDeleteClass={handleDeleteClass}
        onEditClass={(cls) => {
          setCurrentClass(cls);
          setModalOpen(true);
        }}
        onReorderClasses={handleReorderClasses}
        classStats={classStats}
        subjectScoped={isSubjectWorkspaceMode}
      />
    </div>
  );
}
