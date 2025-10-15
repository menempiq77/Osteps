"use client";
import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

interface SubjectFormProps {
  onSubmit: (data: { name: string; }) => void;
  defaultValues?: { name: string; } | null;
  isOpen: boolean;
}

export default function SubjectForm({ onSubmit, defaultValues, isOpen }: SubjectFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (defaultValues) form.setFieldsValue(defaultValues);
    else form.resetFields();
  }, [defaultValues, isOpen]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        label="Subject Name"
        name="name"
        rules={[{ required: true, message: "Please enter subject name" }]}
      >
        <Input placeholder="e.g. Mathematics" />
      </Form.Item>

      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit" className="!bg-primary">
          Save Subject
        </Button>
      </Form.Item>
    </Form>
  );
}
