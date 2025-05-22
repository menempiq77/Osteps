"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import YearForm from "@/components/dashboard/YearForm";
import YearsList from "@/components/dashboard/YearsList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchYears,
  addYear as addYearApi,
  deleteYear as deleteYearApi,
  updateYear as updateYearApi,
  fetchSchools,
} from "@/services/api";
import { Alert, Spin } from "antd";

interface Year {
  id: number;
  name: string;
  school_id?: number;
  terms?: any;
  created_at?: string;
  updated_at?: string;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<Year | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await fetchYears();
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
      const yearData = currentUser?.role === "SCHOOL_ADMIN" 
        ? { ...data, school_id: currentUser?.school }
        : data;
  
      if (currentYear) {
        await updateYearApi(currentYear.id, yearData);
      } else {
        const newYear = await addYearApi(yearData);
        setYears(prevYears => [...prevYears, newYear]);
      }
      const updatedYears = await fetchYears();
      setYears(updatedYears);
      
      setOpen(false);
      setCurrentYear(null);
    } catch (err) {
      setError(currentYear ? "Failed to update year" : "Failed to add year");
      console.error(err);
    }
  };

  const confirmDelete = (id: number) => {
    setYearToDelete(id);
    setDeleteOpen(true);
  };
  const handleEditClick = (year: Year) => {
    setCurrentYear(year);
    setOpen(true);
  };

  const handleDeleteYear = async () => {
    if (!yearToDelete) return;

    try {
      await deleteYearApi(yearToDelete);
      setYears(years.filter((year) => year.id !== yearToDelete));
      setDeleteOpen(false);
      setYearToDelete(null);
    } catch (err) {
      setError("Failed to delete year");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="p-3 md:p-6 flex justify-center items-center h-64">
      <Spin size="large" />
    </div>
  );
  if (error) return (
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
    <div className="p-3 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Academic Years</h1>
        {currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER" && (
          <Dialog.Root
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setCurrentYear(null);
              } else if (!currentYear) {
                setCurrentYear(null);
              }
            }}
          >
            <Dialog.Trigger asChild>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setCurrentYear(null);
                  setOpen(true);
                }}
              >
                Add Year
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-lg font-bold mb-4">
                  {currentYear ? "Edit Year" : "Add New Year"}
                </Dialog.Title>
                <YearForm
                  onSubmit={handleSubmitYear}
                  defaultValues={currentYear || undefined}
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
        )}
      </div>
      <YearsList
       key={years.length}
        years={years.map((year) => ({
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

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-lg font-bold mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="mb-6">
              Are you sure you want to delete this year? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button variant="destructive" onClick={handleDeleteYear}>
                Delete
              </Button>
            </div>

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
  );
}
