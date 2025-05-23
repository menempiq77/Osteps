"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AssessmentTasksDrawer } from "../ui/AssessmentTasksDrawer";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchTasks, fetchTerm } from "@/services/api";

interface Task {
  id: number;
  name: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  isUrl: boolean;
  dueDate: string;
  allocatedMarks: number;
  url?: string;
}

interface Assessment {
  id: string;
  name: string;
  type: "assessment" | "quiz";
}

interface AssessmentListProps {
  assessments: Assessment[];
  onDeleteAssessment: (id: string) => void;
  onEditAssessment?: (id: string, newName: string) => void;
  quizzes: any[];
}

export default function AssessmentList({
  assessments,
  onDeleteAssessment,
  onEditAssessment,
  quizzes,
}: AssessmentListProps) {
  const router = useRouter();
  const { classId } = useParams();
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
    null
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<any[]>([]);

  useEffect(() => {
    if (drawerVisible && selectedAssessment) {
      loadTasks();
    }
  }, [drawerVisible, selectedAssessment]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      if (!selectedAssessment) return;
      const fetchedTasks = await fetchTasks(selectedAssessment);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadTerms = async () => {
    try {
      setLoading(true);
      const response = await fetchTerm(Number(classId));
      setTerms(response);
      if (response.length > 0) {
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
    loadTerms();
  }, []);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  const handleAssignmentClick = (
    assignmentId: string,
    type: "assessment" | "quiz"
  ) => {
    if (type === "quiz") {
      router.push(
        `/dashboard/classes/${classId}/terms/${assignmentId}/quiz/${assignmentId}`
      );
      return;
    }
    setSelectedAssessment(assignmentId);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedAssessment(null);
    setTasks([]);
  };

  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };
  return (
    <div className="mt-8 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Registered Assessment</h3>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            {terms.map((term) => (
              <SelectItem key={term.id} value={term.name}>
                {term.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-primary">
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Assessment Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                Type
              </th>
              {canUpload && (
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assessments.map((assignment) => (
              <tr
                key={assignment.id}
                className="text-xs md:text-sm text-center text-gray-800 even:bg-[#E9FAF1] odd:bg-white hover:bg-[#E9FAF1]"
              >
                <td className="p-2 md:p-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignmentClick(assignment.id, assignment.type)
                    }
                    className={`text-green-600 hover:text-green-800 hover:underline cursor-pointer ${
                      assignment.type === "quiz" ? "font-medium" : ""
                    }`}
                  >
                    {assignment.name}
                  </button>
                </td>
                <td className="p-2 md:p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      assignment.type === "quiz"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {assignment.type === "quiz" ? "Quiz" : "Assessment"}
                  </span>
                </td>
                {canUpload && (
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onEditAssessment?.(assignment)}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => onDeleteAssessment(assignment.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AssessmentTasksDrawer
        visible={drawerVisible}
        onClose={onCloseDrawer}
        assignmentName={
          assessments.find((a) => a.id === selectedAssessment)?.name ||
          "Assignment"
        }
        assessmentId={selectedAssessment ? parseInt(selectedAssessment) : 0}
        initialTasks={Array.isArray(tasks) ? tasks : []}
        onTasksChange={handleTasksChange}
        quizzes={quizzes}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}
