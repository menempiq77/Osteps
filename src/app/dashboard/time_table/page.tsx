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
  Select,
  message,
  Breadcrumb,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { fetchTeachers } from "@/services/teacherApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TimetableModal from "@/components/dashboard/TimetableModal";

const { Option } = Select;

function Timetable() {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isStudent = currentUser?.role === "STUDENT";
  const isTeacher = currentUser?.role === "TEACHER";
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const { data: events = [], isLoading: isTimetableLoading } = useQuery({
    queryKey: ["timetable"],
    queryFn: fetchTimetableData,
    select: (res) =>
      res?.map((item: any) => ({
        title: item.subject,
        start: `${item.date}T${dayjs(item.start_time, "HH:mm:ss").format(
          "HH:mm:ss"
        )}`,
        end: `${item.date}T${dayjs(item.end_time, "HH:mm:ss").format(
          "HH:mm:ss"
        )}`,
        extendedProps: {
          id: item.id,
          teacher: item?.teacher?.teacher_name || "N/A",
          teacher_id: item?.teacher_id || null,
          room: item.room || "N/A",
          zoomLink: item?.zoom_link,
          year_id: item?.year_id || null,
          class_id: item?.class_id || null,
        },
      })) || [],
  });

  const schoolId = currentUser?.school;

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventProps = event.extendedProps;

      if (!selectedYear && !selectedClass && !selectedTeacher) return true;

      const yearMatch =
        !selectedYear || eventProps.year_id === Number(selectedYear);
      const classMatch =
        !selectedClass || eventProps.class_id === Number(selectedClass);
      const teacherMatch =
        !selectedTeacher || eventProps.teacher_id === Number(selectedTeacher);

      return yearMatch && classMatch && teacherMatch;
    });
  }, [events, selectedYear, selectedClass, selectedTeacher]);

  // Fetch years
  const {
    data: yearsData = [],
    isLoading: isYearsLoading,
    isError: isYearsError,
  } = useQuery({
    queryKey: ["years", currentUser?.id],
    queryFn: async () => {
      let yearsData: any[] = [];

      if (isTeacher) {
        const res = await fetchAssignYears();
        const years = res
          .map((item: any) => item?.classes?.year)
          .filter((year: any) => year);

        yearsData = Array.from(
          new Map(years?.map((year: any) => [year.id, year])).values()
        );
      } else {
        const res = await fetchYearsBySchool(schoolId);
        yearsData = res;
      }

      return yearsData;
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        setSelectedYear(data[0].id.toString());
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Fetch classes (depends on selectedYear)
  const {
    data: classesData = [],
    isLoading: isClassesLoading,
    isError: isClassesError,
  } = useQuery({
    queryKey: ["classes", selectedYear, currentUser?.id],
    enabled: !!selectedYear,
    queryFn: async () => {
      let classesData: any[] = [];

      if (isTeacher) {
        const res = await fetchAssignYears();

        // Extract unique classes
        classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);

        classesData = Array.from(
          new Map(classesData.map((cls: any) => [cls.id, cls])).values()
        );

        // Filter by selected year
        classesData = classesData.filter(
          (cls: any) => cls.year_id === Number(selectedYear)
        );
      } else {
        classesData = await fetchClasses(Number(selectedYear));
      }

      return classesData;
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        setSelectedClass(data[0].id.toString());
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetchTeachers();
      setTeachers(response);
      if (response.length > 0) {
        setSelectedTeacher(response[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

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
        school_id: schoolId,
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
      school_id: eventProps.schoolId,
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

  if (isTimetableLoading) {
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
                {yearsData?.map((year) => (
                  <Option key={year.id} value={year.id.toString()}>
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
                {classesData?.map((cls) => (
                  <Option key={cls.id} value={cls.id.toString()}>
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
        <TimetableModal
          isModalVisible={isModalVisible}
          isEditMode={isEditMode}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setIsEditMode(false);
            setCurrentEventId(null);
          }}
          onSubmit={handleAddEvent}
          form={form}
          yearsData={yearsData}
          classesData={classesData}
          teachers={teachers}
          isTeacher={isTeacher}
          handleYearChange={handleYearChange}
        />
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
