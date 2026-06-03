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
  const existingStudentOptions = useMemo(
    () =>
      existingStudents.map((student) => {
        const detailParts = [
          student.className,
          student.yearName,
          student.subjects?.length ? student.subjects.join(", ") : "",
          student.userName ? `@${student.userName}` : "",
          student.email,
        ].filter(Boolean);
        const label = detailParts.length > 0 ? `${student.name} — ${detailParts.join(" • ")}` : student.name;
        return {
          value: String(student.id),
          label,
          searchText: [student.name, student.userName, student.email, student.className, student.yearName, ...(student.subjects || [])]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      }),
    [existingStudents]
  );

  useEffect(() => {
    if (!open) return;
    setMode(canUseExistingMode ? "existing" : "new");
    setSelectedExistingStudentIds([]);
  }, [open, canUseExistingMode]);

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
      width={720}
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
            Select students who already exist in this class or another subject, then assign them to this subject class.
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
              options={existingStudentOptions}
              loading={existingStudentsLoading}
              disabled={existingStudentsLoading}
              placeholder={
                existingStudentsLoading
                  ? "Loading existing students..."
                  : existingStudentOptions.length > 0
                    ? "Search and choose students"
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
              ? "Checking students from the linked class..."
              : `${existingStudentOptions.length} available student${existingStudentOptions.length === 1 ? "" : "s"}.`}
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
