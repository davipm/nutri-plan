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
  updateSelectedMealId: (id: State['selectedMealId']) => void;
  updateMealDialogOpen: (id: State['mealDialogOpen']) => void;
  updateMealFilters: (filters: State['mealFilters']) => void;
};

type Store = State & Actions;

export const useMealStore = createStore<Store>(
  (set) => ({
    selectedMealId: null,
    mealDialogOpen: false,
    mealFilters: mealFilterDefaultValues,
    updateSelectedMealId: (id) => {
      set((state) => {
        state.selectedMealId = id;
      });
    },
    updateMealDialogOpen: (is) => {
      set((state) => {
        state.mealDialogOpen = is;
      });
    },
    updateMealFilters: (filters) => {
      set((state) => {
        state.mealFilters = filters;
      });
    },
  }),
  { name: 'meal-store' },
);
