"use client";

import { useForm } from "react-hook-form";
import { SchoolFormValues } from "@/features/school/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
export default function AddYearForm({
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
      <div className="grid grid-cols-1 gap-4">
        {/* School Name */}
        <div>
          <Label className="mb-1">Year Name</Label>
          <Input
            {...register("name", { required: "Year name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-auto float-right">
        Create Year
      </Button>
    </form>
  );
}
