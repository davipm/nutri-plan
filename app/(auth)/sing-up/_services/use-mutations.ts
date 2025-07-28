import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SingUpSchema } from "@/app/(auth)/sing-up/_types/sign-up-schema";
import { singUp } from "@/app/(auth)/sing-up/_services/mutations";

/**
 * useSingUp is a custom hook that provides a mutation handler for signing up a user.
 * It utilizes `useMutation` to handle the signup process and handle side effects upon success.
 *
 * On a successful signup, the function displays a success toast message
 * and redirects the user to the sign-in page.
 *
 * @returns {Object} An object containing properties and methods for performing the signup mutation.
 */
export const useSingUp = (): object => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SingUpSchema) => {
      await singUp(data);
    },
    onSuccess: () => {
      toast.success("Signed up successfully.");
      router.replace("/sing-in");
    },
  });
};
