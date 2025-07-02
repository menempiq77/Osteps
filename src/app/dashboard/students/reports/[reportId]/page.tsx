"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Input, message, Spin } from "antd";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { fetchReportSpecificAssessmentTasks } from "@/services/reportApi";
import { addStudentTaskMarks } from "@/services/api";
import { fetchGrades } from "@/services/gradesApi";

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
interface Grade {
  id: number;
  grade: string;
  min_percentage: string;
  max_percentage: string;
  description: string;
}

export default function Page() {
  const { reportId } = useParams();
  const router = useRouter();
  const [apiData, setApiData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchGrades();
        const sortedGrades = [...data].sort(
          (a, b) => parseInt(b.min_percentage) - parseInt(a.min_percentage)
        );
        setGrades(sortedGrades);
      } catch (err) {
        setError("Failed to load grades");
        console.error(err);
      }
    };
    loadGrades();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchReportSpecificAssessmentTasks(
          Number(reportId)
        );
        setApiData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const handleMarkChange = async (
    studentIndex: number,
    taskIndex: number,
    value: string,
    studentId: number,
    taskId: number
  ) => {
    const newData = [...apiData];
    const numValue = value === "" ? null : parseInt(value, 10);

    newData[studentIndex].tasks[taskIndex].teacher_assessment_marks = isNaN(
      numValue
    )
      ? null
      : numValue;
    setApiData(newData);

    if (!isNaN(numValue) && numValue !== null) {
      try {
        await addStudentTaskMarks(studentId, {
          assessment_id: Number(reportId),
          task_id: taskId,
          teacher_assessment_marks: numValue,
          teacher_assessment_feedback: "",
        });
        messageApi.success("Marks updated successfully");
      } catch (error) {
        console.error("Error updating marks:", error);
        messageApi.error("Failed to update marks");
        newData[studentIndex].tasks[taskIndex].teacher_assessment_marks =
          apiData[studentIndex].tasks[taskIndex].teacher_assessment_marks;
        setApiData([...newData]);
      }
    }
  };

  const allTaskNames = Array.from(
    new Set(
      apiData.flatMap((student) => student.tasks.map((task) => task.task_name))
    )
  );

  const calculateGrade = (percentage: number) => {
    if (!grades.length) return "N/A";

    const matchedGrade = grades.find(
      (grade) =>
        percentage >= parseInt(grade.min_percentage) &&
        percentage <= parseInt(grade.max_percentage)
    );

    return matchedGrade ? matchedGrade.grade : "F";
  };

  const studentsWithTotals = apiData
    .filter(
      (student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toString().includes(searchTerm)
    )
    .map((student) => {
      const total = student.tasks.reduce((sum, task) => {
        return sum + (Number(task.teacher_assessment_marks) || 0);
      }, 0);

      const maxPossible = student.tasks.reduce((sum, task) => {
        return sum + parseInt(task.allocated_marks);
      }, 0);

      const percentage = maxPossible > 0 ? (total / maxPossible) * 100 : 0;
      const grade = calculateGrade(percentage);

      return {
        ...student,
        total,
        grade,
        maxPossible,
        percentage,
      };
    });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
      case "E":
        return "bg-orange-100 text-orange-800";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 lg:p-12 mx-auto bg-white min-h-screen">
      {contextHolder}
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
        <div className="py-2 text-sm text-blue-500">Marksheet: Assessment</div>

        <Card className="overflow-x-auto relative w-fit">
          <div className="relative max-w-[200px] mb-6">
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none"
            />
          </div>
          <table className="table-fixed ">
            <thead className="bg-[#f0f0f0]">
              <tr>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-[#f0f0f0] z-10 border border-gray-300">
                  Student
                </th>
                <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                  ID
                </th>
                {allTaskNames.map((taskName, index) => (
                  <th
                    key={index}
                    className="w-12 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300"
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
                    className="w-12px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300"
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300 sticky left-0 bg-white z-10">
                    {student.student_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-300">
                    {student.student_id}
                  </td>
                  {allTaskNames.map((taskName, taskNameIndex) => {
                    // Find the task with this name for the current student
                    const task = student.tasks.find(
                      (t) => t.task_name === taskName
                    );
                    return (
                      <td
                        key={taskNameIndex}
                        className="px-2 py-4 text-center whitespace-nowrap border border-gray-300"
                      >
                        {task ? (
                          <>
                            <input
                              type="text"
                              value={task.teacher_assessment_marks || ""}
                              onChange={(e) => {
                                const taskIndex = student.tasks.findIndex(
                                  (t) => t.task_name === taskName
                                );
                                handleMarkChange(
                                  studentIndex,
                                  taskIndex,
                                  e.target.value,
                                  student.student_id,
                                  task.task_id
                                );
                              }}
                              className="w-12 text-center bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className="text-xs text-gray-400 ml-1">
                              / {task.allocated_marks}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-300">
                    {student.total}
                    <div className="text-xs text-gray-500 mt-1">
                      {student.percentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm border border-gray-300">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(
                        student.grade
                      )}`}
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
