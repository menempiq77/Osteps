"use client";
import dynamic from "next/dynamic";
import { Alert, Card, Button, Select, Spin } from "antd";
import { useSelector } from "react-redux";
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
import { fetchTeachers } from "@/services/teacherApi";
import { fetchStudentProfileData, fetchStudents, fetchBaseClassStudents } from "@/services/studentsApi";
import { fetchAssessmentByStudent, fetchSchoolLogo } from "@/services/api";
import { fetchTrackers } from "@/services/trackersApi";
import { IMG_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchStaffSubjectAssignments, fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { shouldUseLegacyUnscopedSubjectData } from "@/lib/subjectScope";
import { filterStudentsBySubjectScope, studentMatchesSubjectScope } from "@/lib/subjectStudentScope";
import { extractSubjectIdFromPath, toSubjectScopedPath } from "@/lib/subjectRouting";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import {
  makeSubjectHintScopeKey,
  matchesSubjectStudentHint,
  readSubjectStudentHints,
} from "@/lib/subjectStudentHints";
import { fetchTerm } from "@/services/termsApi";
import { IMPERSONATION_STORAGE_KEY } from "@/features/auth/authSlice";
import ClassStoryPanel from "@/components/dashboard/ClassStoryPanel";
import { useReadOnlyWorkspace } from "@/lib/readOnlyWorkspace";

const DashboardCharts = dynamic(() => import("@/components/dashboard/DashboardCharts"), {
  ssr: false,
});

const resolveSubjectClassYearId = (row: any): number =>
  Number(
    row?.year_id ??
      row?.class?.year_id ??
      row?.classes?.year_id ??
      row?.base_class?.year_id ??
      0
  );

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

const parseDueTimestamp = (dueDate: unknown): number | null => {
  if (!dueDate) return null;
  const raw = String(dueDate).trim();
  if (!raw) return null;

  // Date-only values are treated as end-of-day local time so tasks remain visible during the due date.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const parsed = dateOnly ? Date.parse(`${raw}T23:59:59`) : Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseUpdatedTimestamp = (value: unknown): number | null => {
  if (!value) return null;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

type StatDetailItem = {
  key: string;
  title: string;
  meta?: string;
  badge?: string;
  href?: string;
  classId?: string;
  subjectClassId?: string;
  yearLabel?: string;
  classLabel?: string;
  subjectLabel?: string;
  gender?: string;
  userName?: string;
};

type StudentInlineFilters = {
  year: string;
  class: string;
  subject: string;
  gender: string;
};

const EMPTY_STUDENT_INLINE_FILTERS: StudentInlineFilters = {
  year: "",
  class: "",
  subject: "",
  gender: "",
};

const normalizeDetailFilterValue = (value: unknown) => String(value ?? "").trim();

const STAT_DETAIL_LIMIT = 12;
const STAT_CARD_STYLES = [
  { accent: "#2563eb", soft: "#eff6ff", border: "#bfdbfe", glow: "rgba(37,99,235,0.14)" },
  { accent: "#059669", soft: "#ecfdf5", border: "#a7f3d0", glow: "rgba(5,150,105,0.14)" },
  { accent: "#7c3aed", soft: "#f5f3ff", border: "#ddd6fe", glow: "rgba(124,58,237,0.14)" },
  { accent: "#d97706", soft: "#fffbeb", border: "#fde68a", glow: "rgba(217,119,6,0.14)" },
];

const cleanDashboardLabel = (value: unknown, fallback = "Untitled") => {
  const text = String(value ?? "").replace(/_/g, " ").trim();
  return text || fallback;
};

const extractClassLabel = (row: any) =>
  cleanDashboardLabel(
    row?.class_name ??
      row?.base_class_label ??
      row?.class?.class_name ??
      row?.classes?.class_name ??
      row?.base_class?.class_name ??
      row?.name,
    "Class"
  );

const extractYearLabel = (row: any, yearNameById?: Map<string, string>) => {
  const yearId = resolveSubjectClassYearId(row);
  const mappedYearName = yearId > 0 ? yearNameById?.get(String(yearId)) : undefined;
  return cleanDashboardLabel(
    mappedYearName ??
      row?.year?.name ??
      row?.year_name ??
      row?.class?.year?.name ??
      row?.classes?.year?.name ??
      row?.base_class?.year?.name ??
      (yearId ? `Year ${yearId}` : ""),
    "Year"
  );
};

const uniqueDetailItems = (items: StatDetailItem[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.key || item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

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

const extractLiveStudentClassId = (profile: any, fallback?: number | string | null) =>
  Number(
    profile?.subject_context?.class_id ??
      profile?.subject_context?.base_class_id ??
      profile?.subject_class?.class_id ??
      profile?.subject_class?.base_class_id ??
      profile?.class_id ??
      profile?.class?.id ??
      profile?.student?.class_id ??
      profile?.student?.class?.id ??
      fallback ??
      0
  );

const extractLiveStudentClassName = (profile: any, fallback?: string | null) =>
  String(
    profile?.subject_context?.base_class_label ??
      profile?.subject_context?.subject_class_name ??
      profile?.subject_class?.base_class_label ??
      profile?.subject_class?.name ??
      profile?.class?.class_name ??
      profile?.class?.name ??
      profile?.student?.class?.class_name ??
      profile?.student?.class?.name ??
      profile?.class_name ??
      fallback ??
      ""
  ).trim();

const extractLiveStudentYearName = (profile: any, fallback?: string | null) =>
  String(
    profile?.subject_context?.year_name ??
      profile?.subject_context?.year?.name ??
      profile?.subject_class?.year_name ??
      profile?.subject_class?.year?.name ??
      profile?.class?.year?.name ??
      profile?.student?.class?.year?.name ??
      profile?.year_name ??
      fallback ??
      ""
  ).trim();

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
  const isReadOnlyArchivedWorkspace = useReadOnlyWorkspace();
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
  const requestedSubjectId = Number.isFinite(Number(pathSubjectId)) && Number(pathSubjectId) > 0
    ? Number(pathSubjectId)
    : Number.isFinite(querySubjectId) && querySubjectId > 0
      ? querySubjectId
      : null;
  const hasRequestedSubjectContext =
    requestedSubjectId !== null;
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
  const [activeStatTitle, setActiveStatTitle] = useState<string | null>(null);
  const [studentInlineFilters, setStudentInlineFilters] = useState<StudentInlineFilters>(EMPTY_STUDENT_INLINE_FILTERS);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setImpersonating(!!localStorage.getItem(IMPERSONATION_STORAGE_KEY));
  }, [pathname]);

  useEffect(() => {
    setActiveStatTitle(null);
    setStudentInlineFilters(EMPTY_STUDENT_INLINE_FILTERS);
  }, [activeSubjectId, currentUser?.role]);

  useEffect(() => {
    if (activeStatTitle !== "Total Students") {
      setStudentInlineFilters(EMPTY_STUDENT_INLINE_FILTERS);
    }
  }, [activeStatTitle]);

  const getSubjectScopedSummary = async (
    subjectId: number,
    subjectName?: string | null,
    includeInactive = false
  ): Promise<{ yearCount: number; classCount: number; studentCount: number }> => {
    const subjectClasses = await fetchSubjectClasses({
      subject_id: Number(subjectId),
      include_inactive: includeInactive || undefined,
    });
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

    await Promise.all(
      scopedClasses.map(async (row: any) => {
        const subjectClassId = String(row?.id ?? "").trim();
        const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
          row,
          Number(subjectId)
        );

        if (!subjectClassId) return;

        try {
          const requestTargets = Array.from(
            new Set(
              [linkedClassId, subjectClassId]
                .map((value) => String(value ?? "").trim())
                .filter(Boolean)
            )
          );

          let finalRows: Array<Record<string, any>> = [];

          // The subject-class enrollment is the source of truth for subject
          // dashboards. Avoid broad subject/base-class fallbacks because they
          // can count students from old archived/restored class memberships.
          for (const targetClassId of requestTargets) {
            const students = await fetchStudents(
              targetClassId,
              Number(subjectId),
              subjectClassId
            );
            const studentRows = Array.isArray(students) ? students : [];
            if (studentRows.length > 0) { finalRows = studentRows; break; }
          }

          // In the archived read-only workspace the subject-class enrollment is
          // inactive, so the subject-scoped roster returns 0. Fall back to the
          // base class roster so the archived students still show up.
          if (finalRows.length === 0 && includeInactive && linkedClassId) {
            const baseStudents = await fetchBaseClassStudents(String(linkedClassId));
            finalRows = Array.isArray(baseStudents) ? baseStudents : [];
          }

          finalRows.forEach((student: any) => {
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

    return {
      yearCount,
      classCount,
      studentCount: scopedStudentIds.size,
    };
  };

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

    // Open the student's full report (not the markbook).
    const sid = Number(activeSubjectId ?? 0);
    router.push(
      `/dashboard/reports/student/${student.id}${sid ? `?subject_id=${sid}` : ""}`
    );
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
    queryKey: [
      "subject-scoped-overview",
      currentUser?.id,
      activeSubjectId,
      schoolId,
      currentUser?.role,
      isReadOnlyArchivedWorkspace,
    ],
    queryFn: async () => {
      if (!activeSubjectId) return null;

      const [subjectSummary, staffAssignments] = await Promise.all([
        getSubjectScopedSummary(
          Number(activeSubjectId),
          activeSubject?.name,
          isReadOnlyArchivedWorkspace
        ),
        fetchStaffSubjectAssignments().catch(() => []),
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
      return {
        yearCount: subjectSummary.yearCount,
        classCount: subjectSummary.classCount,
        teacherCount,
        hodCount,
        studentCount: subjectSummary.studentCount,
      };
    },
    enabled:
      !!activeSubjectId &&
      !subjectContextLoading &&
      isSubjectWorkspaceMode &&
      (currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "HOD" || currentUser?.role === "TEACHER"),
    retry: false,
  });

  const {
    data: teacherDerivedCounts,
  } = useQuery({
    queryKey: ["teacher-dashboard-counts", currentUser?.id, activeSubjectId, activeSubject?.name],
    queryFn: async () => {
      if (currentUser?.role !== "TEACHER") return null;

      const assignYears = (await fetchAssignYears()) ?? [];

      const scopedAssignments = assignYears ?? [];

      const assignedClasses = scopedAssignments.flatMap((item: any) => {
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
    enabled: currentUser?.role === "TEACHER" && !isSubjectWorkspaceMode,
  });

  const buildScopedDashboardHref = (href: string) =>
    isSubjectWorkspaceMode && activeSubjectId
      ? toSubjectScopedPath(href, Number(activeSubjectId), activeSubject?.name)
      : href;

  const { data: activeStatDetails = [], isLoading: activeStatDetailsLoading } = useQuery({
    queryKey: [
      "dashboard-inline-stat-details",
      currentUser?.role,
      activeStatTitle,
      schoolId,
      activeSubjectId,
      activeSubject?.name,
      isSubjectWorkspaceMode,
    ],
    enabled: !!activeStatTitle && currentUser?.role !== "STUDENT",
    staleTime: 60 * 1000,
    queryFn: async (): Promise<StatDetailItem[]> => {
      const title = String(activeStatTitle || "");
      const subjectId = Number(activeSubjectId ?? 0);
      let cachedYearNameById: Map<string, string> | null = null;

      const loadYearNameById = async () => {
        if (cachedYearNameById) return cachedYearNameById;

        const yearNameById = new Map<string, string>();
        const addYear = (year: any) => {
          const id = String(year?.id ?? year?.year_id ?? year?.yearId ?? "").trim();
          const name = cleanDashboardLabel(year?.name ?? year?.year_name ?? year?.label, "");
          if (id && name) yearNameById.set(id, name);
        };

        if (schoolId > 0) {
          const schoolYears = await fetchYearsBySchool(schoolId).catch(() => []);
          (Array.isArray(schoolYears) ? schoolYears : []).forEach(addYear);
        }

        if (yearNameById.size === 0 || currentUser?.role === "TEACHER") {
          const assignedYears = await fetchAssignYears().catch(() => []);
          (Array.isArray(assignedYears) ? assignedYears : []).forEach((entry: any) => {
            addYear(entry?.year ?? entry);
            const classes = entry?.classes;
            (Array.isArray(classes) ? classes : classes ? [classes] : []).forEach((cls: any) => {
              addYear({
                id: cls?.year?.id ?? cls?.year_id,
                name: cls?.year?.name ?? cls?.year_name,
              });
            });
          });
        }

        cachedYearNameById = yearNameById;
        return yearNameById;
      };

      const loadYears = async () => {
        if (isSubjectWorkspaceMode && subjectId > 0) {
          const yearNameById = await loadYearNameById();
          const subjectClasses = await fetchSubjectClasses({ subject_id: subjectId });
          const yearMap = new Map<string, StatDetailItem>();
          (Array.isArray(subjectClasses) ? subjectClasses : []).forEach((row: any) => {
            const yearId = String(resolveSubjectClassYearId(row) || extractYearLabel(row));
            if (!yearId) return;
            const existing = yearMap.get(yearId);
            const classCount = Number(existing?.badge?.replace(/\D/g, "") || 0) + 1;
            yearMap.set(yearId, {
              key: yearId,
              title: extractYearLabel(row, yearNameById),
              meta: `Used in ${formatSubjectDashboardName(activeSubject?.name)} workspace`,
              badge: `${classCount} class${classCount === 1 ? "" : "es"}`,
              href: buildScopedDashboardHref(`/dashboard/classes?year=${yearId}`),
            });
          });
          return Array.from(yearMap.values());
        }

        const years = schoolId > 0
          ? await fetchYearsBySchool(schoolId)
          : await fetchAssignYears();
        return uniqueDetailItems(
          (Array.isArray(years) ? years : []).map((year: any, index: number) => ({
            key: String(year?.id ?? index),
            title: cleanDashboardLabel(year?.name ?? year?.year_name, `Year ${index + 1}`),
            meta: year?.description ? String(year.description) : "School year group",
            badge: Array.isArray(year?.classes) ? `${year.classes.length} classes` : undefined,
            href: year?.id ? buildScopedDashboardHref(`/dashboard/classes?year=${year.id}`) : "/dashboard/classes",
          }))
        );
      };

      const loadClasses = async () => {
        if (isSubjectWorkspaceMode && subjectId > 0) {
          const yearNameById = await loadYearNameById();
          const subjectClasses = await fetchSubjectClasses({ subject_id: subjectId });
          const rows = await Promise.all(
            (Array.isArray(subjectClasses) ? subjectClasses : []).map(async (row: any, index: number) => {
              const subjectClassId = String(row?.id ?? "").trim();
              const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(row, subjectId).catch(() => row?.class_id ?? row?.base_class_id ?? row?.id);
              return {
                key: String(subjectClassId || linkedClassId || index),
                title: extractClassLabel(row),
                meta: extractYearLabel(row, yearNameById),
                badge: formatSubjectDashboardName(activeSubject?.name),
                classId: String(linkedClassId || subjectClassId || ""),
                subjectClassId,
                href: linkedClassId
                  ? buildScopedDashboardHref(`/dashboard/students/${linkedClassId}?${new URLSearchParams({
                      yearId: String(resolveSubjectClassYearId(row) || ""),
                      subjectClassLabel: extractClassLabel(row),
                      subjectClassId,
                    }).toString()}`)
                  : buildScopedDashboardHref("/dashboard/classes"),
              };
            })
          );
          return uniqueDetailItems(rows);
        }

        if (currentUser?.role === "TEACHER") {
          const assignedYears = await fetchAssignYears();
          return uniqueDetailItems(
            (Array.isArray(assignedYears) ? assignedYears : [])
              .flatMap((entry: any) => {
                const classes = entry?.classes;
                return Array.isArray(classes) ? classes : classes ? [classes] : [];
              })
              .map((cls: any, index: number) => ({
                key: String(cls?.id ?? cls?.class_id ?? index),
                title: extractClassLabel(cls),
                meta: extractYearLabel(cls),
                badge: cls?.students_count ? `${cls.students_count} students` : undefined,
                classId: String(cls?.id ?? cls?.class_id ?? ""),
                href: cls?.id || cls?.class_id ? `/dashboard/students/${cls?.id ?? cls?.class_id}` : "/dashboard/classes",
              }))
          );
        }

        const years = schoolId > 0 ? await fetchYearsBySchool(schoolId) : [];
        const classRows = (
          await Promise.all(
            (Array.isArray(years) ? years : []).map(async (year: any) => {
              try {
                const rows = await fetchClasses(String(year?.id));
                return (Array.isArray(rows) ? rows : []).map((row: any) => ({ row, year }));
              } catch {
                return [] as Array<{ row: any; year: any }>;
              }
            })
          )
        ).flat();

        return uniqueDetailItems(
          classRows.map(({ row, year }, index) => ({
            key: String(row?.id ?? index),
            title: extractClassLabel(row),
            meta: cleanDashboardLabel(year?.name, "Year"),
            badge: row?.number_of_terms ? `${row.number_of_terms} terms` : undefined,
            classId: String(row?.id ?? ""),
            href: row?.id ? `/dashboard/students/${row.id}` : "/dashboard/classes",
          }))
        );
      };

      const loadTeachers = async () => {
        const teachers = await fetchTeachers("all");
        const teacherList = Array.isArray(teachers) ? teachers : [];

        // In a subject workspace, the /get-teacher list is NOT subject-scoped
        // (the backend returns every school teacher). Scope it to the subject's
        // actual staff via the same source the "Total Teachers" count uses
        // (user_subject_assignments), so only assigned Teachers/HODs are shown.
        if (isSubjectWorkspaceMode && subjectId > 0) {
          const assignments = await fetchStaffSubjectAssignments().catch(() => []);
          const scoped = (Array.isArray(assignments) ? assignments : []).filter(
            (item: any) => Number(item?.subject_id) === subjectId
          );
          const teacherByUserId = new Map<number, any>();
          const teacherById = new Map<number, any>();
          teacherList.forEach((teacher: any) => {
            const uid = Number(teacher?.user_id);
            const tid = Number(teacher?.id);
            if (Number.isFinite(uid) && uid > 0) teacherByUserId.set(uid, teacher);
            if (Number.isFinite(tid) && tid > 0) teacherById.set(tid, teacher);
          });

          const seen = new Set<number>();
          const items = scoped
            .map((assignment: any) => {
              const userId = Number(assignment?.user_id);
              const teacherId = Number(assignment?.teacher_id);
              const dedupeKey = Number.isFinite(userId) && userId > 0 ? userId : teacherId;
              if (!Number.isFinite(dedupeKey) || dedupeKey <= 0 || seen.has(dedupeKey)) return null;
              seen.add(dedupeKey);
              const teacher =
                (Number.isFinite(userId) && teacherByUserId.get(userId)) ||
                (Number.isFinite(teacherId) && teacherById.get(teacherId)) ||
                null;
              const linkId = teacher?.id ?? teacherId ?? userId;
              return {
                key: String(dedupeKey),
                title: cleanDashboardLabel(
                  teacher?.name ?? teacher?.teacher_name ?? assignment?.user_name,
                  "Teacher"
                ),
                meta: cleanDashboardLabel(
                  teacher?.email ?? teacher?.user?.email ?? "Teacher account",
                  "Teacher account"
                ),
                badge: assignment?.role_scope
                  ? cleanDashboardLabel(String(assignment.role_scope))
                  : teacher?.status
                    ? cleanDashboardLabel(teacher.status)
                    : undefined,
                href: linkId
                  ? `/dashboard/teachers/${linkId}/assignedClasses`
                  : "/dashboard/teachers",
              };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
          return uniqueDetailItems(items);
        }

        return uniqueDetailItems(
          teacherList.map((teacher: any, index: number) => ({
            key: String(teacher?.id ?? teacher?.user_id ?? index),
            title: cleanDashboardLabel(teacher?.name ?? teacher?.teacher_name ?? teacher?.user?.name, `Teacher ${index + 1}`),
            meta: cleanDashboardLabel(teacher?.email ?? teacher?.user?.email ?? teacher?.subject_name ?? "Teacher account", "Teacher account"),
            badge: teacher?.status ? cleanDashboardLabel(teacher.status) : undefined,
            href: teacher?.id || teacher?.user_id ? `/dashboard/teachers/${teacher?.id ?? teacher?.user_id}/assignedClasses` : "/dashboard/teachers",
          }))
        );
      };

      const loadStudents = async () => {
        const classItems = await loadClasses();
        const studentRows = (
          await Promise.all(
            classItems.map(async (item) => {
              try {
                const targetClassId = item.classId || item.key;
                const rows = await fetchStudents(
                  targetClassId,
                  isSubjectWorkspaceMode ? subjectId : undefined,
                  isSubjectWorkspaceMode ? item.subjectClassId || item.key : undefined
                );
                const rawRows = Array.isArray(rows) ? rows : [];

                if (!isSubjectWorkspaceMode) {
                  return rawRows.map((student: any) => ({ student, classItem: item }));
                }

                const subjectClassId = item.subjectClassId || item.key;
                const inScopeRows = filterStudentsBySubjectScope(rawRows, {
                  subjectId,
                  subjectName: activeSubject?.name,
                  subjectClassId,
                });
                const hintBucket = readSubjectStudentHints(
                  makeSubjectHintScopeKey(subjectId, subjectClassId)
                );
                const hintedRows = rawRows.filter((student: any) => {
                  if (
                    studentMatchesSubjectScope(student, {
                      subjectId,
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
                const scopedRows = [...inScopeRows, ...hintedRows];
                const finalRows = scopedRows.length > 0
                  ? scopedRows
                  : rawRows.some((student: any) => hasAnySubjectMarkers(student))
                    ? []
                    : rawRows;

                return finalRows.map((student: any) => ({ student, classItem: item }));
              } catch {
                return [] as Array<{ student: any; classItem: StatDetailItem }>;
              }
            })
          )
        ).flat();

        return uniqueDetailItems(
          studentRows.map(({ student, classItem }, index) => {
            const subjectNames = Array.isArray(student?.subjects)
              ? student.subjects
                  .map((subject: any) => cleanDashboardLabel(subject?.name ?? subject?.subject_name ?? subject, ""))
                  .filter(Boolean)
                  .join(", ")
              : "";
            const subjectLabel = isSubjectWorkspaceMode
              ? formatSubjectDashboardName(activeSubject?.name)
              : cleanDashboardLabel(student?.subject_name ?? student?.subject?.name ?? subjectNames, "");
            const classLabel = cleanDashboardLabel(
              student?.class?.class_name ??
                student?.class?.name ??
                student?.class_name ??
                classItem.title,
              classItem.title
            );
            const yearLabel = cleanDashboardLabel(
              student?.year?.name ??
                student?.year_name ??
                student?.year_group ??
                student?.class?.year?.name ??
                classItem.yearLabel ??
                classItem.meta,
              ""
            );
            const gender = cleanDashboardLabel(student?.gender ?? student?.student_gender, "");
            const userName = [
              student?.user_name,
              student?.username,
              student?.user?.user_name,
              student?.user?.username,
              student?.student?.user_name,
              student?.student?.username,
            ]
              .map((value) => String(value ?? "").trim())
              .find(Boolean) ?? "";

            return {
              key: String(student?.id ?? student?.student_id ?? `${classItem.key}-${index}`),
              title: cleanDashboardLabel(student?.student_name ?? student?.name ?? student?.user?.name, `Student ${index + 1}`),
              meta: classLabel,
              badge: student?.status ? cleanDashboardLabel(student.status) : undefined,
              href: student?.id || student?.student_id
                ? `/dashboard/reports/student/${student?.id ?? student?.student_id}${
                    subjectId ? `?subject_id=${subjectId}` : ""
                  }`
                : classItem.href,
              yearLabel,
              classLabel,
              subjectLabel,
              gender,
              userName,
            };
          })
        );
      };

      if (title === "Total Years") return loadYears();
      if (title === "Total Classes" || title === "My Classes") return loadClasses();
      if (title === "Total Teachers") return loadTeachers();
      if (title === "Total Students") return loadStudents();
      if (title === "Total Schools") {
        return uniqueDetailItems(
          (Array.isArray(schools) ? schools : []).map((school: any, index: number) => ({
            key: String(school?.id ?? index),
            title: cleanDashboardLabel(school?.name ?? school?.school_name, `School ${index + 1}`),
            meta: cleanDashboardLabel(school?.address ?? school?.email ?? "School record", "School record"),
            href: "/dashboard/schools",
          }))
        );
      }
      if (title === "Total Admins") {
        return uniqueDetailItems(
          (Array.isArray(superAdmins) ? superAdmins : []).map((admin: any, index: number) => ({
            key: String(admin?.id ?? index),
            title: cleanDashboardLabel(admin?.name ?? admin?.email, `Admin ${index + 1}`),
            meta: cleanDashboardLabel(admin?.email ?? admin?.role ?? "Admin account", "Admin account"),
            href: "/dashboard/admins",
          }))
        );
      }

      return [];
    },
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

  const { data: liveStudentProfile, isLoading: liveStudentProfileLoading } = useQuery({
    queryKey: ["student-live-class-profile", currentUser?.student, activeSubjectId, canUseSubjectContext],
    queryFn: () =>
      fetchStudentProfileData(
        Number(currentUser?.student),
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined
      ),
    enabled: currentUser?.role === "STUDENT" && Number(currentUser?.student) > 0,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const liveStudentClassId = extractLiveStudentClassId(
    liveStudentProfile,
    currentUser?.studentClass
  );
  const effectiveStudentClassId =
    Number.isFinite(liveStudentClassId) && liveStudentClassId > 0
      ? liveStudentClassId
      : Number(currentUser?.studentClass ?? 0);

  const {
    data: studentHomeAssessmentsFromTerms = [],
    isLoading: studentHomeAssessmentsLoading,
  } = useQuery({
    queryKey: [
      "student-home-assessments-from-terms",
      effectiveStudentClassId,
      activeSubjectId,
      canUseSubjectContext,
    ],
    queryFn: async () => {
      const classId = Number(effectiveStudentClassId);
      if (!Number.isFinite(classId) || classId <= 0) return [];

      const terms = await fetchTerm(classId);
      const scopedSubjectId = canUseSubjectContext ? activeSubjectId ?? undefined : undefined;
      const termResults = await Promise.all(
        (Array.isArray(terms) ? terms : []).map(async (term: any) => {
          const assessments = await fetchAssessmentByStudent(Number(term?.id), scopedSubjectId);
          return { term, assessments: Array.isArray(assessments) ? assessments : [] };
        })
      );

      const rows = termResults.flatMap(({ term, assessments }) =>
        assessments
          .filter((assessment: any) => String(assessment?.type ?? "").toLowerCase() === "assessment")
          .filter((assessment: any) => {
            const assignedRows = Array.isArray(assessment?.assigned)
              ? assessment.assigned
              : Array.isArray(assessment?.assign_assessments)
                ? assessment.assign_assessments
                : [];

            if (assignedRows.length === 0) return true;

            return assignedRows.some(
              (row: any) =>
                Number(row?.term_id) === Number(term?.id) &&
                String(row?.status ?? "").toLowerCase() === "assigned"
            );
          })
          .map((assessment: any) => {
            const tasks = Array.isArray(assessment?.tasks) ? assessment.tasks : [];
            const datedTasks = tasks
              .map((task: any) => ({
                dueTs: parseDueTimestamp(task?.due_date),
                dueDate: task?.due_date || null,
                updatedAt: task?.updated_at || null,
              }))
              .filter((task: any) => task.dueTs !== null);
            const nearestTask = datedTasks.sort((a: any, b: any) => Number(a.dueTs) - Number(b.dueTs))[0];
            const latestUpdated = tasks
              .map((task: any) => task?.updated_at)
              .filter(Boolean)
              .sort((a: string, b: string) => Date.parse(b) - Date.parse(a))[0] || null;

            return {
              assessmentId: assessment?.id ?? null,
              assessmentName: assessment?.name ?? "Assessment",
              termName: term?.name ?? "Term",
              dueTs: nearestTask?.dueTs ?? null,
              dueDate: nearestTask?.dueDate ?? null,
              updatedAt: latestUpdated,
              taskCount: tasks.length,
            };
          })
      );

      return rows.sort((a: any, b: any) => {
        if (a.dueTs === null && b.dueTs === null) return 0;
        if (a.dueTs === null) return 1;
        if (b.dueTs === null) return -1;
        return a.dueTs - b.dueTs;
      });
    },
    enabled:
      currentUser?.role === "STUDENT" &&
      !liveStudentProfileLoading &&
      Number(effectiveStudentClassId) > 0 &&
      (!canUseSubjectContext ||
        !hasRequestedSubjectContext ||
        (!!activeSubjectId && !subjectContextLoading)),
  });

  const {
    data: studentHomeTrackers = [],
    isLoading: studentHomeTrackersLoading,
  } = useQuery({
    queryKey: [
      "student-home-trackers",
      effectiveStudentClassId,
      activeSubjectId,
      canUseSubjectContext,
    ],
    queryFn: async () => {
      const classId = Number(effectiveStudentClassId);
      if (!Number.isFinite(classId) || classId <= 0) return [];

      const rows = await fetchTrackers(
        classId,
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined
      );

      const deduped = new Map<string, any>();

      (Array.isArray(rows) ? rows : []).forEach((row: any, index: number) => {
        const tracker = row?.tracker ?? {};
        const trackerId = Number(row?.tracker_id ?? tracker?.id ?? row?.id ?? 0);
        const key =
          Number.isFinite(trackerId) && trackerId > 0
            ? String(trackerId)
            : `tracker-${index}`;
        if (deduped.has(key)) return;

        const deadline =
          tracker?.deadline ??
          tracker?.deadline_at ??
          tracker?.deadline_date ??
          row?.deadline ??
          row?.deadline_at ??
          row?.deadline_date ??
          null;
        const topics = Array.isArray(tracker?.topics) ? tracker.topics : [];
        const completedTopics = topics.filter((topic: any) =>
          (Array.isArray(topic?.status_progress) ? topic.status_progress : []).some(
            (progress: any) => Boolean(progress?.is_completed)
          )
        ).length;

        deduped.set(key, {
          trackerId: Number.isFinite(trackerId) && trackerId > 0 ? trackerId : null,
          trackerName: tracker?.name ?? row?.name ?? "Tracker",
          status: tracker?.status ?? row?.status ?? null,
          dueTs: parseDueTimestamp(deadline),
          dueDate: deadline,
          updatedAt:
            tracker?.last_updated ?? row?.updated_at ?? row?.created_at ?? deadline ?? null,
          topicCount: topics.length,
          completedTopicCount: completedTopics,
        });
      });

      return Array.from(deduped.values()).sort((a: any, b: any) => {
        if (a.dueTs === null && b.dueTs === null) {
          const aUpdated = parseUpdatedTimestamp(a.updatedAt) ?? 0;
          const bUpdated = parseUpdatedTimestamp(b.updatedAt) ?? 0;
          return bUpdated - aUpdated;
        }
        if (a.dueTs === null) return 1;
        if (b.dueTs === null) return -1;
        return a.dueTs - b.dueTs;
      });
    },
    enabled:
      currentUser?.role === "STUDENT" &&
      !liveStudentProfileLoading &&
      Number(effectiveStudentClassId) > 0 &&
      (!canUseSubjectContext ||
        !hasRequestedSubjectContext ||
        (!!activeSubjectId && !subjectContextLoading)),
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

  const studentYearName = extractLiveStudentYearName(
    liveStudentProfile,
    currentUser?.studentYearName
  );
  const studentClassName = extractLiveStudentClassName(
    liveStudentProfile,
    currentUser?.studentClassName
  );

  const studentActiveAssessments = useMemo(() => {
    const terms = studentDashboard?.data?.class?.term;
    if (!Array.isArray(terms)) return [];

    const now = Date.now();

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
      .sort((a: any, b: any) => {
        const aIsUpcoming = a.dueTs === null || a.dueTs >= now;
        const bIsUpcoming = b.dueTs === null || b.dueTs >= now;

        if (aIsUpcoming !== bIsUpcoming) return aIsUpcoming ? -1 : 1;
        if (a.dueTs === null && b.dueTs === null) return 0;
        if (a.dueTs === null) return 1;
        if (b.dueTs === null) return -1;

        return aIsUpcoming ? a.dueTs - b.dueTs : b.dueTs - a.dueTs;
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

  const studentHomeAssessments =
    isSubjectWorkspaceMode
      ? studentHomeAssessmentsFromTerms
      : studentHomeAssessmentsFromTerms.length > 0
        ? studentHomeAssessmentsFromTerms
        : studentActiveAssessments;
  const studentHomeItems = useMemo(() => {
    const assessmentItems = studentHomeAssessments.map((assessment: any, index: number) => ({
      kind: "assessment" as const,
      key: `assessment-${assessment.assessmentId ?? index}`,
      title: assessment.assessmentName || "Assessment",
      metaParts: [
        assessment.termName || "Term",
        assessment.taskCount
          ? `${assessment.taskCount} task${assessment.taskCount === 1 ? "" : "s"}`
          : null,
        assessment.dueDate
          ? `Due ${new Date(assessment.dueDate).toLocaleDateString()}`
          : null,
      ].filter(Boolean),
      href: assessment.assessmentId
        ? `/dashboard/students/assignments/${assessment.assessmentId}`
        : "/dashboard/students/assignments",
      dueTs: assessment.dueTs ?? null,
      updatedTs: parseUpdatedTimestamp(assessment.updatedAt),
    }));

    const trackerItems = studentHomeTrackers.map((tracker: any, index: number) => ({
      kind: "tracker" as const,
      key: `tracker-${tracker.trackerId ?? index}`,
      title: tracker.trackerName || "Tracker",
      metaParts: [
        tracker.topicCount
          ? `${tracker.completedTopicCount}/${tracker.topicCount} topics`
          : null,
        tracker.status ? `Status ${tracker.status}` : null,
        tracker.dueDate
          ? `Due ${new Date(tracker.dueDate).toLocaleDateString()}`
          : null,
      ].filter(Boolean),
      href: tracker.trackerId
        ? `/dashboard/trackers/${effectiveStudentClassId}/${tracker.trackerId}`
        : `/dashboard/trackers/${effectiveStudentClassId}`,
      dueTs: tracker.dueTs ?? null,
      updatedTs: parseUpdatedTimestamp(tracker.updatedAt),
    }));

    return [...assessmentItems, ...trackerItems].sort((a, b) => {
      const aDue = a.dueTs;
      const bDue = b.dueTs;
      if (aDue === null && bDue === null) {
        return (b.updatedTs ?? 0) - (a.updatedTs ?? 0);
      }
      if (aDue === null) return 1;
      if (bDue === null) return -1;
      return aDue - bDue;
    });
  }, [effectiveStudentClassId, studentHomeAssessments, studentHomeTrackers]);
  const studentClassStoryClassId = String(effectiveStudentClassId || "").trim();
  const isStudentSubjectHomeLoading =
    currentUser?.role === "STUDENT" &&
    canUseSubjectContext &&
    hasRequestedSubjectContext &&
    (subjectContextLoading ||
      liveStudentProfileLoading ||
      studentHomeAssessmentsLoading ||
      studentHomeTrackersLoading ||
      (requestedSubjectId !== null && Number(activeSubjectId) !== Number(requestedSubjectId)));

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
                value: subjectScopedOverview?.classCount ?? 0,
                link: "/dashboard/classes",
              },
              {
                title: "Total Students",
                value: subjectScopedOverview?.studentCount ?? 0,
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
      "Total Classes": (
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
      "Total Classes": (
        <LayoutDashboard className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Teachers": (
        <Users className="h-5 w-5" style={{ color: THEME_COLOR }} />
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
  const activeStat = activeStatTitle
    ? stats.find((stat) => stat.title === activeStatTitle) ?? null
    : null;
  const isYearInlinePanel = activeStat?.title === "Total Years";
  const isClassInlinePanel = activeStat?.title === "Total Classes" || activeStat?.title === "My Classes";
  const isTeacherInlinePanel = activeStat?.title === "Total Teachers";
  const isStudentInlinePanel = activeStat?.title === "Total Students";
  const isCompactInlinePanel = isYearInlinePanel || isClassInlinePanel || isTeacherInlinePanel;
  const studentFilterOptions = useMemo(() => {
    const matchesSelected = (item: StatDetailItem, getValue: (item: StatDetailItem) => unknown, selected: string) => {
      if (!selected) return true;
      return normalizeDetailFilterValue(getValue(item)).toLowerCase() === selected.toLowerCase();
    };
    const buildOptions = (items: StatDetailItem[], getValue: (item: StatDetailItem) => unknown) => {
      const optionsByKey = new Map<string, string>();
      items.forEach((item) => {
        const label = normalizeDetailFilterValue(getValue(item));
        if (!label) return;
        const key = label.toLowerCase();
        if (!optionsByKey.has(key)) optionsByKey.set(key, label);
      });

      return Array.from(optionsByKey.values()).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base", numeric: true })
      );
    };
    const yearMatchedDetails = activeStatDetails.filter((item) =>
      matchesSelected(item, (entry) => entry.yearLabel, studentInlineFilters.year)
    );
    const classMatchedDetails = yearMatchedDetails.filter((item) =>
      matchesSelected(item, (entry) => entry.classLabel || entry.meta, studentInlineFilters.class)
    );
    const subjectMatchedDetails = classMatchedDetails.filter((item) =>
      matchesSelected(item, (entry) => entry.subjectLabel, studentInlineFilters.subject)
    );

    return {
      years: buildOptions(activeStatDetails, (item) => item.yearLabel),
      classes: buildOptions(yearMatchedDetails, (item) => item.classLabel || item.meta),
      subjects: buildOptions(classMatchedDetails, (item) => item.subjectLabel),
      genders: buildOptions(subjectMatchedDetails, (item) => item.gender),
    };
  }, [activeStatDetails, studentInlineFilters.class, studentInlineFilters.subject, studentInlineFilters.year]);
  const hasStudentInlineFilters = Object.values(studentInlineFilters).some(Boolean);
  const filteredActiveStatDetails = useMemo(() => {
    if (!isStudentInlinePanel) return activeStatDetails;

    const matchesFilter = (value: unknown, selected: string) => {
      if (!selected) return true;
      return normalizeDetailFilterValue(value).toLowerCase() === selected.toLowerCase();
    };

    return activeStatDetails.filter((item) =>
      matchesFilter(item.yearLabel, studentInlineFilters.year) &&
      matchesFilter(item.classLabel || item.meta, studentInlineFilters.class) &&
      matchesFilter(item.subjectLabel, studentInlineFilters.subject) &&
      matchesFilter(item.gender, studentInlineFilters.gender)
    );
  }, [activeStatDetails, isStudentInlinePanel, studentInlineFilters]);
  const shouldShowAllInlineRecords = isStudentInlinePanel || isClassInlinePanel;
  const visibleActiveStatDetails = shouldShowAllInlineRecords
    ? filteredActiveStatDetails
    : filteredActiveStatDetails.slice(0, STAT_DETAIL_LIMIT);
  const activeStatDetailCount = shouldShowAllInlineRecords ? filteredActiveStatDetails.length : activeStatDetails.length;
  const hasVisibleDetailPanel = shouldShowAllInlineRecords ? activeStatDetails.length > 0 : visibleActiveStatDetails.length > 0;

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

  const dashboardUserName = String(currentUser?.name || "User").replace(/_/g, " ");
  const subjectDashboardName = formatSubjectDashboardName(activeSubject?.name);
  const heroTitle = isSubjectWorkspaceMode
    ? `${subjectDashboardName} Dashboard`
    : `Welcome, ${dashboardUserName}!`;
  const heroWelcome = isSubjectWorkspaceMode
    ? `Welcome, ${dashboardUserName} - ${subjectDashboardName}!`
    : "We're glad to have you back!";
  const heroDescription = isSubjectWorkspaceMode
    ? `View the latest information for ${subjectDashboardName}.`
    : "Let's get started. Explore your dashboard to manage your activities.";
  const isStudentDashboard = currentUser?.role === "STUDENT";

  return (
    <div
      className={`premium-page min-h-screen !font-[Raleway] ${
        isStudentDashboard ? "space-y-4 p-3 md:p-4" : "space-y-6 p-3 md:p-6"
      }`}
    >
      {isSubjectWorkspaceMode && subjectScopedOverviewError && currentUser?.role !== "TEACHER" && (
        <Alert
          type="warning"
          showIcon
          message={`Subject workspace data is not isolated yet for ${activeSubject?.name || "this subject"}.`}
          description="Backend subject-scoped dashboard endpoints are required for full separation."
        />
      )}
      <Card
        className={`premium-hero border-0 overflow-hidden ${
          isStudentDashboard ? "!mb-2" : "!mb-4"
        }`}
        style={{
          background: `linear-gradient(135deg, ${THEME_COLOR_LIGHT}, rgba(255,255,255,0.98) 72%)`,
        }}
      >
        <div className={`${isStudentDashboard ? "px-4 py-3 md:px-5 md:py-4" : "px-4 py-4 md:px-6 md:py-5"}`}>
          <div className={`flex flex-col ${isStudentDashboard ? "gap-3" : "gap-4"} md:flex-row md:items-center md:justify-between`}>
            <div className="min-w-0 flex-1">
              {isSubjectWorkspaceMode ? (
                <div className={`inline-flex items-center rounded-full border border-[var(--theme-border)] bg-white/75 shadow-sm ${isStudentDashboard ? "px-2.5 py-1 text-[10px] tracking-[0.22em]" : "px-3 py-1 text-[11px] tracking-[0.24em]"} font-semibold uppercase text-slate-500`}>
                  Subject Workspace
                </div>
              ) : null}

              <div className={`${isStudentDashboard ? "mt-2.5" : "mt-3"} flex flex-wrap items-center gap-x-3 gap-y-2`}>
                <h1 className={`${isStudentDashboard ? "text-[1.65rem] md:text-[1.9rem]" : "text-[2rem] md:text-[2.25rem]"} font-semibold leading-none tracking-tight text-slate-800`}>
                  {heroTitle}
                </h1>
                {isSubjectWorkspaceMode ? (
                  <span className={`inline-flex max-w-full items-center rounded-2xl border border-[var(--theme-border)] bg-white/85 shadow-sm ${isStudentDashboard ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"} font-medium text-slate-600`}>
                    {heroWelcome}
                  </span>
                ) : null}
              </div>

              {!isSubjectWorkspaceMode ? (
                <p className={`${isStudentDashboard ? "mt-1.5 text-sm" : "mt-2 text-base"} text-slate-600`}>{heroWelcome}</p>
              ) : null}

              <p className={`${isStudentDashboard ? "mt-2 text-xs leading-5 md:text-sm" : "mt-3 text-sm leading-6 md:text-base"} max-w-2xl text-slate-500`}>
                {heroDescription}
              </p>
            </div>
            {currentUser?.role !== "SUPER_ADMIN" && schoolLogo ? (
              <div className={`${isStudentDashboard ? "h-12 w-12 md:h-14 md:w-14" : "h-14 w-14 md:h-16 md:w-16"} overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm`}>
                <img
                  src={`${IMG_BASE_URL}/storage/${schoolLogo}`}
                  alt="School Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              isSubjectWorkspaceMode &&
              /islam|islamiat|islamic/i.test(String(activeSubject?.name || "")) ? (
                <div className={`hidden overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm md:block ${isStudentDashboard ? "h-16 w-16 md:h-20 md:w-20" : "h-20 w-20 md:h-24 md:w-24"}`}>
                  <img
                    src={ISLAMIC_DASHBOARD_IMAGE}
                    alt="Al-Masjid an-Nabawi"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : isSubjectWorkspaceMode &&
                /arabic|arab/i.test(String(activeSubject?.name || "")) ? (
                <div className={`hidden overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm md:block ${isStudentDashboard ? "h-16 w-16 md:h-20 md:w-20" : "h-20 w-20 md:h-24 md:w-24"}`}>
                  <img
                    src={ARABIC_DASHBOARD_IMAGE}
                    alt="Arabic alphabet calligraphy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`hidden rounded-2xl border border-[var(--theme-border)] shadow-sm md:block ${isStudentDashboard ? "p-2" : "p-2.5"}`}
                  style={{ backgroundColor: THEME_COLOR_LIGHT }}
                >
                  <svg
                    className={`${isStudentDashboard ? "h-10 w-10" : "h-12 w-12"}`}
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
        <div className="space-y-3 lg:space-y-2">
          {/* Enhanced Breadcrumb */}
          <div className="flex items-center text-xs font-medium capitalize text-gray-600 md:text-sm">
            <span className="font-semibold" style={{ color: THEME_COLOR }}>
              {studentYearName || "Year"}
            </span>
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-800">{studentClassName || "Class"}</span>
          </div>

          <Card className="border-0 bg-transparent !shadow-none">
            {isStudentSubjectHomeLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Spin size="large" />
              </div>
            ) : studentHomeItems.length > 0 ? (
              <div className="space-y-2.5">
                {studentHomeItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="group block"
                  >
                    <div className="rounded-2xl border border-[var(--theme-border)] bg-white px-3 py-2.5 shadow-sm transition group-hover:border-[color:var(--primary)] group-hover:shadow-md md:px-4 md:py-3">
                      <div className="min-w-0">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                              item.kind === "tracker"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.kind}
                          </span>
                          <span
                            className="text-xs font-medium md:text-sm"
                            style={{ color: THEME_COLOR }}
                          >
                            View
                          </span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p className="text-base font-semibold text-slate-800 md:text-[1.02rem]">
                            {item.title}
                          </p>
                          {item.metaParts?.length ? (
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-500 md:text-sm">
                              {item.metaParts.map((part: string, index: number) => (
                                <span key={`${item.key}-meta-${part}-${index}`} className="flex items-center gap-2">
                                  {index > 0 ? <span className="text-slate-300">•</span> : null}
                                  <span>{part}</span>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No assigned work available right now.</p>
            )}
          </Card>

          {studentClassStoryClassId ? (
            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 md:text-[1.05rem]">Class Story</h2>
                <p className="text-xs text-gray-600 md:text-sm">
                  Announcements, assignments, and class updates for this subject.
                </p>
              </div>
              <ClassStoryPanel
                classId={studentClassStoryClassId}
                compact
                scrollableFeedClassName="min-h-[16rem] max-h-[50vh] md:max-h-[54vh] lg:max-h-[calc(100vh-23rem)]"
              />
            </div>
          ) : null}
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
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => {
                  const icon = currentUser?.role
                    ? (statIcons[currentUser?.role] as Record<string, JSX.Element>)[
                        stat.title
                      ]
                    : null;
                  const cardStyle = STAT_CARD_STYLES[index % STAT_CARD_STYLES.length];
                  const isActiveStat = activeStatTitle === stat.title;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveStatTitle((current) => (current === stat.title ? null : stat.title))}
                      className="group relative overflow-hidden rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        borderColor: isActiveStat ? cardStyle.accent : cardStyle.border,
                        boxShadow: isActiveStat
                          ? `0 14px 30px ${cardStyle.glow}, 0 0 0 2px ${cardStyle.border}`
                          : `0 8px 22px ${cardStyle.glow}`,
                      }}
                    >
                      <span
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60 transition group-hover:scale-110"
                        style={{ backgroundColor: cardStyle.soft }}
                      />
                      <span className="relative flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                            {stat?.title}
                          </span>
                          <span className="mt-2 flex items-center gap-2">
                            <span
                              className="flex h-8 w-8 items-center justify-center rounded-xl border"
                              style={{ backgroundColor: cardStyle.soft, borderColor: cardStyle.border }}
                            >
                              {icon}
                            </span>
                            <span className="text-2xl font-black leading-none" style={{ color: cardStyle.accent }}>
                              {stat?.value}
                            </span>
                          </span>
                        </span>
                        <span
                          className="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
                          style={{ backgroundColor: cardStyle.soft, color: cardStyle.accent }}
                        >
                          {isActiveStat ? "Open" : "View"}
                        </span>
                      </span>
                    </button>
                  );
                })}

              </div>

              {activeStat ? (
                <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Inline information
                      </p>
                      <h3 className="mt-1 text-base font-bold text-slate-800">
                        {activeStat.title} · {activeStat.value}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStatTitle(null)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                    >
                      Close
                    </button>
                  </div>

                  <div className="p-4">
                    {activeStatDetailsLoading ? (
                      <div className="flex h-24 items-center justify-center">
                        <Spin />
                      </div>
                    ) : hasVisibleDetailPanel ? (
                      <>
                        {isStudentInlinePanel ? (
                          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                                  <tr>
                                    <th className="px-4 py-3 align-top">Student Name</th>
                                    <th className="px-4 py-3 align-top">
                                      <div className="space-y-1.5">
                                        <span>Year Group</span>
                                        <Select
                                          size="small"
                                          allowClear
                                          placeholder="All years"
                                          value={studentInlineFilters.year || undefined}
                                          onChange={(value) => setStudentInlineFilters((current) => ({ ...current, year: value || "", class: "" }))}
                                          options={studentFilterOptions.years.map((value) => ({ value, label: value }))}
                                          style={{ minWidth: 140 }}
                                        />
                                      </div>
                                    </th>
                                    <th className="px-4 py-3 align-top">
                                      <div className="space-y-1.5">
                                        <span>Class</span>
                                        <Select
                                          size="small"
                                          allowClear
                                          placeholder="All classes"
                                          value={studentInlineFilters.class || undefined}
                                          onChange={(value) => setStudentInlineFilters((current) => ({ ...current, class: value || "" }))}
                                          options={studentFilterOptions.classes.map((value) => ({ value, label: value }))}
                                          style={{ minWidth: 120 }}
                                        />
                                      </div>
                                    </th>
                                    <th className="px-4 py-3 align-top">
                                      <div className="space-y-1.5">
                                        <span>Subjects</span>
                                        <Select
                                          size="small"
                                          allowClear
                                          placeholder="All subjects"
                                          value={studentInlineFilters.subject || undefined}
                                          onChange={(value) => setStudentInlineFilters((current) => ({ ...current, subject: value || "" }))}
                                          options={studentFilterOptions.subjects.map((value) => ({ value, label: value }))}
                                          style={{ minWidth: 130 }}
                                        />
                                      </div>
                                    </th>
                                    <th className="px-4 py-3 align-top">
                                      <div className="space-y-1.5">
                                        <span>Gender</span>
                                        <Select
                                          size="small"
                                          allowClear
                                          placeholder="All genders"
                                          value={studentInlineFilters.gender || undefined}
                                          onChange={(value) => setStudentInlineFilters((current) => ({ ...current, gender: value || "" }))}
                                          options={studentFilterOptions.genders.map((value) => ({ value, label: value }))}
                                          style={{ minWidth: 120 }}
                                        />
                                      </div>
                                    </th>
                                    <th className="px-4 py-3 align-top">
                                      <div className="space-y-1.5">
                                        <span>Action</span>
                                        {hasStudentInlineFilters ? (
                                          <button
                                            type="button"
                                            onClick={() => setStudentInlineFilters(EMPTY_STUDENT_INLINE_FILTERS)}
                                            className="block rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold normal-case tracking-normal text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                                          >
                                            Clear
                                          </button>
                                        ) : null}
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {visibleActiveStatDetails.length > 0 ? visibleActiveStatDetails.map((item) => {
                                    const gender = String(item.gender || "").toLowerCase();
                                    const genderClass = gender.includes("female")
                                      ? "border-pink-200 bg-pink-50 text-pink-600"
                                      : gender.includes("male")
                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                        : "border-slate-200 bg-slate-50 text-slate-500";

                                    return (
                                      <tr key={item.key} className="transition hover:bg-emerald-50/30">
                                        <td className="whitespace-nowrap px-4 py-3">
                                          <div className="flex flex-col">
                                            <span className="font-semibold text-emerald-700">{item.title}</span>
                                            {item.userName ? (
                                              <span className="font-mono text-xs text-slate-400">@{item.userName}</span>
                                            ) : null}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                          {item.yearLabel ? (
                                            <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600">
                                              {item.yearLabel}
                                            </span>
                                          ) : (
                                            <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                          {item.classLabel || item.meta ? (
                                            <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600">
                                              {item.classLabel || item.meta}
                                            </span>
                                          ) : (
                                            <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                          {item.subjectLabel ? (
                                            <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600">
                                              {item.subjectLabel}
                                            </span>
                                          ) : (
                                            <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                          {item.gender ? (
                                            <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${genderClass}`}>
                                              {item.gender}
                                            </span>
                                          ) : (
                                            <span className="text-slate-400">-</span>
                                          )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                          {item.href ? (
                                            <Link
                                              href={item.href}
                                              className="inline-flex rounded-md px-3 py-1.5 text-xs font-bold shadow-sm transition hover:opacity-90"
                                              style={{ backgroundColor: "#d4a72c", border: "1px solid #c49a21", color: "#ffffff" }}
                                            >
                                              View
                                            </Link>
                                          ) : (
                                            <span className="text-xs font-medium text-slate-400">No action</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }) : (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-8 text-center text-sm font-medium text-slate-500">
                                        No students match the selected filters.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className={isCompactInlinePanel ? "grid gap-2" : "grid gap-2 sm:grid-cols-2 xl:grid-cols-3"}>
                            {visibleActiveStatDetails.map((item) => {
                              const content = isYearInlinePanel ? (
                                <div className="flex min-w-0 items-center justify-between gap-3">
                                  <span className="truncate text-sm font-bold text-slate-800">{item.title}</span>
                                  {item.badge ? (
                                    <span className="shrink-0 text-sm font-semibold text-emerald-700">
                                      {item.badge}
                                    </span>
                                  ) : null}
                                </div>
                              ) : isClassInlinePanel ? (
                                <div className="flex min-w-0 items-center justify-between gap-3">
                                  <span className="truncate text-sm font-bold text-slate-800">{item.title}</span>
                                  {item.meta ? (
                                    <span className="shrink-0 truncate text-sm font-semibold text-slate-500">
                                      {item.meta}
                                    </span>
                                  ) : null}
                                </div>
                              ) : isTeacherInlinePanel ? (
                                <div className="flex min-w-0 items-center justify-between gap-3">
                                  <span className="truncate text-sm font-bold text-slate-800">{item.title}</span>
                                  {item.meta ? (
                                    <span className="shrink-0 truncate text-sm font-semibold text-slate-500">
                                      {item.meta}
                                    </span>
                                  ) : null}
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-bold text-slate-800">{item.title}</p>
                                      {item.meta ? (
                                        <p className="mt-1 truncate text-xs text-slate-500">{item.meta}</p>
                                      ) : null}
                                    </div>
                                    {item.badge ? (
                                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                        {item.badge}
                                      </span>
                                    ) : null}
                                  </div>
                                  {item.href ? (
                                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700">
                                      <span>Open</span>
                                      <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                                    </div>
                                  ) : null}
                                </>
                              );
                              const detailCardClass = isCompactInlinePanel
                                ? "group block rounded-xl border border-emerald-100 bg-white px-4 py-2.5 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-md"
                                : "group block rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 px-3.5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md";
                              const staticDetailCardClass = isCompactInlinePanel
                                ? "rounded-xl border border-emerald-100 bg-white px-4 py-2.5 shadow-sm"
                                : "rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 px-3.5 py-3 shadow-sm";

                              return item.href ? (
                                <Link
                                  key={item.key}
                                  href={item.href}
                                  className={detailCardClass}
                                >
                                  {content}
                                </Link>
                              ) : (
                                <div
                                  key={item.key}
                                  className={staticDetailCardClass}
                                >
                                  {content}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {isStudentInlinePanel ? (
                          <p className="mt-3 text-xs font-medium text-slate-500">
                            Showing {activeStatDetailCount} {hasStudentInlineFilters ? "filtered " : ""}records.
                          </p>
                        ) : isClassInlinePanel ? (
                          <p className="mt-3 text-xs font-medium text-slate-500">
                            Showing all {activeStatDetailCount} classes.
                          </p>
                        ) : activeStatDetailCount > STAT_DETAIL_LIMIT ? (
                          <p className="mt-3 text-xs font-medium text-slate-500">
                            Showing first {STAT_DETAIL_LIMIT} of {activeStatDetailCount} {hasStudentInlineFilters ? "filtered " : ""}records.
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
                        No detailed records are available for this card yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}

          <DashboardCharts
            barChartData={barChartData}
            pieChartData={pieChartData}
            barChartTitle={barChartTitle}
            pieChartTitle={pieChartTitle}
            barChartKey={barChartKey}
            themeColor={THEME_COLOR}
            colors={COLORS}
          />
        </>
      )}

    </div>
  );
}
