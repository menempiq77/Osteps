"use client";

import Link from "next/link";
import { ReadOutlined } from "@ant-design/icons";

const SUBJECT_COURSES = [
  {
    name: "Islamic Courses",
    href: "/dashboard/courses/islamic",
    desc: "Access Lessons and Mind-upgrade for the Islamic subject.",
    bg: "#f0fdf4",
    iconColor: "#16a34a",
    border: "#bbf7d0",
    emoji: "🕌",
  },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0a2318 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #38C16C, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-20 h-32 w-32 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #38C16C, transparent 70%)" }}
        />

        <div className="relative flex items-center gap-5">
          <div
            className="flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #38C16C 0%, #16a34a 100%)",
              boxShadow: "0 0 0 3px rgba(56,193,108,0.35)",
            }}
          >
            <ReadOutlined style={{ color: "#fff" }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-1">
              Learning
            </p>
            <h1 className="text-2xl font-bold text-white leading-tight">Courses</h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
              Select a subject to access its courses and materials.
            </p>
          </div>
        </div>
      </div>

      {/* Subject course cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECT_COURSES.map((card) => (
          <Link key={card.name} href={card.href}>
            <div
              className="group cursor-pointer rounded-3xl border bg-white p-6 flex items-center gap-5
                         transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              style={{ borderColor: card.border }}
            >
              <div
                className="flex-shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center text-3xl
                           transition-transform duration-200 group-hover:scale-110"
                style={{ background: card.bg, border: `1.5px solid ${card.border}` }}
              >
                {card.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-800">{card.name}</p>
                <p className="text-sm text-slate-500 mt-1 leading-snug">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
