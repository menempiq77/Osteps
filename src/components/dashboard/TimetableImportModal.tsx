"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  Modal,
  Steps,
  Upload,
  DatePicker,
  Table,
  Select,
  Button,
  Progress,
  Alert,
  Tooltip,
  message,
  Tag,
} from "antd";
import {
  DownloadOutlined,
  CheckCircleOutlined,
  WarningFilled,
  InboxOutlined,
} from "@ant-design/icons";
import { addTimetableSlot } from "@/services/timetableApi";

const { Option } = Select;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalise a person's name for fuzzy matching (strips titles). */
const normName = (s: string) =>
  String(s || "")
    .toLowerCase()
    .replace(/^(mr|mrs|ms|dr|miss|prof)\.?\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

/** Fuzzy-match a teacher name against the list from the DB. */
function fuzzyTeacher(name: string, list: any[]): any | null {
  const n = normName(name);
  if (!n) return null;
  return (
    list.find((t) => normName(t.teacher_name) === n) ??
    list.find((t) => normName(t.teacher_name).includes(n)) ??
    list.find((t) => n.includes(normName(t.teacher_name))) ??
    null
  );
}

/** Fuzzy-match a class label like "7IA/Is" against DB class_name. */
function fuzzyClass(label: string, list: any[]): any | null {
  const base = String(label || "")
    .split("/")[0]
    .trim()
    .toLowerCase();
  if (!base) return null;
  return (
    list.find((c) => c.class_name.toLowerCase() === base) ??
    list.find((c) => c.class_name.toLowerCase().startsWith(base)) ??
    list.find((c) => base.startsWith(c.class_name.toLowerCase())) ??
    null
  );
}

/** Given a "week start" date and a day name, return the real YYYY-MM-DD. */
function dateForDay(weekStart: dayjs.Dayjs, dayName: string): string | null {
  const offsets: Record<string, number> = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6,
  };
  const key = dayName.trim().toLowerCase();
  const target = offsets[key];
  if (target === undefined) return null;
  const startDay = weekStart.day(); // 0=Sun,1=Mon…
  let offset = target - startDay;
  if (offset < 0) offset += 7;
  return weekStart.add(offset, "day").format("YYYY-MM-DD");
}

// ── Template download ─────────────────────────────────────────────────────────

const TEMPLATE_ROWS = [
  {
    subject: "Islamic Education",
    class_name: "7IA/Is",
    teacher_name: "Mrs Qtait",
    room: "C10",
    day: "Tuesday",
    start_time: "08:00",
    end_time: "09:00",
  },
  {
    subject: "Islamic Education",
    class_name: "7IB1/Is",
    teacher_name: "Mr Eleslamboly",
    room: "C7",
    day: "Tuesday",
    start_time: "08:00",
    end_time: "09:00",
  },
  {
    subject: "Islamic Education",
    class_name: "122A/Is",
    teacher_name: "Mrs Qtait",
    room: "C7",
    day: "Tuesday",
    start_time: "09:00",
    end_time: "10:00",
  },
  {
    subject: "Math",
    class_name: "8A",
    teacher_name: "Mr Smith",
    room: "C5",
    day: "Wednesday",
    start_time: "10:20",
    end_time: "11:20",
  },
];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(TEMPLATE_ROWS);
  ws["!cols"] = [
    { wch: 22 },
    { wch: 14 },
    { wch: 22 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Timetable Template");

  // Second sheet: iSAMS column mapping guide
  const guideData = [
    { "Template Column": "subject", "iSAMS Column": "SubjectName / PeriodName / Subject" },
    { "Template Column": "class_name", "iSAMS Column": "SetCode / GroupName / Class" },
    { "Template Column": "teacher_name", "iSAMS Column": "StaffName / TeacherName / Teacher" },
    { "Template Column": "room", "iSAMS Column": "RoomShortName / RoomName / Room / Location" },
    { "Template Column": "day", "iSAMS Column": "DayName / DayOfWeek / Day (e.g. Monday)" },
    { "Template Column": "start_time", "iSAMS Column": "StartTime / PeriodStart (HH:MM)" },
    { "Template Column": "end_time", "iSAMS Column": "EndTime / PeriodEnd / Finish (HH:MM)" },
  ];
  const ws2 = XLSX.utils.json_to_sheet(guideData);
  ws2["!cols"] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Column Mapping Guide");

  XLSX.writeFile(wb, "osteps_timetable_template.xlsx");
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParsedRow {
  _idx: number;
  subject: string;
  class_name: string;
  teacher_name: string;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
}

interface ResolvedRow extends ParsedRow {
  date: string | null;
  class_id: number | null;
  year_id: number | null;
  teacher_id: number | null;
  status: "ok" | "warn";
  issues: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  teachers: any[];
  allClasses: any[];
  schoolId?: number | null;
  onImported: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimetableImportModal({
  open,
  onClose,
  teachers,
  allClasses,
  schoolId,
  onImported,
}: Props) {
  const [step, setStep] = useState(0);
  const [weekStart, setWeekStart] = useState<dayjs.Dayjs | null>(null);
  const [rawRows, setRawRows] = useState<ParsedRow[]>([]);
  const [overrides, setOverrides] = useState<
    Record<number, { class_id?: string; teacher_id?: string }>
  >({});
  const [fileUploaded, setFileUploaded] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    ok: number;
    fail: number;
    errors: string[];
  } | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // ── Resolve rows ────────────────────────────────────────────────────────────
  const resolvedRows: ResolvedRow[] = useMemo(() => {
    if (!weekStart) return [];
    return rawRows.map((row) => {
      const override = overrides[row._idx] || {};
      const issues: string[] = [];

      // Date
      const date = dateForDay(weekStart, row.day);
      if (!date) issues.push(`Unknown day: "${row.day}"`);

      // Teacher
      let teacher_id: number | null = null;
      if (override.teacher_id) {
        teacher_id = Number(override.teacher_id);
      } else {
        const t = fuzzyTeacher(row.teacher_name, teachers);
        if (t) {
          teacher_id = Number(t.id);
        } else if (row.teacher_name) {
          issues.push(`Teacher not matched: "${row.teacher_name}"`);
        }
      }

      // Class
      let class_id: number | null = null;
      let year_id: number | null = null;
      if (override.class_id) {
        class_id = Number(override.class_id);
        const cls = allClasses.find((c) => String(c.id) === override.class_id);
        year_id = cls ? Number(cls.year_id) : null;
      } else {
        const cls = fuzzyClass(row.class_name, allClasses);
        if (cls) {
          class_id = Number(cls.id);
          year_id = Number(cls.year_id);
        } else if (row.class_name) {
          issues.push(`Class not matched: "${row.class_name}"`);
        }
      }

      return {
        ...row,
        date,
        class_id,
        year_id,
        teacher_id,
        status: issues.length === 0 ? "ok" : "warn",
        issues,
      };
    });
  }, [rawRows, weekStart, overrides, teachers, allClasses]);

  const okCount = resolvedRows.filter((r) => r.status === "ok").length;
  const warnCount = resolvedRows.filter((r) => r.status === "warn").length;
  // Rows that have minimum required data (subject + date + class)
  const importableRows = resolvedRows.filter(
    (r) => r.subject && r.date && r.class_id && r.year_id
  );

  // ── File parser ─────────────────────────────────────────────────────────────
  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), {
          type: "array",
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        const normalized: ParsedRow[] = json
          .map((rawRow, i) => {
            // Normalize column names
            const r: Record<string, string> = {};
            for (const [k, v] of Object.entries(rawRow)) {
              r[k.toLowerCase().replace(/[\s\-\/]+/g, "_")] = String(v || "").trim();
            }
            return {
              _idx: i,
              subject:
                r.subject ||
                r.subject_name ||
                r.subjectname ||
                r.periodname ||
                r.timetable_subject ||
                "",
              class_name:
                r.class_name ||
                r.classname ||
                r.setcode ||
                r.set ||
                r.group ||
                r.groupname ||
                r.class ||
                "",
              teacher_name:
                r.teacher_name ||
                r.teachername ||
                r.staffname ||
                r.teacher ||
                r.staff ||
                "",
              room:
                r.room ||
                r.room_name ||
                r.roomname ||
                r.roomshortname ||
                r.location ||
                "",
              day:
                r.day ||
                r.day_name ||
                r.dayname ||
                r.dayofweek ||
                r.weekday ||
                "",
              start_time:
                r.start_time ||
                r.starttime ||
                r.period_start ||
                r.start ||
                "",
              end_time:
                r.end_time ||
                r.endtime ||
                r.period_end ||
                r.finish ||
                r.end ||
                "",
            };
          })
          .filter((r) => r.subject || r.class_name);

        setRawRows(normalized);
        setFileUploaded(true);
        messageApi.success(`${normalized.length} rows parsed from file`);
      } catch {
        messageApi.error("Failed to parse file — check the format and try again");
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // prevent antd auto-upload
  };

  // ── Import ───────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    setImporting(true);
    setProgress(0);
    let ok = 0,
      fail = 0;
    const errors: string[] = [];
    const DAY_NAMES = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < importableRows.length; i++) {
      const row = importableRows[i];
      try {
        await addTimetableSlot({
          subject: row.subject,
          year_id: String(row.year_id || ""),
          teacher_id: String(row.teacher_id || ""),
          class_id: String(row.class_id || ""),
          room: row.room,
          date: row.date!,
          day: row.date ? DAY_NAMES[dayjs(row.date).day()] : row.day,
          start_time: row.start_time,
          end_time: row.end_time,
          school_id: schoolId ?? undefined,
        });
        ok++;
      } catch (err: any) {
        fail++;
        errors.push(
          `Row ${i + 1} (${row.subject} / ${row.class_name}): ${
            err?.message || "failed"
          }`
        );
      }
      setProgress(Math.round(((i + 1) / importableRows.length) * 100));
      // Small yield to keep UI responsive
      await new Promise((r) => setTimeout(r, 40));
    }

    setResults({ ok, fail, errors });
    setImporting(false);
    if (ok > 0) onImported();
  };

  const reset = () => {
    setStep(0);
    setWeekStart(null);
    setRawRows([]);
    setOverrides({});
    setFileUploaded(false);
    setImporting(false);
    setProgress(0);
    setResults(null);
  };

  // ── Preview table columns ────────────────────────────────────────────────────
  const columns = [
    {
      title: "",
      key: "status",
      width: 36,
      render: (_: any, row: ResolvedRow) =>
        row.status === "ok" ? (
          <CheckCircleOutlined style={{ color: "#22c55e" }} />
        ) : (
          <Tooltip title={row.issues.join(" • ")}>
            <WarningFilled style={{ color: "#f59e0b" }} />
          </Tooltip>
        ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
    },
    {
      title: "Class",
      key: "class",
      width: 175,
      render: (_: any, row: ResolvedRow) => {
        if (row.class_id) {
          const cls = allClasses.find((c) => Number(c.id) === row.class_id);
          return (
            <Tag color="green" className="text-xs font-medium">
              {cls?.class_name || row.class_name}
            </Tag>
          );
        }
        return (
          <Select
            size="small"
            placeholder={
              <span className="text-amber-500 text-xs">
                {row.class_name || "Select class"}
              </span>
            }
            style={{ width: "100%" }}
            value={overrides[row._idx]?.class_id}
            onChange={(v) =>
              setOverrides((p) => ({
                ...p,
                [row._idx]: { ...p[row._idx], class_id: v },
              }))
            }
            showSearch
            optionFilterProp="children"
          >
            {allClasses.map((c) => (
              <Option key={c.id} value={String(c.id)}>
                {c.class_name}
                {c.year_name ? ` (${c.year_name})` : ""}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Teacher",
      key: "teacher",
      width: 185,
      render: (_: any, row: ResolvedRow) => {
        if (row.teacher_id) {
          const t = teachers.find((t) => Number(t.id) === row.teacher_id);
          return (
            <Tag color="blue" className="text-xs font-medium">
              {t?.teacher_name || row.teacher_name}
            </Tag>
          );
        }
        return (
          <Select
            size="small"
            placeholder={
              <span className="text-amber-500 text-xs">
                {row.teacher_name || "No teacher"}
              </span>
            }
            style={{ width: "100%" }}
            value={overrides[row._idx]?.teacher_id}
            onChange={(v) =>
              setOverrides((p) => ({
                ...p,
                [row._idx]: { ...p[row._idx], teacher_id: v },
              }))
            }
            showSearch
            optionFilterProp="children"
          >
            {teachers.map((t) => (
              <Option key={t.id} value={String(t.id)}>
                {t.teacher_name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    { title: "Room", dataIndex: "room", key: "room", width: 60 },
    { title: "Day", dataIndex: "day", key: "day", width: 95 },
    {
      title: "Time",
      key: "time",
      width: 115,
      render: (_: any, row: ResolvedRow) =>
        `${row.start_time} – ${row.end_time}`,
    },
    {
      title: "Date",
      key: "date",
      width: 105,
      render: (_: any, row: ResolvedRow) =>
        row.date ? (
          <span className="text-xs text-slate-600">
            {dayjs(row.date).format("ddd DD MMM")}
          </span>
        ) : (
          <span className="text-red-400 text-xs">unknown</span>
        ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">Import Timetable</span>
          <span className="text-xs font-normal text-slate-400">
            CSV · Excel (.xlsx / .xls) · iSAMS export
          </span>
        </div>
      }
      open={open}
      onCancel={() => {
        reset();
        onClose();
      }}
      width={1050}
      footer={null}
      destroyOnHidden
    >
      {contextHolder}
      <div className="space-y-5 pt-3">
        <Steps
          current={step}
          size="small"
          items={[
            { title: "Upload File" },
            { title: "Preview & Match" },
            { title: "Import" },
          ]}
        />

        {/* ── Step 0 ── Upload ─────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium">
                  Upload any CSV or Excel file with timetable data.
                </p>
                <p className="text-xs text-slate-400">
                  iSAMS export columns are auto-mapped. Required columns:{" "}
                  <code className="bg-slate-100 px-1 rounded text-[11px]">
                    subject, class_name, teacher_name, room, day, start_time,
                    end_time
                  </code>
                </p>
              </div>
              <Button
                icon={<DownloadOutlined />}
                size="small"
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </div>

            <Upload.Dragger
              accept=".csv,.xlsx,.xls"
              multiple={false}
              beforeUpload={parseFile}
              showUploadList={false}
            >
              <p className="text-5xl" style={{ color: "#3b82f6" }}>
                <InboxOutlined />
              </p>
              <p className="font-semibold text-slate-700 mt-2 text-base">
                Drop your CSV or Excel file here, or click to browse
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports .csv · .xlsx · .xls — including iSAMS department
                timetable exports
              </p>
            </Upload.Dragger>

            {fileUploaded && rawRows.length > 0 && (
              <div className="space-y-4">
                <Alert
                  type="success"
                  showIcon
                  message={`${rawRows.length} slot rows parsed from file`}
                />

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Week Start Date{" "}
                    <span className="text-red-500">*</span>
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Pick the first day of the week being imported. Day names
                      (Monday, Tuesday…) are converted to real dates from this
                      point.
                    </span>
                  </label>
                  <DatePicker
                    value={weekStart}
                    onChange={setWeekStart}
                    className="w-full"
                    size="large"
                    placeholder="e.g. Sunday 13 Apr 2026 or Monday 13 Apr 2026"
                    format="dddd, D MMMM YYYY"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    disabled={!weekStart}
                    onClick={() => setStep(1)}
                    style={{ background: "var(--primary)" }}
                  >
                    Preview Rows →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1 ── Preview / Match ────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-3">
            {/* Summary bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-4 text-xs font-semibold">
                <span className="text-green-600">✓ {okCount} ready</span>
                {warnCount > 0 && (
                  <span className="text-amber-500">
                    ⚠ {warnCount} need manual match
                  </span>
                )}
                {resolvedRows.length - importableRows.length > 0 && (
                  <span className="text-slate-400">
                    {resolvedRows.length - importableRows.length} will be
                    skipped (missing class/date)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="small" onClick={() => setStep(0)}>
                  ← Back
                </Button>
                <Button
                  type="primary"
                  size="small"
                  disabled={importableRows.length === 0}
                  onClick={() => setStep(2)}
                  style={{ background: "var(--primary)" }}
                >
                  Import {importableRows.length} slots →
                </Button>
              </div>
            </div>

            {warnCount > 0 && (
              <Alert
                type="warning"
                showIcon
                message="Some rows have unmatched teachers or classes. Use the dropdowns to fix them, or proceed — unmatched teachers will be left blank."
              />
            )}

            <Table
              dataSource={resolvedRows}
              columns={columns}
              rowKey="_idx"
              size="small"
              scroll={{ x: 950, y: 360 }}
              pagination={{ pageSize: 25, size: "small", showSizeChanger: false }}
              rowClassName={(row: ResolvedRow) =>
                row.status === "warn" ? "!bg-amber-50" : ""
              }
            />
          </div>
        )}

        {/* ── Step 2 ── Import ──────────────────────────────────────────── */}
        {step === 2 && (
          <div className="py-6 space-y-5">
            {!importing && !results ? (
              <div className="text-center space-y-4">
                <div className="text-6xl">📋</div>
                <div>
                  <p className="text-lg font-semibold text-slate-700">
                    Ready to import{" "}
                    <strong>{importableRows.length}</strong> timetable slots
                  </p>
                  {warnCount > 0 && (
                    <p className="text-sm text-amber-600 mt-1">
                      {warnCount} rows have unmatched teachers — they will be
                      imported without a teacher assignment.
                    </p>
                  )}
                  {resolvedRows.length - importableRows.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      {resolvedRows.length - importableRows.length} rows skipped
                      (missing required class or date).
                    </p>
                  )}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setStep(1)}>← Review</Button>
                  <Button
                    type="primary"
                    onClick={handleImport}
                    style={{ background: "var(--primary)" }}
                  >
                    Start Import
                  </Button>
                </div>
              </div>
            ) : importing ? (
              <div className="text-center space-y-4">
                <p className="font-medium text-slate-600 text-base">
                  Importing slots…
                </p>
                <Progress
                  percent={progress}
                  status="active"
                  strokeColor={{ "0%": "var(--primary)", "100%": "#10b981" }}
                />
                <p className="text-xs text-slate-400">
                  Please wait. Do not close this window.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-6xl">
                  {results!.fail === 0 ? "✅" : "⚠️"}
                </div>
                <p className="text-lg font-semibold text-slate-700">
                  {results!.ok} slot{results!.ok !== 1 ? "s" : ""} imported
                  successfully
                  {results!.fail > 0 ? `, ${results!.fail} failed` : ""}
                </p>
                {results!.errors.length > 0 && (
                  <Alert
                    type="warning"
                    showIcon
                    message={`${results!.fail} rows failed to import`}
                    description={
                      <ul className="text-xs text-left list-disc pl-4 space-y-0.5 mt-1">
                        {results!.errors.slice(0, 5).map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                        {results!.errors.length > 5 && (
                          <li className="text-slate-400">
                            …and {results!.errors.length - 5} more
                          </li>
                        )}
                      </ul>
                    }
                  />
                )}
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                  <Button onClick={reset}>Import Another Week</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
