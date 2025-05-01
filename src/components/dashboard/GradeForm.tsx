"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface GradeFormValues {
  gradeName: string;
  minMark: number;
  maxMark: number;
  description?: string;
}

interface GradeFormProps {
  onSubmit: (data: GradeFormValues) => void;
  defaultValues?: GradeFormValues | null;
  isOpen: boolean; // Add this prop
}

export default function GradeForm({ onSubmit, defaultValues, isOpen }: GradeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeFormValues>();

  // Reset form when defaultValues or isOpen changes
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || {
        gradeName: "",
        minMark: 0,
        maxMark: 100,
        description: ""
      });
    }
  }, [defaultValues, isOpen, reset]);
  
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="cursor-pointer">
          {defaultValues ? "Update Grade" : "Add Grade"}
        </Button>
      </div>
    </form>
  );
}