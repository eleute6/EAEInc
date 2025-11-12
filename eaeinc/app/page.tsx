"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Redirect to your OAuth login route
      // Replace "/api/auth/login" with actual OAuth endpoint
      window.location.href = "/api/auth/login";
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to the Merrimack College Community Research Page
        </h1>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#003767] hover:bg-[#004d9e] text-white font-semibold py-2 px-4 rounded-xl transition-all disabled:opacity-70"
        >
          {loading ? "Redirecting..." : "Login"}
        </button>
      </div>
    </main>
  );
}
