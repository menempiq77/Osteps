"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddClassForm from "@/components/dashboard/AddClassForm";
import ClassesList from "@/components/dashboard/ClassesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Class {
  id: string;
  name: string;
  assignTeacher: string;
  terms: number;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      name: "Class A",
      assignTeacher: "Teacher 1",
      terms: 3,
    },
    {
      id: "2",
      name: "Class B",
      assignTeacher: "Teacher 2",
      terms: 2,
    },
    {
      id: "3",
      name: "Class C",
      assignTeacher: "Teacher 3",
      terms: 3,
    },
  ]);

  const handleAddClass = (classData: {
    name: string;
    assignTeacher: string;
    terms: number;
  }) => {
    const newClass = {
      id: Date.now().toString(),
      ...classData,
    };
    setClasses([...classes, newClass]);
    setOpen(false);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter((cls) => cls.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        {currentUser?.role !== "STUDENT" && (
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button className="cursor-pointer">Add Class</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-lg font-bold mb-4">
                  Add New Class
                </Dialog.Title>
                <AddClassForm onSubmit={handleAddClass} />
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
      <ClassesList classes={classes} onDeleteClass={handleDeleteClass} />
    </div>
  );
}
