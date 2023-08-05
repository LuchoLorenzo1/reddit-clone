import pool from "@/database/db";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import NextAuth, { NextAuthOptions, User } from "next-auth";
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
        const res: [RowDataPacket[], FieldPacket[]] = await pool.query(
          "SELECT * FROM users WHERE provider LIKE ? AND provider_id LIKE ?",
          [props.account?.provider, props.account?.providerAccountId],
        );

        const [rows] = res;
        if (rows.length == 0) {
          const res2: [ResultSetHeader, FieldPacket[]] = await pool.query(
            "INSERT INTO users (name, email, provider, provider_id) VALUES (?, ?, ?, ?)",
            [
              props.user.name,
              props.user.email,
              props.account?.provider,
              props.account?.providerAccountId,
            ],
          );
          const [resHeader] = res2;
          props.token.id = resHeader.insertId;
        } else {
          props.token.id = rows[0].id;
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
