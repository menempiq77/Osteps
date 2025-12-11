"use client";
import React, { useEffect, useState } from "react";
import AddAssessmentForm from "@/components/dashboard/AddAssessmentForm";
import AllAssessmentList from "@/components/dashboard/AllAssessmentList";
import {
  addAssessment,
  deleteAssessment,
  deleteAssignTermQuiz,
  fetchAssessment,
  fetchSchoolAssessment,
  updateAssessment,
} from "@/services/api";
import { Breadcrumb, Button, Modal, Spin } from "antd";
import { useParams } from "next/navigation";
import EditAssessmentForm from "@/components/dashboard/EditAssessmentForm";
import { assignAssesmentQuiz, fetchQuizes } from "@/services/quizApi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Assessment {
  id: string;
  name: string;
  type: "assessment" | "quiz";
  term_id: string;
}

export default function Page() {
  const { termId, classId } = useParams();
  const [currentTermId, setCurrentTermId] = useState(1);
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
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isTeacher = currentUser?.role === "TEACHER";

  const schoolId = currentUser?.school;

  useEffect(() => {
    setCurrentTermId(termId);
  }, [termId]);

  useEffect(() => {
    const savedYearId = localStorage.getItem("selectedYearId");
    if (savedYearId) {
      setSelectedYearId(Number(savedYearId));
    }
  }, [classId]);

  const loadAssessment = async () => {
    try {
      const data = await fetchSchoolAssessment(schoolId);
      const sortedAssessments = data.sort((a, b) => a.position - b.position);
      setAssessments(sortedAssessments);
      setLoading(false);
    } catch (err) {
      setError("Failed to load Assessment");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentTermId) {
      loadAssessment();
      loadQuizzes(schoolId);
    }
  }, [currentTermId]);

  const loadQuizzes = async (schoolId: string) => {
    try {
      setLoading(true);
      const response = await fetchQuizes(schoolId);
      setQuizzes(response);
    } catch (error) {
      console.error("Failed to load quizzes");
    } finally {
      setLoading(false);
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
          parseInt(termId as string),
          parseInt(assessmentData.name)
        );
      } else {
        newAssessment = await addAssessment({
          name: assessmentData.name,
          school_id: schoolId,
          type: assessmentData.type,
        });
      }

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
    school_id: string;
  }) => {
    if (!editingAssessment) return;

    try {
      const updatedAssessment = await updateAssessment(editingAssessment.id, {
        name: assessmentData.name,
        type: assessmentData.type,
        school_id: schoolId,
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
      const assessment = assessments.find((a) => a.id === assessmentToDelete);

      if (assessment?.type === "quiz") {
        await deleteAssignTermQuiz(assessmentToDelete);
      } else {
        await deleteAssessment(assessmentToDelete);
      }
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

  return (
    <div className="p-3 md:p-6">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>All Assesments</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Assessments</h1>
        {!isTeacher && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setIsAddingQuiz(false);
                setEditingAssessment(null);
                setOpen(true);
              }}
              className="!bg-white !border !border-gray-300"
            >
              Add Assessment
            </Button>

            {/* <Button
              onClick={() => {
                setOpen(true);
                setIsAddingQuiz(true);
              }}
              className="!bg-primary !text-white"
            >
              Assign Quiz
            </Button> */}
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
      </Modal>

      <AllAssessmentList
        assessments={assessments}
        onDeleteAssessment={confirmDelete}
        onEditAssessment={handleEditClick}
        quizzes={quizzes}
        termId={termId}
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
