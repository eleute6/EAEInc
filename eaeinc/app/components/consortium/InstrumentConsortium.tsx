"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface Upload {
  id: number;
  title: string;
  keywords: string[];
  author: string;
  date: string;
}

export default function InstrumentConsortium() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [query, setQuery] = useState("");

  // Simulate fetching the most recent 20 uploads
  useEffect(() => {
    const mockUploads: Upload[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      title: `Sample Research Paper ${i + 1}`,
      keywords: ["Biology", "Chemistry", "Physics"].slice(0, (i % 3) + 1),
      author: `Author ${i + 1}`,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    }));
    setUploads(mockUploads);
  }, []);

  // Filter uploads by query (search in title or keywords)
  const filteredUploads = uploads.filter(
    (u) =>
      u.title.toLowerCase().includes(query.toLowerCase()) ||
      u.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div
      className="mx-auto p-8 lg:p-10 space-y-6 bg-white rounded-lg shadow-md 
                 max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
    >
      <h1 className="text-3xl font-bold text-[#002855] border-b-2 border-[#FFC72C] pb-2">
        Instrument Consortium
      </h1>
      <p className="text-[#002855] font-medium bg-[#FFC72C]/20 p-3 rounded-md">
        Use the search bar to filter by keywords or titles to find specific
        documents.
      </p>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 bg-white border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm">
        <Search className="h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by keyword or title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {/* Upload List */}
      <div className="space-y-4">
        {filteredUploads.length === 0 ? (
          <p className="text-gray-500">No uploads found.</p>
        ) : (
          filteredUploads.map((upload) => (
            <div
              key={upload.id}
              className="border border-[#002855]/20 rounded-md p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-[#002855]">
                {upload.title}
              </h2>
              <p className="text-sm text-gray-600">
                By {upload.author} • {upload.date}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {upload.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-[#FFC72C]/30 text-[#002855] text-xs font-medium px-2 py-1 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
