import { useFoodsStore } from '@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store';
import {
  getFood,
  getFoods,
} from '@/app/(dashboard)/admin/foods-management/foods/_services/services';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook that retrieves a list of foods based on the current filters.
 *
 * The hook uses a query to fetch food data from an external source
 * by leveraging the current food filters obtained from the state.
 *
 * @function useFoods
 * @returns Returns the result of the query, including status,
 *          data, error, and other query-related properties for managing
 *          the food data request.
 */
export const useFoods = () => {
  const { foodFilters } = useFoodsStore();
  return useQuery({
    queryKey: ['foods', foodFilters],
    queryFn: () => getFoods(foodFilters),
  });
};

/**
 * A custom hook that retrieves food data based on the selected food ID from the store.
 *
 * @function useFood
 * @returns The result of the `useQuery` hook, including the food data, loading state, and error information.
 *
 * This hook fetches the food data using the `useQuery` hook from a query library.
 * The query is enabled only when a `selectedFoodId` is available in the store.
 *
 * Dependencies:
 * - `useFoodsStore`: Retrieves the state containing the `selectedFoodId`.
 * - `getFood`: A function to fetch food data based on the selected ID.
 * - `useQuery`: A hook provided by the query library to handle data fetching.
 */
export const useFood = () => {
  const { selectedFoodId } = useFoodsStore();
  return useQuery({
    queryKey: ['food', { selectedFoodId }],
    queryFn: () => getFood(selectedFoodId!),
    enabled: !!selectedFoodId,
  });
};
