"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchConsortiumAll, fetchConsortiumTag } from "@/app/serverfuns";
import Header from "../Header";
import { useSession } from "next-auth/react";

export interface Upload {
  id: number;
  title: string;
  description: string;
  keywords: string[];
  author: string;
  date: string;
  filePath: string;
}

export default function InstrumentConsortium() {
  const { data: session } = useSession();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [query, setQuery] = useState("");

  // Helper to map DB rows into Upload objects
  const mapInstruments = (instruments: any[]): Upload[] =>
    instruments.map((inst) => ({
      id: inst.id,
      title: inst.title,
      description: inst.description,
      keywords: inst.tags || [],
      author: inst.emailID,
      date: new Date(inst.upload).toLocaleDateString(),
      filePath: inst.filePath,
    }));

  // Initial load: fetch all approved instruments with tags
  useEffect(() => {
    const loadUploads = async () => {
      const instruments = await fetchConsortiumAll();
      setUploads(mapInstruments(instruments));
    };
    loadUploads();
  }, []);

  // Handle search input
  const handleQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const tags = value.toLowerCase().split(/\s+/).filter(Boolean);

    if (tags.length === 0) {
      const instruments = await fetchConsortiumAll();
      setUploads(mapInstruments(instruments));
      return;
    }

    const instruments = await fetchConsortiumTag(tags);
    setUploads(mapInstruments(instruments));
  };

  // Filter client-side as well (title + keywords)
  const filteredUploads = uploads.filter(
    (u) =>
      u.title.toLowerCase().includes(query.toLowerCase()) ||
      u.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="mx-auto p-8 lg:p-10 space-y-6 bg-white rounded-lg shadow-md max-w-5xl">
      <h1 className="text-3xl font-bold text-[#002855] border-b-2 border-[#FFC72C] pb-2">
        Instrument Consortium
      </h1>
      <Header
        user={{
          name: session?.user?.name || "Admin",
          email: session?.user?.email || "",
          image: session?.user?.image || "",
          isAdmin: session?.user?.isAdmin ?? false,
        }}
      />
      <p className="text-[#002855] font-medium bg-[#FFC72C]/20 p-3 rounded-md">
        Use the search bar to filter by keywords or titles to find specific
        documents.
      </p>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm">
        <Search className="h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by keyword or title..."
          value={query}
          onChange={handleQueryChange}
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
              <p className="mt-2 text-gray-700">{upload.description}</p>

              {/* Keywords */}
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

              {upload.filePath && (
                <a
                  href={upload.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#002855] underline hover:text-[#FFC72C] block mt-2"
                >
                  View PDF
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
