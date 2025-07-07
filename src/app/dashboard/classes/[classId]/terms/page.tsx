"use client";
import React, { useState, useEffect } from "react";
import TermsList from "@/components/dashboard/TermsList";
import { useParams } from "next/navigation";
import { Modal, Spin, Form, Input, Button } from "antd";
import { addTerm, deleteTerm, fetchTerm, updateTerm } from "@/services/termsApi";

export default function TermsPage() {
  const { classId } = useParams();
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTerm, setEditingTerm] = useState<{
    id: number | null;
    name: string;
  } | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [termToDelete, setTermToDelete] = useState<number | null>(null);
  const [form] = Form.useForm();

  const loadTerms = async () => {
    try {
      setLoading(true);
      const response = await fetchTerm(Number(classId));
      setTerms(response);
      setError(null);
    } catch (err) {
      setError("Failed to load terms");
      console.error("Error loading terms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, [classId]);

  const handleAddTerm = async (termData: { name: string }) => {
    try {
      await addTerm(Number(classId), termData);
      await loadTerms();
      setOpen(false);
      form.resetFields();
    } catch (err) {
      console.error("Error adding term:", err);
    }
  };

  const handleUpdateTerm = async (termData: { name: string }) => {
    if (!editingTerm?.id) return;
    try {
      await updateTerm(editingTerm.id, Number(classId), termData);
      await loadTerms();
      setEditingTerm(null);
      setOpen(false);
    } catch (err) {
      console.error("Error updating term:", err);
    }
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
    try {
      await deleteTerm(termToDelete);
      await loadTerms();
    } catch (err) {
      console.error("Error deleting term:", err);
    } finally {
      setDeleteConfirmVisible(false);
      setTermToDelete(null);
    }
  };

  const handleModalCancel = () => {
    setOpen(false);
    setEditingTerm(null);
    form.resetFields();
  };

  const handleModalOk = () => {
    form.submit();
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
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
        confirmLoading={loading}
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
      >
        <p>Are you sure you want to delete this term?</p>
      </Modal>
    </div>
  );
}
