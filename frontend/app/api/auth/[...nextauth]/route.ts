import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API_ENDPOINTS } from '@/lib/constants/api';
import { LoginApiResponse } from '@/src/types/next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await axios.post<LoginApiResponse>(
            API_ENDPOINTS.LOGIN,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          if (!res.data?.success) return null;

          const { user, token } = res.data.data;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            userType: user.userType,
            token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.userType = user.userType;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: '/auth',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
