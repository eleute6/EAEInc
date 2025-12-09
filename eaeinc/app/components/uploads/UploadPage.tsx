"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    keywords: [] as string[],
    file: null as File | null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const preapprovedKeywords = [
    "Biology",
    "Chemistry",
    "Physics",
    "Engineering",
    "SocialScience",
    "DataScience",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeywordSelect = (keyword: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.keywords.includes(keyword);
      return {
        ...prev,
        keywords: alreadySelected
          ? prev.keywords.filter((k) => k !== keyword)
          : [...prev.keywords, keyword],
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For now, just show popup instead of backend
    setShowPopup(true);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      description: "",
      keywords: [],
      file: null,
    });
  };

  // Auto-close popup after 5 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Upload Research
      </h1>
      <p className="text-red-600 font-semibold">
        By choosing to upload to the Merrimack College Community Research Page
        you give permission for other users to view and download your work.
      </p>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
              required
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
              required
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
            required
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Brief Description <span className="text-red-500">*</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
            rows={4}
            required
          />
        </label>

        {/* Keyword Selector */}
        <div>
          <p className="font-semibold mb-2">
            Select Keywords <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {preapprovedKeywords.map((keyword) => (
              <button
                type="button"
                key={keyword}
                onClick={() => handleKeywordSelect(keyword)}
                className={`px-3 py-1 rounded-md border ${
                  formData.keywords.includes(keyword)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Upload File (PDF only) <span className="text-red-500">*</span>
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              required
            />
            <Button type="button" variant="default">
              <span>Select File</span>
            </Button>
          </label>

          {formData.file && (
            <p className="text-sm text-gray-600 mt-2">
              Attached:{" "}
              <a
                href={URL.createObjectURL(formData.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formData.file.name}
              </a>
            </p>
          )}
        </div>

        <Button type="submit" variant="default">
          Submit Upload
        </Button>
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Thank you for submitting</h2>
            <p className="text-gray-700">
              After approval, your work will be available in the instrument
              consortium.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
