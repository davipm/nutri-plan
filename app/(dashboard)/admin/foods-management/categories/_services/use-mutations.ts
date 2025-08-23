import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/app/(dashboard)/admin/foods-management/categories/_services/services';
import type { CategorySchema } from '@/app/(dashboard)/admin/foods-management/categories/_types/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * A custom hook for creating a new category using a mutation function.
 *
 * This hook use `useMutation` from React Query to handle category creation.
 * Upon successful creation, it invalidates the query cache related to "categories"
 * to ensure the UI reflects the latest data and displays a success toast message.
 *
 * @returns Returns the mutation object which can be use
 *          to trigger the category creation process.
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CategorySchema>({
    mutationKey: ['categories', 'create'],
    mutationFn: async (data) => {
      if (data.action !== 'create') {
        throw new Error('Invalid action for create.');
      }
      await createCategory(data);
    },
    onSuccess: async () => {
      toast.success('Category created successfully.');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create Category.');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CategorySchema>({
    mutationKey: ['categories', 'update'],
    mutationFn: async (data) => {
      if (data.action !== 'update') {
        throw new Error('Invalid action for update.');
      }
      return updateCategory(data);
    },
    onSuccess: async () => {
      toast.success('Category updated successfully.');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update Category.');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationKey: ['categories', 'delete'],
    mutationFn: async (id) => {
      await deleteCategory(id);
    },
    onSuccess: async () => {
      toast.success('Category deleted successfully.');
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to deleted Category.');
    },
  });
};
