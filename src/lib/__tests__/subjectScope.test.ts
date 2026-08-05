import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SUBJECT_STORAGE_KEY,
  getStoredSubjectId,
  resolveScopedSubjectId,
  withSubjectPayload,
  withSubjectQuery,
} from "@/lib/subjectScope";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("subject scope persistence", () => {
  it("reads only positive numeric subject ids", () => {
    expect(getStoredSubjectId()).toBeNull();
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "42");
    expect(getStoredSubjectId()).toBe(42);
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "0");
    expect(getStoredSubjectId()).toBeNull();
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "not-a-number");
    expect(getStoredSubjectId()).toBeNull();
  });

  it("handles storage failures safely", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getStoredSubjectId()).toBeNull();
  });
});

describe("subject-scoped request helpers", () => {
  it("prefers an explicit id and falls back to storage", () => {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "42");
    expect(resolveScopedSubjectId(7)).toBe(7);
    expect(resolveScopedSubjectId()).toBe(42);
  });

  it("adds subject_id without mutating the original object", () => {
    const params = { page: 1 };
    expect(withSubjectQuery(params, 9)).toEqual({ page: 1, subject_id: 9 });
    expect(withSubjectPayload({ title: "Quiz" }, 9)).toEqual({
      title: "Quiz",
      subject_id: 9,
    });
    expect(params).toEqual({ page: 1 });
  });
});
