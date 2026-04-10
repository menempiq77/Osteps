"use client";
import React, { useState, useEffect } from "react";
import GradeForm from "@/components/dashboard/GradeForm";
import GradesList from "@/components/dashboard/GradesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Breadcrumb, message, Modal, Spin } from "antd";
import { addGrade, deleteGrade, fetchGrades, updateGrade } from "@/services/gradesApi";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import { useSubjectContext } from "@/contexts/SubjectContext";

interface Grade {
  id: number;
  grade: string;
  min_percentage: string;
  max_percentage: string;
  description: string;
}

const GRADE_SUBJECT_MAP_KEY = "osteps_grade_subject_map";

function readGradeSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(GRADE_SUBJECT_MAP_KEY) || "{}"); }
  catch { return {}; }
}

function tagGradeWithSubject(gradeId: number, subjectId: number) {
  const map = readGradeSubjectMap();
  map[String(gradeId)] = subjectId;
  if (typeof window !== "undefined") {
    localStorage.setItem(GRADE_SUBJECT_MAP_KEY, JSON.stringify(map));
  }
}

function untagGrade(gradeId: number) {
  const map = readGradeSubjectMap();
  delete map[String(gradeId)];
  if (typeof window !== "undefined") {
    localStorage.setItem(GRADE_SUBJECT_MAP_KEY, JSON.stringify(map));
  }
}

function filterGradesBySubject(grades: Grade[], subjectId: number): Grade[] {
  const map = readGradeSubjectMap();
  return grades.filter((g) => map[String(g.id)] === subjectId);
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [allGrades, setAllGrades] = useState<Grade[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const schoolId = currentUser?.school;
  const { activeSubjectId, canUseSubjectContext, activeSubject, loading: subjectContextLoading } = useSubjectContext();

  const inSubjectContext = canUseSubjectContext && !!activeSubjectId;

  // Derive filtered grades reactively — no flash
  const grades = inSubjectContext
    ? filterGradesBySubject(allGrades, Number(activeSubjectId))
    : allGrades;

  const loading = fetchLoading || subjectContextLoading;

  useEffect(() => {
    const loadGrades = async (sid: string) => {
      try {
        const data = await fetchGrades(sid);
        setAllGrades(data);
        setFetchLoading(false);
      } catch (err) {
        setError("Failed to load grades");
        setFetchLoading(false);
        console.error(err);
        messageApi.error("Failed to load grades");
      }
    };
    loadGrades(schoolId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const handleSubmitGrade = async (formData: {
    gradeName: string;
    minMark: number;
    maxMark: number;
    description?: string;
  }) => {
    try {
      const gradeData = {
        grade: formData.gradeName,
        min_percentage: formData.minMark.toString(),
        max_percentage: formData.maxMark.toString(),
        description: formData.description || "",
      };

      if (currentGrade) {
        await updateGrade(currentGrade.id.toString(), gradeData);
        if (inSubjectContext) {
          tagGradeWithSubject(currentGrade.id, Number(activeSubjectId));
        }
        messageApi.success("Grade updated successfully");
      } else {
        const response = await addGrade(gradeData);
        const newId: number | undefined =
          response?.data?.id ?? response?.id ?? undefined;
        if (inSubjectContext && newId) {
          tagGradeWithSubject(Number(newId), Number(activeSubjectId));
        }
        messageApi.success("Grade added successfully");
      }

      const updatedGrades = await fetchGrades(schoolId);
      setAllGrades(updatedGrades);
      setOpen(false);
      setCurrentGrade(null);
    } catch (err) {
      const errorMessage = currentGrade ? "Failed to update grade" : "Failed to add grade";
      setError(errorMessage);
      console.error(err);
      messageApi.error(errorMessage);
    }
  };

  const confirmDelete = (id: number) => {
    setGradeToDelete(id);
    setDeleteOpen(true);
  };

  const handleEditClick = (grade: Grade) => {
    setCurrentGrade(grade);
    setOpen(true);
  };

  const handleDeleteGrade = async () => {
    if (!gradeToDelete) return;
    try {
      await deleteGrade(gradeToDelete);
      untagGrade(gradeToDelete);
      setAllGrades((prev) => prev.filter((grade) => grade.id !== gradeToDelete));
      setDeleteOpen(false);
      setGradeToDelete(null);
      messageApi.success("Grade deleted successfully");
    } catch (err) {
      setError("Failed to delete grade");
      console.error(err);
      messageApi.error("Failed to delete grade");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const canManage =
    currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER";

  const subjectLabel = activeSubject?.name ? `${activeSubject.name} - ` : "";

  return (
    <div className="premium-page p-3 md:p-6">
      {contextHolder}

      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/manager">Manager</Link> },
          { title: <span>Grades</span> },
        ]}
        className="!mb-4"
      />

      <div className="premium-hero mb-6 rounded-2xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {subjectLabel}Grade Ranges
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {inSubjectContext
                ? `Grade ranges for the ${activeSubject?.name ?? "current"} subject only.`
                : "Define your school grading scale with percentage ranges and labels."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-center shadow-sm">
              <p className="text-lg font-bold text-emerald-600">{grades.length}</p>
              <p className="text-[11px] text-slate-400">
                {grades.length === 1 ? "Range" : "Ranges"}
              </p>
            </div>

            {canManage && (
              <button
                type="button"
                onClick={() => {
                  setCurrentGrade(null);
                  setOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl px-5 h-10 font-medium text-sm text-white cursor-pointer border-none"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <PlusOutlined />
                Add Grade Range
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <GradesList
        grades={grades}
        onDeleteGrade={confirmDelete}
        onEditGrade={handleEditClick}
      />

      <Modal
        title={
          <span className="text-base font-semibold text-slate-800">
            {currentGrade ? "Edit Grade Range" : "Add New Grade Range"}
          </span>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setCurrentGrade(null);
        }}
        footer={null}
        destroyOnHidden
        centered
      >
        <GradeForm
          onSubmit={handleSubmitGrade}
          defaultValues={
            currentGrade
              ? {
                  gradeName: currentGrade.grade,
                  minMark: parseInt(currentGrade.min_percentage),
                  maxMark: parseInt(currentGrade.max_percentage),
                  description: currentGrade.description,
                }
              : null
          }
          isOpen={open}
        />
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={deleteOpen}
        onOk={handleDeleteGrade}
        onCancel={() => setDeleteOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this grade range? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}