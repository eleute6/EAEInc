"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import UploadPage from "../components/uploads/UploadPage";

interface User {
  name: string;
  email: string;
  image: string;
}

export default function UploadsPage() {
  const [user, setUser] = useState<User | null>(null);

  // Example: fetch user from your backend or reuse auth logic
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/current-user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Header user={user} />
      <main className="mt-[120px] px-6">
        <UploadPage />
      </main>
    </>
  );
}
