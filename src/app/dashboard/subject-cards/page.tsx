"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Empty, Spin, Tag } from "antd";
import { ArrowRightOutlined, BookOutlined, TeamOutlined, LogoutOutlined } from "@ant-design/icons";
import { RootState, AppDispatch } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/authSlice";

const roleLabel = (role?: string) => {
  const normalized = String(role || "").trim().toUpperCase();
  if (normalized === "SCHOOL_ADMIN") return "School Admin";
  if (normalized === "ADMIN") return "Platform Admin";
  if (normalized === "HOD") return "HOD";
  if (normalized === "TEACHER") return "Teacher";
  if (normalized === "STUDENT") return "Student";
  return "User";
};

const isSchoolAdminRole = (role?: string | null): boolean => {
  const normalized = String(role || "").trim().toUpperCase();
  return normalized === "SCHOOL_ADMIN";
};

export default function SubjectCardsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { subjects, loading, canUseSubjectContext, activeSubjectId, setActiveSubjectId } =
    useSubjectContext();

  const role = String(currentUser?.role || "").trim().toUpperCase();
  const isStudent = role === "STUDENT";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const canEnterSubjectWorkspace = useMemo(() => {
    return ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER", "STUDENT"].includes(role);
  }, [role]);

  useEffect(() => {
    if (!loading && isStudent) {
      router.replace("/dashboard");
    }
  }, [isStudent, loading, router]);

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isStudent) {
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

  const isSchoolAdmin = isSchoolAdminRole(currentUser?.role ?? null);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--theme-border)] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Choose a Subject Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">
              {roleLabel(currentUser?.role)} workspace: open a subject dashboard to continue.
            </p>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="whitespace-nowrap"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <Empty description="No assigned subjects found." />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const isActive = Number(activeSubjectId) === Number(subject.id);
            const displayName =
              typeof subject.name === "string"
                ? subject.name.replace(/islamiat/gi, "Islamic")
                : subject.name;
            const displayCode =
              typeof subject.code === "string"
                ? subject.code.replace(/islamiat/gi, "Islamic")
                : subject.code;
            return (
              <Card
                key={subject.id}
                className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm"
                title={
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-base font-semibold text-slate-800">
                      {displayName} Dashboard
                    </div>
                    {isActive && <Tag color="green">Active</Tag>}
                  </div>
                }
              >
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                  <BookOutlined />
                  <span className="truncate">{displayCode || "Subject Workspace"}</span>
                </div>
                <Button
                  type="primary"
                  className="!w-full !bg-primary !border-none"
                  icon={<ArrowRightOutlined />}
                  onClick={() => setActiveSubjectId(Number(subject.id), { navigate: true })}
                >
                  Open Dashboard
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {isSchoolAdmin && (
        <div className="rounded-2xl border border-[var(--theme-border)] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-800">
              School-wide Management (All Subjects)
            </h2>
            <span className="text-xs font-medium text-slate-500">
              These tools stay outside subjects so you can assign students and teachers correctly.
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/students/all-students">
              <Card
                hoverable
                className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm h-full"
              >
                <div className="flex items-center gap-3">
                  <TeamOutlined className="text-lg text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-slate-800">All Students</div>
                    <div className="text-xs text-slate-500">
                      View students across all subjects and classes.
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/teachers">
              <Card hoverable className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <TeamOutlined className="text-lg text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-slate-800">Teachers</div>
                    <div className="text-xs text-slate-500">
                      Manage teachers and link them to the right subjects.
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/library">
              <Card hoverable className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <BookOutlined className="text-lg text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-slate-800">Library</div>
                    <div className="text-xs text-slate-500">
                      Shared resources available to the subjects you assign.
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/time_table">
              <Card hoverable className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <BookOutlined className="text-lg text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-slate-800">Timetable</div>
                    <div className="text-xs text-slate-500">
                      Build the school timetable across years and classes.
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/announcements">
              <Card hoverable className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <BookOutlined className="text-lg text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-slate-800">Announcements</div>
                    <div className="text-xs text-slate-500">
                      Send announcements to HODs, teachers, and students.
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/tools">
              <Card hoverable className="!rounded-2xl !border-[var(--theme-border)] !shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <BookOutlined className="text-lg text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-slate-800">Tools</div>
                    <div className="text-xs text-slate-500">
                      Extra tools that support all subjects.
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
