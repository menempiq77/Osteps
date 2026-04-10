"use client";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Grade {
  id: number;
  grade: string;
  min_percentage: string;
  max_percentage: string;
  description: string;
}

interface GradesListProps {
  grades: Grade[];
  onDeleteGrade: (id: number) => void;
  onEditGrade: (grade: Grade) => void;
}

const getGradeColor = (grade: string) => {
  const letter = grade.charAt(0).toUpperCase();
  const map: Record<string, { bg: string; text: string; bar: string; border: string; lightBg: string }> = {
    A: { bg: "bg-emerald-500", text: "text-emerald-600", bar: "bg-emerald-400", border: "border-emerald-200", lightBg: "bg-emerald-50" },
    B: { bg: "bg-sky-500",     text: "text-sky-600",     bar: "bg-sky-400",     border: "border-sky-200",     lightBg: "bg-sky-50"     },
    C: { bg: "bg-amber-500",   text: "text-amber-600",   bar: "bg-amber-400",   border: "border-amber-200",   lightBg: "bg-amber-50"   },
    D: { bg: "bg-orange-500",  text: "text-orange-600",  bar: "bg-orange-400",  border: "border-orange-200",  lightBg: "bg-orange-50"  },
    F: { bg: "bg-rose-500",    text: "text-rose-600",    bar: "bg-rose-400",    border: "border-rose-200",    lightBg: "bg-rose-50"    },
  };
  return map[letter] ?? { bg: "bg-violet-500", text: "text-violet-600", bar: "bg-violet-400", border: "border-violet-200", lightBg: "bg-violet-50" };
};

export default function GradesList({ grades, onDeleteGrade, onEditGrade }: GradesListProps) {
  if (!grades?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-white py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <span className="text-2xl font-bold text-emerald-400">A+</span>
        </div>
        <p className="text-sm font-medium text-slate-500">No grade ranges yet.</p>
        <p className="mt-1 text-xs text-slate-400">Add your first grade range to get started.</p>
      </div>
    );
  }

  const sorted = [...grades].sort(
    (a, b) => Number(b.max_percentage) - Number(a.max_percentage)
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((grade) => {
        const colors = getGradeColor(grade.grade);
        const min = Number(grade.min_percentage);
        const max = Number(grade.max_percentage);
        const barWidth = max - min;

        return (
          <div
            key={grade.id}
            className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            {/* Top accent stripe */}
            <div className={`h-1 w-full ${colors.bg}`} />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colors.lightBg}`}>
                    <span className={`text-xl font-extrabold ${colors.text}`}>{grade.grade}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Grade</p>
                    <p className={`text-base font-bold ${colors.text}`}>{grade.grade}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onEditGrade(grade)}
                    title="Edit"
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => onDeleteGrade(grade.id)}
                    title="Delete"
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>

              {/* Range */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">Score Range</span>
                  <span className={`font-semibold ${colors.text}`}>{min}% – {max}%</span>
                </div>
                {/* Progress bar background (full 0-100) */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  {/* Filled portion */}
                  <div
                    className={`absolute top-0 h-2 rounded-full ${colors.bar}`}
                    style={{ left: `${min}%`, width: `${barWidth}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-300">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Description */}
              {grade.description ? (
                <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                  {grade.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
