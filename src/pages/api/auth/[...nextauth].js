import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from '@/model/user';

export const authOptions={
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to the home page after login
      return baseUrl+"/dashboard/chat"; // This will redirect to the baseUrl, which is the homepage in most cases.
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        // Check if user exists, if not create one
        if (user) {
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ')[1] || '',
              role: 'student', // Assign default role
              loginType: 'google-based'
            });
          }
          token.userId = dbUser._id;
          token.role = dbUser.role; // Add user's role to the token
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Fetch user from database
      const dbUser = await User.findById(token.userId);
      
      if (dbUser) {
        // If the role in the database does not match the token's role, update the session
        if (dbUser.role !== token.role) {
          token.role = dbUser.role; // Update the token's role with the database value
        }

        // Update the session with the Google-provided token and database role
        session.accessToken = token.accessToken; // Keep the Google access token
        session.user = {
          id: token.userId,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          role: token.role, // Updated role
        };
      } else {
        // If user is not found in the database, invalidate the session
        return null;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);