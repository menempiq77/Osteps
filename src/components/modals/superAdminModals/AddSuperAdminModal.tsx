"use client";
import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

interface AddSuperAdminModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddSuperAdmin: (admin: {
    name: string;
    email: string;
    password: string;
  }) => void;
  onClose?: () => void;
}

export const AddSuperAdminModal = ({
  isOpen,
  onOpenChange,
  onAddSuperAdmin,
  onClose,
}: AddSuperAdminModalProps) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      
      onAddSuperAdmin({ 
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      });
      
      handleClose();
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
      title="Add New Sub Admin"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={confirmLoading}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          className="!bg-primary !border-primary hover:!bg-primary/90 !text-white"
        >
          Add Admin
        </Button>,
      ]}
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
          <Input placeholder="Enter admin name" />
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
          <Input placeholder="Enter email" />
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