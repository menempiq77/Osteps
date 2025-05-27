"use client";
import { useEffect } from "react";
import { Button, Form, Input, Select } from "antd";

interface ClassFormValues {
  class_name: string;
  number_of_terms: string;
}

interface AddClassFormProps {
  onSubmit: (data: ClassFormValues) => void;
  initialData?: {
    id: string;
    class_name: string;
    year_id: number;
    number_of_terms: string;
  } | null;
  visible: boolean;
  onCancel: () => void;
}

export default function AddClassForm({
  onSubmit,
  initialData,
  visible,
  onCancel,
}: AddClassFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        class_name: initialData.class_name,
        number_of_terms: initialData.number_of_terms,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form form={form} layout="vertical">
      {/* Class Name */}
      <Form.Item
        name="class_name"
        label="Class Name"
        rules={[{ required: true, message: "Class name is required" }]}
      >
        <Input />
      </Form.Item>

      {/* Number of Terms */}
      <Form.Item
        name="number_of_terms"
        label="Number of Terms"
        rules={[{ required: true, message: "Please select number of terms" }]}
      >
        <Select placeholder="Select terms">
          <Select.Option value="two">Two Terms</Select.Option>
          <Select.Option value="three">Three Terms</Select.Option>
        </Select>
      </Form.Item>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleFormSubmit} className="!bg-primary !text-white !border-primary">
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </Form>
  );
}