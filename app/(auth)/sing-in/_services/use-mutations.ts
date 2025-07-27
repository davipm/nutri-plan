import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { SingInSchema } from "@/app/(auth)/sing-in/_types/sing-in-schema";
import { singIn, singOut } from "@/app/(auth)/sing-in/_services/mutations";

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
export const useSingIn = () => {
  return useMutation({
    mutationFn: async (data: SingInSchema) => {
      await singIn(data);
    },
  });
};

/**
 * A custom hook that encapsulates the sign-out functionality using a mutation.
 * It triggers the `singOut` function and redirects the user to the "/sing-in" route upon success.
 *
 * @function useSingOut
 * @returns {Object} An object containing mutation-related properties and methods, provided by the `useMutation` hook.
 */
export const useSingOut = (): object => {
  const router = useRouter();

  return useMutation({
    mutationFn: singOut,
    onSuccess: () => {
      router.push("/sing-in");
    },
  });
};
