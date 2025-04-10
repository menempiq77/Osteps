"use client";
import React, { useState } from "react";
import { Button } from "antd";
import Link from "next/link";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  // Sample data matching the screenshot structure
  const [editableData, setEditableData] = useState([
    {
      student: "Ahmed Mohamed",
      pitg: "7IA/Is",
      courseGrade: "B+",
      t1QuanAssessment: 85,
      t1WrittenTask: 78,
      t1Classwork: 82,
      t1Assessment: 80,
      t2WrittenTask: 84,
      t2Classwork: 79,
      t3QuanAssessment: 88,
      t3WrittenTask: 76,
      t3Classwork: 81,
      t3Assessment: 83,
      total: 816,
    },
    {
      student: "Fatima Ali",
      pitg: "7IA/Is",
      courseGrade: "A-",
      t1QuanAssessment: 90,
      t1WrittenTask: 85,
      t1Classwork: 88,
      t1Assessment: 87,
      t2WrittenTask: 89,
      t2Classwork: 86,
      t3QuanAssessment: 92,
      t3WrittenTask: 84,
      t3Classwork: 87,
      t3Assessment: 90,
      total: 888,
    },
    {
      student: "Omar Hassan",
      pitg: "7IA/Is",
      courseGrade: "B",
      t1QuanAssessment: 78,
      t1WrittenTask: 72,
      t1Classwork: 75,
      t1Assessment: 74,
      t2WrittenTask: 76,
      t2Classwork: 73,
      t3QuanAssessment: 80,
      t3WrittenTask: 71,
      t3Classwork: 74,
      t3Assessment: 78,
      total: 751,
    },
  ]);

  const filteredData = editableData.filter(student =>
    student.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkChange = (index: number, field: string, value: string) => {
    const newData = [...editableData];
    const numValue = value === "" ? 0 : parseInt(value, 10);

    newData[index] = {
      ...newData[index],
      [field]: isNaN(numValue) ? 0 : numValue,
    };

    if (field !== "total") {
      const student = newData[index];
      const total =
        (student.t1QuanAssessment || 0) +
        (student.t1WrittenTask || 0) +
        (student.t1Classwork || 0) +
        (student.t1Assessment || 0) +
        (student.t2WrittenTask || 0) +
        (student.t2Classwork || 0) +
        (student.t3QuanAssessment || 0) +
        (student.t3WrittenTask || 0) +
        (student.t3Classwork || 0) +
        (student.t3Assessment || 0);

      newData[index].total = total;
    }

    setEditableData(newData);
  };

  const handleViewReportsDetail = (reportId: string) => {
    router.push(`/dashboard/students/reports/${reportId}`);
  };
  return (
    <div className="p-3 md:p-6 lg:p-12 mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button
            icon={<ChevronLeftIcon />}
            className="text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Year 7 Islamic Education, 7IA/Is
      </h1>
      <div className="flex items-center space-x-4 mb-4 text-sm text-blue-500">
        <span>
          Home &gt; Year 7 &gt; Year 7 Islamic Education &gt;{" "}
          <strong className="text-gray-900">Methods for 7IA/Is</strong>
        </span>
      </div>

      {/* <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="font-medium mb-2">View worksheet:</h3>
        <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
          {[
            { id: 1, name: "T1 Quan Assessment" },
            { id: 2, name: "T1 Written Task" },
            { id: 3, name: "T1 Classwork" },
            { id: 4, name: "T1 Assessment" },
            { id: 5, name: "T2 Written Task" },
            { id: 6, name: "T2 Classwork" },
            { id: 7, name: "T3 Quan Assessment" },
            { id: 8, name: "T3 Written Task" },
            { id: 9, name: "T3 Classwork" },
            { id: 10, name: "T3 Assessment" },
            { id: 11, name: "Total" },
          ].map((item, index) => (
            <React.Fragment key={item.id}>
              <Button
                type="text"
                onClick={() => handleViewReportsDetail(item.id)} // Passing the id here
                className="text-blue-600 hover:bg-blue-50"
              >
                {item.name}
              </Button>
              {index < 10 && <span>|</span>}{" "}
            </React.Fragment>
          ))}
        </div>
      </div> */}

      <div className="mb-6 flex gap-2 items-end">
        <h3 className="font-medium min-w-[120px]">View worksheet:</h3>
        <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
          {[
            { id: 1, name: "T1 Quan Assessment" },
            { id: 2, name: "T1 Written Task" },
            { id: 3, name: "T1 Classwork" },
            { id: 4, name: "T1 Assessment" },
            { id: 5, name: "T2 Written Task" },
            { id: 6, name: "T2 Classwork" },
            { id: 7, name: "T3 Quan Assessment" },
            { id: 8, name: "T3 Written Task" },
            { id: 9, name: "T3 Classwork" },
            { id: 10, name: "T3 Assessment" },
            { id: 11, name: "Total" },
          ].map((item, index) => (
            <React.Fragment key={item.id}>
              <span
                onClick={() => handleViewReportsDetail(item.id)} // Passing the id here
                className="text-blue-500 cursor-pointer hover:underline"
              >
                {item.name}
              </span>
              {index < 10 && <span>|</span>}{" "}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white  overflow-hidden">
        <div className="py-4 flex justify-between items-center">
           <div className="relative ">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative rounded-lg shadow-md">
          <table className="w-full">
            <thead className="bg-[#f0f0f0]">
              <tr>
                <th className="px-2 border py-3 text-left align-bottom text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-[#f0f0f0] z-10">
                  Student
                </th>
                {[
                  "Set",
                  "PITG",
                  "Course Grade",
                  "T1 Quan Assessment",
                  "T1 Written Task",
                  "T1 Classwork",
                  "T1 Assessment",
                  "T2 Written Task",
                  "T2 Classwork",
                  "T3 Quan Assessment",
                  "T3 Written Task",
                  "T3 Classwork",
                  "T3 Assessment",
                  "Total",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-2 py-2 border text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredData.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 py-2 border whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                    {student.student}
                  </td>
                  <td className="px-2 py-2 border whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-2 py-2 border whitespace-nowrap text-sm text-gray-500">
                    {student.pitg}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.courseGrade === 'A-' ? 'bg-green-100 text-green-800' :
                      student.courseGrade === 'B+' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.courseGrade}
                    </span>
                  </td>
                  {/* Editable mark cells */}
                  <EditableCell
                    value={student.t1QuanAssessment}
                    onChange={(value) =>
                      handleMarkChange(index, "t1QuanAssessment", value)
                    }
                  />
                  <EditableCell
                    value={student.t1WrittenTask}
                    onChange={(value) =>
                      handleMarkChange(index, "t1WrittenTask", value)
                    }
                  />
                  <EditableCell
                    value={student.t1Classwork}
                    onChange={(value) =>
                      handleMarkChange(index, "t1Classwork", value)
                    }
                  />
                  <EditableCell
                    value={student.t1Assessment}
                    onChange={(value) =>
                      handleMarkChange(index, "t1Assessment", value)
                    }
                  />
                  <EditableCell
                    value={student.t2WrittenTask}
                    onChange={(value) =>
                      handleMarkChange(index, "t2WrittenTask", value)
                    }
                  />
                  <EditableCell
                    value={student.t2Classwork}
                    onChange={(value) =>
                      handleMarkChange(index, "t2Classwork", value)
                    }
                  />
                  <EditableCell
                    value={student.t3QuanAssessment}
                    onChange={(value) =>
                      handleMarkChange(index, "t3QuanAssessment", value)
                    }
                  />
                  <EditableCell
                    value={student.t3WrittenTask}
                    onChange={(value) =>
                      handleMarkChange(index, "t3WrittenTask", value)
                    }
                  />
                  <EditableCell
                    value={student.t3Classwork}
                    onChange={(value) =>
                      handleMarkChange(index, "t3Classwork", value)
                    }
                  />
                  <EditableCell
                    value={student.t3Assessment}
                    onChange={(value) =>
                      handleMarkChange(index, "t3Assessment", value)
                    }
                  />
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {student.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const EditableCell = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: string) => void;
}) => {
  return (
    <td className="px-2 py-2 border text-center whitespace-nowrap">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-12 bg-transparent border-none focus:ring-0 text-sm text-gray-500 p-0"
      />
    </td>
  );
};
