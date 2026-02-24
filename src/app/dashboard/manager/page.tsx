"use client";

import Link from "next/link";
import {
  Layers,
  BarChart2,
  ClipboardList,
  GraduationCap,
  BarChart3,
  BookOpen,
  UserCircle,
  NotebookPen,
} from "lucide-react";

const managerCards = [
  {
    title: "Manage Classes",
    description: "Create and organize classes by academic year.",
    href: "/dashboard/years",
    icon: Layers,
  },
  {
    title: "Manage Grades",
    description: "Set and update grading ranges and standards.",
    href: "/dashboard/grades",
    icon: BarChart2,
  },
  {
    title: "Manage Quiz",
    description: "Create quizzes and maintain quiz content.",
    href: "/dashboard/quiz",
    icon: ClipboardList,
  },
  {
    title: "Subjects",
    description: "Manage subjects and curriculum mappings.",
    href: "/dashboard/subjects",
    icon: BookOpen,
  },
  {
    title: "Teachers",
    description: "Manage teacher accounts and assignments.",
    href: "/dashboard/teachers",
    icon: UserCircle,
  },
  {
    title: "Behavior",
    description: "Manage behavior records and behavior points.",
    href: "/dashboard/student_behavior",
    icon: NotebookPen,
  },
  {
    title: "Manage Assessments",
    description: "Build and manage school assessments.",
    href: "/dashboard/all_assesments",
    icon: GraduationCap,
  },
  {
    title: "Manage Trackers",
    description: "Configure trackers and progress structures.",
    href: "/dashboard/all_trackers",
    icon: BarChart3,
  },
];

export default function ManagerPage() {
  return (
    <div className="p-3 md:p-6">
      <div className="mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-lime-50 p-4 md:p-5">
        <h1 className="text-2xl font-bold">Manager</h1>
        <p className="text-sm text-gray-600 mt-1">
          Open any management section from these cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {managerCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/60 p-4 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800 group-hover:text-emerald-700">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
