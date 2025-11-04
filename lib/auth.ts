import NextAuth from "next-auth";

// Custom Dribbble Provider
const DribbbleProvider = {
  id: "dribbble",
  name: "Dribbble",
  type: "oauth" as const,
  authorization: {
    url: "https://dribbble.com/oauth/authorize",
    params: { scope: "public" },
  },
  token: "https://dribbble.com/oauth/token",
  userinfo: "https://api.dribbble.com/v2/user",
  profile(profile: any) {
    return {
      id: profile.id.toString(),
      name: profile.name,
      email: profile.email,
      image: profile.avatar_url,
      username: profile.login,
      bio: profile.bio,
      location: profile.location,
      profileUrl: profile.html_url,
    };
  },
  clientId: process.env.DRIBBBLE_CLIENT_ID,
  clientSecret: process.env.DRIBBBLE_CLIENT_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [DribbbleProvider as any],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store OAuth provider info in token
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }) {
      // Add provider info to session
      if (token) {
        session.user = {
          ...session.user,
          provider: token.provider as string,
          accessToken: token.accessToken as string,
          profile: token.profile as any,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/portfolio",
    error: "/portfolio",
  },
});
