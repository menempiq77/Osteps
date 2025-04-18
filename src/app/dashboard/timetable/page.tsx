"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal } from "antd";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const timeSlots = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 1:00",
  "1:00 - 2:00",
  "2:00 - 3:00",
  "3:00 - 4:00",
];

// Sample teachers data
const teachers = [
  "Sheikh Ahmed",
  "Sheikh Yusuf",
  "Sheikh Ibrahim",
  "Sheikh Mohammed",
];
const years = [
  "year 1",
  "year 2",
  "year 3"
];

// Sample classes data
const classes = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

// Sample initial data
const initialTimetable = {
  TEACHER: {
    Monday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        class: "Grade 10",
        room: "Masjid",
      },
      "9:00 - 10:00": {
        subject: "Islmiyat",
        class: "Grade 11",
        room: "Room 205",
      },
    },
    Tuesday: {
      "10:00 - 11:00": { 
        subject: "Islmiyat", 
        class: "Grade 12", 
        room: "Lab 1" 
      },
    },
  },
  STUDENT: {
    Monday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Ahmed",
        room: "Masjid",
      },
      "9:00 - 10:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Yusuf",
        room: "Room 205",
      },
    },
    Tuesday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Mohammed",
        room: "Room 102",
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
      },
      "9:00 - 10:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Yusuf",
        class: "Grade 11",
        room: "Room 205",
      },
    },
    Tuesday: {
      "10:00 - 11:00": { 
        subject: "Islmiyat", 
        teacher: "Sheikh Ibrahim",
        class: "Grade 12", 
        room: "Lab 1" 
      },
    },
    Wednesday: {
      "8:00 - 9:00": {
        subject: "Islmiyat",
        teacher: "Sheikh Mohammed",
        class: "Grade 9",
        room: "Room 101",
      },
    },
  },
};

export default function TimetablePage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
  const [timetableData, setTimetableData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: "Islmiyat",
    class: "",
    teacher: "",
    room: "",
    year: "",
  });
  const [filters, setFilters] = useState({
    teacher: "",
    class: "",
  });

  useEffect(() => {
    // In a real app, you would fetch this data from your API
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
    for (const [time, slot] of Object.entries(dayTimetable) as [string, any][]) {
      if (
        (filters.teacher === "" || slot.teacher === filters.teacher) &&
        (filters.class === "" || slot.class === filters.class)
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

  const getCurrentDayName = () => {
    return days[new Date().getDay() - 1]; // Simple approximation
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
    });
    setIsModalOpen(true);
  };

  const handleDeleteSlot = (day: string, time: string) => {
    const updatedTimetable = { ...timetableData };
    if (updatedTimetable[day] && updatedTimetable[day][time]) {
      delete updatedTimetable[day][time];
      // Clean up empty days
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
      ...(currentUser?.role === "TEACHER"
        ? { class: formData.class, room: formData.room }
        : { 
            ...(currentUser?.role === "SCHOOL_ADMIN" && { class: formData.class }),
            teacher: formData.teacher, 
            room: formData.room 
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

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const canEdit = isAdmin;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Islamic School Timetable
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "day"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "week"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Week View
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">
              {viewMode === "week"
                ? `Week of ${currentWeek.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : `${getCurrentDayName()}, ${currentWeek.toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}`}
            </span>
          </div>
          <button
            onClick={() => navigateWeek("next")}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {isAdmin && viewMode === "week" && (
          <div className="flex space-x-4 p-4 bg-gray-50 border-b">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by year
              </label>
              <select
                name="teacher"
                value={filters.teacher}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Teacher
              </label>
              <select
                name="teacher"
                value={filters.teacher}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Teachers</option>
                {teachers.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Class
              </label>
              <select
                name="class"
                value={filters.class}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {viewMode === "week" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {time}
                      </div>
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
                            <div className="p-3 bg-green-50 rounded-lg relative group">
                              <div className="font-medium text-green-800">
                                {slot.subject}
                              </div>
                              {slot.class && (
                                <div className="text-sm text-gray-600">
                                  {slot.class}
                                </div>
                              )}
                              {slot.teacher && (
                                <div className="text-sm text-gray-600">
                                  {slot.teacher}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                {slot.room}
                              </div>

                              {canEdit && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                  <button
                                    onClick={() => handleEditSlot(day, time)}
                                    className="p-1 text-green-600 hover:text-green-800"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlot(day, time)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-16 border border-dashed border-gray-200 rounded-lg relative">
                              {canEdit && (
                                <button
                                  onClick={() => handleAddSlot(day, time)}
                                  className="absolute inset-0 flex items-center justify-center text-gray-400 hover:text-green-600"
                                >
                                  <PlusIcon className="h-5 w-5" />
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
        ) : (
          // Day View
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {getCurrentDayName()}
            </h2>
            {isAdmin && (
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Teacher
                  </label>
                  <select
                    name="teacher"
                    value={filters.teacher}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Teachers</option>
                    {teachers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Class
                  </label>
                  <select
                    name="class"
                    value={filters.class}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {timeSlots.map((time) => {
                const dayTimetable = getDayTimetable(getCurrentDayName());
                const filteredTimetable = filterTimetable(dayTimetable);
                const slot = filteredTimetable[time];
                return (
                  <div key={time} className="flex items-start">
                    <div className="w-32 flex-shrink-0 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{time}</span>
                    </div>
                    {slot ? (
                      <div className="flex-1 p-4 bg-green-50 rounded-lg relative group">
                        <div className="font-medium text-green-800">
                          {slot.subject}
                        </div>
                        {slot.class && (
                          <div className="text-sm text-gray-600">
                            {slot.class}
                          </div>
                        )}
                        {slot.teacher && (
                          <div className="text-sm text-gray-600">
                            {slot.teacher}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.room}
                        </div>

                        {canEdit && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                            <button
                              onClick={() =>
                                handleEditSlot(getCurrentDayName(), time)
                              }
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSlot(getCurrentDayName(), time)
                              }
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 h-16 border border-dashed border-gray-200 rounded-lg relative">
                        {canEdit && (
                          <button
                            onClick={() =>
                              handleAddSlot(getCurrentDayName(), time)
                            }
                            className="absolute inset-0 flex items-center justify-center text-gray-400 hover:text-green-600"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add to sidebar navigation */}
      {pathname.startsWith("/dashboard") && (
        <div className="mt-6">
          <Link
            href="/dashboard/timetable"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" />
            View Timetable
          </Link>
        </div>
      )}

      {/* Modal for adding/editing slots */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        footer={null}
        title={
          <h2 className="text-xl font-semibold">
            {currentSlot && timetableData[currentSlot.day]?.[currentSlot.time]
              ? "Edit"
              : "Add"}{" "}
            Class Slot
          </h2>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {isAdmin && (
              <>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <select
                    name="teacher"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <select
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {currentUser?.role === "TEACHER" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g. Masjid or Room 101"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}