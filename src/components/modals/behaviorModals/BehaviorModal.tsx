"use client";
import React from "react";
import { Modal, Form, Input, Select, Tag } from "antd";

interface BehaviorType {
  id: string | number;
  name: string;
  color: string;
  points: number;
}

interface BehaviorModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  studentName: string;
  behaviorTypes: BehaviorType[];
  form: any;
  isEditing: boolean;
  confirmLoading?: boolean;
}

const BehaviorModal: React.FC<BehaviorModalProps> = ({
  visible,
  onCancel,
  onOk,
  studentName,
  behaviorTypes,
  form,
  confirmLoading = false,
}) => {
  return (
    <Modal
      title={`Add Behavior Record for ${studentName}`}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="Behavior Type"
          rules={[{ required: true, message: "Please select a behavior type" }]}
        >
          <Select placeholder="Select behavior type">
            {behaviorTypes.map((type) => (
              <Select.Option key={type.id} value={type.id}>
                <Tag color={type.color}>{type.name}</Tag> (
                {type.points > 0 ? "+" : ""}
                {type.points} points)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Describe the behavior in detail..."
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          initialValue={new Date().toISOString().split("T")[0]}
        >
          <Input type="date" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BehaviorModal;
