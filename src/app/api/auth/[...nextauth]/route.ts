import { createUser, getUserByProvider } from "@/controllers/users";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt(props) {
      // Persist the OAuth access_token to the token right after signin
      if (props.account) {
        const user = await getUserByProvider(
          props.account.provider,
          props.account.providerAccountId,
        );

        if (user.length == 0) {
          const name = props.user.name?.split(" ")[0];
          if (!name || !props.user.email) throw new Error();

          const newUserId = await createUser(
            name,
            props.user.email,
            props.account.provider,
            props.account.providerAccountId,
          );
          if (newUserId) {
            props.token.id = newUserId;
          } else {
            throw new Error();
          }
        } else {
          props.token.id = user.id;
        }
      }

      return props.token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
