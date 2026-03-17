"use client";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  FolderOpenOutlined,
  MenuOutlined,
  TeamOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { message } from "antd";

interface Class {
  id: string;
  class_name: string;
  teacher_id: number;
  year_id: number;
  number_of_terms: string;
  teacher_name?: string;
  color?: string;
}

interface ClassesListProps {
  classes: Class[];
  onDeleteClass: (id: string) => void;
  onEditClass: (cls: Class) => void;
  onReorderClasses?: (classes: Class[]) => void;
  classStats?: Record<string, { students: number }>;
  subjectScoped?: boolean;
}

export default function ClassesList({
  classes,
  onDeleteClass,
  onEditClass,
  onReorderClasses,
  classStats = {},
  subjectScoped = false,
}: ClassesListProps) {
  const router = useRouter();
  const { activeSubjectId } = useSubjectContext();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [localClasses, setLocalClasses] = useState<Class[]>(classes || []);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draggingClassId, setDraggingClassId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";

  const isStudent = currentUser?.role === "STUDENT";
  const canManageOrder = hasAccess;

  useEffect(() => {
    setLocalClasses(classes || []);
  }, [classes]);

  const reorderClasses = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    const updated = [...localClasses];
    const draggedIndex = updated.findIndex((c) => c.id === draggedId);
    const targetIndex = updated.findIndex((c) => c.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setLocalClasses(updated);
    onReorderClasses?.(updated);
  };

  const handleTerms = (classId: string) => {
    router.push(`/dashboard/classes/${classId}/terms`);
  };

  const handleViewStudents = (classId: string) => {
    if (subjectScoped && activeSubjectId) {
      const subjectClass = localClasses.find((item) => item.id === classId);
      const yearId = subjectClass?.year_id;
      router.push(
        `/dashboard/students/all?subjectId=${activeSubjectId}${yearId ? `&yearId=${yearId}` : ""}`
      );
      return;
    }
    router.push(`/dashboard/students/${classId}`);
  };

  const handleStory = (classId: string) => {
    router.push(`/dashboard/classes/${classId}/story`);
  };

  const handleDeleteClick = (cls: Class) => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete classes.");
      return;
    }
    setClassToDelete(cls);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!hasAccess) {
      messageApi.warning("Only School Admin can delete classes.");
      return;
    }
    if (classToDelete) {
      onDeleteClass(classToDelete.id);
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  const getPaletteColor = (palette?: string) => {
    switch (palette) {
      case "yellow":
        return "#d97706";
      case "red":
        return "#dc2626";
      case "blue":
        return "#2563eb";
      case "purple":
        return "#7c3aed";
      case "green":
      default:
        return "var(--primary)";
    }
  };

  return (
    <div className="overflow-auto">
      {contextHolder}
      <div
        className="relative overflow-auto rounded-2xl p-4 shadow-sm md:p-5"
        style={{
          border: "1px solid color-mix(in srgb, var(--primary) 20%, white)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), color-mix(in srgb, var(--primary) 10%, white))",
        }}
      >
        {canManageOrder && (
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
            style={{
              border: "1px solid color-mix(in srgb, var(--primary) 35%, white)",
              backgroundColor: "color-mix(in srgb, var(--primary) 10%, white)",
              color: "var(--theme-dark)",
            }}
          >
            <MenuOutlined />
            Drag class folders to reorder
          </div>
        )}

        {localClasses?.length === 0 ? (
          <div
            className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500"
            style={{ borderColor: "color-mix(in srgb, var(--primary) 35%, white)" }}
          >
            <div className="text-lg mb-2">No classes found</div>
            {!isStudent && (
              <p className="text-sm text-gray-400">
                Click the 'Add Class' button to create a new class
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            {localClasses.map((cls) => {
              const stats = classStats[String(cls.id)] ?? { students: 0 };
              const accentColor = getPaletteColor(cls.color);
              return (
                <div
                  key={cls.id}
                  draggable={canManageOrder}
                  onDragStart={() => setDraggingClassId(cls.id)}
                  onDragOver={(e) => {
                    if (canManageOrder) e.preventDefault();
                  }}
                  onDrop={() => {
                    if (canManageOrder && draggingClassId) {
                      reorderClasses(draggingClassId, cls.id);
                    }
                  }}
                  onDragEnd={() => setDraggingClassId(null)}
                  className="flex flex-wrap items-center gap-3 rounded-lg border bg-white px-3 py-2 text-sm"
                  style={{
                    borderColor:
                      draggingClassId === cls.id
                        ? `color-mix(in srgb, ${accentColor} 45%, white)`
                        : `color-mix(in srgb, ${accentColor} 18%, white)`,
                    backgroundColor:
                      draggingClassId === cls.id
                        ? `color-mix(in srgb, ${accentColor} 10%, white)`
                        : "rgba(255,255,255,0.96)",
                  }}
                >
                  <button
                    onClick={() => handleViewStudents(cls.id)}
                    className="inline-flex cursor-pointer items-center gap-2 text-left text-[15px] font-semibold"
                    style={{ color: accentColor }}
                  >
                    <FolderOpenOutlined />
                    {cls.class_name}
                  </button>

                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-600">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/students/all?classId=${cls.id}${
                            activeSubjectId ? `&subjectId=${activeSubjectId}` : ""
                          }`
                        )
                      }
                      className="cursor-pointer hover:text-[var(--theme-dark)]"
                    >
                      Students: {stats.students}
                    </button>
                    <span>Teacher: {cls.teacher_name || "Not assigned"}</span>
                    {!subjectScoped ? (
                      <span>{cls.number_of_terms === "two" ? "Two Terms" : "Three Terms"}</span>
                    ) : null}
                  </div>

                  <div className="ml-auto flex flex-wrap items-center gap-3 text-[12px]">
                    {canManageOrder && (
                      <span className="inline-flex cursor-grab items-center gap-1 text-slate-500">
                        <MenuOutlined />
                        Move
                      </span>
                    )}
                    <button
                      onClick={() => handleViewStudents(cls.id)}
                      className="cursor-pointer text-slate-600 hover:text-[var(--theme-dark)]"
                      title="Students"
                    >
                      <TeamOutlined /> Students
                    </button>
                    {!subjectScoped ? (
                      <button
                        onClick={() => handleTerms(cls.id)}
                        className="cursor-pointer text-slate-600 hover:text-[var(--theme-dark)]"
                        title="Terms"
                      >
                        <BookOutlined /> Terms
                      </button>
                    ) : null}
                    {!subjectScoped ? (
                      <button
                        onClick={() => handleStory(cls.id)}
                        className="cursor-pointer text-slate-600 hover:text-[var(--theme-dark)]"
                        title="Class Story"
                      >
                        <ReadOutlined /> Story
                      </button>
                    ) : null}

                    {hasAccess && !subjectScoped && (
                      <button
                        onClick={() => onEditClass(cls)}
                        className="cursor-pointer text-slate-600 hover:text-[var(--theme-dark)]"
                        title="Edit"
                      >
                        <EditOutlined /> Edit
                      </button>
                    )}

                    {hasAccess && !subjectScoped && (
                      <button
                        onClick={() => handleDeleteClick(cls)}
                        className="cursor-pointer text-rose-600 hover:text-rose-700"
                        title="Delete"
                      >
                        <DeleteOutlined /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setClassToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {classToDelete && (
          <p>
            Are you sure you want to delete the class{" "}
            <strong>{classToDelete.class_name}</strong>? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
