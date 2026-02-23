"use client";
import React from "react";
import { Modal, Form, Input, Select, Tag, InputNumber } from "antd";
import { BehaviorType } from "./types";

interface BehaviorTypeModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: any;
  editingType: { id: string; name: string; points: number; color: string } | null;
  colorOptions: { value: string; label: string }[];
}

const BehaviorTypeModal: React.FC<BehaviorTypeModalProps> = ({
  visible,
  onCancel,
  onOk,
  form,
  editingType,
  colorOptions,
}) => {
  return (
    <Modal
      title={editingType ? "Edit Behavior Type" : "Add New Behavior Type"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Behavior Name"
          rules={[
            {
              required: true,
              message: "Please enter a name for this behavior",
            },
          ]}
        >
          <Input placeholder="e.g., Homework Completed" />
        </Form.Item>
        <Form.Item
          name="points"
          label="Points"
          rules={[{ required: true, message: "Please enter point value" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="e.g., 3 or -2"
          />
        </Form.Item>
        <Form.Item
          name="color"
          label="Tag Color"
          rules={[{ required: true, message: "Please select a color" }]}
        >
          <Select placeholder="Select a color">
            {colorOptions.map((color) => (
              <Select.Option key={color.value} value={color.value}>
                <Tag color={color.value}>{color.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BehaviorTypeModal;