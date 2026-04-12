"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOutlined, BulbOutlined } from "@ant-design/icons";
import { useSubjectContext } from "@/contexts/SubjectContext";

const CARDS = [
  {
    name: "Lessons",
    href: "/dashboard/lessons",
    desc: "Plan and deliver Islamic subject lessons.",
    bg: "#eff6ff",
    iconColor: "#2563eb",
    border: "#bfdbfe",
    Icon: BookOutlined,
  },
  {
    name: "Mind-upgrade",
    href: "/dashboard/mind-upgrade",
    desc: "Strengthen beliefs and values through focused Islamic learning.",
    bg: "#f0fdf4",
    iconColor: "#16a34a",
    border: "#bbf7d0",
    Icon: BulbOutlined,
  },
];

export default function IslamicCoursesPage() {
  const router = useRouter();
  const { subjects, canUseSubjectContext, setActiveSubjectId, loading: subjectContextLoading } =
    useSubjectContext();

  const islamicSubject = useMemo(
    () =>
      subjects.find((subject) => /islam|islamiat|islamic/i.test(String(subject?.name || ""))) ??
      null,
    [subjects]
  );

  useEffect(() => {
    if (!canUseSubjectContext || subjectContextLoading || !islamicSubject) return;
    setActiveSubjectId(Number(islamicSubject.id), { navigate: false });
  }, [canUseSubjectContext, islamicSubject, setActiveSubjectId, subjectContextLoading]);

  const openCourse = (href: string) => {
    if (canUseSubjectContext && islamicSubject) {
      setActiveSubjectId(Number(islamicSubject.id), { navigate: false });
    }
    router.push(href);
  };

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
            className="flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #38C16C 0%, #16a34a 100%)",
              boxShadow: "0 0 0 3px rgba(56,193,108,0.35)",
            }}
          >
            🕌
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-1">
              Courses / Islamic
            </p>
            <h1 className="text-2xl font-bold text-white leading-tight">Islamic Courses</h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
              Access lessons and mind-upgrade content for the Islamic subject.
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {CARDS.map((card) => (
          <button
            key={card.name}
            type="button"
            onClick={() => openCourse(card.href)}
            className="group w-full text-left cursor-pointer rounded-3xl border bg-white p-6 flex items-center gap-5
                       transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            style={{ borderColor: card.border }}
          >
            <div
              className="flex-shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center text-3xl
                         transition-transform duration-200 group-hover:scale-110"
              style={{ background: card.bg, color: card.iconColor, border: `1.5px solid ${card.border}` }}
            >
              <card.Icon />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-slate-800">{card.name}</p>
              <p className="text-sm text-slate-500 mt-1 leading-snug">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
