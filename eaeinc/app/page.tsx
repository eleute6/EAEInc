"use client";

import { useState, useEffect } from "react";
import UserPage from "@/app/components/homepage/UserPage"; // adjust path if needed

interface User {
  name: string;
  email: string;
  picture: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  function decodeJWT(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  const handleCredentialResponse = async (response: any) => {
    setLoading(true);
    try {
      const id_token = response.credential;
      const payload = decodeJWT(id_token);
      const email = payload.email;

      const authRes = await fetch("http://localhost:5500/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
      });
      const authData = await authRes.json();

      if (authData.status !== "valid") {
        alert("Login failed!");
        setLoading(false);
        return;
      }

      const userRes = await fetch(
        `http://localhost:5500/api/user?email=${encodeURIComponent(email)}`
      );
      const userData = await userRes.json();

      if (userData.status === "valid") {
        setUser({
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        });
      } else {
        alert("Could not load user data from database");
      }
    } catch (err) {
      console.error("Error during login/fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (loading) return <div>Loading...</div>;

  if (user) return <UserPage user={user} />;

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
