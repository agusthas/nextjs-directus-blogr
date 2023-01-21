import { loginUser } from "@/modules/auth/api";
import { LoginUserSchema } from "@/modules/auth/schema";
import { getMe } from "@/modules/users/api";
import { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options: NextAuthOptions = {
  secret: "SUPER_SECRET_JWT_SECRET", // TODO: Replace with env variable
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        const payload = LoginUserSchema.safeParse(credentials);
        if (!payload.success) {
          throw new Error("Zod validation failed");
        }

        const res = await loginUser(payload.data);
        if (!res) {
          return null;
        }

        // Get the current user with the access token
        const user = await getMe(res.access_token);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          image: user.avatar,
          token: {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
          },
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.token) {
        token.email = user.email;
        token.accessToken = user.token.accessToken;
        token.refreshToken = user.token.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || session.user.id;
        session.user.email = token.email;
        session.user.avatar = token.picture;
        session.user.token = {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default function Auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, options);
}
