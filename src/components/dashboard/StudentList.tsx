"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { AddStudentModal } from "../modals/studentModals/AddStudentModal";
import { EditStudentModal } from "../modals/studentModals/EditStudentModal";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchStudents,
  addStudent as apiAddStudent,
  updateStudent as apiUpdateStudent,
  deleteStudent as apiDeleteStudent,
} from "@/services/api";
import { Alert, Spin } from "antd";
import { EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";

type Student = {
  id: string;
  student_name: string;
  email: string;
  class_id: number;
  class_name?: string;
  status: "active" | "inactive" | "suspended";
};

export default function StudentList() {
  const router = useRouter();
  const { classId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const studentsData = await fetchStudents(classId);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      loadStudents();
    }
  }, [classId]);

  const handleSaveEdit = async (
    id: string,
    student_name: string,
    email: string,
    class_id: number,
    status: "active" | "inactive" | "suspended"
  ) => {
    try {
      const updatedStudent = await apiUpdateStudent(id, {
        student_name,
        email,
        class_id,
        status,
      });

      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === id ? updatedStudent : student
        )
      );
      setEditStudent(null);
    } catch (err) {
      console.error("Failed to update student:", err);
      setError("Failed to update student");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await apiDeleteStudent(studentId);
      setStudents(students.filter(student => student.id !== studentId));
      setDeleteStudent(null);
    } catch (err) {
      console.error("Failed to delete student:", err);
      setError("Failed to delete student");
    }
  };

  const handleAddNewStudent = async (
    student_name: string,
    email: string,
    class_id: number,
    status: string
  ) => {
    try {
      const newStudent = await apiAddStudent({
        student_name,
        email,
        class_id: Number(classId),
        status,
      });
      setStudents([...students, newStudent]);
      setIsAddStudentModalOpen(false);
    } catch (err) {
      console.error("Failed to add student:", err);
      setError("Failed to add student");
    }
  };

  const handleStudentClick = (studentId: string) => {
    router.push(`/dashboard/terms/${studentId}`);
  };

  const handleStudentBehavior = (studentId: string) => {
    router.push(`/dashboard/behavior/${studentId}`);
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
        <h1 className="text-2xl font-bold">Students</h1>
        {currentUser?.role !== "TEACHER" && currentUser?.role !== "STUDENT" && (
          <Dialog.Root
            open={isAddStudentModalOpen}
            onOpenChange={setIsAddStudentModalOpen}
          >
            <Dialog.Trigger asChild>
              <Button className="cursor-pointer">Add Student</Button>
            </Dialog.Trigger>
            <AddStudentModal
              isOpen={isAddStudentModalOpen}
              onOpenChange={setIsAddStudentModalOpen}
              onAddStudent={handleAddNewStudent}
              class_id={Number(classId)}
            />
          </Dialog.Root>
        )}
      </div>

      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-2">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Student Name
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Status
                  </span>
                </th>
                <th className="p-4 text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                >
                  <td 
                    onClick={() => handleStudentClick(student.id)}
                    className="p-2 md:p-4 cursor-pointer hover:underline text-green-600 hover:text-green-800 font-medium"
                  >
                    {student.student_name}
                  </td>
                  <td className="p-2 md:p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : student.status === "inactive"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td 
                    className="relative p-2 md:p-4 flex justify-center space-x-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleStudentBehavior(student.id)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Behavior"
                    >
                      <BookOutlined />
                    </button>
                    
                    {currentUser?.role !== "TEACHER" && currentUser?.role !== "STUDENT" && (
                      <>
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditStudent(student);
                              }}
                              className="text-green-500 hover:text-green-700 cursor-pointer"
                              title="Edit"
                            >
                              <EditOutlined />
                            </button>
                          </Dialog.Trigger>
                          {editStudent?.id === student.id && (
                            <EditStudentModal
                              student={editStudent}
                              onClose={() => setEditStudent(null)}
                              onSave={(id, name, email, classId, status) => {
                                handleSaveEdit(id, name, email, classId, status);
                              }}
                            />
                          )}
                        </Dialog.Root>

                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteStudent(student);
                              }}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              title="Delete"
                            >
                              <DeleteOutlined />
                            </button>
                          </Dialog.Trigger>
                          {deleteStudent?.id === student.id && (
                            <Dialog.Portal>
                              <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                                <Dialog.Title className="text-lg font-semibold">
                                  Confirm Deletion
                                </Dialog.Title>
                                <p className="mt-2 text-gray-600">
                                  Are you sure you want to delete{" "}
                                  <strong>{deleteStudent?.student_name}</strong>?
                                </p>
                                <div className="mt-4 flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteStudent(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteStudent(deleteStudent.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Dialog.Content>
                            </Dialog.Portal>
                          )}
                        </Dialog.Root>
                      </>
                    )}
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