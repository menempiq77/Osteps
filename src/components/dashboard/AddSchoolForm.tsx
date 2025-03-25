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
export default function AddSchoolForm({
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* School Name */}
        <div>
          <Label>School Name</Label>
          <Input
            {...register("name", { required: "School name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Contact Person */}
        <div>
          <Label>Contact Person</Label>
          <Input
            {...register("contactPerson", {
              required: "Contact person is required",
            })}
          />
          {errors.contactPerson && (
            <p className="text-red-500 text-sm">
              {errors.contactPerson.message}
            </p>
          )}
        </div>

        {/* Admin Email */}
        <div>
          <Label>Admin Email</Label>
          <Input
            type="email"
            {...register("adminEmail", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.adminEmail && (
            <p className="text-red-500 text-sm">{errors.adminEmail.message}</p>
          )}
        </div>

        {/* Admin Password */}
        <div>
          <Label>Admin Password</Label>
          <Input
            type="password"
            {...register("adminPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.adminPassword && (
            <p className="text-red-500 text-sm">
              {errors.adminPassword.message}
            </p>
          )}
        </div>

        {/* Academic Year (Date Range Picker) */}
        <div className="relative">
          <Label>Academic Year</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[300px] justify-start text-left font-normal"
              >
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "yyyy")} - ${format(
                      dateRange.to,
                      "yyyy"
                    )}`
                  : "Select academic year"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Number of Terms */}
        <div>
          <Label>Number of Terms</Label>
          <Select
            onValueChange={(value) => setValue("terms", parseInt(value))}
            defaultValue="2"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Two Terms</SelectItem>
              <SelectItem value="3">Three Terms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create School
      </Button>
    </form>
  );
}
