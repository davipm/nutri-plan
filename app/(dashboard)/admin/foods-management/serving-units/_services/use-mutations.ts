import {
  deleteServingUnit,
  saveServingUnit,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_services/services';
import type { ServingUnitSchema } from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import type { ServingUnit } from '@/generated/prisma/client';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSaveServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<ServingUnit, Error, ServingUnitSchema>({
    mutationKey: ['servingUnits', 'save'],
    mutationFn: (data) => saveServingUnit(data),
    onSuccess: async (_, { action }) => {
      toast.success(`Serving unit ${action === 'create' ? 'created' : 'updated'} successfully.`);
      await queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDeleteServingUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationKey: ['servingUnits', 'delete'],
    mutationFn: (id) => deleteServingUnit(id),
    onSuccess: async () => {
      toast.success('Serving unit deleted successfully.');
      await queryClient.invalidateQueries({ queryKey: ['servingUnits'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
