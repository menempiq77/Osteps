"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Clock,
  Calendar,
  Pencil,
  Trash2,
  Plus,
  Link,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, DatePicker, Input } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Modal } from "antd";
import { Select } from "antd";
import { fetchClasses, fetchTeachers, fetchYears } from "@/services/api";
import { fetchTimetableData } from "@/services/timetableApi";
const { Option } = Select;
interface Year {
  id: number;
  name: string;
  school_id?: number;
  terms?: any;
  created_at?: string;
  updated_at?: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
];

const initialTimetable = {
  TEACHER: {
    Monday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        class: "Class 1",
        room: "Masjid",
        zoomLink: "https://zoom.us/j/1234567890",
      },
      "9:00 - 10:00": {
        subject: "Islmiyat",
        class: "Class 2",
        room: "Room 205",
        zoomLink: "https://zoom.us/j/2345678901",
      },
    },
    Tuesday: {
      "10:00 - 11:00": {
        subject: "Islmiyat",
        class: "Class 5",
        room: "Lab 1",
        zoomLink: "https://zoom.us/j/3456789012",
      },
    },
  },
  STUDENT: {
    Monday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Ahmed",
        room: "Masjid",
        zoomLink: "https://zoom.us/j/1234567890",
      },
      "9:00 - 10:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Yusuf",
        room: "Room 205",
        zoomLink: "https://zoom.us/j/2345678901",
      },
    },
    Tuesday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Mohammed",
        room: "Room 102",
        zoomLink: "https://zoom.us/j/4567890123",
      },
    },
  },
  SCHOOL_ADMIN: {
    Monday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Ahmed",
        class: "Grade 10",
        room: "Masjid",
        zoomLink: "https://zoom.us/j/1234567890",
      },
      "9:00 - 10:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Yusuf",
        class: "Grade 11",
        room: "Room 205",
        zoomLink: "https://zoom.us/j/2345678901",
      },
    },
    Tuesday: {
      "10:00 - 11:00": {
        subject: "Seerah Assesment",
        teacher: "Sheikh Ibrahim",
        class: "Grade 12",
        room: "Lab 1",
        zoomLink: "https://zoom.us/j/3456789012",
      },
    },
    Wednesday: {
      "8:00 - 9:00": {
        subject: "Quran Assesment",
        teacher: "Sheikh Mohammed",
        class: "Grade 9",
        room: "Room 101",
        zoomLink: "https://zoom.us/j/5678901234",
      },
    },
  },
};

export default function TimetablePage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [timetableData, setTimetableData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: "Islmiyat",
    class: "",
    teacher: "",
    room: "",
    year: "",
    zoomLink: "",
  });
  const [filters, setFilters] = useState({
    teacher: "",
    class: "",
    year: "",
  });
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<Year[]>([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const handleWeekChange = (date: Dayjs) => {
    setCurrentWeek(date.toDate());
    setShowWeekPicker(false);
  };

  const handleMonthChange = (date: Dayjs) => {
    setCurrentMonth(date.toDate());
    setShowMonthPicker(false);
  };

  const handleDayChange = (date: Dayjs) => {
    setCurrentWeek(date.toDate());
    setShowDayPicker(false);
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

  const loadTimetableData = async () => {
    try {
      setLoading(true);
      const response = await fetchTimetableData();
      console.log("fetchTimetableData response:", response);

    } catch (err) {
      setError("Failed to fetch teachers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    loadTeachers();
    loadTimetableData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadClasses(selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (currentUser?.role) {
      setTimetableData(
        JSON.parse(
          JSON.stringify(
            initialTimetable[
              currentUser.role as keyof typeof initialTimetable
            ] || {}
          )
        )
      );
    }
  }, [currentUser]);

  const getDayTimetable = (day: string) => {
    return timetableData[day] || {};
  };

  const filterTimetable = (dayTimetable: any) => {
    if (!isAdmin) return dayTimetable;

    const filtered: any = {};
    for (const [time, slot] of Object.entries(dayTimetable) as [
      string,
      any
    ][]) {
      if (
        (filters.teacher === "" || slot.teacher === filters.teacher) &&
        (filters.class === "" || slot.class === filters.class) &&
        (filters.year === "" || slot.year === filters.year)
      ) {
        filtered[time] = slot;
      }
    }
    return filtered;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentWeek(newDate);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
    setCurrentMonth(newDate);
  };

  const getCurrentDayName = () => {
    return days[new Date().getDay() - 1];
  };

  const handleEditSlot = (day: string, time: string) => {
    const dayTimetable = getDayTimetable(day);
    const slot = dayTimetable[time] || {};
    setCurrentSlot({ day, time });
    setFormData({
      subject: slot.subject || "Islmiyat",
      class: slot.class || "",
      teacher: slot.teacher || "",
      room: slot.room || "",
      year: slot.year || "",
      zoomLink: slot.zoomLink || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteSlot = (day: string, time: string) => {
    const updatedTimetable = { ...timetableData };
    if (updatedTimetable[day] && updatedTimetable[day][time]) {
      delete updatedTimetable[day][time];
      if (Object.keys(updatedTimetable[day]).length === 0) {
        delete updatedTimetable[day];
      }
      setTimetableData(updatedTimetable);
    }
  };

  const handleAddSlot = (day: string, time: string) => {
    setCurrentSlot({ day, time });
    setFormData({
      subject: "Islmiyat",
      class: "",
      teacher: "",
      room: "",
      year: "",
      zoomLink: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { day, time } = currentSlot;
    const updatedTimetable = { ...timetableData };

    if (!updatedTimetable[day]) {
      updatedTimetable[day] = {};
    }

    updatedTimetable[day][time] = {
      subject: formData.subject,
      ...(formData.zoomLink && { zoomLink: formData.zoomLink }),
      ...(currentUser?.role === "TEACHER"
        ? {
            class: formData.class,
            room: formData.room,
            year: formData.year,
          }
        : {
            ...(currentUser?.role === "SCHOOL_ADMIN" && {
              class: formData.class,
              year: formData.year,
            }),
            teacher: formData.teacher,
            room: formData.room,
          }),
    };

    setTimetableData(updatedTimetable);
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const isTeacher = currentUser?.role === "TEACHER";
  const isStudent = currentUser?.role === "STUDENT";
  const canEdit = isAdmin || isTeacher;

  const renderSlotContent = (slot: any) => (
    <>
      <div className="font-medium text-gray-800">{slot.subject}</div>
      {slot.class && <div className="text-sm text-gray-600">{slot.class}</div>}
      {slot.teacher && (
        <div className="text-sm text-gray-600">{slot.teacher}</div>
      )}
      <div className="text-xs text-gray-500 mt-1">{slot.room}</div>
      {slot.zoomLink && (
        <a
          href={slot.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-800 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Link className="h-4 w-4" />
        </a>
      )}
    </>
  );

  const renderEditButtons = (day: string, time: string) =>
    canEdit && (
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditSlot(day, time);
          }}
          className="p-1 text-gray-500 hover:text-blue-600 transition-colors bg-white rounded-full shadow-sm"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSlot(day, time);
          }}
          className="p-1 text-gray-500 hover:text-red-600 transition-colors bg-white rounded-full shadow-sm"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    );

  // Calendar view helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

    const days = [];
    const currentDate = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-100"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday =
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();

      const dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dayOfWeek];
      const hasClasses =
        timetableData[dayName] &&
        Object.keys(timetableData[dayName]).length > 0;

      days.push(
        <div
          key={`day-${day}`}
          className={`h-24 border border-gray-200 p-1 overflow-hidden ${
            isWeekend ? "bg-gray-50" : "bg-white"
          } ${isToday ? "ring-2 ring-indigo-300" : ""}`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${
                isToday ? "text-indigo-700" : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {isToday && (
              <span className="text-xs bg-indigo-100 text-indigo-800 px-1 rounded">
                Today
              </span>
            )}
          </div>
          {!isWeekend && hasClasses && (
            <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
              {Object.entries(timetableData[dayName] || {}).map(
                ([time, slot]: [string, any]) => (
                  <div
                    key={`${day}-${time}`}
                    className="text-xs bg-indigo-50 text-indigo-800 p-1 rounded truncate"
                    title={`${time}: ${slot.subject} with ${
                      slot.teacher || slot.class
                    }`}
                  >
                    {time.split(" ")[0]} {slot.subject}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value);
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Islamic School Timetable
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === "week"
              ? `Week of ${currentWeek.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : viewMode === "month"
              ? `${currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}`
              : `${getCurrentDayName()}, ${currentWeek.toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "day"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Day View
          </Button>
          <Button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "week"
                ? "!bg-primary !text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Week View
          </Button>
          <Button
            onClick={() => setViewMode("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "month"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Month View
          </Button>

          {viewMode === "day" && (
            <div className="flex items-center bg-white border border-gray-300 h-8 rounded overflow-hidden">
              <button
                onClick={() => {
                  const newDate = new Date(currentWeek);
                  newDate.setDate(newDate.getDate() - 1);
                  setCurrentWeek(newDate);
                }}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div
                className="px-3 flex items-center gap-2 py-2 text-sm text-gray-600 border-x border-gray-300 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowDayPicker(true)}
              >
                <Calendar className="h-4 w-4 inline" />
                {currentWeek.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={() => {
                  const newDate = new Date(currentWeek);
                  newDate.setDate(newDate.getDate() + 1);
                  setCurrentWeek(newDate);
                }}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {viewMode === "week" && (
            <div className="flex items-center bg-white border border-gray-300 h-8 rounded overflow-hidden">
              <button
                onClick={() => navigateWeek("prev")}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div
                className="px-3 flex items-center gap-2 py-2 text-sm text-gray-600 border-x border-gray-300 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowWeekPicker(true)}
              >
                <Calendar className="h-4 w-4 inline" />
                {new Date().getMonth() === currentWeek.getMonth() &&
                new Date().getFullYear() === currentWeek.getFullYear()
                  ? "This Week"
                  : "Selected Week"}
              </div>
              <button
                onClick={() => navigateWeek("next")}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {viewMode === "month" && (
            <div className="flex items-center bg-white border border-gray-300 h-8 rounded overflow-hidden">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div
                className="px-3 flex items-center gap-2 py-2 text-sm text-gray-600 border-x border-gray-300 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowMonthPicker(true)}
              >
                <Calendar className="h-4 w-4 inline" />
                {new Date().getMonth() === currentMonth.getMonth() &&
                new Date().getFullYear() === currentMonth.getFullYear()
                  ? "This Month"
                  : "Selected Month"}
              </div>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {showWeekPicker && (
        <div className="absolute right-0-3 md:right-6 top-16 z-10 mt-2">
          <DatePicker
            open={showWeekPicker}
            onOpenChange={setShowWeekPicker}
            onChange={handleWeekChange}
            picker="week"
            defaultValue={dayjs(currentWeek)}
          />
        </div>
      )}

      {showMonthPicker && (
        <div className="absolute right-0-3 md:right-6 top-16 z-10 mt-2">
          <DatePicker
            open={showMonthPicker}
            onOpenChange={setShowMonthPicker}
            onChange={handleMonthChange}
            picker="month"
            defaultValue={dayjs(currentMonth)}
          />
        </div>
      )}

      {showDayPicker && (
        <div className="absolute right-0-3 md:right-6 top-16 z-10 mt-2">
          <DatePicker
            open={showDayPicker}
            onOpenChange={setShowDayPicker}
            onChange={handleDayChange}
            defaultValue={dayjs(currentWeek)}
          />
        </div>
      )}

      {viewMode === "week" && (
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                // value={selectedClass || undefined}
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
          </div>
        </div>
      )}

      {viewMode === "month" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className={`bg-gray-100 py-2 text-center text-sm font-medium ${
                  day === "Sat" || day === "Sun"
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      ) : viewMode === "week" ? (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Time
                    </div>
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((time) => (
                  <tr key={time} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-40">
                      {time}
                    </td>
                    {days.map((day) => {
                      const dayTimetable = getDayTimetable(day);
                      const filteredTimetable = filterTimetable(dayTimetable);
                      const slot = filteredTimetable[time];
                      return (
                        <td
                          key={`${day}-${time}`}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {slot ? (
                            <div className="p-3 bg-indigo-50 rounded-lg relative group h-full min-h-[80px] border border-indigo-100 hover:border-indigo-200 transition-colors">
                              {renderSlotContent(slot)}
                              {renderEditButtons(day, time)}
                            </div>
                          ) : (
                            <div className="h-16 border-2 border-dashed border-gray-200 rounded-lg relative hover:border-gray-300 transition-colors">
                              {canEdit && (
                                <button
                                  onClick={() => handleAddSlot(day, time)}
                                  className="absolute inset-0 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                  <Plus className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {getCurrentDayName()}
              </h2>
              {isAdmin && (
                <div className="flex space-x-3">
                  <select
                    name="teacher"
                    value={filters.teacher}
                    onChange={(e) =>
                      handleFilterChange({
                        name: "teacher",
                        value: e.target.value,
                      })
                    }
                    className="text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  >
                    <option value="">All Teachers</option>
                    {teachers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                  <select
                    name="class"
                    value={filters.class}
                    onChange={(e) =>
                      handleFilterChange({
                        name: "class",
                        value: e.target.value,
                      })
                    }
                    className="text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {timeSlots.map((time) => {
                const dayTimetable = getDayTimetable(getCurrentDayName());
                const filteredTimetable = filterTimetable(dayTimetable);
                const slot = filteredTimetable[time];
                return (
                  <div key={time} className="flex items-start gap-4">
                    <div className="w-24 flex-shrink-0 flex items-center justify-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-700">{time}</span>
                    </div>
                    {slot ? (
                      <div className="flex-1 p-4 bg-indigo-50 rounded-lg relative group min-h-[80px] border border-indigo-100 hover:border-indigo-200 transition-colors">
                        {renderSlotContent(slot)}
                        {renderEditButtons(getCurrentDayName(), time)}
                      </div>
                    ) : (
                      <div className="flex-1 h-16 border-2 border-dashed border-gray-200 rounded-lg relative hover:border-gray-300 transition-colors">
                        {canEdit && (
                          <button
                            onClick={() =>
                              handleAddSlot(getCurrentDayName(), time)
                            }
                            className="absolute inset-0 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        footer={null}
        centered
        className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:p-0"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentSlot && timetableData[currentSlot.day]?.[currentSlot.time]
              ? "Edit Class Slot"
              : "Add New Class Slot"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  readOnly
                  className="w-full bg-gray-50"
                />
              </div>

              {(isAdmin || isTeacher) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <Select
                    name="year"
                    value={formData.year}
                    onChange={(value) =>
                      setFormData({ ...formData, year: value })
                    }
                    className="w-full"
                    required
                  >
                    <Option value="">Select Year</Option>
                    {years?.map((year) => (
                      <Select.Option key={year.id} value={year.id}>
                        {year?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              {isAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <Select
                      name="teacher"
                      value={formData.teacher}
                      onChange={(value) =>
                        setFormData({ ...formData, teacher: value })
                      }
                      className="w-full"
                      required
                    >
                      <Option value="">Select Teacher</Option>
                      {teachers?.map((teacher) => (
                        <Option key={teacher.id} value={teacher.id}>
                          {teacher.teacher_name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <Select
                      name="class"
                      value={formData.class}
                      onChange={(value) =>
                        setFormData({ ...formData, class: value })
                      }
                      className="w-full"
                      required
                    >
                      <Option value="">Select Class</Option>
                      {classes?.map((cls) => (
                        <Option key={cls.id} value={cls.id}>
                          {cls.class_name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </>
              )}

              {isTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <Select
                    name="class"
                    value={formData.class}
                    onChange={(value) =>
                      setFormData({ ...formData, class: value })
                    }
                    className="w-full"
                    required
                  >
                    <Option value="">Select Class</Option>
                    {classes.map((cls) => (
                      <Option key={cls.id} value={cls.id}>
                        {cls.class_name}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room/Location
                </label>
                <Input
                  name="room"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  placeholder="e.g. Masjid, Room 101, Lab 2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom Link (optional)
                </label>
                <Input
                  name="zoomLink"
                  value={formData.zoomLink}
                  onChange={(e) =>
                    setFormData({ ...formData, zoomLink: e.target.value })
                  }
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="px-4 py-2 text-sm !bg-primary !text-white !border-primary hover:!bg-primary/90 rounded-lg shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
