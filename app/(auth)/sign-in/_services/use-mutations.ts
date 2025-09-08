import { signIn, signOut } from '@/app/(auth)/sign-in/_services/mutations';
import { SignInSchema } from '@/app/(auth)/sign-in/_types/sign-in-schema';
import { Role } from '@/app/(dashboard)/_types/nav';
import { useSession } from '@/lib/auth-client';
import { routes } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * A custom hook that encapsulates the sign-in functionality using a mutation.
 */
export const useSignIn = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: SignInSchema) => {
      return signIn(data);
    },
    onSuccess: ({ user }) => {
      toast.success(`Logged as ${user.name}`);
      router.push(session?.user?.role === Role.ADMIN ? routes.admin.foods : routes.client);
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
      router.push(routes.signIn);
    },
  });
};
