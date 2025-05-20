"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface TermFormValues {
  name: string;
}

interface TermFormProps {
  onSubmit: (data: TermFormValues) => Promise<void>;
  onSubmitSuccess: () => void;
  initialData?: { name: string };
}

export default function TermForm({ 
  onSubmit, 
  onSubmitSuccess,
  initialData 
}: TermFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<TermFormValues>();
  const [error, setError] = useState<string | null>(null);

  // Set initial data if editing
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
    }
  }, [initialData, setValue]);

  const onFormSubmit = async (data: TermFormValues) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
      onSubmitSuccess();
    } catch (err) {
      setError("Failed to submit term. Please try again.");
      console.error("Error submitting term:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">Term Name</Label>
          <Input
            id="name"
            {...register("name", { required: "Term name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-auto float-right"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : initialData ? "Update Term" : "Create Term"}
      </Button>
    </form>
  );
}