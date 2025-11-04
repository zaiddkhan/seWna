import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      provider?: string;
      accessToken?: string;
      profile?: any;
    } & DefaultSession["user"];
  }

  interface User {
    provider?: string;
    accessToken?: string;
    profile?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    profile?: any;
  }
}
