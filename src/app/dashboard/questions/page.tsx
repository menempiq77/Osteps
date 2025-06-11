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
import {
  fetchClasses,
  fetchTeachersByStudent,
  fetchYears,
} from "@/services/api";
import {
  getAllAskQuestions,
  createAskQuestion,
  updateAskQuestion,
  deleteAskQuestion,
  submitAskQuestion,
} from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const { TextArea } = Input;
const { Option } = Select;

type Question = {
  id: number;
  student_id: number;
  teacher_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  studentName?: string;
  teacherName?: string;
  year?: string;
  class?: string;
  answers?: Answer[];
};

type Answer = {
  id: string;
  content: string;
  teacherName: string;
  createdAt: string;
};

const AskQuestionPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";
  const [questions, setQuestions] = useState<Question[]>([]);
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

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAskQuestions();
      const transformedQuestions = response.map((q: any) => ({
        ...q,
        id: q.id,
        content: q.question,
        studentName: `Student ${q.student_id}`,
        teacherName: `Teacher ${q.teacher_id}`,
        year: "Year 1",
        class: "Class A",
        createdAt: q.created_at,
        answers: q.answer
          ? [
              {
                id: `answer-${q.id}`,
                content: q.answer,
                teacherName: `Teacher ${q.teacher_id}`,
                createdAt: q.updated_at,
              },
            ]
          : [],
      }));
      setQuestions(transformedQuestions);
    } catch (err) {
      setError("Failed to fetch questions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTeachersByStudent();
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
    loadQuestions();
  }, []);

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim()) {
      message.warning("Please enter a question");
      return;
    }

    if (!selectedTeacher) {
      message.warning("Please select a teacher");
      return;
    }

    try {
      const questionData = {
        student_id: Number(currentUser?.id),
        teacher_id: selectedTeacher,
        question: newQuestion,
        answer: "",
      };

      const response = await createAskQuestion(questionData);

      // Transform the new question to match our frontend structure
      const newQuestionItem: Question = {
        ...response.data,
        id: response.data.id,
        content: response.data.question,
        studentName: currentUser?.name || `Student ${response.data.student_id}`,
        teacherName: `Teacher ${response.data.teacher_id}`,
        year: "2025",
        class: "Class A",
        createdAt: response.data.created_at,
        answers: [],
      };

      setQuestions([newQuestionItem, ...questions]);
      setNewQuestion("");
      setSelectedTeacher("");
      message.success("Question submitted successfully");
    } catch (err) {
      message.error("Failed to submit question");
      console.error(err);
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    const answerText = newAnswers[questionId];
    if (!answerText?.trim()) {
      message.warning("Please enter an answer");
      return;
    }

    try {
      const response = await submitAskQuestion(questionId, {
        answer: answerText,
      });

      // Update the question with the new answer
      setQuestions(
        questions.map((q) =>
          q.id.toString() === questionId
            ? {
                ...q,
                answer: answerText,
                answers: [
                  {
                    id: `answer-${Date.now()}`,
                    content: answerText,
                    teacherName: currentUser?.name || "Teacher",
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : q
        )
      );

      setNewAnswers({ ...newAnswers, [questionId]: "" });
      message.success("Answer submitted successfully");
    } catch (err) {
      message.error("Failed to submit answer");
      console.error(err);
    }
  };

  const filteredQuestions = isTeacher
    ? questions.filter(
        (q) =>
          (!selectedYear || q.year === selectedYear) &&
          (!selectedClass || q.class === selectedClass)
      )
    : questions;

  return (
    <>
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:!border-green-500 hover:!text-green-500 mb-4"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Button>
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
                className=" !bg-primary hover:bg-green-600 !text-white"
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
                  {years?.map((year) => (
                    <Option key={year.id} value={year.id}>
                      {year.name}
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
                  {classes?.map((cls) => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.class_name}
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
                className="!bg-primary hover:bg-green-600 !text-white"
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
        loading={isLoading}
        renderItem={(question) => (
          <Card
            key={question.id}
            className={`mb-4 cursor-pointer transition-all ${
              activeQuestion === question.id.toString()
                ? "border-blue-500 border-2"
                : ""
            }`}
            onClick={() => setActiveQuestion(question.id.toString())}
          >
            <div className="flex items-start gap-2">
              <Avatar icon={<UserOutlined />} className="mr-3 bg-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-medium">{question.studentName}</h3>
                    <p className="text-sm text-gray-500">
                      To: {question.teacherName}
                      {/* | {question.class},{question.year} */}
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(question.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 mb-3">{question.question}</p>

                {/* Answers */}
                {question.answer ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Answers:</h4>
                    <div className="mb-3 pl-4 border-l-2 border-blue-200">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            icon={<UserOutlined />}
                            className="mr-2 bg-green-500"
                            size="small"
                          />
                          <span className="font-medium">
                            {question.teacherName}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(question.updated_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 ml-8">{question.answer}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No answers yet</p>
                )}
              </div>
            </div>
          </Card>
        )}
      />
    </>
  );
};

export default AskQuestionPage;
