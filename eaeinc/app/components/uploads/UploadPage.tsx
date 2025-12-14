"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Combobox } from "@headlessui/react";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    keywords: [] as string[],
    file: null as File | null,
    title: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");
  const [availableKeywords, setAvailableKeywords] = useState<string[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => fileInputRef.current?.click();

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await fetch("/api/tag");
        if (response.ok) {
          const data = await response.json();
          setAvailableKeywords(data.tags || []);
        } else {
          console.error("Failed to load keywords");
        }
      } catch (error) {
        console.error("Error fetching keywords", error);
      } finally {
        setIsLoadingKeywords(false);
      }
    };

    fetchKeywords();
  }, []);


  const filteredKeywords =
    query === ""
      ? availableKeywords
      : availableKeywords.filter((kw) =>
          kw.toLowerCase().includes(query.toLowerCase())
        );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please select a PDF file before submitting.");
      return;
    }

    const fd = new FormData();
    fd.append("file", formData.file);
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("email", formData.email);
    fd.append("description", formData.description);
    fd.append("keywords", JSON.stringify(formData.keywords));
    fd.append("title", formData.title);

    const res = await fetch("/api/upload-request", {
      method: "POST",
      body: fd,
    });
    if (res.ok) {
      setShowPopup(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        description: "",
        keywords: [],
        file: null,
        title: "",
      });
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Upload failed. Please try again.");
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);
  return (
    <div className="mx-auto p-8 lg:p-10 space-y-6 bg-white rounded-lg shadow-md max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <h1 className="text-3xl font-bold text-[#002855] border-b-2 border-[#FFC72C] pb-2">
        Upload Resources
      </h1>
      <p className="text-[#002855] font-medium bg-[#FFC72C]/20 p-3 rounded-md">
        By choosing to upload to the Merrimack College Community Research Page,
        you give permission for other users to view and download your work.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First/Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block text-sm font-semibold text-[#002855]">
            First Name <span className="text-[#FFC72C]">*</span>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="mt-1 w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#002855]">
            Last Name <span className="text-[#FFC72C]">*</span>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="mt-1 w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
              required
            />
          </label>
        </div>
        <label className="block text-sm font-semibold text-[#002855]">
          Research Title <span className="text-[#FFC72C]">*</span>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="mt-1 w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
            required
          />
        </label>

        {/* Email */}
        <label className="block text-sm font-semibold text-[#002855]">
          Email Address <span className="text-[#FFC72C]">*</span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="mt-1 w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
            required
          />
        </label>

        {/* Description */}
        <label className="block text-sm font-semibold text-[#002855]">
          Brief Description <span className="text-[#FFC72C]">*</span>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1 w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
            rows={4}
            required
          />
        </label>

        {/* Keyword Dropdown */}
        <div>
          <p className="font-semibold text-[#002855] mb-2">
            Select Keywords <span className="text-[#FFC72C]">*</span>
          </p>
          <Combobox
            value={formData.keywords}
            onChange={(selected) => {
              if (selected.length <= 5) {
                setFormData((prev) => ({ ...prev, keywords: selected }));
              }
            }}
            multiple
          >
            <div className="relative">
              <Combobox.Input
                className="w-full border border-[#002855]/30 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-[#FFC72C]"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(keywords: string[]) => keywords.join(", ")}
                placeholder="Search or select up to 5 keywords..."
                required
              />
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg z-10">
                {isLoadingKeywords && (
                  <div className="cursor-default select-none px-4 py-2 text-gray-500">
                    Loading keywords...
                  </div>
                )}
                {!isLoadingKeywords && filteredKeywords.length === 0 && (
                  <div className="cursor-default select-none px-4 py-2 text-gray-500">
                    No results found.
                  </div>
                )}
                {filteredKeywords.map((kw) => (
                  <Combobox.Option
                    key={kw}
                    value={kw}
                    disabled={
                      formData.keywords.length >= 5 &&
                      !formData.keywords.includes(kw)
                    }
                    className={({ active, disabled }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : active
                          ? "bg-[#002855] text-white"
                          : "text-gray-900"
                      }`
                    }
                  >
                    {kw}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>

        {/* File Upload */}
        <div>
          <p className="block text-sm font-semibold text-[#002855] mb-1">
            Upload File (PDF only) <span className="text-[#FFC72C]">*</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            required
          />
          <Button
            type="button"
            onClick={handleButtonClick}
            className="bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855] transition font-semibold"
          >
            Select File
          </Button>

          {formData.file && (
            <p className="text-sm text-[#002855] mt-2">
              Attached: {formData.file.name}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-[#002855] text-white hover:bg-[#FFC72C] hover:text-[#002855] transition font-semibold px-6 py-2 rounded-md"
        >
          Submit Upload
        </Button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full border-t-4 border-[#FFC72C]">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-[#002855] transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#002855]">
              Thank you for submitting
            </h2>
            <p className="text-gray-700">
              After approval, your work will be available in the{" "}
              <span className="font-semibold text-[#002855]">
                Instrument Consortium
              </span>
              .
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-[#002855] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#FFC72C] hover:text-[#002855] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
