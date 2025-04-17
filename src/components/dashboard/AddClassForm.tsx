"use client";

import { useForm } from "react-hook-form";
import { SchoolFormValues } from "@/features/school/types";
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
export default function AddClassForm({
  onSubmit,
}: {
  onSubmit: (data: SchoolFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SchoolFormValues>({
    defaultValues: {
      terms: 2,
      academicYear: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* School Name */}
        <div>
          <Label className="mb-1">Class Name</Label>
          <Input
            {...register("name", { required: "School name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* AssignTeacher */}
        <div>
          <Label className="mb-1">AssignTeacher</Label>
          <Input
            {...register("contactPerson", {
              required: "AssignTeacher is required",
            })}
          />
          {errors.contactPerson && (
            <p className="text-red-500 text-sm">
              {errors.contactPerson.message}
            </p>
          )}
        </div>
      
        {/* Number of Terms */}
        <div className="w-full">
          <Label className="mb-1">Number of Terms</Label>
          <Select
            onValueChange={(value) => setValue("terms", parseInt(value))}
            defaultValue="2"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)]">
              <SelectItem value="2">Two Terms</SelectItem>
              <SelectItem value="3">Three Terms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer">
        Create Class
      </Button>
    </form>
  );
}
