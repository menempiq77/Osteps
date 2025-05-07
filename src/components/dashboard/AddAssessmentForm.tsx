"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@radix-ui/themes";

interface AddAssessmentFormProps {
  onSubmit: (data: { name: string; type: "assessment" | "quiz" }) => void;
  isQuiz?: boolean;
}

export default function AddAssessmentForm({ onSubmit, isQuiz = false }: AddAssessmentFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type: isQuiz ? "quiz" : "assessment"
    });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          {isQuiz ? "Quiz Name" : "Assessment Name"}
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isQuiz ? "Enter quiz name" : "Enter assessment name"}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Dialog.Close>
        <Button type="submit">
          {isQuiz ? "Add Quiz" : "Add Assessment"}
        </Button>
      </div>
    </form>
  );
}