"use client";
import { RootState } from "@/store/store";
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
}

export default function ClassesList({
  classes,
  onDeleteClass,
  onEditClass,
  onReorderClasses,
  classStats = {},
}: ClassesListProps) {
  const router = useRouter();
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
    router.push(`/dashboard/students/${classId}`);
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

  const getClassTone = (color?: string) => {
    switch (color) {
      case "yellow":
        return {
          card: "border-amber-200 bg-gradient-to-b from-amber-50 to-white hover:shadow-md hover:-translate-y-0.5",
          dragCard: "border-amber-300 bg-amber-100/70",
          top: "bg-amber-200/80 border-amber-300/70",
          title: "hover:text-amber-700",
          icon: "text-amber-500",
          move: "border-amber-200 text-amber-700",
          students: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
          terms: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
          edit: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
        };
      case "red":
        return {
          card: "border-rose-200 bg-gradient-to-b from-rose-50 to-white hover:shadow-md hover:-translate-y-0.5",
          dragCard: "border-rose-300 bg-rose-100/70",
          top: "bg-rose-200/80 border-rose-300/70",
          title: "hover:text-rose-700",
          icon: "text-rose-500",
          move: "border-rose-200 text-rose-700",
          students: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
          terms: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
          edit: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        };
      case "blue":
        return {
          card: "border-sky-200 bg-gradient-to-b from-sky-50 to-white hover:shadow-md hover:-translate-y-0.5",
          dragCard: "border-sky-300 bg-sky-100/70",
          top: "bg-sky-200/80 border-sky-300/70",
          title: "hover:text-sky-700",
          icon: "text-sky-500",
          move: "border-sky-200 text-sky-700",
          students: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
          terms: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
          edit: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
        };
      case "purple":
        return {
          card: "border-violet-200 bg-gradient-to-b from-violet-50 to-white hover:shadow-md hover:-translate-y-0.5",
          dragCard: "border-violet-300 bg-violet-100/70",
          top: "bg-violet-200/80 border-violet-300/70",
          title: "hover:text-violet-700",
          icon: "text-violet-500",
          move: "border-violet-200 text-violet-700",
          students: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
          terms: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100",
          edit: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
        };
      case "green":
      default:
        return {
          card: "border-emerald-200 bg-gradient-to-b from-emerald-50 to-white hover:shadow-md hover:-translate-y-0.5",
          dragCard: "border-emerald-300 bg-emerald-100/70",
          top: "bg-emerald-200/80 border-emerald-300/70",
          title: "hover:text-emerald-700",
          icon: "text-emerald-500",
          move: "border-emerald-200 text-emerald-700",
          students: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
          terms: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
          edit: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        };
    }
  };

  return (
    <div className="overflow-auto">
      {contextHolder}
      <div className="relative overflow-auto rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30 p-4 md:p-5 shadow-sm">
        {canManageOrder && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            <MenuOutlined />
            Drag class folders to reorder
          </div>
        )}

        {localClasses?.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-emerald-200">
            <div className="text-lg mb-2">No classes found</div>
            {!isStudent && (
              <p className="text-sm text-gray-400">
                Click the 'Add Class' button to create a new class
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {localClasses.map((cls) => {
              const tone = getClassTone(cls.color);
              const stats = classStats[String(cls.id)] ?? { students: 0 };
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
                className={`relative rounded-xl border transition-all duration-200 ${
                  draggingClassId === cls.id
                    ? tone.dragCard
                    : tone.card
                }`}
              >
                <div className={`h-8 rounded-t-xl border-b ${tone.top}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => handleViewStudents(cls.id)}
                      className={`cursor-pointer text-left text-base font-semibold text-gray-800 transition-colors ${tone.title}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <FolderOpenOutlined className={tone.icon} />
                        {cls.class_name}
                      </span>
                    </button>

                    {canManageOrder && (
                      <span className={`inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 text-[11px] cursor-grab ${tone.move}`}>
                        <MenuOutlined />
                        Move
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>
                      {cls.number_of_terms === "two" ? "Two Terms" : "Three Terms"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Teacher: {cls.teacher_name || "Not assigned"}
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/students/all?classId=${cls.id}`)}
                      className="cursor-pointer inline-flex items-center rounded-full border border-slate-200 bg-white/85 px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100/90"
                    >
                      {stats.students} students
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleViewStudents(cls.id)}
                      className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${tone.students}`}
                      title="Students"
                    >
                      <TeamOutlined />
                      Students
                    </button>
                    <button
                      onClick={() => handleTerms(cls.id)}
                      className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${tone.terms}`}
                      title="Terms"
                    >
                      <BookOutlined />
                      Terms
                    </button>

                    {hasAccess && (
                      <button
                        onClick={() => onEditClass(cls)}
                        className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${tone.edit}`}
                        title="Edit"
                      >
                        <EditOutlined />
                        Edit
                      </button>
                    )}

                    {hasAccess && (
                      <button
                        onClick={() => handleDeleteClick(cls)}
                        className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100"
                        title="Delete"
                      >
                        <DeleteOutlined />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )})}
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
