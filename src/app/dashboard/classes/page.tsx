"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import AddClassForm from "@/components/dashboard/AddClassForm";
import ClassesList from "@/components/dashboard/ClassesList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchClasses, deleteClass, addClass, updateClass } from "@/services/api";
import { useSearchParams } from "next/navigation";
import { Alert, Spin } from "antd";

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

  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentClass, setCurrentClass] = useState<ApiClass | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const data = await fetchClasses();
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
    teacher_id: number;
    number_of_terms: string;
  }) => {
    try {
      if (!currentUser?.id) {
        throw new Error("School ID is missing");
      }
      if (!year_id) {
        throw new Error("Year parameter is missing");
      }

      const response = await addClass({
        ...classData,
        year_id: parseInt(year_id),
      });
      setClasses([...classes, response.data]);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add class");
      console.error(err);
    }
  };

  const handleEditClass = async (classData: {
    class_name: string;
    teacher_id: number;
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
      
      setClasses(classes.map(cls => 
        cls.id === currentClass.id ? updatedClass.data : cls
      ));
      setCurrentClass(null);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update class");
      console.error(err);
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteClass(parseInt(id));
      setClasses(classes.filter((cls) => cls.id !== id));
    } catch (err) {
      setError("Failed to delete class");
      console.error(err);
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
        <h1 className="text-2xl font-bold">Classes</h1>
        {currentUser?.role !== "STUDENT" && currentUser?.role !== "TEACHER" && (
          <Dialog.Root open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
              setCurrentClass(null); // Reset current class when dialog closes
            }
            setOpen(isOpen);
          }}>
            <Dialog.Trigger asChild>
              <Button className="cursor-pointer">Add Class</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-lg font-bold mb-4">
                  {currentClass ? "Edit Class" : "Add New Class"}
                </Dialog.Title>
                <AddClassForm 
                  onSubmit={currentClass ? handleEditClass : handleAddClass}
                  initialData={currentClass}
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
      <ClassesList
        classes={classes}
        onDeleteClass={handleDeleteClass}
        onEditClass={(cls) => {
          setCurrentClass(cls);
          setOpen(true);
        }}
      />
    </div>
  );
}