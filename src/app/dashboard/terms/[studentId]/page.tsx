"use client";
import * as Stepper from "@radix-ui/react-progress";
import { Card, Flex, Heading, Text, Button, Box, Grid } from "@radix-ui/themes";
import {
  ChevronLeftIcon,
  CalendarIcon,
  CheckCircledIcon,
  ClockIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

// Mock data for terms
const mockTerms = [
  {
    id: "1",
    name: "First Term",
    status: "completed",
    startDate: "Sep 1, 2023",
    endDate: "Dec 15, 2023",
    progress: 100,
    courses: 5,
    assignments: 12,
  },
  {
    id: "2",
    name: "Second Term",
    status: "in-progress",
    startDate: "Jan 10, 2024",
    endDate: "Apr 20, 2024",
    progress: 65,
    courses: 6,
    assignments: 8,
  },
  {
    id: "3",
    name: "Third Term",
    status: "upcoming",
    startDate: "May 5, 2024",
    endDate: "Aug 15, 2024",
    progress: 0,
    courses: 0,
    assignments: 0,
  },
];

// Mock student data
const mockStudents = {
  "1": { name: "John Doe", class: "Grade 3", avatar: "/avatars/1.jpg" },
  "2": { name: "Sarah Smith", class: "Grade 2", avatar: "/avatars/2.jpg" },
  "3": { name: "Charlie Brown", class: "Grade 2", avatar: "/avatars/3.jpg" },
  "4": { name: "David Wilson", class: "Grade 2", avatar: "/avatars/4.jpg" },
  "5": { name: "Eve Johnson", class: "Grade 2", avatar: "/avatars/5.jpg" },
};

export default function TermPage({
  params,
}: {
  params: { studentId: string };
}) {
  const student = mockStudents[
    params.studentId as keyof typeof mockStudents
  ] || { name: "Unknown Student", class: "Unknown Class", avatar: "" };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircledIcon className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <CrossCircledIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/students">
          <Button variant="soft" className="mb-6 flex items-center gap-1">
            <ChevronLeftIcon /> Back to Students
          </Button>
        </Link>

        <div className="mb-4 flex gap-4 items-center">
          {student.avatar && (
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
              {/* <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" /> */}
            </div>
          )}
          <div>
            <Heading as="h1" size="7" weight="bold" className="text-gray-900">
              {student.name}
            </Heading>
            <Text
              as="p"
              size="3"
              color="gray"
              className="flex items-center gap-1"
            >
              <span>{student.class}</span>
              <span>•</span>
              <span>Student ID: {params.studentId}</span>
            </Text>
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4">
        {mockTerms.map((term) => (
          <Card
            key={term.id}
            className="group mb-3 relative overflow-hidden border border-gray-200 rounded-xl bg-white transition-all hover:shadow-lg hover:border-gray-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 p-5 h-full flex flex-col">
              {/* Term Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[70%]">
                  {term.name}
                </h3>
                <div className="flex items-center gap-2">
                  <StatusIcon status={term.status} />
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      term.status === "completed"
                        ? "bg-green-100/80 text-green-800 ring-1 ring-green-200"
                        : term.status === "in-progress"
                        ? "bg-blue-100/80 text-blue-800 ring-1 ring-blue-200"
                        : "bg-gray-100/80 text-gray-800 ring-1 ring-gray-200"
                    }`}
                  >
                    {term.status.split("-").join(" ")}
                  </span>
                </div>
              </div>

              {/* Term Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {term.startDate} - {term.endDate}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-gray-500">
                    Progress
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      term.status === "completed"
                        ? "text-green-600"
                        : term.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {term.progress}%
                  </span>
                </div>
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${
                      term.status === "completed"
                        ? "bg-green-500"
                        : term.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                    style={{
                      width: `${term.progress}%`,
                      transition: "width 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Courses
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {term.courses}
                  </p>
                </div>
                <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Assignments
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {term.assignments}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-2">
                <div className="flex gap-3">
                  <button className="flex-1 py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                    View Details
                  </button>
                  {term.status === "in-progress" && (
                    <button className="flex-1 py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
