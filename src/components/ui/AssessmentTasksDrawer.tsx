"use client";
import { useState } from "react";
import { Button, Drawer, Select } from "antd";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const { Option } = Select;

type TaskFormData = {
  name: string;
  dueDate: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  isUrl: boolean;
  allocatedMarks: number;
  url?: string;
};

type Task = {
  id: number;
  name: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  isUrl: boolean;
  dueDate: string;
  allocatedMarks: number;
  url?: string;
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
  const [selectedType, setSelectedType] = useState<"task" | "quiz" | null>(
    null
  );
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: {
      name: "",
      dueDate: "",
      isAudio: false,
      isVideo: false,
      isPdf: false,
      isUrl: false,
      allocatedMarks: 0,
      url: "",
    },
  });

  const onSubmitTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      name: data.name,
      isAudio: data.isAudio,
      isVideo: data.isVideo,
      isPdf: data.isPdf,
      isUrl: data.isUrl,
      dueDate: data.dueDate,
      allocatedMarks: data.allocatedMarks,
      url: data.url,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
    reset();
    setSelectedType(null);
  };

  const quizes = [
    { id: 1, name: "Quiz 1", type: "quiz" },
    { id: 2, name: "Quiz 2", type: "quiz" },
  ];

  const handleRemoveTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const getTaskTypeLabel = (task: Task) => {
    if (task.isAudio) return "Audio";
    if (task.isVideo) return "Video";
    if (task.isPdf) return "PDF";
    if (task.isUrl) return "URL";
    return "Text";
  };

  const getTaskTypeClass = (task: Task) => {
    if (task.isVideo) return "bg-green-100 text-green-800";
    if (task.isPdf) return "bg-blue-100 text-blue-800";
    if (task.isAudio) return "bg-yellow-100 text-yellow-800";
    if (task.isUrl) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>{assignmentName}</span>
          <Select
            placeholder="Add"
            onChange={(value: "task" | "quiz") => setSelectedType(value)}
            value={selectedType || undefined}
            style={{ width: 140 }}
          >
            <Option value="task">Create Task</Option>
            <Option value="quiz">Create Quiz</Option>
          </Select>
        </div>
      }
      placement="right"
      onClose={() => {
        onClose();
        setSelectedType(null);
        reset();
      }}
      open={visible}
      width={500}
    >
      <div className="space-y-4">
        {/* Task Form */}
        {selectedType === "task" && (
          <form
            onSubmit={handleSubmit(onSubmitTask)}
            className="p-4 border rounded-lg mb-4"
          >
            <div className="space-y-4">
              {/* Task Name */}
              <div>
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Task name is required" })}
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate", { required: "Due date is required" })}
                  className="mt-1"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              {/* Allocated Marks */}
              <div>
                <Label htmlFor="allocatedMarks">Allocated Marks</Label>
                <Input
                  id="allocatedMarks"
                  type="number"
                  min={0}
                  {...register("allocatedMarks", {
                    required: "Allocated marks are required",
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                />
                {errors.allocatedMarks && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.allocatedMarks.message}
                  </p>
                )}
              </div>

              {/* Task Type Checkboxes */}
              <div>
                <Label>Task Type</Label>
                <div className="flex items-center space-x-4 mt-1">
                  {["Audio", "Video", "PDF", "URL"].map((type) => {
                    const field = `is${type}` as keyof TaskFormData;
                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.toLowerCase()}
                          checked={watch(field)}
                          onCheckedChange={(checked) =>
                            setValue(field, Boolean(checked))
                          }
                        />
                        <Label htmlFor={type.toLowerCase()}>{type}</Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setSelectedType(null)}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  Save Task
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Quiz Form Placeholder */}
        {selectedType === "quiz" && (
          <div className="p-4 border rounded-lg mb-4">
            <h3 className="font-medium text-lg mb-2">Add a Quiz</h3>
            <Select
              placeholder="Select Quiz"
              className="w-full"
              onChange={(quizId) => {
                const selectedQuiz = quizes.find((q) => q.id === quizId);
                if (selectedQuiz) {
                  const newTask: Task = {
                    id:
                      tasks.length > 0
                        ? Math.max(...tasks.map((t) => t.id)) + 1
                        : 1,
                    name: selectedQuiz.name,
                    isAudio: false,
                    isVideo: false,
                    isPdf: false,
                    isUrl: false,
                    dueDate: new Date().toISOString().slice(0, 10), // default to today
                    allocatedMarks: 0,
                    url: undefined,
                  };
                  const updatedTasks = [...tasks, newTask];
                  setTasks(updatedTasks);
                  onTasksChange(updatedTasks);
                  setSelectedType(null);
                }
              }}
            >
              {quizes.map((quiz) => (
                <Option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </Option>
              ))}
            </Select>
            <div className="flex justify-end mt-2">
              <Button onClick={() => setSelectedType(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Task List */}
        <h3 className="font-medium text-gray-700">
          Tasks for this assessment:
        </h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{task.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getTaskTypeClass(
                      task
                    )}`}
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
                Due: {task.dueDate} | Allocated Marks:{" "}
                <span className="font-medium">
                  {task.allocatedMarks || "50"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
