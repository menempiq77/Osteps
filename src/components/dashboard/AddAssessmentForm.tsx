"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Quiz {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
interface AddAssessmentFormProps {
  onSubmit: (data: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
  }) => void;
  isQuiz?: boolean;
  termId: string;
  quizzes: Quiz[];
}

export default function AddAssessmentForm({
  onSubmit,
  isQuiz = false,
  termId,
  quizzes,
}: AddAssessmentFormProps) {
  const [name, setName] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedName = isQuiz ? selectedQuiz : name;
    if (!submittedName) return;

    onSubmit({
      name: isQuiz
        ? quizzes.find((q) => String(q.id) === selectedQuiz)?.name ||
          selectedQuiz
        : name,
      term_id: termId,
      type: isQuiz ? "quiz" : "assessment",
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
              {quizzes.map((quiz) => (
                <SelectItem key={quiz.id} value={String(quiz.id)}>
                  {quiz.name}
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
        <Button type="button" className="cursor-pointer" variant="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={isQuiz && !selectedQuiz}
        >
          {isQuiz ? "Assign Quiz" : "Add Assessment"}
        </Button>
      </div>
    </form>
  );
}
