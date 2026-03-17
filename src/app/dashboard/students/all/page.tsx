"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  Input,
  Modal,
  Radio,
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
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  assignStudentsToSubjects,
  checkSubjectWorkspaceAvailability,
  fetchSubjectClasses,
} from "@/services/subjectWorkspaceApi";

type StudentListRow = {
  key: string;
  enrollmentStudentId: string;
  studentId: string;
  profileId: string;
  updateIds: string[];
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
  nationality: string;
  subjectIds: number[];
  subjectNames: string[];
  isSen: boolean;
  senDetails: string;
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

type SubjectClassOption = {
  id: number;
  subjectId: number;
  name: string;
  yearId: number;
  baseClassLabel: string;
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

const displaySubjectName = (value: unknown): string =>
  String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

export default function AllStudentsPage() {
  const searchParams = useSearchParams();
  const preselectedYearId = searchParams.get("yearId") || "";
  const preselectedClassId = searchParams.get("classId") || "";
  const preselectedSubjectId = searchParams.get("subjectId") || "";
  const preselectedSubjectClassLabel = searchParams.get("subjectClassLabel") || "";
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const role = currentUser?.role;
  const canView = role === "SCHOOL_ADMIN" || role === "HOD" || role === "TEACHER";
  const canEdit = role === "SCHOOL_ADMIN";
  const isSchoolAdmin = role === "SCHOOL_ADMIN";
  const schoolId = Number((currentUser as { school?: number | string } | null)?.school ?? 0);
  const { subjects } = useSubjectContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [editForm] = Form.useForm();

  const [nameFilter, setNameFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [yearIdFilter, setYearIdFilter] = useState<string>(preselectedYearId);
  const [classFilters, setClassFilters] = useState<string[]>(
    preselectedClassId ? [preselectedClassId] : []
  );
  const [subjectFilter, setSubjectFilter] = useState<string>(preselectedSubjectId || "all");
  const [genderFilters, setGenderFilters] = useState<Array<"Male" | "Female">>([]);
  const [editingStudent, setEditingStudent] = useState<StudentListRow | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignFeatureAvailable, setAssignFeatureAvailable] = useState<boolean | null>(null);
  const [assignFeatureMessage, setAssignFeatureMessage] = useState("");
  const [assignScope, setAssignScope] = useState<"selected" | "filtered" | "all_filtered">(
    "selected"
  );
  const [assignForm] = Form.useForm();
  const selectedAssignSubjectIds = Form.useWatch("subject_ids", assignForm) as number[] | undefined;


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
                const primaryId = String(student.id ?? "").trim();
                const fallbackId = String(student.student_id ?? "").trim();
                const canonicalStudentId = fallbackId || primaryId;
                const updateIds = Array.from(
                  new Set([canonicalStudentId, fallbackId, primaryId].filter(Boolean))
                );
                const sid = canonicalStudentId || updateIds[0] || "";
                const profileId = primaryId || fallbackId || sid;

                const rawSubjects = Array.isArray(student.subjects)
                  ? student.subjects
                  : student.subject_name
                    ? [student.subject_name]
                    : student.subject
                      ? [student.subject]
                      : [];

                const subjectNames = rawSubjects
                  .map((item: any) => {
                    if (typeof item === "string") return item;
                    if (item && typeof item === "object") return String(item.name ?? item.subject_name ?? "");
                    return "";
                  })
                  .map((name: string) => displaySubjectName(name))
                  .filter(Boolean);
                const subjectIds = rawSubjects
                  .map((item: any) => {
                    if (item && typeof item === "object") {
                      const value = Number(item.id ?? item.subject_id);
                      return Number.isFinite(value) && value > 0 ? value : null;
                    }
                    return null;
                  })
                  .filter((value: number | null): value is number => Number.isFinite(value as number));

                const fromApiGender = normalizeGenderRaw(
                  student.gender ??
                    student.student_gender ??
                    student.sex ??
                    student.student_sex ??
                    student.studentGender ??
                    student.studentSex
                );
                const rawGender = fromApiGender;
                const nationalityFromApi = String(
                  student.nationality ??
                    student.student_nationality ??
                    student.studentNationality ??
                    student.country ??
                    student.citizenship ??
                    ""
                ).trim();
                const nationality = nationalityFromApi;
                const isSen = Boolean(student.is_sen ?? student.isSen ?? false);
                const senDetails = String(student.sen_details ?? student.senDetails ?? "");
                return {
                  key: `${cls.id}-${student.id ?? student.student_id ?? Math.random()}`,
                  enrollmentStudentId: primaryId || fallbackId || "",
                  studentId: sid,
                  profileId,
                  updateIds,
                  name: String(student.student_name ?? student.name ?? "Unknown Student"),
                  userName: String(student.user_name ?? student.username ?? ""),
                  email: String(student.email ?? ""),
                  nationality,
                  subjectIds,
                  subjectNames,
                  isSen,
                  senDetails,
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
    const wantedSubject = subjectFilter.trim().toLowerCase();
    const wantedSubjectId = Number(subjectFilter);
    const wantedSubjectClassLabel = preselectedSubjectClassLabel.trim().toLowerCase();
    return students.filter((row) => {
      const nameMatch = !q || row.name.toLowerCase().includes(q);
      const yearMatch = yearFilter === "all" || row.yearGroup === yearFilter;
      const yearIdMatch = !yearIdFilter || String(row.yearId) === yearIdFilter;
      const classMatch =
        classFilters.length === 0 || classFilters.includes(String(row.classId));
      const subjectClassMatch =
        !wantedSubjectClassLabel || row.className.trim().toLowerCase() === wantedSubjectClassLabel;
      const genderMatch =
        genderFilters.length === 0 || genderFilters.includes(row.gender);
      const subjectMatch =
        subjectFilter === "all" ||
        (Number.isFinite(wantedSubjectId) &&
          wantedSubjectId > 0 &&
          row.subjectIds.some((id) => Number(id) === wantedSubjectId)) ||
        row.subjectNames.some((subject) => String(subject || "").trim().toLowerCase() === wantedSubject);
      return (
        nameMatch &&
        yearMatch &&
        yearIdMatch &&
        classMatch &&
        subjectClassMatch &&
        genderMatch &&
        subjectMatch
      );
    });
  }, [
    students,
    nameFilter,
    yearFilter,
    yearIdFilter,
    classFilters,
    genderFilters,
    subjectFilter,
    preselectedSubjectClassLabel,
  ]);

  const classOptions = useMemo(() => {
    const unique = Array.from(
      new Map(students.map((row) => [String(row.classId), row.className])).entries()
    );
    return unique
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }, [students]);

  const assignSubjectOptions = useMemo(() => {
    const unique = new Map<string, { label: string; value: number }>();

    for (const subject of subjects) {
      const value = Number(subject.id);
      if (!Number.isFinite(value) || value <= 0) continue;

      const label = String(subject.name || "").replace(/islamiat/gi, "Islamic").trim();
      const key = label.toLowerCase();
      if (!label || unique.has(key)) continue;

      unique.set(key, { label, value });
    }

    return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [subjects]);

  const { data: assignSubjectClasses = [] } = useQuery<SubjectClassOption[]>({
    queryKey: ["assign-subject-classes", assignDrawerOpen, subjects.map((subject) => Number(subject.id)).join(",")],
    enabled: isSchoolAdmin && assignDrawerOpen && subjects.length > 0,
    queryFn: async () => {
      const rows = await Promise.all(
        subjects.map(async (subject) => {
          const subjectId = Number(subject.id);
          if (!Number.isFinite(subjectId) || subjectId <= 0) return [] as SubjectClassOption[];
          try {
            const items = await fetchSubjectClasses({ subject_id: subjectId });
            return (Array.isArray(items) ? items : []).map((item: any) => ({
              id: Number(item.id),
              subjectId,
              name: String(item.name || `Class ${item.id}`),
              yearId: Number(item.year_id ?? 0),
              baseClassLabel: String(item.base_class_label || ""),
            }));
          } catch {
            return [] as SubjectClassOption[];
          }
        })
      );

      return rows
        .flat()
        .filter((item) => Number.isFinite(item.id) && item.id > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const filteredAssignSubjectClassOptions = useMemo(() => {
    const allowedSubjectIds = new Set(
      (Array.isArray(selectedAssignSubjectIds) ? selectedAssignSubjectIds : [])
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0)
    );

    return assignSubjectClasses
      .filter((item) => allowedSubjectIds.size === 0 || allowedSubjectIds.has(Number(item.subjectId)))
      .map((item) => {
        const subjectName =
          assignSubjectOptions.find((option) => Number(option.value) === Number(item.subjectId))?.label ||
          `Subject ${item.subjectId}`;
        const yearName =
          students.find((row) => Number(row.yearId) === Number(item.yearId))?.yearGroup ||
          (item.yearId > 0 ? `Year ${item.yearId}` : "No year");
        const detail = item.baseClassLabel ? `, ${item.baseClassLabel}` : "";
        return {
          label: `${subjectName} - ${item.name} (${yearName}${detail})`,
          value: item.id,
        };
      });
  }, [assignSubjectClasses, selectedAssignSubjectIds, assignSubjectOptions, students]);

  const resetFilters = () => {
    setNameFilter("");
    setYearFilter("all");
    setYearIdFilter("");
    setClassFilters([]);
    setSubjectFilter("all");
    setGenderFilters([]);
  };

  const openAssignDrawer = () => {
    if (!isSchoolAdmin) {
      messageApi.warning("Only School Admin can assign students to subjects.");
      return;
    }
    setAssignScope(selectedRowKeys.length > 0 ? "selected" : "all_filtered");
    assignForm.resetFields();
    setAssignFeatureAvailable(null);
    setAssignFeatureMessage("");
    setAssignDrawerOpen(true);
    void probeAssignFeature();
  };

  const probeAssignFeature = async () => {
    const fallbackSubjectId = Number(subjects[0]?.id ?? 0);
    if (!fallbackSubjectId) {
      setAssignFeatureAvailable(false);
      setAssignFeatureMessage("No subjects are available yet for assignment.");
      return;
    }

    const result = await checkSubjectWorkspaceAvailability(fallbackSubjectId);
    setAssignFeatureAvailable(result.available);
    setAssignFeatureMessage(result.message || "");
  };

  const selectAllFiltered = () => {
    if (!isSchoolAdmin) return;
    setSelectedRowKeys(filteredStudents.map((row) => row.key));
    messageApi.success(`Selected ${filteredStudents.length} students (from current filters).`);
  };

  const submitAssign = async () => {
    if (!isSchoolAdmin) return;
    if (assignFeatureAvailable === false) {
      messageApi.error(assignFeatureMessage || "Student-to-subject assignment is not available.");
      return;
    }
    const values = await assignForm.validateFields();
    const subjectIds = Array.from(
      new Set(
        (Array.isArray(values.subject_ids) ? values.subject_ids : [])
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    );
    const subjectClassIds = Array.from(
      new Set(
        (Array.isArray(values.subject_class_ids) ? values.subject_class_ids : [])
          .map((id: unknown) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    );
    if (subjectIds.length === 0 && subjectClassIds.length === 0) {
      messageApi.warning("Please choose at least one subject or class.");
      return;
    }

    const targetRows =
      assignScope === "selected"
        ? filteredStudents.filter((row) => new Set(selectedRowKeys).has(row.key))
        : filteredStudents;

    const studentIds = Array.from(
      new Set(
        targetRows
          .map((row) => Number(row.enrollmentStudentId || row.studentId || row.profileId))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    );
    if (studentIds.length === 0) {
      messageApi.warning("No students selected.");
      return;
    }

    setAssignLoading(true);
    try {
      await assignStudentsToSubjects({
        subjectIds,
        subjectClassIds,
        studentIds,
        subjects: subjects.map((subject) => ({ id: Number(subject.id), name: subject.name })),
      });
      messageApi.success(
        `Assigned ${studentIds.length} student${studentIds.length === 1 ? "" : "s"} to ${subjectIds.length} subject${subjectIds.length === 1 ? "" : "s"}.`
      );
      setAssignDrawerOpen(false);
      setSelectedRowKeys([]);
      await queryClient.invalidateQueries({ queryKey: ["all-students-list", role, schoolId] });
    } catch (error: any) {
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to assign students.");
    } finally {
      setAssignLoading(false);
    }
  };

  const editMutation = useMutation({
    mutationFn: async (values: {
      student_name?: string;
      user_name?: string;
      email?: string;
      status?: "active" | "inactive" | "suspended";
      gender?: "male" | "female";
      nationality?: string;
      is_sen?: boolean;
      sen_details?: string;
      password?: string;
    }) => {
      if (!canEdit) {
        throw new Error("Only School Admin can edit student information.");
      }
      if (!editingStudent) return;
      const nextName = values.student_name?.trim() || editingStudent.name;
      const nextUserName = values.user_name?.trim() || editingStudent.userName;
      const nextEmail = values.email?.trim() || editingStudent.email || "";
      const nextNationality =
        values.nationality != null
          ? String(values.nationality).trim()
          : editingStudent.nationality || "";
      const nextIsSen =
        values.is_sen != null ? Boolean(values.is_sen) : editingStudent.isSen;
      const nextSenDetails = nextIsSen
        ? String(values.sen_details ?? editingStudent.senDetails ?? "").trim()
        : "";
      const nextStatus = values.status || editingStudent.status || "active";
      const nextGender = normalizeGenderRaw(values.gender ?? editingStudent.genderRaw);

      const payload: Record<string, unknown> = {
        student_name: nextName,
        user_name: nextUserName,
        email: nextEmail,
        class_id: editingStudent.classId,
        status: nextStatus,
        nationality: nextNationality,
        student_nationality: nextNationality,
        country: nextNationality,
        is_sen: nextIsSen,
        sen_details: nextSenDetails,
        // Backend currently expects password key to always exist on update.
        password: values.password?.trim() || "",
      };
      if (nextGender) {
        payload.gender = nextGender;
        payload.student_gender = nextGender;
        payload.sex = nextGender;
        payload.student_sex = nextGender;
      }

      const candidateIds = editingStudent.updateIds?.length
        ? editingStudent.updateIds
        : [editingStudent.studentId];
      const [firstId, ...fallbackIds] = candidateIds.filter(Boolean);
      if (!firstId) {
        throw new Error("Missing student id for update.");
      }

      try {
        return await updateStudent(firstId, payload as any);
      } catch (firstError) {
        for (const id of fallbackIds) {
          try {
            return await updateStudent(id, payload as any);
          } catch {
            // try next id
          }
        }
        throw firstError;
      }
    },
    onSuccess: async () => {
      messageApi.success("Student updated successfully.");
      setEditingStudent(null);
      editForm.resetFields();
      await queryClient.invalidateQueries({
        queryKey: ["all-students-list", role, schoolId],
      });
      await queryClient.refetchQueries({
        queryKey: ["all-students-list", role, schoolId],
        type: "active",
      });
    },
    onError: (error: unknown) => {
      const message =
        (error as { message?: string })?.message?.trim() || "Failed to update student.";
      messageApi.error(message);
    },
  });

  const openEdit = (record: StudentListRow) => {
    if (!canEdit) {
      messageApi.warning("Only School Admin can edit student information.");
      return;
    }
    setEditingStudent(record);
    editForm.setFieldsValue({
      student_name: record.name,
      user_name: record.userName,
      email: record.email,
      status: record.status,
      gender: record.genderRaw || undefined,
      nationality: record.nationality || "",
      is_sen: record.isSen,
      sen_details: record.senDetails || "",
      password: "",
    });
  };

  const handleSaveEdit = async () => {
    if (!canEdit) {
      messageApi.warning("Only School Admin can edit student information.");
      return;
    }
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

          {isSchoolAdmin && (
            <Select
              value={subjectFilter}
              onChange={(value) => setSubjectFilter(value)}
              style={{ width: 240 }}
              placeholder="Filter by subject"
              options={[
                { label: "All Subjects", value: "all" },
                ...subjects.map((subject) => ({
                  label: displaySubjectName(subject.name),
                  value: displaySubjectName(subject.name).toLowerCase(),
                })),
              ]}
            />
          )}

          <Select
            mode="multiple"
            value={genderFilters}
            onChange={(value) =>
              setGenderFilters(value as Array<"Male" | "Female">)
            }
            style={{ width: 260 }}
            placeholder="Filter by gender (multi-select)"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            maxTagCount="responsive"
            allowClear
          />

          <Button onClick={resetFilters}>Reset Filters</Button>
          {isSchoolAdmin && (
            <>
              <Button onClick={() => setSelectedRowKeys([])} disabled={selectedRowKeys.length === 0}>
                Clear selection ({selectedRowKeys.length})
              </Button>
              <Button onClick={selectAllFiltered} disabled={filteredStudents.length === 0}>
                Select all (filtered) ({filteredStudents.length})
              </Button>
              <Button type="primary" onClick={openAssignDrawer} disabled={filteredStudents.length === 0}>
                Assign to subject
              </Button>
            </>
          )}
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
              rowSelection={
                isSchoolAdmin
                  ? {
                      selectedRowKeys,
                      onChange: (keys) => setSelectedRowKeys(keys),
                    }
                  : undefined
              }
              columns={[
                {
                  title: "Student Name",
                  dataIndex: "name",
                  key: "name",
                  render: (_: unknown, record: StudentListRow) => (
                    <Link
                      href={`/dashboard/students/${record.classId}/${record.profileId}/student_dashboard`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {record.name}
                    </Link>
                  ),
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
                  title: "Subjects",
                  dataIndex: "subjectNames",
                  key: "subjectNames",
                  render: (value: string[]) => {
                    if (!Array.isArray(value) || value.length === 0) return <Tag>Not linked</Tag>;
                    return (
                      <Space size={[4, 4]} wrap>
                        {value.map((name) => (
                          <Tag key={name}>{name}</Tag>
                        ))}
                      </Space>
                    );
                  },
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
                    canEdit ? (
                      <Button size="small" onClick={() => openEdit(record)}>
                        Edit
                      </Button>
                    ) : null
                  ),
                },
              ]}
            />
          </>
        )}
      </Card>

      {isSchoolAdmin && (
        <Drawer
          title="Assign selected students to one or more subjects"
          open={assignDrawerOpen}
          onClose={() => setAssignDrawerOpen(false)}
          width={420}
          destroyOnClose
        >
          <Form layout="vertical" form={assignForm} initialValues={{ scope: assignScope }}>
            {assignFeatureAvailable === false && assignFeatureMessage ? (
              <Alert
                className="mb-4"
                type="warning"
                showIcon
                message="Assignment unavailable"
                description={assignFeatureMessage}
              />
            ) : null}

            <Form.Item label="Assign scope">
              <Radio.Group value={assignScope} onChange={(e) => setAssignScope(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="selected" disabled={selectedRowKeys.length === 0}>
                    Selected only ({selectedRowKeys.length})
                  </Radio>
                  <Radio value="all_filtered">
                    All in current filters ({filteredStudents.length})
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="subject_ids"
              label="Subjects"
            >
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="label"
                placeholder="Select one or more subjects"
                options={assignSubjectOptions}
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item name="subject_class_ids" label="Existing Classes">
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="label"
                placeholder="Select any existing subject classes"
                options={filteredAssignSubjectClassOptions}
                maxTagCount="responsive"
              />
            </Form.Item>

            <Typography.Text type="secondary" className="block mb-4">
              You can now assign students to any existing subject class. If you choose only a subject and no class, the system will still use that subject&apos;s default class.
            </Typography.Text>

            <Space>
              <Button onClick={() => setAssignDrawerOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                loading={assignLoading || assignFeatureAvailable === null}
                disabled={assignFeatureAvailable === false}
                onClick={submitAssign}
              >
                Assign
              </Button>
            </Space>
          </Form>
        </Drawer>
      )}

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

          <Form.Item name="nationality" label="Nationality">
            <Input placeholder="e.g. British, Emirati, Egyptian" />
          </Form.Item>

          <Form.Item name="is_sen" valuePropName="checked">
            <Checkbox>SEN student</Checkbox>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, nextValues) =>
              prevValues?.is_sen !== nextValues?.is_sen
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("is_sen") ? (
                <Form.Item
                  name="sen_details"
                  label="SEN Details"
                  rules={[{ required: true, message: "Please add SEN details." }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Support plan, accommodations, key notes..."
                  />
                </Form.Item>
              ) : null
            }
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
