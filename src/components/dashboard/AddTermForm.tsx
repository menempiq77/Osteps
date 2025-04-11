"use client";

import { useForm } from "react-hook-form";
import { SchoolFormValues } from "@/features/school/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function AddTermForm({
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
      <div className="grid grid-cols-1 gap-4">
        {/* School Name */}
        <div>
          <Label className="mb-1">Term Name</Label>
          <Input
            {...register("name", { required: "Term name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-auto float-right">
        Create Term
      </Button>
    </form>
  );
}
