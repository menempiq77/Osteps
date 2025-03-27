"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { AddTeacherModal } from "../modals/teacherModals/AddTeacherModal";
import { EditTeacherModal } from "../modals/teacherModals/EditTeacherModal";
import { Trash2 } from "lucide-react";

// Types
type Teacher = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: string[];
};

type TeacherBasic = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: string[];
};

// Main Component
export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Alice",
      phone: "123-456-7890",
      email: "alice@example.com",
      subjects: ["Islamiyat"],
    },
    {
      id: "2",
      name: "Bob",
      phone: "987-654-3210",
      email: "bob@example.com",
      subjects: ["Islamiyat"],
    },
  ]);
  
  const [editTeacher, setEditTeacher] = useState<TeacherBasic | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  const handleSaveEdit = (teacher: TeacherBasic) => {
    console.log("Saved:", teacher);
    setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
    setEditTeacher(null);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    console.log("Deleted Teacher ID:", teacherId);
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    setDeleteTeacher(null);
  };

  const handleAddNewTeacher = (teacher: TeacherBasic) => {
    const newTeacher = {
      ...teacher,
      id: Math.random().toString(36).substring(2, 9), // Generate a simple ID
    };
    console.log("Adding new teacher:", newTeacher);
    setTeachers([...teachers, newTeacher]);
    setIsAddTeacherModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Dialog.Root
          open={isAddTeacherModalOpen}
          onOpenChange={setIsAddTeacherModalOpen}
        >
          <Dialog.Trigger asChild>
            <Button>Add Teacher</Button>
          </Dialog.Trigger>
          <AddTeacherModal
            isOpen={isAddTeacherModalOpen}
            onOpenChange={setIsAddTeacherModalOpen}
            onAddTeacher={handleAddNewTeacher}
          />
        </Dialog.Root>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">
          Registered Teachers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teacher Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.subjects.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() => setEditTeacher(teacher)}
                          >
                            <Pencil2Icon className="h-4 w-4" />
                          </Button>
                        </Dialog.Trigger>
                        {editTeacher?.id === teacher.id && (
                          <EditTeacherModal
                            teacher={editTeacher}
                            isOpen={!!editTeacher}
                            onOpenChange={(open) => !open && setEditTeacher(null)}
                            onSave={handleSaveEdit}
                          />
                        )}
                      </Dialog.Root>

                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => setDeleteTeacher(teacher)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </Dialog.Trigger>
                        {deleteTeacher?.id === teacher.id && (
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md">
                              <Dialog.Title className="text-lg font-semibold">
                                Confirm Deletion
                              </Dialog.Title>
                              <p className="mt-2 text-gray-600">
                                Are you sure you want to delete{" "}
                                <strong>{deleteTeacher.name}</strong>?
                              </p>
                              <div className="mt-4 flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteTeacher(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteTeacher(deleteTeacher.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </Dialog.Content>
                          </Dialog.Portal>
                        )}
                      </Dialog.Root>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}