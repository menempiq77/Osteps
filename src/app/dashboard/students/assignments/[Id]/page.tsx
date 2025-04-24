"use client";
import React from "react";
import { Button, Card } from "@radix-ui/themes";
import Link from "next/link";
import { ChevronLeftIcon, CalendarIcon } from "@radix-ui/react-icons";
import { notFound, useParams, useRouter } from "next/navigation";
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
        dueDate: "2023-12-15",
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
        dueDate: "2023-12-15",
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
        dueDate: "2024-01-20",
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
        dueDate: "2024-01-20",
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
        dueDate: "2024-01-20",
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
        dueDate: "2024-01-20",
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
        dueDate: "2024-01-20",
        selfAssessment: null,
        mark: null,
        comment: null,
      },
    ],
  },
];

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  console.log("Current params:", params);

  const assignmentId = params.Id as string;
  const assignment = mockAssignments.find((a) => a.id === assignmentId);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);

  const handleOpenDrawer = (task: any) => {
    setSelectedTask(task);
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

  if (!assignment) {
    return (
      <div className="p-6">
        <h1>Assignment Not Found</h1>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <Link href="/dashboard/students/assignments/">
        <Button className="mb-6 text-gray-700 flex items-center gap-2 hover:text-gray-800 cursor-pointer">
          <ChevronLeftIcon /> <span>Back to Assesments</span>
        </Button>
      </Link>

      <Card className="p-6 bg-white rounded-xl shadow-md mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {assignment.title}
            </h1>
            <p className="text-md text-gray-600 mb-4">
              {assignment.description}
            </p>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span className="text-sm text-gray-600">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>

        {assignment.tasks.map((task) => (
          <Card key={task.id} className="p-4 relative bg-white rounded-lg shadow-sm">
            <div className="mb-3 ">
              <h3 className="font-medium text-lg">{task.name}</h3>
              <div className="flex items-center mb-2">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span className="text-sm text-gray-600">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
              <span
                className={`px-2 py-1 text-xs rounded-full absolute right-4 top-4 ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status?.replace("-", " ") || "Not Started"}
              </span>
              <span className="text-xs font-medium">
                Type: <span className="font-normal">{task.type}</span>
              </span>
            </div>

            {task.mark && (
              <div className="mt-1 text-sm mb-2">
                <span className="font-medium">Grade: </span>
                <span>{task.mark}</span>
              </div>
            )}

            {task.comment && (
              <div className="mt-1 text-sm mb-2">
                <span className="font-medium">Feedback: </span>
                <span>{task.comment}</span>
              </div>
            )}

            <div className="mt-3">
              <Button
                variant="surface"
                className="border px-3 py-1 rounded-md cursor-pointer"
                onClick={() => handleOpenDrawer(task)}
              >
                {task.status === "completed"
                  ? "View Submission"
                  : "Submit Work"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {assignment.grade && (
        <Card className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="font-medium text-lg mb-2">Overall Grade</h2>
          <p className="text-xl font-semibold mb-3">{assignment.grade}</p>
          {assignment.feedback && (
            <>
              <h2 className="font-medium text-lg mb-2">Feedback</h2>
              <p>{assignment.feedback}</p>
            </>
          )}
        </Card>
      )}

      <AssignmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedSubject={assignment.title}
        selectedTask={selectedTask}
      />
    </div>
  );
}
