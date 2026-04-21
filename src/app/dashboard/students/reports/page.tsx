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
import { addTask, addStudentTaskMarks } from "@/services/api";
import { fetchGrades } from "@/services/gradesApi";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
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
  const {
    activeSubjectId,
    canUseSubjectContext,
    subjects,
    loading: subjectContextLoading,
  } = useSubjectContext();

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
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");

  // Inline mark editing
  const [editingCell, setEditingCell] = useState<{ studentId: number; taskId: number } | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [savingCell, setSavingCell] = useState<{ studentId: number; taskId: number } | null>(null);
  const [localMarkOverrides, setLocalMarkOverrides] = useState<Record<string, number>>({});

  // Add column modal
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnMarks, setNewColumnMarks] = useState<number>(10);
  const [addingColumn, setAddingColumn] = useState(false);
  // Tracks whether the combined classes+assessments fetch is still in-flight
  const [classesReady, setClassesReady] = useState(false);
  
  const isSchoolAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const isHOD = currentUser?.role === "HOD";
  const isTeacher = currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";
  const schoolId = currentUser?.school;
  const scopedSubjectId = selectedSubjectFilter === "all" ? undefined : Number(selectedSubjectFilter);
  const selectedSubjectName =
    selectedSubjectFilter === "all"
      ? "All Subjects"
      : String(
          subjects.find((subject) => String(subject.id) === String(selectedSubjectFilter))?.name ||
            "Subject"
        ).trim();

  // Clear URL filter when component mounts with URL params
  useEffect(() => {
    if (urlStudentId || urlClassId) {
      setApplyUrlFilter(true);
    }
  }, [urlStudentId, urlClassId]);

  useEffect(() => {
    if (selectedSubjectFilter !== "all") return;
    if (activeSubjectId) {
      setSelectedSubjectFilter(String(activeSubjectId));
    }
  }, [activeSubjectId, selectedSubjectFilter]);

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
    if (!schoolId) return;
    if (subjectContextLoading) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setClassesReady(false);
        setError(null);

        let response: AssignedClass[] = [];

        if (scopedSubjectId) {
          const [schoolYears, subjectClassRows] = await Promise.all([
            fetchYearsBySchool(schoolId),
            fetchSubjectClasses({ subject_id: scopedSubjectId }),
          ]);

          const yearMap = new Map(
            (Array.isArray(schoolYears) ? schoolYears : []).map((year: any) => [
              Number(year?.id),
              year,
            ])
          );

          const normalizedRows = await Promise.all(
            (Array.isArray(subjectClassRows) ? subjectClassRows : []).map(async (row: any) => {
              const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
                row,
                Number(scopedSubjectId)
              );
              const resolvedClassId = Number(linkedClassId || row?.class_id || row?.base_class_id || row?.id || 0);
              const resolvedYearId = Number(
                row?.year_id ?? row?.class?.year_id ?? row?.classes?.year_id ?? row?.base_class?.year_id ?? 0
              );
              const year = yearMap.get(resolvedYearId);

              return {
                id: Number(row?.id ?? resolvedClassId),
                class_id: resolvedClassId,
                teacher_id: Number(row?.teacher_id ?? 0),
                subject: selectedSubjectName,
                classes: {
                  id: resolvedClassId,
                  year_id: resolvedYearId,
                  class_name: String(
                    row?.base_class_label ??
                      row?.class?.class_name ??
                      row?.classes?.class_name ??
                      row?.base_class?.class_name ??
                      row?.name ??
                      `Class ${row?.id ?? ""}`
                  ),
                  number_of_terms: String(row?.number_of_terms ?? row?.class?.number_of_terms ?? ""),
                  year: {
                    id: resolvedYearId,
                    school_id: Number(year?.school_id ?? schoolId ?? 0),
                    name: String(year?.name ?? ""),
                  },
                  school_id: Number(row?.school_id ?? schoolId ?? 0),
                  term: Array.isArray(row?.term) ? row.term : [],
                },
              };
            })
          );

          response = Array.from(
            new Map(
              normalizedRows
                .filter((item) => Number.isFinite(item?.classes?.id) && Number(item.classes.id) > 0)
                .map((item) => [String(item.classes.id), item])
            ).values()
          );
        } else if (isSchoolAdmin) {
          const adminData = await fetchAllYearClasses();
          response = adminData.school_classs.map((cls: any) => {
            const year = adminData.years.find((y: any) => y.id === cls.year_id);
            return {
              id: cls.id,
              subject: "",
              class_id: cls.id,
              teacher_id: 0,
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

        const [assessmentResponse, reportData] = await Promise.all([
          fetchWholeAssessmentsReport(schoolId, scopedSubjectId),
          fetchReportAssessments(schoolId, scopedSubjectId),
        ]);

        setAssignedClasses(response);
        setWholeAssesmentData(assessmentResponse);
        setAssesmentData(reportData);

        if (response?.length > 0) {
          if (urlClassId && applyUrlFilter) {
            const matchedClass = response.find(
              (item) => item.classes.id.toString() === urlClassId
            );
            if (matchedClass) {
              setSelectedClass(matchedClass.classes.id.toString());
              setSelectedYear(matchedClass.classes.year.id.toString());
            } else {
              const firstYear = response[0]?.classes?.year;
              const firstClass = response[0]?.classes;
              setSelectedYear(firstYear?.id?.toString());
              setSelectedClass(firstClass?.id?.toString());
            }
          } else {
            const firstYear = response[0]?.classes?.year;
            const firstClass = response[0]?.classes;
            setSelectedYear(firstYear?.id?.toString());
            setSelectedClass(firstClass?.id?.toString());
          }
        } else {
          setSelectedYear(null);
          setSelectedClass(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load class data");
      } finally {
        setLoading(false);
        setClassesReady(true);
      }
    };

    fetchData();
  }, [
    schoolId,
    subjectContextLoading,
    scopedSubjectId,
    selectedSubjectName,
    isSchoolAdmin,
    urlClassId,
    applyUrlFilter,
  ]);

  // assignedClasses is now already subject-filtered (narrowed in the fetch effect above)
  const effectiveAssignedClasses = assignedClasses;

  const uniqueYearIds = classesReady
    ? [...new Set(effectiveAssignedClasses.map(item => item.classes.year.id))]
    : [];
  const years = uniqueYearIds.map(id => {
    const item = effectiveAssignedClasses.find(item => item.classes.year.id === id);
    return { id: item!.classes.year.id, name: item!.classes.year.name };
  });

  const classes = effectiveAssignedClasses
    .filter(item => !selectedYear || item.classes.year.id.toString() === selectedYear)
    .map(item => ({ id: item.classes.id, name: item.classes.class_name }));

  // Assessments and whole-report data are now fetched together in the main effect above.
  // These standalone effects are removed to avoid duplicate fetches / stale overrides.

  const getCurrentClass = () => {
    return assignedClasses?.find(
      (cls) => cls.classes.id.toString() === selectedClass
    );
  };

  const currentClass = getCurrentClass();

  const transformAssessmentData = () => {
    if (!wholeAssesmentData?.length) return { students: [], taskColumns: [] };

    const filteredAssessments = wholeAssesmentData.filter((assessment) => {
      const classMatch = !selectedClass || assessment?.class_id?.toString() === selectedClass;
      const yearMatch = !selectedYear || assessment?.year_id?.toString() === selectedYear;
      return classMatch && yearMatch;
    });

    if (!filteredAssessments.length) return { students: [], taskColumns: [] };

    // Derive term from assessment name (e.g. "Year 7 - Term3 - Assessments" → "Term 3")
    const extractTerm = (name: string): string => {
      const m = String(name ?? "").match(/term\s*(\d+)/i);
      return m ? `Term ${m[1]}` : "Other";
    };

    // Build flat list of tasks across all assessments, filtered by selected term
    const allTaskColumns: { taskId: number; taskName: string; allocatedMarks: number; term: string; assessmentId: number }[] = [];
    const seenTaskIds = new Set<number>();
    filteredAssessments.forEach((assessment) => {
      const term = extractTerm(assessment.assessment_name);
      if (selectedTerm !== "all" && term !== selectedTerm) return;
      assessment.tasks.forEach((task) => {
        if (!seenTaskIds.has(task.task_id)) {
          seenTaskIds.add(task.task_id);
          allTaskColumns.push({
            taskId: task.task_id,
            taskName: task.task_name,
            allocatedMarks: Number(task.allocated_marks),
            term,
            assessmentId: assessment.assessment_id,
          });
        }
      });
    });

    const maxPossibleTotal = allTaskColumns.reduce((s, c) => s + c.allocatedMarks, 0);

    // Build student rows: one entry per student, keyed by student_id
    const studentsMap = new Map<number, { student_name: string; taskMarks: Map<number, { marks: number; allocated: number; submitted: boolean }> }>();

    filteredAssessments.forEach((assessment) => {
      const term = extractTerm(assessment.assessment_name);
      if (selectedTerm !== "all" && term !== selectedTerm) return;

      assessment.tasks.forEach((task) => {
        asArray<any>(task.submitted).forEach((submission: any) => {
          if (!studentsMap.has(submission.student_id)) {
            studentsMap.set(submission.student_id, { student_name: submission.student_name, taskMarks: new Map() });
          }
          studentsMap.get(submission.student_id)!.taskMarks.set(task.task_id, {
            marks: Number(submission.teacher_assessment_marks ?? 0),
            allocated: Number(task.allocated_marks),
            submitted: true,
          });
        });

        asArray<any>(task.not_submitted).forEach((student: any) => {
          if (!studentsMap.has(student.student_id)) {
            studentsMap.set(student.student_id, { student_name: student.student_name, taskMarks: new Map() });
          }
          if (!studentsMap.get(student.student_id)!.taskMarks.has(task.task_id)) {
            studentsMap.get(student.student_id)!.taskMarks.set(task.task_id, {
              marks: 0,
              allocated: Number(task.allocated_marks),
              submitted: false,
            });
          }
        });
      });
    });

    const students = Array.from(studentsMap.entries()).map(([studentId, studentData]) => {
      let total = 0;
      const taskMarks: Record<number, { marks: number; allocated: number; submitted: boolean }> = {};

      allTaskColumns.forEach((col) => {
        const mark = studentData.taskMarks.get(col.taskId);
        if (mark) {
          taskMarks[col.taskId] = mark;
          if (mark.submitted) total += mark.marks;
        }
      });

      const percentage = maxPossibleTotal > 0 ? (total / maxPossibleTotal) * 100 : 0;
      const courseGrade = grades?.find(
        (g) => percentage >= parseInt(g.min_percentage) && percentage <= parseInt(g.max_percentage)
      )?.grade ?? "N/A";

      return {
        student_id: studentId,
        student: studentData.student_name,
        taskMarks,
        total,
        maxPossibleTotal,
        percentage: percentage.toFixed(2),
        courseGrade,
      };
    }).sort((a, b) => a.student.localeCompare(b.student));

    return { students, taskColumns: allTaskColumns };
  };

  const { students: transformedData, taskColumns } = transformAssessmentData();

  // Available terms from filtered assessments
  const availableTerms = (() => {
    const extractTerm = (name: string): string => {
      const m = String(name ?? "").match(/term\s*(\d+)/i);
      return m ? `Term ${m[1]}` : "Other";
    };
    const classYearAssessments = wholeAssesmentData.filter((assessment) => {
      const classMatch = !selectedClass || assessment?.class_id?.toString() === selectedClass;
      const yearMatch = !selectedYear || assessment?.year_id?.toString() === selectedYear;
      return classMatch && yearMatch;
    });
    const terms = Array.from(new Set(classYearAssessments.map((a) => extractTerm(a.assessment_name))));
    return terms.sort();
  })();

  // Filter by search term AND URL student ID (only if applyUrlFilter is true)
  const filteredData = transformedData?.filter((student) => {
    const matchesSearch = student?.student?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const studentScopeMatch = !isStudent || String(student?.student_id) === String(currentUser?.student);
    
    // Only filter by URL student ID if we're still applying the URL filter
    if (urlStudentId && applyUrlFilter) {
      return student?.student_id?.toString() === urlStudentId && matchesSearch && studentScopeMatch;
    }
    
    return matchesSearch && studentScopeMatch;
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

  // ── Inline mark editing helpers ─────────────────────────────────────────
  const extractTermHelper = (name: string) => {
    const m = String(name ?? "").match(/term\s*(\d+)/i);
    return m ? `Term ${m[1]}` : "Other";
  };

  const canEdit = isTeacher || isSchoolAdmin || isHOD;

  const getEffectiveMark = (
    studentId: number,
    taskId: number,
    mark: { marks: number; allocated: number; submitted: boolean } | undefined
  ) => {
    const key = `${studentId}_${taskId}`;
    if (localMarkOverrides[key] !== undefined) {
      return { marks: localMarkOverrides[key], submitted: true };
    }
    return mark;
  };

  const startEditing = (studentId: number, taskId: number, currentMark: number | null) => {
    if (!canEdit) return;
    setEditingCell({ studentId, taskId });
    setEditingValue(currentMark !== null ? String(currentMark) : "");
  };

  const commitEdit = async (
    studentId: number,
    col: { taskId: number; assessmentId: number; allocatedMarks: number }
  ) => {
    const valStr = editingValue.trim();
    setEditingCell(null);
    if (valStr === "") return;
    const val = Number(valStr);
    if (isNaN(val) || val < 0 || val > col.allocatedMarks) return;

    setSavingCell({ studentId, taskId: col.taskId });
    try {
      await addStudentTaskMarks(studentId, {
        assessment_id: col.assessmentId,
        task_id: col.taskId,
        teacher_assessment_marks: val,
        teacher_assessment_feedback: "",
      });
      setLocalMarkOverrides((prev) => ({ ...prev, [`${studentId}_${col.taskId}`]: val }));
    } catch {
      /* silently fail */
    } finally {
      setSavingCell(null);
    }
  };

  // ── Add Column ────────────────────────────────────────────────────────────
  const handleAddColumn = async () => {
    if (!newColumnName.trim() || !newColumnMarks) return;
    const targetAssessment =
      filteredAssessments.find((a) =>
        selectedTerm === "all" || extractTermHelper(a.assessment_name) === selectedTerm
      ) ?? filteredAssessments[0];

    if (!targetAssessment) return;
    setAddingColumn(true);
    try {
      const fd = new FormData();
      fd.append("assessment_id", String(targetAssessment.assessment_id));
      fd.append("task_name", newColumnName.trim());
      fd.append("description", "");
      fd.append("due_date", new Date().toISOString().split("T")[0]);
      fd.append("allocated_marks", String(newColumnMarks));
      fd.append("task_type", "null");
      await addTask(fd);
      const updated = await fetchWholeAssessmentsReport(schoolId, scopedSubjectId);
      setWholeAssesmentData(updated);
      setShowAddColumnModal(false);
      setNewColumnName("");
      setNewColumnMarks(10);
    } finally {
      setAddingColumn(false);
    }
  };

  if (loading || subjectContextLoading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 lg:p-12 mx-auto bg-white min-h-screen">

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
        <h3 className="font-medium min-w-[120px]">Markbook:</h3>
        <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-600">
          {assesmentData?.map((item: any, index: number) => (
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
            <p className="font-medium mb-3">Filters</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {(isSchoolAdmin || isHOD || isTeacher || isStudent) && (
                <Select
                  value={selectedSubjectFilter}
                  onChange={(value) => {
                    setSelectedSubjectFilter(value);
                    setSelectedYear(null);
                    setSelectedClass(null);
                    setSelectedTerm("all");
                  }}
                  style={{ width: 220 }}
                  placeholder="Select Subject"
                >
                  <Select.Option value="all">All Subjects</Select.Option>
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              )}

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

            {/* Term tabs */}
            {availableTerms.length > 0 && (
              <div className="flex gap-2 mb-5 border-b border-gray-200 pb-0">
                <button
                  onClick={() => setSelectedTerm("all")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    selectedTerm === "all"
                      ? "border-green-600 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All
                </button>
                {availableTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSelectedTerm(term)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      selectedTerm === term
                        ? "border-green-600 text-green-700"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">
                {canEdit ? "Click any mark cell to edit it." : ""}
              </p>
              {canEdit && filteredAssessments.length > 0 && (
                <button
                  onClick={() => setShowAddColumnModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="text-lg leading-none">+</span> Add Column
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
            <table className="max-w-full table-fixed">
              <thead className="bg-[#f0f0f0]">
                <tr>
                  <th className="w-28 px-2 border border-gray-300 py-3 text-left align-bottom text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-[#f0f0f0] z-10">
                    Student
                  </th>
                  {taskColumns.map((col) => (
                    <th
                      key={col.taskId}
                      className="w-14 px-1 py-2 border border-gray-300 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        whiteSpace: "nowrap",
                        minWidth: "3rem",
                      }}
                    >
                      {col.taskName}
                      <span className="block text-gray-400 normal-case font-normal">/{col.allocatedMarks}</span>
                    </th>
                  ))}
                  <th
                    className="w-16 px-2 py-2 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }}
                  >
                    Total
                  </th>
                  <th
                    className="w-16 px-2 py-2 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }}
                  >
                    %
                  </th>
                  <th
                    className="w-12 px-2 py-2 border border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }}
                  >
                    Grade
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((student, index) => {
                    // Compute effective total using local overrides
                    let effectiveTotal = 0;
                    taskColumns.forEach((col) => {
                      const eff = getEffectiveMark(student.student_id, col.taskId, student.taskMarks[col.taskId]);
                      if (eff?.submitted) effectiveTotal += eff.marks;
                    });
                    const maxPoss = student.maxPossibleTotal;
                    const effectivePct = maxPoss > 0 ? (effectiveTotal / maxPoss) * 100 : 0;
                    const effectiveGrade =
                      grades?.find(
                        (g) =>
                          effectivePct >= parseInt(g.min_percentage) &&
                          effectivePct <= parseInt(g.max_percentage)
                      )?.grade ?? "N/A";

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                          {student.student}
                        </td>

                        {/* Editable task mark cells */}
                        {taskColumns.map((col) => {
                          const eff = getEffectiveMark(student.student_id, col.taskId, student.taskMarks[col.taskId]);
                          const isEditing =
                            editingCell?.studentId === student.student_id &&
                            editingCell?.taskId === col.taskId;
                          const isSaving =
                            savingCell?.studentId === student.student_id &&
                            savingCell?.taskId === col.taskId;
                          const currentMark = eff?.submitted ? eff.marks : null;

                          return (
                            <td
                              key={col.taskId}
                              className={`border border-gray-300 text-sm text-center relative ${
                                canEdit ? "cursor-pointer hover:bg-yellow-50" : ""
                              } ${isEditing ? "bg-yellow-50 ring-2 ring-yellow-400 ring-inset" : ""}`}
                              style={{ minWidth: "3rem", padding: 0 }}
                              onClick={() => {
                                if (!isEditing) startEditing(student.student_id, col.taskId, currentMark);
                              }}
                            >
                              {isSaving ? (
                                <span className="flex items-center justify-center py-2">
                                  <Spin size="small" />
                                </span>
                              ) : isEditing ? (
                                <input
                                  autoFocus
                                  type="number"
                                  value={editingValue}
                                  min={0}
                                  max={col.allocatedMarks}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onBlur={() => commitEdit(student.student_id, col)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") commitEdit(student.student_id, col);
                                    if (e.key === "Escape") setEditingCell(null);
                                  }}
                                  className="w-full h-full py-2 px-1 text-center text-sm bg-yellow-50 border-0 outline-none focus:outline-none"
                                  style={{ minWidth: "3rem" }}
                                />
                              ) : (
                                <span className={`block py-2 px-1 font-medium ${currentMark === null ? "text-gray-300" : "text-gray-800"}`}>
                                  {currentMark !== null ? currentMark : "-"}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        {/* Total */}
                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm font-semibold text-center text-gray-800">
                          {effectiveTotal}/{maxPoss}
                        </td>

                        {/* Percentage */}
                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm text-center text-gray-600">
                          {effectivePct.toFixed(1)}%
                        </td>

                        {/* Grade */}
                        <td className="px-2 py-2 border border-gray-300 whitespace-nowrap text-sm font-medium text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              effectiveGrade === "A"
                                ? "bg-green-100 text-green-800"
                                : effectiveGrade === "B"
                                ? "bg-blue-100 text-blue-800"
                                : effectiveGrade === "C"
                                ? "bg-yellow-100 text-yellow-800"
                                : effectiveGrade === "D" || effectiveGrade === "E"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {effectiveGrade}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={taskColumns.length + 4}
                      className="text-center py-8 text-gray-400"
                    >
                      {selectedClass ? "No students found" : "Select a year and class to view the markbook"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Add Column Modal ────────────────────────────────────────────── */}
      {showAddColumnModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddColumnModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Column</h3>
            <p className="text-sm text-gray-500 mb-5">
              Add a new task column to the markbook for the selected class.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Column Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="e.g. T1 Qur'an - Recitation"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marks Out Of <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newColumnMarks}
                  min={1}
                  onChange={(e) => setNewColumnMarks(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {filteredAssessments.length === 0 && (
                <p className="text-xs text-red-500">
                  No assessment found for the selected class. Please select a class with an existing assessment first.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => { setShowAddColumnModal(false); setNewColumnName(""); setNewColumnMarks(10); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                disabled={addingColumn || !newColumnName.trim() || !newColumnMarks || filteredAssessments.length === 0}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addingColumn && <Spin size="small" />}
                {addingColumn ? "Adding..." : "Add Column"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
