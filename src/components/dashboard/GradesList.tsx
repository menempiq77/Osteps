"use client";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Grade {
  id: number;
  grade: string;
  min_percentage: string;
  max_percentage: string;
  description: string;
}

interface GradesListProps {
  grades: Grade[];
  onDeleteGrade: (id: number) => void;
  onEditGrade: (grade: Grade) => void;
}

export default function GradesList({
  grades,
  onDeleteGrade,
  onEditGrade,
}: GradesListProps) {
  return (
    <>
      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Grade
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Mark Range
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Description
                  </span>
                </th>
                <th className="p-4 text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades?.length > 0 ? (
                grades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4 font-medium">{grade.grade}</td>
                    <td className="p-2 md:p-4">
                      {grade.min_percentage}% - {grade.max_percentage}%
                    </td>
                    <td className="p-2 md:p-4">{grade.description || "-"}</td>
                    <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                      <button
                        onClick={() => onEditGrade(grade)}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => onDeleteGrade(grade.id)}
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
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No grade ranges available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
