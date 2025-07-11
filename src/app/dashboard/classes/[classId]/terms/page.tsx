"use client";
import React, { useState, useEffect } from "react";
import TermsList from "@/components/dashboard/TermsList";
import { useParams } from "next/navigation";
import { Modal, Spin, Form, Input, Button, Breadcrumb, message } from "antd";
import {
  addTerm,
  deleteTerm,
  fetchTerm,
  updateTerm,
} from "@/services/termsApi";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function TermsPage() {
  const { classId } = useParams();
  const [open, setOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<{
    id: number | null;
    name: string;
  } | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [termToDelete, setTermToDelete] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  // Fetch terms with React Query
  const {
    data: terms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["terms", classId],
    queryFn: () => fetchTerm(Number(classId)),
    enabled: !!classId,
  });

  useEffect(() => {
    const savedYearId = localStorage.getItem("selectedYearId");
    if (savedYearId) {
      setSelectedYearId(Number(savedYearId));
    }
  }, [classId]);

  const addMutation = useMutation({
    mutationFn: (termData: { name: string }) =>
      addTerm(Number(classId), termData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms", classId] });
      messageApi.success("Term added successfully");
      setOpen(false);
      form.resetFields();
    },
    onError: () => {
      messageApi.error("Failed to add term");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      termData,
    }: {
      id: number;
      termData: { name: string };
    }) => updateTerm(id, Number(classId), termData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms", classId] });
      messageApi.success("Term updated successfully");
      setEditingTerm(null);
      setOpen(false);
    },
    onError: () => {
      messageApi.error("Failed to update term");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms", classId] });
      messageApi.success("Term deleted successfully");
      setDeleteConfirmVisible(false);
      setTermToDelete(null);
    },
    onError: () => {
      messageApi.error("Failed to delete term");
    },
  });

  const handleAddTerm = async (termData: { name: string }) => {
    addMutation.mutate(termData);
  };

  const handleUpdateTerm = async (termData: { name: string }) => {
    if (!editingTerm?.id) return;
    updateMutation.mutate({ id: editingTerm.id, termData });
  };

  const handleEditClick = (term: { id: number; name: string }) => {
    setEditingTerm(term);
    form.setFieldsValue({ name: term.name });
    setOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setTermToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteTerm = async () => {
    if (!termToDelete) return;
    deleteMutation.mutate(termToDelete);
  };

  const handleModalCancel = () => {
    setOpen(false);
    setEditingTerm(null);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/dashboard/years">Academic Years</Link>,
          },
          {
            title: selectedYearId ? (
              <Link href={`/dashboard/classes?year=${selectedYearId}`}>
                Classes
              </Link>
            ) : (
              <Link href="/dashboard/classes">Classes</Link>
            ),
          },
          {
            title: <span>Terms</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Terms</h1>
        <Button
          className="!bg-primary !text-white"
          onClick={() => setOpen(true)}
        >
          Add Term
        </Button>
      </div>

      <TermsList
        terms={terms}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit Term Modal */}
      <Modal
        title={editingTerm ? "Edit Term" : "Add New Term"}
        open={open}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingTerm ? "Update" : "Create"}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
        centered
        okButtonProps={{
          className: "!bg-primary hover:bg-primary-hover text-white",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingTerm ? handleUpdateTerm : handleAddTerm}
        >
          <Form.Item
            name="name"
            label="Term Name"
            rules={[{ required: true, message: "Please input the term name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteConfirmVisible}
        onOk={handleDeleteTerm}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        confirmLoading={deleteMutation.isPending}
        centered
      >
        <p>Are you sure you want to delete this term?</p>
      </Modal>
    </div>
  );
}
