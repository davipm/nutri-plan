import {
  deleteFood,
  saveFood,
} from '@/app/(dashboard)/admin/foods-management/foods/_services/services';
import type { FoodSchema } from '@/app/(dashboard)/admin/foods-management/foods/_types/food-schema';
import type { Food } from '@/generated/prisma/client';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSaveFood = () => {
  const queryClient = useQueryClient();

  return useMutation<Food, Error, FoodSchema>({
    mutationKey: ['foods', 'save'],
    mutationFn: async (data) => await saveFood(data),
    onSuccess: async (_, { action }) => {
      toast.success(`Food ${action === 'create' ? 'created' : 'updated'} successfully.`);
      await queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationKey: ['foods', 'delete'],
    mutationFn: async (id) => {
      await deleteFood(id);
    },
    onSuccess: async () => {
      toast.success('Food deleted successfully.');
      await queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
