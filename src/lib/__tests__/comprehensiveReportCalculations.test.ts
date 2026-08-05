import { describe, expect, it } from "vitest";
import {
  calculateAttendancePercent,
  calculateCompletionRate,
  calculateNetPoints,
} from "@/lib/comprehensiveReportCalculations";

describe("comprehensive report calculations", () => {
  it("calculates attendance_percent from present and total records", () => {
    expect(calculateAttendancePercent(3, 4)).toBe(75);
    expect(calculateAttendancePercent(0, 0)).toBe(0);
  });

  it("calculates behavior net_points", () => {
    expect(calculateNetPoints([8, -3, 2])).toBe(7);
    expect(calculateNetPoints([])).toBe(0);
  });

  it("calculates completion_rate", () => {
    expect(calculateCompletionRate(7, 10)).toBe(70);
    expect(calculateCompletionRate(0, 0)).toBe(0);
  });
});
