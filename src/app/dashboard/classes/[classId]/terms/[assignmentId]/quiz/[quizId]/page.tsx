"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, X } from "lucide-react";
import { Button, Form, Divider, Input, Select, Checkbox, Space } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Quiz {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
}

const quizTypeLabels: Record<string, string> = {
  short: "Short Question",
  paragraph: "Paragraph",
  mcq: "Multiple Choice",
  checkbox: "Checkboxes",
  dropdown: "Dropdowns",
};

export default function QuranQuizPage() {
  const { trackerId, quizId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [quizForm] = Form.useForm();
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [quizType, setQuizType] = useState<string>("short");

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      type: "short",
      question: "What is the meaning of Iman?",
    },
    {
      id: "2",
      type: "paragraph",
      question: "Describe the importance of prayer in Islam.",
    },
    {
      id: "3",
      type: "mcq",
      question: "How many pillars of Islam are there?",
      options: ["Three", "Four", "Five", "Six"],
      correctAnswer: "Five",
    },
    {
      id: "4",
      type: "checkbox",
      question: "Which of the following are prophets?",
      options: ["Isa", "Musa", "Pharaoh", "Yunus"],
      correctAnswer: "Isa,Musa,Yunus",
    },
    {
      id: "5",
      type: "dropdown",
      question: "Select the first month of the Islamic calendar.",
      options: ["Muharram", "Ramadan", "Dhul Hijjah"],
      correctAnswer: "Muharram",
    },
  ]);

  const deleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const handleSubmitAnswers = () => {
    console.log("Submitting answers...");
    router.back();
  };

  const toggleAddQuestion = () => {
    setShowAddQuestion(!showAddQuestion);
    if (!showAddQuestion) {
      quizForm.resetFields();
      setQuizType("short");
    }
  };

  const [optionCount, setOptionCount] = useState(4); // Start with 4 options

  const addOption = () => {
    setOptionCount(prev => prev + 1);
  };

  const removeOption = () => {
    if (optionCount > 1) {
      setOptionCount(prev => prev - 1);
      // Remove the last option from form values
      const values = quizForm.getFieldsValue();
      delete values[`option${optionCount}`];
      quizForm.setFieldsValue(values);
    }
  };

  const handleAddQuestion = () => {
    quizForm.validateFields().then((values) => {
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        type: values.type,
        question: values.question,
      };

      if (["mcq", "checkbox", "dropdown"].includes(values.type)) {
        // Collect all options that have values
        const options = [];
        for (let i = 1; i <= optionCount; i++) {
          if (values[`option${i}`]) {
            options.push(values[`option${i}`]);
          }
        }
        newQuiz.options = options;
      }

      setQuizzes((prev) => [...prev, newQuiz]);
      setShowAddQuestion(false);
      quizForm.resetFields();
      setOptionCount(4); // Reset to default 4 options
    });
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Assements
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
          {canUpload && (
            <Button
              type="primary"
              onClick={toggleAddQuestion}
              icon={showAddQuestion ? <X size={16} /> : <Plus size={16} />}
            >
              {showAddQuestion ? "Cancel" : "Add Question"}
            </Button>
          )}
        </div>

        {showAddQuestion && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <Form form={quizForm} layout="vertical">
              <Form.Item
                name="type"
                label="Question Type"
                initialValue="short"
                rules={[{ required: true, message: "Please select a question type" }]}
              >
                <Select
                  placeholder="Select question type"
                  onChange={(val) => setQuizType(val)}
                >
                  <Select.Option value="short">Short Question</Select.Option>
                  <Select.Option value="paragraph">Paragraph</Select.Option>
                  <Select.Option value="mcq">Multiple Choice</Select.Option>
                  <Select.Option value="checkbox">Checkboxes</Select.Option>
                  <Select.Option value="dropdown">Dropdown</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="question"
                label="Question"
                rules={[{ required: true, message: "Please enter the question" }]}
              >
                <Input.TextArea rows={3} placeholder="Enter question" />
              </Form.Item>

              {["mcq", "checkbox", "dropdown"].includes(quizType) && (
                <>
                  <Divider orientation="left">Options</Divider>
                  
                  {Array.from({ length: optionCount }).map((_, index) => (
                    <Form.Item 
                      key={index}
                      name={`option${index + 1}`} 
                      label={`Option ${index + 1}`} 
                      rules={[{ required: index < 2, message: `Option ${index + 1} is required` }]}
                    >
                      <Input 
                        placeholder={`Enter option ${index + 1}`} 
                        suffix={
                          index >= 2 && (
                            <Button 
                              type="text" 
                              danger 
                              size="small" 
                              icon={<Trash2 size={14} />} 
                              onClick={() => {
                                // Remove specific option
                                const values = quizForm.getFieldsValue();
                                const updatedValues = {};
                                let shiftIndex = 1;
                                
                                // Reorganize the options to fill the gap
                                for (let i = 1; i <= optionCount; i++) {
                                  if (i !== index + 1) {
                                    updatedValues[`option${shiftIndex}`] = values[`option${i}`];
                                    shiftIndex++;
                                  }
                                }
                                
                                quizForm.setFieldsValue(updatedValues);
                                setOptionCount(prev => prev - 1);
                              }}
                              className="opacity-70 hover:opacity-100"
                            />
                          )
                        }
                      />
                    </Form.Item>
                  ))}

                  <div className="flex justify-start gap-3 mt-2">
                    <Button 
                      type="dashed" 
                      onClick={addOption}
                      icon={<Plus size={14} />}
                    >
                      Add Option
                    </Button>
                    {optionCount > 2 && (
                      <Button 
                        type="dashed" 
                        danger 
                        onClick={removeOption}
                        icon={<Trash2 size={14} />}
                      >
                        Remove Last Option
                      </Button>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={toggleAddQuestion}>Cancel</Button>
                <Button type="primary" onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </div>
            </Form>
          </div>
        )}

        <div className="p-6 space-y-6">
          {quizzes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No quizzes available.
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-700">Q:</span>{" "}
                    {quiz.question}
                  </div>
                  {canUpload && (
                    <Button
                      onClick={() => deleteQuiz(quiz.id)}
                      size="small"
                      danger
                      icon={<Trash2 size={14} />}
                    />
                  )}
                </div>

                <div className="mt-4">
                  {quiz.type === "short" && (
                    <Input placeholder="Your answer" />
                  )}

                  {quiz.type === "paragraph" && (
                    <Input.TextArea rows={4} placeholder="Your answer" />
                  )}

                  {quiz.type === "mcq" && (
                    <div className="space-y-2">
                      {quiz.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            type="radio"
                            id={`${quiz.id}-${idx}`}
                            name={`quiz-${quiz.id}`}
                            value={option}
                            className="mr-2"
                          />
                          <label htmlFor={`${quiz.id}-${idx}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}

                  {quiz.type === "checkbox" && (
                    <Checkbox.Group options={quiz.options || []} />
                  )}

                  {quiz.type === "dropdown" && (
                    <Select style={{ width: 200 }} placeholder="Select an answer">
                      {quiz.options?.map((opt, idx) => (
                        <Select.Option key={idx} value={opt}>
                          {opt}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Type: {quizTypeLabels[quiz.type] || quiz.type}
                </div>
              </div>
            ))
          )}
        </div>

        {!canUpload && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
            <Button type="primary" onClick={handleSubmitAnswers}>
              Submit Answers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}