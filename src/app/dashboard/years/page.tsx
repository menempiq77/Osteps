"use client";
import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import YearForm from "@/components/dashboard/YearForm";
import YearsList from "@/components/dashboard/YearsList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Breadcrumb, Spin, Modal } from "antd";
import Link from "next/link";
import {
  fetchYears,
  addYear as addYearApi,
  deleteYear as deleteYearApi,
  updateYear as updateYearApi,
  fetchYearsBySchool,
} from "@/services/yearsApi";

interface Year {
  id: number;
  name: string;
  school_id?: number;
  terms?: any;
  created_at?: string;
  updated_at?: string;
}

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<Year | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await fetchYearsBySchool();
        setYears(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load years");
        setLoading(false);
        console.error(err);
      }
    };
    loadYears();
  }, []);

  const handleSubmitYear = async (data: { name: string }) => {
    try {
      const yearData =
        currentUser?.role === "SCHOOL_ADMIN"
          ? { ...data, school_id: currentUser?.school }
          : data;

      if (currentYear) {
        await updateYearApi(currentYear.id, yearData);
      } else {
        const newYear = await addYearApi(yearData);
        setYears((prevYears) => [...prevYears, newYear]);
      }
      const updatedYears = await fetchYears();
      setYears(updatedYears);

      setIsModalOpen(false);
      setCurrentYear(null);
      messageApi.success(
        currentYear ? "Year updated successfully" : "Year added successfully"
      );
    } catch (err) {
      setError(currentYear ? "Failed to update year" : "Failed to add year");
      console.error(err);
      messageApi.success(
        currentYear ? "Failed to update year" : "Failed to add year"
      );
    }
  };

  const confirmDelete = (id: number) => {
    setYearToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (year: Year) => {
    setCurrentYear(year);
    setIsModalOpen(true);
  };

  const handleDeleteYear = async () => {
    if (!yearToDelete) return;

    try {
      await deleteYearApi(yearToDelete);
      setYears(years.filter((year) => year.id !== yearToDelete));
      setIsDeleteModalOpen(false);
      setYearToDelete(null);
      messageApi.success("Year deleted successfully");
    } catch (err) {
      setError("Failed to delete year");
      console.error(err);
      messageApi.error("Failed to delete Year");
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
            title: <span>Academic Years</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Academic Years</h1>
        {currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER" && (
          <Button
            type="primary"
            className="!bg-primary !text-white"
            onClick={() => {
              setCurrentYear(null);
              setIsModalOpen(true);
            }}
          >
            Add Year
          </Button>
        )}
      </div>
      <YearsList
        key={years?.length}
        years={years?.map((year) => ({
          id: year.id,
          name: year.name,
          school_id: year.school_id,
          terms: year.terms,
        }))}
        onDeleteYear={confirmDelete}
        onEditYear={(id) => {
          const year = years.find((y) => y.id === id);
          if (year) handleEditClick(year);
        }}
      />

      {/* Add/Edit Year Modal */}
      <Modal
        title={currentYear ? "Edit Year" : "Add New Year"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentYear(null);
        }}
        footer={null}
        centered
        destroyOnHidden
      >
        <YearForm
          onSubmit={handleSubmitYear}
          defaultValues={currentYear || undefined}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteYear}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setYearToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        {yearToDelete && (
          <p>
            Are you sure you want to delete this year? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
