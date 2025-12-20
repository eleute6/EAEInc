// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      department?: string | null;
      bio?: string | null;
      isAdmin: boolean;
    };
    expires: string;
  }

  interface User extends DefaultUser {
    department?: string | null;
    bio?: string | null;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      department?: string | null;
      bio?: string | null;
      isAdmin: boolean;
    };
  }
}
