"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, Select, Button } from "antd";
import { ChevronLeft } from "lucide-react";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTrackers } from "@/services/trackersApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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
  const [years, setYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

  const [yearsLoading, setYearsLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [trackersLoading, setTrackersLoading] = useState(false);

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

  const loadYears = async () => {
  try {
    setYearsLoading(true);
    let yearsData: any[] = [];

    if (isTeacher) {
      const res = await fetchAssignYears();
      const years = res
        .map((item: any) => item?.classes?.year)
        .filter((year: any) => year);

      yearsData = Array.from(
        new Map(years?.map((year: any) => [year.id, year])).values()
      );
    } else {
      const res = await fetchYearsBySchool(schoolId);
      yearsData = res;
    }
    setYears(yearsData);
    if (yearsData.length > 0) {
      setSelectedYear(yearsData[0].id.toString());
    }
  } catch (err) {
    setError("Failed to load years");
    console.error(err);
  } finally {
    setYearsLoading(false);
  }
};

const loadClasses = async (yearId: string) => {
    let classesData: any[] = [];
    try {
      setClassesLoading(true);

      if (isTeacher) {
        const res = await fetchAssignYears();

        classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);

        classesData = Array.from(
          new Map(classesData?.map((cls: any) => [cls.id, cls])).values()
        );

        if (yearId) {
          classesData = classesData?.filter(
            (cls: any) => cls.year_id === Number(yearId)
          );
        }
      } else {
        if (!yearId) {
          setError("Year parameter is missing in URL");
          return;
        }
        classesData = await fetchClasses(yearId);
      }

      setClasses(classesData);

      if (classesData.length > 0) {
        setSelectedClass(classesData[0].id.toString());
      }

    } catch (err) {
      setError("Failed to fetch classes");
      console.error(err);
    } finally {
      setClassesLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadClasses(selectedYear);
    }
  }, [selectedYear]);

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

  if (trackersLoading && years.length === 0) {
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
              options={years?.map((item) => ({
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
