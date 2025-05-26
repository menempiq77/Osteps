"use client";
import { Modal, Form, Input, Button, Checkbox, message } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { useEffect } from "react";

const subjectOptions = [
  { label: "Math", value: "Math" },
  { label: "Science", value: "Science" },
  { label: "English", value: "English" },
  { label: "History", value: "History" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
];

type Subject = typeof subjectOptions[number]["value"];

type TeacherBasic = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: Subject[];
};

export const EditTeacherModal = ({
  teacher,
  isOpen,
  onOpenChange,
  onSave,
}: {
  teacher: TeacherBasic | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: TeacherBasic) => void;
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      form.setFieldsValue({
        name: teacher.name,
        phone: teacher.phone,
        email: teacher.email,
        subjects: teacher.subjects,
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
        subjects: values.subjects || [],
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
        >
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please input the teacher name!" },
            { whitespace: true, message: "Name cannot be just whitespace" },
          ]}
        >
          <Input placeholder="Enter teacher name" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              pattern: /^[0-9+\- ]*$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="subjects" label="Subjects">
          <Checkbox.Group options={subjectOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};