import type { DayPeriodOverrides, SchoolPeriod } from "@/lib/schoolPeriods";
import type { TimetablePattern } from "@/lib/timetablePattern";

export interface TimetableSettings {
  schoolDays: string[];
  periods: SchoolPeriod[];
  dayOverrides: DayPeriodOverrides;
  pattern: TimetablePattern;
}
