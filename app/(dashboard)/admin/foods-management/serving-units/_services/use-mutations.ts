import {
  createServingUnit,
  deleteServingUnit,
  updateServingUnit,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_services/services';
import { ServingUnitSchema } from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServingUnitSchema) => {
      await createServingUnit(data);
    },
    onSuccess: () => {
      toast.success('Serving Unit created successfully.');
      queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
  });
};

export const useUpdateServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ServingUnitSchema>({
    mutationKey: ['servingUnits', 'update'],
    mutationFn: async (data: ServingUnitSchema) => {
      if (data.action !== 'update') {
        return Promise.reject(new Error('Invalid action for update.'));
      }
      return updateServingUnit(data);
    },
    onSuccess: () => {
      toast.success('Serving Unit updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update Serving Unit.');
    },
  });
};

export const useDeleteServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteServingUnit(id);
    },
    onSuccess: () => {
      toast.success('Serving Unit deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
  });
};
