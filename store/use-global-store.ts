import { createStore } from '@/store/create-store';

type AlertConfig = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type State = {
  alertOpen: boolean;
  alertConfig: AlertConfig | null;
};

type Actions = {
  showAlert: (config: AlertConfig) => void;
  closeAlert: () => void;
};

type Store = State & Actions;

/**
 * Global store instance created with the createStore function for managing application-wide state.
 *
 * This store maintains states such as `alertOpen` to track whether an alert is open,
 * and `alertConfig`, which contains the configuration details for the alert.
 *
 * It also provides methods for updating these states:
 * - `showAlert`: Opens the alert and sets its configuration.
 * - `closeAlert`: Closes the alert and clears its configuration.
 *
 * Configuration options for this store include:
 * - `name`: A custom name for the store, set to "global-store".
 * - `excludeFromPersist`: An array of keys excluded from persistence, which in this case includes `alertOpen`.
 */
export const useGlobalStore = createStore<Store>(
  (set) => ({
    alertOpen: false,
    alertConfig: null,

    showAlert: (config) =>
      set((state) => {
        state.alertOpen = true;
        state.alertConfig = config;
      }),

    closeAlert: () =>
      set((state) => {
        state.alertOpen = false;
        state.alertConfig = null;
      }),
  }),
  { name: 'global-store', excludeFromPersist: ['alertOpen'] },
);

export const alert = (config: AlertConfig) => useGlobalStore.getState().showAlert(config);