"use client";
import { Alert, Card, Statistic, Row, Col, Button, Select, Spin } from "antd";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import { RootState } from "@/store/store";
import {
  School,
  Users,
  Activity,
  BookOpen,
  UserCog,
  GraduationCap,
  ClipboardList,
  CheckCircle,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchSchools } from "@/services/schoolApi";
import { fetchAdmins } from "@/services/adminsApi";
import { useQuery } from "@tanstack/react-query";
import {
  fetchSchoolDashboardData,
  fetchStudentDashboardData,
  searchStudentProfile,
} from "@/services/dashboardApis";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchStudents } from "@/services/studentsApi";
import { fetchSchoolLogo } from "@/services/api";
import { IMG_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchStaffSubjectAssignments, fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { shouldUseLegacyUnscopedSubjectData } from "@/lib/subjectScope";
import { filterStudentsBySubjectScope, studentMatchesSubjectScope } from "@/lib/subjectStudentScope";
import { extractSubjectIdFromPath, toSubjectScopedPath } from "@/lib/subjectRouting";
import { readSubjectClassBaseMap } from "@/lib/subjectClassResolution";
import {
  makeSubjectHintScopeKey,
  matchesSubjectStudentHint,
  readSubjectStudentHints,
} from "@/lib/subjectStudentHints";

export const dynamic = "force-dynamic";

const resolveSubjectClassYearId = (row: any): number =>
  Number(
    row?.year_id ??
      row?.class?.year_id ??
      row?.classes?.year_id ??
      row?.base_class?.year_id ??
      0
  );

const resolveSubjectClassLinkedId = (row: any): string =>
  String(
    row?.class_id ??
      row?.base_class_id ??
      row?.class?.id ??
      row?.classes?.id ??
      row?.base_class?.id ??
      ""
  ).trim();

const resolveSubjectClassLabel = (row: any): string =>
  String(
    row?.base_class_label ??
      row?.class?.class_name ??
      row?.classes?.class_name ??
      row?.base_class?.class_name ??
      row?.name ??
      ""
  ).trim();

const normalizeClassLabel = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const extractStudentSubjectClassIds = (student: Record<string, any>) =>
  [
    student?.subject_class_id,
    student?.subjectClassId,
    student?.pivot?.subject_class_id,
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

const hasAnySubjectMarkers = (student: Record<string, any>) =>
  extractStudentSubjectClassIds(student).length > 0 ||
  (Array.isArray(student?.subjects) && student.subjects.length > 0) ||
  !!student?.subject_name ||
  !!student?.subject;

const readHiddenSubjectYears = (subjectId?: number | null): Set<number> => {
  if (typeof window === "undefined") return new Set<number>();
  const id = Number(subjectId ?? 0);
  if (!Number.isFinite(id) || id <= 0) return new Set<number>();
  const key = `hidden-subject-years-s${id}`;
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return new Set<number>();
    return new Set(
      parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    );
  } catch {
    return new Set<number>();
  }
};

const readAddedSubjectYears = (subjectId?: number | null): Set<number> => {
  if (typeof window === "undefined") return new Set<number>();
  const id = Number(subjectId ?? 0);
  if (!Number.isFinite(id) || id <= 0) return new Set<number>();
  const key = `added-subject-years-s${id}`;
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return new Set<number>();
    return new Set(
      parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    );
  } catch {
    return new Set<number>();
  }
};

// Custom theme colors
const THEME_COLOR = "var(--primary)";
const THEME_COLOR_LIGHT = "var(--theme-soft)";
const THEME_COLOR_DARK = "var(--theme-dark)";
const formatSubjectDashboardName = (value?: string | null) =>
  String(value || "Subject").replace(/islamiat/gi, "Islamic").trim();
const ISLAMIC_DASHBOARD_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Green_Dome%2C_Masjid_Nabawi%2C_Madina.jpg";
const ARABIC_DASHBOARD_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Arabic_Alphabet._Ottoman_Calligraphy_%28CBL_T_490%2C_ff.1b-2a%29.jpg";

const getStudentsListLink = (options: {
  isSubjectWorkspaceMode: boolean;
  activeSubjectId?: number | null;
  activeSubjectName?: string | null;
}) => {
  if (
    options.isSubjectWorkspaceMode &&
    Number.isFinite(Number(options.activeSubjectId)) &&
    Number(options.activeSubjectId) > 0
  ) {
    return toSubjectScopedPath(
      "/dashboard/students/all",
      Number(options.activeSubjectId),
      options.activeSubjectName ?? undefined
    );
  }

  return "/dashboard/students/all-students";
};

export default function DashboardPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const {
    activeSubjectId,
    activeSubject,
    canUseSubjectContext,
    loading: subjectContextLoading,
  } = useSubjectContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSUPER_ADMIN = currentUser?.role === "SUPER_ADMIN";
  const isSCHOOL_ADMIN = currentUser?.role === "SCHOOL_ADMIN";
  const isTEACHER = currentUser?.role === "TEACHER";
  const isHOD = currentUser?.role === "HOD";
  const schoolId = Number(
    (currentUser as { school?: number | string; school_id?: number | string } | null)?.school ??
      (currentUser as { school?: number | string; school_id?: number | string } | null)?.school_id ??
      0
  );
  const isLegacySubjectView =
    canUseSubjectContext &&
    !!activeSubjectId &&
    shouldUseLegacyUnscopedSubjectData(activeSubjectId);
  const isSubjectWorkspaceMode =
    canUseSubjectContext && !!activeSubjectId && !isLegacySubjectView;
  const pathSubjectId = extractSubjectIdFromPath(pathname);
  const querySubjectId = Number(searchParams.get("subject_id") ?? 0);
  const hasRequestedSubjectContext =
    Number.isFinite(Number(pathSubjectId)) && Number(pathSubjectId) > 0
      ? true
      : Number.isFinite(querySubjectId) && querySubjectId > 0;
  const router = useRouter();
  const studentsListLink = getStudentsListLink({
    isSubjectWorkspaceMode,
    activeSubjectId,
    activeSubjectName: activeSubject?.name,
  });
  const role = String(currentUser?.role || "").trim().toUpperCase();
  const shouldUseSubjectCardsEntry =
    canUseSubjectContext &&
    pathname === "/dashboard" &&
    ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER", "STUDENT"].includes(role);

  useEffect(() => {
    if (!shouldUseSubjectCardsEntry) return;

    router.replace("/dashboard/subject-cards");

    if (typeof window === "undefined") return;
    const fallbackRedirect = window.setTimeout(() => {
      window.location.replace("/dashboard/subject-cards");
    }, 1200);

    return () => window.clearTimeout(fallbackRedirect);
  }, [shouldUseSubjectCardsEntry, router]);

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleSearch = async (value: string) => {
    if (!value) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      const response = await searchStudentProfile(value);
      console.log("Student search response:", response);
      setStudents(response.data || []);
    } catch (error) {
      console.error("Search student error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    const student = students.find((s) => s.id.toString() === value);

    if (!student) return;

    // Navigate with both student ID and class ID
    router.push(`/dashboard/students/reports?studentId=${student.id}&classId=${student.class_id}`);
  };

  const handleChange = (value: string | null) => {
    setSelectedStudent(value);
    
    // Clear students when selection is cleared
    if (!value) {
      setStudents([]);
    }
  };

  const {
    data: superAdmins = [],
    isLoading: adminsLoading,
    error: adminsError,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
    enabled: isSUPER_ADMIN,
    retry: false,
  });

  const {
    data: schools = [],
    isLoading: schoolsLoading,
    error: schoolsError,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
    enabled: isSUPER_ADMIN,
    retry: false,
  });

  const {
    data: schoolLogoData,
    isLoading: logoLoading,
    error: logoError,
  } = useQuery({
    queryKey: ["school-logo"],
    queryFn: fetchSchoolLogo,
    enabled: isSCHOOL_ADMIN,
    retry: false,
  });
  const schoolLogo = schoolLogoData?.logo;

  const {
    data: schoolDashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ["schoolDashboard"],
    queryFn: fetchSchoolDashboardData,
  });

  const {
    data: subjectScopedOverview,
    isLoading: subjectScopedOverviewLoading,
    error: subjectScopedOverviewError,
  } = useQuery({
    queryKey: ["subject-scoped-overview", activeSubjectId, schoolId, currentUser?.role],
    queryFn: async () => {
      if (!activeSubjectId) return null;

      const [staffAssignments, subjectClasses] = await Promise.all([
        fetchStaffSubjectAssignments(),
        fetchSubjectClasses({ subject_id: Number(activeSubjectId) }),
      ]);

      const scopedStaff = (Array.isArray(staffAssignments) ? staffAssignments : []).filter(
        (item: any) =>
          Number(item?.subject_id) === Number(activeSubjectId) &&
          Number(item?.user_id ?? item?.teacher_id) > 0
      );
      const teacherCount = new Set(
        scopedStaff
          .map((item: any) => Number(item?.user_id ?? item?.teacher_id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      ).size;
      const hodCount = new Set(
        scopedStaff
          .filter((item: any) => String(item?.role_scope || "").toUpperCase() === "HOD")
          .map((item: any) => Number(item?.user_id ?? item?.teacher_id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      ).size;
      const scopedClasses = (Array.isArray(subjectClasses) ? subjectClasses : []).filter((row: any) => {
        const parsedYearId = resolveSubjectClassYearId(row);
        return Number.isFinite(parsedYearId) && parsedYearId > 0;
      });

      const classCount = scopedClasses.length;
      const yearsFromClasses = scopedClasses
        .map((row: any) => resolveSubjectClassYearId(row))
        .filter((value) => Number.isFinite(value) && value > 0);
      const yearCount = new Set(yearsFromClasses).size;

      const scopedStudentIds = new Set<number>();
      const baseClassesByYear = new Map<number, any[]>();
      const getBaseClassesForYear = async (yearId: number) => {
        if (baseClassesByYear.has(yearId)) {
          return baseClassesByYear.get(yearId) as any[];
        }
        try {
          const rows = await fetchClasses(String(yearId));
          const list = Array.isArray(rows) ? rows : [];
          baseClassesByYear.set(yearId, list);
          return list;
        } catch {
          baseClassesByYear.set(yearId, []);
          return [];
        }
      };

      await Promise.all(
        scopedClasses.map(async (row: any) => {
          const storedBaseId = readSubjectClassBaseMap(Number(activeSubjectId))[String(row?.id ?? "").trim()] ?? "";
          let linkedClassId = resolveSubjectClassLinkedId(row) || storedBaseId;
          const subjectClassId = String(row?.id ?? "").trim();

          if (!linkedClassId) {
            const resolvedYearId = resolveSubjectClassYearId(row);
            const subjectLabel = normalizeClassLabel(resolveSubjectClassLabel(row));
            if (resolvedYearId > 0 && subjectLabel) {
              const baseRows = await getBaseClassesForYear(resolvedYearId);
              const matchedBaseClass = (Array.isArray(baseRows) ? baseRows : []).find(
                (baseRow: any) =>
                  normalizeClassLabel(baseRow?.class_name ?? baseRow?.name) === subjectLabel
              );
              linkedClassId = String(matchedBaseClass?.id ?? "").trim();
            }
          }

          if (!linkedClassId || !subjectClassId) return;

          try {
            const students = await fetchStudents(linkedClassId, Number(activeSubjectId));
            const studentRows = Array.isArray(students) ? students : [];
            const inScopeRows = filterStudentsBySubjectScope(
              studentRows,
              {
                subjectId: Number(activeSubjectId),
                subjectName: activeSubject?.name,
                subjectClassId,
              }
            );

            const hintScopeKey = makeSubjectHintScopeKey(Number(activeSubjectId), subjectClassId);
            const hintBucket = readSubjectStudentHints(hintScopeKey);
            const hintedRows = studentRows.filter((student: any) => {
              if (
                studentMatchesSubjectScope(student, {
                  subjectId: Number(activeSubjectId),
                  subjectName: activeSubject?.name,
                  subjectClassId,
                })
              ) {
                return false;
              }

              const scopedIds = extractStudentSubjectClassIds(student);
              if (scopedIds.length > 0) return false;
              return matchesSubjectStudentHint(student, hintBucket);
            });

            const combinedRows = [...inScopeRows, ...hintedRows];

            const safeFallbackRows =
              combinedRows.length === 0 &&
              studentRows.length > 0 &&
              !studentRows.some((student: any) => hasAnySubjectMarkers(student))
                ? studentRows
                : [];

            [...combinedRows, ...safeFallbackRows].forEach((student: any) => {
              const id = Number(student?.id);
              if (Number.isFinite(id) && id > 0) {
                scopedStudentIds.add(id);
              }
            });
          } catch {
            // Ignore per-class failures and continue aggregate count.
          }
        })
      );

      const studentCount = scopedStudentIds.size;

      return {
        yearCount,
        classCount,
        teacherCount,
        hodCount,
        studentCount,
      };
    },
    enabled:
      !!activeSubjectId &&
      !subjectContextLoading &&
      isSubjectWorkspaceMode &&
      schoolId > 0 &&
      (currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "HOD" || currentUser?.role === "TEACHER"),
    retry: false,
  });

  const { data: teacherDerivedCounts } = useQuery({
    queryKey: ["teacher-dashboard-counts", currentUser?.id],
    queryFn: async () => {
      if (currentUser?.role !== "TEACHER") return null;
      const assignYears = (await fetchAssignYears()) ?? [];
      const assignedClasses = (assignYears ?? []).flatMap((item: any) => {
        const classesValue = item?.classes;
        if (Array.isArray(classesValue)) return classesValue;
        if (classesValue) return [classesValue];
        return [];
      });

      const uniqueClassIds = Array.from(
        new Set(
          assignedClasses
            .map((cls: any) => String(cls?.id ?? cls?.class_id ?? cls?.classId ?? ""))
            .filter(Boolean)
        )
      );

      const studentCounts = await Promise.all(
        uniqueClassIds.map(async (classId) => {
          try {
            const students = (await fetchStudents(classId)) ?? [];
            return Array.isArray(students) ? students.length : 0;
          } catch {
            return 0;
          }
        })
      );

      return {
        classCount: uniqueClassIds.length,
        studentCount: studentCounts.reduce((sum, count) => sum + count, 0),
      };
    },
    enabled: currentUser?.role === "TEACHER",
  });
  
  const {
    data: studentDashboard,
    isLoading: studentdashboardLoading,
    error: studentdashboardError,
  } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchStudentDashboardData,
    enabled: currentUser?.role === "STUDENT",
  });

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  const studentYearName = currentUser?.studentYearName;
  const studentClassName = currentUser?.studentClassName;

  const studentActiveAssessments = useMemo(() => {
    const terms = studentDashboard?.data?.class?.term;
    if (!Array.isArray(terms)) return [];

    const now = Date.now();

    const parseDueTimestamp = (dueDate: unknown): number | null => {
      if (!dueDate) return null;
      const raw = String(dueDate).trim();
      if (!raw) return null;

      // Date-only values are treated as end-of-day local time so tasks remain visible during the due date.
      const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
      const parsed = dateOnly ? Date.parse(`${raw}T23:59:59`) : Date.parse(raw);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const activeTasks = terms
      .flatMap((term: any) =>
        (term?.assign_assessments ?? [])
          .filter((a: any) => String(a?.status ?? "").toLowerCase() === "assigned")
          .flatMap((assigned: any) =>
            (assigned?.assessment?.tasks ?? []).map((task: any) => ({
              ...task,
              termName: term?.name ?? "Term",
              assessmentName: assigned?.assessment?.name ?? "Assessment",
              assessmentId: assigned?.assessment?.id ?? assigned?.assessment_id ?? null,
              dueTs: parseDueTimestamp(task?.due_date),
            }))
          )
      )
      .filter((task: any) => task?.dueTs === null || task.dueTs >= now)
      .sort((a: any, b: any) => {
        if (a.dueTs === null && b.dueTs === null) return 0;
        if (a.dueTs === null) return 1;
        if (b.dueTs === null) return -1;
        return a.dueTs - b.dueTs;
      });

    const grouped = new Map<string, any>();
    activeTasks.forEach((task: any) => {
      const key = String(task.assessmentId ?? "");
      if (!key) return;

      if (!grouped.has(key)) {
        grouped.set(key, {
          assessmentId: task.assessmentId,
          assessmentName: task.assessmentName,
          termName: task.termName,
          dueTs: task.dueTs,
          dueDate: task.due_date || null,
          updatedAt: task.updated_at || null,
          taskCount: 1,
        });
        return;
      }

      const current = grouped.get(key);
      const nextDue =
        current.dueTs === null
          ? task.dueTs
          : task.dueTs === null
          ? current.dueTs
          : Math.min(current.dueTs, task.dueTs);

      const nextDueDate = nextDue === task.dueTs ? (task.due_date || current.dueDate) : current.dueDate;
      const nextUpdated = [current.updatedAt, task.updated_at]
        .filter(Boolean)
        .sort((a: string, b: string) => Date.parse(b) - Date.parse(a))[0] || null;

      grouped.set(key, {
        ...current,
        dueTs: nextDue ?? null,
        dueDate: nextDueDate,
        updatedAt: nextUpdated,
        taskCount: Number(current.taskCount || 0) + 1,
      });
    });

    return Array.from(grouped.values()).sort((a: any, b: any) => {
      if (a.dueTs === null && b.dueTs === null) return 0;
      if (a.dueTs === null) return 1;
      if (b.dueTs === null) return -1;
      return a.dueTs - b.dueTs;
    });
  }, [studentDashboard]);

  // Redirect to subject-cards — show a clean loading state, no dashboard flash
  if (shouldUseSubjectCardsEntry) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Role-based data
  const getDashboardData = () => {
    switch (currentUser?.role) {
      case "SUPER_ADMIN":
        return {
          stats: [
            { title: "Total Schools", value: schools?.length || 0,  link: "/dashboard/schools", },
            { title: "Total Admins", value: superAdmins?.length || 0,  link: "/dashboard/admins", },
          ],
          barChartData: [
            // { name: "School A", admins: 3 },
            // { name: "School B", admins: 2 },
            // { name: "School C", admins: 4 },
            // { name: "School D", admins: 1 },
            // { name: "School E", admins: 2 },
          ],
          pieChartData: [
            // { name: "Active Schools", value: 14 },
            // { name: "Inactive Schools", value: 1 },
          ],
          barChartKey: "admins",
          pieChartTitle: "School Status",
          barChartTitle: "Admins per School",
        };
      case "SCHOOL_ADMIN":
        if (isSubjectWorkspaceMode) {
          return {
            stats: [
              {
                title: "Total Years",
                value: subjectScopedOverview?.yearCount || 0,
                link: "/dashboard/years",
              },
              {
                title: "Total Classes",
                value: subjectScopedOverview?.classCount || 0,
                link: "/dashboard/classes",
              },
              {
                title: "Total Teachers",
                value: subjectScopedOverview?.teacherCount || 0,
                link: "/dashboard/teachers",
              },
              {
                title: "Total Students",
                value: subjectScopedOverview?.studentCount || 0,
                link: studentsListLink,
              },
            ],
            barChartData: [],
            pieChartData: [],
            barChartKey: "students",
            pieChartTitle: "Teacher Status",
            barChartTitle: "Students per Grade",
          };
        }
        return {
          stats: [
            {
              title: "Total Years",
              value: schoolDashboard?.school?.years_count || 0,
              link: "/dashboard/years"
            },
            {
              title: "Total Classes",
              value: schoolDashboard?.school?.school_classs_count || 0,
              link: "/dashboard/classes"
            },
            {
              title: "Total Teachers",
              value: schoolDashboard?.school?.teachers_count || 0,
              link: "/dashboard/teachers"
            },
            {
              title: "Total Students",
              value: schoolDashboard?.school?.students_count || 0,
              link: "/dashboard/students/all-students",
            },
          ],
          barChartData: [
            // { name: "Grade 1", students: 120 },
            // { name: "Grade 2", students: 115 },
            // { name: "Grade 3", students: 105 },
            // { name: "Grade 4", students: 95 },
            // { name: "Grade 5", students: 90 },
          ],
          pieChartData: [
            // { name: "Active Teachers", value: 42 },
            // { name: "Inactive Teachers", value: 3 },
          ],
          barChartKey: "students",
          pieChartTitle: "Teacher Status",
          barChartTitle: "Students per Grade",
        };
      case "TEACHER":
        if (isSubjectWorkspaceMode) {
          return {
            stats: [
              {
                title: "Total Classes",
                value: subjectScopedOverview?.classCount || 0,
                link: "/dashboard/classes",
              },
              {
                title: "Total Teachers",
                value: subjectScopedOverview?.teacherCount || 0,
                link: "/dashboard/teachers",
              },
              {
                title: "Total Students",
                value: subjectScopedOverview?.studentCount || 0,
                link: studentsListLink,
              },
            ],
            barChartData: [],
            pieChartData: [],
            barChartKey: "students",
            pieChartTitle: "Assignment Status",
            barChartTitle: "Students per Class",
          };
        }
        return {
          stats: [
            {
              title: "Total Classes",
              value:
                teacherDerivedCounts?.classCount ??
                schoolDashboard?.assigned_class_count ??
                0,
              link: "/dashboard/classes"
            },
            {
              title: "Total Students",
              value:
                teacherDerivedCounts?.studentCount ??
                schoolDashboard?.assigned_students_count ??
                0,
              link: "/dashboard/students/all-students",
            },
          ],
          barChartData: [
            // { name: "Class A", students: 30 },
            // { name: "Class B", students: 28 },
            // { name: "Class C", students: 32 },
            // { name: "Class D", students: 30 },
          ],
          pieChartData: [
            // { name: "Submitted Assignments", value: 85 },
            // { name: "Pending Assignments", value: 15 },
          ],
          barChartKey: "students",
          pieChartTitle: "Assignment Status",
          barChartTitle: "Students per Class",
        };
      case "HOD":
        if (isSubjectWorkspaceMode) {
          return {
            stats: [
              {
                title: "Total Years",
                value: subjectScopedOverview?.yearCount || 0,
                link: "/dashboard/years",
              },
              {
                title: "Total Classes",
                value: subjectScopedOverview?.classCount || 0,
                link: "/dashboard/classes",
              },
              {
                title: "Total Teachers",
                value: subjectScopedOverview?.teacherCount || 0,
                link: "/dashboard/teachers",
              },
              {
                title: "Total Students",
                value: subjectScopedOverview?.studentCount || 0,
                link: studentsListLink,
              },
            ],
            barChartData: [],
            pieChartData: [],
            barChartKey: "students",
            pieChartTitle: "Assignment Status",
            barChartTitle: "Students per Class",
          };
        }
        return {
          stats: [
            {
              title: "Total Years",
              value: schoolDashboard?.school?.years_count || 0,
              link: "/dashboard/years"
            },
            {
              title: "Total Classes",
              value: schoolDashboard?.school?.school_classs_count || 0,
              link: "/dashboard/classes"
            },
            {
              title: "Total Teachers",
              value: schoolDashboard?.school?.teachers_count || 0,
               link: "/dashboard/teachers"
            },
            {
              title: "Total Students",
              value: schoolDashboard?.school?.students_count || 0,
              link: "/dashboard/students/all-students",
            },
          ],
          barChartData: [
            // { name: "Class A", students: 30 },
            // { name: "Class B", students: 28 },
            // { name: "Class C", students: 32 },
            // { name: "Class D", students: 30 },
          ],
          pieChartData: [
            // { name: "Submitted Assignments", value: 85 },
            // { name: "Pending Assignments", value: 15 },
          ],
          barChartKey: "students",
          pieChartTitle: "Assignment Status",
          barChartTitle: "Students per Class",
        };
      case "STUDENT":
        return {
          stats: [
            { title: "My Classes", value: 6 },
            // { title: "Active Assignments", value: 3 },
            // { title: "Completed Assignments", value: 24 },
          ],
          barChartData: [
            // { name: "Math", score: 85 },
            // { name: "Science", score: 78 },
            // { name: "English", score: 92 },
            // { name: "History", score: 88 },
          ],
          pieChartData: [
            // { name: "Completed Assignments", value: 24 },
            // { name: "Pending Assignments", value: 3 },
          ],
          barChartKey: "score",
          pieChartTitle: "Assignments Progress",
          barChartTitle: "Subject Scores",
        };
      default:
        return {
          stats: [],
          barChartData: [],
          pieChartData: [],
          barChartKey: "",
          pieChartTitle: "",
          barChartTitle: "",
        };
    }
  };

  const statIcons = {
    SUPER_ADMIN: {
      "Total Schools": (
        <School className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Admins": (
        <UserCog className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Active Schools": (
        <Activity className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    SCHOOL_ADMIN: {
      "Total Years": (
        <LayoutDashboard className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Classes": (
        <LayoutDashboard className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Teachers": (
        <Users className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Students": (
        <GraduationCap className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    TEACHER: {
      "My Classes": (
        <BookOpen className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Students": (
        <GraduationCap className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Pending Assignments": (
        <ClipboardList className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    HOD: {
      "Total Years": (
        <LayoutDashboard className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "My Classes": (
        <BookOpen className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Students": (
        <GraduationCap className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Pending Assignments": (
        <ClipboardList className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    STUDENT: {
      "My Classes": (
        <BookOpen className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Active Assignments": (
        <ClipboardList className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Completed Assignments": (
        <CheckCircle className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
  };

  const {
    stats,
    barChartData,
    pieChartData,
    barChartKey,
    pieChartTitle,
    barChartTitle,
  } = getDashboardData();

  const COLORS = [
    THEME_COLOR,
    "color-mix(in srgb, var(--primary) 75%, white)",
    "color-mix(in srgb, var(--primary) 55%, white)",
    "color-mix(in srgb, var(--primary) 35%, black)",
    THEME_COLOR_DARK,
  ];

  if (shouldUseSubjectCardsEntry) {
    return (
      <div className="p-3 md:p-6 flex flex-col justify-center items-center h-64 gap-4">
        <Spin size="large" />
        <Button type="default" onClick={() => window.location.replace("/dashboard/subject-cards")}>
          Open Subject Cards
        </Button>
      </div>
    );
  }

  if (canUseSubjectContext && hasRequestedSubjectContext && subjectContextLoading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="premium-page p-3 md:p-6 space-y-6 min-h-screen !font-[Raleway]">
      {isSubjectWorkspaceMode && subjectScopedOverviewError && (
        <Alert
          type="warning"
          showIcon
          message={`Subject workspace data is not isolated yet for ${activeSubject?.name || "this subject"}.`}
          description="Backend subject-scoped dashboard endpoints are required for full separation."
        />
      )}
      <Card
        className="premium-hero border-0 !mb-6"
        style={{
          background: `linear-gradient(to right, ${THEME_COLOR_LIGHT}, white)`,
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                {isSubjectWorkspaceMode
                  ? `${formatSubjectDashboardName(activeSubject?.name)} Dashboard`
                  : `Welcome, ${String(currentUser?.name || "User").replace(/_/g, " ")}!`}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                {isSubjectWorkspaceMode
                  ? `Welcome, ${String(currentUser?.name || "User").replace(/_/g, " ")} - ${formatSubjectDashboardName(activeSubject?.name)}!`
                  : "We're glad to have you back!"}
              </p>
              <p className="text-gray-500 mb-4">
                {isSubjectWorkspaceMode
                  ? `View the latest information for ${formatSubjectDashboardName(activeSubject?.name)}.`
                  : "Let's get started. Explore your dashboard to manage your activities."}
              </p>
            </div>
            {currentUser?.role !== "SUPER_ADMIN" && schoolLogo ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={`${IMG_BASE_URL}/storage/${schoolLogo}`}
                  alt="School Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              isSubjectWorkspaceMode &&
              /islam|islamiat|islamic/i.test(String(activeSubject?.name || "")) ? (
                <div className="hidden md:block h-32 w-32 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm">
                  <img
                    src={ISLAMIC_DASHBOARD_IMAGE}
                    alt="Al-Masjid an-Nabawi"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : isSubjectWorkspaceMode &&
                /arabic|arab/i.test(String(activeSubject?.name || "")) ? (
                <div className="hidden md:block h-32 w-32 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm">
                  <img
                    src={ARABIC_DASHBOARD_IMAGE}
                    alt="Arabic alphabet calligraphy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="hidden md:block p-3 rounded-lg"
                  style={{ backgroundColor: THEME_COLOR_LIGHT }}
                >
                  <svg
                    className="w-16 h-16"
                    style={{ color: THEME_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              )
            )}
          </div>
        </div>
      </Card>

       {(isTEACHER || isHOD || isSCHOOL_ADMIN) &&(
        <>
          <Select
            showSearch
            placeholder="Search student"
            value={selectedStudent}
            onChange={handleChange}
            onSearch={handleSearch}
            onSelect={handleSelect}
            filterOption={false}
            notFoundContent={loading ? <Spin size="small" /> : null}
            options={students.map((student) => ({
              value: student.id.toString(),
              label: student.student_name || "",
            }))}
            style={{ width: 320 }}
            allowClear
            className="!mb-2"
          />
        </>
      )}

      {currentUser?.role === "STUDENT" ? (
        <div className="space-y-6">
          {/* Enhanced Breadcrumb */}
          <div className="flex items-center text-sm font-medium capitalize text-gray-600">
            <span className="font-semibold" style={{ color: THEME_COLOR }}>
              {studentYearName || "Year"}
            </span>
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-800">{studentClassName || "Class"}</span>
          </div>

          {/* Cards Grid */}
          <Row gutter={[16, 16]}>
            {studentActiveAssessments.length > 0 ? (
              studentActiveAssessments.map((assessment: any, index: number) => (
                <Col xs={24} md={24} key={`${assessment.assessmentId ?? index}`}>
                  <Link
                    href={
                      assessment.assessmentId
                        ? `/dashboard/students/assignments/${assessment.assessmentId}`
                        : "/dashboard/students/assignments"
                    }
                  >
                    <Card
                      hoverable
                      className="border-0 shadow-sm hover:shadow-md transition-all h-full"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {assessment.assessmentName || "Assessment"}
                          </h3>
                          {assessment.dueDate ? (
                            <p className="text-sm text-gray-500">
                              Due: {new Date(assessment.dueDate).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">No due date</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="inline-block rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700">
                          Assignment
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between items-end">
                        <div>
                          <p className="text-base font-medium text-gray-700">
                            {assessment.termName}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {assessment.taskCount} task{assessment.taskCount === 1 ? "" : "s"}
                          </p>
                          {assessment.updatedAt ? (
                            <p className="text-xs text-gray-400 mt-1">
                              Updated {timeAgo(assessment.updatedAt)}
                            </p>
                          ) : null}
                        </div>
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: THEME_COLOR,
                            borderColor: THEME_COLOR,
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card className="border-0 shadow-sm">
                  <p className="text-sm text-gray-600">No active tasks available right now.</p>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      ) : (
        <>
          {isSubjectWorkspaceMode && subjectScopedOverviewLoading ? (
            <div className="p-3 md:p-6 flex justify-center items-center h-40">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <Row gutter={[16, 16]}>
                {stats.map((stat, index) => {
                  const icon = currentUser?.role
                    ? (statIcons[currentUser?.role] as Record<string, JSX.Element>)[
                        stat.title
                      ]
                    : null;

                  return (
                    <Col
                      key={index}
                      xs={24}
                      md={
                        currentUser?.role === "SCHOOL_ADMIN" ||
                        currentUser?.role === "HOD"
                          ? 6
                          : 12
                      }
                    >
                    <Link href={stat?.link || "#"}>
                      <Card className="premium-card border-0 hover:shadow-md transition-all">
                        <Statistic
                          title={
                            <span className="text-[#000000] font-medium !font-['Raleway']">
                              {stat?.title}
                            </span>
                          }
                          value={stat?.value}
                          prefix={icon}
                          valueStyle={{ color: THEME_COLOR_DARK }}
                        />
                      </Card>
                    </Link>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}

          {/* Charts Section */}
          {barChartData.length > 0 && pieChartData.length > 0 && (
            <Row gutter={[16, 16]}>
              {/* Bar Chart */}
              <Col xs={24} lg={12}>
                <Card className="premium-card border-0">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {barChartTitle}
                  </h2>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#6b7280" }}
                          axisLine={{ stroke: "#d1d5db" }}
                        />
                        <YAxis
                          tick={{ fill: "#6b7280" }}
                          axisLine={{ stroke: "#d1d5db" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "0.5rem",
                            borderColor: "#e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey={barChartKey}
                          name={barChartTitle.split(" per ")[0]}
                          fill={THEME_COLOR}
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList
                            dataKey={barChartKey}
                            position="top"
                            className="text-xs fill-gray-600"
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              {/* Pie Chart */}
              <Col xs={24} lg={12}>
                <Card className="premium-card border-0">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {pieChartTitle}
                  </h2>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          paddingAngle={5}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="#fff"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [value, name]}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "0.5rem",
                            borderColor: "#e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{ paddingTop: "20px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}

    </div>
  );
}
