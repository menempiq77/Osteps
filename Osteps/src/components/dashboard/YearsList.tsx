"use client";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

interface Year {
  id: number;
  name: string;
  color?: string;
}

interface YearsListProps {
  years: Year[];
  onDeleteYear: (id: number) => void;
  onEditYear: (id: number) => void;
  onReorderYears?: (years: Year[]) => void;
  yearStats?: Record<number, { classes: number; students: number }>;
}

export default function YearsList({
  years,
  onDeleteYear,
  onEditYear,
  onReorderYears,
  yearStats = {},
}: YearsListProps) {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [localYears, setLocalYears] = useState<Year[]>(years || []);
  const [draggingYearId, setDraggingYearId] = useState<number | null>(null);

  // Check if current user is a student
  const isStudent =
    currentUser?.role === "STUDENT" || currentUser?.role === "HOD" || currentUser?.role === "TEACHER";
  const canManageOrder = !isStudent;

  useEffect(() => {
    setLocalYears(years || []);
  }, [years]);

  const reorderYears = (draggedId: number, targetId: number) => {
    if (draggedId === targetId) return;
    const updated = [...localYears];
    const draggedIndex = updated.findIndex((y) => y.id === draggedId);
    const targetIndex = updated.findIndex((y) => y.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setLocalYears(updated);
    onReorderYears?.(updated);
  };

  const handleViewClasses = (yearId: number) => {
    localStorage.setItem("selectedYearId", yearId.toString());

    router.push(`/dashboard/classes?year=${yearId}`);
  };

  const getYearNumber = (name: string): number | null => {
    const match = String(name || "").match(/(\d{1,2})/);
    if (!match) return null;
    const value = Number(match[1]);
    return Number.isFinite(value) ? value : null;
  };

  const getYearToneFromPalette = (palette?: string) => {
    switch (palette) {
      case "yellow":
        return {
          card: "border-amber-200/90 bg-gradient-to-r from-amber-50/80 via-white to-yellow-50/70",
          dragCard: "border-amber-300 bg-amber-100/70",
          top: "bg-amber-100/85 border-amber-200/80",
          title: "hover:text-amber-700",
          icon: "text-amber-500",
          move: "border-amber-200/80 text-amber-700",
          edit: "border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100/80",
        };
      case "red":
        return {
          card: "border-rose-200/90 bg-gradient-to-r from-rose-50/80 via-white to-red-50/65",
          dragCard: "border-rose-300 bg-rose-100/70",
          top: "bg-rose-100/85 border-rose-200/80",
          title: "hover:text-rose-700",
          icon: "text-rose-500",
          move: "border-rose-200/80 text-rose-700",
          edit: "border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100/80",
        };
      case "blue":
        return {
          card: "border-sky-200/90 bg-gradient-to-r from-sky-50/80 via-white to-blue-50/65",
          dragCard: "border-sky-300 bg-sky-100/70",
          top: "bg-sky-100/85 border-sky-200/80",
          title: "hover:text-sky-700",
          icon: "text-sky-500",
          move: "border-sky-200/80 text-sky-700",
          edit: "border-sky-200 bg-sky-50/80 text-sky-700 hover:bg-sky-100/80",
        };
      case "purple":
        return {
          card: "border-violet-200/90 bg-gradient-to-r from-violet-50/80 via-white to-fuchsia-50/65",
          dragCard: "border-violet-300 bg-violet-100/70",
          top: "bg-violet-100/85 border-violet-200/80",
          title: "hover:text-violet-700",
          icon: "text-violet-500",
          move: "border-violet-200/80 text-violet-700",
          edit: "border-violet-200 bg-violet-50/80 text-violet-700 hover:bg-violet-100/80",
        };
      case "green":
        return {
          card: "border-emerald-200/90 bg-gradient-to-r from-emerald-50/75 via-white to-green-50/65",
          dragCard: "border-emerald-300 bg-emerald-100/65",
          top: "bg-emerald-100/85 border-emerald-200/80",
          title: "hover:text-emerald-700",
          icon: "text-emerald-500",
          move: "border-emerald-200/80 text-emerald-700",
          edit: "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80",
        };
      default:
        return null;
    }
  };

  const getYearTone = (name: string, color?: string) => {
    const overrideTone = getYearToneFromPalette(color);
    if (overrideTone) return overrideTone;
    const yearNo = getYearNumber(name);

    if (yearNo !== null && yearNo >= 7 && yearNo <= 8) {
      return {
        card: "border-amber-200/90 bg-gradient-to-r from-amber-50/80 via-white to-yellow-50/70",
        dragCard: "border-amber-300 bg-amber-100/70",
        top: "bg-amber-100/85 border-amber-200/80",
        title: "hover:text-amber-700",
        icon: "text-amber-500",
        move: "border-amber-200/80 text-amber-700",
        edit: "border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100/80",
      };
    }

    if (yearNo !== null && yearNo >= 9 && yearNo <= 11) {
      return {
        card: "border-rose-200/90 bg-gradient-to-r from-rose-50/80 via-white to-red-50/65",
        dragCard: "border-rose-300 bg-rose-100/70",
        top: "bg-rose-100/85 border-rose-200/80",
        title: "hover:text-rose-700",
        icon: "text-rose-500",
        move: "border-rose-200/80 text-rose-700",
        edit: "border-rose-200 bg-rose-50/80 text-rose-700 hover:bg-rose-100/80",
      };
    }

    if (yearNo !== null && yearNo >= 12 && yearNo <= 13) {
      return {
        card: "border-emerald-200/90 bg-gradient-to-r from-emerald-50/75 via-white to-green-50/65",
        dragCard: "border-emerald-300 bg-emerald-100/65",
        top: "bg-emerald-100/85 border-emerald-200/80",
        title: "hover:text-emerald-700",
        icon: "text-emerald-500",
        move: "border-emerald-200/80 text-emerald-700",
        edit: "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80",
      };
    }

    return {
      card: "border-slate-200/90 bg-gradient-to-r from-slate-50/75 via-white to-slate-100/40",
      dragCard: "border-slate-300 bg-slate-100/70",
      top: "bg-slate-100/85 border-slate-200/80",
      title: "hover:text-slate-700",
      icon: "text-slate-500",
      move: "border-slate-200/80 text-slate-700",
      edit: "border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100/80",
    };
  };

  return (
    <div className="relative overflow-auto">
      <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-white via-emerald-50/20 to-lime-50/20 p-4 md:p-5 shadow-sm">
        {canManageOrder && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs text-emerald-700">
            <MenuOutlined />
            Drag folder cards to reorder
          </div>
        )}

        {localYears?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {localYears.map((year) => {
              const tone = getYearTone(year?.name, year?.color);
              const stats = yearStats[year.id] ?? { classes: 0, students: 0 };
              return (
              <div
                key={`${year?.id}-${year?.name}`}
                draggable={canManageOrder}
                onDragStart={() => setDraggingYearId(year.id)}
                onDragOver={(e) => {
                  if (canManageOrder) e.preventDefault();
                }}
                onDrop={() => {
                  if (canManageOrder && draggingYearId) {
                    reorderYears(draggingYearId, year.id);
                  }
                }}
                onDragEnd={() => setDraggingYearId(null)}
                className={`relative rounded-xl border transition-all duration-200 ${
                  draggingYearId === year.id
                    ? `${tone.dragCard}`
                    : `${tone.card} hover:shadow-md`
                }`}
              >
                <div className={`h-7 rounded-t-xl border-b ${tone.top}`} />
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleViewClasses(year?.id)}
                      className={`cursor-pointer text-left text-base md:text-lg font-semibold text-slate-700 transition-colors ${tone.title}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <FolderOpenOutlined className={tone.icon} />
                        {year?.name}
                      </span>
                    </button>
                    {canManageOrder && (
                      <span className={`inline-flex items-center gap-1 rounded-full border bg-white/80 px-2 py-1 text-[11px] cursor-grab ${tone.move}`}>
                        <MenuOutlined />
                        Move
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleViewClasses(year.id)}
                      className="cursor-pointer rounded-full border border-slate-200 bg-white/85 px-2 py-1 text-slate-700 hover:bg-slate-100/90"
                    >
                      {stats.classes} classes
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/students/all?yearId=${year.id}`)}
                      className="cursor-pointer rounded-full border border-slate-200 bg-white/85 px-2 py-1 text-slate-700 hover:bg-slate-100/90"
                    >
                      {stats.students} students
                    </button>
                  </div>

                  {!isStudent && (
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => onEditYear(year?.id)}
                        className={`cursor-pointer inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${tone.edit}`}
                      >
                        <EditOutlined />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteYear(year?.id)}
                        className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100/80"
                      >
                        <DeleteOutlined />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 text-sm bg-white rounded-xl border border-dashed border-emerald-200">
            No years found.
          </div>
        )}
      </div>
    </div>
  );
}
