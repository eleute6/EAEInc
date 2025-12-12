"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { fetchEvents } from "../../serverfuns";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  return (
    <aside className="bg-white rounded-lg shadow-md border border-[#003768]/20 p-4 space-y-4">
      <h2 className="text-lg font-bold text-[#003768] border-b pb-2">
        Upcoming Events
      </h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming events yet.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.eventID}
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
              <p className="text-xs text-gray-500">
                {new Date(event.startDateTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </aside>
  );
}
