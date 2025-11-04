import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '../../../../lib/models/User';
import connectDB from '../../../../lib/mongodb';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            googleId: account?.providerAccountId,
          });
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        await connectDB();
        
        // Narrow the expected shape for dbUser to avoid `any` while still
        // handling whatever Mongoose returns for the `_id` field.
        const dbUser = (await User.findOne({ email: session.user?.email })) as
          | { _id?: { toString(): string } | string }
          | null;

        if (dbUser && session.user) {
          // dbUser._id may be a Mongoose ObjectId; treat it as unknown then
          // detect and call toString() if available, otherwise fallback to String().
          const rawId: unknown = dbUser._id;
          if (
            rawId !== null &&
            typeof rawId === 'object' &&
            typeof (rawId as { toString?: unknown }).toString === 'function'
          ) {
            session.user.id = (rawId as { toString(): string }).toString();
          } else {
            session.user.id = String(rawId);
          }
        }
        
        return session;
      } catch (error) {
        console.error('Session error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };