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
    async jwt({ token, account, user }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },

    // Attach user info to session
    async session({ session }) {
      try {
        if (!session.user?.email) return session;

        const userRes = await fetch(
          `${process.env.BACKEND_USER_URL!}?email=${encodeURIComponent(
            session.user.email
          )}`
        );

        const userData = await userRes.json();

        if (userData.status === "valid") {
          session.user = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
          };
        }
      } catch (err) {
        console.error("session callback error:", err);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
