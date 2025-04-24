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
import { useParams } from "next/navigation";
import AssignmentDrawer from "@/components/ui/AssignmentDrawer";

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
];

export default function AssignmentsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const handleOpenDrawer = (assignment: any, task: any) => {
    setSelectedAssignment({
      ...assignment,
      selectedTask: task,
    });
    setIsDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getAssignmentStatus = (assignment: any) => {
    const today = new Date();
    const due = new Date(assignment.dueDate);

    if (assignment.status === "submitted") return "submitted";
    if (today > due) return "overdue";
    return assignment.status || "not-started";
  };

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
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
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start flex-grow">
                <Link
                  href={`/dashboard/students/assignments/${assignment.id}`}
                  className="flex-1"
                >
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {assignment.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm text-gray-600">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </div>

              <div className="mt-4">
                <Link href={`/dashboard/students/assignments/${assignment.id}`}>
                  <Button type="primary" className="text-sm w-full md:w-auto">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>

    <AssignmentDrawer
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      selectedSubject={selectedAssignment?.title || ""}
      selectedTask={selectedAssignment?.selectedTask}
    />
  </div>
  );
}
