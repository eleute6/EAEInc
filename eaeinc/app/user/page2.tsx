"use client";

import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  picture: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined") {
      console.log("Loading user info from localStorage");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Failed to parse user info:", err);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-600 text-lg">Loading user info...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-red-600 text-lg">
          No user info found. Please log in again.
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <img
          src={user.picture}
          alt="User"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-700 mb-2">{user.email}</p>
        <p className="text-gray-600">You have successfully logged in!</p>
      </div>
    </main>
  );
}