"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface GradeFormValues {
  gradeName: string;
  minMark: number;
  maxMark: number;
  description?: string;
}

export default function AddGradeForm({
  onSubmit,
}: {
  onSubmit: (data: GradeFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="mb-1">Grade Letter (e.g., A, B, C)</Label>
          <Input
            {...register("gradeName", { required: "Grade letter is required" })}
            placeholder="A"
          />
          {errors.gradeName && (
            <p className="text-red-500 text-sm">{errors.gradeName.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1">Minimum Percentage</Label>
          <Input
            type="number"
            {...register("minMark", { 
              required: "Minimum mark is required",
              min: { value: 0, message: "Minimum mark must be 0 or higher" },
              max: { value: 100, message: "Minimum mark must be 100 or lower" }
            })}
            placeholder="0"
          />
          {errors.minMark && (
            <p className="text-red-500 text-sm">{errors.minMark.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1">Maximum Percentage</Label>
          <Input
            type="number"
            {...register("maxMark", { 
              required: "Maximum mark is required",
              min: { value: 0, message: "Maximum mark must be 0 or higher" },
              max: { value: 100, message: "Maximum mark must be 100 or lower" }
            })}
            placeholder="100"
          />
          {errors.maxMark && (
            <p className="text-red-500 text-sm">{errors.maxMark.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1">Description (Optional)</Label>
          <Input
            {...register("description")}
            placeholder="e.g., Excellent, Good, etc."
          />
        </div>
      </div>

      <Button type="submit" className="w-auto float-right">
        Add Grade Range
      </Button>
    </form>
  );
}