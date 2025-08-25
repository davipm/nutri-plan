'use server';

import { SignInSchema, signInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { signOut as authSignOut, signIn as nextAuthSignIn } from '@/lib/auth';
import { executeAction } from '@/lib/execute-action';

/**
 * An asynchronous function that handles the sign-in process for a user.
 *
 * This function validates the provided sign-in data against the `SingInSchema`.
 * Once the data is successfully validated, it proceeds to perform an authentication
 * using the `nextAuthSingIn` method with the "credentials" provider.
 *
 * To ensure execution safety, the function is wrapped inside an `executeAction` function.
 */
export const signIn = async (data: SignInSchema) => {
  await executeAction({
    actionFn: async () => {
      const validateData = signInSchema.parse(data);
      await nextAuthSignIn('credentials', validateData);
    },
  });
};

/**
 * Asynchronous function to sign out a user.
 *
 * Executes the `authSingOut` action through a generic action executor utility.
 * This handles the user sign-out process and triggers any necessary authentication cleanup.
 *
 * @returns A promise that resolves when the sign-out process is complete.
 */
export const signOut = async () => {
  return await executeAction({
    actionFn: authSignOut,
  });
};
