"use client";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import React, { useRef, useState } from "react";
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
  // Dummy user data for now
  const user = {
    firstName: "Alice",
    lastName: "Brown",
    imageUrl: "", // leave empty to use fallback
  };

  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // Handle text + image post submission
  const handlePostAction = (formData: FormData) => {
    const text = (formData.get("postInput") as string)?.trim();
    if (!text) return alert("Post input required");

    const newPost: Post = {
      id: Date.now(),
      text,
      image: preview,
      user,
    };

    // Add post to array
    setPosts((prev) => [newPost, ...prev]);

    // Reset form + clear preview
    ref.current?.reset();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle image uploads
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { firstName, lastName, imageUrl } = user;

  return (
    <div className="space-y-6">
      {/* Create Post Form */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            handlePostAction(new FormData(ref.current!));
          }}
          className="flex flex-col space-y-3"
        >
          {/* Avatar + Input */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              {imageUrl ? (
                <AvatarImage src={imageUrl} />
              ) : (
                <AvatarFallback className="flex items-center justify-center bg-blue-500 text-white font-bold w-full h-full rounded-full">
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
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

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          {/* Image Preview */}
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="mr-2" size={16} color="currentColor" />
              {preview ? "Change" : "Add"} image
            </Button>

            {preview && (
              <Button
                variant="outline"
                type="button"
                onClick={handleRemoveImage}
              >
                <XIcon className="mr-2" size={16} color="currentColor" />
                Remove image
              </Button>
            )}

            <Button type="submit" className="ml-2">
              Post
            </Button>
          </div>
        </form>
      </div>

      <hr className="border-gray-300" />

      {/* Render Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="w-10 h-10">
                {post.user.imageUrl ? (
                  <AvatarImage src={post.user.imageUrl} />
                ) : (
                  <AvatarFallback className="flex items-center justify-center bg-blue-500 text-white font-bold w-full h-full rounded-full">
                    {post.user.firstName.charAt(0)}
                    {post.user.lastName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="font-semibold">
                {post.user.firstName} {post.user.lastName}
              </p>
            </div>
            <p className="text-gray-800 mb-2">{post.text}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post image"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostForum;
