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
        className="relative overflow-hidden rounded-3xl px-6 py-8 md:px-10 md:py-10"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0a2318 100%)",
        }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #38C16C, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-20 h-32 w-32 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #38C16C, transparent 70%)" }} />

        <div className="relative flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-5">
            <div
              className="flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #38C16C 0%, #16a34a 100%)",
                boxShadow: "0 0 0 3px rgba(56,193,108,0.35)",
              }}
            >
              <TeamOutlined style={{ color: "#fff" }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-1">
                School Management
              </p>
              <h1 className="text-2xl font-bold text-white leading-tight">Students &amp; Staff</h1>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
                Manage people across all subjects from one place.
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                activeTab === "students"
                  ? "border-green-400 bg-green-400 text-white"
                  : "border-green-400/60 text-green-300 bg-transparent hover:bg-white/10"
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                activeTab === "teachers"
                  ? "border-green-400 bg-green-400 text-white"
                  : "border-green-400/60 text-green-300 bg-transparent hover:bg-white/10"
              }`}
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
