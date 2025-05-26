"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import GradeForm from "@/components/dashboard/GradeForm";
import GradesList from "@/components/dashboard/GradesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchGrades, addGrade, deleteGrade, updateGrade } from "@/services/api";
import { Alert, Spin } from "antd";

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
      }
    };
    loadGrades();
  }, []);

  const handleSubmitGrade = async (formData: { 
    gradeName: string; 
    minMark: number; 
    maxMark: number; 
    description?: string 
  }) => {
    try {
      const gradeData = {
        grade: formData.gradeName,
        min_percentage: formData.minMark.toString(),
        max_percentage: formData.maxMark.toString(),
        description: formData.description || ""
      };

      if (currentGrade) {
        await updateGrade(currentGrade.id.toString(), gradeData);
      } else {
        await addGrade(gradeData);
      }
      
      const updatedGrades = await fetchGrades();
      setGrades(updatedGrades);
      setOpen(false);
      setCurrentGrade(null);
    } catch (err) {
      setError(currentGrade ? "Failed to update grade" : "Failed to add grade");
      console.error(err);
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
    } catch (err) {
      setError("Failed to delete grade");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="p-3 md:p-6 flex justify-center items-center h-64">
      <Spin size="large" />
    </div>
  );

  if (error) return (
    <div className="p-3 md:p-6">
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        closable
        onClose={() => setError(null)}
      />
    </div>
  );

  return (
    <div className="p-3 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grade Ranges</h1>
        {currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER" && (
          <Dialog.Root
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setCurrentGrade(null);
              }
            }}
          >
            <Dialog.Trigger asChild>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setCurrentGrade(null);
                  setOpen(true);
                }}
              >
                Add Grade Range
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-lg font-bold mb-4">
                  {currentGrade ? "Edit Grade Range" : "Add New Grade Range"}
                </Dialog.Title>
                <GradeForm
                  onSubmit={handleSubmitGrade}
                  defaultValues={
                    currentGrade
                      ? {
                          gradeName: currentGrade.grade,
                          minMark: parseInt(currentGrade.min_percentage),
                          maxMark: parseInt(currentGrade.max_percentage),
                          description: currentGrade.description
                        }
                      : null
                  }
                  isOpen={open} 
                />
                <Dialog.Close asChild>
                  <button
                    className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                  >
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>

      <GradesList
        grades={grades}
        onDeleteGrade={confirmDelete}
        onEditGrade={handleEditClick}
      />

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-lg font-bold mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="mb-6">
              Are you sure you want to delete this grade range? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <Button variant="outline" className="cursor-pointer">Cancel</Button>
              </Dialog.Close>
              <Button variant="destructive" onClick={handleDeleteGrade} className="cursor-pointer">
                Delete
              </Button>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}