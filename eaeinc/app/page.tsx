"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  // This runs once on mount to load the Google script
  useEffect(() => {
    // Load Google script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Wait for script to load, then initialize the button
    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            "727241440215-4r616p6l5ag90hglqrkft5m9b6gs2p4v.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        // Render Google Sign-In button inside our div
        window.google.accounts.id.renderButton(
          document.getElementById("g_id_signin_div")!,
          {
            theme: "outline",
            size: "large",
            width: "300",
          }
        );
      }
    };
  }, []);

  // Parse JWT token
  const decodeToken = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  // Handle Google login response
  const handleCredentialResponse = (response: any) => {
    const id_token = response.credential;
    const payload = decodeToken(id_token);

    // Send token to your backend for verification
    fetch("http://localhost:5500/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        alert("Welcome, " + payload.name + "!");
        window.location.href = "/user"; // redirect after success
      })
      .catch((err) => console.error("Error sending token:", err));
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to the Merrimack College Community Research Page
        </h1>

        {/* Custom Merrimack Blue button */}
        <button
          onClick={() => {
            setLoading(true);
            const el = document.getElementById("g_id_signin_div");
            if (el) el.style.display = "block"; // show Google button
          }}
          disabled={loading}
          className="w-full bg-[#003767] hover:bg-[#004d9e] text-white font-semibold py-2 px-4 rounded-xl transition-all disabled:opacity-70 mb-4"
        >
          {loading ? "Loading Google Login..." : "Login with Google"}
        </button>

        {/* Hidden Google sign-in button placeholder */}
        <div id="g_id_signin_div" style={{ display: "none" }}></div>
      </div>
    </main>
  );
}

// Tell TypeScript that window.google exists
declare global {
  interface Window {
    google: any;
  }
}
