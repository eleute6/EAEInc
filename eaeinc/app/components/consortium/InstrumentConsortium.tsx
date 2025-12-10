"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export interface ConsortiumItem {
  id: number;
  title: string;
  description: string;
  department?: string; //This field won't be used, but is available for later if desired.
  tags: string[];
  uploadedBy: string;
  link: string;
}

export default function InstrumentConsortium() {
  const [items, setItems] = useState<ConsortiumItem[]>([]);
  const [query, setQuery] = useState("");

  // Load items from backend
  useEffect(() => {
    fetch("/api/consortium")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to fetch consortium items:", err));
  }, []);

  // Filter items by keyword
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      (item.department?.toLowerCase().includes(query.toLowerCase()) ?? false)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Instrument Consortium
      </h1>
      <p className="text-gray-600">
        Search and explore instruments, datasets, and resources shared by the
        community.
      </p>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-md px-4 py-2 shadow-sm"
        />
        <Button variant="default">
          <Search size={16} /> Search
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-lg shadow-sm p-4 space-y-2"
            >
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              {item.department && (
                <p className="text-xs text-gray-500">Dept: {item.department}</p>
              )}
              <p className="text-xs text-gray-500">
                Uploaded by {item.uploadedBy}
              </p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Resource
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items found for "{query}".</p>
        )}
      </div>
    </div>
  );
}
