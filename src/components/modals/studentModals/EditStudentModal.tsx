"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

// Types
type Student = {
  id: string;
  name: string;
  studentClass: number;
  teacher: string;
  status: "active" | "inactive" | "suspended";
};

type StudentBasic = {
  id: string;
  name: string;
  studentClass: number;
  status: "active" | "inactive" | "suspended";
};

// Constants
const classOptions = [1, 2, 3, 4, 5, 6, 7, 8];
const statusOptions = ["active", "inactive", "suspended"] as const;

export const EditStudentModal = ({
  student,
  onClose,
  onSave,
}: {
  student: StudentBasic | null;
  onClose: () => void;
  onSave: (
    name: string,
    studentClass: number,
    status: "active" | "inactive" | "suspended"
  ) => void;
}) => {
  const [name, setName] = useState(student?.name || "");
  const [studentClass, setStudentClass] = useState(student?.studentClass || 1);
  const [status, setStatus] = useState<"active" | "inactive" | "suspended">(
    student?.status || "active"
  );
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setStudentClass(student.studentClass);
      setStatus(student.status);
    }
  }, [student]);

  if (!student) return null;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
          Edit Student
        </Dialog.Title>

        <div className="space-y-4 mt-4">
          <fieldset className="mb-[15px]">
            <label
              className="text-violet11 block text-sm font-medium mb-1"
              htmlFor="editStudentName"
            >
              Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="editStudentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>

          <fieldset className="mb-[15px]">
            <label
              className="text-violet11 block text-sm font-medium mb-1"
              htmlFor="editStudentClass"
            >
              Class
            </label>
            <div className="relative">
              <button
                id="editStudentClass"
                className="w-full p-2 border rounded-md text-left flex justify-between items-center"
                onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              >
                <span>{studentClass}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    isClassDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isClassDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {classOptions.map((item) => (
                    <div
                      key={item}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStudentClass(item);
                        setIsClassDropdownOpen(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="mb-[15px]">
            <label
              className="text-violet11 block text-sm font-medium mb-1"
              htmlFor="editStudentStatus"
            >
              Status
            </label>
            <div className="relative">
              <button
                id="editStudentStatus"
                className="w-full p-2 border rounded-md text-left flex justify-between items-center"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span>{status}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    isStatusDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {statusOptions.map((item) => (
                    <div
                      key={item}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setStatus(item);
                        setIsStatusDropdownOpen(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
        </div>

        <div className="mt-[25px] flex justify-end">
          <Dialog.Close asChild>
            <Button variant="outline" className="mr-2" onClick={onClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={() => onSave(name, studentClass, status)}>
            Save changes
          </Button>
        </div>
        <Dialog.Close asChild>
          <button
            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
            onClick={onClose}
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
