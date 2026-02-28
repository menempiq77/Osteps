"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Tag,
  Card,
  Space,
  Typography,
  Spin,
  Select,
  Breadcrumb,
  Button,
  Switch,
} from "antd";
import {
  CrownOutlined,
  TrophyOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLeaderBoardData,
  fetchSchoolLeaderBoardData,
  fetchSchoolSelfLeaderBoardData,
} from "@/services/leaderboardApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchClasses } from "@/services/classesApi";
import { fetchAssignYears, fetchYears, fetchYearsBySchool } from "@/services/yearsApi";
import Link from "next/link";
import { fetchStudentProfileData, fetchStudents } from "@/services/studentsApi";
import {
  mergeAndRankLeaderboards,
  mapWithConcurrency,
  resolveStudentId,
  resolveStudentName,
  type LeaderboardRow,
} from "@/lib/leaderboard";

const { Title, Text } = Typography;

interface CurrentUser {
  student?: string;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
  school?: string | number | { id?: string | number };
  schoolId?: string | number;
  school_id?: string | number;
  studentClass?: string | number;
  studentClassName?: string;
}

const getClassId = (cls: any): string => {
  const rawId = cls?.id ?? cls?.class_id ?? cls?.classId ?? null;
  if (rawId === null || rawId === undefined || String(rawId).trim() === "") return "";
  return String(rawId);
};

const getClassYearId = (cls: any): string => {
  const rawYearId = cls?.year_id ?? cls?.year?.id ?? cls?.yearId ?? null;
  if (rawYearId === null || rawYearId === undefined || String(rawYearId).trim() === "") return "";
  return String(rawYearId);
};

const getClassSchoolId = (cls: any): string => {
  const rawSchoolId =
    cls?.school_id ??
    cls?.school?.id ??
    cls?.year?.school_id ??
    cls?.year?.school?.id ??
    null;
  if (rawSchoolId === null || rawSchoolId === undefined || String(rawSchoolId).trim() === "") {
    return "";
  }
  return String(rawSchoolId);
};

const extractAssignedClasses = (assignYears: any[]): any[] => {
  const flattened = (assignYears ?? []).flatMap((item: any) => {
    const classesValue = item?.classes;
    if (Array.isArray(classesValue)) return classesValue;
    if (classesValue) return [classesValue];
    return [];
  });

  return Array.from(
    new Map(
      flattened
        .map((cls: any) => [getClassId(cls), cls] as const)
        .filter(([id]) => !!id)
    ).values()
  );
};

const buildStudentNameMap = (students: any[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  for (const student of students ?? []) {
    const rawId = student?.id ?? student?.student_id;
    if (rawId === null || rawId === undefined) continue;
    const key = String(rawId);
    const resolvedName =
      student?.student_name ??
      student?.user_name ??
      student?.name ??
      student?.user?.name ??
      "";
    if (resolvedName) {
      mapping[key] = resolvedName;
    }
  }
  return mapping;
};

const LeaderBoard = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const roleKey = (currentUser?.role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  const isTeacher = roleKey === "TEACHER";
  const isHod = roleKey === "HOD" || roleKey === "HEAD_OF_DEPARTMENT";
  const isAdmin =
    roleKey === "SCHOOL_ADMIN" || roleKey === "ADMIN" || roleKey === "SUPER_ADMIN";
  const isStudent = roleKey === "STUDENT";
  const isTeachingStaff = isTeacher || isHod;
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showMyStudentsOnly, setShowMyStudentsOnly] = useState(false);
  const [leaderboardScope, setLeaderboardScope] = useState<"class" | "school">(
    roleKey === "STUDENT" ? "school" : "school"
  );
  const authSchoolId = (() => {
    const schoolValue = (currentUser as any)?.school;
    if (typeof schoolValue === "object" && schoolValue !== null && "id" in schoolValue) {
      const nestedId = (schoolValue as any)?.id;
      if (nestedId !== null && nestedId !== undefined && String(nestedId).trim() !== "") {
        return String(nestedId);
      }
    }

    const candidate =
      schoolValue ??
      (currentUser as any)?.school_id ??
      (currentUser as any)?.schoolId ??
      null;

    if (candidate === null || candidate === undefined || String(candidate).trim() === "") {
      return null;
    }

    return String(candidate);
  })();

  const [assignYearsData, setAssignYearsData] = useState<any[]>([]);
  const teacherAssignedClasses = isTeachingStaff ? extractAssignedClasses(assignYearsData) : [];
  const assignedSchoolId = (() => {
    for (const cls of teacherAssignedClasses) {
      const sid = getClassSchoolId(cls);
      if (sid) return sid;
    }
    return null;
  })();
  const resolvedSchoolId = authSchoolId ?? assignedSchoolId;

  const loadSchoolYearsForStaff = async () => {
    if (resolvedSchoolId) {
      return (await fetchYearsBySchool(Number(resolvedSchoolId))) ?? [];
    }
    try {
      return (await fetchYears()) ?? [];
    } catch {
      return [];
    }
  };

  const loadSchoolClassesForStaff = async () => {
    let yearsData = await loadSchoolYearsForStaff();
    
    // If we got 0 years (teacher doesn't have permission), extract years from assigned classes
    if (yearsData.length === 0 && isTeachingStaff && teacherAssignedClasses.length > 0) {
      const assignedYears = teacherAssignedClasses
        .map((cls: any) => cls?.year)
        .filter((year: any) => year);
      yearsData = Array.from(
        new Map(assignedYears?.map((year: any) => [year.id, year])).values()
      );
    }
    
    const yearIds = Array.from(
      new Set(
        (yearsData ?? [])
          .map((y: any) => y?.id ?? y?.year_id ?? y?.yearId)
          .filter((id: any) => id !== null && id !== undefined)
          .map((id: any) => String(id))
      )
    );
    
    const classesByYear = await mapWithConcurrency(yearIds, 3, async (yearId) => {
      try {
        return (await fetchClasses(String(yearId))) ?? [];
      } catch (error) {
        return [];
      }
    });
    return classesByYear.flat();
  };

  /** Load years */
  const loadYears = async () => {
    try {
      setLoading(true);
      let yearsData: any[] = [];

      if (isStudent) {
        // Student view uses derived year + school leaderboards (no dropdowns)
        setYears([]);
        setSelectedYear(null);
        return;
      }

      if (isTeachingStaff) {
        const res = await fetchAssignYears();
        setAssignYearsData(res);

        if (leaderboardScope === "school") {
          yearsData = await loadSchoolYearsForStaff();
        } else {
          const years = extractAssignedClasses(res)
            .map((cls: any) => cls?.year)
            .filter((year: any) => year);
          yearsData = Array.from(
            new Map(years?.map((year: any) => [year.id, year])).values()
          );
        }
      } else {
        if (!resolvedSchoolId) {
          setYears([]);
          setSelectedYear(null);
          return;
        }
        const res = await fetchYearsBySchool(Number(resolvedSchoolId));
        yearsData = res;
      }
      setYears(yearsData);
      if (yearsData.length > 0) {
        if (isTeachingStaff && leaderboardScope === "class") {
          setSelectedYear(yearsData[0].id.toString());
        } else {
          setSelectedYear("__all__");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, [leaderboardScope, resolvedSchoolId]);

  useEffect(() => {
    if (!isTeachingStaff || leaderboardScope !== "school") {
      setShowMyStudentsOnly(false);
    }
  }, [isTeachingStaff, leaderboardScope]);

  /** Fetch classes for selected year */
  // const { data: classes = [], isLoading: classesLoading } = useQuery({
  //   queryKey: ["classes", selectedYear, isTeacher],
  //   queryFn: async () => {
  //     if (!selectedYear) return [];
  //     if (isTeacher) {
  //       const res = await fetchAssignYears();
  //       let classesData = res
  //         .map((item: any) => item.classes)
  //         .filter((cls: any) => cls);
  //       classesData = Array.from(
  //         new Map(classesData.map((cls: any) => [cls.id, cls])).values()
  //       );
  //       return classesData.filter(
  //         (cls: any) => cls.year_id === Number(selectedYear)
  //       );
  //     } else {
  //       return await fetchClasses(Number(selectedYear));
  //     }
  //   },
  //   enabled: !!selectedYear,
  // });

  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes", selectedYear, isTeachingStaff],
    queryFn: async () => {
      if (!selectedYear) return [];

      if (isTeachingStaff && leaderboardScope === "class") {
        if (selectedYear === "__all__") {
          return teacherAssignedClasses;
        }
        return teacherAssignedClasses.filter((cls: any) => {
          const yearId = getClassYearId(cls);
          return !!yearId && yearId === String(selectedYear);
        });
      }

      if (selectedYear === "__all__") {
        return await loadSchoolClassesForStaff();
      }

      return fetchClasses(String(selectedYear));
    },
    enabled:
      !isStudent &&
      !!selectedYear &&
      (!isTeachingStaff || assignYearsData.length > 0) &&
      (!!resolvedSchoolId || isTeachingStaff),
  });

  useEffect(() => {
    if (isStudent) return;
    if (leaderboardScope === "school") {
      setSelectedClass(null);
      return;
    }
    const normalizedClasses = Array.isArray(classes) ? classes : [];
    if (normalizedClasses.length === 0) {
      setSelectedClass(null);
      return;
    }

    const hasSelectedInList = normalizedClasses.some((cls: any) => {
      const id = getClassId(cls);
      return id && id === String(selectedClass ?? "");
    });

    if (!hasSelectedInList) {
      setSelectedClass(getClassId(normalizedClasses[0]) || null);
    }
  }, [classes, isStudent, selectedClass, leaderboardScope]);

  const {
    data: classLeaderboardResponse,
    isLoading: classLeaderboardLoading,
    isError: classLeaderboardIsError,
    error: classLeaderboardError,
  } = useQuery({
    queryKey: ["leaderboard", selectedClass],
    queryFn: () => fetchLeaderBoardData(selectedClass as string),
    enabled: !isStudent && !!selectedClass && leaderboardScope === "class",
  });

  const {
    data: studentProfile,
    isLoading: studentProfileLoading,
    isError: studentProfileIsError,
    error: studentProfileError,
  } = useQuery({
    queryKey: ["student-profile-self", currentUser?.student],
    queryFn: () => fetchStudentProfileData(currentUser?.student as string),
    enabled: isStudent && !!currentUser?.student,
    staleTime: 5 * 60 * 1000,
  });

  const studentClassId = isStudent
    ? String(
        currentUser?.studentClass ??
          studentProfile?.class_id ??
          studentProfile?.class?.id ??
          ""
      ) || null
    : null;
  const studentSchoolIdResolved = isStudent
    ? (currentUser?.school ??
      studentProfile?.school?.id ??
      studentProfile?.class?.year?.school_id ??
      null)
    : null;

  const {
    data: studentClassLeaderboardResponse,
    isLoading: studentClassLeaderboardLoading,
    isError: studentClassLeaderboardIsError,
    error: studentClassLeaderboardError,
  } = useQuery({
    queryKey: ["leaderboard-student-class", studentClassId],
    queryFn: () => fetchLeaderBoardData(studentClassId as string),
    enabled: isStudent && !!studentClassId,
    staleTime: 2 * 60 * 1000,
  });

  const classIdForNameLookup =
    leaderboardScope === "class"
      ? isStudent
        ? studentClassId
        : selectedClass
      : null;

  const { data: classStudentNameMap = {} } = useQuery({
    queryKey: ["leaderboard-class-student-name-map", classIdForNameLookup],
    queryFn: async () => {
      if (!classIdForNameLookup) return {};
      const students = (await fetchStudents(String(classIdForNameLookup))) ?? [];
      return buildStudentNameMap(students);
    },
    enabled: !!classIdForNameLookup,
    staleTime: 60 * 1000,
  });

  const {
    data: schoolLeaderboardRows,
    isLoading: schoolLeaderboardLoading,
    isError: schoolLeaderboardIsError,
    error: schoolLeaderboardError,
  } = useQuery({
    queryKey: ["leaderboard-school-self", currentUser?.student],
    queryFn: async () => {
      const res = await fetchSchoolSelfLeaderBoardData();
      const rows = res?.data ?? [];
      return rows.map((student: any, index: number) => ({
        key: String(student?.student_id ?? ""),
        rank: index + 1,
        name: student?.student_name ?? "Unknown",
        avatar: student?.student_name?.charAt(0).toUpperCase() || "?",
        points: student?.total_marks || 0,
        trackerPoints: student?.tracker_points,
        mindPoints: student?.mind_points,
        className: student?.class_name ?? "",
        badge:
          index === 0
            ? "gold"
            : index === 1
            ? "silver"
            : index === 2
            ? "bronze"
            : null,
      }));
    },
    enabled: isStudent || leaderboardScope === "school",
    staleTime: 2 * 60 * 1000,
  });

  const { data: studentSchoolMaps = { classByStudentId: {}, nameByStudentId: {} } } = useQuery({
    queryKey: ["student-school-maps", studentSchoolIdResolved],
    queryFn: async () => {
      if (!studentSchoolIdResolved) {
        return { classByStudentId: {}, nameByStudentId: {} };
      }

      const years = (await fetchYearsBySchool(Number(studentSchoolIdResolved))) ?? [];
      const yearIds = Array.from(
        new Set(
          (years ?? [])
            .map((y: any) => y?.id ?? y?.year_id ?? y?.yearId)
            .filter((id: any) => id !== null && id !== undefined)
            .map((id: any) => String(id))
        )
      );

      const classesByYear = await mapWithConcurrency(yearIds, 3, async (yearId) => {
        try {
          return (await fetchClasses(String(yearId))) ?? [];
        } catch (error) {
          return [];
        }
      });

      const classes = classesByYear.flat();
      const classByStudentId: Record<string, string> = {};
      const nameByStudentId: Record<string, string> = {};

      await mapWithConcurrency(classes, 4, async (cls: any) => {
        const classId = cls?.id ?? cls?.class_id ?? cls?.classId;
        const className = cls?.class_name ?? cls?.name ?? `Class ${classId}`;
        if (!classId) return null;
        try {
          const students = (await fetchStudents(String(classId))) ?? [];
          const classNameForStudents = className;
          for (const s of students) {
            const sid = s?.id ?? s?.student_id;
            if (sid !== null && sid !== undefined) {
              const key = String(sid);
              classByStudentId[key] = classNameForStudents;
              const resolvedName =
                s?.student_name ?? s?.user_name ?? s?.name ?? s?.user?.name ?? "";
              if (resolvedName) {
                nameByStudentId[key] = resolvedName;
              }
            }
          }
        } catch (error) {
          // Ignore per-class failure and continue.
        }
        return null;
      });

      return { classByStudentId, nameByStudentId };
    },
    enabled: isStudent && !!studentSchoolIdResolved,
    staleTime: 10 * 60 * 1000,
  });

  const unresolvedSchoolStudentIds = isStudent
    ? (schoolLeaderboardRows ?? [])
        .map((row: any) => String(row?.key ?? row?.student_id ?? ""))
        .filter((id: string) => !!id)
        .filter((id: string) => !studentSchoolMaps?.classByStudentId?.[id])
    : [];

  const { data: studentProfileClassMap = {} } = useQuery({
    queryKey: ["student-profile-class-map", unresolvedSchoolStudentIds.join("|")],
    queryFn: async () => {
      const mapping: Record<string, string> = {};
      await mapWithConcurrency(unresolvedSchoolStudentIds, 4, async (studentId) => {
        try {
          const profile = await fetchStudentProfileData(studentId);
          const className =
            profile?.class?.class_name ??
            profile?.class_name ??
            profile?.class?.name ??
            null;
          if (className) {
            mapping[String(studentId)] = className;
          }
        } catch (error) {
          // Ignore per-student profile errors and continue.
        }
        return null;
      });
      return mapping;
    },
    enabled: isStudent && unresolvedSchoolStudentIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: staffSchoolLeaderboardRows,
    isLoading: staffSchoolLeaderboardLoading,
    isError: staffSchoolLeaderboardIsError,
    error: staffSchoolLeaderboardError,
  } = useQuery({
    queryKey: [
      "leaderboard-school-staff",
      resolvedSchoolId,
      isTeachingStaff,
      assignYearsData.length,
      selectedYear,
      (classes ?? []).map((cls: any) => getClassId(cls)).filter(Boolean).join("|"),
    ],
    queryFn: async () => {
      if (resolvedSchoolId) {
        try {
          const res = await fetchSchoolLeaderBoardData(resolvedSchoolId);
          const rows = res?.data ?? [];
          if (rows.length > 0) {
            return mergeAndRankLeaderboards([rows]);
          }
        } catch (error) {
          // Fall back below.
        }
      }

      try {
        const res = await fetchSchoolSelfLeaderBoardData();
        const rows = res?.data ?? [];
        if (rows.length > 0) {
          return mergeAndRankLeaderboards([rows]);
        }
      } catch (error) {
        // Fall back to class aggregation below.
      }

      const classesForAggregation = await (async () => {
        const schoolClasses = await loadSchoolClassesForStaff();
        if (schoolClasses.length > 0) return schoolClasses;
        return teacherAssignedClasses;
      })();

      const fallbackSelectedYearClasses =
        classesForAggregation.length === 0 ? (classes ?? []) : [];
      const mergedClassPool =
        classesForAggregation.length > 0 ? classesForAggregation : fallbackSelectedYearClasses;

      const classIds: string[] = mergedClassPool
        .map((cls: any) => getClassId(cls))
        .filter((id: string) => !!id);
      const uniqueClassIds: string[] = Array.from(new Set(classIds));

      if (uniqueClassIds.length === 0) {
        return [];
      }

      const leaderboards = await mapWithConcurrency(uniqueClassIds, 5, async (classId) => {
        try {
          const res = await fetchLeaderBoardData(classId);
          return res?.data ?? [];
        } catch (error) {
          return [];
        }
      });

      return mergeAndRankLeaderboards(leaderboards);
    },
    enabled: !isStudent && leaderboardScope === "school",
    staleTime: 2 * 60 * 1000,
  });

  const unresolvedStaffSchoolStudentIds = !isStudent
    ? (staffSchoolLeaderboardRows ?? [])
        .map((row: any) => String(row?.key ?? row?.student_id ?? ""))
        .filter((id: string) => !!id)
    : [];

  const { data: staffSchoolMaps = { classByStudentId: {}, nameByStudentId: {} } } = useQuery({
    queryKey: [
      "leaderboard-school-staff-maps",
      resolvedSchoolId,
      isTeachingStaff,
      assignYearsData.length,
      unresolvedStaffSchoolStudentIds.join("|"),
    ],
    queryFn: async () => {
      const classByStudentId: Record<string, string> = {};
      const nameByStudentId: Record<string, string> = {};
      if (unresolvedStaffSchoolStudentIds.length === 0) {
        return { classByStudentId, nameByStudentId };
      }

      const classesForLookup =
        await (async () => {
          const schoolClasses = await loadSchoolClassesForStaff();
          if (schoolClasses.length > 0) return schoolClasses;
          return teacherAssignedClasses;
        })();

      const fallbackSelectedYearClasses =
        classesForLookup.length === 0 ? (classes ?? []) : [];
      const mergedClassPool =
        classesForLookup.length > 0 ? classesForLookup : fallbackSelectedYearClasses;

      await mapWithConcurrency(mergedClassPool, 4, async (cls: any) => {
        const classId = getClassId(cls);
        const className = cls?.class_name ?? cls?.name ?? `Class ${classId}`;
        if (!classId) return null;

        try {
          const students = (await fetchStudents(String(classId))) ?? [];
          for (const s of students) {
            const sid = s?.id ?? s?.student_id;
            if (sid !== null && sid !== undefined) {
              const key = String(sid);
              if (unresolvedStaffSchoolStudentIds.includes(key)) {
                classByStudentId[key] = className;
                const resolvedName =
                  s?.student_name ?? s?.user_name ?? s?.name ?? s?.user?.name ?? "";
                if (resolvedName) {
                  nameByStudentId[key] = resolvedName;
                }
              }
            }
          }
        } catch (error) {
          // Ignore class-level failures.
        }
        return null;
      });

      return { classByStudentId, nameByStudentId };
    },
    enabled: !isStudent && leaderboardScope === "school" && unresolvedStaffSchoolStudentIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const isPageLoading =
    loading ||
    (!isStudent &&
      ((leaderboardScope === "class" && (classesLoading || classLeaderboardLoading)) ||
        (leaderboardScope === "school" && staffSchoolLeaderboardLoading))) ||
    (isStudent &&
      (studentProfileLoading ||
        studentClassLeaderboardLoading ||
        schoolLeaderboardLoading));

  const isPageError =
    (!isStudent &&
      ((leaderboardScope === "class" && classLeaderboardIsError) ||
        (leaderboardScope === "school" && staffSchoolLeaderboardIsError))) ||
    (isStudent && studentProfileIsError);

  const pageErrorMessage = !isStudent
    ? (leaderboardScope === "class"
        ? (classLeaderboardError as any)?.message
        : (staffSchoolLeaderboardError as any)?.message) ||
      "Failed to load leaderboard"
    : (studentProfileError as any)?.message ||
      (leaderboardScope === "class"
        ? (studentClassLeaderboardError as any)?.message
        : (schoolLeaderboardError as any)?.message) ||
      "Failed to load leaderboard";

  if (isPageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isPageError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Text type="danger">Error: {pageErrorMessage}</Text>
      </div>
    );
  }

  const classLeaderboardRows: LeaderboardRow[] =
    classLeaderboardResponse?.data?.map((student: any, index: number) => {
      const key = resolveStudentId(student) || `row-${index}`;
      const name = classStudentNameMap?.[String(key)] || resolveStudentName(student) || "Unknown";
      return {
        key,
        rank: index + 1,
        name,
        avatar: name?.charAt(0).toUpperCase() || "?",
        points: student?.total_marks || 0,
        trackerPoints: student?.tracker_points,
        mindPoints: student?.mind_points,
        badge:
          index === 0
            ? "gold"
            : index === 1
            ? "silver"
            : index === 2
            ? "bronze"
            : null,
      };
    }) || [];

  const studentClassLeaderboardRows: LeaderboardRow[] =
    studentClassLeaderboardResponse?.data?.map((student: any, index: number) => {
      const key = resolveStudentId(student) || `row-${index}`;
      const name = classStudentNameMap?.[String(key)] || resolveStudentName(student) || "Unknown";
      return {
        key,
        rank: index + 1,
        name,
        avatar: name?.charAt(0).toUpperCase() || "?",
        points: student?.total_marks || 0,
        trackerPoints: student?.tracker_points,
        mindPoints: student?.mind_points,
        badge:
          index === 0
            ? "gold"
            : index === 1
            ? "silver"
            : index === 2
            ? "bronze"
            : null,
      };
    }) || [];

  // Show all rows (no load-more) as requested
  const visibleStudents = classLeaderboardRows;
  const visibleStudentClass = studentClassLeaderboardRows;
  const visibleSchoolStudents =
    isStudent ? (schoolLeaderboardRows ?? []) : (staffSchoolLeaderboardRows ?? []);
  const studentOwnClassName =
    currentUser?.studentClassName ??
    studentProfile?.class?.class_name ??
    "My Class";
  const visibleStudentClassWithClass = visibleStudentClass.map((row) => ({
    ...row,
    className: studentOwnClassName,
  }));
  const visibleSchoolStudentsWithClass = isStudent
    ? visibleSchoolStudents.map((row) => ({
        ...row,
        name:
          studentSchoolMaps?.nameByStudentId?.[String(row.key)] ??
          (row as any)?.name ??
          "Unknown",
        avatar:
          (
            studentSchoolMaps?.nameByStudentId?.[String(row.key)] ??
            (row as any)?.name ??
            "?"
          )
            .charAt(0)
            .toUpperCase(),
        className:
          (row as any)?.className ??
          (row as any)?.class_name ??
          (row as any)?.class?.class_name ??
          studentSchoolMaps?.classByStudentId?.[String(row.key)] ??
          studentProfileClassMap?.[String(row.key)] ??
          ((row as any)?.class_id ? `Class ${(row as any).class_id}` : ""),
      }))
    : visibleSchoolStudents.map((row) => ({
        ...row,
        name:
          staffSchoolMaps?.nameByStudentId?.[String((row as any)?.key ?? "")] ??
          (row as any)?.name ??
          "Unknown",
        avatar:
          (
            staffSchoolMaps?.nameByStudentId?.[String((row as any)?.key ?? "")] ??
            (row as any)?.name ??
            "?"
          )
            .charAt(0)
            .toUpperCase(),
        className:
          (row as any)?.className ??
          (row as any)?.class_name ??
          (row as any)?.class?.class_name ??
          staffSchoolMaps?.classByStudentId?.[String((row as any)?.key ?? "")] ??
          ((row as any)?.class_id ? `Class ${(row as any).class_id}` : ""),
      }));

  const normalizeClassName = (value: string | null | undefined) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  const teacherAssignedClassIdSet = new Set(
    teacherAssignedClasses
      .map((cls: any) => getClassId(cls))
      .filter((id: string) => !!id)
  );

  const teacherAssignedClassNameSet = new Set(
    teacherAssignedClasses
      .map((cls: any) => cls?.class_name ?? cls?.name ?? "")
      .map((name: string) => normalizeClassName(name))
      .filter((name: string) => !!name)
  );

  const rankRowsByPoints = (rows: any[]) =>
    [...rows]
      .sort((a, b) => Number(b?.points || 0) - Number(a?.points || 0))
      .map((row, index) => ({
        ...row,
        rank: index + 1,
        badge:
          index === 0
            ? "gold"
            : index === 1
            ? "silver"
            : index === 2
            ? "bronze"
            : null,
      }));

  const fallbackStudentClassRows = rankRowsByPoints(
    (visibleSchoolStudentsWithClass ?? []).filter((row: any) => {
      const byClassName =
        normalizeClassName((row as any)?.className) ===
        normalizeClassName(studentOwnClassName);
      const byClassId =
        !!studentClassId &&
        String((row as any)?.class_id ?? "") === String(studentClassId);
      return byClassName || byClassId;
    })
  );

  const resolvedStudentClassRows =
    (visibleStudentClassWithClass ?? []).length > 0
      ? visibleStudentClassWithClass
      : fallbackStudentClassRows;

  const filteredTeacherSchoolRows = rankRowsByPoints(
    (visibleSchoolStudentsWithClass ?? []).filter((row: any) => {
      const rowClassId = String((row as any)?.class_id ?? "");
      const rowClassName = normalizeClassName((row as any)?.className);
      const byClassId = !!rowClassId && teacherAssignedClassIdSet.has(rowClassId);
      const byClassName = !!rowClassName && teacherAssignedClassNameSet.has(rowClassName);
      return byClassId || byClassName;
    })
  );

  const selectedClassIdSet = new Set(
    (classes ?? [])
      .map((cls: any) => getClassId(cls))
      .filter((id: string) => !!id)
  );
  const selectedClassNameSet = new Set(
    (classes ?? [])
      .map((cls: any) => normalizeClassName(cls?.class_name ?? cls?.name ?? ""))
      .filter((name: string) => !!name)
  );

  const applySchoolFilters = (rows: any[]) => {
    // When viewing the whole school, show all students without class/year filters
    if (leaderboardScope === "school" && !selectedClass && !selectedYear) {
      return rankRowsByPoints(rows ?? []);
    }
    
    return rankRowsByPoints(
      (rows ?? []).filter((row: any) => {
        const rowClassId = String((row as any)?.class_id ?? "");
        const rowClassName = normalizeClassName((row as any)?.className);
        const yearPass =
          selectedYear === "__all__" ||
          selectedClassIdSet.has(rowClassId) ||
          selectedClassNameSet.has(rowClassName);
        const classPass =
          !selectedClass ||
          rowClassId === String(selectedClass) ||
          rowClassName === normalizeClassName(
            (classes ?? []).find((cls: any) => getClassId(cls) === String(selectedClass))
              ?.class_name ??
              (classes ?? []).find((cls: any) => getClassId(cls) === String(selectedClass))
                ?.name ??
              ""
          );
        return yearPass && classPass;
      })
    );
  };

  const myStudentKey = currentUser?.student
    ? String(currentUser.student)
    : studentProfile?.id
    ? String(studentProfile.id)
    : studentProfile?.student_id
    ? String(studentProfile.student_id)
    : null;
  const mySchoolRank = myStudentKey
    ? (visibleSchoolStudents ?? []).find((row) => row.key === myStudentKey)?.rank ?? null
    : null;
  const myClassRank = myStudentKey
    ? (resolvedStudentClassRows ?? []).find((row) => row.key === myStudentKey)?.rank ?? null
    : null;

  const activeRows = leaderboardScope === "class"
    ? visibleStudents
    : applySchoolFilters(visibleSchoolStudentsWithClass);
  const studentActiveRows =
    leaderboardScope === "class"
      ? resolvedStudentClassRows
      : visibleSchoolStudentsWithClass;

  const getRowClassName = (record: any, index: number) => {
    const classes = [];
    if (index % 2 === 0) classes.push("ant-table-row-striped");
    if (record?.rank === 1) classes.push("leaderboard-row-gold");
    if (record?.rank === 2) classes.push("leaderboard-row-silver");
    if (record?.rank === 3) classes.push("leaderboard-row-bronze");
    if (myStudentKey && record?.key === myStudentKey) classes.push("leaderboard-row-me");
    return classes.join(" ");
  };

  const classTagColors = [
    "green",
    "cyan",
    "blue",
    "geekblue",
    "lime",
    "gold",
    "orange",
    "magenta",
  ] as const;

  const getClassTagColor = (value: string) => {
    const text = (value || "Unknown").trim();
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return classTagColors[hash % classTagColors.length];
  };

  const getClassTagStyle = (value: string) => {
    const palette = [
      { bg: "#f0fdf4", text: "#2f855a", border: "#bbf7d0" },
      { bg: "#f0f9ff", text: "#2c5282", border: "#bae6fd" },
      { bg: "#eff6ff", text: "#334e9a", border: "#bfdbfe" },
      { bg: "#f5f3ff", text: "#5b4bb7", border: "#ddd6fe" },
      { bg: "#f7fee7", text: "#4d7c0f", border: "#d9f99d" },
      { bg: "#fffbeb", text: "#9a6b16", border: "#fde68a" },
      { bg: "#fff7ed", text: "#9a5d2f", border: "#fed7aa" },
      { bg: "#fdf2f8", text: "#9b4f7b", border: "#fbcfe8" },
    ] as const;

    const text = (value || "Class").trim();
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return palette[hash % palette.length];
  };

  const columns: any[] = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => {
        if (rank === 1)
          return <CrownOutlined style={{ color: "#FFD700", fontSize: 20 }} />;
        if (rank === 2)
          return <TrophyOutlined style={{ color: "#C0C0C0", fontSize: 20 }} />;
        if (rank === 3)
          return <StarOutlined style={{ color: "#CD7F32", fontSize: 20 }} />;
        return (
          <span
            style={{
              display: "inline-flex",
              width: 26,
              height: 26,
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              background: "#f1f5f9",
              fontWeight: 700,
            }}
          >
            {rank}
          </span>
        );
      },
      width: 80,
      align: "center" as const,
    },
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space size={10}>
          <Avatar
            style={{
              backgroundColor:
                record.badge === "gold"
                  ? "#FFD700"
                  : record.badge === "silver"
                  ? "#C0C0C0"
                  : record.badge === "bronze"
                  ? "#CD7F32"
                  : "#1890ff",
              color: "#111827",
              fontWeight: "bold",
            }}
          >
            {record.avatar}
          </Avatar>
          <Text strong style={{ marginRight: 2 }}>{text}</Text>
          {record.badge === "gold" && <Tag color="gold">#1</Tag>}
          {record.badge === "silver" && <Tag color="default">#2</Tag>}
          {record.badge === "bronze" && <Tag color="#cd7f32">#3</Tag>}
        </Space>
      ),
      width: 250,
      ellipsis: true,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      render: (points: number, record: LeaderboardRow) => (
        <Text
          strong
          title={
            record.trackerPoints !== undefined || record.mindPoints !== undefined
              ? `Tracker: ${record.trackerPoints ?? 0} | Mind: ${record.mindPoints ?? 0}`
              : undefined
          }
          style={{ color: "#0f766e", fontVariantNumeric: "tabular-nums" }}
        >
          {points}
        </Text>
      ),
      width: 120,
      align: "center" as const,
    },
  ];

  if (isStudent || (!isStudent && leaderboardScope === "school")) {
    columns.push({
      title: "Class",
      dataIndex: "className",
      key: "className",
      render: (value: string) => {
        const styles = getClassTagStyle(value);
        return (
        <Tag
          color={getClassTagColor(value)}
          style={{
            fontWeight: 600,
            borderRadius: 999,
            paddingInline: 12,
            paddingBlock: 3,
            borderColor: styles.border,
            color: styles.text,
            background: styles.bg,
            letterSpacing: 0,
            fontSize: 12.5,
          }}
        >
          {value || "N/A"}
        </Tag>
      )},
      width: 180,
      ellipsis: false,
      align: "right" as const,
    });
  }

  return (
    <div className="premium-page" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Card
        className="premium-hero !mb-4"
        style={{
          background:
            "linear-gradient(120deg, rgba(15,118,110,0.08) 0%, rgba(245,158,11,0.08) 100%)",
          border: "1px solid rgba(15,118,110,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <Text type="secondary">Leaderboard Overview</Text>
            <Title level={4} style={{ margin: 0 }}>
              {isStudent ? "Your Class + Whole School Rankings" : "Class and School Performance Rankings"}
            </Title>
          </div>
          <Tag color="processing">Live</Tag>
        </div>
      </Card>
     <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Leaderboard</span>,
          },
        ]}
        className="!mb-6"
      />

      {!isStudent ? (
        <>
          <Card className="premium-filter-panel p-4 !mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Scope
                </label>
                <Select
                  value={leaderboardScope}
                  onChange={(value) => setLeaderboardScope(value)}
                  className="w-full"
                >
                  <Select.Option value="class">Class</Select.Option>
                  <Select.Option value="school">Whole School</Select.Option>
                </Select>
              </div>
              {/* Year Select */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Year
                </label>
                <Select
                  value={selectedYear || undefined}
                  onChange={(value) => {
                    setSelectedYear(value);
                    setSelectedClass(null); // reset class when year changes
                  }}
                  className="w-full"
                  placeholder="Select Year"
                >
                  <Select.Option value="__all__">All Years</Select.Option>
                  {years?.map((year) => (
                    <Select.Option key={year.id} value={year.id.toString()}>
                      {year.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Class Select */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1">
                  Class
                </label>
                <Select
                  value={selectedClass || undefined}
                  onChange={(value) =>
                    setSelectedClass(value === "__all_classes__" ? null : value)
                  }
                  className="w-full"
                  placeholder={leaderboardScope === "school" ? "All Classes" : "Select Class"}
                  loading={classesLoading}
                  disabled={!selectedYear}
                >
                  {leaderboardScope === "school" && (
                    <Select.Option value="__all_classes__">All Classes</Select.Option>
                  )}
                  {classes?.map((cls: any) => (
                    <Select.Option key={getClassId(cls)} value={getClassId(cls)}>
                      {cls.class_name ?? cls.name ?? `Class ${getClassId(cls)}`}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card className="premium-card">
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={3} style={{ margin: 0 }}>
                    {leaderboardScope === "class" ? "Class Leaderboard" : "Whole School Leaderboard"}
                  </Title>
                </div>

                {leaderboardScope === "school" && activeRows.length === 0 && !staffSchoolLeaderboardLoading && (
                  <div style={{ padding: "20px", textAlign: "center", background: "#f5f5f5", borderRadius: "8px" }}>
                    <Text type="secondary">
                      <strong>No leaderboard data available.</strong>
                      <div style={{ marginTop: 10 }}>Possible reasons:</div>
                      <ul style={{ marginTop: 10, textAlign: "left", display: "inline-block" }}>
                        <li>No students have submitted assessments yet</li>
                        <li>The backend needs to be updated with the latest changes</li>
                        <li>Your account may need additional permissions</li>
                      </ul>
                    </Text>
                  </div>
                )}

                <Table
                  className="premium-antd-table"
                  columns={columns}
                  dataSource={activeRows}
                  pagination={false}
                  rowClassName={getRowClassName}
                  scroll={{ x: true }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text type="secondary">
                    Showing {activeRows.length} students
                  </Text>
                </div>
              </Space>
            </Card>
          </Space>
        </>
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card className="premium-card p-4 !mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Text type="secondary">My rank in class</Text>
                <Title level={4} style={{ margin: 0 }}>
                  {myClassRank ? `#${myClassRank}` : "N/A"}
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    / {(resolvedStudentClassRows ?? []).length}
                  </Text>
                </Title>
              </div>
              <div className="flex flex-col">
                <Text type="secondary">My rank in whole school</Text>
                <Title level={4} style={{ margin: 0 }}>
                  {mySchoolRank ? `#${mySchoolRank}` : "N/A"}
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    / {(schoolLeaderboardRows ?? []).length}
                  </Text>
                </Title>
              </div>
            </div>
          </Card>

          <Card className="premium-card">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={3} style={{ margin: 0 }}>
                {leaderboardScope === "class"
                  ? "Class Leaderboard"
                  : "Whole School Leaderboard"}
              </Title>

              <div style={{ display: "inline-flex", gap: 10 }}>
                <Button
                  type={leaderboardScope === "class" ? "primary" : "default"}
                  onClick={() => setLeaderboardScope("class")}
                  className="leaderboard-switch-btn premium-pill-btn"
                >
                  My class
                </Button>
                <Button
                  type={leaderboardScope === "school" ? "primary" : "default"}
                  onClick={() => setLeaderboardScope("school")}
                  className="leaderboard-switch-btn premium-pill-btn"
                >
                  Whole school
                </Button>
              </div>

              {leaderboardScope === "class" &&
                studentClassLeaderboardIsError &&
                (resolvedStudentClassRows ?? []).length === 0 && (
                <Text type="danger">
                  {(studentClassLeaderboardError as any)?.message || "Failed to load class leaderboard"}
                </Text>
              )}
              {leaderboardScope === "school" && schoolLeaderboardIsError && (
                <Text type="danger">
                  {(schoolLeaderboardError as any)?.message || "Failed to load whole school leaderboard"}
                </Text>
              )}

              <div key={leaderboardScope} className="leaderboard-table-animate">
                <Table
                  className="premium-antd-table"
                  columns={columns}
                  dataSource={studentActiveRows}
                  pagination={false}
                  rowClassName={getRowClassName}
                  scroll={{ x: true }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text type="secondary">
                  Showing {studentActiveRows.length} students
                </Text>
              </div>
            </Space>
          </Card>
        </Space>
      )}
      <style jsx global>{`
        .leaderboard-row-gold td {
          background: linear-gradient(90deg, rgba(250, 204, 21, 0.12), rgba(255, 255, 255, 0));
        }
        .leaderboard-row-silver td {
          background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(255, 255, 255, 0));
        }
        .leaderboard-row-bronze td {
          background: linear-gradient(90deg, rgba(217, 119, 6, 0.12), rgba(255, 255, 255, 0));
        }
        .leaderboard-row-me td {
          box-shadow: inset 3px 0 0 #0f766e;
          font-weight: 600;
        }
        .ant-table-thead > tr > th {
          background: #f8fafc !important;
          font-weight: 700 !important;
        }
        .ant-table-container table > tbody > tr > td {
          transition: background-color 0.2s ease;
        }
        .leaderboard-switch-btn.ant-btn {
          border-radius: 999px;
          font-weight: 600;
          padding-inline: 18px;
        }
        .leaderboard-switch-btn.ant-btn-primary {
          background: linear-gradient(90deg, #0f766e, #0e7490);
          border-color: transparent;
        }
        .leaderboard-table-animate {
          animation: leaderboardSwap 280ms ease;
          transform-origin: top center;
        }
        @keyframes leaderboardSwap {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderBoard;
