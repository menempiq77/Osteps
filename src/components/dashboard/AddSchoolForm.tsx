"use client";

import { useForm } from "react-hook-form";
import { Button, DatePicker, Form, Input } from "antd";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function AddSchoolForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: any) => void;
  defaultValues?: any;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      contactPerson: "",
      adminEmail: "",
      adminPassword: "",
      academicYear: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

   const parseAcademicYear = (yearString: string) => {
    if (!yearString) return [null, null];
    const [startYear, endYear] = yearString.split('-');
    return [
      dayjs(startYear, 'YYYY'),
      dayjs(endYear, 'YYYY'),
    ];
  };


  return (
    <Form   onFinish={handleSubmit(onSubmit)} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <Form.Item
            label="School Name"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message as string}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Contact Person"
            validateStatus={errors.contactPerson ? "error" : ""}
            help={errors.contactPerson?.message as string}
          >
            <Controller
              name="contactPerson"
              control={control}
              render={({ field }) => (
                <Input {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Admin Email"
            validateStatus={errors.adminEmail ? "error" : ""}
            help={errors.adminEmail?.message as string}
          >
            <Controller
              name="adminEmail"
              control={control}
              render={({ field }) => (
                <Input type="email" {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Admin Password"
            validateStatus={errors.adminPassword ? "error" : ""}
            help={errors.adminPassword?.message as string}
          >
            <Controller
              name="adminPassword"
              control={control}
              render={({ field }) => (
                <Input.Password {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Academic Year"
            validateStatus={errors.academicYear ? "error" : ""}
            help={errors.academicYear?.message as string}
          >
            <Controller
              name="academicYear"
              control={control}
              render={({ field }) => (
                <RangePicker
                  picker="year"
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      const value = `${dates[0].year()}-${dates[1].year()}`;
                      field.onChange(value);
                    } else {
                      field.onChange('');
                    }
                  }}
                  value={parseAcademicYear(field.value)}
                  style={{ width: '100%' }}
                />
              )}
            />
          </Form.Item>
        </div>

        <Button htmlType="submit" className="w-full !bg-primary !text-white hover:!bg-primary/90 !border-0">
          {defaultValues ? "Update School" : "Create School"}
        </Button>
    </Form>
  );
}