"use client";
import { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import type { SelectProps } from "antd";

interface Quiz {
  id: string | number;
  name: string;
}

interface EditAssessmentFormProps {
  onSubmit: (data: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
  }) => void;
  onCancel: () => void;
  initialData: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
  };
  quizzes: Quiz[];
}

export default function EditAssessmentForm({
  onSubmit,
  onCancel,
  initialData,
  quizzes,
}: EditAssessmentFormProps) {
  const [form] = Form.useForm();
  const [type, setType] = useState<"assessment" | "quiz">(initialData.type);
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const handleSubmit = (values: { name?: string; quiz?: string }) => {
    const submittedName = type === "quiz" ? selectedQuiz : values.name;
    if (!submittedName) {
      message.error("Please fill all required fields");
      return;
    }

    onSubmit({
      name: type === "quiz"
        ? quizzes.find((q) => String(q.id) === selectedQuiz)?.name || selectedQuiz
        : values.name || "",
      term_id: initialData.term_id,
      type,
    });
  };

  const quizOptions: SelectProps['options'] = quizzes.map((quiz) => ({
    value: String(quiz.id),
    label: quiz.name,
  }));

  const typeOptions: SelectProps['options'] = [
    { value: "assessment", label: "Assessment" },
    { value: "quiz", label: "Quiz" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
      initialValues={{
        name: initialData.name,
        type: initialData.type,
      }}
    >
      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please select a type" }]}
      >
        <Select
          options={typeOptions}
          onChange={(value: "assessment" | "quiz") => setType(value)}
        />
      </Form.Item>

      {type === "quiz" ? (
        <Form.Item
          label="Select Quiz"
          name="quiz"
          rules={[{ required: true, message: "Please select a quiz" }]}
        >
          <Select
            placeholder="Select a quiz"
            options={quizOptions}
            onChange={(value) => setSelectedQuiz(value)}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label="Assessment Name"
          name="name"
          rules={[{ required: true, message: "Please enter assessment name" }]}
        >
          <Input placeholder="Enter assessment name" />
        </Form.Item>
      )}

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" className="!bg-primary !text-white !border-none">
          Update Assessment
        </Button>
      </div>
    </Form>
  );
}