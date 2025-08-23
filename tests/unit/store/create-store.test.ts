import { describe, it, expect, vi, beforeEach } from "vitest";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "@/store/create-store";
import { StateCreator } from "zustand/vanilla";

// Mock the zustand libraries
vi.mock("zustand", async (importActual) => {
  const actual = await importActual<typeof import("zustand")>();
  return {
    ...actual,
    create: vi.fn(() => vi.fn()),
  };
});

vi.mock("zustand/middleware", async (importActual) => {
  const actual = await importActual<typeof import("zustand/middleware")>();
  return {
    ...actual,
    persist: vi.fn((initializer) => initializer),
    immer: vi.fn((initializer) => initializer),
    createJSONStorage: vi.fn((getStorage) => getStorage()),
  };
});

vi.mock("zustand/middleware/immer", async (importActual) => {
  const actual =
    await importActual<typeof import("zustand/middleware/immer")>();
  return {
    ...actual,
    immer: vi.fn((initializer) => initializer),
  };
});

// Mock browser storage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn(),
  };
})();

const sessionStorageMock = { ...localStorageMock };

Object.defineProperty(window, "localStorage", { value: localStorageMock });
Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

// Define a type for the test store state
type TestState = {
  count: number;
  name: string;
  internal: boolean;
  actions: {
    increment: () => void;
  };
};

// A sample store creator function for testing
const storeCreator: StateCreator<TestState, [["zustand/immer", never]], []> = (
  set,
) => ({
  count: 0,
  name: "test",
  internal: false,
  actions: {
    increment: () =>
      set((state) => {
        state.count += 1;
      }),
  },
});

describe("createStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore a simple implementation for persist to allow spying on its arguments
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (persist as vi.Mock).mockImplementation((initializer) => initializer);
  });

  it("test_creates_persisted_store_with_default_config", () => {
    createStore(storeCreator, { name: "test-store" });

    expect(persist).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const persistOptions = (persist as vi.Mock).mock.calls[0][1];

    expect(persistOptions.name).toBe("test-store");
    expect(createJSONStorage).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const storageFactory = (createJSONStorage as vi.Mock).mock.calls[0][0];
    expect(storageFactory()).toBe(localStorage);
  });

  it("test_creates_non_persisted_store_when_skip_persist_is_true", () => {
    createStore(storeCreator, { skipPersist: true });

    expect(persist).not.toHaveBeenCalled();
    expect(immer).toHaveBeenCalledWith(storeCreator);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("test_creates_persisted_store_and_excludes_specified_properties", () => {
    createStore<TestState>(storeCreator, {
      name: "test-exclude-store",
      excludeFromPersist: ["internal", "actions"],
    });

    expect(persist).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const persistOptions = (persist as vi.Mock).mock.calls[0][1];
    const { partialize } = persistOptions;

    const fullState: TestState = {
      count: 5,
      name: "Tester",
      internal: true,
      actions: { increment: () => {} },
    };

    const partialState = partialize(fullState);

    expect(partialState).toEqual({ count: 5, name: "Tester" });
    expect(partialState).not.toHaveProperty("internal");
    expect(partialState).not.toHaveProperty("actions");
  });

  it("test_creates_store_with_defaults_for_undefined_config", () => {
    createStore(storeCreator, { name: "default-store" });

    expect(persist).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const persistOptions = (persist as vi.Mock).mock.calls[0][1];

    expect(persistOptions.name).toBe("default-store");
    expect(createJSONStorage).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const storageFactory = (createJSONStorage as vi.Mock).mock.calls[0][0];
    expect(storageFactory()).toBe(localStorage);
  });

  it("test_persists_empty_object_when_all_keys_are_excluded", () => {
    createStore<TestState>(storeCreator, {
      name: "empty-store",
      excludeFromPersist: ["count", "name", "internal", "actions"],
    });

    expect(persist).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const persistOptions = (persist as vi.Mock).mock.calls[0][1];
    const { partialize } = persistOptions;

    const fullState: TestState = {
      count: 10,
      name: "Full State",
      internal: false,
      actions: { increment: () => {} },
    };

    const partialState = partialize(fullState);

    expect(partialState).toEqual({});
  });

  it("test_creates_persisted_store_with_custom_name_and_storage", () => {
    const customName = "my-custom-app-store";
    createStore(storeCreator, {
      name: customName,
      storage: sessionStorage,
    });

    expect(persist).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const persistOptions = (persist as vi.Mock).mock.calls[0][1];

    expect(persistOptions.name).toBe(customName);
    expect(createJSONStorage).toHaveBeenCalledOnce();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const storageFactory = (createJSONStorage as vi.Mock).mock.calls[0][0];
    expect(storageFactory()).toBe(sessionStorage);
  });

  it("test_throws_error_when_name_is_missing_and_persistence_enabled", () => {
    expect(() => {
      createStore(storeCreator, {});
    }).toThrow(
      "createStore: `config.name` is required when persistence is enabled to prevent storage key collisions."
    );

    expect(() => {
      createStore(storeCreator);
    }).toThrow(
      "createStore: `config.name` is required when persistence is enabled to prevent storage key collisions."
    );

    // Verify persist was never called when error is thrown
    expect(persist).not.toHaveBeenCalled();
  });
});
