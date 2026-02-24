"use client";
import { useState } from "react";
import { AddTeacherModal } from "../modals/teacherModals/AddTeacherModal";
import { EditTeacherModal } from "../modals/teacherModals/EditTeacherModal";
import { Spin, Modal, Button, Breadcrumb, message } from "antd";
import { EditOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  fetchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher as deleteTeacherApi,
} from "@/services/teacherApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { fetchSubjects } from "@/services/subjectsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Teacher = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  subjects: string[];
};

type TeacherBasic = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  subjects: string[];
};
interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
}

export default function TeacherList() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [editTeacher, setEditTeacher] = useState<TeacherBasic | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isHOD = currentUser?.role === "HOD";
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const schoolId = currentUser?.school;

  const queryClient = useQueryClient();

  const {
    data: teachers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await fetchTeachers();
      return response.map((teacher: any) => ({
        id: teacher.id.toString(),
        name: teacher.teacher_name,
        phone: teacher.phone,
        email: teacher.email,
        role: teacher.role,
        subjects: Array.isArray(teacher.subjects)
          ? teacher.subjects.map((s: any) =>
              typeof s === "object" ? s.name : s
            )
          : [],
      }));
    },
    onError: (err) => {
      console.error(err);
      setError("Failed to fetch teachers");
      messageApi.error("Failed to fetch teachers");
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const data = await fetchSubjects();
      return data;
    },
    onError: (err) => {
      console.error(err);
      messageApi.error("Failed to fetch subjects");
    },
  });

  const handleSaveEdit = async (
    teacher: TeacherBasic & { password?: string }
  ) => {
    try {
      const payload: any = {
        teacher_name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        subjects: teacher.subjects,
        role: teacher.role,
        school_id: schoolId,
      };

      if (teacher.password) payload.password = teacher.password;

      await updateTeacher(teacher.id, payload);
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });

      messageApi?.success(`${teacher.role || "Teacher"} updated successfully`);
    } catch (err) {
      console.error("Failed to update teacher:", err);
      messageApi?.error("Failed to update teacher");
    }
  };

  const handleAddNewTeacher = async (teacher: TeacherBasic) => {
    try {
      const response = await addTeacher({
        teacher_name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        role: teacher?.role,
        school_id: schoolId,
        subjects: teacher.subjects,
        password: teacher.password,
      });

      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsAddTeacherModalOpen(false);
      messageApi?.success(`${teacher.role || "Teacher"} added successfully`);
    } catch (err) {
      console.error("Failed to add teacher:", err);
      messageApi?.error("Failed to add teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      // find the teacher first
      const teacherToDelete = teachers.find((t) => t.id === teacherId);

      await deleteTeacherApi(Number(teacherId));
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });

      setIsDeleteModalOpen(false);
      setDeleteTeacher(null);

      messageApi.success(
        `${teacherToDelete?.role || "Teacher"} deleted successfully`
      );
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      setError("Failed to delete teacher");
      messageApi.error("Failed to delete teacher");
    }
  };

  const handleTeacherAssignedClasses = (teacherId: string) => {
    router.push(`/dashboard/teachers/${teacherId}/assignedClasses`);
  };

  const handleAssignTeacher = (teacherId: string) => {
    router.push(`/dashboard/teachers/${teacherId}/assign`);
  };

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="premium-page overflow-auto rounded-2xl p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Teachers</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="premium-hero flex items-center justify-between mb-6 rounded-xl px-4 py-3">
        <h1 className="text-2xl font-bold uppercase">Teachers</h1>

        {hasAccess && (
          <Button
            type="primary"
            onClick={() => setIsAddTeacherModalOpen(true)}
            className="premium-pill-btn !bg-primary hover:bg-primary/90 !text-white !border-0 uppercase"
          >
            {isHOD ? "Add Teacher" : "Add Teacher / HOD"}
          </Button>
        )}
      </div>

      <div className="premium-card relative overflow-auto rounded-xl p-1">
        <div className="overflow-x-auto rounded-lg">
          <table className="premium-table min-w-full bg-white border border-gray-300 mb-2">
            <thead>
              <tr className="bg-gray-50 text-center text-xs md:text-sm font-semibold text-gray-700">
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
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Role
                  </span>
                </th>
                {hasAccess && (
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {teachers && teachers.length > 0 ? (
                teachers?.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    {hasAccess || isHOD ? (
                      <td className="p-2 md:p-4 font-medium">
                        <button
                          onClick={() =>
                            handleTeacherAssignedClasses(teacher.id)
                          }
                          className="cursor-pointer hover:text-green-500"
                        >
                          {teacher.name || "N/A"}
                        </button>
                      </td>
                    ) : (
                      <td className="p-2 md:p-4 font-medium">
                        {teacher.name || "N/A"}
                      </td>
                    )}
                    <td className="p-2 md:p-4">{teacher.phone || "N/A"}</td>
                    <td className="p-2 md:p-4">{teacher.email || "N/A"}</td>
                    <td className="p-2 md:p-4">
                      {Array.isArray(teacher.subjects) &&
                      teacher.subjects.length > 0
                        ? teacher.subjects.join(", ")
                        : "N/A"}
                    </td>
                    <td className="p-2 md:p-4">{teacher.role || "N/A"}</td>

                    {hasAccess && (
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <button
                          onClick={() => handleAssignTeacher(teacher.id)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Assign to Classes"
                        >
                          <TeamOutlined />
                        </button>

                        <button
                          onClick={() => setEditTeacher(teacher)}
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                          title="Edit"
                        >
                          <EditOutlined />
                        </button>

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
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddTeacherModalOpen}
        onOpenChange={setIsAddTeacherModalOpen}
        onAddTeacher={handleAddNewTeacher}
        isHOD={isHOD}
        subjects={subjects}
      />

      {/* Edit Teacher Modal */}
      {editTeacher && (
        <EditTeacherModal
          teacher={editTeacher}
          isOpen={!!editTeacher}
          onOpenChange={(open) => !open && setEditTeacher(null)}
          onSave={handleSaveEdit}
          isHOD={isHOD}
          subjects={subjects}
        />
      )}

      {/* Delete Confirmation Modal */}
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
            Are you sure you want to delete
            <strong> {deleteTeacher.name}</strong>? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
