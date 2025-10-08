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
  Modal,
} from "antd";
import { UserOutlined, SendOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createAskQuestion,
  deleteAskQuestion,
  getAllAskQuestions,
  submitAskQuestion,
} from "@/services/askQuestionApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTeachersByStudent, getAssignTeacher } from "@/services/teacherApi";
import Link from "next/link";

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
  const router = useRouter();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isStudent = currentUser?.role === "STUDENT";
  const isHOD = currentUser?.role === "HOD";
  const isTeacher = currentUser?.role === "TEACHER";
  const isAdmin = currentUser?.role === "SCHOOL_ADMIN";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [teachers, setTeachers] = useState<any[]>([]);
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);

  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const schoolId = currentUser?.school;
  const classId = currentUser?.studentClass;

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setIsDeleteModalOpen(true);
  };

const confirmDelete = async () => {
  if (!questionToDelete) return;
  
  try {
    setIsLoading(true);
    await deleteAskQuestion(questionToDelete.id);
    
    setQuestions(questions.filter(q => q.id !== questionToDelete.id));
    messageApi.success("Question deleted successfully");
  } catch (err) {
    messageApi.error("Failed to delete question");
    console.error(err);
  } finally {
    setIsLoading(false);
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  }
};

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAskQuestions();
      const transformedQuestions = response.map((q: any) => ({
        ...q,
        id: q.id,
        content: q.question,
        studentName: `${q.student?.student_name || "Anonymous"}`,
        teacherName: `${q.teacher?.teacher_name || "Anonymous"}`,
        year: "Year 1",
        class: "Class A",
        createdAt: q.created_at,
        answers: q.answer
          ? [
              {
                id: `answer-${q.id}`,
                content: q.answer,
                teacherName: `${q.teacher?.teacher_name || "Anonymous"}`,
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
    const response = await getAssignTeacher(classId);

    // Flatten teachers_by_subject into a single array
    const teachersArray = Object.values(response.teachers_by_subject)
      .flat() // merge all subjects into one array
      .map((teacher) => ({
        id: teacher.id,
        name: teacher.teacher_name,
      }));

    setTeachers(teachersArray);
  } catch (err) {
    setError("Failed to fetch teachers");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  const loadYears = async () => {
    try {
      let yearsData;

      if (isTeacher) {
        const res = await fetchAssignYears();
        const years = res
          .map((item: any) => item.classes?.year)
          .filter((year: any) => year);

        yearsData = Array.from(
          new Map(years.map((year: any) => [year.id, year])).values()
        );
      } else {
        const res = await fetchYearsBySchool(schoolId);
        yearsData = res;
      }

      setYears(yearsData);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load years");
      setIsLoading(false);
      console.error(err);
    }
  };

const loadClasses = async (yearId: string | null) => {
  if (!yearId) return;

  try {
    setIsLoading(true);
    let classesData: any[] = [];

    if (isTeacher) {
      const res = await fetchAssignYears();

      classesData = res
        .map((item: any) => item.classes)
        .filter((cls: any) => cls);

      // Remove duplicates
      classesData = Array.from(
        new Map(classesData.map((cls: any) => [cls.id, cls])).values()
      );

      // Filter by yearId
      classesData = classesData.filter(
        (cls: any) => cls.year_id === Number(yearId)
      );
    } else {
      classesData = await fetchClasses(Number(yearId));
    }

    setClasses(classesData);

    if (classesData.length > 0) {
      // auto-select first class (better to keep as string id, not name)
      setSelectedClass(classesData[0].id.toString());
    } else {
      setSelectedClass(null);
    }
  } catch (err) {
    setError("Failed to fetch classes");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    loadYears();
    loadQuestions();
  }, []);

  useEffect(() => {
    loadClasses(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (isStudent && currentUser?.id) {
      loadTeachers();
    }
  }, [isStudent, currentUser?.id]);

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim()) {
      messageApi.warning("Please enter a question");
      return;
    }

    if (!selectedTeacher) {
      messageApi.warning("Please select a teacher");
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
        teacherName: `${response.data.teacher_name}`,
        year: "2025",
        class: "Class A",
        createdAt: response.data.created_at,
        answers: [],
      };

      setQuestions([newQuestionItem, ...questions]);
      setNewQuestion("");
      setSelectedTeacher("");
      messageApi.success("Question submitted successfully");
    } catch (err) {
      messageApi.error("Failed to submit question");
      console.error(err);
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    const answerText = newAnswers[questionId];
    if (!answerText?.trim()) {
      messageApi.warning("Please enter an answer");
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
      messageApi.success("Answer submitted successfully");
    } catch (err) {
      messageApi.error("Failed to submit answer");
      console.error(err);
    }
  };

  const filteredQuestions = isTeacher
    ? questions.filter((q) => {
        if (!selectedClass) return true;
        const classMatch =
          !selectedClass || q.student?.class_id === Number(selectedClass);
        return classMatch;
      })
    : questions;

  return (
    <>
    {contextHolder}
      <Link href="/dashboard">
        <Button
          icon={<ChevronLeft />}
          className="text-gray-700 border border-gray-300 hover:bg-gray-100 mb-4"
        >
          Back to Dashboard
        </Button>
      </Link>
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
                      {teacher.name}
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
        {(isTeacher || isHOD) && (
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
                    <Option key={cls.id} value={cls.id.toString()}>
                      {cls.class_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Teacher Answer Form */}
        {(isTeacher || isHOD) && activeQuestion && (
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

              {isAdmin && (
                <button
                  onClick={() => handleDeleteClick(question)}
                  className="text-red-500 hover:text-red-700 cursor-pointer absolute right-2 top-1"
                  title="Delete"
                >
                  <DeleteOutlined size={12} />
                </button>
              )}
            </div>
          </Card>
        )}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setQuestionToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to delete.</p>
      </Modal>
    </>
  );
};

export default AskQuestionPage;
