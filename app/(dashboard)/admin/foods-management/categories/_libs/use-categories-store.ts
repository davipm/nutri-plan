import { createStore } from "@/store/create-store";

type State = {
  selectedCategoryId: number | null;
  categoryDialogOpen: boolean;
};

type Actions = {
  updateSelectedCategoryId: (id: State["selectedCategoryId"]) => void;
  updateCategoryDialogOpen: (id: State["categoryDialogOpen"]) => void;
};

type Store = State & Actions;

/**
 * A store that manages category state, including selected category and dialog visibility.
 *
 * Properties:
 * - selectedCategoryId (null | string): The currently selected category's ID. Initially set to null.
 * - updateSelectedCategoryId (function): Updates the selectedCategoryId property. Accepts a category ID as argument.
 * - categoryDialogOpen (boolean): Flag that determines if the category dialog is open or closed. Initially set to false.
 * - updateCategoryDialogOpen (function): Updates the categoryDialogOpen property. Accepts a boolean value as argument.
 *
 * Options:
 * - name: A string representing the name of the store ("categories-store").
 */
export const useCategoriesStore = createStore<Store>(
  (set) => ({
    selectedCategoryId: null,
    updateSelectedCategoryId: (id) =>
      set((state) => {
        state.selectedCategoryId = id;
      }),
    categoryDialogOpen: false,
    updateCategoryDialogOpen: (id) =>
      set((state) => {
        state.categoryDialogOpen = id;
      }),
  }),
  { name: "categories-store" },
);
