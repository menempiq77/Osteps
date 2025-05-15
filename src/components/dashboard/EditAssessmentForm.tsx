"use client";
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
import { useState } from "react";

interface EditAssessmentFormProps {
  onSubmit: (data: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
  }) => void;
  onCancel: () => void;
  initialData: {
    name: string;
    type: "assessment" | "quiz";
    term_id: string;
  };
  quizzes: { id: string | number; name: string }[];
}

export default function EditAssessmentForm({
  onSubmit,
  onCancel,
  initialData,
  quizzes,
}: EditAssessmentFormProps) {
  const [name, setName] = useState(initialData.name);
  const [type, setType] = useState<"assessment" | "quiz">(initialData.type);
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name:
        type === "quiz"
          ? quizzes.find((q) => String(q.id) === selectedQuiz)?.name ||
            selectedQuiz
          : name,
      term_id: initialData.term_id,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={type}
          onValueChange={(value: "assessment" | "quiz") => setType(value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="assessment">Assessment</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === "quiz" ? (
        <div className="space-y-2">
          <Label htmlFor="quiz-select">Select Quiz</Label>
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
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="name">Assessment Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter assessment name"
            required
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Assessment</Button>
      </div>
    </form>
  );
}
