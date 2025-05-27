"use client";
import { Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";

interface GradeFormValues {
  gradeName: string;
  minMark: number;
  maxMark: number;
  description?: string;
}

interface GradeFormProps {
  onSubmit: (data: GradeFormValues) => void;
  defaultValues?: GradeFormValues | null;
  isOpen: boolean;
}

export default function GradeForm({ onSubmit, defaultValues, isOpen }: GradeFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(defaultValues || {
        gradeName: "",
        minMark: 0,
        maxMark: 100,
        description: "",
      });
    }
  }, [defaultValues, isOpen, form]);

  const handleFinish = (values: GradeFormValues) => {
    onSubmit(values);
    form.resetFields();
  };

  const validateGradeLetter = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Grade letter is required"));
    }
    if (!/^[A-Za-z]+$/.test(value)) {
      return Promise.reject(new Error("Grade letter should contain only letters"));
    }
    return Promise.resolve();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Grade Letter (e.g., A, B, C)"
        name="gradeName"
        rules={[
          { validator: validateGradeLetter }
        ]}
      >
        <Input 
          placeholder="A" 
          // Prevent typing numbers
          onKeyPress={(e) => {
            if (!/[A-Za-z]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          // Prevent paste with numbers
          onPaste={(e) => {
            const text = e.clipboardData.getData('text');
            if (!/^[A-Za-z]+$/.test(text)) {
              e.preventDefault();
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="Minimum Percentage"
        name="minMark"
        rules={[
          { required: true, message: "Minimum mark is required" },
          { type: "number", min: 0, max: 100, message: "Value must be between 0 and 100" }
        ]}
      >
        <InputNumber 
          placeholder="0" 
          min={0} 
          max={100} 
          style={{ width: '100%' }} 
          // Prevent typing letters
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="Maximum Percentage"
        name="maxMark"
        rules={[
          { required: true, message: "Maximum mark is required" },
          { type: "number", min: 0, max: 100, message: "Value must be between 0 and 100" }
        ]}
      >
        <InputNumber 
          placeholder="100" 
          min={0} 
          max={100} 
          style={{ width: '100%' }} 
          // Prevent typing letters
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="Description (Optional)"
        name="description"
      >
        <Input placeholder="e.g., Excellent, Good, etc." />
      </Form.Item>

      <Form.Item className="flex justify-end">
        <Button type="primary" htmlType="submit" className="!bg-primary !text-white">
          {defaultValues ? "Update Grade" : "Add Grade"}
        </Button>
      </Form.Item>
    </Form>
  );
}