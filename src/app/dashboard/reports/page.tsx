"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type AnyObj = Record<string, unknown>;

type ClassOption = {
  classId: number;
  subjectClassId: number;
  label: string;
  yearId: number;
  yearName: string;
};

type StudentRow = {
  id: number;
  name: string;
  userName: string;
  gender: string;
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

  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [yearId, setYearId] = useState<number | null>(null);
  const [classKey, setClassKey] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // default subject = active subject or first available
  useEffect(() => {
    if (subjectId != null) return;
    const fallback = activeSubjectId ?? subjects[0]?.id ?? null;
    if (fallback != null) setSubjectId(Number(fallback));
  }, [activeSubjectId, subjects, subjectId]);

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
          fetchSubjectClasses({ subject_id: Number(subjectId) }),
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
            return {
              classId,
              subjectClassId: Number(row?.id ?? 0),
              label: normalizeSubjectName(resolveSubjectClassLabel(row as never)),
              yearId: yId,
              yearName: yearMap.get(yId) ?? "",
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

  const yearOptions = useMemo(() => {
    const map = new Map<number, string>();
    classes.forEach((c) => {
      if (c.yearId) map.set(c.yearId, c.yearName || `Year ${c.yearId}`);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));
  }, [classes]);

  const classOptions = useMemo(() => {
    const filtered = yearId ? classes.filter((c) => c.yearId === yearId) : classes;
    return filtered.map((c) => ({
      value: String(c.subjectClassId || c.classId),
      label: c.label || `Class ${c.classId}`,
    }));
  }, [classes, yearId]);

  const selectedClass = useMemo(
    () =>
      classes.find((c) => String(c.subjectClassId || c.classId) === classKey) ??
      null,
    [classes, classKey]
  );

  // load students when class selected
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setStudentsLoading(true);
      try {
        const rows = await fetchStudents(
          selectedClass.classId,
          subjectId ?? undefined,
          selectedClass.subjectClassId || undefined
        );
        const mapped = asArray(rows).map((row: AnyObj) => ({
          id: Number(row?.id ?? row?.student_id ?? 0),
          name: String(row?.student_name ?? row?.name ?? "Student"),
          userName: resolveUserName(row),
          gender: String(row?.gender ?? row?.student_gender ?? "").trim(),
        }));
        if (!cancelled) setStudents(mapped);
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
  }, [selectedClass, subjectId]);

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

  const studentHref = (id: number) => {
    const params = new URLSearchParams();
    if (subjectId) params.set("subject_id", String(subjectId));
    if (selectedClass?.classId) params.set("class_id", String(selectedClass.classId));
    if (selectedClass?.subjectClassId)
      params.set("subject_class_id", String(selectedClass.subjectClassId));
    const qs = params.toString();
    return `/dashboard/reports/student/${id}${qs ? `?${qs}` : ""}`;
  };

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
        <h1
          className="mt-3 m-0 text-[26px] font-extrabold leading-tight tracking-tight md:text-[34px]"
          style={{ color: "var(--theme-dark)" }}
        >
          Reports
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
          Pick a subject, year group and class, then open any student to see a full,
          inspection-ready report — attainment, behaviour, tracker progress, support
          needs and teacher comments, all in one place.
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
          {selectedClass
            ? `Students in ${selectedClass.label}`
            : "Students"}
          {selectedClass ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
              {filteredStudents.length}
            </span>
          ) : null}
        </div>

        {!selectedClass ? (
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
                href={studentHref(s.id)}
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
