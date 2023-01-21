import { DefaultSession, DefaultUser } from "next-auth";

interface IToken {
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface IUser extends DefaultUser {
  avatar?: string | null;
  token?: IToken | null;
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IToken {}
}
