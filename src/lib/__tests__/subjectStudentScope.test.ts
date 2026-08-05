import { describe, expect, it } from "vitest";
import {
  filterStudentsBySubjectScope,
  isStudentReportOwner,
  studentMatchesSubjectScope,
} from "@/lib/subjectStudentScope";

describe("student subject scope", () => {
  it("matches subject class before broader subject metadata", () => {
    const student = {
      subject_class_id: "class-a",
      subjects: [{ id: 12, name: "Islamic Studies" }],
    };
    expect(
      studentMatchesSubjectScope(student, {
        subjectId: 12,
        subjectClassId: "class-a",
      })
    ).toBe(true);
    expect(
      studentMatchesSubjectScope(student, {
        subjectId: 12,
        subjectClassId: "class-b",
      })
    ).toBe(false);
  });

  it("supports subject ids and normalized subject names", () => {
    expect(
      studentMatchesSubjectScope(
        { subjects: [{ subject_id: 12, name: "Islamiat" }] },
        { subjectId: 12 }
      )
    ).toBe(true);
    expect(
      studentMatchesSubjectScope(
        { subjects: ["Islamic Studies"] },
        { subjectName: " islamic studies " }
      )
    ).toBe(true);
  });

  it("filters out students outside the requested subject scope", () => {
    const students = [
      { id: 1, subjects: [{ id: 10 }] },
      { id: 2, subjects: [{ id: 20 }] },
    ];
    expect(filterStudentsBySubjectScope(students, { subjectId: 10 })).toEqual([
      { id: 1, subjects: [{ id: 10 }] },
    ]);
  });
});

describe("student report authorization", () => {
  it("allows only the current student's own report", () => {
    expect(isStudentReportOwner(42, 42)).toBe(true);
    expect(isStudentReportOwner("42", 42)).toBe(true);
    expect(isStudentReportOwner(43, 42)).toBe(false);
    expect(isStudentReportOwner(undefined, 42)).toBe(false);
  });
});
