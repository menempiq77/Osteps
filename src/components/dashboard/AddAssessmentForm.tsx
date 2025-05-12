"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@radix-ui/themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddAssessmentFormProps {
  onSubmit: (data: { name: string; type: "assessment" | "quiz" }) => void;
  isQuiz?: boolean;
}

export default function AddAssessmentForm({ onSubmit, isQuiz = false }: AddAssessmentFormProps) {
  const [name, setName] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const quizOptions = [
    { value: "quiz1", label: "Quiz 1" },
    { value: "quiz2", label: "Quiz 2" },
    { value: "quiz3", label: "Quiz 3" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedName = isQuiz ? selectedQuiz : name;
    if (!submittedName) return;
    
    onSubmit({
      name: isQuiz 
        ? quizOptions.find(q => q.value === selectedQuiz)?.label || selectedQuiz
        : name,
      type: isQuiz ? "quiz" : "assessment"
    });
    setName("");
    setSelectedQuiz("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={isQuiz ? "quiz-select" : "name"}>
          {isQuiz ? "Select Quiz" : "Assessment Name"}
        </Label>
        
        {isQuiz ? (
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz} required>
            <SelectTrigger id="quiz-select" className="w-full">
              <SelectValue placeholder="Select a quiz" />
            </SelectTrigger>
            <SelectContent>
              {quizOptions.map((quiz) => (
                <SelectItem key={quiz.value} value={quiz.value}>
                  {quiz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter assessment name"
            required
          />
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Dialog.Close asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Dialog.Close>
        <Button type="submit" disabled={isQuiz && !selectedQuiz}>
          {isQuiz ? "Add Quiz" : "Add Assessment"}
        </Button>
      </div>
    </form>
  );
}