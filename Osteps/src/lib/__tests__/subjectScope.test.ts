import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SUBJECT_STORAGE_KEY,
  getStoredSubjectId,
  resolveScopedSubjectId,
  withSubjectQuery,
} from "@/lib/subjectScope";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("getStoredSubjectId", () => {
  it("returns null when nothing is stored", () => {
    expect(getStoredSubjectId()).toBeNull();
  });

  it("returns the stored positive numeric id", () => {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "42");
    expect(getStoredSubjectId()).toBe(42);
  });

  it("returns null for non-positive or non-numeric stored values", () => {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "0");
    expect(getStoredSubjectId()).toBeNull();
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "-5");
    expect(getStoredSubjectId()).toBeNull();
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "abc");
    expect(getStoredSubjectId()).toBeNull();
  });

  it("returns null when localStorage access throws", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getStoredSubjectId()).toBeNull();
  });
});

describe("resolveScopedSubjectId", () => {
  it("prefers an explicit positive subject id", () => {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "42");
    expect(resolveScopedSubjectId(7)).toBe(7);
  });

  it("falls back to the stored id when the explicit id is invalid", () => {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "42");
    expect(resolveScopedSubjectId(0)).toBe(42);
    expect(resolveScopedSubjectId(null)).toBe(42);
    expect(resolveScopedSubjectId(undefined)).toBe(42);
  });

  it("returns null when neither an explicit nor stored id exists", () => {
    expect(resolveScopedSubjectId()).toBeNull();
  });
});

describe("withSubjectQuery", () => {
  it("adds the resolved subject_id to the params", () => {
    expect(withSubjectQuery({ page: 1 }, 9)).toEqual({ page: 1, subject_id: 9 });
  });

  it("returns a copy of params without subject_id when none resolves", () => {
    const params = { page: 2 };
    const result = withSubjectQuery(params);
    expect(result).toEqual({ page: 2 });
    expect(result).not.toBe(params);
  });

  it("uses the stored subject id when no explicit id is provided", () => {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, "3");
    expect(withSubjectQuery({ q: "x" })).toEqual({ q: "x", subject_id: 3 });
  });

  it("returns an empty object when called with no arguments and no stored id", () => {
    expect(withSubjectQuery()).toEqual({});
  });
});
