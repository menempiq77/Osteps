"use client";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  HolderOutlined,
  FolderOpenOutlined,
  TeamOutlined,
  AppstoreOutlined,
  InboxOutlined,
  UndoOutlined,
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
  onArchiveYear?: (id: number) => void;
  onRestoreYear?: (id: number) => void;
  onReorderYears?: (years: Year[]) => void;
  yearStats?: Record<number, { classes: number; students: number }>;
  archivedView?: boolean;
  restoreLoading?: boolean;
  emptyMessage?: string;
}

export default function YearsList({
  years,
  onDeleteYear,
  onEditYear,
  onArchiveYear,
  onRestoreYear,
  onReorderYears,
  yearStats = {},
  archivedView = false,
  restoreLoading = false,
  emptyMessage = "No year groups found.",
}: YearsListProps) {
  const router = useRouter();
  const { activeSubjectId, toSubjectHref } = useSubjectContext();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [localYears, setLocalYears] = useState<Year[]>(years || []);
  const [draggingYearId, setDraggingYearId] = useState<number | null>(null);
  const [dragOverYearId, setDragOverYearId] = useState<number | null>(null);

  const roleKey = String(currentUser?.role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";
  const canManageOrder = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD" || roleKey === "TEACHER";

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
    router.push(
      toSubjectHref(
        `/dashboard/classes?year=${yearId}${archivedView ? "&archived=1" : ""}`
      )
    );
  };

  const getPaletteColor = (palette?: string) => {
    switch (palette) {
      case "yellow": return "#d97706";
      case "red":    return "#dc2626";
      case "blue":   return "#2563eb";
      case "purple": return "#7c3aed";
      case "green":
      default:       return "var(--primary)";
    }
  };

  const getPaletteBg = (palette?: string) => {
    switch (palette) {
      case "yellow": return "rgba(251,191,36,0.08)";
      case "red":    return "rgba(239,68,68,0.07)";
      case "blue":   return "rgba(37,99,235,0.07)";
      case "purple": return "rgba(124,58,237,0.07)";
      case "green":
      default:       return "color-mix(in srgb, var(--primary) 7%, white)";
    }
  };

  return (
    <div className="space-y-2.5">
      {canManageOrder && localYears.length > 0 && (
        <div className="flex items-center gap-2 px-1 text-xs text-slate-400 select-none">
          <HolderOutlined />
          <span>Drag rows to reorder</span>
        </div>
      )}

      {localYears.length > 0 ? (
        localYears.map((year, index) => {
          const stats = yearStats[year.id] ?? { classes: 0, students: 0 };
          const accentColor = getPaletteColor(year.color);
          const cardBg = getPaletteBg(year.color);
          const isDragging = draggingYearId === year.id;
          const isOver = dragOverYearId === year.id && !isDragging;

          return (
            <div
              key={`${year.id}-${year.name}`}
              draggable={canManageOrder}
              onDragStart={(e) => {
                setDraggingYearId(year.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                if (!canManageOrder) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverYearId(year.id);
              }}
              onDragLeave={() => setDragOverYearId(null)}
              onDrop={() => {
                if (canManageOrder && draggingYearId) {
                  reorderYears(draggingYearId, year.id);
                }
                setDragOverYearId(null);
              }}
              onDragEnd={() => {
                setDraggingYearId(null);
                setDragOverYearId(null);
              }}
              className="group flex items-center gap-0 rounded-xl border transition-all duration-150"
              style={{
                background: isOver ? `color-mix(in srgb, ${accentColor} 12%, white)` : cardBg,
                borderColor: isOver
                  ? accentColor
                  : isDragging
                  ? `color-mix(in srgb, ${accentColor} 55%, white)`
                  : `color-mix(in srgb, ${accentColor} 22%, white)`,
                boxShadow: isDragging
                  ? `0 4px 16px color-mix(in srgb, ${accentColor} 18%, transparent)`
                  : isOver
                  ? `0 0 0 2px ${accentColor}22`
                  : "0 1px 3px rgba(0,0,0,0.05)",
                opacity: isDragging ? 0.55 : 1,
              }}
            >
              {/* Drag handle + index */}
              {canManageOrder && (
                <div
                  className="flex flex-col items-center justify-center self-stretch px-3 cursor-grab active:cursor-grabbing select-none"
                  style={{
                    borderRight: `1px solid color-mix(in srgb, ${accentColor} 18%, white)`,
                    minWidth: 44,
                    gap: 2,
                  }}
                >
                  <HolderOutlined style={{ color: accentColor, fontSize: 14, opacity: 0.7 }} />
                  <span style={{ fontSize: 10, color: "var(--theme-muted, #94a3b8)", lineHeight: 1 }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              )}

              {/* Colour accent strip */}
              <div
                className="self-stretch w-1 rounded-l shrink-0"
                style={{ background: accentColor, marginLeft: canManageOrder ? 0 : undefined, borderRadius: canManageOrder ? 0 : "8px 0 0 8px" }}
              />

              {/* Main content */}
              <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-3 min-w-0">
                {/* Year name */}
                <button
                  onClick={() => handleViewClasses(year.id)}
                  className="inline-flex items-center gap-2 text-left font-semibold transition-colors"
                  style={{ fontSize: 15, color: accentColor, minWidth: 140 }}
                >
                  <FolderOpenOutlined style={{ fontSize: 16 }} />
                  <span className="truncate">{year.name}</span>
                </button>

                {/* Stats pills */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewClasses(year.id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:brightness-95"
                    style={{
                      background: `color-mix(in srgb, ${accentColor} 12%, white)`,
                      color: accentColor,
                      border: `1px solid color-mix(in srgb, ${accentColor} 25%, white)`,
                    }}
                  >
                    <AppstoreOutlined style={{ fontSize: 11 }} />
                    {stats.classes} {stats.classes === 1 ? "Class" : "Classes"}
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
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:brightness-95"
                    style={{
                      background: "rgba(100,116,139,0.08)",
                      color: "#475569",
                      border: "1px solid rgba(100,116,139,0.15)",
                    }}
                  >
                    <TeamOutlined style={{ fontSize: 11 }} />
                    {stats.students} {stats.students === 1 ? "Student" : "Students"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              {canManageOrder && (
                <div className="flex shrink-0 items-center gap-1 pr-3">
                  {!archivedView && (
                    <button
                      onClick={() => onEditYear(year.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      title="Edit year"
                    >
                      <EditOutlined />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  )}
                  {!archivedView && onArchiveYear && activeSubjectId && stats.classes > 0 && (
                    <button
                      onClick={() => onArchiveYear(year.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                      title="Archive this year group and all its classes"
                    >
                      <InboxOutlined />
                      <span className="hidden sm:inline">Archive</span>
                    </button>
                  )}
                  {archivedView && onRestoreYear && activeSubjectId && (
                    <button
                      onClick={() => onRestoreYear(year.id)}
                      disabled={restoreLoading}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                      title="Restore this year group and all its archived classes"
                    >
                      <UndoOutlined />
                      <span className="hidden sm:inline">Restore</span>
                    </button>
                  )}
                  {!archivedView && (
                    <button
                      onClick={() => onDeleteYear(year.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title={activeSubjectId ? "Remove from subject" : "Delete year"}
                    >
                      <DeleteOutlined />
                      <span className="hidden sm:inline">{activeSubjectId ? "Remove" : "Delete"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div
          className="rounded-xl border border-dashed bg-white py-12 text-center text-sm text-slate-400"
          style={{ borderColor: "color-mix(in srgb, var(--primary) 30%, white)" }}
        >
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
