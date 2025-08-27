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

/**
 * A custom hook that retrieves data for a specific serving unit based on the selected serving unit ID from the store.
 *
 * The `useServingUnit` hook utilizes React Query to fetch the serving unit details. It automatically tracks and
 * optimizes updates to the serving unit data. The hook only performs the query if a valid `selectedServingUnitId`
 * exists in the store state.
 *
 * Query Key:
 * - An array consisting of the string 'servingUnits' and an object with the `selectedServingUnitId`.
 *
 * Query Function:
 * - Fetches the serving unit details using the `getServingUnit` method for the given `selectedServingUnitId`.
 *
 * Enabled:
 * - The query is enabled only if the `selectedServingUnitId` is truthy.
 *
 * Returns:
 * - The query object containing the state and methods provided by React Query for managing the data fetching lifecycle.
 *
 * Dependencies:
 * - Requires `useServingUnitsStore` to access the `selectedServingUnitId`.
 * - Utilizes the `useQuery` hook from React Query for managing the data fetching logic.
 */
export const useServingUnit = () => {
  const { selectedServingUnitId } = useServingUnitsStore();

  return useQuery({
    queryKey: ['servingUnits', { selectedServingUnitId: selectedServingUnitId! }],
    queryFn: () => getServingUnit(selectedServingUnitId!),
    enabled: !!selectedServingUnitId,
  });
};
