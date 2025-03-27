"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

export default function SchoolList() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Hardcoded data for demonstration
  const classesData = [
    {
      id: 1,
      className: "Mathematics 101",
      numberOfTerms: 3,
      assignedTeacher: "John Smith",
    },
    {
      id: 2,
      className: "Physics Advanced",
      numberOfTerms: 2,
      assignedTeacher: "Sarah Johnson",
    },
    {
      id: 3,
      className: "Chemistry Basics",
      numberOfTerms: 3,
      assignedTeacher: "Michael Brown",
    },
  ];

  // Handler functions for actions
  const handleEdit = (classId: number) => {
    console.log("Edit class:", classId);
  };

  const handleVideo = (classId: number) => {
    console.log("View videos for class:", classId);
  };

  const handleDelete = (classId: number) => {
    console.log("Delete class:", classId);
  };

  const handleAssign = (classId: number) => {
    router.push(`/dashboard/classes/assign/${classId}`);
  };

  const handleViewStudents = (classId: number) => {
    router.push(`/dashboard/students`);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assign Teacher
              </th>
              {currentUser?.role !== "TEACHER" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classesData.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentUser?.role === "TEACHER" ? (
                    <button
                      onClick={() => handleViewStudents(cls.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {cls.className}
                    </button>
                  ) : (
                    <span>{cls.className}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cls.numberOfTerms}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cls.assignedTeacher}
                </td>
                {currentUser?.role !== "TEACHER" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(cls.id)}
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
                        onClick={() => handleVideo(cls.id)}
                        className="text-gray-400 hover:text-green-600"
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
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cls.id)}
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

                      <button
                        type="button"
                        onClick={() => handleAssign(cls.id)}
                        className="text-gray-400 hover:text-purple-600"
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
