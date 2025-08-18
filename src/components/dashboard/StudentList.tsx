"use client";
import { useState, useEffect } from "react";
import { AddStudentModal } from "../modals/studentModals/AddStudentModal";
import { EditStudentModal } from "../modals/studentModals/EditStudentModal";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button, Modal, Spin, Form, Breadcrumb, message } from "antd";
import { EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  fetchStudents,
  addStudent as apiAddStudent,
  updateStudent as apiUpdateStudent,
  deleteStudent as apiDeleteStudent,
} from "@/services/studentsApi";

type Student = {
  id: string;
  student_name: string;
  user_name: string;
  email: string;
  class_id: number;
  class_name?: string;
  status: "active" | "inactive" | "suspended";
};

export default function StudentList() {
  const router = useRouter();
  const { classId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "HOD";

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
    const savedYearId = localStorage.getItem("selectedYearId");
    if (savedYearId) {
      setSelectedYearId(Number(savedYearId));
    }
  }, [classId]);

  const handleSaveEdit = async (values: any) => {
    try {
      const updatedStudent = await apiUpdateStudent(editStudent?.id || "", {
        student_name: values.student_name,
        email: values.email,
        user_name: values.user_name,
        class_id: Number(classId),
        password: values.password,
        status: values.status,
      });

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === editStudent?.id ? updatedStudent : student
        )
      );
      setEditStudent(null);
      await loadStudents();
      messageApi?.success("Student Update Successfully!");
    } catch (err) {
      console.error("Failed to update student:", err);
      setError("Failed to update student");
      messageApi?.error("Failed to update student!");
    }
  };

  const showDeleteConfirm = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      await apiDeleteStudent(studentToDelete.id);
      setStudents(
        students.filter((student) => student.id !== studentToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      messageApi?.success("Student Deleted Successfully!");
    } catch (err) {
      console.error("Failed to delete student:", err);
      setError("Failed to delete student");
      messageApi?.error("Failed to delete student!");
    }
  };

  const handleAddNewStudent = async (values: any) => {
    try {
      const newStudent = await apiAddStudent({
        student_name: values.student_name,
        email: values.email,
        user_name: values.user_name,
        class_id: Number(classId),
        password: values.password,
        status: values.status,
      });
      setStudents([...students, newStudent]);
      form.resetFields();
      setIsAddStudentModalOpen(false);
      await loadStudents();
      messageApi?.success("Student Added Successfully!");
    } catch (err) {
      console.error("Failed to add student:", err);
      setError("Failed to add student");
      messageApi?.error("Failed to add student!");
    }
  };

  const handleStudentClick = (studentId: string) => {
    router.push(
      `/dashboard/students/${classId}/view-student-assesment/${studentId}`
    );
  };

  const handleStudentBehavior = (studentId: string) => {
    router.push(`/dashboard/classes/${classId}/behavior/${studentId}`);
  };

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/dashboard/years">Academic Years</Link>,
          },
          {
            title: selectedYearId ? (
              <Link href={`/dashboard/classes?year=${selectedYearId}`}>
                Classes
              </Link>
            ) : (
              <Link href="/dashboard/classes">Classes</Link>
            ),
          },
          {
            title: <span>Students</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        {hasAccess && (
          <Button
            type="primary"
            className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
            onClick={() => setIsAddStudentModalOpen(true)}
          >
            Add Student
          </Button>
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
                    Username
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
              {students?.length > 0 ? (
                students?.map((student) => (
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
                        className={`px-2 py-1 rounded-full text-xs`}
                      >
                        {student.user_name || "N/A"}
                      </span>
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

                      {hasAccess && (
                          <>
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

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDeleteConfirm(student);
                              }}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                              title="Delete"
                            >
                              <DeleteOutlined />
                            </button>
                          </>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddStudentModal
        open={isAddStudentModalOpen}
        onCancel={() => setIsAddStudentModalOpen(false)}
        onOk={handleAddNewStudent}
        classId={Number(classId)}
      />

      <EditStudentModal
        open={!!editStudent}
        onCancel={() => setEditStudent(null)}
        onOk={handleSaveEdit}
        student={editStudent}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteStudent}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {studentToDelete && (
          <p>
            Are you sure you want to delete {studentToDelete.student_name}? This
            action cannot be undone.
          </p>
        )}
      </Modal>
    </>
  );
}
