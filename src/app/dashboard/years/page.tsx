"use client";
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddYearForm from "@/components/dashboard/AddYearForm";
import YearsList from "@/components/dashboard/YearsList";

interface Year {
  id: number;
  yearName: string;
  numberOfTerms: number;
  assignedCoordinator?: string;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([
    {
      id: 1,
      yearName: "Year 1",
      numberOfTerms: 3,
      assignedCoordinator: "Dr. James Wilson",
    },
    {
      id: 2,
      yearName: "Year 2",
      numberOfTerms: 2,
      assignedCoordinator: "Prof. Emily Davis",
    },
    {
      id: 3,
      yearName: "Year 3",
      numberOfTerms: 3,
      assignedCoordinator: "Dr. Robert Taylor",
    },
  ]);

  const handleAddYear = (data: { name: string }) => {
    const newYear: Year = {
      id: years.length + 1,
      yearName: data.name,
      numberOfTerms: 2, // Default value
    };
    setYears([...years, newYear]);
    setOpen(false);
  };

  const handleDeleteYear = (id: number) => {
    setYears(years.filter(year => year.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Years</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button>Add Year</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-lg font-bold mb-4">
                Add New Year
              </Dialog.Title>
              <AddYearForm onSubmit={handleAddYear} />
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
      <YearsList years={years} onDeleteYear={handleDeleteYear} />
    </div>
  );
}