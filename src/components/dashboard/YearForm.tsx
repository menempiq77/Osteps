"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface YearFormValues {
  id?: number;
  name: string;
  school_id?: number;
  terms?: number;
}

interface YearFormProps {
  onSubmit: (data: YearFormValues) => void;
  defaultValues?: YearFormValues | null;
}

export default function YearForm({ onSubmit, defaultValues }: YearFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<YearFormValues>();

  // Reset form when defaultValues changes (for edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name || "",
        school_id: defaultValues.school_id,
        terms: defaultValues.terms || 2,
        ...(defaultValues.id && { id: defaultValues.id })
      });
    } else {
      reset({
        name: "",
        terms: 2
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name" className="mb-1">Year Name</Label>
          <Input
            id="name"
            {...register("name", { required: "Year name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-auto float-right cursor-pointer">
        {defaultValues?.id ? "Update Year" : "Create Year"}
      </Button>
    </form>
  );
}