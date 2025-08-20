import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Providers } from "@/providers/providers";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";

describe("<Providers />", () => {
  const MutationComponent = ({
    mutationFn,
    buttonText,
    mutationKey,
  }: {
    mutationFn: () => Promise<unknown>;
    buttonText: string;
    mutationKey: string;
  }) => {
    const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn });
    return <button onClick={() => mutate()}>{buttonText}</button>;
  };

  const ThemeComponent = () => {
    const { theme, setTheme } = useTheme();
    return (
      <div>
        <span data-testid="theme-value">Current theme: {theme}</span>
        <button onClick={() => setTheme("dark")}>Set Dark</button>
        <button onClick={() => setTheme("light")}>Set Light</button>
      </div>
    );
  };

  test("Renders children within providers", () => {
    render(
      <Providers>
        <div>Child Component</div>
      </Providers>,
    );
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  test("shows success toast on mutation success", async () => {
    render(
      <Providers>
        <MutationComponent
          mutationKey="success-test"
          mutationFn={() => Promise.resolve("ok")}
          buttonText="Trigger Success"
        />
      </Providers>,
    );

    fireEvent.click(screen.getByText("Trigger Success"));

    expect(
      await screen.findByText("Operation was successful"),
    ).toBeInTheDocument();
  });

  test("test_applies_system_default_theme", () => {
    render(
      <Providers>
        <ThemeComponent />
      </Providers>,
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent(
      "Current theme: system",
    );
  });

  test("test_nested_theme_provider_does_not_cause_conflicts", async () => {
    render(
      <Providers>
        <ThemeComponent />
      </Providers>,
    );

    expect(screen.getByTestId("theme-value")).toHaveTextContent(
      "Current theme: system",
    );

    fireEvent.click(screen.getByText("Set Dark"));

    await waitFor(() => {
      expect(screen.getByTestId("theme-value")).toHaveTextContent(
        "Current theme: dark",
      );
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  test("test_suppresses_toast_for_next_redirect_error", async () => {
    render(
      <Providers>
        <MutationComponent
          mutationKey="redirect-error-test"
          mutationFn={() => Promise.reject(new Error("NEXT_REDIRECT"))}
          buttonText="Trigger Redirect Error"
        />
      </Providers>,
    );

    fireEvent.click(screen.getByText("Trigger Redirect Error"));

    await waitFor(() => {
      expect(screen.queryByText("NEXT_REDIRECT")).toBeNull();
    });
  });

  test("test_shows_error_toast_on_generic_mutation_error", async () => {
    const errorMessage = "Something went wrong";
    render(
      <Providers>
        <MutationComponent
          mutationKey="generic-error-test"
          mutationFn={() => Promise.reject(new Error(errorMessage))}
          buttonText="Trigger Generic Error"
        />
      </Providers>,
    );

    fireEvent.click(screen.getByText("Trigger Generic Error"));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
