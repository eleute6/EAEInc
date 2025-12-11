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
    async signIn({ user, account, profile }) {
      console.log("=== signIn callback triggered ===");
      console.log("User object:", user);
      console.log("Account object:", account);
      console.log("Profile object:", profile);

      try {
        if (user?.email) {
          console.log("Calling initialUserInfo with:", {
            name: user.name,
            email: user.email,
            image: user.image,
            admin: false,
          });

          await initialUserInfo(
            user.name || "Unknown User",
            user.email,
            user.image || "",
            false // set to true if you want to mark admins
          );

          console.log("initialUserInfo completed for:", user.email);
        } else {
          console.warn("signIn callback: user.email was missing");
        }
      } catch (err) {
        console.error("Error inserting user into UserInfo:", err);
      }
      return true;
    },

    // Store token in JWT
    async jwt({ token, account, user }) {
      console.log("=== jwt callback triggered ===");
      console.log("Incoming token:", token);
      console.log("Incoming account:", account);
      console.log("Incoming user:", user);

      if (account?.id_token) {
        token.idToken = account.id_token;
        console.log("Stored id_token in JWT");
      }
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          image: user.image,
        };
        console.log("Stored user info in JWT:", token.user);
      }
      return token;
    },

    // Attach user info to session
    async session({ session, token }) {
      console.log("=== session callback triggered ===");
      console.log("Incoming session:", session);
      console.log("Incoming token:", token);

      try {
        if (!session.user?.email) {
          console.warn("session callback: no email on session.user");
          return session;
        }

        console.log(
          "Fetching user info from BACKEND_USER_URL:",
          process.env.BACKEND_USER_URL
        );
        const userRes = await fetch(
          `${process.env.BACKEND_USER_URL!}?email=${encodeURIComponent(
            session.user.email
          )}`
        );

        console.log("Fetch status:", userRes.status);
        const userData = await userRes.json();
        console.log("User data received from API:", userData);

        if (userData.status === "valid") {
          session.user = {
            name: userData.name,
            email: userData.email,
            image: userData.image,
          };
          console.log("Updated session.user with DB values:", session.user);
        } else {
          console.warn("session callback: userData not valid:", userData);
        }
      } catch (err) {
        console.error("session callback error:", err);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
