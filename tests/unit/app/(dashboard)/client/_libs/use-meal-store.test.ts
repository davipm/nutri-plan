import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMealStore } from "@/app/(dashboard)/client/_libs/use-meal-store";
import { mealFilterDefaultValues } from "@/app/(dashboard)/client/_types/meal-filter-schema";

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

describe("useMealStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const state = useMealStore.getState();

    expect(state.selectedMealId).toBe(null);
    expect(state.mealDialogOpen).toBe(false);
    expect(state.mealFilters).toEqual(mealFilterDefaultValues);
  });

  it("should update selected meal ID correctly", () => {
    const initialState = useMealStore.getState();

    initialState.setSelectedMealId(123);

    const updatedState = useMealStore.getState();
    expect(updatedState.selectedMealId).toBe(123);
  });

  it("should reset selected meal ID to null", () => {
    const initialState = useMealStore.getState();

    // First set an ID
    initialState.setSelectedMealId(456);
    expect(useMealStore.getState().selectedMealId).toBe(456);

    // Then reset to null
    initialState.setSelectedMealId(null);
    expect(useMealStore.getState().selectedMealId).toBe(null);
  });

  it("should toggle meal dialog open/close state", () => {
    const initialState = useMealStore.getState();

    // Open dialog
    initialState.setMealDialogOpen(true);
    expect(useMealStore.getState().mealDialogOpen).toBe(true);

    // Close dialog
    initialState.setMealDialogOpen(false);
    expect(useMealStore.getState().mealDialogOpen).toBe(false);
  });

  it("should update meal filters with new filter values", () => {
    const initialState = useMealStore.getState();

    const newDate = new Date('2024-01-15T10:30:00Z');
    const newFilters = {
      dateTime: newDate,
    };

    initialState.setMealFilters(newFilters);

    const updatedState = useMealStore.getState();
    expect(updatedState.mealFilters).toEqual(newFilters);
    expect(updatedState.mealFilters.dateTime).toBe(newDate);
  });

  it("should preserve meal filter structure when updating", () => {
    const initialState = useMealStore.getState();

    const customDate = new Date('2024-03-20T14:45:00Z');
    const customFilters = {
      dateTime: customDate,
    };

    initialState.setMealFilters(customFilters);

    const updatedState = useMealStore.getState();
    expect(updatedState.mealFilters).toHaveProperty('dateTime');
    expect(updatedState.mealFilters.dateTime).toBeInstanceOf(Date);
    expect(updatedState.mealFilters.dateTime).toBe(customDate);
  });

  it("should handle date objects in meal filters correctly", () => {
    const initialState = useMealStore.getState();

    const testDate1 = new Date('2024-06-01T08:00:00Z');
    const testDate2 = new Date('2024-12-25T18:30:00Z');

    // Set first date
    initialState.setMealFilters({ dateTime: testDate1 });
    expect(useMealStore.getState().mealFilters.dateTime).toBe(testDate1);

    // Update to second date
    initialState.setMealFilters({ dateTime: testDate2 });
    expect(useMealStore.getState().mealFilters.dateTime).toBe(testDate2);

    // Verify it's still a Date object
    expect(useMealStore.getState().mealFilters.dateTime).toBeInstanceOf(Date);
  });

  it("should be created with correct store configuration", () => {
    // Access the mock configuration
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const config = useMealStore._config;

    expect(config).toBeDefined();
    expect(config.name).toBe("meal-store");
  });
});
