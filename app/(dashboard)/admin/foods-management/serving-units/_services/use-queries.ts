import { useServingUnitsStore } from '@/app/(dashboard)/admin/foods-management/serving-units/_libs/use-serving-units-store';
import {
  getServingUnit,
  getServingUnits,
} from '@/app/(dashboard)/admin/foods-management/serving-units/_services/services';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook `useServingUnits` for fetching serving unit data using a query.
 *
 * This hook uses the `react-query` library's `useQuery` function to fetch serving unit data.
 * The query fetches the data by invoking the `getServingUnits` function and is identified
 * with the query key `["servingUnits"]`.
 *
 * @function
 * @returns An object containing the query state, including the data, loading status, error information, and other properties provided by `useQuery`.
 */
export const useServingUnits = () => {
  return useQuery({
    queryKey: ['servingUnits'],
    queryFn: getServingUnits,
  });
};

export const useServingUnit = () => {
  const { selectedServingUnitId } = useServingUnitsStore();

  return useQuery({
    queryKey: ['servingUnits', { selectedServingUnitId: selectedServingUnitId! }],
    queryFn: () => getServingUnit(selectedServingUnitId!),
    enabled: !!selectedServingUnitId,
  });
};
