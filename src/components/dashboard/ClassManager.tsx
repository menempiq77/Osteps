"use client";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addClass } from "@/features/class/classSlice";
import TermConfigurator from "./TermConfigurator";
import { ClassFormValues, Term } from "@/features/class/types";
// type ClassFormValues = {
//   className: string;
//   gradeLevel: string;
//   terms: Term[];
// };

// type Term = {
//   name: string;
//   startDate: string;
//   endDate: string;
// };

export default function ClassManager({ schoolId }: { schoolId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClassFormValues>();

  const onSubmit = (data: ClassFormValues) => {
    dispatch(
      addClass({
        id: Date.now().toString(),
        name: data.className,
        schoolId,
        terms: data.terms.map((term) => ({
          ...term,
          id: Date.now().toString(), // Generate IDs for terms
        })),
      })
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Manage Classes</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            {...register("className", { required: "Class name is required" })}
            className={`w-full p-2 border rounded-md ${
              errors.className ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.className && (
            <p className="text-red-500 text-sm mt-1">
              {errors.className.message}
            </p>
          )}
        </div>

        <TermConfigurator
          control={control}
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Create Class
        </button>
      </form>
    </div>
  );
}
