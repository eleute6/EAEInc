"use client";

import React, { useState } from "react";
import { CalendarDays, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { createEvent } from "@/app/serverfuns";
import { useSession } from "next-auth/react";

interface Event {
  title: string;
  date: string;
  location: string;
}

interface UploadRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  fileName: string;
}

export default function AdminPage() {
  const { data: session } = useSession(); // <-- use session here
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    date: "",
    location: "",
  });

  const [uploads, setUploads] = useState<UploadRequest[]>([
    {
      id: 1,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      description: "Research on AI ethics",
      fileName: "ai_ethics.pdf",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      description: "Budget justification study",
      fileName: "budget_study.pdf",
    },
  ]);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(
      newEvent.title,
      "", // description optional
      session?.user?.email ?? "admin@example.com", // <-- use session user
      `${newEvent.date} 00:00:00`, // format for MySQL DATETIME
      `${newEvent.date} 00:00:00`,
      newEvent.location
    );
    setNewEvent({ title: "", date: "", location: "" });
  };

  const handleApprove = (id: number) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    // TODO: send to Instrument Consortium backend
  };

  const handleReject = (id: number) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    // TODO: log rejection
  };

  return (
    <div className="mx-auto p-8 lg:p-10 space-y-10 bg-white rounded-lg shadow-md max-w-5xl">
      <h1 className="text-3xl font-bold text-[#002855] border-b-2 border-[#FFC72C] pb-2">
        Admin Dashboard
      </h1>

      {/* Create Event Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#002855] border-b pb-2">
          Create Upcoming Event
        </h2>
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
            required
          />
          <input
            type="date" // use date input for proper format
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
            required
          />
          <input
            type="text"
            placeholder="Event Location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
            required
          />
          <Button
            type="submit"
            className="bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855] transition font-semibold"
          >
            Add Event
          </Button>
        </form>

        {/* Display Events */}
        <aside className="space-y-3">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-[#FDB813]/10 transition"
            >
              <CalendarDays className="w-5 h-5 text-[#003768]" />
              <div>
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
      </section>

      {/* Approve Uploads Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#002855] border-b pb-2">
          Approve Upload Requests
        </h2>
        {uploads.length === 0 ? (
          <p className="text-gray-500">No pending uploads.</p>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-[#FFC72C]/10 transition"
              >
                <div>
                  <p className="font-semibold text-[#002855]">
                    {upload.firstName} {upload.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{upload.email}</p>
                  <p className="text-sm text-gray-700">{upload.description}</p>
                  <p className="text-xs text-gray-500">{upload.fileName}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleApprove(upload.id)}
                    className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </Button>
                  <Button
                    onClick={() => handleReject(upload.id)}
                    className="bg-red-600 text-white hover:bg-red-700 flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
