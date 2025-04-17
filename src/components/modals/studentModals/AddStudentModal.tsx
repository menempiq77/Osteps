import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Cross2Icon, ChevronDownIcon } from "@radix-ui/react-icons";

const classOptions = [1, 2, 3, 4, 5, 6, 7, 8];
const statusOptions = ['active', 'inactive', 'suspended'] as const;

export const AddStudentModal = ({
  isOpen,
  onOpenChange,
  onAddStudent,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStudent: (name: string, studentClass: number, status: 'active' | 'inactive' | 'suspended') => void;
}) => {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleSubmit = () => {
    onAddStudent(name, selectedClass, selectedStatus);
    setName("");
    setSelectedClass(1);
    setSelectedStatus('active');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-lg font-bold mb-4">
            Add New Student
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Student Name
              </label>
              <input
                id="studentName"
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Student name"
              />
            </div>

            <div>
              <label
                htmlFor="studentsClass"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Class
              </label>
              <div className="relative">
                <button
                  id="studentsClass"
                  className="w-full p-2 border rounded-md text-left flex justify-between items-center"
                  onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                >
                  <span>{selectedClass}</span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${
                    isClassDropdownOpen ? "rotate-180" : ""
                  }`} />
                </button>
                {isClassDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {classOptions.map((item) => (
                      <div
                        key={item}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedClass(item);
                          setIsClassDropdownOpen(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="studentStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <div className="relative">
                <button
                  id="studentStatus"
                  className="w-full p-2 border rounded-md text-left flex justify-between items-center"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <span>{selectedStatus}</span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${
                    isStatusDropdownOpen ? "rotate-180" : ""
                  }`} />
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {statusOptions.map((item) => (
                      <div
                        key={item}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedStatus(item);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleSubmit} disabled={!name.trim()} className="cursor-pointer">
              Add Student
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};