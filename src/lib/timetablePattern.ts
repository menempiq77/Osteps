import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export type WeekMode = "single" | "ab";
export type WeekLabel = "A" | "B";

export interface TimetablePattern {
  mode: WeekMode;
  /** A date (YYYY-MM-DD) that falls inside a "Week A". Used to compute A/B parity. */
  anchor: string;
}

const STORAGE_KEY = "osteps_timetable_pattern";

export function defaultPattern(): TimetablePattern {
  return {
    mode: "single",
    anchor: dayjs().startOf("isoWeek").format("YYYY-MM-DD"),
  };
}

export function loadPattern(): TimetablePattern {
  if (typeof window === "undefined") return defaultPattern();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPattern();
    const parsed = JSON.parse(raw) as Partial<TimetablePattern>;
    const mode: WeekMode = parsed.mode === "ab" ? "ab" : "single";
    const anchor =
      parsed.anchor && dayjs(parsed.anchor).isValid()
        ? dayjs(parsed.anchor).format("YYYY-MM-DD")
        : defaultPattern().anchor;
    return { mode, anchor };
  } catch {
    return defaultPattern();
  }
}

export function savePattern(pattern: TimetablePattern): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pattern));
}

/** Which week (A/B) a given date falls into, based on the pattern anchor. */
export function weekLabelForDate(
  pattern: TimetablePattern,
  date: dayjs.Dayjs = dayjs()
): WeekLabel {
  const anchorWeek = dayjs(pattern.anchor).startOf("isoWeek");
  const thisWeek = date.startOf("isoWeek");
  const diff = thisWeek.diff(anchorWeek, "week");
  const parity = ((diff % 2) + 2) % 2;
  return parity === 0 ? "A" : "B";
}
