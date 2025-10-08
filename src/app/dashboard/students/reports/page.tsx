"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Input, Select, Spin } from "antd";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchAllYearClasses,
  fetchAssignedYearClasses,
  fetchReportAssessments,
  fetchWholeAssessmentsReport,
} from "@/services/reportApi";
import { fetchGrades } from "@/services/gradesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
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
interface Grade {
  id: number;
  grade: string;
  min_percentage: string;
  max_percentage: string;
  description: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
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
  const isSchoolAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const isHOD = currentUser?.role === "HOD";
  const schoolId = currentUser?.school;

  useEffect(() => {
    const loadGrades = async (schoolId: string) => {
      try {
        const data = await fetchGrades(schoolId);
        const sortedGrades = [...data].sort(
          (a, b) => parseInt(b.min_percentage) - parseInt(a.min_percentage)
        );
        setGrades(sortedGrades);
      } catch (err) {
        setError("Failed to load grades");
        console.error(err);
      }
    };
    loadGrades(schoolId);
  }, [schoolId]);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isSchoolAdmin || isHOD) {
        const adminData = await fetchAllYearClasses();

        // Transform to match fetchAssignedYearClasses format
        response = adminData.school_classs.map((cls: any) => {
          const year = adminData.years.find((y: any) => y.id === cls.year_id);
          return {
            id: cls.id,
            classes: {
              id: cls.id,
              year_id: cls.year_id,
              class_name: cls.class_name,
              year: {
                id: year?.id,
                name: year?.name,
              },
              school_id: cls.school_id,
              number_of_terms: cls.number_of_terms,
              term: cls.term || [],
            },
          };
        });
      } else {
        response = await fetchAssignedYearClasses();
      }

      setAssignedClasses(response);

      if (response?.length > 0) {
        const firstYear = response[0]?.classes?.year;
        const firstClass = response[0]?.classes;

        setSelectedYear(firstYear?.id?.toString());
        setSelectedClass(firstClass?.id?.toString());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [isSchoolAdmin, isHOD]);

  
  const years = Array.from(
    new Set(
      assignedClasses?.map((item) => ({
        id: item.classes.year.id,
        name: item.classes.year.name,
      }))
    )
  );

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
    const fetchData = async (schoolId: string) => {
      const reportData = await fetchReportAssessments(schoolId);
      setAssesmentData(reportData);
    };
    fetchData(schoolId);
  }, [schoolId]);

  useEffect(() => {
    const fetchData = async (schoolId: string) => {
      try {
        const response = await fetchWholeAssessmentsReport(schoolId);
        setWholeAssesmentData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData(schoolId);
  }, [selectedYear, selectedClass, schoolId]);


  const getCurrentClass = () => {
    return assignedClasses?.find(
      (cls) => cls.classes.id.toString() === selectedClass
    );
  };

  const currentClass = getCurrentClass();

  const transformAssessmentData = () => {
    if (!wholeAssesmentData?.length) return [];

    const filteredAssessments = wholeAssesmentData.filter((assessment) => {
        const classMatch = !selectedClass || assessment?.class_id?.toString() === selectedClass;
        const yearMatch = !selectedYear || assessment?.year_id?.toString() === selectedYear;
        return classMatch && yearMatch;
    });

    if (!filteredAssessments.length) return [];

    const maxPossibleTotal = filteredAssessments.reduce((sum, assessment) => {
        const assessmentTotal = assessment.tasks.reduce((taskSum, task) => {
            return taskSum + Number(task.allocated_marks);
        }, 0);
        return sum + assessmentTotal;
    }, 0);

    const studentsMap = new Map();

    filteredAssessments?.forEach((assessment) => {
        assessment.tasks.forEach((task) => {
            // Process submitted students
            task.submitted.forEach((submission) => {
                if (!studentsMap.has(submission.student_id)) {
                    studentsMap.set(submission.student_id, {
                        student_id: submission.student_id,
                        student_name: submission.student_name,
                        tasks: {},
                    });
                }

                const student = studentsMap.get(submission.student_id);
                if (!student.tasks[assessment.assessment_id]) {
                    student.tasks[assessment.assessment_id] = [];
                }

                student.tasks[assessment.assessment_id].push({
                    task_id: task.task_id,
                    task_name: task.task_name,
                    marks: Number(submission.teacher_assessment_marks),
                    allocated_marks: Number(task.allocated_marks),
                    submitted: true
                });
            });

            // Process not submitted students (with 0 marks)
            task.not_submitted.forEach((student) => {
                if (!studentsMap.has(student.student_id)) {
                    studentsMap.set(student.student_id, {
                        student_id: student.student_id,
                        student_name: student.student_name,
                        tasks: {},
                    });
                }

                const studentData = studentsMap.get(student.student_id);
                if (!studentData.tasks[assessment.assessment_id]) {
                    studentData.tasks[assessment.assessment_id] = [];
                }

                studentData.tasks[assessment.assessment_id].push({
                    task_id: task.task_id,
                    task_name: task.task_name,
                    marks: 0, // 0 marks for not submitted
                    allocated_marks: Number(task.allocated_marks),
                    submitted: false
                });
            });
        });
    });

    const students = Array.from(studentsMap.values()).map((student) => {
        const studentData = {
            student: student.student_name,
            student_id: student.student_id,
            total: 0,
            maxPossibleTotal,
            courseGrade: "N/A",
        };

        filteredAssessments.forEach((assessment) => {
            const assessmentKey = `assessment_${assessment.assessment_id}`;
            studentData[assessmentKey] = 0;
        });

        Object.entries(student.tasks).forEach(([assessmentId, tasks]) => {
            const assessmentTotal = tasks.reduce((sum, task) => {
                return sum + (task.marks || 0);
            }, 0);

            studentData[`assessment_${assessmentId}`] = assessmentTotal;
            studentData.total += assessmentTotal;
        });

        if (maxPossibleTotal > 0) {
            const percentage = (studentData.total / maxPossibleTotal) * 100;
            studentData.percentage = percentage.toFixed(2);
            const studentGrade = grades?.find(
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

  const filteredData = transformedData?.filter((student) =>
    student?.student?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const filteredAssessments = wholeAssesmentData.filter((assessment) => {
  const classMatch = !selectedClass || assessment?.class_id?.toString() === selectedClass;
  const yearMatch = !selectedYear || assessment?.year_id?.toString() === selectedYear;
  return classMatch && yearMatch;
});

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
      <Link href="/dashboard">
        <Button
          icon={<ChevronLeft />}
          className="text-gray-700 border border-gray-300 hover:bg-gray-100"
        >
          Back to Dashboard
        </Button>
      </Link>
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

      <div className="mb-6 flex flex-col lg:flex-row gap-2">
        <h3 className="font-medium min-w-[120px]">View worksheet:</h3>
        <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
          {assesmentData?.map((item, index) => (
            <React.Fragment key={index}>
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
                  value: year.id?.toString(),
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
                  value: cls.id?.toString(),
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
                    ...(filteredAssessments?.map(
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

              <tbody className="divide-y divide-gray-200 bg-white shadow">
                {filteredData?.length > 0 ? (
                  filteredData.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {student.student}
                      </td>

                      {/* Assessment marks */}
                      {filteredAssessments?.map((assessment) => (
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
                              : student.courseGrade === "D" || student.courseGrade === "E"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.courseGrade}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={wholeAssesmentData?.length + 3} // dynamic colspan
                      className="text-center py-4 text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
