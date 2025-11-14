"use client";

import { useState, useEffect } from "react";

export default function Home2() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* Load Google Sign-In */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id:
          "727241440215-4r616p6l5ag90hglqrkft5m9b6gs2p4v.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google?.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large" }
      );
    };
    document.body.appendChild(script);
  }, []);

  function tRetrieve(token: string) {
    let baseURL = token.split(".")[1];
    let modURL = baseURL.replace(/-/g, "+").replace(/_/g, "/");
    let json = decodeURIComponent(
      atob(modURL)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  }

  const handleCredentialResponse = (response: any) => {
    const id_token = response.credential;
    const payload = tRetrieve(id_token);

    fetch("http://localhost:5500/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        alert("Server response: " + JSON.stringify(data));
      })
      .catch((err) => console.error("Error sending token:", err));
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to the Merrimack College Community Research Page
        </h1>
        <div id="googleSignIn"></div>
      </div>
    </main>
  );
}
