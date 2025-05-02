"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { fetchTeachers } from "@/services/api";

interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  subjects: string[];
}

interface ClassFormValues {
  class_name: string;
  teacher_id: string;
  number_of_terms: string;
}

interface AddClassFormProps {
  onSubmit: (data: ClassFormValues) => void;
  initialData?: {
    id: string;
    class_name: string;
    teacher_id: number;
    year_id: number;
    number_of_terms: string;
    teacher_name?: string;
  } | null;
}

export default function AddClassForm({
  onSubmit,
  initialData,
}: AddClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ClassFormValues>();
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        const response = await fetchTeachers();
        const transformedTeachers = response.map((teacher: any) => ({
          id: teacher.id.toString(),
          name: teacher.teacher_name,
          phone: teacher.phone,
          email: teacher.email,
          subjects: teacher.subjects.split(',').map((s: string) => s.trim()),
        }));
        setTeachers(transformedTeachers);
      } catch (err) {
        setError("Failed to fetch teachers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  // Set initial form values when initialData changes
  useEffect(() => {
    if (initialData) {
      setValue('class_name', initialData.class_name);
      setValue('teacher_id', initialData.teacher_id.toString());
      setValue('number_of_terms', initialData.number_of_terms);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Class Name */}
        <div>
          <Label className="mb-1">Class Name</Label>
          <Input
            {...register("class_name", { required: "Class name is required" })}
          />
          {errors.class_name && (
            <p className="text-red-500 text-sm">{errors.class_name.message}</p>
          )}
        </div>

        {/* Assign Teacher */}
        <div>
          <Label className="mb-1">Assign Teacher</Label>
          <Select
            onValueChange={(value) => setValue("teacher_id", value)}
            defaultValue={initialData?.teacher_id?.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teacher_id && (
            <p className="text-red-500 text-sm">{errors.teacher_id.message}</p>
          )}
        </div>

        {/* Number of Terms */}
        <div>
          <Label className="mb-1">Number of Terms</Label>
          <Select
            onValueChange={(value) => setValue("number_of_terms", value)}
            defaultValue={initialData?.number_of_terms}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="two">Two Terms</SelectItem>
              <SelectItem value="three">Three Terms</SelectItem>
            </SelectContent>
          </Select>
          {errors.number_of_terms && (
            <p className="text-red-500 text-sm">{errors.number_of_terms.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer">
        {initialData ? "Update Class" : "Create Class"}
      </Button>
    </form>
  );
}