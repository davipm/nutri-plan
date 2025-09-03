import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { getMeal, getMeals } from '@/app/(dashboard)/client/_services/services';
import { MealWithFoods } from '@/app/(dashboard)/client/_types/meals';
import { useQuery } from '@tanstack/react-query';

/**
 * A custom hook that fetches meal data based on the currently applied filters.
 *
 * This hook interacts with a meal store to retrieve the active meal filters
 * and uses the `useQuery` hook to query the meals matching those filters.
 * It helps manage fetching, caching, and updating of meal-related data
 * automatically.
 *
 * @function
 * @returns An object containing the state and methods provided by the `useQuery` hook,
 * encapsulating the status and data of the meal query.
 */
export const useMeals = <T = MealWithFoods[]>() => {
  const { mealFilters } = useMealStore();

  const keyFilters = {
    ...mealFilters,
    dateTime: mealFilters.dateTime.toISOString(),
  };

  return useQuery({
    queryKey: ['meals', keyFilters],
    queryFn: () => getMeals(mealFilters) as Promise<T>,
  });
};

/**
 * A custom hook that retrieves data for a specific meal using the selected meal ID from the store.
 * It leverages the `useQuery` hook to perform a client-side query with caching and reactivity.
 *
 * @function
 * @returns The query result object from `useQuery`, containing the reactionally updated meal data,
 *          loading status, error, and other metadata.
 */
export const useMeal = () => {
  const { selectedMealId } = useMealStore();

  return useQuery({
    queryKey: ['meal', { id: selectedMealId }],
    queryFn: () => getMeal(selectedMealId!),
    enabled: !!selectedMealId,
  });
};
