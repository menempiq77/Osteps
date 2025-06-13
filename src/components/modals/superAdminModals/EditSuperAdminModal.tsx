"use client";
import { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import type { SuperAdminBasic } from "./types"; // Assuming you have a types file

export const EditSuperAdminModal = ({
  admin,
  isOpen,
  onOpenChange,
  onSave,
}: {
  admin: SuperAdminBasic | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (admin: SuperAdminBasic) => void;
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      form.setFieldsValue({
        name: admin.name,
        email: admin.email,
        password: admin.password || '',
      });
    }
  }, [admin, form]);

  const handleSave = async () => {
    if (!admin) return;

    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      
      onSave({
        ...admin,
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      });
      
      onOpenChange(false);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onOpenChange(false);
  };

  if (!admin) return null;

  return (
    <Modal
      title="Edit Admin"
      open={isOpen}
      onOk={handleSave}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSave}
          className="!bg-primary !border-primary hover:!bg-primary/90 !text-white"
          loading={confirmLoading}
        >
          Save Changes
        </Button>,
      ]}
      width={450}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter admin name' },
            { whitespace: true, message: 'Name cannot be empty' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
            { whitespace: true, message: 'Email cannot be empty' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter password' },
            { whitespace: true, message: 'Password cannot be empty' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};