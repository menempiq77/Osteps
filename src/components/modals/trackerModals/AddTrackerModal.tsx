"use client";
import { useState } from "react";
import { Modal, Select, Button, Form, Input, Checkbox } from "antd";

const trackerOptions = [
  { value: "recitation", label: "Recitation" },
  { value: "memorization", label: "Memorization" },
  { value: "tafsir", label: "Tafsir" },
  { value: "studied", label: "Studied" },
  { value: "recall", label: "Recall" },
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
  }) => void;
}) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onAddTracker({
      name: values.name,
      type: values.type || "",
      status: values.status || "",
      progress: values.progress || [],
      claim_certificate: values.claim_certificate || false,
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
