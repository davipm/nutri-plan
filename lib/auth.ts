import { signInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import prisma from '@/lib/prisma';
import { comparePasswords, toNumberSafe, toStringSafe } from '@/lib/utils';
import Credentials from '@auth/core/providers/credentials';
import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    name?: string | null;
    role?: string | null;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
declare module 'next-auth/jwt' {
  interface JWT {
    name?: string | null;
    role?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (
        credentials: Partial<Record<'email' | 'password', unknown>>,
      ): Promise<User | null> => {
        if (!credentials.email || !credentials.password) {
          console.error('Missing credentials');
          return null;
        }

        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user?.password) {
            await comparePasswords(password, '$2a$10$dummyHash');
            console.error('Wrong password for user: ', email, '');
            return null;
          }

          const isPasswordValid = await comparePasswords(password, user.password);

          if (!isPasswordValid) {
            console.error('Wrong password for user: ', email, '');
            return null;
          }

          return {
            id: toStringSafe(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Sign in error:', error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: '/sign-in',
  },

  callbacks: {
    jwt({ token, user }) {
      const clonedToken = token;

      if (user) {
        clonedToken.id = toNumberSafe(user.id);
        clonedToken.name = user.name;
        clonedToken.role = user.role;
      }
      return clonedToken;
    },
    session({ session, token }) {
      const clonedSession = session;

      if (clonedSession.user) {
        clonedSession.user.id = toStringSafe(token.id);
        clonedSession.user.name = token.name;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        clonedSession.user.role = token.role;
      }

      return clonedSession;
    },
  },
});
