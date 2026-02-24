"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Tag, Divider, Avatar, Spin, message } from "antd";
import { BookOpen, Mail, Phone, Users, Calendar } from "lucide-react";
import { getAssignClassesTeacher } from "@/services/teacherApi";

interface Teacher {
  id: number;
  school_id: number;
  teacher_name: string;
  phone: string;
  email: string;
  subjects: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  role: string;
}

interface Class {
  id: number;
  school_id: number;
  year_id: number;
  class_name: string;
  number_of_terms: string;
  created_at: string;
  updated_at: string;
}

interface AssignedClass {
  id: number;
  class_id: number;
  teacher_id: number;
  subject: string;
  created_at: string;
  updated_at: string;
  teacher: Teacher;
  classes: Class;
}

interface ApiResponse {
  msg: string;
  status: number;
  data: AssignedClass[];
}

export default function TeacherAssignedClasses() {
  const { teacherId } = useParams();
  const router = useRouter();
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        setIsLoading(true);
        const response: ApiResponse = await getAssignClassesTeacher(teacherId);

        if (response.status === 200) {
          setAssignedClasses(response.data);
        } else {
          setError("Failed to fetch assigned classes");
          message.error("Failed to fetch assigned classes");
        }
      } catch (err) {
        console.error("Error fetching assigned classes:", err);
        setError("An error occurred while fetching data");
        message.error("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId) {
      fetchAssignedClasses();
    }
  }, [teacherId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Loading assigned classes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  const teacherInfo =
    assignedClasses.length > 0 ? assignedClasses[0].teacher : null;

  const handleViewStudents = (classId: number | string) => {
    router.push(`/dashboard/students/${classId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Teacher Assigned Classes
          </h1>
          <p className="text-gray-600 mt-2">
            View all classes assigned to this teacher
          </p>
        </div>

        {teacherInfo ? (
          <>
            {/* Teacher Profile Card */}
            <Card className="mb-6 shadow-md border-0">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar
                  size={80}
                  className="bg-blue-600 flex items-center justify-center"
                >
                  <span className="text-xl text-white">
                    {teacherInfo.teacher_name.charAt(0)}
                  </span>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {teacherInfo.teacher_name}
                  </h2>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{teacherInfo.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{teacherInfo.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag color="blue">{teacherInfo.role}</Tag>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Tag color="green" className="text-sm py-1">
                      Subject: {teacherInfo.subjects}
                    </Tag>
                  </div>
                </div>

                <div className="bg-blue-50 px-4 py-3 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {assignedClasses.length}
                    </div>
                    <div className="text-gray-600 text-sm">
                      Assigned Classes
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Divider className="my-6" />

            {/* Classes Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Assigned Classes
              </h2>

              {assignedClasses.length === 0 ? (
                <Card className="text-center py-10 shadow-md border-0">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">
                    No classes assigned yet
                  </h3>
                  <p className="text-gray-500 mt-1">
                    This teacher hasn't been assigned to any classes yet.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {assignedClasses.map((classItem) => (
                    <Card
                      key={classItem.id}
                      onClick={() => handleViewStudents(classItem.classes.id)}
                      className="shadow-md hover:shadow-lg transition-all border-0 !cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Tag color="blue" className="text-sm py-1 px-3">
                          {classItem.subject}
                        </Tag>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {classItem.classes.class_name}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Assigned on:{" "}
                          {new Date(classItem.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Card className="text-center py-10 shadow-md border-0">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              No assigned classes yet
            </h3>
            <p className="text-gray-500 mt-1">
              This teacher hasn't been assigned to any classes yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
