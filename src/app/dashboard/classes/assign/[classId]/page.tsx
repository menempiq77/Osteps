"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Checkbox, Spin, Alert } from "antd";
import { PlusCircle, Users, BookOpen } from "lucide-react";
import { AssignTeacher, fetchTeachers, getAssignTeacher } from "@/services/teacherApi";

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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
          if (assignedResponse.teachers_by_subject?.Islamiat?.length > 0) {
            setAssignedTeachers(assignedResponse.teachers_by_subject.Islamiat); // Store all teachers
          }
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [classId]);

  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);

  const toggleTeacher = (id: number) => {
    setSelectedTeachers([id]);
  };

  const handleAssignTeachers = async () => {
    try {
      if (!classId || selectedTeachers.length === 0) return;

      setIsAssigning(true);
      setError(null);
      setSuccessMessage(null);

      const teacherId = selectedTeachers[0];
      await AssignTeacher(classId as string, teacherId);

       const assignedResponse = await getAssignTeacher(classId as string);
    if (assignedResponse.teachers_by_subject?.Islamiat?.length > 0) {
      setAssignedTeachers(assignedResponse.teachers_by_subject.Islamiat);
    }

      setSuccessMessage(`Successfully assigned teacher to class`);
      setSelectedTeachers([]);
    } catch (error) {
      console.error("Error assigning teacher:", error);
      setError("Failed to assign teacher. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Teacher Assignment
          </h2>
          <p className="text-sm text-gray-500">Assign teachers to Class</p>
        </div>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6"
          onClose={() => setError(null)}
        />
      )}

      {successMessage && (
        <Alert
          message="Success"
          description={successMessage}
          type="success"
          showIcon
          closable
          className="mb-6"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <Spin spinning={isLoading} tip="Loading...">
        <div className="flex flex-col gap-6">
          {/* Current Assignment Card */}
          <Card className="w-full border-0 shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-6 mb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h6 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Current Teacher Assignment
                  </h6>
                  <p className="text-sm text-gray-600 mt-1">
                    View the currently assigned teacher for this class
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-purple-800">
                    Current
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {assignedTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignedTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="border border-gray-100 rounded-xl overflow-hidden shadow-xs bg-white p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {teacher.teacher_name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Email: {teacher.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No teacher currently assigned to this class
                </div>
              )}
            </div>
          </Card>

          {/* Assign Teacher Card */}
          <Card className="w-full border-0 shadow-sm">
            <div className="bg-gradient-to-r from-indigo-50 to-green-50 rounded-t-lg p-6 mb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h6 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Assign Teachers by Subject
                  </h6>
                  <p className="text-sm text-gray-600 mt-1">
                    Select teachers to assign to this class from available
                    subjects
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-green-800">
                    Subjects
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 bg-white">
                  <div className="bg-primary px-5 py-4">
                    <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                      <span className="bg-white/20 p-1 rounded-full">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      Islamiyat
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {teachers?.map((teacher) => (
                      <div
                        key={teacher.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          selectedTeachers.includes(teacher.id)
                            ? "bg-indigo-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <Checkbox
                          id={`teacher-${teacher.id}`}
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => toggleTeacher(teacher.id)}
                          className="[&_.ant-checkbox-inner]:!border-gray-300 [&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-primary [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-primary"
                        />
                        <label
                          htmlFor={`teacher-${teacher.id}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                        >
                          {teacher.name}
                        </label>
                        {selectedTeachers.includes(teacher.id) && (
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-green-800">
                            Selected
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
                <Button
                  onClick={handleAssignTeachers}
                  className="px-6 py-3 text-md !bg-primary hover:!bg-primary !text-white flex items-center gap-2"
                  disabled={selectedTeachers.length === 0 || isAssigning}
                  loading={isAssigning}
                >
                  {!isAssigning && <PlusCircle className="w-5 h-5" />}
                  Assign Teachers
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Spin>
    </div>
  );
}
