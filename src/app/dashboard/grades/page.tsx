"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddGradeForm from "@/components/dashboard/AddGradeForm";
import GradesList from "@/components/dashboard/GradesList";

interface Grade {
  id: number;
  gradeName: string;
  minMark: number;
  maxMark: number;
  description?: string;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: 1,
      gradeName: "A",
      minMark: 80,
      maxMark: 100,
      description: "Excellent",
    },
    {
      id: 2,
      gradeName: "B",
      minMark: 70,
      maxMark: 79,
      description: "Good",
    },
    {
      id: 3,
      gradeName: "C",
      minMark: 60,
      maxMark: 69,
      description: "Satisfactory",
    },
    {
      id: 4,
      gradeName: "D",
      minMark: 50,
      maxMark: 59,
      description: "Pass",
    },
    {
      id: 5,
      gradeName: "F",
      minMark: 0,
      maxMark: 49,
      description: "Fail",
    },
  ]);

  const handleAddGrade = (data: { gradeName: string; minMark: number; maxMark: number; description?: string }) => {
    const newGrade: Grade = {
      id: grades.length + 1,
      gradeName: data.gradeName,
      minMark: data.minMark,
      maxMark: data.maxMark,
      description: data.description,
    };
    setGrades([...grades, newGrade]);
    setOpen(false);
  };

  const handleDeleteGrade = (id: number) => {
    setGrades(grades.filter((grade) => grade.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grade Ranges</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button>Add Grade Range</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-lg font-bold mb-4">
                Add New Grade Range
              </Dialog.Title>
              <AddGradeForm onSubmit={handleAddGrade} />
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
      <GradesList grades={grades} onDeleteGrade={handleDeleteGrade} />
    </div>
  );
}