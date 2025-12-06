import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: { params: { prompt: "select_account" } },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        // CALLBACK FROM SIGN-IN TO VERIFY
        async signIn({ account }) {
          try {
            const idToken = account?.id_token;
            if (!idToken) return false;

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch(process.env.BACKEND_URL!, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
              signal: controller.signal,
            }).catch(err => {
              console.error("Fetch to BACKEND_URL failed:", err);
              return null;
            });

            clearTimeout(timeout);

            if (!response) return false;

            const data = await response.json().catch(() => {
              console.error("Invalid JSON from backend");
              return null;
            });

            if (!data) return false;

            return data.status === "valid";
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
        //CALLBACK TO STORE TOKEN IN SESSION
        async jwt({ token, account }) {
            if (account?.id_token) {
                token.idToken = account.id_token;
            }
            return token;
        },

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