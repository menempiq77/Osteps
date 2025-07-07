"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Tag,
  Select,
  Button,
  Form,
  message,
  List,
  Avatar,
  Statistic,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BehaviorModal from "@/components/modals/behaviorModals/BehaviorModal";
import BehaviorTypeModal from "@/components/modals/behaviorModals/BehaviorTypeModal";
import { useParams } from "next/navigation";
import {
  addBehaviour,
  addBehaviourType,
  deleteBehaviour,
  deleteBehaviourType,
  fetchBehaviour,
  fetchBehaviourType,
  updateBehaviour,
  updateBehaviourType,
} from "@/services/behaviorApi";
import { fetchStudents } from "@/services/studentsApi";

const { Option } = Select;

const StudentBehaviorPage = () => {
  const { classId, studentId } = useParams();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isBehaviorModalVisible, setIsBehaviorModalVisible] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [typeForm] = Form.useForm();
  const [filter, setFilter] = useState("all");
  const [editingType, setEditingType] = useState(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isStudent = currentUser?.role !== "STUDENT";
  const [editingBehavior, setEditingBehavior] = useState(null);
  const [students, setStudents] = useState<Student[]>([]);
  console.log(students, "students");

  type BehaviorType = {
    id: string;
    name: string;
    points: number;
    color: string;
  };

  type Behavior = {
    id: string;
    behaviour_id: string;
    description: string;
    date: string;
    points: number;
    teacher?: {
      teacher_name?: string;
    };
  };

  type Student = {
    id: string;
    student_name: string;
    points: number;
    class?: string;
    behaviors?: Behavior[];
    avatar?: string;
  };

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const studentsData = await fetchStudents(classId as string);
      setStudents(studentsData);

      const initialId = studentId || studentsData[0]?.id || "";
      setSelectedStudentId(initialId);

      return studentsData;
    } catch (err) {
      setError("Failed to load students");
      console.error("Error loading students:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadStudents();
  }, [classId, studentId]);

  const loadBehaviorTypes = async () => {
    try {
      setIsLoading(true);
      const behaviourType = await fetchBehaviourType();
      setBehaviorTypes(behaviourType);
    } catch (err) {
      setError("Failed to load behaviour Type");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const loadBehavior = async () => {
    try {
      setIsLoading(true);
      const behaviourData = await fetchBehaviour(selectedStudentId);
      setBehaviors(behaviourData);
    } catch (err) {
      setError("Failed to load behaviour");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBehavior();
    loadBehaviorTypes();
  }, [selectedStudentId]);

  const student = useMemo(() => {
    if (!students.length || !selectedStudentId) {
      console.log("No students or no selected ID");
      return null;
    }

    // Case-insensitive and type-agnostic comparison
    const found = students.find(
      (s) =>
        String(s.id).toLowerCase() === String(selectedStudentId).toLowerCase()
    );

    if (!found) {
      console.error("Student not found", {
        lookingFor: selectedStudentId,
        availableIds: students.map((s) => s.id),
        allStudents: students,
      });
    }

    return found || null;
  }, [students, selectedStudentId]);

  const showBehaviorModal = (behavior?: Behavior | null) => {
    setEditingBehavior(behavior);
    if (behavior) {
      form.setFieldsValue({
        type: behavior.behaviour_id,
        description: behavior.description,
        date: behavior.date,
      });
    } else {
      form.resetFields();
    }
    setIsBehaviorModalVisible(true);
  };

  const showTypeModal = (type: BehaviorType | null = null) => {
    setEditingType(type);
    if (type) {
      typeForm.setFieldsValue({
        name: type.name,
        points: type.points,
        color: type.color,
      });
    } else {
      typeForm.resetFields();
    }
    setIsTypeModalVisible(true);
  };

  const handleCancel = () => {
    setIsBehaviorModalVisible(false);
    form.resetFields();
  };

  const handleTypeModalCancel = () => {
    setIsTypeModalVisible(false);
    typeForm.resetFields();
    setEditingType(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedType = behaviorTypes.find((b) => b.id === values.type);

      if (!selectedType) {
        message.error("Please select a valid behavior type.");
        return;
      }
      const behaviorData = {
        behaviour_id: selectedType.id,
        description: values.description,
        date: values.date || new Date().toISOString().split("T")[0],
        teacher_id: currentUser?.id,
      };

      if (editingBehavior) {
        await updateBehaviour(editingBehavior.id, {
          student_id: selectedStudentId,
          ...behaviorData,
        });
        message.success("Behavior updated successfully!");
      } else {
        // Add new behavior
        await addBehaviour({
          student_id: selectedStudentId,
          ...behaviorData,
        });
        message.success("Behavior recorded successfully!");
      }
      await loadBehavior();
      setIsBehaviorModalVisible(false);
      form.resetFields();
      setEditingBehavior(null);
    } catch (error) {
      message.error("Failed to save behavior");
      console.error(error);
    }
  };

  const handleTypeSubmit = async () => {
    try {
      const values = await typeForm.validateFields();
      if (editingType) {
        // Update existing type
        const updatedType = await updateBehaviourType(editingType.id, values);
        setBehaviorTypes(
          behaviorTypes.map((type) =>
            type.id === editingType.id ? updatedType.data : type
          )
        );
        message.success("Behavior type updated successfully!");
      } else {
        // Add new type
        const newType = await addBehaviourType(values);
        setBehaviorTypes([...behaviorTypes, newType.data]);
        message.success("Behavior type added successfully!");
      }
      setIsTypeModalVisible(false);
      typeForm.resetFields();
      setEditingType(null);
    } catch (error) {
      message.error("Failed to save behavior type");
      console.error(error);
    }
  };

  const deleteBehavior = async (behaviorId: string) => {
    try {
      await deleteBehaviour(behaviorId);
      await loadBehavior();
      message.success("Behavior deleted successfully!");
    } catch (error) {
      message.error("Failed to delete behavior");
      console.error(error);
    }
  };

  const deleteBehaviorType = async (typeId) => {
    try {
      await deleteBehaviourType(typeId);
      setBehaviorTypes(behaviorTypes.filter((type) => type.id !== typeId));
      message.success("Behavior type deleted successfully!");
    } catch (error) {
      message.error("Failed to delete behavior type");
      console.error(error);
    }
  };

  const filteredBehaviors = behaviors?.filter((behavior) => {
    if (filter === "positive") return behavior.points > 0;
    if (filter === "negative") return behavior.points < 0;
    if (filter === "neutral") return behavior.points === 0;
    return true; // 'all'
  });

  const colorOptions = [
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "cyan", label: "Cyan" },
    { value: "magenta", label: "Magenta" },
    { value: "gold", label: "Gold" },
    { value: "lime", label: "Lime" },
    { value: "volcano", label: "Volcano" },
  ];

  const {
    totalPoints,
    totalPositivePoints,
    totalNegativePoints,
    positiveBehaviors,
    negativeBehaviors,
  } = useMemo(() => {
    let total = 0;
    let totalPositive = 0;
    let totalNegative = 0;

    const positive: Behavior[] = [];
    const negative: Behavior[] = [];

    behaviors.forEach((behavior) => {
      const behaviorType = behaviorTypes.find(
        (t) => t.id === behavior.behaviour_id
      );
      if (behaviorType) {
        const points = Number(behaviorType.points);
        total += points;

        if (points > 0) {
          totalPositive += points;
          positive.push(behavior);
        } else if (points < 0) {
          totalNegative += points;
          negative.push(behavior);
        }
      }
    });

    return {
      totalPoints: total,
      totalPositivePoints: totalPositive,
      totalNegativePoints: totalNegative,
      positiveBehaviors: positive,
      negativeBehaviors: negative,
    };
  }, [behaviors, behaviorTypes]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Behavior</h1>
          {isStudent && (
            <div className="flex items-center mt-2">
              <Select
                showSearch
                style={{ width: 250 }}
                placeholder="Select a student"
                optionFilterProp="children"
                value={selectedStudentId ? student?.student_name : undefined}
                onChange={(value) => setSelectedStudentId(value)}
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                suffixIcon={<UserOutlined />}
              >
                {students.map((student) => (
                  <Option
                    key={student.id}
                    value={student.id}
                    label={student.student_name}
                  >
                    <div className="flex items-center">
                      <span>{student.student_name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>
        {isStudent && (
          <Space>
            <Button onClick={() => showTypeModal()} icon={<PlusOutlined />}>
              Add Behavior Type
            </Button>
            <Button
              type="primary"
              onClick={() => showBehaviorModal()}
              icon={<PlusOutlined />}
              className="!bg-primary "
            >
              Add Behavior
            </Button>
          </Space>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic
            title="Total Points"
            value={totalPoints}
            valueStyle={{ color: totalPoints >= 0 ? "#3f8600" : "#cf1322" }}
            prefix={
              totalPoints >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
          />
        </Card>
        <Card>
          <Statistic
            title="Positive Points"
            value={totalPositivePoints}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Negative Points"
            value={totalNegativePoints}
            valueStyle={{ color: "#cf1322" }}
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Avatar src={student?.avatar} size="large" className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">{student?.student_name}</h2>
              <p className="text-gray-500">{student?.class}</p>
            </div>
          </div>
        }
        extra={
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={(value) => setFilter(value)}
          >
            <Option value="all">All Behaviors</Option>
            <Option value="positive">Positive</Option>
            <Option value="negative">Negative</Option>
            <Option value="neutral">Neutral</Option>
          </Select>
        }
      >
        <List
          itemLayout="vertical"
          dataSource={filteredBehaviors}
          renderItem={(item) => (
            <List.Item
              actions={
                isStudent
                  ? [
                      <div className="">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showBehaviorModal(item)}
                          className="!border-none !shadow-none"
                        ></Button>
                        <Popconfirm
                          title="Delete this behavior?"
                          onConfirm={() => deleteBehavior(item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            className="!border-none !shadow-none"
                          ></Button>
                        </Popconfirm>
                      </div>,
                    ]
                  : []
              }
            >
              <div className="flex justify-between w-full">
                <div>
                  {(() => {
                    const behaviorType = behaviorTypes.find(
                      (t) => t.id === item.behaviour_id
                    );
                    return (
                      <>
                        <Tag color={behaviorType?.color || "gray"}>
                          {behaviorType?.name || "Unknown"}(
                          {(behaviorType?.points ?? 0) > 0 ? "+" : ""}
                          {behaviorType?.points || 0})
                        </Tag>
                        <p className="mt-2 font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          Recorded by {item?.teacher?.teacher_name || "Teacher"} on {item.date}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Behavior Types Management Section */}
      {isStudent && (
        <Card title="Behavior Types" className="mt-6">
          <List
            dataSource={behaviorTypes}
            renderItem={(type) => (
              <List.Item
                actions={[
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showTypeModal(type)}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Delete this behavior type?"
                    onConfirm={() => deleteBehaviorType(type.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} danger>
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Tag color={type.color}>{type.name}</Tag>}
                  description={`${type.points > 0 ? "+" : ""}${
                    type.points
                  } points`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Add Behavior Modal */}
      <BehaviorModal
        visible={isBehaviorModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        studentName={student?.student_name}
        behaviorTypes={behaviorTypes}
        form={form}
        isEditing={!!editingBehavior}
      />

      {/* Add/Edit Behavior Type Modal */}
      <BehaviorTypeModal
        visible={isTypeModalVisible}
        onCancel={handleTypeModalCancel}
        onOk={handleTypeSubmit}
        form={typeForm}
        editingType={editingType}
        colorOptions={colorOptions}
      />
    </div>
  );
};

export default StudentBehaviorPage;
