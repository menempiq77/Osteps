import { afterEach, describe, expect, it } from "vitest";
import {
  makeSubjectHintScopeKey,
  matchesSubjectStudentHint,
  mergeSubjectStudentHints,
  readSubjectStudentHints,
} from "@/lib/subjectStudentHints";

afterEach(() => window.localStorage.clear());

describe("subject student hints", () => {
  it("builds a stable key only for valid subject/class pairs", () => {
    expect(makeSubjectHintScopeKey(12, "class-a")).toBe("12:class-a");
    expect(makeSubjectHintScopeKey(0, "class-a")).toBeNull();
    expect(makeSubjectHintScopeKey(12, null)).toBeNull();
  });

  it("merges and normalizes hints within a subject scope", () => {
    const key = makeSubjectHintScopeKey(12, "class-a");
    mergeSubjectStudentHints(key, {
      ids: ["7", "7"],
      emails: ["Student@Example.com"],
      names: [" Ada Lovelace "],
    });
    expect(readSubjectStudentHints(key)).toEqual({
      ids: ["7"],
      usernames: [],
      emails: ["student@example.com"],
      names: ["ada lovelace"],
    });
    expect(
      matchesSubjectStudentHint(
        { id: 7, email: "other@example.com" },
        readSubjectStudentHints(key)
      )
    ).toBe(true);
  });
});
