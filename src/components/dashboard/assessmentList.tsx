"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AssessmentTasksDrawer } from "../ui/AssessmentTasksDrawer";

interface Task {
  id: number;
  name: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  dueDate: string;
}

interface Assessment {
  id: number;
  name: string;
}

interface AssessmentListProps {
  assessments: Assessment[];
  onDeleteAssessment: (id: number) => void;
  onEditAssessment: (id: number, newName: string) => void;
}

export default function AssessmentList({ 
  assessments,
  onDeleteAssessment,
  onEditAssessment
}: AssessmentListProps) {
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Memorisation", isAudio: true, isVideo: false, isPdf: false, dueDate: "2023-05-15" },
    { id: 2, name: "Extraction & Summarization", isAudio: false, isVideo: false, isPdf: true, dueDate: "2023-05-20" },
    { id: 3, name: "Recitation", isAudio: true, isVideo: false, isPdf: false, dueDate: "2023-05-25" },
    { id: 4, name: "Tajweed", isAudio: false, isVideo: true, isPdf: false, dueDate: "2023-05-25" },
  ]);

  const [currentUserRole] = useState("ADMIN"); // Replace with your auth logic

  const handleAssignmentClick = (assignmentId: number) => {
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

  const handleEdit = (assignmentId: number) => {
    const newName = prompt("Enter new assessment name:");
    if (newName) {
      onEditAssessment(assignmentId, newName);
    }
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
              {currentUserRole !== "TEACHER" && (
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
                    onClick={() => handleAssignmentClick(assignment.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {assignment.name}
                  </button>
                </td>
                {currentUserRole !== "TEACHER" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(assignment.id)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAssessment(assignment.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
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
          assessments.find((a) => a.id === selectedAssessment)?.name || "Assignment"
        }
        initialTasks={tasks}
        onTasksChange={handleTasksChange}
      />
    </div>
  );
}