"use client";

import Link from "next/link";
import { Breadcrumb, Card } from "antd";

export default function LessonsPage() {
  return (
    <div className="p-3 md:p-6">
      <div className="premium-page rounded-2xl p-3 md:p-4">
        <Breadcrumb
          items={[
            { title: <Link href="/dashboard">Dashboard</Link> },
            { title: <span>Lessons</span> },
          ]}
          className="!mb-3"
        />

        <div className="premium-hero mb-6 rounded-xl px-4 py-3">
          <h1 className="text-2xl font-bold text-[var(--theme-dark)]">Lessons</h1>
          <p className="mt-2 text-sm text-slate-600">
            Select a curriculum to open its lesson levels.
          </p>
        </div>

        <Link href="/dashboard/lessons/uae-curriculum" className="block">
          <Card className="premium-card border-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="rounded-2xl border border-[var(--theme-border)] bg-white/90 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Curriculum
              </div>
              <div className="mt-3 text-3xl font-bold text-[var(--theme-dark)]">
                UAE curriculum
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
