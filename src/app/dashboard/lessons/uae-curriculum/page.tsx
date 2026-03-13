"use client";

import Link from "next/link";
import { Breadcrumb, Card } from "antd";
import { uaeCurriculumGrades } from "./data";

export default function UaeCurriculumPage() {
  return (
    <div className="p-3 md:p-6">
      <div className="premium-page rounded-2xl p-3 md:p-4">
        <Breadcrumb
          items={[
            { title: <Link href="/dashboard">Dashboard</Link> },
            { title: <Link href="/dashboard/lessons">Lessons</Link> },
            { title: <span>UAE curriculum</span> },
          ]}
          className="!mb-3"
        />

        <div className="premium-hero mb-6 rounded-xl px-4 py-3">
          <h1 className="text-2xl font-bold text-[var(--theme-dark)]">UAE curriculum</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose a grade and year level.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {uaeCurriculumGrades.map((item) => (
            <Link
              key={item.slug}
              href={`/dashboard/lessons/uae-curriculum/${item.slug}`}
              className="block"
            >
              <Card className="premium-card border-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="rounded-2xl border border-[var(--theme-border)] bg-white/90 p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                    Grade
                  </div>
                  <div className="mt-3 text-2xl font-bold text-[var(--theme-dark)]">
                    {item.title}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {item.topics.length} topics
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
