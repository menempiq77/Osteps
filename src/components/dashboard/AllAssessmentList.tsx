"use client";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import { AssessmentTasksDrawer } from "../ui/AssessmentTasksDrawer";
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

  const [selectedTermId, setSelectedTermId] = useState<string | null>(
    termId ? termId.toString() : null
  );
  const [messageApi, contextHolder] = message.useMessage();

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

  const handleAssignAssesment = (assesmentId: string) => {
    router.push(`/dashboard/all_assesments/${assesmentId}/assign`);
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
    <div className="mt-8 overflow-hidden">
      {contextHolder}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="assessmentTable">
            {(provided) => (
              <table className="w-full" ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr className="bg-primary">
                    <th className="px-6 py-3 text-xs font-medium text-white uppercase"></th>
                    <th className="px-6 py-3 text-xs font-medium text-white uppercase">
                      Assessment Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-white uppercase">
                      Type
                    </th>
                    {canUpload && (
                      <th className="px-6 py-3 text-xs font-medium text-white uppercase">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {assessmentList.length > 0 ? (
                    assessmentList.map((assignment, index) => (
                      <Draggable
                        key={assignment.id}
                        draggableId={assignment.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="text-xs md:text-sm text-center text-gray-800 even:bg-[#E9FAF1] odd:bg-white hover:bg-[#E9FAF1]"
                          >
                            <td className="p-2 md:p-4">
                              <GripVertical size={18} className="text-gray-400" />
                            </td>
                            <td className="p-2 md:p-4">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAssignmentClick(
                                    assignment.id,
                                    assignment.type,
                                    assignment.quiz_id
                                  )
                                }
                                className={`text-green-600 hover:text-green-800 hover:underline cursor-pointer ${
                                  assignment.type === "quiz" ? "font-medium" : ""
                                }`}
                              >
                                {assignment.name || assignment?.quiz?.name || "Untitled"}
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
                                <div className="flex items-center justify-center gap-4">
                                  <button
                                    onClick={() => handleAssignAssesment(assignment.id)}
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                    title="Assign to Classes"
                                  >
                                    <TeamOutlined />
                                  </button>

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
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={canUpload ? 4 : 2}
                        className="p-4 text-center text-gray-500"
                      >
                        No assessments available
                      </td>
                    </tr>
                  )}

                  {provided.placeholder}
                </tbody>
              </table>
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
    </div>
  );
}
