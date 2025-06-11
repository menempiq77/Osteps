"use client";
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
import { Alert, Spin, Modal, Button } from "antd";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          subjects: teacher.subjects.split(",").map((s: string) => s.trim()),
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
        subjects: teacher.subjects.join(","),
      });

      setTeachers(
        teachers.map((t) =>
          t.id === teacher.id
            ? {
                ...teacher,
                name: response.data?.teacher_name,
                phone: response.data?.phone,
                email: response.data?.email,
                subjects: response.data?.subjects
                  .split(",")
                  .map((s: string) => s.trim()),
              }
            : t
        )
      );
      setEditTeacher(null);
    } catch (err) {
      console.error("Failed to update teacher:", err);
      setError("Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      await deleteTeacherApi(Number(teacherId));
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
      setIsDeleteModalOpen(false);
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
        subjects: teacher.subjects.join(","),
      });

      const newTeacher = {
        id: response.data.id.toString(),
        name: response.data?.teacher_name,
        phone: response.data?.phone,
        email: response.data?.email,
        subjects: response.data?.subjects
          .split(",")
          .map((s: string) => s.trim()),
      };

      setTeachers([...teachers, newTeacher]);
      setIsAddTeacherModalOpen(false);
    } catch (err) {
      console.error("Failed to add teacher:", err);
      setError("Failed to add teacher");
    }
  };

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
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
            <Button className="!bg-primary !text-white">Add Teacher</Button>
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
              {teachers?.length > 0 ? (
                teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4 font-medium">{teacher.name}</td>
                    <td className="p-2 md:p-4">{teacher.phone}</td>
                    <td className="p-2 md:p-4">{teacher.email}</td>
                    <td className="p-2 md:p-4">
                      {teacher.subjects.join(", ")}
                    </td>
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
                            onOpenChange={(open) =>
                              !open && setEditTeacher(null)
                            }
                            onSave={handleSaveEdit}
                          />
                        )}
                      </Dialog.Root>

                      <button
                        onClick={() => {
                          setDeleteTeacher(teacher);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete"
                      >
                        <DeleteOutlined />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ant Design Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={() => deleteTeacher && handleDeleteTeacher(deleteTeacher.id)}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteTeacher(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {deleteTeacher && (
          <p>
            Are you sure you want to delete teacher{" "}
            <strong>{deleteTeacher.name}</strong>? This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
