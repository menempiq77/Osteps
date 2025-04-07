"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { describe } from "node:test";

export default function AssessmentList() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const assignmentsData = [
    {
      id: 1,
      assignmentName: "Written Task",
      description: "Description for Written Task",
    },
    {
      id: 2,
      assignmentName: "Tajweed Task",
      description: "Upload file for Tajweed Task",
    },
    {
      id: 3,
      assignmentName: "Hadees Task",
      description: "Description for Hadees Task",
    },
  ];

  // Handler functions for actions
  const handleEdit = (assignmentId: number) => {
    console.log("Edit assignment:", assignmentId);
  };

  const handleDelete = (assignmentId: number) => {
    console.log("Delete assignment:", assignmentId);
  };

  const handleAssigment = (assignmentId: number) => {
    router.push(`/dashboard/assignments/${assignmentId}`);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold p-4 border-b">
        Registered Tasks
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assignment Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              {currentUser?.role !== "TEACHER" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignmentsData.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleAssigment(assignment.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {assignment.assignmentName}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                  >
                    {assignment.description}
                  </span>
                </td>
                {currentUser?.role !== "TEACHER" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(assignment.id)}
                        className="text-gray-400 hover:text-blue-600"
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

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment.id)}
                        className="text-gray-400 hover:text-red-600"
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
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
