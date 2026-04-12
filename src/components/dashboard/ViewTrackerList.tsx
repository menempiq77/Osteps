"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, Select, Button } from "antd";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTrackers } from "@/services/trackersApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import Link from "next/link";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";

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
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext, loading: subjectContextLoading } = useSubjectContext();
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

  const [trackersLoading, setTrackersLoading] = useState(false);

  // ── Years (subject-filtered) ──────────────────────────────────────────────
  const yearsQueryKey = canUseSubjectContext
    ? ["vt-years", "subject", activeSubjectId, schoolId]
    : isTeacher
    ? ["vt-years", "teacher", schoolId]
    : ["vt-years", "school", schoolId];

  const { data: years = [], isLoading: yearsLoading } = useQuery({
    queryKey: yearsQueryKey,
    queryFn: async () => {
      if (canUseSubjectContext && activeSubjectId) {
        const [schoolYears, subjectClasses] = await Promise.all([
          fetchYearsBySchool(schoolId),
          fetchSubjectClasses({ subject_id: Number(activeSubjectId) }),
        ]);
        const allowedYearIds = new Set(
          (Array.isArray(subjectClasses) ? subjectClasses : [])
            .map((item: any) =>
              Number(item?.year_id ?? item?.class?.year_id ?? item?.base_class?.year_id ?? 0)
            )
            .filter((id: number) => Number.isFinite(id) && id > 0)
        );
        return (Array.isArray(schoolYears) ? schoolYears : []).filter((year: any) =>
          allowedYearIds.has(Number(year?.id))
        );
      }
      if (isTeacher) {
        const res = await fetchAssignYears();
        const rawYears = res
          .map((item: any) => item?.classes?.year)
          .filter((year: any) => year);
        return Array.from(new Map(rawYears.map((y: any) => [y.id, y])).values());
      }
      return await fetchYearsBySchool(schoolId);
    },
    enabled: !subjectContextLoading && !(canUseSubjectContext && !activeSubjectId),
    staleTime: 5 * 60 * 1000,
  });

  // Sync selectedYear when years data arrives
  useEffect(() => {
    if (!years || years.length === 0) { setSelectedYear(undefined); return; }
    setSelectedYear((prev) => {
      const stillValid = prev && (years as any[]).some((y: any) => String(y.id) === prev);
      return stillValid ? prev : String((years as any[])[0].id);
    });
  }, [years]);

  // ── Classes (subject-filtered) ────────────────────────────────────────────
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["vt-classes", selectedYear, canUseSubjectContext, activeSubjectId, isTeacher],
    queryFn: async () => {
      if (!selectedYear) return [];
      if (canUseSubjectContext && activeSubjectId) {
        const subjectClasses = await fetchSubjectClasses({
          subject_id: Number(activeSubjectId),
          year_id: Number(selectedYear),
        });
        return await Promise.all(
          (Array.isArray(subjectClasses) ? subjectClasses : []).map(async (row: any) => {
            const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
              row,
              Number(activeSubjectId)
            );
            return {
              id: String(linkedClassId || row?.id || ""),
              class_name: String(row?.base_class_label ?? row?.name ?? `Class ${row?.id ?? ""}`),
              year_id: Number(row?.year_id ?? 0),
            };
          })
        );
      }
      if (isTeacher) {
        const res = await fetchAssignYears();
        let classesData = res.map((item: any) => item.classes).filter((cls: any) => cls);
        classesData = Array.from(new Map(classesData.map((cls: any) => [cls.id, cls])).values());
        return classesData.filter((cls: any) => cls.year_id === Number(selectedYear));
      }
      return await fetchClasses(selectedYear);
    },
    enabled: !!selectedYear,
    staleTime: 5 * 60 * 1000,
  });

  // Sync selectedClass when classes data arrives
  useEffect(() => {
    if (!classes || (classes as any[]).length === 0) { setSelectedClass(undefined); return; }
    setSelectedClass((prev) => {
      const stillValid = prev && (classes as any[]).some((c: any) => String(c.id) === prev);
      return stillValid ? prev : String((classes as any[])[0].id);
    });
  }, [classes]);

  const loadTrackers = async () => {
    if (!selectedClass) return;
    try {
      setTrackersLoading(true);
      const data = await fetchTrackers(Number(selectedClass));
      setTrackers(
        data.map((tracker: any) => ({
          ...tracker,
          id: tracker.id.toString(),
          trackerName: tracker?.tracker?.name ?? tracker?.name ?? "Untitled Tracker",
          trackerStatus: tracker?.tracker?.status ?? tracker?.status ?? "pending",
          deadline:
            tracker?.tracker?.deadline ??
            tracker?.tracker?.deadline_at ??
            tracker?.tracker?.deadline_date ??
            tracker?.tracker?.last_updated ??
            tracker?.deadline ??
            tracker?.deadline_at ??
            tracker?.deadline_date ??
            tracker?.last_updated ??
            null,
        }))
      );
    } catch (err) {
      setError("Failed to fetch trackers");
      console.error(err);
    } finally {
      setTrackersLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadTrackers();
    }
  }, [selectedClass]);

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
    router.push(`/dashboard/viewtrackers/${selectedClass}/${trackerId}`);
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
              value={selectedYear}
              placeholder="Select Year"
              onChange={(value) => setSelectedYear(value)}
              className="w-full"
              loading={yearsLoading}
              options={(years as any[])?.map((item: any) => ({
                value: item.id.toString(),
                label: item.name,
              }))}
            />
          </div>

          <div className="w-full min-w-[120px] lg:min-w-xs">
            <Select
              id="class-select"
              value={selectedClass}
              placeholder="Select Class"
              onChange={(value) => setSelectedClass(value)}
              className="w-full"
              options={classes?.map((cls) => ({
                value: cls.id.toString(),
                label: cls.class_name,
              }))}
              loading={classes.length === 0 && !!selectedYear}
            />
          </div>
        </div>
      </div>

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
                    {selectedClass
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
