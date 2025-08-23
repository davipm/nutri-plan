import { singUp } from '@/app/(auth)/sing-up/_services/mutations';
import { SingUpSchema } from '@/app/(auth)/sing-up/_types/sign-up-schema';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * useSingUp is a custom hook that provides a mutation handler for signing up a user.
 * It uses `useMutation` to handle the signup process and handle side effects upon success.
 *
 * On a successful signup, the function displays a success toast message
 * and redirects the user to the sign-in page.
 */
export const useSingUp = () => {
  const router = useRouter();

  return useMutation<void, Error, SingUpSchema>({
    mutationFn: async (data) => {
      await singUp(data);
    },
    onSuccess: () => {
      toast.success('Signed up successfully.');
      router.replace('/sing-in');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
