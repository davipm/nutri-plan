import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FoodSchema } from "@/app/(dashboard)/admin/foods-management/foods/_types/food-schema";
import {
  createFood,
  deleteFood,
  updateFood,
} from "@/app/(dashboard)/admin/foods-management/foods/_services/mutations";
import { toast } from "sonner";

/**
 * Custom hook to handle the creation of a food item.
 *
 * This hook uses the `useMutation` from React Query to perform a mutation for creating a food item.
 * It provides a callback function to execute the mutation and manages the mutation state.
 *
 * The hook also integrates a success handler to display a toast notification when the food
 * item is successfully created and invalidates the relevant query to ensure the data is refreshed.
 *
 * Dependencies:
 * - `useQueryClient` from React Query to manage cache.
 * - `useMutation` from React Query to handle the mutation.
 * - `createFood` function to perform the actual API call or async operation.
 *
 * Returns:
 * - A mutation object that contains methods to trigger the mutation and mutation state.
 */
export const useCreateFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FoodSchema) => {
      await createFood(data);
    },
    onSuccess: () => {
      toast.success("Food created successfully.");
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FoodSchema) => {
      await updateFood(data);
    },
    onSuccess: () => {
      toast.success("Food updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteFood(id);
    },
    onSuccess: () => {
      toast.success("Food deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });
};
