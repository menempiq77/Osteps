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
import { fetchClasses } from "@/services/classesApi";
import { fetchStudents } from "@/services/studentsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";

interface Year {
  id: number;
  name: string;
  school_id?: number;
  terms?: any;
  created_at?: string;
  updated_at?: string;
  color?: string;
}

const readSubjectYearMap = (schoolId?: number | string) => {
  if (typeof window === "undefined") return {} as Record<string, number[]>;
  try {
    const raw = localStorage.getItem(`subject-years-${schoolId ?? "global"}`);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeSubjectYearMap = (
  schoolId: number | string | undefined,
  nextMap: Record<string, number[]>
) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`subject-years-${schoolId ?? "global"}`, JSON.stringify(nextMap));
};

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
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();
  const schoolId = currentUser?.school;
  const isTeacher = currentUser?.role === "TEACHER";
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const isSubjectWorkspaceMode = canUseSubjectContext && !!activeSubjectId;
  const yearOrderStorageKey = `years-order-${schoolId ?? "global"}`;
  const yearColorStorageKey = `years-colors-${schoolId ?? "global"}`;

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
    const loadYears = async () => {
    try {
      let yearsData = [];

      if (isSubjectWorkspaceMode && activeSubjectId) {
        const schoolYears = await fetchYearsBySchool(Number(schoolId));
        const savedMap = readSubjectYearMap(schoolId);
        const savedSubjectYearIds = new Set(
          (savedMap[String(activeSubjectId)] || [])
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id) && id > 0)
        );
        yearsData = (Array.isArray(schoolYears) ? schoolYears : []).filter((year: any) =>
          savedSubjectYearIds.has(Number(year?.id))
        );
      } else if (isTeacher) {
        const res = await fetchAssignYears();

        const years = res
          .map((item) => item.classes?.year)
          .filter((year) => year);

        yearsData = Array.from(
          new Map(years.map((year) => [year.id, year])).values()
        );
      } else {
        const res = await fetchYearsBySchool(schoolId);
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
}, [schoolId, isTeacher, isSubjectWorkspaceMode, activeSubjectId]);

  useEffect(() => {
    const loadYearStats = async () => {
      if (!years.length) {
        setYearStats({});
        return;
      }

      const statsEntries = await Promise.all(
        years.map(async (year) => {
          try {
            const classes = ((await fetchClasses(String(year.id))) || []) as Array<{
              id: number | string;
            }>;
            const studentCounts = await Promise.all(
              classes.map(async (cls) => {
                try {
                  const students = await fetchStudents(cls.id);
                  return Array.isArray(students) ? students.length : 0;
                } catch {
                  return 0;
                }
              })
            );
            const totalStudents = studentCounts.reduce((sum, count) => sum + count, 0);
            return [year.id, { classes: classes.length, students: totalStudents }] as const;
          } catch {
            return [year.id, { classes: 0, students: 0 }] as const;
          }
        })
      );

      setYearStats(Object.fromEntries(statsEntries));
    };

    loadYearStats();
  }, [years, isSubjectWorkspaceMode, activeSubjectId]);

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

  const handleSubmitYear = async (data: { name: string; color?: string }) => {
    try {
      const { color, ...payload } = data;
      const yearData =
        currentUser?.role === "SCHOOL_ADMIN"
          ? { ...payload, school_id: currentUser?.school }
          : payload;

      if (currentYear) {
        await updateYearApi(currentYear.id, yearData);
        writeYearColorMap({
          ...readYearColorMap(),
          [String(currentYear.id)]: color || currentYear.color || "green",
        });
      } else {
        const newYear = await addYearApi(yearData);
        const yearWithColor = { ...newYear, color: color || "green" };
        if (isSubjectWorkspaceMode && activeSubjectId) {
          const subjectYearMap = readSubjectYearMap(schoolId);
          const existingIds = new Set(
            (subjectYearMap[String(activeSubjectId)] || [])
              .map((id) => Number(id))
              .filter((id) => Number.isFinite(id) && id > 0)
          );
          existingIds.add(Number(newYear.id));
          writeSubjectYearMap(schoolId, {
            ...subjectYearMap,
            [String(activeSubjectId)]: Array.from(existingIds),
          });
        }
        setYears((prevYears) => [...prevYears, yearWithColor]);
        writeYearColorMap({
          ...readYearColorMap(),
          [String(newYear.id)]: yearWithColor.color as string,
        });
      }
      const updatedYears = await fetchYearsBySchool(schoolId);
      if (isSubjectWorkspaceMode && activeSubjectId) {
        const subjectYearMap = readSubjectYearMap(schoolId);
        const allowedIds = new Set(
          (subjectYearMap[String(activeSubjectId)] || [])
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id) && id > 0)
        );
        setYears(
          applySavedOrder(
            applySavedYearColors(
              (Array.isArray(updatedYears) ? updatedYears : []).filter((year: any) =>
                allowedIds.has(Number(year?.id))
              )
            )
          )
        );
      } else {
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
      messageApi.success(
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
        const subjectYearMap = readSubjectYearMap(schoolId);
        const nextIds = (subjectYearMap[String(activeSubjectId)] || []).filter(
          (id) => Number(id) !== Number(yearToDelete)
        );
        writeSubjectYearMap(schoolId, {
          ...subjectYearMap,
          [String(activeSubjectId)]: nextIds,
        });
        setYears(years.filter((year) => year.id !== yearToDelete));
        setIsDeleteModalOpen(false);
        setYearToDelete(null);
        messageApi.success("Year removed from this subject only");
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
            title: <span>Academic Years</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="premium-hero mb-6 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Academic Years</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your years as folders and drag cards to set your preferred order.
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
