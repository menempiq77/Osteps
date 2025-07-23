"use client";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useEffect, useState } from "react";

const subjectOptions = [{ label: "Islamiyat", value: "Islamiyat" }];

type Subject = (typeof subjectOptions)[number]["value"];

type TeacherBasic = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
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
        role: teacher.role,
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

      const subjects = [...(values.subjects || []), "Islamiyat"];
      onSave({
        ...teacher,
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
        email: values.email.trim(),
        role: values.role.trim(),
        subjects: subjects,
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

        {/* <Form.Item name="subjects" label="Subjects">
          <Checkbox.Group options={subjectOptions} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
