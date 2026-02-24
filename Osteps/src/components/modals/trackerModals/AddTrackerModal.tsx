"use client";
import { useState } from "react";
import { Modal, Select, Button, Form, Input, Checkbox, DatePicker } from "antd";
import dayjs from "dayjs";

const normalizeProgressOption = (value: string) =>
  value
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

const trackerOptions = [
  { value: "RECITATION", label: "RECITATION" },
  { value: "MEMORIZATION", label: "MEMORIZATION" },
  { value: "TAFSIR", label: "TAFSIR" },
  { value: "STUDIED", label: "STUDIED" },
  { value: "RECALL", label: "RECALL" },
];

export function AddTrackerModal({
  isOpen,
  onOpenChange,
  onAddTracker,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTracker: (tracker: {
    name: string;
    type: string;
    status: string;
    progress: string[];
    claim_certificate: boolean;
    deadline?: string | null;
  }) => void;
}) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onAddTracker({
      name: values.name,
      type: values.type || "",
      status: values.status || "",
      progress: (values.progress || [])
        .map((option: string) => normalizeProgressOption(option))
        .filter(Boolean),
      claim_certificate: values.claim_certificate || false,
      deadline: values.deadline ? dayjs(values.deadline).format("YYYY-MM-DD") : null,
    });
    form.resetFields();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Tracker"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ progress: [] }}
      >
        <Form.Item
          label="Tracker Name"
          name="name"
          rules={[
            { required: true, message: "Please input the tracker name!" },
          ]}
        >
          <Input placeholder="Enter tracker name" />
        </Form.Item>

        <Form.Item label="Progress Options" name="progress">
          <Select
            mode="tags"
            allowClear
            placeholder="Select progress options"
            options={trackerOptions}
          />
        </Form.Item>

        <Form.Item label="Deadline" name="deadline">
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="claim_certificate" valuePropName="checked">
          <Checkbox>Manual Certificate</Checkbox>
        </Form.Item>

        <div className="flex justify-end space-x-3">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-primary border:!bg-primary"
          >
            Add Tracker
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
