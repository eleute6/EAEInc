"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import React, { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { Post } from "../PostForum";
import { sendPost } from "../../../serverfuns"; // import same helper used in forum

interface PostCreatorProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onClose: () => void;
  onPostCreated?: (newPost: Post) => void;
}

export default function PostCreator({
  user,
  onClose,
  onPostCreated,
}: PostCreatorProps) {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const firstName = user.name.split(" ")[0];
  const lastName = user.name.split(" ")[1] || "";
  const email = user.email;
  const userObj = { firstName, lastName, imageUrl: user.picture, email };

  const handlePostAction = async (formData: FormData) => {
    const text = (formData.get("postInput") as string)?.trim();
    if (!text) return alert("Post input required");

    let filename: string | null = null;
    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });
      if (res.ok) {
        const data = await res.json();
        filename = data.filename;
      } else {
        return alert("Image upload failed");
      }
    }

    const newPost: Post = {
      id: Date.now(),
      text,
      image: filename,
      user: userObj,
      likes: 0,
      likedByUser: false,
      comments: [],
    };

    const inserted = await sendPost(newPost);
    if (inserted) {
      if (onPostCreated) {
        onPostCreated(inserted); // notify parent (e.g. PostForum) to update state
      }
    }

    // reset form
    ref.current?.reset();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Header Bar with Close X */}
      <div className="bg-[#003768] text-white px-4 py-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">Create Post</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-[#FDB813] transition"
          aria-label="Close"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          handlePostAction(new FormData(ref.current!));
        }}
        className="flex flex-col space-y-3 p-4 bg-white"
      >
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            {userObj.imageUrl ? (
              <AvatarImage src={userObj.imageUrl} />
            ) : (
              <AvatarFallback className="bg-[#003768] text-white font-bold">
                {userObj.firstName[0]}
                {userObj.lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border border-[#003768] focus:ring-2 focus:ring-[#FDB813] shadow-sm"
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
            className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
          />
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            className="bg-[#003768] text-white hover:bg-[#FDB813] hover:text-[#003768]"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={16} /> {preview ? "Change" : "Add"} Image
          </Button>

          {preview && (
            <Button
              variant="outline"
              type="button"
              className="border-[#003768] text-[#003768] hover:bg-[#FDB813] hover:text-white"
              onClick={handleRemoveImage}
            >
              <XIcon size={16} /> Remove
            </Button>
          )}

          <Button
            type="submit"
            className="bg-[#003768] text-white hover:bg-[#FDB813] hover:text-[#003768]"
          >
            Post
          </Button>
          <Button
            variant="ghost"
            type="button"
            className="text-gray-600 hover:text-[#FDB813]"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
