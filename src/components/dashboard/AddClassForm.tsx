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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
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

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(), // Ensure 'from' is always set
    to: new Date(new Date().getFullYear() + 1, 5, 30), // Default to end of next academic year
  });

  // Update academic year on date change
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      setValue(
        "academicYear",
        `${format(range.from, "yyyy")}-${format(range.to, "yyyy")}`
      );
    }
  };

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

      <Button type="submit" className="w-full">
        Create Class
      </Button>
    </form>
  );
}
