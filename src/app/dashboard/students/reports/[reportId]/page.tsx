"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Spin } from "antd";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { fetchReportSpecificAssessmentTasks } from "@/services/reportApi";

interface Task {
  id: number;
  task_id: number;
  task_name: string;
  allocated_marks: string;
  teacher_assessment_marks: number | null;
}

interface StudentData {
  student_id: number;
  student_name: string;
  tasks: Task[];
}

export default function Page() {
  const { reportId } = useParams();
  const router = useRouter();
  const [apiData, setApiData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchReportSpecificAssessmentTasks(Number(reportId));
        setApiData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const handleMarkChange = (
    studentIndex: number,
    taskIndex: number,
    value: string
  ) => {
    const newData = [...apiData];
    const numValue = value === "" ? 0 : parseInt(value, 10);

    newData[studentIndex].tasks[taskIndex].teacher_assessment_marks = isNaN(numValue)
      ? null
      : numValue;

    setApiData(newData);
  };

  // Get unique task names from the first student (assuming all students have same tasks)
  const taskNames = apiData[0]?.tasks.map((task) => task.task_name) || [];

  // Calculate totals for each student
  const studentsWithTotals = apiData.map(student => {
    const total = student.tasks.reduce((sum, task) => {
      return sum + (task.teacher_assessment_marks || 0);
    }, 0);
    
    const maxPossible = student.tasks.reduce((sum, task) => {
      return sum + parseInt(task.allocated_marks);
    }, 0);
    
    const percentage = maxPossible > 0 ? (total / maxPossible) * 100 : 0;
    
    let grade = "D";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    
    return {
      ...student,
      total,
      grade,
      maxPossible
    };
  });

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 lg:p-12 mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
          <Button
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Back to Assessments
          </Button>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Islamic Education
        </h1>
        <div className="text-sm text-blue-500">
          <span className="hover:text-blue-600 transition-colors">
            Home &gt; Year 7 &gt; Year 7 Islamic Education
          </span>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="py-2 flex flex-col gap-2">
          <div className="text-sm text-blue-500">
            Marksheet: T3 Quran Assessment
          </div>
          <div className="relative w-64 ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
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
            <input
              type="text"
              placeholder="Search students..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>

        <Card className="overflow-x-auto relative w-fit">
          <table className="table-fixed ">
            <thead className="bg-[#f0f0f0]">
              <tr>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-[#f0f0f0] z-10 border">
                  Student
                </th>
                <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  ID
                </th>
                {taskNames.map((taskName, index) => (
                  <th
                    key={index}
                    className="w-12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {taskName}
                  </th>
                ))}
                {["Total", "Grade"].map((label, index) => (
                  <th
                    key={`extra-${index}`}
                    className="w-12px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsWithTotals.map((student, studentIndex) => (
                <tr key={studentIndex} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border sticky left-0 bg-white z-10">
                    {student.student_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 border">
                    {student.student_id}
                  </td>
                  {student.tasks.map((task, taskIndex) => (
                    <td
                      key={taskIndex}
                      className="px-2 py-4 text-center whitespace-nowrap border"
                    >
                      <input
                        type="text"
                        value={task.teacher_assessment_marks || ""}
                        onChange={(e) =>
                          handleMarkChange(
                            studentIndex,
                            taskIndex,
                            e.target.value
                          )
                        }
                        className="w-12 text-center bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-xs text-gray-400 ml-1">
                        / {task.allocated_marks}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border">
                    {student.total}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm border">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.grade === "A+"
                          ? "bg-green-100 text-green-800"
                          : student.grade === "A"
                          ? "bg-blue-100 text-blue-800"
                          : student.grade === "B"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}