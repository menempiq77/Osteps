import { Modal, Form, Input, Select, Button } from "antd";

type AddStudentModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
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
      onOk({ ...values, class_id: classId });
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
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email (Optional)"
          rules={[
            { type: "email", message: "Please enter a valid email!" },
            { required: false },
          ]}
        >
          <Input  />
        </Form.Item>

         <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input password!" }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="status"
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
      </Form>
    </Modal>
  );
};
