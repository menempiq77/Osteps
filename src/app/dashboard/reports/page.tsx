"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Empty, Input, Select, Spin, Tag } from "antd";
import {
  FileSearchOutlined,
  SearchOutlined,
  RightOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import {
  resolveSubjectClassLinkedIdWithFallback,
  resolveSubjectClassLabel,
  resolveSubjectClassYearId,
} from "@/lib/subjectClassResolution";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { fetchStudents } from "@/services/studentsApi";
import { fetchWholeAssessmentsReport } from "@/services/reportApi";

type AnyObj = Record<string, unknown>;

type ClassOption = {
  classId: number;
  subjectClassId: number;
  label: string;
  yearId: number;
  yearName: string;
  archived: boolean;
};

type StudentRow = {
  id: number;
  name: string;
  userName: string;
  gender: string;
  classId: number;
  subjectClassId: number;
};

const asArray = <T = AnyObj,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const normalizeSubjectName = (value: unknown) =>
  String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

const resolveUserName = (row: AnyObj): string => {
  const candidates = [
    row?.user_name,
    row?.username,
    (row?.user as AnyObj)?.user_name,
    (row?.user as AnyObj)?.username,
    (row?.student as AnyObj)?.user_name,
  ];
  return (
    candidates.map((v) => String(v ?? "").trim()).find(Boolean) ?? ""
  );
};

export default function ReportsLandingPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const schoolId = currentUser?.school as number | undefined;
  const { subjects, activeSubjectId, loading: subjectsLoading } =
    useSubjectContext();
  const searchParams = useSearchParams();

  const querySubjectId = searchParams.get("subject_id");
  const queryYear = searchParams.get("year");
  const queryClass = searchParams.get("class");
  const isArchivedView = searchParams.get("archived") === "1";

  const [subjectId, setSubjectId] = useState<number | null>(
    querySubjectId ? Number(querySubjectId) : null
  );
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [yearId, setYearId] = useState<number | null>(null);
  const [classKey, setClassKey] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // default subject = query param, active subject or first available
  useEffect(() => {
    if (subjectId != null) return;
    const fallback =
      (querySubjectId ? Number(querySubjectId) : null) ??
      activeSubjectId ??
      subjects[0]?.id ??
      null;
    if (fallback != null) setSubjectId(Number(fallback));
  }, [activeSubjectId, subjects, subjectId, querySubjectId]);

  // load classes for the selected subject
  useEffect(() => {
    if (!subjectId || !schoolId) return;
    let cancelled = false;
    const run = async () => {
      setClassesLoading(true);
      setClasses([]);
      setYearId(null);
      setClassKey(null);
      setStudents([]);
      try {
        const [years, rows] = await Promise.all([
          fetchYearsBySchool(Number(schoolId)),
          fetchSubjectClasses({
            subject_id: Number(subjectId),
            include_inactive: true,
          }),
        ]);
        const yearMap = new Map(
          asArray(years).map((y: AnyObj) => [Number(y?.id), String(y?.name ?? "")])
        );
        const normalized = await Promise.all(
          asArray(rows).map(async (row: AnyObj) => {
            const linkedId = await resolveSubjectClassLinkedIdWithFallback(
              row as never,
              Number(subjectId)
            );
            const classId = Number(
              linkedId || row?.class_id || row?.base_class_id || row?.id || 0
            );
            const yId = Number(resolveSubjectClassYearId(row as never) || 0);
            const active =
              row?.is_active === undefined ? true : Number(row?.is_active) === 1;
            return {
              classId,
              subjectClassId: Number(row?.id ?? 0),
              label: normalizeSubjectName(resolveSubjectClassLabel(row as never)),
              yearId: yId,
              yearName: yearMap.get(yId) ?? "",
              archived: !active,
            } as ClassOption;
          })
        );
        const deduped = Array.from(
          new Map(
            normalized
              .filter((c) => Number.isFinite(c.classId) && c.classId > 0)
              .map((c) => [String(c.subjectClassId || c.classId), c])
          ).values()
        );
        if (!cancelled) setClasses(deduped);
      } catch {
        if (!cancelled) setClasses([]);
      } finally {
        if (!cancelled) setClassesLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [subjectId, schoolId]);

  // Active view lists active classes; archived view lists archived classes.
  const visibleClasses = useMemo(
    () => classes.filter((c) => c.archived === isArchivedView),
    [classes, isArchivedView]
  );

  // Preselect year + class from deep-link query params once classes load.
  useEffect(() => {
    if (!visibleClasses.length) return;
    const match = queryClass
      ? visibleClasses.find(
          (c) => String(c.subjectClassId || c.classId) === String(queryClass)
        )
      : undefined;
    if (match) {
      setYearId((prev) => prev ?? (match.yearId || null));
      setClassKey((prev) => prev ?? String(match.subjectClassId || match.classId));
    } else if (queryYear) {
      setYearId((prev) => prev ?? Number(queryYear));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleClasses]);

  const yearOptions = useMemo(() => {
    const map = new Map<number, string>();
    visibleClasses.forEach((c) => {
      if (c.yearId) map.set(c.yearId, c.yearName || `Year ${c.yearId}`);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));
  }, [visibleClasses]);

  const classOptions = useMemo(() => {
    const filtered = yearId
      ? visibleClasses.filter((c) => c.yearId === yearId)
      : visibleClasses;
    return filtered.map((c) => ({
      value: String(c.subjectClassId || c.classId),
      label: `${c.label || `Class ${c.classId}`}${c.archived ? " (archived)" : ""}`,
    }));
  }, [visibleClasses, yearId]);

  const selectedClass = useMemo(
    () =>
      visibleClasses.find(
        (c) => String(c.subjectClassId || c.classId) === classKey
      ) ?? null,
    [visibleClasses, classKey]
  );

  // The classes whose students we list: the selected class, or — for an
  // archived year with no specific class chosen — every archived class in that
  // year, so the user sees the whole year's students by name in one place.
  const targetClasses = useMemo<ClassOption[]>(() => {
    if (selectedClass) return [selectedClass];
    if (isArchivedView && yearId) {
      return visibleClasses.filter((c) => c.yearId === yearId);
    }
    return [];
  }, [selectedClass, isArchivedView, yearId, visibleClasses]);

  // load students for the target class(es)
  useEffect(() => {
    if (targetClasses.length === 0) {
      setStudents([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setStudentsLoading(true);
      try {
        const byId = new Map<number, StudentRow>();

        // The roster endpoint inner-joins on active enrolments, so it returns
        // nothing for an archived class. Assessment history is preserved
        // though, so for archived classes we derive the roster from the whole
        // assessments report (students who have marks in those classes).
        if (isArchivedView && schoolId) {
          const report = await fetchWholeAssessmentsReport(
            String(schoolId),
            subjectId ?? undefined
          );
          const classByLinkedId = new Map(
            targetClasses.map((c) => [c.classId, c])
          );
          asArray(report)
            .filter((assessment) =>
              classByLinkedId.has(Number(assessment?.class_id))
            )
            .forEach((assessment) => {
              const cls = classByLinkedId.get(Number(assessment?.class_id))!;
              asArray(assessment?.tasks).forEach((task) => {
                asArray(task?.submitted).forEach((row: AnyObj) => {
                  const id = Number(row?.student_id ?? 0);
                  if (id <= 0 || byId.has(id)) return;
                  byId.set(id, {
                    id,
                    name: String(row?.student_name ?? "Student"),
                    userName: resolveUserName(row),
                    gender: String(row?.gender ?? "").trim(),
                    classId: cls.classId,
                    subjectClassId: cls.subjectClassId,
                  });
                });
              });
            });
        }

        // Active classes (or archived ones with no assessment history) fall
        // back to the live roster endpoint per class.
        if (!isArchivedView || byId.size === 0) {
          for (const cls of targetClasses) {
            const rows = await fetchStudents(
              cls.classId,
              subjectId ?? undefined,
              cls.subjectClassId || undefined
            );
            asArray(rows).forEach((row: AnyObj) => {
              const id = Number(row?.id ?? row?.student_id ?? 0);
              if (id <= 0 || byId.has(id)) return;
              byId.set(id, {
                id,
                name: String(row?.student_name ?? row?.name ?? "Student"),
                userName: resolveUserName(row),
                gender: String(row?.gender ?? row?.student_gender ?? "").trim(),
                classId: cls.classId,
                subjectClassId: cls.subjectClassId,
              });
            });
          }
        }

        if (!cancelled) setStudents(Array.from(byId.values()));
      } catch {
        if (!cancelled) setStudents([]);
      } finally {
        if (!cancelled) setStudentsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [targetClasses, subjectId, isArchivedView, schoolId]);

  const subjectOptions = useMemo(
    () =>
      subjects.map((s) => ({
        value: Number(s.id),
        label: normalizeSubjectName(s.name),
      })),
    [subjects]
  );

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.userName.toLowerCase().includes(q)
    );
  }, [students, search]);

  const studentHref = (student: StudentRow) => {
    const params = new URLSearchParams();
    if (subjectId) params.set("subject_id", String(subjectId));
    if (student.classId) params.set("class_id", String(student.classId));
    if (student.subjectClassId)
      params.set("subject_class_id", String(student.subjectClassId));
    if (isArchivedView) params.set("archived", "1");
    const qs = params.toString();
    return `/dashboard/reports/student/${student.id}${qs ? `?${qs}` : ""}`;
  };

  const selectedYearName = useMemo(
    () => yearOptions.find((o) => o.value === yearId)?.label ?? "",
    [yearOptions, yearId]
  );
  const hasRosterTarget = targetClasses.length > 0;
  const rosterTitle = selectedClass
    ? `Students in ${selectedClass.label}`
    : isArchivedView && yearId
    ? `Students in ${selectedYearName || "this year group"}`
    : "Students";

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-3xl border p-5 shadow-sm md:p-7"
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
        <span
          className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur"
          style={{ borderColor: "var(--theme-border)", color: "var(--theme-dark)" }}
        >
          <FileSearchOutlined /> Student Reports
        </span>
        {isArchivedView ? (
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            Archived — read-only
          </span>
        ) : null}
        <h1
          className="mt-3 m-0 text-[26px] font-extrabold leading-tight tracking-tight md:text-[34px]"
          style={{ color: "var(--theme-dark)" }}
        >
          {isArchivedView ? "Archived class reports" : "Reports"}
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
          {isArchivedView
            ? "View the students who were in an archived class and open any of them to see their full history — attainment, behaviour, tracker progress, assessments and teacher comments. Read-only."
            : "Pick a subject, year group and class, then open any student to see a full, inspection-ready report — attainment, behaviour, tracker progress, support needs and teacher comments, all in one place."}
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Subject</label>
            <Select
              className="w-full"
              placeholder="Select subject"
              loading={subjectsLoading}
              value={subjectId ?? undefined}
              onChange={(v) => setSubjectId(Number(v))}
              options={subjectOptions}
              showSearch
              optionFilterProp="label"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Year group</label>
            <Select
              className="w-full"
              placeholder="All year groups"
              allowClear
              value={yearId ?? undefined}
              onChange={(v) => {
                setYearId(v ?? null);
                setClassKey(null);
              }}
              options={yearOptions}
              loading={classesLoading}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Class</label>
            <Select
              className="w-full"
              placeholder="Select class"
              allowClear
              value={classKey ?? undefined}
              onChange={(v) => setClassKey(v ?? null)}
              options={classOptions}
              loading={classesLoading}
              showSearch
              optionFilterProp="label"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Search student</label>
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Name or @username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Students */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <TeamOutlined />
          {rosterTitle}
          {hasRosterTarget ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
              {filteredStudents.length}
            </span>
          ) : null}
        </div>

        {!hasRosterTarget ? (
          <div className="py-10">
            <Empty description="Choose a subject and class to list students." />
          </div>
        ) : studentsLoading ? (
          <div className="flex justify-center py-12">
            <Spin />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-10">
            <Empty description="No students found for this class." />
          </div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStudents.map((s) => (
              <Link
                key={s.id}
                href={studentHref(s)}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[color:var(--theme-border)] hover:shadow-md"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {initialsOf(s.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{s.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {s.userName ? (
                      <span className="truncate font-mono text-xs text-slate-400">@{s.userName}</span>
                    ) : null}
                    {s.gender ? (
                      <Tag
                        color={s.gender.toLowerCase().startsWith("f") ? "magenta" : "blue"}
                        className="!m-0 !px-1.5 !text-[10px] !leading-4"
                      >
                        {s.gender}
                      </Tag>
                    ) : null}
                  </div>
                </div>
                <RightOutlined className="text-slate-300 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
