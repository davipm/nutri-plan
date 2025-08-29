import { deleteMeal, saveMeal } from '@/app/(dashboard)/client/_services/services';
import type { MealSchema } from '@/app/(dashboard)/client/_types/meal-schema';
import type { Meal } from '@/generated/prisma/client';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSaveMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<Meal, Error, MealSchema>({
    mutationKey: ['meals', 'save'],
    mutationFn: (data) => {
      return saveMeal(data);
    },
    onSuccess: async (_, { action }) => {
      toast.success(`Meal ${action === 'create' ? 'created' : 'updated'} successfully.`);
      await queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<Meal, Error, number>({
    mutationKey: ['meals', 'delete'],
    mutationFn: (id) => {
      return deleteMeal(id);
    },
    onSuccess: async () => {
      toast.success('Meal deleted successfully.');
      await queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
