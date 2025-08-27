import {
  deleteServingUnit,
  saveServingUnit,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_services/services';
import type { ServingUnitSchema } from '@/app/(dashboard)/admin/foods-management/serving-units/_types/schema';
import type { ServingUnit } from '@/generated/prisma/client';
import { getErrorMessage } from '@/lib/get-error-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * A custom hook for saving a serving unit using a mutation. It provides functionality to
 * create or update a serving unit and handles success and error events with appropriate messages.
 *
 * The hook uses `useMutation` to perform a mutation on serving unit data, including creating
 * or updating the unit. On successful mutation, it invalidates the query cache for serving units,
 * and on error, it displays an error message.
 *
 * @returns Returns the mutation object from `useMutation`, including status, data, and mutation functions.
 */
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

/**
 * Custom hook for deleting a serving unit through a mutation.
 * This hook interfaces with a defined mutation to delete a serving unit identified by its ID.
 * Upon successful deletion, the local query cache is invalidated to ensure data consistency.
 *
 * @returns A mutation object that provides methods and states
 * for handling the delete serving unit operation.
 *
 * The mutation function requires an ID (number) representing the serving unit to be deleted.
 * On successful completion, a success message is displayed, and related queries are invalidated.
 * On failure, an error message is displayed.
 */
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
