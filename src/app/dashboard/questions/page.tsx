"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Divider,
  Form,
  Select,
  message,
} from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchClasses, fetchTeachers, fetchYears } from "@/services/api";

const { TextArea } = Input;
const { Option } = Select;

type Question = {
  id: string;
  content: string;
  studentName: string;
  teacherName: string;
  year: string;
  class: string;
  createdAt: string;
  answers: Answer[];
};

type Answer = {
  id: string;
  content: string;
  teacherName: string;
  createdAt: string;
};

const teachersList = ["Mr. Smith", "Ms. Johnson", "Mrs. Lee"];
const yearOptions = ["Year 1", "Year 2", "Year 3"];
const classOptions = ["Class A", "Class B", "Class C"];

const AskQuestionPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      content:
        "How do I solve this math problem? The equation is x² + 2x - 3 = 0.",
      studentName: "John Doe",
      teacherName: "Mr. Smith",
      year: "Year 1",
      class: "Class A",
      createdAt: "2023-05-15T10:30:00",
      answers: [
        {
          id: "1-1",
          content:
            "You can solve this quadratic equation using the quadratic formula or by factoring.",
          teacherName: "Mr. Smith",
          createdAt: "2023-05-15T11:45:00",
        },
      ],
    },
    {
      id: "2",
      content:
        "I need help understanding Shakespeare's Hamlet, specifically Act 3 Scene 1.",
      studentName: "Jane Smith",
      teacherName: "Ms. Johnson",
      year: "Year 2",
      class: "Class B",
      createdAt: "2023-05-16T09:15:00",
      answers: [],
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTeachers();
      console.log("Teachers response:", response); 
      setTeachers(response);
    } catch (err) {
      setError("Failed to fetch teachers");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const loadYears = async () => {
    try {
      const data = await fetchYears();
      console.log("Years response:", data); 
      setYears(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load years");
      setIsLoading(false);
      console.error(err);
    }
  };
  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const data = await fetchClasses();
      console.log("Classes response:", data); 

      setClasses(data);
    } catch (err) {
      setError("Failed to fetch classes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadYears();
    loadClasses();
    loadTeachers();
  }, []);

  const handleQuestionSubmit = () => {
    if (!newQuestion.trim()) {
      message.warning("Please enter a question");
      return;
    }

    if (!selectedTeacher) {
      message.warning("Please select a teacher");
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      content: newQuestion,
      studentName: currentUser?.name || "Current Student",
      teacherName: selectedTeacher,
      year: "2025", // Can be dynamic if needed
      class: "Class A", // Can be dynamic if needed
      createdAt: new Date().toISOString(),
      answers: [],
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");
    setSelectedTeacher("");
    message.success("Question submitted successfully");
  };

  const handleAnswerSubmit = (questionId: string) => {
    const answerText = newAnswers[questionId];
    if (!answerText?.trim()) {
      message.warning("Please enter an answer");
      return;
    }

    const answer: Answer = {
      id: `${questionId}-${Date.now()}`,
      content: answerText,
      teacherName: currentUser?.name || "Teacher",
      createdAt: new Date().toISOString(),
    };

    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
      )
    );
    setNewAnswers({ ...newAnswers, [questionId]: "" });
    message.success("Answer submitted successfully");
  };

  const filteredQuestions = isTeacher
    ? questions.filter(
        (q) =>
          (!selectedYear || q.year === selectedYear) &&
          (!selectedClass || q.class === selectedClass)
      )
    : questions;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isStudent ? "Ask" : "Answer"} a Question
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student View */}
        {isStudent && (
          <Card title="Ask Your Question" className="shadow-md">
            <Form layout="vertical">
              <Form.Item label="Select Teacher">
                <Select
                  value={selectedTeacher}
                  onChange={(val) => setSelectedTeacher(val)}
                  placeholder="Select a teacher"
                >
                  {teachers.map((teacher) => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.teacher_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Your Question">
                <TextArea
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                />
              </Form.Item>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleQuestionSubmit}
              >
                Submit Question
              </Button>
            </Form>
          </Card>
        )}

        {/* Teacher View Filters */}
        {isTeacher && (
          <Card title="Filter Questions" className="shadow-md">
            <Form layout="vertical">
              <Form.Item label="Select Year">
                <Select
                  value={selectedYear || undefined}
                  onChange={(val) => setSelectedYear(val)}
                  allowClear
                  placeholder="Select year"
                >
                  {yearOptions.map((year) => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Select Class">
                <Select
                  value={selectedClass || undefined}
                  onChange={(val) => setSelectedClass(val)}
                  allowClear
                  placeholder="Select class"
                >
                  {classOptions.map((cls) => (
                    <Option key={cls} value={cls}>
                      {cls}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Teacher Answer Form */}
        {isTeacher && activeQuestion && (
          <Card title="Answer This Question" className="shadow-md">
            <Form layout="vertical">
              <Form.Item label="Your Answer">
                <TextArea
                  rows={4}
                  value={newAnswers[activeQuestion] || ""}
                  onChange={(e) =>
                    setNewAnswers({
                      ...newAnswers,
                      [activeQuestion]: e.target.value,
                    })
                  }
                  placeholder="Type your answer here..."
                />
              </Form.Item>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleAnswerSubmit(activeQuestion)}
              >
                Submit Answer
              </Button>
            </Form>
          </Card>
        )}
      </div>

      {/* Questions List */}
      <Divider orientation="left" className="mt-8">
        Recent Questions
      </Divider>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={filteredQuestions}
        renderItem={(question) => (
          <Card
            key={question.id}
            className={`mb-4 cursor-pointer transition-all ${
              activeQuestion === question.id ? "border-blue-500 border-2" : ""
            }`}
            onClick={() => setActiveQuestion(question.id)}
          >
            <div className="flex items-start gap-2">
              <Avatar icon={<UserOutlined />} className="mr-3 bg-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium">{question.studentName}</h3>
                    <p className="text-sm text-gray-500">
                      To: {question.teacherName} | {question.class},{" "}
                      {question.year}
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(question.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 mb-3">{question.content}</p>

                {/* Answers */}
                {question.answers.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Answers:</h4>
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="mb-3 pl-4 border-l-2 border-blue-200"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar
                              icon={<UserOutlined />}
                              className="mr-2 bg-green-500"
                              size="small"
                            />
                            <span className="font-medium">
                              {answer.teacherName}
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(answer.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 ml-8">{answer.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {question.answers.length === 0 && (
                  <p className="text-gray-500 italic">No answers yet</p>
                )}
              </div>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default AskQuestionPage;
