"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Select, Spin } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/store/store";

import { fetchAssessment } from "@/services/api";
import { fetchTerm } from "@/services/termsApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";

interface CurrentUser {
  student?: string;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
  school?: string;
}

export default function StudentAssessmentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [terms, setTerms] = useState<any[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  const [assessments, setAssessments] = useState<any[]>([]);

  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };

  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

  /** ------------------ LOAD YEARS ------------------ */
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  /** ------------------ FETCH CLASSES ------------------ */
  const { data: classes = [], isLoading: classesLoading } = useQuery({
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

  /** ------------------ FETCH TERMS ------------------ */
  const loadTerms = async () => {
    try {
      setLoading(true);
      const response = await fetchTerm(selectedClass);
      setTerms(response);
      if (response.length > 0) {
        setSelectedTermId(response[0].id);
        setSelectedTerm(response[0].name);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load terms");
      console.error("Error loading terms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadTerms();
    } else {
      setTerms([]);
      setSelectedTermId(null);
      setSelectedTerm("");
    }
  }, [selectedClass]);

  /** ------------------ FETCH ASSESSMENTS ------------------ */
  const loadAssessment = async (termId: number) => {
    try {
      setLoading(true);
      const data = await fetchAssessment(termId);
      setAssessments(data);
      setError(null);
    } catch (err) {
      setError("Failed to load Assessment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTermId !== null) {
      loadAssessment(selectedTermId);
    } else {
      setAssessments([]);
    }
  }, [selectedTermId]);

  /** ------------------ HANDLERS ------------------ */
  const handleViewTasks = (assessment: any) => {
    router.push(`/dashboard/student_assesments/${assessment.id}?classId=${selectedClass}`);
  };

  const handleTermChange = (termId: number) => {
    const term = terms.find((t) => t.id === termId);
    if (term) {
      setSelectedTerm(term.name);
      setSelectedTermId(termId);
    }
  };

  /** ------------------ LOADING STATE ------------------ */
  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  /** ------------------ UI ------------------ */
  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>View Student Assessments</span>,
          },
        ]}
        className="!mb-6"
      />

      {/* FILTER SECTION */}
      <Card className="p-4 !mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Year Select */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Year
            </label>
            <Select
              value={selectedYear || undefined}
              onChange={(value) => {
                setSelectedYear(value);
                setSelectedClass(null);
                setTerms([]);
                setSelectedTerm("");
                setSelectedTermId(null);
              }}
              className="w-full"
              placeholder="Select Year"
            >
              {years?.map((year) => (
                <Select.Option key={year?.id} value={year?.id?.toString()}>
                  {year?.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Class Select */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Class
            </label>
            <Select
              value={selectedClass || undefined}
              onChange={(value) => {
                setSelectedClass(value);
                setTerms([]);
                setSelectedTerm("");
                setSelectedTermId(null);
              }}
              className="w-full"
              placeholder="Select Class"
              loading={classesLoading}
              disabled={!selectedYear}
            >
              {classes?.map((cls) => (
                <Select.Option key={cls?.id} value={cls?.id.toString()}>
                  {cls?.class_name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Term Select */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Term
            </label>
            <Select
              value={selectedTermId || undefined}
              onChange={(value) => handleTermChange(value)}
              className="w-full"
              placeholder="Select Term"
              disabled={!selectedClass}
            >
              {terms.map((term) => (
                <Select.Option key={term?.id} value={term?.id}>
                  {term?.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

  {/* ASSESSMENTS DISPLAY */}
<Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
  {/* Header Section */}
  <div className="flex items-center justify-between mb-5">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        {selectedTerm || "Select a Term"}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        View and manage all assessments for this term
      </p>
    </div>
    <div className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
      {assessments?.length || 0} Assessments
    </div>
  </div>

  {/* Assessments List */}
  <h4 className="font-semibold text-gray-800 mb-3">Assessments</h4>
  {assessments?.length > 0 ? (
    <ul className="space-y-3">
      {assessments?.map((assessment, index) => (
        <li
          key={index}
          className="group flex justify-between items-center bg-gray-50 hover:bg-primary/5 transition-all p-4 rounded-xl border border-transparent hover:border-primary/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-gray-800 font-medium group-hover:text-primary transition-colors cursor-pointer"
              onClick={() => handleViewTasks(assessment)}>
              {assessment?.name || "Untitled Assessment"}
            </span>
            {assessment?.date && (
              <span className="text-sm text-gray-500">
                • {new Date(assessment?.date).toLocaleDateString()}
              </span>
            )}
          </div>

          <button
            onClick={() => handleViewTasks(assessment)}
            className="text-sm text-primary font-medium cursor-pointer hover:underline transition"
          >
            View Tasks →
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <div className="flex items-center justify-center py-8">
      <p className="text-gray-500 text-sm">
        No assessments available for this term.
      </p>
    </div>
  )}
</Card>

    </div>
  );
}
