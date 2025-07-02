"use client";
import React, { useState, useEffect } from "react";
import GradeForm from "@/components/dashboard/GradeForm";
import GradesList from "@/components/dashboard/GradesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Breadcrumb, Button, message, Modal, Spin } from "antd";
import { addGrade, deleteGrade, fetchGrades, updateGrade } from "@/services/gradesApi";
import Link from "next/link";

interface Grade {
  id: number;
  grade: string;
  min_percentage: string;
  max_percentage: string;
  description: string;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchGrades();
        setGrades(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load grades");
        setLoading(false);
        console.error(err);
        messageApi.error("Failed to load grades");
      }
    };
    loadGrades();
  }, []);

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
        messageApi.success("Grade updated successfully");
      } else {
        await addGrade(gradeData);
         messageApi.success("Grade added successfully");
      }

      const updatedGrades = await fetchGrades();
      setGrades(updatedGrades);
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
      setGrades(grades.filter((grade) => grade.id !== gradeToDelete));
      setDeleteOpen(false);
      setGradeToDelete(null);
      messageApi.success("Grade deleted successfully");
    } catch (err) {
      setError("Failed to delete grade");
      console.error(err);
      messageApi.error("Failed to delete grade");
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
       <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Grades</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grade Ranges</h1>
        {currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER" && (
          <>
            <Button
              className="cursor-pointer !bg-primary !text-white !border-none"
              onClick={() => {
                setCurrentGrade(null);
                setOpen(true);
              }}
            >
              Add Grade Range
            </Button>

            <Modal
              title={currentGrade ? "Edit Grade Range" : "Add New Grade Range"}
              open={open}
              onCancel={() => {
                setOpen(false);
                setCurrentGrade(null);
              }}
              footer={null}
              destroyOnHidden
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
          </>
        )}
      </div>

      <GradesList
        grades={grades}
        onDeleteGrade={confirmDelete}
        onEditGrade={handleEditClick}
      />

      {/* Delete Confirmation Modal */}
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
        <p>
          Are you sure you want to delete this grade range? This action cannot
          be undone.
        </p>
      </Modal>
    </div>
  );
}
