import { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";

const subjectOptions = [{ label: "Islamiyat", value: "Islamiyat" }];

type Subject = (typeof subjectOptions)[number]["value"];

interface AddTeacherModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddTeacher: (teacher: {
    name: string;
    phone: string;
    email: string;
    subjects: Subject[];
    role: "Teacher" | "HOD";
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

      const subjects = [...(values.subjects || []), "Islamiyat"];

      onAddTeacher({
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
        email: values.email.trim(),
        subjects: subjects,
        role: values.role,
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
      title="Add New Teacher / HOD"
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
          Add Teacher / HOD
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
          initialValue="Teacher"
        >
          <Select>
            <Select.Option value="Teacher">Teacher</Select.Option>
            <Select.Option value="HOD">HOD</Select.Option>
          </Select>
        </Form.Item>

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
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              required: true,
              message: "Phone number is required",
            },
            {
              pattern: /^[0-9+\- ]*$/,
              message: "Please enter a valid phone number",
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const digits = value.replace(/\D/g, "");
                if (digits.length < 6 || digits.length > 12) {
                  return Promise.reject(
                    new Error("Phone number must be between 6 and 12 digits")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        {/* <Form.Item name="subjects" label="Subjects">
          <Checkbox.Group options={subjectOptions} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
