"use client";
import { useEffect } from "react";
import { Button, Form, Input, Select } from "antd";

interface ClassFormValues {
  class_name: string;
  number_of_terms: string;
  color?: string;
}

interface AddClassFormProps {
  onSubmit: (data: ClassFormValues) => void;
  initialData?: {
    id: string;
    class_name: string;
    year_id: number;
    number_of_terms: string;
    color?: string;
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
        color: initialData.color || "green",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ color: "green" });
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
          <Select.Option value="first">One Term</Select.Option>
          <Select.Option value="two">Two Term</Select.Option>
          <Select.Option value="three">Three Term</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="color"
        label="Card Color"
        rules={[{ required: true, message: "Please choose a color" }]}
      >
        <Select>
          <Select.Option value="green">Green</Select.Option>
          <Select.Option value="yellow">Yellow</Select.Option>
          <Select.Option value="red">Red</Select.Option>
          <Select.Option value="blue">Blue</Select.Option>
          <Select.Option value="purple">Purple</Select.Option>
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
