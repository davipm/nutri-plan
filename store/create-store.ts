import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StateCreator } from 'zustand/vanilla';

type ConfigType<T> = {
  name?: string;
  storage?: Storage;
  skipPersist?: boolean;
  excludeFromPersist?: Array<keyof T>;
  devtools?: {
    enabled?: boolean;
    name?: string;
  };
};

/**
 * Creates a Zustand store with immer middleware and optional persistence.
 *
 * @template T The type of the state object.
 * @param storeCreator The state creator function that defines the state and actions.
 * @param config Optional configuration for the store, including persistence settings
 * like `name`, `storage`, `skipPersist`, `excludeFromPersist`, and `devtools`.
 * @returns A Zustand store hook for the created store.
 */
export const createStore = <T extends object>(
  storeCreator: StateCreator<T, [['zustand/immer', never]], []>,
  config?: ConfigType<T>,
) => {
  const {
    name,
    storage,
    skipPersist = false,
    excludeFromPersist = [] as Array<keyof T>,
    devtools: devtoolsConfig,
  } = config || {};

  let enhancedStoreCreator = immer(storeCreator);
  const isDevtoolsEnabled = devtoolsConfig?.enabled ?? process.env.NODE_ENV === 'development';

  if (isDevtoolsEnabled) {
    enhancedStoreCreator = devtools(enhancedStoreCreator, {
      name: devtoolsConfig?.name || name || 'zustand-store',
      enabled: true,
    }) as typeof enhancedStoreCreator;
  }

  if (skipPersist) {
    return create<T>()(enhancedStoreCreator);
  }

  if (!name) {
    throw new Error(
      'createStore: `config.name` is required when persistence is enabled to prevent storage key collisions.',
    );
  }

  return create<T>()(
    persist(enhancedStoreCreator, {
      name: name,
      storage: createJSONStorage(() => {
        if (storage) return storage;
        return (typeof window !== 'undefined' ? localStorage : undefined) as Storage;
      }),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !excludeFromPersist.includes(key as keyof T)),
        ),
    }),
  );
};
