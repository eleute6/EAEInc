"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    keywords: [] as string[],
    file: null as File | null,
  });

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

    const body = new FormData();
    body.append("firstName", formData.firstName);
    body.append("lastName", formData.lastName);
    body.append("email", formData.email);
    body.append("description", formData.description);
    body.append("keywords", JSON.stringify(formData.keywords));
    if (formData.file) body.append("file", formData.file);

    const res = await fetch("/api/upload-research", {
      method: "POST",
      body,
    });

    if (res.ok) {
      alert("Upload successful!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        description: "",
        keywords: [],
        file: null,
      });
    } else {
      alert("Upload failed. Please try again.");
    }
  };

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
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 shadow-sm"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border rounded-md px-4 py-2 shadow-sm"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2 shadow-sm"
          required
        />

        <textarea
          name="description"
          placeholder="Brief description of your upload"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-2 shadow-sm"
          rows={4}
          required
        />

        {/* Keyword Selector */}
        <div>
          <p className="font-semibold mb-2">Select Keywords:</p>
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
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="w-full"
            required
          />
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
    </div>
  );
}
