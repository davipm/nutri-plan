"use server";

import {
  singInSchema,
  SingInSchema,
} from "@/app/(auth)/sing-in/_types/sing-in-schema";
import { signIn as nextAuthSingIn, signOut as authSingOut } from "@/lib/auth";
import { executeAction } from "@/lib/execute-action";

/**
 * An asynchronous function that handles the sign-in process for a user.
 *
 * This function validates the provided sign-in data against the `SingInSchema`.
 * Once the data is successfully validated, it proceeds to perform an authentication
 * using the `nextAuthSingIn` method with the "credentials" provider.
 *
 * To ensure execution safety, the function is wrapped inside an `executeAction` function.
 */
export const singIn = async (data: SingInSchema) => {
  await executeAction({
    actionFn: async () => {
      const validateData = singInSchema.parse(data);
      await nextAuthSingIn("credentials", validateData);
    },
  });
};

/**
 * singOut
 *
 * Executes the user sign-out process by calling the designated
 * authentication sign-out function.
 *
 */
export const singOut = () => {
  return executeAction({
    actionFn: authSingOut,
  });
};
