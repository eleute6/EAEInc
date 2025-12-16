"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import AdminPage from "../components/admin/AdminPage"; // adjust path to where you saved AdminPage

interface User {
  name: string;
  email: string;
  image: string;
  // isAdmin?: boolean  <-- you can add this back later
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);

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
        <AdminPage />
      </main>
    </>
  );
}
