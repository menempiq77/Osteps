"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { AddStudentModal } from "../modals/studentModals/AddStudentModal";
import { EditStudentModal } from "../modals/studentModals/EditStudentModal";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type Student = {
  id: string;
  name: string;
  studentClass: number;
  teacher?: string;
  status: 'active' | 'inactive' | 'suspended';
};

// Initial Data
const studentsData: Student[] = [
  { id: "1", name: "John", studentClass: 3, teacher: "Alice", status: 'active' },
  { id: "2", name: "Sarah", studentClass: 2, teacher: "Bob", status: 'active' },
  { id: "3", name: "Charlie", studentClass: 2, teacher: "Alice", status: 'inactive' },
  { id: "4", name: "David", studentClass: 2, teacher: "Bob", status: 'suspended' },
  { id: "5", name: "Eve", studentClass: 2, teacher: "Alice", status: 'active' },
];

export default function StudentList() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  const handleSaveEdit = (updatedStudent: Student) => {
    console.log("Updated Student in List:", updatedStudent);
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setEditStudent(null);
  };
  
  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((student) => student.id !== studentId));
    setDeleteStudent(null);
  };

  const handleAddNewStudent = (name: string, studentClass: number, status: 'active' | 'inactive' | 'suspended') => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      studentClass,
      teacher: "",
      status
    };
    setStudents([...students, newStudent]);
    setIsAddStudentModalOpen(false);
  };

  const handleStudentClick = (studentId: string) => {
    router.push(`/dashboard/terms/${studentId}`);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Dialog.Root open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
          <Dialog.Trigger asChild>
            <Button onClick={() => setIsAddStudentModalOpen(true)}>Add Student</Button>
          </Dialog.Trigger>
          <AddStudentModal
            isOpen={isAddStudentModalOpen}
            onOpenChange={setIsAddStudentModalOpen}
            onAddStudent={handleAddNewStudent}
          />
        </Dialog.Root>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">Registered Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleStudentClick(student.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.studentClass}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' :
                      student.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2">
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Button variant="ghost" size="icon" title="Edit" onClick={(e) => {
                            e.stopPropagation();
                            setEditStudent(student);
                          }}>
                            <Pencil2Icon className="h-4 w-4" />
                          </Button>
                        </Dialog.Trigger>
                        {editStudent?.id === student.id && (
                          <EditStudentModal
                            student={editStudent}
                            onClose={() => setEditStudent(null)}
                            onSave={handleSaveEdit}
                          />
                        )}
                      </Dialog.Root>

                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Button variant="ghost" size="icon" title="Delete" onClick={(e) => {
                            e.stopPropagation();
                            setDeleteStudent(student);
                          }}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </Dialog.Trigger>
                        {deleteStudent?.id === student.id && (
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md">
                              <Dialog.Title className="text-lg font-semibold">Confirm Deletion</Dialog.Title>
                              <p className="mt-2 text-gray-600">Are you sure you want to delete <strong>{deleteStudent.name}</strong>?</p>
                              <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setDeleteStudent(null)}>Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDeleteStudent(deleteStudent.id)}>Delete</Button>
                              </div>
                            </Dialog.Content>
                          </Dialog.Portal>
                        )}
                      </Dialog.Root>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}