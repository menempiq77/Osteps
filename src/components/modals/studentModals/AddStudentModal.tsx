import { Modal, Form, Input, Select, Button, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

type AddStudentModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void> | void;
  classId: number;
};

export const AddStudentModal = ({
  open,
  onCancel,
  onOk,
  classId,
}: AddStudentModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
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

  return (
    <Modal
      title="Add New Student"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="!bg-primary !text-white hover:!bg-primary/90 !border-none"
          onClick={handleSubmit}
        >
          Add Student
        </Button>,
      ]}
    >
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
    </Modal>
  );
};
