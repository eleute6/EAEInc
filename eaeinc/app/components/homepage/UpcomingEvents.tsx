"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchEvents } from "../../serverfuns";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState(0); // track which "page" of events we're on
  const pageSize = 3;

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      // sort by soonest startDateTime
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime()
      );
      setEvents(sorted);
    };
    loadEvents();
  }, []);

  // slice events for current page
  const startIndex = page * pageSize;
  const currentEvents = events.slice(startIndex, startIndex + pageSize);

  const hasPrev = page > 0;
  const hasNext = startIndex + pageSize < events.length;

  return (
    <aside className="bg-white rounded-lg shadow-md border border-[#003768]/20 p-4 space-y-4">
      <h2 className="text-lg font-bold text-[#003768] border-b pb-2">
        Upcoming Events
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming events yet.</p>
      ) : (
        <>
          {currentEvents.map((event) => (
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
          ))}

          {/* Pagination controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrev}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                hasPrev
                  ? "bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md ${
                hasNext
                  ? "bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
