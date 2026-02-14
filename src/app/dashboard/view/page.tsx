"use client";

import Link from "next/link";
import { GraduationCap, BarChart3, FileBarChart } from "lucide-react";

const viewCards = [
  {
    title: "View Assessments",
    description: "Open and review assessment results and assigned work.",
    href: "/dashboard/student_assesments",
    icon: GraduationCap,
  },
  {
    title: "View Trackers",
    description: "View tracker progress across classes and students.",
    href: "/dashboard/viewtrackers",
    icon: BarChart3,
  },
  {
    title: "Reports",
    description: "Open student reports and performance summaries.",
    href: "/dashboard/students/reports",
    icon: FileBarChart,
  },
];

export default function ViewPage() {
  return (
    <div className="p-3 md:p-6">
      <div className="mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-lime-50 p-4 md:p-5">
        <h1 className="text-2xl font-bold">View</h1>
        <p className="text-sm text-gray-600 mt-1">
          Open view-only sections from these cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {viewCards.map((card) => (
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

