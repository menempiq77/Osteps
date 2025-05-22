"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { AddTeacherModal } from "../modals/teacherModals/AddTeacherModal";
import { EditTeacherModal } from "../modals/teacherModals/EditTeacherModal";
import {
  fetchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher as deleteTeacherApi,
} from "@/services/api";
import { Alert, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
    <div className="overflow-auto h-screen">
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

      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-2">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Teacher Name
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Phone
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Email
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Subjects
                  </span>
                </th>
                <th className="p-4 text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                >
                  <td className="p-2 md:p-4 font-medium">{teacher.name}</td>
                  <td className="p-2 md:p-4">{teacher.phone}</td>
                  <td className="p-2 md:p-4">{teacher.email}</td>
                  <td className="p-2 md:p-4">{teacher.subjects.join(", ")}</td>
                  <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button
                          onClick={() => setEditTeacher(teacher)}
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                          title="Edit"
                        >
                          <EditOutlined />
                        </button>
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
                        <button
                          onClick={() => setDeleteTeacher(teacher)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete"
                        >
                          <DeleteOutlined />
                        </button>
                      </Dialog.Trigger>
                      {deleteTeacher?.id === teacher.id && (
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}