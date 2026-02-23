"use client";
import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Row,
  Col,
} from "antd";

const { Option } = Select;

interface TimetableModalProps {
  isModalVisible: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  form: any;
  yearsData: any[];
  classesData: any[];
  teachers: any[];
  isTeacher: boolean;
  handleYearChange: (value: string) => void;
}

const TimetableModal: React.FC<TimetableModalProps> = ({
  isModalVisible,
  isEditMode,
  onCancel,
  onSubmit,
  form,
  yearsData,
  classesData,
  teachers,
  isTeacher,
  handleYearChange,
}) => {
  useEffect(() => {
    if (!isModalVisible) form.resetFields();
  }, [isModalVisible, form]);

  return (
    <Modal
      title={isEditMode ? "Edit Timetable Slot" : "Add New Timetable Slot"}
      open={isModalVisible}
      onOk={onSubmit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          className="!bg-primary hover:!bg-primary/90 !text-white"
        >
          {isEditMode ? "Update" : "Add"} Event
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true }]}
            >
              <Input placeholder="Subject" />
            </Form.Item>

            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Select placeholder="Select year" onChange={handleYearChange}>
                {yearsData?.map((year) => (
                  <Option key={year.id} value={year.id}>
                    {year.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="class" label="Class" rules={[{ required: true }]}>
              <Select placeholder="Select class">
                {classesData?.map((cls) => (
                  <Option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {!isTeacher && (
              <Form.Item
                name="teacher"
                label="Teacher"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select teacher">
                  {teachers?.map((teacher) => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.teacher_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item name="zoom_link" label="Zoom Link" rules={[{ type: "url" }]}>
              <Input placeholder="Zoom meeting link (optional)" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="room" label="Room" rules={[{ required: true }]}>
              <Input placeholder="Room" />
            </Form.Item>

            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="start_time"
              label="Start Time"
              rules={[{ required: true }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="end_time"
              label="End Time"
              rules={[{ required: true }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TimetableModal;