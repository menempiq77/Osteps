import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Button, Checkbox, Spin } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export type ExistingStudentOption = {
  id: string | number;
  name: string;
  userName?: string;
  email?: string;
  className?: string;
  yearName?: string;
  gender?: string;
  subjects?: string[];
  subjectAssignments?: Array<{
    subjectName: string;
    subjectId?: number;
    subjectClassId?: number;
    className?: string;
    yearName?: string;
  }>;
  raw?: Record<string, unknown>;
};

type SubjectClassFilterOption = {
  subjectName: string;
  subjectId?: number;
  subjectClassId?: number;
  yearLabel: string;
  classLabel: string;
};

type AddStudentModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void> | void;
  classId: number;
  canAssignExisting?: boolean;
  existingStudents?: ExistingStudentOption[];
  existingStudentsLoading?: boolean;
  assignExistingLoading?: boolean;
  onAssignExisting?: (studentIds: number[]) => Promise<void> | void;
  subjectClassOptions?: SubjectClassFilterOption[];
};

type ExistingStudentFilterState = {
  subject: string;
  year: string;
  className: string;
};

const EMPTY_EXISTING_STUDENT_FILTERS: ExistingStudentFilterState = {
  subject: "",
  year: "",
  className: "",
};

const normalizeExistingFilterValue = (value: unknown) =>
  String(value ?? "").trim().toLowerCase();

const resolveExistingStudentYearName = (student: ExistingStudentOption) => {
  const directYear = String(student.yearName ?? "").trim();
  if (directYear) return directYear;

  const className = String(student.className ?? "").trim();
  const match = className.match(/Year\s*\d+(?:\s*\([^)]*\))?/i);
  return match?.[0]?.trim() || "";
};

const getExistingStudentDetailParts = (student: ExistingStudentOption) => {
  const yearName = resolveExistingStudentYearName(student);
  return [
    student.className,
    yearName,
    student.subjects?.length ? student.subjects.join(", ") : "",
    student.userName ? `@${student.userName}` : "",
    student.email,
  ].filter(Boolean) as string[];
};

const getExistingStudentAssignments = (student: ExistingStudentOption) =>
  Array.isArray(student.subjectAssignments) ? student.subjectAssignments : [];

const getExistingStudentDetailText = (student: ExistingStudentOption) =>
  getExistingStudentDetailParts(student).join(" • ");

const getExistingStudentSearchText = (student: ExistingStudentOption) =>
  [
    student.name,
    student.userName,
    student.email,
    student.className,
    resolveExistingStudentYearName(student),
    ...(student.subjects || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const makeExistingFilterOptions = (values: unknown[]) => {
  const byKey = new Map<string, string>();

  values.forEach((value) => {
    const label = String(value ?? "").trim();
    const key = normalizeExistingFilterValue(label);
    if (key && !byKey.has(key)) {
      byKey.set(key, label);
    }
  });

  return Array.from(byKey.entries())
    .sort((left, right) => left[1].localeCompare(right[1]))
    .map(([value, label]) => ({ value, label }));
};

const existingStudentMatchesSubjectFilter = (
  student: ExistingStudentOption,
  subjectFilter: string
) => {
  if (!subjectFilter) return true;
  const assignments = getExistingStudentAssignments(student);
  if (assignments.length > 0) {
    return assignments.some(
      (assignment) => normalizeExistingFilterValue(assignment.subjectName) === subjectFilter
    );
  }
  return (student.subjects || []).some(
    (subject) => normalizeExistingFilterValue(subject) === subjectFilter
  );
};

const existingStudentMatchesFilters = (
  student: ExistingStudentOption,
  filters: ExistingStudentFilterState,
  subjectClassOptions: SubjectClassFilterOption[] = []
) => {
  const norm = normalizeExistingFilterValue;

  // When subject class options are available and a class is selected, use the subject-class
  // definition as the authoritative source of which students belong.
  // A student matches if their className equals the subject class's classLabel.
  // This avoids relying on student.subjects being populated (which is inconsistent
  // when students are fetched via the school class endpoint without subject eager-loading).
  if (subjectClassOptions.length > 0 && filters.subject && filters.className) {
    const matchingOption = subjectClassOptions.find(
      (opt) =>
        norm(opt.subjectName) === filters.subject &&
        (!filters.year || norm(opt.yearLabel) === filters.year) &&
        norm(opt.classLabel) === filters.className
    );

    if (matchingOption) {
      // Primary: student's class name matches the subject class label directly.
      if (norm(student.className) === norm(matchingOption.classLabel)) return true;

      // Secondary: match via explicit subject assignment data (for already dual-enrolled students).
      const assignments = getExistingStudentAssignments(student);
      if (matchingOption.subjectClassId) {
        if (assignments.some((a) => Number(a.subjectClassId) === matchingOption.subjectClassId)) return true;
      }
      if (
        assignments.some(
          (a) =>
            norm(a.subjectName) === filters.subject &&
            (!filters.className ||
              norm(a.className) === filters.className ||
              norm(student.className) === filters.className)
        )
      )
        return true;

      return false;
    }

    // No matchingOption — fall through to generic matching below.
  }

  if (!existingStudentMatchesSubjectFilter(student, filters.subject)) {
    return false;
  }
  const assignments = getExistingStudentAssignments(student);
  if (assignments.length > 0 && filters.subject) {
    return assignments.some((assignment) => {
      const subjectMatches = norm(assignment.subjectName) === filters.subject;
      const yearMatches = !filters.year || norm(assignment.yearName) === filters.year;
      const classMatches = !filters.className || norm(assignment.className) === filters.className;
      return subjectMatches && yearMatches && classMatches;
    });
  }
  if (filters.year && norm(resolveExistingStudentYearName(student)) !== filters.year) {
    return false;
  }
  if (filters.className && norm(student.className) !== filters.className) return false;
  return true;
};

export const AddStudentModal = ({
  open,
  onCancel,
  onOk,
  classId,
  canAssignExisting = false,
  existingStudents = [],
  existingStudentsLoading = false,
  assignExistingLoading = false,
  onAssignExisting,
  subjectClassOptions = [],
}: AddStudentModalProps) => {
  const [form] = Form.useForm();
  const canUseExistingMode = canAssignExisting && typeof onAssignExisting === "function";
  const [mode, setMode] = useState<"existing" | "new">("new");
  const [selectedExistingStudentIds, setSelectedExistingStudentIds] = useState<string[]>([]);
  const [existingStudentSearch, setExistingStudentSearch] = useState("");
  const [existingFilters, setExistingFilters] = useState<ExistingStudentFilterState>({
    ...EMPTY_EXISTING_STUDENT_FILTERS,
  });
  const existingStudentOptions = useMemo(
    () =>
      existingStudents.map((student) => {
        const detailParts = getExistingStudentDetailParts(student);
        const label = detailParts.length > 0 ? `${student.name} — ${detailParts.join(" • ")}` : student.name;
        return {
          value: String(student.id),
          label,
          searchText: getExistingStudentSearchText(student),
        };
      }),
    [existingStudents]
  );
  const existingStudentById = useMemo(
    () => new Map(existingStudents.map((student) => [String(student.id), student])),
    [existingStudents]
  );
  const existingStudentSearchTextById = useMemo(
    () => new Map(existingStudentOptions.map((option) => [option.value, option.searchText])),
    [existingStudentOptions]
  );
  const existingSubjectFilterOptions = useMemo(
    () =>
      makeExistingFilterOptions(
        existingStudents.flatMap((student) => {
          const assignments = getExistingStudentAssignments(student);
          return assignments.length > 0
            ? assignments.map((assignment) => assignment.subjectName)
            : student.subjects || [];
        })
      ),
    [existingStudents]
  );
  const existingYearFilterOptions = useMemo(() => {
    if (subjectClassOptions.length > 0 && existingFilters.subject) {
      // Use subject_classes data for accurate year options scoped to selected subject.
      return makeExistingFilterOptions(
        subjectClassOptions
          .filter(
            (opt) =>
              normalizeExistingFilterValue(opt.subjectName) === existingFilters.subject
          )
          .map((opt) => opt.yearLabel)
      );
    }
    return makeExistingFilterOptions(
      existingStudents.flatMap((student) => {
        const assignments = getExistingStudentAssignments(student).filter(
          (assignment) =>
            !existingFilters.subject ||
            normalizeExistingFilterValue(assignment.subjectName) === existingFilters.subject
        );
        if (assignments.length > 0) return assignments.map((assignment) => assignment.yearName);
        return existingStudentMatchesSubjectFilter(student, existingFilters.subject)
          ? [resolveExistingStudentYearName(student)]
          : [];
      })
    );
  }, [existingStudents, existingFilters.subject, subjectClassOptions]);
  const existingClassFilterOptions = useMemo(() => {
    if (subjectClassOptions.length > 0 && existingFilters.subject) {
      // Use subject_classes data for accurate class options scoped to subject + year.
      return makeExistingFilterOptions(
        subjectClassOptions
          .filter(
            (opt) =>
              normalizeExistingFilterValue(opt.subjectName) === existingFilters.subject &&
              (!existingFilters.year ||
                normalizeExistingFilterValue(opt.yearLabel) === existingFilters.year)
          )
          .map((opt) => opt.classLabel)
      );
    }
    return makeExistingFilterOptions(
      existingStudents.flatMap((student) => {
        const assignments = getExistingStudentAssignments(student).filter((assignment) => {
          const subjectMatches =
            !existingFilters.subject ||
            normalizeExistingFilterValue(assignment.subjectName) === existingFilters.subject;
          const yearMatches =
            !existingFilters.year || normalizeExistingFilterValue(assignment.yearName) === existingFilters.year;
          return subjectMatches && yearMatches;
        });
        if (assignments.length > 0) return assignments.map((assignment) => assignment.className);
        return existingStudentMatchesSubjectFilter(student, existingFilters.subject) &&
          (!existingFilters.year || normalizeExistingFilterValue(resolveExistingStudentYearName(student)) === existingFilters.year)
          ? [student.className]
          : [];
      })
    );
  }, [existingStudents, existingFilters.subject, existingFilters.year, subjectClassOptions]);
  const canShowExistingStudentList = Boolean(
    existingFilters.subject && existingFilters.year && existingFilters.className
  );
  const filteredExistingStudents = useMemo(
    () =>
      canShowExistingStudentList
        ? existingStudents.filter((student) =>
            existingStudentMatchesFilters(student, existingFilters, subjectClassOptions)
          )
        : [],
    [canShowExistingStudentList, existingStudents, existingFilters, subjectClassOptions]
  );
  const visibleExistingStudents = useMemo(() => {
    const search = normalizeExistingFilterValue(existingStudentSearch);
    if (!search) return filteredExistingStudents;

    return filteredExistingStudents.filter((student) =>
      String(existingStudentSearchTextById.get(String(student.id)) || "").includes(search)
    );
  }, [existingStudentSearch, existingStudentSearchTextById, filteredExistingStudents]);
  const visibleExistingStudentIds = useMemo(
    () => visibleExistingStudents.map((student) => String(student.id)),
    [visibleExistingStudents]
  );
  const selectedExistingStudents = useMemo(
    () =>
      selectedExistingStudentIds
        .map((id) => existingStudentById.get(id))
        .filter((student): student is ExistingStudentOption => Boolean(student)),
    [existingStudentById, selectedExistingStudentIds]
  );
  const selectedExistingStudentIdSet = useMemo(
    () => new Set(selectedExistingStudentIds),
    [selectedExistingStudentIds]
  );
  const hasExistingFilters = Boolean(
    existingFilters.subject || existingFilters.year || existingFilters.className
  );

  useEffect(() => {
    if (!open) return;
    setMode(canUseExistingMode ? "existing" : "new");
    setSelectedExistingStudentIds([]);
    setExistingStudentSearch("");
    setExistingFilters({ ...EMPTY_EXISTING_STUDENT_FILTERS });
  }, [open, canUseExistingMode]);

  const selectAllFilteredExistingStudents = () => {
    if (visibleExistingStudentIds.length === 0) return;
    setSelectedExistingStudentIds((current) =>
      Array.from(new Set([...current, ...visibleExistingStudentIds]))
    );
  };

  const toggleExistingStudentSelection = (studentId: string) => {
    setSelectedExistingStudentIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId]
    );
  };

  const removeExistingStudentSelection = (studentId: string) => {
    setSelectedExistingStudentIds((current) => current.filter((id) => id !== studentId));
  };

  const handleSubmit = async () => {
    try {
      if (mode === "existing") {
        const studentIds = Array.from(
          new Set(
            selectedExistingStudentIds
              .map((id) => Number(id))
              .filter((id) => Number.isFinite(id) && id > 0)
          )
        );

        if (!canUseExistingMode || studentIds.length === 0) {
          return;
        }

        await onAssignExisting?.(studentIds);
        setSelectedExistingStudentIds([]);
        return;
      }

      const values = await form.validateFields();
      const rows = Array.isArray(values?.students) ? values.students : [];
      const sanitizedRows = rows
        .filter((row: any) => row && row.student_name && row.user_name && row.password)
        .map((row: any) => ({
          student_name: String(row.student_name).trim(),
          user_name: String(row.user_name).trim(),
          email: row.email ? String(row.email).trim() : "",
          password: String(row.password),
          status: row.status || "active",
          gender: row.gender,
          nationality: row.nationality ? String(row.nationality).trim() : "",
          is_sen: !!row.is_sen,
          sen_details: row.is_sen && row.sen_details ? String(row.sen_details).trim() : "",
        }));

      await onOk({
        class_id: classId,
        students: sanitizedRows,
      });
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    setSelectedExistingStudentIds([]);
    setExistingStudentSearch("");
    setExistingFilters({ ...EMPTY_EXISTING_STUDENT_FILTERS });
    onCancel();
  };

  const submitDisabled =
    mode === "existing" && (!canUseExistingMode || selectedExistingStudentIds.length === 0);

  const submitLoading = mode === "existing" ? assignExistingLoading : false;

  return (
    <Modal
      title="Add Student"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={820}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
          onClick={handleSubmit}
          disabled={submitDisabled}
          loading={submitLoading}
        >
          {mode === "existing" ? "Assign Students" : "Add Student"}
        </Button>,
      ]}
    >
      {canUseExistingMode && (
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`rounded-lg px-3 py-2 font-medium transition ${
              mode === "existing"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            Assign Existing
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`rounded-lg px-3 py-2 font-medium transition ${
              mode === "new"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            Create New
          </button>
        </div>
      )}

      {mode === "existing" && canUseExistingMode ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Select students who already exist in another class or subject, then assign them to this subject class as well.
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Subject
              </label>
              <Select
                allowClear
                showSearch
                value={existingFilters.subject || undefined}
                options={existingSubjectFilterOptions}
                placeholder="Choose subject"
                className="w-full"
                optionFilterProp="label"
                disabled={existingStudentsLoading}
                onChange={(value) =>
                  setExistingFilters({
                    subject: String(value || ""),
                    year: "",
                    className: "",
                  })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Year Group
              </label>
              <Select
                allowClear
                showSearch
                value={existingFilters.year || undefined}
                options={existingYearFilterOptions}
                placeholder="Choose year group"
                className="w-full"
                optionFilterProp="label"
                disabled={existingStudentsLoading}
                onChange={(value) =>
                  setExistingFilters((current) => ({
                    ...current,
                    year: String(value || ""),
                    className: "",
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Class
              </label>
              <Select
                allowClear
                showSearch
                value={existingFilters.className || undefined}
                options={existingClassFilterOptions}
                placeholder="Choose class"
                className="w-full"
                optionFilterProp="label"
                disabled={existingStudentsLoading}
                onChange={(value) =>
                  setExistingFilters((current) => ({
                    ...current,
                    className: String(value || ""),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Button
              size="small"
              onClick={selectAllFilteredExistingStudents}
              disabled={existingStudentsLoading || visibleExistingStudentIds.length === 0}
            >
              Select all shown
            </Button>
            <Button
              size="small"
              onClick={() => setSelectedExistingStudentIds([])}
              disabled={selectedExistingStudentIds.length === 0}
            >
              Clear selected
            </Button>
            {hasExistingFilters && (
              <Button
                size="small"
                type="link"
                onClick={() => setExistingFilters({ ...EMPTY_EXISTING_STUDENT_FILTERS })}
              >
                Clear filters
              </Button>
            )}
            <span>
              {canShowExistingStudentList
                ? `${selectedExistingStudentIds.length} selected. You can assign all selected students at once.`
                : "Choose subject, year group, and class first."}
            </span>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Existing students
            </label>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-700">
                  Selected students
                  <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    {selectedExistingStudentIds.length}
                  </span>
                </div>
                <Button
                  size="small"
                  onClick={() => setSelectedExistingStudentIds([])}
                  disabled={selectedExistingStudentIds.length === 0}
                >
                  Remove all
                </Button>
              </div>

              {selectedExistingStudents.length > 0 ? (
                <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto pr-1">
                  {selectedExistingStudents.map((student) => (
                    <div
                      key={String(student.id)}
                      className="flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900"
                    >
                      <span className="truncate font-medium">{student.name}</span>
                      <span className="hidden max-w-[260px] truncate text-xs text-emerald-700 md:inline">
                        {getExistingStudentDetailText(student)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExistingStudentSelection(String(student.id))}
                        className="ml-1 rounded-full px-1 text-base leading-none text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950"
                        aria-label={`Remove ${student.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                  No students selected yet. Tick students from the list below.
                </div>
              )}
            </div>

            <div className="mt-3">
              <Input
                value={existingStudentSearch}
                onChange={(event) => setExistingStudentSearch(event.target.value)}
                allowClear
                placeholder="Search by student name, username, class, year, or subject"
                disabled={existingStudentsLoading}
              />
            </div>

            <div className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
              {existingStudentsLoading ? (
                <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-slate-500">
                  <Spin size="small" />
                  Loading existing students...
                </div>
              ) : !canShowExistingStudentList ? (
                <div className="px-3 py-8 text-center text-sm text-slate-500">
                  Choose a subject, year group, and class to show matching existing students.
                </div>
              ) : visibleExistingStudents.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {visibleExistingStudents.map((student) => {
                    const studentId = String(student.id);
                    const isSelected = selectedExistingStudentIdSet.has(studentId);
                    const details = getExistingStudentDetailText(student);

                    return (
                      <button
                        key={studentId}
                        type="button"
                        onClick={() => toggleExistingStudentSelection(studentId)}
                        className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition ${
                          isSelected ? "bg-emerald-50" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleExistingStudentSelection(studentId)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">{student.name}</span>
                            {isSelected && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                Selected
                              </span>
                            )}
                          </div>
                          {details && (
                            <div className="mt-0.5 text-xs text-slate-500">
                              {details}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 py-8 text-center text-sm text-slate-500">
                  {hasExistingFilters || existingStudentSearch
                    ? "No students match these filters."
                    : "No unassigned existing students found."}
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {existingStudentsLoading
              ? "Checking students from all classes and subject assignments..."
              : canShowExistingStudentList
                ? `${visibleExistingStudents.length} shown of ${existingStudentOptions.length} available student${existingStudentOptions.length === 1 ? "" : "s"}.`
                : "No students are shown until subject, year group, and class are selected."}
          </div>
        </div>
      ) : (
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          students: [{ status: "active", is_sen: false }],
        }}
      >
        <Form.List name="students">
          {(fields, { add, remove }) => (
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {fields.map((field, idx) => (
                <div key={field.key} className="rounded-xl border border-gray-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-slate-700">Student {idx + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <Form.Item
                    name={[field.name, "student_name"]}
                    label="Student Name"
                    rules={[{ required: true, message: "Please input student name!" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "user_name"]}
                    label="Username"
                    rules={[{ required: true, message: "Please input username!" }]}
                  >
                    <Input autoComplete="off" />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "email"]}
                    label="Email (Optional)"
                    rules={[{ type: "email", message: "Please enter a valid email!" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "password"]}
                    label="Password"
                    rules={[{ required: true, message: "Please input password!" }]}
                  >
                    <Input.Password autoComplete="new-password" />
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "status"]}
                    label="Status"
                    initialValue="active"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="inactive">Inactive</Select.Option>
                      <Select.Option value="suspended">Suspended</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name={[field.name, "gender"]}
                    label="Gender"
                    rules={[{ required: true, message: "Please select gender!" }]}
                  >
                    <Select placeholder="Select gender">
                      <Select.Option value="male">Male</Select.Option>
                      <Select.Option value="female">Female</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name={[field.name, "nationality"]} label="Nationality">
                    <Input placeholder="e.g. British, Emirati, Egyptian" />
                  </Form.Item>

                  <Form.Item name={[field.name, "is_sen"]} valuePropName="checked">
                    <Checkbox>SEN student</Checkbox>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, nextValues) =>
                      prevValues?.students?.[field.name]?.is_sen !==
                      nextValues?.students?.[field.name]?.is_sen
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue(["students", field.name, "is_sen"]) ? (
                        <Form.Item
                          name={[field.name, "sen_details"]}
                          label="SEN Details"
                          rules={[
                            { required: true, message: "Please add SEN details." },
                          ]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Support plan, accommodations, key notes..."
                          />
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add({ status: "active", is_sen: false })}
                block
                icon={<PlusOutlined />}
              >
                Add Another Student
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
      )}
    </Modal>
  );
};
