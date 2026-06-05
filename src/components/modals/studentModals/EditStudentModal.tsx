import { Modal, Form, Input, Select, Button, Checkbox } from "antd";
import { useEffect } from "react";

type SelectOption = {
  value: number;
  label: string;
  subjectId?: number;
  linkedClassId?: number;
};

type Student = {
  id: number | string;
  student_name: string;
  user_name: string;
  email?: string;
  password?: string;
  status: string;
  gender?: string;
  student_gender?: string;
  sex?: string;
  student_sex?: string;
  nationality?: string;
  class_id?: number;
  subject_class_id?: number | string;
  subject_ids?: number[];
  class_ids?: number[];
  is_sen?: boolean;
  sen_details?: string;
};

type EditStudentModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  student: Student | null;
  subjectOptions?: SelectOption[];
  classOptions?: SelectOption[];
  showAssignmentFields?: boolean;
};

const normalizeIdArray = (values: unknown[]): number[] =>
  Array.from(
    new Set(
      values
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  );

export const EditStudentModal = ({
  open,
  onCancel,
  onOk,
  student,
  subjectOptions = [],
  classOptions = [],
  showAssignmentFields = false,
}: EditStudentModalProps) => {
  const [form] = Form.useForm();
  const shouldShowAssignmentFields =
    showAssignmentFields && (subjectOptions.length > 0 || classOptions.length > 0);

  useEffect(() => {
    if (student) {
      const currentGender =
        student?.gender ||
        student?.student_gender ||
        (student as any)?.sex ||
        (student as any)?.student_sex;
      const subjectIds = normalizeIdArray([
        ...(Array.isArray(student?.subject_ids) ? student.subject_ids : []),
        (student as any)?.subject_id,
      ]);
      const classIds = normalizeIdArray([
        ...(Array.isArray(student?.class_ids) ? student.class_ids : []),
        student?.subject_class_id,
      ]);

      form?.setFieldsValue({
        student_name: student?.student_name,
        user_name: student?.user_name,
        email: student?.email,
        password: "",
        status: student?.status,
        gender: currentGender ? String(currentGender).toLowerCase() : undefined,
        nationality: (student as any)?.nationality || undefined,
        class_id: student?.class_id,
        subject_ids: subjectIds,
        class_ids: classIds,
        is_sen: Boolean((student as any)?.is_sen),
        sen_details: (student as any)?.sen_details || "",
      });
    } else {
      form.resetFields();
    }
  }, [student, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (student) {
        onOk({ ...values, id: student.id });
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={student?.student_name ? `Edit Student: ${student.student_name}` : "Edit Student"}
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
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="student_name"
          label="Student Name"
          rules={[{ required: true, message: "Please input student name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="user_name"
          label="Username"
          rules={[{ required: true, message: "Please input username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: "email", message: "Please enter a valid email!" },
            { required: false },
          ]}
        >
          <Input />
        </Form.Item>

        {shouldShowAssignmentFields ? (
          <>
            <Form.Item name="subject_ids" label="Subjects">
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="label"
                options={subjectOptions}
                placeholder="Select one or more subjects"
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, nextValues) =>
                JSON.stringify(prevValues?.subject_ids || []) !==
                JSON.stringify(nextValues?.subject_ids || [])
              }
            >
              {({ getFieldValue }) => {
                const selectedSubjectIds = normalizeIdArray([
                  ...(Array.isArray(getFieldValue("subject_ids"))
                    ? getFieldValue("subject_ids")
                    : []),
                ]);
                const allowedSubjectIds = new Set(selectedSubjectIds);
                const filteredClassOptions = classOptions.filter(
                  (option) =>
                    allowedSubjectIds.size === 0 ||
                    !option.subjectId ||
                    allowedSubjectIds.has(Number(option.subjectId))
                );

                return (
                  <Form.Item name="class_ids" label="Class">
                    <Select
                      mode="multiple"
                      showSearch
                      optionFilterProp="label"
                      options={filteredClassOptions}
                      placeholder="Select one or more classes related to selected subject(s)"
                      maxTagCount="responsive"
                      onChange={(nextClassIds) => {
                        const selectedClassIds = normalizeIdArray(
                          Array.isArray(nextClassIds) ? nextClassIds : []
                        );
                        const nextSubjectIds = classOptions
                          .filter((option) => selectedClassIds.includes(Number(option.value)))
                          .map((option) => Number(option.subjectId))
                          .filter((id) => Number.isFinite(id) && id > 0);
                        form.setFieldsValue({
                          subject_ids: Array.from(new Set(nextSubjectIds)),
                        });
                      }}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </>
        ) : null}

        <Form.Item
          name="password"
          label="Password (Optional)"
          extra="Leave empty to keep current password."
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="suspended">Suspended</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
        >
          <Select placeholder="Select gender" allowClear>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="nationality"
          label="Nationality"
        >
          <Input placeholder="e.g., British, American" />
        </Form.Item>

        <Form.Item name="is_sen" valuePropName="checked">
          <Checkbox>SEN student</Checkbox>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, nextValues) => prevValues?.is_sen !== nextValues?.is_sen}
        >
          {({ getFieldValue }) =>
            getFieldValue("is_sen") ? (
              <Form.Item
                name="sen_details"
                label="SEN Details"
                rules={[{ required: true, message: "Please add SEN details." }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Support plan, accommodations, key notes..."
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};
