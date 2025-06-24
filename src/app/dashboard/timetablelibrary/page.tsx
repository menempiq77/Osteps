"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventContentArg } from "@fullcalendar/core";

function Timetable() {
  const events = [
    {
      title: "Islamic Studies",
      start: "2025-06-01T08:00:00",
      end: "2025-06-01T09:00:00",
      extendedProps: {
        teacher: "Sheikh Ahmed",
        room: "Masjid",
        zoomLink: "https://zoom.us/j/123"
      }
    }
    // ... more events
  ];

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className="p-2">
      <b>{eventInfo.event.title}</b>
      <div>{eventInfo.event.extendedProps.teacher}</div>
      <div>{eventInfo.event.extendedProps.room}</div>
    </div>
  );

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        eventContent={renderEventContent}
        editable={true}
        selectable={true}
        nowIndicator={true}
        height="auto"
      />
    </div>
  );
}

export default Timetable;