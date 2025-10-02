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

import { fetchTerm } from "@/services/termsApi";
import { assignAssessmentToTerm, unassignAssessmentFromTerm } from "@/services/api";

export default function AssignAssessmentPage() {
  const { assesmentId } = useParams<{ assesmentId: string }>();
  console.log("assementId", assesmentId)
  
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

  const queryClient = useQueryClient();

  /** Load years */
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
      console.error(err);
      messageApi.error("Failed to load years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  /** Fetch classes for selected year */
  const {
    data: classes = [],
    isLoading: classesLoading,
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

  /** Fetch terms for selected class */
  const {
    data: terms = [],
    isLoading: termsLoading,
  } = useQuery({
    queryKey: ["terms", selectedClass, assesmentId],
    queryFn: () => fetchTerm(Number(selectedClass)),
    enabled: !!selectedClass,
  });

  const handleAssignTerm = async (termId: number) => {
    try {
      await assignAssessmentToTerm(Number(assesmentId), termId);
      messageApi.success("Assessment assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["terms", selectedClass, assesmentId] });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to assign assessment");
    }
  };

  const handleUnassignTerm = async (termId: number) => {
    try {
      await unassignAssessmentFromTerm(Number(assesmentId), termId);
      messageApi.success("Assessment unassigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["terms", selectedClass, assesmentId] });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to unassign assessment");
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
          { title: <Link href="/dashboard/all_assessments">All Assessments</Link> },
          { title: <span>Assign Assessment</span> },
        ]}
        className="!mb-4"
      />

      <h1 className="text-2xl font-bold mb-4">Assign Assessment to Terms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Year Select */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
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
            {years?.map((year) => (
              <Select.Option key={year.id} value={year.id.toString()}>
                {year.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Class Select */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Class
          </label>
          <Select
            value={selectedClass || undefined}
            onChange={(value) => setSelectedClass(value)}
            className="w-full"
            placeholder="Select Class"
            loading={classesLoading}
            disabled={!selectedYear}
          >
            {classes?.map((cls: any) => (
              <Select.Option key={cls.id} value={cls.id.toString()}>
                {cls.class_name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Terms Table */}
      <div className="overflow-x-auto rounded-lg px-1">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
              <th className="p-2 md:p-4">S. No.</th>
              <th className="p-2 md:p-4">Term Name</th>
              <th className="p-2 md:p-4">Status</th>
              <th className="p-2 md:p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {termsLoading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  <Spin />
                </td>
              </tr>
            ) : terms.length > 0 ? (
              terms.map((term: any, index: number) => {
                const status =
                  term.assign_assessments?.find(
                    (a: any) => a.assessment_id === Number(assesmentId)
                  )?.status || "N/A";

                return (
                  <tr
                    key={term.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4 font-medium">{index + 1}</td>
                    <td className="p-2 md:p-4 font-medium">{term.name}</td>
                    <td className="p-2 md:p-4 font-medium capitalize">
                      {status.replace("_", " ")}
                    </td>
                    <td className="p-2 md:p-4 space-x-2">
                      <Button
                        type="primary"
                        size="small"
                        disabled={status === "assigned"}
                        onClick={() => handleAssignTerm(term.id)}
                      >
                        Assign
                      </Button>
                      <Button
                        danger
                        size="small"
                        disabled={status !== "assigned"}
                        onClick={() => handleUnassignTerm(term.id)}
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
                  No terms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
