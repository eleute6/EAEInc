"use client";

import React from "react";
import { CalendarDays, MapPin } from "lucide-react";

interface Event {
  title: string;
  date: string;
  location: string;
}

const events: Event[] = [
  {
    title: "Community Research Symposium",
    date: "Nov 20, 2025",
    location: "Merrimack College, Room 214",
  },
  {
    title: "Faculty Collaboration Workshop",
    date: "Dec 5, 2025",
    location: "Library Conference Hall",
  },
  {
    title: "Student Research Showcase",
    date: "Jan 10, 2026",
    location: "Sakowich Center",
  },
];

export default function UpcomingEvents() {
  return (
    <aside className="bg-white rounded-lg shadow-md border border-[#003768]/20 p-4 space-y-4">
      <h2 className="text-lg font-bold text-[#003768] border-b pb-2">
        Upcoming Events
      </h2>

      {events.map((event) => (
        <div
          key={event.title}
          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-[#FDB813]/10 transition"
        >
          <div className="mt-1">
            <CalendarDays className="w-5 h-5 text-[#003768]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#003768]">{event.title}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-[#FDB813]" />
              {event.location}
            </p>
            <p className="text-xs text-gray-500">{event.date}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}
