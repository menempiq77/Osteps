"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Input, Select, Spin } from "antd";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchAssignedYearClasses,
  fetchReportAssessments,
  fetchWholeAssessmentsReport,
} from "@/services/reportApi";
import { fetchGrades } from "@/services/gradesApi";

interface Task {
  student_id: number;
  student_name: string;
  task_id: number;
  task_name: string;
  assessment_id: number;
  teacher_assessment_marks: number | null;
  allocated_marks: string;
}

interface Assessment {
  assessment_id: number;
  assessment_name: string;
  class_id: number;
  term_id: number;
  year_id: number;
  tasks: Task[];
}

interface AssignedClass {
  id: number;
  class_id: number;
  teacher_id: number;
  subject: string;
  classes: {
    id: number;
    school_id: number;
    year_id: number;
    class_name: string;
    number_of_terms: string;
    year: {
      id: number;
      school_id: number;
      name: string;
    };
    term: Array<{
      id: number;
      class_id: number;
      name: string;
    }>;
  };
}

export default function ReportsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [assesmentData, setAssesmentData] = useState([]);
  const [wholeAssesmentData, setWholeAssesmentData] = useState<Assessment[]>(
    []
  );
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  // Get unique years from assigned classes
  const years = Array.from(
    new Set(
      assignedClasses?.map((item) => ({
        id: item.classes.year.id,
        name: item.classes.year.name,
      }))
    )
  );

  // Get classes filtered by selected year
  const classes = assignedClasses
    ?.filter(
      (item) =>
        !selectedYear || item.classes.year.id.toString() === selectedYear
    )
    ?.map((item) => ({
      id: item.classes.id,
      name: item.classes.class_name,
    }));

  useEffect(() => {
    const fetchData = async () => {
      const reportData = await fetchReportAssessments();
      setAssesmentData(reportData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWholeAssessmentsReport();
        setWholeAssesmentData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedClass]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAssignedYearClasses();
        setAssignedClasses(response);

        // Set initial selected year and class if available
        if (response.length > 0) {
          const firstYear = response[0].classes.year;
          const firstClass = response[0].classes;

          setSelectedYear(firstYear.id.toString());
          setSelectedClass(firstClass.id.toString());
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add this helper function to find the current class
  const getCurrentClass = () => {
    return assignedClasses.find(
      (cls) => cls.classes.id.toString() === selectedClass
    );
  };

  const currentClass = getCurrentClass();

  // Transform API data into table format
  const transformAssessmentData = () => {
    if (!wholeAssesmentData?.length) return [];

    const filteredAssessments = wholeAssesmentData.filter((assessment) => {
      const classMatch =
        !selectedClass || assessment.class_id.toString() === selectedClass;
      const yearMatch =
        !selectedYear || assessment.year_id.toString() === selectedYear;
      return classMatch && yearMatch;
    });

    if (!filteredAssessments.length) return [];

    // Calculate the maximum possible total marks
    const maxPossibleTotal = filteredAssessments.reduce((sum, assessment) => {
      const assessmentTotal = assessment.tasks.reduce((taskSum, task) => {
        return taskSum + Number(task.allocated_marks);
      }, 0);
      return sum + assessmentTotal;
    }, 0);

    // Group tasks by student
    const studentsMap = new Map<number, any>();

    filteredAssessments?.forEach((assessment) => {
      assessment.tasks.forEach((task) => {
        if (!studentsMap.has(task.student_id)) {
          studentsMap.set(task.student_id, {
            student_id: task.student_id,
            student_name: task.student_name,
            tasks: {},
            totals: {},
          });
        }

        const student = studentsMap.get(task.student_id);
        if (!student.tasks[assessment.assessment_id]) {
          student.tasks[assessment.assessment_id] = [];
        }

        student.tasks[assessment.assessment_id].push({
          task_id: task.task_id,
          task_name: task.task_name,
          marks: Number(task.teacher_assessment_marks),
          allocated_marks: Number(task.allocated_marks),
        });
      });
    });

    // Calculate totals for each student and determine their grade
    const students = Array.from(studentsMap.values()).map((student) => {
      const studentData: any = {
        student: student.student_name,
        student_id: student.student_id,
        total: 0,
        maxPossibleTotal, // Add this to the student data
        courseGrade: "N/A", // Default grade
      };

      // Initialize all assessment fields to 0
      wholeAssesmentData.forEach((assessment) => {
        const assessmentKey = `assessment_${assessment.assessment_id}`;
        studentData[assessmentKey] = 0;
      });

      // Calculate marks for each assessment
      Object.entries(student.tasks).forEach(
        ([assessmentId, tasks]: [string, any]) => {
          const assessmentTotal = tasks.reduce((sum: number, task: any) => {
            return sum + (task.marks || 0);
          }, 0);

          studentData[`assessment_${assessmentId}`] = assessmentTotal;
          studentData.total += assessmentTotal;
        }
      );

      // Calculate percentage and determine grade
      if (maxPossibleTotal > 0) {
        const percentage = (studentData.total / maxPossibleTotal) * 100;
        studentData.percentage = percentage.toFixed(2);

        // Find the appropriate grade based on percentage
        const studentGrade = grades.find(
          (grade) =>
            percentage >= parseInt(grade.min_percentage) &&
            percentage <= parseInt(grade.max_percentage)
        );

        studentData.courseGrade = studentGrade ? studentGrade.grade : "N/A";
      }

      return studentData;
    });

    return students;
  };

  const transformedData = transformAssessmentData();

  const filteredData = transformedData.filter((student) =>
    student.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReportsDetail = (reportId: string) => {
    router.push(`/dashboard/students/reports/${reportId}`);
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
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<ChevronLeft />}
          onClick={() => router.back()}
          className="text-gray-700 border border-gray-300 hover:bg-gray-100"
        >
          Back to Students
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {currentClass?.subject || "Subject"}
      </h1>
      <div className="flex items-center space-x-4 mb-4 text-sm text-blue-500">
        <span>Home &gt;</span>
        <span>
          {selectedYear
            ? years.find((y) => y.id.toString() === selectedYear)?.name
            : "Year"}
          &gt;
        </span>
        <span>{currentClass?.subject || "Subject"}</span>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <h3 className="font-medium min-w-[120px]">View worksheet:</h3>
        <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
          {assesmentData?.map((item) => (
            <React.Fragment key={item?.id}>
              <span
                onClick={() => handleViewReportsDetail(item.id)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                {item?.name || item?.quiz?.name}
              </span>
              <span>|</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto relative rounded-lg shadow-md">
          <Card>
            <p className="font-medium">Filters</p>
            <div className="mb-6 flex flex-wrap gap-2">
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 max-w-[200px] border border-gray-300 bg-white rounded-md text-sm focus:outline-none"
              />
              <Select
                value={selectedYear}
                onChange={(value) => {
                  setSelectedYear(value);
                  setSelectedClass(null);
                }}
                style={{ width: 200 }}
                placeholder="Select Year"
                options={years?.map((year) => ({
                  value: year.id.toString(),
                  label: year.name,
                }))}
              />

              <Select
                value={selectedClass}
                onChange={setSelectedClass}
                style={{ width: 200 }}
                placeholder="Select Class"
                disabled={!selectedYear}
                options={classes?.map((cls) => ({
                  value: cls.id.toString(),
                  label: cls.name,
                }))}
              />
            </div>
            <table className="max-w-full table-fixed">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="w-24 px-2 border border-gray-300 py-3 text-left align-bottom text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-[#f0f0f0] z-10">
                    Student
                  </th>
                  {[
                    ...(wholeAssesmentData?.map(
                      (assessment) => assessment.assessment_name
                    ) || []),
                    "Total",
                    "Grade",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="w-12 px-2 py-2 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData?.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                      {student.student}
                    </td>
                    {/* Assessment marks */}
                    {wholeAssesmentData?.map((assessment) => (
                      <td
                        key={assessment.assessment_id}
                        className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500 font-medium"
                      >
                        {student[`assessment_${assessment.assessment_id}`]}
                      </td>
                    ))}
                    <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {student.total} / {student.maxPossibleTotal}
                      <span className="block text-xs text-gray-400">
                        {student.percentage}%
                      </span>
                    </td>
                    <td className="px-2 py-3 border border-gray-300 whitespace-nowrap text-sm font-medium text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.courseGrade === "A"
                            ? "bg-green-100 text-green-800"
                            : student.courseGrade === "B"
                            ? "bg-blue-100 text-blue-800"
                            : student.courseGrade === "C"
                            ? "bg-yellow-100 text-yellow-800"
                            : student.courseGrade === "D" ||
                              student.courseGrade === "E"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.courseGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
