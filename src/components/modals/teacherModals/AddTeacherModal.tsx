import { useState } from "react";
import { Modal, Form, Input, Button, Checkbox, message } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

const subjectOptions = [
  { label: "Math", value: "Math" },
  { label: "Science", value: "Science" },
  { label: "English", value: "English" },
  { label: "History", value: "History" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
];

type Subject = typeof subjectOptions[number]["value"];

interface TeacherFormValues {
  name: string;
  phone: string;
  email: string;
  subjects: Subject[];
}

interface AddTeacherModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddTeacher: (teacher: {
    name: string;
    phone: string;
    email: string;
    subjects: Subject[];
  }) => void;
  onClose?: () => void;
}

export const AddTeacherModal = ({
  isOpen,
  onOpenChange,
  onAddTeacher,
  onClose,
}: AddTeacherModalProps) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      onAddTeacher({
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
        email: values.email.trim(),
        subjects: values.subjects || [],
      });
      handleClose();
      message.success("Teacher added successfully");
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose?.();
    onOpenChange?.(false);
  };

  return (
    <Modal
      title="Add New Teacher"
      open={isOpen}
      onOk={handleOk}
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
          onClick={handleOk}
          className="!bg-primary hover:!bg-primary text-white"
        >
          Add Teacher
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Teacher Name"
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