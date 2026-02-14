"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchStudents, updateStudent } from "@/services/studentsApi";

type StudentListRow = {
  key: string;
  studentId: string;
  name: string;
  userName: string;
  email: string;
  yearId: number;
  yearGroup: string;
  className: string;
  classId: number;
  status: "active" | "inactive" | "suspended";
  gender: "Male" | "Female" | "Unknown";
  genderRaw: "male" | "female" | "";
};

type YearItem = {
  id: number | string;
  name?: string;
};

type ClassItem = {
  id: number | string;
  class_name?: string;
  year_id?: number | string;
  year_name?: string;
  year?: { id?: number | string; name?: string };
};

const normalizeGender = (raw: unknown): "Male" | "Female" | "Unknown" => {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return "Unknown";
  if (["male", "m", "boy"].includes(value)) return "Male";
  if (["female", "f", "girl"].includes(value)) return "Female";
  return "Unknown";
};

const normalizeGenderRaw = (raw: unknown): "male" | "female" | "" => {
  const value = String(raw ?? "").trim().toLowerCase();
  if (["male", "m", "boy"].includes(value)) return "male";
  if (["female", "f", "girl"].includes(value)) return "female";
  return "";
};

export default function AllStudentsPage() {
  const searchParams = useSearchParams();
  const preselectedYearId = searchParams.get("yearId") || "";
  const preselectedClassId = searchParams.get("classId") || "";
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const role = currentUser?.role;
  const canView = role === "SCHOOL_ADMIN" || role === "HOD" || role === "TEACHER";
  const schoolId = Number((currentUser as { school?: number | string } | null)?.school ?? 0);
  const [messageApi, contextHolder] = message.useMessage();
  const [editForm] = Form.useForm();

  const [nameFilter, setNameFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [yearIdFilter, setYearIdFilter] = useState<string>(preselectedYearId);
  const [classFilters, setClassFilters] = useState<string[]>(
    preselectedClassId ? [preselectedClassId] : []
  );
  const [genderFilters, setGenderFilters] = useState<Array<"Male" | "Female" | "Unknown">>([]);
  const [editingStudent, setEditingStudent] = useState<StudentListRow | null>(null);
  const [genderOverrides, setGenderOverrides] = useState<Record<string, "male" | "female">>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem("students-gender-overrides");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery<StudentListRow[]>({
    queryKey: ["all-students-list", role, schoolId],
    enabled: canView,
    queryFn: async () => {
      let years: YearItem[] = [];
      if (schoolId > 0) {
        years = (await fetchYearsBySchool(schoolId)) || [];
      }

      const yearNameById = new Map<string, string>(
        years.map((year) => [String(year.id), String(year.name ?? "")])
      );

      let classList: ClassItem[] = [];

      if (role === "TEACHER") {
        const assigned = await fetchAssignYears();
        classList = (assigned || [])
          .map((entry: { classes?: ClassItem }) => entry.classes)
          .filter((cls: ClassItem | undefined): cls is ClassItem => Boolean(cls));
      } else {
        const groupedByYear = await Promise.all(
          years.map(async (year) => {
            try {
              return (await fetchClasses(String(year.id))) as ClassItem[];
            } catch {
              return [] as ClassItem[];
            }
          })
        );
        classList = groupedByYear.flat();
      }

      const uniqueClasses = Array.from(
        new Map(classList.map((cls) => [String(cls.id), cls])).values()
      );

      const byClass = await Promise.all(
        uniqueClasses.map(async (cls) => {
          const className = String(cls.class_name ?? `Class ${cls.id}`);
          const classYearId = cls.year_id ?? cls.year?.id;
          const yearName =
            cls.year_name ??
            cls.year?.name ??
            (classYearId != null ? yearNameById.get(String(classYearId)) : undefined) ??
            "Unknown";

          try {
            const classStudents = (await fetchStudents(cls.id)) as Array<Record<string, unknown>>;
            return (classStudents || []).map((student) => ({
              ...(function () {
                const sid = String(student.id ?? student.student_id ?? "");
                const fromApi = normalizeGenderRaw(
                  student.gender ?? student.student_gender ?? student.sex ?? student.student_sex
                );
                const rawGender = genderOverrides[sid] || fromApi;
                return {
                  key: `${cls.id}-${student.id ?? student.student_id ?? Math.random()}`,
                  studentId: sid,
                  name: String(student.student_name ?? student.name ?? "Unknown Student"),
                  userName: String(student.user_name ?? student.username ?? ""),
                  email: String(student.email ?? ""),
                  yearId: Number(classYearId ?? 0),
                  yearGroup: yearName,
                  className,
                  classId: Number(cls.id),
                  status: String(student.status ?? "active").toLowerCase() as
                    | "active"
                    | "inactive"
                    | "suspended",
                  gender:
                    rawGender === "male"
                      ? "Male"
                      : rawGender === "female"
                      ? "Female"
                      : "Unknown",
                  genderRaw: rawGender,
                };
              })(),
            }));
          } catch {
            return [] as StudentListRow[];
          }
        })
      );

      return byClass
        .flat()
        .sort((a, b) => a.yearGroup.localeCompare(b.yearGroup) || a.name.localeCompare(b.name));
    },
  });

  const yearOptions = useMemo(() => {
    return Array.from(new Set(students.map((row) => row.yearGroup)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = nameFilter.trim().toLowerCase();
    return students.filter((row) => {
      const nameMatch = !q || row.name.toLowerCase().includes(q);
      const yearMatch = yearFilter === "all" || row.yearGroup === yearFilter;
      const yearIdMatch = !yearIdFilter || String(row.yearId) === yearIdFilter;
      const classMatch =
        classFilters.length === 0 || classFilters.includes(String(row.classId));
      const genderMatch =
        genderFilters.length === 0 || genderFilters.includes(row.gender);
      return nameMatch && yearMatch && yearIdMatch && classMatch && genderMatch;
    });
  }, [students, nameFilter, yearFilter, yearIdFilter, classFilters, genderFilters]);

  const classOptions = useMemo(() => {
    const unique = Array.from(
      new Map(students.map((row) => [String(row.classId), row.className])).entries()
    );
    return unique
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }, [students]);

  const resetFilters = () => {
    setNameFilter("");
    setYearFilter("all");
    setYearIdFilter("");
    setClassFilters([]);
    setGenderFilters([]);
  };

  const editMutation = useMutation({
    mutationFn: async (values: {
      student_name?: string;
      user_name?: string;
      email?: string;
      status?: "active" | "inactive" | "suspended";
      gender?: "male" | "female";
      password?: string;
    }) => {
      if (!editingStudent) return;
      const nextName = values.student_name?.trim() || editingStudent.name;
      const nextUserName = values.user_name?.trim() || editingStudent.userName;
      const nextEmail = values.email?.trim() || editingStudent.email || "";
      const nextStatus = values.status || editingStudent.status || "active";
      const nextGender =
        values.gender || editingStudent.genderRaw || (editingStudent.gender === "Female" ? "female" : "male");

      const payload: Record<string, unknown> = {
        student_name: nextName,
        user_name: nextUserName,
        email: nextEmail,
        class_id: editingStudent.classId,
        status: nextStatus,
        gender: nextGender,
        student_gender: nextGender,
        sex: nextGender,
        student_sex: nextGender,
      };
      if (values.password?.trim()) {
        payload.password = values.password.trim();
      }
      return updateStudent(editingStudent.studentId, payload as any);
    },
    onSuccess: async () => {
      if (editingStudent) {
        const nextGender = String(editForm.getFieldValue("gender") || "").toLowerCase();
        if (nextGender === "male" || nextGender === "female") {
          const nextOverrides = {
            ...genderOverrides,
            [editingStudent.studentId]: nextGender as "male" | "female",
          };
          setGenderOverrides(nextOverrides);
          if (typeof window !== "undefined") {
            localStorage.setItem("students-gender-overrides", JSON.stringify(nextOverrides));
          }
        }
      }
      messageApi.success("Student updated successfully.");
      setEditingStudent(null);
      editForm.resetFields();
      await queryClient.invalidateQueries({
        queryKey: ["all-students-list", role, schoolId],
      });
    },
    onError: () => {
      messageApi.error("Failed to update student.");
    },
  });

  const openEdit = (record: StudentListRow) => {
    setEditingStudent(record);
    editForm.setFieldsValue({
      student_name: record.name,
      user_name: record.userName,
      email: record.email,
      status: record.status,
      gender: record.genderRaw || "male",
      password: "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      editMutation.mutate(values);
    } catch {
      // validation message handled by antd
    }
  };

  if (!canView) {
    return (
      <div className="p-6">
        <Card>
          <Typography.Text>You do not have access to this page.</Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>All Students</span> },
        ]}
        className="mb-4"
      />

      <Card className="border border-[#D6EFE2] mb-4">
        <Typography.Title level={3} className="!mb-1">
          All Students
        </Typography.Title>
        <Typography.Text className="text-gray-500">
          View and filter students by name, year group, class, and gender.
        </Typography.Text>
        {yearIdFilter && (
          <Typography.Text className="block text-emerald-700 text-sm mt-1">
            Year filter applied from previous page.
          </Typography.Text>
        )}
        {classFilters.length > 0 && (
          <Typography.Text className="block text-emerald-700 text-sm mt-1">
            Class filter applied from previous page.
          </Typography.Text>
        )}
      </Card>

      <Card className="border border-[#D6EFE2]">
        <Space wrap size={12} className="mb-4">
          <Input
            placeholder="Search by student name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />

          <Select
            value={yearFilter}
            onChange={(value) => setYearFilter(value)}
            style={{ width: 220 }}
            options={[
              { label: "All Year Groups", value: "all" },
              ...yearOptions.map((year) => ({ label: year, value: year })),
            ]}
          />

          <Select
            mode="multiple"
            value={classFilters}
            onChange={(value) => setClassFilters(value)}
            style={{ width: 280 }}
            placeholder="Filter by class (multi-select)"
            options={classOptions}
            maxTagCount="responsive"
            allowClear
          />

          <Select
            mode="multiple"
            value={genderFilters}
            onChange={(value) =>
              setGenderFilters(value as Array<"Male" | "Female" | "Unknown">)
            }
            style={{ width: 260 }}
            placeholder="Filter by gender (multi-select)"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Unknown", value: "Unknown" },
            ]}
            maxTagCount="responsive"
            allowClear
          />

          <Button onClick={resetFilters}>Reset Filters</Button>
        </Space>

        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Typography.Text type="danger">
            Failed to load students. Please try again.
          </Typography.Text>
        ) : (
          <>
            <Typography.Text className="block text-gray-500 mb-3">
              Showing {filteredStudents.length} of {students.length} students
            </Typography.Text>
            <Table<StudentListRow>
              rowKey="key"
              dataSource={filteredStudents}
              pagination={{ pageSize: 20, showSizeChanger: true }}
              columns={[
                {
                  title: "Student Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Year Group",
                  dataIndex: "yearGroup",
                  key: "yearGroup",
                },
                {
                  title: "Class",
                  dataIndex: "className",
                  key: "className",
                },
                {
                  title: "Gender",
                  dataIndex: "gender",
                  key: "gender",
                  render: (value: StudentListRow["gender"]) => {
                    if (value === "Male") return <Tag color="blue">Male</Tag>;
                    if (value === "Female") return <Tag color="magenta">Female</Tag>;
                    return <Tag>Unknown</Tag>;
                  },
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_: unknown, record: StudentListRow) => (
                    <Button size="small" onClick={() => openEdit(record)}>
                      Edit
                    </Button>
                  ),
                },
              ]}
            />
          </>
        )}
      </Card>

      <Modal
        title={`Edit Student${editingStudent ? `: ${editingStudent.name}` : ""}`}
        open={!!editingStudent}
        onCancel={() => {
          setEditingStudent(null);
          editForm.resetFields();
        }}
        onOk={handleSaveEdit}
        confirmLoading={editMutation.isPending}
        okText="Save"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="student_name" label="Student Name">
            <Input />
          </Form.Item>

          <Form.Item name="user_name" label="Username">
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Please enter a valid email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select
              allowClear
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspended", value: "suspended" },
              ]}
            />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Select
              allowClear
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password (Optional)"
            extra="Leave empty to keep current password."
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
