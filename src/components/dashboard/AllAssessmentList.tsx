"use client";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, TeamOutlined, FileTextOutlined, BookOutlined, CopyOutlined } from "@ant-design/icons";
import { AssessmentTasksDrawer } from "../ui/AssessmentTasksDrawer";
import AssessmentAssignDrawer from "./AssessmentAssignDrawer";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchTasks, reorderAssessments } from "@/services/api";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { message } from "antd";


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

export interface Quiz {
  id: string | number;
  name: string;
}

interface Assessment {
  id: string;
  name: string;
  type: "assessment" | "quiz";
  quiz_id?: string;
  quiz?: Quiz;
}

interface AssessmentListProps {
  assessments: Assessment[];
  onDeleteAssessment: (id: string) => void;
  onEditAssessment?: (assessment: Assessment) => void;
  onDuplicateAssessment?: (assessment: Assessment) => void;
  quizzes: any[];
  termId: number;
}

export interface Term {
  id: number;
  name: string;
}

export default function AllAssessmentList({
  assessments,
  onDeleteAssessment,
  onEditAssessment,
  onDuplicateAssessment,
  quizzes,
  termId,
}: AssessmentListProps) {
  const router = useRouter();
  const { classId } = useParams<{ classId: string }>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [assessmentList, setAssessmentList] = useState(assessments);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [assigningAssessment, setAssigningAssessment] = useState<Assessment | null>(null);

  const [selectedTermId, setSelectedTermId] = useState<string | null>(
    termId ? termId.toString() : null
  );
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setAssessmentList(assessments);
  }, [assessments]);

  useEffect(() => {
    if (drawerVisible && selectedAssessment) {
      loadTasks();
    }
  }, [drawerVisible, selectedAssessment]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      if (!selectedAssessment) return;

      const fetchedTasks: Task[] = await fetchTasks(selectedAssessment);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "HOD";

  const handleAssignmentClick = (
    assignmentId: string,
    type: "assessment" | "quiz",
    quizId?: string
  ) => {
    if (type === "quiz") {
      router.push(
        `/dashboard/classes/${classId}/terms/${selectedTermId}/quiz/${quizId}`
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

  const handleAssignAssesment = (assessment: Assessment) => {
    setAssigningAssessment(assessment);
    setAssignDrawerOpen(true);
  };

  const handleTasksChange = async () => {
    try {
      setLoading(true);
      if (selectedAssessment) {
        const freshTasks = await fetchTasks(selectedAssessment);
        setTasks(freshTasks);
      }
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = [...assessmentList];
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);

    setAssessmentList(newOrder);

    const payload = newOrder.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      await reorderAssessments(payload);

      messageApi.success("Assessment order updated");
    } catch (err) {
      console.error("Reorder API failed:", err);

      messageApi.error("Failed to update order");
    }
  };

  return (
    <div className="mt-4">
      {contextHolder}
      <div className="premium-card rounded-xl p-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="assessmentTable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col gap-2 p-3"
              >
                {assessmentList.length > 0 ? (
                  assessmentList.map((assignment, index) => (
                    <Draggable
                      key={assignment.id}
                      draggableId={assignment.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden group"
                        >
                          <div className="flex items-center gap-3 p-3 md:p-4">
                            {/* Drag handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex-shrink-0 cursor-grab text-gray-300 hover:text-gray-500 transition-colors"
                            >
                              <GripVertical size={18} />
                            </div>

                            {/* Type icon */}
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                                assignment.type === "quiz"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-green-50 text-green-600"
                              }`}
                            >
                              {assignment.type === "quiz" ? (
                                <BookOutlined className="text-base" />
                              ) : (
                                <FileTextOutlined className="text-base" />
                              )}
                            </div>

                            {/* Name + badge */}
                            <div className="flex-1 min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAssignmentClick(
                                    assignment.id,
                                    assignment.type,
                                    assignment.quiz_id
                                  )
                                }
                                className="text-left font-semibold text-gray-800 hover:text-[var(--primary)] hover:underline cursor-pointer transition-colors text-sm md:text-base block w-full truncate"
                              >
                                {assignment.name || assignment?.quiz?.name || "Untitled"}
                              </button>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                  assignment.type === "quiz"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {assignment.type === "quiz" ? "Quiz" : "Assessment"}
                              </span>
                            </div>

                            {/* Actions — visible on hover */}
                            {canUpload && (
                              <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleAssignAssesment(assignment)}
                                  className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
                                  title="Assign to Classes"
                                >
                                  <TeamOutlined />
                                </button>
                                <button
                                  onClick={() => onDuplicateAssessment?.(assignment)}
                                  className="p-2 rounded-lg text-violet-500 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors"
                                  title="Duplicate"
                                >
                                  <CopyOutlined />
                                </button>
                                <button
                                  onClick={() => onEditAssessment?.(assignment)}
                                  className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
                                  title="Edit"
                                >
                                  <EditOutlined />
                                </button>
                                <button
                                  onClick={() => onDeleteAssessment(assignment.id)}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
                                  title="Delete"
                                >
                                  <DeleteOutlined />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                      <FileTextOutlined className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-base font-semibold text-gray-600 mb-1">No assessments yet</p>
                    <p className="text-sm text-gray-400">Add an assessment to get started</p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
        selectedTermId={selectedTermId}
      />

      <AssessmentAssignDrawer
        assessmentId={assigningAssessment?.id ?? null}
        assessmentName={assigningAssessment?.name}
        open={assignDrawerOpen}
        onClose={() => { setAssignDrawerOpen(false); setAssigningAssessment(null); }}
      />
    </div>
  );
}
