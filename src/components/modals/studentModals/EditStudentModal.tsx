import { Modal, Form, Input, Select, Button } from "antd";
import { useEffect } from "react";

type Student = {
  id: number;
  student_name: string;
  user_name: string;
  email?: string;
  password: string;
  status: string;
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
      form?.setFieldsValue({
        student_name: student?.student_name,
        user_name: student?.user_name,
        email: student?.email,
        password: student?.password,
        status: student?.status,
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
          rules={[{ type: "email", message: "Please enter a valid email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input password!" }]}
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
      </Form>
    </Modal>
  );
};
