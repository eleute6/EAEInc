"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImageIcon, XIcon } from "lucide-react";

interface PostCreatorProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onClose: () => void;
}

export default function PostCreator({ user, onClose }: PostCreatorProps) {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const firstName = user.name.split(" ")[0];
  const lastName = user.name.split(" ")[1] || "";
  const userObj = { firstName, lastName, imageUrl: user.picture };

  const handlePostAction = async (formData: FormData) => {
    const text = (formData.get("postInput") as string)?.trim();
    if (!text) return alert("Post input required");

    const body: {
      text: string;
      firstName: string;
      lastName: string;
      imageUrl: string;
      image?: string;
    } = {
      text,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      imageUrl: userObj.imageUrl,
    };

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const base64 = await fileToBase64(file);
      body.image = base64;
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return alert("Failed to create post.");
    }

    ref.current?.reset();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose(); // close modal after posting
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Create Post
      </h2>

      {/* Form */}
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          handlePostAction(new FormData(ref.current!));
        }}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            {userObj.imageUrl ? (
              <AvatarImage src={userObj.imageUrl} />
            ) : (
              <AvatarFallback>
                {userObj.firstName[0]}
                {userObj.lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border bg-white shadow-sm"
          />
        </div>

        {/* Image input + preview */}
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            className="w-full max-h-64 object-cover rounded-lg"
          />
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={16} /> {preview ? "Change" : "Add"} image
          </Button>

          {preview && (
            <Button variant="outline" type="button" onClick={handleRemoveImage}>
              <XIcon size={16} /> Remove
            </Button>
          )}

          <Button type="submit">Post</Button>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
