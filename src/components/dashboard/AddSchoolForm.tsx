"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker } from "antd";
import { useEffect } from "react";

const { RangePicker } = DatePicker;

export default function AddSchoolForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: any) => void;
  defaultValues?: any;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      contactPerson: "",
      adminEmail: "",
      adminPassword: "",
      terms: 2,
      academicYear: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleAcademicYearChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const from = dates[0].year();
      const to = dates[1].year();
      setValue("academicYear", `${from}-${to}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>School Name</Label>
          <Input {...register("name", { required: "School name is required" })} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Contact Person</Label>
          <Input {...register("contactPerson", { required: "Contact person is required" })} />
          {errors.contactPerson && <p className="text-red-500 text-sm">{errors.contactPerson.message}</p>}
        </div>

        <div>
          <Label>Admin Email</Label>
          <Input
            type="email"
            {...register("adminEmail", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.adminEmail && <p className="text-red-500 text-sm">{errors.adminEmail.message}</p>}
        </div>

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
          {errors.adminPassword && <p className="text-red-500 text-sm">{errors.adminPassword.message}</p>}
        </div>

        <div>
          <Label>Academic Year</Label>
          <RangePicker picker="year" onChange={handleAcademicYearChange} className="w-full" />
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer">
        {defaultValues ? "Update School" : "Create School"}
      </Button>
    </form>
  );
}
