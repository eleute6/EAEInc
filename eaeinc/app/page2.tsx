"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

export default function Home() {
  //Uses Google's One-Tap
  useEffect(() => {
    //Waits for Google
    const interval = setInterval(() => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        clearInterval(interval);
        //Initializes the Auth...
        window.google.accounts.id.initialize({
          client_id:
            "727241440215-4r616p6l5ag90hglqrkft5m9b6gs2p4v.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        //... then loads in the button.
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin")!,
          { theme: "outline", size: "large" }
        );
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCredentialResponse = (response: any) => {
    // STEP 1: GENERATE ID TOKEN
    const idToken = response.credential;
    console.log("ID Token:", idToken);

    // STEP 2 : SEND ID TOKEN TO SERVER
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        //STEP 3 : REDIRECT USER
        if (data.status === "valid") {
          window.location.href = "eaeinc/app/dash.html";
        } else {
          alert("LOGIN FAILED: " + JSON.stringify(data));
        }
      })
      .catch((err) => console.error("ERROR SENDING TOKEN:", err));
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to the Merrimack College Community Research Page
        </h1>
        <div id="google-signin"></div>
      </div>
    </main>
  );
}
