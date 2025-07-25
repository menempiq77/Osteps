"use client";
import React, { useState, useEffect } from "react";
import AddClassForm from "@/components/dashboard/AddClassForm";
import ClassesList from "@/components/dashboard/ClassesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { Breadcrumb, Spin, Modal, Button, message } from "antd";
import Link from "next/link";
import { addClass, deleteClass, fetchClasses, updateClass } from "@/services/classesApi";

interface ApiClass {
  id: string;
  class_name: string;
  teacher_id: number;
  year_id: number;
  number_of_terms: string;
  teacher_name?: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const year_id = searchParams.get("year");

  const [modalOpen, setModalOpen] = useState(false);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentClass, setCurrentClass] = useState<ApiClass | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const data = await fetchClasses(year_id);
        setClasses(data);
      } catch (err) {
        setError("Failed to fetch classes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (year_id) {
      loadClasses();
    } else {
      setError("Year parameter is missing in URL");
      setLoading(false);
    }
  }, [year_id]);

  const handleAddClass = async (classData: {
    class_name: string;
    number_of_terms: string;
  }) => {
    try {
      if (!year_id) {
        throw new Error("Year parameter is missing");
      }

      const response = await addClass({
        ...classData,
        year_id: parseInt(year_id),
      });
      setClasses([...classes, response.data]);
      setModalOpen(false);
      messageApi.success("Class added successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add class");
      console.error(err);
      messageApi.error("Failed to delete Class");
    }
  };

  const handleEditClass = async (classData: {
    class_name: string;
    number_of_terms: string;
  }) => {
    try {
      if (!currentClass?.id) {
        throw new Error("Class ID is missing");
      }

      const updatedClass = await updateClass(parseInt(currentClass.id), {
        ...classData,
        year_id: currentClass.year_id,
      });

      setClasses(
        classes.map((cls) =>
          cls.id === currentClass.id ? updatedClass.data : cls
        )
      );
      setCurrentClass(null);
      setModalOpen(false);
      messageApi.success("Class Update successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update class");
      console.error(err);
      messageApi.error("Failed to Update Class");
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteClass(parseInt(id));
      setClasses(classes.filter((cls) => cls.id !== id));
      messageApi.success("Class deleted successfully");
    } catch (err) {
      setError("Failed to delete class");
      console.error(err);
      messageApi.error("Failed to delete Class");
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
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <Link href="/dashboard/years">Academic Years</Link>,
          },
          {
            title: <span>Classes</span>,
          },
        ]}
        className="!mb-2"
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        {currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER" && (
          <Button className="!bg-primary !text-white" onClick={() => setModalOpen(true)}>
            Add Class
          </Button>
        )}
      </div>

      <Modal
        title={currentClass ? "Edit Class" : "Add New Class"}
        open={modalOpen}
        onCancel={() => {
          setCurrentClass(null);
          setModalOpen(false);
        }}
        footer={null}
      >
        <AddClassForm
          onSubmit={currentClass ? handleEditClass : handleAddClass}
          initialData={currentClass}
          visible={modalOpen}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <ClassesList
        classes={classes}
        onDeleteClass={handleDeleteClass}
        onEditClass={(cls) => {
          setCurrentClass(cls);
          setModalOpen(true);
        }}
      />
    </div>
  );
}
