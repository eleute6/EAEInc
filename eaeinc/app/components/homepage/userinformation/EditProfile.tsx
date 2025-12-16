"use client";

import React, { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { ImageIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react"; // ✅ import useSession

interface EditProfileProps {
  user: {
    name: string;
    email: string;
    image: string;
    department?: string;
    bio?: string;
  };
  onClose: () => void;
  onUserUpdated: (updatedUser: EditProfileProps["user"]) => void;
}

export default function EditProfile({
  user,
  onClose,
  onUserUpdated,
}: EditProfileProps) {
  const [firstName, setFirstName] = useState(user.name.split(" ")[0]);
  const [lastName, setLastName] = useState(user.name.split(" ")[1] || "");
  const [department, setDepartment] = useState(user.department || "");
  const [bio, setBio] = useState(user.bio || "");
  const [preview, setPreview] = useState<string | null>(user.image || null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"success" | "error" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession(); // ✅ get update function

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const fData = new FormData();
    fData.append("name", `${firstName} ${lastName}`);
    fData.append("department", department);
    fData.append("email", user.email);
    fData.append("bio", bio);
    fData.append("picture", preview || "");

    const response = await fetch("/api/profile", {
      method: "PUT",
      body: fData,
    });

    if (!response.ok) {
      setPopupMessage("Profile update unsuccessful.");
      setPopupType("error");
      return;
    }

    // ✅ Refresh NextAuth session so department/bio persist after reload
    await update();

    const updatedUser = {
      ...user,
      name: `${firstName} ${lastName}`,
      image: preview || user.image,
      department,
      bio,
    };
    onUserUpdated(updatedUser);

    setPopupMessage("Profile updated successfully!");
    setPopupType("success");
  };

  return (
    <>
      {/* Header Bar */}
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
        {/* Avatar */}
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
          {/* First Name */}
          <label className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813]"
            required
          />

          {/* Last Name */}
          <label className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813]"
            required
          />

          {/* Department */}
          <label className="block text-sm font-medium text-gray-700">
            Department <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813]"
          />

          {/* Bio */}
          <label className="block text-sm font-medium text-gray-700">
            Bio <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio..."
            className="w-full border border-[#003768] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#FDB813] min-h-[80px]"
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
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg ${
              popupType === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <p className="font-semibold">{popupMessage}</p>
            <button
              onClick={() => {
                setPopupMessage(null);
                onClose();
              }}
              className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
