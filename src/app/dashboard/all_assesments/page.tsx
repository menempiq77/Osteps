"use client";
import React, { useEffect, useState } from "react";
import AddAssessmentForm from "@/components/dashboard/AddAssessmentForm";
import AllAssessmentList from "@/components/dashboard/AllAssessmentList";
import {
  addAssessment,
  deleteAssessment,
  deleteAssignTermQuiz,
  fetchSchoolAssessment,
  updateAssessment,
} from "@/services/api";
import { Breadcrumb, Button, Modal, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import EditAssessmentForm from "@/components/dashboard/EditAssessmentForm";
import { assignAssesmentQuiz, fetchQuizes } from "@/services/quizApi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";

interface Assessment {
  id: string;
  name: string;
  type: "assessment" | "quiz";
  term_id: string;
}

const ASSESSMENT_SUBJECT_MAP_KEY = "osteps_assessment_subject_map";
const QUIZ_SUBJECT_MAP_KEY = "osteps_quiz_subject_map";

function readQuizSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(QUIZ_SUBJECT_MAP_KEY) || "{}"); }
  catch { return {}; }
}

function filterQuizzesBySubject(quizzes: any[], subjectId: number): any[] {
  const map = readQuizSubjectMap();
  return quizzes.filter((q) => map[String(q.id)] === subjectId);
}

function readAssessmentSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(ASSESSMENT_SUBJECT_MAP_KEY) || "{}"); }
  catch { return {}; }
}

function tagAssessmentWithSubject(assessmentId: number | string, subjectId: number) {
  const map = readAssessmentSubjectMap();
  map[String(assessmentId)] = subjectId;
  if (typeof window !== "undefined") {
    localStorage.setItem(ASSESSMENT_SUBJECT_MAP_KEY, JSON.stringify(map));
  }
}

function untagAssessment(assessmentId: number | string) {
  const map = readAssessmentSubjectMap();
  delete map[String(assessmentId)];
  if (typeof window !== "undefined") {
    localStorage.setItem(ASSESSMENT_SUBJECT_MAP_KEY, JSON.stringify(map));
  }
}

function filterAssessmentsBySubject(assessments: Assessment[], subjectId: number): Assessment[] {
  const map = readAssessmentSubjectMap();
  return assessments.filter((a) => map[String(a.id)] === subjectId);
}

export default function Page() {
  const { termId, classId } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [rawAssessments, setRawAssessments] = useState<Assessment[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rawQuizzes, setRawQuizzes] = useState<any[]>([]);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(
    null
  );
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null
  );
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext, activeSubject } = useSubjectContext();
  const inSubjectContext = canUseSubjectContext && !!activeSubjectId;
  const assessments = inSubjectContext
    ? filterAssessmentsBySubject(rawAssessments, Number(activeSubjectId))
    : rawAssessments;
  const quizzes = inSubjectContext
    ? filterQuizzesBySubject(rawQuizzes, Number(activeSubjectId))
    : rawQuizzes;
  const isTeacher = currentUser?.role === "TEACHER";
  const normalizedTermId = typeof termId === "string" ? termId : "";
  const schoolIdNum = Number(currentUser?.school ?? 0);
  const isContextReady = schoolIdNum > 0 && (!canUseSubjectContext || !!activeSubjectId);

  const refreshAssessments = async () => {
    const data = await fetchSchoolAssessment(schoolIdNum, activeSubjectId ?? undefined);
    const sortedAssessments = (data ?? []).sort(
      (a: { position?: number }, b: { position?: number }) => (a?.position ?? 0) - (b?.position ?? 0)
    );
    setRawAssessments(sortedAssessments);
  };

  useEffect(() => {
    const savedYearId = localStorage.getItem("selectedYearId");
    if (savedYearId) {
      setSelectedYearId(Number(savedYearId));
    }
  }, [classId]);

  useEffect(() => {
    if (!isContextReady) return;

    let cancelled = false;

    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [assessmentResult, quizResult] = await Promise.allSettled([
          fetchSchoolAssessment(schoolIdNum, activeSubjectId ?? undefined),
          fetchQuizes(String(schoolIdNum), activeSubjectId ?? undefined),
        ]);

        if (cancelled) return;

        if (assessmentResult.status === "fulfilled") {
          const sortedAssessments = (assessmentResult.value ?? []).sort(
            (a: { position?: number }, b: { position?: number }) => (a?.position ?? 0) - (b?.position ?? 0)
          );
          setRawAssessments(sortedAssessments);
        } else {
          setError("Failed to load assessments");
          setRawAssessments([]);
          console.error(assessmentResult.reason);
        }

        if (quizResult.status === "fulfilled") {
          setRawQuizzes(quizResult.value ?? []);
        } else {
          // Quizzes are secondary on this page; keep page usable even if this fails.
          setRawQuizzes([]);
          console.error("Failed to load quizzes", quizResult.reason);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [schoolIdNum, activeSubjectId, canUseSubjectContext, isContextReady]);

  const loadQuizzes = async (schoolId: string) => {
    try {
      const response = await fetchQuizes(schoolId, activeSubjectId ?? undefined);
      setRawQuizzes(response);
    } catch (error) {
      setRawQuizzes([]);
      console.error("Failed to load quizzes", error);
    }
  };

  const handleAddAssessment = async (assessmentData: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
    school_id: string;
  }) => {
    try {
      let newAssessment;

      if (assessmentData.type === "quiz") {
        newAssessment = await assignAssesmentQuiz(
          parseInt(normalizedTermId),
          parseInt(assessmentData.name),
          activeSubjectId ?? undefined
        );
      } else {
        newAssessment = await addAssessment({
          name: assessmentData.name,
          school_id: schoolIdNum,
          type: assessmentData.type,
        });
      }

      const newId = newAssessment?.data?.id ?? newAssessment?.id;
      if (inSubjectContext && newId) {
        tagAssessmentWithSubject(newId, Number(activeSubjectId));
      }
      await refreshAssessments();
      setOpen(false);
      setIsAddingQuiz(false);
    } catch (err) {
      setError("Failed to add assessment");
      console.error(err);
    }
  };
  const handleEditAssessment = async (assessmentData: {
    name: string;
    type: "assessment" | "quiz";
    school_id: string;
  }) => {
    if (!editingAssessment) return;

    try {
      const updatedAssessment = await updateAssessment(editingAssessment.id, {
        name: assessmentData.name,
        type: assessmentData.type,
        school_id: schoolIdNum,
      });

      if (inSubjectContext) {
        tagAssessmentWithSubject(editingAssessment.id, Number(activeSubjectId));
      }
      await refreshAssessments();
      setOpen(false);
      setEditingAssessment(null);
    } catch (err) {
      setError("Failed to update assessment");
      console.error(err);
    }
  };

  const handleEditClick = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsAddingQuiz(assessment.type === "quiz");
    setOpen(true);
  };

  const confirmDelete = (id: string) => {
    setAssessmentToDelete(id);
    setDeleteOpen(true);
  };

  const handleDeleteAssessment = async () => {
    if (!assessmentToDelete) return;

    try {
      const assessment = rawAssessments.find((a) => a.id === assessmentToDelete);

      if (assessment?.type === "quiz") {
        await deleteAssignTermQuiz(assessmentToDelete);
      } else {
        await deleteAssessment(assessmentToDelete);
      }
      untagAssessment(assessmentToDelete);
      setRawAssessments(
        rawAssessments.filter((a) => a.id !== assessmentToDelete)
      );
      setDeleteOpen(false);
      setAssessmentToDelete(null);
    } catch (err) {
      setError("Failed to delete assessment");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="premium-page rounded-2xl p-3 md:p-4 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="premium-page rounded-2xl p-3 md:p-4">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>All Assessments</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="premium-hero flex items-center justify-between mb-4 px-4 py-3 rounded-xl">
        <h1 className="text-2xl font-bold">
          {activeSubject?.name ? `${activeSubject.name} — ` : ""}All Assessments
        </h1>
        {!isTeacher && (
          <Button
            type="primary"
            className="premium-pill-btn !bg-primary !text-white !border-0 hover:!opacity-90"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsAddingQuiz(false);
              setEditingAssessment(null);
              setOpen(true);
            }}
          >
            Add Assessment
          </Button>
        )}
      </div>

      {/* Add/Edit Assessment Modal */}
      <Modal
        title={
          editingAssessment
            ? "Edit Assessment"
            : isAddingQuiz
            ? "Add New Quiz"
            : "Add New Assessment"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingAssessment(null);
        }}
        footer={null}
        centered
      >
        {editingAssessment ? (
          <EditAssessmentForm
            onSubmit={handleEditAssessment}
            onCancel={() => {
              setOpen(false);
              setEditingAssessment(null);
            }}
            quizzes={quizzes}
            initialData={{
              name: editingAssessment.name,
              type: editingAssessment.type,
              term_id: normalizedTermId,
            }}
          />
        ) : (
          <AddAssessmentForm
            onSubmit={handleAddAssessment}
            isQuiz={isAddingQuiz}
            termId={normalizedTermId}
            quizzes={quizzes}
          />
        )}
      </Modal>

      <AllAssessmentList
        assessments={assessments}
        onDeleteAssessment={confirmDelete}
        onEditAssessment={handleEditClick}
        quizzes={quizzes}
        termId={normalizedTermId}
      />
      {/* Delete Confirmation Dialog */}
      <Modal
        title="Confirm Delete"
        open={deleteOpen}
        onOk={handleDeleteAssessment}
        onCancel={() => setDeleteOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to delete this assessment?</p>
      </Modal>
    </div>
  );
}
