"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import AddSchoolForm from "@/components/dashboard/AddSchoolForm";
import { addSchool } from "@/features/school/schoolSlice";
import { createSchoolAdmin } from "@/features/auth/authSlice";
import SchoolList from "@/components/dashboard/SchoolList";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SuperAdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { schools } = useSelector((state: RootState) => state.school);
  const [open, setOpen] = useState(false);

  const handleAddSchool = (schoolData: {
    name: string;
    contactPerson: string;
    adminEmail: string;
    terms: number;
    academicYear: string;
  }) => {
    const newSchool = {
      id: Date.now().toString(),
      ...schoolData,
    };

    dispatch(addSchool(newSchool));
    dispatch(
      createSchoolAdmin({
        id: Date.now().toString(),
        email: schoolData.adminEmail,
        role: "SCHOOL_ADMIN",
        schoolId: newSchool.id,
      })
    );
    
    setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button>Add School</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-lg font-bold mb-4">
                Add New School
              </Dialog.Title>
              <AddSchoolForm onSubmit={handleAddSchool} />
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
      
      <SchoolList />
    </div>
  );
}