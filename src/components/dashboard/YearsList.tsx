"use client";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Year {
  id: number;
  name: string;
}

interface YearsListProps {
  years: Year[];
  onDeleteYear: (id: number) => void;
  onEditYear: (id: number) => void;
}

export default function YearsList({
  years,
  onDeleteYear,
  onEditYear,
}: YearsListProps) {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Check if current user is a student
  const isStudent =
    currentUser?.role === "STUDENT" || currentUser?.role === "TEACHER";

  const handleViewClasses = (yearId: number, yearName: string) => {
    router.push(
      `/dashboard/classes?year=${yearId}&yearName=${encodeURIComponent(
        yearName
      )}`
    );
  };

  return (
    <>
      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    ID
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Year Name
                  </span>
                </th>
                {!isStudent && (
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {years?.length > 0 ? (
                years?.map((year) => (
                  <tr
                    key={`${year.id}-${year.name}`}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4">{year.id}</td>
                    <td className="p-2 md:p-4">
                      <button
                        onClick={() => handleViewClasses(year.id, year.name)}
                        className="text-green-600 hover:text-green-800 font-medium hover:underline cursor-pointer"
                      >
                        {year.name}
                      </button>
                    </td>
                    {!isStudent && (
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <button
                          onClick={() => onEditYear(year.id)}
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => onDeleteYear(year.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isStudent ? 2 : 3}
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    No years found.
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
