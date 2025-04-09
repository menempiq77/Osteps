"use client";
import React, { useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddAssessmentForm from "@/components/dashboard/AddAssessmentForm";
import { useDispatch } from "react-redux";
import { addClass } from "@/features/class/classSlice";
import AssessmentList from "@/components/dashboard/assessmentList";

export default function page() {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const handleAddClass = (classData: {
    name: string;
    assignTeacher: string;
    terms: number;
  }) => {
    const newClass = {
      id: Date.now().toString(),
      ...classData,
    };

    dispatch(addClass(newClass));
    setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assessment</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button>Add Assessment</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-lg font-bold mb-4">
                Add New Assessment
              </Dialog.Title>
              <AddAssessmentForm onSubmit={handleAddClass} />
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
      <AssessmentList />
    </div>
  );
}
