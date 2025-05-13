"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { AddStudentModal } from "../modals/studentModals/AddStudentModal";
import { EditStudentModal } from "../modals/studentModals/EditStudentModal";
import { BarChart3, NotebookPen, Trash2 } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchStudents,
  addStudent as apiAddStudent,
  updateStudent as apiUpdateStudent,
  deleteStudent as apiDeleteStudent,
  fetchClasses,
  updateStudent,
} from "@/services/api";
import { Alert, Spin } from "antd";

// Types
type Student = {
  id: string;
  name: string;
  email: string;
  class: string;
  teacher?: string;
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
      const updatedStudent = await updateStudent(id, {
        student_name,
        email,
        class_id,
        status,
      });

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id ? updatedStudent : student
        )
      );
      await loadStudents();
      setEditStudent(null);
    } catch (err) {
      console.error("Failed to update student:", err);
      setError("Failed to update student");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await apiDeleteStudent(studentId);
      setStudents(students.filter((student) => student.id !== studentId));
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
      await loadStudents();
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
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        {currentUser?.role !== "TEACHER" && currentUser?.role !== "STUDENT" && (
          <div className="flex gap-2">
            <Dialog.Root
              open={isAddStudentModalOpen}
              onOpenChange={setIsAddStudentModalOpen}
            >
              <Dialog.Trigger asChild>
                <Button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="cursor-pointer"
                >
                  Add Student
                </Button>
              </Dialog.Trigger>
              <AddStudentModal
                isOpen={isAddStudentModalOpen}
                onOpenChange={setIsAddStudentModalOpen}
                onAddStudent={handleAddNewStudent}
                class_id={Number(classId)}
              />
            </Dialog.Root>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">
          Registered Students
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student Name
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleStudentClick(student.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-800 hover:underline">
                    {student.student_name}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {student.class_name || `Class ${student.class_id}`}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
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
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {currentUser?.role !== "TEACHER" &&
                      currentUser?.role !== "STUDENT" && (
                        <div className="flex space-x-2">
                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditStudent(student);
                                }}
                                className="cursor-pointer"
                              >
                                <Pencil2Icon className="h-4 w-4" />
                              </Button>
                            </Dialog.Trigger>
                            {editStudent && (
                              <EditStudentModal
                                student={editStudent}
                                onClose={() => setEditStudent(null)}
                                onSave={(id, name, email, classId, status) => {
                                  handleSaveEdit(
                                    id,
                                    name,
                                    email,
                                    classId,
                                    status
                                  );
                                }}
                              />
                            )}
                          </Dialog.Root>

                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteStudent(student);
                                }}
                                className="cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </Dialog.Trigger>
                            {deleteStudent?.id === student.id && (
                              <Dialog.Portal>
                                <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md">
                                  <Dialog.Title className="text-lg font-semibold">
                                    Confirm Deletion
                                  </Dialog.Title>
                                  <p className="mt-2 text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <strong>
                                      {deleteStudent?.student_name}
                                    </strong>
                                    ?
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
                                      onClick={() =>
                                        handleDeleteStudent(deleteStudent.id)
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
                      )}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Behavior"
                      className="cursor-pointer"
                      onClick={() => handleStudentBehavior(student.id)}
                    >
                      <NotebookPen className="w-4 h-4 text-blue-600" />
                    </Button>
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
