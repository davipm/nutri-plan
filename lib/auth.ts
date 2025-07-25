import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      // authorize: async (credentials) => {
      //   return {
      //     id: "",
      //     email: credentials.email,
      //     name: credentials.email,
      //     role: "user",
      //   };
      // },
    }),
  ],
  pages: {
    signIn: "/sing-in",
  },
});
