"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumb, Button, Card, Empty, Form, Select, Spin, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchTeachers } from "@/services/teacherApi";
import { fetchAdmins } from "@/services/adminsApi";
import { assignStaffSubjects, fetchStaffSubjectAssignments } from "@/services/subjectWorkspaceApi";

type StaffOption = {
  id: number;
  name?: string;
  email?: string;
  role?: string;
};

type AssignmentRow = {
  user_id: number;
  user_name: string;
  role_scope: "HOD" | "TEACHER";
  subject_id: number;
  subject_name: string;
};

type GroupedAssignment = {
  key: string;
  user_id: number;
  user_name: string;
  role_scope: "HOD" | "TEACHER";
  subjects: string[];
};

export default function SubjectStaffPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { subjects } = useSubjectContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const roleKey = String(currentUser?.role ?? "").toUpperCase();
  const canAssign = roleKey === "SCHOOL_ADMIN";
  const canView = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState<StaffOption[]>([]);
  const [hodCandidates, setHodCandidates] = useState<StaffOption[]>([]);
  const [roleScope, setRoleScope] = useState<"HOD" | "TEACHER">("TEACHER");
  const [rows, setRows] = useState<GroupedAssignment[]>([]);

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject) => ({
        label: subject.name,
        value: Number(subject.id),
      })),
    [subjects]
  );

  const userOptions = useMemo(() => {
    const source = roleScope === "HOD" ? hodCandidates : teachers;
    return source.map((user) => ({
      label: `${user.name || "Unnamed"}${user.email ? ` (${user.email})` : ""}`,
      value: Number(user.id),
    }));
  }, [roleScope, hodCandidates, teachers]);

  const loadRows = async () => {
    if (!canView) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchStaffSubjectAssignments();
      const map = new Map<string, GroupedAssignment>();
      (Array.isArray(data) ? data : []).forEach((item: AssignmentRow) => {
        const key = `${item.user_id}-${item.role_scope}`;
        const existing = map.get(key);
        if (existing) {
          existing.subjects.push(item.subject_name);
        } else {
          map.set(key, {
            key,
            user_id: Number(item.user_id),
            user_name: item.user_name,
            role_scope: item.role_scope,
            subjects: [item.subject_name],
          });
        }
      });
      setRows(Array.from(map.values()));
    } catch (error: any) {
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to load subject staff assignments");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStaffSources = async () => {
    try {
      const [teacherData, adminData] = await Promise.all([fetchTeachers(), fetchAdmins()]);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);

      const admins = Array.isArray(adminData) ? adminData : [];
      const hodOnly = admins.filter((admin: StaffOption) =>
        /HOD|HEAD_OF_DEPARTMENT/i.test(String(admin?.role || ""))
      );
      setHodCandidates(hodOnly.length > 0 ? hodOnly : admins);
    } catch {
      setTeachers([]);
      setHodCandidates([]);
    }
  };

  useEffect(() => {
    loadStaffSources();
    loadRows();
  }, [canView]);

  const submitAssignment = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await assignStaffSubjects({
        user_id: values.user_id,
        subject_ids: values.subject_ids,
        role_scope: values.role_scope,
      });
      messageApi.success("Staff subject assignments updated");
      form.resetFields();
      form.setFieldsValue({ role_scope: "TEACHER" });
      setRoleScope("TEACHER");
      await loadRows();
    } catch (error: any) {
      if (error?.errorFields) return;
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to assign staff subjects");
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<GroupedAssignment> = [
    {
      title: "Staff Member",
      dataIndex: "user_name",
      key: "user_name",
      render: (value: string, row) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">User ID: {row.user_id}</div>
        </div>
      ),
    },
    {
      title: "Role Scope",
      dataIndex: "role_scope",
      key: "role_scope",
      width: 160,
      render: (value: "HOD" | "TEACHER") => (
        <Tag color={value === "HOD" ? "purple" : "blue"}>{value}</Tag>
      ),
    },
    {
      title: "Assigned Subjects",
      dataIndex: "subjects",
      key: "subjects",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((subjectName) => (
            <Tag key={subjectName} color="green">
              {subjectName}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  if (!canView) {
    return (
      <div className="p-3 md:p-6">
        {contextHolder}
        <Card>
          <Empty description="You do not have access to subject staff management." />
        </Card>
      </div>
    );
  }

  return (
    <div className="premium-page rounded-2xl p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/manager">Manager</Link> },
          { title: <span>Subject Staff</span> },
        ]}
        className="!mb-2"
      />

      <div className="premium-hero mb-6 rounded-2xl p-4 md:p-5">
        <h1 className="text-2xl font-bold">Subject Staff Assignments</h1>
        <p className="text-sm text-gray-600 mt-1">
          Assign HODs and teachers to one or more subjects, then switch into subject workspaces.
        </p>
      </div>

      {canAssign ? (
        <Card className="rounded-xl mb-5" title="Assign Staff to Subjects">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              role_scope: "TEACHER",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Form.Item
                label="Role scope"
                name="role_scope"
                rules={[{ required: true, message: "Select role scope" }]}
              >
                <Select
                  options={[
                    { label: "Teacher", value: "TEACHER" },
                    { label: "HOD", value: "HOD" },
                  ]}
                  onChange={(value) => {
                    setRoleScope(value);
                    form.setFieldValue("user_id", undefined);
                  }}
                />
              </Form.Item>
              <Form.Item
                label={roleScope === "HOD" ? "HOD" : "Teacher"}
                name="user_id"
                rules={[{ required: true, message: "Select a staff member" }]}
              >
                <Select
                  showSearch
                  placeholder={`Select ${roleScope === "HOD" ? "HOD" : "teacher"}`}
                  optionFilterProp="label"
                  options={userOptions}
                />
              </Form.Item>
              <Form.Item
                label="Subjects"
                name="subject_ids"
                rules={[{ required: true, message: "Select at least one subject" }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  placeholder="Select one or more subjects"
                  optionFilterProp="label"
                  options={subjectOptions}
                />
              </Form.Item>
            </div>
            <Button
              type="primary"
              className="!bg-primary !border-none"
              loading={saving}
              onClick={submitAssignment}
            >
              Save Assignment
            </Button>
          </Form>
        </Card>
      ) : null}

      <Card className="rounded-xl" title="Current Staff Subject Assignments">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Table
            rowKey="key"
            dataSource={rows}
            columns={columns}
            locale={{ emptyText: "No staff subject assignments found." }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
}
