"use client";
import { useState } from "react";
import { Button, Card, Drawer, Select, message } from "antd";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextArea } from "./textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addTask,
  updateTask,
  deleteTask,
  assignTaskQuiz,
} from "@/services/api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

type TaskFormData = {
  name: string;
  description: string;
  dueDate: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  isUrl: boolean;
  allocatedMarks: number;
  url?: string;
  file?: FileList;
};

type Task = {
  id: number;
  task_name: string;
  task_type: string;
  due_date: string;
  allocated_marks: number;
  url?: string;
  // Frontend-only computed properties
  name?: string;
  dueDate?: string;
  allocatedMarks?: number;
  isAudio?: boolean;
  isVideo?: boolean;
  isPdf?: boolean;
  isUrl?: boolean;
};

type AssessmentTasksDrawerProps = {
  visible: boolean;
  onClose: () => void;
  assignmentName: string;
  assessmentId: number;
  initialTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  quizzes: any[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectedTermId: string | null;
};

export function AssessmentTasksDrawer({
  visible,
  onClose,
  assignmentName,
  assessmentId,
  initialTasks,
  onTasksChange,
  quizzes,
  loading,
  setLoading,
  selectedTermId,
}: AssessmentTasksDrawerProps) {
  const [selectedType, setSelectedType] = useState<"task" | "quiz" | null>(
    null
  );
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

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
      description: "",
      dueDate: "",
      isAudio: false,
      isVideo: false,
      isPdf: false,
      isUrl: false,
      allocatedMarks: 0,
      url: "",
    },
  });

  console.log(selectedTermId, "selectedTermId");

  const onSubmitTask = async (data: TaskFormData) => {
    try {
      setLoading(true);

      // Determine task type based on selected checkboxes
      let taskType = "";
      if (data.isAudio) taskType = "audio";
      else if (data.isVideo) taskType = "video";
      else if (data.isPdf) taskType = "pdf";
      else if (data.isUrl) taskType = "url";
      else {
        message.error("Please select at least one task type");
        return;
      }

      const formData = new FormData();
      formData.append("assessment_id", assessmentId.toString());
      formData.append("task_name", data.name);
      formData.append("description", data.description);
      formData.append("due_date", data.dueDate);
      formData.append("allocated_marks", data.allocatedMarks.toString());
      formData.append("task_type", taskType);

      if (data.isUrl && data.url) {
        formData.append("url", data.url);
      }

      if (data.file && data.file.length > 0) {
        formData.append("file_path", data.file[0]);
      }

      let updatedTasks;
      if (editingTaskId) {
        await updateTask(editingTaskId.toString(), formData);
        updatedTasks = initialTasks?.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                task_name: data.name,
                description: data.description,
                due_date: data.dueDate,
                allocated_marks: data.allocatedMarks,
                task_type: taskType,
                url: data.isUrl ? data.url : null,
                file_path: data.file ? "updated-file-path" : task.file_path,
                isAudio: taskType === "audio",
                isVideo: taskType === "video",
                isPdf: taskType === "pdf",
                isUrl: taskType === "url",
              }
            : task
        );
        message.success("Task updated successfully");
      } else {
        const newTask = await addTask(formData);
        updatedTasks = [
          ...initialTasks,
          {
            ...newTask,
            name: newTask.task_name,
            dueDate: newTask.due_date,
            allocatedMarks: newTask.allocated_marks,
            isAudio: newTask.task_type === "audio",
            isVideo: newTask.task_type === "video",
            isPdf: newTask.task_type === "pdf",
            isUrl: newTask.task_type === "url",
          },
        ];
        message.success("Task added successfully");
      }

      onTasksChange(updatedTasks);
      reset();
      setEditingTaskId(null);
      setSelectedType(null);
    } catch (error) {
      message.error(
        editingTaskId ? "Failed to update task" : "Failed to add task"
      );
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAssignQuiz = async () => {
    if (!selectedQuizId || !selectedTermId) {
      message.error("Please select both a term and a quiz");
      return;
    }

    try {
      setLoading(true);
      await assignTaskQuiz(
        parseInt(selectedTermId),
        selectedQuizId,
        assessmentId
      );
      message.success("Quiz assigned successfully");
      // You might want to refresh the task list or add the quiz to initialTasks
      setSelectedType(null);
      setSelectedQuizId(null);
    } catch (error) {
      message.error("Failed to assign quiz");
      console.error("Error assigning quiz:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setSelectedType("task");

    setValue("name", task.task_name);
    setValue("description", task.description);
    setValue("dueDate", task.due_date);

    const taskType = task.task_type?.toLowerCase();
    setValue("isAudio", taskType === "audio");
    setValue("isVideo", taskType === "video");
    setValue("isPdf", taskType === "pdf");
    setValue("isUrl", taskType === "url");

    setValue("allocatedMarks", task.allocated_marks);
    setValue("url", task.url || "");
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = initialTasks.filter((task) => task.id !== taskId);
      onTasksChange(updatedTasks);
      message.success("Task deleted successfully");
    } catch (error) {
      message.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const getTaskTypeLabel = (task: Task) => {
    switch (task.task_type?.toLowerCase()) {
      case "pdf":
        return "PDF";
      case "audio":
        return "Audio";
      case "video":
        return "Video";
      case "url":
        return "URL";
      default:
        return "Text";
    }
  };

  const getTaskTypeClass = (task: Task) => {
    switch (task.task_type?.toLowerCase()) {
      case "pdf":
        return "bg-blue-100 text-blue-800";
      case "audio":
        return "bg-yellow-100 text-yellow-800";
      case "video":
        return "bg-green-100 text-green-800";
      case "url":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
    reset();
    setEditingTaskId(null);
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>{assignmentName}</span>
          <div style={{ "--antd-wave-shadow-color": "#38C16C" }}>
            <style>{`
                    .green-select .ant-select-selection-placeholder {
                      color: #38C16C !important;
                    }
                    .green-select .ant-select-selector {
                      border-color: #38C16C !important;
                    }
                  `}</style>
            <Select
              className="green-select"
              placeholder="Add Task/Quiz"
              onChange={(value: "task" | "quiz") => setSelectedType(value)}
              value={selectedType || undefined}
              style={{ width: 160 }}
              disabled={loading}
            >
              <Option value="task">Create Task</Option>
              <Option value="quiz">Assign Quiz</Option>
            </Select>
          </div>
        </div>
      }
      placement="right"
      onClose={() => {
        onClose();
        handleCancel();
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
              <h3 className="font-medium text-lg">
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </h3>

              {/* Task Name */}
              <div>
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Task name is required" })}
                  className="mt-1"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="!mt-1"
                  disabled={loading}
                  rows={3}
                  placeholder="Enter task description..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="file">Upload File (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  {...register("file")}
                  className="mt-1 cursor-pointer"
                  disabled={loading}
                />
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate", { required: "Due date is required" })}
                  className="mt-1"
                  disabled={loading}
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
                  disabled={loading}
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
                  {/* Audio */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="audio"
                      checked={Boolean(watch("isAudio"))}
                      onCheckedChange={(checked) => {
                        setValue("isAudio", Boolean(checked));
                        if (checked) {
                          setValue("isUrl", false);
                        }
                      }}
                      disabled={loading}
                    />
                    <Label htmlFor="audio">Audio</Label>
                  </div>

                  {/* Video */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="video"
                      checked={Boolean(watch("isVideo"))}
                      onCheckedChange={(checked) => {
                        setValue("isVideo", Boolean(checked));
                        if (checked) {
                          setValue("isUrl", false);
                        }
                      }}
                      disabled={loading}
                    />
                    <Label htmlFor="video">Video</Label>
                  </div>

                  {/* PDF */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pdf"
                      checked={Boolean(watch("isPdf"))}
                      onCheckedChange={(checked) => {
                        setValue("isPdf", Boolean(checked));
                        if (checked) {
                          setValue("isUrl", false);
                        }
                      }}
                      disabled={loading}
                    />
                    <Label htmlFor="pdf">PDF</Label>
                  </div>

                  {/* URL */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="url"
                      checked={Boolean(watch("isUrl"))}
                      onCheckedChange={(checked) => {
                        setValue("isUrl", Boolean(checked));
                        if (checked) {
                          setValue("isAudio", false);
                          setValue("isVideo", false);
                          setValue("isPdf", false);
                        }
                      }}
                      disabled={loading}
                    />
                    <Label htmlFor="url">URL</Label>
                  </div>
                </div>

                {!watch("isAudio") &&
                  !watch("isPdf") &&
                  !watch("isVideo") &&
                  !watch("isUrl") && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select at least one task type
                    </p>
                  )}
              </div>

              {/* URL Input (shown only when isUrl is checked) */}
              {watch("isUrl") && (
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    {...register("url", {
                      required: "URL is required for URL tasks",
                    })}
                    className="mt-1"
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                  {errors.url && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.url.message}
                    </p>
                  )}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleCancel}
                  className="!bg-tranperant hover:!text-primary/90 hover:!border-primary/90"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="!bg-primary !border-primary hover:!bg-primary/90 hover:!border-primary/90"
                  loading={loading}
                >
                  {editingTaskId ? "Update Task" : "Save Task"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Quiz Form Placeholder */}
        {selectedType === "quiz" && (
          <div className="p-4 border rounded-lg mb-4">
            <h3 className="font-medium text-lg mb-2">Assign a Quiz</h3>
            <Select
              placeholder="Select Quiz"
              className="w-full"
              disabled={loading}
              onChange={(value) => setSelectedQuizId(value)}
              value={selectedQuizId || undefined}
            >
              {quizzes?.map((quiz) => (
                <Option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </Option>
              ))}
            </Select>
            <div className="flex justify-end gap-1 mt-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                variant="solid"
                className="!bg-primary !text-white hover:!bg-primary/90 !border-0"
                disabled={loading || !selectedQuizId || !selectedTermId}
                onClick={handleAssignQuiz}
              >
                Assign
              </Button>
            </div>
          </div>
        )}

        {/* Task List */}
        <h3 className="font-medium text-gray-700">
          Tasks for this {assignmentName}:
        </h3>
        {loading && !selectedType ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : initialTasks?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No tasks added yet
          </div>
        ) : (
          <div className="space-y-2">
            {initialTasks?.map((task, index) => (
              <Card key={index} className="!bg-gray-50 !shadow !mb-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">
                      {task?.task_name || task?.quiz?.name}
                    </p>

                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full ${getTaskTypeClass(
                        task
                      )}`}
                    >
                      {task?.type !== "quiz" ? getTaskTypeLabel(task) : "Quiz"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {task?.type !== "quiz" && (
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title="Edit task"
                        disabled={loading}
                      >
                        <EditOutlined />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveTask(task.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Remove task"
                      disabled={loading}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {task?.description || "No description provided"}
                </p>
                {task?.type !== "quiz" && (
                  <div className="mt-2 text-sm text-gray-500">
                    Due: {task?.due_date} | Allocated Marks:{" "}
                    <span className="font-medium">{task?.allocated_marks}</span>
                  </div>
                )}
                {task?.task_type === "url" && task?.url && (
                  <div className="mt-1 text-sm">
                    <a
                      href={task?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {task?.url}
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
