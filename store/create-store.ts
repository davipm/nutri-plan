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
  storeCreator: StateCreator<T, [['zustand/immer', never], ['zustand/immer', never]], []>,
  config?: ConfigType<T>,
) => {
  const {
    name,
    storage,
    skipPersist = false,
    excludeFromPersist = [] as Array<keyof T>,
    devtools: devtoolsConfig,
  } = config || {};

  // Apply immer middleware first
  let enhancedStoreCreator = immer(storeCreator) as StateCreator<
    T,
    [['zustand/devtools', never]],
    [['zustand/immer', never]],
    T
  >;

  // Apply devtools middleware if enabled
  const isDevtoolsEnabled = devtoolsConfig?.enabled ?? process.env.NODE_ENV === 'development';

  if (isDevtoolsEnabled) {
    enhancedStoreCreator = devtools(enhancedStoreCreator, {
      name: devtoolsConfig?.name || name || 'zustand-store',
      enabled: true,
    }) as typeof enhancedStoreCreator;
  }

  // Apply persistence if not skipped
  if (skipPersist) {
    return create<T>()(enhancedStoreCreator as StateCreator<T, [], [['zustand/immer', never]]>);
  }

  // When using persistence, wrap the enhanced store creator
  return create<T>()(
    persist(enhancedStoreCreator as StateCreator<T, [], [['zustand/immer', never]]>, {
      name: name || 'zustand-store',
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
