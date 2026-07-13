import { describe, expect, it } from "vitest";
import {
  mapWithConcurrency,
  mergeAndRankLeaderboards,
  resolveStudentId,
  resolveStudentName,
  type LeaderboardRawEntry,
} from "@/lib/leaderboard";

describe("resolveStudentId", () => {
  it("prefers student_id over other identifiers", () => {
    const entry: LeaderboardRawEntry = {
      student_id: 1,
      studentId: 2,
      id: 3,
      user_id: 4,
    };
    expect(resolveStudentId(entry)).toBe("1");
  });

  it("falls back through studentId, id, user_id and nested ids", () => {
    expect(resolveStudentId({ studentId: 22 })).toBe("22");
    expect(resolveStudentId({ id: 33 })).toBe("33");
    expect(resolveStudentId({ user_id: 44 })).toBe("44");
    expect(resolveStudentId({ user: { id: 55 } })).toBe("55");
    expect(resolveStudentId({ student: { student_id: 66 } })).toBe("66");
    expect(resolveStudentId({ student: { id: 77 } })).toBe("77");
  });

  it("stringifies numeric ids and returns empty string when absent", () => {
    expect(resolveStudentId({ student_id: 0 })).toBe("0");
    expect(resolveStudentId({})).toBe("");
  });
});

describe("resolveStudentName", () => {
  it("prefers student_name then falls back through the chain", () => {
    expect(resolveStudentName({ student_name: "Alice" })).toBe("Alice");
    expect(resolveStudentName({ name: "Bob" })).toBe("Bob");
    expect(resolveStudentName({ user: { name: "Carol" } })).toBe("Carol");
    expect(resolveStudentName({ student: { student_name: "Dan" } })).toBe("Dan");
    expect(resolveStudentName({ student: { name: "Eve" } })).toBe("Eve");
    expect(resolveStudentName({ student: { user: { name: "Fay" } } })).toBe("Fay");
  });

  it("returns empty string when no name is present", () => {
    expect(resolveStudentName({})).toBe("");
  });
});

describe("mergeAndRankLeaderboards", () => {
  it("ranks students by points descending and assigns medals", () => {
    const rows = mergeAndRankLeaderboards([
      [
        { student_id: 1, student_name: "Alice", total_marks: 10 },
        { student_id: 2, student_name: "Bob", total_marks: 30 },
        { student_id: 3, student_name: "Carol", total_marks: 20 },
        { student_id: 4, student_name: "Dan", total_marks: 5 },
      ],
    ]);

    expect(rows.map((r) => r.name)).toEqual(["Bob", "Carol", "Alice", "Dan"]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
    expect(rows.map((r) => r.badge)).toEqual(["gold", "silver", "bronze", null]);
  });

  it("derives avatar from the first character of the name", () => {
    const [row] = mergeAndRankLeaderboards([[{ student_id: 1, student_name: "zoe", total_marks: 1 }]]);
    expect(row.avatar).toBe("Z");
  });

  it("uses '?' as avatar when the name is empty", () => {
    const [row] = mergeAndRankLeaderboards([[{ student_id: 1, total_marks: 1 }]]);
    expect(row.avatar).toBe("?");
  });

  it("reads points from total_marks, points, score or marks in priority order", () => {
    const [a] = mergeAndRankLeaderboards([[{ student_id: 1, points: 7 }]]);
    expect(a.points).toBe(7);
    const [b] = mergeAndRankLeaderboards([[{ student_id: 2, score: "9" }]]);
    expect(b.points).toBe(9);
    const [c] = mergeAndRankLeaderboards([[{ student_id: 3, marks: "4" }]]);
    expect(c.points).toBe(4);
  });

  it("coerces non-numeric point values to zero", () => {
    const [row] = mergeAndRankLeaderboards([[{ student_id: 1, total_marks: "abc" as unknown as number }]]);
    expect(row.points).toBe(0);
  });

  it("merges duplicate students across boards keeping the higher score", () => {
    const rows = mergeAndRankLeaderboards([
      [{ student_id: 1, student_name: "Alice", total_marks: 10 }],
      [{ student_id: 1, student_name: "Alice", total_marks: 25 }],
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].points).toBe(25);
  });

  it("groups nameless entries with the same id and keeps class metadata", () => {
    const rows = mergeAndRankLeaderboards([
      [{ student_id: 1, total_marks: 5, class_name: "7A", class_id: 99 }],
      [{ student_id: 1, total_marks: 8 }],
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].points).toBe(8);
    expect(rows[0].className).toBe("7A");
    expect(rows[0].class_id).toBe("99");
  });

  it("falls back to a name-based key when no id is available", () => {
    const rows = mergeAndRankLeaderboards([
      [{ student_name: "Same Name", total_marks: 3 }],
      [{ student_name: "same name", total_marks: 4 }],
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].points).toBe(4);
  });

  it("skips entries that have neither an id nor a name", () => {
    const rows = mergeAndRankLeaderboards([[{ total_marks: 100 }]]);
    expect(rows).toHaveLength(0);
  });

  it("tolerates empty and nullish board arrays", () => {
    expect(mergeAndRankLeaderboards([])).toEqual([]);
    expect(
      mergeAndRankLeaderboards([undefined as unknown as LeaderboardRawEntry[]])
    ).toEqual([]);
  });
});

describe("mapWithConcurrency", () => {
  it("maps every item preserving order", async () => {
    const result = await mapWithConcurrency([1, 2, 3, 4], 2, async (n) => n * 2);
    expect(result).toEqual([2, 4, 6, 8]);
  });

  it("provides the index to the mapper", async () => {
    const result = await mapWithConcurrency(["a", "b", "c"], 3, async (item, i) => `${item}${i}`);
    expect(result).toEqual(["a0", "b1", "c2"]);
  });

  it("returns an empty array for empty input", async () => {
    expect(await mapWithConcurrency([], 4, async (n) => n)).toEqual([]);
  });

  it("never runs more than `concurrency` mappers at once", async () => {
    let active = 0;
    let maxActive = 0;
    const items = Array.from({ length: 10 }, (_, i) => i);

    await mapWithConcurrency(items, 3, async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return null;
    });

    expect(maxActive).toBeLessThanOrEqual(3);
  });

  it("clamps invalid concurrency to at least one worker", async () => {
    const result = await mapWithConcurrency([1, 2, 3], 0, async (n) => n + 1);
    expect(result).toEqual([2, 3, 4]);
  });
});
