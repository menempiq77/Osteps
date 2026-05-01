"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  Select,
  message,
  Input as AntdInput,
  Checkbox,
  InputNumber,
  DatePicker,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  addTask,
  updateTask,
  deleteTask,
  removeTaskQuiz,
} from "@/services/api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { addQuize, assignTaskQuiz } from "@/services/quizApi";
import { IMG_BASE_URL } from "@/lib/config";
import { extractSubjectIdFromPath, toSubjectScopedPath } from "@/lib/subjectRouting";
import { buildTaskTypeValue, normalizeTaskRecord } from "@/lib/taskTypeMetadata";
import { RootState } from "@/store/store";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { GripVertical } from "lucide-react";

const { Option } = Select;
const { TextArea: AntdTextArea } = AntdInput;
const QUIZ_SUBJECT_MAP_KEY = "osteps_quiz_subject_map";
const ACTIVE_SUBJECT_STORAGE_KEY = "osteps-active-subject-id";

type TaskFormData = {
  name: string;
  description: string;
  dueDate: string;
  examMode: boolean;
  examStartAt: string;
  examDurationMinutes: number;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  isUrl: boolean;
  isNA: boolean;
  allocatedMarks: number;
  url?: string;
  file?: FileList;
};

type Task = {
  id: number;
  task_name: string;
  description: string;
  task_type: string;
  task_type_config?: unknown;
  due_date: string;
  allocated_marks: number;
  url?: string;
  exam_mode?: boolean;
  exam_start_at?: string | null;
  exam_duration_minutes?: number | null;
  exam_end_at?: string | null;
  // Frontend-only computed properties
  name?: string;
  dueDate?: string;
  allocatedMarks?: number;
  isAudio?: boolean;
  isVideo?: boolean;
  isPdf?: boolean;
  isUrl?: boolean;
  file_path?: string;
  type?: string;
  quiz_id?: number;
  quiz?: {
    id?: number | string;
    name?: string;
  };
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

function readQuizSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(QUIZ_SUBJECT_MAP_KEY) || "{}");
  } catch {
    return {};
  }
}

function tagQuizWithSubject(quizId: number, subjectId: number) {
  if (typeof window === "undefined") return;
  const map = readQuizSubjectMap();
  map[String(quizId)] = subjectId;
  localStorage.setItem(QUIZ_SUBJECT_MAP_KEY, JSON.stringify(map));
}

function getScopedSubjectId(): number | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const fromQuery = Number(params.get("subject_id") ?? 0);
  if (Number.isFinite(fromQuery) && fromQuery > 0) return fromQuery;

  const fromStorage = Number(localStorage.getItem(ACTIVE_SUBJECT_STORAGE_KEY) ?? 0);
  if (Number.isFinite(fromStorage) && fromStorage > 0) return fromStorage;

  return null;
}

function filterQuizzesBySubject(quizzes: any[], subjectId: number): any[] {
  const map = readQuizSubjectMap();
  return quizzes.filter((q) => {
    const backendSubjectId = q?.subject_id ?? q?.subject?.id ?? null;
    if (backendSubjectId != null && Number(backendSubjectId) !== 0) {
      return Number(backendSubjectId) === subjectId;
    }

    const localSubjectId = map[String(q?.id)];
    if (localSubjectId != null) {
      return localSubjectId === subjectId;
    }

    return false;
  });
}

function getTaskOrderStorageKey(assessmentId: number) {
  return `osteps-assessment-task-order-${assessmentId}`;
}

function getTaskIdentity(task: Task) {
  if (task?.type === "quiz") {
    return `quiz-${task.quiz_id ?? task.quiz?.id ?? task.id}`;
  }

  return `task-${task.id}`;
}

function isPdfFileName(fileName?: string | null) {
  return Boolean(fileName && /\.pdf$/i.test(fileName));
}

function sortTasksBySavedOrder(tasks: Task[], assessmentId: number): Task[] {
  if (typeof window === "undefined" || assessmentId <= 0) {
    return tasks;
  }

  try {
    const raw = localStorage.getItem(getTaskOrderStorageKey(assessmentId));
    if (!raw) return tasks;

    const savedOrder = JSON.parse(raw);
    if (!Array.isArray(savedOrder) || savedOrder.length === 0) {
      return tasks;
    }

    const rank = new Map(savedOrder.map((id: string, index: number) => [id, index]));

    return [...tasks].sort((left, right) => {
      const leftRank = rank.get(getTaskIdentity(left));
      const rightRank = rank.get(getTaskIdentity(right));

      if (leftRank == null && rightRank == null) return 0;
      if (leftRank == null) return 1;
      if (rightRank == null) return -1;
      return leftRank - rightRank;
    });
  } catch {
    return tasks;
  }
}

function persistTaskOrder(assessmentId: number, tasks: Task[]) {
  if (typeof window === "undefined" || assessmentId <= 0) {
    return;
  }

  localStorage.setItem(
    getTaskOrderStorageKey(assessmentId),
    JSON.stringify(tasks.map(getTaskIdentity))
  );
}

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
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedType, setSelectedType] = useState<"task" | "quiz" | null>(
    null
  );
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [newQuizName, setNewQuizName] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState<any[]>([]);
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const scopedSubjectId = getScopedSubjectId();
  const visibleQuizzes =
    scopedSubjectId && scopedSubjectId > 0
      ? filterQuizzesBySubject(quizzes, scopedSubjectId)
      : quizzes;
  const availableQuizzes = [
    ...visibleQuizzes,
    ...createdQuizzes.filter(
      (createdQuiz) =>
        !visibleQuizzes.some(
          (quiz) => Number(quiz?.id) === Number(createdQuiz?.id)
        )
    ),
  ];
  const resolvedSubjectId = extractSubjectIdFromPath(pathname || "") ?? scopedSubjectId;
  const schoolId = currentUser?.school;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<TaskFormData>({
    defaultValues: {
      name: "",
      description: "",
      dueDate: "",
      examMode: false,
      examStartAt: "",
      examDurationMinutes: 60,
      isAudio: false,
      isVideo: false,
      isPdf: false,
      isUrl: false,
      isNA: false,
      allocatedMarks: 0,
      url: "",
    },
  });
  const examModeEnabled = watch("examMode");

  useEffect(() => {
    setOrderedTasks(sortTasksBySavedOrder(initialTasks ?? [], assessmentId));
  }, [assessmentId, initialTasks]);

  const onSubmitTask = async (data: TaskFormData) => {
    try {
      setLoading(true);

      let taskType: string | null = null;

      if (data.isNA) {
        taskType = null;
      } else if (data.isAudio) {
        taskType = "audio";
      } else if (data.isVideo) {
        taskType = "video";
      } else if (data.isPdf) {
        taskType = "pdf";
      } else if (data.isUrl) {
        taskType = "url";
      } else {
        messageApi.error("Please select at least one task type");
        return;
      }

      const taskTypeValue = buildTaskTypeValue({
        taskType,
        examMode: Boolean(data.examMode),
        examStartAt: data.examStartAt,
        examDurationMinutes: data.examDurationMinutes,
      });

      const editingTask = editingTaskId
        ? orderedTasks.find((task) => task.id === editingTaskId)
        : null;
      const selectedFileName = data.file?.length
        ? data.file[0]?.name
        : editingTask?.file_path;

      if (data.examMode) {
        if (taskType !== "pdf") {
          messageApi.error("Exam mode is only available for PDF tasks.");
          return;
        }

        if (!selectedFileName || !isPdfFileName(selectedFileName)) {
          messageApi.error("Exam mode requires an uploaded PDF file.");
          return;
        }

        if (!data.examStartAt) {
          messageApi.error("Please choose when the exam should open.");
          return;
        }

        if (!Number.isFinite(Number(data.examDurationMinutes)) || Number(data.examDurationMinutes) <= 0) {
          messageApi.error("Please enter a valid exam duration in minutes.");
          return;
        }
      }

      const resolvedDueDate = data.examMode
        ? dayjs(data.examStartAt)
            .add(Number(data.examDurationMinutes), "minute")
            .format("YYYY-MM-DD")
        : data.dueDate;

      const formData = new FormData();
      formData.append("assessment_id", assessmentId.toString());
      formData.append("task_name", data.name);
      formData.append("description", data.description);
      formData.append("due_date", resolvedDueDate);
      formData.append("allocated_marks", data.allocatedMarks.toString());

      if (taskTypeValue && typeof taskTypeValue === "object") {
        Object.entries(taskTypeValue).forEach(([key, value]) => {
          if (value == null || value === "") return;
          formData.append(`task_type[${key}]`, String(value));
        });
      } else if (typeof taskTypeValue === "string") {
        formData.append("task_type", taskTypeValue);
      } else {
        formData.append("task_type", "null");
      }

      if (data.isUrl && data.url  && !data.isNA) {
        formData.append("url", data.url);
      }

      if (data.file && data.file.length > 0) {
        formData.append("file_path", data.file[0]);
      }

      let updatedTasks;
      if (editingTaskId) {
        const updatedTask = await updateTask(editingTaskId.toString(), formData);
        updatedTasks = orderedTasks?.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...normalizeTaskRecord(updatedTask),
                isAudio: updatedTask?.task_type === "audio",
                isVideo: updatedTask?.task_type === "video",
                isPdf: updatedTask?.task_type === "pdf",
                isUrl: updatedTask?.task_type === "url",
              }
            : task
        );
        messageApi.success("Task updated successfully");
      } else {
        const newTask = await addTask(formData);
        updatedTasks = [
          ...orderedTasks,
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
        persistTaskOrder(assessmentId, updatedTasks);
        messageApi.success("Task added successfully");
      }

      setOrderedTasks(updatedTasks);
      onTasksChange(updatedTasks);
      reset();
      setEditingTaskId(null);
      setSelectedType(null);
    } catch (error) {
      messageApi.error(
        editingTaskId ? "Failed to update task" : "Failed to add task"
      );
      console.error("Error submitting task:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAssignQuiz = async () => {
    if (!selectedQuizId) {
      message.error("Please select a quiz");
      return;
    }

    try {
      setLoading(true);
      await assignTaskQuiz(selectedQuizId, assessmentId, resolvedSubjectId ?? undefined);
      messageApi.success("Quiz assigned successfully");

      const selectedQuiz = availableQuizzes.find((q) => Number(q.id) === Number(selectedQuizId));
      if (selectedQuiz) {
        const newQuizTask = {
          id: Date.now(), // temporary unique ID for frontend
          quiz_id: selectedQuizId,
          type: "quiz",
          quiz: selectedQuiz,
          task_name: selectedQuiz.name,
        };

        const updatedTasks = [...orderedTasks, newQuizTask];
        persistTaskOrder(assessmentId, updatedTasks);
        setOrderedTasks(updatedTasks);
        onTasksChange(updatedTasks);
      }

      setSelectedType(null);
      setSelectedQuizId(null);
    } catch (error) {
      messageApi.error("Failed to assign quiz");
      console.error("Error assigning quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndAssignQuiz = async () => {
    const trimmedName = newQuizName.trim();
    if (!trimmedName) {
      messageApi.error("Please enter a quiz title");
      return;
    }

    if (!schoolId) {
      messageApi.error("Missing school information for quiz creation");
      return;
    }

    let createdQuizId: number | null = null;

    try {
      setLoading(true);

      const result = await addQuize(
        { name: trimmedName, school_id: schoolId },
        resolvedSubjectId ?? undefined
      );
      createdQuizId = Number(result?.data?.id ?? result?.id ?? 0);

      if (!Number.isFinite(createdQuizId) || createdQuizId <= 0) {
        throw new Error("Quiz was created without an id");
      }

      if (resolvedSubjectId && Number(resolvedSubjectId) > 0) {
        tagQuizWithSubject(createdQuizId, Number(resolvedSubjectId));
      }

      await assignTaskQuiz(createdQuizId, assessmentId, resolvedSubjectId ?? undefined);

      const createdQuizRecord = {
        ...(result?.data ?? result ?? {}),
        id: createdQuizId,
        name: result?.data?.name ?? result?.name ?? trimmedName,
        subject_id: resolvedSubjectId ?? undefined,
      };

      setCreatedQuizzes((previous) => [
        ...previous.filter((quiz) => Number(quiz?.id) !== createdQuizId),
        createdQuizRecord,
      ]);

      const updatedTasks = [
        ...orderedTasks,
        {
          id: Date.now(),
          quiz_id: createdQuizId,
          type: "quiz",
          quiz: createdQuizRecord,
          task_name: createdQuizRecord.name,
        },
      ];

      persistTaskOrder(assessmentId, updatedTasks);
      setOrderedTasks(updatedTasks);
      onTasksChange(updatedTasks);
      setNewQuizName("");
      setSelectedQuizId(null);
      setSelectedType(null);
      messageApi.success("Quiz created and assigned successfully");
    } catch (error) {
      if (createdQuizId) {
        messageApi.error("Quiz was created but could not be assigned");
      } else {
        messageApi.error("Failed to create and assign quiz");
      }
      console.error("Error creating and assigning quiz:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setSelectedType(null);

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
    setValue("isNA", !taskType);
    setValue("examMode", Boolean(task.exam_mode));
    setValue("examStartAt", task.exam_start_at || "");
    setValue("examDurationMinutes", task.exam_duration_minutes ?? 60);
  };

  const handleRemoveTask = async (task: Task) => {
    try {
      setLoading(true);

      if (task?.type === "quiz") {
        // Remove quiz assignment
        await removeTaskQuiz(task.quiz_id); // or task.quiz_id if your backend expects quiz_id
        messageApi.success("Quiz unassigned successfully");
      } else {
        // Remove normal task
        await deleteTask(task.id);
        messageApi.success("Task deleted successfully");
      }

      // Update local state
      const updatedTasks = orderedTasks.filter((t) => t.id !== task.id);
      persistTaskOrder(assessmentId, updatedTasks);
      setOrderedTasks(updatedTasks);
      onTasksChange(updatedTasks);
    } catch (error) {
      messageApi.error("Failed to delete task");
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeLabel = (task: Task) => {
    if (task.exam_mode && task.task_type?.toLowerCase() === "pdf") {
      return "PDF Exam";
    }

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
    if (task.exam_mode && task.task_type?.toLowerCase() === "pdf") {
      return "bg-rose-100 text-rose-800";
    }

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
    setSelectedQuizId(null);
    setNewQuizName("");
    reset();
    setEditingTaskId(null);
  };

  const handleEditQuiz = (task: Task) => {
    const quizId = Number(task.quiz_id ?? task.quiz?.id ?? 0);
    if (!Number.isFinite(quizId) || quizId <= 0) {
      messageApi.error("This quiz cannot be edited right now");
      return;
    }

    const subjectId = extractSubjectIdFromPath(pathname || "") ?? scopedSubjectId;
    const quizPath = subjectId
      ? toSubjectScopedPath(`/dashboard/quiz/${quizId}`, Number(subjectId))
      : `/dashboard/quiz/${quizId}`;

    onClose();
    handleCancel();
    router.push(quizPath);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const nextTasks = [...orderedTasks];
    const [movedTask] = nextTasks.splice(result.source.index, 1);
    nextTasks.splice(result.destination.index, 0, movedTask);

    setOrderedTasks(nextTasks);
    persistTaskOrder(assessmentId, nextTasks);
  };

  const renderTaskForm = (isInlineEdit = false) => (
    <form
      onSubmit={handleSubmit(onSubmitTask)}
      className={`p-4 border rounded-lg ${isInlineEdit ? "mt-3 bg-white" : "mb-4"}`}
    >
      <div className="space-y-4">
        <h3 className="font-medium text-lg">
          {editingTaskId ? "Edit Task" : "Create New Task"}
        </h3>

        <div>
          <p className="font-medium">Task Name</p>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Task name is required" }}
            render={({ field }) => (
              <AntdInput
                {...field}
                id="name"
                className="!mt-1"
                disabled={loading}
                status={errors.name ? "error" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <p className="font-medium">Description</p>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <AntdTextArea
                {...field}
                id="description"
                className="!mt-1"
                disabled={loading}
                rows={3}
                placeholder="Enter task description..."
                status={errors.description ? "error" : ""}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">Upload File (Optional)</p>
            <Controller
              name="examMode"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    field.onChange(checked);
                    if (checked) {
                      setValue("isAudio", false);
                      setValue("isVideo", false);
                      setValue("isUrl", false);
                      setValue("isNA", false);
                      setValue("isPdf", true);
                    }
                  }}
                  disabled={loading}
                >
                  Exam mode
                </Checkbox>
              )}
            />
          </div>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <AntdInput
                type="file"
                id="file"
                className="!mt-1"
                disabled={loading}
                onChange={(e) => field.onChange(e.target.files)}
              />
            )}
          />
          {examModeEnabled && (
            <p className="mt-2 text-sm text-amber-700">
              Exam mode opens this uploaded PDF only during the scheduled exam window and shows a live countdown for students.
            </p>
          )}
        </div>

        {examModeEnabled && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-medium">Exam Opens At</p>
                <Controller
                  name="examStartAt"
                  control={control}
                  rules={{
                    validate: (value) =>
                      !examModeEnabled || value
                        ? true
                        : "Exam start date and time are required",
                  }}
                  render={({ field }) => (
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      value={field.value ? dayjs(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(
                          date ? date.format("YYYY-MM-DDTHH:mm:ssZ") : ""
                        )
                      }
                      disabled={loading}
                      status={errors.examStartAt ? "error" : ""}
                      className="!mt-1 !w-full"
                      format="YYYY-MM-DD HH:mm"
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  )}
                />
                {errors.examStartAt && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.examStartAt.message}
                  </p>
                )}
              </div>

              <div>
                <p className="font-medium">Exam Duration (Minutes)</p>
                <Controller
                  name="examDurationMinutes"
                  control={control}
                  rules={{
                    validate: (value) =>
                      !examModeEnabled || Number(value) > 0
                        ? true
                        : "Exam duration must be greater than 0",
                  }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={1}
                      className="!mt-1 !w-full"
                      disabled={loading}
                      status={errors.examDurationMinutes ? "error" : ""}
                      onChange={(value) => field.onChange(Number(value || 0))}
                    />
                  )}
                />
                {errors.examDurationMinutes && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.examDurationMinutes.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {examModeEnabled ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Due date is handled automatically from the exam opening time and duration.
          </div>
        ) : (
          <div>
            <p className="font-medium">Due Date</p>
            <Controller
              name="dueDate"
              control={control}
              rules={{ required: "Due date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : undefined}
                  onChange={(date: Dayjs | null, dateString: string) =>
                    field.onChange(dateString)
                  }
                  disabled={loading}
                  status={errors.dueDate ? "error" : ""}
                  className="!w-full !mt-1"
                  format="YYYY-MM-DD"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              )}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        )}

        <div>
          <p className="font-medium">Allocated Marks</p>
          <Controller
            name="allocatedMarks"
            control={control}
            rules={{
              required: "Allocated marks are required",
            }}
            render={({ field }) => (
              <InputNumber
                {...field}
                id="allocatedMarks"
                min={0}
                className="!mt-1 !w-full"
                disabled={loading}
                status={errors.allocatedMarks ? "error" : ""}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          {errors.allocatedMarks && (
            <p className="text-red-500 text-sm mt-1">
              {errors.allocatedMarks.message}
            </p>
          )}
        </div>

        <div>
          <p className="font-medium">Task Type</p>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-2">
              <Controller
                name="isAudio"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="audio"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("isUrl", false);
                        setValue("isNA", false);
                      }
                    }}
                    disabled={loading || examModeEnabled}
                  >
                    Audio
                  </Checkbox>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isVideo"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="video"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("isUrl", false);
                        setValue("isNA", false);
                      }
                    }}
                    disabled={loading || examModeEnabled}
                  >
                    Video
                  </Checkbox>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isPdf"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="pdf"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("isUrl", false);
                        setValue("isNA", false);
                      }
                    }}
                    disabled={loading || examModeEnabled}
                  >
                    PDF
                  </Checkbox>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isUrl"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="url"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("isAudio", false);
                        setValue("isVideo", false);
                        setValue("isPdf", false);
                        setValue("isNA", false);
                      }
                    }}
                    disabled={loading || examModeEnabled}
                  >
                    URL
                  </Checkbox>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isNA"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("isAudio", false);
                        setValue("isVideo", false);
                        setValue("isPdf", false);
                        setValue("isUrl", false);
                        setValue("url", "");
                      }
                    }}
                    disabled={loading || examModeEnabled}
                  >
                    N/A
                  </Checkbox>
                )}
              />
            </div>
          </div>

          {!watch("isAudio") &&
            !watch("isPdf") &&
            !watch("isVideo") &&
            !watch("isUrl") &&
            !watch("isNA") && (
              <p className="text-red-500 text-sm mt-1">
                Please select at least one task type
              </p>
            )}
        </div>

        {watch("isUrl") && (
          <div>
            <p>URL</p>
            <Controller
              name="url"
              control={control}
              rules={{
                required: "URL is required for URL tasks",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message:
                    "Please enter a valid URL starting with http:// or https://",
                },
              }}
              render={({ field }) => (
                <AntdInput
                  {...field}
                  id="url"
                  type="url"
                  className="!mt-1"
                  placeholder="https://example.com"
                  disabled={loading}
                  status={errors.url ? "error" : ""}
                />
              )}
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
            )}
          </div>
        )}

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
  );

  return (
    <>
      {contextHolder}
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
          {selectedType === "task" && !editingTaskId && renderTaskForm()}

          {/* Quiz Form Placeholder */}
          {selectedType === "quiz" && (
            <div className="mb-4 space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="mb-2 text-lg font-medium">Assign or Create a Quiz</h3>
                <p className="text-sm text-gray-500">Choose an existing quiz or create a new one and attach it here immediately.</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Assign existing quiz</p>
                <Select
                  placeholder="Select Quiz"
                  className="w-full"
                  disabled={loading}
                  onChange={(value) => setSelectedQuizId(value)}
                  value={selectedQuizId || undefined}
                  notFoundContent="No quizzes available"
                >
                  {availableQuizzes?.map((quiz) => (
                    <Option key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </Option>
                  ))}
                </Select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleAssignQuiz}
                    className="rounded-lg px-4 h-8 font-medium text-sm text-white cursor-pointer border-none"
                    style={{ backgroundColor: "var(--primary)" }}
                    disabled={loading}
                  >
                    Assign Selected Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700">Create new quiz and assign it</p>
                <AntdInput
                  value={newQuizName}
                  onChange={(event) => setNewQuizName(event.target.value)}
                  placeholder="Quiz title"
                  disabled={loading}
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={handleCancel} disabled={loading}>Cancel</Button>
                  <button
                    type="button"
                    onClick={handleCreateAndAssignQuiz}
                    className="rounded-lg px-4 h-8 font-medium text-sm text-white cursor-pointer border-none"
                    style={{ backgroundColor: "var(--primary)" }}
                    disabled={loading}
                  >
                    Create and Assign
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          <h3 className="font-medium text-gray-700">
            Tasks for this {assignmentName}:
          </h3>
          {orderedTasks.length > 1 && (
            <p className="text-xs text-gray-500">Hold the grip and drag tasks up or down to reorder them.</p>
          )}
          {loading && !selectedType ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : orderedTasks?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No tasks added yet
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={`assessment-tasks-${assessmentId}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {orderedTasks?.map((task, index) => (
                      <Draggable
                        key={getTaskIdentity(task)}
                        draggableId={getTaskIdentity(task)}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <Card
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            className="!mb-2 !bg-gray-50 !shadow"
                          >
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                {...draggableProvided.dragHandleProps}
                                className="mt-1 cursor-grab touch-none select-none text-gray-300 transition-colors hover:text-gray-500"
                                aria-label={`Reorder ${task?.task_name || task?.quiz?.name || "task"}`}
                              >
                                <GripVertical size={18} />
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center justify-between gap-3">
                                  <div className="flex min-w-0 items-center space-x-2">
                                    <p className="truncate font-medium">
                                      {task?.task_name || task?.quiz?.name}
                                    </p>

                                    <span
                                      className={`shrink-0 px-2.5 py-0.5 text-xs rounded-full ${getTaskTypeClass(
                                        task
                                      )}`}
                                    >
                                      {task?.type !== "quiz"
                                        ? getTaskTypeLabel(task)
                                        : "Quiz"}
                                    </span>
                                  </div>
                                  <div className="flex shrink-0 space-x-2">
                                    <button
                                      onClick={() =>
                                        task?.type === "quiz"
                                          ? handleEditQuiz(task)
                                          : handleEditTask(task)
                                      }
                                      className="cursor-pointer text-green-500 hover:text-green-700"
                                      title={task?.type === "quiz" ? "Edit quiz" : "Edit task"}
                                      disabled={loading}
                                    >
                                      <EditOutlined />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveTask(task)}
                                      className="cursor-pointer text-red-500 hover:text-red-700"
                                      title="Remove task"
                                      disabled={loading}
                                    >
                                      <DeleteOutlined />
                                    </button>
                                  </div>
                                </div>
                                <p className="mb-4 text-sm text-gray-600">
                                  {task?.description || "No description provided"}
                                </p>
                                {task?.exam_mode && task?.exam_start_at && (
                                  <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                    Opens {dayjs(task.exam_start_at).format("DD MMM YYYY, HH:mm")} for {task.exam_duration_minutes || 0} minute{task.exam_duration_minutes === 1 ? "" : "s"}.
                                  </div>
                                )}
                                {task?.file_path && (
                                  <div className="mt-3">
                                    <a
                                      href={`${IMG_BASE_URL}/storage/${task.file_path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                      Attached document
                                    </a>
                                  </div>
                                )}
                                {task?.type !== "quiz" && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    {task?.exam_mode ? null : (
                                      <>
                                        Due: {task?.due_date} | {" "}
                                      </>
                                    )}
                                    Allocated Marks:{" "}
                                    <span className="font-medium">
                                      {task?.allocated_marks}
                                    </span>
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
                                {editingTaskId === task.id && renderTaskForm(true)}
                              </div>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </Drawer>
    </>
  );
}
