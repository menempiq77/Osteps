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
  LinkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal } from "antd";
import { Select } from "antd";
const { Option } = Select;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
];

const teachers = [
  "Sheikh Ahmed",
  "Sheikh Yusuf",
  "Sheikh Ibrahim",
  "Sheikh Mohammed",
];
const years = ["year 1", "year 2", "year 3"];

const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

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
    zoomLink: "",
  });
  const [filters, setFilters] = useState({
    teacher: "",
    class: "",
    year: "",
  });

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
          <LinkIcon className="h-4 w-4" />
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
          <PencilIcon className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSlot(day, time);
          }}
          className="p-1 text-gray-500 hover:text-red-600 transition-colors bg-white rounded-full shadow-sm"
        >
          <TrashIcon className="h-3 w-3" />
        </button>
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
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
              : `${getCurrentDayName()}, ${currentWeek.toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "day"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "week"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Week View
          </button>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => navigateWeek("prev")}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
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
            <div className="px-3 flex items-center gap-2 py-2 text-sm text-gray-600 border-x border-gray-300">
              <CalendarIcon className="h-4 w-4 inline" />
              {new Date().getMonth() === currentWeek.getMonth()
                ? "This Week"
                : "Selected Week"}
            </div>
            <button
              onClick={() => navigateWeek("next")}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
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
        </div>
      </div>

      {viewMode === "week" && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Year
              </label>
              <Select
                value={filters.year || undefined}
                onChange={(value) =>
                  handleFilterChange({ name: "year", value })
                }
                className="w-full"
                placeholder="All Years"
                allowClear
              >
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Class
              </label>
              <Select
                value={filters.class || undefined}
                onChange={(value) =>
                  handleFilterChange({ name: "class", value })
                }
                className="w-full"
                placeholder="All Classes"
                allowClear
              >
                {classes.map((cls) => (
                  <Option key={cls} value={cls}>
                    {cls}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Teacher
              </label>
              <Select
                value={filters.teacher || undefined}
                onChange={(value) =>
                  handleFilterChange({ name: "teacher", value })
                }
                className="w-full"
                placeholder="All Teachers"
                allowClear
              >
                {teachers.map((teacher) => (
                  <Option key={teacher} value={teacher}>
                    {teacher}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === "week" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
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
                    onChange={handleFilterChange}
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
                    onChange={handleFilterChange}
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

      {pathname.startsWith("/dashboard") && (
        <div className="mt-6">
          <Link
            href="/dashboard/timetable"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" />
            View Full Timetable
          </Link>
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
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  readOnly
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              {(isAdmin || isTeacher) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {isAdmin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <select
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleInputChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Teacher</option>
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
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {isTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Class</option>
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
                  Room/Location
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="e.g. Masjid, Room 101, Lab 2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom Link (optional)
                </label>
                <input
                  type="url"
                  name="zoomLink"
                  value={formData.zoomLink}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
