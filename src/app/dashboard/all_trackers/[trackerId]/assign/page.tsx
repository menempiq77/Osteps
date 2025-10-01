"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Button, Select, Spin, message } from "antd";
import Link from "next/link";
import { fetchClasses } from "@/services/classesApi"; // keep for later
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import {
  assignTrackerToClass,
  unassignTrackerFromClass,
} from "@/services/trackersApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ClassType = {
  id: number;
  name: string;
  class_name?: string;
  assign_trackers?: { status?: string }[];
};

export default function AssignTrackerPage() {
  const { trackerId } = useParams<{ trackerId: string }>();
  const router = useRouter();
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

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
  useEffect(() => {
    loadYears();
  }, []);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const queryClient = useQueryClient();

  const {
    data: classes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["classes", selectedYear, isTeacher],
    queryFn: async () => {
      if (!selectedYear) return [];
      if (isTeacher) {
        const res = await fetchAssignYears();
        let classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);

        classesData = Array.from(
          new Map(classesData.map((cls: any) => [cls.id, cls])).values()
        );

        return classesData.filter(
          (cls: any) => cls.year_id === Number(selectedYear)
        );
      } else {
        return await fetchClasses(Number(selectedYear));
      }
    },
    enabled: !!selectedYear,
  });

  const handleAssignClass = async (classId: number) => {
    try {
      await assignTrackerToClass(Number(trackerId), classId);
      messageApi.success("Tracker assigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["classes", selectedYear, isTeacher],
      });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to assign tracker");
    }
  };

  const handleUnassignClass = async (classId: number) => {
    try {
      await unassignTrackerFromClass(Number(trackerId), classId);
      messageApi.success("Tracker unassigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["classes", selectedYear, isTeacher],
      });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to unassign tracker");
    }
  };

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/all_trackers">All Trackers</Link> },
          { title: <span>Assign Tracker</span> },
        ]}
        className="!mb-4"
      />

      <h1 className="text-2xl font-bold mb-4">Assign Tracker to Classes</h1>

      <div className="overflow-x-auto rounded-lg px-1">
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Year
          </label>
          <Select
            value={selectedYear || undefined}
            onChange={handleYearChange}
            className="w-full max-w-xs"
            placeholder="All Years"
            allowClear
          >
            {years?.map((year) => (
              <Option key={year.id} value={year.id.toString()}>
                {year.name}
              </Option>
            ))}
          </Select>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
              <th className="p-2 md:p-4">
                <span className="block py-2 px-3 border-r border-gray-300">
                  S. No.
                </span>
              </th>
              <th className="p-2 md:p-4">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Class Name
                </span>
              </th>
              <th className="p-2 md:p-4">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Status
                </span>
              </th>
              <th className="p-2 md:p-4">
                <span className="block py-2 px-3">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.length > 0 ? (
              classes.map((cls, index) => {
                // pick the status of the tracker for this class (if any)
                const status = cls.assign_trackers?.[0]?.status || "N/A";

                return (
                  <tr
                    key={cls.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4 font-medium">{index + 1}</td>
                    <td className="p-2 md:p-4 font-medium">{cls.class_name}</td>
                    <td className="p-2 md:p-4 font-medium capitalize">
                      {status.replace("_", " ")}
                    </td>
                    <td className="p-2 md:p-4 space-x-2">
                      <Button
                        type="primary"
                        size="small"
                        disabled={status === "assigned"}
                        onClick={() => handleAssignClass(cls.id)}
                      >
                        Assign
                      </Button>
                      <Button
                        danger
                        size="small"
                        disabled={status !== "assigned"}
                        onClick={() => handleUnassignClass(cls.id)}
                      >
                        Unassign
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
