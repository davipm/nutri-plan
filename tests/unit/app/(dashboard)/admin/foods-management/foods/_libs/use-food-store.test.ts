import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFoodsStore } from "@/app/(dashboard)/admin/foods-management/foods/_libs/use-food-store";
import { foodFiltersDefaultValues } from "@/app/(dashboard)/admin/foods-management/foods/_types/food-filter-schema";

// Mock the createStore function
vi.mock("@/store/create-store", () => ({
  createStore: vi.fn((storeCreator, config) => {
    // Create a simple mock store that behaves like Zustand
    let state = storeCreator(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (updater) => {
        if (typeof updater === "function") {
          const newState = updater(state);
          if (newState) {
            state = { ...state, ...newState };
          }
        } else {
          state = { ...state, ...updater };
        }
      },
      () => state,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setState: (newState) => {
          state = typeof newState === "function" ? newState(state) : newState;
        },
        getState: () => state,
        subscribe: vi.fn(),
        destroy: vi.fn(),
      },
    );

    const store = () => state;
    store.getState = () => state;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    store.setState = (newState) => {
      state = typeof newState === "function" ? newState(state) : newState;
    };
    store.subscribe = vi.fn();
    store.destroy = vi.fn();

    // Store the config for testing
    store._config = config;

    return store;
  }),
}));

describe("useFoodsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const state = useFoodsStore.getState();

    expect(state.selectedFoodId).toBe(null);
    expect(state.foodDialogOpen).toBe(false);
    expect(state.foodFilters).toEqual(foodFiltersDefaultValues);
    expect(state.foodFiltersDrawerOpen).toBe(false);
  });

  it("should update selected food ID correctly", () => {
    const initialState = useFoodsStore.getState();

    initialState.updateSelectedFoodId(123);

    const updatedState = useFoodsStore.getState();
    expect(updatedState.selectedFoodId).toBe(123);
  });

  it("should reset selected food ID to null", () => {
    const initialState = useFoodsStore.getState();

    // First set an ID
    initialState.updateSelectedFoodId(456);
    expect(useFoodsStore.getState().selectedFoodId).toBe(456);

    // Then reset to null
    initialState.updateSelectedFoodId(null);
    expect(useFoodsStore.getState().selectedFoodId).toBe(null);
  });

  it("should toggle food dialog open/close state", () => {
    const initialState = useFoodsStore.getState();

    // Open dialog
    initialState.updateFoodDialogOpen(true);
    expect(useFoodsStore.getState().foodDialogOpen).toBe(true);

    // Close dialog
    initialState.updateFoodDialogOpen(false);
    expect(useFoodsStore.getState().foodDialogOpen).toBe(false);
  });

  it("should update food filters with new filter values", () => {
    const initialState = useFoodsStore.getState();

    const newFilters = {
      ...foodFiltersDefaultValues,
      searchTerm: "chicken",
      caloriesRange: ["100", "500"] as [string, string],
      categoryId: "protein",
    };

    initialState.updateFoodFilters(newFilters);

    const updatedState = useFoodsStore.getState();
    expect(updatedState.foodFilters).toEqual(newFilters);
    expect(updatedState.foodFilters.searchTerm).toBe("chicken");
    expect(updatedState.foodFilters.caloriesRange).toEqual(["100", "500"]);
    expect(updatedState.foodFilters.categoryId).toBe("protein");
  });

  it("should toggle food filters drawer open/close state", () => {
    const initialState = useFoodsStore.getState();

    // Open drawer
    initialState.updateFoodFiltersDrawerOpen(true);
    expect(useFoodsStore.getState().foodFiltersDrawerOpen).toBe(true);

    // Close drawer
    initialState.updateFoodFiltersDrawerOpen(false);
    expect(useFoodsStore.getState().foodFiltersDrawerOpen).toBe(false);
  });

  it("should handle 'next' page navigation correctly", () => {
    const initialState = useFoodsStore.getState();

    // Start at page 1 (default)
    expect(initialState.foodFilters.page).toBe(1);

    // Navigate to next page
    initialState.updateFoodFilterPage("next");

    const updatedState = useFoodsStore.getState();
    expect(updatedState.foodFilters.page).toBe(2);

    // Navigate to next page again
    updatedState.updateFoodFilterPage("next");

    const finalState = useFoodsStore.getState();
    expect(finalState.foodFilters.page).toBe(3);
  });

  it("should handle 'prev' page navigation correctly and not go below page 1", () => {
    const initialState = useFoodsStore.getState();

    // Set to page 3 first
    initialState.updateFoodFilterPage(3);
    expect(useFoodsStore.getState().foodFilters.page).toBe(3);

    // Navigate to previous page
    initialState.updateFoodFilterPage("prev");
    expect(useFoodsStore.getState().foodFilters.page).toBe(2);

    // Navigate to previous page again
    initialState.updateFoodFilterPage("prev");
    expect(useFoodsStore.getState().foodFilters.page).toBe(1);

    // Try to go below page 1 - should stay at 1
    initialState.updateFoodFilterPage("prev");
    expect(useFoodsStore.getState().foodFilters.page).toBe(1);
  });

  it("should handle direct page number navigation", () => {
    const initialState = useFoodsStore.getState();

    // Navigate directly to page 5
    initialState.updateFoodFilterPage(5);
    expect(useFoodsStore.getState().foodFilters.page).toBe(5);

    // Navigate directly to page 10
    initialState.updateFoodFilterPage(10);
    expect(useFoodsStore.getState().foodFilters.page).toBe(10);

    // Navigate directly to page 1
    initialState.updateFoodFilterPage(1);
    expect(useFoodsStore.getState().foodFilters.page).toBe(1);
  });

  it("should update search term in food filters", () => {
    const initialState = useFoodsStore.getState();

    // Update search term
    initialState.updateFoodFiltersSearchTerm("apple");

    const updatedState = useFoodsStore.getState();
    expect(updatedState.foodFilters.searchTerm).toBe("apple");

    // Update search term again
    updatedState.updateFoodFiltersSearchTerm("banana bread");

    const finalState = useFoodsStore.getState();
    expect(finalState.foodFilters.searchTerm).toBe("banana bread");
  });

  it("should clear search term when empty string is provided", () => {
    const initialState = useFoodsStore.getState();

    // Set a search term first
    initialState.updateFoodFiltersSearchTerm("test search");
    expect(useFoodsStore.getState().foodFilters.searchTerm).toBe("test search");

    // Clear search term
    initialState.updateFoodFiltersSearchTerm("");
    expect(useFoodsStore.getState().foodFilters.searchTerm).toBe("");
  });

  it("should preserve other filter properties when updating page", () => {
    const initialState = useFoodsStore.getState();

    // Set some filter values
    const customFilters = {
      ...foodFiltersDefaultValues,
      searchTerm: "test food",
      caloriesRange: ["200", "800"] as [string, string],
      categoryId: "vegetables",
      page: 1,
    };

    initialState.updateFoodFilters(customFilters);

    // Update page
    initialState.updateFoodFilterPage("next");

    const updatedState = useFoodsStore.getState();
    expect(updatedState.foodFilters.page).toBe(2);
    expect(updatedState.foodFilters.searchTerm).toBe("test food");
    expect(updatedState.foodFilters.caloriesRange).toEqual(["200", "800"]);
    expect(updatedState.foodFilters.categoryId).toBe("vegetables");
  });

  it("should preserve other filter properties when updating search term", () => {
    const initialState = useFoodsStore.getState();

    // Set some filter values including page
    const customFilters = {
      ...foodFiltersDefaultValues,
      searchTerm: "old search",
      caloriesRange: ["100", "600"] as [string, string],
      page: 3,
    };

    initialState.updateFoodFilters(customFilters);

    // Update search term
    initialState.updateFoodFiltersSearchTerm("new search");

    const updatedState = useFoodsStore.getState();
    expect(updatedState.foodFilters.searchTerm).toBe("new search");
    expect(updatedState.foodFilters.caloriesRange).toEqual(["100", "600"]);
    expect(updatedState.foodFilters.page).toBe(3);
  });

  it("should be created with correct store configuration", () => {
    // Access the mock configuration
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const config = useFoodsStore._config;

    expect(config).toBeDefined();
    expect(config.name).toBe("foods-store");
    expect(config.excludeFromPersist).toEqual(["foodFilters"]);
  });
});
