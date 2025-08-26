import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string | null;
    } & import('next-auth').DefaultSession['user'];
  }

  interface User {
    role: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number;
    role?: string | null;
  }
}
