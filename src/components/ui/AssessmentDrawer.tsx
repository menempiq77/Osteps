"use client";
import React, { useState } from "react";
import { Drawer, Input, Form, InputNumber, Button } from "antd";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";

interface CustomField {
  id: string;
  name: string;
  max: number;
  finalized: boolean;
}

interface AssessmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: string;
  form: any;
  totalMarks: number;
  customFields: CustomField[];
  setCustomFields: (fields: CustomField[]) => void;
  onFinish: (values: any) => void;
  calculateTotal: () => void;
}

export default function AssessmentDrawer({
  isOpen,
  onClose,
  selectedSubject,
  form,
  totalMarks,
  customFields,
  setCustomFields,
  onFinish,
  calculateTotal,
}: AssessmentDrawerProps) {
  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      name: "",
      max: 10,
      finalized: false,
    };
    setCustomFields([...customFields, newField]);
  };

  const finalizeCustomField = (id: string) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, finalized: true } : field
      )
    );
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
    form.setFieldsValue({ [`custom-${id}`]: undefined });
    calculateTotal();
  };

  const updateCustomFieldName = (id: string, newName: string) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, name: newName } : field
      )
    );
  };

  const updateCustomFieldMax = (id: string, newMax: number) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, max: newMax } : field
      )
    );
    const currentValue = form.getFieldValue(`custom-${id}`);
    if (currentValue > newMax) {
      form.setFieldsValue({ [`custom-${id}`]: newMax });
    }
    calculateTotal();
  };

  return (
    <Drawer
      title={`Marking Assessment for ${selectedSubject}`}
      placement="right"
      width={620}
      onClose={onClose}
      open={isOpen}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={calculateTotal}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Standard Fields */}
          <Form.Item label="Written Test (Max: 40)" name="writtenTest">
            <InputNumber
              min={0}
              max={40}
              style={{ width: "100%" }}
              placeholder="Enter marks"
            />
          </Form.Item>

          <Form.Item label="Viva (Max: 20)" name="viva">
            <InputNumber
              min={0}
              max={20}
              style={{ width: "100%" }}
              placeholder="Enter marks"
            />
          </Form.Item>

          <Form.Item label="Assignment (Max: 15)" name="assignment">
            <InputNumber
              min={0}
              max={15}
              style={{ width: "100%" }}
              placeholder="Enter marks"
            />
          </Form.Item>

          <Form.Item label="Project (Max: 15)" name="project">
            <InputNumber
              min={0}
              max={15}
              style={{ width: "100%" }}
              placeholder="Enter marks"
            />
          </Form.Item>

          <Form.Item label="Attendance (Max: 10)" name="attendance">
            <InputNumber
              min={0}
              max={10}
              style={{ width: "100%" }}
              placeholder="Enter marks"
            />
          </Form.Item>

          {customFields?.map((field) =>
            field.finalized ? (
              <Form.Item
                label={`${field.name} (Max: ${field.max})`}
                name={`custom-${field.id}`}
                className="p-0"
                key={field.id}
              >
                <div className="flex items-center gap-2">
                  <InputNumber
                    min={0}
                    max={field.max}
                    style={{ width: "100%" }}
                    placeholder="Enter marks"
                    value={form.getFieldValue(`custom-${field.id}`)}
                    onChange={(value) =>
                      form.setFieldsValue({ [`custom-${field.id}`]: value })
                    }
                  />
                  <Button
                    color="danger"
                    variant="filled"
                    onClick={() => removeCustomField(field.id)}
                  >
                    <Cross2Icon className="" />
                  </Button>
                </div>
              </Form.Item>
            ) : (
              <div key={field.id} className="flex items-center gap-3 mb-4">
                <Form.Item label="Label" className="m-0 w-1/2">
                  <Input
                    value={field.name}
                    onChange={(e) =>
                      updateCustomFieldName(field.id, e.target.value)
                    }
                    placeholder="Field name"
                  />
                </Form.Item>
                <Form.Item label="Max" className="m-0 w-1/4">
                  <InputNumber
                    min={1}
                    max={100}
                    value={field.max}
                    onChange={(val) => updateCustomFieldMax(field.id, val || 10)}
                    placeholder="Max"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={() => finalizeCustomField(field.id)}
                  disabled={!field.name.trim()}
                  className="mb-1"
                >
                  Add
                </Button>
              </div>
            )
          )}

          {/* Add Custom Field Button */}
          <div className="col-span-2">
            <Button
              type="dashed"
              onClick={addCustomField}
              block
              icon={<PlusIcon />}
            >
              Add Custom Field
            </Button>
          </div>

          {/* Total Marks */}
          <Form.Item label="Total Marks" name="total" className="col-span-2">
            <InputNumber value={totalMarks} style={{ width: "100%" }} disabled />
          </Form.Item>
        </div>

        <Form.Item label="Comments" name="comments">
          <Input.TextArea rows={3} placeholder="Additional comments" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}