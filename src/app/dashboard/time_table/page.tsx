"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { useEffect, useState } from "react";
import {
  deleteTimetableSlot,
  fetchTimetableData,
  updateTimetableSlot,
} from "@/services/timetableApi";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  message,
  Row,
  Col,
} from "antd";
import api, { fetchClasses, fetchTeachers, fetchYears } from "@/services/api";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const { Option } = Select;

function Timetable() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";

  const [years, setYears] = useState<Year[]>([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    loadTimetableData();
  }, []);

  const loadTimetableData = async () => {
    try {
      setLoading(true);
      const timetableData = await fetchTimetableData();
      const formattedEvents = Object.values(timetableData).map((item: any) => ({
        title: item.subject,
        start: `${item.date}T${item.start_time}`,
        end: `${item.date}T${item.end_time}`,
        extendedProps: {
          id: item.id,
          teacher: item.teacher || "N/A",
          room: item.room || "N/A",
          zoomLink: item.zoom_link,
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch timetable data:", error);
      message.error("Failed to load timetable data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await fetchYears();
        setYears(data);
        if (data.length > 0) {
          setSelectedYear(data[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.log("Failed to load years");
        setLoading(false);
        console.error(err);
      }
    };
    loadYears();
  }, []);

  const loadClasses = async (yearId: string) => {
    try {
      setLoading(true);
      const data = await fetchClasses(yearId);
      console.log("Classes response:", data);
      setClasses(data);
      if (data.length > 0) {
        setSelectedClass(data[0].id);
      }
    } catch (err) {
      setError("Failed to fetch classes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetchTeachers();
      console.log("Teachers response:", response);
      setTeachers(response);
      if (response.length > 0) {
        setSelectedTeacher(response[0].id);
      }
    } catch (err) {
      setError("Failed to fetch teachers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadClasses(selectedYear);
    }
  }, [selectedYear]);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.startStr.split("T")[0]);
    form.setFieldsValue({
      date: dayjs(selectInfo.startStr.split("T")[0]),
      start_time: dayjs(selectInfo.startStr.split("T")[1], "HH:mm:ss"),
      end_time: dayjs(selectInfo.endStr.split("T")[1], "HH:mm:ss"),
    });
    setIsModalVisible(true);
  };

  const handleAddEvent = async () => {
    try {
      const values = await form.validateFields();
      const date = values.date.format("YYYY-MM-DD");
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[values.date.day()];

      const formattedData = {
        subject: values.subject,
        year_id: values.year,
        teacher_id: values.teacher || currentUser?.id,
        class_id: values.class,
        room: values.room,
        date: date,
        day: dayName,
        start_time: values.start_time.format("HH:mm"),
        end_time: values.end_time.format("HH:mm"),
        zoom_link: values.zoom_link,
      };

      if (isEditMode && currentEventId) {
        await updateTimetableSlot(currentEventId, formattedData);
        message.success("Event updated successfully");
      } else {
        await api.post("/add-timeTable", formattedData);
        message.success("Event added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setIsEditMode(false);
      setCurrentEventId(null);
      loadTimetableData();
    } catch (error) {
      console.error("Failed to save event:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(`Failed to ${isEditMode ? "update" : "add"} event`);
      }
    }
  };

  const handleDeleteEvent = (event: any) => {
    setEventToDelete(event);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (!eventToDelete) return;

      const eventId = eventToDelete.extendedProps.id || eventToDelete.id;
      await deleteTimetableSlot(eventId);
      message.success("Event deleted successfully");
      setIsDeleteModalVisible(false);
      loadTimetableData();
    } catch (error) {
      console.error("Failed to delete event:", error);
      message.error("Failed to delete event");
    }
  };

  const handleEditEvent = (event: any) => {
    // Find the corresponding IDs for the current values
    const yearId =
      years.find((y) => y.name === event.extendedProps.year)?.id ||
      selectedYear;
    const teacherId = teachers.find(
      (t) => t.teacher_name === event.extendedProps.teacher
    )?.id;
    const classId =
      classes.find((c) => c.class_name === event.extendedProps.class)?.id ||
      selectedClass;

    const eventData = {
      subject: event.title,
      year: yearId,
      teacher: teacherId,
      class: classId,
      room: event.extendedProps.room,
      date: dayjs(event.startStr.split("T")[0]),
      start_time: dayjs(event.startStr.split("T")[1], "HH:mm:ss"),
      end_time: dayjs(event.endStr.split("T")[1], "HH:mm:ss"),
      zoom_link: event.extendedProps.zoomLink || "",
    };

    form.setFieldsValue(eventData);
    setIsEditMode(true);
    setCurrentEventId(event.extendedProps.id);
    setIsModalVisible(true);
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className="p-2 overflow-auto bg-primary">
      <div className="flex justify-between items-start">
        <div>
          <b>{eventInfo.event.title}</b>
          <div>{eventInfo.event.extendedProps.teacher}</div>
          <div>{eventInfo.event.extendedProps.room}</div>
          <div className="text-xs text-gray-800">
            {formatTime(eventInfo.event.start)} -{" "}
            {formatTime(eventInfo.event.end)}
          </div>
        </div>
        {!isStudent && (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditEvent(eventInfo.event);
              }}
              className="text-white cursor-pointer"
              title="Edit"
            >
              <EditOutlined />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(eventInfo.event);
              }}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              title="Delete"
            >
              <DeleteOutlined />
            </button>
          </div>
        )}
      </div>
      {eventInfo.event.extendedProps.zoomLink && (
        <a
          href={eventInfo.event.extendedProps.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Join Zoom
        </a>
      )}
    </div>
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="p-3 md:p-6">
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>

        <div
          className={`grid grid-cols-1 ${
            isTeacher ? "md:grid-cols-2" : "md:grid-cols-3"
          } gap-4`}
        >
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Year
            </label>
            <Select
              value={selectedYear || undefined}
              onChange={handleYearChange}
              className="w-full"
              placeholder="All Years"
              allowClear
            >
              {years?.map((year) => (
                <Option key={year.id} value={year.id}>
                  {year.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Class
            </label>
            <Select
              value={selectedClass || undefined}
              onChange={handleClassChange}
              className="w-full"
              placeholder="All Classes"
              allowClear
            >
              {classes?.map((cls) => (
                <Option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </Option>
              ))}
            </Select>
          </div>

          {!isTeacher && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Teacher
              </label>
              <Select
                // value={selectedTeacher || undefined}
                onChange={handleTeacherChange}
                className="w-full"
                placeholder="All Teachers"
                allowClear
              >
                {teachers?.map((teacher) => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.teacher_name}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventContent={renderEventContent}
        editable={true}
        selectable={true}
        select={handleDateSelect}
        nowIndicator={false}
        height="auto"
        allDaySlot={false}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          meridiem: "short",
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          meridiem: "short",
        }}
        expandRows={true}
        contentHeight="auto"
        eventMinHeight={50}
      />

      {!isStudent && (
        <Modal
          title={isEditMode ? "Edit Timetable Slot" : "Add New Timetable Slot"}
          open={isModalVisible}
          onOk={handleAddEvent}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setIsEditMode(false);
            setCurrentEventId(null);
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setIsEditMode(false);
                setCurrentEventId(null);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleAddEvent}
              className="!bg-primary hover:!bg-primary/90 !text-white"
            >
              {isEditMode ? "Update" : "Add"} Event
            </Button>,
          ]}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              {/* First column */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[
                    { required: true, message: "Please input the subject!" },
                  ]}
                >
                  <Input placeholder="Subject" />
                </Form.Item>

                <Form.Item
                  name="year"
                  label="Year"
                  rules={[
                    { required: true, message: "Please select the year!" },
                  ]}
                >
                  <Select placeholder="Select year" onChange={handleYearChange}>
                    {years?.map((year) => (
                      <Option key={year.id} value={year.id}>
                        {year.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="class"
                  label="Class"
                  rules={[
                    { required: true, message: "Please select the class!" },
                  ]}
                >
                  <Select placeholder="Select class" loading={loading}>
                    {classes?.map((cls) => (
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
                    rules={[
                      { required: true, message: "Please select the teacher!" },
                    ]}
                  >
                    <Select placeholder="Select teacher" loading={loading}>
                      {teachers?.map((teacher) => (
                        <Option key={teacher.id} value={teacher.id}>
                          {teacher.teacher_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item name="zoom_link" label="Zoom Link">
                  <Input placeholder="Zoom meeting link (optional)" />
                </Form.Item>
              </Col>

              {/* Second column */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="room"
                  label="Room"
                  rules={[
                    { required: true, message: "Please input the room!" },
                  ]}
                >
                  <Input placeholder="Room" />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Date"
                  rules={[
                    { required: true, message: "Please select the date!" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="start_time"
                  label="Start Time"
                  rules={[
                    { required: true, message: "Please select start time!" },
                  ]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="end_time"
                  label="End Time"
                  rules={[
                    { required: true, message: "Please select end time!" },
                  ]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}

      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Are you sure you want to delete this event?</p>
      </Modal>
    </div>
  );
}

export default Timetable;
