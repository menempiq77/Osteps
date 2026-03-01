"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumb, Button, Card, Empty, Form, Input, Modal, Select, Spin, Table, Tag, message } from "antd";
import { useSelector } from "react-redux";
import type { ColumnsType } from "antd/es/table";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchStudents } from "@/services/studentsApi";
import { createSubjectClass, enrollStudentsToSubjectClass, fetchSubjectClasses } from "@/services/subjectWorkspaceApi";

type YearOption = { id: number; name: string };
type ClassOption = { id: number; class_name?: string; name?: string; year_id?: number };
type StudentOption = { id: number; student_name?: string; name?: string; email?: string };
type SubjectClassItem = {
  id: number;
  name: string;
  year_id?: number | null;
  base_class_label?: string | null;
  is_active?: number | boolean;
};

export default function SubjectClassesPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubject, activeSubjectId } = useSubjectContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [createForm] = Form.useForm();
  const [enrollForm] = Form.useForm();

  const roleKey = String(currentUser?.role ?? "").toUpperCase();
  const canCreate = roleKey === "SCHOOL_ADMIN" || roleKey === "HOD";
  const canEnroll = canCreate || roleKey === "TEACHER";

  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState<YearOption[]>([]);
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassItem[]>([]);
  const [yearFilterId, setYearFilterId] = useState<number | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [selectedSubjectClassId, setSelectedSubjectClassId] = useState<number | null>(null);
  const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
  const [availableStudents, setAvailableStudents] = useState<StudentOption[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const schoolId = currentUser?.school;

  const yearNameMap = useMemo(() => {
    const map = new Map<number, string>();
    years.forEach((y) => map.set(Number(y.id), y.name));
    return map;
  }, [years]);

  const loadYears = async () => {
    if (!schoolId) return;
    try {
      const data = await fetchYearsBySchool(Number(schoolId));
      setYears(Array.isArray(data) ? data : []);
    } catch {
      setYears([]);
    }
  };

  const loadSubjectClasses = async () => {
    if (!activeSubjectId) {
      setSubjectClasses([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchSubjectClasses({
        subject_id: Number(activeSubjectId),
        year_id: yearFilterId,
      });
      setSubjectClasses(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setSubjectClasses([]);
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to load subject classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, [schoolId]);

  useEffect(() => {
    loadSubjectClasses();
  }, [activeSubjectId, yearFilterId]);

  const handleCreate = async () => {
    if (!activeSubjectId) return;
    try {
      const values = await createForm.validateFields();
      await createSubjectClass({
        subject_id: Number(activeSubjectId),
        year_id: values.year_id,
        name: values.name,
        base_class_label: values.base_class_label || undefined,
      });
      messageApi.success("Subject class created");
      setCreateOpen(false);
      createForm.resetFields();
      await loadSubjectClasses();
    } catch (error: any) {
      if (error?.errorFields) return;
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to create subject class");
    }
  };

  const openEnrollModal = (subjectClassId: number) => {
    setSelectedSubjectClassId(subjectClassId);
    enrollForm.resetFields();
    setAvailableClasses([]);
    setAvailableStudents([]);
    setEnrollOpen(true);
  };

  const handleYearSelectionForEnroll = async (yearIds: number[]) => {
    if (!yearIds || yearIds.length === 0) {
      setAvailableClasses([]);
      enrollForm.setFieldValue("class_ids", []);
      setAvailableStudents([]);
      enrollForm.setFieldValue("student_ids", []);
      return;
    }

    setLoadingClasses(true);
    try {
      const lists = await Promise.all(yearIds.map((yearId) => fetchClasses(String(yearId))));
      const merged = lists.flat();
      const map = new Map<number, ClassOption>();
      merged.forEach((item: ClassOption) => {
        const id = Number(item?.id);
        if (!Number.isFinite(id)) return;
        map.set(id, item);
      });
      setAvailableClasses(Array.from(map.values()));
    } catch (error: any) {
      setAvailableClasses([]);
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to load classes");
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleClassSelectionForEnroll = async (classIds: number[]) => {
    if (!classIds || classIds.length === 0) {
      setAvailableStudents([]);
      enrollForm.setFieldValue("student_ids", []);
      return;
    }

    setLoadingStudents(true);
    try {
      const lists = await Promise.all(classIds.map((classId) => fetchStudents(classId)));
      const merged = lists.flat();
      const map = new Map<number, StudentOption>();
      merged.forEach((item: StudentOption) => {
        const id = Number(item?.id);
        if (!Number.isFinite(id)) return;
        map.set(id, item);
      });
      setAvailableStudents(Array.from(map.values()));
    } catch (error: any) {
      setAvailableStudents([]);
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedSubjectClassId) return;
    try {
      const values = await enrollForm.validateFields();
      await enrollStudentsToSubjectClass({
        subject_class_id: selectedSubjectClassId,
        student_ids: values.student_ids,
      });
      messageApi.success("Students enrolled");
      setEnrollOpen(false);
      enrollForm.resetFields();
    } catch (error: any) {
      if (error?.errorFields) return;
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to enroll students");
    }
  };

  const columns: ColumnsType<SubjectClassItem> = [
    {
      title: "Subject Class",
      dataIndex: "name",
      key: "name",
      render: (value: string, row) => (
        <div>
          <div className="font-semibold text-gray-900">{value || `Class ${row.id}`}</div>
          {row.base_class_label ? <div className="text-xs text-gray-500">Base: {row.base_class_label}</div> : null}
        </div>
      ),
    },
    {
      title: "Year",
      dataIndex: "year_id",
      key: "year_id",
      render: (value?: number | null) =>
        value ? <Tag color="blue">{yearNameMap.get(Number(value)) || `Year ${value}`}</Tag> : <Tag>Not set</Tag>,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: 130,
      render: (value?: number | boolean) =>
        Number(value ?? 1) === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
  ];

  if (!activeSubjectId) {
    return (
      <div className="p-3 md:p-6">
        {contextHolder}
        <Card>
          <Empty description="Select a subject from the top switcher to manage subject classes." />
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
          { title: <span>Subject Classes</span> },
        ]}
        className="!mb-2"
      />

      <div className="premium-hero mb-6 rounded-2xl p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Subject Classes</h1>
            <p className="text-sm text-gray-600 mt-1">
              Active subject: <span className="font-semibold">{activeSubject?.name || `Subject ${activeSubjectId}`}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              allowClear
              placeholder="Filter by year"
              className="min-w-[220px]"
              value={yearFilterId}
              onChange={(value) => setYearFilterId(value)}
              options={years.map((year) => ({ label: year.name, value: Number(year.id) }))}
            />
            {canCreate ? (
              <Button type="primary" className="!bg-primary !border-none" onClick={() => setCreateOpen(true)}>
                Create Subject Class
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <Card className="rounded-xl">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Table
            rowKey="id"
            dataSource={subjectClasses}
            columns={[
              ...columns,
              {
                title: "Actions",
                key: "actions",
                width: 170,
                render: (_, row) =>
                  canEnroll ? (
                    <Button onClick={() => openEnrollModal(Number(row.id))}>Enroll Students</Button>
                  ) : (
                    <span className="text-gray-400 text-sm">View only</span>
                  ),
              },
            ]}
            locale={{ emptyText: "No subject classes yet." }}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title="Create Subject Class"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreate}
        okText="Create"
        destroyOnHidden
      >
        <Form layout="vertical" form={createForm}>
          <Form.Item
            label="Class Name"
            name="name"
            rules={[{ required: true, message: "Enter class name" }]}
          >
            <Input placeholder="e.g. Y7A-Math" />
          </Form.Item>
          <Form.Item label="Year" name="year_id">
            <Select
              allowClear
              placeholder="Optional year"
              options={years.map((year) => ({ label: year.name, value: Number(year.id) }))}
            />
          </Form.Item>
          <Form.Item label="Base Class Label" name="base_class_label">
            <Input placeholder="e.g. Y7A" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Enroll Students into Subject Class"
        open={enrollOpen}
        onCancel={() => setEnrollOpen(false)}
        onOk={handleEnroll}
        okText="Enroll"
        destroyOnHidden
      >
        <Form layout="vertical" form={enrollForm}>
          <Form.Item label="Year groups (to load classes)" name="year_ids">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select one or more year groups"
              options={years.map((year) => ({ label: year.name, value: Number(year.id) }))}
              onChange={handleYearSelectionForEnroll}
            />
          </Form.Item>
          <Form.Item label="Classes" name="class_ids">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select classes to load students"
              loading={loadingClasses}
              options={availableClasses.map((cls) => ({
                label: String(cls.class_name || cls.name || `Class ${cls.id}`),
                value: Number(cls.id),
              }))}
              onChange={handleClassSelectionForEnroll}
            />
          </Form.Item>
          <Form.Item
            label="Students"
            name="student_ids"
            rules={[{ required: true, message: "Select at least one student" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select one or more students"
              loading={loadingStudents}
              options={availableStudents.map((student) => ({
                label: String(student.student_name || student.name || student.email || `Student ${student.id}`),
                value: Number(student.id),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
