import { DefaultSession, DefaultUser } from "next-auth";

interface IToken {
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiry?: number | null;
  error: "RefreshAccessTokenError" | null;
}

interface IUser extends DefaultUser {
  avatar?: string | null;
  accessToken?: IToken["accessToken"];
  refreshToken?: IToken["refreshToken"];
  accessTokenExpiry?: IToken["accessTokenExpiry"];
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
    error?: "RefreshAccessTokenError" | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IToken {}
}
