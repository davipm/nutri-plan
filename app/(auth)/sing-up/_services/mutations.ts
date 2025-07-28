import {
  singUpSchema,
  SingUpSchema,
} from "@/app/(auth)/sing-up/_types/sign-up-schema";
import { executeAction } from "@/lib/execute-action";
import { hashPassword } from "@/lib/utils";
import prisma from "@/lib/prisma";

/**
 * Handles user sign-up functionality by validating input data, hashing the user's password,
 * and creating a new user record in the database.
 *
 * @param {SignUpSchema} data - The input data containing user details such as name, email, and password.
 * @returns {Promise<void>} A promise that resolves when the user is successfully signed up.
 * @throws {Error} Throws an error if validation or database interaction fails.
 */
export const singUp = async (data: SingUpSchema): Promise<void> => {
  await executeAction({
    actionFn: async () => {
      const validateData = singUpSchema.parse(data);
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
