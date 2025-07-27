import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { AlertDialogProvider } from "@/providers/alert-dialog-provider";
import { useGlobalStore } from "@/store/use-global-store";

const initialState = useGlobalStore.getState();

describe("AlertDialogProvider", () => {
  beforeEach(() => {
    useGlobalStore.setState(initialState, true);
  });

  it("Displays the alert dialog with custom content when `alertOpen` is true and `alertConfig` is provided.", () => {
    const customConfig = {
      title: "Custom Title",
      description: "This is a custom description.",
      confirmLabel: "Accept",
      cancelLabel: "Decline",
    };

    useGlobalStore.setState({
      alertOpen: true,
      alertConfig: customConfig,
    });

    render(<AlertDialogProvider />);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(customConfig.title)).toBeInTheDocument();
    expect(screen.getByText(customConfig.description)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: customConfig.confirmLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: customConfig.cancelLabel }),
    ).toBeInTheDocument();
  });

  it("Calls the `onConfirm` callback and closes the dialog when the confirm action is clicked.", async () => {
    const user = userEvent.setup();
    const onConfirmMock = vi.fn();

    useGlobalStore.setState({
      alertOpen: true,
      alertConfig: {
        onConfirm: onConfirmMock,
      },
    });

    render(<AlertDialogProvider />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("Calls the `onCancel` callback and closes the dialog when the cancel action is clicked.", async () => {
    const user = userEvent.setup();
    const onCancelMock = vi.fn();

    useGlobalStore.setState({
      alertOpen: true,
      alertConfig: {
        onCancel: onCancelMock,
      },
    });

    render(<AlertDialogProvider />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("Renders nothing (null) when the `alertOpen` state is false.", () => {
    useGlobalStore.setState({ alertOpen: false });

    const { container } = render(<AlertDialogProvider />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("Uses default text and labels when the `alertConfig` object is empty or not provided.", () => {
    useGlobalStore.setState({
      alertOpen: true,
      alertConfig: {},
    });

    render(<AlertDialogProvider />);

    expect(screen.getByText("Confirmation Required")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to perform this action?"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("Closes the dialog without error when `onConfirm` or `onCancel` callbacks are not provided.", async () => {
    const user = userEvent.setup();

    // Test confirm without callback
    useGlobalStore.setState({
      alertOpen: true,
      alertConfig: {},
    });

    const { rerender } = render(<AlertDialogProvider />);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    // Test cancel without callback
    useGlobalStore.setState({
      alertOpen: true,
      alertConfig: {},
    });

    rerender(<AlertDialogProvider />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
