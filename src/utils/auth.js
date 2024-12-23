import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./connect";
import { getServerSession } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Optionally add custom data to the session
      session.user.id = user.id;
      return session;
    },
    async jwt({ token, user }) {
      // You can also customize the JWT here
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
