"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AssessmentFormValues {
  name: string;
}

export default function AddAssessmentForm({
  onSubmit,
}: {
  onSubmit: (data: AssessmentFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="mb-1">Assessment Name</Label>
          <Input
            {...register("name", { required: "Assessment name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-auto float-right">
        Create Assessment
      </Button>
    </form>
  );
}