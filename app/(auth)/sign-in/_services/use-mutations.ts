import { signIn, signOut } from '@/app/(auth)/sign-in/_services/mutations';
import { SignInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * useSingIn is a custom hook that provides a mutation for the sign-in process.
 * It uses the `useMutation` hook from a mutation library (e.g., React Query).
 *
 * The mutation function performs an asynchronous operation for user sign-in,
 * using the provided `SingInSchema` data.
 *
 * The mutation object returned by useMutation,
 * allowing control over the sign-in process, including methods to trigger
 * the mutation and access its status and results.
 */
export const useSignIn = () => {
  return useMutation({
    mutationFn: async (data: SignInSchema) => {
      await signIn(data);
    },
  });
};

/**
 * A custom hook that encapsulates the sign-out functionality using a mutation.
 * It triggers the `singOut` function and redirects the user to the "/sign-in" route upon success.
 *
 * @function useSignOut
 */
export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.push('/sign-in');
    },
  });
};
