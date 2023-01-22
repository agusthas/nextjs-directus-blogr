import { loginUser, refreshAccessToken } from "@/modules/auth/api";
import { LoginUserSchema } from "@/modules/auth/schema";
import { getMe } from "@/modules/users/api";
import { formatDate, formatDateTime } from "@/utils/date";
import { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

async function handleRefreshToken(jwtToken: JWT): Promise<JWT> {
  try {
    if (!jwtToken.refreshToken) {
      throw new Error("No refresh token");
    }

    const res = await refreshAccessToken(jwtToken.refreshToken);
    if (!res) {
      throw new Error("No response");
    }

    return {
      ...jwtToken,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      accessTokenExpiry: Date.now() + res.expires!,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      ...jwtToken,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
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
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
          accessTokenExpiry: Date.now() + res.expires!,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiry = user.accessTokenExpiry;
      }

      if (
        token &&
        token.accessTokenExpiry &&
        Date.now() < token.accessTokenExpiry
      ) {
        const now = formatDateTime(new Date().toISOString());
        const expiredAt = formatDateTime(
          new Date(token.accessTokenExpiry).toISOString()
        );
        console.log(
          `AccessToken is still valid until ${expiredAt} (issed at: ${now})`
        );

        return token;
      }

      return handleRefreshToken(token);
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || session.user.id;
        session.user.email = token.email;
        session.user.avatar = token.picture;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.accessTokenExpiry = token.accessTokenExpiry;
        if (token.error) {
          session.error = token.error;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default function Auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}
