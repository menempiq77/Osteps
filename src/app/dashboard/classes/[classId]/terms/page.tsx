"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { fetchTerm, addTerm, updateTerm, deleteTerm } from "@/services/api";
import TermsList from "@/components/dashboard/TermsList";
import { useParams } from "next/navigation";
import TermForm from "@/components/dashboard/TermForm";
import { Alert, Modal, Spin } from "antd";

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
      // Refetch terms after adding
      await loadTerms();
      setOpen(false);
    } catch (err) {
      console.error("Error adding term:", err);
    }
  };

  const handleUpdateTerm = async (termData: { name: string }) => {
    if (!editingTerm?.id) return;
    try {
      await updateTerm(editingTerm.id, Number(classId), termData);
      // Refetch terms after updating
      await loadTerms();
      setEditingTerm(null);
    } catch (err) {
      console.error("Error updating term:", err);
    }
  };

  const handleEditClick = (term: { id: number; name: string }) => {
    setEditingTerm(term);
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
      // Refetch terms after deleting
      await loadTerms();
    } catch (err) {
      console.error("Error deleting term:", err);
    } finally {
      setDeleteConfirmVisible(false);
      setTermToDelete(null);
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="p-3 md:p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Terms</h1>
        <Dialog.Root
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditingTerm(null);
            }
            setOpen(isOpen);
          }}
        >
          <Dialog.Trigger asChild>
            <Button className="cursor-pointer">Add Term</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-lg font-bold mb-4">
                {editingTerm ? "Edit Term" : "Add New Term"}
              </Dialog.Title>
              <TermForm
                onSubmitSuccess={() => setOpen(false)}
                onSubmit={editingTerm ? handleUpdateTerm : handleAddTerm}
                initialData={editingTerm || undefined}
              />
              <Dialog.Close asChild>
                <button
                  className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <TermsList
        terms={terms}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

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
