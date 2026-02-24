"use client";
import { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import type { SelectProps } from "antd";

interface Quiz {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface AddAssessmentFormProps {
  onSubmit: (data: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
  }) => void;
  isQuiz?: boolean;
  termId: string;
  quizzes: Quiz[];
}

export default function AddAssessmentForm({
  onSubmit,
  isQuiz = false,
  termId,
  quizzes,
}: AddAssessmentFormProps) {
  const [form] = Form.useForm();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");

  const handleSubmit = (values: { name?: string; quiz?: string }) => {
    if (isQuiz && !selectedQuiz) {
      message.error("Please select a quiz");
      return;
    }

    if (!isQuiz && !values.name) {
      message.error("Please enter assessment name");
      return;
    }

    onSubmit({
      name: isQuiz ? selectedQuiz : values.name || "",
      term_id: termId,
      type: isQuiz ? "quiz" : "assessment",
    });
    form.resetFields();
    setSelectedQuiz("");
  };

  const quizOptions: SelectProps['options'] = quizzes.map((quiz) => ({
    value: String(quiz.id),
    label: quiz.name,
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="space-y-4"
    >
      <Form.Item
        label={isQuiz ? "Select Quiz" : "Assessment Name"}
        name={isQuiz ? "quiz" : "name"}
        rules={[{ required: true, message: "This field is required" }]}
      >
        {isQuiz ? (
          <Select
            placeholder="Select a quiz"
            options={quizOptions}
            value={selectedQuiz}
            onChange={(value) => setSelectedQuiz(value)}
          />
        ) : (
          <Input placeholder="Enter assessment name" />
        )}
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button
          type="default"
          onClick={() => {
            form.resetFields();
            setSelectedQuiz("");
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isQuiz && !selectedQuiz}
          className="!bg-primary !text-white !border-none"
        >
          {isQuiz ? "Assign Quiz" : "Add Assessment"}
        </Button>
      </div>
    </Form>
  );
}