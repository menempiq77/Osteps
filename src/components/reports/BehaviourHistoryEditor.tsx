"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { RootState } from "@/store/store";
import {
  deleteBehaviour,
  fetchBehaviourType,
  updateBehaviour,
} from "@/services/behaviorApi";

export type BehaviourEvent = {
  key: string;
  id: number;
  behaviourId: number;
  date: string;
  type: string;
  points: number;
  description: string;
};

type BehaviourType = {
  id: number | string;
  name: string;
  points: number;
  color?: string;
};

const formatDate = (value: unknown) => {
  const s = String(value ?? "").trim();
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString();
};

const toDateInput = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
  return d.toISOString().split("T")[0];
};

export default function BehaviourHistoryEditor({
  events,
  studentId,
  subjectId,
  canEdit,
  onChanged,
}: {
  events: BehaviourEvent[];
  studentId: number;
  subjectId?: number | null;
  canEdit: boolean;
  onChanged: () => void;
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [editing, setEditing] = useState<BehaviourEvent | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const { data: behaviourTypes = [] } = useQuery<BehaviourType[]>({
    queryKey: ["behaviour-types", subjectId ?? 0],
    queryFn: () => fetchBehaviourType(subjectId ?? undefined),
    enabled: canEdit,
  });

  const openEdit = (row: BehaviourEvent) => {
    setEditing(row);
    form.setFieldsValue({
      behaviour_id: row.behaviourId || undefined,
      description: row.description,
      date: toDateInput(row.date),
    });
  };

  const closeEdit = () => {
    setEditing(null);
    form.resetFields();
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const values = await form.validateFields();
      setSaving(true);
      await updateBehaviour(
        String(editing.id),
        {
          student_id: studentId,
          behaviour_id: values.behaviour_id,
          description: values.description,
          date: values.date || new Date().toISOString().split("T")[0],
          teacher_id: currentUser?.id,
        },
        subjectId ?? undefined
      );
      message.success("Behaviour updated.");
      closeEdit();
      onChanged();
    } catch (err) {
      if ((err as { errorFields?: unknown })?.errorFields) return;
      message.error("Failed to update behaviour.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: BehaviourEvent) => {
    try {
      setDeletingId(row.id);
      await deleteBehaviour(row.id, subjectId ?? undefined);
      message.success("Behaviour deleted.");
      onChanged();
    } catch {
      message.error("Failed to delete behaviour.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(() => {
    const base = [
      { title: "Date", dataIndex: "date", key: "date", render: formatDate, width: 110 },
      { title: "Type", dataIndex: "type", key: "type" },
      {
        title: "Points",
        dataIndex: "points",
        key: "points",
        width: 90,
        render: (v: number) => (
          <Tag color={v > 0 ? "green" : v < 0 ? "red" : "default"}>
            {v > 0 ? "+" : ""}
            {v}
          </Tag>
        ),
      },
      {
        title: "Note",
        dataIndex: "description",
        key: "description",
        render: (v: string) =>
          v ? (
            <Tooltip title={v}>
              <span className="line-clamp-1 max-w-[280px]">{v}</span>
            </Tooltip>
          ) : (
            "—"
          ),
      },
    ];
    if (!canEdit) return base;
    return [
      ...base,
      {
        title: "",
        key: "actions",
        width: 90,
        className: "no-print",
        render: (_: unknown, row: BehaviourEvent) => (
          <div className="no-print flex items-center gap-1">
            <Tooltip title="Edit">
              <Button
                size="small"
                type="text"
                icon={<EditOutlined />}
                disabled={!row.id}
                onClick={() => openEdit(row)}
              />
            </Tooltip>
            <Popconfirm
              title="Delete this behaviour entry?"
              okText="Delete"
              okButtonProps={{ danger: true, loading: deletingId === row.id }}
              onConfirm={() => handleDelete(row)}
            >
              <Tooltip title="Delete">
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!row.id}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, deletingId]);

  if (!events.length) {
    return <Empty description="No behaviour events." image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      <Table
        size="small"
        rowKey="key"
        dataSource={events}
        pagination={{ pageSize: 8, hideOnSinglePage: true }}
        columns={columns}
      />

      <Modal
        title="Edit behaviour"
        open={Boolean(editing)}
        onCancel={closeEdit}
        onOk={handleSave}
        okText="Save"
        confirmLoading={saving}
        width={560}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="behaviour_id"
            label="Behaviour type"
            rules={[{ required: true, message: "Please select a behaviour type" }]}
          >
            <Select placeholder="Select behaviour type">
              {behaviourTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  <Tag color={type.color}>{type.name}</Tag>(
                  {type.points > 0 ? "+" : ""}
                  {type.points} points)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Note"
            rules={[{ required: true, message: "Please enter a note" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the behaviour…" />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
