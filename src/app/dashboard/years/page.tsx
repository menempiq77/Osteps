"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import YearForm from "@/components/dashboard/YearForm";
import YearsList from "@/components/dashboard/YearsList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Breadcrumb, Spin, Modal } from "antd";
import Link from "next/link";
import {
  addYear as addYearApi,
  deleteYear as deleteYearApi,
  updateYear as updateYearApi,
  fetchYearsBySchool,
  fetchAssignYears,
} from "@/services/yearsApi";
import { fetchClasses, updateClass } from "@/services/classesApi";
import { fetchTerm, addTerm, deleteTerm } from "@/services/termsApi";
import { fetchStudents } from "@/services/studentsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { deactivateSubjectClassesByYear, fetchSubjectClasses, isMissingSubjectWorkspaceRoute } from "@/services/subjectWorkspaceApi";
import { filterStudentsBySubjectScope, studentMatchesSubjectScope } from "@/lib/subjectStudentScope";
import { makeSubjectHintScopeKey, matchesSubjectStudentHint, readSubjectStudentHints } from "@/lib/subjectStudentHints";
import { readSubjectClassBaseMap, resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";

interface Year {
  id: number;
  name: string;
  school_id?: number;
  terms?: any;
  created_at?: string;
  updated_at?: string;
  color?: string;
  number_of_terms?: string;
}

type SubjectClassRow = {
  id?: number | string | null;
  year_id?: number | string | null;
  name?: string | null;
  base_class_label?: string | null;
  class_id?: number | string | null;
  base_class_id?: number | string | null;
  class?: {
    id?: number | string | null;
    year_id?: number | string | null;
  } | null;
  classes?: {
    id?: number | string | null;
    year_id?: number | string | null;
  } | null;
  base_class?: {
    id?: number | string | null;
    year_id?: number | string | null;
  } | null;
};

const resolveSubjectClassYearId = (row: SubjectClassRow): number =>
  Number(
    row.year_id ??
      row.class?.year_id ??
      row.classes?.year_id ??
      row.base_class?.year_id ??
      0
  );

const resolveSubjectClassLinkedId = (row: SubjectClassRow): string =>
  String(
    row.class_id ??
      row.base_class_id ??
      row.class?.id ??
      row.classes?.id ??
      row.base_class?.id ??
      ""
  ).trim();

const resolveSubjectClassLabel = (row: SubjectClassRow): string =>
  String(
    row.base_class_label ??
      row.name ??
      row.class?.id ??
      row.classes?.id ??
      row.base_class?.id ??
      ""
  ).trim();

const normalizeClassLabel = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const extractStudentSubjectClassIds = (student: Record<string, any>) =>
  [
    student?.subject_class_id,
    student?.subjectClassId,
    student?.pivot?.subject_class_id,
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

const hasAnySubjectMarkers = (student: Record<string, any>) =>
  extractStudentSubjectClassIds(student).length > 0 ||
  (Array.isArray(student?.subjects) && student.subjects.length > 0) ||
  !!student?.subject_name ||
  !!student?.subject;

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<Year | null>(null);
  const [yearStats, setYearStats] = useState<
    Record<number, { classes: number; students: number }>
  >({});
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const { activeSubjectId, activeSubject, canUseSubjectContext, loading: subjectContextLoading } = useSubjectContext();
  const schoolId = currentUser?.school;
  const isTeacher = currentUser?.role === "TEACHER";
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const isSubjectWorkspaceMode = canUseSubjectContext && !!activeSubjectId;
  const formattedSubjectName = String(activeSubject?.name ?? "")
    .replace(/islamiat/gi, "Islamic")
    .trim();
  const pageTitle = isSubjectWorkspaceMode && formattedSubjectName
    ? `Academic Years - ${formattedSubjectName}`
    : "Academic Years";
  const subjectStorageSuffix = isSubjectWorkspaceMode && activeSubjectId ? `-s${activeSubjectId}` : "";
  const yearOrderStorageKey = `years-order-${schoolId ?? "global"}${subjectStorageSuffix}`;
  const yearColorStorageKey = `years-colors-${schoolId ?? "global"}${subjectStorageSuffix}`;
  const hiddenYearsStorageKey = activeSubjectId ? `hidden-subject-years-s${activeSubjectId}` : null;
  const addedYearsStorageKey = activeSubjectId ? `added-subject-years-s${activeSubjectId}` : null;

  const readHiddenYears = (): number[] => {
    if (typeof window === "undefined" || !hiddenYearsStorageKey) return [];
    try {
      const raw = localStorage.getItem(hiddenYearsStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const addHiddenYear = (yearId: number) => {
    if (typeof window === "undefined" || !hiddenYearsStorageKey) return;
    const next = Array.from(new Set([...readHiddenYears(), yearId]));
    localStorage.setItem(hiddenYearsStorageKey, JSON.stringify(next));
  };

  const readAddedYears = (): number[] => {
    if (typeof window === "undefined" || !addedYearsStorageKey) return [];
    try {
      const raw = localStorage.getItem(addedYearsStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0)
        : [];
    } catch {
      return [];
    }
  };

  const addAddedYear = (yearId: number) => {
    if (typeof window === "undefined" || !addedYearsStorageKey) return;
    const next = Array.from(new Set([...readAddedYears(), yearId]));
    localStorage.setItem(addedYearsStorageKey, JSON.stringify(next));
  };

  const removeAddedYear = (yearId: number) => {
    if (typeof window === "undefined" || !addedYearsStorageKey) return;
    const next = readAddedYears().filter((id) => id !== yearId);
    localStorage.setItem(addedYearsStorageKey, JSON.stringify(next));
  };

  const readYearColorMap = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(yearColorStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const writeYearColorMap = (nextMap: Record<string, string>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(yearColorStorageKey, JSON.stringify(nextMap));
  };

  const applySavedYearColors = (list: Year[]) => {
    const colorMap = readYearColorMap();
    return list.map((year) => ({
      ...year,
      color: year.color || colorMap[String(year.id)] || "green",
    }));
  };

  const applySavedOrder = (list: Year[]) => {
    if (typeof window === "undefined") return list;
    try {
      const raw = localStorage.getItem(yearOrderStorageKey);
      if (!raw) return list;
      const savedOrder: number[] = JSON.parse(raw);
      if (!Array.isArray(savedOrder) || savedOrder.length === 0) return list;
      const rank = new Map(savedOrder.map((id, index) => [id, index]));
      return [...list].sort((a, b) => {
        const aRank = rank.has(a.id) ? (rank.get(a.id) as number) : Number.MAX_SAFE_INTEGER;
        const bRank = rank.has(b.id) ? (rank.get(b.id) as number) : Number.MAX_SAFE_INTEGER;
        return aRank - bRank || a.id - b.id;
      });
    } catch {
      return list;
    }
  };

  useEffect(() => {
    if (subjectContextLoading) return;
    const loadYears = async () => {
    try {
      let yearsData = [];

      if (isSubjectWorkspaceMode && activeSubjectId && isTeacher) {
        // Teacher + subject workspace: intersect by base_class_label + year_id
        const [res, subjectClasses] = await Promise.all([
          fetchAssignYears(),
          fetchSubjectClasses({ subject_id: Number(activeSubjectId) }) as Promise<SubjectClassRow[]>,
        ]);

        const subjectLabelKeys = new Set(
          (Array.isArray(subjectClasses) ? subjectClasses : []).map((row) => {
            const label = String(row.base_class_label ?? row.name ?? "").trim().toLowerCase();
            const yId = String(row.year_id ?? "");
            return `${label}::${yId}`;
          })
        );

        const filtered = (Array.isArray(res) ? res : []).filter((item: any) => {
          const cls = item?.classes;
          if (!cls) return false;
          const className = String(cls.class_name ?? "").trim().toLowerCase();
          const yId = String(cls.year_id ?? "");
          return subjectLabelKeys.has(`${className}::${yId}`);
        });

        const years = filtered
          .map((item: any) => item.classes?.year)
          .filter((year: any) => year);

        yearsData = Array.from(
          new Map(years.map((year: any) => [year.id, year])).values()
        );
      } else if (isSubjectWorkspaceMode && activeSubjectId) {
        const [schoolYears, subjectClasses] = await Promise.all([
          fetchYearsBySchool(Number(schoolId)),
          fetchSubjectClasses({ subject_id: Number(activeSubjectId) }) as Promise<SubjectClassRow[]>,
        ]);

        const subjectClassYearIds = (Array.isArray(subjectClasses) ? subjectClasses : [])
          .map((item) => resolveSubjectClassYearId(item))
          .filter((id) => Number.isFinite(id) && id > 0);

        const allowedIds = new Set([
          ...subjectClassYearIds,
          ...readAddedYears(),
        ]);
        yearsData = (Array.isArray(schoolYears) ? schoolYears : []).filter((year: any) =>
          allowedIds.has(Number(year?.id))
        );
      } else if (isTeacher) {
        const res = await fetchAssignYears();

        const years = res
          .map((item: any) => item.classes?.year)
          .filter((year: any) => year);

        yearsData = Array.from(
          new Map(years.map((year: any) => [year.id, year])).values()
        );
      } else {
        const res = await fetchYearsBySchool(Number(schoolId));
        yearsData = res;
      }

      setYears(applySavedOrder(applySavedYearColors(yearsData as Year[])));
    } catch (err) {
      setError("Failed to load years");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadYears();
}, [schoolId, isTeacher, isSubjectWorkspaceMode, activeSubjectId, subjectContextLoading]);

  useEffect(() => {
    const loadYearStats = async () => {
      if (!years.length) {
        setYearStats({});
        return;
      }

      const statsEntries = await Promise.all(
        years.map(async (year) => {
          try {
            if (isSubjectWorkspaceMode && activeSubjectId) {
              const collectScopedStudentRows = (
                studentRows: Array<Record<string, any>>,
                subjectClassId: string
              ) => {
                const inScopeRows = filterStudentsBySubjectScope(studentRows, {
                  subjectId: Number(activeSubjectId),
                  subjectName: activeSubject?.name,
                  subjectClassId,
                });

                const hintScopeKey = makeSubjectHintScopeKey(Number(activeSubjectId), subjectClassId);
                const hintBucket = readSubjectStudentHints(hintScopeKey);
                const hintedRows = studentRows.filter((student: any) => {
                  if (
                    studentMatchesSubjectScope(student, {
                      subjectId: Number(activeSubjectId),
                      subjectName: activeSubject?.name,
                      subjectClassId,
                    })
                  ) {
                    return false;
                  }

                  const scopedIds = extractStudentSubjectClassIds(student);
                  if (scopedIds.length > 0) return false;
                  return matchesSubjectStudentHint(student, hintBucket);
                });

                const combinedRows = [...inScopeRows, ...hintedRows];
                const safeFallbackRows =
                  combinedRows.length === 0 &&
                  studentRows.length > 0 &&
                  !studentRows.some((student: any) => hasAnySubjectMarkers(student))
                    ? studentRows
                    : [];

                return combinedRows.length > 0
                  ? combinedRows
                  : safeFallbackRows.length > 0
                    ? safeFallbackRows
                    : studentRows;
              };

              const subjectClasses = (await fetchSubjectClasses({
                subject_id: Number(activeSubjectId),
                year_id: Number(year.id),
              })) as SubjectClassRow[];
              const classesForYear = (Array.isArray(subjectClasses) ? subjectClasses : []).filter(
                (row) => resolveSubjectClassYearId(row) === Number(year.id)
              );
              const studentCounts = await Promise.all(
                classesForYear.map(async (row) => {
                  const subjectClassId = String(row?.id ?? "").trim();
                  const storedBaseId =
                    readSubjectClassBaseMap(Number(activeSubjectId))[subjectClassId] ?? "";
                  const resolvedLinkedClassId =
                    (await resolveSubjectClassLinkedIdWithFallback(
                      row,
                      Number(activeSubjectId)
                    )) || String(storedBaseId).trim();

                  if (!subjectClassId) return 0;
                  try {
                    const requestTargets = Array.from(
                      new Set(
                        [resolvedLinkedClassId, subjectClassId]
                          .map((value) => String(value ?? "").trim())
                          .filter(Boolean)
                      )
                    );

                    let finalRows: Array<Record<string, any>> = [];

                    for (const targetClassId of requestTargets) {
                      const students = await fetchStudents(
                        targetClassId,
                        Number(activeSubjectId),
                        subjectClassId
                      );
                      const studentRows = Array.isArray(students) ? students : [];
                      const candidateRows = collectScopedStudentRows(studentRows, subjectClassId);

                      if (candidateRows.length > 0) {
                        finalRows = candidateRows;
                        break;
                      }

                      if (finalRows.length === 0) {
                        finalRows = candidateRows;
                      }
                    }

                    return new Set(
                      finalRows
                        .map((student: any) => String(student?.id ?? "").trim())
                        .filter(Boolean)
                    ).size;
                  } catch {
                    return 0;
                  }
                })
              );
              const totalStudents = studentCounts.reduce((sum, count) => sum + count, 0);
              return [
                year.id,
                { classes: classesForYear.length, students: totalStudents },
              ] as const;
            }

            return [year.id, { classes: 0, students: 0 }] as const;
          } catch {
            return [year.id, { classes: 0, students: 0 }] as const;
          }
        })
      );

      setYearStats(Object.fromEntries(statsEntries));
    };

    loadYearStats();
  }, [years, isSubjectWorkspaceMode, activeSubjectId, activeSubject?.name]);

  const persistYearOrder = (orderedYears: Year[]) => {
    if (typeof window === "undefined") return;
    const ids = orderedYears.map((year) => year.id);
    localStorage.setItem(yearOrderStorageKey, JSON.stringify(ids));
  };

  const handleReorderYears = (orderedYears: { id: number; name: string }[]) => {
    const orderedIds = new Set(orderedYears.map((item) => item.id));
    const remaining = years.filter((year) => !orderedIds.has(year.id));
    const nextYears = [
      ...orderedYears.map((item) => years.find((y) => y.id === item.id) || item),
      ...remaining,
    ] as Year[];
    setYears(nextYears);
    persistYearOrder(nextYears);
  };

  const handleSubmitYear = async (data: { name: string; color?: string; number_of_terms?: string }) => {
    try {
      const { color, number_of_terms, ...payload } = data;
      const yearData =
        currentUser?.role === "SCHOOL_ADMIN"
          ? { ...payload, school_id: currentUser?.school }
          : payload;
      let createdYearId: number | null = null;

      if (currentYear) {
        await updateYearApi(String(currentYear.id), yearData);
        // If number_of_terms changed, propagate to all classes in this year
        if (number_of_terms) {
          const termLimitMap: Record<string, number> = { first: 1, two: 2, three: 3 };
          const termLimit = termLimitMap[number_of_terms] ?? Number(number_of_terms) ?? 3;
          console.log("[YearEdit] number_of_terms:", number_of_terms, "termLimit:", termLimit);
          try {
            const classes = await fetchClasses(String(currentYear.id));
            console.log("[YearEdit] classes fetched:", classes);
            await Promise.all(
              (Array.isArray(classes) ? classes : []).map(async (cls: any) => {
                const resolvedClassName = String(cls.class_name ?? cls.base_class_label ?? cls.name ?? "").trim();
                console.log("[YearEdit] updating class", cls.id, "class_name:", resolvedClassName, "with number_of_terms:", number_of_terms);
                const updateResp = await updateClass(String(cls.id), { class_name: resolvedClassName, number_of_terms, year_id: Number(cls.year_id) });
                console.log("[YearEdit] updateClass response:", updateResp);
                // Delete excess terms beyond the new limit
                if (Number.isFinite(termLimit) && termLimit > 0) {
                  try {
                    const terms: any[] = (await fetchTerm(Number(cls.id))) ?? [];
                    console.log("[YearEdit] terms for class", cls.id, ":", terms);
                    const sorted = [...terms].sort((a, b) => Number(a.id) - Number(b.id));
                    // Delete excess terms if reducing
                    const excess = sorted.slice(termLimit);
                    await Promise.all(excess.map(async (t: any) => {
                      try {
                        const delResp = await deleteTerm(Number(t.id));
                        console.log("[YearEdit] deleted term", t.id, "response:", delResp);
                      } catch (e) {
                        console.error("[YearEdit] failed to delete term", t.id, e);
                      }
                    }));
                    // Add missing terms if increasing
                    const existing = sorted.slice(0, termLimit);
                    const missing = termLimit - existing.length;
                    for (let i = 0; i < missing; i++) {
                      const termIndex = existing.length + i + 1;
                      try {
                        await addTerm(Number(cls.id), { name: `Term ${termIndex}` });
                        console.log("[YearEdit] added term", termIndex, "for class", cls.id);
                      } catch (e) {
                        console.error("[YearEdit] failed to add term", termIndex, e);
                      }
                    }
                  } catch (e) {
                    console.error("[YearEdit] terms fetch failed for class", cls.id, e);
                  }
                }
              })
            );
          } catch (e: any) {
            console.error("[YearEdit] class update block failed:", e?.message ?? e);
            if (e?.response?.data) {
              console.error("[YearEdit] backend validation errors:", JSON.stringify(e.response.data));
            }
          }
        }
        writeYearColorMap({
          ...readYearColorMap(),
          [String(currentYear.id)]: color || currentYear.color || "green",
        });
      } else {
        const addResponse = await addYearApi(yearData);
        const createdYearRaw =
          addResponse?.data?.year ??
          addResponse?.data ??
          addResponse?.year ??
          addResponse;

        createdYearId = Number(
          createdYearRaw?.id ??
            addResponse?.data?.id ??
            addResponse?.id ??
            0
        );

        if (Number.isFinite(createdYearId) && createdYearId > 0) {
          const yearWithColor = {
            ...createdYearRaw,
            id: createdYearId,
            name: String(createdYearRaw?.name ?? yearData.name ?? "").trim(),
            color: color || "green",
          } as Year;
          setYears((prevYears) => [...prevYears, yearWithColor]);
          writeYearColorMap({
            ...readYearColorMap(),
            [String(createdYearId)]: yearWithColor.color as string,
          });
        }
      }
      if (isSubjectWorkspaceMode && activeSubjectId) {
        const updatedYears = await fetchYearsBySchool(Number(schoolId));
        if (!currentYear && (!createdYearId || createdYearId <= 0)) {
          const candidate = (Array.isArray(updatedYears) ? updatedYears : [])
            .filter((year: any) =>
              String(year?.name ?? "").trim().toLowerCase() ===
              String(yearData?.name ?? "").trim().toLowerCase()
            )
            .at(-1);
          const resolvedId = Number(candidate?.id ?? 0);
          if (Number.isFinite(resolvedId) && resolvedId > 0) {
            createdYearId = resolvedId;
          }
        }
        if (!currentYear && createdYearId && createdYearId > 0) {
          addAddedYear(createdYearId);
        }
        const subjectClasses = (await fetchSubjectClasses({
          subject_id: Number(activeSubjectId),
        })) as SubjectClassRow[];
        const allowedIds = new Set(
          [
            ...(Array.isArray(subjectClasses) ? subjectClasses : [])
            .map((item) => resolveSubjectClassYearId(item))
            .filter((id) => Number.isFinite(id) && id > 0),
            ...readAddedYears(),
          ]
        );
        const hiddenIds = new Set(readHiddenYears());
        setYears(
          applySavedOrder(
            applySavedYearColors(
              (Array.isArray(updatedYears) ? updatedYears : []).filter((year: any) =>
                allowedIds.has(Number(year?.id)) && !hiddenIds.has(Number(year?.id))
              )
            )
          )
        );
      } else {
        const updatedYears = await fetchYearsBySchool(Number(schoolId));
        setYears(applySavedYearColors(updatedYears));
      }

      setIsModalOpen(false);
      setCurrentYear(null);
      messageApi.success(
        currentYear ? "Year updated successfully" : "Year added successfully"
      );
    } catch (err) {
      setError(currentYear ? "Failed to update year" : "Failed to add year");
      console.error(err);
      messageApi.error(
        currentYear ? "Failed to update year" : "Failed to add year"
      );
    }
  };

  const confirmDelete = (id: number) => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete year groups.");
      return;
    }
    setYearToDelete(id);
    setDeleteConfirmationText("");
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (year: Year) => {
    setCurrentYear(year);
    setIsModalOpen(true);
  };


  const handleDeleteYear = async () => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete year groups.");
      return;
    }
    if (!yearToDelete) return;

    try {
      if (isSubjectWorkspaceMode && activeSubjectId) {
        // Best-effort backend call — silently ignored if the endpoint isn't deployed yet
        try {
          await deactivateSubjectClassesByYear({
            subject_id: Number(activeSubjectId),
            year_id: yearToDelete,
          });
        } catch (backendErr) {
          if (!isMissingSubjectWorkspaceRoute(backendErr)) {
            throw backendErr;
          }
          // Route not deployed yet — fall through to local-only removal
        }
        addHiddenYear(yearToDelete); // Legacy: kept for backward compat until fully migrated
        removeAddedYear(yearToDelete);
        setYears(years.filter((year) => year.id !== yearToDelete));
        setIsDeleteModalOpen(false);
        setYearToDelete(null);
        messageApi.success("Year removed from this subject's workspace.");
        return;
      }

      const stats = yearStats[yearToDelete] ?? { classes: 0, students: 0 };
      if (stats.classes > 0 || stats.students > 0) {
        messageApi.warning(
          "This year group still contains classes or students. Delete is blocked."
        );
        return;
      }

      const targetYear = years.find((year) => year.id === yearToDelete);
      if (!targetYear || deleteConfirmationText.trim() !== targetYear.name) {
        messageApi.warning("Type the exact year group name to confirm deletion.");
        return;
      }

      await deleteYearApi(yearToDelete);
      setYears(years.filter((year) => year.id !== yearToDelete));
      setIsDeleteModalOpen(false);
      setYearToDelete(null);
      setDeleteConfirmationText("");
      messageApi.success("Year deleted successfully");
    } catch (err) {
      setError("Failed to delete year");
      console.error(err);
      messageApi.error("Failed to delete Year");
    }
  };

  const yearPendingDelete = years.find((year) => year.id === yearToDelete) ?? null;
  const pendingDeleteStats = yearToDelete
    ? yearStats[yearToDelete] ?? { classes: 0, students: 0 }
    : { classes: 0, students: 0 };
  const canPermanentlyDeleteYear =
    !!yearPendingDelete &&
    pendingDeleteStats.classes === 0 &&
    pendingDeleteStats.students === 0 &&
    deleteConfirmationText.trim() === yearPendingDelete.name;

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
            title: <span>{pageTitle}</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="premium-hero mb-6 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isSubjectWorkspaceMode && formattedSubjectName
                ? `Manage ${formattedSubjectName} academic years as folders and drag cards to set your preferred order.`
                : "Manage your years as folders and drag cards to set your preferred order."}
            </p>
          </div>
          {currentUser?.role !== "STUDENT" &&
            currentUser?.role !== "HOD" &&
            currentUser?.role !== "TEACHER" && (
            <Button
              type="primary"
              className="premium-pill-btn !bg-primary !text-white !cursor-pointer"
              onClick={() => {
                setCurrentYear(null);
                setIsModalOpen(true);
              }}
            >
              Add Year
            </Button>
            )}
        </div>
      </div>
      <YearsList
        key={years?.length}
        years={years?.map((year) => ({
          id: year.id,
          name: year.name,
          school_id: year.school_id,
          terms: year.terms,
          color: year.color,
        }))}
        onDeleteYear={confirmDelete}
        onEditYear={(id) => {
          const year = years.find((y) => y.id === id);
          if (year) handleEditClick(year);
        }}
        onReorderYears={handleReorderYears}
        yearStats={yearStats}
      />

      {/* Add/Edit Year Modal */}
      <Modal
        title={currentYear ? "Edit Year" : "Add New Year"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentYear(null);
        }}
        footer={null}
        centered
        destroyOnHidden
      >
        <YearForm
          onSubmit={handleSubmitYear}
          defaultValues={currentYear || undefined}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteYear}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setYearToDelete(null);
          setDeleteConfirmationText("");
        }}
        okText={isSubjectWorkspaceMode ? "Remove" : "Delete permanently"}
        okButtonProps={{
          danger: true,
          disabled: !isSubjectWorkspaceMode && !canPermanentlyDeleteYear,
        }}
        cancelText={isSubjectWorkspaceMode ? "Cancel" : "Close"}
        centered
      >
        {yearToDelete && (
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-semibold text-slate-900">
                {yearPendingDelete?.name}
              </p>
              <p className="mt-1">
                Classes: <span className="font-medium">{pendingDeleteStats.classes}</span>
                {"  "}Students:{" "}
                <span className="font-medium">{pendingDeleteStats.students}</span>
              </p>
            </div>

            {isSubjectWorkspaceMode ? (
              <p>
                This will only remove the year group from the current subject page.
                It will not delete the real school year or its data.
              </p>
            ) : pendingDeleteStats.classes > 0 || pendingDeleteStats.students > 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-amber-900">
                This year group cannot be deleted because it still contains classes
                or students. A safer archive flow should be used instead.
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  This year group is empty. To delete it permanently, type the exact
                  name below.
                </p>
                <Input
                  value={deleteConfirmationText}
                  onChange={(event) => setDeleteConfirmationText(event.target.value)}
                  placeholder={yearPendingDelete?.name || "Type year group name"}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
