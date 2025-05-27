"use client";
import { useState } from "react";
import { Modal, Select, Button, Form, Input } from "antd";
import { Cross2Icon } from "@radix-ui/react-icons";

const trackerOptions = [
  { value: "recitation", label: "Recitation" },
  { value: "memorization", label: "Memorization" },
  { value: "tafsir", label: "Tafsir" },
  { value: "studied", label: "Studied" },
  { value: "recall", label: "Recall" },
];

const typeOptions = [
  { value: "topic", label: "Topic" },
  { value: "chapter", label: "Chapter" },
  { value: "verse", label: "Verse" },
  { value: "hadith", label: "Hadith" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Paused", label: "Paused" },
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
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
  }) => void;
}) {
  const [form] = Form.useForm();
  const [progressOptions, setProgressOptions] = useState<string[]>([]);

  const handleSubmit = (values: {
    name: string;
    type: string;
    status: string;
    progress: string[];
  }) => {
    onAddTracker(values);
    form.resetFields();
    setProgressOptions([]);
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.resetFields();
    setProgressOptions([]);
  };

  return (
    <Modal
      title="Add New Tracker"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      closeIcon={<Cross2Icon className="h-4 w-4" />}
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
          rules={[{ required: true, message: 'Please input the tracker name!' }]}
        >
          <Input placeholder="Enter tracker name" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select the type!' }]}
        >
          <Select placeholder="Select type">
            {typeOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select the status!' }]}
        >
          <Select placeholder="Select status">
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Progress Options"
          name="progress"
        >
          <Select
            mode="tags"
            allowClear
            placeholder="Select progress options"
            options={trackerOptions}
          />
        </Form.Item>

        <div className="flex justify-end space-x-3">
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="!bg-primary border:!bg-primary">
            Add Tracker
          </Button>
        </div>
      </Form>
    </Modal>
  );
}