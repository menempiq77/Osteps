"use client";
import React, { useState } from "react";
import { Steps, Modal, Input, Button, Rate } from "antd";
import { Card } from "@radix-ui/themes";
import Link from "next/link";
import { ChevronLeftIcon, CalendarIcon } from "@radix-ui/react-icons";

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

export default function TermPage({ params }: { params: { studentId: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [marks, setMarks] = useState("");
  const [comments, setComments] = useState("");
  const [fairness, setFairness] = useState(3);

  const handleOpenModal = (subject: string) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
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

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <Link href="/students">
        <Button icon={<ChevronLeftIcon />} className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100">
          Back to Students
        </Button>
      </Link>

      {/* Ant Design Stepper */}
      <div className="py-6 mb-6">
        <Steps current={currentTermIndex} size="small">
          {mockTerms.map((term, index) => (
            <Steps.Step key={index} title={term.name} description={term.status} />
          ))}
        </Steps>
      </div>

      {/* Current Term Display */}
      <Card className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{mockTerms[currentTermIndex].name}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
          <CalendarIcon className="w-4 h-4" /> {mockTerms[currentTermIndex].startDate} - {mockTerms[currentTermIndex].endDate}
        </p>
        <h4 className="mt-3 font-medium text-gray-800">Subjects</h4>
        <ul className="mt-2">
          {mockTerms[currentTermIndex].subjects.map((subject, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b last:border-none">
              <span className="text-gray-700 font-medium">{subject}</span>
              <Button type="primary" onClick={() => handleOpenModal(subject)}>
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
        <Button disabled={currentTermIndex === mockTerms.length - 1} onClick={nextTerm}>
          Next Term
        </Button>
      </div>

      {/* Modal for Marking Assessments */}
      <Modal
        title={`Marking Assessment for ${selectedSubject}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          <Input placeholder="Enter marks" type="number" value={marks} onChange={(e) => setMarks(e.target.value)} className="p-2 border rounded" />
          <Input.TextArea placeholder="Enter comments" value={comments} onChange={(e) => setComments(e.target.value)} className="p-2 border rounded" rows={3} />
          <div className="flex items-center gap-2">
            <span>Fairness:</span>
            <Rate value={fairness} onChange={setFairness} />
          </div>
          <Button type="primary" block onClick={() => setIsModalOpen(false)}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}