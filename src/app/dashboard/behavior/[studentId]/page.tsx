"use client";
import React, { useState } from "react";
import {
  Card,
  Tag,
  Select,
  Button,
  Modal,
  Form,
  Input,
  message,
  List,
  Avatar,
  Statistic,
  Popconfirm,
  Space,
  InputNumber,
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

const { Option } = Select;

const StudentBehaviorPage = ({ studentId }) => {
  // Sample student data
  const allStudents = [
    {
      id: "S001",
      name: "John Doe",
      class: "Class A",
      avatar: "https://i.pravatar.cc/150?img=3",
      points: 12,
      behaviors: [
        {
          id: "b1",
          type: "Good",
          description: "Helped a classmate with math homework",
          points: 4,
          date: "2023-05-10",
          teacher: "Ms. Johnson",
        },
        {
          id: "b2",
          type: "Excellent",
          description: "Perfect attendance for the month",
          points: 5,
          date: "2023-05-05",
          teacher: "Ms. Johnson",
        },
      ],
    },
    {
      id: "S002",
      name: "Jane Smith",
      class: "Class A",
      avatar: "https://i.pravatar.cc/150?img=5",
      points: 8,
      behaviors: [
        {
          id: "b3",
          type: "Good",
          description: "Completed extra credit assignment",
          points: 4,
          date: "2023-05-08",
          teacher: "Mr. Wilson",
        },
        {
          id: "b4",
          type: "Good",
          description: "Helped organize classroom",
          points: 4,
          date: "2023-05-02",
          teacher: "Ms. Johnson",
        },
      ],
    },
    {
      id: "S003",
      name: "Mike Johnson",
      class: "Class B",
      avatar: "https://i.pravatar.cc/150?img=8",
      points: -2,
      behaviors: [
        {
          id: "b5",
          type: "Bad",
          description: "Late to class",
          points: -2,
          date: "2023-05-09",
          teacher: "Mr. Wilson",
        },
        {
          id: "b6",
          type: "Good",
          description: "Participated actively in discussion",
          points: 4,
          date: "2023-05-01",
          teacher: "Ms. Johnson",
        },
        {
          id: "b7",
          type: "Bad",
          description: "Forgot homework",
          points: -2,
          date: "2023-05-03",
          teacher: "Mr. Wilson",
        },
      ],
    },
  ];

  const [selectedStudentId, setSelectedStudentId] = useState(
    studentId || "S001"
  );
  const [isBehaviorModalVisible, setIsBehaviorModalVisible] = useState(false);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [typeForm] = Form.useForm();
  const [filter, setFilter] = useState("all");
  const [editingType, setEditingType] = useState(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const isStudent = currentUser?.role !== "STUDENT";

  // Get the currently selected student
  const student =
    allStudents.find((s) => s.id === selectedStudentId) || allStudents[0];

  // Combined predefined and custom behavior types
  const [behaviorTypes, setBehaviorTypes] = useState([
    {
      id: "t1",
      label: "Excellent",
      points: 5,
      color: "green",
      predefined: true,
    },
    { id: "t2", label: "Good", points: 4, color: "blue", predefined: true },
    { id: "t3", label: "Neutral", points: 0, color: "gray", predefined: true },
    { id: "t4", label: "Bad", points: -2, color: "orange", predefined: true },
    { id: "t5", label: "Very Bad", points: -5, color: "red", predefined: true },
    // Example custom type
    {
      id: "t6",
      label: "Homework Completed",
      points: 3,
      color: "purple",
      predefined: false,
    },
  ]);

  const showBehaviorModal = () => {
    setIsBehaviorModalVisible(true);
  };

  const showTypeModal = (type = null) => {
    setEditingType(type);
    if (type) {
      typeForm.setFieldsValue({
        label: type.label,
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

  const handleOk = () => {
    form.validateFields().then((values) => {
      const selectedType = behaviorTypes.find((b) => b.id === values.type);

      const newBehavior = {
        id: `b${Date.now()}`,
        type: selectedType.label,
        description: values.description,
        points: selectedType.points,
        date: values.date || new Date().toISOString().split("T")[0],
        teacher: currentUser?.name || "Teacher",
      };

      // Update the student's data
      const updatedStudents = allStudents.map((s) => {
        if (s.id === selectedStudentId) {
          return {
            ...s,
            points: s.points + newBehavior.points,
            behaviors: [newBehavior, ...s.behaviors],
          };
        }
        return s;
      });

      // In a real app, you would update the state or make an API call here
      // For this example, we'll just update the local state
      setSelectedStudentId(selectedStudentId); // This will trigger a re-render with the updated student

      setIsBehaviorModalVisible(false);
      form.resetFields();
      message.success("Behavior recorded successfully!");
    });
  };

  const handleTypeSubmit = () => {
    typeForm.validateFields().then((values) => {
      if (editingType) {
        // Update existing type
        const updatedTypes = behaviorTypes.map((type) =>
          type.id === editingType.id ? { ...type, ...values } : type
        );
        setBehaviorTypes(updatedTypes);
        message.success("Behavior type updated successfully!");
      } else {
        // Add new type
        const newType = {
          id: `t${Date.now()}`,
          predefined: false,
          ...values,
        };
        setBehaviorTypes([...behaviorTypes, newType]);
        message.success("Behavior type added successfully!");
      }
      setIsTypeModalVisible(false);
      typeForm.resetFields();
      setEditingType(null);
    });
  };

  const deleteBehaviorType = (typeId) => {
    if (behaviorTypes.some((t) => !t.predefined && t.id === typeId)) {
      setBehaviorTypes(behaviorTypes.filter((type) => type.id !== typeId));
      message.success("Behavior type deleted successfully!");
    }
  };

  const filteredBehaviors = student.behaviors.filter((behavior) => {
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
                value={selectedStudentId}
                onChange={(value) => setSelectedStudentId(value)}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                suffixIcon={<UserOutlined />}
              >
                {allStudents.map((student) => (
                  <Option
                    key={student.id}
                    value={student.id}
                    label={student.name}
                  >
                    <div className="flex items-center">
                      <span>
                        {student.name} - {student.points} pts
                      </span>
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
              onClick={showBehaviorModal}
              icon={<PlusOutlined />}
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
            value={student.points}
            valueStyle={{ color: student.points >= 0 ? "#3f8600" : "#cf1322" }}
            prefix={
              student.points >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
          />
        </Card>
        <Card>
          <Statistic
            title="Positive Behaviors"
            value={student.behaviors.filter((b) => b.points > 0).length}
          />
        </Card>
        <Card>
          <Statistic
            title="Negative Behaviors"
            value={student.behaviors.filter((b) => b.points < 0).length}
          />
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Avatar src={student.avatar} size="large" className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">{student.name}</h2>
              <p className="text-gray-500">{student.class}</p>
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
            <List.Item>
              <div className="flex justify-between w-full">
                <div>
                  <Tag
                    color={
                      behaviorTypes.find((t) => t.label === item.type)?.color ||
                      "gray"
                    }
                  >
                    {item.type} ({item.points > 0 ? "+" : ""}
                    {item.points})
                  </Tag>
                  <p className="mt-2 font-medium">{item.description}</p>
                  <p className="text-sm text-gray-500">
                    Recorded by {item.teacher} on {item.date}
                  </p>
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
                  !type.predefined && (
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => showTypeModal(type)}
                    >
                      Edit
                    </Button>
                  ),
                  !type.predefined && (
                    <Popconfirm
                      title="Delete this behavior type?"
                      onConfirm={() => deleteBehaviorType(type.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button icon={<DeleteOutlined />} danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={<Tag color={type.color}>{type.label}</Tag>}
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
      <Modal
        title={`Add Behavior Record for ${student.name}`}
        open={isBehaviorModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Behavior Type"
            rules={[
              { required: true, message: "Please select a behavior type" },
            ]}
          >
            <Select placeholder="Select behavior type">
              {behaviorTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  <Tag color={type.color}>{type.label}</Tag> (
                  {type.points > 0 ? "+" : ""}
                  {type.points} points)
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe the behavior in detail..."
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            initialValue={new Date().toISOString().split("T")[0]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit Behavior Type Modal */}
      <Modal
        title={editingType ? "Edit Behavior Type" : "Add New Behavior Type"}
        open={isTypeModalVisible}
        onOk={handleTypeSubmit}
        onCancel={handleTypeModalCancel}
        width={600}
      >
        <Form form={typeForm} layout="vertical">
          <Form.Item
            name="label"
            label="Behavior Name"
            rules={[
              {
                required: true,
                message: "Please enter a name for this behavior",
              },
            ]}
          >
            <Input placeholder="e.g., Homework Completed" />
          </Form.Item>
          <Form.Item
            name="points"
            label="Points"
            rules={[{ required: true, message: "Please enter point value" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="e.g., 3 or -2"
            />
          </Form.Item>
          <Form.Item
            name="color"
            label="Tag Color"
            rules={[{ required: true, message: "Please select a color" }]}
          >
            <Select placeholder="Select a color">
              {colorOptions.map((color) => (
                <Option key={color.value} value={color.value}>
                  <Tag color={color.value}>{color.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentBehaviorPage;
