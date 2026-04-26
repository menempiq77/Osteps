"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Select, Spin } from "antd";
import { ChevronLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchAssessment, fetchAssessmentByStudent } from "@/services/api";
import { IMPERSONATION_STORAGE_KEY } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchTerm } from "@/services/termsApi";
import Link from "next/link";
import { useSubjectContext } from "@/contexts/SubjectContext";

export default function AssignmentsPage() {
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [impersonating, setImpersonating] = useState(false);
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext } = useSubjectContext();
  const [terms, setTerms] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setImpersonating(!!localStorage.getItem(IMPERSONATION_STORAGE_KEY));
  }, []);

  const getAssignmentsForTerm = async (termId: number) => {
    const scopedSubjectId = canUseSubjectContext ? activeSubjectId ?? undefined : undefined;
    const data = impersonating
      ? await fetchAssessment(termId, scopedSubjectId)
      : await fetchAssessmentByStudent(termId, scopedSubjectId);
    return Array.isArray(data) ? data.sort((a, b) => a.position - b.position) : [];
  };

  const hasVisibleAssignmentsForTerm = (items: any[], termId: number) => {
    return items.some((assignment) => {
      if (impersonating) {
        return true;
      }

      if (assignment.type === "quiz") {
        return Number(assignment.term_id) === Number(termId);
      }

      if (assignment.type === "assessment") {
        const assignedRows = Array.isArray(assignment.assigned)
          ? assignment.assigned
          : Array.isArray(assignment.assign_assessments)
          ? assignment.assign_assessments
          : [];

        return assignedRows.some(
          (a: any) =>
            Number(a.term_id) === Number(termId) &&
            String(a.status ?? "").toLowerCase() === "assigned"
        );
      }

      return false;
    });
  };

  const loadTerms = async () => {
    try {
      setLoading(true);
      const response = await fetchTerm(Number(currentUser?.studentClass));
      setTerms(response);
      if (response.length > 0) {
        let preferredTerm = response[0];
        let preferredAssessments: any[] | null = null;

        for (const term of response) {
          const termAssessments = await getAssignmentsForTerm(Number(term.id));
          if (hasVisibleAssignmentsForTerm(termAssessments, Number(term.id))) {
            preferredTerm = term;
            preferredAssessments = termAssessments;
            break;
          }
        }

        setSelectedTerm(preferredTerm.name);
        setSelectedTermId(preferredTerm.id);
        if (preferredAssessments) {
          setAssessments(preferredAssessments);
        }
      }
      setError(null);
    } catch (err) {
      setError("Failed to load terms");
      console.error("Error loading terms:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAssessment = async (termId: number) => {
    try {
      setLoading(true);
      const sortedAssessments = await getAssignmentsForTerm(termId);
      setAssessments(sortedAssessments);
      setError(null);
    } catch (err) {
      setError("Failed to load Assessment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, [currentUser?.studentClass, activeSubjectId, canUseSubjectContext, impersonating]);

  useEffect(() => {
    if (selectedTermId !== null) {
      loadAssessment(selectedTermId);
    }
  }, [selectedTermId, activeSubjectId, canUseSubjectContext, impersonating]);

  
  const handleTermChange = (termName: string) => {
    const term = terms.find((t) => t.name === termName);
    if (term) {
      setSelectedTerm(termName);
      setSelectedTermId(term.id);
    }
  };

  const getAssignmentStatus = (assignment: any) => {
    const today = new Date();
    const due = new Date(assignment.dueDate);

    if (assignment.status === "submitted") return "submitted";
    if (today > due) return "overdue";
    return assignment.status || "not-started";
  };

  const handleItemClick = (assignment: any) => {
    if (assignment.type === "quiz") {
      router.push(
        `/dashboard/students/assignments/${assignment.id}/quiz/${assignment.quiz.id}`
      );
    } else if (assignment.type === "assignment") {
    } else {
      router.push(`/dashboard/students/assignments/${assignment.id}`);
    }
  };

  const filteredAssessments = assessments.filter((assignment) => {
    if (impersonating) {
      if (assignment.type === "quiz") {
        return assignment.term_id == null || Number(assignment.term_id) === Number(selectedTermId);
      }
      return true;
    }

    if (assignment.type === "quiz") {
      return assignment.term_id == null || Number(assignment.term_id) === Number(selectedTermId);
    }
    if (assignment.type === "assessment") {
      const assignedRows = Array.isArray(assignment.assigned)
        ? assignment.assigned
        : Array.isArray(assignment.assign_assessments)
        ? assignment.assign_assessments
        : [];

      if (assignedRows.length === 0) {
        // Term-scoped assessment payloads are already filtered by the selected term.
        return true;
      }

      return assignedRows.some(
        (a: any) => a.term_id === selectedTermId && a.status === "assigned"
      );
    }
    return false;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      submitted: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      "not-started": "bg-gray-100 text-gray-800",
      pending: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          statusClasses[status as keyof typeof statusClasses] || "bg-gray-100"
        }`}
      >
        {status.replace("-", " ")}
      </span>
    );
  };

  const getNearestTask = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return null;

    const now = new Date();
    const validTasks = tasks.filter((task) => task.due_date);

    if (validTasks.length === 0) return tasks[0]; // fallback to first task if no due dates

    const futureTasks = validTasks.filter(
      (task) => new Date(task.due_date) >= now
    );

    if (futureTasks.length > 0) {
      return futureTasks.reduce((nearest, current) => {
        const nearestDiff = Math.abs(
          new Date(nearest.due_date).getTime() - now.getTime()
        );
        const currentDiff = Math.abs(
          new Date(current.due_date).getTime() - now.getTime()
        );
        return currentDiff < nearestDiff ? current : nearest;
      });
    }

    return validTasks.reduce((latest, current) => {
      return new Date(current.due_date) > new Date(latest.due_date)
        ? current
        : latest;
    });
  };

  return (
    <div className="p-3 md:p-6">
      <Breadcrumb
          items={[
            {
              title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              title: <span>Assesments</span>,
            },
          ]}
          className="!mb-2"
        />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
        {terms?.length > 0 && (
          <Select
            value={selectedTerm}
            onChange={handleTermChange}
            style={{ width: 200 }}
            className="bg-white"
          >
            {terms?.map((term) => (
              <Select.Option key={term.id} value={term.name}>
                {term.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : filteredAssessments?.length <= 0 ? (
        <Card className="text-center py-10">
          <p>No assessments found for this term</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssessments?.map((assignment) => {
            const status = getAssignmentStatus(assignment);
            return (
              <Card
                key={assignment.id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full cursor-pointer"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start flex-grow">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assignment.name || assignment?.quiz?.name}
                        </h3>
                        {/* {getStatusBadge(status)} */}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {assignment.description}
                      </p>
                      {assignment.tasks && assignment.tasks.length > 0 && (
                        <div className="flex items-center mt-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm text-gray-600">
                            Due:{" "}
                            {new Date(
                              getNearestTask(assignment.tasks)?.due_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="mt-2">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {assignment.type === "quiz" ? "Quiz" : "Assignment"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="primary"
                      className="text-sm w-full md:w-auto !bg-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(assignment);
                      }}
                    >
                      {assignment.type === "quiz"
                        ? "Attempt Quiz"
                        : "View Details"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
