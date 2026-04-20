// src/lib/timetableExport.ts
// Client-side only — call from event handlers, not SSR
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/** Convert a date string to the Monday of its week. */
function getMondayOf(dateStr: string): string {
  const d = dayjs(dateStr);
  const day = d.day(); // 0=Sun, 1=Mon…
  const diff = day === 0 ? -6 : 1 - day;
  return d.add(diff, "day").format("YYYY-MM-DD");
}

export interface ExportEvent {
  subject: string;
  date: string;
  startTime: string; // "HH:mm"
  endTime: string;
  teacher: string;
  room: string;
  className?: string; // resolved class name
}

/**
 * Export timetable events to an iSAMS-style Excel workbook.
 * Generates one grid sheet per week + a flat "All Slots" sheet.
 */
export function exportTimetableToExcel(
  events: ExportEvent[],
  label = "Timetable"
) {
  const wb = XLSX.utils.book_new();

  if (events.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([["No events to export"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, `${label}_empty.xlsx`);
    return;
  }

  // ── Group events by ISO-week (keyed by Monday date) ──────────────────────
  const weeks = new Map<string, ExportEvent[]>();
  for (const ev of events) {
    if (!ev.date) continue;
    const monday = getMondayOf(ev.date);
    if (!weeks.has(monday)) weeks.set(monday, []);
    weeks.get(monday)!.push(ev);
  }

  const sortedMondays = [...weeks.keys()].sort();

  for (const monday of sortedMondays) {
    const weekEvents = weeks.get(monday)!;

    // Map "date|startTime" → events[]
    const slotMap = new Map<string, ExportEvent[]>();
    for (const ev of weekEvents) {
      const key = `${ev.date}|${ev.startTime.substring(0, 5)}`;
      if (!slotMap.has(key)) slotMap.set(key, []);
      slotMap.get(key)!.push(ev);
    }

    // Collect unique period start times for rows
    const periodTimes = [
      ...new Set(weekEvents.map((e) => e.startTime.substring(0, 5))),
    ].sort();

    // Day-column dates
    const dayDates: Record<string, string> = {};
    WEEK_DAYS.forEach((d, i) => {
      dayDates[d] = dayjs(monday).add(i, "day").format("YYYY-MM-DD");
    });

    // Header row
    const headerRow = [
      "Period",
      ...WEEK_DAYS.map(
        (d, i) => `${d}\n${dayjs(monday).add(i, "day").format("DD/MM/YYYY")}`
      ),
    ];

    // Data rows (one per period time)
    const dataRows = periodTimes.map((time) => {
      const row: any[] = [time];
      for (const day of WEEK_DAYS) {
        const key = `${dayDates[day]}|${time}`;
        const slots = slotMap.get(key) || [];
        if (slots.length === 0) {
          row.push("");
        } else {
          row.push(
            slots
              .map((s) =>
                [s.subject, s.className || "", s.teacher, s.room]
                  .filter(Boolean)
                  .join("\n")
              )
              .join("\n\n")
          );
        }
      }
      return row;
    });

    const wsData = [headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 10 }, ...WEEK_DAYS.map(() => ({ wch: 26 }))];

    // Wrap text
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!ws[addr]) ws[addr] = { t: "z" };
        ws[addr].s = { alignment: { wrapText: true, vertical: "top" } };
      }
    }

    // Sheet name: "Week 14-04" (max 31 chars)
    const sheetName = `Week ${dayjs(monday).format("DD-MM")}`.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // ── Flat "All Slots" sheet ────────────────────────────────────────────────
  const flatRows = events
    .slice()
    .sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      return d !== 0 ? d : a.startTime.localeCompare(b.startTime);
    })
    .map((ev) => ({
      Subject: ev.subject,
      Date: ev.date,
      Day: ev.date ? dayjs(ev.date).format("dddd") : "",
      Start: ev.startTime,
      End: ev.endTime,
      Class: ev.className || "",
      Teacher: ev.teacher,
      Room: ev.room,
    }));

  const wsList = XLSX.utils.json_to_sheet(flatRows);
  wsList["!cols"] = [
    { wch: 22 },
    { wch: 12 },
    { wch: 12 },
    { wch: 8 },
    { wch: 8 },
    { wch: 14 },
    { wch: 22 },
    { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, wsList, "All Slots");

  XLSX.writeFile(
    wb,
    `${label}_${dayjs().format("YYYY-MM-DD")}.xlsx`
  );
}
