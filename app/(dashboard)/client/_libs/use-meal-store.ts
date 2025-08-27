import {
  MealFilterSchema,
  mealFilterDefaultValues,
} from '@/app/(dashboard)/client/_types/meal-filter-schema';
import { createStore } from '@/store/create-store';

type State = {
  selectedMealId: number | null;
  mealDialogOpen: boolean;
  mealFilters: MealFilterSchema;
};

type Actions = {
  setSelectedMealId: (id: State['selectedMealId']) => void;
  setMealDialogOpen: (isOpen: State['mealDialogOpen']) => void;
  setMealFilters: (filters: State['mealFilters']) => void;
};

type Store = State & Actions;

export const useMealStore = createStore<Store>(
  (set) => ({
    selectedMealId: null,
    mealDialogOpen: false,
    mealFilters: mealFilterDefaultValues,
    setSelectedMealId: (id) => {
      set((state) => {
        state.selectedMealId = id;
      });
    },
    setMealDialogOpen: (isOpen) => {
      set((state) => {
        state.mealDialogOpen = isOpen;
      });
    },
    setMealFilters: (filters) => {
      set((state) => {
        state.mealFilters = filters;
      });
    },
  }),
  { name: 'meal-store' },
);
