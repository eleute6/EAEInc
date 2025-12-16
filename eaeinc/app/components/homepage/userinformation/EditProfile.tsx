"use client";

import React, { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { ImageIcon, XIcon } from "lucide-react";

interface EditProfileProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  onClose: () => void;
}

export default function EditProfile({ user, onClose }: EditProfileProps) {
  const [firstName, setFirstName] = useState(user.name.split(" ")[0]);
  const [lastName, setLastName] = useState(user.name.split(" ")[1] || "");
  const [department, setDepartment] = useState("");
  const [preview, setPreview] = useState<string | null>(user.image || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const body = { firstName, lastName, department, picture: preview };

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) return alert("Failed to update profile.");

    alert("Profile updated!");
    onClose();
  };

  return (
    <>
      {/* Header Bar with Close X */}
      <div className="bg-[#003768] text-white px-4 py-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">Edit Profile</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-[#FDB813] transition"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-6 p-6 bg-white">
        {/* Centered profile picture */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-24 h-24">
            {preview ? (
              <AvatarImage src={preview} />
            ) : (
              <AvatarFallback className="bg-[#003768] text-white font-bold">
                {firstName[0]}
                {lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <Button
            type="button"
            className="bg-[#003768] text-white hover:bg-[#FDB813] hover:text-[#003768]"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={16} /> Change Picture
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813]"
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813]"
            required
          />

          <label className="block text-sm font-medium text-gray-700">
            Department <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#FDB813]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#003768] text-white hover:bg-[#FDB813] hover:text-[#003768]"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
