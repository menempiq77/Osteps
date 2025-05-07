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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";

const mockAssignments = [
  {
    id: "1",
    title: "Quran Memorization Assessment",
    description: "Memorize Surah Al-Fatiha with proper tajweed",
    dueDate: "2023-12-15",
    status: "submitted",
    grade: "A",
    feedback: "Excellent memorization and tajweed application",
    tasks: [
      {
        id: "1",
        name: "Memorisation",
        type: "audio",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        status: "completed",
        mark: "9/10",
        selfAssessment: 8,
        comment: "Well done with proper makharij",
      },
      {
        id: "2",
        name: "Tajweed Practice",
        type: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        status: "completed",
        selfAssessment: 7,
        mark: "8/10",
        comment: "Good understanding of basic rules",
      },
    ],
  },
  {
    id: "2",
    title: "Tafseer Assessment",
    description: "Write a summary of Surah Al-Ikhlas tafseer",
    dueDate: "2024-01-20",
    status: "in-progress",
    grade: null,
    feedback: null,
    tasks: [
      {
        id: "1",
        name: "Written Summary",
        type: "pdf",
        url: null,
        status: "in-progress",
        selfAssessment: null,
        mark: null,
        comment: null,
      },
      {
        id: "2",
        name: "Oral Presentation",
        type: "video",
        url: null,
        status: "not-started",
        selfAssessment: null,
        mark: null,
        comment: null,
      },
    ],
  },
  {
    id: "3",
    title: "Quran Recitation Assessment",
    description: "Record recitation of Surah Al-Kahf verses 1-10",
    dueDate: "2024-02-10",
    status: "not-started",
    grade: null,
    feedback: null,
    tasks: [
      {
        id: "1",
        name: "Recitation Recording",
        type: "audio",
        url: null,
        status: "not-started",
        selfAssessment: null,
        mark: null,
        comment: null,
      },
    ],
  },
  {
    id: "4",
    title: "Quran Recitation Assessment",
    description: "Record recitation of Surah Al-Kahf verses 1-10",
    dueDate: "2024-02-10",
    status: "pending",
    grade: null,
    feedback: null,
    tasks: [
      {
        id: "1",
        name: "Recitation Recording",
        type: "audio",
        url: null,
        status: "not-started",
        selfAssessment: null,
        mark: null,
        comment: null,
      },
    ],
  },
  {
    id: "5",
    title: "Quran Recitation Assessment",
    description: "Record recitation of Surah Al-Kahf verses 1-10",
    dueDate: "2024-02-10",
    status: "overdue",
    grade: null,
    feedback: null,
    tasks: [
      {
        id: "1",
        name: "Recitation Recording",
        type: "audio",
        url: null,
        status: "not-started",
        selfAssessment: null,
        mark: null,
        comment: null,
      },
    ],
  },
  {
    id: "6",
    title: "Quran Quiz - Surah Al-Fatiha",
    description: "Test your understanding of Surah Al-Fatiha",
    dueDate: "2024-02-10",
    status: "not-started",
    type: "quiz",
    grade: null,
    feedback: null,
    questions: [
      {
        id: "1",
        type: "mcq",
        question: "How many verses are in Surah Al-Fatiha?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
      },
      {
        id: "2",
        type: "short",
        question: "What is the meaning of 'Al-Fatiha'?",
        correctAnswer: "The Opening",
      },
    ],
  },
  {
    id: "7",
    title: "Tajweed Rules Quiz",
    description: "Test your knowledge of basic Tajweed rules",
    dueDate: "2024-03-15",
    status: "pending",
    type: "quiz",
    grade: null,
    feedback: null,
    questions: [
      {
        id: "1",
        type: "mcq",
        question: "What is the ruling of noon sakinah followed by a 'ya'?",
        options: ["Izhar", "Idgham", "Iqlab", "Ikhfa"],
        correctAnswer: "Ikhfa",
      },
      {
        id: "2",
        type: "checkbox",
        question: "Which of these are letters of Qalqalah?",
        options: ["ق", "ط", "ب", "ج", "د"],
        correctAnswer: "ق,ط,ب,ج,د",
      },
    ],
  },
];

export default function AssignmentsPage() {
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const router = useRouter();

  const getAssignmentStatus = (assignment: any) => {
    const today = new Date();
    const due = new Date(assignment.dueDate);

    if (assignment.status === "submitted") return "submitted";
    if (today > due) return "overdue";
    return assignment.status || "not-started";
  };

  const handleItemClick = (item: any) => {
    if (item.type === "quiz") {
      router.push(`/dashboard/students/assignments/${item.id}/quiz`);
    } else {
      router.push(`/dashboard/students/assignments/${item.id}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      submitted: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      "not-started": "bg-gray-100 text-gray-800",
      pending: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100"}`}
      >
        {status.replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button
            icon={<ChevronLeftIcon />}
            className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100"
          >
            Back to Dashboard
          </Button>
        </Link>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Term 1">Term 1</SelectItem>
            <SelectItem value="Term 2">Term 2</SelectItem>
            <SelectItem value="Term 3">Term 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Assessments</h1>

      {/* Updated grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAssignments.map((assignment) => {
          const status = getAssignmentStatus(assignment);
          return (
            <Card
              key={assignment.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full cursor-pointer"
              onClick={() => handleItemClick(assignment)}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start flex-grow">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      {getStatusBadge(status)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {assignment.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm text-gray-600">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {assignment.type === "quiz" ? "Quiz" : "Assignment"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="primary"
                    className="text-sm w-full md:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(assignment);
                    }}
                  >
                    {assignment.type === "quiz" ? "Take Quiz" : "View Details"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
}