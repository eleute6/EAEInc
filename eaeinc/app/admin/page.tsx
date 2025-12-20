"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import AdminPage from "../components/admin/AdminPage";

interface User {
  name: string;
  email: string;
  image: string;
  isAdmin: boolean;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/current-user");
      if (res.ok) {
        const data = await res.json();
        setUser({
          name: data.name,
          email: data.email,
          image: data.image,
          isAdmin: data.isAdmin ?? false,
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      {user && (
        <Header
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
          }}
        />
      )}

      <main className="mt-[120px] px-6">
        <AdminPage />
      </main>
    </>
  );
}
