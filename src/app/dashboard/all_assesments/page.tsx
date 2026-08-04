"use client";
import React, { useEffect, useState } from "react";
import AddAssessmentForm from "@/components/dashboard/AddAssessmentForm";
import AllAssessmentList, {
  type Assessment as AssessmentListItem,
} from "@/components/dashboard/AllAssessmentList";
import {
  addAssessment,
  addTask,
  deleteAssessment,
  deleteAssignTermQuiz,
  duplicateAssessment,
  fetchSchoolAssessment,
  fetchTasks,
  updateAssessment,
} from "@/services/api";
import { throwOnEmbeddedFailure } from "@/lib/apiResponse";
import { Breadcrumb, Button, message, Modal, Spin } from "antd";
import { ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import EditAssessmentForm from "@/components/dashboard/EditAssessmentForm";
import { assignAssesmentQuiz, assignTaskQuiz, fetchQuizes } from "@/services/quizApi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  ImportFromSimilarSubjectModal,
  type ImportableItem,
} from "@/components/modals/ImportFromSimilarSubjectModal";

type Assessment = AssessmentListItem;

const ASSESSMENT_SUBJECT_MAP_KEY = "osteps_assessment_subject_map";
const QUIZ_SUBJECT_MAP_KEY = "osteps_quiz_subject_map";

function readQuizSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(QUIZ_SUBJECT_MAP_KEY) || "{}"); }
  catch { return {}; }
}

function filterQuizzesBySubject(quizzes: any[], subjectId: number): any[] {
  const map = readQuizSubjectMap();
  return quizzes.filter((q) => {
    const backendSubjectId = q.subject_id ?? q.subject?.id ?? null;
    if (backendSubjectId != null && Number(backendSubjectId) !== 0) {
      return Number(backendSubjectId) === subjectId;
    }

    const localSubjectId = map[String(q.id)];
    if (localSubjectId != null) {
      return localSubjectId === subjectId;
    }

    return false;
  });
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
  const [importOpen, setImportOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext, activeSubject } = useSubjectContext();
  const inSubjectContext = canUseSubjectContext && !!activeSubjectId;
  // Assessments have no subject_id in the DB; show all school assessments
  // (localStorage-based subject tagging is unreliable across browsers/devices)
  const assessments = rawAssessments;
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
          subject_id: inSubjectContext ? Number(activeSubjectId) : undefined,
        });
      }

      const newId = newAssessment?.data?.id ?? newAssessment?.id;
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
    term_id: string;
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

  const handleDuplicateAssessment = async (assessment: Assessment) => {
    try {
      await duplicateAssessment(assessment.id);
      await refreshAssessments();
      messageApi.success(`"${assessment.name}" duplicated with all tasks`);
    } catch (err) {
      messageApi.error("Failed to duplicate assessment");
      console.error(err);
    }
  };

  const loadAssessmentsForSubject = async (
    sourceSubjectId: number
  ): Promise<ImportableItem[]> => {
    const rows = await fetchSchoolAssessment(schoolIdNum, sourceSubjectId);
    return (Array.isArray(rows) ? rows : [])
      .filter((row: any) => {
        const rowSubjectId = Number(row?.subject_id ?? row?.subject?.id ?? 0);
        return rowSubjectId === 0 || rowSubjectId === sourceSubjectId;
      })
      .map((row: any) => ({
        id: row.id,
        name: row.name ?? row?.quiz?.name ?? "Untitled",
        description: row.type === "quiz" ? "Quiz" : undefined,
      }));
  };

  // `duplicate-assessment` always copies into the source subject, so the copy is
  // created through the normal create path and its tasks/quizzes are re-added.
  // Uploaded task files are not re-uploaded and stay with the source.
  const importAssessment = async (item: ImportableItem, sourceSubjectId: number) => {
    const created = await addAssessment({
      name: item.name,
      school_id: schoolIdNum,
      type: "assessment",
      subject_id: inSubjectContext ? Number(activeSubjectId) : undefined,
    });
    throwOnEmbeddedFailure(created, { fallbackMessage: "Failed to create the assessment" });
    const newId = Number(created?.data?.id ?? created?.id ?? 0);
    if (!newId) throw new Error("Assessment copy returned no id");
    if (inSubjectContext) {
      tagAssessmentWithSubject(newId, Number(activeSubjectId));
    }

    const rows = await fetchTasks(Number(item.id), sourceSubjectId);
    for (const row of Array.isArray(rows) ? rows : []) {
      if (row?.type === "quiz") {
        const quizId = Number(row?.quiz?.id ?? row?.quiz_id ?? 0);
        if (quizId > 0) {
          const weight = Number(row?.percentage_weight);
          await assignTaskQuiz(
            quizId,
            newId,
            inSubjectContext ? Number(activeSubjectId) : undefined,
            Number.isFinite(weight) ? weight : undefined
          );
        }
        continue;
      }

      const formData = new FormData();
      formData.append("assessment_id", String(newId));
      formData.append("task_name", String(row?.task_name ?? row?.name ?? "").trim());
      formData.append("description", String(row?.description ?? ""));
      formData.append("due_date", String(row?.due_date ?? "").slice(0, 10));
      formData.append("allocated_marks", String(row?.allocated_marks ?? 0));
      formData.append("percentage_weight", String(row?.percentage_weight ?? 0));

      const taskType = row?.task_type_config ?? row?.task_type;
      if (taskType && typeof taskType === "object") {
        Object.entries(taskType).forEach(([key, value]) => {
          if (value == null || value === "") return;
          formData.append(`task_type[${key}]`, String(value));
        });
      } else {
        formData.append("task_type", taskType ? String(taskType) : "null");
      }
      if (row?.url) formData.append("url", String(row.url));

      const response = await addTask(formData);
      throwOnEmbeddedFailure(response, { fallbackMessage: "Failed to copy a task" });
    }
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
        await deleteAssignTermQuiz(Number(assessmentToDelete));
      } else {
        await deleteAssessment(Number(assessmentToDelete));
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
      {contextHolder}
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
      <div className="premium-hero flex flex-col gap-4 mb-5 px-5 py-5 rounded-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
              {activeSubject?.name ? `${activeSubject.name} — ` : ""}All Assessments
            </h1>
            <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-900/5">
              {assessments.length} {assessments.length === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Create, organise and weight your assessments. Drag cards to reorder.
          </p>
        </div>
        {!isTeacher && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {inSubjectContext && (
            <Button
              size="large"
              className="premium-pill-btn"
              icon={<ImportOutlined />}
              onClick={() => setImportOpen(true)}
            >
              Import Assessments
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            className="premium-pill-btn !bg-primary !text-white !border-0 hover:!opacity-90 self-start sm:self-auto shrink-0"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsAddingQuiz(false);
              setEditingAssessment(null);
              setOpen(true);
            }}
          >
            Add Assessment
          </Button>
          </div>
        )}
      </div>

      <ImportFromSimilarSubjectModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        itemLabel="assessment"
        itemLabelPlural="assessments"
        loadItems={loadAssessmentsForSubject}
        importItem={importAssessment}
        onImported={refreshAssessments}
      />

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
            key={editingAssessment.id}
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
        onDuplicateAssessment={handleDuplicateAssessment}
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
