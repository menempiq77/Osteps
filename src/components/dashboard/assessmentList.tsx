"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { Button, Drawer } from "antd";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type TaskFormData = {
  name: string;
  dueDate: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
};

export default function AssessmentList() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, name: "Memorisation", isAudio: true, isVideo: false, isPdf: false, dueDate: "2023-05-15" },
    { id: 2, name: "Extraction & Summarization", isAudio: false, isVideo: false, isPdf: true, dueDate: "2023-05-20" },
    { id: 3, name: "Recitation", isAudio: true, isVideo: false, isPdf: false, dueDate: "2023-05-25" },
    { id: 4, name: "Tajweed", isAudio: false, isVideo: true, isPdf: false, dueDate: "2023-05-25" },
  ]);

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<TaskFormData>();

  const assignmentsData = [
    { id: 1, assignmentName: "T1 Quran Diagnostic" },
    { id: 2, assignmentName: "T1 Quran Assessment 1" },
    { id: 3, assignmentName: "T1 Written Task 1" },
    { id: 4, assignmentName: "T1 Class Work" },
    { id: 5, assignmentName: "T1 Assesment" },
  ];

  const handleEdit = (assignmentId: number) => {
    console.log("Edit assignment:", assignmentId);
  };

  const handleDelete = (assignmentId: number) => {
    console.log("Delete assignment:", assignmentId);
  };

  const handleAssignmentClick = (assignmentId: number) => {
    setSelectedAssignment(assignmentId);
    setDrawerVisible(true);
    setShowTaskForm(false);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedAssignment(null);
    setShowTaskForm(false);
  };

  const onSubmitTask = (data: TaskFormData) => {
    const newTask = {
      id: tasks.length + 1,
      name: data.name,
      isAudio: data.isAudio,
      isVideo: data.isVideo,
      isPdf: data.isPdf,
      dueDate: data.dueDate,
    };
    setTasks([...tasks, newTask]);
    reset();
    setShowTaskForm(false);
  };

  const getTaskTypeLabel = (task: { isAudio: boolean; isVideo: boolean; isPdf: boolean }) => {
    if (task.isAudio) return "Audio";
    if (task.isVideo) return "Video";
    if (task.isPdf) return "PDF";
    return "Text";
  };

  const getTaskTypeClass = (task: { isAudio: boolean; isVideo: boolean; isPdf: boolean }) => {
    if (task.isVideo) return "bg-green-100 text-green-800";
    if (task.isPdf) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Registered Tasks</h3>
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
                Assignment Name
              </th>
              {currentUser?.role !== "TEACHER" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assignmentsData.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleAssignmentClick(assignment.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {assignment.assignmentName}
                  </button>
                </td>
                {currentUser?.role !== "TEACHER" && (
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
                        onClick={() => handleDelete(assignment.id)}
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

      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>
              {assignmentsData.find((a) => a.id === selectedAssignment)
                ?.assignmentName || "Assignment Tasks"}
            </span>
            <Button
              type="primary"
              size="middle"
              onClick={() => setShowTaskForm(true)}
              disabled={showTaskForm}
            >
              Create Task
            </Button>
          </div>
        }
        placement="right"
        onClose={onCloseDrawer}
        open={drawerVisible}
        width={500}
      >
        <div className="space-y-4">
          {showTaskForm && (
            <form onSubmit={handleSubmit(onSubmitTask)} className="p-4 border rounded-lg mb-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Task Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Task name is required" })}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register("dueDate", { required: "Due date is required" })}
                    className="mt-1"
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                  )}
                </div>

                <div>
                  <Label>Task Type</Label>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="audio"
                        checked={watch("isAudio")}
                        onCheckedChange={(checked) => setValue("isAudio", Boolean(checked))}
                      />
                      <Label htmlFor="audio">Audio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="video"
                        checked={watch("isVideo")}
                        onCheckedChange={(checked) => setValue("isVideo", Boolean(checked))}
                      />
                      <Label htmlFor="video">Video</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pdf"
                        checked={watch("isPdf")}
                        onCheckedChange={(checked) => setValue("isPdf", Boolean(checked))}
                      />
                      <Label htmlFor="pdf">PDF</Label>
                    </div>
                  </div>
                  {(!watch("isAudio") && !watch("isVideo") && !watch("isPdf")) && (
                    <p className="text-red-500 text-sm mt-1">Please select at least one task type</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button onClick={() => setShowTaskForm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    disabled={!watch("isAudio") && !watch("isVideo") && !watch("isPdf")}
                  >
                    Save Task
                  </Button>
                </div>
              </div>
            </form>
          )}

          <h3 className="font-medium text-gray-700">Tasks for this assignment:</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{task.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getTaskTypeClass(task)}`}
                  >
                    {getTaskTypeLabel(task)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Due: {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}