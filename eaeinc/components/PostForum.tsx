"use client";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";

interface Post {
  id: number;
  text: string;
  image?: string | null;
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

function PostForum() {
  const user = { firstName: "Alice", lastName: "Brown", imageUrl: "" };
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postsEndRef = useRef<HTMLDivElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const handlePostAction = (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset();

    const text = formDataCopy.get("postInput") as string;

    if (!text.trim()) {
      throw new Error("You must provide a post input");
    }
    setPreview(null);

    try {
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log("Error creating a post");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Scroll posts container to bottom whenever posts change
  useEffect(() => {
    if (posts.length === 0) return;
    const container = postsEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [posts]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Post Form - stays fixed at the top */}
      <div className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 mb-4">
        <form
          ref={ref}
          action={(formData) => {
            //Handle form submission
            handlePostAction(formData);

            //Toast notifications
          }}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              {user.imageUrl ? (
                <AvatarImage src={user.imageUrl} />
              ) : (
                <AvatarFallback className="flex items-center justify-center bg-blue-500 text-white font-bold w-full h-full rounded-full">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
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

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="mr-2" size={16} />{" "}
              {preview ? "Change" : "Add"} image
            </Button>

            {preview && (
              <Button
                variant="outline"
                type="button"
                onClick={handleRemoveImage}
              >
                <XIcon className="mr-2" size={16} /> Remove image
              </Button>
            )}

            <Button type="submit" className="ml-2">
              Post
            </Button>
          </div>
        </form>
      </div>
      <hr className="mt-2 border-gray-300" />
      {/* Scrollable Posts Section */}
    </div>
  );
}

export default PostForum;
