import dayjs, { Dayjs } from "dayjs";
import {
  ALL_CANONICAL_DAYS,
  DAYS_OF_WEEK,
  SchoolPeriod,
} from "@/lib/schoolPeriods";
import {
  Conflict,
  SlotLike,
  detectConflicts,
  hasHardConflict,
  hasSoftConflict,
} from "@/lib/timetableConflicts";

export type TimetableImportPattern = "default" | "A" | "B";
export type TimetableImportRepeatMode = "every_week" | "alternating";

export type TimetableImportIssue = {
  sourceLabel: string;
  message: string;
  severity: "error" | "warning";
};

export type TimetableImportRow = {
  sourceLabel: string;
  weekPattern: TimetableImportPattern;
  day: string;
  periodLabel: string;
  subject: string;
  teacher: string;
  year: string;
  className: string;
  room: string;
  zoomLink: string;
};

export type TimetableImportReferenceRow = {
  id: string | number;
  name?: string | null;
  code?: string | null;
  teacher_name?: string | null;
  class_name?: string | null;
};

export type ResolvedTimetableImportRow = TimetableImportRow & {
  dayValue: string;
  period: SchoolPeriod;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  yearId: string;
  yearName: string;
  classId: string;
  classNameResolved: string;
};

export type TimetableImportSlotPayload = {
  subject: string;
  subject_id: string;
  year_id: string;
  teacher_id: string;
  class_id: string;
  room: string;
  date: string;
  day: string;
  start_time: string;
  end_time: string;
  zoom_link?: string;
  school_id?: string | number;
};

export type ExpandedTimetableImportSlot = {
  sourceLabel: string;
  weekIndex: number;
  weekType: "A" | "B";
  date: string;
  day: string;
  periodLabel: string;
  payload: TimetableImportSlotPayload;
  conflicts: Conflict[];
  hasHardConflict: boolean;
  hasSoftConflict: boolean;
};

type WorkbookJsonRow = Record<string, unknown>;

const HEADER_ALIASES = {
  week: ["week", "pattern", "week pattern", "weekpattern", "cycle", "template"],
  day: ["day", "weekday", "dayofweek", "day of week"],
  period: ["period", "periodlabel", "period label", "slot", "time slot", "lesson"],
  subject: ["subject", "subjectname", "subject name", "course"],
  teacher: ["teacher", "teachername", "teacher name", "staff"],
  year: ["year", "yearname", "year name", "grade"],
  className: ["class", "classname", "class name", "form", "section"],
  room: ["room", "classroom", "location"],
  zoomLink: ["zoom", "zoomlink", "zoom link", "meeting", "meeting link", "link"],
} as const;

const splitDelimitedLine = (line: string): string[] => {
  if (line.includes("\t")) {
    return line.split("\t").map((value) => value.trim());
  }
  if (line.includes("|")) {
    return line.split("|").map((value) => value.trim());
  }
  if (line.includes(";")) {
    return line.split(";").map((value) => value.trim());
  }
  if (line.includes(",")) {
    return line.split(",").map((value) => value.trim());
  }
  return [line.trim()];
};

const splitGridCellLine = (line: string): string[] => {
  if (line.includes("|")) {
    return line.split("|").map((value) => value.trim());
  }
  if (line.includes(";")) {
    return line.split(";").map((value) => value.trim());
  }
  if (line.includes(",")) {
    return line.split(",").map((value) => value.trim());
  }
  return [line.trim()];
};

const normalizeLookupKey = (value: unknown) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const asNonEmptyString = (value: unknown) => String(value || "").trim();

const parseWeekPattern = (value: unknown): TimetableImportPattern | null => {
  const normalized = normalizeLookupKey(value);
  if (!normalized) return null;
  if (["week a", "a", "pattern a", "template a"].includes(normalized)) return "A";
  if (["week b", "b", "pattern b", "template b"].includes(normalized)) return "B";
  if (["default", "every week", "shared", "all weeks", "both"].includes(normalized)) {
    return "default";
  }
  return null;
};

const isDayLikeLabel = (value: string) => {
  const normalized = normalizeLookupKey(value);
  if (!normalized) return false;

  for (const day of ALL_CANONICAL_DAYS) {
    if (normalizeLookupKey(day) === normalized) return true;
    if (normalizeLookupKey(day.slice(0, 3)) === normalized) return true;
  }

  return false;
};

const isHeaderRow = (parts: string[]) => {
  const normalizedParts = parts.map(normalizeLookupKey);
  return (
    normalizedParts.includes("day") &&
    normalizedParts.includes("period") &&
    normalizedParts.includes("subject")
  );
};

const parseInlinePattern = (
  parts: string[],
  fallbackPattern: TimetableImportPattern
): { weekPattern: TimetableImportPattern; values: string[] } => {
  const parsedPattern = parseWeekPattern(parts[0]);
  if (!parsedPattern) {
    return { weekPattern: fallbackPattern, values: parts };
  }
  return { weekPattern: parsedPattern, values: parts.slice(1) };
};

const buildRow = (
  rawValues: string[],
  fallbackPattern: TimetableImportPattern,
  sourceLabel: string
): { row: TimetableImportRow | null; issue?: TimetableImportIssue } => {
  const { weekPattern, values } = parseInlinePattern(rawValues, fallbackPattern);
  if (values.length < 6) {
    return {
      row: null,
      issue: {
        sourceLabel,
        message:
          "Expected at least 6 columns: Day | Period | Subject | Teacher | Year | Class.",
        severity: "error",
      },
    };
  }

  const [day, periodLabel, subject, teacher, year, className, room = "", zoomLink = ""] = values;
  if (!day || !periodLabel || !subject || !teacher || !year || !className) {
    return {
      row: null,
      issue: {
        sourceLabel,
        message:
          "Day, Period, Subject, Teacher, Year, and Class are all required.",
        severity: "error",
      },
    };
  }

  return {
    row: {
      sourceLabel,
      weekPattern,
      day,
      periodLabel,
      subject,
      teacher,
      year,
      className,
      room,
      zoomLink,
    },
  };
};

const findHeaderKey = (
  keys: string[],
  aliases: readonly string[]
): string | null => {
  const aliasSet = new Set(aliases.map(normalizeLookupKey));
  return keys.find((key) => aliasSet.has(normalizeLookupKey(key))) ?? null;
};

const pushIssue = (
  issues: TimetableImportIssue[],
  sourceLabel: string,
  message: string,
  severity: TimetableImportIssue["severity"] = "error"
) => {
  issues.push({ sourceLabel, message, severity });
};

const buildLookup = (
  items: TimetableImportReferenceRow[],
  ...labelResolvers: Array<(item: TimetableImportReferenceRow) => unknown>
) => {
  const map = new Map<string, TimetableImportReferenceRow>();
  for (const item of items) {
    const allKeys = [item.id, ...labelResolvers.map((resolver) => resolver(item))]
      .map(normalizeLookupKey)
      .filter(Boolean);
    for (const key of allKeys) {
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
  }
  return map;
};

const resolveDayValue = (value: string, schoolDays: string[]): string | null => {
  const normalized = normalizeLookupKey(value);
  if (!normalized) return null;

  const activeDays = schoolDays.length > 0 ? schoolDays : [...ALL_CANONICAL_DAYS];
  const aliases = new Map<string, string>();
  for (const day of activeDays) {
    aliases.set(normalizeLookupKey(day), day);
    aliases.set(normalizeLookupKey(day.slice(0, 3)), day);
  }
  return aliases.get(normalized) ?? null;
};

const resolvePeriod = (value: string, periods: SchoolPeriod[]): SchoolPeriod | null => {
  const normalized = normalizeLookupKey(value);
  if (!normalized) return null;

  for (const period of periods) {
    const options = [
      period.id,
      period.label,
      `${period.startTime}-${period.endTime}`,
      `${period.startTime} - ${period.endTime}`,
    ].map(normalizeLookupKey);
    if (options.includes(normalized)) {
      return period;
    }
  }

  return null;
};

const resolveDayDate = (dayName: string, weekStartDate: Dayjs, firstDayIdx: number) => {
  const idx = DAYS_OF_WEEK.findIndex((day) => day.value === dayName);
  const offset = (idx - firstDayIdx + 7) % 7;
  return weekStartDate.add(offset, "day").format("YYYY-MM-DD");
};

export const parseTimetablePaste = (rawText: string) => {
  const issues: TimetableImportIssue[] = [];
  const rows: TimetableImportRow[] = [];
  const lines = String(rawText || "").split(/\r?\n/);
  let currentPattern: TimetableImportPattern = "default";

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    const sourceLabel = `Line ${index + 1}`;

    if (!line || line.startsWith("#") || line.startsWith("//")) continue;

    const sectionPattern = parseWeekPattern(line.replace(/[:\-]+$/, ""));
    if (sectionPattern) {
      currentPattern = sectionPattern;
      continue;
    }

    const parts = splitDelimitedLine(line).filter(Boolean);
    if (parts.length === 0) continue;
    if (isHeaderRow(parts)) continue;

    const { row, issue } = buildRow(parts, currentPattern, sourceLabel);
    if (issue) {
      issues.push(issue);
      continue;
    }
    if (row) rows.push(row);
  }

  if (rows.length === 0) {
    pushIssue(issues, "Paste", "Paste at least one valid timetable row.");
  }

  return { rows, issues };
};

export const parseTimetableGridPaste = (rawText: string) => {
  const issues: TimetableImportIssue[] = [];
  const rows: TimetableImportRow[] = [];
  const sourceText = String(rawText || "");

  if (!sourceText.includes("\t")) {
    pushIssue(
      issues,
      "Grid Paste",
      "Grid paste expects a tab-separated timetable copied from Excel or Google Sheets."
    );
    return { rows, issues };
  }

  const lines = sourceText.split(/\r?\n/);
  let currentPattern: TimetableImportPattern = "default";
  let headerDays: string[] | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();
    const sourceLabel = `Line ${index + 1}`;

    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;

    const sectionPattern = parseWeekPattern(trimmed.replace(/[:\-]+$/, ""));
    if (sectionPattern) {
      currentPattern = sectionPattern;
      headerDays = null;
      continue;
    }

    if (!rawLine.includes("\t")) {
      pushIssue(
        issues,
        sourceLabel,
        "Grid rows must stay in spreadsheet format with day columns separated by tabs."
      );
      continue;
    }

    const cells = rawLine.split("\t").map((value) => value.trim());
    const candidateDays = cells.slice(1).filter(Boolean);
    const firstCell = normalizeLookupKey(cells[0]);
    const looksLikeHeader =
      candidateDays.length > 0 &&
      candidateDays.every(isDayLikeLabel) &&
      (!firstCell || ["period", "slot", "lesson", "time", "time slot"].includes(firstCell));

    if (looksLikeHeader) {
      headerDays = candidateDays;
      continue;
    }

    if (!headerDays || headerDays.length === 0) {
      pushIssue(
        issues,
        sourceLabel,
        "Add a header row like `Period<Tab>Monday<Tab>Tuesday...` before pasting grid rows."
      );
      continue;
    }

    const periodLabel = cells[0];
    if (!periodLabel) {
      pushIssue(issues, sourceLabel, "The first column of each grid row must contain the period label.");
      continue;
    }

    headerDays.forEach((day, dayIndex) => {
      const cellContent = String(cells[dayIndex + 1] || "").trim();
      if (!cellContent || /^[-–—]$/.test(cellContent)) return;

      const parts = splitGridCellLine(cellContent).filter(Boolean);
      if (parts.length < 4) {
        pushIssue(
          issues,
          `${sourceLabel} / ${day}`,
          "Each filled grid cell needs at least Subject | Teacher | Year | Class."
        );
        return;
      }

      const [subject, teacher, year, className, room = "", zoomLink = ""] = parts;
      rows.push({
        sourceLabel: `${sourceLabel} / ${day}`,
        weekPattern: currentPattern,
        day,
        periodLabel,
        subject,
        teacher,
        year,
        className,
        room,
        zoomLink,
      });
    });
  }

  if (rows.length === 0) {
    pushIssue(issues, "Grid Paste", "Paste at least one filled timetable cell in the grid.");
  }

  return { rows, issues };
};

export const parseTimetableWorkbook = async (file: File) => {
  const issues: TimetableImportIssue[] = [];
  const rows: TimetableImportRow[] = [];
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const records = XLSX.utils.sheet_to_json<WorkbookJsonRow>(sheet, {
      defval: "",
      raw: false,
    });

    if (!records.length) continue;

    const keys = Object.keys(records[0] || {});
    const weekKey = findHeaderKey(keys, HEADER_ALIASES.week);
    const dayKey = findHeaderKey(keys, HEADER_ALIASES.day);
    const periodKey = findHeaderKey(keys, HEADER_ALIASES.period);
    const subjectKey = findHeaderKey(keys, HEADER_ALIASES.subject);
    const teacherKey = findHeaderKey(keys, HEADER_ALIASES.teacher);
    const yearKey = findHeaderKey(keys, HEADER_ALIASES.year);
    const classKey = findHeaderKey(keys, HEADER_ALIASES.className);
    const roomKey = findHeaderKey(keys, HEADER_ALIASES.room);
    const zoomKey = findHeaderKey(keys, HEADER_ALIASES.zoomLink);

    if (!dayKey || !periodKey || !subjectKey || !teacherKey || !yearKey || !classKey) {
      pushIssue(
        issues,
        sheetName,
        "Workbook sheet must contain Day, Period, Subject, Teacher, Year, and Class columns."
      );
      continue;
    }

    const sheetPattern = parseWeekPattern(sheetName);
    records.forEach((record, recordIndex) => {
      const sourceLabel = `${sheetName}:${recordIndex + 2}`;
      const weekPattern =
        parseWeekPattern(weekKey ? record[weekKey] : null) ?? sheetPattern ?? "default";

      const { row, issue } = buildRow(
        [
          asNonEmptyString(record[dayKey]),
          asNonEmptyString(record[periodKey]),
          asNonEmptyString(record[subjectKey]),
          asNonEmptyString(record[teacherKey]),
          asNonEmptyString(record[yearKey]),
          asNonEmptyString(record[classKey]),
          roomKey ? asNonEmptyString(record[roomKey]) : "",
          zoomKey ? asNonEmptyString(record[zoomKey]) : "",
        ],
        weekPattern,
        sourceLabel
      );

      if (issue) {
        issues.push(issue);
        return;
      }
      if (row) rows.push(row);
    });
  }

  if (rows.length === 0) {
    pushIssue(issues, file.name || "Workbook", "No valid timetable rows were found in the uploaded file.");
  }

  return { rows, issues };
};

export const resolveTimetableImportRows = ({
  rows,
  periods,
  schoolDays,
  subjects,
  teachers,
  years,
  classes,
}: {
  rows: TimetableImportRow[];
  periods: SchoolPeriod[];
  schoolDays: string[];
  subjects: TimetableImportReferenceRow[];
  teachers: TimetableImportReferenceRow[];
  years: TimetableImportReferenceRow[];
  classes: TimetableImportReferenceRow[];
}) => {
  const issues: TimetableImportIssue[] = [];
  const resolvedRows: ResolvedTimetableImportRow[] = [];

  const subjectLookup = buildLookup(subjects, (item) => item.name, (item) => item.code);
  const teacherLookup = buildLookup(teachers, (item) => item.teacher_name, (item) => item.name);
  const yearLookup = buildLookup(years, (item) => item.name);
  const classLookup = buildLookup(classes, (item) => item.class_name, (item) => item.name);

  for (const row of rows) {
    const dayValue = resolveDayValue(row.day, schoolDays);
    const period = resolvePeriod(row.periodLabel, periods);
    const subject = subjectLookup.get(normalizeLookupKey(row.subject));
    const teacher = teacherLookup.get(normalizeLookupKey(row.teacher));
    const year = yearLookup.get(normalizeLookupKey(row.year));
    const classRow = classLookup.get(normalizeLookupKey(row.className));

    if (!dayValue) {
      pushIssue(issues, row.sourceLabel, `Unknown day "${row.day}".`);
      continue;
    }
    if (!period) {
      pushIssue(issues, row.sourceLabel, `Unknown period "${row.periodLabel}".`);
      continue;
    }
    if (!subject) {
      pushIssue(issues, row.sourceLabel, `Unknown subject "${row.subject}".`);
      continue;
    }
    if (!teacher) {
      pushIssue(issues, row.sourceLabel, `Unknown teacher "${row.teacher}".`);
      continue;
    }
    if (!year) {
      pushIssue(issues, row.sourceLabel, `Unknown year "${row.year}".`);
      continue;
    }
    if (!classRow) {
      pushIssue(issues, row.sourceLabel, `Unknown class "${row.className}".`);
      continue;
    }

    resolvedRows.push({
      ...row,
      dayValue,
      period,
      subjectId: String(subject.id),
      subjectName: asNonEmptyString(subject.name) || asNonEmptyString(row.subject),
      teacherId: String(teacher.id),
      teacherName:
        asNonEmptyString(teacher.teacher_name) ||
        asNonEmptyString(teacher.name) ||
        asNonEmptyString(row.teacher),
      yearId: String(year.id),
      yearName: asNonEmptyString(year.name) || asNonEmptyString(row.year),
      classId: String(classRow.id),
      classNameResolved:
        asNonEmptyString(classRow.class_name) ||
        asNonEmptyString(classRow.name) ||
        asNonEmptyString(row.className),
    });
  }

  return { resolvedRows, issues };
};

const buildWeekStarts = (startWeek: Dayjs, endWeek: Dayjs) => {
  const weeks: Dayjs[] = [];
  let cursor = startWeek.startOf("day");
  const limit = endWeek.startOf("day");

  while (cursor.isBefore(limit) || cursor.isSame(limit, "day")) {
    weeks.push(cursor);
    cursor = cursor.add(7, "day");
    if (weeks.length > 104) break;
  }

  return weeks;
};

export const expandTimetableImportRows = ({
  rows,
  repeatMode,
  startWeek,
  endWeek,
  firstDayIdx,
  existingSlots,
  schoolId,
}: {
  rows: ResolvedTimetableImportRow[];
  repeatMode: TimetableImportRepeatMode;
  startWeek: Dayjs;
  endWeek: Dayjs;
  firstDayIdx: number;
  existingSlots: Array<{ id?: number | string; date?: string; day?: string; start_time: string; end_time: string; teacher_id?: number | null; class_id?: number | null; room?: string | null }>;
  schoolId?: string | number;
}) => {
  const issues: TimetableImportIssue[] = [];
  if (endWeek.isBefore(startWeek, "day")) {
    pushIssue(issues, "Range", "End week must be on or after the start week.");
    return { slots: [], issues };
  }

  const weekStarts = buildWeekStarts(startWeek, endWeek);
  const slots: ExpandedTimetableImportSlot[] = [];
  const existingByDate = new Map<string, SlotLike[]>();
  const importedByDate = new Map<string, SlotLike[]>();
  const repeatModeWarnings = new Set<string>();

  for (const slot of existingSlots) {
    if (!slot.date) continue;
    const peers = existingByDate.get(slot.date) ?? [];
    peers.push({
      id: slot.id,
      day_of_week: String(slot.day || ""),
      start_time: slot.start_time,
      end_time: slot.end_time,
      teacher_id: slot.teacher_id ?? null,
      class_id: slot.class_id ?? null,
      room: slot.room ?? null,
    });
    existingByDate.set(slot.date, peers);
  }

  for (let weekIndex = 0; weekIndex < weekStarts.length; weekIndex += 1) {
    const weekStartDate = weekStarts[weekIndex];
    const weekType: "A" | "B" = weekIndex % 2 === 0 ? "A" : "B";

    for (const row of rows) {
      if (repeatMode === "every_week" && row.weekPattern !== "default") {
        const warningKey = `${row.sourceLabel}|${row.weekPattern}`;
        if (!repeatModeWarnings.has(warningKey)) {
          repeatModeWarnings.add(warningKey);
          pushIssue(
            issues,
            row.sourceLabel,
            `Week pattern ${row.weekPattern} requires alternating mode, or change it to Every Week.`,
            "warning"
          );
        }
      }

      const shouldInclude =
        repeatMode === "every_week"
          ? row.weekPattern === "default"
          : row.weekPattern === "default" || row.weekPattern === weekType;
      if (!shouldInclude) continue;

      const date = resolveDayDate(row.dayValue, weekStartDate, firstDayIdx);
      const payload: TimetableImportSlotPayload = {
        subject: row.subjectName,
        subject_id: row.subjectId,
        teacher_id: row.teacherId,
        year_id: row.yearId,
        class_id: row.classId,
        room: row.room,
        zoom_link: row.zoomLink || undefined,
        date,
        day: row.dayValue,
        start_time: row.period.startTime,
        end_time: row.period.endTime,
        school_id: schoolId,
      };

      const candidate: SlotLike = {
        day_of_week: row.dayValue,
        start_time: row.period.startTime,
        end_time: row.period.endTime,
        teacher_id: Number(row.teacherId) || null,
        class_id: Number(row.classId) || null,
        room: row.room || null,
        subject_id: Number(row.subjectId) || null,
      };
      const peers = [
        ...(existingByDate.get(date) ?? []),
        ...(importedByDate.get(date) ?? []),
      ];
      const conflicts = detectConflicts(peers, candidate);
      const importedPeers = importedByDate.get(date) ?? [];
      importedPeers.push(candidate);
      importedByDate.set(date, importedPeers);

      slots.push({
        sourceLabel: row.sourceLabel,
        weekIndex,
        weekType,
        date,
        day: row.dayValue,
        periodLabel: row.period.label,
        payload,
        conflicts,
        hasHardConflict: hasHardConflict(conflicts),
        hasSoftConflict: hasSoftConflict(conflicts),
      });
    }
  }

  return { slots, issues };
};