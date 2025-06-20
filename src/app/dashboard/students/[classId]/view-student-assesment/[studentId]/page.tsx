"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Card, Select, Spin } from "antd";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import AssessmentDrawer from "@/components/ui/AssessmentDrawer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchAssessment,
  fetchStudents,
  fetchTerm,
} from "@/services/api";

export default function TermPage() {
  const { classId, studentId } = useParams();
  const router = useRouter();
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  const loadAssessment = async (termId: number) => {
    try {
      setLoading(true);
      const data = await fetchAssessment(termId);
      console.log(data, "data");

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
    }
  }, [selectedTermId]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const response = await fetchTerm(classId);
      setTerms(response);
      if (response.length > 0) {
        setSelectedTerm(response[0].name);
        setSelectedTermId(response[0].id);
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
    loadTerms();
  }, [classId]);

  const handleOpenDrawer = (assessment: any) => {
    if (assessment.type === "quiz") {
      router.push(`/dashboard/students/${classId}/view-student-assesment/${studentId}/quiz/${assessment.quiz.id}`);
    } else {
      router.push(`/dashboard/students/${classId}/view-student-assesment/${studentId}/assesment-tasks/${assessment.id}`);
    }
  };
 
  const handleTermChange = (termId: number) => {
    const term = terms.find((t) => t.id === termId);
    if (term) {
      setSelectedTerm(term.name);
      setSelectedTermId(termId);
    }
  };


  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <Button
        icon={<ChevronLeft />}
        onClick={() => router.back()}
        className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100"
      >
        Back to Students
      </Button>

      {/* Ant Design Stepper */}
      <div className="max-w-xs mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Term
          </label>
          <Select
            value={selectedTerm}
            onChange={handleTermChange}
            placeholder="Select term"
            style={{ width: "100%" }}
          >
            {terms.map((term) => (
              <Select.Option key={term.id} value={term.id}>
                {term.name}
              </Select.Option>
            ))}
          </Select>
      </div>

      {/* Current Term Display */}
      <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {selectedTerm || "Select a term"}
        </h3>
        <h4 className="mt-3 font-medium text-gray-800">Assesments</h4>
        <ul className="mt-2">
          {assessments?.map((assessment, index) => (
            <li key={index} className="border-b pb-4 mb-4">
              <div className="flex flex-col md:flex-row justify-between gap-2 items-center py-2">
                <button
                  className="text-gray-700 cursor-pointer hover:underline font-medium"
                  onClick={() => handleOpenDrawer(assessment)}
                >
                  {assessment.name ||  assessment?.quiz?.name || "Untitled Assessment"}
                </button>
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{assessment?.type}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Drawer for Marking Assessments */}
      {/* <AssessmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedSubject={selectedSubject}
      /> */}
    </div>
  );
}
