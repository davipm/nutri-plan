import { createStore } from "@/store/create-store";

import {
  foodFiltersDefaultValues,
  FoodFiltersSchema,
} from "@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema";

type State = {
  selectedFoodId: number | null;
  foodDialogOpen: boolean;
  foodFilters: FoodFiltersSchema;
  foodFiltersDrawerOpen: boolean;
};

type Actions = {
  updateSelectedFoodId: (id: State["selectedFoodId"]) => void;
  updateFoodDialogOpen: (is: State["foodDialogOpen"]) => void;
  updateFoodFilters: (filters: State["foodFilters"]) => void;
  updateFoodFiltersDrawerOpen: (is: State["foodFiltersDrawerOpen"]) => void;
  updateFoodFilterPage: (action: "next" | "prev" | number) => void;
  updateFoodFiltersSearchTerm: (
    term: State["foodFilters"]["searchTerm"],
  ) => void;
};

type Store = State & Actions;

export const useFoodsStore = createStore<Store>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  (set) => ({
    selectedFoodId: null,
    updateSelectedFoodId: (id) =>
      set((state) => {
        state.selectedFoodId = id;
      }),
    foodDialogOpen: false,
    updateFoodDialogOpen: (is) =>
      set((state) => {
        state.foodDialogOpen = is;
      }),
    foodFilters: foodFiltersDefaultValues,
    updateFoodFilters: (filters) =>
      set((state) => {
        state.foodFilters = filters;
      }),
    foodFiltersDrawerOpen: false,
    updateFoodFiltersDrawerOpen: (is) =>
      set((state) => {
        state.foodFiltersDrawerOpen = is;
      }),
    updateFoodFilterPage: (action) =>
      set((state) => {
        const currentPage = state.foodFilters.page;
        let newPage = currentPage;

        if (action === "next") {
          newPage = currentPage + 1;
        } else if (action === "prev") {
          newPage = Math.max(currentPage - 1, 1);
        } else {
          newPage = action;
        }

        return {
          foodFilters: {
            ...state.foodFilters,
            page: newPage,
          },
        };
      }),
  }),
  {
    name: "foods-store",
    excludeFromPersist: ["foodFilters"],
  },
);
