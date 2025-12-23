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

type Tracker = {
  id: string;
  class_id: number;
  name: string;
  type: string;
  status: string;
  progress: string[];
  lastUpdated?: string;
};

export default function TrackerList() {
  const router = useRouter();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [years, setYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

  const loadTrackers = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const data = await fetchTrackers(Number(selectedClass));
      setTrackers(
        data.map((tracker: any) => ({
          ...tracker,
          id: tracker.id.toString(),
          lastUpdated: new Date().toISOString().split("T")[0],
        }))
      );
    } catch (err) {
      setError("Failed to fetch trackers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadYears = async () => {
  try {
    setLoading(true);
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
    setLoading(false);
  }
};

const loadClasses = async (yearId: string) => {
    let classesData: any[] = [];
    try {
      setLoading(true);

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
      setLoading(false);
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
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTrackerClick = (trackerId: string) => {
    router.push(`/dashboard/viewtrackers/${selectedClass}/${trackerId}`);
  };

  if (loading && years.length === 0) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Link href="/dashboard">
        <Button
          icon={<ChevronLeft />}
          className="text-gray-700 border border-gray-300 hover:bg-gray-100 mb-4"
        >
          Back to Dashboard
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trackers</h1>
        <div className="flex gap-4">
          <div className="w-full min-w-[120px] lg:min-w-xs">
            <Select
              id="year-select"
              value={selectedYear}
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

      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Tracker Name
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Last Updated
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
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td
                      onClick={() =>
                        handleTrackerClick(tracker.tracker_id, tracker.type)
                      }
                      className="p-2 md:p-4 cursor-pointer hover:underline text-green-600 hover:text-green-800 font-medium"
                    >
                      {tracker?.tracker?.name}
                    </td>
                    <td className="p-2 md:p-4">{tracker.lastUpdated}</td>
                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          tracker.status
                        )}`}
                      >
                        {tracker?.tracker?.status}
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
    </>
  );
}
