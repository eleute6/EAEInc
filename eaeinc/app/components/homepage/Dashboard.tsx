"use client";

import React, { useState, useEffect } from "react";
import PostForum, { Post } from "./PostForum";
import UserInformation from "./userinformation/UserInformation";
import { fetchPosts } from "../../serverfuns";

export default function Dashboard({
  user,
}: {
  user: { name: string; email: string; picture: string };
}) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function loadPosts() {
      const newPosts = await fetchPosts(user.email);
      setPosts(newPosts);
    }
    loadPosts();
  }, [user]);

  // Callback to add a new post instantly
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="flex gap-6">
      {/* Left side: user profile */}
      <UserInformation user={user} onPostCreated={handlePostCreated} />

      {/* Right side: forum */}
      <PostForum user={user} posts={posts} setPosts={setPosts} />
    </div>
  );
}
