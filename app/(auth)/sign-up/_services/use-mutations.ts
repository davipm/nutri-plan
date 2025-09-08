import { signUp } from '@/app/(auth)/sign-up/_services/mutations';
import { SignUpSchema } from '@/app/(auth)/sign-up/_types/sign-up-schema';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * useSignUp is a custom hook that provides a mutation handler for signing up a user.
 * It uses `useMutation` to handle the signup process and handle side effects upon success.
 *
 * On a successful signup, the function displays a success toast message
 * and redirects the user to the sign-in page.
 */
export const useSignUp = () => {
  const router = useRouter();

  return useMutation<void, Error, SignUpSchema>({
    mutationFn: async (data) => {
      await signUp(data);
    },
    onSuccess: () => {
      toast.success('User Created Successfully');
      router.replace('/sign-in');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
