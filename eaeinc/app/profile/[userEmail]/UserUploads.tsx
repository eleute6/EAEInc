"use client";

import { useState, useEffect } from "react";
import { deleteInstrument, fetchApprovedUploadsByUser } from "@/app/serverfuns";
import { Button } from "@/app/components/ui/button";

export default function UserUploads({ email }: { email: string }) {
  const [uploads, setUploads] = useState<any[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Load uploads initially
  useEffect(() => {
    const load = async () => {
      const data = await fetchApprovedUploadsByUser(email);
      setUploads(data);
    };
    load();
  }, [email]);

  const handleDelete = async (id: number) => {
    await deleteInstrument(id, email); // persist deletion
    setUploads((prev) => prev.filter((u) => u.id !== id)); // instant UI update
    setConfirmDeleteId(null);
  };

  return (
    <div className="mt-4 max-h-[600px] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uploads.map((u) => (
          <div
            key={u.id}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="font-medium text-lg">{u.name}</p>
              <p className="text-sm text-gray-600 mt-1">{u.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Uploaded: {new Date(u.date).toLocaleDateString()}
              </p>
            </div>
            {u.file && (
              <a
                href={u.file}
                className="mt-3 text-blue-600 hover:underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                View File
              </a>
            )}
            <Button
              variant="outline"
              className="mt-3 text-red-600 border-red-600 hover:bg-red-100"
              onClick={() => setConfirmDeleteId(u.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {/* Confirmation modal */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-[#002855] mb-4">
              Are you sure you want to delete?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-gray-400 text-gray-600 hover:bg-gray-100"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(confirmDeleteId)}
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
