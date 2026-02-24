import { Modal, Form, Input, Button, message, Select, Checkbox } from "antd";
import { useEffect, useState } from "react";

interface Subject {
  id: number;
  name: string;
}

type TeacherBasic = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  subjects: number[];
  password?: string;
};

export const EditTeacherModal = ({
  teacher,
  isOpen,
  onOpenChange,
  onSave,
  isHOD,
  subjects,
}: {
  teacher: TeacherBasic | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: TeacherBasic) => void;
  isHOD?: boolean;
  subjects: Subject[];
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const subjectOptions = subjects.map((subj) => ({
    label: subj.name,
    value: subj.id,
  }));

  useEffect(() => {
    if (teacher) {
      form.setFieldsValue({
        name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        role: teacher.role,
        subjects: teacher.subjects,
        password: teacher.password,
      });
    } else {
      form.resetFields();
    }
  }, [teacher, form]);

  const handleSave = async () => {
    if (!teacher) return;

    try {
      setConfirmLoading(true);
      const values = await form.validateFields();

      onSave({
        ...teacher,
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
        email: values.email.trim(),
        role: values.role.trim(),
        subjects: values.subjects || [],
        password: values.password,
      });
      message.success("Teacher updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onOpenChange(false);
  };

  if (!teacher) return null;

  return (
    <Modal
      title="Edit Teacher"
      open={isOpen}
      onOk={handleSave}
      confirmLoading={confirmLoading}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleSave}
          className="!bg-primary hover:!bg-primary text-white"
        >
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {!isHOD && (
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="TEACHER">Teacher</Select.Option>
              <Select.Option value="HOD">HOD</Select.Option>
            </Select>
          </Form.Item>
        )}
        {isHOD && (
          <Form.Item name="role" initialValue="TEACHER" hidden>
            <Input type="hidden" />
          </Form.Item>
        )}

        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter teacher name" />
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ min: 6, message: "Password must be at least 6 characters" }]}
        >
          <Input.Password placeholder="Enter password (optional)" />
        </Form.Item>

        <Form.Item name="subjects" label="Subjects">
          <Checkbox.Group options={subjectOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
