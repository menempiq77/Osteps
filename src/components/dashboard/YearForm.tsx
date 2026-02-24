"use client";

import { useForm } from "react-hook-form";
import { Form, Input, Button, Select } from "antd";
import { useEffect } from "react";

interface YearFormValues {
  id?: number;
  name: string;
  school_id?: number;
  terms?: number;
  color?: string;
}

interface YearFormProps {
  onSubmit: (data: YearFormValues) => void;
  defaultValues?: YearFormValues | null;
}

export default function YearForm({ onSubmit, defaultValues }: YearFormProps) {
  const [form] = Form.useForm();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm<YearFormValues>();

  // Reset form when defaultValues changes (for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue({
        name: defaultValues.name || "",
        school_id: defaultValues.school_id,
        color: defaultValues.color || "green",
        ...(defaultValues.id && { id: defaultValues.id })
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        name: "",
        color: "green",
      });
    }
  }, [defaultValues, form]);

  const onFinish = (values: YearFormValues) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="bg-white space-y-4"
    >
      <Form.Item
        label="Year Name"
        name="name"
        rules={[{ required: true, message: 'Year name is required' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Card Color"
        name="color"
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

      <Form.Item>
        <Button type="primary" htmlType="submit" className="float-right !bg-primary !border-primary">
          {defaultValues?.id ? "Update Year" : "Create Year"}
        </Button>
      </Form.Item>
    </Form>
  );
}
