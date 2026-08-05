"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spin, Select, Button } from "antd";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTrackers } from "@/services/trackersApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import {
  buildTeacherAssignedClassOptions,
  buildYearOptionsFromTeacherClasses,
  filterTeacherClassesByYear,
} from "@/lib/teacherAssignedClasses";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import Link from "next/link";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";
import {
  BUILT_IN_TRACKERS,
  supportsBuiltInTrackers,
} from "@/lib/builtinTrackers";
import { asRecord } from "@/lib/safeRecord";

type YearOption = {
  id: string;
  name: string;
};

type ClassOption = {
  id: string;
  class_name: string;
  year_id?: number;
};

const buildYearsFromSubjectClasses = (subjectClasses: Record<string, unknown>[], schoolYears: Record<string, unknown>[] = []) => {
  const schoolYearById = new Map<number, Record<string, unknown>>();
  for (const year of Array.isArray(schoolYears) ? schoolYears : []) {
    const id = Number(asRecord(year)?.id);
    if (Number.isFinite(id) && id > 0) {
      schoolYearById.set(id, asRecord(year) ?? {});
    }
  }
  const yearsById = new Map<number, YearOption>();

  (Array.isArray(subjectClasses) ? subjectClasses : []).forEach((item) => {
    const record = asRecord(item);
    const yearRecord = asRecord(record?.year ?? record?.class ?? record?.base_class)?.year;
    const yearId = Number(
      record?.year_id ??
        asRecord(record?.year)?.id ??
        asRecord(record?.class)?.year_id ??
        asRecord(asRecord(record?.class)?.year)?.id ??
        asRecord(record?.base_class)?.year_id ??
        asRecord(asRecord(record?.base_class)?.year)?.id ??
        0
    );
    if (!Number.isFinite(yearId) || yearId <= 0 || yearsById.has(yearId)) return;

    const schoolYear = schoolYearById.get(yearId);
    yearsById.set(yearId, {
      id: String(yearId),
      name:
        String(asRecord(schoolYear)?.name ?? "") ||
        String(asRecord(record?.year)?.name ?? "") ||
        String(asRecord(yearRecord)?.name ?? "") ||
        `Year ${yearId}`,
    });
  });

  return Array.from(yearsById.values()).sort((left, right) => Number(left.id) - Number(right.id));
};

type Tracker = {
  id: string;
  class_id: number;
  name: string;
  type: string;
  status: string;
  progress: string[];
  deadline?: string | null;
  tracker?: {
    id?: number | string;
    name?: string;
    status?: string;
  };
  tracker_id?: number | string;
  trackerName?: string;
  trackerStatus?: string;
};

export default function TrackerList() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, activeSubject, canUseSubjectContext, loading: subjectContextLoading } = useSubjectContext();
  const roleKey = String(currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isTeacher = roleKey === "TEACHER";
  const schoolId = currentUser?.school;
  const showBuiltInFolder =
    canUseSubjectContext &&
    !!activeSubjectId &&
    supportsBuiltInTrackers(activeSubject?.name);
  const builtInLessonCount = BUILT_IN_TRACKERS.reduce(
    (total, tracker) => total + tracker.lessons.length,
    0
  );



  // ── Years (subject-filtered) ──────────────────────────────────────────────
  const yearsQueryKey = canUseSubjectContext
    ? ["vt-years", "subject", activeSubjectId, schoolId]
    : isTeacher
    ? ["vt-years", "teacher", schoolId]
    : ["vt-years", "school", schoolId];

  const { data: years = [], isLoading: yearsLoading } = useQuery<YearOption[]>({
    queryKey: yearsQueryKey,
    queryFn: async () => {
      if (canUseSubjectContext && activeSubjectId) {
        const [subjectClasses, assignedYears] = await Promise.all([
          fetchSubjectClasses({ subject_id: Number(activeSubjectId) }).catch(() => []),
          isTeacher ? fetchAssignYears().catch(() => []) : Promise.resolve([]),
        ]);
        if (isTeacher) {
          const teacherClasses = buildTeacherAssignedClassOptions(assignedYears, subjectClasses);
          const teacherYears = buildYearOptionsFromTeacherClasses(teacherClasses);
          if (teacherYears.length > 0) return teacherYears;
        }
        let schoolYears: Record<string, unknown>[] = [];
        const numericSchoolId = Number(schoolId);
        if (Number.isFinite(numericSchoolId) && numericSchoolId > 0) {
          schoolYears = await fetchYearsBySchool(numericSchoolId).catch(() => []);
        }
        const subjectClassYears = buildYearsFromSubjectClasses(subjectClasses, schoolYears);
        return subjectClassYears;
      }
      if (isTeacher) {
        const teacherClasses = buildTeacherAssignedClassOptions(await fetchAssignYears());
        return buildYearOptionsFromTeacherClasses(teacherClasses);
      }
      return await fetchYearsBySchool(Number(schoolId));
    },
    enabled: !subjectContextLoading && !(canUseSubjectContext && !activeSubjectId),
    staleTime: 5 * 60 * 1000,
  });

  const effectiveSelectedYear = selectedYear ?? (years[0]?.id ? String(years[0].id) : undefined);

  // ── Classes (subject-filtered) ────────────────────────────────────────────
  const { data: classes = [], isLoading: classesLoading } = useQuery<ClassOption[]>({
    queryKey: ["vt-classes", effectiveSelectedYear, canUseSubjectContext, activeSubjectId, isTeacher],
    queryFn: async () => {
      if (!effectiveSelectedYear) return [];
      if (canUseSubjectContext && activeSubjectId) {
        const [subjectClasses, assignedYears] = await Promise.all([
          fetchSubjectClasses({
            subject_id: Number(activeSubjectId),
            year_id: Number(effectiveSelectedYear),
          }).catch(() => []),
          isTeacher ? fetchAssignYears().catch(() => []) : Promise.resolve([]),
        ]);
        if (isTeacher) {
          const teacherClasses = filterTeacherClassesByYear(
            buildTeacherAssignedClassOptions(assignedYears, subjectClasses),
            effectiveSelectedYear
          );
          if (teacherClasses.length > 0) {
            return teacherClasses;
          }
        }
        if (!Array.isArray(subjectClasses) || subjectClasses.length === 0) {
          return [];
        }
        return await Promise.all(
          (Array.isArray(subjectClasses) ? subjectClasses : []).map(async (row: unknown) => {
            const rowRecord = asRecord(row);
            const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
              row as Parameters<typeof resolveSubjectClassLinkedIdWithFallback>[0],
              Number(activeSubjectId)
            );
            return {
              id: String(linkedClassId || rowRecord?.id || ""),
              class_name: String(rowRecord?.base_class_label ?? rowRecord?.name ?? `Class ${rowRecord?.id ?? ""}`),
              year_id: Number(rowRecord?.year_id ?? 0),
            } as ClassOption;
          })
        );
      }
      if (isTeacher) {
        return filterTeacherClassesByYear(
          buildTeacherAssignedClassOptions(await fetchAssignYears()),
          effectiveSelectedYear
        );
      }
      return await fetchClasses(effectiveSelectedYear);
    },
    enabled: !!effectiveSelectedYear,
    staleTime: 5 * 60 * 1000,
  });

  const effectiveSelectedClass = selectedClass ?? (classes[0]?.id ? String(classes[0].id) : undefined);

  const { data: trackers = [] } = useQuery<Tracker[]>({
    queryKey: ["view-trackers", effectiveSelectedClass],
    queryFn: async () => {
      const data = await fetchTrackers(Number(effectiveSelectedClass));
      return (data as Record<string, unknown>[]).map((tracker) => {
        const record = asRecord(tracker.tracker);
        return {
          ...tracker,
          id: String(tracker.id),
          trackerName: record?.name ?? tracker.name ?? "Untitled Tracker",
          trackerStatus: record?.status ?? tracker.status ?? "pending",
          deadline:
            record?.deadline ??
            record?.deadline_at ??
            record?.deadline_date ??
            record?.last_updated ??
            tracker.deadline ??
            tracker.deadline_at ??
            tracker.deadline_date ??
            tracker.last_updated ??
            null,
        } as Tracker;
      });
    },
    enabled: !!effectiveSelectedClass,
    staleTime: 5 * 60 * 1000,
  });

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "paused":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "completed":
        return "bg-sky-100 text-sky-800 border border-sky-200";
      case "pending":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const handleTrackerClick = (trackerId: string) => {
    router.push(`/dashboard/viewtrackers/${effectiveSelectedClass}/${trackerId}`);
  };

  if (subjectContextLoading || yearsLoading || (canUseSubjectContext && !activeSubjectId)) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="premium-page rounded-2xl p-3 md:p-4">
      <Link href="/dashboard">
        <Button
          icon={<ChevronLeft />}
          className="premium-pill-btn text-gray-700 border border-gray-300 hover:bg-gray-100 mb-4"
        >
          Back to Dashboard
        </Button>
      </Link>

      <div className="premium-hero flex items-center justify-between mb-6 px-4 py-3 rounded-xl">
        <h1 className="text-2xl font-bold">Trackers</h1>
        <div className="flex gap-4">
          <div className="w-full min-w-[120px] lg:min-w-xs">
            <Select
              id="year-select"
              value={effectiveSelectedYear}
              placeholder="Select Year"
              onChange={(value) => setSelectedYear(value)}
              className="w-full"
              loading={yearsLoading}
              options={years.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </div>

          <div className="w-full min-w-[120px] lg:min-w-xs">
            <Select
              id="class-select"
              value={effectiveSelectedClass}
              placeholder="Select Class"
              onChange={(value) => setSelectedClass(value)}
              className="w-full"
              options={classes?.map((cls) => ({
                value: cls.id.toString(),
                label: cls.class_name,
              }))}
              loading={classesLoading || (classes.length === 0 && !!effectiveSelectedYear)}
            />
          </div>
        </div>
      </div>

      {showBuiltInFolder && (
        <Link
          href={`/dashboard/built_in_trackers${
            activeSubjectId ? `?subject_id=${activeSubjectId}` : ""
          }`}
          className="group mb-4 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-4 text-white shadow-md transition hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
              📚
            </span>
            <div>
              <h3 className="text-base font-bold md:text-lg">
                Built-in Trackers
              </h3>
              <p className="text-xs text-emerald-50 md:text-sm">
                {builtInLessonCount} stories with quizzes — earn coins for every
                one you pass
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur transition group-hover:bg-white/30">
            Open folder
          </span>
        </Link>
      )}

      <div className="premium-card relative overflow-auto rounded-xl p-1">
        <div className="overflow-x-auto rounded-lg">
          <table className="premium-table min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-emerald-50 text-center text-xs md:text-sm font-semibold text-slate-700">
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Tracker Name
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Deadline
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3">Status</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {trackers?.length > 0 ? (
                trackers.map((tracker) => (
                  <tr
                    key={tracker.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-emerald-50 even:bg-emerald-50/40 odd:bg-white"
                  >
                    <td
                      onClick={() =>
                        handleTrackerClick(String(tracker.tracker_id ?? tracker.id))
                      }
                      className="p-2 md:p-4 cursor-pointer hover:underline text-black hover:text-black font-semibold"
                    >
                      <span className="inline-block max-w-[92%] truncate">
                        {tracker.trackerName}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 text-black" dir="ltr">
                      <DeadlineCountdown deadline={tracker.deadline} />
                    </td>
                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          tracker.trackerStatus || tracker.status
                        )}`}
                      >
                        {tracker.trackerStatus || tracker.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    {effectiveSelectedClass
                      ? "No trackers found."
                      : "Please select a class to view trackers."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
