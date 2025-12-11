"use client";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { sendPost, fetchPosts } from "../../serverfuns";

export interface Post {
  id: number;
  text: string;
  image?: string | null;
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    email: string;
  };
}

interface PostForumProps {
  user: { name: string; email: string; picture: string };
}

// Adjust this to match your navbar height (e.g. 64px if h-16)
const NAV_HEIGHT_PX = 64;

export default function PostForum({ user }: PostForumProps) {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const firstName = user.name.split(" ")[0];
  const lastName = user.name.split(" ")[1] || "";
  const email = user.email;
  const userObj = { firstName, lastName, imageUrl: user.picture, email };

  useEffect(() => {
    async function loadPosts() {
      const newPosts: Post[] = await fetchPosts();
      setPosts(newPosts);
    }
    loadPosts();
  }, []);

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
    };

    const inserted = await sendPost(newPost);
    if (inserted) {
      setPosts((prev) => [inserted, ...prev]);
    }

    ref.current?.reset();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div
      className="bg-gray-50"
      style={{
        height: `calc(100vh - ${NAV_HEIGHT_PX}px)`,
        overflowY: "auto",
      }}
    >
      <div className="max-w-2xl mx-auto px-6 space-y-4 pb-24">
        {/* Create Post box */}
        <div className="bg-white p-4 rounded-lg shadow-md">
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
                  <AvatarFallback className="bg-[#003768] text-white font-bold">
                    {userObj.firstName[0]} {userObj.lastName[0]}
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
            </div>
          </form>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-[#003768]/20"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="w-10 h-10">
                {post.user.imageUrl ? (
                  <AvatarImage src={post.user.imageUrl} />
                ) : (
                  <AvatarFallback className="bg-[#003768] text-white font-bold">
                    {post.user.firstName[0]} {post.user.lastName[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="font-semibold text-[#003768]">
                {post.user.firstName} {post.user.lastName}
              </p>
            </div>
            <p className="text-gray-800 mb-2">{post.text}</p>
            {post.image && (
              <img
                src={`/uploads/${post.image}`}
                className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
