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
import { archiveSubjectClass, restoreSubjectClass, deactivateSubjectClassesByYear, fetchSubjectClasses, isMissingSubjectWorkspaceRoute } from "@/services/subjectWorkspaceApi";
import { readSubjectClassBaseMap, resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import { useReadOnlyWorkspace } from "@/lib/readOnlyWorkspace";

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
  is_active?: number | boolean | null;
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

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [yearToArchive, setYearToArchive] = useState<number | null>(null);
  const [archivingYear, setArchivingYear] = useState(false);
  const [statsVersion, setStatsVersion] = useState(0);
  const [archivedYears, setArchivedYears] = useState<Year[]>([]);
  const isReadOnlyArchivedWorkspace = useReadOnlyWorkspace();
  // In the archived read-only popup, open on the Archived tab so the subject's
  // archived year groups are shown by default instead of an empty Active list.
  const [activeTab, setActiveTab] = useState<"active" | "archived">(
    isReadOnlyArchivedWorkspace ? "archived" : "active"
  );
  const [restoringYear, setRestoringYear] = useState(false);
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
      setArchivedYears([]);

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
          fetchSubjectClasses({
            subject_id: Number(activeSubjectId),
            include_inactive: true,
          }) as Promise<SubjectClassRow[]>,
        ]);

        const rows = Array.isArray(subjectClasses) ? subjectClasses : [];
        // Match the Classes page: undefined is_active => treat as active (backend
        // has no column); null/0 => inactive; 1 => active.
        const isRowActive = (item: SubjectClassRow) =>
          item?.is_active === undefined ? true : Number(item.is_active) === 1;
        const activeYearIds = new Set(
          rows
            .filter((item) => isRowActive(item))
            .map((item) => resolveSubjectClassYearId(item))
            .filter((id) => Number.isFinite(id) && id > 0)
        );
        const archivedYearIds = new Set(
          rows
            .filter((item) => !isRowActive(item))
            .map((item) => resolveSubjectClassYearId(item))
            .filter((id) => Number.isFinite(id) && id > 0)
        );

        const hiddenIds = new Set(readHiddenYears());
        const addedIds = new Set(readAddedYears());
        const schoolYearList = Array.isArray(schoolYears) ? schoolYears : [];

        // Active tab: years with at least one active class (or explicitly added, empty years).
        yearsData = schoolYearList.filter((year: any) => {
          const id = Number(year?.id);
          if (hiddenIds.has(id)) return false;
          return activeYearIds.has(id) || addedIds.has(id);
        });

        // Archived tab: years whose classes are all archived (no active class remains).
        const archivedYearsData = schoolYearList.filter((year: any) => {
          const id = Number(year?.id);
          if (hiddenIds.has(id)) return false;
          return archivedYearIds.has(id) && !activeYearIds.has(id) && !addedIds.has(id);
        });
        setArchivedYears(
          applySavedOrder(applySavedYearColors(archivedYearsData as Year[]))
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
}, [schoolId, isTeacher, isSubjectWorkspaceMode, activeSubjectId, subjectContextLoading, statsVersion]);

  useEffect(() => {
    const loadYearStats = async () => {
      if (!years.length && !archivedYears.length) {
        setYearStats({});
        return;
      }

      const archivedYearIdSet = new Set(archivedYears.map((year) => Number(year.id)));
      const allYears = [...years, ...archivedYears];

      const statsEntries = await Promise.all(
        allYears.map(async (year) => {
          const countArchived = archivedYearIdSet.has(Number(year.id));
          try {
            if (isSubjectWorkspaceMode && activeSubjectId) {
              const subjectClasses = (await fetchSubjectClasses({
                subject_id: Number(activeSubjectId),
                year_id: Number(year.id),
                include_inactive: true,
              })) as SubjectClassRow[];
              const isRowActive = (row: SubjectClassRow) =>
                row?.is_active === undefined ? true : Number(row.is_active) === 1;
              const classesForYear = (Array.isArray(subjectClasses) ? subjectClasses : [])
                .filter((row) => resolveSubjectClassYearId(row) === Number(year.id))
                .filter((row) => isRowActive(row) !== countArchived);
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

                    // Count only the explicit active subject-class roster.
                    // Broad subject/base-class fallbacks over-count after a
                    // class has been archived and restored.
                    for (const targetClassId of requestTargets) {
                      const students = await fetchStudents(
                        targetClassId,
                        Number(activeSubjectId),
                        subjectClassId
                      );
                      const studentRows = Array.isArray(students) ? students : [];
                      if (studentRows.length > 0) { finalRows = studentRows; break; }
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
  }, [years, archivedYears, isSubjectWorkspaceMode, activeSubjectId, activeSubject?.name, statsVersion]);

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
        // Re-run the full loader so the active/archived split stays consistent.
        setStatsVersion((v) => v + 1);
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

  const confirmArchive = (id: number) => {
    if (!hasAccess && !isTeacher) {
      messageApi.warning("You do not have permission to archive year groups.");
      return;
    }
    if (!isSubjectWorkspaceMode || !activeSubjectId) {
      messageApi.warning("Archiving is available inside a subject workspace.");
      return;
    }
    setYearToArchive(id);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveYear = async () => {
    if (!yearToArchive || !isSubjectWorkspaceMode || !activeSubjectId) return;
    setArchivingYear(true);
    try {
      const subjectClasses = (await fetchSubjectClasses({
        subject_id: Number(activeSubjectId),
        year_id: Number(yearToArchive),
        include_inactive: true,
      })) as SubjectClassRow[];

      const activeClassesForYear = (Array.isArray(subjectClasses) ? subjectClasses : [])
        .filter((row) => resolveSubjectClassYearId(row) === Number(yearToArchive))
        .filter((row) => Boolean(row.is_active))
        .map((row) => Number(row.id))
        .filter((id) => Number.isFinite(id) && id > 0);

      if (activeClassesForYear.length === 0) {
        messageApi.info("This year group has no active classes to archive.");
        setIsArchiveModalOpen(false);
        setYearToArchive(null);
        return;
      }

      const results = await Promise.allSettled(
        activeClassesForYear.map((id) => archiveSubjectClass(id))
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      const archived = activeClassesForYear.length - failed;

      if (archived > 0) {
        messageApi.success(
          `Archived ${archived} class${archived === 1 ? "" : "es"} in this year group. View them under Classes \u2192 Archived.`
        );
      }
      if (failed > 0) {
        messageApi.error(
          `${failed} class${failed === 1 ? "" : "es"} could not be archived. Please try again.`
        );
      }

      setIsArchiveModalOpen(false);
      setYearToArchive(null);
      setStatsVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to archive year group.");
    } finally {
      setArchivingYear(false);
    }
  };

  const handleRestoreYear = async (yearId: number) => {
    if (!isSubjectWorkspaceMode || !activeSubjectId) return;
    if (!hasAccess && !isTeacher) {
      messageApi.warning("You do not have permission to restore year groups.");
      return;
    }
    setRestoringYear(true);
    try {
      const subjectClasses = (await fetchSubjectClasses({
        subject_id: Number(activeSubjectId),
        year_id: Number(yearId),
        include_inactive: true,
      })) as SubjectClassRow[];

      const archivedClassesForYear = (Array.isArray(subjectClasses) ? subjectClasses : [])
        .filter((row) => resolveSubjectClassYearId(row) === Number(yearId))
        .filter((row) => !(row?.is_active === undefined ? true : Number(row.is_active) === 1))
        .map((row) => Number(row.id))
        .filter((id) => Number.isFinite(id) && id > 0);

      if (archivedClassesForYear.length === 0) {
        messageApi.info("This year group has no archived classes to restore.");
        return;
      }

      const results = await Promise.allSettled(
        archivedClassesForYear.map((id) => restoreSubjectClass(id))
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      const restored = archivedClassesForYear.length - failed;

      if (restored > 0) {
        messageApi.success(
          `Restored ${restored} class${restored === 1 ? "" : "es"} to this year group.`
        );
      }
      if (failed > 0) {
        messageApi.error(
          `${failed} class${failed === 1 ? "" : "es"} could not be restored. Please try again.`
        );
      }
      setStatsVersion((v) => v + 1);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to restore year group.");
    } finally {
      setRestoringYear(false);
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

  const handleEditClick = async (year: Year) => {
    let yearWithTerms: Year = year;
    try {
      const classes = await fetchClasses(String(year.id));
      const firstClass = Array.isArray(classes) && classes.length > 0 ? classes[0] : null;
      if (firstClass?.number_of_terms) {
        yearWithTerms = { ...year, number_of_terms: firstClass.number_of_terms };
      }
    } catch {
      // fall through with no number_of_terms
    }
    setCurrentYear(yearWithTerms);
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
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>{pageTitle}</span> },
        ]}
        className="!mb-4"
      />

      {/* Page header */}
      <div
        className="mb-5 flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 9%, white), color-mix(in srgb, var(--primary) 4%, white))",
          border: "1px solid color-mix(in srgb, var(--primary) 20%, white)",
        }}
      >
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {isSubjectWorkspaceMode && formattedSubjectName
              ? `${formattedSubjectName} academic years — drag rows to reorder.`
              : "Academic year folders — drag rows to reorder."}
          </p>
        </div>
        {currentUser?.role !== "STUDENT" &&
          currentUser?.role !== "HOD" &&
          currentUser?.role !== "TEACHER" && (
          <Button
            type="primary"
            className="premium-pill-btn shrink-0 !bg-primary !text-white !cursor-pointer"
            onClick={() => {
              setCurrentYear(null);
              setIsModalOpen(true);
            }}
          >
            + Add Year
          </Button>
        )}
      </div>
      {isSubjectWorkspaceMode && (
        <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-white p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
              activeTab === "active"
                ? "bg-emerald-100 text-emerald-700"
                : "text-gray-600 hover:text-emerald-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
              activeTab === "archived"
                ? "bg-amber-100 text-amber-700"
                : "text-gray-600 hover:text-amber-700"
            }`}
          >
            Archived{archivedYears.length > 0 ? ` (${archivedYears.length})` : ""}
          </button>
        </div>
      )}

      {(!isSubjectWorkspaceMode || activeTab === "active") && (
        <YearsList
          key={`active-${years?.length}`}
          years={years?.map((year) => ({
            id: year.id,
            name: year.name,
            school_id: year.school_id,
            terms: year.terms,
            color: year.color,
          }))}
          onDeleteYear={confirmDelete}
          onArchiveYear={confirmArchive}
          onEditYear={(id) => {
            const year = years.find((y) => y.id === id);
            if (year) handleEditClick(year);
          }}
          onReorderYears={handleReorderYears}
          yearStats={yearStats}
        />
      )}

      {isSubjectWorkspaceMode && activeTab === "archived" && (
        <YearsList
          key={`archived-${archivedYears?.length}`}
          archivedView
          years={archivedYears?.map((year) => ({
            id: year.id,
            name: year.name,
            school_id: year.school_id,
            terms: year.terms,
            color: year.color,
          }))}
          onDeleteYear={confirmDelete}
          onEditYear={(id) => {
            const year = archivedYears.find((y) => y.id === id);
            if (year) handleEditClick(year);
          }}
          onRestoreYear={handleRestoreYear}
          restoreLoading={restoringYear}
          yearStats={yearStats}
          emptyMessage="No archived year groups. Archive a year from the Active tab to see it here."
        />
      )}

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

      {/* Archive Year Confirmation Modal */}
      <Modal
        title="Archive year group"
        open={isArchiveModalOpen}
        onOk={handleArchiveYear}
        onCancel={() => {
          setIsArchiveModalOpen(false);
          setYearToArchive(null);
        }}
        okText="Archive year group"
        okButtonProps={{ danger: true, loading: archivingYear }}
        cancelText="Cancel"
        centered
      >
        {yearToArchive && (
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-semibold text-slate-900">
                {years.find((year) => year.id === yearToArchive)?.name}
              </p>
              <p className="mt-1">
                Classes:{" "}
                <span className="font-medium">
                  {(yearStats[yearToArchive] ?? { classes: 0 }).classes}
                </span>
                {"  "}Students:{" "}
                <span className="font-medium">
                  {(yearStats[yearToArchive] ?? { students: 0 }).students}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-amber-900">
              This archives every active class in this year group for the current
              subject. No data is deleted &mdash; students, reports, markbooks,
              assessments and trackers are preserved and become read-only. You can
              view them under Classes &rarr; Archived, and restore any class from
              there.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
