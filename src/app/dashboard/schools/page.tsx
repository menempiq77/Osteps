"use client";
import { useState } from "react";
import AddSchoolForm from "@/components/dashboard/AddSchoolForm";
import SchoolList from "@/components/dashboard/SchoolList";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<any[]>([
    {
      id: "1",
      name: "Falcon High School",
      contactPerson: "Sarah Johnson",
      adminEmail: "sarah@gvhschool.edu",
      adminPassword: "admin1234",
      academicYear: "2024-2025",
    },
    {
      id: "2",
      name: "Sunrise School",
      contactPerson: "Ahmed Khan",
      adminEmail: "ahmed@sunrise.edu",
      adminPassword: "admin5678",
      academicYear: "2023-2024",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);

  const handleAddOrEditSchool = (schoolData: any) => {
    if (editingSchool) {
      // Update
      setSchools((prev) =>
        prev.map((school) =>
          school.id === editingSchool.id
            ? { ...editingSchool, ...schoolData }
            : school
        )
      );
    } else {
      // Create
      const newSchool = {
        id: Date.now().toString(),
        ...schoolData,
      };
      setSchools((prev) => [...prev, newSchool]);
    }

    setOpen(false);
    setEditingSchool(null);
  };

  const handleEdit = (school: any) => {
    setEditingSchool(school);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setSchools((prev) => prev.filter((school) => school.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button onClick={() => setEditingSchool(null)} className="cursor-pointer">Add School</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow">
              <Dialog.Title className="text-lg font-bold mb-4">
                {editingSchool ? "Edit School" : "Add New School"}
              </Dialog.Title>
              <AddSchoolForm
                onSubmit={handleAddOrEditSchool}
                defaultValues={editingSchool}
              />
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <SchoolList
        schools={schools}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
