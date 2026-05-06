"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import {
  Alert,
  Button,
  DatePicker,
  Input,
  Modal,
  Radio,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { addTimetableSlot, deleteTimetableSlot } from "@/services/timetableApi";
import type { SchoolPeriod } from "@/lib/schoolPeriods";
import {
  ExpandedTimetableImportSlot,
  TimetableImportIssue,
  parseTimetableGridPaste,
  TimetableImportReferenceRow,
  TimetableImportRepeatMode,
  expandTimetableImportRows,
  parseTimetablePaste,
  parseTimetableWorkbook,
  resolveTimetableImportRows,
} from "@/lib/timetableImport";

const { TextArea } = Input;

type TimetableImportModalProps = {
  open: boolean;
  onClose: () => void;
  initialWeek: Dayjs;
  firstDayIdx: number;
  schoolId?: string | number;
  periods: SchoolPeriod[];
  schoolDays: string[];
  subjects: TimetableImportReferenceRow[];
  teachers: TimetableImportReferenceRow[];
  years: TimetableImportReferenceRow[];
  classes: TimetableImportReferenceRow[];
  existingSlots: Array<{
    id?: number | string;
    date?: string;
    day?: string;
    start_time: string;
    end_time: string;
    teacher_id?: number | null;
    class_id?: number | null;
    room?: string | null;
  }>;
  onApplied?: () => Promise<void> | void;
};

type PreviewState = {
  issues: TimetableImportIssue[];
  expandedSlots: ExpandedTimetableImportSlot[];
  resolvedCount: number;
  replaceSlotCount: number;
};

type TimetableImportSaveMode = "merge" | "replace";
type TimetablePasteMode = "rows" | "grid";

const EXAMPLE_ROW_TEXT = `# Every Week rows work in both modes
Monday | P1 | Mathematics | Jane Smith | Year 5 | 5A | Room 201
Monday | P2 | Science | Jane Smith | Year 5 | 5A | Lab 1

Week A
Tuesday | P3 | Arabic | Ahmed Ali | Year 5 | 5A | Room 203

Week B
Tuesday | P3 | Islamic | Fatima Noor | Year 5 | 5A | Room 203`;

const EXAMPLE_GRID_TEXT = `Period	Monday	Tuesday	Wednesday	Thursday
P1	Mathematics | Jane Smith | Year 5 | 5A | Room 201	Science | Jane Smith | Year 5 | 5A | Lab 1		
P2	English | Omar Khan | Year 5 | 5A | Room 204		History | Mariam Noor | Year 5 | 5A | Room 205	

Week A
Period	Monday	Tuesday	Wednesday	Thursday
P3		Arabic | Ahmed Ali | Year 5 | 5A | Room 203		

Week B
Period	Monday	Tuesday	Wednesday	Thursday
P3		Islamic | Fatima Noor | Year 5 | 5A | Room 203		`;

const SAMPLE_WORKBOOK_HREF = "/templates/timetable-import-sample.xlsx";

const issueColor = (severity: TimetableImportIssue["severity"]) =>
  severity === "error" ? "error" : "warning";

export default function TimetableImportModal({
  open,
  onClose,
  initialWeek,
  firstDayIdx,
  schoolId,
  periods,
  schoolDays,
  subjects,
  teachers,
  years,
  classes,
  existingSlots,
  onApplied,
}: TimetableImportModalProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [pasteMode, setPasteMode] = useState<TimetablePasteMode>("rows");
  const [repeatMode, setRepeatMode] = useState<TimetableImportRepeatMode>("every_week");
  const [saveMode, setSaveMode] = useState<TimetableImportSaveMode>("merge");
  const [pasteText, setPasteText] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [startWeek, setStartWeek] = useState<Dayjs>(initialWeek);
  const [endWeek, setEndWeek] = useState<Dayjs>(initialWeek);
  const [previewing, setPreviewing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    if (!open) return;
    setInputMode("paste");
    setPasteMode("rows");
    setRepeatMode("every_week");
    setSaveMode("merge");
    setPasteText("");
    setFileList([]);
    setStartWeek(initialWeek);
    setEndWeek(initialWeek);
    setPreview(null);
  }, [initialWeek, open]);

  const uploadedFile = fileList[0]?.originFileObj as File | undefined;
  const snapToWeekStart = (value: Dayjs) => {
    const diff = (value.day() - firstDayIdx + 7) % 7;
    return value.subtract(diff, "day");
  };
  const rangeStart = useMemo(() => startWeek.format("YYYY-MM-DD"), [startWeek]);
  const rangeEnd = useMemo(() => endWeek.add(6, "day").format("YYYY-MM-DD"), [endWeek]);

  const slotsInTargetRange = useMemo(
    () =>
      existingSlots.filter(
        (slot) => !!slot.date && String(slot.date) >= rangeStart && String(slot.date) <= rangeEnd
      ),
    [existingSlots, rangeEnd, rangeStart]
  );

  const teacherNameById = useMemo(() => {
    const map = new Map<string, string>();
    teachers.forEach((teacher) => {
      map.set(
        String(teacher.id),
        String(teacher.teacher_name || teacher.name || teacher.id)
      );
    });
    return map;
  }, [teachers]);

  const classNameById = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach((classRow) => {
      map.set(
        String(classRow.id),
        String(classRow.class_name || classRow.name || classRow.id)
      );
    });
    return map;
  }, [classes]);

  const previewSummary = useMemo(() => {
    if (!preview) {
      return {
        errorCount: 0,
        warningCount: 0,
        hardConflictCount: 0,
        softConflictCount: 0,
      };
    }

    return {
      errorCount: preview.issues.filter((issue) => issue.severity === "error").length,
      warningCount: preview.issues.filter((issue) => issue.severity === "warning").length,
      hardConflictCount: preview.expandedSlots.filter((slot) => slot.hasHardConflict).length,
      softConflictCount: preview.expandedSlots.filter((slot) => slot.hasSoftConflict).length,
    };
  }, [preview]);

  const canApply =
    !!preview &&
    preview.expandedSlots.length > 0 &&
    previewSummary.errorCount === 0 &&
    previewSummary.hardConflictCount === 0;
  const exampleText = pasteMode === "grid" ? EXAMPLE_GRID_TEXT : EXAMPLE_ROW_TEXT;
  const pastePlaceholder =
    pasteMode === "grid"
      ? "Period\tMonday\tTuesday\nP1\tMathematics | Jane Smith | Year 5 | 5A\tScience | Jane Smith | Year 5 | 5A"
      : "Monday | P1 | Mathematics | Jane Smith | Year 5 | 5A | Room 201";

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const parsed =
        inputMode === "paste"
          ? pasteMode === "grid"
            ? parseTimetableGridPaste(pasteText)
            : parseTimetablePaste(pasteText)
          : uploadedFile
          ? await parseTimetableWorkbook(uploadedFile)
          : { rows: [], issues: [{ sourceLabel: "Upload", message: "Choose an Excel or CSV file first.", severity: "error" as const }] };

      const resolved = resolveTimetableImportRows({
        rows: parsed.rows,
        periods,
        schoolDays,
        subjects,
        teachers,
        years,
        classes,
      });

      const expanded = expandTimetableImportRows({
        rows: resolved.resolvedRows,
        repeatMode,
        startWeek,
        endWeek,
        firstDayIdx,
        existingSlots:
          saveMode === "replace"
            ? existingSlots.filter(
                (slot) =>
                  !slot.date ||
                  String(slot.date) < rangeStart ||
                  String(slot.date) > rangeEnd
              )
            : existingSlots,
        schoolId,
      });

      const issues = [...parsed.issues, ...resolved.issues, ...expanded.issues];
      setPreview({
        issues,
        expandedSlots: expanded.slots,
        resolvedCount: resolved.resolvedRows.length,
        replaceSlotCount: saveMode === "replace" ? slotsInTargetRange.length : 0,
      });

      if (issues.some((issue) => issue.severity === "error")) {
        messageApi.warning("Preview generated with blocking issues. Fix them before applying.");
      } else {
        messageApi.success(`Preview ready: ${expanded.slots.length} slot${expanded.slots.length === 1 ? "" : "s"}.`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not build the timetable preview.";
      messageApi.error(errorMessage);
      setPreview({
        issues: [{ sourceLabel: "Import", message: errorMessage, severity: "error" }],
        expandedSlots: [],
        resolvedCount: 0,
      });
    } finally {
      setPreviewing(false);
    }
  };

  const handleApply = async () => {
    if (!preview || !canApply) return;

    setApplying(true);
    let deleted = 0;
    let deleteFailed = 0;
    let created = 0;
    let failed = 0;

    try {
      if (saveMode === "replace") {
        for (const slot of slotsInTargetRange) {
          if (!slot.id) continue;
          try {
            await deleteTimetableSlot(String(slot.id));
            deleted += 1;
          } catch {
            deleteFailed += 1;
          }
        }

        if (deleteFailed > 0) {
          await onApplied?.();
          messageApi.error(
            `Could not clear ${deleteFailed} existing slot${deleteFailed === 1 ? "" : "s"}. Import stopped to avoid duplicates.`
          );
          return;
        }
      }

      for (const slot of preview.expandedSlots) {
        try {
          await addTimetableSlot(slot.payload as any, "all");
          created += 1;
        } catch {
          failed += 1;
        }
      }

      await onApplied?.();
      if (failed === 0 && saveMode === "replace") {
        messageApi.success(
          `Replaced ${deleted} slot${deleted === 1 ? "" : "s"} and imported ${created} slot${created === 1 ? "" : "s"}.`
        );
      } else if (failed === 0) {
        messageApi.success(`Imported ${created} slot${created === 1 ? "" : "s"}.`);
      } else if (saveMode === "replace") {
        messageApi.warning(
          `Cleared ${deleted} slot${deleted === 1 ? "" : "s"} and imported ${created} slot${created === 1 ? "" : "s"}; ${failed} failed.`
        );
      } else {
        messageApi.warning(`Imported ${created} slot${created === 1 ? "" : "s"}; ${failed} failed.`);
      }
      onClose();
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Import Timetable"
        open={open}
        onCancel={() => {
          if (applying) return;
          onClose();
        }}
        width={1100}
        footer={[
          <Button key="cancel" onClick={onClose} disabled={applying}>
            Cancel
          </Button>,
          <Button key="preview" onClick={() => void handlePreview()} loading={previewing}>
            Preview Import
          </Button>,
          <Button key="apply" type="primary" onClick={() => void handleApply()} loading={applying} disabled={!canApply}>
            Apply Import
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <Alert
            type="info"
            showIcon
            message="Import one repeating timetable or an alternating Week A / Week B timetable."
            description="Paste rows or upload Excel/CSV. The importer expands your weekly pattern into real timetable dates using the current slot API."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Input Mode</div>
                <Radio.Group
                  value={inputMode}
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(event) => {
                    setInputMode(event.target.value);
                    setPreview(null);
                  }}
                  options={[
                    { label: "Paste Format", value: "paste" },
                    { label: "Excel / CSV", value: "upload" },
                  ]}
                />
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Repeat Mode</div>
                <Radio.Group
                  value={repeatMode}
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(event) => {
                    setRepeatMode(event.target.value);
                    setPreview(null);
                  }}
                  options={[
                    { label: "Same Every Week", value: "every_week" },
                    { label: "Week A / Week B", value: "alternating" },
                  ]}
                />
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Save Mode</div>
                <Radio.Group
                  value={saveMode}
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(event) => {
                    setSaveMode(event.target.value);
                    setPreview(null);
                  }}
                  options={[
                    { label: "Merge With Existing", value: "merge" },
                    { label: "Replace Target Weeks", value: "replace" },
                  ]}
                />
                {saveMode === "replace" && (
                  <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    This will delete <strong>{slotsInTargetRange.length}</strong> existing slot{slotsInTargetRange.length === 1 ? "" : "s"} inside the selected weeks before importing the new timetable.
                  </div>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Start Week</div>
                  <DatePicker value={startWeek} onChange={(value) => {
                    if (!value) return;
                    setStartWeek(snapToWeekStart(value));
                    setPreview(null);
                  }} format="DD MMM YYYY" className="w-full" />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">End Week</div>
                  <DatePicker value={endWeek} onChange={(value) => {
                    if (!value) return;
                    setEndWeek(snapToWeekStart(value));
                    setPreview(null);
                  }} format="DD MMM YYYY" className="w-full" />
                </div>
              </div>

              {inputMode === "paste" ? (
                <div>
                  <div className="mb-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Paste Style</div>
                    <Radio.Group
                      value={pasteMode}
                      optionType="button"
                      buttonStyle="solid"
                      onChange={(event) => {
                        setPasteMode(event.target.value);
                        setPasteText("");
                        setPreview(null);
                      }}
                      options={[
                        { label: "Row Paste", value: "rows" },
                        { label: "Grid Paste", value: "grid" },
                      ]}
                    />
                  </div>
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Paste Format</span>
                    <Button
                      size="small"
                      type="link"
                      className="!h-auto !px-0 !text-xs"
                      onClick={() => {
                        setPasteText(exampleText);
                        setPreview(null);
                      }}
                    >
                      Use sample text
                    </Button>
                  </div>
                  {pasteMode === "grid" && (
                    <div className="mb-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                      Grid mode expects a tab-separated timetable copied from Excel or Google Sheets. The top row should be days, the first column should be periods, and each filled cell should be `Subject | Teacher | Year | Class | Room | Zoom`.
                    </div>
                  )}
                  <TextArea
                    rows={12}
                    value={pasteText}
                    onChange={(event) => {
                      setPasteText(event.target.value);
                      setPreview(null);
                    }}
                    placeholder={pastePlaceholder}
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Upload Workbook</span>
                    <Button
                      size="small"
                      icon={<DownloadOutlined />}
                      href={SAMPLE_WORKBOOK_HREF}
                    >
                      Sample workbook
                    </Button>
                  </div>
                  <Upload.Dragger
                    accept=".xlsx,.xls,.csv"
                    multiple={false}
                    beforeUpload={(file) => {
                      setFileList([
                        {
                          uid: file.uid,
                          name: file.name,
                          status: "done",
                          originFileObj: file,
                        },
                      ]);
                      setPreview(null);
                      return false;
                    }}
                    onRemove={() => {
                      setFileList([]);
                      setPreview(null);
                    }}
                    fileList={fileList}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drop an Excel or CSV file here</p>
                    <p className="ant-upload-hint">Supported columns: Day, Period, Subject, Teacher, Year, Class, optional Room, Zoom, and Week. Download the sample workbook if you want the exact layout.</p>
                  </Upload.Dragger>
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-[#111827] p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-100">Import Guide</div>
                <Button size="small" icon={<DownloadOutlined />} href={SAMPLE_WORKBOOK_HREF}>
                  Download sample workbook
                </Button>
              </div>
              <div className="grid gap-2 rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-xs text-slate-200 md:grid-cols-2">
                <div>
                  <div className="mb-1 font-semibold text-slate-100">Required values</div>
                  <div>Day, Period, Subject, Teacher, Year, Class</div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-100">Optional values</div>
                  <div>Room, Zoom, and Week</div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-100">Same Every Week</div>
                  <div>Use plain rows or the “Every Week” sheet in the sample workbook.</div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-100">Week A / Week B</div>
                  <div>Use Week A and Week B section labels in paste, or Week A and Week B workbook sheets, or a Week column with A / B values.</div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-100">Grid paste</div>
                  <div>Paste a spreadsheet-style table with days across the top and periods down the first column.</div>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-slate-100">Grid cell format</div>
                  <div>Each filled grid cell should be `Subject | Teacher | Year | Class`, with optional Room and Zoom after that.</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-100">{pasteMode === "grid" ? "Grid Paste Example" : "Row Paste Example"}</div>
              <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                {exampleText}
              </pre>
              <div className="space-y-1 text-xs text-slate-300">
                <div>Row mode separators: pipe, tab, semicolon, or comma. Grid mode uses tabs between columns and pipes inside each filled cell.</div>
                <div>Workbook columns: Day, Period, Subject, Teacher, Year, Class, optional Room, Zoom, Week.</div>
                <div>Periods must match your configured timetable periods such as P1, P2, Break, or a matching time range.</div>
                <div>Uploaded rows are previewed and checked for unknown names plus timetable conflicts before anything is saved.</div>
              </div>
            </div>
          </div>

          {preview && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag color="blue">Resolved rows {preview.resolvedCount}</Tag>
                <Tag color="cyan">Expanded slots {preview.expandedSlots.length}</Tag>
                {preview.replaceSlotCount > 0 && <Tag color="orange">Will replace {preview.replaceSlotCount}</Tag>}
                <Tag color={previewSummary.errorCount > 0 ? "error" : "default"}>Errors {previewSummary.errorCount}</Tag>
                <Tag color={previewSummary.warningCount > 0 ? "warning" : "default"}>Warnings {previewSummary.warningCount}</Tag>
                <Tag color={previewSummary.hardConflictCount > 0 ? "error" : "default"}>Hard conflicts {previewSummary.hardConflictCount}</Tag>
                <Tag color={previewSummary.softConflictCount > 0 ? "warning" : "default"}>Soft conflicts {previewSummary.softConflictCount}</Tag>
              </div>

              {preview.replaceSlotCount > 0 && (
                <Alert
                  type="warning"
                  showIcon
                  message={`Applying this import will remove ${preview.replaceSlotCount} existing slot${preview.replaceSlotCount === 1 ? "" : "s"} from the selected weeks first.`}
                />
              )}

              {previewSummary.errorCount > 0 && (
                <Alert type="error" showIcon message="Fix the blocking issues before applying this import." />
              )}
              {previewSummary.errorCount === 0 && previewSummary.hardConflictCount > 0 && (
                <Alert type="error" showIcon message="Hard conflicts were found. Remove or change those rows before applying." />
              )}
              {previewSummary.errorCount === 0 && previewSummary.hardConflictCount === 0 && previewSummary.softConflictCount > 0 && (
                <Alert type="warning" showIcon message="Only soft conflicts remain. You can still apply the import." />
              )}

              {preview.issues.length > 0 && (
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {preview.issues.map((issue, index) => (
                    <Tag key={`${issue.sourceLabel}-${issue.message}-${index}`} color={issueColor(issue.severity)} className="mb-1 mr-1 whitespace-normal">
                      {issue.sourceLabel}: {issue.message}
                    </Tag>
                  ))}
                </div>
              )}

              <Table
                size="small"
                rowKey={(row) => `${row.sourceLabel}-${row.date}-${row.periodLabel}`}
                pagination={{ pageSize: 8, hideOnSinglePage: true }}
                dataSource={preview.expandedSlots}
                columns={[
                  { title: "Source", dataIndex: "sourceLabel", width: 120 },
                  { title: "Week", render: (_, row) => <Tag color={row.weekType === "A" ? "blue" : "purple"}>{row.weekType}</Tag>, width: 80 },
                  { title: "Date", dataIndex: "date", width: 110 },
                  { title: "Day", dataIndex: "day", width: 100 },
                  { title: "Period", dataIndex: "periodLabel", width: 90 },
                  { title: "Subject", render: (_, row) => row.payload.subject, ellipsis: true },
                  { title: "Teacher", render: (_, row) => teacherNameById.get(String(row.payload.teacher_id)) || row.payload.teacher_id, width: 140, ellipsis: true },
                  { title: "Class", render: (_, row) => classNameById.get(String(row.payload.class_id)) || row.payload.class_id, width: 120, ellipsis: true },
                  {
                    title: "Conflicts",
                    render: (_, row) =>
                      row.hasHardConflict ? (
                        <Tag color="error">Hard</Tag>
                      ) : row.hasSoftConflict ? (
                        <Tag color="warning">Soft</Tag>
                      ) : (
                        <Tag color="success">None</Tag>
                      ),
                    width: 100,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}