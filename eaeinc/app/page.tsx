"use client";

import { useState, useEffect } from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import UserPage from "@/components/UserPage"; // make sure the path is correct

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
    const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  // When logged in -> show UserPage
  if (session?.user) {
    return (
      <UserPage
        user={{
          name: session.user.name!,
          email: session.user.email!,
          picture: session.user.image!,
        }}
      />
    );
  }

  // Not logged in -> show login page
  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Welcome to the Merrimack College Community Research Page
        </h1>

        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
