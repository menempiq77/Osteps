"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Input, Select, Spin } from "antd";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useSubjectContext } from "@/contexts/SubjectContext";
interface Task {
  student_id: number;
  student_name: string;
  task_id: number;
  task_name: string;
  assessment_id: number;
  teacher_assessment_marks: number | null;
  allocated_marks: string;
  submitted?: Array<{
    student_id: number;
    student_name: string;
    teacher_assessment_marks: number | null;
    mind_points?: number;
  }>;
  not_submitted?: Array<{
    student_id: number;
    student_name: string;
    mind_points?: number;
  }>;
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

function asArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ReportsPage() {
   const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();

  // Get student ID and class ID from URL
  const urlStudentId = searchParams.get('studentId');
  const urlClassId = searchParams.get('classId');

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [assesmentData, setAssesmentData] = useState([]);
  const [wholeAssesmentData, setWholeAssesmentData] = useState<Assessment[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Add state to track if we should apply URL filter
  const [applyUrlFilter, setApplyUrlFilter] = useState(true);
  
  const isSchoolAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const isHOD = currentUser?.role === "HOD";
  const schoolId = currentUser?.school;

  // Clear URL filter when component mounts with URL params
  useEffect(() => {
    if (urlStudentId || urlClassId) {
      setApplyUrlFilter(true);
    }
  }, [urlStudentId, urlClassId]);

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
          const adminData = await fetchAllYearClasses(activeSubjectId ?? undefined);

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
          response = await fetchAssignedYearClasses(activeSubjectId ?? undefined);
        }

        setAssignedClasses(response);

        if (response?.length > 0) {
          // If classId is provided in URL and we should apply the filter
          if (urlClassId && applyUrlFilter) {
            const matchedClass = response.find(
              (item) => item.classes.id.toString() === urlClassId
            );
            
            if (matchedClass) {
              setSelectedClass(matchedClass.classes.id.toString());
              setSelectedYear(matchedClass.classes.year.id.toString());
            }
          } else if (!selectedClass && !selectedYear) {
            // Default behavior - select first class and year only if nothing is selected
            const firstYear = response[0]?.classes?.year;
            const firstClass = response[0]?.classes;
            setSelectedYear(firstYear?.id?.toString());
            setSelectedClass(firstClass?.id?.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load class data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSchoolAdmin, isHOD, urlClassId, applyUrlFilter, activeSubjectId]);

  const uniqueYearIds = [...new Set(assignedClasses?.map(item => item.classes.year.id))];
  const years = uniqueYearIds.map(id => {
    const item = assignedClasses.find(item => item.classes.year.id === id);
    return {
      id: item.classes.year.id,
      name: item.classes.year.name,
    };
  });

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
      const reportData = await fetchReportAssessments(schoolId, activeSubjectId ?? undefined);
      setAssesmentData(reportData);
    };
    if (!canUseSubjectContext || activeSubjectId) {
      fetchData(schoolId);
    }
  }, [schoolId, activeSubjectId, canUseSubjectContext]);

  useEffect(() => {
    const fetchData = async (schoolId: string) => {
      try {
        const response = await fetchWholeAssessmentsReport(schoolId, activeSubjectId ?? undefined);
        setWholeAssesmentData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (!canUseSubjectContext || activeSubjectId) {
      fetchData(schoolId);
    }
  }, [selectedYear, selectedClass, schoolId, activeSubjectId, canUseSubjectContext]);

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
    const mindPointsByStudent = new Map<number, number>();

    filteredAssessments?.forEach((assessment) => {
      assessment.tasks.forEach((task) => {
        asArray<any>(task.submitted).forEach((submission: any) => {
          const submissionMindPoints = Number(submission?.mind_points ?? 0);
          if (Number.isFinite(submissionMindPoints)) {
            const existingMindPoints = mindPointsByStudent.get(submission.student_id) ?? 0;
            if (submissionMindPoints > existingMindPoints) {
              mindPointsByStudent.set(submission.student_id, submissionMindPoints);
            }
          }

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

        asArray<any>(task.not_submitted).forEach((student: any) => {
          const notSubmittedMindPoints = Number(student?.mind_points ?? 0);
          if (Number.isFinite(notSubmittedMindPoints)) {
            const existingMindPoints = mindPointsByStudent.get(student.student_id) ?? 0;
            if (notSubmittedMindPoints > existingMindPoints) {
              mindPointsByStudent.set(student.student_id, notSubmittedMindPoints);
            }
          }

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
            marks: 0,
            allocated_marks: Number(task.allocated_marks),
            submitted: false
          });
        });
      });
    });

    const students = Array.from(studentsMap.values()).map((student) => {
      const studentData: any = {
        student: student.student_name,
        student_id: student.student_id,
        total: 0,
        mindPoints: mindPointsByStudent.get(student.student_id) ?? 0,
        maxPossibleTotal,
        courseGrade: "N/A",
      };

      filteredAssessments.forEach((assessment) => {
        const assessmentKey = `assessment_${assessment.assessment_id}`;
        studentData[assessmentKey] = 0;
      });

      Object.entries(student.tasks).forEach(([assessmentId, tasks]) => {
        const typedTasks = asArray<any>(tasks);
        const assessmentTotal = typedTasks.reduce((sum: number, task: any) => {
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
      studentData.totalWithMind = studentData.total + studentData.mindPoints;
      return studentData;
    });

    return students;
  };

  const transformedData = transformAssessmentData();

  // Filter by search term AND URL student ID (only if applyUrlFilter is true)
  const filteredData = transformedData?.filter((student) => {
    const matchesSearch = student?.student?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    // Only filter by URL student ID if we're still applying the URL filter
    if (urlStudentId && applyUrlFilter) {
      return student?.student_id?.toString() === urlStudentId && matchesSearch;
    }
    
    return matchesSearch;
  });

  const filteredAssessments = wholeAssesmentData.filter((assessment) => {
    const classMatch = !selectedClass || assessment?.class_id?.toString() === selectedClass;
    const yearMatch = !selectedYear || assessment?.year_id?.toString() === selectedYear;
    return classMatch && yearMatch;
  });

  const handleViewReportsDetail = (reportId: string) => {
    router.push(`/dashboard/students/reports/${reportId}`);
  };

  // Function to clear URL filter and remove query params
  const handleClearUrlFilter = () => {
    setApplyUrlFilter(false);
    // Remove query params from URL
    router.push('/dashboard/students/reports', { scroll: false });
  };

  // Clear URL filter when user changes search or filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (applyUrlFilter && urlStudentId) {
      handleClearUrlFilter();
    }
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedClass(null);
    if (applyUrlFilter && (urlClassId || urlStudentId)) {
      handleClearUrlFilter();
    }
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (applyUrlFilter && (urlClassId || urlStudentId)) {
      handleClearUrlFilter();
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

          {urlStudentId && applyUrlFilter && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <p className="text-sm text-blue-800">
                  Showing report for selected student
                </p>
                <Button
                  size="small"
                  onClick={handleClearUrlFilter}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View all students
                </Button>
              </div>
            )}

          <Card>
            <p className="font-medium">Filters</p>
            <div className="mb-6 flex flex-wrap gap-2">
               <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 max-w-[200px] border border-gray-300 bg-white rounded-md text-sm focus:outline-none"
              />
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                style={{ width: 200 }}
                placeholder="Select Year"
                options={years?.map((year) => ({
                  value: year.id?.toString(),
                  label: year.name,
                }))}
              />

              <Select
                value={selectedClass}
                onChange={handleClassChange}
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
                    "Mind Points",
                    "Total + Mind",
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
                      <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {student.mindPoints}
                      </td>
                      <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {student.totalWithMind}
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
                      colSpan={filteredAssessments.length + 5}
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
