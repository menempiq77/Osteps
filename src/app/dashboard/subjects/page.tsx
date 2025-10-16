"use client";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Modal, Spin, message } from "antd";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/store/store";
import {
  fetchSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subjectsApi";
import SubjectForm from "@/components/dashboard/SubjectForm";
import SubjectsList from "@/components/dashboard/SubjectsList";

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
}

export default function Page() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<number | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const hasAccess = currentUser?.role === "SCHOOL_ADMIN";
  const isStudent = currentUser?.role === "STUDENT";

  const schoolId = currentUser?.school;

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     loadSubjects();
  }, []);

  const handleSubmitSubject = async (formData: {
    name: string;
  }) => {
    try {
      if (currentSubject) {
        await updateSubject(currentSubject.id.toString(), {
          ...formData,
          school_id: schoolId,
        });
        messageApi.success("Subject updated successfully");
      } else {
        await addSubject({ ...formData, school_id: schoolId });
        messageApi.success("Subject added successfully");
      }

      await loadSubjects();
      setOpen(false);
      setCurrentSubject(null);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to save subject");
    }
  };

  const confirmDelete = (id: number) => {
    setSubjectToDelete(id);
    setDeleteOpen(true);
  };

  const handleDeleteSubject = async () => {
    if (!subjectToDelete) return;

    try {
      await deleteSubject(subjectToDelete);
      setSubjects(subjects.filter((s) => s.id !== subjectToDelete));
      messageApi.success("Subject deleted successfully");
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to delete subject");
    } finally {
      setDeleteOpen(false);
      setSubjectToDelete(null);
    }
  };

  if (loading)
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
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>Subjects</span> },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subjects</h1>
        {hasAccess && (
          <>
            {/* <Button
              className="cursor-pointer !bg-primary !text-white !border-none"
              onClick={() => {
                setCurrentSubject(null);
                setOpen(true);
              }}
            >
              Add Subject
            </Button> */}

            <Modal
              title={currentSubject ? "Edit Subject" : "Add New Subject"}
              open={open}
              onCancel={() => {
                setOpen(false);
                setCurrentSubject(null);
              }}
              footer={null}
              destroyOnHidden
              centered
            >
              <SubjectForm
                onSubmit={handleSubmitSubject}
                defaultValues={
                  currentSubject
                    ? {
                        name: currentSubject.name,
                      }
                    : null
                }
                isOpen={open}
              />
            </Modal>
          </>
        )}
      </div>

      <SubjectsList
        subjects={subjects}
        onDeleteSubject={confirmDelete}
        onEditSubject={(subject) => {
          setCurrentSubject(subject);
          setOpen(true);
        }}
        isStudent={isStudent}
      />

      <Modal
        title="Confirm Deletion"
        open={deleteOpen}
        onOk={handleDeleteSubject}
        onCancel={() => setDeleteOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to delete this subject? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
