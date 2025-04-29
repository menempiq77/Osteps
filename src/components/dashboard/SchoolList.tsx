"use client";

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
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Registered Schools</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.adminEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onEdit(school)} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-150 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(school.id)} 
                    className="text-rose-600 hover:text-rose-900 transition-colors duration-150 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}