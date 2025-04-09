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
    title: "Quran Memorization Assignment",
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
        comment: "Well done with proper makharij",
      },
      {
        id: "2",
        name: "Tajweed Practice",
        type: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        status: "completed",
        mark: "8/10",
        comment: "Good understanding of basic rules",
      },
    ],
  },
  {
    id: "2",
    title: "Tafseer Assignment",
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
        mark: null,
        comment: null,
      },
      {
        id: "2",
        name: "Oral Presentation",
        type: "video",
        url: null,
        status: "not-started",
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
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<
    string | null
  >(null);

  const handleOpenDrawer = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsDrawerOpen(true);
  };

  const toggleAssignmentExpand = (assignmentId: string) => {
    setExpandedAssignmentId(
      expandedAssignmentId === assignmentId ? null : assignmentId
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Assignments</h1>

      <div className="space-y-4">
        {mockAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {assignment.description}
                </p>
                <div className="flex items-center mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm text-gray-600">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                  assignment.status
                )}`}
              >
                {assignment.status.replace("-", " ")}
              </span>
            </div>

            <div className="mt-4">
              <Button
                type="primary"
                onClick={() => toggleAssignmentExpand(assignment.id)}
                className="text-sm"
              >
                {expandedAssignmentId === assignment.id
                  ? "Hide Details"
                  : "View Details"}
              </Button>

              {expandedAssignmentId === assignment.id && (
                <div className="mt-4 space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Tasks</h4>
                    <div className="space-y-3">
                      {assignment.tasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{task.name}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              {task.type}
                            </span>
                          </div>

                          {task.mark && (
                            <div className="mt-1 text-sm">
                              <span className="font-medium">Grade: </span>
                              <span>{task.mark}</span>
                            </div>
                          )}

                          {task.comment && (
                            <div className="mt-1 text-sm">
                              <span className="font-medium">Feedback: </span>
                              <span>{task.comment}</span>
                            </div>
                          )}

                          <div className="mt-2 flex justify-end">
                            <Button
                              size="small"
                              onClick={() =>
                                handleOpenDrawer({
                                  ...assignment,
                                  selectedTask: task,
                                })
                              }
                            >
                              {task.status === "completed"
                                ? "View Submission"
                                : "Submit Work"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {assignment.grade && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-800">
                        Overall Grade
                      </h4>
                      <p className="text-lg font-semibold">
                        {assignment.grade}
                      </p>
                      {assignment.feedback && (
                        <>
                          <h4 className="font-medium text-gray-800 mt-2">
                            Feedback
                          </h4>
                          <p>{assignment.feedback}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
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
