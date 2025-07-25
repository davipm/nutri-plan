import { createStore } from "@/store/create-store";

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
  updateAlertOpen: (is: State["alertOpen"]) => void;
  showAlert: (config: AlertConfig) => void;
};

type Store = State & Actions;

/**
 * Global store instance created with the createStore function for managing application-wide state.
 *
 * This store maintains states such as `alertOpen` to track whether an alert is open,
 * and `alertConfig`, which contains the configuration details for the alert.
 *
 * It also provides methods for updating these states:
 * - `updateAlertOpen`: Toggles the alert's visibility and clears any configuration if the alert is closed.
 * - `showAlert`: Opens the alert and sets its configuration.
 *
 * Configuration options for this store include:
 * - `name`: A custom name for the store, set to "global-store".
 * - `excludeFromPersist`: An array of keys excluded from persistence, which in this case includes `alertOpen`.
 */
const useGlobalStore = createStore<Store>(
  (set) => ({
    alertOpen: false,
    alertConfig: null,

    updateAlertOpen: (is) =>
      set((state) => {
        state.alertOpen = is;
        if (!is) state.alertConfig = null;
      }),

    showAlert: (config) =>
      set((state) => {
        state.alertOpen = true;
        state.alertConfig = config;
      }),
  }),
  { name: "global-store", excludeFromPersist: ["alertOpen"] },
);

const alert = (config: AlertConfig) =>
  useGlobalStore.getState().showAlert(config);

export { useGlobalStore, alert };
