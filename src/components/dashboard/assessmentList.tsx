"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { AssessmentTasksDrawer } from "../ui/AssessmentTasksDrawer";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Task {
  id: number;
  name: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  isUrl: boolean;
  dueDate: string;
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
}

export default function AssessmentList({
  assessments,
  onDeleteAssessment,
  onEditAssessment,
  quizzes
}: AssessmentListProps) {
  const router = useRouter();
  const { classId } = useParams();
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
    null
  );
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Memorisation",
      isAudio: true,
      isVideo: false,
      isPdf: false,
      isUrl: false,
      dueDate: "2023-05-15",
    },
    {
      id: 2,
      name: "Extraction & Summarization",
      isAudio: false,
      isVideo: false,
      isUrl: false,
      isPdf: true,
      dueDate: "2023-05-20",
    },
    {
      id: 3,
      name: "Recitation",
      isAudio: true,
      isVideo: false,
      isPdf: false,
      isUrl: false,
      dueDate: "2023-05-25",
    },
    {
      id: 4,
      name: "Tajweed",
      isAudio: false,
      isVideo: true,
      isPdf: false,
      isUrl: false,
      dueDate: "2023-05-25",
    },
  ]);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  const handleAssignmentClick = (
    assignmentId: string,
    type: "assessment" | "quiz"
  ) => {
    if (type === "quiz") {
      // Navigate to quiz page
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
  };

  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Registered Assessment</h3>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assessment Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              {canUpload && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assessments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignmentClick(assignment.id, assignment.type)
                    }
                    className={`text-blue-600 hover:text-blue-800 hover:underline cursor-pointer ${
                      assignment.type === "quiz" ? "font-medium" : ""
                    }`}
                  >
                    {assignment.name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onEditAssessment?.(assignment)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
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
        initialTasks={tasks}
        onTasksChange={handleTasksChange}
        quizzes={quizzes}
      />
    </div>
  );
}
