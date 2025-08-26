import { createStore } from '@/store/create-store';

type State = {
  selectedServingUnitId: number | null;
  servingUnitDialogOpen: boolean;
};

type Actions = {
  updateSelectedServingUnitId: (id: State['selectedServingUnitId']) => void;
  updateServingUnitDialogOpen: (id: State['servingUnitDialogOpen']) => void;
};

type Store = State & Actions;

/**
 * A state management store for handling the serving unit selection and dialog status.
 * This store is used to manage UI state and interactions related to serving units.
 *
 * Properties managed by the store include:
 * - selectedServingUnitId: The ID of the currently selected serving unit (or null if none is selected).
 * - servingUnitDialogOpen: A boolean indicating whether the serving unit dialog is open or closed.
 *
 * Methods provided by the store:
 * - updateSelectedServingUnitId: Updates the selected serving unit ID.
 * - updateServingUnitDialogOpen: Updates the state of the serving unit dialog (open or closed).
 *
 * Store name: serving-units-store
 */
export const useServingUnitsStore = createStore<Store>(
  (set) => ({
    selectedServingUnitId: null,
    servingUnitDialogOpen: false,

    updateSelectedServingUnitId: (id) => {
      set((state) => {
        state.selectedServingUnitId = id;
      });
    },
    updateServingUnitDialogOpen: (id) => {
      set((state) => {
        state.servingUnitDialogOpen = id;
      });
    },
  }),
  { name: 'serving-units-store' },
);
