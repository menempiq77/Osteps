"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const subjectOptions = [
  "Math",
  "Science",
  "English",
  "History",
  "Physics",
  "Chemistry",
] as const;

type Subject = typeof subjectOptions[number];

type TeacherBasic = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: Subject[];
};

export const EditTeacherModal = ({
  teacher,
  isOpen,
  onOpenChange,
  onSave,
}: {
  teacher: TeacherBasic | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: TeacherBasic) => void;
}) => {
  const [name, setName] = useState(teacher?.name || "");
  const [phone, setPhone] = useState(teacher?.phone || "");
  const [email, setEmail] = useState(teacher?.email || "");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(teacher?.subjects || []);

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
      setPhone(teacher.phone);
      setEmail(teacher.email);
      setSelectedSubjects(teacher.subjects);
    }
  }, [teacher]);

  const handleSubjectSelection = (subject: Subject) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((s) => s !== subject)
        : [...prevSubjects, subject]
    );
  };

  const handleSave = () => {
    if (!teacher) return;
    
    onSave({
      ...teacher,
      name,
      phone,
      email,
      subjects: selectedSubjects
    });
    onOpenChange(false);
  };

  if (!teacher) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[450px] max-h-[85vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-bold mb-4">
            Edit Teacher
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                className="w-full p-2 border rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4"
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