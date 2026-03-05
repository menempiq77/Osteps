"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb, Button, Select, Spin, message } from "antd";
import Link from "next/link";
import { fetchClasses } from "@/services/classesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { addTerm, fetchTerm } from "@/services/termsApi";
import { assignAssessmentToTerm, unassignAssessmentFromTerm } from "@/services/api";
import { useSubjectContext } from "@/contexts/SubjectContext";

export default function AssignAssessmentPage() {
  const { assesmentId } = useParams<{ assesmentId: string }>();

  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [generatingTerms, setGeneratingTerms] = useState(false);

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();

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
      const safeYears = Array.isArray(yearsData) ? yearsData : [];
      setYears(safeYears);
      if (safeYears.length > 0) {
        setSelectedYear(safeYears[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to load years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!schoolId) return;
    if (canUseSubjectContext && !activeSubjectId) return;
    loadYears();
  }, [schoolId, activeSubjectId, canUseSubjectContext]);

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

  const classList = useMemo(() => (Array.isArray(classes) ? classes : []), [classes]);

  useEffect(() => {
    if (!selectedClass && classList.length > 0) {
      setSelectedClass(String(classList[0].id));
    }
  }, [classList, selectedClass]);

  /** Fetch terms for selected class */
  const {
    data: terms = [],
    isLoading: termsLoading,
  } = useQuery({
    queryKey: ["terms", selectedClass, assesmentId, activeSubjectId ?? "legacy"],
    queryFn: () => fetchTerm(Number(selectedClass)),
    enabled: !!selectedClass,
  });

  const termList = useMemo(() => (Array.isArray(terms) ? terms : []), [terms]);

  const selectedClassRecord = classList.find(
    (cls: any) => String(cls.id) === String(selectedClass)
  );

  const resolveClassTermCount = (value: unknown): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const normalized = String(value ?? "").trim().toLowerCase();
    if (normalized === "two") return 2;
    if (normalized === "three") return 3;
    const parsed = Number(normalized);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    return 0;
  };

  const configuredTermCount = useMemo(
    () => resolveClassTermCount(selectedClassRecord?.number_of_terms),
    [selectedClassRecord]
  );

  const visibleTerms = useMemo(() => {
    const sorted = [...termList].sort((a: any, b: any) => Number(a?.id ?? 0) - Number(b?.id ?? 0));
    if (configuredTermCount > 0) {
      return sorted.slice(0, configuredTermCount);
    }
    return sorted;
  }, [termList, configuredTermCount]);

  const handleGenerateDefaultTerms = async () => {
    if (!selectedClassRecord) return;
    const totalTerms = configuredTermCount > 0 ? configuredTermCount : 3;
    const missingCount = Math.max(0, totalTerms - termList.length);
    if (missingCount === 0) {
      messageApi.info("Terms already match this class setup.");
      return;
    }

    try {
      setGeneratingTerms(true);
      for (let i = termList.length + 1; i <= totalTerms; i++) {
        await addTerm(Number(selectedClassRecord.id), { name: `Term ${i}` });
      }
      await queryClient.invalidateQueries({
        queryKey: ["terms", selectedClass, assesmentId, activeSubjectId ?? "legacy"],
      });
      messageApi.success(`Created ${missingCount} missing term(s) for ${selectedClassRecord.class_name}`);
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to generate terms");
    } finally {
      setGeneratingTerms(false);
    }
  };

  const handleAssignTerm = async (termId: number) => {
    try {
      await assignAssessmentToTerm(Number(assesmentId), termId);
      messageApi.success("Assessment assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["terms", selectedClass, assesmentId, activeSubjectId ?? "legacy"] });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to assign assessment");
    }
  };

  const handleUnassignTerm = async (termId: number) => {
    try {
      await unassignAssessmentFromTerm(Number(assesmentId), termId);
      messageApi.success("Assessment unassigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["terms", selectedClass, assesmentId, activeSubjectId ?? "legacy"] });
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
          { title: <Link href="/dashboard/all_assesments">All Assessments</Link> },
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
            {classList.map((cls: any) => (
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
            <tr className="bg-gray-50 text-center text-xs md:text-sm font-semibold text-gray-700">
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
            ) : visibleTerms.length > 0 ? (
              visibleTerms.map((term: any, index: number) => {
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
                  <div className="flex flex-col items-center gap-3">
                    <span>No terms found.</span>
                    <Button
                      type="default"
                      size="small"
                      loading={generatingTerms}
                      onClick={handleGenerateDefaultTerms}
                      disabled={!selectedClassRecord}
                    >
                      Generate default terms
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
