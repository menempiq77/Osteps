"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Select, Space, Typography, message } from "antd";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from '@/services/yearsApi';
import { fetchClasses } from "@/services/classesApi";
import { fetchStudents } from "@/services/studentsApi";
import { assignTracker, fetchTrackerAssignments, unassignTracker } from "@/services/trackersApi";import { fetchSubjectClasses } from '@/services/subjectWorkspaceApi';
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

type TrackerRef = {
  id: string;
  name: string;
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

export default function TrackerAssignDrawer({
  tracker,
  open,
  onClose,
  subjectId,
}: {
  tracker: TrackerRef | null;
  open: boolean;
  onClose: () => void;
  subjectId?: number;
}) {
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const roleKey = (currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const schoolId = resolveSchoolId(currentUser);
  const [messageApi, contextHolder] = message.useMessage();
  const [assignTarget, setAssignTarget] = useState<"class" | "student" | "year_group" | "all_students">("class");
  const [selectedYearIds, setSelectedYearIds] = useState<number[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [selectedStudentClassIds, setSelectedStudentClassIds] = useState<number[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const numericTrackerId = Number(tracker?.id ?? 0);

  const { data: allClasses = [] } = useQuery({
    queryKey: ["tracker-assign-classes", roleKey, schoolId, subjectId],
    enabled: open,
    queryFn: async (): Promise<ClassOption[]> => {
      let allFetched: ClassOption[] = [];

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
        allFetched = classBuckets.flat();
      } else {
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
        allFetched = Array.from(uniqueById.values());
      }

      // Filter by subject: keep only classes linked to the active subject.
      // subject_classes rows use (year_id + base_class_label) to identify base classes.
      if (subjectId) {
        try {
          const subjectClasses = (await fetchSubjectClasses({ subject_id: subjectId })) ?? [];

          // Build a set of (year_id, normalizedLabel) pairs and a set of direct class_ids
          const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, " ").trim();
          type LabelKey = string; // `${year_id}::${label}`
          const labelKeys = new Set<LabelKey>();
          const directClassIds = new Set<number>();

          for (const sc of subjectClasses as any[]) {
            const directId = Number(sc.class_id ?? sc.base_class_id ?? sc.class?.id ?? sc.classes?.id ?? 0);
            if (directId > 0) { directClassIds.add(directId); continue; }
            const yearId = Number(sc.year_id ?? 0);
            const label = normalize(String(sc.base_class_label ?? sc.name ?? ""));
            if (yearId > 0 && label) labelKeys.add(`${yearId}::${label}`);
          }

          if (directClassIds.size > 0 || labelKeys.size > 0) {
            allFetched = allFetched.filter((cls) => {
              if (directClassIds.has(cls.id)) return true;
              const key = `${cls.year_id}::${normalize(cls.class_name)}`;
              return labelKeys.has(key);
            });
          }
        } catch {
          // If subject class fetch fails, show all classes as fallback
        }
      }

      return allFetched;
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
    queryKey: ["tracker-assign-students", selectedStudentClassIds.join("|")],
    enabled: open && assignTarget === "student" && selectedStudentClassIds.length > 0,
    queryFn: async (): Promise<StudentOption[]> => {
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
          student_name: student?.student_name ?? student?.user_name ?? student?.name ?? `Student ${id}`,
        });
      }
      return Array.from(byId.values());
    },
  });

  const { data: currentAssignments = [], isError: assignmentsError } = useQuery({
    queryKey: ["tracker-manage-assignments", numericTrackerId],
    enabled: open && Number.isFinite(numericTrackerId) && numericTrackerId > 0,
    queryFn: () => fetchTrackerAssignments(numericTrackerId, { active_only: true }),
  });

  const resetForm = () => {
    setAssignTarget("class");
    setSelectedYearIds([]);
    setSelectedClassIds([]);
    setSelectedStudentClassIds([]);
    setSelectedStudentIds([]);
  };

  const assignMutation = useMutation({
    mutationFn: assignTracker,
    onSuccess: () => {
      messageApi.success("Tracker assigned successfully.");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["tracker-manage-assignments", numericTrackerId] });
    },
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.msg || error?.response?.data?.message || error?.message || "Failed to assign tracker.");
    },
  });

  const unassignMutation = useMutation({
    mutationFn: unassignTracker,
    onSuccess: () => {
      messageApi.success("Tracker unassigned successfully.");
      queryClient.invalidateQueries({ queryKey: ["tracker-manage-assignments", numericTrackerId] });
    },
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.msg || error?.response?.data?.message || error?.message || "Failed to unassign tracker.");
    },
  });

  const handleAssign = async () => {
    if (!numericTrackerId) {
      messageApi.error("Invalid tracker.");
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

    await assignMutation.mutateAsync({
      tracker_id: numericTrackerId,
      class_ids: assignTarget === "class" ? selectedClassIds : undefined,
      student_ids: assignTarget === "student" ? selectedStudentIds : undefined,
      year_ids: assignTarget === "year_group" ? selectedYearIds : undefined,
      assign_all_students: assignTarget === "all_students" ? true : undefined,
    });
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={tracker ? `Assign Tracker: ${tracker.name}` : "Assign Tracker"}
        open={open}
        onClose={() => {
          resetForm();
          onClose();
        }}
        width={640}
      >
        {assignmentsError ? (
          <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-700">
            Could not load current tracker assignments.
          </div>
        ) : null}

        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <div className="mb-1 text-xs font-semibold text-gray-500">Tracker</div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {tracker?.name ?? "Select a tracker"}
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs font-semibold text-gray-500">Assign To</div>
            <Select
              value={assignTarget}
              onChange={(value) => {
                const next = value as "class" | "student" | "year_group" | "all_students";
                setAssignTarget(next);
                setSelectedYearIds([]);
                setSelectedClassIds([]);
                setSelectedStudentClassIds([]);
                setSelectedStudentIds([]);
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
                onChange={(values) => setSelectedClassIds((values as number[]).map((v) => Number(v)))}
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
                  onChange={(values) => setSelectedStudentIds((values as number[]).map((v) => Number(v)))}
                  options={classStudents.map((student) => ({
                    value: student.id,
                    label: student.student_name,
                  }))}
                  style={{ width: "100%" }}
                  placeholder={selectedStudentClassIds.length > 0 ? "Select one or more students" : "Select classes first"}
                  disabled={selectedStudentClassIds.length === 0}
                />
              </div>
            </>
          ) : null}

          {assignTarget === "all_students" ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              This will assign the tracker to all students in your school.
            </div>
          ) : null}

          <Button type="primary" loading={assignMutation.isPending} onClick={handleAssign}>
            Assign
          </Button>

          <div className="border-t pt-4">
            <Typography.Text strong>Current assignments</Typography.Text>
            <div className="mt-2 grid gap-2">
              {currentAssignments.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="text-sm">
                    <div className="font-semibold">
                      {row.student_name ? `${row.student_name} (student)` : row.class_name || `Class ${row.class_id}`}
                    </div>
                    <div className="text-xs text-slate-500">{row.year_name || "Direct assignment"}</div>
                  </div>
                  <Button
                    danger
                    size="small"
                    loading={unassignMutation.isPending}
                    onClick={() =>
                      unassignMutation.mutate({
                        tracker_id: numericTrackerId,
                        class_id: row.student_id ? undefined : Number(row.class_id),
                        student_id: row.student_id ? Number(row.student_id) : undefined,
                      })
                    }
                  >
                    Unassign
                  </Button>
                </div>
              ))}
              {currentAssignments.length === 0 ? (
                <div className="text-xs text-slate-500">No assignments found.</div>
              ) : null}
            </div>
          </div>
        </Space>
      </Drawer>
    </>
  );
}
