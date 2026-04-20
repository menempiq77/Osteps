export interface SchoolPeriod {
  id: string;
  label: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isTeaching: boolean;
}

const STORAGE_KEY = "osteps_school_periods";

export const DEFAULT_PERIODS: SchoolPeriod[] = [
  { id: "reg",   label: "Reg",   startTime: "07:40", endTime: "08:00", isTeaching: false },
  { id: "p1",    label: "P1",    startTime: "08:00", endTime: "09:00", isTeaching: true  },
  { id: "p2",    label: "P2",    startTime: "09:00", endTime: "10:00", isTeaching: true  },
  { id: "break", label: "Break", startTime: "10:00", endTime: "10:20", isTeaching: false },
  { id: "p3",    label: "P3",    startTime: "10:20", endTime: "11:20", isTeaching: true  },
  { id: "p4",    label: "P4",    startTime: "11:20", endTime: "12:20", isTeaching: true  },
  { id: "lunch", label: "Lunch", startTime: "12:20", endTime: "13:20", isTeaching: false },
  { id: "p5",    label: "P5",    startTime: "13:20", endTime: "14:20", isTeaching: true  },
  { id: "p6",    label: "P6",    startTime: "14:20", endTime: "15:20", isTeaching: true  },
];

export function loadPeriods(): SchoolPeriod[] {
  if (typeof window === "undefined") return DEFAULT_PERIODS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERIODS;
    const parsed = JSON.parse(raw) as SchoolPeriod[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PERIODS;
  } catch {
    return DEFAULT_PERIODS;
  }
}

export function savePeriods(periods: SchoolPeriod[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

export function resetPeriodsToDefault(): SchoolPeriod[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_PERIODS;
}

export const DAYS_OF_WEEK = [
  { value: "Sunday",    label: "Sun" },
  { value: "Monday",    label: "Mon" },
  { value: "Tuesday",   label: "Tue" },
  { value: "Wednesday", label: "Wed" },
  { value: "Thursday",  label: "Thu" },
  { value: "Friday",    label: "Fri" },
  { value: "Saturday",  label: "Sat" },
] as const;

export type DayValue = (typeof DAYS_OF_WEEK)[number]["value"];

// ── School days configuration ──────────────────────────────────────────────

const DAYS_STORAGE_KEY = "osteps_school_days";

export const ALL_CANONICAL_DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
] as const;

export const DEFAULT_SCHOOL_DAYS: string[] = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
];

export function loadSchoolDays(): string[] {
  if (typeof window === "undefined") return [...DEFAULT_SCHOOL_DAYS];
  try {
    const raw = localStorage.getItem(DAYS_STORAGE_KEY);
    if (!raw) return [...DEFAULT_SCHOOL_DAYS];
    const parsed = JSON.parse(raw) as string[];
    const valid = parsed.filter((d) => (ALL_CANONICAL_DAYS as readonly string[]).includes(d));
    return valid.length > 0 ? valid : [...DEFAULT_SCHOOL_DAYS];
  } catch {
    return [...DEFAULT_SCHOOL_DAYS];
  }
}

export function saveSchoolDays(days: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAYS_STORAGE_KEY, JSON.stringify(days));
}

export function resetSchoolDaysToDefault(): string[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DAYS_STORAGE_KEY);
  }
  return [...DEFAULT_SCHOOL_DAYS];
}
