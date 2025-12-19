import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { initialUserInfo } from "@/app/serverfuns";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
      httpOptions: { timeout: 40000 },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ Create user in DB on first login
    async signIn({ user }) {
      try {
        if (user?.email) {
          await initialUserInfo(
            user.name || "Unknown User",
            user.email,
            user.image || "",
            false // default: not admin
          );
        }
      } catch (err) {}
      return true;
    },

    // ✅ Build JWT token
    async jwt({ token, user }) {
      // ✅ Guarantee token.user always exists
      if (!token.user) {
        token.user = {
          name: null,
          email: null,
          image: null,
          department: null,
          bio: null,
          isAdmin: false,
        };
      }

      // ✅ Copy Google profile fields on first login
      if (user) {
        token.user.name = user.name;
        token.user.email = user.email;
        token.user.image = user.image;
      }

      // ✅ If no email, stop here
      if (!token.user.email) return token;

      // ✅ Fetch full user info from your backend
      try {
        const res = await fetch(
          `${process.env.BACKEND_USER_URL!}?email=${encodeURIComponent(
            token.user.email
          )}`
        );
        const userData = await res.json();

        if (userData.status === "valid") {
          token.user = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
            department: userData.department ?? null,
            bio: userData.bio ?? null,
            isAdmin: userData.isAdmin ?? false,
          };
        }
      } catch (err) {}

      return token;
    },

    // ✅ Build session object
    async session({ session, token }) {
      if (!token.user?.email) return session;

      try {
        const res = await fetch(
          `${process.env.BACKEND_USER_URL!}?email=${encodeURIComponent(
            token.user.email
          )}`
        );
        const userData = await res.json();

        if (userData.status === "valid") {
          const fullUser = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
            department: userData.department ?? null,
            bio: userData.bio ?? null,
            isAdmin: userData.isAdmin ?? false,
          };

          token.user = fullUser;
          session.user = fullUser as any;
        }
      } catch (err) {}

      return session;
    },
  },
});

export { handler as GET, handler as POST };
