"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { AddTeacherModal } from "../modals/teacherModals/AddTeacherModal";
import { EditTeacherModal } from "../modals/teacherModals/EditTeacherModal";
import { Trash2 } from "lucide-react";
import {
  fetchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher as deleteTeacherApi 
} from "@/services/api";
import { Alert, Spin } from "antd";

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editTeacher, setEditTeacher] = useState<TeacherBasic | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTeachers();
        // Transform API data to match our frontend structure
        const transformedTeachers = response.map((teacher: any) => ({
          id: teacher.id.toString(),
          name: teacher.teacher_name,
          phone: teacher.phone,
          email: teacher.email,
          subjects: teacher.subjects.split(',').map((s: string) => s.trim()),
        }));
        setTeachers(transformedTeachers);
      } catch (err) {
        setError("Failed to fetch teachers");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const handleSaveEdit = async (teacher: TeacherBasic) => {
    try {
      const response = await updateTeacher(teacher.id, {
        teacher_name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        subjects: teacher.subjects.join(','),
      });
      
      setTeachers(teachers.map(t => 
        t.id === teacher.id ? {
          ...teacher,
          name: response.data.teacher_name,
          phone: response.data.phone,
          email: response.data.email,
          subjects: response.data.subjects.split(',').map((s: string) => s.trim()),
        } : t
      ));
      setEditTeacher(null);
    } catch (err) {
      console.error("Failed to update teacher:", err);
      setError("Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      await deleteTeacherApi(Number(teacherId));
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
      setDeleteTeacher(null);
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      setError("Failed to delete teacher");
    }
  };

  const handleAddNewTeacher = async (teacher: TeacherBasic) => {
    try {
      const response = await addTeacher({
        teacher_name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        subjects: teacher.subjects.join(','),
      });
      
      const newTeacher = {
        id: response.data.id.toString(),
        name: response.data.teacher_name,
        phone: response.data.phone,
        email: response.data.email,
        subjects: response.data.subjects.split(',').map((s: string) => s.trim()),
      };
      
      setTeachers([...teachers, newTeacher]);
      setIsAddTeacherModalOpen(false);
    } catch (err) {
      console.error("Failed to add teacher:", err);
      setError("Failed to add teacher");
    }
  };

  if (isLoading) return (
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
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Dialog.Root
          open={isAddTeacherModalOpen}
          onOpenChange={setIsAddTeacherModalOpen}
        >
          <Dialog.Trigger asChild>
            <Button className="cursor-pointer">Add Teacher</Button>
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
                            className="cursor-pointer"
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
                            className="cursor-pointer"
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
                                  onClick={() => handleDeleteTeacher(deleteTeacher.id)}
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