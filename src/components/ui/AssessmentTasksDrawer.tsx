"use client";
import { useState } from "react";
import { Button, Drawer } from "antd";
import { useForm } from "react-hook-form";
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

type Task = {
  id: number;
  name: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  dueDate: string;
};

type AssessmentTasksDrawerProps = {
  visible: boolean;
  onClose: () => void;
  assignmentName: string;
  initialTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
};

export function AssessmentTasksDrawer({
  visible,
  onClose,
  assignmentName,
  initialTasks,
  onTasksChange,
}: AssessmentTasksDrawerProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<TaskFormData>();

  const onSubmitTask = (data: TaskFormData) => {
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      name: data.name,
      isAudio: data.isAudio,
      isVideo: data.isVideo,
      isPdf: data.isPdf,
      dueDate: data.dueDate,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
    reset();
    setShowTaskForm(false);
  };

  const handleRemoveTask = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
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
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>{assignmentName}</span>
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
      onClose={onClose}
      open={visible}
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

        <h3 className="font-medium text-gray-700">Tasks for this assessment:</h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{task.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getTaskTypeClass(task)}`}
                  >
                    {getTaskTypeLabel(task)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Remove task"
                >
                  <svg
                    className="w-4 h-4"
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
              <div className="mt-2 text-sm text-gray-500">
                Due: {task.dueDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}