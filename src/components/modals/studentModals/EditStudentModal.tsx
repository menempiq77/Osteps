import { Modal, Form, Input, Select, Button } from "antd";
import { useEffect } from "react";

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
};

type EditStudentModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  student: Student | null;
};

export const EditStudentModal = ({
  open,
  onCancel,
  onOk,
  student,
}: EditStudentModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (student) {
      // Get current gender from any available field
      const currentGender = 
        student?.gender || 
        student?.student_gender || 
        (student as any)?.sex || 
        (student as any)?.student_sex;
      
      form?.setFieldsValue({
        student_name: student?.student_name,
        user_name: student?.user_name,
        email: student?.email,
        password: "",
        status: student?.status,
        // Pre-fill current gender if it exists
        gender: currentGender ? String(currentGender).toLowerCase() : undefined,
        nationality: (student as any)?.nationality || undefined,
        class_id: student?.class_id,
      });
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
      title="Edit Student"
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
          label="Email (Optional)"
          rules={[
            { type: "email", message: "Please enter a valid email!" },
            { required: false },
          ]}
        >
          <Input />
        </Form.Item>

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
          label="Gender (Optional)"
          extra="Leave empty to keep current gender."
        >
          <Select placeholder="Select gender" allowClear>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="nationality"
          label="Nationality (Optional)"
          extra="Leave empty to keep current nationality."
        >
          <Input placeholder="e.g., British, American" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
