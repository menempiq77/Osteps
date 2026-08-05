import { describe, expect, it } from "vitest";
import {
  buildTeacherAssignedClassOptions,
  buildYearOptionsFromTeacherClasses,
  filterTeacherClassesByYear,
} from "@/lib/teacherAssignedClasses";

describe("teacher assigned class scoping", () => {
  const assignedYears = [
    {
      classes: [
        { id: 1, class_name: "Year 7", year_id: 7 },
        { id: 2, class_name: "Year 8", year_id: 8 },
      ],
    },
  ];

  it("keeps only classes represented by the assigned subject classes", () => {
    const options = buildTeacherAssignedClassOptions(assignedYears, [
      { id: 101, base_class_label: "Year 7", year_id: 7 },
    ]);
    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({
      id: "1",
      subject_class_id: "101",
      year_id: 7,
    });
  });

  it("deduplicates year options and filters classes by year", () => {
    const options = buildTeacherAssignedClassOptions(assignedYears);
    expect(buildYearOptionsFromTeacherClasses(options)).toEqual([
      { id: 7, name: "Year 7" },
      { id: 8, name: "Year 8" },
    ]);
    expect(filterTeacherClassesByYear(options, 8)).toHaveLength(1);
  });
});
