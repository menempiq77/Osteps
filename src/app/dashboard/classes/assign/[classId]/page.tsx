"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function AssignPage() {
  const { classId } = useParams();

  const subjects = [
    {
      name: "Mathematics",
      teachers: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ],
    },
    {
      name: "Islamiyat",
      teachers: [
        { id: 3, name: "Michael Brown" },
        { id: 4, name: "Sarah Johnson" },
        { id: 5, name: "Ali Ahmed" },
      ],
    },
    {
      name: "Science",
      teachers: [
        { id: 6, name: "David Wilson" },
        { id: 7, name: "Emily Chen" },
      ],
    },
  ];

  const students = [
    { id: 101, name: "Alice Johnson" },
    { id: 102, name: "Bob Williams" },
    { id: 103, name: "Charlie Davis" },
  ];

  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const toggleTeacher = (id: number) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleAssignTeachers = () => {
    console.log("Assigned Teachers:", selectedTeachers);
    alert(`Assigned ${selectedTeachers.length} teachers to Class ${classId}!`);
  };

  const handleAssignStudents = () => {
    console.log("Assigned Students:", selectedStudents);
    alert(`Assigned ${selectedStudents.length} students to Class ${classId}!`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-3 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Assign for Class ID: {classId}
      </h2>

      <div className="flex flex-col gap-8">
        {/* Teachers Section */}
        <Card className="w-full py-0">
          <div className="bg-gray-50 rounded-t-lg p-4 border-b">
            <CardTitle className="text-lg py-2">
              Assign Teachers by Subject
            </CardTitle>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Select teachers to assign to this class.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="border rounded-lg p-0 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-blue-50 px-4 py-3 border-b">
                    <h3 className="font-semibold  text-lg">
                      {subject.name}
                    </h3>
                    <p className="text-xs">Subject Teachers</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {subject.teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                      >
                        <Checkbox
                          id={`teacher-${teacher.id}`}
                          checked={selectedTeachers.includes(teacher.id)}
                          onCheckedChange={() => toggleTeacher(teacher.id)}
                        />
                        <label
                          htmlFor={`teacher-${teacher.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {teacher.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleAssignTeachers}
                className="w-full sm:w-auto px-6 py-2 text-md bg-blue-600 hover:bg-blue-700"
                disabled={selectedTeachers.length === 0}
              >
                Assign Teachers ({selectedTeachers.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Section */}
        <Card className="w-full py-0">
          <div className="bg-gray-50 rounded-t-lg p-4 border-b">
            <CardTitle className="text-lg py-2">Assign Students</CardTitle>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Select students to enroll in this class.
            </p>
            <div className="space-y-3 mb-6">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <label
                    htmlFor={`student-${student.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {student.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleAssignStudents}
                className="w-full sm:w-auto px-6 py-2 text-md bg-green-600 hover:bg-green-700"
                disabled={selectedStudents.length === 0}
              >
                Assign Students ({selectedStudents.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}