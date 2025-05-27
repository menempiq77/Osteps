"use client";
import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddAssessmentForm from "@/components/dashboard/AddAssessmentForm";
import AssessmentList from "@/components/dashboard/assessmentList";
import {
  addAssessment,
  deleteAssessment,
  fetchAssessment,
  fetchQuizes,
  updateAssessment,
} from "@/services/api";
import { Alert, Spin } from "antd";
import { useParams } from "next/navigation";
import EditAssessmentForm from "@/components/dashboard/EditAssessmentForm";

interface Assessment {
  id: string;
  name: string;
  type: "assessment" | "quiz";
  term_id: string;
}

export default function Page() {
  const { termId, classId } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(
    null
  );
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null
  );

  const loadAssessment = async () => {
    try {
      const data = await fetchAssessment();
      setAssessments(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load Assessment");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    loadAssessment();
    loadQuizzes();
  }, [termId]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizes();
      setQuizzes(response);
    } catch (error) {
      message.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssessment = async (assessmentData: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
    class_id: string,
  }) => {
    try {
      const newAssessment = await addAssessment({
        name: assessmentData.name,
        class_id: classId,
        term_id: termId,
        type: assessmentData.type,
      });
      setAssessments([...assessments, newAssessment]);
      await loadAssessment();
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
    class_id: string,
  }) => {
    if (!editingAssessment) return;

    try {
      const updatedAssessment = await updateAssessment(editingAssessment.id, {
        name: assessmentData.name,
        type: assessmentData.type,
        term_id: termId,
        class_id: classId,
      });

      setAssessments(
        assessments.map((assessment) =>
          assessment.id === editingAssessment.id
            ? updatedAssessment
            : assessment
        )
      );
      await loadAssessment();
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
      await deleteAssessment(assessmentToDelete);
      setAssessments(
        assessments.filter((assessment) => assessment.id !== assessmentToDelete)
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
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="p-3 md:p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assessment</h1>
        <div className="flex gap-2">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingQuiz(false);
                  setEditingAssessment(null);
                }}
              >
                Add Assessment
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />

              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-lg font-bold mb-4">
                  {editingAssessment
                    ? "Edit Assessment"
                    : isAddingQuiz
                    ? "Add New Quiz"
                    : "Add New Assessment"}
                </Dialog.Title>
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
                      term_id: termId,
                    }}
                  />
                ) : (
                  <AddAssessmentForm
                    onSubmit={handleAddAssessment}
                    isQuiz={isAddingQuiz}
                    termId={termId}
                    quizzes={quizzes}
                  />
                )}
                <Dialog.Close asChild>
                  <button
                    className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                    onClick={() => {
                      setEditingAssessment(null);
                    }}
                  >
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Button
            onClick={() => {
              setOpen(true);
              setIsAddingQuiz(true);
            }}
          >
            Add Quiz
          </Button>
        </div>
      </div>
      <AssessmentList
        assessments={assessments}
        onDeleteAssessment={confirmDelete}
        onEditAssessment={handleEditClick}
        quizzes={quizzes}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-lg font-bold mb-4">
              Confirm Delete
            </Dialog.Title>
            <p className="mb-4">
              Are you sure you want to delete this assessment?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAssessment} className="cursor-pointer">
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
