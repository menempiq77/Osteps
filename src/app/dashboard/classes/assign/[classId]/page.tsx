"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function AssignPage() {
  const { classId } = useParams();

  // Dummy data for teachers and students
  const teachers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Michael Brown" },
  ];

  const students = [
    { id: 101, name: "Alice Johnson" },
    { id: 102, name: "Bob Williams" },
    { id: 103, name: "Charlie Davis" },
  ];

  // State to track selected teachers and students
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Handle selection of teachers
  const toggleTeacher = (id: number) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  // Handle selection of students
  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Handle assignment (mock logic)
  const handleAssign = () => {
    console.log("Assigned Teachers:", selectedTeachers);
    console.log("Assigned Students:", selectedStudents);
    alert(`Assigned to Class ${classId}!`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center">
        Assign for Class ID: {classId}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Assign Teachers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Select teachers to assign to this class.</p>
            <div className="space-y-2 mt-3">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`teacher-${teacher.id}`}
                    checked={selectedTeachers.includes(teacher.id)}
                    onCheckedChange={() => toggleTeacher(teacher.id)}
                  />
                  <label
                    htmlFor={`teacher-${teacher.id}`}
                    className="text-sm font-medium"
                  >
                    {teacher.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assign Students Section */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Select students to enroll in this class.</p>
            <div className="space-y-2 mt-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <label
                    htmlFor={`student-${student.id}`}
                    className="text-sm font-medium"
                  >
                    {student.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Button */}
      <div className="mt-6 flex justify-center">
        <Button onClick={handleAssign} className="px-6">
          Assign Selected
        </Button>
      </div>
    </div>
  );
}
