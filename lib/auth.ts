import { signInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import prisma from '@/lib/prisma';
import { comparePasswords, toNumberSafe, toStringSafe } from '@/lib/utils';
import Credentials from '@auth/core/providers/credentials';
import NextAuth, { type User } from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials): Promise<User | null> => {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error('Invalid credentials:', parsedCredentials.error);
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user?.password) {
            await comparePasswords(password, '$2a$10$invalid/hash/to/prevent/timing/attacks');
            console.error(`Auth failed: User not found or has no password. Email: ${email}`);
            return null;
          }

          const isPasswordValid = await comparePasswords(password, user.password);

          if (!isPasswordValid) {
            console.error(`Auth failed: Invalid password for user. Email: ${email}`);
            return null;
          }

          return {
            id: toStringSafe(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Sign-in error:', error);
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
      if (user) {
        token.id = toNumberSafe(user.id);
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = toStringSafe(token.id);
        session.user.name = token.name;
        session.user.role = token.role as string | null;
      }

      return session;
    },
  },
});

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session?.user.id) throw new Error('Unauthorized');
  return session;
};
