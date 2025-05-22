"use client";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  UserOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";

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

  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";

  const handleAssignments = (classId: string) => {
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
  };

  const confirmDelete = () => {
    if (classToDelete) {
      onDeleteClass(classToDelete.id);
      setClassToDelete(null);
    }
  };

  return (
    <div className="overflow-auto h-screen">
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
              {classes.map((cls) => (
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
                    {cls.number_of_terms === "two" ? "Two Terms" : "Three Terms"}
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
                        onClick={() => handleAssignments(cls.id)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        title="Assignments"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root
        open={!!classToDelete}
        onOpenChange={(open) => !open && setClassToDelete(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Deletion
            </Dialog.Title>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete the class{" "}
              <strong>{classToDelete?.class_name}</strong>? This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setClassToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}