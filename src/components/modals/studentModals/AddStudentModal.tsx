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
  raw?: Record<string, unknown>;
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
  return (student.subjects || []).some(
    (subject) => normalizeExistingFilterValue(subject) === subjectFilter
  );
};

const existingStudentMatchesFilters = (
  student: ExistingStudentOption,
  filters: ExistingStudentFilterState
) => {
  if (!existingStudentMatchesSubjectFilter(student, filters.subject)) {
    return false;
  }
  if (filters.year && normalizeExistingFilterValue(resolveExistingStudentYearName(student)) !== filters.year) {
    return false;
  }
  if (filters.className && normalizeExistingFilterValue(student.className) !== filters.className) {
    return false;
  }
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
}: AddStudentModalProps) => {
  const [form] = Form.useForm();
  const canUseExistingMode = canAssignExisting && typeof onAssignExisting === "function";
  const [mode, setMode] = useState<"existing" | "new">("new");
  const [selectedExistingStudentIds, setSelectedExistingStudentIds] = useState<string[]>([]);
  const [existingFilters, setExistingFilters] = useState<ExistingStudentFilterState>({
    ...EMPTY_EXISTING_STUDENT_FILTERS,
  });
  const existingStudentOptions = useMemo(
    () =>
      existingStudents.map((student) => {
        const yearName = resolveExistingStudentYearName(student);
        const detailParts = [
          student.className,
          yearName,
          student.subjects?.length ? student.subjects.join(", ") : "",
          student.userName ? `@${student.userName}` : "",
          student.email,
        ].filter(Boolean);
        const label = detailParts.length > 0 ? `${student.name} — ${detailParts.join(" • ")}` : student.name;
        return {
          value: String(student.id),
          label,
          searchText: [student.name, student.userName, student.email, student.className, yearName, ...(student.subjects || [])]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      }),
    [existingStudents]
  );
  const existingStudentOptionById = useMemo(
    () => new Map(existingStudentOptions.map((option) => [option.value, option])),
    [existingStudentOptions]
  );
  const existingSubjectFilterOptions = useMemo(
    () => makeExistingFilterOptions(existingStudents.flatMap((student) => student.subjects || [])),
    [existingStudents]
  );
  const existingYearFilterOptions = useMemo(
    () =>
      makeExistingFilterOptions(
        existingStudents
          .filter((student) => existingStudentMatchesSubjectFilter(student, existingFilters.subject))
          .map((student) => resolveExistingStudentYearName(student))
      ),
    [existingStudents, existingFilters.subject]
  );
  const existingClassFilterOptions = useMemo(
    () =>
      makeExistingFilterOptions(
        existingStudents
          .filter(
            (student) =>
              existingStudentMatchesSubjectFilter(student, existingFilters.subject) &&
              (!existingFilters.year || normalizeExistingFilterValue(resolveExistingStudentYearName(student)) === existingFilters.year)
          )
          .map((student) => student.className)
      ),
    [existingStudents, existingFilters.subject, existingFilters.year]
  );
  const filteredExistingStudents = useMemo(
    () => existingStudents.filter((student) => existingStudentMatchesFilters(student, existingFilters)),
    [existingStudents, existingFilters]
  );
  const filteredExistingStudentIds = useMemo(
    () => filteredExistingStudents.map((student) => String(student.id)),
    [filteredExistingStudents]
  );
  const filteredExistingStudentOptions = useMemo(() => {
    const filteredIds = new Set(filteredExistingStudentIds);
    return existingStudentOptions.filter((option) => filteredIds.has(option.value));
  }, [existingStudentOptions, filteredExistingStudentIds]);
  const displayedExistingStudentOptions = useMemo(() => {
    const visibleValues = new Set(filteredExistingStudentOptions.map((option) => option.value));
    const selectedHiddenOptions = selectedExistingStudentIds
      .filter((id) => !visibleValues.has(id))
      .map((id) => existingStudentOptionById.get(id))
      .filter((option): option is NonNullable<typeof option> => Boolean(option));

    return [...selectedHiddenOptions, ...filteredExistingStudentOptions];
  }, [existingStudentOptionById, filteredExistingStudentOptions, selectedExistingStudentIds]);
  const hasExistingFilters = Boolean(
    existingFilters.subject || existingFilters.year || existingFilters.className
  );

  useEffect(() => {
    if (!open) return;
    setMode(canUseExistingMode ? "existing" : "new");
    setSelectedExistingStudentIds([]);
    setExistingFilters({ ...EMPTY_EXISTING_STUDENT_FILTERS });
  }, [open, canUseExistingMode]);

  const selectAllFilteredExistingStudents = () => {
    if (filteredExistingStudentIds.length === 0) return;
    setSelectedExistingStudentIds((current) =>
      Array.from(new Set([...current, ...filteredExistingStudentIds]))
    );
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
              disabled={existingStudentsLoading || filteredExistingStudentIds.length === 0}
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
              {selectedExistingStudentIds.length} selected. You can assign all selected students at once.
            </span>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Existing students
            </label>
            <Select
              mode="multiple"
              showSearch
              allowClear
              value={selectedExistingStudentIds}
              onChange={(values) => setSelectedExistingStudentIds(values.map(String))}
              options={displayedExistingStudentOptions}
              loading={existingStudentsLoading}
              disabled={existingStudentsLoading}
              placeholder={
                existingStudentsLoading
                  ? "Loading existing students..."
                  : filteredExistingStudentOptions.length > 0
                    ? "Search and choose students"
                    : hasExistingFilters
                      ? "No students match these filters"
                      : "No unassigned existing students found"
              }
              filterOption={(input, option) =>
                String((option as any)?.searchText ?? option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              className="w-full"
              maxTagCount="responsive"
              notFoundContent={existingStudentsLoading ? <Spin size="small" /> : "No students found"}
            />
          </div>
          <div className="text-xs text-slate-500">
            {existingStudentsLoading
              ? "Checking students from all classes and subject assignments..."
              : `${filteredExistingStudentOptions.length} shown of ${existingStudentOptions.length} available student${existingStudentOptions.length === 1 ? "" : "s"}.`}
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
