"use client";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

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
  onEditClass
}: ClassesListProps) {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);


  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";

  const handleEdit = (classId: string) => {
    console.log("Edit class:", classId);
  };

  const handleAssignments = (classId: string) => {
    router.push(`/dashboard/classes/${classId}/terms`);
  };

  const handleAssign = (classId: string) => {
    router.push(`/dashboard/classes/assign/${classId}`);
  };

  const handleViewStudents = (classId: string) => {
    router.push(`/dashboard/students`);
  };
  const handleViewTracker = (classId: string) => {
    router.push(`/dashboard/trackers/${classId}`);
  };

  const handleDeleteClick = (cls: Class) => {
    setClassToDelete(cls);
  };

  const handleLeaderBoard = () => {
    router.push(`/dashboard/leaderboard`);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      onDeleteClass(classToDelete.id);
      setClassToDelete(null);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold p-4 border-b">Registered Classes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Classes Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                No. of Terms
              </th>
              {!isStudent && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewStudents(cls.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
             {cls.class_name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cls.number_of_terms === 'two' ? 'Two Terms' : 'Three Terms'}</td>
                {!isStudent && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {!isTeacher && (
                        <button
                          type="button"
                          onClick={() => onEditClass(cls)}
                          className="text-gray-400 hover:text-blue-600 cursor-pointer"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      )}

<button
  type="button"
  onClick={() => handleLeaderBoard(cls.id)}
  className="text-gray-400 hover:text-green-600 cursor-pointer"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h10M4 14h6M4 18h2"
    />
  </svg>
</button>

                      <button
                        type="button"
                        onClick={() => handleAssignments(cls.id)}
                        className="text-gray-400 hover:text-green-600 cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </button>

                      {!isTeacher && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(cls)}
                          className="text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}

                      {!isTeacher && (
                        <button
                          type="button"
                          onClick={() => handleAssign(cls.id)}
                          className="text-gray-400 hover:text-purple-600 cursor-pointer"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTracker(cls.id);
                        }}
                        className="text-gray-400 hover:text-blue-500 cursor-pointer"
                        title="Tracker"
                      >
                        <BarChart3 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

            {/* Delete Confirmation Dialog */}
            <Dialog.Root open={!!classToDelete} onOpenChange={(open) => !open && setClassToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Deletion
            </Dialog.Title>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete the class{" "}
              <strong>{classToDelete?.class_name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setClassToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
