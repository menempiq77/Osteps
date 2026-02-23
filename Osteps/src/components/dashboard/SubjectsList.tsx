"use client";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Subject {
  id: number;
  name: string;
}

interface SubjectsListProps {
  subjects: Subject[];
  onDeleteSubject: (id: number) => void;
  onEditSubject: (subject: Subject) => void;
}

export default function SubjectsList({
  subjects,
  onDeleteSubject,
  onEditSubject,
  isStudent,
}: SubjectsListProps) {
  const router = useRouter();

  const handleSubjectClick = (id: number) => {
    router.push(`/dashboard/subjects/${id}`);
  };

  return (
    <div className="premium-card relative overflow-auto rounded-xl p-1">
      <div className="overflow-x-auto rounded-lg">
        <table className="premium-table min-w-full bg-white border border-gray-300 mb-20">
          <thead>
            <tr className="bg-gray-50 text-center text-xs md:text-sm font-semibold text-gray-700">
              <th className="p-2 border-r border-gray-300">S. No.</th>
              <th className="p-2 border-r border-gray-300">Subject Name</th>
              {/* <th className="p-2">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {subjects?.length > 0 ? (
              subjects?.map((subject, index) => (
                <tr
                  key={subject.id}
                  className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                >
                  <td className="p-2 md:p-4 font-medium">{index + 1}</td>
                  <td
                    className={`p-2 md:p-4 font-medium ${
                      isStudent
                        ? "text-gray-700 hover:text-green-700 hover:underline cursor-pointer"
                        : "text-gray-700"
                    }`}
                    onClick={() =>
                      isStudent ? handleSubjectClick(subject.id) : undefined
                    }
                  >
                    {subject.name}
                  </td>
                  {/* <td className="p-2 md:p-4 flex justify-center space-x-3">
                    <button
                      onClick={() => onEditSubject(subject)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => onDeleteSubject(subject.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <DeleteOutlined />
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No subjects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
