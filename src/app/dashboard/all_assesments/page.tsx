"use client";
import React, { useEffect, useState } from "react";
import AddAssessmentForm from "@/components/dashboard/AddAssessmentForm";
import AllAssessmentList from "@/components/dashboard/AllAssessmentList";
import {
  addAssessment,
  deleteAssessment,
  deleteAssignTermQuiz,
  duplicateAssessment,
  fetchSchoolAssessment,
  importArchivedAssessments,
  updateAssessment,
} from "@/services/api";
import {
  Alert,
  Breadcrumb,
  Button,
  Empty,
  message,
  Modal,
  Select,
  Spin,
} from "antd";
import { ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import EditAssessmentForm from "@/components/dashboard/EditAssessmentForm";
import { assignAssesmentQuiz, fetchQuizes } from "@/services/quizApi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { useReadOnlyWorkspace } from "@/lib/readOnlyWorkspace";

interface Assessment {
  id: string;
  name: string;
  type: "assessment" | "quiz";
  term_id: string;
}

type ArchivedAssessmentSource = {
  subjectId: number;
  subjectName: string;
  assessments: Assessment[];
};

type SubjectClassStatusRow = {
  is_active?: number | string | null;
};

type RequestError = {
  message?: unknown;
  response?: {
    data?: {
      message?: unknown;
      msg?: unknown;
    };
  };
};

const ASSESSMENT_SUBJECT_MAP_KEY = "osteps_assessment_subject_map";
const QUIZ_SUBJECT_MAP_KEY = "osteps_quiz_subject_map";

function readQuizSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(QUIZ_SUBJECT_MAP_KEY) || "{}");
  } catch {
    return {};
  }
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
  try {
    return JSON.parse(localStorage.getItem(ASSESSMENT_SUBJECT_MAP_KEY) || "{}");
  } catch {
    return {};
  }
}

function tagAssessmentWithSubject(
  assessmentId: number | string,
  subjectId: number,
) {
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

function filterAssessmentsBySubject(
  assessments: Assessment[],
  subjectId: number,
): Assessment[] {
  const map = readAssessmentSubjectMap();
  return assessments.filter((a) => map[String(a.id)] === subjectId);
}

const isSubjectClassActive = (row: SubjectClassStatusRow) =>
  row.is_active === undefined ? true : Number(row.is_active) === 1;

const resolveRequestError = (error: unknown, fallback: string): string => {
  const requestError = error as RequestError;
  return String(
    requestError.response?.data?.msg ??
      requestError.response?.data?.message ??
      requestError.message ??
      fallback,
  );
};

const IMPORT_REQUEST_TOKEN_KEY = "osteps_archived_assessment_import_tokens";

const readImportRequestTokens = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(
      sessionStorage.getItem(IMPORT_REQUEST_TOKEN_KEY) || "{}",
    );
  } catch {
    return {};
  }
};

const getImportRequestToken = (signature: string): string => {
  const tokens = readImportRequestTokens();
  if (tokens[signature]) return tokens[signature];

  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tokens[signature] = token;
  sessionStorage.setItem(IMPORT_REQUEST_TOKEN_KEY, JSON.stringify(tokens));
  return token;
};

const clearImportRequestToken = (signature: string) => {
  if (typeof window === "undefined") return;
  const tokens = readImportRequestTokens();
  delete tokens[signature];
  sessionStorage.setItem(IMPORT_REQUEST_TOKEN_KEY, JSON.stringify(tokens));
};

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
    null,
  );
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null,
  );
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [archivedAssessmentSources, setArchivedAssessmentSources] = useState<
    ArchivedAssessmentSource[]
  >([]);
  const [archivedAssessmentsLoading, setArchivedAssessmentsLoading] =
    useState(false);
  const [importingAssessments, setImportingAssessments] = useState(false);
  const [selectedSourceSubjectId, setSelectedSourceSubjectId] = useState<
    number | null
  >(null);
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<string[]>(
    [],
  );
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext, activeSubject, subjects } =
    useSubjectContext();
  const isReadOnlyArchivedWorkspace = useReadOnlyWorkspace();
  const inSubjectContext = canUseSubjectContext && !!activeSubjectId;
  const assessments = rawAssessments;
  const quizzes = inSubjectContext
    ? filterQuizzesBySubject(rawQuizzes, Number(activeSubjectId))
    : rawQuizzes;
  const isTeacher = currentUser?.role === "TEACHER";
  const normalizedTermId = typeof termId === "string" ? termId : "";
  const schoolIdNum = Number(currentUser?.school ?? 0);
  const isContextReady =
    schoolIdNum > 0 && (!canUseSubjectContext || !!activeSubjectId);
  const canImportArchivedAssessments =
    currentUser?.role === "SCHOOL_ADMIN" &&
    inSubjectContext &&
    !isReadOnlyArchivedWorkspace;
  const selectedArchivedSource =
    archivedAssessmentSources.find(
      (source) => source.subjectId === selectedSourceSubjectId,
    ) ?? null;

  const refreshAssessments = async () => {
    const data = await fetchSchoolAssessment(
      schoolIdNum,
      activeSubjectId ?? undefined,
    );
    const sortedAssessments = (data ?? []).sort(
      (a: { position?: number }, b: { position?: number }) =>
        (a?.position ?? 0) - (b?.position ?? 0),
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
            (a: { position?: number }, b: { position?: number }) =>
              (a?.position ?? 0) - (b?.position ?? 0),
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

  useEffect(() => {
    if (
      !importOpen ||
      !canImportArchivedAssessments ||
      !activeSubjectId ||
      !schoolIdNum
    ) {
      setArchivedAssessmentSources([]);
      setArchivedAssessmentsLoading(false);
      return;
    }

    let cancelled = false;
    setArchivedAssessmentsLoading(true);

    const loadArchivedAssessments = async () => {
      try {
        const sourceSubjects = subjects.filter(
          (subject) => Number(subject.id) !== Number(activeSubjectId),
        );
        const sourceRows = await Promise.all(
          sourceSubjects.map(async (subject) => {
            try {
              const [classRows, sourceAssessments] = await Promise.all([
                fetchSubjectClasses({
                  subject_id: Number(subject.id),
                  include_inactive: true,
                }) as Promise<SubjectClassStatusRow[]>,
                fetchSchoolAssessment(schoolIdNum, Number(subject.id)),
              ]);
              return {
                subject,
                classRows: Array.isArray(classRows) ? classRows : [],
                assessments: (Array.isArray(sourceAssessments)
                  ? sourceAssessments
                  : []
                ).filter(
                  (assessment: Assessment) =>
                    String(assessment.type).toLowerCase() === "assessment",
                ),
              };
            } catch {
              return {
                subject,
                classRows: [] as SubjectClassStatusRow[],
                assessments: [] as Assessment[],
              };
            }
          }),
        );

        if (cancelled) return;

        const archivedSources = sourceRows
          .filter(
            ({ classRows, assessments: sourceAssessments }) =>
              classRows.length > 0 &&
              classRows.every((row) => !isSubjectClassActive(row)) &&
              sourceAssessments.length > 0,
          )
          .map(({ subject, assessments: sourceAssessments }) => ({
            subjectId: Number(subject.id),
            subjectName: String(subject.name ?? `Subject ${subject.id}`),
            assessments: sourceAssessments,
          }))
          .sort((a, b) => a.subjectName.localeCompare(b.subjectName));

        setArchivedAssessmentSources(archivedSources);
        setSelectedSourceSubjectId((current) =>
          archivedSources.some((source) => source.subjectId === current)
            ? current
            : (archivedSources[0]?.subjectId ?? null),
        );
      } catch (loadError) {
        console.error(loadError);
        messageApi.error("Failed to load archived assessments.");
        setArchivedAssessmentSources([]);
      } finally {
        if (!cancelled) setArchivedAssessmentsLoading(false);
      }
    };

    loadArchivedAssessments();

    return () => {
      cancelled = true;
    };
  }, [
    importOpen,
    canImportArchivedAssessments,
    activeSubjectId,
    schoolIdNum,
    subjects,
    messageApi,
  ]);

  const loadQuizzes = async (schoolId: string) => {
    try {
      const response = await fetchQuizes(
        schoolId,
        activeSubjectId ?? undefined,
      );
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
          activeSubjectId ?? undefined,
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

  const handleImportArchivedAssessments = async () => {
    if (
      !canImportArchivedAssessments ||
      !activeSubjectId ||
      !selectedArchivedSource
    ) {
      messageApi.warning(
        "Only School Admin can import assessments into an active subject.",
      );
      return;
    }

    if (selectedAssessmentIds.length === 0) {
      messageApi.warning("Select at least one assessment to import.");
      return;
    }

    setImportingAssessments(true);

    try {
      const latestSourceAssessments = (
        await fetchSchoolAssessment(
          schoolIdNum,
          selectedArchivedSource.subjectId,
        )
      ).filter(
        (assessment: Assessment) =>
          String(assessment.type).toLowerCase() === "assessment",
      );
      const selectedIdSet = new Set(selectedAssessmentIds.map(String));
      const assessmentsToImport = latestSourceAssessments.filter(
        (assessment: Assessment) => selectedIdSet.has(String(assessment.id)),
      );

      if (assessmentsToImport.length !== selectedAssessmentIds.length) {
        throw new Error(
          "One or more selected assessments are no longer available.",
        );
      }

      const sourceIdsBefore = latestSourceAssessments
        .map((assessment: Assessment) => String(assessment.id))
        .sort();
      const selectedIds = selectedAssessmentIds.map(Number).sort((a, b) => a - b);
      const requestSignature = [
        schoolIdNum,
        selectedArchivedSource.subjectId,
        Number(activeSubjectId),
        selectedIds.join(","),
      ].join(":");
      const importResponse = await importArchivedAssessments({
        source_subject_id: selectedArchivedSource.subjectId,
        target_subject_id: Number(activeSubjectId),
        assessment_ids: selectedIds,
        request_token: getImportRequestToken(requestSignature),
      });
      const importedRows = importResponse.data?.assessments ?? [];

      if (
        Number(importResponse.data?.imported_count ?? 0) !== selectedIds.length ||
        importedRows.length !== selectedIds.length
      ) {
        throw new Error("The server did not confirm every selected assessment.");
      }

      const [targetAssessmentsAfter, sourceAssessmentsAfter] = await Promise.all([
        fetchSchoolAssessment(schoolIdNum, Number(activeSubjectId)),
        fetchSchoolAssessment(
          schoolIdNum,
          selectedArchivedSource.subjectId,
        ),
      ]);
      const sourceIdsAfter = (Array.isArray(sourceAssessmentsAfter)
        ? sourceAssessmentsAfter
        : []
      )
        .filter(
          (assessment: Assessment) =>
            String(assessment.type).toLowerCase() === "assessment",
        )
        .map((assessment: Assessment) => String(assessment.id))
        .sort();

      if (sourceIdsBefore.join(",") !== sourceIdsAfter.join(",")) {
        throw new Error("The archived source changed during the import.");
      }

      const targetRows = Array.isArray(targetAssessmentsAfter)
        ? targetAssessmentsAfter
        : [];
      for (const importedRow of importedRows) {
        const targetAssessment = targetRows.find(
          (assessment: Assessment) =>
            Number(assessment.id) === Number(importedRow.id),
        ) as (Assessment & { subject_id?: number | string | null }) | undefined;
        const sourceAssessment = assessmentsToImport.find(
          (assessment: Assessment) =>
            Number(assessment.id) === Number(importedRow.source_assessment_id),
        );

        if (
          !targetAssessment ||
          !sourceAssessment ||
          Number(targetAssessment.id) === Number(sourceAssessment.id) ||
          Number(targetAssessment.subject_id) !== Number(activeSubjectId) ||
          targetAssessment.name !== sourceAssessment.name ||
          String(targetAssessment.type).toLowerCase() !==
            String(sourceAssessment.type).toLowerCase() ||
          Number(importedRow.assignment_count) !== 0
        ) {
          throw new Error(
            `The imported copy of "${sourceAssessment?.name ?? "an assessment"}" failed ownership verification.`,
          );
        }
      }

      await refreshAssessments();
      clearImportRequestToken(requestSignature);
      messageApi.success(
        `${importedRows.length} ${
          importedRows.length === 1 ? "assessment" : "assessments"
        } imported with all tasks.`,
      );
      setImportOpen(false);
      setSelectedAssessmentIds([]);
    } catch (importError) {
      messageApi.error(
        resolveRequestError(importError, "Failed to import assessments."),
      );
    } finally {
      setImportingAssessments(false);
    }
  };

  const confirmDelete = (id: string) => {
    setAssessmentToDelete(id);
    setDeleteOpen(true);
  };

  const handleDeleteAssessment = async () => {
    if (!assessmentToDelete) return;

    try {
      const assessment = rawAssessments.find(
        (a) => a.id === assessmentToDelete,
      );

      if (assessment?.type === "quiz") {
        await deleteAssignTermQuiz(assessmentToDelete);
      } else {
        await deleteAssessment(assessmentToDelete);
      }
      untagAssessment(assessmentToDelete);
      setRawAssessments(
        rawAssessments.filter((a) => a.id !== assessmentToDelete),
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
              {activeSubject?.name ? `${activeSubject.name} — ` : ""}All
              Assessments
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
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            {canImportArchivedAssessments && (
              <Button
                size="large"
                className="premium-pill-btn"
                icon={<ImportOutlined />}
                onClick={() => {
                  setSelectedSourceSubjectId(null);
                  setSelectedAssessmentIds([]);
                  setImportOpen(true);
                }}
              >
                Import Archived
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              className="premium-pill-btn !bg-primary !text-white !border-0 hover:!opacity-90 shrink-0"
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

      <Modal
        title="Import assessments from an archived subject"
        open={importOpen}
        onCancel={() => {
          if (importingAssessments) return;
          setImportOpen(false);
          setSelectedAssessmentIds([]);
        }}
        onOk={handleImportArchivedAssessments}
        okText={`Import ${
          selectedAssessmentIds.length > 0 ? selectedAssessmentIds.length : ""
        } ${
          selectedAssessmentIds.length === 1 ? "Assessment" : "Assessments"
        }`.replace("  ", " ")}
        okButtonProps={{
          disabled:
            archivedAssessmentsLoading ||
            !selectedSourceSubjectId ||
            selectedAssessmentIds.length === 0,
          loading: importingAssessments,
          className: "!bg-primary !border-primary",
        }}
        cancelButtonProps={{ disabled: importingAssessments }}
        maskClosable={!importingAssessments}
        closable={!importingAssessments}
        centered
      >
        <div className="space-y-4">
          <Alert
            type="info"
            showIcon
            message="Copy assessment content, not historical results"
            description={`The selected assessments and all tasks will be copied into ${
              activeSubject?.name ?? "this active subject"
            }. Imported copies start unassigned. The archived originals, student submissions, marks, and previous assignments remain unchanged.`}
          />

          {archivedAssessmentsLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spin />
            </div>
          ) : archivedAssessmentSources.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No assessments were found in archived subjects."
            />
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Archived subject
                </label>
                <Select
                  className="w-full"
                  value={selectedSourceSubjectId}
                  onChange={(value) => {
                    setSelectedSourceSubjectId(value);
                    setSelectedAssessmentIds([]);
                  }}
                  options={archivedAssessmentSources.map((source) => ({
                    value: source.subjectId,
                    label: `${source.subjectName} (${source.assessments.length} ${
                      source.assessments.length === 1
                        ? "assessment"
                        : "assessments"
                    })`,
                  }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Assessments to import
                </label>
                <Select
                  mode="multiple"
                  allowClear
                  className="w-full"
                  value={selectedAssessmentIds}
                  placeholder="Choose one or more assessments"
                  onChange={setSelectedAssessmentIds}
                  maxTagCount="responsive"
                  options={(selectedArchivedSource?.assessments ?? []).map(
                    (assessment) => ({
                      value: String(assessment.id),
                      label: assessment.name,
                    }),
                  )}
                />
                {selectedArchivedSource &&
                  selectedAssessmentIds.length <
                    selectedArchivedSource.assessments.length && (
                    <Button
                      type="link"
                      className="!px-0"
                      onClick={() =>
                        setSelectedAssessmentIds(
                          selectedArchivedSource.assessments.map((assessment) =>
                            String(assessment.id),
                          ),
                        )
                      }
                    >
                      Select all {selectedArchivedSource.assessments.length}
                    </Button>
                  )}
              </div>
            </>
          )}
        </div>
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
