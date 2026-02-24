"use client";
import { useFieldArray, Control } from "react-hook-form";

export default function TermConfigurator({
  control,
  register,
  errors,
}: {
  control: Control<any>;
  register: any;
  errors: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "terms",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">
          Terms Configuration
        </h4>
        <button
          type="button"
          onClick={() => append({ name: "", startDate: "", endDate: "" })}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Term
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded-md space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Term {index + 1}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Term Name</label>
              <input
                {...register(`terms.${index}.name`, {
                  required: "Term name is required",
                })}
                className="w-full p-2 border rounded-md border-gray-300"
              />
              {errors.terms?.[index]?.name && (
                <p className="text-red-500 text-sm">
                  {errors.terms[index].name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                {...register(`terms.${index}.startDate`, {
                  required: "Start date is required",
                })}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">End Date</label>
              <input
                type="date"
                {...register(`terms.${index}.endDate`, {
                  required: "End date is required",
                })}
                className="w-full p-2 border rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
