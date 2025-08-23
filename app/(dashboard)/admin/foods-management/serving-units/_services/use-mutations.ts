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

  return useMutation<void, Error, ServingUnitSchema>({
    mutationKey: ['servingUnits', 'create'],
    mutationFn: async (data) => {
      if (data.action !== 'create') {
        throw new Error('Invalid action for create.');
      }
      await createServingUnit(data);
    },
    onSuccess: async () => {
      toast.success('Serving Unit created successfully.');
      await queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create Serving Unit.');
    },
  });
};

export const useUpdateServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ServingUnitSchema>({
    mutationKey: ['servingUnits', 'update'],
    mutationFn: async (data) => {
      if (data.action !== 'update') {
        throw new Error('Invalid action for update.');
      }
      return updateServingUnit(data);
    },
    onSuccess: async () => {
      toast.success('Serving Unit updated successfully.');
      await queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update Serving Unit.');
    },
  });
};

export const useDeleteServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationKey: ['servingUnits', 'delete'],
    mutationFn: async (id) => {
      await deleteServingUnit(id);
    },
    onSuccess: () => {
      toast.success('Serving Unit deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete Serving Unit.');
    },
  });
};
