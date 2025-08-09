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

/**
 * A store instance for managing the state of food-related functionality in the application.
 *
 * The `useFoodsStore` manages various properties and methods, including:
 * - `selectedFoodId`: Tracks the currently selected food item's ID.
 * - `updateSelectedFoodId`: Updates the `selectedFoodId` property with a new value.
 * - `foodDialogOpen`: A boolean to manage the open/close state of the food dialog.
 * - `updateFoodDialogOpen`: Updates the `foodDialogOpen` state.
 * - `foodFilters`: Contains the filtering criteria for foods, initialized with default values.
 * - `updateFoodFilters`: Updates the `foodFilters` property with a new set of filters.
 * - `foodFiltersDrawerOpen`: A boolean managing the open/close state of the filters' drawer.
 * - `updateFoodFiltersDrawerOpen`: Updates the `foodFiltersDrawerOpen` state.
 * - `updateFoodFilterPage`: A function for navigating pages in the food filters, which handles "next," "prev," or specific page numbers.
 *
 * Configuration options:
 * - `name`: Specifies the name of the store as "foods-store".
 * - `excludeFromPersist`: Avoids persisting specific properties, such as `foodFilters` in this case.
 *
 * This store provides reactive functionality to simplify food-related state management in the application.
 */
export const useFoodsStore = createStore<Store>(
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
    updateFoodFiltersSearchTerm: (searchTerm) => {
      set((state) => {
        state.foodFilters.searchTerm = searchTerm;
      });
    },
  }),
  {
    name: "foods-store",
    excludeFromPersist: ["foodFilters"],
  },
);
