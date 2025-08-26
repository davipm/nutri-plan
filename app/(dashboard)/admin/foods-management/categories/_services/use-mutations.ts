import {
  deleteCategory,
  saveCategory,
} from '@/app/(dashboard)/admin/foods-management/categories/_services/services';
import type { CategorySchema } from '@/app/(dashboard)/admin/foods-management/categories/_types/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSaveCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CategorySchema>({
    mutationKey: ['categories', 'save'],
    mutationFn: async (data) => saveCategory(data),
    onSuccess: async (_, { action }) => {
      toast.success(`Category ${action === 'create' ? 'created' : 'updated'} successfully.`);
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create Category.');
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
