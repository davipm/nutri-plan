import {
  type FoodFiltersSchema,
  foodFiltersDefaultValues,
} from '@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema';
import { createStore } from '@/store/create-store';

type State = {
  selectedFoodId: number | null;
  foodDialogOpen: boolean;
  foodFilters: FoodFiltersSchema;
  foodFiltersDrawerOpen: boolean;
};

type Actions = {
  updateSelectedFoodId: (id: State['selectedFoodId']) => void;
  updateFoodDialogOpen: (isOpen: State['foodDialogOpen']) => void;
  updateFoodFilters: (filters: State['foodFilters']) => void;
  resetFoodFilters: () => void;
  updateFoodFiltersDrawerOpen: (isOpen: State['foodFiltersDrawerOpen']) => void;
  updateFoodFilterPage: (action: 'next' | 'prev' | number) => void;
  updateFoodFiltersSearchTerm: (term: State['foodFilters']['searchTerm']) => void;
};

type Store = State & Actions;

/**
 * A Zustand store for managing the state of the foods management page.
 *
 * It includes state and actions for:
 * - Selecting a food.
 * - Managing the food form dialog.
 * - Managing the food filters drawer.
 * - Handling food filters, including pagination and search.
 */
export const useFoodsStore = createStore<Store>(
  (set) => ({
    selectedFoodId: null,
    foodDialogOpen: false,
    foodFilters: foodFiltersDefaultValues,
    foodFiltersDrawerOpen: false,

    updateSelectedFoodId: (id) =>
      set((state) => {
        state.selectedFoodId = id;
      }),

    updateFoodDialogOpen: (isOpen) =>
      set((state) => {
        state.foodDialogOpen = isOpen;
      }),

    updateFoodFilters: (filters) =>
      set((state) => {
        state.foodFilters = filters;
      }),

    resetFoodFilters: () =>
      set((state) => {
        state.foodFilters = foodFiltersDefaultValues;
      }),

    updateFoodFiltersDrawerOpen: (isOpen) =>
      set((state) => {
        state.foodFiltersDrawerOpen = isOpen;
      }),

    updateFoodFilterPage: (action) =>
      set((state) => {
        const { page } = state.foodFilters;

        if (action === 'next') {
          state.foodFilters.page = page + 1;
        } else if (action === 'prev') {
          state.foodFilters.page = Math.max(1, page - 1);
        } else {
          state.foodFilters.page = action;
        }
      }),

    updateFoodFiltersSearchTerm: (searchTerm) =>
      set((state) => {
        state.foodFilters.searchTerm = searchTerm;
        state.foodFilters.page = 1;
      }),
  }),
  {
    name: 'foods-store',
    excludeFromPersist: ['foodFilters'],
  },
);
