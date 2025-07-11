"use client";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function SchoolList({
  schools,
  onEdit,
  onDelete,
}: {
  schools: any[];
  onEdit: (school: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    School Name
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Admin Email
                  </span>
                </th>
                <th className="p-0">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Contact Person
                  </span>
                </th>
                <th className="p-4 text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools?.length > 0 ? (
                schools?.map((school) => (
                  <tr
                    key={school?.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4 font-medium">{school.name}</td>
                    <td className="p-2 md:p-4">{school.adminEmail}</td>
                    <td className="p-2 md:p-4">{school.contactPerson}</td>
                    <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                      <button
                        onClick={() => onEdit(school)}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => onDelete(school.id)}
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
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No schools found
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
