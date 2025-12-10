"use client";

import React, { useState, useEffect } from "react";
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
  });

  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");

  //Keywords
  const preapprovedKeywords = [
    "AI",
    "Allowable Costs",
    "Auditing",
    "Award",
    "Budget",
    "Budget Justification",
    "Budget Narrative",
    "Career Development Award",
    "Cayuse",
    "CITI",
    "Clinical Trial",
    "Collaborative Research Agreement",
    "Compliance",
    "Conflict of Interest",
    "Consultant",
    "Cost Transfer",
    "Data & Safety Monitoring Board (DSMB)",
    "Data Management & Sharing Plan (DMSP)",
    "Data Safety & Monitoring Plan (DSMP)",
    "Data Transfer & Use Agreement (DTUA)",
    "Department of Defense",
    "Department of Education",
    "Department of Energy",
    "Department of Health & Human Services",
    "Department of Justice",
    "Direct Cost",
    "Environmental Protection Agency (EPA)",
    "Environmental Health & Safety",
    "Equipment",
    "ERA Commons",
    "Export Controls",
    "Facilities",
    "Facilities & Administration Cost (F&A)",
    "FDA",
    "Federal Grant",
    "FERPA",
    "Fiscal Year (FY)",
    "Foundation Grant",
    "Fringe Benefits",
    "Gift Cards",
    "Grant Officer",
    "Grants.gov",
    "Human Subjects",
    "Indemnification",
    "iEDISON",
    "In-Kind Cost Share",
    "Indirect Cost",
    "Institutional Base Salary",
    "Institutional Biosafety Committee (IBC)",
    "Institutional Review Board (IRB)",
    "Intellectual Property (IP)",
    "Internal Revenue Code",
    "Just-In-Time (JIT)",
    "K Award",
    "Letter of Intent",
    "Mandatory Cost Sharing",
    "Material Transfer & Usa Agreement (MTUA)",
    "Modifications",
    "National Institute of Health (NIH)",
    "National Science Foundation (NSF)",
    "Non-Disclosure Agreement (NDA)",
    "P Grants",
    "Patent",
    "Percent Effort",
    "Post-Award",
    "Pre-Award",
    "Procurement",
    "Project Period",
    "Proposal Development",
    "Proposal Routing Form",
    "Qualtrics",
    "R01",
    "R03",
    "R13",
    "R15",
    "R21",
    "REDCap",
    "Research Misconduct",
    "SBIR",
    "Small Business Technology Transfer (STTR)",
    "Sponsored Research Agreement (SRA)",
    "Stipend",
    "Study Closure",
    "Subagreement",
    "Subcontract",
    "Subrecipient",
    "Survey",
    "System for Award Management (SAM)",
    "USDA",
    "Waiver of Liability",
  ];

  const filteredKeywords =
    query === ""
      ? preapprovedKeywords
      : preapprovedKeywords.filter((kw) =>
          kw.toLowerCase().includes(query.toLowerCase())
        );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      description: "",
      keywords: [],
      file: null,
    });
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Upload Research
      </h1>
      <p className="text-red-600 font-semibold">
        By choosing to upload to the Merrimack College Community Research Page
        you give permission for other users to view and download your work.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First/Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
              required
            />
          </label>
        </div>

        {/* Email */}
        <label className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
            required
          />
        </label>

        {/* Description */}
        <label className="block text-sm font-medium text-gray-700">
          Brief Description <span className="text-red-500">*</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm"
            rows={4}
            required
          />
        </label>

        {/* Keyword Dropdown */}
        <div>
          <p className="font-semibold mb-2">
            Select Keywords <span className="text-red-500">*</span>
          </p>
          <Combobox
            value={formData.keywords}
            onChange={(selected) => {
              // enforce max of 5
              if (selected.length <= 5) {
                setFormData((prev) => ({ ...prev, keywords: selected }));
              }
            }}
            multiple
          >
            <div className="relative">
              <Combobox.Input
                className="w-full border rounded-md px-4 py-2 shadow-sm"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(keywords: string[]) => keywords.join(", ")}
                placeholder="Search or select up to 5 keywords..."
                required
              />
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg z-10">
                {filteredKeywords.length === 0 && (
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
                          ? "bg-blue-600 text-white"
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
          {formData.keywords.length >= 5 && (
            <p className="text-xs text-red-500 mt-1">
              You can select a maximum of 5 keywords.
            </p>
          )}
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
