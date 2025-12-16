import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { initialUserInfo } from "@/app/serverfuns"; // adjust path if needed

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // When a user signs in, insert them into UserInfo if not already there
    async signIn({ user }) {
      try {
        if (user?.email) {
          await initialUserInfo(
            user.name || "Unknown User",
            user.email,
            user.image || "",
            false // set to true if you want to mark admins
          );
        }
      } catch (err) {
        console.error("Error inserting user into UserInfo:", err);
      }
      return true;
    },

    // Store token in JWT
    async jwt({ token, user }) {
      if (!token.user) {
        token.user = {}; // initialize so it's never undefined
      }

      if (user) {
        token.user.name = user.name;
        token.user.email = user.email;
        token.user.image = user.image;
      }

      // fetch department/bio if needed
      if (!token.user?.email) {
        return token; // bail out if email is missing
      }

      if (!token.user.department || !token.user.bio) {
        try {
          const res = await fetch(
            `${process.env.BACKEND_USER_URL!}?email=${encodeURIComponent(
              token.user.email
            )}`
          );
          const userData = await res.json();
          if (userData.status === "valid") {
            token.user.department = userData.department ?? null;
            token.user.bio = userData.bio ?? null;
          }
        } catch (err) {
          console.error("jwt callback fetch error:", err);
        }
      }

      return token;
    },

    // Attach user info to session
    async session({ session, token }) {
      const email = token.user?.email;
      if (!email) {
        return session; // bail out safely
      }

      try {
        const res = await fetch(
          `${process.env.BACKEND_USER_URL!}?email=${encodeURIComponent(email)}`
        );
        const userData = await res.json();

        if (userData.status === "valid") {
          token.user = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
            department: userData.department,
            bio: userData.bio,
          };
          session.user = token.user as any;
        }
      } catch (err) {
        console.error("session callback error:", err);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
