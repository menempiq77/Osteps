"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Spin, Radio, message, Tag, Divider } from "antd";
import { PlusCircle, Users, BookOpen, Mail, Phone } from "lucide-react";
import {
  AssignTeacher,
  fetchTeachers,
  getAssignTeacher,
} from "@/services/teacherApi";

interface Teacher {
  id: number | string;
  name: string;
  phone: string;
  email: string;
  subjects: string[];
}

export default function AssignPage() {
  const { classId } = useParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignedTeachers, setAssignedTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<
    number | string | null
  >(null);
  const [className, setClassName] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const teachersResponse = await fetchTeachers();
        const transformedTeachers = teachersResponse.map((teacher: any) => ({
          id: teacher.id.toString(),
          name: teacher.teacher_name,
          phone: teacher.phone,
          email: teacher.email,
          subjects: teacher.subjects.split(",").map((s: string) => s.trim()),
        }));
        setTeachers(transformedTeachers);

        if (classId) {
          const assignedResponse = await getAssignTeacher(classId as string);
          setClassName(assignedResponse.class || "");

          if (assignedResponse.teachers_by_subject?.Islamiat?.length > 0) {
            setAssignedTeachers(assignedResponse.teachers_by_subject.Islamiat);
            setSelectedTeacher(
              assignedResponse.teachers_by_subject.Islamiat[0].id
            );
          }
        }
      } catch (err) {
        messageApi.error("Failed to fetch data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [classId]);

  const handleTeacherSelect = (id: number | string) => {
    setSelectedTeacher(id);
  };

  const handleAssignTeachers = async () => {
    try {
      if (!classId || !selectedTeacher) return;
      setIsAssigning(true);
      await AssignTeacher(classId as string, selectedTeacher);

      const assignedResponse = await getAssignTeacher(classId as string);
      if (assignedResponse.teachers_by_subject?.Islamiat?.length > 0) {
        setAssignedTeachers(assignedResponse.teachers_by_subject.Islamiat);
      }

      messageApi.success("Successfully assigned teacher to class");
    } catch (error) {
      console.error("Error assigning teacher:", error);
      messageApi.error("Failed to assign teacher. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {contextHolder}

      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary p-2 rounded-lg">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Teacher Assignment
          </h2>
          <p className="text-sm text-gray-500">
            {className ? (
              <>
                Assign teachers to{" "}
                <span className="font-semibold">{className}</span>
              </>
            ) : (
              "Assign teachers to class"
            )}
          </p>
        </div>
      </div>

      <Spin spinning={isLoading} tip="Loading...">
        <div className="flex flex-col gap-6">
          {/* Current Assignment Card */}
          <Card
            className="w-full border-0 shadow-sm"
            title={
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Current Teacher Assignment</span>
              </div>
            }
            extra={
              <Tag color="blue" className="text-sm py-1 px-3">
                Current
              </Tag>
            }
          >
            <div className="p-4">
              {assignedTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignedTeachers.map((teacher) => (
                    <Card
                      key={teacher.id}
                      size="small"
                      className="border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {teacher.teacher_name}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Mail className="w-3 h-3" />
                            <span>{teacher.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="mt-2">
                            <Tag color="green" className="text-xs">
                              Islamiat
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>No teacher currently assigned to this class</p>
                </div>
              )}
            </div>
          </Card>

          {/* Assign Teacher Card */}
          <Card
            className="w-full border-0 shadow-sm"
            title={
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                <span>Assign New Teacher</span>
              </div>
            }
            extra={
              <Tag color="green" className="text-sm py-1 px-3">
                Select Subject
              </Tag>
            }
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Tag
                    color="blue"
                    className="px-3 py-1 text-sm cursor-pointer"
                  >
                    Islamiyat
                  </Tag>
                </div>
              </div>

              <Divider className="my-4" />

              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Available Teachers for Islamiyat
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    size="small"
                    className={`border cursor-pointer transition-all ${
                      selectedTeacher === teacher.id
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTeacherSelect(teacher.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Radio checked={selectedTeacher === teacher.id} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800">
                            {teacher.name}
                          </h4>
                          {selectedTeacher === teacher.id && (
                            <Tag color="green" className="text-xs">
                              Selected
                            </Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{teacher.phone}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <Button
                  onClick={handleAssignTeachers}
                  className="px-6 py-2 text-md bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  disabled={!selectedTeacher || isAssigning}
                  loading={isAssigning}
                  size="large"
                >
                  {!isAssigning && <PlusCircle className="w-5 h-5" />}
                  Assign Teacher
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Spin>
    </div>
  );
}
