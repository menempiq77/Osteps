"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Tag, Divider, Avatar, Spin, message } from "antd";
import { BookOpen, Mail, Phone, Users, Calendar } from "lucide-react";
import { getAssignClassesTeacher } from "@/services/teacherApi";
import { fetchYearsBySchool, fetchAssignYears } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
  status?: string;
  assignment_status?: string;
  is_active?: boolean | number | string;
  active?: boolean | number | string;
  deleted_at?: string | null;
  pivot?: {
    status?: string;
    is_active?: boolean | number | string;
    deleted_at?: string | null;
  };
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
  const [teacherInfo, setTeacherInfo] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        setIsLoading(true);
        const response: ApiResponse = await getAssignClassesTeacher(teacherId);

        if (response.status === 200) {
          const rawRows = Array.isArray(response.data) ? response.data : [];
          setTeacherInfo(rawRows.length > 0 ? rawRows[0].teacher : null);

          // Build metadata map from backend relation endpoint (subject/date),
          // but derive assignment truth from class.assigned_teachers status.
          const relationMetaByClassId = new Map<number, AssignedClass>();
          rawRows.forEach((row) => {
            if (!row?.class_id) return;
            const existing = relationMetaByClassId.get(row.class_id);
            if (!existing) {
              relationMetaByClassId.set(row.class_id, row);
              return;
            }
            const existingTs = new Date(existing.updated_at || existing.created_at || 0).getTime();
            const rowTs = new Date(row.updated_at || row.created_at || 0).getTime();
            if (rowTs >= existingTs) relationMetaByClassId.set(row.class_id, row);
          });

          const schoolId = Number(
            (currentUser as any)?.school?.id ??
              (currentUser as any)?.school_id ??
              (currentUser as any)?.school ??
              0
          );

          let years: any[] = [];
          if (schoolId > 0) {
            years = (await fetchYearsBySchool(schoolId)) ?? [];
          }
          if (!Array.isArray(years) || years.length === 0) {
            const assignedYears = (await fetchAssignYears()) ?? [];
            years = Array.from(
              new Map(
                (assignedYears as any[])
                  .map((item: any) => item?.classes?.year)
                  .filter(Boolean)
                  .map((year: any) => [year.id, year])
              ).values()
            );
          }

          const classLists = await Promise.all(
            (years || []).map(async (year: any) => {
              try {
                return (await fetchClasses(String(year?.id))) ?? [];
              } catch {
                return [];
              }
            })
          );
          const classes = classLists.flat();

          const normalizedAssigned = classes
            .map((cls: any) => {
              const assignedRow = (cls?.assigned_teachers || []).find(
                (t: any) =>
                  Number(t?.teacher_id) === Number(teacherId) &&
                  String(t?.status || "").toLowerCase() === "assigned"
              );
              if (!assignedRow) return null;

              const meta = relationMetaByClassId.get(Number(cls?.id));
              return {
                id: Number(meta?.id ?? assignedRow?.id ?? cls?.id),
                class_id: Number(cls?.id),
                teacher_id: Number(teacherId),
                subject: String(meta?.subject ?? ""),
                created_at: String(meta?.created_at ?? assignedRow?.created_at ?? cls?.updated_at ?? ""),
                updated_at: String(meta?.updated_at ?? assignedRow?.updated_at ?? cls?.updated_at ?? ""),
                teacher: (meta?.teacher ?? rawRows[0]?.teacher) as Teacher,
                classes: {
                  id: Number(cls?.id),
                  school_id: Number(cls?.school_id ?? 0),
                  year_id: Number(cls?.year_id ?? 0),
                  class_name: String(cls?.class_name ?? "Class"),
                  number_of_terms: String(cls?.number_of_terms ?? ""),
                  created_at: String(cls?.created_at ?? ""),
                  updated_at: String(cls?.updated_at ?? ""),
                } as Class,
              } as AssignedClass;
            })
            .filter(Boolean) as AssignedClass[];

          normalizedAssigned.sort((a, b) =>
            String(a?.classes?.class_name || "").localeCompare(
              String(b?.classes?.class_name || "")
            )
          );

          setAssignedClasses(normalizedAssigned);
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
  }, [teacherId, currentUser]);

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
