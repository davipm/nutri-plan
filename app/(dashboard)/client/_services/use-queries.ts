import { useMealStore } from '@/app/(dashboard)/client/_libs/use-meal-store';
import { getMeal, getMeals } from '@/app/(dashboard)/client/_services/services';
import { useQuery } from '@tanstack/react-query';

export const useMeals = () => {
  const { mealFilters } = useMealStore();

  return useQuery({
    queryKey: ['meals', mealFilters],
    queryFn: () => getMeals(mealFilters),
  });
};

export const useMeal = () => {
  const { selectedMealId } = useMealStore();

  return useQuery({
    queryKey: ['meals', { selectedMealId }],
    queryFn: () => getMeal(selectedMealId!),
    enabled: !!selectedMealId,
  });
};
