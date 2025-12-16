// app/components/ClientLayout.tsx
"use client";

import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <>
      {session?.user && (
        <Header
          user={{
            name: session.user.name!,
            email: session.user.email!,
            image: session.user.image!,
          }}
        />
      )}
      {children}
    </>
  );
}
