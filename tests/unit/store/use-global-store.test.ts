import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGlobalStore, alert } from "@/store/use-global-store";

type AlertConfig = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const initialState = useGlobalStore.getState();

describe("Alert", () => {
  beforeEach(() => {
    useGlobalStore.setState(initialState, true);
  });

  it("Alert updates store with full config", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const fullConfig: AlertConfig = {
      title: "Complete Alert",
      description: "This is a full configuration.",
      confirmLabel: "Yes",
      cancelLabel: "No",
      onConfirm,
      onCancel,
    };

    alert(fullConfig);

    const state = useGlobalStore.getState();
    expect(state.alertOpen).toBe(true);
    expect(state.alertConfig).toEqual(fullConfig);
  });

  it("Alert handles partial config", () => {
    const partialConfig: AlertConfig = {
      title: "Partial Alert",
    };

    alert(partialConfig);

    const state = useGlobalStore.getState();
    expect(state.alertOpen).toBe(true);
    expect(state.alertConfig).toEqual(partialConfig);
  });

  it("Alert handles empty config object", () => {
    const emptyConfig: AlertConfig = {};

    alert(emptyConfig);

    const state = useGlobalStore.getState();
    expect(state.alertOpen).toBe(true);
    expect(state.alertConfig).toEqual(emptyConfig);
  });

  it("Alert overwrites existing alert config", () => {
    const initialConfig: AlertConfig = { title: "First Alert" };
    alert(initialConfig);

    const newConfig: AlertConfig = {
      title: "Second Alert",
      description: "This should overwrite the first one.",
    };
    alert(newConfig);

    const state = useGlobalStore.getState();
    expect(state.alertOpen).toBe(true);
    expect(state.alertConfig).toEqual(newConfig);
    expect(state.alertConfig).not.toEqual(initialConfig);
  });

  it("Alert config is reset to null on close", () => {
    const config: AlertConfig = { title: "Temporary Alert" };

    alert(config);
    expect(useGlobalStore.getState().alertOpen).toBe(true);
    expect(useGlobalStore.getState().alertConfig).toEqual(config);

    useGlobalStore.getState().updateAlertOpen(false);

    const state = useGlobalStore.getState();
    expect(state.alertOpen).toBe(false);
    expect(state.alertConfig).toBeNull();
  });

  it("Alert correctly stores callback functions", () => {
    const onConfirmCallback = vi.fn();
    const onCancelCallback = vi.fn();
    const configWithCallbacks: AlertConfig = {
      onConfirm: onConfirmCallback,
      onCancel: onCancelCallback,
    };

    alert(configWithCallbacks);

    const state = useGlobalStore.getState();
    expect(state.alertOpen).toBe(true);
    expect(state.alertConfig).not.toBeNull();
    expect(state.alertConfig?.onConfirm).toBe(onConfirmCallback);
    expect(state.alertConfig?.onCancel).toBe(onCancelCallback);

    state.alertConfig?.onConfirm?.();
    expect(onConfirmCallback).toHaveBeenCalledTimes(1);

    state.alertConfig?.onCancel?.();
    expect(onCancelCallback).toHaveBeenCalledTimes(1);
  });
});
