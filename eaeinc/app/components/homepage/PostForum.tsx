"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ImageIcon, XIcon } from "lucide-react";

export interface Post {
  id: number;
  text: string;
  image?: string | null;
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    //NEW: email field added to user object.
    email: string;
  };
}

interface PostForumProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
}

export default function PostForum({ user }: PostForumProps) {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postsEndRef = useRef<HTMLDivElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const firstName = user.name.split(" ")[0];
  const lastName = user.name.split(" ")[1] || "";
  // NEW: Need to retrieve email from user.
  const email = user.email;
  const userObj = { firstName, lastName, imageUrl: user.picture, email };

  // Load posts from backend on load
  useEffect(() => {
    fetch("/api/posts") // <-- changed from localhost:5500
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  const handlePostAction = async (formData: FormData) => {
    const text = (formData.get("postInput") as string)?.trim();
    if (!text) return alert("Post input required");

    // Optional image included
    const body: {
      text: string;
      firstName: string;
      lastName: string;
      imageUrl: string;
      image?: string; // <-- optional
    } = {
      text,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      imageUrl: userObj.imageUrl,
    };

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const base64 = await fileToBase64(file);
      body.image = base64; // only added if image exists
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return alert("Failed to create post.");
    }

    const newPost = await response.json();
    setPosts((prev) => [...prev, newPost]);

    ref.current?.reset();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to convert file to base64
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

  useEffect(() => {
    if (posts.length === 0) return;
    const container = postsEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [posts]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Post Form */}
      <div className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 mb-4">
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

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={16} /> {preview ? "Change" : "Add"} image
            </Button>

            {preview && (
              <Button
                variant="outline"
                type="button"
                onClick={handleRemoveImage}
              >
                <XIcon size={16} /> Remove
              </Button>
            )}

            <Button type="submit">Post</Button>
          </div>
        </form>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-2">
        <div className="flex flex-col space-y-4">
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
                    <AvatarFallback>
                      {post.user.firstName[0]}
                      {post.user.lastName[0]}
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
                  src={`http://localhost:5500/uploads/${post.image}`}
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
          <div ref={postsEndRef}></div>
        </div>
      </div>
    </div>
  );
}
