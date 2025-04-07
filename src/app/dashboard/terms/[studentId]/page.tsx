"use client";
import React, { useState } from "react";
import { Steps, Drawer, Input, Button, Form, InputNumber, Space } from "antd";
import { Card } from "@radix-ui/themes";
import Link from "next/link";
import {
  ChevronLeftIcon,
  CalendarIcon,
  PlusIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { useParams } from "next/navigation";

const mockTerms = [
  {
    id: "1",
    name: "First Term",
    status: "completed",
    startDate: "Sep 1, 2023",
    endDate: "Dec 15, 2023",
    progress: 100,
    subjects: ["Math", "Science", "English"],
  },
  {
    id: "2",
    name: "Second Term",
    status: "in-progress",
    startDate: "Jan 10, 2024",
    endDate: "Apr 20, 2024",
    progress: 65,
    subjects: ["Math", "History", "Biology"],
  },
  {
    id: "3",
    name: "Third Term",
    status: "upcoming",
    startDate: "May 5, 2024",
    endDate: "Aug 15, 2024",
    progress: 0,
    subjects: [],
  },
];

const mockAssessments = [
  {
    id: "1",
    studentId: "1",
    termId: "1",
    subject: "Math",
    writtenTest: 35,
    viva: 18,
    assignment: 12,
    project: 14,
    attendance: 8,
    customFields: [{ id: "c1", name: "Quiz", max: 10, value: 8 }],
    total: 95,
    comments: "Good performance overall",
    lastUpdated: "2023-12-10T10:30:00Z",
  },
  {
    id: "2",
    studentId: "2",
    termId: "1",
    subject: "Science",
    writtenTest: 28,
    viva: 15,
    assignment: 10,
    project: 12,
    attendance: 9,
    customFields: [{ id: "c1", name: "Quiz", max: 10, value: 8 }],
    total: 74,
    comments: "Needs improvement in practicals",
    lastUpdated: "2023-12-12T14:15:00Z",
  },
  {
    id: "3",
    studentId: "3",
    termId: "2",
    subject: "Math",
    writtenTest: 32,
    viva: 16,
    assignment: 13,
    project: 12,
    attendance: 7,
    customFields: [
      { id: "c1", name: "Quiz", max: 10, value: 7 },
      { id: "c2", name: "Participation", max: 5, value: 4 },
    ],
    total: 84,
    comments: "Consistent performance",
    lastUpdated: "2024-02-20T09:45:00Z",
  },
];

export default function TermPage() {
  const { studentId } = useParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [form] = Form.useForm();
  const [totalMarks, setTotalMarks] = useState(0);
  const [customFields, setCustomFields] = useState<
    { id: string; name: string; max: number }[]
  >([]);

  const handleOpenDrawer = (subject: string) => {
    setSelectedSubject(subject);
    setIsDrawerOpen(true);

    const termId = mockTerms[currentTermIndex].id;

    const assessmentData = mockAssessments.find(
      (a) =>
        a.termId === termId &&
        a.subject === subject &&
        a.studentId === studentId
    );
    console.log("Fetched assessment:", assessmentData);

    form.resetFields();
    setTotalMarks(0);
    setCustomFields([]);

    if (assessmentData) {
      const {
        writtenTest,
        viva,
        assignment,
        project,
        attendance,
        total,
        comments,
        customFields: custom,
      } = assessmentData;

      const formData: any = {
        writtenTest,
        viva,
        assignment,
        project,
        attendance,
        total,
        comments,
      };

      if (custom?.length) {
        const customFieldsFormatted = custom.map((field) => ({
          id: field.id,
          name: field.name,
          max: field.max,
          finalized: true,
        }));
        setCustomFields(customFieldsFormatted);

        custom.forEach((field) => {
          formData[`custom-${field.id}`] = field.value; // Pre-fill custom field value
        });
      }

      form.setFieldsValue(formData);
      setTotalMarks(total);
    }
  };

  const nextTerm = () => {
    if (currentTermIndex < mockTerms.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1);
    }
  };

  const prevTerm = () => {
    if (currentTermIndex > 0) {
      setCurrentTermIndex(currentTermIndex - 1);
    }
  };

  const calculateTotal = () => {
    const values = form.getFieldsValue();
    let total = 0;

    // Standard fields
    total += values.writtenTest || 0;
    total += values.viva || 0;
    total += values.assignment || 0;
    total += values.project || 0;
    total += values.attendance || 0;

    // Custom fields
    customFields.forEach((field) => {
      total += values[`custom-${field.id}`] || 0;
    });

    setTotalMarks(total);
    form.setFieldsValue({ total });
  };

  const onFinish = (values: any) => {
    console.log("Submitted values:", values);
    setIsDrawerOpen(false);
  };

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
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <Link href="/students">
        <Button
          icon={<ChevronLeftIcon />}
          className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100"
        >
          Back to Students
        </Button>
      </Link>

      {/* Ant Design Stepper */}
      <div className="py-6 mb-6">
        <Steps current={currentTermIndex} size="small">
          {mockTerms.map((term, index) => (
            <Steps.Step
              key={index}
              title={term.name}
              description={term.status}
            />
          ))}
        </Steps>
      </div>

      {/* Current Term Display */}
      <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {mockTerms[currentTermIndex].name}
        </h3>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
          <CalendarIcon className="w-4 h-4" />{" "}
          {mockTerms[currentTermIndex].startDate} -{" "}
          {mockTerms[currentTermIndex].endDate}
        </p>
        <h4 className="mt-3 font-medium text-gray-800">Subjects</h4>
        <ul className="mt-2">
          {mockTerms[currentTermIndex].subjects.map((subject, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 border-b last:border-none"
            >
              <span className="text-gray-700 font-medium">{subject}</span>
              <Button type="primary" onClick={() => handleOpenDrawer(subject)}>
                Mark Assessment
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button disabled={currentTermIndex === 0} onClick={prevTerm}>
          Previous Term
        </Button>
        <Button
          disabled={currentTermIndex === mockTerms.length - 1}
          onClick={nextTerm}
        >
          Next Term
        </Button>
      </div>

      {/* Drawer for Marking Assessments */}
      <Drawer
        title={`Marking Assessment for ${selectedSubject}`}
        placement="right"
        width={620}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setIsDrawerOpen(false)}
              style={{ marginRight: 8 }}
            >
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
                      onChange={(val) =>
                        updateCustomFieldMax(field.id, val || 10)
                      }
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
              <InputNumber
                value={totalMarks}
                style={{ width: "100%" }}
                disabled
              />
            </Form.Item>
          </div>

          <Form.Item label="Comments" name="comments">
            <Input.TextArea rows={3} placeholder="Additional comments" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
