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
        
        const dbUser = await User.findOne({ email: session.user?.email });
        
        if (dbUser && session.user) {
          session.user.id = dbUser._id.toString();
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