import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      // GitHub numeric ID를 token.sub에 저장
      if (profile?.id) token.sub = String(profile.id);
      return token;
    },
    async session({ session, token }) {
      const adminId = process.env.ADMIN_GITHUB_ID;
      session.user.isAdmin = Boolean(adminId && token.sub === adminId);
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin: boolean;
    };
  }
}
