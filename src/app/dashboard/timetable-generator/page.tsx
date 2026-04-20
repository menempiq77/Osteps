"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import dayjs from "dayjs";
import {
  Button, Card, Checkbox, Collapse, Divider, Form, Input, InputNumber, message,
  Modal, Popconfirm, Progress, Result, Select, Slider, Space, Spin, Steps,
  Table, Tag, Tooltip, Typography,
} from "antd";
import {
  ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined,
  DeleteOutlined, ExperimentOutlined, InfoCircleOutlined,
  LoadingOutlined, PlusOutlined, RocketOutlined, ThunderboltOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchTeachers } from "@/services/teacherApi";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchSubjects } from "@/services/subjectsApi";
import { addTimetableSlot } from "@/services/timetableApi";
import { loadPeriods, loadSchoolDays, SchoolPeriod, DAYS_OF_WEEK } from "@/lib/schoolPeriods";
import {
  generateTimetable,
  GeneratorInput, GeneratorOutput, GeneratorSlot,
  GenYear, GenClass, GenSubjectAllocation, GenTeacher, GenConstraints,
  GenSplitClassRule, DEFAULT_CONSTRAINTS,
} from "@/lib/timetableGenerator";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// SCHOOL_DAYS: loaded from localStorage (configured in Timetable Builder → Periods)
const SCHOOL_DAYS = loadSchoolDays();

// ── Unique ID helper ────────────────────────────────────────────────────────
let _uid = 1;
const uid = () => String(_uid++);

// ── Step labels ─────────────────────────────────────────────────────────────
const STEP_ITEMS = [
  { title: "Structure",   description: "Years & Classes" },
  { title: "Subjects",    description: "Allocations" },
  { title: "Teachers",    description: "Staff & Availability" },
  { title: "Constraints", description: "Rules" },
  { title: "Generate",    description: "Review & Save" },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function TimetableGeneratorPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { currentUser } = useSelector((s: RootState) => s.auth);
  const schoolId = currentUser?.school;

  // ── Wizard step ─────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);

  // ── Step 1: School structure ────────────────────────────────────────────
  const [wizardYears, setWizardYears] = useState<GenYear[]>([]);

  // ── Step 2: Subject allocations ─────────────────────────────────────────
  const [allocations, setAllocations] = useState<GenSubjectAllocation[]>([]);

  // ── Step 3: Teachers ────────────────────────────────────────────────────
  const [wizardTeachers, setWizardTeachers] = useState<GenTeacher[]>([]);
  const [availModalTeacherId, setAvailModalTeacherId] = useState<string | null>(null);

  // ── Step 4: Constraints ─────────────────────────────────────────────────
  const [constraints, setConstraints] = useState<GenConstraints>({ ...DEFAULT_CONSTRAINTS });
  const [splitRules, setSplitRules] = useState<GenSplitClassRule[]>([]);

  // ── Step 5: Generate ────────────────────────────────────────────────────
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState("");
  const [genResult, setGenResult] = useState<GeneratorOutput | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  // ── Periods from localStorage ───────────────────────────────────────────
  const periods = useMemo(() => loadPeriods(), []);
  const teachingPeriods = useMemo(() => periods.filter((p) => p.isTeaching), [periods]);

  // ── Data queries (for pre-loading) ──────────────────────────────────────
  const { data: dbYears = [] } = useQuery<any[]>({
    queryKey: ["years", schoolId],
    enabled: !!schoolId,
    queryFn: () => fetchYearsBySchool(schoolId as number),
  });

  const { data: dbSubjects = [] } = useQuery<any[]>({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(),
  });

  const { data: dbTeachers = [] } = useQuery<any[]>({
    queryKey: ["teachers", "all"],
    queryFn: () => fetchTeachers("all"),
  });

  // ── Load from DB helpers ────────────────────────────────────────────────
  const loadYearsFromDB = useCallback(async () => {
    if (!dbYears.length) return;
    const years: GenYear[] = [];
    for (const y of dbYears) {
      try {
        const classes = await fetchClasses(String(y.id));
        years.push({
          id: String(y.id),
          name: y.name,
          classes: (classes as any[]).map((c: any) => ({
            id: String(c.id),
            name: c.class_name,
            yearId: String(y.id),
          })),
        });
      } catch {
        years.push({ id: String(y.id), name: y.name, classes: [] });
      }
    }
    // Only include years that have classes
    setWizardYears(years.filter((y) => y.classes.length > 0));
    messageApi.success(`Loaded ${years.filter((y) => y.classes.length > 0).length} year groups from database`);
  }, [dbYears, messageApi]);

  const loadSubjectsFromDB = useCallback(() => {
    if (!dbSubjects.length || !wizardYears.length) return;
    const allocs: GenSubjectAllocation[] = [];
    for (const subj of dbSubjects) {
      for (const yr of wizardYears) {
        allocs.push({
          subjectId: String(subj.id),
          subjectName: subj.name,
          yearId: yr.id,
          periodsPerWeek: 3, // sensible default
          room: "",
        });
      }
    }
    setAllocations(allocs);
    messageApi.success(`Loaded ${dbSubjects.length} subjects × ${wizardYears.length} year groups`);
  }, [dbSubjects, wizardYears, messageApi]);

  const loadTeachersFromDB = useCallback(() => {
    if (!dbTeachers.length) return;
    const teachers: GenTeacher[] = dbTeachers.map((t: any) => ({
      id: String(t.id),
      name: t.teacher_name || t.name || `Teacher ${t.id}`,
      subjectIds: [],
      maxPeriodsPerWeek: teachingPeriods.length * SCHOOL_DAYS.length,
      availability: {},
    }));
    setWizardTeachers(teachers);
    messageApi.success(`Loaded ${teachers.length} teachers`);
  }, [dbTeachers, teachingPeriods.length, messageApi]);

  // ── All classes flat list (for split-class dropdown) ────────────────────
  const allClasses = useMemo(() => wizardYears.flatMap((y) => y.classes), [wizardYears]);

  // ── All subject options ─────────────────────────────────────────────────
  const subjectOptions = useMemo(() => {
    const seen = new Set<string>();
    return allocations
      .filter((a) => { if (seen.has(a.subjectId)) return false; seen.add(a.subjectId); return true; })
      .map((a) => ({ value: a.subjectId, label: a.subjectName }));
  }, [allocations]);

  // ═══════════════════════════════════════════════════════════════════════
  // Step validation
  // ═══════════════════════════════════════════════════════════════════════
  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return wizardYears.length > 0 && wizardYears.some((y) => y.classes.length > 0);
      case 1: return allocations.length > 0 && allocations.some((a) => a.periodsPerWeek > 0);
      case 2: return wizardTeachers.length > 0 && wizardTeachers.some((t) => t.subjectIds.length > 0);
      case 3: return true;
      default: return false;
    }
  }, [step, wizardYears, allocations, wizardTeachers]);

  // ═══════════════════════════════════════════════════════════════════════
  // Generate
  // ═══════════════════════════════════════════════════════════════════════
  const runGenerate = useCallback(() => {
    setGenerating(true);
    setGenProgress(0);
    setGenMessage("Initializing…");
    setGenResult(null);

    // Run async to let UI update
    setTimeout(() => {
      try {
        const input: GeneratorInput = {
          years: wizardYears,
          allocations: allocations.filter((a) => a.periodsPerWeek > 0),
          teachers: wizardTeachers,
          periods,
          days: SCHOOL_DAYS,
          constraints: { ...constraints, splitClassRules: splitRules },
        };

        const result = generateTimetable(input, (pct, msg) => {
          setGenProgress(pct);
          setGenMessage(msg);
        });

        setGenResult(result);
        if (result.unplaced.length === 0) {
          messageApi.success(`All ${result.stats.placed} lessons placed successfully!`);
        } else {
          messageApi.warning(`${result.stats.placed} placed, ${result.stats.unplacedCount} could not be placed`);
        }
      } catch (err: any) {
        messageApi.error(`Generation failed: ${err.message}`);
      } finally {
        setGenerating(false);
      }
    }, 50);
  }, [wizardYears, allocations, wizardTeachers, periods, constraints, splitRules, messageApi]);

  // ═══════════════════════════════════════════════════════════════════════
  // Save to timetable API
  // ═══════════════════════════════════════════════════════════════════════
  const saveToAPI = useCallback(async () => {
    if (!genResult) return;
    setSaving(true);
    setSaveProgress(0);

    // Use next Sunday as the base date for the generated week
    const today = dayjs();
    const nextSunday = today.day() === 0 ? today : today.add(7 - today.day(), "day");

    const total = genResult.slots.length;
    let done = 0;
    let errors = 0;

    try {
      for (const slot of genResult.slots) {
        const dayIdx = SCHOOL_DAYS.indexOf(slot.day);
        const slotDate = nextSunday.add(dayIdx, "day").format("YYYY-MM-DD");

        try {
          await addTimetableSlot({
            subject: slot.subjectName,
            subject_id: slot.subjectId,
            teacher_id: slot.teacherId,
            year_id: slot.yearId,
            class_id: slot.classId,
            room: slot.room,
            date: slotDate,
            day: slot.day,
            start_time: slot.startTime,
            end_time: slot.endTime,
            school_id: schoolId ?? undefined,
          } as any, "all");
        } catch {
          errors++;
        }

        done++;
        setSaveProgress(Math.round((done / total) * 100));
      }
    } finally {
      setSaving(false);
    }

    if (errors > 0) {
      messageApi.warning(`Saved ${done - errors}/${total} slots (${errors} failed)`);
    } else {
      messageApi.success(`All ${total} slots saved! Open the Builder to review.`);
    }
  }, [genResult, schoolId, messageApi]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
      {contextHolder}

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-1">
          <RocketOutlined className="text-2xl text-blue-500" />
          <Title level={3} style={{ margin: 0 }}>Timetable Generator</Title>
        </div>
        <Text type="secondary">
          Build a complete school timetable automatically — define your structure, subjects, teachers, and let the algorithm handle the rest.
        </Text>
      </div>

      {/* Steps bar */}
      <div className="max-w-5xl mx-auto mb-6">
        <Steps current={step} items={STEP_ITEMS} size="small" />
      </div>

      {/* Step content */}
      <div className="max-w-5xl mx-auto">
        {step === 0 && (
          <StepStructure
            wizardYears={wizardYears}
            setWizardYears={setWizardYears}
            onLoadDB={loadYearsFromDB}
            hasDBData={dbYears.length > 0}
          />
        )}
        {step === 1 && (
          <StepSubjects
            wizardYears={wizardYears}
            allocations={allocations}
            setAllocations={setAllocations}
            onLoadDB={loadSubjectsFromDB}
            hasDBData={dbSubjects.length > 0}
          />
        )}
        {step === 2 && (
          <StepTeachers
            wizardTeachers={wizardTeachers}
            setWizardTeachers={setWizardTeachers}
            subjectOptions={subjectOptions}
            teachingPeriods={teachingPeriods}
            availModalTeacherId={availModalTeacherId}
            setAvailModalTeacherId={setAvailModalTeacherId}
            onLoadDB={loadTeachersFromDB}
            hasDBData={dbTeachers.length > 0}
          />
        )}
        {step === 3 && (
          <StepConstraints
            constraints={constraints}
            setConstraints={setConstraints}
            splitRules={splitRules}
            setSplitRules={setSplitRules}
            allClasses={allClasses}
            subjectOptions={subjectOptions}
          />
        )}
        {step === 4 && (
          <StepGenerate
            generating={generating}
            genProgress={genProgress}
            genMessage={genMessage}
            genResult={genResult}
            saving={saving}
            saveProgress={saveProgress}
            onGenerate={runGenerate}
            onSave={saveToAPI}
            teachingPeriods={teachingPeriods}
            wizardTeachers={wizardTeachers}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-5xl mx-auto mt-6 flex justify-between">
        <Button
          icon={<ArrowLeftOutlined />}
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            disabled={!canProceed}
            onClick={() => setStep((s) => s + 1)}
          >
            Next
          </Button>
        ) : (
          <a href="/dashboard/timetable-builder">
            <Button type="primary" icon={<ArrowRightOutlined />}>
              Open Builder
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 1: School Structure
// ═════════════════════════════════════════════════════════════════════════════
function StepStructure({
  wizardYears, setWizardYears, onLoadDB, hasDBData,
}: {
  wizardYears: GenYear[];
  setWizardYears: React.Dispatch<React.SetStateAction<GenYear[]>>;
  onLoadDB: () => void;
  hasDBData: boolean;
}) {
  const [newYearName, setNewYearName] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [addingClassToYear, setAddingClassToYear] = useState<string | null>(null);

  const addYear = () => {
    if (!newYearName.trim()) return;
    setWizardYears((prev) => [...prev, { id: uid(), name: newYearName.trim(), classes: [] }]);
    setNewYearName("");
  };

  const removeYear = (yearId: string) => {
    setWizardYears((prev) => prev.filter((y) => y.id !== yearId));
  };

  const addClass = (yearId: string) => {
    if (!newClassName.trim()) return;
    setWizardYears((prev) =>
      prev.map((y) =>
        y.id === yearId
          ? { ...y, classes: [...y.classes, { id: uid(), name: newClassName.trim(), yearId }] }
          : y
      )
    );
    setNewClassName("");
    setAddingClassToYear(null);
  };

  const removeClass = (yearId: string, classId: string) => {
    setWizardYears((prev) =>
      prev.map((y) =>
        y.id === yearId ? { ...y, classes: y.classes.filter((c) => c.id !== classId) } : y
      )
    );
  };

  return (
    <Card title="Step 1 — School Structure (Years & Classes)">
      <div className="mb-4 flex gap-2">
        {hasDBData && (
          <Button icon={<ThunderboltOutlined />} onClick={onLoadDB}>
            Load from Database
          </Button>
        )}
        <Tooltip title="Add a year group manually">
          <Space.Compact>
            <Input
              placeholder="Year name, e.g. Year 7"
              value={newYearName}
              onChange={(e) => setNewYearName(e.target.value)}
              onPressEnter={addYear}
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addYear}>Add Year</Button>
          </Space.Compact>
        </Tooltip>
      </div>

      {wizardYears.length === 0 && (
        <Result
          icon={<InfoCircleOutlined />}
          title="No year groups yet"
          subTitle="Load from your database or add manually"
        />
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {wizardYears.map((yr) => (
          <Card
            key={yr.id}
            size="small"
            title={<span className="font-semibold">{yr.name}</span>}
            extra={
              <Popconfirm title="Remove year?" onConfirm={() => removeYear(yr.id)}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            }
          >
            <div className="flex flex-wrap gap-1.5 mb-2">
              {yr.classes.map((cls) => (
                <Tag
                  key={cls.id}
                  closable
                  onClose={() => removeClass(yr.id, cls.id)}
                  color="blue"
                >
                  {cls.name}
                </Tag>
              ))}
              {yr.classes.length === 0 && (
                <Text type="secondary" className="text-xs">No classes</Text>
              )}
            </div>
            {addingClassToYear === yr.id ? (
              <Space.Compact size="small">
                <Input
                  placeholder="Class name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onPressEnter={() => addClass(yr.id)}
                  autoFocus
                  style={{ width: 120 }}
                />
                <Button size="small" type="primary" onClick={() => addClass(yr.id)}>Add</Button>
                <Button size="small" onClick={() => setAddingClassToYear(null)}>✕</Button>
              </Space.Compact>
            ) : (
              <Button
                size="small"
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => { setAddingClassToYear(yr.id); setNewClassName(""); }}
              >
                Add Class
              </Button>
            )}
          </Card>
        ))}
      </div>

      {wizardYears.length > 0 && (
        <div className="mt-3 text-xs text-slate-500">
          {wizardYears.length} year groups · {wizardYears.reduce((s, y) => s + y.classes.length, 0)} classes total
        </div>
      )}
    </Card>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 2: Subjects & Allocations
// ═════════════════════════════════════════════════════════════════════════════
function StepSubjects({
  wizardYears, allocations, setAllocations, onLoadDB, hasDBData,
}: {
  wizardYears: GenYear[];
  allocations: GenSubjectAllocation[];
  setAllocations: React.Dispatch<React.SetStateAction<GenSubjectAllocation[]>>;
  onLoadDB: () => void;
  hasDBData: boolean;
}) {
  const [newSubjName, setNewSubjName] = useState("");
  const [bulkPeriods, setBulkPeriods] = useState(3);

  const addSubject = () => {
    if (!newSubjName.trim()) return;
    const sid = uid();
    const newAllocs: GenSubjectAllocation[] = wizardYears.map((yr) => ({
      subjectId: sid,
      subjectName: newSubjName.trim(),
      yearId: yr.id,
      periodsPerWeek: bulkPeriods,
      room: "",
    }));
    setAllocations((prev) => [...prev, ...newAllocs]);
    setNewSubjName("");
  };

  const removeSubject = (subjectId: string) => {
    setAllocations((prev) => prev.filter((a) => a.subjectId !== subjectId));
  };

  const updateAlloc = (subjectId: string, yearId: string, field: string, value: any) => {
    setAllocations((prev) =>
      prev.map((a) =>
        a.subjectId === subjectId && a.yearId === yearId ? { ...a, [field]: value } : a
      )
    );
  };

  // Group by subject
  const grouped = useMemo(() => {
    const map = new Map<string, GenSubjectAllocation[]>();
    for (const a of allocations) {
      if (!map.has(a.subjectId)) map.set(a.subjectId, []);
      map.get(a.subjectId)!.push(a);
    }
    return Array.from(map.entries());
  }, [allocations]);

  return (
    <Card title="Step 2 — Subjects & Period Allocations">
      <div className="mb-4 flex flex-wrap gap-2 items-end">
        {hasDBData && (
          <Button icon={<ThunderboltOutlined />} onClick={onLoadDB}>
            Load from Database
          </Button>
        )}
        <Space.Compact>
          <Input
            placeholder="Subject name, e.g. Math"
            value={newSubjName}
            onChange={(e) => setNewSubjName(e.target.value)}
            onPressEnter={addSubject}
            style={{ width: 180 }}
          />
          <InputNumber
            min={1}
            max={20}
            value={bulkPeriods}
            onChange={(v) => setBulkPeriods(v ?? 3)}
            style={{ width: 80 }}
            addonAfter="p/w"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addSubject}>Add Subject</Button>
        </Space.Compact>
      </div>

      {grouped.length === 0 && (
        <Result
          icon={<InfoCircleOutlined />}
          title="No subjects yet"
          subTitle="Load from database or add manually. Periods-per-week can be set per year group."
        />
      )}

      <Collapse
        accordion
        items={grouped.map(([subjectId, allocs]) => ({
          key: subjectId,
          label: (
            <div className="flex items-center justify-between w-full pr-4">
              <span className="font-medium">{allocs[0].subjectName}</span>
              <span className="text-xs text-slate-400">
                {allocs.reduce((s, a) => s + a.periodsPerWeek, 0)} total periods/week
              </span>
            </div>
          ),
          extra: (
            <Popconfirm title="Remove subject?" onConfirm={() => removeSubject(subjectId)}>
              <Button size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
            </Popconfirm>
          ),
          children: (
            <div className="grid gap-2">
              {allocs.map((alloc) => {
                const yr = wizardYears.find((y) => y.id === alloc.yearId);
                return (
                  <div key={alloc.yearId} className="flex items-center gap-3 text-sm">
                    <span className="w-36 truncate text-slate-600">{yr?.name ?? alloc.yearId}</span>
                    <InputNumber
                      min={0}
                      max={20}
                      value={alloc.periodsPerWeek}
                      onChange={(v) => updateAlloc(subjectId, alloc.yearId, "periodsPerWeek", v ?? 0)}
                      size="small"
                      addonAfter="p/w"
                      style={{ width: 110 }}
                    />
                    <Input
                      size="small"
                      placeholder="Room (optional)"
                      value={alloc.room}
                      onChange={(e) => updateAlloc(subjectId, alloc.yearId, "room", e.target.value)}
                      style={{ width: 130 }}
                    />
                  </div>
                );
              })}
            </div>
          ),
        }))}
      />

      {grouped.length > 0 && (
        <div className="mt-3 text-xs text-slate-500">
          {grouped.length} subjects · {allocations.reduce((s, a) => s + a.periodsPerWeek, 0)} total period-allocations across all year groups
        </div>
      )}
    </Card>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 3: Teachers
// ═════════════════════════════════════════════════════════════════════════════
function StepTeachers({
  wizardTeachers, setWizardTeachers, subjectOptions, teachingPeriods,
  availModalTeacherId, setAvailModalTeacherId, onLoadDB, hasDBData,
}: {
  wizardTeachers: GenTeacher[];
  setWizardTeachers: React.Dispatch<React.SetStateAction<GenTeacher[]>>;
  subjectOptions: { value: string; label: string }[];
  teachingPeriods: SchoolPeriod[];
  availModalTeacherId: string | null;
  setAvailModalTeacherId: (id: string | null) => void;
  onLoadDB: () => void;
  hasDBData: boolean;
}) {
  const [newTeacherName, setNewTeacherName] = useState("");

  const addTeacher = () => {
    if (!newTeacherName.trim()) return;
    setWizardTeachers((prev) => [
      ...prev,
      {
        id: uid(),
        name: newTeacherName.trim(),
        subjectIds: [],
        maxPeriodsPerWeek: teachingPeriods.length * SCHOOL_DAYS.length,
        availability: {},
      },
    ]);
    setNewTeacherName("");
  };

  const removeTeacher = (id: string) => {
    setWizardTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTeacher = (id: string, field: string, value: any) => {
    setWizardTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const availTeacher = wizardTeachers.find((t) => t.id === availModalTeacherId);

  const toggleAvailability = (teacherId: string, day: string, periodIdx: number) => {
    setWizardTeachers((prev) =>
      prev.map((t) => {
        if (t.id !== teacherId) return t;
        const avail = { ...t.availability };
        if (!avail[day]) {
          avail[day] = teachingPeriods.map(() => true);
        }
        avail[day] = [...avail[day]];
        avail[day][periodIdx] = !avail[day][periodIdx];
        return { ...t, availability: avail };
      })
    );
  };

  return (
    <Card title="Step 3 — Teachers & Availability">
      <div className="mb-4 flex flex-wrap gap-2">
        {hasDBData && (
          <Button icon={<ThunderboltOutlined />} onClick={onLoadDB}>
            Load from Database
          </Button>
        )}
        <Space.Compact>
          <Input
            placeholder="Teacher name"
            value={newTeacherName}
            onChange={(e) => setNewTeacherName(e.target.value)}
            onPressEnter={addTeacher}
            style={{ width: 180 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addTeacher}>Add Teacher</Button>
        </Space.Compact>
      </div>

      {wizardTeachers.length === 0 && (
        <Result
          icon={<InfoCircleOutlined />}
          title="No teachers yet"
          subTitle="Load from database or add manually"
        />
      )}

      <div className="space-y-2 max-h-[450px] overflow-y-auto">
        {wizardTeachers.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
          >
            <span className="font-medium w-36 truncate">{t.name}</span>

            <Select
              mode="multiple"
              size="small"
              placeholder="Subjects"
              style={{ width: 220 }}
              value={t.subjectIds}
              onChange={(v) => updateTeacher(t.id, "subjectIds", v)}
              options={subjectOptions}
              maxTagCount={2}
            />

            <InputNumber
              size="small"
              min={1}
              max={50}
              value={t.maxPeriodsPerWeek}
              onChange={(v) => updateTeacher(t.id, "maxPeriodsPerWeek", v ?? 30)}
              addonAfter="max p/w"
              style={{ width: 130 }}
            />

            <Button
              size="small"
              onClick={() => setAvailModalTeacherId(t.id)}
            >
              Availability
            </Button>

            <Popconfirm title="Remove?" onConfirm={() => removeTeacher(t.id)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>

            {t.subjectIds.length === 0 && (
              <Tag color="warning" className="text-[10px]">No subjects assigned</Tag>
            )}
          </div>
        ))}
      </div>

      {wizardTeachers.length > 0 && (
        <div className="mt-3 text-xs text-slate-500">
          {wizardTeachers.length} teachers · {wizardTeachers.filter((t) => t.subjectIds.length > 0).length} with subjects assigned
        </div>
      )}

      {/* Availability Modal */}
      <Modal
        title={`Availability — ${availTeacher?.name ?? ""}`}
        open={!!availModalTeacherId}
        onCancel={() => setAvailModalTeacherId(null)}
        footer={<Button type="primary" onClick={() => setAvailModalTeacherId(null)}>Done</Button>}
        width={600}
      >
        {availTeacher && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border p-1 bg-slate-50 text-slate-500">Period</th>
                  {SCHOOL_DAYS.map((d) => (
                    <th key={d} className="border p-1 bg-slate-50 text-slate-500">{d.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachingPeriods.map((period, pi) => (
                  <tr key={period.id}>
                    <td className="border p-1 text-center font-medium text-slate-600">
                      {period.label}<br />
                      <span className="text-slate-400 text-[10px]">{period.startTime}</span>
                    </td>
                    {SCHOOL_DAYS.map((day) => {
                      const avail = availTeacher.availability[day];
                      const isAvail = !avail || avail[pi] !== false;
                      return (
                        <td
                          key={day}
                          className={`border p-1 text-center cursor-pointer transition-colors ${
                            isAvail
                              ? "bg-green-50 hover:bg-green-100 text-green-700"
                              : "bg-red-50 hover:bg-red-100 text-red-500"
                          }`}
                          onClick={() => toggleAvailability(availTeacher.id, day, pi)}
                        >
                          {isAvail ? "✓" : "✕"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-xs text-slate-400">
              Click a cell to toggle availability. Green = available, Red = unavailable.
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 4: Constraints
// ═════════════════════════════════════════════════════════════════════════════
function StepConstraints({
  constraints, setConstraints, splitRules, setSplitRules, allClasses, subjectOptions,
}: {
  constraints: GenConstraints;
  setConstraints: React.Dispatch<React.SetStateAction<GenConstraints>>;
  splitRules: GenSplitClassRule[];
  setSplitRules: React.Dispatch<React.SetStateAction<GenSplitClassRule[]>>;
  allClasses: GenClass[];
  subjectOptions: { value: string; label: string }[];
}) {
  return (
    <Card title="Step 4 — Scheduling Constraints">
      <div className="space-y-6">
        {/* Max consecutive */}
        <div>
          <Text strong>Max consecutive periods per teacher</Text>
          <Paragraph type="secondary" className="text-xs !mb-1">
            Prevent teachers from teaching too many periods in a row without a break.
          </Paragraph>
          <Slider
            min={2}
            max={8}
            value={constraints.maxConsecutivePerTeacher}
            onChange={(v) => setConstraints((c) => ({ ...c, maxConsecutivePerTeacher: v }))}
            marks={{ 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8" }}
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Spread across days */}
        <div>
          <Checkbox
            checked={constraints.spreadSubjectsAcrossDays}
            onChange={(e) =>
              setConstraints((c) => ({ ...c, spreadSubjectsAcrossDays: e.target.checked }))
            }
          >
            <Text strong>Spread subjects across different days</Text>
          </Checkbox>
          <Paragraph type="secondary" className="text-xs !mt-0.5">
            Prefer placing the same subject's lessons on different days rather than clustering them.
          </Paragraph>
        </div>

        {/* Backtrack depth */}
        <div>
          <Text strong>Algorithm backtrack depth</Text>
          <Paragraph type="secondary" className="text-xs !mb-1">
            Higher = better results but slower. 200 is usually fine.
          </Paragraph>
          <Slider
            min={50}
            max={1000}
            step={50}
            value={constraints.maxBacktrackDepth}
            onChange={(v) => setConstraints((c) => ({ ...c, maxBacktrackDepth: v }))}
            style={{ maxWidth: 400 }}
          />
          <Text type="secondary" className="text-xs">{constraints.maxBacktrackDepth}</Text>
        </div>

        <Divider />

        {/* Split classes */}
        <div>
          <Text strong>Split Classes</Text>
          <Paragraph type="secondary" className="text-xs !mb-2">
            If a class splits into groups for certain subjects (e.g. boys/girls, set A/B), configure it here.
          </Paragraph>

          {splitRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2 text-sm">
              <Select
                size="small"
                placeholder="Class"
                value={rule.classId || undefined}
                onChange={(v) =>
                  setSplitRules((prev) =>
                    prev.map((r, i) => (i === idx ? { ...r, classId: v } : r))
                  )
                }
                options={allClasses.map((c) => ({ value: c.id, label: c.name }))}
                style={{ width: 140 }}
                showSearch
                optionFilterProp="label"
              />
              <Select
                size="small"
                placeholder="Subject"
                value={rule.subjectId || undefined}
                onChange={(v) =>
                  setSplitRules((prev) =>
                    prev.map((r, i) => (i === idx ? { ...r, subjectId: v } : r))
                  )
                }
                options={subjectOptions}
                style={{ width: 140 }}
                showSearch
                optionFilterProp="label"
              />
              <InputNumber
                size="small"
                min={2}
                max={4}
                value={rule.groups}
                onChange={(v) =>
                  setSplitRules((prev) =>
                    prev.map((r, i) => (i === idx ? { ...r, groups: v ?? 2 } : r))
                  )
                }
                addonAfter="groups"
                style={{ width: 110 }}
              />
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => setSplitRules((prev) => prev.filter((_, i) => i !== idx))}
              />
            </div>
          ))}

          <Button
            size="small"
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setSplitRules((prev) => [...prev, { classId: "", subjectId: "", groups: 2 }])}
          >
            Add Split Rule
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STEP 5: Generate & Review
// ═════════════════════════════════════════════════════════════════════════════
function StepGenerate({
  generating, genProgress, genMessage, genResult,
  saving, saveProgress, onGenerate, onSave,
  teachingPeriods, wizardTeachers,
}: {
  generating: boolean;
  genProgress: number;
  genMessage: string;
  genResult: GeneratorOutput | null;
  saving: boolean;
  saveProgress: number;
  onGenerate: () => void;
  onSave: () => void;
  teachingPeriods: SchoolPeriod[];
  wizardTeachers: GenTeacher[];
}) {
  return (
    <Card title="Step 5 — Generate & Review">
      {/* Generate button */}
      {!genResult && !generating && (
        <div className="text-center py-8">
          <ExperimentOutlined className="text-5xl text-blue-400 mb-4" />
          <Title level={4}>Ready to Generate</Title>
          <Paragraph type="secondary">
            The algorithm will place lessons into the grid while avoiding all conflicts.
            This typically takes a few seconds.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={onGenerate}
          >
            Generate Timetable
          </Button>
        </div>
      )}

      {/* Progress */}
      {generating && (
        <div className="text-center py-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} />} />
          <div className="mt-4">
            <Progress percent={genProgress} status="active" />
            <Text type="secondary">{genMessage}</Text>
          </div>
        </div>
      )}

      {/* Results */}
      {genResult && !generating && (
        <div className="space-y-4">
          {/* Stats banner */}
          <div className={`p-4 rounded-xl border ${genResult.unplaced.length === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              {genResult.unplaced.length === 0 ? (
                <CheckCircleOutlined className="text-green-500 text-xl" />
              ) : (
                <WarningOutlined className="text-amber-500 text-xl" />
              )}
              <Text strong className="text-lg">
                {genResult.unplaced.length === 0
                  ? "All lessons placed successfully!"
                  : `${genResult.stats.placed} placed, ${genResult.stats.unplacedCount} could not be placed`}
              </Text>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>Total lessons: <strong>{genResult.stats.totalLessons}</strong></span>
              <span>Placed: <strong>{genResult.stats.placed}</strong></span>
              <span>Unplaced: <strong>{genResult.stats.unplacedCount}</strong></span>
              <span>Time: <strong>{genResult.stats.durationMs.toFixed(0)}ms</strong></span>
            </div>
          </div>

          {/* Teacher utilization */}
          <Collapse
            items={[{
              key: "util",
              label: "Teacher Utilization",
              children: (
                <div className="grid gap-1 text-sm max-h-48 overflow-y-auto">
                  {Object.entries(genResult.stats.teacherUtilization).map(([tId, util]) => {
                    const teacher = wizardTeachers.find((t) => t.id === tId);
                    const pct = util.max > 0 ? Math.round((util.assigned / util.max) * 100) : 0;
                    return (
                      <div key={tId} className="flex items-center gap-2">
                        <span className="w-32 truncate">{teacher?.name ?? tId}</span>
                        <Progress
                          percent={pct}
                          size="small"
                          style={{ width: 150 }}
                          status={pct > 90 ? "exception" : "normal"}
                        />
                        <span className="text-xs text-slate-400">{util.assigned}/{util.max}</span>
                      </div>
                    );
                  })}
                </div>
              ),
            }]}
          />

          {/* Unplaced lessons */}
          {genResult.unplaced.length > 0 && (
            <Collapse
              items={[{
                key: "unplaced",
                label: <span className="text-red-600">Unplaced Lessons ({genResult.unplaced.length})</span>,
                children: (
                  <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
                    {genResult.unplaced.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 p-1.5 bg-red-50 rounded text-red-700">
                        <WarningOutlined />
                        <span><strong>{u.subjectName}</strong> — {u.className}</span>
                        <span className="text-xs text-red-400 ml-auto">{u.reason}</span>
                      </div>
                    ))}
                  </div>
                ),
              }]}
            />
          )}

          {/* Mini preview — Day × Period grid showing counts */}
          <Collapse
            defaultActiveKey={["preview"]}
            items={[{
              key: "preview",
              label: "Timetable Preview",
              children: (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-1 bg-slate-50">Period</th>
                        {SCHOOL_DAYS.map((d) => (
                          <th key={d} className="border p-1 bg-slate-50">{d.slice(0, 3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {teachingPeriods.map((period, pi) => (
                        <tr key={period.id}>
                          <td className="border p-1 text-center font-medium bg-slate-50">
                            {period.label}
                          </td>
                          {SCHOOL_DAYS.map((day) => {
                            const daySlots = genResult.slots.filter(
                              (s) => s.day === day && s.periodIndex === pi
                            );
                            // Group by subject
                            const subjectCounts = new Map<string, number>();
                            for (const s of daySlots) {
                              subjectCounts.set(s.subjectName, (subjectCounts.get(s.subjectName) ?? 0) + 1);
                            }
                            return (
                              <td key={day} className="border p-1 text-center align-top">
                                {daySlots.length === 0 ? (
                                  <span className="text-slate-300">—</span>
                                ) : (
                                  <div className="flex flex-wrap gap-0.5 justify-center">
                                    {Array.from(subjectCounts.entries()).slice(0, 4).map(([name, count]) => (
                                      <Tag key={name} className="text-[9px] !m-0" color="blue">
                                        {name.slice(0, 6)}{count > 1 ? ` ×${count}` : ""}
                                      </Tag>
                                    ))}
                                    {subjectCounts.size > 4 && (
                                      <span className="text-[10px] text-blue-400">+{subjectCounts.size - 4}</span>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            }]}
          />

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t">
            <Button icon={<RocketOutlined />} onClick={onGenerate} disabled={saving}>
              Re-generate
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={onSave}
              loading={saving}
            >
              {saving ? `Saving… ${saveProgress}%` : `Save ${genResult.stats.placed} Slots as Draft`}
            </Button>
            {saving && (
              <Progress percent={saveProgress} size="small" style={{ width: 200 }} />
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
