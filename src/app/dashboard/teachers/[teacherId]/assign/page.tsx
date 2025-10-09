"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb, Button, Select, Spin, message } from "antd";
import Link from "next/link";
import { fetchClasses } from "@/services/classesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { assignTeacherToClass, unassignTeacherFromClass } from "@/services/teacherApi";

export default function AssignTeacherPage() {
  const { teacherId } = useParams<{ teacherId: string }>();
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
        return await fetchClasses(selectedYear as string);
      }
    },
    enabled: !!selectedYear,
  });

  const handleAssignClass = async (classId: number) => {
    try {
      await assignTeacherToClass(Number(teacherId), classId);
      messageApi.success("Teacher assigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["classes", selectedYear, isTeacher],
      });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to assign teacher");
    }
  };

  const handleUnassignClass = async (classId: number) => {
    try {
      await unassignTeacherFromClass(Number(teacherId), classId);
      messageApi.success("Teacher unassigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["classes", selectedYear, isTeacher],
      });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to unassign teacher");
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
          { title: <Link href="/dashboard/teachers">All Teacher</Link> },
          { title: <span>Assign Teacher</span> },
        ]}
        className="!mb-4"
      />

      <h1 className="text-2xl font-bold mb-4">Assign Teacher to Classes</h1>

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
              <Select.Option key={year.id} value={year.id.toString()}>
                {year.name}
              </Select.Option>
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
              classes.map((cls: any, index: number) => {
                // pick the status of the teacher for this class (if any)
                const status =
                    cls.assigned_teachers?.find(
                      (t: any) => t.teacher_id === Number(teacherId)
                    )?.status || "N/A";

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
