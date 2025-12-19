"use client";

import React, { useEffect, useState } from "react";
import Header from "../Header";

import {
  CalendarDays,
  MapPin,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  fetchUploadRequests,
  approveUploadRequest,
  rejectUploadRequest,
} from "@/app/serverfuns";
import { useSession } from "next-auth/react";

interface Event {
  eventID?: number;
  title: string;
  date: string;
  location: string;
}

interface UploadRequest {
  requestID: number;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  fileName: string;
  fileURL: string; // <-- new field for PDF link
  tags?: string; // optional: comma-separated tag names
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    date: "",
    location: "",
  });

  const [uploads, setUploads] = useState<UploadRequest[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Load events and uploads from DB on mount
  useEffect(() => {
    const loadData = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);

      const uploadsData = await fetchUploadRequests();
      setUploads(uploadsData);
    };
    loadData();
  }, []);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(
      newEvent.title,
      "",
      session?.user?.email ?? "admin@example.com",
      `${newEvent.date} 00:00:00`,
      `${newEvent.date} 00:00:00`,
      newEvent.location
    );
    setNewEvent({ title: "", date: "", location: "" });
    setShowPopup(true);

    // refresh events from DB
    const data = await fetchEvents();
    setEvents(data);
  };

  const handleDeleteEvent = async (eventID?: number) => {
    if (!eventID) return;
    await deleteEvent(eventID);

    // refresh events from DB
    const data = await fetchEvents();
    setEvents(data);

    setConfirmDeleteId(null);
  };

  const handleApprove = async (id: number) => {
    await approveUploadRequest(id);
    const uploadsData = await fetchUploadRequests();
    setUploads(uploadsData);
  };

  const handleReject = async (id: number) => {
    await rejectUploadRequest(id);
    const uploadsData = await fetchUploadRequests();
    setUploads(uploadsData);
  };

  return (
    <div className="mx-auto p-8 lg:p-10 space-y-10 bg-white rounded-lg shadow-md max-w-5xl">
      <h1 className="text-3xl font-bold text-[#002855] border-b-2 border-[#FFC72C] pb-2">
        Admin Dashboard
      </h1>

      <Header
        user={{
          name: session?.user?.name || "Admin",
          email: session?.user?.email || "",
          image: session?.user?.image || "",
          isAdmin: session?.user?.isAdmin ?? false,
        }}
      />

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
            type="date"
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
          {events.map((event) => (
            <div
              key={event.eventID}
              className="flex items-start justify-between p-2 rounded-lg hover:bg-[#FDB813]/10 transition"
            >
              <div className="flex items-start space-x-3">
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
              <Button
                onClick={() => setConfirmDeleteId(event.eventID ?? null)}
                className="bg-red-600 text-white hover:bg-red-700 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
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
                key={upload.requestID}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-[#FFC72C]/10 transition"
              >
                <div>
                  <p className="font-semibold text-[#002855]">
                    {upload.firstName} {upload.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{upload.email}</p>
                  <p className="text-sm text-gray-700">{upload.description}</p>
                  <p className="text-xs text-gray-500">{upload.fileName}</p>
                  {upload.tags && (
                    <p className="text-xs text-gray-500">Tags: {upload.tags}</p>
                  )}
                  {upload.fileURL && (
                    <a
                      href={upload.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#002855] underline hover:text-[#FFC72C] block mt-1"
                    >
                      View PDF
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleApprove(upload.requestID)}
                    className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </Button>
                  <Button
                    onClick={() => handleReject(upload.requestID)}
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

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full border-t-4 border-[#FFC72C]">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-[#002855] transition"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#002855]">
              Event created successfully
            </h2>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowPopup(false)}
                className="bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855] transition font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full border-t-4 border-red-600">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Are you sure you want to delete this event?
            </h2>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-300 text-gray-800 hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteEvent(confirmDeleteId ?? undefined)}
                className="bg-red-600 text-white hover:bg-red-700 transition font-semibold"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
