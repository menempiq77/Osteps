"use client";

import { useState } from "react";
import { TeamOutlined } from "@ant-design/icons";
import AllStudentsPage from "@/app/dashboard/students/all/page";
import TeacherList from "@/components/dashboard/TeacherList";

type Tab = "students" | "teachers";

export default function StudentsStaffPage() {
  const [activeTab, setActiveTab] = useState<Tab>("students");

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-3xl border shadow-sm"
        style={{
          borderColor: "var(--theme-border)",
          background:
            "radial-gradient(1100px 320px at 100% -45%, color-mix(in srgb, var(--primary) 24%, transparent), transparent 70%), linear-gradient(135deg, var(--theme-soft) 0%, #ffffff 58%)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "color-mix(in srgb, var(--primary) 28%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute right-40 top-8 h-24 w-24 rounded-full blur-2xl"
          style={{ background: "color-mix(in srgb, var(--theme-scroll-end) 22%, transparent)" }}
        />

        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur"
              style={{ borderColor: "var(--theme-border)", color: "var(--theme-dark)" }}
            >
              <TeamOutlined /> School Management
            </span>

            <h1
              className="mt-3 m-0 text-[26px] font-extrabold leading-tight tracking-tight md:text-[34px]"
              style={{ color: "var(--theme-dark)" }}
            >
              Students &amp; Staff
            </h1>

            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
              Everyone in your school, organised in one place — search, filter and manage students and teachers across every subject without losing your spot.
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="inline-flex self-start rounded-2xl border bg-white/70 p-1 shadow-sm backdrop-blur md:self-auto"
            style={{ borderColor: "var(--theme-border)" }}
          >
            <button
              onClick={() => setActiveTab("students")}
              className="rounded-xl px-6 py-2 text-sm font-semibold transition-all"
              style={
                activeTab === "students"
                  ? { background: "var(--primary)", color: "#fff", boxShadow: "0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent)" }
                  : { background: "transparent", color: "var(--theme-dark)" }
              }
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className="rounded-xl px-6 py-2 text-sm font-semibold transition-all"
              style={
                activeTab === "teachers"
                  ? { background: "var(--primary)", color: "#fff", boxShadow: "0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent)" }
                  : { background: "transparent", color: "var(--theme-dark)" }
              }
            >
              Teachers
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "students" ? <AllStudentsPage /> : <TeacherList />}
      </div>
    </div>
  );
}
