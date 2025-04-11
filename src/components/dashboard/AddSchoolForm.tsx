"use client";

import { useForm } from "react-hook-form";
import { SchoolFormValues } from "@/features/school/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

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

  const handleAcademicYearChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const from = dates[0].year();
      const to = dates[1].year();
      setValue("academicYear", `${from}-${to}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* School Name */}
        <div>
          <Label className="mb-1">School Name</Label>
          <Input
            {...register("name", { required: "School name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Contact Person */}
        <div>
          <Label className="mb-1">Contact Person</Label>
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
          <Label className="mb-1">Admin Email</Label>
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
          <Label className="mb-1">Admin Password</Label>
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

        {/* Academic Year (AntD RangePicker) */}
        <div>
          <Label className="mb-1">Academic Year</Label>
          <RangePicker
            picker="year"
            onChange={handleAcademicYearChange}
            className="w-full"
            placeholder={["From Year", "To Year"]}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create School
      </Button>
    </form>
  );
}
