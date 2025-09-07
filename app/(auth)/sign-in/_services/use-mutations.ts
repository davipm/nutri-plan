import { signIn, signOut } from '@/app/(auth)/sign-in/_services/mutations';
import { SignInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * A custom hook that encapsulates the sign-in functionality using a mutation.
 */
export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInSchema) => {
      await signIn(data);
    },
    onSuccess: () => {
      router.push('/client');
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
