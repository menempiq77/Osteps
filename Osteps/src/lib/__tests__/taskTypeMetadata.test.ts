import { describe, expect, it } from "vitest";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";

const START = "2026-01-01T10:00:00.000Z";
const startMs = new Date(START).getTime();

describe("resolveExamWindow", () => {
  it("returns a disabled window when exam mode is off", () => {
    const window = resolveExamWindow({ exam_mode: false });
    expect(window).toMatchObject({
      examMode: false,
      state: "disabled",
      startAt: null,
      endAt: null,
      remainingMs: null,
      untilOpenMs: null,
    });
  });

  it("treats null/undefined source as disabled", () => {
    expect(resolveExamWindow(null).state).toBe("disabled");
    expect(resolveExamWindow(undefined).state).toBe("disabled");
  });

  it("parses truthy string and numeric exam_mode flags", () => {
    for (const flag of ["1", "true", "YES", "on", 1]) {
      const window = resolveExamWindow({
        exam_mode: flag as never,
        exam_start_at: START,
        exam_duration_minutes: 60,
      });
      expect(window.examMode).toBe(true);
    }
  });

  it("treats unrecognized exam_mode strings as disabled", () => {
    expect(resolveExamWindow({ exam_mode: "maybe" }).state).toBe("disabled");
    expect(resolveExamWindow({ exam_mode: 0 }).state).toBe("disabled");
  });

  it("derives the end time from the duration when no explicit end is given", () => {
    const window = resolveExamWindow(
      { exam_mode: true, exam_start_at: START, exam_duration_minutes: 30 },
      startMs - 1000
    );
    expect(window.endAt).toBe("2026-01-01T10:30:00.000Z");
    expect(window.endAtMs).toBe(startMs + 30 * 60 * 1000);
  });

  it("prefers an explicit exam_end_at over the computed duration", () => {
    const explicitEnd = "2026-01-01T12:00:00.000Z";
    const window = resolveExamWindow(
      {
        exam_mode: true,
        exam_start_at: START,
        exam_duration_minutes: 30,
        exam_end_at: explicitEnd,
      },
      startMs - 1000
    );
    expect(window.endAt).toBe(explicitEnd);
  });

  it("accepts a string duration", () => {
    const window = resolveExamWindow(
      { exam_mode: true, exam_start_at: START, exam_duration_minutes: "45" },
      startMs - 1000
    );
    expect(window.endAtMs).toBe(startMs + 45 * 60 * 1000);
  });

  it("marks the window scheduled before the start time", () => {
    const window = resolveExamWindow(
      { exam_mode: true, exam_start_at: START, exam_duration_minutes: 60 },
      startMs - 5 * 60 * 1000
    );
    expect(window.state).toBe("scheduled");
    expect(window.untilOpenMs).toBe(5 * 60 * 1000);
    expect(window.remainingMs).toBeNull();
  });

  it("marks the window open between start and end", () => {
    const window = resolveExamWindow(
      { exam_mode: true, exam_start_at: START, exam_duration_minutes: 60 },
      startMs + 10 * 60 * 1000
    );
    expect(window.state).toBe("open");
    expect(window.remainingMs).toBe(50 * 60 * 1000);
    expect(window.untilOpenMs).toBe(0);
  });

  it("marks the window ended at or after the end time", () => {
    const window = resolveExamWindow(
      { exam_mode: true, exam_start_at: START, exam_duration_minutes: 60 },
      startMs + 60 * 60 * 1000
    );
    expect(window.state).toBe("ended");
    expect(window.remainingMs).toBe(0);
  });

  it("returns invalid when the start time is missing or unparseable", () => {
    expect(
      resolveExamWindow({ exam_mode: true, exam_duration_minutes: 60 }).state
    ).toBe("invalid");
    expect(
      resolveExamWindow({
        exam_mode: true,
        exam_start_at: "not-a-date",
        exam_duration_minutes: 60,
      }).state
    ).toBe("invalid");
  });

  it("returns invalid when the end time is not after the start", () => {
    const window = resolveExamWindow({
      exam_mode: true,
      exam_start_at: START,
      exam_end_at: START,
    });
    expect(window.state).toBe("invalid");
    expect(window.startAtMs).toBe(startMs);
  });

  it("returns invalid when a duration is zero or negative", () => {
    expect(
      resolveExamWindow({
        exam_mode: true,
        exam_start_at: START,
        exam_duration_minutes: 0,
      }).state
    ).toBe("invalid");
    expect(
      resolveExamWindow({
        exam_mode: true,
        exam_start_at: START,
        exam_duration_minutes: -10,
      }).state
    ).toBe("invalid");
  });
});
