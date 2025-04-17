import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

const subjectOptions = [
  "Math",
  "Science",
  "English",
  "History",
  "Physics",
  "Chemistry",
] as const;

type Subject = typeof subjectOptions[number];

interface AddTeacherModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddTeacher: (teacher: {
    name: string;
    phone: string;
    email: string;
    subjects: Subject[];
  }) => void;
  onClose?: () => void;
}

export const AddTeacherModal = ({
  isOpen,
  onOpenChange,
  onAddTeacher,
  onClose,
}: AddTeacherModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const handleSubjectSelection = (subject: Subject) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((s) => s !== subject)
        : [...prevSubjects, subject]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    
    onAddTeacher({ 
      name: name.trim(), 
      phone: phone.trim(), 
      email: email.trim(), 
      subjects: selectedSubjects 
    });
    resetForm();
    onClose?.();
    onOpenChange?.(false);
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setSelectedSubjects([]);
  };

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg min-w-md max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            Add New Teacher
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Teacher Name*
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter teacher name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subjects</label>
              <div className="grid grid-cols-2 gap-2">
                {subjectOptions.map((subject) => (
                  <label key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => handleSubjectSelection(subject)}
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" onClick={handleClose} className="cursor-pointer">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleSubmit} disabled={!name.trim() || !email.trim()} className="cursor-pointer">
              Add Teacher
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2"
              aria-label="Close"
              onClick={handleClose}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};