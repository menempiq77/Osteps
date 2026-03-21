"use client";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
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
  const { activeSubjectId, toSubjectHref } = useSubjectContext();
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
    router.push(toSubjectHref(`/dashboard/classes?year=${yearId}`));
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
    <div className="relative overflow-auto">
      <div
        className="rounded-2xl p-4 shadow-sm md:p-5"
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
            Drag folder cards to reorder
          </div>
        )}

        {localYears?.length > 0 ? (
          <div className="space-y-2">
            {localYears.map((year) => {
              const stats = yearStats[year.id] ?? { classes: 0, students: 0 };
              const accentColor = getPaletteColor(year.color);
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
                  className="flex flex-wrap items-center gap-3 rounded-lg border bg-white px-3 py-2 text-sm"
                  style={{
                    borderColor:
                      draggingYearId === year.id
                        ? `color-mix(in srgb, ${accentColor} 45%, white)`
                        : `color-mix(in srgb, ${accentColor} 18%, white)`,
                    backgroundColor:
                      draggingYearId === year.id
                        ? `color-mix(in srgb, ${accentColor} 10%, white)`
                        : "rgba(255,255,255,0.96)",
                  }}
                >
                  <button
                    onClick={() => handleViewClasses(year?.id)}
                    className="inline-flex cursor-pointer items-center gap-2 text-left text-[15px] font-semibold"
                    style={{ color: accentColor }}
                  >
                    <FolderOpenOutlined />
                    {year?.name}
                  </button>

                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-600">
                    <button
                      type="button"
                      onClick={() => handleViewClasses(year.id)}
                      className="cursor-pointer hover:text-[var(--theme-dark)]"
                    >
                      Classes: {stats.classes}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          toSubjectHref(
                            `/dashboard/students/all?yearId=${year.id}${
                              activeSubjectId ? `&subjectId=${activeSubjectId}` : ""
                            }`
                          )
                        )
                      }
                      className="cursor-pointer hover:text-[var(--theme-dark)]"
                    >
                      Students: {stats.students}
                    </button>
                  </div>

                  {!isStudent && (
                    <div className="ml-auto flex items-center gap-3 text-[12px]">
                      {canManageOrder && (
                        <span className="inline-flex cursor-grab items-center gap-1 text-slate-500">
                          <MenuOutlined />
                          Move
                        </span>
                      )}
                      <button
                        onClick={() => onEditYear(year?.id)}
                        className="cursor-pointer text-slate-600 hover:text-[var(--theme-dark)]"
                      >
                        <EditOutlined /> Edit
                      </button>
                      <button
                        onClick={() => onDeleteYear(year?.id)}
                        className="cursor-pointer text-rose-600 hover:text-rose-700"
                      >
                        <DeleteOutlined /> {activeSubjectId ? "Remove" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-xl border border-dashed bg-white py-10 text-center text-sm text-gray-500"
            style={{ borderColor: "color-mix(in srgb, var(--primary) 35%, white)" }}
          >
            No years found.
          </div>
        )}
      </div>
    </div>
  );
}
