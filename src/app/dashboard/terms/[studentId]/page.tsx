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
import AssessmentDrawer from "@/components/ui/AssessmentDrawer";

const mockTerms = [
  {
    id: "1",
    name: "First Term",
    status: "completed",
    startDate: "Sep 1, 2023",
    endDate: "Dec 15, 2023",
    progress: 100,
    subjects: [
      "Memorisation",
      "Tafseer",
      "Extraction & Summarization",
      "Recitation",
      "Tajweed",
    ],
  },
  {
    id: "2",
    name: "Second Term",
    status: "in-progress",
    startDate: "Jan 10, 2024",
    endDate: "Apr 20, 2024",
    progress: 65,
    subjects: [
      "Memorisation",
      "Tafseer",
      "Extraction & Summarization",
      "Recitation",
      "Tajweed",
    ],
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

const mockSubjectTasks = {
  Memorisation: [
    {
      type: "pdf",
      name: "Quran Memorisation Guide",
      url: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      type: "video",
      name: "Surah Al-Fatiha Practice",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ],
  Tafseer: [
    {
      type: "pdf",
      name: "Tafseer Notes",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      type: "audio",
      name: "Tafseer Lecture",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
  ],
  "Extraction & Summarization": [],
  Recitation: [
    {
      type: "video",
      name: "Recitation Practice",
      url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    },
    {
      type: "audio",
      name: "Correct Pronunciation",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
  ],
  Tajweed: [
    {
      type: "pdf",
      name: "Tajweed Rules",
      url: "https://www.orimi.com/pdf-test.pdf",
    },
    {
      type: "audio",
      name: "Tajweed Practice",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ],
};

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
  const [expandedSubjectIndex, setExpandedSubjectIndex] = useState<
    number | null
  >(null);

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

  const renderTaskMedia = (task: { type: string; url: string; name: string }) => {
    switch (task.type) {
      case "pdf":
        return (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View PDF
          </a>
        );
      case "video":
        return (
          <div className="mt-2 w-full aspect-video">
            <video controls className="w-full h-full rounded-md border">
              <source src={task.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "audio":
        return (
          <div className="mt-2 w-full">
            <audio controls className="w-full">
              <source src={task.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download Resource
          </a>
        );
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <Link href="/dashboard/students">
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
            <li key={index} className="border-b last:border-none pb-4 mb-4">
              <div className="flex flex-col md:flex-row justify-between gap-2 items-center py-2">
                <span className="text-gray-700 font-medium">{subject}</span>
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <Button
                    type="primary"
                    onClick={() => handleOpenDrawer(subject)}
                  >
                    Mark Assessment
                  </Button>
                  <Button
                    type="default"
                    onClick={() =>
                      setExpandedSubjectIndex(
                        index === expandedSubjectIndex ? null : index
                      )
                    }
                  >
                    {index === expandedSubjectIndex
                      ? "Hide Tasks"
                      : "Show Tasks"}
                  </Button>
                </div>
              </div>

              {index === expandedSubjectIndex && (
                <div className="mt-4 bg-gray-100 rounded-lg p-4">
                  {mockSubjectTasks[subject as keyof typeof mockSubjectTasks]
                    ?.length ? (
                    <ul className="space-y-4">
                      {mockSubjectTasks[
                        subject as keyof typeof mockSubjectTasks
                      ]?.map((task, i) => (
                        <li key={i}>
                          <h5 className="text-md font-semibold">{task.name}</h5>
                          {renderTaskMedia(task)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 italic">
                      No tasks available for this subject.
                    </p>
                  )}
                </div>
              )}
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
      <AssessmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedSubject={selectedSubject}
        form={form}
        totalMarks={totalMarks}
        customFields={customFields}
        setCustomFields={setCustomFields}
        onFinish={onFinish}
        calculateTotal={calculateTotal}
      />
    </div>
  );
}