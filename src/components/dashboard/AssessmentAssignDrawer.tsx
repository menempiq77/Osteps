"use client";
import { useEffect, useMemo, useState } from "react";
import { Drawer, Button, Select, Spin, message } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchClasses } from "@/services/classesApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addTerm, fetchTerm } from "@/services/termsApi";
import { assignAssessmentToTerm, unassignAssessmentFromTerm } from "@/services/api";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";

interface AssessmentAssignDrawerProps {
  assessmentId: string | null;
  assessmentName?: string;
  open: boolean;
  onClose: () => void;
}

const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, " ").trim();

export default function AssessmentAssignDrawer({
  assessmentId,
  assessmentName,
  open,
  onClose,
}: AssessmentAssignDrawerProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [generatingTerms, setGeneratingTerms] = useState(false);

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();
  const queryClient = useQueryClient();

  // Reset selections when drawer opens
  useEffect(() => {
    if (open) {
      setSelectedYear(null);
      setSelectedClass(null);
    }
  }, [open]);

  // Fetch all classes (subject-filtered)
  const {
    data: allClasses = [],
    isLoading: classesLoading,
  } = useQuery({
    queryKey: ["assessment-assign-all-classes", schoolId, isTeacher, activeSubjectId ?? "legacy"],
    queryFn: async () => {
      if (!schoolId) return [];

      let fetched: any[] = [];

      if (isTeacher) {
        const res = await fetchAssignYears();
        const rawClasses = res.map((item: any) => item.classes).filter(Boolean);
        const unique = Array.from(new Map(rawClasses.map((c: any) => [c.id, c])).values());
        fetched = unique.map((c: any) => ({
          id: Number(c.id),
          year_id: Number(c.year_id ?? c.year?.id ?? 0) || undefined,
          class_name: c.class_name ?? c.name ?? `Class ${c.id}`,
          year_name: c.year?.name,
          number_of_terms: c.number_of_terms,
        }));
      } else {
        const years: any[] = (await fetchYearsBySchool(Number(schoolId))) ?? [];
        const classArrays = await Promise.all(
          years.map((y: any) => fetchClasses(String(y.id)).catch(() => []))
        );
        fetched = classArrays.flat().map((c: any) => ({
          id: Number(c.id),
          year_id: Number(c.year_id ?? 0) || undefined,
          class_name: c.class_name ?? c.name ?? `Class ${c.id}`,
          year_name: years.find((y: any) => String(y.id) === String(c.year_id))?.name,
          number_of_terms: c.number_of_terms,
        }));
        console.log("[AssignDrawer] raw classes from API:", classArrays.flat().map((c: any) => ({ id: c.id, class_name: c.class_name, number_of_terms: c.number_of_terms })));
      }

      // Filter by subject
      const subjectId = canUseSubjectContext ? activeSubjectId : null;
      if (subjectId) {
        try {
          const subjectClassRows = (await fetchSubjectClasses({ subject_id: Number(subjectId) })) ?? [];
          const directIds = new Set<number>();
          const labelKeys = new Set<string>();

          for (const sc of subjectClassRows as any[]) {
            const directId = Number(sc.class_id ?? sc.base_class_id ?? sc.class?.id ?? sc.classes?.id ?? 0);
            if (directId > 0) { directIds.add(directId); continue; }
            const yearId = Number(sc.year_id ?? 0);
            const label = normalize(String(sc.base_class_label ?? sc.name ?? ""));
            if (yearId > 0 && label) labelKeys.add(`${yearId}::${label}`);
          }

          if (directIds.size > 0 || labelKeys.size > 0) {
            fetched = fetched.filter((cls) => {
              if (directIds.has(cls.id)) return true;
              const key = `${cls.year_id}::${normalize(cls.class_name)}`;
              return labelKeys.has(key);
            });
          }
        } catch {
          // fallback: show all classes
        }
      }

      return fetched;
    },
    enabled: open && !!schoolId && (!canUseSubjectContext || !!activeSubjectId),
    gcTime: 0,
  });

  // Derive year options from the filtered class list
  const yearOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const cls of allClasses) {
      if (cls.year_id) {
        map.set(Number(cls.year_id), cls.year_name ?? `Year ${cls.year_id}`);
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id: String(id), name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allClasses]);

  // Auto-select first year once options are available
  useEffect(() => {
    if (!selectedYear && yearOptions.length > 0) {
      setSelectedYear(yearOptions[0].id);
    }
  }, [yearOptions, selectedYear]);

  // Classes for the selected year
  const classList = useMemo(() => {
    if (!selectedYear) return [];
    return allClasses.filter((c) => String(c.year_id) === selectedYear);
  }, [allClasses, selectedYear]);

  // Auto-select first class when year changes
  useEffect(() => {
    setSelectedClass(null);
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedClass && classList.length > 0) {
      setSelectedClass(String(classList[0].id));
    }
  }, [classList, selectedClass]);

  // Fetch terms for selected class
  const {
    data: terms = [],
    isLoading: termsLoading,
  } = useQuery({
    queryKey: ["assign-drawer-terms", selectedClass, assessmentId, activeSubjectId ?? "legacy"],
    queryFn: () => fetchTerm(Number(selectedClass)),
    enabled: !!selectedClass && open,
    gcTime: 0,
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
    console.log("[AssignDrawer] selectedClass:", selectedClass, "number_of_terms raw:", selectedClassRecord?.number_of_terms, "configuredTermCount:", configuredTermCount, "total terms:", sorted.length);
    return configuredTermCount > 0 ? sorted.slice(0, configuredTermCount) : sorted;
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
        queryKey: ["assign-drawer-terms", selectedClass, assessmentId, activeSubjectId ?? "legacy"],
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
      await assignAssessmentToTerm(Number(assessmentId), termId);
      messageApi.success("Assessment assigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["assign-drawer-terms", selectedClass, assessmentId, activeSubjectId ?? "legacy"],
      });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to assign assessment");
    }
  };

  const handleUnassignTerm = async (termId: number) => {
    try {
      await unassignAssessmentFromTerm(Number(assessmentId), termId);
      messageApi.success("Assessment unassigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["assign-drawer-terms", selectedClass, assessmentId, activeSubjectId ?? "legacy"],
      });
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to unassign assessment");
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          <div>
            <p className="text-xs font-normal text-gray-400 mb-0.5">Assign Assessment</p>
            <p className="text-base font-semibold text-gray-800 leading-tight">
              {assessmentName || "Assessment"}
            </p>
          </div>
        }
        placement="right"
        width={520}
        open={open}
        onClose={onClose}
        destroyOnClose
      >
        {classesLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Year + Class selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                <Select
                  value={selectedYear || undefined}
                  onChange={(value) => setSelectedYear(value)}
                  className="w-full"
                  placeholder="Select Year"
                >
                  {yearOptions.map((y) => (
                    <Select.Option key={y.id} value={y.id}>
                      {y.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
                <Select
                  value={selectedClass || undefined}
                  onChange={(value) => setSelectedClass(value)}
                  className="w-full"
                  placeholder="Select Class"
                  disabled={!selectedYear || classList.length === 0}
                >
                  {classList.map((cls: any) => (
                    <Select.Option key={cls.id} value={String(cls.id)}>
                      {cls.class_name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Terms */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Terms</p>

              {!selectedClass ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Select a class to see terms
                </p>
              ) : termsLoading ? (
                <div className="flex justify-center py-8">
                  <Spin />
                </div>
              ) : visibleTerms.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {visibleTerms.map((term: any, index: number) => {
                    const assigned = !!term.assign_assessments?.find(
                      (a: any) => a.assessment_id === Number(assessmentId)
                    );

                    return (
                      <div
                        key={term.id}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                          assigned
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">
                            Term {index + 1}
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {term.name}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {assigned ? (
                            <>
                              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                Assigned
                              </span>
                              <Button
                                danger
                                size="small"
                                onClick={() => handleUnassignTerm(term.id)}
                              >
                                Unassign
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleAssignTerm(term.id)}
                            >
                              Assign
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <p className="text-sm text-gray-500">No terms found for this class.</p>
                  <Button
                    type="default"
                    size="small"
                    loading={generatingTerms}
                    disabled={!selectedClassRecord}
                    onClick={handleGenerateDefaultTerms}
                  >
                    Generate default terms
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}

