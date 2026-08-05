"use client";

import { useMemo } from "react";

export type TreeProgressProps = {
  completed: number;
  total: number;
  accent: string;
  name: string;
};

export function TreeProgress({ completed, total, accent, name }: TreeProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const leaves = useMemo(() => {
    const items = [];
    const count = total || 1;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1 || 1);
      const angle = Math.PI - t * Math.PI; // left to right arc
      const radius = 140 + Math.sin(i * 1.3) * 20;
      const x = 200 + Math.cos(angle) * radius;
      const y = 240 - Math.sin(angle) * (radius * 0.7);
      items.push({ x, y, active: i < completed });
    }
    return items;
  }, [completed, total]);

  const colors = useMemo(() => {
    if (accent.includes("emerald")) return { trunk: "#a0522d", leaf: "#10b981", glow: "#34d399" };
    if (accent.includes("sky")) return { trunk: "#8d6e63", leaf: "#0ea5e9", glow: "#60a5fa" };
    if (accent.includes("amber")) return { trunk: "#8d6e63", leaf: "#f59e0b", glow: "#fbbf24" };
    if (accent.includes("rose")) return { trunk: "#8d6e63", leaf: "#f43f5e", glow: "#fb7185" };
    if (accent.includes("violet")) return { trunk: "#8d6e63", leaf: "#8b5cf6", glow: "#a78bfa" };
    return { trunk: "#a0522d", leaf: "#10b981", glow: "#34d399" };
  }, [accent]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Your {name} tree</h3>
          <p className="mt-1 text-xs text-slate-500">
            Watch it grow as you complete each story.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-emerald-600">{percent}%</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {completed} / {total} complete
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <svg
          viewBox="0 0 400 300"
          className="h-48 w-full max-w-sm overflow-visible md:h-56"
          aria-label={`Tree showing ${completed} of ${total} stories completed`}
        >
          {/* Trunk */}
          <path
            d="M185 300 Q200 240 195 180 Q190 120 170 100"
            stroke={colors.trunk}
            strokeWidth="22"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M195 300 Q210 250 225 190 Q240 140 270 120"
            stroke={colors.trunk}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M190 300 Q180 250 170 210 Q150 170 120 160"
            stroke={colors.trunk}
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaves */}
          {leaves.map((leaf, i) => (
            <g key={i}>
              <circle
                cx={leaf.x}
                cy={leaf.y}
                r={leaf.active ? 9 : 7}
                fill={leaf.active ? colors.leaf : "#e2e8f0"}
                stroke={leaf.active ? colors.glow : "#cbd5e1"}
                strokeWidth="2"
                className={leaf.active ? "animate-pulse" : ""}
              />
              {leaf.active && (
                <text
                  x={leaf.x}
                  y={leaf.y + 3}
                  textAnchor="middle"
                  className="text-[8px]"
                  fill="white"
                >
                  ✓
                </text>
              )}
            </g>
          ))}

          {/* Ground */}
          <ellipse cx="200" cy="300" rx="120" ry="12" fill="#ecfdf5" />
        </svg>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
