"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

// Types
type Student = {
  id: string;
  name: string;
  email: string;
  studentClass: string;
  teacher: string;
  status: "active" | "inactive" | "suspended";
};

type StudentBasic = {
  id: string;
  name: string;
  email: string;
  studentClass: string;
  status: "active" | "inactive" | "suspended";
};

// Constants
const classOptions = ['Class A', 'Class B', 'Class C'];
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
    email: string,
    studentClass: string,
    status: "active" | "inactive" | "suspended"
  ) => void;
}) => {
  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [studentClass, setStudentClass] = useState(student?.studentClass || "Class A");
  const [status, setStatus] = useState<"active" | "inactive" | "suspended">(
    student?.status || "active"
  );
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
      setStudentClass(student.studentClass);
      setStatus(student.status);
    }
  }, [student]);

  if (!student) return null;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-lg font-bold mb-4">
          Edit Student
        </Dialog.Title>

        <div className="space-y-4">
          <fieldset className="mb-[15px]">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="editStudentName"
            >
              Name
            </label>
            <input
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="editStudentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>

          <fieldset className="mb-[15px]">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="editStudentEmail"
            >
              Email
            </label>
            <input
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="editStudentEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>

          <fieldset className="mb-[15px]">
            <label
              className="block text-sm font-medium mb-1"
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
              className="block text-sm font-medium mb-1"
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

        <div className="mt-6 flex justify-end gap-2">
          <Dialog.Close asChild>
            <Button variant="outline" className="cursor-pointer" onClick={onClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button 
            onClick={() => onSave(name, email, studentClass, status)} 
            className="cursor-pointer"
            disabled={!name.trim() || !email.trim()}
          >
            Save changes
          </Button>
        </div>
        <Dialog.Close asChild>
          <button
            className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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