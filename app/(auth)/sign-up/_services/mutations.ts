'use server';

import { SignUpSchema, signUpSchema } from '@/app/(auth)/sign-up/_types/sign-up-schema';
import { executeAction } from '@/lib/execute-action';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/utils';

/**
 * Handles user sign-up functionality by validating input data, hashing the user's password,
 * and creating a new user record in the database.
 *
 * @param data - The input data containing user details such as name, email, and password.
 * @returns {Promise<void>} A promise that resolves when the user is successfully signed up.
 * @throws {Error} Throws an error if validation or database interaction fails.
 */
export const signUp = async (data: SignUpSchema): Promise<void> => {
  await executeAction({
    actionFn: async () => {
      const validateData = signUpSchema.parse(data);
      const hashedPassword = await hashPassword(validateData.password);

      await prisma.user.create({
        data: {
          name: validateData.name,
          email: validateData.email,
          password: hashedPassword,
        },
      });
    },
  });
};
