"use client";
import { useState, useEffect } from "react";
import { Modal, Select, Button, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

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

export function EditTrackerModal({
  tracker: initialTracker,
  isOpen,
  onOpenChange,
  onSave,
}: {
  tracker: {
    id: string;
    name: string;
    type: string;
    status: string;
    progress: string[];
    deadline?: string | null;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tracker: {
    id: string;
    name: string;
    type: string;
    status: string;
    progress: string[];
    deadline?: string | null;
  }) => void;
}) {
  const [form] = Form.useForm();
  const [progressOptions, setProgressOptions] = useState<string[]>(initialTracker.progress);

  useEffect(() => {
    form.setFieldsValue({
      ...initialTracker,
      deadline: initialTracker.deadline ? dayjs(initialTracker.deadline) : null,
    });
    setProgressOptions(initialTracker.progress);
  }, [initialTracker, form]);

  const handleSubmit = (values: {
    name: string;
    type: string;
    status: string;
    progress: string[];
    deadline?: dayjs.Dayjs;
  }) => {
    onSave({
      ...initialTracker,
      name: values.name,
      type: "topic",
      status: "Active",
      progress: progressOptions,
      deadline: values.deadline ? values.deadline.format("YYYY-MM-DD") : null,
    });
  };

  const handleOptionsChange = (value: string[]) => {
    setProgressOptions(value);
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.resetFields();
    setProgressOptions(initialTracker.progress);
  };

  return (
    <Modal
      title="Edit Tracker"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          ...initialTracker,
          deadline: initialTracker.deadline ? dayjs(initialTracker.deadline) : null,
        }}
      >
        <Form.Item
          label="Tracker Name"
          name="name"
          rules={[{ required: true, message: 'Please input the tracker name!' }]}
        >
          <Input placeholder="Enter tracker name" />
        </Form.Item>

        <Form.Item
          label="Progress Options"
        >
          <Select
            mode="tags"
            allowClear
            placeholder="Select progress options"
            value={progressOptions}
            onChange={handleOptionsChange}
            options={trackerOptions}
          />
        </Form.Item>

        <Form.Item
          label="Deadline"
          name="deadline"
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <div className="flex justify-end space-x-3">
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="!bg-primary border:!bg-primary">
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
