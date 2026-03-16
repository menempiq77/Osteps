"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Empty, Spin, Tag } from "antd";
import { ArrowRightOutlined, BookOutlined } from "@ant-design/icons";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";

const roleLabel = (role?: string) => {
  const normalized = String(role || "").trim().toUpperCase();
  if (normalized === "SCHOOL_ADMIN" || normalized === "ADMIN") return "School Admin";
  if (normalized === "HOD") return "HOD";
  if (normalized === "TEACHER") return "Teacher";
  if (normalized === "STUDENT") return "Student";
  return "User";
};

export default function SubjectCardsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { subjects, loading, canUseSubjectContext, activeSubjectId, setActiveSubjectId } = useSubjectContext();

  const canEnterSubjectWorkspace = useMemo(() => {
    const role = String(currentUser?.role || "").trim().toUpperCase();
    return ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER", "STUDENT"].includes(role);
  }, [currentUser?.role]);

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!canUseSubjectContext || !canEnterSubjectWorkspace) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <Empty description="Subject workspace is not enabled for this account." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--theme-border)] bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-800">Choose a Subject</h1>
        <p className="mt-2 text-sm text-slate-500">
          {roleLabel(currentUser?.role)} workspace: open a subject to continue.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <Empty description="No assigned subjects found." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const isActive = Number(activeSubjectId) === Number(subject.id);
            return (
              <Card
                key={subject.id}
                className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm"
                title={
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-base font-semibold text-slate-800">
                      {subject.name}
                    </div>
                    {isActive && <Tag color="green">Active</Tag>}
                  </div>
                }
              >
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                  <BookOutlined />
                  <span className="truncate">{subject.code || "Subject Workspace"}</span>
                </div>
                <Button
                  type="primary"
                  className="!w-full !bg-primary !border-none"
                  icon={<ArrowRightOutlined />}
                  onClick={() => setActiveSubjectId(Number(subject.id), { navigate: true })}
                >
                  Enter Subject
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
