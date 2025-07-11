"use client";
import { RootState } from "@/store/store";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";

interface Class {
  id: string;
  class_name: string;
  teacher_id: number;
  year_id: number;
  number_of_terms: string;
  teacher_name?: string;
}

interface ClassesListProps {
  classes: Class[];
  onDeleteClass: (id: string) => void;
  onEditClass: (cls: Class) => void;
}

export default function ClassesList({
  classes,
  onDeleteClass,
  onEditClass,
}: ClassesListProps) {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";

  const handleAssesments = (classId: string) => {
    router.push(`/dashboard/classes/${classId}/terms`);
  };

  const handleAssign = (classId: string) => {
    router.push(`/dashboard/classes/assign/${classId}`);
  };

  const handleViewStudents = (classId: string) => {
    router.push(`/dashboard/students/${classId}`);
  };

  const handleViewTracker = (classId: string) => {
    router.push(`/dashboard/trackers/${classId}`);
  };

  const handleDeleteClick = (cls: Class) => {
    setClassToDelete(cls);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      onDeleteClass(classToDelete.id);
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  return (
    <div className="overflow-auto">
      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Class Name
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    No. of Terms
                  </span>
                </th>
                {!isStudent && (
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                )}
              </tr>
            </thead>
              <tbody>
              {classes?.length === 0 ? (
                <tr>
                  <td 
                    colSpan={!isStudent ? 3 : 2}
                    className="p-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-lg mb-2">No classes found</div>
                      {!isStudent && (
                        <p className="text-sm text-gray-400">
                          Click the 'Add Class' button to create a new class
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                classes?.map((cls) => (
                  <tr
                    key={cls.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4">
                      <button
                        onClick={() => handleViewStudents(cls.id)}
                        className="text-green-600 hover:text-green-800 font-medium hover:underline cursor-pointer"
                      >
                        {cls.class_name}
                      </button>
                    </td>
                    <td className="p-2 md:p-4">
                      {cls.number_of_terms === "two"
                        ? "Two Terms"
                        : "Three Terms"}
                    </td>
                    {!isStudent && (
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        {!isTeacher && (
                          <button
                            onClick={() => onEditClass(cls)}
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                            title="Edit"
                          >
                            <EditOutlined />
                          </button>
                        )}

                        <button
                          onClick={() => handleAssesments(cls.id)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Assessments"
                        >
                          <FileAddOutlined />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTracker(cls.id);
                          }}
                          className="text-purple-500 hover:text-purple-700 cursor-pointer"
                          title="Tracker"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>

                        {!isTeacher && (
                          <button
                            onClick={() => handleAssign(cls.id)}
                            className="text-orange-500 hover:text-orange-700 cursor-pointer"
                            title="Assign Teacher"
                          >
                            <UsergroupAddOutlined />
                          </button>
                        )}

                        {!isTeacher && (
                          <button
                            onClick={() => handleDeleteClick(cls)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            title="Delete"
                          >
                            <DeleteOutlined />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setClassToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {classToDelete && (
          <p>
            Are you sure you want to delete the class{" "}
            <strong>{classToDelete.class_name}</strong>? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
