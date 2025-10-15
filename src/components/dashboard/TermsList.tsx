"use client";
import { useParams, useRouter } from "next/navigation";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Term {
  id: number;
  name: string;
}

interface TermsListProps {
  terms: Term[];
  onEdit: (term: Term) => void;
  onDelete: (id: number) => void;
}

export default function TermsList({
  terms,
  onEdit,
  onDelete,
  hasAccess,
}: TermsListProps) {
  const router = useRouter();
  const params = useParams();
  const classId = Number(params.classId);

  const handleTermClick = (termId: number) => {
    router.push(`/dashboard/classes/${classId}/terms/${termId}`);
  };

  return (
    <div className="overflow-auto">
      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  S. No.
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Terms
                  </span>
                </th>
                {hasAccess && (
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {terms?.length > 0 ? (
                terms.map((term, index) => (
                  <tr
                    key={term.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4">
                      {index+1}
                    </td>
                    <td className="p-2 md:p-4">
                      {/* <button
                        type="button"
                        onClick={() => handleTermClick(term.id)}
                        className="text-green-600 hover:text-green-800 font-medium hover:underline cursor-pointer"
                      >
                        {term.name}
                      </button> */}
                      {term.name}
                    </td>
                    {hasAccess && (
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => onEdit(term)}
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                          title="Edit"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(term.id)}
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
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No Terms Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
