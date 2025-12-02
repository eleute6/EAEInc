"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ImageIcon } from "lucide-react";

interface EditProfileProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onClose: () => void;
}

export default function EditProfile({ user, onClose }: EditProfileProps) {
  const [firstName, setFirstName] = useState(user.name.split(" ")[0]);
  const [lastName, setLastName] = useState(user.name.split(" ")[1] || "");
  const [department, setDepartment] = useState("");
  const [preview, setPreview] = useState<string | null>(user.picture || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const body = {
      firstName,
      lastName,
      department,
      picture: preview,
    };

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return alert("Failed to update profile.");
    }

    alert("Profile updated!");
    onClose();
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Edit Profile
      </h2>

      {/* Centered profile picture */}
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="w-24 h-24">
          {preview ? (
            <AvatarImage src={preview} />
          ) : (
            <AvatarFallback>
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          )}
        </Avatar>

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon size={16} /> Change picture
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
          className="w-full border rounded-md px-3 py-2"
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
          className="w-full border rounded-md px-3 py-2"
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
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
