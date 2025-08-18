"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";
import { useEffect, useMemo, useState } from "react";
import {
  addTimetableSlot,
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
  Breadcrumb,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { fetchYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTeachers } from "@/services/teacherApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const { Option } = Select;

function Timetable() {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";
  const [years, setYears] = useState<any[]>([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const { data: events = [], isLoading: isTimetableLoading } = useQuery({
    queryKey: ["timetable"],
    queryFn: fetchTimetableData,
    select: (data) =>
      Object.values(data).map((item: any) => ({
        title: item.subject,
        start: `${item.date}T${item.start_time}`,
        end: `${item.date}T${item.end_time}`,
        extendedProps: {
          id: item.id,
          teacher: item?.teacher?.teacher_name || "N/A",
          teacher_id: item?.teacher_id || null,
          room: item.room || "N/A",
          zoomLink: item?.zoom_link,
          year_id: item?.year_id || null,
          class_id: item?.class_id || null,
        },
      })),
  });
  const schoolId = currentUser?.school;

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventProps = event.extendedProps;

      if (!selectedYear && !selectedClass && !selectedTeacher) {
        return true;
      }

      const yearMatch = !selectedYear || eventProps.year_id === selectedYear;
      const classMatch =
        !selectedClass || eventProps.class_id === selectedClass;
      const teacherMatch =
        !selectedTeacher || eventProps.teacher_id === selectedTeacher;

      return yearMatch && classMatch && teacherMatch;
    });
  }, [events, selectedYear, selectedClass, selectedTeacher]);

  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await fetchYearsBySchool(schoolId);
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

  const addMutation = useMutation({
    mutationFn: addTimetableSlot,
    onSuccess: () => {
      messageApi.success("Event added successfully");
      queryClient.invalidateQueries(["timetable"]);
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      messageApi.error(error.response?.data?.message || "Failed to add event");
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTimetableSlot(id, data),
    onSuccess: () => {
      messageApi.success("Event updated successfully");
      queryClient.invalidateQueries(["timetable"]);
      setIsModalVisible(false);
      form.resetFields();
      setIsEditMode(false);
      setCurrentEventId(null);
    },
    onError: (error: any) => {
      messageApi.error(
        error.response?.data?.message || "Failed to update event"
      );
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTimetableSlot,
    onSuccess: () => {
      messageApi.success("Event deleted successfully");
      queryClient.invalidateQueries(["timetable"]);
      setIsDeleteModalVisible(false);
    },
    onError: () => {
      messageApi.error("Failed to delete event");
    },
  });
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
        updateMutation.mutate({ id: currentEventId, data: formattedData });
      } else {
        addMutation.mutate(formattedData);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  const handleDeleteEvent = (event: any) => {
    setEventToDelete(event);
    setIsDeleteModalVisible(true);
  };
  const confirmDelete = async () => {
    if (!eventToDelete) return;
    const eventId = eventToDelete.extendedProps.id || eventToDelete.id;
    deleteMutation.mutate(eventId);
  };
  const handleEditEvent = (event: any) => {
    const eventProps = event.extendedProps;

    const eventData = {
      subject: event.title,
      year: eventProps.year_id,
      teacher: eventProps.teacher_id,
      class: eventProps.class_id,
      room: eventProps.room,
      date: dayjs(event.startStr.split("T")[0]),
      start_time: dayjs(event.startStr.split("T")[1], "HH:mm:ss"),
      end_time: dayjs(event.endStr.split("T")[1], "HH:mm:ss"),
      zoom_link: eventProps.zoomLink || "",
    };

    form.setFieldsValue(eventData);
    setIsEditMode(true);
    setCurrentEventId(eventProps.id);
    setIsModalVisible(true);
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className="p-2 overflow-auto bg-primary">
      <div className="flex justify-between items-start">
        <div>
          <b>{eventInfo.event.title}</b>
          <div>{eventInfo.event.extendedProps.teacher}</div>
          <div>{eventInfo.event.extendedProps.room}</div>
          <div className="text-[10px] text-gray-800">
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
          className="text-blue-500 hover:underline text-xs"
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
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Timetable</span>,
          },
        ]}
        className="!mb-2"
      />
      {!isStudent && (
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
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={filteredEvents}
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
              <Col xs={24} md={12}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Subject" />
                </Form.Item>

                <Form.Item
                  name="year"
                  label="Year"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select year">
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
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select class">
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

                <Form.Item
                  name="zoom_link"
                  label="Zoom Link"
                  rules={[{ type: "url" }]}
                >
                  <Input placeholder="Zoom meeting link (optional)" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="room"
                  label="Room"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Room" />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true }]}
                >
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
