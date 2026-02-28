"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, ScrollText, Lock, CalendarClock } from "lucide-react";
import { Button, Card, Drawer, Input, Select, Space, Typography, message } from "antd";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchStudents } from "@/services/studentsApi";
import {
  assignMindUpgradeCourses,
  fallbackMindCatalog,
  fetchManageAssignments,
  fetchMindUpgradeCatalog,
  fetchStudentMindAssignments,
  unassignMindUpgrade,
} from "@/services/mindUpgradeApi";

type CurrentUser = {
  role?: string;
  school?: string | number | { id?: string | number };
  school_id?: string | number;
  schoolId?: string | number;
};

type ClassOption = {
  id: number;
  year_id?: number;
  class_name: string;
  year_name?: string;
};

type StudentOption = {
  id: number;
  student_name: string;
};

function resolveSchoolId(user: CurrentUser): string | null {
  const schoolValue = user?.school;
  if (typeof schoolValue === "object" && schoolValue !== null && "id" in schoolValue) {
    const nested = schoolValue?.id;
    if (nested !== null && nested !== undefined && String(nested).trim() !== "") return String(nested);
  }
  const candidate = schoolValue ?? user?.school_id ?? user?.schoolId ?? null;
  if (candidate === null || candidate === undefined || String(candidate).trim() === "") return null;
  return String(candidate);
}

function assignmentStatusLabel(status?: string) {
  if (status === "active") return { text: "Assigned", color: "text-emerald-700 bg-emerald-100" };
  if (status === "upcoming") return { text: "Upcoming", color: "text-amber-700 bg-amber-100" };
  if (status === "expired") return { text: "Expired", color: "text-slate-700 bg-slate-200" };
  return { text: "Not Assigned", color: "text-rose-700 bg-rose-100" };
}

export default function MindUpgradePage() {
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };

  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";
  const canAssign = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD" || roleKey === "TEACHER";
  const schoolId = resolveSchoolId(currentUser);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [selectedCourseKeys, setSelectedCourseKeys] = useState<string[]>(["aqeedah"]);
  const [assignTarget, setAssignTarget] = useState<"class" | "student" | "year_group" | "all_students">("class");
  const [selectedYearIds, setSelectedYearIds] = useState<number[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [selectedStudentClassIds, setSelectedStudentClassIds] = useState<number[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [startsAt, setStartsAt] = useState<string>("");
  const [endsAt, setEndsAt] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const { data: catalogData } = useQuery({
    queryKey: ["mind-upgrade-catalog"],
    queryFn: fetchMindUpgradeCatalog,
    staleTime: 10 * 60 * 1000,
  });

  const catalog = useMemo(() => {
    if (Array.isArray(catalogData) && catalogData.length > 0) return catalogData;
    return fallbackMindCatalog;
  }, [catalogData]);

  const { data: studentAssignments = [], isError: studentAssignmentsError } = useQuery({
    queryKey: ["mind-upgrade-student-assignments"],
    queryFn: fetchStudentMindAssignments,
    enabled: isStudent,
    staleTime: 60 * 1000,
  });

  const assignmentMap = useMemo(() => {
    const map = new Map<string, { status: string; starts_at?: string | null; ends_at?: string | null }>();
    for (const row of studentAssignments) {
      map.set(row.course_key, {
        status: row.status,
        starts_at: row.starts_at,
        ends_at: row.ends_at,
      });
    }
    return map;
  }, [studentAssignments]);

  const visibleCatalog = useMemo(() => {
    if (!isStudent) return catalog;
    if (studentAssignmentsError) return [];
    return catalog.filter((course) => {
      const status = assignmentMap.get(course.course_key)?.status;
      return !!status && status !== "unassigned";
    });
  }, [isStudent, studentAssignmentsError, catalog, assignmentMap]);

  const { data: allClasses = [] } = useQuery({
    queryKey: ["mind-upgrade-assign-classes", roleKey, schoolId],
    enabled: canAssign,
    queryFn: async (): Promise<ClassOption[]> => {
      if (schoolId) {
        const years = (await fetchYearsBySchool(Number(schoolId))) ?? [];
        const classBuckets = await Promise.all(
          years.map(async (year: any) => {
            const classes = (await fetchClasses(String(year.id))) ?? [];
            return classes.map((cls: any) => ({
              id: Number(cls.id),
              year_id: Number(year.id),
              class_name: cls.class_name ?? cls.name ?? `Class ${cls.id}`,
              year_name: year.name,
            }));
          }),
        );
        return classBuckets.flat();
      }

      const assignedYears = (await fetchAssignYears()) ?? [];
      const flattened = assignedYears.flatMap((item: any) => {
        const cls = item?.classes;
        if (!cls) return [];
        return Array.isArray(cls) ? cls : [cls];
      });

      const uniqueById = new Map<number, ClassOption>();
      for (const cls of flattened) {
        const id = Number(cls?.id);
        if (!id) continue;
        uniqueById.set(id, {
          id,
          year_id: Number(cls?.year_id ?? cls?.year?.id ?? 0) || undefined,
          class_name: cls?.class_name ?? cls?.name ?? `Class ${id}`,
          year_name: cls?.year?.name,
        });
      }
      return Array.from(uniqueById.values());
    },
  });

  const yearOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const cls of allClasses) {
      if (cls.year_id) {
        map.set(Number(cls.year_id), cls.year_name ?? `Year ${cls.year_id}`);
      }
    }
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [allClasses]);

  const filteredClasses = useMemo(() => {
    if (selectedYearIds.length === 0) return allClasses;
    const set = new Set(selectedYearIds.map((id) => Number(id)));
    return allClasses.filter((cls) => cls.year_id && set.has(Number(cls.year_id)));
  }, [allClasses, selectedYearIds]);

  const { data: classStudents = [] } = useQuery({
    queryKey: ["mind-upgrade-assign-students", selectedStudentClassIds.join("|")],
    enabled: canAssign && assignTarget === "student" && selectedStudentClassIds.length > 0,
    queryFn: async (): Promise<StudentOption[]> => {
      if (selectedStudentClassIds.length === 0) return [];
      const rowsByClass = await Promise.all(
        selectedStudentClassIds.map(async (classId) => {
          const rows = (await fetchStudents(classId)) ?? [];
          return rows;
        }),
      );
      const merged = rowsByClass.flat();
      const byId = new Map<number, StudentOption>();
      for (const student of merged as any[]) {
        const id = Number(student?.id ?? student?.student_id);
        if (!id) continue;
        byId.set(id, {
          id,
          student_name:
            student?.student_name ?? student?.user_name ?? student?.name ?? `Student ${id}`,
        });
      }
      return Array.from(byId.values());
    },
  });

  const { data: manageAssignments = [], isError: manageAssignmentsError } = useQuery({
    queryKey: ["mind-upgrade-manage-assignments", selectedCourseKeys.join("|")],
    enabled: canAssign && assignDrawerOpen,
    queryFn: () =>
      fetchManageAssignments({
        course_key: selectedCourseKeys.length === 1 ? selectedCourseKeys[0] : undefined,
        active_only: true,
      }),
  });

  const assignMutation = useMutation({
    mutationFn: assignMindUpgradeCourses,
  });

  const unassignMutation = useMutation({
    mutationFn: unassignMindUpgrade,
    onSuccess: () => {
      messageApi.success("Assignment removed.");
      queryClient.invalidateQueries({ queryKey: ["mind-upgrade-manage-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["mind-upgrade-student-assignments"] });
    },
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message || error?.message || "Failed to remove assignment.");
    },
  });

  const handleAssign = () => {
    if (selectedCourseKeys.length === 0) {
      messageApi.warning("Select at least one course.");
      return;
    }

    if (assignTarget === "class" && selectedClassIds.length === 0) {
      messageApi.warning("Select at least one class.");
      return;
    }

    if (assignTarget === "student" && selectedStudentIds.length === 0) {
      messageApi.warning("Select at least one student.");
      return;
    }

    if (assignTarget === "year_group" && selectedYearIds.length === 0) {
      messageApi.warning("Select at least one year group.");
      return;
    }

    Promise.all(
      selectedCourseKeys.map((courseKey) =>
        assignMutation.mutateAsync({
          course_key: courseKey,
          class_ids: assignTarget === "class" ? selectedClassIds : undefined,
          student_ids: assignTarget === "student" ? selectedStudentIds : undefined,
          year_ids: assignTarget === "year_group" ? selectedYearIds : undefined,
          assign_all_students: assignTarget === "all_students" ? true : undefined,
          starts_at: startsAt || undefined,
          ends_at: endsAt || undefined,
        }),
      ),
    )
      .then(() => {
        messageApi.success("Courses assigned successfully.");
        setSelectedClassIds([]);
        setSelectedStudentClassIds([]);
        setSelectedStudentIds([]);
        setSelectedYearIds([]);
        queryClient.invalidateQueries({ queryKey: ["mind-upgrade-manage-assignments"] });
        queryClient.invalidateQueries({ queryKey: ["mind-upgrade-student-assignments"] });
      })
      .catch((error: any) => {
        messageApi.error(error?.response?.data?.message || error?.message || "Failed to assign courses.");
      });
  };

  return (
    <div className="mind-upgrade-page p-3 md:p-6">
      {contextHolder}
      <div className="grid grid-cols-1 gap-4">
        <Card className="mind-upgrade-hero-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Typography.Title level={3} className="mind-upgrade-title !mb-1">
                {"Mind-upgrade"}
              </Typography.Title>
              <Typography.Text className="mind-upgrade-subtitle">
                Strengthen beliefs and values through focused Islamic learning.
              </Typography.Text>
            </div>
            {canAssign ? (
              <Button type="primary" onClick={() => setAssignDrawerOpen(true)}>
                Assign Courses
              </Button>
            ) : null}
          </div>
          {isStudent && studentAssignmentsError ? (
            <div className="mt-3 text-xs font-semibold text-amber-700">
              Assignment service unavailable. Student modules are hidden until assignments can be verified.
            </div>
          ) : null}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleCatalog.map((course) => {
            const status = assignmentMap.get(course.course_key);
            const isAssignedNow = !isStudent || status?.status === "active";
            const statusMeta = assignmentStatusLabel(status?.status);
            const Icon = course.course_key === "aqeedah" ? BookOpen : ScrollText;

            return isAssignedNow ? (
              <Link
                key={course.course_key}
                href={course.route_path}
                className="mind-upgrade-course-card block rounded-2xl p-5 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="mind-upgrade-course-icon h-14 w-14 rounded-xl flex items-center justify-center">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="mind-upgrade-course-title">{course.title}</h3>
                      {isStudent ? (
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusMeta.color}`}>
                          {statusMeta.text}
                        </span>
                      ) : null}
                    </div>
                    <p className="mind-upgrade-course-description mt-1">{course.description}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={course.course_key}
                className="mind-upgrade-locked-card rounded-2xl p-5 opacity-95"
              >
                <div className="flex items-start gap-4">
                  <div className="mind-upgrade-locked-icon h-14 w-14 rounded-xl flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="mind-upgrade-course-title mind-upgrade-course-title--locked">{course.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusMeta.color}`}>
                        {statusMeta.text}
                      </span>
                    </div>
                    <p className="mind-upgrade-course-description mind-upgrade-course-description--locked mt-1">{course.description}</p>
                    {status?.starts_at || status?.ends_at ? (
                      <div className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                        <CalendarClock className="h-4 w-4" />
                        {status?.starts_at ? `From: ${new Date(status.starts_at).toLocaleString()}` : ""}
                        {status?.ends_at ? ` | Until: ${new Date(status.ends_at).toLocaleString()}` : ""}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs font-semibold text-slate-600">
                        This module is not assigned to your class.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isStudent && visibleCatalog.length === 0 ? (
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
              No Mind-upgrade courses are assigned to you yet.
            </div>
          ) : null}
        </div>
      </div>

      <Drawer
        title="Assign Mind-upgrade Courses"
        open={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        width={640}
      >
        {manageAssignmentsError ? (
          <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
            Assignment endpoints are not available yet. Deploy backend routes/controllers first.
          </div>
        ) : null}

        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <div className="mb-1 text-xs font-semibold text-gray-500">Courses</div>
            <Select
              mode="multiple"
              value={selectedCourseKeys}
              onChange={(values) => setSelectedCourseKeys(values as string[])}
              options={catalog.map((c) => ({ value: c.course_key, label: c.title }))}
              style={{ width: "100%" }}
              placeholder="Select one or more courses"
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-gray-500">Assign To</div>
            <Select
              value={assignTarget}
              onChange={(value) => {
                const next = value as "class" | "student" | "year_group" | "all_students";
                setAssignTarget(next);
                setSelectedClassIds([]);
                setSelectedStudentIds([]);
                setSelectedStudentClassIds([]);
                setSelectedYearIds([]);
              }}
              options={[
                { value: "class", label: "Classes" },
                { value: "student", label: "Specific students" },
                { value: "year_group", label: "Year groups (all classes in year)" },
                { value: "all_students", label: "All students in school" },
              ]}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-gray-500">
              {assignTarget === "year_group" ? "Year groups" : "Year filter (optional)"}
            </div>
            <Select
              mode="multiple"
              value={selectedYearIds}
              onChange={(values) => {
                setSelectedYearIds((values as number[]).map((v) => Number(v)));
                setSelectedClassIds([]);
                setSelectedStudentClassIds([]);
                setSelectedStudentIds([]);
              }}
              options={yearOptions}
              style={{ width: "100%" }}
              placeholder={assignTarget === "year_group" ? "Select one or more year groups" : "Optional filter"}
              disabled={assignTarget === "all_students"}
            />
          </div>

          {assignTarget === "class" ? (
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-500">Classes</div>
              <Select
                mode="multiple"
                value={selectedClassIds}
                onChange={(values) => setSelectedClassIds(values as number[])}
                options={filteredClasses.map((cls) => ({
                  value: cls.id,
                  label: `${cls.class_name}${cls.year_name ? ` (${cls.year_name})` : ""}`,
                }))}
                style={{ width: "100%" }}
                placeholder="Select one or more classes"
              />
            </div>
          ) : null}

          {assignTarget === "student" ? (
            <>
              <div>
                <div className="mb-1 text-xs font-semibold text-gray-500">Classes</div>
                <Select
                  mode="multiple"
                  value={selectedStudentClassIds}
                  onChange={(values) => {
                    setSelectedStudentClassIds((values as number[]).map((v) => Number(v)));
                    setSelectedStudentIds([]);
                  }}
                  options={filteredClasses.map((cls) => ({
                    value: cls.id,
                    label: `${cls.class_name}${cls.year_name ? ` (${cls.year_name})` : ""}`,
                  }))}
                  style={{ width: "100%" }}
                  placeholder="Select one or more classes"
                />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-gray-500">Students</div>
                <Select
                  mode="multiple"
                  value={selectedStudentIds}
                  onChange={(values) => setSelectedStudentIds(values as number[])}
                  options={classStudents.map((student) => ({
                    value: student.id,
                    label: student.student_name,
                  }))}
                  style={{ width: "100%" }}
                  placeholder={
                    selectedStudentClassIds.length > 0
                      ? "Select one or more students"
                      : "Select classes first"
                  }
                  disabled={selectedStudentClassIds.length === 0}
                />
              </div>
            </>
          ) : null}

          {assignTarget === "all_students" ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              This will assign the selected course(s) to all students in your school.
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-500">Starts At (optional)</div>
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-500">Ends At (optional)</div>
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>

          <Button type="primary" loading={assignMutation.isPending} onClick={handleAssign}>
            Assign
          </Button>

          <div className="border-t pt-4">
            <div className="mb-2 text-sm font-bold text-slate-700">Current assignments</div>
            <div className="grid gap-2">
              {manageAssignments.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="text-sm">
                    <div className="font-semibold">{row.course_key}</div>
                    <div className="text-xs text-slate-500">
                      {row.student_name
                        ? `${row.student_name} (student)`
                        : row.class_name || `Class ${row.class_id}`}
                      {row.starts_at ? ` | From: ${new Date(row.starts_at).toLocaleString()}` : ""}
                      {row.ends_at ? ` | Until: ${new Date(row.ends_at).toLocaleString()}` : ""}
                    </div>
                  </div>
                  <Button
                    danger
                    size="small"
                    loading={unassignMutation.isPending}
                    onClick={() => unassignMutation.mutate(row.id)}
                  >
                    Unassign
                  </Button>
                </div>
              ))}
              {manageAssignments.length === 0 ? (
                <div className="text-xs text-slate-500">No assignments found.</div>
              ) : null}
            </div>
          </div>
        </Space>
      </Drawer>
      <style jsx global>{`
        .mind-upgrade-page {
          color: #0f172a;
        }
        .mind-upgrade-hero-card.ant-card {
          border: 1px solid var(--theme-border);
          background: linear-gradient(
            140deg,
            color-mix(in srgb, var(--theme-soft) 82%, white),
            color-mix(in srgb, var(--primary) 5%, white)
          );
          border-radius: 18px;
        }
        .mind-upgrade-title.ant-typography {
          font-size: clamp(1.7rem, 0.95vw + 1.2rem, 2.2rem) !important;
          line-height: 1.18 !important;
          font-weight: 800 !important;
          letter-spacing: -0.02em;
          color: #111827 !important;
        }
        .mind-upgrade-subtitle.ant-typography {
          font-size: clamp(0.96rem, 0.28vw + 0.86rem, 1.08rem) !important;
          line-height: 1.5;
          color: #5b6474 !important;
          font-weight: 500;
        }
        .mind-upgrade-course-card {
          border: 1px solid var(--theme-border);
          background: color-mix(in srgb, var(--theme-soft) 64%, white);
          border-radius: 22px;
          box-shadow: 0 12px 24px color-mix(in srgb, var(--theme-shadow) 20%, transparent);
        }
        .mind-upgrade-course-card:hover {
          border-color: color-mix(in srgb, var(--primary) 65%, white);
          background: color-mix(in srgb, var(--theme-soft-2) 58%, white);
          transform: translateY(-1px);
          box-shadow: 0 16px 30px color-mix(in srgb, var(--theme-shadow) 26%, transparent);
        }
        .mind-upgrade-course-icon {
          background: color-mix(in srgb, var(--primary) 22%, white);
          color: var(--theme-dark);
        }
        .mind-upgrade-course-title {
          font-size: clamp(1.08rem, 0.6vw + 0.92rem, 1.45rem);
          line-height: 1.25;
          font-weight: 700;
          letter-spacing: -0.018em;
          color: #1e293b;
        }
        .mind-upgrade-course-description {
          font-size: clamp(0.95rem, 0.28vw + 0.86rem, 1.08rem);
          line-height: 1.5;
          color: #556070;
          font-weight: 500;
        }
        .mind-upgrade-locked-card {
          border: 1px solid color-mix(in srgb, var(--theme-border) 65%, #d8dce3);
          background: color-mix(in srgb, var(--theme-soft) 35%, #f8fafc);
          border-radius: 22px;
        }
        .mind-upgrade-locked-icon {
          background: #e2e8f0;
          color: #64748b;
        }
        .mind-upgrade-course-title--locked {
          color: #64748b;
        }
        .mind-upgrade-course-description--locked {
          color: #6b7280;
        }
        @media (max-width: 768px) {
          .mind-upgrade-course-title {
            font-size: 1.45rem;
          }
          .mind-upgrade-course-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

