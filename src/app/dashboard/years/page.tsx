"use client";
import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
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

interface Year {
  id: number;
  name: string;
  school_id?: number;
  terms?: any;
  created_at?: string;
  updated_at?: string;
  color?: string;
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<Year | null>(null);
  const [yearStats, setYearStats] = useState<
    Record<number, { classes: number; students: number }>
  >({});
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const schoolId = currentUser?.school;
  const isTeacher = currentUser?.role === "TEACHER";
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

      if (isTeacher) {
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
}, [schoolId, isTeacher]);

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
  }, [years]);

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
        setYears((prevYears) => [...prevYears, yearWithColor]);
        writeYearColorMap({
          ...readYearColorMap(),
          [String(newYear.id)]: yearWithColor.color as string,
        });
      }
      const updatedYears = await fetchYearsBySchool(schoolId);
      setYears(applySavedYearColors(updatedYears));

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
    setYearToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (year: Year) => {
    setCurrentYear(year);
    setIsModalOpen(true);
  };

  const handleDeleteYear = async () => {
    if (!yearToDelete) return;

    try {
      await deleteYearApi(yearToDelete);
      setYears(years.filter((year) => year.id !== yearToDelete));
      setIsDeleteModalOpen(false);
      setYearToDelete(null);
      messageApi.success("Year deleted successfully");
    } catch (err) {
      setError("Failed to delete year");
      console.error(err);
      messageApi.error("Failed to delete Year");
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
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {yearToDelete && (
          <p>
            Are you sure you want to delete this year? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
