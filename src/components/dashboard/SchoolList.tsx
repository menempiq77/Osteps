"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function SchoolList() {
  const { schools } = useSelector((state: RootState) => state.school);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold p-4 border-b">Registered Schools</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                School Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Admin Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Terms
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id}>
                <td className="px-6 py-4 whitespace-nowrap">{school.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {school.contactPerson}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {school.adminEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{school.terms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
