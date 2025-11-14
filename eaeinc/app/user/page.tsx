"use client";

import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  picture: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  // Get email from query string
  const email = new URLSearchParams(window.location.search).get("email");

  useEffect(() => {
    if (!email) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5500/api/user?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (data.status === "valid") {
          setUser({
            name: data.name,
            email: data.email,
            picture: data.picture,
          });
        } else {
          console.error("User not found or invalid status", data);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUser();
  }, [email]);

  if (!user) return <div>Loading user info...</div>;

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
